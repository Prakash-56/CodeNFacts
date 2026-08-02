"use client";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Database,
  BrainCircuit,
  TrendingUp,
  Code2,
  Sigma,
  Cpu,
  Cloud,
  GitBranch,
  CheckCircle2,
  XCircle,
  Download,
  ChevronDown,
  Lightbulb,
  AlertTriangle,
  Network,
  LineChart,
  Table2,
  Terminal,
  Sparkles,
  BookOpen,
  Layers,
  Target,
  Puzzle,
  HelpCircle,
  ArrowRight,
  Binary,
  FlaskConical,
  ServerCog,
  Rocket,
  ShieldCheck,
  Scale,
  Boxes,
  Gauge,
} from "lucide-react";
/* ------------------------------------------------------------------ */
/* Animation variant */
/* ------------------------------------------------------------------ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" },
  }),
};
/* ------------------------------------------------------------------ */
/* Terminal chrome wrapper */
/* ------------------------------------------------------------------ */
function TerminalPanel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117] shadow-sm overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0a0e14]">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-xs font-mono text-black/50 dark:text-white/40">
          {title}
        </span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* Toast */
/* ------------------------------------------------------------------ */
function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const fire = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };
  return { toast, fire };
}
/* ------------------------------------------------------------------ */
/* Static data */
/* ------------------------------------------------------------------ */
const helpsCards = [
  {
    icon: Target,
    title: "Better Decisions",
    desc: "Turns raw numbers into evidence, so choices are based on patterns instead of gut feeling.",
  },
  {
    icon: TrendingUp,
    title: "Predicts the Future",
    desc: "Forecasting models estimate demand, churn, prices, and risk before they happen.",
  },
  {
    icon: ShieldCheck,
    title: "Detects Fraud & Risk",
    desc: "Anomaly detection flags suspicious transactions and system failures in real time.",
  },
  {
    icon: Sparkles,
    title: "Personalization",
    desc: "Recommendation engines tailor feeds, products, and content to each individual user.",
  },
  {
    icon: Cpu,
    title: "Automation",
    desc: "Trained models replace repetitive manual judgment calls with instant predictions.",
  },
  {
    icon: Scale,
    title: "Resource Optimization",
    desc: "Supply chains, hospital beds, and traffic lights run more efficiently with data models.",
  },
];
const whatIfNot = [
  "Businesses would rely purely on guesswork and intuition for major decisions.",
  "Fraud and anomalies would go undetected until real damage is done.",
  "Products and content would feel generic — no personalization at all.",
  "Diseases would be diagnosed later, without data-driven early warning systems.",
  "Resources like electricity, traffic, and inventory would be wasted at scale.",
  "AI as we know it (search, voice assistants, self-driving) wouldn't exist.",
];
const techStack = [
  {
    category: "Languages",
    icon: Code2,
    items: ["Python", "R", "SQL", "Julia", "Scala"],
  },
  {
    category: "Data Handling",
    icon: Table2,
    items: ["Pandas", "NumPy", "Polars", "Dask", "Apache Arrow"],
  },
  {
    category: "Visualization",
    icon: LineChart,
    items: ["Matplotlib", "Seaborn", "Plotly", "Tableau", "Power BI"],
  },
  {
    category: "Big Data",
    icon: Boxes,
    items: ["Apache Spark", "Hadoop", "Kafka", "Hive", "Airflow"],
  },
  {
    category: "Databases",
    icon: Database,
    items: ["PostgreSQL", "MongoDB", "BigQuery", "Snowflake", "Redis"],
  },
  {
    category: "Cloud & MLOps",
    icon: Cloud,
    items: ["AWS SageMaker", "GCP Vertex AI", "Azure ML", "MLflow", "Docker"],
  },
];
const mathTopics = [
  {
    title: "Linear Algebra",
    icon: Layers,
    points: ["Vectors & matrices", "Eigenvalues/eigenvectors", "Matrix decomposition (SVD, PCA)", "Dot & cross products"],
  },
  {
    title: "Statistics & Probability",
    icon: Sigma,
    points: ["Distributions (normal, binomial)", "Hypothesis testing", "Bayes' theorem", "Confidence intervals, p-values"],
  },
  {
    title: "Calculus",
    icon: Gauge,
    points: ["Derivatives & gradients", "Chain rule (backpropagation)", "Partial derivatives", "Optimization (gradient descent)"],
  },
  {
    title: "Discrete Math",
    icon: Binary,
    points: ["Graph theory (networks, trees)", "Combinatorics", "Set theory", "Algorithmic complexity (Big-O)"],
  },
];
const frameworks = [
  { name: "Scikit-learn", use: "Classical ML: regression, classification, clustering" },
  { name: "TensorFlow", use: "Production-grade deep learning at scale" },
  { name: "PyTorch", use: "Research-friendly deep learning, dynamic graphs" },
  { name: "Keras", use: "High-level API for fast neural network prototyping" },
  { name: "XGBoost / LightGBM", use: "Gradient-boosted trees for tabular data" },
  { name: "Hugging Face Transformers", use: "Pretrained NLP & LLM models" },
  { name: "OpenCV", use: "Computer vision & image processing" },
  { name: "LangChain", use: "Building AI-agent & LLM-powered pipelines" },
];
const cheatSheets = [
  { title: "Pandas Cheat Sheet", file: "pandas-cheatsheet.pdf" },
  { title: "NumPy Cheat Sheet", file: "numpy-cheatsheet.pdf" },
  { title: "SQL for Data Science", file: "sql-ds-cheatsheet.pdf" },
  { title: "Statistics Formulas", file: "statistics-cheatsheet.pdf" },
  { title: "Scikit-learn Workflow", file: "sklearn-cheatsheet.pdf" },
  { title: "ML Model Selection Guide", file: "model-selection-cheatsheet.pdf" },
];
const comparisonRows = [
  ["Goal", "Explain what happened & why", "Predict what will happen next"],
  ["Core skill", "Querying, reporting, dashboards", "Modeling, algorithms, statistics"],
  ["Tools", "SQL, Excel, Tableau, Power BI", "Python/R, scikit-learn, TensorFlow"],
  ["Output", "Reports, KPIs, visualizations", "Trained models, predictions, automation"],
  ["Math depth", "Descriptive statistics", "Linear algebra, probability, calculus"],
  ["Time horizon", "Looks at past & present data", "Builds systems for future data"],
];
const interviewQuestions = [
  {
    q: "You have a model with 99% accuracy on a fraud dataset — should you celebrate?",
    a: "Not necessarily. If only 1% of transactions are fraud, a model that always predicts 'not fraud' also hits 99% accuracy. Check precision, recall, and F1-score instead — accuracy is misleading on imbalanced data.",
  },
  {
    q: "Why might adding more features make a model worse?",
    a: "Irrelevant or correlated features add noise and increase variance, causing overfitting — the curse of dimensionality. More features need exponentially more data to generalize well.",
  },
  {
    q: "Two models have identical test accuracy. How do you pick one?",
    a: "Look beyond accuracy: inference speed, interpretability, training cost, robustness to distribution shift, and how confident/calibrated the predictions are.",
  },
  {
    q: "Your model performs great in training but poorly in production. Why?",
    a: "Likely data drift or leakage. Either the production data distribution changed, or the training data accidentally contained information (like future data) that won't exist at prediction time.",
  },
  {
    q: "If you can only fix one thing — more data or a better algorithm — which do you pick?",
    a: "Usually more (quality) data. A simple algorithm with abundant, clean, representative data often beats a sophisticated algorithm starved of data.",
  },
  {
    q: "Correlation between ice cream sales and drowning deaths is high. Does ice cream cause drowning?",
    a: "No — this is a classic confounding variable trap. Hot weather increases both swimming (and drowning risk) and ice cream sales. Correlation isn't causation.",
  },
];
const dataNeeds = [
  { label: "Volume", desc: "Enough examples to cover the pattern space — too little data means high variance." },
  { label: "Variety", desc: "Diverse examples across edge cases, demographics, and conditions to avoid bias." },
  { label: "Veracity", desc: "Clean, accurate, correctly-labeled data — garbage in, garbage out." },
  { label: "Balance", desc: "Roughly even class representation, or techniques like SMOTE/weighting to correct skew." },
  { label: "Relevance", desc: "Features that actually correlate with what you're trying to predict." },
  { label: "Freshness", desc: "Recent data that reflects the current real-world distribution, not a stale snapshot." },
];
const keepInMind = [
  { good: true, text: "Always split data into train/validation/test BEFORE any preprocessing to avoid leakage." },
  { good: true, text: "Understand your data before modeling — EDA saves hours of debugging later." },
  { good: true, text: "Track every experiment (params, metrics, data version) — reproducibility matters." },
  { good: true, text: "Start with a simple baseline model before jumping to deep learning." },
  { good: false, text: "Don't chase accuracy alone — check for bias, fairness, and real-world cost of errors." },
  { good: false, text: "Don't ignore data drift — a model that worked last year may silently be failing today." },
  { good: false, text: "Don't skip domain knowledge — the best data scientists understand the business, not just the math." },
];
const learnSteps = [
  { step: "01", title: "Foundations", desc: "Python, SQL, statistics basics, and data structures." },
  { step: "02", title: "Data Wrangling", desc: "Pandas, NumPy, cleaning, EDA, and visualization." },
  { step: "03", title: "Classical ML", desc: "Regression, classification, clustering with scikit-learn." },
  { step: "04", title: "Deep Learning", desc: "Neural networks, CNNs, RNNs with TensorFlow/PyTorch." },
  { step: "05", title: "Learn WITH AI", desc: "Use AI tutors/Copilot to explain errors, generate practice data, and quiz you — not just to autocomplete code." },
  { step: "06", title: "Real Projects", desc: "Kaggle competitions, end-to-end pipelines, deployment." },
  { step: "07", title: "MLOps & Deployment", desc: "Docker, APIs, model monitoring, CI/CD for models." },
];
/* ------------------------------------------------------------------ */
/* Small UI helpers */
/* ------------------------------------------------------------------ */
function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: any;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-amber-600 dark:text-emerald-400 text-sm font-mono mb-2">
        <Icon className="w-4 h-4" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
        {title}
      </h2>
    </div>
  );
}
function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 text-left px-4 py-4 hover:bg-[#f7f8fa] dark:hover:bg-white/5 transition-colors"
      >
        <Puzzle className="w-4 h-4 mt-1 shrink-0 text-amber-600 dark:text-emerald-400" />
        <span className="flex-1 text-sm sm:text-base font-medium text-black dark:text-white">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 mt-1 shrink-0 text-black/40 dark:text-white/40 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pl-11 text-sm text-black/70 dark:text-white/60 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* SVG Diagrams */
/* ------------------------------------------------------------------ */
function VennDiagram() {
  return (
    <svg viewBox="0 0 420 300" className="w-full max-w-md mx-auto">
      <circle cx="150" cy="120" r="100" className="fill-amber-400/20 dark:fill-emerald-400/15 stroke-amber-500 dark:stroke-emerald-400" strokeWidth="1.5" />
      <circle cx="270" cy="120" r="100" className="fill-sky-400/20 dark:fill-sky-400/15 stroke-sky-500 dark:stroke-sky-400" strokeWidth="1.5" />
      <circle cx="210" cy="210" r="100" className="fill-fuchsia-400/20 dark:fill-fuchsia-400/15 stroke-fuchsia-500 dark:stroke-fuchsia-400" strokeWidth="1.5" />
      <text x="95" y="90" className="fill-black dark:fill-white text-[13px] font-semibold">Math &</text>
      <text x="95" y="106" className="fill-black dark:fill-white text-[13px] font-semibold">Statistics</text>
      <text x="255" y="90" className="fill-black dark:fill-white text-[13px] font-semibold">Programming</text>
      <text x="255" y="106" className="fill-black dark:fill-white text-[13px] font-semibold">/ CS</text>
      <text x="180" y="260" className="fill-black dark:fill-white text-[13px] font-semibold">Domain</text>
      <text x="180" y="276" className="fill-black dark:fill-white text-[13px] font-semibold">Knowledge</text>
      <text x="185" y="150" className="fill-black dark:fill-white text-[12px] font-bold">Data</text>
      <text x="175" y="166" className="fill-black dark:fill-white text-[12px] font-bold">Science</text>
    </svg>
  );
}
function PipelineDiagram() {
  const stages = [
    "Collect",
    "Clean",
    "Explore",
    "Feature Eng.",
    "Split",
    "Train",
    "Validate",
    "Deploy",
  ];
  return (
    <svg viewBox="0 0 900 140" className="w-full">
      {stages.map((s, i) => {
        const x = 20 + i * 112;
        return (
          <g key={s}>
            <rect
              x={x}
              y="40"
              width="92"
              height="56"
              rx="10"
              className="fill-white dark:fill-[#0a0e14] stroke-amber-500 dark:stroke-emerald-400"
              strokeWidth="1.5"
            />
            <text
              x={x + 46}
              y="73"
              textAnchor="middle"
              className="fill-black dark:fill-white text-[11px] font-medium"
            >
              {s}
            </text>
            {i < stages.length - 1 && (
              <path
                d={`M ${x + 92} 68 L ${x + 110} 68`}
                className="stroke-black/30 dark:stroke-white/30"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-black/40 dark:fill-white/40" />
        </marker>
      </defs>
    </svg>
  );
}
function ModelTrainingSketch() {
  return (
    <svg viewBox="0 0 700 220" className="w-full">
      <rect x="10" y="70" width="140" height="70" rx="10" className="fill-amber-400/15 dark:fill-emerald-400/10 stroke-amber-500 dark:stroke-emerald-400" strokeWidth="1.5" />
      <text x="80" y="100" textAnchor="middle" className="fill-black dark:fill-white text-[12px] font-semibold">Raw Data</text>
      <text x="80" y="118" textAnchor="middle" className="fill-black/60 dark:fill-white/50 text-[10px]">Labeled examples</text>
      <path d="M150 105 L200 105" className="stroke-black/30 dark:stroke-white/30" strokeWidth="2" markerEnd="url(#arrow2)" />
      <rect x="200" y="60" width="150" height="100" rx="10" className="fill-white dark:fill-[#0a0e14] stroke-sky-500 dark:stroke-sky-400" strokeWidth="1.5" />
      <text x="275" y="95" textAnchor="middle" className="fill-black dark:fill-white text-[12px] font-semibold">Model</text>
      <text x="275" y="112" textAnchor="middle" className="fill-black/60 dark:fill-white/50 text-[10px]">Forward pass →</text>
      <text x="275" y="126" textAnchor="middle" className="fill-black/60 dark:fill-white/50 text-[10px]">prediction ŷ</text>
      <path d="M350 105 L400 105" className="stroke-black/30 dark:stroke-white/30" strokeWidth="2" markerEnd="url(#arrow2)" />
      <rect x="400" y="60" width="150" height="100" rx="10" className="fill-white dark:fill-[#0a0e14] stroke-fuchsia-500 dark:stroke-fuchsia-400" strokeWidth="1.5" />
      <text x="475" y="95" textAnchor="middle" className="fill-black dark:fill-white text-[12px] font-semibold">Loss Function</text>
      <text x="475" y="112" textAnchor="middle" className="fill-black/60 dark:fill-white/50 text-[10px]">Compare ŷ</text>
      <text x="475" y="126" textAnchor="middle" className="fill-black/60 dark:fill-white/50 text-[10px]">vs true label y</text>
      <path d="M475 160 C 475 200, 275 200, 275 160" className="fill-none stroke-black/40 dark:stroke-white/40" strokeWidth="2" markerEnd="url(#arrow2)" />
      <text x="375" y="205" textAnchor="middle" className="fill-black/60 dark:fill-white/50 text-[10px]">Backpropagation — adjust weights</text>
      <path d="M550 105 L600 105" className="stroke-black/30 dark:stroke-white/30" strokeWidth="2" markerEnd="url(#arrow2)" />
      <rect x="600" y="70" width="90" height="70" rx="10" className="fill-amber-400/15 dark:fill-emerald-400/10 stroke-amber-500 dark:stroke-emerald-400" strokeWidth="1.5" />
      <text x="645" y="100" textAnchor="middle" className="fill-black dark:fill-white text-[12px] font-semibold">Trained</text>
      <text x="645" y="116" textAnchor="middle" className="fill-black dark:fill-white text-[12px] font-semibold">Model</text>
      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-black/40 dark:fill-white/40" />
        </marker>
      </defs>
    </svg>
  );
}
/* ------------------------------------------------------------------ */
/* Page */
/* ------------------------------------------------------------------ */
export default function DataSciencePage() {
  const { toast, fire } = useToast();
  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#0a0e14] text-black dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-20">
        {/* ---------------- HERO ---------------- */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <TerminalPanel title="~/data-science">
            <div className="flex items-center gap-2 text-amber-600 dark:text-emerald-400 text-xs font-mono mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>CodeNFacts/ data-science</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Data Science
            </h1>
            <p className="text-black/70 dark:text-white/60 max-w-2xl leading-relaxed">
              The discipline of extracting knowledge and predictions from data —
              blending statistics, programming, and domain expertise to turn raw
              numbers into decisions, products, and intelligent systems.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {["Python", "Statistics", "Machine Learning", "Big Data", "AI"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs font-mono border border-amber-500/30 dark:border-emerald-400/30 text-amber-700 dark:text-emerald-300 bg-amber-50 dark:bg-emerald-400/10"
                >
                  {t}
                </span>
              ))}
            </div>
          </TerminalPanel>
        </motion.div>
        {/* ---------------- WHAT IS DATA & DATA SCIENCE ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={BookOpen} eyebrow="01 — Fundamentals" title="What is Data, and What is Data Science?" />
          <div className="grid md:grid-cols-2 gap-5">
            <TerminalPanel title="data.ts">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-amber-600 dark:text-emerald-400" />
                <h3 className="font-semibold">Data</h3>
              </div>
              <p className="text-sm text-black/70 dark:text-white/60 leading-relaxed">
                Data is raw facts and figures — numbers, text, images, clicks,
                sensor readings — collected from the real world. On its own it's
                unorganized; it only becomes valuable once it's structured,
                cleaned, and interpreted.
              </p>
            </TerminalPanel>
            <TerminalPanel title="data_science.ts">
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit className="w-5 h-5 text-amber-600 dark:text-emerald-400" />
                <h3 className="font-semibold">Data Science</h3>
              </div>
              <p className="text-sm text-black/70 dark:text-white/60 leading-relaxed">
                Data Science is the field that uses statistics, programming, and
                domain knowledge to collect, clean, analyze, and model data —
                turning it into predictions, automation, and decisions. It sits
                at the intersection shown in the diagram below.
              </p>
            </TerminalPanel>
          </div>
          <div className="mt-6">
            <TerminalPanel title="venn-diagram.svg">
              <VennDiagram />
            </TerminalPanel>
          </div>
        </motion.section>
        {/* ---------------- WHY NEEDED / WHAT IF NOT ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={Lightbulb} eyebrow="02 — Motivation" title="Why Data Science Matters Now" />
          <div className="grid md:grid-cols-2 gap-5">
            <TerminalPanel title="why-needed.md">
              <p className="text-sm text-black/70 dark:text-white/60 leading-relaxed mb-4">
                Every click, purchase, sensor reading, and interaction today
                generates data. Companies that can turn that flood of data into
                insight move faster, personalize better, and catch problems
                before they escalate — those that can't fall behind.
              </p>
              <ul className="space-y-2">
                {["Explosion of digital data (IoT, social, transactions)", "Cheap compute & storage made large-scale modeling possible", "Competitive pressure to personalize and automate", "AI systems are only as good as the data pipelines behind them"].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-black/70 dark:text-white/60">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </TerminalPanel>
            <TerminalPanel title="what-if-not.md">
              <p className="text-sm text-black/70 dark:text-white/60 leading-relaxed mb-4">
                Imagine a world without data science — no predictions, no
                personalization, decisions made blind:
              </p>
              <ul className="space-y-2">
                {whatIfNot.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-black/70 dark:text-white/60">
                    <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </TerminalPanel>
          </div>
        </motion.section>
        {/* ---------------- HOW IT HELPS ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={Rocket} eyebrow="03 — Impact" title="How Data Science Helps" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {helpsCards.map((c, i) => (
              <motion.div key={c.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <TerminalPanel title={c.title.toLowerCase().replace(/\s/g, "_") + ".ts"}>
                  <c.icon className="w-6 h-6 text-amber-600 dark:text-emerald-400 mb-3" />
                  <h3 className="font-semibold mb-1.5">{c.title}</h3>
                  <p className="text-sm text-black/60 dark:text-white/55 leading-relaxed">{c.desc}</p>
                </TerminalPanel>
              </motion.div>
            ))}
          </div>
        </motion.section>
        {/* ---------------- DS vs DA ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={Scale} eyebrow="04 — Comparison" title="Data Science vs. Data Analysis" />
          <TerminalPanel title="comparison.table">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10">
                    <th className="text-left py-2.5 pr-4 font-mono text-black/50 dark:text-white/40">Aspect</th>
                    <th className="text-left py-2.5 pr-4 font-semibold text-sky-600 dark:text-sky-400">Data Analysis</th>
                    <th className="text-left py-2.5 font-semibold text-amber-600 dark:text-emerald-400">Data Science</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row[0]} className="border-b border-black/5 dark:border-white/5 last:border-0">
                      <td className="py-3 pr-4 font-mono text-xs text-black/50 dark:text-white/40">{row[0]}</td>
                      <td className="py-3 pr-4 text-black/75 dark:text-white/65">{row[1]}</td>
                      <td className="py-3 text-black/75 dark:text-white/65">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-black/50 dark:text-white/40 mt-4 italic">
              Rule of thumb: Data Analysis looks backward and explains. Data
              Science looks forward and predicts/automates.
            </p>
          </TerminalPanel>
        </motion.section>
        {/* ---------------- HOW TO LEARN WITH AI ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={Sparkles} eyebrow="05 — Roadmap" title="How to Learn Data Science with AI" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {learnSteps.map((s, i) => (
              <motion.div key={s.step} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <TerminalPanel title={`step_${s.step}.ts`}>
                  <span className="text-2xl font-extrabold text-amber-500/40 dark:text-emerald-400/30">{s.step}</span>
                  <h3 className="font-semibold mt-1 mb-1.5">{s.title}</h3>
                  <p className="text-xs text-black/60 dark:text-white/55 leading-relaxed">{s.desc}</p>
                </TerminalPanel>
              </motion.div>
            ))}
          </div>
          <div className="mt-5">
            <TerminalPanel title="ai-learning-tip.md">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 mt-0.5 text-amber-600 dark:text-emerald-400 shrink-0" />
                <p className="text-sm text-black/70 dark:text-white/60 leading-relaxed">
                  Use AI tools (like CodeNFacts' AI Tutor) to explain error
                  tracebacks line-by-line, generate synthetic practice datasets,
                  quiz you on statistics concepts, and review your notebook code
                  for bad practices — treat AI as a tutor that asks "why," not
                  just a code generator.
                </p>
              </div>
            </TerminalPanel>
          </div>
        </motion.section>
        {/* ---------------- TECH STACK ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={ServerCog} eyebrow="06 — Tools" title="Tech Stack" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((cat, i) => (
              <motion.div key={cat.category} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <TerminalPanel title={cat.category.toLowerCase().replace(/\s/g, "_") + ".json"}>
                  <div className="flex items-center gap-2 mb-3">
                    <cat.icon className="w-5 h-5 text-amber-600 dark:text-emerald-400" />
                    <h3 className="font-semibold">{cat.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((item) => (
                      <span key={item} className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#f7f8fa] dark:bg-white/5 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/60">
                        {item}
                      </span>
                    ))}
                  </div>
                </TerminalPanel>
              </motion.div>
            ))}
          </div>
        </motion.section>
        {/* ---------------- MATHEMATICS ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={Sigma} eyebrow="07 — Foundations" title="Mathematics Required" />
          <div className="grid sm:grid-cols-2 gap-4">
            {mathTopics.map((m, i) => (
              <motion.div key={m.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <TerminalPanel title={m.title.toLowerCase().replace(/\s/g, "_") + ".md"}>
                  <div className="flex items-center gap-2 mb-3">
                    <m.icon className="w-5 h-5 text-amber-600 dark:text-emerald-400" />
                    <h3 className="font-semibold">{m.title}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {m.points.map((p) => (
                      <li key={p} className="text-sm text-black/65 dark:text-white/55 flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 mt-1 shrink-0 text-amber-500/70 dark:text-emerald-400/70" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </TerminalPanel>
              </motion.div>
            ))}
          </div>
        </motion.section>
        {/* ---------------- FRAMEWORKS ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={GitBranch} eyebrow="08 — Frameworks" title="ML & DL Frameworks" />
          <TerminalPanel title="frameworks.json">
            <div className="grid sm:grid-cols-2 gap-3">
              {frameworks.map((f) => (
                <div key={f.name} className="flex items-start gap-3 p-3 rounded-lg bg-[#f7f8fa] dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <FlaskConical className="w-4 h-4 mt-0.5 text-amber-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{f.name}</p>
                    <p className="text-xs text-black/55 dark:text-white/50">{f.use}</p>
                  </div>
                </div>
              ))}
            </div>
          </TerminalPanel>
        </motion.section>
        {/* ---------------- MODEL TRAINING ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={Cpu} eyebrow="09 — Training" title="How AI Models Are Trained on Data" />
          <TerminalPanel title="training_pipeline.svg" className="mb-5">
            <PipelineDiagram />
          </TerminalPanel>
          <TerminalPanel title="training_loop.svg">
            <ModelTrainingSketch />
            <p className="text-xs text-black/50 dark:text-white/40 mt-3 italic">
              The model predicts, a loss function scores the error, and
              backpropagation nudges the weights to reduce that error —
              repeated over many epochs until performance plateaus.
            </p>
          </TerminalPanel>
        </motion.section>
        {/* ---------------- DATA NEEDED ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={Database} eyebrow="10 — Requirements" title="How Much Data Does a Model Need?" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataNeeds.map((d, i) => (
              <motion.div key={d.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <TerminalPanel title={d.label.toLowerCase() + ".req"}>
                  <h3 className="font-semibold mb-1.5 text-amber-600 dark:text-emerald-400">{d.label}</h3>
                  <p className="text-sm text-black/65 dark:text-white/55 leading-relaxed">{d.desc}</p>
                </TerminalPanel>
              </motion.div>
            ))}
          </div>
          <div className="mt-5">
            <TerminalPanel title="rule-of-thumb.md">
              <p className="text-sm text-black/70 dark:text-white/60 leading-relaxed">
                There's no fixed number — a simple linear model might work with
                a few hundred rows, while a deep neural network on images may
                need tens of thousands. What matters more than raw volume is
                whether the data <em>represents</em> the real-world scenarios the
                model will face after deployment.
              </p>
            </TerminalPanel>
          </div>
        </motion.section>
        {/* ---------------- CHEAT SHEETS ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={Download} eyebrow="11 — Reference" title="Cheat Sheets" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cheatSheets.map((c, i) => (
              <motion.div key={c.file} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <TerminalPanel title={c.file}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-600 dark:text-emerald-400" />
                      <h3 className="text-sm font-semibold">{c.title}</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => fire(`Downloading ${c.title}...`)}
                    className="mt-4 w-full flex items-center justify-center gap-2 text-xs font-mono px-3 py-2 rounded-md border border-amber-500/40 dark:border-emerald-400/40 text-amber-700 dark:text-emerald-300 hover:bg-amber-50 dark:hover:bg-emerald-400/10 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </button>
                </TerminalPanel>
              </motion.div>
            ))}
          </div>
        </motion.section>
        {/* ---------------- IMPORTANT THINGS ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={AlertTriangle} eyebrow="12 — Best Practices" title="Important Things to Keep in Mind" />
          <TerminalPanel title="best_practices.md">
            <ul className="space-y-3">
              {keepInMind.map((k) => (
                <li key={k.text} className="flex items-start gap-3 text-sm">
                  {k.good ? (
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                  )}
                  <span className="text-black/70 dark:text-white/60 leading-relaxed">{k.text}</span>
                </li>
              ))}
            </ul>
          </TerminalPanel>
        </motion.section>
        {/* ---------------- INTERVIEW QUESTIONS ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={HelpCircle} eyebrow="13 — Interview Prep" title="Puzzled Interview Questions" />
          <div className="space-y-3">
            {interviewQuestions.map((item) => (
              <Accordion key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </motion.section>
        {/* ---------------- NETWORK / SYSTEM SKETCH ---------------- */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <SectionHeading icon={Network} eyebrow="14 — Big Picture" title="The Data Science Ecosystem" />
          <TerminalPanel title="ecosystem.svg">
            <svg viewBox="0 0 700 220" className="w-full">
              <circle cx="350" cy="110" r="46" className="fill-amber-400/20 dark:fill-emerald-400/15 stroke-amber-500 dark:stroke-emerald-400" strokeWidth="1.5" />
              <text x="350" y="106" textAnchor="middle" className="fill-black dark:fill-white text-[11px] font-bold">Data</text>
              <text x="350" y="120" textAnchor="middle" className="fill-black dark:fill-white text-[11px] font-bold">Scientist</text>
              {[
                { x: 90, y: 40, label: "Raw Data\nSources" },
                { x: 610, y: 40, label: "Business\nStakeholders" },
                { x: 90, y: 180, label: "ML Models &\nPipelines" },
                { x: 610, y: 180, label: "Dashboards &\nAPIs" },
              ].map((n) => (
                <g key={n.label}>
                  <rect x={n.x - 60} y={n.y - 22} width="120" height="46" rx="8" className="fill-white dark:fill-[#0a0e14] stroke-black/20 dark:stroke-white/20" strokeWidth="1.2" />
                  {n.label.split("\n").map((line, li) => (
                    <text key={li} x={n.x} y={n.y - 2 + li * 13} textAnchor="middle" className="fill-black/70 dark:fill-white/60 text-[10px]">
                      {line}
                    </text>
                  ))}
                  <line x1={n.x} y1={n.y} x2="350" y2="110" className="stroke-black/20 dark:stroke-white/15" strokeWidth="1.2" />
                </g>
              ))}
            </svg>
          </TerminalPanel>
        </motion.section>
      </div>
      {/* ---------------- TOAST ---------------- */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium shadow-lg z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}
    </div>
  );
}