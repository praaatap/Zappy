"use client";

import { X, Search, LayoutGrid } from "lucide-react";

interface AppSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (app: { id: string, name: string, image: string }) => void;
  type: "Trigger" | "Action";
}

// Mock Data for the App Store
const APPS = [
  { id: "webhook", name: "Webhook", image: "https://cdn-icons-png.flaticon.com/512/3295/3295467.png", cat: "Core" },
  { id: "sheets", name: "Google Sheets", image: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg", cat: "Google" },
  { id: "gmail", name: "Gmail", image: "https://cdn-icons-png.flaticon.com/512/5968/5968534.png", cat: "Google" },
  { id: "slack", name: "Slack", image: "https://cdn-icons-png.flaticon.com/512/2111/2111615.png", cat: "Business" },
  { id: "notion", name: "Notion", image: "https://cdn-icons-png.flaticon.com/512/5968/5968885.png", cat: "Productivity" },
  { id: "discord", name: "Discord", image: "https://cdn-icons-png.flaticon.com/512/2111/2111370.png", cat: "Communication" },
  { id: "github", name: "GitHub", image: "https://cdn-icons-png.flaticon.com/512/25/25231.png", cat: "Developer" },
  { id: "salesforce", name: "Salesforce", image: "https://cdn-icons-png.flaticon.com/512/5968/5968914.png", cat: "CRM" },
];

export const AppSelector = ({ isOpen, onClose, onSelect, type }: AppSelectorProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col h-[600px] border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div>
              <h2 className="text-xl font-bold text-slate-900">Select {type}</h2>
              <p className="text-sm text-slate-500">Search 5,000+ apps to automate your work.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 shrink-0">
            <div className="relative group">
                <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text" 
                    autoFocus
                    placeholder="Search apps..." 
                    className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 shadow-sm"
                />
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
            
            {/* Sidebar Categories */}
            <div className="w-48 border-r border-slate-100 bg-slate-50/50 p-4 space-y-1 overflow-y-auto hidden sm:block">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Categories</div>
                {["All Apps", "Popular", "Built-in", "Sales & CRM", "Productivity", "Marketing", "Development"].map((cat, i) => (
                    <button 
                        key={i} 
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${i === 0 ? "bg-white shadow-sm text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* App Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {APPS.map((app) => (
                        <button
                            key={app.id}
                            onClick={() => onSelect(app)}
                            className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-100 rounded-xl hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all group text-center"
                        >
                            <div className="w-12 h-12 p-2 bg-slate-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <img src={app.image} alt={app.name} className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-sm">{app.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">{app.cat}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};