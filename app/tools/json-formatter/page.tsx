"use client";

/**
 * JSON Formatter & Validator
 * -----------------------------------------------------------------------
 * Assumptions about the surrounding project (adjust if different):
 *  - Tailwind CSS is configured with `darkMode: "class"`, and something in
 *    your layout/header toggles a `dark` class on <html> or <body>. This
 *    page never toggles dark mode itself — it just reacts to `dark:` classes.
 *  - `lucide-react` is installed (`npm i lucide-react`). Swap the icon
 *    imports for your own icon set if you don't use it.
 *  - This file is a route page (app/tools/json-formatter/page.tsx), so it
 *    intentionally does NOT render <html>/<body>/a site header — your
 *    layout.tsx already provides those (including the light/dark toggle).
 * -----------------------------------------------------------------------
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentType,
} from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clipboard,
  ClipboardCheck,
  Download,
  Eraser,
  FileJson2,
  Minimize2,
  Sparkles,
  Upload,
} from "lucide-react";

// =========================================================================
// Types
// =========================================================================

type IndentOption = "2" | "4" | "tab";
type OutputTab = "tree" | "raw";

type ValidationResult =
  | { valid: true; parsed: unknown }
  | { valid: false; message: string; line: number; column: number };

// =========================================================================
// Pure helpers (no React) — safe to unit test on their own
// =========================================================================

/** Turns a byte/char offset into a 1-indexed {line, column}. */
function positionToLineColumn(text: string, position: number) {
  let line = 1;
  let column = 1;
  const end = Math.min(position, text.length);
  for (let i = 0; i < end; i++) {
    if (text[i] === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

/** Validates JSON text and returns a rich result, including line/column on failure. */
function validateJson(text: string): ValidationResult {
  if (!text.trim()) {
    return { valid: false, message: "Input is empty.", line: 1, column: 1 };
  }
  try {
    const parsed = JSON.parse(text);
    return { valid: true, parsed };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON.";
    const match = message.match(/position (\d+)/i);
    const position = match ? parseInt(match[1], 10) : 0;
    const { line, column } = positionToLineColumn(text, position);
    return { valid: false, message, line, column };
  }
}

/** Deep-sorts object keys alphabetically (arrays keep their order). */
function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    return entries.reduce<Record<string, unknown>>((acc, [k, v]) => {
      acc[k] = sortKeysDeep(v);
      return acc;
    }, {});
  }
  return value;
}

function indentToStringifyArg(indent: IndentOption): string | number {
  if (indent === "tab") return "\t";
  return Number(indent);
}

/** Basic structural stats used in the stats bar. */
function analyzeJson(value: unknown) {
  let objects = 0;
  let arrays = 0;
  let strings = 0;
  let numbers = 0;
  let booleans = 0;
  let nulls = 0;
  let keys = 0;
  let maxDepth = 0;

  const walk = (v: unknown, depth: number) => {
    maxDepth = Math.max(maxDepth, depth);
    if (Array.isArray(v)) {
      arrays++;
      v.forEach((item) => walk(item, depth + 1));
    } else if (v !== null && typeof v === "object") {
      objects++;
      Object.entries(v as Record<string, unknown>).forEach(([, val]) => {
        keys++;
        walk(val, depth + 1);
      });
    } else if (typeof v === "string") strings++;
    else if (typeof v === "number") numbers++;
    else if (typeof v === "boolean") booleans++;
    else if (v === null) nulls++;
  };

  walk(value, 0);
  return { objects, arrays, strings, numbers, booleans, nulls, keys, maxDepth };
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// =========================================================================
// Static content: sample JSON, cheat sheet, pitfalls
// =========================================================================

const SAMPLE_JSON = `{
  "name": "Ada Lovelace",
  "born": 1815,
  "isActive": true,
  "spouse": null,
  "skills": ["mathematics", "analytical engines", "writing"],
  "address": {
    "city": "London",
    "country": "UK"
  }
}`;

const CHEAT_SHEET: { type: string; example: string; note: string }[] = [
  { type: "Object", example: `{ "key": "value" }`, note: "Unordered set of key/value pairs. Keys are always double-quoted strings." },
  { type: "Array", example: `[1, 2, 3]`, note: "Ordered list of values. Items can be mixed types." },
  { type: "String", example: `"hello\\nworld"`, note: "Double quotes only. Supports \\n \\t \\\" \\\\ \\uXXXX escapes." },
  { type: "Number", example: `-12.5e3`, note: "No leading zeros, no NaN/Infinity, no hex/octal literals." },
  { type: "Boolean", example: `true / false`, note: "Lowercase only — no True, no 1/0." },
  { type: "Null", example: `null`, note: "Lowercase. There is no `undefined` in JSON." },
];

const PITFALLS: { title: string; detail: string }[] = [
  { title: "No trailing commas", detail: `{ "a": 1, } is invalid — remove the comma after the last item.` },
  { title: "No comments", detail: "JSON has no // or /* */ syntax. Strip comments before parsing, or use JSON5/JSONC if you need them." },
  { title: "Double quotes only", detail: `'single quotes' and unquoted keys like { name: "x" } are not valid JSON.` },
  { title: "Numbers lose precision", detail: "JSON numbers map to IEEE-754 doubles — integers beyond 2^53 (e.g. large IDs) can silently change. Send them as strings if exactness matters." },
  { title: "Duplicate keys: last one wins", detail: `{ "a": 1, "a": 2 } parses to { "a": 2 } in most parsers — don't rely on the first value.` },
  { title: "No native dates", detail: "Dates aren't a JSON type. Use ISO-8601 strings (\"2026-08-01T00:00:00Z\") and parse on the receiving end." },
  { title: "Top level can be any value", detail: `"just a string" and 42 are both valid JSON documents — not everything is an object or array.` },
  { title: "Control characters must be escaped", detail: "Raw newlines/tabs inside a string are illegal — they must appear as \\n, \\t, etc." },
];

// =========================================================================
// Tree view (collapsible JSON explorer)
// =========================================================================

function typeColorClass(value: unknown) {
  if (typeof value === "string") return "text-emerald-600 dark:text-emerald-400";
  if (typeof value === "number") return "text-indigo-600 dark:text-indigo-400";
  if (typeof value === "boolean") return "text-amber-600 dark:text-amber-400";
  if (value === null) return "text-neutral-400 dark:text-neutral-500";
  return "";
}

function JsonTreeNode({
  label,
  value,
  depth,
}: {
  label: string | null;
  value: unknown;
  depth: number;
}) {
  const isArray = Array.isArray(value);
  const isObject = value !== null && typeof value === "object" && !isArray;
  const [open, setOpen] = useState(depth < 2);

  if (isArray || isObject) {
    const entries: [string, unknown][] = isArray
      ? (value as unknown[]).map((v, i) => [String(i), v])
      : Object.entries(value as Record<string, unknown>);
    const openBracket = isArray ? "[" : "{";
    const closeBracket = isArray ? "]" : "}";

    return (
      <div className="font-mono text-[13px] leading-6">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-1 rounded px-1 -ml-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          {open ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
          )}
          {label !== null && (
            <>
              <span className="text-rose-600 dark:text-rose-400">&quot;{label}&quot;</span>
              <span className="text-neutral-400">:</span>
            </>
          )}
          <span className="text-neutral-500 dark:text-neutral-400">
            {openBracket}
            {!open && (
              <span className="italic">
                {" "}
                {entries.length} {entries.length === 1 ? "item" : "items"}{" "}
              </span>
            )}
            {!open && closeBracket}
          </span>
        </button>

        {open && (
          <div className="ml-[7px] border-l border-neutral-200 dark:border-neutral-800 pl-3">
            {entries.length === 0 ? (
              <div className="text-neutral-400 italic">empty</div>
            ) : (
              entries.map(([key, val]) => (
                <JsonTreeNode key={key} label={isArray ? null : key} value={val} depth={depth + 1} />
              ))
            )}
            <div className="text-neutral-500 dark:text-neutral-400">{closeBracket}</div>
          </div>
        )}
      </div>
    );
  }

  const display = typeof value === "string" ? `"${value}"` : String(value);
  return (
    <div className="font-mono text-[13px] leading-6 pl-[19px]">
      {label !== null && (
        <>
          <span className="text-rose-600 dark:text-rose-400">&quot;{label}&quot;</span>
          <span className="text-neutral-400">: </span>
        </>
      )}
      <span className={typeColorClass(value)}>{display}</span>
    </div>
  );
}

// =========================================================================
// Small presentational bits
// =========================================================================

function ToolbarButton({
  onClick,
  icon: Icon,
  label,
  disabled,
  variant = "default",
}: {
  onClick: () => void;
  icon: ComponentType<{ className?: string }>;
  label: string;
  disabled?: boolean;
  variant?: "default" | "primary";
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-neutral-950";
  const styles =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-500"
      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700";
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-start gap-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2">
      <span className="text-[11px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">{label}</span>
      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{value}</span>
    </div>
  );
}

// =========================================================================
// Anatomy-of-JSON diagram (inline SVG, theme-aware via currentColor)
// =========================================================================

function JsonAnatomyDiagram() {
  return (
    <svg
      viewBox="0 0 820 300"
      className="w-full h-auto text-neutral-400 dark:text-neutral-600"
      role="img"
      aria-label="Diagram labeling the parts of a JSON object: braces, keys, colons, string values, number values, boolean values, an array value, and a nested object value."
    >
      <text x="20" y="40" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="20" fill="currentColor">
        {"{"}
      </text>
      <text x="40" y="70" fontFamily="ui-monospace, monospace" fontSize="18">
        <tspan fill="#e11d48">&quot;name&quot;</tspan>
        <tspan fill="currentColor">: </tspan>
        <tspan fill="#059669">&quot;Ada&quot;</tspan>
        <tspan fill="currentColor">,</tspan>
      </text>
      <text x="40" y="100" fontFamily="ui-monospace, monospace" fontSize="18">
        <tspan fill="#e11d48">&quot;age&quot;</tspan>
        <tspan fill="currentColor">: </tspan>
        <tspan fill="#4f46e5">36</tspan>
        <tspan fill="currentColor">,</tspan>
      </text>
      <text x="40" y="130" fontFamily="ui-monospace, monospace" fontSize="18">
        <tspan fill="#e11d48">&quot;active&quot;</tspan>
        <tspan fill="currentColor">: </tspan>
        <tspan fill="#d97706">true</tspan>
        <tspan fill="currentColor">,</tspan>
      </text>
      <text x="40" y="160" fontFamily="ui-monospace, monospace" fontSize="18">
        <tspan fill="#e11d48">&quot;skills&quot;</tspan>
        <tspan fill="currentColor">: [</tspan>
        <tspan fill="#059669">&quot;js&quot;</tspan>
        <tspan fill="currentColor">, </tspan>
        <tspan fill="#059669">&quot;ts&quot;</tspan>
        <tspan fill="currentColor">],</tspan>
      </text>
      <text x="40" y="190" fontFamily="ui-monospace, monospace" fontSize="18">
        <tspan fill="#e11d48">&quot;address&quot;</tspan>
        <tspan fill="currentColor">: {"{ "}</tspan>
        <tspan fill="#e11d48">&quot;city&quot;</tspan>
        <tspan fill="currentColor">: </tspan>
        <tspan fill="#059669">&quot;Paris&quot;</tspan>
        <tspan fill="currentColor">{" }"}</tspan>
      </text>
      <text x="20" y="220" fontFamily="ui-monospace, monospace" fontSize="20" fill="currentColor">
        {"}"}
      </text>

      {/* callouts */}
      <g fontFamily="ui-sans-serif, system-ui" fontSize="12" fill="currentColor">
        <line x1="120" y1="63" x2="120" y2="243" stroke="currentColor" strokeDasharray="2 3" />
        <text x="440" y="248">key : value pairs, separated by commas</text>

        <line x1="70" y1="55" x2="70" y2="90" stroke="#e11d48" strokeDasharray="2 3" />
        <text x="440" y="60" fill="#e11d48">key — always a double-quoted string</text>

        <line x1="590" y1="60" x2="670" y2="60" stroke="#059669" strokeDasharray="2 3" />
        <text x="440" y="80" fill="#059669">string value — double quotes</text>

        <line x1="245" y1="92" x2="245" y2="105" stroke="#4f46e5" strokeDasharray="2 3" />
        <text x="440" y="100" fill="#4f46e5">number — no quotes</text>

        <text x="440" y="120" fill="#d97706">boolean — true / false, lowercase</text>
        <text x="440" y="140">array — [ ] holds an ordered list</text>
        <text x="440" y="160">nested object — { } inside a value</text>
        <text x="440" y="180" fill="currentColor">null — represents “no value”</text>
      </g>
    </svg>
  );
}

// =========================================================================
// Page
// =========================================================================

export default function JsonFormatterPage() {
  const [rawInput, setRawInput] = useState<string>(SAMPLE_JSON);
  const [indent, setIndent] = useState<IndentOption>("2");
  const [sortKeys, setSortKeys] = useState(false);
  const [outputTab, setOutputTab] = useState<OutputTab>("tree");
  const [copied, setCopied] = useState(false);
  const [formatted, setFormatted] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live validation — recomputed whenever the input changes.
  const validation = useMemo(() => validateJson(rawInput), [rawInput]);

  const stats = useMemo(() => {
    if (!validation.valid) return null;
    return analyzeJson(validation.parsed);
  }, [validation]);

  const applyFormat = useCallback(() => {
    if (!validation.valid) return;
    const value = sortKeys ? sortKeysDeep(validation.parsed) : validation.parsed;
    const result = JSON.stringify(value, null, indentToStringifyArg(indent));
    setFormatted(result);
  }, [validation, sortKeys, indent]);

  // Re-format automatically whenever valid input, indent, or sort option changes.
  useEffect(() => {
    if (validation.valid) {
      const value = sortKeys ? sortKeysDeep(validation.parsed) : validation.parsed;
      setFormatted(JSON.stringify(value, null, indentToStringifyArg(indent)));
    } else {
      setFormatted("");
    }
  }, [validation, indent, sortKeys]);

  const handleMinify = useCallback(() => {
    if (!validation.valid) return;
    const value = sortKeys ? sortKeysDeep(validation.parsed) : validation.parsed;
    setFormatted(JSON.stringify(value));
  }, [validation, sortKeys]);

  const handleCopy = useCallback(async () => {
    const text = formatted || rawInput;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail without HTTPS/permissions — fail silently in UI,
      // consider surfacing a toast in your own app.
    }
  }, [formatted, rawInput]);

  const handleDownload = useCallback(() => {
    const text = formatted || rawInput;
    if (!text) return;
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [formatted, rawInput]);

  const handleUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setRawInput(String(reader.result ?? ""));
    reader.readAsText(file);
    e.target.value = ""; // allow re-uploading the same file
  }, []);

  const handleClear = useCallback(() => {
    setRawInput("");
    setFormatted("");
  }, []);

  const handleLoadSample = useCallback(() => setRawInput(SAMPLE_JSON), []);

  // Ctrl/Cmd+Enter → format, as a small productivity shortcut (documented in cheat sheet below).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        applyFormat();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [applyFormat]);

  const inputBytes = useMemo(() => new Blob([rawInput]).size, [rawInput]);
  const outputBytes = useMemo(() => new Blob([formatted]).size, [formatted]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* ---------------------------------------------------------- */}
        {/* Page intro                                                  */}
        {/* ---------------------------------------------------------- */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <FileJson2 className="h-3.5 w-3.5" />
            Tools
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">JSON Formatter &amp; Validator</h1>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl">
            Paste or upload JSON, format it, minify it, catch syntax errors with exact line/column
            numbers, and explore the result as a collapsible tree - all client-side, nothing leaves
            your browser.
          </p>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Toolbar                                                     */}
        {/* ---------------------------------------------------------- */}
        <div className="flex flex-wrap items-center gap-2">
          <ToolbarButton onClick={applyFormat} icon={Sparkles} label="Format" disabled={!validation.valid} variant="primary" />
          <ToolbarButton onClick={handleMinify} icon={Minimize2} label="Minify" disabled={!validation.valid} />
          <ToolbarButton onClick={handleCopy} icon={copied ? ClipboardCheck : Clipboard} label={copied ? "Copied!" : "Copy"} disabled={!formatted && !rawInput} />
          <ToolbarButton onClick={handleDownload} icon={Download} label="Download" disabled={!formatted && !rawInput} />
          <ToolbarButton onClick={() => fileInputRef.current?.click()} icon={Upload} label="Upload file" />
          <ToolbarButton onClick={handleClear} icon={Eraser} label="Clear" />
          <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={handleUpload} className="hidden" />

          <div className="ml-auto flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              <input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} className="accent-indigo-600" />
              Sort keys
            </label>
            <label className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              Indent
              <select
                value={indent}
                onChange={(e) => setIndent(e.target.value as IndentOption)}
                className="rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1 text-sm"
              >
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="tab">Tab</option>
              </select>
            </label>
            <button type="button" onClick={handleLoadSample} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              Load sample
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Editor + Output                                             */}
        {/* ---------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2">
              <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">Input</span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium ${
                  validation.valid ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {validation.valid ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                {validation.valid ? "Valid JSON" : "Invalid JSON"}
              </span>
            </div>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              spellCheck={false}
              placeholder="Paste JSON here…"
              className="h-96 w-full resize-none bg-white dark:bg-neutral-950 p-4 font-mono text-[13px] leading-6 outline-none placeholder:text-neutral-400"
            />
            {validation.valid === false && (
              <div className="border-t border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
                Line {validation.line}, column {validation.column} — {validation.message}
              </div>
            )}
          </div>

          {/* Output */}
          <div className="flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1">
              <div className="flex">
                {(["tree", "raw"] as OutputTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setOutputTab(tab)}
                    className={`px-3 py-1.5 text-xs font-medium capitalize ${
                      outputTab === tab
                        ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {tab === "tree" ? "Tree view" : "Raw"}
                  </button>
                ))}
              </div>
              <span className="text-xs text-neutral-400 pr-1">{formatted ? formatBytes(outputBytes) : "—"}</span>
            </div>

            <div className="h-96 overflow-auto p-4 bg-white dark:bg-neutral-950">
              {!validation.valid ? (
                <p className="text-sm text-neutral-400">Fix the input errors to see output here.</p>
              ) : outputTab === "raw" ? (
                <pre className="font-mono text-[13px] leading-6 whitespace-pre-wrap break-words">{formatted}</pre>
              ) : (
                <JsonTreeNode label={null} value={validation.parsed} depth={0} />
              )}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Stats bar                                                   */}
        {/* ---------------------------------------------------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          <StatPill label="Input size" value={formatBytes(inputBytes)} />
          <StatPill label="Output size" value={formatted ? formatBytes(outputBytes) : "—"} />
          <StatPill label="Keys" value={stats?.keys ?? "—"} />
          <StatPill label="Max depth" value={stats?.maxDepth ?? "—"} />
          <StatPill label="Objects" value={stats?.objects ?? "—"} />
          <StatPill label="Arrays" value={stats?.arrays ?? "—"} />
          <StatPill label="Strings" value={stats?.strings ?? "—"} />
          <StatPill label="Numbers" value={stats?.numbers ?? "—"} />
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Cheat sheet                                                 */}
        {/* ---------------------------------------------------------- */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">JSON syntax cheat sheet</h2>
          <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900 text-left text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Example</th>
                  <th className="px-4 py-2 font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {CHEAT_SHEET.map((row, i) => (
                  <tr key={row.type} className={i % 2 ? "bg-neutral-50/60 dark:bg-neutral-900/40" : ""}>
                    <td className="px-4 py-2 font-medium whitespace-nowrap align-top">{row.type}</td>
                    <td className="px-4 py-2 font-mono text-[13px] whitespace-nowrap align-top text-indigo-600 dark:text-indigo-400">
                      {row.example}
                    </td>
                    <td className="px-4 py-2 text-neutral-500 dark:text-neutral-400 align-top">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-neutral-400">
            Shortcut: press <kbd className="rounded border border-neutral-300 dark:border-neutral-700 px-1">Ctrl/Cmd</kbd> +{" "}
            <kbd className="rounded border border-neutral-300 dark:border-neutral-700 px-1">Enter</kbd> to format from
            anywhere on the page.
          </p>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Important things to keep in mind                            */}
        {/* ---------------------------------------------------------- */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Things to keep in mind</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PITFALLS.map((p) => (
              <div key={p.title} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  <h3 className="text-sm font-semibold">{p.title}</h3>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{p.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Anatomy diagram                                             */}
        {/* ---------------------------------------------------------- */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Anatomy of a JSON object</h2>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-900">
            <JsonAnatomyDiagram />
          </div>
        </section>
      </main>
    </div>
  );
}