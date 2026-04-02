"use client";

import { MoreHorizontal, Trash2, AlertCircle, CheckCircle2, Loader2, Play } from "lucide-react";

interface ZapCellProps {
  step: {
      name: string;
      image: string;
      type: string;
      isConfigured: boolean;
      isTesting?: boolean;
      testResult?: any;
  };
  index: number;
  isSelected?: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export const ZapCell = ({ step, index, isSelected, onClick, onDelete }: ZapCellProps) => {
  return (
    <div 
        onClick={onClick}
        className={`
            relative group w-full max-w-lg bg-white rounded-[1.25rem] p-5 cursor-pointer transition-all duration-300
            border-2 flex items-center gap-5 select-none
            ${isSelected 
                ? "border-blue-500 shadow-xl shadow-blue-500/10 -translate-y-1" 
                : "border-transparent shadow-sm hover:border-slate-200 hover:shadow-lg hover:-translate-y-0.5"
            }
        `}
    >
        {/* Step Number Badge */}
        <div className={`
            absolute -left-3 -top-3 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-md border-2 border-white z-10 transition-colors duration-300
            ${isSelected ? "bg-blue-600 text-white" : "bg-slate-900 text-white"}
        `}>
            {index}
        </div>

        {/* App Icon Container */}
        <div className={`
            w-14 h-14 p-3 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300
            ${isSelected ? "bg-blue-50 scale-110" : "bg-slate-50"}
        `}>
             <img src={step.image} alt={step.name} className="w-full h-full object-contain" />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2 mb-1">
                 <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    step.type === 'Trigger' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                 }`}>
                    {step.type}
                 </span>
                 {step.isTesting ? (
                     <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                 ) : step.isConfigured ? (
                     <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                 ) : (
                     <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                 )}
             </div>
             
             <h3 className={`text-base font-black truncate leading-tight ${isSelected ? "text-slate-900" : "text-slate-800"}`} style={{ fontFamily: 'var(--font-jakarta)' }}>
                 {step.isConfigured ? step.name : `Set up ${step.name}`}
             </h3>
             
             <p className="text-xs font-medium text-slate-500 truncate mt-1">
                 {step.isTesting ? "Running test..." : step.isConfigured ? "Ready to use" : "Missing configuration"}
             </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
            {step.isConfigured && !step.isTesting && (
                <div className="p-2 text-emerald-500 bg-emerald-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 fill-current" />
                </div>
            )}
            <button 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
            <div className="absolute inset-y-0 -right-[2px] w-1 bg-blue-600 rounded-r-full" />
        )}
    </div>
  );
};