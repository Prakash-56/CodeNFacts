"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Play, Copy, Download, Trash2, Code2, Terminal as TerminalIcon } from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const defaultCode = `print("Welcome to CodeNFacts 🚀")

name = input("Enter your name: ")

print("Hello", name)
`;

export default function PythonCompilerPage() {
  const [code, setCode] = useState(defaultCode);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileTab, setMobileTab] = useState<"code" | "console">("code");
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("python-code");
    if (saved) setCode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("python-code", code);
  }, [code]);

  async function runCode() {
    setLoading(true);
    setOutput("Running...");
    setMobileTab("console");

    try {
      const response = await fetch("http://localhost:5000/run/python", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          input,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setOutput(data.error);
      } else {
        setOutput(data.output);
      }
    } catch (err) {
      setOutput("Cannot connect to Python server.");
    }

    setLoading(false);
  }

  function clearAll() {
    setCode("");
    setInput("");
    setOutput("");
  }

  function downloadCode() {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "main.py";
    a.click();

    URL.revokeObjectURL(url);
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code);
  }

  const monacoTheme = mounted && resolvedTheme === "light" ? "cnf-light" : "cnf-dark";

  return (
    <div className="h-screen flex flex-col bg-[#ffffff] dark:bg-[#0a0e14] transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-3 bg-[#f7f8fa] dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base ml-2 whitespace-nowrap">
            🐍 CodeNFacts Python Compiler
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible">
          <button
            onClick={runCode}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
              bg-amber-500 hover:bg-amber-600 text-white
              dark:bg-emerald-500/90 dark:hover:bg-emerald-500 dark:text-[#0a0e14]
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors shrink-0"
          >
            <Play size={14} /> {loading ? "Running..." : "Run"}
          </button>

          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
              bg-gray-100 hover:bg-gray-200 text-gray-700
              dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-200
              border border-gray-200 dark:border-gray-700 transition-colors shrink-0"
          >
            <Copy size={14} /> Copy
          </button>

          <button
            onClick={downloadCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
              bg-gray-100 hover:bg-gray-200 text-gray-700
              dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-200
              border border-gray-200 dark:border-gray-700 transition-colors shrink-0"
          >
            <Download size={14} /> Download
          </button>

          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
              bg-red-50 hover:bg-red-100 text-red-600
              dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400
              border border-red-200 dark:border-red-500/30 transition-colors shrink-0"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="flex lg:hidden border-b border-gray-200 dark:border-gray-800 bg-[#f7f8fa] dark:bg-[#0d1117]">
        <button
          onClick={() => setMobileTab("code")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            mobileTab === "code"
              ? "border-amber-500 dark:border-emerald-400 text-gray-900 dark:text-gray-100"
              : "border-transparent text-gray-500 dark:text-gray-500"
          }`}
        >
          <Code2 size={15} /> Code
        </button>
        <button
          onClick={() => setMobileTab("console")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            mobileTab === "console"
              ? "border-amber-500 dark:border-emerald-400 text-gray-900 dark:text-gray-100"
              : "border-transparent text-gray-500 dark:text-gray-500"
          }`}
        >
          <TerminalIcon size={15} /> Input / Output
        </button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 min-h-0">
        {/* Editor */}
        <div
          className={`min-h-0 border-r-0 lg:border-r border-gray-200 dark:border-gray-800 ${
            mobileTab === "code" ? "block" : "hidden lg:block"
          }`}
        >
          {mounted && (
            <Editor
              language="python"
              theme={monacoTheme}
              value={code}
              onChange={(v) => setCode(v || "")}
              beforeMount={(monaco) => {
                monaco.editor.defineTheme("cnf-light", {
                  base: "vs",
                  inherit: true,
                  rules: [],
                  colors: {
                    "editor.background": "#ffffff",
                    "editor.foreground": "#1f2937",
                    "editorGutter.background": "#f7f8fa",
                    "editor.lineHighlightBackground": "#f7f8fa",
                  },
                });
                monaco.editor.defineTheme("cnf-dark", {
                  base: "vs-dark",
                  inherit: true,
                  rules: [],
                  colors: {
                    "editor.background": "#0a0e14",
                    "editor.foreground": "#e5e7eb",
                    "editorGutter.background": "#0d1117",
                    "editor.lineHighlightBackground": "#0d1117",
                  },
                });
              }}
              options={{
                fontSize: 15,
                minimap: { enabled: false },
                automaticLayout: true,
                wordWrap: "on",
                tabSize: 4,
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                smoothScrolling: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
              }}
            />
          )}
        </div>

        {/* Right Panel: Input + Output */}
        <div
          className={`flex-col bg-[#f7f8fa] dark:bg-[#0d1117] min-h-0 ${
            mobileTab === "console" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Input */}
          <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <h2 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-sm">
              Program Input
            </h2>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Input for input()"
              className="w-full h-28 sm:h-32 bg-white dark:bg-[#0a0e14] text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-600
                border border-gray-200 dark:border-gray-800
                p-3 rounded-md resize-none outline-none focus:ring-2 focus:ring-amber-500/40 dark:focus:ring-emerald-400/40"
            />
          </div>

          {/* Output */}
          <div className="flex-1 p-4 min-h-0 flex flex-col">
            <h2 className="text-gray-900 dark:text-gray-100 font-semibold mb-2 text-sm">
              Output
            </h2>

            <pre className="flex-1 bg-[#0a0e14] text-emerald-400 rounded-md p-4 overflow-auto whitespace-pre-wrap text-sm border border-gray-800">
{loading ? "Running..." : output || "// Output will appear here"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}