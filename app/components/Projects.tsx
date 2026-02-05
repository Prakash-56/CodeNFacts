'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

export default function ProjectsMomentum() {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Smoothing the scroll progress for cleaner 3D rotations
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section ref={ref} className="relative h-[600vh] bg-[#030303] overflow-hidden perspective-1000">
      {/* --- 3D Background Layer --- */}
      <Scene3D progress={smoothProgress} />

      {/* --- Content Stages --- */}
      <div className="relative z-10">
        <IntroStage progress={smoothProgress} />
        
        <Stage 
          align="left" index="01" 
          title="You stop copying patterns" 
          emphasis="You start inventing them." 
          description="Foundational projects destroy surface-level thinking. You learn how ideas are formed - not reused."
          progress={smoothProgress}
          range={[0.15, 0.3]}
        />

        <Stage 
          align="right" index="02" 
          title="You stop trusting abstractions" 
          emphasis="You trace reality." 
          description="Systems projects expose what frameworks hide: latency, state, failure, entropy."
          progress={smoothProgress}
          range={[0.35, 0.5]}
        />

        <Stage 
          align="left" index="03" 
          title="You stop guessing performance" 
          emphasis="You observe it." 
          description="Memory pressure, bottlenecks, throughput. Projects teach you what metrics never say."
          progress={smoothProgress}
          range={[0.55, 0.7]}
        />

        <Stage 
          align="right" index="04" 
          title="You stop building alone" 
          emphasis="You build for humans." 
          description="Trade-offs, UX ambiguity, communication cost. Projects teach empathy."
          progress={smoothProgress}
          range={[0.75, 0.9]}
        />
      </div>
    </section>
  );
}

/* ---------- 3D Background Component ---------- */

function Scene3D({ progress }: { progress: any }) {
  // Rotate the entire grid background as we scroll
  const rotateX = useTransform(progress, [0, 1], [20, -20]);
  const translateZ = useTransform(progress, [0, 1], [-200, 100]);
  const opacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <motion.div 
      style={{ rotateX, translateZ, opacity }}
      className="fixed inset-0 pointer-events-none flex items-center justify-center"
    >
      {/* The Grid Floor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Floating 3D Orbs */}
      <motion.div 
        animate={{ y: [0, -40, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ y: [0, 50, 0], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" 
      />
    </motion.div>
  );
}

/* ---------- Intro ---------- */

function IntroStage({ progress }: { progress: any }) {
  const opacity = useTransform(progress, [0, 0.15], [1, 0]);
  const scale = useTransform(progress, [0, 0.15], [1, 0.8]);

  return (
    <div className="sticky top-0 flex h-screen items-center justify-center px-6">
      <motion.div style={{ opacity, scale }} className="max-w-4xl text-center">
        <h2 className="text-7xl md:text-9xl font-bold text-white tracking-tighter leading-none">
          CRAFTING <br /> DEPTH
        </h2>
        <p className="mt-8 text-xl text-gray-500 font-mono tracking-widest uppercase">
          Evolution through engineering
        </p>
      </motion.div>
    </div>
  );
}

/* ---------- 3D Stage Card ---------- */

function Stage({ index, title, emphasis, description, align, progress, range }: any) {
  // 3D Animations based on scroll range
  const opacity = useTransform(progress, [range[0] - 0.1, range[0], range[1], range[1] + 0.1], [0, 1, 1, 0]);
  const rotateY = useTransform(progress, [range[0], range[1]], align === 'left' ? [15, -5] : [-15, 5]);
  const x = useTransform(progress, [range[0], range[1]], align === 'left' ? [-50, 0] : [50, 0]);
  const z = useTransform(progress, [range[0], range[1]], [-100, 0]);

  return (
    <div className="sticky top-0 flex h-screen items-center px-6 overflow-visible">
      <motion.div
        style={{ 
          opacity, 
          rotateY, 
          x,
          z,
          transformStyle: 'preserve-3d' 
        }}
        className={`mx-auto w-full max-w-5xl p-12 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm ${
          align === 'left' ? 'text-left' : 'text-right'
        }`}
      >
        <div style={{ transform: 'translateZ(50px)' }}>
          <p className="mb-4 text-xs font-mono tracking-[0.3em] text-indigo-400">
            PHASE_{index}
          </p>
          <h3 className="text-4xl md:text-7xl font-bold text-white leading-[1.1]">
            {title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
              {emphasis}
            </span>
          </h3>
          <p className={`mt-8 text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed ${align === 'right' ? 'ml-auto' : ''}`}>
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}