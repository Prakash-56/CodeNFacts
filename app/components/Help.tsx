'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionTemplate, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { LifeBuoy, MessageCircle, ArrowRight, X, Send, HelpCircle } from 'lucide-react';

const ROTATION_RANGE = 20;
const HALF_ROTATION_RANGE = 20 / 2;

export default function HelpSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // --- Chat Logic State ---
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! 👋 How can we help you today?", sender: 'agent' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "I can certainly help with that! Could you give me more details?",
        "Thanks for reaching out. Let me check our documentation for you.",
        "That sounds like a known issue. Have you tried clearing your cache?",
        "I'm just a demo bot 🤖, but I promise our real team is awesome!",
        "I suggest you for your betttr answer , drop a message at - codenfacts@gmail.com"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const agentMsg = { id: Date.now() + 1, text: randomResponse, sender: 'agent' };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1500);
  };

  // --- 3D Tilt Logic ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x);
  const ySpring = useSpring(y);
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;
    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;
    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative w-full py-20 overflow-hidden bg-zinc-950 flex items-center justify-center flex-col">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />

      {/* --- Main 3D Card --- */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: 'preserve-3d', transform }}
        className="relative h-[400px] w-full max-w-4xl rounded-xl bg-gradient-to-br from-zinc-900/50 to-zinc-900/10 border border-white/10 p-8 shadow-2xl backdrop-blur-md z-10"
      >
        <div
          style={{ transform: 'translateZ(75px)', transformStyle: 'preserve-3d' }}
          className="absolute inset-4 grid place-content-center rounded-xl bg-zinc-900/80 shadow-inner border border-white/5"
        >
          {/* Floating Icon */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]"
          >
            <LifeBuoy className="h-10 w-10 text-blue-400" />
          </motion.div>

          <h2 className="text-center text-3xl font-bold text-white mb-2 tracking-tight">
            Need assistance?
          </h2>
          <p className="text-center text-zinc-400 max-w-md mx-auto mb-8">
            Our support team is standing by. Submit a ticket for complex inquiries or chat with us for quick help.
          </p>

          <div className="flex gap-4 justify-center" style={{ transform: 'translateZ(50px)' }}>
            
            {/* 1. APPLY FOR HELP BUTTON */}
            <Link href="/ApplyForHelp">
                <button className="group relative flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition-all cursor-pointer">
                <HelpCircle size={18} />
                <span>Get Help</span>
                </button>
            </Link>

            {/* 2. LIVE CHAT BUTTON */}
            <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>{isChatOpen ? 'Close Chat' : 'Chat'}</span>
              <ArrowRight size={16} className={`transition-transform ${isChatOpen ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* --- Chat Widget Overlay --- */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 right-8 w-80 sm:w-96 h-[500px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-zinc-800 p-4 border-b border-zinc-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                    </div>
                    <span className="text-white font-semibold">Support Agent</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-900/95">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-300 rounded-tl-none'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-800 p-3 rounded-xl rounded-tl-none flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-zinc-800 bg-zinc-900">
                <div className="relative flex items-center gap-2">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..." 
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-full py-2.5 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                    />
                    <button type="submit" disabled={!inputValue.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:opacity-50 transition-all">
                        <Send size={14} />
                    </button>
                </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}