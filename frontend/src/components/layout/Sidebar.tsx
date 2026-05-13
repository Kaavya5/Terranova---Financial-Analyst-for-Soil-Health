"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  FlaskConical,
  Banknote,
  FileText,
  Bot,
  Settings,
  HelpCircle,
  Plus
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/", icon: LayoutGrid },
    { name: "Soil Analysis", href: "/soil-analysis", icon: FlaskConical },
    { name: "Financials", href: "/financials", icon: Banknote },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "AI Consultant", href: "/chat", icon: Bot },
  ];

  if (pathname === "/") return null;

  return (
    <div className="w-64 h-full bg-[#FCFDFD] border-r border-gray-200 flex flex-col justify-between py-6">
      <div>
        {/* Logo */}
        <div className="px-8 pb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
            TN
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">Terra Nova</h1>
            <p className="text-[10px] text-gray-500 font-semibold tracking-wider">PRECISION AI</p>
          </div>
        </div>

        {/* Primary Nav */}
        <nav className="space-y-1 px-4 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="px-6 space-y-4">
        <Link
          href="/soil-analysis"
          className="w-full bg-primary text-white flex items-center justify-center gap-2 py-3 rounded-full font-medium hover:bg-primary-accent transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Analysis
        </Link>
        <div className="space-y-1 pt-4 border-t border-gray-100">
          <button onClick={() => alert("Settings module coming in v1.1.0")} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
            Settings
          </button>
          <button onClick={() => alert("Support Helpdesk is currently under maintenance.")} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-400" />
            Support
          </button>
        </div>
      </div>
    </div>
  );
}
