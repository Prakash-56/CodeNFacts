"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Sparkles,
  Terminal,
  Hash,
  ArrowRight,
  ArrowUpRight,
  ListTree,
  Check,
  Copy,
  Download,
  PartyPopper,
  ChevronDown,
  Database,
} from "lucide-react";

/**
 * app/category/data-science/page.tsx
 * ----------------------------------
 * Rebuilt as a full explainer hub (matching the structure used for the
 * Java / Python category pages) instead of a filterable card grid:
 *   - Hero: what data science is and why it matters
 *   - Sticky scroll-spy table of contents
 *   - One section per topic: summary, key points, and — where it helps —
 *     a runnable Python or SQL snippet with its output
 *   - A "Frequently asked questions" section
 *   - A "Download Data Science Notes" button that generates a plain-text
 *     study guide from every section and downloads it, showing a
 *     "Downloading…" toast followed by a thank-you message
 *
 * Theming: every surface uses Tailwind's `dark:` variant instead of fixed
 * hex colors, so the page automatically follows whatever light/dark mode
 * toggle already lives in the site header (a `dark` class on <html>).
 * The one deliberate exception is the code block, which is a fixed
 * "terminal" surface in both modes — its colors are inline styles so
 * syntax-highlighting contrast never washes out.
 *
 * Note on metadata: this file uses client-side state (scroll-spy, the
 * download toast, the FAQ accordion), so it can't also export Next's
 * `metadata` object — that only works from a Server Component. If SEO
 * metadata for this route is needed, add it to `app/category/data-science/
 * layout.tsx` (or a sibling server component) instead.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SnippetLanguage = "python" | "sql";

interface DSTopic {
  id: string;
  number: string;
  title: string;
  summary: string;
  points: string[];
  code?: string;
  output?: string;
  language?: SnippetLanguage;
  filename?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// ---------------------------------------------------------------------------
// Topic content
// ---------------------------------------------------------------------------

const topics: DSTopic[] = [
  {
    id: "what-is-data-science",
    number: "01",
    title: "What Is Data Science, and Why Does It Matter?",
    summary:
      "Data science is the discipline of turning raw, messy data into decisions someone can actually act on. It blends statistics (to reason correctly under uncertainty), programming (to handle data at scale), and domain expertise (to know which question is worth asking in the first place).",
    points: [
      "The end product isn't a model or a number — it's a decision, a prediction, or a dashboard someone uses.",
      "Companies use it for things like fraud detection, demand forecasting, medical diagnosis support, and personalized recommendations.",
      "Knowing which question to ask of the data usually matters more than knowing every algorithm that exists.",
    ],
  },
  {
    id: "workflow",
    number: "02",
    title: "The Data Science Workflow",
    summary:
      "Almost every data science project moves through the same five stages, even if it loops back on itself constantly in practice. Skipping straight to 'build a model' without the earlier steps is the most common way projects go wrong.",
    points: [
      "Collect — pull data from databases, APIs, logs, spreadsheets, or sensors.",
      "Clean — handle missing values, duplicates, and inconsistent formats before trusting anything.",
      "Explore — look at distributions, outliers, and relationships (EDA) before modeling.",
      "Model — fit a statistical or machine learning model to answer the question.",
      "Communicate — turn the result into something a non-technical stakeholder can use.",
    ],
    code: `# A typical project skeleton
raw_data = collect_from_source()
clean_data = handle_missing_and_duplicates(raw_data)
explore(clean_data)              # histograms, summary stats, correlations
model = fit_model(clean_data)
report = summarize_for_stakeholders(model)`,
    language: "python",
    filename: "workflow.py",
  },
  {
    id: "types-of-data",
    number: "03",
    title: "Types of Data",
    summary:
      "Before you can analyze data correctly, you need to know what kind of data you're holding — the type determines which statistics and charts are even valid to use.",
    points: [
      "Quantitative (numerical): measurable amounts, like age or revenue — further split into discrete (counts) and continuous (measurements).",
      "Qualitative (categorical): labels or categories, like country or product type — further split into nominal (no order) and ordinal (has order, like 'low/medium/high').",
      "Structured data fits neatly into rows and columns (a spreadsheet, a SQL table); unstructured data doesn't (raw text, images, audio).",
    ],
  },
  {
    id: "data-cleaning",
    number: "04",
    title: "Data Cleaning & Missing Values",
    summary:
      "Real-world data is never clean — sensors fail, forms get skipped, formats drift over time. Deciding how to handle missing or malformed values is one of the highest-leverage steps in the entire workflow, because every downstream number inherits that decision.",
    points: [
      "Dropping rows with missing data is simple but can bias your dataset if the missingness isn't random.",
      "Filling in missing values (imputation) with the mean, median, or a model's prediction is often safer for small amounts of missing data.",
      "Always check *why* data is missing before choosing a strategy — 'missing' can itself be meaningful information.",
    ],
    code: `import pandas as pd

df = pd.read_csv("sales.csv")

print(df.isna().sum())              # how much is missing, per column

df_dropped = df.dropna()             # simplest option
df_filled = df.fillna(df.mean(numeric_only=True))  # median/mean imputation`,
    language: "python",
    filename: "clean_data.py",
  },
  {
    id: "eda",
    number: "05",
    title: "Exploratory Data Analysis (EDA)",
    summary:
      "EDA is the step where you actually look at your data before doing anything clever with it — summary statistics, distributions, and simple charts catch problems that would otherwise sink a model weeks later.",
    points: [
      ".describe() gives a fast first read on every numeric column: mean, spread, min/max.",
      ".value_counts() is the categorical equivalent — it shows you class imbalance immediately.",
      "A histogram or boxplot will show outliers and skew far faster than staring at raw numbers.",
    ],
    code: `import pandas as pd

df = pd.read_csv("customers.csv")

print(df.describe())                 # count, mean, std, min, quartiles, max
print(df["segment"].value_counts())  # how many rows per category`,
    output: `       age       spend
count  500.0     500.0
mean    34.2      82.1
std      9.8      41.7
min     18.0       0.0
max     71.0     398.0

segment
consumer      312
corporate     140
home-office    48
Name: count, dtype: int64`,
    language: "python",
    filename: "eda.py",
  },
  {
    id: "float-precision",
    number: "06",
    title: "0.1 + 0.2 Is Not 0.3",
    summary:
      "Floating point numbers are stored in binary, so decimals like 0.1 can't be represented exactly. This bites people doing financial or scientific calculations who assume decimal arithmetic is exact.",
    points: [
      "The error is tiny, but it compounds across large datasets or many operations.",
      "Never compare floats with == directly — round first, or compare against a small tolerance.",
      "This isn't a Python bug specifically; it's how IEEE 754 floating point works in almost every language.",
    ],
    code: `>>> 0.1 + 0.2
0.30000000000000004
>>> round(0.1 + 0.2, 2) == 0.3
True`,
    language: "python",
    filename: "float_precision.py",
  },
  {
    id: "vectorization",
    number: "07",
    title: "Loops Are the Enemy of NumPy",
    summary:
      "Swapping a Python for-loop for a vectorized NumPy operation can be 50-100x faster, because the vectorized version runs in compiled C instead of the slow Python interpreter, one element at a time.",
    points: [
      "Vectorized operations apply to an entire array at once — no explicit loop needed.",
      "This matters more as datasets grow; a loop that's 'fine' at 1,000 rows can crawl at 10 million.",
      "Most of pandas is built on NumPy, so this habit pays off there too.",
    ],
    code: `import numpy as np
a = np.arange(1_000_000)

# slow: python-level loop
total = 0
for x in a:
    total += x * x

# fast: vectorized
total = np.sum(a ** 2)`,
    language: "python",
    filename: "vectorization.py",
  },
  {
    id: "central-limit-theorem",
    number: "08",
    title: "The Central Limit Theorem Doesn't Care About Your Data",
    summary:
      "Sample means from almost any distribution start looking normal as sample size grows — which is why so many statistical tests assume normality even when the underlying data clearly isn't normal.",
    points: [
      "This holds even if the original population is uniform, skewed, or bimodal.",
      "It's the theoretical foundation behind confidence intervals and t-tests.",
      "Larger sample sizes make the approximation to a normal distribution tighter.",
    ],
    code: `import numpy as np

# uniform, NOT normal, population
population = np.random.uniform(0, 1, 100_000)

means = [np.mean(np.random.choice(population, 30))
         for _ in range(1000)]
# 'means' is approximately normal even though 'population' isn't`,
    language: "python",
    filename: "central_limit_theorem.py",
  },
  {
    id: "correlation-causation",
    number: "09",
    title: "Correlation Can Hide in Plain Sight — or Vanish Under One Point",
    summary:
      "A single outlier can create or destroy a correlation, and a strong correlation coefficient can still describe wildly different-looking relationships. Anscombe's quartet is the classic demonstration: four datasets, nearly identical statistics, completely different shapes when plotted.",
    points: [
      "Correlation measures a linear relationship's strength — it says nothing about the shape of that relationship.",
      "Always plot the data; a summary statistic alone can be dangerously misleading.",
      "Correlation never implies causation on its own — a third, unmeasured variable can drive both.",
    ],
    code: `import numpy as np

x = np.array([10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5])
y = np.array([8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68])

print(np.corrcoef(x, y)[0, 1])  # ~0.82
# plot it - the relationship looks nothing like a clean line`,
    language: "python",
    filename: "correlation.py",
  },
  {
    id: "sql-group-by-null",
    number: "10",
    title: "SQL's GROUP BY Quietly Gives NULL Its Own Bucket",
    summary:
      "NULL is never equal to NULL in SQL logic, but GROUP BY still groups every NULL row together into one bucket. Know this before you trust a 'missing category' count in a report.",
    points: [
      "This is a common source of silently wrong dashboards — the NULL group is easy to miss.",
      "COALESCE(column, 'unknown') is a common way to make that bucket explicit instead of hidden.",
      "The same rule applies to DISTINCT — SQL treats NULLs as equal to each other there too.",
    ],
    code: `SELECT country, COUNT(*) AS orders
FROM sales
GROUP BY country;

-- every row where country IS NULL lands in
-- a single "country = NULL" group`,
    language: "sql",
    filename: "group_by_null.sql",
  },
  {
    id: "feature-engineering",
    number: "11",
    title: "Feature Engineering",
    summary:
      "Feature engineering is the practice of creating new input columns that make patterns easier for a model to find — often the single highest-leverage step in a machine learning project, ahead of picking a fancier algorithm.",
    points: [
      "Simple transforms — ratios, differences, date parts — often help more than switching models.",
      "One-hot encoding turns a categorical column into multiple 0/1 columns a model can use directly.",
      "Always create features using only information that would actually be available at prediction time.",
    ],
    code: `import pandas as pd

df["order_date"] = pd.to_datetime(df["order_date"])
df["order_month"] = df["order_date"].dt.month
df["is_weekend"] = df["order_date"].dt.dayofweek >= 5

df = pd.get_dummies(df, columns=["segment"])  # one-hot encoding`,
    language: "python",
    filename: "feature_engineering.py",
  },
  {
    id: "overfitting",
    number: "12",
    title: "100% Training Accuracy Is a Red Flag, Not a Win",
    summary:
      "A model that scores perfectly on training data has often just memorized it rather than learned a generalizable pattern. Always check performance on a held-out test set before celebrating any result.",
    points: [
      "Splitting data into train/test sets simulates how the model will perform on data it hasn't seen.",
      "A big gap between training and test accuracy is the classic sign of overfitting.",
      "Cross-validation extends this idea by testing on several different splits instead of just one.",
    ],
    code: `from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = DecisionTreeClassifier()
model.fit(X_train, y_train)

print(model.score(X_train, y_train))  # often ~1.0
print(model.score(X_test, y_test))    # the number that actually matters`,
    language: "python",
    filename: "overfitting.py",
  },
  {
    id: "model-evaluation",
    number: "13",
    title: "Model Evaluation Metrics",
    summary:
      "Accuracy alone can be dangerously misleading, especially when classes are imbalanced — a model that always predicts 'no fraud' can be 99% accurate and still useless. Precision and recall tell a fuller story.",
    points: [
      "Precision: of everything the model flagged as positive, how much was actually positive?",
      "Recall: of everything that was actually positive, how much did the model catch?",
      "There's almost always a trade-off between the two — which one matters more depends on the cost of each type of mistake.",
    ],
    code: `from sklearn.metrics import accuracy_score, precision_score, recall_score

y_pred = model.predict(X_test)

print("accuracy:", accuracy_score(y_test, y_pred))
print("precision:", precision_score(y_test, y_pred))
print("recall:", recall_score(y_test, y_pred))`,
    language: "python",
    filename: "evaluation.py",
  },
  {
    id: "bias-ethics",
    number: "14",
    title: "Bias, Fairness & Ethics in Data",
    summary:
      "A model trained on biased historical data will happily reproduce — and sometimes amplify — that bias, since it's only learning statistical patterns, not right from wrong. Being aware of where a dataset came from is part of the job, not an afterthought.",
    points: [
      "If a group is underrepresented in training data, the model will typically perform worse for that group.",
      "Removing a sensitive attribute (like race or gender) from the data doesn't remove bias if other correlated columns still encode it.",
      "Fairness usually means picking a definition explicitly (equal accuracy across groups, equal false-positive rates, etc.) — there's no single universal standard.",
    ],
  },
  {
    id: "communicating-results",
    number: "15",
    title: "Communicating Results",
    summary:
      "The best analysis in the world is worthless if nobody understands or trusts it. Good visualization and clear writing are what turn a model into an actual decision — this is often the most underrated skill in the field.",
    points: [
      "Pick the chart type for the question, not the other way around — trends want a line chart, comparisons want bars.",
      "Lead with the takeaway, not the methodology — most stakeholders want the 'so what' first.",
      "Uncertainty is part of the story too — a confidence interval is more honest than a single number.",
    ],
  },
];

// Frequently asked questions
const faqs: FAQItem[] = [
  {
    question: "Do I need a PhD to work in data science?",
    answer:
      "No. Plenty of data scientists come from a bachelor's degree plus self-taught or bootcamp-style projects. A PhD helps more for research-heavy roles; most industry roles care far more about a strong portfolio and the ability to reason clearly about a dataset.",
  },
  {
    question: "Should I learn Python or R first?",
    answer:
      "Python is the safer default in 2026 — it's the most widely used language across industry data science, machine learning, and data engineering, and it has one ecosystem instead of several competing ones. R still has strong pockets in academia and biostatistics if that's your specific direction.",
  },
  {
    question: "What's the difference between Data Science, Machine Learning, and AI?",
    answer:
      "AI is the broadest term — any system that performs tasks we associate with intelligence. Machine learning is a subset of AI focused on learning patterns from data rather than being explicitly programmed. Data science is broader still: it includes ML, but also statistics, data cleaning, analysis, and communicating results — a data scientist might never train a model at all.",
  },
  {
    question: "How much math and statistics do I actually need?",
    answer:
      "A solid grip on descriptive statistics, probability basics, and linear algebra fundamentals (vectors, matrices) covers most day-to-day work. You can go deep into the theory over time, but you don't need graduate-level math to start being useful.",
  },
  {
    question: "What tools do data scientists actually use day to day?",
    answer:
      "Most days revolve around Python (pandas, NumPy, scikit-learn), SQL for pulling data out of a database, a notebook environment like Jupyter, and some kind of visualization tool — anything from matplotlib to a BI tool like Tableau or Looker, depending on the company.",
  },
  {
    question: "Is data science oversaturated right now?",
    answer:
      "The entry-level market is more competitive than it was a few years ago, but demand for people who can genuinely turn data into decisions hasn't gone away. A concrete portfolio of real projects tends to matter far more than the job title on your resume.",
  },
  {
    question: "What's a good first project to build?",
    answer:
      "Pick a dataset you're genuinely curious about — sports stats, a hobby, your own spending — and take it through the full workflow end to end: clean it, explore it, ask a real question, and answer it with a chart or simple model. A small project done completely beats a big one left half-finished.",
  },
  {
    question: "Do I need to know SQL if I already know pandas?",
    answer:
      "Yes — they solve different problems. SQL is how you get data out of a database in the first place; pandas is what you do with it once it's in memory. Almost every data science job expects comfort with both.",
  },
];

// ---------------------------------------------------------------------------
// Lightweight syntax highlighting for Python and SQL snippets.
//
// Like the code block's colors, this is a small, dependency-free
// highlighter. Token colors are applied as inline styles (not Tailwind
// `text-*` classes) so the code panel's contrast never depends on the
// page's light/dark cascade — the panel is intentionally a fixed dark
// "terminal" surface in both modes.
// ---------------------------------------------------------------------------

const PYTHON_KEYWORDS =
  "import|from|as|def|return|if|elif|else|for|while|in|not|and|or|is|True|False|None|class|self|try|except|finally|with|lambda|yield|break|continue|pass|print";

const SQL_KEYWORDS =
  "SELECT|FROM|WHERE|GROUP|BY|ORDER|AS|COUNT|SUM|AVG|MIN|MAX|JOIN|ON|INNER|LEFT|RIGHT|NULL|IS|NOT|AND|OR|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|DISTINCT|LIMIT|HAVING";

function buildTokenPattern(language: SnippetLanguage): RegExp {
  const keywords = language === "sql" ? SQL_KEYWORDS : PYTHON_KEYWORDS;
  const commentToken = language === "sql" ? "(--.*)" : "(#.*)";
  const keywordFlags = language === "sql" ? "i" : "";
  const keywordGroup = `\\b(${keywords})\\b`;
  return new RegExp(
    `${commentToken}|("(?:[^"\\\\]|\\\\.)*")|('(?:[^'\\\\]|\\\\.)*')|${keywordGroup}|\\b(\\d+\\.?\\d*)\\b|\\b([A-Za-z_][A-Za-z0-9_]*)(?=\\()`,
    `g${keywordFlags}`
  );
}

// Fixed palette tuned for contrast against the code block's dark slate
// background (#0f172a), independent of the page's light/dark mode.
const CODE_COLORS = {
  plain: "#e2e8f0", // slate-200
  comment: "#94a3b8", // slate-400
  string: "#fbbf24", // amber-400
  keyword: "#34d399", // emerald-400
  number: "#38bdf8", // sky-400
  fn: "#c084fc", // purple-400
};

function highlightLine(line: string, keyPrefix: string, language: SnippetLanguage): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let idx = 0;
  const pattern = buildTokenPattern(language);
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    const [full, comment, dstr, sstr, keyword, num, fn] = match;
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`${keyPrefix}-${idx++}`} style={{ color: CODE_COLORS.plain }}>
          {line.slice(lastIndex, match.index)}
        </span>
      );
    }
    let color = CODE_COLORS.plain;
    let fontStyle: "italic" | "normal" = "normal";
    let fontWeight: "500" | "normal" = "normal";
    if (comment) {
      color = CODE_COLORS.comment;
      fontStyle = "italic";
    } else if (dstr || sstr) {
      color = CODE_COLORS.string;
    } else if (keyword) {
      color = CODE_COLORS.keyword;
      fontWeight = "500";
    } else if (num) {
      color = CODE_COLORS.number;
    } else if (fn) {
      color = CODE_COLORS.fn;
    }

    nodes.push(
      <span key={`${keyPrefix}-${idx++}`} style={{ color, fontStyle, fontWeight }}>
        {full}
      </span>
    );
    lastIndex = match.index + full.length;
  }
  if (lastIndex < line.length) {
    nodes.push(
      <span key={`${keyPrefix}-${idx++}`} style={{ color: CODE_COLORS.plain }}>
        {line.slice(lastIndex)}
      </span>
    );
  }
  if (nodes.length === 0) nodes.push("\u00A0");
  return nodes;
}

// ---------------------------------------------------------------------------
// Code block + output block
// ---------------------------------------------------------------------------

function CodeBlock({
  code,
  language = "python",
  filename,
}: {
  code: string;
  language?: SnippetLanguage;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");
  const displayName = filename ?? (language === "sql" ? "query.sql" : "script.py");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — fail silently
    }
  };

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: "#334155", backgroundColor: "#0f172a" }}
    >
      <div
        className="flex items-center justify-between gap-2 border-b px-4 py-2"
        style={{ borderColor: "#334155", backgroundColor: "#1e293b" }}
      >
        <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "#94a3b8" }}>
          <Terminal className="h-3.5 w-3.5 text-teal-500" />
          {displayName}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs font-mono transition-colors hover:text-teal-400"
          style={{ color: "#94a3b8" }}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed font-mono">
        <code>
          {lines.map((line, i) => (
            <div key={i}>{highlightLine(line, `l${i}`, language)}</div>
          ))}
        </code>
      </pre>
    </div>
  );
}

function OutputBlock({ output }: { output: string }) {
  const lines = output.split("\n");
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-1.5 text-[11px] font-mono uppercase tracking-wide text-slate-400 dark:text-slate-500">
        output
      </div>
      <pre className="px-4 py-3 text-[13px] leading-relaxed font-mono text-slate-600 dark:text-slate-300 overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i}>{line || "\u00A0"}</div>
        ))}
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Download Data Science Notes button + toast
// ---------------------------------------------------------------------------

function buildNotesText(): string {
  const header = [
    "CodeNFacts — Data Science Notes",
    "================================",
    "",
    `A study guide covering ${topics.length} core data science topics, plus a FAQ.`,
    "",
    "",
  ].join("\n");

  const body = topics
    .map((t) => {
      const points = t.points.map((p) => `  • ${p}`).join("\n");
      const codeSection = t.code
        ? `\nExample (${t.language ?? "python"}):\n${t.code}\n`
        : "";
      const outputSection = t.output ? `\nOutput:\n${t.output}\n` : "";
      return [
        `${t.number}. ${t.title}`,
        "-".repeat(`${t.number}. ${t.title}`.length),
        t.summary,
        "",
        "Key points:",
        points,
        codeSection,
        outputSection,
        "",
      ].join("\n");
    })
    .join("\n");

  const faqHeader = ["", "FAQ", "----", ""].join("\n");
  const faqBody = faqs
    .map((f) => `Q: ${f.question}\nA: ${f.answer}\n`)
    .join("\n");

  return header + body + faqHeader + faqBody;
}

type ToastState = { message: string; kind: "downloading" | "thanks" } | null;

function DownloadNotesButton() {
  const [toast, setToast] = useState<ToastState>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleDownload = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    setToast({ message: "Downloading Data Science notes…", kind: "downloading" });

    try {
      const text = buildNotesText();
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "codenfacts-data-science-notes.txt";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch {
      // If the download itself fails, still resolve the toast instead of
      // leaving it stuck on "downloading" forever.
    }

    const thanksTimeout = setTimeout(() => {
      setToast({ message: "Thanks for downloading the Data Science notes!", kind: "thanks" });
    }, 1100);

    const hideTimeout = setTimeout(() => {
      setToast(null);
    }, 4200);

    timeoutsRef.current = [thanksTimeout, hideTimeout];
  };

  return (
    <>
      <button
        onClick={handleDownload}
        className="group inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-50 dark:bg-teal-500/10 px-6 py-3 font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors"
      >
        <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        Download Data Science Notes
      </button>

      <div
        aria-live="polite"
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          toast ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
        }`}
      >
        {toast && (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 shadow-lg">
            {toast.kind === "downloading" ? (
              <span className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
            ) : (
              <PartyPopper className="h-4 w-4 flex-shrink-0 text-teal-500" />
            )}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {toast.message}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// FAQ accordion
// ---------------------------------------------------------------------------

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={faq.question} className="bg-white dark:bg-slate-900">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">
                {faq.question}
              </span>
              <ChevronDown
                className={`h-4 w-4 flex-shrink-0 text-teal-500 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <p className="px-5 pb-4 text-sm font-normal leading-relaxed text-slate-600 dark:text-slate-400">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DataScienceCategoryPage() {
  const [activeId, setActiveId] = useState(topics[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const totalTopics = useMemo(() => topics.length, []);

  return (
    <main className="w-full bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero */}
      <section className="relative border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-1.5 text-sm font-normal text-slate-600 dark:text-slate-300">
              <Database className="h-3.5 w-3.5 text-teal-500" />
              Data Science · {totalTopics} core topics
            </span>
          </div>
          <h1 className="text-center text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Learn{" "}
            <span className="text-teal-600 dark:text-teal-400">Data Science</span>{" "}
            from the ground up
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base sm:text-lg font-normal text-slate-500 dark:text-slate-400">
            What data science actually is, why companies invest in it, the
            workflow behind every project, and the gotchas that trip people
            up — each topic paired with a runnable Python or SQL snippet.
          </p>
          <div className="mt-8 flex justify-center">
            <DownloadNotesButton />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-8 py-12">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-12">
          {/* Sticky table of contents */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono font-normal text-slate-400 dark:text-slate-500">
                <ListTree className="h-3.5 w-3.5 text-teal-500" />
                on this page
              </div>
              <nav className="border-l border-slate-200 dark:border-slate-700 max-h-[70vh] overflow-y-auto pr-2">
                {topics.map((t) => {
                  const isActive = t.id === activeId;
                  return (
                    <a
                      key={t.id}
                      href={`#${t.id}`}
                      className={`block border-l-2 -ml-px pl-4 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "border-teal-500 text-teal-700 dark:text-teal-300 font-medium"
                          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 hover:border-teal-300 dark:hover:border-teal-500/50"
                      }`}
                    >
                      <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 mr-1.5">
                        {t.number}
                      </span>
                      {t.title}
                    </a>
                  );
                })}
                <a
                  href="#faq"
                  className={`block border-l-2 -ml-px pl-4 py-1.5 text-sm transition-colors ${
                    activeId === "faq"
                      ? "border-teal-500 text-teal-700 dark:text-teal-300 font-medium"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 hover:border-teal-300 dark:hover:border-teal-500/50"
                  }`}
                >
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 mr-1.5">
                    ?
                  </span>
                  FAQ
                </a>
              </nav>
            </div>
          </aside>

          {/* Topics */}
          <div className="lg:col-span-9 space-y-16">
            {topics.map((topic) => (
              <article
                key={topic.id}
                id={topic.id}
                ref={(el) => {
                  sectionRefs.current[topic.id] = el;
                }}
                className="scroll-mt-8"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-sm text-teal-500">{topic.number}</span>
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                    {topic.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base font-normal text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {topic.summary}
                </p>

                <ul className="mb-5 space-y-1.5">
                  {topic.points.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm font-normal text-slate-500 dark:text-slate-400"
                    >
                      <Hash className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-teal-500" />
                      {point}
                    </li>
                  ))}
                </ul>

                {topic.code && (
                  <div className="grid gap-3 sm:grid-cols-1">
                    <CodeBlock code={topic.code} language={topic.language} filename={topic.filename} />
                    {topic.output && <OutputBlock output={topic.output} />}
                  </div>
                )}
              </article>
            ))}

            {/* FAQ */}
            <article
              id="faq"
              ref={(el) => {
                sectionRefs.current["faq"] = el;
              }}
              className="scroll-mt-8"
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-mono text-sm text-teal-500">?</span>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
              </div>
              <p className="text-sm sm:text-base font-normal text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                The questions people getting started in data science ask most often.
              </p>
              <FAQSection />
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Ready to go deeper?
          </h3>
          <p className="mt-3 text-slate-500 dark:text-slate-400 font-normal">
            Ask the AI tutor any data science question and get a step-by-step
            walkthrough, live.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/ai"
              className="group inline-flex items-center rounded-full bg-teal-600 dark:bg-teal-500 px-7 py-3.5 font-semibold text-white hover:bg-teal-500 dark:hover:bg-teal-400 transition-colors"
            >
              Ask the AI tutor
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/category"
              className="group inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 hover:border-teal-300 hover:text-teal-600 dark:hover:border-teal-500/50 dark:hover:text-teal-300 transition-colors"
            >
              Browse other categories
              <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}