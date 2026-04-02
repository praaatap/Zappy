"use client";

import {
  Home, Zap, Settings, LogOut, Menu, Bell, Workflow, BookTemplate,
  History, CreditCard, X, BarChart3, ChevronRight, Search, Plus, ChevronsUpDown,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";

// ============================================================================
// CONFIGURATION & HELPERS (Outside the component so they don't re-render)
// ============================================================================

const navSections = [
  {
    label: "Platform",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "My Zaps", href: "/dashboard/zaps", icon: Zap },
      { name: "Workflows", href: "/dashboard/workflows", icon: Workflow },
      { name: "Templates", href: "/dashboard/templates", icon: BookTemplate },
    ],
  },
  {
    label: "Insights",
    items: [
      { name: "History", href: "/dashboard/history", icon: History },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Pricing", href: "/pricing", icon: CreditCard },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

const allItems = navSections.flatMap((s) => s.items);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function DashboardLayoutWithClerk({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  // --- STATE ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  
  // --- SEARCH STATE ---
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- EFFECTS ---
  
  useEffect(() => {
    const savedSidebar = localStorage.getItem("zappy_dashboard_sidebar_collapsed");
    if (savedSidebar === "1") {
      setDesktopSidebarCollapsed(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("zappy_dashboard_sidebar_collapsed", desktopSidebarCollapsed ? "1" : "0");
  }, [desktopSidebarCollapsed]);

  // 2. Auto-focus search input when search modal opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // 3. Global Keyboard Shortcuts (CMD+K to search, ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        closeSearch();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- HANDLERS & LOGIC ---

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/login" });
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Find the active page for the breadcrumbs
  const currentItem = allItems.find((i) => 
    pathname === i.href || (i.href !== "/dashboard" && pathname.startsWith(i.href + "/"))
  );

  // Filter search results
  const filteredItems = searchQuery
    ? allItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // ============================================================================
  // UI RENDERING
  // ============================================================================

  return (
    <div className="flex min-h-screen bg-[#F4F5F7]">

      {/* ==========================================
          1. SEARCH OVERLAY MODAL (CMD + K)
      ========================================== */}
      {searchOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]" 
          onClick={closeSearch}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-slate-200" onClick={(e) => e.stopPropagation()}>
            
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages…"
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filteredItems.length > 0) {
                    router.push(filteredItems[0].href);
                    closeSearch();
                  }
                }}
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 rounded border border-slate-200">ESC</kbd>
            </div>

            {/* Search Results */}
            {searchQuery ? (
              <div className="max-h-64 overflow-y-auto p-2">
                {filteredItems.length > 0 ? filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSearch}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </Link>
                  );
                }) : (
                  <div className="px-3 py-6 text-center text-sm text-slate-400">No results for "{searchQuery}"</div>
                )}
              </div>
            ) : (
              /* Quick Navigation (When search is empty) */
              <div className="p-3">
                <p className="text-xs text-slate-400 font-medium px-2 mb-2">Quick Navigation</p>
                {allItems.slice(0, 5).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSearch}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          2. MOBILE SIDEBAR OVERLAY
      ========================================== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

   {/* ==========================================
          3. SIDEBAR NAVIGATION
      ========================================== */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200/60 transform transition-all duration-300 ease-in-out flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 ${desktopSidebarCollapsed ? "md:w-20" : "md:w-72"}
      `}>
        {/* Brand / Logo */}
        <div className={`h-16 flex items-center justify-between border-b border-slate-100/80 ${desktopSidebarCollapsed ? "px-3 md:px-2" : "px-6"}`}>
          <Link href="/" className={`flex items-center group ${desktopSidebarCollapsed ? "justify-center w-full md:w-auto" : "gap-3"}`}>
            <div 
              className="w-8 h-8 bg-linear-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-500/20 group-hover:scale-105 transition-all duration-300 ring-1 ring-orange-500/10" 
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Z
            </div>
            {!desktopSidebarCollapsed && (
              <span 
                className="font-extrabold text-xl tracking-tight text-slate-900" 
                style={{ fontFamily: 'var(--font-jakarta)' }}
              >
                Zappy
              </span>
            )}
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Selector */}
        <div className={`pt-6 pb-3 ${desktopSidebarCollapsed ? "px-2" : "px-5"}`}>
          <button className={`w-full flex items-center rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all duration-200 text-left group ${desktopSidebarCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3.5 py-3"}`}>
            <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-blue-500/20">
              AC
            </div>
            {!desktopSidebarCollapsed && (
              <>
                <div className="flex-1 overflow-hidden">
                    <span className="block text-[13px] font-bold text-slate-900 truncate" style={{ fontFamily: 'var(--font-jakarta)' }}>Acme Corp</span>
                    <span className="block text-[11px] font-medium text-slate-500 truncate">Free Plan</span>
                </div>
                <ChevronsUpDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 transition-colors" />
              </>
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`flex-1 overflow-y-auto py-2 ${desktopSidebarCollapsed ? "px-2" : "px-4"}`}>
          {navSections.map((section) => (
            <div key={section.label} className="mb-6">
              {!desktopSidebarCollapsed && (
                <div 
                  className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-3"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  {section.label}
                </div>
              )}
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      title={desktopSidebarCollapsed ? item.name : undefined}
                      className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                        desktopSidebarCollapsed ? "justify-center" : "gap-3"
                      } ${
                        isActive
                          ? "bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-500/10"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-orange-600" : "text-slate-400 group-hover:text-slate-500"}`} />
                      {!desktopSidebarCollapsed && item.name}
                      {!desktopSidebarCollapsed && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User Profile Footer */}
        <div className={`border-t border-slate-100 bg-slate-50/50 ${desktopSidebarCollapsed ? "p-2" : "p-4"}`}>
          <div className={`flex items-center rounded-2xl hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200 cursor-pointer transition-all duration-200 group ${desktopSidebarCollapsed ? "justify-center p-2" : "gap-3 p-2"}`}>
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
              {user?.firstName?.charAt(0)?.toUpperCase() || user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() || "U"}
            </div>
            {!desktopSidebarCollapsed && (
              <div className="flex-1 overflow-hidden min-w-0">
                <p className="text-[13px] font-bold text-slate-900 truncate" style={{ fontFamily: 'var(--font-jakarta)' }}>{user?.fullName || user?.username || "Zappy User"}</p>
                <p className="text-[11px] font-medium text-slate-500 truncate">{user?.emailAddresses[0]?.emailAddress || ""}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              title="Sign out"
              className={`p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors ${desktopSidebarCollapsed ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100"}`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ==========================================
          4. MAIN CONTENT AREA
      ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-14 flex items-center justify-between px-5 z-10 sticky top-0 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Collapse Button */}
            <button
              onClick={() => setDesktopSidebarCollapsed((prev) => !prev)}
              className="hidden md:inline-flex p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              title={desktopSidebarCollapsed ? "Open sidebar" : "Collapse sidebar"}
            >
              {desktopSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-slate-400 font-medium">Zappy</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="font-bold text-slate-800">{currentItem?.name || "Dashboard"}</span>
            </div>
          </div>

          {/* Right side Actions */}
          <div className="flex items-center gap-2">
            
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-slate-600 bg-slate-100/80 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs font-medium">Search</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold text-slate-400 bg-white rounded border border-slate-200">⌘K</kbd>
            </button>

            {/* Notifications */}
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
            </button>

            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* Call to Action */}
            <Link
              href="/dashboard/zaps/new"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-colors shadow-sm shadow-orange-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Create Zap</span>
            </Link>
          </div>
        </header>

        {/* Page Content Rendered Here */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}

function DashboardLayoutWithoutClerk({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-orange-600">
          Auth disabled in dev
        </div>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
          Zappy is running without Clerk keys.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
          Add real Clerk publishable and secret keys to your environment to enable sign-in, sign-up, and protected dashboard routes.
        </p>
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          The app shell is still available, but authentication-backed features are disabled until Clerk is configured.
        </div>
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return isClerkConfigured ? (
    <DashboardLayoutWithClerk>{children}</DashboardLayoutWithClerk>
  ) : (
    <DashboardLayoutWithoutClerk>{children}</DashboardLayoutWithoutClerk>
  );
}