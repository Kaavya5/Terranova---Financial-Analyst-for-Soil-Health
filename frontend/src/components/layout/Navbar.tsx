"use client";

import { Bell, Settings, Search, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <header className="h-20 w-full flex items-center justify-between px-8 bg-[#FCFDFD] border-b border-gray-100">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-bold text-gray-900 text-lg">Terra Nova</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-primary">Overview</Link>
            <Link href="/soil-analysis" className="text-gray-500 hover:text-gray-900 transition-colors">Soil Analysis</Link>
            <Link href="/financials" className="text-gray-500 hover:text-gray-900 transition-colors">Financials</Link>
            <Link href="/reports" className="text-gray-500 hover:text-gray-900 transition-colors">Reports</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." className="bg-gray-100 border-none rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-48" />
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <Link href="/soil-analysis" className="bg-[#183525] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary transition-colors flex items-center gap-1 shadow-sm">
            Analyze Soil <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="h-20 w-full flex items-center justify-between px-8 bg-[var(--background)]">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search farm records, crops, or data points..."
            className="w-full bg-white border border-gray-200 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">Dr. Aris Thorne</p>
            <p className="text-[11px] text-gray-500">Chief Agronomist</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center text-primary font-bold">
              AT
            </div>
            {/* If you add an image later: <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" /> */}
          </div>
        </div>
      </div>
    </header>
  );
}
