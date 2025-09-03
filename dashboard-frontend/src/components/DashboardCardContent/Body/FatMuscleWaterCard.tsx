import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { apiClient } from "../../../service/axios";

ChartJS.register(ArcElement, Tooltip, Legend);

type Resp = { fatPct: number; musclePct: number; waterPct: number; };

export default function FatMuscleWaterCard() {
    const [data, setData] = useState<Resp | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const r = await apiClient.get("/static/body-composition"); // 注意：你的 baseURL 已含 /api
                setData(r.data as Resp);
            } catch (e) {
                // 兜底 demo
                setData({ fatPct: 22, musclePct: 45, waterPct: 33 });
                console.error("body-composition api error:", e);
            }
        })();
    }, []);

    const chartData = {
        labels: ["Fat", "Muscle", "Water"],
        datasets: [
            {
                data: [data?.fatPct ?? 0, data?.musclePct ?? 0, data?.waterPct ?? 0],
                backgroundColor: ["#fca5a5", "#86efac", "#93c5fd"],
                borderColor: "#ffffff",
                borderWidth: 2,
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" },
            tooltip: {
                callbacks: {
                    label: (ctx: any) => `${ctx.label}: ${ctx.parsed.toFixed(1)}%`,
                },
            },
        },
    };

    return (
        <div className="rounded-xl bg-white/50 dark:bg-white/10 p-4 shadow-md w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-lg font-bold mb-2 text-center">Body Composition</h2>
            <div className="w-full h-full max-w-[250px] mx-auto">
                <Pie data={chartData} options={options} />
            </div>
        </div>
    );
}
