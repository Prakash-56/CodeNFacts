'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Terminal,
  Code2,
  Palette,
  Cloud,
  BrainCircuit,
  MessageCircle,
  ClipboardList,
  ArrowRight,
  Gamepad2,
  Users2,
  Sparkles,
  FileCheck2,
  CalendarCheck2,
  GraduationCap,
  Layers,
} from 'lucide-react';

// TODO: point this at your actual application form / route
const APPLY_URL = 'https://forms.gle/your-application-form';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

/* What interns actually work on — grounded in real CodeNFacts features */
const WHAT_YOU_BUILD = [
  {
    icon: Gamepad2,
    title: 'Brain Arena mini-games',
    desc: 'Ship gamified practice tools like Terminal Hacker, Code Detective, and Algorithm Race - full pages with question banks, lives, streaks, and score tracking.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Tutor',
    desc: 'Extend the roadmap-driven AI tutor: new topics, question sets, and the Gemini-powered chat backend.',
  },
  {
    icon: Users2,
    title: 'CodeNFacts Connect',
    desc: 'Build out our social learning hub - posts, follows, messaging, mentor directory, and profile tools.',
  },
  {
    icon: Palette,
    title: 'Design system & theming',
    desc: 'Work on the unified light/dark theming system used across every page and component on the platform.',
  },
];

const TRACKS = [
  {
    name: 'Frontend Engineering',
    icon: Code2,
    desc: 'Next.js App Router, TypeScript, Tailwind, and Framer Motion - building real, user-facing product surfaces.',
  },
  {
    name: 'UI/UX Design',
    icon: Palette,
    desc: 'Design flows and interfaces for a live platform used by learners preparing for interviews every day.',
  },
  {
    name: 'AI Engineering',
    icon: BrainCircuit,
    desc: 'Work on the AI tutor, roadmap generation, and Gemini API integrations powering personalized learning.',
  },
  {
    name: 'DevOps / Cloud',
    icon: Cloud,
    desc: 'Own Firebase infra, deployment pipelines, and platform reliability as the codebase scales.',
  },
];

const TECH_STACK = [
  'Next.js (App Router)',
  'TypeScript',
  'Tailwind CSS',
  'Framer Motion',
  'Firebase (Auth · Firestore · Storage)',
  'Gemini API',
  'Nodemailer / Gmail SMTP',
];

const HOW_IT_WORKS = [
  {
    icon: Terminal,
    title: 'Remote, online',
    desc: 'Work from anywhere - the whole program runs online, no office required.',
  },
  {
    icon: MessageCircle,
    title: 'Daily WhatsApp check-ins',
    desc: 'Quick daily updates with your team and mentor over WhatsApp.',
  },
  {
    icon: ClipboardList,
    title: 'Daily report form',
    desc: 'Log what you worked on each day through a simple Google Form.',
  },
];

const PROCESS = [
  {
    icon: FileCheck2,
    title: 'Apply',
    desc: 'Fill out the application form with your track preference and a bit about your experience.',
  },
  {
    icon: MessageCircle,
    title: 'Short conversation',
    desc: "We'll reach out for a quick, informal chat - no whiteboard interviews.",
  },
  {
    icon: CalendarCheck2,
    title: 'Get matched',
    desc: 'Join your track and get looped into the WhatsApp group and reporting flow.',
  },
  {
    icon: GraduationCap,
    title: 'Build & learn',
    desc: 'Ship real features on the live platform, with mentorship along the way.',
  },
];

const WHAT_YOU_GET = [
  'Real production experience on a live platform with real users',
  'Direct mentorship from the CodeNFacts team',
  'A portfolio of shipped features, not toy projects',
  'Flexible, remote-first schedule around your studies',
  'An offer letter and recognition for completed internships',
];

export default function WorkWithUsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0e14] transition-colors">

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-28 pb-20 sm:pt-32 sm:pb-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
          style={{
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            color: 'rgb(120 113 108 / 0.3)',
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-4 py-1.5 text-xs font-mono text-neutral-500 dark:text-neutral-400"
          >
            <Terminal size={12} />
            careers@codenfacts
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="mt-6 text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white"
          >
            Work with us
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-4 text-neutral-500 dark:text-neutral-400 leading-relaxed"
          >
            Join CodeNFacts as an intern and help build the platform itself - the games, the AI tutor,
            the community - the same product thousands of learners use to crack their next interview.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-8"
          >
            <a
              href="/apply"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-6 py-3 font-medium text-white dark:text-[#0a0e14] bg-amber-600 dark:bg-emerald-400 hover:bg-amber-700 dark:hover:bg-emerald-300 transition-colors"
            >
              Apply now
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* What you'll actually build */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xl font-semibold text-neutral-900 dark:text-white mb-2"
          >
            What you'll actually build
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 max-w-2xl"
          >
            This isn't a make-work internship. You'll ship features that go live on codenfacts.in
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-4">
            {WHAT_YOU_BUILD.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-6 hover:border-amber-500 dark:hover:border-emerald-400 transition-colors"
              >
                <item.icon size={22} className="text-amber-600 dark:text-emerald-400 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xl font-semibold text-neutral-900 dark:text-white mb-8"
          >
            Internship tracks
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {TRACKS.map((track, i) => (
              <motion.div
                key={track.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-6 hover:border-amber-500 dark:hover:border-emerald-400 transition-colors"
              >
                <track.icon size={22} className="text-amber-600 dark:text-emerald-400 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white">{track.name}</h3>
                <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {track.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-2 text-xl font-semibold text-neutral-900 dark:text-white mb-6"
          >
            <Layers size={20} className="text-amber-600 dark:text-emerald-400" />
            The stack you'll work in
          </motion.h2>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap gap-2"
          >
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-4 py-1.5 text-sm font-mono text-neutral-600 dark:text-neutral-300"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works day-to-day */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xl font-semibold text-neutral-900 dark:text-white mb-8"
          >
            How the program runs day-to-day
          </motion.h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 text-center"
              >
                <item.icon size={20} className="text-amber-600 dark:text-emerald-400 mx-auto mb-3" />
                <h3 className="font-medium text-neutral-900 dark:text-white text-sm">{item.title}</h3>
                <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application process */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xl font-semibold text-neutral-900 dark:text-white mb-8"
          >
            The application process
          </motion.h2>

          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-neutral-200 dark:bg-neutral-800 sm:hidden" />
            <div className="grid sm:grid-cols-4 gap-6 sm:gap-4">
              {PROCESS.map((step, i) => (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="relative pl-10 sm:pl-0 sm:text-center"
                >
                  <div className="absolute left-0 sm:static sm:mx-auto flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 dark:bg-emerald-400 text-white dark:text-[#0a0e14] text-xs font-bold mb-0 sm:mb-3">
                    {i + 1}
                  </div>
                  <h3 className="font-medium text-neutral-900 dark:text-white text-sm flex items-center gap-2 sm:justify-center sm:flex-col sm:gap-1.5">
                    <step.icon size={16} className="text-amber-600 dark:text-emerald-400 sm:hidden" />
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-4 pb-24">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-2 text-xl font-semibold text-neutral-900 dark:text-white mb-6"
          >
            <Sparkles size={20} className="text-amber-600 dark:text-emerald-400" />
            What you get out of it
          </motion.h2>

          <motion.ul
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {WHAT_YOU_GET.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-emerald-400 shrink-0" />
                {point}
              </li>
            ))}
          </motion.ul>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <a
              href="/apply"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-6 py-3 font-medium text-white dark:text-[#0a0e14] bg-amber-600 dark:bg-emerald-400 hover:bg-amber-700 dark:hover:bg-emerald-300 transition-colors"
            >
              Apply now
              <ArrowRight size={16} />
            </a>
            <p className="mt-4 text-sm text-neutral-400 dark:text-neutral-500">
              Have questions first?{' '}
              <Link
                href="/contact"
                className="text-amber-600 dark:text-emerald-400 hover:underline font-medium"
              >
                Reach out to us
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}