import React, { useState } from "react";
import HeatmapChart from "../../components/Simulation/HealthStatusHeatmap/HealthStatus";
import SimulateActivity from "../../components/Simulation/SimulateActivity/SimulateActivity";
import HealthStatusHeatmap from "../../components/Simulation/HealthStatusHeatmap/HealthStatusHeatmap";
import DashboardCard from "../../components/DashboardCard";

const SimulationView = () => {
    const [group, setGroup] = useState<"weekdays" | "weekends">("weekdays");

    return (
        <div className="w-full h-full flex flex-col pt-2 gap-4 pb-4">
            <div className="w-full flex justify-end pr-6 h-10">
                <div className="flex gap-2 mt-2">
                    <button
                        className={`px-3 py-1 rounded-lg shadow-md text-sm ${group === "weekdays"
                            ? "bg-gradient-to-r from-blue-400 to-blue-300 dark:from-purple-700 dark:to-purple-500 text-white"
                            : "bg-gray-100 dark:bg-gray-900/40"
                            }`}
                        onClick={() => setGroup("weekdays")}
                    >
                        Weekdays
                    </button>
                    <button
                        className={`px-3 py-1 rounded-lg shadow-md text-sm ${group === "weekends"
                            ? "bg-gradient-to-r from-blue-400 to-blue-300 dark:from-purple-700 dark:to-purple-500 text-white"
                            : "bg-gray-100 dark:bg-gray-900/40"
                            }`}
                        onClick={() => setGroup("weekends")}
                    >
                        Weekends
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col pl-2 pr-4 gap-4">
                <DashboardCard className="w-full flex-1 min-h-0" noHover={true}>
                    <SimulateActivity isWeekend={group === "weekends"} />
                </DashboardCard>


                <DashboardCard noHover={true}>
                    <div className="w-full h-full p-2">
                        <h1 className="opacity-100 rounded-lg text-gray-800 dark:text-gray-200 select-none pl-1 text-lg tracking-tight font-bold font-[Nunito]">
                            Heatmap
                        </h1>
                        <HealthStatusHeatmap isWeekend={group === "weekends"} />
                    </div>
                </DashboardCard>
            </div>


        </div>

    );
};

export default SimulationView;
