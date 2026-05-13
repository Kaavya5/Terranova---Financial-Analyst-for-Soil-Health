"use client";

import { Bot, User } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChatMessageProps {
  role: "ai" | "user";
  content: ReactNode;
  tools?: ReactNode;
  delay?: number;
}

export function ChatMessage({ role, content, tools, delay = 0 }: ChatMessageProps) {
  const isAI = role === "ai";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn("flex gap-4 max-w-3xl", isAI ? "" : "ml-auto justify-end")}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-[#1B3B2B] flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={cn("flex-1", isAI ? "" : "flex flex-col items-end")}>
        <div 
          className={cn(
            "p-6 text-[15px] leading-relaxed shadow-sm font-medium",
            isAI 
              ? "bg-[#F8FAF9] rounded-2xl rounded-tl-sm text-gray-700 border border-gray-100" 
              : "bg-[#123023] text-white rounded-2xl rounded-tr-sm"
          )}
        >
          {content}
        </div>
        
        {tools && <div className="flex gap-4 mt-4">{tools}</div>}
      </div>

      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-[#F2DDD1] flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-[#8C6B5D]" />
        </div>
      )}
    </motion.div>
  );
}
