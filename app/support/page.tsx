"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code, Zap, Shield, Clock, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'chat', label: 'Live Chat', icon: MessageCircle, color: 'from-emerald-500' },
    { id: 'ticket', label: 'Support Tickets', icon: Shield, color: 'from-blue-500' },
    { id: 'phone', label: 'Phone Support', icon: Phone, color: 'from-purple-500' },
    { id: 'docs', label: 'Documentation', icon: Code, color: 'from-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-white overflow-hidden relative">
      {/* Floating Geometric Background */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        animate={{ 
          background: [
            "radial-gradient(ellipse at top left, rgba(139,92,246,0.3) 0%, transparent 50%)",
            "radial-gradient(ellipse at bottom right, rgba(34,197,94,0.3) 0%, transparent 50%)",
            "radial-gradient(circle at center, rgba(239,68,68,0.2) 0%, transparent 60%)"
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      />
      
      {/* Main Container */}
      <div className="relative z-10">
        {/* Retro Terminal Header */}
        <section className="pt-24 pb-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-800/50 backdrop-blur-md border border-zinc-700 rounded-2xl p-8 md:p-12 overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.1s'}} />
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                </div>
                <span className="text-zinc-400 font-mono text-sm">support@codenfacts.in</span>
              </div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-mono font-bold bg-gradient-to-r from-zinc-100 via-white to-zinc-300 bg-clip-text text-transparent mb-6 leading-tight"
              >
                Support Terminal
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl md:text-2xl text-zinc-300 font-medium max-w-2xl leading-relaxed"
              >
                Execute instant support commands. Debug your issues with our 24/7 terminal operators.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Interactive Terminal Tabs */}
        <section className="px-4 md:px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Terminal Interface */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-zinc-800/70 backdrop-blur-xl border border-zinc-600 rounded-2xl p-8 overflow-hidden relative">
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-600">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-400 rounded-full animate-ping" />
                      <span className="font-mono text-zinc-300">LIVE SUPPORT</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex flex-wrap gap-2 mb-8 -mx-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <motion.button
                          key={tab.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm transition-all group ${
                            activeTab === tab.id
                              ? `bg-gradient-to-r ${tab.color} to-white/20 shadow-lg shadow-emerald-500/25 text-white`
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50 border border-zinc-600'
                          }`}
                        >
                          <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          {tab.label}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Terminal Content */}
                  <div className="space-y-4">
                    <div className="flex gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="font-mono text-sm text-zinc-400">Support Bot</span>
                        </div>
                        <p className="font-mono text-white bg-zinc-900/50 px-4 py-2 rounded-lg">
                          Ready to debug! Type <span className="text-emerald-400">/help</span> or describe your issue.
                        </p>
                      </div>
                    </div>

                    <div className="h-40 bg-zinc-900/30 rounded-xl p-4 flex items-end border-2 border-dashed border-zinc-600/50">
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ArrowRight className="h-4 w-4 text-white" />
                        </div>
                        <input 
                          placeholder="Enter your command or question..."
                          className="flex-1 bg-transparent outline-none text-white font-mono placeholder-zinc-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-zinc-500 font-mono">
                    <Clock className="h-3 w-3" />
                    Response Time: <span className="text-emerald-400 font-bold">&lt;15s</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group bg-gradient-to-r from-emerald-500/90 to-green-500/90 backdrop-blur border border-emerald-400/30 text-white px-6 py-4 rounded-xl font-mono font-semibold shadow-xl hover:shadow-emerald-500/50 transition-all"
                  >
                    <span className="block group-hover:-translate-x-1 transition-transform">Start Chat</span>
                  </motion.button>
                  <Link href="/docs">
                    <motion.button 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group border-2 border-zinc-600/50 backdrop-blur text-white px-6 py-4 rounded-xl font-mono font-semibold hover:border-white/50 hover:bg-white/10 shadow-xl transition-all"
                    >
                      View Docs
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right - Feature Cards */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {[
                  { title: "Lightning Response", desc: "Average 12-second reply time", icon: Zap, color: "from-emerald-400" },
                  { title: "Pro Developers", desc: "Code reviews by senior engineers", icon: Code, color: "from-blue-400" },
                  { title: "99.9% Uptime", desc: "Always online, always ready", icon: Shield, color: "from-purple-400" }
                ].map((feature, idx) => {
                  const IconComponent = feature.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="group bg-zinc-800/50 backdrop-blur-xl border border-zinc-700 rounded-xl p-6 hover:border-zinc-500 transition-all overflow-hidden"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} to-white/20 rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white shadow-md" />
                      </div>
                      <h3 className="text-xl font-bold font-mono mb-2 text-white">{feature.title}</h3>
                      <p className="text-zinc-400 font-mono leading-relaxed">{feature.desc}</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Glitch Stats */}
        <section className="px-4 md:px-8 pb-24">
          <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-8 text-center">
            {[
              { num: '247', label: 'Active Sessions', color: 'text-emerald-400' },
              { num: '12s', label: 'Avg Response', color: 'text-blue-400' },
              { num: '500+', label: 'Tickets Resolved', color: 'text-purple-400' },
              { num: '24/7', label: 'Coverage', color: 'text-orange-400' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-transparent rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className={`text-3xl md:text-4xl font-mono font-black ${stat.color} mb-3 animate-pulse`}>
                  {stat.num}
                </div>
                <p className="font-mono text-sm text-zinc-400 tracking-wider uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Floating Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/75 transition-all font-mono text-lg font-bold flex items-center justify-center"
          >
            ?
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportPage;

