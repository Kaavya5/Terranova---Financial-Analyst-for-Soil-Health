"use client";

import { cn } from "@/lib/utils";

interface NutrientSliderProps {
  label: string;
  symbol: string;
  value: number;
  onChange: (val: number) => void;
  statusLabels: [string, string, string]; // [low, optimal, high]
  statusColors?: [string, string, string]; // e.g. text-gray-400 text-red-500 text-gray-400
}

export function NutrientSlider({
  label,
  symbol,
  value,
  onChange,
  statusLabels,
  statusColors = ["text-gray-400", "text-gray-900", "text-gray-400"]
}: NutrientSliderProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-gray-900 text-lg">{label} ({symbol})</span>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            value={value} 
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-16 text-right bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 font-bold focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className="text-gray-500 text-sm font-medium">mg/kg</span>
        </div>
      </div>
      <div className="relative pt-2">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))} 
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-accent transition-colors" 
        />
      </div>
      <div className="flex justify-between text-[11px] font-bold mt-2 tracking-wide uppercase">
        <span className={statusColors[0]}>{statusLabels[0]}</span>
        <span className={statusColors[1]}>{statusLabels[1]}</span>
        <span className={statusColors[2]}>{statusLabels[2]}</span>
      </div>
    </div>
  );
}
