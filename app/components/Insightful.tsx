'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function InsightSection() {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll-based parallax for subtle movement
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const yText = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.9, 1]);

  return (
    <section
      ref={ref}
      className="relative min-h-[60vh] flex items-center justify-center px-6 bg-black overflow-hidden"
    >
      {/* Background subtle radial glow */}
      <motion.div
        style={{ opacity: opacityText }}
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_70%)]"
      />

      {/* Floating noise */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] bg-[url('/noise.png')]" />

      {/* Core Text */}
      <motion.div
        style={{ y: yText, opacity: opacityText }}
        className="max-w-4xl text-center space-y-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="text-4xl md:text-6xl font-bold text-white tracking-tight"
        >
          Most people aren’t lost because they lack effort.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 1.4, ease: 'easeOut' }}
          className="text-lg md:text-2xl text-gray-300 leading-relaxed"
        >
          They’re lost because guidance wasn’t made for how their mind actually thinks.  
          <br />
          At <span className="text-indigo-400">CodeNFacts</span>, we don’t just give content -  
          we remove friction until clarity feels natural.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 1.4, ease: 'easeOut' }}
          className="text-gray-400 text-lg md:text-xl"
        >
          Understanding compounds. Doing it right once is worth more than hours of trial.  
          <span className="text-white block mt-2">Learn once. Understand forever.</span>
        </motion.p>
      </motion.div>
    </section>
  );
}
