"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  CheckCircle2,
  Circle,
  ListTree,
  Boxes,
  GitBranch,
  Network,
  Hash,
  Layers,
  Binary,
  Workflow,
  Sigma,
  Repeat,
  ArrowUpDown,
  Grid3x3,
  TreePine,
  Link2,
  Puzzle,
  Gauge,
  Code2,
  Sparkles,
} from "lucide-react";


type Topic = {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

type Category = {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  description: string;
  topics: Topic[];
};

const categories: Category[] = [
  {
    id: "basics",
    title: "Fundamentals",
    icon: Code2,
    color: "emerald",
    description: "Time/space complexity, recursion, math foundations.",
    topics: [
      { name: "Time & Space Complexity (Big-O)", difficulty: "Easy" },
      { name: "Recursion & Backtracking Basics", difficulty: "Medium" },
      { name: "Bit Manipulation", difficulty: "Medium" },
      { name: "Number Theory (GCD, Primes, Sieve)", difficulty: "Medium" },
      { name: "Modular Arithmetic", difficulty: "Easy" },
    ],
  },
  {
    id: "arrays",
    title: "Arrays & Strings",
    icon: Grid3x3,
    color: "cyan",
    description: "The foundation of almost every interview question.",
    topics: [
      { name: "Two Pointers", difficulty: "Easy" },
      { name: "Sliding Window", difficulty: "Medium" },
      { name: "Prefix Sum / Difference Array", difficulty: "Easy" },
      { name: "Kadane's Algorithm", difficulty: "Medium" },
      { name: "String Matching (KMP, Z-function)", difficulty: "Hard" },
      { name: "Sorting Algorithms (Merge, Quick, Heap)", difficulty: "Medium" },
    ],
  },
  {
    id: "linkedlist",
    title: "Linked Lists",
    icon: Link2,
    color: "teal",
    description: "Pointer manipulation and in-place restructuring.",
    topics: [
      { name: "Singly & Doubly Linked List Ops", difficulty: "Easy" },
      { name: "Fast & Slow Pointers (Cycle Detection)", difficulty: "Medium" },
      { name: "Reversal (Iterative & Recursive)", difficulty: "Medium" },
      { name: "Merge K Sorted Lists", difficulty: "Hard" },
    ],
  },
  {
    id: "stacks-queues",
    title: "Stacks & Queues",
    icon: Layers,
    color: "sky",
    description: "LIFO/FIFO structures and their derived patterns.",
    topics: [
      { name: "Stack Fundamentals", difficulty: "Easy" },
      { name: "Monotonic Stack", difficulty: "Medium" },
      { name: "Queue & Circular Queue", difficulty: "Easy" },
      { name: "Deque Applications", difficulty: "Medium" },
      { name: "Min/Max Stack Design", difficulty: "Medium" },
    ],
  },
  {
    id: "trees",
    title: "Trees",
    icon: TreePine,
    color: "green",
    description: "Hierarchical structures: traversal, balancing, queries.",
    topics: [
      { name: "Binary Tree Traversals (DFS/BFS)", difficulty: "Easy" },
      { name: "Binary Search Trees", difficulty: "Medium" },
      { name: "AVL / Red-Black Trees", difficulty: "Hard" },
      { name: "Segment Trees", difficulty: "Hard" },
      { name: "Fenwick Tree (BIT)", difficulty: "Hard" },
      { name: "Trie (Prefix Tree)", difficulty: "Medium" },
      { name: "Lowest Common Ancestor (LCA)", difficulty: "Medium" },
    ],
  },
  {
    id: "heaps",
    title: "Heaps & Priority Queues",
    icon: Sigma,
    color: "amber",
    description: "Efficient min/max retrieval and scheduling problems.",
    topics: [
      { name: "Min-Heap / Max-Heap Basics", difficulty: "Easy" },
      { name: "Top-K Elements Pattern", difficulty: "Medium" },
      { name: "Merge Intervals via Heap", difficulty: "Medium" },
      { name: "Median Finder (Two Heaps)", difficulty: "Hard" },
    ],
  },
  {
    id: "graphs",
    title: "Graphs",
    icon: Network,
    color: "violet",
    description: "Connectivity, shortest paths, and network flow.",
    topics: [
      { name: "Graph Representations (Adj List/Matrix)", difficulty: "Easy" },
      { name: "BFS & DFS", difficulty: "Easy" },
      { name: "Topological Sort", difficulty: "Medium" },
      { name: "Union-Find (Disjoint Set)", difficulty: "Medium" },
      { name: "Dijkstra's Algorithm", difficulty: "Medium" },
      { name: "Bellman-Ford & Floyd-Warshall", difficulty: "Hard" },
      { name: "Minimum Spanning Tree (Kruskal/Prim)", difficulty: "Hard" },
      { name: "Network Flow (Ford-Fulkerson)", difficulty: "Hard" },
    ],
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    icon: Boxes,
    color: "rose",
    description: "Optimal substructure & overlapping subproblems.",
    topics: [
      { name: "1D DP (Fibonacci, Climbing Stairs)", difficulty: "Easy" },
      { name: "Knapsack (0/1, Unbounded)", difficulty: "Medium" },
      { name: "Longest Common Subsequence Family", difficulty: "Medium" },
      { name: "DP on Grids", difficulty: "Medium" },
      { name: "DP on Trees", difficulty: "Hard" },
      { name: "Bitmask DP", difficulty: "Hard" },
      { name: "Digit DP", difficulty: "Hard" },
    ],
  },
  {
    id: "greedy",
    title: "Greedy Algorithms",
    icon: Gauge,
    color: "orange",
    description: "Locally optimal choices that lead to global optima.",
    topics: [
      { name: "Activity Selection / Interval Scheduling", difficulty: "Medium" },
      { name: "Huffman Encoding", difficulty: "Medium" },
      { name: "Job Sequencing with Deadlines", difficulty: "Medium" },
      { name: "Greedy + Sorting Patterns", difficulty: "Easy" },
    ],
  },
  {
    id: "backtracking",
    title: "Backtracking & Recursion",
    icon: GitBranch,
    color: "fuchsia",
    description: "Exhaustive search with pruning.",
    topics: [
      { name: "Permutations & Combinations", difficulty: "Medium" },
      { name: "N-Queens Problem", difficulty: "Hard" },
      { name: "Sudoku Solver", difficulty: "Hard" },
      { name: "Subset Sum / Partition Problems", difficulty: "Medium" },
    ],
  },
  {
    id: "hashing",
    title: "Hashing",
    icon: Hash,
    color: "lime",
    description: "Constant-time lookups and collision handling.",
    topics: [
      { name: "HashMap / HashSet Internals", difficulty: "Easy" },
      { name: "Collision Handling Techniques", difficulty: "Medium" },
      { name: "Rolling Hash / Rabin-Karp", difficulty: "Hard" },
    ],
  },
  {
    id: "binary-search",
    title: "Binary Search & Sorting",
    icon: ArrowUpDown,
    color: "indigo",
    description: "Search space reduction patterns beyond the basics.",
    topics: [
      { name: "Binary Search on Answer", difficulty: "Medium" },
      { name: "Search in Rotated Sorted Array", difficulty: "Medium" },
      { name: "Order Statistics (Kth Smallest)", difficulty: "Medium" },
    ],
  },
  {
    id: "advanced",
    title: "Advanced / Misc",
    icon: Puzzle,
    color: "pink",
    description: "Specialized topics that show up in tougher rounds.",
    topics: [
      { name: "Sliding Window Maximum (Deque)", difficulty: "Hard" },
      { name: "Matrix Exponentiation", difficulty: "Hard" },
      { name: "Sparse Table (Range Queries)", difficulty: "Hard" },
      { name: "String Algorithms (Manacher's, Suffix Array)", difficulty: "Hard" },
      { name: "Game Theory (Nim, Grundy Numbers)", difficulty: "Hard" },
    ],
  },
];

const difficultyStyles: Record<Topic["difficulty"], string> = {
  Easy: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
  Medium:
    "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
  Hard: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20",
};

const colorIconClass: Record<string, string> = {
  emerald: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
  cyan:    "text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10",
  teal:    "text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10",
  sky:     "text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10",
  green:   "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10",
  amber:   "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
  violet:  "text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10",
  rose:    "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10",
  orange:  "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10",
  fuchsia: "text-fuchsia-700 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-500/10",
  lime:    "text-lime-700 dark:text-lime-400 bg-lime-50 dark:bg-lime-500/10",
  indigo:  "text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10",
  pink:    "text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10",
};

export default function MasterDsaTopics() {
  const [query, setQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set([categories[0].id])
  );
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const totalTopics = useMemo(
    () => categories.reduce((acc, c) => acc + c.topics.length, 0),
    []
  );

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleComplete = (key: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        topics: cat.topics.filter((t) => t.name.toLowerCase().includes(q)),
      }))
      .filter(
        (cat) =>
          cat.topics.length > 0 || cat.title.toLowerCase().includes(q)
      );
  }, [query]);

  const progressPercent = Math.round((completed.size / totalTopics) * 100);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 transition-colors duration-300">

      {/* Header */}
      <header className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-16">
        <div className="relative mx-auto max-w-5xl text-center">

          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-1.5 text-sm font-normal text-slate-600 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
            CodeNFacts Roadmap
          </span>

          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Master DSA {" "}
            Topics
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg font-normal text-slate-500 dark:text-slate-400">
            Every data structure &amp; algorithm topic you need - from arrays to
            advanced graph theory - organized into one trackable roadmap.
          </p>

          {/* Progress bar */}
          <div className="mx-auto mt-8 max-w-md">
            <div className="flex items-center justify-between text-xs font-mono font-normal text-slate-500 dark:text-slate-400 mb-1.5">
              <span>{completed.size} / {totalTopics} topics</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-lg">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm">
              <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics... e.g. 'Segment Tree'"
                className="flex-1 bg-transparent text-sm font-normal text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Category list */}
      <main className="mx-auto max-w-5xl px-4 sm:px-8 py-12 space-y-4">
        {filteredCategories.length === 0 && (
          <p className="text-center text-sm font-normal text-slate-500 dark:text-slate-400 py-12">
            No topics match &quot;{query}&quot;.
          </p>
        )}

        {filteredCategories.map((cat) => {
          const Icon = cat.icon;
          const isOpen = openCategories.has(cat.id);
          const doneInCat = cat.topics.filter((t) =>
            completed.has(`${cat.id}-${t.name}`)
          ).length;

          return (
            <div
              key={cat.id}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden transition-shadow hover:shadow-md dark:hover:shadow-slate-900/60"
            >
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className={`flex-shrink-0 rounded-lg p-2.5 ${colorIconClass[cat.color]}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {cat.title}
                    </h3>
                    <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-mono font-normal text-slate-400 dark:text-slate-500">
                    {doneInCat}/{cat.topics.length}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Topics list */}
              {isOpen && (
                <ul className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                  {cat.topics.map((topic) => {
                    const key = `${cat.id}-${topic.name}`;
                    const isDone = completed.has(key);
                    return (
                      <li
                        key={key}
                        onClick={() => toggleComplete(key)}
                        className="flex items-center justify-between gap-3 px-5 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm font-normal ${
                              isDone
                                ? "text-slate-400 dark:text-slate-500 line-through"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {topic.name}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-normal rounded-full border px-2.5 py-0.5 flex-shrink-0 ${
                            difficultyStyles[topic.difficulty]
                          }`}
                        >
                          {topic.difficulty}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </main>

      {/* Footer strip */}
      <footer className="border-t border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-10">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-normal text-slate-500 dark:text-slate-400">
            <ListTree className="h-4 w-4" />
            {categories.length} categories · {totalTopics} curated topics
          </div>
          <div className="flex items-center gap-2 text-sm font-normal text-slate-500 dark:text-slate-400">
            <Workflow className="h-4 w-4" />
            Click any topic to mark it complete
          </div>
          <div className="flex items-center gap-2 text-sm font-normal text-slate-500 dark:text-slate-400">
            <Binary className="h-4 w-4" />
            <Repeat className="h-4 w-4" />
            Progress saved locally for this session
          </div>
        </div>
      </footer>
    </div>
  );
}