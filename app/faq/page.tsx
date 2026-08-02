"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  HelpCircle,
  ChevronDown,
  GraduationCap,
  Gamepad2,
  Users2,
  ShieldCheck,
  Mail,
} from "lucide-react";
import Link from "next/link";

type FaqItem = {
  id: string;
  q: string;
  a: string;
};

type FaqCategory = {
  id: string;
  title: string;
  icon: typeof HelpCircle;
  items: FaqItem[];
};

// TODO(backend): move FAQ content to Firestore / CMS so it can be edited without a redeploy
const CATEGORIES: FaqCategory[] = [
  {
    id: "general",
    title: "General",
    icon: HelpCircle,
    items: [
      {
        id: "what-is-codenfacts",
        q: "What is CodeNFacts?",
        a: "CodeNFacts is a mentor-led learning platform that combines structured internship tracks, hands-on coding practice, and a community space so you can learn by actually building things instead of just watching tutorials.",
      },
      {
        id: "who-is-it-for",
        q: "Who is CodeNFacts for?",
        a: "Students and early-career developers who want practical, guided experience — whether that's your first line of code or you're preparing for interviews and internships.",
      },
      {
        id: "is-it-free",
        q: "Is CodeNFacts free to use?",
        a: "Core features like the Brain Arena practice games, tutorials, and community feed are free. Some mentor-led internship tracks may have limited seats or eligibility requirements.",
      },
    ],
  },
  {
    id: "internships",
    title: "Internships & Tracks",
    icon: GraduationCap,
    items: [
      {
        id: "which-tracks",
        q: "What internship tracks are available?",
        a: "We currently run four tracks: UI/UX Design, Frontend Engineering, AI Engineering, and DevOps. Each is mentor-guided and built around real project work.",
      },
      {
        id: "how-to-apply",
        q: "How do I apply for an internship track?",
        a: "Sign up for a CodeNFacts account, complete your profile, and apply through the internship section. Our mentors review applications and reach out with next steps.",
      },
      {
        id: "certificate",
        q: "Do I get a certificate after completing a track?",
        a: "Yes. Learners who complete the assignments and milestones for their track receive a completion certificate signed by their mentor.",
      },
    ],
  },
  {
    id: "brain-arena",
    title: "Brain Arena & Practice",
    icon: Gamepad2,
    items: [
      {
        id: "what-is-brain-arena",
        q: "What is the Brain Arena?",
        a: "Brain Arena is our practice hub with interactive coding games like Code Detective (spot-the-bug challenges) and Algorithm Race (timed algorithm-selection rounds), plus a large bank of DSA and coding problems.",
      },
      {
        id: "progress-saved",
        q: "Is my progress saved?",
        a: "Yes, your progress in Brain Arena games is saved locally in your browser. We're working on syncing this to your account so it follows you across devices.",
      },
      {
        id: "how-many-problems",
        q: "How many coding problems are available?",
        a: "The problem bank currently spans thousands of questions across difficulty levels and topics, with new ones added regularly.",
      },
    ],
  },
  {
    id: "community",
    title: "CodeNFacts Connect",
    icon: Users2,
    items: [
      {
        id: "what-is-connect",
        q: "What is CodeNFacts Connect?",
        a: "Connect is our community space where learners and mentors share progress, post achievements, ask questions, and follow each other's work — like a feed built specifically for people learning to code.",
      },
      {
        id: "find-mentors",
        q: "Can I message mentors directly?",
        a: "Yes, once you're connected, you can message mentors and other learners directly through the platform.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Technical",
    icon: ShieldCheck,
    items: [
      {
        id: "signup-methods",
        q: "How can I sign up?",
        a: "You can sign up with an email address or continue with Google or GitHub. Email sign-ups require a quick verification step.",
      },
      {
        id: "forgot-password",
        q: "I forgot my password. What do I do?",
        a: "Use the 'Forgot password' link on the login page to reset it via your registered email address.",
      },
      {
        id: "data-safety",
        q: "Is my data safe on CodeNFacts?",
        a: "We use standard security rules to protect your account and data. We never share your personal information with third parties.",
      },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

function TerminalChrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-white/10 dark:bg-white/5">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
      <span className="ml-2 font-mono text-xs text-gray-400 dark:text-gray-500">
        {label}
      </span>
    </div>
  );
}

function AccordionRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200 last:border-b-0 dark:border-white/10">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50 dark:hover:bg-white/[0.03]"
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {item.q}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-emerald-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(
    CATEGORIES[0]?.items[0]?.id ?? null
  );

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-[#0a0e14] dark:text-gray-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-white/10">
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] [background-size:32px_32px] dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]" />

        <div className="relative mx-auto max-w-4xl px-6 py-16 sm:py-24">
          <motion.div
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 font-mono text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          >
            <Terminal className="h-3.5 w-3.5" />
            faq.section
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Frequently Asked <span className="text-emerald-500">Questions</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400"
          >
            Everything you need to know about tracks, practice, and the
            CodeNFacts community. Can&apos;t find your answer? Reach out and
            we&apos;ll help directly.
          </motion.p>
        </div>
      </section>

      {/* FAQ categories */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-10">
          {CATEGORIES.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={catIndex}
              variants={fadeUp}
            >
              <div className="mb-4 flex items-center gap-2">
                <category.icon className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.title}
                </h2>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-white/10">
                <TerminalChrome label={`${category.id}.faq`} />
                <div className="bg-white dark:bg-[#0d1117]">
                  {category.items.map((item) => (
                    <AccordionRow
                      key={item.id}
                      item={item}
                      isOpen={openId === item.id}
                      onToggle={() => toggle(item.id)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Still have questions CTA */}
      <section className="border-t border-gray-200 dark:border-white/10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-16 text-center"
        >
          <Mail className="h-6 w-6 text-emerald-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Still have questions?
          </h2>
          <p className="max-w-md text-gray-600 dark:text-gray-400">
            We're happy to help — reach out and a mentor from our team will
            get back to you.
          </p>
          {/* TODO(backend): point this at the real support/contact route or mailto address */}
          <Link
            href="/contact"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition hover:bg-emerald-600"
          >
            Contact Us
          </Link>
        </motion.div>
      </section>
    </main>
  );
}