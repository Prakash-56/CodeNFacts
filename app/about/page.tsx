"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  useAnimationFrame,
  AnimatePresence,
} from "framer-motion";
import {
  Terminal, ArrowRight, Zap, Eye, BookOpen, Cpu,
  Github, Twitter, Layers, Activity, ChevronDown,
  Code, Star, Sparkles, ArrowUpRight, Circle,
} from "lucide-react";

/* ══════════════════════════════════════════════════
   GRAIN OVERLAY
══════════════════════════════════════════════════ */
const Grain = () => (
  <svg className="pointer-events-none fixed inset-0 h-full w-full z-[60] opacity-[0.028]" aria-hidden>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

/* ══════════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════════ */
const CustomCursor = () => {
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const sx = useSpring(cx, { stiffness: 120, damping: 18 });
  const sy = useSpring(cy, { stiffness: 120, damping: 18 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { cx.set(e.clientX); cy.set(e.clientY); };
    const over = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("button,a,[data-cursor]")) setHovered(true);
    };
    const out = () => setHovered(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); window.removeEventListener("mouseout", out); };
  }, []);

  return (
    <>
      <motion.div
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hovered ? 2.5 : 1, opacity: hovered ? 0.15 : 0.6 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 w-5 h-5 rounded-full bg-emerald-400 pointer-events-none z-[999] mix-blend-screen"
      />
      <motion.div
        style={{ x: cx, y: cy, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hovered ? 0 : 1 }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[999]"
      />
    </>
  );
};

/* ══════════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════════ */
const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let s = 0; const step = Math.ceil(to / 80);
    const t = setInterval(() => { s += step; if (s >= to) { setVal(to); clearInterval(t); } else setVal(s); }, 16);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

/* ══════════════════════════════════════════════════
   REVEAL TEXT
══════════════════════════════════════════════════ */
const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "105%", rotateX: 8 }}
        animate={inView ? { y: 0, rotateX: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
        style={{ transformPerspective: 800 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════════════════ */
const MagBtn = ({
  children, href, variant = "primary", icon
}: {
  children: React.ReactNode; href?: string; variant?: "primary" | "ghost"; icon?: React.ReactNode;
}) => {
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 250, damping: 22 });
  const sy = useSpring(my, { stiffness: 250, damping: 22 });
  const handle = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.35);
    my.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const reset = () => { mx.set(0); my.set(0); };
  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={handle as any}
      onMouseLeave={reset}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      data-cursor
      className={`group relative inline-flex items-center gap-3 px-9 py-4 text-sm font-bold tracking-[0.18em] uppercase overflow-hidden rounded-none ${
        variant === "primary"
          ? "bg-emerald-400 text-black"
          : "border border-emerald-400/40 text-emerald-400 hover:border-emerald-400"
      }`}
    >
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-violet-400"
          initial={{ x: "-100%", skewX: -12 }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      {variant === "ghost" && (
        <motion.div
          className="absolute inset-0 bg-emerald-400/10"
          initial={{ scaleX: 0, originX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{children}</span>
      {icon && <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
    </Tag>
  );
};

/* ══════════════════════════════════════════════════
   ORBITING RING (hero deco)
══════════════════════════════════════════════════ */
const OrbitRing = ({ radius, duration, dotColor, delay = 0 }: { radius: number; duration: number; dotColor: string; delay?: number }) => (
  <motion.div
    className="absolute top-1/2 left-1/2 rounded-full border border-white/5"
    style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
    animate={{ rotate: 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear", delay }}
  >
    <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${dotColor} shadow-[0_0_12px_3px] shadow-current opacity-80`} />
  </motion.div>
);

/* ══════════════════════════════════════════════════
   FEATURE CARD
══════════════════════════════════════════════════ */
const FeatureCard = ({ icon, title, desc, idx }: { icon: React.ReactNode; title: string; desc: string; idx: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      className="group relative p-8 border border-white/6 bg-[#080d14] overflow-hidden cursor-default"
      style={{
        background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(52,211,153,0.04), transparent 60%), #080d14`
      }}
    >
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-emerald-400/30 group-hover:border-emerald-400/80 transition-colors duration-500" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-violet-500/30 group-hover:border-violet-500/80 transition-colors duration-500" />

      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-12 h-12 mb-6 flex items-center justify-center text-emerald-400 border border-emerald-400/20 group-hover:border-emerald-400/60 group-hover:bg-emerald-400/8 transition-all duration-500"
      >
        {icon}
      </motion.div>
      <h4 className="text-white font-bold text-lg mb-3 group-hover:text-emerald-300 transition-colors duration-300">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors duration-300">{desc}</p>
      <motion.div
        className="mt-6 flex items-center gap-2 text-emerald-400/50 text-xs font-mono tracking-widest group-hover:text-emerald-400 transition-colors duration-300"
        initial={{ x: -5, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.1 + 0.5 }}
      >
        Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </motion.div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════
   GLITCH TEXT
══════════════════════════════════════════════════ */
const GlitchText = ({ text, className = "" }: { text: string; className?: string }) => {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className={`relative inline-block ${className}`}>
      {text}
      {glitching && (
        <>
          <span className="absolute inset-0 text-emerald-400 translate-x-[2px] clip-[rect(0,900px,30px,0)]" aria-hidden>{text}</span>
          <span className="absolute inset-0 text-violet-400 -translate-x-[2px] translate-y-[4px] clip-[rect(30px,900px,80px,0)]" aria-hidden>{text}</span>
        </>
      )}
    </span>
  );
};

/* ══════════════════════════════════════════════════
   SCROLL LINE
══════════════════════════════════════════════════ */
const ScLine = ({ delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="h-px w-full bg-white/5 overflow-hidden">
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay }}
        className="h-full bg-gradient-to-r from-emerald-400/60 via-violet-400/40 to-transparent"
      />
    </div>
  );
};

/* ══════════════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════════════ */
const Typewriter = ({ words }: { words: string[] }) => {
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[idx];
    const timeout = setTimeout(() => {
      if (!deleting && chars < word.length) setChars(c => c + 1);
      else if (!deleting && chars === word.length) { setTimeout(() => setDeleting(true), 1800); }
      else if (deleting && chars > 0) setChars(c => c - 1);
      else { setDeleting(false); setIdx(i => (i + 1) % words.length); }
    }, deleting ? 40 : 75);
    return () => clearTimeout(timeout);
  }, [chars, deleting, idx, words]);
  return (
    <span className="text-emerald-400">
      {words[idx].slice(0, chars)}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>
    </span>
  );
};

/* ══════════════════════════════════════════════════
   TEAM CARD
══════════════════════════════════════════════════ */
const TeamCard = ({ name, role, idx }: { name: string; role: string; idx: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const colors = ["text-emerald-400", "text-violet-400", "text-cyan-400", "text-rose-400", "text-orange-400", "text-sky-400"];
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, borderColor: "rgba(52,211,153,0.3)" }}
      className="group relative p-8 border border-white/6 bg-[#080d14] transition-all duration-500 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(52,211,153,0.06), transparent 70%)" }}
      />
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black mb-6 bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors ${colors[idx % colors.length]}`}>
        {name[0]}
      </div>
      <div className="font-bold text-white text-base mb-1">{name}</div>
      <div className={`font-mono text-xs tracking-widest uppercase ${colors[idx % colors.length]} opacity-60`}>{role}</div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function CodeNFactsAbout() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const progressScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.92]);

  const technologies = ["Next.js", "Rust", "TypeScript", "Docker", "Kubernetes", "AI/ML", "WebAssembly", "Go", "PostgreSQL", "eBPF", "Zig", "Linux Kernel", "LLVM", "gRPC"];

  const stats = [
    { value: 150, suffix: "+", label: "Deep-Dives" },
    { value: 12000, suffix: "", label: "Engineers" },
    { value: 1200, suffix: "", label: "GitHub Stars" },
    { value: 25, suffix: "+", label: "Contributors" },
  ];

  const features = [
    { icon: <Cpu className="w-5 h-5" />, title: "Silicon-Level Accuracy", desc: "From cache lines to compiler optimizations - we trace every abstraction to its bare-metal origin so you understand what's really happening under the hood." },
    { icon: <Eye className="w-5 h-5" />, title: "Zero Hand-Waving", desc: "Every benchmark is reproducible. Every claim cites primary sources. We never skip the hard parts. Opinion is clearly labeled as such." },
    { icon: <Layers className="w-5 h-5" />, title: "Systems Thinking", desc: "We connect micro-decisions to macro-consequences. One config line can cascade through your entire distributed system." },
    { icon: <Activity className="w-5 h-5" />, title: "Production-Grounded", desc: "Our examples are extracted from real incident post-mortems, not toy problems. Learn from failures that cost real companies real money." },
    { icon: <BookOpen className="w-5 h-5" />, title: "First-Principles Pedagogy", desc: "We don't teach the shortcut. We teach the long road so you can invent better shortcuts yourself." },
    { icon: <Zap className="w-5 h-5" />, title: "Performance as a Feature", desc: "We treat milliseconds like money. Every guide includes profiling, measurement methodology, and optimization under real constraints." },
  ];

  const team = [
    { name: "Arjun Mehra", role: " Systems Architect" },
    { name: "Priya Iyer", role: "Compiler · Language Expert" },
    { name: "Devon Walsh", role: "Distributed Systems" },
    { name: "Yuki Tanaka", role: "Performance Engineer" },
    { name: "Sana Mirza", role: "AI/ML Research" },
    { name: "Luca Ferrari", role: "Web Platform" },
  ];

  const typeWords = ["Compilers.", "Kernels.", "Protocols.", "Algorithms.", "Architecture.", "Performance."];

  return (
    <div ref={containerRef} className="relative bg-[#060a10] text-slate-100 overflow-x-hidden select-none"
      style={{ fontFamily: "'DM Mono', 'Fira Code', monospace", cursor: "none" }}>

      <Grain />
      <CustomCursor />

      {/* Global scroll progress */}
      <motion.div style={{ scaleX: progressScaleX }} className="fixed top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-emerald-400 via-violet-400 to-emerald-400 origin-left z-[100]" />

      {/* Side nav dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {["hero", "mission", "features", "team", "cta"].map((s, i) => (
          <motion.div
            key={s}
            whileHover={{ scale: 1.8 }}
            className="w-1 h-1 rounded-full bg-slate-700 hover:bg-emerald-400 transition-colors duration-300 cursor-pointer"
          />
        ))}
      </div>

      {/* ── HERO ─────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Deep BG layers */}
        <div className="absolute inset-0">
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.025)_1px,transparent_1px)] bg-[size:72px_72px]" />
          {/* Radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,#060a10_80%)]" />
        </div>

        {/* Glows */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-[160px]"
            style={{ background: "radial-gradient(ellipse, rgba(52,211,153,0.07) 0%, rgba(139,92,246,0.05) 50%, transparent 80%)" }} />
          <div className="absolute top-[20%] left-[15%] w-80 h-80 bg-violet-600/6 rounded-full blur-[100px]" />
          <div className="absolute bottom-[20%] right-[10%] w-60 h-60 bg-emerald-500/8 rounded-full blur-[80px]" />
        </motion.div>

        {/* Orbiting rings */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <OrbitRing radius={180} duration={18} dotColor="bg-emerald-400" />
          <OrbitRing radius={260} duration={28} dotColor="bg-violet-400" delay={-8} />
          <OrbitRing radius={340} duration={40} dotColor="bg-cyan-400" delay={-15} />
          <OrbitRing radius={420} duration={55} dotColor="bg-emerald-300" delay={-25} />
        </motion.div>

        {/* BG lettering */}
        <motion.div
          style={{ opacity: useTransform(heroScroll, [0, 0.5], [0.035, 0]) }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        >
          <span className="text-[22vw] font-black text-white tracking-tighter leading-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}></span>
        </motion.div>

        {/* Hero content */}
        <motion.div style={{ y: useTransform(heroScroll, [0, 1], ["0%", "-18%"]), opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 text-center px-6 max-w-6xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-5 py-2 mb-12 border border-emerald-400/25 bg-emerald-400/5 backdrop-blur-sm"
          >
            <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-emerald-400/80 text-[11px] tracking-[0.5em] uppercase">V-13.o · Engineering Journalism</span>
          </motion.div>

          {/* Main title split */}
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            <Reveal delay={0.35}>
              <h1 className="text-[clamp(5rem,15vw,12rem)] font-black tracking-tighter leading-[0.82] text-white">
                <GlitchText text="Code" />
              </h1>
            </Reveal>
            <Reveal delay={0.5}>
              <h1 className="text-[clamp(5rem,15vw,12rem)] font-black tracking-tighter leading-[0.82]"
                style={{ WebkitTextStroke: "1px rgba(52,211,153,0.6)", color: "transparent" }}>
                N Facts.
              </h1>
            </Reveal>
          </div>

          {/* Typewriter subline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="mt-8 text-slate-500 text-lg md:text-xl tracking-wide"
          >
            We go all the way down to &nbsp;
            <Typewriter words={typeWords} />
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.2 }}
            className="flex flex-wrap justify-center gap-5 mt-14"
          >
            <MagBtn href="/apply-for-internship" variant="primary" icon={<ArrowUpRight className="w-4 h-4" />}>
              Apply For Intern
            </MagBtn>
            <MagBtn href="/failure-log" variant="ghost" icon={<ArrowRight className="w-4 h-4" />}>
              Failure Log
            </MagBtn>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="absolute -bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="font-mono text-slate-700 text-[9px] tracking-[0.5em] uppercase">Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
              <ChevronDown className="w-4 h-4 text-slate-700" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── TECH MARQUEE ─────────────────────────────── */}
      <div className="relative py-5 border-y border-white/[0.04] overflow-hidden bg-[#070c12]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#070c12] via-transparent to-[#070c12] z-10 pointer-events-none" />
        {[1, -1].map((dir, di) => (
          <motion.div key={di}
            animate={{ x: dir === 1 ? ["0%", "-50%"] : ["-50%", "0%"] }}
            transition={{ duration: 35 + di * 10, repeat: Infinity, ease: "linear" }}
            className={`flex gap-12 whitespace-nowrap ${di === 1 ? "mt-2" : ""}`}
          >
            {[...technologies, ...technologies].map((t, i) => (
              <span key={i} className="font-mono text-[10px] tracking-[0.5em] uppercase text-slate-700 hover:text-emerald-400 transition-colors duration-300 cursor-default">
                {t}
              </span>
            ))}
          </motion.div>
        ))}
      </div>

      {/* ── MISSION ──────────────────────────────────── */}
      <section className="py-44 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">

            {/* Left */}
            <div className="lg:col-span-7">
              <Reveal className="mb-8">
                <span className="font-mono text-emerald-400/60 text-[10px] tracking-[0.5em] uppercase">§ 01 - Our Reason</span>
              </Reveal>

              <div style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <Reveal delay={0.1}>
                  <h2 className="text-6xl md:text-8xl font-black leading-[0.88] tracking-tight text-white mb-2">We asked.</h2>
                </Reveal>
                <Reveal delay={0.22}>
                  <h2 className="text-6xl md:text-8xl font-black leading-[0.88] tracking-tight text-slate-700 italic">Why do we build it this way?</h2>
                </Reveal>
              </div>

              <ScLine delay={0.4} />
              <div className="mt-10 space-y-6">
                {[
                  "The internet is saturated with tutorials that show you what to type. Precious few explain why it compiles, why it's slow, why it collapses under load.",
                  "CodeNFacts was born out of frustration. Engineers from systems, compiler, and distributed computing backgrounds were tired of articles that waved their hands at the hard parts.",
                  "So we built the publication we always wanted to read. Every article starts from first principles and doesn't stop until the mystery is fully resolved - even if that means reading kernel source code at 2am.",
                ].map((p, i) => (
                  <Reveal key={i} delay={0.45 + i * 0.1} className="block">
                    <p className="text-slate-500 text-base leading-relaxed">{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Right — Stats */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-px">
              <div className="grid grid-cols-2 gap-px bg-white/[0.04]">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    whileHover={{ backgroundColor: "rgba(52,211,153,0.04)" }}
                    className="bg-[#060a10] p-10 text-center group transition-colors duration-300 cursor-default"
                  >
                    <div className="text-4xl font-black text-emerald-400 mb-2">
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="font-mono text-slate-600 text-[10px] tracking-[0.35em] uppercase group-hover:text-slate-500 transition-colors">{s.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="bg-[#0b1019] border border-emerald-400/12 p-10 relative overflow-hidden"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 w-20 h-20 rounded-full border border-emerald-400/10"
                />
                <div className="font-serif text-7xl text-emerald-400/20 leading-none mb-4">"</div>
                <p className="text-slate-400 text-base leading-relaxed italic mb-6">
                  A developer who understands the facts is worth ten who only know the syntax.
                </p>
                <div className="font-mono text-[10px] text-emerald-400/40 tracking-[0.4em] uppercase">- CodeNFacts V2.9.o</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM vs SOLUTION ──────────────────────── */}
      <section className="py-28 bg-[#050810] border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.04]">

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="p-16 bg-[#050810]"
            >
              <div className="inline-block px-3 py-1 bg-rose-500/8 border border-rose-500/20 font-mono text-rose-400 text-[10px] tracking-[0.4em] uppercase mb-10">
                The Problem
              </div>
              <h3 className="text-4xl font-black text-white mb-10 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Tutorial Hell is Real.<br />
                <span className="text-slate-700 italic">And it's getting worse.</span>
              </h3>
              <div className="space-y-5">
                {["Copy-paste culture creates fragile, unscalable systems", "Framework churn leaves engineers perpetually behind", "Abstraction layers hide critical failure modes", "Nobody teaches you to actually read error messages", "Production incidents from code nobody understood"].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 + 0.3 }}
                    className="flex items-start gap-4">
                    <span className="mt-2 w-1 h-1 rounded-full bg-rose-500 shrink-0" />
                    <span className="text-slate-500 text-sm leading-relaxed">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="p-16 bg-[#060c12] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(52,211,153,0.04),transparent_60%)]" />
              <div className="inline-block px-3 py-1 bg-emerald-400/8 border border-emerald-400/20 font-mono text-emerald-400 text-[10px] tracking-[0.4em] uppercase mb-10 relative z-10">
                The CodeNFacts Solution
              </div>
              <h3 className="text-4xl font-black text-white mb-10 leading-tight relative z-10" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                First Principles.<br />
                <span className="text-emerald-400">Every single time.</span>
              </h3>
              <div className="space-y-5 relative z-10">
                {["Every tutorial traces code down to hardware reality", "Benchmarks are reproducible and methodology is disclosed", "We teach debugging as a true first-class skill", "Post-mortems from production, not synthetic toy examples", "You leave understanding, not just memorizing"].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 + 0.3 }}
                    className="flex items-start gap-4">
                    <span className="mt-2 w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-slate-400 text-sm leading-relaxed">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────── */}
      <section className="py-44 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <Reveal className="mb-6">
              <span className="font-mono text-emerald-400/60 text-[10px] tracking-[0.5em] uppercase">§ 02 - What Sets Us Apart</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Six promises we<br />
                <span className="text-emerald-400 italic">never break.</span>
              </h2>
            </Reveal>
          </div>

          <ScLine />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] mt-0">
            {features.map((f, i) => <FeatureCard key={i} {...f} idx={i} />)}
          </div>
        </div>
      </section>

      {/* ── NUMBERS STRIP ────────────────────────────── */}
      <div className="py-20 bg-[#050810] border-y border-white/[0.04] overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-0"
        >
          {[["150+", "Articles"], ["48h", "Avg. Research"], ["0", "Sponsored Pieces"], ["100%", "Open Source Refs"], ["∞", "Curiosity"]].map(([v, l], i) => (
            <React.Fragment key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ backgroundColor: "rgba(52,211,153,0.04)" }}
                className="px-12 py-10 text-center transition-colors duration-300 cursor-default"
              >
                <div className="text-5xl font-black text-emerald-400 font-mono mb-2">{v}</div>
                <div className="font-mono text-[10px] text-slate-600 tracking-[0.4em] uppercase">{l}</div>
              </motion.div>
              {i < 4 && <div className="w-px self-stretch bg-white/[0.04]" />}
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* ── TEAM ─────────────────────────────────────── */}
      <section className="py-44 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            <div className="lg:col-span-5">
              <Reveal className="mb-6">
                <span className="font-mono text-emerald-400/60 text-[10px] tracking-[0.5em] uppercase">§ 03 - The Minds Behind It</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-5xl md:text-6xl font-black text-white leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Built by engineers.<br />
                  <span className="text-slate-600 italic">For engineers.</span>
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-7 self-end">
              <Reveal delay={0.2} className="block">
                <p className="text-slate-500 text-base leading-relaxed">
                  Every contributor has shipped production code, debugged live incidents, and fought with real hardware constraints. We write from scars, not theory.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/[0.04]">
            {team.map((t, i) => <TeamCard key={i} {...t} idx={i} />)}
          </div>
        </div>
      </section>

      {/* ── AMBER TAPE ───────────────────────────────── */}
      <div className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #0a1a12 0%, #0c0f1a 50%, #0a1a12 100%)" }}>
        <div className="absolute inset-0 border-y border-emerald-400/10" />
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 whitespace-nowrap"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="text-5xl font-black text-transparent tracking-tighter"
              style={{ WebkitTextStroke: "1px rgba(52,211,153,0.15)", fontFamily: "'Playfair Display', Georgia, serif" }}>
              Understand the Code · Know the Facts · Build Without Fear ·&nbsp;
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── FINAL CTA ────────────────────────────────── */}
      <section className="relative py-52 px-6 overflow-hidden">
        {/* Layered glows */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(52,211,153,0.07),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_30%_60%,rgba(139,92,246,0.05),transparent)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
          {/* Floating glowing dots */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px rounded-full bg-emerald-400"
              style={{ left: `${15 + i * 10}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ opacity: [0, 0.6, 0], scale: [0, 3, 0] }}
              transition={{ duration: 3 + i * 0.7, repeat: Infinity, delay: i * 0.9, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Reveal className="mb-10">
            <span className="font-mono text-emerald-400/50 text-[10px] tracking-[0.5em] uppercase">§ 04 - The Next Step</span>
          </Reveal>

          <div style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            <Reveal delay={0.1}>
              <h2 className="text-7xl md:text-[10rem] font-black leading-[0.85] tracking-tighter text-white">
                Stop guessing.
              </h2>
            </Reveal>
            <Reveal delay={0.22}>
              <h2 className="text-7xl md:text-[10rem] font-black leading-[0.85] tracking-tighter"
                style={{ WebkitTextStroke: "1.5px rgba(52,211,153,0.7)", color: "transparent" }}>
                Start knowing.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.4} className="block mt-10 mb-16">
            <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              Join 12,000 engineers who refuse to ship code they don't understand.
            </p>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap justify-center gap-6 mb-28"
          >
            <MagBtn href="/ask-notes" variant="primary" icon={<ArrowUpRight className="w-4 h-4" />}>
              Apply For Notes
            </MagBtn>
            <MagBtn href="/who-its-for" variant="ghost" icon={<ArrowRight className="w-4 h-4" />}>
              Who It's For
            </MagBtn>
          </motion.div>

          <ScLine delay={0.6} />
        </div>
      </section>
    </div>
  );
}