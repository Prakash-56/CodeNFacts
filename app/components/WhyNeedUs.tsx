'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useRef, useState } from 'react';

const reasons = [
  {
    id: '01',
    title: 'Solo Learning Crawls',
    desc: 'Months vanish into trial-and-error loops. Precision routing collapses timelines.',
    accentHue: 200, // cyan-teal
  },
  {
    id: '02',
    title: 'Tutorials Teach Syntax - Not Systems',
    desc: 'Engineering lives in trade-offs, mental models, and unseen patterns.',
    accentHue: 280, // purple-magenta
  },
  {
    id: '03',
    title: 'Industry Knowledge Is Non-Linear',
    desc: 'Real hiring bars follow chaos, not curriculum chapters.',
    accentHue: 40,  // amber-orange
  },
  {
    id: '04',
    title: 'Clarity Outperforms Hype',
    desc: 'Motivation fades. Structural understanding fuels unbreakable discipline.',
    accentHue: 160, // emerald-teal
  },
];

export default function WhyNeedUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const bgTiltX = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const bgTiltY = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#03040c] text-white overflow-hidden py-32 md:py-48"
      style={{ perspective: 1800 }}
    >
      {/* Deep space background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Very faint grid */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Large orbiting glows */}
        <motion.div
          className="absolute left-[10%] top-[15%] w-[800px] h-[800px] rounded-full bg-cyan-900/10 blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute right-[5%] bottom-[10%] w-[1000px] h-[1000px] rounded-full bg-purple-900/8 blur-3xl"
          animate={{ rotate: -360 }}
          transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header – floating chrome text */}
        <motion.div
          className="text-center mb-40 md:mb-64"
          style={{ rotateX: bgTiltY, rotateY: bgTiltX, transformStyle: 'preserve-3d' }}
        >
          <motion.p
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4 }}
            className="font-mono text-cyan-400/60 tracking-[0.5em] uppercase text-sm md:text-base mb-6"
          >
            CORE DISCONNECTS
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-8xl md:text-9xl font-black tracking-[-0.06em] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-600/80"
            style={{ textShadow: '0 0 60px rgba(34,211,238,0.15)' }}
          >
            WHY YOU'RE
            <br />
            STUCK
          </motion.h2>
        </motion.div>

        {/* Spatial pillars */}
        <div className="relative space-y-[40vh] md:space-y-[60vh] lg:space-y-[80vh]">
          {reasons.map((item, i) => (
            <ReasonPillar key={item.id} item={item} index={i} scrollProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReasonPillar({
  item,
  index,
  scrollProgress,
}: {
  item: (typeof reasons)[0];
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 30%'],
  });

  const spring = { stiffness: 70, damping: 20 };

  const pillarTiltX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [25, 0, -18]), spring);
  const pillarTiltY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [-30, 0, 22]), spring);
  const pillarZ = useTransform(scrollYProgress, [0, 0.5, 1], [-400, 0, -200]);
  const glowScale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.4, 1.3, 1.3, 0.6]);

  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.2]);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [120, 0, -60]);

  return (
    <div ref={ref} className="relative h-[80vh] flex items-center justify-center" style={{ perspective: 1600 }}>
      <motion.div
        className="relative w-full max-w-5xl"
        style={{
          rotateX: pillarTiltX,
          rotateY: pillarTiltY,
          translateZ: pillarZ,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow halo */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl opacity-30 -z-10"
          style={{
            background: `radial-gradient(circle at 50% 30%, hsl(${item.accentHue}, 90%, 65%), transparent 70%)`,
            scale: glowScale,
          }}
        />

        {/* Main pillar content – holographic slab */}
        <motion.div
          className="relative backdrop-blur-xl bg-black/30 border border-white/5 rounded-3xl p-12 md:p-16 lg:p-20 shadow-2xl shadow-black/70 overflow-hidden"
          style={{
            opacity: textOpacity,
            y: textY,
            transformStyle: 'preserve-3d',
            translateZ: 80,
          }}
        >
          {/* Subtle scan lines */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,#00ffff08_50%)] bg-[size:100%_4px] opacity-20 animate-scan" />

          <div className="flex items-baseline gap-6 mb-10">
            <div className="text-8xl md:text-9xl lg:text-[12rem] font-black text-white/[0.07] leading-none tracking-tighter">
              {item.id}
            </div>
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight">
              {item.title}
            </h3>
          </div>

          <p className="text-xl md:text-2xl lg:text-3xl font-light text-cyan-100/80 leading-relaxed max-w-3xl">
            {item.desc}
          </p>
        </motion.div>

        {/* Floating accent lines / particles simulation */}
        <motion.div
          className="absolute -inset-20 pointer-events-none"
          style={{ translateZ: -120 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent blur-xl opacity-40 animate-pulse-slow" />
        </motion.div>
      </motion.div>
    </div>
  );
}