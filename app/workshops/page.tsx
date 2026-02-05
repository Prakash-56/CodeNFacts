'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function WorkshopUltra() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="bg-[#020202] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* 1. PROGRESS LASER LINE */}
      <motion.div 
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-purple-600 z-[100] origin-left"
      />

      {/* 2. ATMOSPHERIC BACKGROUND */}
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed inset-0 pointer-events-none opacity-30 z-0"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[70%] md:w-[50%] h-[50%] bg-purple-900/40 blur-[80px] md:blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] md:w-[50%] h-[50%] bg-cyan-900/30 blur-[80px] md:blur-[150px] rounded-full" />
      </motion.div>

      {/* 3. HERO SECTION */}
      <section className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="px-3 py-1 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full">
              System Initialization: 2026
            </span>
            <h1 className="mt-6 md:mt-8 text-6xl sm:text-7xl md:text-[10vw] font-black leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
              Code <span className="text-white">N</span> Facts
            </h1>
            <p className="mt-4 text-gray-500 font-mono tracking-widest text-[10px] md:text-sm uppercase">
              // Neural Architecture Workshops
            </p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(to_right,#1e1e1e_1px,transparent_1px),linear-gradient(to_bottom,#1e1e1e_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px] [perspective:500px] [transform:rotateX(60deg)] opacity-20" />
      </section>

      {/* 4. FLASHLIGHT SECTION */}
      <FlashlightSection />

      {/* 5. DATA GRID SECTION */}
      <section className="py-24 md:py-60 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32">
          <div className="space-y-12 md:space-y-20">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight md:leading-none">
              Why we <br className="hidden md:block"/> <span className="italic text-cyan-500 underline decoration-cyan-500/30">delete</span> fluff.
            </h2>
            <div className="space-y-8">
                <DataPoint number="98%" label="Practical Implementation" />
                <DataPoint number="0%" label="Powerpoint Slides" />
                <DataPoint number="1:1" label="Expert Feedback" />
            </div>
          </div>
          
          <div className="relative">
             <div className="lg:sticky lg:top-40 aspect-square rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-8 md:p-12 overflow-hidden group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
                <div className="relative h-full flex flex-col justify-between">
                   <div className="text-[10px] md:text-sm font-mono text-cyan-400">STATUS_OK // CORE_CONCEPTS</div>
                   <div className="text-2xl md:text-4xl font-light leading-snug">
                     "We don't teach you how to use a tool. We teach you how to <span className="font-bold text-white">invent</span> the tool."
                   </div>
                   <div className="h-px w-full bg-white/20" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. TIMELINE */}
      <section className="py-20 md:py-40 border-t border-white/5">
        <h3 className="text-center text-[10px] md:text-sm font-mono uppercase tracking-[0.5em] md:tracking-[1em] mb-12 md:mb-20 text-gray-600 px-4">The Path to Mastery</h3>
        <div className="flex flex-col gap-20 md:gap-40 overflow-hidden">
           <StepRow title="DECONSTRUCTION" desc="Break your existing bad habits. Wipe the slate clean." side="left" />
           <StepRow title="RAW ENGINEERING" desc="Building systems from the hardware up. No abstractions." side="right" />
           <StepRow title="SCALABILITY" desc="From 1 user to 1 million. Designing for the void." side="left" />
        </div>
      </section>

      {/* 7. FINAL CALL */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-20">
        <motion.div 
          whileInView={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-cyan-500/20 blur-[80px] md:blur-[120px] rounded-full" 
        />
        <h2 className="text-5xl sm:text-7xl md:text-[12vw] font-black z-10 text-center leading-none">JOIN THE <br/> REVOLUTION.</h2>
        <motion.button 
          whileHover={{ scale: 1.05, letterSpacing: "0.1em" }}
          whileTap={{ scale: 0.95 }}
          className="mt-12 px-10 md:px-16 py-6 md:py-8 bg-white text-black font-black uppercase text-lg md:text-xl rounded-none hover:bg-cyan-400 transition-all z-10 w-full max-w-xs md:max-w-none"
        >
          Secure Your Slot
        </motion.button>
      </section>
    </div>
  );
}

function DataPoint({ number, label }: { number: string, label: string }) {
  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="border-l-4 border-cyan-500 pl-6 md:pl-8"
    >
      <div className="text-5xl md:text-7xl font-black">{number}</div>
      <div className="text-[10px] md:text-sm font-mono uppercase tracking-widest text-gray-500">{label}</div>
    </motion.div>
  );
}

function StepRow({ title, desc, side }: any) {
  return (
    <motion.div 
      initial={{ x: side === 'left' ? -50 : 50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`flex w-full px-6 md:px-10 ${side === 'right' ? 'justify-end text-right' : 'justify-start'}`}
    >
      <div className="max-w-xl">
        <h4 className="text-3xl md:text-6xl font-black tracking-tighter mb-4">{title}</h4>
        <p className="text-base md:text-xl text-gray-500">{desc}</p>
      </div>
    </motion.div>
  );
}

function FlashlightSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback for mobile: flashlight follows a slow automated path or centers
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
       setMousePos({ x: window.innerWidth / 2, y: 300 });
       setIsHovering(true);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsHovering(true);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative h-[60vh] md:h-screen bg-[#050505] flex items-center justify-center overflow-hidden border-y border-white/5 cursor-none px-6"
    >
      <div 
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-500"
        style={{
          background: isHovering 
            ? `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.97) 80%)`
            : `radial-gradient(circle 0px at 50% 50%, transparent 0%, rgba(0,0,0,1) 100%)`,
        }}
      />
      <div className="max-w-4xl text-center relative z-10">
        <h2 className="text-2xl md:text-5xl lg:text-7xl font-bold leading-tight">
          "The best engineers don't watch tutorials. They <span className="text-cyan-400">read documentation</span> and experiment until it breaks."
        </h2>
        <p className="mt-10 text-cyan-500 font-mono tracking-widest text-[10px] md:text-sm">
          {typeof window !== 'undefined' && window.innerWidth < 768 ? '[ TOUCH TO EXPLORE ]' : '[ HOVER TO UNCOVER THE TRUTH ]'}
        </p>
      </div>
    </section>
  );
}