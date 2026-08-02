"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  Terminal,
  Code2,
  Brain,
  Calculator,
  GitBranch,
  Flame,
  Layers,
  Sparkles,
  Clock,
  Target,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Repeat,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

// ---------------------------------------------------------------------------
// Content data
// ---------------------------------------------------------------------------
interface Prereq {
  icon: React.ElementType;
  title: string;
  tag: string;
  points: string[];
}

const prerequisites: Prereq[] = [
  {
    icon: Repeat,
    title: "Consistency Over Intensity",
    tag: "mindset.consistency",
    points: [
      "Showing up daily beats a single 8-hour burnout session — your brain needs repeated, spaced exposure to actually retain syntax and patterns.",
      "Track a streak, not a sprint. Missing one day is fine; missing a week resets your momentum, not your knowledge.",
      "Small, boring, repeated reps compound into skill. That's the entire secret — there's no shortcut around it.",
    ],
  },
  {
    icon: Code2,
    title: "Pick One Language First",
    tag: "lang.core === true",
    points: [
      "Don't jump between Python, JS, and C++ in week one. Choose one (Python or JavaScript are great starting points) and go deep.",
      "Cover the entire fundamentals in that language before touching a second one: variables, data types, loops, conditionals, functions, scope, OOP, error handling, and its standard library.",
      "Once you can think in one language without Googling basic syntax, learning a second language takes days, not months — the concepts transfer, only the syntax changes.",
    ],
  },
  {
    icon: Calculator,
    title: "Mathematics for Coding",
    tag: "math.required",
    points: [
      "You don't need to be a math genius, but discrete math, logic, sets, and basic combinatorics directly power algorithmic thinking.",
      "Boolean logic and conditionals are literally propositional logic — understanding truth tables makes debugging conditions trivial.",
      "Big-O notation, recursion, and complexity analysis are rooted in basic algebra and exponential/logarithmic growth — this is why math and DSA are taught together.",
      "If you're heading into AI/ML, add linear algebra, probability, and statistics to your stack — they're non-negotiable there.",
    ],
  },
  {
    icon: GitBranch,
    title: "About Algorithms",
    tag: "algorithms.core",
    points: [
      "An algorithm is just a precise, step-by-step recipe to solve a problem — learn to write pseudocode before you write real code.",
      "Master the core families: searching, sorting, recursion, divide & conquer, greedy, backtracking, and dynamic programming.",
      "Always ask three questions after solving a problem: What's the time complexity? What's the space complexity? Can it be done better?",
    ],
  },
  {
    icon: Layers,
    title: "About DSA (Data Structures & Algorithms)",
    tag: "dsa.foundation",
    points: [
      "Data structures are how you store and organize data efficiently: arrays, linked lists, stacks, queues, trees, graphs, heaps, and hash maps.",
      "Every DSA topic exists to answer one question — how do I access, insert, or delete data as fast as possible for this specific use case?",
      "DSA is the single highest-leverage skill for technical interviews. Companies test it because it reveals how you think, not just what you know.",
      "Practice on paper/whiteboard occasionally — tracing pointers and recursion by hand builds intuition that typing code alone won't.",
    ],
  },
  {
    icon: Flame,
    title: "Stay Motivated",
    tag: "mindset.motivation",
    points: [
      "You will get stuck. Debugging for hours over a missing semicolon or an off-by-one error is part of the job, not a sign you're bad at this.",
      "Progress in coding is invisible day-to-day and obvious month-to-month. Judge yourself on a 30-day window, not a single session.",
      "Surround yourself with a community (like CodeNFacts Connect) — accountability and shared struggle make the grind lighter.",
      "Celebrate small wins: your first working loop, your first solved problem, your first project deployed. They all count.",
    ],
  },
  {
    icon: Clock,
    title: "Code Daily — 1.5 to 2 Hours",
    tag: "practice.dailyMinimum",
    points: [
      "Block a fixed 1.5–2 hour window every day. Same time, same place if possible — habit sticks to routine, not motivation.",
      "Split it: ~45 min learning a new concept, ~45 min applying it (solving problems or building), ~15–30 min revising yesterday's topic.",
      "Two focused hours daily for a year outperforms sporadic 6-hour weekend cramming — spaced repetition wins over cramming, every time.",
      "Use the Brain Arena mini-games on CodeNFacts to keep daily practice fun and low-friction on lighter days.",
    ],
  },
  {
    icon: Brain,
    title: "Logic Building",
    tag: "logic.training",
    points: [
      "Before writing code, write the logic in plain English or pseudocode. If you can't explain the steps, you can't code the solution.",
      "Practice dry-running your code by hand — trace variable values line by line for loops and recursive calls.",
      "Solve logic puzzles and brain teasers outside of coding too — pattern recognition transfers directly into problem decomposition.",
      "Break every big problem into smaller sub-problems. This single habit is what separates strong programmers from stuck ones.",
    ],
  },
  {
    icon: Sparkles,
    title: "Innovation & Building",
    tag: "projects.apply",
    points: [
      "Fundamentals are only useful once applied — build real projects, even small ones, as soon as you know enough to be dangerous.",
      "Don't wait to feel 'ready.' Innovation comes from solving problems you actually care about with the tools you currently have.",
      "Recreate something that exists, then add your own twist — this is the fastest way to learn real-world architecture decisions.",
      "Ship it. A finished, imperfect project teaches more than a perfect one that never leaves your laptop.",
    ],
  },
  {
    icon: Terminal,
    title: "Frameworks — Learn After Fundamentals",
    tag: "frameworks.next",
    points: [
      "Frameworks (React, Next.js, Express, Django, Flask, Spring) are productivity tools built on top of core language fundamentals — they amplify skill, they don't replace it.",
      "If you jump to a framework before understanding the language underneath, you'll copy-paste code you don't understand and get stuck the moment something breaks.",
      "Recommended order: master the language → build a few things vanilla (no framework) → then learn a framework to speed up real-world development.",
      "Frontend track: HTML/CSS/JS fundamentals → React → Next.js. Backend track: core language → Node/Express or Django/Flask → databases & APIs.",
    ],
  },
];

const quickChecklist = [
  "Chose ONE language and stuck with it for the fundamentals phase",
  "Comfortable with variables, loops, functions, and OOP basics",
  "Understand time & space complexity (Big-O) at a basic level",
  "Can write pseudocode before writing actual code",
  "Coding at least 1.5–2 hours daily, consistently",
  "Solved DSA problems on arrays, strings, and recursion",
  "Built at least one small project end-to-end",
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function PrerequisitesPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] dark:bg-[#0a0e14] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Terminal-chrome header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117] shadow-sm overflow-hidden mb-10"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0a0e14]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs font-mono text-black/50 dark:text-white/40">
              Prerequisites
            </span>
          </div>
          <div className="px-6 sm:px-10 py-10 sm:py-14 text-center">
            <p className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:bg-emerald-400/10 dark:text-[#34d399] mb-4">
              <Terminal size={14} /> before-you-start.md
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-4">
              Prerequisites for{" "}
              <span className="text-amber-600 dark:text-[#34d399]">
                Coding Mastery
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-black/60 dark:text-white/60">
              Before you dive into DSA, frameworks, or internship tracks - build
              the foundation. Here's everything CodeNFacts recommends every
              learner internalize first.
            </p>
          </div>
        </motion.div>

        {/* Prerequisite cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {prerequisites.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={i}
                className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117] p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="shrink-0 w-11 h-11 rounded-lg bg-amber-500/10 dark:bg-emerald-400/10 flex items-center justify-center">
                    <Icon
                      size={20}
                      className="text-amber-600 dark:text-[#34d399]"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white leading-tight">
                      {item.title}
                    </h2>
                    <span className="text-[11px] font-mono text-black/40 dark:text-white/30">
                      {item.tag}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {item.points.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex gap-2 text-sm text-black/70 dark:text-white/70 leading-relaxed"
                    >
                      <span className="text-amber-500 dark:text-[#34d399] mt-1 shrink-0">
                        ▸
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Quick checklist */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          custom={0}
          className="mt-10 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117] p-6 sm:p-8 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={18} className="text-amber-600 dark:text-[#34d399]" />
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Quick Self-Check
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickChecklist.map((check, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-sm text-black/70 dark:text-white/70"
              >
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-amber-600 dark:text-[#34d399]"
                />
                <span>{check}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          custom={1}
          className="mt-10 rounded-xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-amber-500/10 to-transparent dark:from-emerald-400/10 dark:to-transparent p-6 sm:p-8 text-center"
        >
          <div className="flex justify-center mb-3">
            <Target size={22} className="text-amber-600 dark:text-[#34d399]" />
          </div>
          <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
            Ready to put this into practice?
          </h3>
          <p className="text-sm text-black/60 dark:text-white/60 mb-6 max-w-xl mx-auto">
            Head into the DSA track or warm up daily with a Brain Arena
            mini-game — either way, consistency starts today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/dsa"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 dark:bg-[#34d399] text-white dark:text-[#0a0e14] text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start DSA Track <ArrowRight size={16} />
            </Link>
            <Link
              href="/develop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-black/10 dark:border-white/10 text-black dark:text-white text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Explore Brain Arena
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}