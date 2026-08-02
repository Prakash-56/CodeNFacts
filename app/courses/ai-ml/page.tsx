"use client";

import { useMemo, useState } from "react";
import {
  Brain,
  Cpu,
  Download,
  GitBranch,
  Layers,
  Lightbulb,
  ListChecks,
  Network,
  Sparkles,
  Target,
  Workflow,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Gauge,
  Boxes,
} from "lucide-react";

/* ---------------------------------------------------------------------- *
 *  AI & ML — Course Page
 *  Design language: "lab notebook meets circuit trace"
 *  - A vertical synapse spine threads every section together, the way a
 *    signal threads a network.
 *  - Numbering is used deliberately: this IS a sequential curriculum, so
 *    01 → 25-ish ordering carries real meaning (what to learn, in order).
 *  - Palette: ink/paper in light mode (true white, per spec), deep
 *    circuit-navy in dark mode, with a violet "signal" accent that
 *    represents the activation firing through the network.
 * ---------------------------------------------------------------------- */

const ACCENT = "#6D28D9"; // violet-700 — the "signal"
const ACCENT_DARK = "#A78BFA"; // violet-400 — signal on dark bg
const CYAN = "#0891B2";
const CYAN_DARK = "#22D3EE";
const AMBER = "#B45309";
const AMBER_DARK = "#FBBF24";

/* ----------------------------- helpers --------------------------------- */

function SectionNode({ n }: { n: string }) {
  return (
    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#6D28D9] bg-white text-xs font-bold text-[#6D28D9] dark:border-[#A78BFA] dark:bg-[#0B0F1A] dark:text-[#A78BFA]">
      {n}
    </div>
  );
}

function Section({
  n,
  eyebrow,
  title,
  children,
  id,
}: {
  n: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <section id={id} className="relative flex gap-5 pb-16 sm:gap-8">
      {/* spine */}
      <div className="relative flex flex-col items-center">
        <SectionNode n={n} />
        <div className="mt-2 w-px flex-1 bg-gradient-to-b from-[#6D28D9]/40 to-transparent dark:from-[#A78BFA]/30" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-[#0891B2] dark:text-[#22D3EE]">
          {eyebrow}
        </p>
        <h2 className="mb-5 font-display text-2xl font-bold tracking-tight text-[#14141F] sm:text-3xl dark:text-[#E7E9F5]">
          {title}
        </h2>
        <div className="space-y-5 text-[15px] leading-relaxed text-[#3A3A47] dark:text-[#C3C8DA]">
          {children}
        </div>
      </div>
    </section>
  );
}

function CodeBlock({
  title,
  lang = "python",
  code,
}: {
  title: string;
  lang?: string;
  code: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E5E5EF] bg-[#0B0F1A] dark:border-[#232B3D]">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#131826] px-4 py-2">
        <span className="font-mono text-xs text-[#97A0B8]">{title}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#6D28D9] dark:text-[#A78BFA]">
          {lang}
        </span>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed">
        <code className="font-mono text-[#E7E9F5]">{code}</code>
      </pre>
    </div>
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
    info: {
      border: "border-[#0891B2]/30 dark:border-[#22D3EE]/30",
      bg: "bg-[#0891B2]/5 dark:bg-[#22D3EE]/5",
      icon: <Lightbulb className="h-4 w-4 text-[#0891B2] dark:text-[#22D3EE]" />,
    },
    warn: {
      border: "border-[#B45309]/30 dark:border-[#FBBF24]/30",
      bg: "bg-[#B45309]/5 dark:bg-[#FBBF24]/5",
      icon: <AlertTriangle className="h-4 w-4 text-[#B45309] dark:text-[#FBBF24]" />,
    },
    good: {
      border: "border-[#15803D]/30 dark:border-[#4ADE80]/30",
      bg: "bg-[#15803D]/5 dark:bg-[#4ADE80]/5",
      icon: <CheckCircle2 className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80]" />,
    },
  }[tone];

  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} p-4`}>
      <div className="mb-1.5 flex items-center gap-2 font-semibold text-[#14141F] dark:text-[#E7E9F5]">
        {styles.icon}
        {title}
      </div>
      <div className="text-sm text-[#3A3A47] dark:text-[#C3C8DA]">{children}</div>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#E5E5EF] bg-[#F7F7FB] p-4 transition-colors hover:border-[#6D28D9]/40 dark:border-[#232B3D] dark:bg-[#131826] dark:hover:border-[#A78BFA]/40">
      <div className="mb-2 flex items-center gap-2 text-[#6D28D9] dark:text-[#A78BFA]">
        {icon}
        <h3 className="font-display text-sm font-semibold text-[#14141F] dark:text-[#E7E9F5]">
          {title}
        </h3>
      </div>
      <p className="text-sm text-[#5B5B6E] dark:text-[#97A0B8]">{children}</p>
    </div>
  );
}

/* ------------------------------ diagrams -------------------------------- */

function NeuralNetDiagram() {
  const layers = [3, 4, 4, 2];
  const width = 560;
  const height = 220;
  const layerX = layers.map((_, i) => 60 + i * ((width - 120) / (layers.length - 1)));
  const nodesAt = (count: number) =>
    Array.from({ length: count }, (_, i) => 30 + i * ((height - 60) / (count - 1 || 1)));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {layers.map((count, li) =>
        li < layers.length - 1
          ? nodesAt(count).map((y1, i) =>
              nodesAt(layers[li + 1]).map((y2, j) => (
                <line
                  key={`${li}-${i}-${j}`}
                  x1={layerX[li]}
                  y1={y1}
                  x2={layerX[li + 1]}
                  y2={y2}
                  stroke="currentColor"
                  className="text-[#6D28D9]/15 dark:text-[#A78BFA]/15"
                  strokeWidth={1}
                />
              ))
            )
          : null
      )}
      {layers.map((count, li) =>
        nodesAt(count).map((y, i) => (
          <circle
            key={`n-${li}-${i}`}
            cx={layerX[li]}
            cy={y}
            r={9}
            className="fill-white stroke-[#6D28D9] dark:fill-[#0B0F1A] dark:stroke-[#A78BFA]"
            strokeWidth={2}
          />
        ))
      )}
      <text x={layerX[0]} y={height - 6} textAnchor="middle" className="fill-[#5B5B6E] text-[10px] font-mono dark:fill-[#97A0B8]">
        input
      </text>
      <text x={layerX[1]} y={height - 6} textAnchor="middle" className="fill-[#5B5B6E] text-[10px] font-mono dark:fill-[#97A0B8]">
        hidden
      </text>
      <text x={layerX[2]} y={height - 6} textAnchor="middle" className="fill-[#5B5B6E] text-[10px] font-mono dark:fill-[#97A0B8]">
        hidden
      </text>
      <text x={layerX[3]} y={height - 6} textAnchor="middle" className="fill-[#5B5B6E] text-[10px] font-mono dark:fill-[#97A0B8]">
        output
      </text>
    </svg>
  );
}

function WorkflowDiagram() {
  const steps = [
    "Collect Data",
    "Clean Data",
    "Feature Engineering",
    "Split Dataset",
    "Train Model",
    "Evaluate Model",
    "Deploy Model",
    "Monitor",
  ];
  return (
    <div className="flex flex-wrap items-center gap-y-3">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="rounded-md border border-[#6D28D9]/40 bg-white px-3 py-1.5 font-mono text-xs text-[#14141F] dark:border-[#A78BFA]/40 dark:bg-[#131826] dark:text-[#E7E9F5]">
            {s}
          </div>
          {i < steps.length - 1 && (
            <ChevronRight className="mx-1 h-4 w-4 shrink-0 text-[#6D28D9]/60 dark:text-[#A78BFA]/60" />
          )}
        </div>
      ))}
    </div>
  );
}

function DataScienceVenn() {
  return (
    <svg viewBox="0 0 320 200" className="mx-auto w-full max-w-sm">
      <circle cx="130" cy="90" r="70" className="fill-[#6D28D9]/10 stroke-[#6D28D9] dark:fill-[#A78BFA]/10 dark:stroke-[#A78BFA]" strokeWidth={1.5} />
      <circle cx="190" cy="90" r="70" className="fill-[#0891B2]/10 stroke-[#0891B2] dark:fill-[#22D3EE]/10 dark:stroke-[#22D3EE]" strokeWidth={1.5} />
      <text x="95" y="60" className="fill-[#14141F] text-[11px] font-mono dark:fill-[#E7E9F5]">AI</text>
      <text x="215" y="60" className="fill-[#14141F] text-[11px] font-mono dark:fill-[#E7E9F5]">Analytics</text>
      <text x="145" y="95" textAnchor="middle" className="fill-[#14141F] text-[11px] font-semibold dark:fill-[#E7E9F5]">ML</text>
      <text x="145" y="112" textAnchor="middle" className="fill-[#5B5B6E] text-[9px] dark:fill-[#97A0B8]">Deep Learning ↓</text>
      <text x="160" y="170" textAnchor="middle" className="fill-[#5B5B6E] text-[10px] font-mono dark:fill-[#97A0B8]">
        Data Science
      </text>
    </svg>
  );
}

/* --------------------------------- data ---------------------------------- */

const roadmap = [
  "Learn Python Programming",
  "Study Math — Linear Algebra, Probability, Statistics, Calculus",
  "Data Analysis with NumPy & Pandas",
  "Data Visualization — Matplotlib, Plotly",
  "Learn SQL",
  "Machine Learning with Scikit-learn",
  "Deep Learning — TensorFlow / PyTorch",
  "Explore NLP & Computer Vision",
  "Build real-world projects",
  "MLOps, deployment, cloud (AWS / Azure / GCP)",
  "Portfolio + open-source contributions",
];

const mlTypes = [
  {
    name: "Supervised Learning",
    desc: "Learns from labeled data — every input already has a known output.",
    algos: ["Linear Regression", "Logistic Regression", "Decision Tree", "Random Forest", "SVM", "Neural Networks"],
    uses: ["Spam Detection", "Disease Prediction", "Price Prediction"],
    color: "#6D28D9",
  },
  {
    name: "Unsupervised Learning",
    desc: "Works on unlabeled data — the model finds hidden structure on its own.",
    algos: ["K-Means Clustering", "DBSCAN", "Hierarchical Clustering"],
    uses: ["Customer Segmentation", "Market Basket Analysis", "Pattern Detection"],
    color: "#0891B2",
  },
  {
    name: "Reinforcement Learning",
    desc: "Learns by trial and error — rewards for good actions, penalties for bad ones.",
    algos: ["Q-Learning", "Deep Q Networks (DQN)"],
    uses: ["Robot Learning", "Chess/Game AI", "Self-driving Cars"],
    color: "#B45309",
  },
];

const notesMarkdown = `# AI & ML — Complete Notes

## 1. What is AI?
Artificial Intelligence is a branch of computer science focused on building machines that perform tasks
requiring human-like intelligence: learning, reasoning, problem-solving, perception, and language understanding.

Examples: ChatGPT, Google Assistant, Siri, self-driving cars, Netflix recommendations, face recognition.

## 2. Types of AI (by capability)
- Narrow AI (Weak AI) — built for one task. e.g. Alexa, spam filters, Google Translate.
- General AI (Strong AI) — human-level intelligence across any task. Still research.
- Super AI — beyond human intelligence. Theoretical.

## 3. Types of AI (by functionality)
- Reactive Machines — no memory, react to current input only (IBM Deep Blue).
- Limited Memory AI — learns from historical data (self-driving cars, recommenders). Most modern AI.
- Theory of Mind AI — understands emotion/belief. In development.
- Self-aware AI — conscious AI. Does not exist today.

## 4. What is Machine Learning?
ML is a subset of AI: computers learn patterns from data instead of being explicitly programmed.
Formula: Experience + Data → Learning → Prediction.
Examples: spam detection, movie recommendation, price prediction.

## 5. AI vs ML
AI is the broad concept (mimics human intelligence, includes robotics/NLP/vision).
ML is a subset (learns from data, focuses on prediction, uses algorithms).

## 6. Types of Machine Learning
### Supervised Learning — labeled data, input/output known
Algorithms: Linear Regression, Logistic Regression, Decision Tree, Random Forest, SVM, Neural Networks
Applications: Spam Detection, Disease Prediction, Price Prediction

### Unsupervised Learning — unlabeled data, hidden patterns
Algorithms: K-Means, DBSCAN, Hierarchical Clustering
Applications: Customer Segmentation, Market Basket Analysis, Pattern Detection

### Reinforcement Learning — rewards & penalties
Algorithms: Q-Learning, Deep Q Networks (DQN)
Applications: Robot Learning, Chess AI, Game Playing, Self-driving cars

## 7. Deep Learning
Subset of ML using artificial neural networks with multiple hidden layers.
Applications: Image Recognition, Speech Recognition, Self-driving Cars, Medical Diagnosis.
Frameworks: TensorFlow, PyTorch, Keras.

## 8. Neural Networks
Structure: Input Layer → Hidden Layer(s) → Output Layer.
Components: Neurons, Weights, Bias, Activation Functions.

## 9. Data Science vs AI vs ML
Data Science splits into AI + Analytics. AI contains Machine Learning, which contains Deep Learning.

## 10. ML Workflow
Collect Data → Clean Data → Feature Engineering → Split Dataset → Train Model → Evaluate Model → Deploy Model → Monitor Performance.

## 11. Dataset Splitting
Typical: Training 70–80%, Testing 20–30%.
Alt: Training 70%, Validation 15%, Testing 15%.

## 12. Common ML Algorithms
Regression: Linear, Ridge, Lasso — house price prediction, sales forecasting.
Classification: Logistic Regression, Decision Tree, Random Forest, SVM, Naive Bayes, KNN — spam/disease/fraud detection.
Clustering: K-Means, DBSCAN, Hierarchical — customer segmentation, market analysis.

## 13. Popular AI/Python Libraries
NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, TensorFlow, PyTorch, Keras, OpenCV, NLTK, SpaCy.

## 14. Applications of AI
Healthcare (disease detection, medical imaging, drug discovery), Education (smart tutoring),
Finance (fraud detection, credit scoring), Agriculture (crop prediction), Retail (recommendations),
Transportation (self-driving, route optimization), Cybersecurity (intrusion/malware detection).

## 15. NLP
Enables computers to understand/generate language. Examples: ChatGPT, Google Translate, chatbots.
Tasks: text classification, machine translation, summarization, question answering.

## 16. Computer Vision
Interprets images/video. Applications: face recognition, object detection, medical imaging, OCR.
Libraries: OpenCV, YOLO, Detectron2.

## 17. Generative AI
Creates new content: text, images, music, code, video.
Examples: ChatGPT, Gemini, Claude, GitHub Copilot, Midjourney, Stable Diffusion.

## 18. Model Evaluation Metrics
Classification: Accuracy, Precision, Recall, F1 Score, ROC-AUC.
Regression: MAE, MSE, RMSE, R² Score.

## 19. Overfitting vs Underfitting
Overfitting: too well fit to training data, poor generalization. Fix: more data, regularization, dropout, cross-validation.
Underfitting: model too simple, poor everywhere. Fix: more complexity, better features, train longer.

## 20. AI Ethics
Privacy, Bias & Fairness, Transparency, Accountability, Security, Human Oversight.

## 21. Advantages
Automates repetitive tasks, improves decisions, high accuracy, processes large datasets, personalization, low downtime.

## 22. Limitations
Needs large quality data, expensive to build/maintain, can inherit bias, limited explainability, no common sense.

## 23. Careers
AI Engineer, ML Engineer, Data Scientist, Data Analyst, NLP Engineer, CV Engineer, MLOps Engineer,
AI Research Scientist, Robotics Engineer, BI Analyst.

## 24. Roadmap
${roadmap.map((r, i) => `${i + 1}. ${r}`).join("\n")}

## 25. Beginner Projects
House Price Prediction, Student Score Prediction, Spam Email Classifier, Movie Recommendation System,
Handwritten Digit Recognition (MNIST), Fake News Detection, Sentiment Analysis, Face Mask Detection,
Plant Disease Detection, Customer Churn Prediction.
`;

/* --------------------------------- page ---------------------------------- */

export default function AIMLCoursePage() {
  const [copied, setCopied] = useState(false);

  const handleDownload = useMemo(
    () => () => {
      const blob = new Blob([notesMarkdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ai-ml-complete-notes.md";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    []
  );

  return (
    <div className="min-h-screen bg-white text-[#14141F] transition-colors dark:bg-[#0B0F1A] dark:text-[#E7E9F5]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
        body, .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        code, .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
      `}</style>

      <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 font-body">
        {/* ---------- Hero ---------- */}
        <header className="mb-16">
          <div className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#0891B2] dark:text-[#22D3EE]">
            <Network className="h-4 w-4" />
            CodeNFacts · Artificial Intelligence &amp; Machine Learning
          </div>
          <h1 className="mb-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Teaching machines to learn,
            <br />
            <span className="text-[#6D28D9] dark:text-[#A78BFA]">instead of telling them what to do.</span>
          </h1>
          <p className="max-w-2xl text-[17px] leading-relaxed text-[#5B5B6E] dark:text-[#97A0B8]">
            A complete, practical walkthrough of AI and ML - what they are, why they matter right now,
            how models actually get trained, the algorithms behind them, and a roadmap to learn it all
            in order.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-md bg-[#6D28D9] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-[#5B21B6] active:scale-[0.98] dark:bg-[#A78BFA] dark:text-[#0B0F1A] dark:hover:bg-[#C4B5FD]"
            >
              <Download className="h-4 w-4" />
              {copied ? "Downloaded ✓" : "Download full notes"}
            </button>
            <a
              href="#roadmap"
              className="inline-flex items-center gap-2 rounded-md border border-[#E5E5EF] px-4 py-2.5 text-sm font-semibold text-[#14141F] transition-colors hover:border-[#6D28D9]/50 dark:border-[#232B3D] dark:text-[#E7E9F5] dark:hover:border-[#A78BFA]/50"
            >
              <GitBranch className="h-4 w-4" />
              Jump to roadmap
            </a>
          </div>

          <div className="mt-10 rounded-xl border border-[#E5E5EF] bg-[#F7F7FB] p-5 dark:border-[#232B3D] dark:bg-[#131826]">
            <NeuralNetDiagram />
            <p className="mt-2 text-center font-mono text-[11px] text-[#97A0B8]">
              signal flowing input → hidden → hidden → output, the same shape a neuron uses to fire
            </p>
          </div>
        </header>

        {/* ---------- Body: spine sections ---------- */}
        <div>
          <Section id="what-is" n="01" eyebrow="Foundations" title="What is AI & ML, really?">
            <p>
              <strong>Artificial Intelligence</strong> is the umbrella field: building machines that
              perform tasks which normally need human intelligence — learning, reasoning,
              problem-solving, decision-making, speech recognition, language understanding, and
              visual perception.
            </p>
            <p>
              <strong>Machine Learning</strong> is the part of AI that actually learns. Instead of a
              programmer writing rules by hand, an ML system is shown data and figures the rules out
              itself.
            </p>
            <div className="rounded-lg border border-[#6D28D9]/30 bg-[#6D28D9]/5 p-4 text-center font-mono text-sm dark:border-[#A78BFA]/30 dark:bg-[#A78BFA]/5">
              Experience + Data <span className="text-[#6D28D9] dark:text-[#A78BFA]">→</span> Learning{" "}
              <span className="text-[#6D28D9] dark:text-[#A78BFA]">→</span> Prediction
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card icon={<Brain className="h-4 w-4" />} title="AI, the broad concept">
                Mimics human intelligence. Covers robotics, NLP, vision, planning — may or may not use
                learning at all (some AI is rule-based).
              </Card>
              <Card icon={<Boxes className="h-4 w-4" />} title="ML, the subset">
                Specifically learns from data using algorithms, and focuses on prediction rather than
                hard-coded rules.
              </Card>
            </div>
            <div className="rounded-lg border border-[#E5E5EF] bg-[#F7F7FB] p-5 dark:border-[#232B3D] dark:bg-[#131826]">
              <DataScienceVenn />
            </div>
          </Section>

          <Section id="why-now" n="02" eyebrow="Motivation" title="Why AI/ML matters right now">
            <p>
              Data volume, cheap compute (GPUs/TPUs), and better algorithms hit a tipping point
              together. The result: models that used to take a research lab a decade now ship as
              consumer products — recommendation engines, voice assistants, code generators, medical
              imaging tools.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Callout tone="warn" title="If AI/ML didn't exist">
                Spam would flood every inbox unfiltered. Doctors would read every scan manually with
                no second opinion. Fraud would be caught only after the money is gone. Every
                recommendation, translation, and search result would rely on manually written rules
                that can't keep up with how fast the real world changes.
              </Callout>
              <Callout tone="good" title="What AI/ML actually buys us">
                Rules that adapt as new data arrives, decisions made in milliseconds at massive scale,
                patterns found in data too large or too subtle for a person to spot, and repetitive
                work automated so humans focus on judgment calls.
              </Callout>
            </div>
          </Section>

          <Section id="how-it-helps" n="03" eyebrow="Applications" title="How it helps, by domain">
            <div className="grid gap-3 sm:grid-cols-2">
              <Card icon={<Target className="h-4 w-4" />} title="Healthcare">
                Disease detection, medical imaging, drug discovery.
              </Card>
              <Card icon={<BookOpen className="h-4 w-4" />} title="Education">
                Smart tutoring, personalized learning paths.
              </Card>
              <Card icon={<Gauge className="h-4 w-4" />} title="Finance">
                Fraud detection, credit scoring.
              </Card>
              <Card icon={<Sparkles className="h-4 w-4" />} title="Agriculture">
                Crop yield prediction, plant disease detection.
              </Card>
              <Card icon={<Layers className="h-4 w-4" />} title="Retail">
                Recommendation systems, inventory management.
              </Card>
              <Card icon={<Cpu className="h-4 w-4" />} title="Transportation">
                Self-driving cars, route optimization.
              </Card>
            </div>
          </Section>

          <Section id="why-ml" n="04" eyebrow="Rationale" title="Why ML specifically?">
            <p>
              Hand-written rules break the moment reality shifts — new slang defeats a keyword-based
              spam filter, a new fraud pattern slips past a fixed rulebook. ML solves this by learning
              the pattern from examples instead of a person guessing every rule in advance, and it
              re-learns as more data comes in.
            </p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>Handles patterns too complex or too subtle to write by hand (e.g. what a tumor looks like on a scan).</li>
              <li>Scales — the same model scores millions of transactions a second.</li>
              <li>Improves with more data instead of needing a rewrite.</li>
              <li>Powers systems no rulebook could: translation, generation, recommendation.</li>
            </ul>
          </Section>

          <Section id="train-model" n="05" eyebrow="Practice" title="How to train an AI model">
            <WorkflowDiagram />
            <p>
              Every supervised model follows the same shape: gather data, clean it, engineer useful
              features, split it into train/test sets, fit the model, evaluate it honestly on unseen
              data, then ship and monitor it.
            </p>
            <CodeBlock
              title="train_model.py"
              code={`import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1. Collect + load data
df = pd.read_csv("data.csv")

# 2. Clean data
df = df.dropna()

# 3. Features / target
X = df.drop(columns=["target"])
y = df["target"]

# 4. Split dataset (80% train / 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 5. Train model
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# 6. Evaluate model
preds = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, preds))
print(classification_report(y_test, preds))

# 7. Deploy: persist the trained model
import joblib
joblib.dump(model, "model.pkl")`}
            />
            <CodeBlock
              title="train_neural_net.py — a minimal deep learning example"
              code={`import tensorflow as tf
from tensorflow.keras import layers, models

model = models.Sequential([
    layers.Input(shape=(784,)),
    layers.Dense(128, activation="relu"),
    layers.Dense(64, activation="relu"),
    layers.Dense(10, activation="softmax"),
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

history = model.fit(
    X_train, y_train,
    validation_split=0.15,
    epochs=20,
    batch_size=32,
)

test_loss, test_acc = model.evaluate(X_test, y_test)
print("Test accuracy:", test_acc)`}
            />
            <Callout tone="info" title="Dataset splitting rule of thumb">
              Standard split: <strong>70–80% training / 20–30% testing</strong>. With a validation set:
              70% training / 15% validation / 15% testing. Validation tunes the model; the test set
              only ever gets touched once, at the very end.
            </Callout>
          </Section>

          <Section id="ml-types" n="06" eyebrow="Core Concept" title="Types of Machine Learning">
            <p>Three learning styles cover almost everything in ML, split by what the data looks like.</p>
            <div className="space-y-4">
              {mlTypes.map((t) => (
                <div
                  key={t.name}
                  className="rounded-lg border p-4 dark:bg-[#131826]"
                  style={{ borderColor: `${t.color}40`, backgroundColor: `${t.color}08` }}
                >
                  <h3 className="font-display font-semibold" style={{ color: t.color }}>
                    {t.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#5B5B6E] dark:text-[#97A0B8]">{t.desc}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-[#97A0B8]">
                        Algorithms
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {t.algos.map((a) => (
                          <span
                            key={a}
                            className="rounded border px-2 py-0.5 font-mono text-[11px]"
                            style={{ borderColor: `${t.color}40`, color: t.color }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-[#97A0B8]">
                        Used for
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {t.uses.map((u) => (
                          <span
                            key={u}
                            className="rounded bg-[#14141F]/5 px-2 py-0.5 text-[11px] text-[#3A3A47] dark:bg-white/5 dark:text-[#C3C8DA]"
                          >
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="deep-learning" n="07" eyebrow="Going deeper" title="Deep Learning & Neural Networks">
            <p>
              Deep Learning is ML using artificial neural networks with many hidden layers — inspired
              loosely by the brain. Every neuron takes weighted inputs, adds a bias, passes the result
              through an activation function, and fires a signal forward.
            </p>
            <div className="rounded-lg border border-[#E5E5EF] bg-[#F7F7FB] p-5 dark:border-[#232B3D] dark:bg-[#131826]">
              <NeuralNetDiagram />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Card icon={<Layers className="h-4 w-4" />} title="Structure">
                Input Layer → Hidden Layer(s) → Output Layer.
              </Card>
              <Card icon={<Workflow className="h-4 w-4" />} title="Components">
                Neurons, Weights, Bias, Activation Functions.
              </Card>
            </div>
            <p className="text-sm text-[#5B5B6E] dark:text-[#97A0B8]">
              Frameworks: <span className="font-mono">TensorFlow</span>,{" "}
              <span className="font-mono">PyTorch</span>, <span className="font-mono">Keras</span>. Used
              for image recognition, speech recognition, self-driving cars, and medical diagnosis.
            </p>
          </Section>

          <Section id="metrics" n="08" eyebrow="Measuring success" title="Overfitting, underfitting & evaluation">
            <div className="grid gap-4 sm:grid-cols-2">
              <Callout tone="warn" title="Overfitting">
                The model memorizes training data and fails on new data.
                <br />
                <strong>Fix:</strong> more data, regularization, dropout, cross-validation.
              </Callout>
              <Callout tone="warn" title="Underfitting">
                The model is too simple and performs poorly everywhere.
                <br />
                <strong>Fix:</strong> increase complexity, better features, train longer.
              </Callout>
            </div>
            <CodeBlock
              title="evaluate.py"
              code={`from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    mean_absolute_error, mean_squared_error, r2_score
)

# Classification metrics
print("Accuracy:", accuracy_score(y_test, preds))
print("Precision:", precision_score(y_test, preds, average="weighted"))
print("Recall:", recall_score(y_test, preds, average="weighted"))
print("F1:", f1_score(y_test, preds, average="weighted"))

# Regression metrics
print("MAE:", mean_absolute_error(y_test, preds))
print("MSE:", mean_squared_error(y_test, preds))
print("R2:", r2_score(y_test, preds))`}
            />
          </Section>

          <Section id="libraries" n="09" eyebrow="Toolkit" title="Popular AI/ML libraries">
            <div className="flex flex-wrap gap-2">
              {["NumPy", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn", "TensorFlow", "PyTorch", "Keras", "OpenCV", "NLTK", "SpaCy"].map(
                (lib) => (
                  <span
                    key={lib}
                    className="rounded-full border border-[#E5E5EF] px-3 py-1 font-mono text-xs text-[#3A3A47] dark:border-[#232B3D] dark:text-[#C3C8DA]"
                  >
                    {lib}
                  </span>
                )
              )}
            </div>
          </Section>

          <Section id="keep-in-mind" n="10" eyebrow="Before you build" title="Important things to keep in mind">
            <div className="space-y-3">
              <Callout tone="info" title="Garbage in, garbage out">
                A model is only as good as its data. Bad, biased, or incomplete data produces a
                confidently wrong model.
              </Callout>
              <Callout tone="warn" title="Never evaluate on training data">
                Always measure performance on data the model has never seen — otherwise you're
                grading your own homework.
              </Callout>
              <Callout tone="info" title="Accuracy isn't always the right metric">
                For imbalanced problems (e.g. 99% of transactions are not fraud), a model that always
                predicts "not fraud" gets 99% accuracy and is useless. Use precision/recall/F1 instead.
              </Callout>
              <Callout tone="good" title="Start simple">
                A linear/logistic regression baseline often reveals more, faster, than jumping
                straight to deep learning.
              </Callout>
              <Callout tone="warn" title="Ethics is not optional">
                Watch for privacy, bias & fairness, transparency, accountability, security, and keep a
                human in the loop for high-stakes decisions.
              </Callout>
            </div>
          </Section>

          <Section id="cheatsheet" n="11" eyebrow="Quick reference" title="Cheat sheet">
            <div className="overflow-x-auto rounded-lg border border-[#E5E5EF] dark:border-[#232B3D]">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#F7F7FB] dark:bg-[#131826]">
                    <th className="border-b border-[#E5E5EF] px-3 py-2 font-mono text-xs uppercase tracking-wide text-[#5B5B6E] dark:border-[#232B3D] dark:text-[#97A0B8]">
                      Problem
                    </th>
                    <th className="border-b border-[#E5E5EF] px-3 py-2 font-mono text-xs uppercase tracking-wide text-[#5B5B6E] dark:border-[#232B3D] dark:text-[#97A0B8]">
                      Reach for
                    </th>
                    <th className="border-b border-[#E5E5EF] px-3 py-2 font-mono text-xs uppercase tracking-wide text-[#5B5B6E] dark:border-[#232B3D] dark:text-[#97A0B8]">
                      Metric
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Predict a number", "Linear/Ridge/Lasso Regression", "MAE / RMSE / R²"],
                    ["Predict a category", "Logistic Regression, Random Forest, SVM", "Accuracy / F1"],
                    ["Group similar items", "K-Means, DBSCAN, Hierarchical", "Silhouette score"],
                    ["Sequential decisions", "Q-Learning, DQN", "Cumulative reward"],
                    ["Images", "CNNs (TensorFlow/PyTorch)", "Accuracy / IoU"],
                    ["Text / language", "Transformers, NLTK, SpaCy", "F1 / BLEU / perplexity"],
                  ].map((row) => (
                    <tr key={row[0]} className="odd:bg-white even:bg-[#FAFAFC] dark:odd:bg-[#0B0F1A] dark:even:bg-[#111726]">
                      {row.map((cell, i) => (
                        <td
                          key={i}
                          className={`px-3 py-2 ${i === 0 ? "font-medium text-[#14141F] dark:text-[#E7E9F5]" : "font-mono text-[13px] text-[#5B5B6E] dark:text-[#97A0B8]"}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card icon={<ListChecks className="h-4 w-4" />} title="Model families, one line each">
                Regression → predicts numbers · Classification → predicts labels · Clustering → groups
                unlabeled data · Reinforcement → learns from reward signals.
              </Card>
              <Card icon={<Gauge className="h-4 w-4" />} title="Split ratios">
                70–80% train / 20–30% test — or 70/15/15 with a validation set.
              </Card>
            </div>
          </Section>

          <Section id="projects" n="12" eyebrow="Practice ideas" title="Mini projects for beginners">
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                "House Price Prediction",
                "Student Score Prediction",
                "Spam Email Classifier",
                "Movie Recommendation System",
                "Handwritten Digit Recognition (MNIST)",
                "Fake News Detection",
                "Sentiment Analysis",
                "Face Mask Detection",
                "Plant Disease Detection",
                "Customer Churn Prediction",
              ].map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-2 rounded-md border border-[#E5E5EF] px-3 py-2 text-sm dark:border-[#232B3D]"
                >
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#6D28D9] dark:text-[#A78BFA]" />
                  {p}
                </div>
              ))}
            </div>
          </Section>

          <Section id="roadmap" n="13" eyebrow="Path forward" title="Learning roadmap">
            <p>
              This is a sequence — each step assumes the last. Follow the order; skipping the math and
              Python steps is the #1 reason people stall out on deep learning.
            </p>
            <ol className="space-y-2.5">
              {roadmap.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6D28D9]/10 font-mono text-[11px] font-semibold text-[#6D28D9] dark:bg-[#A78BFA]/10 dark:text-[#A78BFA]">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="careers" n="14" eyebrow="Where it leads" title="Career paths">
            <div className="flex flex-wrap gap-2">
              {[
                "AI Engineer",
                "ML Engineer",
                "Data Scientist",
                "Data Analyst",
                "NLP Engineer",
                "Computer Vision Engineer",
                "MLOps Engineer",
                "AI Research Scientist",
                "Robotics Engineer",
                "BI Analyst",
              ].map((role) => (
                <span
                  key={role}
                  className="rounded-full bg-[#14141F]/5 px-3 py-1.5 text-sm text-[#14141F] dark:bg-white/5 dark:text-[#E7E9F5]"
                >
                  {role}
                </span>
              ))}
            </div>
          </Section>
        </div>

        {/* ---------- Footer / download again ---------- */}
        <footer className="mt-4 flex flex-col items-center gap-4 border-t border-[#E5E5EF] pt-10 text-center dark:border-[#232B3D]">
          <p className="text-sm text-[#5B5B6E] dark:text-[#97A0B8]">
            That's the full curriculum, end to end. Keep a copy for yourself.
          </p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-md bg-[#6D28D9] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-[#5B21B6] active:scale-[0.98] dark:bg-[#A78BFA] dark:text-[#0B0F1A] dark:hover:bg-[#C4B5FD]"
          >
            <Download className="h-4 w-4" />
            {copied ? "Downloaded ✓" : "Download full notes"}
          </button>
        </footer>
      </div>
    </div>
  );
}