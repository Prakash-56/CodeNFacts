"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, ChevronRight, Loader2,
  ShieldCheck, CheckCircle2, AlertCircle, BookOpen, Sparkles,
} from "lucide-react";

interface EnrollPageProps { params: { slug: string } }
type Step = "form" | "paying" | "verifying" | "success";
declare global { interface Window { Cashfree: any } }

function Field({ icon: Icon, label, name, type = "text", value, onChange, disabled }: {
  icon: React.ElementType; label: string; name: string; type?: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative group">
      <div className={`absolute -inset-px rounded-xl transition-all duration-300 ${focused ? "opacity-100" : "opacity-0"} bg-gradient-to-r from-violet-500/40 via-fuchsia-500/40 to-pink-500/40 blur-sm`} />
      <div className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 ${focused ? "border-violet-500/60 bg-[#16112a]" : "border-white/[0.08] bg-[#0e0b1e]/80"}`}>
        <Icon className={`w-4 h-4 shrink-0 transition-colors duration-200 ${focused ? "text-violet-400" : "text-slate-500"}`} />
        <div className="flex-1 relative h-10">
          <motion.label htmlFor={name} animate={{ y: active ? -10 : 4, scale: active ? 0.75 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute left-0 top-0 origin-left pointer-events-none text-sm text-slate-400">{label}</motion.label>
          <input id={name} name={name} type={type} value={value} required disabled={disabled}
            onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            className="absolute bottom-0 left-0 w-full bg-transparent text-white text-sm outline-none disabled:opacity-50" placeholder="" />
        </div>
      </div>
    </div>
  );
}

function StatusPill({ step }: { step: Step }) {
  const map: Record<Step, { label: string; color: string }> = {
    form:      { label: "Enrollment Open",  color: "from-violet-500 to-fuchsia-500" },
    paying:    { label: "Opening Payment",  color: "from-amber-400 to-orange-500"   },
    verifying: { label: "Verifying…",       color: "from-sky-400 to-cyan-500"       },
    success:   { label: "All Done!",        color: "from-emerald-400 to-teal-500"   },
  };
  const { label, color } = map[step];
  return (
    <motion.span key={step} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${color}`}>
      <Sparkles className="w-3 h-3" />{label}
    </motion.span>
  );
}

export default function EnrollPage({ params }: EnrollPageProps) {
  const slug = params?.slug ?? "";
  const courseTitle = slug.split("-").join(" ").replace(/\b\w/g, (l) => l.toUpperCase());
  const [step, setStep]       = useState<Step>("form");
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ fullName: "", email: "", phone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError(null);
  };

  useEffect(() => {
    if (document.getElementById("cf-sdk")) return;
    const s = document.createElement("script");
    s.id = "cf-sdk"; s.src = "https://sdk.cashfree.com/js/v3/cashfree.js"; s.async = true;
    document.body.appendChild(s);
  }, []);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      // 1. Create order
      const res  = await fetch("/api/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create order");
      const { order_id, payment_session_id } = data;
      setStep("paying");

      // 2. Open Cashfree inline modal
      const cf = await (window as any).Cashfree({ mode: "production" }); // "sandbox" for testing
      await cf.checkout({ paymentSessionId: payment_session_id, redirectTarget: "_modal" });

      // 3. Verify payment
      setStep("verifying");
      const vRes  = await fetch("/api/verify-payment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id }),
      });
      const vData = await vRes.json();
      if (!vRes.ok || vData.status !== "PAID") throw new Error(vData.error || "Payment verification failed");

      // 4. Success → /my-batch
      setStep("success");
      setTimeout(() => { window.location.href = "/my-batch"; }, 2200);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setStep("form");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#07050f] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-violet-700/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-fuchsia-700/10 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #a78bfa 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">

          {/* FORM / PAYING */}
          {(step === "form" || step === "paying") && (
            <motion.div key="form-card" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/[0.08] bg-[#0c0919]/70 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
              <div className="px-8 pt-8 pb-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <StatusPill step={step} />
                    <h1 className="mt-3 text-2xl font-bold text-white leading-tight">Join the Course</h1>
                    <p className="mt-1 text-sm text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /><span className="capitalize">{courseTitle}</span>
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 shrink-0">
                    <ShieldCheck className="w-5 h-5 text-violet-400" />
                  </div>
                </div>

                <form onSubmit={handleEnroll} className="space-y-4">
                  <Field icon={User}  label="Full Name"     name="fullName" value={form.fullName} onChange={handleChange} disabled={loading} />
                  <Field icon={Mail}  label="Email Address" name="email"    type="email" value={form.email} onChange={handleChange} disabled={loading} />
                  <Field icon={Phone} label="Phone Number"  name="phone"    type="tel"   value={form.phone} onChange={handleChange} disabled={loading} />

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-950/50 border border-red-700/40 text-red-300 text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />{error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}
                    type="submit" disabled={loading}
                    className="relative mt-2 w-full py-4 rounded-xl font-semibold text-white text-base overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed">
                    <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600" />
                    <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                      initial={{ x: "-100%" }} animate={{ x: "200%" }}
                      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }} />
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Opening Payment…</> : <>Enroll &amp; Pay Now<ChevronRight className="w-5 h-5" /></>}
                    </span>
                  </motion.button>
                  <p className="text-center text-xs text-slate-500 pt-1">🔒 Secured by Cashfree Payments</p>
                </form>
              </div>
            </motion.div>
          )}

          {/* VERIFYING */}
          {step === "verifying" && (
            <motion.div key="verifying-card" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }} transition={{ duration: 0.4 }}
              className="rounded-2xl border border-sky-500/20 bg-[#060d18]/80 backdrop-blur-xl shadow-2xl shadow-black/60 px-8 py-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sky-500/10 border border-sky-500/30 mb-6">
                <Loader2 className="w-9 h-9 text-sky-400 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment</h2>
              <p className="text-slate-400 text-sm">Hang tight — confirming your transaction…</p>
              <div className="flex justify-center gap-1.5 mt-6">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-sky-400"
                    animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* SUCCESS */}
          {step === "success" && (
            <motion.div key="success-card" initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-emerald-500/20 bg-[#06120e]/80 backdrop-blur-xl shadow-2xl shadow-black/60 px-8 py-16 text-center">
              <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.15 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2">You&apos;re In! 🎉</motion.h2>
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
                className="text-slate-400 text-sm mb-8">Payment confirmed. Taking you to your batch…</motion.p>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                  initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.2, ease: "easeInOut" }} />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}