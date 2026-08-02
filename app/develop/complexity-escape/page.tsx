"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

/* =========================================================================
   COMPLEXITY ESCAPE
   -------------------------------------------------------------------------
   A maze runtime that teaches shortest-path thinking by feel, not lecture.

   - Every step costs energy. Wandering (the thing greedy search and blind
     DFS both do when they guess wrong) burns your budget before you reach
     the exit.
   - Four difficulty tiers, 60 procedurally-generated, deterministically
     seeded mazes each (240 total), so every run is unique but reproducible.
   - A "Compare Algorithms" panel replays BFS, DFS and Greedy Best-First on
     the exact maze you just solved, so the difference is seen, not told.
   ========================================================================= */

/* ---------------------------- Geometry & RNG ---------------------------- */

type Dir = "N" | "E" | "S" | "W";
const DIRS: Dir[] = ["N", "E", "S", "W"];
const DELTA: Record<Dir, [number, number]> = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0],
};
const OPP: Record<Dir, Dir> = { N: "S", S: "N", E: "W", W: "E" };

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function idx(x: number, y: number, size: number): number {
  return y * size + x;
}
function inBounds(x: number, y: number, size: number): boolean {
  return x >= 0 && y >= 0 && x < size && y < size;
}

interface Cell {
  x: number;
  y: number;
  open: Record<Dir, boolean>;
  cost: number;
}

interface SearchResult {
  path: number[];
  order: number[];
}

interface MazeData {
  size: number;
  cells: Cell[];
  start: number;
  goal: number;
  bfsPath: number[];
  optimalCost: number;
  energyBudget: number;
}

function pathCost(cells: Cell[], path: number[]): number {
  let total = 0;
  for (let i = 1; i < path.length; i++) total += cells[path[i]].cost;
  return total;
}

/* ------------------------------ Search algos ----------------------------- */

function bfsSearch(cells: Cell[], size: number, start: number, goal: number): SearchResult {
  const visited = new Array(size * size).fill(false);
  const prev = new Array(size * size).fill(-1);
  const queue: number[] = [start];
  visited[start] = true;
  const order: number[] = [];
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    order.push(cur);
    if (cur === goal) break;
    const cx = cells[cur].x;
    const cy = cells[cur].y;
    for (const d of DIRS) {
      if (!cells[cur].open[d]) continue;
      const [dx, dy] = DELTA[d];
      const nx = cx + dx;
      const ny = cy + dy;
      if (!inBounds(nx, ny, size)) continue;
      const ni = idx(nx, ny, size);
      if (visited[ni]) continue;
      visited[ni] = true;
      prev[ni] = cur;
      queue.push(ni);
    }
  }
  return { path: reconstruct(prev, start, goal), order };
}

function dfsSearch(cells: Cell[], size: number, start: number, goal: number): SearchResult {
  const visited = new Array(size * size).fill(false);
  const prev = new Array(size * size).fill(-1);
  const stack: number[] = [start];
  visited[start] = true;
  const order: number[] = [];
  while (stack.length) {
    const cur = stack.pop() as number;
    order.push(cur);
    if (cur === goal) break;
    const cx = cells[cur].x;
    const cy = cells[cur].y;
    for (const d of [...DIRS].reverse()) {
      if (!cells[cur].open[d]) continue;
      const [dx, dy] = DELTA[d];
      const nx = cx + dx;
      const ny = cy + dy;
      if (!inBounds(nx, ny, size)) continue;
      const ni = idx(nx, ny, size);
      if (visited[ni]) continue;
      visited[ni] = true;
      prev[ni] = cur;
      stack.push(ni);
    }
  }
  return { path: reconstruct(prev, start, goal), order };
}

function greedySearch(cells: Cell[], size: number, start: number, goal: number): SearchResult {
  const gx = cells[goal].x;
  const gy = cells[goal].y;
  const h = (i: number) => Math.abs(cells[i].x - gx) + Math.abs(cells[i].y - gy);
  const visited = new Array(size * size).fill(false);
  const prev = new Array(size * size).fill(-1);
  const frontier: number[] = [start];
  visited[start] = true;
  const order: number[] = [];
  while (frontier.length) {
    let bestPos = 0;
    for (let i = 1; i < frontier.length; i++) {
      if (h(frontier[i]) < h(frontier[bestPos])) bestPos = i;
    }
    const cur = frontier.splice(bestPos, 1)[0];
    order.push(cur);
    if (cur === goal) break;
    const cx = cells[cur].x;
    const cy = cells[cur].y;
    for (const d of DIRS) {
      if (!cells[cur].open[d]) continue;
      const [dx, dy] = DELTA[d];
      const nx = cx + dx;
      const ny = cy + dy;
      if (!inBounds(nx, ny, size)) continue;
      const ni = idx(nx, ny, size);
      if (visited[ni]) continue;
      visited[ni] = true;
      prev[ni] = cur;
      frontier.push(ni);
    }
  }
  return { path: reconstruct(prev, start, goal), order };
}

function reconstruct(prev: number[], start: number, goal: number): number[] {
  const path: number[] = [];
  let cur = goal;
  if (prev[goal] === -1 && goal !== start) return [];
  while (cur !== -1 && cur !== start) {
    path.push(cur);
    cur = prev[cur];
  }
  path.push(start);
  path.reverse();
  return path;
}

/* -------------------------------- Maze gen -------------------------------- */

function generateMaze(seed: number, size: number, loopFactor: number, energyMultiplier: number): MazeData {
  const rand = mulberry32(seed);
  const cells: Cell[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      cells.push({
        x,
        y,
        open: { N: false, E: false, S: false, W: false },
        cost: 1 + Math.floor(rand() * 3),
      });
    }
  }

  // Randomized recursive backtracker -> perfect (fully connected, acyclic) maze.
  const visited = new Array(size * size).fill(false);
  const stack: number[] = [0];
  visited[0] = true;
  while (stack.length) {
    const current = stack[stack.length - 1];
    const cx = cells[current].x;
    const cy = cells[current].y;
    const order = shuffle([...DIRS], rand);
    let carved = false;
    for (const d of order) {
      const [dx, dy] = DELTA[d];
      const nx = cx + dx;
      const ny = cy + dy;
      if (!inBounds(nx, ny, size)) continue;
      const ni = idx(nx, ny, size);
      if (visited[ni]) continue;
      cells[current].open[d] = true;
      cells[ni].open[OPP[d]] = true;
      visited[ni] = true;
      stack.push(ni);
      carved = true;
      break;
    }
    if (!carved) stack.pop();
  }

  // Punch extra passages so loops exist -- this is what makes greedy and DFS
  // capable of guessing wrong. A perfect maze has only one route; a real
  // decision requires alternatives.
  const extra = Math.floor(size * size * loopFactor);
  for (let i = 0; i < extra; i++) {
    const x = Math.floor(rand() * size);
    const y = Math.floor(rand() * size);
    const d = DIRS[Math.floor(rand() * 4)];
    const [dx, dy] = DELTA[d];
    const nx = x + dx;
    const ny = y + dy;
    if (!inBounds(nx, ny, size)) continue;
    const a = idx(x, y, size);
    const b = idx(nx, ny, size);
    cells[a].open[d] = true;
    cells[b].open[OPP[d]] = true;
  }

  const corners = [0, size - 1, size * (size - 1), size * size - 1];
  const shuffledCorners = shuffle([...corners], rand);
  const start = shuffledCorners[0];
  const goal = shuffledCorners[1];

  const bfs = bfsSearch(cells, size, start, goal);
  const optimalCost = pathCost(cells, bfs.path);
  const energyBudget = Math.max(optimalCost + 2, Math.ceil(optimalCost * energyMultiplier));

  return { size, cells, start, goal, bfsPath: bfs.path, optimalCost, energyBudget };
}

function seedFor(levelIdx: number, questionIdx: number): number {
  return (levelIdx * 1000003 + questionIdx * 7919 + 12345) >>> 0;
}

/* --------------------------------- Config --------------------------------- */

interface LevelDef {
  id: string;
  name: string;
  tagline: string;
  size: number;
  loopFactor: number;
  energyMultiplier: number;
  accent: string;
  focus: string;
}

const LEVELS: LevelDef[] = [
  {
    id: "novice",
    name: "Novice Circuit",
    tagline: "One true path. Learn what \u201cshortest\u201d actually means.",
    size: 7,
    loopFactor: 0.03,
    energyMultiplier: 1.5,
    accent: "#2B5FFF",
    focus: "BFS fundamentals",
  },
  {
    id: "adept",
    name: "Adept Grid",
    tagline: "Loops appear. The closer-looking turn isn\u2019t always shorter.",
    size: 9,
    loopFactor: 0.11,
    energyMultiplier: 1.35,
    accent: "#7C3AED",
    focus: "Greedy vs. BFS",
  },
  {
    id: "expert",
    name: "Expert Lattice",
    tagline: "Branches multiply. Blind tunnels drain you fast.",
    size: 11,
    loopFactor: 0.19,
    energyMultiplier: 1.22,
    accent: "#DC6803",
    focus: "DFS vs. BFS",
  },
  {
    id: "master",
    name: "Master Nexus",
    tagline: "Tight budgets. Only near-optimal routes survive.",
    size: 13,
    loopFactor: 0.27,
    energyMultiplier: 1.1,
    accent: "#DC2626",
    focus: "Full mastery",
  },
];

const QUESTIONS_PER_LEVEL = 60;
const UNLOCK_THRESHOLD = 10;
const STORAGE_KEY = "complexity-escape/progress";

const ALGO_COLORS: Record<"bfs" | "dfs" | "greedy", string> = {
  bfs: "#2B5FFF",
  dfs: "#7C3AED",
  greedy: "#F59E0B",
};

const ALGO_LABELS: Record<"bfs" | "dfs" | "greedy", string> = {
  bfs: "Breadth-First Search",
  dfs: "Depth-First Search",
  greedy: "Greedy Best-First",
};

const ALGO_NOTES: Record<"bfs" | "dfs" | "greedy", string> = {
  bfs: "Explores in rings, one step out at a time. It never skips a shorter route to try a longer one first, so the first time it reaches the exit, that route is guaranteed shortest.",
  dfs: "Commits to a direction and rides it to the wall before backing up. Cheap to run, but it happily wastes moves down dead ends that BFS would never enter.",
  greedy: "Always steps toward whatever looks closest to the exit in a straight line. Fast when the maze cooperates, easily fooled when the straight line is walled off.",
};

const LESSON_TIPS = [
  "Trace the route in your head before you move \u2014 backtracking costs energy twice.",
  "A loop means two ways in. Only one of them is shorter.",
  "The exit \u201cfeels\u201d close doesn\u2019t mean the wall in front of you agrees.",
  "Every step you take twice is a step BFS never would have taken.",
  "Dead ends are DFS\u2019s favorite mistake. Don\u2019t make it yours.",
];

/* -------------------------------- Progress -------------------------------- */

interface QuestionResult {
  stars: number;
  bestCost: number;
}
type LevelProgress = Record<number, QuestionResult>;
type Progress = Record<string, LevelProgress>;

function completedCount(progress: Progress, levelId: string): number {
  const lp = progress[levelId];
  if (!lp) return 0;
  return Object.values(lp).filter((r) => r.stars > 0).length;
}

/* ---------------------------------------------------------------------------
   MazeGrid — pure, reusable renderer for both live play and the algorithm
   comparison preview.
--------------------------------------------------------------------------- */

interface HighlightSet {
  indices: Set<number>;
  color: string;
}

function MazeGrid({
  maze,
  highlightSets,
  playerIndex,
}: {
  maze: MazeData;
  highlightSets?: HighlightSet[];
  playerIndex?: number;
}) {
  const { cells, size, start, goal } = maze;
  return (
    <div
      className="ce-maze"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {cells.map((cell, i) => {
        const style: React.CSSProperties = {
          borderTop: cell.open.N ? "2px solid transparent" : "2px solid var(--ink)",
          borderLeft: cell.open.W ? "2px solid transparent" : "2px solid var(--ink)",
          borderRight: cell.open.E ? "2px solid transparent" : "2px solid var(--ink)",
          borderBottom: cell.open.S ? "2px solid transparent" : "2px solid var(--ink)",
        };
        let bg: string | undefined;
        if (highlightSets) {
          for (const hs of highlightSets) {
            if (hs.indices.has(i)) bg = hs.color;
          }
        }
        return (
          <div key={i} className="ce-cell" style={style}>
            {bg && <div className="ce-cell-fill" style={{ background: bg }} />}
            {i === start && playerIndex !== i && <span className="ce-tag ce-tag--start">S</span>}
            {i === goal && <span className="ce-tag ce-tag--goal">G</span>}
            {playerIndex === i && <span className="ce-player" />}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Page
--------------------------------------------------------------------------- */

export default function Page() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [progress, setProgress] = useState<Progress>({});
  const [mounted, setMounted] = useState(false);

  const level = LEVELS[levelIdx];
  const mazeData = useMemo(
    () => generateMaze(seedFor(levelIdx, questionIdx), level.size, level.loopFactor, level.energyMultiplier),
    [levelIdx, questionIdx, level.size, level.loopFactor, level.energyMultiplier]
  );

  const [playerPos, setPlayerPos] = useState<number>(mazeData.start);
  const [path, setPath] = useState<number[]>([mazeData.start]);
  const [energy, setEnergy] = useState<number>(mazeData.energyBudget);
  const [status, setStatus] = useState<"playing" | "won" | "depleted">("playing");
  const [hintUsed, setHintUsed] = useState(false);
  const [showHintPath, setShowHintPath] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [activeAlgo, setActiveAlgo] = useState<"bfs" | "dfs" | "greedy">("bfs");
  const [revealCount, setRevealCount] = useState(0);

  // Load saved progress once, client-side only.
  useEffect(() => {
    setMounted(true);
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(JSON.parse(raw) as Progress);
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  // Reset run state whenever the active maze changes.
  useEffect(() => {
    setPlayerPos(mazeData.start);
    setPath([mazeData.start]);
    setEnergy(mazeData.energyBudget);
    setStatus("playing");
    setHintUsed(false);
    setShowHintPath(false);
    setCompareOpen(false);
  }, [mazeData]);

  const saveProgress = useCallback(
    (stars: number, cost: number) => {
      setProgress((prev) => {
        const lvl = LEVELS[levelIdx];
        const levelProg: LevelProgress = { ...(prev[lvl.id] ?? {}) };
        const existing = levelProg[questionIdx];
        const nextStars = Math.max(stars, existing?.stars ?? 0);
        const nextCost = existing ? Math.min(existing.bestCost, cost) : cost;
        levelProg[questionIdx] = { stars: nextStars, bestCost: nextCost };
        const next: Progress = { ...prev, [lvl.id]: levelProg };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* storage unavailable, progress just won't persist */
        }
        return next;
      });
    },
    [levelIdx, questionIdx]
  );

  const attemptMove = useCallback(
    (d: Dir) => {
      if (status !== "playing") return;
      const cur = mazeData.cells[playerPos];
      if (!cur.open[d]) return;
      const [dx, dy] = DELTA[d];
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      if (!inBounds(nx, ny, mazeData.size)) return;
      const ni = idx(nx, ny, mazeData.size);
      const cost = mazeData.cells[ni].cost;
      const newEnergy = energy - cost;
      const newPath = [...path, ni];

      setPlayerPos(ni);
      setPath(newPath);

      if (ni === mazeData.goal) {
        const usedCost = pathCost(mazeData.cells, newPath);
        const stars = hintUsed ? 1 : usedCost === mazeData.optimalCost ? 3 : usedCost <= mazeData.optimalCost * 1.5 ? 2 : 1;
        setEnergy(Math.max(newEnergy, 0));
        setStatus("won");
        saveProgress(stars, usedCost);
        return;
      }
      if (newEnergy <= 0) {
        setEnergy(0);
        setStatus("depleted");
        return;
      }
      setEnergy(newEnergy);
    },
    [status, mazeData, playerPos, energy, path, hintUsed, saveProgress]
  );

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const map: Record<string, Dir> = {
        ArrowUp: "N",
        ArrowRight: "E",
        ArrowDown: "S",
        ArrowLeft: "W",
        w: "N",
        d: "E",
        s: "S",
        a: "W",
      };
      const d = map[e.key];
      if (d) {
        e.preventDefault();
        attemptMove(d);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [attemptMove]);

  const resetQuestion = useCallback(() => {
    setPlayerPos(mazeData.start);
    setPath([mazeData.start]);
    setEnergy(mazeData.energyBudget);
    setStatus("playing");
    setHintUsed(false);
    setShowHintPath(false);
  }, [mazeData]);

  const goToQuestion = useCallback((i: number) => {
    setQuestionIdx(Math.min(Math.max(i, 0), QUESTIONS_PER_LEVEL - 1));
  }, []);

  const compareData = useMemo(() => {
    return {
      bfs: bfsSearch(mazeData.cells, mazeData.size, mazeData.start, mazeData.goal),
      dfs: dfsSearch(mazeData.cells, mazeData.size, mazeData.start, mazeData.goal),
      greedy: greedySearch(mazeData.cells, mazeData.size, mazeData.start, mazeData.goal),
    };
  }, [mazeData]);

  useEffect(() => {
    if (!compareOpen) return;
    const order = compareData[activeAlgo].order;
    setRevealCount(0);
    let i = 0;
    const stepMs = Math.max(10, Math.floor(320 / Math.max(order.length, 1)));
    const timer = window.setInterval(() => {
      i += 1;
      setRevealCount(i);
      if (i >= order.length) window.clearInterval(timer);
    }, stepMs);
    return () => window.clearInterval(timer);
  }, [compareOpen, activeAlgo, compareData]);

  const usedCostSoFar = pathCost(mazeData.cells, path);
  const energyPct = Math.max(0, Math.min(100, (energy / mazeData.energyBudget) * 100));
  const fuseColor = energyPct > 50 ? level.accent : energyPct > 20 ? "#F5A623" : "#E11D48";
  const lessonTip = LESSON_TIPS[(levelIdx * 7 + questionIdx) % LESSON_TIPS.length];
  const levelDone = completedCount(progress, level.id);

  function isLevelUnlocked(li: number): boolean {
    if (li === 0) return true;
    return completedCount(progress, LEVELS[li - 1].id) >= UNLOCK_THRESHOLD;
  }

  const activeOrder = compareData[activeAlgo].order;
  const revealedIndices = new Set(activeOrder.slice(0, revealCount));
  const revealedPath = revealCount >= activeOrder.length ? new Set(compareData[activeAlgo].path) : new Set<number>();

  return (
    <div className="ce-root" style={{ ["--accent" as string]: level.accent }}>
      <style>{`
        .ce-root {
          --paper: #ffffff;
          --ink: #14171a;
          --ink-soft: #5b6169;
          --line: #e4e7ec;
          --line-soft: #f1f2f4;
          --accent-wash: color-mix(in srgb, var(--accent) 16%, white);
          --overlay-bg: rgba(255,255,255,0.94);
          --backdrop-bg: rgba(20,23,26,0.45);
          --tab-active-bg: color-mix(in srgb, var(--tab-color) 8%, white);
          background: var(--paper);
          color: var(--ink);
          min-height: 100vh;
          font-family: ui-sans-serif, -apple-system, "Segoe UI", Inter, sans-serif;
          transition: background-color 160ms ease, color 160ms ease;
        }

        /* System preference */
        @media (prefers-color-scheme: dark) {
          .ce-root {
            --paper: #0b0d10;
            --ink: #f1f2f4;
            --ink-soft: #9aa1a9;
            --line: #2a2e33;
            --line-soft: #1a1d21;
            --accent-wash: color-mix(in srgb, var(--accent) 22%, black);
            --overlay-bg: rgba(11,13,16,0.92);
            --backdrop-bg: rgba(0,0,0,0.6);
            --tab-active-bg: color-mix(in srgb, var(--tab-color) 16%, black);
          }
        }

        /* Class-based dark mode (next-themes / Tailwind "class" strategy) */
        :is(.dark, [data-theme="dark"]) .ce-root,
        .ce-root.dark,
        .ce-root[data-theme="dark"] {
          --paper: #0b0d10;
          --ink: #f1f2f4;
          --ink-soft: #9aa1a9;
          --line: #2a2e33;
          --line-soft: #1a1d21;
          --accent-wash: color-mix(in srgb, var(--accent) 22%, black);
          --overlay-bg: rgba(11,13,16,0.92);
          --backdrop-bg: rgba(0,0,0,0.6);
          --tab-active-bg: color-mix(in srgb, var(--tab-color) 16%, black);
        }

        /* Explicit light override when a parent forces light theme */
        :is(.light, [data-theme="light"]) .ce-root,
        .ce-root.light,
        .ce-root[data-theme="light"] {
          --paper: #ffffff;
          --ink: #14171a;
          --ink-soft: #5b6169;
          --line: #e4e7ec;
          --line-soft: #f1f2f4;
          --accent-wash: color-mix(in srgb, var(--accent) 16%, white);
          --overlay-bg: rgba(255,255,255,0.94);
          --backdrop-bg: rgba(20,23,26,0.45);
          --tab-active-bg: color-mix(in srgb, var(--tab-color) 8%, white);
        }

        .ce-mono {
          font-family: ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, monospace;
        }
        .ce-shell {
          max-width: 1040px;
          margin: 0 auto;
          padding: 28px 20px 80px;
        }
        .ce-boot {
          font-size: 12px;
          line-height: 1.7;
          color: var(--ink-soft);
          border-left: 2px solid var(--line);
          padding-left: 12px;
          margin-bottom: 22px;
          white-space: pre-line;
        }
        .ce-boot b { color: var(--ink); font-weight: 600; }
        .ce-eyebrow {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-soft);
          margin-bottom: 6px;
        }
        h1.ce-title {
          font-size: clamp(32px, 5vw, 44px);
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin: 0 0 6px;
          font-weight: 700;
        }
        .ce-sub {
          color: var(--ink-soft);
          font-size: 14px;
          max-width: 560px;
          margin-bottom: 28px;
        }
        .ce-levels {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }
        @media (max-width: 720px) { .ce-levels { grid-template-columns: repeat(2, 1fr); } }
        .ce-level-card {
          text-align: left;
          border: 1.5px solid var(--line);
          background: var(--paper);
          border-radius: 10px;
          padding: 12px 12px 10px;
          cursor: pointer;
          position: relative;
          transition: border-color 120ms ease, transform 120ms ease, background-color 160ms ease;
        }
        .ce-level-card:hover:not(:disabled) { transform: translateY(-1px); }
        .ce-level-card:disabled { cursor: not-allowed; opacity: 0.55; }
        .ce-level-card.active { border-color: var(--card-accent); box-shadow: 0 0 0 1px var(--card-accent) inset; }
        .ce-level-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--card-accent); margin-bottom: 8px; }
        .ce-level-name { font-weight: 700; font-size: 13.5px; margin-bottom: 3px; }
        .ce-level-tag { font-size: 11.5px; color: var(--ink-soft); line-height: 1.4; min-height: 30px; }
        .ce-level-meta { font-size: 10.5px; color: var(--ink-soft); margin-top: 8px; display: flex; justify-content: space-between; }
        .ce-lock { position: absolute; top: 10px; right: 10px; font-size: 10px; color: var(--ink-soft); }

        .ce-qstrip {
          border: 1.5px solid var(--line);
          border-radius: 10px;
          padding: 10px;
          margin-bottom: 24px;
          background: var(--paper);
          transition: background-color 160ms ease, border-color 160ms ease;
        }
        .ce-qstrip-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .ce-qstrip-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-soft); }
        .ce-qstrip-count { font-size: 11px; color: var(--ink-soft); }
        .ce-qgrid {
          display: grid;
          grid-template-columns: repeat(15, 1fr);
          gap: 5px;
          max-height: 132px;
          overflow-y: auto;
        }
        @media (max-width: 720px) { .ce-qgrid { grid-template-columns: repeat(10, 1fr); } }
        .ce-qbtn {
          aspect-ratio: 1;
          border-radius: 5px;
          border: 1px solid var(--line);
          background: var(--paper);
          font-size: 10px;
          color: var(--ink-soft);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
        }
        .ce-qbtn.current { border-color: var(--accent); color: var(--accent); font-weight: 700; }
        .ce-qbtn.done { background: var(--accent-wash); border-color: transparent; color: var(--ink); }

        .ce-stage {
          display: grid;
          grid-template-columns: minmax(0, 480px) minmax(240px, 1fr);
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 820px) { .ce-stage { grid-template-columns: 1fr; } }

        .ce-board { position: relative; }
        .ce-maze {
          display: grid;
          width: 100%;
          aspect-ratio: 1;
          border: 2px solid var(--ink);
          border-radius: 6px;
          overflow: hidden;
          background: var(--paper);
          transition: border-color 160ms ease, background-color 160ms ease;
        }
        .ce-cell { position: relative; }
        .ce-cell-fill { position: absolute; inset: 1px; border-radius: 2px; }
        .ce-tag {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: var(--ink-soft);
          font-family: ui-monospace, monospace;
        }
        .ce-tag--start { color: var(--accent); }
        .ce-tag--goal { color: #17b26a; }
        .ce-player {
          position: absolute; inset: 22%;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 25%, transparent);
        }

        .ce-overlay {
          position: absolute; inset: 0;
          background: var(--overlay-bg);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; gap: 10px; padding: 20px; border-radius: 6px;
          transition: background-color 160ms ease;
        }
        .ce-overlay h3 { margin: 0; font-size: 20px; }
        .ce-stars { font-size: 22px; letter-spacing: 4px; }
        .ce-btn {
          border: 1.5px solid var(--ink);
          background: var(--ink);
          color: var(--paper);
          font-size: 13px;
          font-weight: 600;
          padding: 9px 16px;
          border-radius: 7px;
          cursor: pointer;
          transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
        }
        .ce-btn.ghost { background: transparent; color: var(--ink); }
        .ce-btn.small { padding: 6px 11px; font-size: 12px; }
        .ce-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .ce-dpad { display: grid; grid-template-columns: repeat(3, 40px); grid-template-rows: repeat(2, 40px); gap: 6px; margin: 16px auto 0; justify-content: center; }
        .ce-dpad button {
          border: 1.5px solid var(--line); background: var(--paper); border-radius: 8px; cursor: pointer;
          font-size: 15px; color: var(--ink);
          transition: background-color 100ms ease;
        }
        .ce-dpad button:active { background: var(--line-soft); }
        .ce-hint-note { text-align: center; font-size: 11px; color: var(--ink-soft); margin-top: 8px; }

        .ce-hud { display: flex; flex-direction: column; gap: 16px; }
        .ce-panel {
          border: 1.5px solid var(--line);
          border-radius: 10px;
          padding: 14px;
          background: var(--paper);
          transition: background-color 160ms ease, border-color 160ms ease;
        }
        .ce-panel-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-soft); margin-bottom: 10px; }

        .ce-fuse-track { position: relative; height: 14px; border-radius: 7px; background: var(--line-soft); overflow: hidden; border: 1px solid var(--line); }
        .ce-fuse-fill {
          height: 100%; border-radius: 7px;
          background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 4px, transparent 4px 8px);
          transition: width 220ms ease, background-color 220ms ease;
        }
        .ce-fuse-nums { display: flex; justify-content: space-between; font-size: 11px; color: var(--ink-soft); margin-top: 6px; }

        .ce-stat-row { display: flex; justify-content: space-between; font-size: 12.5px; padding: 4px 0; }
        .ce-stat-row b { font-family: ui-monospace, monospace; }

        .ce-tip { font-size: 12.5px; line-height: 1.5; color: var(--ink-soft); }

        .ce-actions { display: flex; flex-wrap: wrap; gap: 8px; }

        .ce-modal-backdrop {
          position: fixed; inset: 0; background: var(--backdrop-bg);
          display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 40;
        }
        .ce-modal {
          background: var(--paper); border-radius: 14px; max-width: 620px; width: 100%;
          max-height: 88vh; overflow-y: auto; padding: 22px; border: 1px solid var(--line);
          transition: background-color 160ms ease, border-color 160ms ease;
        }
        .ce-tabs { display: flex; gap: 6px; margin: 14px 0; }
        .ce-tab {
          flex: 1; border: 1.5px solid var(--line); background: var(--paper); border-radius: 8px;
          padding: 8px; font-size: 12px; font-weight: 600; cursor: pointer; color: var(--ink-soft);
          transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
        }
        .ce-tab.active { border-color: var(--tab-color); color: var(--tab-color); background: var(--tab-active-bg); }
        .ce-compare-note { font-size: 12.5px; color: var(--ink-soft); line-height: 1.55; margin: 10px 0 14px; }
        .ce-compare-table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-top: 12px; }
        .ce-compare-table th, .ce-compare-table td { text-align: left; padding: 6px 8px; border-top: 1px solid var(--line); }
        .ce-compare-table th { color: var(--ink-soft); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }

        .ce-glossary { display: grid; gap: 10px; margin-top: 8px; }
        .ce-glossary-item b { display: block; font-size: 12.5px; margin-bottom: 2px; }
        .ce-glossary-item span { font-size: 12px; color: var(--ink-soft); line-height: 1.5; }
      `}</style>

      <div className="ce-shell">
        <div className="ce-eyebrow ce-mono">maze.runtime // energy-constrained pathfinding</div>
        <h1 className="ce-title">Complexity Escape</h1>
        <p className="ce-sub">
          A maze. Every wrong algorithm consumes energy. Find the shortest path before the budget hits zero
          &mdash; and along the way, greedy, BFS and DFS stop being words in a textbook.
        </p>

        <div className="ce-boot ce-mono">
          <b>&gt; maze.load()</b>{"\n"}
          &gt; every_wrong_turn -= energy{"\n"}
          &gt; shortest_path = required{"\n"}
          &gt; learning: greedy, bfs, dfs — by feel
        </div>

        {/* ---------------- Level select ---------------- */}
        <div className="ce-levels">
          {LEVELS.map((lvl, i) => {
            const unlocked = isLevelUnlocked(i);
            const done = completedCount(progress, lvl.id);
            return (
              <button
                key={lvl.id}
                disabled={!unlocked}
                className={`ce-level-card${i === levelIdx ? " active" : ""}`}
                style={{ ["--card-accent" as string]: lvl.accent }}
                onClick={() => {
                  setLevelIdx(i);
                  setQuestionIdx(0);
                }}
              >
                {!unlocked && <span className="ce-lock ce-mono">LOCKED</span>}
                <div className="ce-level-dot" />
                <div className="ce-level-name">{lvl.name}</div>
                <div className="ce-level-tag">{lvl.tagline}</div>
                <div className="ce-level-meta ce-mono">
                  <span>{lvl.focus}</span>
                  <span>{mounted ? done : 0}/{QUESTIONS_PER_LEVEL}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ---------------- Question strip ---------------- */}
        <div className="ce-qstrip">
          <div className="ce-qstrip-head">
            <span className="ce-qstrip-title">{level.name} &middot; questions</span>
            <span className="ce-qstrip-count ce-mono">{mounted ? levelDone : 0}/{QUESTIONS_PER_LEVEL} cleared</span>
          </div>
          <div className="ce-qgrid">
            {Array.from({ length: QUESTIONS_PER_LEVEL }, (_, i) => {
              const result = mounted ? progress[level.id]?.[i] : undefined;
              return (
                <button
                  key={i}
                  className={`ce-qbtn ce-mono${i === questionIdx ? " current" : ""}${result ? " done" : ""}`}
                  onClick={() => goToQuestion(i)}
                  title={result ? `${result.stars}★ best` : "Not attempted"}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------------- Main stage ---------------- */}
        <div className="ce-stage">
          <div className="ce-board">
            <MazeGrid
              maze={mazeData}
              playerIndex={playerPos}
              highlightSets={[
                { indices: new Set(path), color: "var(--line-soft)" },
                ...(showHintPath ? [{ indices: new Set(mazeData.bfsPath), color: "var(--accent-wash)" }] : []),
              ]}
            />
            {status !== "playing" && (
              <div className="ce-overlay">
                {status === "won" ? (
                  <>
                    <h3>Exit reached</h3>
                    <div className="ce-stars">
                      {"★".repeat(hintUsed ? 1 : usedCostSoFar === mazeData.optimalCost ? 3 : usedCostSoFar <= mazeData.optimalCost * 1.5 ? 2 : 1)}
                      <span style={{ color: "var(--line)" }}>
                        {"★".repeat(3 - (hintUsed ? 1 : usedCostSoFar === mazeData.optimalCost ? 3 : usedCostSoFar <= mazeData.optimalCost * 1.5 ? 2 : 1))}
                      </span>
                    </div>
                    <p className="ce-tip" style={{ maxWidth: 320 }}>
                      Energy spent: <b className="ce-mono">{usedCostSoFar}</b> &middot; BFS-optimal:{" "}
                      <b className="ce-mono">{mazeData.optimalCost}</b>
                      {usedCostSoFar === mazeData.optimalCost
                        ? " — that was the shortest possible route."
                        : " — see how close by opening Compare Algorithms."}
                    </p>
                    <div className="ce-actions" style={{ justifyContent: "center" }}>
                      <button className="ce-btn ghost small" onClick={resetQuestion}>Replay</button>
                      <button className="ce-btn small" onClick={() => goToQuestion(questionIdx + 1)} disabled={questionIdx >= QUESTIONS_PER_LEVEL - 1}>
                        Next maze &rarr;
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>Energy depleted</h3>
                    <p className="ce-tip" style={{ maxWidth: 300 }}>
                      That route cost more than the maze allowed. A tighter path exists &mdash; try tracing it
                      before you move this time.
                    </p>
                    <button className="ce-btn small" onClick={resetQuestion}>Try again</button>
                  </>
                )}
              </div>
            )}

            <div className="ce-dpad">
              <span />
              <button aria-label="Up" onClick={() => attemptMove("N")}>&uarr;</button>
              <span />
              <button aria-label="Left" onClick={() => attemptMove("W")}>&larr;</button>
              <button aria-label="Down" onClick={() => attemptMove("S")}>&darr;</button>
              <button aria-label="Right" onClick={() => attemptMove("E")}>&rarr;</button>
            </div>
            <p className="ce-hint-note">Arrow keys / WASD also work.</p>
          </div>

          <div className="ce-hud">
            <div className="ce-panel">
              <div className="ce-panel-title">Energy</div>
              <div className="ce-fuse-track">
                <div className="ce-fuse-fill" style={{ width: `${energyPct}%`, backgroundColor: fuseColor }} />
              </div>
              <div className="ce-fuse-nums ce-mono">
                <span>{Math.max(energy, 0)} left</span>
                <span>{mazeData.energyBudget} budget</span>
              </div>
            </div>

            <div className="ce-panel">
              <div className="ce-panel-title">Run stats</div>
              <div className="ce-stat-row"><span>Steps taken</span><b>{path.length - 1}</b></div>
              <div className="ce-stat-row"><span>Energy spent</span><b>{usedCostSoFar}</b></div>
              <div className="ce-stat-row"><span>BFS-optimal cost</span><b>{mazeData.optimalCost}</b></div>
              <div className="ce-stat-row"><span>Grid size</span><b>{mazeData.size}&times;{mazeData.size}</b></div>
            </div>

            <div className="ce-panel">
              <div className="ce-panel-title">Field note</div>
              <p className="ce-tip">{lessonTip}</p>
            </div>

            <div className="ce-actions">
              <button className="ce-btn ghost small" onClick={resetQuestion}>Reset</button>
              <button
                className="ce-btn ghost small"
                onClick={() => {
                  setShowHintPath((v) => !v);
                  setHintUsed(true);
                }}
              >
                {showHintPath ? "Hide" : "Peek"} optimal path
              </button>
              <button
                className="ce-btn small"
                onClick={() => {
                  setActiveAlgo("bfs");
                  setCompareOpen(true);
                }}
              >
                Compare algorithms
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- Glossary ---------------- */}
        <div className="ce-panel" style={{ marginTop: 28 }}>
          <div className="ce-panel-title">Field notes &mdash; what each search actually does</div>
          <div className="ce-glossary">
            {(Object.keys(ALGO_LABELS) as Array<"bfs" | "dfs" | "greedy">).map((k) => (
              <div className="ce-glossary-item" key={k}>
                <b style={{ color: ALGO_COLORS[k] }}>{ALGO_LABELS[k]}</b>
                <span>{ALGO_NOTES[k]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- Compare modal ---------------- */}
      {compareOpen && (
        <div className="ce-modal-backdrop" onClick={() => setCompareOpen(false)}>
          <div className="ce-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ce-panel-title" style={{ marginBottom: 0 }}>This maze, three ways</div>
            <div className="ce-tabs">
              {(Object.keys(ALGO_LABELS) as Array<"bfs" | "dfs" | "greedy">).map((k) => (
                <button
                  key={k}
                  className={`ce-tab${activeAlgo === k ? " active" : ""}`}
                  style={{ ["--tab-color" as string]: ALGO_COLORS[k] }}
                  onClick={() => setActiveAlgo(k)}
                >
                  {ALGO_LABELS[k]}
                </button>
              ))}
            </div>

            <MazeGrid
              maze={mazeData}
              highlightSets={[
                { indices: revealedIndices, color: `${ALGO_COLORS[activeAlgo]}33` },
                { indices: revealedPath, color: `${ALGO_COLORS[activeAlgo]}66` },
              ]}
            />

            <p className="ce-compare-note">{ALGO_NOTES[activeAlgo]}</p>

            <table className="ce-compare-table">
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Cells explored</th>
                  <th>Path steps</th>
                  <th>Energy cost</th>
                  <th>Optimal?</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(ALGO_LABELS) as Array<"bfs" | "dfs" | "greedy">).map((k) => {
                  const res = compareData[k];
                  const cost = pathCost(mazeData.cells, res.path);
                  return (
                    <tr key={k}>
                      <td style={{ color: ALGO_COLORS[k], fontWeight: 600 }}>{ALGO_LABELS[k]}</td>
                      <td className="ce-mono">{res.order.length}</td>
                      <td className="ce-mono">{Math.max(res.path.length - 1, 0)}</td>
                      <td className="ce-mono">{cost}</td>
                      <td>{cost === mazeData.optimalCost ? "Yes" : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="ce-actions" style={{ marginTop: 16, justifyContent: "flex-end" }}>
              <button className="ce-btn ghost small" onClick={() => setCompareOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}