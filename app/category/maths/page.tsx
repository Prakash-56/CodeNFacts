"use client";

import { useState } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

/**
 * category/maths/page.tsx
 *
 * A standalone "Mathematics" category page.
 * Theming: this page has NO theme toggle of its own — it reads the `dark`
 * class from a parent element (set by the header's light/dark button) and
 * responds via the CSS custom properties defined on the root wrapper below.
 * Light mode defaults to a white background; dark mode overrides the same
 * variables, so every element that reads var(--bg), var(--ink), etc. updates
 * automatically without extra dark: classes scattered through the markup.
 */

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const topics = [
  {
    n: "01",
    name: "Arithmetic & Number Sense",
    blurb:
      "Operations, fractions, ratios, percentages, and estimation. The load-bearing wall underneath every other branch — weak arithmetic quietly sabotages algebra and calculus later.",
  },
  {
    n: "02",
    name: "Algebra",
    blurb:
      "Variables, equations, inequalities, polynomials, and functions. The language for describing unknowns and the relationships between quantities.",
  },
  {
    n: "03",
    name: "Geometry",
    blurb:
      "Shapes, angles, congruence, similarity, area, and volume. Trains you to reason about space, symmetry, and visual structure.",
  },
  {
    n: "04",
    name: "Trigonometry",
    blurb:
      "Angles, triangles, and periodic functions. The bridge between geometry's shapes and algebra's equations — essential for waves, rotation, and oscillation.",
  },
  {
    n: "05",
    name: "Coordinate & Analytic Geometry",
    blurb:
      "Graphing equations, lines, circles, and conics on a plane. Turns algebraic statements into pictures you can actually look at.",
  },
  {
    n: "06",
    name: "Calculus",
    blurb:
      "Limits, derivatives, and integrals — the mathematics of change and accumulation. Powers physics, economics, engineering, and machine learning.",
  },
  {
    n: "07",
    name: "Linear Algebra",
    blurb:
      "Vectors, matrices, and linear transformations. The backbone of computer graphics, data science, quantum mechanics, and neural networks.",
  },
  {
    n: "08",
    name: "Probability & Statistics",
    blurb:
      "Uncertainty, data, distributions, and inference. How to reason correctly when the answer isn't guaranteed — arguably the most-used math in adult life.",
  },
  {
    n: "09",
    name: "Discrete Mathematics & Logic",
    blurb:
      "Sets, combinatorics, graph theory, and propositional logic. The direct foundation of computer science and of rigorous mathematical proof itself.",
  },
  {
    n: "10",
    name: "Number Theory",
    blurb:
      "Primes, divisibility, and modular arithmetic. Pure structure hiding inside whole numbers — and, unexpectedly, the engine behind modern cryptography.",
  },
];

const logicSteps = [
  {
    step: "Definitions",
    detail:
      "Every term is pinned down precisely before it's used. A 'prime number' means exactly one thing, everywhere, forever. Vague language is not allowed to hide inside a definition.",
  },
  {
    step: "Axioms",
    detail:
      "A small set of statements accepted without proof, because every system has to start somewhere. Everything downstream is only as trustworthy as these starting assumptions.",
  },
  {
    step: "Theorems",
    detail:
      "Claims derived from definitions and axioms using strict logical steps. A theorem isn't 'probably true' or 'true most of the time' — it's true under the stated conditions, full stop.",
  },
  {
    step: "Proofs",
    detail:
      "The chain of reasoning connecting axioms to a theorem, with no gaps a skeptic could drive a truck through. Learning to build one is the closest thing school offers to a workout for the reasoning muscle.",
  },
];

const reasoningModes = [
  {
    mode: "Deductive reasoning",
    desc: "General rule → specific conclusion, guaranteed true if the premises are true. 'All primes greater than 2 are odd; 7 is a prime greater than 2; therefore 7 is odd.' This is the backbone of formal proof.",
  },
  {
    mode: "Inductive reasoning",
    desc: "Specific observations → a general pattern, likely but not guaranteed true. Noticing that 1+3=4, 1+3+5=9, 1+3+5+7=16 suggests a pattern (sums of odd numbers are perfect squares) — which then needs deductive proof to confirm.",
  },
];

const logicBenefits = [
  {
    title: "Decomposition",
    body: "Big, intimidating problems get broken into small, checkable steps. This is the same skill used to debug code, plan a project, or untangle a legal argument.",
  },
  {
    title: "Abstraction",
    body: "Math trains you to strip away irrelevant detail and focus on structure — noticing that a seating-arrangement problem and a coin-flip problem are secretly the same combinatorics problem underneath.",
  },
  {
    title: "Pattern recognition",
    body: "Spotting the rule behind a sequence, a graph, or a dataset is a rehearsal for spotting the rule behind a business trend, a bug, or an argument's weak point.",
  },
  {
    title: "Rigor & error-checking",
    body: "A single wrong sign breaks an entire proof. Math is unusually good at teaching people to actually verify their own reasoning instead of just feeling confident about it.",
  },
  {
    title: "Sequential reasoning",
    body: "Multi-step problems force you to hold an unfinished chain of logic in your head and keep extending it correctly — a direct rehearsal for planning and programming.",
  },
  {
    title: "Transferability",
    body: "The habits above don't stay in the math classroom. They show up in negotiating a contract, reading a scientific claim skeptically, or deciding whether a plan actually adds up.",
  },
];

type Note = {
  id: string;
  title: string;
  intro: string;
  formulas: string[];
  theorem: string;
  why: string;
};

const notes: Note[] = [
  {
    id: "algebra",
    title: "Algebra — Deep Notes",
    intro:
      "Algebra generalizes arithmetic: instead of working with fixed numbers, you work with symbols that stand for unknown or varying quantities. Its central objects are equations (statements of equality) and functions (rules that map inputs to outputs).",
    formulas: [
      "Quadratic formula: x = (-b ± √(b² - 4ac)) / 2a",
      "Difference of squares: a² - b² = (a - b)(a + b)",
      "Perfect square: (a ± b)² = a² ± 2ab + b²",
      "Sum/product of quadratic roots: x1+x2 = -b/a, x1·x2 = c/a",
      "Exponent rules: aᵐ·aⁿ = aᵐ⁺ⁿ, (aᵐ)ⁿ = aᵐⁿ",
    ],
    theorem:
      "Fundamental Theorem of Algebra: every non-constant polynomial with complex coefficients has at least one complex root — and a degree-n polynomial has exactly n roots counted with multiplicity.",
    why: "Algebra is the first place students learn to reason about a quantity they don't yet know the value of — which is the entire premise of solving real problems: set up relationships first, find the unknown second.",
  },
  {
    id: "geometry",
    title: "Geometry & Trigonometry — Deep Notes",
    intro:
      "Geometry studies shape, size, and position; trigonometry extends it by relating angles to side lengths, which turns out to describe anything that rotates or oscillates.",
    formulas: [
      "Pythagorean theorem: a² + b² = c² (right triangle, c = hypotenuse)",
      "Triangle area: A = ½ · base · height",
      "Circle: circumference = 2πr, area = πr²",
      "Law of Cosines: c² = a² + b² - 2ab·cos(C)",
      "Law of Sines: a/sin(A) = b/sin(B) = c/sin(C)",
    ],
    theorem:
      "Thales' Theorem: if A, B, C lie on a circle and BC is a diameter, then angle BAC is exactly 90°. It's the reason a triangle inscribed in a semicircle is always right-angled.",
    why: "Geometry is the branch where 'proof' first feels tangible — you can literally see why two triangles are congruent, which makes it the natural on-ramp to formal reasoning before things get abstract.",
  },
  {
    id: "calculus",
    title: "Calculus — Deep Notes",
    intro:
      "Calculus formalizes two questions: how fast is something changing right now (derivatives), and how much has accumulated over an interval (integrals). Both are built on the idea of a limit — what a quantity approaches as you zoom in infinitely.",
    formulas: [
      "Derivative of xⁿ: d/dx(xⁿ) = n·xⁿ⁻¹",
      "Product rule: (fg)' = f'g + fg'",
      "Chain rule: d/dx f(g(x)) = f'(g(x))·g'(x)",
      "Fundamental theorem: ∫ₐᵇ f'(x) dx = f(b) - f(a)",
      "Power rule for integrals: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C  (n ≠ -1)",
    ],
    theorem:
      "Fundamental Theorem of Calculus: differentiation and integration are inverse operations — it links the 'instant rate of change' view of the world to the 'total accumulated amount' view, which is why calculus is one coherent subject rather than two.",
    why: "Almost nothing in the physical world is static. Calculus is the language for describing motion, growth, decay, and optimization — anywhere a quantity is changing rather than sitting still.",
  },
  {
    id: "linear-algebra",
    title: "Linear Algebra — Deep Notes",
    intro:
      "Linear algebra studies vectors (quantities with direction and magnitude) and matrices (structured grids of numbers that transform vectors). Its central question: how do linear transformations stretch, rotate, or reshape space?",
    formulas: [
      "Matrix multiplication: (AB)ᵢⱼ = Σₖ Aᵢₖ·Bₖⱼ",
      "Determinant (2×2): det([[a,b],[c,d]]) = ad - bc",
      "Dot product: a·b = |a||b|cos(θ)",
      "Eigen-equation: A·v = λ·v (v = eigenvector, λ = eigenvalue)",
      "Identity matrix: A·I = A for any compatible A",
    ],
    theorem:
      "Eigen-decomposition: for many matrices, there exist special directions (eigenvectors) that the matrix only stretches — never rotates. Those directions and their stretch factors (eigenvalues) reveal the matrix's essential behavior at a glance.",
    why: "Every image filter, recommendation engine, and neural network layer is, underneath, a sequence of matrix operations. Linear algebra is the mathematics of 'many numbers changing together in a structured way.'",
  },
  {
    id: "probability",
    title: "Probability & Statistics — Deep Notes",
    intro:
      "Probability quantifies uncertainty about a single event or process; statistics uses observed data to draw reliable conclusions about a larger, unseen population. Together they're the mathematics of decision-making when you don't have all the facts.",
    formulas: [
      "Probability of independent events: P(A and B) = P(A)·P(B)",
      "Bayes' theorem: P(A|B) = P(B|A)·P(A) / P(B)",
      "Mean: μ = (Σxᵢ) / n",
      "Variance: σ² = (Σ(xᵢ - μ)²) / n",
      "Binomial probability: P(k) = C(n,k)·pᵏ·(1-p)ⁿ⁻ᵏ",
    ],
    theorem:
      "Central Limit Theorem: the average of a large number of independent, identically distributed random variables tends toward a normal (bell-curve) distribution — regardless of the shape of the original distribution. It's the reason the bell curve shows up everywhere.",
    why: "Statistics is how raw data becomes a trustworthy claim. It's the difference between 'I noticed a pattern' and 'I can show this pattern is unlikely to be coincidence.'",
  },
  {
    id: "logic-number-theory",
    title: "Number Theory & Logic — Deep Notes",
    intro:
      "Number theory studies the integers' internal structure — primes, divisibility, and remainders. Formal logic studies the structure of valid argument itself. They're grouped here because both strip a problem down to its bare, symbolic skeleton.",
    formulas: [
      "Modular arithmetic: a ≡ b (mod n) means n | (a - b)",
      "Euclidean algorithm: gcd(a,b) = gcd(b, a mod b)",
      "Fermat's Little Theorem: if p is prime and gcd(a,p)=1, then aᵖ⁻¹ ≡ 1 (mod p)",
      "De Morgan's laws: ¬(P ∧ Q) ≡ ¬P ∨ ¬Q,  ¬(P ∨ Q) ≡ ¬P ∧ ¬Q",
      "Contrapositive equivalence: (P → Q) ≡ (¬Q → ¬P)",
    ],
    theorem:
      "Infinitude of Primes (Euclid): there are infinitely many prime numbers. The classic proof assumes a largest prime exists, constructs a number that must have a prime factor not on the list, and reaches a contradiction — a template for proof-by-contradiction used constantly elsewhere.",
    why: "Modular arithmetic quietly runs modern cryptography (RSA encryption), and formal logic quietly runs every programming language's if-statements and every rigorous argument you'll ever need to make.",
  },
];

type Difficulty = "Medium" | "Hard" | "Very Hard" | "Olympiad";

type Problem = {
  id: number;
  title: string;
  difficulty: Difficulty;
  topic: string;
  statement: string;
  hint: string;
  solution: string;
};

const problems: Problem[] = [
  {
    id: 1,
    title: "The Sum and the Square",
    difficulty: "Medium",
    topic: "Algebra",
    statement: "If a + b = 10 and a² + b² = 58, find the value of ab.",
    hint: "Expand (a + b)² and see what's left over.",
    solution:
      "(a+b)² = a² + 2ab + b², so 10² = 58 + 2ab → 100 - 58 = 2ab → 2ab = 42 → ab = 21.",
  },
  {
    id: 2,
    title: "Divisibility Trap",
    difficulty: "Hard",
    topic: "Number Theory",
    statement:
      "Find all positive integers n such that (n + 7) divides (n² + 7).",
    hint: "Rewrite n² + 7 as (n − 7)(n + 7) plus a fixed remainder, then think about what n + 7 must divide.",
    solution:
      "n² − 49 = (n−7)(n+7), so n² + 7 = (n−7)(n+7) + 56. For n+7 to divide n²+7, it must divide 56. Divisors of 56 are 1, 2, 4, 7, 8, 14, 28, 56. Since n ≥ 1, n+7 ≥ 8, so n+7 ∈ {8, 14, 28, 56}, giving n ∈ {1, 7, 21, 49}.",
  },
  {
    id: 3,
    title: "Handshakes at the Conference",
    difficulty: "Hard",
    topic: "Combinatorics",
    statement:
      "30 people attend a conference. Every pair either shakes hands once or not at all. Prove that at least two attendees shook hands with exactly the same number of other people.",
    hint: "Each person's handshake-count is between 0 and 29 — but can 0 and 29 both occur in the same room?",
    solution:
      "Each of the 30 people has a handshake-count somewhere from 0 to 29 — 30 possible values. But 0 and 29 can never both occur: the person who shook everyone's hand (29) means nobody has 0. So all 30 people's counts actually fall into only 29 possible values. By the pigeonhole principle, at least two people must share a count.",
  },
  {
    id: 4,
    title: "The Mystery Function",
    difficulty: "Very Hard",
    topic: "Functional Equations",
    statement:
      "A function f: ℝ → ℝ satisfies f(x + y) = f(x) + f(y) for all real x, y, and f is monotonically increasing. Prove f(x) = cx for some constant c.",
    hint: "First prove it for integers, then extend to rationals, then use monotonicity to seal the gap for irrationals.",
    solution:
      "Setting x=y=0 gives f(0)=0. By induction, f(nx)=n·f(x) for positive integers n, and f(-x)=-f(x) extends it to negative integers. For a rational p/q, applying the rule q times shows f(p/q)=（p/q)·f(1). So f(x)=cx (c=f(1)) already holds on all rationals. Since f is monotonic and the rationals are dense in the reals, no irrational point can 'jump' away from the line y=cx without breaking monotonicity — squeezing any irrational x between rationals arbitrarily close to it forces f(x)=cx there too.",
  },
  {
    id: 5,
    title: "The Hidden Right Angle",
    difficulty: "Medium",
    topic: "Geometry",
    statement:
      "In triangle ABC, D is the midpoint of BC. If AD = BC / 2, prove that angle BAC = 90°.",
    hint: "Compare AD, BD, and DC — what does it mean if all three are equal?",
    solution:
      "Since D is the midpoint of BC, BD = DC = BC/2. We're told AD = BC/2 too, so AD = BD = DC. That means D is equidistant from A, B, and C — so A, B, C all lie on a circle centered at D with radius BC/2, and BC is a diameter of that circle. By Thales' theorem, any angle inscribed in a semicircle is a right angle, so angle BAC = 90°.",
  },
  {
    id: 6,
    title: "Two Truths, One Lie (or Two)",
    difficulty: "Hard",
    topic: "Logic Puzzle",
    statement:
      "X says: 'Exactly one of us is lying.' Y says: 'X is telling the truth.' Each of X and Y is either always truthful or always lying. Determine who is lying.",
    hint: "Try assuming X is truthful first, follow it to a contradiction, then try the other case.",
    solution:
      "Suppose X is truthful. Then exactly one of the two is lying, and since X is truthful, Y must be the liar. But Y's statement ('X is telling the truth') would then be false — meaning X is lying, contradicting our assumption. So X must be lying. If X is lying, 'exactly one of us is lying' is false, so the count of liars is 0 or 2. X is already a liar, so it can't be 0 — it must be 2. That makes Y a liar as well, and indeed Y's claim ('X is telling the truth') is false, which checks out. Conclusion: both X and Y are lying.",
  },
  {
    id: 7,
    title: "Optimal Box",
    difficulty: "Hard",
    topic: "Calculus",
    statement:
      "A square sheet of side 12 has equal squares of side x cut from each corner; the sides are folded up to form an open-top box. Find the x that maximizes the box's volume, and the maximum volume.",
    hint: "Write volume as a function of x, then use calculus to find its critical point.",
    solution:
      "V(x) = x(12 − 2x)², valid for 0 < x < 6. Differentiating: V'(x) = (12−2x)² + x·2(12−2x)(−2) = (12−2x)[(12−2x) − 4x] = (12−2x)(12−6x). Setting V'(x)=0 gives x=6 (rejected, yields zero volume) or x=2. Checking confirms x=2 is a maximum. Volume: V(2) = 2·(12−4)² = 2·64 = 128 cubic units.",
  },
  {
    id: 8,
    title: "AM-GM Squeeze",
    difficulty: "Olympiad",
    topic: "Inequalities",
    statement:
      "For positive reals a, b, c with a + b + c = 3, prove that ab + bc + ca ≤ 3.",
    hint: "Expand (a+b+c)² and compare it to a² + b² + c² and ab + bc + ca.",
    solution:
      "Expanding: (a+b+c)² = a²+b²+c² + 2(ab+bc+ca) = 9. Also, a²+b²+c² ≥ ab+bc+ca always holds (it's equivalent to ½[(a−b)²+(b−c)²+(c−a)²] ≥ 0). Substituting the inequality into the expansion: 9 = a²+b²+c² + 2(ab+bc+ca) ≥ (ab+bc+ca) + 2(ab+bc+ca) = 3(ab+bc+ca). Dividing by 3: ab+bc+ca ≤ 3, with equality exactly when a=b=c=1.",
  },
];

const difficultyColor: Record<Difficulty, string> = {
  Medium: "var(--accent-blue)",
  Hard: "var(--accent-amber)",
  "Very Hard": "var(--accent-violet)",
  Olympiad: "var(--accent-rose)",
};

/* ------------------------------------------------------------------ */
/*  Small components                                                   */
/* ------------------------------------------------------------------ */

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="text-xs tracking-[0.2em] px-2 py-1 rounded-sm border"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--accent-blue)",
          borderColor: "var(--border)",
          background: "var(--surface)",
        }}
      >
        §{n}
      </span>
      <span
        className="text-xs tracking-[0.3em] uppercase"
        style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
      >
        {label}
      </span>
      <span
        className="flex-1 h-px"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, var(--border) 0, var(--border) 4px, transparent 4px, transparent 9px)",
        }}
      />
    </div>
  );
}

function TopicCard({ n, name, blurb }: { n: string; name: string; blurb: string }) {
  return (
    <div
      className="relative p-5 rounded-lg border transition-colors duration-300 hover:border-[var(--accent-blue)]"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <span
        className="absolute top-4 right-5 text-3xl font-semibold select-none"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--border)",
        }}
      >
        {n}
      </span>
      <h3
        className="text-lg font-semibold mb-2 pr-10"
        style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
      >
        {name}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        {blurb}
      </p>
    </div>
  );
}

function NoteAccordionItem({
  note,
  open,
  onToggle,
}: {
  note: Note;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2"
        style={{ ["--tw-ring-color" as any]: "var(--accent-blue)" }}
      >
        <span
          className="text-base sm:text-lg font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
        >
          {note.title}
        </span>
        <span
          className="shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-sm transition-transform duration-300"
          style={{
            borderColor: "var(--border)",
            color: "var(--accent-blue)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>

      {open && (
        <div
          className="px-5 pb-6 pt-1 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--muted)" }}
          >
            {note.intro}
          </p>

          <div
            className="rounded-md border p-4 mb-4"
            style={{ borderColor: "var(--border)", background: "var(--bg)" }}
          >
            <p
              className="text-xs tracking-[0.2em] uppercase mb-3"
              style={{ fontFamily: "var(--font-mono)", color: "var(--accent-blue)" }}
            >
              Key formulas
            </p>
            <ul className="space-y-1.5">
              {note.formulas.map((f, i) => (
                <li
                  key={i}
                  className="text-sm"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-md border-l-4 pl-4 py-2 mb-4"
            style={{ borderColor: "var(--accent-amber)" }}
          >
            <p
              className="text-xs tracking-[0.2em] uppercase mb-1"
              style={{ fontFamily: "var(--font-mono)", color: "var(--accent-amber)" }}
            >
              Core theorem
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
              {note.theorem}
            </p>
          </div>

          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase mb-1"
              style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
            >
              Why it matters
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {note.why}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ProblemCard({ problem }: { problem: Problem }) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div
      className="relative rounded-lg border p-5"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
        borderTop: `3px dashed ${difficultyColor[problem.difficulty]}`,
      }}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className="text-[11px] tracking-[0.15em] uppercase px-2 py-1 rounded-full font-semibold"
          style={{
            fontFamily: "var(--font-mono)",
            color: difficultyColor[problem.difficulty],
            border: `1px solid ${difficultyColor[problem.difficulty]}`,
          }}
        >
          {problem.difficulty}
        </span>
        <span
          className="text-[11px] tracking-[0.15em] uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
        >
          {problem.topic}
        </span>
      </div>

      <h4
        className="text-lg font-semibold mb-2"
        style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
      >
        {problem.title}
      </h4>

      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ink)" }}>
        {problem.statement}
      </p>

      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={() => setShowHint((v) => !v)}
          className="text-xs px-3 py-1.5 rounded-md border transition-colors"
          style={{
            fontFamily: "var(--font-mono)",
            borderColor: "var(--border)",
            color: "var(--accent-blue)",
          }}
        >
          {showHint ? "Hide hint" : "Show hint"}
        </button>
        <button
          onClick={() => setShowSolution((v) => !v)}
          className="text-xs px-3 py-1.5 rounded-md border transition-colors"
          style={{
            fontFamily: "var(--font-mono)",
            borderColor: difficultyColor[problem.difficulty],
            color: difficultyColor[problem.difficulty],
          }}
        >
          {showSolution ? "Hide solution" : "Reveal solution"}
        </button>
      </div>

      {showHint && (
        <p
          className="text-sm italic mt-2 pl-3 border-l-2"
          style={{ color: "var(--muted)", borderColor: "var(--border)" }}
        >
          Hint: {problem.hint}
        </p>
      )}

      {showSolution && (
        <div
          className="mt-3 rounded-md p-4 border"
          style={{ borderColor: "var(--border)", background: "var(--bg)" }}
        >
          <p
            className="text-xs tracking-[0.2em] uppercase mb-2"
            style={{ fontFamily: "var(--font-mono)", color: "var(--accent-green)" }}
          >
            Solution
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
            {problem.solution}
          </p>
          <p
            className="text-right text-sm mt-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--accent-green)" }}
          >
            ∎
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function MathematicsPage() {
  const [openNote, setOpenNote] = useState<string | null>("algebra");

  return (
    <div
      className={`
        ${fraunces.variable} ${inter.variable} ${mono.variable}
        min-h-screen
        [--bg:#FFFFFF] [--surface:#F6F7FB] [--ink:#12151C] [--muted:#5C6472]
        [--border:#E3E6ED] [--accent-blue:#2F54EB] [--accent-amber:#B8791E]
        [--accent-violet:#6D3FD1] [--accent-rose:#C63A56] [--accent-green:#1E9E6B]
        dark:[--bg:#0A0D13] dark:[--surface:#121722] dark:[--ink:#E8ECF4] dark:[--muted:#8B94A6]
        dark:[--border:#232B3A] dark:[--accent-blue:#82A0FF] dark:[--accent-amber:#F0B95B]
        dark:[--accent-violet:#B49BFF] dark:[--accent-rose:#FF7C93] dark:[--accent-green:#4ADE95]
      `}
      style={{
        background: "var(--bg)",
        color: "var(--ink)",
        fontFamily: "var(--font-body)",
        backgroundImage:
          "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        backgroundSize: "42px 42px",
        backgroundAttachment: "fixed",
        transition: "background-color 300ms ease, color 300ms ease",
      }}
    >
      <div
        className="min-h-screen"
        style={{ background: "color-mix(in srgb, var(--bg) 92%, transparent)" }}
      >
        {/* ---------------- Hero ---------------- */}
        <header className="relative px-6 sm:px-10 pt-20 pb-16 max-w-5xl mx-auto">
          <p
            className="text-xs tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "var(--font-mono)", color: "var(--accent-blue)" }}
          >
            Category — Field Notes
          </p>
          <h1
            className="text-5xl sm:text-7xl font-semibold italic leading-[1.05] mb-6"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            Mathematics
          </h1>
          <p
            className="text-lg sm:text-xl leading-relaxed max-w-2xl"
            style={{ color: "var(--muted)" }}
          >
            The discipline of reasoning about quantity, structure, space, and
            change — written down precisely enough that anyone, anywhere,
            checking the same steps, arrives at the same answer.
          </p>
          <div
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm"
            style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
          >
            <span>10 core branches</span>
            <span>6 deep-dive notes</span>
            <span>8 tricky problems</span>
          </div>
        </header>

        <main className="px-6 sm:px-10 max-w-5xl mx-auto pb-28 space-y-24">
          {/* ---------------- Why math ---------------- */}
          <section>
            <SectionLabel n="1" label="Why mathematics" />
            <div className="space-y-4 max-w-3xl">
              <p className="text-base leading-relaxed" style={{ color: "var(--ink)" }}>
                Mathematics exists because the world is full of quantities,
                patterns, and relationships that are too easy to get wrong by
                intuition alone. It gives everyone the same precise
                vocabulary — numbers, variables, functions, proofs — so a
                claim can be checked instead of just believed.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "var(--ink)" }}>
                Every field that makes reliable predictions leans on it:
                physics needs calculus to describe motion, computer science
                needs discrete math and logic to describe algorithms,
                economics needs statistics to separate signal from noise, and
                engineering needs linear algebra to model systems with many
                moving parts at once.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "var(--ink)" }}>
                Even outside a technical career, math is the quiet
                infrastructure of daily decisions — reading interest rates,
                judging a risk, splitting a bill fairly, or noticing when a
                statistic in the news is being used to mislead rather than
                inform.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "var(--ink)" }}>
                Most importantly, mathematics is the one subject where you
                can be <em>certain</em> — not "probably right" but logically
                guaranteed, given the starting assumptions. That certainty is
                rare, and training your mind to reach for it changes how you
                evaluate everything else.
              </p>
            </div>
          </section>

          {/* ---------------- Topics ---------------- */}
          <section>
            <SectionLabel n="2" label="Topics you must know" />
            <div className="grid sm:grid-cols-2 gap-4">
              {topics.map((t) => (
                <TopicCard key={t.n} n={t.n} name={t.name} blurb={t.blurb} />
              ))}
            </div>
          </section>

          {/* ---------------- Logic & Math relationship ---------------- */}
          <section>
            <SectionLabel n="3" label="Logic and mathematics" />
            <p className="text-base leading-relaxed max-w-3xl mb-8" style={{ color: "var(--ink)" }}>
              Mathematics is often described as "applied logic" — logic
              supplies the rules for what counts as a valid step, and math is
              what you build once you apply those rules to numbers, shapes,
              and structures. A mathematical proof is nothing more than an
              unbroken chain of logical inferences, each one following
              necessarily from the last.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {logicSteps.map((s, i) => (
                <div
                  key={s.step}
                  className="rounded-lg border p-4"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs w-6 h-6 rounded-full flex items-center justify-center border"
                      style={{
                        fontFamily: "var(--font-mono)",
                        borderColor: "var(--accent-blue)",
                        color: "var(--accent-blue)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                    >
                      {s.step}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {reasoningModes.map((r) => (
                <div
                  key={r.mode}
                  className="rounded-lg border-l-4 pl-5 py-4"
                  style={{ borderColor: "var(--accent-violet)" }}
                >
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                  >
                    {r.mode}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {r.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- How math improves logic ---------------- */}
          <section>
            <SectionLabel n="4" label="How math sharpens logical thinking" />
            <div className="grid sm:grid-cols-2 gap-4">
              {logicBenefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-lg border p-5"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  <p
                    className="text-base font-semibold mb-2"
                    style={{ fontFamily: "var(--font-display)", color: "var(--accent-blue)" }}
                  >
                    {b.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- Detailed notes ---------------- */}
          <section>
            <SectionLabel n="5" label="Detailed notes by branch" />
            <p className="text-sm leading-relaxed max-w-3xl mb-6" style={{ color: "var(--muted)" }}>
              Expand a branch for its core formulas, one landmark theorem,
              and why the branch earns its place in the curriculum.
            </p>
            <div className="space-y-3">
              {notes.map((n) => (
                <NoteAccordionItem
                  key={n.id}
                  note={n}
                  open={openNote === n.id}
                  onToggle={() => setOpenNote(openNote === n.id ? null : n.id)}
                />
              ))}
            </div>
          </section>

          {/* ---------------- Problems ---------------- */}
          <section>
            <SectionLabel n="6" label="Tricky & hard problems" />
            <p className="text-sm leading-relaxed max-w-3xl mb-6" style={{ color: "var(--muted)" }}>
              Try each problem before revealing the hint or solution — the
              struggle is where the logic-building actually happens.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {problems.map((p) => (
                <ProblemCard key={p.id} problem={p} />
              ))}
            </div>
          </section>

          {/* ---------------- Footer note ---------------- */}
          <footer
            className="pt-10 border-t text-sm leading-relaxed"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            <p>
              Mathematics rewards revisiting. Come back to the hard problems
              after a few days - the second attempt is where the real
              learning shows up.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}