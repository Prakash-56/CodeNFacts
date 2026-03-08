'use client';
import { useState, useEffect, useRef, useCallback } from "react";

// ── DATA ──────────────────────────────────────────────────────
const MINDSETS = [
  { id:1, num:"01", icon:"◈", tag:"GROWTH",  title:"Embrace the Struggle",       accent:"#00E5CC", glow:"rgba(0,229,204,0.25)",  sub:"Every error is the teacher.",          body:"Struggle isn't a failure signal - it's proof that your neurons are forming new connections. The most capable engineers weren't born knowing syntax; they were forged through confusion and breakthrough loops." },
  { id:2, num:"02", icon:"◉", tag:"HABIT",   title:"Consistency Wins Always",    accent:"#39FF9A", glow:"rgba(57,255,154,0.25)", sub:"30 min/day beats 5 hr weekends.",      body:"Your brain encodes skills through spaced repetition and sleep consolidation, not cramming. Compound consistency is the cheat code hidden in plain sight. Show up small. Show up daily." },
  { id:3, num:"03", icon:"◎", tag:"FOCUS",   title:"Your Only Rival: Yesterday", accent:"#FFB347", glow:"rgba(255,179,71,0.25)",  sub:"Measure your delta, not your rank.",   body:"Comparing your chapter one to someone's chapter twenty is how motivation dies. Track only your own progress vector. Every inch forward is a win that belongs solely to you." },
  { id:4, num:"04", icon:"◇", tag:"MINDSET", title:"Confusion = Progress",       accent:"#B07FFF", glow:"rgba(176,127,255,0.25)",sub:"Discomfort means you're expanding.",  body:"When you feel confused, your prefrontal cortex is literally rewiring. That friction is not a wall - it's a door. Sit with it. Break it apart. Ask questions. Clarity always comes after confusion." },
  { id:5, num:"05", icon:"◆", tag:"ACTION",  title:"Ship Ugly. Ship Now.",        accent:"#FF6B9D", glow:"rgba(255,107,157,0.25)",sub:"Building teaches what reading can't.", body:"Theory without application is trivia. The moment you start building - even something broken - you understand at a level no textbook can reach. Imperfect shipped beats perfect imagined." },
  { id:6, num:"06", icon:"◐", tag:"BALANCE", title:"Rest is the Hidden Work",    accent:"#00B4FF", glow:"rgba(0,180,255,0.25)",  sub:"Your brain solves problems in sleep.", body:"REM sleep is when your brain consolidates procedural memory and runs pattern-matching on unsolved problems. Rest isn't laziness - it's when learning becomes mastery. Protect it fiercely." },
];

const MANIFESTO = [
  "I will not quit on hard days. Hard days are the entire curriculum.",
  "I will celebrate understanding, not just completion.",
  "I will ask questions without shame. Questions are intelligence made audible.",
  "I will build before I feel ready. Readiness is constructed, not waited for.",
  "I will rest without guilt. Rest is how learning becomes mastery.",
  "I will measure only my own yesterday, never someone else's today.",
  "Every expert once Googled exactly what I am Googling right now.",
];

const RITUALS = [
  "Reviewed a concept I learned yesterday",
  "Wrote at least 10 meaningful lines of code",
  "Took a break and moved my body intentionally",
  "Avoided comparing myself to others online",
  "Reflected on one thing that clicked today",
];

const AFFIRMATIONS = [
  "I am capable of learning anything I commit to.",
  "Every expert was once exactly where I am standing.",
  "Confusion is not failure - it is the doorway to clarity.",
  "My progress is real and compounding, even when invisible.",
  "I show up daily, and daily showing up transforms everything.",
  "I am not behind. I am exactly where I need to be.",
  "I build, therefore I learn. I learn, therefore I grow.",
];

const RING_MSGS = ["Begin with one action.", "Momentum is forming.", "You're halfway there.", "Strong progress.", "Almost complete.", "You showed up fully today. ✦"];

// ── GLOBAL CSS ────────────────────────────────────────────────
const GCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

  .cnf * { box-sizing: border-box; }
  .cnf { font-family: 'DM Sans', sans-serif; background: #050B18; color: #F0F4FF; overflow-x: hidden; position: relative; }
  .cnf button { font-family: 'IBM Plex Mono', monospace; }

  /* ANIMATIONS */
  @keyframes orbA  { 0%,100%{transform:translate(0,0) scale(1);}40%{transform:translate(40px,-30px) scale(1.06);}70%{transform:translate(-20px,40px) scale(.94);} }
  @keyframes orbB  { 0%,100%{transform:translate(0,0) scale(1);}35%{transform:translate(-30px,25px) scale(.96);}65%{transform:translate(25px,-35px) scale(1.04);} }
  @keyframes mScroll { from{transform:translateX(0);}to{transform:translateX(-50%);} }
  @keyframes ldrRing { 0%{transform:scale(1);opacity:.7;}100%{transform:scale(2);opacity:0;} }
  @keyframes blink  { 0%,100%{opacity:1;}50%{opacity:0;} }
  @keyframes gShift { 0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;} }
  @keyframes pulse2 { 0%,100%{opacity:1;box-shadow:0 0 8px #39FF9A;}50%{opacity:.4;box-shadow:none;} }
  @keyframes slideUp { from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);} }
  @keyframes scanLine { 0%{transform:translateY(-100%);}100%{transform:translateY(100vh);} }
  @keyframes borderGlow { 0%,100%{opacity:.4;}50%{opacity:1;} }
  @keyframes floatUp { 0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);} }

  /* SCROLL REVEAL */
  ._rv { opacity:0; transform:translateY(28px); transition:opacity .75s ease, transform .75s cubic-bezier(.16,1,.3,1); }
  ._rv._on { opacity:1; transform:translateY(0); }
  ._rx { opacity:0; transform:translateX(-24px); transition:opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1); }
  ._rx._on { opacity:1; transform:translateX(0); }

  /* CARD TILT — handled in JS */
  .tcard { transition: transform .4s cubic-bezier(.16,1,.3,1), box-shadow .4s ease; will-change:transform; }

  /* NAV */
  .cnf-nav { position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 56px;display:flex;align-items:center;justify-content:space-between;transition:all .4s ease; }
  .cnf-nav.solid { background:rgba(5,11,24,.88);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,229,204,.07); }

  /* MARQUEE */
  .mq-track { display:flex;animation:mScroll 32s linear infinite;width:max-content; }
  .mq-track:hover { animation-play-state:paused; }

  /* RESPONSIVE */
  @media(max-width:960px) {
    .cnf-grid3 { grid-template-columns:1fr 1fr !important; }
    .cnf-ritual { grid-template-columns:1fr !important; }
    .cnf-stats4 { grid-template-columns:repeat(2,1fr) !important; }
    .cnf-nav { padding:16px 24px !important; }
    .cnf-pad { padding-left:24px !important; padding-right:24px !important; }
  }
  @media(max-width:600px) {
    .cnf-grid3 { grid-template-columns:1fr !important; }
    .cnf-stats4 { grid-template-columns:1fr 1fr !important; }
  }
`;

// ── HOOKS ─────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("_on")),
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("._rv,._rx").forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

function use3DTilt(ref: React.RefObject<HTMLElement>, intensity = 12) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * intensity;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -intensity;
      el.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
      el.style.boxShadow = `0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)`;
    };
    const onLeave = () => { el.style.transform = ""; el.style.boxShadow = ""; };
    el.addEventListener("mousemove", onMove as EventListener);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove as EventListener); el.removeEventListener("mouseleave", onLeave); };
  }, [ref, intensity]);
}

// ── TYPEWRITER ────────────────────────────────────────────────
function Typewriter({ words }: { words: string[] }) {
  const [wi, setWi] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[wi];
    const t = setTimeout(() => {
      if (!del && text.length < word.length) setText(word.slice(0, text.length + 1));
      else if (!del && text.length === word.length) setDel(true);
      else if (del && text.length > 0) setText(text.slice(0, -1));
      else { setDel(false); setWi((i) => (i + 1) % words.length); }
    }, del ? 38 : text.length === word.length ? 2000 : 82);
    return () => clearTimeout(t);
  }, [text, del, wi, words]);

  return (
    <>{text}<span style={{ animation: "blink .9s step-end infinite", color: "#00E5CC" }}>|</span></>
  );
}

// ── COUNTER ───────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let c = 0;
      const go = () => {
        c = Math.min(c + Math.max(1, Math.ceil((to - c) / 10)), to);
        setV(c);
        if (c < to) requestAnimationFrame(go);
      };
      requestAnimationFrame(go);
    }, { threshold: .5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

// ── ORBS ──────────────────────────────────────────────────────
function Orbs() {
  const cfg = [
    { s:500, t:"-8%",  l:"-6%",  c:"rgba(0,229,204,0.11)",   d:20, a:"orbA" },
    { s:360, t:"28%",  r:"-4%",  c:"rgba(57,255,154,0.09)",  d:25, a:"orbB" },
    { s:300, t:"68%",  l:"12%",  c:"rgba(176,127,255,0.10)", d:30, a:"orbA" },
    { s:220, t:"8%",   l:"52%",  c:"rgba(255,179,71,0.07)",  d:16, a:"orbB" },
    { s:180, t:"50%",  r:"20%",  c:"rgba(0,180,255,0.08)",   d:22, a:"orbA" },
  ];
  return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      {cfg.map((o,i) => (
        <div key={i} style={{
          position:"absolute", width:o.s, height:o.s, borderRadius:"50%",
          background:`radial-gradient(circle,${o.c} 0%,transparent 70%)`,
          top:o.t, left:(o as any).l, right:(o as any).r,
          animation:`${o.a} ${o.d}s ease-in-out infinite`,
          filter:"blur(1px)",
        }} />
      ))}
    </div>
  );
}

// ── LOADER ────────────────────────────────────────────────────
function Loader({ done }: { done: boolean }) {
  const [pct, setPct] = useState(0);
  const steps = ["INITIALIZING MINDSET ENGINE","LOADING FOCUS MODULES","CALIBRATING MENTAL STACK","SYSTEM READY"];
  const phase = steps[Math.min(Math.floor((pct / 100) * steps.length), steps.length - 1)];

  useEffect(() => {
    const id = setInterval(() => setPct((p) => Math.min(p + Math.random() * 11 + 4, 100)), 85);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position:"fixed", inset:0, background:"#020810", zIndex:10000,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:36,
      transition:"opacity .9s ease, visibility .9s ease",
      opacity: done ? 0 : 1, visibility: done ? "hidden" : "visible",
    }}>
      {/* Concentric pulsing rings */}
      <div style={{ position:"relative", width:140, height:140, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {[0,1,2,3].map((i) => (
          <div key={i} style={{
            position:"absolute", inset: -i*22,
            border:`1px solid rgba(0,229,204,${.5 - i*.1})`,
            borderRadius:"50%",
            animation:`ldrRing ${1.8}s ${i*.35}s ease-out infinite`,
          }} />
        ))}
        <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:30, fontWeight:600, color:"#00E5CC", letterSpacing:".04em" }}>
          {Math.floor(pct)}<span style={{ fontSize:14, opacity:.5 }}>%</span>
        </div>
      </div>

      <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:44, color:"rgba(255,255,255,.92)", letterSpacing:".06em" }}>
        Code<em style={{ fontStyle:"italic", color:"#00E5CC" }}>N</em>Facts
      </div>

      {/* Bar */}
      <div style={{ width:280, height:1, background:"rgba(255,255,255,.06)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#00E5CC,#39FF9A)", transition:"width .08s linear", boxShadow:"0 0 14px #00E5CC" }} />
      </div>

      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9.5, letterSpacing:".45em", color:"rgba(0,229,204,.5)", textTransform:"uppercase" }}>
        {phase}
      </div>
    </div>
  );
}



// ── HERO ──────────────────────────────────────────────────────
function Hero() {
  const headRef = useRef<HTMLHeadingElement>(null);
  const subRef  = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      if (headRef.current) headRef.current.style.transform = `translateY(${y*.16}px)`;
      if (subRef.current)  subRef.current.style.transform  = `translateY(${y*.09}px)`;
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"120px 56px 80px", position:"relative", textAlign:"center", overflow:"hidden", zIndex:1 }}>
      {/* Center glow blob */}
      <div style={{ position:"absolute", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,229,204,0.07) 0%,transparent 70%)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none", animation:"orbA 18s ease-in-out infinite" }} />

      <p style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".55em", color:"rgba(0,229,204,.6)", textTransform:"uppercase", marginBottom:36, animation:"slideUp .9s .4s ease both" }}>
        CodeNFacts.in &nbsp;·&nbsp; Mindset Edition
      </p>

      <h1 ref={headRef} style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(60px,12vw,150px)", fontWeight:400, lineHeight:.88, letterSpacing:"-.025em", animation:"slideUp 1.1s .65s ease both", willChange:"transform", marginBottom:0 }}>
        <span style={{ display:"block", WebkitTextStroke:"1.5px rgba(255,255,255,.2)", color:"transparent", fontStyle:"italic" }}>Think</span>
        <span style={{ display:"block", background:"linear-gradient(135deg,#00E5CC,#39FF9A,#00B4FF)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", backgroundSize:"200% 200%", animation:"gShift 4s ease-in-out infinite" }}>
          <Typewriter words={["Better.","Deeper.","Sharper.","Bolder."]} />
        </span>
        <span style={{ display:"block", color:"rgba(255,255,255,.92)" }}>Code Smarter.</span>
      </h1>

      <p ref={subRef} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:13, letterSpacing:".12em", color:"rgba(255,255,255,.28)", maxWidth:500, lineHeight:2.1, marginTop:44, animation:"slideUp 1s 1s ease both", willChange:"transform" }}>
        Every great developer first built something inside their head.<br/>Your mindset is your first and most important program.
      </p>

      {/* CTA chips */}
      <div style={{ display:"flex", gap:16, marginTop:48, flexWrap:"wrap", justifyContent:"center", animation:"slideUp 1s 1.2s ease both" }}>
        {["6 Mindset Shifts","Daily Rituals","Affirmations"].map((label, i) => (
          <span key={i} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, letterSpacing:".2em", color:"rgba(0,229,204,.7)", border:"1px solid rgba(0,229,204,.2)", padding:"8px 20px", borderRadius:2, textTransform:"uppercase", background:"rgba(0,229,204,.04)" }}>
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}

// ── MARQUEE ───────────────────────────────────────────────────
function Marquee() {
  const items = ["Embrace Struggle ◈","Consistency Wins ◉","Confusion = Progress ◎","Ship Before Ready ◇","Rest is Work ◆","Compare to Yesterday ◐"];
  const all = [...items,...items];
  return (
    <div style={{ overflow:"hidden", background:"rgba(0,229,204,.03)", borderTop:"1px solid rgba(0,229,204,.1)", borderBottom:"1px solid rgba(0,229,204,.1)", padding:"15px 0", position:"relative", zIndex:1 }}>
      <div className="mq-track">
        {all.map((t,i) => (
          <span key={i} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, letterSpacing:".22em", color: i%2===0?"rgba(0,229,204,.45)":"rgba(57,255,154,.3)", padding:"0 52px", whiteSpace:"nowrap", textTransform:"uppercase" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ── STATS ─────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { to:6,  suffix:"",  label:"Core Mindsets",  color:"#00E5CC" },
    { to:7,  suffix:"",  label:"Manifesto Lines", color:"#39FF9A" },
    { to:5,  suffix:"",  label:"Daily Rituals",   color:"#FFB347" },
    { to:90, suffix:"+", label:"Days to Transform",color:"#B07FFF" },
  ];
  return (
    <div className="cnf-stats4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", borderTop:"1px solid rgba(255,255,255,.05)", borderBottom:"1px solid rgba(255,255,255,.05)", position:"relative", zIndex:1 }}>
      {stats.map((s,i) => (
        <div key={i} className="_rv" style={{ padding:"44px 32px", textAlign:"center", borderRight: i<3?"1px solid rgba(255,255,255,.05)":"none", transitionDelay:`${i*.08}s` }}>
          <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(36px,5vw,64px)", fontWeight:400, color:s.color, textShadow:`0 0 30px ${s.color}55`, lineHeight:1, marginBottom:12 }}>
            <Counter to={s.to} suffix={s.suffix} />
          </div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".35em", color:"rgba(255,255,255,.28)", textTransform:"uppercase" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── MINDSET CARD ──────────────────────────────────────────────
function MCard({ m, open, onToggle }: { m: typeof MINDSETS[0]; open: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  use3DTilt(ref);
  return (
    <div
      ref={ref}
      className="tcard"
      onClick={onToggle}
      style={{
        background: open ? `linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.02))` : "rgba(255,255,255,.02)",
        border: `1px solid ${open ? m.accent+"50" : "rgba(255,255,255,.06)"}`,
        padding:"44px 36px",
        cursor:"pointer",
        position:"relative",
        overflow:"hidden",
      }}
    >
      {/* Top gradient line — animated */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent 0%,${m.accent} 50%,transparent 100%)`, opacity: open ? 1 : 0, transition:"opacity .4s ease", boxShadow:`0 0 12px ${m.accent}` }} />

      {/* Glow fill */}
      {open && <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at top left,${m.glow} 0%,transparent 65%)`, pointerEvents:"none" }} />}

      {/* Scan line on hover */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(255,255,255,.03) 0%,transparent 100%)", opacity: open ? 1 : 0, transition:"opacity .3s", pointerEvents:"none" }} />

      <div style={{ position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".4em", color:m.accent, textTransform:"uppercase", opacity:.8 }}>{m.tag}</span>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:"rgba(255,255,255,.12)", letterSpacing:".1em" }}>{m.num}</span>
        </div>

        <div style={{ fontSize:36, marginBottom:18, color:m.accent, textShadow:`0 0 20px ${m.accent}90`, display:"inline-block", transition:"transform .45s cubic-bezier(.34,1.56,.64,1)", transform: open ? "scale(1.2) rotate(-8deg)" : "scale(1)", animation:"floatUp 3s ease-in-out infinite" }}>
          {m.icon}
        </div>

        <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(20px,2.4vw,26px)", fontWeight:400, lineHeight:1.2, marginBottom:14, color: open ? m.accent : "rgba(255,255,255,.9)", transition:"color .3s" }}>
          {m.title}
        </h3>

        <p style={{ fontFamily:"'DM Serif Display',serif", fontStyle:"italic", fontSize:14, lineHeight:1.75, color: open ? `${m.accent}CC` : "rgba(255,255,255,.32)", marginBottom: open ? 20 : 0, transition:"color .3s" }}>
          "{m.sub}"
        </p>

        <div style={{ maxHeight: open ? 200 : 0, overflow:"hidden", transition:"max-height .55s cubic-bezier(.16,1,.3,1), opacity .4s ease", opacity: open ? 1 : 0 }}>
          <div style={{ paddingTop:16, borderTop:`1px solid ${m.accent}20`, marginTop:4 }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13.5, lineHeight:1.9, color:"rgba(255,255,255,.42)", fontWeight:300 }}>{m.body}</p>
          </div>
        </div>

        <div style={{ marginTop:22, fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".3em", color:`${m.accent}B0`, textTransform:"uppercase", display:"flex", alignItems:"center", gap:8 }}>
          <span>{open ? "Collapse" : "Read more"}</span>
          <span style={{ transition:"transform .3s", transform: open ? "rotate(90deg)" : "rotate(0)" }}>→</span>
        </div>
      </div>
    </div>
  );
}

// ── CARDS SECTION ─────────────────────────────────────────────
function CardsSection() {
  const [open, setOpen] = useState<number | null>(null);
  useReveal();
  return (
    <section style={{ padding:"120px 56px", position:"relative", zIndex:1 }} className="cnf-pad">
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="_rv" style={{ marginBottom:72 }}>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".45em", color:"#00E5CC", textTransform:"uppercase", marginBottom:20, display:"flex", alignItems:"center", gap:16 }}>
            <span>01</span><div style={{ width:70, height:1, background:"linear-gradient(90deg,#00E5CC,transparent)", opacity:.3 }} /><span>Core Shifts</span>
          </div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(38px,7vw,78px)", fontWeight:400, lineHeight:1.0, letterSpacing:"-.01em" }}>
            6 Mindset<br /><em style={{ fontStyle:"italic", color:"#00E5CC", textShadow:"0 0 40px rgba(0,229,204,.3)" }}>Rewirings</em>
          </h2>
        </div>

        <div className="cnf-grid3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"rgba(0,229,204,.04)" }}>
          {MINDSETS.map((m) => (
            <MCard key={m.id} m={m} open={open === m.id} onToggle={() => setOpen(open === m.id ? null : m.id)} />
          ))}
        </div>
        <p style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".3em", color:"rgba(255,255,255,.18)", textAlign:"center", marginTop:22, textTransform:"uppercase" }}>◈ Click any card to expand</p>
      </div>
    </section>
  );
}

// ── MANIFESTO ─────────────────────────────────────────────────
function Manifesto() {
  useReveal();
  return (
    <section style={{ padding:"140px 56px", background:"rgba(57,255,154,.02)", borderTop:"1px solid rgba(57,255,154,.06)", borderBottom:"1px solid rgba(57,255,154,.06)", position:"relative", zIndex:1, overflow:"hidden" }} className="cnf-pad">
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontFamily:"'DM Serif Display',serif", fontSize:"clamp(90px,19vw,250px)", fontStyle:"italic", color:"rgba(57,255,154,.025)", whiteSpace:"nowrap", pointerEvents:"none", userSelect:"none", letterSpacing:"-.04em" }}>
        Manifest
      </div>
      <div style={{ maxWidth:880, margin:"0 auto", position:"relative" }}>
        <div className="_rv" style={{ marginBottom:64 }}>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".45em", color:"#39FF9A", textTransform:"uppercase", marginBottom:20, display:"flex", alignItems:"center", gap:16 }}>
            <span>02</span><div style={{ width:70, height:1, background:"linear-gradient(90deg,#39FF9A,transparent)", opacity:.3 }} /><span>The Coder's Oath</span>
          </div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(38px,7vw,78px)", fontWeight:400, lineHeight:1.0 }}>
            The Study<br /><em style={{ fontStyle:"italic", color:"#39FF9A", textShadow:"0 0 40px rgba(57,255,154,.3)" }}>Manifesto</em>
          </h2>
        </div>

        <ol style={{ listStyle:"none", counterReset:"mf" }}>
          {MANIFESTO.map((line, i) => (
            <li key={i} className="_rx" style={{ counterIncrement:"mf", padding:"26px 0", borderTop:"1px solid rgba(255,255,255,.05)", display:"grid", gridTemplateColumns:"52px 1fr", gap:24, alignItems:"baseline", transitionDelay:`${i*.08}s`, position:"relative", overflow:"hidden" }}>
              <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:"#39FF9A", opacity:.4, letterSpacing:".1em" }}>
                {String(i+1).padStart(2,"0")}
              </span>
              <p
                style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(17px,2.5vw,28px)", fontWeight:400, lineHeight:1.4, color:"rgba(255,255,255,.65)", transition:"color .3s, transform .3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.95)"; (e.currentTarget as HTMLElement).style.transform="translateX(6px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.65)"; (e.currentTarget as HTMLElement).style.transform=""; }}
              >{line}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ── RITUAL ────────────────────────────────────────────────────
function Ritual() {
  const [checked, setChecked] = useState<boolean[]>(Array(RITUALS.length).fill(false));
  const [msgVis, setMsgVis] = useState(true);
  const count = checked.filter(Boolean).length;
  const circ = 502;
  const offset = circ - (count / RITUALS.length) * circ;
  useReveal();

  const toggle = (i: number) => {
    setMsgVis(false);
    setTimeout(() => setMsgVis(true), 220);
    setChecked((p) => { const n=[...p]; n[i]=!n[i]; return n; });
  };

  return (
    <section style={{ padding:"120px 56px", position:"relative", zIndex:1 }} className="cnf-pad">
      <div className="cnf-ritual" style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1.15fr .85fr", gap:80, alignItems:"start" }}>
        <div>
          <div className="_rv">
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".45em", color:"#FFB347", textTransform:"uppercase", marginBottom:20, display:"flex", alignItems:"center", gap:16 }}>
              <span>03</span><div style={{ width:70, height:1, background:"linear-gradient(90deg,#FFB347,transparent)", opacity:.3 }} /><span>Daily Practice</span>
            </div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(38px,7vw,78px)", fontWeight:400, lineHeight:1.0, marginBottom:20 }}>
              Daily<br /><em style={{ fontStyle:"italic", color:"#FFB347", textShadow:"0 0 40px rgba(255,179,71,.3)" }}>Ritual</em>
            </h2>
            <p style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, lineHeight:2.1, color:"rgba(255,255,255,.28)", maxWidth:380, marginBottom:52 }}>
              Five small acts, done daily, compound into unrecognisable transformation within 90 days.
            </p>
          </div>

          {RITUALS.map((text, i) => (
            <div key={i} className="_rv" onClick={() => toggle(i)}
              style={{ display:"flex", alignItems:"center", gap:20, padding:"22px 0", borderBottom:`1px solid ${checked[i]?"rgba(255,179,71,.15)":"rgba(255,255,255,.05)"}`, cursor:"pointer", transitionDelay:`${i*.07}s`, transition:"padding-left .25s ease, border-color .3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.paddingLeft="14px"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.paddingLeft="0"; }}
            >
              <div style={{ width:24, height:24, flexShrink:0, border:`1.5px solid ${checked[i]?"#FFB347":"rgba(255,255,255,.15)"}`, display:"flex", alignItems:"center", justifyContent:"center", background: checked[i]?"rgba(255,179,71,.1)":"transparent", transition:"all .35s cubic-bezier(.34,1.56,.64,1)", transform: checked[i]?"scale(1.12)":"scale(1)", boxShadow: checked[i]?"0 0 14px rgba(255,179,71,.4)":"none" }}>
                {checked[i] && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="#FFB347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, fontWeight:400, lineHeight:1.4, color: checked[i]?"rgba(255,255,255,.22)":"rgba(255,255,255,.75)", textDecoration: checked[i]?"line-through":"none", transition:"all .3s" }}>{text}</span>
            </div>
          ))}
        </div>

        {/* SVG Ring card */}
        <div>
          <div style={{ position:"sticky", top:100, padding:52, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,179,71,.1)", textAlign:"center" }}>
            <p style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".4em", color:"rgba(255,179,71,.45)", textTransform:"uppercase", marginBottom:36 }}>Today's Progress</p>
            <div style={{ position:"relative", width:200, height:200, margin:"0 auto 36px" }}>
              <svg style={{ transform:"rotate(-90deg)", display:"block" }} width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFB347"/>
                    <stop offset="100%" stopColor="#FF6B9D"/>
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="6"/>
                <circle cx="100" cy="100" r="80" fill="none" stroke="url(#rg)" strokeWidth="6" strokeLinecap="round" strokeDasharray="502" strokeDashoffset={offset} style={{ transition:"stroke-dashoffset .85s cubic-bezier(.16,1,.3,1)", filter:"drop-shadow(0 0 10px #FFB347)" }}/>
              </svg>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:68, fontWeight:400, color:"#FFB347", lineHeight:1, textShadow:"0 0 30px rgba(255,179,71,.45)" }}>{count}</span>
                <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, color:"rgba(255,255,255,.22)", letterSpacing:".15em" }}>/5</span>
              </div>
            </div>
            {/* Pill dots */}
            <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:28 }}>
              {RITUALS.map((_, i) => (
                <div key={i} style={{ width: checked[i]?22:7, height:7, borderRadius:4, background: checked[i]?"#FFB347":"rgba(255,255,255,.1)", transition:"all .45s cubic-bezier(.34,1.56,.64,1)", boxShadow: checked[i]?"0 0 10px #FFB347":"none" }}/>
              ))}
            </div>
            <p style={{ fontFamily:"'DM Serif Display',serif", fontStyle:"italic", fontSize:18, color:"rgba(255,255,255,.38)", lineHeight:1.6, minHeight:64, transition:"opacity .25s", opacity: msgVis ? 1 : 0 }}>
              "{RING_MSGS[count]}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── AFFIRMATION ───────────────────────────────────────────────
function Affirm() {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  const [auto, setAuto] = useState(true);
  const goTo = useCallback((i: number) => { setVis(false); setTimeout(() => { setIdx(i); setVis(true); }, 360); }, []);
  useEffect(() => { if (!auto) return; const id = setInterval(() => goTo((idx+1)%AFFIRMATIONS.length),4800); return()=>clearInterval(id); },[idx,auto,goTo]);
  useReveal();

  return (
    <section style={{ padding:"120px 56px", background:"rgba(176,127,255,.025)", borderTop:"1px solid rgba(176,127,255,.06)", position:"relative", zIndex:1, overflow:"hidden" }} className="cnf-pad">
      <div style={{ maxWidth:860, margin:"0 auto", textAlign:"center" }}>
        <div className="_rv" style={{ marginBottom:56 }}>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".5em", color:"#B07FFF", textTransform:"uppercase", display:"flex", alignItems:"center", justifyContent:"center", gap:20 }}>
            <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,#B07FFF)", opacity:.2, maxWidth:120 }}/>
            04 &nbsp;·&nbsp; Daily Affirmation
            <div style={{ flex:1, height:1, background:"linear-gradient(90deg,#B07FFF,transparent)", opacity:.2, maxWidth:120 }}/>
          </div>
        </div>

        <div className="_rv" style={{ minHeight:180, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:48, transition:"opacity .35s ease, transform .35s ease", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(10px)" }}>
          <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(24px,4.2vw,50px)", fontStyle:"italic", fontWeight:400, lineHeight:1.35, borderLeft:"3px solid #B07FFF", paddingLeft:30, textAlign:"left", color:"rgba(255,255,255,.85)", textShadow:"0 0 60px rgba(176,127,255,.15)" }}>
            "{AFFIRMATIONS[idx]}"
          </p>
        </div>

        {/* Dots */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:24 }}>
          {AFFIRMATIONS.map((_,i) => (
            <button key={i} onClick={()=>{setAuto(false);goTo(i);}} style={{ width: i===idx?28:8, height:8, borderRadius:4, background: i===idx?"#B07FFF":"rgba(255,255,255,.1)", border:"none", cursor:"pointer", transition:"all .4s cubic-bezier(.34,1.56,.64,1)", boxShadow: i===idx?"0 0 12px #B07FFF":"none", padding:0 }}/>
          ))}
        </div>
        <button onClick={()=>setAuto(a=>!a)} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:".3em", color: auto?"#B07FFF":"rgba(255,255,255,.2)", background:"none", border:`1px solid ${auto?"rgba(176,127,255,.3)":"rgba(255,255,255,.07)"}`, padding:"9px 22px", cursor:"pointer", textTransform:"uppercase", transition:"all .3s", outline:"none" }}>
          {auto ? "⏸ Autoplay On" : "▶ Autoplay Off"}
        </button>
      </div>
    </section>
  );
}

// ── ROOT EXPORT ───────────────────────────────────────────────
export default function Mindset() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 2400); return () => clearTimeout(t); }, []);

  return (
    <div className="cnf">
      <style>{GCSS}</style>
      <Orbs />
      {/* Grid overlay */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, backgroundImage:"linear-gradient(rgba(0,229,204,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,204,.025) 1px,transparent 1px)", backgroundSize:"64px 64px" }} />
      <Loader done={loaded} />
      
      <main>
        <Hero />
        <Marquee />
        <StatsBar />
        <CardsSection />
        <Manifesto />
        <Ritual />
        <Affirm />
      </main>
    </div>
  );
}