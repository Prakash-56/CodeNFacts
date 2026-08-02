"use client";

/**
 * API Tester — /tools/api-tester
 * ---------------------------------------------------------------
 * A self-contained request/response playground: build a request
 * (method, URL, params, headers, body, auth), send it with fetch,
 * inspect the response, and lean on the built-in cheat sheets while
 * you work.
 *
 * Assumptions (adjust if your project differs):
 * - Next.js App Router, this file lives at app/tools/api-tester/page.tsx
 * - Tailwind CSS with `darkMode: "class"` — dark mode is toggled by
 *   adding/removing the `dark` class on <html> (e.g. via next-themes).
 *   The light/dark switch itself lives in your shared header, not here.
 * - Icons: lucide-react (`npm i lucide-react`). If you don't have it,
 *   swap the <Icon /> usages for your own SVGs — nothing else depends on it.
 *
 * Everything below is plain Tailwind utility classes with dark: variants,
 * so it inherits whatever theme your header toggle sets — light mode is
 * a plain white surface, dark mode drops to slate-950/900.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Clock,
  Download,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  BookOpen,
  History as HistoryIcon,
  Info,
  Loader2,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

type KV = { id: string; key: string; value: string; enabled: boolean };

type BodyMode = "none" | "json" | "text" | "form";

type AuthMode = "none" | "bearer" | "basic" | "apikey";

type ResponseState = {
  status: number;
  statusText: string;
  ok: boolean;
  timeMs: number;
  sizeBytes: number;
  headers: [string, string][];
  bodyText: string;
  bodyIsJson: boolean;
};

type HistoryItem = {
  id: string;
  method: Method;
  url: string;
  status?: number;
  ok?: boolean;
  timeMs?: number;
  timestamp: number;
};

const METHODS: Method[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

const METHOD_COLORS: Record<Method, string> = {
  GET: "text-emerald-600 dark:text-emerald-400",
  POST: "text-amber-600 dark:text-amber-400",
  PUT: "text-blue-600 dark:text-blue-400",
  PATCH: "text-violet-600 dark:text-violet-400",
  DELETE: "text-rose-600 dark:text-rose-400",
  HEAD: "text-slate-500 dark:text-slate-400",
  OPTIONS: "text-slate-500 dark:text-slate-400",
};

const STATUS_CODES: { code: string; label: string; group: "2xx" | "3xx" | "4xx" | "5xx" }[] = [
  { code: "200", label: "OK — request succeeded", group: "2xx" },
  { code: "201", label: "Created — new resource made", group: "2xx" },
  { code: "204", label: "No Content — success, empty body", group: "2xx" },
  { code: "301/302", label: "Redirect — resource moved", group: "3xx" },
  { code: "304", label: "Not Modified — cached copy is fine", group: "3xx" },
  { code: "400", label: "Bad Request — malformed input", group: "4xx" },
  { code: "401", label: "Unauthorized — missing/invalid auth", group: "4xx" },
  { code: "403", label: "Forbidden — authenticated but not allowed", group: "4xx" },
  { code: "404", label: "Not Found — no such resource", group: "4xx" },
  { code: "409", label: "Conflict — state clash (e.g. duplicate)", group: "4xx" },
  { code: "422", label: "Unprocessable Entity — validation failed", group: "4xx" },
  { code: "429", label: "Too Many Requests — rate limited", group: "4xx" },
  { code: "500", label: "Internal Server Error — server crashed", group: "5xx" },
  { code: "502", label: "Bad Gateway — upstream failed", group: "5xx" },
  { code: "503", label: "Service Unavailable — server overloaded/down", group: "5xx" },
];

const COMMON_HEADERS: { name: string; use: string }[] = [
  { name: "Content-Type", use: "Format of the request body, e.g. application/json" },
  { name: "Authorization", use: "Credentials, e.g. Bearer <token> or Basic <base64>" },
  { name: "Accept", use: "Format you want back, e.g. application/json" },
  { name: "X-API-Key", use: "Common convention for a static API key" },
  { name: "User-Agent", use: "Identifies the calling client" },
  { name: "Cache-Control", use: "Caching directives, e.g. no-cache" },
  { name: "If-None-Match", use: "Conditional request using an ETag" },
  { name: "Idempotency-Key", use: "Safely retry a POST without double-processing" },
];

const METHOD_CHEATS: { method: Method; body: string; idempotent: string; use: string }[] = [
  { method: "GET", body: "No", idempotent: "Yes", use: "Read data, safe to cache & retry" },
  { method: "POST", body: "Yes", idempotent: "No", use: "Create a resource / trigger an action" },
  { method: "PUT", body: "Yes", idempotent: "Yes", use: "Replace a resource entirely" },
  { method: "PATCH", body: "Yes", idempotent: "No*", use: "Partially update a resource" },
  { method: "DELETE", body: "Sometimes", idempotent: "Yes", use: "Remove a resource" },
  { method: "HEAD", body: "No", idempotent: "Yes", use: "Like GET, headers only, no body" },
  { method: "OPTIONS", body: "No", idempotent: "Yes", use: "Discover allowed methods / CORS preflight" },
];

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 10);

const emptyRow = (): KV => ({ id: uid(), key: "", value: "", enabled: true });

function bytesOf(str: string) {
  return new TextEncoder().encode(str).length;
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function tryPrettyJson(text: string): { pretty: string; isJson: boolean } {
  try {
    const parsed = JSON.parse(text);
    return { pretty: JSON.stringify(parsed, null, 2), isJson: true };
  } catch {
    return { pretty: text, isJson: false };
  }
}

function statusTone(status: number) {
  if (status >= 200 && status < 300) return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-500/30";
  if (status >= 300 && status < 400) return "bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-blue-500/30";
  if (status >= 400 && status < 500) return "bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-500/30";
  if (status >= 500) return "bg-rose-500/10 text-rose-700 dark:text-rose-400 ring-rose-500/30";
  return "bg-slate-500/10 text-slate-700 dark:text-slate-300 ring-slate-500/30";
}

/* ------------------------------------------------------------------ */
/* Reusable bits                                                       */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  icon,
  right,
  children,
  className = "",
}: {
  title?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {icon}
            {title}
          </div>
          {right}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

function Collapsible({
  title,
  icon,
  defaultOpen = false,
  children,
  tone = "default",
}: {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  tone?: "default" | "warning";
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span
          className={`flex items-center gap-2 text-sm font-semibold ${
            tone === "warning"
              ? "text-amber-700 dark:text-amber-400"
              : "text-slate-700 dark:text-slate-200"
          }`}
        >
          {icon}
          {title}
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400" />
        )}
      </button>
      {open && <div className="border-t border-slate-200 px-4 pb-4 pt-3 dark:border-slate-800">{children}</div>}
    </div>
  );
}

function KeyValueEditor({
  rows,
  setRows,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
}: {
  rows: KV[];
  setRows: (rows: KV[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}) {
  const update = (id: string, patch: Partial<KV>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: string) => setRows(rows.filter((r) => r.id !== id));
  const add = () => setRows([...rows, emptyRow()]);

  return (
    <div className="space-y-2 p-4">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={row.enabled}
            onChange={(e) => update(row.id, { enabled: e.target.checked })}
            className="h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 dark:border-slate-600 dark:bg-slate-800"
          />
          <input
            value={row.key}
            onChange={(e) => update(row.id, { key: e.target.value })}
            placeholder={keyPlaceholder}
            className="w-1/3 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            value={row.value}
            onChange={(e) => update(row.id, { value: e.target.value })}
            placeholder={valuePlaceholder}
            className="flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <button
            onClick={() => remove(row.id)}
            aria-label="Remove row"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-slate-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
      >
        <Plus className="h-4 w-4" /> Add row
      </button>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          /* clipboard unavailable — ignore */
        }
      }}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Request flow diagram (inline SVG "sketch")                          */
/* ------------------------------------------------------------------ */

function RequestFlowDiagram() {
  return (
    <svg
      viewBox="0 0 720 200"
      className="h-auto w-full"
      role="img"
      aria-label="Diagram of client sending a request through the network to a server and back"
    >
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" className="fill-slate-400 dark:fill-slate-500" />
        </marker>
      </defs>

      {/* Client */}
      <g>
        <rect x="10" y="60" width="120" height="80" rx="10" className="fill-indigo-50 stroke-indigo-300 dark:fill-indigo-500/10 dark:stroke-indigo-500/40" strokeWidth="1.5" />
        <text x="70" y="105" textAnchor="middle" className="fill-slate-700 text-[13px] font-semibold dark:fill-slate-200">This page</text>
        <text x="70" y="122" textAnchor="middle" className="fill-slate-400 text-[10px] dark:fill-slate-500">(the client)</text>
      </g>

      {/* Network cloud */}
      <g>
        <ellipse cx="360" cy="55" rx="70" ry="26" className="fill-slate-100 stroke-slate-300 dark:fill-slate-800 dark:stroke-slate-700" strokeWidth="1.5" />
        <text x="360" y="60" textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">Network / CORS</text>
      </g>

      {/* Server */}
      <g>
        <rect x="590" y="60" width="120" height="80" rx="10" className="fill-emerald-50 stroke-emerald-300 dark:fill-emerald-500/10 dark:stroke-emerald-500/40" strokeWidth="1.5" />
        <text x="650" y="105" textAnchor="middle" className="fill-slate-700 text-[13px] font-semibold dark:fill-slate-200">API server</text>
        <text x="650" y="122" textAnchor="middle" className="fill-slate-400 text-[10px] dark:fill-slate-500">(the target URL)</text>
      </g>

      {/* Request arrow */}
      <line x1="130" y1="85" x2="585" y2="85" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="360" y="80" textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">Request → method, URL, headers, body</text>

      {/* Response arrow */}
      <line x1="585" y1="120" x2="130" y2="120" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="360" y="140" textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">← Response — status, headers, body</text>
    </svg>
  );
}

function StatusRangeSketch() {
  const ranges = [
    { range: "1xx", label: "Informational", color: "bg-slate-300 dark:bg-slate-600" },
    { range: "2xx", label: "Success", color: "bg-emerald-400" },
    { range: "3xx", label: "Redirection", color: "bg-blue-400" },
    { range: "4xx", label: "Client error", color: "bg-amber-400" },
    { range: "5xx", label: "Server error", color: "bg-rose-400" },
  ];
  return (
    <div className="space-y-2">
      {ranges.map((r) => (
        <div key={r.range} className="flex items-center gap-3 text-xs">
          <span className="w-10 shrink-0 font-mono font-semibold text-slate-600 dark:text-slate-300">{r.range}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className={`h-full w-full ${r.color}`} />
          </div>
          <span className="w-28 shrink-0 text-slate-500 dark:text-slate-400">{r.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page                                                           */
/* ------------------------------------------------------------------ */

const HISTORY_KEY = "api-tester:history";

export default function ApiTesterPage() {
  const [method, setMethod] = useState<Method>("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [tab, setTab] = useState<"params" | "headers" | "body" | "auth">("params");

  const [params, setParams] = useState<KV[]>([emptyRow()]);
  const [headers, setHeaders] = useState<KV[]>([emptyRow()]);

  const [bodyMode, setBodyMode] = useState<BodyMode>("json");
  const [jsonBody, setJsonBody] = useState('{\n  "title": "hello",\n  "body": "world"\n}');
  const [textBody, setTextBody] = useState("");
  const [formRows, setFormRows] = useState<KV[]>([emptyRow()]);

  const [authMode, setAuthMode] = useState<AuthMode>("none");
  const [bearerToken, setBearerToken] = useState("");
  const [basicUser, setBasicUser] = useState("");
  const [basicPass, setBasicPass] = useState("");
  const [apiKeyName, setApiKeyName] = useState("X-API-Key");
  const [apiKeyValue, setApiKeyValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ResponseState | null>(null);
  const [responseTab, setResponseTab] = useState<"body" | "headers">("body");

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  // Load / persist history in localStorage — this is regular app code
  // (not a Claude.ai artifact), so browser storage is safe to use here.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      /* ignore corrupt/missing history */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
    } catch {
      /* storage full / unavailable — non-fatal */
    }
  }, [history]);

  const builtUrl = useMemo(() => {
    try {
      const u = new URL(url);
      params
        .filter((p) => p.enabled && p.key)
        .forEach((p) => u.searchParams.set(p.key, p.value));
      return u.toString();
    } catch {
      return url;
    }
  }, [url, params]);

  async function handleSend() {
    setError(null);
    setResponse(null);
    setLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const finalHeaders = new Headers();
    headers
      .filter((h) => h.enabled && h.key)
      .forEach((h) => finalHeaders.set(h.key, h.value));

    if (authMode === "bearer" && bearerToken) {
      finalHeaders.set("Authorization", `Bearer ${bearerToken}`);
    } else if (authMode === "basic" && (basicUser || basicPass)) {
      const token = typeof btoa !== "undefined" ? btoa(`${basicUser}:${basicPass}`) : "";
      finalHeaders.set("Authorization", `Basic ${token}`);
    } else if (authMode === "apikey" && apiKeyName && apiKeyValue) {
      finalHeaders.set(apiKeyName, apiKeyValue);
    }

    let bodyPayload: BodyInit | undefined;
    const methodHasBody = !["GET", "HEAD"].includes(method);

    if (methodHasBody) {
      if (bodyMode === "json" && jsonBody.trim()) {
        if (!finalHeaders.has("Content-Type")) finalHeaders.set("Content-Type", "application/json");
        bodyPayload = jsonBody;
      } else if (bodyMode === "text" && textBody) {
        if (!finalHeaders.has("Content-Type")) finalHeaders.set("Content-Type", "text/plain");
        bodyPayload = textBody;
      } else if (bodyMode === "form") {
        const usp = new URLSearchParams();
        formRows.filter((r) => r.enabled && r.key).forEach((r) => usp.append(r.key, r.value));
        if (!finalHeaders.has("Content-Type"))
          finalHeaders.set("Content-Type", "application/x-www-form-urlencoded");
        bodyPayload = usp.toString();
      }
    }

    const startedAt = performance.now();
    const historyId = uid();

    try {
      const res = await fetch(builtUrl, {
        method,
        headers: finalHeaders,
        body: bodyPayload,
        signal: controller.signal,
      });
      const timeMs = Math.round(performance.now() - startedAt);
      const text = await res.text();
      const resHeaders: [string, string][] = [];
      res.headers.forEach((v, k) => resHeaders.push([k, v]));
      const { pretty, isJson } = tryPrettyJson(text);

      const resultState: ResponseState = {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        timeMs,
        sizeBytes: bytesOf(text),
        headers: resHeaders,
        bodyText: pretty,
        bodyIsJson: isJson,
      };
      setResponse(resultState);
      setHistory((h) => [
        { id: historyId, method, url: builtUrl, status: res.status, ok: res.ok, timeMs, timestamp: Date.now() },
        ...h,
      ].slice(0, 30));
    } catch (err) {
      const timeMs = Math.round(performance.now() - startedAt);
      const message =
        err instanceof DOMException && err.name === "AbortError"
          ? "Request cancelled."
          : err instanceof Error
          ? err.message
          : "Request failed.";
      setError(message);
      setHistory((h) => [
        { id: historyId, method, url: builtUrl, timestamp: Date.now(), timeMs },
        ...h,
      ].slice(0, 30));
    } finally {
      setLoading(false);
    }
  }

  function loadFromHistory(item: HistoryItem) {
    setMethod(item.method);
    setUrl(item.url);
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/*
        NOTE: the site-wide header with the light/dark toggle is assumed to
        live in a layout above this page. This local page header is just
        title + description and inherits whatever theme the toggle sets.
      */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">API Tester</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Build a request, send it, and inspect the response - with reference material alongside so you don't
            have to leave the page.
          </p>
        </div>

        {/* ---------------- Important things to keep in mind ---------------- */}
        <div className="mb-6">
          <Collapsible
            title="Important things to keep in mind"
            icon={<AlertTriangle className="h-4 w-4" />}
            tone="warning"
            defaultOpen
          >
            <ul className="grid gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span><strong className="font-medium text-slate-800 dark:text-slate-100">CORS</strong> is enforced by the browser, not this tool - requests to servers that don't allow your origin will fail here even if they'd work from a backend or Postman.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span><strong className="font-medium text-slate-800 dark:text-slate-100">Secrets in the browser</strong> - tokens/keys typed here are visible in devtools and (if you persist history) in localStorage. Don't paste production secrets on a shared machine.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span><strong className="font-medium text-slate-800 dark:text-slate-100">GET/HEAD have no body</strong> - some servers reject or silently drop a body sent with these methods.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span><strong className="font-medium text-slate-800 dark:text-slate-100">Content-Type must match the body</strong> - sending JSON without <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">application/json</code> is a common source of 400s.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span><strong className="font-medium text-slate-800 dark:text-slate-100">Idempotency</strong> - retrying a failed POST can create duplicates; GET/PUT/DELETE are generally safe to retry.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span><strong className="font-medium text-slate-800 dark:text-slate-100">Rate limits</strong> - a 429 means slow down; check for a <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">Retry-After</code> header before hammering the endpoint again.</span>
              </li>
            </ul>
          </Collapsible>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ---------------- Left/main: builder + response ---------------- */}
          <div className="space-y-6 lg:col-span-2">
            {/* Request bar */}
            <SectionCard>
              <div className="flex flex-col gap-3 p-4 sm:flex-row">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as Method)}
                  className={`rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 ${METHOD_COLORS[method]}`}
                >
                  {METHODS.map((m) => (
                    <option key={m} value={m} className="text-slate-900 dark:text-slate-100">
                      {m}
                    </option>
                  ))}
                </select>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com/resource"
                  className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !url}
                  className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {loading ? "Sending" : "Send"}
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 border-t border-slate-200 px-4 pt-2 dark:border-slate-800">
                {(["params", "headers", "body", "auth"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`rounded-t-md px-3 py-1.5 text-xs font-semibold capitalize transition ${
                      tab === t
                        ? "border-b-2 border-indigo-600 text-indigo-700 dark:text-indigo-400"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {tab === "params" && (
                <KeyValueEditor rows={params} setRows={setParams} keyPlaceholder="Param" valuePlaceholder="Value" />
              )}
              {tab === "headers" && (
                <KeyValueEditor rows={headers} setRows={setHeaders} keyPlaceholder="Header" valuePlaceholder="Value" />
              )}
              {tab === "body" && (
                <div className="space-y-3 p-4">
                  <div className="flex gap-1">
                    {(["none", "json", "text", "form"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setBodyMode(m)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize ${
                          bodyMode === m
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  {bodyMode === "json" && (
                    <textarea
                      value={jsonBody}
                      onChange={(e) => setJsonBody(e.target.value)}
                      rows={8}
                      spellCheck={false}
                      className="w-full rounded-md border border-slate-200 bg-white p-3 font-mono text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                  )}
                  {bodyMode === "text" && (
                    <textarea
                      value={textBody}
                      onChange={(e) => setTextBody(e.target.value)}
                      rows={8}
                      className="w-full rounded-md border border-slate-200 bg-white p-3 font-mono text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                  )}
                  {bodyMode === "form" && (
                    <KeyValueEditor rows={formRows} setRows={setFormRows} />
                  )}
                  {bodyMode === "none" && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">No body will be sent.</p>
                  )}
                </div>
              )}
              {tab === "auth" && (
                <div className="space-y-3 p-4">
                  <div className="flex gap-1">
                    {(["none", "bearer", "basic", "apikey"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setAuthMode(m)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize ${
                          authMode === m
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        }`}
                      >
                        {m === "apikey" ? "API Key" : m}
                      </button>
                    ))}
                  </div>
                  {authMode === "bearer" && (
                    <input
                      value={bearerToken}
                      onChange={(e) => setBearerToken(e.target.value)}
                      placeholder="Token"
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                  )}
                  {authMode === "basic" && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        value={basicUser}
                        onChange={(e) => setBasicUser(e.target.value)}
                        placeholder="Username"
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      />
                      <input
                        value={basicPass}
                        onChange={(e) => setBasicPass(e.target.value)}
                        placeholder="Password"
                        type="password"
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      />
                    </div>
                  )}
                  {authMode === "apikey" && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        value={apiKeyName}
                        onChange={(e) => setApiKeyName(e.target.value)}
                        placeholder="Header name"
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      />
                      <input
                        value={apiKeyValue}
                        onChange={(e) => setApiKeyValue(e.target.value)}
                        placeholder="Value"
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      />
                    </div>
                  )}
                  {authMode === "none" && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">No auth header will be added.</p>
                  )}
                </div>
              )}
            </SectionCard>

            {/* Response */}
            <SectionCard
              title="Response"
              icon={<Info className="h-4 w-4 text-slate-400" />}
              right={
                response && (
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${statusTone(response.status)}`}>
                      {response.status} {response.statusText}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" /> {response.timeMs} ms
                    </span>
                    <span className="text-xs text-slate-400">{formatBytes(response.sizeBytes)}</span>
                  </div>
                )
              }
            >
              {error && (
                <div className="m-4 flex items-start gap-2 rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {!error && !response && !loading && (
                <p className="p-4 text-sm text-slate-400 dark:text-slate-500">
                  Send a request to see the response here.
                </p>
              )}
              {loading && (
                <div className="flex items-center gap-2 p-4 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Waiting for response…
                </div>
              )}
              {response && (
                <div>
                  <div className="flex gap-1 border-b border-slate-200 px-4 pt-2 dark:border-slate-800">
                    {(["body", "headers"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setResponseTab(t)}
                        className={`rounded-t-md px-3 py-1.5 text-xs font-semibold capitalize ${
                          responseTab === t
                            ? "border-b-2 border-indigo-600 text-indigo-700 dark:text-indigo-400"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                    <div className="ml-auto flex items-center py-1">
                      <CopyButton text={responseTab === "body" ? response.bodyText : JSON.stringify(response.headers)} />
                    </div>
                  </div>
                  {responseTab === "body" && (
                    <pre className="max-h-96 overflow-auto p-4 font-mono text-xs text-slate-800 dark:text-slate-100">
{response.bodyText || "(empty body)"}
                    </pre>
                  )}
                  {responseTab === "headers" && (
                    <div className="max-h-96 overflow-auto p-4">
                      <table className="w-full text-left text-xs">
                        <tbody>
                          {response.headers.map(([k, v]) => (
                            <tr key={k} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                              <td className="py-1.5 pr-3 font-mono font-medium text-slate-600 dark:text-slate-300">{k}</td>
                              <td className="py-1.5 font-mono text-slate-500 dark:text-slate-400">{v}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </SectionCard>
          </div>

          {/* ---------------- Right rail: history + reference ---------------- */}
          <div className="space-y-6">
            {/* History */}
            <SectionCard
              title="History"
              icon={<HistoryIcon className="h-4 w-4 text-slate-400" />}
              right={
                history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500"
                  >
                    <X className="h-3.5 w-3.5" /> Clear
                  </button>
                )
              }
            >
              {history.length === 0 ? (
                <p className="p-4 text-xs text-slate-400 dark:text-slate-500">Sent requests will show up here.</p>
              ) : (
                <ul className="max-h-72 overflow-auto">
                  {history.map((h) => (
                    <li key={h.id}>
                      <button
                        onClick={() => loadFromHistory(h)}
                        className="flex w-full items-center gap-2 border-b border-slate-100 px-4 py-2 text-left text-xs last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                      >
                        <span className={`w-14 shrink-0 font-mono font-semibold ${METHOD_COLORS[h.method]}`}>{h.method}</span>
                        <span className="flex-1 truncate font-mono text-slate-600 dark:text-slate-300">{h.url}</span>
                        {h.status && (
                          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusTone(h.status)}`}>
                            {h.status}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            {/* Diagram */}
            <SectionCard title="How a request flows" icon={<Info className="h-4 w-4 text-slate-400" />}>
              <div className="p-4">
                <RequestFlowDiagram />
              </div>
            </SectionCard>

            {/* Cheat sheets */}
            <Collapsible title="Cheat sheet — HTTP methods" icon={<BookOpen className="h-4 w-4" />}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400">
                      <th className="pb-1.5 pr-2 font-medium">Method</th>
                      <th className="pb-1.5 pr-2 font-medium">Body?</th>
                      <th className="pb-1.5 pr-2 font-medium">Idempotent?</th>
                      <th className="pb-1.5 font-medium">Typical use</th>
                    </tr>
                  </thead>
                  <tbody>
                    {METHOD_CHEATS.map((m) => (
                      <tr key={m.method} className="border-t border-slate-100 dark:border-slate-800">
                        <td className={`py-1.5 pr-2 font-mono font-semibold ${METHOD_COLORS[m.method]}`}>{m.method}</td>
                        <td className="py-1.5 pr-2 text-slate-500 dark:text-slate-400">{m.body}</td>
                        <td className="py-1.5 pr-2 text-slate-500 dark:text-slate-400">{m.idempotent}</td>
                        <td className="py-1.5 text-slate-500 dark:text-slate-400">{m.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
                  *PATCH is idempotent only if the patch document is applied the same way each time.
                </p>
              </div>
            </Collapsible>

            <Collapsible title="Cheat sheet — status codes" icon={<BookOpen className="h-4 w-4" />}>
              <div className="mb-3">
                <StatusRangeSketch />
              </div>
              <ul className="space-y-1 text-xs">
                {STATUS_CODES.map((s) => (
                  <li key={s.code} className="flex gap-2">
                    <span className={`w-16 shrink-0 rounded px-1.5 py-0.5 text-center font-mono font-semibold ${statusTone(parseInt(s.code))}`}>
                      {s.code}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{s.label}</span>
                  </li>
                ))}
              </ul>
            </Collapsible>

            <Collapsible title="Cheat sheet — common headers" icon={<BookOpen className="h-4 w-4" />}>
              <ul className="space-y-2 text-xs">
                {COMMON_HEADERS.map((h) => (
                  <li key={h.name}>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{h.name}</span>
                    <p className="text-slate-500 dark:text-slate-400">{h.use}</p>
                  </li>
                ))}
              </ul>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}