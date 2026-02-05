'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

interface BubbleStyle {
  size: number;
  startX: string;
  endX1: string;
  endX2: string;
  endX3: string;
  duration: number;
}

// Fixed: Removed 'index' from the props since it wasn't being used inside the component
const Bubble = ({ style, delay }: { style: BubbleStyle; delay: number }) => {
  return (
    <motion.div
      initial={{ y: '110vh', x: style.startX, opacity: 0 }}
      animate={{
        y: '-20vh',
        opacity: [0, 0.3, 0],
        x: [style.endX1, style.endX2, style.endX3],
      }}
      transition={{
        duration: style.duration,
        repeat: Infinity,
        delay: delay,
        ease: "linear"
      }}
      className="absolute rounded-full bg-blue-500/10 blur-xl pointer-events-none"
      style={{ width: style.size, height: style.size }}
    />
  );
};

function Counter({ value, suffix = '+' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = Math.max(1, Math.floor(value / 60)); 
    const interval = setInterval(() => {
      current += step;
      if (current >= value) {
        current = value;
        clearInterval(interval);
      }
      setCount(current);
    }, 20);
    return () => clearInterval(interval);
  }, [value, inView]);

  return <motion.span onViewportEnter={() => setInView(true)}>{count}{suffix}</motion.span>;
}

export default function MentorshipSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [bubbleStyles, setBubbleStyles] = useState<BubbleStyle[]>([]);

  useEffect(() => {
    const generated = [...Array(12)].map(() => ({
      size: Math.random() * 100 + 20,
      startX: `${Math.random() * 100}vw`,
      endX1: `${Math.random() * 100}vw`,
      endX2: `${Math.random() * 100 + 5}vw`,
      endX3: `${Math.random() * 100 - 5}vw`,
      duration: Math.random() * 10 + 15,
    }));
    setBubbleStyles(generated);
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Mouse tilt logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Apply springs to the raw values for smoothness
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  // Transform the springs into rotation degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX / rect.width - 0.5);
    y.set(e.clientY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const truths = [
    "Your resume is the first code recruiters run — make it compile perfectly.",
    "One right conversation can save years of trial-error loops.",
    "Master key coding concepts before interviews to optimize your performance.",
    "A single 1:1 guidance session can reduce O(n²) effort into O(log n) growth.",
    "Clarity compounds faster than effort. One insight can unlock multiple levels."
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-32 md:py-44 px-6 bg-[#020617] text-white"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && bubbleStyles.map((style, i) => (
          // Fixed: Removed the 'index' prop here
          <Bubble key={i} style={style} delay={i * 2} />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full leading-[0] opacity-30">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[100px]">
          <motion.path
            animate={{ d: [
              "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.05,115.32,216,76,321.39,56.44Z",
              "M321.39,56.44c58,10.79,114.16,10.13,172,21.86,82.39,16.72,168.19,27.73,250.45,10.39C823.78,71,906.67,32,985.66,12.83c70.05-18.48,146.53-26.09,214.34-3V120H0V95.8C57.05,75.32,216,96,321.39,56.44Z"
            ]}}
            transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.05,115.32,216,76,321.39,56.44Z"
            fill="#2563eb"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            Optimize Your Career
          </h2>
          <motion.p 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="text-2xl md:text-3xl font-mono text-blue-400"
          >
            O(1) Guidance. <span className="text-white">O(n) Growth.</span>
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {truths.map((truth, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-3 group-hover:scale-150 transition-transform" />
                <p className="text-lg text-gray-300 group-hover:text-white transition-colors">{truth}</p>
              </motion.div>
            ))}

            <div className="pt-6">
              <Link
                href="/mentorship"
                className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-bold text-white transition duration-300 ease-out border-2 border-blue-500 rounded-full shadow-md group"
              >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
                  Get Started Now →
                </span>
                <span className="absolute flex items-center justify-center w-full h-full text-blue-500 transition-all duration-300 transform group-hover:translate-x-full ease">Apply for 1:1 Mentorship</span>
                <span className="relative invisible">Apply for 1:1 Mentorship</span>
              </Link>
            </div>
          </div>

          <motion.div
            style={{ rotateX, rotateY, perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <div className="relative rounded-[2rem] p-1 bg-gradient-to-br from-blue-500/50 to-purple-500/20">
              <div className="bg-[#0f172a]/90 backdrop-blur-2xl rounded-[1.9rem] p-10 md:p-14 border border-white/10 overflow-hidden">
                <div className="grid grid-cols-2 gap-y-12 gap-x-8 relative z-10">
                  {[
                    { label: "Sessions", val: 500 },
                    { label: "Resumes", val: 350 },
                    { label: "Switches", val: 140 },
                    { label: "Clarity", val: 97, s: "%" }
                  ].map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="text-4xl md:text-5xl font-black text-white mb-1">
                        <Counter value={stat.val} suffix={stat.s} />
                      </div>
                      <p className="text-blue-400 font-medium tracking-widest uppercase text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 text-center"
        >
          <p className="text-gray-500 italic text-xl border-t border-white/5 pt-10 inline-block">
            "Think of growth like algorithm optimization: Reduce redundant loops, maximize output."
          </p>
        </motion.div>
      </div>
    </section>
  );
}