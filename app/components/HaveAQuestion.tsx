"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ─── Magnetic Button Hook ─────────────────────────────────────────────────── */
function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return { ref, sx, sy, onMove, onLeave };
}

/* ─── Noise SVG filter ──────────────────────────────────────────────────────── */
const NoiseSVG = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feBlend in="SourceGraphic" mode="overlay" result="blend" />
        <feComposite in="blend" in2="SourceGraphic" operator="in" />
      </filter>
    </defs>
  </svg>
);

/* ─── Orbiting dot ring ─────────────────────────────────────────────────────── */
const OrbitRing = ({ radius, count, duration, color }: { radius: number; count: number; duration: number; color: string }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{ width: 4, height: 4, background: color, top: "50%", left: "50%" }}
        animate={{ rotate: 360 }}
        transition={{ duration, ease: "linear", repeat: Infinity, delay: (duration / count) * i }}
        initial={false}
      >
        <div
          style={{
            position: "absolute",
            top: -radius,
            left: -2,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: color,
            opacity: 0.7,
          }}
        />
      </motion.div>
    ))}
  </>
);

/* ─── Char-by-char text reveal ──────────────────────────────────────────────── */
const RevealText = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => (
  <span className={className} style={{ display: "inline-block", overflow: "hidden" }}>
    {text.split("").map((ch, i) => (
      <motion.span
        key={i}
        style={{ display: "inline-block" }}
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.028 }}
      >
        {ch === " " ? "\u00A0" : ch}
      </motion.span>
    ))}
  </span>
);

/* ─── Status enum ────────────────────────────────────────────────────────────── */
type Status = "idle" | "sending" | "success" | "error";

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export default function HaveAQuestion() {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const magnetic = useMagnetic(0.4);

  useEffect(() => setMounted(true), []);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !question.trim()) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, question }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setName(""); setEmail(""); setQuestion("");
    } catch {
      setStatus("error");
    } finally {
      if (status !== "success") setTimeout(() => setStatus("idle"), 3500);
    }
  };

  if (!mounted) return null;

  const inputBase =
    "w-full bg-transparent text-[#e8e0d5] placeholder-[#4a4540] outline-none transition-all duration-300 font-['Cormorant_Garamond'] text-lg resize-none";

  return (
    <>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Syne:wght@700;800&display=swap');

        .field-underline {
          position: relative;
        }
        .field-underline::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          height: 1px;
          width: 100%;
          background: linear-gradient(90deg, #c9a96e, #e8c99a, #c9a96e);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .field-underline.active::after { transform: scaleX(1); }
        .field-underline::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          height: 1px;
          width: 100%;
          background: #2a2520;
        }

        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(60px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #c9a96e 0%, #f5e6c8 40%, #c9a96e 60%, #e8c99a 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .grain-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          border-radius: inherit;
        }
      `}</style>

      <NoiseSVG />

      <div
        className="grain-overlay relative min-h-screen overflow-hidden flex items-center justify-center p-6 md:p-12"
        style={{ background: "#0d0b09", fontFamily: "'Cormorant Garamond', serif" }}
      >

        {/* Animated grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(#c9a96e 1px, transparent 1px), linear-gradient(90deg, #c9a96e 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              animation: "gridMove 6s linear infinite",
            }}
          />
        </div>

        {/* Ambient blobs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-20%", left: "-10%",
            width: 600, height: 600,
            background: "radial-gradient(circle, #b8860b, transparent 65%)",
            borderRadius: "50%", pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{
            position: "absolute", bottom: "-25%", right: "-10%",
            width: 700, height: 700,
            background: "radial-gradient(circle, #8b6914, transparent 65%)",
            borderRadius: "50%", pointerEvents: "none",
          }}
        />

        {/* Central card */}
        <div className="relative w-full max-w-5xl">

          {/* Decorative corner lines */}
          {[
            { top: 0, left: 0, borderTop: "1px solid #c9a96e40", borderLeft: "1px solid #c9a96e40" },
            { top: 0, right: 0, borderTop: "1px solid #c9a96e40", borderRight: "1px solid #c9a96e40" },
            { bottom: 0, left: 0, borderBottom: "1px solid #c9a96e40", borderLeft: "1px solid #c9a96e40" },
            { bottom: 0, right: 0, borderBottom: "1px solid #c9a96e40", borderRight: "1px solid #c9a96e40" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ ...s, position: "absolute", width: 40, height: 40 }}
            />
          ))}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-0">

            {/* ─── Left: Branding ───────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-between p-8 md:p-14 border border-[#2a2520] lg:border-r-0"
              style={{ background: "#110f0c" }}
            >
              {/* Top section */}
              <div>
                {/* Orbit animation */}
                <div className="relative w-16 h-16 mb-10">
                  <OrbitRing radius={28} count={3} duration={5} color="#c9a96e" />
                  <OrbitRing radius={18} count={2} duration={3.5} color="#8b6914" />
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 10, height: 10, borderRadius: "50%",
                    background: "#c9a96e",
                    boxShadow: "0 0 20px #c9a96e80",
                  }} />
                </div>

                <div className="overflow-hidden mb-3">
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    style={{ color: "#c9a96e", fontSize: 10, letterSpacing: "0.4em", fontFamily: "'Syne', sans-serif" }}
                  >
                    ✦ ATELIER SUPPORT ✦
                  </motion.p>
                </div>

                <h1
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
                    fontWeight: 800,
                    lineHeight: 0.92,
                    letterSpacing: "-0.03em",
                    color: "#e8e0d5",
                    marginBottom: "1.5rem",
                  }}
                >
                  <RevealText text="HAVE A" delay={0.4} />
                  <br />
                  <span className="shimmer-text" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                    <RevealText text="Qu.?" delay={0.7} />
                  </span>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.7 }}
                  style={{ color: "#6b6158", fontSize: "1rem", lineHeight: 1.7, maxWidth: 280, fontStyle: "italic" }}
                >
                  Every great collaboration begins with a single question. We read every message personally.
                </motion.p>
              </div>

              {/* Bottom decorative stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="flex gap-8 pt-8 mt-8"
                style={{ borderTop: "1px solid #2a2520" }}
              >
                {[["< 24h", "response"], ["100%", "personal"], ["0", "spam"]].map(([val, label]) => (
                  <div key={label}>
                    <div style={{ color: "#c9a96e", fontFamily: "'Syne',sans-serif", fontSize: "1.1rem", fontWeight: 700 }}>{val}</div>
                    <div style={{ color: "#4a4540", fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>{label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ─── Right: Form ──────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="p-8 md:p-14 border border-[#2a2520] flex flex-col justify-between"
              style={{ background: "#0d0b09" }}
            >
              <div className="space-y-10">

                {/* Name */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`field-underline pb-4 ${focusedField === "name" ? "active" : ""}`}
                >
                  <label style={{ fontSize: "0.6rem", letterSpacing: "0.35em", color: "#4a4540", textTransform: "uppercase", display: "block", marginBottom: 12, fontFamily: "'Syne',sans-serif" }}>
                    Your Name
                  </label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Ada Lovelace"
                    className={inputBase}
                    style={{ fontSize: "1.2rem" }}
                  />
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className={`field-underline pb-4 ${focusedField === "email" ? "active" : ""}`}
                >
                  <label style={{ fontSize: "0.6rem", letterSpacing: "0.35em", color: "#4a4540", textTransform: "uppercase", display: "block", marginBottom: 12, fontFamily: "'Syne',sans-serif" }}>
                    Email Address
                  </label>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    type="email"
                    placeholder="adalove@gmail.com"
                    className={inputBase}
                    style={{ fontSize: "1.2rem" }}
                  />
                </motion.div>

                {/* Question */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className={`field-underline pb-4 ${focusedField === "question" ? "active" : ""}`}
                >
                  <label style={{ fontSize: "0.6rem", letterSpacing: "0.35em", color: "#4a4540", textTransform: "uppercase", display: "block", marginBottom: 12, fontFamily: "'Syne',sans-serif" }}>
                    Your Question
                  </label>
                  <textarea
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onFocus={() => setFocusedField("question")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="What's on your mind..."
                    rows={4}
                    className={inputBase}
                    style={{ fontSize: "1.1rem" }}
                  />
                </motion.div>
              </div>

              {/* Submit button */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-10"
              >
                <motion.button
                  ref={magnetic.ref}
                  onMouseMove={magnetic.onMove}
                  onMouseLeave={magnetic.onLeave}
                  style={{ x: magnetic.sx, y: magnetic.sy, position: "relative", width: "100%", cursor: "pointer" }}
                  onClick={handleSubmit}
                  disabled={status === "sending" || status === "success"}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Outer glow */}
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    style={{
                      position: "absolute", inset: -1,
                      background: "linear-gradient(135deg, #c9a96e, #8b6914)",
                      borderRadius: 2,
                      filter: "blur(8px)",
                      zIndex: 0,
                    }}
                  />

                  <div
                    style={{
                      position: "relative", zIndex: 1,
                      background: status === "success" ? "#1a2a1a" : "linear-gradient(135deg, #c9a96e 0%, #8b6914 50%, #c9a96e 100%)",
                      backgroundSize: "200% auto",
                      padding: "1.1rem 2rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.75rem",
                      borderRadius: 2,
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.25em",
                      color: status === "success" ? "#6abf6a" : "#0d0b09",
                      textTransform: "uppercase",
                      transition: "background 0.5s",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {status === "idle" && (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          Transmit Message
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                          </svg>
                        </motion.span>
                      )}
                      {status === "sending" && (
                        <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #0d0b09", borderTopColor: "transparent", borderRadius: "50%" }}
                          />
                          Transmitting…
                        </motion.span>
                      )}
                      {status === "success" && (
                        <motion.span key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          ✦ Message Delivered
                        </motion.span>
                      )}
                      {status === "error" && (
                        <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          ⚠ Transmission Failed - Retry
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Fine print */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  style={{ textAlign: "center", color: "#3a3530", fontSize: "0.65rem", marginTop: "1.2rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
                >
                  Encrypted · Never shared · Read personally
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}