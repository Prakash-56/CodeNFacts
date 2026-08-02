"use client";

import Link from "next/link";
import { ArrowLeft, Terminal, Clock } from "lucide-react";

/**
 * PlaceholderEditor
 * -----------------------------------------------------------------------
 * Shared shell for /editor/html, /compiler/python, /compiler/java and
 * /compiler/c. Swap this out for a real editor (Monaco, CodeMirror, etc.)
 * when each language tool is ready — the props give you the filename,
 * accent gradient, and sample snippet to keep wiring it up simple.
 * -----------------------------------------------------------------------
 */

type PlaceholderEditorProps = {
  language: string;
  filename: string;
  gradient: string; // tailwind gradient classes, e.g. "from-emerald-500 to-teal-500"
  sample: string; // sample code shown in the read-only preview
};

export default function PlaceholderEditor({
  language,
  filename,
  gradient,
  sample,
}: PlaceholderEditorProps) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#0a0e14] px-4 py-16 sm:px-8 transition-colors duration-300">
      {/* Ambient glow — matches Hero / StartCodingInSeconds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-cyan-400/20 dark:bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to CodeNFacts
        </Link>

        <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] shadow-xl shadow-slate-200/50 dark:shadow-black/40 overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#161b22] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-3 flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
              <Terminal className="h-3.5 w-3.5" />
              {filename}
            </span>
          </div>

          {/* Code preview */}
          <pre className="overflow-x-auto p-6 font-mono text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            <code>{sample}</code>
          </pre>

          {/* Coming soon banner */}
          <div className="flex flex-col items-start gap-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11151c] px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} shadow-md`}
              >
                <Clock className="h-5 w-5 text-white" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {language} is warming up
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  The live editor for this language is on its way.
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/50 dark:border-emerald-400/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}