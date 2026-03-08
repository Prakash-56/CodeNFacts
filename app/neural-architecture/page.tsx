"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Layers, Activity, Zap, Database, Share2, ShieldCheck } from 'lucide-react';

// --- Types ---
interface LayerProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  neurons: number;
}

// --- Data Configuration ---
const ARCHITECTURE_LAYERS: LayerProps[] = [
  {
    id: 'input',
    title: 'Input Vector',
    description: 'Raw data ingestion and normalization layer.',
    icon: <Database className="w-6 h-6" />,
    color: '#3B82F6', // Blue
    neurons: 6
  },
  {
    id: 'hidden-1',
    title: 'Convolutional Base',
    description: 'Feature extraction via multidimensional filters.',
    icon: <Layers className="w-6 h-6" />,
    color: '#8B5CF6', // Purple
    neurons: 8
  },
  {
    id: 'hidden-2',
    title: 'Attention Mechanism',
    description: 'Weighted relational mapping and context awareness.',
    icon: <Zap className="w-6 h-6" />,
    color: '#EC4899', // Pink
    neurons: 8
  },
  {
    id: 'output',
    title: 'Softmax Output',
    description: 'Probability distribution and classification results.',
    icon: <Activity className="w-6 h-6" />,
    color: '#10B981', // Emerald
    neurons: 4
  }
];

export default function NeuralArchitecture() {
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  // Periodic "Data Pulse" effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseKey(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans selection:bg-purple-500/30">
      {/* Background Grid/Ambient Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(2,6,23,1)_100%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <header className="relative z-10 max-w-6xl mx-auto mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400">
            NEURAL ARCHITECTURE
          </h1>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
            Deep dive into the CodeNFacts computational core. Our models utilize multi-head attention and recursive feature refinement.
          </p>
        </motion.div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Visualizer Section */}
        <div className="relative w-full lg:w-3/5 h-[600px] flex justify-between items-center px-4 bg-slate-900/40 rounded-3xl border border-slate-800 backdrop-blur-sm overflow-hidden">
          
          {/* Animated Connecting Lines (Synapses) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {ARCHITECTURE_LAYERS.map((layer, i) => {
              if (i === ARCHITECTURE_LAYERS.length - 1) return null;
              return (
                <motion.line
                  key={`line-${layer.id}`}
                  x1={`${(i * 25) + 15}%`}
                  y1="50%"
                  x2={`${((i + 1) * 25) + 15}%`}
                  y2="50%"
                  stroke={layer.color}
                  strokeWidth="2"
                  strokeDasharray="10 5"
                  initial={{ strokeDashoffset: 100, opacity: 0.2 }}
                  animate={{ 
                    strokeDashoffset: [100, 0],
                    opacity: hoveredLayer === layer.id ? 0.8 : 0.2 
                  }}
                  transition={{ 
                    strokeDashoffset: { repeat: Infinity, duration: 2, ease: "linear" },
                    opacity: { duration: 0.3 }
                  }}
                />
              );
            })}
          </svg>

          {/* Layer Nodes */}
          {ARCHITECTURE_LAYERS.map((layer, idx) => (
            <div key={layer.id} className="relative z-20 flex flex-col items-center">
              <motion.div
                onHoverStart={() => setHoveredLayer(layer.id)}
                onHoverEnd={() => setHoveredLayer(null)}
                whileHover={{ scale: 1.1 }}
                className="group cursor-help"
              >
                {/* Visual Neurons Stack */}
                <div className="flex flex-col gap-2 mb-4">
                  {Array.from({ length: layer.neurons }).map((_, nIdx) => (
                    <motion.div
                      key={nIdx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (idx * 0.1) + (nIdx * 0.05) }}
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: layer.color,
                        boxShadow: `0 0 10px ${layer.color}` 
                      }}
                    >
                      <AnimatePresence>
                        {pulseKey % 2 === 0 && (
                          <motion.div
                            key="pulse"
                            initial={{ scale: 1, opacity: 0.5 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            className="w-full h-full rounded-full bg-white absolute"
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                <div 
                  className="p-4 rounded-xl border-2 transition-all duration-300"
                  style={{ 
                    borderColor: hoveredLayer === layer.id ? layer.color : 'transparent',
                    backgroundColor: 'rgba(30, 41, 59, 0.8)'
                  }}
                >
                  {layer.icon}
                </div>
              </motion.div>
              
              <motion.span 
                className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500"
                animate={{ color: hoveredLayer === layer.id ? '#fff' : '#64748b' }}
              >
                {layer.id}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          {ARCHITECTURE_LAYERS.map((layer) => (
            <motion.div
              key={layer.id}
              layout
              initial={{ opacity: 0, x: 50 }}
              animate={{ 
                opacity: (hoveredLayer === null || hoveredLayer === layer.id) ? 1 : 0.4,
                x: 0,
                scale: hoveredLayer === layer.id ? 1.05 : 1
              }}
              className={`p-6 rounded-2xl border transition-all duration-500 ${
                hoveredLayer === layer.id 
                  ? 'bg-slate-800/80 border-white/20 shadow-2xl' 
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div 
                  className="p-2 rounded-lg" 
                  style={{ backgroundColor: `${layer.color}22`, color: layer.color }}
                >
                  {layer.icon}
                </div>
                <h3 className="text-xl font-bold">{layer.title}</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {layer.description}
              </p>
              
              {hoveredLayer === layer.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 pt-4 border-t border-slate-700 flex justify-between text-[10px] font-mono uppercase tracking-tighter"
                >
                  <span>Precision: 99.8%</span>
                  <span>Latency: 12ms</span>
                  <span>Nodes: {layer.neurons}k</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer Stats */}
      <footer className="mt-20 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 pb-20">
        {[
          { label: 'Parameters', val: '1.2B+', icon: <Cpu className="w-4 h-4" /> },
          { label: 'Training Data', val: '400TB', icon: <Database className="w-4 h-4" /> },
          { label: 'Optimization', val: 'AdamW', icon: <Zap className="w-4 h-4" /> },
          { label: 'Security', val: 'AES-256', icon: <ShieldCheck className="w-4 h-4" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="text-purple-500">{stat.icon}</div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold">{stat.label}</p>
              <p className="text-lg font-mono font-bold">{stat.val}</p>
            </div>
          </div>
        ))}
      </footer>
    </div>
  );
}