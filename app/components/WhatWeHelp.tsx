'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const helps = [
  {
    id: "01",
    title: 'Confusion & Overwhelm',
    desc: 'Too many resources, no clear path. We give you structured, guided learning.',
    color: 'from-blue-600 to-cyan-500',
  },
  {
    id: "02",
    title: 'Lack of Real Projects',
    desc: 'We help you build real, resume-ready projects that matter.',
    color: 'from-purple-600 to-pink-500',
  },
  {
    id: "03",
    title: 'Interview Fear',
    desc: 'Practice real interview patterns, not random questions.',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: "04",
    title: 'Low Confidence',
    desc: 'Consistency + clarity builds confidence. We stay with you.',
    color: 'from-emerald-500 to-teal-500',
  },
];

export default function WhatWeHelp() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section ref={containerRef} className="relative bg-[#05050A] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-20 text-center md:text-left">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-blue-500 font-mono tracking-widest uppercase text-sm"
          >
            The Blockers
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mt-4"
          >
            What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Solve</span>
          </motion.h2>
        </div>

        {/* Sticky Reveal Items */}
        <div className="flex flex-col gap-10 md:gap-20">
          {helps.map((item, index) => (
            <ScrollItem key={index} item={item} index={index} total={helps.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ScrollItem({ item, index, total }: { item: any; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of this specific item relative to the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"]
  });

  // Advanced animations: Scale up and Fade in
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ 
        scale, 
        opacity,
        position: 'sticky',
        top: `${150 + index * 40}px` // Layers items as you scroll
      }}
      className="group relative w-full"
    >
      <div className="flex flex-col md:flex-row items-center gap-8 p-1 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-2xl hover:border-white/20 transition-colors duration-500 shadow-2xl">
        
        {/* Index Number Circle */}
        <div className={`flex-shrink-0 w-20 h-20 md:w-32 md:h-32 rounded-[1.5rem] bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-3xl md:text-5xl font-black shadow-lg`}>
          {item.id}
        </div>

        {/* Content */}
        <div className="flex-grow p-4 md:p-8 text-center md:text-left">
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 group-hover:translate-x-2 transition-transform duration-300">
            {item.title}
          </h3>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed">
            {item.desc}
          </p>
        </div>

        {/* Decorative Background Element */}
        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${item.color} blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity`} />
      </div>
    </motion.div>
  );
}