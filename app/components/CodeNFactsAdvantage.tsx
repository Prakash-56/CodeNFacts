"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { useRef } from "react";

export default function CodeNFactsAdvantage() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
  });

  const rotateCore = useTransform(smooth, [0, 1], [0, 360]);
  const scaleCore = useTransform(smooth, [0, 1], [1, 1.4]);
  const opacityHero = useTransform(smooth, [0, 0.1, 0.2], [0, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[500vh] bg-black overflow-hidden"
      style={{ perspective: "1500px" }}
    >
      {/* ===== BACKGROUND VOID ===== */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e1b4b_0%,#000_70%)]" />

      {/* ===== CENTRAL CORE ===== */}
      <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none">
        <motion.div
          style={{ rotate: rotateCore, scale: scaleCore }}
          className="relative w-[400px] h-[400px]"
        >
          <div className="absolute inset-0 rounded-full border border-indigo-500/30" />
          <div className="absolute inset-10 rounded-full border border-purple-500/20" />
          <div className="absolute inset-20 rounded-full border border-cyan-500/20" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 blur-[120px] opacity-20" />
        </motion.div>
      </div>

      {/* ===== HERO TITLE ===== */}
      <div className="sticky top-0 h-screen flex items-center justify-center z-10">
        <motion.h2
          style={{ opacity: opacityHero }}
          className="text-7xl md:text-9xl font-black text-white text-center tracking-tight"
        >
          The <span className="text-indigo-500">Advantage</span>
        </motion.h2>
      </div>

      {/* ===== FLOATING PILLARS ===== */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 space-y-[70vh] pb-[40vh] -mt-[30vh]">
        <Pillar
          index="01"
          title="Clarity Compounds"
          desc="Better thinking beats harder effort."
        />
        <Pillar
          index="02"
          title="Systems Dominate"
          desc="Structure outperforms emotion."
        />
        <Pillar
          index="03"
          title="Architect Level Depth"
          desc="Understand the system behind the system."
        />
        <Pillar
          index="04"
          title="Leverage Intelligence"
          desc="Knowledge that multiplies itself."
        />
      </div>
    </section>
  );
}

/* ================= PILLAR COMPONENT ================= */

function Pillar({
  index,
  title,
  desc,
}: {
  index: string;
  title: string;
  desc: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-30% 0px -30% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 150, rotateX: 40 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotateX: 0 }
          : { opacity: 0.2, y: 100 }
      }
      transition={{ duration: 1 }}
      className="relative flex items-center justify-center"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Vertical Beam */}
      <div className="absolute h-[300px] w-[2px] bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent blur-sm" />

      {/* Holographic Text */}
      <motion.div
        animate={
          isInView
            ? { scale: 1, filter: "blur(0px)" }
            : { scale: 0.9, filter: "blur(4px)" }
        }
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="text-indigo-500 font-mono tracking-widest text-sm mb-4">
          [{index}]
        </div>

        <h3 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          {title}
        </h3>

        <p className="mt-6 text-gray-400 text-lg md:text-2xl max-w-2xl mx-auto">
          {desc}
        </p>
      </motion.div>
    </motion.div>
  );
}