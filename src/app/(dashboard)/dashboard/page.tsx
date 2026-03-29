"use client";

import { Activity, Zap, TrendingUp, Calendar, ArrowUpRight, ArrowRight, Loader2 } from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const chartData = [
  { name: "Nov 1", tasks: 4960 }, { name: "Nov 3", tasks: 8060 },
  { name: "Nov 5", tasks: 5580 }, { name: "Nov 8", tasks: 9920 },
  { name: "Nov 11", tasks: 6820 }, { name: "Nov 14", tasks: 11160 },
  { name: "Nov 17", tasks: 8680 }, { name: "Nov 20", tasks: 10540 },
  { name: "Nov 23", tasks: 7440 }, { name: "Nov 26", tasks: 9300 },
  { name: "Nov 28", tasks: 6200 }, { name: "Nov 30", tasks: 11780 },
];

export default function DashboardHome() {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/v1/stats", {
          headers: { Authorization: token }
        });
        setStats(res.data.stats);
        setActivity(res.data.activity);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const statCards = [
    { label: "Active Zaps", value: stats?.activeZaps || 0, icon: Zap, color: "text-orange-600", trend: "+2 this week", bg: "bg-orange-50", ring: "ring-orange-500/10" },
    { label: "Tasks Executed", value: stats?.totalRuns || 0, icon: Activity, color: "text-blue-600", trend: "+12% vs last mo", bg: "bg-blue-50", ring: "ring-blue-500/10" },
    { label: "Success Rate", value: stats?.successRate || "100%", icon: TrendingUp, color: "text-emerald-600", trend: "+0.2% vs last mo", bg: "bg-emerald-50", ring: "ring-emerald-500/10" },
    { label: "Task Usage", value: stats?.taskUsage || "Normal", icon: Calendar, color: "text-purple-600", trend: "Normal limits", bg: "bg-purple-50", ring: "ring-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
        
      {/* ==========================================
          1. STATS GRID
      ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <div 
            key={i} 
            className="bg-white p-6 rounded-[1.5rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Soft background glow on hover */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-2xl`}></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ring-1 ${stat.ring} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.trend.includes("+") && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full ring-1 ring-emerald-500/10">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{stat.trend.split(' ')[0]}</span>
                </div>
              )}
            </div>
            
            <div className="relative z-10">
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1" style={{ fontFamily: 'var(--font-jakarta)' }}>
                    {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-500">
                    {stat.label}
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* ==========================================
          2. MAIN CONTENT GRID (Chart & Feed)
      ========================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* --- Area Chart --- */}
        <div className="xl:col-span-2 bg-white p-6 sm:p-8 rounded-[1.5rem] border border-slate-200/60 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-jakarta)' }}>Task Volume</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">Execution history over the selected period</p>
            </div>
            
            {/* Segmented Control */}
            <div className="flex bg-slate-100/80 p-1 rounded-xl ring-1 ring-slate-200/50 self-start">
              <button className="px-4 py-1.5 bg-white text-xs font-bold rounded-lg shadow-sm text-slate-900 ring-1 ring-slate-200/50 transition-all">7 Days</button>
              <button className="px-4 py-1.5 text-xs font-semibold rounded-lg text-slate-500 hover:text-slate-900 transition-all">30 Days</button>
            </div>
          </div>
          
          <div className="h-[300px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10}
                />
                <YAxis 
                    tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} 
                    axisLine={false} 
                    tickLine={false} 
                    dx={-10}
                />
                <Tooltip
                  contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", fontSize: "13px", color: "#0f172a", padding: "12px 16px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  labelStyle={{ color: "#64748b", fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: "#f97316", fontWeight: 800 }}
                  cursor={{ stroke: '#f1f5f9', strokeWidth: 2, strokeDasharray: '4 4' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#f97316" 
                    strokeWidth={3} 
                    fill="url(#colorTasks)" 
                    name="Tasks Executed" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#f97316' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Activity Feed --- */}
        <div className="bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm flex flex-col h-[450px] xl:h-auto">
          <div className="px-6 py-5 border-b border-slate-100/80">
            <h3 className="text-lg font-extrabold text-slate-900" style={{ fontFamily: 'var(--font-jakarta)' }}>Recent Activity</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            {activity.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                <Activity className="w-8 h-8 opacity-20" />
                <p className="text-sm font-medium">No activity yet</p>
              </div>
            ) : (
              activity.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all duration-200 cursor-pointer group">
                  {/* Glowing Status Dot */}
                  <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ring-4 ${item.status === 'success' ? 'bg-emerald-500 ring-emerald-50' : 'bg-red-500 ring-red-50'}`}></div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">{item.title}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{item.zap}</p>
                  </div>
                  
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex-shrink-0 mt-0.5">
                      {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-[1.5rem]">
            <Link 
                href="/dashboard/history" 
                className="flex items-center justify-center gap-2 w-full py-3 text-sm text-slate-700 font-bold bg-white border border-slate-200/80 rounded-xl hover:border-slate-300 hover:shadow-sm hover:text-slate-900 transition-all active:scale-[0.98]"
            >
              View Full Log <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}