"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Rows3,
  Link2,
  Layers,
  ArrowLeftRight,
  GitBranch,
  ArrowUpDown,
  Search as SearchIcon,
  Plus,
  Trash2,
  Shuffle,
  Gauge,
  RotateCcw,
  Eye,
  Info,
  Ruler,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

// ============================================================
// Types
// ============================================================

type Topic = "arrays" | "linked-list" | "stack" | "queue" | "bst" | "sorting";
type Speed = "slow" | "normal" | "fast";
type NodeValue = number;

interface ListNode {
  id: string;
  value: NodeValue;
  next: ListNode | null;
}

interface BSTNode {
  id: string;
  value: NodeValue;
  left: BSTNode | null;
  right: BSTNode | null;
}

// ============================================================
// Shared helpers, tokens & small building blocks
// ============================================================

const genId = () => Math.random().toString(36).slice(2, 10);

const SPEED_MS: Record<Speed, number> = { slow: 650, normal: 350, fast: 130 };

const panel =
  "rounded-xl border border-[var(--dsa-border)] bg-[var(--dsa-panel)] p-4 sm:p-6";
const input =
  "w-full sm:w-40 px-3 py-2 rounded-md bg-[var(--dsa-bg)] border border-[var(--dsa-border)] text-[var(--dsa-text)] placeholder:text-[var(--dsa-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--dsa-accent)]/40 text-sm";
const btn =
  "px-3 py-2 rounded-md border border-[var(--dsa-border)] bg-[var(--dsa-chip)] text-[var(--dsa-text)] text-xs sm:text-sm font-medium hover:border-[var(--dsa-accent)]/60 hover:text-[var(--dsa-accent)] transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--dsa-border)] disabled:hover:text-[var(--dsa-text)]";
const btnAccent =
  "px-3 py-2 rounded-md bg-[var(--dsa-accent)] text-[var(--dsa-accent-ink)] text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed";
const box =
  "flex items-center justify-center rounded-md border font-mono text-xs sm:text-sm font-semibold transition-colors duration-300 shrink-0";
const boxDefault = "bg-[var(--dsa-chip)] border-[var(--dsa-border)] text-[var(--dsa-text)]";
const boxActive = "bg-[var(--dsa-accent)] border-[var(--dsa-accent)] text-[var(--dsa-accent-ink)]";
const boxSuccess = "bg-[var(--dsa-success)] border-[var(--dsa-success)] text-[var(--dsa-success-ink)]";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

function SectionMessage({ text, tone }: { text: string; tone?: "accent" | "success" }) {
  if (!text) return null;
  const toneClass =
    tone === "success"
      ? "text-[var(--dsa-success)] border-[var(--dsa-success)]/30 bg-[var(--dsa-success)]/10"
      : "text-[var(--dsa-accent)] border-[var(--dsa-accent)]/30 bg-[var(--dsa-accent)]/10";
  return (
    <div className={`mt-4 text-xs sm:text-sm font-mono px-3 py-2 rounded-md border ${toneClass}`}>
      {text}
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="px-2.5 py-1 rounded-md bg-[var(--dsa-chip)] border border-[var(--dsa-border)] text-[11px] sm:text-xs font-mono text-[var(--dsa-muted)] whitespace-nowrap">
      <span className="text-[var(--dsa-text)] font-semibold">{value}</span> {label}
    </div>
  );
}

function ComplexityBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-1.5 py-0.5 rounded bg-[var(--dsa-accent)]/10 text-[var(--dsa-accent)] font-mono text-[10px] sm:text-[11px] font-semibold">
      {children}
    </span>
  );
}

// ============================================================
// Complexity reference data (used by the side info panel)
// ============================================================

const COMPLEXITY: Record<
  Topic,
  { blurb: string; ops: { name: string; time: string; space: string }[] }
> = {
  arrays: {
    blurb:
      "A contiguous block of memory holding elements at fixed-size slots, indexed from 0.",
    ops: [
      { name: "Access by index", time: "O(1)", space: "O(1)" },
      { name: "Linear search", time: "O(n)", space: "O(1)" },
      { name: "Binary search (sorted)", time: "O(log n)", space: "O(1)" },
      { name: "Insert / delete (end)", time: "O(1)", space: "O(1)" },
      { name: "Insert / delete (middle)", time: "O(n)", space: "O(1)" },
    ],
  },
  "linked-list": {
    blurb:
      "Nodes scattered in memory, each pointing to the next. No random access, but cheap inserts at the head.",
    ops: [
      { name: "Insert at head", time: "O(1)", space: "O(1)" },
      { name: "Insert at tail", time: "O(n)", space: "O(1)" },
      { name: "Delete by value", time: "O(n)", space: "O(1)" },
      { name: "Traverse / search", time: "O(n)", space: "O(1)" },
      { name: "Reverse", time: "O(n)", space: "O(1)" },
    ],
  },
  stack: {
    blurb: "LIFO - Last In, First Out. Think of a stack of plates.",
    ops: [
      { name: "Push", time: "O(1)", space: "O(1)" },
      { name: "Pop", time: "O(1)", space: "O(1)" },
      { name: "Peek", time: "O(1)", space: "O(1)" },
    ],
  },
  queue: {
    blurb: "FIFO - First In, First Out. Think of a checkout line.",
    ops: [
      { name: "Enqueue", time: "O(1)", space: "O(1)" },
      { name: "Dequeue", time: "O(1)*", space: "O(1)" },
      { name: "Peek front", time: "O(1)", space: "O(1)" },
    ],
  },
  bst: {
    blurb:
      "Each node's left subtree holds smaller values, right subtree holds larger. Balanced trees keep operations logarithmic.",
    ops: [
      { name: "Insert", time: "O(log n) avg · O(n) worst", space: "O(1)" },
      { name: "Search", time: "O(log n) avg · O(n) worst", space: "O(1)" },
      { name: "Delete", time: "O(log n) avg · O(n) worst", space: "O(1)" },
      { name: "Min / Max", time: "O(log n) avg · O(n) worst", space: "O(1)" },
      { name: "Inorder traversal", time: "O(n)", space: "O(h)" },
    ],
  },
  sorting: {
    blurb: "Comparison-based sorts rearrange an array in place, swapping out-of-order pairs.",
    ops: [
      { name: "Bubble sort", time: "O(n²)", space: "O(1)" },
      { name: "Selection sort", time: "O(n²)", space: "O(1)" },
      { name: "Insertion sort", time: "O(n²) worst · O(n) best", space: "O(1)" },
    ],
  },
};

const TOPICS: { id: Topic; label: string; icon: React.ReactNode }[] = [
  { id: "arrays", label: "Arrays", icon: <Rows3 className="w-4 h-4" /> },
  { id: "linked-list", label: "Linked List", icon: <Link2 className="w-4 h-4" /> },
  { id: "stack", label: "Stack", icon: <Layers className="w-4 h-4" /> },
  { id: "queue", label: "Queue", icon: <ArrowLeftRight className="w-4 h-4" /> },
  { id: "bst", label: "Binary Search Tree", icon: <GitBranch className="w-4 h-4" /> },
  { id: "sorting", label: "Sorting", icon: <ArrowUpDown className="w-4 h-4" /> },
];

// ============================================================
// Main Page Component
// ============================================================

export default function DSAVisualizerPage() {
  const [activeTopic, setActiveTopic] = useState<Topic>("arrays");
  const [speed, setSpeed] = useState<Speed>("normal");
  const delay = SPEED_MS[speed];

  return (
    <div className="dsa-viz min-h-screen bg-[var(--dsa-bg)] text-[var(--dsa-text)] transition-colors duration-300">
      <style jsx global>{`
        .dsa-viz {
          --dsa-bg: #f7f8fa;
          --dsa-panel: #ffffff;
          --dsa-chip: #f1f3f6;
          --dsa-chip-hover: #e7eaf0;
          --dsa-border: #e2e5eb;
          --dsa-text: #0a0e14;
          --dsa-muted: #667085;
          --dsa-accent: #b45309;
          --dsa-accent-ink: #ffffff;
          --dsa-success: #15803d;
          --dsa-success-ink: #ffffff;
        }
        .dark .dsa-viz {
          --dsa-bg: #0a0e14;
          --dsa-panel: #0d1117;
          --dsa-chip: #141a23;
          --dsa-chip-hover: #1b222d;
          --dsa-border: #1f2733;
          --dsa-text: #e5e7eb;
          --dsa-muted: #8b949e;
          --dsa-accent: #34d399;
          --dsa-accent-ink: #052e1f;
          --dsa-success: #34d399;
          --dsa-success-ink: #052e1f;
        }
        .dsa-viz ::-webkit-scrollbar {
          height: 6px;
        }
        .dsa-viz ::-webkit-scrollbar-thumb {
          background: var(--dsa-border);
          border-radius: 999px;
        }
      `}</style>

      <TerminalHeader speed={speed} setSpeed={setSpeed} />

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <TopicTabs activeTopic={activeTopic} onChange={setActiveTopic} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 items-start">
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTopic}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={panel}
              >
                {activeTopic === "arrays" && <ArraysSection delay={delay} />}
                {activeTopic === "linked-list" && <LinkedListSection delay={delay} />}
                {activeTopic === "stack" && <StackSection />}
                {activeTopic === "queue" && <QueueSection />}
                {activeTopic === "bst" && <BSTSection delay={delay} />}
                {activeTopic === "sorting" && <SortingSection delay={delay} />}
              </motion.div>
            </AnimatePresence>
          </div>

          <ComplexityPanel topic={activeTopic} />
        </div>
      </main>
    </div>
  );
}

// ============================================================
// Terminal-chrome header + speed control
// ============================================================

function TerminalHeader({
  speed,
  setSpeed,
}: {
  speed: Speed;
  setSpeed: (s: Speed) => void;
}) {
  return (
    <header className="border-b border-[var(--dsa-border)] bg-[var(--dsa-panel)] transition-colors duration-300">
      <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 border-b border-[var(--dsa-border)]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-3 text-[11px] sm:text-xs font-mono text-[var(--dsa-muted)]">
          DSA Visualizer
        </span>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-[var(--dsa-text)] flex items-center gap-2">
            <span className="text-[var(--dsa-accent)]">$</span> DSA Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-[var(--dsa-muted)] mt-1">
            Step through core data structures &amp; algorithms, one operation at a time.
          </p>
        </div>
        <SpeedControl speed={speed} setSpeed={setSpeed} />
      </div>
    </header>
  );
}

function SpeedControl({ speed, setSpeed }: { speed: Speed; setSpeed: (s: Speed) => void }) {
  const options: Speed[] = ["slow", "normal", "fast"];
  return (
    <div className="flex items-center gap-2 self-start sm:self-auto">
      <Gauge className="w-4 h-4 text-[var(--dsa-muted)] hidden sm:block" />
      <div className="flex rounded-md border border-[var(--dsa-border)] overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setSpeed(opt)}
            className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-medium capitalize transition-colors ${
              speed === opt
                ? "bg-[var(--dsa-accent)] text-[var(--dsa-accent-ink)]"
                : "bg-[var(--dsa-chip)] text-[var(--dsa-muted)] hover:text-[var(--dsa-text)]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Topic Tabs
// ============================================================

function TopicTabs({
  activeTopic,
  onChange,
}: {
  activeTopic: Topic;
  onChange: (t: Topic) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {TOPICS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-3 sm:px-4 py-2 rounded-md border transition-colors whitespace-nowrap inline-flex items-center gap-2 text-xs sm:text-sm font-medium shrink-0
            ${
              activeTopic === t.id
                ? "bg-[var(--dsa-accent)] border-[var(--dsa-accent)] text-[var(--dsa-accent-ink)]"
                : "bg-[var(--dsa-panel)] border-[var(--dsa-border)] text-[var(--dsa-muted)] hover:text-[var(--dsa-text)] hover:border-[var(--dsa-accent)]/50"
            }`}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// Complexity reference side panel
// ============================================================

function ComplexityPanel({ topic }: { topic: Topic }) {
  const data = COMPLEXITY[topic];
  return (
    <div className={`${panel} lg:sticky lg:top-6`}>
      <div className="flex items-center gap-2 text-[var(--dsa-text)] font-semibold text-sm mb-2">
        <Info className="w-4 h-4 text-[var(--dsa-accent)]" />
        Cheat sheet
      </div>
      <p className="text-xs text-[var(--dsa-muted)] leading-relaxed mb-4">{data.blurb}</p>
      <div className="space-y-2">
        {data.ops.map((op) => (
          <div
            key={op.name}
            className="flex items-center justify-between gap-2 text-xs border-b border-[var(--dsa-border)] pb-2 last:border-0 last:pb-0"
          >
            <span className="text-[var(--dsa-muted)]">{op.name}</span>
            <span className="font-mono text-[var(--dsa-accent)] font-semibold text-right shrink-0">
              {op.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Arrays Section
// ============================================================

function ArraysSection({ delay }: { delay: number }) {
  const [arr, setArr] = useState<NodeValue[]>([5, 3, 8, 1, 9, 2]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [insertValue, setInsertValue] = useState<string>("");
  const [insertIndex, setInsertIndex] = useState<string>("");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [comparisons, setComparisons] = useState<number>(0);
  const [busy, setBusy] = useState(false);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const linearSearch = async () => {
    const target = Number(searchValue);
    if (!searchValue || isNaN(target)) return setMessage("Enter a valid number to search.");
    setBusy(true);
    setFoundIndex(null);
    setComparisons(0);
    setMessage("Starting linear search…");
    for (let i = 0; i < arr.length; i++) {
      setHighlightIndex(i);
      setComparisons((c) => c + 1);
      await sleep(delay);
      if (arr[i] === target) {
        setMessage(`Found ${target} at index ${i} — O(n) worst case.`);
        setFoundIndex(i);
        setHighlightIndex(null);
        setBusy(false);
        return;
      }
    }
    setHighlightIndex(null);
    setMessage(`${target} not found — scanned every element (O(n)).`);
    setBusy(false);
  };

  const binarySearch = async () => {
    const target = Number(searchValue);
    if (!searchValue || isNaN(target)) return setMessage("Enter a valid number to search.");
    setBusy(true);
    setFoundIndex(null);
    setComparisons(0);
    const sorted = [...arr].sort((a, b) => a - b);
    setMessage("Sorting array first, then running binary search…");
    setArr(sorted);
    await sleep(delay);

    let left = 0;
    let right = sorted.length - 1;
    setMessage("Starting binary search…");

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      setHighlightIndex(mid);
      setComparisons((c) => c + 1);
      await sleep(delay);

      if (sorted[mid] === target) {
        setMessage(`Found ${target} at sorted index ${mid} — O(log n).`);
        setFoundIndex(mid);
        setHighlightIndex(null);
        setBusy(false);
        return;
      } else if (sorted[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    setHighlightIndex(null);
    setMessage(`${target} not found in sorted array.`);
    setBusy(false);
  };

  const insertAt = () => {
    const num = Number(insertValue);
    if (!insertValue || isNaN(num)) return setMessage("Enter a valid number to insert.");
    let idx = insertIndex === "" ? arr.length : Number(insertIndex);
    if (isNaN(idx) || idx < 0) idx = arr.length;
    idx = Math.min(idx, arr.length);
    const next = [...arr.slice(0, idx), num, ...arr.slice(idx)];
    setArr(next);
    setMessage(`Inserted ${num} at index ${idx} — shifted ${arr.length - idx} elements (O(n)).`);
    setInsertValue("");
    setFoundIndex(null);
  };

  const deleteAt = () => {
    let idx = insertIndex === "" ? arr.length - 1 : Number(insertIndex);
    if (arr.length === 0) return setMessage("Array is empty.");
    if (isNaN(idx) || idx < 0 || idx >= arr.length) return setMessage("Enter a valid index to delete.");
    const removed = arr[idx];
    setArr(arr.filter((_, i) => i !== idx));
    setMessage(`Deleted ${removed} from index ${idx}.`);
    setFoundIndex(null);
  };

  const shuffle = () => {
    const next = [...arr];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setArr(next);
    setMessage("Shuffled array.");
    setFoundIndex(null);
    setHighlightIndex(null);
  };

  const randomize = () => {
    const size = 6 + Math.floor(Math.random() * 3);
    const next = Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
    setArr(next);
    setMessage("Generated a new random array.");
    setFoundIndex(null);
    setHighlightIndex(null);
  };

  const reset = () => {
    setArr([5, 3, 8, 1, 9, 2]);
    setHighlightIndex(null);
    setFoundIndex(null);
    setComparisons(0);
    setMessage("");
  };

  return (
    <div>
      <SectionHeading title="Arrays" desc="Search, insert, delete and reshuffle a contiguous array." />

      <div className="flex flex-wrap gap-2 mb-3">
        <StatChip label="length" value={arr.length} />
        <StatChip label="comparisons" value={comparisons} />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="value to find"
          className={input}
        />
        <button onClick={linearSearch} disabled={busy} className={btn}>
          <SearchIcon className="w-3.5 h-3.5" /> Linear
        </button>
        <button onClick={binarySearch} disabled={busy} className={btn}>
          <SearchIcon className="w-3.5 h-3.5" /> Binary (sorted)
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center mt-3">
        <input
          type="text"
          value={insertValue}
          onChange={(e) => setInsertValue(e.target.value)}
          placeholder="value"
          className={input}
        />
        <input
          type="text"
          value={insertIndex}
          onChange={(e) => setInsertIndex(e.target.value)}
          placeholder="index (optional)"
          className={input}
        />
        <button onClick={insertAt} disabled={busy} className={btn}>
          <Plus className="w-3.5 h-3.5" /> Insert
        </button>
        <button onClick={deleteAt} disabled={busy} className={btn}>
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={shuffle} disabled={busy} className={btn}>
          <Shuffle className="w-3.5 h-3.5" /> Shuffle
        </button>
        <button onClick={randomize} disabled={busy} className={btn}>
          Random array
        </button>
        <button onClick={reset} disabled={busy} className={btn}>
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="mt-6 flex gap-2 flex-wrap">
        {arr.map((val, idx) => (
          <motion.div
            layout
            key={idx}
            className={`${box} w-11 h-11 sm:w-12 sm:h-12 ${
              foundIndex === idx ? boxSuccess : highlightIndex === idx ? boxActive : boxDefault
            }`}
          >
            {val}
          </motion.div>
        ))}
        {arr.length === 0 && <div className="text-sm text-[var(--dsa-muted)]">Empty array</div>}
      </div>

      <SectionMessage text={message} tone={foundIndex !== null ? "success" : undefined} />
    </div>
  );
}

// ============================================================
// Linked List Section
// ============================================================

function LinkedListSection({ delay }: { delay: number }) {
  const [head, setHead] = useState<ListNode | null>(null);
  const [value, setValue] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [traversingId, setTraversingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const length = (() => {
    let n = 0;
    let c = head;
    while (c) {
      n++;
      c = c.next;
    }
    return n;
  })();

  const insertAtHead = () => {
    const num = Number(value);
    if (!value || isNaN(num)) return setMessage("Enter a valid number.");
    setHead({ id: genId(), value: num, next: head });
    setMessage(`Inserted ${num} at head — O(1).`);
    setValue("");
  };

  const insertAtEnd = () => {
    const num = Number(value);
    if (!value || isNaN(num)) return setMessage("Enter a valid number.");
    const newNode: ListNode = { id: genId(), value: num, next: null };
    if (!head) {
      setHead(newNode);
      setMessage("Inserted node at head (list was empty).");
    } else {
      const cloneHead = cloneList(head);
      let curr: ListNode = cloneHead;
      while (curr.next) curr = curr.next;
      curr.next = newNode;
      setHead(cloneHead);
      setMessage(`Inserted ${num} at end - O(n) to reach the tail.`);
    }
    setValue("");
  };

  const deleteByValue = () => {
    const num = Number(value);
    if (!value || isNaN(num)) return setMessage("Enter a valid number to delete.");
    if (!head) return setMessage("List is empty.");
    if (head.value === num) {
      setHead(head.next);
      setMessage(`Deleted ${num} from head.`);
    } else {
      const cloneHead = cloneList(head);
      let curr: ListNode = cloneHead;
      while (curr.next && curr.next.value !== num) curr = curr.next;
      if (!curr.next) {
        setMessage(`${num} not found.`);
      } else {
        curr.next = curr.next.next;
        setHead(cloneHead);
        setMessage(`Deleted ${num}.`);
      }
    }
    setValue("");
  };

  const reverse = () => {
    if (!head) return setMessage("List is empty.");
    let prev: ListNode | null = null;
    let curr: ListNode | null = cloneList(head);
    while (curr) {
      const nextNode: ListNode | null = curr.next;
      curr.next = prev;
      prev = curr;
      curr = nextNode;
    }
    setHead(prev);
    setMessage("Reversed the list in place - O(n) time, O(1) space.");
  };

  const traverse = async () => {
    if (!head) return setMessage("List is empty.");
    setBusy(true);
    setMessage("Traversing linked list…");
    let curr: ListNode | null = head;
    const values: NodeValue[] = [];
    while (curr) {
      setTraversingId(curr.id);
      values.push(curr.value);
      await sleep(delay);
      curr = curr.next;
    }
    setTraversingId(null);
    setMessage(`Traversed: [${values.join(", ")}]`);
    setBusy(false);
  };

  const clear = () => {
    setHead(null);
    setMessage("");
    setTraversingId(null);
  };

  const renderList = () => {
    if (!head) return <div className="text-sm text-[var(--dsa-muted)]">Empty list</div>;
    const items: React.ReactElement[] = [];
    let curr: ListNode | null = head;
    while (curr) {
      const isHead = curr.id === head.id;
      items.push(
        <div key={curr.id} className="flex items-center shrink-0">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`${box} w-11 h-11 sm:w-12 sm:h-12 ${
                traversingId === curr.id ? boxActive : boxDefault
              }`}
            >
              {curr.value}
            </div>
            <span className="text-[10px] text-[var(--dsa-muted)] font-mono">
              {isHead ? "head" : !curr.next ? "tail" : ""}
            </span>
          </div>
          {curr.next && <div className="mx-1.5 sm:mx-2 text-[var(--dsa-muted)]">→</div>}
        </div>
      );
      curr = curr.next;
    }
    return <div className="flex overflow-x-auto pb-2">{items}</div>;
  };

  return (
    <div>
      <SectionHeading title="Linked List" desc="Insert, delete, reverse and traverse a singly linked list." />

      <div className="flex flex-wrap gap-2 mb-3">
        <StatChip label="length" value={length} />
        <StatChip label="head" value={head ? head.value : "—"} />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter number"
          className={input}
        />
        <button onClick={insertAtHead} disabled={busy} className={btn}>
          <ArrowUpFromLine className="w-3.5 h-3.5" /> Insert head
        </button>
        <button onClick={insertAtEnd} disabled={busy} className={btn}>
          <ArrowDownToLine className="w-3.5 h-3.5" /> Insert end
        </button>
        <button onClick={deleteByValue} disabled={busy} className={btn}>
          <Trash2 className="w-3.5 h-3.5" /> Delete value
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={traverse} disabled={busy} className={btn}>
          <SearchIcon className="w-3.5 h-3.5" /> Traverse
        </button>
        <button onClick={reverse} disabled={busy} className={btn}>
          Reverse
        </button>
        <button onClick={clear} disabled={busy} className={btn}>
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="mt-6">{renderList()}</div>

      <SectionMessage text={message} />
    </div>
  );
}

function cloneList(node: ListNode): ListNode {
  return { id: node.id, value: node.value, next: node.next ? cloneList(node.next) : null };
}

// ============================================================
// Stack Section
// ============================================================

function StackSection() {
  const [stack, setStack] = useState<NodeValue[]>([]);
  const [value, setValue] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [peeking, setPeeking] = useState(false);

  const push = () => {
    const num = Number(value);
    if (!value || isNaN(num)) return setMessage("Enter a valid number.");
    setStack((s) => [...s, num]);
    setMessage(`Pushed ${num} onto the stack — O(1).`);
    setValue("");
  };

  const pop = () => {
    if (stack.length === 0) return setMessage("Stack is empty — nothing to pop.");
    const top = stack[stack.length - 1];
    setStack((s) => s.slice(0, -1));
    setMessage(`Popped ${top} from the stack — O(1).`);
  };

  const peek = () => {
    if (stack.length === 0) return setMessage("Stack is empty.");
    setPeeking(true);
    setMessage(`Top of stack is ${stack[stack.length - 1]}.`);
    setTimeout(() => setPeeking(false), 900);
  };

  const clear = () => {
    setStack([]);
    setMessage("");
  };

  return (
    <div>
      <SectionHeading title="Stack" desc="LIFO — push, pop and peek the top element." />

      <div className="flex flex-wrap gap-2 mb-3">
        <StatChip label="size" value={stack.length} />
        <StatChip label="top" value={stack.length ? stack[stack.length - 1] : "—"} />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter number"
          className={input}
        />
        <button onClick={push} className={btn}>
          <Plus className="w-3.5 h-3.5" /> Push
        </button>
        <button onClick={pop} className={btn}>
          <Trash2 className="w-3.5 h-3.5" /> Pop
        </button>
        <button onClick={peek} className={btn}>
          <Eye className="w-3.5 h-3.5" /> Peek
        </button>
        <button onClick={clear} className={btn}>
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 w-16 sm:w-20">
        {stack.length === 0 && (
          <div className="text-sm text-[var(--dsa-muted)] text-center">Empty stack</div>
        )}
        {stack.map((v, i) => (
          <motion.div
            layout
            key={i}
            className={`${box} h-10 ${
              peeking && i === stack.length - 1 ? boxActive : boxDefault
            }`}
          >
            {v}
          </motion.div>
        ))}
      </div>
      {stack.length > 0 && (
        <div className="mt-1 text-[10px] text-[var(--dsa-muted)] font-mono">↑ top of stack</div>
      )}

      <SectionMessage text={message} />
    </div>
  );
}

// ============================================================
// Queue Section
// ============================================================

function QueueSection() {
  const [queue, setQueue] = useState<NodeValue[]>([]);
  const [value, setValue] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [peeking, setPeeking] = useState(false);

  const enqueue = () => {
    const num = Number(value);
    if (!value || isNaN(num)) return setMessage("Enter a valid number.");
    setQueue((q) => [...q, num]);
    setMessage(`Enqueued ${num} - O(1).`);
    setValue("");
  };

  const dequeue = () => {
    if (queue.length === 0) return setMessage("Queue is empty - nothing to dequeue.");
    const front = queue[0];
    setQueue((q) => q.slice(1));
    setMessage(`Dequeued ${front} - O(1) with a proper front pointer.`);
  };

  const peekFront = () => {
    if (queue.length === 0) return setMessage("Queue is empty.");
    setPeeking(true);
    setMessage(`Front of queue is ${queue[0]}.`);
    setTimeout(() => setPeeking(false), 900);
  };

  const clear = () => {
    setQueue([]);
    setMessage("");
  };

  return (
    <div>
      <SectionHeading title="Queue" desc="FIFO - enqueue at the back, dequeue from the front." />

      <div className="flex flex-wrap gap-2 mb-3">
        <StatChip label="size" value={queue.length} />
        <StatChip label="front" value={queue.length ? queue[0] : "—"} />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter number"
          className={input}
        />
        <button onClick={enqueue} className={btn}>
          <Plus className="w-3.5 h-3.5" /> Enqueue
        </button>
        <button onClick={dequeue} className={btn}>
          <Trash2 className="w-3.5 h-3.5" /> Dequeue
        </button>
        <button onClick={peekFront} className={btn}>
          <Eye className="w-3.5 h-3.5" /> Peek
        </button>
        <button onClick={clear} className={btn}>
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="mt-6 flex gap-2 flex-wrap items-center">
        {queue.length === 0 && <div className="text-sm text-[var(--dsa-muted)]">Empty queue</div>}
        {queue.map((v, i) => (
          <motion.div
            layout
            key={i}
            className={`${box} w-11 h-11 sm:w-12 sm:h-12 ${
              peeking && i === 0 ? boxActive : boxDefault
            }`}
          >
            {v}
          </motion.div>
        ))}
      </div>
      {queue.length > 0 && (
        <div className="mt-1 flex justify-between text-[10px] text-[var(--dsa-muted)] font-mono w-full max-w-xs">
          <span>↑ front</span>
          <span>back ↑</span>
        </div>
      )}

      <SectionMessage text={message} />
    </div>
  );
}

// ============================================================
// BST Section
// ============================================================

function BSTSection({ delay }: { delay: number }) {
  const [root, setRoot] = useState<BSTNode | null>(null);
  const [value, setValue] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const height = (node: BSTNode | null): number =>
    node ? 1 + Math.max(height(node.left), height(node.right)) : 0;
  const count = (node: BSTNode | null): number =>
    node ? 1 + count(node.left) + count(node.right) : 0;

  const insert = async () => {
    const num = Number(value);
    if (!value || isNaN(num)) return setMessage("Enter a valid number.");
    setBusy(true);
    setMessage("Inserting into BST…");
    const newNode: BSTNode = { id: genId(), value: num, left: null, right: null };

    if (!root) {
      setRoot(newNode);
      setMessage(`${num} inserted as root.`);
      setValue("");
      setBusy(false);
      return;
    }

    const cloneRoot = cloneTree(root);
    let curr: BSTNode = cloneRoot;
    while (true) {
      setHighlightId(curr.id);
      await sleep(delay);
      if (num === curr.value) {
        setMessage(`${num} already exists in the tree.`);
        break;
      } else if (num < curr.value) {
        if (!curr.left) {
          curr.left = newNode;
          setMessage(`${num} inserted as left child of ${curr.value}.`);
          break;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = newNode;
          setMessage(`${num} inserted as right child of ${curr.value}.`);
          break;
        }
        curr = curr.right;
      }
    }
    setRoot(cloneRoot);
    setHighlightId(null);
    setValue("");
    setBusy(false);
  };

  const search = async () => {
    const num = Number(value);
    if (!value || isNaN(num)) return setMessage("Enter a valid number.");
    if (!root) return setMessage("Tree is empty.");
    setBusy(true);
    setMessage(`Searching for ${num}…`);
    let curr: BSTNode | null = root;
    while (curr) {
      setHighlightId(curr.id);
      await sleep(delay);
      if (curr.value === num) {
        setMessage(`Found ${num}.`);
        setHighlightId(null);
        setBusy(false);
        return;
      } else if (num < curr.value) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }
    setHighlightId(null);
    setMessage(`${num} not found.`);
    setBusy(false);
  };

  const deleteValue = () => {
    const num = Number(value);
    if (!value || isNaN(num)) return setMessage("Enter a valid number to delete.");
    if (!root) return setMessage("Tree is empty.");
    const cloneRoot = root ? cloneTree(root) : null;
    const result = deleteFromTree(cloneRoot, num);
    if (result.deleted) {
      setRoot(result.node);
      setMessage(`Deleted ${num} from the tree.`);
    } else {
      setMessage(`${num} not found - nothing deleted.`);
    }
    setValue("");
  };

  const findExtreme = (dir: "min" | "max") => {
    if (!root) return setMessage("Tree is empty.");
    let curr = root;
    while (dir === "min" ? curr.left : curr.right) {
      curr = (dir === "min" ? curr.left : curr.right)!;
    }
    setMessage(`${dir === "min" ? "Minimum" : "Maximum"} value is ${curr.value}.`);
  };

  const inorder = async () => {
    if (!root) return setMessage("Tree is empty.");
    setBusy(true);
    setMessage("Inorder traversal…");
    const res: NodeValue[] = [];
    const walk = (node: BSTNode | null) => {
      if (!node) return;
      walk(node.left);
      res.push(node.value);
      walk(node.right);
    };
    walk(root);
    for (let i = 0; i < res.length; i++) {
      await sleep(delay);
      setMessage(`Inorder so far: [${res.slice(0, i + 1).join(", ")}]`);
    }
    setBusy(false);
  };

  const clear = () => {
    setRoot(null);
    setMessage("");
    setHighlightId(null);
  };

  const renderTree = () => {
    if (!root) return <div className="text-sm text-[var(--dsa-muted)]">Empty tree</div>;
    const NodeBox = ({ node }: { node: BSTNode }) => {
      const isHighlighted = highlightId === node.id;
      return (
        <div className="flex flex-col items-center">
          <div className={`${box} w-11 h-11 sm:w-12 sm:h-12 ${isHighlighted ? boxActive : boxDefault}`}>
            {node.value}
          </div>
          <div className="flex gap-6 sm:gap-8 mt-2">
            {node.left && (
              <div className="flex flex-col items-center">
                <div className="text-[var(--dsa-muted)] text-xs">↙</div>
                <NodeBox node={node.left} />
              </div>
            )}
            {node.right && (
              <div className="flex flex-col items-center">
                <div className="text-[var(--dsa-muted)] text-xs">↘</div>
                <NodeBox node={node.right} />
              </div>
            )}
          </div>
        </div>
      );
    };
    return <NodeBox node={root} />;
  };

  return (
    <div>
      <SectionHeading title="Binary Search Tree" desc="Insert, search, delete and traverse a BST." />

      <div className="flex flex-wrap gap-2 mb-3">
        <StatChip label="nodes" value={count(root)} />
        <StatChip label="height" value={height(root)} />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter number"
          className={input}
        />
        <button onClick={insert} disabled={busy} className={btn}>
          <Plus className="w-3.5 h-3.5" /> Insert
        </button>
        <button onClick={search} disabled={busy} className={btn}>
          <SearchIcon className="w-3.5 h-3.5" /> Search
        </button>
        <button onClick={deleteValue} disabled={busy} className={btn}>
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={inorder} disabled={busy} className={btn}>
          Inorder traversal
        </button>
        <button onClick={() => findExtreme("min")} disabled={busy} className={btn}>
          <Ruler className="w-3.5 h-3.5" /> Min
        </button>
        <button onClick={() => findExtreme("max")} disabled={busy} className={btn}>
          <Ruler className="w-3.5 h-3.5" /> Max
        </button>
        <button onClick={clear} disabled={busy} className={btn}>
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="mt-8 overflow-x-auto">{renderTree()}</div>

      <SectionMessage text={message} />
    </div>
  );
}

function cloneTree(node: BSTNode): BSTNode {
  return {
    id: node.id,
    value: node.value,
    left: node.left ? cloneTree(node.left) : null,
    right: node.right ? cloneTree(node.right) : null,
  };
}

function deleteFromTree(
  node: BSTNode | null,
  val: number
): { node: BSTNode | null; deleted: boolean } {
  if (!node) return { node: null, deleted: false };

  if (val < node.value) {
    const res = deleteFromTree(node.left, val);
    node.left = res.node;
    return { node, deleted: res.deleted };
  }
  if (val > node.value) {
    const res = deleteFromTree(node.right, val);
    node.right = res.node;
    return { node, deleted: res.deleted };
  }

  // Found the node to delete.
  if (!node.left) return { node: node.right, deleted: true };
  if (!node.right) return { node: node.left, deleted: true };

  // Two children: replace with inorder successor (min of right subtree).
  let successor = node.right;
  while (successor.left) successor = successor.left;
  node.value = successor.value;
  const res = deleteFromTree(node.right, successor.value);
  node.right = res.node;
  return { node, deleted: true };
}

// ============================================================
// Sorting Section
// ============================================================

const DEFAULT_ARRAY = [5, 3, 8, 1, 9, 2];

function SortingSection({ delay }: { delay: number }) {
  const [arr, setArr] = useState<NodeValue[]>(DEFAULT_ARRAY);
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [sortedUpTo, setSortedUpTo] = useState<number>(-1);
  const [message, setMessage] = useState<string>("");
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [busy, setBusy] = useState(false);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const resetCounters = () => {
    setComparisons(0);
    setSwaps(0);
    setSortedUpTo(-1);
  };

  const bubbleSort = async () => {
    setBusy(true);
    resetCounters();
    setMessage("Starting bubble sort…");
    const a = [...arr];
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setHighlightIndices([j, j + 1]);
        setComparisons((c) => c + 1);
        await sleep(delay);
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          setSwaps((s) => s + 1);
          setArr([...a]);
        }
      }
      setSortedUpTo(n - i - 1);
    }
    setHighlightIndices([]);
    setSortedUpTo(0);
    setMessage("Bubble sort complete - O(n²) comparisons in the worst case.");
    setBusy(false);
  };

  const selectionSort = async () => {
    setBusy(true);
    resetCounters();
    setMessage("Starting selection sort…");
    const a = [...arr];
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        setHighlightIndices([minIdx, j]);
        setComparisons((c) => c + 1);
        await sleep(delay);
        if (a[j] < a[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
        setSwaps((s) => s + 1);
        setArr([...a]);
      }
      setSortedUpTo(i + 1);
    }
    setHighlightIndices([]);
    setSortedUpTo(0);
    setMessage("Selection sort complete - always O(n²) comparisons.");
    setBusy(false);
  };

  const insertionSort = async () => {
    setBusy(true);
    resetCounters();
    setMessage("Starting insertion sort…");
    const a = [...arr];
    const n = a.length;
    for (let i = 1; i < n; i++) {
      const key = a[i];
      let j = i - 1;
      setHighlightIndices([i]);
      await sleep(delay);
      while (j >= 0 && a[j] > key) {
        setHighlightIndices([j, j + 1]);
        setComparisons((c) => c + 1);
        await sleep(delay);
        a[j + 1] = a[j];
        setSwaps((s) => s + 1);
        setArr([...a]);
        j--;
      }
      a[j + 1] = key;
      setArr([...a]);
    }
    setHighlightIndices([]);
    setSortedUpTo(0);
    setMessage("Insertion sort complete — shines on nearly-sorted data (O(n) best case).");
    setBusy(false);
  };

  const shuffle = () => {
    const next = [...arr];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setArr(next);
    resetCounters();
    setMessage("Shuffled array.");
  };

  const randomize = () => {
    const size = 6 + Math.floor(Math.random() * 3);
    const next = Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
    setArr(next);
    resetCounters();
    setMessage("Generated a new random array.");
  };

  const reset = () => {
    setArr(DEFAULT_ARRAY);
    setHighlightIndices([]);
    resetCounters();
    setMessage("");
  };

  return (
    <div>
      <SectionHeading title="Sorting" desc="Watch bubble, selection and insertion sort rearrange the array step by step." />

      <div className="flex flex-wrap gap-2 mb-3">
        <StatChip label="comparisons" value={comparisons} />
        <StatChip label="swaps" value={swaps} />
        <StatChip label="elements" value={arr.length} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={bubbleSort} disabled={busy} className={btnAccent}>
          Bubble Sort <ComplexityBadge>O(n²)</ComplexityBadge>
        </button>
        <button onClick={selectionSort} disabled={busy} className={btn}>
          Selection Sort <ComplexityBadge>O(n²)</ComplexityBadge>
        </button>
        <button onClick={insertionSort} disabled={busy} className={btn}>
          Insertion Sort <ComplexityBadge>O(n²)</ComplexityBadge>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={shuffle} disabled={busy} className={btn}>
          <Shuffle className="w-3.5 h-3.5" /> Shuffle
        </button>
        <button onClick={randomize} disabled={busy} className={btn}>
          Random array
        </button>
        <button onClick={reset} disabled={busy} className={btn}>
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="mt-6 flex gap-2 flex-wrap items-end">
        {arr.map((val, idx) => (
          <motion.div
            layout
            key={idx}
            className={`${box} w-11 h-11 sm:w-12 sm:h-12 ${
              highlightIndices.includes(idx) ? boxActive : boxDefault
            }`}
          >
            {val}
          </motion.div>
        ))}
      </div>

      <SectionMessage text={message} tone={sortedUpTo === 0 ? "success" : undefined} />
    </div>
  );
}

// ============================================================
// Shared section heading
// ============================================================

function SectionHeading({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg sm:text-xl font-semibold text-[var(--dsa-text)]">{title}</h2>
      <p className="text-[var(--dsa-muted)] text-xs sm:text-sm mt-1">{desc}</p>
    </div>
  );
}