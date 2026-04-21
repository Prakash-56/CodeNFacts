"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────── DATA ────────────────────────────────────────

const INTERNSHIPS = [
  {
    id: "int-fe",
    badge: "UNPAID · REMOTE",
    title: "Frontend Engineer Intern",
    dept: "Engineering",
    tagline: "Ship features used by thousands",
    stack: ["React", "Tailwind", "TypeScript", "Figma"],
    duration: "3 months",
    stipend: "SKILL DEV/CERTIFICATE",
    seats: 12,
    seatsLeft: 4,
    accent: "#0AFF94",
    icon: "◈",
    level: "Beginner-Intermediate",
    mode: "Remote",
    perks: ["Certificate + LinkedIn rec", "Full-time conversion path", "Weekly 1-on-1 with senior eng", "Contribute to production codebase"],
    desc: "Work directly on our consumer-facing products. You'll own UI components, collaborate with designers, write TypeScript, and ship features that real users interact with every day.",
    tasks: ["Build and maintain React components", "Collaborate with designers via Figma", "Write unit and integration tests", "Participate in code reviews"],
  },
  {
    id: "int-be",
    badge: "UNPAID · REMOTE",
    title: "Backend Engineer Intern",
    dept: "Engineering",
    tagline: "APIs that don't fall over at 3AM",
    stack: ["Node.js", "PostgreSQL", "Redis", "AWS"],
    duration: "3 months",
    stipend: "SKILL DEV/CERTIFICATE",
    seats: 10,
    seatsLeft: 3,
    accent: "#FF5C38",
    icon: "◉",
    level: "Intermediate",
    mode: "Remote",
    perks: ["Own a live microservice", "System design mentoring", "Code review culture", "Performance benchmarking labs"],
    desc: "You'll own a real microservice end-to-end  from database schema design to deployment on AWS. Expect mentoring on system design, reliability, and writing code that scales.",
    tasks: ["Design and implement REST/GraphQL APIs", "Optimize SQL queries and indexes", "Set up caching with Redis", "Monitor and debug production issues"],
  },
  {
    id: "int-ai",
    badge: "UNPAID · HYBRID",
    title: "AI Research Intern",
    dept: "Research",
    tagline: "Papers don't write themselves",
    stack: ["Python", "PyTorch", "Jupyter", "LaTeX"],
    duration: "4 months",
    stipend: "SKILL DEV/CERTIFICATE",
    seats: 6,
    seatsLeft: 2,
    accent: "#C084FC",
    icon: "⬡",
    level: "Advanced",
    mode: "Hybrid",
    perks: ["Co-author research papers", "GPU cluster access", "Direct PhD mentor", "Conference presentation prep"],
    desc: "Dive into cutting-edge AI research alongside a PhD mentor. You'll run experiments, analyze results, contribute to papers, and get GPU cluster access for large-scale model training.",
    tasks: ["Run and document ML experiments", "Implement research papers from scratch", "Write and review academic prose", "Present findings to the team"],
  },
  {
    id: "int-devops",
    badge: "UNPAID · REMOTE",
    title: "DevOps / Cloud Intern",
    dept: "Infrastructure",
    tagline: "Own the pipes, own the power",
    stack: ["AWS", "Docker", "Kubernetes", "Terraform"],
    duration: "3 months",
    stipend: "SKILL DEV/CERTIFICATE",
    seats: 8,
    seatsLeft: 5,
    accent: "#38BDF8",
    icon: "◇",
    level: "Intermediate",
    mode: "Remote",
    perks: ["Real AWS environment labs", "Zero-downtime deploy drills", "AWS cert exam prep", "Infra design reviews"],
    desc: "Get your hands dirty with real infrastructure. You'll write Terraform modules, manage Kubernetes clusters, set up CI/CD pipelines, and make sure nothing catches fire on a Friday evening.",
    tasks: ["Write and maintain Terraform configs", "Manage Docker Compose and K8s manifests", "Set up GitHub Actions pipelines", "Monitor infra with CloudWatch / Grafana"],
  },
  {
    id: "int-pm",
    badge: "UNPAID · REMOTE",
    title: "Product Management Intern",
    dept: "Product",
    tagline: "Build what people actually want",
    stack: ["Notion", "Figma", "Analytics", "Jira"],
    duration: "2 months",
    stipend: "SKILL DEV / Certificate",
    seats: 5,
    seatsLeft: 2,
    accent: "#FACC15",
    icon: "◈",
    level: "Any",
    mode: "Remote",
    perks: ["Certificate + rec letter", "Direct access to founders", "Ship a real feature", "User research exposure"],
    desc: "Work side by side with our founding team to define, prioritise, and ship product features. You'll talk to users, write specs, and track metrics - the whole PM loop.",
    tasks: ["Write product requirement documents", "Conduct user interviews", "Prioritise backlog with engineers", "Analyse product metrics weekly"],
  },
  {
    id: "int-design",
    badge: "UNPAID · REMOTE",
    title: "UI/UX Design Intern",
    dept: "Design",
    tagline: "Make it beautiful and usable",
    stack: ["Figma", "Framer", "Principle", "Lottie"],
    duration: "3 months",
    stipend: "SKILL DEV/CERTIFICATE",
    seats: 6,
    seatsLeft: 3,
    accent: "#FB7185",
    icon: "◉",
    level: "Beginner-Intermediate",
    mode: "Remote",
    perks: ["Portfolio-worthy projects", "Design system contribution", "Live feedback from senior designers", "Framer / Lottie animation training"],
    desc: "Design real product screens, build design-system components in Figma, and animate micro-interactions that engineers actually ship. You'll work in a fast-paced, high-ownership environment.",
    tasks: ["Design and prototype new features", "Contribute to the Figma component library", "Run usability testing sessions", "Create Lottie animations for the mobile app"],
  },
 {
  id: "int-ml",
  badge: "UNPAID · REMOTE",
  title: "Machine Learning Intern",
  dept: "AI / ML",
  tagline: "Train models that actually work in prod",
  stack: ["Python", "PyTorch", "Scikit-learn", "Pandas", "HuggingFace"],
  duration: "1 months",
  stipend: "SKILL DEV/CERTIFICATE",
  seats: 8,
  seatsLeft: 3,
  accent: "#F97316",
  icon: "⬡",
  level: "Intermediate-Advanced",
  mode: "Remote",
  perks: [
    "GPU cloud credits included",
    "End-to-end ML pipeline ownership",
    "Weekly paper reading sessions",
    "Mentor from top AI research team",
  ],
  desc: "You'll build, train, evaluate, and deploy machine learning models on real datasets with real business impact. From feature engineering to serving predictions via API - you own the full loop.",
  tasks: [
    "Build and tune ML models using PyTorch and Scikit-learn",
    "Clean, explore and engineer features from raw datasets",
    "Deploy models as REST APIs using FastAPI",
    "Write experiment tracking reports using MLflow or W&B",
  ],
},
{
  id: "int-da",
  badge: "UNPAID · REMOTE",
  title: "Data Analysis Intern",
  dept: "Data",
  tagline: "Turn messy data into sharp decisions",
  stack: ["Python", "SQL", "Pandas", "Tableau", "Excel"],
  duration: "3 months",
  stipend: "SKILL DEV/CERTIFICATE",
  seats: 10,
  seatsLeft: 6,
  accent: "#2DD4BF",
  icon: "◇",
  level: "Beginner-Intermediate",
  mode: "Remote",
  perks: [
    "Work with real production datasets",
    "Build dashboards used by leadership",
    "SQL & Python mentoring from day one",
    "Certificate + LinkedIn recommendation",
  ],
  desc: "You'll dig into real datasets, uncover patterns, build dashboards, and write reports that directly influence product and business decisions. No toy datasets - real data, real stakes.",
  tasks: [
    "Write complex SQL queries to extract and clean data",
    "Build interactive dashboards in Tableau or Power BI",
    "Conduct exploratory data analysis using Pandas",
    "Present weekly insights reports to the product team",
  ],
},
];

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Fresher (Graduated)", "Working Professional"];
const DEGREE_OPTIONS = ["B.Tech / B.E.", "B.Sc", "BCA", "MCA", "M.Tech", "MBA", "Other"];

// ─────────────────────────────── UTILS ───────────────────────────────────────

function useCounter(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const frame = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(target * ease));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [target, duration]);
  return val;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─────────────────────────────── SUB-COMPONENTS ──────────────────────────────

function SeatBar({ seats, seatsLeft, accent }: { seats: number; seatsLeft: number; accent: string }) {
  const pct = ((seats - seatsLeft) / seats) * 100;
  const urgent = seatsLeft <= 3;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 9, letterSpacing: 2, color: "#444", fontFamily: "var(--cnf-mono)" }}>
        <span>SEATS FILLED</span>
        <span style={{ color: urgent ? "#FF5C38" : accent }}>{seatsLeft} LEFT{urgent ? " ⚠" : ""}</span>
      </div>
      <div style={{ height: 2, background: "#181818", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: urgent ? "linear-gradient(90deg,#FF5C38aa,#FF5C38)" : `linear-gradient(90deg,${accent}55,${accent})`, borderRadius: 2, transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)" }} />
      </div>
    </div>
  );
}

function Particles({ accent }: { accent: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const pts = Array.from({ length: 28 }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.1 + 0.3 }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > c.width) p.vx *= -1; if (p.y < 0 || p.y > c.height) p.vy *= -1; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = accent + "55"; ctx.fill(); });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => { const d = Math.hypot(a.x - b.x, a.y - b.y); if (d < 80) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = accent + Math.round((1 - d / 80) * 30).toString(16).padStart(2, "0"); ctx.lineWidth = 0.4; ctx.stroke(); } }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [accent]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5, pointerEvents: "none" }} />;
}

function RoleCard({ role, selected, onSelect }: { role: typeof INTERNSHIPS[0]; selected: boolean; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect(); if (!rect) return;
    setTilt({ x: ((e.clientX - rect.left) / rect.width - 0.5) * 8, y: ((e.clientY - rect.top) / rect.height - 0.5) * -8 });
  }, []);

  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }} onMouseMove={onMove} onClick={onSelect}
      style={{ position: "relative", padding: "24px 22px 20px", border: selected ? `1.5px solid ${role.accent}` : hovered ? `1.5px solid ${role.accent}33` : "1.5px solid #111", background: selected ? `linear-gradient(150deg,${role.accent}09,#090909)` : "#080808", borderRadius: 3, cursor: "pointer", transform: hovered ? `perspective(700px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateY(-4px)` : "perspective(700px) rotateY(0) rotateX(0) translateY(0)", transition: "transform 0.18s ease,border-color 0.3s,background 0.3s,box-shadow 0.3s", boxShadow: selected ? `0 0 36px ${role.accent}14,0 10px 36px rgba(0,0,0,0.7)` : hovered ? `0 0 22px ${role.accent}0b,0 8px 28px rgba(0,0,0,0.5)` : "0 2px 14px rgba(0,0,0,0.4)", overflow: "hidden", willChange: "transform" }}>
      {selected && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${role.accent},transparent)` }} />}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: hovered ? `radial-gradient(ellipse 70% 55% at 50% -5%,${role.accent}07,transparent)` : "transparent", transition: "background 0.35s" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span style={{ fontSize: 8, letterSpacing: 3, color: role.accent, fontFamily: "var(--cnf-mono)", background: `${role.accent}14`, padding: "3px 9px", borderRadius: 2 }}>{role.badge}</span>
        <span style={{ fontSize: 8, letterSpacing: 2, color: "#282828", fontFamily: "var(--cnf-mono)" }}>{role.dept}</span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 28, color: role.accent, display: "block", lineHeight: 1, marginBottom: 8, fontFamily: "var(--cnf-display)" }}>{role.icon}</span>
        <h3 style={{ fontFamily: "var(--cnf-display)", fontSize: 21, letterSpacing: 1, color: "#f0f0f0", lineHeight: 1.1, marginBottom: 4 }}>{role.title}</h3>
        <p style={{ fontSize: 10, color: "#484848", fontFamily: "var(--cnf-sans)", fontStyle: "italic" }}>{role.tagline}</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
        {role.stack.map(s => <span key={s} style={{ fontSize: 8, letterSpacing: 1, color: "#363636", border: "1px solid #181818", padding: "2px 7px", fontFamily: "var(--cnf-mono)" }}>{s}</span>)}
      </div>

      <p style={{ fontSize: 11, color: "#404040", fontFamily: "var(--cnf-sans)", lineHeight: 1.7, marginBottom: 14 }}>{role.desc}</p>

      <div style={{ marginBottom: 16 }}>
        {role.perks.map(p => <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderBottom: "1px solid #0f0f0f", fontSize: 10, color: "#5a5a5a", fontFamily: "var(--cnf-sans)" }}><span style={{ color: role.accent, fontSize: 5 }}>◆</span>{p}</div>)}
      </div>

      <SeatBar seats={role.seats} seatsLeft={role.seatsLeft} accent={role.accent} />

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "var(--cnf-display)", fontSize: 26, color: role.accent, lineHeight: 1 }}>{role.stipend}</div>
          <div style={{ fontSize: 8, color: "#383838", letterSpacing: 2, fontFamily: "var(--cnf-mono)", marginTop: 3 }}>{role.duration} · {role.mode}</div>
        </div>
        <div style={{ width: 36, height: 36, border: `1px solid ${selected ? role.accent : "#1e1e1e"}`, display: "flex", alignItems: "center", justifyContent: "center", color: selected ? role.accent : "#2a2a2a", fontSize: selected ? 14 : 16, transition: "all 0.3s", fontFamily: "var(--cnf-mono)" }}>
          {selected ? "✓" : "↗"}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────── MULTI-STEP FORM ─────────────────────────────

type FormData = {
  // Step 1 – Personal
  name: string; email: string; phone: string;
  // Step 2 – Academic
  college: string; degree: string; year: string; cgpa: string;
  // Step 3 – Links
  github: string; linkedin: string; portfolio: string; resume: string;
  // Step 4 – Experience
  experience: string; projects: string;
  // Step 5 – Motivation
  whyUs: string; availability: string; extraInfo: string;
};

const BLANK: FormData = { name: "", email: "", phone: "", college: "", degree: "", year: "", cgpa: "", github: "", linkedin: "", portfolio: "", resume: "", experience: "", projects: "", whyUs: "", availability: "", extraInfo: "" };

type Field = { key: keyof FormData; label: string; type: string; placeholder: string; required: boolean; hint?: string; options?: string[] };

const STEPS: { title: string; subtitle: string; fields: Field[] }[] = [
  {
    title: "Personal Details",
    subtitle: "Let's start with the basics.",
    fields: [
      { key: "name", label: "Full Name", type: "text", placeholder: "Ravi Sharma", required: true },
      { key: "email", label: "Email Address", type: "email", placeholder: "ravi@gmail.com", required: true, hint: "We'll send the confirmation here." },
      { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true },
    ],
  },
  {
    title: "Academic Background",
    subtitle: "Tell us where you're coming from.",
    fields: [
      { key: "college", label: "College / University", type: "text", placeholder: "IIT Bhubaneswar", required: true },
      { key: "degree", label: "Degree Program", type: "select", placeholder: "", required: true, options: DEGREE_OPTIONS },
      { key: "year", label: "Year / Current Status", type: "select", placeholder: "", required: true, options: YEAR_OPTIONS },
      { key: "cgpa", label: "CGPA / Percentage (optional)", type: "text", placeholder: "8.5 / 85%", required: false },
    ],
  },
  {
    title: "Your Online Presence",
    subtitle: "Show us your work - wherever it lives.",
    fields: [
      { key: "github", label: "GitHub Profile", type: "url", placeholder: "https://github.com/you", required: false },
      { key: "linkedin", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/in/you", required: false },
      { key: "portfolio", label: "Portfolio / Website", type: "url", placeholder: "https://yoursite.dev", required: false },
      { key: "resume", label: "Resume Link (Google Drive / Notion / PDF)", type: "url", placeholder: "https://drive.google.com/...", required: true, hint: "Make sure it's publicly accessible." },
    ],
  },
  {
    title: "Experience & Projects",
    subtitle: "What have you built? What have you broken?",
    fields: [
      { key: "experience", label: "Relevant Experience", type: "textarea", placeholder: "Describe any internships, freelance work, open-source contributions, or relevant jobs (3-5 sentences).", required: false },
      { key: "projects", label: "Top 2-3 Projects", type: "textarea", placeholder: "Briefly describe your best projects - what they do, the stack used, and any metrics or impact.", required: true },
    ],
  },
  {
    title: "Why CodeNFacts ?",
    subtitle: "This is the one that actually matters.",
    fields: [
      { key: "whyUs", label: "Why this role & why us?", type: "textarea", placeholder: "Tell us in 3-5 sentences - what draws you to this specific role, and why CodeNFacts over a random FAANG internship listing.", required: true },
      { key: "availability", label: "When can you start?", type: "text", placeholder: "e.g. Immediately / After 15 June 2026", required: true },
      { key: "extraInfo", label: "Anything else? (optional)", type: "textarea", placeholder: "Awards, certifications, side hustles, fun facts about yourself...", required: false },
    ],
  },
];

function InputField({ field, value, onChange, accent }: { field: Field; value: string; onChange: (v: string) => void; accent: string }) {
  const [focused, setFocused] = useState(false);
  const active = focused || !!value;
  const base: React.CSSProperties = { width: "100%", background: "#0c0c0c", border: `1px solid ${focused ? accent : active ? accent + "44" : "#1a1a1a"}`, color: "#e0e0e0", padding: "13px 15px", fontFamily: "var(--cnf-sans)", fontSize: 14, outline: "none", borderRadius: 2, transition: "border-color 0.2s", boxSizing: "border-box" };

  return (
    <div>
      <label style={{ display: "block", fontSize: 8, letterSpacing: 3, color: active ? accent + "99" : "#383838", marginBottom: 7, fontFamily: "var(--cnf-mono)", textTransform: "uppercase", transition: "color 0.2s" }}>
        {field.label}{field.required && <span style={{ color: accent, marginLeft: 4 }}>*</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} rows={4} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...base, resize: "vertical", minHeight: 96 }} />
      ) : field.type === "select" ? (
        <select value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...base, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "calc(100% - 14px) 50%", cursor: "pointer" }}>
          <option value="" disabled>Select an option</option>
          {field.options?.map(o => <option key={o} value={o} style={{ background: "#0c0c0c" }}>{o}</option>)}
        </select>
      ) : (
        <input type={field.type} value={value} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={base} />
      )}
      {field.hint && <p style={{ fontSize: 9, color: "#2e2e2e", fontFamily: "var(--cnf-mono)", marginTop: 5, letterSpacing: 1 }}>{field.hint}</p>}
    </div>
  );
}

function ApplyModal({ role, onClose }: { role: typeof INTERNSHIPS[0]; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(BLANK);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const cur = STEPS[step];
  const valid = cur.fields.every(f => !f.required || (form[f.key] as string).trim());

  const setField = (key: keyof FormData, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const submit = async () => {
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: role.title, dept: role.dept, stipend: role.stipend, duration: role.duration, mode: role.mode }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setErr("Couldn't send right now. Please try again in a moment.");
    } finally { setLoading(false); }
  };

  return (
    <div ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) onClose(); }} style={{ position: "fixed", inset: 0, zIndex: 9900, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(18px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "cnf-fadeIn 0.2s ease", overflowY: "auto" }}>
      <div style={{ width: "100%", maxWidth: 580, background: "#070707", border: `1px solid ${role.accent}2a`, borderRadius: 5, overflow: "hidden", animation: "cnf-slideUp 0.38s cubic-bezier(0.22,1,0.36,1)", boxShadow: `0 0 80px ${role.accent}0e,0 40px 80px rgba(0,0,0,0.85)`, position: "relative", margin: "auto" }}>
        <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${role.accent},transparent)` }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}><Particles accent={role.accent} /></div>

        <button onClick={onClose} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ff5c38"; (e.currentTarget as HTMLButtonElement).style.color = "#ff5c38"; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e1e1e"; (e.currentTarget as HTMLButtonElement).style.color = "#444"; }} style={{ position: "absolute", top: 18, right: 18, zIndex: 10, background: "transparent", border: "1px solid #1e1e1e", color: "#444", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--cnf-mono)", fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>✕</button>

        <div style={{ padding: "34px 38px 38px", position: "relative", zIndex: 1 }}>
          {!done ? (
            <>
              <div style={{ marginBottom: 24 }}>
                <span style={{ display: "block", fontSize: 8, letterSpacing: 4, color: role.accent, fontFamily: "var(--cnf-mono)", marginBottom: 6 }}>STEP {step + 1} / {STEPS.length} — {role.dept.toUpperCase()}</span>
                <h2 style={{ fontFamily: "var(--cnf-display)", fontSize: 34, color: "#fff", letterSpacing: 1, marginBottom: 4 }}>{cur.title}</h2>
                <p style={{ fontSize: 11, color: "#383838", fontFamily: "var(--cnf-mono)" }}>{cur.subtitle} · Applying for: <span style={{ color: role.accent }}>{role.title}</span></p>
              </div>

              <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
                {STEPS.map((_, i) => <div key={i} style={{ flex: 1, height: 2, background: i <= step ? role.accent : "#181818", borderRadius: 2, transition: "background 0.4s" }} />)}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {cur.fields.map(f => <InputField key={f.key} field={f} value={form[f.key] as string} onChange={v => setField(f.key, v)} accent={role.accent} />)}
              </div>

              {err && <p style={{ marginTop: 14, fontSize: 11, color: "#FF5C38", fontFamily: "var(--cnf-mono)" }}>{err}</p>}

              <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "space-between" }}>
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#333"; (e.currentTarget as HTMLButtonElement).style.color = "#aaa"; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e1e1e"; (e.currentTarget as HTMLButtonElement).style.color = "#444"; }} style={{ background: "transparent", border: "1px solid #1e1e1e", color: "#444", padding: "13px 22px", cursor: "pointer", fontFamily: "var(--cnf-mono)", fontSize: 9, letterSpacing: 3, transition: "all 0.2s" }}>← BACK</button>
                )}
                <button disabled={!valid || loading} onClick={() => { if (step < STEPS.length - 1) setStep(s => s + 1); else submit(); }} style={{ marginLeft: "auto", background: valid ? role.accent : "#111", border: "none", color: valid ? "#000" : "#2a2a2a", padding: "13px 30px", cursor: valid ? "pointer" : "not-allowed", fontFamily: "var(--cnf-mono)", fontSize: 10, letterSpacing: 3, fontWeight: 700, transition: "all 0.3s", opacity: loading ? 0.65 : 1, position: "relative", overflow: "hidden" }}>
                  {loading ? "SENDING..." : step < STEPS.length - 1 ? "NEXT →" : "SUBMIT APPLICATION"}
                  {valid && <span style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)", animation: "cnf-shimmer 2.4s infinite" }} />}
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
              <div style={{ width: 70, height: 70, margin: "0 auto 26px", border: `1px solid ${role.accent}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: role.accent, position: "relative", animation: "cnf-popIn 0.5s cubic-bezier(0.22,1,0.36,1)" }}>
                <div style={{ position: "absolute", inset: -13, border: `1px solid ${role.accent}28`, borderRadius: "50%", animation: "cnf-pulseRing 2s ease-out infinite" }} />
                ✓
              </div>
              <h2 style={{ fontFamily: "var(--cnf-display)", fontSize: 36, color: "#fff", letterSpacing: 2, marginBottom: 12 }}>APPLICATION SENT</h2>
              <p style={{ fontSize: 13, color: "#4a4a4a", fontFamily: "var(--cnf-sans)", lineHeight: 1.7, maxWidth: 320, margin: "0 auto 28px" }}>
                Your application for <span style={{ color: role.accent }}>{role.title}</span> is with our team. Expect a reply at <span style={{ color: "#c0c0c0" }}>{form.email}</span> within 24-48 hours.
              </p>
              <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${role.accent}33`, color: role.accent, padding: "11px 28px", cursor: "pointer", fontFamily: "var(--cnf-mono)", fontSize: 9, letterSpacing: 3, transition: "all 0.2s" }} onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = role.accent)} onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = role.accent + "33")}>CLOSE ✕</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────── MAIN PAGE ───────────────────────────────────

export default function InternPage() {
  const [selId, setSelId] = useState<string | null>(null);
  const [modalRole, setModalRole] = useState<typeof INTERNSHIPS[0] | null>(null);
  const [ready, setReady] = useState(false);
  const [deptFilter, setDeptFilter] = useState("ALL");

  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  const depts = ["ALL", ...Array.from(new Set(INTERNSHIPS.map(i => i.dept)))];
  const filtered = deptFilter === "ALL" ? INTERNSHIPS : INTERNSHIPS.filter(i => i.dept === deptFilter);
  const selected = INTERNSHIPS.find(i => i.id === selId);

  const c1 = useCounter(340, 1600);
  const c2 = useCounter(6, 1600);
  const c3 = useCounter(91, 1600);
  const c4 = useCounter(48, 1600);

  const processRef = useInView();
  const faqRef = useInView();
  const testimonialRef = useInView();

  const PROCESS = [
    { n: "01", title: "Pick a role", desc: "Browse our open internship tracks. Read the responsibilities, perks, and requirements carefully before selecting." },
    { n: "02", title: "Fill the form", desc: "5 quick steps - personal info, academic background, links, experience, and motivation. Under 4 minutes." },
    { n: "03", title: "Screening call", desc: "A 20-minute informal chat with our team to understand you better. No whiteboard. No stress." },
    { n: "04", title: "Small task", desc: "A role-specific take-home task (2-4 hours). We respect your time - tasks are paid if you reach this stage." },
    { n: "05", title: "Offer & onboarding", desc: "If it's a match, you'll get the offer letter within 48 hours. Onboarding starts the following Monday." },
    { n: "06", title: "Certificate of completion", desc: "Finish strong and walk away with a verified certificate, a detailed LinkedIn recommendation from your mentor, and a permanent reference in our network." },
  ];

  const FAQS = [
    { q: "Do I need prior experience?", a: "For most roles, no. We care more about curiosity, learning velocity, and how you think than years on a resume. Entry-level roles are explicitly marked." },
    { q: "Can I apply to multiple roles?", a: "Yes, but we recommend applying to your top 1-2 choices. Multiple applications don't increase your chances - a focused, tailored one does." },
    { q: "What does the stipend cover?", a: "The monthly stipend is transferred directly to your bank account. Hybrid/on-site roles also include transport reimbursement and lunch on office days." },
    { q: "Will I get a certificate?", a: "All interns who complete the programme receive a detailed certificate of completion, a LinkedIn recommendation from their mentor, and an internal reference for future opportunities." },
    { q: "What's the conversion rate to full-time?", a: "Around 40% of interns who complete the programme are offered a full-time role or extended internship. We're transparent about this - no vague promises." },
    { q: "I'm from a tier-3 college. Should I still apply?", a: "Absolutely. Some of our best interns come from tier-3 colleges. The application is blind to college prestige - we review code and thinking, not rankings." },
  ];

  const TESTIMONIALS = [
    { name: "Priya Nair", role: "Frontend Intern → Full-time SDE", college: "NIT Calicut", text: "I shipped a feature to 50,000 users in my second week. The mentorship was real - not just theory. My senior would sit with me for 45 minutes debugging CSS specificity. I learned more in 3 months than in 2 years of college.", accent: "#0AFF94" },
    { name: "Arjun Mehta", role: "AI Research Intern", college: "BITS Pilani", text: "I co-authored a paper that got submitted to NeurIPS. The GPU cluster access alone was worth it. My PhD mentor pushed me to think rigorously - the kind of thinking no online course teaches.", accent: "#C084FC" },
    { name: "Sneha Reddy", role: "Backend Intern", college: "JNTU Hyderabad", text: "Owning a live microservice from day one was terrifying and amazing. I broke prod once. We fixed it in 12 minutes. The postmortem was the best learning of my internship. No blame, just systems thinking.", accent: "#FF5C38" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@300;400;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        :root { --cnf-display:'Bebas Neue','Arial Black',sans-serif; --cnf-mono:'JetBrains Mono','Fira Code',monospace; --cnf-sans:'DM Sans','Segoe UI',sans-serif; }
        .cnf-root * { box-sizing:border-box; margin:0; padding:0; }
        .cnf-root ::selection { background:#0AFF94; color:#000; }
        @keyframes cnf-fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes cnf-slideUp  { from{opacity:0;transform:translateY(28px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes cnf-heroLine { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes cnf-heroWord { from{opacity:0;transform:translateY(64px) skewY(3deg)} to{opacity:1;transform:translateY(0) skewY(0)} }
        @keyframes cnf-marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes cnf-shimmer  { 0%{transform:translateX(-120%)} 100%{transform:translateX(200%)} }
        @keyframes cnf-pulseRing { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(2);opacity:0} }
        @keyframes cnf-popIn    { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.07)} 100%{transform:scale(1);opacity:1} }
        @keyframes cnf-gridPulse { 0%,100%{opacity:0.25} 50%{opacity:0.5} }
        @keyframes cnf-orbA     { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(40px,-30px) scale(1.06)} 70%{transform:translate(-20px,20px) scale(0.96)} }
        @keyframes cnf-orbB     { 0%,100%{transform:translate(0,0) scale(1)} 30%{transform:translate(-50px,25px) scale(1.04)} 65%{transform:translate(20px,-20px) scale(0.98)} }
        @keyframes cnf-float    { 0%,100%{transform:translateY(0) rotate(0deg)} 40%{transform:translateY(-14px) rotate(1.2deg)} 70%{transform:translateY(-7px) rotate(-1deg)} }
        @keyframes cnf-revealUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        .cnf-dept-btn { background:transparent; border:1px solid #161616; color:#3a3a3a; padding:8px 18px; font-family:var(--cnf-mono); font-size:9px; letter-spacing:3px; text-transform:uppercase; cursor:pointer; transition:all 0.22s; }
        .cnf-dept-btn:hover,.cnf-dept-btn.on { background:#0AFF94; border-color:#0AFF94; color:#000; }
        .cnf-cta { background:transparent; border:1px solid #1e1e1e; color:#555; padding:12px 24px; font-family:var(--cnf-mono); font-size:9px; letter-spacing:2px; cursor:pointer; transition:all 0.22s; }
        .cnf-cta:hover { border-color:#333; color:#aaa; }
        .cnf-cta.primary { background:#0AFF94; border-color:#0AFF94; color:#000; font-weight:700; }
        .cnf-cta.primary:hover { background:#00e882; }
        @media(max-width:900px){ .cnf-cards{grid-template-columns:1fr 1fr !important} .cnf-stats{grid-template-columns:1fr 1fr !important} .cnf-process{grid-template-columns:1fr 1fr !important} }
        @media(max-width:600px){ .cnf-cards{grid-template-columns:1fr !important} .cnf-stats{grid-template-columns:1fr 1fr !important} .cnf-pad{padding:80px 20px 48px !important} .cnf-sec{padding:0 20px 80px !important} .cnf-h1{font-size:clamp(52px,18vw,90px) !important} .cnf-why{grid-template-columns:1fr !important} .cnf-process{grid-template-columns:1fr !important} .cnf-section-pad{padding:60px 20px !important} }
      `}</style>

      <div className="cnf-root" style={{ background: "#020202", color: "#e0e0e0", fontFamily: "var(--cnf-sans)", position: "relative", overflow: "hidden" }}>

        {/* ── AMBIENT BG ── */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#0d0d0d 1px,transparent 1px),linear-gradient(90deg,#0d0d0d 1px,transparent 1px)", backgroundSize: "70px 70px", animation: "cnf-gridPulse 9s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: "3%", left: "-8%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(10,255,148,0.03) 0%,transparent 65%)", animation: "cnf-orbA 20s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "5%", right: "-10%", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle,rgba(192,132,252,0.03) 0%,transparent 65%)", animation: "cnf-orbB 25s ease-in-out infinite" }} />
        </div>

        {/* ══════════════════════ HERO ══════════════════════ */}
        <section className="cnf-pad" style={{ padding: "108px 60px 64px", position: "relative", zIndex: 1, minHeight: "60vh" }}>
          <div style={{ position: "absolute", top: 72, right: 72, width: 200, height: 200, border: "1px solid #0AFF9412", borderRadius: "50%", animation: "cnf-float 8s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 116, right: 132, width: 90, height: 90, border: "1px solid #0AFF9424", borderRadius: "50%", animation: "cnf-float 5.5s ease-in-out infinite reverse", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 40, left: 60, width: 120, height: 120, border: "1px solid #C084FC12", borderRadius: "50%", animation: "cnf-float 7s ease-in-out infinite 2s", pointerEvents: "none" }} />

          <p style={{ fontSize: 9, letterSpacing: 5, color: "#0AFF94", fontFamily: "var(--cnf-mono)", marginBottom: 26, opacity: ready ? 1 : 0, transition: "opacity 0.7s" }}>[ CodeNFacts / Internships / 2026 Cohort ]</p>

          {["INTERN WITH us", "US."].map((word, wi) => (
            <div key={word} style={{ overflow: "hidden" }}>
              <h1 className="cnf-h1" style={{ fontFamily: "var(--cnf-display)", fontSize: "clamp(68px,10.5vw,140px)", lineHeight: 0.9, letterSpacing: 3, color: wi === 0 ? "#fff" : "transparent", WebkitTextStroke: wi === 1 ? "1px #1c1c1c" : undefined, marginBottom: wi === 0 ? 6 : 44, animation: ready ? `cnf-heroWord 0.95s cubic-bezier(0.22,1,0.36,1) ${0.08 + wi * 0.18}s both` : "none" }}>
                {wi === 1 ? <><span style={{ color: "#0AFF9", WebkitTextStroke: "0px" }}></span></> : word}
              </h1>
            </div>
          ))}

          <div style={{ height: 1, background: "linear-gradient(90deg,#0AFF9444,transparent)", transformOrigin: "left", maxWidth: 340, marginBottom: 28, animation: ready ? "cnf-heroLine 1.1s cubic-bezier(0.22,1,0.36,1) 0.55s both" : "none" }} />

          <p style={{ fontSize: 14, color: "#484848", maxWidth: 480, lineHeight: 1.78, fontFamily: "var(--cnf-sans)", fontWeight: 300, opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.9s 0.6s,transform 0.9s 0.6s", marginBottom: 36 }}>
            Not a CV-farming scheme. We offer real engineering internships with real ownership, real mentorship, and a real shot at a full-time offer. Six roles open. Limited seats. No deadline extensions.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", opacity: ready ? 1 : 0, transition: "opacity 0.9s 0.9s" }}>
            {[{ label: "CSoC", accent: "#0AFF94" }, { label: "Summer Of Code", accent: "#FACC15" }, { label: "Remote & Hybrid", accent: "#38BDF8" }, { label: "Full-time Path", accent: "#C084FC" }].map(tag => (
              <span key={tag.label} style={{ fontSize: 9, letterSpacing: 2, color: tag.accent, border: `1px solid ${tag.accent}22`, padding: "5px 12px", fontFamily: "var(--cnf-mono)", background: `${tag.accent}08` }}>{tag.label}</span>
            ))}
          </div>
        </section>

        {/* ══════════════════════ TICKER ══════════════════════ */}
        <div style={{ overflow: "hidden", borderTop: "1px solid #0e0e0e", borderBottom: "1px solid #0e0e0e", padding: "13px 0", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", gap: 56, whiteSpace: "nowrap", animation: "cnf-marquee 28s linear infinite" }}>
            {[...Array(2).fill(["FRONTEND","◈","BACKEND","◉","AI RESEARCH","⬡","DEVOPS","◇","PRODUCT","●","UI/UX DESIGN","◈","PAID INTERNSHIPS","◉","REAL OWNERSHIP","⬡"])].flat().map((item: string, i: number) => (
              <span key={i} style={{ fontSize: 9, letterSpacing: 4, color: "#222", fontFamily: "var(--cnf-mono)", textTransform: "uppercase", flexShrink: 0 }}>{item}</span>
            ))}
          </div>
        </div>

        {/* ══════════════════════ STATS ══════════════════════ */}
        <div style={{ padding: "0 60px", position: "relative", zIndex: 1 }}>
          <div className="cnf-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid #0d0d0d", borderBottom: "1px solid #0d0d0d", marginBottom: 100 }}>
            {[{ val: c1, suffix: "+", label: "INTERNS PLACED" }, { val: c2, suffix: "", label: "OPEN ROLES NOW" }, { val: c3, suffix: "%", label: "COMPLETION RATE" }, { val: c4, suffix: "h", label: "AVG RESPONSE TIME" }].map((s, i) => (
              <div key={i} style={{ padding: "38px 0", textAlign: "center", borderRight: i < 3 ? "1px solid #0d0d0d" : "none" }}>
                <div style={{ fontFamily: "var(--cnf-display)", fontSize: 50, color: "#dcdcdc", lineHeight: 1, letterSpacing: 2 }}>{s.val}{s.suffix}</div>
                <div style={{ fontSize: 8, color: "#303030", letterSpacing: 3, fontFamily: "var(--cnf-mono)", marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════ ROLES ══════════════════════ */}
        <section className="cnf-sec" style={{ padding: "0 60px 100px", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 9, letterSpacing: 5, color: "#0AFF94", fontFamily: "var(--cnf-mono)", marginBottom: 10 }}>OPEN POSITIONS</p>
            <h2 style={{ fontFamily: "var(--cnf-display)", fontSize: 56, color: "#fff", letterSpacing: 2, marginBottom: 14 }}>PICK YOUR ROLE</h2>
            <p style={{ fontSize: 13, color: "#3e3e3e", maxWidth: 520, lineHeight: 1.7, fontFamily: "var(--cnf-sans)", fontWeight: 300, marginBottom: 36 }}>Browse all open internship roles below. Each role is unique - different stack, different mentors, different day-to-day reality. Read carefully before applying.</p>
          </div>

          <div style={{ display: "flex", gap: 2, marginBottom: 52, flexWrap: "wrap", alignItems: "flex-end" }}>
            {depts.map(d => <button key={d} className={`cnf-dept-btn ${deptFilter === d ? "on" : ""}`} onClick={() => { setDeptFilter(d); setSelId(null); }}>{d}</button>)}
            <div style={{ flex: 1, borderBottom: "1px solid #0e0e0e", minWidth: 16 }} />
            <span style={{ fontSize: 9, color: "#242424", fontFamily: "var(--cnf-mono)", letterSpacing: 2, paddingBottom: 3 }}>{filtered.length} ROLES</span>
          </div>

          <div className="cnf-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 2 }}>
            {filtered.map(role => <RoleCard key={role.id} role={role} selected={selId === role.id} onSelect={() => setSelId(selId === role.id ? null : role.id)} />)}
          </div>

          {selected && (
            <div style={{ marginTop: 3, padding: "26px 34px", background: `linear-gradient(135deg,${selected.accent}08,#090909)`, border: `1px solid ${selected.accent}38`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, animation: "cnf-slideUp 0.3s cubic-bezier(0.22,1,0.36,1)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 120% at 0% 50%,${selected.accent}06,transparent)`, pointerEvents: "none" }} />
              <div style={{ zIndex: 1 }}>
                <p style={{ fontSize: 8, letterSpacing: 4, color: selected.accent, fontFamily: "var(--cnf-mono)", marginBottom: 5 }}>SELECTED · {selected.dept.toUpperCase()}</p>
                <h3 style={{ fontFamily: "var(--cnf-display)", fontSize: 26, color: "#f0f0f0", letterSpacing: 1, marginBottom: 3 }}>{selected.title}</h3>
                <p style={{ fontSize: 10, color: "#3a3a3a", fontFamily: "var(--cnf-mono)" }}>{selected.seatsLeft} seats left · {selected.stipend} · {selected.duration} · {selected.mode}</p>
              </div>
              <div style={{ display: "flex", gap: 8, zIndex: 1 }}>
                <button className="cnf-cta" onClick={() => setSelId(null)}>DESELECT</button>
                <button className="cnf-cta primary" style={{ background: selected.accent, borderColor: selected.accent }} onClick={() => setModalRole(selected)}>APPLY NOW →</button>
              </div>
            </div>
          )}
        </section>

        {/* ══════════════════════ PROCESS ══════════════════════ */}
        <section className="cnf-section-pad" style={{ borderTop: "1px solid #0d0d0d", padding: "80px 60px", position: "relative", zIndex: 1 }}>
          <div ref={processRef.ref}>
            <p style={{ fontSize: 9, letterSpacing: 5, color: "#0AFF94", fontFamily: "var(--cnf-mono)", marginBottom: 10 }}>HOW IT WORKS</p>
            <h2 style={{ fontFamily: "var(--cnf-display)", fontSize: 52, color: "#fff", letterSpacing: 2, marginBottom: 14 }}>THE PROCESS</h2>
            <p style={{ fontSize: 13, color: "#3e3e3e", maxWidth: 480, lineHeight: 1.7, fontFamily: "var(--cnf-sans)", fontWeight: 300, marginBottom: 56 }}>No opaque hiring funnels. Here's exactly what happens after you hit submit.</p>
            <div className="cnf-process" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 2 }}>
              {PROCESS.map((item, i) => (
                <div key={item.n} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1a1a1a"; (e.currentTarget as HTMLDivElement).style.background = "#080808"; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#0d0d0d"; (e.currentTarget as HTMLDivElement).style.background = "#050505"; }} style={{ padding: "28px 22px", border: "1px solid #0d0d0d", background: "#050505", transition: "all 0.3s", opacity: processRef.inView ? 1 : 0, transform: processRef.inView ? "translateY(0)" : "translateY(30px)", transitionDelay: `${i * 0.1}s` }}>
                  <div style={{ fontFamily: "var(--cnf-display)", fontSize: 42, color: "#0AFF9422", lineHeight: 1, marginBottom: 14 }}>{item.n}</div>
                  <h4 style={{ fontFamily: "var(--cnf-display)", fontSize: 18, color: "#bbb", letterSpacing: 1, marginBottom: 10 }}>{item.title}</h4>
                  <p style={{ fontSize: 11, color: "#3e3e3e", lineHeight: 1.75, fontFamily: "var(--cnf-sans)", fontWeight: 300 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════ TESTIMONIALS ══════════════════════ */}
        <section className="cnf-section-pad" style={{ borderTop: "1px solid #0d0d0d", padding: "80px 60px", position: "relative", zIndex: 1 }}>
          <div ref={testimonialRef.ref}>
            <p style={{ fontSize: 9, letterSpacing: 5, color: "#0AFF94", fontFamily: "var(--cnf-mono)", marginBottom: 10 }}>FROM OUR INTERNS</p>
            <h2 style={{ fontFamily: "var(--cnf-display)", fontSize: 52, color: "#fff", letterSpacing: 2, marginBottom: 56 }}>REAL WORDS</h2>
            <div className="cnf-why" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={t.name} style={{ padding: "32px 28px", border: `1px solid ${t.accent}18`, background: `${t.accent}04`, opacity: testimonialRef.inView ? 1 : 0, transform: testimonialRef.inView ? "translateY(0)" : "translateY(30px)", transition: `opacity 0.6s ${i * 0.15}s, transform 0.6s ${i * 0.15}s` }}>
                  <div style={{ fontSize: 32, color: t.accent, fontFamily: "var(--cnf-display)", lineHeight: 1, marginBottom: 18, opacity: 0.4 }}>"</div>
                  <p style={{ fontSize: 13, color: "#5a5a5a", lineHeight: 1.8, fontFamily: "var(--cnf-sans)", fontWeight: 300, marginBottom: 24, fontStyle: "italic" }}>{t.text}</p>
                  <div style={{ borderTop: `1px solid ${t.accent}18`, paddingTop: 16 }}>
                    <p style={{ fontSize: 12, color: "#c0c0c0", fontFamily: "var(--cnf-display)", letterSpacing: 1 }}>{t.name}</p>
                    <p style={{ fontSize: 9, color: t.accent, fontFamily: "var(--cnf-mono)", letterSpacing: 2, marginTop: 3 }}>{t.role}</p>
                    <p style={{ fontSize: 9, color: "#303030", fontFamily: "var(--cnf-mono)", letterSpacing: 1, marginTop: 2 }}>{t.college}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════ WHY SECTION ══════════════════════ */}
        <section className="cnf-section-pad" style={{ borderTop: "1px solid #0d0d0d", padding: "80px 60px", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 9, letterSpacing: 5, color: "#0AFF94", fontFamily: "var(--cnf-mono)", marginBottom: 10 }}>WHY CodeNFacts</p>
          <h2 style={{ fontFamily: "var(--cnf-display)", fontSize: 52, color: "#fff", letterSpacing: 2, marginBottom: 56 }}>THE DIFFERENCE</h2>
          <div className="cnf-why" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
            {[
              { n: "01", title: "Mentors who ship", desc: "Every mentor is an active engineer at a product company - not a LinkedIn influencer with a PDF course. They review your actual code, not a checklist." },
              { n: "02", title: "Real ownership", desc: "You'll own something that affects real users. Not a sandbox. Not a tutorial project. A real service, a real feature, a real experiment." },
              { n: "03", title: "No fluff curriculum", desc: "We update what you work on every quarter. If a tech is dead, we bury it. If it's rising, we teach it fast. No 2019 syllabi." },
              { n: "04", title: "Transparent process", desc: "You'll always know where you stand. Every stage has a clear outcome. We don't ghost candidates. We give structured feedback at every step." },
              { n: "05", title: "Your portfolio ≠ todo app", desc: "Every project is production-grade with real users, real traffic, and real feedback from engineers who've seen thousands of bad apps." },
              { n: "06", title: "A path, not a pit stop", desc: "40% of interns convert to full-time roles. The rest leave with a portfolio that gets them hired elsewhere. We measure our success by your outcomes." },
            ].map(item => (
              <div key={item.n} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1a1a1a"; (e.currentTarget as HTMLDivElement).style.background = "#080808"; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#0d0d0d"; (e.currentTarget as HTMLDivElement).style.background = "#050505"; }} style={{ padding: "34px 30px", border: "1px solid #0d0d0d", background: "#050505", transition: "border-color 0.3s,background 0.3s" }}>
                <div style={{ fontFamily: "var(--cnf-display)", fontSize: 56, color: "#0f0f0f", lineHeight: 1, marginBottom: 14 }}>{item.n}</div>
                <h4 style={{ fontFamily: "var(--cnf-display)", fontSize: 20, color: "#bbb", letterSpacing: 1, marginBottom: 10 }}>{item.title}</h4>
                <p style={{ fontSize: 12, color: "#3e3e3e", lineHeight: 1.75, fontFamily: "var(--cnf-sans)", fontWeight: 300 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════ FAQ ══════════════════════ */}
        <section className="cnf-section-pad" style={{ borderTop: "1px solid #0d0d0d", padding: "80px 60px", position: "relative", zIndex: 1 }}>
          <div ref={faqRef.ref}>
            <p style={{ fontSize: 9, letterSpacing: 5, color: "#0AFF94", fontFamily: "var(--cnf-mono)", marginBottom: 10 }}>GOT QUESTIONS</p>
            <h2 style={{ fontFamily: "var(--cnf-display)", fontSize: 52, color: "#fff", letterSpacing: 2, marginBottom: 52 }}>FREQUENTLY ASKED</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 2 }}>
              {FAQS.map((faq, i) => (
                <FaqItem key={faq.q} faq={faq} inView={faqRef.inView} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════ CTA BANNER ══════════════════════ */}
        <section style={{ borderTop: "1px solid #0d0d0d", padding: "80px 60px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%,rgba(10,255,148,0.02),transparent)", pointerEvents: "none" }} />
          <p style={{ fontSize: 9, letterSpacing: 5, color: "#0AFF94", fontFamily: "var(--cnf-mono)", marginBottom: 16 }}>READY?</p>
          <h2 style={{ fontFamily: "var(--cnf-display)", fontSize: "clamp(48px,8vw,100px)", color: "#fff", letterSpacing: 3, lineHeight: 0.9, marginBottom: 28 }}>
            APPLY NOW.<br /><span style={{ color: "transparent", WebkitTextStroke: "1px #1c1c1c" }}>SEATS CLOSE SOON.</span>
          </h2>
          <p style={{ fontSize: 13, color: "#3e3e3e", maxWidth: 420, margin: "0 auto 40px", lineHeight: 1.7, fontFamily: "var(--cnf-sans)", fontWeight: 300 }}>
            Browse the open roles above, select one, and hit Apply Now. The whole process takes less than 4 minutes.
          </p>
          <button className="cnf-cta primary" style={{ fontSize: 11, padding: "16px 40px", letterSpacing: 4 }} onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            ↑ VIEW OPEN ROLES
          </button>
        </section>

        {/* ══════════════════════ FOOTER ══════════════════════ */}
        <footer style={{ borderTop: "1px solid #0d0d0d", padding: "32px 60px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 9, letterSpacing: 3, color: "#1e1e1e", fontFamily: "var(--cnf-mono)" }}>© 2026 CodeNFacts - ALL RIGHTS RESERVED</span>
          <span style={{ fontSize: 9, letterSpacing: 3, color: "#1e1e1e", fontFamily: "var(--cnf-mono)" }}>INTERNSHIPS · COURSES · MENTORSHIP</span>
        </footer>

        {/* ══════════════════════ MODAL ══════════════════════ */}
        {modalRole && <ApplyModal role={modalRole} onClose={() => setModalRole(null)} />}
      </div>
    </>
  );
}

function FaqItem({ faq, inView, delay }: { faq: { q: string; a: string }; inView: boolean; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{ padding: "24px 26px", border: "1px solid #0d0d0d", background: open ? "#080808" : "#050505", cursor: "pointer", transition: "all 0.3s", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transitionDelay: `${delay}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <h4 style={{ fontFamily: "var(--cnf-sans)", fontSize: 14, color: "#bbb", lineHeight: 1.4, fontWeight: 400 }}>{faq.q}</h4>
        <span style={{ color: "#0AFF94", fontFamily: "var(--cnf-mono)", fontSize: 14, flexShrink: 0, transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.3s" }}>+</span>
      </div>
      {open && <p style={{ fontSize: 12, color: "#484848", lineHeight: 1.75, fontFamily: "var(--cnf-sans)", fontWeight: 300, marginTop: 14 }}>{faq.a}</p>}
    </div>
  );
}
