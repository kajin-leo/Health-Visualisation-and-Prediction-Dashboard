from flask import Flask, request, jsonify
import torch
import numpy as np
import pandas as pd
from utils import utils
from utils.hook_attcat import AttnHiddenCollector
from ts_transformer import TSTransformerEncoderClassiregressor
from data import Normalizer
import pickle

app = Flask(__name__)

CHECKPOINT = r"../checkpoints/model_best.pth"     # 你的ckpt路径
# CSV_PATH   = r"dashboard-ml/SYNTH_000410.csv"  # 这次要预测的那份CSV
ATTR_CSV   = r"C:/Users/wshiy/Desktop/USDY/COMP5703/data/CS79_1/individual_attributes.csv"


CLASS_NAMES = ["HFZ", "NIHR", "NI", "VL"]
NUM_CLASSES = len(CLASS_NAMES)
MAX_SEQ_LEN = 222          # 训练时用的序列对齐长度
CSV_HAS_HEADER = True     # 训练数据无表头就 False；有表头就 True
FEATURE_COLS = [2,4,6]   # 0-based 索引：示例=第3~8列
PAD_VALUE = 0.0
USE_STATIC = True

# ======= 读CSV =======
# df = pd.read_csv(CSV_PATH, header=0 if CSV_HAS_HEADER else None)

with open(r"../checkpoints/normalization.pickle", "rb") as f:
    norm_dict = pickle.load(f)

# 2. 用里面的参数初始化 Normalizer
normalizer = Normalizer(norm_dict["norm_type"],
                        mean=norm_dict.get("mean"),
                        std=norm_dict.get("std"),
                        min_val=norm_dict.get("min_val"),
                        max_val=norm_dict.get("max_val"))

# ======= 构建模型 & 载入权重 =======
device = "cuda" if torch.cuda.is_available() else "cpu"
model = TSTransformerEncoderClassiregressor(
    feat_dim=3, max_len=MAX_SEQ_LEN, d_model=64, n_heads=8, num_layers=3,
    dim_feedforward=256, num_classes=NUM_CLASSES,
    dropout=0.1, pos_encoding='fixed', activation='gelu', norm='BatchNorm', freeze=False,
    pooling='mean', static_features_dim=2 if USE_STATIC else 0
)
model = utils.load_model(model, CHECKPOINT)
model = model.to(device)
# ======= for collecting AttCAT =======
collector = AttnHiddenCollector(model, capture_grads=True, store_on_cpu=False).register()

@app.route("/predict", methods=["POST"])
def predict():
    
    file = request.files['file']
    df = pd.read_csv(file)
    feat = df.iloc[:, FEATURE_COLS].copy()
    feat.columns = ["f1", "f2", "f3"]
    feat = normalizer.normalize(feat)

    # ====== pad or truncate ======
    T = len(feat)
    L = MAX_SEQ_LEN
    if T >= L:
        feat = feat.iloc[:L, :].reset_index(drop=True)
    else:
        pad_rows = L - T
        pad_df = pd.DataFrame(PAD_VALUE, index=range(pad_rows), columns=feat.columns)
        feat = pd.concat([feat, pad_df], axis=0, ignore_index=True)

    valid_len = min(T, L)
    pad_len = L - valid_len
    padding_mask = torch.ones(L, dtype=torch.bool)
    if pad_len > 0:
        padding_mask[-pad_len:] = False
    padding_mask = padding_mask.unsqueeze(0).to(device)

    # ====== tensor ======
    x = torch.from_numpy(feat.values.astype(np.float32)).unsqueeze(0).to(device)
    x.requires_grad_(True)

    # ====== 读静态数据 ======
    sid = "SYNTH_000410"
    attr = pd.read_csv(ATTR_CSV)
    attr["ID"] = attr["participant_id"].astype(str)
    row = attr.set_index("ID").loc[sid]
    age = float(row["AGE"])
    is_female = 1.0 if int(row["sex (1 male 2 female)"]) == 2 else 0.0
    s_static = torch.tensor([[age, is_female]], dtype=torch.float32).to(device)

    # ====== forward ======
    model.eval()
    logits = model(x, padding_masks=padding_mask, static_features=s_static)
    probs = torch.softmax(logits, dim=1).detach().cpu().numpy().flatten().tolist()

    # ====== backward for AttCAT ======
    target = logits.gather(1, logits.argmax(1, keepdim=True)).sum()
    model.zero_grad(set_to_none=True)
    target.backward()

    attns  = [d['weights'] for d in collector.attn_per_layer]   # 每层注意力
    hiddens = [rec['output'] for rec in collector.hidden_per_layer]

    cats = []
    for h in hiddens:
        g = h.grad
        if h.shape[0] != x.shape[0]:  # [T,B,D] → [B,T,D]
            h = h.permute(1,0,2).contiguous()
            g = g.permute(1,0,2).contiguous()
        cats.append(h * g)   # [B,T,D]

    # ====== token-level impact，每个特征单独保留 ======
    att_scores = []
    for cat, attn in zip(cats, attns):
        # cat: [B,T,D], attn: [B,H,T,T]
        a = attn.mean(1)   # [B,T,T]
        a = a.mean(1)      # [B,T]，每个 token 的平均注意力
        # 把注意力扩展到特征维度
        a = a.unsqueeze(-1)   # [B,T,1]
        score = (cat * a).squeeze(0).detach().cpu().numpy()  # [T,D]
        att_scores.append(score)

    impact = np.sum(att_scores, axis=0)  # [T,D]，D=3
    # 归一化 [-1,1]
    vmax = np.percentile(np.abs(impact), 99)
    if vmax == 0: vmax = 1e-6
    impact = np.clip(impact, -vmax, vmax) / vmax
    impact = impact[:valid_len, :].tolist()  # [T,3]

    return jsonify({
        "probs": {cls: prob for cls, prob in zip(CLASS_NAMES, probs)},
        "impact": impact
    })
