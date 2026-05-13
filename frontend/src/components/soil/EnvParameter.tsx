"use client";

interface EnvParameterProps {
  label: string;
  value: string | number;
  unit: string;
  onChange?: (val: number) => void;
}

export function EnvParameter({ label, value, unit, onChange }: EnvParameterProps) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">{label}</label>
      <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-primary/50 transition-colors">
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange?.(parseFloat(e.target.value) || 0)}
          className="text-xl font-bold text-gray-900 bg-transparent w-full focus:outline-none"
        />
        <span className="text-gray-500 text-sm font-medium whitespace-nowrap ml-2">{unit}</span>
      </div>
    </div>
  );
}
