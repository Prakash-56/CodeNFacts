import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });

/* ------------------------------------------------------------------ */
/*  Shared tokens (kept consistent with /courses/system-design)        */
/* ------------------------------------------------------------------ */

const TOKENS = {
  "--c-blue": "#2563EB",
  "--c-violet": "#7C3AED",
  "--c-emerald": "#059669",
  "--c-orange": "#EA580C",
  "--c-rose": "#E11D48",
  "--c-cyan": "#0891B2",
  "--c-amber": "#D97706",
} as React.CSSProperties;

/* ------------------------------------------------------------------ */
/*  Content                                                             */
/* ------------------------------------------------------------------ */

const whyTutorials = [
  {
    title: "Trial and error is slow",
    accent: "var(--c-blue)",
    text: "Figuring everything out alone from scattered docs and blog posts costs weeks that a structured path covers in days.",
  },
  {
    title: "You need a feedback loop",
    accent: "var(--c-violet)",
    text: "Without checkpoints, it's easy to practice the wrong habits for months before anyone tells you.",
  },
  {
    title: "Motivation needs a map",
    accent: "var(--c-emerald)",
    text: "A visible path — what's next, how far you've come — keeps you going long after day-one enthusiasm fades.",
  },
  {
    title: "Real skill needs real constraints",
    accent: "var(--c-orange)",
    text: "Deadlines, edge cases, and broken builds teach things a tidy 'follow along' lesson never will.",
  },
];

const comparisonRows: [string, string, string][] = [
  ["What you do", "Watch someone else code", "Write, break, and fix your own code"],
  ["Feedback", "None — you find out later, if ever", "Immediate — your build either works or it doesn't"],
  ["Retention", "Fades within days", "Sticks because your hands did the work"],
  ["Output", "A completed video", "A working project in your portfolio"],
  ["Confidence", "Illusion of competence", "Verified, tested competence"],
];

const pipelineSteps = [
  "Concept — the idea, in plain language, no jargon first",
  "Guided build — we build the first piece together, line by line",
  "Checkpoint — a small task to prove the idea landed",
  "Independent challenge — you extend it with no hand-holding",
  "Ship — the checkpoint becomes a real, portfolio-ready project",
];

type TrackStatus = "In production" | "Drafting curriculum" | "Planned";

const tracks: { name: string; status: TrackStatus; blurb: string; accent: string }[] = [
  { name: "Web Development Foundations", status: "In production", blurb: "HTML, CSS, JS, and your first three deployed projects.", accent: "var(--c-blue)" },
  { name: "Backend & APIs", status: "Drafting curriculum", blurb: "Build and ship real services, not toy endpoints.", accent: "var(--c-emerald)" },
  { name: "System Design Projects", status: "Drafting curriculum", blurb: "Take the concepts in our System Design notes and actually build them.", accent: "var(--c-violet)" },
  { name: "Data Structures & Algorithms", status: "Planned", blurb: "Problem sets tied to projects, not isolated puzzles.", accent: "var(--c-orange)" },
  { name: "DevOps & Deployment", status: "Planned", blurb: "Docker, CI/CD, and shipping your projects like a team would.", accent: "var(--c-cyan)" },
];

const STATUS_STYLE: Record<TrackStatus, string> = {
  "In production": "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  "Drafting curriculum": "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Planned: "border-slate-400/40 bg-slate-400/10 text-slate-600 dark:text-slate-400",
};

const cheatSheets = [
  {
    title: "Picking your first project",
    headers: ["Ask yourself", "Green light", "Red flag"],
    rows: [
      ["Can I explain it in one sentence?", "Yes, clearly", "You need three tries"],
      ["Is it slightly too hard?", "Just past your comfort zone", "Miles beyond it"],
      ["Will you use or show it?", "Yes — real motivation", "No one will ever see it"],
    ],
  },
  {
    title: "Watching vs building",
    headers: ["Signal", "You're watching", "You're building"],
    rows: [
      ["When stuck", "You rewind the video", "You read the error message"],
      ["Typing", "Copy-pasted", "Typed from your own head"],
      ["After a week", "Can't rebuild it", "Can rebuild it from memory"],
    ],
  },
];

const importantTips = [
  "Struggling for 20–30 minutes before looking something up is where most real learning happens — don't skip that discomfort.",
  "Copy-typing a tutorial isn't the same as building it. Close the reference and try from memory before you check.",
  "Ship something small every week. A finished small project beats an unfinished ambitious one, every time.",
  "Read error messages fully before searching for them. Half the time the fix is in the message itself.",
  "Track progress by what you can build unaided, not by how many lessons you've watched.",
  "Getting stuck isn't a sign you're bad at this — it's the actual mechanism by which you get better.",
];

/* ------------------------------------------------------------------ */
/*  Building blocks                                                    */
/* ------------------------------------------------------------------ */

function SectionEyebrow({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: accent }}>
      <span className="inline-block h-[6px] w-[6px] rounded-full" style={{ backgroundColor: accent }} />
      {children}
    </div>
  );
}

function DiagramBox({ label, art }: { label: string; art: string[] }) {
  return (
    <div className="relative my-4 rounded-sm border border-slate-300 bg-[linear-gradient(to_right,rgba(37,99,235,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.06)_1px,transparent_1px)] bg-[size:16px_16px] p-4 dark:border-slate-700 dark:bg-[linear-gradient(to_right,rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.06)_1px,transparent_1px)]">
      <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-blue-500/60 dark:border-cyan-400/60" />
      <span className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-blue-500/60 dark:border-cyan-400/60" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-blue-500/60 dark:border-cyan-400/60" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-blue-500/60 dark:border-cyan-400/60" />
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-400">
        Fig — {label}
      </div>
      <pre className="overflow-x-auto font-mono text-[13px] leading-[1.5] text-slate-700 dark:text-slate-300">
        {art.join("\n")}
      </pre>
    </div>
  );
}

function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-sm border border-slate-200 dark:border-slate-800">
      <table className="w-full border-collapse text-left text-[13.5px]">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900">
            {headers.map((h) => (
              <th key={h} className="border-b border-slate-200 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-950 dark:even:bg-slate-900/40">
              {row.map((cell, j) => (
                <td key={j} className="border-b border-slate-100 px-3 py-2 text-slate-700 dark:border-slate-900 dark:text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function TutorialsPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-white font-[var(--font-body)] text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100`}
      style={TOKENS}
    >
      {/* ---------------------------------------------------------- */}
      {/* Hero — coming soon                                          */}
      {/* ---------------------------------------------------------- */}
      <header className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(37,99,235,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
            <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-amber-500" />
            Coming soon - in active production
          </div>
          <h1 className="max-w-3xl font-[var(--font-display)] text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            Tutorials, built to be
            <br />
            <span className="text-blue-600 dark:text-cyan-400">built along with.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-slate-600 dark:text-slate-400">
            We're structuring every tutorial track from the ground up - concept by concept,
            project by project - instead of rushing out another set of watch-and-forget videos.
            Here's what's coming, and why we're building it this way.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-slate-300 px-4 py-2 font-mono text-[13px] text-slate-600 dark:border-slate-700 dark:text-slate-400">
              First track ships soon - bookmark this page
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-20 px-6 py-16">
        {/* ---------------------------------------------------- */}
        {/* Why tutorials                                         */}
        {/* ---------------------------------------------------- */}
        <section id="why">
          <SectionEyebrow accent="var(--c-blue)">Why tutorials, at all</SectionEyebrow>
          <h2 className="mb-6 max-w-2xl font-[var(--font-display)] text-2xl font-medium sm:text-3xl">
            Reading docs teaches you facts. Tutorials teach you the order to use them in.
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {whyTutorials.map((w) => (
              <div
                key={w.title}
                className="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40"
                style={{ borderLeftWidth: "3px", borderLeftColor: w.accent }}
              >
                <div className="mb-1.5 font-[var(--font-display)] text-[16px] font-medium" style={{ color: w.accent }}>
                  {w.title}
                </div>
                <p className="text-[14.5px] leading-relaxed text-slate-600 dark:text-slate-400">{w.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* Projects over video lessons                           */}
        {/* ---------------------------------------------------- */}
        <section id="philosophy">
          <SectionEyebrow accent="var(--c-violet)">Our stance</SectionEyebrow>
          <h2 className="mb-3 max-w-2xl font-[var(--font-display)] text-2xl font-medium sm:text-3xl">
            Projects first. Video is the least of it.
          </h2>
          <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            A video lesson can explain a concept, but it can't tell you whether you actually
            learned it. Every tutorial we build is anchored to a project you ship yourself —
            watching is the smallest part of the process, not the whole of it.
          </p>
          <TableBlock headers={["", "Video-only lessons", "Our approach"]} rows={comparisonRows} />
        </section>

        {/* ---------------------------------------------------- */}
        {/* Anatomy of a tutorial                                 */}
        {/* ---------------------------------------------------- */}
        <section id="anatomy">
          <SectionEyebrow accent="var(--c-emerald)">How a tutorial is built</SectionEyebrow>
          <h2 className="mb-3 max-w-2xl font-[var(--font-display)] text-2xl font-medium sm:text-3xl">
            Every module follows the same shape.
          </h2>
          <p className="mb-2 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            The video or reading is just the first step - the module isn't done until you've
            shipped something of your own.
          </p>
          <DiagramBox
            label="the anatomy of one tutorial module"
            art={[
              "  Concept",
              "     |",
              "  Guided build",
              "     |",
              "  Checkpoint  ─ are you actually following?",
              "     |",
              "  Independent challenge  ─ no hand-holding",
              "     |",
              "  Shipped project  ─ goes in your portfolio",
            ]}
          />
          <ol className="mt-4 space-y-2">
            {pipelineSteps.map((step, i) => (
              <li key={step} className="flex items-start gap-3 text-[14.5px] text-slate-700 dark:text-slate-300">
                <span className="mt-0.5 font-mono text-[12px] text-emerald-600 dark:text-emerald-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------- */}
        {/* Tracks — structured, coming soon                      */}
        {/* ---------------------------------------------------- */}
        <section id="tracks">
          <SectionEyebrow accent="var(--c-orange)">What's in production</SectionEyebrow>
          <h2 className="mb-3 max-w-2xl font-[var(--font-display)] text-2xl font-medium sm:text-3xl">
            The tracks taking shape right now.
          </h2>
          <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            Nothing here is a placeholder - every track is being scoped, sequenced, and turned
            into real projects before a single lesson goes live.
          </p>
          <div className="space-y-3">
            {tracks.map((t) => (
              <div
                key={t.name}
                className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40 sm:flex-row sm:items-center sm:justify-between"
                style={{ borderLeftWidth: "3px", borderLeftColor: t.accent }}
              >
                <div>
                  <div className="font-[var(--font-display)] text-[15px] font-medium text-slate-900 dark:text-slate-100">
                    {t.name}
                  </div>
                  <div className="text-[13.5px] text-slate-500 dark:text-slate-400">{t.blurb}</div>
                </div>
                <span className={`inline-block w-fit shrink-0 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${STATUS_STYLE[t.status]}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* Cheat sheets                                          */}
        {/* ---------------------------------------------------- */}
        <section id="cheat-sheets">
          <SectionEyebrow accent="var(--c-amber)">Cheat sheets</SectionEyebrow>
          <h2 className="mb-6 max-w-2xl font-[var(--font-display)] text-2xl font-medium sm:text-3xl">
            Quick references for while you wait.
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {cheatSheets.map((sheet) => (
              <div key={sheet.title} className="rounded-md border border-amber-500/30 bg-amber-500/[0.04] p-4 dark:bg-amber-400/[0.04]">
                <div className="mb-2 font-[var(--font-display)] text-[15px] font-medium text-amber-700 dark:text-amber-400">
                  {sheet.title}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-[12.5px]">
                    <thead>
                      <tr>
                        {sheet.headers.map((h) => (
                          <th key={h} className="border-b border-amber-500/25 pb-1.5 pr-2 font-mono text-[10px] uppercase tracking-wider text-amber-700/80 dark:text-amber-400/80">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sheet.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className="border-b border-amber-500/10 py-1.5 pr-2 align-top text-slate-700 dark:text-slate-300">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* Important things to keep in mind                      */}
        {/* ---------------------------------------------------- */}
        <section id="important">
          <SectionEyebrow accent="var(--c-rose)">Important things to keep in mind</SectionEyebrow>
          <h2 className="mb-6 max-w-2xl font-[var(--font-display)] text-2xl font-medium sm:text-3xl">
            How to actually get the value out of a tutorial.
          </h2>
          <div className="space-y-3">
            {importantTips.map((tip, i) => (
              <div key={i} className="flex gap-3 rounded-md border border-rose-500/25 bg-rose-500/[0.04] p-4 dark:bg-rose-400/[0.04]">
                <span className="font-mono text-[12px] text-rose-600 dark:text-rose-400">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-[14.5px] leading-relaxed text-slate-700 dark:text-slate-300">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* Closing                                               */}
        {/* ---------------------------------------------------- */}
        <section className="rounded-md border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/40">
          <div className="font-[var(--font-display)] text-xl font-medium text-slate-900 dark:text-slate-100">
            Structured tracks, real projects - landing soon.
          </div>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-slate-500 dark:text-slate-400">
            We'd rather ship one track done right than five done fast. Check back for the first
            release.
          </p>
        </section>

        <footer className="border-t border-slate-200 pt-8 text-[13px] text-slate-400 dark:border-slate-800 dark:text-slate-600">
          Tutorials · currently in structured production - project-first, always.
        </footer>
      </main>
    </div>
  );
}