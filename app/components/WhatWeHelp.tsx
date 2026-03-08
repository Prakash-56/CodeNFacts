'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';

const helps = [
  {
    id: "01",
    title: 'Confusion & Overwhelm',
    desc: 'Too many resources, no clear path. We give you structured, guided learning.',
    tag: 'CLARITY',
    accent: '#FF3B00',
  },
  {
    id: "02",
    title: 'Lack of Real Projects',
    desc: 'We help you build real, resume-ready projects that actually matter.',
    tag: 'PORTFOLIO',
    accent: '#00E5FF',
  },
  {
    id: "03",
    title: 'Interview Fear',
    desc: 'Practice real interview patterns, not random questions.',
    tag: 'CONFIDENCE',
    accent: '#FFD600',
  },
  {
    id: "04",
    title: 'Low Confidence',
    desc: 'Consistency + clarity builds confidence. We stay with you.',
    tag: 'GROWTH',
    accent: '#00FF88',
  },
];

export default function WhatWeHelp() {
  return (
    <section className="relative bg-[#0A0A0A] overflow-hidden" style={{ fontFamily: "'Bebas Neue', 'Arial Black', sans-serif" }}>
      {/* Noise Texture Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Horizontal rule grid lines */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(255,255,255,0.03) 79px, rgba(255,255,255,0.03) 80px)',
      }} />

      {/* Vertical column guides */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 159px, rgba(255,255,255,0.02) 159px, rgba(255,255,255,0.02) 160px)',
      }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 py-24">

        {/* ── HEADER ── */}
        <div className="border-t-2 border-white pt-10 mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xs tracking-[0.5em] text-white/30 mb-3 uppercase"
                style={{ fontFamily: "'Courier New', monospace", letterSpacing: '0.4em' }}
              >
                — The Blockers
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] text-white uppercase"
              >
                What We
                <br />
                <span className="text-[#FF3B00]" style={{ WebkitTextStroke: '2px #FF3B00', color: 'transparent' }}>
                  Solve.
                </span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-right"
            >
              <p className="text-white/20 text-xs tracking-widest uppercase" style={{ fontFamily: "'Courier New', monospace" }}>
                04 Pain Points
                <br />
                Addressed
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── ITEMS ── */}
        <div className="flex flex-col">
          {helps.map((item, index) => (
            <BrutalistItem key={index} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

function BrutalistItem({ item, index }: { item: typeof helps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90%', 'start 30%'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -60 : 60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const smoothX = useSpring(x, { stiffness: 120, damping: 20 });

  return (
    <motion.div
      ref={ref}
      style={{ x: smoothX, opacity }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      {/* Top border */}
      <div className="border-t border-white/10" />

      <div className="grid grid-cols-[auto_1fr] md:grid-cols-[180px_1fr_auto] items-stretch min-h-[160px] md:min-h-[200px]">

        {/* ── Big Number ── */}
        <div className="flex items-center pr-8 py-8 md:py-10 border-r border-white/10">
          <motion.span
            animate={{ color: hovered ? item.accent : 'rgba(255,255,255,0.07)' }}
            transition={{ duration: 0.25 }}
            className="text-[clamp(5rem,12vw,9rem)] leading-none select-none"
          >
            {item.id}
          </motion.span>
        </div>

        {/* ── Main Content ── */}
        <div className="flex flex-col justify-center px-8 md:px-12 py-8 md:py-10">
          {/* Tag pill */}
          <motion.div
            animate={{ backgroundColor: hovered ? item.accent : 'transparent', borderColor: hovered ? item.accent : 'rgba(255,255,255,0.15)', color: hovered ? '#000' : 'rgba(255,255,255,0.3)' }}
            transition={{ duration: 0.2 }}
            className="inline-flex self-start items-center border px-3 py-1 mb-5 text-[10px] tracking-[0.35em] uppercase"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            {item.tag}
          </motion.div>

          <h3 className="text-[clamp(1.6rem,4vw,2.8rem)] leading-[1.05] text-white uppercase mb-4 transition-transform duration-300"
            style={{ transform: hovered ? 'translateX(8px)' : 'translateX(0)' }}>
            {item.title}
          </h3>

          <p className="text-white/35 text-sm md:text-base max-w-lg leading-relaxed"
            style={{ fontFamily: "'Courier New', monospace", fontWeight: 400, textTransform: 'none', letterSpacing: '0.01em' }}>
            {item.desc}
          </p>
        </div>

        {/* ── Right Accent Bar ── */}
        <div className="hidden md:flex items-stretch w-16 border-l border-white/10">
          <motion.div
            animate={{ scaleY: hovered ? 1 : 0, backgroundColor: item.accent }}
            initial={{ scaleY: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full origin-bottom"
          />
        </div>

      </div>

      {/* Hover: full-width accent underline */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, backgroundColor: item.accent }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-[2px] w-full origin-left"
      />
    </motion.div>
  );
}