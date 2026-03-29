"use client";

import {
  Zap, Play, ArrowRight, Shield, Globe, Cpu,
  BarChart3, Sparkles, ChevronRight, TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {

  const navItems = [
    { name: "Product",   href: "#features" },
    { name: "Solutions", href: "#features" },
    { name: "Customers", href: "#trusted"  },
    { name: "Pricing",   href: "/pricing"  },
  ];

  const stats = [
    { value: "10,000+", label: "Teams" },
    { value: "200M+",   label: "Tasks / month" },
    { value: "99.9%",   label: "Uptime SLA" },
    { value: "5,000+",  label: "Integrations" },
  ];

  const bentoCards = [
    {
      span: "md:col-span-2",
      icon: Cpu,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      title: "Visual Logic Builder",
      desc: "Drag, drop, and connect. Create complex branching logic without writing a single line of code.",
      dark: false,
      large: true,
    },
    {
      span: "",
      icon: Globe,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "5,000+ Integrations",
      desc: "From Salesforce to Notion, every tool connects.",
      dark: false,
      stat: "5K+",
    },
    {
      span: "",
      icon: Shield,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Enterprise Ready",
      desc: "SOC2 Type II, GDPR, HIPAA, and SSO — included.",
      dark: false,
      badges: ["SOC2", "GDPR", "SSO", "HIPAA"],
    },
    {
      span: "md:col-span-2",
      icon: Zap,
      iconBg: "bg-white/10",
      iconColor: "text-orange-400",
      title: "Instant Triggers",
      desc: "Don't wait 15 minutes. Zappy executes your workflows the millisecond data arrives — sub-100ms latency.",
      dark: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden scroll-smooth selection:bg-orange-100 selection:text-orange-900">

      {/* ─── GLOBAL STYLES ─────────────────────────────── */}
      <style jsx global>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }

        @keyframes shimmer {
          0%   { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-7px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* ─── 1. NAVBAR ─────────────────────────────────── */}
      <nav className="fixed w-full z-50 top-0 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg shadow-orange-500/30 group-hover:scale-105 group-hover:shadow-orange-500/50 transition-all duration-200">
              Z
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Zappy</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-slate-900 transition-colors duration-150"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 px-3 py-2 transition-colors">
                Log in
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-full transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer">
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── 2. HERO ───────────────────────────────────── */}
      <section className="relative pt-36 pb-16 px-6 overflow-hidden">

        {/* Background: subtle grid + radial glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-50" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-orange-100/70 via-amber-50/40 to-transparent rounded-[100%] blur-3xl" />
          {/* Fade-out grid at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="max-w-4xl mx-auto text-center">

          {/* Announcement Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full bg-white border border-orange-200 shadow-sm cursor-pointer group hover:border-orange-300 transition-all duration-200">
            <span className="px-2 py-0.5 bg-orange-500 text-white rounded-full text-[10px] font-black tracking-wider uppercase">
              New
            </span>
            <span className="text-sm font-semibold text-slate-700">AI Agents are here</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* Headline — uses Sora via .font-display */}
          <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-6 text-slate-900">
            Automate work.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500">
              Unleash speed.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Connect your apps and let AI handle the rest. Build powerful
            workflows in minutes, not months.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-14">
            <Link href="/signup">
              <button className="px-8 py-3.5 bg-orange-600 hover:bg-orange-500 text-white text-base font-bold rounded-full transition-all duration-200 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 flex items-center gap-2 group">
                Start building free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="#features">
              <button className="px-8 py-3.5 bg-white text-slate-700 border border-slate-200 hover:border-slate-300 text-base font-bold rounded-full transition-all duration-200 flex items-center gap-2 hover:bg-slate-50/80">
                <Play className="w-4 h-4 fill-slate-600" /> Watch demo
              </button>
            </Link>
          </div>

          {/* ── Stats Strip ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 max-w-2xl mx-auto shadow-sm">
            {stats.map((s) => (
              <div key={s.label} className="bg-white px-5 py-4 text-center hover:bg-slate-50 transition-colors">
                <div className="font-display text-2xl font-bold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. HERO VISUAL ────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-950 rounded-2xl p-3 shadow-2xl ring-1 ring-white/5">

            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 pb-2 px-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <div className="flex-1 mx-3 h-6 bg-slate-800 rounded-md flex items-center px-3">
                <span className="text-xs text-slate-500 font-mono">
                  app.zappy.io/workflows
                </span>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 aspect-[16/7] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1e1b4b30_0%,_transparent_70%)]" />

              {/* Flow nodes */}
              <div className="relative z-10 flex items-center gap-5 md:gap-10">
                {[
                  { icon: Globe,    bg: "bg-blue-50",   color: "text-blue-600",   label: "Trigger"   },
                  { icon: Cpu,      bg: "bg-orange-50", color: "text-orange-600", label: "Filter"    },
                  { icon: Zap,      bg: "bg-green-50",  color: "text-green-600",  label: "Transform" },
                  { icon: BarChart3,bg: "bg-purple-50", color: "text-purple-600", label: "Output"    },
                ].map((node, i) => (
                  <div key={i} className="flex items-center gap-5 md:gap-10">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-16 h-16 ${node.bg} rounded-2xl flex items-center justify-center shadow-lg border border-white/20 animate-float`}
                        style={{ animationDelay: `${i * 0.4}s` }}
                      >
                        <node.icon className={`w-8 h-8 ${node.color}`} />
                      </div>
                      <div className="px-2.5 py-0.5 bg-slate-800 rounded-full text-[10px] font-mono text-slate-400">
                        {node.label}
                      </div>
                    </div>

                    {/* Animated connector */}
                    {i < 3 && (
                      <div className="w-10 md:w-16 h-[2px] bg-slate-700 relative overflow-hidden rounded-full">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-[shimmer_1.8s_ease-in-out_infinite]"
                          style={{ animationDelay: `${i * 0.35}s` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Live status pill */}
              <div className="absolute bottom-5 right-5 flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] font-mono text-slate-300">1,247 runs today</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. MARQUEE ────────────────────────────────── */}
      <section id="trusted" className="py-12 border-y border-slate-100 bg-slate-50/40 overflow-hidden">
        <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-7">
          Trusted by fast-growing teams worldwide
        </p>
        <div className="relative flex overflow-x-hidden">
          {/* Fade masks — left & right */}
          <div className="absolute left-0 inset-y-0 w-28 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-28 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee whitespace-nowrap flex gap-14 items-center">
            {["ACME INC","VERTEX","PLURAL","NEXTGEN","STRATOS","ORBITAL","SKYLINE","HELIX",
              "ACME INC","VERTEX","PLURAL","NEXTGEN","STRATOS","ORBITAL","SKYLINE","HELIX"].map((name, i) => (
              <span key={i} className="text-xl font-bold text-slate-300 tracking-wider select-none">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. BENTO FEATURES ─────────────────────────── */}
      <section id="features" className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">

          <div className="mb-16 max-w-xl">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-[0.2em] mb-3">
              Platform
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.05] mb-4">
              One platform.<br />Infinite possibilities.
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Stop juggling disconnected tools. Zappy unifies your stack into a
              single, cohesive workflow engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">

            {/* Card 1 — Large, Visual Builder */}
            <div className="md:col-span-2 bg-slate-50 rounded-2xl border border-slate-100 p-8 relative overflow-hidden group hover:border-orange-100 hover:bg-orange-50/20 transition-all duration-300">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                Visual Logic Builder
              </h3>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                Drag, drop, and connect. Build branching logic without writing a
                single line of code.
              </p>

              {/* Mini product mockup */}
              <div className="absolute bottom-6 left-8 right-8 bg-white rounded-xl shadow-md border border-slate-100 p-4 group-hover:-translate-y-2 transition-transform duration-500">
                <div className="flex gap-1.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div className="flex gap-2 items-center">
                  {[
                    { bg: "bg-blue-50",   border: "border-blue-100",   Icon: Globe,    ic: "text-blue-500",   w: "w-1/2"   },
                    { bg: "bg-green-50",  border: "border-green-100",  Icon: Zap,      ic: "text-green-500",  w: "w-2/3"   },
                    { bg: "bg-purple-50", border: "border-purple-100", Icon: BarChart3, ic: "text-purple-500", w: "w-full" },
                  ].map(({ bg, border, Icon, ic, w }, i) => (
                    <div key={i} className="flex-1 flex items-center gap-1.5">
                      <div className={`w-7 h-7 flex-shrink-0 ${bg} border ${border} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-3.5 h-3.5 ${ic}`} />
                      </div>
                      {i < 2 && (
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${w} bg-orange-200 rounded-full`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 — Integrations */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 relative overflow-hidden hover:border-blue-100 hover:bg-blue-50/20 transition-all duration-300">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="font-display text-4xl font-bold text-slate-900 mb-1">
                  5,000+
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">App Integrations</h3>
                <p className="text-slate-500 text-sm">
                  From Salesforce to Notion — every tool connects.
                </p>
              </div>
            </div>

            {/* Card 3 — Security */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 relative overflow-hidden hover:border-purple-100 hover:bg-purple-50/20 transition-all duration-300">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {["SOC2", "GDPR", "SSO", "HIPAA"].map((b) => (
                    <span
                      key={b}
                      className="text-[10px] font-black px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full uppercase tracking-wide"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Enterprise Ready</h3>
                <p className="text-slate-500 text-sm">
                  Security and compliance built in from day one.
                </p>
              </div>
            </div>

            {/* Card 4 — Dark, Real-time */}
            <div className="md:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500 rounded-full blur-[130px] opacity-10 -mr-16 -mt-16 group-hover:opacity-15 transition-opacity duration-700" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-500 rounded-full blur-[100px] opacity-5" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-mono text-green-400 tracking-wider uppercase">
                      Live Execution
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-3">
                    Instant Triggers
                  </h3>
                  <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                    Don't wait 15 minutes. Zappy executes your workflows the
                    millisecond data arrives — with sub-100ms latency.
                  </p>
                </div>

                {/* Avatar row */}
                <div className="flex items-center gap-3 mt-6">
                  <div className="flex -space-x-2">
                    {["A", "B", "C", "D"].map((l, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-950 flex items-center justify-center text-[10px] text-slate-300 font-bold"
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">
                    Trusted by 10,000+ teams
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. FINAL CTA BANNER ───────────────────────── */}
      <section className="py-28 px-6 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-orange-500 rounded-full blur-[180px] opacity-[0.08]" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <p className="text-xs font-bold text-orange-400 uppercase tracking-[0.2em] mb-4">
            Get started today
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-5">
            Ready to automate<br />everything?
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Join 10,000+ teams saving hours every day.<br />
            No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <button className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full transition-all duration-200 shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 flex items-center gap-2 group cursor-pointer">
                Start for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/pricing">
              <button className="px-8 py-4 bg-white/[0.07] hover:bg-white/[0.12] text-white font-bold rounded-full transition-all duration-200 border border-white/10 hover:border-white/20 cursor-pointer">
                View pricing
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 7. FOOTER ─────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-10 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4 text-white">
              <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center font-bold text-sm">
                Z
              </div>
              <span className="font-display font-bold text-lg">Zappy</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs mb-5">
              The automation platform for modern teams. Build faster, automate
              smarter.
            </p>
            <div className="flex gap-2">
              {["Twitter", "GitHub", "LinkedIn"].map((s) => (
                <button
                  key={s}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-800 text-slate-500 hover:text-white hover:border-slate-600 transition-all duration-150"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { head: "Product",   links: ["Features", "Integrations", "Pricing", "Changelog"] },
            { head: "Company",   links: ["About",    "Blog",         "Careers", "Press"]      },
            { head: "Resources", links: ["Docs",     "API Ref",      "Status",  "Community"]  },
          ].map(({ head, links }) => (
            <div key={head}>
              <h4 className="text-white font-bold mb-5 text-sm">{head}</h4>
              <ul className="space-y-3 text-sm">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:text-white transition-colors duration-150">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center text-slate-600 gap-3">
          <p>© 2025 Zappy Inc. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Link key={item} href="#" className="hover:text-slate-400 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}