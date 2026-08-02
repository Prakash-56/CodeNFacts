"use client";

/**
 * category/open-ai-(chat-gpt)/page.tsx
 * ------------------------------------------------------------------
 * A self-contained explainer page: OpenAI, ChatGPT, GPT, APIs, how it
 * all works, how to build your own model, and the honest tradeoffs
 * (helpfulness, jobs, limitations).
 *
 * Theming: uses Tailwind's `dark:` variants throughout. This assumes
 * your project's tailwind config has `darkMode: "class"` and that the
 * light/dark button in your header toggles a `dark` class on <html>
 * (e.g. via `next-themes`). Light mode = white background, as requested.
 *
 * Optional polish: for the full type pairing this design was built for,
 * load Space Grotesk (display) + JetBrains Mono (eyebrows/code) via
 * next/font and apply their className to <main> below. It reads fine
 * with system fonts too — nothing here depends on it.
 * ------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react";
import {
  Cpu,
  Wrench,
  Lightbulb,
  ShieldAlert,
  Briefcase,
  BookOpen,
  ArrowRight,
  Copy,
  Check,
  AlertTriangle,
  Layers,
  Rocket,
  ScrollText,
  KeyRound,
  Gauge,
  EyeOff,
  DollarSign,
  Scale,
  GraduationCap,
  Building2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */

const NAV = [
  { id: "foundations", label: "OpenAI" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "gpt", label: "What is GPT" },
  { id: "inside", label: "How it thinks" },
  { id: "apis", label: "APIs" },
  { id: "build-your-own", label: "Build your own" },
  { id: "why-it-matters", label: "Why it matters" },
  { id: "is-it-helpful", label: "Is it helpful?" },
  { id: "jobs", label: "Jobs" },
  { id: "keep-in-mind", label: "Keep in mind" },
  { id: "cheatsheet", label: "Cheat sheet" },
];

function Eyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
      <span className="inline-flex h-5 items-center rounded-full border border-cyan-600/30 dark:border-cyan-400/30 px-2 text-[10px]">
        {index}
      </span>
      <span className="h-px w-8 bg-cyan-600/40 dark:bg-cyan-400/40" />
      {children}
    </div>
  );
}

function SectionShell({
  id,
  index,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-slate-200 dark:border-slate-800 py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        <h2 className="mt-4 text-2xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        {lede && (
          <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            {lede}
          </p>
        )}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function DiagramCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 md:p-6 overflow-x-auto">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-500">
        {title}
      </p>
      {children}
    </div>
  );
}

const toneMap = {
  amber:
    "border-amber-500/40 bg-amber-50 dark:bg-amber-500/[0.07] text-amber-900 dark:text-amber-200",
  cyan: "border-cyan-500/40 bg-cyan-50 dark:bg-cyan-500/[0.07] text-cyan-900 dark:text-cyan-200",
  violet:
    "border-violet-500/40 bg-violet-50 dark:bg-violet-500/[0.07] text-violet-900 dark:text-violet-200",
} as const;

function Callout({
  icon: Icon,
  title,
  tone = "amber",
  children,
}: {
  icon: React.ElementType;
  title: string;
  tone?: keyof typeof toneMap;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border-l-4 p-4 md:p-5 ${toneMap[tone]}`}>
      <div className="flex items-center gap-2 font-semibold text-sm">
        <Icon className="h-4 w-4 shrink-0" />
        {title}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed opacity-90">{children}</p>
    </div>
  );
}

function GlossaryCard({ term, def }: { term: string; def: string }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <p className="font-mono text-sm font-semibold text-violet-600 dark:text-violet-400">{term}</p>
      <p className="mt-1.5 text-sm leading-snug text-slate-600 dark:text-slate-400">{def}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Signature hero element — a live "how generation feels" demo        */
/* ------------------------------------------------------------------ */

const DEMO_PROMPT = "Explain photosynthesis for a curious 10-year-old.";
const DEMO_TOKENS = [
  "Plants",
  " grab",
  " sunlight",
  ",",
  " water",
  ",",
  " and",
  " air",
  ",",
  " and",
  " turn",
  " them",
  " into",
  " food",
  " —",
  " basically",
  " cooking",
  " with",
  " light",
  ".",
];

const pillTones = [
  "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300",
  "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
];

function TokenStreamDemo() {
  const [phase, setPhase] = useState<"typing" | "thinking" | "streaming" | "hold">("typing");
  const [typedLen, setTypedLen] = useState(0);
  const [tokenCount, setTokenCount] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clear = () => timeoutRef.current && clearTimeout(timeoutRef.current);

    if (phase === "typing") {
      if (typedLen < DEMO_PROMPT.length) {
        timeoutRef.current = setTimeout(() => setTypedLen((n) => n + 1), 28);
      } else {
        timeoutRef.current = setTimeout(() => setPhase("thinking"), 500);
      }
    } else if (phase === "thinking") {
      timeoutRef.current = setTimeout(() => setPhase("streaming"), 700);
    } else if (phase === "streaming") {
      if (tokenCount < DEMO_TOKENS.length) {
        timeoutRef.current = setTimeout(() => setTokenCount((n) => n + 1), 90);
      } else {
        timeoutRef.current = setTimeout(() => setPhase("hold"), 1800);
      }
    } else if (phase === "hold") {
      timeoutRef.current = setTimeout(() => {
        setTypedLen(0);
        setTokenCount(0);
        setPhase("typing");
      }, 900);
    }
    return clear;
  }, [phase, typedLen, tokenCount]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm dark:shadow-none overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-2 font-mono text-[11px] text-slate-400 dark:text-slate-500">
          next-token-prediction.demo
        </span>
      </div>
      <div className="p-5 min-h-[168px] flex flex-col justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
            prompt
          </p>
          <p className="mt-1 font-mono text-sm text-slate-700 dark:text-slate-300 min-h-[1.5em]">
            {DEMO_PROMPT.slice(0, typedLen)}
            <span className="animate-pulse text-cyan-500">▍</span>
          </p>
        </div>

        <div className="mt-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
            model output — one token at a time
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5 min-h-[3.25rem] items-start">
            {phase === "thinking" && (
              <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" />
              </span>
            )}
            {(phase === "streaming" || phase === "hold") &&
              DEMO_TOKENS.slice(0, tokenCount).map((tok, i) => (
                <span
                  key={i}
                  className={`rounded px-1.5 py-0.5 font-mono text-[13px] leading-tight ${
                    pillTones[i % pillTones.length]
                  }`}
                >
                  {tok}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagrams (hand-drawn-feel inline SVGs)                              */
/* ------------------------------------------------------------------ */

function TransformerDiagram() {
  return (
    <svg viewBox="0 0 720 190" className="w-full min-w-[560px] text-slate-400 dark:text-slate-600">
      <defs>
        <marker id="arrow-a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" className="fill-current" />
        </marker>
      </defs>
      {[
        { x: 10, w: 84, label: "Input\ntext" },
        { x: 124, w: 84, label: "Tokenize" },
        { x: 238, w: 84, label: "Embed" },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={60} width={b.w} height={60} rx={10} className="fill-white dark:fill-slate-900 stroke-current" strokeWidth={1.5} />
          {b.label.split("\n").map((line, li) => (
            <text key={li} x={b.x + b.w / 2} y={86 + li * 14} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[11px] font-mono">
              {line}
            </text>
          ))}
        </g>
      ))}

      <rect x={352} y={40} width={190} height={100} rx={12} className="fill-cyan-50 dark:fill-cyan-500/10 stroke-cyan-600 dark:stroke-cyan-400" strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={447} y={64} textAnchor="middle" className="fill-cyan-700 dark:fill-cyan-300 text-[11px] font-mono font-semibold">
        Transformer blocks × N
      </text>
      <text x={447} y={88} textAnchor="middle" className="fill-cyan-700/80 dark:fill-cyan-300/80 text-[10px] font-mono">
        self-attention
      </text>
      <text x={447} y={104} textAnchor="middle" className="fill-cyan-700/80 dark:fill-cyan-300/80 text-[10px] font-mono">
        + feed-forward
      </text>
      <text x={447} y={122} textAnchor="middle" className="fill-cyan-700/60 dark:fill-cyan-300/60 text-[10px] font-mono">
        (repeated many times)
      </text>

      <rect x={578} y={60} width={132} height={60} rx={10} className="fill-violet-50 dark:fill-violet-500/10 stroke-violet-600 dark:stroke-violet-400" strokeWidth={1.5} />
      <text x={644} y={82} textAnchor="middle" className="fill-violet-700 dark:fill-violet-300 text-[11px] font-mono font-semibold">
        Predict
      </text>
      <text x={644} y={98} textAnchor="middle" className="fill-violet-700 dark:fill-violet-300 text-[11px] font-mono font-semibold">
        next token
      </text>

      {[94, 208, 322, 542].map((x, i) => (
        <line key={i} x1={x} y1={90} x2={x + 30} y2={90} className="stroke-current" strokeWidth={1.5} markerEnd="url(#arrow-a)" />
      ))}

      <path
        d="M644,140 C644,178 96,178 96,140"
        className="fill-none stroke-current"
        strokeWidth={1.5}
        strokeDasharray="3 4"
        markerEnd="url(#arrow-a)"
      />
      <text x={370} y={186} textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono italic">
        append the new token, feed it back in, repeat — that's how a whole reply gets written
      </text>
    </svg>
  );
}

function ApiFlowDiagram() {
  return (
    <svg viewBox="0 0 680 220" className="w-full min-w-[520px] text-slate-400 dark:text-slate-600">
      <defs>
        <marker id="arrow-b" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" className="fill-current" />
        </marker>
      </defs>

      <rect x={10} y={70} width={140} height={70} rx={10} className="fill-white dark:fill-slate-900 stroke-current" strokeWidth={1.5} />
      <text x={80} y={100} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[12px] font-mono font-semibold">Your app</text>
      <text x={80} y={116} textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono">website / script / product</text>

      <rect x={270} y={70} width={150} height={70} rx={10} className="fill-cyan-50 dark:fill-cyan-500/10 stroke-cyan-600 dark:stroke-cyan-400" strokeWidth={1.5} />
      <text x={345} y={100} textAnchor="middle" className="fill-cyan-700 dark:fill-cyan-300 text-[12px] font-mono font-semibold">OpenAI API</text>
      <text x={345} y={116} textAnchor="middle" className="fill-cyan-700/80 dark:fill-cyan-300/80 text-[10px] font-mono">routes to a model</text>

      <rect x={530} y={70} width={140} height={70} rx={10} className="fill-violet-50 dark:fill-violet-500/10 stroke-violet-600 dark:stroke-violet-400" strokeWidth={1.5} />
      <text x={600} y={100} textAnchor="middle" className="fill-violet-700 dark:fill-violet-300 text-[12px] font-mono font-semibold">GPT model</text>
      <text x={600} y={116} textAnchor="middle" className="fill-violet-700/80 dark:fill-violet-300/80 text-[10px] font-mono">does the thinking</text>

      <line x1={150} y1={88} x2={266} y2={88} className="stroke-current" strokeWidth={1.5} markerEnd="url(#arrow-b)" />
      <text x={208} y={78} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono">POST request</text>
      <text x={208} y={135} textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px] font-mono">{`{ prompt, model, temperature }`}</text>

      <line x1={420} y1={88} x2={526} y2={88} className="stroke-current" strokeWidth={1.5} markerEnd="url(#arrow-b)" />

      <path d="M600,140 C600,178 80,178 80,140" className="fill-none stroke-current" strokeWidth={1.5} strokeDasharray="3 4" markerEnd="url(#arrow-b)" />
      <text x={340} y={200} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono">
        JSON response comes back → {`{ text, tokens_used, finish_reason }`} → your app renders it
      </text>
    </svg>
  );
}

function BuildYourOwnDiagram() {
  const steps = [
    "Define the\nproblem & data",
    "Collect &\nclean data",
    "Pick a base\nmodel / architecture",
    "Train /\nfine-tune",
    "Evaluate &\nred-team",
    "Deploy &\nmonitor",
  ];
  return (
    <svg viewBox="0 0 760 200" className="w-full min-w-[620px] text-slate-400 dark:text-slate-600">
      <defs>
        <marker id="arrow-c" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" className="fill-current" />
        </marker>
      </defs>
      {steps.map((s, i) => {
        const x = 10 + i * 125;
        return (
          <g key={i}>
            <rect x={x} y={70} width={104} height={80} rx={10} className="fill-white dark:fill-slate-900 stroke-current" strokeWidth={1.5} />
            <text x={x + 52} y={62} textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono">
              {String(i + 1).padStart(2, "0")}
            </text>
            {s.split("\n").map((line, li) => (
              <text key={li} x={x + 52} y={100 + li * 14} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[10.5px] font-mono">
                {line}
              </text>
            ))}
            {i < steps.length - 1 && (
              <line x1={x + 104} y1={110} x2={x + 122} y2={110} className="stroke-current" strokeWidth={1.5} markerEnd="url(#arrow-c)" />
            )}
          </g>
        );
      })}
      <path
        d="M636,150 C636,182 322,182 322,150"
        className="fill-none stroke-current"
        strokeWidth={1.5}
        strokeDasharray="3 4"
        markerEnd="url(#arrow-c)"
      />
      <text x={480} y={196} textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono italic">
        iterate: most real improvement happens by looping steps 4–6, not by starting over
      </text>
    </svg>
  );
}

function JobsBalanceDiagram() {
  return (
    <svg viewBox="0 0 560 170" className="w-full min-w-[420px] text-slate-400 dark:text-slate-600">
      <line x1={280} y1={20} x2={280} y2={110} className="stroke-current" strokeWidth={2} />
      <path d="M240,110 L320,110 L280,140 Z" className="fill-current opacity-70" />
      <line x1={90} y1={45} x2={470} y2={45} className="stroke-current" strokeWidth={2} />
      <line x1={90} y1={45} x2={90} y2={78} className="stroke-current" strokeWidth={1.2} />
      <line x1={470} y1={45} x2={470} y2={78} className="stroke-current" strokeWidth={1.2} />

      <rect x={30} y={78} width={120} height={50} rx={8} className="fill-amber-50 dark:fill-amber-500/10 stroke-amber-500" strokeWidth={1.5} />
      <text x={90} y={100} textAnchor="middle" className="fill-amber-700 dark:fill-amber-300 text-[11px] font-mono font-semibold">Tasks under</text>
      <text x={90} y={115} textAnchor="middle" className="fill-amber-700 dark:fill-amber-300 text-[11px] font-mono font-semibold">pressure</text>

      <rect x={410} y={78} width={120} height={50} rx={8} className="fill-cyan-50 dark:fill-cyan-500/10 stroke-cyan-500" strokeWidth={1.5} />
      <text x={470} y={100} textAnchor="middle" className="fill-cyan-700 dark:fill-cyan-300 text-[11px] font-mono font-semibold">New tasks &</text>
      <text x={470} y={115} textAnchor="middle" className="fill-cyan-700 dark:fill-cyan-300 text-[11px] font-mono font-semibold">roles created</text>

      <text x={280} y={160} textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono italic">
        credible estimates land on both sides — this is a real, contested balance, not a settled score
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Code sample with copy button                                       */
/* ------------------------------------------------------------------ */

const CODE_SAMPLE = `const res = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": \`Bearer \${process.env.OPENAI_API_KEY}\`,
  },
  body: JSON.stringify({
    model: "gpt-5.3-instant",
    messages: [
      { role: "system", content: "You explain things simply." },
      { role: "user", content: "What is a token?" },
    ],
    temperature: 0.7,
  }),
});

const data = await res.json();
console.log(data.choices[0].message.content);`;

function CodeBlock() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 dark:bg-black overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="font-mono text-[11px] text-slate-400">request.ts</span>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(CODE_SAMPLE);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              /* clipboard unavailable — silently ignore */
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed text-slate-200">
        <code>{CODE_SAMPLE}</code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data: cheat sheet + lists                                          */
/* ------------------------------------------------------------------ */

const GLOSSARY: { term: string; def: string }[] = [
  { term: "Token", def: "A chunk of text (often part of a word) — the model's basic unit of reading and writing." },
  { term: "Parameter", def: "A learned number inside the network. More parameters = more capacity to store patterns, at a cost." },
  { term: "Context window", def: "How much text (prompt + conversation so far) the model can 'see' at once, measured in tokens." },
  { term: "Prompt", def: "The instruction or question you give the model — the single biggest lever on output quality." },
  { term: "System prompt", def: "Hidden instructions set by the developer that shape how the model should behave for every user turn." },
  { term: "Temperature", def: "A setting that controls randomness. Low = focused and repeatable, high = more varied and surprising." },
  { term: "Fine-tuning", def: "Further training a model on a narrower, specific dataset so it specializes in a task or style." },
  { term: "RLHF", def: "Reinforcement Learning from Human Feedback — humans rank outputs to teach the model what's preferred." },
  { term: "Embedding", def: "A list of numbers representing meaning, so similar concepts end up numerically close together." },
  { term: "Hallucination", def: "A fluent, confident answer that is factually wrong. The core reason to verify important claims." },
  { term: "Inference", def: "Actually running the trained model to generate an answer (as opposed to training it)." },
  { term: "Zero-shot / few-shot", def: "Asking for a task with no examples (zero-shot) vs. a couple of examples in the prompt (few-shot)." },
  { term: "RAG", def: "Retrieval-Augmented Generation — fetching relevant documents first, then having the model answer using them." },
  { term: "API key", def: "A private credential that authorizes your app to use a provider's API. Treat it like a password." },
  { term: "Rate limit", def: "A cap on how many requests or tokens you can send per minute, to keep the service stable and fair." },
  { term: "Multimodal", def: "A model that can handle more than text — images, audio, or video as input and sometimes output." },
  { term: "Agent", def: "A model set up to plan, call tools, and take multi-step actions toward a goal, not just answer once." },
  { term: "Reasoning model", def: "A model tuned to 'think' through intermediate steps before answering, for harder logic-heavy tasks." },
  { term: "Latency", def: "How long you wait for a response — bigger models and longer outputs generally take longer." },
  { term: "Knowledge cutoff", def: "The date after which the model's training data stops — it won't natively know newer events." },
];

const KEEP_IN_MIND: { icon: React.ElementType; title: string; body: string; tone: keyof typeof toneMap }[] = [
  {
    icon: AlertTriangle,
    title: "It predicts text — it doesn't 'know' things the way you do",
    body: "A model can sound completely confident while being wrong. Verify names, numbers, quotes, citations, and anything with legal, medical, or financial consequences.",
    tone: "amber",
  },
  {
    icon: ScrollText,
    title: "Training data has a cutoff date",
    body: "Ask about something recent and, unless the tool is actively browsing the web, it may guess, generalize, or simply not know.",
    tone: "amber",
  },
  {
    icon: EyeOff,
    title: "Be careful what you paste in",
    body: "Sensitive personal data, medical records, financial details, or confidential company material shouldn't go into a general chat tool unless you understand how that data is stored and used.",
    tone: "violet",
  },
  {
    icon: Scale,
    title: "Bias comes along with the training data",
    body: "Models learn patterns — including skewed or stereotypical ones — from the text and human feedback they were trained on. Outputs can quietly reflect that.",
    tone: "violet",
  },
  {
    icon: DollarSign,
    title: "Usage isn't free at scale",
    body: "API calls are billed per token. Long prompts, long conversations, and large outputs add up quickly — worth monitoring once you're building something real.",
    tone: "cyan",
  },
  {
    icon: KeyRound,
    title: "Never expose an API key in client-side code",
    body: "A key hardcoded into a public app or website will get scraped and abused within hours. Keep it server-side, in an environment variable.",
    tone: "cyan",
  },
  {
    icon: Gauge,
    title: "Vague prompts get vague answers",
    body: "Specify the audience, the format, the length, and any constraints. The single biggest quality lever is how clearly you ask.",
    tone: "amber",
  },
  {
    icon: ShieldAlert,
    title: "Treat it as a first draft, not the final word",
    body: "For anything high-stakes — medical, legal, financial, safety-critical — use the output as a starting point or second opinion, and get a qualified human to check it.",
    tone: "violet",
  },
];

const TASKS_UNDER_PRESSURE = [
  "Routine data entry & transcription",
  "First-draft / templated copywriting",
  "Tier-1 customer support scripts",
  "Boilerplate code & simple bug fixes",
  "Basic translation & subtitling",
  "Routine document/contract review",
  "Manual bookkeeping data entry",
];

const ROLES_GROWING = [
  "AI/ML engineers & applied researchers",
  "Prompt, workflow & agent designers",
  "AI safety, evaluation & red-teaming",
  "Data curation, labeling & quality review",
  "\"Supervising the AI\" roles across industries",
  "Judgment- and trust-heavy work (complex sales, care, leadership)",
  "Skilled hands-on trades, largely untouched so far",
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function Page() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sticky in-page nav (desktop) */}
      <div className="sticky top-0 z-30 hidden md:block border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl flex-wrap gap-x-5 gap-y-2 px-6 py-3 text-[13px] font-medium">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* HERO                                                        */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-6 pt-14 pb-16 md:pt-20 md:pb-24">
        <Eyebrow index="00">start here</Eyebrow>
        <h1 className="mt-5 max-w-3xl text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
          OpenAI, ChatGPT, and GPT -{" "}
          <span className="text-cyan-600 dark:text-cyan-400">what's actually happening</span> under the hood
        </h1>
        <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Not marketing, not doom - just a clear, honest walkthrough: the company, the product, the
          model, how the API works, how you'd build one yourself, and what to actually keep in mind
          before you trust the output.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-center">
          <TokenStreamDemo />
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
              what you're watching
            </p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              This is roughly what happens every time you send a message: your text gets typed in,
              the model briefly "thinks," and then the reply is generated one small chunk -{" "}
              <span className="font-mono text-cyan-600 dark:text-cyan-400">a token</span> - at a
              time, each one predicted from everything written so far. Section{" "}
              <a href="#gpt" className="underline decoration-dotted underline-offset-2">
                03
              </a>{" "}
              breaks down why that simple idea is so powerful.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* 01 — OpenAI                                                 */}
      {/* ---------------------------------------------------------- */}
      <SectionShell
        id="foundations"
        index="01"
        eyebrow="the company"
        title="What is OpenAI?"
        lede="OpenAI is an AI research and product company, best known for building the GPT model family and the ChatGPT app on top of it."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <Building2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="mt-3 font-semibold">Started as a research lab</h3>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Founded in 2015 with a mission around making sure advanced AI benefits people broadly. It
              began as a nonprofit-affiliated research lab before becoming a commercial product company
              as its models became genuinely useful.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <Layers className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <h3 className="mt-3 font-semibold">More than one product</h3>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              ChatGPT is the consumer face, but OpenAI also ships a developer API platform, coding
              tools, image and voice models, and enterprise products — all built on the same
              underlying GPT research.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <Scale className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h3 className="mt-3 font-semibold">A mission with commercial pressure</h3>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              OpenAI's structure is built to balance a safety-oriented mission with the very large
              amounts of capital needed to train frontier models — a tension that shows up constantly
              in how the field is discussed.
            </p>
          </div>
        </div>
      </SectionShell>

      {/* ---------------------------------------------------------- */}
      {/* 02 — ChatGPT                                                */}
      {/* ---------------------------------------------------------- */}
      <SectionShell
        id="chatgpt"
        index="02"
        eyebrow="the product"
        title="What is ChatGPT?"
        lede="ChatGPT is the chat app that puts GPT models in front of everyday users — free in a browser or phone app, with paid tiers for heavier or more capable use."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2">What it can actually do</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {[
                "Write, edit, summarize, and brainstorm text",
                "Explain, tutor, and answer questions across most subjects",
                "Read and reason over images and documents you share",
                "Write, review, and debug code",
                "Search the web and cite sources for current topics",
                "Speak and listen via voice mode",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">The model picker, in plain terms</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              ChatGPT usually offers a fast, free default model for everyday chat, alongside slower
              "thinking" or "pro" tiers for harder problems that reason step by step before
              answering. Exact model names change often — by mid-2026 the lineup had moved well past
              the original GPT-3.5 and GPT-4 into a fast-evolving GPT-5.x family — so treat any
              specific version number as a snapshot, not a fixed fact, and check OpenAI's own release
              notes for what's current.
            </p>
          </div>
        </div>
      </SectionShell>

      {/* ---------------------------------------------------------- */}
      {/* 03 — What is GPT                                            */}
      {/* ---------------------------------------------------------- */}
      <SectionShell
        id="gpt"
        index="03"
        eyebrow="the model"
        title="What does 'GPT' actually stand for?"
        lede="Generative Pre-trained Transformer. Each word describes a real, load-bearing piece of how it works."
      >
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <p className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-semibold">GENERATIVE</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              It creates new content rather than just retrieving or classifying existing text.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <p className="font-mono text-xs text-violet-600 dark:text-violet-400 font-semibold">PRE-TRAINED</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              It first learns general patterns of language from a huge amount of text, long before
              it's asked to do any specific task.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <p className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">TRANSFORMER</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              The neural network design that made all this practical — built around a mechanism
              called "self-attention."
            </p>
          </div>
        </div>

        <DiagramCard title="the generation loop, simplified">
          <TransformerDiagram />
        </DiagramCard>

        <p className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl">
          <strong className="text-slate-900 dark:text-white">Self-attention</strong>, in one
          sentence: for every token, the model weighs how relevant every other token in the context
          is, so "it" in a long paragraph can correctly point back to the right noun several
          sentences earlier. Stack enough of these attention layers together and the network can
          track grammar, facts, tone, and structure all at once — which is why the output reads as
          coherent rather than random.
        </p>
      </SectionShell>

      {/* ---------------------------------------------------------- */}
      {/* 04 — How it thinks                                          */}
      {/* ---------------------------------------------------------- */}
      <SectionShell
        id="inside"
        index="04"
        eyebrow="mechanics"
        title="How it 'thinks' — and what that word is hiding"
        lede="At inference time, the model is doing one thing, over and over: given everything so far, what's the most likely next token?"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            <p>
              That's it — there's no separate "understanding module." Every fact, joke, poem, or line
              of code the model produces comes from repeatedly sampling the next most probable token,
              guided by everything it learned during training.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Temperature</strong> controls how
              much randomness goes into that sampling — near zero and it always picks the most likely
              token (repeatable, safe, sometimes bland); higher and it takes more chances (creative,
              but more error-prone). <strong className="text-slate-900 dark:text-white">
                Context window
              </strong>{" "}
              is how much of the conversation it can hold in view at once — everything outside that
              window simply isn't visible to it anymore.
            </p>
            <p>
              "Reasoning" models add a twist: before answering, they generate a hidden chain of
              intermediate steps — closer to working through a problem on scratch paper — which
              measurably helps on math, logic, and multi-step tasks, at the cost of speed.
            </p>
          </div>
          <Callout icon={Lightbulb} title="the honest one-liner" tone="cyan">
            It's an extremely good pattern-completion engine trained on an extremely large slice of
            human writing — not a mind with beliefs, goals, or genuine understanding of what it's
            saying. Treating it that way explains both its strengths and its most common failures.
          </Callout>
        </div>
      </SectionShell>

      {/* ---------------------------------------------------------- */}
      {/* 05 — APIs                                                   */}
      {/* ---------------------------------------------------------- */}
      <SectionShell
        id="apis"
        index="05"
        eyebrow="developer platform"
        title="What is an API, and how does the OpenAI API work?"
        lede="An API (Application Programming Interface) is just a defined, structured way for one piece of software to ask another for something — a menu of requests a program can make, instead of a person clicking buttons."
      >
        <DiagramCard title="request → model → response">
          <ApiFlowDiagram />
        </DiagramCard>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-3">A minimal real request</h3>
            <CodeBlock />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">The core pieces, decoded</h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">model</span> — which
                version you're calling; smaller/faster vs. larger/smarter is a real cost-vs-quality
                tradeoff.
              </li>
              <li>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">messages</span> — the
                conversation so far, tagged as <em>system</em> (developer instructions), <em>user</em>,
                or <em>assistant</em>.
              </li>
              <li>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">temperature</span> —
                randomness dial, covered above.
              </li>
              <li>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">Authorization</span> —
                your API key, proving the request is billable to your account. Never ship this in
                code a browser can read.
              </li>
            </ul>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
              This is exactly how ChatGPT itself, most AI browser extensions, and countless startups
              are built: someone's app or website, calling this same kind of endpoint under the hood.
            </p>
          </div>
        </div>
      </SectionShell>

      {/* ---------------------------------------------------------- */}
      {/* 06 — Build your own                                        */}
      {/* ---------------------------------------------------------- */}
      <SectionShell
        id="build-your-own"
        index="06"
        eyebrow="hands-on"
        title="How would you actually build your own AI model?"
        lede="Two very different meanings hide behind this question — worth separating before you start."
      >
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <Callout icon={Rocket} title="Training a model from scratch" tone="amber">
            This is what OpenAI, Anthropic, Google, and a handful of others do — and it typically
            costs anywhere from millions to well over a hundred million dollars in compute, plus
            massive curated datasets and specialized engineering teams. Realistic for large labs and
            well-funded startups, not a weekend project.
          </Callout>
          <Callout icon={Wrench} title="What almost everyone else actually does" tone="cyan">
            Fine-tune or prompt an existing model (via an API, or an open-weight model like Llama or
            GPT-OSS you run yourself), often paired with{" "}
            <span className="font-mono">RAG</span> — feeding it your own documents at answer time
            instead of retraining it. This gets you a specialized, useful "own model" in days, not
            years.
          </Callout>
        </div>

        <DiagramCard title="the realistic path, either way">
          <BuildYourOwnDiagram />
        </DiagramCard>

        <p className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl">
          The step people underestimate most is <strong className="text-slate-900 dark:text-white">
            data collection and cleaning
          </strong>{" "}
          — a model is only as good as what it's trained or grounded on, and cleaning, deduplicating,
          and labeling data is usually the slowest, least glamorous part of the whole process.
        </p>
      </SectionShell>

      {/* ---------------------------------------------------------- */}
      {/* 07 — Why it matters                                        */}
      {/* ---------------------------------------------------------- */}
      <SectionShell
        id="why-it-matters"
        index="07"
        eyebrow="the case for it"
        title="Why does any of this matter?"
        lede="Set the hype aside — the practical argument is that a lot of valuable work is bottlenecked on skilled human time, and this technology lowers that bottleneck for a specific, large class of tasks."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            {[
              "Drafting, editing, and explaining at expert-adjacent quality, instantly and cheaply",
              "Leveling access — a student without tutors or a founder without a lawyer gets a capable first pass",
              "Accelerating coding, research, and data analysis that used to take hours of setup",
              "Personalized, patient tutoring available at any hour, in any language",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                {t}
              </li>
            ))}
          </ul>
          <Callout icon={AlertTriangle} title="the honest counterweight" tone="violet">
            None of this is free of cost: training and running these models uses real compute,
            electricity, and water at data-center scale, and reasonable people disagree about whether
            the current pace of adoption is outrunning our ability to use it well, verify it, and
            regulate it responsibly.
          </Callout>
        </div>
      </SectionShell>

      {/* ---------------------------------------------------------- */}
      {/* 08 — Is it helpful                                          */}
      {/* ---------------------------------------------------------- */}
      <SectionShell
        id="is-it-helpful"
        index="08"
        eyebrow="the honest verdict"
        title="Is it actually helpful?"
        lede="Genuinely — for a specific kind of work. The honest answer depends heavily on what you're using it for and whether you can check the result."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/[0.06] p-5">
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">Genuinely strong at</h3>
            <ul className="mt-2.5 space-y-2 text-sm text-emerald-900/80 dark:text-emerald-200/80">
              <li>Getting past a blank page — drafts, outlines, brainstorming</li>
              <li>Summarizing and explaining things you can verify against a source</li>
              <li>Boilerplate code, refactors, and explaining unfamiliar codebases</li>
              <li>Learning a new subject at your own pace, with follow-up questions</li>
              <li>Grunt work: reformatting, rephrasing, translating, tightening prose</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-500/30 bg-rose-50 dark:bg-rose-500/[0.06] p-5">
            <h3 className="font-semibold text-rose-800 dark:text-rose-300">Weak or risky at</h3>
            <ul className="mt-2.5 space-y-2 text-sm text-rose-900/80 dark:text-rose-200/80">
              <li>Being the sole source on facts, citations, or numbers you can't check</li>
              <li>Very recent events, unless it's actually browsing the live web</li>
              <li>High-stakes medical, legal, or financial decisions, unsupervised</li>
              <li>Anything where "sounding confident" can be mistaken for "being right"</li>
              <li>Original, deeply personal creative voice — it can imitate, not truly originate yours</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          The pattern: it's best used as a fast, tireless collaborator you still review — not as an
          oracle you defer to.
        </p>
      </SectionShell>

      {/* ---------------------------------------------------------- */}
      {/* 09 — Jobs                                                   */}
      {/* ---------------------------------------------------------- */}
      <SectionShell
        id="jobs"
        index="09"
        eyebrow="the contested question"
        title="Will this take jobs?"
        lede="This is a genuinely disputed question, and credible research lands in different places — worth reading as a real disagreement, not a settled fact."
      >
        <DiagramCard title="the honest shape of the debate">
          <JobsBalanceDiagram />
        </DiagramCard>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Tasks and roles under pressure now
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {TASKS_UNDER_PRESSURE.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="text-amber-500">·</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              Roles and skills growing alongside it
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {ROLES_GROWING.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="text-cyan-500">·</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-3xl">
          <p>
            The range of serious estimates is wide. Some economic research projects a fairly modest
            net effect on total jobs through 2030, framing AI as mostly augmenting existing roles
            rather than replacing them outright. Global labor-market analyses from major banks and
            consultancies, by contrast, estimate that a much larger share of jobs worldwide have tasks
            exposed to automation over the coming decade — while also pointing to substantial new job
            creation in AI infrastructure, data, and oversight roles. Separately, large-employer
            surveys through 2026 show a split: many big companies now report AI-related headcount
            reductions outpacing hiring, while small and mid-sized businesses more often report AI
            helping them do more without needing to grow their teams as fast.
          </p>
          <p>
            The fair summary: this isn't a hoax and it isn't a done deal — it's an active, uneven
            transition. Task-level automation (the boring, repetitive parts of many jobs) is
            happening faster than whole-role elimination, and the safest personal bet is building
            skills that pair well with AI — judgment, verification, taste, and the ability to direct
            these tools well — rather than assuming either extreme.
          </p>
        </div>
      </SectionShell>

      {/* ---------------------------------------------------------- */}
      {/* 10 — Keep in mind                                          */}
      {/* ---------------------------------------------------------- */}
      <SectionShell
        id="keep-in-mind"
        index="10"
        eyebrow="before you rely on it"
        title="Important things to keep in mind"
        lede="A working checklist, not a scare list — most of these are one habit away from being solved."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {KEEP_IN_MIND.map((c) => (
            <Callout key={c.title} icon={c.icon} title={c.title} tone={c.tone}>
              {c.body}
            </Callout>
          ))}
        </div>
      </SectionShell>

      {/* ---------------------------------------------------------- */}
      {/* 11 — Cheat sheet                                           */}
      {/* ---------------------------------------------------------- */}
      <SectionShell
        id="cheatsheet"
        index="11"
        eyebrow="quick reference"
        title="The glossary cheat sheet"
        lede="Every term used on this page, in one scannable grid — bookmark this section."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GLOSSARY.map((g) => (
            <GlossaryCard key={g.term} term={g.term} def={g.def} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-6">
          <div className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            One-paragraph summary, if you only remember one thing
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            GPT is a transformer neural network trained on huge amounts of text to predict the next
            token; ChatGPT is OpenAI's chat app built on top of it; the API is how developers plug
            that same model into their own products. It's a genuinely powerful drafting, coding, and
            tutoring collaborator that can also sound confidently wrong — so verify anything that
            matters, keep your API keys private, and treat the jobs question as an open, evolving
            one rather than a settled fact.
          </p>
        </div>
      </SectionShell>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-10">
        <div className="mx-auto max-w-5xl px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-2 font-mono">
            <Cpu className="h-3.5 w-3.5" /> tokens in, tokens out.
          </span>
          <span>Model names, pricing, and job-market figures move fast — check primary sources before quoting specifics.</span>
        </div>
      </footer>
    </main>
  );
}