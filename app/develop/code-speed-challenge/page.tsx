// app/develop/code-speed-challenge/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Code2, Timer, CheckCircle2, XCircle, 
  Lightbulb, BookOpen, Zap, Trophy, 
  ChevronRight, RotateCcw, Play, Eye
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  DATA – 6 most important problems per category                             */
/* -------------------------------------------------------------------------- */

type Language = 
  | "javascript" | "typescript" | "python" | "react" 
  | "nodejs" | "css" | "sql" | "go";

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  starterCode: string;
  solution: string;               // exact expected output or key logic
  testCases: { input: string; expected: string }[];
  hints: string[];
  timeLimitSec: number;           // recommended max time
}

const PROBLEMS: Record<Language, Problem[]> = {
  javascript: [
    {
      id: "js1",
      title: "Reverse a String",
      difficulty: "Easy",
      description: "Write a function that reverses a string without using built-in reverse methods.",
      starterCode: `function reverseString(str) {\n  // your code here\n}`,
      solution: "function reverseString(str) {\n  let rev = '';\n  for (let i = str.length - 1; i >= 0; i--) rev += str[i];\n  return rev;\n}",
      testCases: [
        { input: '"hello"', expected: '"olleh"' },
        { input: '"JavaScript"', expected: '"tpircSavaJ"' },
      ],
      hints: ["Use a loop from the end", "Accumulate characters"],
      timeLimitSec: 90,
    },
    {
      id: "js2",
      title: "FizzBuzz",
      difficulty: "Easy",
      description: "Print numbers 1 to n. For multiples of 3 print 'Fizz', of 5 print 'Buzz', of both 'FizzBuzz'.",
      starterCode: `function fizzBuzz(n) {\n  // return an array of strings\n}`,
      solution: "function fizzBuzz(n) {\n  const res = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) res.push('FizzBuzz');\n    else if (i % 3 === 0) res.push('Fizz');\n    else if (i % 5 === 0) res.push('Buzz');\n    else res.push(String(i));\n  }\n  return res;\n}",
      testCases: [
        { input: "5", expected: '["1","2","Fizz","4","Buzz"]' },
        { input: "15", expected: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
      ],
      hints: ["Check 15 first", "Use modulo"],
      timeLimitSec: 120,
    },
    {
      id: "js3",
      title: "Debounce",
      difficulty: "Medium",
      description: "Implement a debounce function that delays invoking `fn` until after `wait` ms have elapsed since the last call.",
      starterCode: `function debounce(fn, wait) {\n  // your code here\n}`,
      solution: "function debounce(fn, wait) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), wait);\n  };\n}",
      testCases: [
        { input: "fn, 300", expected: "returns a function that delays calls" },
      ],
      hints: ["Use setTimeout + clearTimeout", "Return a new function"],
      timeLimitSec: 180,
    },
    {
      id: "js4",
      title: "Deep Clone",
      difficulty: "Medium",
      description: "Create a deep clone of a nested object/array without using JSON.parse/stringify.",
      starterCode: `function deepClone(obj) {\n  // your code here\n}`,
      solution: "function deepClone(obj) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (Array.isArray(obj)) return obj.map(deepClone);\n  const clone = {};\n  for (const key in obj) {\n    if (obj.hasOwnProperty(key)) clone[key] = deepClone(obj[key]);\n  }\n  return clone;\n}",
      testCases: [
        { input: '{a:1,b:{c:2}}', expected: "deep independent copy" },
      ],
      hints: ["Handle arrays and objects separately", "Recursion is your friend"],
      timeLimitSec: 210,
    },
    {
      id: "js5",
      title: "Flatten Array",
      difficulty: "Medium",
      description: "Flatten a nested array of any depth into a single-level array.",
      starterCode: `function flatten(arr) {\n  // your code here\n}`,
      solution: "function flatten(arr) {\n  return arr.reduce((acc, val) =>\n    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);\n}",
      testCases: [
        { input: "[1,[2,[3,4],5]]", expected: "[1,2,3,4,5]" },
      ],
      hints: ["reduce + recursion", "or use flatMap"],
      timeLimitSec: 150,
    },
    {
      id: "js6",
      title: "Promise.all Polyfill",
      difficulty: "Hard",
      description: "Implement Promise.all that resolves when all promises resolve or rejects on first rejection.",
      starterCode: `function promiseAll(promises) {\n  // your code here\n}`,
      solution: "function promiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    const results = [];\n    let completed = 0;\n    if (promises.length === 0) return resolve([]);\n    promises.forEach((p, i) => {\n      Promise.resolve(p).then(val => {\n        results[i] = val;\n        completed++;\n        if (completed === promises.length) resolve(results);\n      }).catch(reject);\n    });\n  });\n}",
      testCases: [
        { input: "[Promise.resolve(1), Promise.resolve(2)]", expected: "[1,2]" },
      ],
      hints: ["Track completion count", "Preserve order"],
      timeLimitSec: 300,
    },
  ],

  typescript: [
    {
      id: "ts1",
      title: "Type-safe Pick",
      difficulty: "Easy",
      description: "Implement a Pick utility type that creates a type with only the selected keys.",
      starterCode: `type MyPick<T, K extends keyof T> = {\n  // your code here\n}`,
      solution: "type MyPick<T, K extends keyof T> = {\n  [P in K]: T[P];\n}",
      testCases: [
        { input: "MyPick<{a:1,b:2,c:3}, 'a'|'b'>", expected: "{a:1,b:2}" },
      ],
      hints: ["Mapped types", "K extends keyof T"],
      timeLimitSec: 120,
    },
    {
      id: "ts2",
      title: "Readonly Deep",
      difficulty: "Medium",
      description: "Create a DeepReadonly type that makes every nested property readonly.",
      starterCode: `type DeepReadonly<T> = {\n  // your code here\n}`,
      solution: "type DeepReadonly<T> = {\n  readonly [P in keyof T]: T[P] extends object\n    ? DeepReadonly<T[P]>\n    : T[P];\n}",
      testCases: [
        { input: "DeepReadonly<{a:{b:number}}>", expected: "fully readonly nested" },
      ],
      hints: ["Conditional types + recursion"],
      timeLimitSec: 180,
    },
    {
      id: "ts3",
      title: "Function Overloads",
      difficulty: "Medium",
      description: "Write overloaded signatures for a function that returns string length or number doubled.",
      starterCode: `// overload signatures\nfunction process(x: string): number;\nfunction process(x: number): number;\nfunction process(x: string | number): number {\n  // implementation\n}`,
      solution: "function process(x: string): number;\nfunction process(x: number): number;\nfunction process(x: string | number): number {\n  return typeof x === 'string' ? x.length : x * 2;\n}",
      testCases: [
        { input: 'process("hi")', expected: "2" },
        { input: "process(5)", expected: "10" },
      ],
      hints: ["Declare signatures before implementation"],
      timeLimitSec: 150,
    },
    {
      id: "ts4",
      title: "Exclude Utility",
      difficulty: "Easy",
      description: "Implement Exclude<T, U> that excludes types from T that are assignable to U.",
      starterCode: `type MyExclude<T, U> = // your code`,
      solution: "type MyExclude<T, U> = T extends U ? never : T;",
      testCases: [
        { input: "MyExclude<'a'|'b'|'c', 'a'>", expected: "'b'|'c'" },
      ],
      hints: ["Conditional type distributes over unions"],
      timeLimitSec: 90,
    },
    {
      id: "ts5",
      title: "Infer Return Type",
      difficulty: "Hard",
      description: "Extract the return type of a function type using infer.",
      starterCode: `type MyReturnType<T> = // your code`,
      solution: "type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;",
      testCases: [
        { input: "MyReturnType<() => string>", expected: "string" },
      ],
      hints: ["Use infer inside conditional"],
      timeLimitSec: 180,
    },
    {
      id: "ts6",
      title: "Tuple to Union",
      difficulty: "Medium",
      description: "Convert a tuple type to a union of its element types.",
      starterCode: `type TupleToUnion<T> = // your code`,
      solution: "type TupleToUnion<T> = T extends Array<infer U> ? U : never;",
      testCases: [
        { input: "TupleToUnion<[string, number]>", expected: "string | number" },
      ],
      hints: ["infer the element type"],
      timeLimitSec: 120,
    },
  ],

  python: [
    {
      id: "py1",
      title: "List Comprehension Filter",
      difficulty: "Easy",
      description: "Return a list of squares of even numbers from 1 to n using list comprehension.",
      starterCode: `def even_squares(n):\n    # your code here\n    pass`,
      solution: "def even_squares(n):\n    return [i**2 for i in range(1, n+1) if i % 2 == 0]",
      testCases: [
        { input: "5", expected: "[4, 16]" },
        { input: "10", expected: "[4, 16, 36, 64, 100]" },
      ],
      hints: ["[expr for x in range if condition]"],
      timeLimitSec: 90,
    },
    {
      id: "py2",
      title: "Two Sum",
      difficulty: "Easy",
      description: "Return indices of the two numbers that add up to target.",
      starterCode: `def two_sum(nums, target):\n    # your code here\n    pass`,
      solution: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i",
      testCases: [
        { input: "[2,7,11,15], 9", expected: "[0,1]" },
      ],
      hints: ["Use a dictionary for O(n)"],
      timeLimitSec: 120,
    },
    {
      id: "py3",
      title: "Decorator Timer",
      difficulty: "Medium",
      description: "Write a decorator that prints how long a function took to execute.",
      starterCode: `import time\ndef timer(func):\n    # your code here\n    pass`,
      solution: "import time\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f'{func.__name__} took {time.time()-start:.4f}s')\n        return result\n    return wrapper",
      testCases: [
        { input: "@timer\\ndef foo(): pass", expected: "prints execution time" },
      ],
      hints: ["wrapper function", "time.time()"],
      timeLimitSec: 180,
    },
    {
      id: "py4",
      title: "Generator Fibonacci",
      difficulty: "Medium",
      description: "Create a generator that yields Fibonacci numbers indefinitely.",
      starterCode: `def fib():\n    # your code here\n    pass`,
      solution: "def fib():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b",
      testCases: [
        { input: "next(fib())", expected: "0 then 1 then 1 then 2..." },
      ],
      hints: ["yield + infinite loop"],
      timeLimitSec: 120,
    },
    {
      id: "py5",
      title: "Context Manager",
      difficulty: "Hard",
      description: "Implement a context manager that temporarily changes the working directory.",
      starterCode: `import os\nfrom contextlib import contextmanager\n\n@contextmanager\ndef change_dir(path):\n    # your code here\n    pass`,
      solution: "import os\nfrom contextlib import contextmanager\n\n@contextmanager\ndef change_dir(path):\n    old = os.getcwd()\n    os.chdir(path)\n    try:\n        yield\n    finally:\n        os.chdir(old)",
      testCases: [
        { input: "with change_dir('/tmp'): ...", expected: "cwd restored after" },
      ],
      hints: ["try/finally is crucial"],
      timeLimitSec: 210,
    },
    {
      id: "py6",
      title: "Merge Intervals",
      difficulty: "Hard",
      description: "Given a list of intervals, merge all overlapping intervals.",
      starterCode: `def merge(intervals):\n    # your code here\n    pass`,
      solution: "def merge(intervals):\n    if not intervals: return []\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for curr in intervals[1:]:\n        if curr[0] <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], curr[1])\n        else:\n            merged.append(curr)\n    return merged",
      testCases: [
        { input: "[[1,3],[2,6],[8,10]]", expected: "[[1,6],[8,10]]" },
      ],
      hints: ["Sort by start", "compare with last merged"],
      timeLimitSec: 240,
    },
  ],

  react: [
    {
      id: "re1",
      title: "Counter with useState",
      difficulty: "Easy",
      description: "Create a counter component with + and - buttons using useState.",
      starterCode: `function Counter() {\n  // your code here\n  return (\n    <div>\n      {/* UI */}\n    </div>\n  );\n}`,
      solution: `function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <button onClick={() => setCount(c => c - 1)}>-</button>\n      <span>{count}</span>\n      <button onClick={() => setCount(c => c + 1)}>+</button>\n    </div>\n  );\n}`,
      testCases: [
        { input: "click + three times", expected: "count === 3" },
      ],
      hints: ["useState(0)", "functional updates"],
      timeLimitSec: 90,
    },
    {
      id: "re2",
      title: "useEffect Cleanup",
      difficulty: "Medium",
      description: "Create a component that starts an interval on mount and clears it on unmount.",
      starterCode: `function Timer() {\n  // your code here\n}`,
      solution: `function Timer() {\n  const [sec, setSec] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => setSec(s => s + 1), 1000);\n    return () => clearInterval(id);\n  }, []);\n  return <div>{sec}s</div>;\n}`,
      testCases: [
        { input: "unmount component", expected: "interval is cleared" },
      ],
      hints: ["return cleanup function from useEffect"],
      timeLimitSec: 150,
    },
    {
      id: "re3",
      title: "Custom Hook useLocalStorage",
      difficulty: "Medium",
      description: "Write a custom hook that syncs state with localStorage.",
      starterCode: `function useLocalStorage(key, initial) {\n  // your code here\n}`,
      solution: `function useLocalStorage(key, initial) {\n  const [value, setValue] = useState(() => {\n    const stored = localStorage.getItem(key);\n    return stored ? JSON.parse(stored) : initial;\n  });\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n  return [value, setValue];\n}`,
      testCases: [
        { input: "useLocalStorage('theme', 'light')", expected: "persists across reloads" },
      ],
      hints: ["lazy initial state", "useEffect to write"],
      timeLimitSec: 210,
    },
    {
      id: "re4",
      title: "Controlled Form",
      difficulty: "Easy",
      description: "Build a controlled input that updates state on every keystroke.",
      starterCode: `function NameForm() {\n  // your code here\n}`,
      solution: `function NameForm() {\n  const [name, setName] = useState('');\n  return (\n    <input\n      value={name}\n      onChange={e => setName(e.target.value)}\n      placeholder="Your name"\n    />\n  );\n}`,
      testCases: [
        { input: "type 'Alice'", expected: "value === 'Alice'" },
      ],
      hints: ["value + onChange"],
      timeLimitSec: 60,
    },
    {
      id: "re5",
      title: "Memoization with useMemo",
      difficulty: "Medium",
      description: "Expensive calculation should only re-run when dependency changes.",
      starterCode: `function Expensive({ num }) {\n  // use useMemo\n}`,
      solution: `function Expensive({ num }) {\n  const result = useMemo(() => {\n    // heavy calc\n    let sum = 0;\n    for (let i = 0; i < 1e7; i++) sum += i;\n    return sum + num;\n  }, [num]);\n  return <div>{result}</div>;\n}`,
      testCases: [
        { input: "num changes", expected: "recalculates only then" },
      ],
      hints: ["useMemo(() => ..., [dep])"],
      timeLimitSec: 150,
    },
    {
      id: "re6",
      title: "Context Provider",
      difficulty: "Hard",
      description: "Create a ThemeContext with provider and a consumer hook.",
      starterCode: `// ThemeContext.js\nconst ThemeContext = createContext();\n\nexport function ThemeProvider({ children }) {\n  // your code\n}\n\nexport function useTheme() {\n  // your code\n}`,
      solution: `const ThemeContext = createContext();\n\nexport function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState('light');\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n\nexport function useTheme() {\n  const ctx = useContext(ThemeContext);\n  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');\n  return ctx;\n}`,
      testCases: [
        { input: "useTheme() outside provider", expected: "throws error" },
      ],
      hints: ["createContext + Provider + useContext"],
      timeLimitSec: 240,
    },
  ],

  nodejs: [
    {
      id: "no1",
      title: "Read File Async",
      difficulty: "Easy",
      description: "Read a file asynchronously using fs.promises and return its content.",
      starterCode: `const fs = require('fs').promises;\n\nasync function readFile(path) {\n  // your code here\n}`,
      solution: `const fs = require('fs').promises;\n\nasync function readFile(path) {\n  return await fs.readFile(path, 'utf8');\n}`,
      testCases: [
        { input: "readFile('./data.txt')", expected: "file contents as string" },
      ],
      hints: ["fs.promises.readFile"],
      timeLimitSec: 90,
    },
    {
      id: "no2",
      title: "Simple HTTP Server",
      difficulty: "Medium",
      description: "Create an HTTP server that responds with 'Hello World' on every request.",
      starterCode: `const http = require('http');\n\n// your code here`,
      solution: `const http = require('http');\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'text/plain' });\n  res.end('Hello World');\n});\nserver.listen(3000);`,
      testCases: [
        { input: "GET /", expected: "Hello World" },
      ],
      hints: ["http.createServer", "res.end"],
      timeLimitSec: 150,
    },
    {
      id: "no3",
      title: "Middleware Pattern",
      difficulty: "Medium",
      description: "Implement a simple middleware chain that calls next().",
      starterCode: `function compose(middlewares) {\n  // your code here\n}`,
      solution: `function compose(middlewares) {\n  return function (ctx) {\n    let index = -1;\n    function dispatch(i) {\n      if (i <= index) return Promise.reject(new Error('next() called multiple times'));\n      index = i;\n      const fn = middlewares[i];\n      if (!fn) return Promise.resolve();\n      return Promise.resolve(fn(ctx, () => dispatch(i + 1)));\n    }\n    return dispatch(0);\n  };\n}`,
      testCases: [
        { input: "compose([fn1, fn2])", expected: "calls in order" },
      ],
      hints: ["recursive dispatch"],
      timeLimitSec: 240,
    },
    {
      id: "no4",
      title: "Stream Pipeline",
      difficulty: "Hard",
      description: "Pipe a readable stream through a transform and into a writable stream safely.",
      starterCode: `const { pipeline } = require('stream');\nconst { promisify } = require('util');\n\n// your code here`,
      solution: `const { pipeline } = require('stream');\nconst { promisify } = require('util');\nconst pipe = promisify(pipeline);\n\nasync function processFile(src, dest) {\n  await pipe(\n    fs.createReadStream(src),\n    // transform stream here\n    fs.createWriteStream(dest)\n  );\n}`,
      testCases: [
        { input: "pipe(read, write)", expected: "no memory leaks" },
      ],
      hints: ["promisify(pipeline)"],
      timeLimitSec: 210,
    },
    {
      id: "no5",
      title: "Event Emitter",
      difficulty: "Medium",
      description: "Implement a basic EventEmitter with on and emit.",
      starterCode: `class EventEmitter {\n  // your code here\n}`,
      solution: `class EventEmitter {\n  constructor() { this.events = {}; }\n  on(event, listener) {\n    (this.events[event] ||= []).push(listener);\n  }\n  emit(event, ...args) {\n    (this.events[event] || []).forEach(fn => fn(...args));\n  }\n}`,
      testCases: [
        { input: "ee.on('data', fn); ee.emit('data', 1)", expected: "fn called with 1" },
      ],
      hints: ["store listeners in object of arrays"],
      timeLimitSec: 150,
    },
    {
      id: "no6",
      title: "Rate Limiter",
      difficulty: "Hard",
      description: "Implement a simple token-bucket rate limiter.",
      starterCode: `class RateLimiter {\n  constructor(maxTokens, refillRate) {\n    // your code\n  }\n  tryRemoveTokens(count) {\n    // return true if allowed\n  }\n}`,
      solution: `class RateLimiter {\n  constructor(maxTokens, refillRate) {\n    this.max = maxTokens;\n    this.tokens = maxTokens;\n    this.refillRate = refillRate;\n    this.last = Date.now();\n  }\n  tryRemoveTokens(count) {\n    this._refill();\n    if (this.tokens >= count) {\n      this.tokens -= count;\n      return true;\n    }\n    return false;\n  }\n  _refill() {\n    const now = Date.now();\n    const elapsed = (now - this.last) / 1000;\n    this.tokens = Math.min(this.max, this.tokens + elapsed * this.refillRate);\n    this.last = now;\n  }\n}`,
      testCases: [
        { input: "limiter.tryRemoveTokens(1)", expected: "true until tokens exhausted" },
      ],
      hints: ["refill based on time elapsed"],
      timeLimitSec: 300,
    },
  ],

  css: [
    {
      id: "css1",
      title: "Centering a Div",
      difficulty: "Easy",
      description: "Center a div both horizontally and vertically using Flexbox.",
      starterCode: `.container {\n  /* your code */\n}\n.box {\n  width: 100px;\n  height: 100px;\n}`,
      solution: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}`,
      testCases: [
        { input: "parent 100vh", expected: "child perfectly centered" },
      ],
      hints: ["display:flex + justify + align"],
      timeLimitSec: 60,
    },
    {
      id: "css2",
      title: "Responsive Grid",
      difficulty: "Medium",
      description: "Create a responsive 3-column grid that becomes 1-column on mobile.",
      starterCode: `.grid {\n  /* your code */\n}`,
      solution: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}\n@media (max-width: 640px) {\n  .grid {\n    grid-template-columns: 1fr;\n  }\n}`,
      testCases: [
        { input: "viewport < 640px", expected: "single column" },
      ],
      hints: ["grid-template-columns + media query"],
      timeLimitSec: 120,
    },
    {
      id: "css3",
      title: "Sticky Header",
      difficulty: "Easy",
      description: "Make a header stick to the top while scrolling.",
      starterCode: `header {\n  /* your code */\n}`,
      solution: `header {\n  position: sticky;\n  top: 0;\n  z-index: 50;\n  background: white;\n}`,
      testCases: [
        { input: "scroll down", expected: "header stays at top" },
      ],
      hints: ["position: sticky; top: 0"],
      timeLimitSec: 45,
    },
    {
      id: "css4",
      title: "Dark Mode Toggle",
      difficulty: "Medium",
      description: "Style a page that switches between light and dark using a class on html.",
      starterCode: `:root {\n  /* light vars */\n}\n.dark {\n  /* dark vars */\n}`,
      solution: `:root {\n  --bg: #ffffff;\n  --text: #111827;\n}\n.dark {\n  --bg: #0f172a;\n  --text: #f1f5f9;\n}\nbody {\n  background: var(--bg);\n  color: var(--text);\n}`,
      testCases: [
        { input: "html.dark", expected: "dark colors applied" },
      ],
      hints: ["CSS custom properties"],
      timeLimitSec: 120,
    },
    {
      id: "css5",
      title: "Aspect Ratio Box",
      difficulty: "Easy",
      description: "Create a 16:9 responsive box that keeps aspect ratio.",
      starterCode: `.video {\n  /* your code */\n}`,
      solution: `.video {\n  aspect-ratio: 16 / 9;\n  width: 100%;\n  background: #000;\n}`,
      testCases: [
        { input: "any width", expected: "height = width * 9/16" },
      ],
      hints: ["aspect-ratio property"],
      timeLimitSec: 60,
    },
    {
      id: "css6",
      title: "Skeleton Loading",
      difficulty: "Medium",
      description: "Create a shimmer skeleton animation for a loading card.",
      starterCode: `.skeleton {\n  /* your code */\n}`,
      solution: `.skeleton {\n  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);\n  background-size: 200% 100%;\n  animation: shimmer 1.5s infinite;\n}\n@keyframes shimmer {\n  0% { background-position: 200% 0; }\n  100% { background-position: -200% 0; }\n}`,
      testCases: [
        { input: "loading state", expected: "moving gradient" },
      ],
      hints: ["linear-gradient + animation"],
      timeLimitSec: 150,
    },
  ],

  sql: [
    {
      id: "sql1",
      title: "Basic SELECT with WHERE",
      difficulty: "Easy",
      description: "Select all users older than 25 ordered by name.",
      starterCode: `-- your query`,
      solution: `SELECT * FROM users WHERE age > 25 ORDER BY name;`,
      testCases: [
        { input: "users table", expected: "rows age > 25 sorted by name" },
      ],
      hints: ["WHERE + ORDER BY"],
      timeLimitSec: 60,
    },
    {
      id: "sql2",
      title: "JOIN Two Tables",
      difficulty: "Easy",
      description: "Get all orders with the customer name (INNER JOIN).",
      starterCode: `-- your query`,
      solution: `SELECT o.id, o.total, c.name\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id;`,
      testCases: [
        { input: "orders + customers", expected: "matched rows only" },
      ],
      hints: ["INNER JOIN ON"],
      timeLimitSec: 90,
    },
    {
      id: "sql3",
      title: "GROUP BY + HAVING",
      difficulty: "Medium",
      description: "Find departments with more than 5 employees.",
      starterCode: `-- your query`,
      solution: `SELECT department, COUNT(*) as emp_count\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 5;`,
      testCases: [
        { input: "employees", expected: "departments with count > 5" },
      ],
      hints: ["GROUP BY then HAVING"],
      timeLimitSec: 120,
    },
    {
      id: "sql4",
      title: "Window Function RANK",
      difficulty: "Hard",
      description: "Rank employees by salary within each department.",
      starterCode: `-- your query`,
      solution: `SELECT name, department, salary,\n       RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank\nFROM employees;`,
      testCases: [
        { input: "employees", expected: "rank resets per department" },
      ],
      hints: ["RANK() OVER (PARTITION BY ...)"],
      timeLimitSec: 180,
    },
    {
      id: "sql5",
      title: "Subquery vs CTE",
      difficulty: "Medium",
      description: "Find customers who placed more than the average number of orders (use CTE).",
      starterCode: `-- your query`,
      solution: `WITH order_counts AS (\n  SELECT customer_id, COUNT(*) as cnt\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT c.name, oc.cnt\nFROM customers c\nJOIN order_counts oc ON c.id = oc.customer_id\nWHERE oc.cnt > (SELECT AVG(cnt) FROM order_counts);`,
      testCases: [
        { input: "orders + customers", expected: "above-average customers" },
      ],
      hints: ["WITH ... AS"],
      timeLimitSec: 210,
    },
    {
      id: "sql6",
      title: "Upsert (INSERT ON CONFLICT)",
      difficulty: "Hard",
      description: "Insert a user or update the email if the username already exists (PostgreSQL).",
      starterCode: `-- your query`,
      solution: `INSERT INTO users (username, email)\nVALUES ('alice', 'alice@new.com')\nON CONFLICT (username)\nDO UPDATE SET email = EXCLUDED.email;`,
      testCases: [
        { input: "existing username", expected: "email updated" },
      ],
      hints: ["ON CONFLICT DO UPDATE"],
      timeLimitSec: 150,
    },
  ],

  go: [
    {
      id: "go1",
      title: "Hello + Variables",
      difficulty: "Easy",
      description: "Declare variables and print a greeting.",
      starterCode: `package main\n\nimport "fmt"\n\nfunc main() {\n  // your code\n}`,
      solution: `package main\n\nimport "fmt"\n\nfunc main() {\n  name := "Gopher"\n  fmt.Printf("Hello, %s!\\n", name)\n}`,
      testCases: [
        { input: "run", expected: "Hello, Gopher!" },
      ],
      hints: [":= short declaration"],
      timeLimitSec: 60,
    },
    {
      id: "go2",
      title: "Slice Operations",
      difficulty: "Easy",
      description: "Append and iterate over a slice of integers.",
      starterCode: `package main\n\nfunc main() {\n  // create slice, append, range\n}`,
      solution: `package main\n\nimport "fmt"\n\nfunc main() {\n  nums := []int{1, 2, 3}\n  nums = append(nums, 4, 5)\n  for i, v := range nums {\n    fmt.Println(i, v)\n  }\n}`,
      testCases: [
        { input: "run", expected: "0 1\\n1 2\\n..." },
      ],
      hints: ["append", "range"],
      timeLimitSec: 90,
    },
    {
      id: "go3",
      title: "Goroutine + Channel",
      difficulty: "Medium",
      description: "Send numbers 1-5 on a channel from a goroutine and receive them.",
      starterCode: `package main\n\nfunc main() {\n  // your code\n}`,
      solution: `package main\n\nimport "fmt"\n\nfunc main() {\n  ch := make(chan int)\n  go func() {\n    for i := 1; i <= 5; i++ {\n      ch <- i\n    }\n    close(ch)\n  }()\n  for v := range ch {\n    fmt.Println(v)\n  }\n}`,
      testCases: [
        { input: "run", expected: "1\\n2\\n3\\n4\\n5" },
      ],
      hints: ["make(chan int)", "close after send"],
      timeLimitSec: 150,
    },
    {
      id: "go4",
      title: "Error Handling",
      difficulty: "Medium",
      description: "Write a function that returns an error when input is negative.",
      starterCode: `package main\n\nfunc abs(n int) (int, error) {\n  // your code\n}`,
      solution: `package main\n\nimport "errors"\n\nfunc abs(n int) (int, error) {\n  if n < 0 {\n    return 0, errors.New("negative number")\n  }\n  return n, nil\n}`,
      testCases: [
        { input: "abs(-5)", expected: "error" },
        { input: "abs(5)", expected: "5, nil" },
      ],
      hints: ["multiple return values"],
      timeLimitSec: 120,
    },
    {
      id: "go5",
      title: "Struct + Method",
      difficulty: "Medium",
      description: "Define a Rectangle struct with an Area method.",
      starterCode: `package main\n\ntype Rectangle struct {\n  // fields\n}\n\nfunc (r Rectangle) Area() float64 {\n  // method\n}`,
      solution: `package main\n\ntype Rectangle struct {\n  Width, Height float64\n}\n\nfunc (r Rectangle) Area() float64 {\n  return r.Width * r.Height\n}`,
      testCases: [
        { input: "Rectangle{3,4}.Area()", expected: "12" },
      ],
      hints: ["receiver before method name"],
      timeLimitSec: 120,
    },
    {
      id: "go6",
      title: "Mutex Counter",
      difficulty: "Hard",
      description: "Safely increment a counter from multiple goroutines using sync.Mutex.",
      starterCode: `package main\n\nimport (\n  "sync"\n)\n\n// your code`,
      solution: `package main\n\nimport (\n  "fmt"\n  "sync"\n)\n\nfunc main() {\n  var mu sync.Mutex\n  var count int\n  var wg sync.WaitGroup\n  for i := 0; i < 1000; i++ {\n    wg.Add(1)\n    go func() {\n      defer wg.Done()\n      mu.Lock()\n      count++\n      mu.Unlock()\n    }()\n  }\n  wg.Wait()\n  fmt.Println(count) // 1000\n}`,
      testCases: [
        { input: "1000 goroutines", expected: "count == 1000" },
      ],
      hints: ["mu.Lock / Unlock", "WaitGroup"],
      timeLimitSec: 240,
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  CHEAT SHEETS & MENTAL MODELS                                              */
/* -------------------------------------------------------------------------- */

const CHEAT_SHEETS: Record<Language, { title: string; content: string }[]> = {
  javascript: [
    {
      title: "Array Methods Cheatsheet",
      content: `map     → transform each item\nfilter  → keep items that pass test\nreduce  → accumulate to single value\nfind    → first match\nsome    → any true?\nevery   → all true?\nflat    → flatten one level\nflatMap → map + flatten`,
    },
    {
      title: "Closures & Scope",
      content: `function outer() {\n  let count = 0;\n  return function inner() {\n    count++;          // remembers count\n    return count;\n  };\n}`,
    },
  ],
  typescript: [
    {
      title: "Utility Types",
      content: `Partial<T>     → all optional\nRequired<T>    → all required\nReadonly<T>    → all readonly\nPick<T,K>      → subset of keys\nOmit<T,K>      → exclude keys\nRecord<K,T>    → object type\nExclude<T,U>   → remove from union\nExtract<T,U>   → keep from union`,
    },
  ],
  python: [
    {
      title: "Comprehensions",
      content: `[x**2 for x in range(10) if x%2==0]   # list\n{x: x**2 for x in range(5)}           # dict\n{x for x in 'abracadabra'}            # set\n(x for x in range(10))                # generator`,
    },
  ],
  react: [
    {
      title: "Hooks Rules",
      content: `1. Only call Hooks at the top level\n2. Only call Hooks from React functions\n3. useState / useEffect dependencies matter\n4. Custom Hooks start with "use"`,
    },
  ],
  nodejs: [
    {
      title: "Async Patterns",
      content: `callbacks → error-first\npromises  → .then/.catch or async/await\nstreams   → readable / writable / transform\nevents    → EventEmitter`,
    },
  ],
  css: [
    {
      title: "Flexbox Quick Ref",
      content: `display: flex;\njustify-content: center | space-between | ...\nalign-items: center | stretch | ...\nflex-direction: row | column\ngap: 1rem;`,
    },
  ],
  sql: [
    {
      title: "JOIN Types",
      content: `INNER JOIN → only matching rows\nLEFT JOIN  → all left + matching right\nRIGHT JOIN → all right + matching left\nFULL JOIN  → all rows from both`,
    },
  ],
  go: [
    {
      title: "Concurrency Primitives",
      content: `go func() {}()     → start goroutine\nch := make(chan T) → unbuffered channel\nch := make(chan T, n) → buffered\nclose(ch)          → signal no more sends\nselect { case <-ch: } → multi-channel wait`,
    },
  ],
};

const KEY_REMINDERS: Record<Language, string[]> = {
  javascript: [
    "Always handle edge cases (empty, null, undefined)",
    "Prefer const, then let – never var",
    "=== over ==",
    "Array methods > manual loops when possible",
  ],
  typescript: [
    "Start with the types, then the implementation",
    "Use unknown instead of any when possible",
    "Discriminated unions are powerful",
  ],
  python: [
    "Indentation is syntax",
    "Prefer list comprehensions for simple transforms",
    "Use generators for large/infinite sequences",
  ],
  react: [
    "Never mutate state directly",
    "Keys must be stable and unique among siblings",
    "Cleanup side-effects in useEffect",
  ],
  nodejs: [
    "Always handle errors in async code",
    "Prefer streams for large data",
    "Avoid blocking the event loop",
  ],
  css: [
    "Mobile-first media queries",
    "Prefer logical properties (margin-inline)",
    "Use CSS variables for theming",
  ],
  sql: [
    "Filter early with WHERE before JOIN when possible",
    "Indexes matter for large tables",
    "Avoid SELECT * in production",
  ],
  go: [
    "Errors are values – check them",
    "Don’t communicate by sharing memory; share memory by communicating",
    "Keep interfaces small",
  ],
};

/* -------------------------------------------------------------------------- */
/*  COMPONENT                                                                 */
/* -------------------------------------------------------------------------- */

const LANGUAGES: { id: Language; label: string; color: string }[] = [
  { id: "javascript", label: "JavaScript", color: "bg-yellow-400" },
  { id: "typescript", label: "TypeScript", color: "bg-blue-500" },
  { id: "python", label: "Python", color: "bg-green-500" },
  { id: "react", label: "React", color: "bg-cyan-400" },
  { id: "nodejs", label: "Node.js", color: "bg-lime-500" },
  { id: "css", label: "CSS", color: "bg-pink-500" },
  { id: "sql", label: "SQL", color: "bg-orange-500" },
  { id: "go", label: "Go", color: "bg-sky-500" },
];

export default function CodeSpeedChallengePage() {
  const [selectedLang, setSelectedLang] = useState<Language>("javascript");
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [feedback, setFeedback] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showCheat, setShowCheat] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const startChallenge = (problem: Problem) => {
    setActiveProblem(problem);
    setCode(problem.starterCode);
    setStatus("idle");
    setFeedback("");
    setSeconds(0);
    setIsRunning(true);
    setShowSolution(false);
  };

  const reset = () => {
    if (activeProblem) {
      setCode(activeProblem.starterCode);
      setStatus("idle");
      setFeedback("");
      setSeconds(0);
      setIsRunning(true);
      setShowSolution(false);
    }
  };

  const checkSolution = useCallback(() => {
    if (!activeProblem) return;
    setStatus("running");

    // Very simple heuristic checker (in real app you would run in a sandbox)
    const normalizedUser = code.replace(/\s+/g, " ").trim().toLowerCase();
    const normalizedSol = activeProblem.solution.replace(/\s+/g, " ").trim().toLowerCase();

    // crude similarity + key phrases
    const keyPhrases = activeProblem.solution
      .split(/[\s\{\}\(\)\;\=]+/)
      .filter((w) => w.length > 3)
      .slice(0, 8);

    let score = 0;
    keyPhrases.forEach((p) => {
      if (normalizedUser.includes(p.toLowerCase())) score++;
    });

    const passed = score >= Math.ceil(keyPhrases.length * 0.6) || normalizedUser.includes(normalizedSol.slice(0, 40));

    setTimeout(() => {
      if (passed) {
        setStatus("passed");
        setFeedback(`Correct! Solved in ${seconds}s 🎉`);
        setCompleted((prev) => new Set(prev).add(activeProblem.id));
        setIsRunning(false);
      } else {
        setStatus("failed");
        setFeedback("Not quite right. Check the logic, edge cases, or try the hints.");
      }
    }, 600);
  }, [activeProblem, code, seconds]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const problems = PROBLEMS[selectedLang];
  const cheats = CHEAT_SHEETS[selectedLang] || [];
  const reminders = KEY_REMINDERS[selectedLang] || [];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* ================================================================ */}
      {/*  HEADER (your existing header already has the light/dark button) */}
      {/* ================================================================ */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
              <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Code Speed Challenge</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Train muscle memory • Beat the clock • Master the fundamentals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="font-medium">{completed.size} solved</span>
            </div>
            {/* Light/Dark toggle lives in your global header – this page just respects it */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ================================================================ */}
        {/*  LANGUAGE SELECTOR                                               */}
        {/* ================================================================ */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Choose Language / Framework
          </h2>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setSelectedLang(lang.id);
                  setActiveProblem(null);
                  setIsRunning(false);
                }}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all
                  border border-transparent
                  ${
                    selectedLang === lang.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  }
                `}
              >
                <span className={`inline-block w-2 h-2 rounded-full ${lang.color} mr-2`} />
                {lang.label}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ============================================================ */}
          {/*  LEFT – PROBLEM LIST + CHEATS                                */}
          {/* ============================================================ */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Problems */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-500" />
                <span className="font-semibold text-sm">Top 6 Challenges</span>
              </div>
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {problems.map((p, idx) => (
                  <li key={p.id}>
                    <button
                      onClick={() => startChallenge(p)}
                      className={`
                        w-full text-left px-4 py-3 hover:bg-white dark:hover:bg-slate-800/80 transition
                        flex items-start gap-3
                        ${activeProblem?.id === p.id ? "bg-white dark:bg-slate-800" : ""}
                      `}
                    >
                      <span className="text-xs font-mono text-slate-400 mt-0.5 w-5">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{p.title}</span>
                          {completed.has(p.id) && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`
                              text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded
                              ${
                                p.difficulty === "Easy"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                                  : p.difficulty === "Medium"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                                  : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
                              }
                            `}
                          >
                            {p.difficulty}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                            <Timer className="w-3 h-3" />
                            {p.timeLimitSec}s
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Reminders */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-amber-50 dark:bg-amber-950/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold text-sm">Keep in Mind</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {reminders.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-500">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cheat Sheets Toggle */}
            <button
              onClick={() => setShowCheat((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span className="font-semibold text-sm">Cheat Sheets & Diagrams</span>
              </div>
              <ChevronRight
                className={`w-4 h-4 transition-transform ${showCheat ? "rotate-90" : ""}`}
              />
            </button>

            {showCheat && (
              <div className="space-y-4">
                {cheats.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
                  >
                    <h4 className="font-semibold text-sm mb-2 text-indigo-600 dark:text-indigo-400">
                      {c.title}
                    </h4>
                    <pre className="text-xs font-mono whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                      {c.content}
                    </pre>
                  </div>
                ))}

                {/* Simple mental model diagram */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                  <h4 className="font-semibold text-sm mb-3 text-indigo-600 dark:text-indigo-400">
                    Mental Model – Call Stack
                  </h4>
                  <pre className="text-[11px] font-mono text-slate-600 dark:text-slate-400 leading-tight">
{`┌─────────────────────┐
│   Call Stack        │
├─────────────────────┤
│  main()             │
│    └─ foo()         │
│         └─ bar()    │  ← currently executing
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Event Loop         │
│  (macrotasks +      │
│   microtasks)       │
└─────────────────────┘`}
                  </pre>
                </div>
              </div>
            )}
          </aside>

          {/* ============================================================ */}
          {/*  RIGHT – EDITOR + RESULTS                                    */}
          {/* ============================================================ */}
          <section className="lg:col-span-8">
            {!activeProblem ? (
              <div className="h-full min-h-[480px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 text-center p-8">
                <Zap className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Pick a challenge to begin</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  Select any of the 6 most important problems on the left. A timer starts the moment
                  you open it. Write clean, correct code as fast as you can.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Problem header */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">{activeProblem.title}</h2>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {activeProblem.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeProblem.hints.map((h, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                          >
                            💡 {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-sm font-semibold
                          ${
                            seconds > activeProblem.timeLimitSec
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                          }
                        `}
                      >
                        <Timer className="w-4 h-4" />
                        {formatTime(seconds)}
                      </div>
                      <button
                        onClick={reset}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Reset"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Editor */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-900">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-800 text-slate-300 text-xs">
                    <span className="font-mono">{selectedLang}.{selectedLang === "python" ? "py" : selectedLang === "sql" ? "sql" : "js"}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowSolution((v) => !v)}
                        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-700 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {showSolution ? "Hide" : "Show"} Solution
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={showSolution ? activeProblem.solution : code}
                    onChange={(e) => !showSolution && setCode(e.target.value)}
                    spellCheck={false}
                    className="w-full h-72 p-4 bg-slate-900 text-green-400 font-mono text-sm leading-relaxed resize-y focus:outline-none"
                    style={{ tabSize: 2 }}
                    readOnly={showSolution}
                  />
                </div>

                {/* Actions + Feedback */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={checkSolution}
                    disabled={status === "running" || showSolution}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    {status === "running" ? "Checking…" : "Run & Check"}
                  </button>

                  {status === "passed" && (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-5 h-5" />
                      {feedback}
                    </div>
                  )}
                  {status === "failed" && (
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium">
                      <XCircle className="w-5 h-5" />
                      {feedback}
                    </div>
                  )}
                </div>

                {/* Test cases preview */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Sample Test Cases
                  </h4>
                  <div className="space-y-2">
                    {activeProblem.testCases.map((tc, i) => (
                      <div key={i} className="text-sm font-mono flex flex-wrap gap-x-4 gap-y-1">
                        <span className="text-slate-500">Input:</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{tc.input}</span>
                        <span className="text-slate-500">→</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{tc.expected}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer tip */}
      <footer className="max-w-7xl mx-auto px-4 py-8 text-center text-xs text-slate-400">
        Keep Coding, Keep Creating ..❤️..
      </footer>
    </div>
  );
}