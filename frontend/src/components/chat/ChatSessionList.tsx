"use client";

import { useState } from "react";

export function ChatSessionList() {
  const [active, setActive] = useState(0);

  const sessions = [
    { title: "Nitrogen Optimization Phase 2", time: "Today, 10:42 AM" },
    { title: "Yield Forecast for Sector G", time: "Yesterday" },
    { title: "Wheat Root Health Analysis", time: "Oct 12, 2023" },
    { title: "Soil Moisture Anomalies", time: "Oct 10, 2023" },
  ];

  return (
    <div className="space-y-2 flex-1 overflow-y-auto pr-2">
      {sessions.map((session, i) => (
        <button 
          key={i} 
          onClick={() => setActive(i)}
          className={`w-full text-left rounded-2xl p-4 transition-colors border ${
            active === i 
              ? "bg-white shadow-sm border-gray-100 hover:border-gray-200" 
              : "hover:bg-white/50 border-transparent text-gray-700"
          }`}
        >
          <h4 className={`font-bold text-sm mb-1 ${active === i ? "text-gray-900" : ""}`}>{session.title}</h4>
          <span className="text-[10px] font-semibold text-gray-400">{session.time}</span>
        </button>
      ))}
    </div>
  );
}
