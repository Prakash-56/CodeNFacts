'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionTemplate, useMotionValue, useSpring, AnimatePresence, Variants } from 'framer-motion';
import { LifeBuoy, MessageCircle, ArrowRight, X, Send, Sparkles, HelpCircle } from 'lucide-react';

const ROTATION_RANGE = 18;
const GLINT_INTENSITY = 0.15;

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 28,
      delay: i * 0.07 + 0.08,
    },
  }),
};

const typingContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14 },
  },
};

const typingDot = {
  hidden: { y: 0 },
  visible: {
    y: [-4, 0, -4],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export default function HelpSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I assist you today?', sender: 'agent' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue.trim(), sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Fake AI delay + response
    setTimeout(() => {
      const responses = [
        "Got it! Let me help you with that. Could you tell me a bit more?",
        "Thanks for the details. Checking our knowledge base right now…",
        "This is a common question - here's what usually helps:",
        "I'm looking into this for you. One moment please…",
        "Quick tip: many users solve this by…",
        "Our real support engineers are great - but let me try first 😄",
        "For the fastest resolution, you can also email: codenfacts@gmail.com or support@codenfacts.in",
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [...prev, { id: Date.now(), text: reply, sender: 'agent' }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 1400);
  };

  // ─── 3D Card Tilt ────────────────────────────────────────
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 120, damping: 18 });
  const rotateY = useSpring(y, { stiffness: 120, damping: 18 });
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    x.set((deltaY / rect.height) * ROTATION_RANGE * -1);
    y.set((deltaX / rect.width) * ROTATION_RANGE);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden bg-zinc-950 flex flex-col items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-600/20 via-cyan-500/10 to-transparent blur-3xl" />
      </div>

      {/* ─── Main floating card ─── */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: 'preserve-3d', transform, perspective: 1000 }}
        className="relative w-full max-w-4xl h-[420px] md:h-[460px] rounded-2xl border border-white/8 bg-gradient-to-br from-zinc-900/70 via-zinc-950/70 to-black/60 backdrop-blur-xl shadow-2xl overflow-hidden z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.08),transparent_60%)]" />

        <div
          className="relative h-full flex flex-col items-center justify-center p-8 md:p-10"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Floating orb when chat is closed */}
          <AnimatePresence mode="wait">
            {!isChatOpen && (
              <motion.div
                key="orb"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative mb-10"
              >
              </motion.div>
            )}
          </AnimatePresence>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-4 tracking-tight text-center">
            Support Agent
          </h2>

          <p className="text-zinc-400 max-w-lg text-center mb-10 md:mb-12 text-lg leading-relaxed">
            Ask anything - get instant help from our intelligent assistant
          </p>

          <div className="flex flex-col sm:flex-row gap-5 z-10" style={{ transform: 'translateZ(60px)' }}>
            <Link href="/apply-for-help">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group relative px-7 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-white transition-all flex items-center gap-2.5 backdrop-blur-sm"
              >
                <HelpCircle size={18} />
                Get Human Help
              </motion.button>
            </Link>

            <motion.button
              onClick={() => setIsChatOpen(!isChatOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className={`group relative px-8 py-4 font-semibold rounded-xl overflow-hidden flex items-center gap-2.5 transition-all shadow-lg ${
                isChatOpen
                  ? 'bg-gradient-to-r from-red-600/80 to-rose-600/80 hover:from-red-500 hover:to-rose-500'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity" />
              <MessageCircle size={19} />
              <span>{isChatOpen ? 'Close Agent' : 'Start Chat'}</span>
              <ArrowRight
                size={18}
                className={`transition-transform duration-300 ${isChatOpen ? 'rotate-90' : 'group-hover:translate-x-1.5'}`}
              />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ─── Floating Chat Window ─── */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-6 right-4 sm:bottom-10 sm:right-10 w-[340px] sm:w-[380px] h-[520px] md:h-[560px] bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/70 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50"
          >
            {/* Header with animated avatar */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-4 border-b border-zinc-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-zinc-900 animate-pulse" />
                </div>
                <div>
                  <div className="font-semibold text-white">AI Assistant</div>
                  <div className="text-xs text-emerald-400/90">Online • typically replies instantly</div>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-800/70 transition-colors"
              >
                <X size={20} className="text-zinc-400 hover:text-white" />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-zinc-950/40 to-transparent scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  custom={idx}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-tr-none'
                        : 'bg-zinc-800/90 text-zinc-100 rounded-tl-none border border-zinc-700/50'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-zinc-800/80 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center border border-zinc-700/40">
                      <motion.span variants={typingDot} initial="hidden" animate="visible" className="w-2 h-2 bg-zinc-500 rounded-full" />
                      <motion.span
                        variants={typingDot}
                        initial="hidden"
                        animate="visible"
                        className="w-2 h-2 bg-zinc-500 rounded-full [animation-delay:0.2s]"
                      />
                      <motion.span
                        variants={typingDot}
                        initial="hidden"
                        animate="visible"
                        className="w-2 h-2 bg-zinc-500 rounded-full [animation-delay:0.4s]"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-zinc-800/80 bg-zinc-900/80 backdrop-blur-sm"
            >
              <div className="relative flex items-center">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-zinc-800/70 border border-zinc-700 rounded-full py-3 pl-5 pr-14 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner"
                />
                <motion.button
                  type="submit"
                  disabled={!inputValue.trim()}
                  whileHover={{ scale: inputValue.trim() ? 1.12 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 p-2.5 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full text-white disabled:opacity-40 disabled:scale-100 transition-all shadow-md"
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}