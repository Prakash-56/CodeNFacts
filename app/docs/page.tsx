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
    return -1;
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
        if (!swapped) break;
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

par(mfrow = c(2, 2))
plot(model)

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
  <footer><p>© 2025 CodeNFacts</p></footer>
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

    return []

g = {"A":["B","C"],"B":["D"],"C":["D","E"],"D":["F"],"E":["F"],"F":[]}
print(bfs_shortest(g, "A", "F"))  # ['A','C','E','F']`,
  },
  {
    lang: "numpy", label: "NumPy", badge: "NP", color: "#38bdf8", bg: "#38bdf812",
    title: "Broadcasting · eigenvectors",
    code: `import numpy as np

A = np.array([[4., 2.], [1., 3.]])

vals, vecs = np.linalg.eig(A)
print("λ =", vals)          # [5., 2.]

data = np.random.randn(100, 4)
centred = data - data.mean(axis=0)

cov = np.cov(centred, rowvar=False)
print(cov.shape)            # (4, 4)`,
  },
  {
    lang: "pandas", label: "Pandas", badge: "PD", color: "#818cf8", bg: "#818cf812",
    title: "GroupBy · rolling · merge",
    code: `import pandas as pd

sales = pd.read_csv("sales.csv", parse_dates=["date"])

rolling = (
    sales
    .sort_values("date")
    .groupby("product")["revenue"]
    .transform(lambda s: s.rolling(7, min_periods=1).mean())
)
sales["rolling_7d"] = rolling

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
  { id: "cnf-intro",        label: "Introduction" },
  { id: "cnf-start",        label: "Quick Start" },
  { id: "cnf-courses",      label: "Courses" },
  { id: "cnf-projects",     label: "Projects" },
  { id: "cnf-snippets",     label: "Code Library" },
  { id: "cnf-certificates", label: "Certificates" },
  { id: "cnf-audience",     label: "For Whom" },
  { id: "cnf-philosophy",   label: "Philosophy" },
  { id: "cnf-features",     label: "Features" },
  { id: "cnf-compare",      label: "Compare" },
  { id: "cnf-roadmap",      label: "Roadmap" },
  { id: "cnf-faq",          label: "FAQ" },
  { id: "cnf-support",      label: "Support" },
];

/* ─────────────────────────────────────────────────────────────────
   SCOPED CSS
   Every rule is under #cnf-docs-root so NOTHING leaks outside.
   No bare *, html, body, input, a, h1…h6 resets.
   Injected via useEffect and removed on unmount.
───────────────────────────────────────────────────────────────── */
const SCOPED_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

@keyframes cnfdocs-float {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-12px); }
}
@keyframes cnfdocs-pulse-dot {
  0%,100% { box-shadow: 0 0 0 0 rgba(0,212,255,.5); }
  50%      { box-shadow: 0 0 0 6px rgba(0,212,255,0); }
}
@keyframes cnfdocs-shimmer {
  0%   { background-position: -300% center; }
  100% { background-position:  300% center; }
}
@keyframes cnfdocs-scan {
  0%   { top: -4%; opacity: .5; }
  100% { top: 108%; opacity: 0; }
}

/* ── root ── */
#cnf-docs-root {
  font-family: 'Syne', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #c8d6e5;
  background: #040810;
  position: relative;
  isolation: isolate;
  contain: layout style;
}

/* ── scoped box-sizing only inside root ── */
#cnf-docs-root *, #cnf-docs-root *::before, #cnf-docs-root *::after {
  box-sizing: border-box;
}

/* ── scrollbar ── */
#cnf-docs-root ::-webkit-scrollbar { width: 3px; height: 3px; }
#cnf-docs-root ::-webkit-scrollbar-track { background: transparent; }
#cnf-docs-root ::-webkit-scrollbar-thumb { background: rgba(0,212,255,.25); border-radius: 2px; }

/* ── shimmer text ── */
#cnf-docs-root .d-shimmer {
  background: linear-gradient(90deg,#00d4ff 0%,#a78bfa 25%,#f472b6 50%,#fbbf24 75%,#00d4ff 100%);
  background-size: 300% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: cnfdocs-shimmer 5s linear infinite;
}

/* ── cards ── */
#cnf-docs-root .d-card {
  transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease, border-color .3s ease;
}
#cnf-docs-root .d-card:hover {
  transform: translateY(-4px) scale(1.008);
  box-shadow: 0 24px 56px rgba(0,0,0,.45);
}

/* ── float ── */
#cnf-docs-root .d-float { animation: cnfdocs-float 5s ease-in-out infinite; }

/* ── pulse dot ── */
#cnf-docs-root .d-pulse { animation: cnfdocs-pulse-dot 2s infinite; }

/* ── scan line ── */
#cnf-docs-root .d-scan { animation: cnfdocs-scan 9s linear infinite; }

/* ── lang tab ── */
#cnf-docs-root .d-tab { transition: opacity .18s ease; }
#cnf-docs-root .d-tab:hover { opacity: .85; }

/* ── faq hover ── */
#cnf-docs-root .d-faq { transition: border-color .2s, background .2s; }
#cnf-docs-root .d-faq:hover { border-color: rgba(0,212,255,.22) !important; }

/* ── ghost button ── */
#cnf-docs-root .d-ghost { transition: background .2s, color .2s; }
#cnf-docs-root .d-ghost:hover {
  background: rgba(255,255,255,.08) !important;
  color: #f1f5f9 !important;
}

/* ── glow button ── */
#cnf-docs-root .d-btn-glow {
  background: linear-gradient(135deg,#0ea5e9,#6366f1);
  box-shadow: 0 6px 28px rgba(14,165,233,.3);
  transition: transform .2s, box-shadow .2s;
}
#cnf-docs-root .d-btn-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(14,165,233,.45);
}

/* ── nav links ── */
#cnf-docs-root .d-navlink { transition: color .18s, background .18s; text-decoration: none !important; }
#cnf-docs-root .d-navlink:hover { color: #f1f5f9 !important; background: rgba(255,255,255,.04) !important; }

/* ── topbar ── */
#cnf-docs-root .d-topbar {
  position: sticky;
  top: 0;
  z-index: 80;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  transition: background .3s, border-color .3s;
}
#cnf-docs-root .d-topbar.d-scrolled {
  background: rgba(4,8,16,.88);
  border-bottom: 1px solid rgba(255,255,255,.07);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* ── layout ── */
#cnf-docs-root .d-layout {
  display: grid;
  grid-template-columns: 230px 1fr;
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── sidebar ── */
#cnf-docs-root .d-sidebar {
  position: sticky;
  top: 56px;
  height: calc(100vh - 56px);
  overflow-y: auto;
  border-right: 1px solid rgba(255,255,255,.05);
  padding: 28px 0;
  scrollbar-width: none;
}
#cnf-docs-root .d-sidebar::-webkit-scrollbar { display: none; }

/* ── main ── */
#cnf-docs-root .d-main { padding: 48px 0 120px 52px; min-width: 0; }

/* ── code ── */
#cnf-docs-root .d-code-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
#cnf-docs-root .d-code-scroll pre { min-width: max-content; }

/* ── search input ── */
#cnf-docs-root .d-input {
  width: 100%;
  padding: 11px 14px 11px 36px;
  border-radius: 10px;
  outline: none;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.09);
  color: #f1f5f9;
  font-size: 14px;
  font-family: 'Syne', system-ui, sans-serif;
  transition: border-color .2s;
}
#cnf-docs-root .d-input:focus { border-color: rgba(0,212,255,.35); }
#cnf-docs-root .d-input::placeholder { color: rgba(255,255,255,.25); }

/* ── links inside docs ── */
#cnf-docs-root a { text-decoration: none; }

/* ── hamburger ── */
#cnf-docs-root .d-hamburger {
  display: none;
  align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: 9px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  cursor: pointer;
  color: rgba(255,255,255,.7);
  font-size: 20px; flex-shrink: 0;
  transition: background .2s;
  font-family: inherit;
}

/* ── drawer ── */
#cnf-docs-root .d-backdrop {
  position: fixed; inset: 0; z-index: 90;
  background: rgba(0,0,0,.7);
  backdrop-filter: blur(4px);
  transition: opacity .3s ease;
}
#cnf-docs-root .d-drawer {
  position: fixed;
  left: 0; top: 0; bottom: 0;
  width: 280px; z-index: 91;
  background: linear-gradient(160deg,#06101f,#080e1d);
  border-right: 1px solid rgba(0,212,255,.12);
  transition: transform .35s cubic-bezier(.16,1,.3,1);
  display: flex; flex-direction: column;
  overflow-y: auto;
}

/* ── responsive ── */
@media (max-width: 860px) {
  #cnf-docs-root .d-sidebar   { display: none !important; }
  #cnf-docs-root .d-layout    { grid-template-columns: 1fr !important; padding: 0 16px; }
  #cnf-docs-root .d-main      { padding: 32px 0 80px 0 !important; }
  #cnf-docs-root .d-hamburger { display: flex; }
}
@media (max-width: 640px) {
  #cnf-docs-root .d-g-stats  { grid-template-columns: 1fr 1fr !important; }
  #cnf-docs-root .d-g-feat   { grid-template-columns: 1fr !important; }
  #cnf-docs-root .d-g-princ  { grid-template-columns: 1fr !important; }
  #cnf-docs-root .d-g-proj   { grid-template-columns: 1fr 1fr !important; }
  #cnf-docs-root .d-g-aud    { grid-template-columns: 1fr 1fr !important; }
}
@media (max-width: 420px) {
  #cnf-docs-root .d-g-proj   { grid-template-columns: 1fr !important; }
  #cnf-docs-root .d-g-aud    { grid-template-columns: 1fr !important; }
  #cnf-docs-root .d-cta-btns { flex-direction: column !important; align-items: stretch !important; }
}
`;

/* ═══════════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════════ */

/** Inject scoped styles on mount; clean up on unmount — zero global leak */
function useScopedStyles() {
  useEffect(() => {
    if (document.getElementById("cnf-docs-styles")) return;
    const tag = document.createElement("style");
    tag.id = "cnf-docs-styles";
    tag.textContent = SCOPED_CSS;
    document.head.appendChild(tag);
    return () => {
      const el = document.getElementById("cnf-docs-styles");
      if (el) document.head.removeChild(el);
    };
  }, []);
}

function useReveal(threshold = 0.1) {
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
   COMPONENTS
═══════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 32 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const { ref, vis } = useReveal();
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : `translateY(${y}px)`, transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

function GlowDot({ color }: { color: string }) {
  return <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }} />;
}

function Tag({ children, color = "#00d4ff" }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", background: `${color}18`, color, border: `1px solid ${color}35` }}>
      {children}
    </span>
  );
}

function CopyBtn({ code }: { code: string }) {
  const [ok, setOk] = useState(false);
  const copy = useCallback(() => { navigator.clipboard.writeText(code).then(() => { setOk(true); setTimeout(() => setOk(false), 2000); }); }, [code]);
  return (
    <button onClick={copy} style={{ padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: ".06em", background: ok ? "rgba(52,211,153,.15)" : "rgba(255,255,255,.06)", color: ok ? "#34d399" : "rgba(255,255,255,.45)", border: `1px solid ${ok ? "rgba(52,211,153,.4)" : "rgba(255,255,255,.1)"}`, transition: "all .2s", fontFamily: "inherit", whiteSpace: "nowrap" }}>
      {ok ? "✓ COPIED" : "COPY"}
    </button>
  );
}

function SLabel({ n, title, sub }: { n: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: ".18em", color: "#00d4ff", opacity: .8 }}>{n}</span>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,rgba(0,212,255,.35),transparent)" }} />
      </div>
      <h2 style={{ fontSize: "clamp(1.4rem,4vw,2.2rem)", fontWeight: 800, lineHeight: 1.15, color: "#f1f5f9", letterSpacing: "-.02em", margin: 0 }}>{title}</h2>
      {sub && <p style={{ fontSize: 14, color: "rgba(255,255,255,.38)", lineHeight: 1.75, maxWidth: 540, marginTop: 8, marginBottom: 0 }}>{sub}</p>}
    </div>
  );
}

function MobileDrawer({ open, onClose, activeNav }: { open: boolean; onClose: () => void; activeNav: string }) {
  return (
    <>
      <div className="d-backdrop" onClick={onClose} style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }} />
      <div className="d-drawer" style={{ transform: open ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={{ padding: "22px 18px 18px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#f1f5f9" }}>CodeNFacts</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: ".1em", marginTop: 2 }}>DOCS v2.0</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.6)", width: 34, height: 34, borderRadius: 8, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>×</button>
        </div>
        <div style={{ padding: "14px 10px", flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", color: "rgba(255,255,255,.22)", marginBottom: 10, paddingLeft: 8, textTransform: "uppercase" }}>On this page</p>
          {NAV.map(n => {
            const active = activeNav === n.id;
            return (
              <a key={n.id} href={`#${n.id}`} onClick={onClose} className="d-navlink"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 9, marginBottom: 2, fontSize: 13.5, fontWeight: active ? 700 : 400, color: active ? "#00d4ff" : "rgba(255,255,255,.45)", background: active ? "rgba(0,212,255,.09)" : "transparent", borderLeft: `2px solid ${active ? "#00d4ff" : "transparent"}` }}>
                {active && <div className="d-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#00d4ff", flexShrink: 0 }} />}
                {n.label}
              </a>
            );
          })}
        </div>
        <div style={{ margin: "0 10px 22px", padding: 16, borderRadius: 12, background: "linear-gradient(135deg,rgba(14,165,233,.12),rgba(99,102,241,.1))", border: "1px solid rgba(14,165,233,.18)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#0ea5e9", letterSpacing: ".1em", marginBottom: 5, textTransform: "uppercase" }}>Start Today</div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.38)", lineHeight: 1.65, marginBottom: 10 }}>Join 10,000+ learners building real skills.</p>
          <a href="https://codenfacts.in" style={{ display: "block", textAlign: "center", padding: "8px 14px", borderRadius: 7, background: "linear-gradient(135deg,#0ea5e9,#6366f1)", color: "#fff", fontWeight: 700, fontSize: 11, letterSpacing: ".05em" }}>Get Started →</a>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════ */

export default function DocsPage() {
  useScopedStyles();

  const [activeNav, setActiveNav] = useState("cnf-intro");
  const [activeLang, setActiveLang] = useState(0);
  const [langSearch, setLangSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /*
    Scroll listener is attached to #cnf-docs-root itself (overflow-y: auto),
    NOT to window — so it never interferes with the app's own scroll handling.
  */
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onScroll = () => {
      setScrolled(root.scrollTop > 20);
      for (const n of [...NAV].reverse()) {
        const el = root.querySelector(`#${n.id}`) as HTMLElement | null;
        if (el && el.getBoundingClientRect().top <= 140) { setActiveNav(n.id); break; }
      }
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  /* scroll-to helper uses the scoped container */
  const scrollTo = (id: string) => {
    const root = rootRef.current;
    const el = root?.querySelector(`#${id}`) as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filtered = SNIPPETS.filter(s =>
    s.lang.includes(langSearch.toLowerCase()) ||
    s.label.toLowerCase().includes(langSearch.toLowerCase()) ||
    s.title.toLowerCase().includes(langSearch.toLowerCase())
  );
  const snippet = filtered[activeLang] ?? filtered[0];

  /* ── shared inline style helpers ── */
  const sCard = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    borderRadius: 13, border: "1px solid rgba(255,255,255,.06)", background: "rgba(255,255,255,.02)", ...extra,
  });

  return (
    /*
      This div IS the scroll container (overflow-y:auto + height:100vh).
      Everything inside is absolutely isolated from the parent app.
      The sticky topbar sticks to this container, not the viewport.
    */
    <div id="cnf-docs-root" ref={rootRef} style={{ overflowY: "auto", height: "100vh" }}>

      {/* ── ambient bg (absolute, stays inside root) ── */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "65vw", height: "65vw", borderRadius: "50%", background: "rgba(99,102,241,.055)", filter: "blur(80px)", top: "-20%", left: "-15%" }} />
        <div style={{ position: "absolute", width: "50vw", height: "50vw", borderRadius: "50%", background: "rgba(0,212,255,.04)", filter: "blur(80px)", bottom: 0, right: "-10%" }} />
        <div style={{ position: "absolute", width: "28vw", height: "28vw", borderRadius: "50%", background: "rgba(251,191,36,.03)", filter: "blur(60px)", top: "45%", left: "45%" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,212,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.025) 1px,transparent 1px)`, backgroundSize: "52px 52px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 40%,black,transparent)" }} />
        <div className="d-scan" style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(0,212,255,.1),transparent)" }} />
      </div>

      {/* ══ TOPBAR — sticky to #cnf-docs-root, not to window ══ */}
      <header className={`d-topbar${scrolled ? " d-scrolled" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="d-hamburger" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation">☰</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,.25)", letterSpacing: ".1em", marginLeft: 2 }}>DOCS</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Tag color="#00d4ff">v2.0</Tag>
          <a href="https://codenfacts.in/courses" style={{ padding: "7px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "linear-gradient(135deg,#0ea5e9,#6366f1)", color: "#fff", letterSpacing: ".03em", boxShadow: "0 4px 16px rgba(14,165,233,.25)", transition: "opacity .2s" }}>Courses →</a>
        </div>
      </header>

      <MobileDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} activeNav={activeNav} />

      {/* ══ LAYOUT ══ */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="d-layout">

          {/* SIDEBAR */}
          <aside className="d-sidebar">
            <div style={{ padding: "0 16px 22px", borderBottom: "1px solid rgba(255,255,255,.05)", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>On This Page</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.18)" }}>Documentation v2.0</div>
            </div>
            <div style={{ padding: "0 10px" }}>
              {NAV.map(n => {
                const active = activeNav === n.id;
                return (
                  <a key={n.id} href={`#${n.id}`} className="d-navlink"
                    onClick={e => { e.preventDefault(); scrollTo(n.id); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, marginBottom: 1, fontSize: 13, fontWeight: active ? 700 : 400, color: active ? "#00d4ff" : "rgba(255,255,255,.38)", background: active ? "rgba(0,212,255,.08)" : "transparent", borderLeft: `2px solid ${active ? "#00d4ff" : "transparent"}` }}>
                    {active && <div className="d-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#00d4ff", flexShrink: 0 }} />}
                    {n.label}
                  </a>
                );
              })}
            </div>
            <div style={{ margin: "22px 10px 0", padding: "18px 16px", borderRadius: 12, background: "linear-gradient(135deg,rgba(14,165,233,.1),rgba(99,102,241,.09))", border: "1px solid rgba(14,165,233,.18)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#0ea5e9", letterSpacing: ".1em", marginBottom: 5, textTransform: "uppercase" }}>Start Today</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.38)", lineHeight: 1.65, marginBottom: 12 }}>Join 10,000+ learners building real skills.</p>
              <a href="https://codenfacts.in" style={{ display: "block", textAlign: "center", padding: "8px 14px", borderRadius: 7, background: "linear-gradient(135deg,#0ea5e9,#6366f1)", color: "#fff", fontWeight: 700, fontSize: 11, letterSpacing: ".05em" }}>Get Started →</a>
            </div>
          </aside>

          {/* MAIN */}
          <main className="d-main">

            {/* § HERO */}
            <section id="cnf-intro" style={{ marginBottom: 100 }}>
              <Reveal>
                <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                  <Tag color="#00d4ff">Documentation</Tag><Tag color="#a78bfa">v2.0</Tag><Tag color="#fbbf24">Updated 2026</Tag>
                </div>
                <div style={{ position: "relative", marginBottom: 24 }}>
                  <div style={{ position: "absolute", top: -24, left: -12, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,212,255,.1) 0%,transparent 70%)", pointerEvents: "none" }} />
                  <h1 style={{ fontSize: "clamp(2rem,6vw,3.8rem)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-.03em", color: "#f1f5f9", position: "relative" }}>
                    Build Real Skills.<br /><span className="d-shimmer">Ship Real Code.</span>
                  </h1>
                </div>
                <p style={{ fontSize: "clamp(.9rem,2.2vw,1.1rem)", lineHeight: 1.85, color: "rgba(255,255,255,.48)", maxWidth: 560, marginBottom: 32 }}>
                  CodeNFacts is a modern learning platform designed to help students, developers, and tech enthusiasts build{" "}
                  <strong style={{ color: "rgba(255,255,255,.78)", fontWeight: 600 }}>industry-ready coding skills</strong> through real-world projects - not passive theory.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 56 }}>
                  <a href="#cnf-start" className="d-btn-glow" onClick={e => { e.preventDefault(); scrollTo("cnf-start"); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: ".02em" }}>
                    Quick Start Guide <span style={{ opacity: .85 }}>→</span>
                  </a>
                  <a href="#cnf-snippets" className="d-ghost" onClick={e => { e.preventDefault(); scrollTo("cnf-snippets"); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 10, color: "rgba(255,255,255,.65)", fontWeight: 600, fontSize: 14, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
                    Explore Code Library
                  </a>
                </div>
                <div className="d-g-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
                  {[{ v:"9+",l:"Courses",c:"#00d4ff"},{v:"16+",l:"Languages",c:"#a78bfa"},{v:"10K+",l:"Learners",c:"#fbbf24"},{v:"100%",l:"Project-Based",c:"#34d399"}].map((s,i)=>(
                    <Reveal key={s.l} delay={i*70}>
                      <div className="d-card" style={{ padding:"20px 16px",borderRadius:14,textAlign:"center",border:"1px solid rgba(255,255,255,.06)",background:"rgba(255,255,255,.022)",position:"relative",overflow:"hidden" }}>
                        <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${s.c},transparent)`,opacity:.75 }} />
                        <div style={{ fontSize:"clamp(1.4rem,3vw,1.8rem)",fontWeight:800,color:s.c,marginBottom:4,letterSpacing:"-.02em" }}>{s.v}</div>
                        <div style={{ fontSize:10,color:"rgba(255,255,255,.32)",fontWeight:700,letterSpacing:".07em",textTransform:"uppercase" }}>{s.l}</div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* § QUICK START */}
            <section id="cnf-start" style={{ marginBottom: 90 }}>
              <Reveal>
                <SLabel n="§ 01" title="Quick Start" sub="Go from zero to building in four steps. No fluff." />
                <div style={{ position: "relative" }}>
                  <div style={{ position:"absolute",left:19,top:20,bottom:20,width:1,background:"linear-gradient(to bottom,rgba(0,212,255,.5),rgba(99,102,241,.3),transparent)" }} />
                  {[
                    { n:"01", title:"Create Your Account",      desc:"Sign up with your email to access your personal dashboard, course library, progress tracking, and certificates.", color:"#00d4ff" },
                    { n:"02", title:"Choose a Learning Path",   desc:"Browse curated paths: Web Dev, Data Science, DSA, Systems Programming, or ML - each mapped to real industry roles.", color:"#a78bfa" },
                    { n:"03", title:"Learn & Build Together",   desc:"Follow structured video modules, code along with interactive snippets, and complete real-world projects after each phase.", color:"#fbbf24" },
                    { n:"04", title:"Earn & Share Certificate", desc:"Complete the course, receive a verifiable certificate, and post it to LinkedIn, your portfolio, or job applications.", color:"#34d399" },
                  ].map((s,i)=>(
                    <Reveal key={s.n} delay={i*90}>
                      <div style={{ display:"flex",gap:24,marginBottom:20 }}>
                        <div style={{ flexShrink:0,width:40,display:"flex",justifyContent:"center" }}>
                          <div style={{ width:40,height:40,borderRadius:11,background:`${s.color}16`,border:`1px solid ${s.color}38`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:s.color,letterSpacing:".06em",flexShrink:0 }}>{s.n}</div>
                        </div>
                        <div className="d-card" style={{ flex:1,padding:"20px 22px" }}>
                          <h3 style={{ fontWeight:700,fontSize:15,color:"#f1f5f9",marginBottom:7 }}>{s.title}</h3>
                          <p style={{ fontSize:13.5,color:"rgba(255,255,255,.43)",lineHeight:1.7 }}>{s.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* § COURSES */}
            <section id="cnf-courses" style={{ marginBottom: 90 }}>
              <Reveal>
                <SLabel n="§ 02" title="How Courses Work" sub="Structured, progressive, and ruthlessly practical." />
                <div style={{ display:"grid",gap:10,gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",marginBottom:24 }}>
                  {[{icon:"◉",label:"Structured Modules",c:"#00d4ff"},{icon:"▶",label:"Video Explanations",c:"#a78bfa"},{icon:"</>",label:"Code-Along Examples",c:"#fbbf24"},{icon:"⬢",label:"Hands-on Projects",c:"#34d399"},{icon:"⌛",label:"Self-paced Learning",c:"#f472b6"},{icon:"📈",label:"Progress Tracking",c:"#fb923c"}].map(f=>(
                    <div key={f.label} className="d-card" style={{ display:"flex",alignItems:"center",gap:10,padding:"14px 16px",borderRadius:11,border:"1px solid rgba(255,255,255,.06)",background:"rgba(255,255,255,.022)" }}>
                      <span style={{ fontSize:17,color:f.c,flexShrink:0 }}>{f.icon}</span>
                      <span style={{ fontSize:13,fontWeight:600,color:"rgba(255,255,255,.72)" }}>{f.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding:"24px 28px",borderRadius:14,background:"rgba(0,212,255,.04)",border:"1px solid rgba(0,212,255,.11)",overflow:"hidden",position:"relative" }}>
                  <div style={{ position:"absolute",top:0,right:0,width:180,height:180,background:"radial-gradient(circle,rgba(0,212,255,.07) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none" }} />
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#00d4ff",letterSpacing:".12em",marginBottom:14,textTransform:"uppercase" }}>Course Progression</div>
                  <div style={{ display:"flex",alignItems:"center",flexWrap:"wrap",gap:4 }}>
                    {["Foundations","Core Concepts","Applied Projects","Advanced Topics","Capstone"].map((step,i,arr)=>(
                      <div key={step} style={{ display:"flex",alignItems:"center" }}>
                        <div style={{ padding:"7px 14px",borderRadius:18,fontSize:11.5,fontWeight:600,background:i===0?"rgba(0,212,255,.2)":"rgba(255,255,255,.04)",border:`1px solid ${i===0?"rgba(0,212,255,.45)":"rgba(255,255,255,.07)"}`,color:i===0?"#00d4ff":"rgba(255,255,255,.4)",whiteSpace:"nowrap" }}>{step}</div>
                        {i<arr.length-1&&<div style={{ width:20,height:1,background:"rgba(255,255,255,.14)",flexShrink:0 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </section>

            {/* § PROJECTS */}
            <section id="cnf-projects" style={{ marginBottom: 90 }}>
              <Reveal>
                <SLabel n="§ 03" title="Real-World Projects" />
                <div style={{ padding:"22px 28px",borderRadius:13,marginBottom:28,background:"linear-gradient(135deg,rgba(99,102,241,.09),rgba(0,212,255,.055))",border:"1px solid rgba(99,102,241,.22)",position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",left:0,top:0,bottom:0,width:3,background:"linear-gradient(to bottom,#6366f1,#00d4ff)" }} />
                  <p style={{ fontSize:"1rem",fontStyle:"italic",color:"rgba(255,255,255,.65)",lineHeight:1.65 }}>"Projects are the bridge between learning and getting hired."</p>
                </div>
                <div className="d-g-proj" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
                  {[{title:"Full-Stack Web App",tag:"React · Node · PostgreSQL",c:"#00d4ff"},{title:"Authentication System",tag:"JWT · OAuth 2.0 · bcrypt",c:"#a78bfa"},{title:"Analytics Dashboard",tag:"Charts · REST API · UI",c:"#fbbf24"},{title:"REST & GraphQL APIs",tag:"Express · Prisma · types",c:"#34d399"},{title:"SaaS Platform",tag:"Stripe · Auth · DB",c:"#f472b6"},{title:"ML Pipeline",tag:"Python · Pandas · sklearn",c:"#fb923c"}].map(p=>(
                    <div key={p.title} className="d-card" style={{ padding:"20px 18px",borderRadius:13,border:`1px solid ${p.c}16`,background:`${p.c}05`,position:"relative",overflow:"hidden" }}>
                      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${p.c}55,transparent)` }} />
                      <div style={{ width:6,height:6,borderRadius:3,background:p.c,boxShadow:`0 0 10px ${p.c}`,marginBottom:12 }} />
                      <h4 style={{ fontWeight:700,fontSize:13.5,color:"#f1f5f9",marginBottom:7 }}>{p.title}</h4>
                      <span style={{ fontSize:10.5,color:p.c,fontFamily:"'JetBrains Mono',monospace",fontWeight:600 }}>{p.tag}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* § CODE LIBRARY */}
            <section id="cnf-snippets" style={{ marginBottom: 90 }}>
              <Reveal>
                <SLabel n="§ 04" title="Interactive Code Library" sub="Copy-ready snippets across 16+ languages. Search, browse, and steal freely." />
                <div style={{ position:"relative",marginBottom:14 }}>
                  <span style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,.28)",fontSize:16,pointerEvents:"none" }}>⌕</span>
                  <input className="d-input" value={langSearch} onChange={e=>{setLangSearch(e.target.value);setActiveLang(0);}} placeholder="Search language, framework, or topic…" />
                </div>
                <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:12,marginBottom:16,scrollbarWidth:"none" }}>
                  {filtered.map((s,i)=>(
                    <button key={s.lang} className="d-tab" onClick={()=>setActiveLang(i)} style={{ padding:"6px 14px",borderRadius:20,cursor:"pointer",border:`1px solid ${i===activeLang?s.color:"rgba(255,255,255,.08)"}`,background:i===activeLang?`${s.color}1e`:"transparent",color:i===activeLang?s.color:"rgba(255,255,255,.33)",fontSize:11.5,fontWeight:700,fontFamily:"inherit",letterSpacing:".04em",whiteSpace:"nowrap",flexShrink:0 }}>{s.label}</button>
                  ))}
                </div>
                {snippet && (
                  <Reveal y={16}>
                    <div style={{ borderRadius:15,overflow:"hidden",border:"1px solid rgba(255,255,255,.08)",boxShadow:"0 28px 70px rgba(0,0,0,.5)" }}>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 18px",background:"rgba(255,255,255,.03)",borderBottom:"1px solid rgba(255,255,255,.06)",gap:8,flexWrap:"wrap" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <div style={{ display:"flex",gap:6 }}>{["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} style={{ width:10,height:10,borderRadius:"50%",background:c,flexShrink:0 }} />)}</div>
                          <span style={{ padding:"2px 8px",borderRadius:5,fontSize:11,background:`${snippet.color}1e`,color:snippet.color,fontFamily:"'JetBrains Mono',monospace",fontWeight:700 }}>{snippet.badge}</span>
                          <span style={{ fontSize:12,color:"rgba(255,255,255,.38)",fontFamily:"'JetBrains Mono',monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"30vw" }}>{snippet.title}</span>
                        </div>
                        <CopyBtn code={snippet.code} />
                      </div>
                      <div className="d-code-scroll" style={{ background:"#050d18",padding:"24px",position:"relative" }}>
                        <div style={{ display:"flex",gap:18 }}>
                          <div style={{ display:"flex",flexDirection:"column",userSelect:"none",pointerEvents:"none",flexShrink:0 }}>
                            {snippet.code.split("\n").map((_,i)=><span key={i} style={{ fontSize:11.5,lineHeight:"1.75",fontFamily:"'JetBrains Mono',monospace",color:"rgba(255,255,255,.1)",textAlign:"right",minWidth:18 }}>{i+1}</span>)}
                          </div>
                          <pre style={{ margin:0,flex:1,minWidth:0 }}><code style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12.5,lineHeight:1.75,color:"#e2e8f0",display:"block" }}>{snippet.code}</code></pre>
                        </div>
                        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${snippet.color}45,transparent)` }} />
                      </div>
                    </div>
                  </Reveal>
                )}
                {filtered.length === 0 && <div style={{ textAlign:"center",padding:48,color:"rgba(255,255,255,.22)",fontSize:14 }}>No snippets match <em>"{langSearch}"</em></div>}
              </Reveal>
            </section>

            {/* § CERTIFICATES */}
            <section id="cnf-certificates" style={{ marginBottom: 90 }}>
              <Reveal>
                <SLabel n="§ 05" title="Certificates" sub="A verified credential that employers actually recognise." />
                <div style={{ marginBottom:28 }}>
                  <div className="d-float" style={{ maxWidth:520 }}>
                    <div style={{ padding:"36px 44px",borderRadius:18,background:"linear-gradient(135deg,#0a1628,#0d1f3c)",border:"1px solid rgba(0,212,255,.18)",boxShadow:"0 36px 80px rgba(0,0,0,.55)",position:"relative",overflow:"hidden" }}>
                      <div style={{ position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(0,212,255,.035) 0%,transparent 60%)",pointerEvents:"none" }} />
                      <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#00d4ff,#6366f1,transparent)" }} />
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".18em",color:"#00d4ff",marginBottom:14,textTransform:"uppercase" }}>CodeNFacts · Certificate of Completion</div>
                      <div style={{ fontSize:"clamp(1.1rem,2.5vw,1.35rem)",fontWeight:800,color:"#f1f5f9",marginBottom:6 }}>Full-Stack Web Development</div>
                      <div style={{ fontSize:13,color:"rgba(255,255,255,.38)",marginBottom:22 }}>Awarded to <strong style={{ color:"rgba(255,255,255,.72)" }}>Your Name</strong></div>
                      <div style={{ display:"flex",gap:20,alignItems:"center",flexWrap:"wrap" }}>
                        <div style={{ width:38,height:38,borderRadius:9,background:"linear-gradient(135deg,#0ea5e9,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:14,flexShrink:0 }}>C</div>
                        <div><div style={{ fontSize:12,fontWeight:700,color:"rgba(255,255,255,.55)" }}>CodeNFacts</div><div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(255,255,255,.22)" }}>CERT-2026-FSWEB-0042</div></div>
                        <div style={{ marginLeft:"auto",textAlign:"right" }}><div style={{ fontSize:10,color:"rgba(255,255,255,.28)" }}>Date</div><div style={{ fontSize:12,fontWeight:600,color:"rgba(255,255,255,.5)" }}>Mar 2026</div></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:10 }}>
                  {[{label:"Completed curriculum",c:"#34d399"},{label:"Built practical projects",c:"#34d399"},{label:"Industry-relevant concepts",c:"#34d399"},{label:"Share on LinkedIn",c:"#00d4ff"},{label:"Add to portfolio",c:"#00d4ff"},{label:"Attach to job applications",c:"#00d4ff"}].map(i=>(
                    <div key={i.label} style={{ display:"flex",gap:10,alignItems:"center",padding:"11px 14px",borderRadius:9,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)" }}>
                      <GlowDot color={i.c} /><span style={{ fontSize:13,color:"rgba(255,255,255,.56)",fontWeight:500 }}>{i.label}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* § AUDIENCE */}
            <section id="cnf-audience" style={{ marginBottom: 90 }}>
              <Reveal>
                <SLabel n="§ 06" title="Who Should Join" sub="CodeNFacts is built for anyone serious about tech." />
                <div className="d-g-aud" style={{ display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))" }}>
                  {[{emoji:"🌱",title:"Beginners",desc:"Zero experience? Perfect. We start from syntax and move to real apps.",c:"#34d399"},{emoji:"🎓",title:"Students",desc:"Preparing for internships, placements, and tech careers.",c:"#00d4ff"},{emoji:"⚙️",title:"Working Devs",desc:"Add frameworks, languages, or data-science skills to your stack.",c:"#a78bfa"},{emoji:"📦",title:"Self-taught",desc:"Fill gaps, build a portfolio, and get job-ready.",c:"#fbbf24"},{emoji:"🚀",title:"Career Switchers",desc:"Transitioning from non-tech? We make it systematic.",c:"#f472b6"},{emoji:"💡",title:"Enthusiasts",desc:"You love building things. So do we.",c:"#fb923c"}].map(a=>(
                    <div key={a.title} className="d-card" style={{ padding:"22px 20px" }}>
                      <div style={{ fontSize:28,marginBottom:10 }}>{a.emoji}</div>
                      <h4 style={{ fontWeight:700,fontSize:14.5,color:a.c,marginBottom:7 }}>{a.title}</h4>
                      <p style={{ fontSize:13,color:"rgba(255,255,255,.4)",lineHeight:1.7 }}>{a.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* § PHILOSOPHY */}
            <section id="cnf-philosophy" style={{ marginBottom: 90 }}>
              <Reveal>
                <SLabel n="§ 07" title="Learning Philosophy" />
                <div className="d-g-princ" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
                  {[{n:"I",title:"Learn by Building",desc:"The best way to master programming is to build real things - not read endless tutorials.",c:"#00d4ff"},{n:"II",title:"Practical Knowledge",desc:"We only teach concepts used in real companies and real production environments.",c:"#a78bfa"},{n:"III",title:"Industry Readiness",desc:"Every course is structured to make you hirable — with a portfolio that proves it.",c:"#fbbf24"}].map(p=>(
                    <div key={p.n} className="d-card" style={{ padding:"26px 22px",borderRadius:14,border:`1px solid ${p.c}1e`,background:`${p.c}05`,position:"relative",overflow:"hidden" }}>
                      <div style={{ position:"absolute",bottom:-18,right:-18,width:72,height:72,borderRadius:"50%",background:`${p.c}07` }} />
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:26,fontWeight:800,color:`${p.c}28`,marginBottom:12,letterSpacing:"-.04em" }}>{p.n}</div>
                      <h3 style={{ fontWeight:700,fontSize:14.5,color:"#f1f5f9",marginBottom:9 }}>{p.title}</h3>
                      <p style={{ fontSize:13,color:"rgba(255,255,255,.38)",lineHeight:1.7 }}>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* § FEATURES */}
            <section id="cnf-features" style={{ marginBottom: 90 }}>
              <Reveal>
                <SLabel n="§ 08" title="Platform Features" sub="Everything you need to learn, track, and prove your skills." />
                <div className="d-g-feat" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12 }}>
                  {[{icon:"◉",title:"Smart Dashboard",desc:"A clean, distraction-free hub. See courses, progress, and certs at a glance.",c:"#00d4ff"},{icon:"◈",title:"Structured Modules",desc:"Bite-sized lessons organised logically so you always know what comes next.",c:"#a78bfa"},{icon:"🔒",title:"Secure Auth",desc:"Industry-standard security — your account and learning data are safe.",c:"#34d399"},{icon:"📈",title:"Progress Tracking",desc:"Visual learning streak, lesson completion, and overall course progress.",c:"#fbbf24"},{icon:"</>",title:"16+ Code Languages",desc:"Copy-ready snippets: Python, JS, Java, Rust, SQL, NumPy, and more.",c:"#f472b6"},{icon:"❋",title:"Verified Certificates",desc:"Shareable, verifiable certificates after every course completion.",c:"#fb923c"},{icon:"⬢",title:"Real-World Projects",desc:"Every course culminates in a deployable project for your portfolio.",c:"#0ea5e9"},{icon:"🤖",title:"AI Assistant (soon)",desc:"In-browser AI that reviews code, explains errors, and suggests improvements.",c:"#84cc16"}].map(f=>(
                    <div key={f.title} className="d-card" style={{ display:"flex",gap:14,alignItems:"flex-start",padding:"18px 20px" }}>
                      <div style={{ width:38,height:38,borderRadius:9,flexShrink:0,background:`${f.c}13`,border:`1px solid ${f.c}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,color:f.c }}>{f.icon}</div>
                      <div><h4 style={{ fontWeight:700,fontSize:13.5,color:"#f1f5f9",marginBottom:5 }}>{f.title}</h4><p style={{ fontSize:12.5,color:"rgba(255,255,255,.36)",lineHeight:1.65 }}>{f.desc}</p></div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* § COMPARE */}
            <section id="cnf-compare" style={{ marginBottom: 90 }}>
              <Reveal>
                <SLabel n="§ 09" title="Why CodeNFacts?" sub="See how we stack up against traditional learning approaches." />
                <div style={{ borderRadius:14,overflow:"hidden",border:"1px solid rgba(255,255,255,.08)",overflowX:"auto" }}>
                  <div style={{ display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr",background:"rgba(255,255,255,.03)",minWidth:380 }}>
                    <div style={{ padding:"14px 18px",fontSize:11,fontWeight:700,color:"rgba(255,255,255,.28)",letterSpacing:".08em",textTransform:"uppercase" }}>Feature</div>
                    <div style={{ padding:"14px 18px",fontSize:11,fontWeight:700,color:"#00d4ff",letterSpacing:".08em",textTransform:"uppercase",borderLeft:"1px solid rgba(255,255,255,.06)",background:"rgba(0,212,255,.05)" }}>CodeNFacts ✦</div>
                    <div style={{ padding:"14px 18px",fontSize:11,fontWeight:700,color:"rgba(255,255,255,.28)",letterSpacing:".08em",textTransform:"uppercase",borderLeft:"1px solid rgba(255,255,255,.06)" }}>Traditional</div>
                  </div>
                  {[["Project-focused learning","✓ Every course","✗ Theory only"],["Real-world use cases","✓ Industry workflows","✗ Toy examples"],["Verifiable certificates","✓ Shareable link","~ PDF only"],["16+ code languages","✓ + copy snippets","✗ Limited"],["AI coding assistant","✓ Coming Q3 2027","✗ None"],["Community & peer review","✓ Roadmap Q1 2026","~ Forums only"],["Mobile app","✓ Roadmap 2026","~ Web only"],["Lifetime access","✓ 426 Days Access","~ Subscription"]].map(([feat,us,them],i)=>(
                    <div key={feat} style={{ display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr",borderTop:"1px solid rgba(255,255,255,.05)",background:i%2===0?"transparent":"rgba(255,255,255,.01)",minWidth:380 }}>
                      <div style={{ padding:"13px 18px",fontSize:13,color:"rgba(255,255,255,.52)" }}>{feat}</div>
                      <div style={{ padding:"13px 18px",fontSize:13,fontWeight:600,color:"#34d399",borderLeft:"1px solid rgba(255,255,255,.05)",background:"rgba(0,212,255,.02)" }}>{us}</div>
                      <div style={{ padding:"13px 18px",fontSize:13,color:"rgba(255,255,255,.28)",borderLeft:"1px solid rgba(255,255,255,.05)" }}>{them}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* § ROADMAP */}
            <section id="cnf-roadmap" style={{ marginBottom: 90 }}>
              <Reveal>
                <SLabel n="§ 10" title="Product Roadmap" sub="Where we're going - and what's already here." />
                <div style={{ position:"relative",paddingLeft:28 }}>
                  <div style={{ position:"absolute",left:9,top:0,bottom:0,width:1,background:"linear-gradient(to bottom,#00d4ff,#6366f1,#fbbf24,transparent)" }} />
                  {[{date:"Now Live",title:"Core Platform",desc:"Dashboard, courses, real-world projects, certificates, 16+ code languages.",c:"#34d399",status:"live"},{date:"Q3",title:"Advanced Course Library",desc:"System design, cloud (AWS/GCP), DevOps, Docker, and ML specialisations.",c:"#00d4ff",status:"progress"},{date:"Q4",title:"AI Coding Assistant",desc:"In-browser AI that reviews code, explains errors, and suggests improvements in real time.",c:"#a78bfa",status:"planned"},{date:"Q1",title:"Community & Peer Review",desc:"Discussion threads, live code reviews, leaderboards, and study groups.",c:"#fbbf24",status:"planned"},{date:"Q2",title:"Mobile App",desc:"Native iOS and Android for learning on the go with offline support.",c:"#f472b6",status:"planned"},{date:"2026+",title:"Industry Collaboration",desc:"Partner projects, hiring pipelines, and sponsored coding challenges.",c:"#fb923c",status:"future"}].map((item,i)=>(
                    <Reveal key={item.title} delay={i*70}>
                      <div style={{ display:"flex",gap:18,marginBottom:20,position:"relative" }}>
                        <div style={{ position:"absolute",left:-26,top:12,width:14,height:14,borderRadius:"50%",background:item.status==="live"?item.c:"#040810",border:`2px solid ${item.c}`,boxShadow:item.status==="live"?`0 0 14px ${item.c}`:"none" }} />
                        <div className="d-card" style={{ flex:1,padding:"20px 22px",border:`1px solid ${item.c}16`,background:`${item.c}04` }}>
                          <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:7,flexWrap:"wrap" }}>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:item.c,fontWeight:700 }}>{item.date}</span>
                            <span style={{ fontSize:9.5,padding:"2px 8px",borderRadius:4,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",background:item.status==="live"?"rgba(52,211,153,.14)":item.status==="progress"?"rgba(0,212,255,.14)":"rgba(255,255,255,.05)",color:item.status==="live"?"#34d399":item.status==="progress"?"#00d4ff":"rgba(255,255,255,.28)" }}>{item.status}</span>
                          </div>
                          <h4 style={{ fontWeight:700,fontSize:14.5,color:"#f1f5f9",marginBottom:5 }}>{item.title}</h4>
                          <p style={{ fontSize:13,color:"rgba(255,255,255,.38)",lineHeight:1.7 }}>{item.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* § FAQ */}
            <section id="cnf-faq" style={{ marginBottom: 90 }}>
              <Reveal>
                <SLabel n="§ 11" title="Frequently Asked Questions" />
                <div style={{ display:"grid",gap:8 }}>
                  {FAQS.map((item,i)=>(
                    <div key={i} className="d-faq" onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ borderRadius:12,cursor:"pointer",border:`1px solid ${openFaq===i?"rgba(0,212,255,.28)":"rgba(255,255,255,.07)"}`,background:openFaq===i?"rgba(0,212,255,.04)":"rgba(255,255,255,.018)",overflow:"hidden" }}>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"17px 20px",gap:14 }}>
                        <span style={{ fontWeight:600,fontSize:13.5,color:openFaq===i?"#f1f5f9":"rgba(255,255,255,.6)",lineHeight:1.5 }}>{item.q}</span>
                        <span style={{ color:"#00d4ff",fontSize:22,fontWeight:200,flexShrink:0,transition:"transform .28s cubic-bezier(.16,1,.3,1)",transform:openFaq===i?"rotate(45deg)":"rotate(0deg)",display:"inline-block",lineHeight:1 }}>+</span>
                      </div>
                      {openFaq===i&&<div style={{ padding:"0 20px 18px",fontSize:13.5,color:"rgba(255,255,255,.42)",lineHeight:1.78 }}>{item.a}</div>}
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* § SUPPORT */}
            <section id="cnf-support" style={{ marginBottom: 90 }}>
              <Reveal>
                <SLabel n="§ 12" title="Support & Community" sub="We're committed to helping every learner succeed." />
                <div style={{ display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",marginBottom:20 }}>
                  {[{icon:"◉",title:"Course Queries",desc:"Need help with a concept or project? Our team is ready.",c:"#00d4ff"},{icon:"⚙",title:"Technical Issues",desc:"Platform bug or access problem? We resolve it fast.",c:"#a78bfa"},{icon:"◈",title:"Account Support",desc:"Billing, certificate access, or account questions covered.",c:"#34d399"}].map(s=>(
                    <div key={s.title} className="d-card" style={{ padding:"22px 20px",border:`1px solid ${s.c}16`,background:`${s.c}04` }}>
                      <div style={{ fontSize:20,color:s.c,marginBottom:10 }}>{s.icon}</div>
                      <h4 style={{ fontWeight:700,fontSize:14.5,color:"#f1f5f9",marginBottom:7 }}>{s.title}</h4>
                      <p style={{ fontSize:13,color:"rgba(255,255,255,.38)",lineHeight:1.7 }}>{s.desc}</p>
                    </div>
                  ))}
                </div>
                <div style={{ padding:"18px 22px",borderRadius:11,background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",display:"flex",flexWrap:"wrap",gap:14,alignItems:"center" }}>
                  <span style={{ fontSize:13.5,color:"rgba(255,255,255,.38)" }}>📧 Reach us at</span>
                  <a href="mailto:support@codenfacts.in" style={{ color:"#00d4ff",fontWeight:700,fontSize:14,fontFamily:"'JetBrains Mono',monospace" }}>support@codenfacts.in</a>
                  <span style={{ marginLeft:"auto",fontSize:11.5,background:"rgba(52,211,153,.09)",padding:"4px 12px",borderRadius:20,border:"1px solid rgba(52,211,153,.18)",color:"#34d399",whiteSpace:"nowrap" }}>← Reply within 24 hrs</span>
                </div>
              </Reveal>
            </section>

            {/* BOTTOM CTA */}
            <Reveal>
              <div style={{ padding:"clamp(36px,6vw,60px) clamp(24px,5vw,52px)",borderRadius:22,textAlign:"center",background:"linear-gradient(135deg,rgba(14,165,233,.09) 0%,rgba(99,102,241,.11) 50%,rgba(251,191,36,.055) 100%)",border:"1px solid rgba(14,165,233,.18)",position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,#0ea5e9,#6366f1,transparent)" }} />
                <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(14,165,233,.07) 0%,transparent 70%)",pointerEvents:"none" }} />
                <Tag color="#00d4ff">Start Free</Tag>
                <h2 style={{ fontSize:"clamp(1.5rem,4.5vw,2.3rem)",fontWeight:800,color:"#f1f5f9",margin:"16px 0 12px",letterSpacing:"-.02em" }}>Ready to build your future?</h2>
                <p style={{ fontSize:14.5,color:"rgba(255,255,255,.38)",maxWidth:400,margin:"0 auto 32px",lineHeight:1.7 }}>Join thousands of learners already transforming their careers on CodeNFacts.</p>
                <div className="d-cta-btns" style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
                  <a href="https://codenfacts.in/courses" className="d-ghost" style={{ padding:"13px 30px",borderRadius:10,border:"1px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.04)",color:"rgba(255,255,255,.68)",fontWeight:600,fontSize:14.5 }}>
                    Browse Courses →
                  </a>
                </div>
              </div>
            </Reveal>

          </main>
        </div>
      </div>
    </div>
  );
}