import { Tabs, Tab, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Button } from "@heroui/react";
import { useState, useRef, useEffect } from "react";
import { type Workout } from "../../DashboardCardContent/WorkoutOverview/WorkoutOverview";
import { WorkoutOverviewChart } from "../../DashboardCardContent/WorkoutOverview/WorkoutOverview";
import { Chart } from "chart.js/auto";
import WorkoutDailyDetailsChart from "./WorkoutDailyDetailsChart";
import { time } from "framer-motion";
import WorkoutTimeOfDayChart from "./WorkoutTimeOfDayChart";
import { apiClient } from "../../../service/axios";

type DailyDetail = {
    timeSegmentStarting: string;
    mvpa: number;
    light: number;
}

type TimeOfDayDetail = {
    dayOfWeek: string;
    mvpa: number;
    light: number;
}

const daysOfWeek = [
    {
        "label": "Monday",
        "key": 0,
    },
    {
        "label": "Tuesday",
        "key": 1,
    },
    {
        "label": "Wednesday",
        "key": 2,
    },
    {
        "label": "Thursday",
        "key": 3,
    },
    {
        "label": "Friday",
        "key": 4,
    },
    {
        "label": "Saturday",
        "key": 5,
    },
    {
        "label": "Sunday",
        "key": 6,
    }
]

const timesOfDay = () => {
    const res:{label:string; key: number}[] = [];
    for(let i = 0; i < 24; i++) {
        res.push({
            label: `${i}:00 - ${i+1}:00`,
            key: i,
        });
    }
    return res;
}

const WorkoutDetails = ({ overallMock, dailyMock, timeofdayMock }: { overallMock?: Workout[], dailyMock?: DailyDetail[][], timeofdayMock?: TimeOfDayDetail[][] }) => {
    const [selectedView, setSelectedView] = useState('overall');
    const [overallData, setOverallData] = useState<Workout[]>([]);
    const [dailyData, setDailyData] = useState<DailyDetail[]>([]);
    const [timeOfDayData, setTimeOfDayData] = useState<TimeOfDayDetail[]>([]);
    const [dayOfWeek, setDayOfWeek] = useState(0);
    const [timeOfDay, setTimeOfDay] = useState(0);

    const fetchOverallData = async () => {
        try {
            const response = await apiClient.get('/static/workout-overview');
            setOverallData(response.data.dataList);
        } catch (error) {
            console.error('Error fetching workout data:', error);
        }
    };
    
    const fetchDailyData = async (day: number) => {
        try {
            const response = await apiClient.get(`/workout/daily/${day}`);
            setDailyData(response.data.dataList);
        } catch (error) {
            console.error('Error fetching daily workout data:', error);
        }
    };

    const fetchTimeOfDayData = async (time: number) => {
        try {
            const response = await apiClient.get(`/workout/timeofday/${time}`);
            setTimeOfDayData(response.data.dataList);
        } catch (error) {
            console.error('Error fetching time of day workout data:', error);
        }
    };


    useEffect(() => {
        if(!overallMock) fetchOverallData();
        else setOverallData(overallMock!);
    }, [overallMock]);

    useEffect(() => {
        if(!dailyMock) fetchDailyData(dayOfWeek);
        else setDailyData(dailyMock![dayOfWeek]);
    }, [dailyMock, dayOfWeek]);

    useEffect(() => {
        if(!timeofdayMock) fetchTimeOfDayData(timeOfDay);
        else setTimeOfDayData(timeofdayMock![timeOfDay]);
    }, [timeofdayMock, timeOfDay]);

    return (
        <div className="w-full h-full flex items-center flex-col">
            <Tabs selectedKey={selectedView} onSelectionChange={(e) => setSelectedView(e.toString())} className="flex-shrink-0">
                <Tab key="overall" title="Overall" className="w-full h-full">
                    <div className="w-full h-full">
                        <WorkoutOverviewChart data={overallData} showTooltips={true} className="min-h-100" />
                    </div>
                </Tab>
                <Tab key="daily" title="Daily Detail" className="w-full h-full">
                    <div className="w-full h-full flex flex-col items-center gap-3">
                        <Tabs selectedKey={dayOfWeek.toString()} onSelectionChange={(e) => setDayOfWeek(parseInt(e.toString()))} radius="full" color="primary">
                            {
                                daysOfWeek.map((day) => (
                                    <Tab key={day.key.toString()} title={day.label} />
                                ))
                            }
                        </Tabs>
                        <WorkoutDailyDetailsChart data={dailyData} showTooltips={true} />
                    </div>
                </Tab>
                <Tab key="time" title="Time of Day" className="w-full h-full">
                    <div className="w-full h-full flex flex-col items-center gap-3">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="bordered">
                                    {timesOfDay()[timeOfDay].label}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Time of Day Selection" onAction={(key) => setTimeOfDay(parseInt(key.toString()))} className="max-h-60 overflow-y-scroll">
                                {
                                    timesOfDay().map((time) => (
                                        <DropdownItem key={time.key.toString()}>{time.label}</DropdownItem>
                                    ))
                                }
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <WorkoutTimeOfDayChart data={timeOfDayData} showTooltips={true} />
                </Tab>
            </Tabs>
        </div>
    )
}

export default WorkoutDetails;
export type { DailyDetail, TimeOfDayDetail };