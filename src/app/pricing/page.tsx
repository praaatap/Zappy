"use client";

import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* Simple Nav */}
      <nav className="border-b border-slate-100 p-6 flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center text-white">Z</div> Zappy
          </Link>
          <Link href="/login" className="font-bold hover:text-orange-600">Login</Link>
      </nav>

      <div className="py-20 px-6 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Simple, transparent pricing.</h1>
          <p className="text-xl text-slate-500 mb-10">Start for free, scale as you grow.</p>

          {/* Toggle */}
          <div className="flex justify-center items-center gap-4 mb-16">
              <span className={`text-sm font-bold ${!annual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
              <button 
                onClick={() => setAnnual(!annual)}
                className="w-14 h-8 bg-slate-900 rounded-full relative transition-colors"
              >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${annual ? 'left-7' : 'left-1'}`}></div>
              </button>
              <span className={`text-sm font-bold ${annual ? 'text-slate-900' : 'text-slate-400'}`}>
                  Yearly <span className="text-orange-600 text-xs ml-1">(Save 20%)</span>
              </span>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
              {/* Free Tier */}
              <div className="border border-slate-200 rounded-2xl p-8 hover:border-slate-300 transition-all">
                  <h3 className="text-xl font-bold mb-2">Free</h3>
                  <p className="text-slate-500 text-sm mb-6">For individuals starting out.</p>
                  <div className="text-4xl font-extrabold mb-6">$0<span className="text-base text-slate-400 font-medium">/mo</span></div>
                  <Link href="/signup">
                      <button className="w-full py-3 border border-slate-200 rounded-lg font-bold hover:bg-slate-50 transition-colors">Get Started</button>
                  </Link>
                  <div className="mt-8 space-y-4">
                      {["100 tasks / month", "5 Zaps", "15 min update time", "Single user"].map((feat, i) => (
                          <div key={i} className="flex gap-3 text-sm font-medium text-slate-600">
                              <Check className="w-5 h-5 text-slate-400" /> {feat}
                          </div>
                      ))}
                  </div>
              </div>

              {/* Pro Tier (Highlighted) */}
              <div className="border-2 border-orange-600 rounded-2xl p-8 relative shadow-2xl shadow-orange-100">
                  <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">POPULAR</div>
                  <h3 className="text-xl font-bold mb-2">Pro</h3>
                  <p className="text-slate-500 text-sm mb-6">For automation power users.</p>
                  <div className="text-4xl font-extrabold mb-6">${annual ? '19' : '29'}<span className="text-base text-slate-400 font-medium">/mo</span></div>
                  <Link href="/signup">
                      <button className="w-full py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg">Start Free Trial</button>
                  </Link>
                  <div className="mt-8 space-y-4">
                      {["50,000 tasks / month", "Unlimited Zaps", "2 min update time", "Filters & Logic", "3 Premium Apps"].map((feat, i) => (
                          <div key={i} className="flex gap-3 text-sm font-medium text-slate-900">
                              <Check className="w-5 h-5 text-orange-600" /> {feat}
                          </div>
                      ))}
                  </div>
              </div>

              {/* Team Tier */}
              <div className="border border-slate-200 rounded-2xl p-8 hover:border-slate-300 transition-all bg-slate-50">
                  <h3 className="text-xl font-bold mb-2">Team</h3>
                  <p className="text-slate-500 text-sm mb-6">For scaling organizations.</p>
                  <div className="text-4xl font-extrabold mb-6">${annual ? '299' : '399'}<span className="text-base text-slate-400 font-medium">/mo</span></div>
                   <Link href="/signup">
                      <button className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">Contact Sales</button>
                  </Link>
                  <div className="mt-8 space-y-4">
                      {["2,000,000 tasks / month", "Unlimited Zaps", "1 min update time", "Unlimited Users", "SSO & Advanced Security"].map((feat, i) => (
                          <div key={i} className="flex gap-3 text-sm font-medium text-slate-600">
                              <Check className="w-5 h-5 text-slate-400" /> {feat}
                          </div>
                      ))}
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
}