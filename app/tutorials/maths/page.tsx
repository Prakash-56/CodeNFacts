"use client";

import { useState } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const whyItMatters = [
  {
    title: "Every algorithm is math wearing a trench coat",
    body: "Search, sort, hash, route, rank — each one is a mathematical statement before it's a function. You can't reason about Big-O without a little bit of algebra and limits.",
  },
  {
    title: "Machine learning is applied linear algebra + calculus",
    body: "Gradient descent is a derivative. A neural network forward-pass is matrix multiplication. Loss landscapes are multivariable functions. Skip the math, and the model stays a black box.",
  },
  {
    title: "Security runs on number theory",
    body: "RSA, Diffie–Hellman, elliptic curves — the internet's locks are built from prime numbers and modular arithmetic invented centuries before computers existed.",
  },
  {
    title: "Graphics, games, and physics engines are geometry in motion",
    body: "Rotations, projections, collision detection, easing curves — all trigonometry and vectors, frame by frame, sixty times a second.",
  },
  {
    title: "Probability is how systems survive uncertainty",
    body: "A/B tests, recommendation systems, fraud detection, load balancing — all decisions made under uncertainty, which is exactly what probability was built to formalize.",
  },
];

const withoutMath = [
  "No GPS — triangulating a position from satellites is trigonometry and relativity-corrected timing.",
  "No encryption — banking, messaging, and passwords all lean on number theory that took mathematicians centuries to develop.",
  "No compression — JPEG, MP3, and ZIP all rely on transforms and probability to shrink data without losing what matters.",
  "No search engines — ranking a trillion pages is a linear algebra problem (eigenvectors, literally what PageRank is).",
  "No structural engineering — bridges and skyscrapers stand because someone solved differential equations correctly.",
  "No medicine at scale — drug trials, dosages, and epidemiology are statistics; get the math wrong and people die.",
];

const learnWithAI = [
  {
    step: "01",
    title: "Ask for the derivation, not just the formula",
    body: "Instead of \"what's the quadratic formula,\" ask an AI to derive it from ax\u00b2+bx+c=0 by completing the square. Watching the steps build the formula sticks far longer than memorizing it.",
  },
  {
    step: "02",
    title: "Request three explanations of the same idea",
    body: "Ask for an algebraic explanation, a geometric picture, and a real-world analogy for the same concept. Triangulating a concept from three angles is how intuition actually forms.",
  },
  {
    step: "03",
    title: "Generate practice problems at your exact edge",
    body: "Tell the AI what you got wrong and why, then ask for five problems that target that specific gap — not a random worksheet, a targeted one.",
  },
  {
    step: "04",
    title: "Teach it back, Feynman-style",
    body: "Explain the concept to the AI in your own words and ask it to point out the first place your explanation breaks down. That crack is exactly what you don't understand yet.",
  },
  {
    step: "05",
    title: "Verify by hand before you trust it",
    body: "AI can slip on arithmetic and edge cases. Use it to explain and generate, then re-derive the final two steps yourself on paper. The friction is the learning.",
  },
];

const techStack = [
  {
    category: "Numerical Computing",
    tools: ["NumPy", "SciPy", "MATLAB", "Julia", "Octave"],
    note: "For crunching real numbers fast — vectors, matrices, solvers.",
  },
  {
    category: "Symbolic Math",
    tools: ["SymPy", "Wolfram Mathematica", "Maple", "Wolfram Alpha"],
    note: "For exact algebra, calculus, and simplification — not decimals, symbols.",
  },
  {
    category: "Visualization",
    tools: ["Desmos", "GeoGebra", "Matplotlib", "Plotly", "D3.js"],
    note: "For seeing a function before you trust it.",
  },
  {
    category: "Machine Learning Math",
    tools: ["PyTorch", "TensorFlow", "scikit-learn", "JAX"],
    note: "Where linear algebra and calculus turn into predictions.",
  },
  {
    category: "Formal Logic & Proof",
    tools: ["Lean", "Coq", "Z3", "Isabelle"],
    note: "For math that has to be provably correct, not just probably correct.",
  },
  {
    category: "Learning with AI",
    tools: ["Claude", "Wolfram Alpha", "Khan Academy", "Photomath"],
    note: "For step-by-step derivations and on-demand practice sets.",
  },
];

type CheatItem = { name: string; formula: string };
type CheatSheet = { topic: string; items: CheatItem[] };

const cheatSheets: CheatSheet[] = [
  {
    topic: "Algebra",
    items: [
      { name: "Quadratic formula", formula: "x = (-b \u00B1 \u221A(b\u00B2 - 4ac)) / 2a" },
      { name: "Difference of squares", formula: "a\u00B2 - b\u00B2 = (a - b)(a + b)" },
      { name: "Perfect square", formula: "(a + b)\u00B2 = a\u00B2 + 2ab + b\u00B2" },
      { name: "Log rules", formula: "log(xy) = log x + log y, log(x/y) = log x - log y" },
      { name: "Exponent rules", formula: "a\u1d50 \u00B7 a\u207f = a\u1d50\u207a\u207f, (a\u1d50)\u207f = a\u1d50\u207f" },
    ],
  },
  {
    topic: "Geometry & Trigonometry",
    items: [
      { name: "Pythagorean theorem", formula: "a\u00B2 + b\u00B2 = c\u00B2" },
      { name: "Pythagorean identity", formula: "sin\u00B2\u03B8 + cos\u00B2\u03B8 = 1" },
      { name: "Law of cosines", formula: "c\u00B2 = a\u00B2 + b\u00B2 - 2ab\u00B7cos(C)" },
      { name: "Circle area / circumference", formula: "A = \u03C0r\u00B2, C = 2\u03C0r" },
      { name: "Distance formula", formula: "d = \u221A((x\u2082-x\u2081)\u00B2 + (y\u2082-y\u2081)\u00B2)" },
    ],
  },
  {
    topic: "Calculus",
    items: [
      { name: "Power rule", formula: "d/dx[x\u207f] = n\u00B7x\u207f\u207b\u00B9" },
      { name: "Product rule", formula: "d/dx[fg] = f'g + fg'" },
      { name: "Chain rule", formula: "d/dx[f(g(x))] = f'(g(x))\u00B7g'(x)" },
      { name: "Definite integral", formula: "\u222B\u2090\u1D47 f(x)dx = F(b) - F(a)" },
      { name: "Limit definition of derivative", formula: "f'(x) = lim\u2095\u2192\u2080 [f(x+h) - f(x)] / h" },
    ],
  },
  {
    topic: "Linear Algebra",
    items: [
      { name: "Matrix multiply dims", formula: "(m\u00D7n) \u00B7 (n\u00D7p) = (m\u00D7p)" },
      { name: "Dot product", formula: "a\u00B7b = \u03A3 a\u1D62b\u1D62 = |a||b|cos\u03B8" },
      { name: "Determinant (2\u00D72)", formula: "det = ad - bc" },
      { name: "Identity property", formula: "A \u00B7 I = A" },
      { name: "Eigen-equation", formula: "Av = \u03BBv" },
    ],
  },
  {
    topic: "Probability & Statistics",
    items: [
      { name: "Bayes' theorem", formula: "P(A|B) = P(B|A)P(A) / P(B)" },
      { name: "Mean", formula: "\u03BC = (\u03A3x\u1D62) / n" },
      { name: "Variance", formula: "\u03C3\u00B2 = \u03A3(x\u1D62 - \u03BC)\u00B2 / n" },
      { name: "Standard deviation", formula: "\u03C3 = \u221A\u03C3\u00B2" },
      { name: "Combinations", formula: "nCr = n! / (r!(n-r)!)" },
    ],
  },
  {
    topic: "Discrete Math for Coding",
    items: [
      { name: "Binary search complexity", formula: "O(log\u2082 n)" },
      { name: "Sum of 1..n", formula: "\u03A3\u1D62\u208C\u2081\u207F i = n(n+1)/2" },
      { name: "Modular arithmetic", formula: "(a + b) mod n = ((a mod n) + (b mod n)) mod n" },
      { name: "Set count of subsets", formula: "|P(S)| = 2\u207F" },
      { name: "Permutations", formula: "nPr = n! / (n-r)!" },
    ],
  },
];

type PuzzleQ = { q: string; hint: string; a: string };

const puzzles: PuzzleQ[] = [
  {
    q: "Prove that \u221A2 is irrational.",
    hint: "Try contradiction — assume it's a reduced fraction p/q.",
    a: "Assume \u221A2 = p/q in lowest terms. Then 2q\u00B2 = p\u00B2, so p\u00B2 is even, so p is even — write p = 2k. Substituting gives q\u00B2 = 2k\u00B2, so q is even too. But then p and q share a factor of 2, contradicting \"lowest terms.\" So no such fraction exists.",
  },
  {
    q: "Why is binary search O(log n) and not O(n)?",
    hint: "Think about how the search space shrinks each step.",
    a: "Each comparison discards half the remaining elements. Starting from n items, after k steps you have n/2\u1D4F items left; you stop when n/2\u1D4F \u2248 1, which means k \u2248 log\u2082 n. The number of steps grows logarithmically, not linearly.",
  },
  {
    q: "How many trailing zeros does 100! have?",
    hint: "Trailing zeros come from factors of 10 = 2 \u00D7 5. Which factor is scarcer?",
    a: "Factors of 5 are rarer than factors of 2, so count multiples of 5 in 100!: \u230A100/5\u230B + \u230A100/25\u230B = 20 + 4 = 24 trailing zeros.",
  },
  {
    q: "The Birthday Paradox: how many people are needed for a >50% chance two share a birthday?",
    hint: "It's smaller than most people guess. Compute the complement — the odds nobody shares.",
    a: "Only 23 people. The probability all birthdays are distinct falls below 50% around n = 23, because you're comparing every pair (23 choose 2 = 253 pairs), not just 23 people against 365 days.",
  },
  {
    q: "Monty Hall: you pick a door, the host reveals a goat behind another, should you switch?",
    hint: "The host's choice carries information because they know where the prize is.",
    a: "Yes — switching wins 2/3 of the time. Your first pick had a 1/3 chance of being right and 2/3 chance of being wrong. The host's reveal doesn't change your original door's odds, it just concentrates the remaining 2/3 probability onto the one door you didn't pick.",
  },
  {
    q: "What's the time complexity of building a hash map with n inserts, and why isn't it always O(n)?",
    hint: "Amortized analysis and worst-case collisions are different stories.",
    a: "Average case is O(n) total (O(1) per insert) because a good hash function spreads keys evenly. Worst case is O(n\u00B2) if every key collides into the same bucket, degrading each insert to O(n). This is why hash function quality matters as much as the data structure itself.",
  },
  {
    q: "Why does gradient descent use the negative of the derivative?",
    hint: "The derivative points toward increase. What do you want instead?",
    a: "The gradient points in the direction of steepest increase of the loss function. To minimize loss, you step in the opposite direction — hence \"negative\" gradient descent: new_weight = old_weight - learning_rate \u00D7 gradient.",
  },
  {
    q: "A rope burns unevenly in 60 minutes. With two such ropes and matches, how do you time exactly 45 minutes?",
    hint: "Burning a rope from both ends at once halves its remaining time.",
    a: "Light rope A at both ends and rope B at one end simultaneously. Rope A finishes in 30 minutes (burning twice as fast). At that moment, light the other end of rope B — its remaining 30 minutes of rope now burns from both ends, finishing in 15 more minutes. Total: 30 + 15 = 45 minutes.",
  },
];

const keepInMind = [
  "Math is a language, not a trivia set — the goal is fluency in reading and writing it, not memorizing every formula forever.",
  "A formula without its proof is a fact you have to trust blindly. The proof is what lets you rebuild the formula if you forget it.",
  "Mistakes are data. Wrong answers usually point exactly at the misunderstood step — don't just check \"right or wrong,\" check where it diverged.",
  "Every concept has at least three faces: algebraic (symbols), geometric (a picture), and numeric (plug in real numbers). Use whichever face makes it click.",
  "Struggle for real before looking up the answer. The retrieval attempt is what builds the memory — reading a solution passively barely does.",
  "Skipping fundamentals to reach \"the interesting part\" always costs more time later than it saves now.",
  "In code, an off-by-one error is almost always a math error — index arithmetic is discrete math whether you notice or not.",
  "Consistency beats intensity: twenty focused minutes a day compounds further than one exhausting six-hour session a month.",
];

/* Everything above, flattened into a plain-text formula sheet for download. */
const formulaSheetText = `MATH FORMULA SHEET — QUICK REFERENCE FOR CODERS
Generated from the Mathematics tutorial page
=================================================

── ALGEBRA ──────────────────────────────────────
Quadratic formula:        x = (-b ± √(b² - 4ac)) / 2a
Difference of squares:    a² - b² = (a - b)(a + b)
Perfect square:           (a + b)² = a² + 2ab + b²
Perfect square (minus):   (a - b)² = a² - 2ab + b²
Sum of cubes:              a³ + b³ = (a + b)(a² - ab + b²)
Log product rule:         log(xy) = log x + log y
Log quotient rule:        log(x/y) = log x - log y
Log power rule:           log(x^n) = n · log x
Change of base:           log_b(x) = log(x) / log(b)
Exponent product:         a^m · a^n = a^(m+n)
Exponent power:           (a^m)^n = a^(mn)
Negative exponent:        a^(-n) = 1 / a^n

── GEOMETRY & TRIGONOMETRY ──────────────────────
Pythagorean theorem:      a² + b² = c²
Pythagorean identity:     sin²θ + cos²θ = 1
Law of cosines:           c² = a² + b² - 2ab·cos(C)
Law of sines:             a/sin(A) = b/sin(B) = c/sin(C)
Circle area:              A = πr²
Circle circumference:     C = 2πr
Sphere volume:             V = (4/3)πr³
Distance formula:         d = √((x₂-x₁)² + (y₂-y₁)²)
Slope:                    m = (y₂-y₁) / (x₂-x₁)
Radians ↔ degrees:        rad = deg × (π/180)

── CALCULUS ──────────────────────────────────────
Derivative (limit def.):  f'(x) = lim(h→0) [f(x+h)-f(x)] / h
Power rule:               d/dx[xⁿ] = n·xⁿ⁻¹
Product rule:             d/dx[fg] = f'g + fg'
Quotient rule:            d/dx[f/g] = (f'g - fg') / g²
Chain rule:               d/dx[f(g(x))] = f'(g(x))·g'(x)
Derivative of eˣ:         d/dx[eˣ] = eˣ
Derivative of ln(x):      d/dx[ln x] = 1/x
Definite integral:        ∫ₐᵇ f(x)dx = F(b) - F(a)
Power rule (integral):    ∫xⁿ dx = x^(n+1)/(n+1) + C

── LINEAR ALGEBRA ────────────────────────────────
Matrix multiply dims:     (m×n) · (n×p) = (m×p)
Dot product:               a·b = Σaᵢbᵢ = |a||b|cos(θ)
Determinant (2×2):        det = ad - bc
Identity property:        A · I = A
Inverse property:         A · A⁻¹ = I
Eigen-equation:           Av = λv
Vector magnitude:         |v| = √(v₁² + v₂² + ... + vₙ²)

── PROBABILITY & STATISTICS ─────────────────────
Bayes' theorem:           P(A|B) = P(B|A)·P(A) / P(B)
Mean:                     μ = (Σxᵢ) / n
Variance:                 σ² = Σ(xᵢ - μ)² / n
Standard deviation:       σ = √σ²
Combinations:             nCr = n! / (r!(n-r)!)
Permutations:             nPr = n! / (n-r)!
Union (inclusion-excl.):  P(A∪B) = P(A) + P(B) - P(A∩B)
Independent events:       P(A∩B) = P(A)·P(B)

── DISCRETE MATH & COMPLEXITY (FOR CODING) ──────
Sum 1..n:                 Σi (i=1 to n) = n(n+1)/2
Sum of squares 1..n:      Σi² (i=1 to n) = n(n+1)(2n+1)/6
Geometric series sum:     Σr^i (i=0 to n) = (1-r^(n+1))/(1-r)
Binary search complexity: O(log₂ n)
Number of subsets:        |P(S)| = 2ⁿ
Modular addition:         (a+b) mod n = ((a mod n)+(b mod n)) mod n
Modular multiplication:   (a·b) mod n = ((a mod n)·(b mod n)) mod n
GCD (Euclidean):          gcd(a,b) = gcd(b, a mod n)

=================================================
Keep this sheet next to your editor — most of coding
math reduces to these ~50 lines.
`;

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-3">
      <span className="font-mono text-sm text-[#B4232F] dark:text-[#FF8A73]">
        §{n}
      </span>
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[#16233E] dark:text-[#EDEAD9] sm:text-4xl">
        {title}
      </h2>
      <span className="ml-2 h-px flex-1 bg-[#D8D2C4] dark:bg-[#24392F]" />
    </div>
  );
}

/** Shared filter def that gives every sketch its hand-drawn jitter. */
function SketchDefs() {
  return (
    <svg width="0" height="0" className="absolute">
      <filter id="sketchy">
        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" />
      </filter>
    </svg>
  );
}

function Sketch({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="flex flex-col items-center gap-3 rounded-lg border border-[#D8D2C4] bg-[#FBFAF6]/60 p-5 dark:border-[#24392F] dark:bg-[#0E1B16]/60">
      <div className="text-[#16233E] dark:text-[#EDEAD9]">{children}</div>
      <figcaption className="text-center font-mono text-xs text-[#3F4E68] dark:text-[#A9B8AC]">
        {caption}
      </figcaption>
    </figure>
  );
}

/* ---- Individual sketches (all use currentColor + the #sketchy filter) ---- */

function PythagoreanSketch() {
  return (
    <svg viewBox="0 0 220 190" className="h-44 w-full">
      <g filter="url(#sketchy)" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="30,160 170,160 170,60" />
        <rect x="30" y="30" width="140" height="130" opacity="0.15" fill="none" />
      </g>
      <g filter="url(#sketchy)" fill="none" stroke="#B4232F" strokeWidth="1.6" className="text-[#B4232F] dark:text-[#FF8A73]" strokeDasharray="4 3">
        <path d="M30,160 L30,60 L170,60" />
      </g>
      <text x="14" y="115" className="fill-current font-mono text-[10px]">a</text>
      <text x="95" y="180" className="fill-current font-mono text-[10px]">b</text>
      <text x="105" y="105" className="fill-current font-mono text-[10px]">c</text>
    </svg>
  );
}

function UnitCircleSketch() {
  return (
    <svg viewBox="0 0 220 190" className="h-44 w-full">
      <g filter="url(#sketchy)" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="110" cy="95" r="70" />
        <line x1="20" y1="95" x2="200" y2="95" />
        <line x1="110" y1="10" x2="110" y2="180" />
        <line x1="110" y1="95" x2="165" y2="45" />
      </g>
      <g filter="url(#sketchy)" fill="none" strokeWidth="1.6" className="text-[#0D8E82] dark:text-[#5EEAD4]" stroke="currentColor" strokeDasharray="3 3">
        <line x1="165" y1="45" x2="165" y2="95" />
        <line x1="110" y1="95" x2="165" y2="95" />
      </g>
      <text x="170" y="72" className="fill-current font-mono text-[10px]">sin θ</text>
      <text x="120" y="112" className="fill-current font-mono text-[10px]">cos θ</text>
      <text x="122" y="80" className="fill-current font-mono text-[10px]">θ</text>
    </svg>
  );
}

function FunctionGraphSketch() {
  return (
    <svg viewBox="0 0 220 190" className="h-44 w-full">
      <g filter="url(#sketchy)" fill="none" stroke="currentColor" strokeWidth="1.6">
        <line x1="15" y1="165" x2="205" y2="165" />
        <line x1="20" y1="10" x2="20" y2="180" />
        <path d="M25,160 C60,20 100,15 150,60 S190,150 205,140" />
      </g>
      <g filter="url(#sketchy)" className="text-[#B4232F] dark:text-[#FF8A73]" stroke="currentColor" strokeWidth="1.6" strokeDasharray="4 3">
        <line x1="70" y1="140" x2="140" y2="55" />
      </g>
      <circle cx="105" cy="97" r="3" className="fill-[#B4232F] dark:fill-[#FF8A73]" />
      <text x="145" y="50" className="fill-current font-mono text-[10px]">tangent = f'(x)</text>
    </svg>
  );
}

function MatrixSketch() {
  return (
    <svg viewBox="0 0 220 190" className="h-44 w-full">
      <g filter="url(#sketchy)" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M40,30 L28,30 L28,160 L40,160" />
        <path d="M120,30 L132,30 L132,160 L120,160" />
      </g>
      <text x="55" y="65" className="fill-current font-mono text-[11px]">a  b</text>
      <text x="55" y="95" className="fill-current font-mono text-[11px]">c  d</text>
      <text x="55" y="135" className="fill-current font-mono text-[11px]">e  f</text>
      <g className="text-[#0D8E82] dark:text-[#5EEAD4]" fill="currentColor">
        <path d="M148,90 L185,90 M175,82 L185,90 L175,98" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </g>
      <text x="192" y="80" className="fill-current font-mono text-[10px]">Av</text>
    </svg>
  );
}

function NormalDistSketch() {
  return (
    <svg viewBox="0 0 220 190" className="h-44 w-full">
      <g filter="url(#sketchy)" fill="none" stroke="currentColor" strokeWidth="1.6">
        <line x1="15" y1="160" x2="205" y2="160" />
        <path d="M20,155 C60,155 75,30 110,30 C145,30 160,155 200,155" />
      </g>
      <g className="text-[#B4232F] dark:text-[#FF8A73]" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3">
        <line x1="110" y1="30" x2="110" y2="160" />
        <line x1="75" y1="70" x2="75" y2="160" />
        <line x1="145" y1="70" x2="145" y2="160" />
      </g>
      <text x="102" y="20" className="fill-current font-mono text-[10px]">μ</text>
      <text x="60" y="175" className="fill-current font-mono text-[10px]">μ-σ</text>
      <text x="150" y="175" className="fill-current font-mono text-[10px]">μ+σ</text>
    </svg>
  );
}

function GraphTreeSketch() {
  return (
    <svg viewBox="0 0 220 190" className="h-44 w-full">
      <g filter="url(#sketchy)" fill="none" stroke="currentColor" strokeWidth="1.6">
        <line x1="110" y1="30" x2="60" y2="90" />
        <line x1="110" y1="30" x2="160" y2="90" />
        <line x1="60" y1="90" x2="30" y2="150" />
        <line x1="60" y1="90" x2="80" y2="150" />
        <line x1="160" y1="90" x2="140" y2="150" />
        <line x1="160" y1="90" x2="185" y2="150" />
      </g>
      <g className="fill-[#0D8E82] dark:fill-[#5EEAD4]">
        <circle cx="110" cy="30" r="7" />
        <circle cx="60" cy="90" r="7" />
        <circle cx="160" cy="90" r="7" />
        <circle cx="30" cy="150" r="7" />
        <circle cx="80" cy="150" r="7" />
        <circle cx="140" cy="150" r="7" />
        <circle cx="185" cy="150" r="7" />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function MathTutorialPage() {
  const [openPuzzles, setOpenPuzzles] = useState<Set<number>>(new Set());
  const [openSheets, setOpenSheets] = useState<Set<number>>(
    new Set([0])
  );

  function togglePuzzle(i: number) {
    setOpenPuzzles((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function toggleSheet(i: number) {
    setOpenSheets((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function downloadFormulaSheet() {
    const blob = new Blob([formulaSheetText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "math-formula-sheet.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const sections = [
    "What Is Mathematics",
    "Why It Matters Now",
    "Without It",
    "How It Helps",
    "Learning With AI",
    "Tech Stack",
    "Cheat Sheets",
    "Sketchbook",
    "Interview Puzzles",
    "Formula Sheet",
    "Keep In Mind",
  ];

  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-[#FBFAF6] font-[family-name:var(--font-body)] text-[#16233E] transition-colors dark:bg-[#0E1B16] dark:text-[#EDEAD9]`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(22,35,62,0.035) 0px, rgba(22,35,62,0.035) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, rgba(22,35,62,0.035) 0px, rgba(22,35,62,0.035) 1px, transparent 1px, transparent 28px)",
      }}
    >
      <SketchDefs />

      {/* dark-mode grid overlay */}
      <style jsx global>{`
        .dark .math-grid-bg {
          background-image: repeating-linear-gradient(
              0deg,
              rgba(237, 234, 217, 0.045) 0px,
              rgba(237, 234, 217, 0.045) 1px,
              transparent 1px,
              transparent 28px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(237, 234, 217, 0.045) 0px,
              rgba(237, 234, 217, 0.045) 1px,
              transparent 1px,
              transparent 28px
            );
        }
      `}</style>

      <div className="math-grid-bg">
        {/* ---------------------------------------------------------------- */}
        {/* Hero                                                              */}
        {/* ---------------------------------------------------------------- */}
        <header className="mx-auto max-w-5xl px-6 pb-16 pt-20 sm:pt-28">
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.2em] text-[#B4232F] dark:text-[#FF8A73]">
            a working notebook
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            Mathematics,
            <br />
            <span className="italic text-[#3F4E68] dark:text-[#A9B8AC]">
              explained the way it's used -
            </span>
            <br />
            not the way it's taught.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#3F4E68] dark:text-[#A9B8AC]">
            Mathematics is the study of structure, quantity, and change - a language
            for describing patterns precisely enough that a machine can act on
            them. This page is a single-sitting map of what it is, why it still
            matters after calculators and AI, and how to actually learn it if
            you're coming at it through code.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#formula-sheet"
              className="group mt-10 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300"
            >
              Jump to the formula sheet ↓
            </a>
            <a
              href="#sketchbook"
              className="group mt-10 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300"
            >
              See the sketchbook ↓
            </a>
          </div>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* On-page nav strip                                                 */}
        {/* ---------------------------------------------------------------- */}
        <nav className="mx-auto mb-4 hidden max-w-5xl flex-wrap gap-x-5 gap-y-2 border-y border-[#D8D2C4] px-6 py-4 font-mono text-xs text-[#3F4E68] dark:border-[#24392F] dark:text-[#A9B8AC] sm:flex">
          {sections.map((s, i) => (
            <a
              key={s}
              href={`#${s.toLowerCase().replace(/\s+/g, "-")}`}
              className="whitespace-nowrap transition hover:text-[#B4232F] dark:hover:text-[#FF8A73]"
            >
              §{i + 1} {s}
            </a>
          ))}
        </nav>

        <main className="mx-auto max-w-5xl space-y-24 px-6 py-16">
          {/* ---------------------------------------------------------------- */}
          {/* §1 What is mathematics                                           */}
          {/* ---------------------------------------------------------------- */}
          <section id="what-is-mathematics">
            <SectionLabel n="1" title="What Is Mathematics" />
            <div className="grid gap-8 sm:grid-cols-[1.3fr_1fr]">
              <p className="text-lg leading-relaxed text-[#3F4E68] dark:text-[#A9B8AC]">
                At its core, mathematics is the discipline of drawing certain
                conclusions from clearly stated assumptions. It has no lab,
                no telescope, no sensor - its raw material is pure logic
                applied to abstractions like numbers, shapes, and
                relationships. That abstraction is precisely what makes it
                portable: the same equation that describes a bouncing ball
                describes an AC current, a population of rabbits, and a
                stock price, because all four share the same underlying
                structure.
              </p>
              <p className="text-lg leading-relaxed text-[#3F4E68] dark:text-[#A9B8AC]">
                In practice it splits into a few families you'll keep
                running into: <strong>algebra</strong> (solving for
                unknowns), <strong>geometry &amp; trigonometry</strong>
                (shape and angle), <strong>calculus</strong> (rates of
                change), <strong>linear algebra</strong> (systems and
                transformations), <strong>probability &amp; statistics</strong>
                (uncertainty), and <strong>discrete math</strong> (the
                logic, sets, and graphs that computer science is built from).
              </p>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* §2 Why it matters now                                            */}
          {/* ---------------------------------------------------------------- */}
          <section id="why-it-matters-now">
            <SectionLabel n="2" title="Why It Matters Now" />
            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-[#3F4E68] dark:text-[#A9B8AC]">
              It would be reasonable to assume calculators and AI made deep
              math skill optional. The opposite happened - the tools got
              powerful enough that math literacy became the difference
              between using a tool and understanding what it just told you.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {whyItMatters.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-[#D8D2C4] p-5 dark:border-[#24392F]"
                >
                  <h3 className="mb-2 font-[family-name:var(--font-display)] text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#3F4E68] dark:text-[#A9B8AC]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* §3 What if it didn't exist                                       */}
          {/* ---------------------------------------------------------------- */}
          <section id="without-it">
            <SectionLabel n="3" title="Without It" />
            <p className="mb-6 max-w-3xl text-lg leading-relaxed text-[#3F4E68] dark:text-[#A9B8AC]">
              It's easier to see why math matters by subtracting it. Pull
              mathematics out of modern life and here's roughly what goes
              with it:
            </p>
            <ul className="space-y-3">
              {withoutMath.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-1 font-mono text-[#B4232F] dark:text-[#FF8A73]">
                    ×
                  </span>
                  <span className="text-[#3F4E68] dark:text-[#A9B8AC]">
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* §4 How it helps                                                  */}
          {/* ---------------------------------------------------------------- */}
          <section id="how-it-helps">
            <SectionLabel n="4" title="How It Helps" />
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold">
                  It builds a transferable mental model
                </h3>
                <p className="text-[#3F4E68] dark:text-[#A9B8AC]">
                  Learn recursion in math (a sequence defined in terms of
                  itself) and recursive functions in code stop being a
                  trick - they're the same idea in a different syntax.
                  Learn what a derivative means and gradient descent
                  reads like a sentence instead of a spell.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold">
                  It turns debugging into diagnosis
                </h3>
                <p className="text-[#3F4E68] dark:text-[#A9B8AC]">
                  An off-by-one bug, a NaN from dividing by a near-zero
                  number, an infinite loop from a bad recurrence - these
                  stop looking random once you can name the mathematical
                  object misbehaving underneath the code.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold">
                  It sharpens estimation
                </h3>
                <p className="text-[#3F4E68] dark:text-[#A9B8AC]">
                  Knowing that O(n²) at a million rows means a trillion
                  operations lets you reject a bad design before writing a
                  line of it - no profiler required.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-[family-name:var(--font-display)] text-xl font-semibold">
                  It's the shared vocabulary of every technical field
                </h3>
                <p className="text-[#3F4E68] dark:text-[#A9B8AC]">
                  Physics, economics, biology, and engineering all speak
                  math natively. Learning it once lets you read across
                  fields you'll never formally study.
                </p>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* §5 Learning with AI                                              */}
          {/* ---------------------------------------------------------------- */}
          <section id="learning-with-ai">
            <SectionLabel n="5" title="Learning With AI" />
            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-[#3F4E68] dark:text-[#A9B8AC]">
              AI is a genuinely good study partner for math - patient,
              always available, and able to re-explain a step as many
              times as it takes. It's a poor substitute for doing the
              problem yourself. Used well, it looks like this:
            </p>
            <ol className="space-y-6">
              {learnWithAI.map((item) => (
                <li key={item.step} className="flex gap-5">
                  <span className="shrink-0 font-mono text-2xl text-[#D8D2C4] dark:text-[#24392F]">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="mb-1 font-[family-name:var(--font-display)] text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-[#3F4E68] dark:text-[#A9B8AC]">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* §6 Tech stack                                                    */}
          {/* ---------------------------------------------------------------- */}
          <section id="tech-stack">
            <SectionLabel n="6" title="Tech Stack" />
            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-[#3F4E68] dark:text-[#A9B8AC]">
              The tools mathematicians and engineers actually reach for,
              grouped by job:
            </p>
            <div className="overflow-hidden rounded-lg border border-[#D8D2C4] dark:border-[#24392F]">
              {techStack.map((row, i) => (
                <div
                  key={row.category}
                  className={`grid grid-cols-1 gap-2 p-5 sm:grid-cols-[1fr_2fr] sm:gap-6 ${
                    i !== techStack.length - 1
                      ? "border-b border-[#D8D2C4] dark:border-[#24392F]"
                      : ""
                  }`}
                >
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">
                      {row.category}
                    </h3>
                    <p className="text-sm text-[#3F4E68] dark:text-[#A9B8AC]">
                      {row.note}
                    </p>
                  </div>
                  <div className="flex flex-wrap content-start gap-2">
                    {row.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-[#D8D2C4] px-2.5 py-1 font-mono text-xs text-[#16233E] dark:border-[#24392F] dark:text-[#EDEAD9]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* §7 Cheat sheets                                                  */}
          {/* ---------------------------------------------------------------- */}
          <section id="cheat-sheets">
            <SectionLabel n="7" title="Cheat Sheets" />
            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-[#3F4E68] dark:text-[#A9B8AC]">
              The formulas worth having memorized, organized by topic. Tap a
              topic to expand it.
            </p>
            <div className="space-y-3">
              {cheatSheets.map((sheet, i) => {
                const open = openSheets.has(i);
                return (
                  <div
                    key={sheet.topic}
                    className="overflow-hidden rounded-lg border border-[#D8D2C4] dark:border-[#24392F]"
                  >
                    <button
                      onClick={() => toggleSheet(i)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                    >
                      <span className="font-[family-name:var(--font-display)] text-lg font-semibold">
                        {sheet.topic}
                      </span>
                      <span className="font-mono text-sm text-[#3F4E68] dark:text-[#A9B8AC]">
                        {open ? "−" : "+"}
                      </span>
                    </button>
                    {open && (
                      <div className="border-t border-[#D8D2C4] px-5 py-4 dark:border-[#24392F]">
                        <dl className="space-y-3">
                          {sheet.items.map((item) => (
                            <div
                              key={item.name}
                              className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4"
                            >
                              <dt className="w-full shrink-0 text-sm text-[#3F4E68] dark:text-[#A9B8AC] sm:w-56">
                                {item.name}
                              </dt>
                              <dd className="font-[family-name:var(--font-mono)] text-sm text-[#0D8E82] dark:text-[#5EEAD4]">
                                {item.formula}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* §8 Sketchbook                                                    */}
          {/* ---------------------------------------------------------------- */}
          <section id="sketchbook">
            <SectionLabel n="8" title="Sketchbook" />
            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-[#3F4E68] dark:text-[#A9B8AC]">
              Most math concepts have a picture hiding inside them.
              Seeing the picture once tends to outlast memorizing the
              symbols by years.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Sketch caption="Pythagorean theorem — a² + b² = c²">
                <PythagoreanSketch />
              </Sketch>
              <Sketch caption="Unit circle — sine and cosine as projections">
                <UnitCircleSketch />
              </Sketch>
              <Sketch caption="Derivative — the slope of the tangent line">
                <FunctionGraphSketch />
              </Sketch>
              <Sketch caption="Matrix as a transformation acting on a vector">
                <MatrixSketch />
              </Sketch>
              <Sketch caption="Normal distribution — mean μ, spread σ">
                <NormalDistSketch />
              </Sketch>
              <Sketch caption="Graphs & trees — discrete math behind data structures">
                <GraphTreeSketch />
              </Sketch>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* §9 Interview puzzles                                             */}
          {/* ---------------------------------------------------------------- */}
          <section id="interview-puzzles">
            <SectionLabel n="9" title="Interview Puzzles" />
            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-[#3F4E68] dark:text-[#A9B8AC]">
              Classic math puzzles that show up in technical interviews -
              try each one before revealing the answer.
            </p>
            <div className="space-y-3">
              {puzzles.map((p, i) => {
                const open = openPuzzles.has(i);
                return (
                  <div
                    key={p.q}
                    className="overflow-hidden rounded-lg border border-[#D8D2C4] dark:border-[#24392F]"
                  >
                    <button
                      onClick={() => togglePuzzle(i)}
                      className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span>
                        <span className="mr-2 font-mono text-xs text-[#B4232F] dark:text-[#FF8A73]">
                          Q{i + 1}
                        </span>
                        <span className="font-medium">{p.q}</span>
                      </span>
                      <span className="shrink-0 font-mono text-sm text-[#3F4E68] dark:text-[#A9B8AC]">
                        {open ? "hide" : "reveal"}
                      </span>
                    </button>
                    {open && (
                      <div className="space-y-3 border-t border-[#D8D2C4] px-5 py-4 dark:border-[#24392F]">
                        <p className="font-mono text-xs uppercase tracking-wide text-[#3F4E68] dark:text-[#A9B8AC]">
                          Hint: {p.hint}
                        </p>
                        <p className="text-sm leading-relaxed text-[#16233E] dark:text-[#EDEAD9]">
                          {p.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* §10 Formula sheet download                                       */}
          {/* ---------------------------------------------------------------- */}
          <section
            id="formula-sheet"
            className="rounded-xl border border-[#D8D2C4] bg-[#F4F1E8] p-8 dark:border-[#24392F] dark:bg-[#0A150F] sm:p-12"
          >
            <SectionLabel n="10" title="Formula Sheet" />
            <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr] sm:items-center">
              <p className="text-lg leading-relaxed text-[#3F4E68] dark:text-[#A9B8AC]">
                Every formula from this page, laid out line by line in one
                plain-text file - algebra through discrete math, the exact
                set that shows up while coding. Keep it open in a side
                pane while you work.
              </p>
              <button
                onClick={downloadFormulaSheet}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#16233E] bg-[#16233E] px-6 py-3.5 font-mono text-sm text-[#FBFAF6] transition hover:opacity-85 dark:border-[#EDEAD9] dark:bg-[#EDEAD9] dark:text-[#0E1B16]"
              >
                ↓ Download formula-sheet.txt
              </button>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* §11 Keep in mind                                                 */}
          {/* ---------------------------------------------------------------- */}
          <section id="keep-in-mind">
            <SectionLabel n="11" title="Keep In Mind" />
            <ul className="grid gap-4 sm:grid-cols-2">
              {keepInMind.map((line, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-lg border border-[#D8D2C4] p-4 dark:border-[#24392F]"
                >
                  <span className="shrink-0 font-mono text-sm text-[#B4232F] dark:text-[#FF8A73]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-[#3F4E68] dark:text-[#A9B8AC]">
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <footer className="border-t border-[#D8D2C4] px-6 py-10 text-center font-mono text-xs text-[#3F4E68] dark:border-[#24392F] dark:text-[#A9B8AC]">
          Happy Learning ...
        </footer>
      </div>
    </div>
  );
}