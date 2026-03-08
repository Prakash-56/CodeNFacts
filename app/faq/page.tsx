"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, MotionValue } from "framer-motion";
import {
  Plus, Minus, Rocket, Search, MessageCircle,
  BookOpen, ShieldCheck, Zap, HelpCircle,
  Globe, CreditCard, Users, Star, ArrowRight,
  Sparkles, Trophy, Brain, Code2, Layers, Heart,
  ChevronRight, Mail, Phone, Clock, Check
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Academic" | "Technical" | "Career" | "Financial";
  popular?: boolean;
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const faqData: FAQItem[] = [
  {
    category: "General",
    question: "How long do I have access to the course materials?",
    answer: "Once enrolled, you have 426 days access to the specific version of the course you purchased. This includes all future updates to that version and access to the student community forums. We're committed to keeping content fresh - students enrolled today will receive our next major curriculum refresh at zero additional cost.",
    popular: true,
  },
  {
    category: "Academic",
    question: "Can I get a certificate of completion?",
    answer: "Absolutely. After finishing all modules and passing the final capstone project with a score of 70% or higher, a verified digital certificate is auto-generated in your profile. Our certificates are recognized by 2,400+ companies globally and can be shared directly to LinkedIn with one click.",
    popular: true,
  },
  {
    category: "Technical",
    question: "What happens if I encounter a bug in the practice labs?",
    answer: "Our technical team monitors the labs 24/7. You can report a bug directly via the 'Apply For Issue' button in the Home section. We triage all reports within 30 minutes and usually provide a fix or workaround within 4 hours. Critical blockers are escalated immediately to our senior engineering team.",
  },
  {
    category: "Career",
    question: "Are there internship opportunities available?",
    answer: "Applications open quarterly and our Career Success team provides white-glove support throughout the entire placement process.",
  },
  {
    category: "Financial",
    question: "Do you offer a refund policy?",
    answer: "If you feel the course isn't the right fit for your learning style, simply email support for a full reversal - no hoops, no guilt. We believe our product sells itself, so we make it risk-free to find out. For beter know u can visit the Refund Policy Link below..",
    popular: true,
  },
  {
    category: "Academic",
    question: "Can I skip modules if I already know the basics?",
    answer: "While we recommend following the curated learning path, you can take 'Placement Tests' at the start of each module. If you score above 90%, the module is instantly marked complete and you advance. This keeps advanced learners engaged without sacrificing depth.",
  },
  {
    category: "Technical",
    question: "Is there a mobile app for offline learning?",
    answer: "Currently we have no, we are working on it for ur better use.",
  },
  {
    category: "Career",
    question: "Do you provide resume building and LinkedIn optimization?",
    answer: "Every student gets access to our AI-powered Resume Builder, tailored to your chosen tech stack and target roles. You also get a dedicated 1-on-1 session with a career coach who has placed hundreds of students at top companies. We don't just teach - we launch careers.",
  },
  {
    category: "General",
    question: "Is the community forum moderated?",
    answer: "Yes, a dedicated team of teaching assistants and moderators maintain the environment around the clock. We also use AI-assisted moderation to catch spam instantly. The result is one of the highest signal-to-noise communities in online education, with 95% of questions answered within 2 hours.",
  },
  {
    category: "Financial",
    question: "Are there any student discounts or scholarships?",
    answer: "We offer a 'Future Leaders' scholarship for students from underrepresented backgrounds - covering up to 100% of course fees. There's also a 20% discount for currently enrolled university students and a 15% alumni referral discount. Education should be accessible to everyone who is ready to commit.",
  },
  {
    category: "Technical",
    question: "What tech stack do the courses use?",
    answer: "Our curriculum is built around industry-current technologies: React, TypeScript, Node.js, Python, PostgreSQL, Docker, and cloud platforms like AWS and GCP. We update our stack every quarter based on hiring data from our partner companies, so you're always learning what's actually in demand.",
  },
  {
    category: "Academic",
    question: "How are projects graded and reviewed?",
    answer: "Projects are reviewed by a combination of our AI grading system for objective metrics and human reviewers - experienced engineers with 5+ years of industry experience - for qualitative feedback. You receive a detailed rubric scorecard and written commentary within 48 hours of submission.",
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const categoryMeta = {
  General: { icon: BookOpen, color: "#3B82F6", bg: "from-blue-500/20 to-blue-600/5" },
  Academic: { icon: Brain, color: "#8B5CF6", bg: "from-violet-500/20 to-violet-600/5" },
  Technical: { icon: Code2, color: "#06B6D4", bg: "from-cyan-500/20 to-cyan-600/5" },
  Career: { icon: Rocket, color: "#F59E0B", bg: "from-amber-500/20 to-amber-600/5" },
  Financial: { icon: CreditCard, color: "#10B981", bg: "from-emerald-500/20 to-emerald-600/5" },
};

// ─── NOISE TEXTURE SVG ───────────────────────────────────────────────────────
const NoiseSVG = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

// ─── FLOATING PARTICLE ───────────────────────────────────────────────────────
const FloatingParticle = ({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-blue-400/20 pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.1, 0.4, 0.1],
      scale: [1, 1.3, 1],
    }}
    transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

// ─── AURORA ORBS ─────────────────────────────────────────────────────────────
const AuroraBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <NoiseSVG />
    <motion.div
      animate={{ x: [0, 80, 0], y: [0, -60, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-[20%] -left-[10%] h-[60%] w-[50%] rounded-full bg-blue-700/12 blur-[140px]"
    />
    <motion.div
      animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1, 1.15, 1] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      className="absolute top-[30%] -right-[15%] h-[50%] w-[45%] rounded-full bg-indigo-700/12 blur-[140px]"
    />
    <motion.div
      animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      className="absolute bottom-[10%] left-[30%] h-[40%] w-[35%] rounded-full bg-violet-700/8 blur-[120px]"
    />
    {/* Subtle grid overlay */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }}
    />
  </div>
);

// ─── HORIZONTAL SCROLL TICKER ─────────────────────────────────────────────────
const Ticker = () => {
  const items = ["426 days Access", "50k+ Students", "Career Support", "Live Mentors", "Offline Access", "Verified Certs"];
  return (
    <div className="relative overflow-hidden py-4 border-y border-white/5 my-20">
      <div className="flex gap-12 animate-[ticker_25s_linear_infinite]">
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-3 whitespace-nowrap text-slate-500 text-sm font-medium tracking-widest uppercase shrink-0">
            <span className="text-blue-500">✦</span> {item}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── STAT CARD ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, delay }: { label: string; value: string; icon: React.ReactNode; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-8 text-center backdrop-blur-sm hover:border-white/15 transition-all duration-500 hover:bg-white/6"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="text-blue-400/80 mb-5 flex justify-center group-hover:scale-110 transition-transform duration-500">{icon}</div>
        <div className="text-4xl font-black text-white mb-2 tracking-tight">{value}</div>
        <div className="text-slate-500 text-xs uppercase tracking-[0.2em]">{label}</div>
      </div>
    </motion.div>
  );
};

// ─── FAQ CARD ─────────────────────────────────────────────────────────────────
const FAQCard = ({ item, isOpen, onClick, index }: { item: FAQItem; isOpen: boolean; onClick: () => void; index: number }) => {
  const meta = categoryMeta[item.category];
  const Icon = meta.icon;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
        isOpen
          ? "border-white/20 bg-white/6 shadow-[0_0_40px_rgba(59,130,246,0.12)]"
          : "border-white/6 bg-white/2 hover:bg-white/5 hover:border-white/12"
      }`}
    >
      {/* Gradient shine on open */}
      {isOpen && (
        <motion.div
          layoutId="faq-shine"
          className={`absolute inset-0 bg-gradient-to-br ${meta.bg} opacity-40 pointer-events-none`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
        />
      )}

      {/* Left accent bar */}
      <motion.div
        className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full"
        style={{ background: meta.color }}
        animate={{ scaleY: isOpen ? 1 : 0.3, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <button onClick={onClick} className="relative flex w-full items-center justify-between gap-4 px-8 py-7 text-left">
        <div className="flex items-center gap-5">
          <motion.div
            animate={{
              background: isOpen ? `${meta.color}25` : "rgba(255,255,255,0.04)",
              boxShadow: isOpen ? `0 0 20px ${meta.color}40` : "none",
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-500"
          >
            <Icon size={20} style={{ color: isOpen ? meta.color : "#64748b" }} />
          </motion.div>

          <div>
            {item.popular && (
              <div className="mb-1 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.18em] text-amber-400/80">
                <Sparkles size={8} /> Popular
              </div>
            )}
            <span className={`text-base font-semibold leading-snug transition-colors duration-300 ${isOpen ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
              {item.question}
            </span>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            isOpen ? "border-white/20 bg-white/10 text-white" : "border-white/6 text-slate-600"
          }`}
        >
          <Plus size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="relative overflow-hidden"
          >
            <div className="border-t border-white/5 px-8 pb-8 pt-6">
              <p className="text-slate-400 leading-relaxed text-[15px]">{item.answer}</p>
              <div className="mt-8 flex items-center justify-between">
                <motion.span
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border"
                  style={{ color: meta.color, borderColor: `${meta.color}30`, background: `${meta.color}10` }}
                >
                  <Icon size={10} /> {item.category}
                </motion.span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600">Helpful?</span>
                  {[ThumbIcon(true), ThumbIcon(false)].map((el, i) => (
                    <motion.button key={i} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="text-slate-600 hover:text-slate-300 transition-colors">
                      {el}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ThumbIcon = (up: boolean) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: up ? "none" : "rotate(180deg)" }}>
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);

// ─── CONTACT CARD ─────────────────────────────────────────────────────────────
const ContactCard = ({ icon, title, sub, action }: { icon: React.ReactNode; title: string; sub: string; action: string }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="group flex flex-col items-start gap-4 rounded-3xl border border-white/8 bg-white/3 p-8 backdrop-blur-sm hover:border-white/15 hover:bg-white/5 transition-colors duration-300 cursor-pointer"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/15 text-blue-400 group-hover:bg-blue-600/25 transition-colors duration-300">
      {icon}
    </div>
    <div>
      <p className="font-semibold text-white text-lg mb-1">{title}</p>
      <p className="text-slate-500 text-sm">{sub}</p>
    </div>
    <span className="mt-auto text-blue-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
      {action} <ChevronRight size={14} />
    </span>
  </motion.div>
);

// ─── SCROLL PROGRESS BAR ─────────────────────────────────────────────────────
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 z-50 origin-left" style={{ scaleX }} />;
};

// ─── TESTIMONIAL CARD ────────────────────────────────────────────────────────
const testimonials = [
  { name: "Aisha Rahman", role: "Frontend Engineer @ Stripe", avatar: "AR", text: "The FAQ page alone sold me. But the course? It genuinely changed my career trajectory in 90 days.", stars: 5 },
  { name: "Marcus Chen", role: "Full-Stack Dev @ Shopify", avatar: "MC", text: "I had so many questions before enrolling. Every single one was answered before I even finished reading. Incredible.", stars: 5 },
  { name: "Priya Nair", role: "CS Student @ NTU", avatar: "PN", text: "The scholarship program is real. Got 80% off. The mentors here are the most responsive I've ever worked with.", stars: 5 },
];

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const categories = ["All", "General", "Academic", "Technical", "Career", "Financial"];

  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory = filter === "All" || item.category === filter;
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchQuery]);

  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 4,
    })), []);

  return (
    <>
      {/* Ticker keyframes + font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-33.33%) } }
        .font-serif-display { font-family: 'Instrument Serif', Georgia, serif; }
        .font-sans-dm { font-family: 'DM Sans', sans-serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen bg-[#070710] text-slate-200 selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
        <ScrollProgress />
        <AuroraBackground />

        {/* Floating particles */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {particles.map((p) => <FloatingParticle key={p.id} x={p.x} y={p.y} size={p.size} delay={p.delay} />)}
        </div>

        <div className="relative z-10">

          {/* ── HERO ──────────────────────────────────────────────────────── */}
          <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12 overflow-hidden">
            <motion.div style={{ y: heroY, opacity: heroOpacity }} className="text-center max-w-5xl mx-auto">

              {/* Eyebrow pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-blue-500/20 bg-blue-500/8 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400"
              >
                <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                  <Sparkles size={12} />
                </motion.span>
                Help & Support Center
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif-display mb-6 text-6xl md:text-8xl lg:text-9xl font-normal tracking-tight text-white leading-[0.9]"
              >
                Got{" "}
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-violet-300 to-cyan-300">
                  Questions?
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="mb-14 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
              >
                Everything you need to know before you start - and everything you'll wonder once you do. Search, filter, explore.
              </motion.p>

              {/* Search bar */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="relative mx-auto max-w-2xl"
              >
                <motion.div
                  animate={{ opacity: searchFocused ? 1 : 0, scale: searchFocused ? 1 : 0.95 }}
                  className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 blur-sm"
                />
                <div className="relative flex items-center">
                  <Search className="absolute left-5 text-slate-500 z-10 pointer-events-none" size={20} />
                  <input
                    type="text"
                    placeholder="Search your question..."
                    className="relative w-full rounded-2xl border border-white/10 bg-[#0e0e1a] py-5 pl-14 pr-24 text-base text-white placeholder:text-slate-600 outline-none transition-all focus:border-transparent"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/8 px-3 py-1.5">
                    <kbd className="text-[10px] text-slate-500 font-mono">⌘</kbd>
                    <kbd className="text-[10px] text-slate-500 font-mono">K</kbd>
                  </div>
                </div>
              </motion.div>

              {/* Quick stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500"
              >
                {[["✓ ", "Major Projects"], ["✓ ", "426 days access"], ["✓ ", "50k+ students"], ["✓ ", "Instant certificates"]].map(([icon, text], i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="text-blue-400 text-xs">{icon}</span>
                    {text}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
            >
              <div className="h-8 w-px bg-gradient-to-b from-transparent to-slate-600" />
              <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            </motion.div>
          </section>

          {/* ── TICKER ────────────────────────────────────────────────────── */}
          <Ticker />

          {/* ── FILTER + FAQ ──────────────────────────────────────────────── */}
          <section className="mx-auto max-w-4xl px-4 pb-24">

            {/* Category filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 flex flex-wrap justify-center gap-2.5"
            >
              {categories.map((cat) => {
                const meta = cat !== "All" ? categoryMeta[cat as keyof typeof categoryMeta] : null;
                return (
                  <motion.button
                    key={cat}
                    onClick={() => { setFilter(cat); setOpenIndex(null); }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      filter === cat
                        ? "text-white"
                        : "bg-white/4 text-slate-400 hover:text-white border border-white/6 hover:border-white/12"
                    }`}
                  >
                    {filter === cat && (
                      <motion.div
                        layoutId="filter-bg"
                        className="absolute inset-0 rounded-xl"
                        style={{ background: meta ? `${meta.color}30` : "rgba(59,130,246,0.25)", border: `1px solid ${meta ? meta.color + "40" : "rgba(59,130,246,0.4)"}` }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative">{cat}</span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* FAQ list */}
            <motion.div layout className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <FAQCard
                      key={faq.question}
                      item={faq}
                      isOpen={openIndex === index}
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      index={index}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-24 text-center"
                  >
                    <Search size={40} className="mx-auto mb-5 text-slate-700" />
                    <p className="text-slate-400 text-lg">No results for <span className="text-white font-semibold">"{searchQuery}"</span></p>
                    <p className="text-slate-600 text-sm mt-2">Try adjusting your search or browse by category.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </section>

          {/* ── STATS ─────────────────────────────────────────────────────── */}
          <section className="mx-auto max-w-5xl px-4 pb-32">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-xs uppercase tracking-[0.25em] text-slate-600 mb-10">
              Trusted by learners worldwide
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <StatCard label="Active Students" value="50k+" icon={<Users size={26} />} delay={0} />
              <StatCard label="Course Completion Rate" value="94%" icon={<Trophy size={26} />} delay={0.1} />
              <StatCard label="Countries Reached" value="120+" icon={<Globe size={26} />} delay={0.2} />
            </div>
          </section>

          {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
          <section className="mx-auto max-w-6xl px-4 pb-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="font-serif-display text-4xl md:text-5xl text-white mb-4">
                From our <span className="italic text-slate-400">students</span>
              </h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">Real feedback. Zero incentivized reviews.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  className="relative overflow-hidden rounded-3xl border border-white/6 bg-white/2 p-8 backdrop-blur-sm"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[60px] pointer-events-none" />
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-8">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-xs font-bold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{t.name}</p>
                      <p className="text-slate-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── CONTACT METHODS ───────────────────────────────────────────── */}
          <section className="mx-auto max-w-5xl px-4 pb-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="font-serif-display text-4xl md:text-5xl text-white mb-4">
                Still need <span className="italic text-slate-400">help?</span>
              </h2>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">Our support team is real humans who genuinely want to help.</p>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-5">
              <ContactCard icon={<Mail size={22} />} title="Email Support" sub="Usually responds within 2 hrs" action="Send a message" />
              <ContactCard icon={<MessageCircle size={22} />} title="Live Chat" sub="Available Mon-Fri, 9am-8pm" action="Start chatting" />
              <ContactCard icon={<Clock size={22} />} title="Office Hours" sub="Book a slot with a mentor" action="Reserve time" />
            </div>
          </section>

          {/* ── CTA ───────────────────────────────────────────────────────── */}
          <section className="mx-auto max-w-5xl px-4 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[3rem] border border-white/8 bg-[#0d0d1a] p-1"
            >
              {/* Animated border gradient */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-[2px] rounded-[3rem] bg-[conic-gradient(from_0deg,#3b82f6,#8b5cf6,#06b6d4,#3b82f6)] opacity-20 blur-sm pointer-events-none"
              />

              <div className="relative rounded-[2.8rem] bg-[#070710] px-8 py-24 text-center overflow-hidden">
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />

                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/15 text-blue-400 border border-blue-500/20"
                >
                  <Rocket size={28} />
                </motion.div>

                <h2 className="font-serif-display mb-6 text-5xl md:text-6xl font-normal text-white tracking-tight max-w-3xl mx-auto leading-tight">
                  Ready to find your{" "}
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-300">
                    spark?
                  </span>
                </h2>

                <p className="mb-12 text-lg leading-relaxed text-slate-400 max-w-2xl mx-auto">
                  Every expert was once a beginner with questions. Join 50,000 students who stopped wondering and started building.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(59,130,246,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    className="group flex items-center gap-3 rounded-2xl bg-blue-600 px-10 py-5 font-semibold text-white text-base transition-colors hover:bg-blue-500"
                  >
                    Keep Coding, Keep Creating ..
                  </motion.button>
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
                  {["Better Mentorship", "426 days Access", "5+ Major Projects"].map((item, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <Check size={11} className="text-blue-500" /> {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          {/* ── FOOTER ────────────────────────────────────────────────────── */}
          <footer className="border-t border-white/5 px-4 py-12 text-center">
            <p className="text-slate-700 text-sm">
              Built with care · Questions are the seeds of expertise ·
            </p>
          </footer>

        </div>
      </div>
    </>
  );
}