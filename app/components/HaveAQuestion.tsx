"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MessageSquare, Fingerprint, Layers } from 'lucide-react';

const HaveAQuestion = () => {
  const [mounted, setMounted] = useState(false);
  const [question, setQuestion] = useState('');
  
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex items-center justify-center p-6 relative font-sans">
      {/* Dynamic CSS Background (Safe alternative to 3D) */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Branding Side */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-widest text-cyan-400">
            <Sparkles size={14} /> NEW TRANSMISSION PROTOCOL
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
            HAVE A <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">QUESTION?</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-md leading-relaxed">
            Our neural network of experts is ready to decrypt your logic blocks. Reach out and bridge the gap between concept and code.
          </p>
          <div className="flex gap-6 pt-4">
             <div className="flex items-center gap-2 text-xs font-bold text-zinc-400"><Fingerprint size={16}/> SECURE</div>
             <div className="flex items-center gap-2 text-xs font-bold text-zinc-400"><Layers size={16}/> DECENTRALIZED</div>
          </div>
        </div>

        {/* Interaction Side */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
          <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 flex items-center gap-2">
                  <MessageSquare size={12}/> Connection Point
                </label>
                <textarea 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything about the stack..."
                  className="w-full bg-transparent border-b border-white/10 py-6 text-xl md:text-2xl focus:border-cyan-500 outline-none transition-all resize-none min-h-[180px]"
                />
              </div>
              
              <button className="w-full bg-white text-black py-6 rounded-xl font-black text-sm uppercase flex items-center justify-center gap-3 hover:bg-cyan-400 transition-colors group">
                Establish Link
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HaveAQuestion;