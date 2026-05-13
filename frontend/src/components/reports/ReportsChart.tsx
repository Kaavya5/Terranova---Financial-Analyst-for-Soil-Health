"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ReportListItem } from "@/lib/api";

interface ReportsChartProps {
  reports?: ReportListItem[];
}

export function ReportsChart({ reports = [] }: ReportsChartProps) {
  // Build chart data from real reports, or show placeholder
  const data =
    reports.length > 0
      ? [...reports]
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .slice(-12) // last 12 analyses
          .map((r) => ({
            name: new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            profit: Math.round(r.expected_profit),
            roi: Math.round(r.roi_percentage),
          }))
      : [
          { name: "—", profit: 0, roi: 0 },
        ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
  contentStyle={{
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
  }}
/>
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#1F4532"
          strokeWidth={2.5}
          dot={{ fill: "#1F4532", r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="roi"
          stroke="#8C6B5D"
          strokeWidth={2}
          dot={false}
          strokeDasharray="4 4"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
