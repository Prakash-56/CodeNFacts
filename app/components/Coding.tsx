"use client";

import React from "react";

/**
 * Coding.tsx
 * Editorial / "technical spec sheet" explainer page:
 *   01  What is coding?
 *   02  What happens when you code? (blueprint-style schematic)
 *
 * Theming: this component has NO toggle of its own — it reads the
 * standard Tailwind `dark` class from an ancestor element (the one your
 * Header.tsx already flips). Background is pure white in light mode.
 */

/* --------------------------------- icons ---------------------------------- */

const iconBase = "h-5 w-5";

function PencilIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 20l1-4.2L16.6 4.2a1.5 1.5 0 0 1 2.1 0l1.1 1.1a1.5 1.5 0 0 1 0 2.1L8.2 19l-4.2 1Z" />
      <path d="M14.5 6.3l3.2 3.2" />
    </svg>
  );
}
function SaveIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M8 4v5h7V4M8 20v-6h8v6" />
    </svg>
  );
}
function GearIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4M17.7 17.7l-1.4-1.4M7.7 7.7 6.3 6.3" />
    </svg>
  );
}
function BinaryIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3.5" y="6" width="7" height="5" rx="1" />
      <rect x="13.5" y="13" width="7" height="5" rx="1" />
      <path d="M7 11v7M17 6v7" />
    </svg>
  );
}
function CpuIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 5l-2 2M5 19l2-2M17 19l-2-2" />
    </svg>
  );
}
function MonitorIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
      <path d="M8.5 20.5h7M12 16.5v4" />
      <path d="M7 9.5l2.3 2.3L7 14M13 14h4" />
    </svg>
  );
}

/* --------------------------------- data ------------------------------------ */

type Step = {
  tag: string;
  title: string;
  code: string;
  body: string;
  Icon: (p: { className?: string }) => React.ReactElement;
};

const STEPS: Step[] = [
  { tag: "FIG. 01", title: "You write code", code: "hello.py", body: "Instructions typed in a human-readable language - Python, JavaScript, whatever the job calls for.", Icon: PencilIcon },
  { tag: "FIG. 02", title: "The file is saved", code: "→ disk", body: "Your editor stores it as plain text. Still just words - nothing has run yet.", Icon: SaveIcon },
  { tag: "FIG. 03", title: "It gets translated", code: "compiler / interpreter", body: "A compiler or interpreter reads your code and converts it toward something the machine can act on.", Icon: GearIcon },
  { tag: "FIG. 04", title: "Machine code appears", code: "01001000 01101001", body: "Your program becomes binary - the only dialect a processor natively executes.", Icon: BinaryIcon },
  { tag: "FIG. 05", title: "The CPU executes it", code: "cpu.exec()", body: "The processor works through each instruction in order, billions of times a second.", Icon: CpuIcon },
  { tag: "FIG. 06", title: "Output appears", code: "> Hello, world!", body: "The result surfaces as text, pixels, sound, or motion - whatever you told it to produce.", Icon: MonitorIcon },
];

/* ------------------------------ small pieces -------------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 font-mono text-[11px] tracking-[0.14em] text-neutral-500 dark:border-white/15 dark:bg-white/[0.04] dark:text-neutral-400"
    >
      {children}
    </span>
  );
}

function SectionTag({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="rounded-md border border-blue-600/25 bg-blue-600/[0.06] px-2 py-0.5 font-mono text-[13px] text-blue-700 dark:border-blue-400/30 dark:bg-blue-400/[0.08] dark:text-blue-300">
        {n}
      </span>
      <h2 className="font-serif text-[26px] font-medium leading-tight text-neutral-950 dark:text-white sm:text-[32px]">
        {title}
      </h2>
    </div>
  );
}

/* Corner crop-marks — the "spec sheet" signature touch */
function CropMarks() {
  const arm = "absolute h-3 w-3 border-blue-600/40 dark:border-blue-400/40";
  return (
    <>
      <span className={`${arm} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${arm} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${arm} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${arm} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}

/* ---------------------------- hero sketch panel ------------------------------ */

function HeroSketch() {
  return (
    <div className="coding-dotgrid relative aspect-square w-full max-w-[420px] rounded-2xl border border-black/10 bg-white p-6 shadow-[0_30px_60px_-30px_rgba(20,30,60,0.25)] dark:border-white/10 dark:bg-neutral-950">
      <CropMarks />
      <svg viewBox="0 0 340 340" className="h-full w-full">
        <defs>
          <marker id="coding-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" className="fill-blue-600 dark:fill-blue-400" />
          </marker>
        </defs>

        {/* source card */}
        <g>
          <rect x="16" y="24" width="128" height="72" rx="8" className="fill-white stroke-neutral-300 dark:fill-neutral-900 dark:stroke-neutral-700" strokeWidth="1.5" />
          <circle cx="30" cy="38" r="2.4" className="fill-red-400" />
          <circle cx="38" cy="38" r="2.4" className="fill-amber-400" />
          <circle cx="46" cy="38" r="2.4" className="fill-emerald-400" />
          <rect x="28" y="50" width="60" height="4" rx="2" className="fill-blue-600/70 dark:fill-blue-400/70" />
          <rect x="28" y="60" width="88" height="4" rx="2" className="fill-neutral-300 dark:fill-neutral-700" />
          <rect x="28" y="70" width="72" height="4" rx="2" className="fill-neutral-300 dark:fill-neutral-700" />
          <rect x="28" y="80" width="48" height="4" rx="2" className="fill-neutral-300 dark:fill-neutral-700" />
          <text x="18" y="112" className="fill-neutral-400 dark:fill-neutral-500" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="1">
            SOURCE
          </text>
        </g>

        {/* arrow 1 */}
        <path d="M148 60 H198" className="stroke-blue-600/70 dark:stroke-blue-400/70" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#coding-arrow)" />

        {/* gear */}
        <g transform="translate(200,36)">
          <circle cx="24" cy="24" r="26" className="fill-white stroke-neutral-300 dark:fill-neutral-900 dark:stroke-neutral-700" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="7" className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="1.6" fill="none" />
          <g className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="1.6" strokeLinecap="round">
            <path d="M24 8v5M24 35v5M40 24h-5M13 24H8" />
            <path d="M35 13l-3.5 3.5M16.5 31.5 13 35M35 35l-3.5-3.5M16.5 16.5 13 13" />
          </g>
          <text x="24" y="66" textAnchor="middle" className="fill-neutral-400 dark:fill-neutral-500" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="1">
            COMPILE
          </text>
        </g>

        {/* arrow 2 */}
        <path d="M148 96 V150 H200" className="stroke-blue-600/70 dark:stroke-blue-400/70" strokeWidth="1.5" strokeDasharray="4 4" fill="none" markerEnd="url(#coding-arrow)" />

        {/* binary strip */}
        <g transform="translate(24,150)">
          <rect x="0" y="0" width="150" height="40" rx="7" className="fill-white stroke-neutral-300 dark:fill-neutral-900 dark:stroke-neutral-700" strokeWidth="1.5" />
          <text x="12" y="26" className="fill-blue-600 dark:fill-blue-400" fontFamily="ui-monospace, monospace" fontSize="13" letterSpacing="2">
            01001101
          </text>
          <text x="0" y="56" className="fill-neutral-400 dark:fill-neutral-500" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="1">
            MACHINE CODE
          </text>
        </g>

        {/* arrow 3 */}
        <path d="M200 170 H244" className="stroke-blue-600/70 dark:stroke-blue-400/70" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#coding-arrow)" />

        {/* chip */}
        <g transform="translate(246,146)">
          <rect x="0" y="0" width="48" height="48" rx="6" className="fill-white stroke-neutral-300 dark:fill-neutral-900 dark:stroke-neutral-700" strokeWidth="1.5" />
          <rect x="14" y="14" width="20" height="20" rx="2" className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="1.6" fill="none" />
          <g className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.4">
            <path d="M8 8h6M34 8h6M8 40h6M34 40h6M8 20v-6M8 34v6M40 20v-6M40 34v6" />
          </g>
          <text x="24" y="66" textAnchor="middle" className="fill-neutral-400 dark:fill-neutral-500" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="1">
            CPU
          </text>
        </g>

        {/* arrow 4 */}
        <path d="M270 194 V228" className="stroke-blue-600/70 dark:stroke-blue-400/70" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#coding-arrow)" />

        {/* monitor */}
        <g transform="translate(198,228)">
          <rect x="0" y="0" width="144" height="80" rx="8" className="fill-white stroke-neutral-300 dark:fill-neutral-900 dark:stroke-neutral-700" strokeWidth="1.5" />
          <rect x="10" y="10" width="124" height="46" rx="4" className="fill-neutral-50 dark:fill-neutral-800" />
          <text x="20" y="38" className="fill-emerald-600 dark:fill-emerald-400" fontFamily="ui-monospace, monospace" fontSize="11">
            &gt; Hello, world!
          </text>
          <rect x="60" y="66" width="24" height="4" rx="2" className="fill-neutral-300 dark:fill-neutral-700" />
          <text x="0" y="98" className="fill-neutral-400 dark:fill-neutral-500" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="1">
            OUTPUT
          </text>
        </g>
      </svg>
    </div>
  );
}

/* --------------------------------- hero ------------------------------------ */

function Hero() {
  return (
    <section className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-14 px-6 pb-16 pt-20 sm:px-10 md:grid-cols-[1.05fr_0.95fr] md:pt-28">
      <div>
        <Eyebrow>A field</Eyebrow>
        <h1 className="mt-6 font-serif text-[42px] font-medium leading-[1.05] tracking-[-0.01em] text-neutral-950 dark:text-white sm:text-[54px]">
          What is coding,
          <br />
          <span className="text-blue-600 dark:text-blue-400">really?</span>
        </h1>
        <p className="mt-6 max-w-[440px] text-[17px] leading-[1.7] text-neutral-600 dark:text-neutral-400">
          Coding is writing instructions a computer can follow, exactly and in order, to
          make something happen. This page breaks down what coding actually is, then
          walks through the pipeline that runs every time you hit "Run."
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#what-is-coding" className="group mt-10 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300">
            Start Reading
          </a>
          <a href="#what-happens" className="group mt-10 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300">
            See The Pipeline
          </a>
        </div>
      </div>
      <div className="flex justify-center md:justify-end">
        <HeroSketch />
      </div>
    </section>
  );
}

/* ------------------------------ what is coding ------------------------------- */

function DefinitionSection() {
  const cards = [
    { title: "It's a language", body: "Written in Python, JavaScript, or similar - each with strict vocabulary and grammar, built to leave nothing open to interpretation." },
    { title: "It's a recipe", body: "A precise sequence of steps: take input, transform it, produce a result. Reorder a step and the outcome changes." },
    { title: "It's for a machine", body: "No room for guessing. A computer runs exactly what's written - which is why one misplaced character can matter." },
  ];

  return (
    <section id="what-is-coding" className="mx-auto max-w-[1120px] scroll-mt-24 px-6 py-16 sm:px-10">
      <SectionTag n="01" title="What is coding?" />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c, i) => (
          <div
            key={c.title}
            className="group relative rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgba(20,30,60,0.35)] dark:border-white/10 dark:bg-neutral-950"
          >
            <span className="font-mono text-[11px] tracking-[0.14em] text-blue-600/70 dark:text-blue-400/70">
              {`0${i + 1}`}
            </span>
            <h3 className="mt-3 font-serif text-[19px] font-medium text-neutral-950 dark:text-white">{c.title}</h3>
            <p className="mt-2.5 text-[14.5px] leading-[1.65] text-neutral-600 dark:text-neutral-400">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- step flow ----------------------------------- */

function ConnectorH() {
  return <span className="coding-wire-h hidden flex-1 self-center md:block" aria-hidden="true" />;
}
function ConnectorV() {
  return <span className="coding-wire-v mx-auto block h-8 md:hidden" aria-hidden="true" />;
}

function StepFlow() {
  return (
    <section id="what-happens" className="border-y border-black/10 bg-neutral-50/60 py-16 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-[1120px] scroll-mt-24 px-6 sm:px-10">
        <SectionTag n="02" title="What happens when you code?" />
        <p className="mt-4 max-w-[560px] text-[15px] leading-[1.7] text-neutral-600 dark:text-neutral-400">
          Hitting "Run" starts a short, exact pipeline. Here's what happens between your
          keystrokes and the result on screen.
        </p>

        {/* schematic row of nodes */}
        <div className="coding-dotgrid mt-12 flex flex-col items-stretch rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-neutral-950 md:flex-row md:items-center md:p-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.tag}>
              <div className="flex flex-col items-center gap-2 py-3 text-center md:py-0">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-neutral-900 bg-white text-neutral-900 shadow-sm dark:border-white dark:bg-neutral-950 dark:text-white">
                  <s.Icon className={iconBase} />
                  <span className="absolute -right-1 -top-1 rounded-full border border-black/10 bg-blue-600 px-1.5 py-[1px] font-mono text-[9px] font-medium text-white dark:border-white/20 dark:bg-blue-400 dark:text-neutral-950">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="max-w-[104px] font-mono text-[11px] leading-tight text-neutral-500 dark:text-neutral-500">
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <>
                  <ConnectorH />
                  <ConnectorV />
                </>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* detail grid matched to the diagram numbers */}
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.tag} className="border-l-2 border-blue-600/30 pl-4 dark:border-blue-400/30">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] tracking-[0.1em] text-blue-700 dark:text-blue-300">{s.tag}</span>
              </div>
              <h4 className="mt-1.5 font-serif text-[16.5px] font-medium text-neutral-950 dark:text-white">{s.title}</h4>
              <code className="mt-1.5 block truncate rounded-md bg-neutral-900 px-2.5 py-1 font-mono text-[11.5px] text-emerald-400 dark:bg-black">
                {s.code}
              </code>
              <p className="mt-2.5 text-[14px] leading-[1.6] text-neutral-600 dark:text-neutral-400">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- footer ----------------------------------- */

function Footer() {
  return (
    <footer className="mx-auto max-w-[1120px] px-6 py-12 sm:px-10">
      <p className="font-mono text-[12px] text-neutral-400 dark:text-neutral-600">
        {"Happy Learning .. "}
      </p>
    </footer>
  );
}

/* ---------------------------------- page ------------------------------------ */

export default function Coding() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-950 dark:bg-neutral-950 dark:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,560&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .font-serif { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-sans  { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
        .font-mono  { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

        .coding-dotgrid {
          background-image: radial-gradient(rgba(10,10,20,0.09) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .dark .coding-dotgrid {
          background-image: radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px);
        }

        .coding-wire-h {
          height: 2px;
          margin: 0 10px;
          background-image: repeating-linear-gradient(90deg, #2563eb 0 6px, transparent 6px 14px);
          background-size: 14px 2px;
          animation: coding-flow-x 1.1s linear infinite;
        }
        .dark .coding-wire-h {
          background-image: repeating-linear-gradient(90deg, #60a5fa 0 6px, transparent 6px 14px);
        }
        .coding-wire-v {
          width: 2px;
          background-image: repeating-linear-gradient(180deg, #2563eb 0 6px, transparent 6px 14px);
          background-size: 2px 14px;
          animation: coding-flow-y 1.1s linear infinite;
        }
        .dark .coding-wire-v {
          background-image: repeating-linear-gradient(180deg, #60a5fa 0 6px, transparent 6px 14px);
        }
        @keyframes coding-flow-x { to { background-position: 14px 0; } }
        @keyframes coding-flow-y { to { background-position: 0 14px; } }

        @media (prefers-reduced-motion: reduce) {
          .coding-wire-h, .coding-wire-v { animation: none; }
        }
      `}</style>

      <Hero />
      <DefinitionSection />
      <StepFlow />
      <Footer />
    </div>
  );
}