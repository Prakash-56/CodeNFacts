"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ChevronDown,
  Download,
  BookOpen,
  Sparkles,
  Rocket,
  Layers,
  Code2,
  Braces,
  GitBranch,
  Clock,
  Zap,
  CheckCircle2,
  FileText,
  Boxes,
  Workflow,
  Lightbulb,
  Terminal,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ------------------------------------------------------------------ */
/*  Syllabus data — grouped from the full 36-topic JavaScript syllabus */
/* ------------------------------------------------------------------ */

type Chapter = {
  id: string;
  title: string;
  icon: React.ElementType;
  summary: string;
  points: string[];
  code?: string;
};

const chapters: Chapter[] = [
  {
    id: "intro-history",
    title: "1. Introduction & History",
    icon: BookOpen,
    summary:
      "What JavaScript is, where it runs, and how it went from a 10-day prototype to the language of the web.",
    points: [
      "High-level, interpreted, object-oriented, event-driven language",
      "Powers Frontend, Backend, Mobile, Desktop, Games, APIs, Automation, AI/ML",
      "Runs in the browser (Chrome, Firefox, Edge) and on the server via Node.js",
      "Created by Brendan Eich in 1995, built in just 10 days",
      "Renamed twice — Mocha → LiveScript → JavaScript",
    ],
    code: `console.log("Hello World");
// Output: Hello World`,
  },
  {
    id: "features-setup",
    title: "2. Features & Adding JS to HTML",
    icon: Sparkles,
    summary: "Core language traits, plus the two ways to attach JS to a page.",
    points: [
      "Lightweight, interpreted, dynamically typed, prototype-based",
      "Object-oriented and event-driven",
      "Platform independent, supports asynchronous programming",
    ],
    code: `<!-- Internal -->
<script>
  console.log("Hello");
</script>

<!-- External -->
<script src="script.js"></script>`,
  },
  {
    id: "variables-datatypes",
    title: "3. Variables & Data Types",
    icon: Braces,
    summary: "var, let, const — and every primitive & non-primitive data type.",
    points: [
      "var — function scoped, can be redeclared",
      "let — block scoped, cannot be redeclared in the same scope",
      "const — block scoped, cannot be reassigned",
      "Primitives: Number, String, Boolean, Undefined, Null, BigInt, Symbol",
      "Non-primitives: Object, Array, Function",
    ],
    code: `var name = "John";
let age = 20;
const PI = 3.14;

let a = 10;              // Number
let str = "Alice";       // String
let ok = true;           // Boolean
let x;                   // Undefined
let y = null;            // Null
let big = 123456789012n; // BigInt
let id = Symbol("id");   // Symbol`,
  },
  {
    id: "operators-conversion",
    title: "4. Operators & Type Conversion",
    icon: Code2,
    summary: "Arithmetic, assignment, comparison, logical, ternary — and implicit vs explicit conversion.",
    points: [
      "Arithmetic: + - * / % **",
      "Assignment: = += -= *= /=",
      "Comparison: == vs === (loose vs strict)",
      "Logical: && || !",
      "Ternary: condition ? a : b",
      "Implicit conversion happens automatically; explicit uses Number(), String(), Boolean()",
    ],
    code: `10 == "10"   // true  (loose, type coerced)
10 === "10"  // false (strict, no coercion)

let age = 18;
age >= 18 ? "Adult" : "Minor";

"5" + 2      // "52"  (implicit)
Number("10") // 10    (explicit)`,
  },
  {
    id: "io-strings",
    title: "5. Input/Output & Strings",
    icon: Terminal,
    summary: "Talking to the user and the console, plus the string methods you'll use daily.",
    points: [
      "alert(), prompt(), confirm() for user interaction",
      "console.log/error/warn/table() for debugging",
      "String methods: length, toUpperCase, toLowerCase, trim, slice, substring, replace, includes, startsWith, endsWith, split",
    ],
    code: `let name = "JavaScript";
console.log(name.length);          // 10
console.log(name.toUpperCase());   // JAVASCRIPT
console.log(name.slice(0, 4));     // Java`,
  },
  {
    id: "templates-arrays-objects",
    title: "6. Template Literals, Arrays & Objects",
    icon: Boxes,
    summary: "Readable string interpolation, and the two workhorse data structures of JS.",
    points: [
      "Template literals use backticks and \${ } for interpolation",
      "Arrays: push, pop, shift, unshift, splice, slice, concat, join, sort, reverse, map, filter, reduce, forEach",
      "Objects: dot/bracket access, add & delete properties, for...in to loop keys",
    ],
    code: `let name = "John", age = 20;
console.log(\`My name is \${name} and age is \${age}\`);

let fruits = ["Apple", "Banana"];
fruits.push("Orange");

let student = { name: "John", age: 20 };
student.city = "Delhi";
delete student.age;
for (let key in student) console.log(key, student[key]);`,
  },
  {
    id: "functions-scope",
    title: "7. Functions & Scope",
    icon: Workflow,
    summary: "Three ways to write a function, and where variables actually live.",
    points: [
      "Function declaration, function expression, arrow function",
      "Parameters and return values",
      "Global scope, local (function) scope, block scope",
    ],
    code: `function greet() { console.log("Hello"); }
const greet2 = function () { console.log("Hello"); };
const greet3 = () => console.log("Hello");

function add(a, b) { return a + b; }`,
  },
  {
    id: "hoisting-control",
    title: "8. Hoisting & Control Statements",
    icon: GitBranch,
    summary: "Why var feels magical (and buggy), plus if/else/switch.",
    points: [
      "var declarations are hoisted and initialised as undefined",
      "let/const are hoisted but stay in the Temporal Dead Zone until declared",
      "if, if-else, else-if, and switch for branching logic",
    ],
    code: `console.log(a); // undefined (hoisted)
var a = 10;

console.log(b); // ReferenceError (TDZ)
let b = 20;

switch (day) {
  case 1: /* ... */ break;
  default: /* ... */
}`,
  },
  {
    id: "loops",
    title: "9. Loops",
    icon: Clock,
    summary: "for, while, do-while, for...of, for...in — when to reach for each.",
    points: [
      "for — when you know the number of iterations",
      "while / do-while — condition driven, do-while runs at least once",
      "for...of — iterate values (arrays, strings, iterables)",
      "for...in — iterate keys (objects)",
    ],
    code: `for (let i = 0; i < 5; i++) console.log(i);
for (let value of [1, 2, 3]) console.log(value);
for (let key in { a: 1, b: 2 }) console.log(key);`,
  },
  {
    id: "dom-events",
    title: "10. DOM & Events",
    icon: Layers,
    summary: "Selecting, changing, creating elements — and reacting to what the user does.",
    points: [
      "Select: getElementById, getElementsByClassName, querySelector(All)",
      "Change: innerHTML, innerText, textContent, style",
      "Create/remove: createElement, appendChild, remove",
      "Events: click, mouseover, keydown, submit, change, input",
    ],
    code: `const div = document.createElement("div");
document.body.appendChild(div);

button.addEventListener("click", function () {
  console.log("Clicked");
});`,
  },
  {
    id: "es6",
    title: "11. ES6+ Features",
    icon: Sparkles,
    summary: "The syntax upgrades that modern JavaScript codebases lean on constantly.",
    points: [
      "let & const, arrow functions",
      "Destructuring — objects and arrays",
      "Spread (...arr) and rest (...args) operators",
      "Default parameters",
      "Modules — export / import",
    ],
    code: `const person = { name: "John", age: 20 };
const { name, age } = person;

const arr = [1, 2];
const newArr = [...arr, 3];

function sum(...nums) { /* rest */ }
function greet(name = "Guest") { /* default */ }`,
  },
  {
    id: "async",
    title: "12. Promises, Async/Await & Fetch",
    icon: Zap,
    summary: "How JavaScript handles work that takes time, without blocking everything else.",
    points: [
      "Promise states resolve via then(), catch(), finally()",
      "async/await gives asynchronous code a synchronous-looking flow",
      "Fetch API for HTTP requests, both .then() chains and async/await styles",
    ],
    code: `async function getData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

fetch(url)
  .then(res => res.json())
  .then(data => console.log(data));`,
  },
  {
    id: "errors-classes",
    title: "13. Error Handling & Classes",
    icon: CheckCircle2,
    summary: "Failing gracefully, and JavaScript's take on object-oriented programming.",
    points: [
      "try / catch / finally, throw new Error()",
      "class with constructor() and methods",
      "Inheritance via extends",
    ],
    code: `class Person {
  constructor(name) { this.name = name; }
  greet() { console.log(this.name); }
}
class Student extends Person {}

try {
  throw new Error("Invalid");
} catch (error) {
  console.log(error.message);
} finally {
  console.log("done");
}`,
  },
  {
    id: "storage-json",
    title: "14. Storage & JSON",
    icon: FileText,
    summary: "Persisting data in the browser and converting between objects and text.",
    points: [
      "localStorage — persists until explicitly cleared",
      "sessionStorage — cleared when the tab closes",
      "JSON.stringify() and JSON.parse() to convert object ↔ text",
    ],
    code: `localStorage.setItem("name", "John");
localStorage.getItem("name");
localStorage.removeItem("name");

const json = JSON.stringify({ a: 1 });
const obj = JSON.parse(json);`,
  },
  {
    id: "array-methods",
    title: "15. Array Methods Deep Dive",
    icon: Boxes,
    summary: "map, filter, reduce and friends — the bread and butter of modern JS.",
    points: ["map(), filter(), reduce(), find(), some(), every(), includes(), sort()"],
    code: `const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
console.log(doubled); // [2, 4, 6]`,
  },
  {
    id: "closures-callbacks",
    title: "16. Closures & Callbacks",
    icon: Lightbulb,
    summary: "The two ideas that unlock almost every advanced JS pattern.",
    points: [
      "A closure remembers variables from its outer scope, even after that scope has finished",
      "A callback is simply a function passed into another function to run later",
    ],
    code: `function outer() {
  let count = 0;
  return function () {
    count++;
    console.log(count);
  };
}
const counter = outer();
counter(); // 1
counter(); // 2

function greet(name, callback) {
  console.log("Hello " + name);
  callback();
}
greet("Alice", () => console.log("Welcome!"));`,
  },
  {
    id: "event-loop",
    title: "17. The Event Loop",
    icon: Workflow,
    summary: "How a single-threaded language handles async work without freezing the page.",
    points: [
      "Call Stack executes synchronous code first",
      "Completed async tasks land in the Callback Queue or Microtask Queue",
      "The Event Loop pushes queued tasks to the Call Stack once it's empty",
      "Microtasks (Promises) always run before the next macrotask (setTimeout)",
    ],
  },
  {
    id: "builtins",
    title: "18. Common Built-in Objects",
    icon: Boxes,
    summary: "The objects JavaScript ships with, ready to use anywhere.",
    points: ["Math, Date, Array, Object, String, Number, Boolean, JSON, Map, Set"],
    code: `console.log(Math.max(10, 20, 30)); // 30
console.log(new Date().getFullYear());`,
  },
  {
    id: "best-practices",
    title: "19. Best Practices",
    icon: CheckCircle2,
    summary: "Habits that separate clean codebases from unmaintainable ones.",
    points: [
      "Prefer const by default; use let only when reassignment is needed",
      "Avoid var in modern JavaScript",
      "Use === instead of == unless coercion is intentional",
      "Write small, reusable, well-named functions",
      "Use async/await for readable asynchronous code",
      "Keep code modular with ES Modules",
    ],
  },
  {
    id: "mini-example",
    title: "20. Mini Example",
    icon: Code2,
    summary: "Chaining array methods to solve a real problem in three lines.",
    points: ["filter() + map() chained together to transform a dataset in one readable pipeline"],
    code: `const users = [
  { name: "Alice", age: 22 },
  { name: "Bob", age: 17 },
  { name: "Charlie", age: 25 },
];

const adults = users
  .filter(user => user.age >= 18)
  .map(user => user.name);

console.log(adults); // ["Alice", "Charlie"]`,
  },
  {
    id: "roadmap",
    title: "21. Learning Roadmap",
    icon: Rocket,
    summary: "The order that actually works, from your first console.log to shipped projects.",
    points: [
      "JS Basics → Control Flow → Functions & Scope",
      "Arrays & Objects → DOM Manipulation → Events",
      "ES6+ Features → Async JS (callbacks, promises, async/await)",
      "Fetch API & REST → Error Handling → OOP (classes, inheritance)",
      "Modules → Browser Storage → Advanced (closures, event loop, prototypes)",
      "Build projects: To-Do App, Calculator, Weather App, Quiz App, E-commerce Cart",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Cheat sheet data                                                    */
/* ------------------------------------------------------------------ */

const cheatSheets = [
  {
    title: "Array Methods",
    rows: [
      ["push()", "add to end"],
      ["pop()", "remove from end"],
      ["map()", "transform every item"],
      ["filter()", "keep matching items"],
      ["reduce()", "fold into one value"],
      ["find()", "first match"],
      ["includes()", "true / false check"],
      ["sort()", "reorder in place"],
    ],
  },
  {
    title: "String Methods",
    rows: [
      ["length", "character count"],
      ["toUpperCase()", "ALL CAPS"],
      ["slice(a,b)", "extract substring"],
      ["trim()", "remove edge spaces"],
      ["includes()", "contains check"],
      ["split()", "string → array"],
      ["replace()", "swap text"],
      ["startsWith()", "prefix check"],
    ],
  },
  {
    title: "Comparison & Logic",
    rows: [
      ["==", "loose equality (coerces)"],
      ["===", "strict equality"],
      ["&&", "AND"],
      ["||", "OR"],
      ["!", "NOT"],
      ["?? ", "nullish coalescing"],
      ["?:", "ternary shorthand"],
      ["!!x", "force to boolean"],
    ],
  },
  {
    title: "Data Types",
    rows: [
      ["Number", "10, 3.14"],
      ["String", "\"text\""],
      ["Boolean", "true / false"],
      ["Undefined", "declared, no value"],
      ["Null", "explicitly empty"],
      ["BigInt", "123n"],
      ["Symbol", "unique id"],
      ["Object/Array", "non-primitive"],
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Full notes text used for the download button                       */
/* ------------------------------------------------------------------ */

function buildNotesText() {
  let out = "JAVASCRIPT NOTES — CodeNFacts\n";
  out += "================================\n\n";
  chapters.forEach((ch) => {
    out += `${ch.title}\n--------------------------------\n`;
    out += `${ch.summary}\n\n`;
    ch.points.forEach((p) => (out += `• ${p}\n`));
    if (ch.code) out += `\nExample:\n${ch.code}\n`;
    out += "\n\n";
  });
  out += "Made with CodeNFacts — happy coding!\n";
  return out;
}

/* ------------------------------------------------------------------ */
/*  Small building blocks                                               */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono tracking-[0.2em] uppercase text-amber-700 dark:text-emerald-400 mb-2">
      {children}
    </p>
  );
}

function TerminalDots() {
  return (
    <div className="flex gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-lg bg-[#0d1117] border border-white/5 p-4 text-[13px] leading-relaxed font-mono text-emerald-300">
      <code>{code}</code>
    </pre>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagrams (inline SVG, theme-adaptive via currentColor)              */
/* ------------------------------------------------------------------ */

function EventLoopDiagram() {
  return (
    <svg viewBox="0 0 560 260" className="w-full h-auto text-neutral-700 dark:text-neutral-300">
      <rect x="20" y="20" width="150" height="70" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="95" y="60" textAnchor="middle" fontSize="13" fill="currentColor" fontFamily="monospace">Call Stack</text>

      <rect x="205" y="20" width="150" height="70" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="280" y="52" textAnchor="middle" fontSize="13" fill="currentColor" fontFamily="monospace">Web APIs</text>
      <text x="280" y="68" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.6" fontFamily="monospace">setTimeout, fetch</text>

      <rect x="390" y="20" width="150" height="70" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="465" y="52" textAnchor="middle" fontSize="13" fill="currentColor" fontFamily="monospace">Callback Queue</text>
      <text x="465" y="68" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.6" fontFamily="monospace">macrotasks</text>

      <rect x="205" y="150" width="150" height="70" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="280" y="182" textAnchor="middle" fontSize="13" fill="currentColor" fontFamily="monospace">Microtask Queue</text>
      <text x="280" y="198" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.6" fontFamily="monospace">Promises</text>

      <circle cx="95" cy="185" r="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="95" y="182" textAnchor="middle" fontSize="12" fill="currentColor" fontFamily="monospace">Event</text>
      <text x="95" y="196" textAnchor="middle" fontSize="12" fill="currentColor" fontFamily="monospace">Loop</text>

      <path d="M170 55 H205" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <path d="M355 55 H390" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <path d="M465 90 V150 H355" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
      <path d="M205 185 H130" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <path d="M95 150 V90" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}

function ClosureDiagram() {
  return (
    <svg viewBox="0 0 480 220" className="w-full h-auto text-neutral-700 dark:text-neutral-300">
      <rect x="20" y="20" width="440" height="180" rx="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 5" />
      <text x="40" y="45" fontSize="12" fill="currentColor" fontFamily="monospace" opacity="0.7">outer() scope</text>

      <rect x="60" y="65" width="180" height="45" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="150" y="92" textAnchor="middle" fontSize="13" fill="currentColor" fontFamily="monospace">let count = 0</text>

      <rect x="260" y="130" width="180" height="55" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="350" y="153" textAnchor="middle" fontSize="12" fill="currentColor" fontFamily="monospace">returned function</text>
      <text x="350" y="170" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.7" fontFamily="monospace">remembers count</text>

      <path d="M240 88 C 280 88, 280 155, 262 158" stroke="currentColor" strokeWidth="1.5" fill="none" markerEnd="url(#arrow2)" />
      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}

function ScopeChainDiagram() {
  return (
    <svg viewBox="0 0 420 240" className="w-full h-auto text-neutral-700 dark:text-neutral-300">
      <rect x="30" y="20" width="360" height="200" rx="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="50" y="42" fontSize="12" fill="currentColor" fontFamily="monospace" opacity="0.7">Global Scope</text>

      <rect x="60" y="60" width="300" height="130" rx="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="80" y="82" fontSize="12" fill="currentColor" fontFamily="monospace" opacity="0.7">Function Scope</text>

      <rect x="90" y="100" width="240" height="70" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="110" y="122" fontSize="12" fill="currentColor" fontFamily="monospace" opacity="0.7">Block Scope { }</text>
      <text x="210" y="150" textAnchor="middle" fontSize="12" fill="currentColor" fontFamily="monospace">let x = 5</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                           */
/* ------------------------------------------------------------------ */

export default function JavaScriptPage() {
  const [openChapter, setOpenChapter] = useState<string | null>(chapters[0].id);
  const [showThanks, setShowThanks] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syllabusRef = useRef<HTMLDivElement | null>(null);

  function handleDownload() {
    const text = buildNotesText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "JavaScript-Notes-CodeNFacts.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setShowThanks(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowThanks(false), 4000);
  }

  function scrollToSyllabus() {
    syllabusRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0e14] text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* ---------------------------------------------------------------- */}
      {/* HERO — terminal window                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-14 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.08]">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-500 dark:bg-emerald-400 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-amber-500 dark:bg-emerald-400 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-xl border border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0d1117] shadow-xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14]">
              <TerminalDots />
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                javascript-notes.md
              </span>
            </div>
            <div className="p-6 sm:p-10">
              <SectionLabel>CodeNFacts · Programming Language</SectionLabel>
              <h1 className="text-3xl sm:text-5xl font-bold font-mono tracking-tight">
                Java<span className="text-amber-600 dark:text-emerald-400">Script</span>
              </h1>
              <p className="mt-4 max-w-xl text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
                The language that runs in every browser on Earth - and, thanks to Node.js,
                on the server too. This page is a complete, project-ready reference: full
                syllabus, cheat sheets, diagrams, and the theory behind why JS works the way it does.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-[#0a0e14] font-medium text-sm px-5 py-2.5 transition-colors shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  Download JavaScript Notes
                </button>
                <button
                  onClick={scrollToSyllabus}
                  className="inline-flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium px-5 py-2.5 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  View Full Syllabus
                </button>
              </div>

              <div className="mt-8 grid grid-cols-3 sm:grid-cols-3 gap-3 max-w-md">
                {[
                  ["21", "Chapters"],
                  ["36", "Topics Covered"],
                  ["3", "Diagrams"],
                ].map(([num, label]) => (
                  <div key={label} className="text-center rounded-lg bg-white dark:bg-[#0a0e14] border border-black/5 dark:border-white/10 py-3">
                    <p className="text-lg font-bold font-mono text-amber-700 dark:text-emerald-400">{num}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* thank-you toast */}
        <AnimatePresence>
          {showThanks && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 20, x: "-50%" }}
              className="fixed left-1/2 bottom-6 z-50 rounded-lg bg-neutral-900 dark:bg-emerald-500 text-white dark:text-[#0a0e14] px-5 py-3 shadow-xl text-sm font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Thanks for downloading! Happy coding 🚀
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* ABOUT / BLOG — use cases, features, future                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>About JavaScript</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            One language, every corner of software
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: Rocket,
                title: "Where it's used",
                body:
                  "Frontend UI, backend services with Node.js, mobile apps (React Native), desktop apps (Electron), game engines, browser extensions, automation scripts, and increasingly AI-assisted tooling. Almost no software category is untouched by JS.",
              },
              {
                icon: Sparkles,
                title: "Why it endures",
                body:
                  "It's the only language that ships natively in every browser, so the frontend is never optional. Add a fast JIT-compiled runtime, an enormous npm ecosystem, and a syntax that's approachable for beginners yet powerful enough for large systems.",
              },
              {
                icon: Zap,
                title: "Core features",
                body:
                  "Dynamic typing, prototype-based objects, first-class functions, closures, and an event-driven, non-blocking model built around the event loop — this combination is what makes async code (network calls, timers, UI events) feel natural.",
              },
              {
                icon: Lightbulb,
                title: "Where it's headed",
                body:
                  "WebAssembly for performance-critical code running alongside JS, server components blurring frontend/backend lines, edge runtimes shrinking cold-start times, and AI-assisted coding tools making JS's already-low barrier to entry even lower.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="rounded-xl border border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0d1117] p-6"
              >
                <card.icon className="h-5 w-5 text-amber-600 dark:text-emerald-400 mb-3" />
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white dark:bg-[#0a0e14]">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-600 dark:text-emerald-400" />
              The theory worth understanding early
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              JavaScript is single-threaded — only one thing runs at a time on the Call Stack.
              What makes it feel concurrent is the event loop: long-running work (timers, network
              requests) is handed off to the browser or Node's C++ APIs, and only the follow-up
              callback returns to the Call Stack later. Understanding this one idea explains
              hoisting quirks, why <code className="font-mono text-xs">async/await</code> reads
              top-to-bottom while still being non-blocking, and why a <code className="font-mono text-xs">Promise</code> callback
              always runs before a <code className="font-mono text-xs">setTimeout</code> callback, even at 0ms.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FULL SYLLABUS — accordion                                        */}
      {/* ---------------------------------------------------------------- */}
      <section ref={syllabusRef} className="px-4 sm:px-6 lg:px-8 py-16 border-t border-black/5 dark:border-white/5 scroll-mt-6">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Full Syllabus</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Every topic, in order</h2>

          <div className="space-y-3">
            {chapters.map((ch, i) => {
              const isOpen = openChapter === ch.id;
              const Icon = ch.icon;
              return (
                <motion.div
                  key={ch.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i % 6}
                  className="rounded-xl border border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0d1117] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenChapter(isOpen ? null : ch.id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0 text-amber-600 dark:text-emerald-400" />
                      <span className="font-medium text-sm sm:text-base">{ch.title}</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                            {ch.summary}
                          </p>
                          <ul className="space-y-1.5">
                            {ch.points.map((p) => (
                              <li key={p} className="text-sm flex gap-2">
                                <span className="text-amber-600 dark:text-emerald-400 mt-1">▹</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                          {ch.code && <CodeBlock code={ch.code} />}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CHEAT SHEETS                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Quick Reference</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Cheat sheets</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {cheatSheets.map((sheet, i) => (
              <motion.div
                key={sheet.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="rounded-xl border border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0d1117] p-5"
              >
                <h3 className="font-semibold mb-3 font-mono text-sm text-amber-700 dark:text-emerald-400">
                  {sheet.title}
                </h3>
                <div className="divide-y divide-black/5 dark:divide-white/5">
                  {sheet.rows.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-2 text-sm">
                      <code className="font-mono text-xs bg-white dark:bg-[#0a0e14] px-2 py-1 rounded border border-black/5 dark:border-white/10">
                        {k}
                      </code>
                      <span className="text-neutral-500 dark:text-neutral-400 text-xs text-right ml-3">{v}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* DIAGRAMS / SKETCHES                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Visual Notes</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Diagrams & sketches</h2>

          <div className="space-y-8">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="rounded-xl border border-dashed border-black/15 dark:border-white/15 p-6"
            >
              <h3 className="font-semibold mb-4">The Event Loop</h3>
              <EventLoopDiagram />
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
                className="rounded-xl border border-dashed border-black/15 dark:border-white/15 p-6"
              >
                <h3 className="font-semibold mb-4">Closures</h3>
                <ClosureDiagram />
              </motion.div>

              <motion.div
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}
                className="rounded-xl border border-dashed border-black/15 dark:border-white/15 p-6"
              >
                <h3 className="font-semibold mb-4">Scope Chain</h3>
                <ScopeChainDiagram />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER CTA — download again                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto rounded-xl bg-[#f7f8fa] dark:bg-[#0d1117] border border-black/10 dark:border-white/10 p-8 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Keep this reference offline</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
            One click gets you every chapter, code example, and cheat sheet on this page in a single text file.
          </p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-[#0a0e14] font-medium text-sm px-6 py-3 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            Download JavaScript Notes
          </button>
        </div>
      </section>
    </main>
  );
}