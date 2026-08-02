"use client";

/**
 * tutorials/git/page.tsx
 * ------------------------------------------------------------------
 * A self-contained Git & GitHub tutorial page.
 *
 * Dark mode: this page uses Tailwind's `dark:` variant throughout and
 * assumes your project has `darkMode: "class"` in tailwind.config, with
 * your existing header toggle adding/removing the `dark` class on
 * <html>. No toggle is implemented here on purpose — it already lives
 * in your header.
 *
 * Fonts: swap the <link> tags below for next/font if you prefer, e.g.
 *   import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google"
 * Kept as plain <link> here so this file drops into any App Router
 * project with zero extra config.
 * ------------------------------------------------------------------
 */

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function CommitMeta({
  hash,
  message,
  tag,
  color,
}: {
  hash: string;
  message: string;
  tag: string;
  color: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-xs sm:text-sm">
      <span
        className="rounded-full px-2.5 py-1 font-semibold tracking-wide text-white"
        style={{ backgroundColor: color }}
      >
        {tag}
      </span>
      <span className="text-neutral-400 dark:text-neutral-500">{hash}</span>
      <span className="text-neutral-500 dark:text-neutral-400">{message}</span>
    </div>
  );
}

/** The left-hand "commit graph" spine node that sits beside each section heading. */
function GraphNode({ color }: { color: string }) {
  return (
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
      <span
        className="absolute h-9 w-9 rounded-full opacity-15"
        style={{ backgroundColor: color }}
      />
      <span
        className="h-3 w-3 rounded-full ring-4 ring-white dark:ring-[#0B0E14]"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

function Section({
  id,
  hash,
  tag,
  tagColor,
  title,
  subtitle,
  children,
}: {
  id: string;
  hash: string;
  tag: string;
  tagColor: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative flex gap-4 sm:gap-6">
      {/* spine */}
      <div className="relative flex w-9 shrink-0 flex-col items-center">
        <div className="absolute top-9 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />
        <GraphNode color={tagColor} />
      </div>

      <div className="min-w-0 flex-1 pb-20">
        <CommitMeta hash={hash} tag={tag} color={tagColor} message="" />
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {subtitle}
          </p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 dark:border-neutral-800 dark:bg-white/[0.02] " +
        className
      }
    >
      {children}
    </div>
  );
}

function DiagramFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#0E121B]">
      <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-neutral-400 dark:border-neutral-800 dark:bg-white/[0.02] dark:text-neutral-500">
        {label}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cheat sheet data                                                    */
/* ------------------------------------------------------------------ */

const CHEAT_GROUPS: {
  title: string;
  color: string;
  rows: { cmd: string; desc: string }[];
}[] = [
  {
    title: "Setup",
    color: "#F05133",
    rows: [
      { cmd: "git init", desc: "Start a new repo in the current folder" },
      { cmd: "git clone <url>", desc: "Copy a remote repo to your machine" },
      { cmd: "git config --global user.name \"You\"", desc: "Set your commit author name" },
      { cmd: "git config --global user.email you@x.com", desc: "Set your commit author email" },
    ],
  },
  {
    title: "Everyday work",
    color: "#F05133",
    rows: [
      { cmd: "git status", desc: "See what's changed and what's staged" },
      { cmd: "git add <file>", desc: "Stage a file for the next commit" },
      { cmd: "git add .", desc: "Stage everything in the folder" },
      { cmd: "git commit -m \"msg\"", desc: "Save staged changes as a snapshot" },
      { cmd: "git diff", desc: "Show unstaged changes, line by line" },
      { cmd: "git log --oneline --graph", desc: "See history as a compact graph" },
    ],
  },
  {
    title: "Branching",
    color: "#0891B2",
    rows: [
      { cmd: "git branch", desc: "List branches" },
      { cmd: "git switch -c <name>", desc: "Create and move to a new branch" },
      { cmd: "git switch <name>", desc: "Move to an existing branch" },
      { cmd: "git merge <name>", desc: "Merge a branch into the current one" },
      { cmd: "git branch -d <name>", desc: "Delete a branch that's been merged" },
    ],
  },
  {
    title: "Working with GitHub",
    color: "#7C5CFC",
    rows: [
      { cmd: "git remote -v", desc: "List the remotes this repo knows about" },
      { cmd: "git push origin <branch>", desc: "Send your commits to GitHub" },
      { cmd: "git pull", desc: "Fetch + merge the latest from GitHub" },
      { cmd: "git fetch", desc: "Download changes without merging them" },
    ],
  },
  {
    title: "Undo & rescue",
    color: "#DC2626",
    rows: [
      { cmd: "git restore <file>", desc: "Discard unstaged changes to a file" },
      { cmd: "git restore --staged <file>", desc: "Unstage a file, keep the edits" },
      { cmd: "git commit --amend", desc: "Fix the message or add to the last commit" },
      { cmd: "git revert <hash>", desc: "Undo a commit by adding a new commit" },
      { cmd: "git reset --hard <hash>", desc: "Rewind the branch — use with care" },
      { cmd: "git reflog", desc: "A safety net: recover \"lost\" commits" },
    ],
  },
];

function CheatSheet() {
  const [query, setQuery] = useState("");

  const filtered = CHEAT_GROUPS.map((g) => ({
    ...g,
    rows: g.rows.filter(
      (r) =>
        r.cmd.toLowerCase().includes(query.toLowerCase()) ||
        r.desc.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((g) => g.rows.length > 0);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter commands… try “branch” or “undo”"
        className="mb-5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 font-mono text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-800 dark:bg-white/[0.03] dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-neutral-600"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-[#0E121B]"
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <h4 className="font-display text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                {group.title}
              </h4>
            </div>
            <dl className="space-y-2.5">
              {group.rows.map((r) => (
                <div key={r.cmd} className="flex flex-col gap-0.5">
                  <dt className="w-fit rounded-md bg-neutral-100 px-2 py-1 font-mono text-[12.5px] text-neutral-800 dark:bg-white/[0.06] dark:text-neutral-100">
                    {r.cmd}
                  </dt>
                  <dd className="pl-2 text-[12.5px] text-neutral-500 dark:text-neutral-400">
                    {r.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-6 text-center text-sm text-neutral-400">
            No commands match “{query}”.
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SVG diagrams                                                       */
/* ------------------------------------------------------------------ */

/** Working directory -> staging -> local repo -> remote repo */
function WorkflowDiagram() {
  const stages = [
    { label: "Working directory", sub: "you edit files", color: "#71717A", cmd: "git add" },
    { label: "Staging area", sub: "changes queued", color: "#F05133", cmd: "git commit" },
    { label: "Local repository", sub: "snapshot saved", color: "#0891B2", cmd: "git push" },
    { label: "Remote (GitHub)", sub: "shared with team", color: "#7C5CFC", cmd: "" },
  ];
  return (
    <svg viewBox="0 0 900 220" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
      {stages.map((s, i) => {
        const x = 30 + i * 220;
        return (
          <g key={s.label}>
            <rect
              x={x}
              y={60}
              width={170}
              height={100}
              rx={16}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
            />
            <circle cx={x + 26} cy={90} r={6} fill={s.color} />
            <text
              x={x + 85}
              y={102}
              textAnchor="middle"
              className="fill-neutral-800 dark:fill-neutral-100"
              style={{ fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}
            >
              {s.label}
            </text>
            <text
              x={x + 85}
              y={124}
              textAnchor="middle"
              className="fill-neutral-500 dark:fill-neutral-400"
              style={{ fontSize: 11.5, fontFamily: "monospace" }}
            >
              {s.sub}
            </text>
            {i < stages.length - 1 && (
              <>
                <line
                  x1={x + 172}
                  y1={110}
                  x2={x + 218}
                  y2={110}
                  stroke="currentColor"
                  className="text-neutral-300 dark:text-neutral-700"
                  strokeWidth={2}
                  markerEnd="url(#arrow)"
                />
                <text
                  x={x + 195}
                  y={98}
                  textAnchor="middle"
                  className="fill-neutral-500 dark:fill-neutral-400"
                  style={{ fontSize: 11, fontFamily: "monospace" }}
                >
                  {s.cmd}
                </text>
              </>
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className="fill-neutral-300 dark:fill-neutral-700" />
        </marker>
      </defs>
    </svg>
  );
}

/** Branch & merge sketch — main line + a feature branch curving off and back. */
function BranchDiagram() {
  const mainY = 150;
  const featY = 70;
  const commitsMain = [40, 160, 460, 700];
  const commitsFeat = [280, 380];
  return (
    <svg viewBox="0 0 780 220" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
      {/* main line */}
      <line x1={20} y1={mainY} x2={760} y2={mainY} stroke="#F05133" strokeWidth={3} />
      {/* branch out */}
      <path
        d={`M ${commitsMain[1]} ${mainY} C ${commitsMain[1] + 60} ${mainY}, ${commitsFeat[0] - 60} ${featY}, ${commitsFeat[0]} ${featY}`}
        fill="none"
        stroke="#0891B2"
        strokeWidth={3}
      />
      {/* branch line */}
      <line x1={commitsFeat[0]} y1={featY} x2={commitsFeat[1]} y2={featY} stroke="#0891B2" strokeWidth={3} />
      {/* merge back */}
      <path
        d={`M ${commitsFeat[1]} ${featY} C ${commitsFeat[1] + 60} ${featY}, ${commitsMain[2] - 60} ${mainY}, ${commitsMain[2]} ${mainY}`}
        fill="none"
        stroke="#0891B2"
        strokeWidth={3}
      />
      {/* main commits */}
      {commitsMain.map((x, i) => (
        <circle key={"m" + i} cx={x} cy={mainY} r={8} fill="#F05133" stroke="white" strokeWidth={2} />
      ))}
      {/* feature commits */}
      {commitsFeat.map((x, i) => (
        <circle key={"f" + i} cx={x} cy={featY} r={8} fill="#0891B2" stroke="white" strokeWidth={2} />
      ))}
      {/* labels */}
      <text x={20} y={mainY + 32} className="fill-neutral-500 dark:fill-neutral-400" style={{ fontSize: 12, fontFamily: "monospace" }}>main</text>
      <text x={commitsFeat[0]} y={featY - 16} className="fill-neutral-500 dark:fill-neutral-400" style={{ fontSize: 12, fontFamily: "monospace" }}>feature/login</text>
      <text x={commitsMain[1] - 10} y={mainY + 32} textAnchor="middle" className="fill-neutral-400 dark:fill-neutral-500" style={{ fontSize: 10.5, fontFamily: "monospace" }}>git switch -c feature/login</text>
      <text x={commitsMain[2] - 10} y={mainY + 32} textAnchor="middle" className="fill-neutral-400 dark:fill-neutral-500" style={{ fontSize: 10.5, fontFamily: "monospace" }}>git merge feature/login</text>
      <text x={commitsMain[3]} y={mainY + 32} textAnchor="middle" className="fill-neutral-400 dark:fill-neutral-500" style={{ fontSize: 10.5, fontFamily: "monospace" }}>continues…</text>
    </svg>
  );
}

/** Fork → clone → branch → commit → push → pull request → review → merge */
function CollabDiagram() {
  const steps = [
    { t: "Fork", c: "#7C5CFC" },
    { t: "Clone", c: "#7C5CFC" },
    { t: "Branch", c: "#0891B2" },
    { t: "Commit", c: "#F05133" },
    { t: "Push", c: "#F05133" },
    { t: "Pull Request", c: "#7C5CFC" },
    { t: "Review", c: "#7C5CFC" },
    { t: "Merge", c: "#16A34A" },
  ];
  const cols = 4;
  return (
    <svg viewBox="0 0 760 260" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
      {steps.map((s, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 40 + col * 180;
        const y = 40 + row * 140;
        const isLastInRow = col === cols - 1;
        const next = steps[i + 1];
        return (
          <g key={s.t}>
            <rect x={x} y={y} width={140} height={56} rx={12} fill="none" stroke={s.c} strokeWidth={2} />
            <text x={x + 70} y={y + 34} textAnchor="middle" className="fill-neutral-800 dark:fill-neutral-100" style={{ fontSize: 13, fontWeight: 700 }}>
              {s.t}
            </text>
            {next && !isLastInRow && (
              <line x1={x + 142} y1={y + 28} x2={x + 178} y2={y + 28} stroke="currentColor" className="text-neutral-300 dark:text-neutral-700" strokeWidth={2} markerEnd="url(#arrow2)" />
            )}
          </g>
        );
      })}
      {/* wrap-around connector row 1 -> row 2 */}
      <path
        d="M 580 68 C 700 68, 700 178, 560 178"
        fill="none"
        stroke="currentColor"
        className="text-neutral-300 dark:text-neutral-700"
        strokeWidth={2}
        markerEnd="url(#arrow2)"
      />
      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className="fill-neutral-300 dark:fill-neutral-700" />
        </marker>
      </defs>
    </svg>
  );
}

/** Git vs GitHub — engine vs. hosting platform */
function GitVsGithubDiagram() {
  return (
    <svg viewBox="0 0 700 240" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
      <rect x={20} y={30} width={290} height={180} rx={18} fill="none" stroke="#F05133" strokeWidth={2} />
      <text x={165} y={62} textAnchor="middle" className="fill-neutral-800 dark:fill-neutral-100" style={{ fontSize: 16, fontWeight: 800 }}>Git</text>
      <text x={165} y={82} textAnchor="middle" className="fill-neutral-500 dark:fill-neutral-400" style={{ fontSize: 11.5 }}>version control software</text>
      {["Runs on your computer", "Tracks every change locally", "Works with no internet"].map((t, i) => (
        <text key={t} x={165} y={112 + i * 24} textAnchor="middle" className="fill-neutral-600 dark:fill-neutral-300" style={{ fontSize: 11.5, fontFamily: "monospace" }}>{t}</text>
      ))}

      <rect x={390} y={30} width={290} height={180} rx={18} fill="none" stroke="#7C5CFC" strokeWidth={2} />
      <text x={535} y={62} textAnchor="middle" className="fill-neutral-800 dark:fill-neutral-100" style={{ fontSize: 16, fontWeight: 800 }}>GitHub</text>
      <text x={535} y={82} textAnchor="middle" className="fill-neutral-500 dark:fill-neutral-400" style={{ fontSize: 11.5 }}>hosting + collaboration platform</text>
      {["Stores repos in the cloud", "Pull requests, issues, review", "Where teams meet around code"].map((t, i) => (
        <text key={t} x={535} y={112 + i * 24} textAnchor="middle" className="fill-neutral-600 dark:fill-neutral-300" style={{ fontSize: 11.5, fontFamily: "monospace" }}>{t}</text>
      ))}

      <line x1={312} y1={120} x2={388} y2={120} stroke="currentColor" className="text-neutral-300 dark:text-neutral-700" strokeWidth={2} markerEnd="url(#arrow3)" />
      <line x1={388} y1={140} x2={312} y2={140} stroke="currentColor" className="text-neutral-300 dark:text-neutral-700" strokeWidth={2} markerEnd="url(#arrow3)" />
      <text x={350} y={110} textAnchor="middle" className="fill-neutral-400 dark:fill-neutral-500" style={{ fontSize: 10, fontFamily: "monospace" }}>push</text>
      <text x={350} y={158} textAnchor="middle" className="fill-neutral-400 dark:fill-neutral-500" style={{ fontSize: 10, fontFamily: "monospace" }}>pull</text>
      <defs>
        <marker id="arrow3" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className="fill-neutral-300 dark:fill-neutral-700" />
        </marker>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function GitTutorialPage() {
  return (
    <>
      {/* Fonts — swap for next/font if preferred */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <main className="min-h-screen bg-white text-neutral-900 transition-colors duration-300 dark:bg-[#0B0E14] dark:text-neutral-100">
        <style>{`
          .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
          main { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
          code, .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        `}</style>

        {/* ---------------- Hero ---------------- */}
        <header className="border-b border-neutral-200 px-6 py-16 dark:border-neutral-800 sm:px-10 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center gap-2 font-mono text-xs text-neutral-400 dark:text-neutral-500">
              <span className="rounded bg-neutral-100 px-2 py-1 dark:bg-white/[0.06]">/git</span>
              <span>·</span>
              <span>git log -p --oneline</span>
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Git &amp; GitHub,
              <br />
              <span style={{ color: "#F05133" }}>explained like a commit history.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              Every section below is written like an entry in a git log - because that's
              exactly what learning this tool feels like: small, ordered snapshots that
              build on each other. Scroll down the timeline, or jump straight to the{" "}
              <a href="#cheatsheet" className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-500 dark:decoration-neutral-700">
                cheat sheet
              </a>
              .
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                ["What is it", "#F05133"],
                ["Why it matters", "#F05133"],
                ["Core workflow", "#0891B2"],
                ["Branching", "#0891B2"],
                ["GitHub collab", "#7C5CFC"],
                ["Learning w/ AI", "#7C5CFC"],
                ["Cheat sheet", "#16A34A"],
                ["Gotchas", "#DC2626"],
              ].map(([label, color]) => (
                <span
                  key={label}
                  className="rounded-full border px-3 py-1 font-mono text-[11.5px]"
                  style={{ borderColor: color as string, color: color as string }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ---------------- Timeline body ---------------- */}
        <div className="mx-auto max-w-4xl px-6 pt-16 sm:px-10">
          {/* 1. What is Git & GitHub */}
          <Section
            id="what-is-it"
            hash="a1e93c0"
            tag="concept"
            tagColor="#F05133"
            title="What is Git? What is GitHub?"
            subtitle="Two different things that people mash together constantly — worth separating on day one."
          >
            <div className="space-y-4 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
              <p>
                <strong className="text-neutral-900 dark:text-neutral-100">Git</strong> is
                version-control software that runs on your machine. It takes snapshots of
                your project every time you tell it to (a <em>commit</em>), so you can
                rewind, compare, or branch off from any point in history — even with no
                internet connection at all.
              </p>
              <p>
                <strong className="text-neutral-900 dark:text-neutral-100">GitHub</strong>{" "}
                is a website built on top of Git. It hosts your repositories in the cloud
                and adds the social layer: pull requests, code review, issues, and a place
                for a team (or the whole open-source world) to work on the same codebase
                without emailing zip files back and forth.
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                Short version: Git is the engine, GitHub is one popular place to park the car.
                (GitLab and Bitbucket are the same idea, different lot.)
              </p>
            </div>
            <div className="mt-6">
              <DiagramFrame label="git vs github">
                <GitVsGithubDiagram />
              </DiagramFrame>
            </div>
          </Section>

          {/* 2. Why it's needed now */}
          <Section
            id="why-needed"
            hash="4f7b21d"
            tag="context"
            tagColor="#F05133"
            title="Why it's essential now"
            subtitle="Software is written by more people, in more places, at more speed than ever."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Teams are distributed", "People on the same project can be on different continents and time zones — there's no shared hard drive to edit."],
                ["Everything changes fast", "Multiple features, fixes, and experiments happen in parallel; branches let all of that coexist safely."],
                ["Mistakes are inevitable", "A wrong edit shouldn't mean lost work — history gives you an undo button for an entire project."],
                ["AI writes more code", "As AI tools generate and edit code alongside humans, a clear diff-and-review trail matters even more."],
              ].map(([t, d]) => (
                <Card key={t}>
                  <h4 className="font-display text-sm font-bold text-neutral-800 dark:text-neutral-100">{t}</h4>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">{d}</p>
                </Card>
              ))}
            </div>
          </Section>

          {/* 3. What if it didn't exist */}
          <Section
            id="what-if-not"
            hash="c02aa17"
            tag="counterfactual"
            tagColor="#DC2626"
            title="What if Git didn't exist?"
            subtitle="A quick look at how teams coped before, and what breaks without it."
          >
            <Card className="border-red-200 bg-red-50/40 dark:border-red-900/40 dark:bg-red-950/10">
              <ul className="space-y-3 text-[14px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                <li className="flex gap-2">
                  <span className="font-mono text-red-500">−</span>
                  <span>
                    Files named <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] dark:bg-white/[0.08]">final_v2_FINAL_reallyfinal.docx</code>{" "}
                    — because folders, not tools, were tracking versions.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-mono text-red-500">−</span>
                  <span>Two people editing the same file overwrite each other's work with no warning.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-mono text-red-500">−</span>
                  <span>There's no reliable way to try an experiment and throw it away without risking the working version.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-mono text-red-500">−</span>
                  <span>"Who changed this line, and why?" has no answer beyond asking around and hoping someone remembers.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-mono text-red-500">−</span>
                  <span>Open-source as we know it — millions of strangers contributing to the same project — basically doesn't scale.</span>
                </li>
              </ul>
            </Card>
          </Section>

          {/* 4. How it helps — workflow diagram */}
          <Section
            id="how-it-helps"
            hash="9d13ee2"
            tag="workflow"
            tagColor="#0891B2"
            title="How Git actually helps: the core workflow"
            subtitle="Every Git command you'll use daily moves a change through these four stages."
          >
            <DiagramFrame label="working directory → staging → local repo → remote">
              <WorkflowDiagram />
            </DiagramFrame>
            <p className="mt-4 text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              You edit files in your <strong>working directory</strong>. Running{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] dark:bg-white/[0.08]">git add</code>{" "}
              moves the changes you're happy with into <strong>staging</strong> — a
              holding area where you decide exactly what goes into the next snapshot.{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] dark:bg-white/[0.08]">git commit</code>{" "}
              saves that snapshot to your <strong>local repository</strong>, permanently,
              with a message explaining why. <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] dark:bg-white/[0.08]">git push</code>{" "}
              sends your commits to the <strong>remote</strong> — GitHub — where others can see and pull them.
            </p>
          </Section>

          {/* 5. Branching */}
          <Section
            id="branching"
            hash="7bb440a"
            tag="branching"
            tagColor="#0891B2"
            title="Branches: working in parallel, safely"
            subtitle="A branch is just a movable pointer to a commit — cheap to create, cheap to throw away."
          >
            <DiagramFrame label="main + feature/login, then merge">
              <BranchDiagram />
            </DiagramFrame>
            <p className="mt-4 text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              Instead of editing <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] dark:bg-white/[0.08]">main</code>{" "}
              directly, you branch off, build a feature or fix a bug in isolation, and
              merge back when it's ready. If the experiment doesn't work out, you delete
              the branch — <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] dark:bg-white/[0.08]">main</code> never
              even knew it happened.
            </p>
          </Section>

          {/* 6. GitHub collaboration */}
          <Section
            id="collaboration"
            hash="e21c883"
            tag="collaboration"
            tagColor="#7C5CFC"
            title="How GitHub turns Git into teamwork"
            subtitle="The fork → PR → review → merge loop is how most open-source and team code ships today."
          >
            <DiagramFrame label="fork → clone → branch → commit → push → pull request → review → merge">
              <CollabDiagram />
            </DiagramFrame>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Card>
                <h4 className="font-display text-sm font-bold text-neutral-800 dark:text-neutral-100">Pull Requests</h4>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  A proposal: "here's a branch, please review and merge it into main."
                  Comments, suggested edits, and approvals all happen right on the diff.
                </p>
              </Card>
              <Card>
                <h4 className="font-display text-sm font-bold text-neutral-800 dark:text-neutral-100">Issues</h4>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  A tracked to-do or bug report, linkable to the commits and PRs that
                  eventually resolve it — the paper trail for "why did we build this?"
                </p>
              </Card>
            </div>
          </Section>

          {/* 7. Learning with AI */}
          <Section
            id="learning-with-ai"
            hash="0af5910"
            tag="learn"
            tagColor="#7C5CFC"
            title="Learning Git & GitHub with AI"
            subtitle="An AI assistant is a genuinely good pairing for this subject — here's how to use one well."
          >
            <div className="space-y-3">
              {[
                ["Paste the error, not just the command", "Git's error messages are dense but literal. Paste the full output and ask what it means before trying a fix you found online."],
                ["Ask for the “why”, not just the “how”", "Instead of \"how do I undo a commit\", ask an AI to explain the difference between reset, revert, and restore for your exact situation — the right tool depends on whether you've already pushed."],
                ["Have it draft your commit messages", "Paste a diff and ask for a clear, conventional commit message — then edit it. It's a fast way to internalize what a good message looks like."],
                ["Use it to read a diagram of a diff", "Ask an AI to walk through git log --graph output line by line, or to describe in plain English what a merge conflict is actually disagreeing about."],
                ["Simulate scenarios before you risk them", "\"What happens if I run git reset --hard here?\" is a much safer question to ask first than to find out by doing."],
              ].map(([t, d]) => (
                <div key={t} className="flex gap-4 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "#7C5CFC" }} />
                  <div>
                    <h4 className="font-display text-sm font-bold text-neutral-800 dark:text-neutral-100">{t}</h4>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 8. Cheat sheet */}
          <Section
            id="cheatsheet"
            hash="55c9021"
            tag="reference"
            tagColor="#16A34A"
            title="Cheat sheet"
            subtitle="The commands you'll actually type, grouped by what you're trying to do. Filterable."
          >
            <CheatSheet />
          </Section>

          {/* 9. Important things to keep in mind */}
          <Section
            id="gotchas"
            hash="d418f6b"
            tag="gotchas"
            tagColor="#DC2626"
            title="Important things to keep in mind"
            subtitle="The handful of habits and warnings that save you from the worst Git afternoons."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Commit often, in small pieces", "Small commits are easy to review, easy to revert, and easy to explain later. One giant commit called \"stuff\" helps no one, including future you."],
                ["Write commit messages for a stranger", "\"fix bug\" tells no one anything. \"Fix null pointer when cart is empty\" tells the whole story without opening the diff."],
                ["`git reset --hard` deletes work", "It rewinds your branch and discards changes with no confirmation. Prefer `git revert` on shared branches, and know about `git reflog` as your safety net."],
                ["Never commit secrets", "API keys and passwords that reach a commit are in history forever, even if you delete the file in a later commit. Use a .gitignore and environment variables."],
                ["Pull before you push", "If someone else pushed first, your push will be rejected. `git pull` (or fetch + merge/rebase) brings you up to date before you try again."],
                ["A merge conflict isn't an error", "It just means two changes touched the same lines and Git wants a human to decide. Read both sides calmly — it's normal, not a sign you broke something."],
              ].map(([t, d]) => (
                <Card key={t} className="border-red-200/70 dark:border-red-900/30">
                  <h4 className="font-display text-sm font-bold text-neutral-800 dark:text-neutral-100">⚠ {t}</h4>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">{d}</p>
                </Card>
              ))}
            </div>
          </Section>
        </div>

        {/* ---------------- Footer ---------------- */}
        <footer className="border-t border-neutral-200 px-6 py-10 dark:border-neutral-800 sm:px-10">
          <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-4 font-mono text-xs text-neutral-400 dark:text-neutral-500 sm:flex-row sm:items-center">
            <span>HEAD -&gt; main, tutorials/git — you are here</span>
            <span>git commit -m "learned Git &amp; GitHub" --allow-empty</span>
          </div>
        </footer>
      </main>
    </>
  );
}