"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "@/i18n/routing";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
  email: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginValues = z.infer<typeof loginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.email, // using email field as username temporarily for UI compat
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || "Login failed. Please try again.");
        return;
      }

      toast.success("Welcome back Admin! Redirecting...");
      router.push(result.redirectUrl || "/admin/dashboard");
      router.refresh();
    } catch (err) {
      setServerError("Something went wrong. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full mx-auto"
    >
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Tricolor accent gradient top bar to match standard login */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-green-400 to-emerald-500" />

        <div className="p-8 sm:p-10 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              Admin Login
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to manage the RAVP platform
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-red-500">✕</span>
                  <p className="text-sm text-red-700 dark:text-red-400">{serverError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Username */}
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Username
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="admin-email"
                  type="text"
                  autoComplete="username"
                  placeholder="admin_username"
                  {...register("email")}
                  className={`pl-10 h-12 rounded-xl transition-all ${
                    errors.email
                      ? "border-red-400 focus-visible:ring-red-400 bg-red-50 dark:bg-red-950/20"
                      : "border-slate-200 dark:border-slate-700 focus-visible:ring-primary/30"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span>✕</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`pl-10 pr-11 h-12 rounded-xl transition-all ${
                    errors.password
                      ? "border-red-400 focus-visible:ring-red-400 bg-red-50 dark:bg-red-950/20"
                      : "border-slate-200 dark:border-slate-700 focus-visible:ring-primary/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span>✕</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </form>

        </div>
        
        {/* Footer */}
        <div className="px-8 pb-6 text-center bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
            🔒 Secure Admin Portal. Authorized personnel only.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
