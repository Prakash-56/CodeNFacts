"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const traps = [
  { id: 1, title: "Only Doing Certificates", desc: "Digital badges aren't skill proof. Companies hire for problem-solving, not PDF collections from tutorial sites." },
  { id: 2, title: "Zero Real Projects", desc: "A resume without a live GitHub link is a ghost. Build tools that solve actual problems for real users." },
  { id: 3, title: "Skipping Internships", desc: "The 'Professional Culture' gap is real. Internships teach you how to ship code in a team environment." },
  { id: 4, title: "Ignoring DSA & Basics", desc: "Building apps without understanding DSA is like building a skyscraper on sand. Fundamentals are your backbone." },
  { id: 5, title: "No LinkedIn Presence", desc: "In 2026, if you aren't searchable, you don't exist. Networking fills 70% of tech roles before they're even posted." },
  { id: 6, title: "The Copy-Paste Trap", desc: "Tutorial hell destroys logic. If you can't explain why a line of code is there, you didn't build it." },
  { id: 7, title: "Learning Everything, Mastering Nothing", desc: "Being a specialist gets you hired. Deep knowledge in one stack beats surface knowledge in ten." },
  { id: 8, title: "Waiting for the 'Perfect' Time", desc: "The perfect time to start was yesterday. In tech, you learn by breaking things, not by waiting to be ready." },
  { id: 9, title: "Fear of Applying", desc: "Every rejection is a free mock interview. Don't let the fear of 'No' stop you from hitting the 'Apply' button." },
  { id: 10, title: "College Placement Dependency", desc: "Your potential is global. Don't limit your career to only the 5 companies that visit your campus." },
];

const Points = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [orbStyles, setOrbStyles] = useState<any[]>([]);

  // 1. Prevent Hydration Mismatch: Only generate random values after mounting
  useEffect(() => {
    const generatedStyles = [...Array(15)].map(() => ({
      width: Math.random() * 400 + 100,
      height: Math.random() * 400 + 100,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 10 + 15,
      xOffset: Math.random() * 50,
      yOffset: -(Math.random() * 100),
    }));
    setOrbStyles(generatedStyles);
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section ref={containerRef} className="relative min-h-screen bg-[#020617] py-32 px-6 overflow-hidden">
      
      {/* --- ANIMATED BACKGROUND (Floating Orbs) --- */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted && orbStyles.map((style, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10 blur-[80px]"
            style={{
              width: style.width,
              height: style.height,
              left: style.left,
              top: style.top,
            }}
            animate={{
              y: [0, style.yOffset, 0],
              x: [0, style.xOffset, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: style.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-40"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Mistakes</span>
          </h2>
          <p className="text-slate-400 text-xl font-medium tracking-wide">Why most tech students stay unemployed.</p>
        </motion.div>

        {/* --- THE 10 POINTS --- */}
        <div className="space-y-64">
          {traps.map((trap, index) => {
            const yMove = useTransform(smoothProgress, [0, 1], [index * 50, index * -150]);
            const rotate = useTransform(smoothProgress, [0, 1], [index % 2 === 0 ? -5 : 5, index % 2 === 0 ? 5 : -5]);

            return (
              <motion.div
                key={trap.id}
                style={{ y: yMove, rotateZ: rotate }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:items-start' : 'md:items-end'}`}
              >
                <div className="relative max-w-2xl group cursor-default">
                  <span className="absolute -top-16 -left-12 text-[12rem] font-black text-white/[0.03] select-none group-hover:text-blue-500/10 transition-colors duration-700">
                    {trap.id < 10 ? `0${trap.id}` : trap.id}
                  </span>

                  <motion.div 
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                  >
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 group-hover:translate-x-4 transition-transform duration-500">
                      {trap.title}
                    </h3>
                    <div className="h-1 w-20 bg-blue-500 mb-6 group-hover:w-full transition-all duration-700 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-light">
                      {trap.desc}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* --- CALL TO ACTION --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-80 p-1 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-[2.5rem]"
        >
          <div className="bg-[#020617] rounded-[2.4rem] p-12 md:p-24 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Don't Just Learn.<br/> <span className="text-blue-400">Build Your Future.</span>
            </h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto mb-12">
              At <span className="text-white font-bold">CodeNFacts</span>, we architect our courses to eliminate these 10 mistakes.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(37, 99, 235, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-12 py-5 rounded-full font-black text-xl tracking-widest uppercase"
            >
              Enroll in CodenFacts
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Points;