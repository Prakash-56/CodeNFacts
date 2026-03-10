'use client';

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
  AnimatePresence,
} from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';

/* ─────────────────────────────── DATA ─────────────────────────────── */
const signals = [
  { label: 'Mentorship', icon: '◈', color: '#a78bfa' },
  { label: 'Collaboration', icon: '◎', color: '#67e8f9' },
  { label: 'Course Enquiries', icon: '◇', color: '#f0abfc' },
  { label: 'Community Access', icon: '△', color: '#86efac' },
  { label: 'Career Opportunities', icon: '◉', color: '#fbbf24' },
  { label: 'Ideas Worth Building', icon: '✦', color: '#f9a8d4' },
];

/* ────────────────────────── NOISE CANVAS BG ────────────────────────── */
function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = (canvas.width = 300);
    const H = (canvas.height = 300);
    const img = ctx.createImageData(W, H);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 18;
    }
    ctx.putImageData(img, 0, 0);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ imageRendering: 'pixelated', opacity: 0.45 }}
    />
  );
}

/* ─────────────────────────── MAGNETIC CURSOR ─────────────────────────── */
function MagneticBlob() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const smoothX = useSpring(x, { stiffness: 55, damping: 18 });
  const smoothY = useSpring(y, { stiffness: 55, damping: 18 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[1] hidden md:block"
      style={{
        left: smoothX,
        top: smoothY,
        translateX: '-50%',
        translateY: '-50%',
        width: 420,
        height: 420,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)',
        filter: 'blur(2px)',
      }}
    />
  );
}

/* ──────────────────────────── WARP GRID ──────────────────────────────── */
function WarpGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: '800px' }}>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(167,139,250,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167,139,250,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transformOrigin: '50% 0%',
          rotateX: '60deg',
          translateY: '-10%',
          scaleY: 2.5,
        }}
        animate={{
          backgroundPositionY: ['0px', '60px'],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[50%]"
        style={{ background: 'linear-gradient(to top, #05030f 30%, transparent)' }}
      />
    </div>
  );
}

/* ──────────────────────────── SIGNAL CARD ──────────────────────────── */
function SignalCard({
  item,
  isActive,
  onClick,
  index,
  total,
}: {
  item: (typeof signals)[0];
  isActive: boolean;
  onClick: () => void;
  index: number;
  total: number;
}) {
  const angle = (360 / total) * index - 90;
  const rad = (angle * Math.PI) / 180;

  // Responsive radii
  const rx = typeof window !== 'undefined' && window.innerWidth < 640 ? 115 : 200;
  const ry = typeof window !== 'undefined' && window.innerWidth < 640 ? 115 : 200;

  const baseX = Math.cos(rad) * rx;
  const baseY = Math.sin(rad) * ry;

  return (
    <motion.button
      onClick={onClick}
      className="absolute focus:outline-none"
      style={{
        left: '50%',
        top: '50%',
        x: baseX - (typeof window !== 'undefined' && window.innerWidth < 640 ? 52 : 70),
        y: baseY - (typeof window !== 'undefined' && window.innerWidth < 640 ? 20 : 26),
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 + index * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.12, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{
          background: isActive
            ? `linear-gradient(135deg, ${item.color}22, ${item.color}44)`
            : 'rgba(10,8,25,0.7)',
          borderColor: isActive ? item.color : 'rgba(167,139,250,0.15)',
          boxShadow: isActive
            ? `0 0 24px ${item.color}55, 0 0 60px ${item.color}22, inset 0 1px 0 ${item.color}33`
            : '0 0 0px transparent',
        }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 sm:gap-2.5 cursor-pointer"
        style={{ backdropFilter: 'blur(16px)', minWidth: 104, maxWidth: 140 }}
      >
        <motion.span
          animate={{ color: isActive ? item.color : 'rgba(167,139,250,0.5)' }}
          className="text-base sm:text-lg leading-none flex-shrink-0"
          style={{ fontFamily: 'monospace' }}
        >
          {item.icon}
        </motion.span>
        <motion.span
          animate={{ color: isActive ? '#fff' : 'rgba(200,190,255,0.55)' }}
          className="text-[10px] sm:text-xs font-semibold tracking-wide leading-tight text-left"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {item.label}
        </motion.span>

        {/* Active dot */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}

/* ──────────────────────── ORBITING RING ──────────────────────── */
function OrbitRing({ r, dur, reverse, dash, color }: { r: number; dur: number; reverse?: boolean; dash?: string; color?: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: r * 2,
        height: r * 2,
        left: '50%',
        top: '50%',
        marginLeft: -r,
        marginTop: -r,
        border: `1px ${dash || 'solid'} ${color || 'rgba(167,139,250,0.08)'}`,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
    />
  );
}

/* ────────────────────── CORE NUCLEUS ────────────────────── */
function Nucleus({ active }: { active: (typeof signals)[0] | null }) {
  return (
    <motion.div
      className="relative z-20 flex items-center justify-center rounded-full"
      style={{
        width: 110,
        height: 110,
        background: 'radial-gradient(circle at 38% 32%, #1a0e3a, #08051a)',
        boxShadow: '0 0 0 1px rgba(167,139,250,0.12), 0 0 60px rgba(167,139,250,0.15)',
      }}
      animate={{
        boxShadow: active
          ? [
              `0 0 0 1px ${active.color}44, 0 0 60px ${active.color}30`,
              `0 0 0 1px ${active.color}88, 0 0 100px ${active.color}50`,
              `0 0 0 1px ${active.color}44, 0 0 60px ${active.color}30`,
            ]
          : '0 0 0 1px rgba(167,139,250,0.12), 0 0 60px rgba(167,139,250,0.15)',
      }}
      transition={{ duration: 2, repeat: active ? Infinity : 0 }}
    >
      {/* Glass specular */}
      <div
        className="absolute top-[12%] left-[18%] w-[35%] h-[22%] rounded-full blur-sm"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      />

      {/* Inner rings */}
      <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(167,139,250,0.08)' }} />
      <div
        className="absolute rounded-full"
        style={{ inset: '12px', border: '1px solid rgba(167,139,250,0.06)' }}
      />

      {/* Symbol */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active?.icon || 'default'}
          initial={{ opacity: 0, scale: 0.4, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.4, rotateY: 90 }}
          transition={{ duration: 0.35, type: 'spring', stiffness: 260, damping: 22 }}
          className="text-3xl"
          style={{
            color: active ? active.color : 'rgba(167,139,250,0.4)',
            fontFamily: 'monospace',
            filter: active ? `drop-shadow(0 0 12px ${active.color})` : 'none',
          }}
        >
          {active ? active.icon : '✦'}
        </motion.div>
      </AnimatePresence>

      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `1px solid ${active ? active.color : 'rgba(167,139,250,0.3)'}` }}
        animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `1px solid ${active ? active.color : 'rgba(167,139,250,0.2)'}` }}
        animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
      />
    </motion.div>
  );
}

/* ────────────────────── CONNECTOR LINES SVG ────────────────────── */
function ConnectorLines({ activeIndex }: { activeIndex: number | null }) {
  const size = 500;
  const cx = size / 2;
  const cy = size / 2;
  const r = 200;

  return (
    <svg
      className="absolute pointer-events-none"
      style={{ width: size, height: size, left: '50%', top: '50%', marginLeft: -cx, marginTop: -cy }}
      viewBox={`0 0 ${size} ${size}`}
    >
      {signals.map((sig, i) => {
        const angle = (360 / signals.length) * i - 90;
        const rad = (angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * r;
        const y = cy + Math.sin(rad) * r;
        const isActive = activeIndex === i;

        return (
          <motion.line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke={isActive ? sig.color : 'rgba(167,139,250,0.06)'}
            strokeWidth={isActive ? 1.5 : 0.5}
            strokeDasharray="4 8"
            animate={{
              strokeDashoffset: isActive ? [0, -24] : 0,
              opacity: isActive ? 1 : activeIndex !== null ? 0.03 : 0.5,
            }}
            transition={{ duration: 0.8, repeat: isActive ? Infinity : 0, ease: 'linear' }}
          />
        );
      })}
    </svg>
  );
}

/* ─────────────────────── GLITCH TEXT ─────────────────────── */
function GlitchText({ text }: { text: string }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-block">
      <span className="relative z-10">{text}</span>
      {glitch && (
        <>
          <span
            className="absolute inset-0 text-[#a78bfa]"
            style={{ clipPath: 'inset(30% 0 40% 0)', transform: 'translateX(-3px)', opacity: 0.7 }}
            aria-hidden
          >
            {text}
          </span>
          <span
            className="absolute inset-0 text-[#67e8f9]"
            style={{ clipPath: 'inset(60% 0 10% 0)', transform: 'translateX(3px)', opacity: 0.7 }}
            aria-hidden
          >
            {text}
          </span>
        </>
      )}
    </div>
  );
}

/* ─────────────────────── SCROLL MARQUEE ─────────────────────── */
function Marquee() {
  const items = ['OPEN TO CONNECT', '✦', 'TRANSMIT YOUR SIGNAL', '✦', 'LET\'S BUILD', '✦', 'OPEN TO CONNECT', '✦', 'TRANSMIT YOUR SIGNAL', '✦', 'LET\'S BUILD', '✦'];
  return (
    <div className="relative overflow-hidden py-3 border-y border-purple-500/10">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ width: 'max-content' }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-[10px] sm:text-xs tracking-[0.35em] font-mono"
            style={{ color: item === '✦' ? 'rgba(167,139,250,0.5)' : 'rgba(167,139,250,0.2)' }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ──────────────────────── STATUS BAR ──────────────────────── */
function StatusBar({ active }: { active: (typeof signals)[0] | null }) {
  return (
    <motion.div
      className="flex items-center gap-3 sm:gap-6 font-mono text-[9px] sm:text-[11px] tracking-[0.2em] flex-wrap justify-center"
      style={{ color: 'rgba(167,139,250,0.35)' }}
    >
      <span className="flex items-center gap-1.5">
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: '#86efac' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        RECEIVER ONLINE
      </span>
      <span>|</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={active?.label || 'idle'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          style={{ color: active ? active.color : 'rgba(167,139,250,0.35)' }}
        >
          {active ? `⟶ ${active.label.toUpperCase()}` : 'SELECT SIGNAL'}
        </motion.span>
      </AnimatePresence>
      <span>|</span>
      <span>51.5°N 0.1°W</span>
    </motion.div>
  );
}

/* ═══════════════════════════ MAIN COMPONENT ════════════════════════════ */
export default function GetInTouch() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? signals[activeIndex] : null;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const sectionY = useTransform(scrollYProgress, [0, 0.5], [80, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 22 });
  const smy = useSpring(my, { stiffness: 60, damping: 22 });
  const rX = useTransform(smy, [-300, 300], [14, -14]);
  const rY = useTransform(smx, [-300, 300], [-14, 14]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  };

  const handleToggle = (i: number) => setActiveIndex(prev => (prev === i ? null : i));

  return (
    <>
      <MagneticBlob />

      <section
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mx.set(0); my.set(0); }}
        className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-24 sm:py-32"
        style={{ background: '#05030f' }}
      >
        {/* Layered BG */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(30,12,80,0.6) 0%, transparent 70%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 50% at 20% 80%, rgba(103,232,249,0.04) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 50% at 80% 20%, rgba(249,168,212,0.04) 0%, transparent 60%)' }} />
        <NoiseOverlay />
        <WarpGrid />

        {/* Top marquee */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <Marquee />
        </div>

        {/* ── HEADER ── */}
        <motion.div
          style={{ y: sectionY, opacity: sectionOpacity }}
          className="relative z-10 text-center mb-10 sm:mb-16"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 mb-5 px-4 py-1.5 rounded-full"
            style={{
              border: '1px solid rgba(167,139,250,0.18)',
              background: 'rgba(167,139,250,0.04)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#a78bfa' }}
              animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span
              className="text-[10px] sm:text-xs tracking-[0.35em] uppercase"
              style={{ color: 'rgba(167,139,250,0.7)', fontFamily: "'DM Mono', monospace" }}
            >
              Signal Receiver Active
            </span>
          </motion.div>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, y: 30, skewY: 4 }}
            whileInView={{ opacity: 1, y: 0, skewY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <h2
              className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tight mb-4"
              style={{
                fontFamily: "'Unbounded', 'Space Grotesk', sans-serif",
                textShadow: '0 0 80px rgba(167,139,250,0.25)',
              }}
            >
              <GlitchText text="GET IN" />
              <br />
              <span
                style={{
                  WebkitTextStroke: '1px rgba(167,139,250,0.5)',
                  color: 'transparent',
                  display: 'inline-block',
                }}
              >
                TOUCH.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-xs sm:text-sm tracking-[0.25em] uppercase"
            style={{ color: 'rgba(167,139,250,0.35)', fontFamily: "'DM Mono', monospace" }}
          >
            Select your transmission type below
          </motion.p>
        </motion.div>

        {/* ── ORBIT SYSTEM ── */}
        <motion.div
          style={{ perspective: 1100, rotateX: orbitRotate }}
          className="relative z-10 mb-10 sm:mb-14"
        >
          <motion.div
            className="relative flex items-center justify-center"
            style={{
              rotateX: rX,
              rotateY: rY,
              transformStyle: 'preserve-3d',
              width: 460,
              height: 460,
              maxWidth: '90vw',
              maxHeight: '90vw',
            }}
          >
            {/* Rings */}
            <OrbitRing r={220} dur={32} dash="dashed" />
            <OrbitRing r={200} dur={22} reverse dash="dashed" color="rgba(167,139,250,0.07)" />
            <OrbitRing r={160} dur={16} color="rgba(103,232,249,0.05)" />
            <OrbitRing r={140} dur={40} reverse dash="dashed" color="rgba(249,168,212,0.04)" />

            {/* Connector SVG lines */}
            <ConnectorLines activeIndex={activeIndex} />

            {/* Signal cards */}
            {signals.map((item, i) => (
              <SignalCard
                key={item.label}
                item={item}
                index={i}
                total={signals.length}
                isActive={activeIndex === i}
                onClick={() => handleToggle(i)}
              />
            ))}

            {/* Central nucleus */}
            <Nucleus active={active} />
          </motion.div>
        </motion.div>

        {/* ── STATUS BAR ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="relative z-10 mb-8 sm:mb-12"
        >
          <StatusBar active={active} />
        </motion.div>

        {/* ── CTA BUTTON ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <motion.a
            href="/contact"
            className="group relative inline-flex items-center gap-4 px-8 sm:px-12 py-4 sm:py-5 rounded-full overflow-hidden cursor-pointer select-none"
            style={{
              border: '1px solid rgba(167,139,250,0.2)',
              background: 'rgba(167,139,250,0.04)',
              backdropFilter: 'blur(16px)',
              fontFamily: "'DM Mono', monospace",
            }}
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
          >
            {/* Hover fill */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(103,232,249,0.08))' }}
              variants={{ hover: { opacity: 1 }, default: { opacity: 0 } }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />

            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)',
              }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            />

            {/* Outer ripples */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid rgba(167,139,250,0.15)' }}
              animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid rgba(167,139,250,0.08)' }}
              animate={{ scale: [1, 1.9], opacity: [0.3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
            />

            {/* Icon */}
            <motion.div
              className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.2)' }}
              variants={{
                hover: { background: 'rgba(167,139,250,0.22)', borderColor: 'rgba(167,139,250,0.5)' },
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(167,139,250,0.9)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{ hover: { x: 3 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </motion.svg>
            </motion.div>

            <motion.span
              className="relative z-10 text-sm sm:text-base font-semibold tracking-[0.2em] uppercase"
              style={{ color: 'rgba(200,185,255,0.9)' }}
              variants={{ hover: { color: '#fff', letterSpacing: '0.25em' } }}
              transition={{ duration: 0.3 }}
            >
              Initiate Contact
            </motion.span>
          </motion.a>
        </motion.div>

        {/* Bottom decoration line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.2), transparent)' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Corner decorations */}
        {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-4 h-4 pointer-events-none`}>
            <div
              className="absolute top-0 left-0 w-full h-[1px]"
              style={{ background: 'rgba(167,139,250,0.2)' }}
            />
            <div
              className="absolute top-0 left-0 h-full w-[1px]"
              style={{ background: 'rgba(167,139,250,0.2)' }}
            />
          </div>
        ))}
      </section>
    </>
  );
}