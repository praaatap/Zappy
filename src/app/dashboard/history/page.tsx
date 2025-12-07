"use client";

import { CheckCircle2, XCircle, Search, Filter, RefreshCw, ExternalLink } from "lucide-react";
import { useState } from "react";

const MOCK_LOGS = [
    { id: "log_9283", zapName: "Email Lead Notification", status: "Success", time: "Oct 24, 10:23:45 AM", duration: "1.2s", data_in: "24KB" },
    { id: "log_9284", zapName: "Save Slack Messages", status: "Success", time: "Oct 24, 10:15:00 AM", duration: "0.8s", data_in: "12KB" },
    { id: "log_9285", zapName: "Jira Issue Sync", status: "Error", time: "Oct 24, 09:45:12 AM", duration: "5.4s", data_in: "45KB", error: "Timeout: Jira API did not respond." },
    { id: "log_9286", zapName: "Typeform -> Salesforce", status: "Success", time: "Oct 23, 04:20:00 PM", duration: "2.1s", data_in: "15KB" },
    { id: "log_9287", zapName: "Email Lead Notification", status: "Success", time: "Oct 23, 02:10:33 PM", duration: "1.1s", data_in: "24KB" },
];

export default function HistoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Run History</h1>
                    <p className="text-slate-500 text-sm">View logs and debug your automations.</p>
                </div>
                <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:border-orange-200 transition-all shadow-sm">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search by Zap name or ID..." 
                        className="w-full pl-9 pr-4 py-2 rounded-lg text-sm border-none bg-transparent focus:ring-0"
                    />
                </div>
                <div className="h-9 w-px bg-slate-200 my-auto"></div>
                <div className="flex items-center gap-2 pr-2">
                    <select className="text-sm font-medium text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer">
                        <option>All Statuses</option>
                        <option>Success</option>
                        <option>Error</option>
                    </select>
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Zap Name</th>
                            <th className="px-6 py-4">Time</th>
                            <th className="px-6 py-4">Duration</th>
                            <th className="px-6 py-4">Data</th>
                            <th className="px-6 py-4 text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_LOGS.map((log) => (
                            <tr key={log.id} className="group hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                        log.status === "Success" 
                                            ? "bg-green-50 text-green-700 border-green-100" 
                                            : "bg-red-50 text-red-700 border-red-100"
                                    }`}>
                                        {log.status === "Success" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        {log.status}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {log.zapName}
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.id}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{log.time}</td>
                                <td className="px-6 py-4 text-sm text-slate-500 font-mono">{log.duration}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{log.data_in}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                        <ExternalLink className="w-4 h-4 ml-auto" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}