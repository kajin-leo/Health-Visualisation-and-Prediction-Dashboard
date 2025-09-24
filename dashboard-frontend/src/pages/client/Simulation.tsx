import React, { useState } from "react";
import HeatmapChart from "../../components/DashboardCardContent/HealthStatusHeatmap/HealthStatus";

const SimulationView = () => {
    const [group, setGroup] = useState<"weekdays" | "weekends">("weekdays");

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4 pl-2">
            <div className="w-full flex justify-end pr-6 flex-shrink-0">
                <div className="flex gap-2 mt-2">
                    <button
                        className={`px-3 py-1 rounded-lg shadow-md text-sm ${group === "weekdays"
                            ? "bg-gradient-to-r from-blue-400 to-blue-300 text-white"
                            : "bg-gray-100"
                            }`}
                        onClick={() => setGroup("weekdays")}
                    >
                        Weekdays
                    </button>
                    <button
                        className={`px-3 py-1 rounded-lg shadow-md text-sm ${group === "weekends"
                            ? "bg-gradient-to-r from-blue-400 to-blue-300 text-white"
                            : "bg-gray-100"
                            }`}
                        onClick={() => setGroup("weekends")}
                    >
                        Weekends
                    </button>
                </div>
            </div>

            <div className="grid grid-rows-13 w-full h-full gap-5">
                <div className="w-full row-span-8 bg-white/60 rounded-2xl shadow-xl/40 shadow-blue-500 outline-1 outline-white/100">
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">Placeholder for actitvity linechart</p>
                    </div>
                </div>


                <div className="bg-white/60 rounded-2xl shadow-xl/40 shadow-blue-500 outline-1 outline-white/100 w-full row-span-5 flex items-center justify-center p-4">
                    <div className="grid grid-cols-2 h-fit w-full gap-2">
                        <HeatmapChart group={group} />
                        <HeatmapChart group={group} />
                    </div>
                </div>
            </div>

        </div>

    );
};

export default SimulationView;
