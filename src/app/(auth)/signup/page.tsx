"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SignUp } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";

export default function Signup() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.08),transparent_30%)]" />

      <div className="relative z-10 w-full max-w-6xl grid gap-8 lg:grid-cols-[1fr_0.9fr] items-center">
        <div className="hidden lg:block text-white space-y-6 max-w-xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-orange-300 backdrop-blur">
            Serverless + Appwrite
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Create your account with Clerk OAuth
          </h1>
          <p className="text-base leading-7 text-slate-300">
            Zappy is now fully serverless with Appwrite. Clerk manages auth, Appwrite manages all your data and workflows.
          </p>
        </div>

        <div className="w-full rounded-4xl border border-white/10 bg-white p-4 shadow-2xl shadow-black/30 lg:p-6">
          {isClerkConfigured ? (
            <SignUp routing="path" path="/signup" signInUrl="/sign-in" fallbackRedirectUrl="/dashboard" />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-lg font-bold text-slate-900">Authentication is not configured.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add a real Clerk publishable key to enable the sign-up form.
              </p>
              <Link href="/" className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                Go back home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
