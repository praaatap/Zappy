"use client";

import { Home, Zap, Settings, LogOut, Menu, User, Bell, ChevronsUpDown, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Zaps", href: "/dashboard/zaps", icon: Zap },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-slate-900">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col shadow-sm
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}>
        {/* Logo Area */}
        <div className="px-6 h-16 flex items-center border-b border-slate-100">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-orange-500/20">Z</div>
             <span className="font-bold text-xl tracking-tight text-slate-900">Zappy</span>
          </div>
        </div>

        {/* Team Switcher (Mock) */}
        <div className="p-4">
             <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">T</div>
                    Acme Corp
                </div>
                <ChevronsUpDown className="w-4 h-4 text-slate-400" />
             </button>
        </div>

        {/* Nav Links */}
        <div className="px-3 flex-1 overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-4">Platform</div>
            <nav className="space-y-0.5">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group ${
                    isActive 
                        ? "bg-orange-50 text-orange-700" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                    <item.icon className={`w-4 h-4 ${isActive ? "text-orange-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                    {item.name}
                </Link>
                );
            })}
            </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="relative">
                     <div className="w-9 h-9 rounded-full bg-slate-200 border border-white shadow-sm overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                     </div>
                     <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 truncate">John Doe</p>
                    <p className="text-xs text-slate-500 truncate">Pro Plan</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-6 md:px-8 z-10 sticky top-0">
           <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md">
                    <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-semibold text-slate-800 hidden md:block">
                    {navItems.find(i => i.href === pathname)?.name || "Dashboard"}
                </h1>
           </div>
           
           <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                </button>
                <Link href="/zap/create">
                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                        <span>+</span> <span className="hidden sm:inline">Create Zap</span>
                    </button>
                </Link>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}