"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Zap, CheckCircle2, Linkedin, Instagram, Terminal, Mail, ChevronRight, Code2, Shield, FileText, Server, Headphones } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "typing" | "success" | "error">("idle");
  const [terminalText, setTerminalText] = useState("");
  const currentYear = new Date().getFullYear();

  // Navigation links - UPDATE THESE WITH YOUR ACTUAL LINKS
  const navLinks = {
    // Core Modules
    aiRoadmap: "#ai-roadmap",
    neuralArchitecture: "#neural-architecture", 
    mlPipeline: "#ml-pipeline",
    codeAcademy: "#code-academy",
    
    // Network
    privacyMatrix: "/privacy-policy",
    terms: "/terms-and-conditions",
    apiAccess: "/refund-policy",
    supportNode: "/support"
  };

  // Social links - UPDATE THESE WITH YOUR ACTUAL LINKS
  const socialLinks = {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/company/codenfacts", 
    instagram: "https://www.instagram.com/codenfacts?igsh=MTRxaGI0djF6cnNqaQ=="
  };

  // Terminal typing animation
  useEffect(() => {
    const messages = [
      `Initializing CodeNFacts v${currentYear}...`,
      `[OK] Systems nominal`,
      `[INFO] Neural core: 99.7%`,
      `> Ready for deployment`,
    ];
    
    let index = 0;
    let charIndex = 0;
    let direction = 1;

    const typeWriter = () => {
      if (direction === 1 && charIndex <= messages[index].length) {
        setTerminalText(messages[index].slice(0, charIndex));
        charIndex++;
        setTimeout(typeWriter, 50);
      } else if (direction === 1) {
        direction = -1;
        setTimeout(typeWriter, 1000);
      } else if (charIndex >= 0) {
        setTerminalText(messages[index].slice(0, charIndex));
        charIndex--;
        setTimeout(typeWriter, 30);
      } else {
        index = (index + 1) % messages.length;
        direction = 1;
        charIndex = 0;
        setTimeout(typeWriter, 500);
      }
    };
    typeWriter();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("typing");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setEmail("");
      }, 2000);
    }, 1500);
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12 px-6 overflow-hidden">
      {/* Matrix rain background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#3b82f6,#1e3a8a_50%,transparent_50%)] opacity-20 animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(59,130,246,0.03)_0%,transparent_50%,rgba(59,130,246,0.03)_100%)] animate-pulse" />
      </div>

      {/* Glitch top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-pulse opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-4 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="text-xs font-mono text-green-400 tracking-wider">LIVE</span>
            </div>
            
            <div className="relative">
              <h2 className="text-6xl font-mono font-black bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                CodeN
                <br />
                <span className="text-4xl">Facts</span>
              </h2>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60 animate-pulse" />
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed font-mono max-w-md">
              Deploying tomorrow's intelligence today.
            </p>
          </motion.div>

          {/* Navigation */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <FooterColumn 
              title="Core Modules" 
              items={[
                { name: "AI Roadmap", href: navLinks.aiRoadmap, icon: <Zap size={14} /> },
                { name: "Neural Architecture", href: navLinks.neuralArchitecture, icon: <Code2 size={14} /> },
                { name: "ML Pipeline", href: navLinks.mlPipeline, icon: <Server size={14} /> },
                { name: "Code Academy", href: navLinks.codeAcademy, icon: <Code2 size={14} /> }
              ]} 
            />
            <FooterColumn 
              title="Network" 
              items={[
                { name: "Privacy Policy", href: navLinks.privacyMatrix, icon: <Shield size={14} /> },
                { name: "Terms v2.0", href: navLinks.terms, icon: <FileText size={14} /> },
                { name: "Refund Policy", href: navLinks.apiAccess, icon: <Server size={14} /> },
                { name: "Support Node", href: navLinks.supportNode, icon: <Headphones size={14} /> }
              ]} 
            />
          </div>

          {/* Newsletter Terminal */}
          <motion.div 
            className="lg:col-span-4"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-black/80 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8 shadow-2xl shadow-green-500/10">
              <div className="flex items-center gap-2 mb-6 text-green-400 text-sm font-mono">
                <Terminal size={16} />
                <span>user@codenfacts</span>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter neural address..."
                    className="w-full pl-10 pr-12 py-4 bg-black/50 border border-gray-700/50 hover:border-green-500/50 focus:border-green-500/80 rounded-xl text-white font-mono text-sm focus:outline-none transition-all backdrop-blur-sm"
                  />
                  <motion.div
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                    animate={{ scale: status === "success" ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </div>
                
                <AnimatePresence mode="wait">
                  {status === "success" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-2 text-green-400 text-sm font-mono"
                    >
                      <CheckCircle2 size={16} />
                      Synapse connected. Updates deployed.
                    </motion.div>
                  )}
                  {status === "typing" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2 text-yellow-400 text-sm font-mono"
                    >
                      <Zap size={16} />
                      Establishing neural link...
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Terminal Status Bar */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="mt-20"
        >
          <div className="group relative bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl border border-green-500/30 rounded-3xl p-6 shadow-2xl shadow-green-500/5 hover:shadow-green-500/20 transition-all duration-500">
            {/* Glitch effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-blue-500/10 rounded-3xl group-hover:animate-pulse transition-all" />
            
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Terminal Output */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-red-400/80 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-yellow-400/80 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-green-400/80 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <span className="text-xs font-mono text-gray-500">CodeNFacts@systems</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm font-mono text-green-400 mb-3">
                  <Code2 size={16} />
                  <span className="font-mono">{terminalText}</span>
                  <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse ml-2" />
                </div>
                
                <div className="text-xs text-gray-500 font-mono">
                  neural-load: 0.47% | uptime: 847d 12h | v{currentYear}.1.3
                </div>
              </div>

              {/* Social + Copyright */}
              <div className="flex items-center gap-8 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <SocialButton icon={<Github size={20} />} href={socialLinks.github} />
                  <SocialButton icon={<Linkedin size={20} />} href={socialLinks.linkedin} />
                  <SocialButton icon={<Instagram size={20} />} href={socialLinks.instagram} />
                </div>
                
                <div className="text-xs font-mono text-gray-500 uppercase tracking-wider border-l border-gray-700 pl-6 hidden lg:block">
                  core©{currentYear}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

interface FooterColumnItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface FooterColumnProps {
  title: string;
  items: FooterColumnItem[];
}

function FooterColumn({ title, items }: FooterColumnProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-mono text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-700 pb-2">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <motion.li
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <NavLink href={item.href} icon={item.icon}>
              {item.name}
            </NavLink>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function NavLink({ 
  href, 
  icon, 
  children 
}: { 
  href: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 text-gray-400 hover:text-green-400 group-hover:before:w-6 transition-all font-mono text-sm relative before:absolute before:h-px before:bg-green-400 before:w-0 before:group-hover:w-6 before:transition-all before:-left-6 hover:underline decoration-green-400/50"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}

function SocialButton({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded-xl transition-all duration-300 group backdrop-blur-sm border border-gray-700/50 hover:border-green-500/50"
    >
      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
        {icon}
      </motion.div>
    </a>
  );
}

