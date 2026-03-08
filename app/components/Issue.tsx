'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Bug, Terminal, Zap, Radio } from 'lucide-react';

// Inject global keyframes
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');

  @keyframes scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(400%); }
  }
  @keyframes flicker {
    0%, 95%, 100% { opacity: 1; }
    96% { opacity: 0.4; }
    97% { opacity: 1; }
    98% { opacity: 0.2; }
    99% { opacity: 0.9; }
  }
  @keyframes glitch-1 {
    0%, 100% { clip-path: inset(0 0 98% 0); transform: translate(-4px, 0); }
    20% { clip-path: inset(30% 0 50% 0); transform: translate(4px, 0); }
    40% { clip-path: inset(60% 0 20% 0); transform: translate(-2px, 0); }
    60% { clip-path: inset(80% 0 5% 0); transform: translate(3px, 0); }
    80% { clip-path: inset(10% 0 75% 0); transform: translate(-3px, 0); }
  }
  @keyframes glitch-2 {
    0%, 100% { clip-path: inset(50% 0 30% 0); transform: translate(4px, 0); opacity: 0; }
    25% { clip-path: inset(10% 0 60% 0); transform: translate(-4px, 0); opacity: 0.8; }
    50% { clip-path: inset(70% 0 10% 0); transform: translate(2px, 0); opacity: 0.5; }
    75% { clip-path: inset(20% 0 55% 0); transform: translate(-2px, 0); opacity: 0.7; }
  }
  @keyframes borderPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(2deg); }
  }
  @keyframes dataScroll {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
  @keyframes ping-slow {
    0% { transform: scale(1); opacity: 0.8; }
    70%, 100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes neon-flicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
      text-shadow: 0 0 4px #ff3030, 0 0 11px #ff3030, 0 0 19px #ff3030, 0 0 40px #ff0000;
    }
    20%, 24%, 55% {
      text-shadow: none;
    }
  }
  @keyframes orb-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.05); }
    66% { transform: translate(-20px, 15px) scale(0.95); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes counter-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .glitch-text {
    position: relative;
  }
  .glitch-text::before,
  .glitch-text::after {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0; right: 0;
    background: inherit;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .glitch-text::before {
    color: #ff003c;
    animation: glitch-1 4s infinite linear;
  }
  .glitch-text::after {
    color: #00e5ff;
    animation: glitch-2 4s infinite linear;
  }

  .scan-line {
    animation: scan 3s linear infinite;
  }
  .flicker {
    animation: flicker 6s infinite;
  }
  .border-pulse {
    animation: borderPulse 2s ease-in-out infinite;
  }
  .float-anim {
    animation: float 4s ease-in-out infinite;
  }
  .ticker-anim {
    animation: ticker 20s linear infinite;
  }
  .orb-drift {
    animation: orb-drift 8s ease-in-out infinite;
  }
  .neon-text {
    animation: neon-flicker 5s infinite;
  }
`;

function DataStream() {
  const lines = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    text: [
      'ERR_0x4F2A :: STACK_OVERFLOW',
      'MEMORY_LEAK :: 0xDEADBEEF',
      'NULL_PTR_EXCEPTION',
      'RACE_CONDITION_DETECTED',
      'CORRUPTION :: SECTOR_7',
      'SEGFAULT :: core dumped',
      'CRITICAL :: heap exhausted',
      '> analyzing trace...',
      '> scanning modules...',
      'BUG_REPORT :: pending',
    ][i % 10],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div
        style={{ animation: 'dataScroll 15s linear infinite' }}
        className="flex flex-col gap-2 opacity-[0.07]"
      >
        {[...lines, ...lines].map((l, i) => (
          <div
            key={i}
            className="font-mono text-xs text-red-400 whitespace-nowrap px-4"
            style={{ letterSpacing: '0.05em' }}
          >
            <span className="text-red-600 mr-2">[{String(i % 20).padStart(3, '0')}]</span>
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarRing() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
      {[1, 1.4, 1.8].map((scale, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border border-red-500/10"
          style={{
            transform: `scale(${scale})`,
            animation: `ping-slow ${2 + i * 0.7}s cubic-bezier(0, 0, 0.2, 1) infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

function HexGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon
            points="28,4 52,16 52,40 28,52 4,40 4,16"
            fill="none"
            stroke="#ef4444"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
    </svg>
  );
}

export default function IssueSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // inject styles once
    const id = 'issue-section-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section
      className="relative py-32 px-4 overflow-hidden"
      style={{ background: '#080808', fontFamily: "'Syne', sans-serif" }}
    >
      {/* ── Atmosphere ───────────────────────────────────────── */}
      <HexGrid />

      {/* Ambient orbs */}
      <div
        className="orb-drift absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="orb-drift absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animationDelay: '-4s',
        }}
      />

      {/* Top ticker */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden h-8 border-b border-red-900/30 flex items-center bg-red-950/10">
        <div className="ticker-anim flex gap-16 whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex gap-16">
              {['SYSTEM ANOMALY DETECTED', 'BUG BOUNTY ACTIVE', 'REPORT A GLITCH', 'REWARD PENDING'].map(
                (t, j) => (
                  <span
                    key={j}
                    className="text-[10px] font-mono tracking-[0.2em] text-red-500/60 flex items-center gap-3"
                  >
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500/60" />
                    {t}
                  </span>
                )
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main Card ─────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto relative z-10 mt-6">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 100%)',
            border: '1px solid rgba(239,68,68,0.2)',
            boxShadow: hovered
              ? '0 0 0 1px rgba(239,68,68,0.5), 0 0 60px rgba(239,68,68,0.1), inset 0 0 60px rgba(0,0,0,0.5)'
              : '0 0 0 1px rgba(239,68,68,0.15), 0 0 40px rgba(0,0,0,0.8)',
            transition: 'box-shadow 0.4s ease',
          }}
        >
          {/* Data stream background */}
          <DataStream />

          {/* Scan line */}
          <div
            className="scan-line absolute left-0 right-0 h-[2px] pointer-events-none z-10"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.3), transparent)',
              top: 0,
            }}
          />

          {/* Cursor spotlight */}
          {hovered && (
            <div
              className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
              style={{
                opacity: 1,
                background: `radial-gradient(480px circle at ${mouse.x}px ${mouse.y}px, rgba(239,68,68,0.07), transparent 60%)`,
              }}
            />
          )}

          {/* Corner brackets */}
          {[
            ['top-3 left-3', 'border-t border-l'],
            ['top-3 right-3', 'border-t border-r'],
            ['bottom-3 left-3', 'border-b border-l'],
            ['bottom-3 right-3', 'border-b border-r'],
          ].map(([pos, borders], i) => (
            <div
              key={i}
              className={`absolute ${pos} w-5 h-5 border-red-500/40 ${borders} pointer-events-none`}
              style={{ borderWidth: '1.5px' }}
            />
          ))}

          {/* Content */}
          <div className="relative z-20 px-12 py-16 text-center">
            {/* ── Icon cluster ── */}
            <div className="flex justify-center mb-10">
              <div className="relative">
                {/* Outer spinning ring */}
                <div
                  className="absolute -inset-8 rounded-full border border-dashed border-red-500/20"
                  style={{ animation: 'spin-slow 12s linear infinite' }}
                />
                {/* Inner counter-spin ring */}
                <div
                  className="absolute -inset-5 rounded-full border border-red-500/30"
                  style={{ animation: 'counter-spin 8s linear infinite' }}
                >
                  {[0, 90, 180, 270].map((deg, i) => (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-red-500"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${deg}deg) translateX(20px) translateY(-50%)`,
                      }}
                    />
                  ))}
                </div>
                {/* Core icon */}
                <div
                  className="float-anim relative w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(220,38,38,0.2), rgba(239,68,68,0.05))',
                    border: '1px solid rgba(239,68,68,0.4)',
                    boxShadow: '0 0 30px rgba(239,68,68,0.2), inset 0 0 20px rgba(239,68,68,0.05)',
                  }}
                >
                  <AlertTriangle
                    className="w-9 h-9 text-red-400 flicker"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* ── Status badge ── */}
            <div className="flex justify-center mb-6">
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.15em] text-red-400/80 border border-red-500/20"
                style={{ background: 'rgba(239,68,68,0.05)' }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"
                  style={{ animation: 'blink 1s step-end infinite' }}
                />
                INCIDENT RESPONSE ACTIVE
                <Radio className="w-3 h-3" />
              </div>
            </div>

            {/* ── Headline ── */}
            <div className="relative inline-block mb-2">
              <h2
                className="glitch-text text-5xl sm:text-6xl font-extrabold tracking-tight"
                data-text="Found a Glitch?"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #ff6b6b 50%, #dc2626 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                Found a Glitch?
              </h2>
            </div>

            <div
              className="font-mono text-xs tracking-widest mb-6 neon-text"
              style={{ color: '#ef4444', textShadow: '0 0 8px #ef4444' }}
            >
              ▸ SYSTEM INTEGRITY COMPROMISED
            </div>

            <p
              className="mx-auto max-w-lg text-base leading-relaxed mb-10"
              style={{
                color: 'rgba(255,255,255,0.4)',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.9rem',
              }}
            >
              If you've encountered a bug or performance anomaly, report it immediately.
              <br />
              <span style={{ color: 'rgba(239,68,68,0.7)' }}>We reward rigorous bug hunters</span> - no issue is too
              small.
            </p>

            {/* ── Stats row ── */}
            <div className="flex justify-center gap-8 mb-10">
              {[
                { val: '847', label: 'Bugs Closed' },
                { val: '$12K', label: 'Bounties Paid' },
                { val: '4.2h', label: 'Avg Response' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-2xl font-bold tabular-nums"
                    style={{
                      background: 'linear-gradient(180deg, #fff 0%, #ef4444 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {val}
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-zinc-600 mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              className="mx-auto mb-10 h-px w-48"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)',
              }}
            />

            {/* ── CTA Buttons ── */}
            <div className="flex flex-wrap justify-center gap-4">
              {/* Primary */}
              <Link href="/ApplyForIssue">
                <button
                  className="group relative flex items-center gap-2 px-7 py-3.5 text-sm font-bold tracking-wide overflow-hidden rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                    color: '#fff',
                    boxShadow: '0 0 20px rgba(220,38,38,0.4)',
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: '0.05em',
                  }}
                >
                  {/* Shimmer */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                      backgroundSize: '200% 100%',
                      animation: 'none',
                    }}
                  />
                  <Bug className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">Report a Bug</span>
                  <Zap className="h-3 w-3 relative z-10 opacity-60" />
                </button>
              </Link>

              {/* Secondary */}
              <button
                className="group flex items-center gap-2 px-7 py-3.5 text-sm font-medium rounded-lg transition-all duration-300"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.6)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.05)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.25)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <Terminal className="h-4 w-4" />
                View Status Log
              </button>
            </div>

            {/* Bottom micro copy */}
            <p className="mt-6 text-[10px] font-mono tracking-widest text-zinc-700">
              SLA: P0 BUGS ADDRESSED WITHIN 24H · BOUNTIES PAID IN CRYPTO OR USD
            </p>
          </div>

          {/* Radar rings behind content */}
          <RadarRing />
        </div>
      </div>

      {/* ── Side decorations ── */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-20 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-px bg-red-500"
            style={{ width: `${8 + (i % 3) * 6}px`, opacity: 0.6 - i * 0.06 }}
          />
        ))}
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-20 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-px bg-red-500 ml-auto"
            style={{ width: `${8 + (i % 3) * 6}px`, opacity: 0.6 - i * 0.06 }}
          />
        ))}
      </div>

      {/* Bottom ticker */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-7 border-t border-red-900/30 flex items-center bg-red-950/5">
        <div className="ticker-anim flex gap-16 whitespace-nowrap" style={{ animationDirection: 'reverse' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex gap-16">
              {['ZERO-DAY BOUNTY', 'SUBMIT YOUR REPORT', 'REWARDS UP TO $10K', 'HUNTERS WANTED'].map(
                (t, j) => (
                  <span
                    key={j}
                    className="text-[10px] font-mono tracking-[0.2em] text-red-500/40 flex items-center gap-3"
                  >
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500/40" />
                    {t}
                  </span>
                )
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}