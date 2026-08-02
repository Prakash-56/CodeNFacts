"use client";

  import Link from "next/link";
  import { useEffect, useState } from "react";
  import {
    ArrowRight,
    Terminal,
    Sparkles,
    Bot,
  } from "lucide-react";

  const CODE_LINES = [
    { text: "const learner = new Developer();", color: "text-cyan-400" },
    { text: "learner.learn('DSA', 'AI/ML', 'WebDev');", color: "text-emerald-400" },
    { text: "learner.buildProjects();", color: "text-teal-400" },
    { text: "// console.log('Career launched 🚀');", color: "text-slate-500" },
  ];

  export default function Hero() {
    const [typedLines, setTypedLines] = useState(0);

    useEffect(() => {
      if (typedLines >= CODE_LINES.length) return;
      const timer = setTimeout(() => setTypedLines((p) => p + 1), 600);
      return () => clearTimeout(timer);
    }, [typedLines]);

    return (
      <section
  className="relative w-full overflow-hidden py-20 px-4 sm:px-8 transition-colors duration-300
  bg-[linear-gradient(to_bottom,#eef9f4_0%,#f7fcfa_18%,#ffffff_45%,#ffffff_100%)]
  dark:bg-[linear-gradient(to_bottom,#0f1b17_0%,#0c1218_20%,#0a0e14_45%,#0a0e14_100%)]"
>
        <div className="relative mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900
  dark:text-white">
              Master Code, Facts {" "}
              &amp; everything in between.
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400
  max-w-xl">
              CodeNFacts is your launchpad for Programming, DSA, AI/ML, and Data
              Science  with hands-on internships, real projects, and an AI
              tutor that never sleeps.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/connect"
                className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700
  px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-300
  hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300 transition-colors"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700
  px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-300
  hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300 transition-colors"
              >
                Explore Courses
              </Link>
            </div>
          </div>

          {/* Right: terminal mock */}
          <div className="relative">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50
  dark:bg-[#0d1117] shadow-xl shadow-slate-200/50 dark:shadow-black/40 overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800
  bg-slate-100 dark:bg-[#161b22] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 flex items-center gap-1.5 text-xs font-mono text-slate-500
  dark:text-slate-400">
                  <Terminal className="h-3.5 w-3.5" />
                  CodeNFacts
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-6 font-mono text-sm space-y-2 min-h-[220px]">
                {CODE_LINES.map((line, i) => (
                  <div
                    key={i}
                    className={`${line.color} transition-opacity duration-300 ${
                      i < typedLines ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {line.text}
                  </div>
                ))}
                <span className="inline-block h-4 w-2 bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 rounded-xl border border-slate-200
  dark:border-slate-800 bg-white dark:bg-[#0d1117] shadow-lg px-5 py-3">
              <p className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <Bot className="h-3.5 w-3.5 text-emerald-500" />
                Currently building
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                AI Engineering Track
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function Stat({ value, label }: { value: string; label: string }) {
    return (
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    );
  }