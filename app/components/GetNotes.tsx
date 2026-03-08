'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function GetNotes() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll progress for more fluid animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Perspective and background transforms
  const rotateX = useTransform(smoothProgress, [0, 0.2], [0, 45]);
  const z = useTransform(smoothProgress, [0, 0.2], [0, -500]);
  const opacity = useTransform(smoothProgress, [0, 0.1, 0.8, 1], [1, 1, 1, 0]);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-[#050505] overflow-clip">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center perspective-[1000px]">
        
        {/* Advanced Grid Floor */}
        <GridFloor progress={smoothProgress} />

        {/* Hero Section - Letter Glitch Effect */}
        <motion.div 
          style={{ rotateX, translateZ: z, opacity }} 
          className="relative z-20 text-center pointer-events-none"
        >
          <div className="overflow-hidden py-4">
            <GlitchText text="KNOWLEDGE" className="text-[10vw] md:text-[8vw] font-black text-white leading-none" />
            <GlitchText text="HUB" className="text-[10vw] md:text-[8vw] font-black text-indigo-600 leading-none" />
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-indigo-300/50 font-mono tracking-[0.5em] text-xs mt-4 uppercase"
          >
            Initializing Neural Interface...
          </motion.p>
        </motion.div>

        {/* Interactive Floating Nodes */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <FloatingNode 
            progress={smoothProgress}
            range={[0.2, 0.5]}
            title="01"
            label="REPOSITORY"
            description="Deep dive into system architectures.         'CLICK HERE'"
            href="/explore-notes"
            position={{ top: '20%', left: '15%' }}
          />
          <FloatingNode 
            progress={smoothProgress}
            range={[0.4, 0.7]}
            title="02"
            label="ON-DEMAND"
            description="Request custom engineering blueprints.          'CLICK HERE'"
            href="/ask-notes"
            position={{ bottom: '20%', right: '15%' }}
          />
        </div>

        {/* HUD Elements */}
        <div className="absolute inset-0 z-10 opacity-30 border-[1px] border-white/5 m-8 pointer-events-none" />
        <ScanningLine progress={smoothProgress} />
      </div>
    </div>
  );
}

/* ---------- Sub-Components ---------- */

function GlitchText({ text, className }: { text: string; className: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.05, ease: [0.33, 1, 0.68, 1], duration: 1 }}
          className="inline-block hover:text-indigo-400 transition-colors duration-300"
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}

function FloatingNode({ progress, range, title, label, description, href, position }: any) {
  const y = useTransform(progress, range, [400, -100]);
  const opacity = useTransform(progress, range, [0, 1]);
  const scale = useTransform(progress, range, [0.8, 1]);

  return (
    <motion.div 
      style={{ ...position, y, opacity, scale }}
      className="absolute pointer-events-auto group"
    >
      <Link href={href}>
        <div className="relative p-6 border-l border-indigo-500/50 bg-black/40 backdrop-blur-md hover:bg-indigo-500/10 transition-all duration-500">
          <span className="text-indigo-500 font-mono text-xs mb-2 block">{title} //</span>
          <h3 className="text-white text-2xl font-bold tracking-tighter mb-2 group-hover:translate-x-2 transition-transform uppercase">{label}</h3>
          <p className="text-neutral-400 text-sm max-w-[200px] leading-relaxed">{description}</p>
          <div className="mt-4 h-[1px] w-0 bg-indigo-500 group-hover:w-full transition-all duration-700" />
        </div>
      </Link>
    </motion.div>
  );
}

function GridFloor({ progress }: { progress: any }) {
  const y = useTransform(progress, [0, 1], [0, -200]);
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden [perspective:1000px]">
      <motion.div 
        style={{ rotateX: 60, y }}
        className="absolute -bottom-[50%] left-[-25%] w-[150%] h-[200%] opacity-20"
      >
        <div className="w-full h-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </motion.div>
    </div>
  );
}

function ScanningLine({ progress }: { progress: any }) {
  const y = useTransform(progress, [0, 1], ["0vh", "100vh"]);
  return (
    <motion.div 
      style={{ top: y }}
      className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-50 pointer-events-none"
    />
  );
}