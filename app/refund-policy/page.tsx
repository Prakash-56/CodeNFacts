'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Clock, MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RefundPolicy() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollY: scrollProgress } = useScroll();

  const yBackground = useTransform(scrollProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cards = [
    {
      icon: Shield,
      title: "Digital First Policy",
      description: "CodeNFacts delivers instant-access digital courses. Once granted, refunds aren't applicable to maintain sustainable content creation.",
      accent: "from-orange-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "48-Hour Safety Net",
      description: "Technical glitches? Duplicate payments? Reach out within 48 hours and we'll make it right.",
      accent: "from-emerald-500 to-teal-500"
    },
    {
      icon: MessageCircle,
      title: "Lightning Support",
      description: "Email support@codenfacts.in - responses typically within 24 hours.",
      accent: "from-purple-500 to-indigo-500",
      cta: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white relative overflow-x-hidden">
      {/* Parallax Background */}
      <motion.div 
        className="fixed inset-0 bg-gradient-to-br from-orange-500/5 via-pink-500/5 to-purple-500/5 -z-10"
        style={{ y: yBackground }}
      />
      
      {/* Organic Blob Shapes */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-400/30 to-pink-400/30 rounded-6xl blur-3xl animate-blob" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-6xl blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-indigo-400/30 rounded-6xl blur-3xl animate-blob animation-delay-4000" />
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      <div className="relative z-10 px-6 py-24 lg:py-32 max-w-5xl mx-auto">
        {/* Hero Header */}
        <motion.header 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24 lg:mb-32"
        >
          <div className="inline-flex items-center gap-4 px-10 py-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl mb-12 extrude-shadow">
            <div className="p-4 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl shadow-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent tracking-tight">
                Refund Policy
              </h1>
              <p className="text-orange-400 font-medium mt-2 text-lg">Clear. Fair. Transparent.</p>
            </div>
          </div>
        </motion.header>

        {/* 3D Neomorphic Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -12, 
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="group relative"
              >
                {/* Card Background */}
                <div className={`h-80 lg:h-96 rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl overflow-hidden extrude-card`}>
                  
                  {/* Inner Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`} />
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 mb-8 group-hover:scale-110 transition-all duration-500 mx-auto">
                      <Icon className={`w-10 h-10 text-white shadow-lg ${card.accent === "from-orange-500 to-pink-500" ? "drop-shadow-orange-glow" : card.accent === "from-emerald-500 to-teal-500" ? "drop-shadow-emerald-glow" : "drop-shadow-purple-glow"}`} />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl lg:text-2xl font-black text-white mb-6 text-center px-4 leading-tight">
                      {card.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-300 leading-relaxed flex-1 text-center px-4 mb-8">
                      {card.description}
                    </p>

                    {/* CTA */}
                    {card.cta && (
                      <motion.a
                        href="mailto:support@codenfacts.in"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 hover:border-white/40 font-semibold text-white shadow-xl mx-auto transition-all duration-300 group/cta"
                      >
                        Get Help
                        <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-1 transition-transform duration-300" />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Footer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-24 pt-16 border-t border-white/10"
        >
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-8 animate-bounce" />
          <h3 className="text-2xl font-black text-white mb-4">Your Trust Matters</h3>
          <p className="text-xl text-gray-400 max-w-lg mx-auto leading-relaxed">
            CodeNFacts is committed to fair policies that protect both creators and learners.
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .extrude-shadow {
          box-shadow: 
            20px 20px 40px rgba(0,0,0,0.3),
            -20px -20px 40px rgba(255,255,255,0.05);
        }
        .extrude-card {
          box-shadow: 
            inset 4px 4px 8px rgba(255,255,255,0.1),
            inset -4px -4px 8px rgba(0,0,0,0.4),
            15px 15px 30px rgba(0,0,0,0.3);
        }
        .drop-shadow-orange-glow {
          filter: drop-shadow(0 0 20px rgba(249,115,22,0.6));
        }
        .drop-shadow-emerald-glow {
          filter: drop-shadow(0 0 20px rgba(16,185,129,0.6));
        }
        .drop-shadow-purple-glow {
          filter: drop-shadow(0 0 20px rgba(168,85,247,0.6));
        }
      `}</style>
    </div>
  );
}
