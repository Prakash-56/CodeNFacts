"use client";

/**
 * Web Development — Category Page
 * ---------------------------------------------------------------
 * A self-contained, single-file Next.js (App Router) page that explains
 * Web Development end-to-end: what it is, why it matters, its types,
 * roadmaps, architecture diagrams, code snippets, cheat sheets, theory,
 * blog-style reads and a "Download Notes" button.
 *
 * DARK MODE NOTE:
 * This page has NO toggle of its own. It uses Tailwind's `dark:` variant
 * throughout, so it automatically follows whatever dark/light mode your
 * app's existing header toggle already controls.
 * Requirement: tailwind.config.js must have `darkMode: "class"`, and
 * something in your app (next-themes, a context, etc.) toggles the
 * `dark` class on <html> or a parent element. That's it — no extra
 * wiring needed on this page.
 * ---------------------------------------------------------------
 */

import { useState } from "react";

// -----------------------------------------------------------------------
// Static content data
// -----------------------------------------------------------------------

const TYPES = [
  {
    title: "Frontend Development",
    icon: "🎨",
    desc: "Everything the user sees and interacts with in the browser — layout, styling, interactivity. Built with HTML, CSS, JavaScript and UI frameworks like React, Vue or Angular.",
    stack: ["HTML", "CSS", "JavaScript", "React / Vue / Angular", "Tailwind CSS"],
  },
  {
    title: "Backend Development",
    icon: "⚙️",
    desc: "The server-side engine: business logic, databases, authentication and APIs that power the frontend. Invisible to the user, but where the real data lives.",
    stack: ["Node.js", "Python (Django/Flask)", "Java (Spring)", "PHP (Laravel)", "Databases"],
  },
  {
    title: "Full-Stack Development",
    icon: "🧩",
    desc: "A developer (or team) who works across both frontend and backend, capable of shipping a complete product end-to-end.",
    stack: ["MERN", "MEAN", "Django + React", "Next.js (Full-stack)"],
  },
  {
    title: "Static Website Development",
    icon: "📄",
    desc: "Fixed content pages with no server-side processing per request — fast, cheap to host, great for portfolios and landing pages.",
    stack: ["HTML/CSS", "Static Site Generators", "Netlify / GitHub Pages"],
  },
  {
    title: "Dynamic Website Development",
    icon: "🔄",
    desc: "Content that changes based on user, time or data — driven by a backend and a database on every request.",
    stack: ["Server-side rendering", "Databases", "APIs", "Sessions/Auth"],
  },
  {
    title: "E-commerce Development",
    icon: "🛒",
    desc: "Online stores with product catalogs, carts, payments and order management.",
    stack: ["Shopify", "WooCommerce", "Stripe/Razorpay", "Custom carts"],
  },
  {
    title: "CMS Development",
    icon: "📝",
    desc: "Websites built on a Content Management System so non-developers can add/edit content without touching code.",
    stack: ["WordPress", "Strapi", "Sanity", "Contentful"],
  },
  {
    title: "Progressive Web Apps (PWA)",
    icon: "📱",
    desc: "Websites that behave like native mobile apps — installable, offline-capable, push notifications.",
    stack: ["Service Workers", "Web App Manifest", "Workbox"],
  },
];

const WHY_POINTS = [
  { title: "Global Reach", desc: "A website is accessible to anyone, anywhere, at any time — your best 24/7 salesperson." },
  { title: "Credibility & Branding", desc: "A professional web presence builds trust before a customer ever talks to you." },
  { title: "Automation", desc: "Forms, bookings, payments and support can run themselves without manual effort." },
  { title: "Business Growth", desc: "E-commerce and lead-generation sites directly convert visitors into revenue." },
  { title: "Career Opportunities", desc: "One of the highest-demand tech skills, with roles in frontend, backend, DevOps and beyond." },
  { title: "Real-time Interaction", desc: "Chat, notifications and live dashboards keep users engaged instantly." },
];

const FRONTEND_ROADMAP = [
  "HTML — structure & semantics",
  "CSS — styling, box model, layout",
  "JavaScript — logic & interactivity",
  "Git & GitHub — version control",
  "Responsive Design — media queries, mobile-first",
  "CSS Frameworks — Tailwind CSS / Bootstrap",
  "JS Framework — React / Vue / Angular",
  "State Management — Redux / Zustand / Context",
  "TypeScript — type safety",
  "Testing — Jest / React Testing Library",
  "Build Tools & Deployment — Vite, Vercel, Netlify",
];

const BACKEND_ROADMAP = [
  "A Language — Node.js / Python / Java / PHP",
  "Databases — SQL (PostgreSQL/MySQL) & NoSQL (MongoDB)",
  "APIs — REST principles & GraphQL",
  "Authentication — JWT, OAuth, Sessions",
  "Server Frameworks — Express / Django / Spring Boot",
  "Caching — Redis",
  "Testing — unit & integration tests",
  "DevOps Basics — Docker, CI/CD",
  "Cloud & Deployment — AWS / GCP / Azure",
  "Monitoring & Logging",
];

const CHEATSHEETS = [
  {
    title: "HTML Essentials",
    rows: [
      ["<div> / <span>", "Generic block / inline container"],
      ["<header> <main> <footer>", "Semantic landmarks"],
      ["<h1>–<h6>", "Headings (only one <h1> per page)"],
      ["<a href='' >", "Hyperlink"],
      ["<img src='' alt='' />", "Image (alt is required for accessibility)"],
      ["<form> <input> <button>", "User input & submission"],
      ["<ul>/<ol>/<li>", "Lists"],
      ["<table><tr><td>", "Tabular data"],
    ],
  },
  {
    title: "CSS Flexbox / Grid",
    rows: [
      ["display: flex;", "Turns children into a flex row"],
      ["justify-content", "Aligns items on main axis"],
      ["align-items", "Aligns items on cross axis"],
      ["flex-wrap: wrap;", "Allows items to wrap to next line"],
      ["display: grid;", "Turns element into a grid container"],
      ["grid-template-columns", "Defines column tracks"],
      ["gap: 1rem;", "Space between grid/flex items"],
      ["@media (max-width: 768px)", "Responsive breakpoint"],
    ],
  },
  {
    title: "JavaScript Array Methods",
    rows: [
      [".map()", "Transform each element → new array"],
      [".filter()", "Keep elements matching a condition"],
      [".reduce()", "Fold array into a single value"],
      [".find()", "First element matching condition"],
      [".forEach()", "Loop without returning anything"],
      [".sort()", "Sort in place"],
      [".includes()", "Check membership"],
      [".slice() / .splice()", "Copy portion / mutate array"],
    ],
  },
  {
    title: "Git Commands",
    rows: [
      ["git init", "Start a new repository"],
      ["git clone <url>", "Copy a remote repo locally"],
      ["git add .", "Stage all changes"],
      ["git commit -m 'msg'", "Save a snapshot"],
      ["git push origin main", "Upload commits to remote"],
      ["git pull", "Fetch + merge from remote"],
      ["git branch <name>", "Create a new branch"],
      ["git merge <branch>", "Combine branches"],
    ],
  },
];

const NOTES_SECTIONS = [
  {
    title: "1. HTML — The Skeleton",
    body:
      "HTML (HyperText Markup Language) defines the structure and meaning of content using elements/tags. Semantic tags (<header>, <nav>, <main>, <article>, <footer>) describe meaning, not just appearance, which helps accessibility (screen readers) and SEO. Forms (<form>, <input>, <select>, <textarea>) collect user input. Every HTML document starts with <!DOCTYPE html> to trigger standards mode in the browser.",
  },
  {
    title: "2. CSS — The Skin",
    body:
      "CSS (Cascading Style Sheets) styles HTML: colors, spacing, typography, layout. The Box Model (content → padding → border → margin) governs every element's size. Flexbox handles one-dimensional layout (rows/columns); CSS Grid handles two-dimensional layout (rows AND columns together). Media queries (@media) make designs responsive across screen sizes — 'mobile-first' means designing for small screens first, then adding complexity for larger ones.",
  },
  {
    title: "3. JavaScript — The Brain",
    body:
      "JavaScript adds interactivity: it can read/change the DOM, respond to events (clicks, input), talk to servers (fetch/AJAX) and run logic in the browser. Core concepts: variables (let/const), functions, arrays/objects, the event loop, and asynchronous programming with Promises and async/await. The DOM (Document Object Model) is a tree representation of the page that JavaScript can manipulate live.",
  },
  {
    title: "4. Frontend Frameworks",
    body:
      "React (component-based, uses a virtual DOM and JSX), Vue (approachable, template-based) and Angular (full framework with TypeScript built-in) let developers build UI as reusable components instead of hand-editing the DOM. They manage state, re-render efficiently, and enable complex single-page applications (SPAs).",
  },
  {
    title: "5. Backend Development",
    body:
      "The backend runs on a server, handling requests, business logic, and talking to databases. Node.js (JavaScript on the server) is popular for its non-blocking, event-driven model. Express.js is a minimal server framework on top of Node. The backend exposes APIs (commonly REST — using GET/POST/PUT/DELETE over HTTP, or GraphQL — a query language for APIs) that the frontend calls.",
  },
  {
    title: "6. Databases",
    body:
      "SQL databases (PostgreSQL, MySQL) store data in structured tables with relationships and enforce a strict schema — great for consistent, relational data. NoSQL databases (MongoDB, Firebase) store flexible, often JSON-like documents — great for rapidly changing or unstructured data. Choosing between them depends on your data's shape and how strict consistency needs to be.",
  },
  {
    title: "7. Version Control (Git & GitHub)",
    body:
      "Git tracks every change to your code over time, letting teams work in parallel via branches and merge their work safely. GitHub (or GitLab/Bitbucket) hosts Git repositories in the cloud and adds collaboration tools: pull requests, issues, code review and CI/CD pipelines.",
  },
  {
    title: "8. Deployment & Hosting",
    body:
      "Once built, a site needs to be hosted so the world can reach it. Static sites deploy easily on Vercel, Netlify or GitHub Pages. Full-stack apps often use cloud platforms (AWS, GCP, Azure) or PaaS (Render, Railway). Docker packages an app with its dependencies into a portable 'container' so it runs identically everywhere. CI/CD pipelines automatically test and deploy code on every push.",
  },
  {
    title: "9. Performance & SEO",
    body:
      "Performance: minimize bundle size, lazy-load images/components, cache assets, use a CDN. Core Web Vitals (LCP, FID/INP, CLS) measure real user experience. SEO: semantic HTML, meta tags, fast load times, mobile-friendliness and quality content help a site rank in search engines.",
  },
  {
    title: "10. Security Basics",
    body:
      "HTTPS encrypts data in transit using TLS. CORS controls which origins may call your API. Always sanitize user input to prevent XSS (Cross-Site Scripting) and use parameterized queries to prevent SQL Injection. Authentication (proving who a user is) is commonly done via JWTs or sessions; Authorization (what they're allowed to do) is checked on every protected request.",
  },
];

const FEATURES_FUTURE = [
  { title: "AI-Assisted Development", desc: "Copilots and AI agents (like Claude Code) now scaffold, debug and refactor code, shifting developers toward reviewing and directing rather than typing every line." },
  { title: "JAMstack & Static-first", desc: "JavaScript, APIs and prebuilt Markup for blazing-fast, secure sites served from a CDN." },
  { title: "Serverless & Edge Computing", desc: "Run backend code without managing servers, deployed close to the user for lower latency." },
  { title: "WebAssembly (Wasm)", desc: "Near-native performance in the browser for heavy tasks like video editing or games, written in languages like Rust or C++." },
  { title: "Progressive Web Apps", desc: "Web apps that install, work offline and send push notifications like native apps." },
  { title: "Low-code / No-code", desc: "Visual builders (Webflow, Bubble) letting non-developers ship real products, expanding who can 'build for the web.'" },
];

const USE_CASES = [
  "Business & portfolio websites", "E-commerce stores", "SaaS products & dashboards",
  "Blogs & content platforms", "Social networks", "Government & civic portals",
  "Educational / e-learning platforms", "Booking & reservation systems", "Real-time chat & collaboration tools",
];

const BLOGS = [
  {
    title: "Why Every Business Needs a Website in 2026",
    read: "5 min read",
    excerpt: "A storefront never sleeps online. We break down how a simple, fast website compounds into trust, discoverability and revenue — even for businesses that started offline.",
  },
  {
    title: "React vs Vue vs Angular: Picking Your First Framework",
    read: "7 min read",
    excerpt: "Each framework solves the same core problem — turning data into UI — differently. Here's a practical, non-hype comparison to help you choose based on your project, not internet debates.",
  },
  {
    title: "REST vs GraphQL: What Actually Changes for You",
    read: "6 min read",
    excerpt: "REST is simple and cache-friendly; GraphQL gives clients precise control over what data they fetch. We walk through a real endpoint built both ways.",
  },
  {
    title: "The Anatomy of a Web Request, End to End",
    read: "8 min read",
    excerpt: "From typing a URL to pixels on screen: DNS lookup, TCP handshake, HTTP request, server processing, and browser rendering — the full journey, demystified.",
  },
];

// -----------------------------------------------------------------------
// Downloadable notes content (compiled from the sections above)
// -----------------------------------------------------------------------
function buildNotesText() {
  const lines: string[] = [];
  lines.push("=================================================");
  lines.push("           WEB DEVELOPMENT — FULL NOTES");
  lines.push("=================================================\n");

  lines.push("WHAT IS WEB DEVELOPMENT?");
  lines.push(
    "Web development is the process of building, programming and maintaining websites and web applications — everything a user sees in their browser (frontend) and everything running behind the scenes on a server (backend), connected by a network.\n"
  );

  lines.push("WHY WEB DEVELOPMENT MATTERS");
  WHY_POINTS.forEach((p) => lines.push(`- ${p.title}: ${p.desc}`));
  lines.push("");

  lines.push("TYPES OF WEB DEVELOPMENT");
  TYPES.forEach((t) => lines.push(`- ${t.title}: ${t.desc} [${t.stack.join(", ")}]`));
  lines.push("");

  lines.push("FRONTEND ROADMAP");
  FRONTEND_ROADMAP.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));
  lines.push("");

  lines.push("BACKEND ROADMAP");
  BACKEND_ROADMAP.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));
  lines.push("");

  lines.push("DETAILED NOTES");
  NOTES_SECTIONS.forEach((n) => {
    lines.push(`\n${n.title}`);
    lines.push("-".repeat(n.title.length));
    lines.push(n.body);
  });

  lines.push("\nCHEAT SHEETS");
  CHEATSHEETS.forEach((c) => {
    lines.push(`\n${c.title}`);
    c.rows.forEach((r) => lines.push(`  ${r[0]}  ->  ${r[1]}`));
  });

  lines.push("\nUSE CASES");
  USE_CASES.forEach((u) => lines.push(`- ${u}`));

  lines.push("\nFEATURES & FUTURE OF WEB DEVELOPMENT");
  FEATURES_FUTURE.forEach((f) => lines.push(`- ${f.title}: ${f.desc}`));

  lines.push("\nTHEORY: CLIENT–SERVER MODEL");
  lines.push(
    "1. Browser (client) sends an HTTP request to a server (e.g. GET /index.html).\n2. DNS resolves the domain name to an IP address.\n3. A TCP connection is established (with TLS handshake for HTTPS).\n4. The server processes the request, possibly querying a database.\n5. The server sends back an HTTP response (HTML/JSON + status code).\n6. The browser parses HTML into the DOM, CSS into the CSSOM, combines them into a render tree, then paints pixels to the screen.\n7. JavaScript may run to add interactivity or fetch more data asynchronously."
  );

  lines.push("\n\nThank you for downloading these notes. Happy Learning! 🎉");
  return lines.join("\n");
}

// -----------------------------------------------------------------------
// Small reusable presentational helpers
// -----------------------------------------------------------------------
function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2 text-indigo-600 dark:text-cyan-400">
        {eyebrow}
      </p>
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900 dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="rounded-xl p-4 overflow-x-auto text-sm leading-relaxed font-mono border bg-slate-900 border-slate-700 text-slate-100 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200">
      <code>{code}</code>
    </pre>
  );
}

// -----------------------------------------------------------------------
// Main Page Component
// -----------------------------------------------------------------------
export default function WebDevelopmentPage() {
  const [openNote, setOpenNote] = useState<number | null>(0);
  const [showThanks, setShowThanks] = useState(false);

  const handleDownload = () => {
    const text = buildNotesText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Web-Development-Notes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 4000);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* ---------------- SECTION NAV ---------------- */}
      {/* No toggle here on purpose — this page follows your app's existing
          light/dark mode toggle via the `dark` class on a parent element. */}
      <div className="sticky top-0 z-50 backdrop-blur border-b bg-white/80 border-slate-200 dark:bg-slate-950/80 dark:border-slate-800">
        <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6 text-sm font-medium overflow-x-auto text-slate-600 dark:text-slate-400">
          <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">🌐 Web Development</span>
          <a href="#types" className="hover:opacity-80 whitespace-nowrap">Types</a>
          <a href="#roadmap" className="hover:opacity-80 whitespace-nowrap">Roadmap</a>
          <a href="#diagram" className="hover:opacity-80 whitespace-nowrap">Architecture</a>
          <a href="#code" className="hover:opacity-80 whitespace-nowrap">Code</a>
          <a href="#notes" className="hover:opacity-80 whitespace-nowrap">Notes</a>
          <a href="#cheatsheets" className="hover:opacity-80 whitespace-nowrap">Cheat Sheets</a>
          <a href="#blog" className="hover:opacity-80 whitespace-nowrap">Blog</a>
        </nav>
      </div>

      {/* ---------------- HERO ---------------- */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 text-indigo-600 dark:text-cyan-400">
          Category · Learn
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl">
          Web Development, <span className="text-indigo-600 dark:text-cyan-400">explained end to end.</span>
        </h1>
        <p className="text-lg max-w-2xl mb-8 text-slate-600 dark:text-slate-400">
          What it is, why it matters, every type you'll encounter, full roadmaps, architecture
          diagrams, real code snippets, cheat sheets and a complete set of notes you can take with you.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownload}
            className="px-6 py-3 rounded-full font-semibold text-white bg-indigo-600 dark:bg-cyan-500 hover:opacity-90 transition-opacity"
          >
            ⬇ Download Web Development Notes
          </button>
          <a
            href="#roadmap"
            className="px-6 py-3 rounded-full font-semibold border border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            View Roadmap
          </a>
        </div>
      </section>

      {/* ---------------- WHAT IS / WHY ---------------- */}
      <Section eyebrow="Fundamentals" title="What is Web Development?">
        <p className="max-w-3xl leading-relaxed mb-6 text-slate-600 dark:text-slate-400">
          Web development is the work of building and maintaining websites and web applications —
          the code that runs in a visitor's browser (the <strong>frontend</strong>), the code that
          runs on a remote server (the <strong>backend</strong>), and the databases, APIs and
          infrastructure that connect them. It spans everything from a single static landing page
          to a full-scale application like an email client or an online bank.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {[
            { k: "Frontend", v: "What the user sees & clicks" },
            { k: "Backend", v: "Logic, data & authentication" },
            { k: "Infrastructure", v: "Hosting, databases, networks" },
          ].map((b) => (
            <div key={b.k} className="rounded-xl border p-5 bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <p className="font-bold mb-1 text-indigo-600 dark:text-cyan-400">{b.k}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{b.v}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Motivation" title="Why Web Development? Why is it needed?">
        <div className="grid md:grid-cols-3 gap-4">
          {WHY_POINTS.map((p) => (
            <div key={p.title} className="rounded-xl border p-5 bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <p className="font-bold mb-1">{p.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- TYPES ---------------- */}
      <Section id="types" eyebrow="Landscape" title="Types of Web Development">
        <div className="grid md:grid-cols-2 gap-4">
          {TYPES.map((t) => (
            <div key={t.title} className="rounded-xl border p-5 bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{t.icon}</span>
                <p className="font-bold">{t.title}</p>
              </div>
              <p className="text-sm mb-3 text-slate-600 dark:text-slate-400">{t.desc}</p>
              <div className="flex flex-wrap gap-2">
                {t.stack.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-1 rounded-full bg-white text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-transparent"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- ROADMAP ---------------- */}
      <Section id="roadmap" eyebrow="Path" title="Roadmaps: Frontend & Backend">
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { title: "🎨 Frontend Roadmap", steps: FRONTEND_ROADMAP },
            { title: "⚙️ Backend Roadmap", steps: BACKEND_ROADMAP },
          ].map((col) => (
            <div key={col.title}>
              <p className="font-bold mb-4">{col.title}</p>
              <ol className="relative border-l-2 pl-6 space-y-5 border-slate-300 dark:border-slate-700">
                {col.steps.map((s, i) => (
                  <li key={s} className="relative">
                    <span className="absolute -left-[31px] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-indigo-600 dark:bg-cyan-500">
                      {i + 1}
                    </span>
                    <p className="text-sm">{s}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- ARCHITECTURE / BLOCK DIAGRAM ---------------- */}
      <Section id="diagram" eyebrow="Theory" title="How the Web Works: Client–Server Diagram">
        <div className="rounded-xl border p-6 overflow-x-auto bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <svg viewBox="0 0 800 260" className="w-full min-w-[640px]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" className="fill-indigo-600 dark:fill-cyan-400" />
              </marker>
            </defs>

            {/* Client */}
            <rect x="30" y="90" width="160" height="80" rx="12" className="fill-indigo-50 stroke-indigo-200 dark:fill-slate-950 dark:stroke-slate-700" />
            <text x="110" y="125" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-slate-800 dark:fill-slate-200">Client</text>
            <text x="110" y="145" textAnchor="middle" fontSize="11" className="fill-slate-500 dark:fill-slate-400">(Browser)</text>

            {/* Server */}
            <rect x="320" y="90" width="160" height="80" rx="12" className="fill-indigo-50 stroke-indigo-200 dark:fill-slate-950 dark:stroke-slate-700" />
            <text x="400" y="125" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-slate-800 dark:fill-slate-200">Server</text>
            <text x="400" y="145" textAnchor="middle" fontSize="11" className="fill-slate-500 dark:fill-slate-400">(Node / Django / etc.)</text>

            {/* Database */}
            <rect x="610" y="90" width="160" height="80" rx="12" className="fill-indigo-50 stroke-indigo-200 dark:fill-slate-950 dark:stroke-slate-700" />
            <text x="690" y="125" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-slate-800 dark:fill-slate-200">Database</text>
            <text x="690" y="145" textAnchor="middle" fontSize="11" className="fill-slate-500 dark:fill-slate-400">(SQL / NoSQL)</text>

            {/* Arrows client -> server */}
            <line x1="190" y1="110" x2="318" y2="110" strokeWidth="2" markerEnd="url(#arrow)" className="stroke-indigo-600 dark:stroke-cyan-400" />
            <text x="254" y="100" textAnchor="middle" fontSize="10" className="fill-indigo-600 dark:fill-cyan-400">HTTP Request</text>

            <line x1="318" y1="150" x2="190" y2="150" strokeWidth="2" markerEnd="url(#arrow)" className="stroke-indigo-600 dark:stroke-cyan-400" />
            <text x="254" y="168" textAnchor="middle" fontSize="10" className="fill-indigo-600 dark:fill-cyan-400">HTML/JSON Response</text>

            {/* Arrows server -> db */}
            <line x1="480" y1="110" x2="608" y2="110" strokeWidth="2" markerEnd="url(#arrow)" className="stroke-indigo-600 dark:stroke-cyan-400" />
            <text x="544" y="100" textAnchor="middle" fontSize="10" className="fill-indigo-600 dark:fill-cyan-400">Query</text>

            <line x1="608" y1="150" x2="480" y2="150" strokeWidth="2" markerEnd="url(#arrow)" className="stroke-indigo-600 dark:stroke-cyan-400" />
            <text x="544" y="168" textAnchor="middle" fontSize="10" className="fill-indigo-600 dark:fill-cyan-400">Rows / Documents</text>

            <text x="400" y="230" textAnchor="middle" fontSize="12" className="fill-slate-500 dark:fill-slate-400">
              DNS resolves the domain → TCP/TLS handshake → HTTP request/response cycle repeats for every page or API call
            </text>
          </svg>
        </div>
      </Section>

      {/* ---------------- CODE SNIPPETS ---------------- */}
      <Section id="code" eyebrow="Practice" title="Code Snippets You'll Actually Use">
        <div className="space-y-8">
          <div>
            <p className="font-semibold mb-2">1. HTML — Basic Page Boilerplate</p>
            <CodeBlock
              code={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My First Page</title>
</head>
<body>
  <header><h1>Hello, Web!</h1></header>
  <main><p>This is a basic HTML document.</p></main>
</body>
</html>`}
            />
          </div>

          <div>
            <p className="font-semibold mb-2">2. CSS — Flexbox Centering</p>
            <CodeBlock
              code={`.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 1rem;
}

@media (max-width: 640px) {
  .container { flex-direction: column; }
}`}
            />
          </div>

          <div>
            <p className="font-semibold mb-2">3. JavaScript — Fetching Data (async/await)</p>
            <CodeBlock
              code={`async function getUsers() {
  const response = await fetch("https://api.example.com/users");
  if (!response.ok) throw new Error("Request failed");
  const data = await response.json();
  return data;
}

getUsers().then(console.log).catch(console.error);`}
            />
          </div>

          <div>
            <p className="font-semibold mb-2">4. React — A Simple Component with State</p>
            <CodeBlock
              code={`import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`}
            />
          </div>

          <div>
            <p className="font-semibold mb-2">5. Node.js + Express — Minimal API Server</p>
            <CodeBlock
              code={`const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => console.log("Server running on port 3000"));`}
            />
          </div>

          <div>
            <p className="font-semibold mb-2">6. SQL — A Basic Query</p>
            <CodeBlock
              code={`SELECT id, name, email
FROM users
WHERE created_at > '2026-01-01'
ORDER BY created_at DESC
LIMIT 10;`}
            />
          </div>
        </div>
      </Section>

      {/* ---------------- DETAILED NOTES (Accordion) ---------------- */}
      <Section id="notes" eyebrow="Deep Dive" title="Detailed Notes — Topic by Topic">
        <div className="space-y-3">
          {NOTES_SECTIONS.map((n, i) => {
            const open = openNote === i;
            return (
              <div key={n.title} className="rounded-xl border overflow-hidden bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                <button
                  onClick={() => setOpenNote(open ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold"
                >
                  {n.title}
                  <span className={`ml-4 transition-transform text-indigo-600 dark:text-cyan-400 ${open ? "rotate-45" : ""}`}>＋</span>
                </button>
                {open && <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{n.body}</p>}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ---------------- CHEAT SHEETS ---------------- */}
      <Section id="cheatsheets" eyebrow="Quick Reference" title="Cheat Sheets">
        <div className="grid md:grid-cols-2 gap-6">
          {CHEATSHEETS.map((c) => (
            <div key={c.title} className="rounded-xl border p-5 bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <p className="font-bold mb-3 text-indigo-600 dark:text-cyan-400">{c.title}</p>
              <table className="w-full text-sm">
                <tbody>
                  {c.rows.map((r) => (
                    <tr key={r[0]} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="py-2 pr-3 font-mono whitespace-nowrap">{r[0]}</td>
                      <td className="py-2 text-slate-600 dark:text-slate-400">{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- USE CASES ---------------- */}
      <Section eyebrow="Applications" title="Use Cases">
        <div className="flex flex-wrap gap-3">
          {USE_CASES.map((u) => (
            <span
              key={u}
              className="px-4 py-2 rounded-full text-sm border bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700"
            >
              {u}
            </span>
          ))}
        </div>
      </Section>

      {/* ---------------- FEATURES & FUTURE ---------------- */}
      <Section eyebrow="Looking Ahead" title="Features & Future of Web Development">
        <div className="grid md:grid-cols-3 gap-4">
          {FEATURES_FUTURE.map((f) => (
            <div key={f.title} className="rounded-xl border p-5 bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <p className="font-bold mb-1">{f.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------- BLOG ---------------- */}
      <Section id="blog" eyebrow="Reads" title="From the Blog">
        <div className="grid md:grid-cols-2 gap-6">
          {BLOGS.map((b) => (
            <article key={b.title} className="rounded-xl border p-5 bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <p className="text-xs mb-2 text-slate-600 dark:text-slate-400">{b.read}</p>
              <h3 className="font-bold text-lg mb-2">{b.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{b.excerpt}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* ---------------- FOOTER / DOWNLOAD CTA ---------------- */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border p-10 text-center bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-2">Take these notes with you</h2>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            One click downloads everything on this page — definitions, roadmaps, code snippets and cheat sheets — as a plain text file.
          </p>
          <button
            onClick={handleDownload}
            className="px-6 py-3 rounded-full font-semibold text-white bg-indigo-600 dark:bg-cyan-500 hover:opacity-90 transition-opacity"
          >
            ⬇ Download Web Development Notes
          </button>
        </div>
      </section>

      {/* ---------------- THANK YOU TOAST ---------------- */}
      {showThanks && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg font-medium text-white bg-indigo-600 dark:bg-cyan-500 z-50"
        >
          🎉 Thanks for downloading! Happy learning.
        </div>
      )}
    </div>
  );
}