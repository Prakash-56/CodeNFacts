"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Floating particles canvas
───────────────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 80;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129,140,248,${p.alpha})`;
        ctx.fill();
      });

      // draw faint connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55 }}
    />
  );
}

/* ─────────────────────────────────────────────
   Typewriter effect hook
───────────────────────────────────────────── */
function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setDisplay(current.slice(0, charIdx + 1));
          if (charIdx + 1 === current.length) {
            setTimeout(() => setDeleting(true), pause);
          } else {
            setCharIdx((c) => c + 1);
          }
        } else {
          setDisplay(current.slice(0, charIdx - 1));
          if (charIdx === 0) {
            setDeleting(false);
            setWordIdx((w) => (w + 1) % words.length);
          } else {
            setCharIdx((c) => c - 1);
          }
        }
      },
      deleting ? speed / 2 : speed
    );
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

/* ─────────────────────────────────────────────
   Animated counter
───────────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = target / 60;
        const tick = () => {
          start += step;
          if (start >= target) { setVal(target); return; }
          setVal(Math.floor(start));
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   Shimmer badge
───────────────────────────────────────────── */
function ShimmerBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
      style={{
        border: "1px solid rgba(129,140,248,0.35)",
        background: "rgba(99,102,241,0.08)",
        color: "#a5b4fc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(129,140,248,0.18) 50%, transparent 100%)",
          animation: "shimmer 2.4s linear infinite",
          backgroundSize: "200% 100%",
        }}
      />
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Glowing CTA button
───────────────────────────────────────────── */
function GlowButton({
  children,
  primary,
  href = "#",
}: {
  children: React.ReactNode;
  primary?: boolean;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="hero-btn"
      data-primary={primary ? "true" : undefined}
    >
      {children}
    </a>
  );
}

/* ─────────────────────────────────────────────
   Floating code snippet card
───────────────────────────────────────────── */
function CodeCard({
  style,
  lines,
  delay,
}: {
  style?: React.CSSProperties;
  lines: { text: string; color: string }[];
  delay: number;
}) {
  return (
    <div
      className="code-card"
      style={{
        animationDelay: `${delay}ms`,
        ...style,
      }}
    >
      <div className="code-card-dots">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ background: c }} />
        ))}
      </div>
      <pre className="code-card-pre">
        {lines.map((l, i) => (
          <span key={i} style={{ color: l.color }}>
            {l.text}
            {"\n"}
          </span>
        ))}
      </pre>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Fact pill that floats in
───────────────────────────────────────────── */
function FactPill({
  text,
  style,
  delay,
}: {
  text: string;
  style?: React.CSSProperties;
  delay: number;
}) {
  return (
    <div
      className="fact-pill"
      style={{ animationDelay: `${delay}ms`, ...style }}
    >
      <span className="fact-pill-icon">💡</span>
      <span>{text}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN HERO
───────────────────────────────────────────── */
export default function Hero() {
  const typed = useTypewriter(
    ["Developers", "Learners", "Creators", "Builders", "Explorers"],
    75,
    2000
  );

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMousePos({ x: e.clientX - cx, y: e.clientY - cy });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <>
      {/* ── scoped styles ── */}
      <style>{`
        /* Shimmer keyframe */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Float up-down */
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-18px) rotate(var(--rot, 0deg)); }
        }

        /* Slide-in from left / right */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* Fade up stagger */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Glow pulse on badge dot */
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(129,140,248,0.6); }
          50% { box-shadow: 0 0 0 6px rgba(129,140,248,0); }
        }

        /* Hero section isolates its own stacking */
        .hero-root {
          position: relative;
          isolation: isolate;
          width: 100%;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 6rem 1.5rem 4rem;
          box-sizing: border-box;
        }

        /* Noise grain overlay */
        .hero-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.35;
          z-index: 0;
        }

        /* Spotlight that follows mouse */
        .hero-spotlight {
          position: absolute;
          width: 800px;
          height: 800px;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: left 0.12s ease, top 0.12s ease;
          z-index: 0;
        }

        /* Horizontal rule with gradient */
        .hero-rule {
          width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(129,140,248,0.7), transparent);
          margin: 0 auto 1.5rem;
          opacity: 0;
          animation: fadeUp 0.6s 0.2s ease forwards;
        }

        /* Badge */
        .hero-badge {
          opacity: 0;
          animation: fadeUp 0.6s 0.35s ease forwards;
          margin-bottom: 2rem;
        }
        .hero-badge-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #818cf8;
          animation: glowPulse 2s ease infinite;
        }

        /* Heading */
        .hero-h1 {
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(2.6rem, 6vw, 5.5rem);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.02em;
          text-align: center;
          margin: 0 0 1.4rem;
          opacity: 0;
          animation: fadeUp 0.7s 0.5s ease forwards;
        }

        .hero-gradient-text {
          background: linear-gradient(135deg, #a5b4fc 0%, #e879f9 50%, #67e8f9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Typewriter line */
        .hero-typed-line {
          display: block;
          font-size: clamp(1rem, 2.4vw, 1.6rem);
          font-family: "JetBrains Mono", "Fira Code", monospace;
          letter-spacing: 0.02em;
          color: rgba(255,255,255,0.55);
          text-align: center;
          margin-bottom: 2rem;
          opacity: 0;
          animation: fadeUp 0.7s 0.65s ease forwards;
        }
        .hero-cursor {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: #818cf8;
          margin-left: 2px;
          vertical-align: middle;
          animation: blink 0.9s step-end infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }

        /* Sub description */
        .hero-desc {
          max-width: 580px;
          text-align: center;
          color: rgba(255,255,255,0.5);
          font-size: clamp(0.9rem, 1.6vw, 1.05rem);
          line-height: 1.75;
          margin: 0 auto 3rem;
          opacity: 0;
          animation: fadeUp 0.7s 0.8s ease forwards;
        }

        /* CTA buttons */
        .hero-ctas {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          opacity: 0;
          animation: fadeUp 0.7s 0.95s ease forwards;
          margin-bottom: 4rem;
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 2rem;
          border-radius: 999px;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hero-btn[data-primary] {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          box-shadow: 0 0 30px rgba(99,102,241,0.45);
        }
        .hero-btn[data-primary]::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #818cf8, #a78bfa);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .hero-btn[data-primary]:hover::after { opacity: 1; }
        .hero-btn[data-primary]:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 50px rgba(99,102,241,0.6);
        }
        .hero-btn:not([data-primary]) {
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.8);
          backdrop-filter: blur(8px);
        }
        .hero-btn:not([data-primary]):hover {
          border-color: rgba(129,140,248,0.5);
          background: rgba(99,102,241,0.1);
          transform: translateY(-2px);
        }

        /* Stats row */
        .hero-stats {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
          justify-content: center;
          opacity: 0;
          animation: fadeUp 0.7s 1.1s ease forwards;
        }
        .hero-stat {
          text-align: center;
        }
        .hero-stat-num {
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(1.6rem, 3.5vw, 2.5rem);
          font-weight: 800;
          background: linear-gradient(135deg, #c7d2fe, #e879f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-stat-label {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.38);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 0.2rem;
        }
        .hero-stat-divider {
          width: 1px;
          background: rgba(255,255,255,0.1);
          align-self: stretch;
          min-height: 48px;
        }

        /* Floating code cards */
        .code-card {
          position: absolute;
          background: rgba(15, 17, 40, 0.82);
          border: 1px solid rgba(129,140,248,0.22);
          border-radius: 12px;
          padding: 0.9rem 1.1rem;
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          animation: floatY 6s ease-in-out infinite, fadeUp 0.8s ease forwards;
          pointer-events: none;
          z-index: 1;
          min-width: 180px;
        }
        .code-card-dots {
          display: flex;
          gap: 5px;
          margin-bottom: 0.55rem;
        }
        .code-card-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: block;
        }
        .code-card-pre {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.72rem;
          line-height: 1.6;
          margin: 0;
          white-space: pre;
        }

        /* Fact pills */
        .fact-pill {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1rem;
          border-radius: 999px;
          background: rgba(15,17,40,0.8);
          border: 1px solid rgba(34,211,238,0.25);
          color: rgba(255,255,255,0.75);
          font-size: 0.78rem;
          backdrop-filter: blur(12px);
          animation: floatY 7s ease-in-out infinite, fadeUp 0.8s ease forwards;
          pointer-events: none;
          z-index: 1;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .fact-pill-icon { font-size: 0.9rem; }

        /* Scroll indicator */
        .hero-scroll {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0;
          animation: fadeUp 0.7s 1.4s ease forwards;
        }
        .hero-scroll-text {
          font-size: 0.68rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }
        .hero-scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, rgba(129,140,248,0.6), transparent);
          animation: scrollLine 1.6s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        /* Animated border ring around the heading area */
        .hero-ring {
          position: absolute;
          inset: 0;
          margin: auto;
          width: min(700px, 90vw);
          height: min(700px, 90vw);
          border-radius: 50%;
          border: 1px solid rgba(99,102,241,0.07);
          pointer-events: none;
          animation: rotateSlow 30s linear infinite;
        }
        .hero-ring::before {
          content: "";
          position: absolute;
          top: -2px;
          left: 50%;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #818cf8;
          box-shadow: 0 0 10px 4px rgba(129,140,248,0.5);
        }
        @keyframes rotateSlow {
          to { transform: rotate(360deg); }
        }

        /* Google font import within style tag (link in head is preferred but this works) */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        /* Hide decorations on very small screens */
        @media (max-width: 640px) {
          .code-card, .fact-pill, .hero-ring { display: none; }
        }
      `}</style>

      <section className="hero-root">
        {/* Noise grain */}
        <div className="hero-noise" />

        {/* Mouse-reactive spotlight */}
        <div
          className="hero-spotlight"
          style={{
            left: `calc(50% + ${mousePos.x * 0.3}px)`,
            top: `calc(50% + ${mousePos.y * 0.3}px)`,
          }}
        />

        {/* Particle canvas */}
        <ParticleCanvas />

        {/* Rotating ring */}
        <div className="hero-ring" />

        {/* ── Floating code snippets ── */}
        <CodeCard
          style={{ top: "14%", left: "4%", "--rot": "-4deg" } as React.CSSProperties}
          delay={900}
          lines={[
            { text: "// CodeNFacts API", color: "#6b7280" },
            { text: 'const fact = await', color: "#93c5fd" },
            { text: '  getFact("science")', color: "#a5b4fc" },
            { text: "console.log(fact)", color: "#34d399" },
          ]}
        />
        <CodeCard
          style={{ bottom: "22%", left: "3%", "--rot": "3deg" } as React.CSSProperties}
          delay={1100}
          lines={[
            { text: "def learn_daily():", color: "#c4b5fd" },
            { text: '  facts = fetch_all()', color: "#93c5fd" },
            { text: '  return facts[:5]', color: "#34d399" },
          ]}
        />
        <CodeCard
          style={{ top: "18%", right: "3%", "--rot": "5deg" } as React.CSSProperties}
          delay={1300}
          lines={[
            { text: "<CodeBlock lang=", color: "#6b7280" },
            { text: '  {"javascript"}', color: "#fbbf24" },
            { text: "  snippet={code}", color: "#a5b4fc" },
            { text: "/>", color: "#6b7280" },
          ]}
        />

        {/* ── Floating fact pills ── */}
        <FactPill
          text="The internet was invented in 1983"
          style={{ top: "8%", right: "8%" }}
          delay={1500}
        />
        <FactPill
          text="Python is 30+ years old"
          style={{ bottom: "28%", right: "4%" }}
          delay={1700}
        />
        <FactPill
          text="Git has 100M+ users"
          style={{ top: "50%", left: "1%" }}
          delay={1900}
        />

        {/* ── Main content ── */}
        <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
          <div className="hero-rule" />

          <div className="hero-badge" style={{ textAlign: "center" }}>
            <ShimmerBadge>
              <span className="hero-badge-dot" />
              Where Code Meets Curiosity
            </ShimmerBadge>
          </div>

          <h1 className="hero-h1">
            <span className="hero-gradient-text">Code</span>
            {" "}Smarter.{" "}
            <br />
            Think{" "}
            <span className="hero-gradient-text">Deeper.</span>
          </h1>

          <p className="hero-typed-line">
            Built for{" "}
            <span style={{ color: "#a5b4fc" }}>{typed}</span>
            <span className="hero-cursor" />
          </p>

          <p className="hero-desc">
            CodeNFacts is your daily dose of programming wisdom and fascinating
            facts - beautifully curated, endlessly explorable. Level up your knowledge
            one snippet at a time.
          </p>

          <div className="hero-ctas">
            <GlowButton primary href="/explore">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Start Exploring
            </GlowButton>
            <GlowButton href="/facts">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 9v4m0-8v1"/></svg>
              Daily Facts
            </GlowButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll">
          <div className="hero-scroll-text">Scroll</div>
          <div className="hero-scroll-line" />
        </div>
      </section>
    </>
  );
}