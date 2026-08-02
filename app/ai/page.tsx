"use client";

import { useState, useEffect, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Rocket,
  BookOpen,
  Code2,
  FolderKanban,
  Briefcase,
  Zap,
  Copy,
  Check,
  ChevronDown,
  Bug,
  RefreshCw,
  Wand2,
  FileText,
  Bot,
  Sparkles,
  ArrowRight,
  Users,
  Mail,
  ExternalLink,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Static content
// ---------------------------------------------------------------------------

const WHAT_YOULL_LEARN = [
  {
    icon: Code2,
    title: "Learn Programming",
    items: ["Understand concepts", "Get clear explanations", "Practice problems", "Debug code"],
  },
  {
    icon: FolderKanban,
    title: "Build Projects",
    items: ["Generate ideas", "Create full-stack apps", "UI inspiration", "Deployment help"],
  },
  {
    icon: Briefcase,
    title: "Interview Preparation",
    items: ["DSA explanations", "Mock interviews", "System design", "Resume improvement"],
  },
  {
    icon: Zap,
    title: "AI for Productivity",
    items: ["Documentation", "Code reviews", "Git commits", "Writing README files"],
  },
] as const;

const ROADMAP_STEPS = [
  "Beginner",
  "Prompting Basics",
  "Learning with AI",
  "Debugging",
  "Building Projects",
  "Using AI as Pair Programmer",
  "Advanced Workflows",
] as const;

const AI_TOOLS = [
  { name: "ChatGPT", bestFor: "General learning & explanations", price: "Free / Paid", difficulty: "Beginner" },
  { name: "Claude", bestFor: "Long-form reasoning & code review", price: "Free / Paid", difficulty: "Beginner" },
  { name: "Gemini", bestFor: "Research & multimodal tasks", price: "Free / Paid", difficulty: "Beginner" },
  { name: "GitHub Copilot", bestFor: "In-editor autocomplete", price: "Paid", difficulty: "Intermediate" },
  { name: "Cursor", bestFor: "AI-native code editing", price: "Free / Paid", difficulty: "Intermediate" },
  { name: "Perplexity", bestFor: "Research with citations", price: "Free / Paid", difficulty: "Beginner" },
] as const;

const PROMPT_LIBRARY = [
  {
    category: "Learn a Concept",
    icon: BookOpen,
    prompt: "Explain binary search like I'm a complete beginner, using a simple real-world analogy.",
  },
  {
    category: "Debug",
    icon: Bug,
    prompt: "Find the bug in this code and explain why it happens:\n\n[paste your code]",
  },
  {
    category: "Improve Code",
    icon: RefreshCw,
    prompt: "Refactor this code using best practices and explain each change:\n\n[paste your code]",
  },
  {
    category: "Build Projects",
    icon: Wand2,
    prompt: "Generate a React dashboard using Tailwind CSS with a sidebar, stat cards, and a chart.",
  },
  {
    category: "Resume",
    icon: FileText,
    prompt: "Improve my resume for frontend developer roles. Here's my current resume:\n\n[paste your resume]",
  },
] as const;

const LEARNING_PATHS = [
  { title: "AI for Beginners", duration: "1 hour" },
  { title: "AI for Students", duration: "1.5 hours" },
  { title: "AI for Frontend Developers", duration: "2 hours" },
  { title: "AI for Backend Developers", duration: "2 hours" },
  { title: "AI for Data Structures", duration: "1.5 hours" },
  { title: "AI for Placement Preparation", duration: "3 hours" },
] as const;

const TUTORIALS = [
  "How to Learn Programming with AI",
  "Prompt Engineering for Developers",
  "Debug Code Like a Senior Developer",
  "Build Projects 3x Faster",
  "AI Mistakes Beginners Make",
] as const;

const TIPS = [
  'Never copy code without understanding it.',
  'Ask AI "why" instead of only "how."',
  "Request examples for every concept.",
  "Ask AI to quiz you on what you just learned.",
  "Learn one concept at a time.",
] as const;

const COMPARISON_ROWS = [
  ["Static tutorials", "Interactive explanations"],
  ["One solution", "Multiple approaches"],
  ["Fixed examples", "Personalized examples"],
  ["Slow feedback", "Instant feedback"],
] as const;

const FAQS = [
  {
    q: "Can beginners use AI to learn programming?",
    a: "Yes. AI is often easier for beginners than static tutorials because you can ask follow-up questions until a concept actually clicks, at your own pace.",
  },
  {
    q: "Will AI make me dependent and stop me from actually learning?",
    a: "Only if you copy answers without understanding them. Used well, AI explains the 'why', quizzes you, and pushes you to reason through problems yourself.",
  },
  {
    q: "Which AI tool is best for coding?",
    a: "There's no single best tool. Chat-based tools like Claude and ChatGPT are great for learning and explanations, while Copilot and Cursor shine for in-editor speed.",
  },
  {
    q: "Is ChatGPT enough on its own?",
    a: "It covers a lot, but pairing it with an in-editor tool (Copilot or Cursor) and a research tool (Perplexity) rounds out learning, building, and fact-checking.",
  },
  {
    q: "How should students learn with AI?",
    a: "Start with prompting basics, use AI to explain concepts and generate practice problems, then gradually use it as a pair programmer for real projects.",
  },
] as const;

const GOALS = [
  "Learn React Hooks",
  "Understand Recursion",
  "Master SQL Joins",
  "Get Better at System Design",
  "Improve Debugging Skills",
];

const LANGUAGES = ["JavaScript", "TypeScript", "Python", "Java", "C++", "SQL"];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

// A tiny scripted conversation used for the hero's live "AI thinking" demo.
const DEMO_CONVERSATION = [
  { role: "user" as const, text: "How do I reverse a linked list?" },
  {
    role: "ai" as const,
    text: "Walk three pointers — prev, curr, next — and flip each link as you go. Want the code?",
  },
];

// ---------------------------------------------------------------------------
// Motion variants
// ---------------------------------------------------------------------------

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
}

function TrafficDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-600 dark:text-emerald-400">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}

/**
 * A small looping "live" chat demo: types out a question, pauses, shows
 * three thinking dots, then types out the answer. Gives the hero an actual
 * demonstration of "AI helping you learn" rather than just claiming it.
 */
function LiveDemo() {
  const [lineIndex, setLineIndex] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    const current = DEMO_CONVERSATION[lineIndex];

    // Between lines: show a short "thinking" beat before the AI reply types.
    if (visibleChars === 0 && current.role === "ai" && !thinking) {
      setThinking(true);
      const t = setTimeout(() => setThinking(false), 700);
      return () => clearTimeout(t);
    }

    if (thinking) return;

    if (visibleChars < current.text.length) {
      const t = setTimeout(() => setVisibleChars((c) => c + 1), 16);
      return () => clearTimeout(t);
    }

    // Line finished typing — hold, then advance (looping back to the start).
    const holdMs = lineIndex === DEMO_CONVERSATION.length - 1 ? 2600 : 500;
    const t = setTimeout(() => {
      const next = (lineIndex + 1) % DEMO_CONVERSATION.length;
      setLineIndex(next);
      setVisibleChars(0);
    }, holdMs);
    return () => clearTimeout(t);
  }, [lineIndex, visibleChars, thinking]);

  return (
    <div className="mx-auto mt-10 max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm dark:border-slate-800/60 dark:bg-[#0a0e14]">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <TrafficDots />
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">ai-tutor.chat</span>
        </div>
        <Bot className="h-4 w-4 text-amber-600 dark:text-emerald-400" />
      </div>
      <div className="min-h-[132px] space-y-3 px-4 py-4 font-mono text-sm">
        {DEMO_CONVERSATION.map((line, idx) => {
          if (idx > lineIndex) return null;
          const isCurrentLine = idx === lineIndex;
          const text = isCurrentLine ? line.text.slice(0, visibleChars) : line.text;
          const isUser = line.role === "user";
          return (
            <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <span
                className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-left ${
                  isUser
                    ? "bg-slate-100 text-slate-800 dark:bg-slate-800/70 dark:text-slate-100"
                    : "bg-amber-600/10 text-amber-800 dark:bg-emerald-400/10 dark:text-emerald-200"
                }`}
              >
                {text}
                {isCurrentLine && !thinking && (
                  <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-current align-middle" />
                )}
              </span>
            </div>
          );
        })}
        {thinking && (
          <div className="flex justify-start">
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-600/10 px-3 py-2 dark:bg-emerald-400/10">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 dark:bg-emerald-400"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LearningAiPage() {
  // Copy-to-clipboard state (shared across prompt library + playground)
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1800);
  }

  // Tips carousel
  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Prompt playground
  const [goal, setGoal] = useState(GOALS[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [level, setLevel] = useState(LEVELS[0]);
  const [generated, setGenerated] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const playgroundPrompt = useMemo(() => {
    return `I want to ${goal.toLowerCase()} in ${language}. I'm at a ${level.toLowerCase()} level. Explain the core concept simply, give me one working example, point out a common mistake, then quiz me with one question to check my understanding.`;
  }, [goal, language, level]);

  function handleGenerate() {
    // Small simulated "thinking" delay so the playground feels alive rather
    // than instant — echoes how a real assistant briefly composes a reply.
    setIsGenerating(true);
    setGenerated(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(playgroundPrompt);
    }, 550);
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-[#0a0e14] dark:text-slate-50">
      {/* ---------------------------------------------------------------- */}
      {/* Hero */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-[#f7f8fa] dark:border-slate-800/60 dark:bg-[#0d1117]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "28px 28px",
            color: "rgb(148 163 184)",
          }}
        />
        {/* Ambient drifting glow — subtle signal that this page is "alive" */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl dark:bg-emerald-400/10"
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-50 px-3 py-1 font-mono text-xs text-amber-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              CodeNFacts AI Learning
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Learn Faster. Build Smarter.
              <br />
              <span className="text-amber-600 dark:text-emerald-400">With AI.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
              Discover how to use AI to learn programming, solve problems, build projects, prepare
              for interviews, and become a better developer. (We're still working on it to bring you a better experience.

🚀 Coding AI Agent is coming soon !! Expected in Version 2.0
)
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/develop"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 dark:bg-emerald-500 dark:text-[#0a0e14] dark:hover:bg-emerald-400"
              >
                <Rocket className="h-4 w-4" />
                Start Learning
              </Link>
              <a
                href="#prompt-library"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-amber-600/50 hover:text-amber-700 dark:border-slate-700 dark:bg-transparent dark:text-slate-200 dark:hover:border-emerald-400/50 dark:hover:text-emerald-300"
              >
                <BookOpen className="h-4 w-4" />
                Browse AI Guides
              </a>
            </div>
            <LiveDemo />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* What you'll learn */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <SectionHeading
            eyebrow="What you'll learn"
            title="Everything AI can do for your dev journey"
          />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHAT_YOULL_LEARN.map((card) => (
            <Reveal key={card.title} className="h-full">
              <div className="group flex h-full flex-col rounded-xl border border-slate-200 bg-[#f7f8fa] p-6 transition hover:-translate-y-0.5 hover:border-amber-600/40 hover:shadow-md dark:border-slate-800/60 dark:bg-[#0d1117] dark:hover:border-emerald-400/40">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600/10 text-amber-700 transition group-hover:bg-amber-600 group-hover:text-white dark:bg-emerald-400/10 dark:text-emerald-300 dark:group-hover:bg-emerald-400 dark:group-hover:text-[#0a0e14]">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{card.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-600 dark:bg-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Roadmap */}
      {/* ---------------------------------------------------------------- */}
<section className="relative overflow-hidden border-y border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white py-28 dark:border-slate-800 dark:from-[#050816] dark:via-[#08101c] dark:to-[#050816]">

  {/* Background Effects */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
    <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[150px]" />
    <div className="absolute left-1/2 top-1/3 h-60 w-60 -translate-x-1/2 rounded-full bg-amber-400/10 blur-[120px]" />
  </div>

  <div className="relative mx-auto max-w-7xl px-6">

    <Reveal>
      <SectionHeading
        eyebrow="Learning Journey"
        title="The AI Engineer Roadmap"
      />
    </Reveal>

    <div className="relative mt-20">

      {/* Timeline */}
      <div className="absolute left-1/2 top-0 hidden h-full w-[4px] -translate-x-1/2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 md:block">
        <div className="h-full w-full animate-pulse bg-gradient-to-b from-emerald-400 via-cyan-400 to-blue-500" />
      </div>

      <div className="space-y-14">

        {ROADMAP_STEPS.map((step, idx) => {

          const left = idx % 2 === 0;

          return (
            <Reveal key={step}>
              <div
                className={`relative flex items-center ${
                  left ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >

                {/* Card */}
                <div className="w-full md:w-1/2">

                  <div
                    className={`
                    group relative rounded-3xl border
                    border-slate-200/70
                    bg-white/70
                    backdrop-blur-xl
                    p-6
                    shadow-lg
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:shadow-2xl
                    hover:shadow-emerald-500/10

                    dark:border-slate-800
                    dark:bg-white/[0.03]

                    ${left ? "md:mr-12" : "md:ml-12"}
                  `}
                  >

                    {/* Glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-cyan-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative flex items-center gap-5">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/30">
                        {idx + 1}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {step}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Complete this stage before moving to the next one.
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Center Circle */}
                <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
                    <div className="relative h-7 w-7 rounded-full border-4 border-white bg-gradient-to-r from-emerald-400 to-cyan-500 shadow-xl dark:border-[#08101c]" />
                  </div>
                </div>

              </div>
            </Reveal>
          );
        })}

      </div>

    </div>
  </div>
</section>

      {/* ---------------------------------------------------------------- */}
      {/* Popular AI Tools */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <SectionHeading eyebrow="Toolkit" title="Popular AI Tools" />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AI_TOOLS.map((tool) => (
            <Reveal key={tool.name}>
              <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-[#f7f8fa] p-6 transition hover:border-amber-600/40 dark:border-slate-800/60 dark:bg-[#0d1117] dark:hover:border-emerald-400/40">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600/10 text-amber-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <Bot className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{tool.name}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Best for: {tool.bestFor}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono">
                  <span className="rounded-full border border-slate-300 px-2.5 py-1 dark:border-slate-700">
                    {tool.price}
                  </span>
                  <span className="rounded-full border border-slate-300 px-2.5 py-1 dark:border-slate-700">
                    {tool.difficulty}
                  </span>
                </div>
                <button className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-amber-700 hover:underline dark:text-emerald-300">
                  Learn more
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Prompt Library */}
      {/* ---------------------------------------------------------------- */}
      <section id="prompt-library" className="border-y border-slate-200 bg-[#f7f8fa] py-20 dark:border-slate-800/60 dark:bg-[#0d1117]">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Copy & use"
              title="Prompt Library"
              subtitle="Battle-tested prompts for the moments you'll actually hit while learning."
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {PROMPT_LIBRARY.map((entry) => {
              const id = `lib-${entry.category}`;
              const isCopied = copiedId === id;
              return (
                <Reveal key={entry.category}>
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800/60 dark:bg-[#0a0e14]">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <entry.icon className="h-4 w-4 text-amber-700 dark:text-emerald-300" />
                        <span className="text-sm font-semibold">{entry.category}</span>
                      </div>
                      <TrafficDots />
                    </div>
                    <pre className="whitespace-pre-wrap break-words px-4 py-4 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      {entry.prompt}
                    </pre>
                    <button
                      onClick={() => handleCopy(id, entry.prompt)}
                      className="flex w-full items-center justify-center gap-2 border-t border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:text-amber-700 dark:border-slate-800/60 dark:text-slate-400 dark:hover:text-emerald-300"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy prompt
                        </>
                      )}
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* AI Learning Paths */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <SectionHeading eyebrow="Guided tracks" title="AI Learning Paths" />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LEARNING_PATHS.map((path) => (
            <Reveal key={path.title}>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-[#f7f8fa] px-5 py-4 transition hover:border-amber-600/40 dark:border-slate-800/60 dark:bg-[#0d1117] dark:hover:border-emerald-400/40">
                <span className="text-sm font-semibold">{path.title}</span>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {path.duration}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Featured Tutorials */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-slate-200 bg-[#f7f8fa] py-20 dark:border-slate-800/60 dark:bg-[#0d1117]">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <SectionHeading eyebrow="Read next" title="Featured Tutorials" />
          </Reveal>
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-800/60 dark:border-slate-800/60 dark:bg-[#0a0e14]">
            {TUTORIALS.map((title) => (
              <Reveal key={title}>
                <a
                  href="#"
                  className="flex items-center justify-between gap-4 px-5 py-4 text-sm font-medium transition hover:bg-amber-600/5 dark:hover:bg-emerald-400/5"
                >
                  {title}
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Daily Challenge */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <Reveal>
          <div className="rounded-xl border border-amber-600/30 bg-amber-50 p-8 text-center dark:border-emerald-400/30 dark:bg-emerald-400/5">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-emerald-300">
              Today's AI Challenge
            </span>
            <p className="mt-3 text-lg font-semibold sm:text-xl">
              Build a To-Do App using only AI assistance.
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Bonus: ask AI to explain recursion in three different ways once you're done.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Prompt Playground */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-slate-200 bg-[#f7f8fa] py-20 dark:border-slate-800/60 dark:bg-[#0d1117]">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Build your own"
              title="Prompt Playground"
              subtitle="Pick a goal, language, and level — we'll draft the prompt for you."
            />
          </Reveal>
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800/60 dark:bg-[#0a0e14]">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800/60">
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  prompt-playground.ts
                </span>
                <TrafficDots />
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-3">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Learning goal
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 dark:border-slate-700 dark:bg-[#0d1117] dark:text-slate-100"
                  >
                    {GOALS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Language
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 dark:border-slate-700 dark:bg-[#0d1117] dark:text-slate-100"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Level
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 dark:border-slate-700 dark:bg-[#0d1117] dark:text-slate-100"
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="px-6 pb-6">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:text-[#0a0e14] dark:hover:bg-emerald-400"
                >
                  <Wand2 className="h-4 w-4" />
                  {isGenerating ? "Generating…" : "Generate Prompt"}
                </button>
              </div>
              {isGenerating && (
                <div className="border-t border-slate-200 bg-[#f7f8fa] px-6 py-5 dark:border-slate-800/60 dark:bg-[#0d1117]">
                  <span className="inline-flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 dark:bg-emerald-400"
                        style={{ animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </span>
                </div>
              )}
              {generated && !isGenerating && (
                <div className="border-t border-slate-200 bg-[#f7f8fa] px-6 py-5 dark:border-slate-800/60 dark:bg-[#0d1117]">
                  <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {generated}
                  </pre>
                  <button
                    onClick={() => handleCopy("playground", generated)}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-amber-700 hover:underline dark:text-emerald-300"
                  >
                    {copiedId === "playground" ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy prompt
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Tips carousel */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-600 dark:text-emerald-400">
            AI Tips
          </span>
          <div className="mt-6 flex min-h-[64px] items-center justify-center px-4">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-lg font-medium sm:text-xl"
            >
              {TIPS[tipIndex]}
            </motion.p>
          </div>
          <div className="mt-5 flex justify-center gap-2">
            {TIPS.map((tip, idx) => (
              <button
                key={tip}
                aria-label={`Show tip ${idx + 1}`}
                onClick={() => setTipIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === tipIndex
                    ? "w-6 bg-amber-600 dark:bg-emerald-400"
                    : "w-1.5 bg-slate-300 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* AI vs Traditional Learning */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-slate-200 bg-[#f7f8fa] py-20 dark:border-slate-800/60 dark:bg-[#0d1117]">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <SectionHeading eyebrow="Why it works" title="AI vs Traditional Learning" />
          </Reveal>
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800/60">
              <div className="grid grid-cols-2 bg-white text-sm font-semibold dark:bg-[#0a0e14]">
                <div className="border-r border-b border-slate-200 px-5 py-3 dark:border-slate-800/60">
                  Traditional
                </div>
                <div className="border-b border-slate-200 px-5 py-3 text-amber-700 dark:border-slate-800/60 dark:text-emerald-300">
                  AI Learning
                </div>
              </div>
              {COMPARISON_ROWS.map((row) => (
                <div
                  key={row[0]}
                  className="grid grid-cols-2 bg-white text-sm last:[&>*]:border-b-0 dark:bg-[#0a0e14]"
                >
                  <div className="border-r border-b border-slate-200 px-5 py-3 text-slate-600 dark:border-slate-800/60 dark:text-slate-400">
                    {row[0]}
                  </div>
                  <div className="border-b border-slate-200 px-5 py-3 font-medium dark:border-slate-800/60">
                    {row[1]}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Common questions" />
        </Reveal>
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <Reveal key={faq.q}>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#f7f8fa] dark:border-slate-800/60 dark:bg-[#0d1117]">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold"
                  >
                    {faq.q}
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400">
                      {faq.a}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Community */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-slate-200 bg-[#f7f8fa] py-20 dark:border-slate-800/60 dark:bg-[#0d1117]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600/10 text-amber-700 dark:bg-emerald-400/10 dark:text-emerald-300">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">Learn out loud, together</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Share prompts, share AI-built projects, vote on useful prompts, and submit your own
              tutorials to CodeNFacts Community.
            </p>
            <Link
              href="/connect"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-amber-600/40 bg-white px-5 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-600/5 dark:border-emerald-400/40 dark:bg-transparent dark:text-emerald-300 dark:hover:bg-emerald-400/5"
            >
              Visit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Newsletter CTA */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Reveal>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600/10 text-amber-700 dark:bg-emerald-400/10 dark:text-emerald-300">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">Stay ahead of the curve</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Stay updated with the latest AI tools, prompts, tutorials, and coding workflows.
          </p>
          <Link
            href="/develop"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 dark:bg-emerald-500 dark:text-[#0a0e14] dark:hover:bg-emerald-400"
          >
            Join CodeNFacts Community
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}