"use client";
import { useState, useEffect, useRef } from "react";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  paper:   "#F5F0E8",
  paper2:  "#EDE8DC",
  ink:     "#0E0C09",
  ink2:    "#2A2520",
  faded:   "#8C8070",
  rule:    "#C8BFA8",
  acid:    "#D4FF00",
  acidDim: "#A8CC00",
  stamp1:  "#C0392B",
  stamp2:  "#1A4A6B",
  burn:    "#7A3B1E",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const FAILURES = [
  {
    id: "INC-0041",
    caseDate: "14 JAN 2025",
    classification: "HUMAN ERROR",
    severity: "CATASTROPHIC",
    severityN: 9,
    author: "Aryan K.",
    role: "Backend Intern",
    duration: "72 HRS",
    title: "72 Hours Debugging a Semicolon",
    subtitle: "Developer convinced himself the database was corrupted. It was not.",
    tags: ["Node.js", "Express", "REST"],
    excerpt: "I rewrote three API endpoints, blamed my senior, and almost quit before finding a trailing semicolon inside a .json config file.",
    story: `It was 11 PM on a Thursday. My Express server kept returning 500 errors on POST requests. I spent 72 hours assuming it was a database schema mismatch.

I rewrote the entire validation layer. I spun up a fresh PostgreSQL instance. I blamed my senior's code. I opened 14 Stack Overflow tabs. I wrote a 600-word complaint message to my team - didn't send it, thankfully.

On hour 71, while copying the error for the 200th time into Google, I noticed it: a trailing semicolon inside a JSON object in my config file. Not even in the actual code. In a .json file.

The error message said "Unexpected token" and I had been reading it as a database error for three full days.`,
    lesson: "Read the error message. The WHOLE error message. Not just the last line. The first line usually tells you everything - if you're not panicking.",
    impact: "Lost a full sprint. Entire team waited on blocked feature.",
    accentColor: C.stamp1,
  },
  {
    id: "INC-0078",
    caseDate: "02 MAR 2025",
    classification: "DEPLOYMENT FAILURE",
    severity: "CRITICAL",
    severityN: 10,
    author: "Sneha R.",
    role: "Full Stack Developer",
    duration: "6 HRS",
    title: "I Deployed to Production at 4 AM",
    subtitle: "Staging passed. 40,000 real users did not.",
    tags: ["AWS", "Docker", "React", "CI/CD"],
    excerpt: "The staging environment had 50 test accounts. Production had 40,000 Indian users with non-ASCII names. I did not think that would matter.",
    story: `Our staging environment had maybe 50 test accounts. I tested every feature. Everything passed. I thought: perfect time to deploy - 4 AM, no one's awake, zero risk.

I pushed to main. The pipeline ran green. I went to sleep.

At 6 AM I woke up to 47 Slack messages. The production database had a different charset encoding than staging. Every user with a name containing non-ASCII characters - roughly 12,000 Indian users - had their profile data corrupted. Search crashed for everyone.

I had never tested with names like "Rājeśvarī" or "अर्जुन". My staging data was all "John Doe" and "Test User".`,
    lesson: "Your staging environment is a polished lie. Real users are chaotic. Test with real-world data shapes - unicode, edge lengths, special characters.",
    impact: "12,000 users affected. 6-hour emergency rollback. 30 hours without sleep.",
    accentColor: C.stamp2,
  },
  {
    id: "INC-0093",
    caseDate: "18 NOV 2024",
    classification: "OPERATOR ERROR",
    severity: "CATASTROPHIC",
    severityN: 10,
    author: "Rohan M.",
    role: "Junior Dev, Startup",
    duration: "4 HRS",
    title: "git push --force on main",
    subtitle: "3 weeks of team work erased in one command.",
    tags: ["Git", "GitHub", "Team"],
    excerpt: "I thought I was fixing a merge conflict on my branch. I was deleting everyone else's work. The team lead went silent for 45 minutes.",
    story: `I was resolving a merge conflict on a branch I thought was mine. The terminal felt familiar. The commands felt right. I ran git push --force.

The Slack notification arrived 4 seconds later: "WHO JUST FORCE PUSHED TO MAIN?"

I had switched branches mid-session without noticing. I force-pushed over 3 weeks of work from 4 other developers. Their commits - gone. Their branches still existed, but main was now mine alone, from 2 weeks ago.

The team lead went completely silent for 45 minutes. That silence was worse than any shouting.

We recovered it. git reflog saved us after 4 hours. But those 4 hours were the longest of my career.`,
    lesson: "Protect your main branch. Branch protection rules aren't for distrusting your team - they're for protecting your team from human error. Learn git reflog before you need it.",
    impact: "4-hour recovery. New branch protection policy enforced same day.",
    accentColor: C.burn,
  },
  {
    id: "INC-0112",
    caseDate: "07 FEB 2025",
    classification: "INTERVIEW FAILURE",
    severity: "SEVERE",
    severityN: 7,
    author: "Priya D.",
    role: "SDE Candidate",
    duration: "45 MIN",
    title: "O(n³) in a Live Interview",
    subtitle: "Working solution destroyed by panicked optimization attempt.",
    tags: ["DSA", "Interview", "Arrays"],
    excerpt: "I solved the problem correctly. It ran. I thought I passed. Then the interviewer asked about time complexity and I deleted my own working solution.",
    story: `The problem was a classic 2D matrix search. I coded it confidently - triple-nested loop - got the right answer on all test cases.

"Looks correct," the interviewer said. "What's the time complexity?"

I said O(n²). Wrong. It was O(n³). I had an inner loop I hadn't accounted for. When he pointed it out I tried to fix it live and made it worse. I deleted my working solution trying to optimize it and ended up with broken code and worse complexity.

I didn't get the role. Later I found out I was the only candidate that day who produced a working solution first - but I panicked on complexity and destroyed my own answer.`,
    lesson: "Analyze complexity BEFORE you start coding, not after. Walk through your loops out loud. Never delete a working solution - optimize it in steps, or write the new version separately.",
    impact: "Offer rejected. Spent next 60 days on complexity. Got next offer.",
    accentColor: C.stamp2,
  },
  {
    id: "INC-0134",
    caseDate: "22 DEC 2024",
    classification: "SECURITY BREACH",
    severity: "CATASTROPHIC",
    severityN: 10,
    author: "Dev S.",
    role: "CS Student, 2nd Year",
    duration: "2 WKS",
    title: "Hardcoded API Key. Public GitHub.",
    subtitle: "Repo went viral. So did the API key. $3,400 bill followed.",
    tags: ["Security", "GitHub", "AWS"],
    excerpt: "I pushed my project. Got 200 stars in 48 hours. Also got a $3,400 AWS bill. Bots scraped the key within 6 minutes.",
    story: `I built a cool CLI tool using the OpenAI API and uploaded it to GitHub. It blew up overnight - 200 stars, trending in India. I was thrilled.

Then I got an email from AWS at 2 AM. Someone had scraped my repo within 6 minutes of publishing. Bots literally scan GitHub for exposed keys in real-time. They spun up 40 GPU instances in us-east-1 and started mining.

My AWS bill hit $3,400 in 18 hours. I didn't even have an AWS account - they used my OpenAI key to access AWS via a chained exploit.

OpenAI suspended my account. I spent two weeks writing dispute emails and rebuilding with proper secrets management. AWS waived the charges after a long support battle. Not everyone gets that outcome.`,
    lesson: "Use .env files. Add .env to .gitignore BEFORE your first commit - not after. Rotate keys immediately if exposed. GitHub's secret scanning can catch this automatically.",
    impact: "$3,400 bill (waived). Account suspended 2 weeks. Rebuilt with proper security.",
    accentColor: C.stamp1,
  },
  {
    id: "INC-0159",
    caseDate: "11 OCT 2024",
    classification: "TEAM FAILURE",
    severity: "SEVERE",
    severityN: 6,
    author: "Mihir T.",
    role: "Team Lead, Hackathon",
    duration: "36 HRS",
    title: "We Built Two Auth Systems. Same Project.",
    subtitle: "Nobody read the plan. Both systems worked. They were incompatible.",
    tags: ["Teamwork", "Hackathon", "Architecture"],
    excerpt: "Two developers independently built complete JWT auth systems. We discovered this at hour 28. We lost the hackathon because of it.",
    story: `36-hour hackathon. 5-person team. We divided work at the start but never checked implementation details.

Two developers, working in parallel, both implemented JWT authentication from scratch - because neither knew the other was doing it. We discovered this at hour 28 when trying to merge.

Both systems worked perfectly. They were completely incompatible. We spent the last 8 hours ripping out one system and patching the other - exhausted, cutting features, barely functional.

We placed 3rd. We should have won. The judges said the architecture "felt inconsistent." It literally was two separate architectures duct-taped together.`,
    lesson: "10 minutes of upfront documentation saves 10 hours of integration hell. Even in a hackathon. Even with friends. Especially under pressure.",
    impact: "3rd place instead of 1st. Lost 8 hours to avoidable duplication.",
    accentColor: C.burn,
  },
];

const CATS = ["ALL CASES", "HUMAN ERROR", "DEPLOYMENT", "OPERATOR ERROR", "INTERVIEW", "SECURITY", "TEAM"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    }}>{children}</div>
  );
}

function TornEdge({ flip = false }: { flip?: boolean }) {
  return (
    <div style={{ width: "100%", lineHeight: 0, transform: flip ? "scaleY(-1)" : undefined }}>
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" style={{ width: "100%", height: 48, display: "block" }}>
        <path
          d="M0,24 Q24,8 48,20 Q72,34 100,16 Q128,2 160,22 Q192,40 220,18 Q248,2 280,24 Q312,42 340,20 Q368,4 400,22 Q432,38 460,16 Q488,0 520,22 Q552,40 580,18 Q608,2 640,24 Q672,42 700,20 Q728,4 760,22 Q792,38 820,16 Q848,0 880,22 Q912,40 940,18 Q968,2 1000,24 Q1032,42 1060,20 Q1088,4 1120,22 Q1152,38 1180,16 Q1208,0 1240,22 Q1272,40 1300,18 Q1328,2 1360,24 Q1392,42 1420,20 L1440,18 L1440,48 L0,48 Z"
          fill={C.paper}
        />
      </svg>
    </div>
  );
}

function Typewriter({ text, speed = 24 }: { text: string; speed?: number }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { if (i <= text.length) { setOut(text.slice(0, i)); i++; } else clearInterval(t); }, speed);
    return () => clearInterval(t);
  }, []);
  return <>{out}<span style={{ animation: "blink 1s step-start infinite", opacity: out.length < text.length ? 1 : 0 }}>|</span></>;
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function IncidentCard({ f, idx, onOpen }: { f: typeof FAILURES[0]; idx: number; onOpen: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={idx * 0.08}>
      <div
        onClick={onOpen}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: idx % 3 === 1 ? C.paper2 : C.paper,
          border: `1px solid ${C.rule}`,
          borderTop: `5px solid ${hov ? C.acid : f.accentColor}`,
          cursor: "pointer",
          padding: "26px 28px 22px",
          position: "relative",
          boxShadow: hov
            ? `5px 5px 0 ${C.ink}`
            : `2px 2px 0 ${C.rule}`,
          transform: hov ? "translate(-2px,-2px)" : "translate(0,0)",
          transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
          overflow: "hidden",
        }}
      >
        {/* Ruled paper lines */}
        {[...Array(7)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", left: 0, right: 0, top: 56 + i * 26, height: 1,
            background: "rgba(180,160,130,0.18)", pointerEvents: "none",
          }} />
        ))}

        {/* Acid highlight on hover */}
        <div style={{
          position: "absolute", top: 0, left: 0, width: hov ? "100%" : "0%", height: 3,
          background: C.acid, transition: "width 0.3s ease",
        }} />

        {/* Meta row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ fontFamily: "'Special Elite', 'Courier New', serif", fontSize: 11, letterSpacing: 3, color: f.accentColor }}>{f.id}</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: C.faded, letterSpacing: 2, marginTop: 2 }}>{f.caseDate}</div>
          </div>
          <div style={{
            border: `2px solid ${f.accentColor}`,
            padding: "3px 9px", transform: "rotate(-1.5deg)",
            background: hov ? f.accentColor : "transparent",
            transition: "background 0.2s",
          }}>
            <span style={{
              fontFamily: "'Special Elite', serif", fontSize: 9, letterSpacing: 3,
              color: hov ? C.paper : f.accentColor, transition: "color 0.2s",
            }}>{f.classification}</span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(16px, 2.2vw, 20px)",
          fontWeight: 900, lineHeight: 1.25, color: C.ink,
          marginBottom: 6, position: "relative", zIndex: 1,
        }}>{f.title}</h3>

        {/* Subtitle */}
        <div style={{
          fontFamily: "'Courier New', monospace", fontSize: 11.5,
          color: C.faded, fontStyle: "italic", marginBottom: 14,
          lineHeight: 1.5, position: "relative", zIndex: 1,
        }}>{f.subtitle}</div>

        {/* Excerpt */}
        <p style={{
          fontFamily: "'Courier New', monospace", fontSize: 12.5,
          lineHeight: 1.8, color: C.ink2, marginBottom: 18,
          position: "relative", zIndex: 1,
        }}>{f.excerpt}</p>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18, position: "relative", zIndex: 1 }}>
          {f.tags.map(t => (
            <span key={t} style={{
              fontFamily: "'Courier New', monospace", fontSize: 9.5, letterSpacing: 2,
              color: C.faded, border: `1px solid ${C.rule}`,
              padding: "2px 8px",
            }}>{t}</span>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 14, borderTop: `1px dashed ${C.rule}`,
          position: "relative", zIndex: 1,
        }}>
          <div>
            <div style={{ fontFamily: "'Special Elite', serif", fontSize: 13, color: C.ink }}>{f.author}</div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: C.faded, letterSpacing: 1 }}>{f.role}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: C.faded, letterSpacing: 2 }}>DOWNTIME</div>
              <div style={{ fontFamily: "'Special Elite', serif", fontSize: 15, color: f.accentColor, fontWeight: 900 }}>{f.duration}</div>
            </div>
            <div style={{
              width: 28, height: 28, border: `2px solid ${hov ? C.ink : C.rule}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: hov ? C.ink : C.faded, fontSize: 13,
              background: hov ? C.acid : "transparent",
              transition: "all 0.2s",
            }}>→</div>
          </div>
        </div>

        {/* Bottom severity bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: C.rule }}>
          <div style={{ height: "100%", width: `${f.severityN * 10}%`, background: f.accentColor, transition: "width 1.2s ease" }} />
        </div>
      </div>
    </Reveal>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function IncidentModal({ f, onClose }: { f: typeof FAILURES[0]; onClose: () => void }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    setVis(true);
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, []);
  const close = () => { setVis(false); setTimeout(onClose, 350); };

  return (
    <div onClick={close} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      background: `rgba(14,12,9,${vis ? 0.72 : 0})`,
      backdropFilter: `blur(${vis ? 5 : 0}px)`,
      transition: "all 0.35s ease",
    }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 740,
          maxHeight: "92vh", overflowY: "auto",
          background: C.paper,
          borderTop: `6px solid ${f.accentColor}`,
          border: `1px solid ${C.rule}`,
          borderTop: `6px solid ${f.accentColor}`,
          boxShadow: `10px 10px 0 ${C.ink}`,
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0) rotate(0deg)" : "translateY(32px) rotate(1.2deg)",
          transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Modal header */}
        <div style={{ padding: "30px 34px 22px", borderBottom: `2px solid ${C.rule}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ border: `2px solid ${f.accentColor}`, padding: "4px 10px" }}>
                <span style={{ fontFamily: "'Special Elite', serif", fontSize: 10, letterSpacing: 3, color: f.accentColor }}>{f.id}</span>
              </div>
              <div style={{ border: `2px solid ${f.accentColor}`, padding: "4px 10px", transform: "rotate(-1deg)" }}>
                <span style={{ fontFamily: "'Special Elite', serif", fontSize: 10, letterSpacing: 3, color: f.accentColor }}>{f.classification}</span>
              </div>
            </div>
            <button onClick={close} style={{
              background: C.ink, color: C.paper, border: "none",
              width: 30, height: 30, cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = f.accentColor)}
              onMouseLeave={e => (e.currentTarget.style.background = C.ink)}
            >×</button>
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px,3.5vw,32px)", fontWeight: 900, color: C.ink, lineHeight: 1.2, marginBottom: 8 }}>{f.title}</h2>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: 12.5, color: C.faded, fontStyle: "italic", marginBottom: 16 }}>{f.subtitle}</p>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[["Author", f.author], ["Role", f.role], ["Date", f.caseDate], ["Downtime", f.duration], ["Severity", f.severity]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, color: C.faded }}>{k}</div>
                <div style={{ fontFamily: "'Special Elite', serif", fontSize: 13.5, color: C.ink }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "28px 34px 36px" }}>
          {/* Section label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ height: 1, flex: 1, background: f.accentColor, opacity: 0.3 }} />
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 3, color: f.accentColor }}>INCIDENT REPORT</span>
            <div style={{ height: 1, flex: 1, background: f.accentColor, opacity: 0.3 }} />
          </div>

          {/* Ruled paper story */}
          <div style={{
            background: `repeating-linear-gradient(${C.paper} 0px, ${C.paper} 27px, ${C.rule}44 27px, ${C.rule}44 28px)`,
            padding: "6px 14px 6px 44px", borderLeft: `4px solid ${f.accentColor}22`,
            position: "relative", marginBottom: 28,
          }}>
            <div style={{ position: "absolute", left: 34, top: 0, bottom: 0, width: 2, background: "rgba(192,57,43,0.12)" }} />
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: 13.5, lineHeight: "28px", color: C.ink2, whiteSpace: "pre-line" }}>{f.story}</p>
          </div>

          {/* Lesson */}
          <div style={{
            background: C.acid + "1A", border: `2px solid ${C.acid}`,
            borderLeft: `6px solid ${C.acidDim}`, padding: "18px 22px",
            position: "relative", marginBottom: 16,
          }}>
            <div style={{
              position: "absolute", top: -10, left: 18,
              background: C.paper, padding: "0 8px",
              fontFamily: "'Special Elite', serif", fontSize: 10, letterSpacing: 3, color: C.acidDim,
            }}>▸ KEY LESSON</div>
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: 13.5, lineHeight: 1.9, color: C.ink }}>{f.lesson}</p>
          </div>

          {/* Impact */}
          <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.04)", border: `1px dashed ${C.rule}`, display: "flex", gap: 12, marginBottom: 20 }}>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2, color: C.faded, whiteSpace: "nowrap", paddingTop: 2 }}>IMPACT:</span>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 13, color: C.ink2, lineHeight: 1.6 }}>{f.impact}</span>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {f.tags.map(t => (
              <span key={t} style={{
                fontFamily: "'Courier New', monospace", fontSize: 9, letterSpacing: 2,
                color: f.accentColor, border: `1px solid ${f.accentColor}55`,
                padding: "3px 10px", background: `${f.accentColor}0A`,
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function FailureLog() {
  const [cat, setCat] = useState("ALL CASES");
  const [open, setOpen] = useState<typeof FAILURES[0] | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const filtered = cat === "ALL CASES"
    ? FAILURES
    : FAILURES.filter(f => f.classification.toLowerCase().includes(cat.toLowerCase().replace(" error","").replace("operator","operator").split(" ")[0]));

  return (
    <>
<style jsx>{`
  @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Playfair+Display:ital,wght@0,400;0,900;1,400&display=swap');
  
  /* Scoped container - ONLY affects failure-log page */
  .failure-log-page * {
    box-sizing: border-box;
  }
  .failure-log-page {
    margin: 0;
    padding: 0;
  }
  
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes stampIn {
    0% { transform: rotate(-5deg) scale(1.3); opacity:0; }
    70% { transform: rotate(2deg) scale(0.97); opacity:0.9; }
    100% { transform: rotate(-1deg) scale(1); opacity:1; }
  }
  @keyframes wideUnderline {
    from { width: 0 }
    to { width: 100% }
  }
  
  /* Add class to ALL scrollable elements */
  .fl-mscroll::-webkit-scrollbar { width: 6px; }
  .fl-mscroll::-webkit-scrollbar-track { background: ${C.paper2}; }
  .fl-mscroll::-webkit-scrollbar-thumb { background: ${C.rule}; }
  
  .catbtn:hover { background: ${C.ink} !important; color: ${C.acid} !important; }
`}</style>


      <div style={{ background: C.paper, minHeight: "100vh", isolation: "isolate", position: "relative" }}>

        {/* Paper noise texture */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
          opacity: 0.5,
        }} />

        {/* ── MASTHEAD ── */}
        <header style={{ position: "relative", zIndex: 2 }}>
          <div style={{ height: 8, background: C.ink }} />
          <div style={{ height: 3, background: C.acid }} />
          <div style={{ height: 1, background: C.ink }} />

          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "44px 5% 0" }}>

            {/* Top kicker bar */}
            <div style={{
              display: "flex", alignItems: "center", gap: 0,
              marginBottom: 24,
              opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.2s",
              borderBottom: `1px solid ${C.rule}`, paddingBottom: 14,
            }}>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: C.faded }}>CodeNFacts</span>
              <span style={{ width: 1, height: 14, background: C.rule, margin: "0 16px", display: "inline-block" }} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 4, color: C.faded }}>FAILURE ARCHIVE</span>
              <span style={{ width: 1, height: 14, background: C.rule, margin: "0 16px", display: "inline-block" }} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 3, color: C.faded }}>VOL. I</span>
              <div style={{ flex: 1, height: 1, background: C.rule, marginLeft: 20 }} />
              <div style={{
                background: C.ink, color: C.acid,
                fontFamily: "'Special Elite', serif", fontSize: 10,
                letterSpacing: 4, padding: "5px 14px",
              }}>RESTRICTED</div>
            </div>

            {/* Giant editorial headline */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr auto",
              gap: "0 40px", alignItems: "start",
              borderBottom: `3px double ${C.ink}`, paddingBottom: 28, marginBottom: 32,
            }}>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(60px, 12vw, 140px)",
                fontWeight: 900, lineHeight: 0.9, letterSpacing: -4,
                color: C.ink,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(20px)",
                transition: "all 1s cubic-bezier(0.22,1,0.36,1) 0.3s",
              }}>
                THE<br />
                <span style={{ position: "relative", display: "inline-block" }}>
                  FAILURE
                  <span style={{
                    position: "absolute", bottom: 2, left: 0, height: 10,
                    background: C.acid, zIndex: -1,
                    width: mounted ? "100%" : "0%",
                    transition: "width 1.1s cubic-bezier(0.22,1,0.36,1) 1.1s",
                  }} />
                </span>
                <br />
                <span style={{ color: C.faded, fontSize: "0.52em", letterSpacing: -1 }}>
                  LOG.
                </span>
              </h1>

              {/* Right sidebar info box */}
              <div style={{
                width: 220, paddingTop: 8,
                opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.9s",
              }}>
                <div style={{ border: `2px solid ${C.ink}`, background: C.paper2 }}>
                  <div style={{
                    background: C.ink, padding: "8px 14px",
                    fontFamily: "'Special Elite', serif", fontSize: 10,
                    letterSpacing: 3, color: C.acid,
                  }}>CASE SUMMARY</div>
                  {[["Incidents", "06"], ["Hours Lost", "186+"], ["Devs Saved", "5,000+"], ["Lessons", "06"]].map(([k, v]) => (
                    <div key={k} style={{
                      display: "flex", justifyContent: "space-between",
                      padding: "8px 14px", borderBottom: `1px solid ${C.rule}`,
                      fontFamily: "'Courier New', monospace", fontSize: 12, color: C.ink2,
                    }}>
                      <span style={{ color: C.faded }}>{k}</span>
                      <span style={{ fontWeight: 700 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 12, padding: "10px 12px",
                  border: `1px dashed ${C.rule}`,
                  fontFamily: "'Courier New', monospace", fontSize: 10.5,
                  color: C.faded, lineHeight: 1.7, fontStyle: "italic",
                }}>
                  "Every catastrophe is a lesson that refused to be ignored."
                </div>
              </div>
            </div>

            {/* Deck */}
            <div style={{
              display: "grid", gridTemplateColumns: "3fr 2fr", gap: 40,
              marginBottom: 32, alignItems: "end",
              opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.7s",
            }}>
              <p style={{
                fontFamily: "'Special Elite', serif",
                fontSize: "clamp(15px, 2vw, 20px)",
                lineHeight: 1.65, color: C.ink2,
                borderLeft: `5px solid ${C.acid}`, paddingLeft: 18,
              }}>
                Every catastrophic mistake here was a developer's darkest hour. Documented publicly - anonymized, analyzed, filed - so you don't have to live through them yourself.
              </p>
              <div style={{
                fontFamily: "'Courier New', monospace", fontSize: 11.5,
                color: C.faded, lineHeight: 1.8,
              }}>
                <Typewriter text="> ARCHIVE INITIALIZED. 6 CASES LOADED. CLICK ANY REPORT TO READ." speed={20} />
              </div>
            </div>

            {/* Three-column rule */}
            <div style={{ display: "flex", gap: 3, marginBottom: 0 }}>
              <div style={{ flex: 5, height: 2, background: C.ink }} />
              <div style={{ flex: 1, height: 2, background: C.acid }} />
              <div style={{ flex: 2, height: 2, background: C.ink }} />
            </div>
          </div>
        </header>

        {/* ── NAV FILTER ── */}
        <div style={{ position: "relative", zIndex: 2, background: C.ink }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 5%", display: "flex", gap: 0, overflowX: "auto" }}>
            {CATS.map(c => (
              <button key={c} className="catbtn" onClick={() => setCat(c)} style={{
                fontFamily: "'Special Elite', serif", fontSize: 10,
                letterSpacing: 2, padding: "13px 16px",
                background: cat === c ? C.acid : "transparent",
                color: cat === c ? C.ink : "rgba(245,240,232,0.4)",
                border: "none", cursor: "pointer",
                borderRight: "1px solid rgba(255,255,255,0.07)",
                whiteSpace: "nowrap", transition: "all 0.18s",
              }}>{c}</button>
            ))}
            <div style={{ flex: 1, borderBottom: "none" }} />
            <div style={{
              display: "flex", alignItems: "center",
              fontFamily: "'Courier New', monospace", fontSize: 10,
              color: "rgba(245,240,232,0.3)", letterSpacing: 2, padding: "0 16px",
            }}>{filtered.length} ON FILE</div>
          </div>
        </div>

        {/* ── CARDS ── */}
        <main style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "56px 5% 100px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: C.ink, fontWeight: 900 }}>Incident Archive</h2>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: C.faded, letterSpacing: 2 }}>- {filtered.length} CASE{filtered.length !== 1 ? "S" : ""}</span>
            <div style={{ flex: 1, height: 1, background: C.rule }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 430px), 1fr))", gap: 22 }}>
            {filtered.map((f, i) => (
              <IncidentCard key={f.id} f={f} idx={i} onOpen={() => setOpen(f)} />
            ))}
          </div>
        </main>

        {/* ── CTA / SUBMIT ── */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <TornEdge />
          <section style={{ background: C.ink, padding: "72px 5% 80px" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <Reveal>
                <div style={{ display: "flex", gap: 60, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <h2 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(34px, 6vw, 68px)",
                      fontWeight: 900, color: C.paper, lineHeight: 1.0, marginBottom: 20,
                    }}>
                      Your failure<br />
                      <span style={{ color: C.acid }}>saves</span><br />
                      thousands.
                    </h2>
                    <p style={{ fontFamily: "'Courier New', monospace", fontSize: 13, color: "rgba(245,240,232,0.45)", lineHeight: 1.9, marginBottom: 30 }}>
                      Submit your worst debugging nightmare, deployment disaster, or interview breakdown. Anonymized. Documented. Turned into leverage for the next developer.
                    </p>
                    <a href="/submit-case" style={{
                      display: "inline-flex", alignItems: "center", gap: 12,
                      fontFamily: "'Special Elite', serif", fontSize: 13,
                      letterSpacing: 3, background: C.acid, color: C.ink,
                      padding: "16px 32px", textDecoration: "none",
                      boxShadow: `5px 5px 0 ${C.acidDim}`,
                      transition: "all 0.18s ease",
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `7px 7px 0 ${C.acidDim}`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = `5px 5px 0 ${C.acidDim}`; }}
                    >SUBMIT YOUR CASE →</a>
                  </div>

                  {/* Stamp cluster */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
                    {[
                      { t: "CLASSIFIED", c: C.stamp1, r: -4, delay: "0.1s" },
                      { t: "CASE CLOSED", c: C.stamp2, r: 3, delay: "0.25s" },
                      { t: "LESSON FILED", c: C.acidDim, r: -2, delay: "0.4s" },
                    ].map(s => (
                      <div key={s.t} style={{
                        border: `3px solid ${s.c}`,
                        padding: "6px 18px",
                        transform: `rotate(${s.r}deg)`,
                        animation: `stampIn 0.45s ease ${s.delay} both`,
                        opacity: 0.8,
                      }}>
                        <span style={{ fontFamily: "'Special Elite', serif", fontSize: 20, letterSpacing: 5, color: s.c }}>{s.t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
          <TornEdge flip />
        </div>
      </div>

      {open && <IncidentModal f={open} onClose={() => setOpen(null)} />}
    </>
  );
}