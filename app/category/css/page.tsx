"use client";

import { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  Download,
  CheckCircle2,
  Layers,
  Boxes,
  Sparkles,
  Globe2,
  Wand2,
  Rocket,
  BookMarked,
  FileCode2,
  FileText,
  Braces,
  ArrowRight,
} from "lucide-react";

const NOTES_MARKDOWN = `# CSS Complete Notes

## 1. What is CSS?
CSS (Cascading Style Sheets) is the language that describes how HTML elements
should look — colors, spacing, fonts, layout, and motion. HTML builds the
skeleton of a page; CSS gives it skin, clothes, and posture.

## 2. Why CSS is Used
- Separates content (HTML) from presentation (style)
- Lets one stylesheet restyle an entire site at once
- Enables responsive layouts across phones, tablets, and desktops
- Adds motion, depth, and personality without JavaScript

## 3. Why CSS is Needed
Without CSS, every page would render as plain black text on a white
background, top to bottom, with no layout control, no color, and no
adaptation to screen size. CSS is what turns a document into a designed
product.

## 4. How CSS Works (Rendering Pipeline)
1. Browser parses HTML -> builds the DOM tree
2. Browser parses CSS -> builds the CSSOM tree
3. DOM + CSSOM combine -> Render Tree
4. Render Tree -> Layout (position & size of every box)
5. Layout -> Paint (pixels drawn to the screen)
6. Paint -> Composite (layers merged on the GPU)

## 5. Types of CSS
- Inline: style="color:red" written directly on an element
- Internal: a <style> block inside the HTML <head>
- External: a separate .css file linked with <link rel="stylesheet">

## 6. The Box Model
Every element is a box made of, from the inside out:
Content -> Padding -> Border -> Margin
box-sizing: border-box makes width/height include padding & border.

## 7. Where CSS is Used
Websites, web apps, HTML emails, browser extensions, hybrid mobile apps
(React Native Web, Ionic), Electron desktop apps, and even PDF/print
stylesheets.

## 8. Is CSS Helpful?
Yes — it is the only language purpose-built for visual design on the web.
Nothing else lets you restyle thousands of pages by editing one file.

## 9. Key Features
- Cascading & inheritance
- Selectors (element, class, id, attribute, pseudo-class/element)
- Box model, Flexbox, Grid
- Custom Properties (variables)
- Transitions & @keyframes animations
- Responsive units & media queries
- Modern functions: calc(), clamp(), min(), max()

## 10. The Future of CSS
- Container Queries (@container)
- :has() the "parent selector"
- Native CSS Nesting
- Cascade Layers (@layer)
- color-mix() and wide-gamut color spaces
- Scroll-driven animations
- Anchor positioning

## 11. Quick Cheat Sheet
| Concept        | Example                          |
|----------------|-----------------------------------|
| Selector       | .card, #nav, div > p              |
| Box model      | margin, border, padding, content  |
| Flexbox        | display:flex; justify-content     |
| Grid           | display:grid; grid-template-cols  |
| Variables      | --accent: #6d5bff; var(--accent)  |
| Media query    | @media (max-width: 768px) {}      |
| Transition     | transition: all .3s ease;         |
| Animation      | @keyframes name { from{} to{} }   |

## 12. Interview Quick Recall
- Specificity order: inline > ID > class/attribute/pseudo-class > element
- Flexbox = 1D layout, Grid = 2D layout
- Pseudo-class (:hover) styles a state; pseudo-element (::before) styles a part
- position:sticky toggles between relative and fixed based on scroll
- em is relative to parent font-size, rem is relative to the root

Thanks for downloading — happy styling!
`;

type Theme = "light" | "dark";

export default function CSSPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  function downloadNotes() {
    const blob = new Blob([NOTES_MARKDOWN], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CSS-Complete-Notes.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setShowThanks(true);
    window.setTimeout(() => setShowThanks(false), 3200);
  }

  return (
    <div className="min-h-screen bg-[#FEFDFB] text-slate-900 transition-colors duration-300 dark:bg-[#0B1020] dark:text-slate-100">
      {/* faint blueprint grid, purely decorative */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ---------------------------- HEADER ---------------------------- */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-[#FEFDFB]/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-[#0B1020]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight">
            <Braces className="h-5 w-5 text-[#7C5CFF]" />
            <span>
              css<span className="text-[#7C5CFF]">.</span>handbook
            </span>
          </div>

          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
            <a href="#what" className="hover:text-[#7C5CFF]">What</a>
            <a href="#how" className="hover:text-[#7C5CFF]">How</a>
            <a href="#box-model" className="hover:text-[#7C5CFF]">Box Model</a>
            <a href="#features" className="hover:text-[#7C5CFF]">Features</a>
            <a href="#cheatsheet" className="hover:text-[#7C5CFF]">Cheat Sheet</a>
            <a href="#future" className="hover:text-[#7C5CFF]">Future</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        {/* ---------------------------- HERO ---------------------------- */}
        <section id="what" className="grid gap-10 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#7C5CFF]">
              /* what is css */
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              CSS gives your HTML a{" "}
              <span className="text-[#7C5CFF]">look, a layout,</span> and a
              personality.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600 dark:text-slate-300">
              <strong>CSS - Cascading Style Sheets</strong> - is the styling
              language of the web. If HTML is the skeleton of a page, CSS is
              everything you actually see: color, spacing, typography,
              layout, and motion.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs">
              {["CSS1", "CSS2", "CSS3", "Modern CSS"].map((v) => (
                <span
                  key={v}
                  className="rounded-full border border-slate-300 px-3 py-1 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  {v}
                </span>
              ))}
            </div>

            <button
              onClick={downloadNotes}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#7C5CFF] px-5 py-3 font-semibold text-white shadow-lg shadow-[#7C5CFF]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#6a4bef]"
            >
              <Download className="h-4 w-4" />
              Download CSS Notes
            </button>
          </div>

          {/* HTML vs CSS vs JS mini comparison card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 font-mono text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <p className="mb-4 text-xs uppercase tracking-widest text-slate-400">
              html · css · javascript
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-orange-500">HTML</span>
                <span className="text-slate-500 dark:text-slate-400">Structure — the skeleton</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-[#7C5CFF]">CSS</span>
                <span className="text-slate-500 dark:text-slate-400">Presentation — the skin & style</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-amber-500">JS</span>
                <span className="text-slate-500 dark:text-slate-400">Behavior — the nerves & muscles</span>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------- WHY / WHY NEEDED ------------------------ */}
        <section className="grid gap-6 py-10 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#7C5CFF]">
              /* why css is used */
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              {[
                "Separates content from presentation",
                "One stylesheet can restyle an entire site",
                "Enables responsive, mobile-first layouts",
                "Adds motion & depth without JavaScript",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#7C5CFF]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#7C5CFF]">
              /* what if there was no css */
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              Every page would render as plain, unstyled text — one font,
              black on white, top to bottom, with links underlined in blue.
              No colors, no layout, no responsiveness. CSS is what turns a
              document into a designed product people enjoy using.
            </p>
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 font-serif text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
              Welcome to my site. This is a link. This is a paragraph of
              text, rendered exactly the way the browser's defaults decide,
              with no say from the author at all.
            </div>
          </div>
        </section>

        {/* ------------------------- HOW CSS WORKS ------------------------ */}
        <section id="how" className="py-16">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#7C5CFF]">
            /* how css works — the rendering pipeline */
          </p>
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">
            From a stylesheet to pixels on screen
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {[
              "HTML → DOM",
              "CSS → CSSOM",
              "Render Tree",
              "Layout",
              "Paint",
              "Composite",
            ].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                  {step}
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-slate-600 dark:text-slate-300">
            The browser parses your HTML into a DOM tree and your CSS into a
            CSSOM tree, merges them into a render tree, calculates the exact
            position and size of every box (layout), draws the pixels
            (paint), and finally merges layers on the GPU (composite).
          </p>
        </section>

        {/* ------------------------- TYPES OF CSS ------------------------- */}
        <section className="py-10">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-[#7C5CFF]">
            /* types of css */
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Inline",
                code: `<p style="color:red">Hi</p>`,
                note: "Written directly on one element. Highest priority, hardest to maintain.",
              },
              {
                title: "Internal",
                code: `<style>\n  p { color: red; }\n</style>`,
                note: "Lives in a <style> tag inside <head>. Good for single-page demos.",
              },
              {
                title: "External",
                code: `<link rel="stylesheet"\n  href="styles.css">`,
                note: "A separate .css file, linked in. Reusable across every page.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
              >
                <h3 className="mb-2 font-semibold text-[#7C5CFF]">{c.title}</h3>
                <pre className="mb-3 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-100 dark:bg-black/50">
{c.code}
                </pre>
                <p className="text-sm text-slate-600 dark:text-slate-300">{c.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------- BOX MODEL DIAGRAM --------------------- */}
        <section id="box-model" className="py-16">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#7C5CFF]">
            /* the box model — every element is a box */
          </p>
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">Content → Padding → Border → Margin</h2>

          <div className="flex justify-center">
            <div className="rounded-md border-4 border-dashed border-amber-400/70 p-6">
              <span className="mb-1 block text-center font-mono text-[10px] uppercase tracking-widest text-amber-500">
                margin
              </span>
              <div className="rounded-md border-4 border-slate-400/70 p-5">
                <span className="mb-1 block text-center font-mono text-[10px] uppercase tracking-widest text-slate-400">
                  border
                </span>
                <div className="rounded-md bg-[#7C5CFF]/10 p-5">
                  <span className="mb-1 block text-center font-mono text-[10px] uppercase tracking-widest text-[#7C5CFF]">
                    padding
                  </span>
                  <div className="rounded-md bg-[#7C5CFF] px-10 py-6 text-center font-mono text-xs font-semibold text-white">
                    content
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">
              box-sizing: border-box
            </code>{" "}
            makes width & height include padding and border — the layout
            behavior most modern resets turn on by default.
          </p>
        </section>

        {/* ------------------------- WHERE CSS IS USED --------------------- */}
        <section className="py-10">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-[#7C5CFF]">
            /* where css is used */
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              ["Websites", Globe2],
              ["Web apps", Boxes],
              ["HTML emails", FileText],
              ["Browser extensions", Layers],
              ["Hybrid mobile apps", Sparkles],
              ["Print & PDF stylesheets", FileCode2],
            ].map(([label, Icon]: any) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <Icon className="h-5 w-5 text-[#7C5CFF]" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------- IS IT HELPFUL ------------------------- */}
        <section className="py-10">
          <div className="rounded-2xl bg-[#7C5CFF]/10 p-6 dark:bg-[#7C5CFF]/15">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#7C5CFF]">
              /* is css helpful? */
            </p>
            <p className="text-slate-700 dark:text-slate-200">
              Yes — it's the only language built purpose-first for visual
              design on the web. Nothing else lets one file restyle
              thousands of pages instantly, adapt to any screen size, and
              add motion without touching your markup or logic.
            </p>
          </div>
        </section>

        {/* ------------------------- FEATURES ------------------------------ */}
        <section id="features" className="py-16">
          <p className="mb-8 font-mono text-xs uppercase tracking-widest text-[#7C5CFF]">
            /* features */
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              ["Cascade & Inheritance", "Rules stack in order; children inherit from parents."],
              ["Flexbox & Grid", "1D and 2D layout systems for any interface shape."],
              ["Custom Properties", "Reusable --variables that themes and JS can update live."],
              ["Transitions & Animations", "Smooth state changes with @keyframes and easing."],
              ["Responsive Units", "%, vw/vh, rem, and clamp() adapt to every screen."],
              ["Modern Functions", "calc(), min(), max(), clamp() do math right in your CSS."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                <Wand2 className="mb-3 h-5 w-5 text-[#7C5CFF]" />
                <h3 className="mb-1 font-semibold">{title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------- CHEAT SHEET ---------------------------- */}
        <section id="cheatsheet" className="py-16">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-[#7C5CFF]">
            /* cheat sheet */
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 font-mono text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Concept</th>
                  <th className="px-4 py-3">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  ["Selector", ".card, #nav, div > p"],
                  ["Flexbox", "display:flex; justify-content:center;"],
                  ["Grid", "display:grid; grid-template-columns:1fr 1fr;"],
                  ["Variables", "--accent:#7C5CFF; color:var(--accent);"],
                  ["Media query", "@media (max-width:768px){ ... }"],
                  ["Transition", "transition: all .3s ease;"],
                  ["Animation", "@keyframes spin{ to{transform:rotate(360deg)} }"],
                ].map(([a, b]) => (
                  <tr key={a}>
                    <td className="px-4 py-3 font-medium">{a}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ------------------------- FUTURE OF CSS -------------------------- */}
        <section id="future" className="py-16">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#7C5CFF]">
            /* the future of css */
          </p>
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">What's landing next</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              "Container Queries (@container)",
              ":has() — the parent selector",
              "Native CSS Nesting",
              "Cascade Layers (@layer)",
              "color-mix() & wide-gamut color",
              "Scroll-driven animations",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <Rocket className="h-4 w-4 shrink-0 text-[#7C5CFF]" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------- DOWNLOAD CTA (repeat) ------------------- */}
        <section className="py-16">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 p-8 text-center md:flex-row md:text-left dark:border-slate-800">
            <div>
              <p className="mb-1 font-mono text-xs uppercase tracking-widest text-[#7C5CFF]">
                /* take it with you */
              </p>
              <h3 className="text-xl font-bold">Grab the complete CSS notes as a file</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Includes the box model, cascade, cheat sheet, and interview quick-recall list.
              </p>
            </div>
            <button
              onClick={downloadNotes}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#7C5CFF] px-5 py-3 font-semibold text-white shadow-lg shadow-[#7C5CFF]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#6a4bef]"
            >
              <Download className="h-4 w-4" />
              Download CSS Notes
            </button>
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-slate-200 py-8 text-xs text-slate-400 dark:border-slate-800">
          <span className="flex items-center gap-2 font-mono">
            <BookMarked className="h-3.5 w-3.5" /> css.handbook
          </span>
          <span>Styled the way it teaches — with CSS.</span>
        </footer>
      </main>

      {/* ------------------------- THANK-YOU TOAST ------------------------- */}
      {showThanks && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl dark:bg-[#7C5CFF]">
          Thanks for downloading! Happy styling 🎉
        </div>
      )}
    </div>
  );
}