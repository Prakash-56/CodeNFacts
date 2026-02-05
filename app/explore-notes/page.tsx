'use client';

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

const NOTES = [
  {
    title: 'Data Structures',
    subtitle: 'Think in shapes, not syntax',
    topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees'],
    gradient: 'from-indigo-600 via-cyan-400 to-transparent',
    accent: '#6366f1',
  },
  {
    title: 'Algorithms',
    subtitle: 'Patterns behind every solution',
    topics: ['Binary Search', 'Two Pointers', 'Sliding Window'],
    gradient: 'from-rose-600 via-pink-400 to-transparent',
    accent: '#f43f5e',
  },
  {
    title: 'System Design',
    subtitle: 'How real software is built',
    topics: ['Scalability', 'Caching', 'Load Balancing'],
    gradient: 'from-emerald-600 via-lime-400 to-transparent',
    accent: '#10b981',
  },
  {
    title: 'Interview Thinking',
    subtitle: 'What interviewers actually test',
    topics: ['Problem Framing', 'Tradeoffs', 'Communication'],
    gradient: 'from-orange-600 via-yellow-400 to-transparent',
    accent: '#f59e0b',
  },
];

export default function NotesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth scroll springs
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Hero animations
  const titleScale = useTransform(smoothProgress, [0, 0.2], [1, 0.85]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const titleBlur = useTransform(smoothProgress, [0, 0.15], [0, 10]);

  return (
    <section ref={containerRef} className="relative bg-[#050505] text-white">
      {/* ADVANCED BACKGROUND: Dynamic Mesh & Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
        <motion.div 
          style={{ 
            scale: useTransform(smoothProgress, [0, 1], [1, 1.5]),
            rotate: useTransform(smoothProgress, [0, 1], [0, 45])
          }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[140px] rounded-full" 
        />
        <motion.div 
          style={{ 
            scale: useTransform(smoothProgress, [0, 1], [1.2, 0.8]),
            x: useTransform(smoothProgress, [0, 1], [0, 100])
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/10 blur-[140px] rounded-full" 
        />
      </div>

      {/* STICKY HERO */}
      <div className="sticky top-0 h-screen flex items-center justify-center z-10 overflow-hidden">
        <motion.div
          style={{ scale: titleScale, opacity: titleOpacity, filter: `blur(${titleBlur}px)` }}
          className="text-center px-6"
        >
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none">
            Notes <span className="text-white/20">that</span><br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              upgrade thinking
            </span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-gray-500 font-light tracking-widest uppercase">
            Built from first principles
          </p>
        </motion.div>
      </div>

      {/* KNOWLEDGE STREAMS: Stacking Effect */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 space-y-[30vh] pb-[30vh]">
        {NOTES.map((note, i) => (
          <KnowledgeStream key={i} {...note} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ---------------- Knowledge Stream Component ---------------- */

function KnowledgeStream({ title, subtitle, topics, gradient, accent, index }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      {/* Decorative Index */}
      <div className="absolute -left-12 top-0 text-white/5 text-9xl font-bold -z-10 select-none">
        0{index + 1}
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start pt-12 border-t border-white/10">
        
        {/* Left Side: Text Content */}
        <div className="space-y-8">
          <div className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium tracking-widest uppercase text-gray-400">
            Module 0{index + 1}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40">
              {title}
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-md">
              {subtitle}
            </p>
          </div>

          {/* Interactive Visualizer Mockup */}
          <div className="relative h-48 w-full rounded-2xl bg-white/5 overflow-hidden border border-white/5 group-hover:border-white/20 transition-colors">
            <div className={`absolute inset-0 bg-gradient-to-tr ${gradient} opacity-20`} />
            <motion.div 
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 0.95, 1]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center opacity-30"
            >
                {/* Visualizer Image Tag */}
                
            </motion.div>
          </div>
        </div>

        {/* Right Side: Topic List */}
        <div className="relative">
          <div className="space-y-2">
            {topics.map((topic: string, i: number) => (
              <TopicItem key={i} topic={topic} accent={accent} />
            ))}
          </div>
          
          {/* Subtle Glow on the side */}
          <div 
            className="absolute -right-20 top-0 w-40 h-full opacity-0 group-hover:opacity-20 transition-opacity blur-3xl pointer-events-none"
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function TopicItem({ topic, accent }: { topic: string; accent: string }) {
  return (
    <motion.div
      whileHover={{ x: 10 }}
      className="group/item flex items-center justify-between p-6 rounded-xl hover:bg-white/[0.03] transition-all cursor-pointer border border-transparent hover:border-white/5"
    >
      <div className="flex items-center gap-6">
        <div 
          className="w-1.5 h-1.5 rounded-full" 
          style={{ backgroundColor: accent }}
        />
        <span className="text-xl font-light text-gray-300 group-hover/item:text-white transition-colors">
          {topic}
        </span>
      </div>
      
      <div className="overflow-hidden w-6 h-6 relative">
        <motion.span 
          className="absolute inset-0 flex items-center justify-center group-hover/item:text-white text-gray-600"
          initial={{ x: -20, opacity: 0 }}
          whileHover={{ x: 0, opacity: 1 }}
        >
          →
        </motion.span>
      </div>
    </motion.div>
  );
}