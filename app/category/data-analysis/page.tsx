"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Database,
  BarChart3,
  GitBranch,
  Sigma,
  Map,
  BookOpen,
  Sparkles,
  Download,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Rocket,
  Brain,
  Layers,
  Search,
  Filter,
  LineChart,
  PieChart,
  FileText,
  Cpu,
  Workflow,
  ClipboardList,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Motion variants                                                     */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.05, ease: "easeOut" },
  }),
};

/* ------------------------------------------------------------------ */
/*  Section registry                                                    */
/* ------------------------------------------------------------------ */

type SectionId =
  | "overview"
  | "types-data"
  | "types-analysis"
  | "process"
  | "formulas"
  | "roadmap"
  | "build-ai"
  | "cheatsheet"
  | "blog"
  | "pros-cons";

const SECTIONS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: Database },
  { id: "types-data", label: "Types of Data", icon: Layers },
  { id: "types-analysis", label: "Types of Analysis", icon: PieChart },
  { id: "process", label: "Process & Pipeline", icon: Workflow },
  { id: "formulas", label: "Formulas & Stats", icon: Sigma },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "build-ai", label: "Build Your Own AI Model", icon: Brain },
  { id: "cheatsheet", label: "Cheat Sheet", icon: ClipboardList },
  { id: "blog", label: "Blog: Uses & Future", icon: BookOpen },
  { id: "pros-cons", label: "Good Side / Bad Side", icon: Sparkles },
];

/* ------------------------------------------------------------------ */
/*  Small shared UI atoms                                               */
/* ------------------------------------------------------------------ */

function TerminalChrome({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-2 rounded-t-xl border border-b-0 border-zinc-200 bg-[#f7f8fa] px-4 py-2.5 dark:border-white/10 dark:bg-[#0d1117]">
      <span className="h-3 w-3 rounded-full bg-red-400/80" />
      <span className="h-3 w-3 rounded-full bg-amber-400/80" />
      <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
      <span className="ml-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">
        {path}
      </span>
    </div>
  );
}

function Panel({
  path,
  children,
  className = "",
}: {
  path: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-white/10 ${className}`}>
      <TerminalChrome path={path} />
      <div className="bg-white p-5 dark:bg-[#0a0e14] sm:p-6">{children}</div>
    </div>
  );
}

function FormulaCard({ name, formula, note }: { name: string; formula: string; note?: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-[#f7f8fa] p-4 dark:border-white/10 dark:bg-[#0d1117]">
      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{name}</p>
      <p className="mt-2 overflow-x-auto whitespace-pre font-mono text-sm text-amber-700 dark:text-emerald-400">
        {formula}
      </p>
      {note && <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{note}</p>}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-amber-600/30 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400">
      {children}
    </span>
  );
}

function SectionHeading({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-600/30 bg-amber-50 dark:border-emerald-400/30 dark:bg-emerald-400/10">
        <Icon className="h-4.5 w-4.5 text-amber-700 dark:text-emerald-400" size={18} />
      </div>
      <div>
        <h2 className="font-mono text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagram: Data Analysis pipeline (SVG block diagram)                 */
/* ------------------------------------------------------------------ */

function PipelineDiagram() {
  const steps = [
    "Collect",
    "Clean",
    "Explore (EDA)",
    "Analyze",
    "Visualize",
    "Interpret",
    "Decide / Act",
  ];
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 980 160" className="min-w-[720px] w-full" xmlns="http://www.w3.org/2000/svg">
        {steps.map((s, i) => {
          const x = 10 + i * 140;
          return (
            <g key={s}>
              <rect
                x={x}
                y={45}
                width={120}
                height={70}
                rx={10}
                className="fill-[#f7f8fa] stroke-amber-600/50 dark:fill-[#0d1117] dark:stroke-emerald-400/50"
                strokeWidth={1.5}
              />
              <text
                x={x + 60}
                y={72}
                textAnchor="middle"
                className="fill-zinc-800 dark:fill-zinc-100"
                fontSize="12"
                fontFamily="monospace"
                fontWeight={600}
              >
                {s}
              </text>
              <text
                x={x + 60}
                y={90}
                textAnchor="middle"
                className="fill-amber-700 dark:fill-emerald-400"
                fontSize="10"
                fontFamily="monospace"
              >
                {`0${i + 1}`}
              </text>
              {i < steps.length - 1 && (
                <path
                  d={`M ${x + 122} 80 L ${x + 136} 80`}
                  className="stroke-amber-600/70 dark:stroke-emerald-400/70"
                  strokeWidth={2}
                  markerEnd="url(#arrow)"
                />
              )}
            </g>
          );
        })}
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" className="fill-amber-600/70 dark:fill-emerald-400/70" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagram: Types of Data Analysis (four-quadrant sketch)              */
/* ------------------------------------------------------------------ */

function AnalysisTypesDiagram() {
  const quads = [
    { title: "Descriptive", q: "What happened?", color: "amber" },
    { title: "Diagnostic", q: "Why did it happen?", color: "amber" },
    { title: "Predictive", q: "What will happen?", color: "emerald" },
    { title: "Prescriptive", q: "What should we do?", color: "emerald" },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {quads.map((q, i) => (
        <div
          key={q.title}
          className="relative rounded-lg border border-zinc-200 bg-[#f7f8fa] p-4 dark:border-white/10 dark:bg-[#0d1117]"
        >
          <span className="font-mono text-xs text-amber-700 dark:text-emerald-400">0{i + 1}</span>
          <p className="mt-1 font-mono text-sm font-bold text-zinc-900 dark:text-white">{q.title}</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{q.q}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Roadmap                                                             */
/* ------------------------------------------------------------------ */

const ROADMAP = [
  {
    stage: "Foundations",
    items: ["Statistics & probability basics", "Excel / Google Sheets", "Basic math: mean, variance, distributions"],
  },
  {
    stage: "Querying Data",
    items: ["SQL (SELECT, JOIN, GROUP BY, window functions)", "Relational databases", "NoSQL basics (JSON-like data)"],
  },
  {
    stage: "Programming",
    items: ["Python or R fundamentals", "Pandas / NumPy (or dplyr/tidyverse)", "Jupyter Notebooks"],
  },
  {
    stage: "Exploratory Data Analysis",
    items: ["Data cleaning (nulls, duplicates, outliers)", "Univariate & bivariate analysis", "Correlation & distribution checks"],
  },
  {
    stage: "Visualization",
    items: ["Matplotlib / Seaborn / Plotly", "Power BI or Tableau", "Dashboard storytelling"],
  },
  {
    stage: "Applied Statistics",
    items: ["Hypothesis testing (t-test, chi-square, ANOVA)", "Confidence intervals", "A/B testing"],
  },
  {
    stage: "Machine Learning Bridge",
    items: ["Regression & classification basics", "Feature engineering", "Model evaluation metrics"],
  },
  {
    stage: "Real Projects",
    items: ["End-to-end case study", "Business dashboard", "Portfolio + storytelling with data"],
  },
];

/* ------------------------------------------------------------------ */
/*  Download notes — builds a plain-text notes file client-side         */
/* ------------------------------------------------------------------ */

function buildNotesText() {
  return `CODE-N-FACTS — DATA ANALYSIS NOTES
=====================================

1. WHAT IS DATA?
Data is any raw fact, figure, observation, or measurement collected about
people, events, systems, or things. On its own, data has no meaning until
it is processed — e.g. "27, 31, 19, 42" is data; "average customer age is
30" is information derived from it.

2. WHAT IS DATA ANALYSIS?
Data Analysis is the process of inspecting, cleaning, transforming, and
modeling data to discover useful information, draw conclusions, and support
decision-making. It turns raw numbers into insight and insight into action.

3. WHY DATA ANALYSIS IS USED
- Removes guesswork from decisions — decisions are backed by evidence.
- Reveals hidden patterns, trends, and correlations.
- Improves efficiency by identifying bottlenecks or waste.
- Powers personalization (recommendations, targeted marketing).
- Enables forecasting of future outcomes (sales, demand, risk).
- Is the foundation layer beneath every AI / ML system.

4. WHY IT'S NEEDED
- Businesses generate huge volumes of data daily (transactions, logs, clicks).
- Without analysis, this data is a cost, not an asset.
- Competitive advantage increasingly depends on data-driven strategy.
- Regulatory & quality needs (fraud detection, compliance, safety).

5. TYPES OF DATA
Qualitative (Categorical):
  - Nominal: no order, e.g. gender, blood group, city.
  - Ordinal: ordered, e.g. rating (poor/average/good), education level.
Quantitative (Numerical):
  - Discrete: countable, e.g. number of orders.
  - Continuous: measurable, e.g. height, temperature, revenue.
Interval vs Ratio:
  - Interval: no true zero, e.g. temperature in Celsius.
  - Ratio: true zero exists, e.g. weight, age, price.
Structured vs Unstructured:
  - Structured: rows/columns, databases, spreadsheets.
  - Semi-structured: JSON, XML, logs.
  - Unstructured: images, video, free text, audio.

6. TYPES OF DATA ANALYSIS
- Descriptive  — summarizes what happened (dashboards, reports, averages).
- Diagnostic   — explains why it happened (drill-down, correlation, root cause).
- Predictive   — forecasts what is likely to happen (regression, ML models).
- Prescriptive — recommends what action to take (optimization, simulation).
- Exploratory (EDA) — open-ended investigation to find patterns before
  a specific hypothesis exists.

7. DATA ANALYSIS PROCESS / PIPELINE
Collect -> Clean -> Explore (EDA) -> Analyze -> Visualize -> Interpret -> Decide/Act
  1. Collect   : gather data from surveys, databases, APIs, logs, sensors.
  2. Clean     : handle missing values, duplicates, outliers, wrong types.
  3. Explore   : summary statistics, distributions, correlations.
  4. Analyze   : apply statistical tests / models to answer the question.
  5. Visualize : charts, graphs, dashboards to communicate findings.
  6. Interpret : translate numbers into a narrative / business meaning.
  7. Decide    : use the insight to make or support a decision.

8. KEY FORMULAS

Mean (x̄):            x̄ = (Σx) / n
Median:               middle value of sorted data (avg of 2 middles if n even)
Mode:                 most frequently occurring value
Range:                Range = Max − Min

Variance (population): σ² = Σ(x − μ)² / N
Variance (sample):      s² = Σ(x − x̄)² / (n − 1)
Standard Deviation:     σ = √σ²   or   s = √s²

Z-score:              z = (x − μ) / σ
Coefficient of Variation: CV = (σ / μ) × 100%

Quartiles & IQR:      IQR = Q3 − Q1
Outlier bounds:       Lower = Q1 − 1.5×IQR,  Upper = Q3 + 1.5×IQR

Correlation (Pearson r):
  r = Σ[(x − x̄)(y − ȳ)] / √[Σ(x − x̄)² · Σ(y − ȳ)²]
  (r ranges from −1 to +1)

Simple Linear Regression:
  y = mx + b
  m (slope) = [nΣxy − ΣxΣy] / [nΣx² − (Σx)²]
  b (intercept) = [Σy − mΣx] / n

Probability of an event:
  P(A) = (favorable outcomes) / (total outcomes)

Conditional Probability:
  P(A|B) = P(A ∩ B) / P(B)

Bayes' Theorem:
  P(A|B) = [P(B|A) · P(A)] / P(B)

Confidence Interval (mean, large n):
  CI = x̄ ± z*(σ / √n)

t-statistic (comparing two sample means):
  t = (x̄1 − x̄2) / √[(s1²/n1) + (s2²/n2)]

Chi-Square statistic (categorical association):
  χ² = Σ[(O − E)² / E]

R-squared (goodness of fit):
  R² = 1 − (SS_res / SS_tot)

Percentage Change:
  % Change = [(New − Old) / Old] × 100

9. ROADMAP
Foundations (stats, Excel) -> SQL -> Python/R + Pandas/NumPy -> EDA ->
Visualization (Matplotlib/Seaborn/Power BI/Tableau) -> Applied statistics
(hypothesis testing, A/B testing) -> ML bridge (regression, classification,
evaluation metrics) -> Real projects & portfolio.

10. BUILDING YOUR OWN AI MODEL USING DATA ANALYSIS
  1. Define the problem — what decision or prediction are we automating?
  2. Collect data — internal databases, public datasets, APIs, scraping.
  3. Clean & preprocess — missing values, encoding, scaling, deduplication.
  4. Exploratory Data Analysis — understand distributions & relationships.
  5. Feature engineering — create/select the variables that matter most.
  6. Split data — train / validation / test sets.
  7. Choose a model — regression, tree-based, neural network, etc.
  8. Train the model — fit on training data.
  9. Evaluate — accuracy, precision/recall, RMSE, R², confusion matrix.
  10. Tune — hyperparameter tuning, cross-validation.
  11. Deploy — API endpoint, batch job, or embedded app feature.
  12. Monitor — watch for data drift and retrain periodically.
Good data analysis is the fuel of every AI model — a model is only as
good as the data and understanding that goes into it ("garbage in,
garbage out").

11. USE CASES
- Business intelligence & KPI dashboards
- Marketing: customer segmentation, campaign ROI
- Finance: fraud detection, risk scoring, forecasting
- Healthcare: patient outcome analysis, epidemiology
- E-commerce: recommendation engines, demand forecasting
- Sports analytics, government policy analysis, education analytics

12. FEATURES OF GOOD DATA ANALYSIS
- Accuracy and reproducibility
- Clear question before diving into numbers
- Appropriate visualization for the audience
- Statistical rigor (avoiding false correlations)
- Actionable conclusions, not just charts

13. FUTURE OF DATA ANALYSIS
- Deeper integration with AI/ML (automated insight generation)
- Real-time / streaming analytics becoming the norm
- Natural-language interfaces to query data ("ask your data")
- Greater emphasis on data governance, privacy, and ethics
- Augmented analytics: AI assists in finding what to look at next

14. GOOD SIDE vs BAD SIDE

Good side:
  + Enables smarter, evidence-based decisions
  + Uncovers hidden patterns and opportunities
  + Improves efficiency and reduces cost
  + Personalizes products & services
  + Powers scientific & medical breakthroughs

Bad side / risks:
  − Bias in data leads to bias in conclusions
  − Privacy risks if data is misused or leaked
  − Misinterpretation ("correlation vs causation" errors)
  − Overfitting/overtrust in models without human judgement
  − Can be used manipulatively (dark patterns, surveillance)

15. CHEAT SHEET (QUICK REFERENCE)
  Central tendency  : mean, median, mode
  Spread            : range, variance, std dev, IQR
  Relationship      : correlation (r), regression (y = mx + b)
  Distribution shape: skewness, kurtosis
  Testing           : t-test, chi-square, ANOVA, p-value < 0.05 = significant
  Tools             : Excel, SQL, Python (Pandas/NumPy), R, Power BI, Tableau
  ML bridge metrics : accuracy, precision, recall, F1, RMSE, R²

— Generated from CodeNFacts (codenfacts) Data Analysis notes —
Thank you for learning with CodeNFacts. Keep building, keep analyzing!
`;
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                           */
/* ------------------------------------------------------------------ */

export default function DataAnalysisPage() {
  const [active, setActive] = useState<SectionId>("overview");
  const [showThanks, setShowThanks] = useState(false);
  const thanksTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDownload = useCallback(() => {
    const text = buildNotesText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CodeNFacts-Data-Analysis-Notes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowThanks(true);
    if (thanksTimeout.current) clearTimeout(thanksTimeout.current);
    thanksTimeout.current = setTimeout(() => setShowThanks(false), 4200);
  }, []);

  return (
    <main className="min-h-screen bg-white text-zinc-900 transition-colors dark:bg-[#0a0e14] dark:text-zinc-100">
      {/* ---------- Hero ---------- */}
      <section className="border-b border-zinc-200 bg-[#f7f8fa] px-4 py-10 dark:border-white/10 dark:bg-[#0d1117] sm:px-8">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mx-auto max-w-5xl">
          <Panel path="data-analysis/page">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs text-amber-700 dark:text-emerald-400">
                  // → Data-Analysis
                </p>
                <h1 className="mt-1 font-mono text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Data Analysis
                </h1>
                <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
                  What data really is, why analysis matters, every core formula,
                  a visual roadmap, cheat sheets, and how to turn raw data into
                  your own AI model - all in one page.
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-amber-600/40 bg-amber-500/10 px-4 py-2.5 font-mono text-sm font-semibold text-amber-700 transition hover:bg-amber-500/20 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-400 dark:hover:bg-emerald-400/20"
              >
                <Download size={16} className="transition group-hover:-translate-y-0.5" />
                Download Notes
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Tag>Statistics</Tag>
              <Tag>EDA</Tag>
              <Tag>SQL</Tag>
              <Tag>Python / Pandas</Tag>
              <Tag>Visualization</Tag>
              <Tag>ML Bridge</Tag>
            </div>
          </Panel>
        </motion.div>
      </section>

      {/* ---------- Body: sidebar + content ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <nav className="lg:sticky lg:top-6 lg:h-fit">
            <div className="overflow-x-auto lg:overflow-visible">
              <ul className="flex gap-2 lg:block lg:space-y-1">
                {SECTIONS.map(({ id, label, icon: Icon }) => {
                  const isActive = active === id;
                  return (
                    <li key={id} className="shrink-0">
                      <button
                        onClick={() => setActive(id)}
                        className={`flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left font-mono text-sm transition ${
                          isActive
                            ? "border border-amber-600/40 bg-amber-500/10 text-amber-700 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-400"
                            : "border border-transparent text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/5"
                        }`}
                      >
                        <Icon size={15} />
                        {label}
                        {isActive && <ChevronRight size={14} className="ml-auto hidden lg:block" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Content */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -8 }}
                className="space-y-6"
              >
                {active === "overview" && <OverviewSection />}
                {active === "types-data" && <TypesOfDataSection />}
                {active === "types-analysis" && <TypesOfAnalysisSection />}
                {active === "process" && <ProcessSection />}
                {active === "formulas" && <FormulasSection />}
                {active === "roadmap" && <RoadmapSection />}
                {active === "build-ai" && <BuildAiSection />}
                {active === "cheatsheet" && <CheatsheetSection />}
                {active === "blog" && <BlogSection />}
                {active === "pros-cons" && <ProsConsSection />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ---------- Thank-you toast ---------- */}
      <AnimatePresence>
        {showThanks && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-amber-600/40 bg-white px-5 py-3.5 shadow-xl dark:border-emerald-400/40 dark:bg-[#0d1117]"
          >
            <CheckCircle2 className="text-amber-600 dark:text-emerald-400" size={20} />
            <div>
              <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
                Thanks for downloading! 🎉
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Your Data Analysis notes are saved. Keep learning, keep building — CodeNFacts.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Overview                                                   */
/* ------------------------------------------------------------------ */

function OverviewSection() {
  return (
    <>
      <Panel path="notes/what-is-data.md">
        <SectionHeading icon={Database} title="What is Data?" subtitle="The raw material of every analysis" />
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          Data is any raw fact, figure, observation, or measurement collected about
          people, events, systems, or things. By itself, data carries no meaning —
          the numbers <span className="font-mono text-amber-700 dark:text-emerald-400">27, 31, 19, 42</span> are
          just data, but "the average customer age is 30" is <em>information</em> derived
          from it. Data becomes valuable only once it is organized, processed, and interpreted.
        </p>
      </Panel>

      <Panel path="notes/what-is-data-analysis.md">
        <SectionHeading icon={BarChart3} title="What is Data Analysis?" />
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          Data Analysis is the process of inspecting, cleaning, transforming, and
          modeling data with the goal of discovering useful information, drawing
          conclusions, and supporting decision-making. In short:{" "}
          <span className="font-semibold text-zinc-900 dark:text-white">
            raw data → analysis → insight → decision.
          </span>
        </p>
      </Panel>

      <Panel path="notes/why-data-analysis.md">
        <SectionHeading icon={Search} title="Why is Data Analysis used?" />
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            "Removes guesswork — decisions are backed by evidence",
            "Reveals hidden patterns, trends & correlations",
            "Improves efficiency by spotting bottlenecks",
            "Enables personalization (recommendations, targeting)",
            "Powers forecasting of sales, demand, and risk",
            "Is the foundation layer beneath every AI/ML system",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 rounded-lg border border-zinc-200 bg-[#f7f8fa] p-3 text-sm text-zinc-700 dark:border-white/10 dark:bg-[#0d1117] dark:text-zinc-300">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-emerald-400" />
              {t}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel path="notes/why-needed.md">
        <SectionHeading icon={Filter} title="Why it's needed" />
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          Every business, app, and platform generates huge volumes of data daily —
          transactions, logs, clicks, sensor readings. Without analysis, this data
          is just a storage cost, not an asset. Companies that analyze data
          effectively make faster, cheaper, and more accurate decisions than
          competitors relying on intuition alone — and it underpins compliance,
          fraud detection, and product quality at scale.
        </p>
      </Panel>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Types of Data                                              */
/* ------------------------------------------------------------------ */

function TypesOfDataSection() {
  return (
    <Panel path="notes/types-of-data.md">
      <SectionHeading icon={Layers} title="Types of Data" subtitle="Every dataset is built from these building blocks" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-[#f7f8fa] p-4 dark:border-white/10 dark:bg-[#0d1117]">
          <p className="font-mono text-sm font-bold text-zinc-900 dark:text-white">Qualitative (Categorical)</p>
          <ul className="mt-2 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <li><span className="font-semibold text-amber-700 dark:text-emerald-400">Nominal</span> — no order, e.g. gender, city, blood group</li>
            <li><span className="font-semibold text-amber-700 dark:text-emerald-400">Ordinal</span> — has order, e.g. rating: poor / average / good</li>
          </ul>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-[#f7f8fa] p-4 dark:border-white/10 dark:bg-[#0d1117]">
          <p className="font-mono text-sm font-bold text-zinc-900 dark:text-white">Quantitative (Numerical)</p>
          <ul className="mt-2 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <li><span className="font-semibold text-amber-700 dark:text-emerald-400">Discrete</span> — countable, e.g. number of orders</li>
            <li><span className="font-semibold text-amber-700 dark:text-emerald-400">Continuous</span> — measurable, e.g. height, temperature</li>
          </ul>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-[#f7f8fa] p-4 dark:border-white/10 dark:bg-[#0d1117]">
          <p className="font-mono text-sm font-bold text-zinc-900 dark:text-white">Interval vs Ratio</p>
          <ul className="mt-2 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <li><span className="font-semibold text-amber-700 dark:text-emerald-400">Interval</span> — no true zero, e.g. temperature in °C</li>
            <li><span className="font-semibold text-amber-700 dark:text-emerald-400">Ratio</span> — true zero exists, e.g. weight, age, price</li>
          </ul>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-[#f7f8fa] p-4 dark:border-white/10 dark:bg-[#0d1117]">
          <p className="font-mono text-sm font-bold text-zinc-900 dark:text-white">By Structure</p>
          <ul className="mt-2 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <li><span className="font-semibold text-amber-700 dark:text-emerald-400">Structured</span> — rows/columns, SQL tables</li>
            <li><span className="font-semibold text-amber-700 dark:text-emerald-400">Semi-structured</span> — JSON, XML, logs</li>
            <li><span className="font-semibold text-amber-700 dark:text-emerald-400">Unstructured</span> — images, video, free text, audio</li>
          </ul>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Types of Analysis                                          */
/* ------------------------------------------------------------------ */

function TypesOfAnalysisSection() {
  const rows = [
    { title: "Descriptive", q: "What happened?", ex: "Monthly sales report, dashboards, averages" },
    { title: "Diagnostic", q: "Why did it happen?", ex: "Root-cause analysis, drill-downs, correlation checks" },
    { title: "Predictive", q: "What will happen?", ex: "Sales forecasting, churn prediction, regression models" },
    { title: "Prescriptive", q: "What should we do?", ex: "Inventory optimization, recommendation engines" },
    { title: "Exploratory (EDA)", q: "What patterns exist?", ex: "Open-ended investigation before a hypothesis is fixed" },
  ];
  return (
    <>
      <Panel path="notes/types-of-analysis.md">
        <SectionHeading icon={PieChart} title="Types of Data Analysis" subtitle="Four (plus one) lenses to look at data through" />
        <AnalysisTypesDiagram />
      </Panel>
      <Panel path="notes/types-of-analysis-detail.md">
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.title} className="rounded-lg border border-zinc-200 bg-[#f7f8fa] p-4 dark:border-white/10 dark:bg-[#0d1117]">
              <p className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
                {r.title} <span className="font-normal text-zinc-500 dark:text-zinc-400">— {r.q}</span>
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{r.ex}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Process / Pipeline                                         */
/* ------------------------------------------------------------------ */

function ProcessSection() {
  const steps = [
    { t: "Collect", d: "Gather data from surveys, databases, APIs, logs, sensors." },
    { t: "Clean", d: "Handle missing values, duplicates, outliers, wrong types." },
    { t: "Explore (EDA)", d: "Summary statistics, distributions, correlations." },
    { t: "Analyze", d: "Apply statistical tests or models to answer the question." },
    { t: "Visualize", d: "Charts, graphs, dashboards to communicate findings." },
    { t: "Interpret", d: "Translate numbers into a narrative / business meaning." },
    { t: "Decide / Act", d: "Use the insight to make or support a real decision." },
  ];
  return (
    <>
      <Panel path="notes/pipeline-diagram.md">
        <SectionHeading icon={Workflow} title="Data Analysis Pipeline" subtitle="Block diagram of the end-to-end flow" />
        <PipelineDiagram />
      </Panel>
      <Panel path="notes/pipeline-detail.md">
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={s.t} className="flex gap-3 rounded-lg border border-zinc-200 bg-[#f7f8fa] p-3 dark:border-white/10 dark:bg-[#0d1117]">
              <span className="font-mono text-sm font-bold text-amber-700 dark:text-emerald-400">0{i + 1}</span>
              <div>
                <p className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{s.t}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Panel>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Formulas                                                   */
/* ------------------------------------------------------------------ */

function FormulasSection() {
  return (
    <>
      <Panel path="formulas/central-tendency.ts">
        <SectionHeading icon={Sigma} title="Central Tendency & Spread" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormulaCard name="Mean (x̄)" formula={`x̄ = (Σx) / n`} />
          <FormulaCard name="Median" formula={`middle value of sorted data\n(avg of 2 middles if n is even)`} />
          <FormulaCard name="Mode" formula={`most frequently occurring value`} />
          <FormulaCard name="Range" formula={`Range = Max − Min`} />
          <FormulaCard name="Population Variance" formula={`σ² = Σ(x − μ)² / N`} />
          <FormulaCard name="Sample Variance" formula={`s² = Σ(x − x̄)² / (n − 1)`} />
          <FormulaCard name="Standard Deviation" formula={`σ = √σ²     s = √s²`} />
          <FormulaCard name="Coefficient of Variation" formula={`CV = (σ / μ) × 100%`} />
        </div>
      </Panel>

      <Panel path="formulas/position-outliers.ts">
        <SectionHeading icon={LineChart} title="Position & Outliers" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormulaCard name="Z-score" formula={`z = (x − μ) / σ`} note="How many std-devs a value is from the mean" />
          <FormulaCard name="Interquartile Range" formula={`IQR = Q3 − Q1`} />
          <FormulaCard
            name="Outlier bounds"
            formula={`Lower = Q1 − 1.5×IQR\nUpper = Q3 + 1.5×IQR`}
          />
          <FormulaCard name="Percentage Change" formula={`% Change = [(New − Old)/Old] × 100`} />
        </div>
      </Panel>

      <Panel path="formulas/relationships.ts">
        <SectionHeading icon={GitBranch} title="Relationships Between Variables" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormulaCard
            name="Pearson Correlation (r)"
            formula={`r = Σ[(x−x̄)(y−ȳ)] / √[Σ(x−x̄)²·Σ(y−ȳ)²]`}
            note="Ranges from −1 (perfect negative) to +1 (perfect positive)"
          />
          <FormulaCard
            name="Simple Linear Regression"
            formula={`y = mx + b\nm = [nΣxy − ΣxΣy] / [nΣx² − (Σx)²]\nb = [Σy − mΣx] / n`}
          />
          <FormulaCard name="R-squared" formula={`R² = 1 − (SS_res / SS_tot)`} note="Goodness of fit, 0 to 1" />
        </div>
      </Panel>

      <Panel path="formulas/probability-testing.ts">
        <SectionHeading icon={Sigma} title="Probability & Hypothesis Testing" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormulaCard name="Probability" formula={`P(A) = favorable outcomes / total outcomes`} />
          <FormulaCard name="Conditional Probability" formula={`P(A|B) = P(A ∩ B) / P(B)`} />
          <FormulaCard name="Bayes' Theorem" formula={`P(A|B) = [P(B|A)·P(A)] / P(B)`} />
          <FormulaCard name="Confidence Interval" formula={`CI = x̄ ± z*(σ/√n)`} />
          <FormulaCard
            name="t-statistic (2 means)"
            formula={`t = (x̄1 − x̄2) / √[(s1²/n1)+(s2²/n2)]`}
          />
          <FormulaCard name="Chi-Square" formula={`χ² = Σ[(O − E)² / E]`} note="Tests association between categorical variables" />
        </div>
      </Panel>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Roadmap                                                    */
/* ------------------------------------------------------------------ */

function RoadmapSection() {
  return (
    <Panel path="notes/roadmap.md">
      <SectionHeading icon={Map} title="Data Analysis Roadmap" subtitle="A practical order to learn things in" />
      <div className="space-y-3">
        {ROADMAP.map((r, i) => (
          <div key={r.stage} className="flex gap-4 rounded-lg border border-zinc-200 bg-[#f7f8fa] p-4 dark:border-white/10 dark:bg-[#0d1117]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-600/40 font-mono text-xs font-bold text-amber-700 dark:border-emerald-400/40 dark:text-emerald-400">
              {i + 1}
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{r.stage}</p>
              <ul className="mt-1.5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                {r.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <ChevronRight size={14} className="mt-0.5 shrink-0 text-amber-600 dark:text-emerald-400" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Build Your Own AI Model                                    */
/* ------------------------------------------------------------------ */

function BuildAiSection() {
  const steps = [
    "Define the problem — what decision or prediction are we automating?",
    "Collect data — internal databases, public datasets, APIs, scraping.",
    "Clean & preprocess — missing values, encoding, scaling, deduplication.",
    "Exploratory Data Analysis — understand distributions & relationships.",
    "Feature engineering — create/select the variables that matter most.",
    "Split data — train / validation / test sets.",
    "Choose a model — regression, tree-based, neural network, etc.",
    "Train the model — fit it on the training data.",
    "Evaluate — accuracy, precision/recall, RMSE, R², confusion matrix.",
    "Tune — hyperparameter tuning, cross-validation.",
    "Deploy — API endpoint, batch job, or embedded app feature.",
    "Monitor — watch for data drift and retrain periodically.",
  ];
  return (
    <>
      <Panel path="notes/build-your-own-ai-model.md">
        <SectionHeading
          icon={Brain}
          title="How to Build Your Own AI Model — Using Data Analysis"
          subtitle="Data analysis is the fuel; the model is the engine"
        />
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          Every AI model — no matter how advanced — starts with careful data
          analysis. The quality of your data and how well you understand it
          determines the quality of your model:{" "}
          <span className="font-mono text-amber-700 dark:text-emerald-400">
            "garbage in, garbage out."
          </span>
        </p>
      </Panel>
      <Panel path="notes/build-ai-steps.md">
        <ol className="space-y-2.5">
          {steps.map((s, i) => (
            <li key={s} className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-[#f7f8fa] p-3 dark:border-white/10 dark:bg-[#0d1117]">
              <span className="mt-0.5 font-mono text-xs font-bold text-amber-700 dark:text-emerald-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{s}</p>
            </li>
          ))}
        </ol>
      </Panel>
      <Panel path="notes/ai-model-stack.md">
        <SectionHeading icon={Cpu} title="Common Tooling Stack" />
        <div className="flex flex-wrap gap-2">
          {["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow / PyTorch", "SQL", "Jupyter", "Matplotlib / Seaborn", "MLflow"].map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </Panel>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Cheat Sheet                                                */
/* ------------------------------------------------------------------ */

function CheatsheetSection() {
  const rows: [string, string][] = [
    ["Central tendency", "mean, median, mode"],
    ["Spread", "range, variance, std dev, IQR"],
    ["Relationship", "correlation (r), regression (y = mx + b)"],
    ["Distribution shape", "skewness, kurtosis"],
    ["Significance testing", "t-test, chi-square, ANOVA — p < 0.05 = significant"],
    ["Core tools", "Excel, SQL, Python (Pandas/NumPy), R, Power BI, Tableau"],
    ["ML bridge metrics", "accuracy, precision, recall, F1, RMSE, R²"],
  ];
  return (
    <Panel path="notes/cheat-sheet.md">
      <SectionHeading icon={ClipboardList} title="Quick Cheat Sheet" subtitle="One-glance reference card" />
      <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-white/10">
        <table className="w-full border-collapse text-left text-sm">
          <tbody>
            {rows.map(([k, v], i) => (
              <tr key={k} className={i % 2 === 0 ? "bg-[#f7f8fa] dark:bg-[#0d1117]" : "bg-white dark:bg-[#0a0e14]"}>
                <td className="whitespace-nowrap border-b border-zinc-200 px-4 py-2.5 font-mono font-semibold text-amber-700 dark:border-white/10 dark:text-emerald-400">
                  {k}
                </td>
                <td className="border-b border-zinc-200 px-4 py-2.5 text-zinc-700 dark:border-white/10 dark:text-zinc-300">
                  {v}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Blog                                                       */
/* ------------------------------------------------------------------ */

function BlogSection() {
  const cases = [
    "Business intelligence & KPI dashboards",
    "Marketing: customer segmentation, campaign ROI",
    "Finance: fraud detection, risk scoring, forecasting",
    "Healthcare: patient outcomes, epidemiology",
    "E-commerce: recommendation engines, demand forecasting",
    "Sports analytics, policy analysis, education analytics",
  ];
  return (
    <>
      <Panel path="blog/data-analysis-today.md">
        <SectionHeading icon={FileText} title="Data Analysis: Uses, Features & the Road Ahead" />
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          Data analysis has quietly become the operating system of modern
          decision-making. Every product recommendation, every fraud alert,
          every hospital triage score and every stock market signal is, at
          its core, a data analysis pipeline running behind the scenes.
          Understanding it is no longer optional for engineers, founders, or
          analysts — it's foundational literacy.
        </p>
      </Panel>

      <Panel path="blog/use-cases.md">
        <SectionHeading icon={Lightbulb} title="Use Cases Across Industries" />
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {cases.map((c) => (
            <li key={c} className="flex items-start gap-2 rounded-lg border border-zinc-200 bg-[#f7f8fa] p-3 text-sm text-zinc-700 dark:border-white/10 dark:bg-[#0d1117] dark:text-zinc-300">
              <Rocket size={15} className="mt-0.5 shrink-0 text-amber-600 dark:text-emerald-400" />
              {c}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel path="blog/future.md">
        <SectionHeading icon={Sparkles} title="The Future of Data Analysis" />
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li>• Deeper integration with AI/ML — automated insight generation.</li>
          <li>• Real-time / streaming analytics becoming the default, not the exception.</li>
          <li>• Natural-language interfaces to "ask your data" directly.</li>
          <li>• Greater emphasis on data governance, privacy, and ethics.</li>
          <li>• Augmented analytics — AI suggests what to look at next.</li>
        </ul>
      </Panel>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Pros & Cons                                                */
/* ------------------------------------------------------------------ */

function ProsConsSection() {
  const good = [
    "Enables smarter, evidence-based decisions",
    "Uncovers hidden patterns and opportunities",
    "Improves efficiency and reduces cost",
    "Personalizes products & services",
    "Powers scientific & medical breakthroughs",
  ];
  const bad = [
    "Bias in data leads to bias in conclusions",
    "Privacy risks if data is misused or leaked",
    "Misinterpretation — correlation mistaken for causation",
    "Overfitting / overtrust in models without human judgement",
    "Can be used manipulatively (dark patterns, surveillance)",
  ];
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Panel path="notes/good-side.md">
        <SectionHeading icon={ThumbsUp} title="Good Side" />
        <ul className="space-y-2">
          {good.map((g) => (
            <li key={g} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
              {g}
            </li>
          ))}
        </ul>
      </Panel>
      <Panel path="notes/bad-side.md">
        <SectionHeading icon={ThumbsDown} title="Bad Side / Risks" />
        <ul className="space-y-2">
          {bad.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
              {b}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}