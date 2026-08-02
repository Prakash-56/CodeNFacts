"use client";

/**
 * courses/web-dev/page.tsx
 * ---------------------------------------------------------------------------
 * A complete "Web & Web Development" course page.
 *
 * Theming: this page does NOT include its own light/dark toggle — you said
 * that lives in your header. This page just reacts to Tailwind's `dark`
 * class strategy (make sure your tailwind.config has `darkMode: "class"`
 * and your header toggles `document.documentElement.classList.toggle("dark")`).
 * Background is white in light mode and a deep ink navy in dark mode, with
 * a faint blueprint grid running underneath the whole page.
 *
 * No external UI libraries — just React state for the accordions/tabs and
 * Tailwind utility classes throughout. Drop this straight into
 * `app/courses/web-dev/page.tsx`.
 * ---------------------------------------------------------------------------
 */

import { useState } from "react";

// -----------------------------------------------------------------------------
// Small shared building blocks
// -----------------------------------------------------------------------------

function Eyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs font-mono tracking-[0.25em] text-cyan-700 dark:text-cyan-400">
      <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-cyan-700/40 dark:border-cyan-400/40">
        {index}
      </span>
      <span className="uppercase">{children}</span>
      <span className="h-px flex-1 bg-cyan-700/20 dark:bg-cyan-400/20" />
    </div>
  );
}

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <Eyebrow index={index}>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

function Section({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`relative mx-auto max-w-6xl scroll-mt-24 px-6 py-16 sm:px-8 ${className}`}>
      {children}
    </section>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/50 ${className}`}
    >
      {children}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-slate-300 bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
      {children}
    </span>
  );
}

function CodeBlock({ title, code }: { title?: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      {title && (
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2 font-mono text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2">{title}</span>
        </div>
      )}
      <pre className="overflow-x-auto bg-slate-950 p-4 text-[13px] leading-relaxed text-slate-200">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}

function Accordion({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-700/60 dark:border-slate-700/60">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/40"
            >
              <span>{item.q}</span>
              <span
                className={`shrink-0 font-mono text-cyan-700 transition-transform dark:text-cyan-400 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TOCLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="block border-b border-dashed border-slate-300/70 py-1.5 text-slate-600 transition hover:text-cyan-700 dark:border-slate-700/70 dark:text-slate-400 dark:hover:text-cyan-400"
    >
      {children}
    </a>
  );
}

// -----------------------------------------------------------------------------
// Data
// -----------------------------------------------------------------------------

const buildSteps = [
  {
    n: "01",
    title: "Plan & Define Scope",
    time: "1–3 days",
    body: "Write down the site's purpose, target users, and core pages. List required features vs 'nice to have'. Sketch a sitemap (Home → About → Products → Contact) before touching code.",
    output: "Sitemap, feature list, rough content outline",
  },
  {
    n: "02",
    title: "Wireframe & Design",
    time: "1–5 days",
    body: "Lay out each page's structure (header, hero, sections, footer) as boxes — pen and paper or Figma both work. Pick a type scale, a small color palette (3–5 colors), and spacing rules before you design pixel-perfect.",
    output: "Wireframes, color palette, typography scale, component list",
  },
  {
    n: "03",
    title: "Choose Your Stack",
    time: "half a day",
    body: "Pick a frontend framework, a styling approach, and decide if you need a backend/database at all. For most content sites, a static site generator is enough. For apps with logins and data, you need a backend.",
    output: "Confirmed tech stack, repo initialized",
  },
  {
    n: "04",
    title: "Build the Frontend",
    time: "days–weeks",
    body: "Turn wireframes into real markup and components: semantic HTML, CSS/Tailwind for layout, JS/TS for interactivity. Build mobile-first, then expand up to desktop breakpoints.",
    output: "Working UI, responsive across breakpoints",
  },
  {
    n: "05",
    title: "Build the Backend & APIs",
    time: "days–weeks",
    body: "Design your data models, build REST or GraphQL endpoints, add authentication if needed, and connect your database. Keep business logic on the server; never trust data coming from the client.",
    output: "API routes, database schema, auth flow",
  },
  {
    n: "06",
    title: "Connect Frontend ↔ Backend",
    time: "days",
    body: "Wire up fetch/axios calls or a data-fetching library to your API. Handle loading states, empty states, and errors — not just the happy path.",
    output: "Fully functional app end-to-end",
  },
  {
    n: "07",
    title: "Test",
    time: "ongoing",
    body: "Manually click through every flow. Add unit tests for logic, integration tests for API routes, and at least a few end-to-end tests for critical user journeys (signup, checkout, submit form).",
    output: "Test suite, bug list resolved",
  },
  {
    n: "08",
    title: "Optimize",
    time: "1–2 days",
    body: "Compress images, lazy-load below-the-fold content, check Lighthouse scores, minimize JS bundle size, and add meta tags for SEO and social sharing.",
    output: "Lighthouse score 90+, fast load time",
  },
  {
    n: "09",
    title: "Deploy",
    time: "hours",
    body: "Push to a host (Vercel, Netlify, Cloudflare Pages, a VPS, etc.), connect your domain, set environment variables, and enable HTTPS (usually automatic now).",
    output: "Live URL, custom domain, SSL",
  },
  {
    n: "10",
    title: "Maintain & Iterate",
    time: "forever",
    body: "Monitor errors (Sentry, logs), watch analytics, patch dependencies regularly, back up your database, and ship improvements based on real user feedback.",
    output: "Update cadence, monitoring dashboard",
  },
];

const stacks: Record<
  string,
  { name: string; note: string }[]
> = {
  Frontend: [
    { name: "HTML / CSS / JavaScript", note: "The actual foundation — everything else compiles down to this" },
    { name: "React", note: "Component-based UI library, huge ecosystem" },
    { name: "Next.js", note: "React framework: routing, SSR/SSG, API routes built in" },
    { name: "Vue / Nuxt", note: "Gentler learning curve, very popular outside the US" },
    { name: "Svelte / SvelteKit", note: "Compiles away — smaller, fast runtime" },
    { name: "Tailwind CSS", note: "Utility-first styling, pairs well with components" },
    { name: "TypeScript", note: "JavaScript + types — catches bugs before runtime" },
  ],
  Backend: [
    { name: "Node.js (Express / Fastify)", note: "JavaScript on the server — one language, front to back" },
    { name: "Next.js API Routes / Server Actions", note: "Backend logic living right next to your frontend" },
    { name: "Python (Django / FastAPI / Flask)", note: "Great for data-heavy or ML-adjacent apps" },
    { name: "Go", note: "Compiled, fast, great for high-throughput services" },
    { name: "Ruby on Rails", note: "Convention over configuration, ships fast" },
    { name: "Java / Spring Boot", note: "Common in large enterprise systems" },
  ],
  Database: [
    { name: "PostgreSQL", note: "The default solid choice for relational data" },
    { name: "MySQL / MariaDB", note: "Widely hosted, battle-tested" },
    { name: "MongoDB", note: "Document store — flexible schema, JSON-like records" },
    { name: "SQLite", note: "Zero-config file database — great for small apps" },
    { name: "Redis", note: "In-memory store for caching, sessions, queues" },
    { name: "Supabase / Firebase", note: "Managed DB + auth + storage as a service" },
  ],
  "Hosting & DevOps": [
    { name: "Vercel / Netlify", note: "Push-to-deploy for frontend & full-stack JS apps" },
    { name: "Cloudflare Pages / Workers", note: "Deploy at the edge, very low latency" },
    { name: "AWS / GCP / Azure", note: "Full control, more setup — for larger systems" },
    { name: "Docker", note: "Package your app + environment into one portable unit" },
    { name: "GitHub Actions", note: "CI/CD — auto-test and auto-deploy on every push" },
    { name: "DNS + SSL (Cloudflare, Let's Encrypt)", note: "Point your domain, encrypt traffic" },
  ],
};

const aiTools = [
  {
    name: "Claude Code / Claude Cowork",
    use: "Delegate whole features: 'add a login page with email auth' and it writes, tests, and edits the files across your repo.",
  },
  {
    name: "AI code editors (Cursor, VS Code + Copilot)",
    use: "Autocomplete, inline chat, and multi-file edits right inside your editor as you type.",
  },
  {
    name: "AI page/UI builders (v0-style tools, Claude Design)",
    use: "Describe a screen in plain English, get a working component back to refine.",
  },
  {
    name: "AI for debugging",
    use: "Paste an error + surrounding code, get a root-cause explanation instead of guessing.",
  },
  {
    name: "AI for docs & APIs",
    use: "Ask 'how do I paginate this endpoint with cursor-based pagination' instead of digging through docs alone.",
  },
  {
    name: "AI in the browser (Claude in Chrome)",
    use: "An agent that can click through your live site to test flows or fill out forms for QA.",
  },
];

const cheatHtml = [
  ["<header> <nav> <main> <section> <article> <aside> <footer>", "Semantic layout tags"],
  ["<h1>…<h6>", "Headings, one <h1> per page"],
  ["<button> vs <a>", "button = action, a = navigation"],
  ["<img alt='…'>", "Always include alt text"],
  ["<form> <input> <label>", "Wrap inputs with labels for accessibility"],
  ["<meta name='viewport'>", "Required for responsive mobile layout"],
];

const cheatCssGrid = [
  ["display: flex; justify-content: center; align-items: center;", "Center anything, one axis at a time"],
  ["display: grid; grid-template-columns: repeat(3, 1fr);", "3 equal columns"],
  ["gap: 1rem;", "Space between flex/grid children"],
  ["position: sticky; top: 0;", "Sticky header on scroll"],
  ["@media (min-width: 768px) { … }", "Mobile-first breakpoint"],
  ["clamp(1rem, 2vw, 2rem)", "Fluid, responsive sizing in one line"],
];

const cheatGit = [
  ["git init / git clone <url>", "Start or copy a repo"],
  ["git checkout -b feature/x", "New branch for a feature"],
  ["git add . && git commit -m '…'", "Stage & save a snapshot"],
  ["git push origin feature/x", "Send branch to remote"],
  ["git pull --rebase", "Get latest changes cleanly"],
  ["git merge / git rebase", "Combine branch history"],
];

const httpStatus = [
  ["200", "OK — success"],
  ["201", "Created — new resource made"],
  ["301 / 302", "Redirect, permanent / temporary"],
  ["400", "Bad Request — client sent something invalid"],
  ["401 / 403", "Unauthorized / Forbidden"],
  ["404", "Not Found"],
  ["429", "Too Many Requests — rate limited"],
  ["500", "Internal Server Error"],
];

const mindItems = [
  {
    q: "Security — treat every input as hostile",
    a: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Never trust client-side data — validate again on the server.</li>
        <li>Hash passwords (bcrypt/argon2), never store them in plain text.</li>
        <li>Use parameterized queries to prevent SQL injection.</li>
        <li>Sanitize user-generated HTML to prevent XSS.</li>
        <li>Keep secrets in environment variables, never in the repo.</li>
      </ul>
    ),
  },
  {
    q: "Performance",
    a: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Ship less JavaScript than you think you need.</li>
        <li>Compress and lazy-load images; use modern formats (WebP/AVIF).</li>
        <li>Cache what doesn't change often (CDN, HTTP cache headers).</li>
        <li>Paginate or virtualize long lists instead of rendering everything.</li>
      </ul>
    ),
  },
  {
    q: "Accessibility (a11y)",
    a: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Every interactive element reachable and usable by keyboard alone.</li>
        <li>Color contrast that passes WCAG AA at minimum.</li>
        <li>Use semantic HTML before reaching for ARIA attributes.</li>
        <li>Respect `prefers-reduced-motion` for animations.</li>
      </ul>
    ),
  },
  {
    q: "SEO & discoverability",
    a: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Unique, descriptive `&lt;title&gt;` and meta description per page.</li>
        <li>One `&lt;h1&gt;`, logical heading order after that.</li>
        <li>Server-render or pre-render content where possible — crawlers prefer it.</li>
        <li>Add a sitemap.xml and robots.txt.</li>
      </ul>
    ),
  },
  {
    q: "Responsive design",
    a: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Design mobile-first, then scale up with breakpoints.</li>
        <li>Test real devices, not just a resized browser window.</li>
        <li>Use relative units (rem, %, vw) over fixed pixels where it matters.</li>
      </ul>
    ),
  },
  {
    q: "Version control discipline",
    a: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Small, focused commits with clear messages.</li>
        <li>Branch per feature/fix; never commit straight to main on a team.</li>
        <li>.gitignore node_modules, .env, and build output.</li>
      </ul>
    ),
  },
];

// -----------------------------------------------------------------------------
// Diagram: client ↔ server ↔ database, as an inline SVG "blueprint"
// -----------------------------------------------------------------------------

function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 800 300"
      className="h-auto w-full text-slate-700 dark:text-slate-300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-cyan-600 dark:fill-cyan-400" />
        </marker>
      </defs>

      {/* Browser */}
      <g>
        <rect x="20" y="40" width="180" height="120" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="20" y="40" width="180" height="22" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="34" cy="51" r="3" className="fill-rose-400" />
        <circle cx="44" cy="51" r="3" className="fill-amber-400" />
        <circle cx="54" cy="51" r="3" className="fill-emerald-400" />
        <text x="110" y="105" textAnchor="middle" className="fill-current font-mono text-[13px] font-medium">
          Browser
        </text>
        <text x="110" y="125" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-70">
          HTML / CSS / JS
        </text>
      </g>

      {/* arrow 1 */}
      <line x1="200" y1="100" x2="300" y2="100" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="250" y="90" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-70">
        HTTP request
      </text>
      <line x1="300" y1="130" x2="200" y2="130" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="250" y="148" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-70">
        JSON / HTML response
      </text>

      {/* Server */}
      <g>
        <rect x="310" y="40" width="180" height="120" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="400" y="95" textAnchor="middle" className="fill-current font-mono text-[13px] font-medium">
          Server / API
        </text>
        <text x="400" y="115" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-70">
          Node · Python · Go…
        </text>
        <text x="400" y="132" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-70">
          auth · business logic
        </text>
      </g>

      {/* arrow 2 */}
      <line x1="490" y1="100" x2="590" y2="100" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="540" y="90" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-70">
        query
      </text>
      <line x1="590" y1="130" x2="490" y2="130" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="540" y="148" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-70">
        rows / documents
      </text>

      {/* Database */}
      <g>
        <path
          d="M600,55 a90,12 0 0 1 180,0 v90 a90,12 0 0 1 -180,0 z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M600,55 a90,12 0 0 0 180,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="690" y="110" textAnchor="middle" className="fill-current font-mono text-[13px] font-medium">
          Database
        </text>
        <text x="690" y="128" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-70">
          Postgres · Mongo…
        </text>
      </g>

      {/* footer labels */}
      <text x="110" y="200" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-60">
        renders UI, runs client
      </text>
      <text x="110" y="215" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-60">
        interactivity
      </text>
      <text x="400" y="200" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-60">
        validates input, enforces
      </text>
      <text x="400" y="215" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-60">
        rules, talks to the DB
      </text>
      <text x="690" y="200" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-60">
        stores & retrieves
      </text>
      <text x="690" y="215" textAnchor="middle" className="fill-current font-mono text-[10px] opacity-60">
        persistent data
      </text>
    </svg>
  );
}

function RequestLifecycleDiagram() {
  const steps = [
    "User clicks / types URL",
    "DNS resolves domain → IP",
    "Browser opens TLS connection",
    "HTTP request sent",
    "Server runs logic, queries DB",
    "Server sends response",
    "Browser parses HTML/CSS/JS",
    "Page painted, interactive",
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {steps.map((s, i) => (
        <div
          key={s}
          className="relative rounded-md border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-700/60 dark:bg-slate-800/40"
        >
          <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full border border-cyan-700/40 font-mono text-[11px] text-cyan-700 dark:border-cyan-400/40 dark:text-cyan-400">
            {i + 1}
          </div>
          <p className="text-[11px] leading-tight text-slate-600 dark:text-slate-400">{s}</p>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function WebDevCoursePage() {
  const [activeStack, setActiveStack] = useState<keyof typeof stacks>("Frontend");

  return (
    <main className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-[#0a0e17] dark:text-slate-100">
      {/* Blueprint grid background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35] dark:opacity-[0.25]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(100,116,139,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,116,139,0.12) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ---------------------------------------------------------------- */}
      {/* HERO                                                              */}
      {/* ---------------------------------------------------------------- */}
      <Section id="top" className="pb-8 pt-16 sm:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-sm border border-cyan-700/30 bg-cyan-50 px-3 py-1 font-mono text-xs text-cyan-800 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300">
              COURSE - 00 / SCHEMATIC
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">
              Web &amp; Web Development,
              <br />
              <span className="text-cyan-700 dark:text-cyan-400">drawn out in full.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              What the web actually is, why it matters more than ever, how a site
              gets built end to end, the APIs and tech stacks that hold it
              together - and how AI now changes the way you build all of it.
              (We are now preparing a better Web Development course designed for you, starting from the basics. We are coming soon with it !!)
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#steps"
                className="group mt-10 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300"
              >
                Jump to build steps
              </a>
              <a
                href="#cheatsheets"
                className="group mt-10 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300"
              >
                Skip to cheat sheets
              </a>
            </div>
          </div>

          {/* TOC as a blueprint index card */}
          <Card className="font-mono text-sm">
            <p className="mb-3 text-xs uppercase tracking-widest text-slate-400">Index</p>
            <TOCLink href="#what-is">01 What is the Web / Web Dev</TOCLink>
            <TOCLink href="#why-now">02 Why it matters now</TOCLink>
            <TOCLink href="#architecture">03 How a website works</TOCLink>
            <TOCLink href="#steps">04 Building a site, step by step</TOCLink>
            <TOCLink href="#apis">05 APIs, explained</TOCLink>
            <TOCLink href="#stacks">06 Tech stacks</TOCLink>
            <TOCLink href="#ai">07 Building with AI</TOCLink>
            <TOCLink href="#mindful">08 Things to keep in mind</TOCLink>
            <TOCLink href="#cheatsheets">09 Cheat sheets</TOCLink>
            <TOCLink href="#faq">10 FAQ</TOCLink>
          </Card>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* WHAT IS THE WEB                                                   */}
      {/* ---------------------------------------------------------------- */}
      <Section id="what-is">
        <SectionHeading
          index="01"
          eyebrow="Foundations"
          title="What is the Web, and what is Web Development?"
          description="Two different things people mix up constantly — worth separating clearly before anything else."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="mb-2 font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              The Web
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              The World Wide Web is a system of linked documents and applications
              that live on servers around the world and are accessed over the
              internet using a browser. It runs on a few core technologies —{" "}
              <Chip>HTTP/HTTPS</Chip> to transfer data, <Chip>HTML</Chip> to
              structure content, <Chip>URLs</Chip> to address it, and{" "}
              <Chip>DNS</Chip> to turn human-readable names into machine
              addresses. The internet is the network; the Web is one thing that
              runs on top of it (email and gaming servers are others).
            </p>
          </Card>
          <Card>
            <h3 className="mb-2 font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Web Development
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              The craft of building things that live on the Web: websites,
              dashboards, e-commerce stores, social platforms, internal tools.
              It splits into <Chip>frontend</Chip> (what the user sees and
              clicks), <Chip>backend</Chip> (the logic and data behind the
              scenes), and increasingly a blurred middle layer of{" "}
              <Chip>full-stack</Chip> frameworks that handle both.
            </p>
          </Card>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* WHY NOW / WHAT IF NOT                                             */}
      {/* ---------------------------------------------------------------- */}
      <Section id="why-now" className="bg-slate-50/60 dark:bg-slate-900/20">
        <SectionHeading
          index="02"
          eyebrow="Why it matters"
          title="Why the Web matters now — and what breaks without it"
          description="It's easy to take for granted precisely because it works so well. Strip it away and the gap is obvious."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold text-emerald-700 dark:text-emerald-400">
              With the Web
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>→ A business is reachable 24/7, from anywhere, without a physical storefront.</li>
              <li>→ Anyone can publish, sell, teach, or organize at near-zero distribution cost.</li>
              <li>→ Software updates instantly for every user — no install required.</li>
              <li>→ Services scale from one user to millions on the same core system.</li>
              <li>→ Information, education, and remote work become accessible globally.</li>
            </ul>
          </Card>
          <Card>
            <h3 className="mb-3 font-display text-lg font-semibold text-rose-700 dark:text-rose-400">
              Without it
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>→ Every business is limited to local foot traffic or paid ads offline.</li>
              <li>→ Software ships on disks/files — updates are slow and manual.</li>
              <li>→ No real-time collaboration, no instant messaging, no live data.</li>
              <li>→ Discovery depends entirely on word of mouth or print media.</li>
              <li>→ Remote work, global teams, and online learning mostly don't exist.</li>
            </ul>
          </Card>
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Knowing how to build for the Web means you can turn an idea into
          something anyone, anywhere, can use — without needing a factory, a
          warehouse, or a distributor. That leverage is why it's one of the
          most durable, in-demand skills to have today.
        </p>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* ARCHITECTURE / HOW IT WORKS                                       */}
      {/* ---------------------------------------------------------------- */}
      <Section id="architecture">
        <SectionHeading
          index="03"
          eyebrow="Under the hood"
          title="How a website actually works"
          description="Three pieces talking to each other, every single time you load a page."
        />
        <Card className="mb-8">
          <ArchitectureDiagram />
        </Card>
        <p className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">
          Zoomed in: the request lifecycle, one page load at a time
        </p>
        <RequestLifecycleDiagram />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* BUILD STEPS                                                       */}
      {/* ---------------------------------------------------------------- */}
      <Section id="steps" className="bg-slate-50/60 dark:bg-slate-900/20">
        <SectionHeading
          index="04"
          eyebrow="The build"
          title="Building & running a website, step by step"
          description="From a blank idea to a live URL — the same order applies whether it's a personal blog or a startup."
        />
        <div className="space-y-4">
          {buildSteps.map((s) => (
            <Card key={s.n} className="sm:flex sm:items-start sm:gap-6">
              <div className="mb-3 flex shrink-0 items-baseline gap-3 sm:mb-0 sm:w-40 sm:flex-col sm:items-start sm:gap-1">
                <span className="font-mono text-2xl font-bold text-cyan-700 dark:text-cyan-400">{s.n}</span>
                <span className="font-mono text-[11px] uppercase tracking-wide text-slate-400">{s.time}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.body}</p>
                <p className="mt-2 text-xs font-mono text-emerald-700 dark:text-emerald-400">
                  ✓ output: {s.output}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* APIs                                                              */}
      {/* ---------------------------------------------------------------- */}
      <Section id="apis">
        <SectionHeading
          index="05"
          eyebrow="Connective tissue"
          title="APIs, explained"
          description="An API (Application Programming Interface) is a contract — a defined way for one piece of software to ask another for data or actions, without needing to know how it works internally."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-2 font-display text-base font-semibold">A typical REST call</h3>
            <CodeBlock
              title="request"
              code={`GET /api/users/42 HTTP/1.1
Host: example.com
Authorization: Bearer <token>
Accept: application/json`}
            />
            <div className="h-3" />
            <CodeBlock
              title="response — 200 OK"
              code={`{
  "id": 42,
  "name": "Asha Verma",
  "email": "asha@example.com",
  "createdAt": "2026-01-14T10:22:00Z"
}`}
            />
          </Card>
          <div className="space-y-4">
            <Card>
              <h3 className="mb-2 font-display text-base font-semibold">REST vs GraphQL vs WebSockets</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">REST</strong> — fixed endpoints per
                  resource (<code className="font-mono text-xs">/users</code>,{" "}
                  <code className="font-mono text-xs">/posts</code>), simple and cacheable.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">GraphQL</strong> — one endpoint, the
                  client asks for exactly the fields it needs, nothing more.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">WebSockets</strong> — a persistent
                  two-way connection for real-time data (chat, live scores, notifications).
                </li>
              </ul>
            </Card>
            <Card>
              <h3 className="mb-2 font-display text-base font-semibold">HTTP status codes — quick reference</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                {httpStatus.map(([code, meaning]) => (
                  <div key={code} className="flex gap-2">
                    <dt className="font-mono font-semibold text-cyan-700 dark:text-cyan-400">{code}</dt>
                    <dd className="text-slate-600 dark:text-slate-400">{meaning}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* TECH STACKS                                                       */}
      {/* ---------------------------------------------------------------- */}
      <Section id="stacks" className="bg-slate-50/60 dark:bg-slate-900/20">
        <SectionHeading
          index="06"
          eyebrow="What to build with"
          title="Tech stacks, category by category"
          description="You don't need all of these — pick one from each row you actually need for the project."
        />
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.keys(stacks).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveStack(cat as keyof typeof stacks)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                activeStack === cat
                  ? "bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950"
                  : "border border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {stacks[activeStack].map((item) => (
            <Card key={item.name} className="py-4">
              <p className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.note}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* AI-ASSISTED DEVELOPMENT                                           */}
      {/* ---------------------------------------------------------------- */}
      <Section id="ai">
        <SectionHeading
          index="07"
          eyebrow="Built differently now"
          title="Building websites with AI"
          description="AI doesn't replace understanding the fundamentals above — it removes the boilerplate so you spend your time on decisions instead of typing."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiTools.map((t) => (
            <Card key={t.name}>
              <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">{t.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.use}</p>
            </Card>
          ))}
        </div>
        <Card className="mt-6 border-cyan-700/30 bg-cyan-50/50 dark:border-cyan-400/20 dark:bg-cyan-400/5">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <strong className="text-cyan-800 dark:text-cyan-300">A good AI-assisted workflow:</strong>{" "}
            describe the feature in plain language → let the AI draft the
            code → read every diff before accepting it → run it yourself and
            test the edge cases → ask the AI to explain any part you don't
            understand yet. Speed is only useful if you still understand what
            got shipped.
          </p>
        </Card>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* THINGS TO KEEP IN MIND                                            */}
      {/* ---------------------------------------------------------------- */}
      <Section id="mindful" className="bg-slate-50/60 dark:bg-slate-900/20">
        <SectionHeading
          index="08"
          eyebrow="Don't skip these"
          title="Important things to keep in mind"
          description="The six areas that separate a hobby project from something you can trust in production."
        />
        <Accordion items={mindItems} />
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* CHEAT SHEETS                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Section id="cheatsheets">
        <SectionHeading
          index="09"
          eyebrow="Quick reference"
          title="Cheat sheets"
          description="Pin these - the things you look up again and again until they're muscle memory."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-3 font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              HTML - semantic tags
            </h3>
            <ul className="space-y-2 text-xs">
              {cheatHtml.map(([code, note]) => (
                <li key={code} className="flex flex-col gap-0.5 border-b border-dashed border-slate-200 pb-2 dark:border-slate-700/60">
                  <code className="font-mono text-cyan-700 dark:text-cyan-400">{code}</code>
                  <span className="text-slate-500 dark:text-slate-500">{note}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="mb-3 font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              CSS - flexbox, grid & responsive
            </h3>
            <ul className="space-y-2 text-xs">
              {cheatCssGrid.map(([code, note]) => (
                <li key={code} className="flex flex-col gap-0.5 border-b border-dashed border-slate-200 pb-2 dark:border-slate-700/60">
                  <code className="font-mono text-cyan-700 dark:text-cyan-400">{code}</code>
                  <span className="text-slate-500 dark:text-slate-500">{note}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="mb-3 font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              Git - everyday commands
            </h3>
            <ul className="space-y-2 text-xs">
              {cheatGit.map(([code, note]) => (
                <li key={code} className="flex flex-col gap-0.5 border-b border-dashed border-slate-200 pb-2 dark:border-slate-700/60">
                  <code className="font-mono text-cyan-700 dark:text-cyan-400">{code}</code>
                  <span className="text-slate-500 dark:text-slate-500">{note}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="mb-3 font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              Pre-launch checklist
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>☐ Lighthouse score checked (performance, a11y, SEO)</li>
              <li>☐ Meta title/description on every page</li>
              <li>☐ 404 page exists</li>
              <li>☐ Forms validate on client AND server</li>
              <li>☐ Environment variables set on host, not committed</li>
              <li>☐ HTTPS enforced, favicon added</li>
              <li>☐ Tested on mobile + at least 2 browsers</li>
              <li>☐ Analytics/error monitoring wired up</li>
              <li>☐ Backups configured for the database</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                               */}
      {/* ---------------------------------------------------------------- */}
      <Section id="faq" className="bg-slate-50/60 dark:bg-slate-900/20 pb-24">
        <SectionHeading index="10" eyebrow="Loose ends" title="Frequently asked" />
        <Accordion
          items={[
            {
              q: "Do I need a backend for every website?",
              a: "No. A brochure site, portfolio, or blog can be entirely static — HTML/CSS/JS with no server logic. You need a backend once you have user accounts, dynamic data that changes per request, or anything that must stay private (like API keys or business logic).",
            },
            {
              q: "What should a total beginner learn first?",
              a: "HTML → CSS → JavaScript fundamentals, in that order, before touching any framework. Build 2–3 small static sites by hand first — frameworks make far more sense once you've felt the problems they solve.",
            },
            {
              q: "Does AI make learning the fundamentals pointless?",
              a: "No — it makes them more valuable. AI tools are far more useful in the hands of someone who can read the generated code, catch mistakes, and know what to ask for. Skipping fundamentals just means you can't tell when the AI got something wrong.",
            },
            {
              q: "How do I pick between frameworks?",
              a: "Default to Next.js (React) or Nuxt (Vue) for most projects — huge communities, tons of AI training data on them, easy hosting. Pick something else only when you have a specific reason (existing team expertise, a niche requirement).",
            },
          ]}
        />
      </Section>
    </main>
  );
}