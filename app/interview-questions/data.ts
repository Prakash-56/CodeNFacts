// ---------------------------------------------------------------------------
// Interview question data model + seed bank.
//
// This file is intentionally separate from page.tsx so the question bank can
// grow (toward 3000+) without ever touching UI code. To scale it up further:
//   1. Split by category into data/javascript.ts, data/system-design.ts, etc.
//   2. Import + spread them into QUESTIONS below.
//   3. Keep `id` globally unique (category prefix + number is the convention
//      used here) so bookmarks/progress saved by id never collide.
// ---------------------------------------------------------------------------

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface CompareVisual {
  type: "compare";
  leftLabel: string;
  rightLabel: string;
  rows: [string, string][];
}

export interface FlowVisual {
  type: "flow";
  steps: string[];
}

export interface ComplexityVisual {
  type: "complexity";
  // value is 1-10, purely relative — used to size the bar, not a real metric
  rows: { label: string; value: number; note: string }[];
}

export interface TreeVisual {
  type: "tree";
  root: string;
  children: { label: string; children?: string[] }[];
}

export type Visual = CompareVisual | FlowVisual | ComplexityVisual | TreeVisual;

export interface InterviewQuestion {
  id: string;
  category: string;
  difficulty: Difficulty;
  question: string;
  answer: string;
  tags: string[];
  visual?: Visual;
}

export const CATEGORIES = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js & Backend",
  "Data Structures",
  "Algorithms",
  "System Design",
  "Databases & SQL",
  "OOP & Design Patterns",
  "CS Fundamentals",
  "Python",
  "Git & DevOps",
  "Testing",
  "HTML & CSS",
  "Behavioral & HR",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const QUESTIONS: InterviewQuestion[] = [
  // ---------------------------------------------------------------------
  // JavaScript
  // ---------------------------------------------------------------------
  {
    id: "js-1",
    category: "JavaScript",
    difficulty: "Beginner",
    question: "What's the difference between let, const, and var?",
    answer:
      "var is function-scoped and hoisted with an undefined value, so it can be read before its declaration line. let and const are block-scoped and live in a 'temporal dead zone' until their declaration runs. const additionally forbids reassigning the binding, though the object it points to can still be mutated.",
    tags: ["scope", "es6"],
    visual: {
      type: "compare",
      leftLabel: "var",
      rightLabel: "let / const",
      rows: [
        ["Function-scoped", "Block-scoped"],
        ["Hoisted as undefined", "Hoisted, but in a temporal dead zone"],
        ["Can be redeclared", "Cannot be redeclared in the same scope"],
        ["Leaks out of if/for blocks", "Stays inside the block"],
      ],
    },
  },
  {
    id: "js-2",
    category: "JavaScript",
    difficulty: "Intermediate",
    question: "Explain closures with a practical example.",
    answer:
      "A closure is a function that retains access to variables from its enclosing scope even after that scope has finished executing. A common use is a counter factory: makeCounter() returns an inner function that still remembers and can update a private 'count' variable, without exposing it globally.",
    tags: ["closures", "scope"],
  },
  {
    id: "js-3",
    category: "JavaScript",
    difficulty: "Intermediate",
    question: "How does the JavaScript event loop work?",
    answer:
      "JS runs on a single thread with a call stack. Synchronous code executes immediately; async callbacks (timers, I/O) go to the callback queue while promise callbacks go to the microtask queue, which the event loop drains completely before checking the callback queue. That's why a resolved Promise runs before a setTimeout(fn, 0).",
    tags: ["event-loop", "async"],
    visual: {
      type: "flow",
      steps: [
        "Call stack runs synchronous code",
        "Async work is handed off (timer, fetch, I/O)",
        "Completed work's callback enters a queue",
        "Microtasks (Promises) drain first, fully",
        "Event loop pulls next macrotask from the callback queue",
      ],
    },
  },
  {
    id: "js-4",
    category: "JavaScript",
    difficulty: "Beginner",
    question: "What is the difference between == and ===?",
    answer:
      "== coerces operands to the same type before comparing, which can produce surprising results like '' == 0 being true. === compares both value and type without coercion, which is why it's the recommended default in most style guides.",
    tags: ["operators", "equality"],
  },
  {
    id: "js-5",
    category: "JavaScript",
    difficulty: "Advanced",
    question: "What is prototypal inheritance and how does it differ from classical inheritance?",
    answer:
      "In JavaScript, objects inherit directly from other objects via an internal [[Prototype]] link, so a property lookup walks up the prototype chain until it's found or the chain ends at null. Classical inheritance (Java, C++) instead copies behavior from a class blueprint at instantiation. JS classes are syntactic sugar over the same prototype mechanism.",
    tags: ["prototypes", "oop"],
  },
  {
    id: "js-6",
    category: "JavaScript",
    difficulty: "Intermediate",
    question: "What does 'this' refer to in different invocation contexts?",
    answer:
      "'this' is determined by how a function is called, not where it's defined. As a method, it's the object before the dot; as a plain function call, it's undefined in strict mode (or the global object otherwise); with call/apply/bind, it's explicitly set; and in an arrow function, it's inherited lexically from the enclosing scope.",
    tags: ["this", "functions"],
  },
  {
    id: "js-7",
    category: "JavaScript",
    difficulty: "Intermediate",
    question: "How do Promises differ from async/await?",
    answer:
      "async/await is syntax built on top of Promises — it doesn't replace them. An async function always returns a Promise, and await pauses execution within that function until the awaited Promise settles, letting you write asynchronous logic that reads like synchronous code while still being non-blocking.",
    tags: ["promises", "async-await"],
  },
  {
    id: "js-8",
    category: "JavaScript",
    difficulty: "Advanced",
    question: "What is debouncing and throttling, and when would you use each?",
    answer:
      "Debouncing delays a function until a burst of calls has stopped for a set time — useful for a search-as-you-type box so you only fire the API call after the user pauses. Throttling guarantees a function runs at most once per interval regardless of how many times it's triggered — useful for scroll or resize handlers that must respond continuously but not on every single event.",
    tags: ["performance", "events"],
    visual: {
      type: "compare",
      leftLabel: "Debounce",
      rightLabel: "Throttle",
      rows: [
        ["Waits for a pause in events", "Runs on a fixed schedule"],
        ["Good for search input", "Good for scroll/resize"],
        ["Fires once, after the burst", "Fires repeatedly, at intervals"],
      ],
    },
  },
  {
    id: "js-9",
    category: "JavaScript",
    difficulty: "Beginner",
    question: "What is the difference between null and undefined?",
    answer:
      "undefined means a variable has been declared but never assigned a value, and it's also what a function returns by default. null is an explicit assignment meaning 'no value', deliberately set by the programmer.",
    tags: ["types"],
  },
  {
    id: "js-10",
    category: "JavaScript",
    difficulty: "Advanced",
    question: "Explain event delegation and why it's useful.",
    answer:
      "Event delegation attaches a single listener to a common parent instead of one listener per child, relying on event bubbling to catch events from descendants via e.target. It reduces memory usage on long lists and automatically handles elements added to the DOM later, without rebinding listeners.",
    tags: ["dom", "events"],
  },
  {
    id: "js-11",
    category: "JavaScript",
    difficulty: "Intermediate",
    question: "What are the differences between map, filter, and reduce?",
    answer:
      "map transforms every element and returns a new array of the same length. filter keeps only elements passing a test, returning a possibly-shorter array. reduce folds the array down into a single accumulated value, and is general enough to implement both map and filter.",
    tags: ["arrays", "functional"],
  },
  {
    id: "js-12",
    category: "JavaScript",
    difficulty: "Advanced",
    question: "What is a memory leak in JavaScript and how can it happen?",
    answer:
      "A memory leak happens when memory that's no longer needed isn't released because something still references it. Common causes: forgotten timers/intervals holding a closure, detached DOM nodes still referenced from JS variables, and accidental global variables that live for the page's whole lifetime.",
    tags: ["performance", "memory"],
  },
  {
    id: "js-13",
    category: "JavaScript",
    difficulty: "Beginner",
    question: "What is hoisting?",
    answer:
      "Hoisting is JavaScript's behavior of processing variable and function declarations during a compile step before code runs, so they're 'known' to the scope in advance. var declarations are hoisted and initialized to undefined; function declarations are hoisted with their full body, which is why you can call a function before its definition appears in the file.",
    tags: ["hoisting"],
  },
  {
    id: "js-14",
    category: "JavaScript",
    difficulty: "Intermediate",
    question: "What are generator functions used for?",
    answer:
      "A generator (function*) can pause its execution at a yield and resume later, producing values lazily one at a time. They're useful for representing infinite sequences, custom iterators, and for building coroutine-like control flow, which is part of how async/await is implemented under the hood.",
    tags: ["generators", "iterators"],
  },
  {
    id: "js-15",
    category: "JavaScript",
    difficulty: "Advanced",
    question: "How does JavaScript's garbage collection work?",
    answer:
      "Modern engines mainly use a generational, mark-and-sweep collector: it starts from root references (globals, the stack) and marks everything reachable; anything unmarked is considered garbage and swept. Objects are commonly split into a 'young' and 'old' generation, since most objects die young, which lets the collector run cheaper, more frequent passes on new memory.",
    tags: ["memory", "internals"],
  },
  {
    id: "js-16",
    category: "JavaScript",
    difficulty: "Beginner",
    question: "What is destructuring assignment?",
    answer:
      "Destructuring lets you unpack values from arrays or properties from objects into distinct variables in one expression, e.g. const { name, age } = user or const [first, second] = list. It also supports default values and renaming while unpacking.",
    tags: ["es6", "syntax"],
  },
  {
    id: "js-17",
    category: "JavaScript",
    difficulty: "Intermediate",
    question: "What's the difference between shallow copy and deep copy?",
    answer:
      "A shallow copy (spread, Object.assign) duplicates the top-level structure but nested objects/arrays still point to the original references, so mutating a nested value affects both copies. A deep copy (structuredClone, or a recursive clone) duplicates every nested level so the copies are fully independent.",
    tags: ["objects", "copying"],
  },
  {
    id: "js-18",
    category: "JavaScript",
    difficulty: "Advanced",
    question: "What are WeakMap and WeakSet, and why do they exist?",
    answer:
      "WeakMap and WeakSet hold their keys/values 'weakly' — meaning those references don't prevent garbage collection. They're useful for attaching metadata to objects (like caching computed data per-object) without causing a memory leak if that object is later discarded elsewhere in the app.",
    tags: ["memory", "collections"],
  },
  {
    id: "js-19",
    category: "JavaScript",
    difficulty: "Beginner",
    question: "What is NaN, and how do you correctly check for it?",
    answer:
      "NaN ('Not a Number') is the result of an invalid numeric operation, like 0/0 or parsing a non-numeric string. It's famously not equal to itself (NaN === NaN is false), so the correct check is Number.isNaN(value), not a direct equality comparison.",
    tags: ["numbers", "gotchas"],
  },
  {
    id: "js-20",
    category: "JavaScript",
    difficulty: "Intermediate",
    question: "What is currying, and why would you use it?",
    answer:
      "Currying transforms a function taking multiple arguments into a sequence of functions each taking one argument, e.g. add(a)(b)(c) instead of add(a, b, c). It's useful for creating specialized, reusable functions by partially applying some arguments ahead of time.",
    tags: ["functional"],
  },

  // ---------------------------------------------------------------------
  // TypeScript
  // ---------------------------------------------------------------------
  {
    id: "ts-1",
    category: "TypeScript",
    difficulty: "Beginner",
    question: "What problem does TypeScript solve over plain JavaScript?",
    answer:
      "TypeScript adds a static type system on top of JavaScript, catching type mismatches, typos in property names, and incorrect function signatures at compile time instead of at runtime. It compiles down to plain JS, so it doesn't change how the code actually runs — only what errors get caught before it ships.",
    tags: ["basics"],
  },
  {
    id: "ts-2",
    category: "TypeScript",
    difficulty: "Intermediate",
    question: "What's the difference between interface and type?",
    answer:
      "Both can describe object shapes, and in most everyday cases they're interchangeable. interface supports declaration merging (multiple declarations combine automatically) and is the conventional choice for public object/class shapes, while type can describe unions, tuples, and mapped types that interface cannot.",
    tags: ["types"],
  },
  {
    id: "ts-3",
    category: "TypeScript",
    difficulty: "Advanced",
    question: "What are generics, and why are they useful?",
    answer:
      "Generics let a function, class, or type accept a type parameter, so the same code stays type-safe across many concrete types instead of using 'any'. For example, function identity<T>(value: T): T preserves whatever specific type is passed in, rather than widening it to a generic 'any'.",
    tags: ["generics"],
  },
  {
    id: "ts-4",
    category: "TypeScript",
    difficulty: "Intermediate",
    question: "What is the difference between unknown and any?",
    answer:
      "any opts a value out of type checking entirely — you can call anything on it with no error. unknown also accepts any value, but forces you to narrow its type (with a type guard or assertion) before you can operate on it, which keeps type safety intact while still allowing flexible input.",
    tags: ["types", "safety"],
  },
  {
    id: "ts-5",
    category: "TypeScript",
    difficulty: "Advanced",
    question: "What are utility types like Partial, Pick, and Omit used for?",
    answer:
      "They transform existing types instead of redefining them by hand. Partial<T> makes every property optional (handy for update payloads), Pick<T, Keys> selects a subset of properties, and Omit<T, Keys> excludes specific properties — all keeping the result in sync if the original type changes.",
    tags: ["utility-types"],
  },
  {
    id: "ts-6",
    category: "TypeScript",
    difficulty: "Intermediate",
    question: "What does the 'strict' compiler flag actually enable?",
    answer:
      "strict is a bundle of several checks: no implicit any, strict null checks (null/undefined aren't assignable to other types unless explicitly included), strict function types, and a few others. Turning it on is the single biggest lever for catching real bugs, especially strictNullChecks.",
    tags: ["config"],
  },
  {
    id: "ts-7",
    category: "TypeScript",
    difficulty: "Advanced",
    question: "What is a discriminated union and why is it useful?",
    answer:
      "A discriminated union is a set of object types that share a common literal field (like kind: 'circle' | 'square') used as a tag. Switching on that tag lets TypeScript narrow which specific shape you're working with in each branch, giving compile-time exhaustiveness checks instead of runtime guessing.",
    tags: ["unions", "narrowing"],
  },
  {
    id: "ts-8",
    category: "TypeScript",
    difficulty: "Beginner",
    question: "What is type narrowing?",
    answer:
      "Narrowing is TypeScript refining a broader type into a more specific one within a code branch, based on runtime checks like typeof, instanceof, truthiness, or a custom type guard function. After the check, TypeScript lets you use members that only exist on the narrowed type.",
    tags: ["narrowing"],
  },
  {
    id: "ts-9",
    category: "TypeScript",
    difficulty: "Intermediate",
    question: "What are enums, and when should you prefer a union of string literals instead?",
    answer:
      "Enums generate real runtime objects mapping names to values, which is useful for a fixed set of related constants. A union of string literals ('small' | 'medium' | 'large') has zero runtime cost and serializes naturally to JSON, so many style guides prefer it unless you specifically need enum's reverse-mapping or namespacing behavior.",
    tags: ["enums"],
  },
  {
    id: "ts-10",
    category: "TypeScript",
    difficulty: "Advanced",
    question: "What is the difference between declare and a normal type declaration?",
    answer:
      "declare tells the compiler 'trust me, this exists elsewhere' — it describes the shape of a value (often from a JS library or global script) without producing any runtime code itself. It's the mechanism behind .d.ts type declaration files.",
    tags: ["declarations"],
  },

  // ---------------------------------------------------------------------
  // React
  // ---------------------------------------------------------------------
  {
    id: "react-1",
    category: "React",
    difficulty: "Beginner",
    question: "What is the virtual DOM and why does React use it?",
    answer:
      "The virtual DOM is a lightweight in-memory representation of the real DOM. When state changes, React builds a new virtual tree, diffs it against the previous one, and applies only the minimal set of real DOM updates needed — avoiding the cost of re-rendering the whole page for small changes.",
    tags: ["fundamentals"],
    visual: {
      type: "flow",
      steps: [
        "State changes",
        "React builds a new virtual DOM tree",
        "Diffing compares it to the previous tree",
        "Only the changed nodes are computed",
        "Real DOM is patched minimally",
      ],
    },
  },
  {
    id: "react-2",
    category: "React",
    difficulty: "Intermediate",
    question: "What's the difference between useEffect and useLayoutEffect?",
    answer:
      "useEffect runs asynchronously after the browser has painted, so it won't block visual updates. useLayoutEffect runs synchronously right after DOM mutations but before the browser paints, which matters when you need to measure or adjust the DOM before the user sees it, at the cost of potentially blocking paint.",
    tags: ["hooks"],
  },
  {
    id: "react-3",
    category: "React",
    difficulty: "Beginner",
    question: "What are keys in React lists, and why do they matter?",
    answer:
      "Keys give React a stable identity for each item in a list across renders, so it can tell which items were added, removed, or reordered instead of re-rendering everything. Using array index as a key can cause subtle bugs when items are reordered or removed, since the index no longer matches the same logical item.",
    tags: ["lists", "keys"],
  },
  {
    id: "react-4",
    category: "React",
    difficulty: "Advanced",
    question: "How does React's reconciliation algorithm decide whether to reuse or replace a DOM node?",
    answer:
      "React compares elements by type first: if the type changes (e.g. a div becomes a span), it tears down the old subtree and builds a new one. If the type is the same, React keeps the underlying DOM node and just updates its changed attributes, then recurses into children matched by key.",
    tags: ["reconciliation", "internals"],
  },
  {
    id: "react-5",
    category: "React",
    difficulty: "Intermediate",
    question: "What problem does useMemo solve, and when is it not worth using?",
    answer:
      "useMemo caches the result of an expensive calculation between renders, recomputing only when its dependencies change. It's not worth it for cheap calculations — the memoization bookkeeping itself has a cost, so wrapping trivial arithmetic in useMemo can make things slightly slower, not faster.",
    tags: ["hooks", "performance"],
  },
  {
    id: "react-6",
    category: "React",
    difficulty: "Intermediate",
    question: "What is prop drilling, and how can you avoid it?",
    answer:
      "Prop drilling is passing a prop through several intermediate components that don't use it themselves, just to reach a deeply nested child. Context, a state management library, or component composition (passing children instead of the value itself) are the common ways to avoid threading props through every layer.",
    tags: ["state", "context"],
  },
  {
    id: "react-7",
    category: "React",
    difficulty: "Advanced",
    question: "How do you prevent unnecessary re-renders in a React app?",
    answer:
      "Common tools: React.memo to skip re-rendering a component when its props haven't changed, useCallback to keep function props referentially stable, splitting state so unrelated components don't share a re-render trigger, and moving state as close as possible to where it's actually used.",
    tags: ["performance"],
  },
  {
    id: "react-8",
    category: "React",
    difficulty: "Beginner",
    question: "What is the difference between controlled and uncontrolled components?",
    answer:
      "A controlled input's value is driven entirely by React state, updated via onChange — React is the single source of truth. An uncontrolled input keeps its own internal DOM state, and you read its current value on demand via a ref instead of on every keystroke.",
    tags: ["forms"],
  },
  {
    id: "react-9",
    category: "React",
    difficulty: "Advanced",
    question: "What are React Server Components and how do they differ from SSR?",
    answer:
      "Traditional SSR renders the whole component tree to HTML on the server, then hydrates the same JS bundle on the client. Server Components render exclusively on the server and never ship their JS to the client at all — they can directly access backend resources, and only client components (marked 'use client') hydrate and become interactive in the browser.",
    tags: ["rsc", "nextjs"],
  },
  {
    id: "react-10",
    category: "React",
    difficulty: "Intermediate",
    question: "What is the purpose of the useReducer hook?",
    answer:
      "useReducer manages state through a pure reducer function (state, action) => newState, similar to Redux. It's preferable to useState when the next state depends on complex logic involving the previous state, or when several related pieces of state update together in response to the same actions.",
    tags: ["hooks", "state"],
  },
  {
    id: "react-11",
    category: "React",
    difficulty: "Beginner",
    question: "What are React fragments and why use them?",
    answer:
      "A Fragment (<>...</>) lets a component return multiple sibling elements without wrapping them in an extra DOM node like a div. It's useful when an unnecessary wrapper would break CSS layout (e.g. flex/grid) or produce invalid HTML nesting, like inside a table.",
    tags: ["jsx"],
  },
  {
    id: "react-12",
    category: "React",
    difficulty: "Advanced",
    question: "How does React batch state updates, and how did this change in React 18?",
    answer:
      "Batching groups multiple setState calls within the same event handler into a single re-render for efficiency. Before React 18, batching only happened inside React event handlers; async code like a setTimeout or fetch callback would trigger a separate render per update. React 18's automatic batching extends this behavior to all updates, regardless of where they originate.",
    tags: ["rendering", "react-18"],
  },
  {
    id: "react-13",
    category: "React",
    difficulty: "Intermediate",
    question: "What is the difference between useState's functional updater and passing a direct value?",
    answer:
      "Passing a direct value (setCount(count + 1)) uses whatever 'count' was captured in that render's closure. The functional form (setCount(prev => prev + 1)) receives the truly latest state at update time, which matters when multiple updates queue up in the same batch or inside async callbacks.",
    tags: ["hooks", "state"],
  },
  {
    id: "react-14",
    category: "React",
    difficulty: "Beginner",
    question: "What is JSX, and does the browser understand it directly?",
    answer:
      "JSX is a syntax extension that lets you write HTML-like markup inside JavaScript. Browsers can't run it directly — a compiler like Babel transforms each JSX element into a plain JavaScript function call (React.createElement or the newer jsx runtime) before it ships.",
    tags: ["jsx", "basics"],
  },
  {
    id: "react-15",
    category: "React",
    difficulty: "Advanced",
    question: "What are custom hooks, and what rule must every hook follow?",
    answer:
      "A custom hook is a plain function, prefixed with 'use', that composes existing hooks to share reusable stateful logic (like a useDebounce or useFetch). Every hook, custom or built-in, must be called unconditionally at the top level of a component or another hook — never inside loops, conditions, or nested functions — since React tracks hook state by call order.",
    tags: ["hooks"],
  },
  {
    id: "react-16",
    category: "React",
    difficulty: "Intermediate",
    question: "What is the significance of the dependency array in useEffect?",
    answer:
      "The dependency array tells React when to re-run the effect: it re-runs only when one of the listed values has changed since the last render. An empty array means 'run once after the first render'; omitting the array entirely means 'run after every render'.",
    tags: ["hooks", "useeffect"],
  },
  {
    id: "react-17",
    category: "React",
    difficulty: "Advanced",
    question: "What is hydration, and what causes a hydration mismatch error?",
    answer:
      "Hydration is the process of attaching React's event listeners and internal state to server-rendered HTML already sitting in the DOM, without re-creating the markup. A mismatch error happens when the HTML React expects to see (based on its render) differs from what the server actually sent — often caused by using browser-only APIs like window or Date.now() during the initial render.",
    tags: ["ssr", "hydration"],
  },
  {
    id: "react-18",
    category: "React",
    difficulty: "Beginner",
    question: "What is the difference between state and props?",
    answer:
      "Props are read-only inputs passed down from a parent component, and a component can't modify its own props. State is data a component manages internally, which it can update over time via a state setter, triggering a re-render.",
    tags: ["fundamentals"],
  },
  {
    id: "react-19",
    category: "React",
    difficulty: "Intermediate",
    question: "How do error boundaries work in React?",
    answer:
      "An error boundary is a class component implementing getDerivedStateFromError or componentDidCatch, which catches JavaScript errors thrown anywhere in its child tree during rendering and shows a fallback UI instead of crashing the whole app. They don't catch errors in event handlers, async code, or the boundary itself.",
    tags: ["error-handling"],
  },
  {
    id: "react-20",
    category: "React",
    difficulty: "Advanced",
    question: "What is React's Suspense used for?",
    answer:
      "Suspense lets a component 'pause' rendering while it waits on something async — like a lazily-loaded component or (with compatible data-fetching libraries) data still in flight — and shows a fallback UI in the meantime. It decouples the loading-state UI from the component itself, so a whole subtree can share one fallback.",
    tags: ["suspense", "async"],
  },

  // ---------------------------------------------------------------------
  // Node.js & Backend
  // ---------------------------------------------------------------------
  {
    id: "node-1",
    category: "Node.js & Backend",
    difficulty: "Beginner",
    question: "Why is Node.js described as single-threaded, yet able to handle concurrent requests?",
    answer:
      "Node runs your JavaScript on one main thread, but I/O operations (file reads, network calls, DB queries) are delegated to the OS or a worker pool (libuv) and don't block that thread. When the I/O completes, its callback is queued to run on the main thread — so Node handles many concurrent connections without needing a thread per connection.",
    tags: ["event-loop", "libuv"],
  },
  {
    id: "node-2",
    category: "Node.js & Backend",
    difficulty: "Intermediate",
    question: "What is middleware in an Express app?",
    answer:
      "Middleware are functions with access to the request, response, and a 'next' callback, executed in order for a matching route. Each one can inspect or modify the request/response, end the cycle by sending a response, or call next() to pass control to the following middleware — which is how logging, auth checks, and body parsing are typically layered.",
    tags: ["express"],
  },
  {
    id: "node-3",
    category: "Node.js & Backend",
    difficulty: "Advanced",
    question: "What is the difference between process.nextTick, setImmediate, and setTimeout(fn, 0)?",
    answer:
      "process.nextTick queues a callback to run immediately after the current operation, before the event loop continues to any phase — it has the highest priority. setImmediate runs in the 'check' phase, after I/O callbacks. setTimeout(fn, 0) runs in the timers phase, and its ordering relative to setImmediate can vary depending on whether it's called from the main module or inside an I/O callback.",
    tags: ["event-loop", "internals"],
  },
  {
    id: "node-4",
    category: "Node.js & Backend",
    difficulty: "Intermediate",
    question: "What are the differences between REST and GraphQL APIs?",
    answer:
      "REST exposes fixed endpoints, each returning a predetermined shape of data, which can lead to over-fetching or under-fetching. GraphQL exposes a single endpoint where the client specifies exactly which fields it needs in the query, reducing over-fetching, at the cost of more complex server-side query resolution and caching.",
    tags: ["api-design"],
    visual: {
      type: "compare",
      leftLabel: "REST",
      rightLabel: "GraphQL",
      rows: [
        ["Multiple fixed endpoints", "Single flexible endpoint"],
        ["Server decides response shape", "Client specifies exact fields"],
        ["Simple HTTP caching", "Requires custom caching layer"],
        ["Can over/under-fetch data", "Fetches precisely what's needed"],
      ],
    },
  },
  {
    id: "node-5",
    category: "Node.js & Backend",
    difficulty: "Advanced",
    question: "How would you handle authentication in a stateless API?",
    answer:
      "The common approach is token-based auth (like JWT): the server issues a signed token on login containing the user's identity and claims, the client sends it on each request (typically in an Authorization header), and the server verifies its signature without needing to store session state. Refresh tokens are used to renew short-lived access tokens without forcing re-login.",
    tags: ["auth", "jwt"],
  },
  {
    id: "node-6",
    category: "Node.js & Backend",
    difficulty: "Intermediate",
    question: "What is the purpose of environment variables in a backend app?",
    answer:
      "Environment variables externalize configuration (API keys, database URLs, feature flags) from the codebase, so the same code can run differently across development, staging, and production without a code change, and secrets never get committed to version control.",
    tags: ["configuration"],
  },
  {
    id: "node-7",
    category: "Node.js & Backend",
    difficulty: "Advanced",
    question: "What is rate limiting and why does an API need it?",
    answer:
      "Rate limiting caps how many requests a client can make in a given time window, protecting the service from abuse, accidental infinite loops in client code, and traffic spikes that could overwhelm shared resources like a database. Common strategies include token bucket and sliding window counters, often enforced at a gateway or middleware layer.",
    tags: ["scalability", "security"],
  },
  {
    id: "node-8",
    category: "Node.js & Backend",
    difficulty: "Intermediate",
    question: "What's the difference between a monolith and microservices architecture?",
    answer:
      "A monolith ships all functionality as one deployable unit sharing a codebase and typically one database, which is simpler to develop and deploy at small scale. Microservices split functionality into independently deployable services communicating over the network, which enables independent scaling and team ownership at the cost of operational complexity like service discovery and distributed data consistency.",
    tags: ["architecture"],
  },
  {
    id: "node-9",
    category: "Node.js & Backend",
    difficulty: "Advanced",
    question: "How does load balancing work, and what are common strategies?",
    answer:
      "A load balancer sits in front of multiple server instances and distributes incoming requests among them. Round robin cycles through servers in order; least connections routes to whichever server currently has the fewest active requests; and IP hash routes a given client consistently to the same server, useful when session data is kept in server memory.",
    tags: ["scalability"],
  },
  {
    id: "node-10",
    category: "Node.js & Backend",
    difficulty: "Beginner",
    question: "What is CORS and why does it exist?",
    answer:
      "CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks a web page from making requests to a different origin (domain, protocol, or port) unless that server explicitly allows it via response headers. It exists to prevent a malicious site from silently making authenticated requests to another site on a user's behalf.",
    tags: ["security", "http"],
  },
  {
    id: "node-11",
    category: "Node.js & Backend",
    difficulty: "Advanced",
    question: "What is a message queue, and when would you introduce one into a system?",
    answer:
      "A message queue (like RabbitMQ or SQS) lets services communicate asynchronously by publishing messages that a consumer processes independently, decoupling the producer from needing the consumer to be available immediately. It's introduced when a task is slow, unreliable, or bursty — like sending emails, processing uploads, or generating reports — so the main request path can respond quickly.",
    tags: ["architecture", "async"],
  },
  {
    id: "node-12",
    category: "Node.js & Backend",
    difficulty: "Intermediate",
    question: "What is idempotency, and why does it matter for API design?",
    answer:
      "An idempotent operation produces the same end result no matter how many times it's performed — calling it twice has the same effect as calling it once. It matters because network failures cause clients to retry requests; a payment or order-creation endpoint that isn't idempotent could double-charge a customer on a simple retry.",
    tags: ["api-design", "reliability"],
  },

  // ---------------------------------------------------------------------
  // Data Structures
  // ---------------------------------------------------------------------
  {
    id: "ds-1",
    category: "Data Structures",
    difficulty: "Beginner",
    question: "What is the difference between an array and a linked list?",
    answer:
      "An array stores elements in contiguous memory, giving O(1) random access by index but O(n) insertion/removal in the middle since later elements must shift. A linked list stores elements as nodes with pointers to the next node, giving O(1) insertion/removal once you have a reference to the spot, but only O(n) access since you must traverse from the head.",
    tags: ["arrays", "linked-lists"],
    visual: {
      type: "compare",
      leftLabel: "Array",
      rightLabel: "Linked List",
      rows: [
        ["Contiguous memory", "Scattered nodes with pointers"],
        ["O(1) random access", "O(n) access, must traverse"],
        ["O(n) insert/delete (shifting)", "O(1) insert/delete at a known node"],
        ["Fixed or resized in chunks", "Grows one node at a time"],
      ],
    },
  },
  {
    id: "ds-2",
    category: "Data Structures",
    difficulty: "Intermediate",
    question: "How does a hash table achieve average O(1) lookup?",
    answer:
      "A hash table applies a hash function to a key to compute an index into a backing array (a 'bucket'), so lookup, insert, and delete all jump directly to that bucket instead of scanning. Collisions (two keys hashing to the same bucket) are resolved via chaining (a small list per bucket) or open addressing, and a good hash function keeps buckets evenly distributed so most operations stay near O(1).",
    tags: ["hash-tables"],
  },
  {
    id: "ds-3",
    category: "Data Structures",
    difficulty: "Beginner",
    question: "What is the difference between a stack and a queue?",
    answer:
      "A stack is LIFO (last in, first out) — think of a stack of plates, where you add and remove from the top only. A queue is FIFO (first in, first out) — like a checkout line, where you add at the back and remove from the front.",
    tags: ["stacks", "queues"],
  },
  {
    id: "ds-4",
    category: "Data Structures",
    difficulty: "Advanced",
    question: "What is a balanced binary search tree, and why does balance matter?",
    answer:
      "A BST keeps left children smaller and right children larger than their parent, giving O(log n) search if the tree is balanced. Without balancing, inserting sorted data in order degrades the tree into a linked list, dropping performance to O(n). Structures like AVL trees and red-black trees automatically rebalance on insertion/deletion to guarantee O(log n) height.",
    tags: ["trees", "bst"],
    visual: {
      type: "tree",
      root: "8",
      children: [
        { label: "3", children: ["1", "6"] },
        { label: "10", children: ["9", "14"] },
      ],
    },
  },
  {
    id: "ds-5",
    category: "Data Structures",
    difficulty: "Intermediate",
    question: "What is a heap, and what is it commonly used for?",
    answer:
      "A heap is a tree-based structure satisfying the heap property — in a min-heap, every parent is smaller than its children, so the smallest element is always at the root. It's commonly used to implement priority queues, and underlies efficient algorithms like heapsort and Dijkstra's shortest path.",
    tags: ["heaps"],
  },
  {
    id: "ds-6",
    category: "Data Structures",
    difficulty: "Advanced",
    question: "What is a trie, and what problem does it solve better than a hash table?",
    answer:
      "A trie stores strings character by character along paths from the root, so words sharing a prefix share the same path. Unlike a hash table, it can efficiently answer 'what words start with this prefix', which is why it's the standard structure behind autocomplete and spell-check features.",
    tags: ["tries", "strings"],
  },
  {
    id: "ds-7",
    category: "Data Structures",
    difficulty: "Intermediate",
    question: "What is the difference between a graph and a tree?",
    answer:
      "A tree is a connected graph with no cycles and exactly one path between any two nodes, plus a designated root. A general graph can have cycles, multiple paths between nodes, and no required root — so every tree is a graph, but not every graph is a tree.",
    tags: ["graphs", "trees"],
  },
  {
    id: "ds-8",
    category: "Data Structures",
    difficulty: "Advanced",
    question: "How would you detect a cycle in a linked list?",
    answer:
      "Floyd's cycle detection ('tortoise and hare') uses two pointers moving through the list at different speeds — one step at a time and two steps at a time. If there's a cycle, the faster pointer will eventually lap the slower one and they'll meet at the same node; if the fast pointer reaches the end (null), there's no cycle.",
    tags: ["linked-lists", "algorithms"],
  },
  {
    id: "ds-9",
    category: "Data Structures",
    difficulty: "Beginner",
    question: "What is a doubly linked list, and how does it differ from a singly linked list?",
    answer:
      "A singly linked list's nodes only point forward to the next node, so traversal is one-directional. A doubly linked list's nodes also keep a pointer back to the previous node, allowing traversal in both directions and O(1) removal of a node once you have a reference to it, without needing to find its predecessor first.",
    tags: ["linked-lists"],
  },
  {
    id: "ds-10",
    category: "Data Structures",
    difficulty: "Intermediate",
    question: "What is a set, and how does it typically differ from a list in implementation?",
    answer:
      "A set is a collection of unique elements with no guaranteed order, typically backed by a hash table internally, giving average O(1) membership checks and insertion. A list allows duplicates and preserves insertion order, but checking whether an element is already present takes O(n) unless it's separately indexed.",
    tags: ["sets"],
  },
  {
    id: "ds-11",
    category: "Data Structures",
    difficulty: "Advanced",
    question: "What is a union-find (disjoint set) structure used for?",
    answer:
      "Union-find tracks a collection of elements partitioned into disjoint groups, supporting two operations efficiently: find (which group does this element belong to) and union (merge two groups). With path compression and union by rank, both operations run in near-constant amortized time, which is why it's the standard tool for Kruskal's minimum spanning tree algorithm and cycle detection in undirected graphs.",
    tags: ["union-find", "graphs"],
  },

  // ---------------------------------------------------------------------
  // Algorithms
  // ---------------------------------------------------------------------
  {
    id: "algo-1",
    category: "Algorithms",
    difficulty: "Beginner",
    question: "What is Big-O notation, and why do we use it?",
    answer:
      "Big-O describes how an algorithm's running time or memory use grows as the input size grows, focusing on the dominant term and ignoring constants — so we can compare algorithms independent of hardware or implementation details. O(1) is constant, O(log n) grows slowly, O(n) is linear, and O(n^2) grows much faster as n increases.",
    tags: ["complexity"],
    visual: {
      type: "complexity",
      rows: [
        { label: "O(1)", value: 1, note: "Constant — hash lookup" },
        { label: "O(log n)", value: 2, note: "Binary search" },
        { label: "O(n)", value: 4, note: "Single loop" },
        { label: "O(n log n)", value: 6, note: "Merge sort" },
        { label: "O(n²)", value: 9, note: "Nested loops / bubble sort" },
      ],
    },
  },
  {
    id: "algo-2",
    category: "Algorithms",
    difficulty: "Intermediate",
    question: "How does binary search work, and what does it require of the input?",
    answer:
      "Binary search repeatedly halves the search range: it compares the target to the middle element, then discards the half that can't contain it, continuing until the target is found or the range is empty. It requires the input to be sorted, since the 'discard half' logic only works when order lets you infer which side the target must be on.",
    tags: ["searching"],
  },
  {
    id: "algo-3",
    category: "Algorithms",
    difficulty: "Advanced",
    question: "Compare merge sort and quicksort.",
    answer:
      "Both are O(n log n) on average. Merge sort splits the array in half, recursively sorts each half, then merges — it's stable and guarantees O(n log n) even in the worst case, but needs O(n) extra space. Quicksort partitions around a pivot in place, giving better real-world constant factors and O(1) extra space, but its worst case degrades to O(n²) on already-sorted or adversarial input if the pivot is chosen poorly.",
    tags: ["sorting"],
    visual: {
      type: "compare",
      leftLabel: "Merge Sort",
      rightLabel: "Quicksort",
      rows: [
        ["O(n log n) worst case, guaranteed", "O(n²) worst case (rare, bad pivots)"],
        ["O(n) extra space", "O(log n) extra space (in-place)"],
        ["Stable", "Not stable by default"],
        ["Predictable performance", "Faster in practice on average"],
      ],
    },
  },
  {
    id: "algo-4",
    category: "Algorithms",
    difficulty: "Intermediate",
    question: "What is dynamic programming, and what two properties make a problem a good fit?",
    answer:
      "Dynamic programming solves a problem by breaking it into overlapping subproblems and storing (memoizing) their results to avoid recomputation. It applies well when a problem has optimal substructure (an optimal solution can be built from optimal solutions to subproblems) and overlapping subproblems (the same subproblem recurs many times, as in naive recursive Fibonacci).",
    tags: ["dynamic-programming"],
  },
  {
    id: "algo-5",
    category: "Algorithms",
    difficulty: "Beginner",
    question: "What is the difference between depth-first search (DFS) and breadth-first search (BFS)?",
    answer:
      "DFS explores as far as possible down one path before backtracking, typically implemented with recursion or an explicit stack. BFS explores all neighbors at the current depth before moving deeper, using a queue — which makes it the right choice when you need the shortest path in an unweighted graph, since it reaches nodes in order of distance from the start.",
    tags: ["graphs", "traversal"],
  },
  {
    id: "algo-6",
    category: "Algorithms",
    difficulty: "Advanced",
    question: "How does Dijkstra's algorithm find the shortest path, and what's its key limitation?",
    answer:
      "Dijkstra's repeatedly picks the unvisited node with the smallest known distance from the start (typically via a min-heap), then relaxes its neighbors' distances. Its key limitation is that it doesn't work correctly with negative edge weights, since it assumes once a node's shortest distance is finalized, it can never be improved by a longer path.",
    tags: ["graphs", "shortest-path"],
  },
  {
    id: "algo-7",
    category: "Algorithms",
    difficulty: "Intermediate",
    question: "What is the two-pointer technique, and what kind of problems does it suit?",
    answer:
      "Two-pointer uses two indices moving through a data structure (often from opposite ends, or one ahead of the other) instead of nested loops. It suits problems like finding a pair in a sorted array summing to a target, reversing an array in place, or detecting palindromes — turning an O(n²) brute force into O(n).",
    tags: ["arrays", "technique"],
  },
  {
    id: "algo-8",
    category: "Algorithms",
    difficulty: "Advanced",
    question: "What is a greedy algorithm, and when does the greedy approach fail?",
    answer:
      "A greedy algorithm makes the locally optimal choice at each step, hoping it leads to a globally optimal solution. It works for problems with the 'greedy choice property' (like coin change with standard denominations, or activity selection), but fails on problems where an early good-looking choice can block a better overall solution — like coin change with arbitrary denominations, where dynamic programming is needed instead.",
    tags: ["greedy"],
  },
  {
    id: "algo-9",
    category: "Algorithms",
    difficulty: "Intermediate",
    question: "What is memoization, and how does it differ from tabulation?",
    answer:
      "Memoization is top-down: you write the natural recursive solution and cache results as they're computed, looking them up before recomputing. Tabulation is bottom-up: you iteratively fill a table starting from the smallest subproblems up to the final answer, avoiding recursion overhead but requiring you to figure out the right fill order upfront.",
    tags: ["dynamic-programming"],
  },
  {
    id: "algo-10",
    category: "Algorithms",
    difficulty: "Advanced",
    question: "How would you find the k-th largest element in an unsorted array efficiently?",
    answer:
      "Sorting gives O(n log n), but a min-heap of size k gives O(n log k): push each element, popping the smallest whenever the heap exceeds size k, so the root ends up being the k-th largest. The Quickselect algorithm (a partition-based variant of quicksort) does even better on average, at O(n), though its worst case is O(n²) like quicksort.",
    tags: ["selection", "heaps"],
  },

  // ---------------------------------------------------------------------
  // System Design
  // ---------------------------------------------------------------------
  {
    id: "sd-1",
    category: "System Design",
    difficulty: "Intermediate",
    question: "What is the CAP theorem?",
    answer:
      "CAP theorem states that a distributed data store can only guarantee two of three properties during a network partition: Consistency (every read sees the latest write), Availability (every request gets a response), and Partition tolerance (the system keeps working despite network splits). Since partitions are unavoidable in real distributed systems, the practical tradeoff is really between consistency and availability when one occurs.",
    tags: ["distributed-systems"],
  },
  {
    id: "sd-2",
    category: "System Design",
    difficulty: "Advanced",
    question: "How would you design a URL shortener?",
    answer:
      "Core pieces: an endpoint that takes a long URL and generates a short unique key (via a counter encoded in base62, or a hash with collision handling), a fast key-value store mapping short keys to long URLs, and a redirect endpoint doing a lookup and returning a 301/302. At scale, you'd add caching for hot links, database sharding by key, and analytics tracked asynchronously so it doesn't slow down the redirect path.",
    tags: ["design", "scalability"],
    visual: {
      type: "flow",
      steps: [
        "Client submits a long URL",
        "Server generates a unique short key",
        "Mapping stored in a key-value store",
        "Client later requests the short URL",
        "Server looks up and redirects to the original",
      ],
    },
  },
  {
    id: "sd-3",
    category: "System Design",
    difficulty: "Intermediate",
    question: "What is the difference between horizontal and vertical scaling?",
    answer:
      "Vertical scaling adds more power (CPU, RAM) to a single existing machine — simple, but has a hard ceiling and a single point of failure. Horizontal scaling adds more machines and distributes load across them — it scales further and improves fault tolerance, but requires the application to handle state carefully (e.g. via load balancers and shared or replicated data stores) since requests can land on any instance.",
    tags: ["scalability"],
  },
  {
    id: "sd-4",
    category: "System Design",
    difficulty: "Advanced",
    question: "How does a Content Delivery Network (CDN) improve performance?",
    answer:
      "A CDN caches static content on servers ('edge nodes') distributed geographically close to users, so requests are served from a nearby location instead of the origin server, cutting latency. It also absorbs traffic spikes and reduces load on the origin, since most repeat requests for the same asset never reach it at all.",
    tags: ["caching", "networking"],
  },
  {
    id: "sd-5",
    category: "System Design",
    difficulty: "Intermediate",
    question: "What is database sharding?",
    answer:
      "Sharding splits a large database into smaller, independent pieces ('shards'), each holding a subset of the data — commonly partitioned by a key like user ID range or hash. It lets a system scale writes horizontally past what a single database instance can handle, at the cost of added complexity for queries that need to span multiple shards.",
    tags: ["databases", "scalability"],
  },
  {
    id: "sd-6",
    category: "System Design",
    difficulty: "Advanced",
    question: "How would you design a rate limiter for a public API?",
    answer:
      "A common approach is the token bucket: each client has a bucket that refills at a fixed rate, and each request consumes a token, being rejected if the bucket is empty. It's implemented in a shared store like Redis so limits apply consistently across multiple API server instances, with each check done atomically to avoid race conditions under concurrent requests.",
    tags: ["design", "reliability"],
  },
  {
    id: "sd-7",
    category: "System Design",
    difficulty: "Intermediate",
    question: "What's the difference between synchronous and asynchronous communication between services?",
    answer:
      "Synchronous (e.g. a direct HTTP call) means the caller waits for the response before continuing, which is simple but couples the caller's availability to the callee's uptime and latency. Asynchronous (e.g. via a message queue) lets the caller move on immediately, improving resilience to a slow or temporarily-down downstream service, at the cost of needing to design for eventual, not immediate, consistency.",
    tags: ["architecture"],
  },
  {
    id: "sd-8",
    category: "System Design",
    difficulty: "Advanced",
    question: "How would you design a notification system that supports email, SMS, and push?",
    answer:
      "A common shape: services publish a notification event to a queue rather than sending directly, a set of workers consume the queue and route each event to the right channel-specific provider, and a template/preferences service resolves what content and channel the user actually wants. This decouples the triggering event from delivery, lets you retry failed sends independently, and makes it easy to add a new channel later without touching the producers.",
    tags: ["design", "messaging"],
  },
  {
    id: "sd-9",
    category: "System Design",
    difficulty: "Intermediate",
    question: "What is eventual consistency?",
    answer:
      "Eventual consistency means that if no new updates are made, all replicas of a piece of data will converge to the same value over time — but a read immediately after a write might briefly return stale data. It's a common tradeoff in distributed systems that prioritize availability and partition tolerance over immediate consistency.",
    tags: ["distributed-systems"],
  },
  {
    id: "sd-10",
    category: "System Design",
    difficulty: "Advanced",
    question: "What is a circuit breaker pattern, and why is it used in microservices?",
    answer:
      "A circuit breaker monitors calls to a downstream service and, after enough consecutive failures, 'trips open' and starts failing fast locally instead of continuing to call the struggling service — giving it time to recover and preventing cascading failures across the system. After a cooldown, it lets a trial request through to check if the service has recovered before fully closing again.",
    tags: ["resilience", "microservices"],
  },

  // ---------------------------------------------------------------------
  // Databases & SQL
  // ---------------------------------------------------------------------
  {
    id: "sql-1",
    category: "Databases & SQL",
    difficulty: "Beginner",
    question: "What is the difference between SQL and NoSQL databases?",
    answer:
      "SQL databases store data in structured tables with a fixed schema and relationships enforced through foreign keys, and they support powerful joins and ACID transactions. NoSQL databases (document, key-value, column, graph) offer flexible or schema-less structures and typically scale horizontally more easily, trading off some consistency or query flexibility for that scalability.",
    tags: ["databases"],
    visual: {
      type: "compare",
      leftLabel: "SQL",
      rightLabel: "NoSQL",
      rows: [
        ["Fixed schema", "Flexible / schema-less"],
        ["Relational, supports joins", "Often denormalized"],
        ["Vertical scaling is typical", "Built for horizontal scaling"],
        ["Strong ACID guarantees", "Often eventual consistency"],
      ],
    },
  },
  {
    id: "sql-2",
    category: "Databases & SQL",
    difficulty: "Intermediate",
    question: "What is database normalization, and what problem does it solve?",
    answer:
      "Normalization organizes tables to reduce data redundancy and prevent update anomalies, by splitting data into related tables connected via foreign keys instead of repeating it everywhere. Each normal form (1NF, 2NF, 3NF...) adds a stricter rule, such as eliminating repeating groups or removing columns that depend only on part of a composite key.",
    tags: ["schema-design"],
  },
  {
    id: "sql-3",
    category: "Databases & SQL",
    difficulty: "Advanced",
    question: "What are ACID properties in a database transaction?",
    answer:
      "Atomicity means a transaction either fully completes or fully rolls back, with no partial effect. Consistency means it moves the database from one valid state to another, respecting all constraints. Isolation means concurrent transactions don't interfere with each other's intermediate state. Durability means once committed, the change survives even a crash immediately after.",
    tags: ["transactions"],
  },
  {
    id: "sql-4",
    category: "Databases & SQL",
    difficulty: "Intermediate",
    question: "What's the difference between an INNER JOIN and a LEFT JOIN?",
    answer:
      "An INNER JOIN returns only rows that have a matching row in both tables. A LEFT JOIN returns every row from the left table regardless of a match, filling in NULLs for the right table's columns when no match exists — useful when you want to keep all records from one side, like all customers even those with zero orders.",
    tags: ["joins"],
  },
  {
    id: "sql-5",
    category: "Databases & SQL",
    difficulty: "Advanced",
    question: "What is an index, and what's the tradeoff of adding one?",
    answer:
      "An index is a separate data structure (commonly a B-tree) that lets the database find rows matching a condition without scanning the entire table, dramatically speeding up reads on the indexed column. The tradeoff is that every insert, update, or delete must also update the index, so write performance and storage cost increase with each additional index.",
    tags: ["indexing", "performance"],
  },
  {
    id: "sql-6",
    category: "Databases & SQL",
    difficulty: "Intermediate",
    question: "What is a primary key versus a foreign key?",
    answer:
      "A primary key uniquely identifies each row in its own table and cannot be NULL or duplicated. A foreign key is a column in one table that references a primary key in another table, enforcing referential integrity — e.g. an order row's customer_id must correspond to an actual row in the customers table.",
    tags: ["keys", "schema-design"],
  },
  {
    id: "sql-7",
    category: "Databases & SQL",
    difficulty: "Advanced",
    question: "What causes a deadlock in a database, and how is it typically resolved?",
    answer:
      "A deadlock occurs when two transactions each hold a lock the other needs, so both wait indefinitely — for example, transaction A locks row 1 then waits for row 2, while transaction B locks row 2 then waits for row 1. Databases typically detect this via a wait-for graph and resolve it by aborting one transaction (the 'victim'), letting the other proceed.",
    tags: ["transactions", "locking"],
  },
  {
    id: "sql-8",
    category: "Databases & SQL",
    difficulty: "Beginner",
    question: "What is the difference between DELETE, TRUNCATE, and DROP?",
    answer:
      "DELETE removes rows matching a condition (or all rows) one at a time, is logged, and can be rolled back within a transaction. TRUNCATE removes all rows at once, is minimally logged, and is faster but usually can't be rolled back and resets identity counters. DROP removes the entire table structure itself, not just its data.",
    tags: ["sql-syntax"],
  },
  {
    id: "sql-9",
    category: "Databases & SQL",
    difficulty: "Intermediate",
    question: "What is a database view, and why would you use one?",
    answer:
      "A view is a saved SQL query that behaves like a virtual table — querying it re-runs the underlying query. Views are useful for simplifying repeated complex joins, restricting which columns/rows certain users can see, and providing a stable interface even if the underlying table structure changes.",
    tags: ["views"],
  },
  {
    id: "sql-10",
    category: "Databases & SQL",
    difficulty: "Advanced",
    question: "What's the difference between optimistic and pessimistic locking?",
    answer:
      "Pessimistic locking acquires a lock on a row before reading it for update, blocking other transactions from touching it until released — safe, but reduces concurrency. Optimistic locking assumes conflicts are rare: it reads without locking, then checks (typically via a version number) whether the row changed before committing, retrying if a conflict is detected — better throughput when contention is low.",
    tags: ["concurrency", "locking"],
  },

  // ---------------------------------------------------------------------
  // OOP & Design Patterns
  // ---------------------------------------------------------------------
  {
    id: "oop-1",
    category: "OOP & Design Patterns",
    difficulty: "Beginner",
    question: "What are the four pillars of object-oriented programming?",
    answer:
      "Encapsulation bundles data and the methods that operate on it, hiding internal state behind a controlled interface. Abstraction exposes only relevant behavior while hiding implementation detail. Inheritance lets a class reuse and extend another class's behavior. Polymorphism lets different classes be used interchangeably through a shared interface, with each providing its own specific behavior.",
    tags: ["fundamentals"],
  },
  {
    id: "oop-2",
    category: "OOP & Design Patterns",
    difficulty: "Intermediate",
    question: "What is the difference between an abstract class and an interface?",
    answer:
      "An abstract class can provide shared implementation for some methods while leaving others abstract, and a class can only extend one abstract class. An interface (in most languages) only defines a contract of method signatures with no implementation, and a class can implement multiple interfaces — useful when unrelated classes need to guarantee the same capability.",
    tags: ["abstraction"],
  },
  {
    id: "oop-3",
    category: "OOP & Design Patterns",
    difficulty: "Advanced",
    question: "What is the Singleton pattern, and what's a common criticism of it?",
    answer:
      "Singleton ensures a class has exactly one instance, globally accessible through a single access point — often used for shared resources like a configuration object or connection pool. A common criticism is that it acts as global mutable state, making unit testing harder (since tests can leak state between each other) and hiding a class's true dependencies.",
    tags: ["patterns", "singleton"],
  },
  {
    id: "oop-4",
    category: "OOP & Design Patterns",
    difficulty: "Intermediate",
    question: "What is the Observer pattern, and where have you likely seen it before?",
    answer:
      "In the Observer pattern, a 'subject' maintains a list of dependents ('observers') and notifies them automatically when its state changes, without needing to know their specific details. It's the pattern behind DOM event listeners, and behind reactive state libraries where subscribers re-run when the observed value changes.",
    tags: ["patterns", "observer"],
  },
  {
    id: "oop-5",
    category: "OOP & Design Patterns",
    difficulty: "Advanced",
    question: "What does the SOLID acronym stand for?",
    answer:
      "Single Responsibility (a class should have one reason to change), Open/Closed (open for extension, closed for modification), Liskov Substitution (subclasses should be usable wherever their base class is expected without breaking behavior), Interface Segregation (prefer many small specific interfaces over one large general one), and Dependency Inversion (depend on abstractions, not concrete implementations).",
    tags: ["principles", "solid"],
  },
  {
    id: "oop-6",
    category: "OOP & Design Patterns",
    difficulty: "Intermediate",
    question: "What is the difference between composition and inheritance?",
    answer:
      "Inheritance models an 'is-a' relationship, reusing behavior by extending a base class — but it tightly couples subclass to superclass and can become fragile as hierarchies deepen. Composition models a 'has-a' relationship, building a class out of smaller reusable objects it delegates to — generally more flexible, which is why 'favor composition over inheritance' is a common design guideline.",
    tags: ["principles"],
  },
  {
    id: "oop-7",
    category: "OOP & Design Patterns",
    difficulty: "Advanced",
    question: "What is the Factory pattern, and why use it instead of calling 'new' directly?",
    answer:
      "A Factory centralizes object creation logic behind a method or class, so calling code asks for 'a shape' rather than deciding directly which concrete class to instantiate. It's useful when creation involves choosing between several related classes based on input, or when you want to swap implementations later without touching every call site that creates the object.",
    tags: ["patterns", "factory"],
  },
  {
    id: "oop-8",
    category: "OOP & Design Patterns",
    difficulty: "Beginner",
    question: "What is method overloading versus method overriding?",
    answer:
      "Overloading defines multiple methods with the same name but different parameter signatures within the same class, resolved at compile time based on the arguments passed. Overriding provides a new implementation of a method already defined in a superclass, resolved at runtime based on the actual object's type.",
    tags: ["polymorphism"],
  },

  // ---------------------------------------------------------------------
  // CS Fundamentals
  // ---------------------------------------------------------------------
  {
    id: "cs-1",
    category: "CS Fundamentals",
    difficulty: "Intermediate",
    question: "What is the difference between a process and a thread?",
    answer:
      "A process is an independent program in execution with its own isolated memory space, so a crash in one process doesn't directly affect another. A thread is a unit of execution within a process, sharing that process's memory with other threads in it — which makes inter-thread communication cheaper but also introduces the risk of race conditions on shared data.",
    tags: ["operating-systems"],
  },
  {
    id: "cs-2",
    category: "CS Fundamentals",
    difficulty: "Advanced",
    question: "What is a deadlock, and what four conditions must all hold for one to occur?",
    answer:
      "A deadlock is a state where a set of processes are each waiting on a resource held by another in the set, so none can proceed. It requires all four: mutual exclusion (resources can't be shared), hold and wait (a process holds one resource while waiting for another), no preemption (resources can't be forcibly taken away), and circular wait (a cycle of processes each waiting on the next).",
    tags: ["operating-systems", "concurrency"],
  },
  {
    id: "cs-3",
    category: "CS Fundamentals",
    difficulty: "Intermediate",
    question: "What happens when you type a URL into a browser and press enter?",
    answer:
      "The browser first resolves the domain to an IP via DNS, opens a TCP connection (with a TLS handshake if HTTPS), then sends an HTTP request. The server processes it and sends back a response, which the browser parses — fetching any additional resources like CSS/JS/images — before building the DOM/CSSOM and finally painting the page.",
    tags: ["networking", "http"],
    visual: {
      type: "flow",
      steps: [
        "DNS resolves the domain to an IP address",
        "Browser opens a TCP connection (+ TLS handshake)",
        "Browser sends the HTTP request",
        "Server processes it and returns a response",
        "Browser parses HTML/CSS/JS and renders the page",
      ],
    },
  },
  {
    id: "cs-4",
    category: "CS Fundamentals",
    difficulty: "Beginner",
    question: "What is the difference between TCP and UDP?",
    answer:
      "TCP is connection-oriented and guarantees ordered, reliable delivery via acknowledgments and retransmission, at the cost of extra overhead and latency. UDP is connectionless with no delivery guarantee or ordering, but has much lower overhead — which is why it's preferred for use cases like video calls or gaming where a few dropped packets matter less than speed.",
    tags: ["networking"],
  },
  {
    id: "cs-5",
    category: "CS Fundamentals",
    difficulty: "Advanced",
    question: "What is virtual memory, and what problem does it solve?",
    answer:
      "Virtual memory gives each process its own private address space that the OS maps to physical memory (and disk, when needed) behind the scenes. It solves two problems at once: it isolates processes from directly accessing each other's memory, and it lets the total memory used by all programs exceed the physical RAM available, by paging less-used memory out to disk.",
    tags: ["operating-systems", "memory"],
  },
  {
    id: "cs-6",
    category: "CS Fundamentals",
    difficulty: "Intermediate",
    question: "What is the difference between HTTP and HTTPS?",
    answer:
      "HTTPS is HTTP layered on top of TLS encryption, so data exchanged between client and server is encrypted in transit and the server's identity is verified via a certificate. Plain HTTP sends everything, including credentials, in readable plaintext that any intermediary on the network path could inspect or tamper with.",
    tags: ["networking", "security"],
  },
  {
    id: "cs-7",
    category: "CS Fundamentals",
    difficulty: "Advanced",
    question: "What is a race condition, and how can you prevent one?",
    answer:
      "A race condition occurs when the correctness of a program depends on the relative timing of concurrent operations accessing shared data, producing inconsistent results depending on execution order. It's prevented with synchronization primitives like mutexes/locks (only one thread accesses the critical section at a time), atomic operations, or by avoiding shared mutable state entirely.",
    tags: ["concurrency"],
  },
  {
    id: "cs-8",
    category: "CS Fundamentals",
    difficulty: "Beginner",
    question: "What is the difference between compiled and interpreted languages?",
    answer:
      "A compiled language (like C++) is translated entirely into machine code ahead of time, producing an executable that runs directly on hardware, usually giving faster execution. An interpreted language (like Python) is read and executed line by line by an interpreter at runtime, trading some speed for portability and a faster development feedback loop. Many modern languages, including JavaScript, blur the line with just-in-time (JIT) compilation.",
    tags: ["languages"],
  },

  // ---------------------------------------------------------------------
  // Python
  // ---------------------------------------------------------------------
  {
    id: "py-1",
    category: "Python",
    difficulty: "Beginner",
    question: "What is the difference between a list and a tuple in Python?",
    answer:
      "A list is mutable — you can add, remove, or change elements after creation. A tuple is immutable — once created, its contents can't change, which makes it hashable (usable as a dict key) and slightly more memory-efficient.",
    tags: ["basics"],
  },
  {
    id: "py-2",
    category: "Python",
    difficulty: "Advanced",
    question: "What is the Global Interpreter Lock (GIL), and what does it mean for multithreading?",
    answer:
      "The GIL is a mutex in CPython ensuring only one thread executes Python bytecode at a time, even on a multi-core machine. This means CPU-bound multithreaded Python code doesn't get true parallel speedup, though I/O-bound code still benefits from threading since the GIL is released during I/O waits. For CPU-bound parallelism, multiprocessing (separate processes, each with its own interpreter) is the common workaround.",
    tags: ["concurrency", "internals"],
  },
  {
    id: "py-3",
    category: "Python",
    difficulty: "Intermediate",
    question: "What are Python decorators?",
    answer:
      "A decorator is a function that takes another function and extends its behavior without modifying its source code, typically by wrapping it. They're used with the @decorator syntax for cross-cutting concerns like logging, timing, caching, or access control that apply across many functions.",
    tags: ["decorators"],
  },
  {
    id: "py-4",
    category: "Python",
    difficulty: "Intermediate",
    question: "What is a list comprehension, and why prefer it over a manual loop?",
    answer:
      "A list comprehension builds a new list in a single readable expression, like [x * 2 for x in nums if x > 0], instead of an explicit loop with append calls. Beyond conciseness, it's typically faster than an equivalent manual loop since the iteration happens in optimized C code internally.",
    tags: ["syntax"],
  },
  {
    id: "py-5",
    category: "Python",
    difficulty: "Advanced",
    question: "What's the difference between *args and **kwargs?",
    answer:
      "*args collects any extra positional arguments into a tuple, letting a function accept a variable number of them. **kwargs collects extra keyword arguments into a dictionary, letting a function accept arbitrary named parameters — commonly used to pass arguments through to another function without restating each one.",
    tags: ["functions"],
  },
  {
    id: "py-6",
    category: "Python",
    difficulty: "Beginner",
    question: "What is the difference between is and == in Python?",
    answer:
      "== checks whether two objects have equal values, using each type's __eq__ method. is checks whether two variables refer to the exact same object in memory (identity), which is why comparing to None conventionally uses 'is None' rather than '== None'.",
    tags: ["operators"],
  },
  {
    id: "py-7",
    category: "Python",
    difficulty: "Intermediate",
    question: "What is a generator, and how does it differ from a normal function returning a list?",
    answer:
      "A generator function uses yield to produce values one at a time, pausing its state between each call instead of computing everything upfront. Unlike a function that returns a full list, a generator uses constant memory regardless of how many values it eventually produces, which matters when processing very large or infinite sequences.",
    tags: ["generators"],
  },
  {
    id: "py-8",
    category: "Python",
    difficulty: "Advanced",
    question: "What is duck typing, and how does Python embrace it?",
    answer:
      "Duck typing means an object's suitability is determined by whether it has the methods/behavior you need, not by its explicit type ('if it walks like a duck and quacks like a duck...'). Python embraces this by not requiring explicit interfaces — any object with a compatible __len__, __iter__, etc. works wherever that behavior is expected, without formal type declarations.",
    tags: ["typing"],
  },

  // ---------------------------------------------------------------------
  // Git & DevOps
  // ---------------------------------------------------------------------
  {
    id: "git-1",
    category: "Git & DevOps",
    difficulty: "Beginner",
    question: "What is the difference between git merge and git rebase?",
    answer:
      "git merge combines two branches by creating a new merge commit that ties both histories together, preserving exactly what happened. git rebase replays your branch's commits on top of another branch's latest state, producing a linear history without a merge commit, but it rewrites commit hashes, which is risky on a branch others are already working from.",
    tags: ["git"],
  },
  {
    id: "git-2",
    category: "Git & DevOps",
    difficulty: "Intermediate",
    question: "What is a CI/CD pipeline?",
    answer:
      "Continuous Integration automatically builds and tests code every time it's pushed, catching integration problems early instead of at release time. Continuous Delivery/Deployment extends that by automatically packaging (and optionally deploying) a build that passes all checks, so shipping a change becomes a routine, low-risk, repeatable process rather than a manual event.",
    tags: ["ci-cd"],
    visual: {
      type: "flow",
      steps: [
        "Developer pushes code",
        "CI server runs the build and test suite",
        "Passing build is packaged as an artifact",
        "Artifact is deployed to staging",
        "Approved change is promoted to production",
      ],
    },
  },
  {
    id: "git-3",
    category: "Git & DevOps",
    difficulty: "Advanced",
    question: "What is the difference between git reset, git revert, and git checkout?",
    answer:
      "git reset moves the current branch pointer to a different commit, optionally altering the working directory/staging area — it rewrites history and shouldn't be used on already-shared commits. git revert creates a new commit that undoes the changes of a previous commit, preserving history, which makes it safe on shared branches. git checkout switches branches or restores files to a previous state without altering commit history itself.",
    tags: ["git"],
  },
  {
    id: "git-4",
    category: "Git & DevOps",
    difficulty: "Intermediate",
    question: "What is containerization, and how does Docker achieve isolation without a full VM?",
    answer:
      "A container packages an application with its dependencies into a portable unit that runs consistently across environments. Unlike a VM, which virtualizes an entire hardware stack and runs a full guest OS, Docker containers share the host's kernel but use OS-level isolation features (namespaces for isolation, cgroups for resource limits) — making them much lighter weight and faster to start.",
    tags: ["docker", "containers"],
  },
  {
    id: "git-5",
    category: "Git & DevOps",
    difficulty: "Beginner",
    question: "What does 'git stash' do?",
    answer:
      "git stash temporarily shelves your uncommitted changes, reverting the working directory to match the last commit, so you can switch branches or pull cleanly. Later, git stash pop reapplies those saved changes on top of whatever branch you're currently on.",
    tags: ["git"],
  },
  {
    id: "git-6",
    category: "Git & DevOps",
    difficulty: "Advanced",
    question: "What is infrastructure as code, and what problem does it solve?",
    answer:
      "Infrastructure as code (tools like Terraform) defines servers, networks, and other infrastructure in version-controlled configuration files instead of manual clicking through a cloud console. It solves the 'works on my environment' problem for infrastructure itself — environments become reproducible, reviewable in pull requests, and recoverable by re-applying the same config after a disaster.",
    tags: ["iac", "terraform"],
  },

  // ---------------------------------------------------------------------
  // Testing
  // ---------------------------------------------------------------------
  {
    id: "test-1",
    category: "Testing",
    difficulty: "Beginner",
    question: "What is the difference between unit, integration, and end-to-end tests?",
    answer:
      "A unit test checks a single function or component in isolation, usually with dependencies mocked. An integration test checks that multiple units work correctly together, like a service talking to a real (or in-memory) database. An end-to-end test drives the full application the way a real user would, through the actual UI or API surface.",
    tags: ["fundamentals"],
    visual: {
      type: "compare",
      leftLabel: "Unit / Integration",
      rightLabel: "End-to-End",
      rows: [
        ["Fast, run in milliseconds", "Slower, runs the full stack"],
        ["Isolated, dependencies mocked", "Real dependencies, real flows"],
        ["Cheap to write many of", "Expensive, kept fewer in number"],
        ["Pinpoints exact failure", "Confirms the whole system works"],
      ],
    },
  },
  {
    id: "test-2",
    category: "Testing",
    difficulty: "Intermediate",
    question: "What is test-driven development (TDD)?",
    answer:
      "TDD follows a red-green-refactor cycle: write a failing test for behavior that doesn't exist yet, write the minimum code to make it pass, then refactor while keeping the test green. Proponents say it produces better-designed, more testable code by construction and leaves behind a safety-net test suite as a byproduct of the process itself.",
    tags: ["tdd"],
  },
  {
    id: "test-3",
    category: "Testing",
    difficulty: "Advanced",
    question: "What is the difference between a mock, a stub, and a spy?",
    answer:
      "A stub returns canned responses to calls made during a test, with no expectations about how it's used. A mock is pre-programmed with expectations about which calls should happen and can fail the test if they don't. A spy wraps a real implementation while recording how it was called, letting you assert on usage without replacing the underlying behavior.",
    tags: ["test-doubles"],
  },
  {
    id: "test-4",
    category: "Testing",
    difficulty: "Intermediate",
    question: "What makes a test 'flaky', and how would you address it?",
    answer:
      "A flaky test passes and fails intermittently without any code change, usually due to timing issues (a race with an async operation), shared/leftover state between tests, or reliance on external systems like real network calls. Fixes include waiting for explicit conditions instead of fixed timeouts, isolating test state, and mocking external dependencies.",
    tags: ["reliability"],
  },

  // ---------------------------------------------------------------------
  // HTML & CSS
  // ---------------------------------------------------------------------
  {
    id: "css-1",
    category: "HTML & CSS",
    difficulty: "Beginner",
    question: "What is the CSS box model?",
    answer:
      "Every element is rendered as a box made of, from inside out: content, padding, border, and margin. box-sizing: content-box (the default) means width/height apply only to the content area, while box-sizing: border-box makes width/height include padding and border, which is usually what developers actually expect.",
    tags: ["css-basics"],
  },
  {
    id: "css-2",
    category: "HTML & CSS",
    difficulty: "Intermediate",
    question: "What is the difference between Flexbox and CSS Grid?",
    answer:
      "Flexbox is one-dimensional — it lays out items along a single row or column, distributing space based on content size, which suits things like navbars and button groups. Grid is two-dimensional — it lets you define both rows and columns explicitly at once, which suits full page layouts where items need to align across both axes.",
    tags: ["layout"],
  },
  {
    id: "css-3",
    category: "HTML & CSS",
    difficulty: "Advanced",
    question: "How does CSS specificity determine which rule wins?",
    answer:
      "Specificity is calculated as a tuple of (inline styles, ID selectors, class/attribute/pseudo-class selectors, element/pseudo-element selectors), compared left to right. A single ID selector beats any number of class selectors, and any number of class selectors beats any number of element selectors — with !important overriding normal specificity entirely, which is why it's generally discouraged.",
    tags: ["css", "specificity"],
  },
  {
    id: "css-4",
    category: "HTML & CSS",
    difficulty: "Beginner",
    question: "What is the difference between semantic and non-semantic HTML elements?",
    answer:
      "Semantic elements (nav, article, header, footer) describe the meaning of their content, helping browsers, assistive technology, and search engines understand page structure. Non-semantic elements (div, span) carry no inherent meaning and exist purely for styling or grouping hooks.",
    tags: ["html", "accessibility"],
  },
  {
    id: "css-5",
    category: "HTML & CSS",
    difficulty: "Intermediate",
    question: "What causes layout reflow, and why is it expensive?",
    answer:
      "Reflow (layout recalculation) is triggered when something changes that affects element geometry — resizing, adding/removing DOM nodes, or reading certain layout properties like offsetHeight right after a style change. It's expensive because the browser must recompute the position and size of affected elements (and often their neighbors), potentially followed by a full repaint, so batching DOM reads and writes separately avoids forcing repeated reflows.",
    tags: ["performance", "rendering"],
  },

  // ---------------------------------------------------------------------
  // Behavioral & HR
  // ---------------------------------------------------------------------
  {
    id: "hr-1",
    category: "Behavioral & HR",
    difficulty: "Beginner",
    question: "Tell me about a time you disagreed with a teammate. How did you handle it?",
    answer:
      "Strong answers use the STAR structure (Situation, Task, Action, Result) and focus on how you engaged with the disagreement productively — asking questions to understand their reasoning, presenting your own view with evidence rather than opinion, and reaching a resolution or agreeing to disagree respectfully. Avoid framing it as 'I was right and they were wrong'; interviewers are listening for collaboration skill, not who won the argument.",
    tags: ["star-method", "communication"],
  },
  {
    id: "hr-2",
    category: "Behavioral & HR",
    difficulty: "Intermediate",
    question: "Describe a project that failed or didn't go as planned. What did you learn?",
    answer:
      "Pick a real failure with genuine stakes, own your part in it honestly rather than deflecting blame, and spend most of the answer on the specific, concrete lesson and how you applied it afterward. A good answer shows self-awareness and growth, not just a story with a sad ending.",
    tags: ["star-method", "growth"],
  },
  {
    id: "hr-3",
    category: "Behavioral & HR",
    difficulty: "Beginner",
    question: "Why do you want to work here?",
    answer:
      "Avoid generic answers about the company being 'innovative' or 'a great culture'. Reference something specific — a product you've used, a technical challenge the team is known for, or a value that genuinely maps to how you like to work — and connect it to what you'd bring, not just what you'd get.",
    tags: ["motivation"],
  },
  {
    id: "hr-4",
    category: "Behavioral & HR",
    difficulty: "Intermediate",
    question: "How do you prioritize tasks when everything feels urgent?",
    answer:
      "Good answers describe an actual method — like weighing impact versus effort, checking in with stakeholders on true deadlines versus assumed ones, and communicating tradeoffs early rather than silently doing everything at 80%. Concrete examples of a time you actually made this call land better than describing prioritization in the abstract.",
    tags: ["prioritization"],
  },
  {
    id: "hr-5",
    category: "Behavioral & HR",
    difficulty: "Advanced",
    question: "Tell me about a time you had to convince others to adopt your technical approach.",
    answer:
      "Focus on how you built the case — data, a small prototype, or addressing the specific concerns skeptics raised — rather than on authority or persistence alone. Interviewers are gauging whether you can influence without simply overriding people, and whether you stayed open to being wrong if the feedback had merit.",
    tags: ["influence", "star-method"],
  },
  {
    id: "hr-6",
    category: "Behavioral & HR",
    difficulty: "Beginner",
    question: "What's your biggest weakness?",
    answer:
      "Name something real, not a disguised strength ('I work too hard'). The strongest answers name a genuine, moderate weakness and then describe the concrete system or habit you've built to manage it — showing self-awareness and active improvement, not just an admission.",
    tags: ["self-awareness"],
  },
];