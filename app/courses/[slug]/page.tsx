"use client";

import { use, useState, useEffect, useRef } from "react";
import { courses } from "@/data/courses";
import { notFound } from "next/navigation";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
  useInView,
  useMotionValue,
} from "framer-motion";
import {
  CheckCircle2, Clock, Globe, ShieldCheck, Trophy,
  ArrowRight, BookOpen, Star, Sparkles, Play, Code2,
  ChevronDown, Flame, Users, Zap, Lock, Award,
  FolderGit2, Target, Layers, BrainCircuit, Cpu,
  Terminal, Database, BarChart3, Layout, Coffee, Briefcase,
  ChevronRight, X, Plus, ArrowUpRight, Rocket, Timer
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── LIVE PARTICLE CANVAS ──────────────────────────────────────────────────────
function ParticleField({ color = "#6366f1" }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.round(p.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${color}${Math.round(0.08 * (1 - d / 100) * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [color]);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

// ─── NOISE TEXTURE OVERLAY ─────────────────────────────────────────────────────
function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-[0.025]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px",
      }}
    />
  );
}

// ─── SCROLL PROGRESS BAR ──────────────────────────────────────────────────────
function ScrollProgress({ color }: { color: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[200]"
      style={{ scaleX, background: `linear-gradient(90deg, ${color}, ${color}88)` }}
    />
  );
}

// ─── TILT WRAPPER ─────────────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mx = useSpring(x, { stiffness: 200, damping: 25 });
  const my = useSpring(y, { stiffness: 200, damping: 25 });
  const rotX = useTransform(my, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotY = useTransform(mx, [-0.5, 0.5], ["-6deg", "6deg"]);
  return (
    <motion.div
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── LIVE COUNTER ─────────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const step = target / 50;
    const t = setInterval(() => {
      s += step;
      if (s >= target) { setV(target); clearInterval(t); }
      else setV(Math.floor(s));
    }, 20);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

// ─── MODULE ACCORDION ─────────────────────────────────────────────────────────
function ModuleAccordion({ module, idx, color }: {
  module: { module: string; title: string; topics: string[] };
  idx: number;
  color: string;
}) {
  const [open, setOpen] = useState(idx === 0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: idx * 0.07 }}
      className="group relative"
    >
      {/* Left timeline line */}
      <div
        className="absolute left-[2.2rem] top-0 bottom-0 w-px opacity-20"
        style={{ background: `linear-gradient(180deg, ${color}, transparent)` }}
      />
      <div
        className="rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: open ? `${color}08` : 'rgba(255,255,255,0.02)',
          border: `1px solid ${open ? color + '30' : 'rgba(255,255,255,0.05)'}`,
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full p-6 flex items-center gap-5 text-left"
        >
          {/* Step badge */}
          <div
            className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{ background: open ? `linear-gradient(135deg, ${color}, ${color}99)` : 'rgba(255,255,255,0.06)' }}
          >
            {String(idx + 1).padStart(2, "0")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: `${color}99` }}>
              {module.module}
            </div>
            <div className="text-base font-bold text-white truncate">{module.title}</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-white/30 font-medium">{module.topics.length} topics</span>
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown className="w-4 h-4 text-white/30" />
            </motion.div>
          </div>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pl-[4.75rem] grid grid-cols-1 md:grid-cols-2 gap-2">
                {module.topics.map((topic, i) => (
                  <motion.div
                    key={topic}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-white/3 border border-white/5"
                  >
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-sm text-white/70">{topic}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ proj, idx, color }: {
  proj: { type: string; title: string; tech: string };
  idx: number;
  color: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const isMajor = proj.type === "major";
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: isMajor ? `${color}0d` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isMajor ? color + '30' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      {isMajor && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
      )}
      {/* Glow */}
      {isMajor && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0"
          style={{ background: `radial-gradient(ellipse at center, ${color}15, transparent 70%)` }}
        />
      )}
      <div className="relative p-6">
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ background: isMajor ? `linear-gradient(135deg, ${color}44, ${color}22)` : 'rgba(255,255,255,0.05)', border: `1px solid ${color}30` }}
          >
            {isMajor ? (
              <FolderGit2 className="w-4 h-4" style={{ color }} />
            ) : (
              <Code2 className="w-4 h-4 text-white/40" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={isMajor ? { background: `${color}20`, color } : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}
              >
                {isMajor ? "★ Major Project" : "● Mini Project"}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1 leading-snug">{proj.title}</h4>
            <p className="text-xs text-white/35 font-medium">{proj.tech}</p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0 mt-1" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CourseDetail({ params }: PageProps) {
  const { slug } = use(params);
  const course = courses.find((c) => c.slug === slug);
  if (!course) return notFound();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, -120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const accentColor = course.color || "#6366f1";
  const gradientFrom = course.gradientFrom || "#4f46e5";
  const gradientTo = course.gradientTo || "#7c3aed";

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const majorProjects = (course.projects || []).filter((p: any) => p.type === "major");
  const minorProjects = (course.projects || []).filter((p: any) => p.type === "minor");
  const allProjects = [...majorProjects, ...minorProjects];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono-c { font-family: 'Space Mono', monospace; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #080b12; }
        ::-webkit-scrollbar-thumb { background: ${accentColor}44; border-radius: 2px; }
        ::selection { background: ${accentColor}33; color: white; }
      `}</style>

      <div className="min-h-screen overflow-x-hidden" style={{ background: '#080b12' }}>
        <ParticleField color={accentColor} />
        <NoiseOverlay />
        <ScrollProgress color={accentColor} />

        {/* Cursor glow */}
        <div
          className="fixed pointer-events-none z-[50] w-[500px] h-[500px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${accentColor}08, transparent 70%)`,
            left: mousePos.x - 250,
            top: mousePos.y - 250,
            transition: 'left 0.08s, top 0.08s',
          }}
        />

        {/* ── NAV ─────────────────────────────────────────── */}
        <nav className="relative z-40 px-6 md:px-12 py-5 flex items-center justify-between border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-white/30 font-mono-c uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {course.students?.toLocaleString?.() ?? "1.2k"}+ enrolled
            </div>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-6">
          {/* Radial glow behind title */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 60%, ${accentColor}15 0%, transparent 65%)` }}
          />
          {/* Top edge glow */}
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-50"
            style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
          />

          <motion.div
            style={{ y: heroParallax, opacity: heroOpacity }}
            className="relative z-10 text-center max-w-5xl mx-auto pt-24 pb-12"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10 text-xs font-bold uppercase tracking-widest"
              style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}30`, color: accentColor }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
              {course.mode} · Next batch: {course.startDate}
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-display font-black text-6xl md:text-8xl lg:text-[7rem] tracking-tighter leading-[0.88] mb-8"
            >
              <span className="text-white">{course.title.split(" ").slice(0, -1).join(" ")}</span>
              {" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
              >
                {course.title.split(" ").slice(-1)[0]}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              {course.description}
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap justify-center gap-8 mb-12"
            >
              {[
                { label: "Hours", value: course.hours, suffix: "h" },
                { label: "Students", value: course.students || 1200, suffix: "+" },
                { label: "Projects", value: (course.projects || []).length, suffix: "" },
                { label: "Rating", value: Math.round((course.rating || 4.8) * 10), suffix: "/50" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-display font-black text-3xl text-white">
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[10px] text-white/25 uppercase tracking-[0.2em] font-bold mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-14"
            >
              {(course.techStack || []).map((tech: string, i: number) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.06 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="px-4 py-2 rounded-full text-xs font-bold font-mono-c border cursor-default transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.6)'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}50`;
                    (e.currentTarget as HTMLElement).style.color = accentColor;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <a
                href="#curriculum"
                className="inline-flex items-center gap-2 px-8 py-5 rounded-2xl font-bold text-sm text-white/60 transition-all hover:text-white hover:bg-white/5 border border-white/8 hover:border-white/15"
              >
                <BookOpen className="w-4 h-4" />
              
              </a>
            </motion.div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          >
            <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
            <ChevronDown className="w-4 h-4 text-white/20" />
          </motion.div>
        </section>

        {/* ── MAIN GRID ────────────────────────────────────── */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pb-40">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-12 xl:gap-20 items-start">

            {/* ── LEFT COLUMN ────────────────────────────────── */}
            <div className="space-y-28">

              {/* HIGHLIGHTS */}
              <section>
                <SectionLabel icon={<Play className="w-4 h-4" />} label="What You'll Master" color={accentColor} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(course.highlights || []).map((h: string, i: number) => {
                    const ref = useRef(null);
                    const inView = useInView(ref, { once: true });
                    return (
                      <motion.div
                        ref={ref}
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ y: -4 }}
                        className="group flex items-start gap-4 p-5 rounded-2xl transition-all duration-300"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}30`;
                          (e.currentTarget as HTMLElement).style.background = `${accentColor}06`;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                        }}
                      >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${accentColor}20` }}>
                          <CheckCircle2 className="w-3 h-3" style={{ color: accentColor }} />
                        </div>
                        <span className="text-sm text-white/75 leading-relaxed font-medium">{h}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* CURRICULUM */}
              <section id="curriculum">
                <SectionLabel icon={<Layers className="w-4 h-4" />} label="Full Curriculum" color={accentColor} />
                <div className="space-y-3">
                  {(course.syllabus || []).map((mod: any, i: number) => (
                    <ModuleAccordion key={i} module={mod} idx={i} color={accentColor} />
                  ))}
                </div>
              </section>

              {/* PROJECTS */}
              <section>
                <SectionLabel icon={<FolderGit2 className="w-4 h-4" />} label="Real-World Projects" color={accentColor} />
                <div className="mb-5 flex gap-4 text-sm text-white/40">
                  <span className="flex items-center gap-1.5">
                    <span style={{ color: accentColor }}>★</span>
                     Multiple Major projects (portfolio-ready, deployed)
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    ● 10+ Mini projects (concept reinforcement)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allProjects.map((proj: any, i: number) => (
                    <ProjectCard key={i} proj={proj} idx={i} color={accentColor} />
                  ))}
                </div>
              </section>

              {/* CERTIFICATION */}
              <section>
                <SectionLabel icon={<Award className="w-4 h-4" />} label="Certification" color={accentColor} />
                <TiltCard>
                  <div
                    className="relative rounded-3xl overflow-hidden p-10 md:p-16"
                    style={{
                      background: `linear-gradient(135deg, ${gradientFrom}18, ${gradientTo}10, rgba(255,255,255,0.02))`,
                      border: `1px solid ${accentColor}25`,
                    }}
                  >
                    {/* Top glow line */}
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)` }} />
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: accentColor }} />

                    <div className="relative flex flex-col md:flex-row items-center gap-10">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.03, 1] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="w-24 h-24 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl"
                        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`, border: '4px solid rgba(255,255,255,0.15)' }}
                      >
                        <Trophy className="w-10 h-10 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-display font-black text-3xl text-white mb-3">{course.certificate || "Industry Certificate"}</h3>
                        <p className="text-white/50 leading-relaxed text-sm max-w-lg">
                          Complete all modules, quizzes, and projects to earn your verified certificate - recognized by top companies and shareable directly to your LinkedIn profile.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3">
                          {["LinkedIn Shareable", "PDF Download", "Blockchain Verified", "Industry Recognized"].map((tag) => (
                            <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}25` }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </section>

              {/* FAQ */}
              <section>
                <SectionLabel icon={<HelpCircle className="w-4 h-4" />} label="Frequently Asked" color={accentColor} />
                <div className="space-y-3">
                  {(course.faqs || []).map((faq: { question: string; answer: string }, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-2xl overflow-hidden"
                      style={{
                        background: faqOpen === i ? `${accentColor}08` : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${faqOpen === i ? accentColor + '25' : 'rgba(255,255,255,0.05)'}`,
                        transition: 'all 0.3s',
                      }}
                    >
                      <button
                        className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                        onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      >
                        <span className="text-sm font-bold text-white/85">{faq.question}</span>
                        <motion.div animate={{ rotate: faqOpen === i ? 45 : 0 }} transition={{ duration: 0.22 }} className="flex-shrink-0">
                          <Plus className="w-4 h-4 text-white/30" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {faqOpen === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="px-6 pb-5 text-sm text-white/45 leading-relaxed">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── STICKY SIDEBAR ───────────────────────────────── */}
            <aside className="xl:sticky xl:top-8 space-y-5">
              {/* PRICING CARD */}
              <TiltCard>
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #111827, #0d1117)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  {/* Top accent */}
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }} />
                  <div
                    className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
                    style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}
                  />

                  <div className="relative p-8">
                    {/* Discount badge */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                         Limited Seats
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-white/30 font-mono-c">
                        <Timer className="w-3 h-3" />
                        Ends soon
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-end gap-3 mb-1">
                        <span className="font-display font-black text-5xl text-white">
                          {course.price || 699}
                        </span>
                        <span className="text-xl text-white/25 line-through mb-1.5 font-mono-c">
                          
                        </span>
                      </div>
                      <p className="text-xs text-white/30">One-time payment ·426 days access</p>
                    </div>

                    {/* Meta list */}
                    <div className="space-y-3 mb-8">
                      {[
                        { icon: <Clock className="w-4 h-4" />, label: "Duration", val: course.duration || "Self-paced" },
                        { icon: <Globe className="w-4 h-4" />, label: "Mode", val: (course.mode || "Online").split(" ")[0] },
                        { icon: <ShieldCheck className="w-4 h-4" />, label: "Access", val: "426 DAYS" },
                        { icon: <Users className="w-4 h-4" />, label: "Mentorship", val: "1:1 Expert" },
                        { icon: <Award className="w-4 h-4" />, label: "Certificate", val: "Included" },
                        { icon: <Zap className="w-4 h-4" />, label: "Projects", val: `${(course.projects || []).length} Hands-on` },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                          <div className="flex items-center gap-2.5 text-white/40">
                            <span style={{ color: `${accentColor}99` }}>{item.icon}</span>
                            <span className="text-xs font-medium">{item.label}</span>
                          </div>
                          <span className="text-xs font-bold text-white/80">{item.val}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}


                    <p className="text-center text-[10px] text-white/20 font-mono-c uppercase tracking-widest flex items-center justify-center gap-1.5">
                      <Lock className="w-3 h-3" /> 100% Secure · Cashfree
                    </p>
                  </div>
                </motion.div>
              </TiltCard>

              {/* RATINGS CARD */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 }}
                className="rounded-2xl p-6 text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="font-display font-black text-3xl text-white mb-0.5">{course.rating || 4.9}</div>
                <p className="text-xs text-white/30 uppercase tracking-widest font-bold">{(course.students || 1200).toLocaleString()}+ reviews</p>
              </motion.div>

              {/* SUPPORT CARD */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 }}
                className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <p className="text-xs text-white/30 mb-2 font-bold uppercase tracking-widest">Have questions?</p>
                <a
                  href="mailto:support@codenfacts.in"
                  className="text-sm font-bold flex items-center justify-between group"
                  style={{ color: accentColor }}
                >
                  support@codenfacts.in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </aside>
          </div>
        </div>

        {/* ── BOTTOM CTA ─────────────────────────────────── */}
        <section className="relative z-10 px-6 pb-32 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden text-center p-14 md:p-24"
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}10, rgba(255,255,255,0.01))`,
              border: `1px solid ${accentColor}20`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor}10 0%, transparent 60%)` }} />
            <div className="relative">
              <p className="font-mono-c text-xs text-white/25 uppercase tracking-[0.3em] mb-6">Your next move</p>
              <h2 className="font-display font-black text-5xl md:text-7xl text-white tracking-tighter leading-[0.9] mb-6">
                Don't Learn.<br />
                <span style={{ color: accentColor }}>Master.</span>
              </h2>
              <p className="text-white/40 text-base max-w-lg mx-auto mb-10">
                Join thousands who turned their skills into careers. Your portfolio, your certificate, your future-starts here.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/[0.04] px-8 py-10 text-center">
          <div className="font-display text-xl font-black text-white mb-2">
            Code<span style={{ color: accentColor }}>N</span>Facts
          </div>
          <p className="text-white/15 text-[10px] uppercase tracking-[0.4em] font-bold">Built for the Builders of Tomorrow</p>
        </footer>
      </div>
    </>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
function SectionLabel({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      className="flex items-center gap-4 mb-8"
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <h2 className="font-display font-black text-2xl text-white">{label}</h2>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}20, transparent)` }} />
    </motion.div>
  );
}

// ─── LUCIDE IMPORTS USED INLINE (avoid unresolved refs) ───────────────────────
function HelpCircle(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
