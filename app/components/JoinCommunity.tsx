'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaWhatsapp, FaTelegramPlane, FaCode, FaRocket, FaUsers } from 'react-icons/fa';

const LINKS = {
  whatsapp: "https://chat.whatsapp.com/Da7r5f8MSbc0jSYQGXz2Lx",
  telegram: "https://t.me/CodeNFacts",
};

// ── Magnetic Button Hook ──────────────────────────────────────────────────────
function useMagnet(strength = 0.4) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    x.set((e.clientX - left - width / 2) * strength);
    y.set((e.clientY - top - height / 2) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return { ref, sx, sy, onMove, onLeave };
}

// ── Noise SVG filter id ───────────────────────────────────────────────────────
const NOISE_ID = "cta-noise";

// ── Particle Field ────────────────────────────────────────────────────────────
function ParticleField() {
  const [particles, setParticles] = useState<any[]>([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        dur: Math.random() * 12 + 8,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 30,
        opacity: Math.random() * 0.5 + 0.1,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `hsl(${180 + p.id * 4}, 80%, 70%)`,
          }}
          animate={{
            y: [0, -120, 0],
            x: [0, p.drift, 0],
            opacity: [0, p.opacity, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ── Orbital Rings ─────────────────────────────────────────────────────────────
function OrbitalRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[340, 500, 660, 820].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: size,
            height: size,
            borderColor: `rgba(${i % 2 === 0 ? '20,200,200' : '150,80,255'},${0.06 - i * 0.01})`,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 30 + i * 15, repeat: Infinity, ease: "linear" }}
        >
          {/* Dot on ring */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 4 + i,
              height: 4 + i,
              background: i % 2 === 0 ? '#14c8c8' : '#a855f7',
              boxShadow: `0 0 ${8 + i * 4}px ${i % 2 === 0 ? '#14c8c8' : '#a855f7'}`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ── Scanline overlay ──────────────────────────────────────────────────────────
function Scanlines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }}
    />
  );
}

// ── Glitch Text ───────────────────────────────────────────────────────────────
function GlitchText({ text }: { text: string }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-block select-none">
      <span
        className="relative z-10 block font-black text-transparent bg-clip-text"
        style={{
          backgroundImage: 'linear-gradient(135deg, #00f5d4 0%, #7b2ff7 50%, #f72585 100%)',
          fontFamily: "'Bebas Neue', 'Impact', sans-serif",
          letterSpacing: '0.04em',
        }}
      >
        {text}
      </span>

      {/* Glitch layers */}
      <AnimatePresence>
        {glitching && (
          <>
            <motion.span
              className="absolute inset-0 block font-black text-cyan-400 opacity-70"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                letterSpacing: '0.04em',
                mixBlendMode: 'screen',
              }}
              animate={{ x: [-4, 4, -2, 0], y: [1, -1, 0] }}
              transition={{ duration: 0.15, times: [0, 0.4, 0.8, 1] }}
            >
              {text}
            </motion.span>
            <motion.span
              className="absolute inset-0 block font-black text-fuchsia-500 opacity-60"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                letterSpacing: '0.04em',
                mixBlendMode: 'screen',
              }}
              animate={{ x: [3, -3, 1, 0], y: [-1, 1, 0] }}
              transition={{ duration: 0.15, times: [0, 0.4, 0.8, 1] }}
            >
              {text}
            </motion.span>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Community Card ────────────────────────────────────────────────────────────
function CommunityCard({
  title, icon, color, link, description, accentFrom, accentTo, delay,
}: any) {
  const magnet = useMagnet(0.3);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      ref={magnet.ref as any}
      onMouseMove={magnet.onMove}
      onMouseLeave={() => { magnet.onLeave(); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      style={{ x: magnet.sx, y: magnet.sy }}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative group block overflow-hidden rounded-[2rem] cursor-pointer"
      style={{
        background: 'rgba(5, 5, 20, 0.7)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        transformStyle: 'preserve-3d',
      } as any}
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Glow blob */}
      <motion.div
        className="absolute -inset-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${accentFrom}22 0%, transparent 70%)`,
          filter: 'blur(30px)',
        }}
      />

      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)',
        }}
        animate={hovered ? { x: ['-100%', '200%'] } : { x: '-100%' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <div className="relative z-10 p-10 flex flex-col items-center gap-5 text-center">
        {/* Icon with glow */}
        <motion.div
          className={`text-7xl ${color}`}
          animate={hovered ? { scale: 1.15, rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.5 }}
          style={{ filter: `drop-shadow(0 0 20px currentColor)` }}
        >
          {icon}
        </motion.div>

        <h4
          className="text-3xl font-black text-white uppercase tracking-widest"
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
        >
          {title}
        </h4>

        <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
          {description}
        </p>

        {/* CTA pill */}
        <motion.div
          className="mt-2 relative overflow-hidden px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase"
          style={{
            background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`,
            color: '#fff',
          }}
          animate={hovered ? { scale: 1.05 } : { scale: 1 }}
        >
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})` }}
            animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="relative z-10">Join Now →</span>
        </motion.div>
      </div>
    </motion.a>
  );
}

// ── Feature Card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, index }: any) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl p-8"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-24 h-24 -translate-x-6 -translate-y-6 rounded-full opacity-0"
          style={{ background: 'radial-gradient(circle, rgba(20,200,200,0.15), transparent)' }}
          animate={hovered ? { opacity: 1, scale: 1.2 } : { opacity: 0, scale: 1 }}
        />
      </div>

      <motion.div
        className="text-3xl text-cyan-400 mb-5"
        animate={hovered ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-white font-bold text-lg mb-2 tracking-tight">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>

      {/* Bottom line reveal */}
      <motion.div
        className="absolute bottom-0 left-0 h-px"
        style={{ background: 'linear-gradient(90deg, #14c8c8, #7b2ff7)' }}
        animate={hovered ? { width: '100%' } : { width: '0%' }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function JoinCommunityCTA() {
  const [showOptions, setShowOptions] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const sectionRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useSpring(mouseX, { stiffness: 60, damping: 30 });
  const spotY = useSpring(mouseY, { stiffness: 60, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const features = [
    { icon: <FaCode />, title: "Daily Challenges", desc: "Sharpen skills with logic puzzles and coding problems curated by experts." },
    { icon: <FaUsers />, title: "Expert Mentorship", desc: "Get doubts cleared by industry professionals and high-achieving peers." },
    { icon: <FaRocket />, title: "Project Collabs", desc: "Find partners and contributors for your next open-source breakthrough." },
  ];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-28 px-6"
      style={{ background: '#04000f' }}
    >
      {/* ── Noise SVG filter ── */}
      <svg className="absolute" width="0" height="0">
        <defs>
          <filter id={NOISE_ID}>
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" result="blend" />
            <feComposite in="blend" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* ── Grain overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none z-10"
        style={{ filter: `url(#${NOISE_ID})`, background: 'rgba(255,255,255,1)' }}
      />

      {/* ── Cursor spotlight ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          x: useTransform(spotX, (v) => v - 300),
          y: useTransform(spotY, (v) => v - 300),
          background: 'radial-gradient(circle, rgba(123,47,247,0.07) 0%, transparent 70%)',
        }}
      />

      <OrbitalRings />
      <ParticleField />
      <Scanlines />

      {/* ── Mesh gradient bg ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7b2ff7, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00f5d4, transparent)' }} />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 rounded-full opacity-8 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f72585, transparent)' }} />
      </div>

      {/* ── Badge ── */}
      <motion.div
        className="relative z-20 mb-8 flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'rgba(20,200,200,0.08)',
          border: '1px solid rgba(20,200,200,0.2)',
          color: '#14c8c8',
        }}
      >
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-cyan-400"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        Live Community · 10k+ Members
      </motion.div>

      {/* ── Hero Headline ── */}
      <motion.div
        className="relative z-20 text-center mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="text-[clamp(3.5rem,10vw,8rem)] leading-none">
          <GlitchText text="Code  ×  Connect" />
        </div>
        <div
          className="text-[clamp(1rem,3vw,1.5rem)] text-gray-500 mt-4 font-light tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          The developer collective (join the new group v1.2.2.o)
        </div>
      </motion.div>

      <motion.p
        className="relative z-20 text-gray-400 text-base md:text-lg max-w-xl mx-auto text-center leading-relaxed mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Where builders, learners, and creators accelerate together.
        Join <span className="text-cyan-400 font-semibold">CodeNFacts</span> - your edge in tech.
      </motion.p>

      {/* ── CTA Zone ── */}
      <div className="relative z-20 w-full max-w-3xl min-h-[320px] flex items-center justify-center mb-24">
        <AnimatePresence mode="wait">
          {!showOptions ? (
            <motion.div
              key="cta"
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(12px)' }}
              transition={{ duration: 0.4 }}
            >
              {/* Main button */}
              <motion.button
                onClick={() => setShowOptions(true)}
                className="relative group overflow-hidden px-16 py-6 rounded-2xl text-white font-black text-xl tracking-widest uppercase cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #7b2ff7 0%, #00f5d4 100%)',
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  letterSpacing: '0.12em',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                initial={{ scale: 0, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.6 }}
              >
                {/* Animated shimmer */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.25) 50%, transparent 80%)',
                  }}
                  animate={{ x: ['-100%', '150%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                />
                {/* Pulse rings */}
                {[1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-2xl"
                    style={{ border: '2px solid rgba(123,47,247,0.4)' }}
                    animate={{ scale: [1, 1.4 + i * 0.2], opacity: [0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  />
                ))}
                <span className="relative z-10">Enter the Community</span>
              </motion.button>

              <motion.p
                className="text-gray-600 text-xs tracking-widest uppercase"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Free · No spam · Forever
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="cards"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CommunityCard
                title="WhatsApp"
                icon={<FaWhatsapp />}
                color="text-green-400"
                link={LINKS.whatsapp}
                description="Instant updates, resources, and a tight-knit builder community."
                accentFrom="#22c55e"
                accentTo="#14b8a6"
                delay={0}
              />
              <CommunityCard
                title="Telegram"
                icon={<FaTelegramPlane />}
                color="text-sky-400"
                link={LINKS.telegram}
                description="Deep discussions, polls, code drops, and 24/7 collaboration."
                accentFrom="#38bdf8"
                accentTo="#7b2ff7"
                delay={0.1}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Stats Row ── */}
      <motion.div
        className="relative z-20 flex flex-wrap justify-center gap-12 mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        {[
          { num: '10k+', label: 'Members' },
          { num: '500+', label: 'Challenges' },
          { num: '200+', label: 'Projects' },
          { num: '50+', label: 'Mentors' },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div
              className="text-4xl font-black text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #00f5d4, #7b2ff7)',
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              }}
            >
              {s.num}
            </div>
            <div className="text-gray-500 text-xs uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── Divider ── */}
      <div className="relative z-20 w-full max-w-6xl mb-16 flex items-center gap-4">
        <motion.div
          className="flex-1 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        <span className="text-gray-600 text-xs tracking-widest uppercase">What you get</span>
        <motion.div
          className="flex-1 h-px"
          style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* ── Features ── */}
      <motion.div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {features.map((f, i) => (
          <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} index={i} />
        ))}
      </motion.div>

      {/* ── Bottom watermark ── */}
      <motion.div
        className="relative z-20 mt-20 text-gray-700 text-xs tracking-[0.4em] uppercase"
        style={{ fontFamily: "'Courier New', monospace" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
      </motion.div>
    </section>
  );
}