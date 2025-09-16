import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Chart } from "chart.js/auto";
import { use, useEffect, useRef, useState } from "react";
import { apiClient } from "../../../service/axios";
import { set } from "mongoose";
import WorkoutDetails from "../../ModalPages/WorkoutDetails/WorkoutDetails";

type Workout = {
    dayOfWeek: string;
    mvpa: number;
    light: number;
}

const WorkoutOverviewChart = ({ data, showTooltips, className }: { data: Workout[], showTooltips?: boolean, className?: string }) => {
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
                    },
                    title: {
                        display: false,
                        text: 'Workout Overview',
                    },
                    tooltip: {
                        enabled: showTooltips ? showTooltips : false
                    }
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
        <div className={`w-full h-full relative ${className || ''}`}>
            {
                data.length > 0 ? (<canvas ref={chartRef} ></canvas>) : (<></>)
            }
        </div>
    );
}

const WorkoutOverview = ({ mock }: { mock?: Workout[] }) => {
    const [workoutData, setWorkoutData] = useState<Workout[]>([]);

    const fetchWorkoutData = async () => {
        try {
            const response = await apiClient.get('/static/workout-overview');
            console.log('Fetched workout data:', response.data.dataList);
            setWorkoutData(response.data.dataList);
        } catch (error) {
            console.error('Error fetching workout data:', error);
        }
    };

    useEffect(() => {
        if (!mock) fetchWorkoutData();
        else setWorkoutData(mock);
    }, [mock]);

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <div className='w-full h-full justify-between flex flex-col overflow-visible' onClick={onOpen}>
                <h1 className="w-fit opacity-70 bg-green-600 rounded-lg text-white px-2 text-xl font-light font-[Outfit] flex-shrink-0">
                    Activities Overview
                </h1>
                <WorkoutOverviewChart data={workoutData} showTooltips={true} />
            </div>
            <Modal isOpen={isOpen} onClose={onClose} size="5xl">
                <ModalContent>
                    <ModalHeader>
                        Activities
                    </ModalHeader>
                    <ModalBody className="h-fit">
                        <WorkoutDetails />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default WorkoutOverview;
export { WorkoutOverviewChart };
export type { Workout };