"use client";

import { motion } from "framer-motion";
import {
  Terminal,
  ShieldCheck,
  Database,
  Cookie,
  Share2,
  UserCog,
  Baby,
  RefreshCcw,
  Mail,
} from "lucide-react";
import Link from "next/link";

// TODO(backend): keep this in sync with your actual data practices; review with a lawyer before publishing publicly
const LAST_UPDATED = "July 4, 2026";

type Section = {
  id: string;
  title: string;
  icon: typeof ShieldCheck;
  content: React.ReactNode;
};

const SECTIONS: Section[] = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    icon: Database,
    content: (
      <>
        <p>
          When you create a CodeNFacts account, we collect information such
          as your name, email address, and username. If you sign up with
          Google or GitHub, we receive basic profile details (name, email,
          profile photo) from those providers.
        </p>
        <p>
          As you use the platform, we may also collect content you create —
          posts, comments, messages, achievements, and uploaded files like
          PDFs or resumes — along with usage data such as which tutorials,
          problems, or Brain Arena games you interact with.
        </p>
        {/* TODO(backend): list any analytics/telemetry providers here if added later */}
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How We Use Your Information",
    icon: UserCog,
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Create and maintain your account and profile</li>
          <li>Provide core features like Brain Arena, tracks, and Connect</li>
          <li>
            Verify your identity during sign-up (via email verification
            codes) and secure your account
          </li>
          <li>
            Analyse resumes you choose to submit through our Resume Analyser
            feature, using the Gemini API, solely to generate feedback for
            you
          </li>
          <li>Communicate updates, verification codes, or support replies</li>
          <li>Improve and troubleshoot the platform</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </>
    ),
  },
  {
    id: "cookies-and-local-storage",
    title: "Cookies & Local Storage",
    icon: Cookie,
    content: (
      <>
        <p>
          CodeNFacts uses your browser&apos;s local storage to remember
          things like your login state and your progress in Brain Arena
          games (for example, Code Detective and Algorithm Race scores).
          This data stays on your device and is not automatically shared
          with our servers unless a feature explicitly says so.
        </p>
        <p>
          We may use cookies or similar technologies for essential site
          functionality, such as keeping you signed in. We do not use
          cookies for third-party advertising.
        </p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    icon: Share2,
    content: (
      <>
        <p>CodeNFacts relies on the following third-party services to operate:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-gray-900 dark:text-white">
              Firebase (Authentication, Firestore, Storage)
            </strong>{" "}
            - for account management, data storage, and file uploads
          </li>
          <li>
            <strong className="text-gray-900 dark:text-white">
              Google & GitHub OAuth
            </strong>{" "}
            - for optional sign-in methods
          </li>
        </ul>
        <p>
          Each of these providers has its own privacy practices, and we
          encourage you to review them where relevant.
        </p>
        {/* TODO(backend): add links to each provider's privacy policy */}
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your Rights & Choices",
    icon: ShieldCheck,
    content: (
      <>
        <p>You can:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Access and update your profile information at any time</li>
          <li>Request deletion of your account and associated data</li>
          <li>Opt out of non-essential communications</li>
          <li>Ask us what personal data we hold about you</li>
        </ul>
        {/* TODO(backend): replace with your actual data-request/contact process */}
        <p>
          To make any of these requests, contact us using the details at the
          bottom of this page.
        </p>
      </>
    ),
  },
  {
    id: "childrens-privacy",
    title: "Children's Privacy",
    icon: Baby,
    content: (
      <p>
        CodeNFacts is intended for students and professionals and is not
        directed at children under 13. We do not knowingly collect personal
        information from children under 13. If you believe a child has
        provided us with personal information, please contact us so we can
        remove it.
      </p>
    ),
  },
  {
    id: "changes-to-this-policy",
    title: "Changes to This Policy",
    icon: RefreshCcw,
    content: (
      <p>
        We may update this Privacy Policy from time to time as CodeNFacts
        grows. We&apos;ll update the &quot;last updated&quot; date above
        whenever changes are made, and significant changes will be
        communicated through the platform.
      </p>
    ),
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

export default function PrivacyPolicyPage() {
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
            privacy-policy...
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Privacy <span className="text-emerald-500">Policy</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400"
          >
            This page explains what information CodeNFacts collects, how we
            use it, and the choices you have.
          </motion.p>

          <motion.p
            initial="hidden"
            animate="show"
            custom={3}
            variants={fadeUp}
            className="mt-4 font-mono text-xs text-gray-400 dark:text-gray-500"
          >
            Last updated: {LAST_UPDATED}
          </motion.p>
        </div>
      </section>

      {/* Sections */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-8">
          {SECTIONS.map((section, i) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-white/10"
            >
              <TerminalChrome label={`${section.id}.md`} />
              <div className="bg-white p-6 dark:bg-[#0d1117] sm:p-8">
                <div className="mb-4 flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {section.content}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
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
            Questions about your data?
          </h2>
          <p className="max-w-md text-gray-600 dark:text-gray-400">
            Reach out and we&apos;ll help you access, update, or delete your
            information.
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