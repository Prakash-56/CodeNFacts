'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const signals = [
  {
    title: 'Hands-On Learning',
    desc: 'Build real AI systems using Python, TensorFlow, PyTorch, and live datasets.',
  },
  {
    title: 'AI & ML Depth',
    desc: 'Neural networks, deep learning, and predictive intelligence - engineered, not explained.',
  },
  {
    title: 'Career-Grade Skills',
    desc: 'Workflows designed for real Data, ML, and AI roles.',
  },
  {
    title: 'Real-World Impact',
    desc: 'Solve real business problems using AI-driven decision making.',
  },
];

export default function DataAIDetails() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.15, 0.4, 0.2]);

  return (
    <section
      ref={ref}
      className="relative min-h-[220vh] bg-[#02040a] overflow-hidden px-6"
    >
      {/* Dynamic Noise Background */}
      <motion.div
        style={{ scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0 -z-10
                   bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)]
                   bg-[size:32px_32px]"
      />

      {/* Floating Energy Orbs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-500/30 blur-3xl"
          style={{
            width: 200,
            height: 200,
            top: `${10 + i * 12}%`,
            left: `${(i * 17) % 90}%`,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, 40, 0],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Sticky Intelligence Zone */}
      <div className="sticky top-0 min-h-screen flex flex-col justify-center">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="max-w-5xl mx-auto text-center
                     mt-16 md:mt-28 mb-20"
        >
          <motion.h2
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Intelligence
            <br />
            <span className="text-blue-400">
              Doesn’t Come From Slides
            </span>
          </motion.h2>

          <motion.p
            className="text-gray-400 text-lg md:text-xl"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
          >
            You don’t learn AI - you engineer it.
          </motion.p>
        </motion.div>

        {/* Signal Text Field */}
        <div className="relative max-w-6xl mx-auto w-full space-y-24">
          {signals.map((s, i) => {
            const offset = i * 0.18;
            const y = useTransform(
              scrollYProgress,
              [offset, offset + 0.25],
              [80, 0]
            );
            const opacity = useTransform(
              scrollYProgress,
              [offset, offset + 0.15],
              [0, 1]
            );

            return (
              <motion.div
                key={i}
                style={{ y, opacity }}
                className={`relative max-w-xl ${
                  i % 2 === 0
                    ? 'md:mr-auto'
                    : 'md:ml-auto'
                }`}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {s.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {s.desc}
                </p>

                <motion.div
                  className="mt-6 h-[2px] w-full bg-gradient-to-r from-blue-500 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  style={{ transformOrigin: 'left' }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        className="relative z-10 mt-[40vh] text-center"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <motion.a
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.96 }}
          href="/courses/ai-ml/apply?price=4999"
          className="inline-flex items-center px-16 py-6 rounded-full
                     bg-blue-500 text-black text-xl font-extrabold
                     shadow-[0_0_60px_rgba(59,130,246,0.7)]"
        >
          Enter the AI Zone · ₹4999
        </motion.a>
      </motion.div>
    </section>
  );
}
