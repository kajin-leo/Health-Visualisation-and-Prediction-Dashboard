import React, { useEffect, useState } from "react";
import { apiClient } from "../../../service/axios";
import { X } from 'lucide-react'

const TITLES = [
  { key: "wlgr625", label: "WLGR 625" },
  { key: "wlgr50", label: "WLGR 50" },
  { key: "wlgx625", label: "WLGX 625" },
  { key: "wlgx50", label: "WLGX 50" },
];

export default function WlgrWlgxCards() {
  const [values, setValues] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    apiClient.get("/static/body-composition/wlgr-wlgx")
      .then(res => setValues(res.data))
      .catch(() => setValues({ wlgr625: 0, wlgr50: 0, wlgx625: 0, wlgx50: 0 }));
  }, []);

  return (
    <div className="w-full h-full grid grid-rows-2 grid-cols-2 gap-5">
      {TITLES.map(({ key, label }) => (
        <div key={key} className="relative flex flex-col items-center justify-center bg-gradient-to-b from-white dark:from-gray-900 to-gray-100 dark:to-gray-950 rounded-xl outline-1 outline-white/30 dark:outline-gray-800/90 shadow-xl">
          <div className="absolute w-full h-full p-2">
            {['top-2 left-2',
              'top-2 right-2',
              'bottom-2 left-2',
              'bottom-2 right-2'].map((item) => (
                <div className={`absolute w-2 h-2 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 ${item} flex flex-col items-center justify-center`}>
                  <X className="w-1.5 h-1.5 bg-gradient-to-b from-gray-800 to-gray-500 bg-clip-text"/>
                </div>
              )
              )}
          </div>
          <div className="font-mono" style={{ fontWeight: "bold" }}>{label}</div>
          <div className="font-mono bg-gradient-to-br from-green-950 to-green-900 px-2 py-1 rounded-lg inset-shadow-sm/40 text-white" style={{ fontSize: 20 }}>
            {typeof values[key] === "number" ? values[key].toFixed(2) : "—"}
          </div>
        </div>
      ))}
    </div>
  );
}