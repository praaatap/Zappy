"use client";

import Link from "next/link";
import { Check, Star, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

/* ─── Password Strength Helper ─── */
function getPasswordStrength(pw: string) {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  return [
    { level: 0, label: "",       color: "" },
    { level: 1, label: "Weak",   color: "bg-red-500"    },
    { level: 2, label: "Fair",   color: "bg-yellow-500" },
    { level: 3, label: "Good",   color: "bg-blue-500"   },
    { level: 4, label: "Strong", color: "bg-green-500"  },
  ][score];
}

const benefits = [
  "14-day Pro trial — no credit card needed",
  "5,000+ app integrations out of the box",
  "Cancel or downgrade anytime",
];

const sideStats = [
  { value: "10K+",  label: "Teams"      },
  { value: "200M+", label: "Tasks / mo" },
  { value: "99.9%", label: "Uptime"     },
];

/* ─── Shared input className ─── */
const inputCls =
  "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 " +
  "focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 " +
  "outline-none transition-all duration-150 text-sm text-slate-900 " +
  "placeholder:text-slate-400";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    password:  "",
  });

  const pwStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/v1/signup", {
        name:     `${formData.firstName} ${formData.lastName}`,
        email:    formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", res.data.token);
      toast.success("Account created! Redirecting…");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* ══════════════════════════════════
          LEFT PANEL — Visual / Social proof
      ══════════════════════════════════ */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-950 p-14 text-white relative overflow-hidden">

        {/* Ambient orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[130px] -ml-20 -mb-20 pointer-events-none" />

        {/* Top: Logo + headline + benefits + stats */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-12 group">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center font-bold text-base shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform duration-200">
              Z
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Zappy</span>
          </Link>

          <h2 className="font-display text-5xl font-bold leading-[1.05] tracking-tight mb-10">
            Automate your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              way to growth.
            </span>
          </h2>

          {/* Benefit list */}
          <ul className="space-y-4 mb-12">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">{b}</span>
              </li>
            ))}
          </ul>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3">
            {sideStats.map((s) => (
              <div
                key={s.label}
                className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 text-center"
              >
                <div className="font-display text-2xl font-bold text-white mb-0.5">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Testimonial card */}
        <div className="relative z-10 bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl border border-slate-700/40">
          <div className="flex gap-1 mb-3 text-orange-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-5">
            "Zappy transformed how our engineering team handles alerts. It's
            the glue that holds our operations together."
          </p>
          <div className="flex items-center gap-3">
            {/* Avatar with initials */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              SJ
            </div>
            <div>
              <div className="text-sm font-bold text-white">Sarah Jenkins</div>
              <div className="text-xs text-slate-500">CTO at TechFlow</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          RIGHT PANEL — Sign-up form
      ══════════════════════════════════ */}
      <div className="flex flex-col justify-center items-center min-h-screen px-8 py-12 bg-white">

        {/* Mobile-only logo */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-orange-500/25">
              Z
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              Zappy
            </span>
          </Link>
        </div>

        <div className="w-full max-w-[400px]">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>

          {/* Social auth buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Google */}
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 py-2.5 rounded-xl transition-all text-sm font-semibold text-slate-700 shadow-sm"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            {/* GitHub */}
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 py-2.5 rounded-xl transition-all text-sm font-semibold text-slate-700 shadow-sm"
            >
              <svg className="w-4 h-4 flex-shrink-0 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  First Name
                </label>
                <input
                  name="firstName"
                  type="text"
                  required
                  onChange={handleChange}
                  placeholder="John"
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Last Name
                </label>
                <input
                  name="lastName"
                  type="text"
                  required
                  onChange={handleChange}
                  placeholder="Doe"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Work Email
              </label>
              <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                placeholder="name@company.com"
                className={inputCls}
              />
            </div>

            {/* Password + strength */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye      className="w-4 h-4" />
                  }
                </button>
              </div>

              {/* ── Strength bar ── */}
              {formData.password && (
                <div className="pt-1 space-y-1.5">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= pwStrength.level ? pwStrength.color : "bg-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-[11px] font-semibold transition-colors ${
                      pwStrength.level === 1 ? "text-red-500"    :
                      pwStrength.level === 2 ? "text-yellow-500" :
                      pwStrength.level === 3 ? "text-blue-500"   : "text-green-500"
                    }`}
                  >
                    {pwStrength.label} password
                  </p>
                </div>
              )}
            </div>

            <PrimaryButton isLoading={loading} type="submit" className="w-full mt-2">
              Create account
            </PrimaryButton>
          </form>

          {/* Legal */}
          <p className="text-[11px] text-slate-400 text-center mt-4 leading-relaxed">
            By signing up you agree to our{" "}
            <Link href="/terms"   className="underline underline-offset-2 hover:text-slate-600 transition-colors">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-slate-600 transition-colors">Privacy Policy</Link>.
          </p>

          {/* Login link */}
          <div className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-orange-600 font-bold hover:text-orange-500 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}