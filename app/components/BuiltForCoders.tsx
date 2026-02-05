"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Code2, Briefcase, Target } from "lucide-react";
import { useRef, useEffect, useState } from "react";

/* ------------------ ANTIGRAVITY PARTICLES (UNCHANGED) ------------------ */
function AntigravityParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = canvas.parentElement!.offsetHeight);

    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.8 + 0.6,
    }));

    let mouse = { x: -999, y: -999 };

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = canvas.parentElement!.offsetHeight;
    };

    const move = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY - canvas.getBoundingClientRect().top;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", move);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          p.vx += dx * 0.0006;
          p.vy += dy * 0.0006;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120,170,255,0.55)";
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

/* ------------------ ADVANCED INTERACTIVE MODULE ------------------ */
function FeatureModule({ item, index }: { item: any; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="group relative flex flex-col items-center text-center p-10 cursor-default"
    >
      {/* Dynamic Spotlight Glow */}
      <motion.div 
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, rgba(120,170,255,0.15), transparent 40%)`
        }}
      />

      {/* Floating Icon Wrapper */}
      <div className="relative mb-8">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: index * 0.5 }}
          className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-black border border-white/10 text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:border-blue-500/50`}
        >
          <item.icon className="h-9 w-9" />
        </motion.div>
        {/* Orbit Ring */}
        <div className={`absolute -inset-4 rounded-full border border-dashed border-white/5 animate-[spin_20s_linear_infinite]`} />
      </div>

      {/* Text Content */}
      <h3 className="relative z-10 mb-4 text-2xl font-bold text-white tracking-tight">
        {item.title}
      </h3>
      <p className="relative z-10 text-base leading-relaxed text-gray-400 max-w-[280px]">
        {item.desc}
      </p>

      {/* Bottom Indicator Decor */}
      <div className={`mt-8 h-[2px] w-0 bg-gradient-to-r ${item.gradient} transition-all duration-700 group-hover:w-24`} />
    </motion.div>
  );
}

/* ------------------ MAIN SECTION ------------------ */
export default function BuiltForCoders() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yContent = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const features = [
    {
      icon: Code2,
      title: "Engineer-first learning",
      desc: "Concepts end with production-grade code - not slides.",
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      icon: Target,
      title: "Interview-aligned practice",
      desc: "Patterns taken directly from real company interviews.",
      gradient: "from-purple-400 to-pink-400",
    },
    {
      icon: Briefcase,
      title: "Placement-focused mindset",
      desc: "DSA + projects recruiters actually evaluate.",
      gradient: "from-emerald-400 to-teal-400",
    },
  ];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-black py-44">
      <AntigravityParticles />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Heading (Unchanged Texts/Background) */}
        <motion.div style={{ y: yText }} className="mx-auto mb-32 max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-semibold text-white">
            Built for Coders.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Proven by Outcomes.
            </span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-400">
            Not tutorials. Not shortcuts.
            <br />
            A system engineered to create real developers.
          </p>
        </motion.div>

        {/* NEW Unique Structure: Borderless Interactive Modules */}
        <motion.div 
          style={{ y: yContent }} 
          className="grid gap-8 md:grid-cols-3 md:gap-0 divide-x-0 md:divide-x divide-white/5"
        >
          {features.map((item, i) => (
            <FeatureModule key={i} item={item} index={i} />
          ))}
        </motion.div>

        {/* Footer Signal (Unchanged) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="mt-32 text-center font-mono text-sm text-gray-500"
        >
          <span className="text-gray-400">Think in O(n).</span>{" "}
          <span>Solve real problems.</span>{" "}
          <span className="text-gray-400">Ship real projects.</span>
        </motion.div>
      </div>
    </section>
  );
}