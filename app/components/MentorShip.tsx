'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  opacity: number;
  hue: number;
}

// ── Utility ────────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ── Noise Canvas Background ────────────────────────────────────────────────
function NoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    let raf: number;
    let t = 0;

    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      // Animated conic gradient aurora
      const cx = c.width / 2 + Math.sin(t * 0.4) * 200;
      const cy = c.height / 2 + Math.cos(t * 0.3) * 120;
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.width * 0.8);
      g1.addColorStop(0, `hsla(${210 + Math.sin(t) * 20}, 100%, 55%, 0.18)`);
      g1.addColorStop(0.4, `hsla(${260 + Math.cos(t * 0.7) * 20}, 80%, 40%, 0.08)`);
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, c.width, c.height);

      const cx2 = c.width * 0.8 + Math.cos(t * 0.5) * 180;
      const cy2 = c.height * 0.3 + Math.sin(t * 0.4) * 100;
      const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, c.width * 0.55);
      g2.addColorStop(0, `hsla(${180 + Math.sin(t * 0.8) * 30}, 90%, 60%, 0.1)`);
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, c.width, c.height);

      t += 0.012;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: 'screen' }} />;
}

// ── Floating Orbs ──────────────────────────────────────────────────────────
function FloatingOrbs() {
  const orbs = [
    { size: 420, x: '10%', y: '20%', color: '#1d4ed8', delay: 0 },
    { size: 280, x: '75%', y: '10%', color: '#7c3aed', delay: 3 },
    { size: 350, x: '85%', y: '65%', color: '#0891b2', delay: 6 },
    { size: 200, x: '30%', y: '80%', color: '#2563eb', delay: 2 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[120px]"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
            opacity: 0.12,
          }}
          animate={{
            x: [0, 40, -30, 20, 0],
            y: [0, -30, 40, -20, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 18 + i * 4,
            repeat: Infinity,
            delay: orb.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ── Particle Field ─────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mousePos = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    let raf: number;

    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init particles
    particles.current = Array.from({ length: 80 }, (_, id) => ({
      id,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() > 0.5 ? 210 : 260,
    }));

    const onMouse = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouse);

    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);

      const ps = particles.current;
      // Draw connections
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(220, 80%, 65%, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw + update particles
      ps.forEach(p => {
        // Mouse repel
        const mdx = p.x - mousePos.current.x;
        const mdy = p.y - mousePos.current.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 100) {
          const force = (100 - md) / 100;
          p.vx += (mdx / md) * force * 0.4;
          p.vy += (mdy / md) * force * 0.4;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = c.width;
        if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height;
        if (p.y > c.height) p.y = 0;

        ctx.beginPath();
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grd.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${p.opacity})`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ── Scanline Overlay ───────────────────────────────────────────────────────
function ScanlineOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 opacity-[0.025]"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)',
        backgroundSize: '100% 4px',
      }}
    />
  );
}

// ── Glitch Text ────────────────────────────────────────────────────────────
function GlitchText({ children }: { children: React.ReactNode }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block">
      {children}
      {glitch && (
        <>
          <span
            className="absolute inset-0 text-blue-400"
            style={{ clipPath: 'polygon(0 30%, 100% 30%, 100% 50%, 0 50%)', transform: 'translateX(-3px)', mixBlendMode: 'screen' }}
            aria-hidden
          >
            {children}
          </span>
          <span
            className="absolute inset-0 text-purple-400"
            style={{ clipPath: 'polygon(0 60%, 100% 60%, 100% 75%, 0 75%)', transform: 'translateX(3px)', mixBlendMode: 'screen' }}
            aria-hidden
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
}

// ── Typing Headline ────────────────────────────────────────────────────────
function TypedSubtitle() {
  const phrases = ['O(1) Guidance.', 'O(log n) Clarity.', 'O(n) Growth.'];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const target = phrases[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
    } else if (!isDeleting && displayed.length === target.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else {
      setIsDeleting(false);
      setPhraseIdx((phraseIdx + 1) % phrases.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, phraseIdx]);

  return (
    <div className="text-xl md:text-2xl font-mono text-blue-400 mt-4 h-8 flex items-center justify-center gap-1">
      <span>{displayed}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-0.5 h-5 bg-blue-400"
      />
    </div>
  );
}

// ── Counter ────────────────────────────────────────────────────────────────
function Counter({ value, suffix = '+' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(value);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return <motion.span onViewportEnter={() => setInView(true)}>{count}{suffix}</motion.span>;
}

// ── Truth Card ─────────────────────────────────────────────────────────────
function TruthCard({ truth, index }: { truth: string; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex items-start gap-5 p-5 rounded-2xl cursor-default overflow-hidden"
    >
      {/* Hover bg */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.06))' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      {/* Left border glow */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full"
        style={{ background: 'linear-gradient(to bottom, #2563eb, #7c3aed)', height: '70%' }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Index number */}
      <span className="relative z-10 text-xs font-mono text-blue-500/60 w-6 pt-1 select-none">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Dot */}
      <div className="relative z-10 flex-shrink-0 mt-1.5">
        <motion.div
          className="w-2 h-2 rounded-full bg-blue-500"
          animate={{ scale: hovered ? 1.8 : 1, boxShadow: hovered ? '0 0 12px #3b82f6' : '0 0 0 #3b82f6' }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <p className="relative z-10 text-base text-gray-400 group-hover:text-white transition-colors duration-300 leading-relaxed">
        {truth}
      </p>
    </motion.div>
  );
}

// ── Stats Card ─────────────────────────────────────────────────────────────
function StatsCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 18 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const stats = [
    { label: 'Sessions', val: 500, s: '+', color: '#3b82f6' },
    { label: 'Resumes', val: 350, s: '+', color: '#8b5cf6' },
    { label: 'Switches', val: 140, s: '+', color: '#06b6d4' },
    { label: 'Clarity', val: 97, s: '%', color: '#10b981' },
  ];

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute -inset-px rounded-[2.2rem] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.6), rgba(124,58,237,0.3), rgba(6,182,212,0.4))',
          filter: 'blur(1px)',
        }}
      />

      {/* Mouse-tracked inner glow */}
      <motion.div
        className="absolute inset-0 rounded-[2rem] pointer-events-none opacity-30"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(99,102,241,0.8), transparent 60%)`
          ),
        }}
      />

      <div className="relative rounded-[2rem] bg-gradient-to-br from-[#0d1b35]/95 to-[#060d1f]/95 backdrop-blur-3xl border border-white/[0.08] overflow-hidden p-10 md:p-14">
        {/* Top shimmer line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(6,182,212,0.6), transparent)' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 grid grid-cols-2 gap-y-12 gap-x-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center text-center group"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx + 0.3, duration: 0.5, ease: 'backOut' }}
              viewport={{ once: true }}
            >
              {/* Circle border */}
              <div className="relative mb-3">
                <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] opacity-30" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke={stat.color} strokeWidth="1" strokeDasharray="6 4" />
                </svg>
                <div className="text-4xl md:text-5xl font-black tabular-nums" style={{ color: stat.color, textShadow: `0 0 30px ${stat.color}60` }}>
                  <Counter value={stat.val} suffix={stat.s} />
                </div>
              </div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: `${stat.color}99` }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom label */}
        <motion.div
          className="relative z-10 mt-12 pt-8 border-t border-white/[0.06] flex items-center justify-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-gray-500 tracking-widest">LIVE IMPACT METRICS</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── CTA Button ─────────────────────────────────────────────────────────────
function CTAButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href="/mentorship" className="inline-block mt-8">
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="relative group"
      >
        {/* Glow bg */}
        <motion.div
          className="absolute -inset-1 rounded-full blur-lg"
          style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
          animate={{ opacity: hovered ? 0.7 : 0.3 }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative flex items-center gap-3 px-10 py-4 rounded-full border border-white/20 bg-[#07111f]/80 backdrop-blur overflow-hidden">
          {/* Sweep animation */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }}
            animate={{ x: hovered ? ['−100%', '200%'] : '-100%' }}
            transition={{ duration: 0.8, ease: 'linear' }}
          />

          <span className="relative z-10 text-sm font-semibold text-white tracking-wide">
            Apply for 1:1 Mentorship
          </span>

          <motion.svg
            className="relative z-10 w-4 h-4 text-blue-400"
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.2 }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </motion.svg>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Main Section ───────────────────────────────────────────────────────────
export default function MentorshipSection() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const sectionY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const truths = [
    "Your resume is the first code recruiters run - make it compile perfectly.",
    "One right conversation can save years of trial-error loops.",
    "Master key coding concepts before interviews to optimize your performance.",
    "A single 1:1 guidance session can reduce O(n²) effort into O(log n) growth.",
    "Clarity compounds faster than effort. One insight can unlock multiple levels.",
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-36 md:py-52 px-6"
      style={{ background: '#020817' }}
    >
      {/* ── Layered backgrounds ── */}
      <div className="absolute inset-0">
        {/* Deep base */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, #0a1628, #020817 70%)' }} />
        <FloatingOrbs />
        <ParticleField />
        <NoiseCanvas />
        <ScanlineOverlay />
        {/* Subtle grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: '120px 120px' }}
        />
      </div>

      {/* ── Content ── */}
      <motion.div style={{ y: sectionY }} className="relative z-10 max-w-7xl mx-auto">

        {/* Hero headline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="text-center mb-28"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-mono text-blue-400 tracking-[0.2em] uppercase">Elite Mentorship Program</span>
          </motion.div>

          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
            <span className="block text-white">
              <GlitchText>Optimize Your</GlitchText>
            </span>
            <span
              className="block"
              style={{
                backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #818cf8 40%, #06b6d4 80%, #3b82f6 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <motion.span
                style={{ display: 'inline-block' }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                Career Path
              </motion.span>
            </span>
          </h2>

          <TypedSubtitle />
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-20 items-start">

          {/* Left: Truths */}
          <div className="space-y-2">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xs font-mono text-gray-600 tracking-[0.3em] uppercase mb-8 ml-1"
            >
              // Career Truths
            </motion.p>

            {truths.map((truth, i) => (
              <TruthCard key={i} truth={truth} index={i} />
            ))}

            <div className="pt-6 pl-11">
              <CTAButton />
            </div>
          </div>

          {/* Right: Stats */}
          <div className="lg:sticky lg:top-24">
            <StatsCard />

            {/* Decorative circuit lines */}
            <svg className="absolute -right-8 -top-8 w-48 h-48 opacity-10 pointer-events-none" viewBox="0 0 200 200" fill="none">
              <path d="M20 100 H80 V40 H160 V100 H120 V140 H60 V100" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="8 4" />
              <circle cx="20" cy="100" r="4" fill="#3b82f6" />
              <circle cx="160" cy="100" r="4" fill="#06b6d4" />
              <circle cx="60" cy="140" r="4" fill="#8b5cf6" />
            </svg>
          </div>
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-40 relative"
        >
          <div className="text-center relative">
            {/* Line decorations */}
            <div className="flex items-center gap-6 justify-center mb-8">
              <motion.div
                className="h-px flex-1 max-w-xs"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.4))' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
              <motion.div
                className="h-px flex-1 max-w-xs"
                style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.4), transparent)' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              />
            </div>

            <p className="text-gray-500 italic text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
              "Think of growth like algorithm optimization:{' '}
              <span className="text-gray-400 not-italic font-medium">Reduce redundant loops,</span>{' '}
              maximize output."
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}