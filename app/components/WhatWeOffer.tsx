'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import Link from 'next/link';

const offers = [
  {
    title: 'Projects',
    desc: 'Where abstractions break and responsibility begins.',
    strength: 40,
    link: '/projects',
  },
  {
    title: 'Guidance',
    desc: 'Direction shaped by experience, not motivation.',
    strength: 28,
    link: '/guidance',
  },
  {
    title: 'Community',
    desc: 'A place where unclear thinking is challenged.',
    strength: 22,
    link: '/communities',
  },
  {
    title: 'Workshops',
    desc: 'Watching experts reason, hesitate, and decide.',
    strength: 32,
    link: '/workshops',
  },
];

export default function WhatWeOffer() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return (
    <section className="relative min-h-screen bg-black overflow-hidden px-6 py-32">

      {/* subtle grain */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('/noise.png')]" />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="mb-24 text-center"
      >
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-white">
          What We Offer
        </h2>
        <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
          Not features.  
          <span className="text-white"> Forces that shape how you think.</span>
        </p>
      </motion.div>

      {/* Thinking surface */}
      <div className="relative mx-auto max-w-6xl grid gap-y-28 md:grid-cols-2">

        {offers.map((item, i) => {
          // Reduce motion on mobile automatically
          const x = useTransform(
            mouseX,
            [-600, 600],
            [-item.strength, item.strength]
          );

          const y = useTransform(
            mouseY,
            [-400, 400],
            [-item.strength / 1.5, item.strength / 1.5]
          );

          return (
            <motion.div
              key={item.title}
              style={{ x, y }}
              className={`max-w-xl space-y-6 ${
                i % 2 === 0
                  ? 'md:text-left'
                  : 'md:text-right md:ml-auto'
              } text-center md:text-inherit`}
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight"
              >
                {item.title}
              </motion.h3>

              {/* Divider */}
              <div
                className={`h-[2px] w-20 bg-gradient-to-r from-indigo-400 to-cyan-400 mx-auto md:mx-0 ${
                  i % 2 !== 0 ? 'md:ml-auto' : ''
                }`}
              />

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.9 }}
                viewport={{ once: true }}
                className="text-lg text-gray-400 leading-relaxed"
              >
                {item.desc}
              </motion.p>

              {/* Explore link */}
              <motion.div
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 120 }}
                className={`inline-block ${
                  i % 2 !== 0 ? 'md:ml-auto' : ''
                }`}
              >
                <Link
                  href={item.link}
                  className="text-sm tracking-widest uppercase text-indigo-400 hover:text-cyan-400 transition-colors"
                >
                  Explore →
                </Link>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
