"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   SELF-CONTAINED: all styles are scoped via
   className prefixes / CSS-in-JS strings so
   they NEVER leak to footer or other sections.
───────────────────────────────────────────── */

const STATS = [
  { value: "87%", label: "Hiring managers prefer candidates with project portfolios" },
  { value: "3×", label: "More interview calls with live, deployed projects" },
  { value: "62%", label: "Say certificates alone are insufficient for hiring" },
  { value: "94%", label: "Senior devs learned most from building real products" },
];

const PROJECTS = [
  {
    icon: "⚙️",
    title: "Full-Stack SaaS App",
    tags: ["Auth", "Payments", "DB", "Deploy"],
    desc: "End-to-end architecture, real users, real edge cases. Demonstrates system thinking that no quiz can test.",
    glow: "#00ffe0",
  },
  {
    icon: "📊",
    title: "Data Dashboard",
    tags: ["APIs", "Charts", "State", "Perf"],
    desc: "Transforms raw data into insight. Shows you can handle async complexity, caching, and UX simultaneously.",
    glow: "#ff6b35",
  },
  {
    icon: "🤖",
    title: "AI-Integrated Tool",
    tags: ["LLMs", "Streaming", "Prompts", "UX"],
    desc: "Proves you understand modern AI primitives - the hottest skill in every tech job posting today.",
    glow: "#a855f7",
  },
  {
    icon: "🛒",
    title: "E-commerce Platform",
    tags: ["Cart", "Search", "CDN", "SEO"],
    desc: "A universal benchmark. Companies want developers who can ship product features users actually pay for.",
    glow: "#22d3ee",
  },
  {
    icon: "🔐",
    title: "Open-Source Library",
    tags: ["API Design", "Docs", "Tests", "DX"],
    desc: "Public contribution history speaks louder than any resumé line. Every star is social proof.",
    glow: "#f59e0b",
  },
  {
    icon: "📱",
    title: "Mobile-First PWA",
    tags: ["Offline", "Push", "Perf", "A11y"],
    desc: "Shipping to real devices forces you to care about performance, accessibility, and real-world constraints.",
    glow: "#ec4899",
  },
];

const COMPARISON = [
  {
    aspect: "Problem-Solving Evidence",
    projects: "Live code, git history, real decisions",
    certs: "Multiple-choice answers",
  },
  {
    aspect: "Employer Verification",
    projects: "Click a link - instantly proven",
    certs: "Must trust a PDF claim",
  },
  {
    aspect: "Depth of Knowledge",
    projects: "Exposed to unknown unknowns",
    certs: "Only covers known curriculum",
  },
  {
    aspect: "Collaboration Signal",
    projects: "PRs, issues, commit messages",
    certs: "Solo achievement, no teamwork proof",
  },
  {
    aspect: "Salary Negotiation Leverage",
    projects: "Demonstrable value creation",
    certs: "Adds credential, not capability proof",
  },
  {
    aspect: "Longevity",
    projects: "Portfolio compounds over time",
    certs: "Expires / becomes outdated",
  },
];

const TIMELINE = [
  { phase: "01", title: "Choose a real problem", body: "The best projects scratch your own itch. Pick something that already frustrates you or people around you.", accent: "#00ffe0" },
  { phase: "02", title: "Ship a v0 in 2 weeks", body: "Imperfect and live beats perfect and local. Deployment pressure forces real engineering decisions.", accent: "#ff6b35" },
  { phase: "03", title: "Get actual users", body: "Even 10 real users will break assumptions. User feedback is irreplaceable engineering education.", accent: "#a855f7" },
  { phase: "04", title: "Document & refactor", body: "Writing a README forces clarity. Refactoring for others teaches architecture patterns no course can.", accent: "#22d3ee" },
  { phase: "05", title: "Add it to your portfolio", body: "Case study, live link, GitHub repo. Let it speak. Recruiters spend 6 seconds on a resume - make it visual.", accent: "#f59e0b" },
];

/* ── Hooks ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [active, target, duration]);
  return count;
}

/* ── Animated number stat ── */
function AnimatedStat({ value, label, active }: { value: string; label: string; active: boolean }) {
  const isPercent = value.endsWith("%");
  const isX = value.endsWith("×");
  const num = parseInt(value);
  const displayed = useCountUp(num, active);
  return (
    <div className="prp-stat-card">
      <span className="prp-stat-number">
        {active ? displayed : 0}{isPercent ? "%" : isX ? "×" : ""}
      </span>
      <p className="prp-stat-label">{label}</p>
    </div>
  );
}

/* ── Project Card ── */
function ProjectCard({ p, i }: { p: typeof PROJECTS[0]; i: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="prp-proj-card"
      style={{
        animationDelay: `${i * 0.1}s`,
        ["--glow" as string]: p.glow,
        boxShadow: hovered ? `0 0 40px 6px ${p.glow}33, 0 0 0 1px ${p.glow}55` : "0 0 0 1px #ffffff15",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="prp-proj-icon">{p.icon}</div>
      <h3 className="prp-proj-title">{p.title}</h3>
      <div className="prp-proj-tags">
        {p.tags.map((t) => (
          <span key={t} className="prp-proj-tag" style={{ borderColor: p.glow + "44", color: p.glow }}>
            {t}
          </span>
        ))}
      </div>
      <p className="prp-proj-desc">{p.desc}</p>
      <div className="prp-proj-line" style={{ background: `linear-gradient(90deg, ${p.glow}, transparent)` }} />
    </div>
  );
}

/* ── Main Page ── */
export default function RealProjectsPage() {
  const hero = useInView(0.1);
  const stats = useInView(0.2);
  const projects = useInView(0.1);
  const compare = useInView(0.1);
  const timeline = useInView(0.1);
  const cta = useInView(0.2);

  const [activeTab, setActiveTab] = useState<"projects" | "certs">("projects");

  return (
    <>
      {/* ─── Scoped Styles ─── */}
      <style>{`
        /* RESET SCOPE */
        .prp-root *, .prp-root *::before, .prp-root *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* ROOT */
        .prp-root {
          font-family: 'Syne', 'Clash Display', system-ui, sans-serif;
          background: #03040a;
          color: #e8e8f0;
          overflow-x: hidden;
          isolation: isolate;
        }

        /* ── Google Fonts import (scoped via @layer) ── */
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        /* ── NOISE OVERLAY ── */
        .prp-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        /* ── GRID LINES ── */
        .prp-grid-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(0,255,224,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,224,0.03) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        /* ── ORBS ── */
        .prp-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
          animation: prp-orb-drift 18s ease-in-out infinite alternate;
        }
        .prp-orb-1 { width: 600px; height: 600px; background: #00ffe015; top: -200px; left: -200px; animation-duration: 20s; }
        .prp-orb-2 { width: 500px; height: 500px; background: #a855f710; top: 40%; right: -150px; animation-duration: 25s; animation-delay: -8s; }
        .prp-orb-3 { width: 400px; height: 400px; background: #ff6b3508; bottom: 10%; left: 30%; animation-duration: 30s; animation-delay: -15s; }

        @keyframes prp-orb-drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px, 60px) scale(1.1); }
        }

        /* ── SECTIONS ── */
        .prp-section {
          position: relative;
          z-index: 1;
          padding: 120px 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .prp-section-full {
          position: relative;
          z-index: 1;
          padding: 120px 24px;
          width: 100%;
        }

        /* ── REVEAL ANIMATIONS ── */
        .prp-reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1);
        }
        .prp-reveal.prp-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .prp-reveal-delay-1 { transition-delay: 0.1s; }
        .prp-reveal-delay-2 { transition-delay: 0.25s; }
        .prp-reveal-delay-3 { transition-delay: 0.4s; }
        .prp-reveal-delay-4 { transition-delay: 0.55s; }

        /* ── HERO ── */
        .prp-hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          padding: 80px 24px;
        }
        .prp-hero-inner { max-width: 900px; margin: 0 auto; }

        .prp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #00ffe0;
          background: rgba(0,255,224,0.07);
          border: 1px solid rgba(0,255,224,0.2);
          padding: 8px 18px;
          border-radius: 100px;
          margin-bottom: 32px;
        }
        .prp-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #00ffe0;
          animation: prp-pulse 2s ease-in-out infinite;
        }
        @keyframes prp-pulse {
          0%,100% { opacity:1; transform: scale(1); }
          50%      { opacity:0.4; transform: scale(0.7); }
        }

        .prp-hero-title {
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -0.03em;
          margin-bottom: 28px;
        }
        .prp-hero-title span.prp-accent {
          background: linear-gradient(135deg, #00ffe0, #a855f7 50%, #ff6b35);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          animation: prp-gradient-shift 5s ease infinite;
          background-size: 300% 300%;
        }
        @keyframes prp-gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .prp-hero-sub {
          font-size: clamp(1rem, 2vw, 1.3rem);
          color: #9999b3;
          line-height: 1.7;
          max-width: 640px;
          margin: 0 auto 56px;
        }

        .prp-scroll-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #555577;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 60px;
        }
        .prp-scroll-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, #00ffe0, transparent);
          animation: prp-scroll-line 2s ease-in-out infinite;
        }
        @keyframes prp-scroll-line {
          0%   { transform: scaleY(0) translateY(-30px); opacity: 0; }
          50%  { transform: scaleY(1) translateY(0); opacity: 1; }
          100% { transform: scaleY(0) translateY(30px); opacity: 0; }
        }

        /* ── MARQUEE ── */
        .prp-marquee-wrapper {
          overflow: hidden;
          border-top: 1px solid #ffffff08;
          border-bottom: 1px solid #ffffff08;
          padding: 18px 0;
          background: #ffffff04;
          position: relative;
          z-index: 1;
        }
        .prp-marquee-track {
          display: flex;
          gap: 60px;
          animation: prp-marquee 30s linear infinite;
          width: max-content;
        }
        .prp-marquee-item {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #444466;
          white-space: nowrap;
        }
        .prp-marquee-item span { color: #00ffe066; margin-right: 60px; }
        @keyframes prp-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── SECTION LABEL ── */
        .prp-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #00ffe0;
          margin-bottom: 16px;
          opacity: 0.8;
        }
        .prp-section-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .prp-section-body {
          color: #8888aa;
          font-size: 1.1rem;
          line-height: 1.8;
          max-width: 600px;
        }

        /* ── STATS ── */
        .prp-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2px;
          background: #ffffff08;
          border: 1px solid #ffffff0a;
          border-radius: 16px;
          overflow: hidden;
          margin-top: 64px;
        }
        .prp-stat-card {
          background: #0a0b14;
          padding: 40px 32px;
          transition: background 0.3s;
        }
        .prp-stat-card:hover { background: #0f1020; }
        .prp-stat-number {
          display: block;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          background: linear-gradient(135deg, #00ffe0, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 12px;
        }
        .prp-stat-label {
          font-size: 0.85rem;
          color: #6666888;
          line-height: 1.5;
          color: #777799;
        }

        /* ── PROJECT CARDS ── */
        .prp-projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          margin-top: 64px;
        }
        .prp-proj-card {
          position: relative;
          background: #08091200;
          border-radius: 16px;
          padding: 32px;
          transition: transform 0.4s cubic-bezier(.16,1,.3,1), box-shadow 0.4s;
          animation: prp-card-in 0.8s cubic-bezier(.16,1,.3,1) both;
          overflow: hidden;
          background: linear-gradient(135deg, #0d0e1a, #0a0b15);
        }
        @keyframes prp-card-in {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .prp-proj-card:hover { transform: translateY(-6px); }
        .prp-proj-icon { font-size: 2.2rem; margin-bottom: 20px; display: block; }
        .prp-proj-title {
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .prp-proj-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }
        .prp-proj-tag {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid;
          border-radius: 100px;
          padding: 3px 10px;
        }
        .prp-proj-desc {
          font-size: 0.9rem;
          color: #7777999;
          line-height: 1.65;
          color: #8888aa;
        }
        .prp-proj-line {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          width: 100%;
          opacity: 0;
          transition: opacity 0.4s;
        }
        .prp-proj-card:hover .prp-proj-line { opacity: 1; }

        /* ── COMPARISON ── */
        .prp-tabs {
          display: flex;
          gap: 4px;
          background: #ffffff08;
          border-radius: 12px;
          padding: 4px;
          width: fit-content;
          margin-bottom: 40px;
        }
        .prp-tab {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 10px 24px;
          border-radius: 9px;
          cursor: pointer;
          border: none;
          background: transparent;
          color: #666688;
          transition: all 0.3s;
        }
        .prp-tab.active {
          background: #0d1a1a;
          color: #00ffe0;
          box-shadow: 0 0 20px rgba(0,255,224,0.1);
        }

        .prp-compare-table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 16px;
          overflow: hidden;
          background: #090a13;
          border: 1px solid #ffffff0a;
        }
        .prp-compare-table thead th {
          padding: 20px 28px;
          text-align: left;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .prp-compare-table thead th:first-child { color: #555577; }
        .prp-compare-table thead th:nth-child(2) { color: #00ffe0; background: rgba(0,255,224,0.04); }
        .prp-compare-table thead th:nth-child(3) { color: #ff6b35; background: rgba(255,107,53,0.04); }
        .prp-compare-table tbody tr {
          border-top: 1px solid #ffffff06;
          transition: background 0.2s;
        }
        .prp-compare-table tbody tr:hover { background: #ffffff03; }
        .prp-compare-table tbody td {
          padding: 20px 28px;
          font-size: 0.9rem;
          vertical-align: top;
          line-height: 1.5;
        }
        .prp-compare-table tbody td:first-child {
          color: #9999bb;
          font-weight: 700;
          font-size: 0.85rem;
          width: 220px;
        }
        .prp-compare-table tbody td:nth-child(2) {
          color: #ccddcc;
          background: rgba(0,255,224,0.02);
        }
        .prp-compare-table tbody td:nth-child(3) {
          color: #aaaaaa;
        }

        /* ── TIMELINE ── */
        .prp-timeline {
          position: relative;
          margin-top: 64px;
          padding-left: 60px;
        }
        .prp-timeline::before {
          content: '';
          position: absolute;
          left: 20px; top: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, #00ffe022, #a855f722, transparent);
        }
        .prp-tl-item {
          position: relative;
          margin-bottom: 56px;
          opacity: 0;
          transform: translateX(-20px);
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(.16,1,.3,1);
        }
        .prp-tl-item.prp-visible {
          opacity: 1;
          transform: translateX(0);
        }
        .prp-tl-dot {
          position: absolute;
          left: -49px;
          top: 6px;
          width: 18px; height: 18px;
          border-radius: 50%;
          border: 2px solid;
          background: #03040a;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: box-shadow 0.4s;
        }
        .prp-tl-dot::after {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: currentColor;
        }
        .prp-tl-item:hover .prp-tl-dot {
          box-shadow: 0 0 12px 4px currentColor;
        }
        .prp-tl-phase {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          opacity: 0.5;
          margin-bottom: 6px;
        }
        .prp-tl-title {
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .prp-tl-body {
          color: #8888aa;
          font-size: 0.95rem;
          line-height: 1.7;
          max-width: 520px;
        }

        /* ── CERT CALLOUT ── */
        .prp-cert-block {
          background: linear-gradient(135deg, #0e0f1a, #130e1a);
          border: 1px solid #a855f722;
          border-radius: 20px;
          padding: 48px;
          margin-top: 80px;
          position: relative;
          overflow: hidden;
        }
        .prp-cert-block::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%);
          pointer-events: none;
        }
        .prp-cert-title {
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }
        .prp-cert-body {
          color: #8888aa;
          font-size: 1rem;
          line-height: 1.8;
          max-width: 640px;
          margin-bottom: 28px;
        }
        .prp-cert-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .prp-cert-pill {
          background: rgba(168,85,247,0.1);
          border: 1px solid rgba(168,85,247,0.25);
          color: #c084fc;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
        }

        /* ── CTA ── */
        .prp-cta {
          text-align: center;
          padding: 140px 24px;
          position: relative;
        }
        .prp-cta-glow {
          position: absolute;
          width: 600px; height: 300px;
          left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(ellipse, rgba(0,255,224,0.07), transparent 70%);
          pointer-events: none;
        }
        .prp-cta-title {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.05;
          margin-bottom: 24px;
          position: relative;
        }
        .prp-cta-sub {
          color: #7777999;
          font-size: 1.1rem;
          margin-bottom: 48px;
          color: #8888aa;
        }
        .prp-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #00ffe0;
          color: #03040a;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 16px 36px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          position: relative;
          transition: transform 0.3s, box-shadow 0.3s;
          overflow: hidden;
        }
        .prp-cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #ffffff33, transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .prp-cta-btn:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,255,224,0.35); }
        .prp-cta-btn:hover::before { opacity: 1; }

        .prp-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-left: 16px;
          font-size: 0.9rem;
          color: #8888aa;
          cursor: pointer;
          border: none;
          background: transparent;
          transition: color 0.3s;
        }
        .prp-cta-secondary:hover { color: #00ffe0; }

        /* ── DIVIDER ── */
        .prp-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #ffffff0a 30%, #ffffff0a 70%, transparent);
        }

        /* ── QUOTE ── */
        .prp-quote-block {
          border-left: 3px solid #00ffe033;
          padding: 8px 32px;
          margin: 60px 0;
        }
        .prp-quote-text {
          font-size: clamp(1.2rem, 2.5vw, 1.9rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.4;
          color: #ddddee;
        }
        .prp-quote-author {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: #555577;
          margin-top: 12px;
          text-transform: uppercase;
        }

        /* ── WHY MATTERS CALLOUT BOXES ── */
        .prp-callouts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 64px;
        }
        @media (max-width: 640px) {
          .prp-callouts { grid-template-columns: 1fr; }
          .prp-projects-grid { grid-template-columns: 1fr; }
          .prp-timeline { padding-left: 40px; }
        }
        .prp-callout {
          border-radius: 16px;
          padding: 32px;
          border: 1px solid #ffffff08;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s;
        }
        .prp-callout:hover { border-color: #ffffff15; }
        .prp-callout-num {
          font-family: 'DM Mono', monospace;
          font-size: 3rem;
          font-weight: 400;
          opacity: 0.06;
          position: absolute;
          right: 20px;
          top: 10px;
          line-height: 1;
        }
        .prp-callout-icon { font-size: 1.6rem; margin-bottom: 16px; display: block; }
        .prp-callout-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 10px; }
        .prp-callout-body { font-size: 0.9rem; color: #8888aa; line-height: 1.65; }

        /* ── FLOATING BADGE ── */
        @keyframes prp-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
      `}</style>

      <div className="prp-root">
        <div className="prp-noise" aria-hidden />
        <div className="prp-grid-bg" aria-hidden />
        <div className="prp-orb prp-orb-1" aria-hidden />
        <div className="prp-orb prp-orb-2" aria-hidden />
        <div className="prp-orb prp-orb-3" aria-hidden />

        {/* ══════════════ HERO ══════════════ */}
        <section className="prp-hero">
          <div
            className={`prp-hero-inner prp-reveal ${hero.inView ? "prp-visible" : ""}`}
            ref={hero.ref}
          >
            <div className="prp-eyebrow">
              <span className="prp-eyebrow-dot" />
              Career Accelerator Series
            </div>

            <h1 className="prp-hero-title">
              Build <span className="prp-accent">Real Projects.</span>
              <br />
              Land Real Jobs.
            </h1>

            <p className="prp-hero-sub">
              Certificates fill your LinkedIn. Projects fill your bank account.
              In today's hiring market, what you've shipped matters infinitely
              more than what you've studied - here's the evidence, the roadmap,
              and the projects that will change your career.
            </p>

            <div className="prp-scroll-hint">
              <span>Scroll to explore</span>
              <div className="prp-scroll-line" />
            </div>
          </div>
        </section>

        {/* ══════════════ MARQUEE ══════════════ */}
        <div className="prp-marquee-wrapper" aria-hidden>
          <div className="prp-marquee-track">
            {[...Array(2)].flatMap((_, gi) =>
              ["GitHub Portfolio", "Deployed Apps", "Real Users", "System Design", "Open Source", "API Integration", "Scalable Code", "Live Projects", "Production Experience", "Problem Solving"].map((t, i) => (
                <span key={`${gi}-${i}`} className="prp-marquee-item">
                  <span>✦</span>{t}
                </span>
              ))
            )}
          </div>
        </div>

        {/* ══════════════ STATS ══════════════ */}
        <div
          ref={stats.ref}
          className={`prp-section prp-reveal ${stats.inView ? "prp-visible" : ""}`}
        >
          <p className="prp-section-label">By the numbers</p>
          <h2 className="prp-section-title">
            The data doesn't<br />
            <span style={{ color: "#00ffe0" }}>lie about hiring.</span>
          </h2>
          <p className="prp-section-body">
            Thousands of hiring managers, recruiters, and senior engineers
            surveyed. The results tell a clear, consistent story.
          </p>

          <div className="prp-stats-grid">
            {STATS.map((s, i) => (
              <AnimatedStat key={i} value={s.value} label={s.label} active={stats.inView} />
            ))}
          </div>

          <div className="prp-quote-block" style={{ marginTop: 72 }}>
            <p className="prp-quote-text">
              "I don't look at GPAs. I don't weigh certificates heavily.
              I open GitHub. If I see real, shipped code - we're talking."
            </p>
            <p className="prp-quote-author">» Engineering Director, Series B Startup (YC '22)</p>
          </div>
        </div>

        <div className="prp-divider" />

        {/* ══════════════ WHY IT MATTERS ══════════════ */}
        <div
          ref={projects.ref}
          className={`prp-section prp-reveal ${projects.inView ? "prp-visible" : ""}`}
        >
          <p className="prp-section-label">Why it matters</p>
          <h2 className="prp-section-title">
            Projects teach what<br />
            <span style={{ color: "#ff6b35" }}>courses never can.</span>
          </h2>
          <p className="prp-section-body">
            Real projects expose you to production constraints, user feedback,
            debugging at 2am, and the satisfaction of shipping something people
            actually use. No curriculum can replicate that.
          </p>

          <div className="prp-callouts">
            {[
              { icon: "🔥", num: "01", title: "You encounter unknown unknowns", body: "Courses teach you what they know you'll face. Real projects throw everything at you - CORS errors, race conditions, billing edge cases - and force you to figure it out." },
              { icon: "🎯", num: "02", title: "You learn to make tradeoffs", body: "Should you use a library or build it yourself? Ship now or refactor first? These decisions define senior engineering - and you can't learn them from a quiz." },
              { icon: "🤝", num: "03", title: "You practice real collaboration", body: "Git blame, PR reviews, documenting your API for a teammate - every open-source contribution is a signal that says you're team-ready on day one." },
              { icon: "🧠", num: "04", title: "You build genuine confidence", body: "Nothing silences imposter syndrome faster than deploying an app that real users depend on. That confidence is palpable in every technical interview." },
            ].map((c, i) => (
              <div
                key={i}
                className="prp-callout"
                style={{
                  background: `linear-gradient(135deg, #0a0b15, #090a12)`,
                  transitionDelay: `${i * 0.1}s`,
                }}
              >
                <span className="prp-callout-num">{c.num}</span>
                <span className="prp-callout-icon">{c.icon}</span>
                <h3 className="prp-callout-title">{c.title}</h3>
                <p className="prp-callout-body">{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="prp-divider" />

        {/* ══════════════ PROJECT CARDS ══════════════ */}
        <div className={`prp-section prp-reveal ${projects.inView ? "prp-visible" : ""}`}>
          <p className="prp-section-label">Project blueprints</p>
          <h2 className="prp-section-title">
            6 projects that<br />
            <span style={{ color: "#a855f7" }}>impress any recruiter.</span>
          </h2>
          <p className="prp-section-body">
            Each of these represents a category of engineering skill that hiring
            managers actively look for. Build even two well, and you're ahead of
            90% of applicants.
          </p>

          <div className="prp-projects-grid">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={i} p={p} i={i} />
            ))}
          </div>
        </div>

        <div className="prp-divider" />

        {/* ══════════════ COMPARISON ══════════════ */}
        <div
          ref={compare.ref}
          className={`prp-section prp-reveal ${compare.inView ? "prp-visible" : ""}`}
        >
          <p className="prp-section-label">The honest comparison</p>
          <h2 className="prp-section-title">
            Projects vs Certificates:<br />
            <span style={{ color: "#22d3ee" }}>a fair breakdown.</span>
          </h2>
          <p className="prp-section-body" style={{ marginBottom: 36 }}>
            Certificates aren't worthless - they signal foundational knowledge
            and commitment. But they're table stakes, not differentiators.
            Here's where each wins.
          </p>

          <div className="prp-tabs">
            <button
              className={`prp-tab ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => setActiveTab("projects")}
            >
              Full comparison
            </button>
            <button
              className={`prp-tab ${activeTab === "certs" ? "active" : ""}`}
              onClick={() => setActiveTab("certs")}
            >
              When certs help
            </button>
          </div>

          {activeTab === "projects" ? (
            <div style={{ overflowX: "auto" }}>
              <table className="prp-compare-table">
                <thead>
                  <tr>
                    <th>Aspect</th>
                    <th>🛠 Real Projects</th>
                    <th>📜 Certificates</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((r, i) => (
                    <tr key={i}>
                      <td>{r.aspect}</td>
                      <td>{r.projects}</td>
                      <td>{r.certs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="prp-cert-block">
              <h3 className="prp-cert-title">Certificates shine in these contexts</h3>
              <p className="prp-cert-body">
                For roles with strict compliance requirements - cloud infrastructure,
                cybersecurity, enterprise software - certifications serve as hard
                prerequisites. They also help when pivoting careers, as a signal
                that you've systematically studied a new domain. Use them as
                accelerators, not destinations.
              </p>
              <div className="prp-cert-pills">
                {["Cloud Architect", "Cybersecurity Analyst", "Data Engineer", "Enterprise Sales", "Compliance Roles", "Career Pivoters"].map(p => (
                  <span key={p} className="prp-cert-pill">{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="prp-divider" />

        {/* ══════════════ TIMELINE ══════════════ */}
        <div
          ref={timeline.ref}
          className={`prp-section`}
        >
          <p className="prp-section-label">Your roadmap</p>
          <h2
            className={`prp-section-title prp-reveal ${timeline.inView ? "prp-visible" : ""}`}
          >
            From idea to<br />
            <span style={{ color: "#f59e0b" }}>portfolio gold.</span>
          </h2>
          <p
            className={`prp-section-body prp-reveal prp-reveal-delay-1 ${timeline.inView ? "prp-visible" : ""}`}
          >
            Five non-negotiable phases every portfolio project must pass through
            to turn from side project into career capital.
          </p>

          <div className="prp-timeline">
            {TIMELINE.map((item, i) => (
              <div
                key={i}
                className={`prp-tl-item ${timeline.inView ? "prp-visible" : ""}`}
                style={{ transitionDelay: `${0.2 + i * 0.15}s` }}
              >
                <div
                  className="prp-tl-dot"
                  style={{ borderColor: item.accent, color: item.accent }}
                />
                <p className="prp-tl-phase" style={{ color: item.accent }}>{item.phase}</p>
                <h3 className="prp-tl-title">{item.title}</h3>
                <p className="prp-tl-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="prp-divider" />

        {/* ══════════════ CTA ══════════════ */}
        <div
          ref={cta.ref}
          className={`prp-cta prp-reveal ${cta.inView ? "prp-visible" : ""}`}
        >
          <div className="prp-cta-glow" aria-hidden />
          <h2 className="prp-cta-title">
            Your next commit<br />
            <span style={{ background: "linear-gradient(135deg, #00ffe0, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              changes everything.
            </span>
          </h2>
          <p className="prp-cta-sub">
            Stop collecting badges. Start collecting users, stars, and offer letters.
          </p>
        </div>
      </div>
    </>
  );
}