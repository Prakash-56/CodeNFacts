"use client";

import { motion } from "framer-motion";
import {
  Terminal,
  Target,
  Eye,
  Sparkles,
  Users,
  Code2,
  GraduationCap,
  Briefcase,
  Palette,
  Server,
  BrainCircuit,
  Quote,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// TODO(backend): replace with live counts fetched from Firestore (users, mentors, problems solved, internships completed)
const STATS = [
  { label: "Learners Onboarded", value: "12,000+" },
  { label: "Coding Problems", value: "3,950+" },
  { label: "Mentor-Led Tracks", value: "4" },
  { label: "Internship Cohorts", value: "6" },
];

// TODO(backend): pull internship tracks dynamically if new domains are added
const TRACKS = [
  {
    icon: Palette,
    title: "UI/UX Design",
    desc: "Design systems, user research, and interface craft for real products.",
  },
  {
    icon: Code2,
    title: "Frontend Engineering",
    desc: "Modern component architecture, performance, and responsive builds.",
  },
  {
    icon: BrainCircuit,
    title: "AI Engineering",
    desc: "Applied ML, LLM tooling, and data-driven feature development.",
  },
  {
    icon: Server,
    title: "DevOps Engineering",
    desc: "CI/CD pipelines, infrastructure, and deployment reliability.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
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

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-[#0a0e14] dark:text-gray-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-white/10">
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] [background-size:32px_32px] dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]" />

        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.div
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 font-mono text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          >
            <Terminal className="h-3.5 w-3.5" />
            About Us
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="text-4xl font-bold tracking-tight sm:text-5xl"
          >
            We&apos;re building the place where{" "}
            <span className="text-emerald-500">code meets craft</span>.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400"
          >
            CodeNFacts is a mentor-led learning platform for people who want
            to actually ship things - not just watch tutorials. We pair
            structured internship tracks with hands-on practice, real
            mentorship, and tools built by learners, for learners.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={3}
            variants={fadeUp}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/develop"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-600"
            >
              Explore Brain Arena
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:border-gray-400 dark:border-white/15 dark:text-gray-300 dark:hover:border-white/30"
            >
              Meet the Community
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 dark:border-white/10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-none border border-gray-200 bg-gray-200 sm:grid-cols-4 dark:border-white/10 dark:bg-white/10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="bg-white px-6 py-8 text-center dark:bg-[#0a0e14]"
            >
              <div className="font-mono text-2xl font-bold text-emerald-500 sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Company profile */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-white/10"
        >
          <TerminalChrome label="company-profile.md" />
          <div className="space-y-4 bg-white p-6 text-gray-700 dark:bg-[#0d1117] dark:text-gray-300 sm:p-8">
            <p>
              CodeNFacts started as a small internship program for students
              who wanted to learn by building, not just by watching lectures.
              It has since grown into a platform that combines structured
              learning tracks, an active practice arena, and a community
              where mentors and learners work side by side.
            </p>
            <p>
              Today, we run mentor-guided internship tracks across{" "}
              <strong className="text-gray-900 dark:text-white">
                UI/UX Design, Frontend Engineering, AI Engineering, and
                DevOps
              </strong>
              , backed by a growing bank of coding problems, DSA roadmaps,
              and interactive practice games in our Brain Arena. Every track
              is designed around one idea: skills stick when you use them on
              real problems, with real feedback.
            </p>
            <p>
              We&apos;re also building CodeNFacts Connect, a space for
              learners and mentors to share progress, ask questions, and
              follow each other&apos;s work — because learning to code is a
              lot easier when you&apos;re not doing it alone.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Mission / Vision / Motto */}
      <section className="border-y border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10 font-mono text-sm uppercase tracking-widest text-emerald-600 dark:text-emerald-400"
          >
            // what drives us
          </motion.h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Mission",
                text: "Make practical, mentor-backed learning accessible to every student who's willing to put in the work — no gatekeeping, no fluff.",
              },
              {
                icon: Eye,
                title: "Vision",
                text: "To become the place students go when they want to move from 'I understand this concept' to 'I built something with it.'",
              },
              {
                icon: Sparkles,
                title: "Motto",
                text: "Learn by doing. Ship by Friday.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#0d1117]"
              >
                <item.icon className="mb-4 h-6 w-6 text-emerald-500" />
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Internship tracks */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-10 flex items-center gap-2"
        >
          <GraduationCap className="h-5 w-5 text-emerald-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Internship Tracks
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {TRACKS.map((track, i) => (
            <motion.div
              key={track.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="group flex items-start gap-4 rounded-xl border border-gray-200 p-5 transition hover:border-emerald-500/40 hover:shadow-sm dark:border-white/10 dark:hover:border-emerald-500/30"
            >
              <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <track.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {track.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {track.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founder / Team note */}
      <section className="border-t border-gray-200 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10"
          >
            <TerminalChrome label="Founder" />
            <div className="grid gap-8 bg-white p-6 dark:bg-[#0d1117] sm:grid-cols-[auto_1fr] sm:p-8">
              {/* TODO(backend): swap initials placeholder for founder photo */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                PK
              </div>
              <div>
                <Quote className="mb-3 h-5 w-5 text-emerald-500/60" />
                <p className="text-gray-700 dark:text-gray-300">
                  {/* TODO(backend): replace with founder's own quote/bio copy */}
                  CodeNFacts exists because most of us learned to code the
                  hard way - scattered tutorials, no feedback, no community.
                  We&apos;re building the version of that journey we wish
                  we&apos;d had - structured, mentored, and genuinely fun to
                  stick with.
                </p>
                <p className="mt-4 font-mono text-sm text-gray-500 dark:text-gray-500">
                  — Founder, CodeNFacts
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 dark:border-white/10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-20 text-center"
        >
          <Users className="h-6 w-6 text-emerald-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Come build with us
          </h2>
          <p className="max-w-md text-gray-600 dark:text-gray-400">
            Whether you&apos;re here to learn, mentor, or intern - there&apos;s
            a track for you.
          </p>
          <Link
            href="/work-with-us"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition hover:bg-emerald-600"
          >
            <Briefcase className="h-4 w-4" />
            View Internship Tracks
          </Link>
        </motion.div>
      </section>
    </main>
  );
}