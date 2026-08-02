"use client";

import Link from "next/link";
import {
  ArrowRight,
  Code2,
  BrainCircuit,
  Database,
  Globe,
} from "lucide-react";

const ROADMAPS = [
  {
    title: "Web Development",
    description:
      "Frontend, Backend, APIs, Authentication, Databases and deployment.",
    icon: Globe,
    color:
      "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
  },
  {
    title: "Data Structures & Algorithms",
    description:
      "Master problem solving with arrays, trees, graphs and dynamic programming.",
    icon: Code2,
    color:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    title: "Artificial Intelligence",
    description:
      "Explore Machine Learning, Deep Learning, LLMs and practical AI projects.",
    icon: BrainCircuit,
    color:
      "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  },
  {
    title: "Data Science",
    description:
      "Learn Python, SQL, Data Analysis, Visualization and predictive modelling.",
    icon: Database,
    color:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  },
];

export default function LearningRoadmap() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#0a0e14] py-24 px-4 sm:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}

        <div className="max-w-3xl mx-auto text-center">

          <span className="inline-flex rounded-full border border-slate-200 dark:border-slate-700 px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
            Learning Paths
          </span>

          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Choose Your Learning Roadmap
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Every roadmap is carefully structured to take you from beginner
            fundamentals to real-world projects, helping you build practical
            skills step by step.
          </p>

        </div>

        {/* Cards */}

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {ROADMAPS.map((roadmap) => {
            const Icon = roadmap.icon;

            return (
              <div
                key={roadmap.title}
                className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-black/40"
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${roadmap.color}`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {roadmap.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
                  {roadmap.description}
                </p>

                <Link
                  href="/roadmaps"
                  className="mt-8 inline-flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400"
                >
                  View Roadmap

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}

        <div className="mt-20 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] p-10 text-center">

          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            Learn with Confidence
          </h3>

          <p className="mx-auto mt-5 max-w-2xl text-slate-600 dark:text-slate-400 leading-8">
            Whether you're starting your programming journey or preparing for
            technical interviews, our structured learning paths help you stay
            focused and build real skills.
          </p>

          <Link
            href="/roadmaps"
            className="group mt-10 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300"
          >
            Explore Roadmaps

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

        </div>

      </div>
    </section>
  );
}