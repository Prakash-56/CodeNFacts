"use client";

import { useState, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Terminal,
  Code2,
  Cpu,
  Globe,
  Lightbulb,
  History,
  ListChecks,
  Download,
  Layers,
  Zap,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  Sparkles,
  GitBranch,
  Brain,
  Rocket,
  Target,
  Clock,
  Award,
  Search,
  Copy,
  Check,
  XCircle,
  Flame,
  Puzzle,
  BrainCircuit,
  Component,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" },
  }),
};


// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const show = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };
  return { toast, show };
}

// ---------------------------------------------------------------------------
// Terminal chrome wrapper — matches the site-wide panel aesthetic
// ---------------------------------------------------------------------------
function TerminalPanel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1117] shadow-sm overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-[#f7f8fa] dark:bg-[#0a0e14]">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-xs font-mono text-gray-500 dark:text-gray-400 truncate">
          {title}
        </span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

function SectionEyebrow({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-amber-200 dark:border-emerald-900 bg-amber-50 dark:bg-emerald-950/40">
      <Icon className="w-3.5 h-3.5 text-amber-600 dark:text-emerald-400" />
      <span className="text-xs font-mono tracking-wide text-amber-700 dark:text-emerald-400 uppercase">
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const historyMilestones = [
  {
    year: "1843",
    title: "The first algorithm",
    who: "Ada Lovelace",
    detail:
      "While translating notes on Charles Babbage's Analytical Engine, Ada Lovelace wrote a method for calculating Bernoulli numbers — widely regarded as the first published algorithm meant for a machine, making her the first programmer, decades before computers existed.",
  },
  {
    year: "1936",
    title: "The theoretical foundation",
    who: "Alan Turing",
    detail:
      "Alan Turing described the 'Turing Machine,' a mathematical model of computation that defined what it means for a problem to be 'computable.' It's the theoretical bedrock every programming language still stands on.",
  },
  {
    year: "1957",
    title: "FORTRAN — the first high-level language",
    who: "John Backus & IBM",
    detail:
      "FORTRAN (Formula Translation) let scientists write math-like instructions instead of raw machine code, cutting programming time drastically and kicking off the era of compiled high-level languages.",
  },
  {
    year: "1959",
    title: "COBOL for business",
    who: "Grace Hopper (concept) & CODASYL committee",
    detail:
      "Grace Hopper's earlier work on the A-0 compiler inspired COBOL, a language built for business, finance, and administrative systems — some of it is still running in banks today.",
  },
  {
    year: "1972",
    title: "C is born",
    who: "Dennis Ritchie, Bell Labs",
    detail:
      "C gave programmers close-to-hardware control with a readable syntax. It became the language most operating systems, including Unix and later Linux and Windows components, were built on.",
  },
  {
    year: "1983",
    title: "C++ arrives",
    who: "Bjarne Stroustrup",
    detail:
      "C++ added object-oriented programming on top of C, enabling large, structured software systems — from game engines to trading platforms.",
  },
  {
    year: "1991",
    title: "Python",
    who: "Guido van Rossum",
    detail:
      "Designed for readability, Python's philosophy of 'one obvious way to do it' made it the language of choice decades later for data science, AI, and scripting.",
  },
  {
    year: "1995",
    title: "Java & JavaScript, same year",
    who: "James Gosling (Java) · Brendan Eich (JavaScript)",
    detail:
      "Java promised 'write once, run anywhere' for enterprise software. JavaScript, written in just 10 days, became the only language that runs natively in every web browser.",
  },
  {
    year: "2009",
    title: "Go",
    who: "Rob Pike, Ken Thompson, Robert Griesemer @ Google",
    detail:
      "Built for simplicity and concurrency at internet scale, Go became the backbone of cloud infrastructure tools like Docker and Kubernetes.",
  },
  {
    year: "2010",
    title: "Rust",
    who: "Graydon Hoare @ Mozilla",
    detail:
      "Rust guarantees memory safety without a garbage collector, giving C-level performance with far fewer crashes — now used in browsers, OS kernels, and embedded systems.",
  },
  {
    year: "2014",
    title: "Swift",
    who: "Chris Lattner @ Apple",
    detail:
      "Apple's replacement for Objective-C, designed to be safer and friendlier for building iOS and macOS apps.",
  },
];

type LangRow = {
  name: string;
  creator: string;
  year: string;
  known: string;
};

const topLanguages: LangRow[] = [
  { name: "Python", creator: "Guido van Rossum", year: "1991", known: "AI/ML, data science, scripting, backend" },
  { name: "JavaScript", creator: "Brendan Eich", year: "1995", known: "Web front-end, full-stack (Node.js)" },
  { name: "TypeScript", creator: "Microsoft / Anders Hejlsberg", year: "2012", known: "Typed JavaScript for large apps" },
  { name: "Java", creator: "James Gosling", year: "1995", known: "Enterprise systems, Android apps" },
  { name: "C", creator: "Dennis Ritchie", year: "1972", known: "Operating systems, embedded, low-level" },
  { name: "C++", creator: "Bjarne Stroustrup", year: "1983", known: "Game engines, systems, performance-critical apps" },
  { name: "C#", creator: "Anders Hejlsberg / Microsoft", year: "2000", known: "Windows apps, Unity games, enterprise" },
  { name: "Go", creator: "Pike, Thompson, Griesemer", year: "2009", known: "Cloud infra, microservices, DevOps tools" },
  { name: "Rust", creator: "Graydon Hoare", year: "2010", known: "Systems programming, safety-critical software" },
  { name: "Kotlin", creator: "JetBrains", year: "2011", known: "Modern Android development" },
  { name: "Swift", creator: "Chris Lattner / Apple", year: "2014", known: "iOS, macOS apps" },
  { name: "PHP", creator: "Rasmus Lerdorf", year: "1994", known: "Server-side web (WordPress, Laravel)" },
  { name: "Ruby", creator: "Yukihiro Matsumoto", year: "1995", known: "Web apps (Ruby on Rails)" },
  { name: "SQL", creator: "Donald D. Chamberlin & Raymond F. Boyce", year: "1974", known: "Querying and managing databases" },
  { name: "R", creator: "Ross Ihaka & Robert Gentleman", year: "1993", known: "Statistics, data analysis" },
];

const allLanguages = [
  "Ada", "ALGOL", "APL", "Assembly", "AWK", "Ballerina", "Bash", "BASIC", "C",
  "C#", "C++", "Clojure", "COBOL", "CoffeeScript", "Crystal", "Cython", "D",
  "Dart", "Delphi (Object Pascal)", "Elixir", "Elm", "Erlang", "F#", "Forth",
  "FORTRAN", "Go", "Groovy", "Haskell", "Haxe", "HTML/CSS (markup)", "Java",
  "JavaScript", "Julia", "Kotlin", "LabVIEW (G)", "Lisp", "Lua", "MATLAB",
  "Nim", "Objective-C", "OCaml", "Pascal", "Perl", "PHP", "PL/SQL", "PowerShell",
  "Prolog", "Python", "R", "Racket", "Ruby", "Rust", "Scala", "Scheme",
  "Scratch", "Shell (sh/zsh)", "Smalltalk", "Solidity", "SQL", "Swift", "Tcl",
  "TypeScript", "V", "Verilog", "VHDL", "Visual Basic .NET", "WebAssembly (WAT)",
  "Zig",
];

const whatIfNot = [
  {
    icon: Globe,
    title: "No internet as you know it",
    detail:
      "No websites, no search engines, no maps, no video calls — the web itself is built from code.",
  },
  {
    icon: Cpu,
    title: "No modern devices",
    detail:
      "Phones, laptops, cars, ATMs, planes, and even microwaves run on embedded software. Without programming they're just inert metal and plastic.",
  },
  {
    icon: TrendingUp,
    title: "No automation",
    detail:
      "Every task — payroll, hospital records, flight scheduling, factory lines — would be manual, slower, and far more error-prone.",
  },
  {
    icon: Brain,
    title: "No AI, no data-driven decisions",
    detail:
      "Recommendation systems, medical diagnosis models, fraud detection, translation tools — all of it depends on code that processes data at a scale humans can't.",
  },
];

const whyNeededNow = [
  "Every industry — healthcare, finance, agriculture, entertainment — now runs partly on software, so understanding code is closer to a literacy skill than a niche one.",
  "Automation and AI are reshaping jobs; the people who can build or adapt tools tend to shape the change instead of just reacting to it.",
  "Startups and small teams can now build products that once needed entire departments, because a handful of programmers with the right tools can move fast.",
  "Remote, global, well-paid opportunities are unusually accessible in software compared to many other fields.",
  "Even outside 'tech' jobs, scripting and automation skills save enormous time in day-to-day work — spreadsheets, reports, data cleanup.",
];

const howItHelps = [
  { icon: Puzzle, title: "Sharper problem-solving", detail: "Breaking a big, vague problem into small, testable steps is a transferable habit that shows up far beyond code." },
  { icon: Rocket, title: "Building instead of just using", detail: "You stop being limited to what an app lets you do, and start being able to make the tool you actually need." },
  { icon: Target, title: "Career flexibility", detail: "Web, mobile, data, AI, security, game dev, robotics — one core skill set opens many different paths." },
  { icon: BrainCircuit, title: "Understanding the systems around you", detail: "Once you can read code, algorithms feeds, apps, and 'the algorithm' stop being a black box." },
];

const consistencyTips = [
  { icon: Calendar, title: "Small daily reps beat rare marathons", detail: "30–45 focused minutes every day compounds far more than one 6-hour session once a week." },
  { icon: Target, title: "Always be building something", detail: "Tutorials teach syntax; a real project — even a tiny one — forces you to actually solve problems." },
  { icon: GitBranch, title: "Track your progress visibly", detail: "A GitHub commit streak, a habit tracker, or a simple daily log gives you evidence you're moving forward on hard days." },
  { icon: Zap, title: "Pick one thing at a time", detail: "Jumping between five languages and frameworks each week feels productive but rarely compounds. Go deep before you go wide." },
  { icon: Puzzle, title: "Get comfortable being stuck", detail: "Debugging and confusion aren't signs you're bad at this — they're most of what programming actually is." },
  { icon: History, title: "Revisit old code", detail: "Rereading something you wrote a month ago is the fastest way to see how much you've actually improved." },
];

const importantThings = [
  { icon: CheckCircle2, tone: "good", title: "Read error messages fully", detail: "Most beginners panic and Google the first five words. The message usually already tells you the file, line, and reason." },
  { icon: CheckCircle2, tone: "good", title: "Understand before you copy", detail: "Pasting a Stack Overflow answer that works is fine — leaving it without understanding why is a debt you'll pay for later." },
  { icon: CheckCircle2, tone: "good", title: "Version control from day one", detail: "Even solo hobby scripts benefit from `git init`. It's the undo button for your entire project's history." },
  { icon: CheckCircle2, tone: "good", title: "Write for humans, not just the compiler", detail: "Clear names and small functions matter more than clever one-liners — code is read far more often than it's written." },
  { icon: AlertTriangle, tone: "warn", title: "Don't chase every new framework", detail: "Fundamentals — data structures, algorithms, how HTTP works — outlast almost every framework trend." },
  { icon: AlertTriangle, tone: "warn", title: "Tutorial hell is a real trap", detail: "Watching endless tutorials can feel like progress while you're actually avoiding the harder, messier work of building alone." },
  { icon: AlertTriangle, tone: "warn", title: "Don't compare day 10 to someone's year 5", detail: "Public portfolios show the polished result, never the hundreds of failed attempts behind it." },
  { icon: AlertTriangle, tone: "warn", title: "Security and edge cases aren't optional extras", detail: "'It works on my machine' is not the same as 'it works.' Empty inputs, bad data, and malicious input are part of the job." },
];

const cheatSheetSyntax: { concept: string; python: string; javascript: string; java: string; cpp: string }[] = [
  { concept: "Print output", python: 'print("Hello")', javascript: 'console.log("Hello")', java: 'System.out.println("Hello");', cpp: 'std::cout << "Hello";' },
  { concept: "Variable", python: "x = 10", javascript: "let x = 10;", java: "int x = 10;", cpp: "int x = 10;" },
  { concept: "If statement", python: "if x > 5:\n    ...", javascript: "if (x > 5) { ... }", java: "if (x > 5) { ... }", cpp: "if (x > 5) { ... }" },
  { concept: "For loop", python: "for i in range(5):\n    ...", javascript: "for (let i=0;i<5;i++){...}", java: "for(int i=0;i<5;i++){...}", cpp: "for(int i=0;i<5;i++){...}" },
  { concept: "Function", python: "def add(a, b):\n    return a+b", javascript: "function add(a,b){return a+b}", java: "int add(int a,int b){return a+b;}", cpp: "int add(int a,int b){return a+b;}" },
  { concept: "List / Array", python: "nums = [1, 2, 3]", javascript: "let nums = [1,2,3];", java: "int[] nums = {1,2,3};", cpp: "int nums[] = {1,2,3};" },
];

const paradigms = [
  { name: "Procedural", icon: ListChecks, blurb: "Step-by-step instructions grouped into procedures/functions.", ex: "C, Pascal, BASIC" },
  { name: "Object-Oriented", icon: Component, blurb: "Models code as objects with data (state) and behavior (methods).", ex: "Java, C++, Python, C#" },
  { name: "Functional", icon: BrainCircuit, blurb: "Treats computation as evaluating pure functions, avoiding shared state.", ex: "Haskell, Elixir, Clojure" },
  { name: "Declarative", icon: Layers, blurb: "Describes what result you want, not the steps to get there.", ex: "SQL, HTML, Prolog" },
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
function CopyableCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="group relative w-full text-left"
    >
      <pre className="rounded-lg bg-[#f7f8fa] dark:bg-[#0a0e14] border border-gray-200 dark:border-gray-800 px-3 py-2 text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-x-auto">
        {code}
      </pre>
      <span className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-gray-400" />
        )}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Diagrams (inline SVG, theme-aware via currentColor / CSS classes)
// ---------------------------------------------------------------------------
function PipelineDiagram() {
  const steps = ["Problem", "Algorithm", "Code", "Compile / Interpret", "Machine Code", "Output"];
  return (
    <svg viewBox="0 0 900 140" className="w-full h-auto">
      {steps.map((s, i) => {
        const x = 20 + i * 175;
        return (
          <g key={s}>
            <rect
              x={x}
              y={40}
              width={150}
              height={60}
              rx={10}
              className="fill-white dark:fill-[#0d1117] stroke-amber-500 dark:stroke-emerald-400"
              strokeWidth={1.5}
            />
            <text
              x={x + 75}
              y={75}
              textAnchor="middle"
              className="fill-gray-800 dark:fill-gray-200"
              style={{ fontSize: 12, fontFamily: "monospace" }}
            >
              {s}
            </text>
            {i < steps.length - 1 && (
              <path
                d={`M${x + 150} 70 L${x + 172} 70`}
                className="stroke-amber-500 dark:stroke-emerald-400"
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className="fill-amber-500 dark:fill-emerald-400" />
        </marker>
      </defs>
    </svg>
  );
}

function TimelineDiagram() {
  const points = historyMilestones;
  const width = 1200;
  const gap = width / points.length;
  return (
    <svg viewBox={`0 0 ${width} 220`} className="w-full h-auto">
      <line
        x1={40}
        y1={110}
        x2={width - 40}
        y2={110}
        className="stroke-gray-300 dark:stroke-gray-700"
        strokeWidth={2}
      />
      {points.map((p, i) => {
        const x = 60 + i * (gap - 10);
        const up = i % 2 === 0;
        return (
          <g key={p.year}>
            <circle
              cx={x}
              cy={110}
              r={7}
              className="fill-amber-500 dark:fill-emerald-400 stroke-white dark:stroke-[#0d1117]"
              strokeWidth={2}
            />
            <line
              x1={x}
              y1={110}
              x2={x}
              y2={up ? 70 : 150}
              className="stroke-gray-300 dark:stroke-gray-700"
            />
            <text
              x={x}
              y={up ? 58 : 168}
              textAnchor="middle"
              className="fill-gray-800 dark:fill-gray-200 font-semibold"
              style={{ fontSize: 13, fontFamily: "monospace" }}
            >
              {p.year}
            </text>
            <text
              x={x}
              y={up ? 44 : 182}
              textAnchor="middle"
              className="fill-gray-500 dark:fill-gray-400"
              style={{ fontSize: 9.5 }}
            >
              {p.title.length > 22 ? p.title.slice(0, 20) + "…" : p.title}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ParadigmVennSketch() {
  return (
    <svg viewBox="0 0 400 300" className="w-full max-w-sm mx-auto h-auto">
      <circle cx="150" cy="120" r="90" className="fill-amber-500/10 dark:fill-emerald-400/10 stroke-amber-500 dark:stroke-emerald-400" strokeWidth="1.5" />
      <circle cx="250" cy="120" r="90" className="fill-amber-500/10 dark:fill-emerald-400/10 stroke-amber-500 dark:stroke-emerald-400" strokeWidth="1.5" />
      <circle cx="200" cy="195" r="90" className="fill-amber-500/10 dark:fill-emerald-400/10 stroke-amber-500 dark:stroke-emerald-400" strokeWidth="1.5" />
      <text x="105" y="90" className="fill-gray-700 dark:fill-gray-300" style={{ fontSize: 11, fontFamily: "monospace" }}>Procedural</text>
      <text x="255" y="90" className="fill-gray-700 dark:fill-gray-300" style={{ fontSize: 11, fontFamily: "monospace" }}>Functional</text>
      <text x="165" y="270" className="fill-gray-700 dark:fill-gray-300" style={{ fontSize: 11, fontFamily: "monospace" }}>Object-Oriented</text>
      <text x="178" y="150" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" style={{ fontSize: 9 }}>most real</text>
      <text x="178" y="162" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" style={{ fontSize: 9 }}>languages mix</text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function ProgrammingPage() {
  const { toast, show } = useToast();
  const [query, setQuery] = useState("");

  const filteredLanguages = useMemo(() => {
    if (!query.trim()) return allLanguages;
    return allLanguages.filter((l) =>
      l.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [query]);

  const downloadCheatSheet = () => {
    const lines: string[] = [];
    lines.push("CODENFACTS — PROGRAMMING CHEAT SHEET");
    lines.push("=====================================\n");
    lines.push("SYNTAX QUICK REFERENCE\n-----------------------");
    cheatSheetSyntax.forEach((row) => {
      lines.push(`\n${row.concept.toUpperCase()}`);
      lines.push(`  Python:     ${row.python}`);
      lines.push(`  JavaScript: ${row.javascript}`);
      lines.push(`  Java:       ${row.java}`);
      lines.push(`  C++:        ${row.cpp}`);
    });
    lines.push("\n\nTOP LANGUAGES\n-------------");
    topLanguages.forEach((l) => {
      lines.push(`${l.name} — created by ${l.creator} (${l.year}) — ${l.known}`);
    });
    lines.push("\n\nSTAYING CONSISTENT\n-------------------");
    consistencyTips.forEach((t) => lines.push(`- ${t.title}: ${t.detail}`));

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codenfacts-programming-cheatsheet.txt";
    a.click();
    URL.revokeObjectURL(url);
    show("Cheat sheet downloaded ✓");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e14] text-gray-900 dark:text-gray-100 transition-colors">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-gray-900 dark:bg-emerald-500 text-white dark:text-[#0a0e14] text-sm font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
        {/* ------------------------------------------------------------- HERO */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <TerminalPanel title="~/programming">
            <div className="flex items-center gap-2 font-mono text-xs text-gray-400 dark:text-gray-500 mb-4">
              <span className="text-amber-600 dark:text-emerald-400">$</span> cat what-is-programming.md
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-emerald-950">
                <Terminal className="w-6 h-6 text-amber-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
                Programming, from first principles
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
              Everything on this page exists to answer one question honestly: what actually
              is programming, why does it matter right now, and how do you build a real,
              lasting relationship with it - not just finish a tutorial and forget it a
              month later.
            </p>
          </TerminalPanel>
        </motion.section>

        {/* ------------------------------------------------------------- WHAT IS PROGRAMMING */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <SectionEyebrow icon={Code2} label="Definition" />
          <h2 className="text-2xl font-bold mb-4">What is programming?</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <TerminalPanel title="definition.txt">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Programming is the act of writing precise, step-by-step instructions —
                called code — that tell a computer exactly what to do. A computer has no
                intuition of its own; it only follows what it's told, exactly as it's
                told. Programming is the skill of translating a human goal ("show me my
                bank balance," "recommend a song," "land this rocket booster") into a
                sequence a machine can execute without ambiguity.
              </p>
            </TerminalPanel>
            <TerminalPanel title="analogy.txt">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Think of a recipe. A chef doesn't just say "make a cake" — they list exact
                steps, quantities, and order: crack two eggs, whisk for 30 seconds, bake at
                180°C for 25 minutes. Code is that recipe, except the "kitchen" is a
                processor executing billions of tiny steps every second, and the
                "ingredients" are data.
              </p>
            </TerminalPanel>
          </div>
        </motion.section>

        {/* ------------------------------------------------------------- WHY NEEDED NOW */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <SectionEyebrow icon={Flame} label="Relevance" />
          <h2 className="text-2xl font-bold mb-4">Why programming matters right now</h2>
          <div className="space-y-3">
            {whyNeededNow.map((point, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-[#f7f8fa] dark:bg-[#0d1117]"
              >
                <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ------------------------------------------------------------- WHAT IF IT DIDN'T EXIST */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <SectionEyebrow icon={XCircle} label="Counterfactual" />
          <h2 className="text-2xl font-bold mb-4">What if programming didn't exist?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {whatIfNot.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  custom={i}
                  variants={fadeUp}
                  className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1117]"
                >
                  <Icon className="w-5 h-5 text-amber-600 dark:text-emerald-400 mb-2" />
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ------------------------------------------------------------- HOW IT HELPS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <SectionEyebrow icon={Lightbulb} label="Benefits" />
          <h2 className="text-2xl font-bold mb-4">How learning to program helps you</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {howItHelps.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  custom={i}
                  variants={fadeUp}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-[#f7f8fa] dark:bg-[#0d1117]"
                >
                  <Icon className="w-5 h-5 text-amber-600 dark:text-emerald-400 mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ------------------------------------------------------------- PIPELINE DIAGRAM */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <SectionEyebrow icon={GitBranch} label="Diagram" />
          <h2 className="text-2xl font-bold mb-4">From idea to running program</h2>
          <TerminalPanel title="pipeline.svg">
            <PipelineDiagram />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Every program, regardless of language, follows roughly this pipeline: a
              real-world problem gets turned into an algorithm (the logic), the algorithm
              gets written as code, and a compiler or interpreter turns that code into
              machine instructions the processor can run.
            </p>
          </TerminalPanel>
        </motion.section>

        {/* ------------------------------------------------------------- HISTORY / TIMELINE */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <SectionEyebrow icon={History} label="History" />
          <h2 className="text-2xl font-bold mb-2">Who discovered programming, and when</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 max-w-2xl">
            Programming wasn't invented in a single moment — it evolved over more than a
            century, from the first theoretical algorithm to the languages powering
            today's apps.
          </p>
          <TerminalPanel title="timeline.svg" className="mb-6 overflow-x-auto">
            <div className="min-w-[700px]">
              <TimelineDiagram />
            </div>
          </TerminalPanel>
          <div className="space-y-3">
            {historyMilestones.map((m, i) => (
              <motion.div
                key={m.year}
                custom={i}
                variants={fadeUp}
                className="flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1117]"
              >
                <div className="shrink-0 w-16 text-center">
                  <span className="font-mono font-bold text-amber-600 dark:text-emerald-400 text-sm">
                    {m.year}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{m.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <User className="w-3 h-3" /> {m.who}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {m.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ------------------------------------------------------------- PARADIGMS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <SectionEyebrow icon={Layers} label="Concepts" />
          <h2 className="text-2xl font-bold mb-4">Programming paradigms</h2>
          <div className="grid sm:grid-cols-2 gap-5 items-center">
            <div className="space-y-3">
              {paradigms.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.name}
                    custom={i}
                    variants={fadeUp}
                    className="flex items-start gap-3 p-3.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-[#f7f8fa] dark:bg-[#0d1117]"
                  >
                    <Icon className="w-4.5 h-4.5 text-amber-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm">{p.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{p.blurb}</p>
                      <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 mt-0.5">
                        e.g. {p.ex}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <TerminalPanel title="paradigms.sketch">
              <ParadigmVennSketch />
            </TerminalPanel>
          </div>
        </motion.section>

        {/* ------------------------------------------------------------- TOP LANGUAGES TABLE */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <SectionEyebrow icon={Award} label="Rankings" />
          <h2 className="text-2xl font-bold mb-2">The most popular languages — and who built them</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 max-w-2xl">
            "Popular" shifts year to year, but these have held real staying power across
            industry surveys, job postings, and open-source activity.
          </p>
          <TerminalPanel title="top-languages.csv">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <th className="py-2 pr-4">Language</th>
                    <th className="py-2 pr-4">Creator</th>
                    <th className="py-2 pr-4">Year</th>
                    <th className="py-2">Best known for</th>
                  </tr>
                </thead>
                <tbody>
                  {topLanguages.map((l) => (
                    <tr
                      key={l.name}
                      className="border-b border-gray-100 dark:border-gray-900 last:border-0"
                    >
                      <td className="py-2.5 pr-4 font-semibold text-amber-700 dark:text-emerald-400">
                        {l.name}
                      </td>
                      <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{l.creator}</td>
                      <td className="py-2.5 pr-4 font-mono text-gray-500 dark:text-gray-500">{l.year}</td>
                      <td className="py-2.5 text-gray-600 dark:text-gray-400">{l.known}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TerminalPanel>
        </motion.section>

        {/* ------------------------------------------------------------- ALL LANGUAGES LIST */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <SectionEyebrow icon={Globe} label="Reference" />
          <h2 className="text-2xl font-bold mb-2">Programming languages of the world</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 max-w-2xl">
            This isn't every language ever created — thousands exist, many academic or
            historical — but it's a broad, practical spread across eras and use cases.
          </p>
          <TerminalPanel title="languages --list">
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter languages…"
                className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-[#f7f8fa] dark:bg-[#0a0e14] border border-gray-200 dark:border-gray-800 outline-none focus:border-amber-400 dark:focus:border-emerald-500 text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredLanguages.map((lang) => (
                <span
                  key={lang}
                  className="px-2.5 py-1 rounded-md text-xs font-mono border border-gray-200 dark:border-gray-800 bg-[#f7f8fa] dark:bg-[#0a0e14] text-gray-700 dark:text-gray-300"
                >
                  {lang}
                </span>
              ))}
              {filteredLanguages.length === 0 && (
                <p className="text-sm text-gray-400">No matches for "{query}".</p>
              )}
            </div>
          </TerminalPanel>
        </motion.section>

        {/* ------------------------------------------------------------- CHEAT SHEET */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <SectionEyebrow icon={BookOpen} label="Cheat sheet" />
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <h2 className="text-2xl font-bold">Syntax, side by side</h2>
            <button
              onClick={downloadCheatSheet}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-amber-500 hover:bg-amber-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-[#0a0e14] transition-colors"
            >
              <Download className="w-4 h-4" /> Download cheat sheet
            </button>
          </div>
          <div className="space-y-4">
            {cheatSheetSyntax.map((row, i) => (
              <motion.div
                key={row.concept}
                custom={i}
                variants={fadeUp}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1117]"
              >
                <h3 className="text-sm font-semibold mb-3 text-amber-700 dark:text-emerald-400">
                  {row.concept}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 block mb-1">
                      Python
                    </span>
                    <CopyableCode code={row.python} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 block mb-1">
                      JavaScript
                    </span>
                    <CopyableCode code={row.javascript} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 block mb-1">
                      Java
                    </span>
                    <CopyableCode code={row.java} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 block mb-1">
                      C++
                    </span>
                    <CopyableCode code={row.cpp} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ------------------------------------------------------------- CONSISTENCY */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <SectionEyebrow icon={Clock} label="Habits" />
          <h2 className="text-2xl font-bold mb-4">How to stay consistent</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {consistencyTips.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.title}
                  custom={i}
                  variants={fadeUp}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-[#f7f8fa] dark:bg-[#0d1117]"
                >
                  <Icon className="w-5 h-5 text-amber-600 dark:text-emerald-400 mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{t.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ------------------------------------------------------------- IMPORTANT THINGS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <SectionEyebrow icon={Sparkles} label="Keep in mind" />
          <h2 className="text-2xl font-bold mb-4">Important things to remember</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {importantThings.map((t, i) => {
              const Icon = t.icon;
              const good = t.tone === "good";
              return (
                <motion.div
                  key={t.title}
                  custom={i}
                  variants={fadeUp}
                  className={`flex items-start gap-3 p-4 rounded-lg border ${
                    good
                      ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : "border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/10"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      good ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                    }`}
                  />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{t.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t.detail}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ------------------------------------------------------------- FOOTER NOTE */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <TerminalPanel title="closing-thought.md">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Programming isn't a fixed body of facts to memorize - it's a way of thinking
              that keeps compounding the longer you stick with it. Languages will change,
              frameworks will come and go, but the core skill - breaking a real problem
              into something a machine can execute, then debugging your way to a working
              answer - stays valuable no matter what you build next.
            </p>
          </TerminalPanel>
        </motion.section>
      </div>
    </div>
  );
}