"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, Play, Plus, X, Zap, AlertCircle, MousePointer2 } from "lucide-react";
import { AppSelector } from "@/components/AppSelector";
import Link from "next/link";
import { ZapCell } from "@/components/ZapCell";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// 1. Define Types for our "Smart" Steps
interface ZapStep {
    id: string;          // e.g. "email-123"
    uniqueId: string;    // random UI ID
    type: "Trigger" | "Action";
    name: string;        // "Gmail"
    image: string;
    isConfigured: boolean;
    metadata: any;       // Stores the form data (e.g., { to: "boss@gmail.com" })
}

export default function CreateZapEditor() {
    const [steps, setSteps] = useState<ZapStep[]>([]);
    const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"Trigger" | "Action">("Trigger");
    const [isPublishing, setIsPublishing] = useState(false);

    // Helper to find the currently selected step object
    const selectedStep = steps.find(s => s.uniqueId === selectedStepId);

    // ACTIONS
    const openModal = (type: "Trigger" | "Action") => {
        setModalType(type);
        setModalOpen(true);
    };

    const addStep = (app: { id: string, name: string, image: string }) => {
        const newStep: ZapStep = {
            id: app.id,
            uniqueId: Math.random().toString(36).substr(2, 9),
            type: modalType,
            name: app.name,
            image: app.image,
            isConfigured: false,
            metadata: {}
        };

        if (modalType === "Trigger") {
            // Triggers always go first
            setSteps([newStep, ...steps]);
        } else {
            setSteps([...steps, newStep]);
        }

        setModalOpen(false);
        setSelectedStepId(newStep.uniqueId); // Auto-open settings
    };

    const updateStepMetadata = (key: string, value: string) => {
        if (!selectedStep) return;
        const updatedSteps = steps.map(s => {
            if (s.uniqueId === selectedStep.uniqueId) {
                return {
                    ...s,
                    metadata: { ...s.metadata, [key]: value },
                    // Simple validation: if we have data, mark as configured
                    isConfigured: true
                };
            }
            return s;
        });
        setSteps(updatedSteps);
    };

    const deleteStep = (id: string) => {
        setSteps(steps.filter(s => s.uniqueId !== id));
        setSelectedStepId(null);
    }

    const router = useRouter();

    const handlePublish = async () => {
        setIsPublishing(true);

        try {
            const trigger = steps.find(s => s.type === "Trigger");
            const actions = steps.filter(s => s.type === "Action");

            if (!trigger || actions.length === 0) {
                toast.error("Please add at least 1 trigger and 1 action");
                return;
            }

            const payload = {
                availableTriggerId: trigger.id,
                triggerMetadata: trigger.metadata,
                actions: actions.map(a => ({
                    availableActionId: a.id,
                    actionMetadata: a.metadata
                }))
            };

            const token = localStorage.getItem("token");

            await axios.post("/api/v1/zap", payload, {
                headers: { Authorization: token }
            });

            toast.success("Zap Published Successfully!");
            router.push("/dashboard");

        } catch (error: any) {
            toast.error("Failed to publish Zap");
        } finally {
            setIsPublishing(false);
        }
    }

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* ---------------------------------------------------------------------------
          LEFT PANEL: THE CANVAS (Visual Flow)
         --------------------------------------------------------------------------- */}
            <div className="flex-1 flex flex-col h-full relative">

                {/* Header */}
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/zaps" className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded transition-colors">
                            <h1 className="font-bold text-lg text-slate-800">Untitled Zap</h1>
                            <span className="text-slate-400 text-xs">(Click to rename)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePublish}
                            disabled={steps.length < 2}
                            className={`
                        px-6 py-2 rounded-full font-bold text-white transition-all shadow-md flex items-center gap-2 text-sm
                        ${steps.length < 2 ? "bg-slate-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"}
                    `}
                        >
                            {isPublishing ? "Publishing..." : <><Play className="w-4 h-4 fill-current" /> Publish</>}
                        </button>
                    </div>
                </header>

                {/* Canvas Area */}
                <div className="flex-1 overflow-y-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20 p-8 relative">
                    <div className="max-w-2xl mx-auto pb-32 flex flex-col items-center">

                        {/* 1. Empty State */}
                        {steps.length === 0 && (
                            <div className="mt-20 text-center">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
                                    <MousePointer2 className="w-8 h-8 text-slate-300" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 mb-2">Start your automation</h2>
                                <p className="text-slate-500 mb-8 max-w-sm mx-auto">Choose an app to start your workflow. This is the event that triggers everything.</p>
                                <button
                                    onClick={() => openModal("Trigger")}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-200 transition-all hover:scale-105"
                                >
                                    + Add Trigger
                                </button>
                            </div>
                        )}

                        {/* 2. The Flow */}
                        {steps.map((step, index) => (
                            <div key={step.uniqueId} className="w-full flex flex-col items-center">
                                {/* Connecting Line (Only for item 2 onwards) */}
                                {index > 0 && <div className="h-8 w-0.5 bg-slate-300"></div>}

                                <ZapCell
                                    step={step}
                                    index={index + 1}
                                    isSelected={selectedStepId === step.uniqueId}
                                    onClick={() => setSelectedStepId(step.uniqueId)}
                                    onDelete={() => deleteStep(step.uniqueId)}
                                />
                            </div>
                        ))}

                        {/* 3. Add Button (Only if Trigger exists) */}
                        {steps.length > 0 && (
                            <>
                                <div className="h-8 w-0.5 bg-slate-300"></div>
                                <button
                                    onClick={() => openModal("Action")}
                                    className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-full shadow-sm hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all text-sm font-bold text-slate-600"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Step</span>
                                </button>
                            </>
                        )}

                    </div>
                </div>
            </div>

            {/* ---------------------------------------------------------------------------
          RIGHT PANEL: THE CONFIGURATION (Forms)
         --------------------------------------------------------------------------- */}
            <div className={`
        w-[450px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-30
        transition-all duration-300 ease-in-out absolute right-0 h-full
        ${selectedStepId ? "translate-x-0" : "translate-x-full"}
      `}>
                {selectedStep ? (
                    <>
                        {/* Panel Header */}
                        <div className="px-6 h-16 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 p-1 bg-slate-50 rounded border border-slate-100">
                                    <img src={selectedStep.image} className="w-full h-full object-contain" />
                                </div>
                                <div className="leading-tight">
                                    <div className="font-bold text-slate-900 text-sm">{selectedStep.name}</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{selectedStep.type}</div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedStepId(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Dynamic Form Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">

                            {/* Section 1: Event Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-slate-900">Event</label>
                                    <span className="text-xs text-slate-400">Required</span>
                                </div>
                                <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white focus:ring-2 ring-blue-100 focus:border-blue-500 outline-none text-sm transition-all font-medium text-slate-700">
                                    <option>Select an event...</option>
                                    {/* In a real app, these options depend on the app selected */}
                                    <option>New Record Created</option>
                                    <option>Record Updated</option>
                                    <option>New Email Received</option>
                                </select>
                                <p className="text-xs text-slate-500">This will determine when your Zap runs.</p>
                            </div>

                            <div className="h-px bg-slate-200"></div>

                            {/* Section 2: Account */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-900">Account</label>
                                <button className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white hover:bg-slate-50 text-left flex items-center justify-between group transition-colors">
                                    <span className="text-sm text-slate-600 font-medium">Connect a new account...</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="h-px bg-slate-200"></div>

                            {/* Section 3: The "Action" Fields (Dynamic) */}
                            <div className="space-y-5">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
                                    Configure {selectedStep.name}
                                </h3>

                                {/* Mock Fields based on step name */}
                                {selectedStep.name.toLowerCase().includes("email") || selectedStep.name.toLowerCase().includes("gmail") ? (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase">To (Recipient)</label>
                                            <input
                                                type="email"
                                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                                placeholder="name@example.com"
                                                onChange={(e) => updateStepMetadata('to', e.target.value)}
                                                value={selectedStep.metadata.to || ""}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                                            <input
                                                type="text"
                                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                                placeholder="Enter subject..."
                                                onChange={(e) => updateStepMetadata('subject', e.target.value)}
                                                value={selectedStep.metadata.subject || ""}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    // Generic Fields for other apps
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Resource ID</label>
                                        <input
                                            type="text"
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                            placeholder="Enter ID..."
                                            onChange={(e) => updateStepMetadata('id', e.target.value)}
                                            value={selectedStep.metadata.id || ""}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Panel Footer */}
                        <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                            <button
                                onClick={() => setSelectedStepId(null)}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-5 h-5" /> Done
                            </button>
                        </div>
                    </>
                ) : null}
            </div>

            {/* Modal */}
            <AppSelector
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={addStep}
                type={modalType}
            />
        </div>
    );
}