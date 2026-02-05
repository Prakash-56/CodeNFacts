'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

export default function GuidanceExplore() {
  const containerRef = useRef(null);
  
  // Smooth scroll progress for physics-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Transform values for spatial depth
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="bg-[#050508] text-white overflow-x-hidden">
      
      {/* 1. THE ATMOSPHERIC CORE (Background depth) */}
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
        {/* Animated Grid Floor */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </motion.div>

      {/* 2. HERO SECTION: THE SHARPENING */}
      <section className="h-screen flex flex-col justify-center items-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5 }}
          className="text-center"
        >
          <motion.span className="text-blue-500 font-mono tracking-[0.3em] uppercase text-sm mb-4 block">
            Engineering Methodology 2.0
          </motion.span>
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            SHARPEN.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto">
            We don’t hand out answers. We strip away the noise until only the 
            <span className="text-white"> right questions</span> remain.
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 w-px h-20 bg-gradient-to-b from-blue-500 to-transparent" 
        />
      </section>

      {/* 3. THE "GUIDANCE PATH" (Vertical Experience) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Left Column: Floating Explanation */}
          <div className="md:col-span-5 sticky top-32 h-fit space-y-8">
            <h2 className="text-5xl font-bold leading-[1.1]">
              Guidance for the <br /> 
              <span className="italic text-blue-400 font-serif">Uncertain.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Standard tutorials lead you by the hand. We force you to stand on your own. 
              Our guidance protocol is designed to simulate the "Senior Engineer Crisis"—where 
              there is no documentation, and the clock is ticking.
            </p>
            <div className="flex gap-4">
              <div className="h-px w-12 bg-blue-500 self-center" />
              <span className="text-xs uppercase tracking-widest text-blue-500 font-bold">The Protocol</span>
            </div>
          </div>

          {/* Right Column: Steps (Not Cards) */}
          <div className="md:col-span-7 space-y-40 pb-40">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="relative group"
              >
                <span className="text-[12rem] font-black absolute -left-20 -top-20 opacity-[0.03] select-none group-hover:opacity-[0.07] transition-opacity">
                  0{i + 1}
                </span>
                <div className="relative z-10 border-l border-white/10 pl-10">
                  <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-xl leading-relaxed max-w-lg">
                    {step.desc}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {step.points.map((p, j) => (
                      <li key={j} className="flex items-center text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DATA-DRIVEN INSIGHTS (Horizontal Scroll / Expanded Info) */}
      <section className="py-40 bg-white text-black rounded-[4rem]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-6xl font-black tracking-tighter max-w-md">
              The Engine of <br /> Decision Making.
            </h2>
            <p className="text-xl text-gray-600 max-w-sm">
              We focus on the metrics that define your career trajectory. 
              Technical depth is only 50% of the battle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-20">
            <div className="space-y-6">
              <h4 className="text-2xl font-bold border-b-2 border-black pb-2">01 / Mental Frameworks</h4>
              <p className="text-lg">Learn to apply First Principles thinking to system design. Instead of "What did Google do?", we ask "What are the physics of our data?"</p>
            </div>
            <div className="space-y-6">
              <h4 className="text-2xl font-bold border-b-2 border-black pb-2">02 / Trade-off Matrix</h4>
              <p className="text-lg">Every architecture has a weakness. We train you to find it before the interviewer does. Vulnerability becomes your strength.</p>
            </div>
            <div className="space-y-6">
              <h4 className="text-2xl font-bold border-b-2 border-black pb-2">03 / Communication Latency</h4>
              <p className="text-lg">High-level engineers communicate at low latency. Learn to explain distributed systems to a CEO or a Junior Dev with equal clarity.</p>
            </div>
            <div className="space-y-6">
              <h4 className="text-2xl font-bold border-b-2 border-black pb-2">04 / Risk Mitigation</h4>
              <p className="text-lg">Understand the blast radius of your decisions. We simulate cascading failures so you can build resilient solutions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION: THE VOID */}
      <section className="py-60 flex flex-col items-center justify-center">
        <motion.div 
          style={{ scale: scaleProgress }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-10">Ready to stop guessing?</h2>
          <button className="px-12 py-5 bg-blue-600 rounded-full text-xl font-bold hover:bg-blue-500 hover:scale-105 transition-all active:scale-95 shadow-[0_0_50px_rgba(37,99,235,0.4)]">
            Begin the Guidance
          </button>
        </motion.div>
      </section>
    </div>
  );
}

const steps = [
  {
    title: "The Ambiguity Injection",
    desc: "We present problems with missing constraints. Your first job is to extract the truth from the chaos.",
    points: ["Requirement gathering", "Edge case identification", "System boundary definition"]
  },
  {
    title: "The Stress Test",
    desc: "Once you have a solution, we break it. We introduce sudden scale shifts and hardware failures.",
    points: ["Single point of failure analysis", "Back-of-the-envelope math", "Latency vs Throughput"]
  },
  {
    title: "The Synthesis",
    desc: "Finalizing the blueprint. You don't just 'solve' it; you document the 'Why' for the next generation.",
    points: ["Technical writing", "Stakeholder alignment", "Future-proofing"]
  }
];