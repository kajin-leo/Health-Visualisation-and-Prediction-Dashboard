import { useEffect, useRef, useState } from "react";
import SimulateActivityChart from "./SimulateActivityChart";
import { type ReviewData } from "./HealthReview";
import HealthReview from "./HealthReview";
import { Button, Spinner } from "@heroui/react";
import { apiClient } from "../../service/axios";

type ActivityData = {
    description: string[];
    mvpa: number[];
    light: number[];
}

const SimulateActivity = ({ MockData, isWeekend }: { MockData?: ActivityData, isWeekend?: boolean }) => {
    const [resetTrigger, setResetTrigger] = useState(0);
    const [isDataReady, setIsDataReady] = useState(false);
    const [chartData, setChartData] = useState<ActivityData>();
    const [predictionData, setPredictionData] = useState<ReviewData>();
    const [canSimulate, setCanSimulate] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);

    const fetchData = async () => {
        try {
            const chartResponse = await apiClient.get('/simulation/chart', {
                params: {
                    isWeekend: isWeekend ?? false
                }
            });
            const groundtruthResponse = await apiClient.get('/simulation/groundtruth');
            setChartData(chartResponse.data);
            setPredictionData({ groundTruth: groundtruthResponse.data });
            setIsDataReady(true);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (MockData) {
            setChartData(MockData);
            setPredictionData({ groundTruth: "NI" });
            setIsDataReady(true);
        } else {
            fetchData();
        }
    }, [MockData, isWeekend])

    const submitSimulation = async () => {
        if (MockData) {
            setIsSimulating(true);
            setPredictionData({
                groundTruth: "NI",
                prediction: {
                    newClassification: "HFZ",
                    possibility: 80
                }
            });
        } else {
            if (!chartData) return;
            if (!canSimulate) return;
            try {
                setIsSimulating(true);
                const response = await apiClient.post("/simulation/predict", {
                    isWeekend: isWeekend ?? false,
                    mvpa: chartData.mvpa,
                    light: chartData.light
                });
                setPredictionData(prev => {
                    return {
                        ...prev!,
                        prediction: {
                            newClassification: response.data.classification,
                            possibility: response.data.probability
                        }
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }

        setIsSimulating(false);
    }

    const resetSimulation = () => {
        if (MockData) {
            setChartData(MockData);
            setPredictionData({ groundTruth: "NI" });
        } else {
            setIsDataReady(false);
            fetchData();
        }
        setResetTrigger(prev => prev + 1);
        setIsSimulating(false);
        setCanSimulate(false);
    }

    const onDragEnd = (datasetIndex: number, index: number, value: number) => {
        if (!chartData) return;
        const dataset = datasetIndex == 0 ? 'mvpa' : 'light';
        const counterDataset = datasetIndex == 0 ? 'light' : 'mvpa';
        if (chartData[dataset][index] !== value) setCanSimulate(true);
        chartData[dataset][index] = value;
        chartData[counterDataset][index] = Math.min(chartData[counterDataset][index], 3600 - value);
    }

    if (!isDataReady) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-5">
                <Spinner />
                <h1 className="text-lg">Loading...</h1>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col gap-2 p-5">
            <div className="w-fit h-fit flex flex-shrink-0 flex-col">
                <h1 className="w-fit opacity-100 rounded-lg text-gray-800 pl-1 text-lg tracking-tight font-bold font-[Nunito] flex-shrink-0">
                    Activity Simulation
                </h1>
                <h2 className="text-sm px-1 font-serif">
                    Try dragging on the chart to simulate changes on your activities pattern.
                </h2>
            </div>
            <div className="w-full flex-1 flex gap-5 items-center justify-center">
                <div id="chart" className="w-full h-full">
                    <SimulateActivityChart data={chartData!} DragEndCallback={onDragEnd} resetTrigger={resetTrigger} />
                </div>
                <div id="panel" className="flex-shrink-0 p-5 flex flex-col items-center gap-5 select-none">
                    <div className="flex gap-2">
                        <div className={`w-25 h-10 transition-all flex flex-col items-center justify-center rounded-full bg-lime-300 p-1 border-3 border-white/50 text-lime-700 ${(canSimulate && !isSimulating) ? ' hover:border-2 hover:shadow-md active:border-2 active:border-lime-400/20 active:inset-shadow-sm/40 active:shadow-none active:text-shadow-lime-800/20 active:text-shadow-xs' : 'cursor-not-allowed bg-lime-400/20'}`}
                            onClick={submitSimulation}>
                            Simulate
                        </div>
                        <div className="w-25 h-10 transition-all flex flex-col items-center justify-center rounded-full bg-red-300 p-1 border-3 border-white/50 text-red-700 hover:border-2 hover:shadow-md active:border-2 active:border-red-400/20 active:inset-shadow-sm/40 active:shadow-none active:text-shadow-red-800/20 active:text-shadow-xs"
                            onClick={resetSimulation}>
                            <h1>Reset</h1>
                        </div>
                    </div>
                    <HealthReview data={predictionData} />
                </div>
            </div>
        </div>
    )
}

export default SimulateActivity;
export type { ActivityData }