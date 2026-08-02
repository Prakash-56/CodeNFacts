"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Puzzle,
  Search,
  ChevronDown,
  Lightbulb,
  CheckCircle2,
  Circle,
  Binary,
  Braces,
  GitBranch,
  Repeat,
  Layers,
  Network,
  Hash,
  Sigma,
  ListOrdered,
  ShieldCheck,
  Terminal,
  Sparkles,
  RotateCcw,
  Filter,
  type LucideIcon,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Difficulty = "Easy" | "Medium" | "Hard";

interface PuzzleItem {
  id: string;
  topic: string;
  difficulty: Difficulty;
  title: string;
  question: string;
  answer: string;
  explain: string;
}

// -----------------------------------------------------------------------------
// Topic list + icon map
// -----------------------------------------------------------------------------

const TOPICS = [
  "Arrays",
  "Strings",
  "Recursion",
  "Linked List",
  "Stacks & Queues",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Sorting & Searching",
  "Bit Manipulation",
  "Math & Number Theory",
  "OOP Concepts",
  "Output Prediction",
  "Logic & Aptitude",
] as const;

const TOPIC_ICON: Record<(typeof TOPICS)[number], LucideIcon> = {
  Arrays: Layers,
  Strings: Braces,
  Recursion: Repeat,
  "Linked List": GitBranch,
  "Stacks & Queues": ListOrdered,
  Trees: Network,
  Graphs: Network,
  "Dynamic Programming": Sigma,
  "Sorting & Searching": Filter,
  "Bit Manipulation": Binary,
  "Math & Number Theory": Hash,
  "OOP Concepts": ShieldCheck,
  "Output Prediction": Terminal,
  "Logic & Aptitude": Lightbulb,
};

// -----------------------------------------------------------------------------
// Puzzle bank — 55 puzzles across 14 coding topics
// TODO(backend): move this array to Firestore (collection: puzzles) and fetch
// server-side once the content needs to be editable without a redeploy.
// -----------------------------------------------------------------------------

const PUZZLES: PuzzleItem[] = [
  // ---------- Arrays ----------
  {
    id: "arr-1",
    topic: "Arrays",
    difficulty: "Easy",
    title: "The Missing Number",
    question:
      "An array holds n distinct numbers taken from 0 to n. One number is missing. How do you find it in O(n) time and O(1) space?",
    answer: "Use the sum formula: n(n+1)/2 - actualSum.",
    explain:
      "The expected sum of 0..n is n(n+1)/2. Subtract the array's actual sum from it — the difference is the missing number. No sorting or extra memory needed.",
  },
  {
    id: "arr-2",
    topic: "Arrays",
    difficulty: "Medium",
    title: "Two Sum",
    question:
      "Given an array and a target, find two numbers that add up to the target. What's the fastest approach beyond brute force?",
    answer: "A single pass with a hash map storing value → index.",
    explain:
      "For each number, check if (target - number) already exists in the map. If yes, you've found the pair. This runs in O(n) time instead of O(n²).",
  },
  {
    id: "arr-3",
    topic: "Arrays",
    difficulty: "Medium",
    title: "Kadane's Puzzle",
    question:
      "How do you find the maximum sum of a contiguous subarray in O(n) time?",
    answer: "Kadane's Algorithm: maxEndingHere = max(current, maxEndingHere + current).",
    explain:
      "Track the best sum ending at the current index. If adding the current element makes things worse than starting fresh, reset. Keep a running global maximum alongside it.",
  },
  {
    id: "arr-4",
    topic: "Arrays",
    difficulty: "Hard",
    title: "The Dutch National Flag",
    question:
      "Sort an array containing only 0s, 1s, and 2s in a single pass without extra space.",
    answer: "Three-pointer partition: low, mid, high.",
    explain:
      "Walk with `mid` from left to right. If arr[mid] is 0, swap with `low` and advance both. If 2, swap with `high` and shrink `high`. If 1, just move `mid` forward.",
  },
  {
    id: "arr-5",
    topic: "Arrays",
    difficulty: "Medium",
    title: "Rotate in Place",
    question: "Rotate an array right by k positions using O(1) extra space.",
    answer: "Reverse the whole array, then reverse each of the two segments.",
    explain:
      "Reversing the entire array followed by reversing the first k and remaining n-k elements produces a right rotation without any auxiliary array.",
  },
  {
    id: "arr-6",
    topic: "Arrays",
    difficulty: "Easy",
    title: "Duplicate Detective",
    question:
      "How can you detect a duplicate in an array of n+1 integers where each value is between 1 and n, without modifying the array or using extra space?",
    answer: "Floyd's Cycle Detection (treat the array as a linked list of indices).",
    explain:
      "Since values point to indices, following arr[arr[arr[...]]] forms a cycle whenever a duplicate exists. Floyd's tortoise-and-hare finds the entry point of that cycle.",
  },

  // ---------- Strings ----------
  {
    id: "str-1",
    topic: "Strings",
    difficulty: "Easy",
    title: "Anagram Check",
    question: "How do you check if two strings are anagrams of each other efficiently?",
    answer: "Compare sorted versions, or compare character-frequency counts.",
    explain:
      "Sorting both strings and comparing them costs O(n log n). A frequency-count array/map does it in O(n) by tallying characters from one string and decrementing with the other.",
  },
  {
    id: "str-2",
    topic: "Strings",
    difficulty: "Medium",
    title: "Longest Palindromic Substring",
    question: "What's an efficient way to find the longest palindromic substring?",
    answer: "Expand around center for every index (and every gap between indices).",
    explain:
      "For each position, expand outward while characters match — once for odd-length palindromes centered on the index, once for even-length centered between two indices. O(n²) time, O(1) space.",
  },
  {
    id: "str-3",
    topic: "Strings",
    difficulty: "Easy",
    title: "Reverse Words, Not Letters",
    question: "Reverse the word order in a sentence without reversing individual letters.",
    answer: "Split on spaces, reverse the array of words, join back.",
    explain:
      '"code and facts" becomes ["code","and","facts"] → reversed to ["facts","and","code"] → joined as "facts and code".',
  },
  {
    id: "str-4",
    topic: "Strings",
    difficulty: "Medium",
    title: "First Non-Repeating Character",
    question: "Find the first character in a string that never repeats.",
    answer: "One pass to build a frequency map, a second pass to find count === 1.",
    explain:
      "The first pass counts occurrences of every character; the second pass scans in order and returns the first character whose count is exactly one.",
  },
  {
    id: "str-5",
    topic: "Strings",
    difficulty: "Hard",
    title: "Minimum Window Substring",
    question:
      "Given a string s and a string t, find the smallest window in s containing all characters of t.",
    answer: "Sliding window with two pointers and a need/have frequency map.",
    explain:
      "Expand the right pointer until the window satisfies all needed characters, then contract the left pointer as far as possible while still valid, tracking the smallest valid window seen.",
  },
  {
    id: "str-6",
    topic: "Strings",
    difficulty: "Medium",
    title: "Valid Parentheses",
    question:
      "Given a string of brackets ( ) { } [ ], how do you check if they're balanced and correctly nested?",
    answer: "Push opening brackets on a stack; pop and match on closing brackets.",
    explain:
      "On an opening bracket, push it. On a closing bracket, pop the stack and check it matches the expected pair. If the stack isn't empty at the end, it's unbalanced.",
  },

  // ---------- Recursion ----------
  {
    id: "rec-1",
    topic: "Recursion",
    difficulty: "Easy",
    title: "Factorial Trace",
    question: "What does fact(4) return if fact(n) = n <= 1 ? 1 : n * fact(n-1)?",
    answer: "24",
    explain: "fact(4) = 4 * fact(3) = 4 * 3 * fact(2) = 4 * 3 * 2 * fact(1) = 4*3*2*1 = 24.",
  },
  {
    id: "rec-2",
    topic: "Recursion",
    difficulty: "Medium",
    title: "Tower of Hanoi Moves",
    question: "How many moves are required to solve Tower of Hanoi with n disks?",
    answer: "2^n - 1",
    explain:
      "Each additional disk doubles the work: move n-1 disks off, move the largest, move n-1 disks back on. That recurrence solves to 2^n - 1.",
  },
  {
    id: "rec-3",
    topic: "Recursion",
    difficulty: "Medium",
    title: "Subsets Generator",
    question: "How do you generate all subsets of a set using recursion?",
    answer: "At each element, branch into 'include it' and 'exclude it'.",
    explain:
      "A recursive call per element that either adds it to the current subset or skips it produces all 2^n combinations once it reaches the end of the array.",
  },
  {
    id: "rec-4",
    topic: "Recursion",
    difficulty: "Hard",
    title: "Memoized Fibonacci",
    question: "Why is naive recursive Fibonacci O(2^n), and how do you fix it?",
    answer: "Overlapping subproblems are recomputed; fix with memoization (top-down DP).",
    explain:
      "fib(n) calls fib(n-1) and fib(n-2), each of which recomputes shared subproblems repeatedly. Caching results in a map/array turns it into O(n) time.",
  },
  {
    id: "rec-5",
    topic: "Recursion",
    difficulty: "Easy",
    title: "Reverse a String Recursively",
    question: "Write the recursive idea to reverse a string without loops.",
    answer: "reverse(s) = reverse(s[1:]) + s[0]",
    explain:
      "Peel off the first character, recursively reverse the rest, then append the first character to the end of that result.",
  },

  // ---------- Linked List ----------
  {
    id: "ll-1",
    topic: "Linked List",
    difficulty: "Medium",
    title: "Detect a Cycle",
    question: "How do you detect whether a linked list has a cycle, in O(1) space?",
    answer: "Floyd's Tortoise and Hare — two pointers moving at different speeds.",
    explain:
      "Move one pointer one step and another two steps at a time. If there's a cycle, the fast pointer eventually laps the slow one and they meet.",
  },
  {
    id: "ll-2",
    topic: "Linked List",
    difficulty: "Medium",
    title: "Reverse a Linked List",
    question: "Reverse a singly linked list iteratively.",
    answer: "Walk the list flipping each node's `next` pointer to point backward.",
    explain:
      "Keep prev, curr, and next pointers. At each node: save curr.next, point curr.next to prev, then shift prev = curr and curr = next. Return prev when curr is null.",
  },
  {
    id: "ll-3",
    topic: "Linked List",
    difficulty: "Easy",
    title: "Find the Middle Node",
    question: "Find the middle node of a linked list in a single pass.",
    answer: "Slow/fast pointers — slow moves 1 step, fast moves 2.",
    explain: "When the fast pointer reaches the end, the slow pointer sits at the middle.",
  },
  {
    id: "ll-4",
    topic: "Linked List",
    difficulty: "Hard",
    title: "Merge k Sorted Lists",
    question: "What's an efficient strategy to merge k sorted linked lists?",
    answer: "A min-heap of size k, or pairwise merging (divide and conquer).",
    explain:
      "A min-heap holding the head of each list lets you always pop the smallest node in O(log k). Divide-and-conquer merging pairs of lists achieves O(n log k) overall.",
  },

  // ---------- Stacks & Queues ----------
  {
    id: "sq-1",
    topic: "Stacks & Queues",
    difficulty: "Medium",
    title: "Queue Using Two Stacks",
    question: "How do you implement a queue using only two stacks?",
    answer: "An 'in' stack for enqueue, an 'out' stack for dequeue; transfer when 'out' is empty.",
    explain:
      "Push new elements onto stack 'in'. To dequeue, if 'out' is empty, pour all of 'in' into 'out' (reversing order), then pop from 'out'.",
  },
  {
    id: "sq-2",
    topic: "Stacks & Queues",
    difficulty: "Medium",
    title: "Next Greater Element",
    question:
      "For each element in an array, find the next element to its right that's greater. Do it in O(n).",
    answer: "A monotonic decreasing stack of indices, scanned left to right.",
    explain:
      "Push indices while values are decreasing. When a bigger value appears, pop indices from the stack and assign the current value as their 'next greater' answer.",
  },
  {
    id: "sq-3",
    topic: "Stacks & Queues",
    difficulty: "Easy",
    title: "Min Stack",
    question: "Design a stack that supports push, pop, and getMin all in O(1).",
    answer: "Keep a second stack that tracks the minimum at each level.",
    explain:
      "Every time you push a value, also push the current minimum (min of the value and the previous min) onto a parallel stack, so getMin is always a peek away.",
  },
  {
    id: "sq-4",
    topic: "Stacks & Queues",
    difficulty: "Hard",
    title: "Sliding Window Maximum",
    question: "Find the maximum in every window of size k in an array, in O(n) total.",
    answer: "A deque that stores indices in decreasing order of value.",
    explain:
      "Pop smaller elements from the back before pushing a new one (they can never be the max again), and drop indices from the front once they slide out of the window.",
  },

  // ---------- Trees ----------
  {
    id: "tree-1",
    topic: "Trees",
    difficulty: "Easy",
    title: "Height of a Binary Tree",
    question: "How do you compute the height of a binary tree recursively?",
    answer: "height(node) = 1 + max(height(left), height(right)), base case null → 0.",
    explain:
      "Each call resolves one level; the max of the two subtree heights plus one gives the current node's height.",
  },
  {
    id: "tree-2",
    topic: "Trees",
    difficulty: "Medium",
    title: "Validate a BST",
    question: "How do you check if a binary tree is a valid binary search tree?",
    answer: "Recursively pass down a valid (min, max) range for each node.",
    explain:
      "A node is valid only if its value falls strictly within the range inherited from its ancestors; recurse left with an updated upper bound and right with an updated lower bound.",
  },
  {
    id: "tree-3",
    topic: "Trees",
    difficulty: "Medium",
    title: "Lowest Common Ancestor",
    question: "Find the lowest common ancestor of two nodes in a binary tree.",
    answer: "Recurse both subtrees; if each returns a hit, the current node is the LCA.",
    explain:
      "If the current node matches either target, return it. Otherwise search left and right; if both sides find something, the current node is where their paths split — the LCA.",
  },
  {
    id: "tree-4",
    topic: "Trees",
    difficulty: "Easy",
    title: "Level Order Traversal",
    question: "How do you print a binary tree level by level?",
    answer: "Breadth-first search with a queue.",
    explain:
      "Enqueue the root, then repeatedly dequeue a node, record its value, and enqueue its children — this naturally processes the tree level by level.",
  },
  {
    id: "tree-5",
    topic: "Trees",
    difficulty: "Hard",
    title: "Serialize and Deserialize",
    question: "How would you serialize a binary tree to a string and rebuild it later?",
    answer: "Pre-order traversal with explicit null markers.",
    explain:
      "Write each node's value in pre-order, inserting a sentinel like '#' for null children. Deserializing replays the same order, consuming tokens to rebuild left and right recursively.",
  },

  // ---------- Graphs ----------
  {
    id: "gr-1",
    topic: "Graphs",
    difficulty: "Medium",
    title: "BFS vs DFS",
    question: "When would you prefer BFS over DFS on a graph?",
    answer:
      "BFS for shortest path in an unweighted graph; DFS for exploring all paths or detecting cycles.",
    explain:
      "BFS expands layer by layer, guaranteeing the first time you reach a node is via the shortest path (in hops). DFS is more natural for backtracking and connectivity checks.",
  },
  {
    id: "gr-2",
    topic: "Graphs",
    difficulty: "Hard",
    title: "Detect a Cycle in a Directed Graph",
    question: "How do you detect a cycle in a directed graph?",
    answer:
      "DFS with three states: unvisited, in-progress, done — a back edge to an 'in-progress' node means a cycle.",
    explain:
      "If DFS revisits a node that's still on the current recursion stack (in-progress), that's a back edge, which confirms a cycle.",
  },
  {
    id: "gr-3",
    topic: "Graphs",
    difficulty: "Medium",
    title: "Topological Sort",
    question: "Give an approach to topologically sort a directed acyclic graph.",
    answer: "Kahn's algorithm: repeatedly remove nodes with in-degree 0.",
    explain:
      "Maintain in-degree counts for every node. Push all zero in-degree nodes to a queue, pop one, output it, and decrement its neighbors' in-degrees, enqueuing any that drop to zero.",
  },
  {
    id: "gr-4",
    topic: "Graphs",
    difficulty: "Hard",
    title: "Shortest Path with Weights",
    question:
      "Which algorithm finds shortest paths in a graph with non-negative weighted edges?",
    answer: "Dijkstra's algorithm using a min-priority queue.",
    explain:
      "Always expand the closest unvisited node next, relaxing the distance to its neighbors. The priority queue keeps this greedy choice efficient at O((V+E) log V).",
  },

  // ---------- Dynamic Programming ----------
  {
    id: "dp-1",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    title: "Climbing Stairs",
    question: "You can climb 1 or 2 steps at a time. How many ways to reach step n?",
    answer: "It's the Fibonacci sequence: ways(n) = ways(n-1) + ways(n-2).",
    explain:
      "To reach step n, your last move was either a 1-step from n-1 or a 2-step from n-2, so the total ways is the sum of both.",
  },
  {
    id: "dp-2",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    title: "0/1 Knapsack",
    question:
      "Given item weights, values, and a capacity, maximize value without exceeding capacity.",
    answer:
      "dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w - weight[i]]) if weight[i] <= w.",
    explain:
      "For each item, you either skip it (carry forward the previous row) or take it (add its value to the best solution for the remaining capacity), and take the better of the two.",
  },
  {
    id: "dp-3",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    title: "Longest Common Subsequence",
    question: "How do you find the length of the longest common subsequence of two strings?",
    answer:
      "dp[i][j] = dp[i-1][j-1] + 1 if chars match, else max(dp[i-1][j], dp[i][j-1]).",
    explain:
      "A matching character extends the diagonal solution by one; otherwise you carry forward the best of dropping a character from either string.",
  },
  {
    id: "dp-4",
    topic: "Dynamic Programming",
    difficulty: "Easy",
    title: "Coin Change (Fewest Coins)",
    question:
      "Find the minimum number of coins needed to make an amount, given a set of denominations.",
    answer: "dp[amt] = 1 + min(dp[amt - coin]) for every usable coin.",
    explain:
      "Build up from dp[0] = 0. For every amount, try subtracting each coin denomination and take the option requiring the fewest coins.",
  },
  {
    id: "dp-5",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    title: "Edit Distance",
    question:
      "How many single-character insert/delete/replace operations turn one string into another, at minimum?",
    answer:
      "dp[i][j] = dp[i-1][j-1] if chars match, else 1 + min(insert, delete, replace).",
    explain:
      "Matching characters cost nothing extra. Otherwise, take the cheapest of the three operations, each mapping to a different diagonal/adjacent cell in the DP table.",
  },

  // ---------- Sorting & Searching ----------
  {
    id: "ss-1",
    topic: "Sorting & Searching",
    difficulty: "Easy",
    title: "Binary Search Bug",
    question:
      "In binary search, why do we write mid = low + (high - low) / 2 instead of (low + high) / 2?",
    answer: "To avoid integer overflow when low and high are both large.",
    explain:
      "low + high can exceed the maximum representable integer in some languages/sizes, silently wrapping around. Subtracting first keeps the sum within safe bounds.",
  },
  {
    id: "ss-2",
    topic: "Sorting & Searching",
    difficulty: "Medium",
    title: "Quicksort's Worst Case",
    question: "When does quicksort degrade to O(n²), and how do you avoid it?",
    answer:
      "On already-sorted (or reverse-sorted) input with a naive pivot; use median-of-three or random pivot selection.",
    explain:
      "Picking the first or last element as pivot on sorted data creates maximally unbalanced partitions every time. Randomizing the pivot makes worst-case behavior extremely unlikely.",
  },
  {
    id: "ss-3",
    topic: "Sorting & Searching",
    difficulty: "Medium",
    title: "Merge Sort Stability",
    question: "Why is merge sort considered a stable sorting algorithm?",
    answer:
      "During the merge step, ties are always broken by taking from the left subarray first.",
    explain:
      "Equal elements keep their original relative order because the merge step only pulls from the right subarray once the left one has no more elements less-than-or-equal.",
  },
  {
    id: "ss-4",
    topic: "Sorting & Searching",
    difficulty: "Hard",
    title: "Find in a Rotated Sorted Array",
    question: "Search a target in a rotated sorted array in O(log n).",
    answer:
      "Modified binary search — figure out which half is sorted, then decide which half to recurse into.",
    explain:
      "At each step, one half of the array (left of mid or right of mid) is guaranteed sorted. Check if the target lies in that sorted half's range; if so, search there, else search the other half.",
  },

  // ---------- Bit Manipulation ----------
  {
    id: "bit-1",
    topic: "Bit Manipulation",
    difficulty: "Easy",
    title: "Check Power of Two",
    question: "How do you check if a number is a power of two, using bit tricks?",
    answer: "n > 0 && (n & (n - 1)) === 0",
    explain:
      "A power of two has exactly one bit set. Subtracting 1 flips that bit and all bits below it, so ANDing with the original clears everything to zero.",
  },
  {
    id: "bit-2",
    topic: "Bit Manipulation",
    difficulty: "Medium",
    title: "Single Number",
    question:
      "Every element in an array appears twice except one. Find that one element in O(n) time, O(1) space.",
    answer: "XOR every element together — pairs cancel out, leaving the unique one.",
    explain:
      "a XOR a = 0 and a XOR 0 = a, so XORing the whole array leaves only the number without a pair.",
  },
  {
    id: "bit-3",
    topic: "Bit Manipulation",
    difficulty: "Easy",
    title: "Count Set Bits",
    question: "What's Brian Kernighan's trick for counting set bits in an integer?",
    answer: "Repeatedly do n = n & (n - 1) and count iterations until n becomes 0.",
    explain:
      "Each application clears the lowest set bit, so the number of iterations equals the count of 1-bits.",
  },
  {
    id: "bit-4",
    topic: "Bit Manipulation",
    difficulty: "Medium",
    title: "Swap Without a Temp Variable",
    question: "Swap two integers without using a third variable.",
    answer: "a ^= b; b ^= a; a ^= b;",
    explain:
      "Each XOR step encodes enough information to recover the other original value, so after three XORs the two variables end up swapped.",
  },

  // ---------- Math & Number Theory ----------
  {
    id: "math-1",
    topic: "Math & Number Theory",
    difficulty: "Easy",
    title: "GCD the Fast Way",
    question: "What's the fastest classical way to compute the GCD of two numbers?",
    answer: "Euclid's algorithm: gcd(a, b) = gcd(b, a % b) until b is 0.",
    explain:
      "Repeated modulo reduces the pair quickly — it converges in O(log(min(a,b))) steps.",
  },
  {
    id: "math-2",
    topic: "Math & Number Theory",
    difficulty: "Medium",
    title: "Sieve of Eratosthenes",
    question: "How do you find all primes up to n efficiently?",
    answer:
      "Mark multiples of each prime starting from 2, in a boolean array, in O(n log log n).",
    explain:
      "Starting from the smallest unmarked number, mark all its multiples as composite. Whatever remains unmarked when you reach it is prime.",
  },
  {
    id: "math-3",
    topic: "Math & Number Theory",
    difficulty: "Easy",
    title: "Fast Exponentiation",
    question: "How do you compute a^b in O(log b) instead of O(b)?",
    answer: "Binary exponentiation: square the base and halve the exponent each step.",
    explain:
      "If b is even, a^b = (a^(b/2))^2. If odd, a^b = a * a^(b-1). Recursing this way collapses the exponent logarithmically.",
  },
  {
    id: "math-4",
    topic: "Math & Number Theory",
    difficulty: "Medium",
    title: "Detect a Perfect Square Without sqrt()",
    question: "Check if a number is a perfect square without using a built-in sqrt function.",
    answer: "Binary search for x such that x*x === n.",
    explain:
      "Since x*x grows monotonically with x, binary search between 1 and n converges in O(log n).",
  },

  // ---------- OOP Concepts ----------
  {
    id: "oop-1",
    topic: "OOP Concepts",
    difficulty: "Easy",
    title: "Overloading vs Overriding",
    question: "What's the core difference between method overloading and overriding?",
    answer:
      "Overloading: same name, different parameters, resolved at compile time. Overriding: same signature, subclass redefines behavior, resolved at runtime.",
    explain:
      "Overloading is about having multiple versions of a method in the same class distinguished by parameters. Overriding is about polymorphism across a class hierarchy.",
  },
  {
    id: "oop-2",
    topic: "OOP Concepts",
    difficulty: "Medium",
    title: "Why Favor Composition Over Inheritance?",
    question: "Why do many designs prefer composition over deep inheritance chains?",
    answer: "Composition avoids tight coupling and the fragile base class problem.",
    explain:
      "Deep inheritance forces subclasses to depend heavily on parent implementation details. Composing smaller, focused objects keeps behavior swappable and easier to test.",
  },
  {
    id: "oop-3",
    topic: "OOP Concepts",
    difficulty: "Easy",
    title: "Abstract Class vs Interface",
    question: "When would you choose an abstract class over an interface?",
    answer: "When you need to share common implementation code, not just a contract.",
    explain:
      "An interface only defines what must be implemented; an abstract class can hold shared fields and method bodies that subclasses inherit directly.",
  },
  {
    id: "oop-4",
    topic: "OOP Concepts",
    difficulty: "Medium",
    title: "The Diamond Problem",
    question:
      "What is the diamond problem in multiple inheritance, and how do languages avoid it?",
    answer:
      "Ambiguity when two parent classes share a common ancestor method; resolved via interfaces or explicit resolution rules.",
    explain:
      "If class D inherits from B and C, which both inherit from A and override a method, it's unclear which version D should get. Languages like Java sidestep this by disallowing multiple class inheritance and using interfaces instead.",
  },

  // ---------- Output Prediction ----------
  {
    id: "out-1",
    topic: "Output Prediction",
    difficulty: "Medium",
    title: "The Closure Loop",
    question:
      "for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); } — what does this print?",
    answer: "3, 3, 3",
    explain:
      "var is function-scoped, not block-scoped, so all three callbacks share the same i, which is 3 by the time the timeouts fire. Using let instead would print 0, 1, 2.",
  },
  {
    id: "out-2",
    topic: "Output Prediction",
    difficulty: "Easy",
    title: "Type Coercion Trap",
    question: "What does '5' + 3 - 2 evaluate to in JavaScript?",
    answer: "51",
    explain:
      "'+' with a string concatenates ('5' + 3 = '53'), but '-' forces numeric coercion (53 - 2 = 51).",
  },
  {
    id: "out-3",
    topic: "Output Prediction",
    difficulty: "Medium",
    title: "Mutable Default Argument",
    question:
      "def add(item, lst=[]): lst.append(item); return lst — what's the risk of calling add(1) twice?",
    answer:
      "The default list persists across calls, so the second call returns [1, 1] instead of [1].",
    explain:
      "Python evaluates default argument values once, at function definition time, so a mutable default is shared across every call that doesn't pass its own argument.",
  },
  {
    id: "out-4",
    topic: "Output Prediction",
    difficulty: "Hard",
    title: "Hoisting Confusion",
    question: "console.log(x); var x = 5; — what gets printed and why?",
    answer: "undefined — the declaration is hoisted, but the assignment is not.",
    explain:
      "JavaScript hoists 'var x' to the top of the scope, so x exists (as undefined) before the assignment line runs.",
  },

  // ---------- Logic & Aptitude ----------
  {
    id: "log-1",
    topic: "Logic & Aptitude",
    difficulty: "Medium",
    title: "The Two Egg Problem",
    question:
      "You have 2 identical eggs and a 100-floor building. Find the highest floor an egg survives a drop from, minimizing worst-case attempts.",
    answer:
      "Start at floor 14, then decrease the step by 1 each time you don't break an egg (14, 27, 39, ...).",
    explain:
      "This balances the trade-off: if the first egg breaks, you have to test floors one at a time with the second egg, so each jump shrinks to keep total worst-case attempts at 14.",
  },
  {
    id: "log-2",
    topic: "Logic & Aptitude",
    difficulty: "Easy",
    title: "Fox, Chicken, and Grain",
    question:
      "A farmer must cross a river with a fox, a chicken, and a bag of grain, taking one at a time. Fox eats chicken, chicken eats grain if left alone. How does he get everyone across?",
    answer:
      "Take the chicken first, return alone, take the fox, bring the chicken back, take the grain, return alone, take the chicken.",
    explain:
      "The key insight is the chicken must never be left alone with either the fox or the grain, which forces one extra round trip to briefly swap the chicken back.",
  },
  {
    id: "log-3",
    topic: "Logic & Aptitude",
    difficulty: "Hard",
    title: "100 Prisoners and a Lightbulb",
    question:
      "100 prisoners are called one at a time, at random, into a room with a lightbulb. They must collectively determine when everyone has visited at least once. What strategy works?",
    answer:
      "Designate one 'counter' prisoner who toggles the bulb on only once per other prisoner's first visit; everyone else turns it on exactly once, ever.",
    explain:
      "The counter keeps a tally; when their count reaches 99, everyone has visited. Non-counters only ever switch the bulb on the very first time they see it off.",
  },
  {
    id: "log-4",
    topic: "Logic & Aptitude",
    difficulty: "Medium",
    title: "Weighing the Odd Ball",
    question:
      "You have 9 identical-looking balls, one heavier than the rest. Using a balance scale, find it in 2 weighings.",
    answer:
      "Split into three groups of 3, weigh two groups against each other, then weigh 2 of the 3 suspects.",
    explain:
      "The first weighing narrows the heavy ball to one group of 3. The second weighing, comparing 2 of those 3, either reveals the heavier one directly or confirms it's the one left out.",
  },
];

// -----------------------------------------------------------------------------
// Motion variants — matches the fadeUp pattern used across CodeNFacts pages
// -----------------------------------------------------------------------------

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: Math.min(i * 0.03, 0.4),
      ease: "easeOut",
    },
  }),
};

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  Easy: "puzzle-badge puzzle-badge--easy",
  Medium: "puzzle-badge puzzle-badge--medium",
  Hard: "puzzle-badge puzzle-badge--hard",
};

const STORAGE_KEY = "cnf_puzzles_solved_v1";

export default function PuzzlesPage() {
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState<string>("All");
  const [activeDifficulty, setActiveDifficulty] = useState<"All" | Difficulty>("All");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState<Set<string>>(new Set());

  // Load solved-state from localStorage on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSolved(new Set(JSON.parse(raw)));
    } catch {
      // ignore malformed storage
    }
  }, []);

  // Persist solved-state whenever it changes.
  // TODO(backend): sync `solved` to Firestore under users/{uid}/puzzleProgress
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(solved)));
    } catch {
      // storage might be unavailable (private mode) — fail silently
    }
  }, [solved]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PUZZLES.filter((p) => {
      const matchesTopic = activeTopic === "All" || p.topic === activeTopic;
      const matchesDifficulty =
        activeDifficulty === "All" || p.difficulty === activeDifficulty;
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.question.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q);
      return matchesTopic && matchesDifficulty && matchesSearch;
    });
  }, [search, activeTopic, activeDifficulty]);

  function toggleReveal(id: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSolved(id: string) {
    setSolved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function resetProgress() {
    setSolved(new Set());
  }

  const solvedCount = solved.size;
  const totalCount = PUZZLES.length;

  return (
    <div className="puzzles-page">
      <style>{`
        .puzzles-page {
          --bg-page: #f7f8fa;
          --bg-panel: #ffffff;
          --bg-panel-alt: #f2f3f6;
          --border: #e3e6ec;
          --text-primary: #10141c;
          --text-secondary: #5a6472;
          --text-muted: #8891a0;
          --accent: #b6812c;
          --accent-soft: rgba(182, 129, 44, 0.12);
          --code-bg: #eef0f4;
          --easy: #1f9d55;
          --easy-soft: rgba(31, 157, 85, 0.12);
          --medium: #b6812c;
          --medium-soft: rgba(182, 129, 44, 0.12);
          --hard: #d1453b;
          --hard-soft: rgba(209, 69, 59, 0.12);
          min-height: 100vh;
          background: var(--bg-page);
          color: var(--text-primary);
          transition: background 0.2s ease, color 0.2s ease;
        }
        .dark .puzzles-page {
          --bg-page: #0a0e14;
          --bg-panel: #0d1117;
          --bg-panel-alt: #10151d;
          --border: #1e2530;
          --text-primary: #e6edf3;
          --text-secondary: #9aa7b8;
          --text-muted: #6b7686;
          --accent: #34d399;
          --accent-soft: rgba(52, 211, 153, 0.12);
          --code-bg: #131922;
          --easy: #34d399;
          --easy-soft: rgba(52, 211, 153, 0.12);
          --medium: #f2b155;
          --medium-soft: rgba(242, 177, 85, 0.12);
          --hard: #f2716b;
          --hard-soft: rgba(242, 113, 107, 0.12);
        }

        .puzzle-shell { max-width: 1080px; margin: 0 auto; padding: 32px 20px 80px; }

        .puzzle-terminal {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 28px;
        }
        .puzzle-terminal__chrome {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--bg-panel-alt);
          border-bottom: 1px solid var(--border);
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot--red { background: #f26a5a; }
        .dot--yellow { background: #f2b155; }
        .dot--green { background: #34d399; }
        .puzzle-terminal__label {
          margin-left: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--text-muted);
        }
        .puzzle-terminal__body { padding: 24px; }

        .puzzle-title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
        .puzzle-title-row h1 { font-size: 26px; font-weight: 700; margin: 0; }
        .puzzle-icon-wrap {
          display: flex; align-items: center; justify-content: center;
          width: 42px; height: 42px; border-radius: 10px;
          background: var(--accent-soft); color: var(--accent); flex-shrink: 0;
        }
        .puzzle-subtitle { color: var(--text-secondary); font-size: 14.5px; max-width: 640px; line-height: 1.5; }

        .puzzle-stats { display: flex; gap: 12px; margin-top: 18px; flex-wrap: wrap; }
        .stat-chip {
          display: flex; align-items: center; gap: 8px;
          background: var(--bg-panel-alt); border: 1px solid var(--border);
          border-radius: 10px; padding: 8px 14px; font-size: 13px; color: var(--text-secondary);
        }
        .stat-chip strong { color: var(--text-primary); font-size: 14px; }

        .puzzle-controls {
          display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 22px;
        }
        .search-box {
          flex: 1 1 240px;
          display: flex; align-items: center; gap: 8px;
          background: var(--bg-panel); border: 1px solid var(--border);
          border-radius: 10px; padding: 9px 12px; color: var(--text-secondary);
        }
        .search-box input {
          border: none; outline: none; background: transparent; width: 100%;
          color: var(--text-primary); font-size: 14px;
        }
        .select-box {
          display: flex; align-items: center; gap: 6px;
          background: var(--bg-panel); border: 1px solid var(--border);
          border-radius: 10px; padding: 0 10px; color: var(--text-secondary);
        }
        .select-box select {
          border: none; outline: none; background: transparent; color: var(--text-primary);
          font-size: 13.5px; padding: 9px 4px; appearance: none;
        }
        .reset-btn {
          display: flex; align-items: center; gap: 6px;
          border: 1px solid var(--border); background: var(--bg-panel-alt);
          color: var(--text-secondary); border-radius: 10px; padding: 9px 14px;
          font-size: 13px; cursor: pointer; transition: 0.15s ease;
        }
        .reset-btn:hover { color: var(--hard); border-color: var(--hard); }

        .puzzle-grid { display: flex; flex-direction: column; gap: 14px; }

        .puzzle-card {
          background: var(--bg-panel); border: 1px solid var(--border);
          border-radius: 12px; padding: 18px 20px; transition: border-color 0.15s ease;
        }
        .puzzle-card--solved { border-color: var(--easy); }

        .puzzle-card__top { display: flex; justify-content: space-between; gap: 14px; align-items: flex-start; }
        .puzzle-card__left { display: flex; gap: 12px; align-items: flex-start; }
        .puzzle-topic-icon {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: var(--accent-soft); color: var(--accent);
        }
        .puzzle-card__title { font-size: 15.5px; font-weight: 600; margin: 0 0 4px; }
        .puzzle-card__meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .puzzle-topic-tag { font-size: 11.5px; color: var(--text-muted); }

        .puzzle-badge {
          font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 999px;
        }
        .puzzle-badge--easy { background: var(--easy-soft); color: var(--easy); }
        .puzzle-badge--medium { background: var(--medium-soft); color: var(--medium); }
        .puzzle-badge--hard { background: var(--hard-soft); color: var(--hard); }

        .solve-toggle {
          background: none; border: none; cursor: pointer; color: var(--text-muted);
          display: flex; align-items: center; gap: 6px; font-size: 12.5px; flex-shrink: 0;
          padding: 6px 8px; border-radius: 8px; transition: 0.15s ease;
        }
        .solve-toggle:hover { background: var(--bg-panel-alt); }
        .solve-toggle--active { color: var(--easy); }

        .puzzle-question { margin: 12px 0 0; font-size: 14px; color: var(--text-secondary); line-height: 1.6; }

        .reveal-btn {
          margin-top: 14px; display: inline-flex; align-items: center; gap: 6px;
          background: var(--accent-soft); color: var(--accent); border: none;
          border-radius: 8px; padding: 7px 13px; font-size: 12.5px; font-weight: 600;
          cursor: pointer; transition: 0.15s ease;
        }
        .reveal-btn:hover { filter: brightness(1.05); }
        .reveal-btn svg { transition: transform 0.2s ease; }
        .reveal-btn--open svg { transform: rotate(180deg); }

        .puzzle-answer {
          margin-top: 14px; padding: 14px 16px; border-radius: 10px;
          background: var(--code-bg); border: 1px solid var(--border);
        }
        .puzzle-answer__label {
          display: flex; align-items: center; gap: 6px; font-size: 11.5px;
          font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
          color: var(--accent); margin-bottom: 6px;
        }
        .puzzle-answer__value {
          font-family: 'JetBrains Mono', monospace; font-size: 13.5px;
          color: var(--text-primary); margin: 0 0 8px; line-height: 1.5;
        }
        .puzzle-answer__explain { font-size: 13px; color: var(--text-secondary); margin: 0; line-height: 1.55; }

        .empty-state {
          text-align: center; padding: 60px 20px; color: var(--text-muted);
        }

        @media (max-width: 640px) {
          .puzzle-terminal__body { padding: 18px; }
          .puzzle-title-row h1 { font-size: 21px; }
          .puzzle-card__top { flex-direction: column; }
          .solve-toggle { align-self: flex-start; }
        }
      `}</style>

      <div className="puzzle-shell">
        {/* Header panel */}
        <motion.div
          className="puzzle-terminal"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <div className="puzzle-terminal__chrome">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
            <span className="puzzle-terminal__label">category/puzzles</span>
          </div>
          <div className="puzzle-terminal__body">
            <div className="puzzle-title-row">
              <div className="puzzle-icon-wrap">
                <Puzzle size={20} />
              </div>
              <h1>Logic &amp; Coding Puzzles</h1>
            </div>
            <p className="puzzle-subtitle">
              {totalCount}+ hand-picked puzzles across arrays, recursion, graphs, DP,
              bit tricks and classic logic riddles. Every puzzle is tagged with a topic
              and comes with a full answer — try it yourself before revealing.
            </p>
            <div className="puzzle-stats">
              <div className="stat-chip">
                <Sparkles size={14} />
                <span>
                  <strong>{totalCount}</strong> total puzzles
                </span>
              </div>
              <div className="stat-chip">
                <CheckCircle2 size={14} />
                <span>
                  <strong>{solvedCount}</strong> marked solved
                </span>
              </div>
              <div className="stat-chip">
                <Filter size={14} />
                <span>
                  <strong>{filtered.length}</strong> showing
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="puzzle-controls"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
        >
          <div className="search-box">
            <Search size={16} />
            <input
              placeholder="Search puzzles by title, topic, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="select-box">
            <ChevronDown size={14} />
            <select
              value={activeTopic}
              onChange={(e) => setActiveTopic(e.target.value)}
            >
              <option value="All">All topics</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="select-box">
            <ChevronDown size={14} />
            <select
              value={activeDifficulty}
              onChange={(e) =>
                setActiveDifficulty(e.target.value as "All" | Difficulty)
              }
            >
              <option value="All">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <button className="reset-btn" onClick={resetProgress}>
            <RotateCcw size={14} />
            Reset progress
          </button>
        </motion.div>

        {/* Puzzle list */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No puzzles match your filters. Try clearing the search or topic.</p>
          </div>
        ) : (
          <div className="puzzle-grid">
            {filtered.map((p, i) => {
              const isOpen = revealed.has(p.id);
              const isSolved = solved.has(p.id);
              const Icon =
                TOPIC_ICON[p.topic as (typeof TOPICS)[number]] || Puzzle;
              return (
                <motion.div
                  key={p.id}
                  className={`puzzle-card ${isSolved ? "puzzle-card--solved" : ""}`}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={i}
                >
                  <div className="puzzle-card__top">
                    <div className="puzzle-card__left">
                      <div className="puzzle-topic-icon">
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="puzzle-card__title">{p.title}</p>
                        <div className="puzzle-card__meta">
                          <span className={DIFFICULTY_STYLE[p.difficulty]}>
                            {p.difficulty}
                          </span>
                          <span className="puzzle-topic-tag">{p.topic}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className={`solve-toggle ${
                        isSolved ? "solve-toggle--active" : ""
                      }`}
                      onClick={() => toggleSolved(p.id)}
                    >
                      {isSolved ? (
                        <CheckCircle2 size={15} />
                      ) : (
                        <Circle size={15} />
                      )}
                      {isSolved ? "Solved" : "Mark solved"}
                    </button>
                  </div>

                  <p className="puzzle-question">{p.question}</p>

                  <button
                    className={`reveal-btn ${isOpen ? "reveal-btn--open" : ""}`}
                    onClick={() => toggleReveal(p.id)}
                  >
                    <Lightbulb size={14} />
                    {isOpen ? "Hide answer" : "Reveal answer"}
                    <ChevronDown size={14} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="puzzle-answer">
                          <div className="puzzle-answer__label">
                            <ShieldCheck size={13} />
                            Answer
                          </div>
                          <p className="puzzle-answer__value">{p.answer}</p>
                          <p className="puzzle-answer__explain">{p.explain}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}