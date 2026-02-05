"use client";

import { use } from "react";
import { courses } from "@/data/courses";
import { notFound } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  Globe, 
  ShieldCheck, 
  Trophy, 
  ArrowRight, 
  BookOpen, 
  Star, 
  Sparkles 
} from "lucide-react";

// In Next.js 15, params is a Promise. We define the type accordingly.
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CourseDetail({ params }: PageProps) {
  // Unwrap the params promise using React's 'use' hook
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  // Find the course based on the unwrapped slug
  const course = courses.find((c) => c.slug === slug);

  // If course doesn't exist, trigger the 404 page
  if (!course) {
    return notFound();
  }

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans pb-20">
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[60]" 
        style={{ scaleX }} 
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-40 md:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-600/20 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto relative z-10 text-center lg:text-left"
        >
          <motion.div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs md:text-sm font-medium mb-8">
            <Sparkles className="w-3 h-3" />
            {course.mode} • Next Batch: {course.startDate}
          </motion.div>
          
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent leading-[1.1]">
            {course.title}
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed mx-auto lg:mx-0">
            {course.description}
          </p>

          {/* Tech Stack Tags */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            {course.techStack.map((tech) => (
              <span key={tech} className="px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Side: Content */}
        <div className="lg:col-span-8 space-y-24 md:space-y-32">
          
          {/* Highlights Grid */}
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Star className="text-blue-500 w-5 h-5" /> Course Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.highlights.map((highlight, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                  <CheckCircle2 className="text-blue-500 w-5 h-5 mt-0.5 shrink-0" />
                  <span className="text-zinc-300 text-sm md:text-base">{highlight}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Detailed Syllabus */}
          <section>
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Curriculum</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
            </div>
            
            <div className="space-y-6">
              {course.syllabus.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative p-6 md:p-8 rounded-3xl bg-zinc-900/20 border border-zinc-800/50 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="hidden md:flex h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 items-center justify-center text-blue-500 font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                       <span className="text-blue-500 font-mono text-xs uppercase tracking-widest mb-1 block">{item.module}</span>
                       <h3 className="text-xl md:text-2xl font-semibold text-zinc-100 mb-4">{item.title}</h3>
                       <div className="flex flex-wrap gap-2">
                        {item.topics.map((topic, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-400 text-xs border border-zinc-700/50">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section className="relative">
            <div className="absolute -inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
            <h2 className="text-3xl font-bold mb-12 mt-12 flex items-center gap-3">
              <BookOpen className="text-blue-500" /> Hands-on Projects
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {course.projects.map((proj, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-900/60 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-100">{proj}</h3>
                  </div>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                    Work on real-world industry scenarios and build a professional-grade implementation of {proj.toLowerCase()} to showcase in your portfolio.
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Certificate Preview */}
          <section className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 text-center">
             <Trophy className="w-12 h-12 text-blue-500 mx-auto mb-6" />
             <h2 className="text-2xl md:text-3xl font-bold mb-4">Earn Your Certification</h2>
             <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
               Receive a verified {course.certificate} upon successful completion of the course and final assessment.
             </p>
             <div className="aspect-[16/10] max-w-md mx-auto bg-zinc-800/50 rounded-xl border-4 border-zinc-900 shadow-2xl flex items-center justify-center text-zinc-600 italic">
               Certificate Preview Image
             </div>
          </section>

          {/* FAQ Accordion */}
          <section>
            <h2 className="text-3xl font-bold mb-10">Frequently Asked Questions</h2>
            <div className="divide-y divide-zinc-800">
              {course.faqs.map((faq, i) => (
                <details key={i} className="group py-6 cursor-pointer">
                  <summary className="text-lg font-medium list-none flex justify-between items-center group-open:text-blue-400 transition-all">
                    {faq.question}
                    <span className="text-zinc-600 group-open:rotate-180 transition-transform">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-zinc-400 leading-relaxed max-w-3xl">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Sticky Sidebar */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-32 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 md:p-10 rounded-[2.5rem] bg-[#0A0A0A] border border-zinc-800 shadow-3xl relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[60px] rounded-full" />
              
              <div className="mb-10">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-bold tracking-tight">{course.price}</span>
                  <span className="text-zinc-600 line-through text-lg">₹8,999</span>
                </div>
                <p className="text-blue-500 text-xs font-bold uppercase tracking-widest">Limited Time Offer</p>
              </div>

              <div className="space-y-5 mb-10">
                {[
                  { icon: Clock, label: "Duration", val: course.duration },
                  { icon: Globe, label: "Mode", val: course.mode.split(' ')[0] },
                  { icon: ShieldCheck, label: "Access", val: "Lifetime" },
                  { icon: CheckCircle2, label: "Mentorship", val: "1:1 Included" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-zinc-400">
                      <item.icon className="w-4 h-4 text-zinc-500" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-zinc-100 font-medium">{item.val}</span>
                  </div>
                ))}
              </div>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={course.enrollLink}
                className="flex items-center justify-center gap-2 w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-blue-600/20 group"
              >
                Secure Your Seat
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              
              <p className="text-center text-[10px] text-zinc-600 mt-6 uppercase tracking-[0.2em]">
                🔒 Secure checkout via Razorpay
              </p>
            </motion.div>
            
            <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 text-center">
               <p className="text-sm text-zinc-400 mb-1">Questions?</p>
               <a href="mailto:support@codenfacts.com" className="text-blue-500 font-bold hover:underline">support@codenfacts.com</a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}