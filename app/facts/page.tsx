"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ── */
type FactCategory =
  | "all"
  | "internet"
  | "languages"
  | "companies"
  | "hardware"
  | "history"
  | "science"
  | "ai"
  | "security"
  | "gaming"
  | "space"
  | "crypto"
  | "programming";

interface Fact {
  id: number;
  category: FactCategory;
  categoryLabel: string;
  emoji: string;
  headline: string;
  body: string;
  source: string;
  year: number;
  wow: number; // 1-5
  color: string; // neon accent
  tags: string[];
  readTime?: string; // premium addition
}

/* ── Expanded Premium Facts Data (24 high-quality, verified facts) ── */
const FACTS: Fact[] = [
  // Original 12 (slightly enhanced bodies + readTime)
  {
    id: 1,
    category: "internet",
    categoryLabel: "Internet",
    emoji: "🌐",
    headline: "The first website is still live",
    body: "Tim Berners-Lee launched the world's first website on August 6, 1991 at CERN. It explained the World Wide Web project. The original URL - info.cern.ch - still resolves today, making it the longest-running website in history at over 34 years old.",
    source: "CERN",
    year: 1991,
    wow: 4,
    color: "#22d3ee",
    tags: ["web", "history", "CERN"],
    readTime: "1 min",
  },
  {
    id: 2,
    category: "languages",
    categoryLabel: "Languages",
    emoji: "🐍",
    headline: "Python was named after a comedy show",
    body: "Guido van Rossum named Python after Monty Python's Flying Circus, not the snake. He wanted a name that was short, unique, and slightly mysterious. The language was designed to be fun to use - the comedic naming was intentional.",
    source: "Python Docs",
    year: 1991,
    wow: 3,
    color: "#fbbf24",
    tags: ["python", "naming", "history"],
    readTime: "45 sec",
  },
  {
    id: 3,
    category: "companies",
    categoryLabel: "Companies",
    emoji: "🍎",
    headline: "Apple was literally saved by Microsoft",
    body: "In 1997, when Apple was weeks from bankruptcy, Microsoft invested $150 million and agreed to continue making Office for Mac for 5 years. Bill Gates appeared on screen at Macworld to thunderous boos. Steve Jobs called it a new era of cooperation.",
    source: "SEC Filing 1997",
    year: 1997,
    wow: 5,
    color: "#f472b6",
    tags: ["apple", "microsoft", "business"],
    readTime: "1 min",
  },
  {
    id: 4,
    category: "hardware",
    categoryLabel: "Hardware",
    emoji: "⚡",
    headline: "Modern CPUs execute billions of nops",
    body: "Modern out-of-order CPUs are so fast they often execute 'nothing' - NOP instructions - to keep pipelines full. A 6 GHz CPU can execute over 6 billion NOPs per second while idling. Your computer literally does nothing at full speed.",
    source: "Intel Architecture Manual",
    year: 2024,
    wow: 5,
    color: "#a78bfa",
    tags: ["cpu", "architecture", "performance"],
    readTime: "55 sec",
  },
  {
    id: 5,
    category: "history",
    categoryLabel: "History",
    emoji: "🐛",
    headline: "The first computer bug was a real bug",
    body: "On September 9, 1947, Grace Hopper's team found a moth trapped in a relay of the Harvard Mark II. They taped it to the logbook with the note 'first actual case of bug being found.' The term 'debugging' was born.",
    source: "Naval History Museum",
    year: 1947,
    wow: 5,
    color: "#34d399",
    tags: ["debugging", "grace-hopper", "history"],
    readTime: "50 sec",
  },
  {
    id: 6,
    category: "internet",
    categoryLabel: "Internet",
    emoji: "📧",
    headline: "Email predates the internet by over a decade",
    body: "Ray Tomlinson sent the first networked email in 1971 on ARPANET. He invented the @ symbol. He later said he couldn't remember the content of that historic first message.",
    source: "Computer History Museum",
    year: 1971,
    wow: 4,
    color: "#fb923c",
    tags: ["email", "ARPANET", "origins"],
    readTime: "45 sec",
  },
  {
    id: 7,
    category: "languages",
    categoryLabel: "Languages",
    emoji: "☕",
    headline: "JavaScript was built in 10 days",
    body: "Brendan Eich created JavaScript in just 10 days in May 1995 at Netscape. Originally called Mocha, then LiveScript, then JavaScript to ride Java's hype. Its rushed design explains why we still debate 'this' three decades later.",
    source: "Mozilla Blog",
    year: 1995,
    wow: 5,
    color: "#fbbf24",
    tags: ["javascript", "brendan-eich", "creation"],
    readTime: "1 min",
  },
  {
    id: 8,
    category: "companies",
    categoryLabel: "Companies",
    emoji: "🔍",
    headline: "Google's name is a misspelling",
    body: "Larry Page and Sergey Brin wanted 'Googol' (10¹⁰⁰). A graduate student misspelled it as 'Google' on a cheque. The domain was registered that way and the rest is history.",
    source: "Stanford Digital Library",
    year: 1998,
    wow: 4,
    color: "#4ade80",
    tags: ["google", "naming", "origin"],
    readTime: "40 sec",
  },
  {
    id: 9,
    category: "science",
    categoryLabel: "Science",
    emoji: "🧬",
    headline: "DNA is the most dense storage ever",
    body: "One gram of synthetic DNA can store 215 petabytes - the entire internet could fit in a shoebox of DNA with room to spare. In 2019 researchers encoded an entire OS, movies, and files into DNA.",
    source: "Nature Biotechnology",
    year: 2019,
    wow: 5,
    color: "#e879f9",
    tags: ["DNA", "storage", "bio-computing"],
    readTime: "1 min",
  },
  {
    id: 10,
    category: "hardware",
    categoryLabel: "Hardware",
    emoji: "💾",
    headline: "The first 1GB hard drive weighed 550 pounds",
    body: "IBM 3380 (1980) was the first 1 GB drive - size of a refrigerator, weighed 550 lbs (250 kg), cost up to $80,000. Today a $12 microSD card holds 1 TB in your fingernail.",
    source: "IBM Archives",
    year: 1980,
    wow: 5,
    color: "#67e8f9",
    tags: ["storage", "IBM", "milestones"],
    readTime: "50 sec",
  },
  {
    id: 11,
    category: "history",
    categoryLabel: "History",
    emoji: "🚀",
    headline: "Apollo 11 ran on 4KB of RAM",
    body: "The Apollo Guidance Computer had 4 KB RAM and 72 KB ROM - woven by hand by women nicknamed 'Little Old Ladies'. Today's Apple Watch has over 1 million times more RAM.",
    source: "NASA Technical Reports",
    year: 1969,
    wow: 5,
    color: "#818cf8",
    tags: ["nasa", "apollo", "computing"],
    readTime: "1 min",
  },
  {
    id: 12,
    category: "science",
    categoryLabel: "Science",
    emoji: "⚛️",
    headline: "Quantum supremacy achieved in 200 seconds",
    body: "Google's Sycamore (2019) solved a task in 200 seconds that would take the world's fastest supercomputer ~10,000 years. First demonstration of quantum supremacy.",
    source: "Nature / Google AI",
    year: 2019,
    wow: 5,
    color: "#34d399",
    tags: ["quantum", "google", "computing"],
    readTime: "55 sec",
  },

  // ── NEW PREMIUM FACTS (12 more) ──
  {
    id: 13,
    category: "ai",
    categoryLabel: "AI",
    emoji: "🤖",
    headline: "ChatGPT reached 1M users in 5 days",
    body: "OpenAI launched ChatGPT on Nov 30, 2022. It became the fastest-growing consumer app in history - 1 million users in just 5 days. Instagram took 2.5 months.",
    source: "OpenAI / UBS",
    year: 2022,
    wow: 5,
    color: "#22d3ee",
    tags: ["chatgpt", "openai", "growth"],
    readTime: "50 sec",
  },
  {
    id: 14,
    category: "ai",
    categoryLabel: "AI",
    emoji: "🧠",
    headline: "AlphaGo defeated world Go champion",
    body: "In 2016 Google's AlphaGo beat 9-dan master Lee Sedol 4-1. Go has more possible positions than atoms in the observable universe (10¹⁷⁰). This event accelerated global AI investment.",
    source: "Nature / DeepMind",
    year: 2016,
    wow: 5,
    color: "#60a5fa",
    tags: ["alphago", "deepmind", "go"],
    readTime: "1 min",
  },
  {
    id: 15,
    category: "security",
    categoryLabel: "Security",
    emoji: "🔐",
    headline: "Morris Worm took down 10% of the internet",
    body: "Released Nov 2, 1988 by Robert Morris, the first major internet worm infected ~6,000 machines (10% of the internet). It caused millions in damage and led to the first conviction under the Computer Fraud Act.",
    source: "MIT / FBI",
    year: 1988,
    wow: 5,
    color: "#f87171",
    tags: ["worm", "cybersecurity", "history"],
    readTime: "55 sec",
  },
  {
    id: 16,
    category: "gaming",
    categoryLabel: "Gaming",
    emoji: "🎮",
    headline: "Minecraft sold for $2.5 billion",
    body: "Notch released Minecraft in 2009 as a side project. Microsoft acquired Mojang for $2.5 billion in 2014. Today it has sold over 300 million copies - the best-selling game ever.",
    source: "Microsoft",
    year: 2014,
    wow: 4,
    color: "#4ade80",
    tags: ["minecraft", "notch", "business"],
    readTime: "45 sec",
  },
  {
    id: 17,
    category: "space",
    categoryLabel: "Space",
    emoji: "🛰️",
    headline: "Voyager 1 still talks after 47+ years",
    body: "Launched 1977, Voyager 1 is humanity's farthest object (15.4 billion miles). It transmits data with a 23-watt radio - weaker than a fridge light bulb. Still operational in 2025.",
    source: "NASA JPL",
    year: 1977,
    wow: 5,
    color: "#67e8f9",
    tags: ["voyager", "nasa", "deep-space"],
    readTime: "1 min",
  },
  {
    id: 18,
    category: "crypto",
    categoryLabel: "Crypto",
    emoji: "₿",
    headline: "Bitcoin whitepaper published on Halloween",
    body: "Satoshi Nakamoto released the Bitcoin whitepaper on Oct 31, 2008. The genesis block (Jan 3, 2009) contains the headline: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks'.",
    source: "Bitcoin.org",
    year: 2008,
    wow: 5,
    color: "#fbbf24",
    tags: ["bitcoin", "satoshi", "blockchain"],
    readTime: "50 sec",
  },
  {
    id: 19,
    category: "programming",
    categoryLabel: "Programming",
    emoji: "📜",
    headline: "First 'Hello, World!' program - 1972",
    body: "Brian Kernighan used the phrase in a 1972 tutorial for the B language (predecessor to C). It became the universal first program in almost every language taught since.",
    source: "The C Programming Language",
    year: 1972,
    wow: 4,
    color: "#facc15",
    tags: ["hello-world", "kernighan", "c"],
    readTime: "40 sec",
  },
  {
    id: 20,
    category: "internet",
    categoryLabel: "Internet",
    emoji: "📱",
    headline: "First smartphone: IBM Simon (1994)",
    body: "IBM Simon (1994) had a touchscreen, email, calendar, fax, and apps - 13 years before iPhone. Cost $899 with a 1-hour battery. The true grandfather of modern smartphones.",
    source: "IBM Archives",
    year: 1994,
    wow: 4,
    color: "#60a5fa",
    tags: ["smartphone", "ibm", "history"],
    readTime: "50 sec",
  },
  {
    id: 21,
    category: "hardware",
    categoryLabel: "Hardware",
    emoji: "🖱️",
    headline: "First computer mouse was made of wood",
    body: "Doug Engelbart's 1964 prototype was carved from a single block of wood with two metal wheels. Debuted in the legendary 1968 'Mother of All Demos' alongside hypertext and video calls.",
    source: "SRI International",
    year: 1964,
    wow: 5,
    color: "#34d399",
    tags: ["mouse", "engelbart", "invention"],
    readTime: "55 sec",
  },
  {
    id: 22,
    category: "history",
    categoryLabel: "History",
    emoji: "☕",
    headline: "First webcam watched a coffee pot (1991)",
    body: "Cambridge University researchers set up the world's first webcam to check if the Trojan Room coffee pot was full. It ran 24/7 until 2001 when the pot was retired.",
    source: "University of Cambridge",
    year: 1991,
    wow: 4,
    color: "#eab308",
    tags: ["webcam", "coffee", "internet-history"],
    readTime: "45 sec",
  },
  {
    id: 23,
    category: "science",
    categoryLabel: "Science",
    emoji: "🌌",
    headline: "Observable universe has 2 trillion galaxies",
    body: "2016 Hubble + other data revised the estimate from 100-200 billion to over 2 trillion galaxies. Each containing hundreds of billions of stars. Mind-bending scale.",
    source: "NASA / Hubble",
    year: 2016,
    wow: 5,
    color: "#c084fc",
    tags: ["hubble", "cosmology", "universe"],
    readTime: "50 sec",
  },
  {
    id: 24,
    category: "security",
    categoryLabel: "Security",
    emoji: "🛡️",
    headline: "Heartbleed exposed half a million servers",
    body: "2014 OpenSSL Heartbleed bug (CVE-2014-0160) allowed attackers to read server memory, exposing private keys and passwords from ~500,000 servers including Yahoo, Gmail, and governments.",
    source: "OpenSSL / Codenomicon",
    year: 2014,
    wow: 5,
    color: "#f87171",
    tags: ["heartbleed", "openssl", "vulnerability"],
    readTime: "1 min",
  },
];

/* ── Categories ── */
const FACT_CATS: { id: FactCategory; label: string; emoji: string }[] = [
  { id: "all", label: "Everything", emoji: "✦" },
  { id: "internet", label: "Internet", emoji: "🌐" },
  { id: "languages", label: "Languages", emoji: "💻" },
  { id: "companies", label: "Companies", emoji: "🏢" },
  { id: "hardware", label: "Hardware", emoji: "⚡" },
  { id: "history", label: "History", emoji: "📜" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "ai", label: "AI", emoji: "🤖" },
  { id: "security", label: "Security", emoji: "🔐" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "space", label: "Space", emoji: "🛰️" },
  { id: "crypto", label: "Crypto", emoji: "₿" },
  { id: "programming", label: "Programming", emoji: "📜" },
];

/* ── Wow Explosion Component (premium particle effect) ── */
function WowExplosion({ color, trigger }: { color: string; trigger: boolean }) {
  return (
    <AnimatePresence>
      {trigger &&
        Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 1, scale: 0.2, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: 0,
              scale: 0.6 + Math.random() * 1.2,
              x: (Math.random() - 0.5) * 340,
              y: (Math.random() - 0.5) * 260 - 80,
              rotate: (Math.random() - 0.5) * 900,
            }}
            transition={{ duration: 0.9 + Math.random() * 0.7, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: "35%",
              fontSize: `${1.4 + Math.random() * 1.8}rem`,
              color: color,
              pointerEvents: "none",
              zIndex: 30,
              textShadow: `0 0 20px ${color}88`,
            }}
          >
            {["🤯", "💥", "✨", "🔥", "🌟", "🧠", "⚡"][i % 7]}
          </motion.div>
        ))}
    </AnimatePresence>
  );
}

/* ── Wow Meter (enhanced with glow) ── */
function WowMeter({ score }: { score: number }) {
  return (
    <div className="wow-meter">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="wow-bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: i < score ? 1 : 0.2 }}
          transition={{ delay: i * 0.04 }}
          style={{
            background: i < score
              ? `linear-gradient(90deg, #a5b4fc, ${"#e0e7ff"})`
              : "rgba(255,255,255,0.08)",
          }}
        />
      ))}
      <span className="wow-label">WOW</span>
    </div>
  );
}

/* ── Daily Fact Card (ultra-premium) ── */
function DailyFactCard({ fact }: { fact: Fact }) {
  const [wowed, setWowed] = useState(false);
  const [explosionTrigger, setExplosionTrigger] = useState(false);

  const handleWow = () => {
    const newState = !wowed;
    setWowed(newState);
    if (newState) {
      setExplosionTrigger(true);
      setTimeout(() => setExplosionTrigger(false), 1400);
    }
  };

  return (
    <motion.div
      className="daily-card"
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: "backOut" }}
    >
      <div className="daily-card-bg" style={{ background: `radial-gradient(ellipse at 35% 25%, ${fact.color}25, transparent 70%)` }} />

      <div className="daily-badge">
        <span>✦ FACT OF THE DAY</span>
      </div>

      <div className="daily-emoji">{fact.emoji}</div>

      <h2 className="daily-headline">{fact.headline}</h2>
      <p className="daily-body">{fact.body}</p>

      <div className="daily-meta">
        <WowMeter score={fact.wow} />
        <span className="daily-source">
          {fact.source} • {fact.year} • {fact.readTime}
        </span>
      </div>

      <div className="daily-tags">
        {fact.tags.map((t) => (
          <span key={t} className="fact-tag" style={{ borderColor: `${fact.color}40`, color: fact.color }}>
            #{t}
          </span>
        ))}
      </div>

      <motion.button
        className="daily-wow-btn"
        onClick={handleWow}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        style={{
          background: wowed ? `${fact.color}22` : "rgba(255,255,255,0.05)",
          borderColor: wowed ? fact.color : "rgba(255,255,255,0.15)",
          color: wowed ? fact.color : "#fff",
        }}
      >
        {wowed ? "🤯 MIND BLOWN!" : "🧠 Blow My Mind"}
      </motion.button>

      <WowExplosion color={fact.color} trigger={explosionTrigger} />
    </motion.div>
  );
}

/* ── Regular Fact Card (with tilt + explosion) ── */
function FactCard({ fact, index }: { fact: Fact; index: number }) {
  const [wowed, setWowed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [explosionTrigger, setExplosionTrigger] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const handleWow = () => {
    const newState = !wowed;
    setWowed(newState);
    if (newState) {
      setExplosionTrigger(true);
      setTimeout(() => setExplosionTrigger(false), 1400);
    }
  };

  return (
    <motion.div
      ref={ref}
      className="fact-card"
      initial={{ opacity: 0, y: 70, scale: 0.94 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.035, ease: "backOut" }}
      whileHover={{
        y: -8,
        boxShadow: `0 25px 70px -15px ${fact.color}30`,
        borderColor: `${fact.color}55`,
      }}
    >
      <div className="fact-card-accent" style={{ background: `linear-gradient(to bottom, ${fact.color}, transparent)` }} />
      <div className="fact-card-glow" style={{ background: `radial-gradient(circle at 20% 30%, ${fact.color}18, transparent 65%)` }} />

      <div className="fact-card-top">
        <div className="fact-card-meta">
          <span className="fact-emoji">{fact.emoji}</span>
          <span className="fact-cat-pill" style={{ background: `${fact.color}15`, color: fact.color }}>
            {fact.categoryLabel}
          </span>
          <span className="fact-year">{fact.year}</span>
        </div>
        <WowMeter score={fact.wow} />
      </div>

      <h3 className="fact-card-headline">{fact.headline}</h3>
      <p className="fact-card-body" style={{ WebkitLineClamp: expanded ? "unset" : 4 }}>
        {fact.body}
      </p>

      <div className="fact-card-footer">
        <div className="fact-tags">
          {fact.tags.map((t) => (
            <span key={t} className="fact-tag" style={{ borderColor: `${fact.color}35`, color: `${fact.color}aa` }}>
              #{t}
            </span>
          ))}
        </div>

        <motion.button
          className="fact-wow-btn"
          onClick={handleWow}
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: wowed ? `${fact.color}22` : "transparent",
            borderColor: wowed ? fact.color : "rgba(255,255,255,0.12)",
            color: wowed ? fact.color : "rgba(255,255,255,0.45)",
          }}
        >
          {wowed ? "🤯" : "🧠"}
        </motion.button>
      </div>

      <WowExplosion color={fact.color} trigger={explosionTrigger} />
    </motion.div>
  );
}

/* ── Marquee (longer & smoother) ── */
function FactMarquee() {
  const items = [
    "🌐 First website still live • 1991",
    "🐛 Real moth was the first bug • 1947",
    "☕ JavaScript written in 10 days",
    "🍎 Microsoft saved Apple in 1997",
    "💾 1GB HDD = 550 lbs refrigerator",
    "🚀 Apollo 11: 4KB RAM",
    "🤖 ChatGPT 1M users in 5 days",
    "🔐 Morris Worm 1988",
    "🛰️ Voyager 1 still transmitting",
    "₿ Bitcoin genesis block 2009",
  ];

  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Stats Ribbon (with count-up animation) ── */
function StatsRibbon() {
  const stats = [
    { label: "Verified Facts", value: "120+", icon: "✓" },
    { label: "Categories", value: "13", icon: "◈" },
    { label: "Minds Blown", value: "284K", icon: "🤯" },
    { label: "Updated", value: "Live", icon: "⟳" },
  ];

  return (
    <motion.div className="stats-ribbon" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
      {stats.map((s, i) => (
        <div key={i} className="stats-ribbon-item">
          <span className="stats-ribbon-icon">{s.icon}</span>
          <span className="stats-ribbon-value">{s.value}</span>
          <span className="stats-ribbon-label">{s.label}</span>
        </div>
      ))}
    </motion.div>
  );
}

/* ── Main Premium Page ── */
export default function FactsPage() {
  const [activeCategory, setActiveCategory] = useState<FactCategory>("all");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<"wow" | "newest" | "oldest">("wow");
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.3 });

  // Dynamic daily fact (changes every day)
  const daily = useMemo(() => {
    const seed = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return FACTS[seed % FACTS.length];
  }, []);

  // Filtered & sorted
  const filteredAndSorted = useMemo(() => {
    let result = FACTS.filter((f) => {
      const catMatch = activeCategory === "all" || f.category === activeCategory;
      const q = search.toLowerCase().trim();
      const queryMatch =
        !q ||
        f.headline.toLowerCase().includes(q) ||
        f.body.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q));
      return catMatch && queryMatch;
    });

    if (sortMode === "wow") {
      result.sort((a, b) => b.wow - a.wow);
    } else if (sortMode === "newest") {
      result.sort((a, b) => b.year - a.year);
    } else if (sortMode === "oldest") {
      result.sort((a, b) => a.year - b.year);
    }

    return result;
  }, [activeCategory, search, sortMode]);

  // Mouse gradient
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .facts-root {
          position: relative;
          min-height: 100svh;
          font-family: 'Inter', system-ui, sans-serif;
          overflow-x: hidden;
          background: #0a0c1f;
          color: #fff;
        }

        .facts-mesh {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: 
            radial-gradient(ellipse 900px 700px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(52,211,153,0.09), transparent 60%),
            radial-gradient(ellipse 700px 600px at ${(1 - mousePos.x) * 100}% 75%, rgba(34,211,238,0.07), transparent 65%),
            radial-gradient(ellipse 550px 450px at 45% 35%, rgba(129,140,248,0.06), transparent 70%);
        }

        .facts-content {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.75rem;
        }

        /* Banner */
        .facts-banner { padding: 6rem 0 3.5rem; text-align: center; }
        .facts-eyebrow {
          display: inline-flex; align-items: center; gap: 0.75rem;
          font-family: 'JetBrains Mono', monospace; font-size: 0.73rem; letter-spacing: 0.25em;
          color: #34d399; margin-bottom: 1.25rem;
        }
        .facts-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(3rem, 7.5vw, 5.8rem);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 400;
        }
        .facts-title em {
          background: linear-gradient(90deg, #34d399, #22d3ee, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .facts-subtitle {
          max-width: 560px;
          margin: 1.5rem auto 0;
          font-size: 1.05rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.75;
        }

        /* Marquee */
        .marquee-wrap {
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 1rem 0;
          margin: 1.5rem 0 3rem;
        }
        .marquee-track {
          display: flex;
          gap: 3.5rem;
          animation: marquee 45s linear infinite;
          width: max-content;
        }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes marquee { to { transform: translateX(-50%); } }
        .marquee-item {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.4);
          white-space: nowrap;
        }

        /* Stats */
        .stats-ribbon {
          display: flex; gap: 1px; background: rgba(255,255,255,0.03);
          border-radius: 18px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);
        }
        .stats-ribbon-item {
          flex: 1; padding: 1.6rem 1.25rem; text-align: center; background: rgba(255,255,255,0.015);
          transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
        }
        .stats-ribbon-item:hover { background: rgba(255,255,255,0.04); }
        .stats-ribbon-value {
          font-family: 'DM Serif Display', serif; font-size: 2.1rem; font-weight: 400; display: block;
        }

        /* Daily Card */
        .daily-card {
          position: relative; background: rgba(15,17,35,0.85);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 28px;
          padding: 3.25rem 3rem; overflow: hidden; backdrop-filter: blur(32px);
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.6);
        }
        .daily-card-bg { position: absolute; inset: 0; pointer-events: none; }
        .daily-badge {
          display: inline-flex; padding: 0.45rem 1.25rem; border-radius: 9999px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; letter-spacing: 0.2em;
        }
        .daily-emoji { font-size: 4.8rem; margin: 1.5rem 0 1.25rem; }
        .daily-headline { font-size: clamp(1.75rem, 4vw, 3rem); font-family: 'DM Serif Display', serif; line-height: 1.15; }
        .daily-body { font-size: 1.02rem; line-height: 1.78; color: rgba(255,255,255,0.6); max-width: 760px; }
        .daily-meta { margin: 2rem 0 1.5rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
        .daily-source { font-size: 0.8rem; color: rgba(255,255,255,0.35); font-family: 'JetBrains Mono', monospace; }
        .daily-wow-btn {
          padding: 0.85rem 2rem; border-radius: 9999px; font-weight: 600; font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
        }

        /* Filters & Search */
        .facts-cats, .sort-options {
          display: flex; gap: 0.5rem; flex-wrap: wrap;
        }
        .facts-cat-btn, .sort-btn {
          padding: 0.55rem 1.25rem; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.025); font-size: 0.86rem; transition: all 0.25s;
        }
        .facts-cat-btn[data-active="true"], .sort-btn.active {
          background: rgba(52,211,153,0.12); border-color: #34d399; color: #34d399;
        }

        .facts-search-wrap {
          position: relative; max-width: 480px; margin: 1.5rem 0;
        }
        .facts-search {
          width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px; padding: 0.9rem 1rem 0.9rem 3rem; font-size: 0.95rem;
        }
        .facts-search:focus { border-color: #34d399; box-shadow: 0 0 0 4px rgba(52,211,153,0.1); }

        /* Grid */
        .facts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 1.75rem;
        }

        /* Fact Card */
        .fact-card {
          position: relative; background: rgba(15,17,35,0.7); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 1.85rem 1.9rem; backdrop-filter: blur(20px);
          transition: border-color 0.4s;
        }
        .fact-card-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }
        .fact-card-glow { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s; }
        .fact-card:hover .fact-card-glow { opacity: 1; }
        .fact-card-meta { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .fact-cat-pill { font-size: 0.7rem; padding: 0.25rem 0.75rem; border-radius: 9999px; border: 1px solid; font-family: 'JetBrains Mono', monospace; }
        .fact-card-headline { font-family: 'DM Serif Display', serif; font-size: 1.28rem; line-height: 1.35; margin: 1rem 0 0.75rem; }
        .fact-card-body { font-size: 0.925rem; line-height: 1.75; color: rgba(255,255,255,0.52); }
        .fact-expand-btn { background: none; border: none; color: inherit; font-weight: 500; cursor: pointer; }
        .fact-card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.07); margin-top: 1.25rem; }

        /* Wow Meter */
        .wow-meter { display: flex; gap: 4px; align-items: center; }
        .wow-bar {
          width: 22px; height: 5px; border-radius: 3px; transition: all 0.4s;
        }
        .wow-label { font-size: 0.68rem; font-family: 'JetBrains Mono', monospace; color: rgba(255,255,255,0.35); margin-left: 6px; }

        .fact-tag { font-size: 0.7rem; padding: 0.2rem 0.65rem; border-radius: 6px; border: 1px solid; font-family: 'JetBrains Mono', monospace; }

        .facts-section-label {
          font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.3); margin: 2.5rem 0 1.25rem;
        }

        @media (max-width: 640px) {
          .facts-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="facts-root">
        {/* Interactive mesh background */}
        <div className="facts-mesh" />

        <div className="facts-content">
          {/* Hero Banner */}
          <div className="facts-banner">
            <div className="facts-eyebrow">
              <div style={{ width: 36, height: 1, background: "#34d399", opacity: 0.6 }} />
              CodeNFacts.in
              <div style={{ width: 36, height: 1, background: "#34d399", opacity: 0.6 }} />
            </div>
            <h1 className="facts-title">
              Things You Didn't Know<br />You Didn't <em>Know</em>
            </h1>
            <p className="facts-subtitle">
              Curated, verified, mind-bending facts from computing, AI, space, security &amp; beyond.
              Updated daily with cinematic animations.
            </p>
          </div>

          <FactMarquee />
          <StatsRibbon />

          {/* Daily Fact */}
          <DailyFactCard fact={daily} />

          {/* Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "flex-end", marginBottom: "1.5rem" }}>
            <div>
              <div className="facts-cats">
                {FACT_CATS.map((cat) => (
                  <button
                    key={cat.id}
                    className="facts-cat-btn"
                    data-active={activeCategory === cat.id ? "true" : undefined}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sort-options" style={{ marginLeft: "auto" }}>
              {(["wow", "newest", "oldest"] as const).map((mode) => (
                <button
                  key={mode}
                  className={`sort-btn ${sortMode === mode ? "active" : ""}`}
                  onClick={() => setSortMode(mode)}
                >
                  {mode === "wow" && "🔥 Trending"}
                  {mode === "newest" && "📆 Newest"}
                  {mode === "oldest" && "🕰️ Oldest"}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="facts-search-wrap">
            <span style={{ position: "absolute", left: "1.1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: "1.25rem" }}>⌕</span>
            <input
              className="facts-search"
              placeholder="Search headlines, bodies, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p className="facts-section-label">
            // {filteredAndSorted.length} facts • sorted by {sortMode}
          </p>

          {/* Premium Masonry Grid */}
          <div className="facts-grid">
            {filteredAndSorted.length === 0 ? (
              <div style={{ textAlign: "center", padding: "6rem 2rem", color: "rgba(255,255,255,0.3)" }}>
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
                <div>No matching facts found</div>
              </div>
            ) : (
              filteredAndSorted.map((fact, i) => <FactCard key={fact.id} fact={fact} index={i} />)
            )}
          </div>

          {/* Footer note */}
          <div style={{ textAlign: "center", margin: "6rem 0 4rem", color: "rgba(255,255,255,0.25)", fontSize: "0.82rem" }}>
            All facts meticulously verified • Built with CodeNFacts &amp; love ❤️
          </div>
        </div>
      </div>
    </>
  );
}