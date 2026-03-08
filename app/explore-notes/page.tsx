'use client';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

const NOTES = [
  {
    title: 'Data Structures',
    subtitle: 'Think in shapes, not syntax',
    description: 'Data structures are the invisible foundation of every fast, efficient program. They decide how your data is organized in memory - whether you can find something in 1 nanosecond or 1 second. In this deep module we explore the classic building blocks with crystal-clear mental models, real production examples, time/space trade-offs, and the exact moments you should choose one over another. Master these and you will instantly see the optimal shape for any problem.',
    topics: [
      {
        name: 'Arrays',
        explanation: 'Arrays are the simplest and most fundamental data structure - a fixed-size, contiguous block of memory where every element sits right next to the other. Because they live side-by-side in RAM, your computer can jump straight to any position using simple index math (base address + index × element size). This gives true O(1) random access. Real-world examples: every image on your screen is a 2D array of pixels, every string in most languages is an array of characters, game boards in chess engines, lookup tables in high-frequency trading systems, and adjacency matrices in graph algorithms. Dynamic arrays (Python list, Java ArrayList, C++ vector) secretly double in size when full, giving amortized O(1) append. The only downside is that inserting or deleting in the middle requires shifting every element after it - O(n) cost. When you need blazing speed and predictable memory layout, arrays are unbeatable.',
        analogy: 'Numbered lockers in a long straight hallway - shout “locker 7421” and the light turns on instantly.',
        example: 'const scores = [87, 92, 76, 95]; console.log(scores[2]); // O(1) instant access\nscores.push(99); // amortized O(1) at end',
        complexity: 'Access: O(1)\nInsert/Delete at end: O(1) amortized\nInsert/Delete middle: O(n)',
        whenToUse: 'Fast random access needed, size known ahead or grows predictably, matrix math, image processing, cache-friendly code'
      },
      {
        name: 'Linked Lists',
        explanation: 'Linked lists are chains of separate nodes scattered anywhere in memory. Each node holds data + one (or two) pointers to the next (and previous) node. Because nodes don’t need to be contiguous, inserting or deleting anywhere is just rewiring 2–3 pointers - true O(1) once you have the reference. The trade-off is no random access: to reach the 50th node you must walk from the head (O(n)). Perfect for playlists (add/remove songs), browser history (back/forward), undo/redo stacks in apps, and implementing stacks/queues when you want unlimited size. Variants: singly-linked, doubly-linked (fast backward traversal), circular (last points to first). In Linux kernel, the task scheduler uses linked lists of processes.',
        analogy: 'Treasure hunt clues where each clue only points to the next location - easy to insert new clues anywhere.',
        example: 'head.next = new Node(42); newNode.next = oldNext; // O(1) insert\ncurrent = head; while(current) { ... } // O(n) traversal',
        complexity: 'Access by index: O(n)\nInsert/Delete at known position: O(1)\nSearch: O(n)',
        whenToUse: 'Frequent inserts/deletes in middle, unknown size, implementing other structures (stack/queue), memory fragmentation friendly'
      },
      {
        name: 'Stacks',
        explanation: 'Stacks follow strict Last-In-First-Out (LIFO). You only ever touch the top: push to add, pop to remove, peek to look. Every operation is O(1). The call stack in every language is literally a stack - function calls push frames, returns pop them. Real-world: undo/redo in Photoshop, browser back button history, matching parentheses in code editors, depth-first search (DFS), backtracking in maze solvers, and the JavaScript event loop. You can implement with array (fastest) or linked list (unlimited). Many languages provide Stack class, but a plain array is usually sufficient and faster.',
        analogy: 'Spring-loaded plate dispenser in a cafeteria - last plate added is first one removed.',
        example: 'stack.push("save-game"); stack.pop(); // restores last saved state\n// Function call stack in JS: every function adds a frame automatically',
        complexity: 'Push/Pop/Peek: O(1)',
        whenToUse: 'Undo/redo, recursion simulation, DFS, expression evaluation, browser history, call stack management'
      },
      {
        name: 'Queues',
        explanation: 'Queues enforce First-In-First-Out (FIFO). New items join at rear (enqueue), oldest leave from front (dequeue). Both operations O(1) with circular buffer or linked list. Real-world: print job queues, task schedulers in OS, breadth-first search (BFS) for shortest path, customer service lines, message queues (RabbitMQ, Kafka) in microservices, and rate limiters. Priority queues (using heap) let important items jump the line. In web servers, request queues prevent overload.',
        analogy: 'Movie theater ticket line - first person in gets served first, no cutting.',
        example: 'queue.enqueue("task-A"); const next = queue.dequeue(); // always in arrival order\n// Circular queue avoids shifting elements',
        complexity: 'Enqueue/Dequeue: O(1)\nPeek: O(1)',
        whenToUse: 'BFS, task scheduling, producer-consumer problems, buffers, level-order traversal, request handling'
      },
      {
        name: 'Trees',
        explanation: 'Trees are hierarchical structures with one root and many children. No cycles. Binary Search Trees (BST) keep left < root < right for O(log n) search/insert/delete when balanced. Real-world: file systems (folders inside folders), DOM in browsers, company org charts, decision trees in ML, game AI behavior trees, and almost every database index (B-trees). Balanced variants (AVL, Red-Black, B-trees) guarantee logarithmic height. Traversals: inorder (sorted order), preorder, postorder, level-order (BFS). Trees power autocomplete (Trie), compression (Huffman), and routing tables.',
        analogy: 'Family tree - grandparents at top, children branching down, never cycles.',
        example: 'if (target < current.val) go left else go right; // halves search space each step\nB-tree used in every major database for indexes',
        complexity: 'Balanced BST: Search/Insert/Delete O(log n)\nUnbalanced worst: O(n)',
        whenToUse: 'Hierarchical data, fast sorted access, file systems, databases, decision making, autocomplete'
      }
    ],
    gradient: 'from-indigo-600 via-cyan-400 to-transparent',
    accent: '#6366f1',
  },
  {
    title: 'Algorithms',
    subtitle: 'Patterns behind every solution',
    description: 'Algorithms are proven recipes that turn difficult problems into simple, repeatable steps. These three patterns appear in literally hundreds of interview questions and production systems. Learn them once and you will recognize solutions instantly. We go deep into why they work, when to combine them, and real code you can copy-paste into your next interview or project.',
    topics: [
      {
        name: 'Binary Search',
        explanation: 'Binary search is the ultimate divide-and-conquer on sorted data. By always checking the middle and discarding half the search space, you solve problems in log₂(n) steps. For 1 billion elements that’s only ~30 comparisons. Used for “first bad version”, “search in rotated sorted array”, finding square roots, and every sorted database lookup. The key implementation detail: mid = low + (high - low) / 2 prevents integer overflow. Variants handle duplicates and find insertion point.',
        analogy: 'Guessing a number between 1 and 1 000 000 000 - always ask “higher or lower than middle?”',
        example: 'while (low <= high) {\n  mid = low + (high - low) / 2;\n  if (arr[mid] === target) return mid;\n  else if (arr[mid] < target) low = mid + 1;\n  else high = mid - 1;\n}',
        complexity: 'Time: O(log n)\nSpace: O(1)',
        whenToUse: 'Any sorted array or searchable range, finding boundaries, optimization problems'
      },
      {
        name: 'Two Pointers',
        explanation: 'Two Pointers is a technique that uses two indices moving toward or away from each other to solve problems in linear time. Classic patterns: left/right for pair sum, fast/slow for cycle detection (Floyd’s tortoise-hare), left/right window for removing duplicates or reversing strings. Turns O(n²) brute force into O(n). Used in “3Sum”, “container with most water”, “longest substring without repeating”, and almost every medium array/string problem.',
        analogy: 'Two people walking toward each other on a bridge until they meet in the middle.',
        example: 'let left = 0, right = arr.length - 1;\nwhile (left < right) {\n  if (arr[left] + arr[right] === target) return [left, right];\n  else if (arr[left] + arr[right] < target) left++;\n  else right--;\n}',
        complexity: 'Time: O(n)\nSpace: O(1)',
        whenToUse: 'Sorted arrays, finding pairs/triplets, sliding windows, cycle detection in linked lists'
      },
      {
        name: 'Sliding Window',
        explanation: 'Sliding Window maintains a dynamic “window” of elements and slides it across the array/string by advancing the right pointer and shrinking from the left when the condition breaks. Guarantees O(n) because left only moves forward. Solves maximum sum subarray of size k, longest substring without repeating characters, minimum window substring, longest repeating character replacement. Keep a frequency map or running sum inside the window and update in O(1).',
        analogy: 'A moving spotlight scanning a long sentence looking for the brightest consecutive words.',
        example: 'let left = 0;\nfor (let right = 0; right < n; right++) {\n  // add arr[right]\n  while (window invalid) { remove arr[left]; left++; }\n  update maxLength;\n}',
        complexity: 'Time: O(n)\nSpace: O(1) or O(k) for map',
        whenToUse: 'Contiguous subarrays/substrings, fixed or variable size windows, maximum/minimum in range'
      }
    ],
    gradient: 'from-rose-600 via-pink-400 to-transparent',
    accent: '#f43f5e',
  },
  {
    title: 'System Design',
    subtitle: 'How real software is built',
    description: 'System design is where computer science meets real-world scale. These three concepts power every major service you use daily - Instagram, Netflix, Google, your banking app. We break them down with concrete numbers, diagrams in your mind, and the exact questions interviewers expect you to ask and answer.',
    topics: [
      {
        name: 'Scalability',
        explanation: 'Scalability means your system can handle 10×, 100×, or 1 000 000× more traffic without redesign. Vertical scaling (bigger machine) is easy but limited by hardware. Horizontal scaling (more machines) is the path to infinity. Techniques: load balancing, database sharding (split users by userId % 64), replication (read replicas), caching, microservices, and auto-scaling groups. Measure success with RPS, p99 latency, error rate. Linear scalability = double servers, double capacity. Every FAANG system design round tests this heavily.',
        analogy: 'A restaurant that adds more tables and waiters instead of just buying a bigger kitchen.',
        example: 'Sharding: userId % 64 → database shard 0–63\nRead replicas for 10× read throughput',
        complexity: 'N/A (architectural)',
        whenToUse: 'Any production service expected to grow beyond one machine'
      },
      {
        name: 'Caching',
        explanation: 'Caching stores hot data in lightning-fast storage (Redis, Memcached, CDN, in-memory) so you avoid slow database hits. Amazon product pages are cached for 30–60 seconds - millions of users see the same copy. Key metrics: hit rate (target >85%), TTL, eviction policy (LRU most common). Strategies: cache-aside, write-through, write-back. Cache invalidation is famously one of the hardest problems in CS. CDNs cache static assets at the edge for <50ms global latency.',
        analogy: 'Keeping your most-used notebooks on your desk instead of walking to the library every time.',
        example: 'if (cache.has(key)) return cache.get(key);\ndata = db.query(key);\ncache.set(key, data, TTL=300);',
        complexity: 'Hit: O(1), Miss: O(db time)',
        whenToUse: 'Read-heavy workloads, expensive computations, static assets, API responses'
      },
      {
        name: 'Load Balancing',
        explanation: 'Load balancers sit in front of your servers and distribute traffic intelligently. Algorithms: round-robin (simple), least-connections (smartest), weighted, IP-hash (sticky sessions). Health checks remove unhealthy servers automatically. Modern ones (AWS ALB, Nginx, Envoy) also terminate SSL, route by path, support canary deployments, and rate limiting. Without a load balancer even the best backend will crash on sudden traffic spikes (Black Friday, viral tweet).',
        analogy: 'Traffic policeman at a busy intersection directing cars evenly to different toll lanes.',
        example: 'Nginx: upstream backend { least_conn; server 10.0.0.1; server 10.0.0.2; }\nAWS ALB with target groups and health checks',
        complexity: 'N/A',
        whenToUse: 'Any service with >1 server, high availability, zero-downtime deployments'
      }
    ],
    gradient: 'from-emerald-600 via-lime-400 to-transparent',
    accent: '#10b981',
  },
  {
    title: 'Interview Thinking',
    subtitle: 'What interviewers actually test',
    description: 'Interviews are not about memorizing LeetCode. They test how you think, communicate, and make trade-offs under pressure. These three skills determine 70 % of whether you get the offer. We teach the exact framework top candidates use to stand out in every round.',
    topics: [
      {
        name: 'Problem Framing',
        explanation: 'Before writing any code, spend 2-4 minutes framing the problem perfectly. Repeat the question in your own words, ask about constraints (n ≤ 10^5? duplicates? sorted?), clarify edge cases (empty, null, single element, max values), and draw 2-3 concrete examples. This single step separates strong candidates - interviewers notice immediately when you solve the wrong problem.',
        analogy: 'Reading the full recipe and gathering all ingredients before turning on the stove.',
        example: '"Does the array contain duplicates? Can we modify input in-place? What to return for empty array?"',
        complexity: 'N/A',
        whenToUse: 'Every single coding interview question'
      },
      {
        name: 'Tradeoffs',
        explanation: 'Every solution has pros and cons. Great engineers explicitly say: “This hashmap is O(n) time and O(n) space. Sorting + two pointers would be O(n log n) time but O(1) extra space.” In system design you compare SQL vs NoSQL, monolith vs microservices, strong vs eventual consistency. Mentioning alternatives and justifying your choice shows depth.',
        analogy: 'Choosing between a fast sports car (great acceleration, high fuel cost) versus an efficient hybrid.',
        example: '"Hashmap faster but uses more memory - if memory tight we sort and use two pointers."',
        complexity: 'N/A',
        whenToUse: 'Every coding and system design round'
      },
      {
        name: 'Communication',
        explanation: 'Communication is 50 % of your score. Think out loud constantly: clarify → approach → code → test → optimize → complexity. Never go silent more than 10 seconds. Structure answers clearly. Ask for hints only after showing effort. Interviewers are imagining what it would be like to work with you on a real team for years.',
        analogy: 'Live sports commentator narrating every move so the audience never loses track.',
        example: '"I’m initializing two pointers because the array is sorted… now I’ll move the right pointer…"',
        complexity: 'N/A',
        whenToUse: 'Every minute of every interview'
      }
    ],
    gradient: 'from-orange-600 via-yellow-400 to-transparent',
    accent: '#f59e0b',
  },
  {
    title: 'AI & Machine Learning',
    subtitle: 'Teaching machines to think',
    description: 'AI/ML is no longer sci-fi ; it powers recommendation engines, ChatGPT, self-driving cars, medical diagnosis, and fraud detection. This module explains the core ideas simply but deeply so you can hold intelligent conversations and build your first models confidently.',
    topics: [
      {
        name: 'Supervised Learning',
        explanation: 'Supervised learning is like teaching a student with a textbook that has both questions and answers. You feed the model thousands of labeled examples (features + correct output). The model learns the mapping by minimizing prediction error (loss function) through gradient descent. After training you test on unseen data. Powers spam filters, house price prediction, image classification (is this a cat or dog?), and credit scoring. Most real-world ML today is supervised.',
        analogy: 'A child learning addition with a worksheet that shows both problems and correct answers at the back.',
        example: 'from sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\npred = model.predict(X_test)',
        complexity: 'Training: O(n × features × epochs)\nInference: O(features)',
        whenToUse: 'You have labeled historical data and want to predict future outcomes'
      },
      {
        name: 'Neural Networks',
        explanation: 'Neural networks are inspired by the human brain - layers of interconnected nodes (neurons) that learn complex patterns. Input layer → hidden layers → output. Each connection has a weight adjusted during training. Deep networks (many hidden layers) can learn hierarchical features: edges → shapes → objects in images. Backpropagation + gradient descent trains them. Used in everything from ChatGPT to AlphaGo.',
        analogy: 'A huge team of tiny experts where each expert looks at different aspects and votes together.',
        example: 'model = Sequential([Dense(128, activation="relu"), Dense(64, activation="relu"), Dense(1)])\nmodel.compile(optimizer="adam", loss="mse")',
        complexity: 'Training: very high (GPU needed)\nInference: depends on size',
        whenToUse: 'Complex patterns, images, speech, text, any non-linear relationships'
      },
      {
        name: 'Transformers & LLMs',
        explanation: 'Transformers (the T in GPT) use self-attention to weigh the importance of every word relative to every other word in a sentence simultaneously. This solved the sequential limitation of RNNs. LLMs (Large Language Models) are massive transformers pre-trained on internet-scale text, then fine-tuned. They can write essays, code, translate, summarize. The “attention is all you need” paper (2017) changed everything.',
        analogy: 'A classroom where every student can instantly look at and learn from every other student’s notes at the same time.',
        example: 'from transformers import pipeline\ngenerator = pipeline("text-generation", model="gpt2")\ngenerator("Once upon a time", max_length=50)',
        complexity: 'Huge (billions of parameters)',
        whenToUse: 'Natural language, code generation, translation, chatbots, summarization'
      }
    ],
    gradient: 'from-violet-600 via-purple-400 to-transparent',
    accent: '#8b5cf6',
  },
  {
    title: 'Data Science',
    subtitle: 'Turning raw data into insights',
    description: 'Data Science is the art and science of extracting actionable knowledge from data. Every company today is a data company. This module gives you the complete beginner-to-intermediate toolkit with real examples you can run today.',
    topics: [
      {
        name: 'Statistics & Probability',
        explanation: 'Statistics and probability are the mathematical foundation of data science. Mean, median, standard deviation tell you about central tendency and spread. Distributions (normal, Poisson, etc.), p-values, confidence intervals, hypothesis testing (A/B testing), correlation vs causation. Without understanding these you cannot trust any model or insight.',
        analogy: 'The weather forecast - probability tells you chance of rain, statistics tells you average temperature.',
        example: 'import numpy as np\ndata.mean(), data.std(), np.corrcoef(x, y)',
        complexity: 'N/A',
        whenToUse: 'Every data project - before any modeling'
      },
      {
        name: 'Data Wrangling with Pandas',
        explanation: '80 % of data science time is cleaning data. Pandas is the Swiss Army knife: loading CSV/JSON, handling missing values, filtering, grouping, merging datasets, feature engineering. Real example: cleaning 10 million rows of sales data, converting dates, removing outliers, creating new features like “revenue per customer”.',
        analogy: 'A super-powered Excel that can handle billions of rows and automate everything.',
        example: 'df = pd.read_csv("sales.csv")\ndf = df.dropna()\ndf.groupby("region")["revenue"].sum()',
        complexity: 'Depends on data size',
        whenToUse: 'Any tabular data cleaning, exploration, preparation'
      },
      {
        name: 'Exploratory Data Analysis (EDA)',
        explanation: 'EDA is detective work: visualize distributions, find correlations, spot outliers, understand relationships before modeling. Tools: histograms, scatter plots, box plots, correlation heatmaps, pair plots. A good EDA can reveal that 30 % of customers come from one city or that sales drop every Monday.',
        analogy: 'CSI investigating a crime scene - look at every clue before jumping to conclusions.',
        example: 'sns.histplot(df["age"])\nsns.heatmap(df.corr(), annot=True)',
        complexity: 'N/A',
        whenToUse: 'First step of every data project'
      }
    ],
    gradient: 'from-teal-600 via-cyan-400 to-transparent',
    accent: '#14b8a6',
  },
  {
    title: 'Databases',
    subtitle: 'Storing and retrieving data at scale',
    description: 'Databases are the heart of almost every application. Choose the wrong one and your app will be slow or break at scale. This module explains the major types with when-to-use rules, real-world examples, and the exact trade-offs companies make.',
    topics: [
      {
        name: 'SQL / Relational Databases',
        explanation: 'SQL databases (PostgreSQL, MySQL, SQLite) store data in tables with strict schema and relationships via foreign keys. ACID guarantees (Atomicity, Consistency, Isolation, Durability) make them perfect for transactions. Powerful querying with JOINs, GROUP BY, window functions. Used by banks, e-commerce, any system needing strong consistency.',
        analogy: 'Perfectly organized filing cabinets with clear folders and indexes.',
        example: 'SELECT u.name, SUM(o.amount) FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id;',
        complexity: 'Query depends on indexes - O(log n) with index',
        whenToUse: 'Structured data, complex relationships, transactions, reporting'
      },
      {
        name: 'NoSQL Databases',
        explanation: 'NoSQL (MongoDB, Cassandra, DynamoDB, Redis) trade strict consistency for massive scale and flexibility. Document (Mongo), key-value (Redis), column-family (Cassandra), graph (Neo4j). Eventual consistency is common. Perfect for high write throughput, unstructured data, real-time apps.',
        analogy: 'A huge flexible warehouse where items can be stored anywhere as long as you can find them fast.',
        example: 'db.users.insertOne({ name: "Alice", orders: [ { amount: 99 } ] })',
        complexity: 'Varies by type -often O(1) for key lookups',
        whenToUse: 'Unstructured or rapidly changing data, massive scale, real-time'
      },
      {
        name: 'Indexing & Query Optimization',
        explanation: 'Indexes are like the index at the back of a book - they let the database find rows without scanning the entire table. B-tree indexes for equality/range, hash indexes for exact match, covering indexes avoid table lookup. Proper indexing can turn a 10-second query into 10 milliseconds. Query planners use statistics to choose best plan.',
        analogy: 'Library card catalog vs searching every shelf manually.',
        example: 'CREATE INDEX idx_email ON users(email);\n-- Now SELECT * FROM users WHERE email = ? is O(log n)',
        complexity: 'Index lookup: O(log n)',
        whenToUse: 'Any table with >10 000 rows that is queried often'
      }
    ],
    gradient: 'from-sky-600 via-blue-400 to-transparent',
    accent: '#0ea5e9',
  },
];

export default function NotesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 75, damping: 22 });

  const titleScale = useTransform(smoothProgress, [0, 0.28], [1, 0.78]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.20], [1, 0]);
  const titleBlur = useTransform(smoothProgress, [0, 0.20], [0, 22]);

  return (
    <section ref={containerRef} className="relative bg-[#050505] text-white overflow-hidden">
      {/* ULTRA ADVANCED BACKGROUND — MORE ORBS + SUBTLE GRID */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-soft-light" />
        
        {/* Deep multi-layer orbs with different speeds */}
        <motion.div
          style={{
            scale: useTransform(smoothProgress, [0, 1], [1.05, 1.95]),
            x: useTransform(smoothProgress, [0, 1], [-120, 180]),
            y: useTransform(smoothProgress, [0, 1], [-90, 140]),
            rotate: useTransform(smoothProgress, [0, 1], [0, 72])
          }}
          className="absolute top-[-30%] left-[-20%] w-[62%] h-[62%] bg-gradient-to-br from-indigo-600/25 via-cyan-400/15 to-transparent rounded-full blur-[150px]"
        />
        <motion.div
          style={{
            scale: useTransform(smoothProgress, [0, 1], [1.4, 0.65]),
            x: useTransform(smoothProgress, [0, 1], [110, -190]),
            y: useTransform(smoothProgress, [0, 1], [120, -150]),
            rotate: useTransform(smoothProgress, [0, 1], [15, -65])
          }}
          className="absolute bottom-[-25%] right-[-25%] w-[52%] h-[52%] bg-gradient-to-br from-rose-500/25 via-pink-400/15 to-transparent rounded-full blur-[180px]"
        />
        <motion.div
          style={{
            scale: useTransform(smoothProgress, [0, 1], [0.85, 1.55]),
            rotate: useTransform(smoothProgress, [0, 1], [-35, 80])
          }}
          className="absolute top-[35%] right-[8%] w-[38%] h-[38%] bg-gradient-to-br from-violet-400/15 to-transparent rounded-full blur-[120px]"
        />
      </div>

      {/* STICKY HERO — ENHANCED */}
      <div className="sticky top-0 h-screen flex items-center justify-center z-10 overflow-hidden">
        <motion.div
          style={{ scale: titleScale, opacity: titleOpacity, filter: `blur(${titleBlur}px)` }}
          className="text-center px-6 relative"
        >
          <h1 className="text-7xl md:text-[10rem] font-bold tracking-[-5px] leading-[0.78] mb-6">
            Notes <span className="text-white/25">that</span><br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/55">
              upgrade thinking
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-400 font-light tracking-[4px] uppercase">7 complete modules • 3D interactive • Built for mastery</p>
        </motion.div>
      </div>

      {/* KNOWLEDGE STREAMS */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 pb-[50vh] space-y-[44vh]">
        {NOTES.map((note, i) => (
          <KnowledgeStream key={i} {...note} index={i} />
        ))}
      </div>
    </section>
  );
}

function KnowledgeStream({ title, subtitle, description, topics, gradient, accent, index }: any) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 160, rotateX: -18 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, margin: "-18%" }}
      transition={{ duration: 1.25, ease: [0.215, 0.61, 0.355, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative perspective-[2000px]"
      style={{ perspective: '2000px' }}
    >
      {/* 3D Index */}
      <motion.div 
        animate={{ rotate: hovered ? -12 : 0, scale: hovered ? 1.05 : 1 }}
        className="absolute -left-20 top-4 text-white/5 text-[14.5rem] font-black select-none pointer-events-none origin-top-left"
      >
        0{index + 1}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-20 items-start pt-20 border-t border-white/10">
        
        {/* LEFT SIDE — RICH CONTENT + 3D VISUALIZER */}
        <div className="space-y-14">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-3xl border border-white/10 bg-white/5 text-xs font-mono tracking-[2.5px] text-gray-400">
            MODULE 0{index + 1} • COMPLETE DEEP DIVE
          </div>

          <div>
            <h2 className="text-6xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-white/65">
              {title}
            </h2>
            <p className="mt-5 text-2xl text-gray-400 font-light leading-tight">{subtitle}</p>
          </div>

          <div className="max-w-prose text-[17px] leading-relaxed text-gray-300">
            {description}
          </div>

          {/* ADVANCED 3D VISUALIZER — MORE NODES */}
          <div 
            className="relative h-96 w-full rounded-3xl overflow-hidden border border-white/10 bg-black/70 group-hover:border-white/30 transition-all duration-700 shadow-2xl"
            style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40`} />
            
            {/* Pulsing core */}
            <motion.div 
              animate={{ scale: [1, 1.22, 1], rotate: [0, 360] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-8 border-white/20"
            />

            {/* Floating 3D nodes — scales with number of topics */}
            {Array.from({ length: Math.max(8, topics.length * 2) }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-10 h-10 bg-white/10 border border-white/50 rounded-2xl backdrop-blur-2xl shadow-2xl flex items-center justify-center text-xs font-mono text-white/60"
                style={{
                  left: `${12 + (i % 6) * 13.5}%`,
                  top: `${18 + Math.floor(i / 6) * 21}%`,
                }}
                animate={{
                  rotateX: [0, 360],
                  rotateY: [0, -340],
                  y: [0, -48, 0],
                  scale: [0.8, 1.25, 0.8]
                }}
                transition={{
                  duration: 9 + (i % 5) * 2.2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {i % 3 === 0 ? "◆" : "◉"}
              </motion.div>
            ))}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.12)_0%,transparent_70%)]" />
          </div>
        </div>

        {/* RIGHT SIDE — 3D TOPIC CARDS */}
        <div className="relative" style={{ perspective: '1800px' }}>
          <div className="space-y-5">
            {topics.map((topic: any, i: number) => (
              <TopicItem 
                key={i} 
                topic={topic} 
                accent={accent} 
                delay={i * 70} 
              />
            ))}
          </div>

          <motion.div
            animate={{ opacity: hovered ? 0.35 : 0.1 }}
            className="absolute -right-28 top-10 w-72 h-full blur-[90px] pointer-events-none"
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function TopicItem({ topic, accent, delay }: { topic: any; accent: string; delay: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 70, rotateX: 28 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: delay / 1000, duration: 1 }}
      whileHover={{ 
        scale: 1.03, 
        rotateX: -16, 
        rotateY: 22, 
        z: 60 
      }}
      className="group/item relative rounded-3xl border border-white/5 hover:border-white/25 bg-white/[0.018] overflow-hidden cursor-pointer shadow-xl"
      style={{ transformStyle: 'preserve-3d' }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-8">
        <div className="flex items-center gap-6">
          <div 
            className="w-5 h-5 rounded-full flex-shrink-0 ring-1 ring-white/30"
            style={{ backgroundColor: accent }}
          />
          <span className="text-2xl font-light tracking-[-0.5px] text-gray-200 group-hover/item:text-white transition-colors">
            {topic.name}
          </span>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 135 : 0 }}
          className="text-4xl text-gray-500 group-hover/item:text-white transition-all"
        >
          +
        </motion.div>
      </div>

      {/* EXPANDED ULTRA-DETAILED CONTENT */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="px-8 pb-10 pt-8 space-y-10 text-[15.2px] leading-relaxed text-gray-300">
              <p>{topic.explanation}</p>

              {/* Analogy */}
              <div className="pl-6 border-l-2 border-white/20">
                <div className="uppercase tracking-[1px] text-xs text-white/60 mb-2">Simple Analogy</div>
                <div className="text-lg text-white/90">→ {topic.analogy}</div>
              </div>

              {/* Code Example */}
              <div className="pl-6 border-l-2 border-white/20">
                <div className="uppercase tracking-[1px] text-xs text-white/60 mb-3">Ready-to-use Example</div>
                <pre className="font-mono text-sm bg-zinc-950 p-6 rounded-2xl border border-white/10 overflow-x-auto text-emerald-300 leading-relaxed">
                  {topic.example}
                </pre>
              </div>

              {/* Complexity + When to Use */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="pl-6 border-l-2 border-white/20">
                  <div className="uppercase tracking-[1px] text-xs text-white/60 mb-2">Time &amp; Space Complexity</div>
                  <div className="text-white font-medium whitespace-pre-line">{topic.complexity}</div>
                </div>
                <div className="pl-6 border-l-2 border-white/20">
                  <div className="uppercase tracking-[1px] text-xs text-white/60 mb-2">Best Used When</div>
                  <div className="text-white/90">{topic.whenToUse}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}