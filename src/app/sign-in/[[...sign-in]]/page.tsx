import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/clerk-config";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      {isClerkConfigured ? (
        <SignIn />
      ) : (
        <div className="max-w-md rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Clerk is not configured.</p>
          <p className="mt-2 text-sm text-slate-600">
            Add a real publishable key in your environment to use the hosted sign-in flow.
          </p>
        </div>
      )}
    </div>
  );
}
