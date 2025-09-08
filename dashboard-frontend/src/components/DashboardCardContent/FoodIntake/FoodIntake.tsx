import React, { useEffect, useState } from "react";
import { apiClient } from "../../../service/axios";

interface FoodIntakeResultDto {
  energy: number;
  protective: number;
  bodyBuilding: number;
  recEnergy: number;
  recProtective: number;
  recBodyBuilding: number;
  pctEnergy: number;
  pctProtective: number;
  pctBodyBuilding: number;
  dailyPctEnergy?: number;
  dailyPctProtective?: number;
  dailyPctBodyBuilding?: number;
}


// Colors: darker = recommended track, lighter = actual track
const ringColors = [
  { actual: "#FFD700", recommended: "#b59f3b" }, // Energy
  { actual: "#4CAF50", recommended: "#2e7d32" }, // Protective
  { actual: "#2196F3", recommended: "#1565c0" }, // Body Building
];

const radii = [60, 48, 36];
const labels = ["Energy", "Protective", "Body Building"] as const;
const TRACK_WIDTH = 14; 


function RingLayer({
  cx,
  cy,
  r,
  trackColor,
  fillColor,
  arcPct,         
}: {
  cx: number;
  cy: number;
  r: number;
  trackColor: string;
  fillColor: string;
  arcPct: number; 
}) {
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(arcPct, 1));
  const dash = pct * circumference;

  return (
    <g>
      {/* Recommended track*/}
      <circle
      cx={cx} 
      cy={cy} 
      r={r} 
      fill="none" 
      stroke={trackColor} strokeWidth={TRACK_WIDTH} />
      {/* Actual arc*/}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={fillColor}
        strokeWidth={TRACK_WIDTH}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${Math.max(0, circumference - dash)}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        opacity={0.9}
      />
    </g>
  );
}

function toFixed1(n: number) { return Number.isFinite(n) ? n.toFixed(1) : "0.0"; }

const FoodIntakeRings: React.FC<FoodIntakeResultDto> = (data) => {
  //const actualValues = [data.energy, data.protective, data.bodyBuilding];
  //const recAbs = [data.recEnergy, data.recProtective, data.recBodyBuilding];
  const pctOfRec = [data.pctEnergy, data.pctProtective, data.pctBodyBuilding];
  //const pctOfDaily = [data.dailyPctEnergy ?? 0,data.dailyPctProtective ?? 0,data.dailyPctBodyBuilding ?? 0,];

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 18, fontWeight: "bold" }}>Daily Food Intake</div>
      <svg width={200} height={200} viewBox="0 0 200 200" role="img" aria-label="Food intake rings">
        {radii.map((r, idx) => (
          <RingLayer
            key={labels[idx]}
            cx={100}
            cy={100}
            r={r}
            trackColor={ringColors[idx].recommended}
            fillColor={ringColors[idx].actual}
            arcPct={Math.min(1, Math.max(0, (pctOfRec[idx] || 0) / 100))}
          />
        ))}
      </svg>
      </div>

      {/* Legend */}
      <div style={{ fontSize: 14, lineHeight: 1.6 }}>
        {labels.map((label, idx) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* <span title="Recommended (track)" style={{ width: 12, height: 12, background: ringColors[idx].recommended, display: "inline-block", borderRadius: 2 }} /> */}
              <span title="Actual (arc)" style={{ width: 12, height: 12, background: ringColors[idx].actual, display: "inline-block", borderRadius: 2, opacity: 0.9 }} />
            </div>
            <div>
              <strong>{label}:</strong> {toFixed1(pctOfRec[idx] ?? 0)}% 
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FoodIntake: React.FC = () => {
  const [data, setData] = useState<FoodIntakeResultDto | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient.get("food-intake/rings");
        const data = response.data as FoodIntakeResultDto;
        setData({
          energy: data.energy,
          protective: data.protective,
          bodyBuilding: data.bodyBuilding,
          recEnergy: data.recEnergy,
          recProtective: data.recProtective,
          recBodyBuilding: data.recBodyBuilding,
          pctEnergy: data.pctEnergy,
          pctProtective: data.pctProtective,
          pctBodyBuilding: data.pctBodyBuilding,
          dailyPctEnergy: data.dailyPctEnergy ?? 0,
          dailyPctProtective: data.dailyPctProtective ?? 0,
          dailyPctBodyBuilding: data.dailyPctBodyBuilding ?? 0,
        });
      }  catch (e) {
          console.error("food-intake api error:", e);
          // final demo fallback
          const energy = 50, protective = 35, bodyBuilding = 15;
          const total = energy + protective + bodyBuilding;
          const recEnergy = 0.5 * total, recProtective = 0.35 * total, recBodyBuilding = 0.15 * total;
          setData({
            energy, protective, bodyBuilding,
            recEnergy, recProtective, recBodyBuilding,
            pctEnergy: (energy / recEnergy) * 100,
            pctProtective: (protective / recProtective) * 100,
            pctBodyBuilding: (bodyBuilding / recBodyBuilding) * 100,
            dailyPctEnergy: (energy / total) * 100,
            dailyPctProtective: (protective / total) * 100,
            dailyPctBodyBuilding: (bodyBuilding / total) * 100,
          });
        }
    }
    fetchData();
  }, []);

  if (!data) return <div>No data</div>;
  return <FoodIntakeRings {...data} />;
};

export default FoodIntake;
