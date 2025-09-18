import React, { useEffect, useMemo, useState } from "react";

/* ---------- Props ---------- */
type BmiCardProps = {
  bmi?: number;
  heightCm?: number;
  weightKg?: number;
  waistCm?: number;

  // 兼容别名
  height?: number;
  weight?: number;
  waist?: number;

  /** 传 true 时仅使用 props 渲染，不请求接口 */
  disableFetch?: boolean;

  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
};

/* ---------- API DTO（宽松） ---------- */
type BodyMetricsSummaryDTO = {
  bmi?: number;
  bmiValue?: number;
  bmi_category?: string;
  bmiCategory?: string;

  height?: number;
  heightCm?: number;
  height_cm?: number;

  weight?: number;
  weightKg?: number;
  weight_kg?: number;

  waist?: number;
  waistCm?: number;
  waist_cm?: number;
};

/* ---------- 内部统一结构 ---------- */
type Metrics = {
  bmi: number | null;
  bmiCategory: string | null;
  heightCm: number | null;
  weightKg: number | null;
  waistCm: number | null;
};

/* ---------- Utils ---------- */
function classifyBMI(bmi: number) {
  if (bmi < 18.5) return "Normal-Low";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}
function categoryColors(cat: string | null) {
  const c = (cat ?? "").toLowerCase();
  if (c.includes("normal") && c.includes("low")) return { bg: "bg-cyan-100", text: "text-cyan-700" };
  if (c.includes("normal")) return { bg: "bg-emerald-100", text: "text-emerald-700" };
  if (c.includes("over")) return { bg: "bg-amber-100", text: "text-amber-700" };
  if (!c) return { bg: "bg-gray-100", text: "text-gray-600" };
  return { bg: "bg-rose-100", text: "text-rose-700" };
}
function num(v: unknown): number | null {
  return typeof v === "number" && !Number.isNaN(v) ? v : null;
}
function pick(obj: any, keys: string[]): number | null {
  for (const k of keys) {
    const v = obj?.[k];
    if (typeof v === "number" && !Number.isNaN(v)) return v;
  }
  return null;
}

/* ---------- Arc Gauge ---------- */
const ArcGauge: React.FC<{
  value: number;
  min?: number;
  max?: number;
  size?: number;        // 宽度；高度= size/2
  strokeWidth?: number;
}> = ({ value, min = 10, max = 40, size = 220, strokeWidth = 12 }) => {
  const v = Math.min(Math.max(value, min), max);
  const pct = (v - min) / (max - min);

  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2;

  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const len = Math.PI * r;

  const angle = Math.PI * (1 - pct); // 左->右
  const knobX = cx + r * Math.cos(angle);
  const knobY = cy + r * Math.sin(angle);

  return (
    <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
      <path d={arcPath} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={strokeWidth} />
      <defs>
        <linearGradient id="bmiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <path
        d={arcPath}
        fill="none"
        stroke="url(#bmiGradient)"
        strokeWidth={strokeWidth}
        strokeDasharray={len}
        strokeDashoffset={(1 - pct) * len}
        strokeLinecap="round"
      />
      <circle cx={knobX} cy={knobY} r={strokeWidth / 2} fill="#8b5cf6" />
    </svg>
  );
};

/* ---------- 简洁三列 Tile（无徽标） ---------- */
const Tile: React.FC<{ label: string; value: string; unit?: string }> = ({ label, value, unit }) => {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-white/60 px-2 h-20 flex flex-col items-center justify-center text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="leading-tight mt-0.5">
        <span
          className="font-semibold text-gray-900"
          style={{ fontSize: "clamp(1.05rem, 2vw, 1.4rem)", lineHeight: 1.1 }}
        >
          {value}
        </span>
      </div>
      {unit ? <div className="text-[11px] text-gray-400 mt-0.5">{unit}</div> : null}
    </div>
  );
};

/* ---------- 主组件 ---------- */
const BmiCard: React.FC<BmiCardProps> = (props) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  // 先用 props 生成本地 metrics（有就用，不触发 fetch）
  const propMetrics: Metrics | null = useMemo(() => {
    const heightCm = num(props.heightCm ?? props.height);
    const weightKg = num(props.weightKg ?? props.weight);
    let bmi = num(props.bmi);

    if (bmi == null && heightCm != null && weightKg != null) {
      const m = heightCm / 100;
      bmi = +(weightKg / (m * m)).toFixed(1);
    }
    if (bmi == null && heightCm == null && weightKg == null && (props.waist ?? props.waistCm) == null) {
      return null; // 完全没给就返回 null，后面再决定要不要 fetch
    }

    const bmiCategory = bmi != null ? classifyBMI(bmi) : null;
    return {
      bmi,
      bmiCategory,
      heightCm,
      weightKg,
      waistCm: num(props.waistCm ?? props.waist),
    };
  }, [props.bmi, props.heightCm, props.height, props.weightKg, props.weight, props.waistCm, props.waist]);

  useEffect(() => {
    // 有 props 或 disableFetch => 直接用 props，不 fetch
    if (propMetrics || props.disableFetch) {
      setMetrics(propMetrics ?? { bmi: null, bmiCategory: null, heightCm: null, weightKg: null, waistCm: null });
      return;
    }

    // 否则尝试从后端拿
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/static/bodymetrics-overview");
        // 防止后端返回 HTML（登录页/错误页）
        const text = await res.text();
        let json: BodyMetricsSummaryDTO;
        try {
          json = JSON.parse(text);
        } catch {
          // 非 JSON：静默降级为占位符，不打断 UI
          if (!cancelled) setMetrics({ bmi: null, bmiCategory: null, heightCm: null, weightKg: null, waistCm: null });
          return;
        }

        const heightCm = pick(json, ["heightCm", "height_cm", "height"]);
        const weightKg = pick(json, ["weightKg", "weight_kg", "weight"]);
        let bmi = pick(json, ["bmi", "bmiValue"]);
        if (bmi == null && heightCm != null && weightKg != null) {
          const m = heightCm / 100;
          bmi = +(weightKg / (m * m)).toFixed(1);
        }
        const bmiCategory =
          (json.bmiCategory as string) ||
          (json.bmi_category as string) ||
          (bmi != null ? classifyBMI(bmi) : null);

        if (!cancelled) {
          setMetrics({
            bmi,
            bmiCategory,
            heightCm,
            weightKg,
            waistCm: pick(json, ["waistCm", "waist_cm", "waist"]),
          });
        }
      } catch {
        if (!cancelled) {
          setMetrics({ bmi: null, bmiCategory: null, heightCm: null, weightKg: null, waistCm: null });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [propMetrics, props.disableFetch]);

  // 渲染所需字段
  const bmiValue = metrics?.bmi ?? null;
  const bmiCategory = metrics?.bmiCategory ?? null;
  const h = metrics?.heightCm ?? null;
  const w = metrics?.weightKg ?? null;
  const waist = metrics?.waistCm ?? null;

  const catColor = categoryColors(bmiCategory);

  return (
    <div
      className={
        "w-full h-full flex flex-col items-center" +
        (props.className ?? "")
      }
      style={{ width: props.width, ...props.style }}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900">Body Metrics</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${catColor.bg} ${catColor.text}`}>
          {bmiCategory ?? "—"}
        </span>
      </div>

      {/* 上半：弧线（固定高） + 居中 BMI 数字（完全分区，不重叠） */}
      <div className=" flex flex-col items-center">
        <div className="h-[140px] w-full flex items-center justify-center">
          <ArcGauge value={bmiValue ?? 22} size={220} />
        </div>
        <div className="-mt-15 flex items-baseline gap-2">
          <div className="text-4xl font-bold leading-none text-gray-900">
            {bmiValue != null ? bmiValue.toFixed(1) : "—"}
          </div>
          <div className="text-xs text-gray-400">kg/m²</div>
        </div>
      </div>

      {/* 下半：固定三列，一排展示；无任何 badge */}
      <div className="grid grid-cols-3 gap-3 mt-5">
        <Tile label="Height" value={h != null ? h.toFixed(1) : "—"} unit="cm" />
        <Tile label="Weight" value={w != null ? w.toFixed(1) : "—"} unit="kg" />
        <Tile label="Waist" value={waist != null ? waist.toFixed(1) : "—"} unit="cm" />
      </div>
    </div>
  );
};

export default BmiCard;
