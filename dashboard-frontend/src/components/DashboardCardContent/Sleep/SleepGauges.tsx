import React, { useEffect, useState, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { apiClient } from "../../../service/axios";

ChartJS.register(ArcElement, Tooltip, Legend);

type ApiResp = {

    thisWeekAvgMin: number;
    schoolNightAvgHrs: number;
    weekendNightAvgHrs: number;
};

const MAX_MINUTES = 720;

function mkGaugeData(valueMin: number) {
    const v = Math.max(0, Math.min(MAX_MINUTES, valueMin)); // clamp
    return {
        datasets: [
            {
                data: [v, MAX_MINUTES - v],
                backgroundColor: ["#9fa0dc", "#aac8ef"],
                borderWidth: 0,
                cutout: "65%",
                circumference: 180,
                rotation: -90,
            },
        ],
    };
}

const gaugeOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
};

function minutesToLabel(mins: number | undefined) {
    if (mins == null) return "—";
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${h}h ${m}m`;
}

export default function SleepGauges() {
    const [data, setData] = useState<ApiResp | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const resp = await apiClient.get("/static/sleep-summary");
                setData(resp.data as ApiResp);
            } catch {

                setData({
                    thisWeekAvgMin: 462,
                    schoolNightAvgHrs: 8.5,
                    weekendNightAvgHrs: 9.0,
                });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const thisWeekMin = data?.thisWeekAvgMin ?? 0;
    const schoolMin = (data?.schoolNightAvgHrs ?? 0) * 60;
    const weekendMin = (data?.weekendNightAvgHrs ?? 0) * 60;

    const cards = useMemo(() => ([
        { title: "Average Night", value: thisWeekMin },
        { title: "School Night", value: schoolMin },
        { title: "Weekend Night", value: weekendMin },
    ]), [thisWeekMin, schoolMin, weekendMin]);

    return (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-3">
            {cards.map((c) => (
                <div key={c.title} className="relative rounded-xl p-3 bg-white/50 dark:bg-white/10 flex flex-col items-center">
                    <div className="h-28 w-full relative flex items-center justify-center">
                        <Doughnut data={mkGaugeData(c.value)} options={gaugeOptions} />

                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                            <div className="flex items-baseline space-x-1">
                                <span className="text-2xl font-bold leading-tight">
                                    {Math.floor(c.value / 60)}h
                                </span>
                                <span className="text-base opacity-70">
                                    {Math.round(c.value % 60)}m
                                </span>
                            </div>
                        </div>
                    </div>


                    <div className="mt-2 text-sm font-bold text-center">{c.title}</div>
                    <div className="mt-5 text-xs text-center opacity-70">
                        {Math.round(c.value)}min
                    </div>
                </div>
            ))}
        </div>
    );
}
