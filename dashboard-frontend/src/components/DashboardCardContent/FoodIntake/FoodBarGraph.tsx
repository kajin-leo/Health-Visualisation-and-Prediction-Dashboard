import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  //LabelList,
} from "recharts";


export type GroupDatum = {
  group: string;          // e.g. "Vegetables"
  actual: number;         // actual intake amount (grams, serves, etc.)
  recommended: number;    // recommended amount (same units)
};

type Props = {
  data: GroupDatum[];
  valueSuffix?: string;   
  max?: number;          
};

const defaultColors = {
  actual: "#4CAF50",       // green
  recommended: "#90A4AE",  // grey/blue
};


export default function FoodBarGraph({ data, valueSuffix = "", max }: Props) {
  const domainMax =
    max ??
    Math.max(
      ...data.flatMap((d) => [d.actual ?? 0, d.recommended ?? 0]),
      10
    ) * 1.15; // padding

  return (
    <div style={{ width: "100%", height: 320, overflowX: "hidden" }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 24, left: 8, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="group" angle={-20} textAnchor="end" interval={0} height={48} />
          <YAxis domain={[0, Math.ceil(domainMax)]} />
          <Tooltip
            formatter={(value: number, _name: string, props: any) => {
              const key = props.dataKey;
              const label =
                key === "actual" ? "Actual" : "Recommended";

              const formattedValue =
                typeof value === "number" ? value.toFixed(2) : value;

              return [`${formattedValue}${valueSuffix}`, label];
            }}
            labelFormatter={(label) => `Group: ${label}`}
            contentStyle={{ borderRadius: 8 }}
/>
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="recommended" name="Recommended" 
          fill={defaultColors.recommended} radius={[6, 6, 0, 0]} barSize={18} />
          <Bar dataKey="actual" name="Actual" fill={defaultColors.actual} radius={[6, 6, 0, 0]} barSize={18}>
          </Bar>
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}
