import type { ReactNode } from "react";
import { JetBrains_Mono, Inter } from "next/font/google";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

/* ------------------------------------------------------------------ */
/*  NOTE ON DARK MODE                                                  */
/*  This page assumes your header's light/dark toggle adds/removes a  */
/*  `dark` class on <html> (the standard Tailwind "class" strategy —  */
/*  same pattern next-themes / shadcn use). All colors below are      */
/*  CSS variables that flip automatically when `.dark` is present.    */
/*  If your toggle does something else (data-theme attr, etc.) just   */
/*  swap the `.dark { ... }` selector below to match.                 */
/* ------------------------------------------------------------------ */

const TOC = [
  { id: "logic", label: "01 · Logic" },
  { id: "thinking", label: "02 · Thinking" },
  { id: "problem-solving", label: "03 · Problem Solving" },
  { id: "communication", label: "04 · Communication" },
  { id: "understanding", label: "05 · Understanding" },
  { id: "projects", label: "06 · Projects" },
  { id: "resume", label: "07 · Resume" },
  { id: "mindset", label: "08 · Mindset" },
  { id: "cheat-sheets", label: "09 · Cheat Sheets" },
];

export default function MustDoPage() {
  return (
    <div
      className={`${mono.variable} ${sans.variable} min-h-screen bg-[var(--paper)] text-[var(--ink)] transition-colors duration-300`}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <style>{`
        :root {
          --paper: #ffffff;
          --paper-dim: #f4f5f2;
          --paper-card: #fdfdfb;
          --ink: #14181b;
          --ink-soft: #5b6169;
          --line: #dfe3e6;
          --line-strong: #c3c9cd;
          --blue: #1e4b8f;
          --blue-soft: #e8f0fc;
          --amber: #a86611;
          --amber-soft: #fdf3df;
          --green: #206c4b;
          --green-soft: #e6f4ee;
          --grid: rgba(20, 24, 27, 0.045);
        }
        .dark {
          --paper: #0b0e11;
          --paper-dim: #12161b;
          --paper-card: #10141850;
          --ink: #e7eaed;
          --ink-soft: #97a0a8;
          --line: #232a30;
          --line-strong: #333c44;
          --blue: #85b6f2;
          --blue-soft: #142334;
          --amber: #f0b94e;
          --amber-soft: #2a2110;
          --green: #64d8a8;
          --green-soft: #0f2620;
          --grid: rgba(231, 234, 237, 0.04);
        }
        .bp-grid {
          background-image:
            linear-gradient(var(--grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .font-display { font-family: var(--font-mono); }
      `}</style>

      {/* ============================= HERO ============================= */}
      <header className="relative overflow-hidden border-b border-[var(--line)] bp-grid">
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-20 sm:px-8">
          <p className="font-display text-xs tracking-widest text-[var(--ink-soft)]">
            // field-notes/must-do.md
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl">
            What it actually takes{" "}
            <span className="relative inline-block">
              to become a coder
              <Squiggle className="absolute -bottom-2 left-0 w-full text-[var(--amber)]" />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--ink-soft)]">
            Syntax is the easy part. This is the page for everything else -
            the logic, the thinking, the communicating, the shipping - the
            stuff nobody puts in a course syllabus but every working
            engineer had to figure out anyway. Annotated like a notebook,
            because that&apos;s honestly how it gets learned.
          </p>

          {/* Signature diagram: the roadmap sketch */}
          <RoadmapDiagram />

          {/* Table of contents */}
          <nav className="mt-10 flex flex-wrap gap-2">
            {TOC.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="font-display rounded-full border border-[var(--line-strong)] px-3 py-1.5 text-[11px] tracking-wide text-[var(--ink-soft)] transition-colors hover:border-[var(--blue)] hover:text-[var(--blue)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
        {/* ========================= 01 LOGIC ========================= */}
        <Section
          id="logic"
          index="01"
          title="Build the logic before you write a single line"
          intro="Code is just logic translated into syntax. If the logic isn't clear in your head, no amount of framework knowledge saves you. Slow down here on purpose."
        >
          <LogicFlow />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card title="The 5-step habit" tone="blue">
              <ol className="space-y-2 text-sm leading-relaxed">
                <li><b>1. Restate the problem</b> in plain English, out loud, in your own words.</li>
                <li><b>2. Work a tiny example by hand</b> — literally on paper — before touching a keyboard.</li>
                <li><b>3. Find the pattern</b> in how you solved the example manually.</li>
                <li><b>4. Write pseudocode</b> — no syntax, just steps.</li>
                <li><b>5. Code the happy path first</b>, then handle edge cases.</li>
              </ol>
            </Card>
            <Card title="Signs you skipped this" tone="amber">
              <ul className="space-y-2 text-sm leading-relaxed">
                <li>You&apos;re editing code by trial and error, not by reasoning.</li>
                <li>You can&apos;t explain why your fix worked.</li>
                <li>You copy a solution and it works, but you couldn&apos;t reproduce it from scratch tomorrow.</li>
                <li>Every new feature request makes you nervous instead of curious.</li>
              </ul>
            </Card>
          </div>
        </Section>

        {/* ======================= 02 THINKING ======================= */}
        <Section
          id="thinking"
          index="02"
          title="Level up how you think, not just what you know"
          intro="Frameworks change every two years. The way you reason about problems is what actually compounds. Treat thinking as a trainable skill."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <MiniCard
              label="First principles"
              text="Strip a problem to facts you're certain of, then rebuild the solution from there — instead of copying the nearest pattern you remember."
            />
            <MiniCard
              label="Five whys"
              text="Ask 'why' about a bug or decision five times. The first answer is a symptom; by the third you usually hit the real cause."
            />
            <MiniCard
              label="Think in systems"
              text="Before writing a line, sketch how data moves in → through → out. Bugs mostly live at the seams between parts, not inside them."
            />
            <MiniCard
              label="Abstraction ladder"
              text="Practice explaining the same idea at 3 zoom levels: to a beginner, to a peer, to yourself at 2am. Each level sharpens the others."
            />
            <MiniCard
              label="Build a pattern library"
              text="DSA and design patterns aren't trivia — they're a vocabulary of pre-solved shapes. More patterns you recognize, less you invent from scratch."
            />
            <MiniCard
              label="Deliberate confusion"
              text="Sit with not-knowing for a few minutes before searching. The struggle is what builds the mental model, not the answer itself."
            />
          </div>

          <Callout tone="green" className="mt-6">
            <b>Daily rep:</b> pick one thing you used today without knowing exactly how it works
            (a hook, a query planner, an auth flow) and spend 10 minutes finding out. Thinking
            level rises from repetition, not from one big breakthrough.
          </Callout>
        </Section>

        {/* =================== 03 PROBLEM SOLVING ==================== */}
        <Section
          id="problem-solving"
          index="03"
          title="A repeatable loop for getting unstuck"
          intro="Problem solving isn't talent, it's a loop you run on purpose. Same loop for a bug, a LeetCode problem, or a system design question."
        >
          <UPERLoop />

          <Card title="Stuck for more than 20 minutes? Run this checklist" tone="blue" className="mt-8">
            <ChecklistGrid
              items={[
                "Explain the problem out loud, line by line (rubber-duck it).",
                "Write down exactly what you know vs. what you don't.",
                "Shrink the problem — solve a smaller version first.",
                "Work backward from the expected output.",
                "Search for a structurally similar solved problem.",
                "Step away for 10 minutes. Seriously — it works.",
              ]}
            />
          </Card>
        </Section>

        {/* =================== 04 COMMUNICATION ======================= */}
        <Section
          id="communication"
          index="04"
          title="Communication is a coding skill, not a soft skill"
          intro="Code that no one can review, a bug no one can reproduce from your report, a PR no one wants to open — all communication failures, not technical ones."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Card title="Explaining, the Feynman way" tone="green">
              <p className="text-sm leading-relaxed">
                Explain what you built to someone with zero context, using zero jargon. Every
                place you stumble or reach for a technical word to cover a gap is a spot you
                don&apos;t fully understand yet. Rewrite it in plain language until it&apos;s smooth.
              </p>
            </Card>
            <Card title="Rubber-duck debugging" tone="green">
              <p className="text-sm leading-relaxed">
                Explain your code line-by-line to an object on your desk (or a person, or a
                doc). Most of the time you&apos;ll spot the bug mid-sentence — because
                explaining forces the precision that skimming doesn&apos;t.
              </p>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card title="Vague question" tone="amber">
              <p className="font-display text-sm leading-relaxed text-[var(--ink-soft)]">
                &quot;My code doesn&apos;t work, help?&quot;
              </p>
            </Card>
            <Card title="Good question" tone="blue">
              <p className="font-display text-sm leading-relaxed">
                &quot;Expected X, got Y. Here&apos;s the minimal snippet, the exact error,
                and the two things I already tried.&quot;
              </p>
            </Card>
          </div>

          <Callout tone="amber" className="mt-6">
            <b>Commit messages &amp; PR descriptions count.</b> &quot;fix stuff&quot; tells a
            future teammate (often future-you) nothing. State what changed, why, and how to
            verify it. Your reviewer&apos;s time is part of the cost of the change.
          </Callout>
        </Section>

        {/* =================== 05 UNDERSTANDING ======================= */}
        <Section
          id="understanding"
          index="05"
          title="Understanding vs. memorizing — know the difference"
          intro="Syntax recall fades in a month. Real understanding is what lets you rebuild it after it fades."
        >
          <Card title="Self-check: do you actually understand it?" tone="blue">
            <ChecklistGrid
              items={[
                "Can you explain it without opening docs or notes?",
                "Can you rebuild a simplified version of it from scratch?",
                "Can you say why it works this way, not just that it does?",
                "Can you teach it to someone newer than you, and answer their follow-up questions?",
              ]}
            />
            <p className="mt-4 text-xs text-[var(--ink-soft)]">
              If the answer is &quot;no&quot; to more than one, you&apos;ve memorized the shape,
              not the substance. That&apos;s fine — it just means it&apos;s not solid yet.
            </p>
          </Card>
        </Section>

        {/* ===================== 06 PROJECTS =========================== */}
        <Section
          id="projects"
          index="06"
          title="Projects that actually prove something"
          intro="A portfolio full of tutorial clones proves you can follow instructions. Projects that prove skill look different."
        >
          <ProjectLadder />

          <Card title="A project is portfolio-worthy when it has..." tone="green" className="mt-8">
            <ChecklistGrid
              items={[
                "A real (even small) problem behind it — not just 'practice CRUD'.",
                "A README that explains the why, the stack, and how to run it.",
                "A live deployed link, not just a repo.",
                "At least some tests, or a clear explanation of what you'd test next.",
                "A story you can tell in an interview: a decision, a trade-off, a bug you hunted down.",
              ]}
            />
          </Card>
        </Section>

        {/* ====================== 07 RESUME ============================ */}
        <Section
          id="resume"
          index="07"
          title="Resume: signal over decoration"
          intro="A resume's only job is to earn 6 seconds of attention and turn it into a callback. Every line should pull weight."
        >
          <Card title="Bullet formula" tone="blue">
            <p className="font-display text-sm">
              [Action verb] + [what you built/fixed] + [tech used] + [measurable outcome]
            </p>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              e.g. &quot;Rebuilt the checkout flow in React/Node, cutting page load time
              from 3.1s to 0.9s.&quot;
            </p>
          </Card>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card title="Do" tone="green">
              <ul className="space-y-2 text-sm leading-relaxed">
                <li>Quantify impact wherever honestly possible.</li>
                <li>Match keywords from the job description.</li>
                <li>Keep formatting simple — most resumes are parsed by ATS software first.</li>
                <li>Lead each bullet with what changed, not what your job title was.</li>
              </ul>
            </Card>
            <Card title="Don't" tone="amber">
              <ul className="space-y-2 text-sm leading-relaxed">
                <li>List every technology you've ever touched once.</li>
                <li>Use tables, columns, icons, or images an ATS can't parse.</li>
                <li>Write tasks (&quot;responsible for...&quot;) instead of outcomes.</li>
                <li>Let it run past one page early in your career.</li>
              </ul>
            </Card>
          </div>
        </Section>

        {/* ====================== 08 MINDSET =========================== */}
        <Section
          id="mindset"
          index="08"
          title="Keep this taped above your monitor"
          intro="The reminders that matter most are the ones you forget under deadline pressure."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Read the entire error message before you Google anything.",
              "Google the exact error text, not the vibe of the problem.",
              "Done is better than perfect for v1 — iterate after it works.",
              "Version control everything, commit early and often.",
              "Ask for a code review before you're 'sure it's perfect.'",
              "Consistency beats intensity — 30 min daily beats a 6hr weekend binge.",
              "You don't need to memorize everything. Know where to look.",
              "Compare yourself to yesterday-you, not to someone's highlight reel.",
              "Broken code is normal. Debugging is the actual job, not a detour from it.",
            ].map((note, i) => (
              <StickyNote key={i} text={note} rotate={i % 3 === 0 ? -1.5 : i % 3 === 1 ? 1.5 : 0} />
            ))}
          </div>
        </Section>

        {/* ==================== 09 CHEAT SHEETS ======================== */}
        <Section
          id="cheat-sheets"
          index="09"
          title="Quick-reference cheat sheets"
          intro="Pin these. They're meant to be glanced at, not studied."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <IndexCard title="Big-O, at a glance">
              <CodeRow label="O(1)" value="constant — hash lookup" tone="green" />
              <CodeRow label="O(log n)" value="binary search" tone="green" />
              <CodeRow label="O(n)" value="single loop" tone="blue" />
              <CodeRow label="O(n log n)" value="merge/quick sort" tone="blue" />
              <CodeRow label="O(n²)" value="nested loop over same data" tone="amber" />
              <CodeRow label="O(2ⁿ)" value="naive recursive branching" tone="amber" />
            </IndexCard>

            <IndexCard title="Git essentials">
              <CodeRow label="git status" value="what changed" />
              <CodeRow label="git add ." value="stage changes" />
              <CodeRow label="git commit -m" value="save a snapshot" />
              <CodeRow label="git branch x" value="new branch x" />
              <CodeRow label="git checkout x" value="switch to x" />
              <CodeRow label="git pull --rebase" value="update cleanly" />
              <CodeRow label="git stash" value="park work-in-progress" />
            </IndexCard>

            <IndexCard title="Debugging checklist">
              <CodeRow label="1." value="Reproduce it reliably first" />
              <CodeRow label="2." value="Read the full stack trace, top to bottom" />
              <CodeRow label="3." value="What changed most recently?" />
              <CodeRow label="4." value="Isolate — cut the problem in half" />
              <CodeRow label="5." value="Log/print actual values, not assumptions" />
              <CodeRow label="6." value="Check types, nulls, and off-by-ones" />
            </IndexCard>

            <IndexCard title="Daily practice loop">
              <CodeRow label="1." value="One problem — logic before code" />
              <CodeRow label="2." value="Read someone else's code for 10 min" />
              <CodeRow label="3." value="Explain today's build in one paragraph" />
              <CodeRow label="4." value="Review yesterday's code with fresh eyes" />
            </IndexCard>
          </div>
        </Section>
      </main>

      <footer className="border-t border-[var(--line)] bp-grid">
        <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
          <p className="font-display text-xs text-[var(--ink-soft)]">
            // end of file — none of this replaces reps. reread this page in three months,
            it'll mean something different once you have more hours in.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ==================================================================== */
/*  BUILDING BLOCKS                                                      */
/* ==================================================================== */

function Section({
  id,
  index,
  title,
  intro,
  children,
}: {
  id: string;
  index: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-10 border-t border-[var(--line)] py-14 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-sm text-[var(--blue)]">{index}</span>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-[28px]">{title}</h2>
      </div>
      {intro && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">{intro}</p>
      )}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Card({
  title,
  tone = "blue",
  children,
  className = "",
}: {
  title: string;
  tone?: "blue" | "amber" | "green";
  children: ReactNode;
  className?: string;
}) {
  const dot = { blue: "var(--blue)", amber: "var(--amber)", green: "var(--green)" }[tone];
  return (
    <div className={`rounded-lg border border-[var(--line)] bg-[var(--paper-card)] p-5 ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex gap-1">
          <i className="h-2.5 w-2.5 rounded-full" style={{ background: dot, opacity: 0.9 }} />
          <i className="h-2.5 w-2.5 rounded-full bg-[var(--line-strong)]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[var(--line-strong)]" />
        </span>
        <p className="font-display text-xs font-semibold tracking-wide text-[var(--ink-soft)]">
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

function MiniCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--paper-dim)] p-4">
      <p className="font-display text-[13px] font-semibold text-[var(--blue)]">{label}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-[var(--ink-soft)]">{text}</p>
    </div>
  );
}

function IndexCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-md border border-[var(--line)] bg-[var(--paper-card)] p-5 shadow-[2px_3px_0_var(--line)]">
      <p className="font-display mb-3 text-[13px] font-bold uppercase tracking-wider text-[var(--ink)]">
        {title}
      </p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function CodeRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "blue" | "amber" | "green";
}) {
  const color = tone ? { blue: "var(--blue)", amber: "var(--amber)", green: "var(--green)" }[tone] : "var(--ink)";
  return (
    <div className="flex items-baseline gap-3 font-display text-[12.5px] leading-relaxed">
      <span className="w-24 shrink-0 font-semibold" style={{ color }}>
        {label}
      </span>
      <span className="text-[var(--ink-soft)]">{value}</span>
    </div>
  );
}

function ChecklistGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
          <svg width="14" height="14" viewBox="0 0 14 14" className="mt-1 shrink-0 text-[var(--green)]">
            <rect x="1" y="1" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M3.5 7 L6 9.5 L10.5 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Callout({
  tone,
  children,
  className = "",
}: {
  tone: "blue" | "amber" | "green";
  children: ReactNode;
  className?: string;
}) {
  const bg = { blue: "var(--blue-soft)", amber: "var(--amber-soft)", green: "var(--green-soft)" }[tone];
  const border = { blue: "var(--blue)", amber: "var(--amber)", green: "var(--green)" }[tone];
  return (
    <div
      className={`rounded-md border-l-[3px] p-4 text-sm leading-relaxed ${className}`}
      style={{ background: bg, borderColor: border }}
    >
      {children}
    </div>
  );
}

function StickyNote({ text, rotate = 0 }: { text: string; rotate?: number }) {
  return (
    <div
      className="rounded-sm border border-[var(--line)] bg-[var(--amber-soft)] p-4 text-[13px] leading-relaxed shadow-[3px_4px_0_var(--line)]"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {text}
    </div>
  );
}

function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 12" preserveAspectRatio="none" className={className} height="10">
      <path
        d="M0 8 Q 12 2, 24 8 T 48 8 T 72 8 T 96 8 T 120 8 T 144 8 T 168 8 T 192 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------- diagrams ------------------------------ */

function RoadmapDiagram() {
  const nodes = [
    "Fundamentals",
    "Logic & DSA",
    "Build real projects",
    "Communicate & document",
    "Collaborate / contribute",
    "Resume & interview",
  ];
  return (
    <div className="mt-12 overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--paper-card)] p-6">
      <svg viewBox="0 0 920 190" className="min-w-[760px]" width="100%">
        <line x1="40" y1="95" x2="880" y2="95" stroke="var(--line-strong)" strokeWidth="2" strokeDasharray="1 8" strokeLinecap="round" />
        {nodes.map((label, i) => {
          const x = 60 + i * 160;
          const up = i % 2 === 0;
          return (
            <g key={label}>
              <circle cx={x} cy="95" r="7" fill="var(--paper)" stroke="var(--blue)" strokeWidth="2.5" />
              <text x={x} y="95" dy="4" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--paper)" opacity="0">.</text>
              <path
                d={up ? `M${x} 88 L${x} 55` : `M${x} 102 L${x} 135`}
                stroke="var(--line-strong)"
                strokeWidth="1.5"
                strokeDasharray="3 4"
              />
              <foreignObject x={x - 65} y={up ? 8 : 140} width="130" height="46">
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    lineHeight: 1.3,
                    textAlign: "center",
                    color: "var(--ink)",
                    fontWeight: 600,
                  }}
                >
                  {String(i + 1).padStart(2, "0")} — {label}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
      <p className="font-display mt-1 text-center text-[11px] text-[var(--ink-soft)]">
        not strictly linear — you loop back through these constantly
      </p>
    </div>
  );
}

function LogicFlow() {
  const steps = ["Understand", "Small example", "Find pattern", "Pseudocode", "Code it"];
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--paper-dim)] p-6">
      <div className="flex min-w-[700px] items-center">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-14 w-28 items-center justify-center rounded-md border border-[var(--line-strong)] bg-[var(--paper)] px-2 text-center">
                <span className="font-display text-[12px] font-semibold">{step}</span>
              </div>
            </div>
            {i < steps.length - 1 && (
              <svg width="46" height="20" className="mx-1 text-[var(--ink-soft)]">
                <line x1="2" y1="10" x2="38" y2="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M32 5 L40 10 L32 15" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function UPERLoop() {
  const steps = [
    { label: "Understand", angle: -90 },
    { label: "Plan", angle: 0 },
    { label: "Execute", angle: 90 },
    { label: "Review", angle: 180 },
  ];
  const r = 90;
  const cx = 150;
  const cy = 130;
  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-[var(--line)] bg-[var(--paper-card)] p-8 sm:flex-row sm:items-center sm:justify-around">
      <svg viewBox="0 0 300 260" width="260" height="220">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line-strong)" strokeWidth="1.5" strokeDasharray="4 6" />
        <path d={`M${cx + r} ${cy - 8} l 10 8 l -10 8`} fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {steps.map((s) => {
          const rad = (s.angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          return (
            <g key={s.label}>
              <circle cx={x} cy={y} r="26" fill="var(--paper)" stroke="var(--blue)" strokeWidth="2" />
              <text
                x={x}
                y={y}
                dy="4"
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="10.5"
                fontWeight={700}
                fill="var(--ink)"
              >
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="max-w-xs space-y-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        <p><b className="text-[var(--ink)]">Understand</b> — restate the goal and constraints before anything else.</p>
        <p><b className="text-[var(--ink)]">Plan</b> — sketch the approach in pseudocode or on paper.</p>
        <p><b className="text-[var(--ink)]">Execute</b> — write the smallest working version first.</p>
        <p><b className="text-[var(--ink)]">Review</b> — test edge cases, then loop back if something's off.</p>
      </div>
    </div>
  );
}

function ProjectLadder() {
  const rungs = [
    { level: "Tutorial clone", note: "proves you can follow instructions" },
    { level: "CRUD app + auth", note: "proves you can wire a real stack" },
    { level: "Full-stack app solving a real problem", note: "proves judgment, not just execution" },
    { level: "Open-source contribution / collaboration", note: "proves you can work inside someone else's codebase" },
  ];
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--paper-dim)] p-6">
      <div className="space-y-3">
        {rungs.map((r, i) => (
          <div key={r.level} className="flex items-center gap-4">
            <span className="font-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--blue)] text-xs font-bold text-[var(--blue)]">
              {i + 1}
            </span>
            <div
              className="flex-1 rounded-md border border-[var(--line-strong)] bg-[var(--paper)] px-4 py-3"
              style={{ marginLeft: `${i * 18}px` }}
            >
              <p className="font-display text-[13px] font-semibold">{r.level}</p>
              <p className="mt-0.5 text-xs text-[var(--ink-soft)]">{r.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}