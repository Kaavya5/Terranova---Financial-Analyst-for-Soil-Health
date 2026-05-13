"use client";

import { Sparkles, Droplet, Activity, FileText, ChevronRight, TrendingUp } from "lucide-react";
import { AnimatedPage, AnimatedCard } from "@/components/ui/AnimatedPage";
import { MetricCard } from "@/components/ui/MetricCard";
import { YieldProfitChart } from "@/components/charts/YieldProfitChart";
import { CostBreakdown } from "@/components/charts/CostBreakdown";
import { Badge } from "@/components/ui/Badge";
import { useEffect, useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function FinancialsDashboard() {
  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("latestPrediction");
    if (data) {
      try {
        setPrediction(JSON.parse(data));
      } catch (e) {}
    }
  }, []);

  const crop = prediction?.recommended_crop || "Yellow Corn";
  const confidence = prediction ? Math.round(prediction.crop_confidence * 100) : 94;
  const cost = prediction?.financial?.total_cost || 42850;
  const yieldKg = prediction?.total_yield_kg || 18400; // default 18.4t
  const revenue = prediction?.financial?.expected_revenue || 124200;
  const profit = prediction?.financial?.expected_profit || 81350;
  const roi = prediction?.financial?.roi_percentage || 18;

  return (
    <AnimatedPage className="max-w-[1200px] mx-auto pb-10">
      
      {/* Top Grid: Recommendation & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        <AnimatedCard delay={0.1} className="lg:col-span-2 overflow-hidden relative p-8 bg-[#1B3B2B] text-white border-0 min-h-[240px] flex flex-col justify-end">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1000&auto=format&fit=crop')] opacity-20 bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B3B2B] via-[#1B3B2B]/90 to-transparent" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 h-full">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] font-bold tracking-wider uppercase mb-4">
                <Sparkles className="w-3 h-3" /> AI Recommended Crop
              </div>
              <h2 className="text-5xl font-bold mb-4 tracking-tight capitalize">{crop}</h2>
              <p className="text-sm text-white/80 leading-relaxed font-medium max-w-sm">
                Based on current soil nitrogen levels and predicted precipitation patterns, {crop} offers the highest risk-adjusted yield.
              </p>
            </div>
            
            <div className="text-right pb-2">
              <p className="text-[10px] font-bold tracking-wider text-white/60 uppercase mb-1 drop-shadow">Confidence Score</p>
              <div className="flex items-baseline gap-1 justify-end drop-shadow-md">
                <span className="text-6xl font-bold tracking-tighter">{confidence}</span>
                <span className="text-3xl font-bold text-white/80">%</span>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Priority Actions */}
        <AnimatedCard delay={0.2} className="p-6 bg-[#F4F2F1] border-0 flex flex-col">
          <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-5">Priority Actions</h3>
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            
            <button className="flex items-center w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group transform hover:-translate-y-0.5 duration-200">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 shrink-0">
                <Droplet className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">Irrigation Schedule</p>
                <p className="text-xs text-gray-500">Update for Week 24</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
            
            <button className="flex items-center w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group transform hover:-translate-y-0.5 duration-200">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3 shrink-0">
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">Soil Health Audit</p>
                <p className="text-xs text-gray-500">Field B-12 Required</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>

            <button className="flex items-center w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group transform hover:-translate-y-0.5 duration-200">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-3 shrink-0">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">Market Prices</p>
                <p className="text-xs text-gray-500">Updated 2m ago</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>

          </div>
        </AnimatedCard>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
        <AnimatedCard delay={0.3} className="p-0 border-0 shadow-none bg-transparent">
          <MetricCard title="Production Cost" value={formatCurrency(cost)} progressValue={33} progressColorClass="bg-gray-900" className="h-full" />
        </AnimatedCard>
        
        <AnimatedCard delay={0.4} className="p-0 border-0 shadow-none bg-transparent">
          <MetricCard title="Target Yield" value={formatNumber(yieldKg)} unit="kg" badge={<Badge variant="success" className="ml-2 font-bold mb-1 border-0 shadow-none transform translate-y-[-2px]">Optimal</Badge>} progressValue={85} progressColorClass="bg-success" className="h-full" />
        </AnimatedCard>

        <AnimatedCard delay={0.5} className="p-0 border-0 shadow-none bg-transparent">
          <MetricCard title="Proj. Revenue" value={formatCurrency(revenue)} progressValue={66} progressColorClass="bg-gray-900" className="h-full" />
        </AnimatedCard>

        <AnimatedCard delay={0.6} className="p-0 border-0 shadow-none bg-transparent">
          <MetricCard 
            title="Net Profit" value={formatCurrency(profit)} progressValue={100} progressColorClass="bg-success" 
            className="h-full shadow-[0_8px_30px_rgb(16,185,129,0.12)] border-success/20 text-success" 
            badge={<div className="absolute top-4 right-4 flex items-center text-success font-bold text-sm bg-success/10 px-2 py-0.5 rounded"><TrendingUp className="w-3 h-3 mr-1" /> {formatNumber(roi)}%</div>}
          />
        </AnimatedCard>
      </div>

      {/* Bottom Grid: Breakdown, Charts, Extras */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <AnimatedCard delay={0.7} className="p-6 lg:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Cost Breakdown</h3>
            <button className="text-gray-400 hover:text-gray-600 font-bold tracking-widest text-lg">...</button>
          </div>
          <div className="flex-1 flex items-center justify-center py-6">
             <CostBreakdown data={prediction?.financial} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.8} className="p-6 lg:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Yield vs Profit Correlation</h3>
            </div>
            <div className="flex gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Yield</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#A8ACA9]" /> Profit</div>
            </div>
          </div>
          <div className="h-56 mt-4 w-full">
            <YieldProfitChart data={prediction} />
          </div>
        </AnimatedCard>

        {/* Right column: Alternatives & Market Pulse */}
        <AnimatedCard delay={0.9} className="lg:col-span-1 space-y-6 bg-transparent border-0 shadow-none p-0">
          
          {/* Alternatives */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase">Alternative Options</h3>
            
            <div className="flex gap-4 items-center group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gray-900 shrink-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596431289196-10706859599d?w=100&auto=format&fit=crop')] bg-cover opacity-60 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 group-hover:translate-x-1 transition-transform">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-gray-900">Soybeans</h4>
                  <span className="font-bold text-sm text-gray-900">88%</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">Lower water requirement, but reduced nitrogen efficiency for this cycle.</p>
              </div>
            </div>

            <div className="flex gap-4 items-center pt-2 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gray-900 shrink-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&auto=format&fit=crop')] bg-cover opacity-60 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 group-hover:translate-x-1 transition-transform">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-gray-900">Winter Wheat</h4>
                  <span className="font-bold text-sm text-gray-900">74%</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">Stable returns but requires immediate planting window before frost.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#18181B] rounded-2xl p-5 text-white shadow-xl pt-6 hover:shadow-2xl transition-shadow">
            <h3 className="text-[10px] font-bold text-white/50 tracking-wider uppercase mb-4">Market Pulse</h3>
            
            <div className="space-y-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white/90">Corn Futures (DEC)</span>
                <span className="font-bold border border-success/30 bg-success/10 text-success text-xs px-2 py-0.5 rounded">+$0.14</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white/90">Urea Fertilizer</span>
                <span className="font-bold border border-danger/30 bg-danger/10 text-danger text-xs px-2 py-0.5 rounded">+$4.20</span>
              </div>
            </div>

            <p className="text-[10px] text-white/40 italic leading-snug pb-1 border-t border-white/10 pt-4">
              Market volatility remains high due to regional weather patterns in Brazil.
            </p>
          </div>

        </AnimatedCard>

      </div>
    </AnimatedPage>
  );
}
