import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tools & Agents - The Field Guide",
  description:
    "A visual, blueprint-style guide to ChatGPT, Claude, Gemini, Perplexity, Grok, DeepSeek & Meta AI — plus AI agents, building your own voice assistant, tech stacks, cheat sheets and interview questions.",
};

/**
 * ---------------------------------------------------------------------------
 * DESIGN NOTE FOR WHOEVER MAINTAINS THIS FILE
 * ---------------------------------------------------------------------------
 * This page assumes:
 *  1. Tailwind CSS is configured with `darkMode: "class"`.
 *  2. Your <html> (or a parent wrapper) toggles the `dark` class — the
 *     light/dark toggle already living in your header should do this.
 *  3. No extra fonts/icon packages are required — everything below is plain
 *     Tailwind + inline SVG, so it drops into any Next.js app with zero new
 *     dependencies.
 *
 * Visual language: a "blueprint / schematic notebook" — white paper in light
 * mode, deep navy drafting-table blue in dark mode, with hand-drafted dashed
 * SVG diagrams standing in for the "sketches" you asked for. Interactive bits
 * (accordions) are pure <details>/<summary>, so no "use client" is needed.
 * ---------------------------------------------------------------------------
 */

// ---------------------------------------------------------------------------
// Reusable bits
// ---------------------------------------------------------------------------

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-[0.25em] uppercase text-blue-600 dark:text-blue-400 mb-3">
      {children}
    </p>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-slate-200 dark:border-slate-800 py-16 md:py-20"
    >
      <div className="max-w-5xl mx-auto px-6">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function DiagramFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-8 rounded-2xl border border-dashed border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 p-4 md:p-6">
      {children}
      <figcaption className="mt-3 font-mono text-[11px] tracking-widest uppercase text-blue-600/70 dark:text-blue-400/70 text-center">
        fig. {label}
      </figcaption>
    </figure>
  );
}

function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn" | "good";
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100",
    warn: "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100",
    good: "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 md:p-5 my-6 ${styles}`}>
      <p className="font-semibold mb-1">{title}</p>
      <div className="text-sm leading-relaxed opacity-90">{children}</div>
    </div>
  );
}

function QA({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 open:shadow-sm transition-shadow">
      <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-medium text-slate-900 dark:text-slate-100">
        <span>{q}</span>
        <span className="font-mono text-blue-600 dark:text-blue-400 group-open:rotate-45 transition-transform shrink-0">
          +
        </span>
      </summary>
      <div className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
        {a}
      </div>
    </details>
  );
}

type Tool = {
  name: string;
  maker: string;
  color: string;
  tagline: string;
  bestFor: string;
  notes: string;
};

const TOOLS: Tool[] = [
  {
    name: "ChatGPT",
    maker: "OpenAI",
    color: "#10A37F",
    tagline: "The generalist that made chat-with-AI mainstream.",
    bestFor: "Everyday Q&A, drafting, brainstorming, image generation (DALL·E), custom GPTs.",
    notes:
      "Huge plugin/GPT-store ecosystem. Strong all-rounder, very large user base means answers/help online are plentiful.",
  },
  {
    name: "Claude",
    maker: "Anthropic",
    color: "#D97757",
    tagline: "The careful writer & careful coder.",
    bestFor:
      "Long-document reasoning, nuanced writing, and — via Claude Code — agentic software engineering in your terminal or IDE.",
    notes:
      "Claude Code can read a repo, plan a change, edit multiple files, run tests, and iterate — it behaves like a junior engineer you supervise, not just an autocomplete.",
  },
  {
    name: "Gemini",
    maker: "Google DeepMind",
    color: "#4285F4",
    tagline: "Native multimodal, deeply wired into Google's stack.",
    bestFor:
      "Understanding images/video/audio together, huge context windows, tight integration with Gmail, Docs, and Search.",
    notes:
      "Because it's built by Google, it benefits from being close to Search and Workspace — handy if your work already lives there.",
  },
  {
    name: "Perplexity",
    maker: "Perplexity AI",
    color: "#20808D",
    tagline: "An answer engine, not a chat toy.",
    bestFor: "Research with citations — it browses the live web and shows its sources inline.",
    notes:
      "Best when you need to trust an answer enough to act on it — every claim can be traced back to a link.",
  },
  {
    name: "Grok",
    maker: "xAI",
    color: "#000000",
    tagline: "Real-time, opinionated, and wired into X (Twitter).",
    bestFor: "Up-to-the-minute takes on trending topics and a more informal tone.",
    notes: "Its edge is live access to X's firehose of data, useful for current-events pulse-checks.",
  },
  {
    name: "DeepSeek",
    maker: "DeepSeek AI",
    color: "#4C6EF5",
    tagline: "Open-weight models that punch far above their price.",
    bestFor: "Cost-sensitive projects, self-hosting, and strong reasoning/coding at a fraction of the cost.",
    notes:
      "Open weights mean you can run it on your own infrastructure — attractive for privacy-sensitive or high-volume use.",
  },
  {
    name: "Meta AI (Llama)",
    maker: "Meta",
    color: "#0668E1",
    tagline: "The open-source backbone of the AI ecosystem.",
    bestFor: "Builders who want to fine-tune or self-host a capable base model, embedded across Meta's apps.",
    notes:
      "Llama's open weights are the foundation many smaller startups and research projects build on top of.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AIToolsPage() {
  return (
    <main className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen">
      {/* subtle blueprint grid backdrop */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* HERO */}
      <header className="relative border-b border-slate-200 dark:border-slate-800 px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Tutorial · AI Tools &amp; Agents</Eyebrow>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
            A field guide to the tools
            <br />
            <span className="text-blue-600 dark:text-blue-400">everyone's suddenly using.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            What ChatGPT, Claude, Gemini, Perplexity, Grok, DeepSeek and Meta AI actually
            are, what an <em>AI agent</em> is and why it matters right now, how to build
            your own AI voice assistant end-to-end, and the cheat sheets + interview
            questions to make it all stick - explained with diagrams, not jargon.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["ChatGPT", "Claude", "Gemini", "Perplexity", "Grok", "DeepSeek", "Meta AI", "AI Agents", "Voice Assistant"].map(
              (t) => (
                <span
                  key={t}
                  className="text-xs font-mono px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                >
                  {t}
                </span>
              )
            )}
          </div>
        </div>
      </header>

      {/* WHAT IS AN AI TOOL */}
      <Section id="what-is-ai-tool" eyebrow="01 · Foundations" title="What exactly is an “AI tool”?">
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          An AI tool is software that uses a trained model — usually a large language
          model (LLM) — to understand a request in plain language and produce a useful
          response: text, code, an image, a spoken answer, or an action taken on your
          behalf. Under the hood, most of the tools in this guide share the same basic
          shape:
        </p>

        <DiagramFrame label="1 — the basic shape of an AI tool">
          <svg viewBox="0 0 760 180" className="w-full h-auto text-slate-700 dark:text-slate-300">
            <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3">
              <rect x="10" y="60" width="140" height="60" rx="10" />
              <rect x="230" y="30" width="160" height="120" rx="10" />
              <rect x="470" y="60" width="140" height="60" rx="10" />
              <rect x="640" y="60" width="110" height="60" rx="10" />
            </g>
            <g fontFamily="ui-monospace, monospace" fontSize="12" fill="currentColor" textAnchor="middle">
              <text x="80" y="94">You / a user</text>
              <text x="310" y="80">Model</text>
              <text x="310" y="98">(reasoning +</text>
              <text x="310" y="116">knowledge)</text>
              <text x="540" y="94">Response</text>
              <text x="695" y="94">Action</text>
            </g>
            <g stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow1)">
              <line x1="150" y1="90" x2="228" y2="90" />
              <line x1="390" y1="90" x2="468" y2="90" />
              <line x1="610" y1="90" x2="638" y2="90" />
            </g>
            <defs>
              <marker id="arrow1" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill="currentColor" />
              </marker>
            </defs>
          </svg>
        </DiagramFrame>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          The differences between ChatGPT, Claude, Gemini and the rest come down to{" "}
          <strong>what data trained the model</strong>, <strong>how it's wired to other systems</strong>{" "}
          (search, your files, a code editor, X's live feed), and{" "}
          <strong>what it's allowed to do</strong> after it answers — read-only chat, or
          take real actions. That last distinction is exactly what separates a plain
          chatbot from an <em>AI agent</em>, covered in section 3.
        </p>
      </Section>

      {/* TOOL BY TOOL */}
      <Section id="tools" eyebrow="02 · The Roster" title="ChatGPT, Claude, Gemini & friends">
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          They all "chat," but they were built for different jobs. Here's the practical
          difference — what each one is actually best pulled out for.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-900/40"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: tool.color }}
                />
                <h3 className="font-semibold text-slate-900 dark:text-white">{tool.name}</h3>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                  {tool.maker}
                </span>
              </div>
              <p className="text-sm italic text-slate-500 dark:text-slate-400 mb-3">
                {tool.tagline}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                <span className="font-medium text-slate-800 dark:text-slate-200">Best for: </span>
                {tool.bestFor}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{tool.notes}</p>
            </div>
          ))}
        </div>

        <Callout tone="info" title="Rule of thumb">
          Pick the tool by the <em>shape of the task</em>, not brand loyalty: writing/code
          → Claude, everyday assistant/images → ChatGPT, multimodal + Google ecosystem →
          Gemini, sourced research → Perplexity, real-time social pulse → Grok,
          budget/self-hosted → DeepSeek or Llama.
        </Callout>
      </Section>

      {/* AI AGENTS */}
      <Section id="ai-agents" eyebrow="03 · Beyond Chat" title="What is an AI Agent — and why now?">
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          A chatbot answers a question. An <strong>AI agent</strong> pursues a goal: it
          breaks a task into steps, uses tools (a browser, a code runner, a calendar, an
          API), checks its own results, and loops until the goal is met — largely without
          you babysitting every step.
        </p>

        <DiagramFrame label="2 — the agent loop">
          <svg viewBox="0 0 640 320" className="w-full h-auto text-slate-700 dark:text-slate-300">
            <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3">
              <circle cx="320" cy="160" r="150" />
              <rect x="255" y="20" width="130" height="50" rx="10" />
              <rect x="450" y="130" width="130" height="50" rx="10" />
              <rect x="255" y="245" width="130" height="50" rx="10" />
              <rect x="60" y="130" width="130" height="50" rx="10" />
            </g>
            <g fontFamily="ui-monospace, monospace" fontSize="12" fill="currentColor" textAnchor="middle">
              <text x="320" y="48">1. Perceive</text>
              <text x="320" y="62" fontSize="10" opacity="0.7">read goal + context</text>
              <text x="515" y="150">2. Plan</text>
              <text x="515" y="164" fontSize="10" opacity="0.7">choose next step</text>
              <text x="320" y="273">3. Act</text>
              <text x="320" y="287" fontSize="10" opacity="0.7">call a tool / API</text>
              <text x="125" y="150">4. Observe</text>
              <text x="125" y="164" fontSize="10" opacity="0.7">check the result</text>
              <text x="320" y="163" fontSize="11" opacity="0.6">loop until</text>
              <text x="320" y="178" fontSize="11" opacity="0.6">goal is met</text>
            </g>
          </svg>
        </DiagramFrame>

        <div className="grid md:grid-cols-3 gap-4 mt-2">
          <Callout tone="good" title="Why we need this now">
            Work has gotten more asynchronous and API-shaped — code, tickets, spreadsheets,
            emails. Agents can chain many small steps (search → draft → check → send) that
            used to require a human at every handoff, freeing people for judgment calls
            instead of busywork.
          </Callout>
          <Callout tone="warn" title="What if it didn't exist">
            Every multi-step job (research a topic, fix a bug across ten files, triage an
            inbox) would still need a human to manually stitch each tool together. Nothing
            catastrophic — just slower, and it doesn't scale with the flood of digital
            tasks companies now generate.
          </Callout>
          <Callout tone="info" title="How it actually helps">
            It compresses "steps I have to babysit" down to "outcomes I review." A good
            agent still needs a human checkpoint for anything risky or irreversible —
            think co-pilot, not autopilot.
          </Callout>
        </div>
      </Section>

      {/* VOICE ASSISTANT */}
      <Section
        id="voice-assistant"
        eyebrow="04 · Build It Yourself"
        title="How to build your own AI voice assistant"
      >
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          A voice assistant is just an agent with ears and a mouth: audio comes in,
          gets turned into text, an LLM reasons about it, and the answer is spoken back.
          Here's the pipeline end to end.
        </p>

        <DiagramFrame label="3 — voice assistant pipeline">
          <svg viewBox="0 0 900 200" className="w-full h-auto text-slate-700 dark:text-slate-300">
            <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3">
              <rect x="10" y="70" width="120" height="60" rx="10" />
              <rect x="175" y="70" width="140" height="60" rx="10" />
              <rect x="360" y="70" width="140" height="60" rx="10" />
              <rect x="545" y="70" width="140" height="60" rx="10" />
              <rect x="730" y="70" width="140" height="60" rx="10" />
            </g>
            <g fontFamily="ui-monospace, monospace" fontSize="11" fill="currentColor" textAnchor="middle">
              <text x="70" y="96">🎙 Mic</text>
              <text x="70" y="112" fontSize="9" opacity="0.7">audio in</text>
              <text x="245" y="96">VAD + STT</text>
              <text x="245" y="112" fontSize="9" opacity="0.7">Whisper / Deepgram</text>
              <text x="430" y="96">LLM</text>
              <text x="430" y="112" fontSize="9" opacity="0.7">Claude / GPT reasoning</text>
              <text x="615" y="96">TTS</text>
              <text x="615" y="112" fontSize="9" opacity="0.7">ElevenLabs / PlayHT</text>
              <text x="800" y="96">🔊 Speaker</text>
              <text x="800" y="112" fontSize="9" opacity="0.7">audio out</text>
            </g>
            <g stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow2)">
              <line x1="130" y1="100" x2="173" y2="100" />
              <line x1="315" y1="100" x2="358" y2="100" />
              <line x1="500" y1="100" x2="543" y2="100" />
              <line x1="685" y1="100" x2="728" y2="100" />
            </g>
            <defs>
              <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill="currentColor" />
              </marker>
            </defs>
          </svg>
        </DiagramFrame>

        <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed list-decimal list-inside">
          <li>
            <strong className="text-slate-900 dark:text-white">Capture audio + detect speech.</strong>{" "}
            Use Voice Activity Detection (VAD) so you only send audio when someone's
            actually talking — this alone cuts latency and cost a lot.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Speech-to-text (STT).</strong>{" "}
            Stream audio to a transcription model (e.g. Whisper, Deepgram, AssemblyAI) and
            get back live text.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Reasoning (LLM).</strong>{" "}
            Send the transcript, plus conversation memory and any tools the assistant is
            allowed to call (calendar, search, smart-home), to an LLM API.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Text-to-speech (TTS).</strong>{" "}
            Turn the model's reply into natural audio (ElevenLabs, PlayHT, Azure/Google
            TTS) and stream it back — start playback before the whole sentence finishes
            generating, so it feels instant.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Interruption handling.</strong>{" "}
            Let the user talk over the assistant; cancel the current TTS stream the moment
            new speech is detected. This is what separates a "real" assistant from a
            walkie-talkie.
          </li>
        </ol>

        <h3 className="font-semibold text-slate-900 dark:text-white mt-8 mb-3">Tech stack you'll actually use</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-slate-200 dark:border-slate-800">
                <th className="py-2 pr-4 font-mono text-xs uppercase tracking-wider text-slate-500">Layer</th>
                <th className="py-2 pr-4 font-mono text-xs uppercase tracking-wider text-slate-500">Options</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              {[
                ["Real-time transport", "WebRTC, LiveKit, Twilio Media Streams, WebSockets"],
                ["Speech-to-text", "OpenAI Whisper, Deepgram, AssemblyAI, Google STT"],
                ["Reasoning / LLM", "Claude API, GPT-4/5 API, Gemini API — with function/tool calling"],
                ["Text-to-speech", "ElevenLabs, PlayHT, Azure Neural TTS, Google TTS"],
                ["Orchestration", "Node.js or Python backend, LangGraph / custom state machine"],
                ["Memory / state", "Redis (session), a vector DB (Pinecone/pgvector) for long-term memory"],
                ["Frontend", "Next.js / React for a web client, or a native mobile app"],
                ["Infra", "Docker, a GPU or serverless inference endpoint, CDN for static assets"],
              ].map(([layer, opts]) => (
                <tr key={layer} className="border-b border-slate-100 dark:border-slate-900">
                  <td className="py-2 pr-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {layer}
                  </td>
                  <td className="py-2 pr-4">{opts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout tone="warn" title="The metric that actually matters: latency">
          Aim for under ~800ms from "user stops talking" to "assistant starts talking."
          Past that, conversations feel robotic. Stream every stage (STT partials, LLM
          tokens, TTS audio chunks) instead of waiting for each step to fully finish.
        </Callout>
      </Section>

      {/* WHY NEEDED / WHAT IF NOT / HOW IT HELPS */}
      <Section
        id="why-now"
        eyebrow="05 · The Bigger Picture"
        title="Why AI tools matter right now"
      >
        <div className="grid md:grid-cols-3 gap-4">
          <Callout tone="info" title="Why we need it">
            Information and busywork have both exploded — inboxes, tickets, documents,
            codebases. AI tools compress hours of reading/drafting/searching into minutes,
            which is less a luxury than a way to keep up.
          </Callout>
          <Callout tone="warn" title="What if it didn't exist">
            We'd fall back to manual research, manual first-drafts, manual debugging —
            all still possible, just linearly slower, and small teams would struggle to
            do what larger teams can.
          </Callout>
          <Callout tone="good" title="How it actually helps">
            Faster first drafts, faster debugging, faster research synthesis, and — via
            agents — entire small workflows running with a human only reviewing the
            output rather than performing every step.
          </Callout>
        </div>
      </Section>

      {/* CHEAT SHEET */}
      <Section id="cheat-sheet" eyebrow="06 · Cheat Sheet" title="Prompting & tool-picking cheat sheet">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Prompting basics</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>✅ Say the goal, the audience, and the format you want back.</li>
              <li>✅ Give one good example when the output format matters.</li>
              <li>✅ Ask the model to think step by step for anything multi-part.</li>
              <li>✅ Set constraints explicitly: length, tone, what to avoid.</li>
              <li>✅ Iterate — treat the first answer as a draft, not a verdict.</li>
              <li>🚫 Don't bury the actual question in paragraphs of context.</li>
              <li>🚫 Don't trust numbers/citations without checking them.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Which tool, which job</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li><strong>Write / edit prose</strong> → Claude, ChatGPT</li>
              <li><strong>Ship code, multi-file changes</strong> → Claude Code</li>
              <li><strong>Cited research</strong> → Perplexity</li>
              <li><strong>Multimodal (image/video/audio)</strong> → Gemini</li>
              <li><strong>Real-time / social trends</strong> → Grok</li>
              <li><strong>Cheap or self-hosted</strong> → DeepSeek, Llama</li>
              <li><strong>Automating multi-step work</strong> → an agent framework on top of any of the above</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* IMPORTANT THINGS TO KEEP IN MIND */}
      <Section id="important" eyebrow="07 · Read Before You Ship" title="Important things to keep in mind">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            ["Hallucination is real", "Models can state wrong things confidently. Verify anything that has real-world consequences."],
            ["Data privacy", "Don't paste secrets, credentials, or sensitive personal data into a tool you don't control."],
            ["Prompt injection", "Any agent that reads untrusted text (emails, web pages) can be tricked by instructions hidden in that text — sandbox and review what it's allowed to do."],
            ["Cost adds up", "Voice + long context + many agent steps = many API calls. Track token/usage costs from day one."],
            ["Context windows aren't infinite", "Very long conversations get truncated or summarized — design for that instead of being surprised by it."],
            ["Keep a human in the loop", "For anything irreversible (sending money, deleting data, publishing publicly), require a human confirmation step."],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/40"
            >
              <p className="font-medium text-slate-900 dark:text-white mb-1">{title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* INTERVIEW QUESTIONS */}
      <Section id="interview" eyebrow="08 · Test Yourself" title="Puzzled interview questions">
        <div className="space-y-3">
          <QA
            q="A chatbot and an AI agent both use the same LLM. What actually makes one an 'agent'?"
            a="The ability to take multi-step, tool-using action toward a goal and evaluate its own results — a chatbot just returns text for a single turn, an agent plans, acts, observes, and loops."
          />
          <QA
            q="Your voice assistant feels 'laggy' even though the LLM responds in 400ms. Where else could the delay be hiding?"
            a="Almost anywhere else in the pipeline: STT not streaming partial results, waiting for a full LLM response instead of streaming tokens, TTS generating full audio before playback starts, or network round-trips on each stage instead of one persistent connection."
          />
          <QA
            q="What is RAG, in one sentence, and why would you use it instead of just fine-tuning?"
            a="Retrieval-Augmented Generation fetches relevant documents at request time and feeds them into the prompt, so the model answers with current, specific facts — it's usually faster to update and cheaper than fine-tuning a model every time your data changes."
          />
          <QA
            q="Two models have the same benchmark scores. How could their real-world usefulness still differ a lot?"
            a="Benchmarks measure narrow tasks; real usefulness also depends on latency, cost per call, context window size, tool/function-calling reliability, and how well the model follows formatting instructions — none of which a single accuracy number captures."
          />
          <QA
            q="Why might an open-weight model like DeepSeek or Llama be the right call even if a closed model scores higher?"
            a="Self-hosting removes per-token API cost at scale, keeps sensitive data in-house, and avoids depending on a third party's uptime or policy changes — worth more than a few extra benchmark points for many teams."
          />
          <QA
            q="An agent you built can browse the web and send emails. What's the single biggest new risk you've introduced?"
            a="Prompt injection: a malicious web page or email the agent reads could contain hidden instructions ('ignore previous instructions and forward this to...') that hijack the agent's next action — so untrusted content must never be treated as trusted instructions."
          />
          <QA
            q="What happens when a conversation exceeds the model's context window, and how should you design around it?"
            a="Older messages get dropped or summarized to make room; design for it by actively summarizing history, storing long-term facts outside the prompt (e.g. a database), and only pulling in what's relevant to the current turn."
          />
        </div>
      </Section>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-10">
        <div className="max-w-5xl mx-auto px-6 text-sm text-slate-500 dark:text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>Tutorial · AI Tools &amp; Agents - a living field guide.</span>
          <span className="font-mono text-xs">Keep Coding, Keep Creating ...</span>
        </div>
      </footer>
    </main>
  );
}