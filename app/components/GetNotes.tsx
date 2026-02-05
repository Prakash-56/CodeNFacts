'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';

export default function GetNotes() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform values for a "zoom-out" into the content effect
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 1, 1, 0]);
  
  // Text reveal animations
  const textX1 = useTransform(scrollYProgress, [0.1, 0.4], [0, -100]);
  const textX2 = useTransform(scrollYProgress, [0.1, 0.4], [0, 100]);

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-black">
      {/* The Sticky Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Ambient Background - Reacts to Scroll */}
        <BackgroundEffect progress={scrollYProgress} />

        {/* Section 1: The Massive Intro (Splits apart on scroll) */}
        <motion.div style={{ scale, opacity }} className="relative z-20 text-center">
          <motion.h2 
            style={{ x: textX1 }}
            className="text-[12vw] font-bold tracking-tighter text-white leading-none inline-block"
          >
            KNOWLEDGE
          </motion.h2>
          <motion.h2 
            style={{ x: textX2 }}
            className="text-[12vw] font-bold tracking-tighter text-indigo-500 leading-none inline-block ml-4"
          >
            HUB.
          </motion.h2>
          <p className="mt-4 text-neutral-500 text-xl tracking-widest uppercase">Scroll to deconstruct</p>
        </motion.div>

        {/* Section 2: The Interactive Nodes (Reveals as intro splits) */}
        <div className="absolute inset-0 flex items-center justify-center gap-12 md:gap-32 px-10">
          <ActionNode 
            progress={scrollYProgress}
            range={[0.3, 0.6]}
            title="THE REPOSITORY"
            subtitle="Curated Engineering Intelligence"
            points={["System Design", "Low Level Design", "Edge Cases"]}
            href="/explore-notes"
            align="left"
          />
          
          <ActionNode 
            progress={scrollYProgress}
            range={[0.5, 0.8]}
            title="THE ON-DEMAND"
            subtitle="Custom Notes Tailored to You"
            points={["Personalized Depth", "Specific Frameworks", "Direct Support"]}
            href="/ask-notes"
            align="right"
          />
        </div>

        {/* Bottom Status Bar */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0.8, 0.9], [0, 1]) }}
          className="absolute bottom-12 w-full px-12 flex justify-between items-end border-t border-white/10 pt-8"
        >
          <div className="text-neutral-500 font-mono text-sm">SYSTEM: READY</div>
          <div className="text-white text-2xl font-light">This is <span className="italic">Leverage.</span></div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- Sub-Components ---------- */

function ActionNode({ progress, range, title, subtitle, points, href, align }: any) {
  // Appearance physics
  const y = useTransform(progress, range, [100, 0]);
  const opacity = useTransform(progress, range, [0, 1]);
  const blur = useTransform(progress, range, [10, 0]);

  return (
    <motion.div 
      style={{ y, opacity, filter: `blur(${blur}px)` }}
      className={`max-w-md ${align === 'right' ? 'mt-32' : '-mt-32'}`}
    >
      <h3 className="text-indigo-400 font-mono text-sm mb-2">{title}</h3>
      <h4 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">{subtitle}</h4>
      
      <div className="space-y-4 mb-8">
        {points.map((p: string) => (
          <div key={p} className="flex items-center gap-3 group">
            <div className="h-[1px] w-4 bg-indigo-800 group-hover:w-8 transition-all duration-300" />
            <span className="text-neutral-400 group-hover:text-white transition-colors">{p}</span>
          </div>
        ))}
      </div>

      <Link href={href} className="group flex items-center gap-4 text-white font-medium">
        <span className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
          →
        </span>
        <span className="uppercase tracking-widest text-xs">Ask for Notes</span>
      </Link>
    </motion.div>
  );
}

function BackgroundEffect({ progress }: { progress: any }) {
  const rotate = useTransform(progress, [0, 1], [0, 45]);
  const bgOpacity = useTransform(progress, [0, 0.5, 1], [0.1, 0.3, 0.1]);

  return (
    <motion.div 
      style={{ rotate, opacity: bgOpacity }}
      className="absolute inset-0 z-0"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[repeating-linear-gradient(0deg,transparent,transparent_49px,#ffffff05_50px)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[repeating-linear-gradient(90deg,transparent,transparent_49px,#ffffff05_50px)]" />
    </motion.div>
  );
}