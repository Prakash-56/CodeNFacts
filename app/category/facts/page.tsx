"use client";

/**
 * app/category/facts/page.tsx
 * ------------------------------------------------------------------
 * CodeNFacts — Facts & Cheat Sheets
 * Drop this file at: app/category/facts/page.tsx
 *
 * - Follows the existing CodeNFacts design system:
 *   light panels #ffffff / #f7f8fa, dark panels #0a0e14 / #0d1117,
 *   amber accent in light mode, emerald (#34d399) accent in dark mode,
 *   terminal-chrome header motif with traffic-light dots, JetBrains Mono
 *   for code, Framer Motion fadeUp entrance.
 * - Reads dark mode from the existing `dark` class on <html> (Tailwind
 *   darkMode: "class") — the real toggle already lives in your Header.
 * - 15 categories x 34 facts = 510 facts, no repeats.
 * ------------------------------------------------------------------
 */

import { useMemo, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Search,
  Sparkles,
  BookOpen,
  Layers,
  GitBranch,
  Database,
  Cpu,
  Network,
  Lock,
  Brain,
  Cloud,
  History,
  Trophy,
  Braces,
  FileCode2,
  Terminal,
  Server,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  X,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Motion variants                                                     */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.04, ease: "easeOut" },
  }),
};

/* ------------------------------------------------------------------ */
/* Data: Categories + Facts (510 total)                                */
/* ------------------------------------------------------------------ */

type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
  tagline: string;
  facts: string[];
};

const CATEGORIES: Category[] = [
  {
    id: "javascript",
    name: "JavaScript",
    icon: Braces,
    tagline: "The language of the web",
    facts: [
      "typeof null returns object due to a legacy bug from the very first JS implementation.",
      "NaN is the only value in JavaScript that is not equal to itself.",
      "JavaScript was created by Brendan Eich in just 10 days back in 1995.",
      "It was originally named Mocha, then LiveScript, before being renamed JavaScript for marketing reasons.",
      "Arrays in JS are actually objects with numeric keys under the hood.",
      "0.1 + 0.2 does not equal 0.3 in JavaScript because of floating-point precision.",
      "Functions are first-class citizens and can be passed around like any other value.",
      "The value of this depends on how a function is called, not where it is defined.",
      "JavaScript has automatic semicolon insertion, which can cause subtle bugs if you are not careful.",
      "let and const are block-scoped, while var is function-scoped.",
      "Closures let inner functions remember variables from their outer scope even after it has returned.",
      "The event loop lets JavaScript handle async operations despite being single-threaded.",
      "Array.prototype.sort() sorts elements as strings by default, so [10,1,2].sort() gives [1,10,2].",
      "JSON stands for JavaScript Object Notation, though it is used across nearly every language today.",
      "The spread operator was introduced in ES6 and simplifies copying arrays and objects.",
      "Template literals allow embedded expressions using backticks and dollar-brace syntax.",
      "JavaScript engines like V8 use Just-In-Time compilation to make code run faster.",
      "Strict mode catches common coding mistakes and blocks a number of unsafe actions.",
      "Promises were standardized in ES6 to better manage async code than plain callbacks.",
      "Async/await is really just syntactic sugar built on top of Promises.",
      "The Symbol type was introduced in ES6 to create guaranteed unique identifiers.",
      "Array destructuring lets you unpack values directly into named variables.",
      "WeakMap and WeakSet allow their keys to be garbage collected, unlike Map and Set.",
      "Optional chaining prevents errors when reading deeply nested properties that might not exist.",
      "The nullish coalescing operator only falls back on null or undefined, not on falsy values like 0.",
      "JavaScript has no separate integer type, every number is a 64-bit float except BigInt.",
      "BigInt was added so developers could represent integers larger than Number.MAX_SAFE_INTEGER.",
      "Hoisting moves variable and function declarations to the top of their scope before code runs.",
      "Arrow functions do not have their own this, they inherit it from the enclosing scope.",
      "Object.freeze() makes an object immutable, but only at the top level.",
      "The instanceof operator walks the prototype chain rather than checking a simple type tag.",
      "Node.js took JavaScript out of the browser and onto servers starting in 2009.",
      "console.log supports a percent-c format specifier that lets you style output with CSS.",
      "Modern ES modules replaced older patterns like CommonJS's require in most new codebases.",
    ],
  },
  {
    id: "python",
    name: "Python",
    icon: Terminal,
    tagline: "Readable, versatile, everywhere",
    facts: [
      "Python was created by Guido van Rossum and named after Monty Python's Flying Circus, not the snake.",
      "Python uses indentation instead of curly braces to define code blocks.",
      "Python's guiding philosophy is summarized in the Zen of Python, viewable by typing import this.",
      "Everything in Python is an object, including functions and classes themselves.",
      "Python 2 reached its official end of life on January 1, 2020.",
      "List comprehensions offer a concise way to build lists from other iterables.",
      "Python uses dynamic typing, so a variable's type is determined at runtime.",
      "The Global Interpreter Lock allows only one thread to execute Python bytecode at a time.",
      "Python's duck typing philosophy judges an object by its methods, not its declared type.",
      "Tuples are immutable while lists are mutable, even though both are ordered sequences.",
      "Python supports multiple inheritance, unlike many other object-oriented languages.",
      "The walrus operator, introduced in Python 3.8, allows assignment inside an expression.",
      "Python's standard library is so extensive it is often described as batteries included.",
      "Generators use the yield keyword to produce values lazily and save memory.",
      "Decorators let you modify or extend a function's behavior without changing its code.",
      "Python dictionaries have guaranteed insertion order as a language feature since version 3.7.",
      "PEP 8 defines Python's official style guide for formatting and naming conventions.",
      "Python's default recursion limit is 1000, though it can be changed at runtime.",
      "F-strings, introduced in Python 3.6, are the fastest way to format strings in the language.",
      "Python supports operator overloading through special dunder methods like add and repr.",
      "The is operator compares object identity while double-equals compares value equality.",
      "CPython is the default and most widely used implementation of Python, written in C.",
      "Python's garbage collector combines reference counting with cycle detection.",
      "Virtual environments isolate project dependencies to avoid version conflicts between projects.",
      "Python lambdas are limited to a single expression, unlike full function definitions.",
      "The Python Package Index hosts several hundred thousand third-party packages.",
      "List slicing with a negative step is a quick idiom for reversing a list.",
      "Assert statements are stripped out entirely when Python runs with the optimize flag.",
      "Type hints, added in Python 3.5, add optional static typing without changing runtime behavior.",
      "Python is one of the most popular languages for data science, largely thanks to NumPy and Pandas.",
      "The with statement manages resources automatically through context managers.",
      "Mutable default arguments are a classic gotcha since they persist across function calls.",
      "Multiple assignment lets you swap two variables without ever using a temporary one.",
      "Python was first released in 1991, making it older than Java by a few years.",
    ],
  },
  {
    id: "html-css",
    name: "HTML & CSS",
    icon: FileCode2,
    tagline: "The bones and skin of every page",
    facts: [
      "HTML stands for HyperText Markup Language and was created by Tim Berners-Lee in 1990.",
      "CSS specificity is calculated using a scoring system based on IDs, classes, and elements.",
      "The doctype declaration tells the browser to render the page in standards mode.",
      "Flexbox was designed for one-dimensional layouts, while CSS Grid handles two dimensions at once.",
      "The CSS box model consists of content, padding, border, and margin, in that order.",
      "Semantic tags like article and nav improve both accessibility and search engine understanding.",
      "The z-index property only has an effect on elements that are positioned.",
      "CSS custom properties are defined with a double dash prefix and read with the var function.",
      "The viewport meta tag is essential for responsive design to work correctly on mobile devices.",
      "CSS Grid's fr unit represents a fraction of the available space inside a container.",
      "The root pseudo-class targets the highest-level parent in the document, usually the html element.",
      "Rendering engines like Blink, Gecko, and WebKit can interpret the same HTML and CSS differently.",
      "The alt attribute on images is critical for screen readers and for basic accessibility.",
      "CSS transitions animate property changes smoothly without needing any JavaScript.",
      "Media queries let CSS apply different styles depending on screen size or device features.",
      "Setting display to none removes an element from layout entirely, unlike visibility hidden.",
      "HTML5 introduced native audio and video elements, removing the need for plugins like Flash.",
      "CSS specificity climbs from element selectors, to classes, to IDs, to inline styles, to important.",
      "The canvas element lets you draw arbitrary graphics directly using JavaScript.",
      "Grid-template-areas lets you name and visually map out regions of a layout in plain text.",
      "Web accessibility standards are formally defined by the WCAG guidelines.",
      "Box-sizing border-box makes width calculations include padding and border automatically.",
      "CSS animations use keyframes to define multiple stages of a single animation.",
      "The head element holds metadata that is never rendered directly on the visible page.",
      "Inline, block, and inline-block are core CSS display types with distinct layout behavior.",
      "The cascade in CSS is how the browser resolves conflicting rules using specificity and order.",
      "Pseudo-elements like before and after can insert extra content without any extra HTML.",
      "Google's Lighthouse tool audits pages for performance, accessibility, and best practices.",
      "HTML forms can validate input natively using attributes like required and pattern.",
      "CSS position sticky blends the behavior of relative and fixed positioning.",
      "The picture element lets browsers pick different images depending on screen size or format.",
      "The rem unit is relative to the root font size, while em is relative to the parent element.",
      "Progressive web apps use service workers to keep working even when offline.",
      "The very first website ever published, from CERN in 1991, is still online today.",
    ],
  },
  {
    id: "react-frontend",
    name: "React & Frontend",
    icon: Layers,
    tagline: "Building the modern UI",
    facts: [
      "React was created by Jordan Walke at Facebook and first used on the News Feed in 2011.",
      "The virtual DOM lets React update only the parts of the real DOM that actually changed.",
      "React Hooks, introduced in 2019, let function components use state without writing classes.",
      "JSX is syntactic sugar that compiles down to plain React.createElement calls.",
      "The useEffect hook merges what used to be three separate lifecycle methods in class components.",
      "Keys in a rendered list help React identify which items changed, were added, or were removed.",
      "React re-renders a component whenever its own state or props actually change.",
      "The Context API lets you share data across a component tree without manual prop drilling.",
      "React Fiber, shipped in React 16, rewrote the reconciliation engine for better performance.",
      "Controlled components keep form data entirely inside React state rather than the DOM.",
      "Next.js, built on top of React, popularized server-side rendering for React applications.",
      "useMemo and useCallback help skip unnecessary recalculations and re-renders.",
      "Redux was directly inspired by the Flux architecture pattern, also created at Facebook.",
      "React Server Components let a component render on the server without shipping its JS to the client.",
      "A list key should be a stable identifier, never an array index when the order can change.",
      "Vue.js, created by Evan You, was designed to feel more approachable than Angular.",
      "Svelte compiles components into plain vanilla JavaScript at build time instead of using a virtual DOM.",
      "Webpack, Vite, and Turbopack are all bundlers used somewhere in modern frontend pipelines.",
      "Tailwind CSS uses small utility classes instead of writing custom CSS per component.",
      "React's Strict Mode intentionally double-invokes certain functions in development to surface bugs.",
      "TypeScript adds static typing on top of JavaScript and was created by Microsoft in 2012.",
      "Hydration is the process of attaching event listeners to server-rendered HTML on the client.",
      "CSS-in-JS libraries let you write actual CSS directly inside your JavaScript files.",
      "React Router enables client-side navigation between views without a full page reload.",
      "Framer Motion is one of the most popular animation libraries for React interfaces.",
      "Component-driven development builds interfaces out of small, isolated, reusable pieces.",
      "React.lazy combined with Suspense splits code and shrinks the initial JavaScript bundle.",
      "Angular, maintained by Google, uses TypeScript by default and an MVC-like structure.",
      "The single page application model loads one HTML page and updates content dynamically.",
      "React's synthetic event system normalizes differences in how browsers fire native events.",
      "Zustand and Jotai are lightweight alternatives to Redux for managing application state.",
      "Lifting state up means moving shared state to the closest common ancestor component.",
      "Web Components let you build reusable custom elements natively, without any framework.",
      "Storybook lets developers build and visually test UI components completely in isolation.",
    ],
  },
  {
    id: "git",
    name: "Git & Version Control",
    icon: GitBranch,
    tagline: "Never lose your work again",
    facts: [
      "Git was created by Linus Torvalds in 2005 to help manage the Linux kernel's source code.",
      "Every commit in Git is identified by a SHA-1 hash generated from its content.",
      "Git is a distributed version control system, so every clone holds the full project history.",
      "Rebase rewrites commit history, while merge preserves it exactly as it happened.",
      "A detached HEAD means you are viewing a specific commit rather than sitting on a branch.",
      "Git branches are just lightweight pointers to commits, not full copies of the codebase.",
      "The gitignore file tells Git which files or folders it should never track.",
      "git stash temporarily shelves uncommitted changes so you can switch context quickly.",
      "GitHub, GitLab, and Bitbucket host Git repositories but are not part of Git itself.",
      "A fast-forward merge happens when the target branch has no new commits since branching.",
      "Cherry-pick applies one specific commit from one branch onto a different branch.",
      "git blame shows exactly who last modified each line of a file, and when.",
      "Git's three-way merge algorithm compares the common ancestor against both diverging branches.",
      "A pull request is a workflow feature added by hosting platforms, not part of Git core.",
      "git reset with the hard flag permanently discards uncommitted changes, so use it carefully.",
      "Semantic versioning, using major, minor, and patch numbers, is a common convention for releases.",
      "git bisect uses binary search across commit history to find which commit introduced a bug.",
      "A merge conflict occurs when Git cannot automatically reconcile changes to the same lines.",
      "git reflog can recover commits even after a hard reset or an accidental branch deletion.",
      "Forking creates your own personal copy of someone else's repository on platforms like GitHub.",
      "Git tags mark a specific point in history, most often used for release versions.",
      "The log command with oneline and graph flags visualizes branch history compactly.",
      "Submodules let one Git repository include another as a tracked subdirectory.",
      "Trunk-based development favors small, frequent merges directly into a single main branch.",
      "GitFlow is a branching model that uses separate branches for features, releases, and hotfixes.",
      "The amend flag lets you edit your most recent commit instead of creating a brand new one.",
      "A shallow clone downloads only recent history to save both time and disk space.",
      "Conventional Commits is a specification for writing structured, machine-readable commit messages.",
      "Squashing combines multiple commits into one, often used to clean history before merging.",
      "Signed commits use GPG keys to verify a commit really came from its claimed author.",
      "The staging area lets you choose exactly which changes go into your next commit.",
      "git worktree lets you check out multiple branches into separate folders at the same time.",
      "CI and CD pipelines often trigger automatically on Git events like pushes or pull requests.",
      "Torvalds reportedly built the first working version of Git in about ten days.",
    ],
  },
  {
    id: "sql-databases",
    name: "SQL & Databases",
    icon: Database,
    tagline: "Where your data actually lives",
    facts: [
      "SQL stands for Structured Query Language and was developed at IBM in the early 1970s.",
      "A primary key uniquely identifies each row in a table and cannot contain null values.",
      "Normalization organizes tables to reduce redundancy and keep data consistent.",
      "An inner join returns only rows that have matching values in both joined tables.",
      "A left join returns every row from the left table plus matches from the right, or nulls.",
      "Indexes speed up read queries but can slow down writes because of extra upkeep.",
      "ACID stands for Atomicity, Consistency, Isolation, and Durability in transaction processing.",
      "NoSQL databases like MongoDB store data as flexible documents instead of rigid tables.",
      "A foreign key enforces a link between two tables and maintains referential integrity.",
      "Group by is used together with aggregate functions like count, sum, and average.",
      "SQL injection is one of the oldest and still most common web security vulnerabilities.",
      "A view is a virtual table built from the saved result of a stored query.",
      "PostgreSQL supports advanced features like JSONB storage, full-text search, and custom types.",
      "Redis is an in-memory key-value store, often used for caching and real-time features.",
      "Database sharding splits a large database across multiple servers to improve scalability.",
      "A composite key combines two or more columns to uniquely identify a single row.",
      "Having filters grouped results, while where filters individual rows before grouping happens.",
      "B-trees are the data structure most commonly used internally to implement database indexes.",
      "MySQL was originally released in 1995 and remains one of the most widely used databases.",
      "A database transaction groups multiple operations so they either all succeed or all fail.",
      "Denormalization intentionally adds redundancy to improve read performance in specific cases.",
      "Firestore is a NoSQL document database from Google's Firebase platform.",
      "The explain command shows exactly how a database engine plans to execute a given query.",
      "Database replication copies data across multiple servers for redundancy and load balancing.",
      "A stored procedure is precompiled SQL code saved inside the database for reuse.",
      "Isolation levels control how concurrent transactions can see each other's in-progress changes.",
      "Graph databases like Neo4j are optimized for data with complex relationships, such as social networks.",
      "The union operator combines results from multiple select queries and removes duplicates by default.",
      "A deadlock occurs when two transactions end up waiting on each other's locks indefinitely.",
      "Connection pooling reuses existing database connections to avoid the overhead of opening new ones.",
      "SQLite is a lightweight, serverless database engine often embedded directly inside applications.",
      "Data warehouses are optimized for analytical queries, unlike systems built for frequent writes.",
      "The CAP theorem says a distributed system can only fully guarantee two of consistency, availability, and partition tolerance.",
      "Column-oriented databases like Cassandra store data by column instead of by row for faster analytics.",
    ],
  },
  {
    id: "data-structures",
    name: "Data Structures",
    icon: Cpu,
    tagline: "The shapes that hold your data",
    facts: [
      "An array stores elements in contiguous memory, giving constant-time access by index.",
      "A linked list stores elements as nodes with pointers, giving fast insertion but slow access.",
      "Stacks follow last-in-first-out order, much like a physical stack of plates.",
      "Queues follow first-in-first-out order, much like a line at a checkout counter.",
      "A hash table uses a hash function to map keys to indices for near-instant lookups.",
      "Binary trees allow at most two children per node, and binary search trees keep them ordered.",
      "A balanced binary search tree, such as an AVL tree, guarantees logarithmic-time operations.",
      "Heaps are tree-based structures where a parent is always greater, or smaller, than its children.",
      "Tries are tree structures optimized for storing and searching strings, like autocomplete systems.",
      "A graph is made of vertices connected by edges, which can be either directed or undirected.",
      "Hash collisions happen when two keys map to the same index and must be resolved somehow.",
      "A doubly linked list allows traversal in both directions using next and previous pointers.",
      "Red-black trees are self-balancing binary search trees used inside many language standard libraries.",
      "A circular buffer reuses a fixed block of memory by wrapping around once it becomes full.",
      "Sets store only unique elements, and most implementations rely on a hash table internally.",
      "Skip lists use several layers of linked lists to reach logarithmic search without full balancing.",
      "A priority queue serves elements by priority rather than insertion order, often built on a heap.",
      "B-trees generalize binary search trees to allow more than two children, ideal for disk storage.",
      "Adjacency lists and adjacency matrices are the two main ways to represent a graph in memory.",
      "A trie's name comes from the word retrieval, though many people pronounce it like try.",
      "Disjoint-set structures efficiently track and merge groups of connected elements over time.",
      "Dynamic arrays typically resize by doubling their capacity once they run out of room.",
      "A bloom filter can tell you an item is possibly present, or definitely absent, using very little memory.",
      "Segment trees allow efficient range queries and updates, common in competitive programming.",
      "Double-ended queues allow insertion and removal from both ends in constant time.",
      "A perfect binary tree has every single level completely filled with nodes.",
      "LRU caches are commonly implemented using a hash map paired with a doubly linked list.",
      "Sparse matrices store only the non-zero elements to save memory in mostly-empty grids.",
      "Multi-dimensional arrays are stored in memory as either row-major or column-major order.",
      "A trie's search time depends on the length of the string, not the number of strings stored.",
      "Suffix trees and suffix arrays enable very fast substring searches in large bodies of text.",
      "Fenwick trees, also called binary indexed trees, support fast prefix sum queries and updates.",
      "Immutable data structures, common in functional programming, never change after they are created.",
      "XOR linked lists save memory by storing one combined pointer instead of two separate ones.",
    ],
  },
  {
    id: "algorithms",
    name: "Algorithms",
    icon: Sparkles,
    tagline: "Step-by-step problem solving",
    facts: [
      "Binary search runs in logarithmic time but requires the input to already be sorted.",
      "Bubble sort is simple to understand but runs in quadratic time, making it slow at scale.",
      "Quicksort has average-case linearithmic performance but can degrade badly on already-sorted input.",
      "Merge sort guarantees linearithmic performance by consistently dividing and merging the array.",
      "Dijkstra's algorithm finds the shortest path in a graph with only non-negative edge weights.",
      "Dynamic programming solves problems by breaking them into overlapping subproblems and caching results.",
      "Greedy algorithms make the locally optimal choice at each step, which does not always give a global optimum.",
      "Breadth-first search explores a graph level by level using a queue.",
      "Depth-first search explores as far as possible along one branch before backtracking.",
      "Big O notation describes the worst-case growth rate of an algorithm's time or space usage.",
      "The traveling salesman problem is NP-hard, meaning no known algorithm solves it efficiently at scale.",
      "Memoization stores the results of expensive function calls to avoid redundant computation later.",
      "A-star search combines Dijkstra's algorithm with heuristics to find paths more efficiently.",
      "Recursion solves a problem by having a function call itself on progressively smaller subproblems.",
      "Bellman-Ford can handle negative edge weights, which Dijkstra's algorithm cannot.",
      "Sorting algorithms are classified as stable or unstable based on whether equal elements keep their order.",
      "Two-pointer techniques often reduce array problems from quadratic time down to linear time.",
      "Backtracking algorithms build a solution incrementally and abandon any path that fails a constraint.",
      "Kadane's algorithm finds the maximum sum subarray in linear time.",
      "Topological sorting orders the nodes of a directed acyclic graph based on their dependencies.",
      "Kruskal's and Prim's algorithms both find a minimum spanning tree, using different strategies.",
      "The sliding window technique efficiently processes contiguous subarrays or substrings.",
      "Radix sort can achieve linear time for integers by sorting one digit at a time.",
      "NP-complete problems can have a solution verified quickly, even though finding one may not be quick.",
      "Divide and conquer algorithms split a problem into pieces, solve each one, then combine the results.",
      "Floyd-Warshall computes shortest paths between every pair of nodes in cubic time.",
      "Huffman coding is a greedy algorithm used for lossless data compression.",
      "The knapsack problem is a classic example used to teach dynamic programming.",
      "Randomized algorithms, like randomized quicksort, use randomness to improve average-case performance.",
      "Amortized analysis measures the average cost of an operation across a sequence, not just one worst case.",
      "The master theorem offers a shortcut for solving recurrence relations in divide-and-conquer algorithms.",
      "Boyer-Moore is a highly efficient string-searching algorithm used inside many text editors.",
      "Genetic algorithms mimic natural selection to search for approximate solutions to hard problems.",
      "P versus NP remains one of the most famous unsolved problems in computer science.",
    ],
  },
  {
    id: "operating-systems",
    name: "Operating Systems",
    icon: Server,
    tagline: "What runs beneath everything",
    facts: [
      "An operating system manages hardware resources and provides services to application software.",
      "A process is a running instance of a program, while a thread is a smaller unit of execution inside it.",
      "Context switching lets a single CPU rapidly alternate between processes, creating an illusion of multitasking.",
      "Virtual memory lets a system extend available RAM using disk space through paging.",
      "A deadlock occurs when processes get stuck waiting on resources held by one another.",
      "The kernel is the core part of an operating system with full access to hardware.",
      "UNIX, developed at Bell Labs in 1969, heavily influenced the design of Linux and macOS.",
      "Linux, strictly speaking, is only the kernel, with GNU tools completing the rest of the system.",
      "A system call is how a program requests services, such as file access, from the kernel.",
      "Multithreading lets a single process run multiple tasks concurrently while sharing memory space.",
      "The scheduler decides which process gets the CPU next, using strategies like round-robin scheduling.",
      "File systems like NTFS, ext4, and APFS define how data is organized and stored on disk.",
      "A page fault occurs when a program accesses memory that is not currently loaded into RAM.",
      "Semaphores and mutexes are synchronization tools used to prevent race conditions between threads.",
      "The boot process loads the kernel into memory before handing off control from firmware.",
      "Containers share the host operating system's kernel, unlike full virtual machines.",
      "A race condition happens when a program's outcome depends on unpredictable timing between threads.",
      "Windows NT, released in 1993, formed the foundation for every modern version of Windows.",
      "Interrupts let hardware signal the CPU that it urgently needs attention.",
      "The swap file is disk space used as overflow whenever physical RAM becomes full.",
      "Android runs on a modified Linux kernel that has been customized for mobile hardware.",
      "A daemon is a background process that runs without any direct user interaction.",
      "Copy-on-write is an optimization where processes share memory until one of them tries to modify it.",
      "The fork system call creates a new process by duplicating an existing one on UNIX-like systems.",
      "Time-sharing systems from the 1960s let multiple users interact with one computer simultaneously.",
      "A zombie process has finished running but still keeps an entry in the process table.",
      "Real-time operating systems guarantee that certain tasks finish within strict time limits.",
      "The inode in a UNIX file system stores a file's metadata, but never its actual name.",
      "macOS is built on Darwin, an open-source UNIX-like core developed by Apple.",
      "Thrashing happens when a system spends more time swapping memory than doing useful work.",
      "A hypervisor manages virtual machines and can run directly on hardware or on top of an OS.",
      "The chmod command in UNIX-like systems controls file permissions for owner, group, and everyone else.",
      "Preemptive multitasking lets the OS forcibly interrupt a running task to switch to another one.",
      "Solaris, developed by Sun Microsystems, introduced ZFS, a filesystem with built-in data integrity checks.",
    ],
  },
  {
    id: "networking",
    name: "Computer Networking",
    icon: Network,
    tagline: "How machines actually talk",
    facts: [
      "The OSI model describes networking in seven layers, from physical cables up to application software.",
      "TCP guarantees reliable, ordered delivery of data, while UDP trades reliability for raw speed.",
      "IP addresses come in two versions in wide use today, IPv4 with 32 bits and IPv6 with 128 bits.",
      "DNS translates human-readable domain names into the IP addresses computers actually use.",
      "HTTP is stateless by design, meaning each request is handled independently of the last.",
      "HTTPS encrypts HTTP traffic using TLS to protect data while it is in transit.",
      "A firewall filters network traffic according to a set of predefined security rules.",
      "The TCP three-way handshake establishes a reliable connection before any data is exchanged.",
      "A subnet mask determines which part of an IP address identifies the network versus the host.",
      "Port 80 is the default for HTTP traffic, while port 443 is the default for HTTPS.",
      "NAT lets many devices on a local network share a single public IP address.",
      "A content delivery network caches content across servers worldwide to reduce latency for users.",
      "WebSockets provide full-duplex communication over one long-lived connection, unlike ordinary HTTP requests.",
      "The ping utility uses ICMP packets to test connectivity and measure round-trip time.",
      "A VPN builds an encrypted tunnel between a device and a remote network over the public internet.",
      "DHCP automatically assigns IP addresses to devices as they join a network.",
      "Latency measures delay, while bandwidth measures the maximum data a connection can carry.",
      "HTTP status codes like 200, 404, and 500 signal success, client errors, and server errors respectively.",
      "A load balancer spreads incoming traffic across multiple servers to improve both speed and reliability.",
      "BGP is the core routing protocol that determines how data travels between different networks.",
      "Wi-Fi standards such as 802.11ac and 802.11ax define the speed and range of wireless networks.",
      "REST APIs use standard HTTP methods like GET, POST, PUT, and DELETE to operate on resources.",
      "GraphQL, developed at Facebook, lets a client request exactly the data it needs in a single query.",
      "A MAC address is a unique hardware identifier assigned to a device's network interface.",
      "Packet switching breaks data into small pieces that travel independently and reassemble at the destination.",
      "TLS certificates are issued by certificate authorities to verify a website's real identity.",
      "The Internet Protocol Suite is usually just called TCP/IP after its two foundational protocols.",
      "Traceroute reveals the path packets take across multiple routers on the way to their destination.",
      "A proxy server sits between a client and the internet, often for caching or added privacy.",
      "Multiplexing in HTTP/2 lets multiple requests and responses share a single connection at once.",
      "The first message ever sent over ARPANET was meant to be LOGIN, but the system crashed after LO.",
      "Rate limiting protects APIs from abuse by capping how many requests a client can make.",
      "mDNS lets devices discover one another on a local network without a central DNS server.",
      "QUIC, which underlies HTTP/3, runs over UDP to cut down on connection setup latency.",
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: Lock,
    tagline: "Guarding the code you write",
    facts: [
      "SQL injection attacks exploit unsanitized user input to manipulate database queries.",
      "Cross-site scripting injects malicious scripts into webpages that are then viewed by other users.",
      "Two-factor authentication adds a second verification step on top of just a password.",
      "Hashing is a one-way function, while encryption is deliberately designed to be reversible with a key.",
      "A zero-day vulnerability is a flaw the vendor does not yet know about at the time it is exploited.",
      "Phishing attacks trick users into revealing sensitive information through deceptive messages or sites.",
      "Salting passwords before hashing stops attackers from using precomputed rainbow tables.",
      "A DDoS attack overwhelms a target with traffic from many sources to make it unavailable.",
      "The principle of least privilege limits users and systems to only the access they truly need.",
      "Public key cryptography uses a key pair, where data locked with one key can only be opened by the other.",
      "Cross-site request forgery tricks a logged-in user's browser into performing an unwanted action.",
      "Penetration testing simulates real attacks to find vulnerabilities before malicious actors do.",
      "A honeypot is a decoy system designed to attract and study attackers safely.",
      "Ransomware encrypts a victim's files and demands payment in exchange for the decryption key.",
      "Multi-factor authentication combines something you know, something you have, and something you are.",
      "The CIA triad, standing for confidentiality, integrity, and availability, underpins information security.",
      "Buffer overflow attacks exploit programs that write more data into memory than it can actually hold.",
      "Social engineering exploits human psychology rather than technical flaws to breach security.",
      "Certificate pinning helps prevent man-in-the-middle attacks by trusting only specific certificates.",
      "OWASP maintains a widely referenced list of the top ten most critical web application risks.",
      "A man-in-the-middle attack secretly intercepts, and sometimes alters, traffic between two parties.",
      "Bug bounty programs pay ethical hackers to responsibly disclose the vulnerabilities they find.",
      "Relying on secrecy of design rather than real protection is widely considered weak security practice.",
      "End-to-end encryption ensures only the communicating users can read a message, not even the provider.",
      "Malware is a broad umbrella term covering viruses, worms, trojans, spyware, and ransomware.",
      "A VPN does not make you anonymous, it simply encrypts and reroutes your traffic through another server.",
      "Password managers reduce risk by generating and storing a strong, unique password for every account.",
      "Privilege escalation attacks aim to gain a higher level of access than was originally granted.",
      "Input validation and sanitization form the first line of defense against injection-based attacks.",
      "The Morris Worm of 1988 was one of the first major worms to spread across the early internet.",
      "Rate limiting and CAPTCHAs help defend against automated brute-force login attempts.",
      "Security headers like Content-Security-Policy help browsers block unauthorized script execution.",
      "Air-gapped systems are physically isolated from unsecured networks to shrink their attack surface.",
      "Supply chain attacks compromise trusted software or dependencies to reach a much wider set of victims.",
    ],
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    icon: Brain,
    tagline: "Teaching machines to learn",
    facts: [
      "The term artificial intelligence was first coined at the Dartmouth Conference back in 1956.",
      "Machine learning models improve by learning patterns from data rather than following explicit rules.",
      "A neural network's structure is loosely inspired by neurons in the human brain, not a direct copy.",
      "Overfitting happens when a model learns its training data too well, hurting performance on new data.",
      "Supervised learning uses labeled data, while unsupervised learning finds patterns in unlabeled data.",
      "Backpropagation, the algorithm behind training neural networks, was popularized in a 1986 paper.",
      "Transformers, introduced in a landmark 2017 paper, power most modern language models today.",
      "Reinforcement learning trains an agent through rewards and penalties rather than labeled examples.",
      "A convolutional neural network is especially effective at image recognition tasks.",
      "Gradient descent is the optimization algorithm most commonly used to train machine learning models.",
      "Large language models are trained largely by predicting the next word across massive amounts of text.",
      "Transfer learning reuses a pretrained model's knowledge as a head start for a new, related task.",
      "The training data a model learns from can introduce real bias if it is not representative.",
      "Tokenization breaks text into smaller pieces, like words or subwords, before feeding it to a model.",
      "Recurrent neural networks were designed for sequential data but struggle with long-term dependencies.",
      "AlphaGo, developed by DeepMind, defeated a world champion Go player in 2016, a landmark moment for AI.",
      "Feature engineering involves selecting and transforming raw data into inputs a model can learn from well.",
      "A hyperparameter is a setting configured before training, such as learning rate, unlike a learned weight.",
      "Generative adversarial networks pit two neural networks against each other to produce realistic data.",
      "Fine-tuning adapts a pretrained model to a specific task using a smaller, targeted dataset.",
      "The Turing Test, proposed in 1950, checks whether a machine can behave indistinguishably from a human.",
      "Embeddings represent words, images, or other data as vectors of numbers that capture meaning.",
      "Diffusion models generate images by gradually removing noise from a random starting point.",
      "Explainable AI focuses on making a model's decisions understandable to the humans using it.",
      "A confusion matrix summarizes a classifier's performance across true and false positives and negatives.",
      "Prompt engineering is the practice of crafting inputs to get better outputs from a language model.",
      "Data augmentation artificially expands a training dataset by creating modified copies of existing data.",
      "AI hallucination describes a model generating confident but factually incorrect information.",
      "Federated learning trains a model across many devices without ever centralizing the raw data.",
      "The curse of dimensionality describes how data grows sparser and harder to model as features increase.",
      "Chatbots existed long before modern LLMs, ELIZA from 1966 simulated a psychotherapist convincingly.",
      "Model quantization reduces the precision of a model's numbers to make it smaller and faster.",
      "Retrieval-augmented generation pairs a language model with an external knowledge source for better answers.",
      "AI ethics research focuses heavily on fairness, transparency, and preventing harm from automated decisions.",
    ],
  },
  {
    id: "devops-cloud",
    name: "DevOps & Cloud",
    icon: Cloud,
    tagline: "Shipping software that scales",
    facts: [
      "Docker packages an application with its dependencies into portable containers for consistency.",
      "Kubernetes, originally built at Google, automates the deployment and scaling of containerized apps.",
      "CI/CD stands for continuous integration and continuous deployment, or delivery.",
      "Infrastructure as code manages servers and resources through configuration files instead of manual setup.",
      "Terraform, built by HashiCorp, is a widely used open-source tool for infrastructure as code.",
      "AWS, Azure, and Google Cloud together dominate most of the global cloud computing market.",
      "Serverless computing lets developers run code without directly managing the underlying servers.",
      "A microservices architecture splits an application into small, independently deployable services.",
      "Blue-green deployment reduces downtime by running two identical environments and switching traffic between them.",
      "Monitoring tools like Prometheus and Grafana track system health and visualize metrics in real time.",
      "Load testing simulates heavy traffic to reveal how a system performs under stress before it happens live.",
      "GitHub Actions, GitLab CI, and Jenkins are all common tools for automating build and deploy pipelines.",
      "Canary releases roll a change out to a small subset of users before a full rollout.",
      "Auto-scaling automatically adjusts computing resources to match real-time demand.",
      "Vercel and Netlify popularized simple, git-based deployment workflows for modern web apps.",
      "Redis and Memcached are commonly used for caching to reduce database load and latency.",
      "A YAML file is often used to define configuration for CI/CD pipelines and Kubernetes deployments.",
      "Observability goes beyond monitoring by combining logs, metrics, and traces into one clear picture.",
      "The twelve-factor app methodology outlines best practices for building scalable, maintainable cloud apps.",
      "Feature flags let teams turn functionality on or off without shipping an entirely new deployment.",
      "Chaos engineering deliberately introduces failures to test resilience, popularized by Netflix's Chaos Monkey.",
      "A reverse proxy like Nginx handles load balancing, caching, and SSL termination in front of servers.",
      "Environment variables keep sensitive configuration, like API keys, safely out of source code.",
      "Zero-downtime deployment techniques ensure users never notice an outage during a release.",
      "GitOps treats a Git repository as the single source of truth for infrastructure and deployment state.",
      "Deployment frequency is a key metric tracked in the DORA framework for measuring DevOps performance.",
      "A postmortem documents what went wrong after an outage, deliberately without assigning individual blame.",
      "Content delivery networks like Cloudflare cache static assets closer to users all around the world.",
      "Helm is often described as the package manager for Kubernetes, simplifying complex deployments.",
      "Immutable infrastructure replaces servers entirely for updates instead of patching them in place.",
      "A service mesh like Istio manages communication, security, and observability between microservices.",
      "Log aggregation tools like the ELK stack centralize logs from many different services in one place.",
      "Cron jobs schedule recurring tasks, and their basic syntax dates all the way back to early UNIX.",
      "Cloud cost optimization often focuses on right-sizing instances and eliminating resources sitting idle.",
    ],
  },
  {
    id: "cs-history",
    name: "Computer Science History",
    icon: History,
    tagline: "How we got here",
    facts: [
      "Ada Lovelace is often considered the first computer programmer for her 1840s work on Babbage's engine.",
      "The first electronic general-purpose computer, ENIAC, was completed in 1945 and weighed about 30 tons.",
      "Alan Turing's theoretical machine, described in 1936, laid the mathematical foundation for modern computing.",
      "The very first computer bug was literally a moth found trapped inside a relay in 1947.",
      "The word software was first used in print by statistician John Tukey back in 1958.",
      "Grace Hopper developed the first compiler and helped popularize the term debugging.",
      "The transistor, invented at Bell Labs in 1947, replaced bulky vacuum tubes and reshaped computing.",
      "The first computer mouse, built by Douglas Engelbart, was made of wood back in 1964.",
      "ARPANET, the internet's precursor, went live in 1969 connecting just four university computers.",
      "The first email was sent by Ray Tomlinson in 1971, who also chose the at symbol for addresses.",
      "Apple was founded in 1976 by Steve Jobs, Steve Wozniak, and Ronald Wayne in a California garage.",
      "The Altair 8800, often called the first personal computer, was sold as a build-it-yourself kit in 1975.",
      "IBM released its first PC in 1981, helping standardize personal computing for businesses everywhere.",
      "Tim Berners-Lee invented the World Wide Web in 1989 while working at CERN.",
      "The first webcam was built at Cambridge University purely to check whether a coffee pot was full.",
      "Moore's Law, coined in 1965, predicted that transistor counts on chips would double roughly every two years.",
      "IBM introduced the floppy disk in 1971, which initially held only about 80 kilobytes of data.",
      "The first computer virus, called Creeper, appeared in 1971 and displayed a taunting message on infected screens.",
      "Bill Gates and Paul Allen founded Microsoft in 1975 to sell a BASIC interpreter for the Altair 8800.",
      "The QWERTY keyboard layout was designed in the 1870s partly to reduce mechanical typewriter jams.",
      "IBM's first one-gigabyte hard drive, released in 1980, weighed about 550 pounds.",
      "Linus Torvalds created Linux in 1991 as a personal project while he was a student in Finland.",
      "The infamous Y2K bug stemmed from programs storing years as only two digits.",
      "Amazon started in 1994 as an online bookstore before expanding into cloud computing and much more.",
      "The first iPhone, released in 2007, helped popularize touchscreens and modern mobile app ecosystems.",
      "Google was founded in 1998 by Larry Page and Sergey Brin under the original name BackRub.",
      "The word bit, short for binary digit, was coined by statistician John Tukey in 1947.",
      "COBOL, created in 1959, is still running today inside many legacy banking and government systems.",
      "The Apollo Guidance Computer that helped land astronauts on the Moon in 1969 had far less power than a modern calculator.",
      "Wikipedia launched in 2001 and grew into the largest collaboratively edited reference work in history.",
      "IBM's RAMAC 305 from 1956, the first hard disk drive, stored about five megabytes across fifty large discs.",
      "Netscape Navigator, released in 1994, was one of the earliest widely used web browsers.",
      "The USB standard was introduced in 1996 to unify a chaotic mess of proprietary computer connectors.",
      "IBM's Deep Blue defeated reigning world chess champion Garry Kasparov in 1997.",
    ],
  },
  {
    id: "career-trivia",
    name: "Programming Trivia & Career",
    icon: Trophy,
    tagline: "Life in and around the code",
    facts: [
      "The Hello World tradition as a first program traces back to a 1972 Bell Labs internal memo for C.",
      "The word bug for a technical glitch predates computing, used by Thomas Edison in his notes in the 1870s.",
      "Rubber duck debugging means explaining your code line by line to an object to help find the bug yourself.",
      "Many interviewers still use the FizzBuzz test to quickly filter candidates who cannot code at all.",
      "The idea of a 10x engineer suggests some developers are ten times more productive, though it is widely debated.",
      "Stack Overflow was founded in 2008 by Jeff Atwood and Joel Spolsky to fix broken programmer forums.",
      "GitHub was founded in 2008 and later acquired by Microsoft in 2018 for around 7.5 billion dollars.",
      "It works on my machine remains one of the most common phrases in software development.",
      "Technical debt describes the implied cost of shortcuts taken now that require rework later on.",
      "Pair programming puts two developers on the same code together, one writing and one reviewing.",
      "Code reviews catch bugs early and spread knowledge across a team, not just enforce style rules.",
      "The Agile Manifesto, written in 2001, prioritized individuals and working software over rigid process.",
      "Scrum, one of the most popular Agile frameworks, organizes work into fixed-length sprints.",
      "Imposter syndrome is extremely common among developers, including senior engineers at top companies.",
      "Open source projects like Linux and VS Code are built and maintained largely by volunteer communities.",
      "Many developers keep a personal brag document to track achievements ahead of performance reviews.",
      "The Pareto principle suggests roughly 80 percent of effects often come from just 20 percent of causes.",
      "Whiteboard interviews remain controversial since they rarely reflect real day-to-day coding work.",
      "Competitive programming platforms like LeetCode and Codeforces help developers practice algorithmic thinking.",
      "Full-stack developers work across both frontend and backend, while specialists focus deeply on one layer.",
      "The term full stack does not have one fixed definition and varies significantly between companies.",
      "Continuous learning is considered essential in tech since languages and frameworks keep evolving.",
      "Many senior engineers recommend reading other people's code as much as writing your own to grow faster.",
      "Soft skills like communication and collaboration are often valued just as highly as technical skill.",
      "The Dunning-Kruger effect can cause beginners to overestimate their skill before experience corrects it.",
      "Open-source contribution is a common way for students to build a public portfolio before their first job.",
      "Yak shaving describes getting sidetracked into a chain of unrelated tasks to solve one small problem.",
      "Structured internship programs give students hands-on experience that classroom learning alone cannot provide.",
      "Remote work became mainstream across the tech industry following the global shift during 2020.",
      "Many successful engineers started out by building small side projects rather than only studying theory.",
      "The bus factor describes how many team members could disappear before a project stalls completely.",
      "Interview processes increasingly test system design skills, not just algorithms, for mid to senior roles.",
      "Writing clear documentation is frequently ranked as one of the most undervalued skills among developers.",
      "Consistency in daily practice, even just thirty minutes of coding, compounds significantly over months and years.",
    ],
  },
];

const TOTAL_FACTS = CATEGORIES.reduce((sum, c) => sum + c.facts.length, 0);

/* ------------------------------------------------------------------ */
/* Data: Cheat sheets                                                  */
/* ------------------------------------------------------------------ */

type CheatRow = { label: string; code: string };
type CheatSheet = { id: string; title: string; icon: LucideIcon; rows: CheatRow[] };

const CHEATSHEETS: CheatSheet[] = [
  {
    id: "big-o",
    title: "Big-O Complexity",
    icon: Sparkles,
    rows: [
      { label: "O(1)", code: "Array index access, hash map get/set" },
      { label: "O(log n)", code: "Binary search, balanced BST operations" },
      { label: "O(n)", code: "Single loop, linear scan, array traversal" },
      { label: "O(n log n)", code: "Merge sort, quicksort (average), heapsort" },
      { label: "O(n^2)", code: "Nested loops, bubble sort, insertion sort" },
      { label: "O(2^n)", code: "Recursive Fibonacci, subsets/power set" },
      { label: "O(n!)", code: "Brute-force permutations, traveling salesman" },
    ],
  },
  {
    id: "git",
    title: "Git Commands",
    icon: GitBranch,
    rows: [
      { label: "Start", code: "git init  /  git clone <url>" },
      { label: "Status", code: "git status  /  git diff" },
      { label: "Stage & commit", code: "git add .  &&  git commit -m msg" },
      { label: "Branching", code: "git checkout -b feature/name" },
      { label: "Sync", code: "git pull  /  git push origin branch" },
      { label: "Combine", code: "git merge branch  /  git rebase main" },
      { label: "Undo", code: "git reset --hard HEAD~1  /  git revert HEAD" },
      { label: "Shelve", code: "git stash  /  git stash pop" },
      { label: "History", code: "git log --oneline --graph --all" },
    ],
  },
  {
    id: "js-array",
    title: "JS Array Methods",
    icon: Braces,
    rows: [
      { label: "map()", code: "Transform each item, returns a new array" },
      { label: "filter()", code: "Keep items matching a condition" },
      { label: "reduce()", code: "Fold the array down into a single value" },
      { label: "find()", code: "Return the first matching element" },
      { label: "some() / every()", code: "Check if any / all items match" },
      { label: "includes()", code: "Check if a value exists in the array" },
      { label: "sort()", code: "Mutates in place, compares as strings by default" },
      { label: "slice() vs splice()", code: "slice copies a range, splice mutates in place" },
      { label: "flat()", code: "Flatten nested arrays by a given depth" },
    ],
  },
  {
    id: "sql-joins",
    title: "SQL Joins",
    icon: Database,
    rows: [
      { label: "INNER JOIN", code: "Only rows that match in both tables" },
      { label: "LEFT JOIN", code: "All left rows, matched right rows or NULL" },
      { label: "RIGHT JOIN", code: "All right rows, matched left rows or NULL" },
      { label: "FULL OUTER JOIN", code: "All rows from both sides, unmatched as NULL" },
      { label: "CROSS JOIN", code: "Every combination of rows from both tables" },
      { label: "SELF JOIN", code: "A table joined against itself" },
    ],
  },
  {
    id: "css-layout",
    title: "Flexbox & Grid",
    icon: FileCode2,
    rows: [
      { label: "display: flex", code: "flex-direction, justify-content, align-items" },
      { label: "justify-content", code: "start | center | space-between | space-around" },
      { label: "align-items", code: "stretch | center | flex-start | flex-end" },
      { label: "gap", code: "Spacing between flex or grid children" },
      { label: "display: grid", code: "grid-template-columns: repeat(3, 1fr)" },
      { label: "grid-template-areas", code: "Name and map layout regions visually" },
    ],
  },
  {
    id: "regex",
    title: "Regex Basics",
    icon: Terminal,
    rows: [
      { label: ".", code: "Any single character except a newline" },
      { label: "\\d  \\w  \\s", code: "Digit, word character, whitespace" },
      { label: "* + ?", code: "Zero or more, one or more, zero or one" },
      { label: "^  $", code: "Start of string, end of string" },
      { label: "[...]", code: "A character class, e.g. [a-z0-9]" },
      { label: "(...)", code: "A capturing group" },
      { label: "|", code: "Alternation, matches either side" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Data: Things to keep in mind                                        */
/* ------------------------------------------------------------------ */

const KEY_TAKEAWAYS: string[] = [
  "Readable code beats clever code. You will read a line ten times more than you write it.",
  "Always understand the time and space complexity of your solution before calling it done.",
  "Write the test before you trust the fix, a passing test is proof, a feeling is not.",
  "Small, frequent commits with clear messages save you hours during debugging later.",
  "Never trust user input directly. Validate and sanitize on both client and server.",
  "Premature optimization wastes time. Profile first, then optimize the actual bottleneck.",
  "A good name for a variable or function is worth more than a comment explaining a bad one.",
  "Version control everything, including config and infrastructure, not just source code.",
  "Learn to read documentation and stack traces before reaching for a search engine.",
  "Design for failure. Networks drop, APIs time out, and users always find the edge case.",
  "Consistency across a codebase matters more than any single developer's personal preference.",
  "Security and accessibility are not features to add later, they are part of the design from day one.",
];

/* ------------------------------------------------------------------ */
/* Diagram components (theme-aware inline SVGs)                        */
/* ------------------------------------------------------------------ */

function BigODiagram() {
  return (
    <svg
      viewBox="0 0 320 200"
      className="h-48 w-full text-gray-400 dark:text-white/30"
    >
      <line x1="30" y1="170" x2="300" y2="170" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="10" x2="30" y2="170" stroke="currentColor" strokeWidth="1.5" />
      <text x="290" y="185" fontSize="9" fill="currentColor">n</text>
      <text x="8" y="18" fontSize="9" fill="currentColor">time</text>

      {/* O(1) */}
      <line x1="30" y1="150" x2="300" y2="150" stroke="#34d399" strokeWidth="2" />
      {/* O(log n) */}
      <path d="M30 150 Q 120 100 300 70" fill="none" stroke="#f59e0b" strokeWidth="2" />
      {/* O(n) */}
      <line x1="30" y1="170" x2="220" y2="20" stroke="#38bdf8" strokeWidth="2" />
      {/* O(n log n) */}
      <path d="M30 170 Q 150 90 190 20" fill="none" stroke="#a78bfa" strokeWidth="2" />
      {/* O(n^2) */}
      <path d="M30 170 C 90 170, 110 20, 150 20" fill="none" stroke="#fb7185" strokeWidth="2" />

      <g fontSize="8" fill="currentColor">
        <circle cx="240" cy="150" r="2.5" fill="#34d399" />
        <text x="246" y="153">O(1)</text>
        <circle cx="240" cy="128" r="2.5" fill="#f59e0b" />
        <text x="246" y="131">O(log n)</text>
        <circle cx="150" cy="35" r="2.5" fill="#fb7185" />
        <text x="156" y="38">O(n^2)</text>
        <circle cx="195" cy="55" r="2.5" fill="#a78bfa" />
        <text x="201" y="58">O(n log n)</text>
        <circle cx="222" cy="40" r="2.5" fill="#38bdf8" />
        <text x="228" y="43">O(n)</text>
      </g>
    </svg>
  );
}

function GitFlowDiagram() {
  return (
    <svg
      viewBox="0 0 320 180"
      className="h-48 w-full text-gray-400 dark:text-white/30"
    >
      <line x1="40" y1="150" x2="280" y2="150" stroke="currentColor" strokeWidth="2" />
      <line x1="90" y1="150" x2="90" y2="60" stroke="currentColor" strokeWidth="2" />
      <line x1="90" y1="60" x2="230" y2="60" stroke="currentColor" strokeWidth="2" />
      <line x1="230" y1="60" x2="230" y2="150" stroke="currentColor" strokeWidth="2" />

      {[40, 130, 180, 280].map((x, i) => (
        <circle key={"m" + i} cx={x} cy={150} r="5" fill="#34d399" />
      ))}
      {[90, 150, 210, 230].map((x, i) => (
        <circle key={"f" + i} cx={x} cy={60} r="5" fill="#f59e0b" />
      ))}

      <text x="35" y="170" fontSize="9" fill="currentColor">main</text>
      <text x="90" y="45" fontSize="9" fill="currentColor">feature/branch</text>
      <text x="290" y="153" fontSize="9" fill="currentColor">merge</text>
    </svg>
  );
}

function HttpCycleDiagram() {
  return (
    <svg
      viewBox="0 0 320 150"
      className="h-40 w-full text-gray-400 dark:text-white/30"
    >
      <rect x="15" y="45" width="80" height="45" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="30" y="72" fontSize="10" fill="currentColor">Client</text>

      <rect x="225" y="45" width="80" height="45" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="245" y="72" fontSize="10" fill="currentColor">Server</text>

      <line x1="95" y1="55" x2="225" y2="55" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow1)" />
      <text x="110" y="48" fontSize="8" fill="#38bdf8">GET /request</text>

      <line x1="225" y1="80" x2="95" y2="80" stroke="#34d399" strokeWidth="2" markerEnd="url(#arrow2)" />
      <text x="120" y="98" fontSize="8" fill="#34d399">200 OK + data</text>

      <defs>
        <marker id="arrow1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
        </marker>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" />
        </marker>
      </defs>
    </svg>
  );
}

function OsiLayersDiagram() {
  const layers = [
    "Application",
    "Presentation",
    "Session",
    "Transport",
    "Network",
    "Data Link",
    "Physical",
  ];
  return (
    <svg
      viewBox="0 0 320 210"
      className="h-52 w-full text-gray-400 dark:text-white/30"
    >
      {layers.map((l, i) => (
        <g key={l}>
          <rect
            x="60"
            y={10 + i * 27}
            width="200"
            height="22"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <text x="70" y={10 + i * 27 + 15} fontSize="9" fill="currentColor">
            {7 - i}. {l}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* UI subcomponents                                                    */
/* ------------------------------------------------------------------ */

function TerminalChromeBar({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-t-xl border border-b-0 border-gray-200 bg-[#f7f8fa] px-4 py-2.5 dark:border-white/10 dark:bg-[#0d1117]">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
      <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
      <span className="ml-2 font-mono text-[11px] text-gray-500 dark:text-white/40">
        {label}
      </span>
    </div>
  );
}

function CheatCard({ sheet, index }: { sheet: CheatSheet; index: number }) {
  const Icon = sheet.icon;
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0d1117]"
    >
      <TerminalChromeBar label={`${sheet.title.toLowerCase().replace(/\s+/g, "-")}.sh`} />
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Icon className="h-4 w-4 text-amber-600 dark:text-emerald-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{sheet.title}</h3>
        </div>
        <div className="space-y-2">
          {sheet.rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-0.5 rounded-lg bg-[#f7f8fa] p-2.5 font-mono text-xs dark:bg-[#0a0e14] sm:flex-row sm:items-baseline sm:gap-3"
            >
              <span className="shrink-0 font-semibold text-amber-600 dark:text-emerald-400">
                {row.label}
              </span>
              <span className="text-gray-600 dark:text-white/60">{row.code}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page                                                           */
/* ------------------------------------------------------------------ */

export default function FactsPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");

  const normalizedQuery = query.trim().toLowerCase();

  const visibleCategories = useMemo(() => {
    return CATEGORIES.filter((c) => activeCat === "all" || c.id === activeCat).map((c) => {
      const facts = normalizedQuery
        ? c.facts.filter((f) => f.toLowerCase().includes(normalizedQuery))
        : c.facts;
      return { ...c, facts };
    });
  }, [activeCat, normalizedQuery]);

  const visibleCount = visibleCategories.reduce((sum, c) => sum + c.facts.length, 0);

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-[#0a0e14] dark:text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            {TOTAL_FACTS}+ Facts 
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            Facts, Cheat Sheets &amp; Quick References
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-white/60 sm:text-base">
            Bite-sized knowledge across every corner of computer science - from
            JavaScript quirks to networking, security, AI, and career advice.
            Search, filter by category, and skim the cheat sheets when you need
            a fast refresher.
          </p>

          {/* Search + stats */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search facts... e.g. hash table, TCP, closures"
                className="w-full rounded-lg border border-gray-200 bg-[#f7f8fa] py-2.5 pl-9 pr-9 text-sm outline-none ring-amber-400 placeholder:text-gray-400 focus:ring-2 dark:border-white/10 dark:bg-[#0d1117] dark:text-white dark:ring-emerald-400 dark:placeholder:text-white/30"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="shrink-0 rounded-lg border border-gray-200 bg-[#f7f8fa] px-4 py-2.5 text-center font-mono text-xs text-gray-500 dark:border-white/10 dark:bg-[#0d1117] dark:text-white/50">
              Showing <span className="font-semibold text-amber-600 dark:text-emerald-400">{visibleCount}</span> / {TOTAL_FACTS}
            </div>
          </div>

          {/* Category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCat("all")}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCat === "all"
                  ? "border-amber-500 bg-amber-500 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-[#0a0e14]"
                  : "border-gray-200 bg-white text-gray-600 hover:border-amber-300 dark:border-white/10 dark:bg-[#0d1117] dark:text-white/60 dark:hover:border-emerald-400/40"
              }`}
            >
              All categories
            </button>
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const isActive = activeCat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(isActive ? "all" : c.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "border-amber-500 bg-amber-500 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-[#0a0e14]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-amber-300 dark:border-white/10 dark:bg-[#0d1117] dark:text-white/60 dark:hover:border-emerald-400/40"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {c.name}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Facts list */}
        <section className="mb-14 space-y-8">
          {visibleCategories.map((cat, ci) => {
            if (cat.facts.length === 0) return null;
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                variants={fadeUp}
                custom={ci}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0d1117]"
              >
                <TerminalChromeBar label={`${cat.id}.facts.ts`} />
                <div className="p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-emerald-400/10">
                      <Icon className="h-4 w-4 text-amber-600 dark:text-emerald-400" />
                    </span>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        {cat.name}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-white/40">
                        {cat.tagline} · {cat.facts.length} facts
                      </p>
                    </div>
                  </div>
                  <ol className="grid gap-2 sm:grid-cols-2">
                    {cat.facts.map((fact, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 rounded-lg bg-[#f7f8fa] p-3 text-sm leading-relaxed text-gray-700 dark:bg-[#0a0e14] dark:text-white/70"
                      >
                        <span className="mt-0.5 shrink-0 font-mono text-xs font-semibold text-amber-600 dark:text-emerald-400">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            );
          })}

          {visibleCount === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-[#f7f8fa] p-10 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-[#0d1117] dark:text-white/40">
              No facts match that search. Try a different keyword.
            </div>
          )}
        </section>

        {/* Cheat sheets */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mb-14"
        >
          <div className="mb-5 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600 dark:text-emerald-400" />
            <h2 className="font-mono text-xl font-bold">Cheat Sheets</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CHEATSHEETS.map((sheet, i) => (
              <CheatCard key={sheet.id} sheet={sheet} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Diagrams */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mb-14"
        >
          <div className="mb-5 flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-600 dark:text-emerald-400" />
            <h2 className="font-mono text-xl font-bold">Diagrams &amp; Sketches</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0d1117]">
              <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-white/80">
                Big-O Growth Curves
              </h3>
              <BigODiagram />
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0d1117]">
              <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-white/80">
                Git Feature Branch Flow
              </h3>
              <GitFlowDiagram />
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0d1117]">
              <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-white/80">
                HTTP Request / Response Cycle
              </h3>
              <HttpCycleDiagram />
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0d1117]">
              <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-white/80">
                OSI Model, 7 Layers
              </h3>
              <OsiLayersDiagram />
            </div>
          </div>
        </motion.section>

        {/* Keep in mind */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mb-6"
        >
          <div className="mb-5 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-600 dark:text-emerald-400" />
            <h2 className="font-mono text-xl font-bold">Important Things to Keep in Mind</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {KEY_TAKEAWAYS.map((tip, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-xl border border-gray-200 bg-[#f7f8fa] p-4 dark:border-white/10 dark:bg-[#0d1117]"
              >
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-emerald-400" />
                <p className="text-sm leading-relaxed text-gray-700 dark:text-white/70">{tip}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2 pt-4 text-xs text-gray-400 dark:text-white/30">
          <ChevronDown className="h-3.5 w-3.5" />
          <span>New facts and cheat sheets are added soon. Happy Leaarning ..❤️..</span>
        </div>
      </div>
    </main>
  );
}