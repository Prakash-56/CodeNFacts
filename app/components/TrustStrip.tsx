"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Users, Briefcase, Layers } from "lucide-react";

const items = [
  {
    icon: Users,
    title: "5,000+ Learners",
    subtitle: "Global Community",
    color: "#60a5fa", // blue-400
  },
  {
    icon: Briefcase,
    title: "Industry Built",
    subtitle: "Professional Standards",
    color: "#c084fc", // purple-400
  },
  {
    icon: Layers,
    title: "Project-Led",
    subtitle: "Hands-on Experience",
    color: "#818cf8", // indigo-400
  },
];

export default function TrustStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Handle mouse movement for the 3D effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative z-20 py-20 overflow-hidden bg-black flex items-center justify-center"
    >
      {/* 3D Animated Background Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      {/* Floating Orbital Beams */}
      <motion.div 
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[120%] h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm -rotate-12"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          {items.map((item, i) => (
            <TrustItem key={i} item={item} index={i} mouseX={mouseX} mouseY={mouseY} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustItem({ item, index, mouseX, mouseY }: any) {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Spring physics for smooth movement
  const springConfig = { damping: 20, stiffness: 100 };
  const rotateX = useSpring(useTransform(mouseY, [0, 400], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1200], [-10, 10]), springConfig);

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="relative group"
    >
      {/* Holographic Glow behind icon */}
      <div 
        className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500"
        style={{ backgroundColor: item.color }}
      />

      <div className="relative flex flex-col items-center text-center">
        {/* Animated Icon Container */}
        <motion.div 
          whileHover={{ scale: 1.1, rotateZ: 5 }}
          className="mb-4 relative flex h-20 w-20 items-center justify-center"
        >
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-2xl border border-white/10 rotate-45 group-hover:rotate-90 group-hover:border-white/30 transition-all duration-700" />
          
          {/* Inner Glass Box */}
          <div className="h-14 w-14 rounded-xl bg-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
            <item.icon className="h-7 w-7 text-white" style={{ filter: `drop-shadow(0 0 8px ${item.color})` }} />
          </div>
        </motion.div>

        {/* Text Stack */}
        <motion.div className="space-y-1">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            {item.title}
          </h3>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold group-hover:text-gray-300 transition-colors">
            {item.subtitle}
          </p>
        </motion.div>

        {/* Bottom Accent Line */}
        <motion.div 
          className="mt-4 h-[1px] w-0 group-hover:w-full transition-all duration-500"
          style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}
        />
      </div>
    </motion.div>
  );
}