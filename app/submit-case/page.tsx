"use client";
import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// PALETTE  — Midnight Navy · Ivory · Electric Teal · Copper Amber
// All styles are inline or scoped under #sc-root so they NEVER bleed into
// any other section, footer, navbar, or global layout.
// ─────────────────────────────────────────────────────────────────────────────
const P = {
  // Backgrounds
  bg:       "#0B0F1A",   // deep midnight navy
  bg2:      "#111827",   // slightly lighter navy
  bg3:      "#161D2E",   // card surface
  bg4:      "#1C2440",   // elevated surface
  // Borders
  border:   "#1E2D4A",   // subtle border
  border2:  "#2A3F60",   // visible border
  // Text
  ivory:    "#F0EBE1",   // primary text
  ivory2:   "#C8BFA8",   // secondary text
  faded:    "#6B7A99",   // muted text
  // Accents
  teal:     "#00D4AA",   // electric teal — primary accent
  tealDim:  "#009E80",   // teal shade
  tealGlow: "#00D4AA22", // teal glow bg
  copper:   "#D4873A",   // copper amber — secondary accent
  copperDim:"#A8631E",
  // States
  err:      "#F05A5A",   // error red
  errBg:    "#F05A5A12",
  ok:       "#00D4AA",   // success = teal
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Human Error / Debugging",
  "Deployment Failure",
  "Version Control / Git",
  "Interview / DSA",
  "Security Breach",
  "Team / Collaboration",
  "Performance / Optimization",
  "Architecture Mistake",
  "Other",
];

const SEVERITY_OPTIONS = [
  { val: "moderate",     label: "MODERATE",     desc: "Annoying. Took time. Learned something.",        color: P.teal },
  { val: "severe",       label: "SEVERE",        desc: "Significant downtime or consequence.",           color: P.copper },
  { val: "critical",     label: "CRITICAL",      desc: "Major production impact or data risk.",          color: "#E07B39" },
  { val: "catastrophic", label: "CATASTROPHIC",  desc: "Career-level event. You remember the exact date.", color: P.err },
];

// ─── SCOPED STYLE TAG ─────────────────────────────────────────────────────────
// Every rule is prefixed with #sc-root so nothing escapes this component.
const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');

  #sc-root *, #sc-root *::before, #sc-root *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  #sc-root {
    font-family: 'DM Mono', 'Courier New', monospace;
    background: ${P.bg};
    color: ${P.ivory};
    min-height: 100vh;
    isolation: isolate;
    position: relative;
  }

  #sc-root ::selection {
    background: ${P.teal};
    color: ${P.bg};
  }

  #sc-root input,
  #sc-root textarea,
  #sc-root select {
    font-family: 'DM Mono', 'Courier New', monospace !important;
  }

  #sc-root input:focus,
  #sc-root textarea:focus {
    outline: none !important;
  }

  #sc-root textarea {
    resize: vertical;
  }

  /* Scrollbar inside modal */
  #sc-root ::-webkit-scrollbar       { width: 4px; }
  #sc-root ::-webkit-scrollbar-track { background: ${P.bg2}; }
  #sc-root ::-webkit-scrollbar-thumb { background: ${P.border2}; border-radius: 2px; }

  @keyframes sc-fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes sc-stampIn {
    0%   { transform: rotate(-6deg) scale(1.25); opacity: 0; }
    65%  { transform: rotate(2deg) scale(0.97); opacity: 1; }
    100% { transform: rotate(-1.5deg) scale(1); opacity: 1; }
  }
  @keyframes sc-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes sc-slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes sc-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  @keyframes sc-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes sc-underlineGrow {
    from { width: 0; }
    to   { width: 100%; }
  }

  /* Category tile hover */
  #sc-root .sc-cat-tile:hover {
    border-color: ${P.teal} !important;
    background: ${P.tealGlow} !important;
    color: ${P.ivory} !important;
  }
  /* Severity card hover */
  #sc-root .sc-sev-card:hover {
    border-color: ${P.border2} !important;
    transform: translateY(-2px);
  }
  /* Input hover */
  #sc-root .sc-input:hover {
    border-color: ${P.border2} !important;
  }
  /* Link styles */
  #sc-root a {
    text-decoration: none;
  }
`;

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(18px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function FieldLabel({ label, required = false, hint }: {
  label: string; required?: boolean; hint?: string;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11, letterSpacing: 2.5,
          color: P.ivory2, textTransform: "uppercase",
          fontWeight: 500,
        }}>{label}</span>
        {required && (
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9, letterSpacing: 1.5,
            color: P.teal,
            border: `1px solid ${P.teal}`,
            padding: "1px 6px",
            background: P.tealGlow,
          }}>REQ</span>
        )}
      </div>
      {hint && (
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11, color: P.faded, marginTop: 5,
          lineHeight: 1.6,
        }}>{hint}</div>
      )}
    </div>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6, marginTop: 7,
      fontFamily: "'DM Mono', monospace", fontSize: 11,
      color: P.err, lineHeight: 1.4,
      animation: "sc-slideIn 0.2s ease",
    }}>
      <span style={{ fontSize: 10 }}>◆</span> {msg}
    </div>
  );
}

function inputStyles(focused: boolean, hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    fontSize: 13.5,
    color: P.ivory,
    background: focused ? P.bg4 : P.bg3,
    border: `1px solid ${hasError ? P.err : focused ? P.teal : P.border}`,
    borderLeft: `3px solid ${hasError ? P.err : focused ? P.teal : P.border2}`,
    padding: "13px 16px",
    outline: "none",
    transition: "all 0.2s ease",
    lineHeight: 1.65,
    resize: "none",
    boxShadow: focused ? `0 0 0 3px ${P.tealGlow}` : "none",
    caretColor: P.teal,
  };
}

function CharCount({ val, min, max }: { val: string; min?: number; max: number }) {
  const len = val.length;
  const pct = Math.min(len / max, 1);
  const barColor = len > max ? P.err : len >= (min ?? 0) ? P.teal : P.border2;
  const textColor = len > max ? P.err : len >= (min ?? 0) ? P.teal : P.faded;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
      <div style={{ flex: 1, height: 2, background: P.border, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%",
          width: `${pct * 100}%`,
          background: barColor,
          transition: "width 0.12s ease, background 0.2s",
          boxShadow: len >= (min ?? 0) && len <= max ? `0 0 6px ${barColor}88` : "none",
        }} />
      </div>
      <span style={{
        fontFamily: "'DM Mono', monospace", fontSize: 10,
        color: textColor, letterSpacing: 1, whiteSpace: "nowrap",
        transition: "color 0.2s",
      }}>{len} / {max}</span>
    </div>
  );
}

function SectionHeader({ number, title, subtitle }: {
  number: string; title: string; subtitle: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
      <div style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 52, fontWeight: 400,
        color: P.border2, lineHeight: 1,
        userSelect: "none", flexShrink: 0,
        letterSpacing: -2,
      }}>{number}</div>
      <div style={{ flex: "0 0 auto" }}>
        <div style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 20, fontWeight: 400,
          color: P.ivory, letterSpacing: -0.5,
        }}>{title}</div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, color: P.faded, letterSpacing: 2.5,
          marginTop: 3, textTransform: "uppercase",
        }}>{subtitle}</div>
      </div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${P.border2}, transparent)` }} />
    </div>
  );
}

function RuleDivider() {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 48 }}>
      <div style={{ flex: 1, height: 1, background: P.border }} />
      <div style={{ width: 48, height: 1, background: P.teal, boxShadow: `0 0 6px ${P.teal}` }} />
      <div style={{ flex: 2, height: 1, background: P.border }} />
    </div>
  );
}

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
function SuccessScreen({ caseId }: { caseId: string }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 60); }, []);

  return (
    <div style={{
      minHeight: "85vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "60px 5%",
    }}>
      <div style={{
        maxWidth: 560, width: "100%", textAlign: "center",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(24px)",
        transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)",
      }}>

        {/* Teal ring icon */}
        <div style={{
          width: 80, height: 80,
          border: `3px solid ${P.teal}`,
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px",
          boxShadow: `0 0 32px ${P.tealGlow}, 0 0 60px ${P.tealGlow}`,
          animation: vis ? "sc-fadeUp 0.6s ease 0.2s both" : "none",
        }}>
          <span style={{ fontSize: 32, color: P.teal }}>✓</span>
        </div>

        {/* Stamp */}
        <div style={{
          display: "inline-block",
          border: `3px solid ${P.teal}`,
          padding: "8px 24px", marginBottom: 28,
          transform: "rotate(-2deg)",
          animation: vis ? "sc-stampIn 0.5s ease 0.4s both" : "none",
          opacity: 0,
          boxShadow: `0 0 20px ${P.tealGlow}`,
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13, letterSpacing: 6,
            color: P.teal, fontWeight: 500,
          }}>CASE FILED</span>
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(28px, 5vw, 46px)",
          fontWeight: 400, color: P.ivory,
          lineHeight: 1.15, marginBottom: 16,
        }}>
          Your failure is now{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{ color: P.teal }}>someone's lesson.</span>
            <span style={{
              position: "absolute", bottom: -3, left: 0,
              height: 2, width: "100%",
              background: P.teal,
              boxShadow: `0 0 8px ${P.teal}`,
            }} />
          </span>
        </h2>

        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 12.5, color: P.faded, lineHeight: 1.9,
          marginBottom: 32,
        }}>
          Your incident report has been received and will be reviewed by the CodeNFacts team.
          Once verified, it will be anonymized and published to the Failure Archive.
        </p>

        {/* Case ID box */}
        <div style={{
          background: P.bg3,
          border: `1px solid ${P.border2}`,
          borderLeft: `4px solid ${P.teal}`,
          padding: "18px 24px", marginBottom: 36,
          display: "inline-block", textAlign: "left",
          boxShadow: `0 0 24px ${P.tealGlow}`,
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 9,
            letterSpacing: 3, color: P.faded, marginBottom: 8,
          }}>YOUR CASE REFERENCE</div>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 20,
            letterSpacing: 5, color: P.teal, fontWeight: 500,
          }}>{caseId}</div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/failure-log" style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            letterSpacing: 2.5, color: P.bg,
            background: P.teal, padding: "14px 28px",
            fontWeight: 500,
            boxShadow: `0 4px 20px ${P.tealGlow}`,
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${P.teal}55`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${P.tealGlow}`; }}
          >VIEW ARCHIVE →</a>
          <a href="/" style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            letterSpacing: 2.5, color: P.ivory2,
            background: "transparent",
            border: `1px solid ${P.border2}`,
            padding: "14px 28px",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = P.ivory2; (e.currentTarget as HTMLElement).style.color = P.ivory; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = P.border2; (e.currentTarget as HTMLElement).style.color = P.ivory2; }}
          >← HOME</a>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SubmitCase() {
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [caseId, setCaseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [form, setForm] = useState({
    author: "", email: "", role: "",
    category: "", severity: "",
    title: "", duration: "", tags: "",
    story: "", lesson: "", impact: "",
    anonymous: true, consent: false,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [focused, setFocused] = useState("");

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  // ── Validation ──────────────────────────────────────────────────────────────
  const errors: Record<string, string> = {};
  if (touched.author   && !form.author.trim())                                     errors.author   = "Name is required.";
  if (touched.email    && !form.email.trim())                                      errors.email    = "Email is required.";
  if (touched.email    && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address.";
  if (touched.role     && !form.role.trim())                                       errors.role     = "Your role is required.";
  if (touched.category && !form.category)                                          errors.category = "Select a category.";
  if (touched.severity && !form.severity)                                          errors.severity = "Select a severity level.";
  if (touched.title    && !form.title.trim())                                      errors.title    = "Case title is required.";
  if (touched.title    && form.title.length < 10)                                  errors.title    = "Title must be at least 10 characters.";
  if (touched.story    && !form.story.trim())                                      errors.story    = "The incident story is required.";
  if (touched.story    && form.story.length < 100)                                 errors.story    = "Story must be at least 100 characters.";
  if (touched.story    && form.story.length > 3000)                                errors.story    = "Story must be under 3,000 characters.";
  if (touched.lesson   && !form.lesson.trim())                                     errors.lesson   = "The lesson is required.";
  if (touched.lesson   && form.lesson.length < 40)                                 errors.lesson   = "Lesson must be at least 40 characters.";
  if (touched.consent  && !form.consent)                                           errors.consent  = "You must confirm your submission.";

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));
  const touch = (k: string) => setTouched(t => ({ ...t, [k]: true }));
  const blur = (k: string) => { touch(k); setFocused(""); };

  const isValid =
    !!form.author.trim() &&
    !!form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    !!form.role.trim() && !!form.category && !!form.severity &&
    form.title.length >= 10 &&
    form.story.length >= 100 && form.story.length <= 3000 &&
    form.lesson.length >= 40 &&
    form.consent;

  const handleSubmit = async () => {
    const req = ["author","email","role","category","severity","title","story","lesson","consent"];
    setTouched(Object.fromEntries(req.map(k => [k, true])));
    if (!isValid) return;
    setLoading(true); setServerError("");
    try {
      const res = await fetch("/api/submit-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setCaseId(data.caseId);
      setSubmitted(true);
    } catch (e: any) {
      setServerError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render success ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />
        <div id="sc-root">
          <div style={{ height: 3, background: `linear-gradient(90deg, ${P.teal}, ${P.copper})` }} />
          <SuccessScreen caseId={caseId} />
        </div>
      </>
    );
  }

  // ── Render form ─────────────────────────────────────────────────────────────
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      <div id="sc-root">

        {/* ── TOP ACCENT BAR ── */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${P.teal}, ${P.copper}, ${P.teal})` }} />

        {/* ── SUBTLE GRID BACKGROUND ── */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(${P.border}55 1px, transparent 1px),
            linear-gradient(90deg, ${P.border}55 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 0%, black 40%, transparent 100%)",
        }} />

        {/* ── HEADER ── */}
        <header style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", padding: "40px 5% 0" }}>

          {/* Breadcrumb */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 24,
            opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 0.1s",
          }}>
            <a href="/failure-log" style={{
              fontFamily: "'DM Mono', monospace", fontSize: 10,
              letterSpacing: 2.5, color: P.faded,
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = P.teal)}
              onMouseLeave={e => (e.currentTarget.style.color = P.faded)}
            >← FAILURE ARCHIVE</a>
            <span style={{ color: P.border2, fontSize: 12 }}>/</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2.5, color: P.ivory2 }}>SUBMIT CASE</span>
          </div>

          {/* Title block */}
          <div style={{
            paddingBottom: 32, marginBottom: 36,
            borderBottom: `1px solid ${P.border}`,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateY(16px)",
            transition: "all 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                {/* Kicker */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  marginBottom: 16,
                  background: P.tealGlow,
                  border: `1px solid ${P.teal}33`,
                  padding: "5px 14px",
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: P.teal,
                    boxShadow: `0 0 8px ${P.teal}`,
                    display: "inline-block",
                    animation: "sc-pulse 2s infinite",
                  }} />
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 10,
                    letterSpacing: 3, color: P.teal,
                  }}>INTAKE OPEN · CODENFACTS ARCHIVE</span>
                </div>

                <h1 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(40px, 8vw, 88px)",
                  fontWeight: 400, lineHeight: 0.92,
                  letterSpacing: -2, color: P.ivory,
                }}>
                  FILE YOUR
                  <br />
                  <span style={{ position: "relative", display: "inline-block" }}>
                    <span style={{
                      background: `linear-gradient(135deg, ${P.teal}, ${P.copper})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>INCIDENT.</span>
                    <span style={{
                      position: "absolute", bottom: 0, left: 0,
                      height: 3, background: `linear-gradient(90deg, ${P.teal}, ${P.copper})`,
                      width: mounted ? "100%" : "0%",
                      transition: "width 1.2s cubic-bezier(0.22,1,0.36,1) 1s",
                      boxShadow: `0 0 10px ${P.teal}88`,
                    }} />
                  </span>
                </h1>
              </div>

              {/* Stats cluster */}
              <div style={{
                display: "flex", flexDirection: "column", gap: 10,
                paddingTop: 8, flexShrink: 0,
                opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 1.1s",
              }}>
                {[
                  { label: "CASES FILED", val: "159+", color: P.teal },
                  { label: "DEVS SAVED", val: "5,000+", color: P.copper },
                ].map(s => (
                  <div key={s.label} style={{
                    background: P.bg3,
                    border: `1px solid ${P.border}`,
                    borderLeft: `3px solid ${s.color}`,
                    padding: "10px 16px", minWidth: 150,
                  }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, color: P.faded, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deck text */}
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13, color: P.ivory2, lineHeight: 1.85,
              marginTop: 24, maxWidth: 620,
              borderLeft: `3px solid ${P.teal}`,
              paddingLeft: 18,
            }}>
              Your story will be reviewed, anonymized, and published to the Failure Archive -
              where it becomes leverage for thousands of developers who'll make the same mistake tomorrow.
            </p>
          </div>
        </header>

        {/* ── FORM ── */}
        <main style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", padding: "0 5% 100px" }}>

          {/* ─ SECTION 01: About You ── */}
          <Reveal delay={0.05}>
            <div style={{ marginBottom: 52 }}>
              <SectionHeader number="01" title="About You" subtitle="Who is filing this report?" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Name */}
                <div>
                  <FieldLabel label="Your Name" required hint="First name or alias - may appear on your submission." />
                  <input
                    className="sc-input"
                    type="text"
                    value={form.author}
                    placeholder="e.g. Aryan K."
                    onChange={e => set("author", e.target.value)}
                    onFocus={() => setFocused("author")}
                    onBlur={() => blur("author")}
                    style={inputStyles(focused === "author", !!errors.author)}
                  />
                  {errors.author && <FieldError msg={errors.author} />}
                </div>

                {/* Email */}
                <div>
                  <FieldLabel label="Email Address" required hint="Never published. Used only for case verification." />
                  <input
                    className="sc-input"
                    type="email"
                    value={form.email}
                    placeholder="you@example.com"
                    onChange={e => set("email", e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => blur("email")}
                    style={inputStyles(focused === "email", !!errors.email)}
                  />
                  {errors.email && <FieldError msg={errors.email} />}
                </div>

                {/* Role */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <FieldLabel label="Your Role at the Time" required hint="e.g. Backend Intern, SDE Candidate, CS Student 2nd Year, Freelancer" />
                  <input
                    className="sc-input"
                    type="text"
                    value={form.role}
                    placeholder="e.g. Full Stack Developer, Startup"
                    onChange={e => set("role", e.target.value)}
                    onFocus={() => setFocused("role")}
                    onBlur={() => blur("role")}
                    style={inputStyles(focused === "role", !!errors.role)}
                  />
                  {errors.role && <FieldError msg={errors.role} />}
                </div>
              </div>

              {/* Anonymous toggle */}
              <div
                onClick={() => set("anonymous", !form.anonymous)}
                style={{
                  marginTop: 18, padding: "16px 18px",
                  background: form.anonymous ? P.tealGlow : P.bg3,
                  border: `1px solid ${form.anonymous ? P.teal + "44" : P.border}`,
                  borderLeft: `3px solid ${form.anonymous ? P.teal : P.border2}`,
                  display: "flex", alignItems: "center", gap: 14,
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 18, height: 18, flexShrink: 0,
                  border: `2px solid ${form.anonymous ? P.teal : P.border2}`,
                  background: form.anonymous ? P.teal : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                  boxShadow: form.anonymous ? `0 0 8px ${P.tealGlow}` : "none",
                }}>
                  {form.anonymous && <span style={{ fontSize: 11, color: P.bg, lineHeight: 1, fontWeight: 700 }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2, color: form.anonymous ? P.teal : P.ivory2, fontWeight: 500 }}>PUBLISH ANONYMOUSLY</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: P.faded, marginTop: 3 }}>
                    Your real name won't appear. Only your role will be shown in the archive.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <RuleDivider />

          {/* ─ SECTION 02: Classification ── */}
          <Reveal delay={0.05}>
            <div style={{ marginBottom: 52 }}>
              <SectionHeader number="02" title="Case Classification" subtitle="Help us file this correctly." />

              {/* Category grid */}
              <div style={{ marginBottom: 28 }}>
                <FieldLabel label="Incident Category" required />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))", gap: 8 }}>
                  {CATEGORIES.map(c => (
                    <div
                      key={c}
                      className="sc-cat-tile"
                      onClick={() => { set("category", c); touch("category"); }}
                      style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 11.5,
                        color: form.category === c ? P.bg : P.ivory2,
                        background: form.category === c ? P.teal : P.bg3,
                        border: `1px solid ${form.category === c ? P.teal : P.border}`,
                        borderLeft: `3px solid ${form.category === c ? P.tealDim : P.border2}`,
                        padding: "11px 14px", cursor: "pointer",
                        transition: "all 0.15s ease",
                        boxShadow: form.category === c ? `0 4px 16px ${P.tealGlow}` : "none",
                        fontWeight: form.category === c ? 500 : 400,
                      }}
                    >{c}</div>
                  ))}
                </div>
                {errors.category && <FieldError msg={errors.category} />}
              </div>

              {/* Severity cards */}
              <div>
                <FieldLabel label="Severity Level" required hint="Be honest - the more accurate, the more valuable for other developers." />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", gap: 10 }}>
                  {SEVERITY_OPTIONS.map(s => {
                    const active = form.severity === s.val;
                    return (
                      <div
                        key={s.val}
                        className="sc-sev-card"
                        onClick={() => { set("severity", s.val); touch("severity"); }}
                        style={{
                          padding: "16px 16px 14px",
                          cursor: "pointer",
                          background: active ? P.bg4 : P.bg3,
                          border: `1px solid ${active ? s.color : P.border}`,
                          borderTop: `3px solid ${active ? s.color : P.border2}`,
                          transition: "all 0.18s ease",
                          boxShadow: active ? `0 0 20px ${s.color}22, 0 4px 16px rgba(0,0,0,0.3)` : "none",
                        }}
                      >
                        <div style={{
                          fontFamily: "'DM Mono', monospace", fontSize: 11,
                          letterSpacing: 3, fontWeight: 500,
                          color: active ? s.color : P.ivory2,
                          marginBottom: 8,
                          transition: "color 0.18s",
                        }}>{s.label}</div>
                        <div style={{
                          fontFamily: "'DM Mono', monospace", fontSize: 10.5,
                          color: active ? P.ivory2 : P.faded,
                          lineHeight: 1.6, transition: "color 0.18s",
                        }}>{s.desc}</div>
                        {active && (
                          <div style={{
                            marginTop: 10, height: 2,
                            background: `linear-gradient(90deg, ${s.color}, transparent)`,
                            boxShadow: `0 0 6px ${s.color}`,
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
                {errors.severity && <FieldError msg={errors.severity} />}
              </div>
            </div>
          </Reveal>

          <RuleDivider />

          {/* ─ SECTION 03: The Incident ── */}
          <Reveal delay={0.05}>
            <div style={{ marginBottom: 52 }}>
              <SectionHeader number="03" title="The Incident" subtitle="Tell us exactly what happened." />

              {/* Title */}
              <div style={{ marginBottom: 22 }}>
                <FieldLabel label="Case Title" required hint='A sharp headline for your failure. e.g. "72 Hours Debugging a Semicolon"' />
                <input
                  className="sc-input"
                  type="text"
                  value={form.title}
                  placeholder="What would you call this incident?"
                  onChange={e => set("title", e.target.value)}
                  onFocus={() => setFocused("title")}
                  onBlur={() => blur("title")}
                  style={inputStyles(focused === "title", !!errors.title)}
                />
                <CharCount val={form.title} min={10} max={100} />
                {errors.title && <FieldError msg={errors.title} />}
              </div>

              {/* Duration + Tags row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 22 }}>
                <div>
                  <FieldLabel label="Duration / Downtime" hint='e.g. "72 hours", "2 weeks"' />
                  <input
                    className="sc-input"
                    type="text"
                    value={form.duration}
                    placeholder="72 hours"
                    onChange={e => set("duration", e.target.value)}
                    onFocus={() => setFocused("duration")}
                    onBlur={() => blur("duration")}
                    style={inputStyles(focused === "duration", false)}
                  />
                </div>
                <div>
                  <FieldLabel label="Tech Stack / Tags" hint="Comma-separated - e.g. Node.js, Express, AWS" />
                  <input
                    className="sc-input"
                    type="text"
                    value={form.tags}
                    placeholder="Node.js, AWS, Git, PostgreSQL..."
                    onChange={e => set("tags", e.target.value)}
                    onFocus={() => setFocused("tags")}
                    onBlur={() => blur("tags")}
                    style={inputStyles(focused === "tags", false)}
                  />
                </div>
              </div>

              {/* Story */}
              <div style={{ marginBottom: 22 }}>
                <FieldLabel
                  label="Full Incident Story"
                  required
                  hint="Write in first person. What happened, when, what you tried, what the actual cause was. The more honest and specific, the more valuable."
                />
                {/* Teal line-number gutter */}
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, width: 44,
                    background: P.bg4,
                    borderLeft: `3px solid ${focused === "story" ? P.teal : P.border2}`,
                    borderRight: `1px solid ${P.border}`,
                    zIndex: 1, pointerEvents: "none",
                    transition: "border-color 0.2s",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", paddingTop: 13, gap: "3.9px",
                    overflow: "hidden",
                  }}>
                    {[...Array(12)].map((_, i) => (
                      <span key={i} style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 9,
                        color: P.faded, lineHeight: "21.7px",
                        userSelect: "none",
                      }}>{i + 1}</span>
                    ))}
                  </div>
                  <textarea
                    className="sc-input"
                    value={form.story}
                    rows={12}
                    placeholder={"It was 11 PM on a Thursday...\n\nDescribe exactly what happened. What did you try? What did you assume? What was the real cause?"}
                    onChange={e => set("story", e.target.value)}
                    onFocus={() => setFocused("story")}
                    onBlur={() => blur("story")}
                    style={{
                      ...inputStyles(focused === "story", !!errors.story),
                      paddingLeft: 60,
                      lineHeight: "21.7px",
                    }}
                  />
                </div>
                <CharCount val={form.story} min={100} max={3000} />
                {errors.story && <FieldError msg={errors.story} />}
              </div>

              {/* Lesson */}
              <div style={{ marginBottom: 22 }}>
                <FieldLabel
                  label="The Lesson"
                  required
                  hint="What should every developer take away from this? Be direct, actionable, and specific."
                />
                <textarea
                  className="sc-input"
                  value={form.lesson}
                  rows={4}
                  placeholder="Read the error message. The WHOLE error message..."
                  onChange={e => set("lesson", e.target.value)}
                  onFocus={() => setFocused("lesson")}
                  onBlur={() => blur("lesson")}
                  style={inputStyles(focused === "lesson", !!errors.lesson)}
                />
                <CharCount val={form.lesson} min={40} max={600} />
                {errors.lesson && <FieldError msg={errors.lesson} />}
              </div>

              {/* Impact */}
              <div>
                <FieldLabel label="Real-World Impact" hint="What actually happened as a consequence? Lost sprint? AWS bill? Rejected offer? Be honest." />
                <textarea
                  className="sc-input"
                  value={form.impact}
                  rows={3}
                  placeholder="e.g. 12,000 users affected. 6-hour emergency rollback. 30 hours without sleep."
                  onChange={e => set("impact", e.target.value)}
                  onFocus={() => setFocused("impact")}
                  onBlur={() => blur("impact")}
                  style={inputStyles(focused === "impact", false)}
                />
              </div>
            </div>
          </Reveal>

          <RuleDivider />

          {/* ─ SECTION 04: Confirm ── */}
          <Reveal delay={0.05}>
            <div style={{ marginBottom: 60 }}>
              <SectionHeader number="04" title="Confirm & File" subtitle="Last step — review and submit." />

              {/* Consent */}
              <div
                onClick={() => { set("consent", !form.consent); touch("consent"); }}
                style={{
                  padding: "18px 20px", marginBottom: 8,
                  background: form.consent ? P.tealGlow : P.bg3,
                  border: `1px solid ${errors.consent ? P.err : form.consent ? P.teal + "44" : P.border}`,
                  borderLeft: `4px solid ${errors.consent ? P.err : form.consent ? P.teal : P.border2}`,
                  display: "flex", alignItems: "flex-start", gap: 14,
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: form.consent ? `0 0 20px ${P.tealGlow}` : "none",
                }}
              >
                <div style={{
                  width: 18, height: 18, flexShrink: 0, marginTop: 2,
                  border: `2px solid ${form.consent ? P.teal : errors.consent ? P.err : P.border2}`,
                  background: form.consent ? P.teal : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                  boxShadow: form.consent ? `0 0 8px ${P.teal}` : "none",
                }}>
                  {form.consent && <span style={{ fontSize: 11, color: P.bg, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12.5, color: P.ivory2, lineHeight: 1.75 }}>
                  I confirm this incident is real, based on my genuine experience, and I give CodeNFacts permission to publish it
                  (anonymized or credited as selected) for educational purposes.
                </div>
              </div>
              {errors.consent && <FieldError msg={errors.consent} />}

              {/* Live preview */}
              {form.title && form.category && form.severity && (
                <div style={{
                  padding: "18px 20px", marginTop: 20, marginBottom: 24,
                  background: P.bg3,
                  border: `1px solid ${P.border}`,
                  borderTop: `2px solid ${P.copper}`,
                  animation: "sc-slideIn 0.3s ease",
                }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 9,
                    letterSpacing: 3, color: P.copper, marginBottom: 12,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: P.copper, display: "inline-block" }} />
                    PREVIEW - HOW YOUR CASE WILL APPEAR
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    {form.category && (
                      <span style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2,
                        color: P.teal, border: `1px solid ${P.teal}44`,
                        padding: "2px 8px", background: P.tealGlow,
                      }}>{form.category.toUpperCase()}</span>
                    )}
                    {form.severity && (
                      <span style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2,
                        color: P.copper, border: `1px solid ${P.copper}44`,
                        padding: "2px 8px", background: `${P.copper}11`,
                      }}>{form.severity.toUpperCase()}</span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: "'DM Serif Display', serif", fontSize: 18,
                    color: P.ivory, marginBottom: 6,
                  }}>{form.title}</div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 10.5, color: P.faded,
                  }}>
                    {form.anonymous ? "Anonymous" : form.author || "—"} · {form.role || "—"}
                    {form.duration ? ` · ${form.duration}` : ""}
                  </div>
                </div>
              )}

              {/* Server error */}
              {serverError && (
                <div style={{
                  padding: "14px 18px", marginBottom: 20,
                  background: P.errBg,
                  border: `1px solid ${P.err}44`,
                  borderLeft: `3px solid ${P.err}`,
                  fontFamily: "'DM Mono', monospace", fontSize: 12.5,
                  color: P.err, lineHeight: 1.6,
                  animation: "sc-slideIn 0.2s ease",
                }}>
                  ◆ {serverError}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 12,
                  letterSpacing: 3, fontWeight: 500,
                  color: loading ? P.faded : P.bg,
                  background: loading
                    ? P.bg3
                    : `linear-gradient(135deg, ${P.teal}, ${P.tealDim})`,
                  border: `1px solid ${loading ? P.border : P.teal}`,
                  padding: "17px 44px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "inline-flex", alignItems: "center", gap: 12,
                  boxShadow: loading ? "none" : `0 4px 24px ${P.tealGlow}, 0 0 0 1px ${P.teal}22`,
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${P.teal}44, 0 0 0 1px ${P.teal}44`;
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = loading ? "none" : `0 4px 24px ${P.tealGlow}, 0 0 0 1px ${P.teal}22`;
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 13, height: 13,
                      border: `2px solid ${P.border2}`, borderTopColor: P.teal,
                      borderRadius: "50%",
                      animation: "sc-spin 0.7s linear infinite",
                      display: "inline-block", flexShrink: 0,
                    }} />
                    FILING CASE...
                  </>
                ) : "FILE THIS CASE →"}
              </button>

              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10.5,
                color: P.faded, marginTop: 16, lineHeight: 1.8,
              }}>
                All submissions are reviewed before publishing.
                Your email address is never shared or published.
              </div>
            </div>
          </Reveal>
        </main>
      </div>
    </>
  );
}