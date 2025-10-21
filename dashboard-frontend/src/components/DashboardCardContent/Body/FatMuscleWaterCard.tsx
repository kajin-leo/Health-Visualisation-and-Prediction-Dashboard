import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import type { ChartOptions, TooltipItem } from "chart.js";
import { apiClient } from "../../../service/axios";
import { background } from "storybook/internal/theming";

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
                backgroundColor: ["#ff9900", "#f42754", "#06e3eb"],
                borderWidth: 0
            },
        ],
    };

    const options: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio:1,
        plugins: {
            legend: { position: "right",
                display: false,
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
        <div className="rounded-xl w-full h-full flex flex-col pb-5">
            <h1 className="w-fit opacity-100 rounded-lg text-gray-800 dark:text-gray-200 pl-1 text-lg tracking-tight font-bold font-[Nunito] flex-shrink-0 select-none">
                Body Composition
            </h1>
            <div className="flex gap-2 w-full h-full items-center justify-between p-4 flex-1">
                <div className=" min-w-0 h-full min-h-0 drop-shadow-lg">
                    <Pie data={chartData} options={options} className="dark:brightness-70 dark:saturate-100 dark:contrast-150"/>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0 pr-5">
                    {chartData.labels.map((label, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <div className="w-5 h-3 rounded-full border-1 border-black/20 shadow-md dark:brightness-70 dark:saturate-100 dark:contrast-150" style={{background: chartData.datasets[0].backgroundColor[index]}} />
                            <div>
                                <h1 className="text-md font-semibold">{label}</h1>
                                <h2 className="text-sm">{chartData.datasets[0].data[index].toFixed(2)}%</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    );
}
