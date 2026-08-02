"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Sparkles,
  Terminal,
  Hash,
  ArrowRight,
  ArrowUpRight,
  ListTree,
  Check,
  Copy,
  Download,
  CheckCircle2,
} from "lucide-react";

/**
 * app/category/python/page.tsx
 * -----------------------------
 * The Python learning hub for CodeNFacts. A left-hand table of contents
 * tracks scroll position against 20 core topics; the right column holds
 * a short explanation, a couple of "good to know" points, and a
 * hand-highlighted code example for each one.
 *
 * Design intentionally reuses the terminal/IDE language established in
 * WanttolearnfromAi.tsx (slate + emerald, mono accents, macOS-style
 * traffic-light window chrome) so this page feels native to the rest
 * of the product rather than like a bolted-on docs site.
 *
 * Theming: code + output panels now flip between a light "paper"
 * terminal (#f7f8fa panel, dark ink text, brass/amber-leaning token
 * colors) and a dark terminal (#0d1117-ish panel, emerald accents) so
 * examples stay legible in both modes instead of assuming a dark bg.
 */

// ---------------------------------------------------------------------------
// Topic data
// ---------------------------------------------------------------------------

interface PyTopic {
  id: string;
  number: string;
  title: string;
  summary: string;
  points: string[];
  code: string;
  output?: string;
}

const topics: PyTopic[] = [
  {
    id: "intro-syntax",
    number: "01",
    title: "Introduction & Syntax",
    summary:
      "Python reads close to plain English on purpose. There are no curly braces or semicolons — indentation itself defines where a block of code starts and ends, so whitespace is not a style choice, it's syntax.",
    points: [
      "A standard 4-space indent is the convention almost every codebase follows.",
      "Comments start with # and run to the end of the line.",
      "print() writes to the console and is usually the first function anyone learns.",
    ],
    code: `# This is a comment — Python ignores everything after '#'
print("Hello, CodeNFacts!")

if True:
    print("This line is indented, so it's inside the if-block")
print("This line is not indented, so it runs regardless")`,
    output: `Hello, CodeNFacts!
This line is indented, so it's inside the if-block
This line is not indented, so it runs regardless`,
  },
  {
    id: "variables-types",
    number: "02",
    title: "Variables & Data Types",
    summary:
      "A variable is just a name pointing at a value in memory. Python is dynamically typed, meaning you never declare a type up front — the type is decided by whatever value you assign, and it can change later.",
    points: [
      "Core built-in types: int, float, str, bool, and None (Python's 'nothing' value).",
      "type(x) tells you what a variable currently holds.",
      "Reassigning a variable to a new type is completely legal.",
    ],
    code: `age = 25          # int
price = 9.99      # float
name = "Ada"      # str
is_active = True  # bool
result = None     # None — represents 'no value'

print(type(age), type(price), type(name))

age = "twenty-five"  # totally legal, age is now a str
print(age)`,
    output: `<class 'int'> <class 'float'> <class 'str'>
twenty-five`,
  },
  {
    id: "operators",
    number: "03",
    title: "Operators",
    summary:
      "Operators combine values into new ones. Python groups them into arithmetic (math), comparison (produces True/False), logical (combines booleans), and assignment (stores a result back into a variable).",
    points: [
      "// is floor (integer) division; ** is exponentiation.",
      "Comparisons like ==, !=, <, > always return a bool.",
      "and, or, not work on booleans — and short-circuit for efficiency.",
    ],
    code: `a, b = 10, 3

print(a + b, a - b, a * b)   # 13 7 30
print(a / b)                 # 3.3333333333333335 (true division)
print(a // b, a % b, a ** b) # 3 1 1000

print(a > b and b > 0)       # True
print(a == 10 or b == 99)    # True`,
    output: `13 7 30
3.3333333333333335
3 1 1000
True
True`,
  },
  {
    id: "strings",
    number: "04",
    title: "Strings",
    summary:
      "Strings are ordered, immutable sequences of characters, which means slicing and indexing work like they do on lists — but every 'edit' actually produces a brand-new string rather than modifying the original.",
    points: [
      "f-strings (f\"...\") are the cleanest way to embed variables in text.",
      "Negative indices count from the end: s[-1] is the last character.",
      "Common methods: .upper(), .lower(), .strip(), .split(), .replace(), .join().",
    ],
    code: `name = "codenfacts"

print(name.upper())          # CODENFACTS
print(name[0], name[-1])     # c s
print(name[:4])              # code
print(name.replace("code", "learn"))

age = 5
print(f"{name} is {age} years old")

words = "python is fun".split(" ")
print(words)                 # ['python', 'is', 'fun']
print("-".join(words))       # python-is-fun`,
    output: `CODENFACTS
c s
code
learnnfacts
codenfacts is 5 years old
['python', 'is', 'fun']
python-is-fun`,
  },
  {
    id: "lists",
    number: "05",
    title: "Lists",
    summary:
      "A list is an ordered, mutable collection — you can add, remove, and change items after creation, and it can hold a mix of types. It's the workhorse data structure for 'a bunch of things' in Python.",
    points: [
      "Indexing and slicing work exactly like strings: list[0], list[-1], list[1:3].",
      ".append() adds one item; .extend() merges another list in.",
      "List comprehensions (see topic 13) are the idiomatic way to build lists from other data.",
    ],
    code: `fruits = ["apple", "banana", "cherry"]

fruits.append("date")
print(fruits)              # ['apple', 'banana', 'cherry', 'date']

fruits[1] = "blueberry"
print(fruits[0:2])         # ['apple', 'blueberry']

fruits.remove("cherry")
print(len(fruits))         # 3
print("apple" in fruits)   # True`,
    output: `['apple', 'banana', 'cherry', 'date']
['apple', 'blueberry']
3
True`,
  },
  {
    id: "tuples",
    number: "06",
    title: "Tuples",
    summary:
      "A tuple looks like a list but is immutable — once created, it can't be changed. That makes tuples a good fit for fixed groups of values, like coordinates, and for dictionary keys, which must be hashable.",
    points: [
      "Written with parentheses: point = (3, 4).",
      "Unpacking lets you assign each element to a variable in one line.",
      "Trying to modify a tuple raises a TypeError.",
    ],
    code: `point = (3, 4)
x, y = point          # unpacking
print(x, y)            # 3 4

coordinates = (0, 0), (1, 1), (2, 4)
for cx, cy in coordinates:
    print(f"({cx}, {cy})")

# point[0] = 9  # would raise: TypeError: 'tuple' object does not support item assignment`,
    output: `3 4
(0, 0)
(1, 1)
(2, 4)`,
  },
  {
    id: "dictionaries",
    number: "07",
    title: "Dictionaries",
    summary:
      "A dictionary stores key-value pairs, giving you near-instant lookup by key instead of scanning by position. As of Python 3.7+, dictionaries also remember insertion order.",
    points: [
      "Access with square brackets: user['name']; use .get() to avoid a KeyError.",
      ".keys(), .values(), and .items() let you iterate different views of the data.",
      "Keys must be immutable (strings, numbers, tuples) — lists can't be keys.",
    ],
    code: `user = {"name": "Ada", "age": 30, "role": "engineer"}

print(user["name"])               # Ada
print(user.get("email", "n/a"))    # n/a — no KeyError

user["email"] = "ada@codenfacts.dev"
for key, value in user.items():
    print(f"{key}: {value}")`,
    output: `Ada
n/a
name: Ada
age: 30
role: engineer
email: ada@codenfacts.dev`,
  },
  {
    id: "sets",
    number: "08",
    title: "Sets",
    summary:
      "A set is an unordered collection of unique values — duplicates are automatically dropped. Sets are built for membership testing and for the classic math operations: union, intersection, and difference.",
    points: [
      "Create with {1, 2, 3} or set() for an empty one (not {} — that's a dict).",
      "in checks are O(1) on average, much faster than checking a list.",
      "| is union, & is intersection, - is difference.",
    ],
    code: `a = {1, 2, 3, 3, 2}
print(a)                 # {1, 2, 3} — duplicates removed

b = {3, 4, 5}
print(a | b)              # {1, 2, 3, 4, 5}  union
print(a & b)              # {3}              intersection
print(a - b)              # {1, 2}           difference

print(2 in a)             # True`,
    output: `{1, 2, 3}
{1, 2, 3, 4, 5}
{3}
{1, 2}
True`,
  },
  {
    id: "conditionals",
    number: "09",
    title: "Conditionals",
    summary:
      "if / elif / else routes your program down different paths depending on a condition. Python evaluates conditions top to bottom and runs the first block whose condition is True, skipping the rest.",
    points: [
      "elif chains let you check several conditions without nesting.",
      "Any non-empty string, non-zero number, or non-empty collection is 'truthy'.",
      "A one-line conditional expression exists too: 'even' if n % 2 == 0 else 'odd'.",
    ],
    code: `score = 82

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(grade)  # B

label = "even" if score % 2 == 0 else "odd"
print(label)  # even`,
    output: `B
even`,
  },
  {
    id: "loops",
    number: "10",
    title: "Loops",
    summary:
      "for loops iterate over a sequence (a list, string, range, etc.) item by item. while loops repeat as long as a condition stays True. break exits a loop early; continue skips to the next iteration.",
    points: [
      "range(start, stop, step) is the classic way to loop a fixed number of times.",
      "enumerate() gives you both the index and the value while looping.",
      "A while True loop with an internal break is common for 'repeat until' logic.",
    ],
    code: `for i in range(3):
    print("count:", i)

fruits = ["apple", "banana", "cherry"]
for index, fruit in enumerate(fruits):
    print(index, fruit)

n = 0
while n < 5:
    if n == 3:
        break
    print("n is", n)
    n += 1`,
    output: `count: 0
count: 1
count: 2
0 apple
1 banana
2 cherry
n is 0
n is 1
n is 2`,
  },
  {
    id: "functions",
    number: "11",
    title: "Functions",
    summary:
      "A function packages a block of logic under a name so you can call it instead of repeating code. def defines it, parameters receive input, and return sends a value back to whoever called it.",
    points: [
      "Parameters can have default values: def greet(name=\"friend\").",
      "*args collects extra positional arguments; **kwargs collects extra keyword arguments.",
      "A function with no return statement implicitly returns None.",
    ],
    code: `def greet(name="friend"):
    return f"Hello, {name}!"

print(greet())            # Hello, friend!
print(greet("Ada"))       # Hello, Ada!

def total(*numbers):
    return sum(numbers)

print(total(1, 2, 3, 4))  # 10

def describe(**details):
    for key, value in details.items():
        print(f"{key}: {value}")

describe(name="Ada", role="engineer")`,
    output: `Hello, friend!
Hello, Ada!
10
name: Ada
role: engineer`,
  },
  {
    id: "lambdas",
    number: "12",
    title: "Lambda Functions",
    summary:
      "A lambda is a small, unnamed function written in a single expression — no def, no return keyword, just input in, value out. They're most useful as a quick throwaway function passed into something like sorted() or map().",
    points: [
      "Syntax: lambda arguments: expression.",
      "Best kept to one line; anything more complex should be a real def function.",
      "Commonly paired with sorted(key=...), map(), and filter().",
    ],
    code: `square = lambda x: x * x
print(square(5))   # 25

people = [("Ada", 30), ("Bo", 25), ("Cy", 40)]
people.sort(key=lambda person: person[1])
print(people)       # sorted by age

nums = [1, 2, 3, 4, 5]
evens = list(filter(lambda n: n % 2 == 0, nums))
print(evens)        # [2, 4]`,
    output: `25
[('Bo', 25), ('Ada', 30), ('Cy', 40)]
[2, 4]`,
  },
  {
    id: "comprehensions",
    number: "13",
    title: "List Comprehensions",
    summary:
      "A comprehension builds a new list from an existing iterable in one readable line, replacing the common pattern of creating an empty list and appending to it inside a for loop.",
    points: [
      "Basic form: [expression for item in iterable].",
      "Add a condition to filter: [x for x in items if x > 0].",
      "The same pattern works for dicts {k: v for ...} and sets {x for ...}.",
    ],
    code: `squares = [n * n for n in range(6)]
print(squares)                        # [0, 1, 4, 9, 16, 25]

evens = [n for n in range(10) if n % 2 == 0]
print(evens)                          # [0, 2, 4, 6, 8]

names = ["ada", "bo", "cy"]
capitalized = {name: name.title() for name in names}
print(capitalized)`,
    output: `[0, 1, 4, 9, 16, 25]
[0, 2, 4, 6, 8]
{'ada': 'Ada', 'bo': 'Bo', 'cy': 'Cy'}`,
  },
  {
    id: "classes-oop",
    number: "14",
    title: "Classes & OOP",
    summary:
      "A class is a blueprint for creating objects that bundle data (attributes) with behavior (methods). __init__ runs automatically when a new instance is created, and self refers to the specific instance a method is being called on.",
    points: [
      "Every instance method's first parameter is self by convention.",
      "Attributes set in __init__ (like self.name) belong to that specific object.",
      "__str__ controls what print(instance) actually displays.",
    ],
    code: `class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed

    def bark(self):
        return f"{self.name} says woof!"

    def __str__(self):
        return f"Dog({self.name}, {self.breed})"

rex = Dog("Rex", "Labrador")
print(rex.bark())   # Rex says woof!
print(rex)           # Dog(Rex, Labrador)`,
    output: `Rex says woof!
Dog(Rex, Labrador)`,
  },
  {
    id: "inheritance",
    number: "15",
    title: "Inheritance",
    summary:
      "Inheritance lets a class reuse and extend another class's behavior. The child class inherits every attribute and method from the parent, and can override any of them or add new ones of its own.",
    points: [
      "Syntax: class Child(Parent):.",
      "super().__init__(...) calls the parent's constructor from the child.",
      "isinstance(obj, ParentClass) is True for instances of any subclass too.",
    ],
    code: `class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} makes a sound"

class Cat(Animal):
    def speak(self):  # override
        return f"{self.name} says meow"

class Puppy(Animal):
    def __init__(self, name, age):
        super().__init__(name)
        self.age = age

whiskers = Cat("Whiskers")
print(whiskers.speak())        # Whiskers says meow
print(isinstance(whiskers, Animal))  # True`,
    output: `Whiskers says meow
True`,
  },
  {
    id: "exceptions",
    number: "16",
    title: "Exception Handling",
    summary:
      "try/except lets your program recover from an error instead of crashing outright. Python raises a specific exception type for each kind of failure, and you can catch that exact type — or several — to handle it gracefully.",
    points: [
      "else runs only if the try block succeeded; finally always runs, error or not.",
      "Catch specific exceptions (ValueError, KeyError) rather than a bare except when possible.",
      "raise lets you trigger your own exception, including custom ones.",
    ],
    code: `def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Can't divide by zero!")
        return None
    else:
        print("Division succeeded")
        return result
    finally:
        print("Done attempting division")

print(divide(10, 2))
print(divide(10, 0))`,
    output: `Division succeeded
Done attempting division
5.0
Can't divide by zero!
Done attempting division
None`,
  },
  {
    id: "file-handling",
    number: "17",
    title: "File Handling",
    summary:
      "open() is how Python reads and writes files. Using it with the with statement is the standard practice — it guarantees the file is closed automatically once the block ends, even if an error happens inside it.",
    points: [
      "Modes: 'r' read, 'w' write (overwrites), 'a' append, 'x' create-only.",
      "with open(...) as f: closes the file for you — no manual f.close() needed.",
      ".readlines() and iterating the file object both give you line-by-line access.",
    ],
    code: `# Writing to a file
with open("notes.txt", "w") as f:
    f.write("Learning Python with CodeNFacts\\n")
    f.write("File handling is straightforward\\n")

# Reading it back
with open("notes.txt", "r") as f:
    for line in f:
        print(line.strip())`,
    output: `Learning Python with CodeNFacts
File handling is straightforward`,
  },
  {
    id: "modules",
    number: "18",
    title: "Modules & Imports",
    summary:
      "A module is just a .py file, and import is how you pull functions, classes, or variables from one file into another. Python also ships a large standard library of modules for common tasks like math, dates, and randomness.",
    points: [
      "import module then module.function() — or from module import function to call it directly.",
      "as gives an imported module a shorter alias, like import numpy as np.",
      "if __name__ == \"__main__\": guards code that should only run when the file is executed directly.",
    ],
    code: `import math
from datetime import date
import random as rnd

print(math.sqrt(16))          # 4.0
print(date.today().year)       # e.g. 2026
print(rnd.choice(["a", "b", "c"]))

# my_module.py
def helper():
    return "I'm reusable!"

if __name__ == "__main__":
    print(helper())`,
    output: `4.0
2026
b
I'm reusable!`,
  },
  {
    id: "decorators",
    number: "19",
    title: "Decorators",
    summary:
      "A decorator is a function that wraps another function to add behavior — like logging or timing — without changing the original function's code. The @decorator_name syntax above a function is just shorthand for passing that function into the decorator.",
    points: [
      "A decorator takes a function in and returns a new function out.",
      "*args, **kwargs in the wrapper let it decorate any function, regardless of its signature.",
      "functools.wraps preserves the original function's name and docstring (worth knowing, easy to skip at first).",
    ],
    code: `def log_call(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} finished")
        return result
    return wrapper

@log_call
def add(a, b):
    return a + b

print(add(2, 3))`,
    output: `Calling add
add finished
5`,
  },
  {
    id: "generators",
    number: "20",
    title: "Generators",
    summary:
      "A generator produces values one at a time, on demand, instead of building an entire list in memory up front. Any function using yield instead of return becomes a generator — it pauses at each yield and resumes right where it left off on the next call.",
    points: [
      "yield pauses the function and hands back a value; next() resumes it.",
      "Generators are memory-efficient for large or infinite sequences.",
      "A generator expression looks like a list comprehension with () instead of [].",
    ],
    code: `def countdown(n):
    while n > 0:
        yield n
        n -= 1

for num in countdown(3):
    print(num)

squares = (n * n for n in range(5))  # generator expression
print(next(squares))  # 0
print(next(squares))  # 1
print(list(squares))  # [4, 9, 16] — remaining values`,
    output: `3
2
1
0
1
[4, 9, 16]`,
  },
];

// ---------------------------------------------------------------------------
// Lightweight Python syntax highlighting (no external deps)
// ---------------------------------------------------------------------------

const TOKEN_PATTERN =
  /(#.*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(def|class|return|if|elif|else|for|while|in|import|from|as|try|except|finally|raise|with|lambda|not|and|or|is|None|True|False|pass|break|continue|yield|global|nonlocal|assert|del|self)\b|\b(\d+\.?\d*)\b|\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\()/g;

// Token colors are tuned as light/dark pairs so contrast holds up against
// both the light "paper" terminal panel and the dark terminal panel.
function highlightLine(line: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let idx = 0;
  const pattern = new RegExp(TOKEN_PATTERN.source, "g");
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    const [full, comment, str, keyword, num, fn] = match;
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }
    let className = "text-slate-800 dark:text-slate-200";
    if (comment) className = "text-slate-500 dark:text-slate-500 italic";
    else if (str) className = "text-amber-700 dark:text-amber-400";
    else if (keyword) className = "text-emerald-700 dark:text-emerald-400 font-medium";
    else if (num) className = "text-sky-700 dark:text-sky-400";
    else if (fn) className = "text-purple-700 dark:text-purple-400";

    nodes.push(
      <span key={`${keyPrefix}-${idx++}`} className={className}>
        {full}
      </span>
    );
    lastIndex = match.index + full.length;
  }
  if (lastIndex < line.length) nodes.push(line.slice(lastIndex));
  if (nodes.length === 0) nodes.push("\u00A0");
  return nodes;
}

// ---------------------------------------------------------------------------
// Code block component
// ---------------------------------------------------------------------------

function CodeBlock({ code, filename = "example.py" }: { code: string; filename?: string }) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — fail silently
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f7f8fa] dark:bg-[#0d1117] overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2">
        <span className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
          <Terminal className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500" />
          {filename}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed font-mono">
        <code>
          {lines.map((line, i) => (
            <div key={i}>{highlightLine(line, `l${i}`)}</div>
          ))}
        </code>
      </pre>
    </div>
  );
}

function OutputBlock({ output }: { output: string }) {
  const lines = output.split("\n");
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-1.5 text-[11px] font-mono uppercase tracking-wide text-slate-400 dark:text-slate-500">
        output
      </div>
      <pre className="px-4 py-3 text-[13px] leading-relaxed font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i}>{line || "\u00A0"}</div>
        ))}
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notes download helper
// ---------------------------------------------------------------------------

// Served from /public/downloads/python-notes.pdf — drop the PDF file there.
const NOTES_PDF_PATH = "/downloads/python-notes.pdf";

type DownloadStatus = "idle" | "downloading" | "done";

function DownloadNotesButton() {
  const [status, setStatus] = useState<DownloadStatus>("idle");

  const handleDownload = () => {
    if (status === "downloading") return;

    setStatus("downloading");

    // Give the "downloading" toast a beat on screen, then send the browser
    // to the static PDF in /public/downloads — no blob generation, this is
    // a real file redirect/download from the public folder.
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = NOTES_PDF_PATH;
      link.download = "CodeNFacts-Python-Notes.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatus("done");
      setTimeout(() => setStatus("idle"), 3400);
    }, 900);
  };

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={status === "downloading"}
        className="group inline-flex items-center rounded-full border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 px-7 py-3.5 font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <Download className="h-4 w-4 mr-2 transition-transform group-hover:-translate-y-0.5" />
        Download Python Notes
      </button>

      {/* Toast */}
      <div
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          status === "idle"
            ? "opacity-0 translate-y-3 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
      >
        <div className="flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 shadow-lg shadow-slate-900/10 dark:shadow-black/40">
          {status === "downloading" ? (
            <>
              <span className="h-3.5 w-3.5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Downloading Python notes…
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Thanks for downloading ! Happy learning ..❤️..
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PythonCategoryPage() {
  const [activeId, setActiveId] = useState(topics[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const totalExamples = useMemo(() => topics.length, []);

  return (
    <main className="w-full bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero */}
      <section className="relative border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-1.5 text-sm font-normal text-slate-600 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              Python · {totalExamples} core topics
            </span>
          </div>
          <h1 className="text-center text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Learn{" "}
            <span className="text-emerald-600 dark:text-emerald-400">Python</span>{" "}
            from the ground up
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base sm:text-lg font-normal text-slate-500 dark:text-slate-400">
            Every core concept explained in plain language, with a runnable
            example and its actual output — no filler, just what you need to
            go from syntax to confident code.
          </p>
          <div className="mt-8 flex justify-center">
            <DownloadNotesButton />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-8 py-12">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-12">
          {/* Sticky table of contents */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono font-normal text-slate-400 dark:text-slate-500">
                <ListTree className="h-3.5 w-3.5 text-emerald-500" />
                on this page
              </div>
              <nav className="border-l border-slate-200 dark:border-slate-700 max-h-[70vh] overflow-y-auto pr-2">
                {topics.map((t) => {
                  const isActive = t.id === activeId;
                  return (
                    <a
                      key={t.id}
                      href={`#${t.id}`}
                      className={`block border-l-2 -ml-px pl-4 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "border-emerald-500 text-emerald-700 dark:text-emerald-300 font-medium"
                          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-500/50"
                      }`}
                    >
                      <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 mr-1.5">
                        {t.number}
                      </span>
                      {t.title}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Topics */}
          <div className="lg:col-span-9 space-y-16">
            {topics.map((topic) => (
              <article
                key={topic.id}
                id={topic.id}
                ref={(el) => {
                  sectionRefs.current[topic.id] = el;
                }}
                className="scroll-mt-8"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-sm text-emerald-500">
                    {topic.number}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                    {topic.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base font-normal text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {topic.summary}
                </p>

                <ul className="mb-5 space-y-1.5">
                  {topic.points.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm font-normal text-slate-500 dark:text-slate-400"
                    >
                      <Hash className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-emerald-500" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="grid gap-3 sm:grid-cols-1">
                  <CodeBlock code={topic.code} filename={`${topic.id}.py`} />
                  {topic.output && <OutputBlock output={topic.output} />}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Ready to go deeper?
          </h3>
          <p className="mt-3 text-slate-500 dark:text-slate-400 font-normal">
            Ask the AI tutor any Python question and get a step-by-step
            walkthrough, live.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/learning-ai"
              className="group inline-flex items-center rounded-full bg-emerald-600 dark:bg-emerald-500 px-7 py-3.5 font-semibold text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors"
            >
              Ask the AI tutor
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/courses"
              className="group inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300 transition-colors"
            >
              Browse other categories
              <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
            <DownloadNotesButton />
          </div>
        </div>
      </section>
    </main>
  );
}