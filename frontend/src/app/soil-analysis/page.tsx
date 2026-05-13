"use client";

import { useState } from "react";
import { FlaskConical, Thermometer, MapPin, BadgeCheck, CheckCircle2, Ruler, IndianRupee } from "lucide-react";
import { AnimatedPage, AnimatedCard } from "@/components/ui/AnimatedPage";
import { Badge } from "@/components/ui/Badge";
import { NutrientSlider } from "@/components/soil/NutrientSlider";
import { EnvParameter } from "@/components/soil/EnvParameter";
import { submitPrediction } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SoilAnalysisPage() {
  const [formData, setFormData] = useState({
    nitrogen: 42,
    phosphorus: 28,
    potassium: 75,
    ph: 6.4,
    temperature: 24.5,
    humidity: 62,
    rainfall: 112,
    area_ha: 1,
    market_price_per_kg: undefined as number | undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await submitPrediction(formData);
      localStorage.setItem("latestPrediction", JSON.stringify(response));
      router.push("/financials");
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the AI backend. Please ensure the server is running.");
      setLoading(false);
    }
  };

  return (
    <AnimatedPage className="max-w-[1200px] mx-auto pb-10">
      <div className="mb-8">
        <span className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1 block">Analysis Module 4.0</span>
        <h1 className="text-4xl font-bold text-primary mb-3">Soil Composition Input</h1>
        <p className="text-gray-600 max-w-2xl text-[15px] leading-relaxed">
          Enter your soil nutrient values and environmental parameters. The AI will recommend the optimal crop and generate a full financial forecast.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Macronutrients */}
          <AnimatedCard delay={0.1} className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Macronutrients (N-P-K)</h2>
            </div>
            <div className="space-y-10">
              <NutrientSlider
                label="Nitrogen" symbol="N" value={formData.nitrogen}
                onChange={(v) => setFormData((p) => ({ ...p, nitrogen: v }))}
                statusLabels={["Deficient", "Optimal Range (40–60)", "Excessive"]}
              />
              <NutrientSlider
                label="Phosphorus" symbol="P" value={formData.phosphorus}
                onChange={(v) => setFormData((p) => ({ ...p, phosphorus: v }))}
                statusLabels={["Deficient", "Below Optimal", "Excessive"]}
                statusColors={["text-gray-400", "text-red-500", "text-gray-400"]}
              />
              <NutrientSlider
                label="Potassium" symbol="K" value={formData.potassium}
                onChange={(v) => setFormData((p) => ({ ...p, potassium: v }))}
                statusLabels={["Deficient", "Optimal", "High Yield"]}
                statusColors={["text-gray-400", "text-gray-400", "text-gray-900"]}
              />
            </div>
          </AnimatedCard>

          {/* Environmental Parameters */}
          <AnimatedCard delay={0.2} className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#f4ece4] flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-[#9a6245]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Environmental Parameters</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <EnvParameter label="Soil pH Level" value={formData.ph} onChange={(v) => setFormData((p) => ({ ...p, ph: v }))} unit="Slightly Acidic" />
              <EnvParameter label="Ambient Temperature" value={formData.temperature} onChange={(v) => setFormData((p) => ({ ...p, temperature: v }))} unit="°C" />
              <EnvParameter label="Relative Humidity" value={formData.humidity} onChange={(v) => setFormData((p) => ({ ...p, humidity: v }))} unit="%" />
              <EnvParameter label="Monthly Rainfall" value={formData.rainfall} onChange={(v) => setFormData((p) => ({ ...p, rainfall: v }))} unit="mm" />
            </div>
          </AnimatedCard>

          {/* Field & Market Settings */}
          <AnimatedCard delay={0.25} className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Field & Market Settings</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Field Area (hectares)
                </label>
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={formData.area_ha}
                  onChange={(e) => setFormData((p) => ({ ...p, area_ha: parseFloat(e.target.value) || 1 }))}
                  className="input-field font-bold text-gray-900"
                />
                <p className="text-[11px] text-gray-400 mt-1">Used for total yield & cost estimation</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Market Price Override (₹/kg) — optional
                </label>
                <input
                  type="number"
                  min={1}
                  step={0.5}
                  placeholder="Auto (uses crop defaults)"
                  value={formData.market_price_per_kg ?? ""}
                  onChange={(e) => setFormData((p) => ({ ...p, market_price_per_kg: e.target.value ? parseFloat(e.target.value) : undefined }))}
                  className="input-field font-bold text-gray-900"
                />
                <p className="text-[11px] text-gray-400 mt-1">Leave blank to use default MSP prices</p>
              </div>
            </div>
          </AnimatedCard>

          <div className="flex items-center justify-end gap-6 pt-4">
            <button
              onClick={() => setFormData({ nitrogen: 42, phosphorus: 28, potassium: 75, ph: 6.4, temperature: 24.5, humidity: 62, rainfall: 112, area_ha: 1, market_price_per_kg: undefined })}
              className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-primary text-white px-8 py-3.5 rounded-full font-medium hover:bg-primary-accent transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-sm inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? "Processing Earth Data..." : "Generate AI Insights"}
            </button>
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="space-y-6">
          <AnimatedCard delay={0.3} className="bg-[#3D5245] rounded-3xl p-8 text-white border-0">
            <div className="flex justify-between items-start mb-6">
              <span className="text-white/80 font-semibold">Data Fidelity</span>
              <Badge variant="primary">High Trust</Badge>
            </div>
            <div className="flex items-start gap-4 mb-8">
              <h3 className="text-6xl font-bold text-[#A8C7B5]">88<span className="text-4xl">%</span></h3>
              <p className="text-sm text-white/80 leading-snug">
                Fidelity calculated from seasonal benchmarks and model training confidence.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "N-P-K ratios align with prior sensor logs.",
                "Environmental data matches regional GIS feed.",
                "pH override flag logged for audit trail.",
              ].map((note, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${i === 2 ? "text-white/30" : "text-[#A8C7B5]"}`} />
                  <p className={`text-xs leading-relaxed ${i === 2 ? "text-white/30 italic" : "text-white/80"}`}>{note}</p>
                </div>
              ))}
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.4} className="rounded-3xl overflow-hidden relative h-40 border-0 p-0">
            <div className="absolute inset-0 bg-gray-900">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] text-primary-light font-bold tracking-wider uppercase mb-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> Active Survey Location
              </span>
              <h4 className="text-white font-bold text-lg">Plot 7A — Northern Sector</h4>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.5} className="p-6 border-l-4 border-l-primary">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <BadgeCheck className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-bold text-gray-900 text-sm">How it works</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your soil data is sent to a trained Random Forest model that predicts the best crop, then a cost engine estimates fertilizer, labor, irrigation, and seed expenses to produce your financial forecast.
            </p>
          </AnimatedCard>
        </div>
      </div>
    </AnimatedPage>
  );
}
