"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Code2,
  Server,
  Layers,
  BrainCircuit,
  Cloud,
  Palette,
  Smartphone,
  BarChart3,
  ShieldCheck,
  Link2,
  Gamepad2,
  TerminalSquare,
  Search,
  X,
  FolderKanban,
  Sparkles,
  Flame,
  Puzzle,
  Wrench,
  Rocket,
  CalendarClock,
  CheckCircle2,
  Quote,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Difficulty = "Minor" | "Advanced Minor" | "Major";

interface RawProject {
  title: string;
  difficulty: Difficulty;
  tech: string[];
  description: string;
}

interface Project extends RawProject {
  id: string;
  category: string;
}

interface Category {
  name: string;
  icon: typeof Code2;
  projects: RawProject[];
}

const CATEGORIES: Category[] = [
  {
    name: "Frontend Development",
    icon: Code2,
    projects: [
      { title: "Kanban Board with Drag-and-Drop", difficulty: "Minor", tech: ["React", "dnd-kit"], description: "A Trello-style board with draggable cards, columns, and localStorage persistence." },
      { title: "Markdown Notes Editor with Live Preview", difficulty: "Minor", tech: ["React", "remark"], description: "Split-pane editor that renders Markdown live as you type, with autosave." },
      { title: "E-commerce Storefront with Checkout Flow", difficulty: "Major", tech: ["Next.js", "Stripe", "Zustand"], description: "Full storefront with cart, filters, and a working test-mode checkout." },
      { title: "Real-time Collaborative Whiteboard", difficulty: "Advanced Minor", tech: ["Canvas API", "WebSockets"], description: "Multiple cursors drawing on the same canvas in real time." },
      { title: "Component Library with Storybook", difficulty: "Advanced Minor", tech: ["React", "Storybook", "Tailwind"], description: "A documented, reusable UI kit with variants, props tables, and themes." },
      { title: "Portfolio Site Generator from JSON Config", difficulty: "Minor", tech: ["Next.js"], description: "Feed it a JSON resume and it renders a full portfolio site." },
      { title: "Multi-step Form Wizard with Validation", difficulty: "Minor", tech: ["React Hook Form", "Zod"], description: "Branching multi-step form with per-step validation and progress state." },
      { title: "Infinite Scroll Image Gallery", difficulty: "Minor", tech: ["React", "IntersectionObserver"], description: "Masonry gallery with lazy-loaded images and skeleton loaders." },
      { title: "Dashboard with a Pluggable Theming Engine", difficulty: "Advanced Minor", tech: ["React", "CSS Variables"], description: "Users can create and save custom color themes beyond light/dark." },
      { title: "Streaming Service UI Clone", difficulty: "Major", tech: ["Next.js", "Framer Motion"], description: "Netflix-style horizontally scrolling rows with hover-preview cards." },
      { title: "Accessibility Audit Tool for Web Pages", difficulty: "Advanced Minor", tech: ["React", "axe-core"], description: "Paste a URL or HTML and get a WCAG violation report with fixes." },
      { title: "Micro-frontend Shell with Module Federation", difficulty: "Major", tech: ["Webpack", "React"], description: "Independently deployable feature apps composed into one shell." },
    ],
  },
  {
    name: "Backend Development",
    icon: Server,
    projects: [
      { title: "REST API for a Library Management System", difficulty: "Minor", tech: ["Node.js", "Express", "MongoDB"], description: "CRUD for books, members, and loans with due-date logic." },
      { title: "URL Shortener with Click Analytics", difficulty: "Minor", tech: ["Node.js", "Redis"], description: "Short links with geo/device analytics on every redirect." },
      { title: "Token Bucket Rate Limiter Middleware", difficulty: "Advanced Minor", tech: ["Node.js", "Redis"], description: "Reusable middleware enforcing per-user and per-IP request limits." },
      { title: "Job Queue System with Retry & Backoff", difficulty: "Advanced Minor", tech: ["BullMQ", "Redis"], description: "Background job processing with exponential backoff and dead-letter queues." },
      { title: "Multi-tenant SaaS Backend", difficulty: "Major", tech: ["Postgres", "Row-Level Security"], description: "Isolated tenant data on shared infrastructure with strict RLS policies." },
      { title: "GraphQL Gateway over Multiple REST Services", difficulty: "Major", tech: ["Apollo Server", "REST"], description: "One GraphQL schema stitched together from several internal APIs." },
      { title: "Chunked Upload Service with Resume Support", difficulty: "Advanced Minor", tech: ["Node.js", "S3"], description: "Large file uploads that survive network drops and resume mid-file." },
      { title: "Multi-channel Notification Service", difficulty: "Advanced Minor", tech: ["Node.js", "Nodemailer", "Twilio"], description: "Templated email/SMS/push notifications with delivery tracking." },
      { title: "Event Sourcing & Audit Log System", difficulty: "Major", tech: ["Postgres", "Event Store"], description: "Every state change is an immutable event; current state is derived." },
      { title: "Idempotent Payment Webhook Processor", difficulty: "Advanced Minor", tech: ["Node.js", "Stripe"], description: "Handles duplicate webhook deliveries safely using idempotency keys." },
      { title: "Real-time Chat Backend", difficulty: "Major", tech: ["Socket.io", "Redis Pub/Sub"], description: "Horizontally scalable chat backend with presence and typing indicators." },
      { title: "Role-Based Access Control Engine", difficulty: "Advanced Minor", tech: ["Node.js", "Postgres"], description: "Configurable roles, permissions, and resource-level guards." },
    ],
  },
  {
    name: "Full Stack",
    icon: Layers,
    projects: [
      { title: "Social Media Clone", difficulty: "Major", tech: ["Next.js", "Firebase"], description: "Posts, likes, comments, and a follow graph, built end to end." },
      { title: "Job Board Platform", difficulty: "Major", tech: ["Next.js", "Postgres"], description: "Postings, applications, and recruiter dashboards with advanced search." },
      { title: "Blogging Platform with SEO Built In", difficulty: "Advanced Minor", tech: ["Next.js", "MDX"], description: "Markdown-based blog with sitemap, OpenGraph tags, and RSS." },
      { title: "Online Code Judge", difficulty: "Major", tech: ["Node.js", "Docker", "React"], description: "Submit code, run it in a sandboxed container, auto-grade against test cases." },
      { title: "Appointment & Room Booking System", difficulty: "Advanced Minor", tech: ["Next.js", "Postgres"], description: "Calendar-based booking with conflict detection and reminders." },
      { title: "Shared Expense Tracker", difficulty: "Minor", tech: ["React", "Firebase"], description: "Split bills between friends or roommates with running balances." },
      { title: "Recipe Sharing Platform", difficulty: "Advanced Minor", tech: ["Next.js", "MongoDB"], description: "Upload recipes, rate others, and filter by ingredients on hand." },
      { title: "Freelance Marketplace with Escrow-style Payments", difficulty: "Major", tech: ["Next.js", "Stripe Connect"], description: "Clients post jobs, freelancers bid, funds release on milestone approval." },
      { title: "Mini Learning Management System", difficulty: "Major", tech: ["Next.js", "Postgres"], description: "Courses, lessons, quizzes, and progress tracking for instructors and students." },
      { title: "Event Ticketing Platform with QR Check-in", difficulty: "Major", tech: ["Next.js", "QR Codes"], description: "Sell tickets, generate unique QR codes, and scan them at the door." },
      { title: "Real Estate Listing Portal with Map Search", difficulty: "Advanced Minor", tech: ["Next.js", "Mapbox"], description: "Property listings with map-based filtering and saved searches." },
      { title: "Habit Tracker with Streaks & Reminders", difficulty: "Minor", tech: ["React", "Firebase"], description: "Daily habit check-ins with streak counters and gentle nudges." },
    ],
  },
  {
    name: "AI / Machine Learning",
    icon: BrainCircuit,
    projects: [
      { title: "Sentiment Analysis on Product Reviews", difficulty: "Minor", tech: ["Python", "scikit-learn"], description: "Classify reviews as positive/negative/neutral and visualize trends." },
      { title: "Spam & Fraud Detection Classifier", difficulty: "Minor", tech: ["Python", "scikit-learn"], description: "Detect spam messages or fraudulent transactions from labeled data." },
      { title: "Resume Parser & Job-Fit Scorer", difficulty: "Advanced Minor", tech: ["Python", "NLP"], description: "Extract structured data from resumes and score fit against a job description." },
      { title: "Custom Image Classifier", difficulty: "Minor", tech: ["Python", "TensorFlow"], description: "Train a CNN on your own labeled image set, not just MNIST." },
      { title: "RAG Chatbot over Custom Documents", difficulty: "Major", tech: ["LangChain", "Vector DB"], description: "Chatbot that answers only from a private document set, with citations." },
      { title: "Recommendation Engine", difficulty: "Advanced Minor", tech: ["Python", "Collaborative Filtering"], description: "Suggest products or content based on user-item interaction history." },
      { title: "OCR-based Document Extraction Pipeline", difficulty: "Advanced Minor", tech: ["Python", "Tesseract"], description: "Turn scanned invoices or forms into structured, searchable data." },
      { title: "Handwritten Digit Recognizer with Your Own Canvas", difficulty: "Minor", tech: ["TensorFlow.js"], description: "Draw a digit in the browser and classify it live, no upload needed." },
      { title: "AI Code Review Assistant", difficulty: "Major", tech: ["LLM API", "AST parsing"], description: "Reviews pull requests for bugs, style issues, and missing tests." },
      { title: "Voice-to-Text Meeting Summarizer", difficulty: "Advanced Minor", tech: ["Whisper API", "LLM API"], description: "Transcribes a recording and produces action items and a summary." },
      { title: "Fine-tune a Small LLM for Domain Q&A", difficulty: "Major", tech: ["Python", "LoRA"], description: "Fine-tune an open model on a narrow domain and evaluate it against the base model." },
      { title: "Face Detection & Auto-Blur Privacy Tool", difficulty: "Advanced Minor", tech: ["Python", "OpenCV"], description: "Detect faces in images/video and blur them automatically." },
    ],
  },
  {
    name: "DevOps / Cloud",
    icon: Cloud,
    projects: [
      { title: "CI/CD Pipeline for a Node App", difficulty: "Minor", tech: ["GitHub Actions"], description: "Lint, test, build, and deploy on every push to main." },
      { title: "Dockerize a Multi-service App", difficulty: "Minor", tech: ["Docker Compose"], description: "Frontend, backend, and database running together with one command." },
      { title: "Kubernetes Deployment with Auto-scaling", difficulty: "Major", tech: ["Kubernetes", "HPA"], description: "Deploy an app that scales pods automatically under load." },
      { title: "Infrastructure as Code on AWS", difficulty: "Advanced Minor", tech: ["Terraform", "AWS"], description: "Provision VPC, compute, and database entirely from code." },
      { title: "Centralized Logging Stack", difficulty: "Advanced Minor", tech: ["Grafana Loki", "Promtail"], description: "Aggregate logs from multiple services into one searchable dashboard." },
      { title: "Blue-Green Deployment Pipeline", difficulty: "Major", tech: ["AWS", "GitHub Actions"], description: "Zero-downtime deploys with instant rollback on failure." },
      { title: "Monitoring & Alerting Dashboard", difficulty: "Advanced Minor", tech: ["Prometheus", "Grafana"], description: "Track latency, error rate, and resource usage with alert thresholds." },
      { title: "Self-hosted CI Runner Setup", difficulty: "Minor", tech: ["Docker", "GitHub Actions"], description: "Run your own CI runner instead of relying on hosted minutes." },
      { title: "Secrets Management with Vault", difficulty: "Advanced Minor", tech: ["HashiCorp Vault"], description: "Centralized, access-controlled secrets instead of scattered .env files." },
      { title: "Serverless API on Lambda + API Gateway", difficulty: "Advanced Minor", tech: ["AWS Lambda", "API Gateway"], description: "A pay-per-use API with no servers to manage." },
    ],
  },
  {
    name: "UI / UX Design",
    icon: Palette,
    projects: [
      { title: "Design System & Component Tokens", difficulty: "Minor", tech: ["Figma"], description: "Color, spacing, and type tokens applied consistently across components." },
      { title: "Usability Testing Report for an Existing App", difficulty: "Minor", tech: ["Figma", "User Testing"], description: "Run 5 test sessions on a real app and document friction points." },
      { title: "Redesign Case Study", difficulty: "Advanced Minor", tech: ["Figma"], description: "Before/after redesign of a real product with documented rationale." },
      { title: "Mobile Onboarding Flow Prototype", difficulty: "Minor", tech: ["Figma", "Prototyping"], description: "A 3–5 screen onboarding flow with interactive transitions." },
      { title: "Accessibility-first Redesign", difficulty: "Advanced Minor", tech: ["Figma", "WCAG"], description: "Audit an app against WCAG and redesign the worst offenders." },
      { title: "Dashboard Design for a Data-heavy SaaS", difficulty: "Major", tech: ["Figma"], description: "Information hierarchy and layout for a dense analytics product." },
      { title: "Micro-interaction Prototype Library", difficulty: "Minor", tech: ["Figma", "Framer"], description: "A reusable set of button, toggle, and loading micro-interactions." },
      { title: "Dark Mode Variant of an Existing Design System", difficulty: "Minor", tech: ["Figma"], description: "Extend a light-only design system with a considered dark palette." },
      { title: "Persona-driven App Concept from Scratch", difficulty: "Advanced Minor", tech: ["Figma", "User Research"], description: "Interview real users, build personas, then design around their needs." },
      { title: "Cross-platform Design Kit", difficulty: "Major", tech: ["Figma"], description: "One design language expressed consistently across web and mobile." },
    ],
  },
  {
    name: "Mobile App Development",
    icon: Smartphone,
    projects: [
      { title: "Offline-first To-Do App", difficulty: "Minor", tech: ["React Native"], description: "Works with no connection and syncs once you're back online." },
      { title: "Expense Splitter for Groups", difficulty: "Advanced Minor", tech: ["React Native", "Firebase"], description: "Track shared expenses on a trip and settle up automatically." },
      { title: "Fitness Tracker with Step Counter", difficulty: "Advanced Minor", tech: ["React Native", "Device Sensors"], description: "Uses device motion sensors to track steps and daily activity." },
      { title: "Local Food Delivery App", difficulty: "Major", tech: ["React Native", "Maps"], description: "Browse restaurants, order, and track delivery on a live map." },
      { title: "Chat App with Push Notifications", difficulty: "Major", tech: ["React Native", "Firebase"], description: "1:1 and group messaging with real push notifications." },
      { title: "Weather App with Location & Widgets", difficulty: "Minor", tech: ["React Native", "Weather API"], description: "Location-aware forecasts with a home-screen widget." },
      { title: "Meditation & Habit App", difficulty: "Minor", tech: ["React Native"], description: "Guided sessions, streaks, and scheduled reminders." },
      { title: "QR-based Attendance App", difficulty: "Advanced Minor", tech: ["React Native", "QR Scanner"], description: "Scan a code to mark attendance, with an admin dashboard." },
      { title: "Offline-first Notes App with Conflict Resolution", difficulty: "Major", tech: ["React Native", "CRDTs"], description: "Edits made offline on two devices merge without losing data." },
      { title: "Cross-platform Marketplace App", difficulty: "Major", tech: ["React Native", "Postgres"], description: "Buy and sell listings with chat, search, and payments." },
    ],
  },
  {
    name: "Data Science",
    icon: BarChart3,
    projects: [
      { title: "Exploratory Data Analysis on a Public Dataset", difficulty: "Minor", tech: ["Python", "Pandas"], description: "Clean, explore, and visualize a real-world dataset end to end." },
      { title: "Sales Forecasting with Time Series Models", difficulty: "Advanced Minor", tech: ["Python", "Prophet"], description: "Forecast future sales and quantify uncertainty in the prediction." },
      { title: "Customer Segmentation Dashboard", difficulty: "Advanced Minor", tech: ["Python", "K-Means"], description: "Cluster customers by behavior and visualize each segment's traits." },
      { title: "A/B Test Analysis Simulator", difficulty: "Minor", tech: ["Python", "Statistics"], description: "Simulate experiments and check significance the right way." },
      { title: "Interactive Data Dashboard", difficulty: "Advanced Minor", tech: ["Streamlit", "Plotly"], description: "A shareable dashboard where filters update charts in real time." },
      { title: "Churn Prediction Model with Explainability", difficulty: "Major", tech: ["Python", "SHAP"], description: "Predict churn and explain exactly why each prediction was made." },
      { title: "Web Scraper + Auto-generated Report", difficulty: "Advanced Minor", tech: ["Python", "BeautifulSoup"], description: "Scrapes a site on a schedule and emails a summary report." },
      { title: "Stock Market Trend Analyzer", difficulty: "Minor", tech: ["Python", "Pandas"], description: "Visualize moving averages and trend indicators for chosen tickers." },
      { title: "Geo-spatial Data Visualization", difficulty: "Advanced Minor", tech: ["Python", "GeoPandas"], description: "Map regional data like population density or delivery times." },
      { title: "End-to-end ML Pipeline with Monitoring", difficulty: "Major", tech: ["Python", "MLflow"], description: "Training, deployment, and drift monitoring for a production model." },
    ],
  },
  {
    name: "Cybersecurity",
    icon: ShieldCheck,
    projects: [
      { title: "Password Strength Checker & Breach Lookup", difficulty: "Minor", tech: ["Node.js", "HaveIBeenPwned API"], description: "Scores password strength and checks against known breaches." },
      { title: "Port Scanner & Network Mapper", difficulty: "Minor", tech: ["Python", "Sockets"], description: "Scans a range of ports and reports open services on a host." },
      { title: "Phishing URL Detector", difficulty: "Advanced Minor", tech: ["Python", "ML"], description: "Classifies URLs as phishing or safe using structural features." },
      { title: "Secure File Encryption Tool", difficulty: "Minor", tech: ["Node.js", "AES"], description: "Encrypt and decrypt files locally with a password-derived key." },
      { title: "Vulnerability Scanner for Web Apps", difficulty: "Major", tech: ["Python", "HTTP"], description: "Checks for common issues like missing headers, XSS, and open redirects." },
      { title: "Two-Factor Auth System from Scratch", difficulty: "Advanced Minor", tech: ["Node.js", "TOTP"], description: "Implement TOTP-based 2FA without an off-the-shelf auth provider." },
      { title: "Log-based Intrusion Detection System", difficulty: "Major", tech: ["Python", "ELK"], description: "Flags suspicious patterns like repeated failed logins in real time." },
      { title: "Secure Password Manager", difficulty: "Advanced Minor", tech: ["Electron", "AES"], description: "Locally encrypted vault for storing and generating passwords." },
      { title: "Capture-the-Flag Style Challenge Platform", difficulty: "Major", tech: ["Next.js", "Docker"], description: "Host your own CTF challenges with scoring and leaderboards." },
      { title: "API Security Audit Tool", difficulty: "Advanced Minor", tech: ["Node.js"], description: "Checks an API's auth, rate limits, and headers against best practice." },
    ],
  },
  {
    name: "Blockchain / Web3",
    icon: Link2,
    projects: [
      { title: "ERC-20 Token & Faucet", difficulty: "Minor", tech: ["Solidity", "Hardhat"], description: "Deploy your own token and a faucet that dispenses test amounts." },
      { title: "NFT Minting DApp", difficulty: "Advanced Minor", tech: ["Solidity", "ethers.js"], description: "Mint, view, and transfer NFTs through a connected wallet." },
      { title: "Decentralized Voting System", difficulty: "Advanced Minor", tech: ["Solidity", "React"], description: "Tamper-resistant voting where every ballot is an on-chain transaction." },
      { title: "Crypto Wallet Tracker Dashboard", difficulty: "Minor", tech: ["React", "Web3.js"], description: "Track balances and transaction history across multiple wallets." },
      { title: "Smart Contract Escrow for Freelance Payments", difficulty: "Major", tech: ["Solidity"], description: "Funds release automatically once both parties confirm delivery." },
      { title: "On-chain Certificate Verifier", difficulty: "Major", tech: ["Solidity", "IPFS"], description: "Issue and verify tamper-proof certificates anchored on-chain." },
      { title: "Simple Token-Swap DEX Simulator", difficulty: "Major", tech: ["Solidity", "AMM Math"], description: "A minimal automated market maker for swapping two test tokens." },
      { title: "DAO Governance Mini-Platform", difficulty: "Major", tech: ["Solidity", "React"], description: "Proposal creation, token-weighted voting, and execution." },
      { title: "Supply Chain Tracker on Blockchain", difficulty: "Advanced Minor", tech: ["Solidity"], description: "Track a product's custody chain with an immutable audit trail." },
      { title: "Multi-signature Wallet", difficulty: "Advanced Minor", tech: ["Solidity"], description: "Requires multiple approvals before a transaction executes." },
    ],
  },
  {
    name: "Game Development",
    icon: Gamepad2,
    projects: [
      { title: "2D Platformer with Physics", difficulty: "Minor", tech: ["Phaser"], description: "Jump, gravity, and collision built from first principles." },
      { title: "Multiplayer Tic-Tac-Toe", difficulty: "Minor", tech: ["Socket.io"], description: "Two players, one board, real-time moves over WebSockets." },
      { title: "Chrome-Dino-Style Endless Runner", difficulty: "Minor", tech: ["Canvas API"], description: "An obstacle-dodging endless runner with increasing difficulty." },
      { title: "Turn-based RPG Battle System", difficulty: "Advanced Minor", tech: ["Phaser"], description: "Stats, turn order, skills, and a basic enemy AI." },
      { title: "Procedural Maze Generator & Solver", difficulty: "Advanced Minor", tech: ["JavaScript"], description: "Generates a new maze every time and visualizes the solving algorithm." },
      { title: "Real-time Multiplayer Game with Leaderboard", difficulty: "Major", tech: ["Socket.io", "Redis"], description: "Several players in one live session, ranked on a global leaderboard." },
      { title: "Physics-based Puzzle Game", difficulty: "Advanced Minor", tech: ["Matter.js"], description: "Puzzles solved by manipulating gravity, momentum, and collisions." },
      { title: "3D Mini-golf Game", difficulty: "Major", tech: ["Three.js"], description: "A playable 3D course with camera control and physics-based putting." },
    ],
  },
  {
    name: "Systems & Low-level",
    icon: TerminalSquare,
    projects: [
      { title: "Custom Shell (Mini Bash Clone)", difficulty: "Advanced Minor", tech: ["C", "Python"], description: "Parses commands, handles pipes and redirection, and runs processes." },
      { title: "In-memory Key-Value Store", difficulty: "Advanced Minor", tech: ["Go"], description: "A mini Redis with TTL support and a simple text protocol." },
      { title: "HTTP Server from Raw Sockets", difficulty: "Advanced Minor", tech: ["C", "Sockets"], description: "Parses raw HTTP requests and serves responses without a framework." },
      { title: "Compiler/Interpreter for a Toy Language", difficulty: "Major", tech: ["Python", "Rust"], description: "Lexer, parser, and evaluator for a language you design yourself." },
      { title: "Distributed Task Scheduler", difficulty: "Major", tech: ["Go", "gRPC"], description: "Distributes jobs across worker nodes with failure recovery." },
      { title: "Peer-to-Peer File Sharing Tool", difficulty: "Major", tech: ["Python", "Sockets"], description: "Chunked file transfer directly between peers, no central server." },
      { title: "Mini Version Control System", difficulty: "Major", tech: ["Go"], description: "Implements commit, diff, and branch from scratch, Git-style." },
      { title: "Load Balancer Simulator", difficulty: "Advanced Minor", tech: ["Go"], description: "Round-robin and least-connections strategies against mock backends." },
    ],
  },
];

const ALL_PROJECTS: Project[] = CATEGORIES.flatMap((cat, ci) =>
  cat.projects.map((p, pi) => ({
    ...p,
    id: `${ci}-${pi}`,
    category: cat.name,
  }))
);

const DIFFICULTIES: Difficulty[] = ["Minor", "Advanced Minor", "Major"];

const difficultyStyles: Record<Difficulty, string> = {
  Minor:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/20",
  "Advanced Minor":
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/20",
  Major:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-400/10 dark:text-rose-300 dark:border-rose-400/20",
};

/* ------------------------------------------------------------------ */
/*  Mind-training content                                              */
/* ------------------------------------------------------------------ */

const MIND_PILLARS = [
  {
    icon: Flame,
    title: "Build the daily habit before the big habit",
    body:
      "Consistency beats intensity. A 30-minute session every day compounds far more than a 6-hour binge once a week — you never lose the thread of what you were doing. Anchor it to something that already happens daily (after breakfast, before you open social media) so it doesn't rely on willpower.",
    bullets: [
      "Set a floor, not a ceiling — '30 minutes minimum' is easier to keep than 'code for hours.'",
      "Track the streak visibly. A missed day should feel like an event, not the norm.",
      "Protect the streak on bad days with a tiny version of the habit — even 10 minutes counts.",
    ],
  },
  {
    icon: Puzzle,
    title: "Train logic like a muscle, not a fact",
    body:
      "Logic building isn't about memorizing more syntax — it's pattern recognition earned by struggling through problems before looking at the answer. The struggle is the workout; skipping it skips the gain.",
    bullets: [
      "Give every problem a real 25–30 minute attempt before checking a solution or hint.",
      "After solving something, close the reference and re-implement it from memory the next day.",
      "Explain your solution out loud, step by step, as if teaching it — gaps in the explanation are gaps in understanding.",
    ],
  },
  {
    icon: Wrench,
    title: "Use the Build → Break → Fix loop",
    body:
      "The fastest way to internalize a concept is to build something small with it, break it on purpose, and fix what broke. Debugging your own mistakes teaches more than any tutorial.",
    bullets: [
      "Ship an ugly first version fast, then improve it — don't polish before it works.",
      "When something breaks, form a hypothesis before you Google. Being wrong and finding out why is the lesson.",
      "Keep a running 'bugs I've fixed' log — it becomes your personal pattern library.",
    ],
  },
  {
    icon: Rocket,
    title: "Escape tutorial hell on purpose",
    body:
      "Watching one more tutorial feels productive but rarely builds real skill — it borrows someone else's decisions instead of making your own. The moment you can follow along without pausing the video, you're ready to build without it.",
    bullets: [
      "Cap tutorials at one per new topic, then build a project of your own using it immediately.",
      "Pick projects slightly above your comfort level — enough to force decisions no tutorial covers.",
      "Finish and ship one active project at a time rather than starting five in parallel.",
    ],
  },
];

const WEEKLY_RHYTHM = [
  { day: "Mon–Fri", focus: "Deep work block", detail: "1 focused project session + 2–3 practice problems in Brain Arena" },
  { day: "Saturday", focus: "Ship or review", detail: "Finish a milestone, write a short README/reflection, or do a code review pass" },
  { day: "Sunday", focus: "Reset & plan", detail: "Pick next week's project milestone, revisit one thing that confused you" },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                  */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.03, ease: "easeOut" as const },
  }),
};

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function ProjectsPage() {
  const [tab, setTab] = useState<"projects" | "mind">("projects");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [difficulty, setDifficulty] = useState<string>("All");

  const filtered = useMemo(() => {
    return ALL_PROJECTS.filter((p) => {
      const matchesQuery =
        query.trim() === "" ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.tech.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = category === "All" || p.category === category;
      const matchesDifficulty = difficulty === "All" || p.difficulty === difficulty;
      return matchesQuery && matchesCategory && matchesDifficulty;
    });
  }, [query, category, difficulty]);

  const majorCount = ALL_PROJECTS.filter((p) => p.difficulty === "Major").length;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0e14] text-slate-900 dark:text-slate-100 transition-colors">
      {/* ---------------------------------------------------------- */}
      {/* Hero */}
      {/* ---------------------------------------------------------- */}
      <section className="relative border-b border-slate-200 dark:border-slate-800 bg-[#f7f8fa] dark:bg-[#0d1117]">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="flex items-center gap-2 text-amber-600 dark:text-[#34d399] text-sm font-mono mb-4"
          >
            <FolderKanban size={16} />
            <span>Projects</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            Projects that actually teach you something
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400 text-base md:text-lg"
          >
            {ALL_PROJECTS.length}+ hand-picked projects across {CATEGORIES.length} roles - from
            weekend-sized minors to portfolio-defining majors - plus a practical guide to staying
            consistent and building real logic, not just following steps.
          </motion.p>

          {/* stats */}
          <motion.div
            initial="hidden"
            animate="show"
            custom={3}
            variants={fadeUp}
            className="mt-8 flex flex-wrap gap-3"
          >
            {[
              { label: "Total projects", value: `${ALL_PROJECTS.length}+` },
              { label: "Roles covered", value: CATEGORIES.length },
              { label: "Major capstones", value: majorCount },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0e14] px-4 py-3"
              >
                <div className="text-xl font-bold text-amber-600 dark:text-[#34d399]">{s.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-500">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* tabs */}
          <div className="mt-10 inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0e14] p-1">
            <button
              onClick={() => setTab("projects")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === "projects"
                  ? "bg-amber-500 text-white dark:bg-[#34d399] dark:text-[#0a0e14]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Explore Projects
            </button>
            <button
              onClick={() => setTab("mind")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                tab === "mind"
                  ? "bg-amber-500 text-white dark:bg-[#34d399] dark:text-[#0a0e14]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles size={14} />
              Train Your Mind
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {tab === "projects" ? (
          <motion.section
            key="projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-6xl mx-auto px-6 py-10"
          >
            {/* Filters */}
            <div className="sticky top-0 z-10 -mx-6 px-6 py-4 bg-white/90 dark:bg-[#0a0e14]/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, tech, or keyword…"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-[#f7f8fa] dark:bg-[#0d1117] pl-9 pr-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-[#34d399] placeholder:text-slate-400"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {["All", ...DIFFICULTIES].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      difficulty === d
                        ? "bg-slate-900 text-white border-slate-900 dark:bg-[#34d399] dark:text-[#0a0e14] dark:border-[#34d399]"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {["All", ...CATEGORIES.map((c) => c.name)].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      category === c
                        ? "bg-amber-500 text-white border-amber-500 dark:bg-[#34d399]/20 dark:text-[#34d399] dark:border-[#34d399]/40"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 text-sm text-slate-500 dark:text-slate-500">
              Showing {filtered.length} of {ALL_PROJECTS.length} projects
            </div>

            {/* Grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <motion.article
                  key={p.id}
                  initial="hidden"
                  animate="show"
                  custom={i % 12}
                  variants={fadeUp}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-[#f7f8fa] dark:bg-[#0d1117] p-5 hover:border-amber-400 dark:hover:border-[#34d399]/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wide text-slate-500 dark:text-slate-500">
                      {p.category}
                    </span>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${difficultyStyles[p.difficulty]}`}
                    >
                      {p.difficulty}
                    </span>
                  </div>

                  <h3 className="mt-3 font-semibold leading-snug text-slate-900 dark:text-white">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-white dark:bg-[#0a0e14] border border-slate-200 dark:border-slate-800 px-2 py-0.5 text-[11px] text-slate-600 dark:text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center text-slate-500 dark:text-slate-500">
                No projects match those filters. Try clearing the search or picking "All".
              </div>
            )}
          </motion.section>
        ) : (
          <motion.section
            key="mind"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl mx-auto px-6 py-12"
          >
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold">
                Consistency and logic building, made practical
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                Projects only compound your skill if you keep showing up and if you actually
                wrestle with the hard parts instead of skipping to the answer. Here's a concrete
                way to train both.
              </p>
            </div>

            <div className="space-y-6">
              {MIND_PILLARS.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    custom={i}
                    variants={fadeUp}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#f7f8fa] dark:bg-[#0d1117] p-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-amber-100 dark:bg-[#34d399]/10 p-2 text-amber-600 dark:text-[#34d399]">
                        <Icon size={20} />
                      </div>
                      <h3 className="font-semibold text-lg">{pillar.title}</h3>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {pillar.body}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {pillar.bullets.map((b) => (
                        <li key={b} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2
                            size={16}
                            className="shrink-0 mt-0.5 text-amber-500 dark:text-[#34d399]"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            {/* Weekly rhythm */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={4}
              variants={fadeUp}
              className="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#f7f8fa] dark:bg-[#0d1117] p-6"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 dark:bg-[#34d399]/10 p-2 text-amber-600 dark:text-[#34d399]">
                  <CalendarClock size={20} />
                </div>
                <h3 className="font-semibold text-lg">A simple weekly rhythm</h3>
              </div>
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm">
                  <thead className="bg-white dark:bg-[#0a0e14] text-slate-500 dark:text-slate-500">
                    <tr>
                      <th className="text-left font-medium px-4 py-2">When</th>
                      <th className="text-left font-medium px-4 py-2">Focus</th>
                      <th className="text-left font-medium px-4 py-2">What that looks like</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WEEKLY_RHYTHM.map((row, idx) => (
                      <tr
                        key={row.day}
                        className={
                          idx % 2 === 0
                            ? "bg-[#f7f8fa] dark:bg-[#0d1117]"
                            : "bg-white dark:bg-[#0a0e14]"
                        }
                      >
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                          {row.day}
                        </td>
                        <td className="px-4 py-3 text-amber-600 dark:text-[#34d399] whitespace-nowrap">
                          {row.focus}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {row.detail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Closing note */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={5}
              variants={fadeUp}
              className="mt-8 flex gap-3 rounded-xl border border-amber-200 dark:border-[#34d399]/20 bg-amber-50 dark:bg-[#34d399]/5 p-6"
            >
              <Quote size={20} className="shrink-0 text-amber-600 dark:text-[#34d399] mt-0.5" />
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Pick one project from the list above that's slightly harder than what you're
                comfortable with, give it a real deadline, and finish it before starting the next
                one. Depth on a few projects builds more logic than breadth across many
                half-finished ones.
              </p>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}