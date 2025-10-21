import React, { useEffect, useMemo, useState } from "react";
import { apiClient } from "../../../service/axios";
import { Spinner } from "@heroui/react";

type CategoryColor = {
    bg: string;
    text: string;
}

const categoryColors = (classification: string) => {
    const catColor: CategoryColor = { bg: 'bg-white', text: 'text-black' };
    switch (classification) {
        case 'HFZ':
            catColor.bg = 'bg-green-300/50 dark:bg-green-800/60';
            catColor.text = 'text-green-600 dark:text-green-300';
            break;
        case 'NIHR':
            catColor.bg = 'bg-red-300/50 dark:bg-red-800/50';
            catColor.text = 'text-red-600 dark:text-red-300';
            break;
        case 'NI':
            catColor.bg = 'bg-orange-300/50 dark:bg-orange-700/50';
            catColor.text = 'text-orange-600 dark:text-orange-300';
            break;
        case 'VL':
            catColor.bg = 'bg-lime-300/50 dark:bg-lime-700/50';
            catColor.text = 'text-lime-600 dark:text-lime-300';
            break;
        default:
            catColor.bg = 'bg-gray-200/50 dark:bg-gray-800/50';
            catColor.text = 'text-gray-600 dark:text-gray-300'
    }
    return catColor;
}

/* ---------- 内部统一结构 ---------- */
type Metrics = {
    height: number;
    weight: number;
    waistSize: number;
    bmi: number;
    classification: string;
};

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
        <svg width={size} height={size / 2.5} viewBox={`0 0 ${size} ${size / 2}`}>
            <path d={arcPath} fill="none" stroke="rgba(0, 0, 0, 0.169)" strokeWidth={strokeWidth} />
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
        <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-white/60 dark:border-white/20 px-2 h-20 flex flex-col items-center justify-center text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
            <div className="leading-tight mt-0.5">
                <span
                    className="font-semibold text-gray-900 dark:text-white/80"
                    style={{ fontSize: "clamp(1rem, 1.5vw, 1rem)", lineHeight: 1.1 }}
                >
                    {value}
                </span>
            </div>
            {unit ? <div className="text-[11px] text-gray-400 mt-0.5">{unit}</div> : null}
        </div>
    );
};

/* ---------- 主组件 ---------- */
const BmiCard = ({ mock, ...props }: { mock?: Metrics, props?: React.ReactNode }) => {
    const [metrics, setMetrics] = useState<Metrics>();
    const [catColor, setColor] = useState(categoryColors('-'));
    const [dataReady, setDataReady] = useState(false);

    const fetch = async () => {
        try {
            const response = await apiClient.get('/static/bodymetrics-overview');
            const data = response.data;
            console.log("BMICard", data);
            setMetrics(data);
            setColor(categoryColors(data!.classification));
            setDataReady(true);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!mock) fetch();
        else setMetrics(mock);
    }, [mock]);

    if (!dataReady) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <Spinner />
            </div>
        )
    }

    return (
        <div
            className={
                "w-full h-full flex flex-col items-center justify-between"
            }
        >
            {/* Header */}
            <div className="flex items-center justify-end w-full">
                {/* <h1 className="w-fit opacity-100 rounded-lg text-gray-800 pl-1 tracking-tight text-lg font-bold font-[Nunito] flex-shrink-0">
                    Body Metrics
                </h1> */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${catColor.bg} ${catColor.text} shadow-sm outline-1 outline-white/40 dark:outline-gray-900/80`}>
                    {metrics?.classification ?? "—"}
                </div>
            </div>

            {/* 上半：弧线（固定高） + 居中 BMI 数字（完全分区，不重叠） */}
            <div className=" flex flex-col items-center">
                <div className="h-fit w-full flex items-center justify-center">
                    <ArcGauge value={metrics?.bmi ?? 22} size={220} />
                </div>
                <div className="-mt-10 flex items-baseline gap-2">
                    <div className="text-4xl font-bold leading-none text-gray-900 dark:text-white/90">
                        {metrics?.bmi != null ? metrics.bmi.toFixed(1) : "—"}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-white/80">kg/m²</div>
                </div>
            </div>

            {/* 下半：固定三列，一排展示；无任何 badge */}
            <div className="grid grid-cols-3 gap-3 mt-5">
                <Tile label="Height" value={metrics?.height != null ? metrics.height.toFixed(1) : "—"} unit="cm" />
                <Tile label="Weight" value={metrics?.weight != null ? metrics.weight.toFixed(1) : "—"} unit="kg" />
                <Tile label="Waist" value={metrics?.waistSize != null ? metrics.waistSize.toFixed(1) : "—"} unit="cm" />
            </div>
        </div>
    );
};

export default BmiCard;
