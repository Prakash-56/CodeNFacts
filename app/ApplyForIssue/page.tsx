'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronDown, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ApplyForIssue() {
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
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
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
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-green-500/50">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white">Issue Reported</h2>
          <p className="text-zinc-400">Our engineering team has been notified. Ticket #8842 created.</p>
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
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
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
            Submit an Issue
          </h1>
          <p className="text-zinc-400 mt-2">
            Describe the bug or feature request in detail. High-quality reports get resolved faster.
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
                placeholder="John Doe"
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-zinc-700"
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Email Address</label>
              <input 
                required
                type="email" 
                placeholder="john@example.com"
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-zinc-700"
              />
            </motion.div>
          </div>

          {/* Issue Type Selector */}
          <motion.div variants={itemVariants} className="space-y-2 relative">
            <label className="text-sm font-medium text-zinc-300">Issue Category</label>
            <div className="relative">
              <select className="w-full appearance-none bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-zinc-300">
                <option>Bug Report</option>
                <option>Performance Issue</option>
                <option>Security Vulnerability</option>
                <option>Feature Request</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Description & Steps to Reproduce</label>
            <textarea 
              required
              rows={5}
              placeholder="1. Go to settings page&#10;2. Click on profile&#10;3. App crashes..."
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-zinc-700 resize-none"
            />
          </motion.div>

          {/* Warning Box */}
          <motion.div variants={itemVariants} className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200/80">
              Please do not include sensitive personal data (passwords, API keys) in this form.
            </p>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <button 
              disabled={status === 'submitting'}
              className="w-full group relative flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-4 rounded-lg shadow-lg shadow-red-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </motion.div>

        </form>
      </motion.div>
    </div>
  );
}