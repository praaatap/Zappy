"use client";

import { useState } from "react";
import { Search, Folder, Filter, MoreHorizontal, ArrowUpRight, PlayCircle } from "lucide-react";
import Link from "next/link";

const MOCK_ZAPS = [
    { id: "1", name: "Email Lead Notification", lastRun: "2 mins ago", status: true, apps: ["webhook", "email"], folder: "Sales" },
    { id: "2", name: "Save Slack Messages to Sheets", lastRun: "1 hour ago", status: true, apps: ["slack", "google-sheets"], folder: "Internal" },
    { id: "3", name: "New Jira Issue -> Trello Card", lastRun: "Never", status: false, apps: ["jira", "trello"], folder: "Dev" },
    { id: "4", name: "Weekly Report Generation", lastRun: "3 days ago", status: false, apps: ["google-drive", "email"], folder: "Reporting" },
    { id: "5", name: "Typeform to Salesforce", lastRun: "5 hours ago", status: true, apps: ["typeform", "salesforce"], folder: "Sales" },
];

export default function MyZaps() {
    const [activeTab, setActiveTab] = useState("All");

    return (
        <div className="space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">My Zaps</h1>
                <Link href="/zap/create">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2">
                        <PlayCircle className="w-4 h-4" /> Create Zap
                    </button>
                </Link>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex gap-1">
                    {["All", "Active", "Drafts", "Trash"].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search Zaps..." 
                            className="pl-9 pr-4 py-2 rounded-lg text-sm border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 w-64 transition-all"
                        />
                    </div>
                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><Folder className="w-4 h-4" /></button>
                 </div>
            </div>

            {/* Zaps Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Apps</th>
                            <th className="px-6 py-4">Last Run</th>
                            <th className="px-6 py-4">Folder</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_ZAPS.map((zap) => (
                            <tr key={zap.id} className="group hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
                                            {zap.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors cursor-pointer">{zap.name}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Edit <ArrowUpRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex -space-x-2">
                                        {zap.apps.map((app, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm relative z-0 hover:z-10 hover:scale-110 transition-transform">
                                                 <img 
                                                    src={`https://cdn-icons-png.flaticon.com/512/${app === 'webhook' ? '3295/3295467' : app.includes('slack') ? '2111/2111615' : '542/542638'}.png`} 
                                                    className="w-4 h-4 opacity-80"
                                                    alt={app}
                                                    onError={(e) => (e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/3523/3523063.png")}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                    {zap.lastRun}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                                        <Folder className="w-3 h-3" /> {zap.folder}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={zap.status} readOnly />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                        <button className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1.5 rounded transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}