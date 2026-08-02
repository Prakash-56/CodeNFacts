"use client";

import { motion } from "framer-motion";
import {
  Terminal,
  FileText,
  UserCheck,
  Ban,
  Copyright,
  GraduationCap,
  AlertTriangle,
  ShieldOff,
  Gavel,
  RefreshCcw,
  Mail,
} from "lucide-react";
import Link from "next/link";

// TODO(backend): keep this in sync with real changes; have a lawyer review before publishing publicly
const LAST_UPDATED = "July 4, 2026";

type Section = {
  id: string;
  title: string;
  icon: typeof FileText;
  content: React.ReactNode;
};

const SECTIONS: Section[] = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
    icon: FileText,
    content: (
      <p>
        By creating an account or using CodeNFacts in any way, you agree to
        these Terms and Conditions. If you do not agree, please do not use
        the platform. We may update these terms occasionally, and continued
        use after changes means you accept the updated terms.
      </p>
    ),
  },
  {
    id: "accounts",
    title: "Accounts & Eligibility",
    icon: UserCheck,
    content: (
      <>
        <p>
          You must provide accurate information when creating an account and
          keep your login credentials secure. You&apos;re responsible for
          all activity that happens under your account.
        </p>
        <p>
          CodeNFacts is intended for students and professionals. If you are
          under the age of majority in your jurisdiction, you should have a
          parent or guardian review these terms with you before signing up.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    icon: Ban,
    content: (
      <>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Harass, impersonate, or abuse other learners or mentors</li>
          <li>
            Post spam, malware, or content that infringes someone else&apos;s
            rights
          </li>
          <li>Attempt to bypass security measures or access other accounts</li>
          <li>
            Use automated tools to scrape content or abuse the Brain Arena
            leaderboard/progress systems
          </li>
          <li>Submit false information during sign-up or verification</li>
        </ul>
        <p>
          Violating these rules may result in content removal, suspension,
          or termination of your account.
        </p>
      </>
    ),
  },
  {
    id: "content-and-ip",
    title: "Content & Intellectual Property",
    icon: Copyright,
    content: (
      <>
        <p>
          Tutorials, coding problems, course material, and platform design
          on CodeNFacts belong to CodeNFacts or its mentors, and are provided
          for your personal learning use. You may not republish or resell
          this content without permission.
        </p>
        <p>
          Content you post on CodeNFacts Connect — posts, comments, PDFs,
          voice posts, achievements — remains yours. By posting, you grant
          CodeNFacts a license to display that content within the platform
          so other users can see it as intended (for example, in the home
          feed or your profile).
        </p>
      </>
    ),
  },
  {
    id: "internship-tracks",
    title: "Internship Tracks & Certificates",
    icon: GraduationCap,
    content: (
      <>
        <p>
          Enrollment in an internship track (UI/UX, Frontend, AI, or DevOps)
          does not guarantee a job offer, placement, or specific career
          outcome. Certificates are awarded based on completion of
          milestones set by your mentor and reflect participation and
          learning, not a formal accreditation.
        </p>
        <p>
          We reserve the right to modify track content, mentor assignments,
          or cohort schedules as needed.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    icon: AlertTriangle,
    content: (
      <p>
        CodeNFacts is provided &quot;as is&quot; without warranties of any
        kind. We do our best to keep tutorials, problems, and tools (like
        the Resume Analyser) accurate and available, but we don&apos;t
        guarantee the platform will be error-free, uninterrupted, or fit for
        every specific purpose. AI-generated feedback (e.g. from the Resume
        Analyser) is provided as a learning aid, not professional or
        guaranteed advice.
      </p>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    icon: ShieldOff,
    content: (
      <p>
        To the fullest extent permitted by law, CodeNFacts and its team are
        not liable for any indirect, incidental, or consequential damages
        arising from your use of the platform, including reliance on
        tutorials, practice content, mentor feedback, or AI-generated
        suggestions.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    icon: Gavel,
    content: (
      <p>
        You may stop using CodeNFacts and request account deletion at any
        time. We may suspend or terminate accounts that violate these terms,
        with or without notice, particularly in cases of abuse, harassment,
        or fraudulent activity.
      </p>
    ),
  },
  {
    id: "changes-to-terms",
    title: "Changes to These Terms",
    icon: RefreshCcw,
    content: (
      <p>
        We may revise these Terms and Conditions as CodeNFacts evolves.
        We&apos;ll update the &quot;last updated&quot; date above, and for
        significant changes, we&apos;ll aim to notify users through the
        platform.
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

export default function TermsAndConditionsPage() {
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
            terms-and-conditions...
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Terms &amp; <span className="text-emerald-500">Conditions</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400"
          >
            The rules for using CodeNFacts - please read them before you
            create an account or join a track.
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
            Questions about these terms?
          </h2>
          <p className="max-w-md text-gray-600 dark:text-gray-400">
            Reach out and we&apos;ll be happy to clarify anything.
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