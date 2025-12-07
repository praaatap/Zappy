"use client";

import { Activity, ArrowUpRight, Zap, AlertCircle, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      
      {/* 1. Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
            { label: "Active Zaps", value: "12", icon: Zap, color: "text-orange-600", trend: "+2", bg: "bg-orange-50" },
            { label: "Tasks Executed", value: "45.2k", icon: Activity, color: "text-blue-600", trend: "+12%", bg: "bg-blue-50" },
            { label: "Success Rate", value: "99.8%", icon: TrendingUp, color: "text-green-600", trend: "+0.2%", bg: "bg-green-50" },
            { label: "Task Usage", value: "78%", icon: Calendar, color: "text-purple-600", trend: "Level", bg: "bg-purple-50" },
        ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0px_2px_4px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{stat.value}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
            </div>
        ))}
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-[0px_2px_4px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Task Volume</h3>
                    <p className="text-sm text-slate-500">Execution history over time</p>
                </div>
                <div className="flex bg-slate-100 rounded-lg p-1">
                    <button className="px-3 py-1 bg-white text-xs font-bold rounded shadow-sm text-slate-800">7D</button>
                    <button className="px-3 py-1 text-xs font-medium rounded text-slate-500 hover:text-slate-800">30D</button>
                </div>
            </div>
            
            {/* CSS Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-3 px-2">
                 {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                     <div key={i} className="w-full relative group">
                         <div 
                            className="w-full bg-slate-100 rounded-t-sm hover:bg-orange-500 transition-all duration-300 relative"
                            style={{ height: `${h}%` }}
                         >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none transition-opacity">
                                {h * 124} tasks
                            </div>
                         </div>
                     </div>
                 ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium border-t border-slate-50 pt-3">
                 <span>Nov 01</span>
                 <span>Nov 15</span>
                 <span>Nov 30</span>
            </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-[0px_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {[
                    { title: "New Lead from Typeform", zap: "Sales Pipeline", time: "2 min ago", status: "success" },
                    { title: "Failed to update Row", zap: "Inventory Sync", time: "15 min ago", status: "error" },
                    { title: "Slack Message Sent", zap: "Team Alerts", time: "1 hr ago", status: "success" },
                    { title: "Email Sent via Gmail", zap: "Onboarding", time: "3 hrs ago", status: "success" },
                    { title: "Record Created", zap: "CRM Backup", time: "5 hrs ago", status: "success" },
                ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                        <div className={`mt-1 w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.zap}</p>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium group-hover:text-slate-600">{item.time}</div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-slate-50">
                <button className="w-full py-2 text-sm text-slate-600 font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    View Full Log
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}