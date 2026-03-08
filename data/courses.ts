// data/courses.ts

export interface SyllabusItem {
  module: string;
  title: string;
  topics: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProjectItem {
  type: "major" | "minor";
  title: string;
  tech: string;
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  startDate: string;
  duration: string;
  mode: string;
  price: string;
  access: string;
  techStack: string[];
  highlights: string[];
  syllabus: SyllabusItem[];
  projects: ProjectItem[];
  certificate: string;
  faqs: FAQItem[];

  // Visual / display fields used in course detail page
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  hours?: number;
  students?: number;
  rating?: number;
}

export const courses: Course[] = [
  // ─────────────────────────────────────────────
  // 1. PYTHON FOR DATA SCIENCE
  // ─────────────────────────────────────────────
  {
    slug: "Python-DS",
    title: "Python for Data Science",
    description:
      "Master Python for data analysis, visualization & ML foundations. Beginner-friendly with 15+ real datasets.",
    startDate: "May 1, 2026",
    duration: "8 Weeks",
    mode: "Hybrid (Live + Recorded)",
    price: "₹297",
    access: "426 Days Access + 1:1 Mentorship",
    color: "#f59e0b",
    gradientFrom: "#f59e0b",
    gradientTo: "#ef4444",
    hours: 40,
    students: 980,
    rating: 4.8,
    techStack: [
      "Python 3.11",
      "Pandas 2.2",
      "NumPy 2.0",
      "Matplotlib 3.9",
      "Seaborn 0.13",
      "Scikit-Learn 1.5",
    ],
    highlights: [
      "Zero coding required",
      "15+ real datasets",
      "Weekly live coding",
      "5+ portfolio projects",
    ],
    syllabus: [
      {
        module: "Module 01",
        title: "Python Foundations",
        topics: [
          "1.1 Python Setup & Environment (Anaconda, Jupyter, VS Code)",
          "1.2 Variables, Data Types & Type Casting",
          "1.3 Operators & Expressions",
          "1.4 Control Flow - if/elif/else, match-case",
          "1.5 Loops - for, while, break, continue, pass",
          "1.6 Functions, *args/**kwargs & Lambda",
          "1.7 List, Tuple, Set & Dictionary Mastery",
          "1.8 File I/O & Exception Handling",
        ],
      },
      {
        module: "Module 02",
        title: "NumPy & Pandas",
        topics: [
          "2.1 NumPy Arrays, Indexing & Slicing",
          "2.2 Broadcasting, Vectorized Ops & Linear Algebra",
          "2.3 Pandas Series & DataFrame Creation",
          "2.4 Data Cleaning - Missing Values, Duplicates, Outliers",
          "2.5 Merging, Joining, GroupBy & Pivot Tables",
          "2.6 Time-Series Analysis with DatetimeIndex",
          "2.7 Reading CSV, Excel, JSON & SQL into DataFrames",
        ],
      },
      {
        module: "Module 03",
        title: "Data Visualization",
        topics: [
          "3.1 Matplotlib - Line, Bar, Scatter, Histogram, Pie",
          "3.2 Seaborn - Heatmaps, Pair Plots, Distribution Plots",
          "3.3 Plotly - Interactive Dashboards",
          "3.4 Storytelling with Data & Chart Best Practices",
        ],
      },
      {
        module: "Module 04",
        title: "Statistics & Probability",
        topics: [
          "4.1 Descriptive Statistics - Mean, Median, Mode, Std Dev",
          "4.2 Probability Theory & Distributions (Normal, Binomial, Poisson)",
          "4.3 Hypothesis Testing - t-test, chi-square, ANOVA",
          "4.4 Correlation vs Causation",
          "4.5 Central Limit Theorem & Confidence Intervals",
        ],
      },
      {
        module: "Module 05",
        title: "Machine Learning Basics",
        topics: [
          "5.1 Scikit-Learn Pipeline & Data Preprocessing",
          "5.2 Linear & Logistic Regression",
          "5.3 Decision Trees & Random Forests",
          "5.4 K-Means Clustering & PCA",
          "5.5 Model Evaluation - Accuracy, Precision, Recall, F1, ROC",
          "5.6 Cross-Validation & Hyperparameter Tuning (GridSearchCV)",
        ],
      },
      {
        module: "Module 06",
        title: "Capstone Projects",
        topics: [
          "6.1 EDA on Real-World Dataset (Kaggle)",
          "6.2 Sales Prediction Dashboard",
          "6.3 Customer Segmentation Project",
          "6.4 Portfolio Deployment on GitHub",
        ],
      },
    ],
    projects: [
      {
        type: "major",
        title: "Stock Analysis Dashboard",
        tech: "Pandas + Plotly + Streamlit",
      },
      {
        type: "major",
        title: "Healthcare Data Pipeline",
        tech: "Data cleaning + EDA + insights",
      },
      {
        type: "minor",
        title: "Sentiment Analysis Tool",
        tech: "Text processing + ML classifier",
      },
    ],
    certificate: "Certified Python Data Analyst",
    faqs: [
      {
        question: "No coding experience?",
        answer: "Perfect! Absolute beginner curriculum with visual explanations.",
      },
      {
        question: "Missed live class?",
        answer: "Recordings uploaded within 2 hours + 24/7 doubt forum.",
      },
      {
        question: "Job ready after course?",
        answer: "Yes! 3 GitHub-ready projects + resume templates provided.",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2. JAVA OOP MASTERY
  // ─────────────────────────────────────────────
  {
    slug: "OOP-With-Java",
    title: "OOP With Java",
    description:
      "Complete Object-Oriented Programming. University syllabus + FAANG interview preparation.",
    startDate: "Coming Soon..",
    duration: "6 Weeks",
    mode: "Live Interactive",
    price: "₹385",
    access: "426 Days Access + Interview Prep",
    color: "#f97316",
    gradientFrom: "#f97316",
    gradientTo: "#eab308",
    hours: 36,
    students: 760,
    rating: 4.9,
    techStack: ["Java 17 LTS", "IntelliJ IDEA", "Maven 3.9", "JUnit 5.10"],
    highlights: [
      "Production coding standards",
      "300+ interview Qs",
      "Live debugging",
      "Design patterns intro",
    ],
    syllabus: [
      {
        module: "Module 01",
        title: "Java Basics",
        topics: [
          "1.1 JDK Installation, JVM & JRE Architecture",
          "1.2 Data Types, Variables & Type Conversion",
          "1.3 Operators, Control Flow & Loops",
          "1.4 Arrays - 1D, 2D & Jagged Arrays",
          "1.5 Methods, Recursion & Method Overloading",
          "1.6 String & StringBuilder Manipulation",
        ],
      },
      {
        module: "Module 02",
        title: "Core OOP Concepts",
        topics: [
          "2.1 Classes, Objects & Constructors",
          "2.2 Encapsulation - Access Modifiers & Getters/Setters",
          "2.3 Inheritance - Single, Multilevel & Hierarchical",
          "2.4 Polymorphism - Method Overriding & Runtime Dispatch",
          "2.5 Abstraction - Abstract Classes vs Interfaces",
          "2.6 Static vs Instance Members & 'this' / 'super' Keywords",
          "2.7 final, instanceof & Object Class Methods",
        ],
      },
      {
        module: "Module 03",
        title: "Advanced Java",
        topics: [
          "3.1 Exception Handling - try/catch/finally, Custom Exceptions",
          "3.2 Collections Framework - List, Set, Map, Queue",
          "3.3 Generics & Type Bounds",
          "3.4 Iterators & Enhanced for Loop",
          "3.5 Java 8 Features - Lambdas, Stream API, Optional",
          "3.6 File I/O - BufferedReader, FileWriter, NIO",
          "3.7 Multithreading & Concurrency Basics",
        ],
      },
      {
        module: "Module 04",
        title: "Design Patterns",
        topics: [
          "4.1 SOLID Principles",
          "4.2 Singleton, Factory & Builder Patterns",
          "4.3 Observer & Strategy Patterns",
          "4.4 MVC Pattern with Java",
        ],
      },
      {
        module: "Module 05",
        title: "Projects",
        topics: [
          "5.1 Bank Management System",
          "5.2 Library Management System",
          "5.3 Student Result Portal",
          "5.4 Mini E-Commerce Backend",
        ],
      },
    ],
    projects: [
      {
        type: "major",
        title: "ATM Banking System",
        tech: "OOP + Collections + File I/O",
      },
      {
        type: "major",
        title: "Library Management System",
        tech: "Interfaces + Generics + Streams",
      },
      {
        type: "minor",
        title: "Student Portal Application",
        tech: "Records + Exception Handling + JUnit tests",
      },
    ],
    certificate: "Java OOP Professional Certification",
    faqs: [
      {
        question: "Java 17 features?",
        answer: "Records, sealed classes, pattern matching - latest LTS features included.",
      },
      {
        question: "University aligned?",
        answer: "100% B.Tech/MCA syllabus + 200 extra interview questions.",
      },
      {
        question: "IDE used?",
        answer: "IntelliJ IDEA Community (industry standard, free forever).",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 3. C PROGRAMMING
  // ─────────────────────────────────────────────
  {
    slug: "Mastering-C-Language",
    title: "Mastering C Language",
    description:
      "Mother language foundation. Pointers, memory & systems programming for interviews.",
    startDate: "April 24, 2026",
    duration: "5 Weeks",
    mode: "Recorded + Live Doubts",
    price: "₹199",
    access: "400 Days Access",
    color: "#06b6d4",
    gradientFrom: "#06b6d4",
    gradientTo: "#3b82f6",
    hours: 28,
    students: 1240,
    rating: 4.7,
    techStack: ["GCC 14", "Code::Blocks 20.03", "VS Code C/C++", "Dev-C++"],
    highlights: [
      "Pointer mastery",
      "Memory leak prevention",
      "Systems thinking",
      "Game dev basics",
    ],
    syllabus: [
      {
        module: "Module 01",
        title: "C Fundamentals",
        topics: [
          "1.1 History of C, GCC Setup & First Program",
          "1.2 Data Types, Variables, Constants & Literals",
          "1.3 Operators - Arithmetic, Relational, Logical, Bitwise",
          "1.4 Control Flow - if/else, switch, Ternary",
          "1.5 Loops - for, while, do-while, goto",
          "1.6 Functions - Prototypes, Call by Value, Recursion",
        ],
      },
      {
        module: "Module 02",
        title: "Pointers & Memory",
        topics: [
          "2.1 Pointer Basics - Declaration, Dereferencing & Address Arithmetic",
          "2.2 Pointers & Arrays - Array Decay & Pointer Indexing",
          "2.3 Pointer to Pointer (Double Pointers)",
          "2.4 Function Pointers & Callbacks",
          "2.5 Dynamic Memory - malloc, calloc, realloc, free",
          "2.6 Memory Leaks & Dangling Pointers (Valgrind)",
        ],
      },
      {
        module: "Module 03",
        title: "Strings & Arrays",
        topics: [
          "3.1 Character Arrays vs String Literals",
          "3.2 String Functions - strlen, strcpy, strcat, strcmp",
          "3.3 2D Arrays & Multi-dimensional Arrays",
          "3.4 Array of Strings (Pointer Arrays)",
        ],
      },
      {
        module: "Module 04",
        title: "Structures & File I/O",
        topics: [
          "4.1 struct, union & Bit Fields",
          "4.2 Nested Structures & Structures with Pointers",
          "4.3 typedef & Enumerations",
          "4.4 File Handling - fopen, fread, fwrite, fseek",
          "4.5 Binary vs Text Files & Error Handling (errno)",
        ],
      },
      {
        module: "Module 05",
        title: "Advanced C",
        topics: [
          "5.1 Preprocessor Directives - #define, #include, #ifdef",
          "5.2 Macros vs Inline Functions",
          "5.3 Command-Line Arguments (argc/argv)",
          "5.4 Linked Lists - Singly, Doubly & Circular",
          "5.5 Stacks & Queues Implementation in C",
          "5.6 Sorting Algorithms - Bubble, Merge, Quick in C",
        ],
      },
    ],
    projects: [
      {
        type: "major",
        title: "Console Snake Game",
        tech: "2D array + keyboard input + game loop",
      },
      {
        type: "major",
        title: "Student Database",
        tech: "Structures + file I/O + CRUD operations",
      },
      {
        type: "minor",
        title: "Scientific Calculator",
        tech: "All operators + math.h functions",
      },
      {
        type: "minor",
        title: "File Encryption Tool",
        tech: "XOR cipher + file read/write",
      },
    ],
    certificate: "C Programming Expert Certification",
    faqs: [
      {
        question: "Why C first?",
        answer: "Builds unbreakable logic foundation - powers Linux, games, embedded systems.",
      },
      {
        question: "Compiler setup?",
        answer: "GCC + Code::Blocks (Windows) / VS Code (all platforms) - step-by-step install guide.",
      },
      {
        question: "Pointers explained?",
        answer: "Visual diagrams → Code → Real memory examples - 3 learning layers.",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 4. HTML5 & CSS3
  // ─────────────────────────────────────────────
  {
    slug: "Complete-HTML-CSS",
    title: "Learn Complete HTML/CSS",
    description:
      "Responsive websites foundation. Prepares for React/Vue/Angular frameworks.",
    startDate: "Coming Soon..",
    duration: "4 Weeks",
    mode: "Live Workshops",
    price: "₹399",
    access: "400 Days Access + Code Reviews",
    color: "#ec4899",
    gradientFrom: "#ec4899",
    gradientTo: "#8b5cf6",
    hours: 24,
    students: 890,
    rating: 4.8,
    techStack: ["HTML5", "CSS3", "TailwindCSS v3", "CSS Grid 2", "Flexbox"],
    highlights: [
      "Mobile-first design",
      "Modern layouts",
      "CSS variables",
      "Accessibility",
    ],
    syllabus: [
      {
        module: "Module 01",
        title: "HTML Essentials",
        topics: [
          "1.1 How Browsers Work & HTML Document Structure",
          "1.2 Semantic Tags - header, nav, main, section, article, footer",
          "1.3 Text Elements - Headings, Paragraphs, Lists, Blockquotes",
          "1.4 Links, Images, Video & Audio Embedding",
          "1.5 Forms - Input Types, Labels, Validation Attributes",
          "1.6 Tables - thead, tbody, colspan, rowspan",
          "1.7 Meta Tags & SEO Basics",
          "1.8 Accessibility - ARIA Roles & Alt Text Best Practices",
        ],
      },
      {
        module: "Module 02",
        title: "CSS Core",
        topics: [
          "2.1 Selectors - Universal, Class, ID, Attribute, Pseudo",
          "2.2 Box Model - margin, border, padding, content",
          "2.3 Display - block, inline, inline-block, none",
          "2.4 Positioning - static, relative, absolute, fixed, sticky",
          "2.5 Typography - Google Fonts, line-height, letter-spacing",
          "2.6 Colors - HEX, RGB, HSL & CSS Variables",
          "2.7 Backgrounds - Images, Gradients, Blend Modes",
          "2.8 Transitions & Animations (keyframes)",
        ],
      },
      {
        module: "Module 03",
        title: "Flexbox & Grid",
        topics: [
          "3.1 Flexbox - Container & Item Properties Mastery",
          "3.2 CSS Grid - Template Areas, fr Units & auto-fill",
          "3.3 Responsive Design - Mobile-First Approach",
          "3.4 Media Queries & Breakpoint Strategy",
          "3.5 Fluid Typography & Clamp()",
        ],
      },
      {
        module: "Module 04",
        title: "Advanced CSS",
        topics: [
          "4.1 CSS Custom Properties (Variables) & Theming",
          "4.2 Pseudo-classes & Pseudo-elements Deep Dive",
          "4.3 CSS Filters, Transforms & 3D Effects",
          "4.4 CSS Architecture - BEM Methodology",
          "4.5 Dark Mode Implementation",
          "4.6 Performance - Critical CSS, Will-Change, Repaints",
        ],
      },
    ],
    projects: [
      {
        type: "major",
        title: "Personal Portfolio Website",
        tech: "Fully responsive, hosted on Netlify",
      },
      {
        type: "major",
        title: "Netflix Landing Clone",
        tech: "Grid layout + animations + responsive",
      },
      {
        type: "minor",
        title: "E-commerce Product Page",
        tech: "Flexbox + Tailwind + CSS variables",
      },
      {
        type: "minor",
        title: "Admin Dashboard UI",
        tech: "CSS Grid + dark mode + container queries",
      },
    ],
    certificate: "Modern Frontend Specialist",
    faqs: [
      {
        question: "Freelance ready?",
        answer: "Yes! 80% client work uses these skills + Figma-to-code conversion.",
      },
      {
        question: "Next after CSS?",
        answer: "JavaScript → React (clear learning path with discounts).",
      },
      {
        question: "Projects deployed?",
        answer: "All 4 projects hosted on Netlify + GitHub repos created.",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 5. DSA FOR FAANG
  // ─────────────────────────────────────────────
  {
    slug: "DSA",
    title: "DSA for Interviews",
    description:
      "300+ problems, optimal solutions. Google/Amazon/Microsoft interview patterns.",
    startDate: "Coming Soon..",
    duration: "10 Weeks",
    mode: "Live Problem Solving",
    price: "₹739",
    access: "426 Days Access + 5 Mock Interviews",
    color: "#10b981",
    gradientFrom: "#10b981",
    gradientTo: "#06b6d4",
    hours: 60,
    students: 1450,
    rating: 4.9,
    techStack: [
      "C++17",
      "Java 17",
      "Python 3.11",
      "LeetCode",
      "NeetCode 150",
    ],
    highlights: [
      "FAANG patterns",
      "Optimal time/space",
      "Weekly contests",
      "Behavioral prep",
    ],
    syllabus: [
      {
        module: "Module 01",
        title: "Complexity Analysis & Problem-Solving",
        topics: [
          "1.1 Big-O, Big-Ω, Big-Θ Notation",
          "1.2 Time vs Space Complexity Analysis",
          "1.3 Problem-Solving Framework - UMPIRE Method",
          "1.4 Choosing the Right Language for Interviews",
        ],
      },
      {
        module: "Module 02",
        title: "Arrays & Strings",
        topics: [
          "2.1 Two-Pointer Technique",
          "2.2 Sliding Window (Fixed & Variable)",
          "2.3 Prefix Sum & Difference Array",
          "2.4 Sorting Algorithms & Their Interview Use-Cases",
          "2.5 Hashing - HashMap & HashSet Patterns",
          "2.6 Anagram, Palindrome & Substring Problems",
        ],
      },
      {
        module: "Module 03",
        title: "Linked Lists & Stacks/Queues",
        topics: [
          "3.1 Singly & Doubly Linked List Operations",
          "3.2 Fast & Slow Pointer (Floyd's Cycle)",
          "3.3 Reversing & Merging Linked Lists",
          "3.4 Stack - Monotonic Stack Patterns",
          "3.5 Queue, Deque & Priority Queue (Heap)",
        ],
      },
      {
        module: "Module 04",
        title: "Trees & Graphs",
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
        ],
      },
      {
        module: "Module 05",
        title: "Dynamic Programming",
        topics: [
          "5.1 Memoization vs Tabulation",
          "5.2 1D DP - Fibonacci, Climbing Stairs, House Robber",
          "5.3 2D DP - Grid Paths, Edit Distance",
          "5.4 Knapsack Variants - 0/1, Unbounded, Fractional",
          "5.5 Longest Common Subsequence & Substring",
          "5.6 Interval DP & Partition Problems",
        ],
      },
      {
        module: "Module 06",
        title: "Interview Strategy",
        topics: [
          "6.1 Mock Interviews - FAANG Style Problems",
          "6.2 Behavioral Questions - STAR Method",
          "6.3 System Design Primer (for SDE-2+)",
          "6.4 LeetCode Patterns - Top 75 Problem Walkthrough",
        ],
      },
    ],
    projects: [
      {
        type: "major",
        title: "Graph Visualizer",
        tech: "BFS/DFS step-by-step web app",
      },
      {
        type: "major",
        title: "DP Toolkit",
        tech: "Interactive pattern explorer",
      },
      {
        type: "minor",
        title: "LeetCode Top 100 Solver",
        tech: "Annotated solutions in chosen language",
      },
      {
        type: "minor",
        title: "Sorting Simulator",
        tech: "Visual comparison of all sort algorithms",
      },
    ],
    certificate: "DSA Interview Master Certification",
    faqs: [
      {
        question: "Language choice?",
        answer: "C++/Java/Python - pick one, master optimal solutions for all.",
      },
      {
        question: "Beginner ok?",
        answer: "Yes! Logic foundation + pattern recognition taught from scratch.",
      },
      {
        question: "Mock interviews?",
        answer: "5 live FAANG-style interviews + detailed feedback sessions.",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 6. AI & MACHINE LEARNING ENGINEER
  // ─────────────────────────────────────────────
  {
    slug: "AI-Machine-learning",
    title: "AI/Machine Learning",
    description:
      "Build production ML systems. Neural networks, deployment & MLOps included.",
    startDate: "April 18, 2026",
    duration: "12 Weeks",
    mode: "Hybrid Intensive",
    price: "₹1399",
    access: "426 Days Access + Complete Python + Deployment Support",
    color: "#8b5cf6",
    gradientFrom: "#8b5cf6",
    gradientTo: "#6366f1",
    hours: 80,
    students: 2100,
    rating: 4.9,
    techStack: [
      "Complete Python",
      "Scikit-Learn 1.5",
      "TensorFlow 2.16",
      "Keras 3",
      "OpenCV 4.10",
    ],
    highlights: [
      "Complete Python Covered + AI",
      "Math intuition first",
      "Production deployment",
      "Neural nets from scratch",
      "MLOps pipeline",
    ],
    syllabus: [
      {
        module: "Module 01",
        title: "Foundations of Artificial Intelligence",
        topics: [
          "1.1 AI vs ML vs Deep Learning - The Big Picture",
          "1.2 History of Artificial Intelligence",
          "1.3 Real-World Applications of AI",
          "1.4 Types of AI - Narrow AI vs General AI",
          "1.5 Understanding Data in AI Systems",
          "1.6 AI Tools & Ecosystem Overview",
        ],
      },
      {
        module: "Module 02",
        title: "Python for Machine Learning",
        topics: [
          "2.1 Python Environment Setup - Jupyter, Anaconda, Colab",
          "2.2 Python Refresher for ML - Variables, Loops, Functions",
          "2.3 NumPy - Arrays, Vectorization & Mathematical Operations",
          "2.4 Pandas - DataFrames, Data Cleaning & Manipulation",
          "2.5 Matplotlib & Seaborn - Data Visualization",
          "2.6 Working with Datasets in Python",
        ],
      },
      {
        module: "Module 03",
        title: "Mathematics for Machine Learning",
        topics: [
          "3.1 Linear Algebra Basics - Vectors & Matrices",
          "3.2 Matrix Operations & Transformations",
          "3.3 Probability Fundamentals for ML",
          "3.4 Statistical Concepts - Mean, Variance, Distribution",
          "3.5 Calculus Basics - Derivatives & Gradients",
          "3.6 Gradient Descent Explained",
        ],
      },
      {
        module: "Module 04",
        title: "Data Preprocessing & Feature Engineering",
        topics: [
          "4.1 Understanding Real World Data",
          "4.2 Handling Missing Data",
          "4.3 Data Cleaning Techniques",
          "4.4 Encoding Categorical Variables",
          "4.5 Feature Scaling - Normalization & Standardization",
          "4.6 Feature Selection Techniques",
          "4.7 Splitting Data - Train, Validation & Test Sets",
        ],
      },
      {
        module: "Module 05",
        title: "Introduction to Machine Learning",
        topics: [
          "5.1 What is Machine Learning",
          "5.2 Types of ML - Supervised, Unsupervised, Reinforcement",
          "5.3 ML Workflow - Problem Framing to Deployment",
          "5.4 Bias-Variance Tradeoff",
          "5.5 Overfitting vs Underfitting",
          "5.6 Model Training & Prediction",
        ],
      },
      {
        module: "Module 06",
        title: "Supervised Learning - Regression",
        topics: [
          "6.1 Introduction to Regression Models",
          "6.2 Linear Regression - Concepts & Implementation",
          "6.3 Multiple Linear Regression",
          "6.4 Polynomial Regression",
          "6.5 Regularization - Ridge & Lasso Regression",
          "6.6 Evaluating Regression Models",
        ],
      },
      {
        module: "Module 07",
        title: "Supervised Learning - Classification",
        topics: [
          "7.1 Introduction to Classification",
          "7.2 Logistic Regression",
          "7.3 K-Nearest Neighbors (KNN)",
          "7.4 Support Vector Machines (SVM)",
          "7.5 Decision Trees",
          "7.6 Random Forest Algorithm",
          "7.7 Naive Bayes Classifier",
        ],
      },
      {
        module: "Module 08",
        title: "Model Evaluation & Optimization",
        topics: [
          "8.1 Confusion Matrix Explained",
          "8.2 Accuracy, Precision, Recall & F1 Score",
          "8.3 ROC Curve & AUC",
          "8.4 Cross Validation Techniques",
          "8.5 Hyperparameter Tuning",
          "8.6 Grid Search & Random Search",
        ],
      },
      {
        module: "Module 09",
        title: "Unsupervised Learning",
        topics: [
          "9.1 Introduction to Unsupervised Learning",
          "9.2 Clustering Concepts",
          "9.3 K-Means Clustering",
          "9.4 Hierarchical Clustering",
          "9.5 DBSCAN Algorithm",
          "9.6 Dimensionality Reduction",
          "9.7 Principal Component Analysis (PCA)",
        ],
      },
      {
        module: "Module 10",
        title: "Introduction to Deep Learning",
        topics: [
          "10.1 Neural Networks Fundamentals",
          "10.2 Artificial Neural Networks (ANN)",
          "10.3 Activation Functions",
          "10.4 Loss Functions",
          "10.5 Backpropagation Algorithm",
          "10.6 Introduction to TensorFlow & Keras",
        ],
      },
      {
        module: "Module 11",
        title: "Computer Vision",
        topics: [
          "11.1 Introduction to Computer Vision",
          "11.2 Image Processing Basics",
          "11.3 Convolutional Neural Networks (CNN)",
          "11.4 Image Classification Models",
          "11.5 Object Detection Concepts",
          "11.6 Real World Computer Vision Applications",
        ],
      },
      {
        module: "Module 12",
        title: "Natural Language Processing (NLP)",
        topics: [
          "12.1 Introduction to NLP",
          "12.2 Text Preprocessing Techniques",
          "12.3 Tokenization & Stopwords",
          "12.4 Stemming & Lemmatization",
          "12.5 TF-IDF Vectorization",
          "12.6 Word Embeddings",
          "12.7 Sentiment Analysis Models",
        ],
      },
      {
        module: "Module 13",
        title: "Reinforcement Learning",
        topics: [
          "13.1 Introduction to Reinforcement Learning",
          "13.2 Agents, Environment & Rewards",
          "13.3 Markov Decision Process",
          "13.4 Q-Learning Algorithm",
          "13.5 Deep Reinforcement Learning",
          "13.6 Real World RL Applications",
        ],
      },
      {
        module: "Module 14",
        title: "Model Deployment & MLOps",
        topics: [
          "14.1 Saving & Loading ML Models",
          "14.2 Building ML APIs using Flask / FastAPI",
          "14.3 Deploying ML Models on Cloud",
          "14.4 Docker Basics for ML",
          "14.5 Model Monitoring & Maintenance",
          "14.6 CI/CD for Machine Learning",
        ],
      },
      {
        module: "Module 15",
        title: "Advanced AI Topics",
        topics: [
          "15.1 Introduction to Generative AI",
          "15.2 Transformers Architecture",
          "15.3 Large Language Models (LLMs)",
          "15.4 Prompt Engineering",
          "15.5 Explainable AI (XAI)",
          "15.6 AI Ethics & Responsible AI",
        ],
      },
    ],
    projects: [
      {
        type: "major",
        title: "House Price Predictor",
        tech: "Ridge/XGBoost + feature engineering + Flask API",
      },
      {
        type: "major",
        title: "Face Recognition Attendance System",
        tech: "OpenCV + CNN + real-time webcam",
      },
      {
        type: "minor",
        title: "Customer Churn Prediction",
        tech: "Ensemble models + SHAP explainability",
      },
      {
        type: "minor",
        title: "Image Classifier Web App",
        tech: "Transfer Learning + Docker + CI/CD",
      },
    ],
    certificate: "AI/ML Engineer Certification",
    faqs: [
      {
        question: "Math heavy?",
        answer: "Intuition → Math → Code. Easier than college textbooks.",
      },
      {
        question: "Deployment included?",
        answer: "Flask API + Docker deployment for all projects.",
      },
      {
        question: "Neural networks?",
        answer: "From scratch implementation + TensorFlow/Keras production.",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 7. DATA SCIENCE
  // ─────────────────────────────────────────────
  {
    slug: "Data-Science",
    title: "Data Science",
    description:
      "Complete pipeline: SQL → Python → ML → Deployment → Dashboards.",
    startDate: "May 9, 2026",
    duration: "14 Weeks",
    mode: "Hybrid Professional",
    price: "₹999",
    access: "426 Days Access + Career Mentorship",
    color: "#14b8a6",
    gradientFrom: "#14b8a6",
    gradientTo: "#3b82f6",
    hours: 72,
    students: 1680,
    rating: 4.8,
    techStack: [
      "PostgreSQL 16",
      "Python 3.11",
      "Tableau 2025",
      "Docker",
      "AWS Sagemaker",
    ],
    highlights: [
      "End-to-end projects",
      "SQL mastery",
      "Tableau dashboards",
      "MLOps ready",
    ],
    syllabus: [
      {
        module: "Module 01",
        title: "Data Science Ecosystem",
        topics: [
          "1.1 Data Science Roles - Analyst vs Scientist vs Engineer",
          "1.2 The Data Science Workflow (CRISP-DM)",
          "1.3 Tools Overview - Python, SQL, Tableau, Power BI",
          "1.4 Setting Up Your Data Science Environment",
        ],
      },
      {
        module: "Module 02",
        title: "SQL for Data Science",
        topics: [
          "2.1 SQL Basics - SELECT, WHERE, ORDER BY, LIMIT",
          "2.2 Joins - INNER, LEFT, RIGHT, FULL, SELF",
          "2.3 Aggregations - GROUP BY, HAVING, Window Functions",
          "2.4 Subqueries & CTEs (Common Table Expressions)",
          "2.5 SQL for EDA - Finding Outliers, Distributions",
          "2.6 Connecting SQL to Python (SQLAlchemy, psycopg2)",
        ],
      },
      {
        module: "Module 03",
        title: "Exploratory Data Analysis",
        topics: [
          "3.1 Data Collection - APIs, Web Scraping, Public Datasets",
          "3.2 Data Cleaning Pipeline (Real-World Messy Data)",
          "3.3 Univariate & Bivariate Analysis",
          "3.4 Feature Engineering & Selection",
          "3.5 Outlier Detection & Treatment",
          "3.6 Handling Imbalanced Datasets (SMOTE, Undersampling)",
        ],
      },
      {
        module: "Module 04",
        title: "Predictive Modeling",
        topics: [
          "4.1 Regression Models - Linear, Polynomial, Ridge, Lasso",
          "4.2 Classification Models & Threshold Tuning",
          "4.3 Ensemble Methods - Gradient Boosting, Stacking",
          "4.4 Time-Series Forecasting - ARIMA, SARIMA, Prophet",
          "4.5 A/B Testing & Causal Inference",
        ],
      },
      {
        module: "Module 05",
        title: "Visualization & Reporting",
        topics: [
          "5.1 Tableau - Dashboards, Calculated Fields, LOD Expressions",
          "5.2 Power BI - DAX, Reports & Service Publishing",
          "5.3 Storytelling with Data - Presentation Frameworks",
          "5.4 Building Automated Reports with Python",
        ],
      },
      {
        module: "Module 06",
        title: "Big Data & Cloud",
        topics: [
          "6.1 Big Data Concepts - Hadoop, Spark Basics",
          "6.2 PySpark - DataFrames & ML Pipeline",
          "6.3 Cloud Platforms - AWS S3, GCP BigQuery, Azure",
          "6.4 Building a Data Science Portfolio - 5 Project Ideas",
        ],
      },
    ],
    projects: [
      {
        type: "major",
        title: "Uber Analytics Dashboard",
        tech: "SQL + Tableau interactive story",
      },
      {
        type: "major",
        title: "Fraud Detection Pipeline",
        tech: "XGBoost + SHAP + FastAPI + Docker",
      },
      {
        type: "minor",
        title: "Sales Forecast System",
        tech: "Time series + cloud deployment + monitoring",
      },
    ],
    certificate: "Data Scientist Certification",
    faqs: [
      {
        question: "SQL from basics?",
        answer: "Yes! Beginner to advanced analytics SQL included.",
      },
      {
        question: "Tableau certification?",
        answer: "Tableau Desktop Specialist prep materials provided.",
      },
      {
        question: "Production ready?",
        answer: "Dockerized models deployed to cloud with monitoring.",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 8. WEB DEVELOPER
  // ─────────────────────────────────────────────
  {
    slug: "Web-Dev",
    title: "Web Development",
    description:
      "Full-stack web apps. React 19 + Next.js 15 + Production deployment.",
    startDate: "Coming Soon..",
    duration: "16 Weeks",
    mode: "Live Project-Based",
    price: "₹820",
    access: "400 Days Access + Internship Ops",
    color: "#6366f1",
    gradientFrom: "#6366f1",
    gradientTo: "#8b5cf6",
    hours: 96,
    students: 3200,
    rating: 4.9,
    techStack: [
      "React 19",
      "Next.js 15",
      "Node 22",
      "MongoDB 8",
      "TypeScript",
    ],
    highlights: [
      "App Router Next.js",
      "TypeScript throughout",
      "Production auth",
      "Deployment mastery",
    ],
    syllabus: [
      {
        module: "Module 01",
        title: "Web Fundamentals",
        topics: [
          "1.1 How the Web Works - HTTP/HTTPS, DNS, Browsers",
          "1.2 HTML5 Structure & Semantic Markup",
          "1.3 CSS3 Foundations - Box Model, Flexbox, Grid",
          "1.4 Responsive Design & Mobile-First Workflow",
          "1.5 Git & GitHub - Version Control for Devs",
        ],
      },
      {
        module: "Module 02",
        title: "JavaScript Mastery",
        topics: [
          "2.1 JS Basics - Types, Variables (var/let/const), Scope",
          "2.2 Functions - Regular, Arrow, IIFE, Closures",
          "2.3 DOM Manipulation & Events",
          "2.4 Promises, Async/Await & Fetch API",
          "2.5 ES6+ -- Destructuring, Spread, Modules, Optional Chaining",
          "2.6 Local Storage, Session Storage & Cookies",
          "2.7 Error Handling & Debugging in DevTools",
        ],
      },
      {
        module: "Module 03",
        title: "React.js",
        topics: [
          "3.1 React Fundamentals - JSX, Components & Props",
          "3.2 State Management - useState, useReducer",
          "3.3 useEffect, useMemo & Custom Hooks",
          "3.4 React Router v6 - Dynamic Routing & Params",
          "3.5 Context API vs Redux Toolkit",
          "3.6 React Query & Data Fetching Patterns",
          "3.7 Tailwind CSS Integration with React",
        ],
      },
      {
        module: "Module 04",
        title: "Node.js & Express Backend",
        topics: [
          "4.1 Node.js Architecture - Event Loop & Modules",
          "4.2 Express - Routing, Middleware & Error Handling",
          "4.3 REST API Design - CRUD with Proper Status Codes",
          "4.4 Authentication - JWT, bcrypt & Refresh Tokens",
          "4.5 MongoDB with Mongoose - Schema & CRUD",
          "4.6 SQL with PostgreSQL & Sequelize ORM",
          "4.7 File Upload - Multer & Cloudinary Integration",
        ],
      },
      {
        module: "Module 05",
        title: "DevOps & Deployment",
        topics: [
          "5.1 Environment Variables & Secrets Management",
          "5.2 Docker - Containerizing a MERN App",
          "5.3 CI/CD with GitHub Actions",
          "5.4 Deploying to Vercel, Render & Railway",
          "5.5 Domain, SSL & Production Checklist",
        ],
      },
    ],
    projects: [
      {
        type: "major",
        title: "Full E-commerce MERN",
        tech: "Products, cart, payments, admin dashboard",
      },
      {
        type: "major",
        title: "Real-time Chat App",
        tech: "Socket.io + auth + rooms",
      },
      {
        type: "minor",
        title: "SaaS Dashboard",
        tech: "Next.js 15 + Stripe + multi-tenant auth",
      },
      {
        type: "minor",
        title: "Blog CMS",
        tech: "Next.js + MDX + ISR + admin panel",
      },
    ],
    certificate: "MERN Stack Developer Certification",
    faqs: [
      {
        question: "TypeScript included?",
        answer: "100% TypeScript - industry standard for production apps.",
      },
      {
        question: "Deployment covered?",
        answer: "All projects deployed to Vercel + custom domains provided.",
      },
      {
        question: "Internship guarantee?",
        answer: "Top performers get internship referrals to partner companies.",
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 9. LINKEDIN MASTERY
  // ─────────────────────────────────────────────
  {
    slug: "Linkedin-Setup",
    title: "Complete LinkedIn Setup",
    description:
      "5x profile views. Recruiter attraction system for tech jobs & freelancing.",
    startDate: "May 10, 2026",
    duration: "2 Weeks",
    mode: "Recorded + Live Review",
    price: "₹289",
    access: "150 Days Access",
    color: "#0ea5e9",
    gradientFrom: "#0ea5e9",
    gradientTo: "#6366f1",
    hours: 10,
    students: 540,
    rating: 4.7,
    techStack: [
      "LinkedIn Algorithm 2026",
      "Canva Pro",
      "ChatGPT 4o",
      "Profile SEO",
    ],
    highlights: [
      "5x view guarantee",
      "ATS optimization",
      "Content calendar",
      "DM scripts",
    ],
    syllabus: [
      {
        module: "Module 01",
        title: "Profile Foundation",
        topics: [
          "1.1 Choosing the Right Profile Photo & Banner",
          "1.2 Writing a Magnetic Headline (Formula & Examples)",
          "1.3 Crafting an About Section That Converts",
          "1.4 Featured Section - Pinning Posts, Links & Media",
          "1.5 Experience Section - STAR Format Bullet Points",
          "1.6 Education, Licenses & Certifications",
          "1.7 Skills Section - Top 5 Strategy & Endorsements",
        ],
      },
      {
        module: "Module 02",
        title: "LinkedIn SEO & Visibility",
        topics: [
          "2.1 How LinkedIn Algorithm Works in 2026",
          "2.2 Keyword Research for Your Niche",
          "2.3 Optimizing Every Section with Keywords",
          "2.4 Open to Work vs Open to Opportunities Settings",
          "2.5 LinkedIn SSI Score - What It Means & How to Raise It",
        ],
      },
      {
        module: "Module 03",
        title: "Content Strategy",
        topics: [
          "3.1 Content Pillars & Posting Consistency",
          "3.2 Post Formats - Text, Carousels, Video & Polls",
          "3.3 Hook Writing - 5 Proven Opening Formulas",
          "3.4 Using Storytelling to Drive Engagement",
          "3.5 Scheduling Tools - Buffer, Taplio, LinkedIn Native",
          "3.6 Hashtag Strategy & Optimal Post Timing",
        ],
      },
      {
        module: "Module 04",
        title: "Networking & Outreach",
        topics: [
          "4.1 Connection Request Templates That Get Accepted",
          "4.2 Cold Messaging Strategy for Jobs & Clients",
          "4.3 Building a Referral Network",
          "4.4 Engaging with Target Profiles & Companies",
          "4.5 LinkedIn Groups & Events Strategy",
        ],
      },
      {
        module: "Module 05",
        title: "Job Search & Personal Branding",
        topics: [
          "5.1 Applying via LinkedIn Easy Apply - Best Practices",
          "5.2 LinkedIn Premium - Is It Worth It?",
          "5.3 Getting Recommendations That Matter",
          "5.4 Personal Branding Roadmap - 90 Day Plan",
          "5.5 Tracking Metrics & Profile Analytics",
        ],
      },
    ],
    projects: [
      {
        type: "major",
        title: "Fully Optimized LinkedIn Profile",
        tech: "Targeting 5x profile views in 30 days",
      },
      {
        type: "minor",
        title: "30-Day Content Calendar",
        tech: "Topic, format, hook & hashtags for each post",
      },
      {
        type: "minor",
        title: "Recruiter Outreach Plan",
        tech: "Target list + personalized DM scripts",
      },
    ],
    certificate: "LinkedIn Branding Expert",
    faqs: [
      {
        question: "Job guarantee?",
        answer: "5x profile views guaranteed = 10x interview chances.",
      },
      {
        question: "ATS passing?",
        answer: "100% ATS-optimized keywords for tech roles.",
      },
      {
        question: "Content ideas?",
        answer: "50+ post templates + weekly trending topics.",
      },
    ],
  },
];