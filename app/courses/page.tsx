/*courses/page.tsx*/
"use client";

import { auth } from '@/lib/firebase';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useScroll, useInView } from 'framer-motion';
import {
  Code2, Database, Globe, Cpu, Briefcase,
  Coffee, Layout, Terminal, Star, CheckCircle2,
  ArrowUpRight, Sparkles, Rocket, Users, Trophy,
  ShieldCheck, Zap, Timer, Flame, ChevronRight,
  Lock, CreditCard, Loader2, BarChart3, BrainCircuit,
  HelpCircle, Quote, MoveRight, ChevronDown, Play,
  BookOpen, FolderGit2, Award, Clock, Target, X, Plus, Minus
} from 'lucide-react';
import { load } from '@cashfreepayments/cashfree-js';

// ─── LIVE PARTICLE CANVAS ──────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
}

// ─── LIVE COUNTER ─────────────────────────────────────────────────────────────
function LiveCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── SHARED PAYMENT HANDLER ────────────────────────────────────────────────────
// Cashfree will redirect to: /verify-payment?order_id=<orderId>
// Make sure your Cashfree dashboard return URL is set to:
//   https://yourdomain.com/verify-payment
// OR pass it in the order creation payload as `return_url`.
async function initiatePayment(
  course: { id: string; price: number },
  setLoading: (v: boolean) => void
) {
  try {
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Build the return URL so Cashfree redirects here after payment
    const returnUrl = `${window.location.origin}/verify-payment`;

    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        courseId: course.id,
        slug: course.id,
        amount: course.price,
        userId: user.uid,
        fullName: user.displayName || "Student",
        email: user.email || "student@example.com",
        phone: user.phoneNumber || "9999999999",
        // Tell your backend to set this as the Cashfree return_url
        returnUrl,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message || "Failed to create order");
      return;
    }

    if (data.payment_session_id) {
      const cashfree = await load({ mode: "production" });

      // Use "_self" so Cashfree does a full-page redirect back to returnUrl
      // Cashfree appends ?order_id=<id>&order_token=<token> automatically
      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });
      // ↑ After payment, user lands on /verify-payment?order_id=...
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
}

// ─── COURSE DATA WITH SYLLABI ─────────────────────────────────────────────────
const courses = [
  {
    id: "Complete-HTML-CSS",
    title: "Learn Complete HTML/CSS",
    subtitle: "From Zero to Pixel-Perfect",
    icon: <Layout className="w-5 h-5" />,
    color: "#e34c26",
    gradientFrom: "#e34c26",
    gradientTo: "#f06529",
    price: 399,
    originalPrice: 2499,
    description: "The foundation of the web. Master Flexbox, Grid, and Responsive Design to build stunning, pixel-perfect websites from the ground up.",
    students: 3200,
    rating: 4.9,
    hours: 48,
    tag: "Beginner Friendly",
    tagColor: "emerald",
    modules: [
      {
        title: "HTML Essentials", level: "Beginner",
        topics: [
          "1.1 How Browsers Work & HTML Document Structure",
"1.2 Semantic Tags - header, nav, main, section, article, footer",
"1.3 Text Elements - Headings, Paragraphs, Lists, Blockquotes",
"1.4 Links, Images, Video & Audio Embedding",
"1.5 Forms - Input Types, Labels, Validation Attributes",
"1.6 Tables - thead, tbody, colspan, rowspan",
"1.7 Meta Tags & SEO Basics",
"1.8 Accessibility - ARIA Roles & Alt Text Best Practices",
        ]
      },
      {
        title: "CSS Core", level: "Intermediate",
        topics: [
          "2.1 Selectors - Universal, Class, ID, Attribute, Pseudo",
"2.2 Box Model - margin, border, padding, content",
"2.3 Display - block, inline, inline-block, none",
"2.4 Positioning - static, relative, absolute, fixed, sticky",
"2.5 Typography - Google Fonts, line-height, letter-spacing",
"2.6 Colors - HEX, RGB, HSL & CSS Variables",
"2.7 Backgrounds - Images, Gradients, Blend Modes",
"2.8 Transitions & Animations (keyframes)",
        ]
      },
      {
        title: "Flexbox & Grid", level: "Intermediate",
        topics: [
          "3.1 Flexbox - Container & Item Properties Mastery",
"3.2 CSS Grid - Template Areas, fr Units & auto-fill",
"3.3 Responsive Design - Mobile-First Approach",
"3.4 Media Queries & Breakpoint Strategy",
"3.5 Fluid Typography & Clamp()",
        ]
      },
      {
        title: "Advanced CSS", level: "Advanced",
        topics: [
           "4.1 CSS Custom Properties (Variables) & Theming",
"4.2 Pseudo-classes & Pseudo-elements Deep Dive",
"4.3 CSS Filters, Transforms & 3D Effects",
"4.4 CSS Architecture - BEM Methodology",
"4.5 Dark Mode Implementation",
"4.6 Performance - Critical CSS, Will-Change, Repaints",
        ]
      },
    ],
    projects: [
      { type: "minor", title: "Clone: Apple Product Page", tech: "HTML, CSS Grid, Scroll Effects" },
      { type: "minor", title: "Interactive Pricing Table", tech: "CSS Variables, Custom Properties" },
      { type: "minor", title: "CSS-Only Carousel", tech: "Scroll Snap, No JS" },
      { type: "major", title: "Full Agency Landing Page", tech: "Tailwind, Animations, Responsive" },
      { type: "major", title: "E-Commerce Storefront UI", tech: "Grid Masonry, Filters, Cart UI" },
    ]
  },
  {
    id: "AI-Machine-learning",
    title: "AI / Machine Learning",
    subtitle: "Train Machines That Think",
    icon: <BrainCircuit className="w-5 h-5" />,
    color: "#a855f7",
    gradientFrom: "#7c3aed",
    gradientTo: "#a855f7",
    price: 1399,
    originalPrice: 4999,
    description: "Dive deep into Neural Networks, Deep Learning, and NLP. Lead the AI revolution by building models that actually solve real-world problems.",
    students: 1800,
    rating: 4.9,
    hours: 120,
    tag: "Future Tech",
    tagColor: "purple",
    modules: [
      {
        title: "Foundations of Artificial Intelligence", level: "Beginner",
        topics: [
         "1.1 AI vs ML vs Deep Learning - The Big Picture",
"1.2 History of Artificial Intelligence",
"1.3 Real-World Applications of AI",
"1.4 Types of AI - Narrow AI vs General AI",
"1.5 Understanding Data in AI Systems",
"1.6 AI Tools & Ecosystem Overview"
        ]
      },
      {
        title: "Python for Machine Learning", level: "Intermediate",
        topics: [
         "2.1 Python Environment Setup - Jupyter, Anaconda, Colab",
"2.2 Python Refresher for ML - Variables, Loops, Functions",
"2.3 NumPy - Arrays, Vectorization & Mathematical Operations",
"2.4 Pandas - DataFrames, Data Cleaning & Manipulation",
"2.5 Matplotlib & Seaborn - Data Visualization",
"2.6 Working with Datasets in Python"
        ]
      },
      {
        title: "Mathematics for Machine Learning", level: "Intermediate",
        topics: [
        "3.1 Linear Algebra Basics - Vectors & Matrices",
"3.2 Matrix Operations & Transformations",
"3.3 Probability Fundamentals for ML",
"3.4 Statistical Concepts - Mean, Variance, Distribution",
"3.5 Calculus Basics - Derivatives & Gradients",
"3.6 Gradient Descent Explained"
        ]
      },
      {
        title: "Data Preprocessing & Feature Engineering", level: "Advanced",
        topics: [
   "4.1 Understanding Real World Data",
"4.2 Handling Missing Data",
"4.3 Data Cleaning Techniques",
"4.4 Encoding Categorical Variables",
"4.5 Feature Scaling - Normalization & Standardization",
"4.6 Feature Selection Techniques",
"4.7 Splitting Data - Train, Validation & Test Sets"
        ]
      },
      {
        title: "Introduction to Machine Learning", level: "Advanced",
        topics: [
         "5.1 What is Machine Learning",
"5.2 Types of ML - Supervised, Unsupervised, Reinforcement",
"5.3 ML Workflow - Problem Framing to Deployment",
"5.4 Bias-Variance Tradeoff",
"5.5 Overfitting vs Underfitting",
"5.6 Model Training & Prediction"
        ]
      },
            {
        title: "Supervised Learning - Regression", level: "Advanced",
        topics: [
           "6.1 Introduction to Regression Models",
"6.2 Linear Regression - Concepts & Implementation",
"6.3 Multiple Linear Regression",
"6.4 Polynomial Regression",
"6.5 Regularization - Ridge & Lasso Regression",
"6.6 Evaluating Regression Models"
        ]
      },
        {
        title: "Supervised Learning - Classification", level: "Advanced",
        topics: [
           "7.1 Introduction to Classification",
"7.2 Logistic Regression",
"7.3 K-Nearest Neighbors (KNN)",
"7.4 Support Vector Machines (SVM)",
"7.5 Decision Trees",
"7.6 Random Forest Algorithm",
"7.7 Naive Bayes Classifier"
        ]
      },
        {
        title: "Model Evaluation & Optimization", level: "Advanced",
        topics: [
           "8.1 Confusion Matrix Explained",
"8.2 Accuracy, Precision, Recall & F1 Score",
"8.3 ROC Curve & AUC",
"8.4 Cross Validation Techniques",
"8.5 Hyperparameter Tuning",
"8.6 Grid Search & Random Search"
        ]
      },
        {
        title: "Unsupervised Learning", level: "Advanced",
        topics: [
           "9.1 Introduction to Unsupervised Learning",
"9.2 Clustering Concepts",
"9.3 K-Means Clustering",
"9.4 Hierarchical Clustering",
"9.5 DBSCAN Algorithm",
"9.6 Dimensionality Reduction",
"9.7 Principal Component Analysis (PCA)"
        ]
      },
        {
        title: "Introduction to Deep Learning", level: "Advanced",
        topics: [
           "10.1 Neural Networks Fundamentals",
"10.2 Artificial Neural Networks (ANN)",
"10.3 Activation Functions",
"10.4 Loss Functions",
"10.5 Backpropagation Algorithm",
"10.6 Introduction to TensorFlow & Keras"
        ]
      },
        {
        title: "Computer Vision", level: "Advanced",
        topics: [
          "11.1 Introduction to Computer Vision",
"11.2 Image Processing Basics",
"11.3 Convolutional Neural Networks (CNN)",
"11.4 Image Classification Models",
"11.5 Object Detection Concepts",
"11.6 Real World Computer Vision Applications"
        ]
      },
        {
        title: "Natural Language Processing (NLP)", level: "Advanced",
        topics: [
          "12.1 Introduction to NLP",
"12.2 Text Preprocessing Techniques",
"12.3 Tokenization & Stopwords",
"12.4 Stemming & Lemmatization",
"12.5 TF-IDF Vectorization",
"12.6 Word Embeddings",
"12.7 Sentiment Analysis Models"
        ]
      },
        {
        title: "Reinforcement Learning", level: "Advanced",
        topics: [
           "13.1 Introduction to Reinforcement Learning",
"13.2 Agents, Environment & Rewards",
"13.3 Markov Decision Process",
"13.4 Q-Learning Algorithm",
"13.5 Deep Reinforcement Learning",
"13.6 Real World RL Applications"
        ]
      },
        {
        title: "Model Deployment & MLOps", level: "Advanced",
        topics: [
           "14.1 Saving & Loading ML Models",
"14.2 Building ML APIs using Flask / FastAPI",
"14.3 Deploying ML Models on Cloud",
"14.4 Docker Basics for ML",
"14.5 Model Monitoring & Maintenance",
"14.6 CI/CD for Machine Learning"
        ]
      },
        {
        title: "Advanced AI Topics", level: "Advanced",
        topics: [
          "15.1 Introduction to Generative AI",
"15.2 Transformers Architecture",
"15.3 Large Language Models (LLMs)",
"15.4 Prompt Engineering",
"15.5 Explainable AI (XAI)",
"15.6 AI Ethics & Responsible AI"
        ]
      }
    ],
    projects: [
      { type: "minor", title: "Spam Email Classifier", tech: "Naive Bayes, TF-IDF" },
      { type: "minor", title: "Stock Price Predictor", tech: "LSTM, Time Series" },
      { type: "minor", title: "Image Style Transfer", tech: "CNN, PyTorch" },
      { type: "major", title: "AI-Powered Resume Screener", tech: "BERT Fine-tune, REST API, Docker" },
      { type: "major", title: "Real-time Object Detection App", tech: "YOLO, OpenCV, FastAPI, React" },
    ]
  },
  {
    id: "Data-Science",
    title: "Data Science",
    subtitle: "Turn Raw Data Into Gold",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "#6366f1",
    gradientFrom: "#4f46e5",
    gradientTo: "#6366f1",
    price: 999,
    originalPrice: 3999,
    description: "Master statistical analysis, SQL, and data storytelling. Make high-stakes decisions with data-backed confidence.",
    students: 1400,
    rating: 4.8,
    hours: 96,
    tag: "High Salary",
    tagColor: "indigo",
    modules: [
      {
        title: "Data Science Ecosystem", level: "Beginner",
        topics: [
          "1.1 Data Science Roles - Analyst vs Scientist vs Engineer",
"1.2 The Data Science Workflow (CRISP-DM)",
"1.3 Tools Overview - Python, SQL, Tableau, Power BI",
"1.4 Setting Up Your Data Science Environment",
        ]
      },
      {
        title: "SQL for Data Science", level: "Intermediate",
        topics: [
          "2.1 SQL Basics - SELECT, WHERE, ORDER BY, LIMIT",
"2.2 Joins - INNER, LEFT, RIGHT, FULL, SELF",
"2.3 Aggregations - GROUP BY, HAVING, Window Functions",
"2.4 Subqueries & CTEs (Common Table Expressions)",
"2.5 SQL for EDA - Finding Outliers, Distributions",
"2.6 Connecting SQL to Python (SQLAlchemy, psycopg2)",
        ]
      },
      {
        title: "Exploratory Data Analysis", level: "Intermediate",
        topics: [
           "3.1 Data Collection - APIs, Web Scraping, Public Datasets",
"3.2 Data Cleaning Pipeline (Real-World Messy Data)",
"3.3 Univariate & Bivariate Analysis",
"3.4 Feature Engineering & Selection",
"3.5 Outlier Detection & Treatment",
"3.6 Handling Imbalanced Datasets (SMOTE, Undersampling)",
        ]
      },
      {
        title: "Predictive Modeling", level: "Advanced",
        topics: [
         "4.1 Regression Models - Linear, Polynomial, Ridge, Lasso",
"4.2 Classification Models & Threshold Tuning",
"4.3 Ensemble Methods - Gradient Boosting, Stacking",
"4.4 Time-Series Forecasting - ARIMA, SARIMA, Prophet",
"4.5 A/B Testing & Causal Inference",
        ]
      },
      {
        title: "Visualization & Reporting", level: "Advanced",
        topics: [
          "5.1 Tableau - Dashboards, Calculated Fields, LOD Expressions",
"5.2 Power BI - DAX, Reports & Service Publishing",
"5.3 Storytelling with Data - Presentation Frameworks",
"5.4 Building Automated Reports with Python",
        ]
      },
      {
        title: "Big Data & Cloud", level: "Advanced",
        topics: [
          "6.1 Big Data Concepts - Hadoop, Spark Basics",
"6.2 PySpark - DataFrames & ML Pipeline",
"6.3 Cloud Platforms - AWS S3, GCP BigQuery, Azure",
"6.4 Building a Data Science Portfolio - 5 Project Ideas",
        ]
      }
    ],
    projects: [
      { type: "minor", title: "COVID-19 Data Analysis", tech: "Pandas, Seaborn, Plotly" },
      { type: "minor", title: "SQL Sales Analytics Dashboard", tech: "PostgreSQL, CTEs, Tableau" },
      { type: "minor", title: "A/B Test Analysis Engine", tech: "SciPy, Statistics, Python" },
      { type: "major", title: "End-to-End Customer Churn Predictor", tech: "Sklearn, SQL, Plotly, FastAPI" },
      { type: "major", title: "Real-time Twitter Sentiment Dashboard", tech: "Spark Streaming, Kafka, React" },
    ]
  },
  {
    id: "Python-DS",
    title: "Python for Data Science",
    subtitle: "From Scripts to ML Pipelines",
    icon: <Database className="w-5 h-5" />,
    color: "#3776ab",
    gradientFrom: "#1e40af",
    gradientTo: "#3776ab",
    price: 297,
    originalPrice: 4999,
    description: "Unlock the power of data using Python. From automation scripts to complex predictive modeling using industry-standard libraries.",
    students: 1200,
    rating: 4.9,
    hours: 72,
    tag: "Best Seller",
    tagColor: "yellow",
    modules: [
      {
        title: "Python Foundations", level: "Beginner",
        topics: [
          "1.1 Python Setup & Environment (Anaconda, Jupyter, VS Code)",
"1.2 Variables, Data Types & Type Casting",
"1.3 Operators & Expressions",
"1.4 Control Flow - if/elif/else, match-case",
"1.5 Loops - for, while, break, continue, pass",
"1.6 Functions, *args/**kwargs & Lambda",
"1.7 List, Tuple, Set & Dictionary Mastery",
"1.8 File I/O & Exception Handling",
        ]
      },
      {
        title: "NumPy & Pandas", level: "Intermediate",
        topics: [
          "2.1 NumPy Arrays, Indexing & Slicing",
"2.2 Broadcasting, Vectorized Ops & Linear Algebra",
"2.3 Pandas Series & DataFrame Creation",
"2.4 Data Cleaning - Missing Values, Duplicates, Outliers",
"2.5 Merging, Joining, GroupBy & Pivot Tables",
"2.6 Time-Series Analysis with DatetimeIndex",
"2.7 Reading CSV, Excel, JSON & SQL into DataFrames",
        ]
      },
      {
        title: "Data Visualization", level: "Intermediate",
        topics: [
          "3.1 Matplotlib - Line, Bar, Scatter, Histogram, Pie",
"3.2 Seaborn - Heatmaps, Pair Plots, Distribution Plots",
"3.3 Plotly - Interactive Dashboards",
"3.4 Storytelling with Data & Chart Best Practices",
        ]
      },
      {
        title: "Statistics & Probability", level: "Advanced",
        topics: [
          "4.1 Descriptive Statistics - Mean, Median, Mode, Std Dev",
"4.2 Probability Theory & Distributions (Normal, Binomial, Poisson)",
"4.3 Hypothesis Testing - t-test, chi-square, ANOVA",
"4.4 Correlation vs Causation",
"4.5 Central Limit Theorem & Confidence Intervals",
        ]
      },
      {
        title: "Machine Learning Basics", level: "Advanced",
        topics: [
          "5.1 Scikit-Learn Pipeline & Data Preprocessing",
"5.2 Linear & Logistic Regression",
"5.3 Decision Trees & Random Forests",
"5.4 K-Means Clustering & PCA",
"5.5 Model Evaluation - Accuracy, Precision, Recall, F1, ROC",
"5.6 Cross-Validation & Hyperparameter Tuning (GridSearchCV)",
        ]
      },
    ],
    projects: [
      { type: "minor", title: "Price Tracker Bot"},
      { type: "minor", title: "Automated Report Generator"},
      { type: "minor", title: "Netflix Recommendation Engine"},
      { type: "major", title: "Automated Stock Analysis Dashboard"},
      { type: "major", title: "EDA on Real-World Dataset (Kaggle)"},
    ]
  },
  {
    id: "OOP-With-Java",
    title: "OOP with Java",
    subtitle: "Enterprise-Grade Engineering",
    icon: <Coffee className="w-5 h-5" />,
    color: "#f89820",
    gradientFrom: "#d97706",
    gradientTo: "#f89820",
    price: 385,
    originalPrice: 3999,
    description: "Master the language that powers 90% of Fortune 500 enterprise software. Build robust, scalable systems with deep OOP expertise.",
    students: 850,
    rating: 4.8,
    hours: 84,
    tag: "Enterprise",
    tagColor: "orange",
    modules: [
      {
        title: "Java Basics", level: "Beginner",
        topics: [
                    "1.1 JDK Installation, JVM & JRE Architecture",
"1.2 Data Types, Variables & Type Conversion",
"1.3 Operators, Control Flow & Loops",
"1.4 Arrays - 1D, 2D & Jagged Arrays",
"1.5 Methods, Recursion & Method Overloading",
"1.6 String & StringBuilder Manipulation",
        ]
      },
      {
        title: "Core OOP Concepts", level: "Intermediate",
        topics: [
                    "2.1 Classes, Objects & Constructors",
"2.2 Encapsulation - Access Modifiers & Getters/Setters",
"2.3 Inheritance - Single, Multilevel & Hierarchical",
"2.4 Polymorphism - Method Overriding & Runtime Dispatch",
"2.5 Abstraction - Abstract Classes vs Interfaces",
"2.6 Static vs Instance Members & 'this' / 'super' Keywords",
"2.7 final, instanceof & Object Class Methods",
        ]
      },
      {
        title: "Advanced Java", level: "Intermediate",
        topics: [
                    "3.1 Exception Handling - try/catch/finally, Custom Exceptions",
"3.2 Collections Framework - List, Set, Map, Queue",
"3.3 Generics & Type Bounds",
"3.4 Iterators & Enhanced for Loop",
"3.5 Java 8 Features - Lambdas, Stream API, Optional",
"3.6 File I/O - BufferedReader, FileWriter, NIO",
"3.7 Multithreading & Concurrency Basics",
        ]
      },
      {
        title: "Design Patterns", level: "Advanced",
        topics: [
                    "4.1 SOLID Principles",
"4.2 Singleton, Factory & Builder Patterns",
"4.3 Observer & Strategy Patterns",
"4.4 MVC Pattern with Java",
        ]
      },
      {
        title: "Projects", level: "Advanced",
        topics: [
          "5.1 Bank Management System",
"5.2 Library Management System",
"5.3 Student Result Portal",
        ]
      }
    ],
    projects: [
      { type: "minor", title: "Library Management System", tech: "Java OOP, File I/O, Collections" },
      { type: "minor", title: "Multi-threaded Chat Server", tech: "Java Sockets, Threads" },
      { type: "minor", title: "Custom HashMap Implementation", tech: "Data Structures, Generics" },
      { type: "major", title: "E-Commerce Backend Engine", tech: "Spring Boot, Hibernate, MySQL, REST" },
      { type: "major", title: "Real-time Stock Trading Simulator", tech: "Java Concurrency, WebSockets, H2" },
    ]
  },
  {
    id: "Web-Dev",
    title: "Web Development",
    subtitle: "Full-Stack Mastery End-to-End",
    icon: <Globe className="w-5 h-5" />,
    color: "#eab308",
    gradientFrom: "#ca8a04",
    gradientTo: "#eab308",
    price: 820,
    originalPrice: 4499,
    description: "Build and deploy modern web applications like Amazon. Full-stack mastery from database schema to production cloud deployment.",
    students: 4000,
    rating: 4.9,
    hours: 140,
    tag: "Job Ready",
    tagColor: "green",
    modules: [
      {
        title: "Web Fundamentals", level: "Beginner",
        topics: [
         "1.1 How the Web Works - HTTP/HTTPS, DNS, Browsers",
"1.2 HTML5 Structure & Semantic Markup",
"1.3 CSS3 Foundations - Box Model, Flexbox, Grid",
"1.4 Responsive Design & Mobile-First Workflow",
"1.5 Git & GitHub - Version Control for Devs",
        ]
      },
      {
        title: "JavaScript Mastery", level: "Intermediate",
        topics: [
          "2.1 JS Basics - Types, Variables (var/let/const), Scope",
"2.2 Functions - Regular, Arrow, IIFE, Closures",
"2.3 DOM Manipulation & Events",
"2.4 Promises, Async/Await & Fetch API",
"2.5 ES6+ -- Destructuring, Spread, Modules, Optional Chaining",
"2.6 Local Storage, Session Storage & Cookies",
"2.7 Error Handling & Debugging in DevTools",
        ]
      },
      {
        title: "React.js", level: "Intermediate",
        topics: [
          "3.1 React Fundamentals - JSX, Components & Props",
"3.2 State Management - useState, useReducer",
"3.3 useEffect, useMemo & Custom Hooks",
"3.4 React Router v6 - Dynamic Routing & Params",
"3.5 Context API vs Redux Toolkit",
"3.6 React Query & Data Fetching Patterns",
"3.7 Tailwind CSS Integration with React",
        ]
      },
      {
        title: "Node.js & Express Backend", level: "Advanced",
        topics: [
         "4.1 Node.js Architecture - Event Loop & Modules",
"4.2 Express - Routing, Middleware & Error Handling",
"4.3 REST API Design - CRUD with Proper Status Codes",
"4.4 Authentication - JWT, bcrypt & Refresh Tokens",
"4.5 MongoDB with Mongoose - Schema & CRUD",
"4.6 SQL with PostgreSQL & Sequelize ORM",
"4.7 File Upload - Multer & Cloudinary Integration",
        ]
      },
      {
        title: "DevOps & Deployment", level: "Advanced",
        topics: [
          "5.1 Environment Variables & Secrets Management",
"5.2 Docker - Containerizing a MERN App",
"5.3 CI/CD with GitHub Actions",
"5.4 Deploying to Vercel, Render & Railway",
"5.5 Domain, SSL & Production Checklist",
        ]
      },
      {
        title: "Capstone Projects", level: "Advanced",
        topics: [
          "SaaS Dashboard with Authentication + Multiple Minor & Major Projects"
        ]
      }
    ],
    projects: [
      { type: "minor", title: "Real-time Chat App", tech: "Socket.io, Express, React" },
      { type: "minor", title: "Blog Platform with CMS", tech: "MongoDB, Express, Rich Text Editor" },
      { type: "minor", title: "Job Board with Filters", tech: "React, REST API, Pagination" },
      { type: "major", title: "Full E-Commerce Platform", tech: "MERN, Payment Gateway, Admin Dashboard" },
      { type: "major", title: "SaaS Project Management Tool", tech: "MERN, Docker, AWS, WebSockets" },
    ]
  },
  {
    id: "DSA",
    title: "DSA for Interviews",
    subtitle: "FAANG-Level Problem Solving",
    icon: <Code2 className="w-5 h-5" />,
    color: "#10b981",
    gradientFrom: "#059669",
    gradientTo: "#10b981",
    price: 699,
    originalPrice: 3499,
    description: "The gold standard for tech interviews. Solve complex problems with mathematically optimized logic that impresses top engineers.",
    students: 2500,
    rating: 4.9,
    hours: 110,
    tag: "FAANG Prep",
    tagColor: "emerald",
    modules: [
      {
        title: "Complexity & Problem Solving", level: "Beginner",
        topics: [
          "1.1 Big-O, Big-Ω, Big-Θ Notation",
"1.2 Time vs Space Complexity Analysis",
"1.3 Problem-Solving Framework - UMPIRE Method",
"1.4 Choosing the Right Language for Interviews",
        ]
      },
      {
        title: "Arrays & Strings", level: "Intermediate",
        topics: [
          "2.1 Two-Pointer Technique",
"2.2 Sliding Window (Fixed & Variable)",
"2.3 Prefix Sum & Difference Array",
"2.4 Sorting Algorithms & Their Interview Use-Cases",
"2.5 Hashing - HashMap & HashSet Patterns",
"2.6 Anagram, Palindrome & Substring Problems",
        ]
      },
      {
        title: "Linked Lists & Stacks/Queues", level: "Intermediate",
        topics: [
         "3.1 Singly & Doubly Linked List Operations",
"3.2 Fast & Slow Pointer (Floyd's Cycle)",
"3.3 Reversing & Merging Linked Lists",
"3.4 Stack - Monotonic Stack Patterns",
"3.5 Queue, Deque & Priority Queue (Heap)",
        ]
      },
      {
        title: "Trees & Graphs", level: "Advanced",
        topics: [
         "4.1 Binary Trees - Traversals (BFS, DFS, Pre/In/Post)",
"4.2 Binary Search Tree - Insert, Delete, Search",
"4.3 AVL Trees & Red-Black Trees (Concept)",
"4.4 Heaps - Min/Max Heap & Heap Sort",
"4.5 Tries - Insert, Search & Word Problems",
"4.6 Graph Representations - Adjacency Matrix/List",
"4.7 BFS & DFS on Graphs - Islands, Components",
"4.8 Dijkstra, Bellman-Ford & Floyd-Warshall",
"4.9 Topological Sort & Union-Find (DSU)",
        ]
      },
      {
        title: "Dynamic Programming", level: "Advanced",
        topics: [
           "5.1 Memoization vs Tabulation",
"5.2 1D DP - Fibonacci, Climbing Stairs, House Robber",
"5.3 2D DP - Grid Paths, Edit Distance",
"5.4 Knapsack Variants - 0/1, Unbounded, Fractional",
"5.5 Longest Common Subsequence & Substring",
"5.6 Interval DP & Partition Problems",
        ]
      },
      {
        title: "Interview Strategy", level: "Advanced",
        topics: [
         "6.1 Mock Interviews - FAANG Style Problems",
"6.2 Behavioral Questions - STAR Method",
"6.3 System Design Primer (for SDE-2+)",
"6.4 LeetCode Patterns - Top 75 Problem Walkthrough",
        ]
      }
    ],
    projects: [
      { type: "minor", title: "LeetCode 150 Tracker App", tech: "React, localStorage, Charts" },
      { type: "minor", title: "Visual Sorting Algorithm Playground", tech: "React, Canvas, Animations" },
      { type: "minor", title: "Graph Pathfinding Visualizer", tech: "BFS/DFS, Dijkstra, React" },
      { type: "major", title: "Mock Interview Platform", tech: "CodeMirror, Timer, AI Hints, MERN" },
      { type: "major", title: "Competitive Programming Tracker", tech: "Codeforces API, Rating Analytics, React" },
    ]
  },
  {
    id: "LinkedIn-Setup",
    title: "Complete LinkedIn Setup",
    subtitle: "Your Brand = Your Salary",
    icon: <Briefcase className="w-5 h-5" />,
    color: "#0077b5",
    gradientFrom: "#0369a1",
    gradientTo: "#0077b5",
    price: 289,
    originalPrice: 1999,
    description: "Your digital resume is your brand. Learn to attract high-ticket recruiters and automate networking at scale.",
    students: 2100,
    rating: 5.0,
    hours: 24,
    tag: "Career",
    tagColor: "blue",
    modules: [
      {
        title: "Profile Foundations", level: "Beginner",
        topics: [
          "1.1 Choosing the Right Profile Photo & Banner",
"1.2 Writing a Magnetic Headline (Formula & Examples)",
"1.3 Crafting an About Section That Converts",
"1.4 Featured Section - Pinning Posts, Links & Media",
"1.5 Experience Section - STAR Format Bullet Points",
"1.6 Education, Licenses & Certifications",
"1.7 Skills Section - Top 5 Strategy & Endorsements",
        ]
      },
      {
        title: "LinkedIn SEO & Visibility", level: "Intermediate",
        topics: [
          "2.1 How LinkedIn Algorithm Works in 2026",
"2.2 Keyword Research for Your Niche",
"2.3 Optimizing Every Section with Keywords",
"2.4 Open to Work vs Open to Opportunities Settings",
"2.5 LinkedIn SSI Score - What It Means & How to Raise It",
        ]
      },
      {
        title: "Content Strategy", level: "Intermediate",
        topics: [
          "3.1 Content Pillars & Posting Consistency",
"3.2 Post Formats - Text, Carousels, Video & Polls",
"3.3 Hook Writing - 5 Proven Opening Formulas",
"3.4 Using Storytelling to Drive Engagement",
"3.5 Scheduling Tools - Buffer, Taplio, LinkedIn Native",
"3.6 Hashtag Strategy & Optimal Post Timing",
        ]
      },
      {
        title: "Networking & Outreach", level: "Advanced",
        topics: [
           "4.1 Connection Request Templates That Get Accepted",
"4.2 Cold Messaging Strategy for Jobs & Clients",
"4.3 Building a Referral Network",
"4.4 Engaging with Target Profiles & Companies",
"4.5 LinkedIn Groups & Events Strategy",
        ]
      },
      {
        title: "Job Search & Personal Branding", level: "Advanced",
        topics: [
          "5.1 Applying via LinkedIn Easy Apply - Best Practices",
"5.2 LinkedIn Premium - Is It Worth It?",
"5.3 Getting Recommendations That Matter",
"5.4 Personal Branding Roadmap - 90 Day Plan",
"5.5 Tracking Metrics & Profile Analytics",
        ]
      }
    ],
    projects: [
      { type: "minor", title: "Complete Profile Audit & Rebuild", tech: "Real LinkedIn Optimization" },
      { type: "minor", title: "30-Day Content Calendar", tech: "Notion Template, Canva Graphics" },
      { type: "minor", title: "10 Recruiter Outreach Messages", tech: "Personalized Cold DM Templates" },
      { type: "major", title: "Personal Brand Rollout Campaign", tech: "3 Viral Posts, Newsletter Issue, Connection Sprint" },
      { type: "major", title: "Job Offer in 30 Days Challenge", tech: "Tracked Outreach, Applications, Interview Prep" },
    ]
  },
  {
    id: "Mastering-C-Language",
    title: "Mastering C Language",
    subtitle: "The Mother of All Languages",
    icon: <Terminal className="w-5 h-5" />,
    color: "#64748b",
    gradientFrom: "#334155",
    gradientTo: "#64748b",
    price: 199,
    originalPrice: 2999,
    description: "Understand what happens under the hood of every program and OS. C is not a course-it's a superpower that makes every other language click.",
    students: 1500,
    rating: 4.7,
    hours: 60,
    tag: "Foundational",
    tagColor: "slate",
    modules: [
      {
        title: "C Fundamentals", level: "Beginner",
        topics: [
          "1.1 History of C, GCC Setup & First Program",
"1.2 Data Types, Variables, Constants & Literals",
"1.3 Operators - Arithmetic, Relational, Logical, Bitwise",
"1.4 Control Flow - if/else, switch, Ternary",
"1.5 Loops - for, while, do-while, goto",
"1.6 Functions - Prototypes, Call by Value, Recursion",
        ]
      },
      {
        title: "Pointers & Memory", level: "Intermediate",
        topics: [
                    "2.1 Pointer Basics - Declaration, Dereferencing & Address Arithmetic",
"2.2 Pointers & Arrays - Array Decay & Pointer Indexing",
"2.3 Pointer to Pointer (Double Pointers)",
"2.4 Function Pointers & Callbacks",
"2.5 Dynamic Memory - malloc, calloc, realloc, free",
"2.6 Memory Leaks & Dangling Pointers (Valgrind)",
        ]
      },
      {
        title: "Arrays & Strings", level: "Intermediate",
        topics: [
          "3.1 Character Arrays vs String Literals",
"3.2 String Functions - strlen, strcpy, strcat, strcmp",
"3.3 2D Arrays & Multi-dimensional Arrays",
"3.4 Array of Strings (Pointer Arrays)",
        ]
      },
      {
        title: "Structures & File I/O", level: "Advanced",
        topics: [
          "4.1 struct, union & Bit Fields",
"4.2 Nested Structures & Structures with Pointers",
"4.3 typedef & Enumerations",
"4.4 File Handling - fopen, fread, fwrite, fseek",
"4.5 Binary vs Text Files & Error Handling (errno)",
        ]
      },
      {
        title: "Advanced C", level: "Advanced",
        topics: [
          "5.1 Preprocessor Directives - #define, #include, #ifdef",
"5.2 Macros vs Inline Functions",
"5.3 Command-Line Arguments (argc/argv)",
"5.4 Linked Lists - Singly, Doubly & Circular",
"5.5 Stacks & Queues Implementation in C",
"5.6 Sorting Algorithms - Bubble, Merge, Quick in C",
        ]
      }
    ],
    projects: [
      { type: "minor", title: "Custom String Library", tech: "C Pointers, String Functions" },
      { type: "minor", title: "Student Grade Manager", tech: "Structs, File I/O, Sorting" },
      { type: "minor", title: "Calculator with Operator Precedence", tech: "Stack, Recursion" },
      { type: "major", title: "Memory-Efficient Key-Value Store", tech: "Hash Table, Dynamic Memory, File Persistence" },
      { type: "major", title: "Mini Unix Shell", tech: "Fork, Exec, Pipes, Process Management" },
    ]
  }
];

// ─── COURSE MODAL ─────────────────────────────────────────────────────────────
function CourseModal({ course, onClose }: { course: typeof courses[0]; onClose: () => void }) {
  const [activeModule, setActiveModule] = useState(0);
  const [loading, setLoading] = useState(false);

  const handlePayment = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    initiatePayment(course, setLoading);
  };

  const levelColor: Record<string, string> = {
    "Beginner": "text-emerald-400 bg-emerald-400/10",
    "Intermediate": "text-yellow-400 bg-yellow-400/10",
    "Advanced": "text-red-400 bg-red-400/10",
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-5xl max-h-[92vh] rounded-[2rem] overflow-hidden flex flex-col"
        style={{ background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Modal Header */}
        <div className="relative p-8 pb-6 flex-shrink-0" style={{ background: `linear-gradient(135deg, ${course.gradientFrom}22, ${course.gradientTo}11)`, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10">
            <X className="w-4 h-4 text-white/70" />
          </button>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})` }}>
              {course.icon}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{course.title}</h2>
              <p className="text-white/50 text-sm mb-3">{course.subtitle}</p>
              <div className="flex flex-wrap gap-4 text-xs text-white/60">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.hours} hours</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.students.toLocaleString()}+ students</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {course.rating}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.modules.length} modules</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Modules Sidebar */}
              <div className="lg:col-span-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Curriculum</h3>
                <div className="space-y-2">
                  {course.modules.map((mod, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveModule(i)}
                      className={`w-full text-left p-4 rounded-xl transition-all border ${activeModule === i ? 'border-white/20 bg-white/8' : 'border-transparent bg-white/3 hover:bg-white/5'}`}
                      style={activeModule === i ? { borderColor: `${course.color}40`, background: `${course.color}10` } : {}}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white">{i + 1}. {mod.title}</span>
                        <ChevronRight className="w-3 h-3 text-white/30" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelColor[mod.level]}`}>{mod.level}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics & Projects */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">
                    Module {activeModule + 1}: {course.modules[activeModule].title}
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {course.modules[activeModule].topics.map((topic, i) => (
                      <motion.div
                        key={topic}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: course.color }} />
                        <span className="text-sm text-white/80">{topic}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                    <FolderGit2 className="w-3 h-3" /> Projects
                  </h3>
                  <div className="space-y-3">
                    {course.projects.map((proj, i) => (
                      <div key={i} className="p-4 rounded-xl border bg-white/3" style={{ borderColor: proj.type === 'major' ? `${course.color}40` : 'rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${proj.type === 'major' ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'}`}
                            style={proj.type === 'major' ? { backgroundColor: `${course.color}20`, color: course.color } : {}}>
                            {proj.type === 'major' ? '★ Major' : '● Minor'}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white">{proj.title}</div>
                        <div className="text-xs text-white/40 mt-0.5">{proj.tech}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex-shrink-0 p-6 border-t border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-white">₹{course.price}</span>
            <span className="text-lg text-white/30 line-through mb-1">₹{course.originalPrice}</span>
            <span className="text-sm font-bold text-emerald-400 mb-1">{Math.round((1 - course.price / course.originalPrice) * 100)}% OFF</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── COURSE CARD ──────────────────────────────────────────────────────────────
function CourseCard({ course, index, onExpand }: { course: typeof courses[0]; index: number; onExpand: () => void }) {
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const handlePayment = (e: React.MouseEvent) => {
    e.stopPropagation();
    initiatePayment(course, setLoading);
  };

  const discount = Math.round((1 - course.price / course.originalPrice) * 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onExpand}
      className="group relative cursor-pointer"
    >
      <div
        className="absolute inset-0 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
        style={{ background: `radial-gradient(ellipse at center, ${course.color}30, transparent 70%)` }}
      />

      <div
        className="relative h-full rounded-[1.75rem] overflow-hidden transition-transform duration-300 group-hover:-translate-y-2"
        style={{ background: 'linear-gradient(135deg, #111827 0%, #0d1117 100%)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${course.gradientFrom}, ${course.gradientTo})` }} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})` }}>
              {course.icon}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{course.tag}</span>
            </div>
          </div>

          <h3 className="text-xl font-black text-white mb-1 leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>{course.title}</h3>
          <p className="text-xs text-white/40 mb-4">{course.subtitle}</p>

          <div className="flex items-center gap-4 text-xs text-white/40 mb-5">
            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {course.rating}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.students.toLocaleString()}+</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.hours}h</span>
          </div>

          <p className="text-sm text-white/50 mb-5 leading-relaxed line-clamp-2">{course.description}</p>

          <div className="mb-5 p-3 rounded-xl bg-white/3 border border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-2">{course.modules.length} Modules · {course.projects.length} Projects</p>
            <div className="flex flex-wrap gap-1">
              {course.modules.slice(0, 3).map((m) => (
                <span key={m.title} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 font-medium">{m.title}</span>
              ))}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30">+{course.modules.length - 3} more</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-white">₹{course.price}</span>
                <span className="text-xs text-white/30 line-through mb-0.5">₹{course.originalPrice}</span>
              </div>
              <span className="text-[10px] font-black text-emerald-400">{discount}% OFF</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onExpand(); }}
                className="px-3 py-2.5 rounded-xl text-xs font-bold text-white/60 bg-white/5 hover:bg-white/10 transition-colors border border-white/8 flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3" /> Syllabus
              </button>
              <button
                disabled={loading}
                onClick={handlePayment}
                className="px-4 py-2.5 rounded-xl text-xs font-black text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-1"
                style={{ background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})` }}
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Enroll"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["3.2K+ Students Enrolled", "₹15L+ Average Package", "100% Job Guarantee", "24/7 TA Support", "Lifetime Access", "Certificate Included", "Live Projects Included", "Industry Mentors"];
  return (
    <div className="overflow-hidden py-3 border-y border-white/5 my-0 relative">
      <div className="flex animate-[ticker_25s_linear_infinite] whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 mr-12 text-xs font-bold text-white/30 uppercase tracking-widest flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono-custom { font-family: 'Space Mono', monospace; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      <div className="min-h-screen bg-[#0d1117] text-white overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
        <ParticleField />

        <div
          className="fixed pointer-events-none z-50 w-96 h-96 rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #6366f1, transparent 70%)',
            left: mousePos.x - 192,
            top: mousePos.y - 192,
            transition: 'left 0.1s ease, top 0.1s ease',
          }}
        />

        <div className="relative z-50 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white py-2.5 text-center">
          <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3 h-3 text-yellow-300" />
            <span>Limited Seats - Up to 94% OFF • Flash Sale Active Now</span>
            <Zap className="w-3 h-3 text-yellow-300" />
          </div>
        </div>

        <Ticker />

        {/* Hero */}
        <section ref={heroRef} className="relative z-10 pt-24 pb-32 px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            15,000+ engineers already enrolled
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.9] mb-8"
          >
            BUILD.
            <br />
            <span className="relative">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%)' }}>THINK.</span>
            </span>
            <br />
            SHIP.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto text-white/50 text-lg md:text-xl leading-relaxed mb-12"
          >
            The gap between tutorial hell and a high-paying engineering career is
            <span className="text-white font-semibold"> structured knowledge</span>.
            Stop watching. Start building.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap justify-center gap-12 mb-16"
          >
            {[
              { label: "Students", value: 15000, suffix: "+" },
              { label: "Courses", value: 9, suffix: "" },
              { label: "Avg Salary Hike", value: 340, suffix: "%" },
              { label: "Rating", value: 47, suffix: "/50" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-black text-white mb-1 font-display">
                  <LiveCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-white/30 uppercase tracking-widest font-bold">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Courses Grid */}
        <section className="relative z-10 px-6 md:px-12 pb-32 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-2">All Courses</h2>
              <p className="text-white/30 text-sm">Click any course to view full syllabus & projects</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-white/30 font-mono-custom">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE ENROLLMENT OPEN
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course}
                index={i}
                onExpand={() => setSelectedCourse(course)}
              />
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section className="relative z-10 py-32 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-display text-5xl font-black text-white mb-4">Your Path to Mastery</h2>
            <p className="text-white/40 max-w-xl mx-auto">A structured 4-phase journey from zero to indispensable engineer</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)' }} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { step: "01", title: "Foundations", icon: <Terminal className="w-5 h-5" />, color: "#64748b", desc: "HTML, CSS, C Language - understand what computers actually do." },
                { step: "02", title: "Logic & OOP", icon: <Code2 className="w-5 h-5" />, color: "#10b981", desc: "DSA, Java, Python - write code that solves real problems efficiently." },
                { step: "03", title: "Specialize", icon: <BrainCircuit className="w-5 h-5" />, color: "#a855f7", desc: "AI/ML, Data Science, MERN - become the expert companies compete for." },
                { step: "04", title: "Launch Career", icon: <Rocket className="w-5 h-5" />, color: "#0077b5", desc: "LinkedIn, DSA prep, portfolio - land offers from companies you dream of." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="relative p-6 rounded-2xl border border-white/5 bg-white/3 text-center group hover:border-white/10 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg" style={{ background: `linear-gradient(135deg, ${item.color}44, ${item.color}22)`, border: `1px solid ${item.color}33` }}>
                    <span style={{ color: item.color }}>{item.icon}</span>
                  </div>
                  <div className="font-mono-custom text-[10px] font-bold text-white/20 mb-2">PHASE {item.step}</div>
                  <h4 className="font-display font-black text-white text-lg mb-2">{item.title}</h4>
                  <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section className="relative z-10 py-32 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-[3rem] overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #111827, #1a1f2e)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-30" style={{ background: 'radial-gradient(ellipse at right, #4f46e5 0%, transparent 70%)' }} />
              <div className="relative p-12 md:p-20">
                <div className="max-w-2xl">
                  <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                    The Junior Dev<br />role is <span className="text-indigo-400">dying.</span>
                  </h2>
                  <p className="text-white/60 text-lg mb-10 leading-relaxed">
                    Companies want Product Engineers who handle data, AI, and architecture. Knowing only syntax makes you replaceable. Understanding the <em>facts</em> behind the code makes you indispensable.
                  </p>
                  <div className="grid grid-cols-3 gap-6 mb-10">
                    {[
                      { icon: <Zap className="w-5 h-5 text-yellow-400" />, label: "Industry Projects" },
                      { icon: <Users className="w-5 h-5 text-blue-400" />, label: "Private Discord" },
                      { icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, label: "Career Support" },
                      { icon: <Award className="w-5 h-5 text-purple-400" />, label: "Verified Certificate" },
                      { icon: <Clock className="w-5 h-5 text-red-400" />, label: "426 Days Access" },
                      { icon: <Target className="w-5 h-5 text-orange-400" />, label: "Placement Help" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/80 text-sm font-medium">
                        {item.icon} {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative z-10 py-20 px-8 max-w-3xl mx-auto">
          <h2 className="font-display text-4xl font-black text-white mb-12 text-center">FAQ</h2>
          <div className="space-y-3">
            {[
              { q: "Is there a certificate on completion?", a: "Yes - every course includes a verifiable completion certificate from CodeNFacts that you can add directly to LinkedIn." },
              { q: "Will I have lifetime access?", a: " Pay once, access for 426 days - including all future updates, new projects, and content additions." },
              { q: "What if I get stuck on a concept?", a: "Our TA team is available 24/7 via our private Discord. We also do live doubt sessions every week." },
              { q: "Are the projects real-world?", a: "Yes. Every major project is production-grade and deployable. Many students use them directly in their portfolio for interviews." },
              { q: "Can I get a refund?", a: "Please Check in Refund Policy Link, under the NETWORK section." },
            ].map((faq, i) => {
              const [open, setOpen] = useState(false);
              return (
                <div key={i} className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <button className="w-full p-5 flex items-center justify-between text-left" onClick={() => setOpen(!open)}>
                    <span className="text-sm font-bold text-white">{faq.q}</span>
                    <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
                      <Plus className="w-4 h-4 text-white/40 flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-white/50 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 px-8 pb-32">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden text-center p-16 md:p-28"
              style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #1e1b4b 100%)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 60%)' }} />
              <div className="relative">
                <div className="font-mono-custom text-xs text-indigo-400/60 uppercase tracking-[0.3em] mb-8">Invest in your most important asset</div>
                <h2 className="font-display text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9]">
                  Don't Look Back<br />
                  <span className="text-indigo-400">Wishing</span> You<br />
                  Started Today.
                </h2>
                <p className="text-white/50 text-lg max-w-xl mx-auto mb-12">
                  Join 15,000+ students on the path to engineering excellence. Your future self will thank you.
                </p>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-3 px-12 py-6 rounded-full font-black text-lg text-white transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                >
                  Browse All Courses <MoveRight className="w-5 h-5" />
                </button>
                <div className="mt-8 flex items-center justify-center gap-8 text-white/20 text-xs font-bold uppercase tracking-widest">
                  <span>Keep Coding, Keep Creating..❤️</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 px-8 py-12 text-center">
          <div className="font-display text-2xl font-black text-white mb-3 tracking-tight">
            Code<span className="text-indigo-400">N</span>Facts
          </div>
          <p className="text-white/20 text-xs uppercase tracking-[0.4em] font-bold">Built for the Builders of Tomorrow</p>
        </footer>

        <AnimatePresence>
          {selectedCourse && (
            <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}