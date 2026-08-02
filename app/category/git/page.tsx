"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Github,
  Terminal,
  Layers,
  Users,
  Copy,
  Check,
  BookOpen,
  Boxes,
  Cloud,
  HardDrive,
  FileText,
  Zap,
  ArrowRight,
  History,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode, ComponentType } from "react";

/* ------------------------------------------------------------------ */
/*  Motion variants                                                    */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.06,
      ease: "easeOut",
    },
  }),
};

/* ------------------------------------------------------------------ */
/*  Terminal chrome wrapper (traffic-light header)                     */
/* ------------------------------------------------------------------ */

function TerminalChrome({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0d1117] overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        {label && (
          <span className="ml-2 text-xs font-mono text-black/50 dark:text-white/40">
            {label}
          </span>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Copyable code block                                                 */
/* ------------------------------------------------------------------ */

function CodeBlock({
  code,
  label,
  id,
  copiedId,
  onCopy,
}: {
  code: string;
  label?: string;
  id: string;
  copiedId: string | null;
  onCopy: (id: string, code: string) => void;
}) {
  const copied = copiedId === id;
  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0d1117]">
        <span className="text-[11px] font-mono text-black/50 dark:text-white/40">
          {label ?? "shell"}
        </span>
        <button
          onClick={() => onCopy(id, code)}
          className="flex items-center gap-1 text-[11px] font-mono text-black/50 dark:text-white/40 hover:text-amber-600 dark:hover:text-emerald-400 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" /> copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> copy
            </>
          )}
        </button>
      </div>
      <pre className="px-4 py-3 overflow-x-auto text-[13px] leading-relaxed font-mono text-black/80 dark:text-white/80">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagrams (inline SVG, theme-aware via currentColor + CSS classes)  */
/* ------------------------------------------------------------------ */

function GitFlowDiagram() {
  const stages = [
    { label: "Working Directory", sub: "edit files", icon: HardDrive },
    { label: "Staging Area", sub: "git add", icon: Layers },
    { label: "Local Repository", sub: "git commit", icon: GitCommit },
    { label: "Remote Repository", sub: "git push", icon: Cloud },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-2 items-stretch">
      {stages.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="flex sm:flex-col items-center gap-3 sm:gap-0">
            <div className="flex-1 sm:flex-none w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] p-4 flex flex-col items-center text-center gap-2">
              <div className="w-9 h-9 rounded-md flex items-center justify-center bg-amber-500/10 dark:bg-emerald-400/10 text-amber-600 dark:text-emerald-400">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-sm font-semibold">{s.label}</p>
              <p className="text-[11px] font-mono text-black/50 dark:text-white/40">
                {s.sub}
              </p>
            </div>
            {i < stages.length - 1 && (
              <div className="hidden sm:flex items-center justify-center py-1">
                <ArrowRight className="w-4 h-4 text-black/30 dark:text-white/25 rotate-90 sm:rotate-0" />
              </div>
            )}
            {i < stages.length - 1 && (
              <div className="sm:hidden flex items-center justify-center px-1">
                <ArrowRight className="w-4 h-4 text-black/30 dark:text-white/25" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function BranchDiagram() {
  return (
    <svg viewBox="0 0 640 220" className="w-full h-auto">
      <line
        x1="40"
        y1="110"
        x2="600"
        y2="110"
        stroke="currentColor"
        strokeWidth="2"
        className="text-black/15 dark:text-white/15"
      />
      <path
        d="M 180 110 C 260 110, 260 40, 340 40 L 480 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-amber-500 dark:text-emerald-400"
      />
      <path
        d="M 480 40 C 520 40, 520 110, 560 110"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-amber-500 dark:text-emerald-400"
      />

      {[
        [40, 110, "init"],
        [180, 110, "main"],
        [560, 110, "merge"],
        [600, 110, "main"],
      ].map(([cx, cy, label], idx) => (
        <g key={idx}>
          <circle
            cx={cx as number}
            cy={cy as number}
            r={7}
            fill="currentColor"
            className="text-black/70 dark:text-white/70"
          />
          <text
            x={cx as number}
            y={(cy as number) + 28}
            textAnchor="middle"
            className="fill-current text-black/60 dark:text-white/50"
            fontSize="11"
            fontFamily="monospace"
          >
            {label}
          </text>
        </g>
      ))}

      {[
        [340, 40, "feature/login"],
        [480, 40, "commit"],
      ].map(([cx, cy, label], idx) => (
        <g key={`f-${idx}`}>
          <circle
            cx={cx as number}
            cy={cy as number}
            r={7}
            fill="currentColor"
            className="text-amber-500 dark:text-emerald-400"
          />
          <text
            x={cx as number}
            y={(cy as number) - 14}
            textAnchor="middle"
            className="fill-current text-amber-600 dark:text-emerald-400"
            fontSize="11"
            fontFamily="monospace"
          >
            {label}
          </text>
        </g>
      ))}

      <text
        x={20}
        y={210}
        className="fill-current text-black/40 dark:text-white/30"
        fontSize="11"
        fontFamily="monospace"
      >
        git checkout -b feature/login → commits → git merge feature/login
      </text>
    </svg>
  );
}

function GithubWorkflowDiagram() {
  const steps = [
    { label: "Fork", icon: Boxes },
    { label: "Clone", icon: Cloud },
    { label: "Branch", icon: GitBranch },
    { label: "Commit", icon: GitCommit },
    { label: "Push", icon: ArrowRight },
    { label: "Pull Request", icon: GitPullRequest },
    { label: "Review & Merge", icon: GitMerge },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] pl-3 pr-4 py-1.5">
              <span className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-500/10 dark:bg-emerald-400/10 text-amber-600 dark:text-emerald-400">
                <Icon className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-medium whitespace-nowrap">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className="w-3.5 h-3.5 text-black/25 dark:text-white/20" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Topic content data                                                  */
/* ------------------------------------------------------------------ */

type TopicId =
  | "what-is-git"
  | "what-is-github"
  | "why"
  | "how-it-works"
  | "core-commands"
  | "branching"
  | "remote"
  | "github-workflow"
  | "practical"
  | "mastery";

interface Topic {
  id: TopicId;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const topics: Topic[] = [
  { id: "what-is-git", label: "What is Git?", icon: GitCommit },
  { id: "what-is-github", label: "What is GitHub?", icon: Github },
  { id: "why", label: "Why Git & GitHub?", icon: ShieldCheck },
  { id: "how-it-works", label: "How Git Works", icon: Layers },
  { id: "core-commands", label: "Core Commands", icon: Terminal },
  { id: "branching", label: "Branching & Merging", icon: GitBranch },
  { id: "remote", label: "Remote & Collaboration", icon: Cloud },
  { id: "github-workflow", label: "GitHub Workflow", icon: GitPullRequest },
  { id: "practical", label: "Practical Walkthrough", icon: Rocket },
  { id: "mastery", label: "Path to Mastery", icon: BookOpen },
];

/* ------------------------------------------------------------------ */
/*  Cheat sheet data                                                    */
/* ------------------------------------------------------------------ */

const cheatSheet: { group: string; items: { cmd: string; desc: string }[] }[] = [
  {
    group: "Setup & Config",
    items: [
      { cmd: "git init", desc: "Initialize a new repository" },
      { cmd: "git clone <url>", desc: "Copy a remote repo locally" },
      { cmd: 'git config --global user.name "Name"', desc: "Set your name" },
      { cmd: 'git config --global user.email "you@mail.com"', desc: "Set your email" },
    ],
  },
  {
    group: "Basic Workflow",
    items: [
      { cmd: "git status", desc: "Show changed / staged files" },
      { cmd: "git add <file>", desc: "Stage a file" },
      { cmd: "git add .", desc: "Stage everything" },
      { cmd: 'git commit -m "message"', desc: "Save a snapshot" },
      { cmd: "git log --oneline", desc: "View commit history" },
      { cmd: "git diff", desc: "Show unstaged changes" },
    ],
  },
  {
    group: "Branching & Merging",
    items: [
      { cmd: "git branch", desc: "List branches" },
      { cmd: "git checkout -b <name>", desc: "Create & switch to branch" },
      { cmd: "git switch <name>", desc: "Switch to existing branch" },
      { cmd: "git merge <branch>", desc: "Merge branch into current" },
      { cmd: "git branch -d <name>", desc: "Delete a merged branch" },
    ],
  },
  {
    group: "Remote & Collaboration",
    items: [
      { cmd: "git remote add origin <url>", desc: "Link a remote repo" },
      { cmd: "git push -u origin main", desc: "Push & track upstream" },
      { cmd: "git pull", desc: "Fetch + merge from remote" },
      { cmd: "git fetch", desc: "Download changes without merging" },
    ],
  },
  {
    group: "Undo & Fix Mistakes",
    items: [
      { cmd: "git restore <file>", desc: "Discard unstaged changes" },
      { cmd: "git reset --soft HEAD~1", desc: "Undo last commit, keep changes" },
      { cmd: "git revert <commit>", desc: "Create a new commit that undoes one" },
      { cmd: "git stash", desc: "Temporarily shelve changes" },
      { cmd: "git stash pop", desc: "Re-apply stashed changes" },
    ],
  },
  {
    group: "GitHub Specific",
    items: [
      { cmd: "gh repo clone <owner/repo>", desc: "Clone via GitHub CLI" },
      { cmd: "gh pr create", desc: "Open a pull request" },
      { cmd: "gh pr merge", desc: "Merge a pull request" },
      { cmd: "gh issue list", desc: "List repo issues" },
    ],
  },
];

const masteryStages = [
  {
    stage: "Beginner",
    icon: GitCommit,
    points: [
      "Install Git, set global config",
      "init, add, commit, status, log",
      "Understand working dir → staging → repo",
    ],
  },
  {
    stage: "Intermediate",
    icon: GitBranch,
    points: [
      "Branching, merging, resolving conflicts",
      "Push / pull / fetch with remotes",
      "Writing clear commit messages",
    ],
  },
  {
    stage: "Advanced",
    icon: History,
    points: [
      "Rebase vs merge, interactive rebase",
      "Cherry-pick, reflog, bisect for debugging",
      "Git hooks and .gitignore strategy",
    ],
  },
  {
    stage: "Team & GitHub",
    icon: Users,
    points: [
      "Fork → PR → code review workflow",
      "Protected branches & CI checks",
      "GitHub Actions, Issues, Projects",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Main page                                                           */
/* ------------------------------------------------------------------ */

export default function GitPage() {
  const [active, setActive] = useState<TopicId>("what-is-git");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e14] text-black/90 dark:text-white/90 transition-colors">
      {/* ---------------- Hero ---------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-emerald-400 mb-4"
        >
          <Terminal className="w-3.5 h-3.5" />
          Master git &amp; github
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
        >
          Master Git &amp; GitHub
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="text-black/60 dark:text-white/50 max-w-2xl leading-relaxed mb-8"
        >
          Version control is the backbone of every real-world codebase. This
          guide walks through what Git and GitHub actually are, why every
          team relies on them, how Git works under the hood, and gives you
          practical commands, diagrams and a cheat sheet you can come back
          to any time.
        </motion.p>

        <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}>
          <TerminalChrome label="~/codenfacts">
            <pre className="font-mono text-[13px] leading-relaxed">
              <span className="text-black/40 dark:text-white/30">$ </span>
              <span className="text-amber-600 dark:text-emerald-400">git init</span>
              {"\n"}Initialized empty Git repository{"\n\n"}
              <span className="text-black/40 dark:text-white/30">$ </span>
              <span className="text-amber-600 dark:text-emerald-400">git add .</span>
              {"\n"}
              <span className="text-black/40 dark:text-white/30">$ </span>
              <span className="text-amber-600 dark:text-emerald-400">
                git commit -m &quot;first commit&quot;
              </span>
              {"\n"}[main (root-commit) a1b2c3d] first commit
            </pre>
          </TerminalChrome>
        </motion.div>
      </section>

      {/* ---------------- Body: sidebar + content ---------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - mobile: horizontal scroll pills */}
          <nav className="md:w-60 shrink-0">
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0">
              {topics.map((t) => {
                const Icon = t.icon;
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActive(t.id)}
                    className={`flex items-center gap-2 whitespace-nowrap md:whitespace-normal text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      isActive
                        ? "bg-amber-500/10 dark:bg-emerald-400/10 border-amber-500/30 dark:border-emerald-400/30 text-amber-700 dark:text-emerald-400"
                        : "border-transparent text-black/60 dark:text-white/50 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content panel */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={active}
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#f7f8fa]/60 dark:bg-[#0d1117]/60 p-5 sm:p-8"
            >
              {active === "what-is-git" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight">What is Git?</h2>
                  <p className="text-black/70 dark:text-white/60 leading-relaxed">
                    Git is a distributed version control system. It tracks
                    every change made to your files over time, so you can see
                    exactly what changed, when, and by whom — and roll back
                    to any earlier point if something breaks. &quot;Distributed&quot;
                    means every developer has a full copy of the project
                    history on their own machine, not just on a central
                    server.
                  </p>
                  <p className="text-black/70 dark:text-white/60 leading-relaxed">
                    Git was created by Linus Torvalds in 2005 to manage the
                    Linux kernel&apos;s source code, and it has since become the
                    default version control tool across almost every
                    software team in the world.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3 pt-2">
                    {[
                      {
                        icon: History,
                        title: "Tracks history",
                        desc: "Every commit is a snapshot you can return to",
                      },
                      {
                        icon: Users,
                        title: "Enables teamwork",
                        desc: "Multiple people can work on the same code safely",
                      },
                      {
                        icon: HardDrive,
                        title: "Works offline",
                        desc: "Full history lives on your own machine",
                      },
                    ].map((f) => (
                      <div
                        key={f.title}
                        className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] p-4"
                      >
                        <f.icon className="w-4.5 h-4.5 text-amber-600 dark:text-emerald-400 mb-2" />
                        <p className="text-sm font-semibold mb-1">{f.title}</p>
                        <p className="text-xs text-black/55 dark:text-white/45 leading-relaxed">
                          {f.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {active === "what-is-github" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight">What is GitHub?</h2>
                  <p className="text-black/70 dark:text-white/60 leading-relaxed">
                    GitHub is a cloud platform that hosts Git repositories. Git
                    itself is just the version control engine that runs on
                    your computer — GitHub is where those repositories live
                    online, so teams can collaborate, review code, track
                    issues, and ship software together.
                  </p>
                  <p className="text-black/70 dark:text-white/60 leading-relaxed">
                    Think of it this way:{" "}
                    <span className="font-semibold text-black/80 dark:text-white/75">
                      Git is the tool, GitHub is the service built around it.
                    </span>{" "}
                    Alternatives like GitLab and Bitbucket exist too, but they
                    all rely on the same underlying Git engine.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    {[
                      {
                        icon: GitPullRequest,
                        title: "Pull requests",
                        desc: "Propose, review and discuss code changes before merging",
                      },
                      {
                        icon: ShieldCheck,
                        title: "Access control",
                        desc: "Manage who can read, write, or approve changes",
                      },
                      {
                        icon: Zap,
                        title: "GitHub Actions",
                        desc: "Automate tests and deployments (CI/CD)",
                      },
                      {
                        icon: FileText,
                        title: "Issues & Projects",
                        desc: "Track bugs, features and roadmaps alongside the code",
                      },
                    ].map((f) => (
                      <div
                        key={f.title}
                        className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] p-4 flex gap-3"
                      >
                        <f.icon className="w-4.5 h-4.5 text-amber-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold mb-0.5">{f.title}</p>
                          <p className="text-xs text-black/55 dark:text-white/45 leading-relaxed">
                            {f.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {active === "why" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight">
                    Why do you need Git &amp; GitHub?
                  </h2>
                  <p className="text-black/70 dark:text-white/60 leading-relaxed">
                    Without version control, teams end up emailing zip files
                    around, or overwriting each other&apos;s work in shared
                    folders named{" "}
                    <code className="font-mono text-xs bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">
                      final_v2_FINAL.js
                    </code>
                    . Git and GitHub solve real, everyday problems:
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Undo mistakes — jump back to any previous working version instantly",
                      "Work in parallel — multiple people edit the same codebase without overwriting each other",
                      "Review before merging — catch bugs and bad code through pull requests, not in production",
                      "Full audit trail — know exactly who changed what, and why, via commit messages",
                      "Back up your work — every clone is a full backup of the project history",
                      "Ship with confidence — automated tests (CI) run before code reaches users",
                    ].map((line) => (
                      <li
                        key={line}
                        className="flex gap-3 text-sm text-black/70 dark:text-white/60 leading-relaxed"
                      >
                        <ArrowRight className="w-4 h-4 text-amber-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {active === "how-it-works" && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold tracking-tight">How Git works</h2>
                  <p className="text-black/70 dark:text-white/60 leading-relaxed">
                    Every file in a Git project moves through four stages.
                    Understanding this flow is the key to understanding
                    almost every Git command.
                  </p>
                  <GitFlowDiagram />
                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    <CodeBlock
                      id="how-1"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                      label="stage a change"
                      code={`git add index.js\n# moves index.js into the staging area`}
                    />
                    <CodeBlock
                      id="how-2"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                      label="commit a snapshot"
                      code={`git commit -m "fix login bug"\n# saves staged changes to local history`}
                    />
                  </div>
                  <p className="text-xs text-black/50 dark:text-white/40 leading-relaxed">
                    Nothing leaves your machine until you run{" "}
                    <span className="font-mono">git push</span> — that&apos;s what
                    makes Git &quot;distributed&quot;.
                  </p>
                </div>
              )}

              {active === "core-commands" && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold tracking-tight">Core commands</h2>
                  <p className="text-black/70 dark:text-white/60 leading-relaxed">
                    These handful of commands cover the majority of daily
                    Git usage.
                  </p>
                  <div className="space-y-3">
                    <CodeBlock
                      id="core-1"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                      label="start a project"
                      code={`git init                 # start a new repo\ngit clone <url>          # copy an existing repo`}
                    />
                    <CodeBlock
                      id="core-2"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                      label="everyday cycle"
                      code={`git status               # what changed?\ngit add file.js          # stage a file\ngit commit -m "message"  # save a snapshot\ngit log --oneline        # view history`}
                    />
                    <CodeBlock
                      id="core-3"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                      label="inspect changes"
                      code={`git diff                 # unstaged changes\ngit diff --staged        # staged changes\ngit show <commit>        # details of one commit`}
                    />
                  </div>
                </div>
              )}

              {active === "branching" && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold tracking-tight">
                    Branching &amp; merging
                  </h2>
                  <p className="text-black/70 dark:text-white/60 leading-relaxed">
                    A branch is an independent line of work. You create a
                    branch to build a feature or fix a bug without touching{" "}
                    <span className="font-mono text-xs">main</span>, then
                    merge it back in once it&apos;s ready.
                  </p>
                  <TerminalChrome label="diagram">
                    <BranchDiagram />
                  </TerminalChrome>
                  <CodeBlock
                    id="branch-1"
                    copiedId={copiedId}
                    onCopy={handleCopy}
                    label="branch workflow"
                    code={`git checkout -b feature/login   # create + switch\n# ...make commits...\ngit checkout main               # switch back\ngit merge feature/login         # bring changes in\ngit branch -d feature/login     # clean up`}
                  />
                  <p className="text-xs text-black/50 dark:text-white/40 leading-relaxed">
                    If two branches change the same lines, Git flags a{" "}
                    <span className="font-mono">merge conflict</span> — you
                    manually pick which version to keep, then commit.
                  </p>
                </div>
              )}

              {active === "remote" && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold tracking-tight">
                    Remote &amp; collaboration
                  </h2>
                  <p className="text-black/70 dark:text-white/60 leading-relaxed">
                    A &quot;remote&quot; is a version of your repo hosted elsewhere —
                    usually on GitHub. These commands sync your local history
                    with it.
                  </p>
                  <CodeBlock
                    id="remote-1"
                    copiedId={copiedId}
                    onCopy={handleCopy}
                    label="connect & sync"
                    code={`git remote add origin https://github.com/user/repo.git\ngit push -u origin main   # upload + track branch\ngit pull                  # download + merge\ngit fetch                 # download only, no merge`}
                  />
                  <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] p-4 text-sm text-black/60 dark:text-white/50 leading-relaxed">
                    <span className="font-semibold text-black/80 dark:text-white/75">
                      pull
                    </span>{" "}
                    = fetch + merge in one step.{" "}
                    <span className="font-semibold text-black/80 dark:text-white/75">
                      fetch
                    </span>{" "}
                    lets you inspect incoming changes before merging them
                    yourself — safer on shared branches.
                  </div>
                </div>
              )}

              {active === "github-workflow" && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold tracking-tight">
                    GitHub collaboration workflow
                  </h2>
                  <p className="text-black/70 dark:text-white/60 leading-relaxed">
                    This is the standard flow for contributing to a shared
                    or open-source project on GitHub.
                  </p>
                  <TerminalChrome label="workflow">
                    <GithubWorkflowDiagram />
                  </TerminalChrome>
                  <CodeBlock
                    id="gh-1"
                    copiedId={copiedId}
                    onCopy={handleCopy}
                    label="contribute to a repo"
                    code={`git clone https://github.com/you/repo.git\ncd repo\ngit checkout -b fix/typo\n# make changes\ngit add .\ngit commit -m "fix: typo in README"\ngit push -u origin fix/typo\n# then open a Pull Request on GitHub`}
                  />
                </div>
              )}

              {active === "practical" && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold tracking-tight">
                    Practical walkthrough
                  </h2>
                  <p className="text-black/70 dark:text-white/60 leading-relaxed">
                    Scenario: you&apos;re contributing a new feature to a shared
                    repository as part of a team.
                  </p>
                  <ol className="space-y-4">
                    {[
                      { title: "Sync main", code: "git checkout main\ngit pull" },
                      {
                        title: "Create a feature branch",
                        code: "git checkout -b feature/dark-mode",
                      },
                      {
                        title: "Make changes & commit in small steps",
                        code: 'git add .\ngit commit -m "feat: add dark mode toggle"',
                      },
                      {
                        title: "Push your branch",
                        code: "git push -u origin feature/dark-mode",
                      },
                      { title: "Open a Pull Request", code: "gh pr create --fill" },
                      {
                        title: "Address review comments",
                        code: 'git add .\ngit commit -m "fix: review feedback"\ngit push',
                      },
                      {
                        title: "Merge & clean up",
                        code: "gh pr merge --squash\ngit branch -d feature/dark-mode",
                      },
                    ].map((step, idx) => (
                      <li key={step.title} className="flex gap-4">
                        <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold bg-amber-500/10 dark:bg-emerald-400/10 text-amber-700 dark:text-emerald-400">
                          {idx + 1}
                        </span>
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-semibold pt-1">{step.title}</p>
                          <CodeBlock
                            id={`practical-${idx}`}
                            copiedId={copiedId}
                            onCopy={handleCopy}
                            code={step.code}
                          />
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {active === "mastery" && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold tracking-tight">Path to mastery</h2>
                  <p className="text-black/70 dark:text-white/60 leading-relaxed">
                    Git rewards depth. Here&apos;s a rough progression from first
                    commit to confidently working in a team on GitHub.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {masteryStages.map((s) => (
                      <div
                        key={s.stage}
                        className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] p-4"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-7 h-7 rounded-md flex items-center justify-center bg-amber-500/10 dark:bg-emerald-400/10 text-amber-600 dark:text-emerald-400">
                            <s.icon className="w-4 h-4" />
                          </span>
                          <p className="text-sm font-semibold">{s.stage}</p>
                        </div>
                        <ul className="space-y-1.5">
                          {s.points.map((p) => (
                            <li
                              key={p}
                              className="text-xs text-black/55 dark:text-white/45 leading-relaxed flex gap-2"
                            >
                              <span className="text-amber-600 dark:text-emerald-400">·</span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- Cheat sheet ---------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-emerald-400 mb-2">
            <FileText className="w-3.5 h-3.5" />
            reference
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Git &amp; GitHub cheat sheet
          </h2>
          <p className="text-black/60 dark:text-white/50 mt-2 max-w-2xl">
            The commands you&apos;ll reach for most often, grouped by task.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cheatSheet.map((group, gi) => (
            <motion.div
              key={group.group}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={gi}
              variants={fadeUp}
              className="rounded-xl border border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0d1117] overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20">
                <p className="text-sm font-semibold">{group.group}</p>
              </div>
              <ul className="p-3 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.cmd} className="text-xs">
                    <code className="block font-mono text-[12px] text-amber-700 dark:text-emerald-400 bg-white dark:bg-[#0a0e14] border border-black/10 dark:border-white/10 rounded px-2 py-1 mb-1 overflow-x-auto whitespace-pre">
                      {item.cmd}
                    </code>
                    <span className="text-black/55 dark:text-white/45 leading-snug">
                      {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- Comparison table ---------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
        >
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Git vs GitHub, at a glance
          </h2>
          <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f7f8fa] dark:bg-[#0d1117] text-left">
                  <th className="px-4 py-3 font-semibold border-b border-black/10 dark:border-white/10">
                    Aspect
                  </th>
                  <th className="px-4 py-3 font-semibold border-b border-black/10 dark:border-white/10">
                    Git
                  </th>
                  <th className="px-4 py-3 font-semibold border-b border-black/10 dark:border-white/10">
                    GitHub
                  </th>
                </tr>
              </thead>
              <tbody className="[&>tr:nth-child(even)]:bg-[#f7f8fa]/50 dark:[&>tr:nth-child(even)]:bg-[#0d1117]/50">
                {[
                  ["What it is", "A version control tool", "A cloud hosting platform for Git repos"],
                  ["Runs where", "On your local machine", "In the cloud, accessed via browser/CLI"],
                  ["Needs internet?", "No", "Yes, for hosting & collaboration features"],
                  ["Core unit", "Commit", "Repository, Pull Request, Issue"],
                  ["Collaboration", "Manual (patches, shared servers)", "Built-in: PRs, reviews, permissions"],
                  ["Alternatives", "Mercurial, SVN", "GitLab, Bitbucket"],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-4 py-3 border-b border-black/5 dark:border-white/5 ${
                          ci === 0
                            ? "font-medium text-black/80 dark:text-white/75"
                            : "text-black/60 dark:text-white/50"
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
        </motion.div>
      </section>
    </div>
  );
}