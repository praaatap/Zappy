import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SignIn } from "@clerk/nextjs";

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-center">
        <div className="hidden lg:block text-slate-900">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
          <div className="space-y-5 max-w-xl">
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-orange-600 shadow-sm">
              Clerk Auth
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Sign in to manage your automations without the old JWT flow.
            </h1>
            <p className="text-base leading-7 text-slate-600 max-w-lg">
              This route now uses Clerk directly. Your dashboard session is the source of truth, and the backend is moving to Appwrite-backed serverless routes.
            </p>
          </div>
        </div>

        <div className="w-full rounded-[2rem] border border-slate-200/70 bg-white p-4 shadow-2xl shadow-slate-200/60 lg:p-6">
          <SignIn routing="path" path="/login" signUpUrl="/signup" fallbackRedirectUrl="/dashboard" />
        </div>
      </div>
    </div>
  );
}