"use client";

/**
 * LinkedIn Mastery — category page
 * ---------------------------------------------------------------
 * Assumptions about the host project (adjust if yours differs):
 * 1. Tailwind CSS is configured with `darkMode: "class"`.
 * 2. Your header already toggles the `dark` class on <html> or <body> —
 *    this page has no toggle of its own and simply reads that class
 *    via Tailwind's `dark:` variants.
 * 3. `lucide-react` is installed (npm i lucide-react). Swap the icon
 *    imports for your own set if you'd rather not add the dependency.
 * 4. Fonts: this file pulls Fraunces (display serif), Inter (body),
 *    IBM Plex Mono (cheat sheets / code), and Caveat (hand-drawn
 *    annotations) from Google Fonts via a <style> tag so the page
 *    works standalone. If your project already loads fonts through
 *    next/font, delete the <style jsx global> block below and map
 *    the same four role-names in your tailwind.config instead.
 */

import { useState } from "react";
import {
  Linkedin,
  Camera,
  Image as ImageIcon,
  UserCircle2,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Star,
  Users,
  Search,
  MessageSquare,
  ChevronDown,
  Bot,
  Rocket,
  Target,
  Zap,
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Small reusable bits                                                */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-teal-700 dark:text-teal-300 mb-2.5 sm:mb-3">
      {children}
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="max-w-2xl mb-8 sm:mb-10">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-navy-900 dark:text-paper-50 leading-tight">
        {title}
      </h2>
      {lede && (
        <p className="mt-3 sm:mt-4 text-[14px] sm:text-[15px] leading-relaxed text-navy-700/80 dark:text-paper-200/70">
          {lede}
        </p>
      )}
    </div>
  );
}

/** Index-card style container used throughout for cheat sheets & tips */
function IndexCard({
  title,
  tilt = "0deg",
  children,
}: {
  title: string;
  tilt?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ transform: `rotate(${tilt})` }}
      className="relative bg-[#FFFDF6] dark:bg-[#1C2030] border border-navy-900/10 dark:border-paper-50/10
                 shadow-[0_6px_18px_-6px_rgba(20,25,40,0.25)] rounded-sm p-4 sm:p-5 md:p-6
                 max-sm:[transform:none!important]"
    >
      <span
        className="absolute -top-2.5 left-5 sm:left-6 h-4 w-8 sm:h-5 sm:w-10 bg-amber-300/70 dark:bg-amber-400/30
                   rotate-[-3deg] shadow-sm"
        aria-hidden
      />
      <h3 className="font-display text-base sm:text-lg text-navy-900 dark:text-paper-50 mb-2.5 sm:mb-3">
        {title}
      </h3>
      <div className="font-mono text-[12px] sm:text-[12.5px] leading-relaxed text-navy-800/90 dark:text-paper-100/80 space-y-2">
        {children}
      </div>
    </div>
  );
}

function Accordion({
  items,
}: {
  items: { icon: React.ReactNode; title: string; body: React.ReactNode }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-navy-900/10 dark:divide-paper-50/10 border-y border-navy-900/10 dark:border-paper-50/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center gap-3 sm:gap-4 py-4 sm:py-5 text-left group min-h-[48px]"
              aria-expanded={isOpen}
            >
              <span className="shrink-0 text-teal-700 dark:text-teal-300">{item.icon}</span>
              <span className="flex-1 font-display text-[15px] sm:text-[17px] text-navy-900 dark:text-paper-50 pr-2">
                {item.title}
              </span>
              <ChevronDown
                className={`shrink-0 h-4 w-4 text-navy-700/60 dark:text-paper-200/60 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-5 sm:pb-6 pl-8 sm:pl-9 pr-1 sm:pr-2 text-[14px] sm:text-[14.5px] leading-relaxed text-navy-700/85 dark:text-paper-200/75">
                  {item.body}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Signature element: annotated "anatomy of a profile" sketch         */
/* ------------------------------------------------------------------ */

function ProfileAnatomySketch() {
  const notes = [
    { x: 40, y: 46, label: "Banner — your headline, visually", dash: "M120,55 L200,110" },
    { x: 40, y: 190, label: "Photo — face visible, good light", dash: "M120,205 L195,205" },
    { x: 430, y: 60, label: "Headline ≠ job title. Say who you help.", dash: "M420,80 L340,120" },
    { x: 430, y: 260, label: "About — written like a person, not a résumé", dash: "M420,270 L330,290" },
    { x: 40, y: 400, label: "Experience — outcomes, not duties", dash: "M120,410 L210,400" },
    { x: 430, y: 400, label: "Skills — top 3 pinned, endorsed by real work", dash: "M420,410 L340,400" },
  ];

  // Mobile-friendly label list (shown below sketch on small screens)
  const mobileNotes = [
    "Banner — your headline, visually",
    "Photo — face visible, good light",
    "Headline ≠ job title. Say who you help.",
    "About — written like a person, not a résumé",
    "Experience — outcomes, not duties",
    "Skills — top 3 pinned, endorsed by real work",
  ];

  return (
    <div className="relative w-full">
      {/* Desktop / tablet: full annotated SVG */}
      <div className="hidden sm:block relative w-full overflow-x-auto -mx-1 px-1">
        <svg
          viewBox="0 0 600 470"
          className="w-full min-w-[480px] max-w-full h-auto"
          role="img"
          aria-label="Annotated diagram of a LinkedIn profile's key sections"
        >
          {/* card frame */}
          <rect
            x="190"
            y="20"
            width="220"
            height="430"
            rx="6"
            className="fill-[#FFFDF6] dark:fill-[#1C2030] stroke-navy-900/25 dark:stroke-paper-50/20"
            strokeWidth="1.5"
          />
          {/* banner */}
          <rect x="190" y="20" width="220" height="60" rx="0" className="fill-teal-600/25 dark:fill-teal-400/20" />
          {/* photo */}
          <circle
            cx="235"
            cy="100"
            r="30"
            className="fill-amber-400/50 dark:fill-amber-300/40 stroke-navy-900/30 dark:stroke-paper-50/30"
            strokeWidth="1.5"
          />
          {/* name / headline lines */}
          <rect x="275" y="88" width="100" height="8" rx="2" className="fill-navy-900/70 dark:fill-paper-50/70" />
          <rect x="275" y="102" width="120" height="6" rx="2" className="fill-navy-900/30 dark:fill-paper-50/30" />
          {/* about block */}
          <rect x="205" y="150" width="190" height="8" rx="2" className="fill-navy-900/20 dark:fill-paper-50/20" />
          <rect x="205" y="164" width="190" height="8" rx="2" className="fill-navy-900/20 dark:fill-paper-50/20" />
          <rect x="205" y="178" width="130" height="8" rx="2" className="fill-navy-900/20 dark:fill-paper-50/20" />
          {/* experience block */}
          <rect x="205" y="220" width="14" height="14" rx="3" className="fill-teal-600/40 dark:fill-teal-400/30" />
          <rect x="228" y="222" width="167" height="7" rx="2" className="fill-navy-900/25 dark:fill-paper-50/25" />
          <rect x="228" y="234" width="140" height="6" rx="2" className="fill-navy-900/15 dark:fill-paper-50/15" />
          <rect x="205" y="255" width="14" height="14" rx="3" className="fill-teal-600/40 dark:fill-teal-400/30" />
          <rect x="228" y="257" width="167" height="7" rx="2" className="fill-navy-900/25 dark:fill-paper-50/25" />
          <rect x="228" y="269" width="120" height="6" rx="2" className="fill-navy-900/15 dark:fill-paper-50/15" />
          {/* skills pills */}
          <rect x="205" y="300" width="60" height="16" rx="8" className="fill-amber-400/40 dark:fill-amber-300/30" />
          <rect x="270" y="300" width="60" height="16" rx="8" className="fill-amber-400/40 dark:fill-amber-300/30" />
          <rect x="335" y="300" width="60" height="16" rx="8" className="fill-amber-400/40 dark:fill-amber-300/30" />

          {/* hand-drawn callout lines + labels */}
          {notes.map((n, i) => (
            <g key={i}>
              <path
                d={n.dash}
                className="stroke-rose-500/70 dark:stroke-rose-300/70"
                strokeWidth="1.3"
                fill="none"
                strokeDasharray="4 3"
              />
              <text
                x={n.x}
                y={n.y}
                className="fill-navy-900 dark:fill-paper-50 font-hand"
                fontSize="17"
                textAnchor={n.x < 200 ? "start" : "end"}
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Mobile: simplified profile card + notes list (no forced horizontal scroll) */}
      <div className="sm:hidden">
        <div className="flex justify-center">
          <svg
            viewBox="190 20 220 430"
            className="w-[min(100%,220px)] h-auto"
            role="img"
            aria-label="Simplified LinkedIn profile layout"
          >
            <rect
              x="190"
              y="20"
              width="220"
              height="430"
              rx="6"
              className="fill-[#FFFDF6] dark:fill-[#1C2030] stroke-navy-900/25 dark:stroke-paper-50/20"
              strokeWidth="1.5"
            />
            <rect x="190" y="20" width="220" height="60" className="fill-teal-600/25 dark:fill-teal-400/20" />
            <circle
              cx="235"
              cy="100"
              r="30"
              className="fill-amber-400/50 dark:fill-amber-300/40 stroke-navy-900/30 dark:stroke-paper-50/30"
              strokeWidth="1.5"
            />
            <rect x="275" y="88" width="100" height="8" rx="2" className="fill-navy-900/70 dark:fill-paper-50/70" />
            <rect x="275" y="102" width="120" height="6" rx="2" className="fill-navy-900/30 dark:fill-paper-50/30" />
            <rect x="205" y="150" width="190" height="8" rx="2" className="fill-navy-900/20 dark:fill-paper-50/20" />
            <rect x="205" y="164" width="190" height="8" rx="2" className="fill-navy-900/20 dark:fill-paper-50/20" />
            <rect x="205" y="178" width="130" height="8" rx="2" className="fill-navy-900/20 dark:fill-paper-50/20" />
            <rect x="205" y="220" width="14" height="14" rx="3" className="fill-teal-600/40 dark:fill-teal-400/30" />
            <rect x="228" y="222" width="167" height="7" rx="2" className="fill-navy-900/25 dark:fill-paper-50/25" />
            <rect x="228" y="234" width="140" height="6" rx="2" className="fill-navy-900/15 dark:fill-paper-50/15" />
            <rect x="205" y="255" width="14" height="14" rx="3" className="fill-teal-600/40 dark:fill-teal-400/30" />
            <rect x="228" y="257" width="167" height="7" rx="2" className="fill-navy-900/25 dark:fill-paper-50/25" />
            <rect x="228" y="269" width="120" height="6" rx="2" className="fill-navy-900/15 dark:fill-paper-50/15" />
            <rect x="205" y="300" width="60" height="16" rx="8" className="fill-amber-400/40 dark:fill-amber-300/30" />
            <rect x="270" y="300" width="60" height="16" rx="8" className="fill-amber-400/40 dark:fill-amber-300/30" />
            <rect x="335" y="300" width="60" height="16" rx="8" className="fill-amber-400/40 dark:fill-amber-300/30" />
          </svg>
        </div>
        <ul className="mt-4 space-y-2 text-[12.5px] leading-snug text-navy-800/90 dark:text-paper-100/80 font-hand">
          {mobileNotes.map((label) => (
            <li key={label} className="flex gap-2">
              <span className="text-rose-500/80 dark:text-rose-300/80 shrink-0">→</span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AI job-search tabs                                                  */
/* ------------------------------------------------------------------ */

function AIUseCases() {
  const tabs = [
    {
      key: "find",
      label: "Finding roles",
      icon: <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      body: [
        "Feed a job posting and your profile to an AI tool and ask it to score the match, then tell you the two or three gaps worth closing before you apply.",
        "Use LinkedIn's own AI-assisted search phrasing (\"find remote product manager roles at seed-stage startups\") instead of rigid keyword + filter combinations.",
        "Ask an AI assistant to scan a saved list of companies' careers pages and LinkedIn job posts weekly and summarize only the new, relevant openings.",
      ],
    },
    {
      key: "tailor",
      label: "Tailoring materials",
      icon: <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      body: [
        "Paste a job description and your existing About section, then ask for three rewritten versions that mirror the language recruiters and their search filters use.",
        "Generate a first-draft cover letter grounded only in your real projects — then edit it yourself so it still sounds like you, not the model.",
        "Ask AI to rewrite a bullet point from 'responsible for X' into a specific, measurable outcome, using only details you supply.",
      ],
    },
    {
      key: "practice",
      label: "Interview practice",
      icon: <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      body: [
        "Role-play a behavioral interview with an AI acting as the hiring manager for a specific posting, then ask it to critique your answers against the STAR structure.",
        "Generate likely technical or case questions for a specific role and company type, then rehearse out loud, not just in text.",
        "Ask for a plain-language explanation of an unfamiliar term in a job posting so you're not walking in guessing.",
      ],
    },
    {
      key: "network",
      label: "Networking",
      icon: <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      body: [
        "Draft a personalized connection note referencing a specific post or shared background, then trim it yourself — generic AI phrasing is easy to spot.",
        "Summarize a target contact's recent posts so you have something genuine to open a conversation with.",
        "Ask AI to help structure a short weekly outreach plan (how many people, what mix of warm vs. cold) rather than writing every message for you.",
      ],
    },
  ];
  const [active, setActive] = useState(tabs[0].key);
  const activeTab = tabs.find((t) => t.key === active)!;

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[13px] sm:text-sm font-medium border transition-colors min-h-[36px]
              ${
                active === t.key
                  ? "bg-navy-900 text-paper-50 border-navy-900 dark:bg-teal-400 dark:text-navy-950 dark:border-teal-400"
                  : "border-navy-900/20 text-navy-800 hover:bg-navy-900/5 dark:border-paper-50/20 dark:text-paper-100 dark:hover:bg-paper-50/10"
              }`}
          >
            {t.icon}
            <span className="whitespace-nowrap">{t.label}</span>
          </button>
        ))}
      </div>
      <ul className="space-y-3">
        {activeTab.body.map((line, i) => (
          <li
            key={i}
            className="flex gap-2.5 sm:gap-3 text-[14px] sm:text-[14.5px] leading-relaxed text-navy-800/90 dark:text-paper-100/85"
          >
            <CheckCircle2 className="h-4 w-4 mt-0.5 sm:mt-1 shrink-0 text-teal-700 dark:text-teal-300" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

const toc = [
  { id: "what-is", label: "What LinkedIn is" },
  { id: "why", label: "Why use it" },
  { id: "profile", label: "Building your profile" },
  { id: "sections", label: "Every section, explained" },
  { id: "cheatsheets", label: "Cheat sheets" },
  { id: "diagrams", label: "Diagrams & sketches" },
  { id: "ai", label: "Job-hunting with AI" },
  { id: "mistakes", label: "Common mistakes" },
];

export default function Page() {
  return (
    <main className="bg-paper-50 dark:bg-navy-950 text-navy-900 dark:text-paper-50 transition-colors duration-300 overflow-x-hidden">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Caveat:wght@600&display=swap");
        html {
          scroll-behavior: smooth;
        }
        .font-display {
          font-family: "Fraunces", Georgia, serif;
        }
        .font-hand {
          font-family: "Caveat", cursive;
        }
        body {
          font-family: "Inter", system-ui, sans-serif;
        }
        .font-mono {
          font-family: "IBM Plex Mono", ui-monospace, monospace;
        }
      `}</style>

      {/* ---------------------------------------------------------- */}
      {/* Hero                                                         */}
      {/* ---------------------------------------------------------- */}
      <section className="relative border-b border-navy-900/10 dark:border-paper-50/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 md:pt-16 pb-10 sm:pb-12 md:pb-14 grid lg:grid-cols-[1.1fr_1fr] gap-8 sm:gap-10 lg:gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Linkedin className="h-5 w-5 text-teal-700 dark:text-teal-300 shrink-0" />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-teal-700 dark:text-teal-300">
                CodeNFacts · LinkedIn Mastery
              </span>
            </div>
            <h1 className="font-display text-[1.75rem] sm:text-4xl md:text-5xl leading-[1.12] sm:leading-[1.08] mb-4 sm:mb-6">
              Your profile is a search result before it&apos;s a person.
            </h1>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-navy-700/85 dark:text-paper-200/75 max-w-xl">
              This page walks through what LinkedIn actually is, why it&apos;s worth your time, how to
              build every section of a profile properly, quick-reference cheat sheets you can copy,
              and how to use AI as a genuine advantage in your job search - not a shortcut that
              backfires.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
              {["950M+ members", "Recruiters search it daily", "Free to do well"].map((t) => (
                <span
                  key={t}
                  className="text-[11.5px] sm:text-[12.5px] font-mono px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-navy-900/15 dark:border-paper-50/15 text-navy-700 dark:text-paper-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-navy-900/10 dark:border-paper-50/10 bg-navy-900/[0.02] dark:bg-paper-50/[0.03] p-3 sm:p-4">
            <ProfileAnatomySketch />
            <p className="mt-3 text-[11px] sm:text-[12px] font-mono text-navy-700/60 dark:text-paper-200/55">
              Fig. 1 — where attention actually goes on a profile, and what belongs there.
            </p>
          </div>
        </div>

        {/* table of contents */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-5 sm:pb-6">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 sm:gap-x-6 sm:gap-y-2">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-[12.5px] sm:text-[13px] font-medium text-navy-700/70 hover:text-teal-700 dark:text-paper-200/60 dark:hover:text-teal-300 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* What is LinkedIn                                             */}
      {/* ---------------------------------------------------------- */}
      <section id="what-is" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 scroll-mt-20 sm:scroll-mt-24">
        <SectionHeading
          eyebrow="01 · Orientation"
          title="What LinkedIn actually is"
          lede="Not a resume host. Not a social feed for its own sake. LinkedIn is a searchable professional
          record, cross-referenced against everyone who might want to hire, fund, partner with,
          or learn from you."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: <Search className="h-5 w-5" />,
              title: "A search engine, for people",
              body: "Recruiters and hiring managers search LinkedIn the way you'd search Google — by role, skill, company, and location. Your profile either surfaces or doesn't.",
            },
            {
              icon: <FileText className="h-5 w-5" />,
              title: "A living record",
              body: "Unlike a résumé you send once, your profile is continuously visible. It should reflect where you are now, not where you were two jobs ago.",
            },
            {
              icon: <Users className="h-5 w-5" />,
              title: "A network graph",
              body: "Every connection, comment, and shared post feeds an algorithm that decides who sees you next — which is why activity, not just the static profile, matters.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="p-4 sm:p-5 md:p-6 rounded-md border border-navy-900/10 dark:border-paper-50/10"
            >
              <div className="text-teal-700 dark:text-teal-300 mb-3 sm:mb-4">{c.icon}</div>
              <h3 className="font-display text-base sm:text-lg mb-1.5 sm:mb-2">{c.title}</h3>
              <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-navy-700/80 dark:text-paper-200/70">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Why use / why need it                                       */}
      {/* ---------------------------------------------------------- */}
      <section
        id="why"
        className="border-y border-navy-900/10 dark:border-paper-50/10 bg-navy-900/[0.02] dark:bg-paper-50/[0.02]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <SectionHeading
            eyebrow="02 · Motivation"
            title="Why it's worth using — and why it's become necessary"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-12 gap-y-8">
            <div>
              <h3 className="font-display text-lg sm:text-xl mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-700 dark:text-teal-300 shrink-0" /> Why use
                it
              </h3>
              <ul className="space-y-2.5 sm:space-y-3 text-[14px] sm:text-[14.5px] leading-relaxed text-navy-700/85 dark:text-paper-200/75">
                <li>
                  · It&apos;s where opportunity finds you, not just where you chase it — recruiters
                  message active, well-built profiles unprompted.
                </li>
                <li>
                  · Public proof of work compounds: recommendations, endorsed skills, and posts
                  build credibility a résumé alone can&apos;t.
                </li>
                <li>
                  · Warm introductions convert far better than cold applications, and LinkedIn is
                  the fastest way to find who already knows whom.
                </li>
                <li>
                  · It&apos;s a free, permanent portfolio that also functions as an alumni and
                  colleague directory.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-300 shrink-0" /> Why
                it&apos;s necessary now
              </h3>
              <ul className="space-y-2.5 sm:space-y-3 text-[14px] sm:text-[14.5px] leading-relaxed text-navy-700/85 dark:text-paper-200/75">
                <li>
                  · Most mid-to-senior roles are sourced, not applied to — an incomplete profile
                  removes you from that pool entirely.
                </li>
                <li>
                  · Background and reference checks routinely start with a LinkedIn look-up before
                  a call is even booked.
                </li>
                <li>
                  · Industry shifts (layoffs, pivots, AI-driven role changes) move fast; your
                  network is your early-warning system and your safety net.
                </li>
                <li>
                  · Absence reads as inactivity. A thin or stale profile can quietly cost you
                  consideration you never find out about.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Building your profile — accordion                            */}
      {/* ---------------------------------------------------------- */}
      <section
        id="profile"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 scroll-mt-20 sm:scroll-mt-24"
      >
        <SectionHeading
          eyebrow="03 · Setup"
          title="Updating your profile, section by section"
          lede="Work top to bottom. Each section either earns a click into the next one, or loses the reader."
        />
        <Accordion
          items={[
            {
              icon: <Camera className="h-5 w-5" />,
              title: "Photo",
              body: "Face clearly visible, good lighting, plain or softly blurred background, shoulders up. Profiles with a photo get dramatically more views and connection requests than those without one — it's the single easiest fix on this list.",
            },
            {
              icon: <ImageIcon className="h-5 w-5" />,
              title: "Banner",
              body: "Free real estate most people leave blank. Use it to reinforce your headline visually — your field, your company, or a one-line value statement. Recommended size: 1584×396px.",
            },
            {
              icon: <UserCircle2 className="h-5 w-5" />,
              title: "Headline",
              body: "Defaults to your current job title — replace it. A strong headline names who you help and how, e.g. 'Backend engineer helping fintech teams ship reliable payment systems' instead of just 'Software Engineer at X'.",
            },
            {
              icon: <FileText className="h-5 w-5" />,
              title: "About",
              body: "Write in first person. Open with the problem you solve or the path that led you here, then 2–3 concrete achievements with numbers where possible, and close with what you're looking for or open to. Three short paragraphs beats one dense block.",
            },
            {
              icon: <Briefcase className="h-5 w-5" />,
              title: "Experience",
              body: "Each role: 2–4 bullets, each describing an outcome, not a duty. 'Reduced checkout latency 40% by rearchitecting the payments queue' beats 'Responsible for backend systems'. Add media (decks, links, launches) where you can.",
            },
            {
              icon: <GraduationCap className="h-5 w-5" />,
              title: "Education",
              body: "Institution, degree, field, and years. Add relevant coursework, thesis topics, or activities only if they support the direction you're going now — cut anything that no longer serves the story.",
            },
            {
              icon: <Award className="h-5 w-5" />,
              title: "Licenses & certificates",
              body: "Add the issuing body, an issue date, and — critically — the credential ID or verification link if one exists. Recent, relevant certificates (cloud platforms, PM credentials, language tests) signal current effort, not just past study.",
            },
            {
              icon: <Star className="h-5 w-5" />,
              title: "Skills",
              body: "Pin your top 3 to the very top — these are what show in search and what people see first. Keep the list focused on what you'd actually want to be found for; a 40-skill list dilutes all of them.",
            },
            {
              icon: <Sparkles className="h-5 w-5" />,
              title: "Featured & Recommendations",
              body: "Featured: pin your best public work — an article, a launch post, a case study link. Recommendations: request them from people who can speak to specific outcomes, and offer to write theirs first.",
            },
          ]}
        />
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Every section explained — quick grid recap                  */}
      {/* ---------------------------------------------------------- */}
      <section
        id="sections"
        className="border-y border-navy-900/10 dark:border-paper-50/10 bg-navy-900/[0.02] dark:bg-paper-50/[0.02]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <SectionHeading eyebrow="04 · Reference" title="What each section is actually judged on" />

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto -mx-1 px-1">
            <table className="w-full text-left border-collapse text-[13px] sm:text-[13.5px] min-w-[520px]">
              <thead>
                <tr className="border-b-2 border-navy-900/20 dark:border-paper-50/20">
                  {["Section", "What it signals", "Fastest improvement"].map((h) => (
                    <th
                      key={h}
                      className="py-3 pr-4 sm:pr-6 font-display text-sm sm:text-base font-normal text-navy-900 dark:text-paper-50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/10 dark:divide-paper-50/10">
                {[
                  ["Headline", "Relevance to search terms recruiters use", "Add role + specialty + outcome, not just title"],
                  ["About", "Communication ability, motivation, fit", "Write like you talk; cut jargon"],
                  ["Experience", "Actual capability and scope", "Numbers: %, $, time saved, users reached"],
                  ["Education", "Baseline qualification, trajectory", "List only what's still relevant"],
                  ["Certificates", "Current, active effort to grow", "Add verification links, keep them recent"],
                  ["Skills", "Searchability, keyword match", "Reorder — top 3 are what's seen first"],
                  ["Recommendations", "Third-party trust", "Ask for one right after a good project ships"],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        className={`py-3 pr-4 sm:pr-6 align-top ${
                          i === 0
                            ? "font-medium text-navy-900 dark:text-paper-50 whitespace-nowrap"
                            : "text-navy-700/80 dark:text-paper-200/70"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards for the reference table */}
          <div className="sm:hidden space-y-3">
            {[
              {
                section: "Headline",
                signals: "Relevance to search terms recruiters use",
                improve: "Add role + specialty + outcome, not just title",
              },
              {
                section: "About",
                signals: "Communication ability, motivation, fit",
                improve: "Write like you talk; cut jargon",
              },
              {
                section: "Experience",
                signals: "Actual capability and scope",
                improve: "Numbers: %, $, time saved, users reached",
              },
              {
                section: "Education",
                signals: "Baseline qualification, trajectory",
                improve: "List only what's still relevant",
              },
              {
                section: "Certificates",
                signals: "Current, active effort to grow",
                improve: "Add verification links, keep them recent",
              },
              {
                section: "Skills",
                signals: "Searchability, keyword match",
                improve: "Reorder — top 3 are what's seen first",
              },
              {
                section: "Recommendations",
                signals: "Third-party trust",
                improve: "Ask for one right after a good project ships",
              },
            ].map((row) => (
              <div
                key={row.section}
                className="rounded-md border border-navy-900/10 dark:border-paper-50/10 p-4"
              >
                <p className="font-display text-[15px] text-navy-900 dark:text-paper-50 mb-2">
                  {row.section}
                </p>
                <p className="text-[13px] text-navy-700/80 dark:text-paper-200/70 mb-1.5">
                  <span className="font-medium text-navy-800 dark:text-paper-100">Signals:</span>{" "}
                  {row.signals}
                </p>
                <p className="text-[13px] text-navy-700/80 dark:text-paper-200/70">
                  <span className="font-medium text-navy-800 dark:text-paper-100">Improve:</span>{" "}
                  {row.improve}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Cheat sheets                                                 */}
      {/* ---------------------------------------------------------- */}
      <section
        id="cheatsheets"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 scroll-mt-20 sm:scroll-mt-24"
      >
        <SectionHeading
          eyebrow="05 · Cheat sheets"
          title="Copy, adapt, ship"
          lede="Templates worth keeping open in another tab while you edit your own profile."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          <IndexCard title="Headline formula" tilt="-1.2deg">
            <p>[Role] helping [audience] [do outcome] via [method/skill].</p>
            <p className="text-navy-700/70 dark:text-paper-300/60">
              &quot;Data analyst helping D2C brands cut ad waste through cohort modeling.&quot;
            </p>
          </IndexCard>
          <IndexCard title="About — 3-paragraph shape" tilt="0.8deg">
            <p>1. The problem you&apos;re drawn to solving.</p>
            <p>2. 2–3 proof points with numbers.</p>
            <p>3. What you&apos;re building toward / open to next.</p>
          </IndexCard>
          <IndexCard title="Connection request" tilt="-0.6deg">
            <p>
              Hi [Name] — saw your post on [specific thing]. I&apos;m working on [related thing] and
              would value connecting.
            </p>
            <p className="text-navy-700/70 dark:text-paper-300/60">
              Keep it under 300 characters. Specific beats polite.
            </p>
          </IndexCard>
          <IndexCard title="Recommendation ask" tilt="1.1deg">
            <p>
              Would you be open to a short recommendation about [specific project]? Happy to write
              yours first, or send a few bullet points to make it quick.
            </p>
          </IndexCard>
          <IndexCard title="Keyword pass, before you publish" tilt="-1deg">
            <p>□ Job titles you want appear verbatim somewhere</p>
            <p>□ Tools/skills match postings you admire</p>
            <p>□ Location + remote/hybrid preference stated</p>
            <p>□ Industry terms, not just internal jargon</p>
          </IndexCard>
          <IndexCard title="Weekly 15-minute maintenance" tilt="0.4deg">
            <p>□ One comment on a relevant post</p>
            <p>□ One new connection with a personal note</p>
            <p>□ Skills reordered if priorities shifted</p>
            <p>□ Any new certificate or launch added</p>
          </IndexCard>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Diagrams / funnel                                            */}
      {/* ---------------------------------------------------------- */}
      <section
        id="diagrams"
        className="border-y border-navy-900/10 dark:border-paper-50/10 bg-navy-900/[0.02] dark:bg-paper-50/[0.02]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <SectionHeading eyebrow="06 · Diagrams & sketches" title="How visibility actually flows" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-start">
            <div className="rounded-md border border-navy-900/10 dark:border-paper-50/10 bg-[#FFFDF6] dark:bg-[#1C2030] p-4 sm:p-5 md:p-6">
              <svg
                viewBox="0 0 480 320"
                className="w-full h-auto"
                role="img"
                aria-label="Funnel diagram from profile view to hired"
              >
                {[
                  { y: 20, w: 440, label: "Profile appears in search / feed" },
                  { y: 100, w: 340, label: "Someone opens your profile" },
                  { y: 180, w: 240, label: "They message or you apply" },
                  { y: 260, w: 140, label: "Interview → hired" },
                ].map((s, i) => (
                  <g key={i}>
                    <rect
                      x={(480 - s.w) / 2}
                      y={s.y}
                      width={s.w}
                      height="52"
                      rx="6"
                      className={
                        i % 2 === 0
                          ? "fill-teal-600/25 dark:fill-teal-400/20"
                          : "fill-amber-400/30 dark:fill-amber-300/25"
                      }
                    />
                    <text
                      x="240"
                      y={s.y + 32}
                      textAnchor="middle"
                      className="fill-navy-900 dark:fill-paper-50 font-mono"
                      fontSize="12.5"
                    >
                      {s.label}
                    </text>
                  </g>
                ))}
              </svg>
              <p className="mt-3 text-[11px] sm:text-[12px] font-mono text-navy-700/60 dark:text-paper-200/55">
                Fig. 2 — each stage narrows. A weak headline or photo loses people before they ever
                read your About.
              </p>
            </div>

            <div className="rounded-md border border-navy-900/10 dark:border-paper-50/10 bg-[#FFFDF6] dark:bg-[#1C2030] p-4 sm:p-5 md:p-6">
              <svg
                viewBox="0 0 480 320"
                className="w-full h-auto"
                role="img"
                aria-label="Pyramid diagram of networking effort"
              >
                <polygon
                  points="240,20 440,300 40,300"
                  className="fill-none stroke-navy-900/30 dark:stroke-paper-50/25"
                  strokeWidth="1.5"
                />
                <line
                  x1="107"
                  y1="220"
                  x2="373"
                  y2="220"
                  className="stroke-navy-900/25 dark:stroke-paper-50/20"
                  strokeDasharray="4 3"
                />
                <line
                  x1="173"
                  y1="140"
                  x2="307"
                  y2="140"
                  className="stroke-navy-900/25 dark:stroke-paper-50/20"
                  strokeDasharray="4 3"
                />
                <text
                  x="240"
                  y="90"
                  textAnchor="middle"
                  className="fill-navy-900 dark:fill-paper-50 font-hand"
                  fontSize="18"
                >
                  1st-degree, close
                </text>
                <text
                  x="240"
                  y="185"
                  textAnchor="middle"
                  className="fill-navy-900 dark:fill-paper-50 font-hand"
                  fontSize="18"
                >
                  Warm, occasional contact
                </text>
                <text
                  x="240"
                  y="265"
                  textAnchor="middle"
                  className="fill-navy-900 dark:fill-paper-50 font-hand"
                  fontSize="18"
                >
                  Followed, not yet connected
                </text>
              </svg>
              <p className="mt-3 text-[11px] sm:text-[12px] font-mono text-navy-700/60 dark:text-paper-200/55">
                Fig. 3 — most of your network should sit in the wide base; nurture the narrow top
                deliberately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* AI job search                                                */}
      {/* ---------------------------------------------------------- */}
      <section
        id="ai"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 scroll-mt-20 sm:scroll-mt-24"
      >
        <SectionHeading
          eyebrow="07 · AI & the job search"
          title="Finding work with AI as a real advantage"
          lede="AI won't get you hired by itself — but used well, it removes hours of grunt work and sharpens
          what a human eventually reads."
        />
        <AIUseCases />

        <div className="mt-10 sm:mt-12 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          <div>
            <h3 className="font-display text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-teal-700 dark:text-teal-300 shrink-0" /> Where it
              genuinely helps
            </h3>
            <ul className="space-y-2 text-[14px] sm:text-[14.5px] leading-relaxed text-navy-700/85 dark:text-paper-200/75">
              <li>
                · Cutting first-draft time on cover letters and outreach messages from an hour to
                minutes.
              </li>
              <li>
                · Catching gaps between your profile and a specific posting before a recruiter
                does.
              </li>
              <li>
                · Practicing interviews without needing another person&apos;s schedule to align with
                yours.
              </li>
              <li>
                · Turning a wall of job postings into a short, ranked shortlist worth your actual
                attention.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
              <Bot className="h-5 w-5 text-rose-600 dark:text-rose-300 shrink-0" /> Where it
              backfires
            </h3>
            <ul className="space-y-2 text-[14px] sm:text-[14.5px] leading-relaxed text-navy-700/85 dark:text-paper-200/75">
              <li>
                · Fully AI-written About sections and messages read as generic — recruiters see
                hundreds and pattern-match fast.
              </li>
              <li>
                · Letting AI invent achievements or skills you don&apos;t have; this fails the first
                real conversation.
              </li>
              <li>
                · Mass, unedited AI outreach to hundreds of contacts — volume without
                personalization reads as spam.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 md:mt-14 rounded-md border border-navy-900/10 dark:border-paper-50/10 p-5 sm:p-6 md:p-8 bg-navy-900/[0.02] dark:bg-paper-50/[0.02]">
          <h3 className="font-display text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-teal-700 dark:text-teal-300 shrink-0" /> Where this is
            heading
          </h3>
          <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-navy-700/85 dark:text-paper-200/75 max-w-3xl">
            Expect matching to keep moving from keyword search toward genuine skills- and
            outcome-based matching, AI-run initial screening conversations before a human gets
            involved, and more platforms surfacing &quot;hidden&quot; candidates who aren&apos;t
            actively applying but whose profile signals a strong fit. The advantage will
            increasingly go to profiles that are specific and verifiable — real projects, real
            outcomes, real endorsements — because that&apos;s exactly the kind of signal AI matching
            systems weight most heavily, and the kind generic, AI-generated filler doesn&apos;t
            produce.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Common mistakes                                              */}
      {/* ---------------------------------------------------------- */}
      <section
        id="mistakes"
        className="border-t border-navy-900/10 dark:border-paper-50/10 bg-navy-900/[0.02] dark:bg-paper-50/[0.02]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <SectionHeading eyebrow="08 · Before you go" title="Mistakes worth checking for right now" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-3 sm:gap-y-4">
            {[
              "No photo, or a group photo you're cropped out of badly",
              "Headline that's just your current job title, unchanged since you joined",
              "About section left blank or copied straight from a résumé",
              "Skills list of 30+ items with nothing prioritized",
              "Zero activity for months — no posts, comments, or reactions",
              "Certificates listed with no date or verification link",
              "Experience bullets describing duties instead of outcomes",
              "Open-to-work signal left off (or on) without knowing which you want",
            ].map((m) => (
              <div
                key={m}
                className="flex gap-2.5 sm:gap-3 text-[14px] sm:text-[14.5px] leading-relaxed text-navy-700/85 dark:text-paper-200/75"
              >
                <ClipboardCheck className="h-4 w-4 mt-0.5 sm:mt-1 shrink-0 text-amber-600 dark:text-amber-300" />
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 flex items-start sm:items-center gap-2 text-[11.5px] sm:text-[12.5px] font-mono text-navy-700/60 dark:text-paper-200/50">
        <Target className="h-4 w-4 shrink-0 mt-0.5 sm:mt-0" />
        <span>LinkedIn Mastery - updated as the platform and hiring practices evolve.</span>
      </footer>
    </main>
  );
}