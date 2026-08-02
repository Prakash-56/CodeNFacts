// develop/time-complexity-fight/questions.ts
// 112 unique scenarios covering the Big-O complexities a CS/DSA learner needs
// to recognize on sight. Each scenario has exactly one correct "weapon"
// (time complexity). The UI is responsible for drawing 3 distractor weapons
// alongside the correct one for each fight.

export const ALL_COMPLEXITIES = [
  "O(1)",
  "O(log n)",
  "O(n)",
  "O(n log n)",
  "O(n\u00B2)",
  "O(n\u00B3)",
  "O(2^n)",
  "O(n!)",
] as const;

export type Complexity = (typeof ALL_COMPLEXITIES)[number];

export interface FightQuestion {
  id: number;
  scenario: string;
  correct: Complexity;
}

// Enemy names are derived from the question id (see getEnemyName) so the
// data below only needs to carry the scenario + correct answer.
const ENEMY_NAMES = [
  "Loop Lurker",
  "Recursion Wraith",
  "Stack Overflow Serpent",
  "Null Pointer Ghoul",
  "Segfault Specter",
  "Array Golem",
  "Hashmap Hydra",
  "Bubble Sort Beast",
  "Quicksort Quetzal",
  "Merge Sort Mantis",
  "Heap Horror",
  "Graph Griffin",
  "Tree Troll",
  "Matrix Minotaur",
  "Fibonacci Phantom",
  "Palindrome Poltergeist",
  "Sliding Window Wyvern",
  "Two-Pointer Titan",
  "Union-Find Undead",
  "Dijkstra Demon",
  "Floyd-Warshall Fiend",
  "Factorial Fiend",
  "Permutation Phantom",
  "Subset Serpent",
  "Binary Search Basilisk",
  "Linked List Lich",
  "Cache Imp",
  "Byte Bug",
  "Pixel Slime",
  "Compiler Cyclops",
  "Runtime Reaper",
  "Memory Leak Mimic",
  "Deadlock Djinn",
  "Race Condition Raven",
  "Buffer Overflow Banshee",
];

export function getEnemyName(id: number): string {
  return ENEMY_NAMES[id % ENEMY_NAMES.length];
}

export const fightQuestions: FightQuestion[] = [
  // ---- O(1) ----
  { id: 1, scenario: "Access an element in an array using its index.", correct: "O(1)" },
  { id: 2, scenario: "Push a new item onto the top of a stack.", correct: "O(1)" },
  { id: 3, scenario: "Pop the top item off a stack.", correct: "O(1)" },
  { id: 4, scenario: "Peek at the top item of a stack without removing it.", correct: "O(1)" },
  { id: 5, scenario: "Enqueue an item into a queue backed by a doubly linked list.", correct: "O(1)" },
  { id: 6, scenario: "Dequeue an item from a queue backed by a doubly linked list.", correct: "O(1)" },
  { id: 7, scenario: "Look up a key in a well-distributed hash map (average case).", correct: "O(1)" },
  { id: 8, scenario: "Insert a new key-value pair into a hash map (average case).", correct: "O(1)" },
  { id: 9, scenario: "Check whether an integer is even or odd.", correct: "O(1)" },
  { id: 10, scenario: "Get the length property of an array.", correct: "O(1)" },
  { id: 11, scenario: "Swap the values of two variables using a temporary variable.", correct: "O(1)" },
  { id: 12, scenario: "Peek at the minimum value sitting at the root of a min-heap.", correct: "O(1)" },
  { id: 13, scenario: "Union two sets using union-find with path compression and union by rank (amortized).", correct: "O(1)" },
  { id: 14, scenario: "Insert a new node at the head of a singly linked list.", correct: "O(1)" },
  { id: 15, scenario: "Remove the head node from a singly linked list.", correct: "O(1)" },
  { id: 16, scenario: "Add two integers together.", correct: "O(1)" },
  { id: 17, scenario: "Check whether a hash set contains a given value.", correct: "O(1)" },
  { id: 18, scenario: "Determine if a number is positive, negative, or zero.", correct: "O(1)" },
  { id: 19, scenario: "Read the front element of a queue implemented with a circular buffer.", correct: "O(1)" },

  // ---- O(log n) ----
  { id: 20, scenario: "Find an element in a sorted array using binary search.", correct: "O(log n)" },
  { id: 21, scenario: "Search for a value inside a balanced binary search tree.", correct: "O(log n)" },
  { id: 22, scenario: "Insert a new value into a balanced binary search tree.", correct: "O(log n)" },
  { id: 23, scenario: "Delete a value from a balanced binary search tree.", correct: "O(log n)" },
  { id: 24, scenario: "Insert a new value into a binary heap.", correct: "O(log n)" },
  { id: 25, scenario: "Extract the minimum value from a binary heap.", correct: "O(log n)" },
  { id: 26, scenario: "Find the height of a perfectly balanced binary tree holding n nodes.", correct: "O(log n)" },
  { id: 27, scenario: "Binary search for a target inside a rotated sorted array.", correct: "O(log n)" },
  { id: 28, scenario: "Use exponential search to locate a value in a sorted, unbounded array.", correct: "O(log n)" },
  { id: 29, scenario: "Compute x raised to the power n using fast, divide-and-conquer exponentiation.", correct: "O(log n)" },
  { id: 30, scenario: "Count how many digits an integer n has.", correct: "O(log n)" },
  { id: 31, scenario: "Search for a key in a balanced AVL tree.", correct: "O(log n)" },
  { id: 32, scenario: "Binary search for the correct insertion point in a sorted array.", correct: "O(log n)" },
  { id: 33, scenario: "Find the position of the highest set bit in an integer using bit shifting.", correct: "O(log n)" },
  { id: 34, scenario: "Determine how many times you can halve n before reaching 1.", correct: "O(log n)" },

  // ---- O(n) ----
  { id: 35, scenario: "Find the largest value in an unsorted array.", correct: "O(n)" },
  { id: 36, scenario: "Search for a value inside an unsorted array using linear search.", correct: "O(n)" },
  { id: 37, scenario: "Reverse an array of n elements in place.", correct: "O(n)" },
  { id: 38, scenario: "Check if a string is a palindrome using the two-pointer technique.", correct: "O(n)" },
  { id: 39, scenario: "Visit every node in a singly linked list once.", correct: "O(n)" },
  { id: 40, scenario: "Compute the sum of every element in an array.", correct: "O(n)" },
  { id: 41, scenario: "Count how often each character appears in a string using a hash map.", correct: "O(n)" },
  { id: 42, scenario: "Run a breadth-first traversal across a tree with n nodes.", correct: "O(n)" },
  { id: 43, scenario: "Run a depth-first traversal across a tree with n nodes.", correct: "O(n)" },
  { id: 44, scenario: "Find the height of a completely unbalanced, skewed binary tree.", correct: "O(n)" },
  { id: 45, scenario: "Copy every element of an array of size n into a brand-new array.", correct: "O(n)" },
  { id: 46, scenario: "Merge two arrays that are already individually sorted into one sorted array.", correct: "O(n)" },
  { id: 47, scenario: "Find the kth node from the end of a linked list in a single pass.", correct: "O(n)" },
  { id: 48, scenario: "Detect whether a linked list contains a cycle using Floyd's tortoise-and-hare algorithm.", correct: "O(n)" },
  { id: 49, scenario: "Build a prefix-sum array from an array of n elements.", correct: "O(n)" },
  { id: 50, scenario: "Convert an unordered array into a valid heap using the build-heap procedure.", correct: "O(n)" },
  { id: 51, scenario: "Find two numbers in an array that add up to a target using a hash set (two-sum).", correct: "O(n)" },
  { id: 52, scenario: "Rotate an array by k positions using the three-reversals trick.", correct: "O(n)" },
  { id: 53, scenario: "Count how many vowels appear in a string.", correct: "O(n)" },
  { id: 54, scenario: "Find the single missing number from a list containing 1 through n using the sum formula.", correct: "O(n)" },
  { id: 55, scenario: "Flatten a singly nested array containing n elements.", correct: "O(n)" },
  { id: 56, scenario: "Find both the minimum and maximum of an unsorted array in one pass.", correct: "O(n)" },
  { id: 57, scenario: "Compute the depth of every node in a binary tree during one traversal.", correct: "O(n)" },
  { id: 58, scenario: "Check whether two strings are anagrams using character frequency counts.", correct: "O(n)" },
  { id: 59, scenario: "Merge a list of intervals that have already been sorted by start time.", correct: "O(n)" },

  // ---- O(n log n) ----
  { id: 60, scenario: "Sort an array of n elements using merge sort.", correct: "O(n log n)" },
  { id: 61, scenario: "Sort an array of n elements using quicksort (average case).", correct: "O(n log n)" },
  { id: 62, scenario: "Sort an array of n elements using heapsort.", correct: "O(n log n)" },
  { id: 63, scenario: "Find the closest pair of points among n points using divide and conquer.", correct: "O(n log n)" },
  { id: 64, scenario: "Sort a list of n elements and then remove any duplicates.", correct: "O(n log n)" },
  { id: 65, scenario: "Compute the convex hull of n points using the classic divide-and-conquer algorithm.", correct: "O(n log n)" },
  { id: 66, scenario: "Sort n intervals by start time before merging the overlapping ones.", correct: "O(n log n)" },
  { id: 67, scenario: "Run Dijkstra's algorithm on a graph using a binary heap priority queue.", correct: "O(n log n)" },
  { id: 68, scenario: "Sort an array of n timestamps using an efficient comparison-based sort.", correct: "O(n log n)" },
  { id: 69, scenario: "Build a Fenwick tree (Binary Indexed Tree) by inserting n elements one at a time.", correct: "O(n log n)" },
  { id: 70, scenario: "Sort an array of n custom objects using a comparator function.", correct: "O(n log n)" },
  { id: 71, scenario: "Build a Huffman encoding tree for n unique characters using a priority queue.", correct: "O(n log n)" },
  { id: 72, scenario: "Compute the skyline formed by n buildings using a divide-and-conquer sweep.", correct: "O(n log n)" },

  // ---- O(n²) ----
  { id: 73, scenario: "Sort an array of n elements using bubble sort.", correct: "O(n\u00B2)" },
  { id: 74, scenario: "Sort an array of n elements using selection sort.", correct: "O(n\u00B2)" },
  { id: 75, scenario: "Sort an array of n elements using insertion sort (average and worst case).", correct: "O(n\u00B2)" },
  { id: 76, scenario: "Check every pair of elements in an array to find two that sum to a target, using nested loops.", correct: "O(n\u00B2)" },
  { id: 77, scenario: "Print every pair (i, j) of indices in an array of n elements.", correct: "O(n\u00B2)" },
  { id: 78, scenario: "Find duplicate elements in an array using a pair of nested loops.", correct: "O(n\u00B2)" },
  { id: 79, scenario: "Keep an array sorted by repeatedly shifting elements during n insertions.", correct: "O(n\u00B2)" },
  { id: 80, scenario: "Find the longest common substring of two strings using nested loops, without dynamic programming.", correct: "O(n\u00B2)" },
  { id: 81, scenario: "Check every substring of a text against a pattern using naive string matching.", correct: "O(n\u00B2)" },
  { id: 82, scenario: "Fill a dynamic programming table to find the longest common subsequence of two strings of length n.", correct: "O(n\u00B2)" },
  { id: 83, scenario: "Fill a dynamic programming table to compute the edit distance between two strings of length n.", correct: "O(n\u00B2)" },
  { id: 84, scenario: "Traverse every cell of an adjacency matrix representing a graph with V vertices.", correct: "O(n\u00B2)" },
  { id: 85, scenario: "Compute the transpose of an n by n matrix.", correct: "O(n\u00B2)" },
  { id: 86, scenario: "Repeatedly find the minimum of the remaining elements and swap it into place.", correct: "O(n\u00B2)" },
  { id: 87, scenario: "Run bubble sort with an early-exit optimization, in its worst case.", correct: "O(n\u00B2)" },
  { id: 88, scenario: "Compare every element of an array against every other element to count inversions the slow way.", correct: "O(n\u00B2)" },
  { id: 89, scenario: "Compute the outer product of two vectors of length n, producing an n by n matrix.", correct: "O(n\u00B2)" },

  // ---- O(n³) ----
  { id: 90, scenario: "Multiply two n by n matrices using the naive triple-nested-loop algorithm.", correct: "O(n\u00B3)" },
  { id: 91, scenario: "Run the Floyd-Warshall algorithm to find all-pairs shortest paths on a graph with V vertices.", correct: "O(n\u00B3)" },
  { id: 92, scenario: "Check every possible triplet in an array of n elements for a target sum, using three nested loops.", correct: "O(n\u00B3)" },
  { id: 93, scenario: "Print every combination formed by three nested loops over n elements.", correct: "O(n\u00B3)" },
  { id: 94, scenario: "Check every triple of indices in an array to see if they form an arithmetic progression.", correct: "O(n\u00B3)" },
  { id: 95, scenario: "Compute every pairwise product between rows of an n by n matrix using a triple loop.", correct: "O(n\u00B3)" },
  { id: 96, scenario: "Verify a candidate solution against every triple of constraints in a naive check over n variables.", correct: "O(n\u00B3)" },

  // ---- O(2^n) ----
  { id: 97, scenario: "Compute the nth Fibonacci number using plain recursion with no memoization.", correct: "O(2^n)" },
  { id: 98, scenario: "Generate every possible subset of a set containing n elements.", correct: "O(2^n)" },
  { id: 99, scenario: "Solve the Tower of Hanoi puzzle for n disks.", correct: "O(2^n)" },
  { id: 100, scenario: "Solve the 0/1 knapsack problem using brute-force recursion with no memoization.", correct: "O(2^n)" },
  { id: 101, scenario: "Try every combination of n light switches to find the one arrangement that works.", correct: "O(2^n)" },
  { id: 102, scenario: "Generate the full power set of a string containing n characters.", correct: "O(2^n)" },
  { id: 103, scenario: "Solve the subset-sum problem using brute-force recursion over n items.", correct: "O(2^n)" },
  { id: 104, scenario: "Check the satisfiability of a boolean formula with n variables using a brute-force truth table.", correct: "O(2^n)" },
  { id: 105, scenario: "Explore every possible path through a decision tree with n binary choices.", correct: "O(2^n)" },

  // ---- O(n!) ----
  { id: 106, scenario: "Generate every possible permutation of n distinct elements.", correct: "O(n!)" },
  { id: 107, scenario: "Solve the travelling salesman problem by brute-force checking every possible route through n cities.", correct: "O(n!)" },
  { id: 108, scenario: "Solve the n-queens problem by trying every possible arrangement of n queens with no pruning.", correct: "O(n!)" },
  { id: 109, scenario: "List every possible seating arrangement for n guests around a table, with no symmetry reduction.", correct: "O(n!)" },
  { id: 110, scenario: "Check every permutation of a string of n characters to find one that matches a target anagram.", correct: "O(n!)" },
  { id: 111, scenario: "Try every possible ordering of n tasks to find the one legal schedule, with no pruning.", correct: "O(n!)" },
  { id: 112, scenario: "Brute-force every possible assignment of n unique prizes to n unique winners.", correct: "O(n!)" },
];