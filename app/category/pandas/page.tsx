"use client";

/**
 * category/pandas/page.tsx
 * ---------------------------------------------------------
 * A complete, self-contained "pandas" study page:
 *  - What / why / types of pandas
 *  - Detailed notes for every core topic, with runnable examples
 *  - A formula / method cheat sheet
 *  - Two hand-drawn-style SVG diagrams (DataFrame anatomy + workflow)
 *  - A "Download notes" button that generates a .md file client-side
 *    and shows a thank-you toast after the download starts
 *
 * THEME NOTE: this page assumes your app already toggles a `dark`
 * class on the <html>/<body> element from the header's light/dark
 * button (the standard Tailwind `darkMode: "class"` strategy). Every
 * surface here is styled with light defaults + `dark:` overrides, so
 * it will automatically flip when that class is toggled. No local
 * theme state is created here to avoid fighting your header toggle.
 * ---------------------------------------------------------
 */

import { useMemo, useState } from "react";

/* ============================================================
   1. TINY INLINE ICONS (no external icon dependency required)
   ============================================================ */

function IconDownload({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 11l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconChevron({ open, className = "" }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 12.5l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPin({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16" r="0.9" fill="currentColor" />
    </svg>
  );
}

/* ============================================================
   2. CONTENT DATA
   ============================================================ */

const WHY_USE: string[] = [
  "Pandas gives Python a fast, labeled, two-dimensional table (DataFrame) — the same mental model as a spreadsheet or SQL table, but scriptable.",
  "It is built on NumPy, so bulk operations run in compiled C loops instead of slow Python for-loops.",
  "One library covers the whole data-wrangling lifecycle: read files, clean, reshape, merge, aggregate, and write results back out.",
  "It integrates directly with the rest of the PyData stack — NumPy, Matplotlib, scikit-learn, SQLAlchemy — so a DataFrame can flow straight into a model or a chart.",
  "Labeled axes (row index + column names) mean you select data by meaning ('sales in March') instead of by raw position.",
];

const WHY_NEEDED: string[] = [
  "Raw Python lists/dicts have no concept of alignment — combining two datasets means writing your own matching logic. Pandas aligns on the index automatically.",
  "Real-world data is messy: missing values, mixed types, duplicate rows, inconsistent dates. Pandas has dedicated, tested tools (isna, dropna, fillna, drop_duplicates, to_datetime) for exactly this.",
  "Analysts constantly need to group-and-summarize ('total revenue per region per month'). groupby + agg does this in one readable line instead of nested loops.",
  "Without pandas you would hand-roll CSV/Excel/JSON/SQL parsing every time. Pandas standardizes all of it behind read_*/to_* functions.",
  "Vectorized operations (column + column, column.str.upper(), etc.) are both shorter to write and orders of magnitude faster than looping row by row.",
];

type CodeExample = { label: string; code: string };

type Topic = {
  id: string;
  num: string;
  title: string;
  blurb: string;
  points: string[];
  examples: CodeExample[];
  tip?: string;
};

const TOPICS: Topic[] = [
  {
    id: "create",
    num: "01",
    title: "Creating Series & DataFrames",
    blurb: "A Series is a single labeled column; a DataFrame is a dict of Series sharing one index.",
    points: [
      "pd.Series(data, index=...) builds a 1-D labeled array.",
      "pd.DataFrame(data) accepts dicts of lists, lists of dicts, NumPy arrays, or another DataFrame.",
      "Every axis (rows and columns) is labeled — that label set is the 'Index'.",
    ],
    examples: [
      {
        label: "Series",
        code:
`import pandas as pd

s = pd.Series([10, 20, 30], index=["a", "b", "c"], name="scores")
# a    10
# b    20
# c    30`,
      },
      {
        label: "DataFrame",
        code:
`data = {
    "city": ["Pune", "Delhi", "Goa"],
    "temp_c": [29, 34, 31],
}
df = pd.DataFrame(data)
#      city  temp_c
# 0    Pune      29
# 1   Delhi      34
# 2     Goa      31`,
      },
    ],
    tip: "Give DataFrame a meaningful index up front (index='city' or set_index later) — it makes every later lookup read like plain English.",
  },
  {
    id: "io",
    num: "02",
    title: "Reading & Writing Data",
    blurb: "read_* functions load data in; to_* functions write it back out — the file format changes, the pattern doesn't.",
    points: [
      "pd.read_csv, pd.read_excel, pd.read_json, pd.read_sql all return a DataFrame.",
      "Mirror methods df.to_csv, df.to_excel, df.to_json, df.to_sql write it back.",
      "Common read_csv arguments: sep, header, index_col, usecols, dtype, parse_dates, nrows.",
    ],
    examples: [
      {
        label: "CSV / Excel",
        code:
`df = pd.read_csv("sales.csv", parse_dates=["order_date"])
df.to_csv("clean_sales.csv", index=False)

xls = pd.read_excel("book.xlsx", sheet_name="Q1")
df.to_excel("out.xlsx", sheet_name="Result", index=False)`,
      },
      {
        label: "JSON / SQL",
        code:
`df = pd.read_json("records.json")

import sqlite3
conn = sqlite3.connect("shop.db")
df = pd.read_sql("SELECT * FROM orders", conn)
df.to_sql("orders_clean", conn, if_exists="replace", index=False)`,
      },
    ],
    tip: "Always pass index=False to to_csv/to_excel unless you deliberately want pandas' row index saved as its own column.",
  },
  {
    id: "inspect",
    num: "03",
    title: "Inspecting a DataFrame",
    blurb: "The five commands you run in the first ten seconds of touching any new dataset.",
    points: [
      "df.head(n) / df.tail(n) — preview rows.",
      "df.info() — dtypes, non-null counts, memory use.",
      "df.describe() — count, mean, std, min, quartiles, max for numeric columns.",
      "df.shape — (rows, columns); df.dtypes — per-column type; df.columns / df.index — the labels.",
    ],
    examples: [
      {
        label: "Quick health check",
        code:
`df.head()
df.info()
df.describe()
df.shape        # (1000, 6)
df.columns      # Index(['city','temp_c', ...])
df.isna().sum() # missing values per column`,
      },
    ],
  },
  {
    id: "select",
    num: "04",
    title: "Selection & Indexing",
    blurb: "loc selects by label, iloc selects by integer position — mixing them up is the #1 beginner bug.",
    points: [
      "df['col'] or df.col → single column as a Series.",
      "df[['a','b']] → multiple columns as a DataFrame.",
      "df.loc[row_label, col_label] → label-based selection (inclusive slicing).",
      "df.iloc[row_pos, col_pos] → position-based selection (exclusive slicing, like Python lists).",
      "df.at[row,col] / df.iat[row,col] → fast scalar access.",
    ],
    examples: [
      {
        label: "loc vs iloc",
        code:
`df.loc[0]                 # row with label 0
df.loc[0:2, "city"]       # rows 0..2 inclusive, one column
df.iloc[0]                 # first row by position
df.iloc[0:2, 0:1]          # rows 0-1, first column, end excluded
df.at[0, "temp_c"]         # single fast scalar read`,
      },
    ],
    tip: "loc slicing INCLUDES the end label; iloc slicing EXCLUDES the end position — this single difference causes most off-by-one bugs.",
  },
  {
    id: "filter",
    num: "05",
    title: "Filtering with Boolean Masks",
    blurb: "A condition on a Series produces a True/False mask; feeding that mask back into df[] keeps only the True rows.",
    points: [
      "df[df['col'] > 30] — single condition.",
      "Combine conditions with & (and), | (or), ~ (not) — each condition needs its own parentheses.",
      "df['col'].isin([...]) for membership; df['col'].between(a, b) for ranges.",
      "df.query('col > 30 and city == \"Pune\"') — same result, SQL-like string syntax.",
    ],
    examples: [
      {
        label: "Boolean masks",
        code:
`hot = df[df["temp_c"] > 30]
hot_pune = df[(df["temp_c"] > 30) & (df["city"] == "Pune")]
not_pune = df[~(df["city"] == "Pune")]
some_cities = df[df["city"].isin(["Pune", "Goa"])]
df.query("temp_c > 30 and city == 'Pune'")`,
      },
    ],
  },
  {
    id: "columns",
    num: "06",
    title: "Adding, Renaming, Dropping",
    blurb: "Columns and rows are added, renamed, or removed with a small, consistent set of verbs.",
    points: [
      "df['new'] = ... adds/overwrites a column (broadcast or computed from other columns).",
      "df.assign(new=...) does the same but returns a new DataFrame (chain-friendly).",
      "df.rename(columns={'old':'new'}) renames without touching data.",
      "df.drop(columns=['a']) / df.drop(index=[0]) removes columns/rows; axis=1 also means columns.",
    ],
    examples: [
      {
        label: "Column ops",
        code:
`df["temp_f"] = df["temp_c"] * 9 / 5 + 32
df = df.rename(columns={"temp_c": "celsius"})
df = df.drop(columns=["temp_f"])
df = df.assign(is_hot=lambda d: d["celsius"] > 30)`,
      },
    ],
  },
  {
    id: "missing",
    num: "07",
    title: "Handling Missing Data",
    blurb: "Missing values show up as NaN (or NaT for dates). Pandas gives you detect / drop / fill / interpolate tools for each.",
    points: [
      "df.isna() / df.notna() — boolean map of missing values.",
      "df.dropna(subset=['col']) — remove rows with NaN in given columns.",
      "df.fillna(value) — replace NaN with a constant, a dict per column, or a strategy (method='ffill'/'bfill').",
      "df.interpolate() — fill numeric gaps using linear (or other) interpolation.",
    ],
    examples: [
      {
        label: "Cleaning gaps",
        code:
`df.isna().sum()                       # count NaNs per column
df.dropna(subset=["temp_c"])          # drop rows missing temp
df["temp_c"].fillna(df["temp_c"].mean(), inplace=True)
df.fillna({"city": "Unknown", "temp_c": 0})
df["temp_c"].interpolate(method="linear")`,
      },
    ],
    tip: "Prefer fillna(df.mean()) over dropping rows when you can't afford to lose data — but always note it was imputed.",
  },
  {
    id: "sort",
    num: "08",
    title: "Sorting & Ranking",
    blurb: "Order rows by value or reorder by index; ranking assigns a position within that order.",
    points: [
      "df.sort_values('col', ascending=False) — sort by one or more columns.",
      "df.sort_index() — sort by the row index.",
      "df['col'].rank() — numeric rank of each value.",
      "df.nlargest(n, 'col') / df.nsmallest(n, 'col') — fast top-N without a full sort.",
    ],
    examples: [
      {
        label: "Sorting",
        code:
`df.sort_values("temp_c", ascending=False)
df.sort_values(["city", "temp_c"], ascending=[True, False])
df.nlargest(3, "temp_c")
df["rank"] = df["temp_c"].rank(ascending=False)`,
      },
    ],
  },
  {
    id: "groupby",
    num: "09",
    title: "GroupBy & Aggregation",
    blurb: "Split the DataFrame into groups, apply a function to each, combine the results — the classic split-apply-combine pattern.",
    points: [
      "df.groupby('col') returns a GroupBy object — nothing is computed until you aggregate.",
      "Chain .mean(), .sum(), .count(), .agg([...]) or a custom function.",
      "agg({'col1':'sum', 'col2':'mean'}) applies a different function per column.",
      "groupby(...).transform(...) returns a result the same shape as the original (great for per-group normalization).",
    ],
    examples: [
      {
        label: "Split-apply-combine",
        code:
`df.groupby("city")["temp_c"].mean()

df.groupby("city").agg(
    avg_temp=("temp_c", "mean"),
    n=("temp_c", "count"),
)

df["temp_vs_city_avg"] = (
    df["temp_c"] - df.groupby("city")["temp_c"].transform("mean")
)`,
      },
    ],
  },
  {
    id: "combine",
    num: "10",
    title: "Merge, Join & Concat",
    blurb: "Three ways to combine DataFrames: merge (SQL-style join on keys), join (index-based), concat (stack along an axis).",
    points: [
      "pd.merge(left, right, on='key', how='inner'|'left'|'right'|'outer') — SQL-style join.",
      "df.join(other) — merge on the index instead of a column.",
      "pd.concat([df1, df2]) — stack rows (axis=0, default) or columns (axis=1).",
    ],
    examples: [
      {
        label: "Combining data",
        code:
`orders = pd.DataFrame({"order_id":[1,2], "cust_id":[10,11]})
customers = pd.DataFrame({"cust_id":[10,11], "name":["A","B"]})

pd.merge(orders, customers, on="cust_id", how="left")

pd.concat([df_jan, df_feb], axis=0, ignore_index=True)  # stack rows
pd.concat([df_a, df_b], axis=1)                          # stack columns`,
      },
    ],
    tip: "how='left' keeps every row of the left table even with no match — the most common join in reporting pipelines.",
  },
  {
    id: "reshape",
    num: "11",
    title: "Pivot Tables & Crosstab",
    blurb: "Turn long/tidy data into a wide summary table (and back again) without writing manual loops.",
    points: [
      "df.pivot_table(values, index, columns, aggfunc) — spreadsheet-style pivot with aggregation.",
      "pd.crosstab(a, b) — frequency table between two categorical columns.",
      "df.melt(id_vars, value_vars) — wide → long (the inverse of pivot).",
    ],
    examples: [
      {
        label: "Pivoting",
        code:
`df.pivot_table(values="temp_c", index="city", columns="month", aggfunc="mean")

pd.crosstab(df["city"], df["is_hot"])

wide.melt(id_vars="city", var_name="month", value_name="temp_c")`,
      },
    ],
  },
  {
    id: "strings",
    num: "12",
    title: "String Methods (.str accessor)",
    blurb: "Vectorized text operations — every Python str method has a pandas equivalent via .str, applied to a whole column at once.",
    points: [
      "df['col'].str.lower() / .upper() / .strip() / .title()",
      ".str.contains('x'), .str.startswith('x'), .str.replace('a','b')",
      ".str.split(',', expand=True) splits into multiple columns.",
    ],
    examples: [
      {
        label: "Text cleanup",
        code:
`df["city"] = df["city"].str.strip().str.title()
mask = df["city"].str.contains("pu", case=False)
df[["first", "last"]] = df["name"].str.split(" ", expand=True)`,
      },
    ],
  },
  {
    id: "datetime",
    num: "13",
    title: "Datetime Handling",
    blurb: "pd.to_datetime standardizes dates; the .dt accessor then unlocks calendar-aware operations.",
    points: [
      "pd.to_datetime(col) converts text/objects to real datetime64 values.",
      ".dt.year, .dt.month, .dt.day_name(), .dt.dayofweek extract calendar fields.",
      "df.set_index('date').resample('M').mean() — downsample a time series to monthly.",
    ],
    examples: [
      {
        label: "Dates & time series",
        code:
`df["order_date"] = pd.to_datetime(df["order_date"])
df["month"] = df["order_date"].dt.month_name()
df["weekday"] = df["order_date"].dt.day_name()

ts = df.set_index("order_date")
ts.resample("M")["sales"].sum()   # monthly totals`,
      },
    ],
  },
  {
    id: "apply",
    num: "14",
    title: "apply / map / applymap & Vectorization",
    blurb: "Custom row/column logic, cell-by-cell mapping, and why you should reach for vectorized ops first.",
    points: [
      "Series.map(func_or_dict) — element-wise on one column.",
      "DataFrame.apply(func, axis=1) — run a function across each row (or axis=0 for each column).",
      "DataFrame.applymap(func) — element-wise across every cell of the whole frame.",
      "Prefer vectorized math (df['a'] + df['b']) over apply whenever possible — it's compiled and much faster.",
    ],
    examples: [
      {
        label: "apply / map",
        code:
`df["grade"] = df["score"].map({90: "A", 75: "B"})
df["total"] = df.apply(lambda r: r["price"] * r["qty"], axis=1)
df_numeric = df[["a", "b"]].applymap(lambda x: round(x, 2))

# Prefer this over apply when possible:
df["total"] = df["price"] * df["qty"]   # vectorized, faster`,
      },
    ],
  },
  {
    id: "stats",
    num: "15",
    title: "Statistics & Value Counts",
    blurb: "Quick numeric summaries and frequency counts for exploratory analysis.",
    points: [
      "df.mean(), .median(), .std(), .var(), .sum(), .min(), .max()",
      "df.corr() — pairwise correlation matrix; df.cov() — covariance matrix.",
      "df['col'].value_counts() — frequency of each unique value, sorted descending.",
      "df['col'].unique() / .nunique() — distinct values / count of distinct values.",
    ],
    examples: [
      {
        label: "Exploring numbers",
        code:
`df["temp_c"].mean()
df.corr(numeric_only=True)
df["city"].value_counts()
df["city"].nunique()   # number of distinct cities`,
      },
    ],
  },
  {
    id: "plot",
    num: "16",
    title: "Plotting Basics",
    blurb: "DataFrame.plot() wraps Matplotlib so you can chart straight from a DataFrame without importing anything extra for simple cases.",
    points: [
      "df.plot(kind='line'|'bar'|'hist'|'box'|'scatter', x=..., y=...)",
      "df['col'].plot.hist() and similar .plot.<kind>() shortcuts.",
      "Needs matplotlib installed; call plt.show() (or %matplotlib inline in Jupyter) to render.",
    ],
    examples: [
      {
        label: "Quick charts",
        code:
`import matplotlib.pyplot as plt

df.groupby("city")["temp_c"].mean().plot(kind="bar")
df["temp_c"].plot.hist(bins=10)
df.plot(kind="scatter", x="temp_c", y="humidity")
plt.show()`,
      },
    ],
  },
];

type CheatRow = { method: string; does: string };
type CheatGroup = { group: string; rows: CheatRow[] };

const CHEATSHEET: CheatGroup[] = [
  {
    group: "Create / Inspect",
    rows: [
      { method: "pd.Series(data, index=...)", does: "1-D labeled array" },
      { method: "pd.DataFrame(data)", does: "2-D labeled table" },
      { method: "df.head(n) / df.tail(n)", does: "First / last n rows" },
      { method: "df.info()", does: "Dtypes + non-null counts" },
      { method: "df.describe()", does: "Summary statistics" },
      { method: "df.shape / df.dtypes", does: "Dimensions / column types" },
    ],
  },
  {
    group: "I/O",
    rows: [
      { method: "pd.read_csv(path)", does: "Load a CSV into a DataFrame" },
      { method: "df.to_csv(path, index=False)", does: "Write DataFrame to CSV" },
      { method: "pd.read_excel(path, sheet_name=)", does: "Load an Excel sheet" },
      { method: "pd.read_json(path)", does: "Load JSON records" },
      { method: "pd.read_sql(query, conn)", does: "Load rows from a database" },
    ],
  },
  {
    group: "Select / Filter",
    rows: [
      { method: "df['col'] / df.col", does: "Single column as Series" },
      { method: "df.loc[row, col]", does: "Label-based selection" },
      { method: "df.iloc[row, col]", does: "Position-based selection" },
      { method: "df[df['col'] > x]", does: "Boolean mask filter" },
      { method: "df['col'].isin([...])", does: "Membership filter" },
      { method: "df.query('expr')", does: "SQL-like filter string" },
    ],
  },
  {
    group: "Clean",
    rows: [
      { method: "df.isna() / df.notna()", does: "Detect missing values" },
      { method: "df.dropna()", does: "Drop rows/cols with NaN" },
      { method: "df.fillna(value)", does: "Fill missing values" },
      { method: "df.drop_duplicates()", does: "Remove duplicate rows" },
      { method: "df.rename(columns={...})", does: "Rename labels" },
      { method: "df.astype(dtype)", does: "Cast column type" },
    ],
  },
  {
    group: "Reshape / Combine",
    rows: [
      { method: "df.sort_values('col')", does: "Sort rows by value" },
      { method: "df.groupby('col').agg(...)", does: "Split-apply-combine" },
      { method: "pd.merge(a, b, on='key')", does: "SQL-style join" },
      { method: "pd.concat([a, b])", does: "Stack rows or columns" },
      { method: "df.pivot_table(...)", does: "Wide summary table" },
      { method: "df.melt(...)", does: "Wide → long format" },
    ],
  },
  {
    group: "Text / Time / Math",
    rows: [
      { method: "df['c'].str.lower()", does: "Vectorized string ops" },
      { method: "pd.to_datetime(col)", does: "Parse dates" },
      { method: "df['c'].dt.month", does: "Extract date part" },
      { method: "df.apply(func, axis=1)", does: "Row/column-wise function" },
      { method: "df['c'].value_counts()", does: "Frequency of values" },
      { method: "df.corr()", does: "Correlation matrix" },
    ],
  },
];

const IMPORTANT_NOTES: string[] = [
  "loc includes the end of a slice; iloc excludes it — this is the single most common source of bugs.",
  "Most pandas methods return a NEW object by default (they don't mutate). Reassign the result: df = df.dropna(), or pass inplace=True.",
  "A slice/filter of a DataFrame can be a *view* or a *copy* — pandas will warn 'SettingWithCopyWarning' if you write into an ambiguous one. Use .copy() when you intend to keep working on a filtered subset.",
  "NaN is a float — an integer column with any missing values gets silently upcast to float64.",
  "Always check df.dtypes after read_csv; numbers stored as text, or dates read as plain strings, are the #1 cause of downstream errors.",
  "Vectorize before you loop: df['a'] + df['b'] beats df.apply(...) beats a Python for-loop, often by 10-100x.",
];

/* ============================================================
   3. NOTES → MARKDOWN (used by the download button)
   ============================================================ */

function buildNotesMarkdown(): string {
  const lines: string[] = [];
  lines.push("# Pandas — Complete Notes");
  lines.push("");
  lines.push("_Generated from the Pandas study page._");
  lines.push("");
  lines.push("## Why use pandas");
  WHY_USE.forEach((w) => lines.push(`- ${w}`));
  lines.push("");
  lines.push("## Why pandas is needed");
  WHY_NEEDED.forEach((w) => lines.push(`- ${w}`));
  lines.push("");
  lines.push("## Core types");
  lines.push("- **Series** — 1-D labeled array (one column + an index).");
  lines.push("- **DataFrame** — 2-D labeled table (a dict of Series sharing one index).");
  lines.push("- **Index** — the immutable label array attached to every axis.");
  lines.push("");
  lines.push("## Topics");
  TOPICS.forEach((t) => {
    lines.push(`### ${t.num}. ${t.title}`);
    lines.push(t.blurb);
    lines.push("");
    t.points.forEach((p) => lines.push(`- ${p}`));
    lines.push("");
    t.examples.forEach((ex) => {
      lines.push(`**${ex.label}**`);
      lines.push("```python");
      lines.push(ex.code);
      lines.push("```");
      lines.push("");
    });
    if (t.tip) {
      lines.push(`> Tip: ${t.tip}`);
      lines.push("");
    }
  });
  lines.push("## Cheat sheet");
  CHEATSHEET.forEach((g) => {
    lines.push(`### ${g.group}`);
    lines.push("| Method | What it does |");
    lines.push("|---|---|");
    g.rows.forEach((r) => lines.push(`| \`${r.method}\` | ${r.does} |`));
    lines.push("");
  });
  lines.push("## Important points to remember");
  IMPORTANT_NOTES.forEach((n) => lines.push(`- ${n}`));
  lines.push("");
  return lines.join("\n");
}

/* ============================================================
   4. DIAGRAMS (sketch-style SVGs, theme-aware via currentColor)
   ============================================================ */

function DataFrameAnatomyDiagram() {
  return (
    <svg viewBox="0 0 640 260" className="w-full h-auto" role="img" aria-label="Anatomy of a pandas DataFrame">
      <g className="text-slate-400 dark:text-slate-600" stroke="currentColor" strokeWidth="1.4" fill="none">
        <rect x="90" y="40" width="520" height="190" rx="6" />
        {[40, 78, 116, 154, 192].map((y) => (
          <line key={y} x1="90" y1={y} x2="610" y2={y} />
        ))}
        {[90, 230, 350, 480, 610].map((x) => (
          <line key={x} x1={x} y1="40" x2={x} y2="230" />
        ))}
        <rect x="10" y="40" width="80" height="190" rx="6" />
        {[78, 116, 154, 192].map((y) => (
          <line key={`i${y}`} x1="10" y1={y} x2="90" y2={y} />
        ))}
      </g>
      <text x="50" y="26" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono">index</text>
      <text x="160" y="26" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400 text-[11px] font-mono">city</text>
      <text x="290" y="26" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400 text-[11px] font-mono">temp_c</text>
      <text x="415" y="26" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400 text-[11px] font-mono">humidity</text>
      <text x="545" y="26" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400 text-[11px] font-mono">is_hot</text>

      {["0", "1", "2", "3"].map((n, i) => (
        <text key={n} x="50" y={64 + i * 38} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono">{n}</text>
      ))}
      {[
        ["Pune", "29", "0.41", "False"],
        ["Delhi", "34", "0.22", "True"],
        ["Goa", "31", "0.55", "True"],
        ["Shimla", "18", "0.60", "False"],
      ].map((row, i) => (
        <g key={i}>
          {row.map((cell, j) => (
            <text
              key={j}
              x={[160, 290, 415, 545][j]}
              y={64 + i * 38}
              textAnchor="middle"
              className="fill-slate-700 dark:fill-slate-200 text-[11px] font-mono"
            >
              {cell}
            </text>
          ))}
        </g>
      ))}

      <text x="20" y="248" className="fill-amber-600 dark:fill-amber-400 text-[10px] font-mono">↑ row index</text>
      <text x="500" y="248" className="fill-amber-600 dark:fill-amber-400 text-[10px] font-mono">columns →</text>
    </svg>
  );
}

function WorkflowDiagram() {
  const steps = ["Read", "Inspect", "Clean", "Transform", "Group / Merge", "Analyze", "Export / Plot"];
  return (
    <svg viewBox="0 0 900 120" className="w-full h-auto" role="img" aria-label="Typical pandas workflow">
      {steps.map((s, i) => {
        const x = 20 + i * 128;
        return (
          <g key={s}>
            <rect
              x={x}
              y="35"
              width="108"
              height="50"
              rx="10"
              className="fill-white dark:fill-slate-800 stroke-blue-500/70 dark:stroke-blue-400/70"
              strokeWidth="1.6"
            />
            <text x={x + 54} y="65" textAnchor="middle" className="fill-slate-700 dark:fill-slate-100 text-[11px] font-semibold">
              {s}
            </text>
            {i < steps.length - 1 && (
              <path
                d={`M ${x + 108} 60 L ${x + 126} 60`}
                stroke="currentColor"
                className="text-amber-500 dark:text-amber-400"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" className="fill-amber-500 dark:fill-amber-400" />
        </marker>
      </defs>
    </svg>
  );
}

/* ============================================================
   5. SMALL PRESENTATIONAL PIECES
   ============================================================ */

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 dark:bg-black/60 text-slate-100 text-[12.5px] leading-relaxed p-4 font-mono ring-1 ring-slate-800 dark:ring-white/10">
      <code>{code}</code>
    </pre>
  );
}

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <span className="font-mono text-xs text-blue-600/70 dark:text-blue-400/70 tabular-nums">{index}</span>
      <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
        {title}
      </h2>
      <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  );
}

function TopicRow({ topic, open, onToggle }: { topic: Topic; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-200 dark:border-white/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 py-4 text-left group"
        aria-expanded={open}
      >
        <span className="w-9 shrink-0 font-mono text-xs text-slate-400 dark:text-slate-500 tabular-nums">{topic.num}</span>
        <span className="flex-1">
          <span className="block text-[15px] font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {topic.title}
          </span>
          <span className="block text-sm text-slate-500 dark:text-slate-400 mt-0.5">{topic.blurb}</span>
        </span>
        <IconChevron open={open} className="w-4 h-4 shrink-0 text-slate-400" />
      </button>

      {open && (
        <div className="pb-6 pl-9 pr-2 animate-[fadeIn_.15s_ease]">
          <ul className="space-y-1.5 mb-3">
            {topic.points.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                <IconCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          {topic.examples.map((ex, i) => (
            <div key={i} className="mb-2">
              <span className="text-[11px] uppercase tracking-wide font-mono text-blue-600 dark:text-blue-400">
                {ex.label}
              </span>
              <CodeBlock code={ex.code} />
            </div>
          ))}

          {topic.tip && (
            <div className="mt-3 flex gap-2 rounded-md bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 px-3 py-2">
              <IconPin className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-200">{topic.tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   6. PAGE
   ============================================================ */

export default function PandasNotesPage() {
  const [openTopicId, setOpenTopicId] = useState<string>(TOPICS[0].id);
  const [cheatQuery, setCheatQuery] = useState("");
  const [showThanks, setShowThanks] = useState(false);

  const filteredCheatsheet = useMemo(() => {
    const q = cheatQuery.trim().toLowerCase();
    if (!q) return CHEATSHEET;
    return CHEATSHEET.map((g) => ({
      ...g,
      rows: g.rows.filter(
        (r) => r.method.toLowerCase().includes(q) || r.does.toLowerCase().includes(q)
      ),
    })).filter((g) => g.rows.length > 0);
  }, [cheatQuery]);

  function handleDownload() {
    const markdown = buildNotesMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pandas-complete-notes.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setShowThanks(true);
    window.setTimeout(() => setShowThanks(false), 4500);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Fonts + a couple of small keyframes/utility hooks */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap");
        :root {
          --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
          --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
          --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
        }
        body {
          font-family: var(--font-body);
        }
        .font-mono {
          font-family: var(--font-mono);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ---------------- HERO ---------------- */}
      <header className="relative overflow-hidden border-b border-slate-200 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-400/30 bg-blue-50 dark:bg-blue-400/10 px-3 py-1 text-xs font-mono text-blue-700 dark:text-blue-300 mb-6">
            pandas · python data-analysis library
          </div>
          <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
            Everything about <span className="text-blue-600 dark:text-blue-400">pandas</span>,
            <br /> in one page.
          </h1>
          <p className="mt-5 max-w-2xl text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">
            What pandas is, why it exists, its core types, every major topic with runnable
            examples, a condensed cheat sheet, diagrams of how a DataFrame is put together - and
            a one-click download of the whole thing as notes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-5 py-3 transition-colors shadow-sm shadow-blue-600/20"
            >
              <IconDownload className="w-4 h-4" />
              Download pandas notes
            </button>
            <a
              href="#topics"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-white/15 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium px-5 py-3 transition-colors"
            >
              Jump to notes ↓
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-14 space-y-20">
        {/* ---------------- WHAT IS PANDAS ---------------- */}
        <section>
          <SectionHeading index="§1" title="What is pandas?" />
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
            <strong>pandas</strong> is an open-source Python library for working with structured
            (tabular) data — think spreadsheets or SQL tables, but manipulated with code. It
            introduces two core objects, <code className="font-mono text-blue-600 dark:text-blue-400">Series</code> (a
            labeled column) and <code className="font-mono text-blue-600 dark:text-blue-400">DataFrame</code> (a labeled
            table), and a large, consistent API for reading, cleaning, reshaping, combining, and
            summarizing that data. It's built directly on top of NumPy, so the heavy lifting runs
            at C speed instead of interpreted Python loops.
          </p>
        </section>

        {/* ---------------- WHY USE / WHY NEEDED ---------------- */}
        <section className="grid sm:grid-cols-2 gap-10">
          <div>
            <SectionHeading index="§2" title="Why use it" />
            <ul className="space-y-3">
              {WHY_USE.map((w, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <IconCheck className="w-4 h-4 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading index="§3" title="Why it's needed" />
            <ul className="space-y-3">
              {WHY_NEEDED.map((w, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <IconCheck className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- TYPES + DIAGRAM ---------------- */}
        <section>
          <SectionHeading index="§4" title="Core types" />
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { name: "Series", desc: "1-D labeled array. One column of data + an index." },
              { name: "DataFrame", desc: "2-D labeled table. A dict of Series sharing one index." },
              { name: "Index", desc: "The immutable label array attached to rows (and columns)." },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-slate-200 dark:border-white/10 p-5 bg-slate-50/60 dark:bg-white/[0.03]"
              >
                <p className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">{t.name}</p>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-white/[0.02]">
            <p className="text-xs font-mono uppercase tracking-wide text-slate-400 mb-3">
              Sketch — anatomy of a DataFrame
            </p>
            <DataFrameAnatomyDiagram />
          </div>
        </section>

        {/* ---------------- INSTALLATION ---------------- */}
        <section>
          <SectionHeading index="§5" title="Installation" />
          <CodeBlock code={`pip install pandas\n\n# inside a notebook / script\nimport pandas as pd\nprint(pd.__version__)`} />
        </section>

        {/* ---------------- WORKFLOW DIAGRAM ---------------- */}
        <section>
          <SectionHeading index="§6" title="Typical workflow" />
          <div className="rounded-xl border border-slate-200 dark:border-white/10 p-6 bg-white dark:bg-white/[0.02] overflow-x-auto">
            <WorkflowDiagram />
          </div>
        </section>

        {/* ---------------- DETAILED TOPICS ---------------- */}
        <section id="topics">
          <SectionHeading index="§7" title="Detailed notes — every topic" />
          <div className="rounded-xl border border-slate-200 dark:border-white/10 px-5 bg-white dark:bg-white/[0.02]">
            {TOPICS.map((t) => (
              <TopicRow
                key={t.id}
                topic={t}
                open={openTopicId === t.id}
                onToggle={() => setOpenTopicId(openTopicId === t.id ? "" : t.id)}
              />
            ))}
          </div>
        </section>

        {/* ---------------- CHEAT SHEET ---------------- */}
        <section>
          <SectionHeading index="§8" title="Formula / method cheat sheet" />
          <input
            value={cheatQuery}
            onChange={(e) => setCheatQuery(e.target.value)}
            placeholder="Filter cheat sheet… e.g. groupby, merge, str"
            className="w-full mb-6 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <div className="grid sm:grid-cols-2 gap-6">
            {filteredCheatsheet.map((g) => (
              <div key={g.group} className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-white/[0.04] border-b border-slate-200 dark:border-white/10">
                  <p className="text-xs font-mono uppercase tracking-wide text-blue-600 dark:text-blue-400">{g.group}</p>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {g.rows.map((r) => (
                      <tr key={r.method} className="border-b border-slate-100 dark:border-white/5 last:border-b-0">
                        <td className="px-4 py-2.5 font-mono text-[12.5px] text-slate-800 dark:text-slate-200 whitespace-nowrap align-top">
                          {r.method}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400 align-top">{r.does}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            {filteredCheatsheet.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 col-span-2">No matches — try a different keyword.</p>
            )}
          </div>
        </section>

        {/* ---------------- IMPORTANT NOTES ---------------- */}
        <section>
          <SectionHeading index="§9" title="Important points (IMP)" />
          <div className="grid sm:grid-cols-2 gap-3">
            {IMPORTANT_NOTES.map((n, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-lg border border-red-200 dark:border-red-400/25 bg-red-50 dark:bg-red-400/[0.06] px-4 py-3"
              >
                <span className="font-mono text-xs font-semibold text-red-600 dark:text-red-400 mt-0.5">!</span>
                <p className="text-sm text-red-900/90 dark:text-red-200/90">{n}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- DOWNLOAD CTA (bottom) ---------------- */}
        <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-8 py-10 text-center">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold mb-2">Keep these notes offline</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Every topic, example, and the cheat sheet above, bundled into a single Markdown file
            you can keep, print, or drop into Notion / Obsidian.
          </p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-6 py-3 transition-colors shadow-sm shadow-blue-600/20"
          >
            <IconDownload className="w-4 h-4" />
            Download pandas notes 
          </button>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-white/10 py-8 text-center text-xs text-slate-400 dark:text-slate-500 font-mono">
        pandas notes · light/dark follows your header toggle
      </footer>

      {/* ---------------- THANK-YOU TOAST ---------------- */}
      {showThanks && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_.25s_ease]"
        >
          <div className="flex items-center gap-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 shadow-xl shadow-black/20">
            <span className="grid place-items-center w-7 h-7 rounded-full bg-emerald-500/20">
              <IconCheck className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            </span>
            <div>
              <p className="text-sm font-semibold">Thanks for downloading! 🎉</p>
              <p className="text-xs opacity-70">Your pandas notes are saved as pandas-complete-notes.md</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}