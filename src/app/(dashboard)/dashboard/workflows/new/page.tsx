'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, Settings, Bot, ArrowRight, Plus, 
  MessageSquare, Mail, Database, Phone,
  Play, Save, CheckCircle2, ChevronRight, X, AlertCircle
} from 'lucide-react';

interface NodeData {
  id: string;
  role: 'trigger' | 'action';
  type: string;
  label: string;
  metadata: Record<string, any>;
}

const AVAILABLE_TRIGGERS = [
  { type: 'webhook', label: 'Webhook Event', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-100', defaultMeta: { path: '', method: 'POST' } },
  { type: 'schedule', label: 'Schedule', icon: Play, color: 'text-blue-500', bg: 'bg-blue-100', defaultMeta: { cron: '0 * * * *' } },
];

const AVAILABLE_ACTIONS = [
  { type: 'email', label: 'Send Email', icon: Mail, color: 'text-rose-500', bg: 'bg-rose-100', defaultMeta: { to: '', subject: '', body: '' } },
  { type: 'slack', label: 'Slack Message', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-100', defaultMeta: { channel: '', text: '' } },
  { type: 'openai', label: 'AI Processing', icon: Bot, color: 'text-violet-500', bg: 'bg-violet-100', defaultMeta: { prompt: '' } },
  { type: 'salesforce', label: 'Salesforce', icon: Database, color: 'text-blue-600', bg: 'bg-blue-100', defaultMeta: { objectType: 'Lead' } },
  { type: 'hubspot', label: 'HubSpot', icon: Database, color: 'text-orange-600', bg: 'bg-orange-100', defaultMeta: { email: '' } },
  { type: 'wait-for-approval', label: 'Human Approval', icon: Settings, color: 'text-amber-500', bg: 'bg-amber-100', defaultMeta: { approverEmail: '' } },
];

export default function ComplexWorkflowBuilder() {
  const router = useRouter();
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: 'trigger-1', role: 'trigger', type: 'webhook', label: 'Webhook Event', metadata: { path: '/hook', method: 'POST' } }
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('trigger-1');
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const addAction = (type: string, label: string, defaultMeta: any) => {
    const newNode: NodeData = {
      id: `action-${Date.now()}`,
      role: 'action',
      type,
      label,
      metadata: { ...defaultMeta }
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const updateNodeMeta = (key: string, value: any) => {
    if (!selectedNode) return;
    setNodes(nodes.map(n => 
      n.id === selectedNodeId 
        ? { ...n, metadata: { ...n.metadata, [key]: value } }
        : n
    ));
  };

  const deleteNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isTrigger = nodes.find(n => n.id === id)?.role === 'trigger';
    if (isTrigger) {
      setMessage({ type: 'error', text: 'You cannot delete the trigger node.' });
      return;
    }
    const newNodes = nodes.filter(n => n.id !== id);
    setNodes(newNodes);
    if (selectedNodeId === id) setSelectedNodeId(newNodes[0]?.id || null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const trigger = nodes.find(n => n.role === 'trigger');
      const actions = nodes.filter(n => n.role === 'action');

      if (!trigger) throw new Error("Workflow must have a trigger.");

      const payload = {
        name: workflowName,
        description: "Built with Advanced Visual Editor",
        status: "active",
        trigger: {
          type: trigger.type,
          metadata: trigger.metadata
        },
        actions: actions.map(a => ({
          type: a.type,
          metadata: a.metadata
        }))
      };

      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/zap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to save workflow');
      }

      setMessage({ type: 'success', text: 'Workflow saved successfully!' });
      setTimeout(() => {
        router.push('/dashboard/workflows');
      }, 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      {/* Top Bar */}
      <header className="flex-none h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm text-slate-500 font-medium">
            <span className="hover:text-slate-900 cursor-pointer" onClick={() => router.push('/dashboard/workflows')}>Workflows</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900">Visual Editor</span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <input 
            type="text" 
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-lg font-bold text-slate-900 bg-transparent outline-none border-b border-transparent focus:border-slate-300 transition-colors w-64"
          />
        </div>
        
        <div className="flex items-center gap-4">
          {message && (
            <span className={`text-sm font-semibold flex items-center gap-1.5 ${message.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold shadow transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? <Settings className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Deploy Workflow'}
          </button>
        </div>
      </header>

      {/* Main Work Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Component Palette */}
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Components</h2>
            <p className="text-xs text-slate-400 mt-1">Click to append to workflow</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-orange-500" /> Triggers
              </h3>
              <div className="space-y-2">
                {AVAILABLE_TRIGGERS.map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.type} disabled className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-not-allowed opacity-60">
                      <div className={`w-8 h-8 rounded-lg ${t.bg} ${t.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{t.label}</span>
                    </button>
                  );
                })}
                <p className="text-[10px] text-slate-400 px-2 leading-tight">Only one trigger allowed per workflow.</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Bot className="w-3.5 h-3.5 text-blue-500" /> Actions
              </h3>
              <div className="space-y-2">
                {AVAILABLE_ACTIONS.map(a => {
                  const Icon = a.icon;
                  return (
                    <button 
                      key={a.type}
                      onClick={() => addAction(a.type, a.label, a.defaultMeta)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all group"
                    >
                      <div className={`w-8 h-8 rounded-lg ${a.bg} ${a.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left flex-1">
                        <span className="text-sm font-semibold text-slate-700 block">{a.label}</span>
                      </div>
                      <Plus className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 relative overflow-auto bg-[#f8fafc] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] before:bg-[size:1.5rem_1.5rem] before:opacity-50">
          <div className="absolute inset-0 flex flex-col items-center py-12 pb-32">
            
            <div className="relative w-full max-w-2xl px-8 flex flex-col items-center">
              {nodes.map((node, index) => {
                const isSelected = selectedNodeId === node.id;
                const config = node.role === 'trigger' 
                  ? AVAILABLE_TRIGGERS.find(t => t.type === node.type)
                  : AVAILABLE_ACTIONS.find(a => a.type === node.type);
                
                const Icon = config?.icon || Settings;

                return (
                  <React.Fragment key={node.id}>
                    {/* Node Card */}
                    <div 
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`relative w-full md:w-[400px] rounded-2xl bg-white border-2 transition-all cursor-pointer group shadow-sm
                        ${isSelected ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-md scale-[1.02]' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}
                    >
                      {/* Badge line representing role color */}
                      <div className={`absolute top-0 left-0 bottom-0 w-1.5 rounded-l-xl ${config?.bg?.replace('100', '500') || 'bg-slate-300'}`}></div>
                      
                      <div className="p-4 pl-6 flex items-start justify-between">
                        <div className="flex gap-4 items-center">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config?.bg} ${config?.color}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 block">
                              {index + 1}. {node.role}
                            </span>
                            <h3 className="text-base font-black text-slate-800">{node.label}</h3>
                            <p className="text-xs text-slate-500 font-mono mt-1 truncate max-w-[200px]">
                              {Object.values(node.metadata)[0] ? String(Object.values(node.metadata)[0]) : 'Configure below'}
                            </p>
                          </div>
                        </div>

                        {node.role !== 'trigger' && (
                          <button 
                            onClick={(e) => deleteNode(node.id, e)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Connection Line */}
                    {index < nodes.length - 1 && (
                      <div className="w-0.5 h-10 bg-indigo-200 my-1 relative shrink-0 z-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-400"></div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
              
              {/* Add next step placeholder */}
              <div className="mt-8 flex flex-col items-center">
                <div className="w-0.5 h-8 bg-slate-200 mb-2 border-l border-dashed border-slate-300"></div>
                <div className="px-4 py-2 border border-dashed border-slate-300 rounded-full text-xs font-bold text-slate-400 bg-white/50 backdrop-blur">
                  Select an action from the left to append
                </div>
              </div>

            </div>

          </div>
        </main>

        {/* Right Sidebar - Properties Inspector */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Node Properties</h2>
            <p className="text-xs text-slate-400 mt-1">Configure selected block</p>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {!selectedNode ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                <Settings className="w-8 h-8 opacity-20" />
                <p className="text-sm">Select a node to configure</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{selectedNode.label}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{selectedNode.role}</p>
                </div>

                <div className="space-y-4">
                  {Object.keys(selectedNode.metadata).map(fieldKey => (
                    <div key={fieldKey}>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 capitalize">
                        {fieldKey.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        type="text"
                        value={selectedNode.metadata[fieldKey] || ''}
                        onChange={(e) => updateNodeMeta(fieldKey, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                        placeholder={`Enter ${fieldKey}...`}
                      />
                    </div>
                  ))}
                  
                  {/* Dynamic Help Text */}
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl mt-6">
                    <p className="text-xs text-blue-800 leading-relaxed font-medium">
                      💡 Tip: Use <code className="bg-blue-100 px-1 rounded mx-0.5">{"{{trigger.data}}"}</code> to insert dynamic variables from previous steps.
                    </p>
                  </div>
                </div>

                {selectedNode.role === 'trigger' && selectedNode.type === 'webhook' && (
                  <div className="p-4 bg-slate-900 rounded-xl mt-6">
                    <p className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Webhook Endpoint</p>
                    <code className="block text-[11px] text-emerald-400 break-all select-all">
                      https://zappy.io/api/webhooks/trigger/...
                    </code>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}