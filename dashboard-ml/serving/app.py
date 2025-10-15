from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import numpy as np
import pandas as pd
from utils import utils
from utils.hook_attcat import AttnHiddenCollector
from ts_transformer import TSTransformerEncoderClassiregressor
from data import Normalizer
import pickle
import os
from sqlalchemy import create_engine, text
from threading import Lock

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

CHECKPOINT = r"../checkpoints/model_best.pth"     # ckpt路径
# CSV_PATH   = r"dashboard-ml/SYNTH_000410.csv"  # 这次要预测的那份CSV
# ATTR_CSV   = r"C:/Users/wshiy/Desktop/USDY/COMP5703/data/CS79_1/individual_attributes.csv"


CLASS_NAMES = ["HFZ", "NIHR", "NI", "VL"]
NUM_CLASSES = len(CLASS_NAMES)
MAX_SEQ_LEN = 222       
CSV_HAS_HEADER = True   
PAD_VALUE = 0.0
USE_STATIC = True

with open(r"../checkpoints/normalization.pickle", "rb") as f:
    norm_dict = pickle.load(f)

normalizer = Normalizer(norm_dict["norm_type"],
                        mean=norm_dict.get("mean"),
                        std=norm_dict.get("std"),
                        min_val=norm_dict.get("min_val"),
                        max_val=norm_dict.get("max_val"))

device = "cuda" if torch.cuda.is_available() else "cpu"
model = TSTransformerEncoderClassiregressor(
    feat_dim=3, max_len=MAX_SEQ_LEN, d_model=64, n_heads=8, num_layers=4,
    dim_feedforward=512, num_classes=NUM_CLASSES,
    dropout=0.1, pos_encoding='fixed', activation='gelu', norm='BatchNorm', freeze=False,
    pooling='mean', static_features_dim=2 if USE_STATIC else 0
)
model = utils.load_model(model, CHECKPOINT)
model = model.to(device)
# ======= for collecting AttCAT =======
collector = AttnHiddenCollector(model, capture_grads=True, store_on_cpu=False).register()

DB_URL = "postgresql+psycopg2://cs79dashboard:interactivedashboard_cs79-1@host.docker.internal:5480/cs79-dashboard"
engine = create_engine(DB_URL, pool_pre_ping=True, future=True)
def load_timeseries_from_db(sid: int, table_name: str = "workout_amount") -> pd.DataFrame:
    sql = text(f"""
        SELECT date_time as ts, sum_seconds_light3 as f3, sum_secondsmvpa3 as f1, sum_secondssed60 as f2
        FROM {table_name}
        WHERE user_id = :sid
        ORDER BY ts ASC
    """)
    df = pd.read_sql(sql, con=engine, params={"sid": sid})
    if df.empty:
        raise ValueError(f"No timeseries found for sid={sid}")

    return df[["ts", "f1", "f2", "f3"]]

def load_attrs_from_db(sid: int, table_name: str = "users"):
    sql = text(f"""
        SELECT age_year as age, sex
        FROM {table_name}
        WHERE id = :sid
        LIMIT 1
    """)
    df = pd.read_sql(sql, con=engine, params={"sid": sid})
    if df.empty:
        raise ValueError(f"No attributes found for sid={sid}")
    age = float(df.loc[0, "age"])
    is_female = 1.0 if int(df.loc[0, "sex"]) == 2 else 0.0
    return age, is_female


ATTN_LOCK = Lock()
def _reset_collector():
    try:
        collector.attn_per_layer.clear()
        collector.hidden_per_layer.clear()
    except Exception:
        pass
def _zero_out_model_grads():
    try:
        model.zero_grad(set_to_none=True)
    except Exception:
        pass

@app.route("/api/predict", methods=["GET"])
def predict():

    sid = (request.values.get("sid")
           or (request.json.get("sid") if request.is_json else None))
    if not sid:
        return jsonify({"error": "missing 'sid'"}), 400

    try:
        df = load_timeseries_from_db(sid)      # return f1,f2,f3
        df["ts"] = pd.to_datetime(df["ts"], errors="coerce")
        age, is_female = load_attrs_from_db(sid)
    except Exception as e:
        return jsonify({"error": str(e)}), 404

    feat = df[["f1", "f2", "f3"]].copy()
    feat.columns = ["f1", "f2", "f3"]

    # ====== normalizer ======
    feat = normalizer.normalize(feat)

    # ====== pad or truncate ======
    T = len(feat)
    L = MAX_SEQ_LEN
    if T >= L:
        feat = feat.iloc[:L, :].reset_index(drop=True)
        timeline = df["ts"].iloc[:L].reset_index(drop=True)
    else:
        pad_rows = L - T
        pad_df = pd.DataFrame(PAD_VALUE, index=range(pad_rows), columns=feat.columns)
        feat = pd.concat([feat, pad_df], axis=0, ignore_index=True)
        timeline = pd.concat([df["ts"], pd.Series([pd.NaT]*pad_rows)], ignore_index=True)

    valid_len = min(T, L)
    pad_len = L - valid_len
    padding_mask = torch.ones(L, dtype=torch.bool)
    if pad_len > 0:
        padding_mask[-pad_len:] = False
    padding_mask = padding_mask.unsqueeze(0).to(device)

    # ====== tensor ======
    x = torch.from_numpy(feat.values.astype(np.float32)).unsqueeze(0).to(device)
    x.requires_grad_(True)

    # ====== static data ======
    s_static = torch.tensor([[age, is_female]], dtype=torch.float32).to(device)

    # ====== forward ======
    model.eval()
    with torch.no_grad(): 
        logits = model(x, padding_masks=padding_mask, static_features=s_static)
    probs = torch.softmax(logits, dim=1).detach().cpu().numpy().flatten().tolist()

    with ATTN_LOCK:
        _reset_collector()
        _zero_out_model_grads() 

        with torch.enable_grad(): 
            logits = model(x.requires_grad_(True), padding_masks=padding_mask, static_features=s_static)
            # ====== backward for AttCAT ======
            HEALTHY = {"HFZ", "VL"}
            UNHEALTHY = {"NI", "NIHR"}
            healthy_idx   = [i for i, name in enumerate(CLASS_NAMES) if name in HEALTHY]
            unhealthy_idx = [i for i, name in enumerate(CLASS_NAMES) if name in UNHEALTHY]
            target = logits[:, healthy_idx].mean() - logits[:, unhealthy_idx].mean()
            model.zero_grad(set_to_none=True)
            target.backward()

            attns  = [d['weights'] for d in collector.attn_per_layer]
            hiddens = [rec['output'] for rec in collector.hidden_per_layer]

            cats = []
            for h in hiddens:
                g = h.grad
                if h.shape[0] != x.shape[0]:  # [T,B,D] → [B,T,D]
                    h = h.permute(1,0,2).contiguous()
                    g = g.permute(1,0,2).contiguous()
                cats.append(h * g)   # [B,T,D]

            att_scores = []
            for cat, attn in zip(cats, attns):
                a = attn.mean(1).mean(1).unsqueeze(-1)  # [B,T,1]
                score = (cat * a).squeeze(0).detach().cpu().numpy()  # [T,D]
                att_scores.append(score)

            attcat_td = np.sum(att_scores, axis=0)      # [T,D]
            w_time = np.abs(attcat_td).mean(axis=1)     # [T] time_weight
            if w_time.max() > 0:
                w_time = w_time / (w_time.max() + 1e-6)

            # ====== direction ======
            dX = x.grad.detach().cpu().numpy()[0]       # [T,C]
            dX_valid = dX[:valid_len, :]                # [valid_len, C]
            w_valid  = w_time[:valid_len][:, None]      # [valid_len, 1]

            # ====== direction × time_weight ======
            impact = dX_valid * w_valid                 # [valid_len, C]

            vmax = np.percentile(np.abs(impact), 99)
            if vmax == 0: vmax = 1e-6
            impact = np.clip(impact, -vmax, vmax) / vmax
            impact = impact[:valid_len, :]               # [valid_len, 3]
            timeline_valid = timeline[:valid_len]
            MVPA_IDX = 0
            LIGHT_IDX = 2
            mvpa_vals  = df["f1"].iloc[:valid_len].tolist()
            light_vals = df["f3"].iloc[:valid_len].tolist()
            BIN_EDGES = [(0,600), (600,1200), (1200,1800), (1800,2400), (2400,3000), (3000,3600)]
            BIN_LABELS = [f"{lo}-{hi}" for (lo,hi) in BIN_EDGES]

            def _num(x):
                try:
                    return None if (x is None or pd.isna(x)) else float(x)
                except Exception:
                    return None
            
            def sec_to_bin_label(v: int):
                if v is None:
                    return None
                try:
                    x = float(v)
                except Exception:
                    return None
                for (lo, hi), lab in zip(BIN_EDGES, BIN_LABELS):
                    if lo <= x < hi:
                        return lab
                return BIN_LABELS[-1]

            hours    = timeline_valid.dt.hour.fillna(-1).astype(int).tolist()     
            weekdays = timeline_valid.dt.weekday.fillna(-1).astype(int).tolist()  
            # ts_iso   = [ _to_iso(t) for t in timeline_valid ]

            mvpa_impact = [
                # {"ts": ts_iso[i],
                {"value": _num(mvpa_vals[i]), "impact": float(impact[i, MVPA_IDX]), "hour": int(hours[i]), "weekday": int(weekdays[i]), "bin": sec_to_bin_label(mvpa_vals[i])}
                for i in range(valid_len)
            ]
            light_impact = [
                # {"ts": ts_iso[i], 
                {"value": _num(light_vals[i]), "impact": float(impact[i, LIGHT_IDX]),"hour": int(hours[i]), "weekday": int(weekdays[i]), "bin": sec_to_bin_label(light_vals[i])}
                for i in range(valid_len)
            ]
    _zero_out_model_grads()
    _reset_collector()

    return jsonify({
        "sid": sid,
        "probs": {cls: prob for cls, prob in zip(CLASS_NAMES, probs)},
        "mvpa_impact": mvpa_impact,
        "light_impact": light_impact
    })

@app.route("/api/predict", methods=["POST"])
def simulate_predict():
    data = request.get_json(silent=True) or {}

    sid = data.get("userId")
    if not sid:
        return jsonify({"error": "missing 'sid' or 'userId'"}), 400

    is_weekdays = data.get("isWeekdays", data.get("is_weekday", True))
    is_weekdays = bool(is_weekdays)

    def _parse_hour_pct_map(obj):
        out = {}
        if isinstance(obj, dict):
            for k, v in obj.items():
                try:
                    h = int(k)
                    if 0 <= h <= 23:
                        out[h] = float(v)  # percentage
                except Exception:
                    pass
        return out

    mvpa_pct  = _parse_hour_pct_map(data.get("mvpa", {}) or {})
    light_pct = _parse_hour_pct_map(data.get("light", {}) or {})

    try:
        if sid:
            df = load_timeseries_from_db(sid)
            age, is_female = load_attrs_from_db(sid)
        df["ts"] = pd.to_datetime(df["ts"], errors="coerce")
    except Exception as e:
        return jsonify({"error": str(e)}), 404

    weekday_idx = df["ts"].dt.weekday
    day_mask = (weekday_idx < 5) if is_weekdays else (weekday_idx >= 5)
    hours = df["ts"].dt.hour
    CLIP_MIN, CLIP_MAX = 0.0, 3600.0

    def _apply_pct_by_hour(series: pd.Series, pct_map: dict):
        """
        adjust data by percentage
        """
        s = series.copy().astype(float)
        for h, pct in pct_map.items():
            factor = float(pct)
            mask = day_mask & (hours == int(h))
            if not mask.any():
                continue
            s.loc[mask] = (s.loc[mask] * factor)
            s.loc[mask] = s.loc[mask].clip(CLIP_MIN, CLIP_MAX).fillna(0.0)
        return s

    # f1=mvpa, f3=light
    if mvpa_pct:
        df["f1"] = _apply_pct_by_hour(df["f1"], mvpa_pct)
    if light_pct:
        df["f3"] = _apply_pct_by_hour(df["f3"], light_pct)
    feat = df[["f1", "f2", "f3"]].copy()
    feat.columns = ["f1", "f2", "f3"]
    feat = normalizer.normalize(feat)

    # ===== pad / truncate & mask =====
    T, L = len(feat), MAX_SEQ_LEN
    if T >= L:
        feat = feat.iloc[:L, :].reset_index(drop=True)
    else:
        pad_rows = L - T
        pad_df = pd.DataFrame(PAD_VALUE, index=range(pad_rows), columns=feat.columns)
        feat = pd.concat([feat, pad_df], axis=0, ignore_index=True)

    valid_len = min(T, L)
    padding_mask = torch.ones(L, dtype=torch.bool)
    if L - valid_len > 0:
        padding_mask[-(L - valid_len):] = False
    padding_mask = padding_mask.unsqueeze(0).to(device)

    # ===== tensor & static =====
    x = torch.from_numpy(feat.values.astype(np.float32)).unsqueeze(0).to(device)
    s_static = torch.tensor([[float(age), float(is_female)]], dtype=torch.float32).to(device)

    # ===== model inference =====
    model.eval()
    with torch.inference_mode():
        logits = model(x, padding_masks=padding_mask, static_features=s_static)
        probs_t = torch.softmax(logits, dim=1)           # [1, C]
        top_prob, top_idx = probs_t.squeeze(0).max(dim=0)
        top_label = CLASS_NAMES[int(top_idx)]
        top_prob  = float(top_prob.cpu().item())

    top_prob = round(top_prob*100, 2) # round to xx.xx

    return jsonify({
        "classification": top_label,
        "probability": top_prob
    })