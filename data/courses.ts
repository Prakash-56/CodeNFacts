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

export interface Course {
  slug: string;
  title: string;
  description: string;
  startDate: string;
  duration: string;
  mode: string;
  price: string;
  enrollLink: string;
  access: string;
  techStack: string[];
  highlights: string[];
  syllabus: SyllabusItem[];
  projects: string[];
  certificate: string;
  faqs: FAQItem[];
}

export const courses: Course[] = [
  {
    slug: "python-ds",
    title: "Python for Data Science",
    description: "Master the world's most popular programming language specifically for data analysis, visualization, and statistical modeling. From basic syntax to predictive analytics.",
    startDate: "February 15, 2026",
    duration: "8 Weeks",
    mode: "Hybrid (Live + Recorded)",
    price: "₹2,499",
    enrollLink: "https://enroll.codenfacts.com/python-ds",
    access: "Lifetime Access + 1:1 Mentorship",
    techStack: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-Learn"],
    highlights: ["No-coding background required", "10+ Real-world datasets", "Weekly 1:1 doubt clearing", "Resume & Portfolio building"],
    syllabus: [
      { module: "Module 1", title: "Python Environment & Basics", topics: ["Installation (Anaconda/VS Code)", "Variables & Data Types", "Operators & Expressions"] },
      { module: "Module 2", title: "Control Flow & Logic", topics: ["If-Else Statements", "For/While Loops", "List Comprehensions", "Error Handling"] },
      { module: "Module 3", title: "Advanced Python Functions", topics: ["Def Keywords", "Lambda Functions", "Map/Filter/Reduce", "Modules & Packages"] },
      { module: "Module 4", title: "Scientific Computing with NumPy", topics: ["N-dimensional Arrays", "Broadcasting", "Vectorization", "Mathematical Operations"] },
      { module: "Module 5", title: "Data Manipulation with Pandas", topics: ["Series & Dataframes", "Data Cleaning", "Handling Missing Values", "Pivot Tables", "Merging/Joining"] },
      { module: "Module 6", title: "Data Visualization Masterclass", topics: ["Matplotlib Basics", "Advanced Seaborn", "Plotly Interactivity", "Dashboarding with Streamlit"] },
      { module: "Module 7", title: "Statistical Foundation", topics: ["Descriptive Stats", "Hypothesis Testing", "p-values", "Probability Distributions"] },
      { module: "Module 8", title: "Introduction to Machine Learning", topics: ["Linear Regression", "Classification Basics", "Model Evaluation", "Final Capstone Prep"] }
    ],
    projects: ["Stock Market Trend Analyzer", "Health Data Sanitization Engine", "Amazon Review Sentiment Classifier"],
    certificate: "Professional Certificate in Data Science by CodeNFacts",
    faqs: [
      { question: "Do I need prior coding knowledge?", answer: "No, we start from absolute zero." },
      { question: "What if I miss a live session?", answer: "Recordings are uploaded within 2 hours." }
    ]
  },
  {
    slug: "java-oop",
    title: "OOP with Java",
    description: "Deep dive into Object-Oriented Programming using Java. Perfect for university exams and cracking product-based company interviews.",
    startDate: "March 01, 2026",
    duration: "6 Weeks",
    mode: "Live Interactive",
    price: "₹1,999",
    enrollLink: "https://enroll.codenfacts.com/java-oop",
    access: "Lifetime Access",
    techStack: ["Java 17", "IntelliJ IDEA", "JUnit", "Maven"],
    highlights: ["Industry Standard Coding Practices", "Design Patterns Introduction", "Interview FAQ Sessions", "Live Coding Challenges"],
    syllabus: [
      { module: "Module 1", title: "Java Fundamentals", topics: ["JVM Architecture", "JDK vs JRE", "Primitive vs Reference Types", "Memory Management"] },
      { module: "Module 2", title: "Class & Objects", topics: ["Constructors", "This keyword", "Static vs Instance members", "Access Modifiers"] },
      { module: "Module 3", title: "The 4 Pillars of OOP", topics: ["Encapsulation", "Inheritance (Single/Multilevel)", "Polymorphism (Overloading/Overriding)", "Abstraction"] },
      { module: "Module 4", title: "Interfaces & Abstract Classes", topics: ["Multiple Inheritance via Interfaces", "Default & Static methods", "Abstract methods"] },
      { module: "Module 5", title: "Exception Handling", topics: ["Try-Catch-Finally", "Custom Exceptions", "Checked vs Unchecked", "Throws vs Throw"] },
      { module: "Module 6", title: "Java Collections Framework", topics: ["ArrayList & LinkedList", "HashMap & HashSet", "Iterators", "Sorting with Comparable/Comparator"] },
      { module: "Module 7", title: "File I/O & Streams", topics: ["Reading/Writing Files", "BufferReader", "Java 8 Streams API", "Lambda Expressions"] }
    ],
    projects: ["Atm Management System", "Library Management System", "Student Grading Portal (OOP based)"],
    certificate: "Advanced Java Programming Certification",
    faqs: [{ question: "Is Java still relevant in 2026?", answer: "Absolutely. It powers 90% of Fortune 500 enterprise backends." }]
  },
  {
    slug: "linkedin-mastery",
    title: "Complete LinkedIn Setup",
    description: "Not a coding course, but a career booster. Optimize your profile to attract recruiters and high-paying freelance clients.",
    startDate: "Self-Paced",
    duration: "2 Weeks",
    mode: "Recorded + Live Review",
    price: "₹499",
    enrollLink: "https://enroll.codenfacts.com/linkedin",
    access: "Lifetime Access",
    techStack: ["LinkedIn Analytics", "Canva", "ChatGPT for Copywriting"],
    highlights: ["Profile SEO Optimization", "Networking Scripts", "Content Strategy", "Personal Branding"],
    syllabus: [
      { module: "Module 1", title: "Profile Foundation", topics: ["Headline Writing for SEO", "The 'About' Section Storytelling", "Banner Design with Canva"] },
      { module: "Module 2", title: "Experience & Skills", topics: ["Highlighting Achievements (STAR method)", "Skill Endorsements Strategy", "Recommendation Loops"] },
      { module: "Module 3", title: "Content Strategy", topics: ["The LinkedIn Algorithm", "Writing High-Engagement Posts", "Using Visuals & Carousels"] },
      { module: "Module 4", title: "Inbound Recruitment", topics: ["Attracting Recruiters", "Setting up Job Alerts", "Networking with Hiring Managers"] }
    ],
    projects: ["Fully Optimized LinkedIn Profile", "Personal Branding Content Calendar"],
    certificate: "Professional Branding Certificate",
    faqs: [{ question: "Does this guarantee a job?", answer: "It guarantees 5x more profile views, which significantly increases interview chances." }]
  },
  {
    slug: "learn-c",
    title: "Mastering C Language",
    description: "The 'Mother of all Languages'. Master C to understand how memory, pointers, and computers actually work.",
    startDate: "February 20, 2026",
    duration: "5 Weeks",
    mode: "Recorded + Doubt Support",
    price: "₹1,299",
    enrollLink: "https://enroll.codenfacts.com/c-mastery",
    access: "Lifetime",
    techStack: ["GCC Compiler", "CodeBlocks/VS Code"],
    highlights: ["Low-level Programming", "Pointer Deep-dive", "Memory Allocation Concepts"],
    syllabus: [
      { module: "Module 1", title: "C Anatomy", topics: ["History of C", "Compilers vs Interpreters", "Basic Syntax", "ASCII Table"] },
      { module: "Module 2", title: "Operations", topics: ["Arithmetic/Logical Operators", "Bitwise Operations", "Operator Precedence"] },
      { module: "Module 3", title: "Loops & Decision", topics: ["Nested Loops", "Switch Case", "Break/Continue/Goto"] },
      { module: "Module 4", title: "Pointers (The Core)", topics: ["Pointer Arithmetic", "Pointer to Pointer", "Call by Value vs Reference"] },
      { module: "Module 5", title: "Arrays & Strings", topics: ["1D/2D Arrays", "String Manipulation functions", "Character Arrays"] },
      { module: "Module 6", title: "Memory Management", topics: ["Stack vs Heap", "Malloc/Calloc/Realloc/Free", "Structure & Unions"] }
    ],
    projects: ["Mini Calculator", "Snake Game in C", "File Encryption System"],
    certificate: "C Foundation Programming Certificate",
    faqs: [{ question: "Why learn C first?", answer: "It builds the strongest logic foundation for any other language." }]
  },
  {
    slug: "html-css",
    title: "Learn Complete HTML/CSS",
    description: "The gateway to Web Development. Learn to build beautiful, responsive, and modern websites from scratch.",
    startDate: "February 25, 2026",
    duration: "4 Weeks",
    mode: "Live Workshop",
    price: "₹999",
    enrollLink: "https://enroll.codenfacts.com/html-css",
    access: "Lifetime",
    techStack: ["HTML5", "CSS3", "Flexbox", "CSS Grid", "Tailwind CSS"],
    highlights: ["Responsive Design", "Modern UI Principles", "Project-based learning"],
    syllabus: [
      { module: "Module 1", title: "HTML5 Essentials", topics: ["Semantic Tags", "Forms & Validation", "Multimedia (Audio/Video)", "SEO Meta Tags"] },
      { module: "Module 2", title: "CSS3 Fundamentals", topics: ["Selectors & Specificity", "Box Model", "Typography", "Colors & Gradients"] },
      { module: "Module 3", title: "Modern Layouts", topics: ["Flexbox Deep-dive", "CSS Grid Mastery", "Positioning (Relative/Absolute/Sticky)"] },
      { module: "Module 4", title: "Animations & Effects", topics: ["Transitions", "Keyframe Animations", "Glassmorphism & Neumorphism"] },
      { module: "Module 5", title: "Responsive Web Design", topics: ["Media Queries", "Mobile-First approach", "Viewport Units"] },
      { module: "Module 6", title: "Tailwind CSS Intro", topics: ["Utility-First CSS", "Speeding up Development", "Customizing Config"] }
    ],
    projects: ["Modern Portfolio Website", "Netflix Clone (UI)", "Restaurant Menu Page"],
    certificate: "Frontend Design Specialist Certificate",
    faqs: [{ question: "Is this enough for a job?", answer: "This is the first 1/3 of becoming a Web Developer. Pair it with JavaScript for a full career." }]
  },
  {
    slug: "ai-ml",
    title: "AI/Machine Learning",
    description: "The future is here. Learn to build intelligent systems, recommendation engines, and neural networks from the ground up.",
    startDate: "March 15, 2026",
    duration: "12 Weeks",
    mode: "Hybrid",
    price: "₹4,999",
    enrollLink: "https://enroll.codenfacts.com/ai-ml",
    access: "Lifetime + Resume Support",
    techStack: ["Scikit-Learn", "TensorFlow", "Keras", "OpenCV"],
    highlights: ["Advanced Math for AI", "Neural Network Projects", "Deployment with Flask"],
    syllabus: [
      { module: "Module 1", title: "Intro to AI", topics: ["AI vs ML vs Deep Learning", "Types of Learning", "The ML Pipeline"] },
      { module: "Module 2", title: "Regression Algorithms", topics: ["Simple & Multiple Linear Regression", "Polynomial Regression", "Overfitting/Underfitting"] },
      { module: "Module 3", title: "Classification", topics: ["Logistic Regression", "Decision Trees", "Random Forest", "SVM"] },
      { module: "Module 4", title: "Unsupervised Learning", topics: ["K-Means Clustering", "PCA Dimensionality Reduction", "Association Rules"] },
      { module: "Module 5", title: "Deep Learning Foundations", topics: ["Perceptrons", "Backpropagation", "Activation Functions (ReLU/Sigmoid)"] },
      { module: "Module 6", title: "Computer Vision", topics: ["Image Processing with OpenCV", "CNN (Convolutional Neural Nets)"] },
      { module: "Module 7", title: "Natural Language Processing", topics: ["Tokenization", "Word Embeddings", "LSTMs & Transformers Intro"] }
    ],
    projects: ["House Price Prediction", "Face Recognition System", "Customer Churn Predictor"],
    certificate: "AI & Machine Learning Engineer Certificate",
    faqs: [{ question: "Is there too much math?", answer: "We explain the intuition first, then the math. You'll find it easier than school!" }]
  },
  {
    slug: "dsa",
    title: "Data Structures & Algorithms",
    description: "The blueprint for top-tier software engineering. Master the logic used by Google, Amazon, and Meta.",
    startDate: "February 10, 2026",
    duration: "10 Weeks",
    mode: "Live Coding",
    price: "₹2,999",
    enrollLink: "https://enroll.codenfacts.com/dsa",
    access: "Lifetime Access",
    techStack: ["C++", "Java", "Python", "LeetCode Challenges"],
    highlights: ["FAANG Level Preparation", "300+ Problems Solved", "Weekly Mock Interviews"],
    syllabus: [
      { module: "Module 1", title: "Complexity Analysis", topics: ["Big O Notation", "Time & Space Complexity", "Recursion Basics"] },
      { module: "Module 2", title: "Linear Data Structures", topics: ["Arrays & Dynamic Arrays", "Linked Lists (Singly/Doubly/Circular)", "Stack & Queue Implementation"] },
      { module: "Module 3", title: "Searching & Sorting", topics: ["Binary Search", "Quick Sort", "Merge Sort", "Heap Sort"] },
      { module: "Module 4", title: "Non-Linear Structures", topics: ["Binary Trees", "BST (Binary Search Trees)", "AVL Trees"] },
      { module: "Module 5", title: "Hashing", topics: ["Hash Maps", "Collision Handling", "Hash Functions"] },
      { module: "Module 6", title: "Graphs", topics: ["BFS/DFS", "Dijkstra's Algorithm", "Minimum Spanning Tree"] },
      { module: "Module 7", title: "Advanced Topics", topics: ["Dynamic Programming", "Greedy Algorithms", "Backtracking (Sudoku Solver)"] }
    ],
    projects: ["Visualizing Sorting Algorithms", "Pathfinder Map App", "Sudoku Solver"],
    certificate: "DSA Expert Certification",
    faqs: [{ question: "Which language is used?", answer: "You can choose between C++ or Java." }]
  },
  {
    slug: "data-science",
    title: "Data Science Specialization",
    description: "A complete journey from Data Analysis to Machine Learning Deployment. Become a job-ready Data Scientist.",
    startDate: "March 10, 2026",
    duration: "14 Weeks",
    mode: "Hybrid",
    price: "₹5,499",
    enrollLink: "https://enroll.codenfacts.com/full-ds",
    access: "1:1 Career Mentorship",
    techStack: ["SQL", "Tableau", "Python", "Deployment (AWS/Azure)"],
    highlights: ["End-to-end Pipeline", "SQL for Data Science", "Tableau Dashboards", "Big Data Intro"],
    syllabus: [
      { module: "Module 1", title: "SQL for Data Science", topics: ["Joins & Unions", "Window Functions", "Stored Procedures", "Query Optimization"] },
      { module: "Module 2", title: "Python Advanced", topics: ["Data Cleaning Pipelines", "Functional Programming", "Advanced Pandas"] },
      { module: "Module 3", title: "EDA Mastery", topics: ["Multivariate Analysis", "Outlier Detection", "Feature Engineering"] },
      { module: "Module 4", title: "Machine Learning - I", topics: ["Supervised Learning Algorithms", "Hyperparameter Tuning"] },
      { module: "Module 5", title: "Machine Learning - II", topics: ["Ensemble Methods", "XGBoost", "LightGBM"] },
      { module: "Module 6", title: "Data Visualization with Tableau", topics: ["Creating Dashboards", "Calculated Fields", "Storytelling"] },
      { module: "Module 7", title: "MLOps", topics: ["Model Deployment with Flask", "Docker for Data Science", "Cloud Monitoring"] }
    ],
    projects: ["Uber Trip Analysis", "Credit Card Fraud Detection", "Sales Forecasting Dashboard"],
    certificate: "Full-Stack Data Scientist Certification",
    faqs: [{ question: "Is Tableau covered?", answer: "Yes, we cover Tableau from basics to advanced dashboards." }]
  },
  {
    slug: "web-development ",
    title: "Complete Web Development",
    description: "The MERN Stack journey. Build scalable, high-performance web applications from front to back.",
    startDate: "February 28, 2026",
    duration: "16 Weeks",
    mode: "Live",
    price: "₹5,999",
    enrollLink: "https://enroll.codenfacts.com/web-dev",
    access: "Internship Opportunities",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Next.js"],
    highlights: ["MERN Stack Mastery", "Next.js 14 (App Router)", "Real-world Deployment", "Auth with Clerk/Firebase"],
    syllabus: [
      { module: "Module 1", title: "Frontend Foundation", topics: ["HTML5/CSS3 Mastery", "Modern JavaScript (ES6+)", "Responsive Design"] },
      { module: "Module 2", title: "React Fundamentals", topics: ["Hooks (State/Effect/Memo)", "Component Architecture", "React Router"] },
      { module: "Module 3", title: "Backend with Node & Express", topics: ["REST APIs", "Middleware", "MVC Architecture", "JWT Authentication"] },
      { module: "Module 4", title: "Database (MongoDB)", topics: ["Mongoose Schemas", "Aggregation Framework", "CRUD Operations"] },
      { module: "Module 5", title: "Next.js & Server Side", topics: ["SSR vs SSG", "App Router", "API Routes", "SEO Optimization"] },
      { module: "Module 6", title: "Full Stack Integration", topics: ["Redux Toolkit", "TanStack Query", "Cloudinary for Images"] },
      { module: "Module 7", title: "Deployment & DevOps", topics: ["Docker Basics", "Vercel/Digital Ocean", "CI/CD Pipelines"] }
    ],
    projects: ["E-commerce Platform (MERN)", "Real-time Chat App (Socket.io)", "SaaS Dashboard with Next.js"],
    certificate: "MERN Stack Web Developer Certificate",
    faqs: [{ question: "Will I learn about hosting?", answer: "Yes, we host 3 live projects on custom domains." }]
  }
];