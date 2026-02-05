"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Lightbulb, Brain, Wrench, IndianRupee } from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Concept-First Learning",
    desc: "We dismantle complex architectures into digestible mental models. We teach the 'Why' because the 'How' changes every year.",
    color: "from-yellow-400 to-orange-500",
    shadow: "shadow-yellow-500/20",
  },
  {
    icon: Brain,
    title: "Problem-Solving DNA",
    desc: "Move beyond copy-pasting tutorials. Our curriculum is built around algorithmic thinking and logical engineering.",
    color: "from-blue-400 to-indigo-600",
    shadow: "shadow-blue-500/20",
  },
  {
    icon: Wrench,
    title: "Industry-Scale Projects",
    desc: "Build systems that handle edge cases, state management, and deployment—not just 'Todo' apps.",
    color: "from-purple-400 to-fuchsia-600",
    shadow: "shadow-purple-500/20",
  },
  {
    icon: IndianRupee,
    title: "Democratized Access",
    desc: "Top-tier engineering mentorship shouldn't cost a fortune. High-quality education at a fraction of the market price.",
    color: "from-emerald-400 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
];

const ParallaxFeature = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Unique parallax speeds for each element inside the "card"
  const y = useTransform(scrollYProgress, [0, 1], [0, -150 * (index + 1) * 0.2]);
  const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -5 : 5, index % 2 === 0 ? 5 : -5]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, rotateZ: rotate }}
      className={`relative mb-32 ml-auto mr-auto flex max-w-xl flex-col items-start gap-4 rounded-[2.5rem] bg-zinc-900/50 p-10 backdrop-blur-2xl border border-white/5 ${feature.shadow} shadow-2xl lg:ml-${index % 2 === 0 ? '20' : 'auto'} lg:mr-${index % 2 !== 0 ? '20' : 'auto'}`}
    >
      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} p-4 text-black`}>
        <feature.icon size={32} strokeWidth={2.5} />
      </div>
      
      <h3 className={`bg-gradient-to-r ${feature.color} bg-clip-text text-3xl font-black text-transparent`}>
        {feature.title}
      </h3>
      
      <p className="text-lg leading-relaxed text-zinc-400">
        {feature.desc}
      </p>

      {/* Floating Decorative Element */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${feature.color} opacity-10 blur-2xl`} 
      />
    </motion.div>
  );
};

export default function WhyCodeNFacts() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section ref={containerRef} className="relative min-h-screen bg-[#050505] py-20">
      {/* Background Animated Orb */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{
            background: useTransform(
              scrollYProgress,
              [0, 0.3, 0.6, 1],
              ["radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)", 
               "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)", 
               "radial-gradient(circle, rgba(232,121,249,0.1) 0%, transparent 70%)", 
               "radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)"]
            )
          }}
          className="absolute inset-0 transition-colors duration-1000"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Sticky Header Section */}
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:sticky lg:top-32 lg:h-fit lg:w-1/3">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
            >
              <h2 className="text-6xl font-black tracking-tighter text-white sm:text-8xl">
                WHY<br />
                <span className="text-zinc-700">NOT</span><br />
                YOUTUBE?
              </h2>
              <div className="mt-8 h-1 w-24 bg-white" />
              <p className="mt-8 text-xl text-zinc-500">
                YouTube is for watching. <br />
                <span className="text-white">CodeNFacts is for becoming.</span>
              </p>
              
              {/* Progress Tracker */}
              <div className="mt-12 hidden lg:block">
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-zinc-600">Evolution Progress</p>
                <div className="h-[2px] w-full bg-zinc-800">
                  <motion.div 
                    style={{ scaleX }} 
                    className="h-full origin-left bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scrolling Content */}
          <div className="flex-1 pb-32">
            {features.map((feature, i) => (
              <ParallaxFeature key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom transition gradient */}
      <div className="absolute bottom-0 h-64 w-full bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}