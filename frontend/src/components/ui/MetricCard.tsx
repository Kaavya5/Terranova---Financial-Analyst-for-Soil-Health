"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

interface MetricCardProps {
  title: string;
  value: string | number;
  badge?: ReactNode;
  unit?: string;
  progressValue?: number; // 0-100
  progressColorClass?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  badge,
  unit,
  progressValue,
  progressColorClass = "bg-gray-900",
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("p-5 lg:p-6 flex flex-col justify-between relative overflow-hidden", className)}>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </p>
      <div className="flex items-end gap-1.5 mb-3">
        <span className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
          {value}
        </span>
        {badge && <div className="mb-1">{badge}</div>}
      </div>
      {unit && <p className="text-xs font-semibold text-gray-400 mb-2">{unit}</p>}
      
      {progressValue !== undefined && (
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-auto">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000 ease-out", progressColorClass)} 
            style={{ width: `${progressValue}%` }} 
          />
        </div>
      )}
    </Card>
  );
}
