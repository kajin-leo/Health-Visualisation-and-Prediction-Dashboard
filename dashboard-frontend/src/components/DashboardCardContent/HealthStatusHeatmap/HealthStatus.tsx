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
import { apiClient } from "../../../service/axios";

ChartJS.register(CategoryScale, LinearScale, MatrixController, MatrixElement, Tooltip, Legend);

type HeatmapPayload = {
  mvpaHeatmap: Record<string, Record<string, number>>;
  lightHeatmap: Record<string, Record<string, number>>;
};

const BIN_ORDER = ["0-600", "600-1200", "1200-1800", "1800-2400", "2400-3000", "3000-3600"];

function convertHeatmapData(heatmap?: Record<string, Record<string, number>>) {
  if (!heatmap) return [];
  const data: Array<{ x: number; y: string; v: number; score: number }> = [];
  for (let hour = 0; hour < 24; hour++) {
    const bins = heatmap[String(hour)] || {};
    for (const bin of BIN_ORDER) {
      const avg = bins[bin] ?? 0;
      data.push({
        x: hour,
        y: bin,
        v: avg,
        score: Math.random() * 2 - 1,
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

export default function HeatmapChart({ group }: { group: "weekdays" | "weekends" }) {
  const [payload, setPayload] = useState<HeatmapPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"mvpa" | "light">("mvpa");

  useEffect(() => {
    apiClient
      .get<HeatmapPayload>(`/workout/heatmap/${group}`)
      .then((res) => setPayload(res.data))
      .catch((err) => console.error("Failed to fetch heatmap", err));
  }, [group]); 

  const chartData = useMemo(() => {
    const selected = type === "mvpa" ? payload?.mvpaHeatmap : payload?.lightHeatmap;
    return convertHeatmapData(selected);
  }, [payload, type]);

  const data = useMemo(
    () => ({
      datasets: [
        {
          label: `${group} ${type.toUpperCase()} Heatmap`,
          data: chartData,
          backgroundColor: cellBg,
          borderWidth: 1,
        //   width: ({ chart }) => {
        //     const area = chart.chartArea || {};
        //     return area.width / 24 - 2;
        //   },
        //   height: ({ chart }) => {
        //     const area = chart.chartArea || {};
        //     return area.height / BIN_ORDER.length - 2;
        //   },
        width:20,
        height:20,
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
      <div className="flex items-center gap-2 flex-shrink-0">
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

      <div className="w-full h-full">
        <Chart type="matrix" data={data} options={options as any} />
      </div>
    </div>
  );
}
