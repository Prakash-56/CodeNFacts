'use client';

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function CodeNFactsAdvantage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Scoping the scroll specifically to this section's boundaries
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
  });

  // Background Transforms (Scoped only to this section)
  const rotateX = useTransform(smoothProgress, [0, 1], [55, 75]);
  const translateZ = useTransform(smoothProgress, [0, 1], [0, -300]);
  const gridOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    /* Using 'relative' and 'z-0' ensures this section stays in the 
       normal document flow without overlapping your global Nav or Footer.
    */
    <section 
      ref={sectionRef} 
      className="relative min-h-[500vh] bg-black overflow-clip"
    >
      {/* --- SCOPED 3D BACKGROUND --- 
          The 'absolute' here is relative to this section, 
          and 'clip-path' ensures nothing renders outside these bounds. 
      */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
        <motion.div 
          style={{ 
            rotateX, 
            translateZ, 
            opacity: gridOpacity,
            perspective: '1200px'
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Virtual Grid Floor */}
          <div className="absolute h-[250%] w-[200%] top-[-50%] bg-[linear-gradient(to_right,#312e81_1px,transparent_1px),linear-gradient(to_bottom,#312e81_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)]" />
          
          {/* Isolated Glows */}
          <div className="absolute w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
        </motion.div>
      </div>

      {/* --- CONTENT LAYERS --- */}
      <div className="relative z-10">
        
        {/* Sticky Hero Reveal */}
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <motion.div
            style={{
              opacity: useTransform(smoothProgress, [0, 0.1, 0.2], [0, 1, 0]),
              scale: useTransform(smoothProgress, [0, 0.1], [0.8, 1]),
            }}
            className="text-center"
          >
            <h2 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter">
              The <span className="text-indigo-500">Advantages</span>
            </h2>
            <p className="mt-4 font-mono text-indigo-400 tracking-[0.5em] uppercase text-xs">
              Optimized for Growth
            </p>
          </motion.div>
        </div>

        {/* Scrolling Truths */}
        <div className="max-w-6xl mx-auto px-6 space-y-[60vh] pb-[40vh] -mt-[30vh]">
          <TruthBlock 
            num="01" 
            title="Clarity compounds faster than effort." 
            desc="Most people work harder. We teach you to think better." 
          />
          <TruthBlock 
            num="02" 
            title="Progress isn't linear. Insight is." 
            desc="One fundamental shift saves years of trial and error." 
          />
          <TruthBlock 
            num="03" 
            title="Understanding beats memorization." 
            desc="Don't just pass tests. Master the architecture of logic." 
          />
          <TruthBlock 
            num="04" 
            title="Systems outperform motivation." 
            desc="Motivation gets you started. Systems keep you scaling." 
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Advanced Component: TruthBlock ---------- */

function TruthBlock({ num, title, desc }: { num: string; title: string; desc: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-25% 0px -25% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.8 }}
      className="relative pl-12 md:pl-20 border-l border-white/10"
    >
      <span className="absolute -left-4 top-0 text-sm font-mono text-indigo-500 bg-black py-1">
        [{num}]
      </span>
      
      <motion.h3 
        className="text-4xl md:text-7xl font-bold text-white mb-6 leading-[1.1]"
        animate={isInView ? { color: "#ffffff" } : { color: "#404040" }}
      >
        {title}
      </motion.h3>
      
      <p className="text-lg md:text-2xl text-gray-400 max-w-2xl font-light">
        {desc}
      </p>

      {/* Visual Accent: Progress bar that fills when the block is in center view */}
      <div className="mt-10 h-[2px] w-32 bg-white/5 overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={isInView ? { x: "0%" } : { x: "-100%" }}
          transition={{ duration: 1, ease: "circOut" }}
          className="h-full w-full bg-indigo-500"
        />
      </div>
    </motion.div>
  );
}