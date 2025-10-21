import { useEffect, useRef, useState } from 'react';
import 'chartjs-plugin-dragdata';
import { Chart } from "chart.js/auto";
import { type ActivityData } from './SimulateActivity';

const SimulateActivityChart = ({ data, DragEndCallback, resetTrigger }: { data: ActivityData, DragEndCallback?: (datasetIndex: number, index: number, value: number) => void, resetTrigger: number }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const [upLimit, setUpLimit] = useState(Math.min(600, Number(((Math.max(...data.mvpa, ...data.light) + 300) / 1000).toFixed(1)) * 1000));
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

    useEffect(() => {
        if (!chartRef.current) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
            chartInstance.current = null;
        }

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        setUpLimit(Math.min(600, Number(((Math.max(...data.mvpa, ...data.light) + 300) / 1000).toFixed(1)) * 1000));



        const chartData = {
            labels: [...data.description],
            datasets: [
                {
                    label: 'MVPA',
                    data: [...data.mvpa],
                    borderColor: 'rgba(247, 128, 37, 1)',
                    backgroundColor: 'rgba(250, 160, 5, 0.6)',
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Light Activity',
                    data: [...data.light],
                    borderColor: 'rgba(152, 214, 19, 1)',
                    backgroundColor: 'rgba(217, 247, 131, 0.6)',
                    fill: true,
                    tension: 0.4,
                }
            ]
        }

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: chartData,
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
                        enabled: true
                    },
                    dragData: {
                        round: 0,
                        dragX: false,
                        dragY: true,
                        onDragEnd: (e, datasetIndex, index, value) => {
                            // console.log('Drag End:', { index, value });
                            // setDragIndex(-1);

                            const numericValue = value != null ? Number(value) : 0;
                            const currentMax = Math.min(3600, Number((Math.max((numericValue + 300), Math.max(...data.mvpa, ...data.light) + 300) / 1000).toFixed(1)) * 1000);

                            if (chartInstance.current && chartInstance.current.options.scales?.y) {
                                chartInstance.current.data.datasets[1 - datasetIndex].data[index] = Math.min(3600 - numericValue, Number(chartInstance.current.data.datasets[1 - datasetIndex].data[index]));
                                chartInstance.current.options.scales.y.max = currentMax;
                                chartInstance.current.update('none');
                            }

                            setUpLimit(currentMax);

                            if (DragEndCallback) {
                                DragEndCallback(datasetIndex, index, numericValue);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: "Seconds",
                            color: chartColor.text
                        },
                        beginAtZero: true,
                        min: 0,
                        max: upLimit,
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
    }, [data, resetTrigger, chartColor]);

    return (
        <div className="w-full relative h-full">
            {
                <canvas ref={chartRef} ></canvas>
            }
        </div>
    );
}

export default SimulateActivityChart;