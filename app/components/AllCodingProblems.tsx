"use client";

import React, { useMemo, useState, useEffect } from "react";

type Difficulty = "Easy" | "Medium" | "Hard";

interface CodingProblem {
  id: number;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  companies: string[];
  description: string;
}

const TOPICS = [
  "Array", "String", "Hash Table", "Dynamic Programming", "Math",
  "Sorting", "Greedy", "Depth-First Search", "Binary Search", "Database",
  "Breadth-First Search", "Tree", "Matrix", "Two Pointers", "Bit Manipulation",
  "Stack", "Heap (Priority Queue)", "Graph", "Design", "Prefix Sum",
  "Simulation", "Counting", "Backtracking", "Sliding Window", "Union Find",
  "Linked List", "Ordered Set", "Monotonic Stack", "Enumeration", "Recursion",
  "Trie", "Divide and Conquer", "Binary Search Tree", "Segment Tree",
  "Binary Indexed Tree", "Geometry", "Memoization", "Queue", "Topological Sort",
  "Number Theory", "Shortest Path", "Combinatorics", "Binary Tree",
  "Rolling Hash", "Game Theory", "Interactive", "Data Stream", "Monotonic Queue",
  "Brainteaser", "Doubly-Linked List", "Randomized", "Merge Sort", "Counting Sort",
];

const COMPANIES = [
  "Amazon", "Google", "Meta", "Microsoft", "Apple", "Bloomberg", "Uber",
  "LinkedIn", "Adobe", "Oracle", "Netflix", "Airbnb", "Twitter", "Salesforce",
  "Goldman Sachs", "JPMorgan", "Tesla", "Stripe", "Shopify", "Spotify",
  "Walmart", "IBM", "Intel", "Nvidia", "Cisco", "VMware", "PayPal", "eBay",
  "Yahoo", "Snap", "Pinterest", "Dropbox", "Square", "Twilio", "Atlassian",
  "ServiceNow", "Intuit", "Accenture", "Infosys", "TCS", "Wipro", "Cognizant",
];

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

const TITLE_TEMPLATES = [
  "Two Sum", "Add Two Numbers", "Longest Substring Without Repeating Characters",
  "Median of Two Sorted Arrays", "Longest Palindromic Substring", "Zigzag Conversion",
  "Reverse Integer", "String to Integer (atoi)", "Palindrome Number",
  "Regular Expression Matching", "Container With Most Water", "Integer to Roman",
  "Roman to Integer", "Longest Common Prefix", "3Sum", "3Sum Closest",
  "Letter Combinations of a Phone Number", "4Sum", "Remove Nth Node From End of List",
  "Valid Parentheses", "Merge Two Sorted Lists", "Generate Parentheses",
  "Merge k Sorted Lists", "Swap Nodes in Pairs", "Reverse Nodes in k-Group",
  "Remove Duplicates from Sorted Array", "Remove Element", "Find the Index of the First Occurrence",
  "Divide Two Integers", "Substring with Concatenation of All Words", "Next Permutation",
  "Longest Valid Parentheses", "Search in Rotated Sorted Array", "Find First and Last Position",
  "Search Insert Position", "Valid Sudoku", "Sudoku Solver", "Count and Say",
  "Combination Sum", "Combination Sum II", "First Missing Positive", "Trapping Rain Water",
  "Wildcard Matching", "Jump Game II", "Permutations", "Permutations II",
  "Rotate Image", "Group Anagrams", "Pow(x, n)", "N-Queens", "N-Queens II",
  "Maximum Subarray", "Spiral Matrix", "Jump Game", "Merge Intervals",
  "Insert Interval", "Spiral Matrix II", "Permutation Sequence", "Rotate List",
  "Unique Paths", "Unique Paths II", "Minimum Path Sum", "Valid Number",
  "Plus One", "Add Binary", "Text Justification", "Sqrt(x)", "Climbing Stairs",
  "Simplify Path", "Edit Distance", "Set Matrix Zeroes", "Search a 2D Matrix",
  "Sort Colors", "Minimum Window Substring", "Combinations", "Subsets",
  "Word Search", "Remove Duplicates from Sorted Array II", "Search in Rotated Sorted Array II",
  "Remove Duplicates from Sorted List II", "Remove Duplicates from Sorted List",
  "Largest Rectangle in Histogram", "Maximal Rectangle", "Partition List",
  "Scramble String", "Merge Sorted Array", "Gray Code", "Subsets II",
  "Decode Ways", "Reverse Linked List II", "Restore IP Addresses",
  "Binary Tree Inorder Traversal", "Unique Binary Search Trees II",
  "Unique Binary Search Trees", "Interleaving String", "Validate Binary Search Tree",
  "Recover Binary Search Tree", "Same Tree", "Symmetric Tree", "Binary Tree Level Order Traversal",
  "Binary Tree Zigzag Level Order Traversal", "Maximum Depth of Binary Tree",
  "Construct Binary Tree from Preorder and Inorder Traversal",
  "Construct Binary Tree from Inorder and Postorder Traversal",
  "Binary Tree Level Order Traversal II", "Convert Sorted Array to Binary Search Tree",
  "Convert Sorted List to Binary Search Tree", "Balanced Binary Tree",
  "Minimum Depth of Binary Tree", "Path Sum", "Path Sum II", "Flatten Binary Tree to Linked List",
  "Distinct Subsequences", "Populating Next Right Pointers in Each Node",
  "Populating Next Right Pointers in Each Node II", "Pascal's Triangle",
  "Pascal's Triangle II", "Triangle", "Best Time to Buy and Sell Stock",
  "Best Time to Buy and Sell Stock II", "Best Time to Buy and Sell Stock III",
  "Binary Tree Maximum Path Sum", "Valid Palindrome", "Word Ladder II", "Word Ladder",
  "Longest Consecutive Sequence", "Sum Root to Leaf Numbers", "Surrounded Regions",
  "Palindrome Partitioning", "Palindrome Partitioning II", "Clone Graph",
  "Gas Station", "Candy", "Single Number", "Single Number II", "Copy List with Random Pointer",
  "Word Break", "Word Break II", "Linked List Cycle", "Linked List Cycle II",
  "Reorder List", "Binary Tree Preorder Traversal", "Binary Tree Postorder Traversal",
  "LRU Cache", "Insertion Sort List", "Sort List", "Max Points on a Line",
  "Evaluate Reverse Polish Notation", "Reverse Words in a String", "Maximum Product Subarray",
  "Find Minimum in Rotated Sorted Array", "Find Minimum in Rotated Sorted Array II",
  "Min Stack", "Intersection of Two Linked Lists", "Find Peak Element",
  "Compare Version Numbers", "Fraction to Recurring Decimal", "Two Sum II",
  "Excel Sheet Column Title", "Majority Element", "Excel Sheet Column Number",
  "Factorial Trailing Zeroes", "Binary Search Tree Iterator", "Dungeon Game",
  "Largest Number", "Repeated DNA Sequences", "Best Time to Buy and Sell Stock IV",
  "Rotate Array", "Reverse Bits", "Number of 1 Bits", "House Robber",
  "Binary Tree Right Side View", "Number of Islands", "Bitwise AND of Numbers Range",
  "Happy Number", "Remove Linked List Elements", "Count Primes", "Isomorphic Strings",
  "Reverse Linked List", "Course Schedule", "Implement Trie", "Minimum Size Subarray Sum",
  "Course Schedule II", "Design Add and Search Words Data Structure", "Word Search II",
  "House Robber II", "Shortest Palindrome", "Kth Largest Element in an Array",
  "Combination Sum III", "Contains Duplicate", "The Skyline Problem",
  "Contains Duplicate II", "Contains Duplicate III", "Maximal Square",
  "Count Complete Tree Nodes", "Rectangle Area", "Basic Calculator II",
  "Majority Element II", "Kth Smallest Element in a BST", "Power of Two",
  "Implement Queue using Stacks", "Number of Digit One", "Palindrome Linked List",
  "Lowest Common Ancestor of a Binary Search Tree", "Lowest Common Ancestor of a Binary Tree",
  "Delete Node in a Linked List", "Product of Array Except Self", "Sliding Window Maximum",
  "Search a 2D Matrix II", "Different Ways to Add Parentheses", "Valid Anagram",
  "Binary Tree Paths", "Add Digits", "Ugly Number", "Ugly Number II",
  "Missing Number", "Integer to English Words", "H-Index", "H-Index II",
  "First Bad Version", "Perfect Squares", "Move Zeroes", "Peeking Iterator",
  "Find the Duplicate Number", "Game of Life", "Word Pattern", "Nim Game",
  "Find Median from Data Stream", "Serialize and Deserialize Binary Tree",
  "Bulls and Cows", "Longest Increasing Subsequence", "Remove Invalid Parentheses",
  "Count of Smaller Numbers After Self", "Range Sum Query - Immutable",
  "Range Sum Query 2D - Immutable", "Additive Number", "Range Sum Query - Mutable",
  "Best Time to Buy and Sell Stock with Cooldown", "Minimum Height Trees",
  "Burst Balloons", "Super Ugly Number", "Count of Range Sum", "Power of Three",
  "Count Numbers with Unique Digits", "Max Sum of Rectangle No Larger Than K",
  "Design Twitter", "Russian Doll Envelopes", "Wiggle Sort II", "Integer Break",
  "Power of Four", "Reverse String", "Reverse Vowels of a String", "Moving Average from Data Stream",
  "Top K Frequent Elements", "Intersection of Two Arrays", "Intersection of Two Arrays II",
  "Data Stream as Disjoint Intervals", "Design Snake Game",
  "Valid Perfect Square", "Largest Divisible Subset", "Sum of Two Integers",
  "Super Pow", "Find K Pairs with Smallest Sums", "Guess Number Higher or Lower",
  "Guess Number Higher or Lower II", "Wiggle Subsequence", "Combination Sum IV",
  "Kth Smallest Element in a Sorted Matrix", "Insert Delete GetRandom O(1)",
  "Insert Delete GetRandom O(1) - Duplicates allowed", "Linked List Random Node",
  "Ransom Note", "First Unique Character in a String", "Find the Difference",
  "Is Subsequence", "UTF-8 Validation", "Decode String", "Longest Substring with At Most K",
  "Longest Repeating Character Replacement", "Pacific Atlantic Water Flow",
  "Battleships in a Board", "Strong Password Checker", "Maximum XOR of Two Numbers",
  "Valid Word Abbreviation", "Longest Absolute File Path", "Find All Anagrams in a String",
  "Kth Smallest in Lexicographical Order", "Lexicographical Numbers", "First Unique Number",
  "Find All Numbers Disappeared in an Array", "Design Circular Queue", "Design Circular Deque",
  "Flatten Nested List Iterator", "Add Two Numbers II", "Minimum Moves to Equal Array Elements",
  "Predict the Winner", "Non-overlapping Intervals", "Find Right Interval",
  "Path Sum III", "Find All Duplicates in an Array", "String Compression",
  "Arranging Coins", "Binary Watch", "Sum of Left Leaves", "Convert a Number to Hexadecimal",
  "Queue Reconstruction by Height", "Trapping Rain Water II", "Valid Word Square",
  "Longest Palindrome", "Split Array Largest Sum", "Fizz Buzz", "Arithmetic Slices",
  "Third Maximum Number", "Add Strings", "Partition Equal Subset Sum", "Sentence Screen Fitting",
  "Maximum XOR of Two Numbers in an Array", "Find All Anagrams", "K-th Smallest in Lexicographical Order",
  "First Unique Number in Data Stream", "Find All Disappeared Numbers",
];

const DESCRIPTION_TEMPLATES = [
  "Given an array of integers, solve the classic problem efficiently.",
  "Design an efficient algorithm for this data structure problem.",
  "Find the optimal solution using dynamic programming techniques.",
  "Implement a solution with optimal time and space complexity.",
  "Solve this graph traversal problem using BFS or DFS.",
  "Use two pointers or sliding window to achieve linear time.",
  "Apply binary search to find the answer in logarithmic time.",
  "Handle edge cases carefully while processing the linked list.",
  "Build a tree or use recursion to compute the required result.",
  "Combine multiple data structures to support the required operations.",
  "Greedy approach yields the optimal result for this problem.",
  "Backtracking is needed to explore all valid combinations.",
  "Use bit manipulation to solve this problem in constant space.",
  "Prefix sums or cumulative techniques simplify the calculation.",
  "Simulate the process carefully while tracking necessary state.",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickRandom<T>(arr: T[], seed: number, count = 1): T[] {
  const result: T[] = [];
  const used = new Set<number>();
  let s = seed;
  while (result.length < Math.min(count, arr.length)) {
    s = (s * 9301 + 49297) % 233280;
    const idx = Math.floor(seededRandom(s) * arr.length);
    if (!used.has(idx)) {
      used.add(idx);
      result.push(arr[idx]);
    }
  }
  return result;
}

function generateProblems(count: number): CodingProblem[] {
  const problems: CodingProblem[] = [];
  const usedTitles = new Set<string>();

  for (let i = 1; i <= count; i++) {
    const seed = i * 7919;
    let baseTitle = TITLE_TEMPLATES[i % TITLE_TEMPLATES.length];
    let title = baseTitle;

    if (i > TITLE_TEMPLATES.length) {
      const variant = Math.floor((i - 1) / TITLE_TEMPLATES.length);
      const suffixes = ["", " II", " III", " IV", " V", " Variant", " Advanced", " Optimized"];
      const prefix = ["", "Find ", "Count ", "Maximum ", "Minimum ", "Check ", "Design "];
      const suf = suffixes[variant % suffixes.length];
      const pre = variant > 3 ? prefix[variant % prefix.length] : "";
      title = `${pre}${baseTitle}${suf}`.trim();
      if (variant > 7) {
        title = `${baseTitle} (${i})`;
      }
    }

    let uniqueTitle = title;
    let attempt = 0;
    while (usedTitles.has(uniqueTitle)) {
      attempt++;
      uniqueTitle = `${title} #${attempt}`;
    }
    usedTitles.add(uniqueTitle);

    const r = seededRandom(seed + 1);
    let difficulty: Difficulty;
    if (r < 0.28) difficulty = "Easy";
    else if (r < 0.72) difficulty = "Medium";
    else difficulty = "Hard";

    const topicCount = 1 + Math.floor(seededRandom(seed + 2) * 4);
    const topics = pickRandom(TOPICS, seed + 3, topicCount);

    const companyCount = 1 + Math.floor(seededRandom(seed + 4) * 5);
    const companies = pickRandom(COMPANIES, seed + 5, companyCount);

    const descIdx = Math.floor(seededRandom(seed + 6) * DESCRIPTION_TEMPLATES.length);
    const description = DESCRIPTION_TEMPLATES[descIdx];

    problems.push({
      id: i,
      title: uniqueTitle,
      difficulty,
      topics,
      companies,
      description,
    });
  }

  return problems;
}

const TOTAL_PROBLEMS = 3200;
const ALL_PROBLEMS = generateProblems(TOTAL_PROBLEMS);

const ALL_TOPICS = Array.from(new Set(ALL_PROBLEMS.flatMap((p) => p.topics))).sort();
const ALL_COMPANIES = Array.from(new Set(ALL_PROBLEMS.flatMap((p) => p.companies))).sort();

const difficultyColors: Record<Difficulty, string> = {
  Easy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  Hard: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
};

const PAGE_SIZE = 20;

export default function AllCodingProblems() {
  const [search, setSearch] = useState("");
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showTopicFilter, setShowTopicFilter] = useState(false);
  const [showCompanyFilter, setShowCompanyFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDifficulties, selectedTopics, selectedCompanies]);

  const filteredProblems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_PROBLEMS.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.id.toString().includes(q) ||
        p.topics.some((t) => t.toLowerCase().includes(q)) ||
        p.companies.some((c) => c.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q);

      const matchesDifficulty =
        selectedDifficulties.length === 0 ||
        selectedDifficulties.includes(p.difficulty);

      const matchesTopics =
        selectedTopics.length === 0 ||
        selectedTopics.every((t) => p.topics.includes(t));

      const matchesCompanies =
        selectedCompanies.length === 0 ||
        selectedCompanies.some((c) => p.companies.includes(c));

      return matchesSearch && matchesDifficulty && matchesTopics && matchesCompanies;
    });
  }, [search, selectedDifficulties, selectedTopics, selectedCompanies]);

  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const pageProblems = filteredProblems.slice(startIdx, startIdx + PAGE_SIZE);

  const toggleDifficulty = (d: Difficulty) => {
    setSelectedDifficulties((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const toggleTopic = (t: string) => {
    setSelectedTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const toggleCompany = (c: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedDifficulties([]);
    setSelectedTopics([]);
    setSelectedCompanies([]);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search ||
    selectedDifficulties.length > 0 ||
    selectedTopics.length > 0 ||
    selectedCompanies.length > 0;

  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const delta = 2;
    const left = Math.max(2, safePage - delta);
    const right = Math.min(totalPages - 1, safePage + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <section className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            All Coding Problems
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {TOTAL_PROBLEMS.toLocaleString()}+ coding interview style problems.
            Search, filter by difficulty, topics & companies.
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
            Showing {filteredProblems.length === 0 ? 0 : startIdx + 1}-
            {Math.min(startIdx + PAGE_SIZE, filteredProblems.length)} of{" "}
            {filteredProblems.length.toLocaleString()} problems
            {hasActiveFilters && " (filtered)"}
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by title, ID, topic, company or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-indigo-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Difficulty:
            </span>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => toggleDifficulty(d)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  selectedDifficulties.includes(d)
                    ? difficultyColors[d] +
                      " ring-2 ring-offset-1 ring-current dark:ring-offset-gray-950"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowTopicFilter((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                selectedTopics.length > 0
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              Topics
              {selectedTopics.length > 0 && (
                <span className="rounded-full bg-indigo-600 px-1.5 text-xs text-white">
                  {selectedTopics.length}
                </span>
              )}
              <svg
                className={`h-4 w-4 transition ${showTopicFilter ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <button
              onClick={() => setShowCompanyFilter((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                selectedCompanies.length > 0
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              Companies
              {selectedCompanies.length > 0 && (
                <span className="rounded-full bg-indigo-600 px-1.5 text-xs text-white">
                  {selectedCompanies.length}
                </span>
              )}
              <svg
                className={`h-4 w-4 transition ${showCompanyFilter ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Clear all
              </button>
            )}
          </div>

          {showTopicFilter && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/60">
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {ALL_TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTopic(t)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      selectedTopics.includes(t)
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showCompanyFilter && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/60">
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {ALL_COMPANIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCompany(c)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      selectedCompanies.includes(c)
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredProblems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-900/40">
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              No problems match your filters
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                      #{problem.id}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyColors[problem.difficulty]}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <h3 className="mb-2 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
                    {problem.title}
                  </h3>

                  {expandedId === problem.id ? (
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {problem.description}
                    </p>
                  ) : (
                    <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-500">
                      {problem.description}
                    </p>
                  )}

                  <button
                    onClick={() =>
                      setExpandedId(expandedId === problem.id ? null : problem.id)
                    }
                    className="mb-3 self-start text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    {expandedId === problem.id ? "Show less" : "Show more"}
                  </button>

                  <div className="mt-auto space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {problem.topics.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        >
                          {t}
                        </span>
                      ))}
                      {problem.topics.length > 4 && (
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500 dark:bg-gray-800">
                          +{problem.topics.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {problem.companies.slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                        >
                          {c}
                        </span>
                      ))}
                      {problem.companies.length > 3 && (
                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                          +{problem.companies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {safePage} of {totalPages.toLocaleString()}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-1">
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage <= 1}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Previous
                </button>

                {getPageNumbers().map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-gray-400 dark:text-gray-600"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p as number)}
                      className={`min-w-[2.25rem] rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                        p === safePage
                          ? "bg-indigo-600 text-white"
                          : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage >= totalPages}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}