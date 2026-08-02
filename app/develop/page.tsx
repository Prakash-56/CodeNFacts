"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Zap,
  Brain,
  Bug,
  CircuitBoard,
  Database,
  Terminal,
  Sparkles,
  Swords,
  Layers,
  Binary,
  Route,
  Timer,
  Flame,
  Puzzle,
  Scissors,
  Cpu,
  MessageSquare,
  Crown,
  DoorOpen,
  ChevronRight,
  Star,
  Clock,
  Trophy,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================

type CategoryId =
  | "all"
  | "debugging"
  | "algorithms"
  | "systems"
  | "database"
  | "terminal"
  | "ai"
  | "speed"
  | "logic"
  | "advanced";

interface Category {
  id: CategoryId;
  label: string;
}

interface Game {
  slug: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  category: Exclude<CategoryId, "all">;
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: string; // e.g. "2-5 min"
  comment: string; // shown in the terminal-window header as a code comment
  unique?: boolean;
}

// ============================================================
// MOCK DATA — TODO(backend): replace with data fetched from
// /api/games (progress, unlock state, per-user best scores, etc.)
// ============================================================

const CATEGORIES: Category[] = [
  { id: "all", label: "All Battles" },
  { id: "debugging", label: "Debugging" },
  { id: "algorithms", label: "Algorithms" },
  { id: "systems", label: "Memory & Systems" },
  { id: "database", label: "Database" },
  { id: "terminal", label: "Terminal & Linux" },
  { id: "ai", label: "AI" },
  { id: "speed", label: "Speed & Reflex" },
  { id: "logic", label: "Logic & Math" },
  { id: "advanced", label: "Advanced" },
];

const GAMES: Game[] = [
  {
    slug: "code-detective",
    title: "Code Detective",
    tagline: "One snippet, one hidden bug. Spot it before the clock runs out.",
    icon: Search,
    category: "debugging",
    difficulty: 5,
    duration: "3-5 min",
    comment: "// find the bug, not the feature",
    unique: true,
  },
  {
    slug: "algorithm-race",
    title: "Algorithm Race",
    tagline: "Every move is an algorithm. Pick the fastest path to the finish.",
    icon: Zap,
    category: "algorithms",
    difficulty: 5,
    duration: "2-4 min",
    comment: "// O(log n) wins the race",
    unique: true,
  },
  {
    slug: "memory-compiler",
    title: "Memory Compiler",
    tagline: "Memorize the sequence before it vanishes, then rebuild it from scratch.",
    icon: Brain,
    category: "systems",
    difficulty: 3,
    duration: "2-3 min",
    comment: "// int float double char bool",
  },
  {
    slug: "bug-hunter",
    title: "Bug Hunter",
    tagline: "A full editor, ten bugs hiding in plain sight. Find them all.",
    icon: Bug,
    category: "debugging",
    difficulty: 4,
    duration: "4-5 min",
    comment: "// where's waldo, but it's a NullPointerException",
  },
  {
    slug: "logic-circuit-builder",
    title: "Logic Circuit Builder",
    tagline: "Drag AND, OR, NOT and XOR gates until the output reads TRUE.",
    icon: CircuitBoard,
    category: "logic",
    difficulty: 3,
    duration: "3-5 min",
    comment: "// output = HIGH",
  },
  {
    slug: "sql-escape-room",
    title: "SQL Escape Room",
    tagline: "The door only opens for a correct query. Write your way out.",
    icon: DoorOpen,
    category: "database",
    difficulty: 3,
    duration: "3-5 min",
    comment: "// SELECT * FROM freedom;",
  },
  {
    slug: "terminal-hacker",
    title: "Terminal Hacker",
    tagline: "Looks like a hack. Is actually you learning real Linux commands.",
    icon: Terminal,
    category: "terminal",
    difficulty: 2,
    duration: "3-5 min",
    comment: "// access granted",
  },
  {
    slug: "ai-prompt-battle",
    title: "AI Prompt Battle",
    tagline: "Write the prompt that gets the image right. AI scores your craft.",
    icon: Sparkles,
    category: "ai",
    difficulty: 3,
    duration: "3-4 min",
    comment: "// clarity + structure + detail",
  },
  {
    slug: "time-complexity-fight",
    title: "Time Complexity Fight",
    tagline: "Enemies attack. Your weapon is Big-O. Choose wisely.",
    icon: Swords,
    category: "algorithms",
    difficulty: 4,
    duration: "2-4 min",
    comment: "// O(1) one-shots everything",
  },
  {
    slug: "stack-tower",
    title: "Stack Tower",
    tagline: "Blocks fall fast. Push, pop and peek before the tower collapses.",
    icon: Layers,
    category: "algorithms",
    difficulty: 2,
    duration: "2-3 min",
    comment: "// LIFO or it falls",
  },
  {
    slug: "binary-hero",
    title: "Binary Hero",
    tagline: "Convert decimal to binary before the enemy's timer hits zero.",
    icon: Binary,
    category: "systems",
    difficulty: 2,
    duration: "2-3 min",
    comment: "// 25 -> 11001",
  },
  {
    slug: "pointer-maze",
    title: "Pointer Maze",
    tagline: "Navigate raw memory, collect variables, avoid segfaults.",
    icon: Route,
    category: "systems",
    difficulty: 5,
    duration: "4-5 min",
    comment: "// *ptr != nullptr, hopefully",
  },
  {
    slug: "code-speed-challenge",
    title: "Code Speed Challenge",
    tagline: "No typing. Just thinking. Predict the output, fast.",
    icon: Timer,
    category: "speed",
    difficulty: 3,
    duration: "2-3 min",
    comment: "// print(output) // ?",
  },
  {
    slug: "complexity-escape",
    title: "Complexity Escape",
    tagline: "A maze that punishes the wrong algorithm. Find the shortest path.",
    icon: Route,
    category: "algorithms",
    difficulty: 4,
    duration: "3-5 min",
    comment: "// greedy, bfs, dfs — pick right",
  },
  {
    slug: "brain-blitz",
    title: "Brain Blitz",
    tagline: "60 seconds. Every subject. Combo multiplier if you keep the streak.",
    icon: Flame,
    category: "speed",
    difficulty: 4,
    duration: "1 min",
    comment: "// daily challenge, no mercy",
  },
  {
    slug: "pattern-master",
    title: "Pattern Master",
    tagline: "3, 6, 12, 24... what's next? Placement-prep pattern spotting.",
    icon: Puzzle,
    category: "logic",
    difficulty: 2,
    duration: "2-3 min",
    comment: "// next(seq) => ?",
  },
  {
    slug: "regex-ninja",
    title: "Regex Ninja",
    tagline: "Strings fly past. Slice the ones your regex matches.",
    icon: Scissors,
    category: "logic",
    difficulty: 4,
    duration: "2-4 min",
    comment: "// /^[a-z]+$/ or bust",
  },
  {
    slug: "compiler-run",
    title: "Compiler Run",
    tagline: "Predict: compiles clean, runtime error, or syntax error?",
    icon: Cpu,
    category: "debugging",
    difficulty: 2,
    duration: "2-3 min",
    comment: "// gcc says what?",
  },
  {
    slug: "interview-simulator",
    title: "Interview Simulator",
    tagline: "An AI interviewer asks. You answer. It scores and unlocks badges.",
    icon: MessageSquare,
    category: "ai",
    difficulty: 4,
    duration: "4-5 min",
    comment: "// process vs thread, go",
  },
  {
    slug: "code-chess",
    title: "Code Chess",
    tagline: "Loops, functions, arrays and queues as chess pieces. Think in algorithms.",
    icon: Crown,
    category: "advanced",
    difficulty: 5,
    duration: "5 min",
    comment: "// checkmate is O(1) lookahead",
    unique: true,
  },
];

// ============================================================
// SMALL UI PIECES
// ============================================================

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Difficulty ${level} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < level
              ? "fill-emerald-500 text-emerald-500"
              : "fill-transparent text-zinc-300 dark:text-zinc-700"
          }`}
        />
      ))}
    </div>
  );
}

function GameCard({ game, index }: { game: Game; index: number }) {
  const Icon = game.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link href={`/develop/${game.slug}`} className="group block h-full">
        <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/10 dark:border-zinc-800 dark:bg-[#0d1117]">
          {/* Terminal window chrome */}
          <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-[#0a0e14]">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 truncate font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
              {game.comment}
            </span>
            {game.unique && (
              <span className="ml-auto flex-shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                signature
              </span>
            )}
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white dark:text-emerald-400">
                <Icon className="h-5 w-5" />
              </div>
              <DifficultyStars level={game.difficulty} />
            </div>

            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {game.title}
              </h3>
              <p className="mt-1 text-sm leading-snug text-zinc-500 dark:text-zinc-400">
                {game.tagline}
              </p>
            </div>

            <div className="mt-auto flex items-center justify-between pt-2 text-xs text-zinc-400 dark:text-zinc-500">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5" />
                {game.duration}
              </span>
              <span className="flex items-center gap-1 font-medium text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-emerald-400">
                Play <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================================
// HERO — boot-sequence style, matches the AI tutor terminal feel
// ============================================================

const BOOT_LINES = [
  "$ initializing brain_arena.exe",
  "$ loading 20 modules...",
  "$ compiling battles [debugging, algorithms, systems, ai, ...]",
  "$ ready. pick a battle.",
];

function BootSequence() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= BOOT_LINES.length) return;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 450);
    return () => clearTimeout(t);
  }, [visibleLines]);

  return (
    <div className="font-mono text-sm">
      {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
        <div
          key={i}
          className={
            i === BOOT_LINES.length - 1
              ? "text-emerald-500"
              : "text-zinc-500 dark:text-zinc-400"
          }
        >
          {line}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function DevelopPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [query, setQuery] = useState("");

  const filteredGames = useMemo(() => {
    return GAMES.filter((g) => {
      const matchesCategory =
        activeCategory === "all" || g.category === activeCategory;
      const matchesQuery =
        query.trim().length === 0 ||
        g.title.toLowerCase().includes(query.toLowerCase()) ||
        g.tagline.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  // TODO(backend): replace with real user stats from /api/user/stats
  const stats = {
    streak: 4,
    xp: 1280,
    battlesPlayed: 27,
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0e14]">
      {/* ---------------- HERO ---------------- */}
      <section className="border-b border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-[#0d1117]/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-600 dark:text-emerald-400">
              <Terminal className="h-3.5 w-3.5" />
              CodeNFacts / brain-arena
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl dark:text-zinc-50">
              Brain Arena
            </h1>
            <p className="max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
              Not one big game - twenty small ones. Each Brain Battle takes
              2 to 5 minutes and teaches something real: debugging,
              algorithms, systems, SQL, Linux, even digital logic. Play one
              between classes.
            </p>

            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#0a0e14]">
              <BootSequence />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FILTER BAR ---------------- */}
      <section className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-[#0a0e14]/95">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search battles..."
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 dark:border-zinc-800 dark:bg-[#0d1117] dark:text-zinc-100"
              />
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-500/50 hover:text-emerald-600 dark:border-zinc-800 dark:bg-[#0d1117] dark:text-zinc-400 dark:hover:text-emerald-400"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- GRID ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {filteredGames.length} battle{filteredGames.length !== 1 && "s"}{" "}
            found
          </p>
        </div>

        {filteredGames.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game, i) => (
                <GameCard key={game.slug} game={game} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-800">
            <Terminal className="h-8 w-8 text-zinc-400" />
            <p className="mt-3 font-mono text-sm text-zinc-500 dark:text-zinc-400">
              $ no battles match &quot;{query}&quot;
            </p>
            <button
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
              }}
              className="mt-4 rounded-lg border border-emerald-500 px-4 py-1.5 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white dark:text-emerald-400"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}