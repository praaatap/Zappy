"use client";

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

/* ─── Shared input className (Matches Signup) ─── */
const inputCls =
  "w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 " +
  "focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 " +
  "outline-none transition-all duration-200 text-sm text-slate-900 " +
  "placeholder:text-slate-400 font-medium";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/v1/login", {
        email: formData.email,
        password: formData.password
      });

      // Save token to localStorage (or Cookies in a real app)
      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back!");
      router.push("/dashboard"); // Redirect to Dashboard
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      
      {/* Ambient Background Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[440px] w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-8 md:p-10 border border-slate-200/60 relative z-10">
        
        {/* Back Button */}
        <Link 
          href="/" 
          className="absolute top-8 left-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-full transition-colors"
          aria-label="Go back"
        >
            <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Header */}
        <div className="text-center mb-10 mt-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-xl mb-5 shadow-lg shadow-orange-500/25" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Z
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Please enter your details to sign in.
            </p>
        </div>

        {/* Social auth buttons (Matching Signup) */}
        <div className="grid grid-cols-2 gap-3 mb-7">
          {/* Google */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 py-2.5 rounded-xl transition-all text-sm font-semibold text-slate-700 shadow-sm active:scale-[0.98]"
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
            className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 py-2.5 rounded-xl transition-all text-sm font-semibold text-slate-700 shadow-sm active:scale-[0.98]"
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
              or sign in with email
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">
                  Email
                </label>
                <input 
                    name="email" 
                    onChange={handleChange} 
                    type="email" 
                    required
                    className={inputCls} 
                    placeholder="name@company.com" 
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[13px] text-orange-600 font-bold hover:text-orange-500 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input 
                      name="password" 
                      onChange={handleChange} 
                      type={showPassword ? "text" : "password"} 
                      required
                      className={`${inputCls} pr-12`} 
                      placeholder="Enter your password" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
            </div>

            <PrimaryButton isLoading={loading} type="submit" className="w-full mt-2 py-3 text-base">
                Sign In
            </PrimaryButton>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link href="/signup" className="text-orange-600 font-bold hover:text-orange-500 transition-colors">
              Sign up for free
            </Link>
        </div>

      </div>
    </div>
  );
}