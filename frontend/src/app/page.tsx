"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Droplet, Bug, Radio, Activity } from "lucide-react";
import { AnimatedPage, AnimatedCard } from "@/components/ui/AnimatedPage";
import { FlaskConical } from "lucide-react";

export default function LandingPage() {
  return (
    <AnimatedPage className="max-w-[1200px] mx-auto pb-20">
      {/* Hero Section */}
      <AnimatedCard delay={0.1} className="relative rounded-3xl overflow-hidden mb-16 p-0 border-0 shadow-2xl min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center top-0 left-0 right-0 bottom-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F0F5F2] via-[#F0F5F2]/90 to-transparent z-0 pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-12 lg:p-20 items-center">
          <div>
            <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-primary bg-primary/10 tracking-wide uppercase mb-6">
              Precision AI • Future of Farming
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-primary tracking-tight leading-[1.1] mb-6">
              Smart Farming <br/> with AI
            </h1>
            <p className="text-gray-600 text-lg max-w-md mb-10 leading-relaxed font-medium">
              Harness the power of digital agronomy. Our precision neural networks process millions of soil data points to deliver actionable insights for the modern producer.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/soil-analysis"
                className="bg-primary text-white px-8 py-3.5 rounded-full font-medium hover:bg-primary-accent transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-md"
              >
                Analyze Soil <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="text-gray-700 font-semibold flex items-center gap-2 hover:text-primary transition-colors">
                View Live Demo
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl w-72 transform lg:-rotate-2 border border-white hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-500">Soil Health Score</span>
                <FlaskConical className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <h2 className="text-4xl font-bold text-gray-900">94.2</h2>
                <span className="text-sm font-semibold text-success">Optimal</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-primary rounded-full w-[94%]" />
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-medium mt-1 mb-4">
                <span>Nitrogen: 94%</span>
                <span>Moisture: 92%</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-tight italic">
                *Predicted yield increase of 12% in Sector B based on current conditions.
              </p>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Precision Core */}
      <div className="mb-20">
        <div className="mb-10 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Precision Core</h2>
          <p className="text-gray-500 max-w-2xl text-lg mx-auto lg:mx-0">
            Multi-layered intelligence designed to handle every aspect of the crop cycle, from preparation to harvest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatedCard delay={0.2} className="p-8 lg:col-span-2 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
              <BarChart3 className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Yield Prediction</h3>
            <p className="text-gray-600 mb-8 max-w-md">
              Deep learning models forecast harvest outcomes with 96.4% historical accuracy across multiple grain types.
            </p>
            <Link href="/financials" className="inline-flex text-sm font-semibold text-primary hover:text-primary-accent items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explore Analytics <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedCard>
          
          <AnimatedCard delay={0.3} className="p-8 bg-[#F9ECE4] border-0 hover:shadow-xl transition-shadow group flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-[#9A6245]/10 flex items-center justify-center mb-6">
              <Droplet className="w-6 h-6 text-[#9A6245]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 mt-auto">Irrigation Control</h3>
            <p className="text-gray-600 text-sm">
              Autonomous micro-drip adjustment based on real-time evapotranspiration sensors.
            </p>
          </AnimatedCard>

          <AnimatedCard delay={0.4} className="p-8 bg-primary text-white border-0 hover:shadow-xl transition-shadow group flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
              <Bug className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 mt-auto">Pest Detection</h3>
            <p className="text-white/70 text-sm">
              UAV pixel-level scanning identifies crop pathogens before they spread.
            </p>
          </AnimatedCard>

          <AnimatedCard delay={0.5} className="p-8 lg:col-span-2 relative overflow-hidden bg-gray-900 border-0 flex flex-col justify-end group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586771107445-d3af1111516e?q=80&w=1000&auto=format&fit=crop')] opacity-40 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Satellite Field Mapping</h3>
              <p className="text-white/80 text-sm max-w-md">
                NDVI spectral analysis updated every 24 hours to monitor photosynthesis levels across all sectors.
              </p>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Decisions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <AnimatedCard delay={0.6} className="bg-transparent border-0 shadow-none p-0">
          <h2 className="text-4xl font-bold text-primary mb-12">Decisions driven by<br/>deep earth data.</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4 group">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100 group-hover:border-primary/50 transition-colors">
                <Radio className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">LoRaWAN Integration</h3>
                <p className="text-gray-500 mt-1">Long-range sensor connectivity that works even in the most remote fields without cellular service.</p>
              </div>
            </div>
            
            <Link href="/chat" className="flex gap-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100 group-hover:border-primary/50 transition-colors">
                <Activity className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">AI Consultant</h3>
                <p className="text-gray-500 mt-1">Your digital agronomist is available 24/7 to answer complex chemical and biological queries.</p>
              </div>
            </Link>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.7} className="bg-gray-900 rounded-3xl p-8 relative overflow-hidden h-[400px] flex items-center shadow-2xl border-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#113125] to-gray-900 opacity-80" />
          <div className="relative z-10 w-full bg-[#18231E]/80 backdrop-blur border border-white/10 rounded-xl p-4 shadow-2xl hover:scale-105 transition-transform duration-500">
            <div className="flex gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            </div>
            <div className="h-40 flex items-end gap-1.5 opacity-80 pl-2 pr-2">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="flex-1 bg-primary-light/40 rounded-t-sm animate-pulse" style={{ height: `${(Math.sin(i * 0.5) * 30) + 50}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* CTA Box */}
      <AnimatedCard delay={0.8} className="bg-[#183525] rounded-3xl p-12 text-center relative overflow-hidden border-0 mb-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-accent/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to scale your harvest?</h2>
          <p className="text-white/70 mb-10 text-lg">
            Join 12,000+ precision farmers globally using Terra Nova to increase yields and reduce environmental impact.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/soil-analysis" className="w-full sm:w-auto bg-white text-primary px-8 py-3.5 rounded-full font-bold hover:bg-gray-50 transition-transform hover:scale-105 shadow-lg">
              Start Free Trial
            </Link>
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-white border border-white/20 hover:bg-white/10 transition-colors">
              Talk to Specialist
            </button>
          </div>
        </div>
      </AnimatedCard>

      {/* Footer Wrapper - Escaping max-w constraints slightly using negative margins or full-bleed utility if available, but staying within AnimatedPage */}
      <footer className="w-full bg-[#EFEFEA] rounded-t-3xl border border-gray-200 mt-20 pt-16 pb-8 px-12 -mx-4 md:mx-0 shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Terra Nova</h2>
            <p className="text-gray-500 max-w-xs text-sm mb-6 leading-relaxed">
              Empowering the next generation of farmers with precision intelligence and earth-first technology.
            </p>
            <div className="flex gap-3">
              <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                 <span className="sr-only">Twitter</span>
                 <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </button>
              <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/soil-analysis" className="hover:text-primary transition-colors">Soil Analysis</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Field Forecast</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Hardware</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-primary transition-colors">Research Lab</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Case Studies</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-1">
             <h3 className="font-bold text-gray-900 text-sm mb-4">Subscribe to Field Notes</h3>
             <div className="flex gap-2">
               <input type="email" placeholder="email@farm.com" className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm w-full focus:outline-none focus:border-primary" />
               <button className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                 Join
               </button>
             </div>
             <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wide">
               NEW INSIGHTS EVERY TUESDAY. DIRECT TO YOUR INBOX.
             </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2024 TerraNova AI. All rights reserved. Precision Farm DeepLearning.</p>
          <div className="flex gap-6 text-xs text-gray-400 font-medium uppercase tracking-wider">
            <Link href="#" className="hover:text-gray-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">Sitemap</Link>
          </div>
        </div>
      </footer>

    </AnimatedPage>
  );
}
