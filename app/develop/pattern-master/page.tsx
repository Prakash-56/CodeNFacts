"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category =
  | "arithmetic"
  | "geometric"
  | "alternating"
  | "quadratic"
  | "cubic"
  | "fibonacci"
  | "multiplicative"
  | "prime"
  | "visual"
  | "digit"
  | "mixed";

type Difficulty = "Easy" | "Medium" | "Hard" | "Expert";

interface VisualStep {
  shape: "triangle" | "square" | "grid";
  n?: number;
  value: number;
}

interface PatternQuestion {
  id: string;
  category: Category;
  difficulty: Difficulty;
  sequence: number[];
  options: number[];
  correctIndex: number;
  explanation: string;
  visualSteps?: VisualStep[];
}

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const CATEGORY_META: Record<Category, { label: string; short: string }> = {
  arithmetic: { label: "Arithmetic Series", short: "AP" },
  geometric: { label: "Geometric Series", short: "GP" },
  alternating: { label: "Alternating Series", short: "ALT" },
  quadratic: { label: "Quadratic Series", short: "QUAD" },
  cubic: { label: "Cubic Series", short: "CUBE" },
  fibonacci: { label: "Fibonacci-style", short: "FIB" },
  multiplicative: { label: "Multiplicative Series", short: "MUL" },
  prime: { label: "Prime Series", short: "PRIME" },
  visual: { label: "Visual / Figurate", short: "VIS" },
  digit: { label: "Digit Patterns", short: "DIGIT" },
  mixed: { label: "Mixed Operations", short: "MIX" },
};

/* Difficulty colors — tuned separately for light/dark so they stay
   legible on both #ffffff and #0a0e14 backgrounds. */
const DIFFICULTY_COLOR: Record<Difficulty, { light: string; dark: string }> = {
  Easy: { light: "#059669", dark: "#34d399" },
  Medium: { light: "#2563EB", dark: "#60a5fa" },
  Hard: { light: "#DC2626", dark: "#f87171" },
  Expert: { light: "#111827", dark: "#e5e7eb" },
};

/* ------------------------------------------------------------------ */
/*  Small deterministic helpers                                        */
/* ------------------------------------------------------------------ */

function shuffleWithSeed<T>(values: T[], seed: number): { options: T[]; correctIndex: number } {
  const entries = values.map((v, i) => ({ v, isCorrect: i === 0 }));
  let s = seed + 1;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }
  return { options: entries.map((e) => e.v), correctIndex: entries.findIndex((e) => e.isCorrect) };
}

function ensureWrongs(correct: number, candidates: number[]): number[] {
  const seen = new Set<number>([correct]);
  const result: number[] = [];
  for (const c of candidates) {
    const v = Math.round(c);
    if (!seen.has(v)) {
      seen.add(v);
      result.push(v);
    }
    if (result.length === 3) break;
  }
  let pad = 2;
  while (result.length < 3) {
    const v1 = correct + pad;
    const v2 = correct - pad;
    if (!seen.has(v1)) {
      seen.add(v1);
      result.push(v1);
    }
    if (result.length < 3 && !seen.has(v2)) {
      seen.add(v2);
      result.push(v2);
    }
    pad++;
  }
  return result.slice(0, 3);
}

function digitSum(n: number): number {
  return String(Math.abs(Math.round(n)))
    .split("")
    .reduce((s, ch) => s + Number(ch), 0);
}

function makeQuestion(
  category: Category,
  id: string,
  difficulty: Difficulty,
  sequence: number[],
  answer: number,
  wrongCandidates: number[],
  explanation: string,
  seed: number,
  visualSteps?: VisualStep[]
): PatternQuestion {
  const wrongs = ensureWrongs(answer, wrongCandidates);
  const { options, correctIndex } = shuffleWithSeed([answer, ...wrongs], seed);
  return { id: `${category}-${id}`, category, difficulty, sequence, options, correctIndex, explanation, visualSteps };
}

type Op = { op: "+" | "-" | "*" | "/"; val: number };

function applyCycle(start: number, cycle: Op[], steps: number): number[] {
  const seq = [start];
  let cur = start;
  for (let i = 0; i < steps; i++) {
    const o = cycle[i % cycle.length];
    cur = o.op === "+" ? cur + o.val : o.op === "-" ? cur - o.val : o.op === "*" ? cur * o.val : Math.round(cur / o.val);
    seq.push(cur);
  }
  return seq;
}

function opLabel(o: Op): string {
  switch (o.op) {
    case "+":
      return `add ${o.val}`;
    case "-":
      return `subtract ${o.val}`;
    case "*":
      return `multiply by ${o.val}`;
    case "/":
      return `divide by ${o.val}`;
  }
}

function describeCycle(cycle: Op[]): string {
  return cycle.map(opLabel).join(", then ") + " — repeating";
}

/* ------------------------------------------------------------------ */
/*  1. Arithmetic Progression — 30 (Easy)                              */
/* ------------------------------------------------------------------ */

const AP_DIFFS = [3, 5, 2, 7, 4, 6, -3, 9, -2, 8, 10, -4];
const apGen: PatternQuestion[] = Array.from({ length: 30 }, (_, i) => {
  const a = 2 + i * 3;
  const d = AP_DIFFS[i % AP_DIFFS.length];
  const seq = [0, 1, 2, 3, 4].map((k) => a + k * d);
  const answer = a + 5 * d;
  const last = seq[4];
  const wrongCandidates = [last, answer + d, answer - 2 * d, last - d];
  return makeQuestion(
    "arithmetic",
    `ap-${i}`,
    "Easy",
    seq,
    answer,
    wrongCandidates,
    `Arithmetic sequence, common difference ${d}: each term = previous term ${d >= 0 ? "+" : "−"} ${Math.abs(d)}. ${last} ${d >= 0 ? "+" : "−"} ${Math.abs(d)} = ${answer}.`,
    i + 10
  );
});

/* ------------------------------------------------------------------ */
/*  2. Geometric Progression — 30 (Easy/Medium/Hard)                  */
/* ------------------------------------------------------------------ */

const gpGen: PatternQuestion[] = [];
{
  let idx = 0;
  for (let a = 1; a <= 6; a++) {
    for (let r = 2; r <= 6; r++) {
      const seq = [0, 1, 2, 3].map((k) => a * Math.pow(r, k));
      const answer = a * Math.pow(r, 4);
      const last = seq[3];
      const secondLast = seq[2];
      const wrongCandidates = [last + (last - secondLast), last * (r + 1), a * Math.pow(r, 5), last * (r - 1)];
      const difficulty: Difficulty = r <= 3 ? "Easy" : r <= 5 ? "Medium" : "Hard";
      gpGen.push(
        makeQuestion(
          "geometric",
          `gp-${idx}`,
          difficulty,
          seq,
          answer,
          wrongCandidates,
          `Geometric sequence, common ratio ${r}: each term = previous term × ${r}. ${last} × ${r} = ${answer}.`,
          idx + 40
        )
      );
      idx++;
    }
  }
}

/* ------------------------------------------------------------------ */
/*  3. Alternating interleaved series — 25 (Medium)                   */
/* ------------------------------------------------------------------ */

const ALT_D1 = [2, 3, 4, 1, 5];
const ALT_D2 = [3, 5, 10, 4];
const altGen: PatternQuestion[] = Array.from({ length: 25 }, (_, i) => {
  const a = 1 + i;
  const d1 = ALT_D1[i % ALT_D1.length];
  const b = 5 + i * 2;
  const d2 = ALT_D2[i % ALT_D2.length];
  const seq: number[] = [];
  for (let k = 0; k < 3; k++) {
    seq.push(a + k * d1);
    seq.push(b + k * d2);
  }
  const answer = a + 3 * d1;
  const last = seq[4];
  const wrongCandidates = [b + 3 * d2, seq[5] + d1, last + d2, last + 2 * d1];
  return makeQuestion(
    "alternating",
    `alt-${i}`,
    "Medium",
    seq,
    answer,
    wrongCandidates,
    `Two interleaved patterns: odd positions rise by ${d1} each time (${a}, ${a + d1}, ${a + 2 * d1}, ...), even positions rise by ${d2}. Next odd-position term: ${a + 2 * d1} + ${d1} = ${answer}.`,
    i + 70
  );
});

/* ------------------------------------------------------------------ */
/*  4. Quadratic (constant 2nd difference) — 25 (Medium/Hard)         */
/* ------------------------------------------------------------------ */

const QUAD_S = [1, 2, 3, -1, 4];
const quadGen: PatternQuestion[] = Array.from({ length: 25 }, (_, i) => {
  const a0 = 1 + (i % 10);
  const d0 = 2 + (i % 6);
  const s = QUAD_S[i % QUAD_S.length];
  const seq = [a0];
  let d = d0;
  for (let k = 0; k < 5; k++) {
    seq.push(seq[seq.length - 1] + d);
    d += s;
  }
  const shown = seq.slice(0, 5);
  const answer = seq[5];
  const last = shown[4];
  const diffLast = shown[4] - shown[3];
  const wrongCandidates = [last + diffLast, last + d0, answer + s, answer - s];
  const difficulty: Difficulty = i % 2 === 0 ? "Medium" : "Hard";
  return makeQuestion(
    "quadratic",
    `quad-${i}`,
    difficulty,
    shown,
    answer,
    wrongCandidates,
    `The gaps between consecutive terms grow by ${s} each time (constant second difference) — a hallmark of a quadratic sequence. Continuing the pattern gives ${answer}.`,
    i + 100
  );
});

/* ------------------------------------------------------------------ */
/*  5. Cubic sequences — 20 (Hard)                                    */
/* ------------------------------------------------------------------ */

const cubicGenA: PatternQuestion[] = Array.from({ length: 10 }, (_, i) => {
  const k = 1 + i;
  const seq = [0, 1, 2, 3, 4].map((o) => Math.pow(k + o, 3));
  const answer = Math.pow(k + 5, 3);
  const last = seq[4];
  const secondLast = seq[3];
  const wrongCandidates = [last + (last - secondLast), Math.round(answer * 0.85), Math.round(answer * 1.15), last * 2];
  return makeQuestion(
    "cubic",
    `cube-${i}`,
    "Hard",
    seq,
    answer,
    wrongCandidates,
    `Each term is a perfect cube: n³ for n = ${k}, ${k + 1}, ..., ${k + 4}. Next: ${k + 5}³ = ${answer}.`,
    i + 130
  );
});

const cubicGenB: PatternQuestion[] = Array.from({ length: 10 }, (_, i) => {
  const k = 1 + i;
  const f = (n: number) => n * n * n - n;
  const seq = [0, 1, 2, 3, 4].map((o) => f(k + o));
  const answer = f(k + 5);
  const last = seq[4];
  const secondLast = seq[3];
  const wrongCandidates = [last + (last - secondLast), answer + (k + 5), answer - (k + 5), last * 2];
  return makeQuestion(
    "cubic",
    `cube2-${i}`,
    "Hard",
    seq,
    answer,
    wrongCandidates,
    `Each term follows n³ − n for n = ${k}, ${k + 1}, ..., ${k + 4}. Next: ${k + 5}³ − ${k + 5} = ${answer}.`,
    i + 150
  );
});

/* ------------------------------------------------------------------ */
/*  6. Fibonacci-style — 25 (Medium/Hard)                             */
/* ------------------------------------------------------------------ */

const fibGen2: PatternQuestion[] = Array.from({ length: 15 }, (_, i) => {
  const a = 1 + i;
  const b = 1 + i * 2;
  const seq = [a, b];
  for (let k = 0; k < 5; k++) seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  const shown = seq.slice(0, 6);
  const answer = seq[6];
  const last = shown[5];
  const secondLast = shown[4];
  const wrongCandidates = [last + shown[3], last * 2, answer + 1, answer - 1];
  return makeQuestion(
    "fibonacci",
    `fib2-${i}`,
    "Medium",
    shown,
    answer,
    wrongCandidates,
    `Each term is the sum of the previous two (Fibonacci-style): ${secondLast} + ${last} = ${answer}.`,
    i + 170
  );
});

const fibGen3: PatternQuestion[] = Array.from({ length: 10 }, (_, i) => {
  const a = 1 + i;
  const b = 2 + i;
  const c = 3 + i;
  const seq = [a, b, c];
  for (let k = 0; k < 4; k++) seq.push(seq[seq.length - 1] + seq[seq.length - 2] + seq[seq.length - 3]);
  const shown = seq.slice(0, 6);
  const answer = seq[6];
  const last = shown[5];
  const m2 = shown[4];
  const m3 = shown[3];
  const wrongCandidates = [last + m2, last * 2 - m3, answer + 2, answer - 2];
  return makeQuestion(
    "fibonacci",
    `fib3-${i}`,
    "Hard",
    shown,
    answer,
    wrongCandidates,
    `Each term is the sum of the previous three (Tribonacci-style): ${m3} + ${m2} + ${last} = ${answer}.`,
    i + 190
  );
});

/* ------------------------------------------------------------------ */
/*  7. Multiplicative increasing factor — 20 (Medium/Hard)            */
/* ------------------------------------------------------------------ */

const multGen: PatternQuestion[] = Array.from({ length: 20 }, (_, i) => {
  const a = 2 + (i % 5);
  const f0 = 2 + (i % 3);
  const terms = [a];
  let cur = a;
  for (let k = 0; k < 5; k++) {
    cur = cur * (f0 + k);
    terms.push(cur);
  }
  const shown = terms.slice(0, 5);
  const answer = terms[5];
  const last = shown[4];
  const wrongCandidates = [last * (f0 + 3), last + shown[3], last * f0, answer + last];
  const difficulty: Difficulty = f0 === 2 ? "Medium" : "Hard";
  return makeQuestion(
    "multiplicative",
    `mult-${i}`,
    difficulty,
    shown,
    answer,
    wrongCandidates,
    `Each term is multiplied by an increasing factor (×${f0}, ×${f0 + 1}, ×${f0 + 2}, ...). ${last} × ${f0 + 4} = ${answer}.`,
    i + 210
  );
});

/* ------------------------------------------------------------------ */
/*  8. Prime-related — 20 (Hard/Expert)                               */
/* ------------------------------------------------------------------ */

const PRIMES = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173,
];

const primeGenA: PatternQuestion[] = Array.from({ length: 15 }, (_, s) => {
  const shown = PRIMES.slice(s, s + 5);
  const answer = PRIMES[s + 5];
  const wrongCandidates = [answer - 2, answer + 2, answer - 4, PRIMES[s + 4] * 2];
  return makeQuestion(
    "prime",
    `p-${s}`,
    "Hard",
    shown,
    answer,
    wrongCandidates,
    `A straightforward run of prime numbers. After ${shown[4]}, the next prime is ${answer}.`,
    s + 230
  );
});

const PRIME_B_STARTS = [1, 2, 3, 5, 10];
const primeGenB: PatternQuestion[] = PRIME_B_STARTS.map((a, i) => {
  const seq = [a];
  let cur = a;
  for (let k = 0; k < 5; k++) {
    cur = cur + PRIMES[k];
    seq.push(cur);
  }
  const shown = seq.slice(0, 5);
  const answer = seq[5];
  const wrongCandidates = [answer - 2, answer + 2, shown[4] + PRIMES[4], shown[4] * 2];
  return makeQuestion(
    "prime",
    `pb-${i}`,
    "Expert",
    shown,
    answer,
    wrongCandidates,
    `Each term adds the next prime number in order (2, 3, 5, 7, 11, 13, ...). ${shown[4]} + ${PRIMES[5]} = ${answer}.`,
    i + 250
  );
});

/* ------------------------------------------------------------------ */
/*  9. Visual / figurate numbers — 30 (Easy/Medium)                   */
/* ------------------------------------------------------------------ */

function figurate(shape: "triangle" | "square" | "pentagon" | "hex", n: number): number {
  switch (shape) {
    case "triangle":
      return (n * (n + 1)) / 2;
    case "square":
      return n * n;
    case "pentagon":
      return (n * (3 * n - 1)) / 2;
    case "hex":
      return n * (2 * n - 1);
  }
}

const VIS_SPECS: {
  shape: "triangle" | "square" | "pentagon" | "hex";
  starts: number[];
  difficulty: Difficulty;
  renderShape: "triangle" | "square" | "grid";
  label: string;
}[] = [
  { shape: "triangle", starts: [1, 2, 3, 4, 5, 6, 7, 8], difficulty: "Easy", renderShape: "triangle", label: "triangular numbers" },
  { shape: "square", starts: [1, 2, 3, 4, 5, 6, 7, 8], difficulty: "Easy", renderShape: "square", label: "square numbers" },
  { shape: "pentagon", starts: [1, 2, 3, 4, 5, 6, 7], difficulty: "Medium", renderShape: "grid", label: "pentagonal numbers" },
  { shape: "hex", starts: [1, 2, 3, 4, 5, 6, 7], difficulty: "Medium", renderShape: "grid", label: "hexagonal numbers" },
];

const visualGen: PatternQuestion[] = [];
{
  let idx = 0;
  VIS_SPECS.forEach((spec) => {
    spec.starts.forEach((start) => {
      const seq = [0, 1, 2, 3].map((k) => figurate(spec.shape, start + k));
      const answer = figurate(spec.shape, start + 4);
      const visualSteps: VisualStep[] = [0, 1, 2, 3].map((k) =>
        spec.renderShape === "grid"
          ? { shape: "grid", value: figurate(spec.shape, start + k) }
          : { shape: spec.renderShape, n: start + k, value: figurate(spec.shape, start + k) }
      );
      const last = seq[3];
      const secondLast = seq[2];
      const wrongCandidates = [last + (last - secondLast), last * 2 - secondLast + 1, answer - 3, answer + 3];
      visualGen.push(
        makeQuestion(
          "visual",
          `${spec.shape}-${idx}`,
          spec.difficulty,
          seq,
          answer,
          wrongCandidates,
          `These are ${spec.label}: term n follows the figurate-number formula for n = ${start}..${start + 4}. The next term is ${answer}.`,
          idx + 270,
          visualSteps
        )
      );
      idx++;
    });
  });
}

/* ------------------------------------------------------------------ */
/*  10. Digit-based patterns — 20 (Hard/Expert)                       */
/* ------------------------------------------------------------------ */

const DIGIT_A_STARTS = [12, 15, 19, 23, 27, 31, 34, 38, 42, 47];
const digitGenA: PatternQuestion[] = DIGIT_A_STARTS.map((a, i) => {
  const seq = [a];
  let cur = a;
  for (let k = 0; k < 5; k++) {
    cur = cur + digitSum(cur);
    seq.push(cur);
  }
  const shown = seq.slice(0, 5);
  const answer = seq[5];
  const last = shown[4];
  const wrongCandidates = [last + digitSum(last) * 2, last * 2, answer + digitSum(answer), answer - digitSum(last)];
  return makeQuestion(
    "digit",
    `dsum-${i}`,
    "Hard",
    shown,
    answer,
    wrongCandidates,
    `Rule: each term = previous term + sum of its digits. ${last} + digitSum(${last}) = ${answer}.`,
    i + 310
  );
});

const DIGIT_B_STARTS = [3, 4, 5, 6, 7, 8, 9, 11, 13, 14];
const digitGenB: PatternQuestion[] = DIGIT_B_STARTS.map((a, i) => {
  const seq = [a];
  let cur = a;
  for (let k = 0; k < 5; k++) {
    cur = cur * 2 + digitSum(cur);
    seq.push(cur);
  }
  const shown = seq.slice(0, 5);
  const answer = seq[5];
  const last = shown[4];
  const wrongCandidates = [last * 2, last * 2 + digitSum(last) * 2, answer + 3, answer - 3];
  return makeQuestion(
    "digit",
    `d2x-${i}`,
    "Expert",
    shown,
    answer,
    wrongCandidates,
    `Rule: each term = (previous term × 2) + sum of the previous term's digits. ${last}×2 + digitSum(${last}) = ${answer}.`,
    i + 330
  );
});

/* ------------------------------------------------------------------ */
/*  11. Mixed operation cycles — 25 (Medium/Hard/Expert)              */
/* ------------------------------------------------------------------ */

const MIXED_CYCLES: { ops: Op[]; difficulty: Difficulty }[] = [
  { ops: [{ op: "+", val: 1 }, { op: "*", val: 2 }], difficulty: "Medium" },
  { ops: [{ op: "*", val: 2 }, { op: "-", val: 1 }], difficulty: "Medium" },
  { ops: [{ op: "+", val: 3 }, { op: "*", val: 2 }, { op: "-", val: 2 }], difficulty: "Hard" },
  { ops: [{ op: "*", val: 3 }, { op: "-", val: 2 }], difficulty: "Hard" },
  { ops: [{ op: "+", val: 5 }, { op: "*", val: 2 }, { op: "+", val: 1 }], difficulty: "Expert" },
];
const MIXED_STARTS = [1, 2, 3, 4, 5];

const mixedGen: PatternQuestion[] = [];
{
  let idx = 0;
  MIXED_CYCLES.forEach((cycleSpec) => {
    MIXED_STARTS.forEach((start) => {
      const seq = applyCycle(start, cycleSpec.ops, 5);
      const shown = seq.slice(0, 5);
      const answer = seq[5];
      const last = shown[4];
      const secondLast = shown[3];
      const wrongCandidates = [last + (last - secondLast), last * 2, answer + 2, answer - 2];
      mixedGen.push(
        makeQuestion(
          "mixed",
          `m-${idx}`,
          cycleSpec.difficulty,
          shown,
          answer,
          wrongCandidates,
          `Rule: ${describeCycle(cycleSpec.ops)}. Applying it to the last term (${last}) gives ${answer}.`,
          idx + 350
        )
      );
      idx++;
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Full bank — ~270 unique problems                                  */
/* ------------------------------------------------------------------ */

const ALL_QUESTIONS: PatternQuestion[] = [
  ...apGen,
  ...gpGen,
  ...altGen,
  ...quadGen,
  ...cubicGenA,
  ...cubicGenB,
  ...fibGen2,
  ...fibGen3,
  ...multGen,
  ...primeGenA,
  ...primeGenB,
  ...visualGen,
  ...digitGenA,
  ...digitGenB,
  ...mixedGen,
];

/* ------------------------------------------------------------------ */
/*  Visual dot renderer                                                */
/* ------------------------------------------------------------------ */

function PatternVisual({ step }: { step: VisualStep }) {
  const cap = 100;
  if (step.shape === "triangle" && step.n && step.n <= 14) {
    return (
      <div className="flex flex-col items-center gap-0.5">
        {Array.from({ length: step.n }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-0.5">
            {Array.from({ length: rowIdx + 1 }).map((_, d) => (
              <span key={d} className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-emerald-400" />
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (step.shape === "square" && step.n && step.n <= 12) {
    return (
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${step.n}, minmax(0,1fr))` }}>
        {Array.from({ length: step.n * step.n }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-amber-400" />
        ))}
      </div>
    );
  }
  const shown = Math.min(step.value, cap);
  const cols = Math.max(1, Math.min(10, Math.ceil(Math.sqrt(shown))));
  return (
    <div className="flex flex-wrap gap-0.5" style={{ maxWidth: cols * 8 }}>
      {Array.from({ length: shown }).map((_, i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
      ))}
      {step.value > cap && <span className="ml-1 text-[8px] text-neutral-400 dark:text-neutral-500">+{step.value - cap}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

const CATEGORY_ORDER: Category[] = [
  "arithmetic", "geometric", "alternating", "quadratic", "cubic",
  "fibonacci", "multiplicative", "prime", "visual", "digit", "mixed",
];
const DIFFICULTY_ORDER: Difficulty[] = ["Easy", "Medium", "Hard", "Expert"];

export default function PatternMasterPage() {
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | Difficulty>("All");
  const [categoryFilter, setCategoryFilter] = useState<"all" | Category>("all");
  const [current, setCurrent] = useState<PatternQuestion | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const usedIdsRef = useRef<Set<string>>(new Set());

  const pool = ALL_QUESTIONS.filter(
    (q) =>
      (difficultyFilter === "All" || q.difficulty === difficultyFilter) &&
      (categoryFilter === "all" || q.category === categoryFilter)
  );

  const pickNext = useCallback(() => {
    if (pool.length === 0) {
      setCurrent(null);
      return;
    }
    let available = pool.filter((q) => !usedIdsRef.current.has(q.id));
    if (available.length === 0) {
      usedIdsRef.current = new Set();
      available = pool;
    }
    const q = available[Math.floor(Math.random() * available.length)];
    usedIdsRef.current.add(q.id);
    setCurrent(q);
    setChosen(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficultyFilter, categoryFilter]);

  useEffect(() => {
    usedIdsRef.current = new Set();
    pickNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficultyFilter, categoryFilter]);

  const handleSelect = (idx: number) => {
    if (!current || chosen !== null) return;
    const correct = idx === current.correctIndex;
    setScore((prev) => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
    setStreak((prev) => {
      const next = correct ? prev + 1 : 0;
      setBestStreak((b) => Math.max(b, next));
      return next;
    });
    setChosen(idx);
  };

  const resetSession = () => {
    usedIdsRef.current = new Set();
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setBestStreak(0);
    pickNext();
  };

  const accuracy = score.total ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0e14] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {/* Header */}
        <header className="mb-10 border-b border-neutral-200 dark:border-neutral-800 pb-8">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
            Numerical &amp; Visual Reasoning · Placement Prep
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl">
            Pattern<span className="text-amber-600 dark:text-emerald-400">Master</span>
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-500 dark:text-neutral-400">
            Spot the rule, find the next number. {ALL_QUESTIONS.length} unique problems spanning
            arithmetic, geometric, quadratic, Fibonacci, prime, digit, and visual figurate
            patterns - across four difficulty levels.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main quiz column */}
          <div>
            {current ? (
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0d1117] p-6 shadow-sm dark:shadow-none">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white dark:text-neutral-950"
                    style={{
                      backgroundColor:
                        typeof window !== "undefined" && document.documentElement.classList.contains("dark")
                          ? DIFFICULTY_COLOR[current.difficulty].dark
                          : DIFFICULTY_COLOR[current.difficulty].light,
                    }}
                  >
                    {current.difficulty}
                  </span>
                  <span className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {CATEGORY_META[current.category].label}
                  </span>
                </div>

                <p className="mb-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">Find the next number:</p>

                {/* terminal-chrome sequence block */}
                <div className="mb-5 overflow-hidden rounded-2xl border border-neutral-800 dark:border-neutral-800 bg-neutral-950 dark:bg-black">
                  <div className="flex items-center gap-1.5 border-b border-neutral-800 px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="p-5 font-mono">
                    {current.sequence.map((n, i) => (
                      <div key={i} className="flex items-center gap-4 py-1.5">
                        <span className="w-5 text-right text-xs text-neutral-600">{i + 1}</span>
                        <span className="text-2xl text-emerald-400">{n}</span>
                        {current.visualSteps && current.visualSteps[i] && (
                          <span className="ml-2 opacity-80">
                            <PatternVisual step={current.visualSteps[i]} />
                          </span>
                        )}
                      </div>
                    ))}
                    <div className="mt-1 flex items-center gap-4 border-t border-dashed border-neutral-700 py-1.5 pt-3">
                      <span className="w-5 text-right text-xs text-neutral-600">{current.sequence.length + 1}</span>
                      <span className="animate-pulse text-2xl text-amber-400 dark:text-emerald-400">?</span>
                    </div>
                  </div>
                </div>

                {/* options */}
                <div className="grid grid-cols-2 gap-3">
                  {current.options.map((opt, idx) => {
                    const isChosen = chosen === idx;
                    const isCorrectAnswer = idx === current.correctIndex;
                    let style =
                      "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-transparent";
                    if (chosen !== null) {
                      if (isCorrectAnswer)
                        style =
                          "border-emerald-500 dark:border-emerald-500/60 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
                      else if (isChosen)
                        style =
                          "border-red-400 dark:border-red-500/60 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400";
                      else style = "border-neutral-200 dark:border-neutral-800 opacity-50";
                    }
                    return (
                      <button
                        key={idx}
                        disabled={chosen !== null}
                        onClick={() => handleSelect(idx)}
                        className={`rounded-xl border px-4 py-3 text-center font-mono text-lg font-semibold text-neutral-900 dark:text-neutral-100 transition-colors ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {chosen !== null && (
                  <div className="mt-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-transparent dark:border-neutral-800 p-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {current.explanation}
                  </div>
                )}

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={pickNext}
                    className="rounded-lg bg-neutral-900 dark:bg-emerald-500 px-4 py-2 text-sm font-medium text-white dark:text-neutral-950 transition-colors hover:bg-neutral-700 dark:hover:bg-emerald-400"
                  >
                    Next problem →
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 p-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
                No problems match this combination of filters. Try widening your selection.
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0d1117] p-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Difficulty</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setDifficultyFilter("All")}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    difficultyFilter === "All"
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-neutral-950"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600"
                  }`}
                >
                  All
                </button>
                {DIFFICULTY_ORDER.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      difficultyFilter === d
                        ? "text-white dark:text-neutral-950"
                        : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600"
                    }`}
                    style={
                      difficultyFilter === d
                        ? {
                            backgroundColor: DIFFICULTY_COLOR[d].light,
                            borderColor: DIFFICULTY_COLOR[d].light,
                          }
                        : undefined
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0d1117] p-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Category</h2>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as "all" | Category)}
                className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200"
              >
                <option value="all">All categories</option>
                {CATEGORY_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_META[c].label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">{pool.length} problems in this selection.</p>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0d1117] p-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Session</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Score</span>
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">
                    {score.correct}/{score.total}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Accuracy</span>
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">{accuracy}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Current streak</span>
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">{streak}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Best streak</span>
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">{bestStreak}</span>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div className="h-full bg-amber-500 dark:bg-emerald-400" style={{ width: `${accuracy}%` }} />
              </div>
              <button
                onClick={resetSession}
                className="mt-4 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:border-neutral-900 dark:hover:border-emerald-500 hover:text-neutral-900 dark:hover:text-emerald-400"
              >
                Reset session
              </button>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0d1117] p-4 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">How it works</h2>
              <p>
                Study the sequence, then pick the number that continues it. Every problem has a
                worked-out rule shown after you answer — great for building the pattern-recognition
                speed placement tests reward.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}