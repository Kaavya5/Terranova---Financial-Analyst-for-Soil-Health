"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function YieldProfitChart({ data }: { data?: any }) {
  if (!data) return <div className="h-56 flex flex-col items-center justify-center text-gray-400 font-bold text-sm w-full"><div className="w-5 h-5 border-2 border-gray-200 border-t-primary rounded-full animate-spin mb-2" /> Loading Projection Model...</div>;

  const baseYield = Math.max(10, (data.total_yield_kg || 1) * 0.7);
  const baseProfit = Math.max(10, (data.financial?.expected_profit || 1) * 0.6);

  const performanceData = [
    { name: 'Harvest -5', yield: baseYield * 0.8, profit: baseProfit * 0.7 },
    { name: 'Harvest -4', yield: baseYield * 0.9, profit: baseProfit * 0.85 },
    { name: 'Harvest -3', yield: baseYield * 0.95, profit: baseProfit * 0.9 },
    { name: 'Harvest -2', yield: baseYield * 1.05, profit: baseProfit * 0.95 },
    { name: 'Harvest -1', yield: baseYield * 1.1, profit: baseProfit * 1.02 },
    { name: 'Projected', yield: data.total_yield_kg || 0, profit: data.financial?.expected_profit || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={performanceData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
        <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}
        />
        <Line type="monotone" dataKey="yield" stroke="#1B3B2B" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#1B3B2B' }} />
        <Line type="monotone" dataKey="profit" stroke="#A8ACA9" strokeDasharray="5 5" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
