"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, LayoutDashboard } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 text-indigo-600 shadow-sm">
        <RefreshCw size={28} />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Something went wrong</h2>
      <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
        {error?.message || "The application encountered an unexpected state."}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-1.5"
        >
          <LayoutDashboard size={14} /> Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
