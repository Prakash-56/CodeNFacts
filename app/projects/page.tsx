'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export default function KineticProjectSystem() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  // 3D Perspective Math
  const gridRotate = useTransform(smoothProgress, [0, 1], [isMobile ? 20 : 45, 0]);
  const tunnelScale = useTransform(smoothProgress, [0, 0.5], [0.8, isMobile ? 4 : 8]);
  const tunnelOpacity = useTransform(smoothProgress, [0, 0.2, 0.4], [0, 1, 0]);

  return (
    <div ref={containerRef} className="bg-[#020205] text-slate-100 selection:bg-indigo-500/40 overflow-x-hidden font-sans">
      
      {/* 1. BACKGROUND: DYNAMIC DEPTH GRID */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          style={{ rotateX: gridRotate, perspective: 1200 }}
          className="absolute inset-0 flex items-center justify-center opacity-30"
        >
          <div className="w-[200%] h-[200%] bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(circle,black,transparent_80%)]" />
        </motion.div>
      </div>

      {/* 2. HERO: INITIALIZATION */}
      <section className="h-[250vh] relative">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          <motion.div 
            style={{ 
              scale: useTransform(smoothProgress, [0, 0.2], [1, isMobile ? 10 : 15]),
              opacity: useTransform(smoothProgress, [0, 0.12], [1, 0]) 
            }}
            className="text-center z-10 px-4"
          >
            <h1 className="text-6xl sm:text-8xl md:text-[14vw] font-black tracking-tighter italic leading-none text-white">
              Projects<span className="text-indigo-500">_</span>
            </h1>
            <p className="text-indigo-400 font-mono tracking-[0.4em] md:tracking-[0.8em] text-[10px] md:text-sm mt-6 uppercase opacity-80">
              The Blueprint of Engineering Mastery
            </p>
          </motion.div>

          {/* Abstract Kinetic Rings */}
          <motion.div 
            style={{ scale: tunnelScale, opacity: tunnelOpacity }}
            className="absolute w-64 h-64 md:w-96 md:h-96 border-[1px] border-indigo-500/30 rounded-full"
          />
          <motion.div 
            style={{ scale: useTransform(smoothProgress, [0, 0.5], [0.4, 5]), opacity: tunnelOpacity }}
            className="absolute w-64 h-64 md:w-96 md:h-96 border-[1px] border-purple-500/20 rounded-full"
          />
        </div>
      </section>

      {/* 3. THE PHILOSOPHY (What, Why, How) */}
      <section className="relative z-10 py-20 md:py-40 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-24 md:gap-x-20 md:gap-y-40">
          <TextBlock 
            title="What is a Project?" 
            content="A project is a tangible manifestation of your logic. It is the bridge between an abstract thought and a functional system that serves a specific purpose in the real world."
            tag="01 // IDENTITY"
          />
          <TextBlock 
            title="Why it's Necessary" 
            content="Tutorials offer safe paths; projects offer growth through friction. They force you to solve the 'impossible' bugs that define a true engineer's journey."
            tag="02 // GROWTH"
          />
          <TextBlock 
            title="How it Works" 
            content="Creation is iterative. It begins with a core requirement, followed by architecture, development, and the relentless pursuit of optimization through testing."
            tag="03 // PROCESS"
          />
          <TextBlock 
            title="How it Helps" 
            content="It scales your impact. A well-designed project solves problems while you sleep, creating value and proving your architectural capabilities to the world."
            tag="04 // LEVERAGE"
          />
        </div>
      </section>

      {/* 4. THE IMPORTANCE (Role & Significance) */}
      <section className="py-32 md:py-60 bg--600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row gap-6 md:gap-10 items-baseline mb-16 md:mb-24"
          >
             <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter">THE ROLE.</h2>
             <p className="text-lg md:text-3xl font-medium max-w-xl opacity-90">
               Projects are the primary currency of credibility in a digital economy.
             </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <RoleItem label="CREDIBILITY" desc="In a sea of certificates, a deployed link is the only proof that truly matters to hiring teams." />
            <RoleItem label="COGNITION" desc="Deep learning happens when you break things. Projects provide the safe space to fail and rebuild." />
            <RoleItem label="AGENCY" desc="Building gives you the power to solve your own frustrations rather than waiting for someone else's tool." />
          </div>
        </div>
      </section>

      {/* 5. THE MANIFESTO (Motivation) */}
      <section className="min-h-screen py-32 flex flex-col items-center justify-center relative px-6 overflow-hidden">
        {/* Kinetic SVG Art */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <motion.svg 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            width="600" height="600" viewBox="0 0 600 600" 
            className="w-[150%] md:w-auto h-auto"
          >
            <circle cx="300" cy="300" r="250" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="4 8" />
            <circle cx="300" cy="300" r="150" fill="none" stroke="indigo" strokeWidth="1" strokeDasharray="10 20" />
            <path d="M0 300 L600 300 M300 0 L300 600" stroke="white" strokeWidth="0.2" />
          </motion.svg>
        </div>

        <div className="relative z-10 text-center space-y-8 md:space-y-12">
          <motion.h2 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="text-4xl md:text-8xl font-black tracking-tight leading-tight"
          >
            BUILD FOR <br/> 
            <span className="text-indigo-500 italic">THE FUTURE.</span>
          </motion.h2>
          <p className="text-slate-400 font-mono text-xs md:text-sm max-w-md mx-auto uppercase tracking-widest leading-loose">
            Your portfolio isn't a collection of code; it's a map of your ambition. Every commit is a step toward mastery.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-6 bg-white text-black font-black text-lg md:text-xl rounded-none transition-all"
          >
            INITIALIZE BUILD
          </motion.button>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-10 text-center border-t border-white/5">
        <p className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">System v2.0 // Cobalt Edition</p>
      </footer>
    </div>
  );
}

function TextBlock({ title, content, tag }: { title: string, content: string, tag: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="group"
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="h-[2px] w-6 bg-indigo-500" />
        <span className="text-[10px] font-mono text-indigo-400 tracking-widest">{tag}</span>
      </div>
      <h3 className="text-3xl md:text-5xl font-bold mb-6 group-hover:text-indigo-300 transition-colors tracking-tighter">{title}</h3>
      <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-light">
        {content}
      </p>
    </motion.div>
  );
}

function RoleItem({ label, desc }: { label: string, desc: string }) {
  return (
    <div className="border-t-[1px] border-white/30 pt-8">
      <h4 className="text-xl md:text-2xl font-black mb-4 tracking-tighter">{label}</h4>
      <p className="text-indigo-50 font-medium opacity-80 text-sm md:text-base leading-relaxed">{desc}</p>
    </div>
  );
}