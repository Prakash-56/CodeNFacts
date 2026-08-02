'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Download,
  X,
  CheckCircle2,
  Brain,
  Layers,
  GitBranch,
  Target,
  TrendingUp,
  Database,
  BarChart3,
  Sparkles,
  BookOpen,
  Menu,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Small reusable building blocks                                     */
/* ------------------------------------------------------------------ */

function SectionHeading({
  index,
  title,
  icon: Icon,
}: {
  index: string;
  title: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 font-mono text-sm font-semibold">
        {index}
      </span>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        {title}
      </h2>
      <Icon className="ml-auto hidden sm:block h-6 w-6 text-slate-300 dark:text-slate-700" />
    </div>
  );
}

function CodeBlock({ code, lang = 'python' }: { code: string; lang?: string }) {
  return (
    <div className="my-5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-2 bg-slate-100/70 dark:bg-slate-900">
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{lang}</span>
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-slate-800 dark:text-slate-200 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function Callout({
  children,
  tone = 'info',
}: {
  children: React.ReactNode;
  tone?: 'info' | 'tip' | 'warn';
}) {
  const styles: Record<string, string> = {
    info: 'border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-200',
    tip: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200',
    warn: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200',
  };
  return (
    <div className={`my-5 rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles[tone]}`}>
      {children}
    </div>
  );
}

function DiagramFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4">
      {children}
      <figcaption className="mt-3 text-center text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagrams (pure inline SVG, theme aware via Tailwind classes)       */
/* ------------------------------------------------------------------ */

function TypesDiagram() {
  return (
    <svg viewBox="0 0 640 260" className="w-full h-auto">
      <rect x="230" y="10" width="180" height="46" rx="10"
        className="fill-indigo-600 dark:fill-indigo-500" />
      <text x="320" y="38" textAnchor="middle"
        className="fill-white text-[15px] font-semibold">Machine Learning</text>

      {/* connectors */}
      <path d="M320 56 L320 90 M320 90 L100 90 L100 120 M320 90 L320 120 M320 90 L540 90 L540 120"
        className="stroke-slate-300 dark:stroke-slate-600" fill="none" strokeWidth={2} />

      {/* Supervised */}
      <rect x="20" y="120" width="160" height="110" rx="10"
        className="fill-white dark:fill-slate-900 stroke-emerald-400 dark:stroke-emerald-500" strokeWidth={1.5} />
      <text x="100" y="145" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400 text-[13px] font-bold">Supervised</text>
      <text x="100" y="168" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">Learns from</text>
      <text x="100" y="182" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">labeled data</text>
      <text x="100" y="205" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px]">Regression</text>
      <text x="100" y="220" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px]">Classification</text>

      {/* Unsupervised */}
      <rect x="240" y="120" width="160" height="110" rx="10"
        className="fill-white dark:fill-slate-900 stroke-indigo-400 dark:stroke-indigo-500" strokeWidth={1.5} />
      <text x="320" y="145" textAnchor="middle" className="fill-indigo-600 dark:fill-indigo-400 text-[13px] font-bold">Unsupervised</text>
      <text x="320" y="168" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">Finds patterns in</text>
      <text x="320" y="182" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">unlabeled data</text>
      <text x="320" y="205" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px]">Clustering</text>
      <text x="320" y="220" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px]">Dim. reduction</text>

      {/* Reinforcement */}
      <rect x="460" y="120" width="160" height="110" rx="10"
        className="fill-white dark:fill-slate-900 stroke-amber-400 dark:stroke-amber-500" strokeWidth={1.5} />
      <text x="540" y="145" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400 text-[13px] font-bold">Reinforcement</text>
      <text x="540" y="168" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">Learns from</text>
      <text x="540" y="182" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">reward & penalty</text>
      <text x="540" y="205" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px]">Game AI</text>
      <text x="540" y="220" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px]">Robotics</text>
    </svg>
  );
}

function FitCurve({ x, label, kind }: { x: number; label: string; kind: 'under' | 'good' | 'over' }) {
  const pts = [
    [10, 90], [25, 70], [45, 55], [65, 60], [85, 40], [105, 50], [125, 30], [145, 45],
  ].map(([px, py]) => [px + x, py + 20]);

  const dots = pts.map(([px, py], i) => (
    <circle key={i} cx={px} cy={py + (Math.random() * 0 )} r={2.6}
      className="fill-slate-400 dark:fill-slate-500" />
  ));

  let path = '';
  if (kind === 'under') {
    path = `M${10 + x},95 L${145 + x},70`;
  } else if (kind === 'good') {
    path = `M${10 + x},92 C ${50 + x},50 ${100 + x},95 ${145 + x},48`;
  } else {
    path = `M${10 + x},90 C ${25 + x},60 ${35 + x},95 ${50 + x},58 S ${70 + x},92 ${85 + x},42 S ${105 + x},96 ${120 + x},33 S ${140 + x},70 ${145 + x},48`;
  }

  return (
    <g>
      <rect x={x} y={5} width={160} height={140} rx={8}
        className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" />
      {dots}
      <path d={path} className="stroke-indigo-500 dark:stroke-indigo-400" fill="none" strokeWidth={2.5} />
      <text x={x + 80} y={165} textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[12px] font-semibold">{label}</text>
    </g>
  );
}

function OverfittingDiagram() {
  return (
    <svg viewBox="0 0 520 180" className="w-full h-auto">
      <FitCurve x={0} label="Underfitting (high bias)" kind="under" />
      <FitCurve x={180} label="Good fit (balanced)" kind="good" />
      <FitCurve x={360} label="Overfitting (high variance)" kind="over" />
    </svg>
  );
}

function NeuralNetDiagram() {
  const inputY = [40, 90, 140];
  const hiddenY = [25, 65, 105, 145];
  const outputY = [65, 105];

  const lines: React.ReactNode[] = [];
  inputY.forEach((iy, ii) => hiddenY.forEach((hy, hi) => {
    lines.push(<line key={`ih-${ii}-${hi}`} x1={90} y1={iy} x2={260} y2={hy}
      className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={1} />);
  }));
  hiddenY.forEach((hy, hi) => outputY.forEach((oy, oi) => {
    lines.push(<line key={`ho-${hi}-${oi}`} x1={260} y1={hy} x2={430} y2={oy}
      className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={1} />);
  }));

  return (
    <svg viewBox="0 0 500 180" className="w-full h-auto">
      {lines}
      {inputY.map((y, i) => (
        <circle key={i} cx={90} cy={y} r={14} className="fill-emerald-100 dark:fill-emerald-500/20 stroke-emerald-500" strokeWidth={2} />
      ))}
      {hiddenY.map((y, i) => (
        <circle key={i} cx={260} cy={y} r={14} className="fill-indigo-100 dark:fill-indigo-500/20 stroke-indigo-500" strokeWidth={2} />
      ))}
      {outputY.map((y, i) => (
        <circle key={i} cx={430} cy={y} r={14} className="fill-amber-100 dark:fill-amber-500/20 stroke-amber-500" strokeWidth={2} />
      ))}
      <text x={90} y={170} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">Input layer</text>
      <text x={260} y={170} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">Hidden layer</text>
      <text x={430} y={170} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">Output layer</text>
    </svg>
  );
}

function WorkflowDiagram() {
  const steps = ['Collect Data', 'Preprocess', 'Train Model', 'Evaluate', 'Deploy'];
  const w = 118;
  const gap = 20;
  return (
    <svg viewBox={`0 0 ${(w + gap) * steps.length} 120`} className="w-full h-auto min-w-[560px]">
      {steps.map((s, i) => {
        const x = i * (w + gap);
        return (
          <g key={s}>
            <rect x={x} y={30} width={w} height={56} rx={10}
              className="fill-white dark:fill-slate-900 stroke-indigo-400 dark:stroke-indigo-500" strokeWidth={1.5} />
            <text x={x + w / 2} y={63} textAnchor="middle"
              className="fill-slate-700 dark:fill-slate-200 text-[12px] font-semibold">{s}</text>
            {i < steps.length - 1 && (
              <path d={`M${x + w},58 L${x + w + gap},58`}
                className="stroke-slate-400 dark:stroke-slate-500" strokeWidth={2}
                markerEnd="url(#arrow)" />
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="fill-slate-400 dark:fill-slate-500" />
        </marker>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Table of contents                                                  */
/* ------------------------------------------------------------------ */

const TOC = [
  { id: 'intro', label: '1. What is Machine Learning?' },
  { id: 'types', label: '2. Types of Machine Learning' },
  { id: 'concepts', label: '3. Core Concepts' },
  { id: 'algorithms', label: '4. Key Algorithms' },
  { id: 'evaluation', label: '5. Evaluating Models' },
  { id: 'practical', label: '6. Practical Examples' },
  { id: 'workflow', label: '7. The ML Workflow' },
  { id: 'summary', label: '8. Summary & Next Steps' },
];

/* ------------------------------------------------------------------ */
/*  Download button + toast                                            */
/* ------------------------------------------------------------------ */

function DownloadNotesButton() {
  const [toast, setToast] = useState<{ show: boolean; phase: 'downloading' | 'done' }>({
    show: false,
    phase: 'downloading',
  });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const handleDownload = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    // Trigger the actual file download.
    const link = document.createElement('a');
    link.href = '/downloads/machine-learning-notes.pdf';
    link.download = 'machine-learning-notes.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show "downloading" then switch to "thank you".
    setToast({ show: true, phase: 'downloading' });
    timers.current.push(
      setTimeout(() => setToast({ show: true, phase: 'done' }), 1400),
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 4800),
    );
  };

  return (
    <>
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white text-sm font-semibold px-5 py-2.5 shadow-sm shadow-indigo-600/20 transition-colors"
      >
        <Download className="h-4 w-4" />
        Download Machine Learning Notes
      </button>

      {toast.show && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg shadow-slate-900/10 dark:shadow-black/40 max-w-sm animate-in fade-in slide-in-from-bottom-2"
        >
          {toast.phase === 'downloading' ? (
            <Download className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500 animate-bounce" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          )}
          <div className="text-sm">
            <p className="font-semibold text-slate-900 dark:text-slate-50">
              {toast.phase === 'downloading' ? 'Downloading in progress…' : 'Thanks for downloading! 🎉'}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              {toast.phase === 'downloading'
                ? 'machine-learning-notes.pdf is being saved to your device.'
                : 'We hope these notes make learning ML easier.'}
            </p>
          </div>
          <button
            onClick={() => setToast((t) => ({ ...t, show: false }))}
            className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function MachineLearningPage() {
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 transition-colors duration-300">
      {/* ---- Page hero ---- */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-indigo-50/60 to-white dark:from-indigo-500/[0.06] dark:to-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-4 w-4" /> Category
          </div>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Machine Learning
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-slate-600 dark:text-slate-400">
            A complete, practical guide to Machine Learning - core concepts, the main
            families of algorithms, how to evaluate a model, and runnable code examples
            you can try today.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <DownloadNotesButton />
            <button
              onClick={() => setMobileTocOpen((v) => !v)}
              className="lg:hidden inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              <Menu className="h-4 w-4" /> Contents
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        {/* ---- Table of contents ---- */}
        <aside className={`${mobileTocOpen ? 'block' : 'hidden'} lg:block`}>
          <nav className="lg:sticky lg:top-8 space-y-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              On this page
            </p>
            {TOC.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileTocOpen(false)}
                className="block rounded-lg px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* ---- Main content ---- */}
        <main className="min-w-0">
          {/* 1. Intro */}
          <section id="intro" className="scroll-mt-24 mb-16">
            <SectionHeading index="01" title="What is Machine Learning?" icon={Brain} />
            <p className="leading-relaxed">
              <strong>Machine Learning (ML)</strong> is a branch of Artificial Intelligence
              where a computer program improves at a task by learning patterns from data,
              instead of following rules that a human explicitly wrote. Rather than coding
              "if this, then that," we show the algorithm many examples and let it work out
              the underlying relationship on its own.
            </p>
            <Callout tone="tip">
              <strong>Analogy:</strong> Teaching a child to recognize cats isn't done by
              listing rules like "four legs, whiskers, pointy ears." You show them many
              photos of cats and non‑cats, and their brain learns the pattern. ML models
              learn the same way — from examples, not rules.
            </Callout>
            <p className="leading-relaxed">
              Formally, Tom Mitchell's definition is often quoted: a program learns from
              experience <em>E</em> with respect to task <em>T</em> and performance measure{' '}
              <em>P</em>, if its performance at <em>T</em>, measured by <em>P</em>, improves
              with experience <em>E</em>. In practice this means: more (good) data and more
              training generally produce a better model.
            </p>
          </section>

          {/* 2. Types */}
          <section id="types" className="scroll-mt-24 mb-16">
            <SectionHeading index="02" title="Types of Machine Learning" icon={GitBranch} />
            <DiagramFrame title="The three major families of Machine Learning">
              <TypesDiagram />
            </DiagramFrame>

            <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Supervised Learning
            </h3>
            <p className="leading-relaxed">
              The model learns from <strong>labeled data</strong> — each training example
              has an input and a known correct output. The goal is to learn a mapping from
              input to output so it can predict labels for new, unseen inputs.
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Regression:</strong> predicting a continuous number (e.g. house price, temperature).</li>
              <li><strong>Classification:</strong> predicting a category (e.g. spam vs. not spam, disease vs. healthy).</li>
            </ul>

            <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Unsupervised Learning
            </h3>
            <p className="leading-relaxed">
              The model works with <strong>unlabeled data</strong> and tries to find hidden
              structure on its own — grouping similar items together (clustering) or
              reducing the number of variables while keeping the important signal
              (dimensionality reduction).
            </p>

            <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Reinforcement Learning
            </h3>
            <p className="leading-relaxed">
              An <strong>agent</strong> interacts with an <strong>environment</strong>,
              takes actions, and receives rewards or penalties. Over many trials it learns
              a policy that maximizes cumulative reward — the approach behind game‑playing
              AI (e.g. AlphaGo) and robotics.
            </p>
          </section>

          {/* 3. Core concepts */}
          <section id="concepts" className="scroll-mt-24 mb-16">
            <SectionHeading index="03" title="Core Concepts You Must Know" icon={Target} />

            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Features & Labels
            </h3>
            <p className="leading-relaxed">
              A <strong>feature</strong> is an input variable (e.g. square footage, age,
              pixel value). A <strong>label</strong> is the answer we want to predict (e.g.
              house price). A dataset is usually organized as a table where rows are
              examples and columns are features, with one column reserved as the label.
            </p>

            <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Train / Validation / Test Split
            </h3>
            <p className="leading-relaxed">
              Data is split so we can measure how well a model generalizes to data it has
              never seen:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Training set (~70%):</strong> used to fit the model's parameters.</li>
              <li><strong>Validation set (~15%):</strong> used to tune hyperparameters and pick the best model.</li>
              <li><strong>Test set (~15%):</strong> used once, at the end, to report unbiased final performance.</li>
            </ul>

            <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Overfitting, Underfitting & the Bias‑Variance Tradeoff
            </h3>
            <p className="leading-relaxed">
              <strong>Underfitting</strong> happens when a model is too simple to capture
              the pattern in the data (high bias). <strong>Overfitting</strong> happens when
              a model memorizes the training data, including its noise, and fails to
              generalize (high variance). The goal is the balanced middle ground.
            </p>
            <DiagramFrame title="Underfitting vs. a good fit vs. overfitting">
              <OverfittingDiagram />
            </DiagramFrame>
            <Callout>
              <strong>Rule of thumb:</strong> if training accuracy is high but validation
              accuracy is much lower, the model is likely overfitting. If both are low, it's
              likely underfitting.
            </Callout>
          </section>

          {/* 4. Algorithms */}
          <section id="algorithms" className="scroll-mt-24 mb-16">
            <SectionHeading index="04" title="Key Algorithms" icon={Layers} />

            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Linear Regression
            </h3>
            <p className="leading-relaxed">
              Fits a straight line (or hyperplane) <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[13px]">y = w·x + b</code>{' '}
              through the data, minimizing the mean squared error between predictions and
              actual values.
            </p>
            <CodeBlock
              code={`from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[650], [800], [1200], [1500], [2000]])  # sq. ft.
y = np.array([70000, 90000, 140000, 175000, 240000])    # price

model = LinearRegression()
model.fit(X, y)

print("Slope (price per sq ft):", model.coef_[0])
print("Predicted price for 1000 sq ft:", model.predict([[1000]])[0])`}
            />

            <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Logistic Regression
            </h3>
            <p className="leading-relaxed">
              Despite the name, it's a <strong>classification</strong> algorithm. It
              squashes a linear combination of features through a sigmoid function to
              output a probability between 0 and 1.
            </p>
            <CodeBlock
              code={`from sklearn.linear_model import LogisticRegression

# X: [hours_studied], y: 0 = fail, 1 = pass
model = LogisticRegression()
model.fit(X_train, y_train)

probability_of_passing = model.predict_proba([[5]])[0][1]
print(f"Predicted pass probability: {probability_of_passing:.2f}")`}
            />

            <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Decision Trees & Random Forests
            </h3>
            <p className="leading-relaxed">
              A decision tree splits the data repeatedly on feature thresholds (e.g. "is
              age &gt; 30?") to form a tree of decisions. A <strong>random forest</strong>{' '}
              trains many trees on random subsets of data/features and averages their
              votes — this reduces overfitting and usually improves accuracy.
            </p>

            <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
              K‑Nearest Neighbors (KNN)
            </h3>
            <p className="leading-relaxed">
              To classify a new point, KNN looks at the <em>k</em> closest labeled points in
              the training set and takes a majority vote. Simple, but can be slow on large
              datasets since it compares against every stored example.
            </p>

            <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
              K‑Means Clustering
            </h3>
            <p className="leading-relaxed">
              An unsupervised algorithm that groups data into <em>k</em> clusters by
              repeatedly assigning points to the nearest cluster center, then recomputing
              each center as the mean of its assigned points.
            </p>
            <CodeBlock
              code={`from sklearn.cluster import KMeans

# Customer data: [annual_spend, visits_per_month]
kmeans = KMeans(n_clusters=3, random_state=42, n_init="auto")
kmeans.fit(customer_data)

print("Cluster for each customer:", kmeans.labels_)
print("Cluster centers:", kmeans.cluster_centers_)`}
            />

            <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Neural Networks
            </h3>
            <p className="leading-relaxed">
              Inspired loosely by the brain, a neural network is made of layers of
              connected "neurons." Each connection has a weight; each neuron applies an
              activation function. Stacking many layers ("deep learning") lets the network
              learn very complex patterns, powering image recognition, translation, and
              large language models.
            </p>
            <DiagramFrame title="A simple feed-forward neural network">
              <NeuralNetDiagram />
            </DiagramFrame>
            <CodeBlock
              code={`import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Dense(16, activation="relu", input_shape=(3,)),
    tf.keras.layers.Dense(8, activation="relu"),
    tf.keras.layers.Dense(1, activation="sigmoid"),
])

model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
model.fit(X_train, y_train, epochs=20, validation_split=0.2)`}
              lang="python"
            />
          </section>

          {/* 5. Evaluation */}
          <section id="evaluation" className="scroll-mt-24 mb-16">
            <SectionHeading index="05" title="Evaluating a Model" icon={BarChart3} />
            <p className="leading-relaxed">
              Choosing the right metric matters as much as choosing the right algorithm.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
              For Regression
            </h3>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>MAE</strong> (Mean Absolute Error): average absolute difference between predicted and actual values.</li>
              <li><strong>MSE / RMSE:</strong> penalizes larger errors more heavily by squaring them.</li>
              <li><strong>R² score:</strong> proportion of variance in the target explained by the model (closer to 1 is better).</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
              For Classification
            </h3>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Accuracy:</strong> % of correct predictions overall.</li>
              <li><strong>Precision:</strong> of everything predicted positive, how much was actually positive.</li>
              <li><strong>Recall:</strong> of everything actually positive, how much did we catch.</li>
              <li><strong>F1 score:</strong> harmonic mean of precision and recall — useful when classes are imbalanced.</li>
            </ul>
            <Callout tone="warn">
              <strong>Watch out:</strong> accuracy can be misleading on imbalanced data. If
              1% of emails are spam, a model that always predicts "not spam" is 99%
              accurate — but completely useless. Prefer precision/recall/F1 in that case.
            </Callout>
            <CodeBlock
              code={`from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
)

y_pred = model.predict(X_test)

print("Accuracy :", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall   :", recall_score(y_test, y_pred))
print("F1 score :", f1_score(y_test, y_pred))
print("Confusion matrix:\\n", confusion_matrix(y_test, y_pred))`}
            />
          </section>

          {/* 6. Practical examples */}
          <section id="practical" className="scroll-mt-24 mb-16">
            <SectionHeading index="06" title="Practical, End-to-End Examples" icon={Database} />

            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Example 1 — Predicting House Prices (Regression)
            </h3>
            <CodeBlock
              code={`import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error

df = pd.read_csv("houses.csv")           # columns: sqft, bedrooms, age, price
X = df[["sqft", "bedrooms", "age"]]
y = df["price"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LinearRegression()
model.fit(X_train, y_train)

predictions = model.predict(X_test)
print("MAE:", mean_absolute_error(y_test, predictions))`}
            />

            <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Example 2 — Classifying Iris Flowers (Classification)
            </h3>
            <CodeBlock
              code={`from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

data = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.25, random_state=1
)

clf = RandomForestClassifier(n_estimators=100, random_state=1)
clf.fit(X_train, y_train)

print("Test accuracy:", accuracy_score(y_test, clf.predict(X_test)))`}
            />

            <h3 className="mt-8 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Example 3 — Customer Segmentation (Clustering)
            </h3>
            <p className="leading-relaxed">
              A retailer wants to group customers by spending habits to target marketing
              campaigns. With no labels available, K‑Means groups customers into, say,
              three clusters: budget shoppers, regular shoppers, and big spenders — letting
              the business tailor offers to each group.
            </p>
          </section>

          {/* 7. Workflow */}
          <section id="workflow" className="scroll-mt-24 mb-16">
            <SectionHeading index="07" title="The Machine Learning Workflow" icon={TrendingUp} />
            <p className="leading-relaxed">
              Real ML projects follow a repeatable pipeline, rarely a straight line — you
              often loop back a step when results aren't good enough.
            </p>
            <DiagramFrame title="From raw data to a deployed model">
              <div className="overflow-x-auto">
                <WorkflowDiagram />
              </div>
            </DiagramFrame>
            <ol className="list-decimal pl-6 space-y-2 mt-4">
              <li><strong>Collect data:</strong> gather examples relevant to the problem.</li>
              <li><strong>Preprocess:</strong> clean missing values, encode categories, scale numbers.</li>
              <li><strong>Train:</strong> fit one or more algorithms on the training set.</li>
              <li><strong>Evaluate:</strong> measure performance on validation/test data, tune hyperparameters.</li>
              <li><strong>Deploy:</strong> serve the model behind an API or embed it in an app, then monitor it over time.</li>
            </ol>
          </section>

          {/* 8. Summary */}
          <section id="summary" className="scroll-mt-24 mb-8">
            <SectionHeading index="08" title="Summary & Next Steps" icon={BookOpen} />
            <p className="leading-relaxed">
              Machine Learning is about learning patterns from data rather than hand-coding
              rules. Start with the three core paradigms (supervised, unsupervised,
              reinforcement), get comfortable with the train/validation/test workflow and
              the bias‑variance tradeoff, then practice with a handful of classic
              algorithms — linear/logistic regression, trees, KNN, K‑Means, and a basic
              neural network — on small, real datasets.
            </p>
            <Callout tone="tip">
              <strong>Next steps:</strong> try the code samples above on the classic{' '}
              <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[13px]">Iris</code>,{' '}
              <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[13px]">Titanic</code>, and{' '}
              <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[13px]">Boston Housing</code>{' '}
              datasets, then grab the notes below to keep a offline reference handy.
            </Callout>
            <div className="mt-6">
              <DownloadNotesButton />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}