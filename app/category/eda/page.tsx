"use client";

/**
 * category/eda/page.tsx
 * ---------------------------------------------------------------------------
 * A complete, self-contained learning page about Exploratory Data Analysis.
 *
 * ASSUMPTIONS ABOUT YOUR PROJECT (please check these):
 * 1. This is a Next.js App Router project (app/category/eda/page.tsx).
 * 2. Tailwind is configured with `darkMode: "class"` in tailwind.config.
 *    Your existing header's light/dark toggle should add/remove the
 *    `dark` class on <html> (this is exactly what next-themes does by
 *    default). Every "dark:" utility below will then respond to it
 *    automatically — this page does NOT render its own toggle.
 * 3. `lucide-react` is installed (`npm i lucide-react`). If you use a
 *    different icon set, swap the imports below.
 * 4. This page renders *below* your existing site header, so it starts
 *    straight into a hero section rather than duplicating nav/branding.
 * ---------------------------------------------------------------------------
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Space_Grotesk, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import {
  BarChart3,
  LineChart,
  PieChart,
  ScatterChart,
  TrendingUp,
  Search,
  Download,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  GitBranch,
  CheckCircle2,
  Sparkles,
  Rocket,
  Database,
  FileText,
  Code2,
  Table,
  Microscope,
  Target,
  Users,
  Building2,
  ShoppingCart,
  Stethoscope,
  Factory,
  Trophy,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Quote,
  Boxes,
  Flame,
  Network,
  Workflow,
  ListChecks,
  Compass,
  Gauge,
  Layers,
  ArrowRight,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  Fonts                                                                  */
/* ---------------------------------------------------------------------- */

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

/* ---------------------------------------------------------------------- */
/*  Content data                                                           */
/* ---------------------------------------------------------------------- */

const TOC = [
  { id: "what-is-eda", label: "What is EDA?", icon: Compass },
  { id: "why-eda", label: "Why EDA?", icon: Lightbulb },
  { id: "theory", label: "Theory & Foundations", icon: Microscope },
  { id: "types", label: "Types of EDA", icon: Boxes },
  { id: "roadmap", label: "EDA Roadmap", icon: Workflow },
  { id: "code", label: "Code Snippets", icon: Code2 },
  { id: "sketches", label: "Diagrams & Sketches", icon: ScatterChart },
  { id: "cheatsheet", label: "Cheat Sheet", icon: Table },
  { id: "use-cases", label: "Use Cases", icon: Target },
  { id: "features", label: "Features", icon: CheckCircle2 },
  { id: "future", label: "Future of EDA", icon: Rocket },
  { id: "blog", label: "The EDA Blog", icon: BookOpen },
  { id: "download", label: "Download Notes", icon: Download },
];

const PIPELINE = [
  { label: "Data Collection", icon: Database, note: "Gather raw data from files, APIs, databases" },
  { label: "Data Cleaning", icon: Layers, note: "Handle missing, duplicate, malformed records" },
  { label: "EDA", icon: Search, note: "Explore, visualize, question — you are here", highlight: true },
  { label: "Modeling", icon: Network, note: "Train statistical or ML models" },
  { label: "Evaluation", icon: Gauge, note: "Validate performance against goals" },
  { label: "Deployment", icon: Rocket, note: "Ship insights or models to production" },
];

const EDA_TYPES = [
  {
    title: "Univariate — Non-Graphical",
    desc:
      "Summarizing a single variable with numbers: mean, median, mode, variance, standard deviation, range, and the five-number summary.",
    icon: FileText,
  },
  {
    title: "Univariate — Graphical",
    desc:
      "Visualizing one variable at a time: histograms, box plots, density (KDE) plots, bar charts, stem-and-leaf plots.",
    icon: BarChart3,
  },
  {
    title: "Multivariate — Non-Graphical",
    desc:
      "Cross-tabulations, correlation and covariance matrices, grouped summary statistics (groupby/pivot tables).",
    icon: Table,
  },
  {
    title: "Multivariate — Graphical",
    desc:
      "Visualizing relationships between two or more variables: scatter plots, pair plots, heatmaps, violin plots, 3-D plots.",
    icon: ScatterChart,
  },
];

const ROADMAP = [
  {
    step: "01",
    title: "Understand the data",
    text: "Read the data dictionary, check shape, dtypes, and the first/last rows. Ask: what does each column represent?",
    code: "df.shape\ndf.dtypes\ndf.head()\ndf.tail()",
  },
  {
    step: "02",
    title: "Handle missing & duplicate values",
    text: "Quantify nulls, decide whether to impute, drop, or flag them. Remove exact duplicates.",
    code: "df.isnull().sum()\ndf.duplicated().sum()\ndf.drop_duplicates(inplace=True)",
  },
  {
    step: "03",
    title: "Univariate analysis",
    text: "Look at each variable alone. Check distribution shape, spread, and central tendency.",
    code: "df['age'].describe()\ndf['age'].hist(bins=30)",
  },
  {
    step: "04",
    title: "Bivariate & multivariate analysis",
    text: "Study relationships between variables — numeric-numeric, numeric-categorical, categorical-categorical.",
    code: "sns.scatterplot(x='income', y='spend', data=df)\ndf.groupby('segment')['spend'].mean()",
  },
  {
    step: "05",
    title: "Outlier & anomaly detection",
    text: "Flag values far from the bulk of the data using IQR or z-score, then decide to cap, remove, or investigate them.",
    code: "q1, q3 = df['x'].quantile([.25, .75])\niqr = q3 - q1\noutliers = df[(df['x']<q1-1.5*iqr)|(df['x']>q3+1.5*iqr)]",
  },
  {
    step: "06",
    title: "Correlation & feature relationships",
    text: "Measure linear and rank relationships between numeric features to spot redundancy or strong predictors.",
    code: "corr = df.corr(numeric_only=True)\nsns.heatmap(corr, annot=True, cmap='viridis')",
  },
  {
    step: "07",
    title: "Form hypotheses & document insights",
    text: "Write down what surprised you, what needs a statistical test, and what should feed into feature engineering.",
    code: "# insight: churn is 3x higher for month-to-month\n# contracts — worth testing formally (chi-square)",
  },
];

const CODE_SNIPPETS = [
  {
    title: "Load & inspect",
    lang: "python",
    code: `import pandas as pd

df = pd.read_csv("data.csv")

df.shape                 # (rows, cols)
df.info()                # dtypes + non-null counts
df.describe(include="all")  # summary stats
df.head()`,
  },
  {
    title: "Missing values",
    lang: "python",
    code: `# Count and visualize missingness
missing = df.isnull().sum().sort_values(ascending=False)
missing_pct = (missing / len(df) * 100).round(2)

import missingno as msno
msno.matrix(df)

# Simple imputation
df["age"] = df["age"].fillna(df["age"].median())
df["city"] = df["city"].fillna("Unknown")`,
  },
  {
    title: "Univariate — numeric",
    lang: "python",
    code: `import matplotlib.pyplot as plt
import seaborn as sns

fig, axes = plt.subplots(1, 2, figsize=(10, 4))
sns.histplot(df["price"], kde=True, ax=axes[0])
sns.boxplot(x=df["price"], ax=axes[1])
plt.tight_layout()
plt.show()`,
  },
  {
    title: "Univariate — categorical",
    lang: "python",
    code: `df["category"].value_counts()
df["category"].value_counts(normalize=True) * 100

sns.countplot(y="category", data=df,
              order=df["category"].value_counts().index)`,
  },
  {
    title: "Bivariate — numeric vs numeric",
    lang: "python",
    code: `sns.scatterplot(x="sqft", y="price", hue="city", data=df)
sns.regplot(x="sqft", y="price", data=df, scatter_kws={"alpha": 0.4})

df[["sqft", "price"]].corr()`,
  },
  {
    title: "Bivariate — numeric vs categorical",
    lang: "python",
    code: `sns.boxplot(x="category", y="price", data=df)
sns.violinplot(x="category", y="price", data=df)

df.groupby("category")["price"].agg(["mean", "median", "std"])`,
  },
  {
    title: "Multivariate",
    lang: "python",
    code: `sns.pairplot(df, hue="category", corner=True)

corr = df.corr(numeric_only=True)
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", center=0)`,
  },
  {
    title: "Outlier detection (IQR & z-score)",
    lang: "python",
    code: `# IQR method
q1, q3 = df["price"].quantile([0.25, 0.75])
iqr = q3 - q1
lower, upper = q1 - 1.5 * iqr, q3 + 1.5 * iqr
iqr_outliers = df[(df["price"] < lower) | (df["price"] > upper)]

# Z-score method
from scipy import stats
z = stats.zscore(df["price"])
z_outliers = df[abs(z) > 3]`,
  },
  {
    title: "Automated EDA (one line)",
    lang: "python",
    code: `# pip install ydata-profiling
from ydata_profiling import ProfileReport

profile = ProfileReport(df, title="EDA Report", explorative=True)
profile.to_file("eda_report.html")

# Alternative: pip install sweetviz
import sweetviz as sv
sv.analyze(df).show_html("sweetviz_report.html")`,
  },
];

const CHEATSHEET = [
  { fn: "df.shape", does: "Rows & columns count", lib: "pandas" },
  { fn: "df.info()", does: "Dtypes, non-null counts, memory", lib: "pandas" },
  { fn: "df.describe()", does: "Count, mean, std, min, quartiles, max", lib: "pandas" },
  { fn: "df.isnull().sum()", does: "Missing values per column", lib: "pandas" },
  { fn: "df.duplicated()", does: "Flags duplicate rows", lib: "pandas" },
  { fn: "df.corr()", does: "Pairwise correlation matrix", lib: "pandas" },
  { fn: "df.value_counts()", does: "Frequency of unique values", lib: "pandas" },
  { fn: "df.groupby()", does: "Aggregate by category", lib: "pandas" },
  { fn: "sns.histplot()", does: "Distribution of one numeric variable", lib: "seaborn" },
  { fn: "sns.boxplot()", does: "Spread, median, outliers", lib: "seaborn" },
  { fn: "sns.violinplot()", does: "Distribution shape + density by group", lib: "seaborn" },
  { fn: "sns.scatterplot()", does: "Relationship between 2 numeric vars", lib: "seaborn" },
  { fn: "sns.pairplot()", does: "All pairwise relationships at once", lib: "seaborn" },
  { fn: "sns.heatmap()", does: "Visualize a correlation matrix", lib: "seaborn" },
  { fn: "stats.zscore()", does: "Standardize values to detect outliers", lib: "scipy" },
  { fn: "np.percentile()", does: "Compute the Nth percentile", lib: "numpy" },
  { fn: "ProfileReport()", does: "Full automated EDA report", lib: "ydata-profiling" },
  { fn: "msno.matrix()", does: "Visualize missing-value pattern", lib: "missingno" },
];

const USE_CASES = [
  { icon: Building2, title: "Finance", text: "Spotting fraud patterns, understanding risk distributions, stress-testing portfolios before modeling." },
  { icon: Stethoscope, title: "Healthcare", text: "Studying patient vitals and outcomes, catching data-entry errors before they bias a clinical model." },
  { icon: ShoppingCart, title: "E-commerce", text: "Segmenting customers, understanding cart-abandonment patterns, sanity-checking A/B test data." },
  { icon: Factory, title: "Manufacturing", text: "Monitoring sensor readings for drift, finding the root cause of defect spikes on a line." },
  { icon: Trophy, title: "Sports Analytics", text: "Comparing player distributions, finding undervalued performance metrics before building models." },
  { icon: Users, title: "Marketing", text: "Understanding campaign response distributions and which channels actually correlate with conversions." },
];

const FEATURES = [
  "Visual-first — a picture reveals what a summary statistic can hide.",
  "Iterative — every plot raises a new question worth checking.",
  "Assumption-light — you let the data speak before you model it.",
  "Hypothesis-generating, not hypothesis-confirming.",
  "Outlier- and distribution-aware, not just mean/variance-aware.",
  "Tool-agnostic — the mindset matters more than the library.",
];

const FUTURE = [
  { icon: Sparkles, title: "AutoEDA tools", text: "ydata-profiling, Sweetviz, D-Tale and AutoViz generate a full report in one line — great for a first pass." },
  { icon: Network, title: "LLM-assisted exploration", text: "Natural-language queries over a dataframe (\"show me the distribution of churn by contract type\") are becoming standard in notebooks and spreadsheet copilots." },
  { icon: Gauge, title: "Real-time / streaming EDA", text: "Dashboards that profile data as it arrives, catching schema drift and anomalies before they hit a model." },
  { icon: Workflow, title: "No-code EDA platforms", text: "Drag-and-drop profiling for analysts who don't write code, lowering the barrier to a data-driven first look." },
];

/* ---------------------------------------------------------------------- */
/*  Small building blocks                                                  */
/* ---------------------------------------------------------------------- */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-600/20 bg-teal-600/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-700 dark:border-teal-400/25 dark:bg-teal-400/10 dark:text-teal-300"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </div>
  );
}

function Imp({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/[0.07] px-3 py-3 sm:gap-3 sm:px-4 dark:border-amber-400/25 dark:bg-amber-400/[0.08]">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="min-w-0 text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/90">
        <span className="font-semibold" style={{ fontFamily: "var(--font-mono)" }}>
          IMP —{" "}
        </span>
        {children}
      </p>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      className="overflow-x-auto rounded-xl border border-slate-900/10 bg-[#0B1120] p-3 text-[12px] leading-relaxed text-slate-100 sm:p-4 sm:text-[13px] dark:border-white/10"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <code>{code}</code>
    </pre>
  );
}

function Divider() {
  return (
    <div className="my-10 flex items-center gap-3 opacity-60 sm:my-16" aria-hidden="true">
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-600"
          style={{ opacity: 0.3 + 0.7 * Math.abs(Math.sin(i)) }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  SVG diagrams / sketches                                                */
/* ---------------------------------------------------------------------- */

function DistributionSketch({
  label,
  d,
}: {
  label: string;
  d: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-900/10 bg-white p-2.5 dark:border-white/10 dark:bg-white/[0.03] sm:gap-2 sm:p-4">
      <svg viewBox="0 0 140 90" className="h-16 w-full sm:h-20">
        <line x1="8" y1="78" x2="132" y2="78" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d={d} fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className="text-[11px] font-medium text-slate-600 sm:text-xs dark:text-slate-300" style={{ fontFamily: "var(--font-mono)" }}>
        {label}
      </span>
    </div>
  );
}

function BoxPlotAnatomy() {
  return (
    <svg viewBox="0 0 560 170" className="w-full text-slate-700 dark:text-slate-300">
      <line x1="40" y1="90" x2="520" y2="90" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      {/* whiskers */}
      <line x1="70" y1="90" x2="150" y2="90" stroke="#0D9488" strokeWidth="2" />
      <line x1="410" y1="90" x2="490" y2="90" stroke="#0D9488" strokeWidth="2" />
      <line x1="70" y1="70" x2="70" y2="110" stroke="#0D9488" strokeWidth="2" />
      <line x1="490" y1="70" x2="490" y2="110" stroke="#0D9488" strokeWidth="2" />
      {/* box */}
      <rect x="150" y="55" width="260" height="70" rx="4" fill="#0D948822" stroke="#0D9488" strokeWidth="2" />
      {/* median */}
      <line x1="280" y1="55" x2="280" y2="125" stroke="#F59E0B" strokeWidth="3" />
      {/* outliers */}
      <circle cx="45" cy="90" r="4" fill="#7C3AED" />
      <circle cx="520" cy="90" r="4" fill="#7C3AED" />
      {/* labels */}
      <text x="45" y="140" fontSize="11" textAnchor="middle" fill="currentColor">outlier</text>
      <text x="70" y="140" fontSize="11" textAnchor="middle" fill="currentColor">min</text>
      <text x="150" y="140" fontSize="11" textAnchor="middle" fill="currentColor">Q1</text>
      <text x="280" y="140" fontSize="11" textAnchor="middle" fill="currentColor">median</text>
      <text x="410" y="140" fontSize="11" textAnchor="middle" fill="currentColor">Q3</text>
      <text x="490" y="140" fontSize="11" textAnchor="middle" fill="currentColor">max</text>
      <text x="280" y="30" fontSize="12" textAnchor="middle" fill="currentColor" fontWeight={600}>
        IQR = Q3 − Q1
      </text>
      <line x1="150" y1="40" x2="410" y2="40" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
    </svg>
  );
}

function HeatmapSketch() {
  const size = 5;
  const cell = 34;
  return (
    <svg viewBox={`0 0 ${size * cell} ${size * cell}`} className="w-full max-w-[220px]">
      {Array.from({ length: size }).map((_, r) =>
        Array.from({ length: size }).map((_, c) => {
          const v = r === c ? 1 : Math.abs(Math.sin(r * 1.3 + c * 0.7));
          return (
            <rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell}
              width={cell - 2}
              height={cell - 2}
              rx="3"
              fill="#0D9488"
              opacity={0.15 + v * 0.75}
            />
          );
        })
      )}
    </svg>
  );
}

function HeroScatter() {
  // A small "scatter settles into a trend line" animation — the signature motif.
  const dots = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => {
        const x = 10 + (i / 25) * 380;
        const trendY = 170 - x * 0.32;
        const scatterY = trendY + (Math.sin(i * 12.9) * 55);
        return { id: i, x, trendY, scatterY, delay: (i % 13) * 0.05 };
      }),
    []
  );
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full">
      <line x1="10" y1="15" x2="10" y2="185" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <line x1="10" y1="185" x2="395" y2="185" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <line
        x1="10"
        y1="166.8"
        x2="390"
        y2="45.2"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeDasharray="4 5"
        opacity="0.9"
        className="eda-trend"
      />
      {dots.map((d) => (
        <circle key={d.id} r="4.5" fill="#0D9488" className="eda-dot">
          <animate
            attributeName="cy"
            values={`${d.scatterY};${d.trendY}`}
            keyTimes="0;1"
            dur="1.4s"
            begin={`${0.3 + d.delay}s`}
            fill="freeze"
            calcMode="spline"
            keySplines="0.16 1 0.3 1"
          />
          <animate attributeName="cx" values={`${d.x};${d.x}`} dur="1s" begin="0s" fill="freeze" />
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.4s"
            begin={`${0.1 + d.delay}s`}
            fill="freeze"
          />
        </circle>
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/*  Main page                                                              */
/* ---------------------------------------------------------------------- */

const EDA_NOTES_MD = `# Exploratory Data Analysis — Complete Notes

## 1. What is EDA?
Exploratory Data Analysis (EDA) is the practice of investigating a dataset —
using summary statistics and visualizations — to understand its structure,
spot patterns, detect anomalies, test assumptions, and generate hypotheses
BEFORE formal modeling or statistical testing begins. The term was coined by
statistician John Tukey, who separated "exploratory" data analysis (looking
for what the data might be telling you) from "confirmatory" data analysis
(testing a specific hypothesis you already had).

## 2. Why EDA?
- Catches data-quality problems (missing values, duplicates, wrong types,
  impossible values) before they corrupt a model.
- Reveals the true shape of your data (skew, multimodality) so you choose
  the right statistical tools.
- Surfaces relationships and outliers that summary statistics alone hide —
  see "Anscombe's Quartet" below.
- Builds intuition so later modeling choices are informed, not guessed.
- Prevents "garbage in, garbage out": most real-world model failures trace
  back to something EDA would have caught.

## 3. Theory & Statistical Foundations
- **Central tendency**: mean, median, mode.
- **Spread**: range, variance, standard deviation, IQR.
- **Shape**: skewness (asymmetry) and kurtosis (tail weight).
- **Five-number summary**: min, Q1, median, Q3, max — the basis of a box plot.
- **Anscombe's Quartet**: four datasets with nearly identical mean, variance,
  correlation, and regression line, yet wildly different shapes when
  plotted. It is the classic proof that summary statistics can lie and
  visualization is not optional.
- **Simpson's Paradox**: a trend that appears in several groups of data can
  reverse when the groups are combined — a reminder to check subgroups
  before trusting an aggregate.
- **Correlation ≠ Causation**: EDA finds relationships, not causes.

## 4. Types of EDA
| | Non-Graphical | Graphical |
|---|---|---|
| **Univariate** | mean, median, std, five-number summary | histogram, box plot, KDE, bar chart |
| **Multivariate** | correlation matrix, cross-tabs, groupby | scatter plot, pair plot, heatmap, violin plot |

## 5. EDA Roadmap
1. Understand the data (shape, dtypes, head/tail).
2. Handle missing & duplicate values.
3. Univariate analysis (each variable alone).
4. Bivariate & multivariate analysis (relationships).
5. Outlier / anomaly detection (IQR or z-score).
6. Correlation & feature relationships.
7. Document hypotheses and insights for modeling.

## 6. Key Python Snippets
\`\`\`python
import pandas as pd, numpy as np, seaborn as sns, matplotlib.pyplot as plt
from scipy import stats

df = pd.read_csv("data.csv")
df.info(); df.describe(); df.isnull().sum()

sns.histplot(df["x"], kde=True)
sns.boxplot(x=df["x"])
sns.scatterplot(x="a", y="b", data=df)
sns.heatmap(df.corr(numeric_only=True), annot=True)

q1, q3 = df["x"].quantile([.25, .75]); iqr = q3 - q1
outliers = df[(df["x"] < q1 - 1.5*iqr) | (df["x"] > q3 + 1.5*iqr)]

z = stats.zscore(df["x"]); z_outliers = df[abs(z) > 3]
\`\`\`

Automated first pass:
\`\`\`python
from ydata_profiling import ProfileReport
ProfileReport(df, explorative=True).to_file("eda_report.html")
\`\`\`

## 7. Cheat Sheet
- df.shape / df.info() / df.describe() — structure & summary
- df.isnull().sum() / df.duplicated() — data quality
- df.corr() / df.groupby() — relationships
- sns.histplot / boxplot / violinplot / scatterplot / pairplot / heatmap — visuals
- stats.zscore() / np.percentile() — outlier tools

## 8. Use Cases
Finance (fraud & risk), Healthcare (patient trends & data errors),
E-commerce (segmentation, A/B sanity checks), Manufacturing (sensor drift),
Sports analytics (player metrics), Marketing (campaign response patterns).

## 9. Features of Good EDA
Visual-first, iterative, assumption-light, hypothesis-generating,
outlier-aware, tool-agnostic.

## 10. Future of EDA
AutoEDA tools (ydata-profiling, Sweetviz, D-Tale, AutoViz), LLM-assisted
natural-language exploration, real-time/streaming profiling, no-code
EDA platforms.

## 11. Important Reminders
- EDA is about discovering hypotheses, not proving them.
- Always visualize before you model.
- Correlation is not causation.
- A single summary statistic can hide the true shape of your data.

---
Thanks for downloading — happy exploring! 📊
`;

export default function EDAPage() {
  const [active, setActive] = useState<string>(TOC[0].id);
  const [tocOpen, setTocOpen] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const thanksTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0.1 }
    );
    TOC.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleDownload = () => {
    try {
      const blob = new Blob([EDA_NOTES_MD], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "EDA-Complete-Notes.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setShowThanks(true);
      if (thanksTimer.current) clearTimeout(thanksTimer.current);
      thanksTimer.current = setTimeout(() => setShowThanks(false), 4800);
    }
  };

  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen overflow-x-hidden bg-[#F5F7FA] text-[#0F172A] transition-colors duration-300 dark:bg-[#0B1120] dark:text-[#E2E8F0]`}
      style={{
        fontFamily: "var(--font-body)",
        backgroundImage:
          "radial-gradient(circle, currentColor 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        backgroundPosition: "-4px -4px",
        backgroundAttachment: "local",
      }}
    >
      <div className="min-h-screen overflow-x-hidden bg-[#F5F7FA]/[0.97] dark:bg-[#0B1120]/[0.96]">
        {/* ---------------------------------------------------------- */}
        {/* Thank-you toast on download                                 */}
        {/* ---------------------------------------------------------- */}
        {showThanks && (
          <div className="fixed bottom-20 left-3 right-3 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-teal-600/20 bg-white px-4 py-3 shadow-2xl shadow-slate-900/10 dark:border-teal-400/20 dark:bg-[#131B2E] dark:shadow-black/40 sm:bottom-5 sm:left-auto sm:right-5">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Thanks for downloading! 🎉</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                EDA-Complete-Notes.md is on its way to your downloads folder. Happy exploring!
              </p>
            </div>
            <button
              onClick={() => setShowThanks(false)}
              aria-label="Dismiss"
              className="ml-1 shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* ---------------------------------------------------------- */}
        {/* Mobile TOC toggle                                           */}
        {/* ---------------------------------------------------------- */}
        <button
          onClick={() => setTocOpen((v) => !v)}
          className="fixed bottom-5 left-5 z-40 flex min-h-[44px] items-center gap-2 rounded-full border border-slate-900/10 bg-white px-4 py-2.5 text-xs font-semibold shadow-lg dark:border-white/10 dark:bg-[#131B2E] lg:hidden"
        >
          {tocOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
          Contents
        </button>
        {tocOpen && (
          <div className="fixed inset-x-3 bottom-20 z-40 max-h-[55vh] overflow-y-auto overscroll-contain rounded-2xl border border-slate-900/10 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-[#131B2E] sm:inset-x-4 sm:p-3 lg:hidden">
            {TOC.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setTocOpen(false)}
                className={`flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${
                  active === s.id ? "bg-teal-600/10 text-teal-700 dark:text-teal-300" : ""
                }`}
              >
                <s.icon className="h-3.5 w-3.5 shrink-0" /> {s.label}
              </a>
            ))}
          </div>
        )}

        <div className="mx-auto flex max-w-[1400px] gap-6 px-4 sm:gap-10 sm:px-8 lg:px-10">
          {/* -------------------------------------------------------- */}
          {/* Sticky desktop TOC rail                                   */}
          {/* -------------------------------------------------------- */}
          <aside className="sticky top-8 hidden h-fit w-56 shrink-0 py-16 lg:block">
            <p
              className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              On this page
            </p>
            <nav className="space-y-0.5 border-l border-slate-900/10 dark:border-white/10">
              {TOC.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`-ml-px flex items-center gap-2 border-l-2 px-3 py-1.5 text-[13px] transition-colors ${
                    active === s.id
                      ? "border-teal-600 font-semibold text-teal-700 dark:border-teal-400 dark:text-teal-300"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <s.icon className="h-3.5 w-3.5 shrink-0" />
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* -------------------------------------------------------- */}
          {/* Main content                                               */}
          {/* -------------------------------------------------------- */}
          <main className="min-w-0 flex-1 overflow-x-hidden py-10 sm:py-16">
            {/* ============ HERO ============ */}
            <section className="grid gap-6 pb-4 sm:gap-10 sm:pb-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <SectionEyebrow> Data Science / EDA</SectionEyebrow>
                <h1
                  className="text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Exploratory
                  <br />
                  Data Analysis
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:mt-5 sm:text-lg dark:text-slate-300">
                  The scattered points always know something before the model does.
                  EDA is the discipline of looking - carefully, visually,
                  skeptically - until the data tells you what it actually is.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">
                  <a
                    href="#roadmap"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300 sm:w-auto sm:px-7 sm:py-3.5 sm:text-base"
                  >
                    Walk the roadmap <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#download"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300 sm:w-auto sm:px-7 sm:py-3.5 sm:text-base"
                  >
                    <Download className="h-4 w-4" /> Get the notes
                  </a>
                </div>
              </div>

              <div className="relative h-52 overflow-hidden rounded-2xl border border-slate-900/10 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03] sm:h-64 sm:p-4 md:h-72">
                <span
                  className="absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:left-4 sm:top-4 sm:text-[11px] dark:text-slate-500"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  scatter → signal
                </span>
                <div className="flex h-full items-center justify-center pt-4 text-slate-400">
                  <HeroScatter />
                </div>
              </div>
            </section>

            <Divider />

            {/* ============ WHAT IS EDA ============ */}
            <section id="what-is-eda" className="scroll-mt-24">
              <SectionEyebrow>01 · Definition</SectionEyebrow>
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                What is EDA?
              </h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-300">
                <strong>Exploratory Data Analysis (EDA)</strong> is the process of
                investigating a dataset with summary statistics and visualizations to
                understand its structure, quality, and relationships — before you fit
                a model or run a formal statistical test. The term comes from
                statistician <strong>John Tukey</strong>, who drew a line between{" "}
                <em>exploratory</em> analysis (letting data suggest hypotheses) and{" "}
                <em>confirmatory</em> analysis (testing a hypothesis you already had).
              </p>

              <Imp>
                EDA is not a step you skip to save time — it is where most real
                modeling mistakes are prevented, cheaply, before they become expensive.
              </Imp>

              <h3 className="mt-8 text-lg font-semibold">Where EDA sits in the data science pipeline</h3>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2 sm:overflow-x-auto sm:pb-1">
                {PIPELINE.map((p, i) => (
                  <div key={p.label} className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`flex w-full flex-col gap-1.5 rounded-xl border p-3.5 sm:w-40 sm:shrink-0 sm:p-3 ${
                        p.highlight
                          ? "border-teal-600 bg-teal-600/10 dark:border-teal-400 dark:bg-teal-400/10"
                          : "border-slate-900/10 bg-white dark:border-white/10 dark:bg-white/[0.03]"
                      }`}
                    >
                      <p.icon
                        className={`h-4 w-4 ${
                          p.highlight ? "text-teal-700 dark:text-teal-300" : "text-slate-500 dark:text-slate-400"
                        }`}
                      />
                      <span className="text-[13px] font-semibold">{p.label}</span>
                      <span className="text-[11px] leading-snug text-slate-500 dark:text-slate-400">{p.note}</span>
                    </div>
                    {i < PIPELINE.length - 1 && (
                      <ChevronRight className="hidden h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600 sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ============ WHY EDA ============ */}
            <section id="why-eda" className="scroll-mt-24">
              <SectionEyebrow>02 · Motivation</SectionEyebrow>
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Why use EDA, and why does it matter?
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { t: "Catches data-quality issues early", d: "Missing values, duplicates, wrong types, impossible values — cheaper to fix now than after a model is trained on them." },
                  { t: "Reveals the true shape of the data", d: "Skew, multimodality, and outliers change which statistics and models are even valid to use." },
                  { t: "Prevents misleading summaries", d: "A mean and a correlation can look identical across very different datasets — only a plot exposes the difference." },
                  { t: "Builds intuition before you model", d: "You choose better features, better models, and better evaluation metrics when you've actually looked at the data." },
                ].map((x) => (
                  <div key={x.t} className="rounded-xl border border-slate-900/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="font-semibold">{x.t}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{x.d}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                In short: without EDA, "garbage in" quietly becomes "garbage out" — and
                you find out only after weeks of modeling work.
              </p>
            </section>

            <Divider />

            {/* ============ THEORY ============ */}
            <section id="theory" className="scroll-mt-24">
              <SectionEyebrow>03 · Foundations</SectionEyebrow>
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Theory & statistical foundations
              </h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-base font-semibold">The five-number summary</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Minimum, first quartile (Q1), median, third quartile (Q3), and
                    maximum. It's the numeric backbone of a box plot and the fastest
                    way to describe a distribution's center and spread without
                    assuming it's symmetric.
                  </p>
                  <h3 className="mt-5 text-base font-semibold">Shape: skewness & kurtosis</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Skewness measures asymmetry (a long right tail = positive skew).
                    Kurtosis measures tail weight — how likely extreme values are
                    compared to a normal distribution.
                  </p>
                  <h3 className="mt-5 text-base font-semibold">Simpson's Paradox</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    A trend present in several groups can reverse when those groups
                    are combined. Always check whether an aggregate pattern survives
                    a group-by-group look.
                  </p>
                </div>
                <div className="rounded-xl border border-violet-600/20 bg-violet-600/[0.05] p-4 dark:border-violet-400/20 dark:bg-violet-400/[0.06] sm:p-5">
                  <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                    <Quote className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-semibold">Anscombe&apos;s Quartet</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Four datasets, each with nearly identical mean, variance,
                    correlation, and regression line — yet each looks completely
                    different when plotted: one is linear, one is curved, one has a
                    single outlier driving the whole trend, and one is a vertical
                    line with an outlier. It is the single most-cited proof that
                    <em> summary statistics can lie, and plots don&apos;t.</em>
                  </p>
                  <div className="mt-4 grid grid-cols-4 gap-1.5 sm:gap-2">
                    {[
                      "M2 -6 20 -30 40 -50",
                      "M2 -50 Q 20 5 40 -6",
                      "M2 -50 L 30 -20 L 32 -20 L 40 -50",
                      "M2 -20 L 2 -20 L 2 -20 L 40 -55",
                    ].map((d, i) => (
                      <svg key={i} viewBox="-4 -60 48 65" className="h-12 w-full rounded-md bg-white/60 sm:h-14 dark:bg-white/5">
                        <path d={d} fill="none" stroke="#7C3AED" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <Imp>Correlation is not causation — EDA finds relationships, never proves what causes what.</Imp>
            </section>

            <Divider />

            {/* ============ TYPES ============ */}
            <section id="types" className="scroll-mt-24">
              <SectionEyebrow>04 · Classification</SectionEyebrow>
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Types of EDA
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                EDA splits along two independent axes: how many variables you look
                at together, and whether you use numbers or pictures.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {EDA_TYPES.map((t) => (
                  <div key={t.title} className="rounded-xl border border-slate-900/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                    <t.icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    <p className="mt-3 font-semibold">{t.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ============ ROADMAP ============ */}
            <section id="roadmap" className="scroll-mt-24">
              <SectionEyebrow>05 · Process</SectionEyebrow>
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                The EDA roadmap
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                A practical, repeatable order of operations for exploring any new
                dataset, from first glance to documented insight.
              </p>
              <div className="relative mt-8 space-y-6 border-l border-slate-900/10 pl-6 sm:pl-8 dark:border-white/10">
                {ROADMAP.map((r) => (
                  <div key={r.step} className="relative">
                    <span
                      className="absolute -left-[30px] flex h-6 w-6 items-center justify-center rounded-full border border-teal-600/30 bg-teal-600/10 text-[10px] font-bold text-teal-700 sm:-left-[41px] sm:h-7 sm:w-7 sm:text-[11px] dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-300"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {r.step}
                    </span>
                    <h3 className="font-semibold">{r.title}</h3>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{r.text}</p>
                    <div className="mt-2 max-w-2xl min-w-0">
                      <CodeBlock code={r.code} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ============ CODE SNIPPETS ============ */}
            <section id="code" className="scroll-mt-24">
              <SectionEyebrow>06 · Practice</SectionEyebrow>
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Code snippets
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Copy-ready Python for every stage of EDA — pandas, seaborn, matplotlib, and scipy.
              </p>
              <div className="mt-6 grid gap-4 sm:gap-5 lg:grid-cols-2">
                {CODE_SNIPPETS.map((s) => (
                  <div key={s.title} className="min-w-0 rounded-xl border border-slate-900/10 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03] sm:p-4">
                    <div className="mb-2.5 flex items-center gap-2">
                      <Code2 className="h-3.5 w-3.5 shrink-0 text-teal-600 dark:text-teal-400" />
                      <span className="text-sm font-semibold">{s.title}</span>
                    </div>
                    <CodeBlock code={s.code} />
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ============ SKETCHES / DIAGRAMS ============ */}
            <section id="sketches" className="scroll-mt-24">
              <SectionEyebrow>07 · Visual reference</SectionEyebrow>
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Diagrams & sketches
              </h2>

              <h3 className="mt-8 text-base font-semibold">Distribution shapes</h3>
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                <DistributionSketch label="Normal" d="M4 78 C 30 78, 45 8, 70 8 C 95 8, 110 78, 136 78" />
                <DistributionSketch label="Right-skew" d="M4 78 C 20 78, 30 15, 45 12 C 70 8, 110 60, 136 74" />
                <DistributionSketch label="Left-skew" d="M4 74 C 30 60, 70 8, 95 12 C 110 15, 120 78, 136 78" />
                <DistributionSketch label="Bimodal" d="M4 78 C 18 30, 34 30, 45 70 C 55 78, 65 78, 75 60 C 90 25, 105 20, 120 55 C 128 70, 132 78, 136 78" />
                <DistributionSketch label="Uniform" d="M4 20 L 30 20 L 30 78 M 30 20 L 110 20 L 110 78 M 110 20 L 136 20" />
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold">Box plot anatomy</h3>
                  <div className="mt-4 overflow-x-auto rounded-xl border border-slate-900/10 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03] sm:p-5">
                    <BoxPlotAnatomy />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold">Correlation heatmap, sketched</h3>
                  <div className="mt-4 flex items-center justify-center rounded-xl border border-slate-900/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5">
                    <HeatmapSketch />
                  </div>
                </div>
              </div>
            </section>

            <Divider />

            {/* ============ CHEAT SHEET ============ */}
            <section id="cheatsheet" className="scroll-mt-24">
              <SectionEyebrow>08 · Quick reference</SectionEyebrow>
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Cheat sheet
              </h2>
              <div className="-mx-1 mt-6 overflow-x-auto overscroll-x-contain rounded-xl border border-slate-900/10 dark:border-white/10 sm:mx-0">
                <table className="w-full min-w-[480px] border-collapse text-xs sm:min-w-[520px] sm:text-sm">
                  <thead>
                    <tr className="bg-slate-900/[0.03] text-left dark:bg-white/[0.04]">
                      <th className="whitespace-nowrap px-3 py-2.5 font-semibold sm:px-4 sm:py-3">Function</th>
                      <th className="px-3 py-2.5 font-semibold sm:px-4 sm:py-3">What it does</th>
                      <th className="whitespace-nowrap px-3 py-2.5 font-semibold sm:px-4 sm:py-3">Library</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHEATSHEET.map((row, i) => (
                      <tr key={row.fn} className={i % 2 ? "bg-slate-900/[0.015] dark:bg-white/[0.015]" : ""}>
                        <td className="whitespace-nowrap px-3 py-2 sm:px-4 sm:py-2.5" style={{ fontFamily: "var(--font-mono)" }}>
                          {row.fn}
                        </td>
                        <td className="px-3 py-2 text-slate-600 sm:px-4 sm:py-2.5 dark:text-slate-300">{row.does}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-slate-500 sm:px-4 sm:py-2.5 dark:text-slate-400">{row.lib}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <Divider />

            {/* ============ USE CASES ============ */}
            <section id="use-cases" className="scroll-mt-24">
              <SectionEyebrow>09 · In practice</SectionEyebrow>
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Use cases
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {USE_CASES.map((u) => (
                  <div key={u.title} className="rounded-xl border border-slate-900/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                    <u.icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    <p className="mt-3 font-semibold">{u.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{u.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ============ FEATURES ============ */}
            <section id="features" className="scroll-mt-24">
              <SectionEyebrow>10 · Characteristics</SectionEyebrow>
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Features of good EDA
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 rounded-xl border border-slate-900/10 bg-white p-4 text-sm dark:border-white/10 dark:bg-white/[0.03]">
                    <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                    <span className="text-slate-600 dark:text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Divider />

            {/* ============ FUTURE ============ */}
            <section id="future" className="scroll-mt-24">
              <SectionEyebrow>11 · What's next</SectionEyebrow>
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                The future of EDA
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {FUTURE.map((f) => (
                  <div key={f.title} className="rounded-xl border border-slate-900/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                    <f.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <p className="mt-3 font-semibold">{f.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{f.text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Tools will keep automating the mechanics of EDA — but the underlying
                skill, asking good questions of a dataset, stays a human one.
              </p>
            </section>

            <Divider />

            {/* ============ BLOG ============ */}
            <section id="blog" className="scroll-mt-24">
              <SectionEyebrow>12 · Essay</SectionEyebrow>
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Why every data scientist starts here
              </h2>
              <div className="prose prose-slate mt-6 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-[15px] dark:prose-invert dark:text-slate-300">
                <p>
                  Every dataset arrives with a story it hasn't told you yet. A column
                  named "income" might be capped at a survey limit. A "date" field
                  might silently mix two formats. A "churned" flag might be defined
                  differently in two systems that were merged last quarter. None of
                  this shows up in a model's loss curve until it's too late — it shows
                  up in a histogram, a scatter plot, a value_counts() call, minutes
                  into looking.
                </p>
                <p>
                  That is the quiet argument for EDA: it is cheap insurance against
                  expensive mistakes. Tukey's insight was that data analysis has two
                  very different moods. In the confirmatory mood, you already have a
                  hypothesis and you're testing it rigorously. In the exploratory
                  mood, you don't yet know what you're looking for — you're reading
                  the data the way a detective reads a room, open to being surprised.
                  Most real projects need both, in that order.
                </p>
                <p>
                  Anscombe's Quartet is the sharpest illustration of why the
                  exploratory mood can't be skipped: four datasets that are
                  numerically indistinguishable — same mean, same variance, same
                  correlation, same regression line — turn out to be a straight line,
                  a curve, a line with one wild outlier, and a vertical stack of
                  points with a single stray value, respectively. If you had only
                  read the statistics table, you would have believed they were the
                  same dataset. Only the plot tells the truth.
                </p>
                <p>
                  In practice, good EDA is less about any one chart and more about a
                  posture: assume nothing, check everything, and let a plot answer a
                  question before you write a line of modeling code. It's the
                  difference between a model that's technically correct on your
                  validation set and one that actually understands the world it was
                  trained on.
                </p>
              </div>
            </section>

            <Divider />

            {/* ============ DOWNLOAD ============ */}
            <section id="download" className="scroll-mt-24 pb-28 sm:pb-24">
              <SectionEyebrow>13 · Take it with you</SectionEyebrow>
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Download the complete EDA notes
              </h2>
              <div className="mt-6 flex flex-col items-stretch gap-4 rounded-2xl border border-teal-600/25 bg-teal-600/[0.06] p-4 dark:border-teal-400/25 dark:bg-teal-400/[0.07] sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-6">
                <div className="min-w-0">
                  <p className="font-semibold">EDA-Complete-Notes.md</p>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Definition, theory, roadmap, code snippets, cheat sheet, use
                    cases, and the future of EDA — all in one markdown file you can
                    keep, print, or drop into your own notes.
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#0F172A] px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-teal-500 dark:text-[#0B1120] sm:w-auto sm:py-3"
                >
                  <Download className="h-4 w-4" />
                  Download notes
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}