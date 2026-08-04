"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CheckCircle2, KeyRound, Lock, ShieldCheck, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const resetPasswordSchema = z.object({
  otp: z.string().length(6, { message: "Please enter the 6-digit OTP sent to your email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpBoxes, setOtpBoxes] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
       setTimeout(() => setErrorState("Missing email address for reset verification."), 0);
    }
  }, [email]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthColor = strength < 2 ? "bg-red-500" : strength < 4 ? "bg-amber-500" : "bg-green-500";
  const strengthLabel = strength < 2 ? "Weak" : strength < 4 ? "Good" : "Strong";

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otpBoxes];
    newOtp[index] = value;
    setOtpBoxes(newOtp);
    setValue("otp", newOtp.join(""), { shouldValidate: true });

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpBoxes[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6).replace(/[^0-9]/g, "");
    const newOtp = [...otpBoxes];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtpBoxes(newOtp);
    setValue("otp", newOtp.join(""), { shouldValidate: true });
    
    const focusIndex = Math.min(pastedData.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!email) return;
    setIsLoading(true);
    try {
      const { error } = await authClient.emailOtp.resetPassword({
        email: email,
        otp: data.otp,
        password: data.password,
      });

      if (error) {
        toast.error(error.message || "Failed to reset password");
        setErrorState("The OTP is invalid or has expired. Please request a new one.");
        return;
      }

      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (errorState) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto p-8 md:p-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-red-200 dark:border-red-900/50 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <AlertTriangle size={40} />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Reset Failed</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">{errorState}</p>
          <Link href="/membership/forgot-password">
            <Button className="w-full h-14 rounded-full text-lg font-bold shadow-lg shadow-red-500/20 bg-red-600 hover:bg-red-700 text-white transition-all hover:scale-[1.02]">
              Request New OTP
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-full max-w-md mx-auto p-8 md:p-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800/50 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <CheckCircle2 size={40} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-black text-slate-900 dark:text-white mb-3"
          >
            Password Reset!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium"
          >
            Your password has been successfully secured. You can now log in to your account.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/membership/login">
              <Button className="w-full h-14 rounded-full text-lg font-bold shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-[1.02]">
                Go to Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto p-8 md:p-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800/50 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <KeyRound size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Create New Password</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            Please enter the 6-digit OTP sent to <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-slate-700 dark:text-slate-300 font-semibold ml-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Verification Code
            </Label>
            <div className="flex justify-between gap-2">
              {otpBoxes.map((digit, idx) => (
                <Input
                  key={idx}
                  ref={(el) => { otpRefs.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                  className={`h-14 w-12 text-center text-xl font-bold rounded-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-sm ${errors.otp ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
              ))}
            </div>
            {errors.otp && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs text-red-500 font-medium ml-1">
                {errors.otp.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold ml-1">New Password</Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={`h-14 pl-12 pr-12 rounded-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-sm ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {/* Password Strength Meter */}
            <div className="mt-2 ml-1 mr-1">
              <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div key={level} className={`h-full flex-1 transition-colors duration-300 ${strength >= level ? strengthColor : "bg-transparent"}`} />
                ))}
              </div>
              {password && (
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs font-medium ${strength < 2 ? "text-red-500" : strength < 4 ? "text-amber-500" : "text-green-500"}`}>
                    {strengthLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Strength</span>
                </div>
              )}
            </div>
            {errors.password && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs text-red-500 font-medium ml-1 mt-1">
                {errors.password.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-semibold ml-1">Confirm Password</Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                className={`h-14 pl-12 pr-12 rounded-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-sm ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs text-red-500 font-medium ml-1">
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 rounded-full text-lg font-bold shadow-lg shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] mt-6" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Securing Account...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
