'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

export default function CertificatePreview() {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `rotateX(${-offsetY / 25}deg) rotateY(${offsetX / 25}deg) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <section className="relative py-32 px-6 bg-[#030712] overflow-hidden">
      
      {/* --- NEW ANIMATED BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        {/* Animated Gradient Blob 1 */}
        <motion.div 
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"
        />
        {/* Animated Gradient Blob 2 */}
        <motion.div 
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"
        />
        
        {/* Moving Grid Overlay (Optional, for tech look) */}
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>

      {/* --- MAIN CONTENT (Ensure z-10) --- */}
      <div className="relative z-10">
        <motion.div
          className="max-w-5xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl font-bold text-white mb-4">Get Certificate</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Every course completion earns you a professional certificate you can showcase on your LinkedIn profile or resume.
          </p>
        </motion.div>

        {/* Certificate Card */}
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="max-w-4xl mx-auto rounded-3xl shadow-2xl border border-white/10 overflow-hidden bg-gradient-to-tr from-blue-900/40 to-purple-900/40 backdrop-blur-md cursor-pointer transition-all duration-500"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          <img
            src="/certificate - preview.png" 
            alt="Certificate Example"
            className="w-full h-auto object-cover"
          />
        </motion.div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <motion.a
            href="/courses/apply"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-12 py-4 bg-blue-600 text-white text-xl font-semibold rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
          >
            Enroll Now & Get Certificate
          </motion.a>
        </div>
      </div>
    </section>
  );
}