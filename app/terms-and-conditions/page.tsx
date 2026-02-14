'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Terms() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-grid-white/5 [background-size:100px_100px] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#3b82f6,#1e3a8a,#1e293b)] opacity-30 animate-blob" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#10b981,#065f46,#1e293b)] opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-6"
            animate={{ 
              scale: [1, 1.05, 1],
              rotateX: [0, 5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            Terms & Conditions
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            By accessing CodeNFacts.in and purchasing our courses, you agree to these binding terms.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Section 1 */}
          <motion.section variants={sectionVariants}>
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6 flex items-center gap-4"
            >
              <span className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-xl font-bold shadow-2xl">
                01
              </span>
              Course Access & Usage
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              className="space-y-6 text-gray-300 leading-relaxed text-lg"
            >
              <p>Access to courses is granted immediately upon successful payment confirmation via our secure payment gateway.</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Course materials are for personal, non-commercial use only</li>
                <li>Access expires 12 months from purchase date unless otherwise specified</li>
                <li>Concurrent logins are limited to 2 devices per account</li>
                <li>Sharing login credentials is strictly prohibited</li>
              </ul>
            </motion.div>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={sectionVariants}>
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6 flex items-center gap-4"
            >
              <span className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-xl font-bold shadow-2xl">
                02
              </span>
              Intellectual Property Rights
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              className="space-y-6 text-gray-300 leading-relaxed text-lg"
            >
              <p>All course content, including videos, code samples, documents, and graphics, is protected by Indian copyright laws and international treaties.</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Content cannot be downloaded, copied, or redistributed</li>
                <li>Screen recording for commercial purposes is prohibited</li>
                <li>All trademarks and logos are property of CodeNFacts</li>
                <li>Violations will result in immediate account termination and legal action</li>
              </ul>
            </motion.div>
          </motion.section>

          {/* Section 3 */}
          <motion.section variants={sectionVariants}>
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6 flex items-center gap-4"
            >
              <span className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-xl font-bold shadow-2xl">
                03
              </span>
              Refund & Cancellation Policy
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              className="space-y-6 text-gray-300 leading-relaxed text-lg"
            >
              <p>All sales are final. No refunds will be issued after course access is granted.</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>7-day cooling-off period for first-time buyers (before accessing content)</li>
                <li>Refunds processed to original payment method within 7-10 business days</li>
                <li>Technical issues? Contact support within 48 hours of purchase</li>
                <li>Refund requests must be submitted via support@codenfacts.in</li>
              </ul>
            </motion.div>
          </motion.section>

          {/* Section 4 */}
          <motion.section variants={sectionVariants}>
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6 flex items-center gap-4"
            >
              <span className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-xl font-bold shadow-2xl">
                04
              </span>
              Liability & Disclaimers
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              className="space-y-6 text-gray-300 leading-relaxed text-lg"
            >
              <p>CodeNFacts provides educational content "as is" without warranties of any kind.</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Platform not liable for lost profits or indirect damages</li>
                <li>User responsible for maintaining account security</li>
                <li>Course completion doesn't guarantee employment</li>
                <li>We reserve right to modify courses without notice</li>
              </ul>
            </motion.div>
          </motion.section>

          {/* Final CTA */}
          <motion.div 
            variants={itemVariants}
            className="text-center pt-16 border-t-2 border-gray-800"
          >
            <motion.p 
              className="text-xl text-gray-400 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Last updated: February 13, 2026
            </motion.p>
            <motion.div
              className="inline-flex items-center gap-4 p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700"
              whileHover={{ scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl">🤝</span>
              <span className="font-semibold text-lg">By using our platform, you agree to these terms</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .bg-grid-white\/5 {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}
