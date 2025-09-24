import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Chart } from "react-chartjs-2";
import { userAPI } from "../../../service/api";

ChartJS.register(CategoryScale, LinearScale, MatrixController, MatrixElement, Tooltip, Legend);

type HeatmapPayload = {
  mvpaValueHeatmap: Record<string, Record<string, number>>;
  mvpaScoreHeatmap: Record<string, Record<string, number>>;
  lightValueHeatmap: Record<string, Record<string, number>>;
  lightScoreHeatmap: Record<string, Record<string, number>>;
};

const BIN_ORDER = ["0-600", "600-1200", "1200-1800", "1800-2400", "2400-3000", "3000-3600"];

type ImpactItem = {
  ts?: string | null;
  hour: number;
  weekday: number;
  bin: string;
  value?: number;  
  impact?: number; 
};

type ImpactResponse = {
  mvpa_impact: ImpactItem[];
  light_impact: ImpactItem[];
};

function convertHeatmapData(
  valueMap?: Record<string, Record<string, number>>,
  scoreMap?: Record<string, Record<string, number>>,
) {
  const data: Array<{ x: number; y: string; v: number; score: number }> = [];
  for (let hour = 0; hour < 24; hour++) {
    const h = String(hour);
    const vRow = valueMap?.[h] ?? {};
    const sRow = scoreMap?.[h] ?? {};
    for (const bin of BIN_ORDER) {
      data.push({
        x: hour,
        y: bin,
        v: vRow[bin] ?? 0,
        score: sRow[bin] ?? 0,
      });
    }
  }
  return data;
}

const cellBg = (ctx: any) => {
  const v = ctx.raw?.score ?? 0;
  if (v <= 0) {
    const t = v + 1;
    const r = Math.round(255 * t);
    const g = Math.round(255 * t);
    const b = 255;
    return `rgb(${r},${g},${b})`;
  } else {
    const t = v;
    const r = 255;
    const g = Math.round(255 * (1 - t));
    const b = Math.round(255 * (1 - t));
    return `rgb(${r},${g},${b})`;
  }
};

function toHourBinAggregates(items: ImpactItem[]) {
  const acc: Record<string, Record<string, { sv: number; si: number; c: number }>> = {};
  for (const it of items) {
    const h = String(it.hour ?? 0);
    const b = it.bin ?? BIN_ORDER[0];
    const v = Number.isFinite(it.value as number) ? (it.value as number) : 0;
    const s = Number.isFinite(it.impact as number) ? (it.impact as number) : 0;

    acc[h] ??= {};
    acc[h][b] ??= { sv: 0, si: 0, c: 0 };
    acc[h][b].sv += v; // sum value
    acc[h][b].si += s; // sum impact
    acc[h][b].c += 1;
  }

  const valueMap: Record<string, Record<string, number>> = {};
  const scoreMap: Record<string, Record<string, number>> = {};

  for (let hour = 0; hour < 24; hour++) {
    const h = String(hour);
    valueMap[h] = {};
    scoreMap[h] = {};
    for (const bin of BIN_ORDER) {
      const cell = acc[h]?.[bin];
      if (cell && cell.c > 0) {
        valueMap[h][bin] = cell.sv / cell.c; // v = value avg
        scoreMap[h][bin] = cell.si / cell.c; // score = impact avg
      } else {
        valueMap[h][bin] = 0;
        scoreMap[h][bin] = 0;
      }
    }
  }

  return { valueMap, scoreMap };
}

export default function HeatmapChart({ group }: { group: "weekdays" | "weekends" }) {
  const [payload, setPayload] = useState<HeatmapPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"mvpa" | "light">("mvpa");

  useEffect(() => {
    const sid = '3'; // TODO: 换成当前用户 id
    if (!sid) return;

    setLoading(true);
    userAPI
      .getHeatMapData({ sid })
      .then((res: { data: ImpactResponse } | ImpactResponse) => {
        const data = "data" in res ? res.data : res;
        // filter by group
        const isWeekend = (wd: number) => wd >= 5;
        const filterByGroup = (arr: ImpactItem[]) =>
          arr.filter((it) => (group === "weekends" ? isWeekend(it.weekday) : !isWeekend(it.weekday)));

        const mvpaAgg = toHourBinAggregates(filterByGroup(data.mvpa_impact));
        const lightAgg = toHourBinAggregates(filterByGroup(data.light_impact));

        setPayload({
          mvpaValueHeatmap: mvpaAgg.valueMap,
          mvpaScoreHeatmap: mvpaAgg.scoreMap,
          lightValueHeatmap: lightAgg.valueMap,
          lightScoreHeatmap: lightAgg.scoreMap,
        });
      })
      .catch((err) => console.error("Failed to fetch heatmap", err))
      .finally(() => setLoading(false));
  }, [group]);

  const chartData = useMemo(() => {
    if (!payload) return [];
    const valueMap = type === "mvpa" ? payload.mvpaValueHeatmap : payload.lightValueHeatmap;
    const scoreMap = type === "mvpa" ? payload.mvpaScoreHeatmap : payload.lightScoreHeatmap;
    return convertHeatmapData(valueMap, scoreMap);
  }, [payload, type]);

  const data = useMemo(
    () => ({
      datasets: [
        {
          label: `${group} ${type.toUpperCase()} Heatmap`,
          data: chartData,
          backgroundColor: cellBg,
          borderWidth: 1,
          width: 20,
          height: 20,
        },
      ],
    }),
    [chartData, type, group]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "linear" as const,
          min: 0,
          max: 23,
          ticks: {
            stepSize: 1,
            callback: (v: any) => `${v}:00`,
          },
          title: { display: true, text: "Hour of Day" },
          offset: true,
        },
        y: {
          type: "category" as const,
          labels: BIN_ORDER,
          title: { display: true, text: "Seconds (bins of 600s)" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const raw = ctx.raw as any;
              return `Hour ${raw.x}:00, Bin ${raw.y}, Avg=${raw.v.toFixed(1)}s`;
            },
            title: () => "",
          },
        },
      },
    }),
    []
  );

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1 rounded-lg text-sm ${type === "mvpa" ? "bg-gradient-to-r from-violet-300 to-blue-300 text-white" : "bg-gray-200"}`}
          onClick={() => setType("mvpa")}
        >
          MVPA
        </button>
        <button
          className={`px-3 py-1 rounded-lg text-sm ${type === "light" ? "bg-gradient-to-r from-violet-300 to-blue-300 text-white" : "bg-gray-200"}`}
          onClick={() => setType("light")}
        >
          Light
        </button>

        {loading && <span className="text-sm text-gray-500">Loading…</span>}
      </div>{loading && <span className="text-sm text-gray-500">Loading…</span>}

      <div style={{ width: "90%", height: 180 }}>
        <Chart type="matrix" data={data} options={options as any} />
      </div>
    </div>
  );
}
