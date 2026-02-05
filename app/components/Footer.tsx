"use client";

import React, { useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Github, Twitter, Youtube, ArrowRight, Zap, CheckCircle2, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const currentYear = new Date().getFullYear();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <footer 
      onMouseMove={handleMouseMove}
      className="group relative border-t border-white/10 bg-[#050505] px-6 py-20 overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.06),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <Zap size={20} className="text-white fill-current" />
              </div>
              <h3 className="text-2xl font-bold tracking-tighter text-white">CodeNFacts</h3>
            </div>
            <p className="text-lg text-gray-400 max-w-md leading-relaxed">
              Elevating tech education through precision roadmaps. Learn smart. Grow fast.
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em] mb-6">Learn</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {['AI Roadmaps', 'ML Basics', 'Advanced Dev'].map((item) => (
                <li key={item} className="hover:text-white transition-colors cursor-pointer">{item}</li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  Join the Inner Circle {status === "success" && <CheckCircle2 className="text-emerald-500" size={20} />}
                </h4>
                <p className="text-sm text-gray-400 mb-6">
                  {status === "success" 
                    ? "You're in! Check your inbox for the first roadmap." 
                    : "Get exclusive AI/ML facts and deep-dives every Sunday."}
                </p>

                <form onSubmit={handleSubmit} className="relative">
                  <input 
                    required
                    type="gmail" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-name@gmail.com" 
                    disabled={status === "success"}
                    className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={status !== "idle"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all active:scale-95 disabled:bg-emerald-500"
                  >
                    {status === "loading" ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : status === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <ArrowRight size={18} />
                    )}
                  </button>
                </form>
              </div>
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full" />
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-medium uppercase tracking-[0.1em] text-gray-600">
          <p>© {currentYear} CodeNFacts • Built for the 1%</p>
          
          <div className="flex items-center gap-6 mt-6 md:mt-0">
            {/* Standard Socials */}
            <a href="https://github.com" target="_blank" className="hover:text-white transition-colors">
              <Github size={18} />
            </a>
            <a href="https://instagram.com/codenfacts?igsh=MTRxaGl0djF6cnNqaQ==" target="_blank" className="hover:text-white transition-colors">
              <Instagram size={18} />
            </a>
            
            {/* Unique Styled LinkedIn Button */}
            <a 
              href="https://linkedin.com/company/codenfacts/" 
              target="_blank"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300"
            >
              <Linkedin size={14} />
              <span className="text-[9px]">Connect</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}