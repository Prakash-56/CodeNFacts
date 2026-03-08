"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import CourseCard from "./CourseCard";
import { useEffect, useState, useRef } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const courses = [
  {
    title: "Python for Data Science",
    slug: "Python-DS",
    description: "Master Python from scratch to advanced data visualization and automation.",
    price: 297, originalPrice: 4999, discountLabel: "94% OFF",
    image: "/course/python.jpg", level: "Beginner", duration: "6 Weeks",
    projects: 5, startDate: "1 st May", rating: 4.9,
  },
  {
    title: "OOP with Java",
    slug: "OOP-With-Java",
    description: "Deep dive into Classes, Inheritance, Polymorphism and Design Patterns.",
    price: 385, originalPrice: 3999, discountLabel: "Early Bird",
    image: "/course/java.jpg", level: "Intermediate", duration: "8 Weeks",
    projects: 3, startDate: "Coming Soon..", rating: 4.7,
  },
  {
    title: "Complete LinkedIn Setup",
    slug: "Linkedin-Setup",
    description: "Optimize your profile, networking strategies, and personal branding.",
    price: 289, originalPrice: 1999, discountLabel: "Best Seller",
    image: "/course/linkedin.jpg", level: "Beginner", duration: "1 Week",
    projects: 1, startDate: "10 th May", rating: 5.0,
  },
  {
    title: "Mastering C Language",
    slug: "Mastering-C-Language",
    description: "The foundation of programming. Pointers, Memory, and Logic building.",
    price: 199, originalPrice: 2999, discountLabel: "Student Special",
    image: "/course/c-lang.jpg", level: "Beginner", duration: "12 Weeks",
    projects: 12, startDate: "24 th April", rating: 4.6,
  },
  {
    title: "Learn Complete HTML/CSS",
    slug: "Complete-HTML-CSS",
    description: "Responsive design, Flexbox, Grid, and Modern CSS Animations.",
    price: 399, originalPrice: 2499, discountLabel: "New Launch",
    image: "/course/html-css.jpg", level: "Beginner", duration: "6 Weeks",
    projects: 4, startDate: "Coming Soon..", rating: 4.8,
  },
  {
    title: "AI / Machine Learning",
    slug: "AI-Machine-learning",
    description: "Learn AI concepts, models, and real-world ML projects.",
    price: 1399, originalPrice: 7999, discountLabel: "Premium",
    image: "/course/ai-ml.jpg", level: "Advanced", duration: "18 Weeks",
    projects: 6, startDate: "18 th April", rating: 4.9,
  },
  {
    title: "DSA for Interviews",
    slug: "DSA",
    description: "Master coding patterns for interviews and problem-solving.",
    price: 739, originalPrice: 3333, discountLabel: "Job Ready",
    image: "/course/dsa.jpg", level: "Intermediate", duration: "12 Weeks",
    projects: 15, startDate: "Coming Soon..", rating: 4.9,
  },
  {
    title: "Data Science",
    slug: "Data-Science",
    description: "Analyze, visualize, and interpret data like a pro.",
    price: 999, originalPrice: 3999, discountLabel: "75% OFF",
    image: "/course/data-scientist.jpg", level: "Advanced", duration: "20 Weeks",
    projects: 7, startDate: "9 th May", rating: 4.8,
  },
  {
    title: "Web Development",
    slug: "Web-Dev",
    description: "Full-stack development with React, Next.js, and Node.js.",
    price: 820, originalPrice: 4499, discountLabel: "Flash Sale",
    image: "/course/webdevelopment.jpg", level: "Intermediate", duration: "18 Weeks",
    projects: 10, startDate: "Coming Soon..", rating: 4.7,
  },
];

const FILTERS = ["All", "Beginner", "Intermediate", "Advanced"];

// Floating orb component
function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`}
      animate={{
        y: [0, -40, 0],
        x: [0, 20, 0],
        scale: [1, 1.1, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

// Animated grid background
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Fade edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#040812] via-transparent to-[#040812]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040812] via-transparent to-[#040812]" />
    </div>
  );
}

// Stats bar
function StatsBanner() {
  const stats = [
    { value: "9+", label: "Courses" },
    { value: "50K+", label: "Students" },
    { value: "4.8★", label: "Avg Rating" },
    { value: "100%", label: "Job Ready" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap justify-center gap-6 mb-16"
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05, y: -4 }}
          className="flex flex-col items-center px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-sm"
        >
          <span className="text-3xl font-black text-white tracking-tighter">{s.value}</span>
          <span className="text-[11px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">{s.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function CoursesOverview() {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
    });
    return () => unsubscribe();
  }, []);

  const filtered = activeFilter === "All"
    ? courses
    : courses.filter((c) => c.level === activeFilter);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-[#040812] overflow-hidden"
    >
      {/* Background layers */}
      <GridBackground />

      {/* Floating color orbs */}
      <FloatingOrb className="w-[600px] h-[600px] bg-blue-600/20 top-[-100px] left-[-200px]" delay={0} />
      <FloatingOrb className="w-[500px] h-[500px] bg-violet-600/20 top-[30%] right-[-150px]" delay={2} />
      <FloatingOrb className="w-[400px] h-[400px] bg-indigo-500/15 bottom-[10%] left-[20%]" delay={4} />

      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none z-10"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <div className="relative z-20 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Premium Learning Paths
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
            className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none"
          >
            Our{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Courses
              </span>
              {/* Underline glow */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full origin-left"
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-gray-400 text-lg max-w-xl mx-auto leading-relaxed"
          >
            Industry-crafted programs built by practitioners. Learn what companies actually need.
          </motion.p>
        </div>

        {/* Stats */}
        <StatsBanner />

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-2 mb-12"
        >
          {FILTERS.map((f) => (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeFilter === f
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300 bg-white/[0.03] border border-white/[0.06]"
              }`}
            >
              {activeFilter === f && (
                <motion.div
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{f}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Course Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div
              className="contents"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.05 },
                },
              }}
            >
              {filtered.map((course) => (
                <CourseCard
                  key={course.slug}
                  {...course}
                  courseId={course.slug}
                  userId={userId}
                />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mt-20 relative rounded-[2rem] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-violet-600/20 backdrop-blur-sm border border-white/10" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-violet-900/30" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-10">
            <div>
              <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">Limited Time Offer</p>
              <h3 className="text-3xl font-black text-white tracking-tight">Start Your Journey Today</h3>
              <p className="text-gray-400 mt-1 text-sm">Join 50,000+ learners already transforming their careers.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black rounded-2xl text-sm tracking-wide flex-shrink-0 shadow-xl shadow-blue-500/25"
            >
              Don't be late...
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}