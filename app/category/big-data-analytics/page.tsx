"use client";

import { useState, useRef, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Database,
  BarChart3,
  Boxes,
  Workflow,
  Download,
  CheckCircle2,
  XCircle,
  Rocket,
  Brain,
  Code2,
  BookOpen,
  Sparkles,
  Layers,
  GitBranch,
  Terminal,
  Cpu,
  Cloud,
  ShieldCheck,
  TrendingUp,
  ListChecks,
  FileText,
  ChevronRight,
  Server,
  Network,
  HardDrive,
  Gauge,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" },
  }),
};

/* ------------------------------------------------------------------ */
/*  Static content data                                                 */
/* ------------------------------------------------------------------ */

const fiveVs = [
  {
    letter: "V",
    title: "Volume",
    desc: "The sheer amount of data generated every second — terabytes to exabytes — from sensors, transactions, social media, and logs.",
    icon: HardDrive,
  },
  {
    letter: "V",
    title: "Velocity",
    desc: "The speed at which data is created and must be processed — real-time stock ticks, IoT streams, clickstreams.",
    icon: Gauge,
  },
  {
    letter: "V",
    title: "Variety",
    desc: "Structured (SQL tables), semi-structured (JSON, XML), and unstructured (images, video, text) data all mixed together.",
    icon: Layers,
  },
  {
    letter: "V",
    title: "Veracity",
    desc: "The trustworthiness, accuracy, and quality of data — noisy, incomplete, or biased data reduces veracity.",
    icon: ShieldCheck,
  },
  {
    letter: "V",
    title: "Value",
    desc: "The ultimate goal — turning raw data into actionable business or scientific insight that justifies the cost of collecting it.",
    icon: TrendingUp,
  },
];

const analyticsTypes = [
  {
    name: "Descriptive Analytics",
    tagline: "What happened?",
    desc: "Summarizes historical data using aggregates, dashboards, and reports. Example: a monthly sales report showing total revenue per region.",
    tools: "Excel, Tableau, Power BI, SQL GROUP BY",
  },
  {
    name: "Diagnostic Analytics",
    tagline: "Why did it happen?",
    desc: "Drills into descriptive results to find root causes using drill-down, correlation, and data mining. Example: finding that a sales dip correlates with a shipping delay.",
    tools: "Root-cause trees, correlation matrices, OLAP cubes",
  },
  {
    name: "Predictive Analytics",
    tagline: "What will happen?",
    desc: "Uses statistics and machine learning on historical data to forecast future outcomes. Example: predicting customer churn probability next quarter.",
    tools: "Regression, Random Forest, XGBoost, time-series (ARIMA)",
  },
  {
    name: "Prescriptive Analytics",
    tagline: "What should we do?",
    desc: "Recommends actions using optimization and simulation on top of predictions. Example: suggesting the optimal reorder quantity to minimize stockouts and cost.",
    tools: "Linear programming, simulation, reinforcement learning",
  },
];

const formulas = [
  {
    name: "Mean (Average)",
    formula: "x̄ = (Σxᵢ) / n",
    use: "Baseline measure of central tendency for a metric like average order value.",
  },
  {
    name: "Variance",
    formula: "σ² = Σ(xᵢ − x̄)² / n",
    use: "Measures how spread out data points are — used before standardizing features.",
  },
  {
    name: "Standard Deviation",
    formula: "σ = √(σ²)",
    use: "Same units as data; used for anomaly/outlier thresholds (e.g. ±3σ rule).",
  },
  {
    name: "Correlation Coefficient (Pearson r)",
    formula: "r = Σ((xᵢ−x̄)(yᵢ−ȳ)) / (√Σ(xᵢ−x̄)² · √Σ(yᵢ−ȳ)²)",
    use: "Checks linear relationship strength between two variables, range −1 to 1.",
  },
  {
    name: "Linear Regression",
    formula: "y = β₀ + β₁x + ε",
    use: "Predicts a continuous target from one or more features (predictive analytics).",
  },
  {
    name: "Precision",
    formula: "Precision = TP / (TP + FP)",
    use: "Of predicted positives, how many were actually correct — used to evaluate ML classifiers on big data.",
  },
  {
    name: "Recall (Sensitivity)",
    formula: "Recall = TP / (TP + FN)",
    use: "Of actual positives, how many were correctly caught — critical for fraud/anomaly detection.",
  },
  {
    name: "F1 Score",
    formula: "F1 = 2 · (Precision · Recall) / (Precision + Recall)",
    use: "Harmonic mean balancing precision and recall on imbalanced big datasets.",
  },
  {
    name: "MapReduce Speed-up (Amdahl's Law)",
    formula: "Speed-up = 1 / ((1 − P) + P/N)",
    use: "Estimates theoretical performance gain when parallelizing a job across N nodes; P = parallelizable fraction.",
  },
  {
    name: "Throughput",
    formula: "Throughput = Total Records Processed / Total Time",
    use: "Measures streaming pipeline performance (e.g. Kafka, Spark Streaming) in records/sec.",
  },
];

const roadmap = [
  {
    phase: "1. Foundations",
    items: ["Statistics & Probability", "SQL", "Python / R basics", "Linear Algebra essentials"],
  },
  {
    phase: "2. Data Handling",
    items: ["Pandas / NumPy", "Data cleaning & wrangling", "ETL concepts", "Data warehousing basics"],
  },
  {
    phase: "3. Big Data Ecosystem",
    items: ["Hadoop (HDFS, YARN, MapReduce)", "Apache Spark (Core, SQL, MLlib)", "Apache Kafka (streaming)", "Apache Hive / Pig"],
  },
  {
    phase: "4. Storage & Databases",
    items: ["NoSQL (MongoDB, Cassandra)", "Data Lakes (S3, ADLS)", "Distributed file systems", "Columnar stores (Parquet, ORC)"],
  },
  {
    phase: "5. Cloud & Orchestration",
    items: ["AWS EMR / Glue", "Google BigQuery / Dataproc", "Azure Synapse", "Airflow for pipeline orchestration"],
  },
  {
    phase: "6. Analytics & ML",
    items: ["Descriptive & predictive modeling", "Spark MLlib / scikit-learn", "Model evaluation at scale", "MLOps basics"],
  },
  {
    phase: "7. Visualization & Delivery",
    items: ["Power BI / Tableau", "Dashboards & storytelling", "A/B testing", "Real-time dashboards"],
  },
];

const cheatSheet = [
  { cmd: "hdfs dfs -ls /", note: "List files in HDFS root directory" },
  { cmd: "hdfs dfs -put file.txt /data/", note: "Upload a local file into HDFS" },
  { cmd: "spark-submit job.py", note: "Run a PySpark job on a cluster" },
  { cmd: "df = spark.read.csv('path', header=True)", note: "Read a CSV into a Spark DataFrame" },
  { cmd: "df.groupBy('col').count()", note: "Aggregate rows by column in Spark" },
  { cmd: "SELECT * FROM table TABLESAMPLE(10 PERCENT)", note: "Sample big table in Hive/SQL" },
  { cmd: "kafka-console-producer --topic t", note: "Send test messages to a Kafka topic" },
  { cmd: "df.repartition(200)", note: "Increase parallelism before a heavy Spark shuffle" },
  { cmd: "df.cache()", note: "Persist a Spark DataFrame in memory for reuse" },
  { cmd: "EXPLAIN ANALYZE SELECT ...", note: "Inspect a query execution plan for optimization" },
];

const useCases = [
  { title: "E-commerce", desc: "Personalized recommendations, dynamic pricing, and inventory forecasting from clickstream + purchase data." },
  { title: "Healthcare", desc: "Predicting disease outbreaks, patient readmission risk, and analyzing genomic data at scale." },
  { title: "Banking & Finance", desc: "Real-time fraud detection, credit risk scoring, and algorithmic trading using streaming analytics." },
  { title: "Transportation", desc: "Route optimization, predictive vehicle maintenance, and ride-demand forecasting (e.g. Uber, Ola)." },
  { title: "Social Media", desc: "Trend detection, sentiment analysis, and ad targeting from billions of daily posts." },
  { title: "Manufacturing", desc: "IoT sensor analytics for predictive maintenance and defect detection on production lines." },
];

const goodBad = {
  good: [
    "Better, faster, data-driven decisions",
    "Uncovers hidden patterns and correlations",
    "Enables real-time personalization at scale",
    "Improves operational efficiency and cost savings",
    "Powers advanced AI/ML products",
  ],
  bad: [
    "High infrastructure & storage cost",
    "Privacy and security risks with sensitive data",
    "Data quality issues can mislead decisions ('garbage in, garbage out')",
    "Requires specialized skills (Spark, Hadoop, cloud)",
    "Bias in data can lead to biased models",
  ],
};

const futureTrends = [
  "Real-time & streaming-first architectures (Kafka, Flink) replacing batch-only pipelines",
  "Convergence of Big Data + Generative AI for automated insight generation",
  "Data mesh & decentralized ownership replacing monolithic data lakes",
  "Edge analytics — processing IoT data closer to the source before it hits the cloud",
  "Stronger data governance, privacy-by-design, and synthetic data for compliance",
];

const buildAiSteps = [
  {
    step: "1. Define the problem",
    detail: "Pick a clear business question (e.g. churn prediction, demand forecasting) that big data can answer.",
  },
  {
    step: "2. Collect & store data",
    detail: "Ingest data via batch (HDFS, S3) or streaming (Kafka) pipelines into a data lake / warehouse.",
  },
  {
    step: "3. Clean & transform",
    detail: "Use Spark / Pandas to handle missing values, duplicates, and feature engineering at scale.",
  },
  {
    step: "4. Explore (EDA)",
    detail: "Use descriptive statistics and visualizations to understand distributions and correlations.",
  },
  {
    step: "5. Train the model",
    detail: "Use Spark MLlib, scikit-learn, or TensorFlow/PyTorch on sampled or full big data depending on scale.",
  },
  {
    step: "6. Evaluate",
    detail: "Use precision, recall, F1, RMSE etc. on a held-out test set; check for bias and overfitting.",
  },
  {
    step: "7. Deploy & monitor",
    detail: "Serve the model via an API, monitor drift, and retrain on fresh big data periodically (MLOps loop).",
  },
];

const blogs = [
  {
    title: "Why Every Company Suddenly Needs a Data Lake",
    excerpt: "From spreadsheets to petabyte-scale lakes — how businesses evolved their relationship with data, and why storage-first thinking beats analytics-first thinking.",
    read: "6 min read",
  },
  {
    title: "MapReduce vs Spark: The Real Difference",
    excerpt: "A practical breakdown of why Spark's in-memory model outran Hadoop's disk-based MapReduce, with real throughput numbers.",
    read: "5 min read",
  },
  {
    title: "The Hidden Cost of Bad Data Quality",
    excerpt: "Big Data is only as good as its veracity. A look at how dirty data quietly costs companies millions in wrong decisions.",
    read: "4 min read",
  },
  {
    title: "From Big Data to AI: Building Your First Predictive Model",
    excerpt: "A beginner-friendly walkthrough connecting a Spark data pipeline to a scikit-learn model, end-to-end.",
    read: "8 min read",
  },
];

const codingProblems = [
  {
    title: "Word Count on a Distributed Log File",
    difficulty: "Easy",
    prompt: "Given a huge text file split across nodes, design a MapReduce job (map + reduce functions) that outputs the frequency of every word.",
  },
  {
    title: "Top-K Frequent Elements in a Stream",
    difficulty: "Medium",
    prompt: "Given a continuous stream of transaction IDs, maintain the top 10 most frequent IDs at any time using a min-heap and a hashmap, without storing the entire stream.",
  },
  {
    title: "Detect Anomalies in Sensor Data",
    difficulty: "Medium",
    prompt: "Given a streaming series of IoT temperature readings, flag any reading more than 3 standard deviations from a rolling mean (windowed z-score).",
  },
  {
    title: "Partition a Large Dataset for Parallel Processing",
    difficulty: "Medium",
    prompt: "Given 1 billion rows and 50 worker nodes, write pseudocode to hash-partition rows by user_id so that each node gets a roughly equal, non-overlapping share.",
  },
  {
    title: "Design a Deduplication Pipeline",
    difficulty: "Hard",
    prompt: "Design a Spark job that removes near-duplicate records (e.g. same customer, slightly different formatting) from a 10TB dataset using MinHash / LSH.",
  },
];

/* ------------------------------------------------------------------ */
/*  Notes text (downloadable)                                          */
/* ------------------------------------------------------------------ */
const notesText = `CODENFACTS — BIG DATA ANALYTICS NOTES
========================================

1. WHAT IS DATA?
Data is any raw fact, figure, or observation that can be recorded, stored, and
processed — numbers, text, images, sensor readings, clicks, transactions, etc.
On its own, data has no meaning; it becomes "information" once it is
organized, and "insight" once it is analyzed.

2. WHAT IS BIG DATA?
Big Data refers to datasets that are too large, fast-moving, or varied for
traditional single-machine tools (like Excel or a single SQL server) to
store and process efficiently. It typically requires distributed systems
(Hadoop, Spark) spread across many machines working together.

3. WHY BIG DATA ANALYTICS IS USED
- Traditional databases cannot scale to petabytes or handle millions of
  events per second.
- Businesses need real-time decisions (fraud detection, recommendations).
- Hidden patterns in massive datasets can reveal opportunities invisible
  in small samples.
- Competitive advantage: companies that use data well outperform those
  that guess.

4. WHY BIG DATA ANALYTICS IS NEEDED
- Explosive growth of data from IoT, social media, mobile apps, and
  transactions (~2.5 quintillion bytes generated daily worldwide).
- Need to convert unstructured/raw data into structured business value.
- Enables predictive maintenance, personalization, risk scoring, and
  automation that manual analysis simply cannot achieve at scale.

5. THE 5 V's OF BIG DATA
- Volume: the amount of data (GB → PB → EB)
- Velocity: the speed of data generation/processing
- Variety: structured, semi-structured, unstructured formats
- Veracity: trustworthiness/quality of the data
- Value: the actual business insight extracted

6. TYPES OF ANALYTICS
- Descriptive Analytics — "What happened?" (dashboards, reports)
- Diagnostic Analytics — "Why did it happen?" (root-cause analysis)
- Predictive Analytics — "What will happen?" (ML forecasting)
- Prescriptive Analytics — "What should we do?" (optimization, recommendations)

7. KEY FORMULAS
Mean: x̄ = (Σxᵢ) / n
Variance: σ² = Σ(xᵢ − x̄)² / n
Standard Deviation: σ = √(σ²)
Pearson Correlation: r = Σ((xᵢ−x̄)(yᵢ−ȳ)) / (√Σ(xᵢ−x̄)² · √Σ(yᵢ−ȳ)²)
Linear Regression: y = β₀ + β₁x + ε
Precision = TP / (TP + FP)
Recall = TP / (TP + FN)
F1 Score = 2 · (Precision · Recall) / (Precision + Recall)
Amdahl's Law (speed-up): 1 / ((1 − P) + P/N)
Throughput = Total Records Processed / Total Time

8. BIG DATA ARCHITECTURE (BLOCK DIAGRAM — TEXT FORM)
[Data Sources] -> [Ingestion Layer: Kafka / Flume / Sqoop]
      -> [Storage Layer: HDFS / S3 / Data Lake]
      -> [Processing Layer: Spark / MapReduce / Hive]
      -> [Analytics & ML Layer: MLlib / scikit-learn / TensorFlow]
      -> [Serving/Visualization Layer: Power BI / Tableau / Dashboards / APIs]
      -> [Business Decisions / AI Products]

Supporting layers running alongside all stages:
- Governance & Security (access control, encryption, compliance)
- Monitoring & Orchestration (Airflow, Zookeeper, YARN)

9. ROADMAP TO LEARN BIG DATA ANALYTICS
1. Foundations: Statistics, SQL, Python/R, Linear Algebra
2. Data Handling: Pandas, data cleaning, ETL, warehousing
3. Big Data Ecosystem: Hadoop (HDFS/YARN/MapReduce), Spark, Kafka, Hive
4. Storage & Databases: NoSQL, Data Lakes, Parquet/ORC
5. Cloud & Orchestration: AWS EMR/Glue, BigQuery, Azure Synapse, Airflow
6. Analytics & ML: predictive modeling, Spark MLlib, MLOps
7. Visualization & Delivery: Power BI/Tableau, dashboards, A/B testing

10. HOW TO BUILD YOUR OWN AI MODEL USING BIG DATA ANALYTICS
1. Define the problem clearly (churn, forecasting, fraud, etc.)
2. Collect and store data (batch via HDFS/S3, streaming via Kafka)
3. Clean and transform data (Spark/Pandas — handle missing values, engineer features)
4. Explore the data (EDA — distributions, correlations)
5. Train the model (Spark MLlib, scikit-learn, TensorFlow/PyTorch)
6. Evaluate the model (precision, recall, F1, RMSE — check for bias)
7. Deploy and monitor (serve via API, watch for data drift, retrain periodically)

11. USE CASES
- E-commerce: recommendations, dynamic pricing, inventory forecasting
- Healthcare: outbreak prediction, readmission risk, genomics
- Banking: real-time fraud detection, credit risk scoring
- Transportation: route optimization, predictive maintenance
- Social Media: trend detection, sentiment analysis, ad targeting
- Manufacturing: IoT predictive maintenance, defect detection

12. ADVANTAGES (GOOD SIDE)
- Faster, better, data-driven decisions
- Uncovers hidden patterns and correlations
- Enables real-time personalization
- Improves operational efficiency
- Powers advanced AI/ML products

13. DISADVANTAGES (BAD SIDE)
- High infrastructure and storage cost
- Privacy and security risks
- Poor data quality can mislead decisions
- Requires specialized skills
- Bias in data leads to biased models

14. FUTURE OF BIG DATA ANALYTICS
- Real-time, streaming-first architectures (Kafka, Flink)
- Convergence with Generative AI for automated insight generation
- Data mesh replacing monolithic centralized data lakes
- Edge analytics processing data closer to source
- Stronger governance, privacy-by-design, synthetic data

15. QUICK CHEAT SHEET
hdfs dfs -ls /                          -> list files in HDFS
hdfs dfs -put file.txt /data/           -> upload file to HDFS
spark-submit job.py                     -> run a PySpark job
df = spark.read.csv('path', header=True) -> read CSV into Spark DataFrame
df.groupBy('col').count()               -> aggregate in Spark
SELECT * FROM t TABLESAMPLE(10 PERCENT)  -> sample a big table
kafka-console-producer --topic t        -> send test messages to Kafka
df.repartition(200)                     -> increase parallelism
df.cache()                              -> persist DataFrame in memory
EXPLAIN ANALYZE SELECT ...              -> inspect query plan

16. PRACTICE CODING PROBLEMS
1. (Easy) Word Count on a Distributed Log File — write a MapReduce job.
2. (Medium) Top-K Frequent Elements in a Stream — min-heap + hashmap.
3. (Medium) Detect Anomalies in Sensor Data — rolling z-score.
4. (Medium) Partition a Large Dataset for Parallel Processing — hash partitioning.
5. (Hard) Design a Deduplication Pipeline — MinHash / LSH on 10TB data.

------------------------------------------------------------------------
Thanks for downloading these notes from CodeNFacts. Keep learning! 🚀
------------------------------------------------------------------------
`;

/* ------------------------------------------------------------------ */
/*  Small reusable components                                          */
/* ------------------------------------------------------------------ */

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: any;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-300/60 bg-amber-50 text-amber-600 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400">
        <Icon size={20} />
      </span>
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-emerald-400">
          {eyebrow}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
      </div>
    </div>
  );
}

function TerminalChrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2 rounded-t-xl dark:border-slate-800 dark:bg-[#0d1117]">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
      <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
      <span className="ml-2 font-mono text-xs text-slate-500 dark:text-slate-400">
        {label}
      </span>
    </div>
  );
}

function Toast({ show, message }: { show: boolean; message: string }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-amber-300 bg-white px-5 py-3 shadow-xl dark:border-emerald-400/40 dark:bg-[#0d1117]"
    >
      <CheckCircle2 className="text-amber-600 dark:text-emerald-400" size={20} />
      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
        {message}
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                 */
/* ------------------------------------------------------------------ */

export default function BigDataAnalyticsPage() {
  const [showToast, setShowToast] = useState(false);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, []);

  const handleDownload = () => {
    const blob = new Blob([notesText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CodeNFacts-Big-Data-Analytics-Notes.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setShowToast(true);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setShowToast(false), 3500);
  };

  const navSections = [
    { id: "what-is-data", label: "Data & Big Data" },
    { id: "five-vs", label: "5 V's" },
    { id: "types", label: "Types of Analytics" },
    { id: "formulas", label: "Formulas" },
    { id: "architecture", label: "Architecture" },
    { id: "roadmap", label: "Roadmap" },
    { id: "build-ai", label: "Build an AI Model" },
    { id: "cheatsheet", label: "Cheat Sheet" },
    { id: "usecases", label: "Use Cases" },
    { id: "prosandcons", label: "Pros & Cons" },
    { id: "future", label: "Future" },
    { id: "blogs", label: "Blogs" },
    { id: "coding", label: "Coding Problems" },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-800 transition-colors duration-300 dark:bg-[#0a0e14] dark:text-slate-200">
      {/* ---------------------------------------------------------- */}
      {/* HERO */}
      {/* ---------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white px-4 py-16 dark:border-slate-800 dark:bg-[#0d1117] sm:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-amber-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400"
          >
            <Database size={14} /> CodeNFacts Category
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-3xl font-extrabold leading-tight text-slate-900 dark:text-slate-50 sm:text-5xl"
          >
            Big Data Analytics - Full Notes, Roadmap & Practice
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg"
          >
            Everything you need in one page: what data and Big Data actually
            are, why analytics matters, the core formulas, architecture
            diagrams, a learning roadmap, cheat sheets, real use cases, and
            hands-on coding problems.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-amber-600 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            >
              <Download size={18} />
              Download Big Data Analytics Notes
            </button>
            <a
              href="#coding"
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Code2 size={18} />
              Jump to Coding Problems
            </a>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-8 lg:flex-row">
        {/* -------------------------------------------------------- */}
        {/* SIDEBAR NAV */}
        {/* -------------------------------------------------------- */}
        <aside className="lg:w-64 lg:flex-shrink-0">
          <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0d1117]">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
              On this page
            </p>
            <nav className="flex flex-col gap-1">
              {navSections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-slate-600 transition hover:bg-amber-50 hover:text-amber-700 dark:text-slate-400 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-400"
                >
                  <ChevronRight
                    size={14}
                    className="opacity-0 transition group-hover:opacity-100"
                  />
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* -------------------------------------------------------- */}
        {/* CONTENT */}
        {/* -------------------------------------------------------- */}
        <div className="flex-1 space-y-20">
          {/* WHAT IS DATA / BIG DATA */}
          <motion.section
            id="what-is-data"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={BookOpen} eyebrow="Fundamentals" title="What is Data & Big Data Analytics?" />

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0d1117]">
                <h3 className="mb-2 font-bold text-slate-900 dark:text-slate-100">What is Data?</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Data is any raw fact, number, observation, or record that
                  can be captured and stored — a temperature reading, a
                  purchase, a tweet, a sensor pulse. On its own, data carries
                  no meaning; it becomes <em>information</em> once organized,
                  and <em>insight</em> once analyzed.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0d1117]">
                <h3 className="mb-2 font-bold text-slate-900 dark:text-slate-100">What is Big Data?</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Big Data is data so large, fast, or varied that traditional
                  single-machine tools (Excel, a single SQL server) cannot
                  store or process it efficiently. It requires distributed
                  systems — like Hadoop and Spark — spread across many
                  machines working in parallel.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0d1117]">
                <h3 className="mb-2 font-bold text-slate-900 dark:text-slate-100">Why is it used?</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Traditional DBs can't scale to petabytes or millions of events/sec</li>
                  <li>Real-time decisions: fraud detection, recommendations</li>
                  <li>Reveals patterns invisible in small samples</li>
                  <li>Data-driven companies consistently outperform guesswork-driven ones</li>
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0d1117]">
                <h3 className="mb-2 font-bold text-slate-900 dark:text-slate-100">Why is it needed?</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Explosive data growth from IoT, mobile, and social platforms</li>
                  <li>Converts raw/unstructured data into structured business value</li>
                  <li>Enables predictive maintenance, personalization, risk scoring</li>
                  <li>Automates decisions at a scale humans simply can't match</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 5 V's */}
          <motion.section
            id="five-vs"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={Boxes} eyebrow="Characteristics" title="The 5 V's (Types / Dimensions of Big Data)" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {fiveVs.map((v, i) => (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-xl border border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-[#0d1117]"
                >
                  <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                    <v.icon size={18} />
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{v.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {v.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* TYPES OF ANALYTICS */}
          <motion.section
            id="types"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={BarChart3} eyebrow="Analytics Spectrum" title="Types of Big Data Analytics" />
            <div className="grid gap-5 sm:grid-cols-2">
              {analyticsTypes.map((t, i) => (
                <motion.div
                  key={t.name}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0d1117]"
                >
                  <p className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-emerald-400">
                    {t.tagline}
                  </p>
                  <h4 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{t.name}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.desc}</p>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
                    <strong>Tools:</strong> {t.tools}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* FORMULAS */}
          <motion.section
            id="formulas"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={Sparkles} eyebrow="Math Behind the Data" title="Important Formulas" />
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-900/60">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Concept</th>
                    <th className="px-4 py-3 font-mono font-semibold text-amber-600 dark:text-emerald-400">Formula</th>
                    <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Used For</th>
                  </tr>
                </thead>
                <tbody>
                  {formulas.map((f, i) => (
                    <tr
                      key={f.name}
                      className={
                        i % 2 === 0
                          ? "bg-white dark:bg-[#0d1117]"
                          : "bg-slate-50 dark:bg-[#0a0e14]"
                      }
                    >
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{f.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-amber-700 dark:text-emerald-400">{f.formula}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{f.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* ARCHITECTURE / BLOCK DIAGRAM */}
          <motion.section
            id="architecture"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={Workflow} eyebrow="System Design" title="Big Data Architecture (Block Diagram)" />
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0d1117]">
              <TerminalChrome label="architecture.svg" />
              <div className="overflow-x-auto p-6">
                <div className="flex min-w-[720px] items-center justify-between gap-2">
                  {[
                    { label: "Data Sources", icon: Server, sub: "IoT, Apps, Logs, DBs" },
                    { label: "Ingestion", icon: Network, sub: "Kafka / Flume / Sqoop" },
                    { label: "Storage", icon: HardDrive, sub: "HDFS / S3 / Data Lake" },
                    { label: "Processing", icon: Cpu, sub: "Spark / MapReduce / Hive" },
                    { label: "Analytics & ML", icon: Brain, sub: "MLlib / scikit-learn" },
                    { label: "Serving", icon: Cloud, sub: "Dashboards / APIs" },
                  ].map((block, i, arr) => (
                    <div key={block.label} className="flex items-center">
                      <div className="flex w-32 flex-col items-center rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-center dark:border-emerald-400/30 dark:bg-emerald-400/10">
                        <block.icon size={20} className="mb-1 text-amber-600 dark:text-emerald-400" />
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{block.label}</p>
                        <p className="mt-0.5 text-[10px] leading-tight text-slate-500 dark:text-slate-400">{block.sub}</p>
                      </div>
                      {i < arr.length - 1 && (
                        <ChevronRight className="mx-1 flex-shrink-0 text-slate-400 dark:text-slate-600" size={20} />
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs text-slate-500 dark:text-slate-500">
                  Running alongside every stage: <strong>Governance & Security</strong> (access control, encryption,
                  compliance) and <strong>Monitoring & Orchestration</strong> (Airflow, ZooKeeper, YARN).
                </p>
              </div>
            </div>
          </motion.section>

          {/* ROADMAP */}
          <motion.section
            id="roadmap"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={GitBranch} eyebrow="Learning Path" title="Big Data Analytics Roadmap" />
            <div className="relative border-l-2 border-amber-300 pl-6 dark:border-emerald-400/40">
              {roadmap.map((r, i) => (
                <motion.div key={r.phase} variants={fadeUp} custom={i} className="relative mb-8 last:mb-0">
                  <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white dark:bg-emerald-500">
                    {i + 1}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{r.phase}</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {r.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* BUILD YOUR OWN AI MODEL */}
          <motion.section
            id="build-ai"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={Brain} eyebrow="Hands-on" title="How to Build Your Own AI Model Using Big Data Analytics" />
            <div className="grid gap-4 sm:grid-cols-2">
              {buildAiSteps.map((s, i) => (
                <motion.div
                  key={s.step}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0d1117]"
                >
                  <h4 className="font-bold text-amber-700 dark:text-emerald-400">{s.step}</h4>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CHEAT SHEET */}
          <motion.section
            id="cheatsheet"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={Terminal} eyebrow="Quick Reference" title="Big Data Cheat Sheet" />
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0d1117]">
              <TerminalChrome label="cheatsheet.sh" />
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {cheatSheet.map((c) => (
                  <div key={c.cmd} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <code className="font-mono text-xs text-amber-700 dark:text-emerald-400">{c.cmd}</code>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{c.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* USE CASES */}
          <motion.section
            id="usecases"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={Rocket} eyebrow="Real World" title="Use Cases & Applications" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((u, i) => (
                <motion.div
                  key={u.title}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0d1117]"
                >
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{u.title}</h4>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{u.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* PROS AND CONS + FUTURE */}
          <motion.section
            id="prosandcons"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={ListChecks} eyebrow="Balance Sheet" title="Good Side & Bad Side" />
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-emerald-400/30 dark:bg-emerald-400/5">
                <h4 className="mb-3 flex items-center gap-2 font-bold text-green-700 dark:text-emerald-400">
                  <CheckCircle2 size={18} /> Advantages
                </h4>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {goodBad.good.map((g) => (
                    <li key={g} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-green-500 dark:text-emerald-400" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-400/30 dark:bg-red-400/5">
                <h4 className="mb-3 flex items-center gap-2 font-bold text-red-700 dark:text-red-400">
                  <XCircle size={18} /> Disadvantages
                </h4>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {goodBad.bad.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <XCircle size={14} className="mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          <motion.section
            id="future"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={TrendingUp} eyebrow="Looking Ahead" title="Future of Big Data Analytics" />
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0d1117]">
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                {futureTrends.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Sparkles size={14} className="mt-0.5 flex-shrink-0 text-amber-500 dark:text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* BLOGS */}
          <motion.section
            id="blogs"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={FileText} eyebrow="Read More" title="Blogs on Big Data Analytics" />
            <div className="grid gap-5 sm:grid-cols-2">
              {blogs.map((b, i) => (
                <motion.div
                  key={b.title}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-xl border border-slate-200 bg-white p-6 transition hover:shadow-md dark:border-slate-800 dark:bg-[#0d1117]"
                >
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{b.title}</h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{b.excerpt}</p>
                  <p className="mt-3 text-xs font-mono text-amber-600 dark:text-emerald-400">{b.read}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CODING PROBLEMS */}
          <motion.section
            id="coding"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={Code2} eyebrow="Practice" title="Coding Problems" />
            <div className="space-y-4">
              {codingProblems.map((p, i) => (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0d1117]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{p.title}</h4>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.difficulty === "Easy"
                          ? "bg-green-100 text-green-700 dark:bg-emerald-400/10 dark:text-emerald-400"
                          : p.difficulty === "Medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400"
                          : "bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-400"
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{p.prompt}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* FINAL DOWNLOAD CTA */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl border border-amber-300 bg-amber-50 p-8 text-center dark:border-emerald-400/30 dark:bg-emerald-400/5"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Want all of this offline?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Grab the complete Big Data Analytics notes — definitions, formulas, architecture, roadmap, and cheat sheet — in one file.
            </p>
            <button
              onClick={handleDownload}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-amber-600 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            >
              <Download size={18} />
              Download Notes
            </button>
          </motion.section>
        </div>
      </div>

      <Toast show={showToast} message="Thanks for downloading! Happy learning 🚀" />
    </main>
  );
}