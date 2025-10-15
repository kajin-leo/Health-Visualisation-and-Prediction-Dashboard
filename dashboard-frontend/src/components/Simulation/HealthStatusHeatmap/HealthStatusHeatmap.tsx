import { useEffect, useState } from "react";
import HeatmapChart from "./HealthStatus"
import { Spinner } from "@heroui/react";
import type { ImpactItem } from "./HealthStatus";
import { apiClient } from "../../../service/axios";
import { API_CONFIG } from "../../../config/api";
import { fetchEventSource } from "@microsoft/fetch-event-source";

type ImpactResponse = {
  mvpa_impact: ImpactItem[];
  light_impact: ImpactItem[];
};

const HealthStatusHeatmap = ({ isWeekend }: { isWeekend: boolean }) => {
    const [isLoading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<ImpactResponse>();

    const fetchHeatmap = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/simulation/heatmap');
            const data = response.data;
            console.log(data);
            if (data.fromCache) {
                const chartData: ImpactResponse = data.data;
                setChartData(chartData);
            } else {
                const taskId = data.taskId;
                const token = localStorage.getItem('token');
                const eventSource = API_CONFIG.FULL_URL + '/simulation/stream/' + taskId;
                await fetchEventSource(eventSource, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },

                    onmessage: (msg) => {
                        if (msg.event == 'result') {
                            const result = JSON.parse(msg.data);
                            setChartData(result);
                        }
                    },

                    onerror: (err) => {
                        console.error(err);
                        throw err;
                    }
                });
            }
        } catch (error) {
            console.error("Failed fetching heatmap", error);
        }
        setLoading(false);
    }

    useEffect(()=> {
        fetchHeatmap();
    }, [isWeekend]);

    if (isLoading) {
        return (
            <div className="h-[210px] w-full flex flex-col items-center justify-center">
                <Spinner color="default" />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 h-[210px] w-full gap-2">
            <HeatmapChart weekend={isWeekend} activityType="mvpa" rawdata={chartData?.mvpa_impact}/>
            <HeatmapChart weekend={isWeekend} activityType="light" rawdata={chartData?.light_impact}/>
        </div>
    )
}

export default HealthStatusHeatmap;