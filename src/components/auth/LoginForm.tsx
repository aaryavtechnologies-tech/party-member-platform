"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
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
      const { error } = await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
      });

      if (error) {
        setServerError(
          error.status === 401
            ? "Incorrect email or password. Please try again."
            : error.message || "Login failed. Please try again."
        );
        return;
      }

      toast.success("Welcome back! Redirecting...");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setServerError("Something went wrong. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      {/* Card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800 overflow-hidden">

        {/* Top accent gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-green-400 to-emerald-500" />

        <div className="p-8 md:p-10">
          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Member Portal Login
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Access your RAVP membership dashboard
            </p>
          </div>

          {/* Server Error Banner */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm text-red-700 dark:text-red-400 flex items-start gap-2"
            >
              <span className="mt-0.5 shrink-0 text-red-500">✕</span>
              {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </Label>
                <Link
                  href="/membership/forgot-password"
                  className="text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="login-password"
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 tracking-wider">
                New member?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link href="/membership/register" className="block">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Create an Account
            </Button>
          </Link>
        </div>

        {/* Bottom trust badge */}
        <div className="px-8 pb-6 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            🔒 Your data is encrypted and secure. Rashtriya Annadata Vikas Party.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
