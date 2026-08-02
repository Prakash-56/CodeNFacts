// app/learn/roadmaps/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Server,
  Smartphone,
  Database,
  Cloud,
  Shield,
  Brain,
  LineChart,
  Palette,
  Gamepad2,
  Cpu,
  Network,
  FileText,
  Users,
  Briefcase,
  Terminal,
  Layers,
  GitBranch,
  Box,
  Workflow,
  Search,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Filter,
} from "lucide-react";

// ─────────────────────────────────────────────
// Data: 25+ Roadmaps
// ─────────────────────────────────────────────
const roadmaps = [
  {
    id: "frontend",
    title: "Frontend Developer",
    category: "Web",
    icon: Code2,
    color: "bg-blue-500",
    description: "Build beautiful, responsive user interfaces with modern frameworks.",
    stages: ["HTML/CSS/JS Basics", "React / Next.js", "TypeScript", "State Management", "Testing & Performance", "Advanced Patterns"],
    difficulty: "Beginner → Advanced",
  },
  {
    id: "backend",
    title: "Backend Developer",
    category: "Web",
    icon: Server,
    color: "bg-emerald-500",
    description: "Design robust APIs, databases, and server-side logic.",
    stages: ["Language Fundamentals", "Databases (SQL/NoSQL)", "REST & GraphQL", "Authentication", "Caching & Queues", "System Design"],
    difficulty: "Beginner → Advanced",
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    category: "Web",
    icon: Layers,
    color: "bg-violet-500",
    description: "Master both frontend and backend to ship complete products.",
    stages: ["Frontend Basics", "Backend Basics", "Full Stack Frameworks", "DevOps Basics", "Deployment", "Portfolio Projects"],
    difficulty: "Intermediate",
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    category: "Infrastructure",
    icon: Workflow,
    color: "bg-orange-500",
    description: "Automate infrastructure, CI/CD, and reliability.",
    stages: ["Linux & Scripting", "Containers (Docker)", "Kubernetes", "CI/CD Pipelines", "Cloud (AWS/GCP/Azure)", "Monitoring & SRE"],
    difficulty: "Intermediate → Advanced",
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "Data & AI",
    icon: LineChart,
    color: "bg-pink-500",
    description: "Extract insights and build predictive models from data.",
    stages: ["Python & Statistics", "Data Wrangling", "ML Algorithms", "Deep Learning", "MLOps", "Business Communication"],
    difficulty: "Intermediate",
  },
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    category: "Data & AI",
    icon: Brain,
    color: "bg-rose-500",
    description: "Productionize ML models at scale.",
    stages: ["ML Fundamentals", "Feature Engineering", "Model Training", "Serving & Deployment", "MLOps", "System Design for ML"],
    difficulty: "Advanced",
  },
  {
    id: "ai-engineer",
    title: "AI Engineer",
    category: "Data & AI",
    icon: Cpu,
    color: "bg-indigo-500",
    description: "Build LLM applications, agents, and RAG systems.",
    stages: ["Python & ML Basics", "Transformers & LLMs", "Prompt Engineering", "RAG & Vector DBs", "Agents & Tools", "Evaluation & Safety"],
    difficulty: "Intermediate → Advanced",
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    category: "Data & AI",
    icon: Database,
    color: "bg-cyan-500",
    description: "Build reliable data pipelines and warehouses.",
    stages: ["SQL Mastery", "Python/Spark", "ETL/ELT", "Data Warehousing", "Orchestration (Airflow)", "Cloud Data Platforms"],
    difficulty: "Intermediate",
  },
  {
    id: "mobile-android",
    title: "Android Developer",
    category: "Mobile",
    icon: Smartphone,
    color: "bg-green-500",
    description: "Create native Android apps with Kotlin.",
    stages: ["Kotlin Basics", "Android SDK", "Jetpack Compose", "Architecture (MVVM)", "Testing", "Play Store Release"],
    difficulty: "Beginner → Intermediate",
  },
  {
    id: "mobile-ios",
    title: "iOS Developer",
    category: "Mobile",
    icon: Smartphone,
    color: "bg-sky-500",
    description: "Build polished iOS apps with Swift & SwiftUI.",
    stages: ["Swift Basics", "UIKit / SwiftUI", "Architecture", "Core Data & Networking", "Testing", "App Store"],
    difficulty: "Beginner → Intermediate",
  },
  {
    id: "react-native",
    title: "React Native Developer",
    category: "Mobile",
    icon: Smartphone,
    color: "bg-blue-600",
    description: "Cross-platform mobile apps with one codebase.",
    stages: ["React Fundamentals", "React Native Core", "Navigation", "Native Modules", "State & Performance", "Publishing"],
    difficulty: "Intermediate",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Specialist",
    category: "Security",
    icon: Shield,
    color: "bg-red-500",
    description: "Protect systems, networks, and data from threats.",
    stages: ["Networking Basics", "Linux & Scripting", "Ethical Hacking", "Penetration Testing", "Security Tools", "Certifications (OSCP/CEH)"],
    difficulty: "Intermediate → Advanced",
  },
  {
    id: "cloud-architect",
    title: "Cloud Architect",
    category: "Infrastructure",
    icon: Cloud,
    color: "bg-amber-500",
    description: "Design scalable, secure cloud infrastructure.",
    stages: ["Cloud Fundamentals", "AWS/GCP/Azure Deep Dive", "Networking & Security", "Cost Optimization", "Multi-cloud", "Architecture Patterns"],
    difficulty: "Advanced",
  },
  {
    id: "sre",
    title: "Site Reliability Engineer",
    category: "Infrastructure",
    icon: Terminal,
    color: "bg-teal-500",
    description: "Keep systems reliable at scale through automation.",
    stages: ["Linux & Observability", "SLIs/SLOs", "Incident Response", "Chaos Engineering", "Automation", "Capacity Planning"],
    difficulty: "Advanced",
  },
  {
    id: "qa",
    title: "QA / Test Automation",
    category: "Quality",
    icon: CheckCircle2,
    color: "bg-lime-500",
    description: "Ensure software quality through automated testing.",
    stages: ["Testing Fundamentals", "Manual Testing", "Selenium / Playwright", "API Testing", "CI Integration", "Performance Testing"],
    difficulty: "Beginner → Intermediate",
  },
  {
    id: "ui-ux",
    title: "UI/UX Designer",
    category: "Design",
    icon: Palette,
    color: "bg-fuchsia-500",
    description: "Design delightful and usable digital experiences.",
    stages: ["Design Principles", "Figma Mastery", "User Research", "Wireframing & Prototyping", "Design Systems", "Usability Testing"],
    difficulty: "Beginner → Intermediate",
  },
  {
    id: "product-manager",
    title: "Product Manager",
    category: "Product",
    icon: Briefcase,
    color: "bg-purple-500",
    description: "Define product vision and drive delivery.",
    stages: ["Product Thinking", "User Research", "Prioritization", "Roadmapping", "Metrics & Analytics", "Stakeholder Management"],
    difficulty: "Intermediate",
  },
  {
    id: "game-dev",
    title: "Game Developer",
    category: "Games",
    icon: Gamepad2,
    color: "bg-yellow-500",
    description: "Create games for desktop, mobile, or consoles.",
    stages: ["Programming Basics", "Game Engines (Unity/Unreal)", "Game Design", "Physics & Animation", "Multiplayer", "Publishing"],
    difficulty: "Intermediate",
  },
  {
    id: "blockchain",
    title: "Blockchain Developer",
    category: "Web3",
    icon: Box,
    color: "bg-orange-600",
    description: "Build smart contracts and decentralized applications.",
    stages: ["Blockchain Fundamentals", "Solidity / Rust", "Smart Contracts", "Web3.js / Ethers", "Security Auditing", "DApp Architecture"],
    difficulty: "Intermediate → Advanced",
  },
  {
    id: "software-architect",
    title: "Software Architect",
    category: "Architecture",
    icon: GitBranch,
    color: "bg-slate-500",
    description: "Design large-scale, maintainable software systems.",
    stages: ["System Design", "Design Patterns", "Distributed Systems", "Trade-off Analysis", "Documentation", "Leadership"],
    difficulty: "Advanced",
  },
  {
    id: "technical-writer",
    title: "Technical Writer",
    category: "Content",
    icon: FileText,
    color: "bg-stone-500",
    description: "Create clear documentation and developer content.",
    stages: ["Writing Fundamentals", "Docs-as-Code", "API Documentation", "Tutorials & Guides", "Developer Experience", "Tools (Markdown, Docusaurus)"],
    difficulty: "Beginner → Intermediate",
  },
  {
    id: "devrel",
    title: "Developer Relations",
    category: "Community",
    icon: Users,
    color: "bg-indigo-600",
    description: "Build community and advocate for developer products.",
    stages: ["Technical Skills", "Content Creation", "Public Speaking", "Community Building", "Product Feedback", "Metrics"],
    difficulty: "Intermediate",
  },
  {
    id: "network-engineer",
    title: "Network Engineer",
    category: "Infrastructure",
    icon: Network,
    color: "bg-blue-700",
    description: "Design and maintain enterprise networks.",
    stages: ["Networking Fundamentals", "Routing & Switching", "Firewalls & Security", "Cloud Networking", "Automation (Ansible)", "Certifications (CCNA/CCNP)"],
    difficulty: "Intermediate",
  },
  {
    id: "mlops",
    title: "MLOps Engineer",
    category: "Data & AI",
    icon: Workflow,
    color: "bg-rose-600",
    description: "Operationalize machine learning pipelines.",
    stages: ["ML Fundamentals", "CI/CD for ML", "Model Serving", "Feature Stores", "Monitoring & Drift", "Infrastructure as Code"],
    difficulty: "Advanced",
  },
  {
    id: "prompt-engineer",
    title: "Prompt / AI Product Engineer",
    category: "Data & AI",
    icon: Lightbulb,
    color: "bg-yellow-600",
    description: "Specialize in building reliable LLM-powered products.",
    stages: ["LLM Fundamentals", "Prompt Design", "Evaluation Frameworks", "RAG Systems", "Agent Design", "Safety & Alignment"],
    difficulty: "Intermediate",
  },
];

// ─────────────────────────────────────────────
// Important Things to Keep in Mind
// ─────────────────────────────────────────────
const mindsets = [
  {
    title: "Consistency > Intensity",
    description: "1–2 hours every day beats 10-hour weekend sprints. Compound learning wins.",
    icon: CheckCircle2,
  },
  {
    title: "Build in Public",
    description: "Share your projects, notes, and progress. Feedback and accountability accelerate growth.",
    icon: Users,
  },
  {
    title: "Projects > Tutorials",
    description: "Finish real projects end-to-end. Tutorials teach syntax; projects teach problem-solving.",
    icon: Box,
  },
  {
    title: "Learn to Learn",
    description: "Focus on fundamentals and how to find answers. Tools and frameworks change constantly.",
    icon: BookOpen,
  },
  {
    title: "Network Intentionally",
    description: "Join communities, contribute to open source, and talk to people already in the roles you want.",
    icon: Network,
  },
  {
    title: "Avoid Tutorial Hell",
    description: "After learning a concept, immediately apply it in a small project before moving on.",
    icon: AlertTriangle,
  },
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function RoadmapsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(roadmaps.map((r) => r.category)))];

  const filtered = roadmaps.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Career Roadmaps
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Structured learning paths for 25+ tech roles. Pick a path, follow the stages, and build real projects.
            </p>
          </div>

          {/* Search + Filter */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search roadmaps..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Roadmaps Grid ─── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((roadmap) => {
            const Icon = roadmap.icon;
            return (
              <div
                key={roadmap.id}
                className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`${roadmap.color} p-3 rounded-xl text-white shrink-0`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{roadmap.title}</h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {roadmap.category} · {roadmap.difficulty}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {roadmap.description}
                </p>

                {/* Mini stage timeline (sketch style) */}
                <div className="mt-5 space-y-2">
                  {roadmap.stages.slice(0, 4).map((stage, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                      <span>{stage}</span>
                    </div>
                  ))}
                  {roadmap.stages.length > 4 && (
                    <div className="text-xs text-zinc-400 dark:text-zinc-500 pl-3.5">
                      +{roadmap.stages.length - 4} more stages
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {roadmap.stages.length} stages
                  </span>
                  <Link
                    href={`/learn/roadmaps/${roadmap.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View roadmap
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">
            No roadmaps match your search. Try a different keyword or category.
          </div>
        )}
      </section>

      {/* ─── Important Things to Keep in Mind ─── */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Important Things to Keep in Mind</h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              These principles matter more than any specific technology stack.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mindsets.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Learning Path Diagram (Visual Sketch) ─── */}
      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">How to Approach Any Roadmap</h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              A simple mental model you can apply to every career path above.
            </p>
          </div>

          {/* Horizontal flow diagram */}
          <div className="relative overflow-x-auto pb-4">
            <div className="flex min-w-[700px] items-center justify-between gap-4 px-4">
              {[
                { label: "1. Fundamentals", desc: "Core concepts & language" },
                { label: "2. Tools", desc: "Frameworks & ecosystem" },
                { label: "3. Projects", desc: "Build real things" },
                { label: "4. Deepen", desc: "Advanced patterns" },
                { label: "5. Specialize", desc: "Domain expertise" },
                { label: "6. Share", desc: "Portfolio & network" },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center relative">
                  <div className="h-14 w-14 rounded-full border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-zinc-900 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shadow-sm">
                    {i + 1}
                  </div>
                  <p className="mt-3 text-sm font-semibold">{step.label}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[100px]">{step.desc}</p>
                  {i < 5 && (
                    <div className="absolute top-7 left-[calc(100%+0.5rem)] w-8 h-0.5 bg-zinc-300 dark:bg-zinc-700 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ASCII-style sketch note */}
          <div className="mt-12 max-w-3xl mx-auto rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 p-6 font-mono text-sm text-zinc-600 dark:text-zinc-400">
            <pre className="whitespace-pre-wrap leading-relaxed">
{`┌─────────────────────────────────────────────────────┐
│  Recommended Weekly Rhythm                          │
├─────────────────────────────────────────────────────┤
│  Mon–Fri : 1–2 hrs focused learning + practice      │
│  Weekend : 1 larger project milestone or review     │
│  Monthly : Publish something (blog, repo, demo)     │
│  Quarterly: Re-evaluate goals & update roadmap      │
└─────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold">Start today. Progress compounds.</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Pick one roadmap, complete the first stage this week, and ship something small.
          </p>
          <div className="mt-8">
            <Link
              href="#top"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 dark:bg-blue-500 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Browse all roadmaps
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}