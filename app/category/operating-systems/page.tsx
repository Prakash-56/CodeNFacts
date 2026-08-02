"use client";

/**
 * category/operating-system/page.tsx
 * ------------------------------------------------------------------
 * A single-file, self-contained "Operating Systems" learning page.
 *
 * THEMING
 *   Light mode  -> plain white surface (#FFFFFF) on a warm paper bg (#FAFAF8)
 *   Dark mode   -> near-black "kernel" surface (#0A0D12 / #12161F)
 *   This file uses Tailwind's `dark:` variant throughout. It assumes your
 *   app already toggles a `class="dark"` on <html> (e.g. next-themes) from
 *   the header button you mentioned you already have — no toggle is built
 *   here on purpose, so it won't fight with your existing one.
 *
 * FONTS (recommended, load once in app/layout.tsx via next/font/google):
 *   Space Grotesk  -> display/headings   (--font-display)
 *   Inter          -> body copy          (--font-body)
 *   JetBrains Mono -> addresses / code / cheat sheets (--font-mono)
 *   This file falls back to system fonts inline so it still looks correct
 *   even if you haven't wired the font files up yet.
 *
 * DEPENDENCIES
 *   lucide-react (icons) — swap the imports below if you use another set.
 * ------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react";
import {
  Cpu,
  MemoryStick,
  Lock,
  GitBranch,
  Layers,
  HardDrive,
  Clock,
  AlertTriangle,
  Boxes,
  Network,
  BookOpen,
  ChevronDown,
  Terminal,
  Zap,
  ArrowRight,
  ArrowRightLeft,
  Smartphone,
  Server,
  Wifi,
  Gauge,
  ShieldAlert,
  ListChecks,
  Skull,
  Menu,
  X,
} from "lucide-react";

/* ============================================================================
   FONT STACKS (inline so the file works standalone)
============================================================================ */
const displayFont = { fontFamily: "'Space Grotesk','Inter',system-ui,sans-serif" };
const monoFont = { fontFamily: "'JetBrains Mono','Fira Code',ui-monospace,monospace" };

/* ============================================================================
   DATA
============================================================================ */

const TOC = [
  { id: "intro", label: "What & Why", addr: "0x00" },
  { id: "use-cases", label: "Use Cases", addr: "0x01" },
  { id: "os-structure", label: "OS Structure", addr: "0x02" },
  { id: "process-management", label: "Process Management", addr: "0x03" },
  { id: "cpu-scheduling", label: "CPU Scheduling", addr: "0x04" },
  { id: "synchronization", label: "Synchronization", addr: "0x05" },
  { id: "deadlocks", label: "Deadlocks", addr: "0x06" },
  { id: "ipc", label: "IPC", addr: "0x07" },
  { id: "multithreading", label: "Multithreading Models", addr: "0x08" },
  { id: "memory-management", label: "Memory Management", addr: "0x09" },
  { id: "contiguous-allocation", label: "Contiguous Allocation", addr: "0x0A" },
  { id: "paging", label: "Paging", addr: "0x0B" },
  { id: "segmentation", label: "Segmentation", addr: "0x0C" },
  { id: "swapping", label: "Swapping", addr: "0x0D" },
  { id: "storage-disk", label: "Storage & Disks", addr: "0x0E" },
  { id: "real-time", label: "Real-Time Systems", addr: "0x0F" },
  { id: "cheat-sheets", label: "Cheat Sheets", addr: "0x10" },
];

const useCases = [
  { icon: Smartphone, title: "Mobile", body: "Android/iOS schedule apps, isolate them via processes/sandboxes, and manage battery-aware power states." },
  { icon: Server, title: "Servers & Cloud", body: "Linux/Windows Server hosts thousands of containers and VMs, each relying on the kernel's scheduler and memory manager." },
  { icon: Boxes, title: "Embedded", body: "Washing machines, routers, and car ECUs run tiny kernels (FreeRTOS, Zephyr) tuned for one job and a hard deadline." },
  { icon: Wifi, title: "IoT", body: "Sensors run event-driven, low-power kernels that sleep almost always and wake only to sample and transmit." },
  { icon: Gauge, title: "Real-Time Control", body: "Anti-lock brakes, pacemakers, and robotics need an RTOS that guarantees *when* a task finishes, not just that it does." },
  { icon: Layers, title: "Virtualization", body: "Hypervisors are OS-like layers that multiplex hardware across whole guest operating systems (VMware, KVM, Hyper-V)." },
];

const schedulingAlgos = [
  { name: "FCFS", preemptive: "No", starvation: "No", convoy: "Yes", bestFor: "Simplicity, batch jobs", formula: "Turnaround = Completion − Arrival" },
  { name: "SJF", preemptive: "No", starvation: "Yes (long jobs)", convoy: "No", bestFor: "Minimizing avg. waiting time", formula: "Optimal avg WT if burst times are known" },
  { name: "SRTF", preemptive: "Yes", starvation: "Yes", convoy: "No", bestFor: "SJF + new-arrival responsiveness", formula: "Preempt if new burst < remaining" },
  { name: "Priority", preemptive: "Either", starvation: "Yes", convoy: "No", bestFor: "Importance-based ordering", formula: "Fix via aging (priority++ over time)" },
  { name: "Round Robin", preemptive: "Yes", starvation: "No", convoy: "No", bestFor: "Time-sharing, fairness", formula: "Avg WT sensitive to time quantum q" },
  { name: "MLFQ", preemptive: "Yes", starvation: "Possible", convoy: "No", bestFor: "Mixed CPU/IO-bound workloads", formula: "Multiple queues, demote on quantum expiry" },
];

const diskAlgos = [
  { name: "FCFS", pattern: "Service in arrival order", note: "Fair but can cause long seeks" },
  { name: "SSTF", pattern: "Nearest request first", note: "Low seek time, can starve far requests" },
  { name: "SCAN", pattern: "Sweep like an elevator, reverse at the end", note: "No starvation, uneven wait at edges" },
  { name: "C-SCAN", pattern: "Sweep one direction only, jump back to start", note: "Uniform wait time across disk" },
  { name: "LOOK", pattern: "Like SCAN but reverses at last request, not disk end", note: "Avoids wasted travel to empty ends" },
  { name: "C-LOOK", pattern: "Like C-SCAN but jumps to first request, not disk start", note: "Most efficient of the family" },
];

const syncPrimitives = [
  { name: "Mutex", scope: "1 owner, binary lock/unlock", use: "Protect a single critical section" },
  { name: "Semaphore (counting)", scope: "Integer count, signal/wait", use: "Bound access to N identical resources" },
  { name: "Binary Semaphore", scope: "0/1, any thread can signal", use: "Signaling between threads (not just mutual exclusion)" },
  { name: "Monitor", scope: "Language-level lock + condition vars", use: "High-level mutual exclusion (Java `synchronized`)" },
  { name: "Spinlock", scope: "Busy-waits instead of sleeping", use: "Very short critical sections on multicore" },
];

const classicProblems = [
  { name: "Producer–Consumer", gist: "A bounded buffer shared by producers and consumers; needs empty/full counting semaphores + a mutex." },
  { name: "Readers–Writers", gist: "Many readers may read together; a writer needs exclusive access — variants favor readers, writers, or fairness." },
  { name: "Dining Philosophers", gist: "5 philosophers, 5 forks; classic deadlock demo — fixed by resource ordering, a waiter, or limiting diners to 4." },
  { name: "Sleeping Barber", gist: "Barber sleeps when idle; models bounded-waiting-room synchronization with limited seats." },
];

const deadlockConditions = [
  { name: "Mutual Exclusion", body: "At least one resource is held in a non-shareable mode." },
  { name: "Hold and Wait", body: "A process holds one resource while waiting for another." },
  { name: "No Preemption", body: "A resource can only be released voluntarily by the process holding it." },
  { name: "Circular Wait", body: "A closed chain of processes, each waiting on a resource held by the next." },
];

const deadlockHandling = [
  { name: "Prevention", body: "Deny one of the 4 conditions structurally (e.g. request all resources at once)." },
  { name: "Avoidance", body: "Grant requests only if the system stays in a safe state — Banker's Algorithm." },
  { name: "Detection & Recovery", body: "Let deadlocks happen, detect via a wait-for graph, then kill/preempt a process." },
  { name: "Ignorance (Ostrich)", body: "Assume it's rare enough not to bother — what most general-purpose OSes actually do." },
];

const threadingModels = [
  { name: "Many-to-One", body: "Many user threads map to one kernel thread. Fast to create, but one blocking call blocks all threads." },
  { name: "One-to-One", body: "Each user thread gets its own kernel thread. True concurrency, but thread creation is heavier (Windows, Linux)." },
  { name: "Many-to-Many", body: "Many user threads multiplexed over a smaller/equal pool of kernel threads — flexible, but complex to implement." },
];

const osStructures = [
  { name: "Monolithic", body: "Every service (drivers, FS, scheduler) runs in kernel space as one big program. Fast, but one bug can crash everything.", eg: "Linux, classic UNIX" },
  { name: "Layered", body: "The OS is split into numbered layers, each only using services of the layer below it.", eg: "Early THE OS" },
  { name: "Microkernel", body: "Kernel keeps only the bare minimum (IPC, scheduling, basic memory); drivers & file systems run in user space.", eg: "Minix, QNX, seL4" },
  { name: "Hybrid", body: "Monolithic core for speed, with microkernel-style modularity for select services.", eg: "Windows NT, macOS (XNU)" },
];

const memoryFormulas = [
  { label: "Logical address space size", formula: "2^m  (m = bits in logical address)" },
  { label: "Physical address space size", formula: "2^n  (n = bits in physical address)" },
  { label: "Number of pages", formula: "Logical space size ÷ Page size" },
  { label: "Number of frames", formula: "Physical space size ÷ Frame size" },
  { label: "Page table size", formula: "Number of pages × size of one entry" },
  { label: "Effective Access Time (EAT)", formula: "hit_ratio × mem_time + miss_ratio × (mem_time × 2)" },
];

/* ============================================================================
   SMALL REUSABLE UI PIECES
============================================================================ */

function Eyebrow({ addr, children }: { addr: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span
        style={monoFont}
        className="text-xs px-2 py-0.5 rounded border border-emerald-700/30 bg-emerald-700/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300"
      >
        {addr}
      </span>
      <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
        {children}
      </span>
    </div>
  );
}

function SectionHeading({
  addr,
  eyebrow,
  title,
  subtitle,
}: {
  addr: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <Eyebrow addr={addr}>{eyebrow}</Eyebrow>
      <h2 style={displayFont} className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function DefBox({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-4">
      <p style={monoFont} className="text-[11px] uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-1.5">
        // definition
      </p>
      <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
        <span className="font-semibold">{term}</span> {children}
      </p>
    </div>
  );
}

function ProTip({ children, tone = "amber" }: { children: React.ReactNode; tone?: "amber" | "rust" }) {
  const map = {
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
    rust: "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300",
  } as const;
  return (
    <div className={`rounded-lg border p-4 flex gap-3 ${map[tone]}`}>
      <Zap className="w-4 h-4 mt-0.5 shrink-0" />
      <p className="text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function DiagramFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12161F] p-5 overflow-x-auto">
      <p style={monoFont} className="text-[11px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
        fig — {label}
      </p>
      {children}
    </div>
  );
}

function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-neutral-100 dark:bg-neutral-900">
            {columns.map((c) => (
              <th
                key={c}
                style={monoFont}
                className="text-left px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide text-[11px] border-b border-neutral-200 dark:border-neutral-800"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="odd:bg-white even:bg-neutral-50 dark:odd:bg-[#0F131A] dark:even:bg-[#12161F] border-b last:border-0 border-neutral-100 dark:border-neutral-800/60"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-neutral-700 dark:text-neutral-300 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Accordion({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800 overflow-hidden">
      {items.map((it, i) => (
        <div key={it.title} className="bg-white dark:bg-[#12161F]">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors"
          >
            <span className="font-medium text-neutral-800 dark:text-neutral-200">{it.title}</span>
            <ChevronDown
              className={`w-4 h-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`grid transition-all duration-200 ease-out ${
              open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-4 pb-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {it.body}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CardGrid({
  items,
}: {
  items: { icon: any; title: string; body: string }[];
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(({ icon: Icon, title, body }) => (
        <div
          key={title}
          className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12161F] p-5 hover:border-emerald-600/40 dark:hover:border-emerald-400/30 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-700/10 dark:bg-emerald-400/10 flex items-center justify-center mb-3 group-hover:bg-emerald-700/20 dark:group-hover:bg-emerald-400/20 transition-colors">
            <Icon className="w-4.5 h-4.5 text-emerald-700 dark:text-emerald-300" />
          </div>
          <h3 style={displayFont} className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
            {title}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{body}</p>
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
   DIAGRAMS (inline SVG)
============================================================================ */

function ProcessStateDiagram() {
  return (
    <svg viewBox="0 0 720 260" className="w-full h-auto min-w-[560px]">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-neutral-400 dark:fill-neutral-500" />
        </marker>
      </defs>
      {[
        { x: 20, y: 110, w: 100, h: 44, label: "New" },
        { x: 200, y: 110, w: 110, h: 44, label: "Ready" },
        { x: 400, y: 20, w: 130, h: 44, label: "Running" },
        { x: 400, y: 196, w: 130, h: 44, label: "Waiting" },
        { x: 600, y: 110, w: 100, h: 44, label: "Terminated" },
      ].map((b) => (
        <g key={b.label}>
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="8"
            className="fill-white dark:fill-[#0F131A] stroke-emerald-700 dark:stroke-emerald-400"
            strokeWidth="1.5"
          />
          <text
            x={b.x + b.w / 2}
            y={b.y + b.h / 2 + 4}
            textAnchor="middle"
            className="fill-neutral-800 dark:fill-neutral-200 text-[13px] font-medium"
          >
            {b.label}
          </text>
        </g>
      ))}
      {/* arrows */}
      <line x1="120" y1="132" x2="196" y2="132" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="310" y1="120" x2="398" y2="55" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="400" y1="70" x2="312" y2="130" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="465" y1="64" x2="465" y2="192" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="440" y1="196" x2="440" y2="68" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="530" y1="45" x2="605" y2="118" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="155" y="122" className="fill-neutral-400 dark:fill-neutral-500 text-[10px]">admit</text>
      <text x="330" y="80" className="fill-neutral-400 dark:fill-neutral-500 text-[10px]">dispatch</text>
      <text x="320" y="150" className="fill-neutral-400 dark:fill-neutral-500 text-[10px]">preempt</text>
      <text x="470" y="130" className="fill-neutral-400 dark:fill-neutral-500 text-[10px]">I/O wait</text>
      <text x="400" y="130" className="fill-neutral-400 dark:fill-neutral-500 text-[10px]">I/O done</text>
      <text x="545" y="80" className="fill-neutral-400 dark:fill-neutral-500 text-[10px]">exit</text>
    </svg>
  );
}

function AddressTranslationDiagram() {
  const steps = ["CPU", "Logical Address", "MMU (+ base)", "Physical Address", "Memory"];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className="px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {s}
          </div>
          {i < steps.length - 1 && <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0" />}
        </div>
      ))}
    </div>
  );
}

function PagingDiagram() {
  return (
    <div className="grid md:grid-cols-3 gap-4 items-start">
      <div>
        <p style={monoFont} className="text-xs text-neutral-400 mb-2">Logical Address</p>
        <div className="flex rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
          <div className="flex-1 px-3 py-3 text-center bg-blue-600/10 text-blue-700 dark:text-blue-300 text-sm font-medium">Page # (p)</div>
          <div className="flex-1 px-3 py-3 text-center bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 text-sm font-medium">Offset (d)</div>
        </div>
      </div>
      <div>
        <p style={monoFont} className="text-xs text-neutral-400 mb-2">Page Table</p>
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800 text-sm">
          {["p → f0", "p+1 → f3", "p+2 → f1"].map((r) => (
            <div key={r} className="px-3 py-2 flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>{r.split(" → ")[0]}</span>
              <span className="text-emerald-700 dark:text-emerald-300 font-medium">{r.split(" → ")[1]}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p style={monoFont} className="text-xs text-neutral-400 mb-2">Physical Address</p>
        <div className="flex rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
          <div className="flex-1 px-3 py-3 text-center bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 text-sm font-medium">Frame # (f)</div>
          <div className="flex-1 px-3 py-3 text-center bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 text-sm font-medium">Offset (d)</div>
        </div>
      </div>
    </div>
  );
}

function SegmentationDiagram() {
  const segs = [
    { name: "Stack", base: "1400", limit: "1000" },
    { name: "Heap", base: "2600", limit: "400" },
    { name: "Code", base: "0", limit: "600" },
    { name: "Data", base: "3200", limit: "1100" },
  ];
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <p style={monoFont} className="text-xs text-neutral-400 mb-2">Segment Table (per segment: base + limit)</p>
        <DataTable columns={["Segment", "Base", "Limit"]} rows={segs.map((s) => [s.name, s.base, s.limit])} />
      </div>
      <div>
        <p style={monoFont} className="text-xs text-neutral-400 mb-2">Physical Memory (variable-size chunks)</p>
        <div className="space-y-1.5">
          {segs.map((s) => (
            <div
              key={s.name}
              className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 flex justify-between"
              style={{ width: `${40 + Number(s.limit) / 12}px`, minWidth: "140px" }}
            >
              <span>{s.name}</span>
              <span className="text-neutral-400">{s.limit}B</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeadlockGraph() {
  return (
    <svg viewBox="0 0 420 220" className="w-full h-auto min-w-[340px] max-w-md mx-auto">
      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-rose-500" />
        </marker>
      </defs>
      {/* nodes */}
      <circle cx="90" cy="60" r="26" className="fill-white dark:fill-[#0F131A] stroke-blue-600" strokeWidth="1.5" />
      <text x="90" y="65" textAnchor="middle" className="fill-neutral-800 dark:fill-neutral-200 text-[13px] font-medium">P1</text>
      <circle cx="330" cy="60" r="26" className="fill-white dark:fill-[#0F131A] stroke-blue-600" strokeWidth="1.5" />
      <text x="330" y="65" textAnchor="middle" className="fill-neutral-800 dark:fill-neutral-200 text-[13px] font-medium">P2</text>
      <rect x="190" y="150" width="40" height="40" className="fill-white dark:fill-[#0F131A] stroke-neutral-500" strokeWidth="1.5" />
      <text x="210" y="174" textAnchor="middle" className="fill-neutral-800 dark:fill-neutral-200 text-[13px] font-medium">R1</text>
      <rect x="190" y="20" width="40" height="40" className="fill-white dark:fill-[#0F131A] stroke-neutral-500" strokeWidth="1.5" />
      <text x="210" y="44" textAnchor="middle" className="fill-neutral-800 dark:fill-neutral-200 text-[13px] font-medium">R2</text>
      {/* edges forming a cycle: P1 -> R2 (request), R2 -> P2 (alloc), P2 -> R1 (request), R1 -> P1 (alloc) */}
      <line x1="112" y1="45" x2="188" y2="35" className="stroke-rose-500" strokeWidth="1.5" markerEnd="url(#arrow2)" />
      <line x1="230" y1="35" x2="308" y2="48" className="stroke-rose-500" strokeWidth="1.5" markerEnd="url(#arrow2)" />
      <line x1="310" y1="80" x2="232" y2="155" className="stroke-rose-500" strokeWidth="1.5" markerEnd="url(#arrow2)" />
      <line x1="188" y1="160" x2="114" y2="78" className="stroke-rose-500" strokeWidth="1.5" markerEnd="url(#arrow2)" />
      <text x="130" y="30" className="fill-neutral-400 text-[10px]">request</text>
      <text x="248" y="20" className="fill-neutral-400 text-[10px]">holds</text>
      <text x="290" y="120" className="fill-neutral-400 text-[10px]">request</text>
      <text x="120" y="130" className="fill-neutral-400 text-[10px]">holds</text>
    </svg>
  );
}

function DiskArmDiagram() {
  // SCAN-style sweep sketch across a 0-199 cylinder track
  const requests = [23, 89, 132, 42, 187, 11, 165];
  const path = [50, 11, 23, 42, 89, 132, 165, 187, 199];
  const scaleX = (v: number) => 20 + (v / 199) * 640;
  return (
    <svg viewBox="0 0 700 140" className="w-full h-auto min-w-[560px]">
      <line x1="20" y1="110" x2="660" y2="110" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1" />
      {[0, 50, 100, 150, 199].map((v) => (
        <g key={v}>
          <line x1={scaleX(v)} y1="106" x2={scaleX(v)} y2="114" className="stroke-neutral-400" />
          <text x={scaleX(v)} y="128" textAnchor="middle" className="fill-neutral-400 text-[10px]">{v}</text>
        </g>
      ))}
      {requests.map((r) => (
        <circle key={r} cx={scaleX(r)} cy="110" r="3.5" className="fill-blue-500" />
      ))}
      <polyline
        points={path.map((v, i) => `${scaleX(v)},${20 + i * 8}`).join(" ")}
        className="fill-none stroke-emerald-600 dark:stroke-emerald-400"
        strokeWidth="1.5"
      />
      {path.map((v, i) => (
        <circle key={i} cx={scaleX(v)} cy={20 + i * 8} r="2.5" className="fill-emerald-600 dark:fill-emerald-400" />
      ))}
      <text x="20" y="16" className="fill-neutral-400 text-[10px]">head start: 50 → sweeps toward 0, reverses, continues to 199 (SCAN)</text>
    </svg>
  );
}

function ThreadModelDiagram({ variant }: { variant: "many-to-one" | "one-to-one" | "many-to-many" }) {
  const userCount = 3;
  const kernelCount = variant === "many-to-one" ? 1 : variant === "one-to-one" ? 3 : 2;
  return (
    <div className="flex flex-col items-center gap-6 py-2">
      <div className="flex gap-4">
        {Array.from({ length: userCount }).map((_, i) => (
          <div key={i} className="w-12 h-8 rounded border border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[11px] flex items-center justify-center">UT{i + 1}</div>
        ))}
      </div>
      <svg width="180" height="40" className="overflow-visible">
        {Array.from({ length: userCount }).map((_, i) =>
          Array.from({ length: kernelCount }).map((_, j) => {
            const connect =
              variant === "many-to-one"
                ? j === 0
                : variant === "one-to-one"
                ? i === j
                : true;
            if (!connect) return null;
            const x1 = 20 + i * 70;
            const x2 = 40 + (j * 160) / Math.max(kernelCount - 1, 1);
            return (
              <line
                key={`${i}-${j}`}
                x1={x1}
                y1="0"
                x2={kernelCount === 1 ? 90 : x2}
                y2="40"
                className="stroke-neutral-300 dark:stroke-neutral-600"
                strokeWidth="1"
              />
            );
          })
        )}
      </svg>
      <div className="flex gap-4">
        {Array.from({ length: kernelCount }).map((_, i) => (
          <div key={i} className="w-12 h-8 rounded border border-emerald-600/40 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 text-[11px] flex items-center justify-center">KT{i + 1}</div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   SIDEBAR / TOC (scroll-spy)
============================================================================ */

function Sidebar({ active }: { active: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      {/* mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-emerald-700 dark:bg-emerald-500 text-white flex items-center justify-center shadow-lg"
        aria-label="Open table of contents"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-[#0A0D12] p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span style={monoFont} className="text-xs text-neutral-400">TABLE OF CONTENTS</span>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-neutral-400" /></button>
            </div>
            <TocList active={active} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <aside className="hidden lg:block sticky top-20 self-start w-56 shrink-0 pr-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <p style={monoFont} className="text-[11px] uppercase tracking-widest text-neutral-400 mb-3">Table of Contents</p>
        <TocList active={active} />
      </aside>
    </>
  );
}

function TocList({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-0.5">
      {TOC.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={onNavigate}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
            active === item.id
              ? "bg-emerald-700/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300 font-medium"
              : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200"
          }`}
        >
          <span style={monoFont} className="text-[10px] text-neutral-400 w-9 shrink-0">{item.addr}</span>
          <span className="truncate">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

/* ============================================================================
   HERO — boot-sequence signature moment
============================================================================ */

function BootHero() {
  const lines = [
    "[0.000000] booting kernel...",
    "[0.014201] mounting process table",
    "[0.032044] initializing MMU — logical → physical map ready",
    "[0.048871] scheduler online — 1 ready queue",
    "[0.061532] loading device drivers: disk, net, tty",
    "[0.070008] init: welcome to /category/operating-system",
  ];
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(lines.length);
      return;
    }
    const t = setInterval(() => {
      setVisible((v) => {
        if (v >= lines.length) {
          clearInterval(t);
          return v;
        }
        return v + 1;
      });
    }, 220);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative border-b border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28">
        <div
          style={monoFont}
          className="text-[11px] sm:text-xs text-emerald-700/80 dark:text-emerald-400/80 space-y-1 mb-8 h-[132px] sm:h-32"
          aria-hidden="true"
        >
          {lines.slice(0, visible).map((l, i) => (
            <p key={i} className="opacity-90">{l}</p>
          ))}
          {visible < lines.length && <span className="inline-block w-2 h-3.5 bg-emerald-600 dark:bg-emerald-400 animate-pulse" />}
        </div>

        <Eyebrow addr="0x00">Kernel-level knowledge</Eyebrow>
        <h1
          style={displayFont}
          className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 max-w-3xl"
        >
          Operating Systems, from process to physical memory.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Every program you've ever run only worked because something quieter was
          managing the CPU, the memory, and the disk underneath it. This is that layer -
          explained, diagrammed, and boiled down to cheat sheets you can actually revise from.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#intro"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-neutral-900 text-sm font-medium transition-colors"
          >
            Start reading <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#cheat-sheets"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <Terminal className="w-4 h-4" /> Jump to cheat sheets
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   PAGE
============================================================================ */

export default function OperatingSystemPage() {
  const [active, setActive] = useState("intro");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    TOC.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0A0D12] text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <BootHero />

      <div className="max-w-6xl mx-auto px-6 flex gap-10">
        <Sidebar active={active} />

        <main className="min-w-0 flex-1 py-14 space-y-24">
          {/* ===================== 0x00 INTRO ===================== */}
          <section id="intro" className="scroll-mt-24">
            <SectionHeading
              addr="0x00"
              eyebrow="Foundations"
              title="What is an Operating System, really?"
              subtitle="Strip away the desktop icons and it comes down to one job: turn one pile of shared hardware into something many programs can use safely, fairly, and at the same time."
            />

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <DefBox term="Operating System (OS):">
                system software that sits between hardware and applications, managing the
                CPU, memory, storage, and I/O devices, and exposing them to programs through
                a consistent set of services (system calls).
              </DefBox>
              <ProTip>
                Think of the OS as a <em>resource manager</em> and a <em>referee</em> at the same
                time — it hands out CPU time slices, memory pages, and disk blocks, and it
                stops one program from trampling another's.
              </ProTip>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 style={displayFont} className="font-semibold text-lg mb-2">Why we use one</h3>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>• Lets many programs share one CPU, one RAM, one disk — without each one needing to know about the others.</li>
                  <li>• Provides a stable, hardware-independent API (system calls) so software isn't rewritten per device.</li>
                  <li>• Enforces protection: one process's bug or malice can't (normally) corrupt another's memory.</li>
                </ul>
              </div>
              <div>
                <h3 style={displayFont} className="font-semibold text-lg mb-2">Why we need one</h3>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>• Hardware is dumb and single-minded — a CPU just executes instructions, it has no idea what "fair" means.</li>
                  <li>• Without an arbiter, two programs writing to the same memory address is a crash waiting to happen.</li>
                  <li>• Users need files, windows, and networking to *feel* simple — the OS absorbs the real complexity.</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-rose-500/25 bg-rose-500/5 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Skull className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <h3 style={displayFont} className="font-semibold text-rose-700 dark:text-rose-300">What if it disappeared?</h3>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Take the OS away and you're left with bare-metal hardware and no shared
                rules. Every application would need to hand-manage the CPU timeline itself,
                talk to disk controllers in raw hardware commands, and trust every other
                running program not to overwrite its memory. There'd be no multitasking,
                no file system abstraction, no plug-and-play devices — you'd be back to
                one program, one machine, one operator, like the earliest batch-processing
                computers of the 1950s.
              </p>
            </div>
          </section>

          {/* ===================== 0x01 USE CASES ===================== */}
          <section id="use-cases" className="scroll-mt-24">
            <SectionHeading
              addr="0x01"
              eyebrow="Where it shows up"
              title="Use cases"
              subtitle="The same core ideas — scheduling, memory isolation, IPC — show up everywhere, just tuned differently."
            />
            <CardGrid items={useCases} />
          </section>

          {/* ===================== 0x02 OS STRUCTURE ===================== */}
          <section id="os-structure" className="scroll-mt-24">
            <SectionHeading
              addr="0x02"
              eyebrow="Architecture"
              title="Operating System structure"
              subtitle="How the OS's own internals are organized changes how fast, safe, and maintainable it is."
            />
            <div className="grid sm:grid-cols-2 gap-4">
              {osStructures.map((s) => (
                <div key={s.name} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12161F] p-5">
                  <h3 style={displayFont} className="font-semibold mb-1.5">{s.name}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 leading-relaxed">{s.body}</p>
                  <p style={monoFont} className="text-[11px] text-neutral-400">e.g. {s.eg}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== 0x03 PROCESS MANAGEMENT ===================== */}
          <section id="process-management" className="scroll-mt-24">
            <SectionHeading
              addr="0x03"
              eyebrow="The unit of work"
              title="Process management"
              subtitle="A process is a program in execution — its code plus its own private stack, heap, data, and CPU register state."
            />
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <DefBox term="Process Control Block (PCB):">
                the kernel's record for a process — PID, program counter, CPU registers,
                scheduling info, memory limits, and open file list. It's what makes a
                context switch possible.
              </DefBox>
              <DefBox term="Context switch:">
                saving the PCB of the running process and loading the PCB of the next one,
                so the CPU can jump between processes and still resume each exactly where
                it left off.
              </DefBox>
            </div>
            <DiagramFrame label="Process state transitions">
              <ProcessStateDiagram />
            </DiagramFrame>
          </section>

          {/* ===================== 0x04 CPU SCHEDULING ===================== */}
          <section id="cpu-scheduling" className="scroll-mt-24">
            <SectionHeading
              addr="0x04"
              eyebrow="Who runs next"
              title="CPU scheduling"
              subtitle="The scheduler decides which ready process gets the CPU next — the policy it uses trades off fairness, throughput, and responsiveness."
            />
            <DataTable
              columns={["Algorithm", "Preemptive?", "Starvation risk", "Convoy effect", "Best for"]}
              rows={schedulingAlgos.map((a) => [a.name, a.preemptive, a.starvation, a.convoy, a.bestFor])}
            />
            <div className="mt-4">
              <ProTip>
                <span style={monoFont}>Turnaround = Completion − Arrival. Waiting = Turnaround − Burst.</span> Get
                comfortable with a Gantt chart by hand for FCFS/SJF/RR — almost every exam question reduces to this.
              </ProTip>
            </div>
          </section>

          {/* ===================== 0x05 SYNCHRONIZATION ===================== */}
          <section id="synchronization" className="scroll-mt-24">
            <SectionHeading
              addr="0x05"
              eyebrow="Sharing safely"
              title="Process synchronization"
              subtitle="When multiple processes/threads touch shared data, uncoordinated access causes race conditions — synchronization is how we stop that."
            />
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <DefBox term="Critical section:">
                the part of code where a process accesses shared resources. A valid
                solution needs mutual exclusion, progress, and bounded waiting.
              </DefBox>
              <DefBox term="Race condition:">
                the outcome of concurrent execution depends on the exact timing/order of
                operations — usually a sign a critical section wasn't protected.
              </DefBox>
            </div>
            <DataTable columns={["Primitive", "How it works", "Typical use"]} rows={syncPrimitives.map((p) => [p.name, p.scope, p.use])} />
            <div className="mt-6">
              <h3 style={displayFont} className="font-semibold text-lg mb-3">Classic synchronization problems</h3>
              <Accordion items={classicProblems.map((p) => ({ title: p.name, body: p.gist }))} />
            </div>
          </section>

          {/* ===================== 0x06 DEADLOCKS ===================== */}
          <section id="deadlocks" className="scroll-mt-24">
            <SectionHeading
              addr="0x06"
              eyebrow="When everyone waits forever"
              title="Deadlocks"
              subtitle="A deadlock is a set of processes each waiting for a resource held by another in the set — none of them can ever proceed."
            />
            <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
              <DiagramFrame label="Resource Allocation Graph — a cycle means deadlock (single-instance resources)">
                <DeadlockGraph />
              </DiagramFrame>
              <div>
                <h3 style={displayFont} className="font-semibold text-lg mb-3">4 necessary conditions</h3>
                <div className="space-y-3">
                  {deadlockConditions.map((c, i) => (
                    <div key={c.name} className="flex gap-3">
                      <span style={monoFont} className="text-xs text-rose-500 mt-0.5">{i + 1}</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400"><span className="font-medium text-neutral-800 dark:text-neutral-200">{c.name}:</span> {c.body}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-neutral-400 mt-3">All four must hold simultaneously for a deadlock to be possible.</p>
              </div>
            </div>
            <h3 style={displayFont} className="font-semibold text-lg mb-3">Handling strategies</h3>
            <DataTable columns={["Strategy", "Approach"]} rows={deadlockHandling.map((d) => [d.name, d.body])} />
            <div className="mt-4">
              <ProTip tone="rust">
                Banker's Algorithm (avoidance) checks, before granting a request, whether the
                system stays in a <em>safe state</em> — a state with at least one order in which
                every process could still finish. If no such order exists, the request is delayed.
              </ProTip>
            </div>
          </section>

          {/* ===================== 0x07 IPC ===================== */}
          <section id="ipc" className="scroll-mt-24">
            <SectionHeading
              addr="0x07"
              eyebrow="Talking across boundaries"
              title="Inter-process communication (IPC)"
              subtitle="Processes have separate address spaces by design — IPC is the sanctioned way for them to exchange data anyway."
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12161F] p-5">
                <h3 style={displayFont} className="font-semibold mb-1.5">Shared Memory</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  The OS maps the same physical memory region into both processes' address
                  spaces. Fast (no kernel involved after setup), but the processes must
                  synchronize access themselves.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12161F] p-5">
                <h3 style={displayFont} className="font-semibold mb-1.5">Message Passing</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Processes exchange data via <span style={monoFont} className="text-xs">send()</span>/
                  <span style={monoFont} className="text-xs">receive()</span> through the kernel — pipes,
                  message queues, sockets. Simpler to get right, slower than shared memory.
                </p>
              </div>
            </div>
          </section>

          {/* ===================== 0x08 MULTITHREADING ===================== */}
          <section id="multithreading" className="scroll-mt-24">
            <SectionHeading
              addr="0x08"
              eyebrow="Concurrency inside a process"
              title="Multithreading models"
              subtitle="Threads are lightweight processes that share an address space. How user threads map onto kernel threads defines the model."
            />
            <div className="grid sm:grid-cols-3 gap-4">
              {threadingModels.map((m, i) => (
                <div key={m.name} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12161F] p-5">
                  <h3 style={displayFont} className="font-semibold mb-2 text-center">{m.name}</h3>
                  <ThreadModelDiagram variant={(["many-to-one", "one-to-one", "many-to-many"] as const)[i]} />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3 leading-relaxed">{m.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== 0x09 MEMORY MANAGEMENT ===================== */}
          <section id="memory-management" className="scroll-mt-24">
            <SectionHeading
              addr="0x09"
              eyebrow="Where things live"
              title="Memory management, logical vs. physical address space"
              subtitle="A running program only ever sees a logical address — the MMU translates it to a physical one at run time."
            />
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <DefBox term="Logical address:">
                generated by the CPU during a program's execution; also called a virtual
                address. It's what the program itself sees and uses.
              </DefBox>
              <DefBox term="Physical address:">
                the actual location in RAM. The Memory Management Unit (MMU) maps every
                logical address to one, transparently to the program.
              </DefBox>
            </div>
            <DiagramFrame label="Logical → physical address translation">
              <AddressTranslationDiagram />
            </DiagramFrame>
          </section>

          {/* ===================== 0x0A CONTIGUOUS ALLOCATION ===================== */}
          <section id="contiguous-allocation" className="scroll-mt-24">
            <SectionHeading
              addr="0x0A"
              eyebrow="One block per process"
              title="Contiguous memory allocation"
              subtitle="Each process gets one unbroken block of memory. Simple to address, but memory fragments over time."
            />
            <DataTable
              columns={["Strategy", "Rule", "Trade-off"]}
              rows={[
                ["First Fit", "Allocate the first hole big enough", "Fast, but can leave lots of tiny gaps near the front"],
                ["Best Fit", "Allocate the smallest hole that still fits", "Less wasted space per hole, but slow and causes tiny unusable slivers"],
                ["Worst Fit", "Allocate the largest available hole", "Leaves a bigger, more reusable leftover hole"],
              ]}
            />
            <div className="mt-4">
              <ProTip>
                External fragmentation (holes scattered between allocations) is the core
                weakness here — it's the reason paging exists.
              </ProTip>
            </div>
          </section>

          {/* ===================== 0x0B PAGING ===================== */}
          <section id="paging" className="scroll-mt-24">
            <SectionHeading
              addr="0x0B"
              eyebrow="Fixed-size chunks"
              title="Paging"
              subtitle="Logical memory is split into fixed-size pages, physical memory into same-size frames — any page can live in any frame, killing external fragmentation."
            />
            <DiagramFrame label="Page-table based address translation">
              <PagingDiagram />
            </DiagramFrame>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <DefBox term="TLB (Translation Lookaside Buffer):">
                a small, fast cache of recent page-table lookups — avoids hitting main
                memory twice (once for the page table, once for data) on every access.
              </DefBox>
              <DefBox term="Internal fragmentation:">
                the wasted space inside the last page of a process, when its size isn't an
                exact multiple of the page size. Paging trades external for internal fragmentation.
              </DefBox>
            </div>
          </section>

          {/* ===================== 0x0C SEGMENTATION ===================== */}
          <section id="segmentation" className="scroll-mt-24">
            <SectionHeading
              addr="0x0C"
              eyebrow="Meaning-based chunks"
              title="Segmentation"
              subtitle="Memory is divided by logical unit — code, stack, heap, data — each segment sized to what it actually needs, not a fixed page size."
            />
            <DiagramFrame label="Segment table + variable-size memory regions">
              <SegmentationDiagram />
            </DiagramFrame>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
              Segmentation matches how programmers think (functions, arrays, the stack) but
              re-introduces external fragmentation — which is why most real systems combine
              it with paging (segmented paging).
            </p>
          </section>

          {/* ===================== 0x0D SWAPPING ===================== */}
          <section id="swapping" className="scroll-mt-24">
            <SectionHeading
              addr="0x0D"
              eyebrow="Overflow valve"
              title="Swapping"
              subtitle="When physical memory is oversubscribed, the OS temporarily moves an idle process (or its pages) out to disk to free RAM for someone more active."
            />
            <div className="flex flex-wrap items-center gap-3">
              {["Process in RAM", "Swap out → Disk", "…later…", "Swap in ← Disk", "Process in RAM"].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-sm text-neutral-700 dark:text-neutral-300">{s}</div>
                  {i < 4 && <ArrowRightLeft className="w-4 h-4 text-neutral-400" />}
                </div>
              ))}
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-5">
              Modern OSes mostly swap out individual <em>pages</em> rather than whole
              processes — this is the mechanism behind virtual memory letting you "use"
              more RAM than you physically have.
            </p>
          </section>

          {/* ===================== 0x0E STORAGE & DISK ===================== */}
          <section id="storage-disk" className="scroll-mt-24">
            <SectionHeading
              addr="0x0E"
              eyebrow="Beyond RAM"
              title="Storage management & disk structure"
              subtitle="Disks are addressed as a huge array of logical blocks; the OS decides in what order to service pending requests to minimize costly seek time."
            />
            <DiagramFrame label="Disk-arm movement under SCAN scheduling">
              <DiskArmDiagram />
            </DiagramFrame>
            <div className="mt-6">
              <DataTable columns={["Algorithm", "Sweep pattern", "Note"]} rows={diskAlgos.map((d) => [d.name, d.pattern, d.note])} />
            </div>
          </section>

          {/* ===================== 0x0F REAL-TIME SYSTEMS ===================== */}
          <section id="real-time" className="scroll-mt-24">
            <SectionHeading
              addr="0x0F"
              eyebrow="When the clock is the spec"
              title="Real-time systems"
              subtitle="Correctness here depends on both the result and the time it arrives in — a perfect answer delivered late can be a failure."
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12161F] p-5">
                <h3 style={displayFont} className="font-semibold mb-1.5">Hard real-time</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Missing a deadline is a system failure, full stop. Airbag controllers,
                  pacemakers, flight-control computers.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12161F] p-5">
                <h3 style={displayFont} className="font-semibold mb-1.5">Soft real-time</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Missing a deadline degrades quality but isn't catastrophic. Video
                  streaming, online gaming, audio playback.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <ProTip>
                Two named scheduling algorithms worth remembering: <strong>Rate Monotonic Scheduling</strong> (fixed
                priority — shorter period ⇒ higher priority) and <strong>Earliest Deadline First</strong> (dynamic
                priority — whoever's deadline is soonest runs next).
              </ProTip>
            </div>
          </section>

          {/* ===================== 0x10 CHEAT SHEETS ===================== */}
          <section id="cheat-sheets" className="scroll-mt-24">
            <SectionHeading
              addr="0x10"
              eyebrow="Quick revision"
              title="Cheat sheets & imp. points"
              subtitle="Formulas, comparisons, and the lines examiners actually look for — skim this the night before."
            />

            <div className="space-y-8">
              <div>
                <h3 style={displayFont} className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <MemoryStick className="w-4 h-4 text-emerald-600" /> Memory formulas
                </h3>
                <DataTable columns={["Quantity", "Formula"]} rows={memoryFormulas.map((f) => [f.label, <span key={f.label} style={monoFont}>{f.formula}</span>])} />
              </div>

              <div>
                <h3 style={displayFont} className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-emerald-600" /> One-line "imp." recall per topic
                </h3>
                <Accordion
                  items={[
                    { title: "Process Management", body: "PCB holds everything needed to pause & resume a process; context switch is pure overhead — it does no useful work itself." },
                    { title: "CPU Scheduling", body: "Preemptive scheduling needs synchronization primitives; non-preemptive doesn't (a process keeps the CPU until it's done or blocks)." },
                    { title: "Synchronization", body: "A valid critical-section solution must guarantee mutual exclusion + progress + bounded waiting — memorize all three, not just the first." },
                    { title: "Deadlocks", body: "Breaking any single one of the 4 necessary conditions is enough to prevent deadlock — you don't need to break all four." },
                    { title: "IPC", body: "Shared memory = fast but you synchronize; message passing = slower but the kernel enforces the discipline for you." },
                    { title: "Multithreading", body: "One-to-one gives real parallelism per thread but is the heaviest to create; many-to-one is cheapest but one blocking syscall stalls every thread." },
                    { title: "Memory Management", body: "Logical address space can be, and usually is, larger than physical — that gap is exactly what virtual memory covers." },
                    { title: "Contiguous Allocation", body: "External fragmentation only happens *between* allocations — compaction (defragmenting) fixes it but costs CPU time to relocate processes." },
                    { title: "Paging", body: "Page size is always a power of 2 so the logical address split into (page #, offset) is just a bit-shift, not a division." },
                    { title: "Segmentation", body: "Segments map to how a programmer thinks about a program (functions/arrays); pages map to how hardware thinks about memory (fixed blocks)." },
                    { title: "Swapping", body: "Swap time is dominated by transfer time, which is proportional to the amount of memory being swapped, not the number of processes." },
                    { title: "Disk Scheduling", body: "SSTF minimizes seek time locally but can starve requests far from the head; SCAN/C-SCAN trade a bit of speed for guaranteed fairness." },
                    { title: "Real-Time Systems", body: "\"Real-time\" is about deadlines, not speed — a real-time system can be slower than a general one, as long as it's *predictably* on time." },
                  ]}
                />
              </div>

              <div>
                <h3 style={displayFont} className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" /> Most-confused pairs
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { a: "Process", b: "Thread", note: "A process owns memory/resources; a thread is a schedulable path of execution inside one." },
                    { a: "Paging", b: "Segmentation", note: "Paging = fixed-size, invisible to programmer. Segmentation = variable-size, matches program structure." },
                    { a: "Mutex", b: "Semaphore", note: "Mutex has ownership (only the locker unlocks it). A semaphore is just a counter anyone can signal." },
                    { a: "Deadlock", b: "Starvation", note: "Deadlock: nobody proceeds, ever. Starvation: someone eventually proceeds, just not this someone, for a long time." },
                    { a: "Multiprogramming", b: "Multitasking", note: "Multiprogramming keeps the CPU busy across jobs; multitasking specifically time-slices for interactive responsiveness." },
                    { a: "Logical Address", b: "Physical Address", note: "Logical = what the CPU/program generates. Physical = what actually appears on the memory bus." },
                  ].map((p) => (
                    <div key={p.a} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12161F] p-4">
                      <p style={monoFont} className="text-xs mb-1">
                        <span className="text-blue-700 dark:text-blue-300">{p.a}</span>
                        <span className="text-neutral-400"> vs </span>
                        <span className="text-emerald-700 dark:text-emerald-300">{p.b}</span>
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{p.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <footer className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 text-sm text-neutral-400">
            <BookOpen className="w-4 h-4" />
            <span>Keep this page bookmarked — it's built to be revised, not just read once.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}