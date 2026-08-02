"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  X,
  ListChecks,
  Shuffle,
  BarChart3,
} from "lucide-react";
import {
  CATEGORIES,
  QUESTIONS,
  type Difficulty,
  type InterviewQuestion,
  type Visual,
} from "./data";

const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Beginner:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  Intermediate:
    "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  Advanced: "bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
};

const BOOKMARK_KEY = "cnf:iq:bookmarks";
const ANSWERED_KEY = "cnf:iq:answered";

function loadIdSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveIdSet(key: string, set: Set<string>) {
  try {
    window.localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    // localStorage unavailable (private browsing, quota) — fail silently
  }
}

// ---------------------------------------------------------------------------
// Visualization renderer — one component per Visual["type"]
// ---------------------------------------------------------------------------

function VisualAnswer({ visual }: { visual: Visual }) {
  if (visual.type === "compare") {
    return (
      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800/60">
        <div className="grid grid-cols-2 bg-slate-50 text-xs font-semibold uppercase tracking-wide dark:bg-slate-900/40">
          <div className="border-r border-slate-200 px-3 py-2 dark:border-slate-800/60">
            {visual.leftLabel}
          </div>
          <div className="px-3 py-2 text-amber-700 dark:text-emerald-300">{visual.rightLabel}</div>
        </div>
        {visual.rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-2 border-t border-slate-200 text-sm dark:border-slate-800/60"
          >
            <div className="border-r border-slate-200 px-3 py-2 text-slate-600 dark:border-slate-800/60 dark:text-slate-400">
              {row[0]}
            </div>
            <div className="px-3 py-2 font-medium">{row[1]}</div>
          </div>
        ))}
      </div>
    );
  }

  if (visual.type === "flow") {
    return (
      <ol className="mt-4 space-y-2">
        {visual.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-600/40 font-mono text-[11px] font-semibold text-amber-700 dark:border-emerald-400/40 dark:text-emerald-300">
              {i + 1}
            </span>
            <span className="pt-0.5 text-sm text-slate-700 dark:text-slate-300">{step}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (visual.type === "complexity") {
    const max = Math.max(...visual.rows.map((r) => r.value));
    return (
      <div className="mt-4 space-y-2.5">
        {visual.rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3 text-sm">
            <span className="w-24 shrink-0 font-mono text-xs text-slate-500 dark:text-slate-400">
              {row.label}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-amber-600 dark:bg-emerald-400"
                style={{ width: `${(row.value / max) * 100}%` }}
              />
            </div>
            <span className="w-40 shrink-0 text-xs text-slate-500 dark:text-slate-400">
              {row.note}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (visual.type === "tree") {
    return (
      <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-slate-200 py-5 dark:border-slate-800/60">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-600 font-mono text-xs font-semibold text-white dark:bg-emerald-500 dark:text-[#0a0e14]">
          {visual.root}
        </span>
        <div className="flex gap-8">
          {visual.children.map((node, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-600/40 font-mono text-xs font-semibold text-amber-700 dark:border-emerald-400/40 dark:text-emerald-300">
                {node.label}
              </span>
              {node.children && node.children.length > 0 && (
                <div className="flex gap-4">
                  {node.children.map((c, j) => (
                    <div key={j} className="flex flex-col items-center gap-2">
                      <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 font-mono text-[11px] dark:border-slate-700">
                        {c}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Question card
// ---------------------------------------------------------------------------

function QuestionCard({
  q,
  isOpen,
  isBookmarked,
  isAnswered,
  onToggleOpen,
  onToggleBookmark,
  onToggleAnswered,
}: {
  q: InterviewQuestion;
  isOpen: boolean;
  isBookmarked: boolean;
  isAnswered: boolean;
  onToggleOpen: () => void;
  onToggleBookmark: () => void;
  onToggleAnswered: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800/60 dark:bg-[#0a0e14]">
      <div className="flex items-start gap-2 px-4 py-3.5 sm:gap-3">
        <button
          onClick={onToggleAnswered}
          aria-label={isAnswered ? "Mark unanswered" : "Mark as understood"}
          className="mt-0.5 shrink-0 text-slate-300 transition hover:text-amber-600 dark:text-slate-700 dark:hover:text-emerald-400"
        >
          {isAnswered ? (
            <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-emerald-400" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        <button onClick={onToggleOpen} className="flex flex-1 items-start justify-between gap-3 text-left">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${DIFFICULTY_STYLES[q.difficulty]}`}
              >
                {q.difficulty}
              </span>
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-600">
                {q.category}
              </span>
            </div>
            <p className="text-sm font-semibold leading-snug sm:text-base">{q.question}</p>
          </div>
          <ChevronDown
            className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <button
          onClick={onToggleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
          className="mt-0.5 shrink-0 text-slate-300 transition hover:text-amber-600 dark:text-slate-700 dark:hover:text-emerald-400"
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-5 w-5 text-amber-600 dark:text-emerald-400" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800/60 sm:px-14">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{q.answer}</p>
          {q.visual && <VisualAnswer visual={q.visual} />}
          {q.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {q.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-500 dark:bg-slate-800/60 dark:text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type CategoryFilter = "All" | (typeof CATEGORIES)[number];
type ViewFilter = "all" | "bookmarked" | "unanswered";

export default function InterviewQuestionsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [view, setView] = useState<ViewFilter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  // Load persisted progress client-side only (avoids SSR/localStorage mismatch)
  useEffect(() => {
    setBookmarks(loadIdSet(BOOKMARK_KEY));
    setAnswered(loadIdSet(ANSWERED_KEY));
    setHydrated(true);
  }, []);

  function toggleBookmark(id: string) {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveIdSet(BOOKMARK_KEY, next);
      return next;
    });
  }

  function toggleAnswered(id: string) {
    setAnswered((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveIdSet(ANSWERED_KEY, next);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return QUESTIONS.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (difficulty !== "All" && item.difficulty !== difficulty) return false;
      if (view === "bookmarked" && !bookmarks.has(item.id)) return false;
      if (view === "unanswered" && answered.has(item.id)) return false;
      if (
        q &&
        !item.question.toLowerCase().includes(q) &&
        !item.tags.some((t) => t.toLowerCase().includes(q))
      )
        return false;
      return true;
    });
  }, [query, category, difficulty, view, bookmarks, answered]);

  const visible = filtered.slice(0, visibleCount);

  function jumpToRandom() {
    const pool = filtered.length > 0 ? filtered : QUESTIONS;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setOpenId(pick.id);
    requestAnimationFrame(() => {
      document.getElementById(`q-${pick.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  const total = QUESTIONS.length;
  const answeredCount = answered.size;
  const progressPct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-[#0a0e14] dark:text-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-[#f7f8fa] dark:border-slate-800/60 dark:bg-[#0d1117]">
        <div className="mx-auto max-w-5xl px-6 py-14 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-600 dark:text-emerald-400">
            CodeNFacts Prep
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Interview Questions, Visualized
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            {total}+ questions across {CATEGORIES.length} topics — search, filter by difficulty,
            and see the trickier answers as diagrams and comparisons, not just paragraphs.
          </p>

          {hydrated && (
            <div className="mx-auto mt-6 max-w-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" /> Your progress
                </span>
                <span>
                  {answeredCount} / {total}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-amber-600 transition-all dark:bg-emerald-400"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Controls */}
      <section className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800/60 dark:bg-[#0a0e14]/90">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisibleCount(20);
                }}
                placeholder="Search questions or tags (e.g. 'closures', 'CAP theorem')"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-9 text-sm dark:border-slate-700 dark:bg-[#0d1117]"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={jumpToRandom}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold transition hover:border-amber-600/50 hover:text-amber-700 dark:border-slate-700 dark:hover:border-emerald-400/50 dark:hover:text-emerald-300"
            >
              <Shuffle className="h-4 w-4" />
              Surprise me
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as CategoryFilter);
                setVisibleCount(20);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium dark:border-slate-700 dark:bg-[#0d1117]"
            >
              <option value="All">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex gap-1 rounded-lg border border-slate-300 p-0.5 dark:border-slate-700">
              {(["All", ...DIFFICULTIES] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDifficulty(d);
                    setVisibleCount(20);
                  }}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    difficulty === d
                      ? "bg-amber-600 text-white dark:bg-emerald-500 dark:text-[#0a0e14]"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex gap-1 rounded-lg border border-slate-300 p-0.5 dark:border-slate-700">
              {[
                { key: "all", label: "All" },
                { key: "bookmarked", label: "Bookmarked" },
                { key: "unanswered", label: "Unanswered" },
              ].map((v) => (
                <button
                  key={v.key}
                  onClick={() => {
                    setView(v.key as ViewFilter);
                    setVisibleCount(20);
                  }}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    view === v.key
                      ? "bg-amber-600 text-white dark:bg-emerald-500 dark:text-[#0a0e14]"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {v.key === "bookmarked" && <Bookmark className="h-3 w-3" />}
                  {v.key === "unanswered" && <ListChecks className="h-3 w-3" />}
                  {v.label}
                </button>
              ))}
            </div>

            <span className="ml-auto font-mono text-xs text-slate-400 dark:text-slate-600">
              {filtered.length} match{filtered.length === 1 ? "" : "es"}
            </span>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        {visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No questions match those filters. Try clearing the search or picking "All categories".
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((q) => (
              <div id={`q-${q.id}`} key={q.id}>
                <QuestionCard
                  q={q}
                  isOpen={openId === q.id}
                  isBookmarked={bookmarks.has(q.id)}
                  isAnswered={answered.has(q.id)}
                  onToggleOpen={() => setOpenId((cur) => (cur === q.id ? null : q.id))}
                  onToggleBookmark={() => toggleBookmark(q.id)}
                  onToggleAnswered={() => toggleAnswered(q.id)}
                />
              </div>
            ))}
          </div>
        )}

        {visibleCount < filtered.length && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setVisibleCount((c) => c + 20)}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold transition hover:border-amber-600/50 hover:text-amber-700 dark:border-slate-700 dark:hover:border-emerald-400/50 dark:hover:text-emerald-300"
            >
              Load {Math.min(20, filtered.length - visibleCount)} more
            </button>
          </div>
        )}
      </section>
    </main>
  );
}