/*course-learn/[courseId]/page.tsx*/
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

/* ═══════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════ */
type LessonType = 'video' | 'quiz' | 'article'
type LessonMeta = {
  title: string
  duration?: string
  type?: LessonType
  videoUrl?: string
  description?: string
}
type SectionData = { title: string; lessons: LessonMeta[] }
type CourseInfo = { label: string; hours: string; sections: SectionData[] }

/* ═══════════════════════════════════════════════════════════
   COURSE SYLLABI
═══════════════════════════════════════════════════════════ */
const COURSE_SYLLABI: Record<string, CourseInfo> = {
  'Complete-HTML-CSS': {
    label: 'Complete HTML / CSS', hours: '18 hrs',
    sections: [
      { title: 'HTML Essentials', lessons: [
        { title: '1.1 How Browsers Work & HTML Document Structure', duration: '8 min', type: 'video' },
        { title: '1.2 Semantic Tags - header, nav, main, section, article, footer', duration: '12 min', type: 'video' },
        { title: '1.3 Text Elements - Headings, Paragraphs, Lists, Blockquotes', duration: '15 min', type: 'video' },
        { title: '1.4 Links, Images, Video & Audio Embedding', duration: '20 min', type: 'video' },
        { title: '1.5 Forms - Input Types, Labels, Validation Attributes', duration: '10 min', type: 'video' },
        { title: '1.6 Tables - thead, tbody, colspan, rowspan', duration: '20 min', type: 'video' },
        { title: '1.7 Meta Tags & SEO Basics', duration: '20 min', type: 'video' },
        { title: 'Forms & Input Elements1.8 Accessibility - ARIA Roles & Alt Text Best Practices', duration: '20 min', type: 'video' },
      ]},
      { title: 'CSS Core', lessons: [
        { title: '2.1 Selectors - Universal, Class, ID, Attribute, Pseudo', duration: '18 min', type: 'video' },
        { title: '2.2 Box Model - margin, border, padding, content', duration: '15 min', type: 'video' },
        { title: '2.3 Display - block, inline, inline-block, none', duration: '12 min', type: 'video' },
        { title: '2.4 Positioning - static, relative, absolute, fixed, sticky', duration: '10 min', type: 'article' },
        { title: '2.5 Typography - Google Fonts, line-height, letter-spacing', duration: '20 min', type: 'video' },
        { title: '2.6 Colors - HEX, RGB, HSL & CSS Variables', duration: '20 min', type: 'video' },
        { title: '2.7 Backgrounds - Images, Gradients, Blend Modes', duration: '20 min', type: 'video' },
        { title: '2.8 Transitions & Animations (keyframes)', duration: '20 min', type: 'video' },
      ]},
      { title: 'Flexbox & Grid', lessons: [
        { title: '3.1 Flexbox - Container & Item Properties Mastery', duration: '30 min', type: 'video' },
        { title: '3.2 CSS Grid - Template Areas, fr Units & auto-fill', duration: '35 min', type: 'video' },
        { title: '3.3 Responsive Design - Mobile-First Approach', duration: '25 min', type: 'video' },
        { title: '3.4 Media Queries & Breakpoint Strategy', duration: '20 min', type: 'quiz' },
        { title: '3.5 Fluid Typography & Clamp()', duration: '20 min', type: 'video' },
      ]},
      { title: 'Advanced CSS', lessons: [
        { title: '4.1 CSS Custom Properties (Variables) & Theming', duration: '22 min', type: 'video' },
        { title: '4.2 Pseudo-classes & Pseudo-elements Deep Dive', duration: '18 min', type: 'video' },
        { title: '4.3 CSS Filters, Transforms & 3D Effects', duration: '60 min', type: 'video' },
        { title: '4.3 CSS Filters, Transforms & 3D Effects', duration: '45 min', type: 'video' },
        { title: '4.5 Dark Mode Implementation', duration: '20 min', type: 'video' },
        { title: '4.6 Performance - Critical CSS, Will-Change, Repaints', duration: '20 min', type: 'video' },
      ]},
      { title: 'Projects', lessons: [
        { title: '5.1 Personal Portfolio Website', duration: '22 min', type: 'video' },
        { title: '5.2 Responsive Landing Page (SaaS Style)', duration: '18 min', type: 'video' },
        { title: '5.3 CSS-Only Animated Navigation Menu', duration: '60 min', type: 'video' },
        { title: '5.4 E-Commerce Product Card Grid', duration: '45 min', type: 'video' },
        { title: 'Multiple Minor + Major Projects', duration: '60 min', type: 'video' },
      ]},
    ],
  },
'AI-Machine-learning': {
  label: 'AI / Machine Learning',
  hours: '78 hrs',
  sections: [

    {
      title: 'Foundations of Artificial Intelligence',
      lessons: [
        { title: '1.1 AI vs ML vs Deep Learning - The Big Picture', duration: '12 min', type: 'video' },
        { title: '1.2 History of Artificial Intelligence', duration: '10 min', type: 'video' },
        { title: '1.3 Real World Applications of AI', duration: '12 min', type: 'video' },
        { title: '1.4 Types of AI - Narrow AI vs General AI', duration: '10 min', type: 'video' },
        { title: '1.5 Understanding Data in AI Systems', duration: '16 min', type: 'video' },
        { title: '1.6 AI Tools & Ecosystem Overview', duration: '8 min', type: 'article' },
      ]
    },

    {
      title: 'Python for Machine Learning',
      lessons: [
        { title: '2.1 Python Environment Setup - Jupyter, Anaconda, Colab', duration: '15 min', type: 'video' },
        { title: '2.2 Python Refresher for ML - Variables, Loops, Functions', duration: '18 min', type: 'video' },
        { title: '2.3 NumPy - Arrays & Mathematical Operations', duration: '20 min', type: 'video' },
        { title: '2.4 Pandas - DataFrames & Data Manipulation', duration: '22 min', type: 'video' },
        { title: '2.5 Data Visualization with Matplotlib & Seaborn', duration: '20 min', type: 'video' },
        { title: '2.6 Working with Datasets in Python', duration: '20 min', type: 'video' },
      ]
    },

    {
      title: 'Mathematics for Machine Learning',
      lessons: [
        { title: '3.1 Linear Algebra Basics - Vectors & Matrices', duration: '25 min', type: 'video' },
        { title: '3.2 Matrix Operations & Transformations', duration: '20 min', type: 'video' },
        { title: '3.3 Probability Fundamentals', duration: '22 min', type: 'video' },
        { title: '3.4 Statistics - Mean, Variance & Distributions', duration: '18 min', type: 'video' },
        { title: '3.5 Calculus Basics - Derivatives & Gradients', duration: '20 min', type: 'video' },
        { title: '3.5 Gradient Descent Explained', duration: '20 min', type: 'video' },
      ]
    },

    {
      title: 'Data Preprocessing & Feature Engineering',
      lessons: [
        { title: '4.1 Understanding Real World Data', duration: '15 min', type: 'video' },
        { title: '4.2 Handling Missing Values', duration: '20 min', type: 'video' },
        { title: '4.3 Data Cleaning Techniques', duration: '18 min', type: 'video' },
        { title: '4.4 Encoding Categorical Variables', duration: '18 min', type: 'video' },
        { title: '4.5 Feature Scaling - Normalization & Standardization', duration: '20 min', type: 'video' },
        { title: '4.6 Feature Selection Techniques', duration: '20 min', type: 'video' },
        { title: '4.7 Splitting Data - Train, Validation & Test Sets', duration: '20 min', type: 'video' },
      ]
    },

    {
      title: 'Introduction to Machine Learning',
      lessons: [
        { title: '5.1 What is Machine Learning', duration: '10 min', type: 'video' },
        { title: '5.2 Types of ML - Supervised, Unsupervised, Reinforcement', duration: '15 min', type: 'video' },
        { title: '5.3 ML Workflow - Problem Framing to Deployment', duration: '18 min', type: 'video' },
        { title: '5.4 Bias vs Variance Tradeoff', duration: '15 min', type: 'video' },
        { title: '5.5 Overfitting vs Underfitting', duration: '15 min', type: 'video' },
        { title: '5.6 Model Training & Prediction', duration: '20 min', type: 'video' },
      ]
    },

    {
      title: 'Supervised Learning - Regression',
      lessons: [
        { title: '6.1 Introduction to Regression Models', duration: '30 min', type: 'video' },
        { title: '6.2 Linear Regression - Concepts & Implementation', duration: '25 min', type: 'video' },
        { title: '6.3 Multiple Linear Regression', duration: '25 min', type: 'video' },
        { title: '6.4 Polynomial Regression', duration: '20 min', type: 'video' },
        { title: '6.5 Regularization - Ridge & Lasso Regression', duration: '18 min', type: 'video' },
        { title: '6.6 Evaluating Regression Models', duration: '20 min', type: 'video' },
      ]
    },

    {
      title: 'Supervised Learning - Classification',
      lessons: [
        { title: '7.1 Introduction to Classification', duration: '25 min', type: 'video' },
        { title: '7.2 Logistic Regression', duration: '25 min', type: 'video' },
        { title: '7.3 K-Nearest Neighbors (KNN)', duration: '22 min', type: 'video' },
        { title: '7.4 Support Vector Machines (SVM)', duration: '25 min', type: 'video' },
        { title: '7.5 Random Forest Algorithm', duration: '25 min', type: 'video' },
        { title: '7.6 Random Forest Algorithm', duration: '18 min', type: 'video' },
        { title: '7.7 Naive Bayes Classifie', duration: '20 min', type: 'video' },
      ]
    },

    {
      title: 'Model Evaluation & Optimization',
      lessons: [
        { title: '8.1 Confusion Matrix', duration: '18 min', type: 'video' },
        { title: '8.2 Accuracy, Precision, Recall, F1 Score', duration: '20 min', type: 'video' },
        { title: '8.3 ROC Curve & AUC', duration: '18 min', type: 'video' },
        { title: '8.4 Cross Validation', duration: '18 min', type: 'video' },
        { title: '8.5 Hyperparameter Tuning', duration: '20 min', type: 'video' },
        { title: '8.6 Grid Search & Random Search', duration: '20 min', type: 'video' },
      ]
    },

    {
      title: 'Unsupervised Learning',
      lessons: [
        { title: '9.1 Introduction to Unsupervised Learning', duration: '12 min', type: 'video' },
        { title: '9.2 Clustering Concepts', duration: '20 min', type: 'video' },
        { title: '9.3 K-Means Clustering', duration: '22 min', type: 'video' },
        { title: '9.4 Hierarchical Clustering', duration: '20 min', type: 'video' },
        { title: '9.5 DBSCAN Algorithm', duration: '20 min', type: 'video' },
        { title: '9.6 Dimensionality Reduction', duration: '22 min', type: 'video' },
        { title: '9.7 Principal Component Analysis (PCA)', duration: '20 min', type: 'video' },
      ]
    },

    {
      title: 'Introduction to Deep Learning',
      lessons: [
        { title: '10.1 Neural Networks Fundamentals', duration: '18 min', type: 'video' },
        { title: '10.2 Artificial Neural Networks (ANN)', duration: '18 min', type: 'video' },
        { title: '10.3 Activation Functions', duration: '18 min', type: 'video' },
        { title: '10.4 Loss Functions', duration: '20 min', type: 'video' },
        { title: '10.5 Backpropagation Algorithm', duration: '18 min', type: 'video' },
        { title: '10.6 Introduction to TensorFlow & Keras', duration: '20 min', type: 'video' },
      ]
    },

    {
      title: 'Computer Vision',
      lessons: [
        { title: '11.1 Introduction to Computer Vision', duration: '25 min', type: 'video' },
        { title: '11.2 Image Processing Basics', duration: '20 min', type: 'video' },
        { title: '11.3 Convolutional Neural Networks (CNN)', duration: '20 min', type: 'video' },
        { title: '11.4 Image Classification Models', duration: '25 min', type: 'video' },
        { title: '11.5 Object Detection Concepts', duration: '30 min', type: 'video' },
        { title: '11.6 Real World Computer Vision Applications', duration: '20 min', type: 'video' },
      ]
    },

    {
      title: 'Natural Language Processing (NLP)',
      lessons: [
        { title: '12.1 Introduction to NLP', duration: '18 min', type: 'video' },
        { title: '12.2 Text Preprocessing Techniques', duration: '20 min', type: 'video' },
        { title: '12.3 Tokenization & Stopwords', duration: '30 min', type: 'video' },
        { title: '12.4 Stemming & Lemmatization', duration: '35 min', type: 'video' },
        { title: '12.5 TF-IDF Vectorization', duration: '20 min', type: 'video' },
        { title: '12.6 Word Embeddings', duration: '20 min', type: 'video' },
        { title: '12.7 Sentiment Analysis Models', duration: '20 min', type: 'video' },
      ]
    },

    {
      title: 'Reinforcement Learning',
      lessons: [
        { title: '13.1 Introduction to Reinforcement Learning', duration: '20 min', type: 'video' },
        { title: '13.2 Agents, Environment & Rewards', duration: '18 min', type: 'video' },
        { title: '13.3 Markov Decision Process', duration: '22 min', type: 'video' },
        { title: '13.4 Q-Learning Algorithm', duration: '25 min', type: 'video' },
        { title: '13.5 Deep Reinforcement Learning', duration: '20 min', type: 'video' },
        { title: '13.6 Real World RL Applications', duration: '20 min', type: 'video' },
      ]
    },

    {
      title: 'MLOps & Deployment',
      lessons: [
        { title: '14.1 Saving & Loading ML Models', duration: '18 min', type: 'video' },
        { title: '14.2 Building APIs with FastAPI / Flask', duration: '25 min', type: 'video' },
        { title: '14.3 Deploying ML Models on Cloud', duration: '25 min', type: 'video' },
        { title: '14.4 Docker Basics for ML', duration: '22 min', type: 'video' },
        { title: '14.5 Model Monitoring & Maintenance', duration: '60 min', type: 'video' },
        { title: '14.6 CI/CD for Machine Learning', duration: '20 min', type: 'video' },
      ]
    },
    
    {
      title: 'Advanced AI Topics',
      lessons: [
        { title: '15.1 Introduction to Generative AI', duration: '20 min', type: 'video' },
        { title: '15.2 Transformers Architecture', duration: '18 min', type: 'video' },
        { title: '15.3 Large Language Models (LLMs)', duration: '22 min', type: 'video' },
        { title: '15.4 Prompt Engineering', duration: '30 min', type: 'video' },
        { title: '15.5 Explainable AI (XAI)', duration: '20 min', type: 'video' },
        { title: '15.6 AI Ethics & Responsible AI', duration: '20 min', type: 'video' },
      ]
    },
        {
      title: 'Projects',
      lessons: [
        { title: '16.0 Multiple Major + Minor Projects', duration: '200 min', type: 'video' },
      ]
    }

  ],
},
  'Data-Science': {
    label: 'Data Science', hours: '24 hrs',
    sections: [
      { title: 'Data Science Ecosystem', lessons: [
        { title: '1.1 Data Science Roles - Analyst vs Scientist vs Engineer', duration: '8 min', type: 'video' },
        { title: '1.2 The Data Science Workflow (CRISP-DM)', duration: '12 min', type: 'video' },
        { title: '1.3 Tools Overview - Python, SQL, Tableau, Power BI', duration: '25 min', type: 'video' },
        { title: '1.4 Setting Up Your Data Science Environment', duration: '35 min', type: 'video' },
      ]},
      { title: 'SQL for Data Science', lessons: [
        { title: '2.1 SQL Basics - SELECT, WHERE, ORDER BY, LIMIT', duration: '30 min', type: 'video' },
        { title: '2.2 Joins - INNER, LEFT, RIGHT, FULL, SELF', duration: '28 min', type: 'video' },
        { title: '2.3 Aggregations - GROUP BY, HAVING, Window Functions', duration: '22 min', type: 'video' },
        { title: '2.4 Subqueries & CTEs (Common Table Expressions)', duration: '12 min', type: 'quiz' },
        { title: '2.5 SQL for EDA - Finding Outliers, Distributions', duration: '22 min', type: 'video' },
        { title: '2.6 Connecting SQL to Python (SQLAlchemy, psycopg2)', duration: '22 min', type: 'video' },
      ]},
      { title: 'Exploratory Data Analysis', lessons: [
        { title: '3.1 Data Collection - APIs, Web Scraping, Public Datasets', duration: '25 min', type: 'video' },
        { title: '3.2 Data Cleaning Pipeline (Real-World Messy Data)', duration: '20 min', type: 'video' },
        { title: '3.3 Univariate & Bivariate Analysis', duration: '18 min', type: 'video' },
        { title: '3.4 Feature Engineering & Selection', duration: '15 min', type: 'article' },
        { title: '3.5 Outlier Detection & Treatment', duration: '22 min', type: 'video' },
        { title: '3.6 Handling Imbalanced Datasets (SMOTE, Undersampling)', duration: '22 min', type: 'video' },
      ]},
      { title: 'Predictive Modeling', lessons: [
        { title: '4.1 Regression Models - Linear, Polynomial, Ridge, Lasso', duration: '30 min', type: 'video' },
        { title: '4.2 Classification Models & Threshold Tuning', duration: '25 min', type: 'video' },
        { title: '4.3 Ensemble Methods - Gradient Boosting, Stacking', duration: '35 min', type: 'video' },
        { title: '4.4 Time-Series Forecasting - ARIMA, SARIMA, Prophet', duration: '60 min', type: 'video' },
        { title: '4.5 A/B Testing & Causal Inference', duration: '22 min', type: 'video' },
      ]},
      { title: 'Visualization & Reporting', lessons: [
        { title: '5.1 Tableau - Dashboards, Calculated Fields, LOD Expressions', duration: '30 min', type: 'video' },
        { title: '5.2 Power BI - DAX, Reports & Service Publishing', duration: '25 min', type: 'video' },
        { title: '5.3 Storytelling with Data - Presentation Frameworks', duration: '35 min', type: 'video' },
        { title: '5.4 Building Automated Reports with Python', duration: '60 min', type: 'video' },
      ]},
      { title: 'Big Data & Cloud', lessons: [
        { title: '6.1 Big Data Concepts - Hadoop, Spark Basics', duration: '30 min', type: 'video' },
        { title: '6.2 PySpark - DataFrames & ML Pipeline', duration: '25 min', type: 'video' },
        { title: '6.3 Cloud Platforms - AWS S3, GCP BigQuery, Azure', duration: '35 min', type: 'video' },
        { title: '6.4 Building a Data Science Portfolio -- 5+ Project Ideas', duration: '60 min', type: 'video' },
      ]},
    ],
  },
  'Python-DS': {
    label: 'Python for Data Science', hours: '20 hrs',
    sections: [
      { title: 'Module 1: Python Foundations', lessons: [
        { title: '1.1 Python Setup & Environment (Anaconda, Jupyter, VS Code)', duration: '12 min', type: 'video' },
        { title: '1.2 Variables, Data Types & Type Casting', duration: '15 min', type: 'video' },
        { title: '1.3 Operators & Expressions', duration: '18 min', type: 'video' },
        { title: '1.4 Control Flow - if/elif/else, match-case', duration: '22 min', type: 'video' },
        { title: '1.5 Loops - for, while, break, continue, pass', duration: '10 min', type: 'video' },
        { title: '1.6 Functions, *args/**kwargs & Lambda', duration: '18 min', type: 'video' },
        { title: '1.7 List, Tuple, Set & Dictionary Mastery', duration: '20 min', type: 'video' },
        { title: '1.8 File I/O & Exception Handling', duration: '12 min', type: 'video' },
      ]},
      { title: 'Module 2: NumPy & Pandas', lessons: [
        { title: '2.1 NumPy Arrays, Indexing & Slicing', duration: '18 min', type: 'video' },
        { title: '2.2 Broadcasting, Vectorized Ops & Linear Algebra', duration: '15 min', type: 'video' },
        { title: '2.3 Pandas Series & DataFrame Creation', duration: '12 min', type: 'video' },
        { title: '2.4 Data Cleaning - Missing Values, Duplicates, Outliers', duration: '20 min', type: 'article' },
        { title: '2.5 Merging, Joining, GroupBy & Pivot Tables', duration: '19 min', type: 'video' },
        { title: '2.6 Time-Series Analysis with DatetimeIndex', duration: '14 min', type: 'video' },
        { title: '2.7 Reading CSV, Excel, JSON & SQL into DataFrames', duration: '20 min', type: 'article' },
      ]},
      { title: 'Module 3: Data Visualization', lessons: [
        { title: '3.1 Matplotlib - Line, Bar, Scatter, Histogram, Pie', duration: '28 min', type: 'video' },
        { title: '3.2 Seaborn - Heatmaps, Pair Plots, Distribution Plots', duration: '35 min', type: 'video' },
        { title: '3.3 Plotly - Interactive Dashboards', duration: '20 min', type: 'video' },
        { title: '3.4 Storytelling with Data & Chart Best Practices', duration: '18 min', type: 'video' },
      ]},
      { title: 'Module 4: Statistics & Probability', lessons: [
        { title: '4.1 Descriptive Statistics - Mean, Median, Mode, Std Dev', duration: '30 min', type: 'video' },
        { title: '4.2 Probability Theory & Distributions (Normal, Binomial, Poisson)', duration: '25 min', type: 'video' },
        { title: '4.3 Hypothesis Testing : t-test, chi-square, ANOVA', duration: '45 min', type: 'video' },
        { title: '4.4 Correlation vs Causation', duration: '17 min', type: 'video' },
        { title: '4.5 Central Limit Theorem & Confidence Intervals', duration: '15 min', type: 'quiz' },
      ]},
        { title: 'Module 5: Machine Learning Basics', lessons: [
        { title: '5.1 Scikit-Learn Pipeline & Data Preprocessing', duration: '34 min', type: 'video' },
        { title: '5.2 Linear & Logistic Regression', duration: '45 min', type: 'video' },
        { title: '5.3 Decision Trees & Random Forests', duration: '40 min', type: 'video' },
        { title: '5.4 K-Means Clustering & PCA', duration: '17 min', type: 'video' },
        { title: '5.5 Model Evaluation - Accuracy, Precision, Recall, F1, ROC', duration: '15 min', type: 'quiz' },
        { title: '5.6 Cross-Validation & Hyperparameter Tuning (GridSearchCV)', duration: '15 min', type: 'quiz' },
      ]},
        { title: 'Module 6: Capstone Projects', lessons: [
        { title: '6.1 EDA on Real-World Dataset (Kaggle)', duration: '30 min', type: 'video' },
        { title: '6.2 Sales Prediction Dashboard', duration: '28 min', type: 'video' },
        { title: '6.3 Customer Segmentation Project', duration: '43 min', type: 'video' },
        { title: '6.4 Portfolio Deployment on GitHub', duration: '18 min', type: 'video' },
        { title: '6.5 More Multiple Minor & Major Projrcts', duration: '15 min', type: 'video' },
      ]},
    ],
  },
  'OOP-With-Java': {
    label: 'OOP with Java', hours: '22 hrs',
    sections: [
      { title: 'Module 1: Java Basics', lessons: [
        { title: '1.1 JDK Installation, JVM & JRE Architecture', duration: '10 min', type: 'video' },
        { title: '1.2 Data Types, Variables & Type Conversion', duration: '15 min', type: 'video' },
        { title: '1.3 Operators, Control Flow & Loops', duration: '18 min', type: 'video' },
        { title: '1.4 Arrays - 1D, 2D & Jagged Arrays', duration: '20 min', type: 'video' },
        { title: '1.5 Methods, Recursion & Method Overloading', duration: '18 min', type: 'video' },
        { title: '1.6 String & StringBuilder Manipulation', duration: '10 min', type: 'video' },
      ]},
      { title: 'Module 2: Core OOP Concepts', lessons: [
        { title: '2.1 Classes, Objects & Constructors', duration: '25 min', type: 'video' },
        { title: '2.2 Encapsulation - Access Modifiers & Getters/Setters', duration: '18 min', type: 'video' },
        { title: '2.3 Inheritance - Single, Multilevel & Hierarchical', duration: '22 min', type: 'video' },
        { title: '2.4 Polymorphism - Method Overriding & Runtime Dispatch', duration: '20 min', type: 'video' },
        { title: '2.5 Abstraction - Abstract Classes vs Interfaces', duration: '18 min', type: 'video' },
        { title: '2.6 Static vs Instance Members & this / super Keywords', duration: '22 min', type: 'video' },
        { title: '2.7 final, instanceof & Object Class Methods', duration: '15 min', type: 'video' },
      ]},
      { title: 'Module 3: Advanced Java', lessons: [
        { title: '3.1 Exception Handling - try/catch/finally, Custom Exceptions', duration: '15 min', type: 'video' },
        { title: '3.2 Collections Framework - List, Set, Map, Queue', duration: '30 min', type: 'video' },
        { title: '3.3 Generics & Type Bounds', duration: '22 min', type: 'video' },
        { title: '3.4 Iterators & Enhanced for Loop', duration: '20 min', type: 'article' },
        { title: '3.5 Java 8 Features - Lambdas, Stream API, Optional', duration: '34 min', type: 'video' },
        { title: '3.6 File I/O - BufferedReader, FileWriter, NIO', duration: '29 min', type: 'video' },
        { title: '3.7 Multithreading & Concurrency Basics', duration: '22 min', type: 'quiz' },
      ]},
      { title: 'Module 4: Design Patterns', lessons: [
        { title: '4.1 SOLID Principles', duration: '25 min', type: 'video' },
        { title: '4.2 Singleton, Factory & Builder Patterns', duration: '30 min', type: 'video' },
        { title: '4.3 Observer & Strategy Patterns', duration: '60 min', type: 'video' },
        { title: '4.4 MVC Pattern with Java', duration: '20 min', type: 'quiz' },
      ]},
        { title: 'Module 5: Projects', lessons: [
        { title: '5.1 Bank Management System', duration: '28 min', type: 'video' },
        { title: '5.2 Library Management System', duration: '38 min', type: 'video' },
        { title: '5.3 Student Result Portal', duration: '60 min', type: 'video' },
        { title: '5.4 Mini E-Commerce Backend', duration: '28 min', type: 'video' },
        { title: 'Multiple Minor & Major Projects', duration: '60 min', type: 'video' },
      ]},
    ],
  },
  'Web-Dev': {
    label: 'Web Development', hours: '32 hrs',
    sections: [
      { title: 'Web Fundamentals', lessons: [
        { title: '1.1 How the Web Works - HTTP/HTTPS, DNS, Browsers', duration: '20 min', type: 'video' },
        { title: '1.2 HTML5 Structure & Semantic Markup', duration: '22 min', type: 'video' },
        { title: '1.3 CSS3 Foundations - Box Model, Flexbox, Grid', duration: '15 min', type: 'video' },
        { title: '1.4 Responsive Design & Mobile-First Workflow', duration: '15 min', type: 'video' },
        { title: '1.5 Git & GitHub - Version Control for Devs', duration: '15 min', type: 'video' },
      ]},
      { title: 'JavaScript Mastery', lessons: [
        { title: '2.1 JS Basics - Types, Variables (var/let/const), Scope', duration: '25 min', type: 'video' },
        { title: '2.2 Functions - Regular, Arrow, IIFE, Closures', duration: '20 min', type: 'video' },
        { title: '2.3 DOM Manipulation & Events', duration: '18 min', type: 'video' },
        { title: '2.4 Promises, Async/Await & Fetch API', duration: '20 min', type: 'video' },
        { title: '2.5 ES6+ - Destructuring, Spread, Modules, Optional Chaining', duration: '25 min', type: 'video' },
        { title: '2.6 Local Storage, Session Storage & Cookies', duration: '15 min', type: 'quiz' },
        { title: '2.7 Error Handling & Debugging in DevTools', duration: '15 min', type: 'video' },
      ]},
      { title: 'React.js', lessons: [
        { title: '3.1 React Fundamentals - JSX, Components & Props', duration: '20 min', type: 'video' },
        { title: '3.2 State Management - useState, useReducer', duration: '35 min', type: 'video' },
        { title: '3.3 useEffect, useMemo & Custom Hooks', duration: '28 min', type: 'video' },
        { title: '3.4 React Router v6 - Dynamic Routing & Params', duration: '18 min', type: 'video' },
        { title: '3.5 Context API vs Redux Toolkit', duration: '15 min', type: 'video' },
        { title: '3.6 React Query & Data Fetching Patterns', duration: '15 min', type: 'video' },
        { title: '3.7 Tailwind CSS Integration with React', duration: '15 min', type: 'video' },
      ]},
      { title: 'Node.js & Express Backend', lessons: [
        { title: '4.1 Node.js Architecture - Event Loop & Modules', duration: '30 min', type: 'video' },
        { title: '4.2 Express - Routing, Middleware & Error Handling', duration: '25 min', type: 'video' },
        { title: '4.3 REST API Design - CRUD with Proper Status Codes', duration: '90 min', type: 'video' },
        { title: '4.4 Authentication - JWT, bcrypt & Refresh Tokens', duration: '20 min', type: 'video' },
        { title: '4.5 MongoDB with Mongoose - Schema & CRUD', duration: '15 min', type: 'video' },
        { title: '4.6 SQL with PostgreSQL & Sequelize ORM', duration: '15 min', type: 'video' },
        { title: '4.7 File Upload - Multer & Cloudinary Integration', duration: '15 min', type: 'video' },
      ]},
      { title: 'DevOps & Deployment', lessons: [
        { title: '5.1 Environment Variables & Secrets Management', duration: '30 min', type: 'video' },
        { title: '5.2 Docker - Containerizing a MERN App', duration: '25 min', type: 'video' },
        { title: '5.3 CI/CD with GitHub Actions', duration: '90 min', type: 'video' },
        { title: '5.4 Deploying to Vercel, Render & Railway', duration: '20 min', type: 'video' },
        { title: '5.5 Domain, SSL & Production Checklist', duration: '15 min', type: 'video' },
      ]},
    { title: 'Capstone Projects', lessons: [
        { title: '6.1 Full-Stack Blog Platform (MERN)', duration: '30 min', type: 'video' },
        { title: '6.2 E-Commerce Website with Payment Gateway', duration: '125 min', type: 'video' },
        { title: '6.3 Real-Time Chat App (Socket.io)', duration: '90 min', type: 'video' },
        { title: '6.4 SaaS Dashboard with Authentication', duration: '20 min', type: 'video' },
        { title: 'MMultiple Major + Minor Projects', duration: '75 min', type: 'video' },
      ]},
    ],
  },
  'DSA': {
    label: 'DSA for Interviews', hours: '26 hrs',
    sections: [
      { title: 'Complexity & Problem Solving', lessons: [
        { title: '1.1 Big-O, Big-Ω, Big-Θ Notation', duration: '15 min', type: 'video' },
        { title: '1.2 Time vs Space Complexity Analysis', duration: '30 min', type: 'video' },
        { title: "1.3 Problem-Solving Framework - UMPIRE Method", duration: '22 min', type: 'video' },
        { title: '1.4 Choosing the Right Language for Interviews', duration: '15 min', type: 'quiz' },
      ]},
      { title: 'Arrays & Strings', lessons: [
        { title: '2.1 Two-Pointer Technique', duration: '28 min', type: 'video' },
        { title: '2.2 Sliding Window (Fixed & Variable)', duration: '20 min', type: 'video' },
        { title: '2.3 Prefix Sum & Difference Array', duration: '25 min', type: 'video' },
        { title: '2.4 Sorting Algorithms & Their Interview Use-Cases', duration: '18 min', type: 'video' },
        { title: '2.5 Hashing - HashMap & HashSet Patterns', duration: '18 min', type: 'video' },
        { title: '2.6 Anagram, Palindrome & Substring Problems', duration: '18 min', type: 'video' },
      ]},
      { title: 'Linked Lists & Stacks/Queues', lessons: [
        { title: '3.1 Singly & Doubly Linked List Operations', duration: '32 min', type: 'video' },
        { title: '3.2 Fast & Slow Pointer (Floyd Cycle)', duration: '25 min', type: 'video' },
        { title: '3.3 Reversing & Merging Linked Lists', duration: '22 min', type: 'video' },
        { title: '3.4 Stack - Monotonic Stack Patterns', duration: '40 min', type: 'video' },
        { title: '3.5 Queue, Deque & Priority Queue (Heap)', duration: '20 min', type: 'quiz' },
      ]},
      { title: 'Trees & Graphs', lessons: [
        { title: '4.1 Binary Trees - Traversals (BFS, DFS, Pre/In/Post)', duration: '30 min', type: 'video' },
        { title: '4.2 Binary Search Tree - Insert, Delete, Search', duration: '35 min', type: 'video' },
        { title: '4.3 AVL Trees & Red-Black Trees (Concept)', duration: '28 min', type: 'video' },
        { title: '4.4 Heaps - Min/Max Heap & Heap Sort', duration: '60 min', type: 'video' },
        { title: '4.5 Tries - Insert, Search & Word Problems', duration: '18 min', type: 'video' },
        { title: '4.6 Graph Representations - Adjacency Matrix/List', duration: '18 min', type: 'video' },
        { title: '4.7 BFS & DFS on Graphs - Islands, Components', duration: '18 min', type: 'video' },
        { title: '4.8 Dijkstra, Bellman-Ford & Floyd-Warshall', duration: '18 min', type: 'video' },
        { title: '4.9 Topological Sort & Union-Find (DSU)', duration: '18 min', type: 'video' },
      ]},
      { title: 'Dynamic Programming', lessons: [
        { title: '5.1 Memoization vs Tabulation', duration: '30 min', type: 'video' },
        { title: '5.2 1D DP - Fibonacci, Climbing Stairs, House Robber', duration: '35 min', type: 'video' },
        { title: '5.3 2D DP - Grid Paths, Edit Distance', duration: '28 min', type: 'video' },
        { title: '5.4 Knapsack Variants - 0/1, Unbounded, Fractional', duration: '60 min', type: 'video' },
        { title: '5.5 Longest Common Subsequence & Substring', duration: '18 min', type: 'video' },
        { title: '5.6 Interval DP & Partition Problems', duration: '18 min', type: 'video' },
      ]},
      { title: 'Interview Strategy', lessons: [
        { title: '6.1 Mock Interviews - FAANG Style Problems', duration: '30 min', type: 'video' },
        { title: '6.2 Behavioral Questions - STAR Method', duration: '35 min', type: 'video' },
        { title: '6.3 System Design Primer (for SDE-2+)', duration: '28 min', type: 'video' },
        { title: '6.4 LeetCode Patterns - Top 75 Problem Walkthrough', duration: '60 min', type: 'video' },
      ]},
    ],
  },
  'Linkedin-Setup': {
    label: 'Complete LinkedIn Setup', hours: '8 hrs',
    sections: [
      { title: 'Profile Foundations', lessons: [
        { title: '1.1 Choosing the Right Profile Photo & Banner', duration: '10 min', type: 'video' },
        { title: '1.2 Writing a Magnetic Headline (Formula & Examples)', duration: '12 min', type: 'video' },
        { title: '1.3 Crafting an About Section That Converts', duration: '15 min', type: 'video' },
        { title: '1.4 Featured Section - Pinning Posts, Links & Media', duration: '10 min', type: 'video' },
        { title: '1.5 Experience Section - STAR Format Bullet Points', duration: '12 min', type: 'video' },
        { title: '1.6 Education, Licenses & Certifications', duration: '15 min', type: 'video' },
        { title: '1.7 Skills Section - Top 5 Strategy & Endorsements', duration: '10 min', type: 'video' },
      ]},
      { title: 'LinkedIn SEO & Visibility', lessons: [
        { title: '2.1 How LinkedIn Algorithm Works in 2026', duration: '18 min', type: 'video' },
        { title: '2.2 Keyword Research for Your Niche', duration: '20 min', type: 'video' },
        { title: '2.3 Optimizing Every Section with Keywords', duration: '12 min', type: 'article' },
        { title: '2.4 Open to Work vs Open to Opportunities Settings', duration: '10 min', type: 'video' },
        { title: '2.5 LinkedIn SSI Score - What It Means & How to Raise It', duration: '10 min', type: 'video' },
      ]},
      { title: 'Content Strategy', lessons: [
        { title: '3.1 Content Pillars & Posting Consistency', duration: '10 min', type: 'video' },
        { title: '3.2 Post Formats - Text, Carousels, Video & Polls', duration: '15 min', type: 'video' },
        { title: '3.3 Hook Writing - 5 Proven Opening Formulas', duration: '12 min', type: 'video' },
        { title: '3.4 Using Storytelling to Drive Engagement', duration: '8 min', type: 'quiz' },
        { title: '3.5 Scheduling Tools - Buffer, Taplio, LinkedIn Native', duration: '12 min', type: 'video' },
        { title: '3.6 Hashtag Strategy & Optimal Post Timing', duration: '8 min', type: 'quiz' },
      ]},
      { title: 'Networking & Outreach', lessons: [
        { title: '4.1 Connection Request Templates That Get Accepted', duration: '15 min', type: 'video' },
        { title: '4.2 Cold Messaging Strategy for Jobs & Clients', duration: '12 min', type: 'video' },
        { title: '4.3 Building a Referral Network', duration: '8 min', type: 'article' },
        { title: '4.4 Engaging with Target Profiles & Companies', duration: '10 min', type: 'video' },
        { title: '4.5 LinkedIn Groups & Events Strategy', duration: '10 min', type: 'video' },
      ]},
      
     { title: 'Job Search & Personal Branding', lessons: [
        { title: '5.1 Applying via LinkedIn Easy Apply - Best Practices', duration: '18 min', type: 'video' },
        { title: '5.2 LinkedIn Premium - Is It Worth It?', duration: '17 min', type: 'video' },
        { title: '5.3 Getting Recommendations That Matter', duration: '9 min', type: 'article' },
        { title: '5.4 Personal Branding Roadmap - 90 Day Plan', duration: '10 min', type: 'video' },
        { title: '5.5 Tracking Metrics & Profile Analytics', duration: '10 min', type: 'video' },
      ]},
    ],
  },
  'Mastering-C-Language': {
    label: 'Mastering C Language', hours: '20 hrs',
    sections: [
      { title: 'C Fundamentals', lessons: [
        { title: '1.1 History of C, GCC Setup & First Program', duration: '8 min', type: 'video' },
        { title: '1.2 Data Types, Variables, Constants & Literals', duration: '15 min', type: 'video' },
        { title: '1.3 Operators - Arithmetic, Relational, Logical, Bitwise', duration: '12 min', type: 'video' },
        { title: '1.4 Control Flow - if/else, switch, Ternary', duration: '10 min', type: 'video' },
        { title: '1.5 Loops - for, while, do-while, goto', duration: '10 min', type: 'quiz' },
        { title: '1.6 Functions - Prototypes, Call by Value, Recursion', duration: '10 min', type: 'quiz' },
      ]},
      { title: 'Pointers & Memory', lessons: [
        { title: '2.1 Pointer Basics - Declaration, Dereferencing & Address Arithmetic', duration: '18 min', type: 'video' },
        { title: '2.2 Pointers & Arrays - Array Decay & Pointer Indexing', duration: '25 min', type: 'video' },
        { title: '2.3 Pointer to Pointer (Double Pointers)', duration: '22 min', type: 'video' },
        { title: '2.4 Function Pointers & Callbacks', duration: '18 min', type: 'video' },
        { title: '2.5 Dynamic Memory - malloc, calloc, realloc, free', duration: '10 min', type: 'quiz' },
        { title: '2.6 Memory Leaks & Dangling Pointers (Valgrind)', duration: '10 min', type: 'quiz' },
      ]},
      { title: 'Strings & Arrays', lessons: [
        { title: '3.1 Character Arrays vs String Literals', duration: '30 min', type: 'video' },
        { title: '3.2 String Functions - strlen, strcpy, strcat, strcmp', duration: '22 min', type: 'video' },
        { title: '3.3 2D Arrays & Multi-dimensional Arrays', duration: '20 min', type: 'video' },
        { title: '3.4 Array of Strings (Pointer Arrays)', duration: '15 min', type: 'article' },
      ]},
      { title: 'Structures & File I/O', lessons: [
        { title: '4.1 struct, union & Bit Fields', duration: '20 min', type: 'video' },
        { title: '4.2 Nested Structures & Structures with Pointers', duration: '18 min', type: 'video' },
        { title: '4.3 typedef & Enumerations', duration: '12 min', type: 'video' },
        { title: '4.4 File Handling - fopen, fread, fwrite, fseek', duration: '60 min', type: 'video' },
        { title: '4.5 Binary vs Text Files & Error Handling (errno)', duration: '12 min', type: 'quiz' },
      ]},
        { title: 'Advanced C', lessons: [
        { title: '5.1 Preprocessor Directives - #define, #include, #ifdef', duration: '18 min', type: 'video' },
        { title: '5.2 Macros vs Inline Functions', duration: '25 min', type: 'video' },
        { title: '5.3 Command-Line Arguments (argc/argv)', duration: '22 min', type: 'video' },
        { title: '5.4 Linked Lists - Singly, Doubly & Circular', duration: '18 min', type: 'video' },
        { title: '5.5 Stacks & Queues Implementation in C', duration: '10 min', type: 'quiz' },
        { title: '5.6 Sorting Algorithms - Bubble, Merge, Quick in C', duration: '10 min', type: 'quiz' },
      ]},
        { title: 'Projects', lessons: [
        { title: '6.1 Student Record System (File-Based)', duration: '18 min', type: 'video' },
        { title: '6.2 Mini Shell Implementation', duration: '25 min', type: 'video' },
        { title: '6.3 Matrix Calculator', duration: '22 min', type: 'video' },
        { title: '6.4 Phonebook Application with Dynamic Memory', duration: '18 min', type: 'video' },
        { title: 'Multiple Minor + Major Projects', duration: '60 min', type: 'video' },
      ]},
    ],
  },
}

function getSyllabus(courseId: string): CourseInfo {
  // 1. Exact match
  if (COURSE_SYLLABI[courseId]) return COURSE_SYLLABI[courseId]
  // 2. Case-insensitive exact match
  const id = courseId.toLowerCase().replace(/[\s_]+/g, '-')
  const exactCI = Object.entries(COURSE_SYLLABI).find(([k]) => k.toLowerCase() === id)
  if (exactCI) return exactCI[1]
  // 3. Fuzzy contains match (both sides lowercased)
  const fuzzy = Object.entries(COURSE_SYLLABI).find(([k]) => {
    const key = k.toLowerCase()
    return id.includes(key) || key.includes(id)
  })
  if (fuzzy) return fuzzy[1]
  return { label: 'Course', hours: '—', sections: [{ title: 'Getting Started', lessons: [{ title: 'Content coming soon', duration: '—', type: 'video' }] }] }
}

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════ */
const TYPE_META = {
  video:   { label: 'Video',   color: 'text-indigo-400',  bg: 'bg-indigo-500/10 border-indigo-500/25',   dot: 'bg-indigo-400'  },
  quiz:    { label: 'Quiz',    color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/25',     dot: 'bg-amber-400'   },
  article: { label: 'Article', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25', dot: 'bg-emerald-400' },
}
const tm = (t?: string) => TYPE_META[(t as LessonType) ?? 'video'] ?? TYPE_META.video

/* ═══════════════════════════════════════════════════════════
   ICON ATOMS
═══════════════════════════════════════════════════════════ */
const PlayIcon  = ({ s=18 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M5 4.5L19 12L5 19.5V4.5Z"/></svg>
const PauseIcon = ({ s=18 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1.5"/><rect x="15" y="4" width="4" height="16" rx="1.5"/></svg>
const CheckIcon = ({ s=12 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
const ChevronDown = ({ s=14 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
const CloseIcon = ({ s=14 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
const ArrowLeft = ({ s=16 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m0 0l7 7m-7-7l7-7" strokeLinecap="round"/></svg>
const ArrowRight = ({ s=16 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m0 0l-7-7m7 7l-7 7" strokeLinecap="round"/></svg>
const MenuIcon = ({ s=16 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/></svg>
const SearchIcon = ({ s=13 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/></svg>

/* ═══════════════════════════════════════════════════════════
   BACKGROUND
═══════════════════════════════════════════════════════════ */
function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#060410]">
      <motion.div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full opacity-35"
        style={{ background: 'radial-gradient(circle,#3b1d8a 0%,transparent 70%)' }}
        animate={{ scale:[1,1.12,1], x:[0,30,0], y:[0,-20,0] }}
        transition={{ duration:20, repeat:Infinity, ease:'easeInOut' }}/>
      <motion.div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle,#0e4f8a 0%,transparent 70%)' }}
        animate={{ scale:[1,1.18,1], x:[0,-40,0], y:[0,30,0] }}
        transition={{ duration:25, repeat:Infinity, ease:'easeInOut', delay:4 }}/>
      <motion.div className="absolute -bottom-1/4 left-1/3 w-1/2 h-1/2 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle,#6d1b7b 0%,transparent 70%)' }}
        animate={{ scale:[1,1.1,1], x:[0,20,0], y:[0,-15,0] }}
        transition={{ duration:18, repeat:Infinity, ease:'easeInOut', delay:8 }}/>
      <div className="absolute inset-0 opacity-[0.028]"
        style={{ backgroundImage:'linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)', backgroundSize:'48px 48px' }}/>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize:'256px' }}/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CIRCLE PROGRESS
═══════════════════════════════════════════════════════════ */
function CircleProgress({ pct, size=46 }: { pct:number; size?:number }) {
  const r = (size-6)/2, circ = 2*Math.PI*r
  return (
    <div className="relative flex items-center justify-center" style={{ width:size, height:size }}>
      <svg className="-rotate-90 absolute inset-0" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3"/>
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#cpg)" strokeWidth="3"
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset:circ }} animate={{ strokeDashoffset:circ-(pct/100)*circ }}
          transition={{ duration:1.4, ease:'easeOut', delay:0.5 }}/>
        <defs>
          <linearGradient id="cpg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a78bfa"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="text-[10px] font-bold text-indigo-300 font-mono z-10">{pct}%</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   LESSON ROW
═══════════════════════════════════════════════════════════ */
function LessonRow({ lesson, globalIndex, isActive, isCompleted, onClick }: {
  lesson:LessonMeta; globalIndex:number; isActive?:boolean; isCompleted?:boolean; onClick?:()=>void
}) {
  const meta = tm(lesson.type)
  return (
    <motion.button initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }}
      transition={{ delay:Math.min(globalIndex*0.02,0.4), duration:0.28 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 relative group
        ${isActive
          ? 'bg-gradient-to-r from-indigo-950/90 via-violet-950/70 to-purple-950/40 shadow-[0_0_24px_-6px_rgba(129,140,248,0.5)]'
          : 'hover:bg-white/[0.04] active:bg-white/[0.07]'}`}>
      {isActive && (
        <motion.div layoutId="lesson-bar" className="absolute left-0 inset-y-2 w-[3px] bg-gradient-to-b from-indigo-400 to-violet-500 rounded-r-full"/>
      )}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 transition-all
        ${isActive ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_0_12px_rgba(109,40,217,0.6)]'
          : isCompleted ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/40'
          : 'bg-white/[0.06] text-gray-500 group-hover:bg-white/[0.12] group-hover:text-gray-300'}`}>
        {isCompleted && !isActive ? <CheckIcon s={12}/> : globalIndex+1}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug truncate transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
          {lesson.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-[10px] font-semibold ${meta.color}`}>{meta.label}</span>
          {lesson.duration && <><span className="text-gray-700 text-[10px]">·</span><span className="text-[10px] text-gray-600">{lesson.duration}</span></>}
        </div>
      </div>
      {isActive && (
        <div className="flex items-end gap-[3px] shrink-0 h-4">
          {[0,1,2].map(i=>(
            <motion.div key={i} className="w-[3px] bg-indigo-400 rounded-full"
              animate={{ height:[3,12,3] }}
              transition={{ duration:0.8, repeat:Infinity, delay:i*0.18, ease:'easeInOut' }}/>
          ))}
        </div>
      )}
    </motion.button>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION ACCORDION
═══════════════════════════════════════════════════════════ */
function SectionAccordion({ section, sectionIndex, globalOffset, activeLessonIndex, completedLessons, onLessonClick }: {
  section:SectionData; sectionIndex:number; globalOffset:number
  activeLessonIndex:number; completedLessons:Set<number>; onLessonClick:(i:number)=>void
}) {
  const hasActive = activeLessonIndex >= globalOffset && activeLessonIndex < globalOffset+section.lessons.length
  const [open, setOpen] = useState(sectionIndex===0 || hasActive)
  const doneCount = section.lessons.filter((_,i) => completedLessons.has(globalOffset+i)).length
  const pct = Math.round((doneCount/section.lessons.length)*100)
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.012]">
      <button onClick={()=>setOpen(v=>!v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors text-left group">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-700/50 to-violet-700/40 border border-indigo-600/25 flex items-center justify-center shrink-0">
          <span className="text-[11px] font-bold text-indigo-300">{sectionIndex+1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-200 truncate">{section.title}</p>
          <p className="text-[11px] text-gray-600 mt-0.5">{doneCount}/{section.lessons.length} lessons</p>
        </div>
        {doneCount>0 && (
          <div className="w-10 h-1 bg-white/[0.07] rounded-full overflow-hidden shrink-0">
            <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8,ease:'easeOut'}}/>
          </div>
        )}
        <motion.div animate={{rotate:open?180:0}} transition={{duration:0.25}}
          className="text-gray-600 group-hover:text-gray-400 transition-colors shrink-0">
          <ChevronDown/>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}}
            exit={{height:0,opacity:0}} transition={{duration:0.3,ease:[0.22,1,0.36,1]}}
            className="overflow-hidden border-t border-white/[0.04]">
            <div className="py-1.5 px-1.5">
              {section.lessons.map((lesson,i)=>{
                const gi=globalOffset+i
                return <LessonRow key={i} lesson={lesson} globalIndex={gi}
                  isActive={activeLessonIndex===gi} isCompleted={completedLessons.has(gi)}
                  onClick={()=>onLessonClick(gi)}/>
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   VIDEO PLAYER
═══════════════════════════════════════════════════════════ */
function VideoPlayer({ lesson, lessonIndex, totalLessons, onNext, onPrev, onComplete }: {
  lesson:LessonMeta; lessonIndex:number; totalLessons:number
  onNext:()=>void; onPrev:()=>void; onComplete:()=>void
}) {
  const [playing, setPlaying]           = useState(false)
  const [progress, setProgress]         = useState(0)
  const [volume, setVolume]             = useState(75)
  const [muted, setMuted]               = useState(false)
  const [speed, setSpeed]               = useState(1)
  const [showSpeed, setShowSpeed]       = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [hovered, setHovered]           = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const timerRef  = useRef<ReturnType<typeof setTimeout>|null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isVideo = (lesson.type ?? 'video') === 'video'
  const speeds  = [0.5, 0.75, 1, 1.25, 1.5, 2]

  useEffect(()=>{
    if(!playing) return
    const iv=setInterval(()=>{
      setProgress(p=>{
        if(p>=100){ clearInterval(iv); setPlaying(false); setJustCompleted(true); onComplete(); setTimeout(()=>setJustCompleted(false),3500); return 100 }
        return p+0.08*speed
      })
    },80)
    return ()=>clearInterval(iv)
  },[playing,speed,onComplete])

  const resetTimer = useCallback(()=>{
    setShowControls(true)
    if(timerRef.current) clearTimeout(timerRef.current)
    if(playing) timerRef.current=setTimeout(()=>setShowControls(false),3200)
  },[playing])

  useEffect(()=>{ resetTimer() },[playing,resetTimer])
  useEffect(()=>{ setPlaying(false); setProgress(0); setJustCompleted(false); setShowControls(true) },[lessonIndex])

  useEffect(()=>{
    const handler=()=>setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange',handler)
    return ()=>document.removeEventListener('fullscreenchange',handler)
  },[])

  const handleSeek=(e:React.MouseEvent<HTMLDivElement>)=>{
    const rect=e.currentTarget.getBoundingClientRect()
    setProgress(Math.max(0,Math.min(100,((e.clientX-rect.left)/rect.width)*100)))
  }
  const handleTouchSeek=(e:React.TouchEvent<HTMLDivElement>)=>{
    const rect=e.currentTarget.getBoundingClientRect()
    setProgress(Math.max(0,Math.min(100,((e.touches[0].clientX-rect.left)/rect.width)*100)))
  }
  const toggleFS=()=>{
    if(!document.fullscreenElement) containerRef.current?.requestFullscreen()
    else document.exitFullscreen()
  }
  const togglePlay=()=>setPlaying(p=>!p)

  return (
    <div ref={containerRef}
      className="relative w-full h-full bg-[#020108] overflow-hidden select-none"
      onMouseMove={resetTimer} onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>{ setHovered(false); setShowControls(true) }}
      onTouchStart={resetTimer}>

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]"
        style={{ backgroundImage:'repeating-linear-gradient(0deg,rgba(255,255,255,0.5) 0px,transparent 1px,transparent 3px)', backgroundSize:'100% 4px' }}/>

      {/* Ambient glow */}
      <motion.div className="absolute inset-0"
        animate={playing
          ? {background:'radial-gradient(ellipse 80% 70% at 50% 45%,rgba(67,27,175,0.38) 0%,rgba(4,2,14,0.97) 100%)'}
          : {background:'radial-gradient(ellipse 55% 50% at 50% 45%,rgba(35,18,80,0.55) 0%,rgba(4,2,14,1) 100%)'}}
        transition={{duration:0.7}}/>

      {/* ── Article / Quiz ── */}
      {!isVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border mb-8 ${tm(lesson.type).bg} ${tm(lesson.type).color}`}>
            <span className={`w-2 h-2 rounded-full ${tm(lesson.type).dot}`}/>{tm(lesson.type).label} Lesson
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-3 leading-tight max-w-lg">{lesson.title}</h3>
          <p className="text-gray-500 text-sm mb-10">{lesson.duration}</p>
          <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-[0_0_40px_rgba(109,40,217,0.5)] border border-indigo-400/30">
            Open {lesson.type==='article'?'Article':'Quiz'} →
          </motion.button>
        </div>
      )}

      {/* ── Video ── */}
      {isVideo && (
        <>
          {/* Pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            {[1,2,3].map(i=>(
              <motion.div key={i} className="absolute rounded-full border border-violet-500/15"
                style={{width:100+i*55,height:100+i*55}}
                animate={playing?{scale:[1,1.55],opacity:[0.3,0]}:{scale:1,opacity:0.05+i*0.02}}
                transition={{duration:2.2,repeat:Infinity,delay:i*0.5,ease:'easeOut'}}/>
            ))}
          </div>

          {/* Center play/pause tap zone */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center" onClick={togglePlay}>
            <AnimatePresence>
              {(!playing||hovered) && (
                <motion.div initial={{scale:0.7,opacity:0}} animate={{scale:1,opacity:1}}
                  exit={{scale:0.7,opacity:0}} transition={{duration:0.18}}>
                  <motion.div
                    className="flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600/90 to-violet-700/90 backdrop-blur-sm border border-white/25 cursor-pointer shadow-[0_0_80px_rgba(109,40,217,0.8)]"
                    style={{width:72,height:72}}
                    whileHover={{scale:1.1}} whileTap={{scale:0.88}}>
                    {playing ? <PauseIcon s={24}/> : <PlayIcon s={24}/>}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!playing && (
                <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  className="text-center mt-8 px-6 pointer-events-none">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-400/60 mb-2">Lesson {lessonIndex+1} of {totalLessons}</p>
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-tight line-clamp-2 mb-1">{lesson.title}</h3>
                  <p className="text-sm text-gray-500">{lesson.duration}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Playing waveform */}
          <AnimatePresence>
            {playing && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                className="absolute bottom-24 left-0 right-0 flex items-end justify-center gap-[3px] px-8 h-12 pointer-events-none z-20">
                {Array.from({length:44}).map((_,i)=>(
                  <motion.div key={i} className="w-[3px] rounded-t-full opacity-50"
                    style={{background:'linear-gradient(to top,#6366f1,#a78bfa)'}}
                    animate={{height:[3,Math.random()*28+4,3]}}
                    transition={{duration:0.7+Math.random()*0.8,repeat:Infinity,delay:i*0.02,ease:'easeInOut'}}/>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completion badge */}
          <AnimatePresence>
            {justCompleted && (
              <motion.div initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}}
                exit={{opacity:0,scale:1.3}} transition={{duration:0.4}}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-emerald-500/25 border border-emerald-500/50 flex items-center justify-center">
                  <CheckIcon s={28}/>
                </div>
                <p className="text-base font-bold text-emerald-400">Lesson Complete!</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls bar */}
          <AnimatePresence>
            {(showControls||!playing) && (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
                transition={{duration:0.18}}
                className="absolute bottom-0 left-0 right-0 z-30 px-3 sm:px-5 pb-3 pt-14"
                style={{background:'linear-gradient(to top,rgba(4,2,14,0.97) 0%,transparent 100%)'}}
                onClick={e=>e.stopPropagation()}>

                {/* Seek */}
                <div className="relative h-1.5 bg-white/10 rounded-full mb-3 cursor-pointer group/seek"
                  onClick={handleSeek} onTouchMove={handleTouchSeek}>
                  <div className="absolute h-full bg-white/10 rounded-full transition-all" style={{width:`${Math.min(100,progress+15)}%`}}/>
                  <div className="absolute h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all" style={{width:`${progress}%`}}/>
                  <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_rgba(139,92,246,0.9)] scale-0 group-hover/seek:scale-100 transition-transform" style={{left:`calc(${progress}% - 7px)`}}/>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Prev lesson */}
                    <motion.button whileTap={{scale:0.85}} onClick={onPrev} disabled={lessonIndex===0}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                    </motion.button>
                    {/* Play/Pause */}
                    <motion.button whileTap={{scale:0.85}} onClick={togglePlay} className="w-9 h-9 flex items-center justify-center text-white">
                      {playing ? <PauseIcon s={20}/> : <PlayIcon s={20}/>}
                    </motion.button>
                    {/* Next lesson */}
                    <motion.button whileTap={{scale:0.85}} onClick={onNext} disabled={lessonIndex>=totalLessons-1}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2.5-6l5.5 4V8l-5.5 4zM16 6h2v12h-2z"/></svg>
                    </motion.button>
                    {/* Volume (hidden on xs) */}
                    <div className="hidden sm:flex items-center gap-1.5">
                      <motion.button whileTap={{scale:0.85}} onClick={()=>setMuted(m=>!m)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        {muted||volume===0
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>}
                      </motion.button>
                      <input type="range" min="0" max="100" value={muted?0:volume}
                        onChange={e=>{setVolume(+e.target.value);setMuted(false)}}
                        className="w-14 h-1 accent-indigo-500 cursor-pointer"/>
                    </div>
                    {/* Time */}
                    <span className="text-[10px] text-gray-500 font-mono hidden sm:block">
                      {Math.floor(progress*0.6)}:{String(Math.floor((progress*36)%60)).padStart(2,'0')} / {lesson.duration||'--'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Speed */}
                    <div className="relative">
                      <motion.button whileTap={{scale:0.85}} onClick={()=>setShowSpeed(s=>!s)}
                        className="px-2 py-1 rounded-lg text-[11px] font-bold text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all">
                        {speed}×
                      </motion.button>
                      <AnimatePresence>
                        {showSpeed && (
                          <motion.div initial={{opacity:0,y:6,scale:0.95}} animate={{opacity:1,y:0,scale:1}}
                            exit={{opacity:0,y:6,scale:0.95}} transition={{duration:0.15}}
                            className="absolute bottom-full right-0 mb-2 py-1.5 rounded-xl border border-white/[0.1] bg-[#0e0b1e]/97 backdrop-blur-xl shadow-2xl z-50 min-w-[100px]">
                            {speeds.map(s=>(
                              <button key={s} onClick={()=>{setSpeed(s);setShowSpeed(false)}}
                                className={`block w-full px-4 py-1.5 text-xs text-left transition-colors
                                  ${speed===s?'text-indigo-400 bg-indigo-500/10':'text-gray-400 hover:text-white hover:bg-white/[0.06]'}`}>
                                {s}×{s===1&&' (Normal)'}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {/* Fullscreen */}
                    <motion.button whileTap={{scale:0.85}} onClick={toggleFS}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                      {isFullscreen
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   NOTES TAB
═══════════════════════════════════════════════════════════ */
function NotesTab({ lessonIndex }: { lessonIndex:number }) {
  const [notes, setNotes] = useState<Record<number,string>>({})
  const [saved, setSaved] = useState(false)
  const text = notes[lessonIndex] ?? ''
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000) }
  return (
    <div className="px-4 sm:px-5 py-5 max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Your Notes - Lesson {lessonIndex+1}</p>
        <AnimatePresence>
          {saved && (
            <motion.span initial={{opacity:0,x:6}} animate={{opacity:1,x:0}} exit={{opacity:0}}
              className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckIcon s={10}/> Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <textarea value={text} onChange={e=>setNotes(n=>({...n,[lessonIndex]:e.target.value}))}
        placeholder="Write key takeaways, questions, code snippets, or ideas for this lesson…"
        className="w-full h-44 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-gray-300 placeholder-gray-700 resize-none focus:outline-none focus:border-indigo-500/40 transition-colors leading-relaxed"/>
      <div className="flex items-center gap-2 mt-2.5">
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={save}
          className="px-4 py-2 rounded-xl bg-indigo-700/50 hover:bg-indigo-700/70 border border-indigo-500/30 text-xs font-bold text-indigo-300 transition-all">
          Save Notes
        </motion.button>
        {text && (
          <motion.button whileTap={{scale:0.97}} onClick={()=>setNotes(n=>({...n,[lessonIndex]:''}))}
            className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] text-xs font-bold text-gray-500 transition-all">
            Clear
          </motion.button>
        )}
      </div>
      <p className="text-[10px] text-gray-700 mt-3">Notes are saved per-lesson for this session.</p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR CONTENT (shared between desktop & mobile drawer)
═══════════════════════════════════════════════════════════ */
function SidebarInner({ syllabus, lessons, activeLesson, completedLessons, progress, onLessonClick }: {
  syllabus:CourseInfo; lessons:LessonMeta[]; activeLesson:number
  completedLessons:Set<number>; progress:number; onLessonClick:(i:number)=>void
}) {
  const [query, setQuery] = useState('')
  const results = query.trim().length>1
    ? lessons.reduce<Array<{lesson:LessonMeta;idx:number}>>((acc,l,i)=>{
        if(l.title.toLowerCase().includes(query.toLowerCase())) acc.push({lesson:l,idx:i})
        return acc
      },[])
    : []

  return (
    <>
      <div className="px-4 pt-5 pb-4 shrink-0 border-b border-white/[0.05]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Course Content</p>
          <span className="text-[11px] text-gray-600 font-mono">{lessons.length} lessons</span>
        </div>
        {/* Search */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"><SearchIcon/></span>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search lessons…"
            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-8 pr-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/40 transition-colors"/>
        </div>
        {/* Progress */}
        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{background:'linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7)'}}
            initial={{width:0}} animate={{width:`${progress}%`}} transition={{duration:1.2,ease:[0.22,1,0.36,1],delay:0.3}}/>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-[11px] text-gray-600">{completedLessons.size}/{lessons.length} completed</p>
          <p className="text-[11px] font-bold text-indigo-400">{progress}%</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 px-3 py-3 space-y-2">
        {query.trim().length>1 ? (
          results.length>0 ? <>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider px-1 mb-2">{results.length} result{results.length!==1&&'s'}</p>
            {results.map(({lesson,idx})=>(
              <LessonRow key={idx} lesson={lesson} globalIndex={idx}
                isActive={activeLesson===idx} isCompleted={completedLessons.has(idx)}
                onClick={()=>onLessonClick(idx)}/>
            ))}
          </> : <p className="text-center text-gray-600 text-sm py-10">No results found.</p>
        ) : (()=>{
          let off=0
          return syllabus.sections.map((s,si)=>{
            const co=off; off+=s.lessons.length
            return <SectionAccordion key={si} section={s} sectionIndex={si} globalOffset={co}
              activeLessonIndex={activeLesson} completedLessons={completedLessons} onLessonClick={onLessonClick}/>
          })
        })()}
        <div className="h-8"/>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN PLAYER
═══════════════════════════════════════════════════════════ */
function CoursePlayer({ courseId, courseData, router }: {
  courseId:string; courseData:any; router:ReturnType<typeof useRouter>
}) {
  const syllabus = getSyllabus(courseId)
  const firestoreLessons:any[] = courseData?.lessons || []

  const lessons:LessonMeta[] = syllabus.sections.flatMap((s)=>
    s.lessons.map((l,i)=>({
      ...l, ...(firestoreLessons[i]
        ? {videoUrl:firestoreLessons[i].videoUrl, description:firestoreLessons[i].description}
        : {}),
    }))
  )

  const [activeLesson, setActiveLesson]         = useState(0)
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set())
  const [sidebarOpen, setSidebarOpen]           = useState(true)
  const [mobileDrawer, setMobileDrawer]         = useState(false)
  const [activeTab, setActiveTab]               = useState<'overview'|'resources'|'notes'>('overview')
  const [celebrating, setCelebrating]           = useState(false)

  const currentLesson: LessonMeta = lessons[activeLesson];
  const progress = completedLessons.size===0 ? 0 : Math.round((completedLessons.size/lessons.length)*100)

  const currentSection = (()=>{
    let off=0
    for(const s of syllabus.sections){ if(activeLesson<off+s.lessons.length) return s.title; off+=s.lessons.length }
    return ''
  })()

  const goTo=(idx:number)=>{ setActiveLesson(idx); setMobileDrawer(false) }

  const markAndNext=()=>{
    setCompletedLessons(prev=>new Set([...prev,activeLesson]))
    if(activeLesson<lessons.length-1) setActiveLesson(i=>i+1)
    else { setCelebrating(true); setTimeout(()=>setCelebrating(false),4500) }
  }
  const goPrev=()=>{ if(activeLesson>0) setActiveLesson(i=>i-1) }

  const tabs = ['overview','resources','notes'] as const

  return (
    <div className="min-h-screen bg-[#060410] text-white flex flex-col overflow-hidden">
      <Background/>

      {/* ── CELEBRATION ── */}
      <AnimatePresence>
        {celebrating && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-md">
            <motion.div initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}}
              exit={{scale:1.2,opacity:0}} transition={{type:'spring',stiffness:180}}
              className="text-center px-10 py-12 rounded-3xl bg-[#0e0b20]/95 border border-indigo-500/30 shadow-[0_0_100px_rgba(109,40,217,0.5)] mx-4">
              <motion.div animate={{rotate:[0,-10,10,-10,10,0]}} transition={{duration:0.6,delay:0.3}} className="text-6xl mb-5">🎉</motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Course Complete!</h2>
              <p className="text-gray-400 text-sm mb-8">You finished <span className="text-indigo-300 font-semibold">{syllabus.label}</span></p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(109,40,217,0.5)]">
                  Certificate Unlocked
                </motion.button>
                <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}}
                  onClick={()=>setCelebrating(false)}
                  className="px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-gray-300 font-bold text-sm">
                  Back to Course
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <motion.header initial={{y:-70,opacity:0}} animate={{y:0,opacity:1}}
        transition={{duration:0.55,ease:[0.22,1,0.36,1]}}
        className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-5 h-[60px] sm:h-[64px] shrink-0"
        style={{background:'rgba(6,4,16,0.92)',backdropFilter:'blur(24px)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>

        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <motion.button whileHover={{x:-2}} whileTap={{scale:0.95}}
            onClick={()=>router.push('/my-batch')}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors font-medium group shrink-0">
            <ArrowLeft s={15}/>
            <span className="hidden sm:inline text-sm">My Batch</span>
          </motion.button>
          <div className="w-px h-5 bg-white/10 shrink-0"/>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white truncate max-w-[130px] sm:max-w-[200px] md:max-w-xs lg:max-w-sm">
              {courseData?.title||syllabus.label}
            </h1>
            <p className="text-[10px] text-gray-600 truncate hidden sm:block">{currentSection}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2.5">
            <CircleProgress pct={progress} size={44}/>
            <div className="hidden lg:block">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Progress</p>
              <p className="text-xs font-bold text-indigo-300">{completedLessons.size}/{lessons.length}</p>
            </div>
          </div>
          <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.96}} onClick={markAndNext}
            disabled={completedLessons.has(activeLesson)&&activeLesson>=lessons.length-1}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-800/70 to-teal-800/70 border border-emerald-600/30 text-xs font-bold text-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            <CheckIcon s={11}/> {completedLessons.has(activeLesson)?'Next':'Mark & Next'}
          </motion.button>
          {/* Mobile: drawer trigger */}
          <motion.button whileTap={{scale:0.9}} onClick={()=>setMobileDrawer(true)}
            className="sm:hidden w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
            <MenuIcon s={16}/>
          </motion.button>
          {/* Desktop: sidebar toggle */}
          <motion.button whileTap={{scale:0.9}} onClick={()=>setSidebarOpen(v=>!v)}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] items-center justify-center transition-colors">
            <MenuIcon s={16}/>
          </motion.button>
        </div>
      </motion.header>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileDrawer && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm sm:hidden"
              onClick={()=>setMobileDrawer(false)}/>
            <motion.aside initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}}
              transition={{duration:0.32,ease:[0.22,1,0.36,1]}}
              className="fixed right-0 top-0 bottom-0 z-[70] w-[88vw] max-w-[340px] flex flex-col sm:hidden"
              style={{background:'rgba(8,6,20,0.99)',backdropFilter:'blur(32px)',borderLeft:'1px solid rgba(255,255,255,0.07)'}}>
              <div className="flex items-center justify-between px-4 h-[60px] border-b border-white/[0.06] shrink-0">
                <p className="text-sm font-bold text-white">Course Content</p>
                <motion.button whileTap={{scale:0.9}} onClick={()=>setMobileDrawer(false)}
                  className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white">
                  <CloseIcon s={14}/>
                </motion.button>
              </div>
              <SidebarInner syllabus={syllabus} lessons={lessons} activeLesson={activeLesson}
                completedLessons={completedLessons} progress={progress} onLessonClick={goTo}/>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── BODY ── */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* ── MAIN ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden">

          {/* Video */}
          <div className="relative w-full bg-black shrink-0" style={{aspectRatio:'16/9', maxHeight:'65vh'}}>
            <AnimatePresence mode="wait">
              <motion.div key={activeLesson} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                transition={{duration:0.22}} className="absolute inset-0">
                <VideoPlayer lesson={currentLesson} lessonIndex={activeLesson} totalLessons={lessons.length}
                  onNext={markAndNext} onPrev={goPrev} onComplete={markAndNext}/>
              </motion.div>
            </AnimatePresence>

            {/* Lesson pill */}
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
              className="absolute top-3 left-3 z-40 flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[11px] font-semibold"
              style={{background:'rgba(14,10,36,0.88)',backdropFilter:'blur(10px)',border:'1px solid rgba(129,140,248,0.2)'}}>
              <span className={`w-1.5 h-1.5 rounded-full ${tm(currentLesson.type).dot}`}/>
              <span className="text-indigo-300">Lesson {activeLesson+1}</span>
              <span className="text-gray-600">/</span>
              <span className="text-gray-500">{lessons.length}</span>
            </motion.div>
          </div>

          {/* Info panel */}
          <div className="flex-1 min-h-0" style={{background:'rgba(8,6,18,0.99)',borderTop:'1px solid rgba(255,255,255,0.05)'}}>

            {/* Tabs */}
            <div className="flex items-center px-4 sm:px-5 pt-3 border-b border-white/[0.05] overflow-x-auto scrollbar-none">
              {tabs.map(tab=>(
                <button key={tab} onClick={()=>setActiveTab(tab)}
                  className={`relative px-4 py-2.5 text-xs font-bold capitalize whitespace-nowrap transition-colors
                    ${activeTab===tab?'text-indigo-300':'text-gray-600 hover:text-gray-400'}`}>
                  {tab}
                  {activeTab===tab && (
                    <motion.div layoutId="tab-line"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-full"/>
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={`${activeLesson}-${activeTab}`}
                initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                transition={{duration:0.22}}>

                {/* Overview */}
                {activeTab==='overview' && (
                  <div className="px-4 sm:px-5 py-5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${tm(currentLesson.type).bg} ${tm(currentLesson.type).color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${tm(currentLesson.type).dot}`}/>
                        {tm(currentLesson.type).label}
                      </span>
                      {currentLesson.duration && (
                        <span className="text-[11px] text-gray-600 flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 5v5.586l3.707 3.707-1.414 1.414L10 13.414V7h2z"/></svg>
                          {currentLesson.duration}
                        </span>
                      )}
                      {completedLessons.has(activeLesson) && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-900/40 border border-emerald-700/40 text-emerald-400">
                          <CheckIcon s={10}/> Completed
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">{currentLesson.title}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                      {currentLesson.description||'This section is currently in demo mode. The course content will become available on the scheduled start date. From that day onward, you will be able to access videos, code snippets, PDFs, and other learning resources.Until then, please stay tuned.'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                      {['Core concepts with clear explanations','Practical real-world examples','Hands-on coding exercises','Quiz to test your understanding'].map((item,i)=>(
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 shrink-0"/>{item}
                        </div>
                      ))}
                    </div>

                    {/* Nav */}
                    <div className="flex flex-wrap items-center gap-2">
                      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} disabled={activeLesson===0} onClick={goPrev}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-300">
                        <ArrowLeft s={12}/> Previous
                      </motion.button>
                      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} disabled={activeLesson>=lessons.length-1} onClick={markAndNext}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-700/90 to-violet-700/90 hover:from-indigo-600 hover:to-violet-600 border border-indigo-500/30 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_24px_rgba(109,40,217,0.4)] text-white">
                        {completedLessons.has(activeLesson)?'Next Lesson':'Complete & Next'} <ArrowRight s={12}/>
                      </motion.button>
                    </div>

                    {/* Mobile progress card */}
                    <div className="mt-6 sm:hidden p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-gray-400">Your Progress</p>
                        <p className="text-xs font-bold text-indigo-400">{progress}%</p>
                      </div>
                      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{background:'linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7)'}}
                          animate={{width:`${progress}%`}} transition={{duration:0.9,ease:'easeOut'}}/>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1.5">{completedLessons.size} of {lessons.length} lessons done</p>
                    </div>
                  </div>
                )}

                {/* Resources */}
                {activeTab==='resources' && (
                  <div className="px-4 sm:px-5 py-5 max-w-2xl">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Lesson Resources</p>
                    <div className="space-y-2">
                      {[
                        {name:'Lecture Slides.pdf', size:'2.4 MB', icon:'📄', grad:'from-blue-900/40 to-blue-800/20 border-blue-700/30'},
                        {name:'Starter Code.zip',   size:'128 KB', icon:'📦', grad:'from-violet-900/40 to-violet-800/20 border-violet-700/30'},
                        {name:'Cheat Sheet.pdf',    size:'340 KB', icon:'📋', grad:'from-emerald-900/40 to-emerald-800/20 border-emerald-700/30'},
                        {name:'Exercise Files.zip', size:'512 KB', icon:'🗂️', grad:'from-amber-900/40 to-amber-800/20 border-amber-700/30'},
                      ].map((r,i)=>(
                        <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r border cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all group ${r.grad}`}>
                          <span className="text-xl shrink-0">{r.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-200 truncate group-hover:text-white transition-colors">{r.name}</p>
                            <p className="text-[11px] text-gray-500">{r.size}</p>
                          </div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 group-hover:text-gray-300 shrink-0 transition-colors">
                            <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" strokeLinecap="round"/>
                          </svg>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {activeTab==='notes' && <NotesTab lessonIndex={activeLesson}/>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── DESKTOP SIDEBAR ── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside key="sidebar"
              initial={{width:0,opacity:0}} animate={{width:352,opacity:1}} exit={{width:0,opacity:0}}
              transition={{duration:0.38,ease:[0.22,1,0.36,1]}}
              className="hidden sm:flex shrink-0 flex-col overflow-hidden"
              style={{borderLeft:'1px solid rgba(255,255,255,0.06)',background:'rgba(7,5,18,0.97)',backdropFilter:'blur(24px)'}}>
              <SidebarInner syllabus={syllabus} lessons={lessons} activeLesson={activeLesson}
                completedLessons={completedLessons} progress={progress} onLessonClick={goTo}/>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="sm:hidden shrink-0 flex items-center justify-around px-2 py-2 border-t border-white/[0.06]"
        style={{background:'rgba(6,4,16,0.98)',backdropFilter:'blur(20px)'}}>
        <motion.button whileTap={{scale:0.88}} onClick={goPrev} disabled={activeLesson===0}
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl disabled:opacity-30 text-gray-500 hover:text-gray-300 transition-colors">
          <ArrowLeft s={20}/><span className="text-[9px] font-bold">Prev</span>
        </motion.button>
        <motion.button whileTap={{scale:0.88}} onClick={markAndNext}
          className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300">
          <CheckIcon s={20}/><span className="text-[9px] font-bold">Complete</span>
        </motion.button>
        <motion.button whileTap={{scale:0.88}} onClick={()=>setMobileDrawer(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-gray-500 hover:text-gray-300 transition-colors">
          <MenuIcon s={20}/><span className="text-[9px] font-bold">Lessons</span>
        </motion.button>
        <motion.button whileTap={{scale:0.88}} onClick={markAndNext} disabled={activeLesson>=lessons.length-1}
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl disabled:opacity-30 text-gray-500 hover:text-gray-300 transition-colors">
          <ArrowRight s={20}/><span className="text-[9px] font-bold">Next</span>
        </motion.button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   LOADING
═══════════════════════════════════════════════════════════ */
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060410]">
      <Background/>
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          {[
            {cls:'absolute inset-0 rounded-full border-2 border-indigo-500/25',d:3,dir:1},
            {cls:'absolute inset-2 rounded-full border-2 border-t-violet-400 border-transparent',d:1.5,dir:-1},
            {cls:'absolute inset-4 rounded-full border-2 border-t-pink-400 border-transparent',d:0.9,dir:1},
          ].map((r,i)=>(
            <motion.div key={i} className={r.cls}
              animate={{rotate:r.dir===1?360:-360}}
              transition={{duration:r.d,repeat:Infinity,ease:'linear'}}/>
          ))}
        </div>
        <motion.p className="text-sm text-gray-500 tracking-[0.3em] uppercase font-semibold"
          animate={{opacity:[0.3,1,0.3]}} transition={{duration:2.2,repeat:Infinity}}>
          Loading course…
        </motion.p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PAGE ENTRY
═══════════════════════════════════════════════════════════ */
export default function CourseLearnPage() {
  const { courseId } = useParams() as { courseId:string }
  const router = useRouter()
  const [courseData, setCourseData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (user)=>{
      if(!user){ router.push('/login'); return }
      try {
        const snap = await getDoc(doc(db,'courses',courseId))
        setCourseData(snap.exists() ? snap.data() : {})
      } catch(e) {
        console.error(e); setCourseData({})
      } finally {
        setLoading(false)
      }
    })
    return ()=>unsub()
  },[courseId,router])

  if(loading)     return <LoadingScreen/>
  if(!courseData) return null
  return <CoursePlayer courseId={courseId} courseData={courseData} router={router}/>
}
