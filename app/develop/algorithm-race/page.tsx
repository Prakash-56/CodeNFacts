"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Search,
  ArrowUpDown,
  GitBranch,
  Hash,
  Network,
  Brain,
  Heart,
  CheckCircle2,
  XCircle,
  Trophy,
  Flame,
  RotateCcw,
  ChevronRight,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { RACE_QUESTIONS, type RaceCategory, type RaceQuestion } from "./questions";

// ============================================================
// CONFIG
// ============================================================

const STARTING_LIVES = 3;
const STORAGE_KEY = "codenfacts:algorithm-race:progress";
const MAX_TIMER = 15; // seconds, at the easiest levels
const MIN_TIMER = 5; // seconds, at the hardest levels

const CATEGORY_META: Record<
  RaceCategory,
  { label: string; icon: LucideIcon; className: string }
> = {
  searching: {
    label: "Searching",
    icon: Search,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  sorting: {
    label: "Sorting",
    icon: ArrowUpDown,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  graph: {
    label: "BFS / DFS",
    icon: GitBranch,
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  hashmap: {
    label: "Hashmaps",
    icon: Hash,
    className: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  tree: {
    label: "Trees",
    icon: Network,
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  strategy: {
    label: "Strategy",
    icon: Brain,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

// ============================================================
// LOCAL PROGRESS — TODO(backend): sync via /api/progress so
// rank/streak survive across devices instead of just this browser.
// ============================================================

interface Progress {
  highestLevel: number;
  bestStreak: number;
  totalSolved: number;
}

const DEFAULT_PROGRESS: Progress = { highestLevel: 1, bestStreak: 0, totalSolved: 0 };

function loadProgress(): Progress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(p: Progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

function timerForLevel(level: number, total: number) {
  const pct = level / total;
  const seconds = Math.round(MAX_TIMER - pct * (MAX_TIMER - MIN_TIMER));
  return Math.max(MIN_TIMER, Math.min(MAX_TIMER, seconds));
}

// ============================================================
// SMALL UI PIECES
// ============================================================

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i < level ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
          }`}
        />
      ))}
    </div>
  );
}

function Lives({ lives }: { lives: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: STARTING_LIVES }).map((_, i) => (
        <Heart
          key={i}
          className={`h-4 w-4 ${
            i < lives
              ? "fill-red-500 text-red-500"
              : "fill-transparent text-zinc-300 dark:text-zinc-700"
          }`}
        />
      ))}
    </div>
  );
}

function ScenarioWindow({ question }: { question: RaceQuestion }) {
  const meta = CATEGORY_META[question.category];
  const Icon = meta.icon;
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#0d1117]">
      <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-[#0a0e14]">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        <span className="ml-2 font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
          leg_{String(question.level).padStart(3, "0")}
        </span>
        <span
          className={`ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.className}`}
        >
          <Icon className="h-3 w-3" />
          {meta.label}
        </span>
      </div>
      <div className="p-4">
        {question.data && (
          <pre className="mb-3 overflow-x-auto rounded-lg bg-zinc-50 p-3 font-mono text-sm leading-relaxed text-zinc-800 dark:bg-[#0a0e14] dark:text-zinc-200">
            <code>{question.data}</code>
          </pre>
        )}
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {question.scenario}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

type Stage = "intro" | "playing" | "answered" | "gameover";

export default function AlgorithmRacePage() {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [stage, setStage] = useState<Stage>("intro");
  const [levelIndex, setLevelIndex] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(MAX_TIMER);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const question = RACE_QUESTIONS[levelIndex];
  const totalLevels = RACE_QUESTIONS.length;
  const isCorrect = selected !== null && selected === question?.correctIndex;
  const allowedTime = question ? timerForLevel(question.level, totalLevels) : MAX_TIMER;

  const progressPct = useMemo(
    () => Math.min(100, Math.round(((levelIndex + 1) / totalLevels) * 100)),
    [levelIndex, totalLevels]
  );

  const submitAnswer = useCallback(
    (optionIndex: number | null) => {
      if (stage !== "playing" || !question) return;
      if (timerRef.current) clearInterval(timerRef.current);
      setSelected(optionIndex);
      const correct = optionIndex !== null && optionIndex === question.correctIndex;

      if (correct) {
        const gained = 10 * question.difficulty + streak * 2;
        const newStreak = streak + 1;
        const newScore = score + gained;
        setScore(newScore);
        setStreak(newStreak);
        const next: Progress = {
          highestLevel: Math.max(progress.highestLevel, question.level + 1),
          bestStreak: Math.max(progress.bestStreak, newStreak),
          totalSolved: progress.totalSolved + 1,
        };
        setProgress(next);
        saveProgress(next);
      } else {
        setStreak(0);
        setLives((l) => l - 1);
      }
      setStage("answered");
    },
    [stage, question, streak, score, progress]
  );

  // countdown timer
  useEffect(() => {
    if (stage !== "playing" || !question) return;
    setTimeLeft(allowedTime);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          submitAnswer(null); // time's up — counts as wrong
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, question?.id]);

  useEffect(() => {
    if (stage === "answered" && lives <= 0) {
      const t = setTimeout(() => setStage("gameover"), 900);
      return () => clearTimeout(t);
    }
  }, [stage, lives]);

  function startRace() {
    const startAt = Math.max(0, Math.min(progress.highestLevel - 1, totalLevels - 1));
    setLevelIndex(startAt);
    setLives(STARTING_LIVES);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setStage("playing");
  }

  function restartFromZero() {
    setLevelIndex(0);
    setLives(STARTING_LIVES);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setStage("playing");
  }

  function nextLeg() {
    if (lives <= 0 || levelIndex + 1 >= totalLevels) {
      setStage("gameover");
      return;
    }
    setLevelIndex((i) => i + 1);
    setSelected(null);
    setStage("playing");
  }

  // ------------------------------------------------------------------
  // INTRO
  // ------------------------------------------------------------------
  if (stage === "intro") {
    return (
      <main className="min-h-screen bg-white dark:bg-[#0a0e14]">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <Link
            href="/develop"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Brain Arena
          </Link>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Algorithm Race
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Every move you make is an algorithm. You&apos;re handed a
              problem — a search, a sort, a graph, a tree — and a clock.
              Pick the right approach before time runs out and you race
              ahead. Pick wrong, or freeze, and you lose a life. Levels get
              harder and the clock gets shorter as you go.
            </p>

            <div className="mt-8 grid w-full grid-cols-3 gap-3">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-[#0d1117]">
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {totalLevels}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">total legs</p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-[#0d1117]">
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {progress.highestLevel}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">your rank</p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-[#0d1117]">
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {progress.bestStreak}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">best streak</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {(Object.keys(CATEGORY_META) as RaceCategory[]).map((cat) => {
                const meta = CATEGORY_META[cat];
                const Icon = meta.icon;
                return (
                  <span
                    key={cat}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${meta.className}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {meta.label}
                  </span>
                );
              })}
            </div>

            <button
              onClick={startRace}
              className="mt-10 flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
            >
              <Zap className="h-4 w-4" />
              {progress.highestLevel > 1 ? "Resume Race" : "Start Race"}
            </button>

            {progress.highestLevel > 1 && (
              <button
                onClick={restartFromZero}
                className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Start over from leg 1
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ------------------------------------------------------------------
  // GAME OVER
  // ------------------------------------------------------------------
  if (stage === "gameover") {
    const finishedAll = levelIndex + 1 >= totalLevels && lives > 0;
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-[#0a0e14]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-[#0d1117]"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Trophy className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {finishedAll ? "You crossed the finish line!" : "Race over"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {finishedAll
              ? "You cleared every leg in the race."
              : "Out of lives — every racer stalls out eventually."}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-[#0a0e14]">
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{score}</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">score this run</p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-[#0a0e14]">
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {question?.level ?? levelIndex + 1}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">leg reached</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={restartFromZero}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              <RotateCcw className="h-4 w-4" />
              Race again
            </button>
            <Link
              href="/develop"
              className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:border-emerald-500/50 hover:text-emerald-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-emerald-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Brain Arena
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  // ------------------------------------------------------------------
  // PLAYING / ANSWERED
  // ------------------------------------------------------------------
  if (!question) return null;

  const timerPct = Math.max(0, Math.min(100, (timeLeft / allowedTime) * 100));

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0e14]">
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-[#0a0e14]/95">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/develop"
              className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit
            </Link>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                <Flame className="h-3.5 w-3.5 text-emerald-500" />
                {streak}
              </span>
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {score} pts
              </span>
              <Lives lives={lives} />
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
                Leg {question.level} of {totalLevels}
              </span>
              <DifficultyDots level={question.difficulty} />
            </div>

            {/* Timer bar */}
            {stage === "playing" && (
              <div className="mb-3 flex items-center gap-2">
                <Timer className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400" />
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <motion.div
                    className={`h-full rounded-full ${
                      timerPct < 30 ? "bg-red-500" : "bg-emerald-500"
                    }`}
                    animate={{ width: `${timerPct}%` }}
                    transition={{ duration: 0.9, ease: "linear" }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-xs text-zinc-400 dark:text-zinc-500">
                  {timeLeft}s
                </span>
              </div>
            )}

            <ScenarioWindow question={question} />

            <h2 className="mt-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {question.question}
            </h2>

            <div className="mt-4 flex flex-col gap-2.5">
              {question.options.map((option, i) => {
                const isSelected = selected === i;
                const showCorrect = stage === "answered" && i === question.correctIndex;
                const showWrong = stage === "answered" && isSelected && !isCorrect;

                return (
                  <button
                    key={i}
                    disabled={stage === "answered"}
                    onClick={() => submitAnswer(i)}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                      showCorrect
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : showWrong
                        ? "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 dark:border-zinc-800 dark:bg-[#0d1117] dark:text-zinc-300"
                    } ${stage === "answered" ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span>{option}</span>
                    {showCorrect && <CheckCircle2 className="h-4 w-4 flex-shrink-0" />}
                    {showWrong && <XCircle className="h-4 w-4 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {stage === "answered" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`mt-4 rounded-lg border p-4 text-sm leading-relaxed ${
                      isCorrect
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300"
                        : "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-[#0d1117] dark:text-zinc-400"
                    }`}
                  >
                    <p className="mb-1 font-semibold">
                      {selected === null
                        ? "Time's up."
                        : isCorrect
                        ? "Correct — full speed ahead."
                        : "Not quite."}
                    </p>
                    <p>{question.explanation}</p>
                  </div>

                  {lives > 0 && (
                    <button
                      onClick={nextLeg}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                    >
                      Next leg
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}