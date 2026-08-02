"use client";

/**
 * category/sql/page.tsx
 * -----------------------------------------------------------------------
 * A complete, self-contained SQL learning & reference page.
 *
 * THEME NOTES
 * This page uses Tailwind's class-based dark mode (`darkMode: "class"`).
 * It assumes your existing header toggles a `dark` class on <html> (or a
 * parent element) — e.g. via `next-themes`. No theme toggle is duplicated
 * here; every surface below simply reacts to that class through Tailwind's
 * `dark:` variants. Light mode background is pure white (`bg-white`) and
 * automatically swaps to a deep slate background in dark mode.
 *
 * DEPENDENCIES
 * None beyond React + Tailwind CSS. No icon library or font package is
 * required — icons are inline SVG and type uses the system font stack
 * (`font-sans` / `font-mono`), so this drops into any Next.js + Tailwind
 * project without extra installs.
 *
 * SIGNATURE DESIGN IDEA
 * The page is framed like a database client: a decorative "query bar" up
 * top, a left "Schema Explorer" sidebar that lists sections the way a DB
 * tool lists tables, and content cards with hairline, table-cell-style
 * borders. Diagrams (architecture flow + join venn diagrams) are drawn
 * with plain SVG, no chart library needed.
 * -----------------------------------------------------------------------
 */

import { useMemo, useState } from "react";

/* ======================================================================
   ICONS (tiny inline SVGs — no external icon library required)
   ====================================================================== */

type IconProps = { className?: string };

const IconDatabase = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const IconKey = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="1.6" />
    <path d="M11 12l9-9m0 0v4m0-4h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconLayers = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3l9 5-9 5-9-5 9-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M3 13l9 5 9-5M3 8v0" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

const IconDownload = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconCheck = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconX = ({ className = "w-4 h-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconMap = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V6l5-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const IconBook = ({ className = "w-5 h-5" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 15.5v-10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M4 15.5A2.5 2.5 0 016.5 13H20" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/* ======================================================================
   CONTENT DATA — single source of truth for the page AND the downloaded
   notes file, so both always stay in sync.
   ====================================================================== */

type Command = { cmd: string; use: string; syntax: string; example: string };
type CommandGroup = {
  code: string;
  name: string;
  desc: string;
  accent: string; // tailwind color name, e.g. "blue"
  commands: Command[];
};

const COMMAND_GROUPS: CommandGroup[] = [
  {
    code: "DDL",
    name: "Data Definition Language",
    desc: "Defines and modifies the structure of database objects — tables, schemas, indexes. DDL statements auto-commit in most databases.",
    accent: "blue",
    commands: [
      { cmd: "CREATE", use: "Create a new table, database, view, or index", syntax: "CREATE TABLE table_name (\n  col1 TYPE constraints,\n  col2 TYPE constraints\n);", example: "CREATE TABLE students (\n  id INT PRIMARY KEY,\n  name VARCHAR(50) NOT NULL,\n  age INT CHECK (age > 0)\n);" },
      { cmd: "ALTER", use: "Modify an existing table's structure", syntax: "ALTER TABLE table_name ADD|DROP|MODIFY COLUMN col_name TYPE;", example: "ALTER TABLE students ADD COLUMN email VARCHAR(100);" },
      { cmd: "DROP", use: "Permanently delete a table or database object", syntax: "DROP TABLE table_name;", example: "DROP TABLE students;" },
      { cmd: "TRUNCATE", use: "Remove all rows from a table instantly (keeps structure)", syntax: "TRUNCATE TABLE table_name;", example: "TRUNCATE TABLE students;" },
      { cmd: "RENAME", use: "Rename a table or column", syntax: "ALTER TABLE old_name RENAME TO new_name;", example: "ALTER TABLE students RENAME TO learners;" },
    ],
  },
  {
    code: "DML",
    name: "Data Manipulation Language",
    desc: "Manages the data stored inside tables — inserting, updating, and deleting rows. DML changes can be rolled back inside a transaction.",
    accent: "emerald",
    commands: [
      { cmd: "INSERT", use: "Add new row(s) into a table", syntax: "INSERT INTO table_name (col1, col2) VALUES (val1, val2);", example: "INSERT INTO students (id, name, age)\nVALUES (1, 'Asha', 21);" },
      { cmd: "UPDATE", use: "Modify existing rows that match a condition", syntax: "UPDATE table_name SET col = value WHERE condition;", example: "UPDATE students SET age = 22 WHERE id = 1;" },
      { cmd: "DELETE", use: "Remove row(s) matching a condition", syntax: "DELETE FROM table_name WHERE condition;", example: "DELETE FROM students WHERE age < 18;" },
      { cmd: "MERGE", use: "Insert or update depending on whether a match exists (upsert)", syntax: "MERGE INTO target USING source ON condition\nWHEN MATCHED THEN UPDATE SET ...\nWHEN NOT MATCHED THEN INSERT ...;", example: "MERGE INTO students t USING staging s\nON t.id = s.id\nWHEN MATCHED THEN UPDATE SET t.name = s.name\nWHEN NOT MATCHED THEN INSERT (id, name) VALUES (s.id, s.name);" },
    ],
  },
  {
    code: "DQL",
    name: "Data Query Language",
    desc: "Retrieves data from the database. Some textbooks fold DQL into DML — either grouping is fine to know for interviews.",
    accent: "violet",
    commands: [
      { cmd: "SELECT", use: "Query rows and columns from one or more tables", syntax: "SELECT col1, col2 FROM table_name WHERE condition\nORDER BY col ASC|DESC\nLIMIT n;", example: "SELECT name, age FROM students\nWHERE age > 18\nORDER BY age DESC\nLIMIT 5;" },
    ],
  },
  {
    code: "DCL",
    name: "Data Control Language",
    desc: "Controls access and permissions — who can read, write, or administer database objects.",
    accent: "amber",
    commands: [
      { cmd: "GRANT", use: "Give a user specific privileges", syntax: "GRANT privilege ON object TO user;", example: "GRANT SELECT, INSERT ON students TO 'analyst';" },
      { cmd: "REVOKE", use: "Remove previously granted privileges", syntax: "REVOKE privilege ON object FROM user;", example: "REVOKE INSERT ON students FROM 'analyst';" },
    ],
  },
  {
    code: "TCL",
    name: "Transaction Control Language",
    desc: "Manages transactions so a group of DML operations succeeds or fails as a single unit (see ACID below).",
    accent: "rose",
    commands: [
      { cmd: "COMMIT", use: "Permanently save all changes made in the current transaction", syntax: "COMMIT;", example: "BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;" },
      { cmd: "ROLLBACK", use: "Undo changes made in the current, uncommitted transaction", syntax: "ROLLBACK;", example: "BEGIN;\nDELETE FROM orders WHERE id = 99;\nROLLBACK; -- undoes the delete" },
      { cmd: "SAVEPOINT", use: "Mark a point within a transaction to roll back to, without undoing everything", syntax: "SAVEPOINT point_name;", example: "SAVEPOINT before_update;\nUPDATE inventory SET qty = 0;\nROLLBACK TO before_update;" },
    ],
  },
];

type Topic = { title: string; blurb: string; code?: string };

const TOPICS: Topic[] = [
  {
    title: "Filtering with WHERE",
    blurb: "Narrow results using comparison, logical, range, list, and pattern operators.",
    code: "SELECT * FROM orders\nWHERE status = 'shipped'\n  AND total BETWEEN 100 AND 500\n  AND country IN ('IN', 'US', 'DE')\n  AND customer_name LIKE 'A%';",
  },
  {
    title: "Sorting & Limiting",
    blurb: "ORDER BY controls row order; LIMIT/OFFSET (or FETCH/TOP) controls pagination.",
    code: "SELECT name, score FROM players\nORDER BY score DESC\nLIMIT 10 OFFSET 20; -- page 3 of 10-row pages",
  },
  {
    title: "Aggregate Functions",
    blurb: "COUNT, SUM, AVG, MIN, MAX summarize many rows into one value — usually paired with GROUP BY.",
    code: "SELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 5\nORDER BY avg_salary DESC;",
  },
  {
    title: "Joins",
    blurb: "Combine rows from two or more tables based on a related column. See the join diagram below.",
    code: "SELECT o.id, c.name, o.total\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id;",
  },
  {
    title: "Subqueries",
    blurb: "A query nested inside another — in SELECT, FROM, or WHERE — to compute an intermediate result.",
    code: "SELECT name FROM employees\nWHERE salary > (\n  SELECT AVG(salary) FROM employees\n);",
  },
  {
    title: "Set Operations",
    blurb: "UNION, UNION ALL, INTERSECT, and EXCEPT/MINUS combine the results of two compatible queries.",
    code: "SELECT city FROM customers\nUNION\nSELECT city FROM suppliers;  -- duplicates removed automatically",
  },
  {
    title: "Constraints",
    blurb: "Rules enforced on columns: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT.",
    code: "CREATE TABLE orders (\n  id INT PRIMARY KEY,\n  customer_id INT REFERENCES customers(id),\n  total DECIMAL(10,2) CHECK (total >= 0),\n  status VARCHAR(20) DEFAULT 'pending'\n);",
  },
  {
    title: "Indexes",
    blurb: "A lookup structure (usually a B-tree) that speeds up reads on a column at the cost of slower writes and extra storage.",
    code: "CREATE INDEX idx_customers_email ON customers(email);\n-- speeds up: SELECT * FROM customers WHERE email = '...';",
  },
  {
    title: "Views",
    blurb: "A saved, reusable query that behaves like a virtual table — great for simplifying repeated logic.",
    code: "CREATE VIEW active_customers AS\nSELECT * FROM customers WHERE status = 'active';\n\nSELECT * FROM active_customers;",
  },
  {
    title: "Transactions & ACID",
    blurb: "A transaction groups statements so they all succeed or all fail — guaranteeing Atomicity, Consistency, Isolation, Durability.",
    code: "BEGIN;\nUPDATE accounts SET balance = balance - 500 WHERE id = 1;\nUPDATE accounts SET balance = balance + 500 WHERE id = 2;\nCOMMIT;",
  },
  {
    title: "Stored Procedures & Functions",
    blurb: "Precompiled, reusable blocks of SQL (with logic, parameters, and loops) stored on the server.",
    code: "CREATE PROCEDURE give_raise(emp_id INT, pct DECIMAL)\nAS $$\nBEGIN\n  UPDATE employees SET salary = salary * (1 + pct/100)\n  WHERE id = emp_id;\nEND;\n$$ LANGUAGE plpgsql;",
  },
  {
    title: "Triggers",
    blurb: "A block of SQL that runs automatically before/after an INSERT, UPDATE, or DELETE on a table.",
    code: "CREATE TRIGGER trg_audit_update\nAFTER UPDATE ON employees\nFOR EACH ROW\nEXECUTE FUNCTION log_salary_change();",
  },
  {
    title: "Window Functions",
    blurb: "Perform calculations across a set of rows related to the current row, without collapsing them like GROUP BY does.",
    code: "SELECT name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank\nFROM employees;",
  },
  {
    title: "Normalization",
    blurb: "A design process that reduces redundancy: 1NF (atomic columns) → 2NF (no partial dependency) → 3NF (no transitive dependency) → BCNF.",
    code: "-- Un-normalized: orders(id, customer_name, customer_email, item, qty)\n-- Normalized:\n-- customers(id, name, email)\n-- orders(id, customer_id, item, qty)",
  },
  {
    title: "SQL Injection & Security",
    blurb: "Never concatenate raw user input into SQL strings — always use parameterized queries / prepared statements.",
    code: "-- Unsafe:\n-- \"SELECT * FROM users WHERE name = '\" + input + \"'\"\n\n-- Safe (parameterized):\nSELECT * FROM users WHERE name = $1;",
  },
];

type RoadmapStage = { stage: string; timeframe: string; items: string[] };

const ROADMAP: RoadmapStage[] = [
  { stage: "Beginner", timeframe: "Week 1–2", items: ["SELECT, WHERE, ORDER BY, LIMIT", "Data types & basic constraints", "INSERT / UPDATE / DELETE", "Simple aggregate functions"] },
  { stage: "Intermediate", timeframe: "Week 3–5", items: ["All JOIN types", "GROUP BY / HAVING", "Subqueries & set operations", "Views & indexes basics"] },
  { stage: "Advanced", timeframe: "Week 6–9", items: ["Window functions", "Transactions & isolation levels", "Stored procedures, functions, triggers", "Query optimization & EXPLAIN plans"] },
  { stage: "Expert", timeframe: "Ongoing", items: ["Normalization & schema design", "Sharding, replication, partitioning", "NewSQL / distributed SQL engines", "Database-specific tuning (Postgres/MySQL/SQL Server)"] },
];

const CHEATSHEET: { group: string; rows: { syntax: string; note: string }[] }[] = [
  { group: "Filtering", rows: [
    { syntax: "WHERE col = value", note: "Exact match" },
    { syntax: "WHERE col BETWEEN a AND b", note: "Inclusive range" },
    { syntax: "WHERE col IN (a, b, c)", note: "Match any in list" },
    { syntax: "WHERE col LIKE 'A%'", note: "Pattern match (% = any chars, _ = 1 char)" },
    { syntax: "WHERE col IS NULL", note: "Never use = NULL" },
  ]},
  { group: "Joins", rows: [
    { syntax: "A INNER JOIN B ON A.id = B.a_id", note: "Only matching rows" },
    { syntax: "A LEFT JOIN B ON ...", note: "All of A + matches from B" },
    { syntax: "A RIGHT JOIN B ON ...", note: "All of B + matches from A" },
    { syntax: "A FULL OUTER JOIN B ON ...", note: "All rows, matched or not" },
    { syntax: "CROSS JOIN B", note: "Cartesian product" },
  ]},
  { group: "Aggregates", rows: [
    { syntax: "COUNT(*), COUNT(col)", note: "Row count / non-null count" },
    { syntax: "SUM(col), AVG(col)", note: "Total / mean" },
    { syntax: "MIN(col), MAX(col)", note: "Extremes" },
    { syntax: "GROUP BY col", note: "Bucket rows before aggregating" },
    { syntax: "HAVING agg(...) > x", note: "Filter AFTER aggregation" },
  ]},
  { group: "Modifying data", rows: [
    { syntax: "INSERT INTO t (c1,c2) VALUES (v1,v2)", note: "Add row" },
    { syntax: "UPDATE t SET c1 = v WHERE ...", note: "Always use WHERE!" },
    { syntax: "DELETE FROM t WHERE ...", note: "Always use WHERE!" },
    { syntax: "TRUNCATE TABLE t", note: "Fast full wipe, resets identity" },
  ]},
];

const PROS = [
  "Declarative — you describe *what* you want, the engine decides *how*.",
  "Mature, standardized (ANSI SQL) and portable across most relational databases.",
  "Extremely strong for structured, relational data with clear integrity rules (ACID).",
  "Huge ecosystem: tooling, ORMs, BI tools, and hiring pool all assume SQL literacy.",
  "Excellent for complex joins, aggregations, and reporting over structured data.",
];

const CONS = [
  "Rigid schema — structural changes can be costly at large scale.",
  "Not a natural fit for unstructured or rapidly-changing data (documents, graphs).",
  "Vertical scaling has limits; horizontal scaling/sharding needs extra engineering.",
  "Complex queries (deep joins, recursive CTEs) can be hard to read and optimize.",
  "Dialect differences (MySQL vs Postgres vs SQL Server) reduce true portability in practice.",
];

const USE_CASES = [
  { title: "E-commerce", detail: "Product catalogs, orders, inventory, and payment records with strong consistency guarantees." },
  { title: "Banking & Finance", detail: "Ledgers and transactions where ACID compliance is non-negotiable." },
  { title: "Healthcare", detail: "Patient records, scheduling, and billing that require strict relational integrity." },
  { title: "Analytics & BI", detail: "Data warehouses (Snowflake, BigQuery, Redshift) all speak SQL for reporting." },
  { title: "SaaS backends", detail: "Multi-tenant application data — users, subscriptions, permissions." },
  { title: "Logistics", detail: "Fleet, route, and warehouse systems with many interrelated entities." },
];

const FAQ: { q: string; a: string }[] = [
  { q: "Is SQL a programming language?", a: "It's a declarative, domain-specific language for managing relational data — not a general-purpose language like Python or Java. You describe the result you want; the query optimizer decides how to get it." },
  { q: "SQL vs NoSQL — which should I learn first?", a: "Learn SQL first. Relational modeling and set-based thinking transfer well, and most NoSQL systems eventually reintroduce SQL-like query layers (e.g. MongoDB aggregation, Cassandra's CQL)." },
  { q: "Is SQL case-sensitive?", a: "Keywords (SELECT, FROM) are conventionally uppercase but not case-sensitive. Table/column name case-sensitivity depends on the database and OS." },
  { q: "What's the difference between DELETE, TRUNCATE, and DROP?", a: "DELETE removes rows (can be filtered, logged, rolled back). TRUNCATE removes all rows instantly (minimal logging). DROP removes the entire table structure." },
  { q: "What is a primary key vs a foreign key?", a: "A primary key uniquely identifies each row in its own table. A foreign key is a column that references a primary key in another table, enforcing referential integrity." },
];

const BLOG_PARAGRAPHS: { heading: string; body: string }[] = [
  { heading: "Where SQL came from", body: "SQL traces back to IBM's early-1970s work on the relational model (inspired by Edgar F. Codd's 1970 paper) and the original SEQUEL language. It was standardized by ANSI in 1986 and has remained the dominant language for relational databases for over four decades — a rare feat in a field that reinvents itself every few years." },
  { heading: "Why it refused to die", body: "Every generation of \"SQL killers\" — object databases in the 90s, XML databases in the 2000s, NoSQL in the 2010s — ended up re-adding query languages that look a lot like SQL. The reason is simple: relational algebra is a genuinely good abstraction for structured data, and SQL is its most battle-tested syntax." },
  { heading: "SQL today", body: "Modern cloud warehouses (BigQuery, Snowflake, Redshift), NewSQL systems (CockroachDB, YugabyteDB), and even streaming engines (ksqlDB, Flink SQL) all standardized on SQL as their interface — because it's the one query language almost every engineer and analyst already knows." },
  { heading: "Where SQL is heading", body: "Expect deeper AI integration (natural-language-to-SQL copilots), native vector/similarity search inside relational engines, tighter SQL-on-lakehouse tooling, and continued convergence between OLTP and OLAP workloads in a single SQL surface." },
];

const NAV_SECTIONS = [
  { id: "intro", label: "01_introduction" },
  { id: "architecture", label: "02_architecture" },
  { id: "types", label: "03_command_types" },
  { id: "notes", label: "04_detailed_notes" },
  { id: "joins", label: "05_joins_diagram" },
  { id: "roadmap", label: "06_roadmap" },
  { id: "cheatsheet", label: "07_cheat_sheet" },
  { id: "proscons", label: "08_pros_cons" },
  { id: "usecases", label: "09_use_cases" },
  { id: "blog", label: "10_blog" },
  { id: "faq", label: "11_faq" },
];

/* Static class map — Tailwind's compiler needs full class strings to see
   them at build time, so we can't interpolate `bg-${accent}-50` directly. */
const ACCENT_BADGE: Record<string, string> = {
  blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
  emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  violet: "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/30",
  amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
  rose: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30",
};

/* ======================================================================
   SMALL UI PRIMITIVES
   ====================================================================== */

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shadow-sm">
      {label && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-slate-800 bg-slate-900/70">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-2 text-[11px] font-mono text-slate-400">{label}</span>
        </div>
      )}
      <pre className="p-3 sm:p-4 overflow-x-auto text-[12px] sm:text-[13px] leading-relaxed">
        <code className="font-mono text-slate-100 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function SectionEyebrow({ index, label, icon }: { index: string; label: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="font-mono text-xs px-2 py-0.5 rounded border border-blue-600/40 text-blue-600 dark:text-blue-400 dark:border-blue-400/40 bg-blue-50 dark:bg-blue-500/10 shrink-0">
        {index}
      </span>
      {icon && <span className="shrink-0">{icon}</span>}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">{label}</h2>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

/* ======================================================================
   DIAGRAMS
   ====================================================================== */

function ArchitectureDiagram() {
  const steps = [
    { title: "Client / App", detail: "psql, app code, BI tool" },
    { title: "SQL Query", detail: "SELECT * FROM orders ..." },
    { title: "Parser", detail: "Checks syntax, builds parse tree" },
    { title: "Optimizer", detail: "Chooses fastest execution plan" },
    { title: "Execution Engine", detail: "Runs the plan, uses indexes" },
    { title: "Storage Engine", detail: "Reads/writes data files & buffers" },
  ];
  return (
    <>
      {/* Mobile: vertical stack */}
      <div className="flex flex-col gap-0 sm:hidden">
        {steps.map((s, i) => (
          <div key={s.title} className="flex flex-col items-center">
            <div className="w-full flex flex-col justify-center px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-semibold text-sm text-slate-900 dark:text-white">{s.title}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{s.detail}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="py-1 text-slate-300 dark:text-slate-700">
                <svg width="10" height="18" viewBox="0 0 10 18"><path d="M5 0v14M1 10l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Tablet / Desktop: horizontal flow */}
      <div className="hidden sm:flex flex-wrap items-stretch gap-2">
        {steps.map((s, i) => (
          <div key={s.title} className="flex items-stretch">
            <div className="flex flex-col justify-center min-w-[120px] md:min-w-[140px] px-3 md:px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-semibold text-sm text-slate-900 dark:text-white">{s.title}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{s.detail}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex items-center px-1.5 text-slate-300 dark:text-slate-700">
                <svg width="22" height="10" viewBox="0 0 22 10"><path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function JoinVenn({ id, variant, color }: { id: string; variant: "inner" | "left" | "right" | "full"; color: string }) {
  const cA = { x: 78, y: 72, r: 52 };
  const cB = { x: 128, y: 72, r: 52 };
  return (
    <svg viewBox="0 0 206 150" className="w-full max-w-[220px]">
      <defs>
        <clipPath id={`${id}-clipB`}>
          <circle cx={cB.x} cy={cB.y} r={cB.r} />
        </clipPath>
        <clipPath id={`${id}-clipA`}>
          <circle cx={cA.x} cy={cA.y} r={cA.r} />
        </clipPath>
      </defs>

      {variant === "inner" && (
        <circle cx={cA.x} cy={cA.y} r={cA.r} clipPath={`url(#${id}-clipB)`} fill={color} fillOpacity="0.85" />
      )}
      {variant === "left" && <circle cx={cA.x} cy={cA.y} r={cA.r} fill={color} fillOpacity="0.85" />}
      {variant === "right" && <circle cx={cB.x} cy={cB.y} r={cB.r} fill={color} fillOpacity="0.85" />}
      {variant === "full" && (
        <>
          <circle cx={cA.x} cy={cA.y} r={cA.r} fill={color} fillOpacity="0.85" />
          <circle cx={cB.x} cy={cB.y} r={cB.r} fill={color} fillOpacity="0.85" />
        </>
      )}

      <circle cx={cA.x} cy={cA.y} r={cA.r} fill="none" stroke="currentColor" className="text-slate-400 dark:text-slate-600" strokeWidth="1.4" />
      <circle cx={cB.x} cy={cB.y} r={cB.r} fill="none" stroke="currentColor" className="text-slate-400 dark:text-slate-600" strokeWidth="1.4" />
      <text x={cA.x - 34} y={cA.y - 40} className="fill-slate-500 dark:fill-slate-400 font-mono" fontSize="11">A</text>
      <text x={cB.x + 26} y={cB.y - 40} className="fill-slate-500 dark:fill-slate-400 font-mono" fontSize="11">B</text>
    </svg>
  );
}

/* ======================================================================
   MAIN PAGE
   ====================================================================== */

export default function SqlCategoryPage() {
  const [activeSection, setActiveSection] = useState("intro");
  const [cheatGroup, setCheatGroup] = useState(0);
  const [downloaded, setDownloaded] = useState(false);

  const notesText = useMemo(() => buildNotesMarkdown(), []);

  function handleDownload() {
    const blob = new Blob([notesText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SQL-Complete-Notes.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 4500);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Decorative query bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap">
          <span className="text-emerald-600 dark:text-emerald-400">➜</span>
          <span>SELECT * FROM knowledge WHERE topic = </span>
          <span className="text-blue-600 dark:text-blue-400">'SQL'</span>
          <span>;</span>
          <span className="ml-2 w-2 h-4 bg-slate-400 dark:bg-slate-600 animate-pulse" />
        </div>
      </div>

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8 sm:pb-10">
        <div className="flex items-center gap-2 font-mono text-xs text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
          <IconDatabase className="w-4 h-4 shrink-0" />
          <span>CodeNFacts / sql</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          SQL, end to end.
        </h1>
        <p className="mt-3 sm:mt-4 max-w-2xl text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
          What it is, why every backend and analytics stack still leans on it, every command type,
          syntax you can copy-paste, diagrams, a learning roadmap, a cheat sheet, and a downloadable
          notes file to keep for revision.
        </p>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 transition-colors shadow-sm w-full sm:w-auto"
          >
            <IconDownload />
            Download SQL notes
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono text-center sm:text-left">
            ~{Math.round(notesText.split(/\s+/).length / 200)} min read · plain-text, opens anywhere
          </span>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            ["1970", "Relational model proposed"],
            ["1986", "ANSI SQL standardized"],
            ["5", "Core command categories"],
            ["#1", "Most in-demand data language"],
          ].map(([n, l]) => (
            <div key={l} className="rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 sm:p-3">
              <div className="font-mono text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">{n}</div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug">{l}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Mobile section nav — horizontal scroll */}
      <div className="lg:hidden sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none -mx-1 px-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {NAV_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActiveSection(s.id)}
                className={`shrink-0 px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-mono border transition-colors whitespace-nowrap ${
                  activeSection === s.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400"
                }`}
              >
                {s.label.replace(/^\d+_/, "")}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Body: sidebar + content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-10 pt-6 sm:pt-0">
        {/* Schema Explorer sidebar */}
        <nav className="hidden lg:block sticky top-6 self-start">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
            Schema Explorer
          </div>
          <ul className="space-y-0.5 border-l border-slate-200 dark:border-slate-800">
            {NAV_SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                  className={`block pl-3 pr-2 py-1.5 text-sm font-mono border-l-2 -ml-px transition-colors ${
                    activeSection === s.id
                      ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 space-y-14 sm:space-y-20">
          {/* 01 Introduction */}
          <section id="intro" className="scroll-mt-20 lg:scroll-mt-6">
            <SectionEyebrow index="01" label="What is SQL, and why does it exist?" icon={<IconDatabase className="text-blue-600 dark:text-blue-400" />} />
            <div className="prose-slate space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                <strong>SQL (Structured Query Language)</strong> is the standard language for talking to
                relational databases — systems that store data as rows and columns inside related tables
                (think spreadsheets that can reference each other). Instead of writing step-by-step
                instructions, you write a <em>declarative</em> statement describing the result you want,
                and the database's query engine figures out the fastest way to get it.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 not-prose">
                <Card className="p-3.5 sm:p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">Why it's used</h3>
                  <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                    <li>One language works across almost every relational database</li>
                    <li>Set-based operations handle millions of rows efficiently</li>
                    <li>Built-in integrity rules keep data consistent</li>
                    <li>Readable, English-like syntax</li>
                  </ul>
                </Card>
                <Card className="p-3.5 sm:p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">Why it's needed</h3>
                  <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                    <li>Almost every app needs to persist structured data</li>
                    <li>Analytics, reporting, and BI tools all query in SQL</li>
                    <li>It's the common interface between apps, data teams, and DBAs</li>
                    <li>Interviews and real jobs expect fluency in it</li>
                  </ul>
                </Card>
              </div>
            </div>
          </section>

          {/* 02 Architecture */}
          <section id="architecture" className="scroll-mt-20 lg:scroll-mt-6">
            <SectionEyebrow index="02" label="How a query actually runs" icon={<IconLayers className="text-blue-600 dark:text-blue-400" />} />
            <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-sm">
              A block diagram of the journey a query takes from your keyboard to disk and back.
            </p>
            <Card className="p-3 sm:p-5 overflow-x-auto">
              <ArchitectureDiagram />
            </Card>
          </section>

          {/* 03 Command types */}
          <section id="types" className="scroll-mt-20 lg:scroll-mt-6">
            <SectionEyebrow index="03" label="Types of SQL commands" icon={<IconKey className="text-blue-600 dark:text-blue-400" />} />
            <div className="space-y-6 sm:space-y-8">
              {COMMAND_GROUPS.map((g) => (
                <Card key={g.code} className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                    <span className={`font-mono text-xs px-2 py-0.5 rounded border ${ACCENT_BADGE[g.accent]}`}>
                      {g.code}
                    </span>
                    <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white">{g.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 sm:mb-4">{g.desc}</p>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {g.commands.map((c) => (
                      <div key={c.cmd} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{c.cmd}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{c.use}</p>
                        <CodeBlock code={c.example} />
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* 04 Detailed notes */}
          <section id="notes" className="scroll-mt-20 lg:scroll-mt-6">
            <SectionEyebrow index="04" label="Detailed notes — topic by topic" icon={<IconBook className="text-blue-600 dark:text-blue-400" />} />
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {TOPICS.map((t) => (
                <Card key={t.title} className="p-3 sm:p-4 flex flex-col min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">{t.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3">{t.blurb}</p>
                  {t.code && <CodeBlock code={t.code} />}
                </Card>
              ))}
            </div>
          </section>

          {/* 05 Joins diagram */}
          <section id="joins" className="scroll-mt-20 lg:scroll-mt-6">
            <SectionEyebrow index="05" label="Joins, visually" />
            <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 text-sm">
              Shaded area = rows returned. Table A = left table, Table B = right table.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { v: "inner" as const, label: "INNER JOIN", note: "Only matching rows" },
                { v: "left" as const, label: "LEFT JOIN", note: "All of A + matches" },
                { v: "right" as const, label: "RIGHT JOIN", note: "All of B + matches" },
                { v: "full" as const, label: "FULL OUTER JOIN", note: "Everything" },
              ].map((j) => (
                <Card key={j.v} className="p-3 sm:p-4 flex flex-col items-center text-center">
                  <JoinVenn id={j.v} variant={j.v} color="#2563eb" />
                  <div className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">{j.label}</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">{j.note}</div>
                </Card>
              ))}
            </div>
          </section>

          {/* 06 Roadmap */}
          <section id="roadmap" className="scroll-mt-20 lg:scroll-mt-6">
            <SectionEyebrow index="06" label="Learning roadmap" icon={<IconMap className="text-blue-600 dark:text-blue-400" />} />
            <ol className="relative border-l border-slate-200 dark:border-slate-800 ml-2.5 sm:ml-3 space-y-6 sm:space-y-8">
              {ROADMAP.map((stage, i) => (
                <li key={stage.stage} className="pl-5 sm:pl-6 relative">
                  <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">{stage.stage}</h3>
                    <span className="font-mono text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">{stage.timeframe}</span>
                  </div>
                  <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {stage.items.map((item) => (
                      <li key={item} className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                        <IconCheck className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          {/* 07 Cheat sheet */}
          <section id="cheatsheet" className="scroll-mt-20 lg:scroll-mt-6">
            <SectionEyebrow index="07" label="Cheat sheet" />
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
              {CHEATSHEET.map((g, i) => (
                <button
                  key={g.group}
                  onClick={() => setCheatGroup(i)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-mono border transition-colors ${
                    cheatGroup === i
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-400"
                  }`}
                >
                  {g.group}
                </button>
              ))}
            </div>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[280px]">
                  <tbody>
                    {CHEATSHEET[cheatGroup].rows.map((r, i) => (
                      <tr key={r.syntax} className={i % 2 ? "bg-slate-50 dark:bg-slate-900/40" : ""}>
                        <td className="px-3 sm:px-4 py-2.5 font-mono text-[12px] sm:text-[13px] text-blue-700 dark:text-blue-400 whitespace-nowrap border-r border-slate-100 dark:border-slate-800 align-top">
                          {r.syntax}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 text-slate-600 dark:text-slate-400 text-xs sm:text-sm">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          {/* 08 Pros & cons */}
          <section id="proscons" className="scroll-mt-20 lg:scroll-mt-6">
            <SectionEyebrow index="08" label="Good side, bad side" />
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <Card className="p-3.5 sm:p-4 border-emerald-200 dark:border-emerald-500/30">
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5 text-sm sm:text-base">
                  <IconCheck /> Strengths
                </h3>
                <ul className="space-y-2">
                  {PROS.map((p) => (
                    <li key={p} className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                      <span className="text-emerald-500 shrink-0">+</span><span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-3.5 sm:p-4 border-rose-200 dark:border-rose-500/30">
                <h3 className="font-semibold text-rose-700 dark:text-rose-400 mb-3 flex items-center gap-1.5 text-sm sm:text-base">
                  <IconX /> Trade-offs
                </h3>
                <ul className="space-y-2">
                  {CONS.map((c) => (
                    <li key={c} className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                      <span className="text-rose-500 shrink-0">−</span><span>{c}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>

          {/* 09 Use cases */}
          <section id="usecases" className="scroll-mt-20 lg:scroll-mt-6">
            <SectionEyebrow index="09" label="Where SQL shows up" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {USE_CASES.map((u) => (
                <Card key={u.title} className="p-3.5 sm:p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">{u.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{u.detail}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* 10 Blog */}
          <section id="blog" className="scroll-mt-20 lg:scroll-mt-6">
            <SectionEyebrow index="10" label="A short history — and where it's going" />
            <div className="space-y-5 sm:space-y-6">
              {BLOG_PARAGRAPHS.map((b) => (
                <div key={b.heading}>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">{b.heading}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{b.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 11 FAQ */}
          <section id="faq" className="scroll-mt-20 lg:scroll-mt-6">
            <SectionEyebrow index="11" label="Frequently asked questions" />
            <div className="space-y-2.5 sm:space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="group rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 open:bg-slate-50 dark:open:bg-slate-900/40">
                  <summary className="font-medium text-slate-900 dark:text-white cursor-pointer list-none flex items-start justify-between gap-3 text-sm sm:text-base">
                    <span className="flex-1">{f.q}</span>
                    <span className="text-slate-400 group-open:rotate-45 transition-transform shrink-0 mt-0.5">+</span>
                  </summary>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Bottom download CTA */}
          <section className="rounded-2xl border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 p-5 sm:p-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Take these notes with you</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Every section above, bundled into one Markdown file for offline revision.
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 transition-colors shrink-0 w-full sm:w-auto"
            >
              <IconDownload />
              Download SQL notes
            </button>
          </section>
        </main>
      </div>

      {/* Thank-you toast */}
      <div
        aria-live="polite"
        className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 transition-all duration-300 z-30 ${
          downloaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-white dark:bg-slate-900 shadow-lg px-4 py-3 max-w-sm mx-auto sm:mx-0 sm:max-w-xs">
          <span className="mt-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <IconCheck className="w-3.5 h-3.5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Thanks for downloading! 🎉</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your SQL notes are saved. Happy querying!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================================
   NOTES FILE BUILDER — reuses the same data arrays shown on the page so
   the download always matches what's on screen.
   ====================================================================== */

function buildNotesMarkdown(): string {
  const lines: string[] = [];
  lines.push("# SQL — Complete Notes\n");
  lines.push("_Generated from the SQL reference page._\n");

  lines.push("## 1. What is SQL & why it's used\n");
  lines.push(
    "SQL (Structured Query Language) is the standard declarative language for managing data in " +
      "relational databases. You describe the result you want and the query engine decides how to " +
      "compute it efficiently.\n"
  );
  lines.push("**Why it's used:** portable across databases, set-based and efficient at scale, enforces data integrity, readable syntax.\n");
  lines.push("**Why it's needed:** almost every application persists structured data; analytics/BI tooling relies on it; it's the shared language between apps, analysts, and DBAs.\n");

  lines.push("## 2. Query architecture (block diagram)\n");
  lines.push("```\nClient/App -> SQL Query -> Parser -> Optimizer -> Execution Engine -> Storage Engine\n```\n");

  lines.push("## 3. Types of SQL commands\n");
  for (const g of COMMAND_GROUPS) {
    lines.push(`### ${g.code} — ${g.name}\n`);
    lines.push(`${g.desc}\n`);
    for (const c of g.commands) {
      lines.push(`**${c.cmd}** — ${c.use}\n`);
      lines.push("```sql\n" + c.syntax + "\n```\n");
      lines.push("Example:\n```sql\n" + c.example + "\n```\n");
    }
  }

  lines.push("## 4. Detailed topic notes\n");
  for (const t of TOPICS) {
    lines.push(`### ${t.title}\n`);
    lines.push(`${t.blurb}\n`);
    if (t.code) lines.push("```sql\n" + t.code + "\n```\n");
  }

  lines.push("## 5. Joins summary\n");
  lines.push("- INNER JOIN: only matching rows in both tables\n- LEFT JOIN: all of the left table + matches from the right\n- RIGHT JOIN: all of the right table + matches from the left\n- FULL OUTER JOIN: all rows from both, matched or not\n- CROSS JOIN: Cartesian product of both tables\n");

  lines.push("\n## 6. Learning roadmap\n");
  for (const stage of ROADMAP) {
    lines.push(`### ${stage.stage} (${stage.timeframe})\n`);
    for (const item of stage.items) lines.push(`- ${item}`);
    lines.push("");
  }

  lines.push("## 7. Cheat sheet\n");
  for (const g of CHEATSHEET) {
    lines.push(`### ${g.group}\n`);
    for (const r of g.rows) lines.push(`- \`${r.syntax}\` — ${r.note}`);
    lines.push("");
  }

  lines.push("## 8. Strengths & trade-offs\n");
  lines.push("**Strengths**\n");
  for (const p of PROS) lines.push(`- ${p}`);
  lines.push("\n**Trade-offs**\n");
  for (const c of CONS) lines.push(`- ${c}`);

  lines.push("\n## 9. Use cases\n");
  for (const u of USE_CASES) lines.push(`- **${u.title}** — ${u.detail}`);

  lines.push("\n## 10. History & future\n");
  for (const b of BLOG_PARAGRAPHS) {
    lines.push(`### ${b.heading}\n`);
    lines.push(`${b.body}\n`);
  }

  lines.push("## 11. FAQ\n");
  for (const f of FAQ) {
    lines.push(`**Q: ${f.q}**`);
    lines.push(`A: ${f.a}\n`);
  }

  lines.push("---\nThanks for downloading these notes. Happy querying!\n");
  return lines.join("\n");
}