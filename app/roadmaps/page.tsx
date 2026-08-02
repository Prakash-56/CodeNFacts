"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Brain,
  Cloud,
  Server,
  Database,
  Smartphone,
  Gamepad2,
  Shield,
  Layout,
  Users,
  Bot,
  Cpu,
  Sparkles,
  Blocks,
  ChevronDown,
  ChevronUp,
  BookOpen,
  AlertTriangle,
  FileText,
  GitBranch,
  ExternalLink,
} from "lucide-react";

interface Roadmap {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  learningPath: string[];
  importantNotes: string[];
  cheatSheets: { name: string; url?: string }[];
  diagrams: string[];
  relatedSkills: string[];
}

const roadmaps: Roadmap[] = [
  {
    id: "python-developer",
    title: "Python Developer",
    icon: <Code2 className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    description:
      "Master Python for web, automation, data science, and backend systems.",
    learningPath: [
      "Python Basics & Syntax",
      "OOP & Data Structures",
      "File Handling & Modules",
      "Web Frameworks (Django / FastAPI / Flask)",
      "Databases (SQL + ORM)",
      "Testing (pytest)",
      "Async Programming",
      "Deployment & Packaging",
    ],
    importantNotes: [
      "Focus on writing clean, Pythonic code (PEP 8).",
      "Understand memory management and GIL.",
      "Practice with real projects instead of only tutorials.",
      "Learn virtual environments and dependency management early.",
    ],
    cheatSheets: [
      { name: "Python Syntax Cheat Sheet" },
      { name: "List/Dict Comprehensions" },
      { name: "Decorators & Generators" },
      { name: "Common Standard Library" },
    ],
    diagrams: [
      "Python Memory Model",
      "Request Lifecycle in Django/FastAPI",
      "GIL Explained",
    ],
    relatedSkills: ["Backend", "Data Analysis", "Automation", "AI/ML"],
  },
  {
    id: "java-programmer",
    title: "Java Programmer",
    icon: <Code2 className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    description:
      "Build robust enterprise applications with Java and the JVM ecosystem.",
    learningPath: [
      "Core Java & OOP",
      "Collections Framework",
      "Multithreading & Concurrency",
      "JVM Internals",
      "Spring Boot & Spring Ecosystem",
      "JPA / Hibernate",
      "Microservices with Spring Cloud",
      "Testing & CI/CD",
    ],
    importantNotes: [
      "Understand the difference between checked and unchecked exceptions.",
      "Master concurrent programming carefully.",
      "Learn memory management and garbage collection.",
      "Prefer composition over inheritance.",
    ],
    cheatSheets: [
      { name: "Java Collections Cheat Sheet" },
      { name: "Stream API" },
      { name: "Spring Annotations" },
      { name: "JVM Flags" },
    ],
    diagrams: [
      "JVM Architecture",
      "Spring Boot Auto-configuration Flow",
      "Thread Lifecycle",
    ],
    relatedSkills: ["Backend", "Enterprise", "Microservices"],
  },
  {
    id: "ai-ml-engineer",
    title: "AI/ML Engineer",
    icon: <Brain className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    description:
      "Design, train, and deploy machine learning and deep learning models.",
    learningPath: [
      "Python + NumPy + Pandas",
      "Statistics & Probability",
      "Classical ML (Scikit-learn)",
      "Deep Learning (PyTorch / TensorFlow)",
      "Computer Vision / NLP Fundamentals",
      "Model Evaluation & Experiment Tracking",
      "MLOps Basics",
      "Deployment (ONNX, TorchServe, FastAPI)",
    ],
    importantNotes: [
      "Data quality > Model complexity.",
      "Always start with a strong baseline.",
      "Understand bias, variance, and overfitting deeply.",
      "Track experiments religiously.",
    ],
    cheatSheets: [
      { name: "Scikit-learn Algorithms" },
      { name: "PyTorch Tensors" },
      { name: "Common Loss Functions" },
      { name: "Evaluation Metrics" },
    ],
    diagrams: [
      "ML Pipeline Overview",
      "Neural Network Architecture",
      "Train/Val/Test Split Strategies",
    ],
    relatedSkills: ["Data Science", "MLOps", "Python", "Deep Learning"],
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    icon: <GitBranch className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    description:
      "Bridge development and operations with automation, CI/CD, and infrastructure.",
    learningPath: [
      "Linux Fundamentals",
      "Git & GitHub/GitLab",
      "CI/CD (GitHub Actions, Jenkins, GitLab CI)",
      "Containers (Docker)",
      "Orchestration (Kubernetes)",
      "Infrastructure as Code (Terraform)",
      "Monitoring & Logging",
      "Cloud Platforms",
    ],
    importantNotes: [
      "Automation is the core of DevOps.",
      "Security should be integrated from day one (DevSecOps).",
      "Understand the full software delivery lifecycle.",
      "Culture and collaboration matter as much as tools.",
    ],
    cheatSheets: [
      { name: "Docker Commands" },
      { name: "Kubernetes Cheat Sheet" },
      { name: "Terraform HCL" },
      { name: "Bash Scripting" },
    ],
    diagrams: [
      "CI/CD Pipeline Flow",
      "Kubernetes Architecture",
      "GitOps Workflow",
    ],
    relatedSkills: ["Cloud", "SRE", "Platform Engineering"],
  },
  {
    id: "cloud",
    title: "Cloud Engineer",
    icon: <Cloud className="w-6 h-6" />,
    color: "from-sky-500 to-blue-600",
    description:
      "Design, deploy, and manage scalable cloud infrastructure.",
    learningPath: [
      "Cloud Fundamentals (IaaS, PaaS, SaaS)",
      "AWS / Azure / GCP Core Services",
      "Networking & Security Groups",
      "Compute, Storage, Databases",
      "Serverless",
      "Infrastructure as Code",
      "Cost Optimization",
      "Cloud Architecture Patterns",
    ],
    importantNotes: [
      "Always design for high availability and fault tolerance.",
      "Cost awareness is a critical skill.",
      "Security is shared responsibility.",
      "Prefer managed services when possible.",
    ],
    cheatSheets: [
      { name: "AWS Services Overview" },
      { name: "IAM Best Practices" },
      { name: "Networking (VPC)" },
      { name: "Pricing Calculator Tips" },
    ],
    diagrams: [
      "Well-Architected Framework",
      "Multi-AZ Architecture",
      "Serverless Event-Driven Design",
    ],
    relatedSkills: ["DevOps", "SRE", "Architecture"],
  },
  {
    id: "software-engineer",
    title: "Software Engineer",
    icon: <Code2 className="w-6 h-6" />,
    color: "from-indigo-500 to-violet-500",
    description:
      "Build reliable, maintainable, and scalable software systems.",
    learningPath: [
      "Programming Fundamentals",
      "Data Structures & Algorithms",
      "System Design Basics",
      "Version Control & Collaboration",
      "Testing Strategies",
      "Clean Code & Design Patterns",
      "Databases",
      "APIs & Architecture",
    ],
    importantNotes: [
      "Write code for humans first, machines second.",
      "Understand trade-offs in every design decision.",
      "Communication is a core engineering skill.",
      "Continuous learning is non-negotiable.",
    ],
    cheatSheets: [
      { name: "Big-O Complexities" },
      { name: "Design Patterns" },
      { name: "Git Workflows" },
      { name: "SOLID Principles" },
    ],
    diagrams: [
      "Software Development Lifecycle",
      "Layered Architecture",
      "Request Flow in a Web App",
    ],
    relatedSkills: ["Backend", "Frontend", "Full Stack"],
  },
  {
    id: "data-analysis",
    title: "Data Analyst",
    icon: <Database className="w-6 h-6" />,
    color: "from-teal-500 to-cyan-600",
    description:
      "Turn raw data into actionable insights through analysis and visualization.",
    learningPath: [
      "Excel & Spreadsheets",
      "SQL",
      "Python (Pandas, Matplotlib, Seaborn)",
      "Statistics",
      "Data Visualization (Tableau / Power BI)",
      "Data Cleaning & Wrangling",
      "Storytelling with Data",
      "Business Domain Knowledge",
    ],
    importantNotes: [
      "Ask the right questions before analyzing.",
      "Data cleaning often takes 60-80% of the time.",
      "Visualizations should answer specific questions.",
      "Always validate assumptions.",
    ],
    cheatSheets: [
      { name: "SQL Joins & Window Functions" },
      { name: "Pandas Operations" },
      { name: "Statistical Tests" },
      { name: "Chart Selection Guide" },
    ],
    diagrams: [
      "Data Analysis Workflow",
      "ETL vs ELT",
      "Dashboard Design Principles",
    ],
    relatedSkills: ["Business Intelligence", "SQL", "Python"],
  },
  {
    id: "full-stack",
    title: "Full Stack Developer",
    icon: <Layout className="w-6 h-6" />,
    color: "from-rose-500 to-pink-500",
    description:
      "Build complete web applications from frontend to backend and database.",
    learningPath: [
      "HTML, CSS, JavaScript",
      "Frontend Framework (React / Next.js / Vue)",
      "Backend (Node.js / Python / Go)",
      "Databases (SQL + NoSQL)",
      "Authentication & Authorization",
      "APIs (REST / GraphQL)",
      "Deployment & DevOps Basics",
      "Testing",
    ],
    importantNotes: [
      "Understand the full request lifecycle.",
      "Security is your responsibility on both ends.",
      "Performance matters on both client and server.",
      "Choose the right tool for the problem.",
    ],
    cheatSheets: [
      { name: "HTTP Status Codes" },
      { name: "REST Best Practices" },
      { name: "React Hooks" },
      { name: "Database Indexing" },
    ],
    diagrams: [
      "Full Stack Architecture",
      "Authentication Flow (JWT/OAuth)",
      "Client-Server Communication",
    ],
    relatedSkills: ["Frontend", "Backend", "DevOps"],
  },
  {
    id: "backend",
    title: "Backend Developer",
    icon: <Server className="w-6 h-6" />,
    color: "from-slate-600 to-gray-700",
    description:
      "Design and implement server-side logic, APIs, and data layers.",
    learningPath: [
      "Language Fundamentals",
      "HTTP & REST",
      "Databases & ORM",
      "Authentication",
      "Caching Strategies",
      "Message Queues",
      "Microservices vs Monolith",
      "Observability",
    ],
    importantNotes: [
      "API design is a long-term contract.",
      "Idempotency and consistency matter.",
      "Design for failure.",
      "Logging and monitoring are not optional.",
    ],
    cheatSheets: [
      { name: "HTTP Methods & Status Codes" },
      { name: "Database Normalization" },
      { name: "Caching Patterns" },
      { name: "Rate Limiting" },
    ],
    diagrams: [
      "Request Lifecycle",
      "Database Connection Pooling",
      "Event-Driven Architecture",
    ],
    relatedSkills: ["System Design", "Databases", "DevOps"],
  },
  {
    id: "frontend",
    title: "Frontend Developer",
    icon: <Layout className="w-6 h-6" />,
    color: "from-yellow-400 to-orange-500",
    description:
      "Create fast, accessible, and beautiful user interfaces.",
    learningPath: [
      "HTML & Semantic Markup",
      "CSS (Flexbox, Grid, Modern CSS)",
      "JavaScript (ES6+)",
      "TypeScript",
      "React / Vue / Svelte",
      "State Management",
      "Performance Optimization",
      "Accessibility & Testing",
    ],
    importantNotes: [
      "Accessibility is not optional.",
      "Performance is a feature.",
      "Understand the browser rendering pipeline.",
      "Write maintainable component architecture.",
    ],
    cheatSheets: [
      { name: "CSS Selectors & Specificity" },
      { name: "Flexbox & Grid" },
      { name: "React Hooks" },
      { name: "Web Vitals" },
    ],
    diagrams: [
      "Critical Rendering Path",
      "Component Hierarchy",
      "State Management Flow",
    ],
    relatedSkills: ["UI Design", "UX", "Full Stack"],
  },
  {
    id: "game-developer",
    title: "Game Developer",
    icon: <Gamepad2 className="w-6 h-6" />,
    color: "from-fuchsia-500 to-purple-600",
    description:
      "Create interactive games for desktop, mobile, or web.",
    learningPath: [
      "Programming Fundamentals",
      "Game Engines (Unity / Unreal / Godot)",
      "Game Physics & Math",
      "2D/3D Graphics",
      "Game Design Principles",
      "Animation & Audio",
      "Multiplayer Networking",
      "Optimization & Profiling",
    ],
    importantNotes: [
      "Performance is critical in games.",
      "Player experience comes first.",
      "Prototype early and often.",
      "Understand frame budgets.",
    ],
    cheatSheets: [
      { name: "Unity C# Basics" },
      { name: "Vector Math" },
      { name: "Common Game Patterns" },
      { name: "Profiling Tools" },
    ],
    diagrams: [
      "Game Loop",
      "Entity Component System",
      "Scene Graph",
    ],
    relatedSkills: ["C#", "C++", "Graphics Programming"],
  },
  {
    id: "mobile",
    title: "Mobile App Development",
    icon: <Smartphone className="w-6 h-6" />,
    color: "from-blue-400 to-indigo-500",
    description:
      "Build native and cross-platform mobile applications.",
    learningPath: [
      "Mobile UI/UX Principles",
      "Swift / Kotlin or Flutter / React Native",
      "State Management",
      "Local Storage & Networking",
      "Push Notifications",
      "App Store Guidelines",
      "Performance & Battery Optimization",
      "Testing on Real Devices",
    ],
    importantNotes: [
      "Platform guidelines matter (Material vs Human Interface).",
      "Offline-first thinking is valuable.",
      "Battery and memory constraints are real.",
      "Test on multiple devices early.",
    ],
    cheatSheets: [
      { name: "Flutter Widgets" },
      { name: "React Native Components" },
      { name: "iOS Human Interface Guidelines" },
      { name: "Android Material Design" },
    ],
    diagrams: [
      "App Lifecycle",
      "Navigation Architecture",
      "Offline Sync Strategy",
    ],
    relatedSkills: ["Frontend", "UI/UX", "Cross-platform"],
  },
  {
    id: "nlp",
    title: "NLP Engineer",
    icon: <Brain className="w-6 h-6" />,
    color: "from-violet-500 to-purple-600",
    description:
      "Build systems that understand and generate human language.",
    learningPath: [
      "Linguistics Basics",
      "Text Preprocessing",
      "Classical NLP (NLTK, spaCy)",
      "Word Embeddings",
      "Transformers & Attention",
      "Hugging Face Ecosystem",
      "Fine-tuning LLMs",
      "Evaluation Metrics for NLP",
    ],
    importantNotes: [
      "Language is messy — expect edge cases.",
      "Evaluation is hard (BLEU, ROUGE have limits).",
      "Domain adaptation is often necessary.",
      "Ethics and bias are critical concerns.",
    ],
    cheatSheets: [
      { name: "spaCy Pipeline" },
      { name: "Transformer Architecture" },
      { name: "Common NLP Metrics" },
      { name: "Prompt Engineering Patterns" },
    ],
    diagrams: [
      "Transformer Encoder-Decoder",
      "Attention Mechanism",
      "RAG Pipeline",
    ],
    relatedSkills: ["AI/ML", "LLMs", "Python"],
  },
  {
    id: "computer-vision",
    title: "Computer Vision Engineer",
    icon: <Cpu className="w-6 h-6" />,
    color: "from-cyan-500 to-blue-500",
    description:
      "Enable machines to interpret and understand visual information.",
    learningPath: [
      "Image Fundamentals",
      "OpenCV",
      "Classical CV Techniques",
      "CNNs",
      "Object Detection & Segmentation",
      "Modern Architectures (YOLO, ViT)",
      "Video Understanding",
      "Deployment & Optimization",
    ],
    importantNotes: [
      "Data annotation quality is crucial.",
      "Understand lighting, resolution, and domain shift.",
      "Real-time constraints change everything.",
      "Augmentation strategies matter a lot.",
    ],
    cheatSheets: [
      { name: "OpenCV Operations" },
      { name: "CNN Architectures" },
      { name: "Detection Metrics (mAP)" },
      { name: "Image Augmentations" },
    ],
    diagrams: [
      "CNN Feature Hierarchy",
      "Object Detection Pipeline",
      "U-Net Architecture",
    ],
    relatedSkills: ["Deep Learning", "AI/ML", "Python"],
  },
  {
    id: "mlops",
    title: "MLOps Engineer",
    icon: <GitBranch className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-600",
    description:
      "Operationalize machine learning models reliably in production.",
    learningPath: [
      "ML Fundamentals",
      "Experiment Tracking",
      "Model Versioning",
      "Feature Stores",
      "CI/CD for ML",
      "Model Serving",
      "Monitoring & Drift Detection",
      "Infrastructure for ML",
    ],
    importantNotes: [
      "Reproducibility is non-negotiable.",
      "Models decay — monitor continuously.",
      "Collaboration between data scientists and engineers is key.",
      "Start simple, then add complexity.",
    ],
    cheatSheets: [
      { name: "MLflow Commands" },
      { name: "Kubeflow Components" },
      { name: "Model Serving Patterns" },
      { name: "Drift Detection Methods" },
    ],
    diagrams: [
      "MLOps Lifecycle",
      "Feature Store Architecture",
      "Model Serving Options",
    ],
    relatedSkills: ["DevOps", "AI/ML", "Cloud"],
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    icon: <Database className="w-6 h-6" />,
    color: "from-amber-500 to-orange-600",
    description:
      "Build reliable data pipelines and infrastructure for analytics and ML.",
    learningPath: [
      "SQL Mastery",
      "Python / Scala",
      "ETL / ELT Concepts",
      "Data Modeling",
      "Batch & Stream Processing",
      "Data Warehouses & Lakes",
      "Orchestration (Airflow, Dagster)",
      "Data Quality & Governance",
    ],
    importantNotes: [
      "Data quality is everything.",
      "Design for scale from the beginning.",
      "Documentation and lineage are critical.",
      "Understand both batch and streaming paradigms.",
    ],
    cheatSheets: [
      { name: "SQL Window Functions" },
      { name: "Spark Transformations" },
      { name: "Airflow Operators" },
      { name: "Data Modeling Techniques" },
    ],
    diagrams: [
      "Medallion Architecture",
      "Lambda vs Kappa Architecture",
      "Data Pipeline Topology",
    ],
    relatedSkills: ["Big Data", "Cloud", "Analytics"],
  },
  {
    id: "cybersecurity",
    title: "Cyber Security",
    icon: <Shield className="w-6 h-6" />,
    color: "from-red-600 to-rose-700",
    description:
      "Protect systems, networks, and data from cyber threats.",
    learningPath: [
      "Networking Fundamentals",
      "Operating Systems Security",
      "Cryptography Basics",
      "Web Application Security (OWASP)",
      "Penetration Testing",
      "Security Operations",
      "Cloud Security",
      "Compliance & Governance",
    ],
    importantNotes: [
      "Security is a continuous process, not a product.",
      "Think like an attacker.",
      "Defense in depth is essential.",
      "Human factors are often the weakest link.",
    ],
    cheatSheets: [
      { name: "OWASP Top 10" },
      { name: "Common Ports & Protocols" },
      { name: "Linux Privilege Escalation" },
      { name: "Cryptography Algorithms" },
    ],
    diagrams: [
      "CIA Triad",
      "Attack Kill Chain",
      "Zero Trust Architecture",
    ],
    relatedSkills: ["Networking", "DevSecOps", "Cloud"],
  },
  {
    id: "product-manager",
    title: "Product Manager",
    icon: <Users className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
    description:
      "Define product vision, strategy, and roadmap to deliver value.",
    learningPath: [
      "Product Discovery",
      "User Research",
      "Prioritization Frameworks",
      "Roadmapping",
      "Metrics & Analytics",
      "Stakeholder Management",
      "Agile & Delivery",
      "Go-to-Market Basics",
    ],
    importantNotes: [
      "Focus on outcomes, not outputs.",
      "Talk to users regularly.",
      "Say no more often than yes.",
      "Data informs decisions, it doesn’t make them.",
    ],
    cheatSheets: [
      { name: "RICE / ICE Prioritization" },
      { name: "Jobs-to-be-Done" },
      { name: "AARRR Metrics" },
      { name: "User Story Mapping" },
    ],
    diagrams: [
      "Product Development Lifecycle",
      "Opportunity Solution Tree",
      "Impact Mapping",
    ],
    relatedSkills: ["UX", "Business Analysis", "Strategy"],
  },
  {
    id: "ui-designer",
    title: "UI Designer",
    icon: <Layout className="w-6 h-6" />,
    color: "from-violet-400 to-purple-500",
    description:
      "Craft visually appealing and consistent user interfaces.",
    learningPath: [
      "Design Fundamentals",
      "Typography & Color Theory",
      "Layout & Spacing",
      "Design Systems",
      "Figma Mastery",
      "Component Libraries",
      "Responsive & Adaptive Design",
      "Handoff to Developers",
    ],
    importantNotes: [
      "Consistency builds trust.",
      "Less is often more.",
      "Design for real content, not placeholders.",
      "Collaborate closely with developers.",
    ],
    cheatSheets: [
      { name: "Typography Scale" },
      { name: "Color Contrast (WCAG)" },
      { name: "Spacing Systems" },
      { name: "Figma Shortcuts" },
    ],
    diagrams: [
      "Design System Hierarchy",
      "Atomic Design",
      "Responsive Breakpoints",
    ],
    relatedSkills: ["UX", "Frontend", "Visual Design"],
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    icon: <Users className="w-6 h-6" />,
    color: "from-indigo-400 to-blue-500",
    description:
      "Design meaningful and usable experiences for users.",
    learningPath: [
      "User Research Methods",
      "Information Architecture",
      "Wireframing & Prototyping",
      "Usability Testing",
      "Interaction Design",
      "Accessibility",
      "Journey Mapping",
      "Design Thinking",
    ],
    importantNotes: [
      "You are not the user.",
      "Test early and often.",
      "Empathy is a skill you practice.",
      "Business goals and user needs must align.",
    ],
    cheatSheets: [
      { name: "Research Methods Matrix" },
      { name: "Heuristic Evaluation" },
      { name: "Usability Heuristics (Nielsen)" },
      { name: "Persona Templates" },
    ],
    diagrams: [
      "Double Diamond Process",
      "User Journey Map",
      "Information Architecture Tree",
    ],
    relatedSkills: ["UI", "Product", "Research"],
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    icon: <FileText className="w-6 h-6" />,
    color: "from-teal-400 to-emerald-500",
    description:
      "Bridge business needs and technical solutions through analysis.",
    learningPath: [
      "Requirements Gathering",
      "Process Modeling",
      "Stakeholder Analysis",
      "Data Analysis Basics",
      "Documentation Standards",
      "Agile BA Practices",
      "Solution Evaluation",
      "Change Management",
    ],
    importantNotes: [
      "Clarity prevents costly rework.",
      "Ask ‘why’ repeatedly.",
      "Document decisions and assumptions.",
      "Facilitate, don’t dictate.",
    ],
    cheatSheets: [
      { name: "Requirement Types" },
      { name: "BPMN Basics" },
      { name: "MoSCoW Prioritization" },
      { name: "Stakeholder Matrix" },
    ],
    diagrams: [
      "Business Process Flow",
      "Use Case Diagram",
      "Requirements Traceability",
    ],
    relatedSkills: ["Product", "Data Analysis", "Communication"],
  },
  {
    id: "crm-developer",
    title: "CRM Developer",
    icon: <Users className="w-6 h-6" />,
    color: "from-blue-500 to-indigo-600",
    description:
      "Customize and extend CRM platforms like Salesforce, Dynamics, or HubSpot.",
    learningPath: [
      "CRM Fundamentals",
      "Platform-specific Development (Apex, C#, etc.)",
      "Data Model Design",
      "Automation & Workflows",
      "Integrations",
      "Security & Sharing Models",
      "Reporting & Dashboards",
      "AppExchange / Marketplace",
    ],
    importantNotes: [
      "Understand the business process deeply.",
      "Governor limits are real constraints.",
      "Declarative first, code second.",
      "Data integrity is critical.",
    ],
    cheatSheets: [
      { name: "Salesforce Objects" },
      { name: "Apex Triggers Best Practices" },
      { name: "SOQL" },
      { name: "Sharing Rules" },
    ],
    diagrams: [
      "CRM Data Model",
      "Automation Hierarchy",
      "Integration Patterns",
    ],
    relatedSkills: ["Salesforce", "Business Analysis", "Integration"],
  },
  {
    id: "robotics",
    title: "Robotics Engineer",
    icon: <Bot className="w-6 h-6" />,
    color: "from-gray-600 to-slate-700",
    description:
      "Design, build, and program intelligent robotic systems.",
    learningPath: [
      "Mechanics & Kinematics",
      "Electronics & Sensors",
      "Control Systems",
      "ROS (Robot Operating System)",
      "Computer Vision for Robots",
      "Path Planning",
      "Simulation (Gazebo, etc.)",
      "Hardware Integration",
    ],
    importantNotes: [
      "Simulation saves time and money.",
      "Real-world physics is unforgiving.",
      "Safety is paramount.",
      "Interdisciplinary knowledge is required.",
    ],
    cheatSheets: [
      { name: "ROS Commands" },
      { name: "Transformation Matrices" },
      { name: "PID Tuning" },
      { name: "Sensor Types" },
    ],
    diagrams: [
      "Robot Control Loop",
      "Kinematic Chain",
      "ROS Node Architecture",
    ],
    relatedSkills: ["Embedded", "AI", "Mechanical"],
  },
  {
    id: "iot",
    title: "IoT Engineer",
    icon: <Cpu className="w-6 h-6" />,
    color: "from-lime-500 to-green-600",
    description:
      "Connect physical devices to the internet and build intelligent systems.",
    learningPath: [
      "Embedded Systems Basics",
      "Microcontrollers (ESP32, Arduino, etc.)",
      "Sensors & Actuators",
      "Communication Protocols (MQTT, CoAP, HTTP)",
      "Edge Computing",
      "Cloud IoT Platforms",
      "Security for IoT",
      "Data Pipelines from Devices",
    ],
    importantNotes: [
      "Power consumption is a first-class constraint.",
      "Security cannot be an afterthought.",
      "Network reliability varies wildly.",
      "Design for intermittent connectivity.",
    ],
    cheatSheets: [
      { name: "MQTT Topics & QoS" },
      { name: "ESP32 Pinout" },
      { name: "Common Sensors" },
      { name: "IoT Security Checklist" },
    ],
    diagrams: [
      "IoT Architecture Layers",
      "Device-to-Cloud Flow",
      "Edge vs Cloud Processing",
    ],
    relatedSkills: ["Embedded", "Cloud", "Networking"],
  },
  {
    id: "gen-ai",
    title: "Gen AI Engineer",
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-fuchsia-500 to-pink-600",
    description:
      "Build applications powered by generative AI and large language models.",
    learningPath: [
      "LLM Fundamentals",
      "Prompt Engineering",
      "RAG (Retrieval Augmented Generation)",
      "Fine-tuning & Adapters",
      "Agents & Tool Use",
      "Evaluation of Generative Systems",
      "Safety & Guardrails",
      "Production Deployment",
    ],
    importantNotes: [
      "Hallucinations are a feature, not a bug — manage them.",
      "Evaluation is still an unsolved problem.",
      "Cost and latency matter at scale.",
      "Human-in-the-loop is often necessary.",
    ],
    cheatSheets: [
      { name: "Prompt Patterns" },
      { name: "RAG Architecture Options" },
      { name: "Token Management" },
      { name: "Common Evaluation Metrics" },
    ],
    diagrams: [
      "RAG Pipeline",
      "Agent Loop",
      "LLM Application Architecture",
    ],
    relatedSkills: ["AI/ML", "NLP", "Software Engineering"],
  },
  {
    id: "prompt-engineer",
    title: "Prompt Engineer",
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-amber-400 to-orange-500",
    description:
      "Craft effective prompts and systems to get reliable results from LLMs.",
    learningPath: [
      "How LLMs Work (High Level)",
      "Prompt Design Principles",
      "Few-shot & Chain-of-Thought",
      "System Prompts & Role Play",
      "Evaluation of Outputs",
      "Prompt Chaining & Agents",
      "Safety & Jailbreak Awareness",
      "Tooling & Versioning Prompts",
    ],
    importantNotes: [
      "Prompts are code — version them.",
      "Specificity usually beats vagueness.",
      "Test across different models.",
      "Understand model limitations.",
    ],
    cheatSheets: [
      { name: "Prompt Techniques Catalog" },
      { name: "Common Failure Modes" },
      { name: "Evaluation Rubrics" },
      { name: "System Prompt Templates" },
    ],
    diagrams: [
      "Prompt → Completion Flow",
      "Chain-of-Thought Structure",
      "Multi-step Agent Workflow",
    ],
    relatedSkills: ["Gen AI", "NLP", "Product"],
  },
  {
    id: "blockchain",
    title: "Blockchain Developer",
    icon: <Blocks className="w-6 h-6" />,
    color: "from-yellow-500 to-amber-600",
    description:
      "Build decentralized applications and smart contracts.",
    learningPath: [
      "Blockchain Fundamentals",
      "Cryptography Basics",
      "Ethereum & EVM",
      "Solidity",
      "Smart Contract Security",
      "Web3 Libraries (ethers.js, web3.js)",
      "Frontend Integration",
      "Layer 2 & Scaling Solutions",
    ],
    importantNotes: [
      "Immutability means bugs are permanent.",
      "Security audits are essential.",
      "Gas optimization matters.",
      "Understand economic incentives.",
    ],
    cheatSheets: [
      { name: "Solidity Syntax" },
      { name: "Common Vulnerabilities" },
      { name: "Ethers.js Basics" },
      { name: "Gas Optimization Tips" },
    ],
    diagrams: [
      "Blockchain Structure",
      "Transaction Lifecycle",
      "Smart Contract Architecture",
    ],
    relatedSkills: ["Cryptography", "Backend", "Security"],
  },
];

export default function RoadmapsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = roadmaps.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.relatedSkills.some((s) =>
        s.toLowerCase().includes(search.toLowerCase())
      )
  );

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Developer Roadmaps
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Structured learning paths for every major tech role. Explore
              skills, important notes, cheat sheets, and diagrams to guide your
              journey.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search roadmaps (e.g. Python, AI, DevOps...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((roadmap) => {
            const isExpanded = expandedId === roadmap.id;

            return (
              <div
                key={roadmap.id}
                className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                  isExpanded ? "md:col-span-2 xl:col-span-3" : ""
                }`}
              >
                {/* Card Header */}
                <button
                  onClick={() => toggle(roadmap.id)}
                  className="w-full text-left p-6 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${roadmap.color} flex items-center justify-center text-white shadow-lg`}
                  >
                    {roadmap.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold mb-1">
                      {roadmap.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {roadmap.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-gray-400">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                    {/* Learning Path */}
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        Learning Path
                      </h3>
                      <ol className="space-y-2">
                        {roadmap.learningPath.map((step, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm"
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-medium">
                              {i + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Important Notes */}
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Important Things to Keep in Mind
                      </h3>
                      <ul className="space-y-2">
                        {roadmap.importantNotes.map((note, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            <span className="text-amber-500 mt-1">•</span>
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cheat Sheets */}
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                        <FileText className="w-5 h-5 text-green-500" />
                        Cheat Sheets
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {roadmap.cheatSheets.map((sheet, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm border border-green-200 dark:border-green-800"
                          >
                            {sheet.name}
                            {sheet.url && (
                              <ExternalLink className="w-3.5 h-3.5" />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Diagrams / Sketches */}
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                        <GitBranch className="w-5 h-5 text-purple-500" />
                        Diagrams & Sketches
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {roadmap.diagrams.map((diagram, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center"
                          >
                            <div className="w-full h-24 mb-2 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
                              [Diagram Placeholder]
                            </div>
                            <p className="text-sm font-medium">{diagram}</p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        NB: We are working on it.
                      </p>
                    </div>

                    {/* Related Skills */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Related Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {roadmap.relatedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No roadmaps found matching “{search}”
            </p>
          </div>
        )}
      </section>

      {/* Footer note */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Keep Coding, Keep Creating ..❤️..
        </div>
      </footer>
    </div>
  );
}