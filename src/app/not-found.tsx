"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import "./globals.css";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-red-500/10">
        <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
      </div>
      
      <h1 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">404</h1>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
        Page Not Found
      </h2>
      
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 text-lg">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Go Back
        </button>
        <Link href="/">
          <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2">
            <Home className="w-5 h-5" /> Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
