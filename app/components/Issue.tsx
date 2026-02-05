'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Bug, Terminal } from 'lucide-react';

export default function IssueSection() {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <section className="relative bg-zinc-950 py-24 px-4 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div 
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center"
        >
            {/* The Spotlight Effect */}
            <div
                className="pointer-events-none absolute -inset-px transition opacity duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(239, 68, 68, 0.15), transparent 40%)`,
                }}
            />
            
            {/* Spotlight Border */}
            <div
                className="pointer-events-none absolute -inset-px rounded-2xl transition opacity duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(239, 68, 68, 0.4), transparent 40%)`,
                    maskImage: 'linear-gradient(black, black)',
                    WebkitMaskImage: 'linear-gradient(black, black)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    padding: '1px',
                }} 
            />

            <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 rounded-full bg-red-500/10 p-4 ring-1 ring-red-500/50">
                    <AlertTriangle className="h-8 w-8 text-red-500 animate-pulse" />
                </div>

                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
                   <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-200 via-red-500 to-red-200 animate-shine bg-[length:200%_auto]">
                    Found a Glitch?
                   </span>
                </h2>
                
                <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
                    If you've encountered a bug or a performance issue, let us know immediately. We reward rigorous bug hunters.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link href="/ApplyForIssue">
                        <button className="flex items-center gap-2 rounded-md bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-transform hover:scale-105 cursor-pointer">
                            <Bug className="h-4 w-4" />
                            Apply for Issue
                        </button>
                    </Link>
                    <button className="flex items-center gap-2 rounded-md border border-zinc-700 bg-transparent px-6 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer">
                        <Terminal className="h-4 w-4" />
                        View Status Log
                    </button>
                </div>
            </div>
        </div>
      </div>
      
      {/* Glitch Overlay Decoration */}
      <div className="absolute top-20 left-10 h-24 w-1 bg-red-500/20 blur-sm rotate-12" />
      <div className="absolute bottom-20 right-10 h-24 w-1 bg-red-500/20 blur-sm -rotate-12" />
    </section>
  );
}