"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* -------------------------------------------------------------------------
 * BINARY HERO
 * Enemy signals arrive as a number. Decode it into the target base before
 * the charge line burns out. Four levels, each with 32 unique, freshly
 * generated questions per run: Binary, Hexadecimal, Octal, Binary Arithmetic.
 * ---------------------------------------------------------------------- */

type LevelKey = "bin" | "hex" | "oct" | "arith";
type Accent = "cyan" | "amber" | "violet" | "rose";

interface LevelMeta {
  key: LevelKey;
  address: string;
  name: string;
  tagline: string;
  flavor: string;
  base: number;
  targetLabel: string;
  startTime: number;
  endTime: number;
  accent: Accent;
}

interface Question {
  id: string;
  display: string;
  sourceLabel: string;
  correct: number;
}

type FeedbackKind = "correct" | "wrong" | "timeout";
interface Feedback {
  type: FeedbackKind;
  points?: number;
  correctAnswer?: string;
  livesLeft: number;
}

type Screen = "menu" | "playing" | "complete" | "gameover";

const QUESTIONS_PER_LEVEL = 32;
const START_LIVES = 3;
const STORAGE_KEY = "binary-hero-progress";

const LEVELS: LevelMeta[] = [
  {
    key: "bin",
    address: "0x00",
    name: "Binary",
    tagline: "Decimal \u2192 Binary",
    flavor: "Raw enemy signals arrive in decimal. Decode them into binary before the line drops.",
    base: 2,
    targetLabel: "BIN",
    startTime: 18,
    endTime: 7,
    accent: "cyan",
  },
  {
    key: "hex",
    address: "0x01",
    name: "Hexadecimal",
    tagline: "Decimal \u2192 Hex",
    flavor: "Signals grow denser. Compress each transmission into hexadecimal.",
    base: 16,
    targetLabel: "HEX",
    startTime: 20,
    endTime: 9,
    accent: "amber",
  },
  {
    key: "oct",
    address: "0x02",
    name: "Octal",
    tagline: "Decimal \u2192 Octal",
    flavor: "Legacy encoding detected. Rotate incoming values through octal.",
    base: 8,
    targetLabel: "OCT",
    startTime: 20,
    endTime: 9,
    accent: "violet",
  },
  {
    key: "arith",
    address: "0x03",
    name: "Binary Arithmetic",
    tagline: "Add & Subtract in Binary",
    flavor: "Two signals collide mid-air. Resolve the sum or difference before the fuse burns out.",
    base: 2,
    targetLabel: "BIN",
    startTime: 26,
    endTime: 12,
    accent: "rose",
  },
];

const ACCENTS: Record<
  Accent,
  { text: string; bar: string; chip: string; ring: string; solidBg: string }
> = {
  cyan: {
    text: "text-cyan-600 dark:text-cyan-400",
    bar: "bg-cyan-500",
    chip: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
    ring: "ring-cyan-400/60",
    solidBg: "bg-cyan-500",
  },
  amber: {
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    ring: "ring-amber-400/60",
    solidBg: "bg-amber-500",
  },
  violet: {
    text: "text-violet-600 dark:text-violet-400",
    bar: "bg-violet-500",
    chip: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
    ring: "ring-violet-400/60",
    solidBg: "bg-violet-500",
  },
  rose: {
    text: "text-rose-600 dark:text-rose-400",
    bar: "bg-rose-500",
    chip: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
    ring: "ring-rose-400/60",
    solidBg: "bg-rose-500",
  },
};

/* ---------------------------- helpers ---------------------------------- */

function randInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function toBase(n: number, base: number) {
  return base === 16 ? n.toString(16).toUpperCase() : n.toString(base);
}

function timeForQuestion(level: LevelMeta, idx: number) {
  const ratio = idx / (QUESTIONS_PER_LEVEL - 1);
  return +(level.startTime - (level.startTime - level.endTime) * ratio).toFixed(1);
}

const CONVERT_BANDS: Record<"bin" | "hex" | "oct", [number, number][]> = {
  bin: [
    [4, 15],
    [16, 63],
    [64, 255],
    [256, 1023],
  ],
  hex: [
    [16, 255],
    [256, 4095],
    [4096, 65535],
    [65536, 262143],
  ],
  oct: [
    [8, 63],
    [64, 511],
    [512, 4095],
    [4096, 32767],
  ],
};

function generateConvertQuestions(levelKey: "bin" | "hex" | "oct"): Question[] {
  const used = new Set<number>();
  const questions: Question[] = [];
  const bands = CONVERT_BANDS[levelKey];

  for (let i = 0; i < QUESTIONS_PER_LEVEL; i++) {
    const stage = Math.min(Math.floor(i / 8), bands.length - 1);
    let [lo, hi] = bands[stage];
    let val = 0;
    let guard = 0;
    do {
      val = randInt(lo, hi);
      guard++;
      if (guard > 250) hi += 10;
    } while (used.has(val));
    used.add(val);
    questions.push({
      id: `${levelKey}-${i}-${val}`,
      display: String(val),
      sourceLabel: "DEC",
      correct: val,
    });
  }
  return questions;
}

function generateArithmeticQuestions(): Question[] {
  const used = new Set<string>();
  const questions: Question[] = [];
  const capsByStage = [15, 63, 255, 255];

  for (let i = 0; i < QUESTIONS_PER_LEVEL; i++) {
    const stage = Math.min(Math.floor(i / 8), capsByStage.length - 1);
    const cap = capsByStage[stage];
    let a = 0;
    let b = 0;
    let op: "+" | "-" = "+";
    let key = "";
    let guard = 0;
    do {
      a = randInt(0, cap);
      b = randInt(0, cap);
      op = Math.random() < 0.5 ? "+" : "-";
      if (op === "-" && a < b) {
        const t = a;
        a = b;
        b = t;
      }
      key = `${a}${op}${b}`;
      guard++;
    } while (used.has(key) && guard < 400);
    used.add(key);
    const correct = op === "+" ? a + b : a - b;
    questions.push({
      id: `arith-${i}-${key}`,
      display: `${a.toString(2)} ${op} ${b.toString(2)}`,
      sourceLabel: "BIN",
      correct,
    });
  }
  return questions;
}

function generateQuestions(levelKey: LevelKey): Question[] {
  if (levelKey === "arith") return generateArithmeticQuestions();
  return generateConvertQuestions(levelKey);
}

function sanitizeInput(raw: string, base: number) {
  if (base === 2) return raw.replace(/[^01]/g, "");
  if (base === 8) return raw.replace(/[^0-7]/g, "");
  return raw.replace(/[^0-9a-fA-F]/g, "");
}

interface Progress {
  unlockedUpTo: number;
  bestScores: Partial<Record<LevelKey, number>>;
}

function loadProgress(): Progress {
  if (typeof window === "undefined") return { unlockedUpTo: 0, bestScores: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlockedUpTo: 0, bestScores: {} };
    const parsed = JSON.parse(raw);
    return {
      unlockedUpTo: typeof parsed.unlockedUpTo === "number" ? parsed.unlockedUpTo : 0,
      bestScores: parsed.bestScores ?? {},
    };
  } catch {
    return { unlockedUpTo: 0, bestScores: {} };
  }
}

function saveProgress(progress: Progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

/* ------------------------------ page ------------------------------------ */

export default function BinaryHeroPage() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [levelIndex, setLevelIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [input, setInput] = useState("");
  const [lives, setLives] = useState(START_LIVES);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [maxTime, setMaxTime] = useState(1);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [unlockedUpTo, setUnlockedUpTo] = useState(0);
  const [bestScores, setBestScores] = useState<Partial<Record<LevelKey, number>>>({});

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const p = loadProgress();
    setUnlockedUpTo(p.unlockedUpTo);
    setBestScores(p.bestScores);
  }, []);

  const level = LEVELS[levelIndex];
  const accent = ACCENTS[level.accent];
  const currentQuestion = questions[qIndex];

  /* ---- start / restart a level ---- */
  const startLevel = useCallback((idx: number) => {
    const lvl = LEVELS[idx];
    setLevelIndex(idx);
    setQuestions(generateQuestions(lvl.key));
    setQIndex(0);
    setLives(START_LIVES);
    setScore(0);
    setCombo(0);
    setFeedback(null);
    setInput("");
    setScreen("playing");
  }, []);

  /* ---- reset timer whenever the question or level changes ---- */
  useEffect(() => {
    if (screen !== "playing") return;
    const t = timeForQuestion(level, qIndex);
    setTimeLeft(t);
    setMaxTime(t);
    setInput("");
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, levelIndex, screen]);

  /* ---- ticking countdown ---- */
  useEffect(() => {
    if (screen !== "playing" || feedback) return;
    const id = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(0, +(prev - 0.1).toFixed(1)));
    }, 100);
    return () => window.clearInterval(id);
  }, [screen, feedback, qIndex, levelIndex]);

  /* ---- advance to next question / finish level ---- */
  const advance = useCallback(
    (nextLives: number) => {
      if (nextLives <= 0) {
        setScreen("gameover");
        return;
      }
      const next = qIndex + 1;
      if (next >= questions.length) {
        const newBest = Math.max(bestScores[level.key] ?? 0, score);
        const newUnlocked = Math.max(unlockedUpTo, levelIndex + 1);
        const newBestScores = { ...bestScores, [level.key]: newBest };
        setBestScores(newBestScores);
        setUnlockedUpTo(newUnlocked);
        saveProgress({ unlockedUpTo: newUnlocked, bestScores: newBestScores });
        setScreen("complete");
      } else {
        setQIndex(next);
      }
    },
    [qIndex, questions.length, bestScores, level.key, score, unlockedUpTo, levelIndex]
  );

  /* ---- resolve feedback after a short delay ---- */
  useEffect(() => {
    if (!feedback) return;
    const delay = feedback.type === "correct" ? 650 : 1150;
    const id = window.setTimeout(() => {
      const nextLives = feedback.livesLeft;
      setFeedback(null);
      advance(nextLives);
    }, delay);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  /* ---- handle submission ---- */
  const handleSubmit = useCallback(() => {
    if (feedback || !currentQuestion || timeLeft <= 0) return;
    const parsed = input.trim() === "" ? NaN : parseInt(input, level.base);
    const isCorrect = !Number.isNaN(parsed) && parsed === currentQuestion.correct;

    if (isCorrect) {
      const bonus = Math.round(timeLeft * 8) + combo * 15;
      const points = 100 + bonus;
      setScore((s) => s + points);
      setCombo((c) => c + 1);
      setFeedback({ type: "correct", points, livesLeft: lives });
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      setCombo(0);
      setFeedback({
        type: "wrong",
        correctAnswer: toBase(currentQuestion.correct, level.base),
        livesLeft: nextLives,
      });
    }
  }, [feedback, currentQuestion, timeLeft, input, level.base, combo, lives]);

  /* ---- timeout detection ---- */
  useEffect(() => {
    if (screen !== "playing" || feedback || !currentQuestion) return;
    if (timeLeft <= 0) {
      const nextLives = lives - 1;
      setLives(nextLives);
      setCombo(0);
      setFeedback({
        type: "timeout",
        correctAnswer: toBase(currentQuestion.correct, level.base),
        livesLeft: nextLives,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const chargePct = maxTime > 0 ? Math.max(0, Math.min(100, (timeLeft / maxTime) * 100)) : 0;
  const chargeColor =
    chargePct > 50
      ? "bg-emerald-500"
      : chargePct > 20
      ? "bg-amber-500"
      : "bg-rose-500 animate-pulse";

  /* --------------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        {screen === "menu" && (
          <MenuScreen
            unlockedUpTo={unlockedUpTo}
            bestScores={bestScores}
            onSelect={startLevel}
          />
        )}

        {screen === "playing" && currentQuestion && (
          <div className="flex flex-col gap-6">
            {/* status bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setScreen("menu")}
                className="font-mono text-xs uppercase tracking-widest text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                &larr; Menu
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: START_LIVES }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < lives
                        ? "text-rose-500"
                        : "text-slate-200 dark:text-slate-800"
                    }
                  >
                    &#9829;
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className={`font-mono text-xs uppercase tracking-widest ${accent.text}`}>
                  {level.address} &middot; {level.name}
                </p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Signal {qIndex + 1} / {questions.length}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg font-bold tabular-nums">{score}</p>
                {combo > 1 && (
                  <p className={`font-mono text-xs font-semibold ${accent.text}`}>
                    &times;{combo} combo
                  </p>
                )}
              </div>
            </div>

            {/* signal panel */}
            <div
              className={`relative overflow-hidden rounded-2xl border bg-slate-50 p-8 dark:bg-slate-900/60 ${
                feedback?.type === "wrong" || feedback?.type === "timeout"
                  ? "border-rose-300 dark:border-rose-800"
                  : feedback?.type === "correct"
                  ? "border-emerald-300 dark:border-emerald-800"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <span
                  className={`rounded-full border px-3 py-1 font-mono text-xs font-semibold tracking-wider ${accent.chip}`}
                >
                  {currentQuestion.sourceLabel}
                </span>
                <span className="text-slate-300 dark:text-slate-700">&rarr;</span>
                <span
                  className={`rounded-full border px-3 py-1 font-mono text-xs font-semibold tracking-wider ${accent.chip}`}
                >
                  {level.targetLabel}
                </span>
              </div>

              <p className="mt-6 select-none break-all text-center font-mono text-4xl font-black tracking-wide sm:text-5xl">
                {currentQuestion.display}
              </p>

              {/* charge / timer bar */}
              <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-[width] duration-100 ease-linear ${chargeColor}`}
                  style={{ width: `${chargePct}%` }}
                />
              </div>

              {/* feedback overlay */}
              {feedback && (
                <div
                  className={`mt-4 text-center font-mono text-sm font-semibold ${
                    feedback.type === "correct"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {feedback.type === "correct" && `SIGNAL DECODED  +${feedback.points}`}
                  {feedback.type === "wrong" && `SIGNAL REJECTED  \u2014 correct: ${feedback.correctAnswer}`}
                  {feedback.type === "timeout" && `LINE DROPPED  \u2014 correct: ${feedback.correctAnswer}`}
                </div>
              )}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex gap-3"
            >
              <input
                ref={inputRef}
                value={input}
                disabled={!!feedback}
                onChange={(e) => setInput(sanitizeInput(e.target.value, level.base))}
                placeholder={`Enter ${level.targetLabel.toLowerCase()}...`}
                autoComplete="off"
                spellCheck={false}
                className={`flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-lg tracking-widest text-slate-900 outline-none ring-2 ring-transparent transition focus:ring-2 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${accent.ring}`}
              />
              <button
                type="submit"
                disabled={!!feedback}
                className={`rounded-xl px-6 py-3 font-mono text-sm font-bold uppercase tracking-wide text-white transition disabled:opacity-60 ${accent.solidBg} hover:brightness-110`}
              >
                Transmit
              </button>
            </form>
          </div>
        )}

        {screen === "complete" && (
          <CompleteScreen
            level={level}
            levelIndex={levelIndex}
            score={score}
            lives={lives}
            hasNext={levelIndex < LEVELS.length - 1}
            onReplay={() => startLevel(levelIndex)}
            onNext={() => startLevel(levelIndex + 1)}
            onMenu={() => setScreen("menu")}
          />
        )}

        {screen === "gameover" && (
          <GameOverScreen
            level={level}
            score={score}
            progress={qIndex + 1}
            total={questions.length}
            onRetry={() => startLevel(levelIndex)}
            onMenu={() => setScreen("menu")}
          />
        )}
      </div>
    </div>
  );
}

/* --------------------------- sub screens -------------------------------- */

function MenuScreen({
  unlockedUpTo,
  bestScores,
  onSelect,
}: {
  unlockedUpTo: number;
  bestScores: Partial<Record<LevelKey, number>>;
  onSelect: (idx: number) => void;
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">
        binary-hero
      </p>
      <h1 className="mt-2 font-mono text-4xl font-black tracking-tight sm:text-5xl">
        BINARY HERO
      </h1>
      <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">
        Enemy signals are inbound. Each one arrives as a raw number - decode it
        into the target base before the charge line burns out. Four channels,
        32 unique signals each.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {LEVELS.map((lvl, idx) => {
          const unlocked = idx <= unlockedUpTo;
          const accent = ACCENTS[lvl.accent];
          const best = bestScores[lvl.key];
          return (
            <button
              key={lvl.key}
              onClick={() => unlocked && onSelect(idx)}
              disabled={!unlocked}
              className={`group relative rounded-2xl border p-5 text-left transition ${
                unlocked
                  ? "border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60"
                  : "cursor-not-allowed border-slate-100 bg-slate-50/50 opacity-60 dark:border-slate-900 dark:bg-slate-900/20"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={`font-mono text-xs font-semibold tracking-widest ${accent.text}`}>
                  {lvl.address}
                </span>
                {!unlocked && (
                  <span className="text-xs text-slate-400 dark:text-slate-600">&#128274;</span>
                )}
              </div>
              <h2 className="mt-2 font-mono text-xl font-bold">{lvl.name}</h2>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                {lvl.tagline}
              </p>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-500">{lvl.flavor}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 dark:text-slate-600">
                  32 signals
                </span>
                {best !== undefined && (
                  <span className={`font-mono font-semibold ${accent.text}`}>
                    best {best}
                  </span>
                )}
                {best === undefined && unlocked && (
                  <span className="font-mono text-slate-400 dark:text-slate-600">not played</span>
                )}
                {!unlocked && (
                  <span className="font-mono text-slate-400 dark:text-slate-600">
                    complete previous
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompleteScreen({
  level,
  levelIndex,
  score,
  lives,
  hasNext,
  onReplay,
  onNext,
  onMenu,
}: {
  level: LevelMeta;
  levelIndex: number;
  score: number;
  lives: number;
  hasNext: boolean;
  onReplay: () => void;
  onNext: () => void;
  onMenu: () => void;
}) {
  const accent = ACCENTS[level.accent];
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <p className={`font-mono text-xs uppercase tracking-widest ${accent.text}`}>
        {level.address} &middot; {level.name} cleared
      </p>
      <h1 className="font-mono text-3xl font-black">CHANNEL SECURED</h1>
      <div className="text-5xl">
        {"\u2605".repeat(lives)}
        <span className="text-slate-200 dark:text-slate-800">
          {"\u2605".repeat(START_LIVES - lives)}
        </span>
      </div>
      <p className="font-mono text-lg">
        Final score: <span className="font-bold">{score}</span>
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          onClick={onReplay}
          className="rounded-xl border border-slate-300 px-5 py-2.5 font-mono text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          Replay
        </button>
        {hasNext && (
          <button
            onClick={onNext}
            className={`rounded-xl px-5 py-2.5 font-mono text-sm font-bold uppercase text-white transition hover:brightness-110 ${accent.solidBg}`}
          >
            Next Channel &rarr;
          </button>
        )}
        <button
          onClick={onMenu}
          className="rounded-xl border border-slate-300 px-5 py-2.5 font-mono text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          Menu
        </button>
      </div>
    </div>
  );
}

function GameOverScreen({
  level,
  score,
  progress,
  total,
  onRetry,
  onMenu,
}: {
  level: LevelMeta;
  score: number;
  progress: number;
  total: number;
  onRetry: () => void;
  onMenu: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-rose-500">
        {level.address} &middot; {level.name}
      </p>
      <h1 className="font-mono text-3xl font-black text-rose-600 dark:text-rose-400">
        LINE LOST
      </h1>
      <p className="text-slate-600 dark:text-slate-400">
        You held the channel for {progress} of {total} signals.
      </p>
      <p className="font-mono text-lg">
        Score: <span className="font-bold">{score}</span>
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          onClick={onRetry}
          className="rounded-xl bg-rose-500 px-5 py-2.5 font-mono text-sm font-bold uppercase text-white transition hover:brightness-110"
        >
          Retry Channel
        </button>
        <button
          onClick={onMenu}
          className="rounded-xl border border-slate-300 px-5 py-2.5 font-mono text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          Menu
        </button>
      </div>
    </div>
  );
}