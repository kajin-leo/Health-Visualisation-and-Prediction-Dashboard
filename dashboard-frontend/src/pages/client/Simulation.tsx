import React, { useState } from "react";
import HeatmapChart from "../../components/Simulation/HealthStatusHeatmap/HealthStatus";
import SimulateActivity from "../../components/Simulation/SimulateActivity/SimulateActivity";
import HealthStatusHeatmap from "../../components/Simulation/HealthStatusHeatmap/HealthStatusHeatmap";

const SimulationView = () => {
    const [group, setGroup] = useState<"weekdays" | "weekends">("weekdays");

    return (
        <div className="w-full h-full flex flex-col pt-2 gap-4 pb-4">
            <div className="w-full flex justify-end pr-6 h-10">
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

            <div className="flex-1 flex flex-col pl-2 pr-4 gap-4">
                <div className="w-full flex-1 min-h-0 bg-white/60 rounded-2xl shadow-md/20 shadow-blue-500 outline-1 outline-white/100 ">
                    <SimulateActivity isWeekend={group === "weekends"} />
                </div>


                <div className="bg-white/60 flex-shrink-0 rounded-2xl shadow-md/20 shadow-blue-500 outline-1 outline-white/100 w-full flex flex-col p-4">
                    <h1 className="opacity-100 rounded-lg text-gray-800 pl-1 text-lg tracking-tight font-bold font-[Nunito]">
                        Heatmap
                    </h1>
                    <HealthStatusHeatmap isWeekend={group === "weekends"} />
                </div>
            </div>


        </div>

    );
};

export default SimulationView;
