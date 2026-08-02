"use client";

/**
 * Advanced DSA — category page
 * ------------------------------------------------------------------
 * Drop this file at: app/category/advanced-dsa/page.tsx
 *
 * Assumes:
 *  - Tailwind CSS with `darkMode: "class"` in tailwind.config
 *  - A header elsewhere in the app that toggles the `dark` class on
 *    <html> (or a parent element) — this page reacts to that class
 *    automatically via Tailwind's `dark:` variants. No local toggle
 *    is rendered here on purpose, since you said the toggle already
 *    lives in your header.
 *  - lucide-react is installed (`npm i lucide-react`) for icons.
 *
 * Everything is self-contained: content data, the "Download DSA
 * notes" button (generates a .md file client-side, no backend),
 * and a small thank-you toast on download.
 * ------------------------------------------------------------------
 */

import { useMemo, useState } from "react";
import {
  BookOpen,
  Boxes,
  Brain,
  ChevronDown,
  Download,
  GitBranch,
  Layers,
  ListTree,
  Network,
  Sigma,
  Sparkles,
  Target,
  Workflow,
  CheckCircle2,
  Code2,
  Gauge,
} from "lucide-react";

/* ============================================================================
   DATA — Topics (the core notes)
============================================================================ */

type Topic = {
  id: string;
  index: string;
  title: string;
  category: "Linear" | "Non-Linear" | "Algorithmic Technique" | "Foundation";
  summary: string;
  points: string[];
  example: { lang: string; code: string };
  time: string;
  space: string;
};

const TOPICS: Topic[] = [
  {
    id: "complexity",
    index: "00",
    title: "Complexity Analysis (Big-O)",
    category: "Foundation",
    summary:
      "The language used to describe how an algorithm's running time or memory use grows as input size (n) grows. It lets you compare algorithms without running them.",
    points: [
      "O(1) constant — arithmetic, array index lookup",
      "O(log n) logarithmic — binary search, balanced BST operations",
      "O(n) linear — single loop over input",
      "O(n log n) linearithmic — merge sort, heap sort, most efficient comparison sorts",
      "O(n^2) quadratic — nested loops, bubble sort",
      "O(2^n) exponential — brute-force subsets/recursion without memoization",
      "O(n!) factorial — brute-force permutations",
      "Big-O = worst case, Big-Omega = best case, Big-Theta = tight bound",
    ],
    example: {
      lang: "text",
      code:
        "O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(n^3) < O(2^n) < O(n!)\n\nRule of thumb:\n- Drop constants: O(2n) -> O(n)\n- Drop lower-order terms: O(n^2 + n) -> O(n^2)\n- Different inputs get different variables: O(a + b), not O(n)",
    },
    time: "context dependent",
    space: "context dependent",
  },
  {
    id: "arrays",
    index: "01",
    title: "Arrays",
    category: "Linear",
    summary:
      "A contiguous block of memory holding elements of the same type, accessed by index. The foundation almost every other data structure is built on top of.",
    points: [
      "Random access by index in O(1)",
      "Insertion/deletion in the middle costs O(n) due to shifting",
      "Cache-friendly because of memory contiguity",
      "Common patterns: prefix sums, two pointers, sliding window, Kadane's algorithm",
      "Dynamic arrays (e.g. ArrayList/Vector) resize by doubling capacity — amortized O(1) push",
    ],
    example: {
      lang: "javascript",
      code:
        "// Kadane's Algorithm — max subarray sum, O(n)\nfunction maxSubArray(nums) {\n  let best = nums[0], cur = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    cur = Math.max(nums[i], cur + nums[i]);\n    best = Math.max(best, cur);\n  }\n  return best;\n}",
    },
    time: "Access O(1), Search O(n), Insert/Delete O(n)",
    space: "O(n)",
  },
  {
    id: "strings",
    index: "02",
    title: "Strings",
    category: "Linear",
    summary:
      "An array of characters with its own family of pattern-matching and manipulation algorithms — a topic large enough to be treated on its own.",
    points: [
      "Immutable in many languages (JS, Java, Python) — mutation creates a new string",
      "Pattern matching: naive O(n*m), KMP O(n+m), Rabin-Karp with rolling hash",
      "Common problems: palindromes, anagrams, substring search, string compression",
      "Two-pointer and sliding window techniques apply directly to strings",
    ],
    example: {
      lang: "javascript",
      code:
        "// Check palindrome with two pointers, O(n)\nfunction isPalindrome(s) {\n  let l = 0, r = s.length - 1;\n  while (l < r) {\n    if (s[l] !== s[r]) return false;\n    l++; r--;\n  }\n  return true;\n}",
    },
    time: "Search O(n) naive, O(n+m) KMP",
    space: "O(1) to O(n) depending on approach",
  },
  {
    id: "linked-list",
    index: "03",
    title: "Linked List",
    category: "Linear",
    summary:
      "A chain of nodes where each node stores data plus a pointer to the next (and previous, for doubly linked lists). No contiguous memory needed.",
    points: [
      "Singly, doubly, and circular variants",
      "O(1) insertion/deletion once you have a reference to the node",
      "No random access — must traverse from head, O(n) to reach index i",
      "Classic technique: fast & slow pointers (Floyd's cycle detection, find middle node)",
      "Reversal, merging two sorted lists, and cycle detection are the most-asked interview problems",
    ],
    example: {
      lang: "javascript",
      code:
        "// Detect cycle — Floyd's Tortoise and Hare, O(n) time, O(1) space\nfunction hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}",
    },
    time: "Access O(n), Insert/Delete O(1) at known node",
    space: "O(n)",
  },
  {
    id: "stack",
    index: "04",
    title: "Stack",
    category: "Linear",
    summary:
      "A LIFO (Last In, First Out) structure — the last element pushed is the first one popped. Backs recursion, undo systems, and expression parsing.",
    points: [
      "Core ops: push, pop, peek — all O(1)",
      "Used for: balanced parentheses, expression evaluation, DFS iterative form",
      "Monotonic stack pattern: next greater/smaller element in O(n)",
      "The call stack itself is what makes recursion possible",
    ],
    example: {
      lang: "javascript",
      code:
        "// Valid parentheses using a stack, O(n)\nfunction isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  for (const ch of s) {\n    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);\n    else if (stack.pop() !== pairs[ch]) return false;\n  }\n  return stack.length === 0;\n}",
    },
    time: "Push/Pop/Peek O(1)",
    space: "O(n)",
  },
  {
    id: "queue",
    index: "05",
    title: "Queue, Deque & Priority Queue",
    category: "Linear",
    summary:
      "FIFO (First In, First Out): the first element added is the first removed. Deque allows insertion/removal from both ends; a priority queue pops by priority, not order.",
    points: [
      "Core ops: enqueue, dequeue — O(1) with a proper circular buffer or linked list",
      "BFS traversal on trees/graphs always relies on a queue",
      "Deque powers the sliding-window-maximum technique",
      "Priority queue (usually backed by a heap) powers Dijkstra, Prim's, and top-K problems",
    ],
    example: {
      lang: "javascript",
      code:
        "// Sliding window maximum using a monotonic deque, O(n)\nfunction maxSlidingWindow(nums, k) {\n  const dq = [], res = [];\n  for (let i = 0; i < nums.length; i++) {\n    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();\n    dq.push(i);\n    if (dq[0] <= i - k) dq.shift();\n    if (i >= k - 1) res.push(nums[dq[0]]);\n  }\n  return res;\n}",
    },
    time: "Enqueue/Dequeue O(1)",
    space: "O(n)",
  },
  {
    id: "hashing",
    index: "06",
    title: "Hashing (HashMap / HashSet)",
    category: "Foundation",
    summary:
      "Maps keys to array indices via a hash function, giving average O(1) lookup, insert, and delete — the single most impactful trick for turning O(n^2) into O(n).",
    points: [
      "Collision handling: chaining (linked lists/trees per bucket) or open addressing",
      "Average O(1) but worst case O(n) if many collisions occur",
      "Frequency counting, two-sum, grouping anagrams — all hashing problems",
      "HashSet is a HashMap that only cares about key existence",
    ],
    example: {
      lang: "javascript",
      code:
        "// Two Sum using a hash map, O(n)\nfunction twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}",
    },
    time: "Average O(1), Worst O(n)",
    space: "O(n)",
  },
  {
    id: "recursion-backtracking",
    index: "07",
    title: "Recursion & Backtracking",
    category: "Algorithmic Technique",
    summary:
      "Recursion solves a problem by solving smaller versions of itself. Backtracking is recursion + explicit undo — explore a choice, recurse, then revert the choice ('un-choose') to try the next one.",
    points: [
      "Every recursive function needs a base case and a recursive case",
      "Backtracking template: choose → explore → un-choose",
      "Classic problems: N-Queens, subsets, permutations, combination sum, Sudoku solver",
      "Watch for exponential blowup — add pruning to cut dead branches early",
    ],
    example: {
      lang: "javascript",
      code:
        "// Generate all subsets — backtracking template\nfunction subsets(nums) {\n  const res = [], path = [];\n  function backtrack(start) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);      // choose\n      backtrack(i + 1);        // explore\n      path.pop();              // un-choose\n    }\n  }\n  backtrack(0);\n  return res;\n}",
    },
    time: "Often O(2^n) or O(n!)",
    space: "O(n) recursion depth",
  },
  {
    id: "trees",
    index: "08",
    title: "Trees & Binary Search Trees",
    category: "Non-Linear",
    summary:
      "A hierarchical structure of nodes with a single root and no cycles. A Binary Search Tree (BST) additionally keeps left < node < right, enabling O(log n) search when balanced.",
    points: [
      "Traversals: pre-order, in-order, post-order (DFS-based), level-order (BFS-based)",
      "In-order traversal of a BST yields sorted output",
      "Balanced trees (AVL, Red-Black) guarantee O(log n) height",
      "An unbalanced BST degrades to a linked list — O(n) worst case",
      "Lowest Common Ancestor, diameter, and height are the most common tree problems",
    ],
    example: {
      lang: "javascript",
      code:
        "// In-order traversal, O(n)\nfunction inorder(root, out = []) {\n  if (!root) return out;\n  inorder(root.left, out);\n  out.push(root.val);\n  inorder(root.right, out);\n  return out;\n}",
    },
    time: "Search/Insert/Delete O(log n) balanced, O(n) worst",
    space: "O(n)",
  },
  {
    id: "heap",
    index: "09",
    title: "Heap / Priority Queue",
    category: "Non-Linear",
    summary:
      "A complete binary tree stored in an array where every parent is smaller (min-heap) or larger (max-heap) than its children. Gives instant access to the smallest/largest element.",
    points: [
      "peek O(1), insert/extract O(log n)",
      "Build-heap from an array is O(n), not O(n log n)",
      "Classic uses: top-K elements, median of a stream (two heaps), Dijkstra's algorithm, heap sort",
      "Array-based indexing: children of i are 2i+1 and 2i+2, parent is (i-1)/2",
    ],
    example: {
      lang: "javascript",
      code:
        "// Kth largest element via min-heap of size k (conceptual)\n// Push each num, if heap.size() > k then pop the smallest.\n// Root of the heap after processing all nums = kth largest.",
    },
    time: "Insert/Extract O(log n), Peek O(1)",
    space: "O(n)",
  },
  {
    id: "graphs",
    index: "10",
    title: "Graphs (BFS, DFS, Shortest Path, Union-Find)",
    category: "Non-Linear",
    summary:
      "A set of vertices connected by edges — models networks, maps, dependencies, and relationships. The single richest topic in DSA with the most algorithm variety.",
    points: [
      "Representations: adjacency list (sparse, most common) vs adjacency matrix (dense)",
      "BFS — shortest path in unweighted graphs, level-order exploration, uses a queue",
      "DFS — path existence, cycle detection, topological sort, uses a stack/recursion",
      "Dijkstra's algorithm — shortest path with non-negative weights, uses a min-heap",
      "Bellman-Ford — shortest path with negative weights, detects negative cycles",
      "Union-Find (Disjoint Set) — cycle detection in undirected graphs, Kruskal's MST",
      "Topological sort — valid ordering of tasks with dependencies (DAGs only)",
    ],
    example: {
      lang: "javascript",
      code:
        "// BFS shortest path on unweighted graph, O(V + E)\nfunction bfs(graph, start) {\n  const dist = { [start]: 0 };\n  const queue = [start];\n  while (queue.length) {\n    const node = queue.shift();\n    for (const next of graph[node] || []) {\n      if (!(next in dist)) {\n        dist[next] = dist[node] + 1;\n        queue.push(next);\n      }\n    }\n  }\n  return dist;\n}",
    },
    time: "BFS/DFS O(V+E), Dijkstra O((V+E) log V)",
    space: "O(V + E)",
  },
  {
    id: "trie",
    index: "11",
    title: "Trie (Prefix Tree)",
    category: "Non-Linear",
    summary:
      "A tree where each path from root to a node represents a prefix of a string. Purpose-built for prefix search — autocomplete, spell-check, and word dictionaries.",
    points: [
      "Each node has up to 26 children (for lowercase English) plus an end-of-word flag",
      "Insert and search cost O(L) where L = length of the word, independent of dictionary size",
      "Beats a HashSet when you need prefix queries (startsWith), not just exact matches",
    ],
    example: {
      lang: "javascript",
      code:
        "class TrieNode { children = {}; isEnd = false; }\nclass Trie {\n  root = new TrieNode();\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      node.children[ch] ??= new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n}",
    },
    time: "Insert/Search O(L)",
    space: "O(N * L)",
  },
  {
    id: "dp",
    index: "12",
    title: "Dynamic Programming",
    category: "Algorithmic Technique",
    summary:
      "Break a problem into overlapping subproblems, solve each once, and cache the result. The difference between DP and plain recursion is memoization (top-down) or tabulation (bottom-up).",
    points: [
      "Applies only when a problem has 'optimal substructure' and 'overlapping subproblems'",
      "Top-down = recursion + memo cache; Bottom-up = iterative table filling",
      "Signature patterns: 0/1 Knapsack, Longest Common Subsequence, Longest Increasing Subsequence, Matrix Chain Multiplication, Coin Change, Edit Distance",
      "Space optimization: most 2D DP tables can be compressed to a single 1D rolling array",
    ],
    example: {
      lang: "javascript",
      code:
        "// 0/1 Knapsack, O(n * capacity)\nfunction knapsack(weights, values, capacity) {\n  const dp = new Array(capacity + 1).fill(0);\n  for (let i = 0; i < weights.length; i++) {\n    for (let w = capacity; w >= weights[i]; w--) {\n      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);\n    }\n  }\n  return dp[capacity];\n}",
    },
    time: "Typically O(n * m) for a 2D state space",
    space: "O(n * m), often reducible to O(m)",
  },
  {
    id: "greedy",
    index: "13",
    title: "Greedy Algorithms",
    category: "Algorithmic Technique",
    summary:
      "Make the locally optimal choice at every step, hoping it leads to a globally optimal solution. Works only when the problem has the 'greedy choice property'.",
    points: [
      "Faster than DP when applicable, since there's no need to explore all subproblems",
      "Classic problems: activity selection, Huffman coding, fractional knapsack, Kruskal's/Prim's MST",
      "Always ask: 'can I prove the greedy choice is safe?' — if not, DP is likely the correct tool",
    ],
    example: {
      lang: "javascript",
      code:
        "// Activity selection — max non-overlapping intervals, O(n log n)\nfunction maxActivities(intervals) {\n  intervals.sort((a, b) => a[1] - b[1]);\n  let count = 0, lastEnd = -Infinity;\n  for (const [start, end] of intervals) {\n    if (start >= lastEnd) { count++; lastEnd = end; }\n  }\n  return count;\n}",
    },
    time: "Usually O(n log n) due to sorting",
    space: "O(1) to O(n)",
  },
  {
    id: "sorting",
    index: "14",
    title: "Sorting Algorithms",
    category: "Algorithmic Technique",
    summary:
      "Arranging data in order. Sorting is a prerequisite for binary search, greedy algorithms, and many two-pointer techniques.",
    points: [
      "Comparison sorts (Merge, Quick, Heap) have a proven lower bound of O(n log n)",
      "Non-comparison sorts (Counting, Radix, Bucket) can beat O(n log n) for restricted inputs",
      "Merge sort is stable and O(n log n) guaranteed; quicksort is faster on average but O(n^2) worst case",
      "Stability matters when sorting objects by a secondary key",
    ],
    example: {
      lang: "javascript",
      code:
        "// Merge sort, O(n log n) guaranteed\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = arr.length >> 1;\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  const out = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length)\n    out.push(left[i] <= right[j] ? left[i++] : right[j++]);\n  return [...out, ...left.slice(i), ...right.slice(j)];\n}",
    },
    time: "O(n log n) best-in-class comparison sort",
    space: "O(n) for merge sort, O(log n) for quicksort",
  },
  {
    id: "searching",
    index: "15",
    title: "Searching Algorithms",
    category: "Algorithmic Technique",
    summary:
      "Finding a target value or condition inside a dataset — from simple linear scans to binary search and its many disguised variants.",
    points: [
      "Linear search — O(n), works on unsorted data",
      "Binary search — O(log n), requires sorted (or monotonic) data",
      "'Binary search on the answer' — used when the search space is a range of possible answers, not the array itself",
      "Exponential search, jump search, interpolation search are specialized variants",
    ],
    example: {
      lang: "javascript",
      code:
        "// Binary search, O(log n)\nfunction binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}",
    },
    time: "O(log n) binary, O(n) linear",
    space: "O(1)",
  },
  {
    id: "bit-manipulation",
    index: "16",
    title: "Bit Manipulation",
    category: "Algorithmic Technique",
    summary:
      "Operating directly on the binary representation of numbers. Enables constant-time tricks and drastic space savings for boolean state.",
    points: [
      "AND (&), OR (|), XOR (^), NOT (~), left shift (<<), right shift (>>)",
      "x & (x - 1) clears the lowest set bit — used to count set bits",
      "x ^ x = 0 and x ^ 0 = x — the basis of the 'find the single non-duplicate' trick",
      "Bitmasks represent subsets efficiently — common in DP over subsets",
    ],
    example: {
      lang: "javascript",
      code:
        "// Find the single number where every other appears twice, O(n)\nfunction singleNumber(nums) {\n  return nums.reduce((a, b) => a ^ b, 0);\n}",
    },
    time: "O(1) per operation",
    space: "O(1)",
  },
  {
    id: "two-pointer-sliding-window",
    index: "17",
    title: "Two Pointers & Sliding Window",
    category: "Algorithmic Technique",
    summary:
      "Two pointers move through a structure (often from both ends or at different speeds) to avoid nested loops. Sliding window is a specialized two-pointer form for contiguous subarrays/substrings.",
    points: [
      "Opposite-direction pointers: pair sums in a sorted array, container with most water",
      "Same-direction (fast/slow) pointers: remove duplicates in place, cycle detection",
      "Fixed-size window: max sum of every subarray of size k",
      "Variable-size window: expand right, shrink left when a constraint is violated",
    ],
    example: {
      lang: "javascript",
      code:
        "// Longest substring without repeating characters, O(n)\nfunction lengthOfLongestSubstring(s) {\n  const seen = new Map();\n  let left = 0, best = 0;\n  for (let right = 0; right < s.length; right++) {\n    if (seen.has(s[right]) && seen.get(s[right]) >= left) {\n      left = seen.get(s[right]) + 1;\n    }\n    seen.set(s[right], right);\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}",
    },
    time: "O(n)",
    space: "O(1) to O(n)",
  },
  {
    id: "segment-fenwick",
    index: "18",
    title: "Segment Tree & Fenwick Tree (BIT)",
    category: "Non-Linear",
    summary:
      "Advanced structures for answering range queries (sum, min, max) and performing range/point updates in O(log n), instead of recomputing over the whole array each time.",
    points: [
      "Segment tree — a binary tree over array ranges, supports range queries and updates in O(log n)",
      "Fenwick Tree / Binary Indexed Tree (BIT) — a more compact structure for prefix-sum queries and point updates, also O(log n), with a smaller constant factor",
      "Used heavily in competitive programming for range-sum, range-min, and inversion-count problems",
    ],
    example: {
      lang: "javascript",
      code:
        "// Fenwick Tree point update + prefix sum, O(log n)\nclass FenwickTree {\n  constructor(n) { this.tree = new Array(n + 1).fill(0); }\n  update(i, delta) {\n    for (; i < this.tree.length; i += i & -i) this.tree[i] += delta;\n  }\n  prefixSum(i) {\n    let sum = 0;\n    for (; i > 0; i -= i & -i) sum += this.tree[i];\n    return sum;\n  }\n}",
    },
    time: "Build O(n), Query/Update O(log n)",
    space: "O(n)",
  },
  {
    id: "divide-and-conquer",
    index: "19",
    title: "Divide and Conquer",
    category: "Algorithmic Technique",
    summary:
      "Split a problem into independent subproblems, solve each recursively, then combine the results. The master theorem gives the resulting time complexity directly from the recurrence.",
    points: [
      "Divide → Conquer (solve recursively) → Combine",
      "Merge sort, quick sort, binary search, and the 'closest pair of points' problem are classic examples",
      "Master Theorem: T(n) = aT(n/b) + f(n) gives a direct formula for the final complexity",
    ],
    example: {
      lang: "text",
      code:
        "Master Theorem (simplified):\nT(n) = a*T(n/b) + O(n^d)\n\nif d > log_b(a): T(n) = O(n^d)\nif d = log_b(a): T(n) = O(n^d log n)\nif d < log_b(a): T(n) = O(n^log_b(a))",
    },
    time: "Depends on recurrence — usually O(n log n)",
    space: "O(log n) recursion stack (typical)",
  },
];

/* ============================================================================
   DATA — Curated problems, grouped by topic
============================================================================ */

type Problem = { name: string; difficulty: "Easy" | "Medium" | "Hard" };
type ProblemGroup = { topic: string; problems: Problem[] };

const PROBLEM_GROUPS: ProblemGroup[] = [
  {
    topic: "Arrays & Strings",
    problems: [
      { name: "Two Sum", difficulty: "Easy" },
      { name: "Best Time to Buy and Sell Stock", difficulty: "Easy" },
      { name: "Maximum Subarray (Kadane's)", difficulty: "Medium" },
      { name: "Product of Array Except Self", difficulty: "Medium" },
      { name: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
      { name: "Trapping Rain Water", difficulty: "Hard" },
    ],
  },
  {
    topic: "Linked List",
    problems: [
      { name: "Reverse a Linked List", difficulty: "Easy" },
      { name: "Detect Cycle in a Linked List", difficulty: "Easy" },
      { name: "Merge Two Sorted Lists", difficulty: "Easy" },
      { name: "Remove Nth Node From End", difficulty: "Medium" },
      { name: "Merge k Sorted Lists", difficulty: "Hard" },
    ],
  },
  {
    topic: "Stack & Queue",
    problems: [
      { name: "Valid Parentheses", difficulty: "Easy" },
      { name: "Min Stack", difficulty: "Medium" },
      { name: "Next Greater Element", difficulty: "Medium" },
      { name: "Largest Rectangle in Histogram", difficulty: "Hard" },
      { name: "Sliding Window Maximum", difficulty: "Hard" },
    ],
  },
  {
    topic: "Trees & BST",
    problems: [
      { name: "Maximum Depth of Binary Tree", difficulty: "Easy" },
      { name: "Validate Binary Search Tree", difficulty: "Medium" },
      { name: "Lowest Common Ancestor", difficulty: "Medium" },
      { name: "Binary Tree Level Order Traversal", difficulty: "Medium" },
      { name: "Serialize and Deserialize Binary Tree", difficulty: "Hard" },
    ],
  },
  {
    topic: "Heap",
    problems: [
      { name: "Kth Largest Element in an Array", difficulty: "Medium" },
      { name: "Top K Frequent Elements", difficulty: "Medium" },
      { name: "Find Median from Data Stream", difficulty: "Hard" },
      { name: "Merge k Sorted Arrays", difficulty: "Hard" },
    ],
  },
  {
    topic: "Graphs",
    problems: [
      { name: "Number of Islands", difficulty: "Medium" },
      { name: "Course Schedule (Topological Sort)", difficulty: "Medium" },
      { name: "Clone Graph", difficulty: "Medium" },
      { name: "Network Delay Time (Dijkstra)", difficulty: "Medium" },
      { name: "Word Ladder", difficulty: "Hard" },
      { name: "Alien Dictionary", difficulty: "Hard" },
    ],
  },
  {
    topic: "Dynamic Programming",
    problems: [
      { name: "Climbing Stairs", difficulty: "Easy" },
      { name: "House Robber", difficulty: "Medium" },
      { name: "Longest Increasing Subsequence", difficulty: "Medium" },
      { name: "Coin Change", difficulty: "Medium" },
      { name: "Edit Distance", difficulty: "Hard" },
      { name: "Regular Expression Matching", difficulty: "Hard" },
    ],
  },
  {
    topic: "Backtracking",
    problems: [
      { name: "Subsets", difficulty: "Medium" },
      { name: "Permutations", difficulty: "Medium" },
      { name: "Combination Sum", difficulty: "Medium" },
      { name: "N-Queens", difficulty: "Hard" },
      { name: "Sudoku Solver", difficulty: "Hard" },
    ],
  },
  {
    topic: "Trie",
    problems: [
      { name: "Implement Trie (Prefix Tree)", difficulty: "Medium" },
      { name: "Word Search II", difficulty: "Hard" },
      { name: "Design Add and Search Words Data Structure", difficulty: "Medium" },
    ],
  },
  {
    topic: "Advanced Structures",
    problems: [
      { name: "Range Sum Query — Mutable (Fenwick Tree)", difficulty: "Medium" },
      { name: "Count of Smaller Numbers After Self", difficulty: "Hard" },
      { name: "Number of Connected Components (Union-Find)", difficulty: "Medium" },
    ],
  },
];

/* ============================================================================
   DATA — Cheat sheets
============================================================================ */

const DS_COMPLEXITY = [
  { name: "Array", access: "O(1)", search: "O(n)", insert: "O(n)", delete: "O(n)" },
  { name: "Linked List", access: "O(n)", search: "O(n)", insert: "O(1)", delete: "O(1)" },
  { name: "Stack / Queue", access: "O(n)", search: "O(n)", insert: "O(1)", delete: "O(1)" },
  { name: "Hash Map", access: "—", search: "O(1)*", insert: "O(1)*", delete: "O(1)*" },
  { name: "Balanced BST", access: "O(log n)", search: "O(log n)", insert: "O(log n)", delete: "O(log n)" },
  { name: "Heap", access: "O(1) top", search: "O(n)", insert: "O(log n)", delete: "O(log n)" },
  { name: "Trie", access: "O(L)", search: "O(L)", insert: "O(L)", delete: "O(L)" },
];

const SORT_COMPLEXITY = [
  { name: "Bubble Sort", best: "O(n)", avg: "O(n^2)", worst: "O(n^2)", space: "O(1)", stable: "Yes" },
  { name: "Selection Sort", best: "O(n^2)", avg: "O(n^2)", worst: "O(n^2)", space: "O(1)", stable: "No" },
  { name: "Insertion Sort", best: "O(n)", avg: "O(n^2)", worst: "O(n^2)", space: "O(1)", stable: "Yes" },
  { name: "Merge Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: "Yes" },
  { name: "Quick Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n^2)", space: "O(log n)", stable: "No" },
  { name: "Heap Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: "No" },
  { name: "Counting Sort", best: "O(n+k)", avg: "O(n+k)", worst: "O(n+k)", space: "O(k)", stable: "Yes" },
  { name: "Radix Sort", best: "O(nk)", avg: "O(nk)", worst: "O(nk)", space: "O(n+k)", stable: "Yes" },
];

const TECHNIQUES = [
  {
    name: "Two Pointers",
    when: "Sorted array, pair/triplet sums, palindrome checks",
    icon: Target,
  },
  {
    name: "Sliding Window",
    when: "Contiguous subarray/substring with a constraint",
    icon: Layers,
  },
  {
    name: "Fast & Slow Pointers",
    when: "Cycle detection, finding the middle of a linked list",
    icon: GitBranch,
  },
  {
    name: "Prefix Sum",
    when: "Range sum queries, subarray sum equals K",
    icon: Sigma,
  },
  {
    name: "Binary Search on Answer",
    when: "Minimize/maximize a value over a monotonic search space",
    icon: Target,
  },
  {
    name: "Backtracking Template",
    when: "Generate all subsets, permutations, combinations, board puzzles",
    icon: Workflow,
  },
  {
    name: "Union-Find (DSU)",
    when: "Dynamic connectivity, cycle detection, Kruskal's MST",
    icon: Network,
  },
  {
    name: "Topological Sort",
    when: "Task scheduling, course prerequisites, build order",
    icon: ListTree,
  },
  {
    name: "Monotonic Stack",
    when: "Next greater/smaller element, histogram, temperatures",
    icon: Boxes,
  },
  {
    name: "DP: Knapsack Pattern",
    when: "Choose subset under a capacity constraint",
    icon: Brain,
  },
  {
    name: "DP: LIS / LCS Pattern",
    when: "Subsequence comparison and ordering problems",
    icon: Brain,
  },
  {
    name: "Bitmask DP",
    when: "Small n (≤ ~20), track subsets as integers",
    icon: Sigma,
  },
];

/* ============================================================================
   Downloadable notes — full markdown text
============================================================================ */

function buildNotesMarkdown() {
  const header = `# Advanced DSA Notes\n\nA complete, topic-by-topic reference: what each structure/technique is, when to use it, complexity, and a worked example.\n\n---\n`;

  const topicSections = TOPICS.map((t) => {
    const pts = t.points.map((p) => `- ${p}`).join("\n");
    return `## ${t.index}. ${t.title}  _(${t.category})_\n\n${t.summary}\n\n**Key points**\n${pts}\n\n**Time complexity:** ${t.time}\n**Space complexity:** ${t.space}\n\n**Example**\n\n\`\`\`${t.example.lang}\n${t.example.code}\n\`\`\`\n`;
  }).join("\n---\n\n");

  const cheatSheet = `\n---\n\n## Cheat Sheet — Data Structure Operations\n\n| Structure | Access | Search | Insert | Delete |\n|---|---|---|---|---|\n${DS_COMPLEXITY.map(
    (d) => `| ${d.name} | ${d.access} | ${d.search} | ${d.insert} | ${d.delete} |`
  ).join("\n")}\n\n_* amortized average case; hash collisions can push this to O(n) worst case._\n\n## Cheat Sheet — Sorting Algorithms\n\n| Algorithm | Best | Average | Worst | Space | Stable |\n|---|---|---|---|---|---|\n${SORT_COMPLEXITY.map(
    (s) => `| ${s.name} | ${s.best} | ${s.avg} | ${s.worst} | ${s.space} | ${s.stable} |`
  ).join("\n")}\n`;

  const techniques = `\n---\n\n## Problem-Solving Techniques — Quick Reference\n\n${TECHNIQUES.map(
    (t) => `- **${t.name}** — ${t.when}`
  ).join("\n")}\n`;

  const problems = `\n---\n\n## Practice Problem List\n\n${PROBLEM_GROUPS.map(
    (g) =>
      `### ${g.topic}\n${g.problems.map((p) => `- [ ] ${p.name} _(${p.difficulty})_`).join("\n")}`
  ).join("\n\n")}\n`;

  return header + "\n" + topicSections + cheatSheet + techniques + problems;
}

/* ============================================================================
   UI helpers
============================================================================ */

function DifficultyBadge({ level }: { level: Problem["difficulty"] }) {
  const styles: Record<Problem["difficulty"], string> = {
    Easy: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/30",
    Medium:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/30",
    Hard: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-400 dark:ring-rose-400/30",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-mono font-medium ring-1 ring-inset ${styles[level]}`}
    >
      {level}
    </span>
  );
}

function SectionEyebrow({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="font-mono text-xs tracking-widest text-cyan-600 dark:text-cyan-400">
        {index}
      </span>
      <span className="h-px flex-1 max-w-10 bg-slate-300 dark:bg-slate-700" />
      <span className="font-mono text-xs tracking-widest uppercase text-slate-500 dark:text-slate-400">
        {label}
      </span>
    </div>
  );
}

/* ============================================================================
   Hero diagram — a small graph/traversal motif (signature element)
============================================================================ */

function TraversalDiagram() {
  return (
    <svg
      viewBox="0 0 460 300"
      className="w-full h-auto max-w-xl mx-auto"
      role="img"
      aria-label="Graph traversal diagram connecting DSA topic nodes"
    >
      <defs>
        <style>
          {`
            .dsa-edge { stroke: currentColor; stroke-width: 1.5; opacity: 0.35; }
            .dsa-path {
              stroke: #06b6d4;
              stroke-width: 2.5;
              stroke-dasharray: 6 8;
              animation: dsa-flow 3.5s linear infinite;
              fill: none;
            }
            @keyframes dsa-flow {
              to { stroke-dashoffset: -140; }
            }
            .dsa-node-text { font-family: ui-monospace, monospace; font-size: 11px; }
          `}
        </style>
      </defs>

      <g className="text-slate-400 dark:text-slate-600">
        <line className="dsa-edge" x1="70" y1="60" x2="220" y2="40" />
        <line className="dsa-edge" x1="220" y1="40" x2="380" y2="70" />
        <line className="dsa-edge" x1="70" y1="60" x2="90" y2="180" />
        <line className="dsa-edge" x1="220" y1="40" x2="230" y2="150" />
        <line className="dsa-edge" x1="380" y1="70" x2="370" y2="190" />
        <line className="dsa-edge" x1="90" y1="180" x2="230" y2="150" />
        <line className="dsa-edge" x1="230" y1="150" x2="370" y2="190" />
        <line className="dsa-edge" x1="90" y1="180" x2="170" y2="260" />
        <line className="dsa-edge" x1="230" y1="150" x2="270" y2="260" />
        <line className="dsa-edge" x1="370" y1="190" x2="270" y2="260" />
      </g>

      {/* Highlighted traversal path — represents a BFS/DFS walk */}
      <path
        className="dsa-path"
        d="M 70 60 L 220 40 L 230 150 L 370 190 L 270 260"
      />

      {[
        { x: 70, y: 60, label: "Array" },
        { x: 220, y: 40, label: "Tree" },
        { x: 380, y: 70, label: "Graph" },
        { x: 90, y: 180, label: "Stack" },
        { x: 230, y: 150, label: "Heap" },
        { x: 370, y: 190, label: "Trie" },
        { x: 170, y: 260, label: "DP" },
        { x: 270, y: 260, label: "Greedy" },
      ].map((n) => (
        <g key={n.label}>
          <circle
            cx={n.x}
            cy={n.y}
            r="16"
            className="fill-white dark:fill-slate-900 stroke-cyan-600 dark:stroke-cyan-400"
            strokeWidth="2"
          />
          <text
            x={n.x}
            y={n.y + 32}
            textAnchor="middle"
            className="dsa-node-text fill-slate-600 dark:fill-slate-300"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ============================================================================
   Main page component
============================================================================ */

export default function AdvancedDSAPage() {
  const [openTopic, setOpenTopic] = useState<string | null>(TOPICS[1].id);
  const [showThanks, setShowThanks] = useState(false);

  const notesMarkdown = useMemo(() => buildNotesMarkdown(), []);

  function handleDownload() {
    const blob = new Blob([notesMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Advanced-DSA-Notes.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setShowThanks(true);
    window.setTimeout(() => setShowThanks(false), 4500);
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {/* faint blueprint grid background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35] dark:opacity-[0.25]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(100,116,139,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,116,139,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ================= HERO ================= */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-600 dark:text-cyan-400 mb-4">
            Category / Advanced DSA
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
            Data Structures
            <br />& Algorithms
          </h1>
          <p className="mt-5 text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
            DSA is the study of how to organize data (structures) and the
            step-by-step procedures (algorithms) that operate on it
            efficiently. Every fast app, search engine, map route, and
            recommendation feed is DSA applied at scale.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownload}
              className="group inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-medium px-5 py-2.5 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              Download DSA Notes
            </button>
            <a
              href="#topics"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 px-5 py-2.5 font-medium text-slate-700 dark:text-slate-200 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Browse Topics
            </a>
          </div>

          {showThanks && (
            <div
              role="status"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-400/10 ring-1 ring-emerald-200 dark:ring-emerald-400/30 px-4 py-2.5 text-sm text-emerald-700 dark:text-emerald-400"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Thank you for downloading! Happy learning — go build something
              with it. 🎉
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-6">
          <TraversalDiagram />
          <p className="text-center font-mono text-[11px] text-slate-400 dark:text-slate-500 mt-2">
            a traversal walking through the topic graph
          </p>
        </div>
      </section>

      {/* ================= WHAT / WHY / NEED ================= */}
      <section className="max-w-6xl mx-auto px-6 py-14 border-t border-slate-200 dark:border-slate-800">
        <SectionEyebrow index="§1" label="Foundations" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <Boxes className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mb-3" />
            <h3 className="font-semibold text-lg mb-2">What is DSA?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              DSA stands for <strong>Data Structures and Algorithms</strong>.
              A data structure is a way of organizing data (arrays, trees,
              graphs...). An algorithm is a finite, well-defined sequence of
              steps that solves a problem or transforms that data.
              Together, they decide whether a program runs in milliseconds
              or minutes.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <Gauge className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Why it's used</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The right structure/algorithm turns an O(n²) brute force into
              an O(n log n) or O(n) solution — the difference between a
              feature that scales to millions of users and one that times
              out. It's also the shared vocabulary engineers use to reason
              about performance and trade-offs.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Why it's needed</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Real systems face limited memory, limited time, and growing
              input sizes. DSA gives you a toolkit to model a problem
              correctly, predict how a solution behaves at scale, and pick
              the cheapest correct approach — it's also the core of most
              technical interviews.
            </p>
          </div>
        </div>

        {/* Types of DSA */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Types of Data Structures
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <li>
                <strong>Linear:</strong> Array, Linked List, Stack, Queue —
                elements arranged sequentially.
              </li>
              <li>
                <strong>Non-Linear:</strong> Tree, Graph, Heap, Trie —
                elements arranged hierarchically or as networks.
              </li>
              <li>
                <strong>Homogeneous vs Heterogeneous:</strong> arrays hold
                one type; structs/objects can hold mixed types.
              </li>
              <li>
                <strong>Static vs Dynamic:</strong> fixed-size arrays vs
                resizable structures (dynamic arrays, linked structures).
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Types of Algorithms
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <li>
                <strong>Brute Force:</strong> try every possibility, correct
                but slow.
              </li>
              <li>
                <strong>Divide & Conquer:</strong> split, solve, combine
                (merge sort, quick sort).
              </li>
              <li>
                <strong>Greedy:</strong> best local choice at each step.
              </li>
              <li>
                <strong>Dynamic Programming:</strong> cache overlapping
                subproblem results.
              </li>
              <li>
                <strong>Backtracking:</strong> explore, then undo invalid
                choices.
              </li>
              <li>
                <strong>Graph Algorithms:</strong> BFS, DFS, shortest path,
                MST, topological sort.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= TOPICS (detailed notes) ================= */}
      <section id="topics" className="max-w-6xl mx-auto px-6 py-14 border-t border-slate-200 dark:border-slate-800">
        <SectionEyebrow index="§2" label="Detailed Notes — All Topics" />
        <h2 className="text-2xl font-bold mb-2">Every topic, explained</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
          Tap a topic to expand its notes: a plain-language summary, the key
          facts worth memorizing, a worked code example, and its time/space
          complexity.
        </p>

        <div className="space-y-3">
          {TOPICS.map((t) => {
            const isOpen = openTopic === t.id;
            return (
              <div
                key={t.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/40"
              >
                <button
                  onClick={() => setOpenTopic(isOpen ? null : t.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 w-6 shrink-0">
                      {t.index}
                    </span>
                    <div>
                      <p className="font-semibold">{t.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t.category}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                      {t.summary}
                    </p>

                    <ul className="mt-4 space-y-1.5">
                      {t.points.map((p, i) => (
                        <li
                          key={i}
                          className="text-sm text-slate-600 dark:text-slate-300 flex gap-2"
                        >
                          <span className="text-cyan-600 dark:text-cyan-400 mt-0.5">
                            ▸
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono">
                      <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-700 dark:text-slate-300">
                        Time: {t.time}
                      </span>
                      <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-700 dark:text-slate-300">
                        Space: {t.space}
                      </span>
                    </div>

                    <div className="mt-4 rounded-lg bg-slate-900 dark:bg-black overflow-x-auto">
                      <div className="flex items-center gap-2 px-4 pt-3 text-slate-400 text-xs font-mono">
                        <Code2 className="w-3.5 h-3.5" />
                        example
                      </div>
                      <pre className="px-4 pb-4 pt-2 text-[13px] leading-relaxed text-slate-100 font-mono whitespace-pre">
{t.example.code}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= TECHNIQUES ================= */}
      <section className="max-w-6xl mx-auto px-6 py-14 border-t border-slate-200 dark:border-slate-800">
        <SectionEyebrow index="§3" label="Techniques & Patterns" />
        <h2 className="text-2xl font-bold mb-2">Pattern recognition toolkit</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
          Most interview and contest problems are a known pattern in
          disguise. Recognizing the pattern is 80% of the battle.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECHNIQUES.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.name}
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-cyan-400 dark:hover:border-cyan-500 transition-colors"
              >
                <Icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mb-3" />
                <h3 className="font-semibold text-sm">{t.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {t.when}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CHEAT SHEETS ================= */}
      <section className="max-w-6xl mx-auto px-6 py-14 border-t border-slate-200 dark:border-slate-800">
        <SectionEyebrow index="§4" label="Cheat Sheets" />
        <h2 className="text-2xl font-bold mb-8">Complexity at a glance</h2>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Data structure operations
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">Structure</th>
                    <th className="px-4 py-3 font-medium">Access</th>
                    <th className="px-4 py-3 font-medium">Search</th>
                    <th className="px-4 py-3 font-medium">Insert</th>
                    <th className="px-4 py-3 font-medium">Delete</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {DS_COMPLEXITY.map((d, i) => (
                    <tr
                      key={d.name}
                      className={
                        i % 2 === 0
                          ? "bg-white dark:bg-slate-950"
                          : "bg-slate-50/60 dark:bg-slate-900/40"
                      }
                    >
                      <td className="px-4 py-2.5 font-sans">{d.name}</td>
                      <td className="px-4 py-2.5">{d.access}</td>
                      <td className="px-4 py-2.5">{d.search}</td>
                      <td className="px-4 py-2.5">{d.insert}</td>
                      <td className="px-4 py-2.5">{d.delete}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Sorting algorithms
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">Algorithm</th>
                    <th className="px-4 py-3 font-medium">Best</th>
                    <th className="px-4 py-3 font-medium">Worst</th>
                    <th className="px-4 py-3 font-medium">Space</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {SORT_COMPLEXITY.map((s, i) => (
                    <tr
                      key={s.name}
                      className={
                        i % 2 === 0
                          ? "bg-white dark:bg-slate-950"
                          : "bg-slate-50/60 dark:bg-slate-900/40"
                      }
                    >
                      <td className="px-4 py-2.5 font-sans">{s.name}</td>
                      <td className="px-4 py-2.5">{s.best}</td>
                      <td className="px-4 py-2.5">{s.worst}</td>
                      <td className="px-4 py-2.5">{s.space}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Big-O growth diagram */}
        <div className="mt-10 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Big-O growth, smallest to largest
          </h3>
          <div className="flex flex-wrap items-end gap-2 font-mono text-xs">
            {[
              { label: "O(1)", h: 8 },
              { label: "O(log n)", h: 20 },
              { label: "O(n)", h: 40 },
              { label: "O(n log n)", h: 60 },
              { label: "O(n²)", h: 90 },
              { label: "O(2ⁿ)", h: 130 },
              { label: "O(n!)", h: 170 },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-2">
                <div
                  className="w-10 rounded-t bg-gradient-to-t from-cyan-600 to-cyan-400 dark:from-cyan-500 dark:to-cyan-300"
                  style={{ height: `${b.h}px` }}
                />
                <span className="text-slate-500 dark:text-slate-400">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROBLEMS ================= */}
      <section className="max-w-6xl mx-auto px-6 py-14 border-t border-slate-200 dark:border-slate-800">
        <SectionEyebrow index="§5" label="Practice Problems" />
        <h2 className="text-2xl font-bold mb-2">Problems, grouped by topic</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
          Work through each group in order. Solve Easy first to lock in the
          pattern, then Medium/Hard to stress-test it.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {PROBLEM_GROUPS.map((g) => (
            <div
              key={g.topic}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
            >
              <h3 className="font-semibold mb-3">{g.topic}</h3>
              <ul className="space-y-2">
                {g.problems.map((p) => (
                  <li
                    key={p.name}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-slate-700 dark:text-slate-300">
                      {p.name}
                    </span>
                    <DifficultyBadge level={p.difficulty} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DOWNLOAD CTA (footer of content) ================= */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="rounded-2xl bg-slate-900 dark:bg-slate-900/60 dark:ring-1 dark:ring-slate-800 text-white px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Take the full notes with you
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
            One Markdown file with every topic above, both cheat sheets, all
            techniques, and the full problem checklist — ready to open in
            any editor or note-taking app.
          </p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium px-6 py-3 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download DSA Notes
          </button>

          {showThanks && (
            <div
              role="status"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-400/10 ring-1 ring-emerald-400/30 px-4 py-2.5 text-sm text-emerald-300 mx-auto"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Thanks for downloading — good luck with your practice! 🎉
            </div>
          )}
        </div>
      </section>
    </main>
  );
}