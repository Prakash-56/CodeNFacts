// app/practice/page.tsx
"use client";

import { useState } from "react";
import {
  Code2,
  Brain,
  Target,
  Lightbulb,
  Clock,
  BookOpen,
  Layers,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function PracticePage() {
  const [activeTip, setActiveTip] = useState(0);

  const practiceAreas = [
    {
      title: "Data Structures",
      items: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Heaps & Hash Maps"],
      icon: <Layers className="w-5 h-5" />,
    },
    {
      title: "Algorithms",
      items: ["Sorting & Searching", "Two Pointers", "Sliding Window", "Dynamic Programming"],
      icon: <Brain className="w-5 h-5" />,
    },
    {
      title: "Problem Solving Patterns",
      items: ["Backtracking", "Greedy", "Binary Search", "Recursion & Memoization"],
      icon: <Target className="w-5 h-5" />,
    },
    {
      title: "System Design Basics",
      items: ["Complexity Analysis", "Trade-offs", "Scalability Thinking", "Edge Cases"],
      icon: <Code2 className="w-5 h-5" />,
    },
  ];

  const importantTips = [
    {
      title: "Understand before coding",
      desc: "Spend 5–10 minutes clarifying constraints, edge cases, and expected output before writing a single line.",
    },
    {
      title: "Start with brute force",
      desc: "Get a correct (even if slow) solution first. Optimize only after you have a working baseline.",
    },
    {
      title: "Talk through your approach",
      desc: "Explain your thought process out loud. This is how interviews work and it improves your own clarity.",
    },
    {
      title: "Test edge cases early",
      desc: "Empty input, single element, duplicates, negatives, overflow — catch them before they catch you.",
    },
    {
      title: "Analyze time & space",
      desc: "Always state Big-O for both time and space. Interviewers care about this as much as correctness.",
    },
    {
      title: "Review & refine",
      desc: "After solving, revisit the problem 2–3 days later. Can you solve it faster? With better space?",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-zinc-950 dark:to-purple-950/20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Practice Hub</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Practice Coding
            <span className="block text-indigo-600 dark:text-indigo-400">
              Questions
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-8 leading-relaxed">
            Master the art of solving coding problems with structured practice.
            We are building fully optimized practice sections that cover every
            major topic - coming very soon.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-sm font-medium">
            <Clock className="w-4 h-4" />
            Fully optimized practice modules launching soon
          </div>
        </div>
      </section>

      {/* What to Practice */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">What You Should Practice</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {practiceAreas.map((area) => (
            <div
              key={area.title}
              className="group p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
                {area.icon}
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {area.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {area.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Diagram / Sketch Section */}
      <section className="bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              How to Approach a Problem
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Simple flowchart sketch */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-6">
                Problem-Solving Flow
              </p>
              <div className="flex flex-col items-center gap-3">
                {[
                  { label: "Read & Clarify", color: "bg-blue-500" },
                  { label: "Examples & Edge Cases", color: "bg-indigo-500" },
                  { label: "Brute Force Idea", color: "bg-violet-500" },
                  { label: "Optimize", color: "bg-purple-500" },
                  { label: "Code & Test", color: "bg-fuchsia-500" },
                  { label: "Analyze Complexity", color: "bg-pink-500" },
                ].map((step, i) => (
                  <div key={step.label} className="w-full flex flex-col items-center">
                    <div
                      className={`w-full max-w-xs py-3 px-4 rounded-xl text-center text-white text-sm font-medium ${step.color}`}
                    >
                      {step.label}
                    </div>
                    {i < 5 && (
                      <div className="w-0.5 h-4 bg-zinc-300 dark:bg-zinc-600 my-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Complexity sketch */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-500" />
                  Time Complexity Hierarchy
                </h3>
                <div className="space-y-2 font-mono text-sm">
                  {[
                    { bigO: "O(1)", label: "Constant", width: "w-12" },
                    { bigO: "O(log n)", label: "Logarithmic", width: "w-20" },
                    { bigO: "O(n)", label: "Linear", width: "w-32" },
                    { bigO: "O(n log n)", label: "Linearithmic", width: "w-44" },
                    { bigO: "O(n²)", label: "Quadratic", width: "w-56" },
                    { bigO: "O(2ⁿ)", label: "Exponential", width: "w-full" },
                  ].map((item) => (
                    <div key={item.bigO} className="flex items-center gap-3">
                      <span className="w-20 text-zinc-500 dark:text-zinc-400 shrink-0">
                        {item.bigO}
                      </span>
                      <div
                        className={`h-6 rounded ${item.width} bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80`}
                      />
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
                <h3 className="font-semibold mb-3">Quick Mental Model</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Think of every problem as a transformation of input → output.
                  Identify the pattern first (two pointers? hash map? tree
                  traversal?). The data structure you choose often decides the
                  complexity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Things to Keep in Mind */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Important Things to Keep in Mind
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {importantTips.map((tip, idx) => (
            <div
              key={tip.title}
              onMouseEnter={() => setActiveTip(idx)}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-default ${
                activeTip === idx
                  ? "border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 shadow-md"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-semibold mb-1.5">{tip.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}