"use client";

export function CostBreakdown({ data }: { data?: any }) {
  if (!data) return <div className="h-40 flex flex-col items-center justify-center text-gray-400 font-bold text-sm w-full"><div className="w-5 h-5 border-2 border-gray-200 border-t-primary rounded-full animate-spin mb-2" /> Loading Cost Analysis...</div>;

  const total = Number(data.total_cost) || 1;
  const getHeight = (val: number) => `${Math.max(15, (Number(val) / total) * 100)}%`;

  return (
    <div className="flex gap-4 items-end h-40 w-full justify-center">
      <div className="flex flex-col items-center gap-2 group cursor-pointer">
        <div className="w-12 bg-gray-900 rounded-t-xl transition-all duration-1000 overflow-hidden shadow-sm" style={{ height: getHeight(data.seed_cost) }}>
          <div className="w-full h-full hover:bg-white/20 transition-colors" />
        </div>
        <span className="text-[10px] font-bold tracking-wide text-gray-500 uppercase">Seeds</span>
      </div>
      <div className="flex flex-col items-center gap-2 group cursor-pointer">
        <div className="w-12 bg-primary rounded-t-xl transition-all duration-1000 overflow-hidden shadow-sm" style={{ height: getHeight(data.fertilizer_cost) }}>
          <div className="w-full h-full hover:bg-white/20 transition-colors" />
        </div>
        <span className="text-[10px] font-bold tracking-wide text-gray-500 uppercase">Fertilizer</span>
      </div>
      <div className="flex flex-col items-center gap-2 group cursor-pointer">
        <div className="w-12 bg-gray-300 rounded-t-xl transition-all duration-1000 overflow-hidden shadow-sm" style={{ height: getHeight(data.labor_cost) }}>
          <div className="w-full h-full hover:bg-black/10 transition-colors" />
        </div>
        <span className="text-[10px] font-bold tracking-wide text-gray-500 uppercase">Labor</span>
      </div>
      <div className="flex flex-col items-center gap-2 group cursor-pointer">
        <div className="w-12 bg-gray-200 rounded-t-xl transition-all duration-1000 overflow-hidden shadow-sm flex items-end justify-center pb-2 relative" style={{ height: getHeight(data.irrigation_cost) }}>
          <div className="w-full h-full hover:bg-black/10 transition-colors absolute inset-0" />
        </div>
        <span className="text-[10px] font-bold tracking-wide text-gray-500 uppercase">Irrig.</span>
      </div>
    </div>
  );
}
