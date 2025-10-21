import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Chart } from "chart.js/auto";
import { Spinner } from "@heroui/react";

ChartJS.register(CategoryScale, LinearScale, MatrixController, MatrixElement, Tooltip, Legend);

type HeatmapPayload = {
  value: Record<string, Record<string, number>>;
  score: Record<string, Record<string, number>>;
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
  if (v === 0) {
    return `rgba(0, 0, 0, 0)`;
  }
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

export default function HeatmapChart({ weekend, activityType, rawdata }: { weekend: boolean, activityType?: "mvpa" | "light", rawdata: any }) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [payload, setPayload] = useState<any>(null);
  const [isDataReady, setIsDataReady] = useState(false);

  const [chartColor, setChartColor] = useState({ text: '', line: '' });

    useEffect(() => {
        const updateChartColors = () => {
            const styles = getComputedStyle(document.documentElement);
            setChartColor({
                text: `hsl(${styles.getPropertyValue("--heroui-chartText")})` || "#d9d9d9ff",
                line: `hsl(${styles.getPropertyValue("--heroui-chartLine")})` || "#d9d9d9ff"
            });
        }

        updateChartColors();

        const observer = new MutationObserver(updateChartColors);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

  const setChartData = async (data) => {
    const isWeekend = (wd: number) => wd >= 5;
    const filterByGroup = (arr: ImpactItem[]) =>
      arr.filter((it) => (weekend ? isWeekend(it.weekday) : !isWeekend(it.weekday)));

    const aggregate = toHourBinAggregates(filterByGroup(data));
    console.log("aggregate", aggregate);

    const newPayload = {
      value: aggregate.valueMap,
      score: aggregate.scoreMap
    };

    setPayload(newPayload);
  }

  useEffect(() => {
    setIsDataReady(false);
    if(!rawdata) {
      setPayload(null);
      return;
    }

    setChartData(rawdata);
  }, [weekend, rawdata]);

  useEffect(() => {
    if (!payload) {
      console.log("payload is null");
      return;
    }
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const data = {
      datasets: [
        {
          label: `${weekend ? 'Weekend' : 'Weekdays'} ${activityType!.toUpperCase()} Heatmap`,
          data: convertHeatmapData(payload!.value, payload!.score),
          backgroundColor: cellBg,
          borderWidth: 1,
          width: 20,
          height: 20,
        },
      ],
    };

    chartInstance.current = new Chart(ctx, {
      type: 'matrix',
      data: data,
      options: {
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
              color: chartColor.text
            },
            title: { display: true, text: "Hour of Day" },
            offset: true,
            grid: {
              display: false,
              color: chartColor.line
            },
            border: {
              display: false,
              color: chartColor.line
            },
          },
          y: {
            type: "category" as const,
            labels: BIN_ORDER,
            title: { display: true, text: "Seconds (bins of 600s)" },
            grid: {
              display: false,
              color: chartColor.line
            },
            border: {
              display: false,
              color: chartColor.line
            },
            ticks: {
              color: chartColor.text
            }
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
          dragData: false,
        },
      }
    });

    setIsDataReady(true);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    }
  }, [payload, weekend, activityType])

  return (
    <div className="w-full h-full flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-shrink-0 flex-col">

          <h2 className="text-sm px-1 font-serif">
            {activityType === "mvpa" ? "MVPA" : "Light"}
          </h2>
        </div>

        <div style={{ width: "90%", height: 180 }}>
          <canvas ref={chartRef} />
        </div>
    </div>
  );
}


export type { ImpactItem }