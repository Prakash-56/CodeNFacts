"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Code,
  Database,
  BarChart,
  Cpu,
  Rocket,
  Target,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

export default function AIRoadmap() {
  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white min-h-screen">

      {/* ================= HERO SECTION ================= */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 via-blue-800/20 to-pink-800/20 blur-3xl"></div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
        >
          Complete AI/ML Career Roadmap <br />
          <span className="text-purple-400">From Beginner to Industry Ready</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-gray-400 max-w-3xl mx-auto text-lg"
        >
          Artificial Intelligence and Machine Learning are transforming industries.
          This roadmap will guide you step-by-step to become an AI/ML Engineer,
          Data Scientist, or AI Researcher.
        </motion.p>
      </section>

      {/* ================= WHAT IS AI ================= */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Brain className="text-purple-400" /> What is Artificial Intelligence?
          </h2>

          <p className="text-gray-300 leading-8 mb-6">
            Artificial Intelligence (AI) is the ability of machines to mimic human intelligence.
            It includes learning from data, recognizing patterns, making decisions,
            and improving automatically.
          </p>

          <p className="text-gray-400 leading-8">
            Machine Learning (ML) is a subset of AI where systems learn from data
            without being explicitly programmed. Deep Learning is a further subset
            inspired by the human brain using neural networks.
          </p>
        </motion.div>
      </section>

      {/* ================= WHY AI CAREER ================= */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            className="text-3xl font-bold mb-8 flex items-center gap-3"
          >
            <TrendingUp className="text-green-400" />
            Why Choose AI/ML as a Career?
          </motion.h2>

          <ul className="space-y-6 text-gray-300">
            <li>✔ High demand across industries</li>
            <li>✔ Top paying technology roles</li>
            <li>✔ Future-proof career</li>
            <li>✔ Opportunity to build intelligent products</li>
            <li>✔ Work on real-world impactful problems</li>
          </ul>
        </div>
      </section>

      {/* ================= ROADMAP STEPS ================= */}
      <section className="py-24 px-6 max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold mb-16 text-center">
          Step-by-Step AI/ML Learning Journey
        </h2>

        {/* Step 1 */}
        <RoadmapCard
          icon={<Code className="text-blue-400" />}
          title="Step 1: Programming Foundations"
          content="Start with Python. Learn variables, loops, functions, OOP, data structures. Practice daily coding."
        />

        {/* Step 2 */}
        <RoadmapCard
          icon={<BarChart className="text-purple-400" />}
          title="Step 2: Mathematics for AI"
          content="Master Linear Algebra, Probability, Statistics, Calculus. Understand matrices, vectors, distributions, gradients."
        />

        {/* Step 3 */}
        <RoadmapCard
          icon={<Database className="text-green-400" />}
          title="Step 3: Data Handling"
          content="Learn NumPy, Pandas, Data Cleaning, Visualization using Matplotlib & Seaborn."
        />

        {/* Step 4 */}
        <RoadmapCard
          icon={<Cpu className="text-pink-400" />}
          title="Step 4: Machine Learning"
          content="Supervised & Unsupervised Learning, Regression, Classification, Clustering, Model Evaluation, Scikit-learn."
        />

        {/* Step 5 */}
        <RoadmapCard
          icon={<Layers className="text-yellow-400" />}
          title="Step 5: Deep Learning"
          content="Neural Networks, CNN, RNN, LSTM, Transformers. Use TensorFlow & PyTorch."
        />

        {/* Step 6 */}
        <RoadmapCard
          icon={<Rocket className="text-red-400" />}
          title="Step 6: Specializations"
          content="Choose NLP, Computer Vision, Generative AI, Reinforcement Learning, or MLOps."
        />
      </section>

      {/* ================= JOB ROLES ================= */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-4xl font-bold mb-12 text-center">
            AI/ML Career Roles
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <RoleCard
              title="AI Engineer"
              description="Build intelligent systems using ML models. Deploy AI into production systems."
            />

            <RoleCard
              title="Data Scientist"
              description="Analyze data, build predictive models, communicate insights."
            />

            <RoleCard
              title="ML Engineer"
              description="Optimize models, build scalable ML pipelines, manage deployment."
            />

          </div>
        </div>
      </section>

      {/* ================= PROJECTS SECTION ================= */}
      <section className="py-24 px-6 max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold mb-12 text-center">
          Build Real Projects
        </h2>

        <ul className="space-y-6 text-gray-300 text-lg">
          <li>✔ House Price Prediction</li>
          <li>✔ Spam Email Classifier</li>
          <li>✔ Chatbot using NLP</li>
          <li>✔ Face Detection System</li>
          <li>✔ Recommendation System</li>
          <li>✔ Generative AI App</li>
        </ul>
      </section>

      {/* ================= INTERVIEW PREP ================= */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-10 text-center">
            Interview Preparation
          </h2>

          <p className="text-gray-300 leading-8 text-lg">
            Practice ML algorithms, statistics questions, system design,
            SQL queries, coding problems, and explain your projects clearly.
            Build a strong GitHub profile and LinkedIn presence.
          </p>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 text-center px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your AI Journey?
          </h2>
          <p className="text-gray-400 mb-8">
            Join CodeNFacts and become industry-ready with structured guidance.
          </p>

          <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 transition rounded-xl text-lg font-semibold shadow-lg">
            Start Learning Now
          </button>
        </motion.div>
      </section>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function RoadmapCard({ icon, title, content }: any) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      variants={fadeUp}
      className="bg-gray-900 border border-gray-800 p-8 rounded-2xl mb-10 hover:shadow-purple-600/20 hover:shadow-xl transition"
    >
      <div className="flex items-center gap-4 mb-4">
        {icon}
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      <p className="text-gray-400 leading-7">{content}</p>
    </motion.div>
  );
}

function RoleCard({ title, description }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
    >
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}