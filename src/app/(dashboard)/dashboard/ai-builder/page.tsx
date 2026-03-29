'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Loader2, CheckCircle2, ArrowRight, Zap, Bot, Workflow, Mic, MicOff, BookTemplate, UserCheck } from 'lucide-react';

interface WorkflowActionPreview {
  type: string;
  config?: Record<string, any>;
}

interface WorkflowPreview {
  name: string;
  description: string;
  trigger: {
    type: string;
    config?: Record<string, any>;
  };
  actions: WorkflowActionPreview[];
}

interface FlowNode {
  id: string;
  type: string;
  role: 'trigger' | 'action';
  position: number;
}

function formatNodeLabel(type: string): string {
  return type
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildFlowNodes(workflow: WorkflowPreview | null): FlowNode[] {
  if (!workflow) {
    return [
      { id: 'trigger-webhook', type: 'webhook', role: 'trigger', position: 1 },
      { id: 'action-openai', type: 'openai', role: 'action', position: 2 },
      { id: 'action-slack', type: 'slack', role: 'action', position: 3 },
    ];
  }

  const triggerNode: FlowNode = {
    id: `trigger-${workflow.trigger.type}`,
    type: workflow.trigger.type,
    role: 'trigger',
    position: 1,
  };

  const actionNodes = workflow.actions.map((action, index) => ({
    id: `action-${index}-${action.type}`,
    type: action.type,
    role: 'action' as const,
    position: index + 2,
  }));

  return [triggerNode, ...actionNodes];
}

export default function AIBuilderPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: "Hi! I can turn plain English into a workflow. Tell me what you want to build, or choose from our industry templates below.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<WorkflowPreview | null>(null);
  const [editorMode, setEditorMode] = useState<'simple' | 'advanced'>('simple');
  const flowNodes = buildFlowNodes(generatedWorkflow);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const toggleListen = () => {
    if (isListening) {
      setIsListening(false);
      // Stop recognition (mock/polyfill)
    } else {
      setIsListening(true);
      // Mocking speech recognition logic for the example
      // In a real app, use window.SpeechRecognition
      // Let's pretend it transcribed after 2 seconds:
      setTimeout(() => {
        setInput('Send me an email if a big deal closes in Salesforce, but wait for my approval first.');
        setIsListening(false);
      }, 2000);
    }
  };

  const handleTemplateClick = (text: string) => {
    setInput(text);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages([...messages, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/ai/build-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          description: userMessage,
          createWorkflow: false,
        }),
      });

      const data: { workflow: WorkflowPreview; error?: string } = await response.json();

      if (response.ok) {
        setGeneratedWorkflow(data.workflow);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `✨ I've created a workflow for you!\n\n**${data.workflow.name}**\n\n${data.workflow.description}\n\n**Trigger:** ${data.workflow.trigger.type}\n**Actions:** ${data.workflow.actions.map((a) => a.type).join(' → ')}\n\nWould you like me to create this workflow?`,
          },
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Sorry, I encountered an error: ${message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkflow = async () => {
    if (!generatedWorkflow) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/ai/build-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          description: generatedWorkflow.description,
          createWorkflow: true,
        }),
      });

      await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `🎉 Workflow created successfully! You can now edit and activate it from your workflows dashboard.`,
          },
        ]);
        setGeneratedWorkflow(null);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Error creating workflow: ${message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-sm shadow-orange-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">AI Workflow Builder</h1>
            <p className="text-sm text-slate-500">Create workflows with natural language</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_1fr] gap-4 h-[calc(100%-5.5rem)]">
        {/* Chat Container */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    message.role === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-sm'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            
            {/* Prompt Templates shown on start */}
            {messages.length === 1 && (
              <div className="pt-4 pb-2">
                <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Try a Template</p>
                <div className="grid gap-2">
                  <button onClick={() => handleTemplateClick("Automatically sync new leads to HubSpot after manager approval")} className="text-left px-4 py-3 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all">
                    🤝 <strong>Sales:</strong> Sync leads to CRM with approval
                  </button>
                  <button onClick={() => handleTemplateClick("Process incoming content with AI and email me the summary")} className="text-left px-4 py-3 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all">
                    🧠 <strong>Marketing:</strong> AI summary of content via Email
                  </button>
                  <button onClick={() => handleTemplateClick("Send a welcome message to Discord when someone joins")} className="text-left px-4 py-3 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all">
                    🎮 <strong>Community:</strong> Welcome users on Discord
                  </button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                  <span className="text-sm text-slate-600">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Generated Workflow Preview */}
          {generatedWorkflow && (
            <div className="border-t border-slate-200 p-4 bg-slate-50">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-sm">{generatedWorkflow.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{generatedWorkflow.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-xl">
                  <Zap className="w-3.5 h-3.5 text-orange-600" />
                  <span className="capitalize text-xs font-bold text-slate-700">{generatedWorkflow.trigger.type}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                {generatedWorkflow.actions.map((action, index: number) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl">
                      <span className="capitalize text-xs font-bold text-slate-700">{action.type}</span>
                    </div>
                    {index < generatedWorkflow.actions.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <button
                onClick={handleCreateWorkflow}
                disabled={isLoading}
                className="mt-4 w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Workflow'}
              </button>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 p-3"
          >
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleListen}
                disabled={isLoading}
                className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                  isListening 
                    ? 'bg-rose-100 text-rose-600 animate-pulse' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                title="Voice input"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "Describe your workflow..."}
                className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
                disabled={isLoading || isListening}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2.5 mx-auto bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Node Panel */}
        <aside className="bg-white border border-slate-200 rounded-2xl h-full overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-orange-600" />
                <h2 className="text-sm font-bold text-slate-900">Blueprint Editor</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {generatedWorkflow ? 'Review your generated workflow' : 'Updates after generation'}
              </p>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex bg-slate-200/50 p-1 rounded-lg">
              <button
                onClick={() => setEditorMode('simple')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                  editorMode === 'simple' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Simple Summary
              </button>
              <button
                onClick={() => setEditorMode('advanced')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                  editorMode === 'advanced' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Advanced Nodes
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col">
            {editorMode === 'simple' ? (
              <div className="flex-1 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 flex flex-col justify-center">
                {!generatedWorkflow ? (
                  <div className="text-center text-slate-400 space-y-3 my-auto">
                    <BookTemplate className="w-8 h-8 mx-auto opacity-50" />
                    <p className="text-sm">Describe a workflow to see its plain-English summary here.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{generatedWorkflow.name}</h3>
                      <p className="text-sm text-slate-500">{generatedWorkflow.description}</p>
                    </div>

                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                      
                      {/* Step 1: Trigger */}
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-orange-100 text-orange-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Step 1 • When</span>
                          <p className="text-sm font-medium text-slate-800">
                            A new <strong className="text-orange-600 capitalize">{generatedWorkflow.trigger.type.replace('-', ' ')}</strong> event occurs.
                          </p>
                        </div>
                      </div>

                      {/* Step N: Actions */}
                      {generatedWorkflow.actions.map((action, idx) => {
                        const isApproval = action.type === 'wait-for-approval';
                        return (
                          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
                              isApproval ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {isApproval ? <UserCheck className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Step {idx + 2} • Then</span>
                              <p className="text-sm font-medium text-slate-800">
                                {isApproval ? (
                                  <>Pause execution and require <strong className="text-amber-600">human approval</strong>.</>
                                ) : (
                                  <>Execute the <strong className="text-slate-900 capitalize">{action.type.replace('-', ' ')}</strong> action.</>
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 rounded-xl border border-slate-200 bg-[#f8fafc] p-4 bg-opacity-20 flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:1rem_1rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>
                
                <div className="space-y-6 relative z-10">
                  {flowNodes.map((node, index) => (
                    <div key={node.id} className="relative z-10">
                      <div className="group rounded-xl border-2 border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-all w-full max-w-xs mx-auto">
                        <div className={`px-3 py-2 border-b border-slate-100 flex items-center justify-between rounded-t-xl ${
                          node.role === 'trigger' ? 'bg-orange-50/50' : node.type === 'wait-for-approval' ? 'bg-amber-50/50' : 'bg-slate-50/50'
                        }`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                              node.role === 'trigger' ? 'bg-orange-100 text-orange-600' : node.type === 'wait-for-approval' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {node.role === 'trigger' ? <Zap className="w-3 h-3" /> : node.type === 'wait-for-approval' ? <UserCheck className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                              {node.role === 'trigger' ? 'Trigger' : 'Action'}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-slate-400">#{node.position}</span>
                        </div>
                        
                        <div className="p-3">
                          <p className="font-bold text-sm text-slate-900 capitalize">{formatNodeLabel(node.type)}</p>
                          <div className="mt-2 text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 overflow-hidden">
                            {`{ "type": "${node.type}" }`}
                          </div>
                        </div>
                      </div>
                      
                      {index < flowNodes.length - 1 && (
                        <div className="flex justify-center py-2 relative z-0">
                          <div className="w-0.5 h-6 bg-slate-300"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-slate-300 bg-white"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
