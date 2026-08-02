"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  User,
  Briefcase,
  Code,
  Database,
  Layout,
  Server,
  Smartphone,
  Brain,
  Target,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Lightbulb,
  MessageCircle,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Mic,
  Eye,
  Sun,
  Moon,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Role =
  | "frontend"
  | "backend"
  | "fullstack"
  | "mobile"
  | "devops"
  | "data"
  | "product"
  | "qa";

type Theme = "light" | "dark";

interface Question {
  id: number;
  text: string;
  category: "technical" | "behavioral" | "system-design" | "soft-skills";
  tips?: string;
}

interface Answer {
  questionId: number;
  text: string;
  timestamp: number;
}

interface ResultBreakdown {
  technical: number;
  communication: number;
  confidence: number;
  structure: number;
  overall: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
}

// ─────────────────────────────────────────────
// Role config & real-world questions
// ─────────────────────────────────────────────
const ROLES: {
  id: Role;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: "frontend",
    title: "Frontend Engineer",
    description: "React, TypeScript, CSS, performance, accessibility",
    icon: <Layout className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "backend",
    title: "Backend Engineer",
    description: "APIs, databases, scalability, security, system design",
    icon: <Server className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "fullstack",
    title: "Full-Stack Engineer",
    description: "End-to-end ownership, architecture, trade-offs",
    icon: <Code className="w-6 h-6" />,
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "mobile",
    title: "Mobile Engineer",
    description: "iOS / Android / React Native, offline, performance",
    icon: <Smartphone className="w-6 h-6" />,
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "devops",
    title: "DevOps / SRE",
    description: "CI/CD, Kubernetes, observability, reliability",
    icon: <Database className="w-6 h-6" />,
    color: "from-rose-500 to-pink-500",
  },
  {
    id: "data",
    title: "Data Engineer / Scientist",
    description: "Pipelines, modeling, SQL, ML systems",
    icon: <Brain className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-600",
  },
  {
    id: "product",
    title: "Product Manager",
    description: "Prioritization, metrics, stakeholder management",
    icon: <Target className="w-6 h-6" />,
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    id: "qa",
    title: "QA / Test Engineer",
    description: "Test strategy, automation, quality culture",
    icon: <CheckCircle2 className="w-6 h-6" />,
    color: "from-lime-500 to-green-500",
  },
];

const QUESTIONS: Record<Role, Question[]> = {
  frontend: [
    {
      id: 1,
      text: "Walk me through how you would diagnose and fix a React component that re-renders too often and causes performance issues.",
      category: "technical",
      tips: "Talk about React DevTools Profiler, memo, useMemo, useCallback, and when not to over-optimize.",
    },
    {
      id: 2,
      text: "Explain the difference between controlled and uncontrolled components. When would you choose one over the other?",
      category: "technical",
    },
    {
      id: 3,
      text: "How do you ensure accessibility (a11y) in a complex form with dynamic fields and error states?",
      category: "technical",
    },
    {
      id: 4,
      text: "Describe a time you had a disagreement with a designer or product manager about a UI decision. How did you resolve it?",
      category: "behavioral",
    },
    {
      id: 5,
      text: "Design a frontend architecture for a dashboard that needs to support real-time updates, offline mode, and multiple themes.",
      category: "system-design",
    },
    {
      id: 6,
      text: "How do you approach code reviews? What do you look for beyond just 'does it work'?",
      category: "soft-skills",
    },
    {
      id: 7,
      text: "Tell me about a production bug you shipped. How did you find it, fix it, and prevent similar issues?",
      category: "behavioral",
    },
    {
      id: 8,
      text: "What metrics do you track to know if a frontend feature is successful after launch?",
      category: "soft-skills",
    },
  ],
  backend: [
    {
      id: 1,
      text: "How would you design a rate-limiting system for a public API that needs to support different tiers of users?",
      category: "system-design",
    },
    {
      id: 2,
      text: "Explain the CAP theorem and how it influenced a decision you made in a distributed system.",
      category: "technical",
    },
    {
      id: 3,
      text: "Walk me through debugging a production issue where API latency suddenly spiked for 15% of requests.",
      category: "technical",
    },
    {
      id: 4,
      text: "Describe a time you had to push back on a feature request because of technical debt or scalability concerns.",
      category: "behavioral",
    },
    {
      id: 5,
      text: "How do you approach database schema design for a multi-tenant SaaS application?",
      category: "system-design",
    },
    {
      id: 6,
      text: "What's your process for reviewing pull requests that touch authentication or authorization logic?",
      category: "soft-skills",
    },
    {
      id: 7,
      text: "Tell me about a time you improved the reliability or performance of a critical service. What was the impact?",
      category: "behavioral",
    },
    {
      id: 8,
      text: "How do you balance shipping fast versus writing maintainable, well-tested code?",
      category: "soft-skills",
    },
  ],
  fullstack: [
    {
      id: 1,
      text: "You need to build a feature that spans frontend, backend, and a third-party integration. How do you break it down and estimate?",
      category: "system-design",
    },
    {
      id: 2,
      text: "Explain how you would implement optimistic UI updates while keeping data consistency with the backend.",
      category: "technical",
    },
    {
      id: 3,
      text: "Describe a situation where you had to choose between a quick frontend-only solution and a more robust full-stack approach.",
      category: "behavioral",
    },
    {
      id: 4,
      text: "How do you handle authentication and session management across web and mobile clients?",
      category: "technical",
    },
    {
      id: 5,
      text: "Design the data flow for a collaborative document editor (like Google Docs lite).",
      category: "system-design",
    },
    {
      id: 6,
      text: "How do you communicate technical trade-offs to non-technical stakeholders?",
      category: "soft-skills",
    },
    {
      id: 7,
      text: "Tell me about a production incident you owned end-to-end. What was your role and what did you learn?",
      category: "behavioral",
    },
    {
      id: 8,
      text: "What does 'good ownership' look like for a full-stack engineer in your experience?",
      category: "soft-skills",
    },
  ],
  mobile: [
    {
      id: 1,
      text: "How do you handle offline-first architecture and data synchronization conflicts in a mobile app?",
      category: "system-design",
    },
    {
      id: 2,
      text: "Walk me through optimizing app startup time and reducing ANRs / freezes.",
      category: "technical",
    },
    {
      id: 3,
      text: "Explain your approach to testing on a wide range of devices and OS versions.",
      category: "technical",
    },
    {
      id: 4,
      text: "Describe a time you had to ship a critical hotfix to the app stores under time pressure.",
      category: "behavioral",
    },
    {
      id: 5,
      text: "How would you design a push-notification system that respects battery life and user preferences?",
      category: "system-design",
    },
    {
      id: 6,
      text: "How do you collaborate with designers on mobile-specific patterns (gestures, safe areas, dark mode)?",
      category: "soft-skills",
    },
    {
      id: 7,
      text: "Tell me about a performance regression you caught before it reached users. How did you prevent it?",
      category: "behavioral",
    },
    {
      id: 8,
      text: "What metrics do you monitor to understand real-user experience on mobile?",
      category: "soft-skills",
    },
  ],
  devops: [
    {
      id: 1,
      text: "Design a CI/CD pipeline for a microservices architecture that needs to support canary releases and automatic rollbacks.",
      category: "system-design",
    },
    {
      id: 2,
      text: "How do you approach observability (metrics, logs, traces) for a system that spans multiple clouds?",
      category: "technical",
    },
    {
      id: 3,
      text: "Walk me through investigating a production outage caused by a cascading failure.",
      category: "technical",
    },
    {
      id: 4,
      text: "Describe a time you improved developer experience or reduced toil for the engineering team.",
      category: "behavioral",
    },
    {
      id: 5,
      text: "How would you design a cost-optimization strategy for Kubernetes clusters running mixed workloads?",
      category: "system-design",
    },
    {
      id: 6,
      text: "How do you balance security requirements with the need for developers to move quickly?",
      category: "soft-skills",
    },
    {
      id: 7,
      text: "Tell me about a time a deployment went wrong. What was your incident response and what changed afterward?",
      category: "behavioral",
    },
    {
      id: 8,
      text: "What does 'reliability' mean to you, and how do you measure it?",
      category: "soft-skills",
    },
  ],
  data: [
    {
      id: 1,
      text: "Design a data pipeline that ingests events from multiple sources, transforms them, and makes them available for both analytics and ML feature stores.",
      category: "system-design",
    },
    {
      id: 2,
      text: "How do you ensure data quality and handle late-arriving or duplicate events?",
      category: "technical",
    },
    {
      id: 3,
      text: "Explain a complex SQL or Spark query you optimized. What was the bottleneck and how did you fix it?",
      category: "technical",
    },
    {
      id: 4,
      text: "Describe a time you had to communicate data limitations or uncertainty to business stakeholders.",
      category: "behavioral",
    },
    {
      id: 5,
      text: "How would you approach building a real-time recommendation feature with freshness and relevance requirements?",
      category: "system-design",
    },
    {
      id: 6,
      text: "How do you decide between batch and streaming processing for a new use case?",
      category: "soft-skills",
    },
    {
      id: 7,
      text: "Tell me about a data incident (wrong numbers, pipeline failure). How did you detect, fix, and prevent recurrence?",
      category: "behavioral",
    },
    {
      id: 8,
      text: "What does good documentation look like for data models and pipelines?",
      category: "soft-skills",
    },
  ],
  product: [
    {
      id: 1,
      text: "How do you prioritize a backlog when everything feels important and engineering capacity is limited?",
      category: "system-design",
    },
    {
      id: 2,
      text: "Walk me through how you would define success metrics for a new feature before it is built.",
      category: "technical",
    },
    {
      id: 3,
      text: "Describe a time you had to say no to a stakeholder or executive. How did you handle it?",
      category: "behavioral",
    },
    {
      id: 4,
      text: "How do you balance qualitative user research with quantitative data when making product decisions?",
      category: "technical",
    },
    {
      id: 5,
      text: "Design the product requirements and rollout plan for a feature that will affect both free and paid users differently.",
      category: "system-design",
    },
    {
      id: 6,
      text: "How do you work with engineers who push back on scope or timelines?",
      category: "soft-skills",
    },
    {
      id: 7,
      text: "Tell me about a product you launched that did not meet expectations. What did you learn?",
      category: "behavioral",
    },
    {
      id: 8,
      text: "What does good product sense mean to you, and how do you develop it?",
      category: "soft-skills",
    },
  ],
  qa: [
    {
      id: 1,
      text: "How would you design a test strategy for a complex multi-service feature that includes frontend, backend, and a third-party API?",
      category: "system-design",
    },
    {
      id: 2,
      text: "Explain your approach to balancing manual exploratory testing with automated regression suites.",
      category: "technical",
    },
    {
      id: 3,
      text: "Walk me through how you would investigate a flaky test that fails intermittently in CI.",
      category: "technical",
    },
    {
      id: 4,
      text: "Describe a time you found a critical bug late in the cycle. How did you handle communication and risk?",
      category: "behavioral",
    },
    {
      id: 5,
      text: "How do you decide what should be covered by unit, integration, and end-to-end tests?",
      category: "system-design",
    },
    {
      id: 6,
      text: "How do you advocate for quality without becoming a blocker for the team?",
      category: "soft-skills",
    },
    {
      id: 7,
      text: "Tell me about a process improvement you introduced that reduced escaped defects.",
      category: "behavioral",
    },
    {
      id: 8,
      text: "What does a healthy quality culture look like in an engineering organization?",
      category: "soft-skills",
    },
  ],
};

// ─────────────────────────────────────────────
// Scoring helper (mock intelligent evaluation)
// ─────────────────────────────────────────────
function evaluateAnswers(answers: Answer[], role: Role): ResultBreakdown {
  const avgLength =
    answers.reduce((sum, a) => sum + a.text.trim().split(/\s+/).length, 0) /
    Math.max(answers.length, 1);

  // Heuristics for a realistic feel
  const structureScore = Math.min(
    100,
    Math.round(40 + avgLength * 1.8 + (answers.filter((a) => a.text.length > 80).length / 8) * 30)
  );
  const communicationScore = Math.min(
    100,
    Math.round(45 + avgLength * 1.5 + (answers.some((a) => /because|for example|specifically|i would/i.test(a.text)) ? 20 : 0))
  );
  const confidenceScore = Math.min(
    100,
    Math.round(50 + (answers.filter((a) => a.text.length > 40).length / 8) * 40)
  );
  const technicalScore = Math.min(
    100,
    Math.round(48 + avgLength * 1.2 + (answers.filter((a) => a.text.length > 100).length / 8) * 25)
  );

  const overall = Math.round(
    (technicalScore * 0.3 +
      communicationScore * 0.3 +
      confidenceScore * 0.2 +
      structureScore * 0.2)
  );

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (communicationScore >= 70) strengths.push("Clear and structured communication");
  else improvements.push("Practice explaining your thought process out loud more clearly");

  if (confidenceScore >= 70) strengths.push("Confident delivery and ownership of answers");
  else improvements.push("Speak with more conviction — avoid excessive hedging");

  if (structureScore >= 70) strengths.push("Well-organized answers with good depth");
  else improvements.push("Use a framework (Situation → Action → Result or Problem → Approach → Trade-offs)");

  if (technicalScore >= 70) strengths.push("Solid technical reasoning for the role");
  else improvements.push("Add more concrete examples and technical depth");

  if (avgLength < 40) improvements.push("Answers were quite short — aim for richer explanations");
  if (avgLength > 180) improvements.push("Some answers ran long — practice being concise under time pressure");

  if (strengths.length === 0) strengths.push("Completed the full interview under realistic conditions");

  let feedback = "";
  if (overall >= 85) {
    feedback =
      "Excellent performance. You demonstrated strong technical thinking, clear communication, and confident delivery. You are interview-ready for most mid-to-senior roles in this track.";
  } else if (overall >= 70) {
    feedback =
      "Solid performance overall. You have a good foundation. Focus on the improvement areas below and you will be very competitive.";
  } else if (overall >= 55) {
    feedback =
      "Decent start. You showed understanding but need more depth, structure, and confidence. Practice out loud and time-box your answers.";
  } else {
    feedback =
      "This was a valuable practice session. Focus on structuring answers, adding concrete examples, and speaking more confidently. Consistency comes with deliberate practice.";
  }

  return {
    technical: technicalScore,
    communication: communicationScore,
    confidence: confidenceScore,
    structure: structureScore,
    overall,
    strengths,
    improvements,
    feedback,
  };
}

// ─────────────────────────────────────────────
// Theme hook
// ─────────────────────────────────────────────
const THEME_STORAGE_KEY = "interview-simulator-theme";

function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage, falling back to the OS preference.
  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    setMounted(true);
  }, []);

  // Keep the <html> element's class + localStorage in sync with state.
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, mounted]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme, mounted };
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
    </button>
  );
}

// ─────────────────────────────────────────────
// UI Components
// ─────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1.5 text-zinc-600 dark:text-zinc-400">
        <span>
          Question {current} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            className="text-zinc-200 dark:text-zinc-800"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={color}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-zinc-900 dark:text-white">{score}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
    </div>
  );
}

function TipCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
        <h3 className="font-semibold text-zinc-900 dark:text-white">{title}</h3>
      </div>
      <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function InterviewSimulatorPage() {
  const [step, setStep] = useState<"intro" | "role" | "interview" | "results">("intro");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState<ResultBreakdown | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme, toggleTheme, mounted } = useTheme();

  const questions = selectedRole ? QUESTIONS[selectedRole] : [];
  const roleMeta = ROLES.find((r) => r.id === selectedRole);

  // Auto-focus textarea when question changes
  useEffect(() => {
    if (step === "interview" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentQ, step]);

  const startInterview = (role: Role) => {
    setSelectedRole(role);
    setCurrentQ(0);
    setAnswers([]);
    setCurrentAnswer("");
    setResult(null);
    setStep("interview");
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim() || !selectedRole) return;

    const newAnswers = [
      ...answers,
      {
        questionId: questions[currentQ].id,
        text: currentAnswer.trim(),
        timestamp: Date.now(),
      },
    ];
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentQ + 1 >= 8) {
      // Simulate AI evaluation delay
      setIsThinking(true);
      setTimeout(() => {
        const evaluation = evaluateAnswers(newAnswers, selectedRole);
        setResult(evaluation);
        setIsThinking(false);
        setStep("results");
      }, 1800);
    } else {
      setIsThinking(true);
      setTimeout(() => {
        setCurrentQ((q) => q + 1);
        setIsThinking(false);
      }, 700);
    }
  };

  const reset = () => {
    setStep("intro");
    setSelectedRole(null);
    setCurrentQ(0);
    setAnswers([]);
    setCurrentAnswer("");
    setResult(null);
  };

  // Avoid a light/dark flash on first paint while we read the stored preference.
  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-zinc-950" />;
  }

  // ─── INTRO ─────────────────────────────────
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Practice
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Interview Simulator
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Practice real-world technical and behavioral interviews. Get structured feedback on
              communication, confidence, and technical depth - just like a real interviewer would
              assess you.
            </p>
          </div>

          {/* Why this matters */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-14">
            <TipCard icon={<MessageCircle className="w-5 h-5" />} title="Communication matters">
              <p>
                Interviewers remember how clearly you explained your thinking more than the exact
                answer. Structured answers (Problem → Approach → Trade-offs → Result) stand out.
              </p>
            </TipCard>
            <TipCard icon={<Shield className="w-5 h-5" />} title="Confidence is visible">
              <p>
                Confidence is not arrogance. It is owning your experience, speaking at a steady pace,
                and being comfortable saying “I don’t know, but here’s how I would find out.”
              </p>
            </TipCard>
            <TipCard icon={<Target className="w-5 h-5" />} title="Why deliberate practice">
              <p>
                Most candidates underperform because they only prepare passively. Speaking answers
                out loud under time pressure is the single highest-leverage preparation method.
              </p>
            </TipCard>
          </div>

          {/* Don't forget checklist */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-6 sm:p-8 mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold">Don’t forget before you start</h2>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 text-sm text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                <span>Answer out loud as if a real person is listening — tone and pace matter.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                <span>Use concrete examples from your own experience whenever possible.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                <span>Structure every answer: context → action → result (or trade-offs).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                <span>It’s okay to take 5–10 seconds to think before speaking.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                <span>If you don’t know something, say so and outline how you would approach it.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                <span>Time-box yourself: aim for 1.5–3 minutes per answer.</span>
              </li>
            </ul>
          </div>

          {/* Communication & Confidence deep dive */}
          <div className="grid gap-6 lg:grid-cols-2 mb-14">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mic className="w-5 h-5 text-indigo-500" />
                <h3 className="font-semibold text-lg">Communication that lands</h3>
              </div>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
                  Start with the conclusion or high-level approach, then dive into details.
                </li>
                <li className="flex gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
                  Use “I” statements for ownership (“I decided…”, “I measured…”).
                </li>
                <li className="flex gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
                  Explicitly call out trade-offs — interviewers love seeing judgment.
                </li>
                <li className="flex gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
                  Check in: “Does that answer the question, or would you like more detail on X?”
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-violet-500" />
                <h3 className="font-semibold text-lg">Projecting confidence</h3>
              </div>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-violet-400 shrink-0" />
                  Avoid filler words and excessive “I think / maybe / sort of”.
                </li>
                <li className="flex gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-violet-400 shrink-0" />
                  Pause instead of rushing — silence is better than rambling.
                </li>
                <li className="flex gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-violet-400 shrink-0" />
                  When uncertain, show your reasoning process rather than freezing.
                </li>
                <li className="flex gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-violet-400 shrink-0" />
                  End answers cleanly instead of trailing off with “yeah… so…”.
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => setStep("role")}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 text-base shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
            >
              Choose your role
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
              8 real-world questions · Instant structured feedback · No account needed
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── ROLE SELECTION ────────────────────────
  if (step === "role") {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10">
            <button
              onClick={() => setStep("intro")}
              className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-6 inline-flex items-center gap-1"
            >
              ← Back
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              Select your interview track
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Questions are tailored to the role you choose. Pick the one closest to the job you are
              targeting.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => startInterview(role.id)}
                className="group text-left rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-500/5 transition-all active:scale-[0.99]"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${role.color} text-white mb-4 shadow-md`}
                >
                  {role.icon}
                </div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {role.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{role.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── INTERVIEW ─────────────────────────────
  if (step === "interview" && selectedRole && questions.length > 0) {
    const q = questions[currentQ];

    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${roleMeta?.color} text-white`}
              >
                {roleMeta?.icon}
              </div>
              <div>
                <p className="font-semibold">{roleMeta?.title}</p>
                <p className="text-xs text-zinc-500">Mock Interview · AI Interviewer</p>
              </div>
            </div>
            <button
              onClick={reset}
              className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restart
            </button>
          </div>

          <ProgressBar current={currentQ + 1} total={8} />

          {/* Question card */}
          <div className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                    {q.category.replace("-", " ")}
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-medium leading-relaxed">{q.text}</p>
                {q.tips && (
                  <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
                    {q.tips}
                  </p>
                )}
              </div>
            </div>

            {/* Answer area */}
            {isThinking ? (
              <div className="flex items-center justify-center py-12 gap-3 text-zinc-500">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                </div>
                <span className="text-sm">
                  {currentQ + 1 >= 8 ? "Evaluating your interview…" : "Next question…"}
                </span>
              </div>
            ) : (
              <>
                <textarea
                  ref={textareaRef}
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer here as if you were speaking to the interviewer… Aim for depth, structure, and clarity."
                  rows={7}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm sm:text-base leading-relaxed placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 resize-y min-h-[140px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      submitAnswer();
                    }
                  }}
                />
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-xs text-zinc-500">
                    Tip: ⌘/Ctrl + Enter to submit · Speak as if in a real interview
                  </p>
                  <button
                    onClick={submitAnswer}
                    disabled={!currentAnswer.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 text-sm transition-all active:scale-[0.98]"
                  >
                    {currentQ + 1 >= 8 ? "Finish interview" : "Submit answer"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mini tips during interview */}
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-500">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1">
              <Clock className="w-3 h-3" /> 1.5–3 min ideal
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1">
              <BookOpen className="w-3 h-3" /> Use real examples
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1">
              <Users className="w-3 h-3" /> Structure your answer
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS ───────────────────────────────
  if (step === "results" && result && roleMeta) {
    const scoreColor =
      result.overall >= 80
        ? "text-emerald-500"
        : result.overall >= 65
          ? "text-indigo-500"
          : result.overall >= 50
            ? "text-amber-500"
            : "text-rose-500";

    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-4">
              <Star className="w-4 h-4" />
              Interview complete
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              Your results - {roleMeta.title}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Based on the depth, structure, and clarity of your 8 answers.
            </p>
          </div>

          {/* Overall score */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/80 dark:to-zinc-950 p-8 mb-8 text-center">
            <p className="text-sm font-medium text-zinc-500 mb-2">Overall score</p>
            <p className={`text-6xl font-bold tabular-nums ${scoreColor}`}>{result.overall}</p>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
              {result.feedback}
            </p>
          </div>

          {/* Breakdown rings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
            <ScoreRing score={result.technical} label="Technical" color="text-blue-500" />
            <ScoreRing score={result.communication} label="Communication" color="text-indigo-500" />
            <ScoreRing score={result.confidence} label="Confidence" color="text-violet-500" />
            <ScoreRing score={result.structure} label="Structure" color="text-emerald-500" />
          </div>

          {/* Strengths & Improvements */}
          <div className="grid gap-6 sm:grid-cols-2 mb-10">
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-6">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Strengths
              </h3>
              <ul className="space-y-2.5">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-emerald-900/80 dark:text-emerald-200/80 flex gap-2">
                    <span className="text-emerald-500">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-6">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Areas to improve
              </h3>
              <ul className="space-y-2.5">
                {result.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-amber-900/80 dark:text-amber-200/80 flex gap-2">
                    <span className="text-amber-500">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Communication & Confidence reminder */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 mb-10">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-500" />
              Keep practicing communication & confidence
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Even strong technical answers lose impact without clear delivery. Record yourself
              answering 2–3 questions weekly, listen back, and notice filler words, pace, and whether
              you ended cleanly. Confidence grows from repetition under realistic conditions — exactly
              what this simulator gives you.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => startInterview(selectedRole!)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4" />
              Try again (same role)
            </button>
            <button
              onClick={() => setStep("role")}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-medium px-6 py-3 transition-all"
            >
              Choose different role
            </button>
            <button
              onClick={reset}
              className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}