import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    Title
} from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    Title
);

interface ZScores {
    iotf: number;
    cachera: number;
    oms: number;
    cdc: number;
}

interface RadarChartProps {
    data: ZScores;
    title: string;
    valueRange?: { min: number; max: number };
    color?: {
        background: string;
        border: string;
    };
}

const RadarChart: React.FC<RadarChartProps> = ({
    data,
    title,
    valueRange = { min: -5, max: 5 },
    color = {
        background: 'rgba(99, 102, 241, 0.2)',
        border: 'rgba(99, 102, 241, 1)'
    }
}) => {
    const labels = ['IOTF', 'Cachera', 'OMS', 'CDC'];
    const normalizeValue = (value: number) => {
        return (value - valueRange.min) / (valueRange.max - valueRange.min);
    };
    const [chartColor, setChartColor] = useState({text:'', line: ''});

    const getColorFromValue = (normalizedValue: number, alpha: number = 1, isBorder = false) => {
        normalizedValue = Math.max(0, Math.min(1, normalizedValue));

        let r, g, b;

        if (normalizedValue <= 0.5) {
            r = Math.round(255 * (1 - normalizedValue * 2));
            g = 255;
            b = 0;
        } else {
            r = Math.round(255 * (normalizedValue - 0.5) * 2);
            g = Math.round(255 * (1 - (normalizedValue - 0.5) * 2));
            b = Math.round(255 * (1 - (normalizedValue - 0.5) * 2));
        }
        if (isBorder) {
            r = Math.round(r * 0.7); 
            g = Math.round(g * 0.7);
            b = Math.round(b * 0.7);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    const createValueBasedGradient = useMemo(() => {
        return (ctx: CanvasRenderingContext2D, chartArea: any) => {
            const { top, bottom, left, right } = chartArea;
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;
            const radius = Math.min((right - left) / 2, (bottom - top) / 2);

            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

            const values = [data.iotf, data.cachera, data.oms, data.cdc];
            const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
            const normalizedAvg = normalizeValue(avgValue);

            const centerColor = getColorFromValue(normalizedAvg, 0.2);
            const midColor = getColorFromValue(normalizedAvg, 0.5);
            const edgeColor = getColorFromValue(normalizedAvg, 0.8);

            gradient.addColorStop(0, centerColor);
            gradient.addColorStop(0.3, midColor);
            gradient.addColorStop(0.8, edgeColor);

            return gradient;
        };
    }, [data, valueRange]);

    const createFullRangeGradient = useMemo(() => {
        return (ctx: CanvasRenderingContext2D, chartArea: any) => {
            const { top, bottom, left, right } = chartArea;

            // Linear
            const gradient = ctx.createLinearGradient(left, bottom, right, top);

            gradient.addColorStop(0, getColorFromValue(0, 0.6));    // -5 Yellow
            gradient.addColorStop(0.5, getColorFromValue(0.5, 0.6)); // 0 Green
            gradient.addColorStop(1, getColorFromValue(1, 0.6));    // 5 Red

            return gradient;
        };
    }, [valueRange]);

    const getColor = (isBorder: boolean) => {
        const values = [data.iotf, data.cachera, data.oms, data.cdc];
        const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        const normalizedAvg = normalizeValue(avgValue);
        if(isBorder) return getColorFromValue(normalizedAvg, 1, isBorder);
        else return getColorFromValue(normalizedAvg, 0.5);
    };

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

    const chartData: ChartData<'radar'> = {
        labels,
        datasets: [
            {
                label: title,
                data: data ? [data.iotf, data.cachera, data.oms, data.cdc] : [],
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return color.background;

                    return createValueBasedGradient(ctx, chartArea); // Based on Avg Val
                    // return createFullRangeGradient(ctx, chartArea);     // Based on Value Range
                },
                borderColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return color.border;
                    return getColor(true);
                },
                borderWidth: 2,
                pointBackgroundColor: color.border,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: color.border,
            }
        ],

    };
    const options: ChartOptions<'radar'> = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        plugins: {
            legend: {
                display: false,
                labels: {
                    color: chartColor.text
                }
            },
            tooltip: {
                enabled: true,
                displayColors: false,
                callbacks: {
                    label: (context) => {
                        return `Z-Score: ${context.parsed.r.toFixed(3)}`;
                    },
                },
            },
            dragData: false
        },
        scales: {
            r: {
                beginAtZero: false,
                pointLabels: {
                    color: chartColor.text,
                },
                grid: {
                    color: chartColor.line,
                },
                angleLines: {
                    color: chartColor.line,
                },
                ticks: {
                    backdropColor: 'transparent',
                    display:false
                },
                max: Math.ceil(Math.max(data.iotf, data.cachera, data.oms, data.cdc)),
                min: Math.floor(Math.min(data.iotf, data.cachera, data.oms, data.cdc))
            },
        },
    };

    return (
        <div className="w-full h-full">
            <Radar data={chartData} options={options} />
        </div>
    );
};

export default RadarChart;