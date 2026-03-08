'use client';

import { motion, useMotionValue, useTransform, useSpring, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const challenges = [
  {
    title: 'Debugging Headaches',
    desc: 'Invisible bugs, misleading errors, and broken mental models.',
    glyph: '⌀',
    color: '#f97316',
  },
  {
    title: 'Learning Curve',
    desc: 'Abstract theory without practical anchors slows real understanding.',
    glyph: '∿',
    color: '#06b6d4',
  },
  {
    title: 'Time Management',
    desc: 'Context switching kills momentum and deep focus.',
    glyph: '◎',
    color: '#a855f7',
  },
  {
    title: 'Project Execution',
    desc: 'Too many moving parts make starting feel impossible.',
    glyph: '⬡',
    color: '#22c55e',
  },
  {
    title: 'Imposter Syndrome',
    desc: 'Growth happens silently while doubt stays loud.',
    glyph: '◈',
    color: '#ec4899',
  },
];

function GlitchText({ text, color }: { text: string; color: string }) {
  const [glitching, setGlitching] = useState(false);

  return (
    <span
      className="relative inline-block cursor-default select-none"
      onMouseEnter={() => setGlitching(true)}
      onMouseLeave={() => setGlitching(false)}
      style={{ color: glitching ? color : 'white', transition: 'color 0.2s' }}
    >
      {text}
      {glitching && (
        <>
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              color,
              clipPath: 'inset(20% 0 60% 0)',
              transform: 'translate(-4px, 2px)',
              opacity: 0.7,
              mixBlendMode: 'screen',
            }}
          >
            {text}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              color: '#00ffff',
              clipPath: 'inset(55% 0 10% 0)',
              transform: 'translate(4px, -2px)',
              opacity: 0.5,
              mixBlendMode: 'screen',
            }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}

function CounterNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate(v) {
        if (ref.current) ref.current.textContent = String(Math.floor(v)).padStart(2, '0');
      },
    });
    return controls.stop;
  }, [value]);

  return <span ref={ref}>00</span>;
}

function ChallengeCard({ item, i }: { item: (typeof challenges)[0]; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 150, damping: 20 });
  const springRotY = useSpring(rotY, { stiffness: 150, damping: 20 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotX.set(-y * 12);
    rotY.set(x * 12);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: springRotX, rotateY: springRotY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 cursor-default overflow-hidden"
      >
        {/* Hover shimmer */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={hovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${item.color}18 0%, transparent 70%)`,
          }}
        />

        {/* Scan line effect */}
        <motion.div
          className="absolute inset-x-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${item.color}80, transparent)` }}
          animate={hovered ? { top: ['0%', '100%'] } : { top: '0%' }}
          transition={{ duration: 1.2, ease: 'linear', repeat: hovered ? Infinity : 0 }}
        />

        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
          style={{
            background: `linear-gradient(225deg, ${item.color}30 0%, transparent 60%)`,
            borderTopRightRadius: '1rem',
          }}
        />

        <div className="relative z-10 flex items-start gap-6">
          {/* Glyph + number */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-1">
            <motion.span
              className="text-3xl font-mono leading-none"
              style={{ color: item.color }}
              animate={hovered ? { rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {item.glyph}
            </motion.span>
            <span className="text-xs font-mono tracking-widest" style={{ color: item.color, opacity: 0.6 }}>
              <CounterNumber value={i + 1} />
            </span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-3 leading-tight font-mono">
              <GlitchText text={item.title} color={item.color} />
            </h3>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">{item.desc}</p>
          </div>
        </div>

        {/* Bottom progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] rounded-full"
          style={{ background: item.color }}
          initial={{ width: '0%' }}
          whileInView={{ width: `${(i + 1) * 20}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: i * 0.12 + 0.4, ease: 'easeOut' }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function CodingChallenges() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const bgX = useTransform(mouseX, [-0.5, 0.5], ['-8%', '8%']);
  const bgY = useTransform(mouseY, [-0.5, 0.5], ['-8%', '8%']);

  return (
    <section className="relative overflow-hidden py-40 px-6 bg-[#06060b] text-white">
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* Reactive gradient blobs */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-8 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
      </motion.div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block mb-4"
        >
          <span className="text-xs font-mono tracking-[0.3em] text-orange-400 border border-orange-400/30 rounded px-3 py-1">
            SYSTEM_ERRORS.LOG
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter font-mono mb-6"
        >
          WHERE
          <br />
          <span className="text-transparent"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
            CODING
          </span>
          <br />
          BREAKS
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-500 max-w-xl text-base md:text-lg font-mono"
        >
          {'// Not syntax. Not tools. These are the real fractures.'}
        </motion.p>
      </div>

      {/* Cards grid */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
        {challenges.map((item, i) => (
          <div key={i} className={i === 4 ? 'md:col-span-2' : ''}>
            <ChallengeCard item={item} i={i} />
          </div>
        ))}
      </div>
    </section>
  );
}