"use client";

/**
 * category/api/page.tsx
 * -----------------------------------------------------------------------
 * A complete, self-contained "API — The Full Field Guide" learning page.
 *
 * DARK MODE NOTE:
 * This page uses Tailwind's `dark:` variants throughout. It assumes your
 * project's tailwind.config has `darkMode: "class"` and that the light/dark
 * toggle button already living in your header adds/removes the `dark`
 * class on <html> (e.g. via next-themes). No extra toggle is added here —
 * this page simply reacts to that class, background included.
 *
 * No external UI kit is required — only `lucide-react`, which is already
 * available in this project's dependency set.
 * -----------------------------------------------------------------------
 */

import { useMemo, useState } from "react";
import {
  Cable,
  Network,
  ShieldCheck,
  Gauge,
  Boxes,
  Terminal,
  BookOpen,
  Sparkles,
  Download,
  ChevronDown,
  ArrowRightLeft,
  Radio,
  Webhook,
  Rocket,
  ThumbsUp,
  ThumbsDown,
  Bot,
  KeyRound,
  RefreshCw,
  Layers,
  Globe2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens (see comment block above for palette rationale)     */
/*  paper:        #FFFFFF   ink:        #10151F                       */
/*  blueprint-bg: #0A1420   blueprint-fg:#D8E6F5                      */
/*  signal (primary accent):  #3B82F6                                 */
/*  circuit (signature accent): #F5A623                               */
/*  slate (muted/borders):   #64748B                                  */
/* ------------------------------------------------------------------ */

const CARD =
  "rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm dark:border-slate-800 dark:bg-[#0F1B2C]/70";

function Tag({ method, path }: { method: string; path: string }) {
  const colors: Record<string, string> = {
    GET: "text-[#3B82F6] border-[#3B82F6]/30 bg-[#3B82F6]/10",
    POST: "text-[#22C55E] border-[#22C55E]/30 bg-[#22C55E]/10",
    PUT: "text-[#F5A623] border-[#F5A623]/30 bg-[#F5A623]/10",
    DELETE: "text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/10",
  };
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs">
      <span
        className={`rounded-md border px-2 py-0.5 font-bold tracking-wide ${
          colors[method] ?? colors.GET
        }`}
      >
        {method}
      </span>
      <span className="text-slate-500 dark:text-slate-400">{path}</span>
    </span>
  );
}

function SectionHeader({
  method,
  path,
  title,
  icon: Icon,
  kicker,
}: {
  method: string;
  path: string;
  title: string;
  icon: any;
  kicker: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <Tag method={method} path={path} />
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/10 p-2 text-[#3B82F6]">
          <Icon size={22} strokeWidth={1.75} />
        </div>
        <h2 className="font-mono text-2xl font-bold tracking-tight text-[#10151F] dark:text-[#D8E6F5] sm:text-3xl">
          {title}
        </h2>
      </div>
      <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
        {kicker}
      </p>
    </div>
  );
}

/** Dashed connector between endpoint sections — reads like a schematic trace */
function Connector() {
  return (
    <div className="mx-auto flex h-14 w-px flex-col items-center">
      <div className="h-full w-px border-l-2 border-dashed border-slate-300 dark:border-slate-700" />
      <div className="-mt-1 h-2 w-2 rounded-full bg-[#F5A623]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Content data                                                      */
/* ------------------------------------------------------------------ */

const API_TYPES = [
  {
    name: "REST",
    tag: "GET /types/rest",
    desc: "Resource-oriented architecture over HTTP. Uses standard verbs (GET, POST, PUT, DELETE) and URLs to represent resources.",
    pros: ["Simple & widely understood", "Cacheable via HTTP", "Stateless, scales horizontally"],
    cons: ["Over/under-fetching data", "Multiple round trips for nested data"],
    example: "GET /api/users/42",
  },
  {
    name: "GraphQL",
    tag: "GET /types/graphql",
    desc: "A query language where the client specifies exactly the shape of data it needs, in a single request to one endpoint.",
    pros: ["No over/under-fetching", "Single endpoint", "Strongly typed schema"],
    cons: ["Caching is harder", "Query complexity can hurt performance"],
    example: "POST /graphql  { user(id: 42) { name email } }",
  },
  {
    name: "SOAP",
    tag: "GET /types/soap",
    desc: "A strict, XML-based protocol with built-in standards for security (WS-Security) and transactions. Common in banking/enterprise.",
    pros: ["Strong typing via WSDL", "Built-in error handling", "Enterprise-grade security"],
    cons: ["Verbose XML payloads", "Slower & harder to work with"],
    example: "<soap:Envelope>...<GetUser/>...</soap:Envelope>",
  },
  {
    name: "gRPC",
    tag: "GET /types/grpc",
    desc: "A high-performance RPC framework from Google using Protocol Buffers and HTTP/2 for fast, binary, streaming communication.",
    pros: ["Very fast (binary + HTTP/2)", "Bi-directional streaming", "Auto-generated client code"],
    cons: ["Not human-readable", "Limited browser support"],
    example: "rpc GetUser(UserRequest) returns (UserResponse);",
  },
  {
    name: "WebSocket",
    tag: "GET /types/websocket",
    desc: "A persistent, full-duplex connection between client and server — ideal for real-time, bidirectional communication.",
    pros: ["Real-time, low latency", "Server can push data anytime"],
    cons: ["Connection must stay open", "Harder to scale/load-balance"],
    example: "ws://api.example.com/live-chat",
  },
  {
    name: "Webhook",
    tag: "GET /types/webhook",
    desc: "A 'reverse API' — instead of you polling a server, the server calls a URL you registered when an event happens.",
    pros: ["No polling needed", "Efficient, event-driven"],
    cons: ["You must expose a public endpoint", "Delivery/retry logic needed"],
    example: "POST https://yourapp.com/webhooks/payment-success",
  },
];

const FORMULAS = [
  {
    name: "Token Bucket Rate Limiting",
    formula: "tokens(t) = min( capacity, tokens(t−Δt) + r · Δt )",
    explain:
      "A bucket refills at rate r tokens/second up to a max capacity. Each request consumes 1 token; if the bucket is empty, the request is throttled (HTTP 429).",
  },
  {
    name: "Little's Law (Throughput)",
    formula: "L = λ × W",
    explain:
      "Average number of in-flight requests (L) equals arrival rate (λ, req/sec) times average time each request spends in the system (W, sec). Used to size server capacity.",
  },
  {
    name: "API Availability (Uptime)",
    formula: "Availability % = ((Total time − Downtime) / Total time) × 100",
    explain:
      "The classic SLA number. 99.9% ('three nines') allows ~8.7 hours of downtime a year; 99.99% allows ~52 minutes.",
  },
  {
    name: "Exponential Backoff with Jitter",
    formula: "wait = min( cap, base × 2^attempt ) + random(0, jitter)",
    explain:
      "Used by clients retrying failed requests. Delay doubles each retry up to a cap, and random jitter is added so many clients don't retry in lockstep (the 'thundering herd').",
  },
  {
    name: "Pagination Offset",
    formula: "offset = (page − 1) × limit",
    explain:
      "Converts a page number + page size into the SQL/API offset used to fetch the correct slice of records.",
  },
  {
    name: "Success / Error Rate",
    formula: "Success Rate % = (Successful Requests ÷ Total Requests) × 100",
    explain:
      "Core health metric for any API — tracked per endpoint to catch regressions (commonly paired with p95/p99 latency).",
  },
  {
    name: "Latency Percentile (p95)",
    formula: "p95 = value below which 95% of response times fall",
    explain:
      "Better than average latency because it reflects the experience of your slowest real users, not just the typical case.",
  },
];

const NOTES: { title: string; icon: any; body: string[] }[] = [
  {
    title: "HTTP Methods",
    icon: ArrowRightLeft,
    body: [
      "GET — retrieve a resource, safe & idempotent, no body.",
      "POST — create a resource or trigger an action, not idempotent.",
      "PUT — replace a resource entirely, idempotent.",
      "PATCH — partially update a resource, not guaranteed idempotent.",
      "DELETE — remove a resource, idempotent.",
      "HEAD — like GET but returns headers only, used for existence/metadata checks.",
      "OPTIONS — asks the server which methods/headers are allowed (used heavily in CORS preflight).",
    ],
  },
  {
    title: "HTTP Status Codes",
    icon: Gauge,
    body: [
      "1xx Informational — request received, continuing process (e.g. 100 Continue).",
      "2xx Success — 200 OK, 201 Created, 202 Accepted, 204 No Content.",
      "3xx Redirection — 301 Moved Permanently, 302 Found, 304 Not Modified.",
      "4xx Client Error — 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests.",
      "5xx Server Error — 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout.",
    ],
  },
  {
    title: "Authentication & Authorization",
    icon: KeyRound,
    body: [
      "API Key — a static secret string sent in a header/query param; simple but hard to rotate/scope.",
      "Basic Auth — base64-encoded username:password in the Authorization header; must be used over HTTPS.",
      "OAuth 2.0 — delegated authorization; a client gets a short-lived access token via an authorization server without ever seeing the user's password.",
      "JWT (JSON Web Token) — a signed, self-contained token carrying claims (user id, roles, expiry) that the server can verify without a database lookup.",
      "HMAC Signatures — the client signs the request with a shared secret; the server recomputes the signature to verify integrity and authenticity (common for webhooks).",
    ],
  },
  {
    title: "REST's 6 Guiding Constraints",
    icon: Layers,
    body: [
      "Client–Server — separation of concerns between UI and data storage.",
      "Statelessness — every request contains all the information needed; the server holds no client session.",
      "Cacheability — responses must define themselves as cacheable or not.",
      "Uniform Interface — consistent resource-based URLs and standard verbs.",
      "Layered System — client can't tell if it's talking directly to the server or through an intermediary (gateway, proxy, CDN).",
      "Code on Demand (optional) — servers can extend client functionality by sending executable code.",
    ],
  },
  {
    title: "Idempotency",
    icon: RefreshCw,
    body: [
      "An idempotent operation produces the same result no matter how many times it's repeated.",
      "GET, PUT, DELETE are idempotent by spec; POST is not.",
      "Practically: payment APIs use an 'Idempotency-Key' header so a retried POST (e.g. after a timeout) never double-charges a customer.",
    ],
  },
  {
    title: "Versioning Strategies",
    icon: Boxes,
    body: [
      "URI versioning — /v1/users, /v2/users. Simple, explicit, most common.",
      "Header versioning — Accept: application/vnd.myapi.v2+json. Keeps URLs clean.",
      "Query param versioning — /users?version=2. Easy but easy to miss.",
      "Rule of thumb: never break a live version; deprecate with notice and sunset dates.",
    ],
  },
  {
    title: "CORS (Cross-Origin Resource Sharing)",
    icon: Globe2,
    body: [
      "A browser security mechanism that blocks a webpage from calling an API on a different origin unless the API explicitly allows it.",
      "The server responds with headers like Access-Control-Allow-Origin, -Methods, and -Headers.",
      "Complex requests (custom headers, non-simple methods) trigger a preflight OPTIONS request first.",
    ],
  },
  {
    title: "Webhooks vs Polling",
    icon: Webhook,
    body: [
      "Polling — the client repeatedly asks 'anything new?' on a timer. Simple, but wasteful and adds latency.",
      "Webhooks — the server pushes a POST to your URL the instant something happens. Efficient, but requires a public endpoint, retry handling, and signature verification.",
      "Long-polling and WebSockets sit in between — good middle grounds for near-real-time needs without full webhook infrastructure.",
    ],
  },
];

const CHEAT_METHODS = [
  ["GET", "Read", "Yes", "Yes", "No body"],
  ["POST", "Create / action", "No", "No", "Has body"],
  ["PUT", "Replace", "Yes", "No", "Has body"],
  ["PATCH", "Partial update", "Usually not", "No", "Has body"],
  ["DELETE", "Remove", "Yes", "No", "Optional body"],
];

const CHEAT_CODES = [
  ["200", "OK — request succeeded"],
  ["201", "Created — new resource made"],
  ["204", "No Content — success, empty body"],
  ["400", "Bad Request — malformed input"],
  ["401", "Unauthorized — missing/invalid auth"],
  ["403", "Forbidden — authenticated but not allowed"],
  ["404", "Not Found — resource doesn't exist"],
  ["409", "Conflict — state conflict (e.g. duplicate)"],
  ["422", "Unprocessable Entity — validation failed"],
  ["429", "Too Many Requests — rate limited"],
  ["500", "Internal Server Error"],
  ["503", "Service Unavailable — server overloaded/down"],
];

const CHEAT_HEADERS = [
  ["Authorization", "Credentials: Bearer <token>, Basic <base64>"],
  ["Content-Type", "Format of the request body, e.g. application/json"],
  ["Accept", "Format the client wants back"],
  ["X-API-Key", "Common custom header for API-key auth"],
  ["Idempotency-Key", "Unique id to make a retried POST safe"],
  ["ETag / If-None-Match", "Caching & conditional requests"],
  ["Retry-After", "Server tells client how long to wait before retrying"],
];

const BUILD_STEPS = [
  {
    title: "Define the problem & data",
    detail:
      "Pick a narrow task (classify text, forecast a number, generate an image) and gather/clean a labeled dataset.",
  },
  {
    title: "Choose a framework",
    detail:
      "PyTorch or TensorFlow for training from scratch; or fine-tune/prompt an existing foundation model via its API (OpenAI, Anthropic, HuggingFace) to skip training entirely.",
  },
  {
    title: "Train / fine-tune the model",
    detail:
      "Split data into train/validation/test sets, train, and evaluate with the right metric (accuracy, F1, RMSE) — iterate until it's good enough to ship.",
  },
  {
    title: "Export & serve the model",
    detail:
      "Save weights (ONNX, SavedModel, .pt) and load them in a lightweight Python web server such as FastAPI or Flask.",
  },
  {
    title: "Wrap it in an API",
    detail:
      "Expose an endpoint like POST /predict that accepts input JSON, runs model.predict(), and returns a JSON response — this is the contract the outside world uses.",
  },
  {
    title: "Add auth, validation & rate limiting",
    detail:
      "Protect the endpoint with an API key or OAuth, validate incoming payloads (e.g. Pydantic), and apply the token-bucket formula above so one caller can't exhaust your GPU.",
  },
  {
    title: "Containerize & deploy",
    detail:
      "Package with Docker, deploy to a host (AWS, GCP, Render, Fly.io) behind HTTPS, and put it behind a gateway/load balancer for scale.",
  },
  {
    title: "Monitor & iterate",
    detail:
      "Log latency, error rate, and input drift. Retrain or fine-tune as real-world data comes in — the API layer is what lets other apps consume your model without ever seeing its internals.",
  },
];

const USE_CASES = [
  "Payments — Stripe/PayPal APIs move money without you handling card data directly.",
  "Maps & location — Google Maps API renders maps and computes routes inside third-party apps.",
  "AI & ML — OpenAI, Anthropic, and HuggingFace APIs let any app add language or vision intelligence.",
  "Social login — 'Sign in with Google/GitHub' is OAuth2 APIs delegating identity.",
  "IoT — smart devices report sensor data and accept commands through lightweight APIs.",
  "Weather, finance & data feeds — real-time stock, currency, and weather data via public APIs.",
];

const FEATURES = [
  "Abstraction — hides internal complexity behind a simple, stable contract.",
  "Reusability — one backend can power web, mobile, and third-party apps at once.",
  "Interoperability — lets systems written in different languages talk to each other.",
  "Security boundary — controls exactly what data/actions are exposed, and to whom.",
  "Scalability — stateless APIs can be load-balanced and cached independently of the client.",
];

const FUTURE = [
  "AI-native APIs — LLMs are increasingly consumed as APIs themselves, and are also starting to call other APIs autonomously ('tool use' / agents).",
  "GraphQL & typed schemas growing for complex, data-heavy frontends.",
  "Event-driven & streaming APIs (gRPC streams, WebSockets, Kafka-backed APIs) for real-time products.",
  "API-as-a-product — companies increasingly monetize APIs directly (usage-based billing, marketplaces).",
  "Stronger standardization around API security (zero-trust, mTLS, fine-grained OAuth scopes).",
];

const PROS = [
  "Faster development — reuse existing services instead of building from scratch.",
  "Enables integration between completely different systems/platforms.",
  "Encourages modular, maintainable architecture (microservices).",
  "Opens new business models — API-first companies, developer ecosystems.",
];

const CONS = [
  "Adds a dependency — if the API goes down or changes, your app breaks.",
  "Security surface — every exposed endpoint is a potential attack vector.",
  "Costs — many APIs are metered/paid, and usage can scale expensively.",
  "Versioning & breaking changes require ongoing maintenance discipline.",
];

/* ------------------------------------------------------------------ */
/*  Downloadable notes (markdown, generated client-side)              */
/* ------------------------------------------------------------------ */

function buildMarkdownNotes() {
  const lines: string[] = [];
  lines.push("# API — The Full Field Guide (Notes)\n");
  lines.push("## What is an API?");
  lines.push(
    "An API (Application Programming Interface) is a contract that lets two pieces of software talk to each other — a defined set of endpoints, inputs, and outputs, without either side needing to know the other's internal code.\n"
  );
  lines.push("## Why use / why need an API?");
  lines.push(
    "- Abstraction: hide internal complexity behind a simple interface.\n- Reusability: one backend serves many clients (web, mobile, third parties).\n- Interoperability: connect systems built in different languages/stacks.\n- Security: control precisely what is exposed.\n- Scalability: stateless APIs can be cached and load-balanced independently.\n"
  );
  lines.push("## Types of APIs");
  API_TYPES.forEach((t) => {
    lines.push(`### ${t.name}`);
    lines.push(t.desc);
    lines.push(`Pros: ${t.pros.join("; ")}`);
    lines.push(`Cons: ${t.cons.join("; ")}`);
    lines.push(`Example: ${t.example}\n`);
  });
  lines.push("## Key Formulas");
  FORMULAS.forEach((f) => {
    lines.push(`### ${f.name}`);
    lines.push(`Formula: ${f.formula}`);
    lines.push(`${f.explain}\n`);
  });
  lines.push("## Detailed Notes");
  NOTES.forEach((n) => {
    lines.push(`### ${n.title}`);
    n.body.forEach((b) => lines.push(`- ${b}`));
    lines.push("");
  });
  lines.push("## Cheat Sheet — HTTP Methods");
  lines.push("| Method | Purpose | Idempotent | Cacheable | Body |");
  lines.push("|---|---|---|---|---|");
  CHEAT_METHODS.forEach((r) => lines.push(`| ${r.join(" | ")} |`));
  lines.push("\n## Cheat Sheet — Status Codes");
  CHEAT_CODES.forEach((c) => lines.push(`- **${c[0]}** — ${c[1]}`));
  lines.push("\n## Cheat Sheet — Common Headers");
  CHEAT_HEADERS.forEach((h) => lines.push(`- **${h[0]}** — ${h[1]}`));
  lines.push("\n## Building Your Own AI Model Behind an API");
  BUILD_STEPS.forEach((s, i) => lines.push(`${i + 1}. **${s.title}** — ${s.detail}`));
  lines.push("\n## Use Cases");
  USE_CASES.forEach((u) => lines.push(`- ${u}`));
  lines.push("\n## Features");
  FEATURES.forEach((f) => lines.push(`- ${f}`));
  lines.push("\n## The Future of APIs");
  FUTURE.forEach((f) => lines.push(`- ${f}`));
  lines.push("\n## Good Side (Pros)");
  PROS.forEach((p) => lines.push(`- ${p}`));
  lines.push("\n## Bad Side (Cons)");
  CONS.forEach((c) => lines.push(`- ${c}`));
  lines.push("\n---\nGenerated from the API Field Guide page. Happy building!");
  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/*  Diagrams (inline SVG, theme-aware via currentColor)                */
/* ------------------------------------------------------------------ */

function ArchitectureDiagram() {
  return (
    <svg viewBox="0 0 800 320" className="w-full text-slate-700 dark:text-slate-300">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#3B82F6" />
        </marker>
      </defs>
      {/* Client */}
      <rect x="20" y="130" width="130" height="60" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="85" y="165" textAnchor="middle" className="fill-current font-mono text-[13px]">Client App</text>

      <line x1="150" y1="160" x2="230" y2="160" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrow)" />
      <text x="190" y="148" textAnchor="middle" className="fill-current font-mono text-[10px]" fill="#3B82F6">HTTPS</text>

      {/* API Gateway */}
      <rect x="230" y="110" width="150" height="100" rx="10" fill="none" stroke="#F5A623" strokeWidth="1.5" />
      <text x="305" y="150" textAnchor="middle" className="fill-current font-mono text-[13px]">API Gateway</text>
      <text x="305" y="168" textAnchor="middle" className="fill-current font-mono text-[10px]">auth · rate-limit</text>
      <text x="305" y="184" textAnchor="middle" className="fill-current font-mono text-[10px]">routing</text>

      <line x1="380" y1="160" x2="460" y2="160" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrow)" />

      {/* Backend services */}
      <rect x="460" y="60" width="150" height="55" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="535" y="92" textAnchor="middle" className="fill-current font-mono text-[12px]">Service A</text>

      <rect x="460" y="135" width="150" height="55" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="535" y="167" textAnchor="middle" className="fill-current font-mono text-[12px]">Service B</text>

      <rect x="460" y="210" width="150" height="55" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="535" y="242" textAnchor="middle" className="fill-current font-mono text-[12px]">Service C</text>

      <line x1="610" y1="87" x2="680" y2="160" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3,3" />
      <line x1="610" y1="162" x2="680" y2="160" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3,3" />
      <line x1="610" y1="237" x2="680" y2="160" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3,3" />

      {/* Database */}
      <ellipse cx="720" cy="140" rx="45" ry="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M675,140 L675,190 A45,14 0 0 0 765,190 L765,140" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="720" y="215" textAnchor="middle" className="fill-current font-mono text-[11px]">Database</text>
    </svg>
  );
}

function RequestResponseDiagram() {
  return (
    <svg viewBox="0 0 700 220" className="w-full text-slate-700 dark:text-slate-300">
      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#3B82F6" />
        </marker>
        <marker id="arrow3" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#22C55E" />
        </marker>
      </defs>
      <rect x="20" y="80" width="140" height="60" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="90" y="115" textAnchor="middle" className="fill-current font-mono text-[13px]">Client</text>

      <rect x="540" y="80" width="140" height="60" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="610" y="115" textAnchor="middle" className="fill-current font-mono text-[13px]">Server</text>

      <line x1="160" y1="95" x2="540" y2="95" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrow2)" />
      <text x="350" y="80" textAnchor="middle" className="fill-current font-mono text-[11px]" fill="#3B82F6">
        Request: GET /users/42  (headers, body)
      </text>

      <line x1="540" y1="130" x2="160" y2="130" stroke="#22C55E" strokeWidth="2" markerEnd="url(#arrow3)" />
      <text x="350" y="150" textAnchor="middle" className="fill-current font-mono text-[11px]" fill="#22C55E">
        Response: 200 OK  (headers, JSON body)
      </text>
    </svg>
  );
}

function OAuthFlowDiagram() {
  const steps = [
    "1. User clicks 'Log in with X'",
    "2. App redirects to Auth Server",
    "3. User approves access",
    "4. Auth Server returns code",
    "5. App exchanges code for token",
    "6. App calls API with token",
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {steps.map((s, i) => (
        <div
          key={i}
          className="rounded-xl border border-dashed border-slate-300 p-3 font-mono text-[11px] text-slate-600 dark:border-slate-700 dark:text-slate-300"
        >
          {s}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Accordion item                                                    */
/* ------------------------------------------------------------------ */

function AccordionItem({
  title,
  icon: Icon,
  body,
  isOpen,
  onToggle,
}: {
  title: string;
  icon: any;
  body: string[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`${CARD} overflow-hidden`}>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-3">
          <Icon size={18} className="text-[#3B82F6]" strokeWidth={1.75} />
          <span className="font-mono text-sm font-semibold text-[#10151F] dark:text-[#D8E6F5]">
            {title}
          </span>
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <ul className="space-y-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          {body.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5A623]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ApiFieldGuidePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showThanks, setShowThanks] = useState(false);
  const notesContent = useMemo(() => buildMarkdownNotes(), []);

  function handleDownload() {
    const blob = new Blob([notesContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "API-Field-Guide-Notes.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setShowThanks(true);
    window.setTimeout(() => setShowThanks(false), 4500);
  }

  return (
    <div className="min-h-screen bg-white text-[#10151F] transition-colors duration-300 dark:bg-[#0A1420] dark:text-[#D8E6F5]">
      {/* ---------------------------------------------------------- */}
      {/* Hero                                                        */}
      {/* ---------------------------------------------------------- */}
      <header className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1 font-mono text-xs text-[#3B82F6]">
            <Cable size={14} /> connection established
          </div>
          <h1 className="font-mono text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            API <span className="text-[#3B82F6]">.</span> Field Guide
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Everything about Application Programming Interfaces - what they are,
            why they exist, every major type, the formulas behind rate limits and
            uptime, diagrams of how requests actually travel, cheat sheets, and a
            walkthrough of wiring your own AI model up as an API.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-3 font-mono text-sm font-semibold text-white shadow-lg shadow-[#3B82F6]/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download size={18} /> Download API Notes
            </button>
            <span className="font-mono text-xs text-slate-400">
              free · no signup · ~1 min read summary
            </span>
          </div>

          {/* mini request/response chip — signature element */}
          <div className={`mt-10 max-w-md ${CARD} p-4 font-mono text-xs`}>
            <div className="mb-2 flex items-center gap-2 text-[#22C55E]">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" /> 200 OK · 84ms
            </div>
            <pre className="whitespace-pre-wrap text-slate-500 dark:text-slate-400">{`GET /api/v1/whatIsAnApi
{
  "answer": "a contract two programs use to talk",
  "returns": "predictable, structured data"
}`}</pre>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* ---------------------------------------------------------- */}
        {/* What is an API / Why use it                                */}
        {/* ---------------------------------------------------------- */}
        <section>
          <SectionHeader
            method="GET"
            path="/overview"
            title="What is an API — and why does it exist?"
            icon={Network}
            kicker="The one-sentence version, then the reasons it became the backbone of modern software."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${CARD} p-5`}>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#3B82F6]">Definition</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                An <strong>API (Application Programming Interface)</strong> is a defined
                set of rules — endpoints, request formats, and response formats —
                that lets one piece of software ask another piece of software to
                do something or hand over data, without either side needing to
                know how the other is built internally.
              </p>
            </div>
            <div className={`${CARD} p-5`}>
              <h3 className="mb-2 font-mono text-sm font-semibold text-[#3B82F6]">
                A simple analogy
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Think of a restaurant menu. You (the client) don't walk into the
                kitchen and cook — you order from the menu (the API), the kitchen
                (the server) prepares it however it wants internally, and a
                waiter (the network) brings back exactly what you ordered.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {FEATURES.slice(0, 3).map((f, i) => (
              <div key={i} className={`${CARD} p-4`}>
                <ShieldCheck size={16} className="mb-2 text-[#F5A623]" />
                <p className="text-xs text-slate-600 dark:text-slate-300">{f}</p>
              </div>
            ))}
          </div>

          <div className={`mt-4 ${CARD} p-5`}>
            <h3 className="mb-3 font-mono text-sm font-semibold text-[#3B82F6]">
              Why it's needed (not just useful)
            </h3>
            <ul className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              <li>• Frontend and backend teams can build in parallel against a contract.</li>
              <li>• One backend safely powers web, iOS, Android and partners at once.</li>
              <li>• You can swap the internal implementation without breaking callers.</li>
              <li>• Third parties can build on top of your product without touching your code.</li>
            </ul>
          </div>
        </section>

        <Connector />

        {/* ---------------------------------------------------------- */}
        {/* Types of APIs                                              */}
        {/* ---------------------------------------------------------- */}
        <section>
          <SectionHeader
            method="GET"
            path="/types"
            title="Types of APIs"
            icon={Boxes}
            kicker="Six shapes of API you'll run into in the wild — and when each one wins."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {API_TYPES.map((t) => (
              <div key={t.name} className={`${CARD} p-5`}>
                <Tag method="GET" path={t.tag} />
                <h3 className="mb-1 mt-2 font-mono text-lg font-bold">{t.name}</h3>
                <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">{t.desc}</p>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {t.pros.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-[#22C55E]/10 px-2 py-0.5 text-[10px] text-[#22C55E]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {t.cons.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-[#EF4444]/10 px-2 py-0.5 text-[10px] text-[#EF4444]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <pre className="overflow-x-auto rounded-lg bg-slate-100 p-2 font-mono text-[11px] text-slate-600 dark:bg-black/40 dark:text-slate-300">
                  {t.example}
                </pre>
              </div>
            ))}
          </div>
        </section>

        <Connector />

        {/* ---------------------------------------------------------- */}
        {/* Architecture diagram                                       */}
        {/* ---------------------------------------------------------- */}
        <section>
          <SectionHeader
            method="GET"
            path="/architecture"
            title="Block Diagram — how a request actually travels"
            icon={Radio}
            kicker="Client → Gateway (auth + rate limit) → Services → Database, end to end."
          />
          <div className={`${CARD} p-6`}>
            <ArchitectureDiagram />
          </div>

          <div className={`mt-4 ${CARD} p-6`}>
            <h3 className="mb-3 font-mono text-sm font-semibold text-[#3B82F6]">
              Request / Response cycle
            </h3>
            <RequestResponseDiagram />
          </div>
        </section>

        <Connector />

        {/* ---------------------------------------------------------- */}
        {/* Formulas                                                    */}
        {/* ---------------------------------------------------------- */}
        <section>
          <SectionHeader
            method="GET"
            path="/formulas"
            title="Formulas every API engineer should know"
            icon={Gauge}
            kicker="The math behind rate limiting, throughput, uptime, retries and pagination."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {FORMULAS.map((f) => (
              <div key={f.name} className={`${CARD} p-5`}>
                <h3 className="mb-2 font-mono text-sm font-bold text-[#10151F] dark:text-[#D8E6F5]">
                  {f.name}
                </h3>
                <div className="mb-2 rounded-lg bg-[#3B82F6]/10 px-3 py-2 font-mono text-sm text-[#3B82F6]">
                  {f.formula}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{f.explain}</p>
              </div>
            ))}
          </div>
        </section>

        <Connector />

        {/* ---------------------------------------------------------- */}
        {/* Detailed notes accordion                                   */}
        {/* ---------------------------------------------------------- */}
        <section>
          <SectionHeader
            method="GET"
            path="/notes"
            title="Detailed notes"
            icon={BookOpen}
            kicker="Expand each topic — methods, status codes, auth, REST constraints, idempotency, versioning, CORS, webhooks."
          />
          <div className="space-y-3">
            {NOTES.map((n, i) => (
              <AccordionItem
                key={n.title}
                title={n.title}
                icon={n.icon}
                body={n.body}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </section>

        <Connector />

        {/* ---------------------------------------------------------- */}
        {/* More diagrams / sketches                                    */}
        {/* ---------------------------------------------------------- */}
        <section>
          <SectionHeader
            method="GET"
            path="/diagrams"
            title="More diagrams & sketches"
            icon={Sparkles}
            kicker="A quick sketch of the OAuth2 authorization-code flow used behind most 'log in with...' buttons."
          />
          <div className={`${CARD} p-6`}>
            <OAuthFlowDiagram />
          </div>
        </section>

        <Connector />

        {/* ---------------------------------------------------------- */}
        {/* Cheat sheets                                                */}
        {/* ---------------------------------------------------------- */}
        <section>
          <SectionHeader
            method="GET"
            path="/cheatsheet"
            title="Cheat sheets"
            icon={Terminal}
            kicker="Print these three tables and you're covered for 90% of API work."
          />

          <div className="mb-4 overflow-x-auto">
            <table className={`${CARD} w-full text-left text-xs`}>
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  {["Method", "Purpose", "Idempotent", "Cacheable", "Body"].map((h) => (
                    <th key={h} className="px-4 py-3 font-mono font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHEAT_METHODS.map((row) => (
                  <tr key={row[0]} className="border-b border-slate-100 dark:border-slate-900">
                    {row.map((cell, i) => (
                      <td key={i} className="px-4 py-2 text-slate-600 dark:text-slate-300">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${CARD} p-5`}>
              <h3 className="mb-3 font-mono text-sm font-semibold text-[#3B82F6]">Status codes</h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {CHEAT_CODES.map((c) => (
                  <li key={c[0]}>
                    <span className="font-mono font-bold text-[#F5A623]">{c[0]}</span> — {c[1]}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${CARD} p-5`}>
              <h3 className="mb-3 font-mono text-sm font-semibold text-[#3B82F6]">Common headers</h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {CHEAT_HEADERS.map((h) => (
                  <li key={h[0]}>
                    <span className="font-mono font-bold text-[#F5A623]">{h[0]}</span> — {h[1]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Connector />

        {/* ---------------------------------------------------------- */}
        {/* Build your own AI model behind an API                      */}
        {/* ---------------------------------------------------------- */}
        <section>
          <SectionHeader
            method="POST"
            path="/build-ai-model"
            title="How to build & serve your own AI model as an API"
            icon={Bot}
            kicker="From raw idea to a POST /predict endpoint the rest of the world can call."
          />
          <ol className="space-y-3">
            {BUILD_STEPS.map((s, i) => (
              <li key={s.title} className={`${CARD} flex gap-4 p-4`}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/10 font-mono text-sm font-bold text-[#3B82F6]">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-mono text-sm font-semibold">{s.title}</h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Connector />

        {/* ---------------------------------------------------------- */}
        {/* Blog: use cases, features, future, pros/cons                */}
        {/* ---------------------------------------------------------- */}
        <section>
          <SectionHeader
            method="GET"
            path="/blog"
            title="The bigger picture — use cases, features, future & trade-offs"
            icon={Rocket}
            kicker="Where APIs show up in everyday products, and an honest look at both sides."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${CARD} p-5`}>
              <h3 className="mb-3 font-mono text-sm font-semibold text-[#3B82F6]">Use cases</h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {USE_CASES.map((u) => (
                  <li key={u} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3B82F6]" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${CARD} p-5`}>
              <h3 className="mb-3 font-mono text-sm font-semibold text-[#3B82F6]">
                Where APIs are headed
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {FUTURE.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5A623]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className={`${CARD} p-5`}>
              <h3 className="mb-3 flex items-center gap-2 font-mono text-sm font-semibold text-[#22C55E]">
                <ThumbsUp size={16} /> Good side
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {PROS.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
            <div className={`${CARD} p-5`}>
              <h3 className="mb-3 flex items-center gap-2 font-mono text-sm font-semibold text-[#EF4444]">
                <ThumbsDown size={16} /> Bad side
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {CONS.map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Bottom download CTA                                        */}
        {/* ---------------------------------------------------------- */}
        <section className="mt-16">
          <div className={`${CARD} flex flex-col items-center gap-4 p-8 text-center`}>
            <Download size={28} className="text-[#3B82F6]" />
            <h3 className="font-mono text-lg font-bold">Take these notes with you</h3>
            <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">
              Every section on this page — definitions, formulas, cheat sheets and
              the AI-model build steps — bundled into one Markdown file.
            </p>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-3 font-mono text-sm font-semibold text-white shadow-lg shadow-[#3B82F6]/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download size={18} /> Download API Notes 
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center font-mono text-xs text-slate-400 dark:border-slate-800">
        built like a schematic · GET /overview → POST /build-ai-model
      </footer>

      {/* Thank-you toast on download */}
      {showThanks && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[#22C55E]/30 bg-white px-5 py-4 shadow-2xl dark:bg-[#0F1B2C]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22C55E]/10 text-[#22C55E]">
            🎉
          </span>
          <div>
            <p className="font-mono text-sm font-semibold text-[#10151F] dark:text-[#D8E6F5]">
              Thanks for downloading!
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Happy building - go ship something with an API today.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}