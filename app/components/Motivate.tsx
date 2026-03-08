"use client";
import { useState, useEffect, useRef } from "react";


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=IBM+Plex+Mono:wght@300;400&display=swap');

.m-root *, .m-root *::before, .m-root *::after {
  box-sizing: border-box; margin: 0; padding: 0;
}
.m-root a { text-decoration: none; color: inherit; }
.m-root button { cursor: pointer; font: inherit; border: none; background: none; }

.m-root {
  --bg:     #060810;
  --bg1:    #0b0d18;
  --bg2:    #0f1120;
  --lime:   #c8ff00;
  --lime2:  #9fcc00;
  --white:  #f0f2ff;
  --dim:    #2a2d3e;
  --mute:   #525670;
  --ghost:  #8589a0;
  --border: rgba(200,255,0,0.1);

  background: var(--bg);
  color: var(--white);
  font-family: 'IBM Plex Mono', monospace;
  overflow-x: hidden;
  position: relative;
  isolation: isolate;
}

/* noise overlay */
.m-noise {
  position: absolute; inset: 0; z-index: 1;
  pointer-events: none; opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px;
}

.m-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.m-wrap   { position: relative; z-index: 2; }

/* ═══════════════ HERO ═══════════════ */
.m-hero {
  min-height: 100vh;
  display: grid; place-items: center;
  padding: 6rem 2rem 5rem;
  position: relative; overflow: hidden;
}

/* moving grid */
.m-hero-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px);
  background-size: 80px 80px;
  animation: m-grid-move 24s linear infinite;
}
@keyframes m-grid-move {
  from { background-position: 0 0; }
  to   { background-position: 80px 80px; }
}

/* radial vignette over grid */
.m-hero-vignette {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, var(--bg) 100%);
}

/* centre lime glow */
.m-hero-glow {
  position: absolute;
  width: 700px; height: 350px; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(200,255,0,0.07) 0%, transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  animation: m-breathe 5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes m-breathe {
  0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: 0.7; }
  50%      { transform: translate(-50%,-50%) scale(1.2); opacity: 1;   }
}

.m-hero-inner {
  position: relative; z-index: 1;
  text-align: center;
  display: flex; flex-direction: column; align-items: center;
}

.m-tag {
  font-size: 0.58rem; letter-spacing: 0.5em; text-transform: uppercase;
  color: var(--lime); opacity: 0.65; margin-bottom: 3rem;
  animation: m-up 1s ease 0.1s both;
}

/* headline */
.m-h1 {
  font-family: 'Anton', sans-serif;
  font-size: clamp(4rem, 13vw, 13rem);
  line-height: 0.85; letter-spacing: 0.01em;
  text-align: center;
  animation: m-up 1.1s cubic-bezier(0.16,1,0.3,1) 0.25s both;
}
.m-h1-solid   { color: var(--white); display: block; }
.m-h1-outline {
  display: block; color: transparent;
  -webkit-text-stroke: 1.5px var(--lime); text-stroke: 1.5px var(--lime);
  opacity: 0.45;
}
.m-h1-lime {
  color: var(--lime); display: inline-block;
  position: relative;
  text-shadow: 0 0 60px rgba(200,255,0,0.3);
}
/* underline draw */
.m-h1-lime::after {
  content: ''; position: absolute;
  left: 0; right: 0; bottom: -6px; height: 4px;
  background: var(--lime);
  transform-origin: left; transform: scaleX(0);
  animation: m-draw 0.9s cubic-bezier(0.77,0,0.175,1) 1.5s forwards;
  box-shadow: 0 0 16px var(--lime);
}
@keyframes m-draw { to { transform: scaleX(1); } }
.m-h1-sub {
  display: block; color: transparent;
  font-size: 0.5em; letter-spacing: 0.18em; margin-top: 0.35em;
  -webkit-text-stroke: 1px rgba(200,255,0,0.35);
}

.m-sub {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: clamp(1rem, 2.2vw, 1.5rem);
  color: var(--ghost); margin-top: 3.5rem;
  max-width: 520px; line-height: 1.65;
  animation: m-up 1s ease 0.8s both;
}
.m-sub em { color: var(--lime); font-style: normal; }

/* scroll cue */
.m-scroll {
  position: absolute; bottom: 2.5rem; left: 50%;
  transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  z-index: 1; animation: m-up 1s ease 2s both;
}
.m-scroll-txt { font-size: 0.47rem; letter-spacing: 0.55em; color: var(--mute); text-transform: uppercase; }
.m-scroll-bar {
  width: 1px; height: 55px;
  background: linear-gradient(to bottom, var(--lime), transparent);
  animation: m-drip 2.2s ease-in-out infinite;
}
@keyframes m-drip {
  0%   { clip-path: inset(0 0 100% 0); }
  50%  { clip-path: inset(0 0 0% 0); }
  100% { clip-path: inset(100% 0 0 0); }
}

/* ═══════════════ TICKER ═══════════════ */
.m-ticker {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg1);
  overflow: hidden; padding: 1rem 0; position: relative;
}
.m-ticker::before, .m-ticker::after {
  content: ''; position: absolute; top: 0; bottom: 0; width: 100px; z-index: 1; pointer-events: none;
}
.m-ticker::before { left: 0; background: linear-gradient(90deg, var(--bg1), transparent); }
.m-ticker::after  { right: 0; background: linear-gradient(-90deg, var(--bg1), transparent); }
.m-ticker-track {
  display: flex; width: max-content;
  animation: m-roll 22s linear infinite;
}
.m-ticker-track:hover { animation-play-state: paused; }
@keyframes m-roll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.m-ticker-item {
  display: flex; align-items: center; gap: 2rem; padding: 0 2.5rem;
  font-family: 'Anton', sans-serif; font-size: 0.8rem;
  letter-spacing: 0.3em; text-transform: uppercase; white-space: nowrap;
  color: var(--mute);
}
.m-ticker-item.hi { color: var(--lime); }
.m-ticker-sep     { font-size: 0.45rem; opacity: 0.4; color: var(--lime); }

/* ═══════════════ CORE QUOTE ═══════════════ */
.m-core {
  padding: 10rem 2rem 9rem;
  text-align: center; position: relative; overflow: hidden;
}
.m-core-ghost {
  position: absolute;
  font-family: 'Anton', sans-serif;
  font-size: clamp(10rem, 28vw, 30rem);
  color: transparent; -webkit-text-stroke: 1px rgba(200,255,0,0.03);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  user-select: none; pointer-events: none;
  line-height: 1; white-space: nowrap; letter-spacing: -0.04em;
}
.m-core-eyebrow {
  font-size: 0.57rem; letter-spacing: 0.5em; text-transform: uppercase;
  color: var(--lime); opacity: 0.6; margin-bottom: 3rem; position: relative; z-index: 1;
}
.m-core-q {
  font-family: 'Cormorant Garamond', serif; font-weight: 600;
  font-size: clamp(2rem, 5vw, 4.5rem); line-height: 1.25;
  max-width: 900px; margin: 0 auto 1rem;
  color: var(--white); position: relative; z-index: 1;
}
.m-core-q .kw { color: var(--lime); }
.m-core-q2 {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: clamp(1.2rem, 2.5vw, 2rem);
  color: var(--ghost); max-width: 700px; margin: 0 auto 1rem;
  position: relative; z-index: 1;
}
.m-core-q2 .kw { color: var(--lime); font-style: normal; }
.m-core-attr {
  font-size: 0.57rem; letter-spacing: 0.4em; color: var(--mute);
  text-transform: uppercase; margin-top: 2rem; position: relative; z-index: 1;
}

/* ═══════════════ DIVIDER ═══════════════ */
.m-divider {
  display: flex; align-items: center; gap: 1.5rem;
  padding: 0 2rem; max-width: 1100px; margin: 0 auto; opacity: 0.2;
}
.m-div-line { flex: 1; height: 1px; background: var(--lime); }
.m-div-txt  { font-size: 0.5rem; letter-spacing: 0.5em; text-transform: uppercase; color: var(--lime); white-space: nowrap; }

/* ═══════════════ CYCLE CARDS ═══════════════ */
.m-cycle { padding: 7rem 2rem; max-width: 1200px; margin: 0 auto; }
.m-sec-eye {
  font-size: 0.57rem; letter-spacing: 0.5em; text-transform: uppercase;
  color: var(--mute); margin-bottom: 0.6rem;
}
.m-sec-h {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2.5rem, 6vw, 5.5rem);
  line-height: 0.9; letter-spacing: 0.01em;
  margin-bottom: 4rem; color: var(--white);
}
.m-sec-h span { color: var(--lime); }

.m-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1px; background: var(--dim);
}
.m-card {
  background: var(--bg1); padding: 3rem 2.2rem;
  position: relative; overflow: hidden;
  transition: background 0.4s ease, transform 0.45s cubic-bezier(0.23,1,0.32,1);
}
/* top border draw */
.m-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: var(--lime);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.5s cubic-bezier(0.77,0,0.175,1);
  box-shadow: 0 0 10px var(--lime);
}
.m-card:hover { background: var(--bg2); transform: translateY(-6px); }
.m-card:hover::before { transform: scaleX(1); }

/* ghost number in corner */
.m-card-ghost {
  position: absolute; font-family: 'Anton', sans-serif;
  font-size: 9rem; line-height: 1; color: transparent;
  -webkit-text-stroke: 1px rgba(200,255,0,0.04);
  bottom: -1rem; right: 1rem;
  user-select: none; pointer-events: none;
  transition: transform 0.4s ease;
}
.m-card:hover .m-card-ghost { transform: scale(1.06); }

.m-card-num  { font-size: 0.52rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--mute); margin-bottom: 2.5rem; display: block; }
.m-card-t    { font-family: 'Anton', sans-serif; font-size: 3.5rem; line-height: 1; color: var(--white); margin-bottom: 1.5rem; transition: color 0.3s ease; }
.m-card:hover .m-card-t { color: var(--lime); text-shadow: 0 0 40px rgba(200,255,0,0.25); }
.m-card-b    { font-size: 0.73rem; line-height: 2; color: var(--ghost); }

/* ═══════════════ STATS ═══════════════ */
.m-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.m-stat {
  padding: 3.5rem 2rem; border-right: 1px solid var(--border);
  text-align: center; position: relative; overflow: hidden;
  transition: background 0.3s ease;
}
.m-stat:last-child { border-right: none; }
.m-stat:hover { background: var(--bg1); }
.m-stat::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: var(--lime); transform: scaleX(0);
  transition: transform 0.5s ease; box-shadow: 0 0 8px var(--lime);
}
.m-stat:hover::before { transform: scaleX(1); }
.m-stat-n {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2.8rem, 5vw, 4.5rem); color: var(--lime);
  display: block; line-height: 1; text-shadow: 0 0 40px rgba(200,255,0,0.25);
}
.m-stat-l { font-size: 0.57rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--mute); margin-top: 0.7rem; }

/* ═══════════════ QUOTES ═══════════════ */
.m-quotes {
  padding: 9rem 2rem;
  background: var(--bg1);
  text-align: center; position: relative; overflow: hidden;
}
.m-quotes::before {
  content: '\\201C'; position: absolute;
  font-family: 'Cormorant Garamond', serif;
  font-size: min(40vw, 36rem); line-height: 0.75;
  color: transparent; -webkit-text-stroke: 1px rgba(200,255,0,0.04);
  top: 0; left: 50%; transform: translateX(-50%);
  user-select: none; pointer-events: none;
}
.m-quote-box { position: relative; z-index: 1; max-width: 780px; margin: 0 auto; }
.m-q-txt {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: clamp(1.5rem, 3.2vw, 2.6rem); color: var(--white);
  line-height: 1.45; min-height: 9rem;
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.m-q-txt.out { opacity: 0; transform: translateY(-14px); }
.m-q-txt.in  { opacity: 0; transform: translateY(14px);  }
.m-q-auth {
  font-size: 0.57rem; letter-spacing: 0.45em; text-transform: uppercase;
  color: var(--lime); margin-top: 2rem; transition: opacity 0.45s ease;
}
.m-q-auth.fade { opacity: 0; }
.m-q-dots { display: flex; gap: 0.6rem; justify-content: center; margin-top: 2.5rem; }
.m-q-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--dim); cursor: pointer; transition: all 0.3s ease;
}
.m-q-dot.on { background: var(--lime); box-shadow: 0 0 8px var(--lime); transform: scale(1.4); }

/* ═══════════════ TERMINAL ═══════════════ */
.m-term-wrap { padding: 7rem 2rem; max-width: 720px; margin: 0 auto; }
.m-term-eye  { font-size: 0.57rem; letter-spacing: 0.5em; text-transform: uppercase; color: var(--mute); margin-bottom: 1.8rem; }
.m-term {
  border: 1px solid rgba(200,255,0,0.12); background: #060810;
  box-shadow: 0 0 80px rgba(200,255,0,0.05), inset 0 1px 0 rgba(255,255,255,0.03);
}
.m-term-bar {
  background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(200,255,0,0.08);
  padding: 0.75rem 1.2rem; display: flex; align-items: center; gap: 0.5rem;
}
.m-dot        { width: 10px; height: 10px; border-radius: 50%; }
.m-term-title { font-size: 0.55rem; letter-spacing: 0.25em; color: var(--mute); margin-left: auto; }
.m-term-body  { padding: 1.8rem; font-size: 0.77rem; line-height: 2.2; }
.m-tl  { display: flex; gap: 0.7rem; }
.m-tp  { color: var(--lime); flex-shrink: 0; }
.m-tc  { color: var(--white); }
.m-te  { color: #ff6b6b; padding-left: 1.5rem; }
.m-ti  { color: var(--mute); padding-left: 1.5rem; font-style: italic; }
.m-ts  { color: #7fff6e; padding-left: 1.5rem; }
.m-tg  { color: var(--lime); padding-left: 1.5rem; }
.m-cursor {
  display: inline-block; width: 8px; height: 1em;
  background: var(--lime); vertical-align: text-bottom;
  animation: m-blink 1s step-end infinite;
}
@keyframes m-blink { 50% { opacity: 0; } }

/* ═══════════════ MANIFESTO ═══════════════ */
.m-mani { padding: 7rem 2rem 9rem; max-width: 1100px; margin: 0 auto; }
.m-mani-lines { margin-top: 3rem; }
.m-mline {
  display: block; font-family: 'Anton', sans-serif;
  font-size: clamp(2rem, 5.5vw, 5.5rem);
  line-height: 1.05; letter-spacing: 0.01em;
  color: var(--dim); padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  cursor: default; transition: color 0.3s ease;
  position: relative; overflow: hidden;
}
.m-mline::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(200,255,0,0.04), transparent 60%);
  transform: translateX(-110%);
  transition: transform 0.45s cubic-bezier(0.77,0,0.175,1);
}
.m-mline:hover { color: var(--white); }
.m-mline:hover::after { transform: translateX(0); }
.m-mline .hl { color: rgba(200,255,0,0.3); transition: color 0.3s ease, text-shadow 0.3s ease; }
.m-mline:hover .hl { color: var(--lime); text-shadow: 0 0 30px rgba(200,255,0,0.4); }

/* ═══════════════ CTA ═══════════════ */
.m-cta {
  padding: 8rem 2rem; text-align: center;
  position: relative; overflow: hidden;
}
/* ambient glow */
.m-cta::before {
  content: ''; position: absolute;
  width: 900px; height: 400px; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(200,255,0,0.05) 0%, transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  animation: m-breathe 5s ease-in-out infinite; pointer-events: none;
}
/* horizontal scan line */
.m-cta::after {
  content: ''; position: absolute;
  left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200,255,0,0.3), transparent);
  animation: m-scan 4s ease-in-out infinite; pointer-events: none;
}
@keyframes m-scan {
  0%   { top: 5%; opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { top: 95%; opacity: 0; }
}
.m-cta-inner { position: relative; z-index: 1; }
.m-cta-label { font-size: 0.57rem; letter-spacing: 0.5em; text-transform: uppercase; color: var(--lime); opacity: 0.6; margin-bottom: 1.5rem; }
.m-cta-h {
  font-family: 'Anton', sans-serif;
  font-size: clamp(3rem, 9vw, 9rem);
  line-height: 0.88; letter-spacing: 0.01em;
  color: var(--white); margin-bottom: 1.5rem;
}
.m-cta-h span { color: var(--lime); text-shadow: 0 0 60px rgba(200,255,0,0.3); }
.m-cta-sub {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: clamp(1rem, 2vw, 1.4rem);
  color: var(--ghost); margin-bottom: 3.5rem;
}
.m-cta-btns { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
.m-btn {
  padding: 1rem 2.8rem; font-family: 'IBM Plex Mono', monospace;
  font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
  transition: all 0.3s ease;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
}
.m-btn-p { background: var(--lime); color: var(--bg); }
.m-btn-p:hover { background: var(--white); transform: translateY(-3px); box-shadow: 0 16px 40px rgba(200,255,0,0.25); }
.m-btn-o { background: transparent; color: var(--ghost); outline: 1px solid var(--dim); }
.m-btn-o:hover { outline-color: var(--lime); color: var(--lime); transform: translateY(-3px); }

/* ═══════════════ SHARED ═══════════════ */
@keyframes m-up {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* responsive */
@media (max-width: 640px) {
  .m-grid { grid-template-columns: 1fr; }
  .m-stats { grid-template-columns: 1fr 1fr; }
  .m-stats .m-stat:nth-child(2) { border-right: none; }
  .m-stats .m-stat:nth-child(3) { border-right: 1px solid var(--border); }
}
`;

/* ── DATA ── */
const QUOTES = [
  { text: "Try again. Fail again. Fail better.", author: "Samuel Beckett" },
  { text: "The master has failed more times than the beginner has even tried.", author: "Stephen McCranie" },
  { text: "Success is stumbling from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { text: "Fall seven times. Stand up eight.", author: "Japanese Proverb" },
  { text: "I have not failed. I've found 10,000 ways that won't work.", author: "Thomas Edison" },
];

const CARDS = [
  { n: "01", title: "TRY",   body: "Every great journey begins with one terrifying first attempt. The courage to start is rarer than the talent to finish." },
  { n: "02", title: "FAIL",  body: "Failure is not your enemy - it's the world handing you data. Each error narrows every wrong path to one right one." },
  { n: "03", title: "LEARN", body: "Extract signal from noise. The best engineers are not mistake-free - they are mistake-aware and ruthlessly reflective." },
  { n: "04", title: "RISE",  body: "The phoenix needs fire to be reborn. You needed failure to become who you are still in the process of becoming." },
];

const MANIFESTO = [
  { pre: "WE SHIP WITH ",    hl: "SCARS"           },
  { pre: "NOT ",             hl: "PERFECT PLANS"   },
  { pre: "BROKEN BUILDS ",   hl: "TEACH MORE"      },
  { pre: "THAN ",            hl: "FLAWLESS DEMOS"  },
  { pre: "FAILURE IS ",      hl: "TUITION"         },
  { pre: "PAID IN ",         hl: "LATE NIGHTS"     },
  { pre: "THE DEGREE? ",     hl: "UNBREAKABLE GRIT"},
];

const TICKERS = ["TRY AGAIN", "FAIL BETTER", "NEVER STOP TRYING", "BUILD", "BREAK", "SHIP", "REPEAT", "ITERATE", "PERSIST", "GROW"];

/* ── CANVAS ── */
function BgCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cvs = ref.current!;
    const ctx = cvs.getContext("2d")!;
    let W = cvs.width = window.innerWidth;
    let H = cvs.height = window.innerHeight;
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.2, o: Math.random() * 0.25 + 0.05,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,255,0,${p.o})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(200,255,0,${0.06 * (1 - d / 100)})`;
            ctx.lineWidth = 0.4; ctx.stroke();
          }
        }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = cvs.width = window.innerWidth; H = cvs.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="m-canvas" />;
}

/* ── MAIN ── */
export default function MotivationPage() {
  const [qIdx, setQIdx]   = useState(0);
  const [phase, setPhase] = useState<"show" | "out" | "in">("show");

  const goTo = (i: number) => {
    if (i === qIdx) return;
    setPhase("out");
    setTimeout(() => { setQIdx(i); setPhase("in"); setTimeout(() => setPhase("show"), 50); }, 420);
  };

  useEffect(() => {
    const t = setInterval(() => goTo((qIdx + 1) % QUOTES.length), 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line
  }, [qIdx]);

  const qCls = `m-q-txt${phase === "out" ? " out" : phase === "in" ? " in" : ""}`;
  const aCls = `m-q-auth${phase !== "show" ? " fade" : ""}`;

  return (
    <div className="m-root">
      <style>{CSS}</style>
      <BgCanvas />
      <div className="m-noise" />

      <div className="m-wrap">

        {/* HERO */}
        <section className="m-hero">
          <div className="m-hero-grid" />
          <div className="m-hero-vignette" />
          <div className="m-hero-glow" />
          <div className="m-hero-inner">
            <p className="m-tag">◆ CodeNFacts - Developer Mindset Series ◆</p>
            <h1 className="m-h1">
              <span className="m-h1-solid">TRY AGAIN</span>
              <span className="m-h1-outline">FAIL AGAIN</span>
              <span className="m-h1-lime">FAIL BETTER</span>
              <span className="m-h1-sub">NEVER &nbsp; STOP &nbsp; TRYING</span>
            </h1>
            <p className="m-sub">
              Three words that rewired the world's greatest builders.<br />
              <em>Fail better</em> - not less, not never. <em>Better.</em>
            </p>
          </div>
        </section>

        {/* TICKER */}
        <div className="m-ticker">
          <div className="m-ticker-track">
            {Array(3).fill(TICKERS).flat().map((w, i) => (
              <span key={i} className={`m-ticker-item${i % 4 === 0 ? " hi" : ""}`}>
                {w}<span className="m-ticker-sep">◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* CORE QUOTE */}
        <section className="m-core">
          <div className="m-core-ghost">FAIL</div>
          <p className="m-core-eyebrow">// The words that change everything</p>
          <p className="m-core-q">
            "<span className="kw">Fall</span> Down.{" "}
            <span className="kw">Get</span> Up.{" "}"
          </p>
          <p className="m-core-q2">
            "<span className="kw">Repeat</span> better."
          </p>
          <p className="m-core-attr">- The CodeNFacts Creed</p>
        </section>

        {/* DIVIDER */}
        <div className="m-divider">
          <div className="m-div-line" />
          <span className="m-div-txt">The Cycle of Growth</span>
          <div className="m-div-line" />
        </div>

        {/* CARDS */}
        <section className="m-cycle">
          <p className="m-sec-eye">// Four stages every master passes through</p>
          <h2 className="m-sec-h">THE <span>RELENTLESS</span><br />CYCLE</h2>
          <div className="m-grid">
            {CARDS.map(c => (
              <div key={c.n} className="m-card">
                <span className="m-card-ghost">{c.n}</span>
                <span className="m-card-num">{c.n} /</span>
                <div className="m-card-t">{c.title}</div>
                <p className="m-card-b">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STATS */}
        <div className="m-stats">
          {[
            { v: "∞",    l: "Attempts you're allowed" },
            { v: "0",    l: "Failures that define you" },
            { v: "1",    l: "Rule: Never stop trying"  },
            { v: "100%", l: "Grit required to win"     },
          ].map((s, i) => (
            <div key={i} className="m-stat">
              <span className="m-stat-n">{s.v}</span>
              <div className="m-stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        {/* QUOTES */}
        <section className="m-quotes">
          <p className="m-sec-eye" style={{ position: "relative", zIndex: 1, marginBottom: "3.5rem" }}>
            // Words of those who endured
          </p>
          <div className="m-quote-box">
            <p className={qCls}>"{QUOTES[qIdx].text}"</p>
            <p className={aCls}>— {QUOTES[qIdx].author}</p>
            <div className="m-q-dots">
              {QUOTES.map((_, i) => (
                <div key={i} className={`m-q-dot${i === qIdx ? " on" : ""}`} onClick={() => goTo(i)} />
              ))}
            </div>
          </div>
        </section>

        {/* TERMINAL */}
        <section className="m-term-wrap">
          <p className="m-term-eye">// Your internal monologue</p>
          <div className="m-term">
            <div className="m-term-bar">
              <div className="m-dot" style={{ background: "#ff5f57" }} />
              <div className="m-dot" style={{ background: "#febc2e" }} />
              <div className="m-dot" style={{ background: "#28c840" }} />
              <span className="m-term-title">persistence.sh — codendfacts.in</span>
            </div>
            <div className="m-term-body">
              <div className="m-tl"><span className="m-tp">$</span><span className="m-tc">node attempt_1.js</span></div>
              <div className="m-te">✗ TypeError: cannot read 'purpose' of undefined</div>
              <div className="m-ti">→ Attempt #1 failed. Studying the crash…</div>
              <br />
              <div className="m-tl"><span className="m-tp">$</span><span className="m-tc">node attempt_2.js</span></div>
              <div className="m-te">✗ RangeError: Maximum call stack exceeded</div>
              <div className="m-ti">→ Attempt #2 failed. Now I understand recursion limits.</div>
              <br />
              <div className="m-tl"><span className="m-tp">$</span><span className="m-tc">node attempt_n.js</span></div>
              <div className="m-ts">✓ All 108 tests passed. Shipped in 0.043s.</div>
              <div className="m-tg">→ The bugs were the curriculum. You just graduated.</div>
              <br />
              <div className="m-tl"><span className="m-tp">$</span><span className="m-cursor" /></div>
            </div>
          </div>
        </section>

        {/* MANIFESTO */}
        <section className="m-mani">
          <p className="m-sec-eye">// The CodeNFacts Manifesto</p>
          <h2 className="m-sec-h" style={{ marginBottom: "2rem" }}>WE <span>BELIEVE</span></h2>
          <div className="m-mani-lines">
            {MANIFESTO.map((l, i) => (
              <span key={i} className="m-mline">
                {l.pre}<span className="hl">{l.hl}</span>
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="m-cta">
          <div className="m-cta-inner">
            <p className="m-cta-label">// Your next attempt is the one that works</p>
            <h2 className="m-cta-h">
              NEVER<br /><span>STOP</span><br />TRYING
            </h2>
            <p className="m-cta-sub">"Every master was once a disaster."</p>
            <div className="m-cta-btns">
              <a href="/login" className="m-btn m-btn-p">Start Building →</a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}