"use client";

import React, { useCallback, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
type Side = "w" | "b";
type Category = "loop" | "function" | "array" | "stack" | "queue" | "recursion";

interface Piece {
  type: PieceType;
  color: Side;
}
type Board = (Piece | null)[][];

interface Question {
  id: string;
  category: Category;
  prompt: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/* ------------------------------------------------------------------ */
/*  Concept <-> piece mapping                                          */
/* ------------------------------------------------------------------ */

const CATEGORY_META: Record<Category, { label: string; short: string; color: string; darkColor: string }> = {
  loop: { label: "Loop", short: "LOOP", color: "#2563EB", darkColor: "#60A5FA" },
  function: { label: "Function", short: "FN", color: "#7C3AED", darkColor: "#A78BFA" },
  array: { label: "Array", short: "ARR", color: "#059669", darkColor: "#34D399" },
  stack: { label: "Stack", short: "STK", color: "#DC2626", darkColor: "#F87171" },
  queue: { label: "Queue", short: "QUE", color: "#0891B2", darkColor: "#22D3EE" },
  recursion: { label: "Recursion", short: "REC", color: "#111827", darkColor: "#E5E7EB" },
};

const PIECE_TO_CATEGORY: Record<PieceType, Category> = {
  pawn: "loop",
  knight: "function",
  bishop: "array",
  rook: "stack",
  queen: "queue",
  king: "recursion",
};

const PIECE_SIZE: Record<PieceType, string> = {
  king: "h-9 w-9 text-[10px]",
  queen: "h-8 w-8 text-[10px]",
  rook: "h-7 w-7 text-[9px]",
  bishop: "h-7 w-7 text-[9px]",
  knight: "h-7 w-7 text-[9px]",
  pawn: "h-6 w-6 text-[8px]",
};

const LEGEND: { type: PieceType; label: string; short: string; color: string; value: string }[] = [
  { type: "pawn", label: "Loop", short: "LOOP", color: CATEGORY_META.loop.color, value: "for / while" },
  { type: "knight", label: "Function", short: "FN", color: CATEGORY_META.function.color, value: "closures, HOFs" },
  { type: "bishop", label: "Array", short: "ARR", color: CATEGORY_META.array.color, value: "traversal, search" },
  { type: "rook", label: "Stack", short: "STK", color: CATEGORY_META.stack.color, value: "LIFO" },
  { type: "queen", label: "Queue", short: "QUE", color: CATEGORY_META.queue.color, value: "FIFO" },
  { type: "king", label: "Recursion", short: "REC", color: CATEGORY_META.recursion.color, value: "base cases" },
];

/* ------------------------------------------------------------------ */
/*  Deterministic shuffle (no hydration mismatch — used at module load) */
/* ------------------------------------------------------------------ */

function shuffleWithSeed(values: string[], seed: number): { options: string[]; correctIndex: number } {
  const entries = values.map((v, i) => ({ v, isCorrect: i === 0 }));
  let s = seed + 1;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }
  return { options: entries.map((e) => e.v), correctIndex: entries.findIndex((e) => e.isCorrect) };
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQuestion(
  category: Category,
  id: string,
  prompt: string,
  code: string | undefined,
  correct: string,
  wrongs: string[],
  explanation: string,
  seed: number
): Question {
  const { options, correctIndex } = shuffleWithSeed([correct, ...wrongs], seed);
  return { id: `${category}-${id}`, category, prompt, code, options, correctIndex, explanation };
}

function buildCurated(
  category: Category,
  rows: [string, string, string, string, string, string][]
): Question[] {
  return rows.map((row, i) => {
    const [prompt, correct, w1, w2, w3, explanation] = row;
    return makeQuestion(category, `curated-${i}`, prompt, undefined, correct, [w1, w2, w3], explanation, i * 7 + 3);
  });
}

/* ------------------------------------------------------------------ */
/*  Curated questions (hand-written, 56 total)                        */
/* ------------------------------------------------------------------ */

const loopCurated = buildCurated("loop", [
  ["What is the time complexity of a loop that halves `n` each iteration until `n <= 1`?", "O(log n)", "O(n)", "O(n log n)", "O(1)", "Each iteration cuts the remaining work in half, so the number of iterations grows logarithmically with n."],
  ["A loop's inner loop runs from `i` to `n` for every outer index `i` from 0 to n. What is the overall time complexity?", "O(n²)", "O(n)", "O(n log n)", "O(2^n)", "The total work is a triangular sum (n + (n-1) + ... + 1), which is proportional to n²."],
  ["What is the main purpose of loop unrolling as a compiler optimization?", "Reduce loop-control overhead and improve instruction-level parallelism", "Make the code shorter to read", "Guarantee correctness of the loop", "Convert the loop into recursion", "Unrolling processes multiple iterations per loop pass, cutting branch and counter overhead."],
  ["What does a loop invariant guarantee in a correctness proof?", "A condition that holds true before and after every iteration", "That the loop will run in constant time", "That the loop always executes at least once", "That no variables are reassigned", "Loop invariants are the core tool for proving a loop achieves its intended result by induction."],
  ["Given `for (let i = 0; i <= n; i++) arr[i] = 0;` on an array of size n, what bug does this contain?", "It writes one index past the end of the array when i === n", "It never executes", "It skips the first element", "It runs in O(n²) instead of O(n)", "Valid indices are 0..n-1, so the condition should be `i < n`, not `i <= n`."],
  ["A dynamic array doubles its capacity whenever it's full. What is the amortized time complexity of a loop that appends n elements one at a time?", "O(1) amortized per append", "O(n) per append", "O(log n) per append", "O(n²) total is unavoidable", "Doubling means resizes become exponentially rarer, spreading their cost thin — the total for n appends is O(n)."],
  ["What is the key behavioral difference between a `do...while` loop and a `while` loop?", "`do...while` always executes the body at least once before checking the condition", "`while` runs faster", "`do...while` cannot contain a break statement", "There is no difference", "`do...while` checks its condition after the first pass, guaranteeing one execution regardless of the condition."],
  ["A loop repeatedly does `i *= 2` starting at 1 until `i >= n`. How many iterations does it take?", "O(log n)", "O(n)", "O(√n)", "O(n / 2)", "Since i doubles each time, it takes about log2(n) iterations to reach or exceed n."],
  ["In Floyd's cycle detection (tortoise and hare) loop, why does the 'hare' pointer move two steps per iteration while the 'tortoise' moves one?", "It guarantees the two pointers meet within a bounded number of steps if a cycle exists", "It makes the loop run in O(1) time", "It avoids needing a slow pointer at all", "It prevents the loop from ever terminating", "The relative speed difference of one step per iteration ensures the faster pointer laps the slower one inside any cycle."],
  ["A search loop breaks early as soon as it finds the target. What is its best-case time complexity, and does the worst case change?", "Best case O(1); worst case remains O(n)", "Best case O(n); worst case becomes O(1)", "Both best and worst case become O(1)", "Both best and worst case remain O(n²)", "An early break only helps when the target is found quickly; if it's absent or last, the loop still scans everything."],
]);

const functionCurated = buildCurated("function", [
  ["What does it mean for functions to be 'first-class' in a language?", "Functions can be assigned to variables, passed as arguments, and returned from other functions", "Functions run faster than loops", "Functions cannot have side effects", "Functions must be declared before use", "Treating functions as ordinary values is what enables callbacks, higher-order functions, and functional composition."],
  ["What is a closure?", "A function that retains access to variables from its enclosing scope even after that scope has returned", "A function with no parameters", "A function that calls itself", "A function that only runs once", "Closures 'close over' their surrounding variables, which is why counters and private state patterns work in JavaScript."],
  ["What defines a higher-order function?", "A function that takes another function as an argument, returns one, or both", "A function with more than three parameters", "A function that uses recursion internally", "A function declared at the top of a file", "map, filter, and reduce are classic higher-order functions because they accept callback functions."],
  ["What does tail-call optimization do for a tail-recursive function, where supported?", "Reuses the current stack frame instead of allocating a new one for the recursive call", "Converts the function into a loop automatically in all languages", "Removes the need for a base case", "Doubles the function's execution speed", "Because the recursive call is the last action, the runtime can discard the current frame, keeping stack usage constant."],
  ["What property must a pure function satisfy?", "Given the same input, it always returns the same output and produces no observable side effects", "It must not take any arguments", "It must return a number", "It must be recursive", "Purity makes functions predictable, testable, and safe to memoize or run in parallel."],
  ["What does currying transform a function into?", "A sequence of functions that each take a single argument", "A function that ignores all but its first argument", "A function that runs asynchronously", "A function that caches its own results", "curry(f)(a)(b)(c) breaks a multi-argument function into nested single-argument calls."],
  ["If a function's result for a given input is already stored in a memoization cache, what is the time complexity of retrieving it?", "O(1)", "O(n)", "O(log n)", "Same as recomputing it from scratch", "A cache hit is just a lookup, typically a hash map access, which is constant time on average."],
  ["What does a call stack frame store for a function invocation?", "Local variables, the return address, and the function's parameters", "Only the function's return value", "The entire source code of the function", "A copy of the global scope", "Each call pushes a new frame holding everything needed to resume the caller once the callee returns."],
  ["Why can a recursive function overflow the stack while an equivalent iterative version does not?", "Each recursive call adds a new stack frame that persists until that call returns, while iteration reuses the same frame", "Recursive functions always run slower", "Iteration cannot call other functions", "Recursive functions cannot use local variables", "Deep recursion accumulates frames linearly with depth; a loop just updates variables in place."],
  ["What is function composition?", "Combining two or more functions so the output of one becomes the input of the next", "Declaring multiple functions in one file", "Calling a function inside a try/catch block", "Passing a function zero arguments", "compose(f, g)(x) = f(g(x)) — it's how small, focused functions are chained into pipelines."],
]);

const arrayCurated = buildCurated("array", [
  ["What must be true about an array before you can run binary search on it?", "It must be sorted", "It must contain only integers", "It must have an even length", "It must contain no duplicates", "Binary search relies on being able to discard half the remaining elements based on an ordering comparison."],
  ["What is the time complexity of inserting an element at the beginning of a plain (non-linked) array of size n?", "O(n), because every existing element must shift over", "O(1)", "O(log n)", "O(n²)", "Arrays store elements contiguously, so making room at index 0 requires shifting all n elements."],
  ["What technique commonly finds a pair in a sorted array that sums to a target value in O(n) time?", "Two-pointer technique", "Nested loops checking every pair", "Binary search on every element", "Bubble sort", "Moving pointers inward from both ends lets you skip the O(n²) brute-force pair check entirely."],
  ["What is the time complexity of accessing `arr[i]` in a standard array by index?", "O(1)", "O(n)", "O(log n)", "O(n log n)", "Arrays support direct address computation from the base pointer and index, so access is constant time."],
  ["What problem does Kadane's algorithm solve, and in what time complexity?", "Maximum subarray sum, in O(n)", "Sorting an array, in O(n log n)", "Finding the median, in O(n)", "Counting inversions, in O(n²)", "Kadane's algorithm tracks a running best-so-far sum in a single linear pass."],
  ["What is the main benefit of the sliding window technique over brute force for subarray problems?", "It avoids recomputing overlapping work, often reducing O(n²) to O(n)", "It sorts the array first", "It only works on sorted arrays", "It reduces memory usage to O(1) always", "By adjusting window boundaries incrementally, you reuse prior computation instead of rescanning each subarray."],
  ["What is the average-case time complexity of Quickselect for finding the kth smallest element in an unsorted array?", "O(n)", "O(n log n)", "O(n²)", "O(log n)", "Quickselect only recurses into the partition containing the target, giving expected linear time."],
  ["The Dutch National Flag algorithm partitions an array into three groups in a single pass. What kind of input is it designed for?", "An array containing exactly three distinct values that need grouping", "Any array that needs full sorting", "A sorted array being searched", "A 2D grid of colors", "Classic use case: sorting an array of 0s, 1s, and 2s in one O(n) pass with three pointers."],
  ["What does a prefix sum array let you compute in O(1) time after O(n) preprocessing?", "The sum of any contiguous subrange of the original array", "The maximum value of the array", "Whether the array is sorted", "The index of any element", "prefixSum[j] - prefixSum[i-1] gives the sum from i to j instantly once the prefix array is built."],
]);

const stackCurated = buildCurated("stack", [
  ["What ordering principle defines a stack?", "Last-In, First-Out (LIFO)", "First-In, First-Out (FIFO)", "Elements are always sorted", "Random access by index", "The most recently pushed element is always the first one popped."],
  ["Which data structure is the standard tool for checking whether a string of brackets like `([{}])` is balanced?", "A stack", "A queue", "A hash map", "A linked list", "Opening brackets are pushed and matched against a popped bracket whenever a closing bracket appears."],
  ["What is the time complexity of push and pop on an array-backed stack?", "O(1) amortized", "O(n)", "O(log n)", "O(n log n)", "Both operations only touch the top of the stack, with occasional O(n) resizes amortized to O(1)."],
  ["How does a program's function call mechanism relate to the stack data structure?", "Each function call pushes a frame, and returning pops it — a direct LIFO structure", "Function calls use a queue to schedule execution order", "Function calls don't use any data structure", "Each call is stored in a hash map keyed by function name", "This is literally why it's called the 'call stack.'"],
  ["What data structure typically powers an 'undo' feature in an editor?", "A stack of previous states or actions", "A queue of pending edits", "A priority queue by timestamp", "A binary search tree", "Undo reverses the most recent action first — classic LIFO behavior."],
  ["What is a monotonic stack typically used for?", "Efficiently finding the next greater (or smaller) element for each item in O(n)", "Sorting an array in O(n log n)", "Detecting cycles in a graph", "Implementing a priority queue", "By keeping the stack's elements in increasing or decreasing order, each element is pushed and popped at most once."],
  ["What data structure is used to evaluate a postfix (Reverse Polish) expression like `3 4 +`?", "A stack", "A queue", "A binary tree", "A hash set", "Operands are pushed; when an operator appears, the needed operands are popped, combined, and the result is pushed back."],
  ["Two stacks can be combined to implement which other data structure?", "A queue", "A binary search tree", "A hash map", "A heap", "By transferring elements between an 'in' stack and an 'out' stack, you can simulate FIFO order."],
  ["What causes a 'stack overflow' error?", "The call stack exceeds its maximum allowed size, often from unbounded or very deep recursion", "An array index goes out of bounds", "A loop runs forever without recursion", "Too many variables are declared globally", "Each nested call adds a frame; without a reachable base case, frames pile up until memory for the stack is exhausted."],
]);

const queueCurated = buildCurated("queue", [
  ["What ordering principle defines a queue?", "First-In, First-Out (FIFO)", "Last-In, First-Out (LIFO)", "Elements are always sorted by value", "Random access by index", "The element that has been waiting longest is the first one removed."],
  ["Breadth-first search (BFS) on a graph or tree relies on which data structure to visit nodes level by level?", "A queue", "A stack", "A min-heap", "A hash set only", "Enqueueing neighbors and dequeueing from the front ensures nodes are visited in increasing distance order."],
  ["What is the main benefit of a circular queue implemented over a fixed-size array?", "It reuses freed slots at the front, giving O(1) enqueue/dequeue without shifting elements", "It automatically sorts elements as they're added", "It removes the need for a rear pointer", "It guarantees the queue never becomes full", "Wrapping the front and rear pointers around the array avoids the O(n) shifting a naive array queue would need."],
  ["A priority queue is most commonly implemented internally using which structure?", "A heap", "A plain array kept unsorted", "A doubly linked list", "A hash map", "A binary heap gives O(log n) insertion and O(log n) extraction of the highest (or lowest) priority element."],
  ["Two queues can be combined to implement which other data structure?", "A stack", "A binary search tree", "A graph", "A trie", "By reversing order across two queues during transfers, you can simulate LIFO behavior."],
  ["What is a deque?", "A double-ended queue that supports insertion and removal from both the front and the back", "A queue that only allows insertion", "A queue implemented with a stack", "A sorted queue", "'Deque' stands for double-ended queue, generalizing both stack and queue behavior in one structure."],
  ["What is the time complexity of enqueue and dequeue on a well-implemented linked-list-based queue?", "O(1)", "O(n)", "O(log n)", "O(n²)", "Maintaining direct pointers to both the head and tail lets both operations avoid any traversal."],
  ["In CPU task scheduling, which data structure models processes waiting for their turn to run?", "A queue (often a priority queue for scheduling algorithms)", "A stack", "A binary search tree", "A hash map", "Ready processes typically wait in a queue-like structure until the scheduler selects the next one to run."],
  ["What problem do message queues solve in distributed systems?", "They decouple producers and consumers, buffering messages so each side can operate asynchronously and at its own pace", "They guarantee zero network latency", "They replace the need for databases", "They sort all incoming requests numerically", "A producer can keep publishing even if a consumer is temporarily slow or offline, since messages wait in the queue."],
]);

const recursionCurated = buildCurated("recursion", [
  ["What is the purpose of a base case in a recursive function?", "It stops the recursion, preventing infinite calls and eventual stack overflow", "It makes the function run faster", "It is optional if the function is short", "It defines the function's return type", "Without a base case, every recursive call would trigger another, and the call stack would grow without bound."],
  ["What is a common trade-off of choosing recursion over an equivalent iterative solution?", "Recursion is often more readable for divide-and-conquer problems but uses more stack memory", "Recursion always runs faster than iteration", "Recursion never has a time complexity", "Iteration cannot express the same logic as recursion", "Each recursive call consumes stack space, while iteration typically updates variables in a fixed amount of memory."],
  ["What makes a recursive call a 'tail call'?", "The recursive call is the very last operation performed before the function returns", "The function has only one parameter", "The recursive call happens inside a loop", "The function returns a function", "Because nothing happens after the call returns, some languages can optimize it to avoid growing the stack."],
  ["How does recursion relate to the divide-and-conquer strategy?", "The problem is recursively broken into smaller subproblems, solved independently, then their results are combined", "Divide-and-conquer never uses recursion", "It only applies to sorting algorithms", "It requires the input to already be sorted", "Merge sort and quicksort are classic examples: split, recurse, and combine (or partition)."],
  ["What is the main benefit of memoization in a recursive algorithm like naive Fibonacci?", "It caches results of subproblems, avoiding redundant recomputation and reducing exponential time to roughly linear", "It eliminates the need for a base case", "It automatically parallelizes the recursion", "It reduces memory usage to zero", "Overlapping subproblems (like fib(n-2) being computed many times) are solved once and reused thereafter."],
  ["What is mutual recursion?", "Two or more functions that call each other, directly or indirectly", "A function that calls itself twice in one line", "A function with two base cases", "A recursive function with no return value", "Classic example: an `isEven` function that calls `isOdd`, which calls `isEven`, and so on down to a base case."],
  ["What is the Master Theorem primarily used for?", "Analyzing the time complexity of divide-and-conquer recurrences of the form T(n) = aT(n/b) + f(n)", "Proving a recursive function terminates", "Converting recursion into iteration automatically", "Measuring stack memory usage precisely", "It gives a direct formula for the asymptotic complexity based on how the problem size shrinks and recombines."],
  ["A recursive function repeatedly splits a problem of size n in half, doing O(1) work per call otherwise. What is the recursion depth?", "O(log n)", "O(n)", "O(n²)", "O(1)", "Halving the size each call means it takes about log2(n) calls to reach the base case."],
  ["Why is the naive recursive Fibonacci implementation exponential in time complexity?", "It redundantly recomputes the same overlapping subproblems many times over", "Addition is an inherently slow operation", "It uses an array internally", "Recursion is always exponential", "fib(n) calls fib(n-1) and fib(n-2), each of which recomputes shared subproblems like fib(n-3) repeatedly, producing roughly O(2^n) calls."],
]);

/* ------------------------------------------------------------------ */
/*  Generated questions (parameterized templates, 144 total)          */
/* ------------------------------------------------------------------ */

// LOOP — 24 generated
const LOOP_TRI_N = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const loopGenTri: Question[] = LOOP_TRI_N.map((N, i) => {
  const correct = (N * (N + 1)) / 2;
  return makeQuestion(
    "loop",
    `tri-${i}`,
    "What is the value of `count` after this code runs?",
    `let count = 0;\nfor (let i = 0; i < ${N}; i++) {\n  for (let j = i; j < ${N}; j++) {\n    count++;\n  }\n}\nconsole.log(count);`,
    String(correct),
    [String(N * N), String((N * (N - 1)) / 2), String(N)],
    `The inner loop runs (${N} - i) times for each i, so the total is the sum 1 + 2 + ... + ${N} = N(N+1)/2 = ${correct}.`,
    i + 11
  );
});

const LOOP_STEP_PAIRS: [number, number][] = [
  [21, 2], [31, 3], [26, 5], [17, 4], [41, 8], [19, 3],
  [28, 9], [51, 10], [22, 7], [37, 6], [46, 5], [23, 2],
];
const loopGenStep: Question[] = LOOP_STEP_PAIRS.map(([N, STEP], i) => {
  const correct = Math.ceil(N / STEP);
  return makeQuestion(
    "loop",
    `step-${i}`,
    "How many times does the loop body execute?",
    `let i = 0;\nlet steps = 0;\nwhile (i < ${N}) {\n  steps++;\n  i += ${STEP};\n}\nconsole.log(steps);`,
    String(correct),
    [String(Math.floor(N / STEP)), String(N), String(STEP)],
    `i starts at 0 and increases by ${STEP} each pass until it reaches or passes ${N}, taking ceil(${N}/${STEP}) = ${correct} iterations.`,
    i + 41
  );
});

// FUNCTION — 24 generated
const FN_POWER_PAIRS: [number, number][] = [
  [2, 5], [3, 4], [2, 7], [5, 3], [2, 8], [3, 5],
  [4, 4], [2, 9], [3, 6], [5, 4], [2, 10], [4, 5],
];
const functionGenPower: Question[] = FN_POWER_PAIRS.map(([base, exp], i) => {
  const correct = Math.pow(base, exp);
  return makeQuestion(
    "function",
    `power-${i}`,
    `What does \`power(${base}, ${exp})\` return?`,
    `function power(base, exp) {\n  if (exp === 0) return 1;\n  return base * power(base, exp - 1);\n}`,
    String(correct),
    [String(Math.pow(base, exp - 1)), String(base * exp), String(correct + base)],
    `power(${base}, ${exp}) multiplies ${base} by itself ${exp} times via recursion, yielding ${correct}.`,
    i + 71
  );
});

const FN_COMPOSE_PARAMS: [number, number, number][] = [
  [2, 3, 4], [3, 2, 5], [4, 1, 6], [2, 5, 3], [5, 2, 4], [3, 3, 3],
  [2, 4, 5], [4, 2, 7], [3, 4, 2], [2, 2, 8], [5, 1, 6], [3, 5, 1],
];
const functionGenCompose: Question[] = FN_COMPOSE_PARAMS.map(([A, B, X], i) => {
  const correct = A * (X + B);
  return makeQuestion(
    "function",
    `compose-${i}`,
    `What is \`h(${X})\`?`,
    `const f = (n) => n * ${A};\nconst g = (n) => n + ${B};\nconst compose = (fn1, fn2) => (x) => fn1(fn2(x));\nconst h = compose(f, g);`,
    String(correct),
    [String(A * X + B), String(X + B * A), String(X + B)],
    `compose(f, g)(x) applies g first, then f: h(${X}) = f(g(${X})) = f(${X} + ${B}) = ${A} × (${X} + ${B}) = ${correct}.`,
    i + 101
  );
});

// ARRAY — 24 generated
const ARR_BS_N = [7, 15, 31, 63, 10, 20, 50, 100, 12, 24, 40, 80];
const arrayGenBinarySearch: Question[] = ARR_BS_N.map((N, i) => {
  const correct = Math.ceil(Math.log2(N + 1));
  return makeQuestion(
    "array",
    `bsearch-${i}`,
    `A binary search runs on a sorted array of ${N} elements. What is the maximum number of comparisons needed to find an element or confirm it's absent?`,
    undefined,
    String(correct),
    [String(N), String(Math.ceil(N / 2)), String(Math.floor(Math.log2(N)))],
    `Binary search halves the search space each comparison, needing at most ceil(log2(n+1)) = ${correct} comparisons for n = ${N}.`,
    i + 131
  );
});

const ARR_SS_N = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const arrayGenSumSquares: Question[] = ARR_SS_N.map((N, i) => {
  const correct = (N * (N + 1) * (2 * N + 1)) / 6;
  return makeQuestion(
    "array",
    `sumsq-${i}`,
    "What is `result`?",
    `const arr = Array.from({ length: ${N} }, (_, i) => i + 1);\nconst result = arr.reduce((acc, x) => acc + x * x, 0);`,
    String(correct),
    [String(N * N), String(Math.pow((N * (N + 1)) / 2, 2)), String(N * (N + 1))],
    `This sums the squares 1² + 2² + ... + ${N}² using the formula n(n+1)(2n+1)/6 = ${correct}.`,
    i + 161
  );
});

// STACK — 24 generated
const SEQUENCES: { push: number[]; ops: number }[] = [
  { push: [1, 2, 3, 4], ops: 1 },
  { push: [5, 10, 15], ops: 2 },
  { push: [7, 14, 21, 28], ops: 3 },
  { push: [2, 4, 6, 8, 10], ops: 2 },
  { push: [9, 18, 27], ops: 1 },
  { push: [3, 6, 9, 12, 15], ops: 4 },
  { push: [11, 22, 33], ops: 2 },
  { push: [1, 3, 5, 7, 9], ops: 3 },
  { push: [8, 16, 24, 32], ops: 1 },
  { push: [4, 8, 12], ops: 2 },
  { push: [6, 12, 18, 24, 30], ops: 3 },
  { push: [13, 26, 39], ops: 1 },
];

const stackGenTop: Question[] = SEQUENCES.map((s, i) => {
  const remaining = s.push.slice(0, s.push.length - s.ops);
  const top = remaining[remaining.length - 1];
  const pool = s.push.filter((v) => v !== top);
  const wrongs = [pool[0], pool[1] ?? pool[0] + 1, pool[2] ?? pool[0] + 2].map(String);
  const ops = s.push.map((v) => `push(${v})`).concat(Array(s.ops).fill("pop()")).join("\n");
  return makeQuestion(
    "stack",
    `top-${i}`,
    "A stack starts empty. After these operations run in order, what value is on top?",
    ops,
    String(top),
    wrongs,
    `Popping ${s.ops} time(s) after pushing ${s.push.join(", ")} leaves [${remaining.join(", ")}] bottom→top, so the top is ${top}.`,
    i + 191
  );
});

const stackGenContents: Question[] = SEQUENCES.map((s, i) => {
  const remaining = s.push.slice(0, s.push.length - s.ops);
  const popped = s.push.slice(s.push.length - s.ops);
  const ops = s.push.map((v) => `push(${v})`).concat(Array(s.ops).fill("pop()")).join("\n");
  return makeQuestion(
    "stack",
    `contents-${i}`,
    "A stack starts empty. After these operations run in order, what are the remaining contents, listed bottom → top?",
    ops,
    `[${remaining.join(", ")}]`,
    [`[${s.push.join(", ")}]`, `[${[...remaining].reverse().join(", ")}]`, `[${popped.join(", ")}]`],
    `${s.ops} pop(s) remove from the top, leaving [${remaining.join(", ")}] from bottom to top.`,
    i + 221
  );
});

// QUEUE — 24 generated
const queueGenFront: Question[] = SEQUENCES.map((s, i) => {
  const remaining = s.push.slice(s.ops);
  const front = remaining[0];
  const pool = s.push.filter((v) => v !== front);
  const wrongs = [pool[0], pool[1] ?? pool[0] + 1, pool[2] ?? pool[0] + 2].map(String);
  const ops = s.push.map((v) => `enqueue(${v})`).concat(Array(s.ops).fill("dequeue()")).join("\n");
  return makeQuestion(
    "queue",
    `front-${i}`,
    "A queue starts empty. After these operations run in order, what value is at the front?",
    ops,
    String(front),
    wrongs,
    `Dequeue removes from the front. After enqueuing ${s.push.join(", ")} and dequeuing ${s.ops} time(s), the queue is [${remaining.join(", ")}] front→back, so the front is ${front}.`,
    i + 251
  );
});

const queueGenContents: Question[] = SEQUENCES.map((s, i) => {
  const remaining = s.push.slice(s.ops);
  const dequeued = s.push.slice(0, s.ops);
  const ops = s.push.map((v) => `enqueue(${v})`).concat(Array(s.ops).fill("dequeue()")).join("\n");
  return makeQuestion(
    "queue",
    `contents-${i}`,
    "A queue starts empty. After these operations run in order, what are the remaining contents, listed front → back?",
    ops,
    `[${remaining.join(", ")}]`,
    [`[${s.push.join(", ")}]`, `[${[...remaining].reverse().join(", ")}]`, `[${dequeued.join(", ")}]`],
    `${s.ops} dequeue(s) remove from the front, leaving [${remaining.join(", ")}] from front to back.`,
    i + 281
  );
});

// RECURSION — 24 generated
function countFibCalls(n: number): number {
  let calls = 0;
  const fib = (k: number): number => {
    calls++;
    if (k <= 2) return 1;
    return fib(k - 1) + fib(k - 2);
  };
  fib(n);
  return calls;
}
function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

const FIB_NS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
const recursionGenFib: Question[] = FIB_NS.map((N, i) => {
  const correct = countFibCalls(N);
  return makeQuestion(
    "recursion",
    `fib-${i}`,
    `How many total calls to \`fib\` occur when evaluating \`fib(${N})\`, including the initial call?`,
    `function fib(n) {\n  if (n <= 2) return 1;\n  return fib(n - 1) + fib(n - 2);\n}`,
    String(correct),
    [String(N), String(Math.pow(2, N)), String(N * N)],
    `Naive recursive Fibonacci re-solves overlapping subproblems; evaluating fib(${N}) makes ${correct} total calls.`,
    i + 311
  );
});

const FACT_NS = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const recursionGenFact: Question[] = FACT_NS.map((N, i) => {
  const correct = factorial(N);
  return makeQuestion(
    "recursion",
    `fact-${i}`,
    `What is \`factorial(${N})\`?`,
    `function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}`,
    String(correct),
    [String(N * N), String(factorial(N - 1)), String(N * (N - 1))],
    `factorial(${N}) = ${N} × ${N - 1} × ... × 1 = ${correct}.`,
    i + 341
  );
});

/* ------------------------------------------------------------------ */
/*  Question bank — 200 unique questions total                        */
/* ------------------------------------------------------------------ */

const QUESTION_BANK: Record<Category, Question[]> = {
  loop: [...loopCurated, ...loopGenTri, ...loopGenStep], // 10 + 12 + 12 = 34
  function: [...functionCurated, ...functionGenPower, ...functionGenCompose], // 10 + 12 + 12 = 34
  array: [...arrayCurated, ...arrayGenBinarySearch, ...arrayGenSumSquares], // 9 + 12 + 12 = 33
  stack: [...stackCurated, ...stackGenTop, ...stackGenContents], // 9 + 12 + 12 = 33
  queue: [...queueCurated, ...queueGenFront, ...queueGenContents], // 9 + 12 + 12 = 33
  recursion: [...recursionCurated, ...recursionGenFib, ...recursionGenFact], // 9 + 12 + 12 = 33
};
// Total: 34 + 34 + 33 + 33 + 33 + 33 = 200

/* ------------------------------------------------------------------ */
/*  Chess logic (casual rules — no check/checkmate detection)         */
/* ------------------------------------------------------------------ */

function createInitialBoard(): Board {
  const back: PieceType[] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (let c = 0; c < 8; c++) {
    board[0][c] = { type: back[c], color: "b" };
    board[1][c] = { type: "pawn", color: "b" };
    board[6][c] = { type: "pawn", color: "w" };
    board[7][c] = { type: back[c], color: "w" };
  }
  return board;
}

function cloneBoard(b: Board): Board {
  return b.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function getLegalMoves(board: Board, r: number, c: number): [number, number][] {
  const piece = board[r][c];
  if (!piece) return [];
  const moves: [number, number][] = [];
  const enemy: Side = piece.color === "w" ? "b" : "w";

  const addSliding = (dirs: [number, number][]) => {
    for (const [dr, dc] of dirs) {
      let nr = r + dr;
      let nc = c + dc;
      while (inBounds(nr, nc)) {
        const target = board[nr][nc];
        if (!target) {
          moves.push([nr, nc]);
        } else {
          if (target.color === enemy) moves.push([nr, nc]);
          break;
        }
        nr += dr;
        nc += dc;
      }
    }
  };

  switch (piece.type) {
    case "pawn": {
      const dir = piece.color === "w" ? -1 : 1;
      const startRow = piece.color === "w" ? 6 : 1;
      if (inBounds(r + dir, c) && !board[r + dir][c]) {
        moves.push([r + dir, c]);
        if (r === startRow && !board[r + 2 * dir][c]) moves.push([r + 2 * dir, c]);
      }
      for (const dc of [-1, 1]) {
        const nr = r + dir;
        const nc = c + dc;
        if (inBounds(nr, nc) && board[nr][nc] && board[nr][nc]!.color === enemy) moves.push([nr, nc]);
      }
      break;
    }
    case "knight": {
      const offsets: [number, number][] = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1],
      ];
      for (const [dr, dc] of offsets) {
        const nr = r + dr;
        const nc = c + dc;
        if (inBounds(nr, nc) && (!board[nr][nc] || board[nr][nc]!.color === enemy)) moves.push([nr, nc]);
      }
      break;
    }
    case "bishop":
      addSliding([[-1, -1], [-1, 1], [1, -1], [1, 1]]);
      break;
    case "rook":
      addSliding([[-1, 0], [1, 0], [0, -1], [0, 1]]);
      break;
    case "queen":
      addSliding([[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]);
      break;
    case "king": {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (inBounds(nr, nc) && (!board[nr][nc] || board[nr][nc]!.color === enemy)) moves.push([nr, nc]);
        }
      }
      break;
    }
  }
  return moves;
}

function squareName([r, c]: [number, number]): string {
  return "abcdefgh"[c] + String(8 - r);
}

/* ------------------------------------------------------------------ */
/*  Piece badge                                                       */
/* ------------------------------------------------------------------ */

function PieceBadge({ piece }: { piece: Piece }) {
  const category = PIECE_TO_CATEGORY[piece.type];
  const meta = CATEGORY_META[category];
  const sizeClass = PIECE_SIZE[piece.type];
  if (piece.color === "w") {
    return (
      <span
        className={`flex items-center justify-center rounded-md font-bold text-white shadow-sm dark:shadow-black/30 ${sizeClass}`}
        style={{ backgroundColor: meta.color }}
      >
        {meta.short}
      </span>
    );
  }
  return (
    <span
      className={`flex items-center justify-center rounded-md border-2 bg-white font-bold shadow-sm dark:bg-neutral-900 dark:shadow-black/30 ${sizeClass}`}
      style={{ borderColor: meta.color, color: meta.color }}
    >
      {meta.short}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

interface PendingMove {
  from: [number, number];
  to: [number, number];
  piece: Piece;
}

function initPools(): Record<Category, Question[]> {
  const obj = {} as Record<Category, Question[]>;
  (Object.keys(QUESTION_BANK) as Category[]).forEach((cat) => {
    obj[cat] = shuffleArray(QUESTION_BANK[cat]);
  });
  return obj;
}

export default function CodeChessPage() {
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [turn, setTurn] = useState<Side>("w");
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]);
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [chosenOption, setChosenOption] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<Side, { correct: number; total: number }>>({
    w: { correct: 0, total: 0 },
    b: { correct: 0, total: 0 },
  });
  const [log, setLog] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState<{ winner: Side } | null>(null);

  const poolsRef = useRef<Record<Category, Question[]> | null>(null);
  const getPools = () => {
    if (!poolsRef.current) poolsRef.current = initPools();
    return poolsRef.current;
  };

  const pickQuestion = useCallback((category: Category): Question => {
    const pools = getPools();
    let arr = pools[category];
    if (arr.length === 0) arr = shuffleArray(QUESTION_BANK[category]);
    const q = arr[0];
    pools[category] = arr.slice(1);
    return q;
  }, []);

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setTurn("w");
    setSelected(null);
    setLegalMoves([]);
    setPendingMove(null);
    setActiveQuestion(null);
    setChosenOption(null);
    setScores({ w: { correct: 0, total: 0 }, b: { correct: 0, total: 0 } });
    setLog([]);
    setGameOver(null);
    poolsRef.current = null;
  }, []);

  const handleSquareClick = useCallback(
    (r: number, c: number) => {
      if (gameOver || activeQuestion) return;
      const piece = board[r][c];

      if (selected) {
        if (selected[0] === r && selected[1] === c) {
          setSelected(null);
          setLegalMoves([]);
          return;
        }
        const isLegal = legalMoves.some(([lr, lc]) => lr === r && lc === c);
        if (isLegal) {
          const movingPiece = board[selected[0]][selected[1]]!;
          const category = PIECE_TO_CATEGORY[movingPiece.type];
          const q = pickQuestion(category);
          setPendingMove({ from: selected, to: [r, c], piece: movingPiece });
          setActiveQuestion(q);
          setChosenOption(null);
          return;
        }
        if (piece && piece.color === turn) {
          setSelected([r, c]);
          setLegalMoves(getLegalMoves(board, r, c));
          return;
        }
        setSelected(null);
        setLegalMoves([]);
        return;
      }

      if (piece && piece.color === turn) {
        setSelected([r, c]);
        setLegalMoves(getLegalMoves(board, r, c));
      }
    },
    [board, selected, legalMoves, turn, gameOver, activeQuestion, pickQuestion]
  );

  const handleContinue = useCallback(() => {
    if (!activeQuestion || !pendingMove || chosenOption === null) return;
    const correct = chosenOption === activeQuestion.correctIndex;
    const mover = turn;

    setScores((prev) => ({
      ...prev,
      [mover]: { correct: prev[mover].correct + (correct ? 1 : 0), total: prev[mover].total + 1 },
    }));

    let winner: Side | null = null;
    if (correct) {
      const newBoard = cloneBoard(board);
      const [fr, fc] = pendingMove.from;
      const [tr, tc] = pendingMove.to;
      const captured = newBoard[tr][tc];
      if (captured && captured.type === "king") winner = mover;
      let movedPiece: Piece = { ...pendingMove.piece };
      if (movedPiece.type === "pawn" && (tr === 0 || tr === 7)) movedPiece = { ...movedPiece, type: "queen" };
      newBoard[tr][tc] = movedPiece;
      newBoard[fr][fc] = null;
      setBoard(newBoard);
    }

    const label = CATEGORY_META[PIECE_TO_CATEGORY[pendingMove.piece.type]].label;
    const fromSq = squareName(pendingMove.from);
    const toSq = squareName(pendingMove.to);
    setLog((prev) => [
      `${mover === "w" ? "White" : "Black"} ${label} ${fromSq}→${toSq} — ${correct ? "correct ✓, move played" : "incorrect ✗, move forfeited"}`,
      ...prev,
    ]);

    setActiveQuestion(null);
    setPendingMove(null);
    setChosenOption(null);
    setSelected(null);
    setLegalMoves([]);

    if (winner) {
      setGameOver({ winner });
    } else {
      setTurn((prev) => (prev === "w" ? "b" : "w"));
    }
  }, [activeQuestion, pendingMove, chosenOption, turn, board]);

  const totalAnswered = scores.w.total + scores.b.total;

  return (
    <main className="min-h-screen bg-white text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {/* Header */}
        <header className="mb-10 border-b border-neutral-200 pb-8 dark:border-neutral-800">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
            Algorithmic Practice · Two Player
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl">
            Code<span className="text-blue-600 dark:text-blue-400">Chess</span>
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-500 dark:text-neutral-400">
            Chess, rewritten for engineers. Every piece is a data structure or control-flow concept.
            To move a piece, answer the question it hands you - get it wrong, and your turn is
            forfeited. 200 unique, advanced questions across six categories.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Board column */}
          <div>
            <div className="mb-4 flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center gap-2">
                <span
                  className={`h-3 w-3 rounded-full ${
                    turn === "w"
                      ? "bg-neutral-900 dark:bg-neutral-100"
                      : "border border-neutral-400 bg-neutral-300 dark:border-neutral-500 dark:bg-neutral-600"
                  }`}
                />
                <span className="text-sm font-medium">
                  {gameOver ? "Game over" : `${turn === "w" ? "White" : "Black"} to move`}
                </span>
              </div>
              <button
                onClick={resetGame}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
              >
                New game
              </button>
            </div>

            <div className="aspect-square w-full select-none overflow-hidden rounded-xl border border-neutral-200 shadow-sm dark:border-neutral-800">
              <div className="grid h-full w-full grid-cols-8 grid-rows-8">
                {board.map((row, r) =>
                  row.map((cell, c) => {
                    const isDark = (r + c) % 2 === 1;
                    const isSelected = selected && selected[0] === r && selected[1] === c;
                    const isLegal = legalMoves.some(([lr, lc]) => lr === r && lc === c);
                    return (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => handleSquareClick(r, c)}
                        className={`relative flex items-center justify-center border-0 transition-colors ${
                          isDark
                            ? "bg-neutral-100 dark:bg-neutral-800"
                            : "bg-white dark:bg-neutral-900"
                        } ${isSelected ? "ring-2 ring-inset ring-blue-500 dark:ring-blue-400" : ""}`}
                      >
                        {isLegal && !cell && (
                          <span className="absolute h-2.5 w-2.5 rounded-full bg-blue-400/70 dark:bg-blue-400/80" />
                        )}
                        {isLegal && cell && (
                          <span className="absolute inset-1 rounded border-2 border-blue-400/70 dark:border-blue-400/80" />
                        )}
                        {cell && <PieceBadge piece={cell} />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {gameOver && (
              <div className="mt-4 rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-3 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900">
                <p className="text-sm font-medium">
                  {gameOver.winner === "w" ? "White" : "Black"} wins — the king has been captured.
                </p>
              </div>
            )}

            <div className="mt-6">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Move log
              </h2>
              <div className="max-h-48 divide-y divide-neutral-100 overflow-y-auto rounded-xl border border-neutral-200 font-mono text-xs dark:divide-neutral-800 dark:border-neutral-800">
                {log.length === 0 && (
                  <p className="px-3 py-2 text-neutral-400 dark:text-neutral-500">No moves yet.</p>
                )}
                {log.map((entry, i) => (
                  <p key={i} className="px-3 py-2 text-neutral-600 dark:text-neutral-400">
                    {entry}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Piece legend
              </h2>
              <div className="space-y-2.5">
                {LEGEND.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-md text-[9px] font-bold text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.short}
                      </span>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{item.label}</span>
                    </div>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Accuracy
              </h2>
              <div className="space-y-3">
                {(["w", "b"] as const).map((side) => (
                  <div key={side}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        {side === "w" ? "White" : "Black"}
                      </span>
                      <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                        {scores[side].correct}/{scores[side].total}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <div
                        className="h-full bg-blue-500 dark:bg-blue-400"
                        style={{
                          width: scores[side].total ? `${(scores[side].correct / scores[side].total) * 100}%` : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">
                {totalAnswered} of 200 challenges seen this session.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 text-sm leading-relaxed text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                How it works
              </h2>
              <p>
                Select a piece, then a highlighted square to attempt a move. Answer the question
                correctly to complete it — miss it, and the turn passes without moving. Capture the
                opposing king to win. Standard piece movement, casual rules (no check/checkmate
                detection).
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Question modal */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4 dark:bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/50">
            <div className="mb-4 flex items-center gap-2">
              <span
                className="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: CATEGORY_META[activeQuestion.category].color }}
              >
                {CATEGORY_META[activeQuestion.category].label}
              </span>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                {turn === "w" ? "White" : "Black"} to answer
              </span>
            </div>
            <p className="mb-3 text-sm font-medium text-neutral-900 dark:text-neutral-50">
              {activeQuestion.prompt}
            </p>
            {activeQuestion.code && (
              <pre className="mb-4 overflow-x-auto rounded-lg bg-neutral-900 p-3 text-xs leading-relaxed text-neutral-100 dark:bg-black dark:text-neutral-200">
                <code>{activeQuestion.code}</code>
              </pre>
            )}
            <div className="space-y-2">
              {activeQuestion.options.map((opt, idx) => {
                const isChosen = chosenOption === idx;
                const isCorrectAnswer = idx === activeQuestion.correctIndex;
                let style = "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500 dark:text-neutral-200";
                if (chosenOption !== null) {
                  if (isCorrectAnswer)
                    style = "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400";
                  else if (isChosen)
                    style = "border-red-400 bg-red-50 text-red-600 dark:border-red-500 dark:bg-red-500/10 dark:text-red-400";
                  else style = "border-neutral-200 opacity-50 dark:border-neutral-700 dark:text-neutral-500";
                }
                return (
                  <button
                    key={idx}
                    disabled={chosenOption !== null}
                    onClick={() => setChosenOption(idx)}
                    className={`w-full rounded-lg border px-3 py-2 text-left font-mono text-sm transition-colors ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {chosenOption !== null && (
              <div className="mt-4 rounded-lg bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {activeQuestion.explanation}
              </div>
            )}
            <div className="mt-5 flex justify-end">
              <button
                disabled={chosenOption === null}
                onClick={handleContinue}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}