import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });

/* ------------------------------------------------------------------ */
/*  Content model                                                      */
/* ------------------------------------------------------------------ */

type Block =
  | { type: "text"; text: string }
  | { type: "diagram"; label: string; art: string[] }
  | { type: "list"; heading?: string; items: string[] }
  | { type: "prosCons"; pros: string[]; cons: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

type Category =
  | "Fundamentals"
  | "Scalability & Performance"
  | "Data Layer"
  | "Architecture Patterns"
  | "Security"
  | "Reliability & Advanced"
  | "Interview Prep";

type Topic = {
  id: string;
  num: string;
  category: Category;
  title: string;
  blocks: Block[];
};

const CATEGORY_ACCENT: Record<Category, string> = {
  Fundamentals: "var(--c-blue)",
  "Scalability & Performance": "var(--c-violet)",
  "Data Layer": "var(--c-emerald)",
  "Architecture Patterns": "var(--c-orange)",
  Security: "var(--c-rose)",
  "Reliability & Advanced": "var(--c-cyan)",
  "Interview Prep": "var(--c-amber)",
};

const CATEGORIES: Category[] = [
  "Fundamentals",
  "Scalability & Performance",
  "Data Layer",
  "Architecture Patterns",
  "Security",
  "Reliability & Advanced",
  "Interview Prep",
];

/* ------------------------------------------------------------------ */
/*  Topics                                                             */
/* ------------------------------------------------------------------ */

const topics: Topic[] = [
  {
    id: "what-is-system-design",
    num: "01",
    category: "Fundamentals",
    title: "What is System Design?",
    blocks: [
      {
        type: "text",
        text: "System design is the process of designing scalable, reliable, efficient, and maintainable software systems that can handle millions of users.",
      },
      {
        type: "list",
        heading: "Reference systems",
        items: ["WhatsApp", "Instagram", "YouTube", "Netflix", "Amazon", "Google Search"],
      },
      {
        type: "list",
        heading: "What every good system aims for",
        items: ["Scalable", "Reliable", "Available", "Secure", "Fast", "Cost-effective", "Easy to maintain"],
      },
    ],
  },
  {
    id: "functional-vs-nonfunctional",
    num: "02",
    category: "Fundamentals",
    title: "Functional vs Non-Functional Requirements",
    blocks: [
      {
        type: "list",
        heading: "Functional — what the system should do (e.g. Instagram)",
        items: ["User registration", "Login", "Upload photos", "Like posts", "Comment", "Follow users"],
      },
      {
        type: "list",
        heading: "Non-functional — how well it performs",
        items: [
          "Handle 10 million users",
          "Response time under 200 ms",
          "99.99% availability",
          "Secure authentication",
          "Data backup",
        ],
      },
    ],
  },
  {
    id: "scalability",
    num: "03",
    category: "Scalability & Performance",
    title: "Scalability",
    blocks: [
      { type: "text", text: "Scalability means handling increased traffic without a drop in performance. There are two directions to scale in." },
      {
        type: "diagram",
        label: "Vertical scaling",
        art: ["  4 GB RAM  ──────▶  32 GB RAM", "", "  (one server, more power)"],
      },
      { type: "prosCons", pros: ["Easy to do", "No code changes needed"], cons: ["Hits a hardware ceiling", "Gets expensive fast"] },
      {
        type: "diagram",
        label: "Horizontal scaling",
        art: [
          "        User Requests",
          "              |",
          "              V",
          "        Load Balancer",
          "         /    |    \\",
          "        S1    S2    S3",
        ],
      },
      { type: "prosCons", pros: ["Grows without a hard limit", "Fault tolerant"], cons: ["More operational complexity"] },
    ],
  },
  {
    id: "load-balancer",
    num: "04",
    category: "Scalability & Performance",
    title: "Load Balancer",
    blocks: [
      { type: "text", text: "A load balancer distributes incoming requests across multiple servers so no single machine gets overwhelmed." },
      {
        type: "diagram",
        label: "Traffic distribution",
        art: ["   1000 Requests", "         |", "         V", "   Load Balancer", "    /    |     \\", "   S1    S2    S3"],
      },
      {
        type: "list",
        heading: "Benefits",
        items: ["Prevents server overload", "High availability", "Better overall performance"],
      },
      { type: "list", heading: "Popular tools", items: ["Nginx", "HAProxy", "AWS ELB"] },
    ],
  },
  {
    id: "caching",
    num: "05",
    category: "Scalability & Performance",
    title: "Caching",
    blocks: [
      { type: "text", text: "A cache stores frequently accessed data so repeat requests never have to hit the database." },
      {
        type: "diagram",
        label: "Without a cache",
        art: ["  Client", "    |", "  Server", "    |", " Database"],
      },
      {
        type: "diagram",
        label: "With a cache",
        art: ["  Client", "    |", "  Server", "    |", "  Redis", "    |", " Database"],
      },
      { type: "list", heading: "Benefits", items: ["Faster response times", "Reduced database load"] },
      { type: "list", heading: "Common tools", items: ["Redis", "Memcached"] },
    ],
  },
  {
    id: "databases",
    num: "06",
    category: "Data Layer",
    title: "SQL vs NoSQL Databases",
    blocks: [
      {
        type: "table",
        headers: ["", "SQL", "NoSQL"],
        rows: [
          ["Examples", "MySQL, PostgreSQL, Oracle", "MongoDB, Cassandra, DynamoDB"],
          ["Features", "ACID, relationships, transactions", "Flexible schema, horizontal scaling"],
          ["Good for", "Banking, ecommerce, ERP", "Social media, big data, chat apps"],
        ],
      },
    ],
  },
  {
    id: "replication",
    num: "07",
    category: "Data Layer",
    title: "Database Replication",
    blocks: [
      { type: "text", text: "Replication copies data from one database to another so reads can be served from copies while writes stay centralized." },
      { type: "diagram", label: "Master → replicas", art: ["         Master", "       /       \\", "  Replica1   Replica2"] },
      { type: "list", heading: "Roles", items: ["Master handles writes", "Replicas handle reads"] },
      { type: "list", heading: "Benefits", items: ["Faster reads", "Built-in backup", "Higher availability"] },
    ],
  },
  {
    id: "sharding",
    num: "08",
    category: "Data Layer",
    title: "Database Sharding",
    blocks: [
      { type: "text", text: "Sharding splits data across multiple databases so each one only holds a slice of the total." },
      {
        type: "diagram",
        label: "Sharding by key range",
        art: ["  Shard 1        Shard 2        Shard 3", "  Users A–F      Users G–N      Users O–Z"],
      },
      { type: "list", heading: "Benefits", items: ["Better scalability", "Faster queries per shard"] },
    ],
  },
  {
    id: "cap-theorem",
    num: "09",
    category: "Data Layer",
    title: "CAP Theorem",
    blocks: [
      {
        type: "text",
        text: "A distributed system can't guarantee Consistency, Availability, and Partition tolerance all at once — you get to pick two.",
      },
      {
        type: "table",
        headers: ["Letter", "Meaning"],
        rows: [
          ["C", "Consistency — every read gets the latest write"],
          ["A", "Availability — every request gets a response"],
          ["P", "Partition tolerance — keeps working despite network splits"],
        ],
      },
      {
        type: "table",
        headers: ["System type", "Typical choice"],
        rows: [
          ["Banking", "CP — consistency over availability"],
          ["Social media", "AP — availability over strict consistency"],
        ],
      },
    ],
  },
  {
    id: "acid",
    num: "10",
    category: "Data Layer",
    title: "ACID Properties",
    blocks: [
      {
        type: "list",
        heading: "Used in SQL databases",
        items: ["Atomicity — all or nothing", "Consistency — valid state to valid state", "Isolation — concurrent transactions don't interfere", "Durability — committed data survives a crash"],
      },
    ],
  },
  {
    id: "base",
    num: "11",
    category: "Data Layer",
    title: "BASE Properties",
    blocks: [
      {
        type: "list",
        heading: "Used in NoSQL databases",
        items: ["Basically Available — the system responds, even if degraded", "Soft State — state may change over time without input", "Eventual Consistency — replicas converge given enough time"],
      },
    ],
  },
  {
    id: "cdn",
    num: "12",
    category: "Architecture Patterns",
    title: "CDN (Content Delivery Network)",
    blocks: [
      { type: "text", text: "A CDN caches content in edge locations physically closer to users, so it doesn't have to travel all the way to the origin server." },
      { type: "diagram", label: "Edge delivery", art: ["  User (India)", "       |", "  Nearest CDN Edge", "       |", "  Origin Server (USA)"] },
      { type: "list", heading: "Examples", items: ["Cloudflare", "Akamai", "AWS CloudFront"] },
      { type: "list", heading: "Benefits", items: ["Faster page loads", "Lower latency"] },
    ],
  },
  {
    id: "reverse-proxy",
    num: "13",
    category: "Architecture Patterns",
    title: "Reverse Proxy",
    blocks: [
      { type: "text", text: "A reverse proxy sits in front of your servers and mediates every request that reaches them." },
      { type: "diagram", label: "Request path", art: ["  Users", "    |", "  Reverse Proxy", "    |", "  App Servers"] },
      { type: "list", heading: "Examples", items: ["Nginx", "Apache"] },
      { type: "list", heading: "Benefits", items: ["Security", "SSL termination", "Load balancing", "Caching"] },
    ],
  },
  {
    id: "api-gateway",
    num: "14",
    category: "Architecture Patterns",
    title: "API Gateway",
    blocks: [
      { type: "text", text: "An API gateway is the single front door that manages every incoming API request before it reaches your services." },
      { type: "diagram", label: "Routing through the gateway", art: ["  Client", "    |", "  API Gateway", "    |", "  Microservices"] },
      { type: "list", heading: "Responsibilities", items: ["Authentication", "Rate limiting", "Logging", "Routing"] },
    ],
  },
  {
    id: "monolith",
    num: "15",
    category: "Architecture Patterns",
    title: "Monolith Architecture",
    blocks: [
      { type: "text", text: "Everything — every feature and module — lives inside one deployable application." },
      { type: "diagram", label: "Single application", art: ["  Application", "  ├── Login", "  ├── Orders", "  ├── Payments", "  └── Inventory"] },
      { type: "prosCons", pros: ["Easy to develop initially", "Simple deployment"], cons: ["Hard to scale parts independently", "Codebase grows large and tangled"] },
    ],
  },
  {
    id: "microservices",
    num: "16",
    category: "Architecture Patterns",
    title: "Microservices",
    blocks: [
      { type: "text", text: "The application is split into independent services, each owning a single responsibility." },
      { type: "diagram", label: "Independent services", art: ["  Login Service     Order Service", "  Payment Service    Notification Service"] },
      { type: "prosCons", pros: ["Independent deployment", "Scales piece by piece", "Fault isolation"], cons: ["Complex inter-service communication", "Harder to monitor"] },
    ],
  },
  {
    id: "message-queue",
    num: "17",
    category: "Architecture Patterns",
    title: "Message Queue",
    blocks: [
      { type: "text", text: "A message queue lets services communicate asynchronously — the sender doesn't wait for the receiver." },
      { type: "diagram", label: "Producer → consumer", art: ["  Producer", "     |", "   Queue", "     |", "  Consumer"] },
      { type: "list", heading: "Examples", items: ["RabbitMQ", "Apache Kafka", "Amazon SQS"] },
      { type: "list", heading: "Benefits", items: ["Decoupling", "Reliability", "Automatic retry handling"] },
    ],
  },
  {
    id: "event-driven",
    num: "18",
    category: "Architecture Patterns",
    title: "Event-Driven Architecture",
    blocks: [
      { type: "text", text: "Services react to events instead of calling each other directly, which keeps them loosely coupled." },
      {
        type: "diagram",
        label: "An order's event chain",
        art: ["  Order Created", "        ↓", "  Inventory Updated", "        ↓", "  Payment Processed", "        ↓", "  Email Sent"],
      },
    ],
  },
  {
    id: "rate-limiting",
    num: "19",
    category: "Security",
    title: "Rate Limiting",
    blocks: [
      { type: "text", text: "Rate limiting restricts how many requests a client can make in a given window, protecting the system from abuse and overload." },
      { type: "diagram", label: "Example limit", art: ["  100 requests / minute / client"] },
      { type: "list", heading: "Common techniques", items: ["Token Bucket", "Leaky Bucket", "Fixed Window", "Sliding Window"] },
    ],
  },
  {
    id: "authn-vs-authz",
    num: "20",
    category: "Security",
    title: "Authentication vs Authorization",
    blocks: [
      {
        type: "table",
        headers: ["Authentication", "Authorization"],
        rows: [["Who are you?", "What can you access?"], ["Login, OTP, password", "Admin, user, moderator"]],
      },
    ],
  },
  {
    id: "jwt",
    num: "21",
    category: "Security",
    title: "JWT (JSON Web Token)",
    blocks: [
      {
        type: "diagram",
        label: "Token flow",
        art: ["  Client Login", "       ↓", "    Server", "       ↓", "  JWT Token", "       ↓", "  Client stores token", "       ↓", "  Sent with API requests"],
      },
      { type: "list", heading: "Benefits", items: ["Stateless", "Fast to verify", "Widely supported"] },
    ],
  },
  {
    id: "oauth",
    num: "22",
    category: "Security",
    title: "OAuth 2.0",
    blocks: [
      { type: "text", text: "OAuth lets users log in with an identity they already have, instead of creating a new password for every app." },
      { type: "list", heading: "Common providers", items: ["Google", "GitHub", "Facebook"] },
      { type: "diagram", label: "Authorization flow", art: ["  User → Provider (e.g. Google)", "         → Authorization", "         → Access Token", "         → Application"] },
    ],
  },
  {
    id: "https",
    num: "23",
    category: "Security",
    title: "HTTPS",
    blocks: [
      { type: "text", text: "HTTPS wraps HTTP traffic in SSL/TLS encryption so data can't be read or tampered with in transit." },
      { type: "list", heading: "Benefits", items: ["Secure communication", "Data privacy", "Server authentication"] },
    ],
  },
  {
    id: "consistent-hashing",
    num: "24",
    category: "Reliability & Advanced",
    title: "Consistent Hashing",
    blocks: [
      { type: "text", text: "Consistent hashing distributes data evenly across servers, so adding or removing a server only reshuffles a small slice of the data." },
      { type: "list", heading: "Benefits", items: ["Easy horizontal scaling", "Minimal data movement on resize", "Backbone of most caching systems"] },
    ],
  },
  {
    id: "bloom-filter",
    num: "25",
    category: "Reliability & Advanced",
    title: "Bloom Filter",
    blocks: [
      { type: "text", text: "A bloom filter is a fast, space-efficient probabilistic structure that tells you an item is definitely absent, or possibly present." },
      { type: "list", heading: "Use cases", items: ["Cache lookups", "Database optimization", "Web crawlers"] },
    ],
  },
  {
    id: "distributed-lock",
    num: "26",
    category: "Reliability & Advanced",
    title: "Distributed Lock",
    blocks: [
      { type: "text", text: "A distributed lock ensures only one server processes a critical task at a time, even across a fleet of machines." },
      { type: "list", heading: "Use cases", items: ["Preventing double payment", "Inventory reservation"] },
      { type: "list", heading: "Tools", items: ["Redis", "ZooKeeper"] },
    ],
  },
  {
    id: "circuit-breaker",
    num: "27",
    category: "Reliability & Advanced",
    title: "Circuit Breaker",
    blocks: [
      { type: "text", text: "A circuit breaker stops calls to a failing dependency so one broken service doesn't cascade into a full outage." },
      { type: "diagram", label: "States", art: ["  Closed  ──failure──▶  Open  ──timeout──▶  Half-Open", "    ▲                                          |", "    └──────────────success───────────────────┘"] },
      { type: "list", heading: "Libraries", items: ["Resilience4j", "Hystrix (legacy)"] },
    ],
  },
  {
    id: "monitoring-logging",
    num: "28",
    category: "Reliability & Advanced",
    title: "Monitoring & Logging",
    blocks: [
      { type: "list", heading: "Monitoring tracks", items: ["CPU", "Memory", "Requests per second", "Latency", "Error rate"] },
      { type: "list", heading: "Logging captures", items: ["Application logs", "Access logs", "Error logs"] },
      { type: "list", heading: "Tools", items: ["Prometheus", "Grafana", "ELK Stack"] },
    ],
  },
  {
    id: "common-databases",
    num: "29",
    category: "Data Layer",
    title: "Common Databases at a Glance",
    blocks: [
      {
        type: "table",
        headers: ["SQL", "NoSQL"],
        rows: [
          ["MySQL", "MongoDB"],
          ["PostgreSQL", "Cassandra"],
          ["SQL Server", "DynamoDB"],
          ["—", "Redis (key-value)"],
        ],
      },
    ],
  },
  {
    id: "interview-questions",
    num: "30",
    category: "Interview Prep",
    title: "Common System Design Interview Questions",
    blocks: [
      {
        type: "list",
        items: ["Design WhatsApp", "Design Instagram", "Design YouTube", "Design Uber", "Design Netflix", "Design Twitter / X", "Design a URL Shortener", "Design Google Drive", "Design Dropbox", "Design Amazon"],
      },
    ],
  },
  {
    id: "interview-approach",
    num: "31",
    category: "Interview Prep",
    title: "Typical Interview Approach",
    blocks: [
      {
        type: "list",
        items: [
          "Clarify requirements",
          "Estimate scale — users, requests, storage",
          "Define APIs and the data model",
          "Draw the high-level architecture",
          "Identify bottlenecks",
          "Add scalability — load balancers, caching, sharding",
          "Address reliability — replication, failover",
          "Discuss security, monitoring, and trade-offs",
        ],
      },
    ],
  },
  {
    id: "common-tech",
    num: "32",
    category: "Interview Prep",
    title: "Common Technologies Reference",
    blocks: [
      {
        type: "table",
        headers: ["Category", "Examples"],
        rows: [
          ["Web Server", "Nginx, Apache"],
          ["Load Balancer", "HAProxy, AWS ELB"],
          ["Cache", "Redis, Memcached"],
          ["Message Queue", "Kafka, RabbitMQ, SQS"],
          ["SQL Database", "MySQL, PostgreSQL"],
          ["NoSQL Database", "MongoDB, Cassandra"],
          ["Monitoring", "Prometheus, Grafana"],
          ["Logging", "ELK Stack, Loki"],
          ["Containerization", "Docker"],
          ["Orchestration", "Kubernetes"],
        ],
      },
    ],
  },
  {
    id: "roadmap",
    num: "33",
    category: "Interview Prep",
    title: "Learning Roadmap",
    blocks: [
      {
        type: "list",
        items: [
          "Computer Networks — HTTP, TCP/IP, DNS",
          "Operating Systems — processes, threads, memory",
          "Databases — SQL and NoSQL",
          "Caching — Redis",
          "Load Balancing",
          "CAP Theorem, ACID, BASE",
          "Distributed Systems",
          "Message Queues — Kafka, RabbitMQ",
          "Microservices",
          "Cloud Platforms — AWS, Azure, GCP",
          "Docker and Kubernetes",
          "Practice real-world designs — YouTube, WhatsApp, Uber, Netflix",
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Cheat sheets                                                       */
/* ------------------------------------------------------------------ */

const cheatSheets = [
  {
    title: "Scaling, at a glance",
    rows: [
      ["Vertical", "Add power to one box", "Simple, no code change", "Hardware ceiling, costly"],
      ["Horizontal", "Add more boxes", "Grows without limit, fault tolerant", "Needs a load balancer, more moving parts"],
    ],
    headers: ["Strategy", "What it means", "Pros", "Cons"],
  },
  {
    title: "CAP cheat sheet",
    rows: [
      ["CP", "Pick when correctness matters more than uptime", "Banking, payments"],
      ["AP", "Pick when uptime matters more than perfect freshness", "Social feeds, shopping carts"],
    ],
    headers: ["Choice", "When to reach for it", "Example domain"],
  },
  {
    title: "SQL vs NoSQL, in one line",
    rows: [
      ["SQL", "Structured, relational, transactional", "Banking, ecommerce, ERP"],
      ["NoSQL", "Flexible schema, scales horizontally", "Social media, big data, chat"],
    ],
    headers: ["Type", "Strength", "Reach for it when…"],
  },
];

const importantTips = [
  "Always clarify requirements before drawing a single box — an elegant answer to the wrong problem is still wrong.",
  "State your assumptions out loud. Interviewers care more about your reasoning than a 'correct' final diagram.",
  "Estimate scale early: back-of-envelope numbers for users, QPS, and storage steer every later decision.",
  "There is no perfect design, only trade-offs. Naming the trade-off you're making is more valuable than avoiding one.",
  "Start simple, then scale. A single server with a database is a legitimate first draft — add complexity only as bottlenecks appear.",
  "Bottlenecks usually hide in three places: the database, a single point of failure, and unbounded growth of one resource.",
  "Caching solves read-heavy problems; sharding and queues solve write-heavy problems. Reach for the tool that matches the pattern.",
  "Security, monitoring, and failure handling are not optional extras — bring them up even if the interviewer doesn't ask.",
];

/* ------------------------------------------------------------------ */
/*  Building blocks                                                    */
/* ------------------------------------------------------------------ */

function SectionEyebrow({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: accent }}>
      <span className="inline-block h-[6px] w-[6px] rounded-full" style={{ backgroundColor: accent }} />
      {children}
    </div>
  );
}

function DiagramBox({ label, art }: { label: string; art: string[] }) {
  return (
    <div className="relative my-4 rounded-sm border border-slate-300 bg-[linear-gradient(to_right,rgba(37,99,235,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.06)_1px,transparent_1px)] bg-[size:16px_16px] p-4 dark:border-slate-700 dark:bg-[linear-gradient(to_right,rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.06)_1px,transparent_1px)]">
      {/* corner registration marks */}
      <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-blue-500/60 dark:border-cyan-400/60" />
      <span className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-blue-500/60 dark:border-cyan-400/60" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-blue-500/60 dark:border-cyan-400/60" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-blue-500/60 dark:border-cyan-400/60" />
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-400">
        Fig — {label}
      </div>
      <pre className="overflow-x-auto font-mono text-[13px] leading-[1.5] text-slate-700 dark:text-slate-300">
        {art.join("\n")}
      </pre>
    </div>
  );
}

function ListBlock({ heading, items }: { heading?: string; items: string[] }) {
  return (
    <div className="my-3">
      {heading && <div className="mb-1.5 text-[13px] font-semibold text-slate-500 dark:text-slate-400">{heading}</div>}
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[14.5px] text-slate-700 dark:text-slate-300">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProsConsBlock({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="my-4 grid gap-3 sm:grid-cols-2">
      <div className="rounded-sm border border-emerald-500/25 bg-emerald-500/5 p-3">
        <div className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Advantages</div>
        <ul className="space-y-1">
          {pros.map((p) => (
            <li key={p} className="text-[14px] text-slate-700 dark:text-slate-300">+ {p}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-sm border border-rose-500/25 bg-rose-500/5 p-3">
        <div className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-rose-600 dark:text-rose-400">Trade-offs</div>
        <ul className="space-y-1">
          {cons.map((c) => (
            <li key={c} className="text-[14px] text-slate-700 dark:text-slate-300">− {c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-sm border border-slate-200 dark:border-slate-800">
      <table className="w-full border-collapse text-left text-[13.5px]">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900">
            {headers.map((h) => (
              <th key={h} className="border-b border-slate-200 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-950 dark:even:bg-slate-900/40">
              {row.map((cell, j) => (
                <td key={j} className="border-b border-slate-100 px-3 py-2 text-slate-700 dark:border-slate-900 dark:text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return <p className="my-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{block.text}</p>;
    case "diagram":
      return <DiagramBox label={block.label} art={block.art} />;
    case "list":
      return <ListBlock heading={block.heading} items={block.items} />;
    case "prosCons":
      return <ProsConsBlock pros={block.pros} cons={block.cons} />;
    case "table":
      return <TableBlock headers={block.headers} rows={block.rows} />;
  }
}

function TopicCard({ topic }: { topic: Topic }) {
  const accent = CATEGORY_ACCENT[topic.category];
  return (
    <article
      id={topic.id}
      className="scroll-mt-24 rounded-md border border-slate-200 bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.03)] dark:border-slate-800 dark:bg-slate-900/40 sm:p-7"
      style={{ borderLeftWidth: "3px", borderLeftColor: accent }}
    >
      <div className="mb-1 flex items-baseline gap-3">
        <span className="font-mono text-sm tabular-nums" style={{ color: accent }}>
          {topic.num}
        </span>
        <h3 className="font-[var(--font-display)] text-[20px] font-medium text-slate-900 dark:text-slate-100 sm:text-[22px]">
          {topic.title}
        </h3>
      </div>
      <div>
        {topic.blocks.map((b, i) => (
          <BlockRenderer key={i} block={b} />
        ))}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function SystemDesignPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-white font-[var(--font-body)] text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100`}
      style={
        {
          "--c-blue": "#2563EB",
          "--c-violet": "#7C3AED",
          "--c-emerald": "#059669",
          "--c-orange": "#EA580C",
          "--c-rose": "#E11D48",
          "--c-cyan": "#0891B2",
          "--c-amber": "#D97706",
        } as React.CSSProperties
      }
    >
      {/* ---------------------------------------------------------- */}
      {/* Hero                                                        */}
      {/* ---------------------------------------------------------- */}
      <header className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(37,99,235,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <span className="h-[6px] w-[6px] rounded-full bg-blue-600 dark:bg-cyan-400" />
            Course notes 
          </div>
          <h1 className="max-w-3xl font-[var(--font-display)] text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            System Design,
            <br />
            <span className="text-blue-600 dark:text-cyan-400">sketched out.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-slate-600 dark:text-slate-400">
            A field guide to the concepts behind WhatsApp, Instagram, YouTube, and every other
            system built to survive millions of users - diagrams, trade-offs, cheat sheets, and
            the questions interviewers actually ask.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <a
                key={c}
                href={`#cat-${c.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
                className="rounded-full border px-3 py-1.5 text-[13px] transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                style={{ borderColor: CATEGORY_ACCENT[c], color: CATEGORY_ACCENT[c] }}
              >
                {c}
              </a>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* -------------------------------------------------------- */}
        {/* Sticky table of contents                                  */}
        {/* -------------------------------------------------------- */}
        <nav className="hidden lg:block">
          <div className="sticky top-8 max-h-[85vh] overflow-y-auto pr-2">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Contents</div>
            <ol className="space-y-5">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <div
                    id={`cat-${cat.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
                    className="scroll-mt-24 mb-1.5 text-[12.5px] font-semibold"
                    style={{ color: CATEGORY_ACCENT[cat] }}
                  >
                    {cat}
                  </div>
                  <ul className="space-y-1 border-l border-slate-200 pl-3 dark:border-slate-800">
                    {topics
                      .filter((t) => t.category === cat)
                      .map((t) => (
                        <li key={t.id}>
                          <a
                            href={`#${t.id}`}
                            className="block truncate text-[13px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                          >
                            {t.num} {t.title}
                          </a>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
              <li>
                <a href="#cheat-sheets" className="text-[13px] font-semibold text-amber-600 dark:text-amber-400">
                  ↳ Cheat sheets
                </a>
              </li>
              <li>
                <a href="#important" className="text-[13px] font-semibold text-amber-600 dark:text-amber-400">
                  ↳ Keep in mind
                </a>
              </li>
            </ol>
          </div>
        </nav>

        {/* -------------------------------------------------------- */}
        {/* Topic sections                                            */}
        {/* -------------------------------------------------------- */}
        <main className="min-w-0 space-y-16">
          {CATEGORIES.map((cat) => (
            <section key={cat}>
              <SectionEyebrow accent={CATEGORY_ACCENT[cat]}>{cat}</SectionEyebrow>
              <div className="space-y-5">
                {topics
                  .filter((t) => t.category === cat)
                  .map((t) => (
                    <TopicCard key={t.id} topic={t} />
                  ))}
              </div>
            </section>
          ))}

          {/* ---------------------------------------------------- */}
          {/* Cheat sheets                                          */}
          {/* ---------------------------------------------------- */}
          <section id="cheat-sheets" className="scroll-mt-24">
            <SectionEyebrow accent="var(--c-amber)">Cheat sheets</SectionEyebrow>
            <div className="grid gap-5 md:grid-cols-3">
              {cheatSheets.map((sheet) => (
                <div
                  key={sheet.title}
                  className="rounded-md border border-amber-500/30 bg-amber-500/[0.04] p-4 dark:bg-amber-400/[0.04]"
                >
                  <div className="mb-2 font-[var(--font-display)] text-[15px] font-medium text-amber-700 dark:text-amber-400">
                    {sheet.title}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-[12.5px]">
                      <thead>
                        <tr>
                          {sheet.headers.map((h) => (
                            <th key={h} className="border-b border-amber-500/25 pb-1.5 pr-2 font-mono text-[10px] uppercase tracking-wider text-amber-700/80 dark:text-amber-400/80">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sheet.rows.map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} className="border-b border-amber-500/10 py-1.5 pr-2 align-top text-slate-700 dark:text-slate-300">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------------------------------------------- */}
          {/* Master architecture sketch                            */}
          {/* ---------------------------------------------------- */}
          <section>
            <SectionEyebrow accent="var(--c-blue)">The big picture</SectionEyebrow>
            <p className="mb-2 text-[14.5px] text-slate-600 dark:text-slate-400">
              Most large-scale designs are a remix of the pieces above. Here's roughly how they stack.
            </p>
            <DiagramBox
              label="a request's full journey"
              art={[
                "  Client",
                "     |",
                "  CDN (static assets)",
                "     |",
                "  Load Balancer",
                "     |",
                "  API Gateway  ── auth, rate limiting",
                "     |",
                "  Microservices ── message queue between them",
                "    /        \\",
                "  Cache      Database (replicated + sharded)",
              ]}
            />
          </section>

          {/* ---------------------------------------------------- */}
          {/* Important things to keep in mind                      */}
          {/* ---------------------------------------------------- */}
          <section id="important" className="scroll-mt-24">
            <SectionEyebrow accent="var(--c-amber)">Important things to keep in mind</SectionEyebrow>
            <div className="space-y-3">
              {importantTips.map((tip, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-md border border-amber-500/30 bg-amber-500/[0.05] p-4 dark:bg-amber-400/[0.05]"
                >
                  <span className="font-mono text-[12px] text-amber-600 dark:text-amber-400">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[14.5px] leading-relaxed text-slate-700 dark:text-slate-300">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="border-t border-slate-200 pt-8 text-[13px] text-slate-400 dark:border-slate-800 dark:text-slate-600">
            33 topics · fundamentals through interview prep — revisit the diagrams before your next system design round.
          </footer>
        </main>
      </div>
    </div>
  );
}