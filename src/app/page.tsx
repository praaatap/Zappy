"use client";

import { Check, Zap, Play, ArrowRight, Shield, Globe, Cpu, BarChart3, Layers, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  
  // Navigation Items Config
  const navItems = [
    { name: 'Product', href: '#features' },
    { name: 'Solutions', href: '#features' },
    { name: 'Customers', href: '#trusted' },
    { name: 'Pricing', href: '/pricing' }, // Points to the pricing page we made
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden scroll-smooth">
      
      {/* 1. GLASS NAVBAR */}
      <nav className="fixed w-full z-50 top-0 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">
          {/* Logo - Clicks to Top */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
             <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">Z</div>
             <span className="font-bold text-xl tracking-tight">Zappy</span>
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
              {navItems.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    className="hover:text-orange-600 transition-colors relative group"
                  >
                      {item.name}
                      <span className="absolute inset-x-0 -bottom-5 h-0.5 bg-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
              ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
              <Link href="/login">
                  <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors">
                    Log in
                  </button>
              </Link>
              <Link href="/signup">
                  <button className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 border border-slate-800">
                      Start Free
                  </button>
              </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-orange-100/50 to-transparent rounded-[100%] blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-bold uppercase tracking-wide mb-8 hover:border-orange-200 hover:text-orange-600 transition-colors cursor-pointer">
                <Sparkles className="w-3 h-3 text-orange-500 fill-orange-500" />
                <span>v2.0 is live: AI Agents</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[0.95] text-slate-900">
              Automate work. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 animate-gradient bg-300%">
                Unleash speed.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Connect your apps and let AI handle the rest. <br className="hidden md:block" />
              Build powerful workflows in minutes, not months.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup">
                    <button className="h-14 px-8 bg-orange-600 hover:bg-orange-500 text-white text-lg font-bold rounded-full transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 group">
                        Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>
                <Link href="/#features">
                    <button className="h-14 px-8 bg-white text-slate-700 border border-slate-200 hover:border-slate-300 text-lg font-bold rounded-full transition-all flex items-center gap-2 hover:bg-slate-50">
                        <Play className="w-5 h-5 fill-slate-700" /> View Demo
                    </button>
                </Link>
            </div>
        </div>
      </section>

      {/* 3. HERO VISUAL (MOCK UI) */}
      <section className="px-4 pb-24">
        <div className="max-w-6xl mx-auto bg-slate-900 rounded-xl p-3 shadow-2xl ring-1 ring-slate-900/10">
            <div className="bg-slate-950 rounded-lg overflow-hidden relative border border-slate-800 aspect-[16/9] md:aspect-[21/9] flex items-center justify-center">
                 {/* Visual Abstract Flow */}
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 to-transparent opacity-50"></div>
                 <div className="relative z-10 flex items-center gap-8 md:gap-12 animate-in fade-in zoom-in duration-1000">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20"><Globe className="w-10 h-10 text-blue-600" /></div>
                        <div className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-slate-400">Webhook</div>
                    </div>
                    
                    {/* Animated Line */}
                    <div className="w-16 md:w-32 h-[2px] bg-slate-700 relative overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent w-1/2 animate-[shimmer_2s_infinite] translate-x-[-100%]"></div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                         <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20"><Zap className="w-10 h-10 text-green-600 fill-green-600" /></div>
                         <div className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-slate-400">Process</div>
                    </div>

                     <div className="w-16 md:w-32 h-[2px] bg-slate-700 relative overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent w-1/2 animate-[shimmer_2s_infinite_0.5s] translate-x-[-100%]"></div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                         <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/20"><BarChart3 className="w-10 h-10 text-purple-600" /></div>
                         <div className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-slate-400">Database</div>
                    </div>
                 </div>
            </div>
        </div>
      </section>

      {/* 4. INFINITE MARQUEE - Added ID for "Customers" Link */}
      <section id="trusted" className="py-10 border-y border-slate-100 bg-slate-50/50 overflow-hidden">
        <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Powering the next generation of startups</p>
        <div className="relative flex overflow-x-hidden group">
            <div className="animate-marquee whitespace-nowrap flex gap-16 text-2xl font-bold text-slate-300 items-center">
                <span>ACME INC</span> <span>VERTEX</span> <span>PLURAL</span> <span>NEXTGEN</span> <span>STRATOS</span> <span>ORBITAL</span>
                <span>ACME INC</span> <span>VERTEX</span> <span>PLURAL</span> <span>NEXTGEN</span> <span>STRATOS</span> <span>ORBITAL</span>
            </div>
        </div>
      </section>

      {/* 5. BENTO GRID FEATURES - Added ID for "Product" Link */}
      <section id="features" className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="mb-20 max-w-2xl">
                <h2 className="text-4xl font-bold mb-6 text-slate-900 tracking-tight">One platform. <br /> Infinite possibilities.</h2>
                <p className="text-xl text-slate-500">Stop juggling distinct tools. Zappy unifies your stack into a cohesive operating system.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                {/* Large Item */}
                <div className="md:col-span-2 row-span-1 bg-slate-50 rounded-3xl border border-slate-100 p-8 relative overflow-hidden group hover:border-slate-200 transition-colors">
                    <div className="absolute top-8 right-8 text-orange-600 bg-orange-100 p-3 rounded-2xl"><Cpu className="w-6 h-6" /></div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Visual Logic Builder</h3>
                            <p className="text-slate-500 max-w-md">Drag, drop, and connect. Create complex branching logic without writing a single line of code.</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 w-2/3 mt-8 group-hover:translate-y-[-10px] transition-transform duration-500">
                            <div className="flex gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-red-400"></div><div className="w-2 h-2 rounded-full bg-yellow-400"></div><div className="w-2 h-2 rounded-full bg-green-400"></div></div>
                            <div className="space-y-2">
                                <div className="h-2 bg-slate-100 rounded w-3/4"></div>
                                <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Small Item */}
                <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 relative overflow-hidden hover:border-slate-200 transition-colors">
                     <div className="absolute top-8 right-8 text-blue-600 bg-blue-100 p-3 rounded-2xl"><Globe className="w-6 h-6" /></div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2 mt-auto pt-20">5,000+ Apps</h3>
                     <p className="text-slate-500 text-sm">Connect everything from Salesforce to Notion.</p>
                </div>

                {/* Small Item */}
                <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 relative overflow-hidden hover:border-slate-200 transition-colors">
                     <div className="absolute top-8 right-8 text-purple-600 bg-purple-100 p-3 rounded-2xl"><Shield className="w-6 h-6" /></div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2 mt-auto pt-20">Enterprise Grade</h3>
                     <p className="text-slate-500 text-sm">SOC2 Type II, GDPR, and SSO included.</p>
                </div>

                {/* Large Item */}
                <div className="md:col-span-2 row-span-1 bg-slate-900 rounded-3xl border border-slate-800 p-8 relative overflow-hidden group text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full blur-[100px] opacity-20 -mr-16 -mt-16"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                         <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><Zap className="w-5 h-5 text-orange-400" /></div>
                            <span className="font-mono text-orange-400 text-sm">Real-time Execution</span>
                         </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Instant Triggers</h3>
                            <p className="text-slate-400 max-w-md">Don't wait 15 minutes. Zappy executes your workflows the millisecond data arrives.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-20 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6 text-white">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-600 to-amber-600 rounded flex items-center justify-center font-bold text-xs">Z</div>
                    <span className="font-bold text-xl tracking-tight">Zappy</span>
                </div>
                <p className="text-sm leading-relaxed max-w-xs text-slate-500">
                    The automation platform for modern teams. <br />
                    Designed in California.
                </p>
            </div>
            {['Product', 'Company', 'Resources'].map((head, i) => (
                <div key={i}>
                    <h4 className="text-white font-bold mb-6 text-sm tracking-wide">{head}</h4>
                    <ul className="space-y-3 text-sm">
                        {[1,2,3,4].map(k => (
                             <li key={k}><Link href="#" className="hover:text-white transition-colors">Link Item {k}</Link></li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center text-slate-600">
            <p>© 2024 Zappy Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy</span>
                <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms</span>
                <span className="hover:text-slate-400 cursor-pointer transition-colors">Twitter</span>
            </div>
        </div>
      </footer>
      
      {/* GLOBAL ANIMATION STYLES */}
      <style jsx global>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            animation: marquee 30s linear infinite;
        }
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}