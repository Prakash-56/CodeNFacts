'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

const challenges = [
  {
    title: 'Debugging Headaches',
    desc: 'Invisible bugs, misleading errors, and broken mental models.',
  },
  {
    title: 'Learning Curve',
    desc: 'Abstract theory without practical anchors slows real understanding.',
  },
  {
    title: 'Time Management',
    desc: 'Context switching kills momentum and deep focus.',
  },
  {
    title: 'Project Execution',
    desc: 'Too many moving parts make starting feel impossible.',
  },
  {
    title: 'Imposter Syndrome',
    desc: 'Growth happens silently while doubt stays loud.',
  },
];

export default function CodingChallenges() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const bgX = useTransform(mouseX, [-0.5, 0.5], ['-5%', '5%']);
  const bgY = useTransform(mouseY, [-0.5, 0.5], ['-5%', '5%']);

  return (
    <section className="relative overflow-hidden py-40 px-6 bg-[#06060b] text-white">
      {/* Reactive background */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 -z-10
        bg-[linear-gradient(120deg,rgba(168,85,247,0.12),transparent_40%),linear-gradient(300deg,rgba(236,72,153,0.12),transparent_40%)]"
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="max-w-5xl mx-auto mb-32"
      >
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Where Coding Breaks
        </h2>
        <p className="mt-6 text-gray-400 max-w-3xl text-lg md:text-xl">
          Not syntax. Not tools. These are the real fractures.
        </p>
      </motion.div>

      {/* Fractured Layout */}
      <div className="max-w-6xl mx-auto relative">
        {challenges.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeInOut' }}
            className="mb-24"
          >
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <span className="text-sm tracking-widest text-purple-400">
                {`0${i + 1}`}
              </span>

              <h3 className="md:col-span-2 text-3xl md:text-4xl font-bold">
                {item.title}
              </h3>

              <p className="md:col-start-2 md:col-span-2 text-gray-400 leading-relaxed text-base md:text-lg">
                {item.desc}
              </p>
            </div>

            {/* Fracture line */}
            <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
