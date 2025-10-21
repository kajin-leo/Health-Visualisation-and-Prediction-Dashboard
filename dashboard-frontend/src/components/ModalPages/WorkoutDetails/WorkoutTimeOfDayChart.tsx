import { useEffect, useRef, useState } from "react";
import { type TimeOfDayDetail } from "./WorkoutDetails";
import { Chart } from "chart.js/auto";

const WorkoutTimeOfDayChart = ({data, showTooltips} : {data: TimeOfDayDetail[], showTooltips? : boolean}) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    const [chartColor, setChartColor] = useState({text:'', line: ''});

    useEffect(()=>{
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
                labels: data.map(item => item.dayOfWeek.charAt(0) + item.dayOfWeek.slice(1).toLowerCase()),
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
                        labels: {
                            color: chartColor.text
                        }
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
                        ticks: {
                            color: chartColor.text
                        },
                        grid: {
                            color: chartColor.line
                        }
                    }, 
                    x: {
                        grid: {
                            color: chartColor.line
                        },
                        ticks: {
                            color: chartColor.text
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, chartColor]);

    return (
        <div className="w-full h-full relative min-h-100">
            {
                data.length > 0 ? (<canvas ref={chartRef} ></canvas>) : (<></>)
            }
        </div>
    );
}

export default WorkoutTimeOfDayChart;