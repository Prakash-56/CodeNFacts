"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  ChevronRight,
  Boxes,
  Code2,
  Terminal,
  Brain,
  Cpu,
  Database,
  GitBranch,
  Briefcase,
  Layers,
  FileText,
  Calculator,
  BarChart3,
  Globe,
  HelpCircle,
  ListChecks,
} from "lucide-react";


type Topic = {
  name: string;
  href: string;
  icon: React.ElementType;
  color: string;
  tagline: string;
};

const TOPICS: Topic[] = [
  { name: "Prerequisites", href: "/category/prerequisites", icon: ListChecks, color: "slate", tagline: "What to know before you start coding seriously." },
  { name: "DSA", href: "/category/dsa", icon: Boxes, color: "emerald", tagline: "Data structures & algorithms, from arrays to graphs." },
  { name: "Practice Questions", href: "/category/practice-questions", icon: Code2, color: "cyan", tagline: "Curated problems to drill every concept." },
  { name: "Python", href: "/category/python", icon: Terminal, color: "yellow", tagline: "Readable, versatile, and everywhere in AI/ML." },
  { name: "Java", href: "/category/java", icon: Code2, color: "orange", tagline: "OOP fundamentals and enterprise-grade backend skills." },
  { name: "C++", href: "/category/cpp", icon: Code2, color: "indigo", tagline: "Performance, STL, and competitive programming staples." },
  { name: "Road Map", href: "/category/road-map", icon: GitBranch, color: "teal", tagline: "A step-by-step path from beginner to job-ready." },
  { name: "Artificial Intelligence (AI)", href: "/category/artificial-intelligence-(ai)", icon: Brain, color: "violet", tagline: "The big picture: what AI is and how it actually works." },
  { name: "Machine Learning", href: "/category/machine-learning", icon: Cpu, color: "fuchsia", tagline: "Algorithms that learn patterns from data." },
  { name: "Data Science", href: "/category/data-science", icon: BarChart3, color: "sky", tagline: "Turning raw data into decisions." },
  { name: "SQL", href: "/category/sql", icon: Database, color: "blue", tagline: "Querying and managing relational data." },
  { name: "Web Dev", href: "/category/web-dev", icon: Globe, color: "cyan", tagline: "Full-stack skills to ship real products." },
  { name: "Git", href: "/category/git", icon: GitBranch, color: "orange", tagline: "Version control that every developer must master." },
  { name: "Interview Questions", href: "/category/interview-questions", icon: Briefcase, color: "rose", tagline: "Real questions asked at top tech companies." },
  { name: "Projects", href: "/category/projects", icon: Layers, color: "cyan", tagline: "Build real things to put on your resume." },
  { name: "Resume Tips", href: "/category/resume-tips", icon: FileText, color: "indigo", tagline: "Get past the ATS and into the interview room." },
  { name: "Aptitude", href: "/category/aptitude", icon: Calculator, color: "lime", tagline: "Quant, logical reasoning, and verbal prep for tests." },
  { name: "Quizzes", href: "/category/quizzes", icon: HelpCircle, color: "amber", tagline: "Test what you've learned, topic by topic." },
];

const colorClass: Record<string, string> = {
  slate:   "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-500/10",
  emerald: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
  cyan:    "text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10",
  blue:    "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10",
  amber:   "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
  indigo:  "text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10",
  yellow:  "text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10",
  teal:    "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10",
  orange:  "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10",
  violet:  "text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10",
  sky:     "text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10",
  fuchsia: "text-fuchsia-700 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-500/10",
  lime:    "text-lime-700 dark:text-lime-400 bg-lime-50 dark:bg-lime-500/10",
  rose:    "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10",
};

export default function TutorialsLibrary() {
  const [query, setQuery] = useState("");

  const filtered = TOPICS.filter((t) =>
    t.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 transition-colors duration-300">

      {/* Header */}
      <header className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-14">
        <div className="relative mx-auto max-w-6xl text-center">

          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-1.5 text-sm font-normal text-slate-600 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            {TOPICS.length} Core Topics
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Tutorials Library{" "}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl font-normal text-slate-500 dark:text-slate-400">
            Pick a topic to open its dedicated tutorial page.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-lg">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm">
              <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics... e.g. 'Python', 'SQL'"
                className="flex-1 bg-transparent text-sm font-normal text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="mx-auto max-w-6xl px-4 sm:px-8 py-12">
        {filtered.length === 0 ? (
          <p className="text-center text-sm font-normal text-slate-500 dark:text-slate-400 py-16">
            No topics match &quot;{query}&quot;.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((topic) => {
              const Icon = topic.icon;
              return (
                <Link
                  key={topic.name}
                  href={topic.href}
                  className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 text-left transition-all hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md dark:hover:shadow-slate-900/60 hover:-translate-y-0.5"
                >
                  <span className={`rounded-lg p-2.5 ${colorClass[topic.color]} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                      {topic.name}
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400 leading-snug">
                      {topic.tagline}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}