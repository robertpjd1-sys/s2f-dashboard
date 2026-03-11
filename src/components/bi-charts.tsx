"use client";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { BiDataPoint } from "@/lib/dummy-bi-data";

interface BiChartsProps {
  data: BiDataPoint[];
}

export function RevenueBarChart({ data }: BiChartsProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `£${value}`}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            formatter={(value: any) => {
              if (typeof value === 'number') return [`£${value.toLocaleString()}`, "Revenue"];
              return [value, "Revenue"];
            }}
          />
          <Bar
            dataKey="revenue"
            fill="#d19c3e"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function JobsVolumeLineChart({ data }: BiChartsProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            formatter={(value: any) => [value, "Jobs"]}
          />
          <Line
            type="monotone"
            dataKey="jobs"
            stroke="#3d5a3e"
            strokeWidth={3}
            dot={{ r: 4, fill: "#3d5a3e", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#1a231a" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProfitMarginLineChart({ data }: BiChartsProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            formatter={(value: any) => [`${value}%`, "Margin"]}
          />
          <Line
            type="monotone"
            dataKey="profitMargin"
            stroke="#d19c3e"
            strokeWidth={3}
            dot={{ r: 4, fill: "#d19c3e", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#c38c33" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
