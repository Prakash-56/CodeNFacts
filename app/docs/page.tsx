"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════ */

const SNIPPETS = [
  {
    lang: "python", label: "Python", badge: "PY", color: "#00d4ff", bg: "#00d4ff12",
    title: "Fibonacci · memoization",
    code: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    """O(n) time, O(n) space via memoisation."""
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

sequence = [fib(i) for i in range(15)]
print(sequence)
# [0,1,1,2,3,5,8,13,21,34,55,89,144,233,377]`,
  },
  {
    lang: "javascript", label: "JavaScript", badge: "JS", color: "#fbbf24", bg: "#fbbf2412",
    title: "Async/Await · fetch pipeline",
    code: `const fetchUser = async (id) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(\`/api/users/\${id}\`, {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") console.warn("Timed out");
    throw err;
  } finally {
    clearTimeout(timeout);
  }
};`,
  },
  {
    lang: "typescript", label: "TypeScript", badge: "TS", color: "#60a5fa", bg: "#60a5fa12",
    title: "Generic · Paginated<T>",
    code: `type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

interface Paginated<T> {
  data:     T[];
  total:    number;
  page:     number;
  perPage:  number;
  hasNext:  boolean;
}

async function getPage<T>(
  url: string,
  page = 1
): Promise<Paginated<T>> {
  const res = await fetch(\`\${url}?page=\${page}\`);
  return res.json();
}`,
  },
  {
    lang: "java", label: "Java", badge: "JV", color: "#f87171", bg: "#f8717112",
    title: "Generic Stack · ArrayDeque",
    code: `import java.util.ArrayDeque;
import java.util.EmptyStackException;

public class Stack<T> {
    private final ArrayDeque<T> deque = new ArrayDeque<>();

    public void   push(T item) { deque.push(item); }
    public T      pop()  {
        if (deque.isEmpty()) throw new EmptyStackException();
        return deque.pop();
    }
    public T      peek()       { return deque.peek(); }
    public boolean isEmpty()   { return deque.isEmpty(); }
    public int    size()       { return deque.size(); }
}`,
  },
  {
    lang: "cpp", label: "C++", badge: "C++", color: "#a78bfa", bg: "#a78bfa12",
    title: "Binary Search · iterative",
    code: `#include <vector>
using namespace std;

int binarySearch(const vector<int>& nums, int target) {
    int lo = 0, hi = static_cast<int>(nums.size()) - 1;

    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if      (nums[mid] == target) return mid;
        else if (nums[mid]  < target) lo = mid + 1;
        else                          hi = mid - 1;
    }
    return -1;   // not found
}

// O(log n) time  |  O(1) space`,
  },
  {
    lang: "c", label: "C", badge: "C", color: "#818cf8", bg: "#818cf812",
    title: "Bubble Sort · in-place",
    code: `#include <stdio.h>

void bubbleSort(int *arr, int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp   = arr[j];
                arr[j]    = arr[j + 1];
                arr[j + 1] = tmp;
                swapped   = 1;
            }
        }
        if (!swapped) break;   // already sorted
    }
}`,
  },
  {
    lang: "csharp", label: "C#", badge: "C#", color: "#34d399", bg: "#34d39912",
    title: "LINQ · GroupBy pipeline",
    code: `var students = new List<(string Name, int Grade)> {
    ("Alice", 90), ("Bob", 75),
    ("Carol", 90), ("Dave", 75), ("Eve", 85)
};

var report = students
    .GroupBy(s => s.Grade)
    .OrderByDescending(g => g.Key)
    .Select(g => new {
        Grade = g.Key,
        Count = g.Count(),
        Names = string.Join(", ", g.Select(s => s.Name))
    });

foreach (var r in report)
    Console.WriteLine($"{r.Grade} → {r.Names}");`,
  },
  {
    lang: "rust", label: "Rust", badge: "RS", color: "#fb923c", bg: "#fb923c12",
    title: "Pattern Matching · shapes",
    code: `use std::f64::consts::PI;

enum Shape { Circle(f64), Rect(f64, f64), Triangle(f64,f64,f64) }

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r)         => PI * r * r,
            Shape::Rect(w, h)        => w * h,
            Shape::Triangle(a, b, c) => {
                let s = (a + b + c) / 2.0;
                (s*(s-a)*(s-b)*(s-c)).sqrt()
            }
        }
    }
}

fn main() {
    println!("{:.2}", Shape::Circle(5.0).area()); // 78.54
}`,
  },
  {
    lang: "r", label: "R", badge: "R", color: "#22d3ee", bg: "#22d3ee12",
    title: "Linear Regression · summary",
    code: `set.seed(42)
x <- rnorm(200, mean = 5, sd = 2)
y <- 2.5 * x + rnorm(200, sd = 1.2)

model <- lm(y ~ x)
summary(model)

# Residual diagnostics
par(mfrow = c(2, 2))
plot(model)

# Predictions with 95% CI
nd <- data.frame(x = c(3, 5, 7))
predict(model, newdata = nd, interval = "confidence")`,
  },
  {
    lang: "html", label: "HTML", badge: "HT", color: "#f97316", bg: "#f9731612",
    title: "Semantic Article Layout",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Article page" />
  <title>Article · CodeNFacts</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header role="banner">
    <nav aria-label="Primary">
      <a href="/">Home</a>
      <a href="/blog" aria-current="page">Blog</a>
    </nav>
  </header>
  <main id="main-content">
    <article itemscope itemtype="https://schema.org/Article">
      <h1 itemprop="headline">Semantic HTML</h1>
      <p itemprop="description">Better accessibility and SEO.</p>
    </article>
  </main>
  <footer role="contentinfo"><p>© 2025 CodeNFacts</p></footer>
</body>
</html>`,
  },
  {
    lang: "css", label: "CSS", badge: "CS", color: "#e879f9", bg: "#e879f912",
    title: "Container Queries + Layers",
    code: `@layer base, components, utilities;

@layer base {
  :root {
    --clr-bg:      hsl(220 14% 8%);
    --clr-surface: hsl(220 14% 12%);
    --clr-accent:  hsl(200 100% 55%);
    --radius:      12px;
  }
}

@layer components {
  .card {
    container-type: inline-size;
    border-radius: var(--radius);
    background: var(--clr-surface);
    padding: clamp(1rem, 4cqi, 2rem);
  }

  @container (min-width: 400px) {
    .card { display: grid; grid-template-columns: 1fr 2fr; }
  }
}`,
  },
  {
    lang: "dsa", label: "DSA", badge: "DS", color: "#a3e635", bg: "#a3e63512",
    title: "BFS · shortest path",
    code: `from collections import deque

def bfs_shortest(graph: dict, src: str, dst: str) -> list[str]:
    queue   = deque([[src]])
    visited = {src}

    while queue:
        path = queue.popleft()
        node = path[-1]

        if node == dst:
            return path

        for neighbour in graph.get(node, []):
            if neighbour not in visited:
                visited.add(neighbour)
                queue.append(path + [neighbour])

    return []   # no path

g = {"A":["B","C"],"B":["D"],"C":["D","E"],"D":["F"],"E":["F"],"F":[]}
print(bfs_shortest(g, "A", "F"))  # ['A','C','E','F']`,
  },
  {
    lang: "numpy", label: "NumPy", badge: "NP", color: "#38bdf8", bg: "#38bdf812",
    title: "Broadcasting · eigenvectors",
    code: `import numpy as np

A = np.array([[4., 2.], [1., 3.]])

# Eigenvalues & eigenvectors
vals, vecs = np.linalg.eig(A)
print("λ =", vals)          # [5., 2.]

# Broadcasting: subtract row mean from each row
data = np.random.randn(100, 4)
centred = data - data.mean(axis=0)

# Covariance matrix
cov = np.cov(centred, rowvar=False)
print(cov.shape)            # (4, 4)`,
  },
  {
    lang: "pandas", label: "Pandas", badge: "PD", color: "#818cf8", bg: "#818cf812",
    title: "GroupBy · rolling · merge",
    code: `import pandas as pd

sales = pd.read_csv("sales.csv", parse_dates=["date"])

# Rolling 7-day revenue per product
rolling = (
    sales
    .sort_values("date")
    .groupby("product")["revenue"]
    .transform(lambda s: s.rolling(7, min_periods=1).mean())
)
sales["rolling_7d"] = rolling

# Merge with product catalogue
catalogue = pd.read_csv("products.csv")
merged = sales.merge(catalogue, on="product_id", how="left")
print(merged.head())`,
  },
  {
    lang: "matplotlib", label: "Matplotlib", badge: "MPL", color: "#fb923c", bg: "#fb923c12",
    title: "Subplots · custom style",
    code: `import matplotlib.pyplot as plt
import numpy as np

plt.style.use("dark_background")

x = np.linspace(0, 4 * np.pi, 500)
fig, axes = plt.subplots(1, 3, figsize=(14, 4), tight_layout=True)

axes[0].plot(x, np.sin(x), "#00d4ff", lw=2)
axes[0].fill_between(x, np.sin(x), alpha=.15, color="#00d4ff")
axes[0].set_title("sin(x)")

axes[1].hist(np.random.randn(2000), bins=40,
             color="#fbbf24", edgecolor="none")
axes[1].set_title("Normal dist.")

sc = axes[2].scatter(*np.random.randn(2, 200),
                     c=np.random.rand(200), cmap="plasma", s=18)
fig.colorbar(sc, ax=axes[2])
plt.savefig("chart.png", dpi=180, bbox_inches="tight")`,
  },
  {
    lang: "sql", label: "SQL", badge: "SQL", color: "#34d399", bg: "#34d39912",
    title: "Window · CTE · RANK()",
    code: `WITH dept_stats AS (
    SELECT
        department,
        AVG(salary)         AS avg_salary,
        PERCENTILE_CONT(.5)
            WITHIN GROUP (ORDER BY salary) AS median_salary
    FROM employees
    GROUP BY department
),
ranked AS (
    SELECT
        e.*,
        ds.avg_salary,
        RANK()       OVER (PARTITION BY e.department
                           ORDER BY e.salary DESC) AS dept_rank,
        NTILE(4)     OVER (ORDER BY e.salary)      AS quartile
    FROM employees e
    JOIN dept_stats ds USING (department)
)
SELECT * FROM ranked WHERE dept_rank <= 3;`,
  },
];

const FAQS = [
  { q: "Do I need prior coding experience?", a: "Not at all. Courses are designed from the ground up for beginners. You will start from absolute zero and progress through structured milestones at your own pace." },
  { q: "Can I access courses anytime?", a: "Yes - Till 426 Days access. Once purchased, courses are available 24/7 across all devices. Your progress syncs automatically." },
  { q: "Are real-world projects included?", a: "Projects are the core of every CodeNFacts course - not an afterthought. You will build full-stack apps, APIs, dashboards, and more that belong in your portfolio." },
  { q: "How do certificates work?", a: "Complete all modules and submit your final project to receive a verifiable Certificate of Completion. Share it on LinkedIn, attach it to job applications, or embed it in your portfolio." },
  { q: "Which languages and frameworks are covered?", a: "Python, JavaScript, TypeScript, Java, C, C++, C#, Rust, R, SQL, HTML/CSS, React, Node.js, NumPy, Pandas, Matplotlib, DSA - with new content added regularly." },
  { q: "Is there a refund policy?", a: "Your learning matters more than the sale. Check the Refund Policy below." },
  { q: "Will a mobile app be available?", a: "A native iOS and Android app is on our roadmap for 2027. Currently the web platform is fully responsive and works beautifully on mobile." },
];

const NAV = [
  { id: "intro",        label: "Introduction" },
  { id: "start",        label: "Quick Start" },
  { id: "courses",      label: "Courses" },
  { id: "projects",     label: "Projects" },
  { id: "snippets",     label: "Code Library" },
  { id: "certificates", label: "Certificates" },
  { id: "audience",     label: "For Whom" },
  { id: "philosophy",   label: "Philosophy" },
  { id: "features",     label: "Features" },
  { id: "compare",      label: "Compare" },
  { id: "roadmap",      label: "Roadmap" },
  { id: "faq",          label: "FAQ" },
  { id: "support",      label: "Support" },
];

/* ═══════════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════════ */

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, vis };
}

/* ═══════════════════════════════════════════════════════════════════
   TINY COMPONENTS
═══════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const { ref, vis } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : `translateY(${y}px)`,
      transition: `opacity .75s cubic-bezier(.16,1,.3,1) ${delay}ms,
                   transform .75s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function GlowDot({ color }: { color: string }) {
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: 4,
      background: color, boxShadow: `0 0 10px ${color}`,
      flexShrink: 0,
    }} />
  );
}

function Tag({ children, color = "#00d4ff" }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 11px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, letterSpacing: ".08em",
      background: `${color}18`, color, border: `1px solid ${color}35`,
    }}>{children}</span>
  );
}

function CopyBtn({ code }: { code: string }) {
  const [ok, setOk] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setOk(true); setTimeout(() => setOk(false), 2000);
    });
  }, [code]);
  return (
    <button onClick={copy} style={{
      padding: "5px 14px", borderRadius: 7, cursor: "pointer",
      fontSize: 11, fontWeight: 700, letterSpacing: ".06em",
      background: ok ? "rgba(52,211,153,.15)" : "rgba(255,255,255,.06)",
      color: ok ? "#34d399" : "rgba(255,255,255,.45)",
      border: `1px solid ${ok ? "rgba(52,211,153,.4)" : "rgba(255,255,255,.1)"}`,
      transition: "all .2s", fontFamily: "inherit",
    }}>
      {ok ? "✓ COPIED" : "COPY"}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION LABEL
═══════════════════════════════════════════════════════════════════ */

function SLabel({ n, title, sub }: { n: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, fontWeight: 700, letterSpacing: ".18em",
          color: "#00d4ff", opacity: .7,
        }}>
          {n}
        </span>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,rgba(0,212,255,.3),transparent)" }} />
      </div>
      <h2 style={{
        fontSize: "clamp(1.5rem,3.5vw,2.4rem)", fontWeight: 800, lineHeight: 1.1,
        color: "#f1f5f9", letterSpacing: "-.02em", marginBottom: sub ? 10 : 0,
      }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: "rgba(255,255,255,.4)", lineHeight: 1.7, maxWidth: 560 }}>{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */

export default function DocsPage() {
  const [activeNav, setActiveNav] = useState("intro");
  const [activeLang, setActiveLang] = useState(0);
  const [langSearch, setLangSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* active nav tracking */
  useEffect(() => {
    const onScroll = () => {
      for (const n of [...NAV].reverse()) {
        const el = document.getElementById(n.id);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActiveNav(n.id); break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* cursor glow */
  useEffect(() => {
    const move = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const filtered = SNIPPETS.filter(s =>
    s.lang.includes(langSearch.toLowerCase()) ||
    s.label.toLowerCase().includes(langSearch.toLowerCase()) ||
    s.title.toLowerCase().includes(langSearch.toLowerCase())
  );
  const snippet = filtered[activeLang] ?? filtered[0];

  return (
    <>
      {/* ── global styles scoped to this page ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .cnf-page * { box-sizing: border-box; }
        .cnf-page { font-family: 'Bricolage Grotesque', system-ui, sans-serif; }

        .cnf-page ::-webkit-scrollbar { width: 4px; height: 4px; }
        .cnf-page ::-webkit-scrollbar-track { background: transparent; }
        .cnf-page ::-webkit-scrollbar-thumb { background: rgba(0,212,255,.3); border-radius: 2px; }

        @keyframes cnf-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes cnf-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes cnf-pulse {
          0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0,212,255,.4); }
          50%      { opacity: .7; box-shadow: 0 0 0 8px rgba(0,212,255,0); }
        }
        @keyframes cnf-glitch {
          0%,100% { clip-path: inset(0 0 100% 0); transform: translateX(0); }
          20%  { clip-path: inset(20% 0 60% 0); transform: translateX(-4px); }
          40%  { clip-path: inset(60% 0 20% 0); transform: translateX( 4px); }
          60%  { clip-path: inset(40% 0 40% 0); transform: translateX(-2px); }
          80%  { clip-path: inset(80% 0 5%  0); transform: translateX( 2px); }
        }
        @keyframes cnf-shimmer {
          0%   { background-position: -400% center; }
          100% { background-position:  400% center; }
        }
        @keyframes cnf-scan {
          0%   { top: -5%; opacity: .6; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes cnf-noise {
          0%   { transform: translate(0,0); }
          10%  { transform: translate(-2%,-2%); }
          30%  { transform: translate(2%, 1%); }
          50%  { transform: translate(-1%, 2%); }
          70%  { transform: translate( 1%,-1%); }
          100% { transform: translate(0,0); }
        }
        @keyframes cnf-badge-in {
          from { opacity:0; transform: scale(.7) rotate(-10deg); }
          to   { opacity:1; transform: scale(1)  rotate(0deg); }
        }

        .cnf-shimmer-txt {
          background: linear-gradient(90deg,#00d4ff,#a78bfa,#fbbf24,#f472b6,#00d4ff);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: cnf-shimmer 4s linear infinite;
        }

        .cnf-card {
          transition: transform .35s cubic-bezier(.16,1,.3,1),
                      box-shadow .35s ease, border-color .35s ease;
        }
        .cnf-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 32px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(0,212,255,.15);
        }

        .cnf-nav-item {
          transition: all .2s;
          white-space: nowrap;
        }
        .cnf-nav-item:hover { color: #f1f5f9 !important; }

        .cnf-glass {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }

        .cnf-tab { transition: all .2s ease; white-space: nowrap; }
        .cnf-tab:hover { background: rgba(255,255,255,.07) !important; }

        .cnf-faq-row { transition: border-color .25s, background .25s; }
        .cnf-faq-row:hover { border-color: rgba(0,212,255,.25) !important; }

        .cnf-btn-primary {
          background: linear-gradient(135deg,#0ea5e9,#6366f1);
          box-shadow: 0 8px 32px rgba(14,165,233,.35);
          transition: transform .2s, box-shadow .2s;
        }
        .cnf-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(14,165,233,.5);
        }

        .cnf-orb {
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        @media (max-width: 900px) {
          .cnf-sidebar { display: none !important; }
          .cnf-layout  { grid-template-columns: 1fr !important; }
          .cnf-main    { padding-left: 0 !important; max-width: 100% !important; }
        }
        @media (max-width: 600px) {
          .cnf-stats { grid-template-columns: 1fr 1fr !important; }
          .cnf-feat  { grid-template-columns: 1fr !important; }
          .cnf-princ { grid-template-columns: 1fr !important; }
          .cnf-proj  { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="cnf-page" style={{
        background: "#040810",
        color: "#c8d6e5",
        minHeight: "100vh",
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
      }}>

        {/* ── cursor glow ── */}
        <div style={{
          position: "fixed", width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(0,212,255,.04) 0%,transparent 70%)",
          left: mousePos.x - 240, top: mousePos.y - 240,
          pointerEvents: "none", zIndex: 0, transition: "left .1s,top .1s",
        }} />

        {/* ── ambient orbs ── */}
        <div className="cnf-orb" style={{
          position: "fixed", width: "70vw", height: "70vw",
          background: "rgba(99,102,241,.055)",
          top: "-20%", left: "-20%", zIndex: 0,
        }} />
        <div className="cnf-orb" style={{
          position: "fixed", width: "55vw", height: "55vw",
          background: "rgba(0,212,255,.045)",
          bottom: "0", right: "-15%", zIndex: 0,
        }} />
        <div className="cnf-orb" style={{
          position: "fixed", width: "30vw", height: "30vw",
          background: "rgba(251,191,36,.03)",
          top: "40%", left: "40%", zIndex: 0,
        }} />

        {/* ── grid texture ── */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(0,212,255,.03) 1px,transparent 1px),
            linear-gradient(90deg,rgba(0,212,255,.03) 1px,transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)",
        }} />

        {/* ── scanline ── */}
        <div style={{
          position: "fixed", left: 0, right: 0, height: "2px", zIndex: 0, pointerEvents: "none",
          background: "linear-gradient(90deg,transparent,rgba(0,212,255,.12),transparent)",
          animation: "cnf-scan 8s linear infinite",
        }} />

        {/* ════════════════ LAYOUT ════════════════ */}
        <div className="cnf-layout" style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          maxWidth: 1360,
          margin: "0 auto",
          padding: "0 20px",
          position: "relative",
          zIndex: 1,
        }}>

          {/* ── SIDEBAR ── */}
          <aside className="cnf-sidebar cnf-glass" style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
            borderRight: "1px solid rgba(255,255,255,.05)",
            padding: "32px 0 32px 0",
            scrollbarWidth: "none",
          }}>
            {/* logo block */}
            <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(255,255,255,.05)", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: ".1em", textTransform: "uppercase" }}>Docs v2.0</div>
                </div>
              </div>
            </div>

            {/* nav */}
            <div style={{ padding: "0 12px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", color: "rgba(255,255,255,.25)", marginBottom: 8, paddingLeft: 8, textTransform: "uppercase" }}>
                On this page
              </p>
              {NAV.map(n => {
                const active = activeNav === n.id;
                return (
                  <a key={n.id} href={`#${n.id}`}
                    className="cnf-nav-item"
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "7px 10px", borderRadius: 8, marginBottom: 1,
                      fontSize: 12.5, fontWeight: active ? 700 : 400,
                      color: active ? "#00d4ff" : "rgba(255,255,255,.38)",
                      background: active ? "rgba(0,212,255,.08)" : "transparent",
                      borderLeft: `2px solid ${active ? "#00d4ff" : "transparent"}`,
                      textDecoration: "none", transition: "all .2s",
                    }}
                  >
                    {active && <div style={{ width: 4, height: 4, borderRadius: 2, background: "#00d4ff", animation: "cnf-pulse 2s infinite", flexShrink: 0 }} />}
                    {n.label}
                  </a>
                );
              })}
            </div>

            {/* sidebar cta */}
            <div style={{ margin: "28px 12px 0", padding: 16, borderRadius: 12, background: "linear-gradient(135deg,rgba(14,165,233,.12),rgba(99,102,241,.1))", border: "1px solid rgba(14,165,233,.2)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#0ea5e9", letterSpacing: ".08em", marginBottom: 6, textTransform: "uppercase" }}>Start Today</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", lineHeight: 1.6, marginBottom: 12 }}>Join 10,000+ learners building real skills.</p>
            </div>
          </aside>

          {/* ── MAIN ── */}
          <main className="cnf-main" style={{ padding: "64px 0 160px 56px", maxWidth: 900 }}>

            {/* ══════════════ §1 HERO ══════════════ */}
            <section id="intro" style={{ marginBottom: 120 }}>
              <Reveal>
                <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                  <Tag color="#00d4ff">Documentation</Tag>
                  <Tag color="#a78bfa">v2.0</Tag>
                  <Tag color="#fbbf24">Updated 2026</Tag>
                </div>

                {/* Hero headline */}
                <div style={{ position: "relative", marginBottom: 28 }}>
                  <div style={{
                    position: "absolute", top: -20, left: -10,
                    width: 160, height: 160, borderRadius: "50%",
                    background: "radial-gradient(circle,rgba(0,212,255,.12) 0%,transparent 70%)",
                    pointerEvents: "none",
                  }} />
                  <h1 style={{
                    fontSize: "clamp(2.2rem,5.5vw,4rem)", fontWeight: 800, lineHeight: 1.05,
                    letterSpacing: "-.03em", color: "#f1f5f9",
                    position: "relative",
                  }}>
                    Build Real Skills.<br />
                    <span className="cnf-shimmer-txt">Ship Real Code.</span>
                  </h1>
                </div>

                <p style={{
                  fontSize: "clamp(.95rem,2vw,1.15rem)", lineHeight: 1.85,
                  color: "rgba(255,255,255,.5)", maxWidth: 580, marginBottom: 36,
                }}>
                  CodeNFacts is a modern learning platform designed to help students, developers, and tech
                  enthusiasts build{" "}
                  <strong style={{ color: "rgba(255,255,255,.8)", fontWeight: 600 }}>industry-ready coding skills</strong>
                  {" "}through real-world projects - not passive theory.
                  <p>.</p>
                  <p>.</p>


                  <p>NB: If u visit this page throgh mobile,</p>
                  <p>Please see in "Desktop Mode" for a better view..</p>
                
                </p>

                {/* CTA buttons */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 64 }}>
                  <a href="#start" className="cnf-btn-primary" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "13px 28px", borderRadius: 10, color: "#fff",
                    fontWeight: 700, fontSize: 14, textDecoration: "none", letterSpacing: ".02em",
                  }}>
                    Quick Start Guide <span style={{ opacity: .8 }}>→</span>
                  </a>
                  <a href="#snippets" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "13px 28px", borderRadius: 10, color: "rgba(255,255,255,.7)",
                    fontWeight: 600, fontSize: 14, textDecoration: "none",
                    background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
                    transition: "all .2s",
                  }}>
                    Explore Code Library
                  </a>
                </div>

                {/* Stats */}
                <div className="cnf-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                  {[
                    { v: "9+",  l: "Courses",        c: "#00d4ff" },
                    { v: "16+",  l: "Languages",      c: "#a78bfa" },
                    { v: "10K+", l: "Learners",       c: "#fbbf24" },
                    { v: "100%", l: "Project-Based",  c: "#34d399" },
                  ].map((s, i) => (
                    <Reveal key={s.l} delay={i * 80}>
                      <div className="cnf-card cnf-glass" style={{
                        padding: "22px 18px", borderRadius: 16, textAlign: "center",
                        border: "1px solid rgba(255,255,255,.06)",
                        background: "rgba(255,255,255,.02)",
                        position: "relative", overflow: "hidden",
                      }}>
                        <div style={{
                          position: "absolute", top: 0, left: 0, right: 0, height: 2,
                          background: `linear-gradient(90deg,transparent,${s.c},transparent)`,
                          opacity: .7,
                        }} />
                        <div style={{ fontSize: "1.8rem", fontWeight: 800, color: s.c, marginBottom: 4, letterSpacing: "-.02em" }}>{s.v}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>{s.l}</div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* ══════════════ §2 QUICK START ══════════════ */}
            <section id="start" style={{ marginBottom: 100 }}>
              <Reveal>
                <SLabel n="§ 01" title="Quick Start" sub="Go from zero to building in four steps. No fluff." />
                <div style={{ position: "relative" }}>
                  {/* vertical line */}
                  <div style={{
                    position: "absolute", left: 19, top: 20, bottom: 20,
                    width: 1,
                    background: "linear-gradient(to bottom,rgba(0,212,255,.5),rgba(99,102,241,.3),transparent)",
                  }} />
                  {[
                    { n: "01", title: "Create Your Account", desc: "Sign up with your email to access your personal dashboard, course library, progress tracking, and certificates.", color: "#00d4ff" },
                    { n: "02", title: "Choose a Learning Path", desc: "Browse curated paths: Web Dev, Data Science, DSA, Systems Programming, or ML - each mapped to real industry roles.", color: "#a78bfa" },
                    { n: "03", title: "Learn & Build Together", desc: "Follow structured video modules, code along with interactive snippets, and complete real-world projects after each phase.", color: "#fbbf24" },
                    { n: "04", title: "Earn & Share Your Certificate", desc: "Complete the course, receive a verifiable certificate, and post it to LinkedIn, your portfolio, or job applications.", color: "#34d399" },
                  ].map((s, i) => (
                    <Reveal key={s.n} delay={i * 100}>
                      <div style={{ display: "flex", gap: 28, marginBottom: 28, paddingLeft: 0 }}>
                        {/* dot */}
                        <div style={{ flexShrink: 0, width: 40, display: "flex", justifyContent: "center" }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: `${s.color}18`, border: `1px solid ${s.color}40`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
                            fontWeight: 700, color: s.color, letterSpacing: ".06em",
                          }}>{s.n}</div>
                        </div>
                        <div className="cnf-card cnf-glass" style={{
                          flex: 1, padding: "22px 24px", borderRadius: 14,
                          border: "1px solid rgba(255,255,255,.06)",
                          background: "rgba(255,255,255,.02)",
                        }}>
                          <h3 style={{ fontWeight: 700, fontSize: 16, color: "#f1f5f9", marginBottom: 8 }}>{s.title}</h3>
                          <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", lineHeight: 1.7 }}>{s.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* ══════════════ §3 COURSES ══════════════ */}
            <section id="courses" style={{ marginBottom: 100 }}>
              <Reveal>
                <SLabel n="§ 02" title="How Courses Work" sub="Structured, progressive, and ruthlessly practical." />
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", marginBottom: 28 }}>
                  {[
                    { icon: "◉", label: "Structured Modules",     c: "#00d4ff" },
                    { icon: "▶", label: "Video Explanations",      c: "#a78bfa" },
                    { icon: "</> ", label: "Code-Along Examples",  c: "#fbbf24" },
                    { icon: "⬢", label: "Hands-on Projects",       c: "#34d399" },
                    { icon: "⌛", label: "Self-paced Learning",     c: "#f472b6" },
                    { icon: "📈", label: "Progress Tracking",       c: "#fb923c" },
                  ].map(f => (
                    <div key={f.label} className="cnf-card" style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "16px 18px", borderRadius: 12,
                      border: "1px solid rgba(255,255,255,.06)",
                      background: "rgba(255,255,255,.025)",
                    }}>
                      <span style={{ fontSize: 18, color: f.c }}>{f.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.75)" }}>{f.label}</span>
                    </div>
                  ))}
                </div>
                {/* course track visual */}
                <div style={{ padding: "28px 32px", borderRadius: 16, background: "rgba(0,212,255,.04)", border: "1px solid rgba(0,212,255,.12)", overflow: "hidden", position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: "radial-gradient(circle,rgba(0,212,255,.08) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#00d4ff", letterSpacing: ".1em", marginBottom: 12 }}>COURSE PROGRESSION</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
                    {["Foundations","Core Concepts","Applied Projects","Advanced Topics","Capstone"].map((step, i, arr) => (
                      <div key={step} style={{ display: "flex", alignItems: "center" }}>
                        <div style={{
                          padding: "8px 16px", borderRadius: 20,
                          background: i === 0 ? "rgba(0,212,255,.2)" : "rgba(255,255,255,.04)",
                          border: `1px solid ${i === 0 ? "rgba(0,212,255,.5)" : "rgba(255,255,255,.08)"}`,
                          fontSize: 12, fontWeight: 600,
                          color: i === 0 ? "#00d4ff" : "rgba(255,255,255,.45)",
                        }}>{step}</div>
                        {i < arr.length - 1 && <div style={{ width: 24, height: 1, background: "rgba(255,255,255,.15)", flexShrink: 0 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </section>

            {/* ══════════════ §4 PROJECTS ══════════════ */}
            <section id="projects" style={{ marginBottom: 100 }}>
              <Reveal>
                <SLabel n="§ 03" title="Real-World Projects" />
                {/* quote */}
                <div style={{
                  padding: "24px 32px", borderRadius: 14, marginBottom: 32,
                  background: "linear-gradient(135deg,rgba(99,102,241,.1),rgba(0,212,255,.06))",
                  border: "1px solid rgba(99,102,241,.25)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(to bottom,#6366f1,#00d4ff)" }} />
                  <p style={{ fontSize: "1.05rem", fontStyle: "italic", color: "rgba(255,255,255,.7)", lineHeight: 1.6 }}>
                    "Projects are the bridge between learning and getting hired."
                  </p>
                </div>
                <div className="cnf-proj" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                  {[
                    { title: "Full-Stack Web App",     tag: "React · Node · PostgreSQL", c: "#00d4ff" },
                    { title: "Authentication System",  tag: "JWT · OAuth 2.0 · bcrypt",  c: "#a78bfa" },
                    { title: "Analytics Dashboard",    tag: "Charts · REST API · UI",    c: "#fbbf24" },
                    { title: "REST & GraphQL APIs",    tag: "Express · Prisma · types",  c: "#34d399" },
                    { title: "SaaS Platform",          tag: "Stripe · Auth · DB",        c: "#f472b6" },
                    { title: "ML Pipeline",            tag: "Python · Pandas · sklearn", c: "#fb923c" },
                  ].map(p => (
                    <div key={p.title} className="cnf-card cnf-glass" style={{
                      padding: "22px 20px", borderRadius: 14,
                      border: `1px solid ${p.c}18`,
                      background: `${p.c}06`,
                      position: "relative", overflow: "hidden",
                    }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${p.c}60,transparent)` }} />
                      <div style={{ width: 6, height: 6, borderRadius: 3, background: p.c, boxShadow: `0 0 12px ${p.c}`, marginBottom: 14 }} />
                      <h4 style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9", marginBottom: 8 }}>{p.title}</h4>
                      <span style={{ fontSize: 11, color: p.c, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{p.tag}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* ══════════════ §5 CODE LIBRARY ══════════════ */}
            <section id="snippets" style={{ marginBottom: 100 }}>
              <Reveal>
                <SLabel n="§ 04" title="Interactive Code Library" sub="Copy-ready snippets across 16+ languages. Search, browse, and steal freely." />

                {/* search */}
                <div style={{ position: "relative", marginBottom: 18 }}>
                  <span style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                    color: "rgba(255,255,255,.3)", fontSize: 15, pointerEvents: "none",
                  }}>⌕</span>
                  <input
                    value={langSearch}
                    onChange={e => { setLangSearch(e.target.value); setActiveLang(0); }}
                    placeholder="Search language, framework, or topic…"
                    style={{
                      width: "100%", padding: "11px 16px 11px 38px",
                      borderRadius: 10, outline: "none",
                      background: "rgba(255,255,255,.04)",
                      border: "1px solid rgba(255,255,255,.09)",
                      color: "#f1f5f9", fontSize: 14,
                      fontFamily: "inherit",
                      transition: "border-color .2s",
                    }}
                  />
                </div>

                {/* language tabs */}
                <div style={{
                  display: "flex", gap: 6, overflowX: "auto",
                  paddingBottom: 14, marginBottom: 18,
                  scrollbarWidth: "none",
                }}>
                  {filtered.map((s, i) => (
                    <button
                      key={s.lang}
                      className="cnf-tab"
                      onClick={() => setActiveLang(i)}
                      style={{
                        padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                        border: `1px solid ${i === activeLang ? s.color : "rgba(255,255,255,.08)"}`,
                        background: i === activeLang ? `${s.color}20` : "transparent",
                        color: i === activeLang ? s.color : "rgba(255,255,255,.35)",
                        fontSize: 12, fontWeight: 700, fontFamily: "inherit",
                        letterSpacing: ".04em",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* code panel */}
                {snippet && (
                  <Reveal y={20}>
                    <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)", boxShadow: "0 32px 80px rgba(0,0,0,.5)" }}>
                      {/* bar */}
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "13px 20px",
                        background: "rgba(255,255,255,.03)",
                        borderBottom: "1px solid rgba(255,255,255,.06)",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ display: "flex", gap: 7 }}>
                            {["#ff5f57","#febc2e","#28c840"].map(c => (
                              <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
                            ))}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{
                              padding: "2px 9px", borderRadius: 5, fontSize: 11,
                              background: `${snippet.color}20`, color: snippet.color,
                              fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
                            }}>{snippet.badge}</span>
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)", fontFamily: "'JetBrains Mono',monospace" }}>{snippet.title}</span>
                          </div>
                        </div>
                        <CopyBtn code={snippet.code} />
                      </div>
                      {/* code */}
                      <div style={{ background: "#060b14", padding: "28px 28px", overflowX: "auto", position: "relative" }}>
                        {/* line numbers gutter */}
                        <div style={{ display: "flex", gap: 20 }}>
                          <div style={{ display: "flex", flexDirection: "column", userSelect: "none", pointerEvents: "none" }}>
                            {snippet.code.split("\n").map((_, i) => (
                              <span key={i} style={{
                                fontSize: 12, lineHeight: "1.7", fontFamily: "'JetBrains Mono',monospace",
                                color: "rgba(255,255,255,.12)", textAlign: "right", minWidth: 20,
                              }}>{i + 1}</span>
                            ))}
                          </div>
                          <pre style={{ margin: 0, flex: 1 }}>
                            <code style={{
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: 13, lineHeight: 1.7, color: "#e2e8f0",
                            }}>{snippet.code}</code>
                          </pre>
                        </div>
                        {/* bottom accent */}
                        <div style={{
                          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                          background: `linear-gradient(90deg,transparent,${snippet.color}50,transparent)`,
                        }} />
                      </div>
                    </div>
                  </Reveal>
                )}

                {filtered.length === 0 && (
                  <div style={{ textAlign: "center", padding: 48, color: "rgba(255,255,255,.25)", fontSize: 14 }}>
                    No snippets match <em>"{langSearch}"</em>
                  </div>
                )}
              </Reveal>
            </section>

            {/* ══════════════ §6 CERTIFICATES ══════════════ */}
            <section id="certificates" style={{ marginBottom: 100 }}>
              <Reveal>
                <SLabel n="§ 05" title="Certificates" sub="A verified credential that employers actually recognise." />
                {/* certificate mock */}
                <div style={{ position: "relative", marginBottom: 32 }}>
                  <div style={{ animation: "cnf-float 5s ease-in-out infinite" }}>
                    <div style={{
                      padding: "40px 48px", borderRadius: 20,
                      background: "linear-gradient(135deg,#0a1628,#0d1f3c)",
                      border: "1px solid rgba(0,212,255,.2)",
                      boxShadow: "0 40px 100px rgba(0,0,0,.6), 0 0 0 1px rgba(0,212,255,.08)",
                      position: "relative", overflow: "hidden",
                      maxWidth: 560,
                    }}>
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(0,212,255,.04) 0%,transparent 60%)", pointerEvents: "none" }} />
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#00d4ff,#6366f1,transparent)" }} />
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: ".2em", color: "#00d4ff", marginBottom: 16, textTransform: "uppercase" }}>
                        CodeNFacts · Certificate of Completion
                      </div>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f1f5f9", marginBottom: 6 }}>Full-Stack Web Development</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginBottom: 24 }}>Awarded to <strong style={{ color: "rgba(255,255,255,.75)" }}>Your Name</strong></div>
                      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#0ea5e9,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff" }}>C</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.6)" }}>CodeNFacts</div>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "rgba(255,255,255,.25)" }}>CERT-2026-FSWEB-0042</div>
                        </div>
                        <div style={{ marginLeft: "auto", textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>Date</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.55)" }}>Mar 2025</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                  {[
                    { icon: "✓", label: "Completed curriculum",          c: "#34d399" },
                    { icon: "✓", label: "Built practical projects",       c: "#34d399" },
                    { icon: "✓", label: "Industry-relevant concepts",     c: "#34d399" },
                    { icon: "→", label: "Share on LinkedIn",              c: "#00d4ff" },
                    { icon: "→", label: "Add to portfolio",               c: "#00d4ff" },
                    { icon: "→", label: "Attach to job applications",     c: "#00d4ff" },
                  ].map(i => (
                    <div key={i.label} style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.05)" }}>
                      <GlowDot color={i.c} />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 500 }}>{i.label}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* ══════════════ §7 AUDIENCE ══════════════ */}
            <section id="audience" style={{ marginBottom: 100 }}>
              <Reveal>
                <SLabel n="§ 06" title="Who Should Join" sub="CodeNFacts is built for anyone serious about tech." />
                <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
                  {[
                    { emoji: "🌱", title: "Beginners",        desc: "Zero experience? Perfect. We start from syntax and move to real apps.", c: "#34d399" },
                    { emoji: "🎓", title: "Students",          desc: "Preparing for internships, placements, and tech careers.", c: "#00d4ff" },
                    { emoji: "⚙️", title: "Working Devs",     desc: "Add frameworks, languages, or data-science skills to your stack.", c: "#a78bfa" },
                    { emoji: "📦", title: "Self-taught",       desc: "Fill gaps, build a portfolio, and get job-ready.", c: "#fbbf24" },
                    { emoji: "🚀", title: "Career Switchers", desc: "Transitioning from non-tech? We make it systematic.", c: "#f472b6" },
                    { emoji: "💡", title: "Enthusiasts",       desc: "You love building things. So do we.", c: "#fb923c" },
                  ].map(a => (
                    <div key={a.title} className="cnf-card cnf-glass" style={{
                      padding: "24px 22px", borderRadius: 14,
                      border: "1px solid rgba(255,255,255,.06)",
                      background: "rgba(255,255,255,.02)",
                    }}>
                      <div style={{ fontSize: 30, marginBottom: 12 }}>{a.emoji}</div>
                      <h4 style={{ fontWeight: 700, fontSize: 15, color: a.c, marginBottom: 8 }}>{a.title}</h4>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", lineHeight: 1.7 }}>{a.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* ══════════════ §8 PHILOSOPHY ══════════════ */}
            <section id="philosophy" style={{ marginBottom: 100 }}>
              <Reveal>
                <SLabel n="§ 07" title="Learning Philosophy" />
                <div className="cnf-princ" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                  {[
                    { n: "I",   title: "Learn by Building",      desc: "The best way to master programming is to build real things - not read endless tutorials.", c: "#00d4ff" },
                    { n: "II",  title: "Practical Knowledge",    desc: "We only teach concepts used in real companies and real production environments.", c: "#a78bfa" },
                    { n: "III", title: "Industry Readiness",     desc: "Every course is structured to make you hirable - with a portfolio that proves it.", c: "#fbbf24" },
                  ].map(p => (
                    <div key={p.n} className="cnf-card" style={{
                      padding: "28px 24px", borderRadius: 16,
                      border: `1px solid ${p.c}20`,
                      background: `${p.c}06`,
                      position: "relative", overflow: "hidden",
                    }}>
                      <div style={{ position: "absolute", bottom: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `${p.c}08` }} />
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 800, color: `${p.c}30`, marginBottom: 12, letterSpacing: "-.04em" }}>
                        {p.n}
                      </div>
                      <h3 style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9", marginBottom: 10 }}>{p.title}</h3>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", lineHeight: 1.7 }}>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* ══════════════ §9 FEATURES ══════════════ */}
            <section id="features" style={{ marginBottom: 100 }}>
              <Reveal>
                <SLabel n="§ 08" title="Platform Features" sub="Everything you need to learn, track, and prove your skills." />
                <div className="cnf-feat" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
                  {[
                    { icon: "◉",   title: "Smart Dashboard",           desc: "A clean, distraction-free hub. See everything - courses, progress, certs - at a glance.", c: "#00d4ff" },
                    { icon: "◈",   title: "Structured Modules",         desc: "Bite-sized lessons organised logically so you always know what comes next.", c: "#a78bfa" },
                    { icon: "🔒",  title: "Secure Auth",                desc: "Industry-standard security - your account, purchases, and learning data are safe.", c: "#34d399" },
                    { icon: "📈",  title: "Progress Tracking",           desc: "Visual learning streak, lesson completion, and overall course progress at a glance.", c: "#fbbf24" },
                    { icon: "</> ", title: "16+ Code Languages",        desc: "Copy-ready snippets covering Python, JS, Java, Rust, SQL, NumPy, and more.", c: "#f472b6" },
                    { icon: "❋",   title: "Verified Certificates",      desc: "Shareable, verifiable certificates issued after every course completion.", c: "#fb923c" },
                    { icon: "⬢",   title: "Real-World Projects",        desc: "Every course culminates in a deployable project you can add to your portfolio.", c: "#0ea5e9" },
                    { icon: "🤖",  title: "AI Assistant (coming soon)", desc: "An in-browser AI that reviews your code, explains errors, and suggests improvements.", c: "#84cc16" },
                  ].map(f => (
                    <div key={f.title} className="cnf-card cnf-glass" style={{
                      display: "flex", gap: 16, alignItems: "flex-start",
                      padding: "20px 22px", borderRadius: 14,
                      border: "1px solid rgba(255,255,255,.06)",
                      background: "rgba(255,255,255,.02)",
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: `${f.c}15`, border: `1px solid ${f.c}25`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, color: f.c,
                      }}>{f.icon}</div>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9", marginBottom: 5 }}>{f.title}</h4>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,.38)", lineHeight: 1.6 }}>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* ══════════════ §10 COMPARE ══════════════ */}
            <section id="compare" style={{ marginBottom: 100 }}>
              <Reveal>
                <SLabel n="§ 09" title="Why CodeNFacts?" sub="See how we stack up against traditional learning approaches." />
                <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)" }}>
                  {/* header row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(255,255,255,.03)" }}>
                    <div style={{ padding: "16px 20px", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.3)", letterSpacing: ".08em", textTransform: "uppercase" }}>Feature</div>
                    <div style={{ padding: "16px 20px", fontSize: 12, fontWeight: 700, color: "#00d4ff", letterSpacing: ".08em", textTransform: "uppercase", borderLeft: "1px solid rgba(255,255,255,.06)", background: "rgba(0,212,255,.05)" }}>
                      CodeNFacts ✦
                    </div>
                    <div style={{ padding: "16px 20px", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.3)", letterSpacing: ".08em", textTransform: "uppercase", borderLeft: "1px solid rgba(255,255,255,.06)" }}>
                      Traditional
                    </div>
                  </div>
                  {[
                    ["Project-focused learning",   "✓ Every course",       "✗ Theory only"],
                    ["Real-world use cases",        "✓ Industry workflows", "✗ Toy examples"],
                    ["Verifiable certificates",     "✓ Shareable link",     "~ PDF only"],
                    ["16+ code languages",          "✓ + copy snippets",    "✗ Limited"],
                    ["AI coding assistant",         "✓ Coming Q3 2027",     "✗ None"],
                    ["Community & peer review",     "✓ Roadmap Q1 2026",    "~ Forums only"],
                    ["Mobile app",                  "✓ Roadmap 2026",       "~ Web only"],
                    ["Lifetime access",             "✓ 426 DAYs Access",             "~ Subscription"],
                  ].map(([feat, us, them], i) => (
                    <div key={feat} style={{
                      display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                      borderTop: "1px solid rgba(255,255,255,.05)",
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.01)",
                    }}>
                      <div style={{ padding: "14px 20px", fontSize: 13, color: "rgba(255,255,255,.55)" }}>{feat}</div>
                      <div style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "#34d399", borderLeft: "1px solid rgba(255,255,255,.05)", background: "rgba(0,212,255,.025)" }}>{us}</div>
                      <div style={{ padding: "14px 20px", fontSize: 13, color: "rgba(255,255,255,.3)", borderLeft: "1px solid rgba(255,255,255,.05)" }}>{them}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* ══════════════ §11 ROADMAP ══════════════ */}
            <section id="roadmap" style={{ marginBottom: 100 }}>
              <Reveal>
                <SLabel n="§ 10" title="Product Roadmap" sub="Where we're going - and what's already here." />
                <div style={{ position: "relative", paddingLeft: 32 }}>
                  <div style={{ position: "absolute", left: 10, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom,#00d4ff,#6366f1,#fbbf24,transparent)" }} />
                  {[
                    { date: "Now Live",   title: "Core Platform",              desc: "Dashboard, courses, real-world projects, certificates, 16+ code languages.", c: "#34d399", status: "live" },
                    { date: "Q3 ",    title: "Advanced Course Library",    desc: "System design, cloud (AWS/GCP), DevOps, Docker, and ML specialisations.", c: "#00d4ff", status: "progress" },
                    { date: "Q4 ",    title: "AI Coding Assistant",        desc: "In-browser AI that reviews code, explains errors, and suggests improvements in real time.", c: "#a78bfa", status: "planned" },
                    { date: "Q1 ",    title: "Community & Peer Review",   desc: "Discussion threads, live code reviews, leaderboards, and study groups.", c: "#fbbf24", status: "planned" },
                    { date: "Q2 ",    title: "Mobile App",                 desc: "Native iOS and Android for learning on the go with offline support.", c: "#f472b6", status: "planned" },
                    { date: "2026+",      title: "Industry Collaboration",    desc: "Partner projects, hiring pipelines, and sponsored coding challenges.", c: "#fb923c", status: "future" },
                  ].map((item, i) => (
                    <Reveal key={item.title} delay={i * 80}>
                      <div style={{ display: "flex", gap: 20, marginBottom: 28, position: "relative" }}>
                        {/* dot */}
                        <div style={{
                          position: "absolute", left: -28, top: 8,
                          width: 16, height: 16, borderRadius: 8,
                          background: item.status === "live" ? item.c : "#040810",
                          border: `2px solid ${item.c}`,
                          boxShadow: item.status === "live" ? `0 0 16px ${item.c}` : "none",
                        }} />
                        <div className="cnf-card cnf-glass" style={{
                          flex: 1, padding: "22px 24px", borderRadius: 14,
                          border: `1px solid ${item.c}18`,
                          background: `${item.c}04`,
                        }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: item.c, fontWeight: 700 }}>{item.date}</span>
                            <span style={{
                              fontSize: 10, padding: "2px 9px", borderRadius: 4, fontWeight: 700, letterSpacing: ".06em",
                              textTransform: "uppercase",
                              background: item.status === "live" ? "rgba(52,211,153,.15)" : item.status === "progress" ? "rgba(0,212,255,.15)" : "rgba(255,255,255,.05)",
                              color: item.status === "live" ? "#34d399" : item.status === "progress" ? "#00d4ff" : "rgba(255,255,255,.3)",
                            }}>{item.status}</span>
                          </div>
                          <h4 style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9", marginBottom: 6 }}>{item.title}</h4>
                          <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", lineHeight: 1.7 }}>{item.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* ══════════════ §12 FAQ ══════════════ */}
            <section id="faq" style={{ marginBottom: 100 }}>
              <Reveal>
                <SLabel n="§ 11" title="Frequently Asked Questions" />
                <div style={{ display: "grid", gap: 8 }}>
                  {FAQS.map((item, i) => (
                    <div
                      key={i}
                      className="cnf-faq-row"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{
                        borderRadius: 12, cursor: "pointer",
                        border: `1px solid ${openFaq === i ? "rgba(0,212,255,.3)" : "rgba(255,255,255,.07)"}`,
                        background: openFaq === i ? "rgba(0,212,255,.04)" : "rgba(255,255,255,.02)",
                        overflow: "hidden", transition: "all .25s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", gap: 16 }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: openFaq === i ? "#f1f5f9" : "rgba(255,255,255,.65)" }}>{item.q}</span>
                        <span style={{
                          color: "#00d4ff", fontSize: 20, fontWeight: 200, flexShrink: 0,
                          transition: "transform .3s cubic-bezier(.16,1,.3,1)",
                          transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                          display: "inline-block",
                        }}>+</span>
                      </div>
                      {openFaq === i && (
                        <div style={{ padding: "0 22px 20px", fontSize: 14, color: "rgba(255,255,255,.45)", lineHeight: 1.75 }}>
                          {item.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* ══════════════ §13 SUPPORT ══════════════ */}
            <section id="support" style={{ marginBottom: 100 }}>
              <Reveal>
                <SLabel n="§ 12" title="Support & Community" sub="We're committed to helping every learner succeed." />
                <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", marginBottom: 24 }}>
                  {[
                    { icon: "◉", title: "Course Queries",      desc: "Need help understanding a concept or project? Our team is ready.", c: "#00d4ff" },
                    { icon: "⚙", title: "Technical Issues",    desc: "Platform bug or access problem? We resolve it fast.", c: "#a78bfa" },
                    { icon: "◈", title: "Account Support",     desc: "Billing, certificate access, or account questions covered.", c: "#34d399" },
                  ].map(s => (
                    <div key={s.title} className="cnf-card cnf-glass" style={{
                      padding: "24px 22px", borderRadius: 14,
                      border: `1px solid ${s.c}18`,
                      background: `${s.c}04`,
                    }}>
                      <div style={{ fontSize: 22, color: s.c, marginBottom: 12 }}>{s.icon}</div>
                      <h4 style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9", marginBottom: 8 }}>{s.title}</h4>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", lineHeight: 1.7 }}>{s.desc}</p>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "20px 24px", borderRadius: 12, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,.4)" }}>📧 Reach us at</span>
                  <a href="mailto:support@codenfacts.in" style={{
                    color: "#00d4ff", fontWeight: 700, fontSize: 14,
                    textDecoration: "none", fontFamily: "'JetBrains Mono',monospace",
                  }}>support@codenfacts.in</a>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,.25)", background: "rgba(52,211,153,.1)", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(52,211,153,.2)", color: "#34d399" }}>
                    ← Reply within 24 hrs
                  </span>
                </div>
              </Reveal>
            </section>

            {/* ══════════════ BOTTOM CTA ══════════════ */}
            <Reveal>
              <div style={{
                padding: "60px 48px", borderRadius: 24, textAlign: "center",
                background: "linear-gradient(135deg,rgba(14,165,233,.1) 0%,rgba(99,102,241,.12) 50%,rgba(251,191,36,.06) 100%)",
                border: "1px solid rgba(14,165,233,.2)",
                position: "relative", overflow: "hidden",
              }}>
                {/* top line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#0ea5e9,#6366f1,transparent)" }} />
                {/* glow */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 200, background: "radial-gradient(ellipse,rgba(14,165,233,.08) 0%,transparent 70%)", pointerEvents: "none" }} />

                <Tag color="#00d4ff">Start Free</Tag>
                <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 800, color: "#f1f5f9", margin: "16px 0 12px", letterSpacing: "-.02em" }}>
                  Ready to build your future?
                </h2>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,.4)", marginBottom: 36, maxWidth: 420, margin: "0 auto 36px" }}>
                  Join thousands of learners already transforming their careers on CodeNFacts.
                </p>
                <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                  <a href="https://codenfacts.in/courses" style={{
                    padding: "15px 32px", borderRadius: 12,
                    border: "1px solid rgba(255,255,255,.12)",
                    background: "rgba(255,255,255,.04)",
                    color: "rgba(255,255,255,.7)", fontWeight: 600, fontSize: 15,
                    textDecoration: "none", transition: "all .2s",
                  }}>
                    Browse Courses
                  </a>
                </div>
              </div>
            </Reveal>

          </main>
        </div>
      </div>
    </>
  );
}