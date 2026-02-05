'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const reasons = [
  {
    title: 'Learning Alone Is Slow',
    desc: 'You waste months guessing what matters. Direction changes everything.',
  },
  {
    title: 'Tutorials Don’t Build Thinking',
    desc: 'Real engineering is about decisions, trade-offs, and patterns.',
  },
  {
    title: 'Industry Is Not Linear',
    desc: 'What companies expect is never taught in the right order.',
  },
  {
    title: 'Guidance Beats Motivation',
    desc: 'Discipline comes from clarity — not hype.',
  },
];

export default function WhyNeedUs() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const lineScale = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-64 overflow-hidden bg-[#05060f]"
    >
      {/* 🌌 Deep animated background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb22,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#7c3aed22,transparent_60%)]" />
      </motion.div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center text-4xl md:text-7xl font-bold text-white mb-20 md:mb-40 tracking-tight"
        >
          Why You Need Us
        </motion.h2>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical spine - Center on PC, Left on Mobile */}
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute left-4 md:left-1/2 top-0 w-[2px] h-full bg-gradient-to-b from-blue-500 via-purple-500 to-transparent origin-top -translate-x-1/2"
          />

          {/* Reasons */}
          <div className="space-y-24 md:space-y-48">
            {reasons.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`relative flex items-center w-full ${
                  i % 2 === 0 
                    ? 'md:justify-start' 
                    : 'md:justify-end'
                } justify-start pl-12 md:pl-0`}
              >
                {/* Content Card */}
                <motion.div
                  whileInView={{ x: 0 }}
                  initial={{ x: i % 2 === 0 ? -20 : 20 }}
                  transition={{ duration: 0.6 }}
                  className={`w-full md:w-[45%] ${
                    i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                  }`}
                >
                  <div className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-2xl backdrop-blur-sm hover:border-blue-500/50 transition-colors duration-300">
                    <h3 className="text-2xl md:text-4xl font-semibold text-white mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-base md:text-xl leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>

                {/* Desktop Dot Indicator */}
                <div className="absolute left-[-2px] md:left-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] -translate-x-1/2 z-10 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}