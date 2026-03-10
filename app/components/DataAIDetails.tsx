'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';

/* ─────────────────────────── DATA ─────────────────────────── */
const signals = [
  {
    id: '01',
    title: 'Hands-On Learning',
    desc: 'Build real AI systems using Python, TensorFlow, PyTorch, and live datasets. No theory fog - pure execution.',
    accent: '#3b82f6',
    glow: 'rgba(59,130,246,0.35)',
    tag: 'PRACTICAL',
  },
  {
    id: '02',
    title: 'AI & ML Depth',
    desc: 'Neural networks, deep learning, and predictive intelligence - engineered from first principles, not explained from slides.',
    accent: '#06b6d4',
    glow: 'rgba(6,182,212,0.35)',
    tag: 'TECHNICAL',
  },
  {
    id: '03',
    title: 'Career-Grade Skills',
    desc: 'Workflows, toolchains, and deployment pipelines designed specifically for real Data, ML, and AI engineering roles.',
    accent: '#8b5cf6',
    glow: 'rgba(139,92,246,0.35)',
    tag: 'PROFESSIONAL',
  },
  {
    id: '04',
    title: 'Real-World Impact',
    desc: 'Solve live business problems. Ship models that produce measurable outcomes, not demo notebooks.',
    accent: '#10b981',
    glow: 'rgba(16,185,129,0.35)',
    tag: 'IMPACT',
  },
];

/* ─────────────────────────── NOISE SVG ─────────────────────── */
const NoiseSVG = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ─────────────────────────── CURSOR GLOW ───────────────────── */
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 80, damping: 18 });
  const springY = useSpring(y, { stiffness: 80, damping: 18 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed z-0 rounded-full"
      style={{
        width: 480,
        height: 480,
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }}
    />
  );
}

/* ─────────────────────────── SCANNING LINE ─────────────────── */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none z-20"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)' }}
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    />
  );
}

/* ─────────────────────────── GLITCH TEXT ───────────────────── */
function GlitchText({ children, className = '' }: { children: string; className?: string }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      {glitching && (
        <>
          <span
            className="absolute inset-0 text-cyan-400"
            style={{ clipPath: 'inset(30% 0 50% 0)', transform: 'translate(-3px, 0)', mixBlendMode: 'screen' }}
          >{children}</span>
          <span
            className="absolute inset-0 text-red-400"
            style={{ clipPath: 'inset(50% 0 20% 0)', transform: 'translate(3px, 0)', mixBlendMode: 'screen' }}
          >{children}</span>
        </>
      )}
    </span>
  );
}

/* ─────────────────────────── SIGNAL CARD ───────────────────── */
function SignalCard({ s, i, scrollYProgress }: { s: typeof signals[0]; i: number; scrollYProgress: any }) {
  const offset = 0.1 + i * 0.18;
  const y = useTransform(scrollYProgress, [offset, offset + 0.22], [120, 0]);
  const opacity = useTransform(scrollYProgress, [offset, offset + 0.18], [0, 1]);
  const scale = useTransform(scrollYProgress, [offset, offset + 0.22], [0.92, 1]);
  const isRight = i % 2 !== 0;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      style={{ y, opacity, scale }}
      className={`relative w-full md:w-[52%] ${isRight ? 'md:ml-auto' : 'md:mr-auto'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card Shell */}
      <motion.div
        animate={{ boxShadow: hovered ? `0 0 60px ${s.glow}, 0 0 120px ${s.glow}` : '0 0 0px transparent' }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden p-6 md:p-8 cursor-default"
        style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.2) 100%)` }}
      >
        {/* Corner accent */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute top-0 left-0 w-16 h-16 rounded-br-full"
          style={{ background: `linear-gradient(135deg, ${s.accent}40, transparent)` }}
        />

        {/* Tag pill */}
        <div className="flex items-center gap-3 mb-5">
          <span
            className="text-[10px] font-black tracking-[0.25em] px-3 py-1 rounded-full border"
            style={{ color: s.accent, borderColor: `${s.accent}50`, background: `${s.accent}15` }}
          >
            {s.tag}
          </span>
          <span className="text-white/20 font-mono text-sm font-bold">{s.id}</span>
        </div>

        {/* Title */}
        <h3
          className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 leading-tight tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {s.title}
        </h3>

        {/* Desc */}
        <p className="text-white/55 text-sm md:text-base leading-relaxed mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {s.desc}
        </p>

        {/* Animated progress bar */}
        <div className="h-px w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${s.accent}, transparent)` }}
            initial={{ width: '0%' }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </div>

        {/* Hover shimmer sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ x: hovered ? ['−100%', '200%'] : '-100%' }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${s.accent}20 50%, transparent 60%)`,
          }}
        />
      </motion.div>

      {/* Floating number ghost */}
      <motion.span
        className="absolute -top-6 font-black text-[120px] md:text-[160px] leading-none select-none pointer-events-none"
        style={{
          color: 'transparent',
          WebkitTextStroke: `1px ${s.accent}25`,
          right: isRight ? 'auto' : '-0.1em',
          left: isRight ? '-0.1em' : 'auto',
          fontFamily: "'Syne', sans-serif",
          zIndex: -1,
        }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
      >
        {s.id}
      </motion.span>
    </motion.div>
  );
}

/* ─────────────────────────── PARTICLE FIELD ────────────────── */
function ParticleField() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    dur: 8 + Math.random() * 14,
    delay: Math.random() * 8,
    opacity: 0.1 + Math.random() * 0.4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
          animate={{
            y: [0, -60, 0],
            opacity: [p.opacity, p.opacity * 0.2, p.opacity],
            scale: [1, 1.8, 1],
          }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────── MAIN COMPONENT ────────────────── */
export default function DataAIDetails() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  /* Hero heading parallax */
  const headY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const headOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  /* Background grid pulse */
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.06, 0.12, 0.04]);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;700&display=swap');
        .ai-section * { box-sizing: border-box; }
      `}</style>

      <CursorGlow />

      <section
        ref={sectionRef}
        className="ai-section relative bg-[#020408] overflow-hidden"
        style={{ minHeight: '300vh' }}
      >
        {/* ── Noise texture ── */}
        <NoiseSVG />

        {/* ── Scanning line ── */}
        <ScanLine />

        {/* ── Particle field ── */}
        <ParticleField />

        {/* ── Deep gradient orbs ── */}
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[-15%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1, 1.15, 1], x: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />

        {/* ── Dot grid bg ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: bgOpacity,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* ══════════════════ STICKY HERO ZONE ══════════════════ */}
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center z-10 px-4">
          {/* top label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="h-px w-10 bg-blue-400/50" />
            <span
              className="text-blue-400/80 text-xs font-bold tracking-[0.3em] uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Data & AI Program
            </span>
            <span className="h-px w-10 bg-blue-400/50" />
          </motion.div>

          <motion.div style={{ y: headY, opacity: headOpacity }} className="text-center max-w-5xl mx-auto">
            <h2
              className="text-[clamp(2.8rem,8vw,7rem)] font-black text-white leading-[0.95] tracking-[-0.03em] mb-6"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Intelligence
              <br />
              <GlitchText className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
                Doesn't Come From Slides
              </GlitchText>
            </h2>

            <motion.p
              className="text-white/40 text-base md:text-xl font-light max-w-xl mx-auto leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              You don't <em>learn</em> AI -{' '}
              <span className="text-white/70 font-medium not-italic">you engineer it.</span>
            </motion.p>

            {/* Scroll nudge */}
            <motion.div
              className="mt-12 flex flex-col items-center gap-2 text-white/25"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs tracking-widest uppercase font-mono">Scroll to explore</span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5" />
                <motion.rect
                  x="6.5" y="5" width="3" height="5" rx="1.5" fill="currentColor"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* ══════════════════ SIGNAL CARDS ══════════════════ */}
        <div className="relative z-10 px-4 md:px-10 max-w-6xl mx-auto space-y-[18vh] pb-[20vh]" style={{ marginTop: '-10vh' }}>
          {signals.map((s, i) => (
            <SignalCard key={s.id} s={s} i={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>

        {/* ══════════════════ STATS ROW ══════════════════ */}
        <motion.div
          className="relative z-10 max-w-5xl mx-auto px-4 md:px-10 mt-[10vh] mb-[15vh]"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { value: '4+', label: 'Live Projects' },
              { value: '100%', label: 'Hands-On' },
              { value: '12', label: 'Weeks Deep' },
              { value: '∞', label: 'Potential' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.04, borderColor: 'rgba(59,130,246,0.5)' }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 md:p-6 text-center transition-colors"
              >
                <div
                  className="text-3xl md:text-4xl font-black text-white mb-1"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-white/35 text-xs uppercase tracking-widest font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════════════════ CTA ══════════════════ */}
        <motion.div
          className="relative z-10 text-center px-4 pb-32 md:pb-40"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* CTA label */}
          <p
            className="text-white/30 text-xs tracking-[0.3em] uppercase mb-6 font-mono"
          >
            Ready to build the future?
          </p>

          <motion.a
            href="../apply-for-internship"
            className="group relative inline-flex items-center gap-3 px-10 md:px-16 py-5 md:py-6 rounded-full text-base md:text-xl font-black text-black overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #3b82f6 100%)',
              backgroundSize: '200% 100%',
              fontFamily: "'Syne', sans-serif",
            }}
            whileHover={{ scale: 1.07, backgroundPosition: '100% 0' }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.4 }}
          >
            {/* Shimmer */}
            <motion.span
              className="absolute inset-0 bg-white/20 skew-x-12"
              initial={{ x: '-150%' }}
              whileHover={{ x: '150%' }}
              transition={{ duration: 0.5 }}
            />

            <span className="relative z-10">Get Hired From Us</span>

            {/* Arrow */}
            <motion.svg
              className="relative z-10 w-5 h-5"
              viewBox="0 0 20 20" fill="currentColor"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </motion.svg>
          </motion.a>

          {/* Glow ring pulse */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 rounded-full border border-blue-500/20 pointer-events-none"
            style={{ width: 280, height: 80, top: '50%', translateY: '-50%' }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      </section>
    </>
  );
}