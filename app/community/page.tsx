'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CommunityPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0f0f1f] via-[#1a0f2f] to-[#100f1f] flex flex-col items-center justify-center px-6 py-32 text-center">
      <motion.h1
        className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ff2d95] via-[#6a0ff1] to-[#00fff0] mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to Our Community
      </motion.h1>

      <motion.p
        className="text-gray-300 max-w-2xl text-lg mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Connect, collaborate, and grow with thousands of developers, AI enthusiasts, and data scientists. Share projects, learn new skills, and accelerate your coding journey.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Link
          href="/signup"
          className="inline-block px-12 py-4 text-2xl font-bold bg-gradient-to-r from-[#ff2d95] via-[#6a0ff1] to-[#00fff0] text-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all"
        >
          Join Now
        </Link>
      </motion.div>
    </section>
  );
}
