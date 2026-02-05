'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

const layers = [
  {
    title: "THE VOID",
    subtitle: "Where comfort dies.",
    description: "In the silence of isolation, your skills plateau. The community is the noise that forces you to tune your frequency.",
    color: "#00FF66", // Electric Lime
    glitch: "VOID_SIGNAL_01"
  },
  {
    title: "THE FRICTION",
    subtitle: "Heat creates strength.",
    description: "Your code is a raw material. Our critique is the furnace. We don't just review; we refine through intense technical pressure.",
    color: "#FF0055", // Cyber Pink
    glitch: "HEAT_SYNC_04"
  },
  {
    title: "THE SYNERGY",
    subtitle: "1 + 1 = ∞",
    description: "Your logic connects with a thousand others. A hive-mind where the 'impossible' becomes a weekend project.",
    color: "#0066FF", // Deep Cobalt
    glitch: "HIVE_CONNECT"
  },
  {
    title: "THE ASCENT",
    subtitle: "Mastery is a journey.",
    description: "You enter as a developer. You emerge as an architect of the future. The arena is open.",
    color: "#FFFFFF",
    glitch: "USER_LEVEL_UP"
  }
];

export default function UniqueCommunityPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a very long scroll height (1000vh = 10 screens)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="relative bg-black h-[1000vh] w-full overflow-hidden">
      
      {/* PERSISTENT 3D TUNNEL EFFECT */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]" />
        {/* Moving Grid Lines */}
        <motion.div 
          style={{ 
            perspective: "1000px",
            rotateX: "60deg",
            scale: useTransform(smoothScroll, [0, 1], [1, 2.5])
          }}
          className="absolute inset-0 opacity-20"
        >
          <div className="w-full h-[200%] border-[2px] border-white/10 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:100px_100px]" />
        </motion.div>
      </div>

      {/* LAYER TRAVEL SYSTEM */}
      {layers.map((layer, i) => {
        // Each layer lives in a specific "depth" of the scroll
        const start = i * 0.25;
        const end = (i + 1) * 0.25;

        // 3D Z-Axis movement: It starts far away, grows huge, and fades out
        const z = useTransform(smoothScroll, [start, start + 0.1, start + 0.2], [-1000, 0, 1000]);
        const opacity = useTransform(smoothScroll, [start, start + 0.05, start + 0.15, start + 0.2], [0, 1, 1, 0]);
        const filter = useTransform(smoothScroll, [start, start + 0.05, start + 0.15, start + 0.2], ["blur(20px)", "blur(0px)", "blur(0px)", "blur(40px)"]);

        return (
          <motion.section
            key={i}
            style={{ 
              opacity, 
              z, 
              filter,
              perspective: "1000px"
            }}
            className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Unique Level Design Elements */}
            <div className="relative">
              <motion.span 
                style={{ color: layer.color }}
                className="font-mono text-xs tracking-[1em] uppercase mb-4 block"
              >
                {layer.glitch}
              </motion.span>
              
              <h2 
                className="text-8xl md:text-[12vw] font-black tracking-tighter leading-none mb-4 italic uppercase"
                style={{ WebkitTextStroke: `2px ${layer.color}`, color: 'transparent' }}
              >
                {layer.title}
              </h2>
              
              <motion.div 
                style={{ backgroundColor: layer.color }}
                className="h-1 w-full scale-x-0 origin-left animate-expand" 
              />

              <h3 className="text-3xl md:text-5xl font-bold mt-6 mb-8 text-white uppercase tracking-tighter">
                {layer.subtitle}
              </h3>
              
              <p className="max-w-xl mx-auto text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
                {layer.description}
              </p>

              {/* Decorative "Scanning" Line */}
              <motion.div 
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-[-10%] right-[-10%] h-[1px] bg-white/20 blur-sm z-50 pointer-events-none"
              />
            </div>
          </motion.section>
        );
      })}

      {/* THE "LONG" CONTENT: VERTICAL SPECIFICATIONS */}
      <div className="relative z-50 mt-[400vh] bg-[#050505] border-t border-white/10">
        <div className="max-w-7xl mx-auto py-64 px-6">
          <h2 className="text-6xl font-black mb-32 tracking-widest uppercase">The Protocol</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <motion.div 
                key={num}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="group border-b border-white/10 pb-12"
              >
                <div className="text-fuchsia-500 font-mono mb-4">RULE_0{num}</div>
                <h4 className="text-3xl font-bold mb-4 uppercase">Advanced Neural Synthesis</h4>
                <p className="text-zinc-500 leading-relaxed">
                  We leverage real-time collaborative environments where the delta between an idea and its implementation is minimized to near zero.
                </p>
                <div className="mt-8 flex gap-2">
                  <div className="h-2 w-2 bg-white rounded-full" />
                  <div className="h-2 w-12 bg-white/20 rounded-full group-hover:bg-fuchsia-500 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* DATA VISUALIZATION SECTION */}
        <div className="py-64 bg-zinc-900/30">
          <div className="max-w-5xl mx-auto text-center px-6">
             <div className="inline-block border border-lime-400 text-lime-400 px-4 py-1 text-xs font-mono mb-8">
               LIVE_COMMUNITY_METRICS
             </div>
             <div className="flex flex-wrap justify-between items-end gap-4 h-64">
                {[40, 70, 45, 90, 65, 80, 30, 95, 50].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="flex-1 min-w-[10px] bg-gradient-to-t from-lime-500 to-transparent opacity-50 hover:opacity-100 transition-opacity"
                  />
                ))}
             </div>
             <p className="mt-12 text-zinc-500 uppercase tracking-widest text-sm">Real-time engagement velocity detected</p>
          </div>
        </div>

        {/* FINAL CTA: THE TERMINAL */}
        <section className="h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 p-1 font-mono">
            <div className="bg-zinc-900 p-2 flex justify-between items-center text-[10px] text-zinc-500">
              <span>ROOT@COMMUNITY: ~</span>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            </div>
            <div className="p-12 text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">READY TO INITIALIZE?</h2>
              <p className="text-zinc-500 mb-12 max-w-md mx-auto">By joining, you acknowledge that comfort is no longer the priority. Evolution is the only metric.</p>
              <button className="bg-white text-black px-12 py-4 font-black hover:bg-lime-400 hover:tracking-[0.5em] transition-all duration-500">
                EXECUTE_JOIN_SCRIPT
              </button>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes expand {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-expand {
          animation: expand 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
      `}</style>
    </div>
  );
}