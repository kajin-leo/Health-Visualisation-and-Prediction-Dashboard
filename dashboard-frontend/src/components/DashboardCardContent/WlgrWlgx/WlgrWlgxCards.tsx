import React, { useEffect, useState } from "react";
import { apiClient } from "../../../service/axios";

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
    <div style={{ display: "grid", gap: 16,
      gridTemplateColumns: "1fr 1fr",
      gridTemplateRows: "1fr 1fr",
    }}>
      {TITLES.map(({ key, label }) => (
        <div key={key} style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 16,
          minWidth: 100,
          textAlign: "center",
          background: "#f9f9f9"
        }}>
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 20 }}>
            {typeof values[key] === "number" ? values[key].toFixed(2) : "—"}
          </div>
        </div>
      ))}
    </div>
  );
}