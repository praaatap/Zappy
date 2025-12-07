"use client";

import { MoreHorizontal, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ZapCellProps {
  step: {
      name: string;
      image: string;
      type: string;
      isConfigured: boolean;
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
            relative group w-full max-w-lg bg-white rounded-xl p-4 cursor-pointer transition-all duration-200
            border-2 flex items-start gap-4 select-none
            ${isSelected 
                ? "border-blue-500 shadow-[0_4px_20px_-2px_rgba(59,130,246,0.2)]" 
                : "border-transparent shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5"
            }
        `}
    >
        {/* Step Number Badge */}
        <div className={`
            absolute -left-3 -top-3 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm border-2 border-white z-10
            ${isSelected ? "bg-blue-600 text-white" : "bg-white text-slate-400 border-slate-100"}
        `}>
            {index}
        </div>

        {/* App Icon */}
        <div className="w-10 h-10 p-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
             <img src={step.image} alt={step.name} className="w-full h-full object-contain" />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pt-0.5">
             <div className="flex items-center gap-2 mb-0.5">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{step.type}</span>
                 {step.isConfigured ? (
                     <CheckCircle2 className="w-3 h-3 text-green-500" />
                 ) : (
                     <AlertCircle className="w-3 h-3 text-amber-500" />
                 )}
             </div>
             
             <h3 className={`text-sm font-bold truncate ${isSelected ? "text-blue-700" : "text-slate-900"}`}>
                 {step.isConfigured ? `${step.name} configured` : `Configure ${step.name}`}
             </h3>
             
             <p className="text-xs text-slate-500 truncate mt-0.5">
                 {step.isConfigured ? "Ready to test" : "Select an event and account"}
             </p>
        </div>

        {/* Delete Button (Visible on Hover) */}
        <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    </div>
  );
};