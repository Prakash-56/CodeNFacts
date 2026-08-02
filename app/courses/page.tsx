// app/courses/page.tsx
"use client";

import { BookOpen, Clock, Code2, Brain, Linkedin, Terminal, Layout, Cpu, Binary, Database, Globe } from "lucide-react";

const courses = [
  {
    title: "Python for Data Science",
    description: "Master Python fundamentals, pandas, NumPy, and data visualization for real-world analysis.",
    icon: <Code2 className="w-6 h-6" />,
    level: "Beginner → Intermediate",
    status: "Coming Soon",
  },
  {
    title: "OOP with Java",
    description: "Deep dive into Object-Oriented Programming concepts, design patterns, and clean Java code.",
    icon: <Terminal className="w-6 h-6" />,
    level: "Intermediate",
    status: "Coming Soon",
  },
  {
    title: "Complete LinkedIn Setup",
    description: "Optimize your LinkedIn profile, build a personal brand, and grow your professional network.",
    icon: <Linkedin className="w-6 h-6" />,
    level: "All Levels",
    status: "Coming Soon",
  },
  {
    title: "Mastering C Language",
    description: "From basics to advanced memory management, pointers, and system-level programming in C.",
    icon: <Binary className="w-6 h-6" />,
    level: "Beginner → Advanced",
    status: "Coming Soon",
  },
  {
    title: "Learn Complete HTML/CSS",
    description: "Build beautiful, responsive websites from scratch with modern HTML5 and CSS3 techniques.",
    icon: <Layout className="w-6 h-6" />,
    level: "Beginner",
    status: "Coming Soon",
  },
  {
    title: "AI / Machine Learning",
    description: "Explore supervised & unsupervised learning, neural networks, and practical ML projects.",
    icon: <Brain className="w-6 h-6" />,
    level: "Intermediate → Advanced",
    status: "Coming Soon",
  },
  {
    title: "DSA for Interviews",
    description: "Crack coding interviews with structured Data Structures & Algorithms practice and patterns.",
    icon: <Cpu className="w-6 h-6" />,
    level: "Intermediate",
    status: "Coming Soon",
  },
  {
    title: "Data Science",
    description: "End-to-end data science workflow: data cleaning, EDA, modeling, and storytelling with data.",
    icon: <Database className="w-6 h-6" />,
    level: "Intermediate",
    status: "Coming Soon",
  },
  {
    title: "Web Development",
    description: "Full-stack web development covering frontend, backend, databases, and deployment.",
    icon: <Globe className="w-6 h-6" />,
    level: "Beginner → Advanced",
    status: "Coming Soon",
  },
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            Work in Progress
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Our Courses
          </h1>
          
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We are currently crafting a detailed and structured course experience for you.  
            Expect high-quality content, practical projects, and clear learning paths - launching within a few days.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {courses.map((course) => (
            <div
              key={course.title}
              className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 group-hover:scale-105 transition-transform">
                  {course.icon}
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  {course.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                {course.title}
              </h3>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                {course.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                <BookOpen className="w-3.5 h-3.5" />
                {course.level}
              </div>
            </div>
          ))}
        </div>

        {/* Important Things to Keep in Mind */}
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-sm">
              !
            </span>
            Important Things to Keep in Mind
          </h2>

          <ul className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <li className="flex gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>
                <strong className="text-zinc-900 dark:text-white">Detailed curriculum is under active development.</strong>  
                Each course will include structured modules, projects, quizzes, and real-world applications.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>
                <strong className="text-zinc-900 dark:text-white">Launch timeline:</strong>  
                We expect the first set of complete course structures to go live within the next few days. Stay tuned!
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>
                <strong className="text-zinc-900 dark:text-white">Free updates forever.</strong>  
                Once a course is published, all future improvements and new modules will be available to enrolled learners at no extra cost.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>
                <strong className="text-zinc-900 dark:text-white">Practice-first approach.</strong>  
                Theory is important, but every course prioritizes hands-on coding and projects you can add to your portfolio.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>
                <strong className="text-zinc-900 dark:text-white">Feedback is welcome.</strong>  
                Have a specific topic or skill you want covered? Reach out - we’re building this for you.
              </span>
            </li>
          </ul>
        </section>

        {/* Footer note */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-500 mt-12">
          Coming Soon !! Happy Learning...
        </p>
      </div>
    </main>
  );
}