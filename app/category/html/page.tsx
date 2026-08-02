"use client";

import { useState, useRef } from "react";
import {
  Code2,
  Download,
  GitBranch,
  Globe2,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  Rocket,
  MonitorSmartphone,
  ShoppingCart,
  Newspaper,
  GraduationCap,
  Building2,
  Gamepad2,
  Cpu,
  Puzzle,
} from "lucide-react";

/**
 * app/category/html/page.tsx
 * ---------------------------------------------------------------
 * An overview / study page for the "HTML" category of the course.
 * Fully supports light & dark mode via Tailwind's `dark:` variant —
 * this assumes `darkMode: "class"` in tailwind.config and that a
 * toggle already sets `class="dark"` on <html>/<body> from the
 * header, exactly as described.
 * ---------------------------------------------------------------
 */

const TAG_COLOR = "#E34F26"; // official HTML5 orange — the one deliberate accent
const ATTR_COLOR = "#2F81C7"; // attribute / value tone, like a syntax highlighter

export default function HtmlCategoryPage() {
  const [downloaded, setDownloaded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDownloadNotes = () => {
    const notes = buildNotesMarkdown();
    const blob = new Blob([notes], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "html-notes.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setDownloaded(false), 4000);
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1C1E21] dark:bg-[#12151A] dark:text-[#E7E9EA] transition-colors duration-300">
      {/* ---------------------------------------------------------- HERO */}
      <section className="relative overflow-hidden border-b border-black/5 dark:border-white/10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-20"
          style={{ background: TAG_COLOR }}
        />
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <div className="flex items-center gap-2 text-sm font-mono tracking-wide text-[#E34F26]">
            <Code2 size={16} />
            <span>&lt;CodeNFacts/html&gt;</span>
          </div>

          <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            What is{" "}
            <span className="font-mono" style={{ color: TAG_COLOR }}>
              &lt;HTML/&gt;
            </span>
            ?
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-[#4B4F54] dark:text-[#9AA1AC]">
            <strong>HTML (HyperText Markup Language)</strong> is the standard
            markup language used to create and structure content on the web.
            It isn't a programming language - it doesn't calculate or make
            decisions - it's a set of <em>tags</em> that tell the browser what
            each piece of content <em>is</em>: a heading, a paragraph, a link,
            an image, a form. Every website you've ever visited has HTML at
            its foundation.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={handleDownloadNotes}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-medium text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: TAG_COLOR }}
            >
              <Download size={18} />
              Download HTML Notes
            </button>

            {downloaded && (
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-pulse">
                🎉 Thanks for downloading! Happy coding — go build something.
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- WHY HTML */}
      <Section
        eyebrow="Why it exists"
        title="Why is HTML used, and why is it needed?"
      >
        <p className="text-[#4B4F54] dark:text-[#9AA1AC] max-w-3xl">
          Browsers only understand a handful of things natively — and HTML is
          the language that describes <em>structure and meaning</em> so a
          browser knows what to render and how. Without a shared markup
          standard, every site would need its own rendering rules, and
          nothing on the web would work the same way twice.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={<Layers size={20} />}
            title="Structure"
            body="Organizes content into headings, sections, lists, and containers so it has a clear shape."
          />
          <InfoCard
            icon={<Globe2 size={20} />}
            title="Universality"
            body="Every browser on every device understands the same tags — it's the one true common language."
          />
          <InfoCard
            icon={<Puzzle size={20} />}
            title="Foundation"
            body="CSS styles it and JavaScript makes it interactive — but there's nothing to style or script without HTML first."
          />
          <InfoCard
            icon={<CheckCircle2 size={20} />}
            title="Accessibility & SEO"
            body="Semantic tags let screen readers and search engines understand your page, not just see it."
          />
        </div>
      </Section>

      {/* ---------------------------------------------------------- HOW HTML WORKS */}
      <Section eyebrow="Under the hood" title="How does HTML actually work?">
        <p className="text-[#4B4F54] dark:text-[#9AA1AC] max-w-3xl mb-8">
          You write plain text with angle-bracket tags. The browser reads that
          text top to bottom and turns it into something it can actually
          paint on screen. Here's the pipeline:
        </p>
        <RenderPipelineDiagram />
      </Section>

      {/* ---------------------------------------------------------- BLOCK DIAGRAM */}
      <Section
        eyebrow="Document anatomy"
        title="Block diagram: the structure of an HTML document"
      >
        <p className="text-[#4B4F54] dark:text-[#9AA1AC] max-w-3xl mb-8">
          Every HTML page follows the same nested skeleton. Once you can see
          this shape in your head, reading (or writing) any HTML file gets
          much easier.
        </p>
        <DocumentTreeDiagram />
      </Section>

      {/* ---------------------------------------------------------- TAG ANATOMY SKETCH */}
      <Section
        eyebrow="Sketch"
        title="Anatomy of a tag"
      >
        <p className="text-[#4B4F54] dark:text-[#9AA1AC] max-w-3xl mb-8">
          Almost every HTML element follows this same pattern — an opening
          tag (with optional attributes), some content, and a matching
          closing tag.
        </p>
        <TagAnatomyDiagram />
      </Section>

      {/* ---------------------------------------------------------- WHAT IF NO HTML */}
      <Section
        eyebrow="Thought experiment"
        title="What if HTML didn't exist?"
      >
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
          <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/20 p-6">
            <div className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-400 mb-3">
              <XCircle size={18} />
              Without HTML
            </div>
            <ul className="space-y-2 text-sm text-[#4B4F54] dark:text-[#9AA1AC] list-disc list-inside">
              <li>No shared way to describe a heading vs. a paragraph vs. a button</li>
              <li>Every browser vendor invents its own rendering rules</li>
              <li>CSS has nothing to style; JavaScript has nothing to manipulate</li>
              <li>Screen readers and search engines can't parse meaning</li>
              <li>Links — the thing that makes it a "web" — simply don't work</li>
            </ul>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-6">
            <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
              <CheckCircle2 size={18} />
              With HTML
            </div>
            <ul className="space-y-2 text-sm text-[#4B4F54] dark:text-[#9AA1AC] list-disc list-inside">
              <li>One markup standard every browser agrees on</li>
              <li>Content, style (CSS), and behavior (JS) stay cleanly separated</li>
              <li>Documents can link to other documents - the "hyper" in hypertext</li>
              <li>Assistive tech and crawlers understand structure, not just pixels</li>
              <li>A page written in 1995 still renders in a browser today</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- WHERE USED */}
      <Section eyebrow="In the wild" title="Where is HTML used the most?">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <UseCaseCard icon={<Newspaper size={20} />} label="News & blogs" />
          <UseCaseCard icon={<ShoppingCart size={20} />} label="E-commerce stores" />
          <UseCaseCard icon={<Building2 size={20} />} label="Company & portfolio sites" />
          <UseCaseCard icon={<GraduationCap size={20} />} label="Learning platforms" />
          <UseCaseCard icon={<Gamepad2 size={20} />} label="Browser-based games" />
          <UseCaseCard icon={<MonitorSmartphone size={20} />} label="Web & hybrid mobile apps" />
        </div>
      </Section>

      {/* ---------------------------------------------------------- IS IT HELPFUL / FEATURES / FUTURE */}
      <Section eyebrow="The bigger picture" title="Is HTML helpful — features & future">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles size={18} style={{ color: TAG_COLOR }} />
              Is it helpful?
            </h3>
            <p className="text-sm text-[#4B4F54] dark:text-[#9AA1AC]">
              Extremely — it's the one skill that's non-negotiable for the
              web. You can't build a website, email template, PDF export, or
              browser extension UI without touching HTML somewhere along the
              way. It's usually the very first thing developers learn.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Cpu size={18} style={{ color: TAG_COLOR }} />
              Key features
            </h3>
            <ul className="text-sm text-[#4B4F54] dark:text-[#9AA1AC] space-y-1.5 list-disc list-inside">
              <li>Platform-independent and free to use</li>
              <li>Semantic elements for meaning, not just looks</li>
              <li>Native support for forms, media, and embeds</li>
              <li>Works hand-in-hand with CSS and JavaScript</li>
              <li>Backwards compatible — old HTML still renders today</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Rocket size={18} style={{ color: TAG_COLOR }} />
              Where it's headed
            </h3>
            <p className="text-sm text-[#4B4F54] dark:text-[#9AA1AC]">
              HTML keeps evolving through the "living standard" model — new
              elements and APIs (like <code className="font-mono">&lt;dialog&gt;</code>,
              popovers, and better form controls) ship as the web platform
              grows, without ever breaking the billions of existing pages.
            </p>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- CHEAT SHEET */}
      <Section eyebrow="Quick reference" title="HTML cheat sheet">
        <CheatSheet />
      </Section>

      {/* ---------------------------------------------------------- FOOTER CTA */}
      <section className="border-t border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-semibold text-lg">Keep these notes handy.</p>
            <p className="text-sm text-[#4B4F54] dark:text-[#9AA1AC]">
              Grab the full cheat sheet as a Markdown file you can reopen anytime.
            </p>
          </div>
          <button
            onClick={handleDownloadNotes}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-medium text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
            style={{ backgroundColor: TAG_COLOR }}
          >
            <Download size={18} />
            Download HTML Notes
          </button>
        </div>
      </section>
    </main>
  );
}

/* ================================================================== */
/* Layout helpers                                                      */
/* ================================================================== */

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-16">
        <div className="mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#E34F26]">
            {eyebrow}
          </span>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1B1F26] p-5 shadow-sm">
      <div
        className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: "#E34F2620", color: TAG_COLOR }}
      >
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[#4B4F54] dark:text-[#9AA1AC]">{body}</p>
    </div>
  );
}

function UseCaseCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1B1F26] px-5 py-4">
      <div style={{ color: TAG_COLOR }}>{icon}</div>
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
}

/* ================================================================== */
/* Diagram: browser rendering pipeline                                  */
/* ================================================================== */

function RenderPipelineDiagram() {
  const steps = [
    "HTML file",
    "Browser requests it",
    "Parse into tokens",
    "Build the DOM tree",
    "Build render tree",
    "Paint pixels on screen",
  ];
  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 1180 160"
        className="min-w-[900px] w-full h-auto"
        role="img"
        aria-label="Diagram showing how a browser turns an HTML file into pixels on screen"
      >
        {steps.map((label, i) => {
          const x = 20 + i * 195;
          return (
            <g key={label}>
              <rect
                x={x}
                y={55}
                width={160}
                height={60}
                rx={10}
                className="fill-white dark:fill-[#1B1F26] stroke-black/10 dark:stroke-white/15"
                strokeWidth={1.5}
              />
              <text
                x={x + 80}
                y={80}
                textAnchor="middle"
                className="fill-[#1C1E21] dark:fill-[#E7E9EA]"
                fontSize="13"
                fontWeight={600}
              >
                {label.split(" ").slice(0, 2).join(" ")}
              </text>
              <text
                x={x + 80}
                y={98}
                textAnchor="middle"
                className="fill-[#1C1E21] dark:fill-[#E7E9EA]"
                fontSize="13"
                fontWeight={600}
              >
                {label.split(" ").slice(2).join(" ")}
              </text>
              {i < steps.length - 1 && (
                <path
                  d={`M ${x + 160} 85 L ${x + 190} 85`}
                  stroke={TAG_COLOR}
                  strokeWidth={2}
                  markerEnd="url(#arrow)"
                />
              )}
            </g>
          );
        })}
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill={TAG_COLOR} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

/* ================================================================== */
/* Diagram: document tree (block diagram)                              */
/* ================================================================== */

function DocumentTreeDiagram() {
  const Box = ({
    x,
    y,
    w,
    h,
    label,
    filled = false,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    filled?: boolean;
  }) => (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        className={
          filled
            ? ""
            : "fill-white dark:fill-[#1B1F26] stroke-black/10 dark:stroke-white/15"
        }
        style={filled ? { fill: "#E34F2618", stroke: TAG_COLOR } : {}}
        strokeWidth={1.5}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 5}
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="13"
        fontWeight={600}
        className="fill-[#1C1E21] dark:fill-[#E7E9EA]"
      >
        {label}
      </text>
    </g>
  );

  const Line = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className="stroke-black/20 dark:stroke-white/25"
      strokeWidth={1.5}
    />
  );

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 900 340"
        className="min-w-[700px] w-full h-auto"
        role="img"
        aria-label="Tree diagram of an HTML document's structure"
      >
        <Box x={370} y={10} w={160} h={44} label="<!DOCTYPE html>" filled />
        <Line x1={450} y1={54} x2={450} y2={80} />
        <Box x={370} y={80} w={160} h={44} label="<html>" />
        <Line x1={450} y1={124} x2={230} y2={155} />
        <Line x1={450} y1={124} x2={670} y2={155} />

        <Box x={140} y={155} w={180} h={44} label="<head>" />
        <Box x={580} y={155} w={180} h={44} label="<body>" />

        <Line x1={230} y1={199} x2={140} y2={235} />
        <Line x1={230} y1={199} x2={320} y2={235} />
        <Box x={40} y={235} w={160} h={40} label="<title>" />
        <Box x={240} y={235} w={160} h={40} label="<meta>" />

        <Line x1={670} y1={199} x2={560} y2={235} />
        <Line x1={670} y1={199} x2={670} y2={235} />
        <Line x1={670} y1={199} x2={790} y2={235} />
        <Box x={480} y={235} w={140} h={40} label="<header>" />
        <Box x={640} y={235} w={140} h={40} label="<main>" />
        <Box x={800} y={235} w={140} h={40} label="<footer>" />
      </svg>
    </div>
  );
}

/* ================================================================== */
/* Diagram: tag anatomy sketch                                         */
/* ================================================================== */

function TagAnatomyDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 760 190"
        className="min-w-[600px] w-full h-auto"
        role="img"
        aria-label="Labeled diagram of an HTML tag showing opening tag, attribute, value, content, and closing tag"
      >
        <text x="20" y="55" fontFamily="monospace" fontSize="26" fontWeight={700}>
          <tspan fill={TAG_COLOR}>&lt;p </tspan>
          <tspan fill={ATTR_COLOR}>class</tspan>
          <tspan className="fill-[#1C1E21] dark:fill-[#E7E9EA]">=</tspan>
          <tspan fill="#2E9E5B">"intro"</tspan>
          <tspan fill={TAG_COLOR}>&gt;</tspan>
          <tspan className="fill-[#1C1E21] dark:fill-[#E7E9EA]">Hello World</tspan>
          <tspan fill={TAG_COLOR}>&lt;/p&gt;</tspan>
        </text>

        {/* callouts */}
        <Callout x={45} label="opening tag" color={TAG_COLOR} />
        <Callout x={150} label="attribute" color={ATTR_COLOR} />
        <Callout x={230} label="value" color="#2E9E5B" />
        <Callout x={430} label="content" />
        <Callout x={680} label="closing tag" color={TAG_COLOR} />
      </svg>
    </div>
  );
}

function Callout({ x, label, color }: { x: number; label: string; color?: string }) {
  return (
    <g>
      <line x1={x} y1={65} x2={x} y2={95} stroke={color ?? "#9AA1AC"} strokeWidth={1.5} />
      <text
        x={x}
        y={112}
        fontSize="12"
        textAnchor="middle"
        className={color ? "" : "fill-[#4B4F54] dark:fill-[#9AA1AC]"}
        style={color ? { fill: color } : {}}
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  );
}

/* ================================================================== */
/* Cheat sheet                                                         */
/* ================================================================== */

const CHEAT_SHEET_GROUPS: { group: string; tags: string[] }[] = [
  { group: "Document", tags: ["<!DOCTYPE html>", "<html>", "<head>", "<body>", "<meta>", "<title>"] },
  { group: "Text", tags: ["<h1>–<h6>", "<p>", "<br>", "<hr>", "<strong>", "<em>", "<mark>", "<small>"] },
  { group: "Lists", tags: ["<ul>", "<ol>", "<li>", "<dl>", "<dt>", "<dd>"] },
  { group: "Links & media", tags: ["<a>", "<img>", "<audio>", "<video>", "<source>", "<iframe>"] },
  { group: "Tables", tags: ["<table>", "<thead>", "<tbody>", "<tr>", "<th>", "<td>"] },
  { group: "Forms", tags: ["<form>", "<input>", "<label>", "<textarea>", "<select>", "<button>"] },
  { group: "Semantic", tags: ["<header>", "<nav>", "<main>", "<section>", "<article>", "<aside>", "<footer>"] },
];

function CheatSheet() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CHEAT_SHEET_GROUPS.map((g) => (
        <div
          key={g.group}
          className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1B1F26] p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <GitBranch size={16} style={{ color: TAG_COLOR }} />
            <h3 className="font-semibold text-sm">{g.group}</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {g.tags.map((t) => (
              <span
                key={t}
                className="font-mono text-xs rounded px-2 py-1 bg-black/5 dark:bg-white/10 text-[#1C1E21] dark:text-[#E7E9EA]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/* Notes file content                                                   */
/* ================================================================== */

function buildNotesMarkdown() {
  return `# HTML Notes

## What is HTML?
HTML (HyperText Markup Language) is the standard markup language for
structuring content on the web. It uses tags to describe what each piece
of content is (heading, paragraph, link, image, form) rather than how it
looks - that's CSS's job - or how it behaves - that's JavaScript's job.

## Why is HTML used / needed?
- Gives content structure and meaning
- Universally understood by every browser and device
- The foundation CSS and JavaScript build on top of
- Enables accessibility (screen readers) and SEO (search engines)

## How HTML works (rendering pipeline)
1. Browser requests the HTML file
2. Browser parses the file into tokens
3. Tokens are built into the DOM tree
4. DOM + CSS combine into a render tree
5. Browser paints pixels on screen

## Document structure (block diagram)
\`\`\`
<!DOCTYPE html>
<html>
  <head>
    <title>...</title>
    <meta ... />
  </head>
  <body>
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </body>
</html>
\`\`\`

## Anatomy of a tag
\`<p class="intro">Hello World</p>\`
- Opening tag: <p
- Attribute: class
- Value: "intro"
- Content: Hello World
- Closing tag: </p>

## What if HTML didn't exist?
No shared way to describe content, no common rendering rules across
browsers, nothing for CSS or JS to attach to, no links, and no
accessible/searchable structure.

## Where is HTML used most?
News & blogs, e-commerce, company/portfolio sites, learning platforms,
browser games, and web/hybrid mobile apps.

## Is it helpful? Features & future
HTML is essential — the starting point for almost anything on the web.
Key features: platform-independent, semantic, form/media support, works
with CSS/JS, backwards compatible. HTML keeps evolving as a "living
standard," adding new elements and APIs without breaking old pages.

## Cheat sheet
- Document: <!DOCTYPE html>, <html>, <head>, <body>, <meta>, <title>
- Text: <h1>-<h6>, <p>, <br>, <hr>, <strong>, <em>, <mark>, <small>
- Lists: <ul>, <ol>, <li>, <dl>, <dt>, <dd>
- Links & media: <a>, <img>, <audio>, <video>, <source>, <iframe>
- Tables: <table>, <thead>, <tbody>, <tr>, <th>, <td>
- Forms: <form>, <input>, <label>, <textarea>, <select>, <button>
- Semantic: <header>, <nav>, <main>, <section>, <article>, <aside>, <footer>

Thanks for downloading — happy coding!
`;
}