"use client";

/**
 * Claude Code category page — content component.
 *
 * DESIGN TOKENS (for reference / future edits)
 * ---------------------------------------------
 * Color
 *   bg canvas      #FFFFFF  →  dark #0A0D12
 *   bg surface     #F5F7F9  →  dark #12161C
 *   terminal chrome #0D1117 (stays dark in both modes — a real terminal)
 *   border         #E1E4E8  →  dark #232A34
 *   text primary   #171B21  →  dark #E6EDF3
 *   text secondary #57606A  →  dark #8B949E
 *   accent amber   #D97706  (prompt / cursor / primary CTA)
 *   accent violet  #6E56CF  (keywords / secondary accent)
 *   accent teal    #0F9D78  (confirmations, checks)
 * Type
 *   display/labels  JetBrains Mono (monospace — the tool's native voice)
 *   body            Inter
 * Signature element
 *   A live-typed terminal window in the hero, reused (smaller) to show the
 *   agent-loop code sample later in the page. Section eyebrows are written
 *   as real shell prompts ("~/claude-code $ ...") instead of numbered steps,
 *   since the subject is a CLI tool and that framing is literal, not decorative.
 *
 * THEME STRATEGY
 * ---------------------------------------------
 * This component assumes a `dark` class strategy (e.g. Tailwind
 * `darkMode: "class"` + next-themes), toggled by the theme button that
 * already lives in your global <Header /> / layout.tsx. This file contains
 * no theme toggle of its own — every color is expressed as a light value
 * with a `dark:` override, so it just follows whatever class is set on
 * <html> (or a parent wrapper) by your existing header component.
 *
 * MOBILE NOTES
 * ---------------------------------------------
 * Mobile-first refinements:
 *  - Hero: tighter vertical rhythm, scaled heading, full-width install pill
 *    with internal horizontal scroll; terminal sits below copy on small screens.
 *  - Install command + per-platform rows: min-w-0 + flex-1 + overflow-x-auto
 *    on <code>, shrink-0 on "$" and CopyButton so the page never overflows.
 *  - TerminalWindow title bar truncates; body padding and type scale down.
 *  - Eyebrow wraps cleanly; section padding and gaps reduce on narrow viewports.
 *  - Cards and lists use consistent min-w-0 to prevent text overflow.
 *  - CTA stacks fully on mobile with full-width button.
 *  - Code sample uses smaller mono type + overflow-x-auto.
 */

import { useEffect, useRef, useState } from "react";
import {
  Terminal,
  GitBranch,
  FileText,
  ShieldCheck,
  Zap,
  Bot,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  Workflow,
  Box,
  Settings2,
  MonitorSmartphone,
  Globe2,
  Plug,
  Users,
  Clock,
  RefreshCw,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Small shared bits                                                        */
/* -------------------------------------------------------------------------- */

function Eyebrow({ children }: { children: string }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px] leading-snug text-[#D97706] sm:mb-4 sm:text-[13px]">
      <span className="text-[#57606A] dark:text-[#8B949E]">~/claude-code</span>
      <span className="text-[#D97706]">$</span>
      <span className="min-w-0 break-words">{children}</span>
      <span className="ml-0.5 inline-block h-[12px] w-[6px] shrink-0 animate-pulse bg-[#D97706] sm:h-[14px] sm:w-[7px]" />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable — silently ignore */
        }
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1.5 font-mono text-[11px] text-[#C9D1D9] transition hover:bg-white/10 active:scale-95 sm:px-2.5 sm:text-xs"
      aria-label="Copy command"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-[#0F9D78]" />
          <span className="hidden xs:inline">copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">copy</span>
        </>
      )}
    </button>
  );
}

/** A terminal chrome window. Stays visually dark regardless of page theme. */
function TerminalWindow({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "overflow-hidden rounded-xl border border-black/40 bg-[#0D1117] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] dark:border-white/10 " +
        className
      }
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#161B22] px-3 py-2.5 sm:gap-2 sm:px-4 sm:py-3">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#28C840]" />
        <span className="ml-2 min-w-0 flex-1 truncate font-mono text-[11px] text-[#8B949E] sm:ml-3 sm:text-xs">
          {title}
        </span>
      </div>
      <div className="min-w-0 p-3 font-mono text-[12px] leading-relaxed sm:p-5 sm:text-[13px] md:p-6 md:text-sm">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero — typed terminal session                                            */
/* -------------------------------------------------------------------------- */

type ScriptLine =
  | { type: "prompt"; text: string }
  | { type: "out"; text: string; tone?: "dim" | "ok" | "accent" };

const HERO_SCRIPT: ScriptLine[] = [
  { type: "prompt", text: "claude \"find why checkout is failing on Safari and fix it\"" },
  { type: "out", text: "Reading src/checkout/, tests/, CLAUDE.md…", tone: "dim" },
  { type: "out", text: "Found it: a Safari-only Date parsing bug in totals.ts", tone: "accent" },
  { type: "out", text: "Editing totals.ts, adding a regression test…", tone: "dim" },
  { type: "out", text: "Running test suite — 214 passed, 0 failed", tone: "ok" },
  { type: "out", text: "Opened PR #482: \"Fix Safari date parsing in checkout totals\"", tone: "ok" },
];

function useTypedScript(script: ScriptLine[], active: boolean) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) return;
    if (lineIndex >= script.length) return;

    const current = script[lineIndex];
    const isPrompt = current.type === "prompt";
    const speed = isPrompt ? 28 : 10;

    if (charIndex < current.text.length) {
      timeoutRef.current = setTimeout(() => setCharIndex((c) => c + 1), speed);
    } else {
      const pause = isPrompt ? 420 : 260;
      timeoutRef.current = setTimeout(() => {
        setLineIndex((l) => l + 1);
        setCharIndex(0);
      }, pause);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [active, charIndex, lineIndex, script]);

  const done = script.slice(0, lineIndex);
  const current =
    lineIndex < script.length
      ? { ...script[lineIndex], text: script[lineIndex].text.slice(0, charIndex) }
      : null;

  return { done, current, finished: lineIndex >= script.length };
}

function ToneLine({ line }: { line: ScriptLine }) {
  if (line.type === "prompt") {
    return (
      <div className="flex gap-2">
        <span className="shrink-0 text-[#0F9D78]">❯</span>
        <span className="min-w-0 break-words text-[#E6EDF3]">{line.text}</span>
      </div>
    );
  }
  const toneClass =
    line.tone === "ok"
      ? "text-[#0F9D78]"
      : line.tone === "accent"
      ? "text-[#D97706]"
      : "text-[#8B949E]";
  return <div className={"min-w-0 break-words pl-5 " + toneClass}>{line.text}</div>;
}

function HeroTerminal() {
  const { done, current, finished } = useTypedScript(HERO_SCRIPT, true);

  return (
    <TerminalWindow title="~/checkout-app — claude">
      <div className="flex min-h-[200px] flex-col gap-1.5 sm:min-h-[220px] sm:gap-2 lg:min-h-[240px]">
        {done.map((l, i) => (
          <ToneLine key={i} line={l} />
        ))}
        {current && <ToneLine line={current} />}
        {finished && (
          <div className="mt-1 flex gap-2">
            <span className="text-[#0F9D78]">❯</span>
            <span className="inline-block h-[14px] w-[7px] animate-pulse bg-[#E6EDF3] sm:h-[16px] sm:w-[8px]" />
          </div>
        )}
      </div>
    </TerminalWindow>
  );
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                     */
/* -------------------------------------------------------------------------- */

const CAPABILITIES = [
  {
    icon: FileText,
    title: "Reads your whole codebase",
    body:
      "Claude Code explores files, follows imports, and builds an understanding of your project's structure before it touches anything — the same way a new engineer would read around before making a change.",
  },
  {
    icon: GitBranch,
    title: "Works directly in git",
    body:
      "It stages changes, writes commit messages, creates branches, and opens pull requests. In CI, it can review PRs and triage issues automatically via GitHub Actions or GitLab CI/CD.",
  },
  {
    icon: Plug,
    title: "Connects to your tools via MCP",
    body:
      "The Model Context Protocol is an open standard for wiring AI tools to external systems. Through MCP, Claude Code can read a doc in Drive, update a Jira ticket, or use tooling your team built in‑house.",
  },
  {
    icon: Settings2,
    title: "Remembers your standards",
    body:
      "A CLAUDE.md file in your project root is read at the start of every session — coding conventions, architecture decisions, review checklists. Claude Code also builds its own auto memory of things like build commands as it works.",
  },
  {
    icon: Users,
    title: "Runs agent teams",
    body:
      "Spawn multiple agents that work on different parts of a task at once, coordinated by a lead agent that assigns subtasks and merges the results — useful for large, parallelizable changes.",
  },
  {
    icon: Clock,
    title: "Runs on a schedule",
    body:
      "Routines run on Anthropic-managed infrastructure so they keep going even when your laptop is closed — morning PR reviews, overnight CI failure triage, weekly dependency audits.",
  },
];

const SURFACES = [
  { icon: Terminal, name: "Terminal", body: "The full CLI. Edit files, run commands, manage the whole project from the command line." },
  { icon: Box, name: "VS Code & JetBrains", body: "Inline diffs, @-mentions, plan review, and conversation history inside your editor." },
  { icon: MonitorSmartphone, name: "Desktop app", body: "Review diffs visually, run sessions side by side, schedule recurring tasks." },
  { icon: Globe2, name: "Web & mobile", body: "Kick off long-running tasks from claude.ai/code or the Claude app — no local setup." },
];

const LOOP_STEPS = [
  {
    title: "Gather context",
    body: "Read the relevant files, search the codebase, check CLAUDE.md and prior memory — build up only the context this step actually needs.",
  },
  {
    title: "Decide the next action",
    body: "The model reasons about the goal and picks one tool call: edit a file, run a command, search, or ask a clarifying question.",
  },
  {
    title: "Act, in a sandbox",
    body: "The tool executes with real but scoped permissions — a file edit, a shell command, a git operation — and returns its result as plain text or structured output.",
  },
  {
    title: "Verify",
    body: "Run tests, a linter, a type checker, or re-read the diff. A loop that can check its own work is what separates an agent from an autocomplete.",
  },
  {
    title: "Repeat or stop",
    body: "If the goal isn't met, the result feeds back in as new context and the loop continues. If it is, the agent reports what it did and stops.",
  },
];

const BUILD_COMPONENTS = [
  {
    icon: Bot,
    title: "A capable model",
    body: "You need a model that can hold a plan across many steps, call tools reliably, and reason about its own output well enough to know when something's wrong.",
  },
  {
    icon: Workflow,
    title: "A small set of sharp tools",
    body: "Read file, edit file, run command, search — a handful of composable primitives beats dozens of narrow ones. Claude Code's own toolset is deliberately small.",
  },
  {
    icon: FileText,
    title: "Persistent, addressable memory",
    body: "Long tasks outgrow a context window. CLAUDE.md-style project files plus a running auto-memory of learnings let the agent pick up where it left off without re-deriving everything.",
  },
  {
    icon: ShieldCheck,
    title: "Real permission boundaries",
    body: "Decide up front what the agent can do without asking — read files, run tests — versus what needs a human nod, like pushing to main or deleting data.",
  },
  {
    icon: CheckCircle2,
    title: "A ground-truth feedback signal",
    body: "Tests passing, a linter's exit code, a type checker — something outside the model's own judgment that tells the loop whether the last action actually worked.",
  },
  {
    icon: Zap,
    title: "Context management",
    body: "Summarize or discard stale context, keep only what's relevant to the current step, and hand off cleanly to sub-agents for isolated chunks of work.",
  },
];

const CODE_SAMPLE = `// A minimal agent loop — the same shape Claude Code runs at scale.
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const tools = [
  {
    name: "read_file",
    description: "Read a file's contents",
    input_schema: {
      type: "object",
      properties: { path: { type: "string" } },
      required: ["path"],
    },
  },
  {
    name: "edit_file",
    description: "Replace text in a file",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string" },
        find: { type: "string" },
        replace: { type: "string" },
      },
      required: ["path", "find", "replace"],
    },
  },
  {
    name: "run_command",
    description: "Run a shell command and return its output",
    input_schema: {
      type: "object",
      properties: { command: { type: "string" } },
      required: ["command"],
    },
  },
];

let messages = [{ role: "user", content: "Fix the failing test in totals.ts" }];

while (true) {
  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 2048,
    tools,
    messages,
  });

  messages.push({ role: "assistant", content: response.content });

  const toolCalls = response.content.filter((b) => b.type === "tool_use");
  if (toolCalls.length === 0) break; // agent is done — no more actions to take

  const results = await Promise.all(
    toolCalls.map(async (call) => ({
      type: "tool_result",
      tool_use_id: call.id,
      content: await runToolWithPermissionCheck(call), // your sandboxed executor
    }))
  );

  messages.push({ role: "user", content: results });
}`;

const PRINCIPLES = [
  {
    title: "Start narrower than feels useful",
    body: "A tight loop with three reliable tools beats a sprawling one with twenty flaky ones. Add tools when the agent demonstrably needs them, not up front.",
  },
  {
    title: "Make failures loud and structured",
    body: "A tool that fails silently teaches the model nothing. Return errors as clear text the model can reason about and recover from on the next step.",
  },
  {
    title: "Keep humans in the loop where it matters",
    body: "Auto-approve low-risk, reversible actions like reading files or running a local test suite. Ask before anything destructive, external, or hard to undo.",
  },
  {
    title: "Let the agent verify itself",
    body: "Wire in tests, linters, and type checks as tools the agent can call, not just something a human runs afterward — that's what closes the loop.",
  },
  {
    title: "Design for long tasks, not single turns",
    body: "Compact context as it grows, persist what matters between sessions, and split large goals across coordinated sub-agents rather than one overloaded context window.",
  },
];

const FAQS = [
  {
    q: "Is Claude Code just a chatbot in my terminal?",
    a: "No — the difference is that it takes direct action. It edits files, runs commands, and creates git commits itself rather than only describing what to do, and it verifies its own work by running tests as it goes.",
  },
  {
    q: "Does it work with my existing IDE?",
    a: "Yes. Beyond the terminal, there are extensions for VS Code and JetBrains IDEs, a desktop app, and a web version at claude.ai/code — CLAUDE.md files, settings, and MCP servers work the same way across all of them.",
  },
  {
    q: "What's CLAUDE.md?",
    a: "A markdown file in your project root that Claude Code reads at the start of every session — coding standards, architecture notes, preferred libraries, review checklists. It also keeps its own auto memory of things it learns while working.",
  },
  {
    q: "Can it run without me watching it?",
    a: "Yes — via routines that run on Anthropic-managed infrastructure on a schedule, or by piping it into CI with the -p flag for scripted, non-interactive runs.",
  },
  {
    q: "How is this different from building my own agent?",
    a: "It doesn't have to be — the Agent SDK exposes the same tools and orchestration Claude Code itself is built on, so you can build a fully custom agent with your own permission model on top of the same foundation.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Page sections                                                            */
/* -------------------------------------------------------------------------- */

function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={"mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-20 md:py-24 " + className}
    >
      {children}
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E1E4E8] dark:border-[#232A34]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 py-4 text-left sm:items-center sm:gap-4 sm:py-5"
        aria-expanded={open}
      >
        <span className="min-w-0 text-[15px] font-medium leading-snug text-[#171B21] dark:text-[#E6EDF3] sm:text-base">
          {q}
        </span>
        <ChevronDown
          className={
            "mt-0.5 h-4 w-4 shrink-0 text-[#57606A] transition-transform duration-200 dark:text-[#8B949E] " +
            (open ? "rotate-180" : "")
          }
        />
      </button>
      <div
        className={
          "grid overflow-hidden transition-all duration-200 ease-out " +
          (open ? "grid-rows-[1fr] pb-4 opacity-100 sm:pb-5" : "grid-rows-[0fr] opacity-0")
        }
      >
        <p className="min-h-0 text-sm leading-relaxed text-[#57606A] dark:text-[#8B949E]">{a}</p>
      </div>
    </div>
  );
}

export default function ClaudeCodeContent() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#171B21] antialiased dark:bg-[#0A0D12] dark:text-[#E6EDF3]">
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <Section className="pt-10 sm:pt-16 md:pt-24">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div className="min-w-0">
            <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[#E1E4E8] bg-[#F5F7F9] px-2.5 py-1 font-mono text-[11px] text-[#57606A] dark:border-[#232A34] dark:bg-[#12161C] dark:text-[#8B949E] sm:mb-6 sm:px-3 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#D97706]" />
              <span className="truncate">Agentic coding, in your terminal</span>
            </div>
            <h1 className="font-mono text-[1.65rem] font-bold leading-[1.18] tracking-tight sm:text-4xl sm:leading-[1.15] md:text-5xl md:leading-[1.1]">
              Claude Code reads your codebase{" "}
              <span className="text-[#D97706]">and does the work</span>.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#57606A] dark:text-[#8B949E] sm:mt-5 sm:text-base sm:mt-6">
              It&apos;s an agentic coding tool that understands your project, edits files,
              runs commands, and manages your git workflow - through plain language,
              from the terminal, your IDE, a desktop app, or the browser.
            </p>
            <div className="mt-6 sm:mt-7 md:mt-8">
              <div className="flex w-full max-w-full items-center gap-2 rounded-lg bg-[#0D1117] px-3 py-2.5 sm:w-fit sm:px-4 sm:py-3">
                <span className="shrink-0 font-mono text-sm text-[#8B949E]">$</span>
                <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[11px] text-[#E6EDF3] sm:text-sm">
                  curl -fsSL https://claude.ai/install.sh | bash
                </code>
                <CopyButton text="curl -fsSL https://claude.ai/install.sh | bash" />
              </div>
            </div>
            <p className="mt-2.5 font-mono text-[11px] leading-snug text-[#57606A] dark:text-[#8B949E] sm:mt-3 sm:text-xs">
              macOS, Linux, WSL — see below for Windows, Homebrew &amp; package managers
            </p>
          </div>
          <div className="min-w-0">
            <HeroTerminal />
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* What it is                                                       */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-[#E1E4E8] dark:border-[#232A34]">
        <Eyebrow>cat about.md</Eyebrow>
        <h2 className="max-w-2xl font-mono text-xl font-bold leading-snug sm:text-2xl sm:text-3xl">
          Not a chat panel bolted onto your editor.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#57606A] dark:text-[#8B949E] sm:mt-5 sm:text-base">
          Claude Code is an AI‑powered coding assistant that helps you build features,
          fix bugs, and automate development tasks by working across multiple files
          and tools directly — not just describing changes for you to make yourself.
          Because it runs from the command line, it takes real action: it edits files,
          runs terminal commands, and creates git commits on your behalf.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[#E1E4E8] bg-[#E1E4E8] dark:border-[#232A34] dark:bg-[#232A34] sm:mt-10 sm:grid-cols-3">
          {[
            { k: "Understands", v: "Your entire codebase, not just the open file" },
            { k: "Acts", v: "Edits, runs commands, commits — directly" },
            { k: "Everywhere", v: "Terminal, IDE, desktop app, and the web" },
          ].map((f) => (
            <div key={f.k} className="bg-white p-5 dark:bg-[#0A0D12] sm:p-6">
              <div className="font-mono text-sm text-[#D97706]">{f.k}</div>
              <div className="mt-1.5 text-sm leading-snug text-[#57606A] dark:text-[#8B949E] sm:mt-2">
                {f.v}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Capabilities                                                     */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-[#E1E4E8] dark:border-[#232A34]">
        <Eyebrow>features --list</Eyebrow>
        <h2 className="max-w-2xl font-mono text-xl font-bold leading-snug sm:text-2xl sm:text-3xl">
          What it actually does, day to day.
        </h2>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {CAPABILITIES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="min-w-0 rounded-xl border border-[#E1E4E8] bg-[#F5F7F9] p-5 transition-colors hover:border-[#D97706]/40 dark:border-[#232A34] dark:bg-[#12161C] sm:p-6"
            >
              <Icon className="h-5 w-5 text-[#D97706]" />
              <h3 className="mt-3 font-semibold text-[#171B21] dark:text-[#E6EDF3] sm:mt-4">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#57606A] dark:text-[#8B949E] sm:mt-2">
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Agent loop                                                       */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-[#E1E4E8] dark:border-[#232A34]">
        <Eyebrow>ps --agent-loop</Eyebrow>
        <h2 className="max-w-2xl font-mono text-xl font-bold leading-snug sm:text-2xl sm:text-3xl">
          How it works under the hood.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#57606A] dark:text-[#8B949E] sm:mt-5 sm:text-base">
          Every agentic tool, Claude Code included, runs some version of the same
          loop. The engineering is in making each stage reliable at scale.
        </p>
        <div className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
          {LOOP_STEPS.map((step, i) => (
            <div
              key={step.title}
              className="flex gap-3 rounded-xl border border-[#E1E4E8] p-4 dark:border-[#232A34] sm:gap-5 sm:p-5"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0D1117] font-mono text-[11px] text-[#D97706] sm:h-8 sm:w-8 sm:text-xs">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-[#171B21] dark:text-[#E6EDF3]">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#57606A] dark:text-[#8B949E]">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Build your own agent — the big educational section               */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-[#E1E4E8] dark:border-[#232A34]" id="build-an-agent">
        <Eyebrow>man build-an-agent</Eyebrow>
        <h2 className="max-w-2xl font-mono text-xl font-bold leading-snug sm:text-2xl sm:text-3xl">
          How to build an agent like Claude Code.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#57606A] dark:text-[#8B949E] sm:mt-5 sm:text-base">
          You don&apos;t need to reverse-engineer it from scratch — Anthropic&apos;s Agent SDK
          exposes the same tool-use and orchestration foundation Claude Code itself
          runs on. But understanding the pieces makes every layer above them make
          more sense, whether you use the SDK or write your own loop.
        </p>

        <h3 className="mt-10 font-mono text-base font-semibold text-[#171B21] dark:text-[#E6EDF3] sm:mt-12 sm:text-lg sm:mt-14">
          The six things every capable agent needs
        </h3>
        <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {BUILD_COMPONENTS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="min-w-0 rounded-xl border border-[#E1E4E8] p-5 dark:border-[#232A34] sm:p-6"
            >
              <Icon className="h-5 w-5 text-[#6E56CF]" />
              <h4 className="mt-3 font-semibold text-[#171B21] dark:text-[#E6EDF3] sm:mt-4">
                {title}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-[#57606A] dark:text-[#8B949E] sm:mt-2">
                {body}
              </p>
            </div>
          ))}
        </div>

        <h3 className="mt-12 font-mono text-base font-semibold text-[#171B21] dark:text-[#E6EDF3] sm:mt-14 sm:text-lg sm:mt-16">
          The loop in code
        </h3>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#57606A] dark:text-[#8B949E] sm:mt-3">
          Strip away the product polish and this is the shape of it: give the model
          tools, let it call them, feed the results back, and stop when it stops
          asking for more.
        </p>
        <div className="mt-5 min-w-0 sm:mt-6">
          <TerminalWindow title="agent-loop.ts">
            <pre className="overflow-x-auto whitespace-pre text-[11px] leading-relaxed text-[#C9D1D9] sm:text-[12px] md:text-[13px]">
              {CODE_SAMPLE}
            </pre>
          </TerminalWindow>
        </div>

        <h3 className="mt-12 font-mono text-base font-semibold text-[#171B21] dark:text-[#E6EDF3] sm:mt-14 sm:text-lg sm:mt-16">
          Design principles worth stealing
        </h3>
        <div className="mt-5 space-y-4 sm:mt-6">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="flex gap-3 sm:gap-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0F9D78]" />
              <div className="min-w-0">
                <h4 className="font-semibold text-[#171B21] dark:text-[#E6EDF3]">{p.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-[#57606A] dark:text-[#8B949E]">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#D97706]/30 bg-[#D97706]/[0.06] p-4 sm:mt-10 sm:gap-4 sm:p-5 sm:p-6">
          <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-[#D97706]" />
          <p className="min-w-0 text-sm leading-relaxed text-[#57606A] dark:text-[#C9D1D9]">
            <span className="font-semibold text-[#171B21] dark:text-[#E6EDF3]">
              Want the shortcut?
            </span>{" "}
            The Agent SDK gives you Claude Code&apos;s own tools, permission system, and
            orchestration as a library, so you can build a fully custom agent — your
            own tools, your own approval flow — without writing the loop yourself.
          </p>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Surfaces                                                         */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-[#E1E4E8] dark:border-[#232A34]">
        <Eyebrow>where --am-i</Eyebrow>
        <h2 className="max-w-2xl font-mono text-xl font-bold leading-snug sm:text-2xl sm:text-3xl">
          One engine, every surface.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#57606A] dark:text-[#8B949E] sm:mt-5 sm:text-base">
          CLAUDE.md files, settings, and MCP servers work the same way wherever you
          start a session.
        </p>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {SURFACES.map(({ icon: Icon, name, body }) => (
            <div
              key={name}
              className="min-w-0 rounded-xl border border-[#E1E4E8] p-5 dark:border-[#232A34] sm:p-6"
            >
              <Icon className="h-5 w-5 text-[#57606A] dark:text-[#8B949E]" />
              <h3 className="mt-3 font-semibold text-[#171B21] dark:text-[#E6EDF3] sm:mt-4">
                {name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#57606A] dark:text-[#8B949E] sm:mt-2">
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Install                                                          */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-[#E1E4E8] dark:border-[#232A34]" id="install">
        <Eyebrow>install --all-platforms</Eyebrow>
        <h2 className="max-w-2xl font-mono text-xl font-bold leading-snug sm:text-2xl sm:text-3xl">
          Get it running.
        </h2>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-2">
          {[
            { label: "macOS / Linux / WSL", cmd: "curl -fsSL https://claude.ai/install.sh | bash" },
            { label: "Windows PowerShell", cmd: "irm https://claude.ai/install.ps1 | iex" },
            { label: "Homebrew", cmd: "brew install --cask claude-code" },
            { label: "WinGet", cmd: "winget install Anthropic.ClaudeCode" },
          ].map((row) => (
            <div
              key={row.label}
              className="min-w-0 overflow-hidden rounded-xl border border-[#E1E4E8] dark:border-[#232A34]"
            >
              <div className="border-b border-[#E1E4E8] px-3 py-2 font-mono text-[11px] text-[#57606A] dark:border-[#232A34] dark:text-[#8B949E] sm:px-4 sm:text-xs">
                {row.label}
              </div>
              <div className="flex items-center justify-between gap-2 bg-[#0D1117] px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
                <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[11px] text-[#C9D1D9] sm:text-sm">
                  {row.cmd}
                </code>
                <CopyButton text={row.cmd} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#57606A] dark:text-[#8B949E] sm:mt-6">
          Also installable via apt, dnf, or apk on Debian, Fedora, RHEL, and Alpine.
          After installing, run <code className="font-mono text-[#D97706]">claude</code> inside
          any project directory. Setting an{" "}
          <code className="font-mono text-[#D97706]">ANTHROPIC_API_KEY</code> environment
          variable skips the login prompt in favor of key approval. Native installs
          update automatically; Homebrew and WinGet installs need a manual{" "}
          <code className="font-mono text-[#D97706]">upgrade</code> periodically.
        </p>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                              */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-[#E1E4E8] dark:border-[#232A34]">
        <Eyebrow>man faq</Eyebrow>
        <h2 className="max-w-2xl font-mono text-xl font-bold leading-snug sm:text-2xl sm:text-3xl">
          Common questions.
        </h2>
        <div className="mt-6 sm:mt-8">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Closing CTA                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-[#E1E4E8] pb-16 dark:border-[#232A34] sm:pb-20 md:pb-28">
        <div className="flex flex-col items-stretch gap-5 rounded-2xl border border-[#E1E4E8] bg-[#F5F7F9] p-5 dark:border-[#232A34] dark:bg-[#12161C] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-8 md:p-10">
          <div className="min-w-0">
            <h2 className="font-mono text-lg font-bold sm:text-xl md:text-2xl">
              cd your-project &amp;&amp; claude
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#57606A] dark:text-[#8B949E]">
              Point it at a real project and give it a real task — that&apos;s the fastest
              way to understand what it can do.
            </p>
          </div>
          <a
            href="https://code.claude.com/docs/en/overview"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#D97706] px-5 py-3 font-mono text-sm font-semibold text-white transition hover:bg-[#B45F04] sm:w-auto"
          >
            Read the full docs
            <Terminal className="h-4 w-4" />
          </a>
        </div>
      </Section>
    </main>
  );
}