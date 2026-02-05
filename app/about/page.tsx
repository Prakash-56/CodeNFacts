"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Code2, BookOpen, Cpu, Zap, ChevronRight, 
  Terminal, Rocket, ShieldCheck, Sparkles,
  Layers, Lightbulb, Search, Activity, Github, Twitter, Linkedin
} from 'lucide-react';

const CodeNFactsAbout = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // Advanced Parallax offsets
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.8]);

  const stats = [
    { label: "Articles Published", value: "150+" },
    { label: "Active Learners", value: "12,000" },
    { label: "GitHub Stars", value: "1.2k" },
    { label: "Tech Experts", value: "25+" },
  ];

  const philosophy = [
    {
      title: "Precision Engineering",
      icon: <Layers className="w-6 h-6" />,
      text: "We don't just teach APIs; we teach how the kernel handles the request."
    },
    {
      title: "Fact-Based Learning",
      icon: <Search className="w-6 h-6" />,
      text: "Every tutorial is backed by official documentation and hardware-level truths."
    },
    {
      title: "Real-World Logic",
      icon: <Activity className="w-6 h-6" />,
      text: "Learning paths designed to solve production-level bottlenecks, not just 'Todo' apps."
    }
  ];

  const technologies = ["Next.js", "Rust", "TypeScript", "Docker", "Kubernetes", "AI/ML", "Web3", "Go", "PostgreSQL"];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020617] text-slate-100 selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen flex flex-col items-center justify-center px-4"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10 text-center"
        >
          <div className="flex justify-center mb-6">
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="p-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
            >
              <div className="bg-[#020617] p-4 rounded-full">
                <Terminal className="w-8 h-8 text-cyan-400" />
              </div>
            </motion.div>
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white via-slate-400 to-slate-800 bg-clip-text text-transparent">
            CodeNFacts
          </h1>
          <p className="text-xl md:text-2xl text-cyan-500 font-mono tracking-[0.4em] uppercase mb-8">
            The Truth Behind the Code
          </p>
        </motion.div>
      </motion.section>

      {/* 2. THE MISSION "WHY" (Detailed Explanation) */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-bold mb-6 text-white leading-tight">
              We started with a simple question: <br/>
              <span className="text-slate-500 italic">"Why do we build it this way?"</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              In the current landscape of software education, there is an abundance of "How-To" guides but a critical shortage of "Why-It-Works" analysis. **CodeNFacts** was founded to fill this void.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              We believe that a developer who understands the **Facts**—the memory constraints, the network protocols, and the complexity analysis—is 10x more valuable than one who only knows the syntax.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-6">
            {stats.map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-2xl font-bold text-cyan-400">{s.value}</div>
                <div className="text-xs text-slate-500 uppercase font-mono">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TECHNICAL STACK MARQUEE */}
      <div className="py-12 bg-slate-900/30 border-y border-white/5 overflow-hidden">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...technologies, ...technologies].map((tech, i) => (
            <span key={i} className="text-4xl font-black text-slate-800 uppercase tracking-widest hover:text-cyan-500/50 transition-colors cursor-default">
              {tech}
            </span>
          ))}
        </motion.div>
      </div>

      {/* 4. CORE PHILOSOPHY GRID */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-4">Our Core Philosophy</h2>
          <p className="text-slate-500 max-w-xl mx-auto">The three pillars that guide every article, video, and course we produce.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {philosophy.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 rounded-[2.5rem] bg-gradient-to-b from-slate-900 to-slate-950 border border-white/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-8">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. THE PROBLEM VS THE SOLUTION */}
      <section className="py-32 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden border border-white/5 bg-black/40 backdrop-blur-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 md:p-20 border-b lg:border-b-0 lg:border-r border-white/5">
              <h4 className="text-red-500 font-mono text-sm uppercase mb-4 tracking-tighter">The Problem</h4>
              <h2 className="text-3xl font-bold mb-6 italic">Tutorial Hell & Copy-Paste Culture.</h2>
              <p className="text-slate-500">
                Developers are learning to build things they don't understand, leading to fragile systems, security vulnerabilities, and inefficient codebases that are impossible to scale.
              </p>
            </div>
            <div className="p-12 md:p-20 bg-cyan-500/5">
              <h4 className="text-cyan-500 font-mono text-sm uppercase mb-4 tracking-tighter">The CodeNFacts Solution</h4>
              <h2 className="text-3xl font-bold mb-6">Deep Context & First Principles.</h2>
              <p className="text-slate-300 font-medium">
                We bridge the gap by providing the technical "facts" alongside the code. We empower you to understand the "under the hood" mechanics so you can debug anything and architect everything.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-8 animate-pulse" />
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            Stop guessing. <br/> Start Engineering.
          </h2>
          <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">
            CodeNFacts is more than a blog or a YouTube channel. It's a commitment to technical excellence.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="px-10 py-4 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              Join the Community
            </button>
            <button className="px-10 py-4 border border-white/20 rounded-full hover:bg-white/5 transition-all">
              Browse the Facts
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CodeNFactsAbout;