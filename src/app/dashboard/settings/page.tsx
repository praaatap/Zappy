"use client";

import { Save, Lock, Bell, Key, CreditCard, Users, Plus } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Billing");

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Settings Sidebar */}
          <div className="md:col-span-3 space-y-1">
              {["Profile", "Team", "Billing", "API Keys"].map(item => (
                  <button 
                    key={item}
                    onClick={() => setActiveTab(item)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === item ? "bg-white shadow-sm text-orange-600 ring-1 ring-slate-200" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                      {item}
                  </button>
              ))}
          </div>

          {/* Content Area */}
          <div className="md:col-span-9 space-y-6">
              
              {/* BILLING TAB */}
              {activeTab === "Billing" && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Current Plan</h2>
                                <p className="text-slate-500 text-sm">You are on the <span className="font-bold text-orange-600">Pro Plan</span>.</p>
                            </div>
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Active</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-orange-500 w-[65%]"></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 font-medium mb-6">
                            <span>6,500 / 10,000 tasks used</span>
                            <span>Renews Nov 1</span>
                        </div>
                        <button className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50">Manage Subscription</button>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-slate-400" /> Payment Methods
                        </h2>
                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-6 bg-slate-800 rounded text-white text-[8px] flex items-center justify-center font-bold tracking-wider">VISA</div>
                                <div className="text-sm font-medium text-slate-700">•••• 4242</div>
                            </div>
                            <button className="text-xs font-bold text-slate-400 hover:text-red-600">Remove</button>
                        </div>
                        <button className="text-sm font-bold text-orange-600 hover:underline">+ Add payment method</button>
                    </div>
                </div>
              )}

              {/* TEAM TAB */}
              {activeTab === "Team" && (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                         <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                             <Users className="w-5 h-5 text-slate-400" /> Team Members
                         </h2>
                         <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-800">
                             <Plus className="w-4 h-4" /> Invite Member
                         </button>
                      </div>

                      <div className="space-y-4">
                          {[
                              { name: "John Doe", email: "john@zappy.com", role: "Owner" },
                              { name: "Alice Smith", email: "alice@zappy.com", role: "Editor" },
                              { name: "Bob Jones", email: "bob@zappy.com", role: "Viewer" },
                          ].map((member, i) => (
                              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                  <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                                          {member.name.charAt(0)}
                                      </div>
                                      <div>
                                          <div className="text-sm font-bold text-slate-900">{member.name}</div>
                                          <div className="text-xs text-slate-500">{member.email}</div>
                                      </div>
                                  </div>
                                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{member.role}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* API KEYS TAB (Reused from previous, just ensured context) */}
              {activeTab === "API Keys" && (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                       <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                            <Key className="w-5 h-5 text-slate-400" /> Developer Access
                        </h2>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex justify-between items-center">
                          <div>
                              <div className="text-sm font-bold text-slate-700">Secret Key</div>
                              <div className="text-xs font-mono text-slate-500 mt-1">zp_live_****************9928</div>
                          </div>
                          <button className="text-xs text-orange-600 font-bold hover:underline">Reveal</button>
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}