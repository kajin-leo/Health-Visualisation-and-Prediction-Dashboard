import { useEffect, useRef, useState } from "react";
import { type DailyDetail } from "./WorkoutDetails";
import { Chart } from "chart.js/auto";



const SimulateActivity = ({data, showTooltips} : {data: DailyDetail[], showTooltips? : boolean}) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.timeSegmentStarting),
                datasets: [
                    {
                        label: 'MVPA',
                        data: data.map(item => item.mvpa),
                        borderColor: 'rgba(247, 128, 37, 1)',
                        backgroundColor: 'rgba(250, 160, 5, 0.6)',
                        fill: true,
                        tension: 0.4,
                    },
                    {
                        label: 'Light Activity',
                        data: data.map(item => item.light),
                        borderColor: 'rgba(152, 214, 19, 1)',
                        backgroundColor: 'rgba(217, 247, 131, 0.6)',
                        fill: true,
                        tension: 0.4,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: 'Workout Overview',
                    },
                    tooltip: {
                        enabled: showTooltips ? showTooltips : false
                    },
                    dragData: false
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return (
        <div className="w-full h-full relative min-h-100">
            {
                data.length > 0 ? (<canvas ref={chartRef} ></canvas>) : (<></>)
            }
        </div>
    );
}

export default SimulateActivity;