"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  Play,
  Copy,
  Download,
  Trash2,
  Code2,
  Eye,
} from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const defaultCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeNFacts</title>

    <style>
        body{
            font-family: Arial, sans-serif;
            background:#f5f5f5;
            padding:40px;
        }

        h1{
            color:#0ea5e9;
        }

        p{
            font-size:18px;
        }

        button{
            padding:10px 20px;
            border:none;
            background:#0ea5e9;
            color:white;
            border-radius:8px;
            cursor:pointer;
        }

        button:hover{
            background:#0284c7;
        }
    </style>

</head>

<body>

    <h1>Welcome to CodeNFacts 🚀</h1>

    <p>Edit this HTML and see the live preview.</p>

    <button onclick="alert('Hello from CodeNFacts!')">
        Click Me
    </button>

</body>
</html>`;

export default function HtmlEditorPage() {
  const [code, setCode] = useState(defaultCode);
  const [preview, setPreview] = useState(defaultCode);
  const [mobileTab, setMobileTab] = useState<"code" | "preview">("code");
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("html-editor");

    if (saved) {
      setCode(saved);
      setPreview(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("html-editor", code);
  }, [code]);

  const runCode = () => {
    setPreview(code);
    setMobileTab("preview");
  };

  const clearCode = () => {
    setCode("");
    setPreview("");
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "index.html";
    a.click();

    URL.revokeObjectURL(url);
  };

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
            CodeNFacts HTML Editor
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible">
          <button
            onClick={runCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
              bg-amber-500 hover:bg-amber-600 text-white
              dark:bg-emerald-500/90 dark:hover:bg-emerald-500 dark:text-[#0a0e14]
              transition-colors shrink-0"
          >
            <Play size={14} /> Run
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
            onClick={clearCode}
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
          onClick={() => setMobileTab("preview")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            mobileTab === "preview"
              ? "border-amber-500 dark:border-emerald-400 text-gray-900 dark:text-gray-100"
              : "border-transparent text-gray-500 dark:text-gray-500"
          }`}
        >
          <Eye size={15} /> Preview
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 min-h-0">
        {/* Editor */}
        <div
          className={`border-r-0 lg:border-r border-gray-200 dark:border-gray-800 min-h-0 ${
            mobileTab === "code" ? "block" : "hidden lg:block"
          }`}
        >
          {mounted && (
            <MonacoEditor
              height="100%"
              language="html"
              theme={monacoTheme}
              value={code}
              onChange={(value) => setCode(value || "")}
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
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                autoIndent: "full",
                formatOnPaste: true,
                formatOnType: true,
                smoothScrolling: true,
                scrollBeyondLastLine: false,
                tabSize: 2,
                padding: { top: 16 },
              }}
            />
          )}
        </div>

        {/* Preview */}
        <div
          className={`flex flex-col min-h-0 bg-white ${
            mobileTab === "preview" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="px-4 py-2.5 text-sm font-semibold bg-[#f7f8fa] dark:bg-[#0d1117] text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
            Live Preview
          </div>

          <iframe
            title="preview"
            srcDoc={preview}
            sandbox="allow-scripts"
            className="w-full flex-1 bg-white"
          />
        </div>
      </div>
    </div>
  );
}