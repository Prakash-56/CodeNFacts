"use client";

import { useState } from "react";

/* ============================================================================
   DSA TUTORIAL PAGE
   ----------------------------------------------------------------------------
   Notes for whoever wires this up:
   - This assumes Tailwind CSS with darkMode: 'class' already configured in
     the project, and that the header elsewhere in the app toggles the
     `dark` class on <html>. Nothing here renders its own theme button.
   - Only dependency is React (useState). No icon libraries, no chart libs —
     every diagram below is hand-built inline SVG so the file is drop-in safe.
   - Swap the Google Fonts import for next/font/google in production; it's
     left as a plain @import here so the file works standalone.
   ========================================================================== */

/* ---------------------------------- Fonts --------------------------------- */

const FONT_STYLES = `
  @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Kalam:wght@400;700&display=swap");
  .font-display { font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif; }
  .font-body { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
  .font-mono { font-family: "JetBrains Mono", ui-monospace, monospace; }
  .font-sketch { font-family: "Kalam", cursive; }
  .blueprint-grid {
    background-image:
      linear-gradient(to right, rgba(37, 99, 235, 0.07) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(37, 99, 235, 0.07) 1px, transparent 1px);
    background-size: 28px 28px;
  }
  .dark .blueprint-grid {
    background-image:
      linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px);
  }
`;

/* Plain <style> tag (not styled-jsx) so this file has no framework-specific
   type dependency — works the same in any Next.js app or plain CRA/Vite React. */
function FontLoader() {
  return <style dangerouslySetInnerHTML={{ __html: FONT_STYLES }} />;
}

/* -------------------------------- UI atoms -------------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-blue-600 dark:text-sky-400 mb-3">
      <span className="h-px w-6 bg-blue-600 dark:bg-sky-400" />
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="max-w-2xl mb-10">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      {lede && (
        <p className="font-body mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          {lede}
        </p>
      )}
    </div>
  );
}

function SketchFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 blueprint-grid p-5 overflow-hidden">
      <span className="absolute top-3 right-4 font-sketch text-sm text-blue-500/70 dark:text-sky-400/70 rotate-2">
        {label}
      </span>
      <div className="w-full">{children}</div>
    </div>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "green" | "amber" | "red" | "blue" | "slate";
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    green:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
    amber:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
    red: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30",
    blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/30",
    slate:
      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/30",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* Maps a Big-O string to a badge tone, used all over the cheat sheets */
function complexityTone(v: string): "green" | "amber" | "red" | "blue" | "slate" {
  if (v.includes("1")) return "green";
  if (v.includes("log")) return "blue";
  if (v.includes("n^2") || v.includes("n\u00b2")) return "red";
  if (v.includes("2^n") || v.includes("n!")) return "red";
  return "amber";
}

/* ================================ DIAGRAMS ================================ */
/* All diagrams use currentColor + a couple of accent classes so they inherit
   light/dark automatically. Slight rotations + round line caps give them the
   "sketched on a notebook page" feel the page is going for. */

const inkClass = "text-slate-700 dark:text-slate-300";
const accentClass = "text-blue-600 dark:text-sky-400";
const accent2Class = "text-amber-500 dark:text-amber-400";

function ArrayDiagram() {
  const values = [4, 17, 8, 42, 15];
  return (
    <svg viewBox="0 0 420 140" className="w-full h-auto">
      <text x="10" y="24" className={`font-sketch text-[15px] ${inkClass}`} fill="currentColor">
        arr[] — contiguous memory, O(1) random access
      </text>
      {values.map((v, i) => (
        <g key={i} transform={`translate(${20 + i * 76} 40) rotate(${i % 2 ? -1 : 1})`}>
          <rect
            width="64"
            height="64"
            rx="6"
            className={accentClass}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <text x="32" y="38" textAnchor="middle" className={`font-mono text-sm ${inkClass}`} fill="currentColor">
            {v}
          </text>
          <text x="32" y="82" textAnchor="middle" className={`font-sketch text-xs ${accent2Class}`} fill="currentColor">
            [{i}]
          </text>
        </g>
      ))}
      <path
        d="M20 128 h380"
        className={accent2Class}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        markerEnd="url(#arrow)"
      />
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className={accent2Class} fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}

function LinkedListDiagram() {
  const nodes = ["A", "B", "C", "D"];
  return (
    <svg viewBox="0 0 460 140" className="w-full h-auto">
      <text x="10" y="24" className={`font-sketch text-[15px] ${inkClass}`} fill="currentColor">
        linked list — scattered nodes, O(1) insert, O(n) search
      </text>
      {nodes.map((n, i) => (
        <g key={n}>
          <g transform={`translate(${20 + i * 110} 45)`}>
            <rect width="78" height="50" rx="8" className={accentClass} fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="52" y1="0" x2="52" y2="50" className={accentClass} stroke="currentColor" strokeWidth="1.5" />
            <text x="26" y="30" textAnchor="middle" className={`font-mono text-sm ${inkClass}`} fill="currentColor">
              {n}
            </text>
            <text x="65" y="30" textAnchor="middle" className={`font-mono text-xs ${accent2Class}`} fill="currentColor">
              •
            </text>
          </g>
          {i < nodes.length - 1 && (
            <path
              d={`M${20 + i * 110 + 78} 70 L${20 + (i + 1) * 110} 70`}
              className={accent2Class}
              stroke="currentColor"
              strokeWidth="2"
              markerEnd="url(#arrow2)"
            />
          )}
        </g>
      ))}
      <text x="20 + 4*110" y="70" className="hidden" />
      <text x={20 + 4 * 110 - 20} y="76" className={`font-mono text-xs ${inkClass}`} fill="currentColor">
        null
      </text>
      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className={accent2Class} fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}

function StackQueueDiagram() {
  return (
    <svg viewBox="0 0 460 170" className="w-full h-auto">
      {/* Stack */}
      <text x="10" y="20" className={`font-sketch text-[15px] ${inkClass}`} fill="currentColor">
        stack — LIFO
      </text>
      {["top: C", "B", "A"].map((v, i) => (
        <rect
          key={v}
          x="20"
          y={30 + i * 34}
          width="120"
          height="30"
          rx="4"
          className={i === 0 ? accent2Class : accentClass}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
      ))}
      {["C", "B", "A"].map((v, i) => (
        <text key={v} x="80" y={50 + i * 34} textAnchor="middle" className={`font-mono text-xs ${inkClass}`} fill="currentColor">
          {v}
        </text>
      ))}
      <text x="80" y="140" textAnchor="middle" className={`font-sketch text-xs ${accent2Class}`} fill="currentColor">
        push / pop ↕
      </text>

      {/* Queue */}
      <text x="230" y="20" className={`font-sketch text-[15px] ${inkClass}`} fill="currentColor">
        queue — FIFO
      </text>
      {["A", "B", "C"].map((v, i) => (
        <rect
          key={v}
          x={230 + i * 60}
          y="40"
          width="52"
          height="52"
          rx="6"
          className={accentClass}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
      ))}
      {["A", "B", "C"].map((v, i) => (
        <text
          key={v}
          x={230 + i * 60 + 26}
          y="70"
          textAnchor="middle"
          className={`font-mono text-xs ${inkClass}`}
          fill="currentColor"
        >
          {v}
        </text>
      ))}
      <path d="M225 66 L205 66" className={accent2Class} stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowQ)" />
      <path d="M406 66 L426 66" className={accent2Class} stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowQ)" />
      <text x="190" y="95" className={`font-sketch text-xs ${accent2Class}`} fill="currentColor">
        dequeue
      </text>
      <text x="390" y="95" className={`font-sketch text-xs ${accent2Class}`} fill="currentColor">
        enqueue
      </text>
      <defs>
        <marker id="arrowQ" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className={accent2Class} fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}

function TreeDiagram() {
  const edges: [number, number, number, number][] = [
    [210, 30, 110, 90],
    [210, 30, 310, 90],
    [110, 90, 60, 150],
    [110, 90, 160, 150],
    [310, 90, 260, 150],
    [310, 90, 360, 150],
  ];
  const nodes: [number, number, number][] = [
    [210, 30, 8],
    [110, 90, 4],
    [310, 90, 12],
    [60, 150, 2],
    [160, 150, 6],
    [260, 150, 10],
    [360, 150, 14],
  ];
  return (
    <svg viewBox="0 0 420 190" className="w-full h-auto">
      <text x="10" y="18" className={`font-sketch text-[15px] ${inkClass}`} fill="currentColor">
        binary search tree — O(log n) search on a balanced tree
      </text>
      {edges.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1 + 12} x2={x2} y2={y2 - 12} className={accentClass} stroke="currentColor" strokeWidth="2" />
      ))}
      {nodes.map(([x, y, v], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="16" className={i === 0 ? accent2Class : accentClass} fill="none" stroke="currentColor" strokeWidth="2.4" />
          <text x={x} y={y + 5} textAnchor="middle" className={`font-mono text-xs ${inkClass}`} fill="currentColor">
            {v}
          </text>
        </g>
      ))}
    </svg>
  );
}

function GraphDiagram() {
  const pos: Record<string, [number, number]> = {
    A: [60, 40],
    B: [200, 30],
    C: [340, 60],
    D: [110, 130],
    E: [260, 150],
  };
  const edges: [string, string][] = [
    ["A", "B"],
    ["B", "C"],
    ["A", "D"],
    ["D", "E"],
    ["B", "E"],
    ["C", "E"],
  ];
  return (
    <svg viewBox="0 0 400 180" className="w-full h-auto">
      <text x="10" y="18" className={`font-sketch text-[15px] ${inkClass}`} fill="currentColor">
        graph — nodes + edges, traversed with BFS / DFS
      </text>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={pos[a][0]}
          y1={pos[a][1]}
          x2={pos[b][0]}
          y2={pos[b][1]}
          className={accentClass}
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={i % 2 ? "0" : "5 3"}
        />
      ))}
      {Object.entries(pos).map(([k, [x, y]]) => (
        <g key={k}>
          <circle cx={x} cy={y} r="15" className={k === "A" ? accent2Class : accentClass} fill="none" stroke="currentColor" strokeWidth="2.4" />
          <text x={x} y={y + 4} textAnchor="middle" className={`font-mono text-xs ${inkClass}`} fill="currentColor">
            {k}
          </text>
        </g>
      ))}
    </svg>
  );
}

function HashTableDiagram() {
  const buckets = [
    { k: "0", v: null as string | null },
    { k: "1", v: "\u201ccat\u201d" },
    { k: "2", v: null },
    { k: "3", v: "\u201cbat\u201d \u2192 \u201cmat\u201d" },
    { k: "4", v: null },
  ];
  return (
    <svg viewBox="0 0 440 170" className="w-full h-auto">
      <text x="10" y="18" className={`font-sketch text-[15px] ${inkClass}`} fill="currentColor">
        hash table — average O(1) lookup via hash(key) → bucket
      </text>
      <rect x="20" y="30" width="60" height="34" rx="4" className={accent2Class} fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="50" y="52" textAnchor="middle" className={`font-mono text-xs ${inkClass}`} fill="currentColor">
        "bat"
      </text>
      <path d="M50 66 L50 90" className={accent2Class} stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrowH)" />
      <text x="60" y="82" className={`font-mono text-[10px] ${accent2Class}`} fill="currentColor">
        hash()
      </text>
      {buckets.map((b, i) => {
        const yTop = 98;
        const rowH = 14;
        const y = yTop + i * rowH;
        return (
          <g key={"row2-" + i}>
            <rect x="20" y={y} width="30" height={rowH} className={accentClass} fill="none" stroke="currentColor" strokeWidth="1.6" />
            <text x="35" y={y + 10} textAnchor="middle" className={`font-mono text-[10px] ${inkClass}`} fill="currentColor">
              {b.k}
            </text>
            {b.v && (
              <>
                <line x1="50" y1={y + 7} x2="70" y2={y + 7} className={accent2Class} stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowH)" />
                <text x="75" y={y + 10} className={`font-mono text-[10px] ${inkClass}`} fill="currentColor">
                  {b.v}
                </text>
              </>
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arrowH" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" className={accent2Class} fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}

function RecursionDiagram() {
  const calls = [
    { label: "fib(4)", x: 190, y: 20 },
    { label: "fib(3)", x: 110, y: 70 },
    { label: "fib(2)", x: 270, y: 70 },
    { label: "fib(2)", x: 60, y: 120 },
    { label: "fib(1)", x: 160, y: 120 },
    { label: "fib(1)", x: 230, y: 120 },
    { label: "fib(0)", x: 310, y: 120 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
  ];
  return (
    <svg viewBox="0 0 380 160" className="w-full h-auto">
      <text x="10" y="14" className={`font-sketch text-[15px] ${inkClass}`} fill="currentColor">
        recursion tree — fib(4), each call branches until base case
      </text>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={calls[a].x}
          y1={calls[a].y + 10}
          x2={calls[b].x}
          y2={calls[b].y - 8}
          className={accentClass}
          stroke="currentColor"
          strokeWidth="1.8"
        />
      ))}
      {calls.map((c, i) => (
        <g key={i}>
          <rect
            x={c.x - 26}
            y={c.y - 10}
            width="52"
            height="20"
            rx="10"
            className={i >= 3 ? accent2Class : accentClass}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <text x={c.x} y={c.y + 4} textAnchor="middle" className={`font-mono text-[9px] ${inkClass}`} fill="currentColor">
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function BigOChart() {
  // Approximate hand-plotted curves across a shared 0..300 canvas.
  const curves: { d: string; label: string; cls: string; dash?: string }[] = [
    { d: "M20,150 L300,150", label: "O(1)", cls: "text-emerald-500 dark:text-emerald-400" },
    { d: "M20,150 C 80,140 160,110 300,80", label: "O(log n)", cls: "text-blue-500 dark:text-sky-400" },
    { d: "M20,150 L300,40", label: "O(n)", cls: "text-slate-600 dark:text-slate-300" },
    { d: "M20,150 C 120,140 220,60 300,10", label: "O(n log n)", cls: "text-amber-500 dark:text-amber-400" },
    { d: "M20,150 C 120,150 220,40 300,-40", label: "O(n\u00b2)", cls: "text-rose-500 dark:text-rose-400" },
  ];
  return (
    <svg viewBox="-10 -50 340 220" className="w-full h-auto overflow-visible">
      <line x1="20" y1="150" x2="300" y2="150" className={inkClass} stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="150" x2="20" y2="0" className={inkClass} stroke="currentColor" strokeWidth="1.5" />
      <text x="290" y="168" className={`font-mono text-[10px] ${inkClass}`} fill="currentColor">
        n \u2192
      </text>
      <text x="-8" y="0" className={`font-mono text-[10px] ${inkClass}`} fill="currentColor">
        ops
      </text>
      {curves.map((c, i) => (
        <g key={i}>
          <path d={c.d} className={c.cls} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      ))}
      {curves.map((c, i) => (
        <text key={"lbl" + i} x={230} y={i === 4 ? -30 : 20 + i * 14} className={`font-mono text-[10px] ${c.cls}`} fill="currentColor">
          {c.label}
        </text>
      ))}
    </svg>
  );
}

/* ================================== DATA =================================== */

const concepts: {
  name: string;
  what: string;
  ops: string;
  diagram: React.ComponentType;
}[] = [
  {
    name: "Array",
    what: "A fixed block of contiguous memory. Every element sits at a predictable offset, so the computer can jump straight to index i without walking through the others.",
    ops: "Access O(1) · Search O(n) · Insert/Delete O(n)",
    diagram: ArrayDiagram,
  },
  {
    name: "Linked List",
    what: "A chain of nodes scattered in memory, each pointing to the next. Trades random access for cheap insertion — no shifting elements around.",
    ops: "Access O(n) · Search O(n) · Insert/Delete at head O(1)",
    diagram: LinkedListDiagram,
  },
  {
    name: "Stack & Queue",
    what: "Two disciplined ways to add and remove items. A stack only opens at the top (LIFO); a queue only opens at both ends (FIFO). Both restrict access on purpose — that restriction is the feature.",
    ops: "Push/Pop/Enqueue/Dequeue O(1)",
    diagram: StackQueueDiagram,
  },
  {
    name: "Tree",
    what: "A hierarchy where each node has at most a fixed number of children. A balanced binary search tree keeps values sorted so search, insert, and delete all stay logarithmic.",
    ops: "Search/Insert/Delete O(log n) balanced, O(n) worst case",
    diagram: TreeDiagram,
  },
  {
    name: "Graph",
    what: "Nodes connected by edges with no strict hierarchy — maps, social networks, dependency chains. Explored with BFS (level by level) or DFS (as deep as possible, then backtrack).",
    ops: "BFS/DFS O(V + E)",
    diagram: GraphDiagram,
  },
  {
    name: "Hash Table",
    what: "A function turns a key into a bucket index, so lookups skip straight to (roughly) the right spot. The classic trade of a bit of memory for near-constant time access.",
    ops: "Average O(1), worst case O(n) on collisions",
    diagram: HashTableDiagram,
  },
  {
    name: "Recursion",
    what: "A function that calls a smaller version of itself until it hits a base case. Every recursive call is really a tree of subproblems — drawing that tree is the fastest way to understand it.",
    ops: "Complexity = branches^depth, unless memoized",
    diagram: RecursionDiagram,
  },
];

const techStacks: { name: string; note: string; good: string[] }[] = [
  {
    name: "C++",
    note: "The default for competitive programming — the STL ships ready-made heaps, trees, and hash maps, and it's fast enough that you're rarely fighting the language.",
    good: ["Competitive programming", "Low-level control", "Fastest raw execution"],
  },
  {
    name: "Java",
    note: "Verbose but predictable, with a mature collections framework. Still the most common language in DSA-heavy interview loops at large companies.",
    good: ["Interview prep", "Enterprise systems", "Strong typing safety net"],
  },
  {
    name: "Python",
    note: "Reads closest to pseudocode, so the algorithm — not the syntax — stays the focus while you're learning. Slower at runtime, which matters less while you're still learning the ideas.",
    good: ["Learning & prototyping", "Interviews that allow any language", "Data science pipelines"],
  },
  {
    name: "JavaScript / TypeScript",
    note: "Worth learning DSA in if that's your day job — no context switching between 'how I think' and 'what I ship'. TypeScript's types catch a surprising number of off-by-one bugs.",
    good: ["Web developers", "Full-stack interviews", "Frontend-heavy roles"],
  },
  {
    name: "Go / Rust",
    note: "Not the usual first choice for learning, but where DSA fundamentals (memory layout, pointers, ownership) stop being abstract and start being requirements.",
    good: ["Systems programming", "Performance-critical services", "Understanding memory deeply"],
  },
];

const cheatSheetDS: { name: string; access: string; search: string; insert: string; del: string; space: string }[] = [
  { name: "Array", access: "O(1)", search: "O(n)", insert: "O(n)", del: "O(n)", space: "O(n)" },
  { name: "Linked List", access: "O(n)", search: "O(n)", insert: "O(1)", del: "O(1)", space: "O(n)" },
  { name: "Stack / Queue", access: "O(n)", search: "O(n)", insert: "O(1)", del: "O(1)", space: "O(n)" },
  { name: "Hash Table", access: "O(1)*", search: "O(1)*", insert: "O(1)*", del: "O(1)*", space: "O(n)" },
  { name: "BST (balanced)", access: "O(log n)", search: "O(log n)", insert: "O(log n)", del: "O(log n)", space: "O(n)" },
  { name: "Heap", access: "O(1) min/max", search: "O(n)", insert: "O(log n)", del: "O(log n)", space: "O(n)" },
  { name: "Graph (adj. list)", access: "\u2014", search: "O(V+E)", insert: "O(1)", del: "O(V+E)", space: "O(V+E)" },
];

const cheatSheetSort: { name: string; best: string; avg: string; worst: string; space: string; stable: string }[] = [
  { name: "Bubble Sort", best: "O(n)", avg: "O(n^2)", worst: "O(n^2)", space: "O(1)", stable: "Yes" },
  { name: "Insertion Sort", best: "O(n)", avg: "O(n^2)", worst: "O(n^2)", space: "O(1)", stable: "Yes" },
  { name: "Selection Sort", best: "O(n^2)", avg: "O(n^2)", worst: "O(n^2)", space: "O(1)", stable: "No" },
  { name: "Merge Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: "Yes" },
  { name: "Quick Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n^2)", space: "O(log n)", stable: "No" },
  { name: "Heap Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: "No" },
  { name: "Counting Sort", best: "O(n+k)", avg: "O(n+k)", worst: "O(n+k)", space: "O(k)", stable: "Yes" },
];

const aiSteps: { title: string; body: string }[] = [
  {
    title: "1. Ask for the plain-language version first",
    body: "Before touching code, ask an AI tutor to explain the concept the way you'd explain it to a friend with no CS background. If you can't follow the analogy, that's useful signal — ask it to try a different one.",
  },
  {
    title: "2. Solve it yourself, badly, first",
    body: "Attempt the problem with pen and paper or a whiteboard before asking for help. A wrong attempt teaches you more about where your understanding breaks than a correct AI-written solution ever will.",
  },
  {
    title: "3. Ask AI to review, not to solve",
    body: "Paste your own attempt and ask specifically: 'what's the time complexity of this, and where does it break?' Reviewing is a different (and more durable) skill than reading a finished answer.",
  },
  {
    title: "4. Request a diagram or trace, not just text",
    body: "Ask for a step-by-step trace of your algorithm on a small input, or a sketch of the data structure at each step. Visualizing state changes is what actually cements how an algorithm behaves.",
  },
  {
    title: "5. Explain it back (the Feynman loop)",
    body: "Summarize what you just learned in your own words, out loud or in writing, then ask the AI to point out anything you got wrong or oversimplified. If you can't explain it, you don't know it yet.",
  },
  {
    title: "6. Generate variations, not repeats",
    body: "Once a pattern clicks, ask for three problems that use the same underlying pattern (say, sliding window) but look nothing alike on the surface. Pattern recognition — not memorized problems — is the actual interview skill.",
  },
];

const tips: string[] = [
  "Complexity first, code second — before writing a line, say out loud what time and space complexity you're aiming for.",
  "Always check the edges: empty input, one element, all duplicates, negative numbers, already-sorted input.",
  "Learn patterns, not problems: two pointers, sliding window, fast/slow pointers, binary search on answer, backtracking, DP on subsequences.",
  "Dry-run on paper before you trust the code — most bugs are logic errors a trace would have caught in seconds.",
  "Recursion always has two parts: the base case that stops it, and the recursive case that shrinks the problem toward that base case.",
  "Time vs space is a trade you're making, not a fact about the universe — a hash map often buys O(1) lookups at the cost of O(n) extra memory.",
  "Consistency beats cramming — 45 focused minutes a day compounds further than a single six-hour weekend binge.",
  "Say your plan out loud in interviews before coding it — most interviewers are grading your reasoning, not just your syntax.",
];

const interviewQuestions: { q: string; hint: string; pattern: string }[] = [
  {
    q: "Every number in an array appears twice except one. Find it in O(n) time and O(1) space.",
    hint: "XOR a number with itself and you get 0; XOR anything with 0 and you get the number back. XOR the whole array together.",
    pattern: "Bit manipulation",
  },
  {
    q: "Given the head of a linked list, determine if it contains a cycle — without extra memory.",
    hint: "Two pointers, one moving twice as fast as the other. If there's a loop, the fast one eventually laps the slow one.",
    pattern: "Fast & slow pointers (Floyd's algorithm)",
  },
  {
    q: "An array holds n distinct numbers from 0 to n, with exactly one missing. Find it in O(n) time, O(1) space.",
    hint: "The sum of 0..n has a closed-form formula. Subtract the actual sum of the array from it.",
    pattern: "Math / Gauss sum",
  },
  {
    q: "Reverse a linked list in groups of k, and handle a final group shorter than k.",
    hint: "First check whether k nodes exist from the current pointer; only reverse if they do, otherwise leave the remainder untouched.",
    pattern: "Linked list manipulation",
  },
  {
    q: "Given n non-negative integers representing an elevation map, compute how much rainwater it can trap.",
    hint: "The water trapped above any bar is limited by the shorter of the tallest bar to its left and the tallest bar to its right.",
    pattern: "Two pointers / prefix-suffix max",
  },
  {
    q: "Find the median of two sorted arrays in O(log(min(m, n))) time.",
    hint: "You don't need to merge anything — binary search for a partition point that splits both arrays so the left half is entirely \u2264 the right half.",
    pattern: "Binary search on partitions",
  },
  {
    q: "Design a Least Recently Used (LRU) cache with O(1) get and put.",
    hint: "A hash map alone gives O(1) lookup but no ordering. A doubly linked list alone gives ordering but O(n) lookup. Combine them.",
    pattern: "Hash map + doubly linked list",
  },
];

/* ================================ COMPONENTS =============================== */

function ConceptCard({
  name,
  what,
  ops,
  Diagram,
}: {
  name: string;
  what: string;
  ops: string;
  Diagram: React.ComponentType;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 flex flex-col gap-4">
      <div>
        <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">{name}</h3>
        <p className="font-body text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{what}</p>
      </div>
      <SketchFrame label={name.toLowerCase()}>
        <Diagram />
      </SketchFrame>
      <div className="font-mono text-xs text-blue-700 dark:text-sky-400">{ops}</div>
    </div>
  );
}

function InterviewAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-3">
      {interviewQuestions.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-start justify-between gap-4 text-left px-5 py-4"
            >
              <div>
                <div className="font-mono text-xs text-blue-600 dark:text-sky-400 mb-1">
                  #{i + 1} &middot; {item.pattern}
                </div>
                <div className="font-body text-slate-800 dark:text-slate-200 text-sm sm:text-base">{item.q}</div>
              </div>
              <span
                className={`font-mono text-lg text-slate-400 dark:text-slate-500 shrink-0 transition-transform ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 -mt-1">
                <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-4 py-3">
                  <div className="font-mono text-[11px] uppercase tracking-wide text-amber-700 dark:text-amber-400 mb-1">
                    Hint
                  </div>
                  <p className="font-body text-sm text-slate-700 dark:text-slate-300">{item.hint}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* =================================== PAGE =================================== */

export default function DSATutorialPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1220] transition-colors duration-300 font-body">
      <FontLoader />

      {/* ---------------------------------- HERO ---------------------------------- */}
      <section className="relative border-b border-slate-200 dark:border-slate-800 blueprint-grid">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <Eyebrow>Field notes on Data Structures &amp; Algorithms</Eyebrow>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-slate-100 leading-[1.08]">
              The shape of your data
              <br /> decides the speed of your code.
            </h1>
            <p className="font-body mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Data structures are the containers you choose to hold information.
              Algorithms are the steps you take to move through it. Everything on
              this page - the sketches, the cheat sheets, the puzzles - exists to
              make that one relationship click. (We are now preparing a better Complete DSA course designed for you, starting from the basics. We are coming soon with it  !!)
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Badge tone="blue">7 core structures</Badge>
              <Badge tone="green">2 cheat sheets</Badge>
              <Badge tone="amber">7 interview puzzles</Badge>
              <Badge tone="slate">Diagrammed, not just defined</Badge>
            </div>
          </div>
          <SketchFrame label="fig. 1 — array vs linked list">
            <div className="flex flex-col gap-4">
              <ArrayDiagram />
              <LinkedListDiagram />
            </div>
          </SketchFrame>
        </div>
      </section>

      {/* ------------------------------ WHAT IS DSA ------------------------------ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="01 — Definitions"
          title="What is 'Data Structures & Algorithms', really?"
          lede="Two ideas travel under one acronym, and keeping them separate in your head makes everything downstream easier."
        />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Data Structures
            </h3>
            <p className="font-body text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Ways of organizing data so certain operations become fast. An array
              is organized for random access. A linked list is organized for
              cheap insertion. A tree is organized for sorted, hierarchical
              lookup. There is no single "best" structure — only the right one
              for the operations you'll actually perform.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Algorithms
            </h3>
            <p className="font-body text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Precise, finite sequences of steps that transform an input into an
              output. Two algorithms can solve the exact same problem and differ
              by orders of magnitude in how long they take or how much memory
              they use — that difference is what Big-O notation measures.
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------- WHY IT MATTERS NOW --------------------------- */}
      <section className="bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SectionHeading
            eyebrow="02 — Why now"
            title="Why DSA matters more, not less, in the age of AI tooling"
            lede="AI can now write working code from a plain-English prompt. That raises the bar on judgment, not lowers it — you still have to know whether what it wrote will survive contact with real data."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                h: "Data keeps getting bigger",
                p: "A search that takes 10ms on 1,000 records can take minutes on 100 million. The gap between O(n) and O(log n) is invisible at small scale and catastrophic at large scale.",
              },
              {
                h: "AI-generated code still needs a reviewer",
                p: "AI tools are excellent at producing plausible-looking solutions. Whether that solution is efficient, correct on edge cases, or scalable is still a judgment only a human with DSA fundamentals can make.",
              },
              {
                h: "It's the shared language of technical interviews",
                p: "Whether or not you love it, DSA fluency remains the primary filter most tech companies use to evaluate problem-solving ability under pressure.",
              },
              {
                h: "It underlies the tools you already use",
                p: "Database indexes are trees. Autocomplete is a trie. Your route-planning app is running a graph shortest-path algorithm. DSA is not academic — it's the plumbing.",
              },
              {
                h: "Efficiency is a cost, literally",
                p: "Cloud compute is billed by the second. An O(n\u00b2) service that should have been O(n log n) is a recurring line item on someone's infrastructure bill.",
              },
              {
                h: "It's how you evaluate trade-offs, fast",
                p: "Every real engineering decision is a trade-off — memory for speed, simplicity for flexibility. DSA gives you the vocabulary to reason about those trades quickly.",
              },
            ].map((c) => (
              <div key={c.h} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
                <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100 mb-2">{c.h}</h4>
                <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ WHAT IF NOT ------------------------------ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="03 — The counterfactual"
          title="What happens without it"
          lede="Nothing dramatic happens on day one. The cost of skipping DSA shows up later, quietly, as your data grows."
        />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border-2 border-rose-200 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-500/5 p-6">
            <div className="font-mono text-xs text-rose-600 dark:text-rose-400 mb-3 uppercase tracking-wide">
              Without DSA thinking
            </div>
            <ul className="font-body text-sm text-slate-700 dark:text-slate-300 space-y-2.5 list-disc list-inside">
              <li>Search feature that's instant in a demo, unusable at 1M+ users</li>
              <li>Nested loops (O(n\u00b2)) hiding in what looked like simple code</li>
              <li>Memory leaks from data structures that never let go of references</li>
              <li>Interview rejections despite strong general programming skill</li>
              <li>Infrastructure bills that scale faster than the user base does</li>
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5 p-6">
            <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 mb-3 uppercase tracking-wide">
              With DSA thinking
            </div>
            <ul className="font-body text-sm text-slate-700 dark:text-slate-300 space-y-2.5 list-disc list-inside">
              <li>You reach for a hash set instead of an O(n) list scan by instinct</li>
              <li>You can estimate whether code will survive 100x the current load</li>
              <li>Debugging gets faster — you already suspect where the bottleneck is</li>
              <li>You can read and critique an AI-generated solution, not just accept it</li>
              <li>You have a shared vocabulary with every engineer you'll work with</li>
            </ul>
          </div>
        </div>
      </section>

      {/* -------------------------- HOW TO LEARN WITH AI -------------------------- */}
      <section className="bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SectionHeading
            eyebrow="04 — Method"
            title="How to learn DSA with an AI tutor, without shortcutting the learning"
            lede="AI is an excellent tutor and a dangerous crutch, often in the same conversation. The difference is entirely in how you use it."
          />
          <div className="grid md:grid-cols-2 gap-5">
            {aiSteps.map((s) => (
              <div key={s.title} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100 mb-2">{s.title}</h4>
                <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------- TECH STACKS --------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="05 — Tooling"
          title="Languages & tools worth knowing"
          lede="The language matters far less than the thinking, but it does matter. Here's a fair read on the common choices."
        />
        <div className="grid md:grid-cols-2 gap-5">
          {techStacks.map((t) => (
            <div key={t.name} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <h4 className="font-display font-semibold text-lg text-slate-900 dark:text-slate-100 mb-1">{t.name}</h4>
              <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{t.note}</p>
              <div className="flex flex-wrap gap-2">
                {t.good.map((g) => (
                  <Badge key={g} tone="blue">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-5">
          <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100 mb-2">Practice &amp; visualization tools</h4>
          <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            LeetCode and HackerRank for timed practice · Codeforces for
            competitive-programming pace · VisuAlgo for animated data structure
            visualizations · Excalidraw or a plain notebook for sketching trees
            and graphs by hand · a spaced-repetition tracker (even a spreadsheet)
            for revisiting patterns you've already "learned."
          </p>
        </div>
      </section>

      {/* ------------------------------ CORE CONCEPTS ------------------------------ */}
      <section className="bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SectionHeading
            eyebrow="06 — The structures"
            title="Core concepts, sketched"
            lede="Reading a definition of a linked list and seeing one drawn are two different levels of understanding. Every structure below gets both."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {concepts.map((c) => (
              <ConceptCard key={c.name} name={c.name} what={c.what} ops={c.ops} Diagram={c.diagram} />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- BIG-O CHART -------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="07 — Complexity, visually"
          title="What Big-O actually looks like"
          lede="This is the single chart worth memorizing. Everything else in complexity analysis is a variation on these five curves."
        />
        <SketchFrame label="fig. 9 — growth rates as n increases">
          <BigOChart />
        </SketchFrame>
      </section>

      {/* -------------------------------- CHEAT SHEETS -------------------------------- */}
      <section className="bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SectionHeading
            eyebrow="08 — Reference"
            title="Cheat sheets"
            lede="The two tables every DSA learner ends up printing out or pinning to a monitor eventually. Here they are early."
          />

          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Data structure operations
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 mb-12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-4 py-3">
                    Structure
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-4 py-3">Access</th>
                  <th className="text-left font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-4 py-3">Search</th>
                  <th className="text-left font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-4 py-3">Insert</th>
                  <th className="text-left font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-4 py-3">Delete</th>
                  <th className="text-left font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-4 py-3">Space</th>
                </tr>
              </thead>
              <tbody>
                {cheatSheetDS.map((row, i) => (
                  <tr
                    key={row.name}
                    className={`${i % 2 ? "bg-white dark:bg-slate-900" : "bg-slate-50/60 dark:bg-slate-900/50"} border-b border-slate-100 dark:border-slate-800/60 last:border-0`}
                  >
                    <td className="px-4 py-3 font-body font-medium text-slate-800 dark:text-slate-200">{row.name}</td>
                    <td className="px-4 py-3">
                      <Badge tone={complexityTone(row.access)}>{row.access}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={complexityTone(row.search)}>{row.search}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={complexityTone(row.insert)}>{row.insert}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={complexityTone(row.del)}>{row.del}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={complexityTone(row.space)}>{row.space}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2 text-xs font-mono text-slate-400 dark:text-slate-500">
              * average case; degrades under heavy hash collisions
            </div>
          </div>

          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Sorting algorithms</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-4 py-3">
                    Algorithm
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-4 py-3">Best</th>
                  <th className="text-left font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-4 py-3">Average</th>
                  <th className="text-left font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-4 py-3">Worst</th>
                  <th className="text-left font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-4 py-3">Space</th>
                  <th className="text-left font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 px-4 py-3">Stable</th>
                </tr>
              </thead>
              <tbody>
                {cheatSheetSort.map((row, i) => (
                  <tr
                    key={row.name}
                    className={`${i % 2 ? "bg-white dark:bg-slate-900" : "bg-slate-50/60 dark:bg-slate-900/50"} border-b border-slate-100 dark:border-slate-800/60 last:border-0`}
                  >
                    <td className="px-4 py-3 font-body font-medium text-slate-800 dark:text-slate-200">{row.name}</td>
                    <td className="px-4 py-3">
                      <Badge tone={complexityTone(row.best)}>{row.best}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={complexityTone(row.avg)}>{row.avg}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={complexityTone(row.worst)}>{row.worst}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={complexityTone(row.space)}>{row.space}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={row.stable === "Yes" ? "green" : "slate"}>{row.stable}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ----------------------------- THINGS TO REMEMBER ----------------------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <SectionHeading
          eyebrow="09 — Before you go further"
          title="Important things to keep in mind"
          lede="Small habits that separate people who've memorized solutions from people who can actually solve a new problem under pressure."
        />
        <div className="grid sm:grid-cols-2 gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <span className="font-mono text-xs text-blue-600 dark:text-sky-400 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-body text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------- INTERVIEW PUZZLES ----------------------------- */}
      <section className="bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SectionHeading
            eyebrow="10 — Practice"
            title="Puzzled? Try these interview questions"
            lede="Classic problems, chosen because each one teaches a reusable pattern rather than a one-off trick. Try to solve before revealing the hint."
          />
          <InterviewAccordion />
        </div>
      </section>

      {/* ---------------------------------- FOOTER ---------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
          <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            The fastest way to learn a data structure is to draw it.
          </h3>
          <p className="font-body text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Next time a problem stalls, stop typing and sketch the state of the
            data at each step. Most "hard" DSA problems turn out to be an easy
            problem wearing an unfamiliar diagram.
          </p>
        </div>
      </section>
    </div>
  );
}