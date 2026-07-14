"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  User, Phone, Mail, Calendar, MapPin, 
  CreditCard, ShieldCheck, ChevronRight, ChevronLeft, CheckCircle2 
} from "lucide-react";

// Strict Zod Validation Schema
const formSchema = z.object({
  // Step 1: Personal Info
  fullName: z.string().min(3, "Full name must be at least 3 characters").max(50),
  fatherName: z.string().min(3, "Father/Husband name is required").max(50),
  gender: z.string().min(1, "Gender is required"),
  dob: z.string().min(1, "Date of birth is required"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian mobile number"),
  email: z.string().email("Invalid email address").min(1, "Email is required for OTP"),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits").optional().or(z.literal("")),
  voterId: z.string().regex(/^[A-Z]{3}\d{7}$/, "Invalid Voter ID (e.g., ABC1234567)").optional().or(z.literal("")),
  
  // Step 2: Address Info
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  taluka: z.string().min(2, "Taluka/Mandal is required"),
  village: z.string().min(2, "Village/City is required"),
  fullAddress: z.string().min(10, "Please provide a detailed address"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Must be a valid 6-digit PIN code"),
  
  // Step 3: Referral
  referralCode: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const STEPS = [
  { id: 1, title: "Personal Details" },
  { id: 2, title: "Address Info" },
  { id: 3, title: "Verification" },
  { id: 4, title: "Review" },
];

export function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      fatherName: "",
      gender: "",
      dob: "",
      mobile: "",
      email: "",
      aadhaar: "",
      voterId: "",
      state: "",
      district: "",
      taluka: "",
      village: "",
      fullAddress: "",
      pincode: "",
      referralCode: "",
    },
  });

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(["fullName", "fatherName", "gender", "dob", "mobile", "email", "aadhaar", "voterId"]);
    } else if (step === 2) {
      isValid = await form.trigger(["state", "district", "taluka", "village", "fullAddress", "pincode"]);
    } else if (step === 3) {
      // If OTP is verified, move to step 4
      isValid = true; // Bypassing actual OTP logic for UI purposes
    }

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: FormData) => {
    console.log("Form Submitted:", data);
    // TODO: Connect to backend Server Actions
    alert("Registration Successful!");
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-slate-100 dark:border-slate-800 p-8 md:p-14 overflow-hidden relative">
      
      {/* Decorative Background Blur */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Progress Stepper */}
      <div className="mb-12 relative z-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 dark:bg-slate-800 w-full -z-10 rounded-full" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-700 ease-in-out" 
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map((s) => {
            const isActive = step >= s.id;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 shadow-sm ${
                    isActive 
                      ? 'bg-primary text-slate-950 scale-110 shadow-primary/30' 
                      : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-100 dark:border-slate-700'
                  }`}
                >
                  {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : s.id}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${isCurrent ? 'text-primary' : 'text-slate-400'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Personal Information */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Personal Details</h2>
                <p className="text-slate-500">Please provide your accurate personal information as per official records.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input {...form.register("fullName")} className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="E.g. Ramesh Kumar" />
                  </div>
                  {form.formState.errors.fullName && <p className="text-red-500 text-xs font-medium">{form.formState.errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Father/Husband Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input {...form.register("fatherName")} className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Relative's name" />
                  </div>
                  {form.formState.errors.fatherName && <p className="text-red-500 text-xs font-medium">{form.formState.errors.fatherName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date of Birth *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="date" {...form.register("dob")} className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                  </div>
                  {form.formState.errors.dob && <p className="text-red-500 text-xs font-medium">{form.formState.errors.dob.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gender *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select {...form.register("gender")} className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {form.formState.errors.gender && <p className="text-red-500 text-xs font-medium">{form.formState.errors.gender.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <span className="absolute left-11 top-1/2 -translate-y-1/2 text-slate-500 font-medium">+91</span>
                    <input {...form.register("mobile")} className="w-full h-14 pl-20 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="9876543210" maxLength={10} />
                  </div>
                  {form.formState.errors.mobile && <p className="text-red-500 text-xs font-medium">{form.formState.errors.mobile.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="email" {...form.register("email")} className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Required for OTP Verification" />
                  </div>
                  {form.formState.errors.email && <p className="text-red-500 text-xs font-medium">{form.formState.errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Aadhaar Number (Optional)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input {...form.register("aadhaar")} className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="12-digit number" maxLength={12} />
                  </div>
                  {form.formState.errors.aadhaar && <p className="text-red-500 text-xs font-medium">{form.formState.errors.aadhaar.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Voter ID (Optional)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input {...form.register("voterId")} className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all uppercase" placeholder="e.g. ABC1234567" maxLength={10} />
                  </div>
                  {form.formState.errors.voterId && <p className="text-red-500 text-xs font-medium">{form.formState.errors.voterId.message}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Address Information */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Residential Address</h2>
                <p className="text-slate-500">Provide your current residential details for organizational mapping.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">State *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input {...form.register("state")} className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="State name" />
                  </div>
                  {form.formState.errors.state && <p className="text-red-500 text-xs font-medium">{form.formState.errors.state.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">District *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input {...form.register("district")} className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="District name" />
                  </div>
                  {form.formState.errors.district && <p className="text-red-500 text-xs font-medium">{form.formState.errors.district.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Taluka/Mandal *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input {...form.register("taluka")} className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Taluka/Mandal" />
                  </div>
                  {form.formState.errors.taluka && <p className="text-red-500 text-xs font-medium">{form.formState.errors.taluka.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Village/City *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input {...form.register("village")} className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Village or City" />
                  </div>
                  {form.formState.errors.village && <p className="text-red-500 text-xs font-medium">{form.formState.errors.village.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Address *</label>
                  <textarea {...form.register("fullAddress")} className="w-full h-24 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none" placeholder="House No, Street, Area, Landmark" />
                  {form.formState.errors.fullAddress && <p className="text-red-500 text-xs font-medium">{form.formState.errors.fullAddress.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">PIN Code *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input {...form.register("pincode")} className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="6-digit PIN" maxLength={6} />
                  </div>
                  {form.formState.errors.pincode && <p className="text-red-500 text-xs font-medium">{form.formState.errors.pincode.message}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Referral & Verification */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Referral & OTP Verification</h2>
                <p className="text-slate-500">Link your account to a referrer and verify your email.</p>
              </div>

              <div className="space-y-8 max-w-2xl mx-auto">
                {/* Referral Box */}
                <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Have a Referral Code? (Optional)</label>
                  <p className="text-slate-500 text-sm mb-4">Support the member who invited you by entering their unique referral code.</p>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-6 h-6" />
                    <input {...form.register("referralCode")} className="w-full h-14 pl-14 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white focus:ring-2 focus:ring-primary outline-none transition-all uppercase font-semibold tracking-wider text-slate-900" placeholder="E.G. RAVP458963" />
                  </div>
                </div>
                
                {/* OTP Box */}
                <div className="p-8 rounded-3xl border border-primary/30 bg-primary/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] -mr-10 -mt-10" />
                  
                  <div className="relative z-10 text-center">
                    <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-2xl text-slate-900 dark:text-white mb-2">Verify Your Email</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      A one-time password will be sent to <br/>
                      <strong className="text-slate-900 dark:text-white border-b border-primary/30 pb-1">{form.getValues("email")}</strong>
                    </p>
                    
                    {!isOtpSent ? (
                      <Button 
                        type="button" 
                        onClick={() => setIsOtpSent(true)}
                        className="w-full sm:w-auto h-14 px-8 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 font-bold text-lg"
                      >
                        Send OTP Code
                      </Button>
                    ) : (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex gap-4 max-w-sm mx-auto">
                          <input 
                            type="text" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="h-14 w-full text-center text-2xl font-bold tracking-[0.5em] rounded-2xl border-2 border-primary/50 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                            placeholder="------" 
                            maxLength={6}
                          />
                        </div>
                        <p className="text-sm text-slate-500">Didn't receive it? <button type="button" className="text-primary font-bold hover:underline">Resend OTP</button></p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Review & Confirm</h2>
                <p className="text-slate-500">Please verify your details before generating your Member ID.</p>
              </div>

              <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-900/5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Application Summary
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <span className="text-sm font-semibold text-slate-400 block mb-1">Full Name</span>
                    <strong className="text-lg text-slate-900 dark:text-white block">{form.getValues("fullName")}</strong>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-400 block mb-1">Contact</span>
                    <strong className="text-lg text-slate-900 dark:text-white block">+91 {form.getValues("mobile")}</strong>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-400 block mb-1">Email</span>
                    <strong className="text-lg text-slate-900 dark:text-white block">{form.getValues("email")}</strong>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-400 block mb-1">Location</span>
                    <strong className="text-lg text-slate-900 dark:text-white block">{form.getValues("village")}, {form.getValues("district")}</strong>
                  </div>
                  {form.getValues("referralCode") && (
                    <div className="sm:col-span-2">
                      <span className="text-sm font-semibold text-slate-400 block mb-1">Referral Code Applied</span>
                      <strong className="text-lg text-primary font-bold block uppercase">{form.getValues("referralCode")}</strong>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    By confirming this application, I declare that all information provided is true to my knowledge and I agree to abide by the constitution and core values of the organization.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100 dark:border-slate-800 mt-12 relative z-10">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={prevStep}
            disabled={step === 1}
            className={`h-14 px-8 rounded-full font-bold text-base transition-opacity ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          
          {step < 4 ? (
            <Button 
              type="button" 
              onClick={nextStep}
              className="h-14 px-10 rounded-full font-bold text-base bg-primary text-slate-950 hover:bg-primary/90 shadow-xl shadow-primary/20 w-full sm:w-auto transition-transform hover:scale-105 active:scale-95"
            >
              Continue <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="h-14 px-10 rounded-full font-bold text-base bg-accent text-slate-950 hover:bg-white shadow-2xl shadow-accent/20 w-full sm:w-auto transition-all hover:scale-105 active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" /> Complete Registration
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
