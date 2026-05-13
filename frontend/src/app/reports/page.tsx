"use client";

import { Download, Filter, FlaskConical, ChevronLeft, ChevronRight, TrendingUp, IndianRupee, Sprout, BarChart3 } from "lucide-react";
import { AnimatedPage, AnimatedCard } from "@/components/ui/AnimatedPage";
import { ReportsChart } from "@/components/reports/ReportsChart";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { useEffect, useState } from "react";
import { getReports, ReportListItem } from "@/lib/api";

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports(0, 50)
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Aggregate stats across all reports
  const totalAnalyses = reports.length;
  const avgROI = reports.length
    ? (reports.reduce((s, r) => s + r.roi_percentage, 0) / reports.length).toFixed(1)
    : "—";
  const totalProfit = reports.reduce((s, r) => s + r.expected_profit, 0);
  const topCrop = reports.length
    ? [...reports].sort((a, b) => b.crop_confidence - a.crop_confidence)[0]?.recommended_crop
    : "—";

  const handleExportCSV = () => {
    if (!reports.length) return alert("No data to export yet.");
    const headers = ["Date", "Crop", "Confidence", "Area (ha)", "Total Cost (₹)", "Profit (₹)", "ROI (%)"];
    const rows = reports.map((r) => [
      new Date(r.created_at).toLocaleDateString(),
      r.recommended_crop,
      `${Math.round(r.crop_confidence * 100)}%`,
      r.field_area_hectares,
      Math.round(r.total_cost),
      Math.round(r.expected_profit),
      `${r.roi_percentage.toFixed(1)}%`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "terranova-reports.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatedPage className="max-w-[1200px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pt-4">
        <div>
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1 block">
            Precision Agriculture Archives
          </span>
          <h1 className="text-4xl font-bold text-[#102B1F] tracking-tight">Reports History</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-800 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> All Filters
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#102B1F] text-white text-sm font-bold hover:bg-[#102B1F]/90 transition-transform hover:scale-105 active:scale-95 shadow-md border border-[#102B1F]"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Analyses", value: loading ? "…" : totalAnalyses, icon: FlaskConical, color: "text-primary" },
          { label: "Avg. ROI", value: loading ? "…" : `${avgROI}%`, icon: TrendingUp, color: "text-emerald-600" },
          { label: "Total Profit (₹)", value: loading ? "…" : `₹${Math.round(totalProfit).toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-blue-600" },
          { label: "Top Crop", value: loading ? "…" : topCrop, icon: Sprout, color: "text-amber-600" },
        ].map((stat) => (
          <AnimatedCard key={stat.label} className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="font-bold text-gray-900 text-sm capitalize truncate max-w-[120px]">{stat.value}</p>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Top section: Graph & Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <AnimatedCard delay={0.1} className="lg:col-span-2 p-8 border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Profit Trends</h3>
              <p className="text-sm text-gray-500">Expected profit across your recent analyses</p>
            </div>
            <div className="flex gap-4 text-xs font-bold text-gray-600">
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" /> Profit (₹)
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8C6B5D]" /> ROI %
              </span>
            </div>
          </div>
          <div className="flex-1 h-48 w-full mt-auto">
            <ReportsChart reports={reports} />
          </div>
        </AnimatedCard>

        <AnimatedCard
          delay={0.2}
          className="bg-[#3D5245] p-8 text-white border-0 flex flex-col justify-between relative overflow-hidden h-full min-h-[300px]"
        >
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full border border-white/10 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-1">Quarterly Snapshot</h3>
            <p className="text-white/60 text-sm font-medium">Summary of field performance</p>
          </div>
          <div className="relative z-10 space-y-4 mt-6">
            {[
              { label: "Analyses Run", value: loading ? "…" : totalAnalyses.toString() },
              { label: "Avg. ROI", value: loading ? "…" : `${avgROI}%` },
              { label: "Best Confidence", value: loading || !reports.length ? "…" : `${Math.round(Math.max(...reports.map((r) => r.crop_confidence)) * 100)}%` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-white/70 text-sm font-medium">{item.label}</span>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Table */}
      <AnimatedCard delay={0.3} className="overflow-hidden">
        <div className="flex justify-between items-center px-8 pt-8 pb-6 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Analysis Archive</h3>
            <p className="text-sm text-gray-500">{loading ? "Loading…" : `${reports.length} record${reports.length !== 1 ? "s" : ""} found`}</p>
          </div>
          <BarChart3 className="w-5 h-5 text-gray-300" />
        </div>
        <ReportsTable />
      </AnimatedCard>
    </AnimatedPage>
  );
}
