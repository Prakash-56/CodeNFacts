"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Zap,
  Boxes,
  Grid3x3,
  Shuffle,
  Sigma,
  Calculator,
  Dices,
  BarChart3,
  Download,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  Copy,
  Check,
  Terminal,
  Braces,
  GitBranch,
  Rows3,
  Lightbulb,
  ListChecks,
  ScrollText,
  PartyPopper,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Motion variants (matches CodeNFacts fadeUp convention)             */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: "easeOut" as const },
  }),
};

/* ------------------------------------------------------------------ */
/*  Section registry (sidebar + anchors)                               */
/* ------------------------------------------------------------------ */

type SectionMeta = { id: string; label: string; icon: React.ElementType };

const SECTIONS: SectionMeta[] = [
  { id: "intro", label: "What is NumPy", icon: BookOpen },
  { id: "why", label: "Why NumPy is Used", icon: Zap },
  { id: "install", label: "Install & Import", icon: Terminal },
  { id: "dtypes", label: "ndarray & Data Types", icon: Braces },
  { id: "creation", label: "Array Creation", icon: Boxes },
  { id: "attributes", label: "Array Attributes", icon: ListChecks },
  { id: "indexing", label: "Indexing & Slicing", icon: Grid3x3 },
  { id: "reshape", label: "Reshape, Stack & Split", icon: Rows3 },
  { id: "broadcasting", label: "Broadcasting", icon: Shuffle },
  { id: "ufuncs", label: "Vectorization & Ufuncs", icon: GitBranch },
  { id: "formulas", label: "Math & Stats Formulas", icon: Sigma },
  { id: "linalg", label: "Linear Algebra", icon: Calculator },
  { id: "random", label: "Random Module", icon: Dices },
  { id: "aggregation", label: "Aggregation & Axis", icon: BarChart3 },
  { id: "diagrams", label: "Diagrams & Sketches", icon: Layers },
  { id: "cheatsheet", label: "Cheat Sheet", icon: ScrollText },
  { id: "imp", label: "Important Points", icon: Lightbulb },
];

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */

function TerminalChrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-t-xl border border-b-0 border-black/10 dark:border-white/10 bg-[#f0f1f3] dark:bg-[#0d1117]">
      <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
      <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
      <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
      <span className="ml-3 text-xs font-mono text-black/50 dark:text-white/40 truncate">
        {title}
      </span>
    </div>
  );
}

function CodeBlock({ code, title = "example.py" }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-[#f0f1f3] dark:bg-[#0d1117] border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-[11px] font-mono text-black/50 dark:text-white/40">
            {title}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-md text-black/60 dark:text-white/50 hover:text-amber-600 dark:hover:text-emerald-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed font-mono bg-white dark:bg-[#0a0e14] text-[#1c2128] dark:text-[#c9d1d9]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Section({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="scroll-mt-24 mb-14"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-amber-100 dark:bg-emerald-500/10 border border-amber-200 dark:border-emerald-500/20">
          <Icon className="w-5 h-5 text-amber-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0a0e14] dark:text-[#e6edf3]">
          {title}
        </h2>
      </div>
      <div className="pl-0 sm:pl-[52px] space-y-4 text-[#3a3f47] dark:text-[#9da7b3] text-[15px] leading-relaxed">
        {children}
      </div>
    </motion.section>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117] p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function FormulaCard({
  name,
  formula,
  desc,
}: {
  name: string;
  formula: string;
  desc: string;
}) {
  return (
    <Card className="flex flex-col gap-2">
      <span className="text-xs font-mono uppercase tracking-wide text-amber-600 dark:text-emerald-400">
        {name}
      </span>
      <span className="font-mono text-base sm:text-lg text-[#0a0e14] dark:text-[#e6edf3] break-words">
        {formula}
      </span>
      <span className="text-sm text-[#3a3f47] dark:text-[#9da7b3]">{desc}</span>
    </Card>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-mono bg-amber-50 dark:bg-emerald-500/10 text-amber-700 dark:text-emerald-400 border border-amber-200 dark:border-emerald-500/20">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline SVG diagrams                                                 */
/* ------------------------------------------------------------------ */

function AxisDiagram() {
  return (
    <svg viewBox="0 0 420 220" className="w-full h-auto max-w-md mx-auto">
      <text x="10" y="20" className="fill-current text-[13px] font-mono" fill="currentColor">
        2D array — shape (3, 4)
      </text>
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={40 + c * 60}
            y={40 + r * 50}
            width="52"
            height="42"
            rx="6"
            className="fill-amber-50 dark:fill-emerald-500/10 stroke-amber-400 dark:stroke-emerald-500/40"
            strokeWidth="1.5"
          />
        ))
      )}
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <text
            key={`t-${r}-${c}`}
            x={66 + c * 60}
            y={66 + r * 50}
            textAnchor="middle"
            className="fill-current text-[12px] font-mono"
            fill="currentColor"
          >
            {r * 4 + c}
          </text>
        ))
      )}
      {/* axis=0 arrow (down the rows) */}
      <line x1="20" y1="45" x2="20" y2="175" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowAmber)" />
      <text x="2" y="115" className="fill-amber-600 dark:fill-amber-400 text-[11px] font-mono" transform="rotate(-90 2 115)">
        axis=0
      </text>
      {/* axis=1 arrow (across columns) */}
      <line x1="40" y1="200" x2="290" y2="200" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
      <text x="140" y="216" className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-mono">
        axis=1
      </text>
      <defs>
        <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" />
        </marker>
        <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#10b981" />
        </marker>
      </defs>
    </svg>
  );
}

function BroadcastDiagram() {
  return (
    <svg viewBox="0 0 460 200" className="w-full h-auto max-w-lg mx-auto">
      <text x="10" y="20" className="text-[12px] font-mono" fill="currentColor">
        (3, 4) + (4,) → broadcast (4,) across every row
      </text>
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`a-${r}-${c}`}
            x={20 + c * 44}
            y={36 + r * 40}
            width="38"
            height="32"
            rx="5"
            className="fill-amber-50 dark:fill-emerald-500/10 stroke-amber-400 dark:stroke-emerald-500/40"
            strokeWidth="1.3"
          />
        ))
      )}
      <text x="200" y="120" textAnchor="middle" className="text-[16px] font-mono" fill="currentColor">
        +
      </text>
      {[0, 1, 2, 3].map((c) => (
        <rect
          key={`b-${c}`}
          x={228 + c * 44}
          y={100 + 0 * 40}
          width="38"
          height="32"
          rx="5"
          className="fill-emerald-50 dark:fill-amber-500/10 stroke-emerald-400 dark:stroke-amber-500/40"
          strokeWidth="1.3"
        />
      ))}
      <text x="228" y="150" className="text-[11px] font-mono" fill="currentColor">
        shape (4,) stretched virtually — no data copied
      </text>
      {[0, 1, 2].map((r) => (
        <line
          key={`ln-${r}`}
          x1="410"
          y1={52 + r * 40}
          x2="440"
          y2="116"
          stroke="#10b981"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.6"
        />
      ))}
    </svg>
  );
}

function MemoryLayoutDiagram() {
  const order = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 380 170" className="w-full h-auto max-w-md mx-auto">
      <text x="0" y="16" className="text-[12px] font-mono" fill="currentColor">
        Row-major (C order) — default in NumPy
      </text>
      {[0, 1].map((r) =>
        [0, 1, 2].map((c) => {
          const idx = r * 3 + c;
          return (
            <g key={`m-${r}-${c}`}>
              <rect
                x={20 + c * 60}
                y={30 + r * 50}
                width="52"
                height="42"
                rx="6"
                className="fill-amber-50 dark:fill-emerald-500/10 stroke-amber-400 dark:stroke-emerald-500/40"
                strokeWidth="1.5"
              />
              <text
                x={46 + c * 60}
                y={56 + r * 50}
                textAnchor="middle"
                className="text-[12px] font-mono"
                fill="currentColor"
              >
                {idx}
              </text>
            </g>
          );
        })
      )}
      <text x="20" y="150" className="text-[11px] font-mono" fill="currentColor">
        memory: [{order.join(", ")}] — travels left→right, then next row
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Downloadable notes (plain-text / markdown content)                  */
/* ------------------------------------------------------------------ */

const NOTES_MARKDOWN = `# NumPy — Complete Notes (CodeNFacts)

## 1. What is NumPy
NumPy (Numerical Python) is Python's core library for numerical and scientific
computing. Its central object is the "ndarray" — an N-dimensional, fixed-type,
contiguous array that supports fast, vectorized math.

## 2. Why NumPy is Used
- Python lists are slow for numeric work (they store pointers to objects).
- NumPy arrays store raw, fixed-type data contiguously in memory → CPU cache
  friendly and vectorized with SIMD.
- Element-wise operations run in compiled C loops, not Python loops
  (10x-100x faster than pure Python for numeric tasks).
- It's the base data structure for Pandas, Scikit-learn, TensorFlow, PyTorch,
  Matplotlib, and SciPy.
- Provides broadcasting, linear algebra, Fourier transforms, random sampling,
  and aggregate statistics out of the box.

## 3. Install & Import
    pip install numpy
    import numpy as np

## 4. ndarray & Data Types (dtypes)
Numeric:  int8/16/32/64, uint8/16/32/64, float16/32/64, complex64/128
Other:    bool, object, str_ (unicode)
Check / set dtype:
    arr.dtype
    np.array([1, 2, 3], dtype=np.float32)
    arr.astype(np.int64)

## 5. Array Creation
    np.array([1, 2, 3])
    np.zeros((2, 3))
    np.ones((3, 3))
    np.full((2, 2), 7)
    np.eye(3)                 # identity matrix
    np.arange(0, 10, 2)       # like range() but returns an array
    np.linspace(0, 1, 5)      # 5 evenly spaced numbers between 0 and 1
    np.random.rand(2, 2)      # uniform [0,1)

## 6. Array Attributes
    arr.shape      -> dimensions, e.g. (3, 4)
    arr.ndim       -> number of axes
    arr.size       -> total elements
    arr.dtype      -> element type
    arr.itemsize   -> bytes per element
    arr.nbytes     -> total bytes

## 7. Indexing & Slicing
    arr[0]              first element / row
    arr[-1]              last element / row
    arr[1:3]             slice (stop excluded)
    arr[:, 0]            first column (2D)
    arr[arr > 5]         boolean mask indexing
    arr[[0, 2]]          fancy indexing (select rows 0 and 2)

## 8. Reshape, Stack & Split
    arr.reshape(2, 3)
    arr.flatten() / arr.ravel()
    np.vstack([a, b])     stack rows
    np.hstack([a, b])     stack columns
    np.concatenate([a, b], axis=0)
    np.split(arr, 3)

## 9. Broadcasting
Rules (compare shapes from the right):
  1. Equal dimensions match.
  2. A dimension of size 1 stretches to match the other.
  3. Missing dimensions are padded with 1 on the left.
Example: shape (3,4) + shape (4,) → the (4,) row is applied to every row,
without physically copying data.

## 10. Vectorization & Ufuncs
Ufuncs are element-wise compiled functions: np.add, np.subtract, np.multiply,
np.divide, np.power, np.sqrt, np.exp, np.log, np.sin, np.abs, np.maximum, ...
Vectorized code avoids explicit Python for-loops:
    # slow
    out = [x**2 for x in data]
    # fast
    out = data ** 2

## 11. Math & Statistics Formulas
Mean:            x̄ = (Σxᵢ) / n
Variance:        σ² = (Σ(xᵢ - x̄)²) / n
Std deviation:   σ = √(σ²)
Z-score:         z = (x - μ) / σ
Min-Max scale:   x' = (x - min) / (max - min)
Dot product:     a·b = Σ aᵢbᵢ
Matrix mult:     C = A @ B, Cᵢⱼ = Σ Aᵢₖ Bₖⱼ
L1 norm:         ||v||₁ = Σ|vᵢ|
L2 norm:         ||v||₂ = √(Σ vᵢ²)
Determinant(2x2):|A| = ad - bc  for [[a,b],[c,d]]
Correlation:     r = cov(x,y) / (σx · σy)
NumPy equivalents:
    np.mean(a), np.var(a), np.std(a), np.median(a)
    np.dot(a, b) or a @ b
    np.linalg.norm(v)
    np.linalg.det(A)
    np.corrcoef(x, y)

## 12. Linear Algebra (np.linalg)
    np.linalg.inv(A)      inverse
    np.linalg.det(A)      determinant
    np.linalg.eig(A)      eigenvalues & eigenvectors
    np.linalg.solve(A, b) solve Ax = b
    np.transpose(A) / A.T transpose
    np.trace(A)           sum of diagonal

## 13. Random Module (np.random)
    np.random.seed(42)          reproducibility
    np.random.rand(3)           uniform [0,1)
    np.random.randn(3)          standard normal
    np.random.randint(0, 10, 5) random ints
    np.random.choice(arr, 3)    random sample
    np.random.shuffle(arr)      in-place shuffle

## 14. Aggregation & Axis
    arr.sum(), arr.sum(axis=0), arr.sum(axis=1)
    arr.min() / arr.max() / arr.argmin() / arr.argmax()
    arr.cumsum() / arr.cumprod()
axis=0 collapses rows (down each column); axis=1 collapses columns
(across each row).

## 15. Cheat Sheet (quick reference)
Creation:     np.array, np.zeros, np.ones, np.arange, np.linspace, np.eye
Inspect:      .shape .ndim .size .dtype
Reshape:      .reshape .flatten .ravel .T
Combine:      np.concatenate np.vstack np.hstack np.stack
Math:         + - * / ** np.sqrt np.exp np.log
Stats:        np.mean np.median np.std np.var np.percentile
Linear alg:   np.dot A @ B np.linalg.inv np.linalg.det np.linalg.eig
Random:       np.random.rand np.random.randn np.random.randint
Compare:      np.where np.any np.all np.isin

## 16. Important Points (interview-style)
- ndarray requires a single dtype; Python lists can mix types.
- Broadcasting avoids manual loops and extra memory copies.
- Views vs copies: slicing returns a view (shares memory); fancy indexing
  and boolean indexing return a copy.
- axis=0 = down rows (per column), axis=1 = across columns (per row).
- np.dot vs np.multiply: dot is matrix/inner product, multiply is
  element-wise.
- Use np.copy() when you need an independent array, otherwise edits to a
  view mutate the original.
- NaN handling: use np.nanmean, np.nanstd, etc. to ignore NaNs safely.

— Notes generated from CodeNFacts • NumPy learning module
`;

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function NumpyPage() {
  const [showThanks, setShowThanks] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([NOTES_MARKDOWN], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CodeNFacts-NumPy-Notes.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 4500);
  };

  const cheatRows = useMemo(
    () => [
      ["Creation", "np.array, np.zeros, np.ones, np.arange, np.linspace, np.eye"],
      ["Inspect", "arr.shape · arr.ndim · arr.size · arr.dtype"],
      ["Reshape", "arr.reshape() · arr.flatten() · arr.ravel() · arr.T"],
      ["Combine", "np.concatenate · np.vstack · np.hstack · np.stack"],
      ["Elementwise", "+  -  *  /  **  np.sqrt  np.exp  np.log"],
      ["Statistics", "np.mean · np.median · np.std · np.var · np.percentile"],
      ["Linear Algebra", "np.dot / @ · np.linalg.inv · np.linalg.det · np.linalg.eig"],
      ["Random", "np.random.rand · np.random.randn · np.random.randint"],
      ["Boolean / Search", "np.where · np.any · np.all · np.isin"],
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#0a0e14] text-[#0a0e14] dark:text-[#e6edf3] transition-colors duration-300">
      {/* ---------------------------------------------------------- */}
      {/* Hero */}
      {/* ---------------------------------------------------------- */}
      <div className="border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Pill>NumPy</Pill>
              <Pill>Python · Data Science</Pill>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              NumPy -{" "}
              <span className="text-amber-600 dark:text-emerald-400">the array engine</span>{" "}
              behind Python's numeric stack
            </h1>
            <p className="text-base sm:text-lg text-[#3a3f47] dark:text-[#9da7b3] leading-relaxed">
              A complete, example-driven reference: what NumPy is, why it exists,
              its data types, core formulas, diagrams, a quick cheat sheet, and
              interview-ready notes - all in one place.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-amber-500 hover:bg-amber-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download NumPy Notes
              </button>
              <span className="text-xs text-[#3a3f47] dark:text-[#9da7b3] font-mono">
                .md file · works offline · ~1 min read per section
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Body: sidebar + content */}
      {/* ---------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <nav className="sticky top-6 space-y-1">
            <p className="px-3 mb-2 text-xs font-mono uppercase tracking-wider text-black/40 dark:text-white/30">
              On this page
            </p>
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#3a3f47] dark:text-[#9da7b3] hover:bg-amber-50 dark:hover:bg-emerald-500/10 hover:text-amber-700 dark:hover:text-emerald-400 transition-colors"
              >
                <Icon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                <span className="truncate">{label}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-60" />
              </a>
            ))}
          </nav>
        </aside>

        {/* Mobile section chips */}
        <div className="lg:hidden -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-2 pb-2 w-max">
            {SECTIONS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="whitespace-nowrap text-xs font-mono px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117] text-[#3a3f47] dark:text-[#9da7b3]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="min-w-0">
          <Section id="intro" title="What is NumPy?" icon={BookOpen}>
            <p>
              <strong>NumPy</strong> (Numerical Python) is the foundational library for
              numerical computing in Python. Its core object is the{" "}
              <code className="font-mono text-amber-700 dark:text-emerald-400">ndarray</code> —
              a fixed-type, N-dimensional array stored contiguously in memory. Unlike a
              Python list, every element shares the same data type, which is exactly what
              lets NumPy hand off math to fast, compiled C code instead of the Python
              interpreter.
            </p>
            <p>
              It's the base layer under Pandas, Scikit-learn, TensorFlow, PyTorch, and
              Matplotlib — if you've done any data science or ML in Python, you've used
              NumPy whether you called it directly or not.
            </p>
            <CodeBlock
              title="hello_numpy.py"
              code={`import numpy as np\n\narr = np.array([1, 2, 3, 4])\nprint(arr, type(arr), arr.dtype)\n# [1 2 3 4] <class 'numpy.ndarray'> int64`}
            />
          </Section>

          <Section id="why" title="Why NumPy is Used (and Needed)" icon={Zap}>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Speed:</strong> vectorized C loops replace slow Python{" "}
                <code className="font-mono">for</code> loops — often 10–100x faster.
              </li>
              <li>
                <strong>Memory efficiency:</strong> a fixed dtype means compact, contiguous
                storage instead of an array of pointers to Python objects.
              </li>
              <li>
                <strong>Broadcasting:</strong> apply operations across differently-shaped
                arrays without manually looping or copying data.
              </li>
              <li>
                <strong>Ecosystem:</strong> Pandas DataFrames, Scikit-learn models, and deep
                learning tensors are all built on or interoperate with ndarray.
              </li>
              <li>
                <strong>Batteries included:</strong> linear algebra, Fourier transforms,
                random sampling, and statistics ship in the standard library.
              </li>
            </ul>
            <CodeBlock
              title="speed_comparison.py"
              code={`import numpy as np, time\n\nn = 1_000_000\npy_list = list(range(n))\nnp_arr = np.arange(n)\n\nt0 = time.time()\npy_result = [x * 2 for x in py_list]\nprint("pure python:", time.time() - t0)\n\nt0 = time.time()\nnp_result = np_arr * 2\nprint("numpy:", time.time() - t0)  # noticeably faster`}
            />
          </Section>

          <Section id="install" title="Install & Import" icon={Terminal}>
            <p>NumPy is a third-party package — install it once per environment:</p>
            <CodeBlock title="terminal" code={`pip install numpy`} />
            <p>Import convention used everywhere (blogs, docs, this page):</p>
            <CodeBlock title="import.py" code={`import numpy as np`} />
          </Section>

          <Section id="dtypes" title="ndarray & Data Types (dtypes)" icon={Braces}>
            <p>
              Every ndarray has one <code className="font-mono">dtype</code> shared by all
              elements. Common families:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <Card>
                <p className="font-semibold mb-1 text-sm">Integers</p>
                <p className="text-sm font-mono">int8, int16, int32, int64, uint8…uint64</p>
              </Card>
              <Card>
                <p className="font-semibold mb-1 text-sm">Floats</p>
                <p className="text-sm font-mono">float16, float32, float64 (default)</p>
              </Card>
              <Card>
                <p className="font-semibold mb-1 text-sm">Complex</p>
                <p className="text-sm font-mono">complex64, complex128</p>
              </Card>
              <Card>
                <p className="font-semibold mb-1 text-sm">Other</p>
                <p className="text-sm font-mono">bool, object, str_ (unicode)</p>
              </Card>
            </div>
            <CodeBlock
              title="dtypes.py"
              code={`a = np.array([1, 2, 3], dtype=np.float32)\nprint(a.dtype)          # float32\nb = a.astype(np.int64)  # explicit cast\nprint(b.dtype)          # int64`}
            />
          </Section>

          <Section id="creation" title="Array Creation" icon={Boxes}>
            <CodeBlock
              title="creation.py"
              code={`np.array([1, 2, 3])          # from a list\nnp.zeros((2, 3))             # all zeros\nnp.ones((3, 3))              # all ones\nnp.full((2, 2), 7)           # constant-filled\nnp.eye(3)                    # identity matrix\nnp.arange(0, 10, 2)          # like range(), array output\nnp.linspace(0, 1, 5)         # 5 evenly spaced points\nnp.random.rand(2, 2)         # uniform random [0, 1)`}
            />
          </Section>

          <Section id="attributes" title="Array Attributes" icon={ListChecks}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b border-black/10 dark:border-white/10">
                    <th className="py-2 pr-4 font-mono">Attribute</th>
                    <th className="py-2 font-normal">Meaning</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[13px]">
                  {[
                    ["arr.shape", "dimensions, e.g. (3, 4)"],
                    ["arr.ndim", "number of axes"],
                    ["arr.size", "total element count"],
                    ["arr.dtype", "element data type"],
                    ["arr.itemsize", "bytes per element"],
                    ["arr.nbytes", "total memory in bytes"],
                  ].map(([a, b]) => (
                    <tr key={a} className="border-b border-black/5 dark:border-white/5">
                      <td className="py-2 pr-4 text-amber-700 dark:text-emerald-400">{a}</td>
                      <td className="py-2 font-sans text-[#3a3f47] dark:text-[#9da7b3]">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="indexing" title="Indexing & Slicing" icon={Grid3x3}>
            <CodeBlock
              title="indexing.py"
              code={`arr = np.array([[1, 2, 3, 4],\n                [5, 6, 7, 8],\n                [9, 10, 11, 12]])\n\narr[0]          # first row -> [1 2 3 4]\narr[-1]         # last row  -> [9 10 11 12]\narr[1:3]        # rows 1 and 2 (stop excluded)\narr[:, 0]       # first column -> [1 5 9]\narr[arr > 5]    # boolean mask -> [6 7 8 9 10 11 12]\narr[[0, 2]]     # fancy indexing -> rows 0 and 2`}
            />
            <p className="text-sm">
              <strong>Tip:</strong> basic slicing returns a <em>view</em> (shares memory
              with the original); boolean and fancy indexing return a <em>copy</em>.
            </p>
          </Section>

          <Section id="reshape" title="Reshape, Stack & Split" icon={Rows3}>
            <CodeBlock
              title="reshape.py"
              code={`a = np.arange(6)\na.reshape(2, 3)        # change shape without copying data\na.flatten()            # 1D copy\na.ravel()              # 1D view when possible\n\nnp.vstack([a, a])      # stack as new rows\nnp.hstack([a, a])      # stack side by side\nnp.concatenate([a, a], axis=0)\nnp.split(a, 3)         # split into 3 equal parts`}
            />
          </Section>

          <Section id="broadcasting" title="Broadcasting" icon={Shuffle}>
            <p>NumPy compares shapes from the right and applies these rules:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Equal dimensions match directly.</li>
              <li>A dimension of size 1 stretches to match the other array.</li>
              <li>Missing leading dimensions are treated as size 1.</li>
            </ol>
            <CodeBlock
              title="broadcasting.py"
              code={`a = np.ones((3, 4))     # shape (3, 4)\nb = np.array([1, 2, 3, 4])  # shape (4,)\nresult = a + b            # b is applied to every row\nprint(result.shape)       # (3, 4) — no data was copied`}
            />
          </Section>

          <Section id="ufuncs" title="Vectorization & Universal Functions" icon={GitBranch}>
            <p>
              Ufuncs are element-wise operations implemented in compiled code:{" "}
              <code className="font-mono">np.add, np.subtract, np.multiply, np.divide,
              np.power, np.sqrt, np.exp, np.log, np.sin, np.abs, np.maximum</code> and more.
            </p>
            <CodeBlock
              title="vectorize.py"
              code={`data = np.array([1, 2, 3, 4])\n\n# slow: python loop\nsquares = [x ** 2 for x in data]\n\n# fast: vectorized\nsquares = data ** 2`}
            />
          </Section>

          <Section id="formulas" title="Math & Statistics Formulas" icon={Sigma}>
            <div className="grid sm:grid-cols-2 gap-3">
              <FormulaCard name="Mean" formula="x̄ = (Σxᵢ) / n" desc="np.mean(a)" />
              <FormulaCard name="Variance" formula="σ² = Σ(xᵢ - x̄)² / n" desc="np.var(a)" />
              <FormulaCard name="Std Deviation" formula="σ = √(σ²)" desc="np.std(a)" />
              <FormulaCard name="Z-score" formula="z = (x - μ) / σ" desc="standardization" />
              <FormulaCard name="Min-Max Scale" formula="x' = (x-min)/(max-min)" desc="normalization to [0,1]" />
              <FormulaCard name="Dot Product" formula="a·b = Σ aᵢbᵢ" desc="np.dot(a, b)" />
              <FormulaCard name="Matrix Mult" formula="Cᵢⱼ = Σₖ Aᵢₖ Bₖⱼ" desc="A @ B" />
              <FormulaCard name="L1 Norm" formula="‖v‖₁ = Σ|vᵢ|" desc="np.linalg.norm(v, 1)" />
              <FormulaCard name="L2 Norm" formula="‖v‖₂ = √(Σvᵢ²)" desc="np.linalg.norm(v)" />
              <FormulaCard name="Determinant (2×2)" formula="|A| = ad − bc" desc="np.linalg.det(A)" />
              <FormulaCard name="Correlation" formula="r = cov(x,y) / (σx·σy)" desc="np.corrcoef(x, y)" />
              <FormulaCard name="Median" formula="middle value of sorted x" desc="np.median(a)" />
            </div>
          </Section>

          <Section id="linalg" title="Linear Algebra (np.linalg)" icon={Calculator}>
            <CodeBlock
              title="linalg.py"
              code={`A = np.array([[4, 2], [1, 3]])\n\nnp.linalg.inv(A)       # inverse\nnp.linalg.det(A)       # determinant\nnp.linalg.eig(A)       # eigenvalues & eigenvectors\nnp.linalg.solve(A, b)  # solve A x = b\nA.T                    # transpose\nnp.trace(A)            # sum of diagonal`}
            />
          </Section>

          <Section id="random" title="Random Module (np.random)" icon={Dices}>
            <CodeBlock
              title="random.py"
              code={`np.random.seed(42)            # reproducibility\nnp.random.rand(3)             # uniform [0, 1)\nnp.random.randn(3)            # standard normal (mean 0, std 1)\nnp.random.randint(0, 10, 5)   # random integers\nnp.random.choice(arr, 3)      # random sample\nnp.random.shuffle(arr)        # in-place shuffle`}
            />
          </Section>

          <Section id="aggregation" title="Aggregation & Axis" icon={BarChart3}>
            <CodeBlock
              title="aggregation.py"
              code={`arr = np.array([[1, 2, 3], [4, 5, 6]])\n\narr.sum()          # 21 — total\narr.sum(axis=0)    # [5 7 9]  — collapse rows, per column\narr.sum(axis=1)    # [6 15]   — collapse columns, per row\narr.min(), arr.max()\narr.argmin(), arr.argmax()\narr.cumsum()`}
            />
          </Section>

          <Section id="diagrams" title="Diagrams & Sketches" icon={Layers}>
            <p className="mb-2">
              <strong>Axes of a 2D array</strong> — axis=0 moves down the rows (per
              column), axis=1 moves across the columns (per row):
            </p>
            <Card>
              <AxisDiagram />
            </Card>
            <p className="mt-6 mb-2">
              <strong>Broadcasting a smaller shape across a larger one:</strong>
            </p>
            <Card>
              <BroadcastDiagram />
            </Card>
            <p className="mt-6 mb-2">
              <strong>Memory layout</strong> — NumPy stores arrays row-major (C order)
              by default:
            </p>
            <Card>
              <MemoryLayoutDiagram />
            </Card>
          </Section>

          <Section id="cheatsheet" title="Cheat Sheet" icon={ScrollText}>
            <Card className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {cheatRows.map(([label, val]) => (
                    <tr key={label} className="border-b border-black/5 dark:border-white/5 last:border-0">
                      <td className="py-2 pr-4 font-semibold whitespace-nowrap align-top w-40">
                        {label}
                      </td>
                      <td className="py-2 font-mono text-[13px] text-[#3a3f47] dark:text-[#9da7b3]">
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </Section>

          <Section id="imp" title="Important Points (Interview-Ready)" icon={Lightbulb}>
            <ul className="list-disc pl-5 space-y-2">
              <li>An ndarray requires one shared dtype; Python lists can mix types.</li>
              <li>Broadcasting avoids manual loops and unnecessary memory copies.</li>
              <li>
                Basic slicing → <em>view</em> (shares memory). Boolean / fancy indexing →{" "}
                <em>copy</em>.
              </li>
              <li>axis=0 = down rows (per column); axis=1 = across columns (per row).</li>
              <li>
                <code className="font-mono">np.dot</code> is matrix/inner product;{" "}
                <code className="font-mono">np.multiply</code> (or <code className="font-mono">*</code>) is
                element-wise.
              </li>
              <li>
                Use <code className="font-mono">np.copy()</code> to detach an array from its
                source when you don't want shared-memory side effects.
              </li>
              <li>
                Use <code className="font-mono">np.nanmean</code>, <code className="font-mono">np.nanstd</code>,
                etc. to safely ignore NaN values in real-world, messy data.
              </li>
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-amber-200 dark:border-emerald-500/20 bg-amber-50 dark:bg-emerald-500/10 p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-sm text-[#3a3f47] dark:text-[#9da7b3]">
                  Want these notes on your device? Grab the full markdown file — every
                  section, formula, and cheat sheet from this page.
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-amber-500 hover:bg-amber-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white transition-colors shrink-0 shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download Notes
              </button>
            </div>
          </Section>
        </main>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Thank-you toast */}
      {/* ---------------------------------------------------------- */}
      {showThanks && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border border-amber-200 dark:border-emerald-500/30 bg-white dark:bg-[#0d1117]"
        >
          <PartyPopper className="w-5 h-5 text-amber-600 dark:text-emerald-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#0a0e14] dark:text-[#e6edf3]">
              Thanks for downloading! 🎉
            </span>
            <span className="text-xs text-[#3a3f47] dark:text-[#9da7b3]">
              Your NumPy notes are saved — happy learning!
            </span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-emerald-400 ml-2 shrink-0" />
        </motion.div>
      )}
    </div>
  );
}