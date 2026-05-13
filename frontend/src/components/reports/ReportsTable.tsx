"use client";

import { Snowflake, Droplets, Sprout, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

import { useEffect, useState } from "react";
import { getReports } from "@/lib/api";

export function ReportsTable() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports(0, 50).then(data => {
      setReports(data);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold h-64 flex items-center justify-center">Loading Archive Data...</div>;
  if (!reports.length) return <div className="p-8 text-center text-gray-500 font-bold h-64 flex items-center justify-center">No predictions recorded yet. Run a soil analysis first!</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-8 py-5 text-[10px] uppercase font-bold text-gray-400 tracking-wider w-40">Date Analyzed</th>
            <th className="px-4 py-5 text-[10px] uppercase font-bold text-gray-400 tracking-wider">Field Size</th>
            <th className="px-4 py-5 text-[10px] uppercase font-bold text-gray-400 tracking-wider">Financials</th>
            <th className="px-4 py-5 text-[10px] uppercase font-bold text-gray-400 tracking-wider">Recommended Crop</th>
            <th className="px-4 py-5 text-[10px] uppercase font-bold text-gray-400 tracking-wider">Status</th>
            <th className="px-8 py-5 text-center text-[10px] uppercase font-bold text-gray-400 tracking-wider w-20">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {reports.map((row) => {
            const date = new Date(row.created_at);
            const isOpt = row.crop_confidence >= 0.8;
            return (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">
                    {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium mt-0.5">
                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td className="px-4 py-6">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#1A3B30]">Plot: {row.field_area_hectares} ha</span>
                  </div>
                </td>
                <td className="px-4 py-6">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={isOpt ? "success" : "warning" as any}>Cost: ${Math.round(row.total_cost).toLocaleString()}</Badge>
                    <Badge variant="neutral">ROI: {Math.round(row.roi_percentage)}%</Badge>
                  </div>
                </td>
                <td className="px-4 py-6">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-700 group-hover:text-gray-900 transition-colors capitalize">
                    <Sprout className="w-4 h-4 text-green-500" /> {row.recommended_crop}
                  </div>
                </td>
                <td className="px-4 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full shadow-sm ${isOpt ? 'bg-success' : 'bg-warning'}`} />
                    <span className={`text-sm font-bold ${isOpt ? 'text-success' : 'text-warning'}`}>
                      {Math.round(row.crop_confidence * 100)}% Confidence
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 mx-auto" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
