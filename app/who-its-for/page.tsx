'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

// --- Components ---

const SectionHeader = ({ title, subtitle, label }: { title: string; subtitle: string; label: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="mb-20"
  >
    <span className="text-blue-500 font-mono tracking-widest text-sm uppercase mb-4 block">{label}</span>
    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">{title}</h2>
    <p className="text-zinc-400 text-xl max-w-2xl leading-relaxed">{subtitle}</p>
  </motion.div>
);

const FeatureCard = ({ title, description, icon, color }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // High-performance hover tilt effect
  const onMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const onMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative transition-transform duration-200 ease-out p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-3xl group h-full flex flex-col justify-between overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity ${color}`} />
      <div>
        <div className="text-4xl mb-6">{icon}</div>
        <h3 className="text-3xl font-bold mb-4">{title}</h3>
        <p className="text-zinc-500 leading-relaxed text-lg">{description}</p>
      </div>
      <div className="mt-12 group-hover:translate-x-2 transition-transform duration-300">
        <span className="text-sm font-semibold tracking-wide text-zinc-300">DISCOVER MORE →</span>
      </div>
    </div>
  );
};

export default function WhoItsForPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scale = useTransform(springScroll, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(springScroll, [0, 0.15], [1, 0]);

  return (
    <main ref={containerRef} className="bg-black text-white selection:bg-blue-500">
      
      {/* 1. HERO: The Infinite Horizon */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div style={{ scale, opacity }} className="z-10 text-center px-6">
          <motion.h1 
            initial={{ filter: 'blur(20px)', opacity: 0, y: 50 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[10rem] font-bold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-700"
          >
            Universal <br /> Knowledge.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-8 text-xl md:text-3xl text-zinc-400 font-light max-w-3xl mx-auto"
          >
            CodeNFacts is built for the curious, the ambitious, and the visionaries who see code as their canvas.
          </motion.p>
        </motion.div>

        {/* Dynamic 3D Grid Background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </section>

      {/* 2. THE TARGETS: Advanced Bento Grid */}
      <section className="py-32 px-6 md:px-16 max-w-7xl mx-auto">
        <SectionHeader 
          label="The Spectrum"
          title="For every stage of your craft."
          subtitle="From your first logic gate to complex cloud orchestration, we've designed an experience tailored to your momentum."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <FeatureCard 
              icon="🎓"
              title="Academic Pioneers"
              description="Master the fundamentals of Computer Science. We simplify DSA, System Design, and Algorithms for the next generation of engineers."
              color="bg-blue-500"
            />
          </div>
          <FeatureCard 
            icon="🛠️"
            title="Builders"
            description="Turn ideas into production-ready software with real-world stacks."
            color="bg-purple-500"
          />
          <FeatureCard 
            icon="🏢"
            title="Enterprise"
            description="Senior concepts for those scaling architectures."
            color="bg-emerald-500"
          />
          <div className="md:col-span-2">
            <FeatureCard 
              icon="🎨"
              title="Creative Technologists"
              description="Where code meets design. For those building interactive experiences, GSAP animations, and high-end WebGL interfaces."
              color="bg-orange-500"
            />
          </div>
        </div>
      </section>

      {/* 3. PARALLAX PHILOSOPHY: Why CodeNFacts? */}
      <section className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-6xl font-bold mb-8">Not just code.<br /><span className="text-blue-500">The facts behind it.</span></h2>
            <div className="space-y-6 text-zinc-400 text-lg">
              <p>Most platforms teach you the 'how'. We teach you the 'why'. We dive into the low-level facts that make technology work.</p>
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-[1px] bg-blue-500" />
                <span className="font-mono">Verified Tech Insights</span>
              </div>
            </div>
          </motion.div>
          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-blue-600/20 blur-[100px] animate-pulse" />
            <div className="relative border border-white/10 rounded-[3rem] h-full w-full bg-zinc-900/50 backdrop-blur-md flex items-center justify-center overflow-hidden">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-64 h-64 border-2 border-dashed border-blue-500/30 rounded-full flex items-center justify-center"
                >
                  <div className="w-48 h-48 border border-white/20 rounded-full bg-gradient-to-tr from-blue-600 to-transparent opacity-50" />
                </motion.div>
                <span className="absolute text-8xl">C</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION: The Final Push */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900/40 p-16 md:p-32 rounded-[4rem] border border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          <h2 className="text-5xl md:text-8xl font-bold mb-8">Ready to evolve?</h2>
          <p className="text-zinc-400 text-xl mb-12 max-w-xl mx-auto">Join thousands of others building the future on CodeNFacts.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-6 bg-white text-black text-xl font-bold rounded-full hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-shadow"
          >
            Start Learning Now
          </motion.button>
        </motion.div>
      </section>

    </main>
  );
}