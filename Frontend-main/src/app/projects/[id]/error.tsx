"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Project Detail Error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4 text-rose-500 shadow-sm">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Unable to Load Project</h2>
      <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
        {error?.message || "An unexpected error occurred while loading this project."}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw size={12} /> Try Again
        </button>
        <Link
          href="/projects"
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back to Projects
        </Link>
      </div>
    </div>
  );
}
