"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Code2,
  Layers,
  Server,
  Brain,
  Cloud,
  PenTool,
  Check,
  RotateCcw,
  ArrowRight,
  ArrowUpRight,
  MessagesSquare,
} from "lucide-react";

/**
 * app/category/road-map/page.tsx
 * --------------------------------
 * The roadmap browser for CodeNFacts. Six roadmaps (DSA, Frontend, Backend,
 * AI/ML, DevOps, UI/UX), each broken into six topics presented as a
 * numbered path — order matters here, since a roadmap is a sequence to
 * follow, not just a list to skim.
 *
 * Completion is tracked in local component state so a person can check
 * off topics as they go and see a progress bar per roadmap.
 *
 * TODO(backend): progress currently lives in useState and resets on
 * refresh. Replace `completed` / `toggleComplete` with reads/writes to
 * the user's account (e.g. POST /api/progress { roadmapId, topicId })
 * so progress persists across sessions and devices.
 */

// ---------------------------------------------------------------------------
// Roadmap data — topic order is the intended learning sequence
// ---------------------------------------------------------------------------

interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  questionCount: number;
}

interface Roadmap {
  id: string;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  topics: RoadmapTopic[];
}

const roadmaps: Roadmap[] = [
  {
    id: "dsa",
    title: "DSA & Algorithms",
    tagline: "The reasoning behind almost every technical interview.",
    icon: Code2,
    topics: [
      { id: "arrays-strings", title: "Arrays & Strings", description: "The building blocks of almost every interview question.", questionCount: 20 },
      { id: "recursion", title: "Recursion", description: "Functions that call themselves to shrink a problem.", questionCount: 20 },
      { id: "sorting", title: "Sorting Algorithms", description: "How order gets imposed on chaos, and at what cost.", questionCount: 20 },
      { id: "linked-lists", title: "Linked Lists", description: "Nodes connected by pointers instead of index math.", questionCount: 20 },
      { id: "trees-graphs", title: "Trees & Graphs", description: "Data that branches — from file systems to social networks.", questionCount: 20 },
      { id: "dynamic-programming", title: "Dynamic Programming", description: "Solving overlapping subproblems once instead of over and over.", questionCount: 20 },
    ],
  },
  {
    id: "frontend",
    title: "Frontend Engineering",
    tagline: "Components, state, and everything a user actually sees.",
    icon: Layers,
    topics: [
      { id: "react-fundamentals", title: "React Fundamentals", description: "Components, props, state, and the render cycle.", questionCount: 20 },
      { id: "nextjs-app-router", title: "Next.js App Router", description: "File-based routing, server components, and layouts.", questionCount: 20 },
      { id: "state-management", title: "State Management", description: "Keeping data in sync across a growing app.", questionCount: 20 },
      { id: "tailwind-styling", title: "Tailwind & Styling", description: "Utility-first CSS and building a consistent design system.", questionCount: 20 },
      { id: "performance-rendering", title: "Performance & Rendering", description: "Making pages fast and keeping them that way.", questionCount: 20 },
      { id: "typescript-react", title: "TypeScript for React", description: "Catching bugs at compile time, not in production.", questionCount: 20 },
    ],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    tagline: "The server-side logic that powers what the frontend shows.",
    icon: Server,
    topics: [
      { id: "rest-api-design", title: "REST API Design", description: "Resources, verbs, and predictable responses.", questionCount: 20 },
      { id: "nodejs-express", title: "Node.js & Express", description: "JavaScript on the server, request by request.", questionCount: 20 },
      { id: "auth-security", title: "Authentication & Security", description: "Proving who someone is, and keeping data safe.", questionCount: 20 },
      { id: "databases-orms", title: "Databases & ORMs", description: "Storing and querying data reliably at scale.", questionCount: 20 },
      { id: "firebase-backend", title: "Firebase Backend", description: "Auth, Firestore, and Storage without managing servers.", questionCount: 20 },
      { id: "testing-apis", title: "Testing APIs", description: "Catching bugs before your users do.", questionCount: 20 },
    ],
  },
  {
    id: "ai-ml",
    title: "AI/ML Engineering",
    tagline: "How models are built, tuned, and shipped to real users.",
    icon: Brain,
    topics: [
      { id: "neural-networks", title: "Neural Networks", description: "Layers of weighted math that learn from examples.", questionCount: 20 },
      { id: "prompt-engineering", title: "Prompt Engineering", description: "Getting reliable output from a language model.", questionCount: 20 },
      { id: "llm-fundamentals", title: "LLM Fundamentals", description: "How large language models actually work under the hood.", questionCount: 20 },
      { id: "embeddings-vector-search", title: "Embeddings & Vector Search", description: "Turning meaning into numbers you can search.", questionCount: 20 },
      { id: "model-training", title: "Model Training & Fine-tuning", description: "Adapting a model to your data and task.", questionCount: 20 },
      { id: "ml-in-production", title: "ML in Production", description: "Getting a model from notebook to real users.", questionCount: 20 },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    tagline: "Shipping code safely, then keeping it running.",
    icon: Cloud,
    topics: [
      { id: "git-version-control", title: "Git & Version Control", description: "Tracking every change, and undoing the bad ones.", questionCount: 20 },
      { id: "ci-cd", title: "CI/CD Pipelines", description: "Automating tests, builds, and deploys.", questionCount: 20 },
      { id: "docker-containers", title: "Docker & Containers", description: "Packaging an app so it runs the same everywhere.", questionCount: 20 },
      { id: "linux-terminal", title: "Linux & Terminal", description: "The command line every server actually runs on.", questionCount: 20 },
      { id: "cloud-deployment", title: "Cloud Deployment", description: "Getting your app onto real infrastructure.", questionCount: 20 },
      { id: "monitoring-logging", title: "Monitoring & Logging", description: "Knowing something broke before your users tell you.", questionCount: 20 },
    ],
  },
  {
    id: "uiux",
    title: "UI/UX Design",
    tagline: "Designing interfaces people understand without thinking.",
    icon: PenTool,
    topics: [
      { id: "design-fundamentals", title: "Design Fundamentals", description: "The rules that make an interface feel obvious.", questionCount: 20 },
      { id: "figma-workflow", title: "Figma Workflow", description: "From blank canvas to developer-ready file.", questionCount: 20 },
      { id: "accessibility", title: "Accessibility", description: "Designing for every user, not just the average one.", questionCount: 20 },
      { id: "design-systems", title: "Design Systems", description: "One source of truth for how a product should look.", questionCount: 20 },
      { id: "user-research", title: "User Research", description: "Designing from what users actually do, not assumptions.", questionCount: 20 },
      { id: "prototyping-handoff", title: "Prototyping & Handoff", description: "Turning static screens into something that feels real.", questionCount: 20 },
    ],
  },
];

const totalTopics = roadmaps.reduce((sum, r) => sum + r.topics.length, 0);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RoadmapCategoryPage() {
  const [activeRoadmapId, setActiveRoadmapId] = useState(roadmaps[0].id);
  // key = `${roadmapId}:${topicId}` -> completed
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const activeRoadmap = roadmaps.find((r) => r.id === activeRoadmapId) ?? roadmaps[0];

  const progress = useMemo(() => {
    const done = activeRoadmap.topics.filter(
      (t) => completed[`${activeRoadmap.id}:${t.id}`]
    ).length;
    const total = activeRoadmap.topics.length;
    return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
  }, [activeRoadmap, completed]);

  const toggleComplete = (topicId: string) => {
    const key = `${activeRoadmap.id}:${topicId}`;
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetProgress = () => {
    setCompleted((prev) => {
      const next = { ...prev };
      activeRoadmap.topics.forEach((t) => {
        delete next[`${activeRoadmap.id}:${t.id}`];
      });
      return next;
    });
  };

  const selectRoadmap = (id: string) => {
    setActiveRoadmapId(id);
    document.getElementById("roadmap-path")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="w-full bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero */}
      <section className="relative border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-1.5 text-sm font-normal text-slate-600 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              {roadmaps.length} roadmaps · {totalTopics} topics
            </span>
          </div>
          <h1 className="text-center text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Follow a{" "}
            <span className="text-emerald-600 dark:text-emerald-400">roadmap</span>,
            not a random search
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base sm:text-lg font-normal text-slate-500 dark:text-slate-400">
            Pick a track, work through it top to bottom, and check off each
            topic as you go. Every step links straight into the AI tutor for
            that exact subject.
          </p>
        </div>
      </section>

      {/* Roadmap picker */}
      <section className="px-4 sm:px-8 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roadmaps.map((rm) => {
              const Icon = rm.icon;
              const isActive = rm.id === activeRoadmapId;
              const rmDone = rm.topics.filter((t) => completed[`${rm.id}:${t.id}`]).length;
              const rmPct = Math.round((rmDone / rm.topics.length) * 100);
              return (
                <button
                  key={rm.id}
                  onClick={() => selectRoadmap(rm.id)}
                  className={`text-left rounded-xl border p-5 transition-all ${
                    isActive
                      ? "border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isActive
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                      {rm.topics.length} topics
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {rm.title}
                  </h3>
                  <p className="mt-1 text-xs font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
                    {rm.tagline}
                  </p>
                  <div className="mt-4 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${rmPct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    {rmDone}/{rm.topics.length} complete
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Path for the active roadmap */}
      <section id="roadmap-path" className="px-4 sm:px-8 py-12 scroll-mt-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-mono uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">
                {activeRoadmap.title} path
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
                {progress.done} of {progress.total} topics complete
              </h2>
            </div>
            <button
              onClick={resetProgress}
              disabled={progress.done === 0}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset progress
            </button>
          </div>

          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-10">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progress.pct}%` }}
            />
          </div>

          {/* Numbered path */}
          <div className="relative">
            <div className="absolute left-[27px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" />
            <ol className="space-y-6">
              {activeRoadmap.topics.map((topic, i) => {
                const key = `${activeRoadmap.id}:${topic.id}`;
                const isDone = !!completed[key];
                return (
                  <li key={topic.id} className="relative flex gap-5">
                    <button
                      onClick={() => toggleComplete(topic.id)}
                      aria-label={isDone ? `Mark ${topic.title} as not done` : `Mark ${topic.title} as done`}
                      className={`relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-semibold transition-colors ${
                        isDone
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-400 dark:text-slate-500 hover:border-emerald-400 hover:text-emerald-500"
                      }`}
                    >
                      {isDone ? <Check className="h-5 w-5" /> : String(i + 1).padStart(2, "0")}
                    </button>

                    <div
                      className={`flex-1 rounded-xl border p-5 transition-colors ${
                        isDone
                          ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3
                          className={`text-base font-semibold ${
                            isDone
                              ? "text-emerald-700 dark:text-emerald-300 line-through decoration-emerald-400/60"
                              : "text-slate-800 dark:text-slate-100"
                          }`}
                        >
                          {topic.title}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {topic.questionCount}+ questions
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
                        {topic.description}
                      </p>
                      <Link
                        href={`/learning-ai?roadmap=${activeRoadmap.id}&topic=${topic.id}`}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                      >
                        <MessagesSquare className="h-3.5 w-3.5" />
                        Ask the AI tutor about this
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Done with {activeRoadmap.title}?
          </h3>
          <p className="mt-3 text-slate-500 dark:text-slate-400 font-normal">
            Pick another track above, or explore every topic and question in
            one place.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/ai"
              className="group inline-flex items-center rounded-full bg-emerald-600 dark:bg-emerald-500 px-7 py-3.5 font-semibold text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors"
            >
              Open the AI tutor
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/category"
              className="group inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300 transition-colors"
            >
              Browse other categories
              <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}