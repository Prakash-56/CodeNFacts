"use client";

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Code2, Database, Globe, Cpu, Briefcase, 
  Coffee, Layout, Terminal, Star, CheckCircle2, 
  ArrowUpRight, Sparkles, Rocket, Users, Trophy
} from 'lucide-react';

const courses = [
  {
    title: "Python for Data Science",
    icon: <Database />,
    color: "#3776ab",
    description: "Unlock the power of data. From automation scripts to complex predictive modeling.",
    features: ["Pandas & NumPy", "Matplotlib Viz", "Scikit-Learn"],
    students: "1.2k+",
    rating: 4.9
  },
  {
    title: "OOP with Java",
    icon: <Coffee />,
    color: "#f89820",
    description: "Build robust, scalable systems. Master the language that powers enterprise software.",
    features: ["Design Patterns", "Multi-threading", "Memory Management"],
    students: "850+",
    rating: 4.8
  },
  {
    title: "Complete LinkedIn Setup",
    icon: <Briefcase />,
    color: "#0077b5",
    description: "Your digital resume is your brand. Learn to attract high-ticket recruiters.",
    features: ["SEO Optimization", "Algorithm Mastery", "Cold Outreach"],
    students: "2.1k+",
    rating: 5.0
  },
  {
    title: "Mastering C Language",
    icon: <Terminal />,
    color: "#64748b",
    description: "The 'Mother of Languages'. Understand what happens under the hood of every program.",
    features: ["Pointers & Memory", "Data Structures", "Bitwise Ops"],
    students: "1.5k+",
    rating: 4.7
  },
  {
    title: "Learn complete HTML/CSS",
    icon: <Layout />,
    color: "#ec4899",
    description: "Turn designs into reality. Master layouts that look perfect on every single screen.",
    features: ["Modern Flexbox/Grid", "Tailwind CSS", "Responsive Design"],
    students: "3.2k+",
    rating: 4.9
  },
  {
    title: "AI/Machine Learning",
    icon: <Cpu />,
    color: "#a855f7",
    description: "Train models that can see, hear, and think. Lead the intelligence revolution.",
    features: ["Neural Networks", "NLP Basics", "Deep Learning"],
    students: "900+",
    rating: 4.9
  },
  {
    title: "Data Structures & Algorithms",
    icon: <Code2 />,
    color: "#10b981",
    description: "The gold standard for tech interviews. Solve complex problems with optimized logic.",
    features: ["Big O Analysis", "Graph Algorithms", "Recursion"],
    students: "2.5k+",
    rating: 4.9
  },
  {
    title: "Data Science",
    icon: <Database />,
    color: "#6366f1",
    description: "The sexiest job of the 21st century. Turn raw numbers into strategic gold.",
    features: ["Statistical Analysis", "SQL Data Mining", "Data Storytelling"],
    students: "1.1k+",
    rating: 4.8
  },
  {
    title: "Web Development",
    icon: <Globe />,
    color: "#eab308",
    description: "Full-stack mastery. Learn to build the next Amazon, Facebook, or CodeNFacts.",
    features: ["MERN Stack", "API Development", "Deployment"],
    students: "4k+",
    rating: 4.9
  }
];

const TiltCard = ({ course }: { course: typeof courses[0] }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative group h-[480px] w-full rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/5 p-[1px]"
    >
      <div 
        style={{ transform: "translateZ(50px)" }}
        className="h-full w-full rounded-[2.4rem] bg-[#0f172a] p-8 flex flex-col justify-between overflow-hidden relative"
      >
        <div 
          className="absolute -right-20 -top-20 w-64 h-64 opacity-20 blur-[100px] rounded-full transition-all group-hover:opacity-40"
          style={{ backgroundColor: course.color }}
        />

        <div>
          <div className="flex justify-between items-start mb-8">
            <div className="p-4 rounded-2xl text-white shadow-2xl" style={{ backgroundColor: course.color }}>
              {course.icon}
            </div>
            <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">{course.rating}</span>
            </div>
          </div>

          <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{course.title}</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3">
            {course.description}
          </p>

          <div className="space-y-3">
            {course.features.map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{course.students} Learners</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="p-3 rounded-xl bg-white text-black shadow-xl"
          >
            <ArrowUpRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-[#020617] py-24 px-6 relative selection:bg-blue-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-4 h-4" /> The Future of Learning
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8"
          >
            Master the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-500">
              Code & The Facts.
            </span>
          </motion.h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
            Don't just learn syntax. Understand the engineering principles that build billion-dollar companies.
          </p>
        </header>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course, i) => (
            <TiltCard key={i} course={course} />
          ))}
        </div>

        {/* MOTIVATION SECTION */}
        <section className="mt-48">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 italic tracking-tight">Why Choose CodeNFacts?</h2>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Rocket className="text-blue-400" />, title: "Career Velocity", desc: "Our curriculum is designed to slash your learning curve by 50% compared to self-study." },
              { icon: <Trophy className="text-emerald-400" />, title: "Real-World Proof", desc: "Build projects that aren't just tutorials, but production-ready applications for your portfolio." },
              { icon: <Users className="text-purple-400" />, title: "The 1% Community", desc: "Surround yourself with high-achievers. Network with peers moving into top tech firms." }
            ].map((box, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="mb-6">{box.icon}</div>
                <h4 className="text-xl font-bold text-white mb-4">{box.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{box.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Final Call to Action */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="mt-32 relative rounded-[4rem] p-12 md:p-20 overflow-hidden text-center bg-gradient-to-br from-blue-600 to-indigo-800 shadow-[0_0_50px_rgba(37,99,235,0.3)]"
          >
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                Ready to become <br className="hidden md:block" /> a Top 1% Engineer?
              </h2>
              <p className="text-blue-100 text-lg mb-12 max-w-xl mx-auto font-medium">
                Enroll in any course today and get lifetime access to our private community and resource library.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button className="px-12 py-5 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-2xl">
                  Get Unlimited Access
                </button>
                <button className="px-12 py-5 bg-transparent border-2 border-white/30 text-white font-black rounded-2xl hover:bg-white/10 transition-all">
                  Browse Free Roadmap
                </button>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          </motion.div>
        </section>

        <footer className="mt-40 pb-20 text-center border-t border-white/5 pt-20">
          <div className="text-2xl font-black text-white mb-4 tracking-tighter">CodeNFacts</div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.4em]">
            Built for those who dare to build.
          </p>
        </footer>
      </div>
    </div>
  );
}