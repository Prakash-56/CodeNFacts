"use client";

import { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG — zero extra dependencies)                       */
/* ------------------------------------------------------------------ */

const Icon = {
  Chevron: ({ open }: { open: boolean }) => (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3}>
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Cross: () => (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  Signature hero visual — a normal-distribution "bell curve" made    */
/*  of a single continuous stroke, doubling as the page's motif        */
/* ------------------------------------------------------------------ */

function BellCurve() {
  return (
    <svg viewBox="0 0 600 220" className="w-full max-w-xl" fill="none">
      <defs>
        <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--stat-accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--stat-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* sigma bands */}
      {[1, 2, 3].map((s) => (
        <line
          key={s}
          x1={300 - s * 80}
          y1={20}
          x2={300 - s * 80}
          y2={190}
          stroke="var(--stat-line)"
          strokeDasharray="3 5"
          strokeWidth={1}
        />
      ))}
      {[1, 2, 3].map((s) => (
        <line
          key={"r" + s}
          x1={300 + s * 80}
          y1={20}
          x2={300 + s * 80}
          y2={190}
          stroke="var(--stat-line)"
          strokeDasharray="3 5"
          strokeWidth={1}
        />
      ))}
      <path
        d="M10,190 C120,190 150,20 300,20 C450,20 480,190 590,190 Z"
        fill="url(#curveFill)"
      />
      <path
        d="M10,190 C120,190 150,20 300,20 C450,20 480,190 590,190"
        stroke="var(--stat-accent)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <line x1="300" y1="20" x2="300" y2="190" stroke="var(--stat-accent)" strokeWidth={2} />
      <text x="300" y="210" textAnchor="middle" fontSize="13" fill="var(--stat-muted)" fontFamily="var(--stat-mono)">
        μ (mean)
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Content data                                                       */
/* ------------------------------------------------------------------ */

type Topic = {
  id: string;
  title: string;
  tag: string;
  summary: string;
  points: string[];
  formula?: string;
};

const TOPICS: Topic[] = [
  {
    id: "descriptive",
    title: "Descriptive Statistics",
    tag: "Foundations",
    summary:
      "The vocabulary you reach for before anything else: mean, median, mode, and range describe where your data sits and how it's shaped.",
    points: [
      "Mean is sensitive to outliers; median is not — know when each is the honest summary.",
      "Mode matters most for categorical or multi-modal data (e.g. bimodal user behavior).",
      "Range is fragile (only two points decide it); pair it with IQR for a robust spread.",
      "In code: this is what you compute before writing a single line of model logic — sanity-check your dataset first.",
    ],
    formula: "mean (x̄) = Σx / n",
  },
  {
    id: "dispersion",
    title: "Measures of Dispersion",
    tag: "Foundations",
    summary:
      "Two datasets can share a mean and look nothing alike. Dispersion tells you how tightly values cluster around the center.",
    points: [
      "Variance = average squared deviation from the mean — squaring removes sign, but changes units.",
      "Standard deviation brings units back (σ = √variance) — this is why it's the go-to for reporting spread.",
      "IQR (Q3 − Q1) ignores the tails — the standard tool for detecting outliers via the 1.5×IQR rule.",
      "In ML: feature scaling (standardization) literally divides by standard deviation — this concept is baked into every `StandardScaler` call.",
    ],
    formula: "σ² = Σ(xᵢ − x̄)² / n",
  },
  {
    id: "probability",
    title: "Probability Fundamentals",
    tag: "Foundations",
    summary:
      "Probability is the language every statistical model is written in. Conditional logic in code and conditional probability in math are the same idea wearing different clothes.",
    points: [
      "Sample space, events, and the axioms (0 ≤ P(E) ≤ 1, P(sample space) = 1) are non-negotiable primitives.",
      "Independence: P(A ∩ B) = P(A)·P(B) only when true — assuming it wrongly is the #1 source of buggy statistical code.",
      "Conditional probability P(A|B) underlies every `if` — `given` relationship you encode in a model or a business rule.",
      "This is the entry point to Bayes' theorem, decision trees, and probabilistic programming.",
    ],
    formula: "P(A|B) = P(A ∩ B) / P(B)",
  },
  {
    id: "distributions",
    title: "Probability Distributions",
    tag: "Foundations",
    summary:
      "Distributions are reusable templates for randomness. Recognizing which one models your data is half of statistical modeling.",
    points: [
      "Normal (Gaussian): symmetric, defined by μ and σ — the default assumption behind linear regression's error term.",
      "Binomial: counts of successes in n independent yes/no trials — think A/B test conversions.",
      "Poisson: counts of rare events in a fixed interval — server requests per second, defects per batch.",
      "Uniform: every outcome equally likely — the backbone of random number generators and simulations.",
      "Exponential: time between Poisson events — used in reliability engineering and queueing models.",
    ],
    formula: "Normal PDF: f(x) = (1 / σ√2π) · e^(−(x−μ)²/2σ²)",
  },
  {
    id: "clt",
    title: "Central Limit Theorem",
    tag: "Core theory",
    summary:
      "The single theorem that justifies most of applied statistics: sample means become normally distributed as sample size grows — regardless of the original distribution.",
    points: [
      "This is *why* confidence intervals and hypothesis tests default to normal-based formulas even for skewed raw data.",
      "Practical rule of thumb: n ≥ 30 is usually 'large enough', but it depends on how skewed the population is.",
      "It's the theoretical backbone of bootstrapping and Monte Carlo estimation used in ML validation.",
    ],
  },
  {
    id: "sampling",
    title: "Sampling & Sampling Methods",
    tag: "Data collection",
    summary:
      "Your model is only as honest as the sample it learned from. Bad sampling is a silent bug no amount of clever code can fix.",
    points: [
      "Random, stratified, cluster, and systematic sampling each trade off cost against bias differently.",
      "Sampling bias (e.g. survivorship bias) quietly poisons datasets before training even begins.",
      "Train/validation/test splits in ML are literally applied sampling theory — leakage between them is a sampling error.",
    ],
  },
  {
    id: "estimation",
    title: "Estimation & Confidence Intervals",
    tag: "Inference",
    summary:
      "A point estimate is a guess; an interval is an honest guess with a margin of error attached.",
    points: [
      "Point estimation gives a single number (e.g. sample mean) as the best guess for a population parameter.",
      "A confidence interval expresses uncertainty: 'we're 95% confident the true value lies in this range.'",
      "Wider intervals aren't 'more confident' about a wrong idea — they reflect real uncertainty from smaller samples or higher variance.",
      "Model metrics reported without a confidence interval (accuracy = 91%) are incomplete — always ask 'plus or minus what?'",
    ],
    formula: "CI = x̄ ± z·(σ/√n)",
  },
  {
    id: "hypothesis",
    title: "Hypothesis Testing",
    tag: "Inference",
    summary:
      "The formal procedure for deciding whether an observed effect is real or just noise — the statistical equivalent of a unit test for claims.",
    points: [
      "Null hypothesis (H₀): 'no effect'. Alternative (H₁): 'there is an effect'. You never 'prove' H₀ — only fail to reject it.",
      "p-value: probability of seeing data this extreme *if H₀ were true* — not the probability H₀ is true (the most common misread in industry).",
      "Type I error: rejecting a true H₀ (false positive). Type II error: failing to reject a false H₀ (false negative) — this is precision/recall's statistical ancestor.",
      "Significance level (α, usually 0.05) is a threshold you choose *before* seeing the data, not after.",
    ],
  },
  {
    id: "correlation",
    title: "Correlation & Covariance",
    tag: "Relationships",
    summary:
      "Before you build a model relating two variables, correlation tells you if there's anything worth modeling at all.",
    points: [
      "Covariance shows direction of a relationship but its scale is unit-dependent and hard to interpret directly.",
      "Pearson's r rescales covariance to [-1, 1] — comparable across any two variables regardless of units.",
      "Correlation ≠ causation: this is the single most repeated (and most ignored) rule in applied statistics.",
      "Feature selection in ML often starts with a correlation matrix to spot redundant or irrelevant features.",
    ],
    formula: "r = cov(X,Y) / (σx·σy)",
  },
  {
    id: "regression",
    title: "Linear Regression & Least Squares",
    tag: "Modeling",
    summary:
      "The simplest predictive model — and the one every other regression, from logistic to neural nets, generalizes from.",
    points: [
      "Least squares finds the line minimizing the sum of squared residuals — an optimization problem hiding inside a 'statistics' topic.",
      "R² tells you how much variance in y is explained by x — not whether the model is 'good' in an absolute sense.",
      "Assumptions matter: linearity, independence of errors, homoscedasticity (constant variance), normal residuals.",
      "Gradient descent, used to train almost every ML model, is just an iterative way to solve the same least-squares problem at scale.",
    ],
    formula: "ŷ = β₀ + β₁x, minimizing Σ(yᵢ − ŷᵢ)²",
  },
  {
    id: "anova",
    title: "ANOVA (Analysis of Variance)",
    tag: "Inference",
    summary:
      "When you have more than two groups to compare, running many t-tests inflates error — ANOVA compares them all at once, honestly.",
    points: [
      "Tests whether at least one group mean differs — it doesn't say *which* one (post-hoc tests like Tukey's HSD do that).",
      "F-statistic = variance between groups / variance within groups.",
      "Used constantly in experiment design when testing more than two model variants or UI treatments at once.",
    ],
  },
  {
    id: "chisquare",
    title: "Chi-Square Tests",
    tag: "Inference",
    summary:
      "The standard test for categorical data — are two categorical variables independent, or does an observed distribution match an expected one?",
    points: [
      "Goodness-of-fit: does observed data match an expected distribution?",
      "Test of independence: are two categorical variables related (e.g. device type vs. conversion)?",
      "Used heavily in feature selection for categorical variables before feeding them into a classifier.",
    ],
    formula: "χ² = Σ (Observed − Expected)² / Expected",
  },
  {
    id: "bayesian",
    title: "Bayesian Statistics",
    tag: "Core theory",
    summary:
      "A different philosophy: instead of one fixed 'truth' you're testing against, you update a belief as new evidence arrives — this is exactly how online learning and recommender systems work.",
    points: [
      "Prior → Likelihood → Posterior: your belief before data, the data's evidence, and your updated belief.",
      "Naive Bayes classifiers are a direct, literal application of Bayes' theorem to classification.",
      "Bayesian A/B testing gives a probability that 'B beats A', which is more intuitive to stakeholders than a p-value.",
    ],
    formula: "P(H|E) = P(E|H)·P(H) / P(E)",
  },
  {
    id: "shape",
    title: "Skewness & Kurtosis",
    tag: "Foundations",
    summary:
      "Two numbers that describe the *shape* of a distribution beyond center and spread — asymmetry and tail-heaviness.",
    points: [
      "Skewness > 0: long right tail (e.g. income data). Skewness < 0: long left tail.",
      "Kurtosis measures tail weight — high kurtosis means more extreme outliers than a normal distribution predicts.",
      "Both quietly break assumptions behind t-tests and linear regression if ignored — always plot your distribution first.",
    ],
  },
  {
    id: "ml-stats",
    title: "Statistics Inside Machine Learning",
    tag: "Applied",
    summary:
      "Every model you train is a statistical estimator wearing a fashionable name. This is where the earlier topics stop being 'math class' and start being your day job.",
    points: [
      "Bias-variance tradeoff is a statistical framing of underfitting vs. overfitting — bias is systematic error, variance is sensitivity to the training sample.",
      "Loss functions (MSE, cross-entropy) are directly derived from statistical estimation theory (maximum likelihood).",
      "Regularization (L1/L2) is a Bayesian prior in disguise — it constrains a model the same way a prior belief constrains a posterior.",
      "Train/test splits, k-fold cross-validation, and bootstrapping are sampling theory applied to model evaluation.",
      "Confusion matrices, precision, recall, and ROC curves are hypothesis-testing concepts (Type I/II error) rebranded for classifiers.",
    ],
  },
  {
    id: "abtesting",
    title: "A/B Testing & Experimentation",
    tag: "Applied",
    summary:
      "The most common real-world use of hypothesis testing outside of research: does changing the button color actually change conversion?",
    points: [
      "Define your metric and hypothesis *before* running the experiment — post-hoc storytelling on noisy data is how false wins happen.",
      "Sample size calculations (power analysis) tell you how long to run a test before trusting the result.",
      "Multiple testing correction (Bonferroni, FDR) matters the moment you test more than one metric at once.",
    ],
  },
  {
    id: "timeseries",
    title: "Time Series Basics",
    tag: "Applied",
    summary:
      "Data ordered in time breaks the 'independent observations' assumption almost every basic test relies on — it needs its own toolkit.",
    points: [
      "Trend, seasonality, and noise are the three components you decompose a series into before modeling.",
      "Autocorrelation measures how much a value depends on its own past — critical for choosing models like ARIMA.",
      "Stationarity (constant mean/variance over time) is usually required before applying classical time-series models.",
    ],
  },
];

const CHEAT_SHEET: { label: string; formula: string; note: string }[] = [
  { label: "Mean", formula: "x̄ = Σx / n", note: "Central tendency, sensitive to outliers" },
  { label: "Variance", formula: "σ² = Σ(x − x̄)² / n", note: "Average squared spread" },
  { label: "Std. Deviation", formula: "σ = √σ²", note: "Spread in original units" },
  { label: "Z-score", formula: "z = (x − μ) / σ", note: "How many σ from the mean" },
  { label: "Confidence Interval", formula: "x̄ ± z·(σ/√n)", note: "Range for the true parameter" },
  { label: "Correlation (Pearson r)", formula: "r = cov(X,Y) / (σx·σy)", note: "Strength of linear relationship" },
  { label: "Bayes' Theorem", formula: "P(H|E) = P(E|H)P(H)/P(E)", note: "Update belief with evidence" },
  { label: "Binomial PMF", formula: "P(X=k) = C(n,k)pᵏ(1−p)ⁿ⁻ᵏ", note: "k successes in n trials" },
  { label: "Normal PDF", formula: "f(x) = (1/σ√2π)e^(−(x−μ)²/2σ²)", note: "The bell curve" },
  { label: "Chi-Square", formula: "χ² = Σ(O − E)²/E", note: "Categorical fit / independence" },
  { label: "F-statistic (ANOVA)", formula: "F = variance between / variance within", note: "Compare 3+ group means" },
  { label: "R² (coefficient of determination)", formula: "R² = 1 − SSres/SStot", note: "Variance explained by model" },
];

type Problem = { id: string; question: string; hint: string; answer: string };

const PROBLEMS: Problem[] = [
  {
    id: "p1",
    question:
      "A dataset has values 4, 8, 6, 5, 3. Find the mean and the variance (population).",
    hint: "Mean first, then average of squared deviations from that mean.",
    answer: "Mean = 5.2. Deviations: −1.2, 2.8, 0.8, −0.2, −2.2 → squared: 1.44, 7.84, 0.64, 0.04, 4.84 → sum = 14.8 → Variance = 14.8 / 5 = 2.96.",
  },
  {
    id: "p2",
    question:
      "A coin is flipped 10 times. What's the probability of getting exactly 6 heads? (p = 0.5)",
    hint: "Use the binomial PMF with n=10, k=6, p=0.5.",
    answer: "P(X=6) = C(10,6)(0.5)^6(0.5)^4 = 210 × 0.5^10 = 210/1024 ≈ 0.205 (about 20.5%).",
  },
  {
    id: "p3",
    question:
      "A sample of 36 users has a mean session time of 12 minutes with a standard deviation of 3 minutes. Construct a 95% confidence interval for the true mean.",
    hint: "z for 95% ≈ 1.96. CI = x̄ ± z(σ/√n).",
    answer: "Standard error = 3/√36 = 0.5. Margin = 1.96 × 0.5 = 0.98. CI ≈ (11.02, 12.98) minutes.",
  },
  {
    id: "p4",
    question:
      "Two variables have a Pearson correlation of r = 0.9. Does this mean one causes the other?",
    hint: "Think about confounding variables and the classic warning in statistics.",
    answer: "No. A strong correlation only shows a linear association; it says nothing about causation. A third (confounding) variable, reverse causation, or coincidence could explain it.",
  },
  {
    id: "p5",
    question:
      "You run an A/B test and get p = 0.03 with α = 0.05. What do you conclude, and what does the p-value *not* mean?",
    hint: "p-value = probability of the data given H₀ is true, not the probability H₀ is true.",
    answer: "Since p (0.03) < α (0.05), you reject H₀ — the result is statistically significant. The p-value does NOT mean 'there's a 3% chance H₀ is true'; it means 'if H₀ were true, data this extreme would occur 3% of the time.'",
  },
  {
    id: "p6",
    question:
      "A model has low training error but much higher validation error. Which half of the bias-variance tradeoff is the likely culprit, and why?",
    hint: "Low bias, high variance = overfitting to the training sample.",
    answer: "High variance (overfitting). The model has fit noise specific to the training sample rather than the underlying pattern, so it fails to generalize to unseen (validation) data.",
  },
];

type Quiz = { id: string; q: string; options: string[]; correct: number; explain: string };

const QUIZ: Quiz[] = [
  {
    id: "q1",
    q: "Which measure of central tendency is least affected by outliers?",
    options: ["Mean", "Median", "Range", "Standard deviation"],
    correct: 1,
    explain: "Median only depends on the middle position, so extreme values barely move it.",
  },
  {
    id: "q2",
    q: "What does a p-value of 0.02 actually tell you?",
    options: [
      "There's a 2% chance the null hypothesis is true",
      "There's a 98% chance the alternative hypothesis is true",
      "If H₀ were true, data this extreme occurs 2% of the time",
      "The effect size is 2%",
    ],
    correct: 2,
    explain: "The p-value is a statement about the data assuming H₀ is true — never a statement about the probability of a hypothesis itself.",
  },
  {
    id: "q3",
    q: "The Central Limit Theorem says that as sample size grows, the distribution of the sample mean approaches:",
    options: ["The population's original distribution", "A normal distribution", "A uniform distribution", "A binomial distribution"],
    correct: 1,
    explain: "Regardless of the population's shape, sample means trend toward a normal distribution as n increases.",
  },
  {
    id: "q4",
    q: "In the bias-variance tradeoff, an overfit model typically has:",
    options: ["High bias, low variance", "Low bias, high variance", "Low bias, low variance", "High bias, high variance"],
    correct: 1,
    explain: "Overfitting means the model matches training data (and its noise) too closely — low bias, but high variance across different samples.",
  },
  {
    id: "q5",
    q: "Which distribution best models 'number of server errors in one hour' when errors are rare and independent?",
    options: ["Normal", "Binomial", "Poisson", "Uniform"],
    correct: 2,
    explain: "Poisson models counts of rare, independent events over a fixed interval — exactly this scenario.",
  },
  {
    id: "q6",
    q: "A correlation coefficient of r = -0.85 means:",
    options: [
      "A weak, positive relationship",
      "A strong, negative linear relationship",
      "No relationship at all",
      "Causation between the variables",
    ],
    correct: 1,
    explain: "The sign shows direction (negative = inverse) and the magnitude near 1 shows a strong linear relationship — never causation on its own.",
  },
  {
    id: "q7",
    q: "Standardizing a feature (z-score scaling) before training a model primarily addresses:",
    options: [
      "Missing data",
      "Differences in feature scale/units affecting distance- or gradient-based models",
      "Categorical encoding",
      "Class imbalance",
    ],
    correct: 1,
    explain: "Standardization rescales features to comparable ranges so no single feature dominates due to its units — critical for KNN, SVMs, and gradient descent.",
  },
];

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--stat-accent)]">
      {children}
    </p>
  );
}

function TopicAccordion() {
  const [openId, setOpenId] = useState<string | null>(TOPICS[0].id);

  return (
    <div className="divide-y divide-[var(--stat-border)] rounded-2xl border border-[var(--stat-border)] bg-[var(--stat-surface)]">
      {TOPICS.map((t) => {
        const open = openId === t.id;
        return (
          <div key={t.id}>
            <button
              onClick={() => setOpenId(open ? null : t.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--stat-surface-hover)] sm:px-6"
              aria-expanded={open}
            >
              <span className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--stat-muted)]">
                  {t.tag}
                </span>
                <span className="font-serif text-lg text-[var(--stat-text)] sm:text-xl">{t.title}</span>
              </span>
              <span className="text-[var(--stat-muted)]">
                <Icon.Chevron open={open} />
              </span>
            </button>
            {open && (
              <div className="px-5 pb-6 sm:px-6">
                <p className="mb-4 max-w-3xl text-[15px] leading-relaxed text-[var(--stat-muted)]">
                  {t.summary}
                </p>
                <ul className="mb-4 space-y-2.5">
                  {t.points.map((p, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-[var(--stat-text)]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--stat-accent)]" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                {t.formula && (
                  <div className="inline-block rounded-lg border border-[var(--stat-border)] bg-[var(--stat-code-bg)] px-4 py-2.5 font-mono text-sm text-[var(--stat-accent)]">
                    {t.formula}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CheatSheet() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {CHEAT_SHEET.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-[var(--stat-border)] bg-[var(--stat-surface)] p-4"
        >
          <p className="mb-1.5 text-sm font-semibold text-[var(--stat-text)]">{c.label}</p>
          <p className="mb-2 break-words rounded-md bg-[var(--stat-code-bg)] px-2.5 py-1.5 font-mono text-[13px] text-[var(--stat-accent)]">
            {c.formula}
          </p>
          <p className="text-xs leading-relaxed text-[var(--stat-muted)]">{c.note}</p>
        </div>
      ))}
    </div>
  );
}

function Problems() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-4">
      {PROBLEMS.map((p, i) => (
        <div key={p.id} className="rounded-xl border border-[var(--stat-border)] bg-[var(--stat-surface)] p-5">
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-[var(--stat-muted)]">
            Problem {i + 1}
          </p>
          <p className="mb-3 text-[15px] leading-relaxed text-[var(--stat-text)]">{p.question}</p>
          <p className="mb-3 text-sm italic text-[var(--stat-muted)]">Hint: {p.hint}</p>
          <button
            onClick={() => setRevealed((r) => ({ ...r, [p.id]: !r[p.id] }))}
            className="mb-3 rounded-lg border border-[var(--stat-accent)] px-3 py-1.5 text-sm font-medium text-[var(--stat-accent)] transition-colors hover:bg-[var(--stat-accent)] hover:text-[var(--stat-on-accent)]"
          >
            {revealed[p.id] ? "Hide answer" : "Reveal answer"}
          </button>
          {revealed[p.id] && (
            <p className="rounded-lg bg-[var(--stat-code-bg)] p-3 text-sm leading-relaxed text-[var(--stat-text)]">
              {p.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Quiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => QUIZ.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0),
    [answers]
  );
  const allAnswered = QUIZ.every((q) => answers[q.id] !== undefined);

  return (
    <div className="space-y-5">
      {QUIZ.map((q, i) => {
        const selected = answers[q.id];
        return (
          <div key={q.id} className="rounded-xl border border-[var(--stat-border)] bg-[var(--stat-surface)] p-5">
            <p className="mb-3 text-[15px] font-medium text-[var(--stat-text)]">
              {i + 1}. {q.q}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = selected === oi;
                const isCorrect = oi === q.correct;
                let style = "border-[var(--stat-border)] hover:border-[var(--stat-accent)]";
                if (submitted && isSelected && isCorrect) style = "border-emerald-500 bg-emerald-500/10";
                if (submitted && isSelected && !isCorrect) style = "border-red-500 bg-red-500/10";
                if (submitted && !isSelected && isCorrect) style = "border-emerald-500";
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm text-[var(--stat-text)] transition-colors ${style} ${
                      isSelected && !submitted ? "border-[var(--stat-accent)] bg-[var(--stat-code-bg)]" : ""
                    } disabled:cursor-default`}
                  >
                    <span>{opt}</span>
                    {submitted && isSelected && isCorrect && <span className="text-emerald-500"><Icon.Check /></span>}
                    {submitted && isSelected && !isCorrect && <span className="text-red-500"><Icon.Cross /></span>}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-3 text-sm leading-relaxed text-[var(--stat-muted)]">{q.explain}</p>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        {!submitted ? (
          <button
            disabled={!allAnswered}
            onClick={() => setSubmitted(true)}
            className="rounded-lg bg-[var(--stat-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--stat-on-accent)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit quiz
          </button>
        ) : (
          <>
            <p className="font-serif text-lg text-[var(--stat-text)]">
              Score: <span className="text-[var(--stat-accent)]">{score}</span> / {QUIZ.length}
            </p>
            <button
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
              className="rounded-lg border border-[var(--stat-border)] px-4 py-2 text-sm font-medium text-[var(--stat-text)] hover:border-[var(--stat-accent)]"
            >
              Retake quiz
            </button>
          </>
        )}
        {!allAnswered && !submitted && (
          <p className="text-xs text-[var(--stat-muted)]">Answer every question to unlock submit.</p>
        )}
      </div>
    </div>
  );
}

function DownloadButton() {
  return (
    <a
      href="/downloads/statistics-note.pdf"
      download
      className="inline-flex items-center gap-2 rounded-xl bg-[var(--stat-accent)] px-5 py-3 text-sm font-semibold text-[var(--stat-on-accent)] shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <Icon.Download />
      Download statistics notes (PDF)
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function StatisticsPage() {
  return (
    <main className="min-h-screen bg-[var(--stat-bg)] text-[var(--stat-text)] transition-colors duration-300">
      {/* 
        All theme tokens live here so light & dark have equal specificity.
        Light is the default; html.dark overrides them.
        (Previously light tokens were set via the style attribute, which
        always won over the stylesheet rules — dark mode never applied.)
      */}
      <style>{`
        main {
          --stat-bg: #ffffff;
          --stat-surface: #f8f9fb;
          --stat-surface-hover: #f1f3f6;
          --stat-border: #e4e7ec;
          --stat-text: #171a21;
          --stat-muted: #5b6472;
          --stat-accent: #3454d1;
          --stat-on-accent: #ffffff;
          --stat-line: #dbe0e8;
          --stat-code-bg: #eef1f7;
          --stat-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        html.dark main {
          --stat-bg: #0a0e1a;
          --stat-surface: #10151f;
          --stat-surface-hover: #161c29;
          --stat-border: #232a38;
          --stat-text: #e7eaf0;
          --stat-muted: #8b93a3;
          --stat-accent: #6d8bff;
          --stat-on-accent: #0a0e1a;
          --stat-line: #1c2330;
          --stat-code-bg: #131a27;
        }
      `}</style>

      {/* ---------------------------------------------------------- */}
      {/* Hero                                                        */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 pb-14 pt-16 text-center sm:pt-24">
        <SectionEyebrow>Statistics</SectionEyebrow>
        <h1 className="max-w-3xl font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl">
          Statistics is the logic layer underneath every model you'll ever train.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--stat-muted)]">
          Not a math requirement to get through - it's how you read data honestly, reason about
          uncertainty in code, and understand what a model is actually doing when it "learns."
          This page is your complete reference: concepts, formulas, problems, and a quiz.
        </p>
        <BellCurve />
        <DownloadButton />
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Why it matters                                              */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <SectionEyebrow>Why statistics, really</SectionEyebrow>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--stat-border)] bg-[var(--stat-surface)] p-6">
            <h3 className="mb-2 font-serif text-xl">Why you need it</h3>
            <p className="text-[15px] leading-relaxed text-[var(--stat-muted)]">
              Every dataset lies a little through noise, bias, and randomness. Statistics is the
              only formal toolkit for telling signal from coincidence — without it you're
              debugging model behavior by vibes instead of evidence.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--stat-border)] bg-[var(--stat-surface)] p-6">
            <h3 className="mb-2 font-serif text-xl">How it shapes coding & logic</h3>
            <p className="text-[15px] leading-relaxed text-[var(--stat-muted)]">
              Conditionals mirror conditional probability. Loops that aggregate data are computing
              means and variances. Edge-case thinking ("what if this is an outlier?") is applied
              dispersion. Statistical thinking makes your logic more defensive and your code more
              correct on data it hasn't seen yet.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--stat-border)] bg-[var(--stat-surface)] p-6">
            <h3 className="mb-2 font-serif text-xl">How it drives model training</h3>
            <p className="text-[15px] leading-relaxed text-[var(--stat-muted)]">
              Loss functions are likelihoods. Regularization is a prior. Train/test splits are
              sampling design. Evaluation metrics are hypothesis-testing concepts in disguise.
              Every "why did my model do that" question resolves to a statistics answer.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Topics — deep dive                                          */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <SectionEyebrow>Deep-dive notes</SectionEyebrow>
        <h2 className="mb-2 font-serif text-3xl">Everything you need to know</h2>
        <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-[var(--stat-muted)]">
          {TOPICS.length} core topics, ordered from foundations to applied machine learning. Tap
          any topic to expand its notes and key formula.
        </p>
        <TopicAccordion />
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Cheat sheet                                                 */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <SectionEyebrow>Quick reference</SectionEyebrow>
        <h2 className="mb-2 font-serif text-3xl">Cheat sheet</h2>
        <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-[var(--stat-muted)]">
          Every formula on this page, in one scannable grid — bookmark this section for quick
          lookups while coding.
        </p>
        <CheatSheet />
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Practice problems                                           */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <SectionEyebrow>Practice</SectionEyebrow>
        <h2 className="mb-2 font-serif text-3xl">Problems to work through</h2>
        <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-[var(--stat-muted)]">
          Try each problem before revealing the answer — struggling with it first is where the
          learning actually happens.
        </p>
        <Problems />
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Quiz                                                        */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <SectionEyebrow>Check yourself</SectionEyebrow>
        <h2 className="mb-2 font-serif text-3xl">Quiz</h2>
        <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-[var(--stat-muted)]">
          {QUIZ.length} questions. Select an answer for each, then submit to see your score and
          explanations.
        </p>
        <Quiz />
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Closing / download repeat                                   */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-20 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl">Keep the full notes offline</h2>
        <p className="max-w-lg text-[15px] leading-relaxed text-[var(--stat-muted)]">
          Every topic, formula, and worked example from this page, packaged as a PDF you can
          study from anywhere.
        </p>
        <DownloadButton />
      </section>
    </main>
  );
}