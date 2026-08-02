"use client";

import { useMemo, useState } from "react";

/**
 * /category/probability
 * -------------------------------------------------------------------------
 * A self-contained study page for Probability — aimed at developers and
 * ML learners. It assumes Tailwind CSS with class-based dark mode
 * (darkMode: "class") is already configured in the project, and that the
 * header's light/dark toggle flips a `dark` class on <html> or <body>.
 * No extra setup is required beyond that — this file has no external
 * dependencies besides React state.
 *
 * Drop this file at: app/category/probability/page.tsx
 * Put your notes PDF at: public/downloads/probability-note.pdf
 * ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/*  Content data                                                          */
/* ---------------------------------------------------------------------- */

type Topic = {
  id: string;
  title: string;
  tag: string;
  formula: string;
  notes: string[];
};

const TOPICS: Topic[] = [
  {
    id: "sample-space",
    title: "Sample Space, Events & Axioms",
    tag: "Foundations",
    formula: "S = {all outcomes},  A ⊆ S,  0 ≤ P(A) ≤ 1,  P(S) = 1",
    notes: [
      "Every probability problem starts by naming the sample space — the full set of things that could happen — before asking about any one event inside it.",
      "The three Kolmogorov axioms (non-negativity, total probability 1, additivity over disjoint events) are the rules every distribution you'll ever code against must obey.",
      "In code, this is why you validate that your softmax output, your histogram, or your random.choice weights sum to 1 — you're enforcing P(S) = 1 by hand.",
    ],
  },
  {
    id: "conditional",
    title: "Conditional Probability & Independence",
    tag: "Foundations",
    formula: "P(A | B) = P(A ∩ B) / P(B),   A ⟂ B  ⟺  P(A ∩ B) = P(A)·P(B)",
    notes: [
      "Conditional probability is 'given what I now know, how does my belief change?' — the single idea behind spam filters, recommender systems, and search ranking.",
      "Independence is the assumption that lets you multiply probabilities instead of doing joint bookkeeping — it's also the assumption Naive Bayes makes (and gets away with) on purpose.",
      "Bugs hide here: treating correlated events (two API calls to the same flaky service) as independent will make your reliability math wildly optimistic.",
    ],
  },
  {
    id: "bayes",
    title: "Bayes' Theorem",
    tag: "Foundations",
    formula: "P(A | B) = [ P(B | A) · P(A) ] / P(B)",
    notes: [
      "Bayes flips the direction of a conditional: from 'probability of evidence given a cause' to 'probability of a cause given evidence' — exactly what diagnosis, debugging, and A/B test reads require.",
      "P(A) is your prior belief, P(B|A) is the likelihood of the evidence under that belief, and P(A|B) is the updated posterior — this prior → likelihood → posterior pipeline is the whole idea behind Bayesian ML.",
      "Spam filters, medical test interpretation, and Bayesian A/B testing dashboards are all just this one formula applied repeatedly.",
    ],
  },
  {
    id: "random-variables",
    title: "Random Variables",
    tag: "Foundations",
    formula: "X : S → ℝ   (discrete X takes countable values, continuous X takes a range)",
    notes: [
      "A random variable is just a function that turns a messy outcome ('user clicked', 'server crashed') into a number you can compute with.",
      "This is the translation layer that lets you write `X = 1 if event else 0` in code and then reason about `E[X]`, `Var(X)` etc. like any other number.",
      "Discrete vs. continuous decides which toolbox you reach for: sums and PMFs, or integrals and PDFs.",
    ],
  },
  {
    id: "pmf-pdf-cdf",
    title: "PMF, PDF & CDF",
    tag: "Distributions",
    formula: "PMF: P(X = x)   |   PDF: f(x), ∫f(x)dx = 1   |   CDF: F(x) = P(X ≤ x)",
    notes: [
      "PMF answers 'what's the probability of exactly this value' (discrete); PDF is its continuous cousin — it's a density, not a probability, so only areas under it mean anything.",
      "CDF answers 'probability of this value or less' and is what `np.percentile`, `scipy.stats.<dist>.cdf`, and percentile-based SLOs (p95 latency!) are built on.",
      "Sampling from any distribution in code (`np.random.normal`, `torch.rand`) ultimately relies on inverting a CDF — the inverse-transform sampling trick.",
    ],
  },
  {
    id: "expectation-variance",
    title: "Expectation, Variance & Moments",
    tag: "Distributions",
    formula: "E[X] = Σ x·P(x)   |   Var(X) = E[(X−E[X])²] = E[X²] − E[X]²",
    notes: [
      "Expectation is the long-run average — the number your Monte Carlo simulation converges to as you run more trials.",
      "Variance measures how much outcomes swing around that average — this is the mathematical backbone of confidence intervals, error bars, and 'how many samples do I need' calculations.",
      "In ML, minimizing expected loss E[Loss] over the data distribution is literally the training objective of almost every model.",
    ],
  },
  {
    id: "discrete-distributions",
    title: "Bernoulli, Binomial & Geometric",
    tag: "Distributions",
    formula: "Bernoulli(p): P(1)=p  |  Binomial(n,p): C(n,k)pᵏ(1−p)ⁿ⁻ᵏ  |  Geometric(p): (1−p)ᵏ⁻¹p",
    notes: [
      "Bernoulli models a single coin flip / boolean event — it's the atom every other discrete distribution is built from (a click, a bit, a pass/fail test).",
      "Binomial counts 'how many successes in n independent trials' — the math behind A/B test significance and retry-success counting.",
      "Geometric answers 'how many tries until the first success' — useful for modeling retries with backoff and expected attempts until an event fires.",
    ],
  },
  {
    id: "poisson",
    title: "Poisson Distribution",
    tag: "Distributions",
    formula: "P(X = k) = (λᵏ e^−λ) / k!",
    notes: [
      "Poisson models the count of independent events in a fixed window — requests per second, errors per hour, packets per interval.",
      "It's the default assumption behind load-testing math and queueing theory (which itself powers autoscaling and rate-limiter design).",
      "The key parameter λ is both the mean and the variance — a fingerprint that helps you recognize Poisson-shaped data in metrics dashboards.",
    ],
  },
  {
    id: "uniform-normal-exponential",
    title: "Uniform, Normal & Exponential",
    tag: "Distributions",
    formula: "Uniform: f(x)=1/(b−a)  |  Normal: f(x)= (1/√(2πσ²)) e^−(x−μ)²/2σ²  |  Exponential: f(x)=λe^−λx",
    notes: [
      "Uniform is 'no outcome preferred' — the distribution behind `random()` itself and the seed for generating every other distribution.",
      "Normal (Gaussian) shows up everywhere because of the Central Limit Theorem — weight initialization, noise modeling, and z-score anomaly detection all lean on it.",
      "Exponential models 'time until the next event' when events arrive at a constant average rate — the continuous sibling of the Geometric distribution, used for time-between-failures and session-length modeling.",
    ],
  },
  {
    id: "joint-marginal",
    title: "Joint, Marginal & Conditional Distributions",
    tag: "Multivariate",
    formula: "P(X,Y) joint   |   P(X)=Σ_y P(X,y) marginal   |   P(X|Y)=P(X,Y)/P(Y)",
    notes: [
      "Real data almost never has one variable — joint distributions describe how several signals move together (price and demand, latency and error rate).",
      "Marginalizing means 'summing/integrating out the variables you don't care about right now' — exactly what a GROUP BY + aggregate query does to a joint table of events.",
      "Feature correlation matrices, multivariate Gaussians, and graphical models all start from this idea.",
    ],
  },
  {
    id: "covariance-correlation",
    title: "Covariance & Correlation",
    tag: "Multivariate",
    formula: "Cov(X,Y) = E[XY] − E[X]E[Y]   |   ρ = Cov(X,Y) / (σ_X σ_Y),  −1 ≤ ρ ≤ 1",
    notes: [
      "Covariance tells you whether two variables move together (positive), oppositely (negative), or don't care about each other (near zero).",
      "Correlation is covariance rescaled to a fixed range so it's comparable across features — the basis of feature-selection heatmaps and multicollinearity checks before training a model.",
      "Remember: correlation is not causation — two metrics can move together because both are driven by a hidden third factor.",
    ],
  },
  {
    id: "lln-clt",
    title: "Law of Large Numbers & Central Limit Theorem",
    tag: "Limit theorems",
    formula: "LLN: x̄ₙ → μ as n → ∞   |   CLT: (x̄ₙ − μ)/(σ/√n) → N(0,1)",
    notes: [
      "LLN is *why* averaging more samples gets you closer to the truth — it's the justification for every 'run it 10,000 times and average' Monte Carlo simulation.",
      "CLT is the surprising part: no matter the shape of the original data, the distribution of a *sample mean* looks Gaussian once n is large enough — this is why so many statistical tests default to normal-based confidence intervals.",
      "This pair is the theoretical foundation for A/B testing, polling, and 'how many users do I need before I trust this metric'.",
    ],
  },
  {
    id: "markov-chains",
    title: "Markov Chains",
    tag: "Stochastic processes",
    formula: "P(Xₙ₊₁ = s | Xₙ, Xₙ₋₁, …, X₀) = P(Xₙ₊₁ = s | Xₙ)",
    notes: [
      "The 'memoryless' property — the future depends only on the current state, not the full history — is what makes a system a Markov chain.",
      "This is the model behind PageRank, text-generation n-gram models, game AI state machines, and finite-state randomized algorithms.",
      "Transition matrices in a Markov chain are exactly the kind of stochastic matrix you'd represent as a 2D array and multiply repeatedly in code to find steady-state behavior.",
    ],
  },
  {
    id: "mle-bayesian",
    title: "MLE & Bayesian Inference",
    tag: "Estimation",
    formula: "θ̂_MLE = argmax_θ  P(data | θ)   |   Posterior ∝ Likelihood × Prior",
    notes: [
      "Maximum Likelihood Estimation asks: 'which parameter value makes the data I actually observed most probable?' — this is literally what `model.fit()` is doing under the hood for most models.",
      "Training a neural net by minimizing cross-entropy loss *is* Maximum Likelihood Estimation in disguise — the loss function is the negative log-likelihood.",
      "Bayesian inference goes one step further and keeps a full distribution over parameters instead of a single best guess, which is where uncertainty estimates and Bayesian neural networks come from.",
    ],
  },
  {
    id: "information-theory",
    title: "Entropy, Cross-Entropy & KL Divergence",
    tag: "Information theory",
    formula: "H(p) = −Σ p(x)log p(x)  |  H(p,q) = −Σ p(x)log q(x)  |  KL(p‖q) = Σ p(x)log(p(x)/q(x))",
    notes: [
      "Entropy measures how 'surprising' a distribution is on average — a fair coin has more entropy than a biased one, meaning more information per flip.",
      "Cross-entropy is exactly the standard loss function for classification models — it directly measures how far your predicted probability distribution is from the true labels.",
      "KL divergence measures the gap between two distributions and shows up in variational autoencoders, model distillation, and reinforcement learning policy updates.",
    ],
  },
  {
    id: "monte-carlo",
    title: "Monte Carlo Methods",
    tag: "Simulation",
    formula: "E[f(X)] ≈ (1/n) Σ f(xᵢ),   xᵢ ~ distribution",
    notes: [
      "Whenever an integral or expectation is too hard to solve by hand, sample from the distribution many times and average — that's the entire idea.",
      "This powers dropout-based uncertainty estimation, reinforcement learning rollouts, ray-traced rendering, and randomized load testing.",
      "The accuracy grows with √n, not n — which is why simulations need surprisingly many samples to shave off the last bit of error (this itself follows from CLT).",
    ],
  },
  {
    id: "combinatorics",
    title: "Combinatorics: Permutations & Combinations",
    tag: "Counting",
    formula: "Permutations: n!/(n−r)!   |   Combinations: C(n,r) = n!/(r!(n−r)!)",
    notes: [
      "Before you can compute a probability, you often need to count outcomes — combinatorics is that counting toolkit.",
      "Order matters → permutations (arranging a leaderboard); order doesn't matter → combinations (choosing a team, a subset of features).",
      "Hashing collision estimates (the birthday paradox), password entropy, and combinatorial explosion in brute-force algorithms all trace back here.",
    ],
  },
];

type Problem = {
  id: string;
  prompt: string;
  hint: string;
  solution: string;
};

const PROBLEMS: Problem[] = [
  {
    id: "p1",
    prompt:
      "A fair six-sided die is rolled twice. What is the probability that the sum of the two rolls equals 8?",
    hint: "List the (die1, die2) pairs that sum to 8 out of all 36 equally likely pairs.",
    solution:
      "Pairs summing to 8: (2,6) (3,5) (4,4) (5,3) (6,2) → 5 favorable outcomes out of 36. P = 5/36 ≈ 0.139.",
  },
  {
    id: "p2",
    prompt:
      "A spam filter flags 1% of all real emails and 90% of all spam. If 5% of incoming email is spam, what is P(spam | flagged)?",
    hint: "This is a direct Bayes' theorem setup — build P(flagged) from both the spam and not-spam paths first.",
    solution:
      "P(flagged) = P(flagged|spam)P(spam) + P(flagged|not spam)P(not spam) = 0.90(0.05) + 0.01(0.95) = 0.045 + 0.0095 = 0.0545. " +
      "P(spam|flagged) = 0.045 / 0.0545 ≈ 0.826, so about 82.6% of flagged emails are truly spam.",
  },
  {
    id: "p3",
    prompt:
      "You call a flaky API with a 20% chance of failing on each independent attempt, and you retry up to 3 times. What is the probability all 3 attempts fail?",
    hint: "Independent failures multiply: this is a Binomial/Bernoulli chain, not an 'OR' of probabilities.",
    solution:
      "P(all 3 fail) = 0.2 × 0.2 × 0.2 = 0.008 = 0.8%. Note P(at least one succeeds) = 1 − 0.008 = 99.2% — this is exactly the math behind retry-with-backoff reliability budgets.",
  },
  {
    id: "p4",
    prompt:
      "A discrete random variable X takes values 0, 1, 2 with probabilities 0.5, 0.3, 0.2. Compute E[X] and Var(X).",
    hint: "E[X] = Σx·P(x). For variance, compute E[X²] first, then subtract E[X]².",
    solution:
      "E[X] = 0(0.5) + 1(0.3) + 2(0.2) = 0.7. E[X²] = 0(0.5) + 1(0.3) + 4(0.2) = 1.1. Var(X) = 1.1 − 0.7² = 1.1 − 0.49 = 0.61.",
  },
  {
    id: "p5",
    prompt:
      "A server receives requests at an average rate of 4 per minute (Poisson). What is the probability it receives exactly 2 requests in a given minute?",
    hint: "Plug λ = 4 and k = 2 into the Poisson PMF.",
    solution:
      "P(X=2) = (4² · e⁻⁴) / 2! = (16 × 0.0183) / 2 ≈ 0.1465, so about 14.7%.",
  },
  {
    id: "p6",
    prompt:
      "Two binary classifiers, A and B, each independently predict correctly with probability 0.8. If you use 'majority of 1' (either one being right counts, since there are only 2), what's the probability at least one is correct?",
    hint: "It's often easier to compute the complement: both wrong.",
    solution:
      "P(both wrong) = 0.2 × 0.2 = 0.04. P(at least one correct) = 1 − 0.04 = 0.96 — a small illustration of why ensembling independent-ish models tends to raise reliability.",
  },
];

type Quiz = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

const QUIZ: Quiz[] = [
  {
    id: "q1",
    question: "Which rule must every valid probability distribution satisfy?",
    options: [
      "Probabilities can be negative if the event is rare",
      "All probabilities sum (or integrate) to exactly 1",
      "Every event must have probability ≥ 0.5",
      "Only continuous variables need a defined CDF",
    ],
    correct: 1,
    explanation:
      "Total probability over the sample space must equal 1 — this is one of the Kolmogorov axioms and the reason softmax outputs and histogram bins must sum to 1.",
  },
  {
    id: "q2",
    question: "In machine learning, minimizing cross-entropy loss is equivalent to:",
    options: [
      "Maximizing the variance of predictions",
      "Performing Maximum Likelihood Estimation",
      "Computing the covariance of features",
      "Running a Markov chain simulation",
    ],
    correct: 1,
    explanation:
      "Cross-entropy loss is the negative log-likelihood of the true labels under the model's predicted distribution — minimizing it is exactly MLE.",
  },
  {
    id: "q3",
    question: "What does the Central Limit Theorem tell you?",
    options: [
      "Individual data points always become normally distributed",
      "The sample mean's distribution approaches Normal as sample size grows, regardless of the original distribution's shape",
      "Variance always decreases to zero given enough data",
      "Bayes' theorem only works for large samples",
    ],
    correct: 1,
    explanation:
      "CLT is about the sampling distribution of the mean, not individual data points — it's why so many statistical tests default to Gaussian-based confidence intervals.",
  },
  {
    id: "q4",
    question: "A Bloom filter's false-positive behavior is best modeled using ideas from:",
    options: [
      "Markov chains only",
      "Combinatorics and probability of hash collisions",
      "Linear regression",
      "Central tendency measures only",
    ],
    correct: 1,
    explanation:
      "Bloom filter false-positive rates are derived from combinatorial hash-collision probability — the same family of reasoning as the birthday paradox.",
  },
  {
    id: "q5",
    question: "Dropout during neural network training can be modeled as:",
    options: [
      "A Poisson process over layers",
      "Each unit being multiplied by an independent Bernoulli random variable",
      "A deterministic scaling rule with no randomness",
      "A Markov chain over gradients",
    ],
    correct: 1,
    explanation:
      "Dropout zeroes each unit independently with some probability p — exactly a Bernoulli(1−p) mask applied per unit, per forward pass.",
  },
  {
    id: "q6",
    question: "If P(A) and P(B) are independent, which is true?",
    options: [
      "P(A ∩ B) = P(A) + P(B)",
      "P(A ∩ B) = P(A) · P(B)",
      "P(A | B) = P(B | A)",
      "P(A ∪ B) = P(A) · P(B)",
    ],
    correct: 1,
    explanation:
      "Independence means the joint probability factorizes into the product of the individual probabilities — this is the defining equation.",
  },
];

const CHEATSHEET: { group: string; rows: { name: string; formula: string }[] }[] = [
  {
    group: "Core rules",
    rows: [
      { name: "Complement", formula: "P(Aᶜ) = 1 − P(A)" },
      { name: "Union (general)", formula: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)" },
      { name: "Conditional", formula: "P(A|B) = P(A ∩ B) / P(B)" },
      { name: "Independence", formula: "P(A ∩ B) = P(A)·P(B)" },
      { name: "Bayes' theorem", formula: "P(A|B) = P(B|A)P(A) / P(B)" },
    ],
  },
  {
    group: "Expectation & spread",
    rows: [
      { name: "Expectation", formula: "E[X] = Σ x·P(x)  (or ∫ x f(x) dx)" },
      { name: "Variance", formula: "Var(X) = E[X²] − E[X]²" },
      { name: "Std deviation", formula: "σ = √Var(X)" },
      { name: "Covariance", formula: "Cov(X,Y) = E[XY] − E[X]E[Y]" },
      { name: "Linearity of E", formula: "E[aX + bY] = aE[X] + bE[Y]  (always true)" },
    ],
  },
  {
    group: "Named distributions",
    rows: [
      { name: "Bernoulli(p)", formula: "E = p, Var = p(1−p)" },
      { name: "Binomial(n,p)", formula: "E = np, Var = np(1−p)" },
      { name: "Poisson(λ)", formula: "E = λ, Var = λ" },
      { name: "Uniform(a,b)", formula: "E = (a+b)/2, Var = (b−a)²/12" },
      { name: "Normal(μ,σ²)", formula: "E = μ, Var = σ²" },
      { name: "Exponential(λ)", formula: "E = 1/λ, Var = 1/λ²" },
    ],
  },
  {
    group: "ML-relevant",
    rows: [
      { name: "Entropy", formula: "H(p) = −Σ p(x) log p(x)" },
      { name: "Cross-entropy loss", formula: "H(p,q) = −Σ p(x) log q(x)" },
      { name: "KL divergence", formula: "KL(p‖q) = Σ p(x) log(p(x)/q(x))" },
      { name: "Log-likelihood", formula: "ℓ(θ) = Σ log P(xᵢ | θ)" },
      { name: "Softmax", formula: "P(class k) = eᶻᵏ / Σⱼ eᶻʲ" },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/*  Small building blocks                                                 */
/* ---------------------------------------------------------------------- */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#5B5FEF] dark:text-[#9297FF] mb-3">
      {children}
    </p>
  );
}

/** The recurring "probability spectrum" divider — a 0→1 gradient bar with
 *  tick labels. Doubles as the live indicator in the hero coin-flip demo. */
function SpectrumBar({ value }: { value?: number }) {
  const pct = value === undefined ? null : Math.min(1, Math.max(0, value)) * 100;
  return (
    <div className="w-full select-none">
      <div className="relative h-2.5 rounded-full bg-gradient-to-r from-[#EDEBFF] via-[#C9CBFB] to-[#5B5FEF] dark:from-[#1B1E2C] dark:via-[#33355A] dark:to-[#7A7EFF] overflow-visible">
        {pct !== null && (
          <div
            className="absolute -top-1.5 h-5 w-5 rounded-full border-2 border-white dark:border-[#0B0E14] bg-[#F2A93B] shadow-md transition-all duration-500 ease-out"
            style={{ left: `calc(${pct}% - 10px)` }}
            aria-hidden
          />
        )}
      </div>
      <div className="flex justify-between mt-1.5 font-mono text-[10px] text-[#5B6270] dark:text-[#8B93A7]">
        <span>0</span>
        <span>0.25</span>
        <span>0.5</span>
        <span>0.75</span>
        <span>1</span>
      </div>
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "rounded-2xl border border-[#E4E7EF] dark:border-[#232838] bg-[#F6F7FB] dark:bg-[#131722] p-6 " +
        className
      }
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Page                                                                  */
/* ---------------------------------------------------------------------- */

export default function ProbabilityPage() {
  /* Hero coin-flip demo — ties Law of Large Numbers to a live interaction */
  const [flips, setFlips] = useState(0);
  const [heads, setHeads] = useState(0);
  const [lastFlip, setLastFlip] = useState<"H" | "T" | null>(null);

  const empirical = flips === 0 ? undefined : heads / flips;

  function flipCoin(times: number) {
    let newHeads = 0;
    for (let i = 0; i < times; i++) {
      if (Math.random() < 0.5) newHeads++;
    }
    setLastFlip(Math.random() < 0.5 ? "H" : "T");
    setFlips((f) => f + times);
    setHeads((h) => h + newHeads);
  }

  function resetCoin() {
    setFlips(0);
    setHeads(0);
    setLastFlip(null);
  }

  /* Topics accordion */
  const [openTopic, setOpenTopic] = useState<string | null>(TOPICS[0].id);

  /* Practice problems — per-item solution toggle */
  const [shownSolutions, setShownSolutions] = useState<Record<string, boolean>>({});
  function toggleSolution(id: string) {
    setShownSolutions((s) => ({ ...s, [id]: !s[id] }));
  }

  /* Quiz state */
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(
    () => QUIZ.filter((q) => answers[q.id] === q.correct).length,
    [answers]
  );

  function selectAnswer(qid: string, idx: number) {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [qid]: idx }));
  }

  function submitQuiz() {
    setSubmitted(true);
  }

  function retakeQuiz() {
    setAnswers({});
    setSubmitted(false);
  }

  const navLinks = [
    { href: "#why", label: "Why probability" },
    { href: "#coding", label: "Coding & logic" },
    { href: "#ml", label: "Training models" },
    { href: "#topics", label: "Topics" },
    { href: "#problems", label: "Problems" },
    { href: "#quiz", label: "Quiz" },
    { href: "#cheatsheet", label: "Cheat sheet" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0E14] text-[#14171F] dark:text-[#E7E9EE] transition-colors duration-300">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap");
        .font-display {
          font-family: "Fraunces", ui-serif, Georgia, serif;
        }
        .font-body {
          font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
        }
        .font-formula {
          font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.001ms !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>

      <div className="font-body">
        {/* ---------------------------------------------------------- */}
        {/* In-page nav                                                 */}
        {/* ---------------------------------------------------------- */}
        <nav className="sticky top-0 z-30 border-b border-[#E4E7EF] dark:border-[#232838] bg-white/85 dark:bg-[#0B0E14]/85 backdrop-blur">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-1 overflow-x-auto">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="whitespace-nowrap px-3 py-1.5 rounded-full text-sm text-[#5B6270] dark:text-[#8B93A7] hover:text-[#14171F] dark:hover:text-[#E7E9EE] hover:bg-[#F6F7FB] dark:hover:bg-[#131722] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-6">
          {/* -------------------------------------------------------- */}
          {/* Hero                                                     */}
          {/* -------------------------------------------------------- */}
          <section className="pt-16 pb-12">
            <SectionEyebrow>Category · Mathematics for Software</SectionEyebrow>
            <h1 className="font-display font-semibold text-5xl sm:text-6xl leading-[1.05] mb-5">
              Probability
            </h1>
            <p className="max-w-2xl text-lg text-[#3A3F4B] dark:text-[#C4C9D4] mb-10">
              The math of what you don't know for certain - and the toolkit
              behind randomized algorithms, A/B tests, spam filters, and every
              model that learns from data. This page is a deep, practical
              walkthrough: why it matters, how it shapes the way you write
              code, how it drives model training, and everything worth
              knowing in between.
            </p>

            <Card className="!bg-[#FBFBFD] dark:!bg-[#0F1219]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#5B6270] dark:text-[#8B93A7] mb-1">
                    Live demo — Law of Large Numbers
                  </p>
                  <p className="text-sm text-[#3A3F4B] dark:text-[#C4C9D4] max-w-md">
                    Flip a simulated fair coin. Watch the empirical
                    probability of heads wobble at first, then settle toward
                    0.5 as the number of flips grows.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => flipCoin(1)}
                    className="px-4 py-2 rounded-lg bg-[#5B5FEF] text-white text-sm font-medium hover:bg-[#4A4EDB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B5FEF] transition-colors"
                  >
                    Flip ×1
                  </button>
                  <button
                    onClick={() => flipCoin(100)}
                    className="px-4 py-2 rounded-lg bg-[#EDEBFF] dark:bg-[#1B1E2C] text-[#5B5FEF] dark:text-[#9297FF] text-sm font-medium hover:bg-[#DEDBFF] dark:hover:bg-[#242841] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B5FEF] transition-colors"
                  >
                    Flip ×100
                  </button>
                  <button
                    onClick={resetCoin}
                    className="px-4 py-2 rounded-lg border border-[#E4E7EF] dark:border-[#232838] text-sm font-medium text-[#5B6270] dark:text-[#8B93A7] hover:bg-[#F6F7FB] dark:hover:bg-[#131722] transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <SpectrumBar value={empirical} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 font-formula text-sm">
                <span>
                  Flips: <strong>{flips}</strong>
                </span>
                <span>
                  Heads: <strong>{heads}</strong>
                </span>
                <span>
                  P(heads) empirical:{" "}
                  <strong>{empirical === undefined ? "—" : empirical.toFixed(3)}</strong>
                </span>
                <span>
                  Last flip: <strong>{lastFlip ?? "—"}</strong>
                </span>
              </div>
            </Card>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/downloads/probability-note.pdf"
                download
                className="group mt-10 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M12 3v12" />
                  <path d="M7 10l5 5 5-5" />
                  <path d="M4 19h16" />
                </svg>
                Download probability notes (PDF)
              </a>
              <a
                href="#topics"
                className="inline-flex items-center px-5 py-3 rounded-xl border border-[#E4E7EF] dark:border-[#232838] text-sm font-semibold text-[#3A3F4B] dark:text-[#C4C9D4] hover:bg-[#F6F7FB] dark:hover:bg-[#131722] transition-colors"
              >
                Jump to topics
              </a>
            </div>
          </section>

          {/* -------------------------------------------------------- */}
          {/* Why probability                                          */}
          {/* -------------------------------------------------------- */}
          <section id="why" className="py-12 scroll-mt-20">
            <SectionEyebrow>01 · Why it's needed</SectionEyebrow>
            <h2 className="font-display font-semibold text-3xl mb-6">
              The world your code runs in is uncertain
            </h2>
            <p className="text-[#3A3F4B] dark:text-[#C4C9D4] max-w-3xl mb-8">
              Deterministic logic assumes clean inputs and known outcomes. Real
              systems don't work that way — networks drop packets, users
              behave unpredictably, sensors have noise, and data is never a
              perfect sample of the world. Probability is the formal language
              for reasoning correctly under that uncertainty, instead of
              guessing.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Decisions under uncertainty",
                  body: "Should you retry a request, cache a result, or roll back a deploy? Every one of these is a bet, and probability tells you the odds.",
                },
                {
                  title: "Measuring what's real",
                  body: "A/B tests, error rates, and latency percentiles are only meaningful once you know how much natural variation to expect.",
                },
                {
                  title: "Modeling noisy signals",
                  body: "Sensors, user behavior, and network conditions are inherently random — probability lets you build systems that are robust to that noise instead of broken by it.",
                },
                {
                  title: "Foundation of machine learning",
                  body: "Every model that 'learns from data' is, under the hood, estimating a probability distribution and updating its beliefs as evidence arrives.",
                },
              ].map((item) => (
                <Card key={item.title}>
                  <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-[#5B6270] dark:text-[#8B93A7]">
                    {item.body}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* -------------------------------------------------------- */}
          {/* Coding & logic building                                  */}
          {/* -------------------------------------------------------- */}
          <section id="coding" className="py-12 scroll-mt-20">
            <SectionEyebrow>02 · How it shapes coding & logic</SectionEyebrow>
            <h2 className="font-display font-semibold text-3xl mb-6">
              It changes how you write and reason about code
            </h2>
            <p className="text-[#3A3F4B] dark:text-[#C4C9D4] max-w-3xl mb-8">
              Probability isn't just theory that sits beside your code — it
              directly shapes data structures, algorithms, and how you test
              and reason about correctness.
            </p>
            <div className="space-y-4">
              {[
                {
                  h: "Randomized algorithms",
                  b: "Quicksort's random pivot, skip lists, and randomized load balancing all use randomness to guarantee good average-case behavior, trading worst-case determinism for expected performance.",
                },
                {
                  h: "Probabilistic data structures",
                  b: "Bloom filters, HyperLogLog, and count-min sketches trade a small, mathematically bounded error probability for massive memory savings — you can't reason about them without probability.",
                },
                {
                  h: "Hashing & collisions",
                  b: "Understanding hash collision probability (a direct application of the birthday paradox) explains why hash table sizing and hash function quality matter.",
                },
                {
                  h: "Testing & fuzzing",
                  b: "Property-based testing and fuzzers generate random inputs and rely on probability to argue that enough trials will surface edge cases.",
                },
                {
                  h: "Caching & eviction",
                  b: "Some cache eviction and sampling strategies use randomization (e.g. random replacement, reservoir sampling) that only make sense once you can reason about expected hit rates.",
                },
                {
                  h: "Concurrency & reliability",
                  b: "Retry policies, exponential backoff, timeouts, and circuit breakers are all designed around the probability of transient failure.",
                },
                {
                  h: "Security & cryptography",
                  b: "Key generation, nonces, and salts depend on strong randomness — probability theory is what lets you reason about how hard they are to guess.",
                },
              ].map((item) => (
                <div
                  key={item.h}
                  className="flex gap-4 pb-4 border-b border-[#E4E7EF] dark:border-[#232838] last:border-none"
                >
                  <div className="mt-1 h-2 w-2 rounded-full bg-[#5B5FEF] shrink-0" />
                  <div>
                    <h3 className="font-semibold text-base">{item.h}</h3>
                    <p className="text-sm text-[#5B6270] dark:text-[#8B93A7] mt-1">
                      {item.b}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* -------------------------------------------------------- */}
          {/* Training models                                          */}
          {/* -------------------------------------------------------- */}
          <section id="ml" className="py-12 scroll-mt-20">
            <SectionEyebrow>03 · How it drives model training</SectionEyebrow>
            <h2 className="font-display font-semibold text-3xl mb-6">
              Machine learning is applied probability
            </h2>
            <p className="text-[#3A3F4B] dark:text-[#C4C9D4] max-w-3xl mb-8">
              Strip away the frameworks and a training loop is: assume a
              probability distribution shape, measure how well it fits the
              data, and nudge its parameters to fit better. Here's where
              probability shows up directly in the pipeline.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Loss functions are likelihoods",
                  body: "Cross-entropy, the default classification loss, is the negative log-likelihood of your labels under the model's predicted distribution. Minimizing loss = Maximum Likelihood Estimation.",
                },
                {
                  title: "Weight initialization",
                  body: "Neural network weights are typically drawn from Normal or Uniform distributions with carefully chosen variance (Xavier/He init) so gradients neither explode nor vanish.",
                },
                {
                  title: "Regularization as priors",
                  body: "L2 regularization is equivalent to assuming a Gaussian prior over weights in a Bayesian framing — 'shrink weights toward zero' is a probabilistic belief, not just a penalty term.",
                },
                {
                  title: "Dropout is a Bernoulli mask",
                  body: "Each unit is independently zeroed with probability p during training — a direct, literal application of the Bernoulli distribution as a regularizer.",
                },
                {
                  title: "Generative models",
                  body: "GANs, VAEs, and diffusion models are explicitly trying to learn and sample from a probability distribution that matches real data.",
                },
                {
                  title: "Uncertainty & confidence",
                  body: "Softmax outputs, Bayesian neural nets, and Monte Carlo dropout all let a model say 'how sure am I', which is essential for safety-critical predictions.",
                },
                {
                  title: "Naive Bayes & probabilistic classifiers",
                  body: "Some classifiers apply Bayes' theorem directly, assuming feature independence to make classification tractable and fast.",
                },
                {
                  title: "Evaluation & significance",
                  body: "Comparing two models' accuracy fairly requires statistical significance testing — otherwise you can't tell a real improvement from random noise.",
                },
              ].map((item) => (
                <Card key={item.title}>
                  <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-[#5B6270] dark:text-[#8B93A7]">
                    {item.body}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* -------------------------------------------------------- */}
          {/* Topics deep dive                                         */}
          {/* -------------------------------------------------------- */}
          <section id="topics" className="py-12 scroll-mt-20">
            <SectionEyebrow>04 · Topics to master</SectionEyebrow>
            <h2 className="font-display font-semibold text-3xl mb-2">
              The full curriculum, with deep-dive notes
            </h2>
            <p className="text-[#3A3F4B] dark:text-[#C4C9D4] max-w-3xl mb-8">
              Tap a topic to expand it. Each one includes the core formula and
              why it actually matters for coding and machine learning — not
              just the theory.
            </p>

            <div className="space-y-3">
              {TOPICS.map((t) => {
                const open = openTopic === t.id;
                return (
                  <div
                    key={t.id}
                    className="rounded-2xl border border-[#E4E7EF] dark:border-[#232838] overflow-hidden bg-[#FBFBFD] dark:bg-[#0F1219]"
                  >
                    <button
                      onClick={() => setOpenTopic(open ? null : t.id)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#5B5FEF]"
                      aria-expanded={open}
                    >
                      <div>
                        <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#5B5FEF] dark:text-[#9297FF]">
                          {t.tag}
                        </span>
                        <h3 className="font-semibold text-base mt-0.5">
                          {t.title}
                        </h3>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={
                          "h-5 w-5 shrink-0 text-[#5B6270] dark:text-[#8B93A7] transition-transform duration-300 " +
                          (open ? "rotate-180" : "")
                        }
                        aria-hidden
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {open && (
                      <div className="px-5 pb-5">
                        <div className="font-formula text-xs sm:text-sm bg-[#F0F1F8] dark:bg-[#161B27] border border-[#E4E7EF] dark:border-[#232838] rounded-lg px-4 py-3 mb-4 overflow-x-auto whitespace-nowrap">
                          {t.formula}
                        </div>
                        <ul className="space-y-2">
                          {t.notes.map((n, i) => (
                            <li
                              key={i}
                              className="text-sm text-[#3A3F4B] dark:text-[#C4C9D4] flex gap-2"
                            >
                              <span className="text-[#5B5FEF] dark:text-[#9297FF] mt-0.5">
                                ›
                              </span>
                              <span>{n}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* -------------------------------------------------------- */}
          {/* Practice problems                                        */}
          {/* -------------------------------------------------------- */}
          <section id="problems" className="py-12 scroll-mt-20">
            <SectionEyebrow>05 · Practice</SectionEyebrow>
            <h2 className="font-display font-semibold text-3xl mb-2">
              Problems worth working through
            </h2>
            <p className="text-[#3A3F4B] dark:text-[#C4C9D4] max-w-3xl mb-8">
              Try each one on paper before revealing the solution — probability
              intuition is built by getting a few of these wrong first.
            </p>
            <div className="space-y-4">
              {PROBLEMS.map((p, idx) => {
                const shown = !!shownSolutions[p.id];
                return (
                  <Card key={p.id}>
                    <div className="flex gap-3">
                      <span className="font-formula text-sm text-[#5B5FEF] dark:text-[#9297FF] mt-0.5">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base">{p.prompt}</p>
                        <p className="text-xs text-[#5B6270] dark:text-[#8B93A7] mt-2 italic">
                          Hint: {p.hint}
                        </p>
                        <button
                          onClick={() => toggleSolution(p.id)}
                          className="mt-3 text-sm font-medium text-[#5B5FEF] dark:text-[#9297FF] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B5FEF] rounded"
                        >
                          {shown ? "Hide solution" : "Show solution"}
                        </button>
                        {shown && (
                          <div className="mt-3 font-formula text-sm bg-[#F0F1F8] dark:bg-[#161B27] border border-[#E4E7EF] dark:border-[#232838] rounded-lg px-4 py-3">
                            {p.solution}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* -------------------------------------------------------- */}
          {/* Quiz                                                     */}
          {/* -------------------------------------------------------- */}
          <section id="quiz" className="py-12 scroll-mt-20">
            <SectionEyebrow>06 · Quiz</SectionEyebrow>
            <h2 className="font-display font-semibold text-3xl mb-2">
              Check your understanding
            </h2>
            <p className="text-[#3A3F4B] dark:text-[#C4C9D4] max-w-3xl mb-8">
              Six questions connecting probability directly to coding and ML
              practice. Pick an answer for each, then submit to see your
              score.
            </p>

            <div className="space-y-5">
              {QUIZ.map((q, idx) => {
                const selected = answers[q.id];
                return (
                  <Card key={q.id}>
                    <p className="text-sm sm:text-base font-medium mb-4">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => {
                        const isSelected = selected === oi;
                        const isCorrect = submitted && oi === q.correct;
                        const isWrongSelected =
                          submitted && isSelected && oi !== q.correct;
                        return (
                          <button
                            key={oi}
                            onClick={() => selectAnswer(q.id, oi)}
                            disabled={submitted}
                            className={
                              "w-full text-left text-sm px-4 py-2.5 rounded-lg border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B5FEF] " +
                              (isCorrect
                                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-700"
                                : isWrongSelected
                                ? "border-rose-400 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-700"
                                : isSelected
                                ? "border-[#5B5FEF] bg-[#EDEBFF] dark:bg-[#1B1E2C]"
                                : "border-[#E4E7EF] dark:border-[#232838] hover:bg-[#F6F7FB] dark:hover:bg-[#161B27]")
                            }
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {submitted && (
                      <p className="text-xs text-[#5B6270] dark:text-[#8B93A7] mt-3">
                        {q.explanation}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {!submitted ? (
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(answers).length < QUIZ.length}
                  className="px-5 py-3 rounded-xl bg-[#5B5FEF] text-white text-sm font-semibold hover:bg-[#4A4EDB] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B5FEF] transition-colors"
                >
                  Submit quiz
                </button>
              ) : (
                <>
                  <p className="font-formula text-sm">
                    Score: <strong>{score}</strong> / {QUIZ.length}
                  </p>
                  <button
                    onClick={retakeQuiz}
                    className="px-5 py-3 rounded-xl border border-[#E4E7EF] dark:border-[#232838] text-sm font-semibold text-[#3A3F4B] dark:text-[#C4C9D4] hover:bg-[#F6F7FB] dark:hover:bg-[#131722] transition-colors"
                  >
                    Retake quiz
                  </button>
                </>
              )}
              {!submitted && Object.keys(answers).length < QUIZ.length && (
                <p className="text-xs text-[#5B6270] dark:text-[#8B93A7]">
                  Answer all {QUIZ.length} questions to submit.
                </p>
              )}
            </div>
          </section>

          {/* -------------------------------------------------------- */}
          {/* Cheat sheet                                               */}
          {/* -------------------------------------------------------- */}
          <section id="cheatsheet" className="py-12 scroll-mt-20">
            <SectionEyebrow>07 · Cheat sheet</SectionEyebrow>
            <h2 className="font-display font-semibold text-3xl mb-2">
              Quick reference
            </h2>
            <p className="text-[#3A3F4B] dark:text-[#C4C9D4] max-w-3xl mb-8">
              Every formula above, condensed. Keep this open while you code or
              train models.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              {CHEATSHEET.map((group) => (
                <Card key={group.group}>
                  <h3 className="font-semibold text-sm mb-3 text-[#5B5FEF] dark:text-[#9297FF]">
                    {group.group}
                  </h3>
                  <dl className="space-y-2.5">
                    {group.rows.map((row) => (
                      <div
                        key={row.name}
                        className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3"
                      >
                        <dt className="text-xs text-[#5B6270] dark:text-[#8B93A7] sm:w-32 shrink-0">
                          {row.name}
                        </dt>
                        <dd className="font-formula text-xs sm:text-sm">
                          {row.formula}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/downloads/probability-note.pdf"
                download
                className="group mt-10 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M12 3v12" />
                  <path d="M7 10l5 5 5-5" />
                  <path d="M4 19h16" />
                </svg>
                Download the full notes (PDF)
              </a>
            </div>
          </section>

          <footer className="py-12 border-t border-[#E4E7EF] dark:border-[#232838] text-xs text-[#5B6270] dark:text-[#8B93A7]">
            Probability · a study page for developers and ML learners. 
            <code className="font-formula">Keep Coding, Keep Creating ..❤️..</code>.
          </footer>
        </main>
      </div>
    </div>
  );
}