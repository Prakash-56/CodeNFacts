"use client";

import { useState } from "react";
import {
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  GitFork,
  Terminal,
  AlertTriangle,
  ShieldAlert,
  Lightbulb,
  Info,
  Tags,
  Archive,
  RotateCcw,
  History,
  Github,
  Settings,
  FolderGit2,
  Workflow,
  Copy,
  Check,
} from "lucide-react";

/**
 * /learn/git-cheatsheet
 *
 * A self-contained Git & GitHub reference page.
 * - Light mode: white background.
 * - Dark mode: driven by the `dark` class on <html> (e.g. via next-themes),
 *   which your header's theme toggle already controls — this page just
 *   reacts to it with `dark:` Tailwind variants. No toggle logic lives here.
 *
 * Drop this file at app/learn/git-cheatsheet/page.tsx (App Router) and make
 * sure lucide-react is installed: npm install lucide-react
 */

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard API unavailable — fail silently, button just won't confirm.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy command"
      className="shrink-0 rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function Cmd({ cmd, desc }: { cmd: string; desc: string }) {
  return (
    <div className="group flex items-start justify-between gap-3 border-b border-neutral-100 py-2.5 last:border-0 dark:border-neutral-800/70">
      <div className="min-w-0">
        <code className="block break-all rounded bg-neutral-50 px-2 py-1 font-mono text-[13px] text-neutral-800 dark:bg-neutral-800/60 dark:text-emerald-300">
          {cmd}
        </code>
        <p className="mt-1.5 text-[13px] leading-snug text-neutral-500 dark:text-neutral-400">
          {desc}
        </p>
      </div>
      <CopyButton text={cmd} />
    </div>
  );
}

function CommandGroup({
  title,
  icon,
  accent = "emerald",
  commands,
}: {
  title: string;
  icon: React.ReactNode;
  accent?: "emerald" | "amber" | "rose" | "indigo";
  commands: { cmd: string; desc: string }[];
}) {
  const accentMap: Record<string, string> = {
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
    rose: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10",
    indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10",
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-1 flex items-center gap-2.5">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentMap[accent]}`}>
          {icon}
        </span>
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      </div>
      <div>
        {commands.map((c) => (
          <Cmd key={c.cmd} cmd={c.cmd} desc={c.desc} />
        ))}
      </div>
    </div>
  );
}

function Callout({
  type,
  title,
  children,
}: {
  type: "tip" | "warning" | "danger" | "info";
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    tip: {
      wrap: "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-500/[0.07]",
      icon: "text-emerald-600 dark:text-emerald-400",
      Icon: Lightbulb,
    },
    info: {
      wrap: "border-indigo-200 bg-indigo-50 dark:border-indigo-900/60 dark:bg-indigo-500/[0.07]",
      icon: "text-indigo-600 dark:text-indigo-400",
      Icon: Info,
    },
    warning: {
      wrap: "border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-500/[0.07]",
      icon: "text-amber-600 dark:text-amber-400",
      Icon: AlertTriangle,
    },
    danger: {
      wrap: "border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-500/[0.07]",
      icon: "text-rose-600 dark:text-rose-400",
      Icon: ShieldAlert,
    },
  }[type];

  const { Icon } = styles;

  return (
    <div className={`flex gap-3 rounded-lg border p-4 ${styles.wrap}`}>
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${styles.icon}`} />
      <div>
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</p>
        <div className="mt-1 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {children}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  id,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  id: string;
}) {
  return (
    <div id={id} className="scroll-mt-24 mb-6">
      <p className="font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Diagrams (inline SVG so the whole page is one file, no image assets)
// ---------------------------------------------------------------------------

function ThreeTreesDiagram() {
  const box = "fill-white dark:fill-neutral-900 stroke-neutral-300 dark:stroke-neutral-700";
  const label = "fill-neutral-700 dark:fill-neutral-200 font-semibold";
  const sub = "fill-neutral-400 dark:fill-neutral-500";

  return (
    <svg viewBox="0 0 780 220" className="h-auto w-full" role="img" aria-label="Diagram of the Git working directory, staging area, local repository, and remote repository">
      {/* Working Directory */}
      <rect x="10" y="50" width="170" height="110" rx="12" className={box} strokeWidth="1.5" />
      <text x="95" y="95" textAnchor="middle" className={`${label} text-[13px]`}>Working</text>
      <text x="95" y="112" textAnchor="middle" className={`${label} text-[13px]`}>Directory</text>
      <text x="95" y="135" textAnchor="middle" className={`${sub} text-[11px]`}>your edited files</text>

      {/* Staging Area */}
      <rect x="230" y="50" width="170" height="110" rx="12" className={box} strokeWidth="1.5" />
      <text x="315" y="95" textAnchor="middle" className={`${label} text-[13px]`}>Staging Area</text>
      <text x="315" y="112" textAnchor="middle" className={`${label} text-[13px]`}>(Index)</text>
      <text x="315" y="135" textAnchor="middle" className={`${sub} text-[11px]`}>changes marked to commit</text>

      {/* Local Repository */}
      <rect x="450" y="50" width="170" height="110" rx="12" className={box} strokeWidth="1.5" />
      <text x="535" y="95" textAnchor="middle" className={`${label} text-[13px]`}>Local</text>
      <text x="535" y="112" textAnchor="middle" className={`${label} text-[13px]`}>Repository</text>
      <text x="535" y="135" textAnchor="middle" className={`${sub} text-[11px]`}>committed history (.git)</text>

      {/* Remote Repository */}
      <rect x="600" y="0" width="0" height="0" />
      <g transform="translate(660,0)">
        <rect x="0" y="65" width="120" height="90" rx="12" className="fill-emerald-50 dark:fill-emerald-500/10 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1.5" />
        <text x="60" y="105" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 font-semibold text-[12px]">Remote</text>
        <text x="60" y="122" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 font-semibold text-[12px]">(GitHub)</text>
      </g>

      {/* Arrows forward */}
      <g className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#arrow)">
        <line x1="182" y1="90" x2="228" y2="90" />
        <line x1="402" y1="90" x2="448" y2="90" />
        <line x1="622" y1="95" x2="658" y2="100" />
      </g>
      <text x="205" y="80" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400 font-mono text-[10px]">git add</text>
      <text x="425" y="80" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400 font-mono text-[10px]">git commit</text>
      <text x="640" y="80" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400 font-mono text-[10px]">git push</text>

      {/* Arrows backward */}
      <g className="stroke-indigo-400" strokeWidth="2" markerEnd="url(#arrowBack)">
        <line x1="658" y1="130" x2="622" y2="125" />
      </g>
      <text x="640" y="150" textAnchor="middle" className="fill-indigo-500 dark:fill-indigo-400 font-mono text-[10px]">git pull / fetch</text>

      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" className="fill-emerald-500" />
        </marker>
        <marker id="arrowBack" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" className="fill-indigo-400" />
        </marker>
      </defs>
    </svg>
  );
}

function BranchWorkflowDiagram() {
  return (
    <svg viewBox="0 0 780 200" className="h-auto w-full" role="img" aria-label="Diagram of a feature branch being created from main, developed, and merged back via a pull request">
      {/* main line */}
      <line x1="30" y1="100" x2="750" y2="100" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="2" />
      <text x="30" y="80" className="fill-neutral-500 dark:fill-neutral-400 font-mono text-[11px]">main</text>

      {/* main commits */}
      {[80, 220, 620, 720].map((x, i) => (
        <circle key={i} cx={x} cy={100} r={7} className="fill-neutral-400 dark:fill-neutral-500" />
      ))}

      {/* feature branch curve */}
      <path
        d="M220,100 C 300,40 340,40 420,40 C 480,40 520,40 560,40 C 610,40 610,80 620,100"
        fill="none"
        className="stroke-indigo-400 dark:stroke-indigo-500"
        strokeWidth="2"
      />
      <text x="380" y="25" textAnchor="middle" className="fill-indigo-500 dark:fill-indigo-400 font-mono text-[11px]">feature/login</text>

      {/* feature commits */}
      {[300, 420, 540].map((x, i) => (
        <circle key={i} cx={x} cy={40} r={6} className="fill-indigo-400 dark:fill-indigo-500" />
      ))}

      {/* merge point */}
      <circle cx="620" cy="100" r="8" className="fill-emerald-500" />
      <text x="620" y="130" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400 font-mono text-[11px]">merge (PR #42)</text>

      {/* tag on release commit */}
      <rect x="700" y="105" width="46" height="18" rx="4" className="fill-amber-100 dark:fill-amber-500/20 stroke-amber-400" strokeWidth="1" />
      <text x="723" y="118" textAnchor="middle" className="fill-amber-700 dark:fill-amber-300 font-mono text-[9px]">v1.2.0</text>

      <text x="80" y="130" textAnchor="middle" className="fill-neutral-400 dark:fill-neutral-500 font-mono text-[10px]">initial</text>
      <text x="220" y="130" textAnchor="middle" className="fill-neutral-400 dark:fill-neutral-500 font-mono text-[10px]">branch point</text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GitCheatsheetPage() {
  const nav = [
    { id: "areas", label: "The Three Trees" },
    { id: "setup", label: "Setup" },
    { id: "everyday", label: "Everyday Commands" },
    { id: "branching", label: "Branching & Merging" },
    { id: "remote", label: "Remotes" },
    { id: "undo", label: "Undoing Things" },
    { id: "stash-tags", label: "Stash & Tags" },
    { id: "github", label: "GitHub & PRs" },
    { id: "workflow", label: "Feature Workflow" },
    { id: "mindset", label: "Keep In Mind" },
    { id: "mistakes", label: "Common Mistakes" },
  ];

  return (
    <main className="min-h-screen bg-white text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Hero */}
      <section className="border-b border-neutral-100 px-6 pb-14 pt-16 dark:border-neutral-900 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            <Terminal className="h-3.5 w-3.5" />
            git-cheatsheet
          </div>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl">
            Git &amp; GitHub Cheat Sheet
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Every command, diagram, and hard-won lesson you actually reach for day to day -
            from your first <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] dark:bg-neutral-800">git init</code> to
            rescuing a branch you thought you broke.
          </p>

          {/* color legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> safe / forward action</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-400" /> branch / pull</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> tag / caution</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> destructive — read first</span>
          </div>

          {/* quick nav */}
          <nav className="mt-8 flex flex-wrap gap-2">
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="rounded-full border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-neutral-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-6 py-14 sm:px-10">
        {/* THE THREE TREES */}
        <section>
          <SectionHeading
            id="areas"
            eyebrow="Mental model"
            title="The three (really four) trees"
            subtitle="Almost every Git command just moves a change between these places. Once this clicks, the rest of Git is mostly vocabulary."
          />
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
            <ThreeTreesDiagram />
          </div>
        </section>

        {/* SETUP */}
        <section>
          <SectionHeading
            id="setup"
            eyebrow="Before you start"
            title="Setup & configuration"
            subtitle="One-time-per-machine commands."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <CommandGroup
              title="Identity & defaults"
              icon={<Settings className="h-4 w-4" />}
              accent="indigo"
              commands={[
                { cmd: 'git config --global user.name "Your Name"', desc: "Sets the name attached to your commits." },
                { cmd: 'git config --global user.email "you@example.com"', desc: "Sets the email attached to your commits — match your GitHub account email." },
                { cmd: "git config --global init.defaultBranch main", desc: "Makes new repos default to `main` instead of `master`." },
                { cmd: "git config --list", desc: "Shows all active config values and where they came from." },
              ]}
            />
            <CommandGroup
              title="Starting a repository"
              icon={<FolderGit2 className="h-4 w-4" />}
              accent="emerald"
              commands={[
                { cmd: "git init", desc: "Turns the current folder into a new Git repository." },
                { cmd: "git clone <url>", desc: "Downloads a full copy of a remote repository, including history." },
                { cmd: "git clone <url> <folder>", desc: "Clones into a specific folder name instead of the repo's default." },
                { cmd: "git clone --depth 1 <url>", desc: "Shallow clone — only the latest commit, useful for huge repos." },
              ]}
            />
          </div>
        </section>

        {/* EVERYDAY */}
        <section>
          <SectionHeading
            id="everyday"
            eyebrow="Daily loop"
            title="Everyday commands"
            subtitle="The status → add → commit loop you'll run dozens of times a day."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <CommandGroup
              title="Check & review"
              icon={<GitCommit className="h-4 w-4" />}
              accent="indigo"
              commands={[
                { cmd: "git status", desc: "Shows staged, unstaged, and untracked changes." },
                { cmd: "git diff", desc: "Shows unstaged changes, line by line." },
                { cmd: "git diff --staged", desc: "Shows changes that are staged but not yet committed." },
                { cmd: "git show <commit>", desc: "Shows the full diff and metadata of a specific commit." },
              ]}
            />
            <CommandGroup
              title="Stage & commit"
              icon={<GitCommit className="h-4 w-4" />}
              accent="emerald"
              commands={[
                { cmd: "git add <file>", desc: "Stages a specific file's changes." },
                { cmd: "git add .", desc: "Stages every change in the current directory." },
                { cmd: "git add -p", desc: "Interactively stage changes hunk by hunk — great for clean commits." },
                { cmd: 'git commit -m "message"', desc: "Commits staged changes with a message." },
                { cmd: 'git commit -am "message"', desc: "Stages every tracked file's changes and commits in one step." },
              ]}
            />
          </div>
        </section>

        {/* BRANCHING */}
        <section>
          <SectionHeading
            id="branching"
            eyebrow="Parallel work"
            title="Branching & merging"
            subtitle="Branches are just movable pointers to commits — cheap to create, cheap to throw away."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <CommandGroup
              title="Branching"
              icon={<GitBranch className="h-4 w-4" />}
              accent="indigo"
              commands={[
                { cmd: "git branch", desc: "Lists local branches." },
                { cmd: "git branch <name>", desc: "Creates a new branch (doesn't switch to it)." },
                { cmd: "git switch <name>", desc: "Switches to an existing branch (modern replacement for checkout)." },
                { cmd: "git switch -c <name>", desc: "Creates and switches to a new branch in one step." },
                { cmd: "git branch -d <name>", desc: "Deletes a branch that's already merged." },
                { cmd: "git branch -D <name>", desc: "Force-deletes a branch, merged or not." },
              ]}
            />
            <CommandGroup
              title="Merging & rebasing"
              icon={<GitMerge className="h-4 w-4" />}
              accent="amber"
              commands={[
                { cmd: "git merge <branch>", desc: "Merges another branch into the current one, keeping full history." },
                { cmd: "git rebase <branch>", desc: "Replays your commits on top of another branch — linear history." },
                { cmd: "git rebase -i HEAD~3", desc: "Interactive rebase: reorder, squash, or reword the last 3 commits." },
                { cmd: "git rebase --continue", desc: "Continues a rebase after resolving a conflict." },
                { cmd: "git rebase --abort", desc: "Bails out and restores the branch to before the rebase started." },
              ]}
            />
          </div>
          <div className="mt-5">
            <Callout type="info" title="Merge vs. rebase, in one line">
              Merge preserves exactly what happened (safe, a bit noisy). Rebase rewrites history to look
              linear (clean, but never do it on a branch someone else is also working on).
            </Callout>
          </div>
        </section>

        {/* REMOTE */}
        <section>
          <SectionHeading
            id="remote"
            eyebrow="Syncing"
            title="Working with remotes"
            subtitle="Your local repo talks to remotes (usually GitHub) with fetch, pull, and push."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <CommandGroup
              title="Remotes"
              icon={<Workflow className="h-4 w-4" />}
              accent="indigo"
              commands={[
                { cmd: "git remote -v", desc: "Lists remotes and their URLs." },
                { cmd: "git remote add origin <url>", desc: "Connects the local repo to a remote named 'origin'." },
                { cmd: "git fetch", desc: "Downloads remote changes without merging them into your branch." },
                { cmd: "git fetch --all --prune", desc: "Fetches all remotes and removes references to deleted remote branches." },
              ]}
            />
            <CommandGroup
              title="Pull & push"
              icon={<GitPullRequest className="h-4 w-4" />}
              accent="emerald"
              commands={[
                { cmd: "git pull", desc: "Fetches and merges remote changes into your current branch." },
                { cmd: "git pull --rebase", desc: "Fetches and rebases your local commits on top — avoids merge clutter." },
                { cmd: "git push", desc: "Uploads your commits to the remote branch." },
                { cmd: "git push -u origin <branch>", desc: "Pushes and sets the remote as the branch's upstream, so future `git push` just works." },
                { cmd: "git push origin --delete <branch>", desc: "Deletes a branch on the remote." },
              ]}
            />
          </div>
        </section>

        {/* UNDO */}
        <section>
          <SectionHeading
            id="undo"
            eyebrow="Rescue"
            title="Undoing things"
            subtitle="Mistakes are normal. Match the command to how far the change has traveled."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <CommandGroup
              title="Safe undos"
              icon={<RotateCcw className="h-4 w-4" />}
              accent="emerald"
              commands={[
                { cmd: "git restore <file>", desc: "Discards unstaged changes to a file, restoring it to the last commit." },
                { cmd: "git restore --staged <file>", desc: "Unstages a file without touching its contents." },
                { cmd: "git commit --amend", desc: "Edits the message (or adds staged changes to) the last commit." },
                { cmd: "git revert <commit>", desc: "Creates a new commit that undoes a previous one — safe on shared branches." },
              ]}
            />
            <CommandGroup
              title="Rewriting history (careful)"
              icon={<AlertTriangle className="h-4 w-4" />}
              accent="rose"
              commands={[
                { cmd: "git reset --soft HEAD~1", desc: "Undoes the last commit, keeps changes staged." },
                { cmd: "git reset --mixed HEAD~1", desc: "Undoes the last commit, keeps changes unstaged (default mode)." },
                { cmd: "git reset --hard HEAD~1", desc: "Undoes the last commit and deletes the changes entirely. Only do this on commits nobody else has pulled." },
                { cmd: "git reflog", desc: "Shows a log of everywhere HEAD has pointed — your safety net after a bad reset." },
              ]}
            />
          </div>
        </section>

        {/* STASH & TAGS */}
        <section>
          <SectionHeading
            id="stash-tags"
            eyebrow="Utilities"
            title="Stashing & tagging"
            subtitle="Stash to shelve work-in-progress; tag to mark meaningful points like releases."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <CommandGroup
              title="Stash"
              icon={<Archive className="h-4 w-4" />}
              accent="amber"
              commands={[
                { cmd: "git stash", desc: "Shelves your uncommitted changes and cleans the working directory." },
                { cmd: "git stash -u", desc: "Also stashes untracked files." },
                { cmd: "git stash list", desc: "Lists all stashed sets of changes." },
                { cmd: "git stash pop", desc: "Re-applies the most recent stash and removes it from the stash list." },
                { cmd: "git stash apply", desc: "Re-applies a stash but keeps it in the list — useful across branches." },
                { cmd: "git stash drop", desc: "Deletes a stash without applying it." },
              ]}
            />
            <CommandGroup
              title="Tags & history"
              icon={<Tags className="h-4 w-4" />}
              accent="indigo"
              commands={[
                { cmd: "git tag", desc: "Lists existing tags." },
                { cmd: "git tag v1.0.0", desc: "Creates a lightweight tag on the current commit." },
                { cmd: 'git tag -a v1.0.0 -m "message"', desc: "Creates an annotated tag — preferred for releases." },
                { cmd: "git push origin --tags", desc: "Pushes all local tags to the remote." },
                { cmd: "git log --oneline --graph --all", desc: "A compact, visual view of branch and merge history." },
                { cmd: "git blame <file>", desc: "Shows who last changed each line of a file, and in which commit." },
              ]}
            />
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-950 p-4 dark:border-neutral-800">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
              $ git log --oneline --graph --all
            </p>
            <pre className="font-mono text-[12.5px] leading-relaxed text-neutral-300">
{`* 7e4f2a1 (HEAD -> main) Merge pull request #42
|\\
| * 9c3d8b2 (feature/login) Add login validation
| * a1b2c3d Add login form
|/
* 5f6e7d8 Update README
* 3a2b1c0 Initial commit`}
            </pre>
          </div>
        </section>

        {/* GITHUB */}
        <section>
          <SectionHeading
            id="github"
            eyebrow="Beyond Git"
            title="GitHub & pull requests"
            subtitle="Git is the tool; GitHub is a hosting service and collaboration layer built on top of it."
          />

          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <p className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                <FolderGit2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Git
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                A version control tool that runs on your machine. Tracks history, branches, and diffs — works with no internet connection.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <p className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                <Github className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> GitHub
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                A cloud service that hosts Git repositories and adds collaboration tools: pull requests, issues, code review, and CI/CD (Actions).
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <CommandGroup
              title="Fork & pull request flow"
              icon={<GitFork className="h-4 w-4" />}
              accent="indigo"
              commands={[
                { cmd: "gh repo fork <owner>/<repo> --clone", desc: "Forks a repo to your account and clones it locally (GitHub CLI)." },
                { cmd: "git remote add upstream <url>", desc: "Adds the original repo as a second remote so you can pull its updates." },
                { cmd: "git fetch upstream && git merge upstream/main", desc: "Syncs your fork with the original repo's latest changes." },
                { cmd: "gh pr create", desc: "Opens a pull request from your current branch." },
                { cmd: "gh pr list", desc: "Lists open pull requests in the repo." },
                { cmd: "gh pr checkout <number>", desc: "Checks out someone else's PR locally to review or test it." },
              ]}
            />
            <CommandGroup
              title="Issues & repos (gh CLI)"
              icon={<Github className="h-4 w-4" />}
              accent="emerald"
              commands={[
                { cmd: "gh repo clone <owner>/<repo>", desc: "Clones a repo using the GitHub CLI (handles auth for you)." },
                { cmd: "gh issue create", desc: "Opens a new issue interactively." },
                { cmd: "gh issue list --assignee @me", desc: "Lists issues assigned to you." },
                { cmd: "gh pr view --web", desc: "Opens the current branch's PR in your browser." },
                { cmd: "gh run list", desc: "Lists recent GitHub Actions workflow runs." },
              ]}
            />
          </div>
        </section>

        {/* WORKFLOW DIAGRAM */}
        <section>
          <SectionHeading
            id="workflow"
            eyebrow="Putting it together"
            title="A typical feature-branch workflow"
            subtitle="Branch off main, commit as you go, open a PR, merge, tag a release."
          />
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
            <BranchWorkflowDiagram />
          </div>
          <ol className="mt-5 space-y-2 text-[14px] text-neutral-600 dark:text-neutral-400">
            <li><span className="font-mono text-emerald-600 dark:text-emerald-400">1.</span> <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] dark:bg-neutral-800">git switch -c feature/login</code> — branch off the latest main.</li>
            <li><span className="font-mono text-emerald-600 dark:text-emerald-400">2.</span> Commit in small, reviewable chunks as you build.</li>
            <li><span className="font-mono text-emerald-600 dark:text-emerald-400">3.</span> <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] dark:bg-neutral-800">git push -u origin feature/login</code> then <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] dark:bg-neutral-800">gh pr create</code>.</li>
            <li><span className="font-mono text-emerald-600 dark:text-emerald-400">4.</span> Address review comments with more commits, or an interactive rebase to tidy up.</li>
            <li><span className="font-mono text-emerald-600 dark:text-emerald-400">5.</span> Merge the PR, delete the branch, tag a release if it ships.</li>
          </ol>
        </section>

        {/* MINDSET */}
        <section>
          <SectionHeading
            id="mindset"
            eyebrow="Habits that save you"
            title="Important things to keep in mind"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Callout type="tip" title="Write commits in the imperative mood">
              "Add login validation," not "Added" or "Adds." It reads naturally next to <code>git log</code> and matches Git's own generated messages (e.g. "Merge branch...").
            </Callout>
            <Callout type="danger" title="Never rewrite shared history">
              Once a commit is pushed and others may have pulled it, avoid <code>rebase</code> or <code>reset --hard</code> on that branch. Use <code>git push --force-with-lease</code> at most, and only on branches you own alone.
            </Callout>
            <Callout type="warning" title="Set up .gitignore before your first commit">
              It's much easier to exclude <code>node_modules/</code>, <code>.env</code>, and build output from the start than to untrack them later with <code>git rm -r --cached .</code>.
            </Callout>
            <Callout type="danger" title="Committed secrets don't just 'go away'">
              Deleting a secret in a new commit leaves it in history forever. Rotate the credential immediately, then use a tool like <code>git filter-repo</code> or the BFG Repo-Cleaner to scrub history.
            </Callout>
            <Callout type="tip" title="Pull before you push">
              Running <code>git pull</code> (or <code>--rebase</code>) before pushing avoids most "non-fast-forward" rejections and surfaces conflicts early, while they're small.
            </Callout>
            <Callout type="info" title="A detached HEAD isn't broken">
              It just means you're not on a branch. If you've made commits you want to keep, run <code>git switch -c new-branch-name</code> before switching away.
            </Callout>
          </div>
        </section>

        {/* MISTAKES */}
        <section>
          <SectionHeading
            id="mistakes"
            eyebrow="Troubleshooting"
            title="Common mistakes & how to fix them"
          />
          <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
            <table className="w-full text-left text-[13.5px]">
              <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Situation</th>
                  <th className="px-4 py-3 font-medium">Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {[
                  ["Committed to the wrong branch", "git branch new-branch → git reset --hard HEAD~1 on the original → git switch new-branch"],
                  ["Need to change the last commit message", "git commit --amend"],
                  ["Merge conflict on a pull", "Open the flagged files, resolve the <<<<<<< / ======= / >>>>>>> markers, then git add . && git commit"],
                  ["Accidentally deleted a branch", "git reflog to find its last commit hash, then git branch <name> <hash>"],
                  ["A large or sensitive file got committed", "Remove with git filter-repo or BFG, then add the path to .gitignore"],
                  ["Force push overwrote a teammate's work", "They can recover via their own git reflog; going forward use --force-with-lease and coordinate before force-pushing shared branches"],
                ].map(([situation, fix]) => (
                  <tr key={situation} className="align-top">
                    <td className="px-4 py-3 font-medium text-neutral-800 dark:text-neutral-200">{situation}</td>
                    <td className="px-4 py-3 font-mono text-[12.5px] text-neutral-500 dark:text-neutral-400">{fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="border-t border-neutral-100 pt-8 text-[13px] text-neutral-400 dark:border-neutral-900 dark:text-neutral-600">
          Bookmark this page — <code className="font-mono">git</code> rewards muscle memory more than memorization.
        </footer>
      </div>
    </main>
  );
}