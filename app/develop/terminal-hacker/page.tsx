"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Heart,
  Trophy,
  Flame,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Skull,
} from "lucide-react";
import { terminalLevels, TOTAL_XP } from "./questions";

// TODO(backend): replace localStorage persistence with Firestore sync
// (per-user progress doc: bestScore, highestLevelCleared, completedAt)
const STORAGE_KEY = "codenfacts_terminal_hacker_progress";
const MAX_LIVES = 3;

type LogEntry = {
  id: string;
  kind: "input" | "output" | "system" | "error" | "hint";
  text: string;
  promptPath?: string;
};

interface StoredProgress {
  bestScore: number;
  highestLevelCleared: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

function loadProgress(): StoredProgress {
  if (typeof window === "undefined") return { bestScore: 0, highestLevelCleared: 0 };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { bestScore: 0, highestLevelCleared: 0 };
    const parsed = JSON.parse(raw);
    return {
      bestScore: typeof parsed.bestScore === "number" ? parsed.bestScore : 0,
      highestLevelCleared:
        typeof parsed.highestLevelCleared === "number" ? parsed.highestLevelCleared : 0,
    };
  } catch {
    return { bestScore: 0, highestLevelCleared: 0 };
  }
}

function saveProgress(progress: StoredProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore quota / privacy-mode failures — non-critical for gameplay
  }
}

export default function TerminalHackerPage() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [input, setInput] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [bestScore, setBestScore] = useState(0);
  const [cwd, setCwd] = useState("~");

  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const level = terminalLevels[levelIndex];
  const isFinalLevel = levelIndex === terminalLevels.length - 1;

  useEffect(() => {
    const progress = loadProgress();
    setBestScore(progress.bestScore);
    setLog([
      { id: "boot-1", kind: "system", text: "Connecting to remote host 10.13.37.1 ..." },
      { id: "boot-2", kind: "system", text: "Connection established. Shell session live." },
    ]);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  useEffect(() => {
    if (status === "playing") inputRef.current?.focus();
  }, [status, levelIndex]);

  const pushLog = useCallback((entries: Omit<LogEntry, "id">[]) => {
    setLog((prev) => [
      ...prev,
      ...entries.map((e, i) => ({ ...e, id: `${Date.now()}-${i}-${Math.random()}` })),
    ]);
  }, []);

  const persistBest = useCallback(
    (finalScore: number, levelsCleared: number) => {
      const progress = loadProgress();
      const next: StoredProgress = {
        bestScore: Math.max(progress.bestScore, finalScore),
        highestLevelCleared: Math.max(progress.highestLevelCleared, levelsCleared),
      };
      saveProgress(next);
      setBestScore(next.bestScore);
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "playing") return;
    const trimmed = input.trim();
    if (!trimmed) return;

    pushLog([{ kind: "input", text: trimmed, promptPath: cwd }]);
    setInput("");

    const isCorrect = level.validAnswers.some((re) => re.test(trimmed));

    if (isCorrect) {
      const newScore = score + level.xp + streak * 2;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setWrongAttempts(0);
      setShowHint(false);

      if (level.output.length > 0) {
        pushLog(level.output.map((line) => ({ kind: "output" as const, text: line })));
      }
      pushLog([{ kind: "system", text: `✓ ${level.title} complete  (+${level.xp} xp)` }]);
      setCwd(level.cwdAfter);

      if (isFinalLevel) {
        persistBest(newScore, terminalLevels.length);
        setTimeout(() => {
          pushLog([
            { kind: "system", text: "" },
            { kind: "system", text: "root@mainframe:~# access_log --wipe" },
            { kind: "system", text: "ACCESS GRANTED. TRACE ERASED." },
          ]);
          setStatus("won");
        }, 400);
      } else {
        setTimeout(() => setLevelIndex((i) => i + 1), 500);
      }
    } else {
      const attempts = wrongAttempts + 1;
      setWrongAttempts(attempts);
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);
      pushLog([{ kind: "error", text: `bash: ${trimmed.split(" ")[0]}: command failed or incorrect syntax` }]);

      if (attempts >= 2) setShowHint(true);

      if (newLives <= 0) {
        persistBest(score, levelIndex);
        pushLog([
          { kind: "system", text: "" },
          { kind: "system", text: "CONNECTION TERMINATED BY REMOTE HOST." },
        ]);
        setStatus("lost");
      }
    }
  };

  const resetGame = () => {
    setLevelIndex(0);
    setLives(MAX_LIVES);
    setScore(0);
    setStreak(0);
    setWrongAttempts(0);
    setShowHint(false);
    setInput("");
    setCwd("~");
    setStatus("playing");
    setLog([
      { id: "boot-1", kind: "system", text: "Connecting to remote host 10.13.37.1 ..." },
      { id: "boot-2", kind: "system", text: "Connection established. Shell session live." },
    ]);
  };

  const progressPct = Math.round((levelIndex / terminalLevels.length) * 100);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0e14] text-gray-900 dark:text-gray-100 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(16,185,129,0.5) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="flex items-center gap-2 text-emerald-500 text-xs sm:text-sm font-mono mb-3"
          >
            <Terminal className="w-4 h-4" />
            <span>brain-arena / terminal-hacker</span>
          </motion.div>
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-2xl sm:text-4xl font-bold tracking-tight"
          >
            Terminal Hacker
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl"
          >
            The goal on screen says <span className="text-emerald-500 font-mono">hack the system</span>.
            What you&apos;re actually doing is drilling real Linux commands - <code className="font-mono text-emerald-600 dark:text-emerald-400">pwd</code>,{" "}
            <code className="font-mono text-emerald-600 dark:text-emerald-400">mkdir</code>,{" "}
            <code className="font-mono text-emerald-600 dark:text-emerald-400">cd</code> and more - until
            they&apos;re muscle memory.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <StatPill icon={<Heart className="w-4 h-4" />} label="Lives">
              <div className="flex gap-1">
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 ${
                      i < lives ? "fill-red-500 text-red-500" : "text-gray-300 dark:text-gray-700"
                    }`}
                  />
                ))}
              </div>
            </StatPill>
            <StatPill icon={<Trophy className="w-4 h-4" />} label="Score">
              <span className="font-mono">{score}</span>
            </StatPill>
            <StatPill icon={<Flame className="w-4 h-4" />} label="Streak">
              <span className="font-mono">{streak}</span>
            </StatPill>
            <StatPill icon={<ShieldCheck className="w-4 h-4" />} label="Best">
              <span className="font-mono">{bestScore}</span>
            </StatPill>
          </motion.div>
        </div>
      </section>

      {/* Game */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Progress bar */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${status === "won" ? 100 : progressPct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {status === "won" ? terminalLevels.length : levelIndex} / {terminalLevels.length}
          </span>
        </div>

        {/* Terminal window */}
        <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-800 shadow-xl shadow-emerald-500/5">
          {/* Terminal chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-[#11151c] border-b border-gray-300 dark:border-gray-800">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-3 text-xs font-mono text-gray-500 dark:text-gray-400">
              ghost@codenfacts: {cwd}
            </span>
          </div>

          {/* Output area */}
          <div className="bg-[#0a0e14] px-4 py-4 h-[360px] sm:h-[420px] overflow-y-auto font-mono text-[13px] sm:text-sm leading-relaxed">
            {log.map((entry) => (
              <LogLine key={entry.id} entry={entry} />
            ))}

            {status === "playing" && (
              <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
                <span className="text-emerald-400 whitespace-nowrap">
                  ghost@codenfacts:{cwd}$
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-100 caret-emerald-400"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="type a command..."
                />
              </form>
            )}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* Task card */}
        <AnimatePresence mode="wait">
          {status === "playing" && (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="mt-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0d1117] p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs font-mono text-emerald-500 mb-1">
                    LEVEL {levelIndex + 1} · {level.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
                    {level.narrative}
                  </p>
                  <p className="text-sm sm:text-base font-medium">{level.task}</p>
                </div>
                <button
                  onClick={() => setShowHint((s) => !s)}
                  className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors shrink-0"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  Hint
                </button>
              </div>
              <AnimatePresence>
                {showHint && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 text-xs sm:text-sm font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2"
                  >
                    💡 {level.hint}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Win screen */}
        {status === "won" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-5 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-6 text-center"
          >
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-500">SYSTEM HACKED</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              You cleared every level using nothing but real Linux commands. Final score{" "}
              <span className="font-mono text-emerald-500">{score}</span> (base pool: {TOTAL_XP} xp)
            </p>
            <button
              onClick={resetGame}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Play again
            </button>
          </motion.div>
        )}

        {/* Lose screen */}
        {status === "lost" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-5 rounded-xl border border-red-500/40 bg-red-500/5 p-6 text-center"
          >
            <Skull className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-red-500">CONNECTION LOST</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              You made it to level {levelIndex + 1} with a score of{" "}
              <span className="font-mono text-red-500">{score}</span>. Reconnect and try again.
            </p>
            <button
              onClick={resetGame}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reconnect
            </button>
          </motion.div>
        )}

        <p className="mt-6 text-xs text-center text-gray-400 dark:text-gray-600 font-mono flex items-center justify-center gap-1">
          <ChevronRight className="w-3 h-3" />
          Type the exact command and press Enter. Wrong syntax costs a life.
        </p>
      </section>
    </main>
  );
}

function StatPill({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0d1117] text-sm">
      <span className="text-emerald-500">{icon}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">{label}</span>
      {children}
    </div>
  );
}

function LogLine({ entry }: { entry: LogEntry }) {
  if (entry.kind === "input") {
    return (
      <div className="text-gray-100">
        <span className="text-emerald-400">ghost@codenfacts:{entry.promptPath}$</span> {entry.text}
      </div>
    );
  }
  if (entry.kind === "output") {
    return <div className="text-gray-300">{entry.text}</div>;
  }
  if (entry.kind === "error") {
    return <div className="text-red-400">{entry.text}</div>;
  }
  if (entry.kind === "hint") {
    return <div className="text-amber-400">{entry.text}</div>;
  }
  return <div className="text-emerald-500/80">{entry.text || "\u00A0"}</div>;
}