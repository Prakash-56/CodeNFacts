'use client';

import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function PremiumCounter({
  value,
  label,
  suffix = '',
  duration = 2800,
}: {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shineX = useSpring(useTransform(mouseX, [-100, 100], [-20, 20]));
  const shineY = useSpring(useTransform(mouseY, [-100, 100], [-20, 20]));

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = value / (duration / 16);
    let rafId: number;

    const step = () => {
      start += increment;
      if (start < value) {
        setCount(Math.floor(start));
        rafId = requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, value, duration]);

  return (
    <motion.div
      ref={ref}
      className="group relative overflow-hidden rounded-3xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-700 hover:shadow-[0_16px_60px_rgba(59,130,246,0.18)] hover:border-blue-500/20"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      whileHover={{ scale: 1.04, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {/* Shine / holographic overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${shineX}px ${shineY}px, rgba(255,255,255,0.14) 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 p-10 text-center">
        <p className="text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_4px_12px_rgba(59,130,246,0.4)] group-hover:drop-shadow-[0_6px_20px_rgba(59,130,246,0.6)] transition-all duration-700">
          {count.toLocaleString()}
          {suffix}
        </p>
        <p className="mt-5 text-sm md:text-base uppercase tracking-[0.25em] font-semibold text-blue-300/90 group-hover:text-blue-200 transition-colors">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

export default function HappyLearners() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smoother & more dramatic 3D entrance
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.75, 0.92, 1.02, 0.98]);
  const rotateX = useTransform(scrollYProgress, [0, 0.4, 0.7], [35, 8, 0]);
  const translateZ = useTransform(scrollYProgress, [0, 0.4], [-320, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0, 1, 1, 0.4]);

  // Gentle breathing background gradient
  const bgGradient = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "radial-gradient(ellipse at 30% 70%, rgba(59,130,246,0.08), transparent 60%)",
      "radial-gradient(ellipse at 70% 30%, rgba(139,92,246,0.11), transparent 60%)",
      "radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.07), transparent 60%)",
    ]
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[180vh] py-40 bg-gradient-to-b from-[#0a0015] via-[#02020a] to-[#000000] overflow-hidden flex items-center justify-center"
      style={{ perspective: "1800px" }}
    >
      {/* Animated breathing background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: bgGradient, opacity: 0.7 }}
      />

      {/* Subtle animated orbs – more premium feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[15%] left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-600/10 via-indigo-500/5 to-transparent rounded-full blur-3xl"
          animate={{
            x: ["0%", "12%", "-8%", "0%"],
            y: ["0%", "-15%", "10%", "0%"],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[8%] w-[800px] h-[800px] bg-gradient-to-tl from-purple-600/8 via-fuchsia-500/4 to-transparent rounded-full blur-[180px]"
          animate={{
            x: ["0%", "-10%", "15%", "0%"],
            y: ["0%", "18%", "-12%", "0%"],
            scale: [1, 1.1, 0.92, 1],
          }}
          transition={{ duration: 34, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      {/* Very subtle animated grid – less visible */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #4f4f4f 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main premium content container */}
      <motion.div
        style={{
          scale,
          rotateX,
          z: translateZ,
          opacity,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 max-w-7xl px-6 md:px-12 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <span className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600/15 to-purple-600/10 border border-blue-400/20 text-blue-300 font-medium tracking-wider text-sm uppercase backdrop-blur-md shadow-inner">
            Mastery Through Clarity
          </span>
        </motion.div>

        <motion.h2
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        >
          Happy
          <br className="md:hidden" />
          <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent"> Learners</span>
        </motion.h2>

        <motion.p
          className="mt-10 text-xl md:text-2xl lg:text-3xl text-gray-300/90 max-w-4xl mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2 }}
        >
          They didn’t find learning easy.
          <br className="hidden md:block" />
          They learned to love <span className="text-white font-normal">the struggle</span> that precedes clarity.
        </motion.p>

        {/* Premium counter grid */}
        <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <PremiumCounter value={10000} label="Hours of deliberate practice" />
          <PremiumCounter value={92} label="Learners with >90% consistency" suffix="%" />
          <PremiumCounter value={0} label="Fluff • shortcuts • excuses" />
        </div>

        {/* Elegant glowing divider + quote */}
        <motion.div
          className="mt-40 h-px w-full bg-gradient-to-r from-transparent via-blue-400/40 via-50% to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        <motion.blockquote
          className="mt-16 text-3xl md:text-4xl lg:text-5xl font-light italic text-gray-200/80 max-w-5xl mx-auto leading-tight drop-shadow-md"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1.4 }}
        >
          “The moment of <span className="text-blue-300 font-normal not-italic">most resistance</span><br />
          is usually <span className="text-white">closest to breakthrough</span>.”
        </motion.blockquote>
      </motion.div>
    </section>
  );
}