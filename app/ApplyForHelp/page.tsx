'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, Send, ArrowLeft, LifeBuoy } from 'lucide-react';
import Link from 'next/link';

export default function ApplyForHelp() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => setStatus('success'), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-blue-500/50">
            <CheckCircle2 className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-white">Request Received</h2>
          <p className="text-zinc-400">We have assigned a support agent to your case. <br/> Check your email for ticket #SUP-2049.</p>
          <Link href="/" className="inline-block mt-8 text-blue-400 hover:text-blue-300">
            Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden flex items-center justify-center p-4 sm:p-8">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[20%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 border-b border-zinc-800 pb-6">
          <Link href="/" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-300 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
                <LifeBuoy className="w-6 h-6 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Support Request
            </h1>
          </div>
          <p className="text-zinc-400 mt-2 ml-1">
            Facing an issue or have a question? Fill out the form below and we'll get back to you shortly.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Your Name</label>
              <input 
                required
                type="text" 
                placeholder="Jane Smith"
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-700"
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Email Address</label>
              <input 
                required
                type="email" 
                placeholder="jane@example.com"
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-700"
              />
            </motion.div>
          </div>

          {/* Help Category Selector */}
          <motion.div variants={itemVariants} className="space-y-2 relative">
            <label className="text-sm font-medium text-zinc-300">How can we help?</label>
            <div className="relative">
              <select className="w-full appearance-none bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-zinc-300">
                <option>General Inquiry</option>
                <option>Billing & Subscriptions</option>
                <option>Account Access</option>
                <option>Technical Support</option>
                <option>Partnership Proposal</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </motion.div>

          {/* Subject Line */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Subject</label>
            <input 
                required
                type="text" 
                placeholder="e.g. Can't access my dashboard"
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-700"
            />
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Message</label>
            <textarea 
              required
              rows={4}
              placeholder="Tell us more about what you need..."
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-700 resize-none"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <button 
              disabled={status === 'submitting'}
              className="w-full group relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-4 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </motion.div>

        </form>
      </motion.div>
    </div>
  );
}