"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Star, ArrowUpRight } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Final Year B.Tech Student",
    feedback:
      "CodeNFacts completely changed my understanding of AI. The real-world projects helped me build confidence.",
    rating: 5,
    tag: "AI Mastery",
    index: "01",
  },
  {
    name: "Priya Das",
    role: "Internship Placed · Data Analyst",
    feedback:
      "Structured roadmap and mentorship support are next level. Everything feels industry-ready.",
    rating: 5,
    tag: "Placed",
    index: "02",
  },
  {
    name: "Aman Verma",
    role: "Career Switcher · Data Science",
    feedback:
      "Not just theory - practical implementation. Exactly what companies expect from fresh hires.",
    rating: 4,
    tag: "Career Switch",
    index: "03",
  },
  {
    name: "Sneha Patil",
    role: "Final Year CSE Student",
    feedback:
      "Even as a beginner, I could understand complex ML topics with ease and clarity.",
    rating: 5,
    tag: "ML Clarity",
    index: "04",
  },
  {
    name: "Vikash Kumar",
    role: "Placed as ML Intern",
    feedback:
      "I built 4 strong projects which helped me crack my internship interview in just 3 months.",
    rating: 5,
    tag: "Placed",
    index: "05",
  },
  {
    name: "Ananya Mishra",
    role: "Aspiring AI Engineer",
    feedback:
      "The mentorship sessions cleared all my doubts and boosted my confidence massively.",
    rating: 5,
    tag: "Mentorship",
    index: "06",
  },
  {
    name: "Rohit Singh",
    role: "Working Professional · Upskilling",
    feedback:
      "The structured curriculum saved me months of aimless YouTube rabbit holes.",
    rating: 4,
    tag: "Upskilling",
    index: "07",
  },
  {
    name: "Meera Nair",
    role: "Data Science Intern",
    feedback:
      "Resume building and mock interviews were absolute game changers for my career.",
    rating: 5,
    tag: "Job Ready",
    index: "08",
  },
  {
    name: "Arjun Reddy",
    role: "Final Year IT Student",
    feedback:
      "I finally understand how AI models actually work behind the scenes. Mind blown.",
    rating: 5,
    tag: "Deep Learning",
    index: "09",
  },
  {
    name: "Kavita Joshi",
    role: "Placed · Junior Data Scientist",
    feedback:
      "This course made me industry-ready from day one. No fluff, just real skills.",
    rating: 5,
    tag: "Placed",
    index: "10",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={
            i < rating
              ? "text-amber-400 fill-amber-400"
              : "text-white/10 fill-white/10"
          }
        />
      ))}
    </div>
  );
}

function TestimonialCard({ student }: { student: (typeof testimonials)[0] }) {
  return (
    <div
      className="group relative flex-shrink-0 w-[300px] sm:w-[360px] md:w-[400px]"
      style={{ padding: "2px" }}
    >
      {/* Glowing border gradient */}
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-indigo-500/40 via-transparent to-violet-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative rounded-[26px] bg-[#0d0d14] border border-white/[0.07] p-7 md:p-8 h-full overflow-hidden">

        {/* Background glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />

        {/* Top row */}
        <div className="flex items-start justify-between mb-6">
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/20 uppercase">
            {student.index}
          </span>
          <span className="text-[10px] tracking-widest font-semibold uppercase px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {student.tag}
          </span>
        </div>

        {/* Feedback */}
        <p className="text-[15px] text-white/70 leading-relaxed mb-7 font-light" style={{ fontFamily: "'Georgia', serif" }}>
          &ldquo;{student.feedback}&rdquo;
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-white/10 via-indigo-400/20 to-transparent mb-6" />

        {/* Footer */}
        <div className="flex items-end justify-between">
          <div>
            <StarRating rating={student.rating} />
            <h4 className="text-white font-semibold text-[15px] mt-2 tracking-tight">
              {student.name}
            </h4>
            <p className="text-white/35 text-[12px] mt-0.5">{student.role}</p>
          </div>

          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-all duration-500">
            <ArrowUpRight size={14} className="text-white/30 group-hover:text-indigo-300 transition-colors" />
          </div>
        </div>

      </div>
    </div>
  );
}

function InfiniteTrack({
  speed,
  direction = 1,
}: {
  speed: number;
  direction?: number;
}) {
  const duplicated = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="overflow-hidden relative w-full">
      <motion.div
        className="flex gap-5 w-max"
        animate={{ x: direction === 1 ? ["0%", "-33.33%"] : ["-33.33%", "0%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
      >
        {duplicated.map((student, i) => (
          <TestimonialCard key={i} student={student} />
        ))}
      </motion.div>
    </div>
  );
}

const stats = [
  { value: "500+", label: "Learners Enrolled", accent: "text-indigo-400" },
  { value: "4.7★", label: "Average Rating", accent: "text-amber-400" },
  { value: "86%", label: "Career Growth", accent: "text-emerald-400" },
  { value: "120+", label: "Projects Built", accent: "text-violet-400" },
];

export default function PremiumTestimonialsSection() {
  return (
    <section
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: "#07070f" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-700/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-violet-700/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
          >
            <div>
              <p
                className="text-[11px] tracking-[0.35em] uppercase text-indigo-400/70 mb-5 font-mono"
              >
                Student Stories
              </p>
              <h2
                className="text-[42px] sm:text-[58px] md:text-[72px] font-black leading-[0.92] tracking-tight text-white"
                style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}
              >
                Trusted by{" "}
                <span
                  className="relative inline-block"
                  style={{
                    background: "linear-gradient(135deg, #a5b4fc 0%, #818cf8 50%, #c4b5fd 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Future
                </span>
                <br />
                Tech Leaders
              </h2>
            </div>

            <div className="md:max-w-xs">
              <p className="text-white/40 text-sm leading-relaxed">
                We don&apos;t just teach AI & Data Science. We build confident, industry-ready creators from day one.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
              <p className={`text-3xl md:text-4xl font-black tracking-tight ${s.accent} mb-1`}>
                {s.value}
              </p>
              <p className="text-white/30 text-[12px] tracking-wide">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Testimonial tracks */}
        <div className="space-y-5">
          {/* Track 1 — right to left */}
          <div className="relative">
            <InfiniteTrack speed={38} direction={1} />
            <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-[#07070f] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-[#07070f] to-transparent pointer-events-none z-10" />
          </div>

          {/* Track 2 — left to right (reverse) */}
          <div className="relative hidden sm:block">
            <InfiniteTrack speed={46} direction={-1} />
            <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-[#07070f] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-[#07070f] to-transparent pointer-events-none z-10" />
          </div>
        </div>

        {/* Bottom quote strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 md:mt-28 relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-indigo-500/[0.07] via-white/[0.02] to-violet-500/[0.07] px-8 md:px-14 py-12 md:py-16"
        >
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />

          <div className="max-w-3xl mx-auto text-center">
            <span
              className="text-[80px] md:text-[100px] leading-none text-indigo-500/20 font-black select-none block -mb-6"
              style={{ fontFamily: "serif" }}
            >
              "
            </span>
            <p
              className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed font-light"
              style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}
            >
              We don&apos;t just teach AI & Data Science. We build confident, industry-ready creators who can solve real-world problems from day one.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-indigo-500/40" />
              <span className="text-indigo-400/70 text-xs tracking-[0.25em] uppercase font-mono">CodeNFacts</span>
              <div className="h-px w-12 bg-indigo-500/40" />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}