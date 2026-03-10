'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  useInView,
  useScroll,
  useVelocity,
  useAnimationFrame,
} from 'framer-motion';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const FIELDS = [
  { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Arjun', half: true },
  { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Sharma', half: true },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'arjun@example.com', half: false },
  { name: 'mobile', label: 'Mobile Number', type: 'tel', placeholder: '+91 98765 43210', half: false },
  { name: 'experience', label: 'Work / Project Experience', type: 'text', placeholder: 'e.g. 1 yr internship at XYZ', half: false },
];

const EDUCATION_OPTIONS = ['High School', 'Undergraduate', 'Postgraduate', 'Working Professional'];
const GOAL_OPTIONS = ['Software Engineer', 'Data Scientist', 'AI/ML Engineer', 'Full Stack Developer', 'DevOps Engineer', 'Product Manager'];

const STATS = [
  { value: '94%', label: 'Placement Rate' },
  { value: '3.2×', label: 'Avg Salary Hike' },
  { value: '180+', label: 'Students Placed' },
  { value: '48h', label: 'Avg Response Time' },
];

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────── */
function MagneticButton({ children, className = '', onClick, disabled, type = 'button' }: any) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy }}
      className={className}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   NOISE TEXTURE SVG
───────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <svg className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
function AnimatedStat({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="text-center px-4 py-3"
    >
      <motion.div
        className="text-3xl sm:text-4xl font-black tracking-tighter"
        style={{ fontFamily: "'Bebas Neue', sans-serif", background: 'linear-gradient(135deg, #f0e6ff 0%, #c8b0ff 50%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: index * 0.12 + 0.2, duration: 0.5, type: 'spring', stiffness: 300 }}
      >
        {value}
      </motion.div>
      <div className="text-[11px] text-white/40 font-medium tracking-widest uppercase mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>{label}</div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PLASMA / BLOB BACKGROUND
───────────────────────────────────────────── */
function PlasmaBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep base */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a0533 0%, #08020f 55%, #000000 100%)' }} />

      {/* Plasma blob 1 */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: '80vw', height: '80vw', maxWidth: 900, maxHeight: 900, top: '-25%', left: '-20%', background: 'radial-gradient(circle, rgba(123,31,162,0.28) 0%, transparent 65%)', filter: 'blur(60px)' }}
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 80, 0], scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Plasma blob 2 */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: '60vw', height: '60vw', maxWidth: 700, maxHeight: 700, bottom: '-15%', right: '-15%', background: 'radial-gradient(circle, rgba(49,10,120,0.35) 0%, transparent 65%)', filter: 'blur(80px)' }}
        animate={{ x: [0, -60, 40, 0], y: [0, 50, -70, 0], scale: [1, 0.85, 1.2, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      {/* Plasma blob 3 – accent cyan */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: '40vw', height: '40vw', maxWidth: 500, maxHeight: 500, top: '35%', right: '10%', background: 'radial-gradient(circle, rgba(99,10,180,0.2) 0%, transparent 65%)', filter: 'blur(50px)' }}
        animate={{ x: [0, 40, -30, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />

      {/* Fine grid */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'linear-gradient(rgba(200,176,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,176,255,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Radial vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   FLOATING PARTICLES
───────────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 12 + 10,
    delay: Math.random() * 8,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            background: `rgba(${Math.random() > 0.5 ? '180,120,255' : '220,200,255'},${Math.random() * 0.5 + 0.2})`,
            boxShadow: `0 0 ${p.size * 3}px rgba(160,80,255,0.6)`,
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   GLOWING INPUT FIELD
───────────────────────────────────────────── */
function GlowInput({ field, value, onChange }: { field: typeof FIELDS[0]; value: string; onChange: any }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const done = value.length > 0;

  return (
    <motion.div
      className="relative"
      style={{ gridColumn: field.half ? undefined : 'span 2' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Glow behind field */}
      <AnimatePresence>
        {(focused || hovered) && (
          <motion.div
            className="absolute -inset-0.5 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: focused ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'linear-gradient(135deg, #3b1a6e, #1e0a3c)', filter: 'blur(8px)' }}
          />
        )}
      </AnimatePresence>

      <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${focused ? 'rgba(180,120,255,0.6)' : done ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)'}`, transition: 'border-color 0.3s' }}>
        {/* Shimmer line on focus */}
        <AnimatePresence>
          {focused && (
            <motion.div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #c084fc, #7c3aed, transparent)' }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        <input
          type={field.type}
          name={field.name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=" "
          className="peer w-full bg-transparent text-white/90 px-5 pt-7 pb-3 text-sm outline-none placeholder-transparent"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        />
        <label
          className="absolute left-5 pointer-events-none transition-all duration-300 peer-placeholder-shown:top-[50%] peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/35 top-2.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: focused ? '#c084fc' : done ? '#9b6dd4' : undefined }}
        >
          {field.label}
        </label>

        {/* Done tick */}
        <AnimatePresence>
          {done && (
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
            >
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   GLOW SELECT
───────────────────────────────────────────── */
function GlowSelect({ name, label, value, onChange, options }: { name: string; label: string; value: string; onChange: any; options: string[] }) {
  const [focused, setFocused] = useState(false);
  const done = value !== '';

  return (
    <motion.div className="relative">
      <AnimatePresence>
        {focused && (
          <motion.div className="absolute -inset-0.5 rounded-2xl pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', filter: 'blur(8px)' }} />
        )}
      </AnimatePresence>

      <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${focused ? 'rgba(180,120,255,0.6)' : done ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)'}`, transition: 'border-color 0.3s' }}>
        <AnimatePresence>
          {focused && (
            <motion.div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #c084fc, #7c3aed, transparent)' }}
              initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} exit={{ scaleX: 0, opacity: 0 }} transition={{ duration: 0.4 }} />
          )}
        </AnimatePresence>

        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-white/90 px-5 pt-7 pb-3 text-sm outline-none appearance-none cursor-pointer"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <option value="" disabled className="bg-[#0d0720]">Select {label}</option>
          {options.map((o) => <option key={o} value={o} className="bg-[#0d0720]">{o}</option>)}
        </select>

        <label className={`absolute left-5 pointer-events-none transition-all duration-300 ${value ? 'top-2.5 text-[10px] font-semibold uppercase tracking-[0.12em]' : 'top-1/2 -translate-y-1/2 text-sm text-white/35'}`}
          style={{ color: focused ? '#c084fc' : done ? '#9b6dd4' : undefined }}>
          {label}
        </label>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
                className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </motion.div>
            ) : (
              <motion.svg key="arrow" className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SCROLLING TICKER
───────────────────────────────────────────── */
function Ticker() {
  const items = ['Software Engineering', 'Data Science', 'AI / ML', 'Full Stack Dev', 'DevOps', 'Product Management', 'System Design', 'Interview Prep'];
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-1000, 0, 1000], [-3, 1, 3]);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const directionFactor = useRef(1);

  function wrap(min: number, max: number, v: number) {
    const range = max - min;
    return ((((v - min) % range) + range) % range) + min;
  }

  useAnimationFrame((_, delta) => {
    let vf = velocityFactor.get();
    if (vf < 0) directionFactor.current = -1;
    else if (vf > 0) directionFactor.current = 1;
    const move = directionFactor.current * vf * 0.012 * delta;
    baseX.set(baseX.get() + move - 0.025 * delta);
  });

  const doubled = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-3 my-6 border-y border-white/5">
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #08020f, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #08020f, transparent)' }} />
      <motion.div className="flex gap-8 whitespace-nowrap" style={{ x }}>
        {doubled.map((item, i) => (
          <span key={i} className="text-xs font-semibold tracking-widest uppercase text-white/25 flex items-center gap-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {item}
            <span className="text-purple-500/40">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function MentorshipPage() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobile: '',
    education: '', experience: '', placementGoal: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const total = Object.keys(formData).length;
    const filled = Object.values(formData).filter(v => v.trim() !== '').length;
    setProgress(Math.round((filled / total) * 100));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/send-mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to send. Please try again.');
      setSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', mobile: '', education: '', experience: '', placementGoal: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    }
    setLoading(false);
  };

  /* Progress ring */
  const circumference = 2 * Math.PI * 18;
  const strokeDash = circumference - (progress / 100) * circumference;

  return (
    <>
      <NoiseOverlay />
      <section className="relative min-h-screen overflow-hidden py-16 px-4 sm:px-6 lg:px-8"
        style={{ fontFamily: "'Outfit', sans-serif" }}>

        <PlasmaBackground />
        <Particles />

        <div className="relative z-10 max-w-5xl mx-auto">

          {/* ── HEADER ── */}
          <motion.div className="text-center mb-10 sm:mb-14"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>

            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 mb-7"
              style={{ borderColor: 'rgba(180,120,255,0.3)', background: 'rgba(124,58,237,0.08)' }}
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            >
              <motion.span className="w-1.5 h-1.5 rounded-full bg-violet-400"
                animate={{ scale: [1, 1.8, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }} />
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-violet-300">Limited Seats - 2026 Cohort</span>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-4">
              <motion.h1
                className="text-[clamp(3rem,10vw,7.5rem)] font-black leading-[0.9] tracking-tighter"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '-0.02em' }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              >
                <span className="text-white">1:1 </span>
                <span style={{ background: 'linear-gradient(135deg, #e8d5ff 0%, #c084fc 35%, #7c3aed 70%, #4c1d95 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Mentorship
                </span>
              </motion.h1>
            </div>

            <motion.p
              className="text-white/45 text-base sm:text-lg max-w-lg mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            >
              One application. One mentor. The career trajectory you've been working toward.
            </motion.p>
          </motion.div>

          {/* ── STATS ROW ── */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-1 mb-2 rounded-2xl overflow-hidden border border-white/5"
            style={{ background: 'rgba(255,255,255,0.02)' }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          >
            {STATS.map((s, i) => (
              <div key={s.label} className={`${i < 3 ? 'border-r border-white/5' : ''}`}>
                <AnimatedStat {...s} index={i} />
              </div>
            ))}
          </motion.div>

          {/* ── TICKER ── */}
          <Ticker />

          {/* ── FORM CARD ── */}
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            style={{ background: 'rgba(10,3,22,0.75)', backdropFilter: 'blur(60px)', border: '1px solid rgba(180,120,255,0.12)', boxShadow: '0 50px 120px rgba(0,0,0,0.7), 0 0 80px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.06)' }}
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top gradient bar */}
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(180,120,255,0.3) 20%, #c084fc 50%, rgba(124,58,237,0.3) 80%, transparent 100%)' }} />

            {/* Inner corner accents */}
            <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none" style={{ background: 'radial-gradient(circle at 0% 0%, rgba(180,120,255,0.1), transparent 70%)' }} />
            <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none" style={{ background: 'radial-gradient(circle at 100% 100%, rgba(124,58,237,0.1), transparent 70%)' }} />

            <div className="p-6 sm:p-10 lg:p-12">

              {/* Progress header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-white font-bold text-lg sm:text-xl tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em', fontSize: 'clamp(1.2rem,3vw,1.6rem)' }}>
                    YOUR APPLICATION
                  </h2>
                  <p className="text-white/30 text-xs mt-0.5">All fields required · Response within 24h</p>
                </div>

                {/* SVG Ring progress */}
                <div className="relative flex items-center justify-center w-14 h-14">
                  <svg className="absolute w-14 h-14 -rotate-90" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                    <motion.circle cx="22" cy="22" r="18" fill="none" stroke="url(#ringGrad)" strokeWidth="3"
                      strokeLinecap="round"
                      style={{ strokeDasharray: circumference }}
                      animate={{ strokeDashoffset: strokeDash }}
                      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                    />
                    <defs>
                      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="text-[11px] font-bold text-white/70">{progress}%</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Text fields */}
                {FIELDS.map((field, i) => (
                  <motion.div
                    key={field.name}
                    style={{ gridColumn: field.half ? undefined : 'span 2' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <GlowInput
                      field={field}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                    />
                  </motion.div>
                ))}

                {/* Selects */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}>
                  <GlowSelect name="education" label="Education Level" value={formData.education} onChange={handleChange} options={EDUCATION_OPTIONS} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }}>
                  <GlowSelect name="placementGoal" label="Placement Goal" value={formData.placementGoal} onChange={handleChange} options={GOAL_OPTIONS} />
                </motion.div>

                {/* Textarea */}
                <motion.div
                  className="relative"
                  style={{ gridColumn: 'span 2' }}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }}
                >
                  <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${formData.message ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)'}`, transition: 'border-color 0.3s' }}>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      required
                      placeholder=" "
                      onFocus={(e) => (e.currentTarget.parentElement!.style.borderColor = 'rgba(180,120,255,0.6)')}
                      onBlur={(e) => (e.currentTarget.parentElement!.style.borderColor = formData.message ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)')}
                      className="peer w-full bg-transparent text-white/90 px-5 pt-8 pb-4 text-sm outline-none placeholder-transparent resize-none"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    />
                    <label className="absolute left-5 top-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-400 pointer-events-none transition-all duration-300 peer-placeholder-shown:top-[50%] peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/35 peer-placeholder-shown:tracking-normal peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:tracking-[0.12em]">
                      Why do you want this mentorship?
                    </label>
                    <AnimatePresence>
                      {formData.message && (
                        <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
                          className="absolute right-4 top-4 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div className="col-span-2 rounded-xl px-4 py-3 text-sm text-red-300 text-center"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.div className="col-span-2 mt-2"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
                  <MagneticButton
                    type="submit"
                    disabled={loading || success}
                    className="relative w-full overflow-hidden rounded-2xl py-5 font-bold text-base tracking-wide text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: success ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 40%, #9333ea 100%)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}
                  >
                    {/* Animated shimmer */}
                    {!loading && !success && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.1) 50%, transparent 65%)' }}
                        animate={{ x: ['-150%', '150%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                      />
                    )}

                    {/* Ripple overlay on success */}
                    <AnimatePresence>
                      {success && (
                        <motion.div className="absolute inset-0 rounded-2xl" style={{ background: 'rgba(22,163,74,0.3)' }}
                          initial={{ scale: 0, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 0.6 }} />
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {success ? (
                        <motion.div key="s" className="flex items-center justify-center gap-2.5" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          Application Sent!
                        </motion.div>
                      ) : loading ? (
                        <motion.div key="l" className="flex items-center justify-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <motion.svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                            animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </motion.svg>
                          Sending Application…
                        </motion.div>
                      ) : (
                        <motion.div key="i" className="flex items-center justify-center gap-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                          Send My Application
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </MagneticButton>
                </motion.div>

              </form>
            </div>

            {/* Bottom bar */}
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.2) 50%, transparent 100%)' }} />
          </motion.div>

          {/* ── FOOTER NOTE ── */}
          <motion.p className="text-center text-white/20 text-xs mt-6 tracking-wide"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
            Your information is private and never shared with third parties.
          </motion.p>

        </div>

        {/* Google Fonts */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
          select option { background: #0d0720; color: white; }
          * { box-sizing: border-box; }
          @media (max-width: 640px) {
            .sm\\:grid-cols-2 { grid-template-columns: 1fr !important; }
            [style*="gridColumn: span 2"] { grid-column: span 1 !important; }
          }
        `}</style>
      </section>
    </>
  );
}