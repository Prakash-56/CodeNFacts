'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const signals = [
  'Mentorship Signals',
  'Collaboration Requests',
  'Course Enquiries',
  'Community Access',
  'Career Opportunities',
  'Ideas Worth Building',
];

// Floating particle
function Particle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-cyan-400/60"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -120, 0],
        x: [0, Math.random() * 40 - 20, 0],
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// A single card that orbits in 3D
function OrbitCard({ text, index, total, hovered }: { text: string; index: number; total: number; hovered: boolean }) {
  const angle = (360 / total) * index;
  const rad = (angle * Math.PI) / 180;
  const rx = 240; // x-radius of ellipse
  const ry = 80;  // y-radius (foreshortened for 3D feel)
  
  const cx = Math.cos(rad) * rx;
  const cy = Math.sin(rad) * ry;
  
  // Depth: items at back are smaller/dimmer
  const depth = (Math.sin(rad) + 1) / 2; // 0 = back, 1 = front

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        x: cx - 90,
        y: cy - 20,
        zIndex: Math.round(depth * 10),
      }}
      animate={{
        opacity: hovered ? 1 : 0.3 + depth * 0.7,
        scale: hovered ? 1 + depth * 0.15 : 0.85 + depth * 0.2,
      }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-[180px] px-4 py-2.5 rounded-xl text-center cursor-default select-none"
        style={{
          background: `rgba(${Math.round(10 + depth * 20)}, ${Math.round(20 + depth * 30)}, ${Math.round(40 + depth * 60)}, ${0.4 + depth * 0.5})`,
          border: `1px solid rgba(100, 200, 255, ${0.1 + depth * 0.4})`,
          backdropFilter: 'blur(8px)',
          boxShadow: `0 0 ${12 + depth * 24}px rgba(56,189,248,${0.05 + depth * 0.2})`,
        }}
        whileHover={{
          scale: 1.08,
          boxShadow: '0 0 32px rgba(56,189,248,0.5)',
        }}
      >
        <span
          className="text-xs sm:text-sm font-semibold tracking-wide"
          style={{
            color: `rgba(${Math.round(180 + depth * 75)}, ${Math.round(220 + depth * 35)}, 255, ${0.6 + depth * 0.4})`,
          }}
        >
          {text}
        </span>
      </motion.div>
    </motion.div>
  );
}

// Animated ring that rotates
function Ring({ radius, duration, reverse, opacity }: { radius: number; duration: number; reverse?: boolean; opacity: number }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 rounded-full border"
      style={{
        width: radius * 2,
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius,
        borderColor: `rgba(100,200,255,${opacity})`,
        borderStyle: 'dashed',
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export default function GetInTouch() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }))
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Orbit rotation driven by scroll + auto-spin
  const autoAngle = useMotionValue(0);
  useAnimationFrame((t) => {
    autoAngle.set(t * 0.02); // degrees per ms * ms = continuous
  });

  const scrollRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const orbitY = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -60]);
  const headerY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const rotateX = useTransform(smoothY, [-300, 300], [18, -18]);
  const rotateY = useTransform(smoothX, [-300, 300], [-18, 18]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[1100px] overflow-hidden bg-[#020510] py-40 px-6 flex flex-col items-center justify-center gap-0"
    >
      {/* Deep space bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(14,30,80,0.7),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_70%,rgba(0,80,160,0.15),transparent)]" />

      {/* Star field */}
      {particles.map((p) => (
        <Particle key={p.id} x={p.x} y={p.y} delay={p.delay} />
      ))}

      {/* Scan line sweep */}
      <motion.div
        className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* HEADER */}
      <motion.div
        style={{ y: headerY, opacity: headerOpacity }}
        className="relative z-10 text-center mb-20"
      >
        <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-cyan-400/80 text-xs tracking-[0.3em] font-mono uppercase">Signal Receiver Active</span>
        </div>
        <h2
          className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight"
          style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif", textShadow: '0 0 60px rgba(56,189,248,0.3)' }}
        >
          Get in Touch
        </h2>
        <p className="text-cyan-300/50 text-base md:text-lg tracking-[0.15em] font-mono">
          SELECT YOUR TRANSMISSION TYPE
        </p>
      </motion.div>

      {/* 3D ORBIT SYSTEM */}
      <motion.div
        style={{ y: orbitY, perspective: 1200 }}
        className="relative z-10"
      >
        <motion.div
          ref={orbitRef}
          style={{ rotateX, rotateY }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          className="relative flex items-center justify-center"
          animate={{ transition: { type: 'spring' } }}
        >
          {/* Orbital rings */}
          <Ring radius={280} duration={20} opacity={0.08} />
          <Ring radius={240} duration={14} reverse opacity={0.12} />
          <Ring radius={190} duration={10} opacity={0.07} />

          {/* Core sphere */}
          <motion.div
            className="relative w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full z-20"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #1e6fa8, #051228)',
              boxShadow: '0 0 60px rgba(56,189,248,0.4), 0 0 120px rgba(56,189,248,0.15), inset 0 0 40px rgba(0,0,0,0.8)',
            }}
            animate={{
              boxShadow: hovered
                ? '0 0 80px rgba(56,189,248,0.7), 0 0 160px rgba(56,189,248,0.3), inset 0 0 40px rgba(0,0,0,0.8)'
                : '0 0 60px rgba(56,189,248,0.4), 0 0 120px rgba(56,189,248,0.15), inset 0 0 40px rgba(0,0,0,0.8)',
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Specular highlight */}
            <div className="absolute top-[15%] left-[20%] w-[30%] h-[20%] rounded-full bg-white/20 blur-sm" />
            {/* Core glow dot */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-4 h-4 rounded-full bg-cyan-300/80 blur-[2px]" />
            </motion.div>

            {/* Equator ring */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30"
              style={{ width: '140%', height: '30%' }}
            />
          </motion.div>

          {/* Rotating orbit container */}
          <motion.div
            className="absolute"
            style={{ width: 600, height: 200, left: '50%', top: '50%', marginLeft: -300, marginTop: -100 }}
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            {signals.map((text, i) => (
              <OrbitCard key={i} text={text} index={i} total={signals.length} hovered={hovered} />
            ))}
          </motion.div>

          {/* Vertical axis ring */}
          <motion.div
            className="absolute rounded-full border border-cyan-400/10"
            style={{ width: 2, height: 560, left: '50%', top: '50%', marginLeft: -1, marginTop: -280 }}
            animate={{ rotateX: [0, 360] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </motion.div>

      {/* Data readout lines */}
      <motion.div
        className="relative z-10 mt-24 flex gap-8 items-center justify-center font-mono text-[10px] tracking-[0.25em] text-cyan-500/30 uppercase"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
      >
        {['Lat: 51.5°N', 'Long: 0.1°W', 'Alt: ∞', 'Signal: OPEN'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        className="relative z-10 mt-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <motion.a
          href="/contact"
          className="relative inline-flex items-center gap-3 px-14 py-5 font-bold text-base tracking-[0.2em] uppercase text-cyan-300 overflow-hidden"
          style={{ fontFamily: "'Syne', sans-serif" }}
          whileHover="hover"
          initial="rest"
        >
          {/* Button border animation */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: '1px solid rgba(56,189,248,0.4)' }}
            variants={{
              rest: { opacity: 1 },
              hover: { opacity: 0, scale: 1.15, transition: { duration: 0.4 } },
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: '1px solid rgba(56,189,248,0.8)', opacity: 0 }}
            variants={{
              rest: { opacity: 0, scale: 0.9 },
              hover: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
            }}
          />
          {/* Bg fill on hover */}
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-500/10"
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.3 }}
          />
          {/* Pulse ripple */}
          <motion.div
            className="absolute inset-0 rounded-full border border-cyan-400/20"
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
          />

          <motion.span
            className="relative z-10"
            variants={{
              rest: { x: 0 },
              hover: { x: -4 },
            }}
            transition={{ duration: 0.3 }}
          >
            Initiate Contact
          </motion.span>
          <motion.svg
            className="relative z-10 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            variants={{
              rest: { x: 0, opacity: 0.6 },
              hover: { x: 6, opacity: 1 },
            }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </motion.svg>
        </motion.a>
      </motion.div>
    </section>
  );
}