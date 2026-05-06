'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn, AlertCircle, Loader2 } from "lucide-react";
import { loginAction } from "@/app/actions/adminAuth"; 

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Send the password to the secure server action
      const result = await loginAction(password);

      if (result.success) {
        router.push("/Admin"); 
      } else {
        setError(result.error || "Incorrect password.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("An error occurred connecting to the server.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 font-sans p-4">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700">
        
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            IEEE Admin Login
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            Enter the administrative password to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-100 dark:border-red-800/50">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              className="w-full border border-gray-200 dark:border-slate-600 p-3.5 rounded-xl bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold p-3.5 rounded-xl hover:bg-emerald-700 transition-colors focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
            {isSubmitting ? "Verifying..." : "Login to Dashboard"}
          </button>
        </form>

      </div>
    </div>
  );
}