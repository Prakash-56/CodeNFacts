'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Shield, Clock, MessageCircle, CheckCircle2, ArrowRight, 
  Award, Users, AlertCircle, HelpCircle, ChevronDown, 
  Zap, Star 
} from 'lucide-react';

export default function RefundPolicy() {
  const [scrollY, setScrollY] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "120%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const highlightCards = [
    {
      icon: Shield,
      title: "Digital-First Protection",
      description: "Instant access = instant value. Once the course is unlocked, refunds are not possible to protect creators and sustain premium content.",
      accent: "from-orange-500 via-pink-500 to-rose-500",
      glow: "drop-shadow-orange-glow"
    },
    {
      icon: Clock,
      title: "48-Hour Safety Net",
      description: "Technical issues, duplicate charges, or failed access? We fix it instantly — no questions asked within 48 hours of purchase.",
      accent: "from-emerald-500 via-teal-500 to-cyan-500",
      glow: "drop-shadow-emerald-glow"
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "Expert-crafted courses with lifetime updates. Content mismatch? Reach out within 7 days — we’ll make it right or offer a full alternative.",
      accent: "from-amber-500 via-yellow-500 to-orange-500",
      glow: "drop-shadow-amber-glow"
    },
    {
      icon: Users,
      title: "Learner-First Culture",
      description: "Your success is our KPI. Every refund request is reviewed personally by our founding team to improve future experiences.",
      accent: "from-violet-500 via-purple-500 to-fuchsia-500",
      glow: "drop-shadow-purple-glow"
    },
    {
      icon: Zap,
      title: "Lightning Resolution",
      description: "Average resolution time: 18 hours. We don’t just process refunds — we solve problems and exceed expectations.",
      accent: "from-sky-500 via-blue-500 to-indigo-500",
      glow: "drop-shadow-sky-glow"
    }
  ];

  const refundSteps = [
    {
      number: "01",
      icon: MessageCircle,
      title: "Submit Your Request",
      description: "Email support@codenfacts.in with order ID, purchase email, screenshot of issue, and reason. Must be within eligibility window.",
      time: "Instant"
    },
    {
      number: "02",
      icon: CheckCircle2,
      title: "Smart Verification",
      description: "Our AI + human team cross-checks access logs, payment records, and course metadata in under 24 hours.",
      time: "< 24 hrs"
    },
    {
      number: "03",
      icon: ArrowRight,
      title: "Swift Resolution",
      description: "Approved refunds hit your original payment method in 3-7 business days. Technical issues resolved same-day.",
      time: "3-7 days"
    },
    {
      number: "04",
      icon: Star,
      title: "Feedback Loop",
      description: "Every case helps us improve. You’ll receive a personalized thank-you + 10% off your next course as goodwill.",
      time: "Always"
    }
  ];

  const faqs = [
    {
      q: "Can I get a refund after accessing the course?",
      a: "No. Once you unlock a course, the digital license is non-transferable and non-refundable. This protects our instructors who invest months creating premium content."
    },
    {
      q: "What counts as a 'technical issue' for the 48-hour window?",
      a: "Failed video playback, missing modules, login problems, payment charged twice, or course not appearing in your dashboard. We fix these instantly."
    },
    {
      q: "I bought the course but haven’t started yet - can I cancel?",
      a: "No! Just email us."
    },
    {
      q: "What if the course doesn’t match the description or preview?",
      a: "Contact us within 7 days with specific examples. We will either fix the issue, provide bonus content, or issue a full refund in exceptional cases."
    },
    {
      q: "How long does refund processing take?",
      a: "We are not offering refund."
    },
    {
      q: "Do you offer refunds for lifetime access courses?",
      a: "Same policy applies. Lifetime access is a huge value - we stand by our content quality and offer the 7-day quality guarantee instead."
    },
    {
      q: "I changed my mind after 10 days - any exceptions?",
      a: "We are strict after the window to maintain fairness. However, if you have a genuine hardship, our team reviews case-by-case."
    },
    {
      q: "Is my payment information secure?",
      a: "100% encrypted with Cashfree enterprise security. We never store card details."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-slate-950 text-white overflow-x-hidden relative">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-violet-500 z-50"
        style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
      />

      {/* Dynamic Parallax Background */}
      <motion.div 
        className="fixed inset-0 bg-[radial-gradient(at_50%_30%,rgba(249,115,22,0.08),transparent_50%)] -z-10"
        style={{ y: yBackground }}
      />
      
      {/* Premium Floating Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-3xl animate-blob-slow" />
        <div className="absolute top-1/3 -right-60 w-[700px] h-[700px] bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl animate-blob-slow animation-delay-4000" />
        <div className="absolute bottom-20 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full blur-3xl animate-blob-slow animation-delay-8000" />
      </div>

      <style jsx>{`
        @keyframes blob-slow {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(80px, -60px) scale(1.15); }
          50% { transform: translate(-40px, 90px) scale(0.92); }
          75% { transform: translate(60px, 40px) scale(1.08); }
        }
        .animate-blob-slow { animation: blob-slow 25s infinite ease-in-out; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-8000 { animation-delay: 8s; }

        .glass-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          box-shadow: 
            0 25px 50px -12px rgb(0 0 0 / 0.4),
            inset 0 2px 0 rgba(255,255,255,0.08),
            inset 0 -2px 0 rgba(0,0,0,0.6);
        }
      `}</style>

      <div className="relative z-10 px-6 py-20 lg:py-32 max-w-6xl mx-auto">
        {/* Hero Header - Premium Edition */}
        <motion.header 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ opacity: heroOpacity }}
          className="text-center mb-28"
        >
          <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 mb-8">
            <div className="px-4 py-1.5 bg-gradient-to-r from-orange-400 to-pink-400 text-xs font-bold tracking-[3px] rounded-full">UPDATED MARCH 7, 2026</div>
            <div className="h-px w-8 bg-white/30" />
            <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
              <Star className="w-4 h-4" /> 100% Transparent
            </span>
          </div>

          <div className="relative inline-flex flex-col items-center">
            <motion.div 
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"
            />
            
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl shadow-2xl mb-8 ring-8 ring-white/10">
              <Shield className="w-14 h-14 text-white" />
            </div>

            <h1 className="text-6xl lg:text-7xl font-black tracking-tighter bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Refund Policy
            </h1>
            <p className="mt-6 text-2xl text-zinc-400 max-w-2xl mx-auto font-light">
              Fair. Fast. Built for serious learners.<br />
              Because your time and trust are priceless.
            </p>
          </div>

        </motion.header>

        {/* Intro Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-24 text-xl text-zinc-300 leading-relaxed"
        >
          At <span className="text-orange-400 font-semibold">CodeNFacts</span>, we create premium coding courses with blood, sweat, and late nights. 
          Our refund policy is deliberately simple and learner-friendly - because we believe great education should never be a gamble.
        </motion.div>


        {/* Detailed Policy Breakdown */}
        <div className="max-w-4xl mx-auto mb-32">
          <div className="text-center mb-16">
            <div className="inline text-xs tracking-[4px] text-orange-400 font-mono mb-3">SECTION - FULL POLICY</div>
            <h2 className="text-5xl font-black tracking-tighter">The Complete Picture</h2>
          </div>

          {/* Policy Block 1 */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-20"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-500" />
              <span className="text-orange-400 font-mono text-sm">01</span>
              <h3 className="text-3xl font-semibold">Digital Products &amp; Instant Access</h3>
            </div>
            <div className="pl-16 text-zinc-300 leading-relaxed space-y-6">
              <p>All courses on CodeNFacts are delivered instantly upon successful payment. Once the course is unlocked in your dashboard, ownership is transferred and refunds cannot be issued. This is industry standard for digital education platforms worldwide.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>426 DAYs access + all future updates included</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Downloadable resources &amp; certificate</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Policy Block 2 */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-20"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-emerald-500" />
              <span className="text-emerald-400 font-mono text-sm">02</span>
              <h3 className="text-3xl font-semibold">Refund Eligibility Windows</h3>
            </div>
            <div className="pl-16 bg-zinc-900/50 border border-white/10 rounded-3xl p-10">
              <ul className="space-y-8">
                <li className="flex gap-6">
                  <div className="font-mono text-4xl text-emerald-400/30 font-black">48<span className="text-xs align-super">hrs</span></div>
                  <div>
                    <div className="font-semibold text-lg">Technical &amp; Access Issues</div>
                    <p className="text-zinc-400">Full refund or instant fix. No questions.</p>
                  </div>
                </li>
                <li className="flex gap-6">
                  <div className="font-mono text-4xl text-amber-400/30 font-black">7<span className="text-xs align-super">days</span></div>
                  <div>
                    <div className="font-semibold text-lg">Quality Guarantee</div>
                    <p className="text-zinc-400">If the course doesn’t match the preview or description.</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Policy Block 3 */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-rose-500" />
              <span className="text-rose-400 font-mono text-sm">03</span>
              <h3 className="text-3xl font-semibold">What Is Not Refundable</h3>
            </div>
            <div className="pl-16 text-zinc-400 space-y-4 text-[15px]">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-rose-500 mt-1" />
                <span>Access granted and partially/completely consumed courses</span>
              </div>
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-rose-500 mt-1" />
                <span>Change of mind after the 48-hour window</span>
              </div>
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-rose-500 mt-1" />
                <span>Bulk or team license purchases (unless pre-approved)</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated Refund Timeline */}
        <div className="max-w-4xl mx-auto mb-32">
          <div className="text-center mb-16">
            <div className="text-xs tracking-widest text-sky-400 font-mono">HOW IT ACTUALLY WORKS</div>
            <h2 className="text-5xl font-black tracking-tighter mt-3">Refund Journey in 4 Steps</h2>
          </div>

          <div className="relative pl-10 md:pl-20">
            {/* Timeline Line */}
            <div className="absolute left-[27px] md:left-[47px] top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

            {refundSteps.map((step, index) => {
              const IconComp = step.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative mb-24 last:mb-0 flex gap-8"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/20 flex items-center justify-center z-10">
                      <IconComp className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-1 -left-1 text-[10px] font-mono bg-zinc-950 border border-white/30 w-6 h-6 rounded-xl flex items-center justify-center text-orange-400">
                      {step.number}
                    </div>
                  </div>

                  <div className="-mt-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-2xl font-semibold tracking-tight">{step.title}</h4>
                      <div className="px-4 py-1 text-xs font-mono bg-white/5 border border-white/10 rounded-full text-emerald-400">
                        {step.time}
                      </div>
                    </div>
                    <p className="text-zinc-400 mt-3 max-w-md leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Premium FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-32">
          <div className="text-center mb-16">
            <HelpCircle className="w-12 h-12 mx-auto text-violet-400 mb-4" />
            <h2 className="text-5xl font-black tracking-tighter">Still Have Questions?</h2>
            <p className="text-zinc-400 mt-4">We answered the most common ones below</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-card border border-white/10 rounded-3xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-8 py-7 flex items-center justify-between text-left group"
                >
                  <span className="text-lg font-medium pr-8">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <ChevronDown className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 text-zinc-400 border-t border-white/10 pt-6">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Final Trust & Contact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto pb-20"
        >
          <div className="inline-flex items-center gap-2 text-emerald-400 mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Your trust is our biggest asset
          </div>

          <h3 className="text-4xl font-black mb-6">We’re here for you</h3>
          
          <p className="text-zinc-400 text-lg leading-relaxed mb-10">
            Whether it’s a technical hiccup or you simply want to talk about your learning goals - 
            our team responds within hours, not days.
          </p>

          <motion.a
            href="mailto:support@codenfacts.in"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl font-semibold text-xl shadow-2xl shadow-orange-500/40 hover:brightness-110 transition-all"
          >
            Email Us Now → support@codenfacts.in
          </motion.a>

          <p className="mt-12 text-xs text-zinc-500 font-mono tracking-widest">
            LAST UPDATED • 24 FEBRUARY 2026 • CodeNFacts PRIVATE LIMITED
          </p>
        </motion.div>
      </div>
    </div>
  );
}