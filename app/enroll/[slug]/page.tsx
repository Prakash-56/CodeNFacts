"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, User, ArrowRight, ShieldCheck, Loader2, CheckCircle } from "lucide-react";

export default function EnrollPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();
  
  // Dynamic data from URL
  const coursePrice = searchParams.get("price") || "0";
  const courseTitle = searchParams.get("title") || params.slug;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");

  const handlePayment = () => {
    setPaymentStatus("processing");
    // Simulating a payment gateway delay
    setTimeout(() => {
      setPaymentStatus("success");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          // --- STEP 1: SIGNUP FORM ---
          <motion.div 
            key="signup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
              <h2 className="text-3xl font-black text-white mb-2 text-center">Create Account</h2>
              <p className="text-gray-400 text-center mb-8">Join CodeNFacts to unlock {courseTitle}</p>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-blue-500 uppercase px-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-blue-500 uppercase px-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="email" placeholder="email@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 group">
                  Next: Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          // --- STEP 2: CHECKOUT & PAYMENT ---
          <motion.div 
            key="checkout"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-lg relative z-10"
          >
            <div className="bg-slate-900 border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl">
              {paymentStatus === "success" ? (
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-center py-10">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white">Payment Successful!</h2>
                  <p className="text-gray-400 mt-2">Welcome to the course. Redirecting to your dashboard...</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
                      <ShieldCheck />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Order Summary</h2>
                      <p className="text-sm text-gray-500">Review your enrollment details</p>
                    </div>
                  </div>

                  <div className="space-y-4 bg-white/5 rounded-3xl p-6 border border-white/5 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Course Name:</span>
                      <span className="text-white font-semibold">{courseTitle}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Awaiting Payment</span>
                    </div>
                    <div className="h-[1px] bg-white/10 my-2" />
                    <div className="flex justify-between items-end">
                      <span className="text-gray-400 font-medium">Total Price:</span>
                      <span className="text-3xl font-black text-white">₹{coursePrice}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handlePayment}
                    disabled={paymentStatus === "processing"}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black rounded-[2rem] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
                  >
                    {paymentStatus === "processing" ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Pay & Secure Seat</>
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}