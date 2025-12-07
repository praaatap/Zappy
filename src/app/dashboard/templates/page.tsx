"use client";

import { Search, ArrowRight, Zap } from "lucide-react";

const TEMPLATES = [
    { title: "Save Gmail attachments to Google Drive", apps: ["gmail", "google-drive"], uses: "20k+", color: "bg-blue-50" },
    { title: "Send Slack notification for new Leads", apps: ["webhook", "slack"], uses: "15k+", color: "bg-purple-50" },
    { title: "Create Trello card from Jira issue", apps: ["jira", "trello"], uses: "8k+", color: "bg-sky-50" },
    { title: "Post new Instagram photos to Twitter", apps: ["instagram", "twitter"], uses: "50k+", color: "bg-pink-50" },
    { title: "Add new Shopify orders to Sheets", apps: ["shopify", "google-sheets"], uses: "12k+", color: "bg-green-50" },
    { title: "Sync Salesforce Contacts to Mailchimp", apps: ["salesforce", "mailchimp"], uses: "5k+", color: "bg-indigo-50" },
];

export default function TemplatesPage() {
    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto pt-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Explore Automations</h1>
                <p className="text-slate-500 mb-8">Discover thousands of pre-built workflows to save you time.</p>
                
                <div className="relative max-w-lg mx-auto">
                    <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search for 'Slack' or 'Lead generation'..." 
                        className="w-full bg-white border border-slate-200 rounded-full pl-12 pr-4 py-3 shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEMPLATES.map((t, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:border-orange-300 hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer flex flex-col h-full">
                        <div className="flex -space-x-2 mb-4">
                             {t.apps.map((app, k) => (
                                <div key={k} className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-sm z-10 first:z-0">
                                     <img 
                                        src={`https://cdn-icons-png.flaticon.com/512/${app === 'gmail' ? '5968/5968534' : '3523/3523063'}.png`} 
                                        className="w-5 h-5 opacity-90"
                                        onError={(e) => (e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/3523/3523063.png")}
                                    />
                                </div>
                             ))}
                        </div>
                        
                        <h3 className="font-bold text-lg text-slate-900 mb-2 leading-snug">{t.title}</h3>
                        <p className="text-sm text-slate-500 mb-6">{t.uses} people use this</p>
                        
                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-orange-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            Try this Zap <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}