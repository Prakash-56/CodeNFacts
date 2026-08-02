"use client";

import { useRouter } from "next/navigation";
import { FileCode2, FileTerminal, Coffee, Cpu, Terminal } from "lucide-react";


type LangTool = {
  id: string;
  label: string;
  filename: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  ring: string;
};

const TOOLS: LangTool[] = [
  {
    id: "html",
    label: "HTML Editor",
    filename: "index.html",
    href: "/editor/html",
    icon: FileCode2,
    gradient: "from-emerald-500 to-teal-500",
    ring: "hover:ring-emerald-400/40",
  },
  {
    id: "python",
    label: "Python Compiler",
    filename: "main.py",
    href: "/compiler/python",
    icon: FileTerminal,
    gradient: "from-teal-500 to-cyan-500",
    ring: "hover:ring-teal-400/40",
  },
  {
    id: "java",
    label: "Java Compiler",
    filename: "Main.java",
    href: "/compiler/java",
    icon: Coffee,
    gradient: "from-cyan-500 to-emerald-500",
    ring: "hover:ring-cyan-400/40",
  },
  {
    id: "c",
    label: "C Compiler",
    filename: "main.c",
    href: "/compiler/c",
    icon: Cpu,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    ring: "hover:ring-emerald-400/40",
  },
];

export default function StartCodingInSeconds() {
  const router = useRouter();
  const goTo = (href: string) => router.push(href);

  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-slate-950 py-20 px-4 sm:px-8 transition-colors duration-300">

      <div className="relative mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-1.5 text-sm font-normal text-slate-600 dark:text-slate-300">
            <Terminal className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            No setup. No install. Just run.
          </span>

          <h2 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Start coding in seconds{" "}
          </h2>

          <p className="mt-3 text-base font-normal text-slate-500 dark:text-slate-400">
            Pick a language below - your editor opens instantly.
          </p>
        </div>

        {/* Editor chrome wrapper */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">

          {/* Terminal header */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-3 flex items-center gap-1.5 text-xs font-mono font-normal text-slate-400 dark:text-slate-500">
              <Terminal className="h-3.5 w-3.5" />
              codenfacts.dev — choose-a-language
            </span>
          </div>

          {/* Tool grid */}
          <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => goTo(tool.href)}
                  aria-label={`Open ${tool.label}`}
                  className={`group flex flex-col items-start gap-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-left shadow-sm ring-1 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md ${tool.ring}`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tool.gradient} shadow-sm`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </span>

                  <div>
                    <p className="font-mono text-[11px] font-normal text-slate-400 dark:text-slate-500">
                      {tool.filename}
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {tool.label}
                    </p>
                  </div>

                  <span className="font-mono text-xs font-normal text-slate-500 dark:text-slate-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    run &rarr;
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}