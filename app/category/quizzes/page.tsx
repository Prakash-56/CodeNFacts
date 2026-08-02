"use client";

// app/category/quizzes/page.tsx
//
// Quizzes hub for CodeNFacts. Three tabs: Quizzes (browse/search/take/score/review),
// Cheat Sheets, and Diagrams. Follows the CSS-custom-property theming pattern used
// across Brain Arena (no JS theme toggle logic here — this page just reads the
// --bg/--text/--accent vars that flip when the header's ThemeProvider toggles the
// `.dark` class on <html>). Fully responsive: single column on mobile, multi-column
// grid on desktop.
//
// TODO(backend): Quiz attempts persist to localStorage only (`cnf_quiz_attempts`).
// Wire this into Firestore (collection: `quizAttempts`, doc-per-user-per-quiz) so
// scores survive across devices and can feed a profile/streak view.

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Layers,
  FileStack,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Clock,
  X,
} from "lucide-react";
import { QUIZZES, CHEAT_SHEETS, CATEGORIES, type Quiz } from "./questions";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: "easeOut" as const },
  }),
};

type Tab = "quizzes" | "cheatsheets" | "diagrams";
type Answer = number | null;

interface Attempt {
  bestScore: number;
  bestTotal: number;
  lastPlayed: string;
}

const STORAGE_KEY = "cnf_quiz_attempts";

function loadAttempts(): Record<string, Attempt> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAttempt(quizId: string, score: number, total: number) {
  const all = loadAttempts();
  const prevBest = all[quizId]?.bestScore ?? -1;
  all[quizId] = {
    bestScore: Math.max(prevBest, score),
    bestTotal: total,
    lastPlayed: new Date().toISOString(),
  };
  // TODO(backend): mirror this write to Firestore `quizAttempts/{uid}_{quizId}`.
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

const difficultyColor: Record<string, string> = {
  Beginner: "text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/30",
  Intermediate: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  Advanced: "text-rose-500 bg-rose-500/10 border-rose-500/30",
};

export default function QuizzesPage() {
  const [tab, setTab] = useState<Tab>("quizzes");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<Record<string, Attempt>>({});

  useEffect(() => {
    setAttempts(loadAttempts());
  }, []);

  const filteredQuizzes = useMemo(() => {
    return QUIZZES.filter((q) => {
      const matchesCategory = category === "All" || q.category === category;
      const matchesQuery =
        query.trim() === "" ||
        q.title.toLowerCase().includes(query.toLowerCase()) ||
        q.description.toLowerCase().includes(query.toLowerCase()) ||
        q.category.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  function handleQuizComplete(quizId: string, score: number, total: number) {
    saveAttempt(quizId, score, total);
    setAttempts(loadAttempts());
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <style jsx global>{`
        :root {
          --bg-primary: #ffffff;
          --bg-secondary: #f7f8fa;
          --text-primary: #0f172a;
          --text-secondary: #5b6472;
          --border-color: #e5e7eb;
          --accent: #b45309; /* amber/brass in light mode */
          --accent-soft: #fef3c7;
        }
        .dark {
          --bg-primary: #0a0e14;
          --bg-secondary: #0d1117;
          --text-primary: #e6edf3;
          --text-secondary: #8b98a5;
          --border-color: #1f2937;
          --accent: #34d399; /* emerald in dark mode */
          --accent-soft: rgba(52, 211, 153, 0.12);
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp} className="mb-6">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="ml-1 font-mono">CodeNFacts/quizzes</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Quizzes & Reference Hub</h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)] sm:text-base">
            Test yourself across DSA, Frontend, Backend, AI/ML, DevOps, and Databases -
            then review cheat sheets and diagrams for quick recall before an interview.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="mb-6 flex w-full max-w-md overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-1"
        >
          {[
            { id: "quizzes" as Tab, label: "Quizzes", icon: BookOpen },
            { id: "cheatsheets" as Tab, label: "Cheat Sheets", icon: FileStack },
            { id: "diagrams" as Tab, label: "Diagrams", icon: Layers },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                tab === id
                  ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </motion.div>

        {tab === "quizzes" && !activeQuiz && (
          <QuizBrowser
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            quizzes={filteredQuizzes}
            attempts={attempts}
            onSelect={setActiveQuiz}
          />
        )}

        {tab === "quizzes" && activeQuiz && (
          <QuizRunner
            quiz={activeQuiz}
            onExit={() => setActiveQuiz(null)}
            onComplete={handleQuizComplete}
          />
        )}

        {tab === "cheatsheets" && <CheatSheetsView />}
        {tab === "diagrams" && <DiagramsView />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Browse / search view
// ---------------------------------------------------------------------------

function QuizBrowser({
  query,
  setQuery,
  category,
  setCategory,
  quizzes,
  attempts,
  onSelect,
}: {
  query: string;
  setQuery: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  quizzes: Quiz[];
  attempts: Record<string, Attempt>;
  onSelect: (q: Quiz) => void;
}) {
  return (
    <div>
      <motion.div initial="hidden" animate="show" custom={2} variants={fadeUp} className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search quizzes - e.g. React, Big-O, SQL..."
            className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] py-2.5 pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)]"
          />
        </div>
        <div className="flex flex-wrap gap-2 overflow-x-auto">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                category === c
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg-primary)]"
                  : "border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </motion.div>

      <p className="mb-4 text-xs text-[var(--text-secondary)]">
        {quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} found
      </p>

      {quizzes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-color)] p-10 text-center text-[var(--text-secondary)]">
          No quizzes match "{query}". Try another search or category.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, i) => {
            const attempt = attempts[quiz.id];
            const pct = attempt ? Math.round((attempt.bestScore / attempt.bestTotal) * 100) : null;
            return (
              <motion.button
                key={quiz.id}
                initial="hidden"
                animate="show"
                custom={i + 3}
                variants={fadeUp}
                onClick={() => onSelect(quiz)}
                className="group flex flex-col rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-lg"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-md border border-[var(--border-color)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                    {quiz.category}
                  </span>
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${difficultyColor[quiz.difficulty]}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <h3 className="mb-1 text-base font-semibold group-hover:text-[var(--accent)]">{quiz.title}</h3>
                <p className="mb-3 line-clamp-2 text-xs text-[var(--text-secondary)]">{quiz.description}</p>
                <div className="mt-auto flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>{quiz.questions.length} questions</span>
                  {pct !== null ? (
                    <span className="flex items-center gap-1 font-medium text-[var(--accent)]">
                      <Trophy size={12} /> Best {pct}%
                    </span>
                  ) : (
                    <span>Not attempted</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quiz-taking flow
// ---------------------------------------------------------------------------

function QuizRunner({
  quiz,
  onExit,
  onComplete,
}: {
  quiz: Quiz;
  onExit: () => void;
  onComplete: (quizId: string, score: number, total: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(() => new Array(quiz.questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const question = quiz.questions[index];
  const total = quiz.questions.length;
  const answeredCount = answers.filter((a) => a !== null).length;

  function selectOption(optionIndex: number) {
    if (submitted) return;
    const next = [...answers];
    next[index] = optionIndex;
    setAnswers(next);
  }

  function submit() {
    setSubmitted(true);
    const score = answers.reduce((acc: number, a, i) => (a === quiz.questions[i].correctIndex ? acc + 1 : acc), 0);
    onComplete(quiz.id, score, total);
  }

  function retake() {
    setAnswers(new Array(total).fill(null));
    setIndex(0);
    setSubmitted(false);
  }

  if (submitted) {
    const score = answers.reduce((acc: number, a, i) => (a === quiz.questions[i].correctIndex ? acc + 1 : acc), 0);
    return <ResultsView quiz={quiz} answers={answers} score={score} onRetake={retake} onExit={onExit} />;
  }

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <X size={15} /> Exit quiz
        </button>
        <span className="text-xs text-[var(--text-secondary)]">
          Question {index + 1} / {total}
        </span>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 sm:p-6"
        >
          <h2 className="mb-4 text-base font-semibold leading-relaxed sm:text-lg">{question.question}</h2>
          <div className="flex flex-col gap-2.5">
            {question.options.map((opt, i) => {
              const selected = answers[index] === i;
              return (
                <button
                  key={i}
                  onClick={() => selectOption(i)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    selected
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="flex items-center gap-1 rounded-lg border border-[var(--border-color)] px-3 py-2 text-sm text-[var(--text-secondary)] disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <span className="text-xs text-[var(--text-secondary)]">{answeredCount} / {total} answered</span>

        {index === total - 1 ? (
          <button
            onClick={submit}
            disabled={answeredCount < total}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)] disabled:opacity-40"
          >
            Submit quiz
          </button>
        ) : (
          <button
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
            className="flex items-center gap-1 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-[var(--bg-primary)]"
          >
            Next <ChevronRight size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Results + review view
// ---------------------------------------------------------------------------

function ResultsView({
  quiz,
  answers,
  score,
  onRetake,
  onExit,
}: {
  quiz: Quiz;
  answers: Answer[];
  score: number;
  onRetake: () => void;
  onExit: () => void;
}) {
  const total = quiz.questions.length;
  const pct = Math.round((score / total) * 100);
  const verdict = pct >= 80 ? "Excellent work" : pct >= 50 ? "Good effort — a few gaps to close" : "Worth another pass";

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto max-w-3xl">
      <div className="mb-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 text-center">
        <Trophy className="mx-auto mb-2 text-[var(--accent)]" size={32} />
        <h2 className="text-xl font-bold sm:text-2xl">
          {score} / {total} correct ({pct}%)
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{verdict} on "{quiz.title}"</p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={onRetake}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm font-medium hover:border-[var(--accent)]"
          >
            <RotateCcw size={15} /> Retake quiz
          </button>
          <button
            onClick={onExit}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg-primary)]"
          >
            Back to all quizzes
          </button>
        </div>
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
        Review answers
      </h3>
      <div className="flex flex-col gap-3">
        {quiz.questions.map((q, i) => {
          const userAnswer = answers[i];
          const correct = userAnswer === q.correctIndex;
          return (
            <div
              key={q.id}
              className={`rounded-xl border p-4 ${
                correct ? "border-[var(--accent)]/40 bg-[var(--accent)]/5" : "border-rose-400/40 bg-rose-400/5"
              }`}
            >
              <div className="mb-2 flex items-start gap-2">
                {correct ? (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                ) : (
                  <XCircle size={18} className="mt-0.5 shrink-0 text-rose-500" />
                )}
                <p className="text-sm font-medium leading-relaxed">
                  {i + 1}. {q.question}
                </p>
              </div>
              <div className="ml-6 flex flex-col gap-1 text-xs">
                {!correct && (
                  <p className="text-rose-500">
                    Your answer: {userAnswer !== null ? q.options[userAnswer] : "Skipped"}
                  </p>
                )}
                <p className="text-[var(--accent)]">Correct answer: {q.options[q.correctIndex]}</p>
                <p className="mt-1 text-[var(--text-secondary)]">{q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Cheat sheets view
// ---------------------------------------------------------------------------

function CheatSheetsView() {
  const [openId, setOpenId] = useState<string | null>(CHEAT_SHEETS[0]?.id ?? null);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {CHEAT_SHEETS.map((sheet, i) => {
        const open = openId === sheet.id;
        return (
          <motion.div
            key={sheet.id}
            initial="hidden"
            animate="show"
            custom={i}
            variants={fadeUp}
            className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4"
          >
            <button
              onClick={() => setOpenId(open ? null : sheet.id)}
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  {sheet.category}
                </span>
                <h3 className="text-sm font-semibold sm:text-base">{sheet.title}</h3>
              </div>
              <span className="text-[var(--accent)]">{open ? "−" : "+"}</span>
            </button>
            <AnimatePresence>
              {open && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 flex flex-col gap-2 overflow-hidden"
                >
                  {sheet.points.map((point, idx) => (
                    <li
                      key={idx}
                      className="rounded-lg bg-[var(--bg-primary)] px-3 py-2 font-mono text-xs text-[var(--text-primary)]"
                    >
                      {point}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Diagrams view — inline SVGs, themed via CSS vars so they adapt to light/dark
// ---------------------------------------------------------------------------

function DiagramCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
      <h3 className="mb-3 text-sm font-semibold sm:text-base">{title}</h3>
      <div className="flex justify-center overflow-x-auto">{children}</div>
    </div>
  );
}

function DiagramsView() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
        <DiagramCard title="Big-O Growth Curve">
          <svg viewBox="0 0 320 200" className="w-full max-w-sm">
            <line x1="30" y1="170" x2="300" y2="170" stroke="var(--border-color)" strokeWidth="1.5" />
            <line x1="30" y1="170" x2="30" y2="20" stroke="var(--border-color)" strokeWidth="1.5" />
            <path d="M30,170 L300,170" stroke="var(--text-secondary)" strokeWidth="1.5" />
            <path d="M30,150 C120,150 200,140 300,130" fill="none" stroke="var(--accent)" strokeWidth="2" />
            <path d="M30,170 L300,60" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <path d="M30,170 C 120,150 200,90 300,30" fill="none" stroke="#f472b6" strokeWidth="2" />
            <path d="M30,170 C 60,140 100,20 130,20 L300,20" fill="none" stroke="#ef4444" strokeWidth="2" />
            <text x="255" y="125" fontSize="9" fill="var(--accent)">O(log n)</text>
            <text x="255" y="55" fontSize="9" fill="#f59e0b">O(n)</text>
            <text x="220" y="35" fontSize="9" fill="#f472b6">O(n log n)</text>
            <text x="135" y="15" fontSize="9" fill="#ef4444">O(2^n)</text>
            <text x="8" y="175" fontSize="9" fill="var(--text-secondary)">0</text>
            <text x="150" y="188" fontSize="9" fill="var(--text-secondary)">input size (n)</text>
          </svg>
        </DiagramCard>
      </motion.div>

      <motion.div initial="hidden" animate="show" custom={1} variants={fadeUp}>
        <DiagramCard title="REST Request / Response Flow">
          <svg viewBox="0 0 340 140" className="w-full max-w-sm">
            <rect x="10" y="50" width="90" height="40" rx="8" fill="var(--bg-primary)" stroke="var(--accent)" strokeWidth="1.5" />
            <text x="55" y="74" fontSize="11" textAnchor="middle" fill="var(--text-primary)">Client</text>
            <rect x="240" y="50" width="90" height="40" rx="8" fill="var(--bg-primary)" stroke="var(--accent)" strokeWidth="1.5" />
            <text x="285" y="74" fontSize="11" textAnchor="middle" fill="var(--text-primary)">Server</text>
            <line x1="100" y1="60" x2="238" y2="60" stroke="var(--text-secondary)" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="170" y="52" fontSize="9" textAnchor="middle" fill="var(--text-secondary)">GET /users/5</text>
            <line x1="238" y1="82" x2="100" y2="82" stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#arrow2)" />
            <text x="170" y="98" fontSize="9" textAnchor="middle" fill="var(--accent)">200 OK + JSON</text>
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="var(--text-secondary)" />
              </marker>
              <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent)" />
              </marker>
            </defs>
          </svg>
        </DiagramCard>
      </motion.div>

      <motion.div initial="hidden" animate="show" custom={2} variants={fadeUp}>
        <DiagramCard title="Git Feature-Branch Workflow">
          <svg viewBox="0 0 320 140" className="w-full max-w-sm">
            <line x1="20" y1="30" x2="300" y2="30" stroke="var(--text-secondary)" strokeWidth="2" />
            <circle cx="20" cy="30" r="5" fill="var(--text-secondary)" />
            <circle cx="120" cy="30" r="5" fill="var(--text-secondary)" />
            <circle cx="300" cy="30" r="5" fill="var(--text-secondary)" />
            <text x="10" y="18" fontSize="9" fill="var(--text-secondary)">main</text>
            <path d="M120,30 C160,30 160,90 200,90" fill="none" stroke="var(--accent)" strokeWidth="2" />
            <circle cx="200" cy="90" r="5" fill="var(--accent)" />
            <circle cx="250" cy="90" r="5" fill="var(--accent)" />
            <text x="205" y="105" fontSize="9" fill="var(--accent)">feature/x</text>
            <path d="M250,90 C280,90 280,30 300,30" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 3" />
            <text x="240" y="60" fontSize="9" fill="var(--text-secondary)">PR merge</text>
          </svg>
        </DiagramCard>
      </motion.div>

      <motion.div initial="hidden" animate="show" custom={3} variants={fadeUp}>
        <DiagramCard title="CSS Box Model">
          <svg viewBox="0 0 300 180" className="w-full max-w-sm">
            <rect x="10" y="10" width="280" height="160" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
            <text x="14" y="24" fontSize="9" fill="#f59e0b">margin</text>
            <rect x="35" y="35" width="230" height="110" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
            <text x="40" y="48" fontSize="9" fill="var(--accent)">border</text>
            <rect x="55" y="55" width="190" height="70" fill="var(--bg-primary)" stroke="#f472b6" strokeWidth="1.5" />
            <text x="60" y="68" fontSize="9" fill="#f472b6">padding</text>
            <rect x="80" y="75" width="140" height="30" fill="var(--accent-soft)" stroke="var(--text-secondary)" strokeWidth="1" />
            <text x="110" y="94" fontSize="10" fill="var(--text-primary)">content</text>
          </svg>
        </DiagramCard>
      </motion.div>

      <motion.div initial="hidden" animate="show" custom={4} variants={fadeUp} className="lg:col-span-2">
        <DiagramCard title="SQL Join Types">
          <svg viewBox="0 0 560 150" className="w-full max-w-2xl">
            {[
              { cx: 70, label: "INNER JOIN", fillA: "none", fillB: "none", overlap: "var(--accent)" },
              { cx: 210, label: "LEFT JOIN", fillA: "var(--accent)", fillB: "none", overlap: "var(--accent)" },
              { cx: 350, label: "RIGHT JOIN", fillA: "none", fillB: "var(--accent)", overlap: "var(--accent)" },
              { cx: 490, label: "FULL OUTER", fillA: "var(--accent)", fillB: "var(--accent)", overlap: "var(--accent)" },
            ].map((d, idx) => (
              <g key={idx}>
                <circle cx={d.cx - 15} cy="60" r="30" fill={d.fillA === "none" ? "var(--bg-primary)" : "var(--accent-soft)"} stroke="var(--text-secondary)" strokeWidth="1.5" opacity="0.9" />
                <circle cx={d.cx + 15} cy="60" r="30" fill={d.fillB === "none" ? "var(--bg-primary)" : "var(--accent-soft)"} stroke="var(--text-secondary)" strokeWidth="1.5" opacity="0.9" />
                <text x={d.cx} y="120" fontSize="10" textAnchor="middle" fill="var(--text-primary)">{d.label}</text>
              </g>
            ))}
          </svg>
        </DiagramCard>
      </motion.div>
    </div>
  );
}