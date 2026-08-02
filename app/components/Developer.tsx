"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FileCode2,
  FileTerminal,
  Coffee,
  Cpu,
  Bot,
  GitBranch,
  Braces,
  FileJson,
  Regex,
  Globe2,
  Boxes,
  BookOpenCheck,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";


type Category = "All" | "Editors & Compilers" | "AI Tools" | "Utilities" | "Learning";

type Tool = {
  id: string;
  name: string;
  description: string;
  href: string;
  category: Category;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  badge?: "New" | "Popular" | "Free";
};

const CATEGORIES: Category[] = [
  "All",
  "Editors & Compilers",
  "AI Tools",
  "Utilities",
  "Learning",
];

const TOOLS: Tool[] = [
  {
    id: "html",
    name: "HTML Editor",
    description: "Write and preview HTML, CSS & JS live, right in the browser.",
    href: "/editor/html",
    category: "Editors & Compilers",
    icon: FileCode2,
    gradient: "from-emerald-500 to-teal-500",
    badge: "Popular",
  },
  {
    id: "python",
    name: "Python Compiler",
    description: "Run Python scripts instantly with no installs or setup.",
    href: "/compiler/python",
    category: "Editors & Compilers",
    icon: FileTerminal,
    gradient: "from-teal-500 to-cyan-500",
    badge: "Popular",
  },
  {
    id: "java",
    name: "Java Compiler",
    description: "Compile and run Java programs straight from your browser.",
    href: "/compiler/java",
    category: "Editors & Compilers",
    icon: Coffee,
    gradient: "from-cyan-500 to-emerald-500",
  },
  {
    id: "c",
    name: "C Compiler",
    description: "Test C programs fast with an in-browser GCC sandbox.",
    href: "/compiler/c",
    category: "Editors & Compilers",
    icon: Cpu,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    id: "ai-tutor",
    name: "AI Code Tutor",
    description: "Get unstuck with an AI that explains errors and reviews your code.",
    href: "/ai/tutor",
    category: "AI Tools",
    icon: Bot,
    gradient: "from-emerald-500 to-cyan-500",
    badge: "New",
  },
  {
    id: "dsa-visualizer",
    name: "DSA Visualizer",
    description: "Watch sorting, trees & graphs animate step by step.",
    href: "/learn/dsa-visualizer",
    category: "Learning",
    icon: Boxes,
    gradient: "from-teal-500 to-emerald-500",
    badge: "New",
  },
  {
    id: "regex",
    name: "Regex Tester",
    description: "Build and debug regular expressions with live match highlighting.",
    href: "/tools/regex",
    category: "Utilities",
    icon: Regex,
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    id: "json",
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON in a single click.",
    href: "/tools/json-formatter",
    category: "Utilities",
    icon: FileJson,
    gradient: "from-emerald-500 to-teal-500",
    badge: "Free",
  },
  {
    id: "api-tester",
    name: "API Request Tester",
    description: "Send GET/POST requests and inspect responses without leaving the site.",
    href: "/tools/api-tester",
    category: "Utilities",
    icon: Globe2,
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    id: "snippets",
    name: "Snippet Library",
    description: "Searchable, copy-ready snippets for every language you're learning.",
    href: "/tools/snippets",
    category: "Utilities",
    icon: Braces,
    gradient: "from-cyan-500 to-emerald-500",
    badge: "Free",
  },
  {
    id: "git-cheatsheet",
    name: "Git Cheat Sheet",
    description: "Every Git command you'll actually use, organized by workflow.",
    href: "/learn/git-cheatsheet",
    category: "Learning",
    icon: GitBranch,
    gradient: "from-emerald-500 to-cyan-500",
  },
  {
    id: "roadmaps",
    name: "Learning Roadmaps",
    description: "Structured paths for DSA, Web Dev, and AI/ML — start to finish.",
    href: "/learn/roadmaps",
    category: "Learning",
    icon: BookOpenCheck,
    gradient: "from-teal-500 to-emerald-500",
    badge: "Popular",
  },
];

const BADGE_STYLES: Record<NonNullable<Tool["badge"]>, string> = {
  New:     "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
  Popular: "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
  Free:    "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
};

export default function DevelopersToolbox() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredTools = useMemo(
    () =>
      activeCategory === "All"
        ? TOOLS
        : TOOLS.filter((tool) => tool.category === activeCategory),
    [activeCategory]
  );

  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-slate-950 py-20 px-4 sm:px-8 transition-colors duration-300">

      <div className="relative mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-1.5 text-sm font-normal text-slate-600 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            Everything you need, in one place
          </span>

          <h2 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
            The Developer&rsquo;s Toolbox{" "}
          </h2>

          <p className="mt-3 text-base font-normal leading-relaxed text-slate-500 dark:text-slate-400">
            Compilers, AI assistance, utilities, and learning resources -
            every tool on CodeNFacts, organized so you spend less time
            searching and more time building.
          </p>
        </div>

        {/* Trust strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-normal text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            {TOOLS.length} tools &amp; counting
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            No installs required
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            Free to use
          </span>
        </div>

        {/* Category filter */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-normal transition-colors duration-200 ${
                  isActive
                    ? "border-transparent bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Tool grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md dark:hover:shadow-slate-900/60"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${tool.gradient} shadow-sm`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </span>

                  {tool.badge && (
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-normal ${BADGE_STYLES[tool.badge]}`}>
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-medium text-slate-900 dark:text-white">
                    {tool.name}
                  </h3>
                  <p className="mt-1.5 text-sm font-normal leading-relaxed text-slate-500 dark:text-slate-400">
                    {tool.description}
                  </p>
                </div>

                <span className="mt-auto flex items-center gap-1 text-sm font-normal text-slate-500 dark:text-slate-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Open tool
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <p className="mt-10 text-center text-sm font-normal text-slate-500 dark:text-slate-400">
            No tools in this category yet - check back soon.
          </p>
        )}
      </div>
    </section>
  );
}