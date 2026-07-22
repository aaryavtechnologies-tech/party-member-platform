"use client";

import { useState } from "react";
import { Send, RotateCcw, CheckCircle2, AlertCircle, Loader2, MessageSquare, ShieldCheck } from "lucide-react";

interface ContactFormProps {
  locale: string;
}

const GUJARAT_DISTRICTS = [
  "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch",
  "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhumi Dwarka",
  "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch",
  "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal",
  "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar",
  "Tapi", "Vadodara", "Valsad"
];

export function ContactForm({ locale }: ContactFormProps) {
  const isGu = locale === "gu";

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    state: "Gujarat",
    district: "Rajkot",
    taluka: "Rajkot",
    subject: "Membership Registration",
    message: "",
    website_url_hp: "", // Honeypot field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const subjects = [
    { en: "Membership Registration", gu: "સભ્યપદ નોંધણી" },
    { en: "Membership Upgrade", gu: "સભ્યપદ અપગ્રેડ" },
    { en: "Program Information", gu: "કાર્યક્રમ માહિતી" },
    { en: "District Office Contact", gu: "જિલ્લા કાર્યાલય સંપર્ક" },
    { en: "Taluka Office Contact", gu: "તાલુકા કાર્યાલય સંપર્ક" },
    { en: "Media & Press Query", gu: "મીડિયા અને પ્રેસ પૂછપરછ" },
    { en: "Suggestions for Party", gu: "પક્ષ માટે સૂચનો" },
    { en: "Grievance / Complaint", gu: "ફરિયાદ / રજૂઆત" },
    { en: "Volunteer Interest", gu: "સ્વયંસેવક બનવાની ઈચ્છા" },
    { en: "General Inquiry", gu: "સામાન્ય પૂછપરછ" },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = isGu ? "પૂરું નામ જરૂરી છે" : "Full Name is required";
    }

    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = isGu ? "મોબાઈલ નંબર જરૂરી છે" : "Mobile Number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      errs.mobileNumber = isGu ? "૧૦ અંકનો માન્ય મોબાઈલ નંબર દાખલ કરો" : "Enter a valid 10-digit mobile number";
    }

    if (!formData.email.trim()) {
      errs.email = isGu ? "ઇમેઇલ એડ્રેસ જરૂરી છે" : "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = isGu ? "માન્ય ઇમેઇલ સરનામું દાખલ કરો" : "Enter a valid email address";
    }

    if (!formData.state.trim()) {
      errs.state = isGu ? "રાજ્ય જરૂરી છે" : "State is required";
    }

    if (!formData.district.trim()) {
      errs.district = isGu ? "જિલ્લો જરૂરી છે" : "District is required";
    }

    if (!formData.taluka.trim()) {
      errs.taluka = isGu ? "તાલુકો જરૂરી છે" : "Taluka is required";
    }

    if (!formData.subject.trim()) {
      errs.subject = isGu ? "વિષય જરૂરી છે" : "Subject is required";
    }

    if (!formData.message.trim()) {
      errs.message = isGu ? "સંદેશ જરૂરી છે" : "Message is required";
    } else if (formData.message.trim().length < 10) {
      errs.message = isGu ? "સંદેશ ઓછામાં ઓછો ૧૦ અક્ષરોનો હોવો જોઈએ" : "Message must be at least 10 characters long";
    } else if (formData.message.trim().length > 2000) {
      errs.message = isGu ? "સંદેશ ૨૦૦૦ અક્ષરોથી વધુ ન હોવો જોઈએ" : "Message cannot exceed 2000 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      mobileNumber: "",
      email: "",
      state: "Gujarat",
      district: "Rajkot",
      taluka: "Rajkot",
      subject: "Membership Registration",
      message: "",
      website_url_hp: "",
    });
    setErrors({});
    setServerError(null);
    setSubmittedId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmittedId(data.inquiryId);
      } else {
        setServerError(data.message || (isGu ? "સબમિશન નિષ્ફળ ગયું. કૃપા કરીને ફરી પ્રયાસ કરો." : "Submission failed. Please try again."));
      }
    } catch (err) {
      console.error(err);
      setServerError(isGu ? "નેટવર્ક ભૂલ. કૃપા કરીને પછીથી પ્રયાસ કરો." : "Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-form-section" className="py-20 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/60 px-4 py-1.5 rounded-full inline-block mb-3">
            {isGu ? "ઑનલાઇન પૂછપરછ" : "Online Inquiry"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isGu ? "ઑનલાઇન સંપર્ક ફોર્મ" : "Online Contact Form"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {isGu
              ? "તમારા પ્રશ્નો, સુચનો અથવા ફરિયાદો નીચે દર્શાવેલ ફોર્મ દ્વારા સબમિટ કરો."
              : "Send us your message directly. Our administration team will respond promptly."}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Top Decorative Strip */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-600 via-amber-500 to-green-700" />

          {submittedId ? (
            /* Success Card UI */
            <div className="py-12 px-4 text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/80 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wider">
                  {isGu ? "સબમિશન સફળ" : "Submission Successful"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                  {isGu ? "આભાર!" : "Thank You!"}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-base max-w-lg mx-auto mt-2">
                  {isGu
                    ? "આપનો સંદેશ સફળતાપૂર્વક સબમિટ થઈ ગયો છે. અમારી ટીમ શક્ય તેટલી વહેલી તકે આપનો સંપર્ક કરશે."
                    : "Your message has been submitted successfully. Our team will contact you as soon as possible."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 inline-block text-left min-w-[280px]">
                <div className="text-xs text-slate-400 font-bold uppercase">{isGu ? "તમારો સંદર્ભ નંબર" : "Inquiry Reference ID"}</div>
                <div className="text-xl font-extrabold text-green-600 dark:text-green-400 tracking-wide mt-1">{submittedId}</div>
              </div>

              <div>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:scale-105 transition-transform"
                >
                  {isGu ? "બીજો સંદેશ મોકલો" : "Submit Another Message"}
                </button>
              </div>
            </div>
          ) : (
            /* Contact Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {serverError && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Hidden Honeypot Field for Spam Protection */}
              <input
                type="text"
                name="website_url_hp"
                value={formData.website_url_hp}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider mb-2">
                    {isGu ? "પૂરું નામ *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={isGu ? "દા.ત. રમેશભાઈ પટેલ" : "e.g. Ramesh Patel"}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.fullName
                        ? "border-rose-500 focus:ring-rose-400"
                        : "border-slate-200 dark:border-slate-800 focus:ring-green-500"
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider mb-2">
                    {isGu ? "મોબાઈલ નંબર *" : "Mobile Number *"}
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    maxLength={10}
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="9016641851"
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.mobileNumber
                        ? "border-rose-500 focus:ring-rose-400"
                        : "border-slate-200 dark:border-slate-800 focus:ring-green-500"
                    }`}
                  />
                  {errors.mobileNumber && <p className="text-xs text-rose-500 mt-1">{errors.mobileNumber}</p>}
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider mb-2">
                    {isGu ? "ઇમેઇલ સરનામું *" : "Email Address *"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? "border-rose-500 focus:ring-rose-400"
                        : "border-slate-200 dark:border-slate-800 focus:ring-green-500"
                    }`}
                  />
                  {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider mb-2">
                    {isGu ? "રાજ્ય *" : "State *"}
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Gujarat">Gujarat (ગુજરાત)</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider mb-2">
                    {isGu ? "જિલ્લો *" : "District *"}
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {GUJARAT_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Taluka */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider mb-2">
                    {isGu ? "તાલુકો *" : "Taluka *"}
                  </label>
                  <input
                    type="text"
                    name="taluka"
                    value={formData.taluka}
                    onChange={handleChange}
                    placeholder={isGu ? "દા.ત. પદ્ધરી / રાજકોટ" : "e.g. Paddhari / Rajkot"}
                    className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.taluka
                        ? "border-rose-500 focus:ring-rose-400"
                        : "border-slate-200 dark:border-slate-800 focus:ring-green-500"
                    }`}
                  />
                  {errors.taluka && <p className="text-xs text-rose-500 mt-1">{errors.taluka}</p>}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider mb-2">
                    {isGu ? "વિષય *" : "Subject *"}
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {subjects.map((sub, i) => (
                      <option key={i} value={sub.en}>
                        {isGu ? sub.gu : sub.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">
                    {isGu ? "સંદેશ / વિગત *" : "Message *"}
                  </label>
                  <span className="text-xs text-slate-400">
                    {formData.message.length} / 2000 {isGu ? "અક્ષરો" : "chars"}
                  </span>
                </div>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={isGu ? "તમારો સંદેશ વિગતવાર લખો..." : "Write your query, suggestion, or complaint in detail..."}
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.message
                      ? "border-rose-500 focus:ring-rose-400"
                      : "border-slate-200 dark:border-slate-800 focus:ring-green-500"
                  }`}
                />
                {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isGu ? "રીસેટ" : "Reset"}</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-green-700 hover:bg-green-600 text-white font-extrabold text-sm shadow-xl shadow-green-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isGu ? "સબમિટ થઈ રહ્યું છે..." : "Submitting..."}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isGu ? "સંદેશ સબમિટ કરો" : "Submit Message"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
