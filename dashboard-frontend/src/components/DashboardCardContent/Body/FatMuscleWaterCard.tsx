import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import type { ChartOptions, TooltipItem } from "chart.js";
import { apiClient } from "../../../service/axios";

ChartJS.register(ArcElement, Tooltip, Legend);

type Resp = { fatPct: number; musclePct: number; waterPct: number; };

export default function FatMuscleWaterCard() {
    const [data, setData] = useState<Resp | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const r = await apiClient.get("/static/body-composition"); 
                setData(r.data as Resp);
            } catch (e) {
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
                backgroundColor: ["#ffdd01ff", "#4cc378ff", "#4596f4ff"],
                borderWidth: 2,
            },
        ],
    };

    const options: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "right",
                onClick: null },
            tooltip: {
                callbacks: {
                    label: (ctx: TooltipItem<'pie'>) => {
                        const label = ctx.label || '';
                        const parsedValue = typeof ctx.parsed === 'number' ? ctx.parsed : 0;
                        return `${label}: ${parsedValue.toFixed(1)}%`;
                    }
                    // label: (ctx: TooltipItem<'pie'>) => `${ctx.label}: ${ctx.parsed.toFixed(1)}%`,
                },
            },
        },
    };

    return (
        <div className="rounded-xl w-full h-full flex flex-col ">
            <h2 className="text-lg font-bold mb-6 ml-6">Body Composition</h2>
            <div className="w-[250px] h-[200px] mx-auto flex flex-col items-center justify-center gap-[10px] mb-6">
                <Pie data={chartData} options={options} />
            </div>
        </div>
    );
}
