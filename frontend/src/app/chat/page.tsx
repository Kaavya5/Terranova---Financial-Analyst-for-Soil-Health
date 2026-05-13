"use client";

import { Send, Activity } from "lucide-react";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatSessionList } from "@/components/chat/ChatSessionList";
import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are SoilAI, an expert agricultural advisor built into the Terra Nova precision farming platform. You have deep knowledge of:
- Soil science and fertility management (NPK, pH, micronutrients)
- Crop agronomy and cultivation techniques for Indian conditions
- Financial planning for farmers (cost estimation, ROI, market prices in INR)
- Fertilizer recommendations and nutrient management
- Pest and disease management
- Water and irrigation management
- Indian agricultural markets, MSP (Minimum Support Price), and government schemes

Be concise, practical, and empathetic. Use simple language. When discussing costs, always use Indian Rupees (₹). Suggest sustainable farming practices where possible.`;

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getPredictionContext = (): string => {
    try {
      const data = localStorage.getItem("latestPrediction");
      if (!data) return "";
      const p = JSON.parse(data);
      return `\n\nThe farmer's latest soil analysis result:
- Recommended crop: ${p.recommended_crop} (confidence: ${Math.round((p.crop_confidence || 0) * 100)}%)
- Estimated yield: ${p.yield_kg_per_ha || "N/A"} kg/ha over ${p.area_ha || 1} ha
- Total cost estimate: ₹${Math.round(p.financial?.total_cost || 0).toLocaleString("en-IN")}
- Expected profit: ₹${Math.round(p.financial?.expected_profit || 0).toLocaleString("en-IN")}
- ROI: ${(p.financial?.roi_percentage || 0).toFixed(1)}%
- Alternative crops: ${(p.alternative_crops || []).map((c: any) => c.crop).join(", ") || "none"}
Use this context to give specific, relevant advice when the farmer asks about their crop or finances.`;
    } catch {
      return "";
    }
  };

  const handleSend = async (overrideText?: string) => {
    const userMsg = (overrideText ?? input).trim();
    if (!userMsg || loading) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      if (!apiKey) throw new Error("NEXT_PUBLIC_GROQ_API_KEY is not set.");

      // Build conversation history for Groq API (OpenAI-compatible format)
      const apiMessages = [
        { role: "system", content: SYSTEM_PROMPT + getPredictionContext() },
        ...newMessages.map((m) => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.content,
        })),
      ];

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 800,
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || "Groq API error");
      }

      const data = await response.json();
      const reply =
        data?.choices?.[0]?.message?.content ||
        "Sorry, I couldn't generate a response. Please try again.";

      setMessages((prev) => [...prev, { role: "ai", content: reply }]);
    } catch (e: any) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `Error: ${e.message || "Could not connect to AI service. Please check your GROQ API key."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "Why was this crop recommended?",
    "How can I increase my yield?",
    "What fertilizers should I use?",
    "Explain the cost breakdown",
  ];

  return (
    <AnimatedPage className="flex h-[calc(100vh-80px)] max-w-7xl mx-auto -m-8 pb-4">
      {/* Sessions Sidebar */}
      <div className="w-80 border-r border-gray-100 bg-[#F9FBFB] p-6 flex flex-col pt-10">
        <h3 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-6 pl-2">
          Past Sessions
        </h3>
        <ChatSessionList />
        <div className="bg-[#2B4738] rounded-xl p-5 text-left mt-6 shadow-inner relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
          <p className="text-[10px] font-bold text-white/50 tracking-wider uppercase mb-2">
            Powered by
          </p>
          <p className="text-white/90 text-sm leading-relaxed font-medium">
            Groq × Llama 3.3 70B — context-aware of your latest soil analysis.
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="text-center py-6 border-b border-gray-50 bg-white/50 backdrop-blur sticky top-0 z-10">
          <span className="text-[10px] font-bold text-gray-400">
            SoilAI Agronomist —{" "}
            {new Date().toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-[#F4F8F6] rounded-full flex items-center justify-center">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mt-2">
                Welcome to SoilAI
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your AI agronomist is aware of your latest soil analysis. Ask
                anything about your crop recommendation, costs, fertilizers, or
                farming strategy.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <ChatMessage
                key={idx}
                role={msg.role}
                content={msg.content}
                delay={0.05}
              />
            ))
          )}

          {loading && (
            <div className="flex gap-4 max-w-3xl items-center pl-12 text-sm text-gray-400 font-medium pb-8 border-b border-gray-50 animate-pulse">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Activity className="w-3 h-3" />
              </div>
              SoilAI is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 pt-4 bg-white border-t border-gray-50">
          <div className="flex gap-3 justify-center mb-6 flex-wrap">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                disabled={loading}
                className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm bg-white hover:border-gray-300 disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto flex gap-3 relative shadow-sm hover:shadow-md transition-shadow rounded-2xl border border-gray-200 bg-[#FAFAFA] p-2 items-end focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-3 px-2 focus:outline-none placeholder-gray-400 text-gray-700 min-h-[48px] self-center disabled:opacity-70"
              placeholder="Ask your digital agronomist anything..."
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="w-12 h-12 bg-[#1B3B2B] text-white rounded-[14px] flex items-center justify-center hover:bg-primary-accent transition-transform hover:scale-105 active:scale-95 shrink-0 mb-0.5 shadow-md disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </div>

          <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-4">
            AI-generated insights should be verified with on-site soil sampling
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}
