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
    maintainAspectRatio: true,
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
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-1">
            {cards.map((c) => (
                <div key={c.title} className="h-full rounded-xl px-1 py-2 bg-white/50 dark:bg-black/40 flex flex-col justify-center items-center inset-shadow-sm/10 outline-1 outline-gray-200 dark:outline-gray-800/80">
                    <div className="w-full relative flex flex-col items-center justify-center">
                        <Doughnut data={mkGaugeData(c.value)} options={gaugeOptions} className="dark:brightness-70 dark:saturate-120 dark:contrast-150"/>
                        <div className="flex px-1 flex-col -mt-2 items-center justify-end pb-2">
                            <div className="flex items-baseline space-x-1">
                                <span className="text-xl font-bold leading-tight">
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
