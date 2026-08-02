'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Terminal,
  RotateCcw,
  Trophy,
  Timer as TimerIcon,
  Target,
  ClipboardCheck,
  Map as MapIcon,
  BookOpen,
  Code2,
  FolderGit2,
  Briefcase,
  Users,
  ArrowRight,
  CheckCircle2,
  Brain,
  BarChart3,
  Globe2,
  Binary,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Journey data                                                       */
/* ------------------------------------------------------------------ */

type Accent = 'teal' | 'violet' | 'amber' | 'sky' | 'rose' | 'lime' | 'fuchsia';

const ACCENTS: Record<Accent, { badge: string; button: string; border: string }> = {
  teal: {
    badge: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300',
    button:
      'bg-teal-600 hover:bg-teal-500 dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950',
    border: 'hover:border-teal-400 dark:hover:border-teal-500',
  },
  violet: {
    badge: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300',
    button:
      'bg-violet-600 hover:bg-violet-500 dark:bg-violet-400 dark:hover:bg-violet-300 dark:text-slate-950',
    border: 'hover:border-violet-400 dark:hover:border-violet-500',
  },
  amber: {
    badge: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300',
    button:
      'bg-amber-600 hover:bg-amber-500 dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950',
    border: 'hover:border-amber-400 dark:hover:border-amber-500',
  },
  sky: {
    badge: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300',
    button:
      'bg-sky-600 hover:bg-sky-500 dark:bg-sky-400 dark:hover:bg-sky-300 dark:text-slate-950',
    border: 'hover:border-sky-400 dark:hover:border-sky-500',
  },
  rose: {
    badge: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300',
    button:
      'bg-rose-600 hover:bg-rose-500 dark:bg-rose-400 dark:hover:bg-rose-300 dark:text-slate-950',
    border: 'hover:border-rose-400 dark:hover:border-rose-500',
  },
  lime: {
    badge: 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',
    button:
      'bg-lime-600 hover:bg-lime-500 dark:bg-lime-400 dark:hover:bg-lime-300 dark:text-slate-950',
    border: 'hover:border-lime-400 dark:hover:border-lime-500',
  },
  fuchsia: {
    badge: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
    button:
      'bg-fuchsia-600 hover:bg-fuchsia-500 dark:bg-fuchsia-400 dark:hover:bg-fuchsia-300 dark:text-slate-950',
    border: 'hover:border-fuchsia-400 dark:hover:border-fuchsia-500',
  },
};

type SimpleItem = { label: string; icon?: LucideIcon };
type GoalItem = { label: string; icon: LucideIcon; href: string };

type JourneyStep = {
  id: string;
  circled: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  goals?: GoalItem[];
  items?: SimpleItem[];
  itemLayout?: 'pill' | 'checklist';
  button: { label: string; href: string };
  accent: Accent;
};

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'step-1',
    circled: '①',
    icon: Target,
    eyebrow: 'Step 1',
    title: 'Choose Your Goal',
    description:
      'Tell us where you want to end up — every roadmap, course, and project from here on is shaped around it.',
    goals: [
      { label: 'Become an AI/ML Engineer', icon: Brain, href: '/roadmaps/ai-ml' },
      { label: 'Become a Data Scientist', icon: BarChart3, href: '/roadmaps/data-science' },
      { label: 'Become a Full-Stack Developer', icon: Terminal, href: '/roadmaps/full-stack' },
      { label: 'Crack DSA & Coding Interviews', icon: Binary, href: '/roadmaps/dsa' },
      { label: 'Learn Web Development', icon: Globe2, href: '/roadmaps/web-development' },
    ],
    button: { label: 'Choose My Goal', href: '/goals' },
    accent: 'teal',
  },
  {
    id: 'step-2',
    circled: '②',
    icon: ClipboardCheck,
    eyebrow: 'Step 2',
    title: 'Take a Skill Assessment',
    description:
      'A short quiz places you at the right starting point, so you never repeat what you already know.',
    items: [{ label: '10 questions' }, { label: '5 minutes' }, { label: 'Instant results' }],
    itemLayout: 'pill',
    button: { label: 'Start Free Assessment', href: '/assessment' },
    accent: 'violet',
  },
  {
    id: 'step-3',
    circled: '③',
    icon: MapIcon,
    eyebrow: 'Step 3',
    title: 'Explore Roadmaps',
    description: 'Interactive roadmaps lay out every milestone between here and your goal.',
    items: [
      { label: 'Python Roadmap' },
      { label: 'AI/ML Roadmap' },
      { label: 'Data Science Roadmap' },
      { label: 'MERN Roadmap' },
      { label: 'DSA Roadmap' },
    ],
    itemLayout: 'pill',
    button: { label: 'View Roadmaps', href: '/roadmaps' },
    accent: 'amber',
  },
  {
    id: 'step-4',
    circled: '④',
    icon: BookOpen,
    eyebrow: 'Step 4',
    title: 'Start Learning',
    description: 'Featured beginner courses, ready whenever you are.',
    items: [
      { label: 'Python Basics', icon: Terminal },
      { label: 'AI & Machine Learning', icon: Brain },
      { label: 'Data Science', icon: BarChart3 },
      { label: 'HTML, CSS & JavaScript', icon: Globe2 },
      { label: 'Data Structures & Algorithms', icon: Binary },
    ],
    itemLayout: 'checklist',
    button: { label: 'Browse Courses', href: '/courses' },
    accent: 'sky',
  },
  {
    id: 'step-5',
    circled: '⑤',
    icon: Code2,
    eyebrow: 'Step 5',
    title: 'Practice Coding',
    description: 'Jump straight into the coding environment — no setup required.',
    items: [
      { label: 'Online Code Editor' },
      { label: 'Daily Coding Challenge' },
      { label: 'Quiz' },
      { label: 'Coding Playground' },
    ],
    itemLayout: 'checklist',
    button: { label: 'Start Coding', href: '/practice' },
    accent: 'rose',
  },
  {
    id: 'step-6',
    circled: '⑥',
    icon: FolderGit2,
    eyebrow: 'Step 6',
    title: 'Build Your Portfolio',
    description: 'Project-based learning that turns into something you can point to.',
    items: [
      { label: 'Spam Detection' },
      { label: 'Chatbot' },
      { label: 'Face Recognition' },
      { label: 'Weather App' },
      { label: 'Portfolio Website' },
    ],
    itemLayout: 'pill',
    button: { label: 'Build Projects', href: '/projects' },
    accent: 'lime',
  },
  {
    id: 'step-7',
    circled: '⑦',
    icon: Briefcase,
    eyebrow: 'Step 7',
    title: 'Prepare for Interviews',
    description: 'One click from practice problem to interview-ready.',
    items: [
      { label: 'AI Interview Questions' },
      { label: 'DSA Interview Questions' },
      { label: 'HR Questions' },
      { label: 'Resume Checker' },
      { label: 'Mock Interview' },
    ],
    itemLayout: 'checklist',
    button: { label: 'Prepare Now', href: '/interview-prep' },
    accent: 'fuchsia',
  },
  {
    id: 'step-8',
    circled: '⑧',
    icon: Users,
    eyebrow: 'Step 8',
    title: 'Join the Community',
    description:
      'Learning sticks better with people around you — ask questions, share wins, show up to events.',
    items: [
      { label: 'Discord Community' },
      { label: 'Ask Doubts' },
      { label: 'Discussion Forum' },
      { label: 'Events' },
    ],
    itemLayout: 'pill',
    button: { label: 'Join Community', href: '/community' },
    accent: 'teal',
  },
];

/* ------------------------------------------------------------------ */
/*  Journey hero + step card                                           */
/* ------------------------------------------------------------------ */

function JourneyHero({ steps }: { steps: JourneyStep[] }) {
  return (
    <header className="mb-10 sm:mb-14">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-teal-600 dark:text-teal-400">
        codenfacts / quick-start
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">🚀 Quick Start Your Journey</h1>
      <p className="mt-3 max-w-xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
        Eight steps from your first line of code to your first job offer. Jump to
        any step below, or follow them in order.
      </p>

      <nav className="mt-6 flex flex-wrap gap-2">
        {steps.map((step) => (
          <a
            key={step.id}
            href={`#${step.id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-600 transition hover:border-teal-400 hover:text-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:text-teal-300"
          >
            <span className="text-slate-400 dark:text-slate-600">{step.circled}</span>
            {step.title}
          </a>
        ))}
      </nav>

      <a
        href="#step-1"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300"
      >
        Start Learning
        <ArrowRight size={14} />
      </a>
    </header>
  );
}

function StepCard({ step }: { step: JourneyStep }) {
  const Icon = step.icon;
  const accent = ACCENTS[step.accent];

  return (
    <section
      id={step.id}
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition dark:border-slate-800 dark:bg-slate-900 sm:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-start sm:gap-4">
          <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent.badge}`}>
            <Icon size={19} />
          </span>
          <span className="font-mono text-2xl text-slate-300 dark:text-slate-700">{step.circled}</span>
        </div>

        <div className="flex-1">
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {step.eyebrow}
          </p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{step.title}</h3>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {step.description}
          </p>

          {step.goals && (
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {step.goals.map((goal) => {
                const GoalIcon = goal.icon;
                return (
                  <Link
                    key={goal.label}
                    href={goal.href}
                    className={`group flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition dark:border-slate-700 dark:text-slate-200 ${accent.border}`}
                  >
                    <GoalIcon
                      size={15}
                      className="shrink-0 text-slate-400 transition dark:text-slate-500"
                    />
                    {goal.label}
                    <ArrowRight
                      size={13}
                      className="ml-auto opacity-0 transition group-hover:opacity-100"
                    />
                  </Link>
                );
              })}
            </div>
          )}

          {step.items && step.itemLayout === 'checklist' && (
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {step.items.map((item) => {
                const ItemIcon = item.icon ?? CheckCircle2;
                return (
                  <li
                    key={item.label}
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <ItemIcon size={14} className="shrink-0 text-slate-400 dark:text-slate-500" />
                    {item.label}
                  </li>
                );
              })}
            </ul>
          )}

          {step.items && step.itemLayout === 'pill' && (
            <div className="mt-4 flex flex-wrap gap-2">
              {step.items.map((item) => (
                <span
                  key={item.label}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  {item.label}
                </span>
              ))}
            </div>
          )}

          <Link
            href={step.button.href}
            className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition ${accent.button}`}
          >
            {step.button.label}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Tower of Hanoi (unchanged from the existing page)                  */
/* ------------------------------------------------------------------ */

type Level = { id: string; label: string; disks: number };

const LEVELS: Level[] = [
  { id: 'warmup', label: 'Warm-up', disks: 3 },
  { id: 'easy', label: 'Easy', disks: 4 },
  { id: 'medium', label: 'Medium', disks: 5 },
  { id: 'hard', label: 'Hard', disks: 6 },
  { id: 'expert', label: 'Expert', disks: 7 },
];

const DISK_STYLES = [
  'bg-teal-500 dark:bg-teal-400',
  'bg-violet-500 dark:bg-violet-400',
  'bg-amber-500 dark:bg-amber-400',
  'bg-sky-500 dark:bg-sky-400',
  'bg-rose-500 dark:bg-rose-400',
  'bg-lime-500 dark:bg-lime-400',
  'bg-fuchsia-500 dark:bg-fuchsia-400',
];

type Peg = number[]; // bottom -> top, larger number = larger disk

function makeInitialPegs(diskCount: number): [Peg, Peg, Peg] {
  const first: Peg = Array.from({ length: diskCount }, (_, i) => diskCount - i);
  return [first, [], []];
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function HanoiGame() {
  const [level, setLevel] = useState<Level>(LEVELS[0]);
  const [pegs, setPegs] = useState<[Peg, Peg, Peg]>(() => makeInitialPegs(level.disks));
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [shake, setShake] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const minMoves = 2 ** level.disks - 1;
  const isWon = pegs[2].length === level.disks;

  useEffect(() => {
    if (isRunning && !isWon) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isWon]);

  useEffect(() => {
    if (isWon && intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  }, [isWon]);

  const reset = useCallback(
    (next: Level = level) => {
      setPegs(makeInitialPegs(next.disks));
      setSelected(null);
      setMoves(0);
      setSeconds(0);
      setIsRunning(false);
    },
    [level]
  );

  const changeLevel = (next: Level) => {
    setLevel(next);
    reset(next);
  };

  const flash = (pegIndex: number) => {
    setShake(pegIndex);
    window.setTimeout(() => setShake(null), 300);
  };

  const handlePegClick = (index: number) => {
    if (isWon) return;

    if (selected === null) {
      if (pegs[index].length === 0) return;
      setSelected(index);
      return;
    }

    if (selected === index) {
      setSelected(null);
      return;
    }

    const from = pegs[selected];
    const to = pegs[index];
    const movingDisk = from[from.length - 1];
    const topOfTarget = to[to.length - 1];

    const legal = to.length === 0 || topOfTarget > movingDisk;

    if (!legal) {
      flash(index);
      setSelected(null);
      return;
    }

    const nextPegs = pegs.map((p) => [...p]) as [Peg, Peg, Peg];
    nextPegs[selected].pop();
    nextPegs[index].push(movingDisk);
    setPegs(nextPegs);
    setSelected(null);
    setMoves((m) => m + 1);
    if (!isRunning) setIsRunning(true);
  };

  const pegLabels = ['A', 'B', 'C'];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-mono text-lg font-semibold text-slate-900 dark:text-slate-50">
            Tower of Hanoi
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Move every disk to peg C. Only smaller disks may sit on larger ones.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => changeLevel(lvl)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                level.id === lvl.id
                  ? 'border-teal-600 bg-teal-600 text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950'
                  : 'border-slate-300 text-slate-600 hover:border-teal-500 hover:text-teal-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-300'
              }`}
            >
              {lvl.label}
              <span className="ml-1 opacity-60">{lvl.disks}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status readout */}
      <div className="mb-4 flex flex-wrap items-center gap-4 font-mono text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          moves: <strong className="text-slate-800 dark:text-slate-100">{moves}</strong>
        </span>
        <span className="inline-flex items-center gap-1">
          <TimerIcon size={13} /> {formatTime(seconds)}
        </span>
        <span>optimal: {minMoves}</span>
        {isWon && (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            <Trophy size={13} /> solved
            {moves === minMoves ? ' — perfect run!' : ''}
          </span>
        )}
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {pegs.map((peg, i) => (
          <button
            key={i}
            onClick={() => handlePegClick(i)}
            className={`group relative flex h-48 flex-col-reverse items-center justify-start rounded-lg border-2 border-dashed p-2 pb-3 transition sm:h-64 ${
              selected === i
                ? 'border-teal-500 bg-teal-50 dark:border-teal-400 dark:bg-teal-950/30'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700'
            } ${shake === i ? 'animate-pulse ring-2 ring-rose-400' : ''}`}
            aria-label={`Peg ${pegLabels[i]}`}
          >
            {/* peg pole */}
            <span className="pointer-events-none absolute bottom-3 left-1/2 h-[85%] w-1.5 -translate-x-1/2 rounded-full bg-slate-300 dark:bg-slate-700" />
            {/* disks */}
            {peg.map((diskSize, idx) => (
              <span
                key={idx}
                style={{ width: `${30 + diskSize * (100 / (level.disks + 1))}%` }}
                className={`relative z-10 mb-1 h-4 rounded-full shadow-sm sm:h-5 ${
                  DISK_STYLES[(diskSize - 1) % DISK_STYLES.length]
                } ${selected === i && idx === peg.length - 1 ? 'ring-2 ring-slate-900 dark:ring-white' : ''}`}
              />
            ))}
            <span className="pointer-events-none absolute -bottom-6 font-mono text-[11px] text-slate-400 dark:text-slate-500">
              {pegLabels[i]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-500 hover:text-teal-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-300"
        >
          <RotateCcw size={14} /> Reset board
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function QuickStartPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <JourneyHero steps={JOURNEY_STEPS} />

        <div className="space-y-5">
          {JOURNEY_STEPS.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>

        <section className="mt-14">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Take a break: Tower of Hanoi
          </h2>
          <HanoiGame />
        </section>
      </div>
    </main>
  );
}