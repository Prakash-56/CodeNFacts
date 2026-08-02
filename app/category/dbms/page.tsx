"use client";

/**
 * category/dbms/page.tsx
 * -----------------------------------------------------------------------
 * A complete, self-contained DBMS reference & study page.
 *
 * Assumptions about your project (adjust if different):
 * 1. Tailwind CSS is configured with `darkMode: "class"`.
 * 2. Your header's light/dark toggle adds/removes the `dark` class on
 *    <html> (e.g. via `next-themes`). This page reacts to that class
 *    through `dark:` utility variants — it does not render its own toggle.
 * 3. No external icon library is required — all icons here are small
 *    hand-rolled inline SVGs, so this file has zero extra dependencies
 *    beyond React + Tailwind.
 *
 * Drop this file at `app/category/dbms/page.tsx` (App Router).
 * -----------------------------------------------------------------------
 */

import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Small inline icon set (stroke-based, currentColor)                 */
/* ------------------------------------------------------------------ */

function Icon({
  d,
  className = "h-5 w-5",
}: {
  d: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  bank: "M3 10l9-6 9 6M4 10v9h16v-9M9 21v-6h6v6M4 21h16",
  cart: "M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6",
  users: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M23 21v-2a4 4 0 0 0-3-3.87M17 3.13a4 4 0 0 1 0 7.75",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z",
  plane: "M10.5 21l1.5-6 6.5-2-1-3-6.5 1-3.5-5.5-2 .5 1.5 6-5.5 1v2l5.5 1-1.5 6 2 .5 2-3.5",
  school: "M3 9l9-5 9 5-9 5-9-5Zm0 0v6c0 1.5 4 3 9 3s9-1.5 9-3V9",
  server: "M4 4h16v6H4V4Zm0 10h16v6H4v-6Zm3-7h.01M7 17h.01",
  chip: "M8 3v3m8-3v3M8 18v3m8-3v3M3 8h3M3 16h3m15-8h-3m3 8h-3M6 6h12v12H6z",
  check: "M20 6 9 17l-5-5",
  x: "M18 6 6 18M6 6l12 12",
  chevron: "M6 9l6 6 6-6",
  download: "M12 3v13m0 0-4-4m4 4 4-4M4 20h16",
  key: "M15 7a4 4 0 1 0-4 4h.5L9 14.5l1.5 1.5L12 14l1 1 3-3-1-1 2-2h-2Z",
  layers: "M12 3 2 8l10 5 10-5-10-5Zm-10 8 10 5 10-5M2 16l10 5 10-5",
  lock: "M6 11V8a6 6 0 1 1 12 0v3M5 11h14v9H5z",
  book: "M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4Zm14 0v13",
};

/* ------------------------------------------------------------------ */
/*  Data — DBMS types                                                  */
/* ------------------------------------------------------------------ */

const DBMS_TYPES = [
  {
    name: "Hierarchical DBMS",
    era: "1960s",
    desc: "Data organized as a tree — each child record has exactly one parent. Fast for fixed, predictable relationships.",
    ex: "IBM IMS",
    good: "One-to-many links, fixed structure",
    bad: "Rigid schema, no many-to-many support",
  },
  {
    name: "Network DBMS",
    era: "1970s",
    desc: "A graph structure — a record can have multiple parents and children, connected via explicit pointers (sets).",
    ex: "IDMS (CODASYL model)",
    good: "Models many-to-many naturally",
    bad: "Complex navigation, hard to redesign",
  },
  {
    name: "Relational DBMS (RDBMS)",
    era: "1970 – present",
    desc: "Data stored in 2-D tables (relations) of rows & columns, linked by keys. Backed by relational algebra & SQL.",
    ex: "MySQL, PostgreSQL, Oracle, SQL Server",
    good: "Strong consistency, mature tooling, SQL standard",
    bad: "Vertical scaling limits, rigid schema changes",
  },
  {
    name: "Object-Oriented DBMS",
    era: "1980s – 90s",
    desc: "Stores data as objects (like in OOP) — combining attributes and behaviour, with inheritance support.",
    ex: "db4o, ObjectDB",
    good: "Natural fit for OOP applications",
    bad: "Smaller ecosystem, steep learning curve",
  },
  {
    name: "NoSQL DBMS",
    era: "2009 – present",
    desc: "Non-relational, schema-flexible stores built for horizontal scale. Four common families: document, key-value, column-family, graph.",
    ex: "MongoDB, Redis, Cassandra, Neo4j",
    good: "Horizontal scale, flexible schema, high throughput",
    bad: "Weaker consistency guarantees (varies by system)",
  },
  {
    name: "NewSQL DBMS",
    era: "2010s – present",
    desc: "Aims for RDBMS-style ACID consistency with NoSQL-style horizontal scalability, often distributed by design.",
    ex: "Google Spanner, CockroachDB, TiDB",
    good: "Scale + strong consistency together",
    bad: "Operationally more complex to run",
  },
];

/* ------------------------------------------------------------------ */
/*  Data — Formulas                                                    */
/* ------------------------------------------------------------------ */

const FORMULAS = [
  {
    topic: "Attribute Closure",
    formula: "X+ = X ∪ { all attributes derivable from X using the FD set F }",
    note: "Used to test whether X determines every attribute of the relation, i.e. whether X is a (super)key.",
  },
  {
    topic: "Candidate Key Test",
    formula: "X is a candidate key ⇔ X+ = R  AND  no proper subset of X has closure R",
    note: "Superkey + minimality (no redundant attribute) = candidate key.",
  },
  {
    topic: "Number of Superkeys",
    formula: "Superkeys = 2^(N − K)",
    note: "N = total attributes, K = attributes in one minimal candidate key (assuming a single known candidate key).",
  },
  {
    topic: "Normalization — 1NF",
    formula: "∀ attribute A ∈ R : A is atomic (no repeating groups / multi-valued cells)",
    note: "First Normal Form removes composite & multi-valued attributes.",
  },
  {
    topic: "Normalization — 2NF",
    formula: "R is in 1NF  AND  no non-prime attribute is partially dependent on a candidate key",
    note: "Only relevant when the primary key is composite.",
  },
  {
    topic: "Normalization — 3NF",
    formula: "R is in 2NF  AND  no non-prime attribute is transitively dependent on a candidate key",
    note: "For every FD X→Y, either X is a superkey OR Y is a prime attribute.",
  },
  {
    topic: "Normalization — BCNF",
    formula: "∀ non-trivial FD  X → Y  in R :  X is a superkey of R",
    note: "Stricter than 3NF — no exception for prime attributes.",
  },
  {
    topic: "Blocking Factor (file organization)",
    formula: "bfr = ⌊ Block size / Record size ⌋",
    note: "Number of records that fit in one disk block.",
  },
  {
    topic: "Number of Blocks Needed",
    formula: "b = ⌈ r / bfr ⌉",
    note: "r = total number of records in the file.",
  },
  {
    topic: "Index Search Cost (binary search on sparse index)",
    formula: "Cost = ⌈ log2(b_index) ⌉ + 1",
    note: "b_index = number of blocks in the index; the +1 accesses the actual data block.",
  },
  {
    topic: "B+ Tree — Approx. Height",
    formula: "h ≈ ⌈ log⌈p/2⌉ (n) ⌉",
    note: "p = order (max children per node), n = number of leaf-level search-key entries.",
  },
  {
    topic: "RAID 5 Storage Efficiency",
    formula: "Usable capacity = ((n − 1) / n) × total disk capacity",
    note: "n = number of disks; one disk's worth of space is used for distributed parity.",
  },
  {
    topic: "Serializability Check",
    formula: "A schedule is conflict-serializable ⇔ its precedence graph is acyclic",
    note: "Draw an edge Ti → Tj if Ti's operation conflicts with and precedes Tj's on the same data item.",
  },
];

/* ------------------------------------------------------------------ */
/*  Data — Full notes topics                                           */
/* ------------------------------------------------------------------ */

type Topic = {
  id: string;
  title: string;
  summary: string;
  points: string[];
  example?: string;
};

const TOPICS: Topic[] = [
  {
    id: "intro",
    title: "1. What is a DBMS?",
    summary:
      "A Database Management System (DBMS) is software that creates, stores, manages, and lets users retrieve data from a database in a controlled, efficient, and secure way, instead of dealing with raw files directly.",
    points: [
      "Acts as an interface between the user/application and the physical database.",
      "Provides languages to define data (DDL), manipulate data (DML), and control access (DCL/TCL).",
      "Ensures data is stored once and accessed consistently by many users and programs.",
      "Examples: MySQL, PostgreSQL, Oracle, SQL Server, MongoDB, SQLite.",
    ],
    example:
      "Instead of every bank branch keeping its own text file of accounts, a DBMS stores all accounts in one governed system that every branch queries safely and consistently.",
  },
  {
    id: "why",
    title: "2. Why do we need a DBMS? (vs. plain File Systems)",
    summary:
      "Before DBMS, applications stored data directly in flat files. That approach breaks down quickly as data and users grow.",
    points: [
      "Data redundancy & inconsistency — the same fact duplicated across files can drift out of sync.",
      "Difficulty in accessing data — every new query needs new application code; no ad-hoc querying.",
      "Data isolation — data scattered across formats/files is hard to combine.",
      "Integrity problems — constraints (e.g. 'balance ≥ 0') must be hand-coded in every program.",
      "Atomicity problems — a crash mid-update can leave files half-updated with no automatic rollback.",
      "Concurrent access anomalies — two users editing the same record simultaneously can corrupt it.",
      "Security problems — file-level permissions can't express 'this user may read but not write column X'.",
    ],
    example:
      "File-system era: a university stores student records in one file and fee records in another; a name change means editing both — miss one and the two go out of sync. A DBMS instead stores it once and enforces the link.",
  },
  {
    id: "no-dbms",
    title: "3. What if there was NO DBMS?",
    summary:
      "Imagining the world without DBMS makes its value obvious.",
    points: [
      "Every application would re-implement its own storage, locking, and recovery logic from scratch.",
      "No standard query language — every data request needs custom code.",
      "No transaction guarantees — a power cut mid-transfer could lose or duplicate money.",
      "No concurrent-access safety — simultaneous writes could silently corrupt data.",
      "No fine-grained security — you could only lock entire files, not rows or columns.",
      "Backups & recovery would be manual, error-prone, and inconsistent across teams.",
    ],
  },
  {
    id: "architecture",
    title: "4. DBMS Architecture — 3-Level (ANSI/SPARC) Schema",
    summary:
      "DBMS design is layered into three schemas so that each level can change independently — this is called data independence.",
    points: [
      "External Level (View Level) — how individual users see their slice of data (custom views).",
      "Conceptual Level (Logical Level) — the full logical structure of the database (tables, relationships, constraints) for the whole organization.",
      "Internal Level (Physical Level) — how data is actually stored on disk (files, indexes, block layout).",
      "Logical Data Independence — you can change the conceptual schema without breaking external views.",
      "Physical Data Independence — you can change storage/indexing without touching the conceptual schema.",
    ],
  },
  {
    id: "data-models",
    title: "5. Data Models",
    summary:
      "A data model is the set of concepts used to describe the structure of a database.",
    points: [
      "Hierarchical Model — tree-shaped, one parent per child.",
      "Network Model — graph-shaped, many-to-many via pointers.",
      "Relational Model — tables (relations) related through keys; today's dominant model.",
      "Entity-Relationship (ER) Model — a conceptual design tool using entities, attributes and relationships.",
      "Object-Oriented Model — data as objects with attributes + methods.",
      "NoSQL models — document, key-value, column-family, graph.",
    ],
  },
  {
    id: "er-model",
    title: "6. ER Model — Entities, Attributes & Relationships",
    summary:
      "The Entity-Relationship model is used to conceptually design a database before it is turned into tables.",
    points: [
      "Entity — a real-world object (e.g. Student, Course). Represented as a rectangle.",
      "Attribute — a property of an entity (e.g. Student.Name). Represented as an oval; underlined if it's a key attribute.",
      "Relationship — an association between entities (e.g. Student 'Enrolls In' Course). Represented as a diamond.",
      "Cardinality — how many instances relate: 1:1, 1:N, or M:N.",
      "Participation — total (double line, every entity must participate) vs. partial (single line, optional).",
      "Weak Entity — an entity with no key attribute of its own; depends on a strong entity (double rectangle).",
    ],
    example:
      "STUDENT (1) ——< ENROLLS >—— (N) COURSE is a many-to-many relationship: one student can enroll in many courses and one course can have many students.",
  },
  {
    id: "keys",
    title: "7. Keys in the Relational Model",
    summary:
      "Keys uniquely identify rows and connect tables to each other.",
    points: [
      "Super Key — any attribute set that uniquely identifies a row (may contain extra attributes).",
      "Candidate Key — a minimal super key (no attribute can be removed and still stay unique).",
      "Primary Key — the candidate key chosen to uniquely identify rows in practice; cannot be NULL.",
      "Alternate Key — a candidate key not chosen as the primary key.",
      "Composite Key — a primary key made of two or more attributes together.",
      "Foreign Key — an attribute in one table that references the primary key of another table, enforcing referential integrity.",
    ],
    example:
      "In ENROLLMENT(StudentID, CourseID, Grade): {StudentID, CourseID} together form the composite primary key, while StudentID alone is a foreign key referencing STUDENT.",
  },
  {
    id: "normalization",
    title: "8. Normalization (1NF → 5NF)",
    summary:
      "Normalization is the process of organizing tables to reduce redundancy and avoid update/insert/delete anomalies, by progressively removing 'bad' functional dependencies.",
    points: [
      "1NF — every cell holds a single atomic value; no repeating groups.",
      "2NF — 1NF + no partial dependency (non-key attribute depending on only part of a composite key).",
      "3NF — 2NF + no transitive dependency (non-key attribute depending on another non-key attribute).",
      "BCNF — every determinant of a functional dependency must be a superkey (stricter than 3NF).",
      "4NF — no multi-valued dependency other than a candidate key → all attributes.",
      "5NF (PJNF) — no join dependency that isn't implied by the candidate keys (table can't be losslessly split further).",
    ],
    example:
      "Unnormalized: Orders(OrderID, CustomerName, CustomerCity, Product, Price) repeats CustomerCity for every order. Splitting into Orders(OrderID, CustomerID, Product, Price) and Customers(CustomerID, CustomerName, CustomerCity) removes the transitive dependency → 3NF.",
  },
  {
    id: "sql-basics",
    title: "9. SQL — DDL, DML, DCL, TCL",
    summary:
      "SQL (Structured Query Language) is split into sub-languages by purpose.",
    points: [
      "DDL (Data Definition Language): CREATE, ALTER, DROP, TRUNCATE — defines structure.",
      "DML (Data Manipulation Language): SELECT, INSERT, UPDATE, DELETE — works with data.",
      "DCL (Data Control Language): GRANT, REVOKE — controls access/permissions.",
      "TCL (Transaction Control Language): COMMIT, ROLLBACK, SAVEPOINT — manages transactions.",
    ],
    example:
      "CREATE TABLE Student(ID INT PRIMARY KEY, Name VARCHAR(50));\nINSERT INTO Student VALUES (1,'Asha');\nUPDATE Student SET Name='Asha R' WHERE ID=1;\nGRANT SELECT ON Student TO 'reader';",
  },
  {
    id: "joins",
    title: "10. Joins",
    summary: "Joins combine rows from two or more tables based on a related column.",
    points: [
      "INNER JOIN — only matching rows from both tables.",
      "LEFT (OUTER) JOIN — all rows from the left table + matches from the right (NULL if none).",
      "RIGHT (OUTER) JOIN — all rows from the right table + matches from the left.",
      "FULL OUTER JOIN — all rows from both tables, matched where possible.",
      "SELF JOIN — a table joined with itself (e.g. employee ↔ manager, both in Employee table).",
      "CROSS JOIN — Cartesian product: every row of A with every row of B.",
    ],
    example:
      "SELECT S.Name, C.Title FROM Student S INNER JOIN Enrolls E ON S.ID = E.StudentID INNER JOIN Course C ON E.CourseID = C.ID;",
  },
  {
    id: "transactions",
    title: "11. Transactions & ACID Properties",
    summary:
      "A transaction is a logical unit of work — a sequence of operations treated as a single, indivisible action.",
    points: [
      "Atomicity — either all operations of a transaction happen, or none do.",
      "Consistency — a transaction takes the database from one valid state to another, respecting all constraints.",
      "Isolation — concurrent transactions don't interfere with each other's intermediate state.",
      "Durability — once committed, changes survive even a system crash.",
      "States of a transaction: Active → Partially Committed → Committed, or Active → Failed → Aborted.",
    ],
    example:
      "A bank transfer (debit A, credit B) must be atomic: if the credit fails after the debit succeeds, the whole transaction rolls back so no money vanishes.",
  },
  {
    id: "concurrency",
    title: "12. Concurrency Control",
    summary:
      "Techniques that let multiple transactions run at the same time without corrupting data.",
    points: [
      "Lock-Based Protocols — shared (S) locks for reads, exclusive (X) locks for writes; Two-Phase Locking (2PL) guarantees serializability.",
      "Timestamp Ordering — each transaction gets a timestamp; operations are ordered so older transactions 'win' conflicts.",
      "Optimistic Concurrency Control — transactions run freely and are validated only at commit time; good for low-conflict workloads.",
      "Multiversion Concurrency Control (MVCC) — keeps multiple versions of a data item so readers never block writers.",
    ],
  },
  {
    id: "deadlock",
    title: "13. Deadlock",
    summary:
      "A deadlock happens when two or more transactions wait forever for locks held by each other.",
    points: [
      "Detection — build a wait-for graph; a cycle means deadlock. Abort one transaction to break it.",
      "Prevention — order resource requests (e.g. wait-die, wound-wait schemes) so cycles can't form.",
      "Avoidance — grant a lock only if the resulting state is proven safe (similar in spirit to the Banker's Algorithm from OS).",
      "Timeout-based — abort a transaction if it waits beyond a threshold.",
    ],
  },
  {
    id: "indexing",
    title: "14. Indexing",
    summary:
      "An index is an auxiliary structure that speeds up data retrieval at the cost of extra storage & slower writes.",
    points: [
      "Primary Index — built on the primary key of a sorted (ordered) file.",
      "Clustering Index — built on a non-key field that determines physical row order.",
      "Secondary Index — built on a non-ordering field; always dense.",
      "Dense vs. Sparse — dense has an entry for every record; sparse has one entry per block.",
      "B-Tree / B+ Tree — balanced, self-organizing multi-level index structures used by virtually all production DBMSs.",
      "Hash Index — great for exact-match lookups, poor for range queries.",
    ],
  },
  {
    id: "query-processing",
    title: "15. Query Processing & Optimization",
    summary:
      "How a DBMS turns a declarative SQL query into an efficient execution plan.",
    points: [
      "Parsing & Translation — SQL is checked for syntax/semantics and converted into a relational-algebra expression.",
      "Optimization — the query optimizer evaluates multiple equivalent plans (join orders, index usage) and picks the cheapest by estimated cost.",
      "Execution — the chosen plan runs via the execution engine, pulling data through the storage manager.",
      "Cost is typically estimated in terms of disk I/O — the classic bottleneck.",
    ],
  },
  {
    id: "recovery",
    title: "16. Backup & Recovery",
    summary:
      "Techniques to restore the database to a consistent state after a crash.",
    points: [
      "Log-Based Recovery — every change is written to a log before it touches the database (write-ahead logging, WAL).",
      "Checkpoints — periodic snapshots so recovery doesn't have to replay the entire log.",
      "Shadow Paging — maintains two page tables (current & shadow); commit simply switches the pointer.",
      "Deferred vs. Immediate Update — deferred writes only at commit; immediate writes right away but logs 'undo' info.",
    ],
  },
  {
    id: "distributed-nosql",
    title: "17. Distributed DBMS & NoSQL",
    summary:
      "Modern systems often split or reshape data across many machines for scale.",
    points: [
      "Distributed DBMS — data is spread (partitioned/replicated) across multiple sites but appears as one logical database.",
      "CAP Theorem — a distributed system can only fully guarantee two of Consistency, Availability, Partition-tolerance at once.",
      "Document Stores — JSON-like documents (MongoDB).",
      "Key-Value Stores — simple, extremely fast lookups (Redis, DynamoDB).",
      "Column-Family Stores — optimized for huge write throughput & wide tables (Cassandra, HBase).",
      "Graph Databases — optimized for traversing relationships (Neo4j).",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Data — Cheat sheet, imp questions, use cases, features, timeline   */
/* ------------------------------------------------------------------ */

const CHEAT_SHEET = [
  { group: "DDL", items: ["CREATE TABLE", "ALTER TABLE", "DROP TABLE", "TRUNCATE TABLE"] },
  { group: "DML", items: ["SELECT", "INSERT INTO", "UPDATE ... SET", "DELETE FROM"] },
  { group: "DCL", items: ["GRANT", "REVOKE"] },
  { group: "TCL", items: ["COMMIT", "ROLLBACK", "SAVEPOINT"] },
  { group: "Clauses", items: ["WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT"] },
  { group: "Joins", items: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "SELF JOIN"] },
  { group: "Aggregates", items: ["COUNT()", "SUM()", "AVG()", "MIN()", "MAX()"] },
  { group: "Normal Forms", items: ["1NF: atomic values", "2NF: no partial dep.", "3NF: no transitive dep.", "BCNF: LHS is superkey"] },
  { group: "Keys", items: ["Super Key", "Candidate Key", "Primary Key", "Foreign Key", "Composite Key"] },
  { group: "ACID", items: ["Atomicity", "Consistency", "Isolation", "Durability"] },
];

const IMP_QUESTIONS = [
  { q: "What is the difference between DELETE, TRUNCATE and DROP?", a: "DELETE removes rows (can be rolled back, fires triggers, keeps structure), TRUNCATE removes all rows fast (resets identity, minimal logging), DROP removes the whole table structure." },
  { q: "What is the difference between a Primary Key and a Unique Key?", a: "A table can have only one Primary Key (no NULLs allowed) but multiple Unique Keys (one NULL typically allowed)." },
  { q: "What is normalization and why is it needed?", a: "Normalization organizes data to remove redundancy and prevent insert/update/delete anomalies by satisfying progressively stricter normal forms." },
  { q: "What is denormalization?", a: "The deliberate introduction of redundancy (merging tables) to improve read performance, trading off some normalization for speed." },
  { q: "Difference between 2-tier and 3-tier architecture?", a: "2-tier: client talks directly to the database. 3-tier: client → application server → database, adding a business-logic layer in between." },
  { q: "What is a view?", a: "A virtual table defined by a stored SQL query; it doesn't store data itself but presents a customized view of underlying tables." },
  { q: "What is the difference between clustered and non-clustered index?", a: "A clustered index determines the physical order of data rows (one per table); a non-clustered index is a separate structure with pointers back to the data (many allowed per table)." },
  { q: "What are ACID properties?", a: "Atomicity, Consistency, Isolation, Durability — the four guarantees a transaction provides." },
  { q: "What is a deadlock and how is it resolved?", a: "A cycle of transactions each waiting on the other's locks; resolved via detection (wait-for graph + abort), prevention, or timeouts." },
  { q: "What is the CAP theorem?", a: "A distributed system can guarantee at most two of Consistency, Availability, and Partition tolerance at the same time." },
];

const USE_CASES = [
  { icon: ICONS.bank, title: "Banking & Finance", desc: "Account balances, transaction ledgers, fraud detection — needs strict ACID guarantees." },
  { icon: ICONS.cart, title: "E-Commerce", desc: "Product catalogs, orders, inventory, recommendation data — mixes RDBMS + NoSQL." },
  { icon: ICONS.users, title: "Social Media", desc: "Massive-scale user graphs and feeds — often graph & column-family databases." },
  { icon: ICONS.heart, title: "Healthcare", desc: "Patient records, prescriptions, lab results — high integrity & strict access control." },
  { icon: ICONS.plane, title: "Airlines & Travel", desc: "Seat inventory, bookings, real-time pricing — needs high concurrency handling." },
  { icon: ICONS.school, title: "Education", desc: "Student records, grades, course enrollment (classic ER-model example)." },
  { icon: ICONS.server, title: "Telecom", desc: "Call detail records at huge volume/velocity — often NoSQL / distributed DBMS." },
  { icon: ICONS.chip, title: "Government & Public Records", desc: "Identity, land, tax records — needs auditability, durability, and security." },
];

const FEATURES = [
  "Minimizes data redundancy through normalization",
  "Enforces data integrity via constraints (PK, FK, CHECK, NOT NULL)",
  "Supports concurrent multi-user access safely",
  "Provides backup & recovery after crashes",
  "Offers a standard query language (SQL) for ad-hoc access",
  "Implements security through authentication & fine-grained authorization",
  "Achieves data independence — physical storage can change without breaking apps",
  "Manages transactions with ACID guarantees",
];

const TIMELINE = [
  { era: "1960s", title: "Flat Files & Hierarchical Model", desc: "IBM's IMS introduces tree-structured data — first real step beyond raw files." },
  { era: "1970", title: "The Relational Model", desc: "Edgar F. Codd publishes the relational model, laying the foundation for modern RDBMS and SQL." },
  { era: "1980s–90s", title: "Commercial RDBMS Boom", desc: "Oracle, DB2, Sybase, and later MySQL & PostgreSQL bring relational databases into mainstream business." },
  { era: "2000s", title: "Web Scale & Object-Relational", desc: "The web era pushes databases to handle far more concurrent users; object-relational features emerge." },
  { era: "2009+", title: "The NoSQL Movement", desc: "MongoDB, Cassandra, Redis, Neo4j — trading strict schemas/consistency for horizontal scale & flexibility (Big Data)." },
  { era: "2010s", title: "NewSQL & Cloud Databases", desc: "Spanner, CockroachDB — distributed scale with SQL guarantees; databases move to fully managed cloud services." },
  { era: "2020s →", title: "AI-Native & Autonomous Databases", desc: "Vector databases for AI embeddings, self-tuning/autonomous DBMSs, and serverless, usage-billed database platforms." },
];

/* ------------------------------------------------------------------ */
/*  Reusable UI bits                                                    */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#3454D1]/25 bg-[#3454D1]/[0.06] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#3454D1] dark:border-[#7C93F5]/30 dark:bg-[#7C93F5]/[0.08] dark:text-[#A9BAFA]">
      {children}
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  desc,
}: {
  kicker: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <Eyebrow>{kicker}</Eyebrow>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-[#10131A] dark:text-[#F1F1F7] sm:text-4xl">
        {title}
      </h2>
      {desc && (
        <p className="mt-3 text-[15px] leading-relaxed text-[#4A4B57] dark:text-[#B7B8C4]">
          {desc}
        </p>
      )}
    </div>
  );
}

function TableRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-[#E4E4EC] px-3 py-2 font-mono text-[12.5px] text-[#2A2B36] last:border-0 dark:border-[#232733] dark:text-[#D6D7E1]">
      <span className="h-1.5 w-1.5 shrink-0 rounded-[2px] bg-[#E8A93A]" />
      {label}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagrams (inline SVG)                                              */
/* ------------------------------------------------------------------ */

function ERDiagram() {
  return (
    <svg viewBox="0 0 640 260" className="w-full">
      <defs>
        <marker id="dot" markerWidth="6" markerHeight="6" refX="3" refY="3">
          <circle cx="3" cy="3" r="2.4" className="fill-[#E8A93A]" />
        </marker>
      </defs>

      {/* connecting lines */}
      <line x1="150" y1="130" x2="290" y2="130" className="stroke-[#3454D1]/60 dark:stroke-[#7C93F5]/60" strokeWidth="2" />
      <line x1="350" y1="130" x2="490" y2="130" className="stroke-[#3454D1]/60 dark:stroke-[#7C93F5]/60" strokeWidth="2" />

      {/* STUDENT entity */}
      <rect x="20" y="95" width="130" height="70" rx="4" className="fill-white stroke-[#3454D1] dark:fill-[#12141C]" strokeWidth="2" />
      <text x="85" y="135" textAnchor="middle" className="fill-[#10131A] dark:fill-[#F1F1F7]" fontSize="14" fontWeight="600">STUDENT</text>

      {/* ENROLLS relationship (diamond) */}
      <polygon points="290,100 350,130 290,160 230,130" className="fill-white stroke-[#E8A93A] dark:fill-[#12141C]" strokeWidth="2" />
      <text x="290" y="134" textAnchor="middle" className="fill-[#10131A] dark:fill-[#F1F1F7]" fontSize="11.5" fontWeight="600">ENROLLS</text>

      {/* COURSE entity */}
      <rect x="490" y="95" width="130" height="70" rx="4" className="fill-white stroke-[#3454D1] dark:fill-[#12141C]" strokeWidth="2" />
      <text x="555" y="135" textAnchor="middle" className="fill-[#10131A] dark:fill-[#F1F1F7]" fontSize="14" fontWeight="600">COURSE</text>

      {/* cardinalities */}
      <text x="205" y="120" textAnchor="middle" className="fill-[#4A4B57] dark:fill-[#B7B8C4]" fontSize="12">1</text>
      <text x="465" y="120" textAnchor="middle" className="fill-[#4A4B57] dark:fill-[#B7B8C4]" fontSize="12">N</text>

      {/* attributes for STUDENT */}
      <ellipse cx="85" cy="45" rx="42" ry="16" className="fill-white stroke-[#8A8B99] dark:fill-[#12141C]" strokeWidth="1.4" />
      <text x="85" y="49" textAnchor="middle" className="fill-[#10131A] dark:fill-[#F1F1F7]" fontSize="10.5" textDecoration="underline">StudentID</text>
      <line x1="85" y1="61" x2="85" y2="95" className="stroke-[#8A8B99] dark:stroke-[#4C4D59]" strokeWidth="1.4" />

      <ellipse cx="15" cy="215" rx="34" ry="16" className="fill-white stroke-[#8A8B99] dark:fill-[#12141C]" strokeWidth="1.4" />
      <text x="15" y="219" textAnchor="middle" className="fill-[#10131A] dark:fill-[#F1F1F7]" fontSize="10.5">Name</text>
      <line x1="15" y1="199" x2="60" y2="165" className="stroke-[#8A8B99] dark:stroke-[#4C4D59]" strokeWidth="1.4" />

      {/* attributes for COURSE */}
      <ellipse cx="555" cy="45" rx="42" ry="16" className="fill-white stroke-[#8A8B99] dark:fill-[#12141C]" strokeWidth="1.4" />
      <text x="555" y="49" textAnchor="middle" className="fill-[#10131A] dark:fill-[#F1F1F7]" fontSize="10.5" textDecoration="underline">CourseID</text>
      <line x1="555" y1="61" x2="555" y2="95" className="stroke-[#8A8B99] dark:stroke-[#4C4D59]" strokeWidth="1.4" />

      <ellipse cx="610" cy="215" rx="36" ry="16" className="fill-white stroke-[#8A8B99] dark:fill-[#12141C]" strokeWidth="1.4" />
      <text x="610" y="219" textAnchor="middle" className="fill-[#10131A] dark:fill-[#F1F1F7]" fontSize="10.5">Title</text>
      <line x1="610" y1="199" x2="575" y2="165" className="stroke-[#8A8B99] dark:stroke-[#4C4D59]" strokeWidth="1.4" />

      {/* relationship attribute: Grade */}
      <ellipse cx="290" cy="215" rx="36" ry="16" className="fill-white stroke-[#8A8B99] dark:fill-[#12141C]" strokeWidth="1.4" />
      <text x="290" y="219" textAnchor="middle" className="fill-[#10131A] dark:fill-[#F1F1F7]" fontSize="10.5">Grade</text>
      <line x1="290" y1="199" x2="290" y2="160" className="stroke-[#8A8B99] dark:stroke-[#4C4D59]" strokeWidth="1.4" />
    </svg>
  );
}

function ArchitectureDiagram() {
  const levels = [
    { title: "External Level", sub: "User views — View A, View B, View C", color: "#3454D1" },
    { title: "Conceptual Level", sub: "Full logical schema — all tables, relationships, constraints", color: "#E8A93A" },
    { title: "Internal Level", sub: "Physical storage — files, blocks, indexes on disk", color: "#2F9E63" },
  ];
  return (
    <div className="flex flex-col gap-3">
      {levels.map((l, i) => (
        <div key={l.title} className="relative">
          <div
            className="rounded-lg border-2 bg-white px-5 py-4 dark:bg-[#12141C]"
            style={{ borderColor: l.color }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: l.color }}>
                Level {i + 1}
              </span>
              <span className="font-mono text-[11px] text-[#8A8B99]">
                {i === 0 ? "closest to user" : i === 2 ? "closest to disk" : "central schema"}
              </span>
            </div>
            <div className="mt-1 font-display text-base font-semibold text-[#10131A] dark:text-[#F1F1F7]">{l.title}</div>
            <div className="mt-1 text-sm text-[#4A4B57] dark:text-[#B7B8C4]">{l.sub}</div>
          </div>
          {i < levels.length - 1 && (
            <div className="flex justify-center py-1">
              <Icon d={ICONS.chevron} className="h-4 w-4 rotate-180 text-[#8A8B99]" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function QueryFlowDiagram() {
  const steps = [
    "SQL Query",
    "Parser (syntax + semantic check)",
    "Query Optimizer (choose best plan)",
    "Execution Engine",
    "Storage Manager",
    "Result Set",
  ];
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {steps.map((s, i) => (
        <div
          key={s}
          className="flex items-center gap-3 rounded-lg border border-[#E4E4EC] bg-white px-4 py-3 dark:border-[#232733] dark:bg-[#12141C]"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3454D1] font-mono text-[11px] font-semibold text-white">
            {i + 1}
          </span>
          <span className="text-[13px] font-medium text-[#2A2B36] dark:text-[#D6D7E1]">{s}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Accordion for the notes section                                    */
/* ------------------------------------------------------------------ */

function TopicAccordion({ topic, open, onToggle }: { topic: Topic; open: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-xl border border-[#E4E4EC] bg-white dark:border-[#232733] dark:bg-[#12141C]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-[15px] font-semibold text-[#10131A] dark:text-[#F1F1F7]">
          {topic.title}
        </span>
        <Icon
          d={ICONS.chevron}
          className={`h-4 w-4 shrink-0 text-[#8A8B99] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-[#E4E4EC] px-5 py-4 dark:border-[#232733]">
          <p className="text-[14px] leading-relaxed text-[#4A4B57] dark:text-[#B7B8C4]">{topic.summary}</p>
          <ul className="mt-3 space-y-2">
            {topic.points.map((p) => (
              <li key={p} className="flex gap-2 text-[13.5px] leading-relaxed text-[#2A2B36] dark:text-[#D6D7E1]">
                <Icon d={ICONS.check} className="mt-0.5 h-4 w-4 shrink-0 text-[#2F9E63]" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          {topic.example && (
            <div className="mt-4 rounded-lg bg-[#F7F7FB] p-3 dark:bg-[#181B24]">
              <div className="mb-1 font-mono text-[10.5px] uppercase tracking-wider text-[#8A8B99]">Example</div>
              <pre className="whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed text-[#2A2B36] dark:text-[#D6D7E1]">
                {topic.example}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Notes-file generator (for the download button)                     */
/* ------------------------------------------------------------------ */

function buildNotesText() {
  const lines: string[] = [];
  lines.push("DBMS — COMPLETE STUDY NOTES");
  lines.push("Generated from the DBMS reference page");
  lines.push("=".repeat(60));
  lines.push("");

  lines.push("TYPES OF DBMS");
  lines.push("-".repeat(60));
  DBMS_TYPES.forEach((t) => {
    lines.push(`• ${t.name} (${t.era})`);
    lines.push(`  ${t.desc}`);
    lines.push(`  Examples: ${t.ex}`);
    lines.push(`  Strengths: ${t.good} | Weaknesses: ${t.bad}`);
    lines.push("");
  });

  lines.push("");
  lines.push("KEY FORMULAS");
  lines.push("-".repeat(60));
  FORMULAS.forEach((f) => {
    lines.push(`• ${f.topic}`);
    lines.push(`  ${f.formula}`);
    lines.push(`  Note: ${f.note}`);
    lines.push("");
  });

  lines.push("");
  lines.push("DETAILED NOTES — ALL TOPICS");
  lines.push("-".repeat(60));
  TOPICS.forEach((t) => {
    lines.push(t.title);
    lines.push(t.summary);
    t.points.forEach((p) => lines.push(`  - ${p}`));
    if (t.example) {
      lines.push(`  Example: ${t.example}`);
    }
    lines.push("");
  });

  lines.push("");
  lines.push("CHEAT SHEET");
  lines.push("-".repeat(60));
  CHEAT_SHEET.forEach((c) => {
    lines.push(`${c.group}: ${c.items.join(", ")}`);
  });

  lines.push("");
  lines.push("IMPORTANT QUESTIONS (IMP)");
  lines.push("-".repeat(60));
  IMP_QUESTIONS.forEach((q, i) => {
    lines.push(`Q${i + 1}. ${q.q}`);
    lines.push(`A${i + 1}. ${q.a}`);
    lines.push("");
  });

  lines.push("");
  lines.push("WHERE DBMS IS USED");
  lines.push("-".repeat(60));
  USE_CASES.forEach((u) => lines.push(`• ${u.title} — ${u.desc}`));

  lines.push("");
  lines.push("FEATURES OF A DBMS");
  lines.push("-".repeat(60));
  FEATURES.forEach((f) => lines.push(`• ${f}`));

  lines.push("");
  lines.push("EVOLUTION & FUTURE OF DBMS");
  lines.push("-".repeat(60));
  TIMELINE.forEach((t) => lines.push(`${t.era} — ${t.title}: ${t.desc}`));

  lines.push("");
  lines.push("=".repeat(60));
  lines.push("Thanks for downloading — good luck with your exams!");

  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/*  Download button + thank-you toast                                  */
/* ------------------------------------------------------------------ */

function DownloadNotesButton() {
  const [showThanks, setShowThanks] = useState(false);
  const notesText = useMemo(() => buildNotesText(), []);

  function handleDownload() {
    const blob = new Blob([notesText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DBMS-Complete-Notes.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setShowThanks(true);
    window.setTimeout(() => setShowThanks(false), 4000);
  }

  return (
    <>
      <button
        onClick={handleDownload}
        className="group inline-flex items-center gap-2.5 rounded-full bg-[#10131A] px-6 py-3 font-medium text-white shadow-sm transition hover:bg-[#3454D1] dark:bg-[#F1F1F7] dark:text-[#10131A] dark:hover:bg-[#7C93F5]"
      >
        <Icon d={ICONS.download} className="h-4.5 w-4.5 transition-transform group-hover:translate-y-0.5" />
        Download DBMS Notes
      </button>

      {showThanks && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-[#E4E4EC] bg-white px-5 py-4 shadow-xl dark:border-[#232733] dark:bg-[#12141C]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2F9E63]/10">
            <Icon d={ICONS.check} className="h-5 w-5 text-[#2F9E63]" />
          </div>
          <div>
            <div className="font-display text-sm font-semibold text-[#10131A] dark:text-[#F1F1F7]">
              Thank you for downloading! 🎉
            </div>
            <div className="text-[12.5px] text-[#4A4B57] dark:text-[#B7B8C4]">
              Hope these DBMS notes help — good luck with your exams!
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "types", label: "Types" },
  { id: "architecture", label: "Architecture" },
  { id: "formulas", label: "Formulas" },
  { id: "notes", label: "Full Notes" },
  { id: "cheatsheet", label: "Cheat Sheet" },
  { id: "imp", label: "Imp. Questions" },
  { id: "usecases", label: "Where It's Used" },
  { id: "future", label: "Future" },
];

export default function DBMSPage() {
  const [openTopic, setOpenTopic] = useState<string | null>(TOPICS[0].id);

  return (
    <main className="min-h-screen bg-white text-[#10131A] transition-colors duration-200 dark:bg-[#0B0D12] dark:text-[#F1F1F7]">
      {/* ---------------------------------------------------------- */}
      {/* Sticky in-page nav (this page's own section nav, not the site header) */}
      {/* ---------------------------------------------------------- */}
      <nav className="sticky top-0 z-40 overflow-x-auto border-b border-[#E4E4EC] bg-white/90 backdrop-blur dark:border-[#232733] dark:bg-[#0B0D12]/90">
        <div className="mx-auto flex max-w-6xl gap-1 px-4 py-2.5">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[12px] text-[#4A4B57] transition hover:bg-[#F7F7FB] hover:text-[#10131A] dark:text-[#B7B8C4] dark:hover:bg-[#181B24] dark:hover:text-[#F1F1F7]"
            >
              {n.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ---------------------------------------------------------- */}
      {/* Hero                                                        */}
      {/* ---------------------------------------------------------- */}
      <section id="overview" className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Eyebrow>Database Management Systems</Eyebrow>
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              DBMS - the layer that turns
              <span className="text-[#3454D1] dark:text-[#7C93F5]"> raw data </span>
              into something trustworthy
            </h1>
            <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-[#4A4B57] dark:text-[#B7B8C4]">
              A <strong>Database Management System</strong> is the software layer that
              stores, organizes, secures, and serves data - reliably, for many users
              at once - so applications never have to reinvent storage, locking, or
              recovery from scratch. This page is a complete reference: concepts,
              formulas, architecture, cheat sheets, and downloadable notes.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <DownloadNotesButton />
              <a
                href="#notes"
                className="inline-flex items-center gap-2 rounded-full border border-[#E4E4EC] px-6 py-3 font-medium text-[#10131A] transition hover:border-[#3454D1] hover:text-[#3454D1] dark:border-[#232733] dark:text-[#F1F1F7] dark:hover:border-[#7C93F5] dark:hover:text-[#7C93F5]"
              >
                Read full notes
              </a>
            </div>
            <p className="mt-4 font-mono text-[11.5px] text-[#8A8B99]">
              Happy Learning ..
            </p>
          </div>

          <div className="rounded-2xl border border-[#E4E4EC] bg-[#F7F7FB] p-6 dark:border-[#232733] dark:bg-[#12141C]">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-[#8A8B99]">
              ER Diagram — a minimal example
            </div>
            <ERDiagram />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Why / What-if-no-DBMS / Features                            */}
      {/* ---------------------------------------------------------- */}
      <section className="border-t border-[#E4E4EC] bg-[#F7F7FB] py-16 dark:border-[#232733] dark:bg-[#0E1016]">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            kicker="Why it exists"
            title="Why DBMS is needed — and what breaks without it"
            desc="Every core DBMS concept exists to solve a real problem that plain files can't."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {TOPICS.find((t) => t.id === "why")!.points.map((p) => (
              <div key={p} className="flex gap-3 rounded-xl border border-[#E4E4EC] bg-white p-4 dark:border-[#232733] dark:bg-[#12141C]">
                <Icon d={ICONS.x} className="mt-0.5 h-4 w-4 shrink-0 text-[#D14343]" />
                <span className="text-[13.5px] leading-relaxed text-[#2A2B36] dark:text-[#D6D7E1]">{p}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 font-display text-lg font-semibold">If there were no DBMS…</h3>
              <ul className="space-y-2">
                {TOPICS.find((t) => t.id === "no-dbms")!.points.map((p) => (
                  <li key={p} className="flex gap-2 text-[13.5px] leading-relaxed text-[#4A4B57] dark:text-[#B7B8C4]">
                    <Icon d={ICONS.x} className="mt-0.5 h-4 w-4 shrink-0 text-[#D14343]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-display text-lg font-semibold">Is it actually helpful? — Core features</h3>
              <ul className="space-y-2">
                {FEATURES.map((f) => (
                  <li key={f} className="flex gap-2 text-[13.5px] leading-relaxed text-[#2A2B36] dark:text-[#D6D7E1]">
                    <Icon d={ICONS.check} className="mt-0.5 h-4 w-4 shrink-0 text-[#2F9E63]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Types of DBMS                                                */}
      {/* ---------------------------------------------------------- */}
      <section id="types" className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          kicker="Taxonomy"
          title="Types of DBMS"
          desc="From rigid tree structures to horizontally-scaled cloud systems — each generation solved the limits of the one before it."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DBMS_TYPES.map((t) => (
            <div key={t.name} className="flex flex-col rounded-xl border border-[#E4E4EC] bg-white p-5 dark:border-[#232733] dark:bg-[#12141C]">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-[15px] font-semibold">{t.name}</span>
                <span className="font-mono text-[10.5px] text-[#8A8B99]">{t.era}</span>
              </div>
              <p className="text-[13px] leading-relaxed text-[#4A4B57] dark:text-[#B7B8C4]">{t.desc}</p>
              <div className="mt-3 space-y-1 border-t border-[#E4E4EC] pt-3 text-[12px] dark:border-[#232733]">
                <div><span className="text-[#8A8B99]">Examples:</span> {t.ex}</div>
                <div className="text-[#2F9E63]">+ {t.good}</div>
                <div className="text-[#D14343]">– {t.bad}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Architecture / block diagrams                                */}
      {/* ---------------------------------------------------------- */}
      <section id="architecture" className="border-t border-[#E4E4EC] bg-[#F7F7FB] py-16 dark:border-[#232733] dark:bg-[#0E1016]">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            kicker="Block diagrams"
            title="Architecture & how a DBMS works"
            desc="The 3-level ANSI/SPARC architecture separates how users see data, how it's logically organized, and how it's physically stored."
          />
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 font-display text-base font-semibold">3-Level Schema Architecture</h3>
              <ArchitectureDiagram />
            </div>
            <div>
              <h3 className="mb-3 font-display text-base font-semibold">How a query flows through a DBMS</h3>
              <QueryFlowDiagram />
              <p className="mt-4 text-[13px] leading-relaxed text-[#4A4B57] dark:text-[#B7B8C4]">
                Every SQL statement is parsed, optimized into an efficient execution
                plan, run by the execution engine, and served from/to the storage
                manager — which handles buffering, indexes, and disk I/O underneath.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Formulas                                                     */}
      {/* ---------------------------------------------------------- */}
      <section id="formulas" className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          kicker="Quick math"
          title="Key formulas you need"
          desc="The recurring calculations across keys, normalization, indexing, and storage."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {FORMULAS.map((f) => (
            <div key={f.topic} className="rounded-xl border border-[#E4E4EC] bg-white p-4 dark:border-[#232733] dark:bg-[#12141C]">
              <div className="mb-1.5 font-display text-[13.5px] font-semibold">{f.topic}</div>
              <div className="mb-1.5 rounded-md bg-[#F7F7FB] px-3 py-2 font-mono text-[12.5px] text-[#3454D1] dark:bg-[#181B24] dark:text-[#A9BAFA]">
                {f.formula}
              </div>
              <div className="text-[12px] leading-relaxed text-[#4A4B57] dark:text-[#B7B8C4]">{f.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Full notes (accordion covering every topic)                  */}
      {/* ---------------------------------------------------------- */}
      <section id="notes" className="border-t border-[#E4E4EC] bg-[#F7F7FB] py-16 dark:border-[#232733] dark:bg-[#0E1016]">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            kicker="Detailed notes"
            title="Full DBMS notes — every topic, with examples"
            desc="Click a topic to expand it. This is the same content bundled into the downloadable notes file."
          />
          <div className="space-y-3">
            {TOPICS.map((t) => (
              <TopicAccordion
                key={t.id}
                topic={t}
                open={openTopic === t.id}
                onToggle={() => setOpenTopic(openTopic === t.id ? null : t.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Cheat sheet                                                  */}
      {/* ---------------------------------------------------------- */}
      <section id="cheatsheet" className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          kicker="Quick reference"
          title="DBMS / SQL cheat sheet"
          desc="A fast lookup table for the night before an exam or interview."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHEAT_SHEET.map((c) => (
            <div key={c.group} className="rounded-xl border border-[#E4E4EC] bg-white dark:border-[#232733] dark:bg-[#12141C]">
              <div className="border-b border-[#E4E4EC] px-3 py-2 font-display text-[13px] font-semibold dark:border-[#232733]">
                {c.group}
              </div>
              {c.items.map((i) => (
                <TableRow key={i} label={i} />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Important questions                                          */}
      {/* ---------------------------------------------------------- */}
      <section id="imp" className="border-t border-[#E4E4EC] bg-[#F7F7FB] py-16 dark:border-[#232733] dark:bg-[#0E1016]">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            kicker="Exam-ready"
            title="Important questions (IMP)"
            desc="Frequently asked DBMS questions in exams and interviews, answered concisely."
          />
          <div className="space-y-3">
            {IMP_QUESTIONS.map((q, i) => (
              <div key={q.q} className="rounded-xl border border-[#E4E4EC] bg-white p-4 dark:border-[#232733] dark:bg-[#12141C]">
                <div className="mb-1 font-display text-[13.5px] font-semibold">
                  Q{i + 1}. {q.q}
                </div>
                <div className="text-[13px] leading-relaxed text-[#4A4B57] dark:text-[#B7B8C4]">{q.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Use cases                                                    */}
      {/* ---------------------------------------------------------- */}
      <section id="usecases" className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          kicker="Real world"
          title="Where DBMS is used most"
          desc="Almost every serious application relies on a DBMS somewhere in its stack."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((u) => (
            <div key={u.title} className="rounded-xl border border-[#E4E4EC] bg-white p-4 dark:border-[#232733] dark:bg-[#12141C]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#3454D1]/10 text-[#3454D1] dark:bg-[#7C93F5]/10 dark:text-[#7C93F5]">
                <Icon d={u.icon} className="h-4.5 w-4.5" />
              </div>
              <div className="mb-1 font-display text-[13.5px] font-semibold">{u.title}</div>
              <div className="text-[12.5px] leading-relaxed text-[#4A4B57] dark:text-[#B7B8C4]">{u.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Evolution & future                                           */}
      {/* ---------------------------------------------------------- */}
      <section id="future" className="border-t border-[#E4E4EC] bg-[#F7F7FB] py-16 dark:border-[#232733] dark:bg-[#0E1016]">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            kicker="Evolution"
            title="How DBMS changed the generations — and what's next"
            desc="From rigid hierarchical trees to AI-native, self-tuning cloud databases."
          />
          <div className="relative border-l-2 border-[#E4E4EC] pl-6 dark:border-[#232733]">
            {TIMELINE.map((t) => (
              <div key={t.era} className="relative mb-8 last:mb-0">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-[#3454D1] bg-white dark:border-[#7C93F5] dark:bg-[#0E1016]" />
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#3454D1] dark:text-[#7C93F5]">{t.era}</div>
                <div className="mt-0.5 font-display text-[15px] font-semibold">{t.title}</div>
                <div className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-[#4A4B57] dark:text-[#B7B8C4]">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Footer CTA — download again                                  */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-[#E4E4EC] bg-[#F7F7FB] px-6 py-12 text-center dark:border-[#232733] dark:bg-[#12141C]">
          <Icon d={ICONS.book} className="h-8 w-8 text-[#3454D1] dark:text-[#7C93F5]" />
          <h3 className="font-display text-2xl font-semibold">Take these notes with you</h3>
          <p className="max-w-md text-[13.5px] leading-relaxed text-[#4A4B57] dark:text-[#B7B8C4]">
            Everything on this page - types, formulas, full notes, cheat sheet, and
            important questions — bundled into one downloadable file.
          </p>
          <DownloadNotesButton />
        </div>
      </section>
    </main>
  );
}