'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaTelegramPlane, FaCode, FaRocket, FaUsers } from 'react-icons/fa';

// --- ADD YOUR LINKS HERE ---
const LINKS = {
  whatsapp: "https://chat.whatsapp.com/Da7r5f8MSbc0jSYQGXz2Lx",
  telegram: "https://t.me/CodeNFacts",
};

export default function JoinCommunityCTA() {
  const [showOptions, setShowOptions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bubbleStyles, setBubbleStyles] = useState<any[]>([]);

  // Fix Hydration: Generate random values only on the client
  useEffect(() => {
    const generatedStyles = [...Array(40)].map(() => ({
      width: Math.random() * 15 + 5,
      height: Math.random() * 15 + 5,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      xOffset: Math.random() * 120 - 60,
      duration: Math.random() * 8 + 7,
      delay: Math.random() * 5,
    }));
    setBubbleStyles(generatedStyles);
    setMounted(true);
  }, []);

  const features = [
    { 
      icon: <FaCode />, 
      title: "Daily Challenges", 
      desc: "Solve logic puzzles and coding problems daily to sharpen your skills." 
    },
    { 
      icon: <FaUsers />, 
      title: "Expert Mentorship", 
      desc: "Get your technical doubts cleared by industry professionals and peers." 
    },
    { 
      icon: <FaRocket />, 
      title: "Project Collabs", 
      desc: "Find partners and contributors for your next big open-source project." 
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-6 bg-[#030014]">
      
      {/* --- 3D BUBBLE BACKGROUND (Hydration Safe) --- */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {mounted && bubbleStyles.map((style, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-b from-white/20 to-transparent backdrop-blur-sm"
            style={{
              width: `${style.width}px`,
              height: `${style.height}px`,
              left: style.left,
              top: style.top,
            }}
            animate={{
              y: [0, -800],
              opacity: [0, 0.7, 0],
              scale: [0, 1.2, 0.6],
              x: style.xOffset,
            }}
            transition={{
              duration: style.duration,
              repeat: Infinity,
              ease: "linear",
              delay: style.delay,
            }}
          />
        ))}
      </div>

      {/* --- HERO CONTENT --- */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-6 italic">
          Join Our Community
        </h2>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          The ultimate hub for developers. Whether you are a beginner or a pro, 
          CodeNFacts is where your tech journey accelerates.
        </p>
      </motion.div>

      {/* --- INTERACTIVE 3D SELECTION --- */}
      <div className="relative flex items-center justify-center min-h-[350px] w-full max-w-4xl mb-20">
        <AnimatePresence mode="wait">
          {!showOptions ? (
            <motion.button
              key="main-btn"
              onClick={() => setShowOptions(true)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, rotate: 180, filter: "blur(10px)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group px-14 py-7 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-2xl font-black text-white shadow-[0_0_50px_rgba(147,51,234,0.3)] overflow-hidden cursor-pointer"
            >
              <span className="relative z-10 tracking-widest">JOIN NOW</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.button>
          ) : (
            <motion.div
              key="cards"
              className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4"
              initial={{ opacity: 0, y: 50, perspective: 1000 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CommunityCard 
                title="WhatsApp" 
                icon={<FaWhatsapp />} 
                color="text-green-500" 
                glow="shadow-green-500/20"
                link={LINKS.whatsapp}
                description="Join our WhatsApp channel for instant updates and resources."
              />
              <CommunityCard 
                title="Telegram" 
                icon={<FaTelegramPlane />} 
                color="text-blue-400" 
                glow="shadow-blue-400/20"
                link={LINKS.telegram}
                description="Join our Telegram group to chat and collaborate with everyone."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- FEATURES SECTION --- */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full border-t border-white/10 pt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
      >
        {features.map((f, i) => (
          <div key={i} className="group relative p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300">
            <div className="text-4xl text-cyan-400 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
              {f.icon}
            </div>
            <h3 className="text-white font-bold text-xl mb-3 tracking-tight">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

function CommunityCard({ title, icon, color, glow, link, description }: any) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ 
        y: -12, 
        rotateX: 8, 
        rotateY: -8, 
        scale: 1.03 
      }}
      className={`p-10 rounded-[2.5rem] bg-slate-900/40 border border-white/10 backdrop-blur-xl flex flex-col items-center gap-4 text-center shadow-2xl transition-all ${glow}`}
    >
      <div className={`text-8xl ${color} filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-2`}>
        {icon}
      </div>
      <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{title}</h4>
      <p className="text-gray-400 text-sm max-w-[200px] leading-snug">
        {description}
      </p>
      <div className="mt-4 px-8 py-3 bg-white text-black font-bold rounded-full text-sm hover:bg-cyan-400 hover:text-white transition-colors">
        TAP TO JOIN
      </div>
    </motion.a>
  );
}