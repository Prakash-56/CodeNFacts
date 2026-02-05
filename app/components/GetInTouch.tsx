'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const signals = [
  'Mentorship Signals',
  'Collaboration Requests',
  'Course Enquiries',
  'Community Access',
  'Career Opportunities',
  'Ideas Worth Building',
];

export default function GetInTouch() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.08]);
  const glow = useTransform(scrollYProgress, [0, 1], [0.35, 0.85]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[1100px] overflow-hidden bg-black py-48 px-6 flex items-center justify-center"
    >
      {/* Ambient void */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />

      {/* HEADER – more distance from portal */}
      <motion.div
        className="absolute top-24 sm:top-28 md:top-32 text-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-5">
          Get in Touch
        </h2>
        <p className="text-gray-400 text-lg md:text-xl">
          All conversations enter the same portal.
        </p>
      </motion.div>

      {/* ENERGY PORTAL */}
      <motion.div
        style={{ rotate, scale }}
        className="
          relative
          w-[300px] h-[300px]
          sm:w-[380px] sm:h-[380px]
          md:w-[480px] md:h-[480px]
          lg:w-[540px] lg:h-[540px]
        "
      >
        {/* Outer glow ring */}
        <motion.div
          style={{ opacity: glow }}
          className="
            absolute inset-0 rounded-full
            bg-[conic-gradient(from_0deg,#3b82f6,#a855f7,#ec4899,#3b82f6)]
            blur-xl
          "
        />

        {/* Thin structure ring */}
        <div className="absolute inset-[14%] rounded-full border border-white/20" />

        {/* Inner void */}
        <div className="absolute inset-[22%] rounded-full bg-black shadow-[inset_0_0_90px_rgba(0,0,0,0.95)]" />

        {/* SIGNAL TEXTS – slightly larger */}
        {signals.map((text, i) => {
          const angle = (360 / signals.length) * i;

          return (
            <motion.div
              key={i}
              style={{ rotate: angle }}
              className="absolute inset-0 flex items-start justify-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="
                  text-white/85
                  text-sm sm:text-base md:text-lg
                  tracking-widest font-medium
                  translate-y-[-18px]
                "
                style={{
                  transform: `rotate(${-angle}deg)`,
                }}
              >
                {text}
              </motion.p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CTA – more distance from portal */}
      <motion.a
        href="/contact"
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="
          absolute bottom-24 sm:bottom-28 md:bottom-32
          px-16 py-5 rounded-full
          text-lg font-semibold text-white
          bg-white/10 backdrop-blur-xl
          border border-white/20
          hover:scale-110 transition-all
        "
      >
        Enter the Portal
      </motion.a>
    </section>
  );
}
