"use client";

import { useState, type ElementType, type ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  FileText,
  Sparkles,
  Search,
  Briefcase,
  Bot,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  LayoutTemplate,
  Layers,
  ChevronRight,
  Download,
  Quote,
  Target,
  ShieldCheck,
  Clock,
  Zap,
  ChevronDown,
} from "lucide-react";

/* ---------------------------------------------------------
   CodeNFacts — Resume Tips
   Theming: CSS custom properties, driven by the header's
   dark-mode toggle (Tailwind darkMode: "class"). No local
   theme state — light = white/#f7f8fa panels + amber accent,
   dark = #0a0e14/#0d1117 panels + emerald accent.
--------------------------------------------------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

type SectionId =
  | "why"
  | "anatomy"
  | "build"
  | "keywords"
  | "hiring"
  | "ai"
  | "dos-donts"
  | "mistakes"
  | "maintain"
  | "templates";

const NAV: { id: SectionId; label: string; icon: ElementType }[] = [
  { id: "why", label: "Why a Resume Matters", icon: FileText },
  { id: "anatomy", label: "Anatomy of a Resume", icon: Layers },
  { id: "build", label: "Building It, Step by Step", icon: Sparkles },
  { id: "keywords", label: "Keywords & ATS/SEO", icon: Search },
  { id: "hiring", label: "The Hiring Process", icon: Briefcase },
  { id: "ai", label: "Using AI the Right Way", icon: Bot },
  { id: "dos-donts", label: "Do's & Don'ts", icon: ShieldCheck },
  { id: "mistakes", label: "Common Mistakes", icon: AlertTriangle },
  { id: "maintain", label: "Maintaining Your Resume", icon: RefreshCw },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
];

/* ---------------- Data ---------------- */

const anatomySections = [
  {
    title: "Header",
    detail:
      "Name, phone, email, city/state, LinkedIn, GitHub/portfolio. Keep it one line if you can — recruiters scan this in under 2 seconds.",
  },
  {
    title: "Summary (optional, 2–3 lines)",
    detail:
      "Only include if you're changing careers or have 3+ years experience. Skip it as a fresher — let your projects speak.",
  },
  {
    title: "Skills",
    detail:
      "Group by category: Languages, Frameworks, Tools, Databases. Match the exact wording used in the job description.",
  },
  {
    title: "Experience / Internships",
    detail:
      "Reverse-chronological. Each bullet: action verb + what you built + measurable impact. Never just list duties.",
  },
  {
    title: "Projects",
    detail:
      "For students/freshers, this is your strongest section. Include a live link or GitHub repo for every project you list.",
  },
  {
    title: "Education",
    detail:
      "Degree, institution, graduation year, CGPA (if above 7/10 or 3.0/4.0). Relevant coursework only if you lack experience.",
  },
  {
    title: "Certifications & Achievements",
    detail:
      "Only include certifications relevant to the role. Hackathon wins, competitive programming ranks, and open-source contributions belong here.",
  },
];

const buildSteps = [
  {
    step: "01",
    title: "Start from the job, not a blank page",
    detail:
      "Pick 2–3 job descriptions in your target role. Highlight repeated skills and phrases — this becomes your outline before you write a single bullet.",
  },
  {
    step: "02",
    title: "Draft in plain text first",
    detail:
      "Write every bullet in a plain doc with zero formatting. Formatting too early makes you edit less and settle for weak bullets that merely 'fit'.",
  },
  {
    step: "03",
    title: "Use the STAR-in-reverse bullet formula",
    detail:
      "Lead with the result, then the action: 'Cut page load time by 40% by lazy-loading below-the-fold images in a React dashboard.' Result first pulls the eye.",
  },
  {
    step: "04",
    title: "Quantify everything you can",
    detail:
      "Users, %, time saved, revenue, team size, lines of test coverage. No number available? Use scale words: 'across 12 microservices', 'for 500+ daily users'.",
  },
  {
    step: "05",
    title: "Design last, and design boring",
    detail:
      "One font family, one accent color, consistent margins. ATS parsers and human reviewers both prefer a resume that looks unremarkable and reads perfectly.",
  },
  {
    step: "06",
    title: "Export and stress-test",
    detail:
      "Export to PDF, open it on a phone, and paste it into a plain text editor. If the text editor scrambles your layout, an ATS probably will too.",
  },
];

const keywordCategories = [
  {
    title: "Role keywords",
    items: ["Frontend Developer", "React.js", "TypeScript", "REST APIs", "Responsive Design"],
  },
  {
    title: "Tool & stack keywords",
    items: ["Next.js", "Node.js", "Firebase", "Git/GitHub", "Docker", "Tailwind CSS"],
  },
  {
    title: "Soft-skill keywords (used sparingly)",
    items: ["Cross-functional collaboration", "Code review", "Mentorship", "Agile/Scrum"],
  },
  {
    title: "Action verbs that pass ATS parsing",
    items: ["Built", "Shipped", "Automated", "Optimized", "Designed", "Migrated", "Led"],
  },
];

const seoPoints = [
  "ATS software scans for exact keyword matches — 'JS' and 'JavaScript' are not always treated as the same token, so use the full term at least once.",
  "Mirror section headers ATS expects: 'Experience', 'Education', 'Skills' — creative headers like 'My Journey' can get skipped by parsers entirely.",
  "Keyword-stuff nothing. A resume that reads like a list of buzzwords fails the human review even if it clears the ATS filter.",
  "Save as PDF from a text-based editor (not a scanned image) so the text layer stays selectable and parseable.",
  "Tailor keywords per application — a generic resume sent to 50 companies performs worse than 10 tailored ones.",
];

const hiringSteps = [
  {
    title: "ATS Screening",
    detail:
      "Your resume is parsed by software before a human sees it. It's ranked against the job description's keywords and requirements.",
    icon: Search,
  },
  {
    title: "Recruiter Skim",
    detail:
      "If you pass the filter, a recruiter spends roughly 6–10 seconds on a first pass, scanning title, companies, and formatting.",
    icon: Clock,
  },
  {
    title: "Hiring Manager Review",
    detail:
      "A deeper read against the actual team's needs — this is where specific projects and measurable impact matter most.",
    icon: Target,
  },
  {
    title: "Interview Shortlist",
    detail:
      "Your resume becomes the interviewer's script. Every bullet you write is a question you're inviting them to ask — only write what you can defend.",
    icon: Briefcase,
  },
  {
    title: "Offer & Negotiation",
    detail:
      "Consistency matters here — the story your resume tells should match what you said in interviews and what references confirm.",
    icon: Zap,
  },
];

const aiUses = [
  {
    title: "Where AI genuinely helps",
    good: true,
    items: [
      "Tightening a wordy bullet into an action-verb + result sentence",
      "Suggesting role-specific keywords to check your resume against a job description",
      "Catching grammar, tense consistency, and passive voice",
      "Generating a first-draft outline you then rewrite in your own voice",
    ],
  },
  {
    title: "Where AI hurts more than it helps",
    good: false,
    items: [
      "Letting a tool invent metrics or achievements you can't back up in an interview",
      "Copy-pasting a fully AI-generated resume without editing — recruiters increasingly recognize the tell-tale generic phrasing",
      "Using AI to answer for skills you don't actually have",
      "Relying on AI as your only proofreader — always do one human pass yourself",
    ],
  },
];

const dosList = [
  "Tailor your resume for every single application",
  "Keep it to one page unless you have 8+ years of experience",
  "Use consistent verb tense (past roles = past tense, current role = present)",
  "Lead every bullet with an action verb",
  "Include a link to your GitHub, portfolio, or live projects",
  "Proofread out loud — your ear catches what your eye skips",
];

const dontsList = [
  "Don't use a photo, unless the region/industry norm explicitly expects one",
  "Don't list responsibilities without outcomes",
  "Don't use more than one font family or more than one accent color",
  "Don't include an objective statement that says nothing role-specific",
  "Don't list every technology you've ever touched — only what's relevant",
  "Don't submit without exporting to PDF and checking it opens cleanly",
];

const mistakes = [
  {
    title: "Writing duties instead of impact",
    detail:
      "'Worked on the login page' tells a recruiter nothing. 'Rebuilt the login flow, cutting auth errors by 30%' tells them everything.",
  },
  {
    title: "One resume for every job",
    detail:
      "Sending the same file to a frontend role and a DevOps role signals you didn't read the posting.",
  },
  {
    title: "Burying the strongest project",
    detail:
      "Recruiters read top-down. Your best, most relevant project should never be third or fourth in the list.",
  },
  {
    title: "Inconsistent formatting",
    detail:
      "Mismatched date formats, bullet styles, or spacing read as carelessness — even when the content is strong.",
  },
  {
    title: "Overexplaining basic tools",
    detail: "You don't need a bullet explaining what Git is. List it as a skill and move on.",
  },
  {
    title: "Typos in the first third of the page",
    detail:
      "Most reviewers stop reading carefully after the first error. Proofread the top of the page hardest.",
  },
];

const maintenanceTips = [
  {
    title: "Update it the week something happens",
    detail:
      "Finished a project, got a certification, led a team? Add the bullet immediately — memory of the exact metric fades fast.",
  },
  {
    title: "Review every 3 months, even if not job hunting",
    detail:
      "A quarterly check keeps the resume ready to send on short notice, and forces you to reflect on what you actually shipped.",
  },
  {
    title: "Archive old bullets, don't delete them",
    detail:
      "Keep a 'master resume' with everything you've ever done. Trim down to a tailored one-pager per application from that master copy.",
  },
  {
    title: "Re-verify links every few months",
    detail:
      "Portfolio redesigns and repo renames break links quietly. A dead GitHub link costs more trust than a modest project.",
  },
];

const templates = [
  {
    name: "Minimal ATS-Safe",
    tag: "Best for: Freshers & Internships",
    desc: "Single column, no tables or graphics, generous white space. Built to pass every parser.",
  },
  {
    name: "Project-Forward",
    tag: "Best for: Frontend / AI-ML roles",
    desc: "Projects promoted above experience, with room for tech-stack tags per project.",
  },
  {
    name: "Two-Column Compact",
    tag: "Best for: 2–5 years experience",
    desc: "Skills and certifications in a narrow left rail, experience and impact in the main column.",
  },
  {
    name: "Academic / Research",
    tag: "Best for: Research roles, higher studies",
    desc: "Publications, coursework, and lab work given dedicated sections above general experience.",
  },
  {
    name: "Design/UI-UX Portfolio Resume",
    tag: "Best for: UI/UX track",
    desc: "One accent color, a case-study style project section, and a link-first layout for visual portfolios.",
  },
  {
    name: "DevOps / Infra Focus",
    tag: "Best for: DevOps track",
    desc: "Infrastructure, uptime, and automation metrics front and center, with a tools/CI-CD skills grid.",
  },
];

/* ---------------- Small building blocks ---------------- */

function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-6 sm:mb-8">
      <span className="text-xs font-semibold tracking-widest uppercase text-[var(--accent)]">
        {eyebrow}
      </span>
      <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)] leading-snug">
        {title}
      </h2>
      {desc && (
        <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          {desc}
        </p>
      )}
    </motion.div>
  );
}

function Card({
  children,
  index = 0,
  className = "",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={index}
      className={`rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-5 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Section renderers ---------------- */

function WhySection() {
  return (
    <div>
      <SectionHeading
        eyebrow="The Basics"
        title="Why you actually need a good resume"
        desc="Your resume is the single artifact that decides whether a human ever reads your name. Before a portfolio link is clicked or a GitHub repo is opened, the resume has already made the first call."
      />
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-3">
        <Card index={0}>
          <Quote className="h-5 w-5 text-[var(--accent)] mb-2" />
          <h3 className="font-semibold text-[var(--text-primary)]">It's a filter, not a biography</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            Companies use it to eliminate candidates fast, not to learn your life story. Every line should
            survive the question: "does this help me pass the filter?"
          </p>
        </Card>
        <Card index={1}>
          <Target className="h-5 w-5 text-[var(--accent)] mb-2" />
          <h3 className="font-semibold text-[var(--text-primary)]">It sets the interview agenda</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            Interviewers ask questions based on what's written. A strong, specific resume steers the
            conversation toward the topics you're most prepared to talk about.
          </p>
        </Card>
        <Card index={2}>
          <Zap className="h-5 w-5 text-[var(--accent)] mb-2" />
          <h3 className="font-semibold text-[var(--text-primary)]">It compounds over time</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            A resume you maintain continuously is always ready for a sudden opportunity. One you rebuild
            from scratch each time costs you the fastest-moving roles.
          </p>
        </Card>
      </div>
    </div>
  );
}

function AnatomySection() {
  return (
    <div>
      <SectionHeading
        eyebrow="Structure"
        title="The anatomy of a resume"
        desc="Order and section choice matter as much as the words inside them. Here's what each part is actually for."
      />
      <div className="space-y-3">
        {anatomySections.map((s, i) => (
          <Card key={s.title} index={i} className="flex gap-3 sm:gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] font-semibold text-sm">
              {i + 1}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--text-primary)]">{s.title}</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">{s.detail}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BuildSection() {
  return (
    <div>
      <SectionHeading
        eyebrow="From Zero to Sent"
        title="Building a resume, step by step"
        desc="A resume is easiest to write in this order — most people struggle because they design before they've written a single strong bullet."
      />
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
        {buildSteps.map((s, i) => (
          <Card key={s.step} index={i}>
            <span className="text-2xl sm:text-3xl font-bold text-[var(--accent-soft-text)]">{s.step}</span>
            <h3 className="mt-1.5 sm:mt-2 font-semibold text-[var(--text-primary)]">{s.title}</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">{s.detail}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function KeywordsSection() {
  return (
    <div>
      <SectionHeading
        eyebrow="Getting Found"
        title="Keywords, ATS & resume SEO"
        desc="Most mid-size and large companies run resumes through an Applicant Tracking System before a human sees them. Treat your resume like a page you're optimizing to be found."
      />
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 mb-4 sm:mb-6">
        {keywordCategories.map((c, i) => (
          <Card key={c.title} index={i}>
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">{c.title}</h3>
            <div className="flex flex-wrap gap-2">
              {c.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 sm:px-3 py-1 text-xs text-[var(--text-secondary)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <Card index={4}>
        <h3 className="font-semibold text-[var(--text-primary)] mb-3">ATS & SEO rules that matter</h3>
        <ul className="space-y-2.5">
          {seoPoints.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-[var(--text-secondary)]">
              <Search className="h-4 w-4 flex-shrink-0 mt-0.5 text-[var(--accent)]" />
              <span className="leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function HiringSection() {
  return (
    <div>
      <SectionHeading
        eyebrow="Behind the Scenes"
        title="Where your resume goes after you hit submit"
        desc="Understanding the pipeline changes how you write every line — you're writing for five different readers, not one."
      />
      <div className="relative space-y-3 sm:space-y-4">
        {hiringSteps.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} index={i} className="flex gap-3 sm:gap-4 items-start">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--accent)]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-[var(--text-primary)]">{s.title}</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">{s.detail}</p>
              </div>
              {i < hiringSteps.length - 1 && (
                <ChevronRight className="ml-auto h-4 w-4 text-[var(--text-secondary)] hidden md:block flex-shrink-0" />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AiSection() {
  return (
    <div>
      <SectionHeading
        eyebrow="Modern Tooling"
        title="Using AI to help — without letting it lie for you"
        desc="AI tools are genuinely useful for resumes when they edit your real experience. They become a liability the moment they start inventing it."
      />
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
        {aiUses.map((group, i) => (
          <Card key={group.title} index={i}>
            <div className="flex items-center gap-2 mb-3">
              {group.good ? (
                <CheckCircle2 className="h-5 w-5 text-[var(--accent)] flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-[var(--danger)] flex-shrink-0" />
              )}
              <h3 className="font-semibold text-[var(--text-primary)]">{group.title}</h3>
            </div>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item} className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  • {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DosDontsSection() {
  return (
    <div>
      <SectionHeading
        eyebrow="Quick Reference"
        title="Do's and don'ts"
        desc="A fast checklist to run your resume against before you send it anywhere."
      />
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
        <Card index={0}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-[var(--accent)] flex-shrink-0" />
            <h3 className="font-semibold text-[var(--text-primary)]">Do</h3>
          </div>
          <ul className="space-y-2">
            {dosList.map((d) => (
              <li key={d} className="text-sm text-[var(--text-secondary)] leading-relaxed">
                • {d}
              </li>
            ))}
          </ul>
        </Card>
        <Card index={1}>
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="h-5 w-5 text-[var(--danger)] flex-shrink-0" />
            <h3 className="font-semibold text-[var(--text-primary)]">Don't</h3>
          </div>
          <ul className="space-y-2">
            {dontsList.map((d) => (
              <li key={d} className="text-sm text-[var(--text-secondary)] leading-relaxed">
                • {d}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function MistakesSection() {
  return (
    <div>
      <SectionHeading
        eyebrow="Learn From Others"
        title="Mistakes most candidates make"
        desc="These show up across hundreds of resumes we review each internship cycle — check yours against each one."
      />
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
        {mistakes.map((m, i) => (
          <Card key={m.title} index={i} className="flex gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-[var(--warning)] mt-0.5" />
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--text-primary)]">{m.title}</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">{m.detail}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MaintainSection() {
  return (
    <div>
      <SectionHeading
        eyebrow="Long-Term Habit"
        title="Maintaining your resume"
        desc="A resume isn't a one-time document — treat it like a living file that grows alongside your work."
      />
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
        {maintenanceTips.map((t, i) => (
          <Card key={t.title} index={i}>
            <RefreshCw className="h-5 w-5 text-[var(--accent)] mb-2" />
            <h3 className="font-semibold text-[var(--text-primary)]">{t.title}</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">{t.detail}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TemplatesSection() {
  return (
    <div>
      <SectionHeading
        eyebrow="Ready to Use"
        title="Resume templates"
        desc="Pick the layout that matches your track and experience level. Every template below is ATS-safe: single column parsing, no embedded tables or text boxes."
      />
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t, i) => (
          <Card key={t.name} index={i} className="flex flex-col">
            <div className="flex h-24 sm:h-28 items-center justify-center rounded-lg bg-[var(--surface)] border border-[var(--border)] mb-3 sm:mb-4">
              <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-[var(--accent)]" />
            </div>
            <span className="text-xs font-medium text-[var(--accent)]">{t.tag}</span>
            <h3 className="mt-1 font-semibold text-[var(--text-primary)]">{t.name}</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed flex-1">{t.desc}</p>
            <button
              type="button"
              className="mt-3 sm:mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              Use this template
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

const SECTION_MAP: Record<SectionId, ReactNode> = {
  why: <WhySection />,
  anatomy: <AnatomySection />,
  build: <BuildSection />,
  keywords: <KeywordsSection />,
  hiring: <HiringSection />,
  ai: <AiSection />,
  "dos-donts": <DosDontsSection />,
  mistakes: <MistakesSection />,
  maintain: <MaintainSection />,
  templates: <TemplatesSection />,
};

/* ---------------- Page ---------------- */

export default function ResumeTipsPage() {
  const [active, setActive] = useState<SectionId>("why");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeNav = NAV.find((n) => n.id === active)!;
  const ActiveIcon = activeNav.icon;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] transition-colors">
      <style jsx global>{`
        :root {
          --bg: #f7f8fa;
          --panel: #ffffff;
          --surface: #f7f8fa;
          --border: #e5e7eb;
          --text-primary: #0f172a;
          --text-secondary: #475569;
          --accent: #b45309;
          --accent-soft: #fef3e2;
          --accent-soft-text: #d9a24b;
          --danger: #dc2626;
          --warning: #d97706;
        }
        .dark {
          --bg: #0a0e14;
          --panel: #0d1117;
          --surface: #10151d;
          --border: #1f2733;
          --text-primary: #e6edf3;
          --text-secondary: #8b98a5;
          --accent: #34d399;
          --accent-soft: rgba(52, 211, 153, 0.1);
          --accent-soft-text: #34d399;
          --danger: #f87171;
          --warning: #fbbf24;
        }
      `}</style>

      {/* Terminal-chrome header strip */}
      <div className="border-b border-[var(--border)] bg-[var(--panel)]">
        <div className="mx-auto max-w-6xl px-4 py-2.5 sm:py-3 flex items-center gap-2">
          <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 sm:ml-3 text-xs font-mono text-[var(--text-secondary)] truncate">
            CodeNFacts Resume Tips
          </span>
        </div>
      </div>

      {/* Hero */}
      <div className="border-b border-[var(--border)] bg-[var(--panel)]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10 md:py-12">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
              <Sparkles className="h-3.5 w-3.5" />
              Resume Tips
            </span>
            <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              Write a resume that gets past the filter - and holds up in the room
            </h1>
            <p className="mt-2.5 sm:mt-3 max-w-2xl text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              Everything from structure and keywords to the hiring pipeline, AI tools, and
              ready-to-use templates - built for CodeNFacts interns and learners preparing
              for real applications.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Body: sidebar + content */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 grid gap-5 sm:gap-6 md:gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
        {/* Mobile nav dropdown */}
        <div className="md:hidden relative">
          <button
            type="button"
            onClick={() => setMobileNavOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-left shadow-sm"
            aria-expanded={mobileNavOpen}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <ActiveIcon className="h-4 w-4 flex-shrink-0 text-[var(--accent)]" />
              <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                {activeNav.label}
              </span>
            </span>
            <ChevronDown
              className={`h-4 w-4 flex-shrink-0 text-[var(--text-secondary)] transition-transform duration-200 ${
                mobileNavOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {mobileNavOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-[60vh] overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--panel)] py-1.5 shadow-lg"
              >
                {NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActive(item.id);
                        setMobileNavOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left transition-colors ${
                        isActive
                          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop sidebar nav */}
        <aside className="hidden md:block md:sticky md:top-6 md:self-start">
          <nav className="flex flex-col gap-0.5">
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-left transition-colors ${
                    isActive
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="leading-snug">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Active section content */}
        <main className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {SECTION_MAP[active]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}