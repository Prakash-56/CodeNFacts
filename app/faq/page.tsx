"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Minus, Rocket, Search, MessageCircle, 
  BookOpen, ShieldCheck, Zap, HelpCircle, 
  Globe, CreditCard, Users, Star, ArrowRight
} from "lucide-react";

// 1. EXTENDED DATA DEFINITION
interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Academic" | "Technical" | "Career" | "Financial";
}

const faqData: FAQItem[] = [
  {
    category: "General",
    question: "How long do I have access to the course materials?",
    answer: "Once enrolled, you have lifetime access to the specific version of the course you purchased. This includes all future updates to that version and access to the student community forums.",
  },
  {
    category: "Academic",
    question: "Can I get a certificate of completion?",
    answer: "Yes! After finishing all modules and passing the final capstone project with a score of 70% or higher, a verified digital certificate will be generated in your profile.",
  },
  {
    category: "Technical",
    question: "What happens if I encounter a bug in the practice labs?",
    answer: "Our technical team monitors the labs 24/7. You can report a bug directly via the 'Help' button within the lab interface, and we usually provide a fix or workaround within 4 hours.",
  },
  {
    category: "Career",
    question: "Are there internship opportunities available?",
    answer: "We partner with top-tier tech companies to offer exclusive internship tracks for our top-performing students. Applications open quarterly.",
  },
  {
    category: "Financial",
    question: "Do you offer a refund policy?",
    answer: "We offer a 14-day 'No Questions Asked' refund policy. If you feel the course isn't the right fit for your learning style, simply email support for a full reversal.",
  },
  {
    category: "Academic",
    question: "Can I skip modules if I already know the basics?",
    answer: "While we recommend following the path, you can take 'Placement Tests' at the start of each module. If you score above 90%, the module is marked as complete.",
  },
  {
    category: "Technical",
    question: "Is there a mobile app for offline learning?",
    answer: "Yes! Our app is available on both iOS and Android. You can download lessons while on Wi-Fi and watch them anywhere without using data.",
  },
  {
    category: "Career",
    question: "Do you provide resume building and LinkedIn optimization?",
    answer: "Every student gets access to our AI-powered Resume Builder and a 1-on-1 session with a career coach to optimize their professional online presence.",
  },
  {
    category: "General",
    question: "Is the community forum moderated?",
    answer: "Yes, we have a dedicated team of teaching assistants and moderators who ensure the environment remains professional, helpful, and free of spam 24/7.",
  },
  {
    category: "Financial",
    question: "Are there any student discounts or scholarships?",
    answer: "We offer a 'Future Leaders' scholarship for students from underrepresented backgrounds and a 20% discount for currently enrolled university students.",
  },
];

// 2. SUB-COMPONENT: FAQ CARD
const FAQCard = ({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) => {
  return (
    <motion.div 
      layout
      className={`group mb-4 overflow-hidden rounded-2xl border transition-all duration-500 ${
        isOpen 
          ? "border-blue-500/50 bg-white/10 shadow-[0_0_20px_rgba(59,130,246,0.2)] backdrop-blur-md" 
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${
            isOpen ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40" : "bg-white/5 text-slate-400 group-hover:text-blue-400"
          }`}>
            {item.category === "General" && <BookOpen size={20} />}
            {item.category === "Academic" && <ShieldCheck size={20} />}
            {item.category === "Technical" && <Zap size={20} />}
            {item.category === "Career" && <Rocket size={20} />}
            {item.category === "Financial" && <CreditCard size={20} />}
          </div>
          <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? "text-white" : "text-slate-300"}`}>
            {item.question}
          </span>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.1 : 1 }}
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
            isOpen ? "border-blue-400 text-blue-400" : "border-slate-600 text-slate-500"
          }`}
        >
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="border-t border-white/5 px-6 pb-8 pt-4">
              <p className="text-slate-400 leading-relaxed text-lg">
                {item.answer}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  {item.category}
                </span>
                <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
                  Was this helpful? <Star size={14} className="hover:fill-yellow-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 3. MAIN COMPONENT
export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "General", "Academic", "Technical", "Career", "Financial"];
  
  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory = filter === "All" || item.category === filter;
      const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 selection:bg-blue-500/30">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[30%] w-[30%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-24">
        
        {/* Header Section */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400"
          >
            <HelpCircle size={14} /> Support Center
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 text-5xl md:text-7xl font-black tracking-tight text-white"
          >
            Got <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Questions?</span>
          </motion.h1>
          
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={22} />
            <input 
              type="text"
              placeholder="Search for answers..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-5 pl-14 pr-6 text-lg text-white outline-none ring-blue-500/50 transition-all focus:bg-white/10 focus:ring-2"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setOpenIndex(null); }}
              className={`rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300 ${
                filter === cat 
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <motion.div layout className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <FAQCard
                  key={faq.question}
                  item={faq}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))
            ) : (
              <div className="py-20 text-center text-slate-500">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-xl">No results for "{searchQuery}"</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- EXTRA THINGS: STATS SECTION --- */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { label: "Active Students", value: "50k+", icon: <Users /> },
                { label: "Success Rate", value: "94%", icon: <Star /> },
                { label: "Global Reach", value: "120+", icon: <Globe /> }
            ].map((stat, i) => (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center"
                >
                    <div className="text-blue-500 mb-4 flex justify-center">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-slate-500 text-sm uppercase tracking-widest">{stat.label}</div>
                </motion.div>
            ))}
        </div>

        {/* --- EXTRA THINGS: MOTIVATION & MENTORSHIP --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-32 overflow-hidden rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-800 p-1 px-1"
        >
          <div className="rounded-[2.9rem] bg-[#0a0a0c] px-8 py-20 text-center relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="mb-6 text-4xl md:text-5xl font-bold text-white">
                Still searching for your <span className="text-blue-500">Spark?</span>
              </h2>
              <p className="mb-10 text-xl leading-relaxed text-slate-400">
                "Don't let what you cannot do interfere with what you can do." 
                The road to mastery is paved with questions. Every time you seek an answer, you're one step closer to becoming the expert someone else looks up to.
              </p>
              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                <button className="group flex items-center gap-3 w-full rounded-2xl bg-blue-600 px-10 py-5 font-bold text-white transition-all hover:bg-blue-500 hover:scale-105 sm:w-auto">
                  Start Your Journey <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </button>
                <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-10 py-5 font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 sm:w-auto">
                  Contact Mentor
                </button>
              </div>
              
              <p className="mt-12 text-sm text-slate-600 italic">
                Join 5,000+ students asking questions right now in our Discord.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <footer className="mt-20 text-center text-slate-600 text-sm">
          Keep Coding , Keep Creating ..
        </footer>
      </div>
    </div>
  );
}