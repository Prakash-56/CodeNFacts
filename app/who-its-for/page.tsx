"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   ALL styles use #cnf-witf-root prefix → ZERO bleed outside.
   Footer, header, navbar — untouched.
───────────────────────────────────────────────────────────── */

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');

  #cnf-witf-root {
    --bg:      #07070B;
    --surface: #0D0D13;
    --line:    rgba(255,255,255,0.055);
    --muted:   rgba(255,255,255,0.28);
    --text:    #F0EEE8;
    font-family: 'Syne', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    position: relative;
    isolation: isolate;
  }

  #cnf-witf-root *, #cnf-witf-root *::before, #cnf-witf-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  /* ── Fonts ── */
  #cnf-witf-root .f-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
  #cnf-witf-root .f-mono    { font-family: 'DM Mono', monospace; }
  #cnf-witf-root .f-syne    { font-family: 'Syne', sans-serif; }

  /* ══════════════ KEYFRAMES ══════════════ */
  @keyframes cnf-glitch-a {
    0%,92%,100% { clip-path:inset(0 0 100% 0); transform:translateX(0); }
    93%  { clip-path:inset(15% 0 55% 0); transform:translateX(-5px); }
    95%  { clip-path:inset(60% 0 20% 0); transform:translateX(4px);  }
    97%  { clip-path:inset(40% 0 40% 0); transform:translateX(-3px); }
    99%  { clip-path:inset(80% 0 5%  0); transform:translateX(5px);  }
  }
  @keyframes cnf-glitch-b {
    0%,91%,100% { clip-path:inset(0 0 100% 0); transform:translateX(0); }
    92%  { clip-path:inset(25% 0 50% 0); transform:translateX(6px);  }
    94%  { clip-path:inset(5%  0 75% 0); transform:translateX(-4px); }
    96%  { clip-path:inset(70% 0 10% 0); transform:translateX(3px);  }
    98%  { clip-path:inset(45% 0 35% 0); transform:translateX(-5px); }
  }
  @keyframes cnf-up {
    from { opacity:0; transform:translateY(64px) skewY(2deg); }
    to   { opacity:1; transform:translateY(0)    skewY(0deg); }
  }
  @keyframes cnf-left {
    from { opacity:0; transform:translateX(-80px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes cnf-right {
    from { opacity:0; transform:translateX(80px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes cnf-fade {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes cnf-diag {
    from { opacity:0; transform:translate(-48px, 48px); }
    to   { opacity:1; transform:translate(0,0); }
  }
  @keyframes cnf-line-grow {
    from { transform:scaleX(0); transform-origin:left; }
    to   { transform:scaleX(1); transform-origin:left; }
  }
  @keyframes cnf-ticker {
    from { transform:translateX(0); }
    to   { transform:translateX(-50%); }
  }
  @keyframes cnf-float {
    0%,100% { transform:translateY(0) rotate(-0.8deg); }
    50%     { transform:translateY(-20px) rotate(0.8deg); }
  }
  @keyframes cnf-blink {
    0%,100% { opacity:1; } 50% { opacity:0; }
  }
  @keyframes cnf-noise {
    0%  {background-position:0%   0%;}
    25% {background-position:50%  25%;}
    50% {background-position:100% 50%;}
    75% {background-position:25%  75%;}
    100%{background-position:0%   0%;}
  }
  @keyframes cnf-spin {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
  }
  @keyframes cnf-bar {
    from { width:0%; }
    to   { width:var(--w); }
  }
  @keyframes cnf-count-in {
    from { opacity:0; transform:rotateX(90deg) translateY(20px); }
    to   { opacity:1; transform:rotateX(0deg)  translateY(0); }
  }

  /* ── Reveal classes (start hidden, play on .vis) ── */
  #cnf-witf-root .ra  { opacity:0; animation:cnf-up    0.9s cubic-bezier(.16,1,.3,1) both paused; }
  #cnf-witf-root .rl  { opacity:0; animation:cnf-left  0.8s cubic-bezier(.16,1,.3,1) both paused; }
  #cnf-witf-root .rr  { opacity:0; animation:cnf-right 0.8s cubic-bezier(.16,1,.3,1) both paused; }
  #cnf-witf-root .rf  { opacity:0; animation:cnf-fade  0.7s ease both paused; }
  #cnf-witf-root .rd  { opacity:0; animation:cnf-diag  0.9s cubic-bezier(.16,1,.3,1) both paused; }
  #cnf-witf-root .vis { animation-play-state:running !important; opacity:1 !important; }

  /* ── Delay helpers ── */
  #cnf-witf-root .d1{animation-delay:.06s!important}
  #cnf-witf-root .d2{animation-delay:.13s!important}
  #cnf-witf-root .d3{animation-delay:.20s!important}
  #cnf-witf-root .d4{animation-delay:.28s!important}
  #cnf-witf-root .d5{animation-delay:.36s!important}
  #cnf-witf-root .d6{animation-delay:.44s!important}
  #cnf-witf-root .d7{animation-delay:.52s!important}
  #cnf-witf-root .d8{animation-delay:.60s!important}

  /* ── Glitch text ── */
  #cnf-witf-root .glitch { position:relative; }
  #cnf-witf-root .glitch::before,
  #cnf-witf-root .glitch::after {
    content: attr(data-text);
    position:absolute; inset:0;
    pointer-events:none;
  }
  #cnf-witf-root .glitch::before { color:#0ff; opacity:.7; animation:cnf-glitch-a 5s infinite; }
  #cnf-witf-root .glitch::after  { color:#f0f; opacity:.7; animation:cnf-glitch-b 5s infinite .04s; }

  /* ── 3D tilt ── */
  #cnf-witf-root .tilt { transform-style:preserve-3d; will-change:transform; transition:transform .12s ease, box-shadow .12s ease; }

  /* ── Hover lift ── */
  #cnf-witf-root .lift { transition:transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .4s ease; }
  #cnf-witf-root .lift:hover { transform:translateY(-10px) scale(1.018); box-shadow:0 40px 80px rgba(0,0,0,.55); }

  /* ── Underline anim ── */
  #cnf-witf-root .uline { position:relative; display:inline; }
  #cnf-witf-root .uline::after {
    content:''; position:absolute; bottom:-5px; left:0;
    height:3px; width:100%; background:currentColor;
    transform:scaleX(0); transform-origin:left;
    transition:transform .6s cubic-bezier(.16,1,.3,1);
  }
  #cnf-witf-root .uline.vis::after { transform:scaleX(1); }

  /* ── Noise grain ── */
  #cnf-witf-root .noise-layer::after {
    content:''; position:absolute; inset:0; pointer-events:none;
    opacity:.025; z-index:1;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E");
    animation:cnf-noise .35s steps(1) infinite;
  }

  /* ── Tag pill ── */
  #cnf-witf-root .tag {
    display:inline-block; padding:4px 12px;
    border:1px solid currentColor; border-radius:2px;
    font-size:9px; letter-spacing:3px; text-transform:uppercase;
    font-family:'DM Mono', monospace;
  }
`;

/* ── DATA ── */
const audiences = [
  {
    id:"students", idx:"01", label:"Students", accent:"#B4FF6E",
    tag:"Learn & Grow",
    headline:"Turn confusion\ninto clarity",
    pull:"Where every first error is a lesson, not a failure.",
    body:"CodeNFacts strips away the jargon and meets you exactly where you are. From understanding how a loop works to your first full-stack deployment - every step is patient, precise, and built around real examples that click.",
    stats:[{n:"10K+",l:"Active students"},{n:"300+",l:"Beginner guides"}],
    bars:[{l:"Clarity",w:97},{l:"Depth",w:74},{l:"Speed",w:82}],
    traits:["Beginner-friendly language","Step-by-step walkthroughs","Concept-first teaching","Error explanation culture","No assumed knowledge"],
  },
  {
    id:"devs", idx:"02", label:"Developers", accent:"#FF6B35",
    tag:"Ship Faster",
    headline:"Code smarter,\nbuild quicker",
    pull:"Stop Googling. Start solving.",
    body:"Every minute context-switching between tabs is a minute not building. CodeNFacts is your single reference for battle-tested patterns, framework comparisons, deep-dive architecture guides, and performance breakdowns - curated and kept current.",
    stats:[{n:"500+",l:"Technical articles"},{n:"40+",l:"Frameworks covered"}],
    bars:[{l:"Depth",w:95},{l:"Accuracy",w:92},{l:"Relevance",w:88}],
    traits:["Battle-tested snippets","Algorithm walkthroughs","Performance deep dives","Architecture patterns","Cross-framework comparisons"],
  },
  {
    id:"jobseekers", idx:"03", label:"Job Seekers", accent:"#C084FC",
    tag:"Get Hired",
    headline:"Crack any\ninterview",
    pull:"From DSA to system design - covered.",
    body:"Technical interviews are a different sport. CodeNFacts gives you structured, no-fluff preparation that mirrors how actual interviewers think - with problem patterns, system design walkthroughs, and company-specific prep tracks that work.",
    stats:[{n:"92%",l:"Prep success rate"},{n:"150+",l:"Problem patterns"}],
    bars:[{l:"DSA Coverage",w:94},{l:"System Design",w:88},{l:"Practical Value",w:91}],
    traits:["Curated DSA problem sets","System design blueprints","Company-specific tracks","Mock question banks","Explanation-first answers"],
  },
  {
    id:"educators", idx:"04", label:"Educators", accent:"#FACC15",
    tag:"Teach Better",
    headline:"Resources that\nactually stick",
    pull:"Modern content for modern classrooms.",
    body:"Whether you're building a curriculum or supplementing one, CodeNFacts gives you consistently updated, visual, and shareable technical content your students will actually read - and remember.",
    stats:[{n:"200+",l:"Educators onboard"},{n:"∞",l:"Shareable links"}],
    bars:[{l:"Curriculum Fit",w:89},{l:"Freshness",w:96},{l:"Shareability",w:93}],
    traits:["Curriculum-aligned topics","Visual concept diagrams","Shareable reading paths","Always-updated content","Classroom-safe explanations"],
  },
  {
    id:"hobbyists", idx:"05", label:"Hobbyists", accent:"#38BDF8",
    tag:"Just For Fun",
    headline:"Explore tech\nwithout limits",
    pull:"Curiosity is the only prerequisite.",
    body:"No deadlines. No judgment. Just the genuine joy of tinkering. Whether you're building a side project, hacking home automation, or just trying to understand how the internet actually works - you're welcome here.",
    stats:[{n:"∞",l:"Curiosity fuel"},{n:"0",l:"Gatekeeping"}],
    bars:[{l:"Accessibility",w:99},{l:"Fun Factor",w:90},{l:"Topic Variety",w:87}],
    traits:["No-jargon explanations","Fun project ideas","Broad topic coverage","Zero-pressure environment","Weird questions welcome"],
  },
  {
    id:"pros", idx:"06", label:"Professionals", accent:"#34D399",
    tag:"Stay Sharp",
    headline:"Keep your edge\nin a fast field",
    pull:"Tech doesn't wait. Neither should your knowledge.",
    body:"Senior engineers, architects, and tech leads: CodeNFacts delivers the advanced patterns, emerging tool breakdowns, and industry-level analysis you need to stay relevant and respected - without wading through beginner content to find it.",
    stats:[{n:"Weekly",l:"Fresh deep dives"},{n:"Sr.",l:"Level content tier"}],
    bars:[{l:"Advanced Depth",w:93},{l:"Freshness",w:97},{l:"Signal-to-Noise",w:91}],
    traits:["Advanced architecture guides","Emerging tool analysis","Opinion & commentary","Performance engineering","Tech industry insights"],
  },
];

const TICKER = ["Students","Developers","Job Seekers","Educators","Hobbyists","Architects","Teachers","Tinkerers","Builders","Senior Engineers","Curious Minds","Lifelong Learners"];

/* ── Scroll observer ── */
function useReveal() {
  useEffect(() => {
    const sel = "#cnf-witf-root .ra,#cnf-witf-root .rl,#cnf-witf-root .rr,#cnf-witf-root .rf,#cnf-witf-root .rd,#cnf-witf-root .uline";
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); }), { threshold: 0.1 });
    document.querySelectorAll(sel).forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Tilt hook ── */
function useTilt(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const mv = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - .5) * 20;
      const y = ((e.clientY - r.top)  / r.height - .5) * -20;
      el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale(1.04)`;
      el.style.boxShadow = `${-x*2}px ${y*2}px 56px rgba(0,0,0,.6)`;
    };
    const ml = () => { el.style.transform=""; el.style.boxShadow=""; };
    el.addEventListener("mousemove", mv);
    el.addEventListener("mouseleave", ml);
    return () => { el.removeEventListener("mousemove",mv); el.removeEventListener("mouseleave",ml); };
  }, []);
}

/* ── Parallax hook ── */
function useParallax(ref: React.RefObject<HTMLDivElement | null>, speed = 0.12) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const s = () => {
      const rect = el.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", s, { passive: true });
    return () => window.removeEventListener("scroll", s);
  }, [speed]);
}

/* ══════════════════════════════════════════════
   OVERVIEW CARD (grid)
══════════════════════════════════════════════ */
function AudCard({ a, i }: { a: typeof audiences[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);
  useTilt(ref);
  return (
    <div ref={ref} className="tilt ra" style={{ animationDelay: `${i * .07}s` }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{
        background: hov ? `linear-gradient(135deg,${a.accent}14 0%,#0D0D13 60%)` : "#0D0D13",
        border: `1px solid ${hov ? a.accent+"44" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 4, padding: "40px 36px", height: "100%",
        position: "relative", overflow: "hidden",
        transition: "background .5s, border-color .4s",
      }}>
        {/* Corner triangle */}
        <div style={{
          position:"absolute", top:0, right:0, width:0, height:0,
          borderStyle:"solid",
          borderWidth: `0 ${hov?60:36}px ${hov?60:36}px 0`,
          borderColor: `transparent ${a.accent+(hov?"55":"1A")} transparent transparent`,
          transition: "border-width .4s, border-color .4s",
        }}/>
        {/* Top bar */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${a.accent},transparent)`, opacity: hov ? 1 : 0, transition:"opacity .4s" }}/>

        <div className="f-mono" style={{fontSize:9, color:a.accent, letterSpacing:3, marginBottom:20, textTransform:"uppercase"}}>
          {a.idx} — {a.tag}
        </div>
        <h3 className="f-display" style={{fontSize:44, lineHeight:.9, color:"#fff", marginBottom:16}}>{a.label}</h3>
        <div style={{height:1, background:`linear-gradient(90deg,${a.accent}50,transparent)`, marginBottom:16}}/>
        <p style={{fontSize:13, color:a.accent, fontStyle:"italic", lineHeight:1.6}}>&ldquo;{a.pull}&rdquo;</p>
        <div style={{display:"flex", gap:24, marginTop:28}}>
          {a.stats.map(s => (
            <div key={s.l}>
              <div className="f-display" style={{fontSize:30, color:"#fff", lineHeight:1}}>{s.n}</div>
              <div className="f-mono" style={{fontSize:9, color:"rgba(255,255,255,0.3)", letterSpacing:2, marginTop:4, textTransform:"uppercase"}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FULL AUDIENCE DEEP-DIVE SECTION
══════════════════════════════════════════════ */
function AudSection({ a, reverse }: { a: typeof audiences[0]; reverse: boolean }) {
  const secRef  = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useParallax(blobRef, .09);

  useEffect(() => {
    const el = secRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold:.18 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={secRef} style={{position:"relative", padding:"130px 0", overflow:"hidden"}}>
      {/* Ambient blob */}
      <div ref={blobRef} style={{
        position:"absolute", [reverse?"left":"right"]:"-180px", top:"50%",
        transform:"translateY(-50%)",
        width:580, height:580, borderRadius:"50%",
        background:`radial-gradient(circle,${a.accent}16 0%,transparent 70%)`,
        filter:"blur(90px)", pointerEvents:"none", zIndex:0,
      }}/>
      {/* Watermark index */}
      <div className="f-display" style={{
        position:"absolute", [reverse?"right":"left"]:"2vw", top:"50%",
        transform:"translateY(-50%)",
        fontSize:"clamp(180px,24vw,360px)",
        color:"rgba(255,255,255,0.016)",
        pointerEvents:"none", userSelect:"none", lineHeight:1, zIndex:0,
      }}>{a.idx}</div>

      <div style={{maxWidth:1280, margin:"0 auto", padding:"0 48px", position:"relative", zIndex:2}}>
        <div style={{
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:"88px", alignItems:"center",
          ...(reverse ? {direction:"rtl"} : {}),
        }}>

          {/* TEXT SIDE */}
          <div style={{direction:"ltr"}}>
            <div className={`tag rf ${inView?"vis":""}`} style={{color:a.accent, borderColor:a.accent+"50", marginBottom:28}}>
              {a.tag}
            </div>
            {/* Glitch headline */}
            <h2 className={`f-display glitch ra d1 ${inView?"vis":""}`}
              data-text={a.headline.replace("\n"," ")}
              style={{fontSize:"clamp(52px,5.5vw,90px)", lineHeight:.9, whiteSpace:"pre-line", color:"#fff", marginBottom:28}}>
              {a.headline}
            </h2>
            {/* Accent stripe */}
            <div className={`ra d2 ${inView?"vis":""}`}
              style={{height:3, width:64, background:a.accent, marginBottom:28, borderRadius:2}}/>
            <p className={`rf d3 ${inView?"vis":""}`}
              style={{fontSize:15.5, color:"rgba(255,255,255,0.46)", lineHeight:1.88, marginBottom:40}}>
              {a.body}
            </p>
            {/* Traits */}
            {a.traits.map((t,i) => (
              <div key={t} className={`rf ${inView?"vis":""}`} style={{animationDelay:`${.28+i*.06}s`,
                display:"flex", alignItems:"center", gap:14, marginBottom:14}}>
                <div style={{
                  width:22, height:22, flexShrink:0,
                  border:`1.5px solid ${a.accent}45`,
                  display:"flex", alignItems:"center", justifyContent:"center", borderRadius:2,
                }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 5.5L4.2 8.2L9.5 2.5" stroke={a.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{fontSize:14, color:"rgba(255,255,255,0.62)"}}>{t}</span>
              </div>
            ))}
          </div>

          {/* VISUAL SIDE */}
          <div style={{direction:"ltr"}} className={`ra d2 ${inView?"vis":""}`}>
            {/* Metrics card */}
            <div style={{
              background:"#09090F",
              border:`1px solid ${a.accent}20`,
              borderRadius:6, padding:"44px", marginBottom:14,
              position:"relative", overflow:"hidden",
            }}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${a.accent},transparent)`}}/>
              <div className="f-mono" style={{fontSize:9,letterSpacing:4,color:"rgba(255,255,255,0.22)",marginBottom:32,textTransform:"uppercase"}}>
                Impact metrics
              </div>
              {a.bars.map((b,bi) => (
                <div key={b.l} style={{marginBottom:22}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                    <span className="f-mono" style={{fontSize:10,color:"rgba(255,255,255,0.38)",letterSpacing:1}}>{b.l}</span>
                    <span className="f-mono" style={{fontSize:10,color:a.accent}}>{b.w}%</span>
                  </div>
                  <div style={{height:3,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}>
                    <div style={{
                      height:"100%",
                      width: inView ? `${b.w}%` : "0%",
                      background:`linear-gradient(90deg,${a.accent},${a.accent}80)`,
                      borderRadius:2,
                      transition:`width 1.3s cubic-bezier(.16,1,.3,1) ${bi*.16+.35}s`,
                    }}/>
                  </div>
                </div>
              ))}
              {/* Stats grid */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2,marginTop:32}}>
                {a.stats.map(s => (
                  <div key={s.l} style={{background:"rgba(255,255,255,0.03)",padding:"18px 16px",borderRadius:3,textAlign:"center"}}>
                    <div className="f-display" style={{fontSize:36,color:a.accent,lineHeight:1}}>{s.n}</div>
                    <div className="f-mono" style={{fontSize:9,color:"rgba(255,255,255,0.28)",letterSpacing:2,marginTop:5,textTransform:"uppercase"}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Quote card */}
            <div style={{
              background:`linear-gradient(135deg,${a.accent}12,transparent)`,
              border:`1px solid ${a.accent}22`,
              borderRadius:6, padding:"28px 30px",
            }}>
              <span style={{fontSize:36,color:a.accent,fontFamily:"Georgia,serif",lineHeight:.6,display:"block",marginBottom:10}}>&ldquo;</span>
              <p style={{fontSize:14.5,color:"rgba(255,255,255,0.6)",lineHeight:1.75,fontStyle:"italic"}}>{a.pull}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function WhoItsForPage() {
  useReveal();

  /* Hero parallax */
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const s = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * .22}px)`;
        heroRef.current.style.opacity   = `${1 - window.scrollY * .0018}`;
      }
    };
    window.addEventListener("scroll", s, { passive: true });
    return () => window.removeEventListener("scroll", s);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      <div id="cnf-witf-root" className="noise-layer">

        {/* ════════════════════════════
            HERO
        ════════════════════════════ */}
        <section style={{position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"0 48px 96px", overflow:"hidden"}}>

          {/* Fine grid */}
          <div style={{
            position:"absolute",inset:0,pointerEvents:"none",zIndex:0,
            backgroundImage:`linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)`,
            backgroundSize:"96px 96px",
          }}/>

          {/* Giant watermark */}
          <div className="f-display" style={{
            position:"absolute",top:"50%",left:"50%",
            transform:"translate(-50%,-50%)",
            fontSize:"clamp(220px,32vw,520px)",
            color:"rgba(255,255,255,0.011)",
            pointerEvents:"none",userSelect:"none",
            lineHeight:.8,letterSpacing:"-.04em",
            whiteSpace:"nowrap",zIndex:0,
          }}>WHO</div>

          {/* Diagonal lines */}
          {[12,22,34].map((r,i) => (
            <div key={i} style={{
              position:"absolute",top:0,right:`${r}vw`,bottom:0,
              width:1,background:"rgba(255,255,255,0.03)",
              transform:"rotate(9deg)",transformOrigin:"top center",
              pointerEvents:"none",zIndex:1,
            }}/>
          ))}

          {/* Floating accent dot */}
          <div style={{
            position:"absolute",top:"18%",right:"18%",
            width:300,height:300,borderRadius:"50%",
            background:"radial-gradient(circle,#B4FF6E18 0%,transparent 70%)",
            filter:"blur(60px)",animation:"cnf-float 7s ease-in-out infinite",
            pointerEvents:"none",zIndex:1,
          }}/>

          <div ref={heroRef} style={{position:"relative",zIndex:2,maxWidth:1280,margin:"0 auto",width:"100%"}}>
            {/* Eyebrow */}
            <div className="rf d1" style={{marginBottom:36,display:"flex",alignItems:"center",gap:14}}>
              <span className="f-mono" style={{fontSize:10,letterSpacing:4,color:"rgba(255,255,255,0.28)",textTransform:"uppercase"}}>CodeNFacts</span>
              <span style={{height:1,flex:"0 0 56px",background:"rgba(255,255,255,0.14)"}}/>
              <span className="f-mono" style={{fontSize:10,letterSpacing:4,color:"rgba(255,255,255,0.28)",textTransform:"uppercase"}}>Who It's For</span>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#B4FF6E",boxShadow:"0 0 10px #B4FF6E",animation:"cnf-blink 1.6s ease infinite",flexShrink:0}}/>
            </div>

            {/* Headline */}
            <div style={{overflow:"hidden", marginBottom:4}}>
              <h1 className="f-display ra" style={{fontSize:"clamp(80px,12.5vw,210px)",lineHeight:.84,letterSpacing:"-.025em",color:"rgba(255,255,255,0.15)"}}>
                Built for
              </h1>
            </div>
            <div style={{overflow:"hidden",marginBottom:4}}>
              <h1 className="f-display ra d1 glitch" data-text="Every Coder"
                style={{fontSize:"clamp(80px,12.5vw,210px)",lineHeight:.84,letterSpacing:"-.025em",color:"#B4FF6E"}}>
                Every Coder
              </h1>
            </div>
            <div style={{overflow:"hidden",marginBottom:48}}>
              <h1 className="f-display ra d2" style={{fontSize:"clamp(80px,12.5vw,210px)",lineHeight:.84,letterSpacing:"-.025em",color:"rgba(255,255,255,0.1)"}}>
                Always.
              </h1>
            </div>

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:24}}>
              <p className="ra d3" style={{fontSize:"clamp(14px,1.4vw,18px)",color:"rgba(255,255,255,0.38)",maxWidth:500,lineHeight:1.8}}>
                Whether you're writing your first{" "}
                <code className="f-mono" style={{color:"#B4FF6E",fontSize:".85em"}}>Hello World</code>{" "}
                or architecting distributed systems at scale - CodeNFacts has something real to offer you.
              </p>
              <span className="f-mono rf d5" style={{fontSize:10,color:"rgba(255,255,255,0.18)",letterSpacing:3,textTransform:"uppercase",display:"flex",alignItems:"center",gap:10}}>
                <span style={{height:1,width:36,background:"rgba(255,255,255,0.14)",display:"inline-block"}}/>
                Scroll to explore
              </span>
            </div>
          </div>
        </section>

        {/* ════════════════════════════
            TICKER
        ════════════════════════════ */}
        <div style={{borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)",overflow:"hidden",padding:"18px 0",background:"#0A0A10"}}>
          <div style={{display:"flex",animation:"cnf-ticker 22s linear infinite",width:"max-content"}}>
            {[...TICKER,...TICKER,...TICKER,...TICKER].map((t,i) => (
              <span key={i} className="f-display" style={{
                fontSize:20,letterSpacing:3,paddingRight:60,whiteSpace:"nowrap",
                color: i%4===0 ? "#B4FF6E" : i%4===2 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)",
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* ════════════════════════════
            INTRO MANIFESTO
        ════════════════════════════ */}
        <section style={{maxWidth:1280,margin:"0 auto",padding:"140px 48px 100px"}}>
          <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:"80px",alignItems:"start"}}>
            <div>
              <div className="f-mono rl" style={{fontSize:9,letterSpacing:4,color:"rgba(255,255,255,0.22)",textTransform:"uppercase",marginBottom:20}}>Our Promise</div>
              <div className="rl d1" style={{height:1,background:"rgba(255,255,255,0.1)",marginBottom:20}}/>
              {["No gatekeeping.","No high paywalls.","No fluff."].map((t,i) => (
                <div key={t} className="f-display rl" style={{fontSize:17,color:"rgba(255,255,255,0.22)",letterSpacing:.5,lineHeight:1.4,animationDelay:`${.08*i+.08}s`}}>{t}</div>
              ))}
            </div>
            <div>
              <h2 className="f-display rr" style={{fontSize:"clamp(38px,4.5vw,70px)",lineHeight:.95,letterSpacing:"-.02em",marginBottom:32,color:"#fff"}}>
                The internet already has<br/>enough confusing docs.<br/>
                <span style={{color:"rgba(255,255,255,0.28)"}}>We write for humans.</span>
              </h2>
              <p className="rr d2" style={{fontSize:16,color:"rgba(255,255,255,0.4)",lineHeight:1.88,maxWidth:560}}>
                CodeNFacts started from a simple frustration: most technical resources either talk down to you or skip what you actually need to know. We built something different - a platform that respects your intelligence and your time, no matter where you are in your journey.
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════
            SIX CARDS GRID
        ════════════════════════════ */}
        <section style={{background:"#0A0A0F",borderTop:"1px solid var(--line)",padding:"100px 48px"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:64,flexWrap:"wrap",gap:16}}>
              <h2 className="f-display ra" style={{fontSize:"clamp(40px,5vw,76px)",letterSpacing:"-.01em",lineHeight:.95}}>
                Six audiences.<br/><span style={{color:"rgba(255,255,255,0.18)"}}>One platform.</span>
              </h2>
              <span className="f-mono rf" style={{fontSize:11,color:"rgba(255,255,255,0.18)",letterSpacing:3,textTransform:"uppercase"}}>
                Scroll each section →
              </span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:10}}>
              {audiences.map((a,i) => <AudCard key={a.id} a={a} i={i}/>)}
            </div>
          </div>
        </section>

        {/* ════════════════════════════
            INDIVIDUAL DEEP-DIVES
        ════════════════════════════ */}
        <section>
          {audiences.map((a,i) => (
            <div key={a.id}>
              <AudSection a={a} reverse={i%2===1}/>
              {i < audiences.length-1 && (
                <div style={{maxWidth:1280,margin:"0 auto",padding:"0 48px"}}>
                  <div style={{height:1,background:"var(--line)"}}/>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* ════════════════════════════
            MANIFESTO GRID
        ════════════════════════════ */}
        <section style={{background:"var(--bg)",borderTop:"1px solid var(--line)",padding:"140px 48px"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <div className="f-mono ra" style={{fontSize:9,letterSpacing:4,color:"rgba(255,255,255,0.18)",textTransform:"uppercase",marginBottom:40}}>
              Why we exist
            </div>
            <h2 className="f-display ra d1" style={{fontSize:"clamp(52px,7.5vw,118px)",lineHeight:.88,letterSpacing:"-.025em",marginBottom:80}}>
              Code is the new{" "}
              <span className="uline" style={{color:"#B4FF6E"}}>literacy.</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2}}>
              {[
                {n:"01",t:"Clarity Over Cleverness",b:"Every concept is written to be understood on first read. We rewrite until it's clear, not until it sounds smart."},
                {n:"02",t:"Depth Without Padding",b:"When we go deep, we're genuinely deep. When short, short is right. No word count games, no filler sections."},
                {n:"03",t:"Always Current",b:"Tech evolves daily. Our content evolves with it. Outdated articles get flagged, rewritten, or archived - never left to mislead."},
                {n:"04",t:"For Every Level",b:"We write for 16-year-old beginners and 20-year veteran architects. Same platform, different depth tracks."},
                {n:"05",t:"No Hidden Agenda",b:"We don't promote tools for sponsorships or bury honest opinions behind diplomacy. You get the real picture."},
                {n:"06",t:"Community First",b:"The best technical writing comes from people who've faced the actual problems. We build from real experience."},
              ].map((p,i) => (
                <div key={p.n} className="ra lift" style={{animationDelay:`${i*.07}s`,background:"rgba(255,255,255,0.025)",padding:"48px 36px",borderRadius:2}}>
                  <div className="f-mono" style={{fontSize:9,color:"rgba(255,255,255,0.18)",letterSpacing:3,marginBottom:24}}>{p.n}</div>
                  <h3 style={{fontSize:18,fontWeight:700,marginBottom:14,letterSpacing:"-.3px"}}>{p.t}</h3>
                  <p style={{fontSize:14,color:"rgba(255,255,255,0.36)",lineHeight:1.78}}>{p.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════
            BIG NUMBERS BAND
        ════════════════════════════ */}
        <section style={{borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)",background:"#0A0A10",padding:"80px 48px"}}>
          <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2}}>
            {[{n:"10K+",l:"Active Readers"},{n:"500+",l:"Articles"},{n:"6",l:"Audience Types"},{n:"0",l:"Paywalls"}].map((s,i) => (
              <div key={s.l} className="ra" style={{animationDelay:`${i*.1}s`,padding:"40px 24px",borderRight:i<3?"1px solid var(--line)":"none"}}>
                <div className="f-display" style={{fontSize:"clamp(52px,6vw,88px)",color:"#fff",marginBottom:10,lineHeight:.9}}>{s.n}</div>
                <div className="f-mono" style={{fontSize:10,color:"rgba(255,255,255,0.22)",letterSpacing:3,textTransform:"uppercase"}}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════
            COMPARISON TABLE
        ════════════════════════════ */}
        <section style={{maxWidth:1280,margin:"0 auto",padding:"130px 48px"}}>
          <h2 className="f-display ra" style={{fontSize:"clamp(38px,5vw,72px)",letterSpacing:"-.02em",marginBottom:8}}>
            How we serve each audience
          </h2>
          <p className="ra d1" style={{fontSize:15,color:"rgba(255,255,255,0.35)",marginBottom:56}}>A quick-glance view of what CodeNFacts delivers per group.</p>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
              <thead>
                <tr>
                  {["Audience","Primary Need","Content Type","Depth","Update Freq."].map((h,i) => (
                    <th key={h} className="f-mono" style={{
                      fontSize:9,letterSpacing:3,textTransform:"uppercase",
                      color:"rgba(255,255,255,0.22)",padding:"14px 20px",
                      borderBottom:"1px solid var(--line)",textAlign:"left",
                      fontWeight:400,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {a:"Students",     n:"Concept clarity",    t:"Guides, examples",      d:"Beginner→Mid",  f:"Daily"},
                  {a:"Developers",   n:"Fast reference",     t:"Snippets, patterns",    d:"Mid→Advanced",  f:"Daily"},
                  {a:"Job Seekers",  n:"Interview prep",     t:"Problems, walkthroughs",d:"Mid→Advanced",  f:"Weekly"},
                  {a:"Educators",    n:"Teaching material",  t:"Structured content",    d:"All levels",    f:"Weekly"},
                  {a:"Hobbyists",    n:"Exploration",        t:"Articles, projects",    d:"Beginner→Mid",  f:"Weekly"},
                  {a:"Professionals",n:"Industry edge",      t:"Analysis, deep dives",  d:"Advanced",      f:"Weekly"},
                ].map((r,i) => {
                  const acc = audiences[i].accent;
                  return (
                    <tr key={r.a} className="ra" style={{animationDelay:`${i*.06}s`,borderBottom:"1px solid var(--line)"}}>
                      <td style={{padding:"20px",fontWeight:700,color:acc,fontSize:14}}>{r.a}</td>
                      <td style={{padding:"20px",color:"rgba(255,255,255,0.55)",fontSize:13}}>{r.n}</td>
                      <td style={{padding:"20px",color:"rgba(255,255,255,0.45)",fontSize:13}}>{r.t}</td>
                      <td style={{padding:"20px"}}>
                        <span className="f-mono" style={{fontSize:10,color:acc,letterSpacing:1}}>{r.d}</span>
                      </td>
                      <td style={{padding:"20px"}}>
                        <span className="f-mono" style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:1}}>{r.f}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ════════════════════════════
            CLOSING
        ════════════════════════════ */}
        <section style={{padding:"160px 48px",position:"relative",overflow:"hidden"}}>
          {/* Dot grid */}
          <div style={{
            position:"absolute",inset:0,pointerEvents:"none",zIndex:0,
            backgroundImage:"radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px)",
            backgroundSize:"32px 32px",
            maskImage:"radial-gradient(ellipse 80% 60% at 50% 50%,black,transparent)",
          }}/>
          {/* Glow */}
          <div style={{
            position:"absolute",top:"50%",left:"50%",
            transform:"translate(-50%,-50%)",
            width:700,height:700,borderRadius:"50%",
            background:"radial-gradient(circle,#B4FF6E0C 0%,transparent 70%)",
            filter:"blur(100px)",pointerEvents:"none",zIndex:0,
          }}/>

          <div style={{maxWidth:900,margin:"0 auto",textAlign:"center",position:"relative",zIndex:2}}>
            <div className="f-mono rf" style={{fontSize:9,letterSpacing:4,color:"rgba(255,255,255,0.18)",textTransform:"uppercase",marginBottom:40}}>Final word</div>
            <h2 className="f-display ra" style={{fontSize:"clamp(56px,9vw,130px)",lineHeight:.86,letterSpacing:"-.03em",marginBottom:40}}>
              Your place in<br/>the code world{" "}
              <span style={{color:"#B4FF6E"}} className="glitch" data-text="starts here.">starts here.</span>
            </h2>
            <p className="ra d2" style={{fontSize:17,color:"rgba(255,255,255,0.36)",lineHeight:1.85,maxWidth:560,margin:"0 auto 64px"}}>
              Thousands of learners, builders, and professionals have made CodeNFacts their daily companion. It doesn't matter where you're starting from - it matters that you start.
            </p>
            {/* Domain stamp */}
            <div className="rf d3" style={{
              display:"inline-flex",alignItems:"center",gap:16,
              border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:4,padding:"22px 40px",
            }}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#B4FF6E",boxShadow:"0 0 10px #B4FF6E",animation:"cnf-blink 1.6s ease infinite"}}/>
              <span className="f-display" style={{fontSize:22,letterSpacing:3,color:"rgba(255,255,255,0.65)"}}>CodeNFacts</span>
              <div style={{height:1,width:28,background:"rgba(255,255,255,0.14)"}}/>
              <span className="f-mono" style={{fontSize:9,letterSpacing:3,color:"rgba(255,255,255,0.22)",textTransform:"uppercase"}}>Live Now</span>
            </div>
          </div>
        </section>

      </div>{/* /cnf-witf-root */}
    </>
  );
}