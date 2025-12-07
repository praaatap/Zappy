"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.type === "password" ? "password" : "email"]: e.target.value });
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
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 md:p-12 border border-slate-100 relative">
        
        {/* Back Button */}
        <Link href="/" className="absolute top-6 left-6 text-slate-400 hover:text-black">
            <ArrowLeft className="w-6 h-6" />
        </Link>

        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-orange-600 rounded mx-auto flex items-center justify-center text-white font-bold text-xl mb-4">Z</div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input 
                    name="email" 
                    onChange={handleChange} 
                    type="email" 
                    className="w-full border border-slate-300 rounded px-4 py-3 focus:ring-2 ring-orange-500 outline-none transition-all" 
                    placeholder="Enter your email" 
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <input 
                    name="password" 
                    onChange={handleChange} 
                    type="password" 
                    className="w-full border border-slate-300 rounded px-4 py-3 focus:ring-2 ring-orange-500 outline-none transition-all" 
                    placeholder="Enter your password" 
                />
            </div>

            <div className="flex justify-end">
                <a href="#" className="text-sm text-orange-600 font-semibold hover:underline">Forgot password?</a>
            </div>

            <PrimaryButton isLoading={loading} type="submit" className="w-full">
                Sign In
            </PrimaryButton>
        </form>

        <div className="mt-8 pt-6 border-t text-center text-sm text-slate-600">
            Don't have an account? <Link href="/signup" className="text-orange-600 font-bold hover:underline">Sign up for free</Link>
        </div>

      </div>
    </div>
  );
}