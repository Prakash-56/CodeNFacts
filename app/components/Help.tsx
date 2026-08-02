"use client";

import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

export default function Community() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#0a0e14] py-24 px-4 sm:px-8 transition-colors duration-300">
      <div className="relative mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d1117]">
            <Users className="h-6 w-6 text-slate-900 dark:text-white" />
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Learn Better Together
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Connect with learners, collaborate on projects, discuss ideas,
            participate in coding challenges, and grow alongside a community
            that shares your passion for technology.
          </p>

          <div className="mt-10">
            <Link
              href="/connect"
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300"
            >
              Explore Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Community Card */}
        <div className="mt-20 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] p-8 sm:p-10 shadow-xl shadow-slate-200/40 dark:shadow-black/30">

          <div className="grid gap-10 md:grid-cols-3">

            <div>
              <div className="mb-4 h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Meet Developers
              </h3>

              <p className="mt-3 text-slate-600 dark:text-slate-400 leading-7">
                Build meaningful connections with developers, students,
                mentors, and creators from around the world.
              </p>
            </div>

            <div>
              <div className="mb-4 h-10 w-10 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center">
                💬
              </div>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Share Knowledge
              </h3>

              <p className="mt-3 text-slate-600 dark:text-slate-400 leading-7">
                Ask questions, answer discussions, exchange resources, and
                learn from real experiences shared by the community.
              </p>
            </div>

            <div>
              <div className="mb-4 h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center">
                🚀
              </div>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Grow Together
              </h3>

              <p className="mt-3 text-slate-600 dark:text-slate-400 leading-7">
                Participate in coding events, collaborate on projects, and stay
                motivated through an active learning ecosystem.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}