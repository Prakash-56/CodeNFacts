'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function Counter({
  value,
  label,
  duration = 2000,
}: {
  value: number;
  label: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = value / (duration / 16);
    const step = () => {
      start += increment;
      if (start < value) {
        setCount(Math.floor(start));
        requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return (
    <div ref={ref} className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl transition-all hover:bg-white/10 hover:border-white/20 group">
      <p className="text-6xl font-extrabold text-white group-hover:scale-110 transition-transform duration-500">
        {count.toLocaleString()}
        {label.includes('consistent') && '%'}
        {label.includes('practice') && '+'}
      </p>
      <p className="mt-3 text-gray-400 text-sm uppercase tracking-widest font-medium">{label}</p>
    </div>
  );
}

export default function HappyLearners() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // 3D Transforms
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.8, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [25, 0]);
  const translateZ = useTransform(scrollYProgress, [0, 0.4], [-200, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[180vh] bg-[#020202] overflow-hidden flex items-center justify-center"
      style={{ perspective: '1500px' }}
    >
      {/* 1. 3D Background Grid */}
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)',
          transform: 'rotateX(60deg) scale(2) translateY(-20%)',
        }}
      />

      {/* 2. Floating Glass Orbs (Apple-style depth) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -100, 0], x: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ y: [0, 150, 0], x: [0, -80, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" 
        />
      </div>

      {/* 3. Main 3D Container */}
      <motion.div
        style={{ 
          scale, 
          rotateX, 
          z: translateZ,
          opacity 
        }}
        className="relative z-10 max-w-7xl text-center px-6"
      >
        <div className="mb-4">
          <span className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium tracking-wide">
             The Results of Deep Work
          </span>
        </div>

        <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tight">
          Happy <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">Learners</span>
        </h2>

        <motion.p className="mt-8 text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Not because it was easy. Because they broke through the 
          <span className="text-white"> complexity wall.</span>
        </motion.p>

        {/* 4. Glass Counter Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Counter value={10000} label="Hours of deep practice" />
          <Counter value={92} label="Learners stayed consistent" />
          <Counter value={0} label="Fluff concepts" />
        </div>

        {/* 5. 3D Glowing Divider */}
        <motion.div
          className="mt-32 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5 }}
        />

        <motion.p
          className="mt-12 text-2xl md:text-3xl text-gray-500 italic font-light"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          "Confusion is just the doorstep to <span className="text-blue-400 font-normal">mastery</span>."
        </motion.p>
      </motion.div>
    </section>
  );
}