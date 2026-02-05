'use client';

import { motion, useReducedMotion } from 'framer-motion';

const lines = [
  'You don’t learn anything',
  'by memorizing patterns.',
  'You learn it',
  'by building things',
  'that can fail..',
];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen overflow-hidden pt-32">

      {/* 🎥 Background Video */}
      <motion.video
        src="/videos/CodeNFacts...mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        initial={{ scale: 1.15 }}
        animate={{ scale: reduceMotion ? 1 : 1.05 }}
        transition={{ duration: 14, ease: 'easeOut' }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* 🌑 Contrast overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/65 to-black/95" />

      {/* 🌌 Ambient depth */}
      <div className="absolute -top-40 left-1/4 w-[520px] h-[520px] bg-indigo-500/15 rounded-full blur-[160px]" />
      <div className="absolute bottom-0 right-1/4 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[160px]" />

      {/* 🧠 Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 flex items-center min-h-[70vh]">

        <div className="space-y-10">

          {/* Thoughtful headline */}
          <div className="space-y-4">
            {lines.map((line, index) => (
              <motion.h1
                key={line}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.25,
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1], // ultra-smooth
                }}
                className={`text-4xl md:text-6xl font-medium tracking-tight ${
                  line.includes('fail')
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
                    : 'text-white'
                }`}
              >
                {line}
              </motion.h1>
            ))}
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.6, duration: 1.2, ease: 'easeOut' }}
            className="origin-left h-[1px] w-32 bg-gradient-to-r from-indigo-400 to-cyan-400"
          />

          {/* Philosophy text */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 1 }}
            className="max-w-2xl text-lg md:text-xl text-gray-400 leading-relaxed"
          >
            CodeNFacts is built for those who want to understand
            <span className="text-white"> why systems behave the way they do</span>,
            not just how to make them work once.
          </motion.p>

          {/* Subtle closing thought */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 1 }}
            className="text-sm tracking-widest uppercase text-gray-500"
          >
            Learning through responsibility.
          </motion.p>

        </div>
      </div>
    </section>
  );
}
