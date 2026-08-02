"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Brain,
  Bot,
  Code2,
  Layers,
  Server,
  Cloud,
  PenTool,
  ArrowRight,
  Send,
  User,
  ChevronDown,
  ChevronRight,
  Hash,
} from "lucide-react";

/**
 * WanttolearnfromAi
 * -----------------
 * A landing/feature section that invites users to learn with an AI tutor.
 * Built with a terminal/IDE-inspired aesthetic to match CodeNFacts branding.
 *
 * Now backed by a full roadmap browser: 6 roadmaps, 36 topics, 20+
 * prompt-ready questions per topic. Clicking any question (or typing a
 * free-form one) runs a three-stage message lifecycle: thinking (bouncing
 * dots) -> typing (typewriter reveal) -> done.
 *
 * TODO(backend): `answerMap` below is a local lookup used to fake real
 * answers. Replace `getAnswerFor()` with a call to the Gemini API route
 * (e.g. POST /api/ai-tutor with { question, topicId, roadmapId }) and
 * stream the response instead of revealing a canned string.
 *
 * Drop into any page:
 *   import WanttolearnfromAi from "@/components/WanttolearnfromAi";
 *   <WanttolearnfromAi />
 */

// ---------------------------------------------------------------------------
// Roadmap data
// ---------------------------------------------------------------------------

interface Topic {
  id: string;
  title: string;
  description: string;
  questions: string[];
  answer: string;
}

interface Roadmap {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  topics: Topic[];
}

const roadmaps: Roadmap[] = [
  {
    id: "dsa",
    title: "DSA & Algorithms",
    icon: Code2,
    topics: [
      {
        id: "arrays-strings",
        title: "Arrays & Strings",
        description: "The building blocks of almost every interview question.",
        answer:
          "Arrays store elements in contiguous memory, which is why index access is O(1) — the address is just base + (index * size). Strings are usually arrays of characters under the hood, and most string bugs come from forgetting they're immutable in many languages, so every 'edit' actually builds a new string. Patterns like two-pointers and sliding window exist specifically to avoid re-scanning the same data twice.",
        questions: [
          "How do arrays store data in memory?",
          "What's the time complexity of array access?",
          "How does dynamic array resizing work?",
          "What's the difference between arrays and linked lists?",
          "How do you reverse a string in place?",
          "What is the two-pointer technique?",
          "How does the sliding window pattern work?",
          "How does a hash map speed up array problems?",
          "How do you detect duplicates efficiently?",
          "What's the difference between mutable and immutable strings?",
          "How do you rotate an array in place?",
          "What's the best way to merge two sorted arrays?",
          "Why is string concatenation slow in a loop?",
          "What is Kadane's algorithm for subarrays?",
          "How do multi-dimensional arrays work?",
          "What's the difference between slice and splice?",
          "How do you find the missing number in an array?",
          "What makes an algorithm 'in-place'?",
          "How do you check if a string is a palindrome?",
          "What's the difference between a Set and an array?",
        ],
      },
      {
        id: "recursion",
        title: "Recursion",
        description: "Functions that call themselves to shrink a problem.",
        answer:
          "Recursion solves a problem by breaking it into a smaller version of itself, plus a base case that stops the calls. Every recursive call gets pushed onto the call stack, which is why deep recursion without a base case blows the stack. Once you can spot the base case and the recursive case, most 'recursive' problems — trees, backtracking, divide and conquer — become the same pattern in different clothes.",
        questions: [
          "What's the difference between recursion and iteration?",
          "What is a base case and why is it required?",
          "How does the call stack work during recursion?",
          "What is tail recursion?",
          "Why do some languages optimize tail calls and others don't?",
          "What is stack overflow and how do you avoid it?",
          "How do you convert a recursive function to iterative?",
          "What is memoization and how does it help recursion?",
          "How does recursion solve tree traversal?",
          "What is backtracking and how does it use recursion?",
          "How does recursion solve the Tower of Hanoi?",
          "What's the difference between direct and indirect recursion?",
          "How do you trace a recursion tree?",
          "What is the time complexity of a recursive Fibonacci?",
          "How does divide and conquer use recursion?",
          "What is mutual recursion?",
          "How do you debug an infinite recursive loop?",
          "How does recursion relate to mathematical induction?",
          "When should you avoid recursion for performance reasons?",
          "How do generators relate to recursive traversal?",
        ],
      },
      {
        id: "sorting",
        title: "Sorting Algorithms",
        description: "How order gets imposed on chaos, and at what cost.",
        answer:
          "Sorting algorithms trade off time, space, and stability differently: quicksort is fast in practice but O(n^2) worst case, merge sort guarantees O(n log n) but uses extra memory, and insertion sort is great for nearly-sorted or small data. 'Stable' means equal elements keep their original order, which matters when you sort by one field after already sorting by another.",
        questions: [
          "How does bubble sort work and why is it slow?",
          "How does merge sort achieve O(n log n)?",
          "How does quicksort choose a pivot?",
          "What's the worst case time complexity of quicksort?",
          "What does 'stable sort' mean?",
          "How does insertion sort work?",
          "When is insertion sort faster than quicksort?",
          "How does heap sort use a binary heap?",
          "What is counting sort and when is it useful?",
          "What is radix sort?",
          "How does merge sort's merge step work?",
          "What's the difference between in-place and out-of-place sorting?",
          "How do you sort an array of objects by multiple keys?",
          "What is the time complexity of Python's built-in sort?",
          "How does Timsort combine merge sort and insertion sort?",
          "How would you sort a nearly-sorted array efficiently?",
          "What is bucket sort?",
          "How do you sort a linked list?",
          "How does external sorting work for huge datasets?",
          "What's the lower bound for comparison-based sorting?",
        ],
      },
      {
        id: "linked-lists",
        title: "Linked Lists",
        description: "Nodes connected by pointers instead of index math.",
        answer:
          "A linked list trades array's O(1) access for O(1) insertion and deletion anywhere, because each node just points to the next. Most linked list problems boil down to carefully managing pointers without losing a reference to the rest of the list, which is why 'fast and slow pointer' tricks (Floyd's cycle detection, finding the middle) show up so often.",
        questions: [
          "What's the difference between singly and doubly linked lists?",
          "How do you reverse a linked list?",
          "How does Floyd's cycle detection algorithm work?",
          "How do you find the middle of a linked list in one pass?",
          "How do you detect a cycle in a linked list?",
          "What's the time complexity of inserting into a linked list?",
          "How do you merge two sorted linked lists?",
          "What is a circular linked list?",
          "How do you remove the nth node from the end?",
          "What's the difference between a linked list and an array list?",
          "How do you delete a node given only that node?",
          "How does a skip list improve on a linked list?",
          "How do you check if two linked lists intersect?",
          "What is a sentinel/dummy node and why use one?",
          "How do you flatten a multi-level linked list?",
          "How do you implement a stack using a linked list?",
          "How do you implement a queue using a linked list?",
          "How do you clone a linked list with random pointers?",
          "What are the memory trade-offs of linked lists vs arrays?",
          "How would you sort a linked list in O(n log n)?",
        ],
      },
      {
        id: "trees-graphs",
        title: "Trees & Graphs",
        description: "Data that branches — from file systems to social networks.",
        answer:
          "Trees are graphs with no cycles and one path between any two nodes, which is why traversals (BFS, DFS, in/pre/post-order) are the core skill for both. BFS explores level by level using a queue and is ideal for shortest paths in unweighted graphs; DFS goes deep first using a stack or recursion and is ideal for exploring all paths or detecting cycles.",
        questions: [
          "What's the difference between a tree and a graph?",
          "How does breadth-first search (BFS) work?",
          "How does depth-first search (DFS) work?",
          "What's the difference between in-order, pre-order, and post-order traversal?",
          "How does a binary search tree keep itself ordered?",
          "What makes a tree 'balanced'?",
          "How does an AVL tree stay balanced?",
          "How does a red-black tree work?",
          "How do you find the lowest common ancestor?",
          "How does Dijkstra's algorithm find shortest paths?",
          "What's the difference between Dijkstra's and A*?",
          "How do you detect a cycle in a directed graph?",
          "What is topological sort used for?",
          "How does a trie speed up prefix search?",
          "How do you serialize and deserialize a binary tree?",
          "What's the difference between a heap and a binary search tree?",
          "How does Union-Find (disjoint set) work?",
          "How do you check if a binary tree is balanced?",
          "What's the difference between a directed and undirected graph?",
          "How do you represent a graph: adjacency list vs matrix?",
        ],
      },
      {
        id: "dynamic-programming",
        title: "Dynamic Programming",
        description: "Solving overlapping subproblems once instead of over and over.",
        answer:
          "Dynamic programming applies when a problem has overlapping subproblems and optimal substructure — meaning the best answer to the whole problem is built from best answers to smaller pieces. Memoization caches results top-down using recursion, while tabulation builds a table bottom-up with loops. The hardest part is usually spotting the recurrence relation, not writing the loop.",
        questions: [
          "What's the difference between memoization and tabulation?",
          "What is 'optimal substructure'?",
          "What are 'overlapping subproblems'?",
          "How do you solve the 0/1 knapsack problem?",
          "How do you find the longest common subsequence?",
          "How do you solve the coin change problem?",
          "What is the time complexity of dynamic programming Fibonacci?",
          "How do you solve the longest increasing subsequence?",
          "How does edit distance (Levenshtein) use DP?",
          "How do you solve matrix chain multiplication with DP?",
          "What's the difference between DP and greedy algorithms?",
          "How do you approach a new DP problem from scratch?",
          "How do you solve the house robber problem?",
          "What is state compression in DP?",
          "How do you solve DP problems on a grid?",
          "How does DP handle problems with multiple constraints?",
          "What is the subset sum problem?",
          "How do you reconstruct the actual solution, not just the value?",
          "When is a greedy solution actually optimal instead of DP?",
          "How do you reduce a DP solution's space complexity?",
        ],
      },
    ],
  },
  {
    id: "frontend",
    title: "Frontend Engineering",
    icon: Layers,
    topics: [
      {
        id: "react-fundamentals",
        title: "React Fundamentals",
        description: "Components, props, state, and the render cycle.",
        answer:
          "React renders your UI as a function of state: when state changes, React re-renders the component and diffs the result against the previous render using the virtual DOM, updating only what actually changed. Props flow down from parent to child and are read-only; state lives inside a component and triggers a re-render whenever it's updated through its setter.",
        questions: [
          "What's the difference between props and state?",
          "How does the virtual DOM work?",
          "What triggers a React component to re-render?",
          "What's the difference between a controlled and uncontrolled input?",
          "How does the useEffect dependency array work?",
          "What's the difference between useState and useReducer?",
          "What is prop drilling and how do you avoid it?",
          "How does React's reconciliation algorithm work?",
          "What are keys in a list and why do they matter?",
          "What's the difference between a class component and a function component?",
          "How do custom hooks work?",
          "What is the Context API and when should you use it?",
          "How does useRef differ from useState?",
          "What is a higher-order component?",
          "How do you lift state up between sibling components?",
          "What's the difference between useMemo and useCallback?",
          "How does React batch state updates?",
          "What is a portal in React?",
          "How do error boundaries work?",
          "What's the difference between React.memo and useMemo?",
        ],
      },
      {
        id: "nextjs-app-router",
        title: "Next.js App Router",
        description: "File-based routing, server components, and layouts.",
        answer:
          "The App Router uses folders to define routes and a `page.tsx` inside each to define what renders there, with `layout.tsx` wrapping shared UI like headers or sidebars across nested routes. By default every component is a Server Component, rendered on the server with zero client JS shipped, unless you opt in with `\"use client\"` for interactivity like state or event handlers.",
        questions: [
          "What's the difference between the App Router and Pages Router?",
          "What is a Server Component vs a Client Component?",
          "How does file-based routing work in app/?",
          "What does the 'use client' directive actually do?",
          "How do dynamic routes work with [id] folders?",
          "How does layout.tsx differ from page.tsx?",
          "How does data fetching work in Server Components?",
          "What is streaming with Suspense in the App Router?",
          "How do you create API routes in the App Router?",
          "What's the purpose of loading.tsx and error.tsx?",
          "How does route grouping with (folderName) work?",
          "How do you handle metadata and SEO in the App Router?",
          "What is middleware.ts used for?",
          "How does caching work by default for fetch requests?",
          "How do parallel routes work?",
          "How do intercepting routes work?",
          "How do you pass data from a Server to a Client Component?",
          "What's the difference between generateStaticParams and dynamic rendering?",
          "How do you handle redirects and not-found pages?",
          "How does revalidation (ISR) work in the App Router?",
        ],
      },
      {
        id: "state-management",
        title: "State Management",
        description: "Keeping data in sync across a growing app.",
        answer:
          "State management is really a question of scope: local component state is fine until multiple distant components need the same data, at which point you lift it up, put it in Context, or reach for a store like Zustand or Redux. The right choice depends on how often the data changes and how many places read it — global stores shine when both are high.",
        questions: [
          "When should you use local state vs global state?",
          "How does the Context API cause unnecessary re-renders?",
          "What problem does Redux solve that Context doesn't?",
          "How does Zustand differ from Redux?",
          "What's the difference between client state and server state?",
          "How does React Query manage server state caching?",
          "What is optimistic UI updating?",
          "How do you avoid prop drilling without Context?",
          "What's the difference between derived state and stored state?",
          "How do you sync state with the URL (query params)?",
          "What is state normalization and why does it matter?",
          "How does Redux Toolkit simplify traditional Redux?",
          "What's the difference between a reducer and an action?",
          "How do you handle form state at scale?",
          "How does SWR differ from React Query?",
          "What is a 'single source of truth' in state design?",
          "How do you debounce state updates from user input?",
          "How does undo/redo functionality typically get implemented?",
          "What's the danger of storing derived data directly in state?",
          "How do you test components that rely on global state?",
        ],
      },
      {
        id: "tailwind-styling",
        title: "Tailwind & Styling",
        description: "Utility-first CSS and building a consistent design system.",
        answer:
          "Tailwind trades hand-written CSS files for small, composable utility classes directly in markup, which keeps styles co-located with the component and avoids naming things twice. The tradeoff is longer class strings, which `dark:`, responsive prefixes, and component extraction (or `@apply`) help tame once patterns repeat across a codebase.",
        questions: [
          "What's the difference between utility-first CSS and traditional CSS?",
          "How does the dark: variant work in Tailwind?",
          "How do responsive prefixes like sm: and lg: work?",
          "What's the difference between @apply and inline utility classes?",
          "How do you extend Tailwind's default theme?",
          "How does Tailwind's JIT compiler decide what CSS to generate?",
          "How do you handle hover, focus, and active states in Tailwind?",
          "What's the best way to avoid class name duplication?",
          "How do you use arbitrary values in Tailwind?",
          "How does Tailwind handle CSS specificity conflicts?",
          "What's the difference between Tailwind and CSS Modules?",
          "How do you build a design token system on top of Tailwind?",
          "How do you animate elements using Tailwind + Framer Motion together?",
          "How do you handle print styles in Tailwind?",
          "What's the purpose of the tailwind.config.js content array?",
          "How do you conditionally apply classes cleanly in React?",
          "How does container queries support work in Tailwind?",
          "How do you keep a consistent spacing scale across a project?",
          "How do you theme a component library with Tailwind?",
          "What's a common performance pitfall with Tailwind at scale?",
        ],
      },
      {
        id: "performance-rendering",
        title: "Performance & Rendering",
        description: "Making pages fast and keeping them that way.",
        answer:
          "Frontend performance comes down to shipping less JavaScript, deferring what isn't needed immediately, and avoiding unnecessary re-renders. Tools like code splitting, lazy loading, memoization, and image optimization each attack a different bottleneck — the trick is measuring first (Lighthouse, React Profiler) instead of optimizing blind.",
        questions: [
          "What's the difference between CSR, SSR, SSG, and ISR?",
          "How does code splitting reduce bundle size?",
          "What is lazy loading and how do you implement it in React?",
          "How does the React Profiler help find slow components?",
          "What causes unnecessary re-renders in React?",
          "How does image optimization work in Next.js?",
          "What is the Core Web Vitals metric set?",
          "How does memoization prevent expensive recalculations?",
          "What's the difference between hydration and rendering?",
          "How do you measure and reduce Time to Interactive?",
          "What is tree shaking and how does it reduce bundle size?",
          "How does virtualization help render large lists?",
          "What's the impact of large images on Largest Contentful Paint?",
          "How do you debounce or throttle expensive event handlers?",
          "How does prefetching links improve perceived performance?",
          "What's the difference between First Contentful Paint and LCP?",
          "How do you diagnose a memory leak in a React app?",
          "How does font loading affect Cumulative Layout Shift?",
          "What's the performance cost of inline anonymous functions in JSX?",
          "How do you decide what should be a Server vs Client Component for performance?",
        ],
      },
      {
        id: "typescript-react",
        title: "TypeScript for React",
        description: "Catching bugs at compile time, not in production.",
        answer:
          "TypeScript adds a type layer on top of JavaScript so mismatched props, missing fields, or wrong function signatures get caught while you're writing code instead of when a user hits an edge case. In React specifically, typing props with interfaces, using generics for reusable hooks, and narrowing union types are the patterns that pay off the most.",
        questions: [
          "How do you type props for a React component?",
          "What's the difference between an interface and a type in TypeScript?",
          "How do you type a component's children prop?",
          "How do generics work in a custom React hook?",
          "How do you type useState when the initial value is null?",
          "What's the difference between 'unknown' and 'any'?",
          "How do you type event handlers like onClick or onChange?",
          "How do discriminated unions help model component state?",
          "How do you type a React context correctly?",
          "What's the purpose of the 'as const' assertion?",
          "How do you type an array of objects with optional fields?",
          "How does type narrowing work with typeof and instanceof?",
          "How do you type a component that forwards a ref?",
          "What's the difference between type inference and explicit typing?",
          "How do you type API response data safely?",
          "How do utility types like Partial and Pick work?",
          "How do you avoid 'any' creeping into a shared component?",
          "How does strict mode change TypeScript's behavior?",
          "How do you type a reusable Button with multiple variants?",
          "How do you handle typing third-party libraries with no types?",
        ],
      },
    ],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    icon: Server,
    topics: [
      {
        id: "rest-api-design",
        title: "REST API Design",
        description: "Resources, verbs, and predictable responses.",
        answer:
          "A clean REST API models resources as nouns in the URL (/users, /users/42) and lets HTTP verbs describe the action: GET reads, POST creates, PUT/PATCH updates, DELETE removes. Consistency matters more than cleverness — predictable status codes, stable response shapes, and clear error messages let anything calling your API build reliable assumptions.",
        questions: [
          "What makes an API 'RESTful'?",
          "What's the difference between PUT and PATCH?",
          "How should you version a REST API?",
          "What status code should a failed validation return?",
          "How do you design pagination for a large list endpoint?",
          "What's the difference between a resource and an endpoint?",
          "How should nested resources be structured in URLs?",
          "What's the difference between idempotent and non-idempotent requests?",
          "How do you handle filtering and sorting via query params?",
          "What's the difference between REST and GraphQL?",
          "How should you structure a consistent error response shape?",
          "What is HATEOAS and is it actually used in practice?",
          "How do you design rate limiting for a public API?",
          "What's the difference between 401 and 403 status codes?",
          "How do you handle partial updates safely?",
          "How should an API handle soft deletes vs hard deletes?",
          "What's the best way to document a REST API?",
          "How do you design an API for bulk operations?",
          "How do you handle backward compatibility when changing an API?",
          "What's the difference between a webhook and a polling API?",
        ],
      },
      {
        id: "nodejs-express",
        title: "Node.js & Express",
        description: "JavaScript on the server, request by request.",
        answer:
          "Node.js runs JavaScript outside the browser using a single-threaded event loop, handling many requests concurrently by never blocking on I/O — while a database query runs, Node moves on to the next request instead of waiting. Express sits on top as a minimal framework for defining routes and middleware, the functions that run before your route handler for things like auth or logging.",
        questions: [
          "How does Node's event loop handle concurrency?",
          "What's the difference between blocking and non-blocking I/O?",
          "How does middleware work in Express?",
          "What's the difference between process.nextTick and setImmediate?",
          "How do you handle errors globally in an Express app?",
          "What's the difference between require and import in Node?",
          "How do environment variables work with dotenv?",
          "How do you structure routes in a growing Express app?",
          "What is a Node.js worker thread and when do you need one?",
          "How does Express handle asynchronous route handlers?",
          "What's the difference between Express and Fastify?",
          "How do you handle file uploads in Express?",
          "How does CORS middleware actually work?",
          "What's the purpose of the Node.js cluster module?",
          "How do you gracefully shut down an Express server?",
          "How do you validate request bodies in Express?",
          "What's the difference between synchronous and asynchronous fs methods?",
          "How do you structure a scalable Node.js project?",
          "How does streaming a large response work in Node?",
          "How do you rate-limit an Express API?",
        ],
      },
      {
        id: "auth-security",
        title: "Authentication & Security",
        description: "Proving who someone is, and keeping data safe.",
        answer:
          "Authentication proves who a user is (login), while authorization decides what they're allowed to do once identified. Sessions store login state on the server, while JWTs pack it into a signed token the client holds — each has different tradeoffs around scalability and revocation. Around all of it: never store plain-text passwords, always hash with something like bcrypt.",
        questions: [
          "What's the difference between authentication and authorization?",
          "How do JSON Web Tokens (JWT) work?",
          "What's the difference between session-based and token-based auth?",
          "How does bcrypt hash passwords securely?",
          "How does OAuth 2.0 work at a high level?",
          "What's the difference between access tokens and refresh tokens?",
          "How do you prevent SQL injection?",
          "What is Cross-Site Scripting (XSS) and how do you prevent it?",
          "What is Cross-Site Request Forgery (CSRF)?",
          "How does HTTPS actually secure data in transit?",
          "What's the difference between hashing and encryption?",
          "How do you store secrets safely in an application?",
          "What is two-factor authentication (2FA) and how does it work?",
          "How does single sign-on (SSO) work?",
          "What is a salt and why does it matter for password hashing?",
          "How do you securely handle password reset flows?",
          "What's the principle of least privilege?",
          "How do HTTP-only cookies help prevent XSS token theft?",
          "How do you implement role-based access control (RBAC)?",
          "What are common security headers every app should set?",
        ],
      },
      {
        id: "databases-orms",
        title: "Databases & ORMs",
        description: "Storing and querying data reliably at scale.",
        answer:
          "Relational databases (Postgres, MySQL) enforce structure and relationships through schemas and foreign keys, which is great for consistency but requires migrations when things change. NoSQL databases like Firestore or MongoDB trade some of that rigidity for flexible, document-shaped data that scales horizontally more easily. An ORM sits in between, letting you write queries in your app's language instead of raw SQL.",
        questions: [
          "What's the difference between SQL and NoSQL databases?",
          "How does database indexing speed up queries?",
          "What is a foreign key and why does it matter?",
          "How do database transactions guarantee consistency?",
          "What is normalization and when should you denormalize?",
          "How does an ORM translate objects into SQL queries?",
          "What's the N+1 query problem and how do you fix it?",
          "How do database migrations work?",
          "What's the difference between a primary key and a unique key?",
          "How does database sharding work?",
          "What are ACID properties in a database?",
          "How does connection pooling improve performance?",
          "What's the difference between a JOIN and a subquery?",
          "How do you design a schema for a many-to-many relationship?",
          "What is eventual consistency in distributed databases?",
          "How does replication improve database availability?",
          "How do you decide between SQL and a document store for a project?",
          "How does caching (Redis) sit alongside a primary database?",
          "What's the difference between OLTP and OLAP databases?",
          "How do you handle database backups and point-in-time recovery?",
        ],
      },
      {
        id: "firebase-backend",
        title: "Firebase Backend",
        description: "Auth, Firestore, and Storage without managing servers.",
        answer:
          "Firebase gives you a managed backend: Firebase Auth handles sign-up/login flows including OAuth providers, Firestore is a NoSQL document database that syncs in real time, and Storage handles file uploads like images and PDFs. The tradeoff for the speed is designing around Firestore's document/collection model and its security rules instead of SQL and server-side authorization checks.",
        questions: [
          "How does Firestore's document and collection model work?",
          "How does Firebase Auth handle sign-up and login?",
          "How do Firestore security rules control access to data?",
          "What's the difference between Firestore and Realtime Database?",
          "How do you structure Firestore data for a social feed?",
          "How does onAuthStateChanged track a logged-in user?",
          "How do you query Firestore with compound conditions?",
          "What are Firestore composite indexes and when do you need them?",
          "How does Firebase Storage handle file uploads securely?",
          "How do you paginate a Firestore query?",
          "What's the cost model for Firestore reads and writes?",
          "How do Cloud Functions trigger on Firestore changes?",
          "How do you keep denormalized data in sync in Firestore?",
          "How does offline persistence work in Firestore?",
          "How do you implement real-time listeners efficiently?",
          "What's the difference between a subcollection and a top-level collection?",
          "How do you secure Firebase Storage file access with rules?",
          "How do you migrate data between Firestore collections safely?",
          "How does Firebase Auth integrate with custom backend sessions?",
          "What are common pitfalls when scaling a Firestore-based app?",
        ],
      },
      {
        id: "testing-apis",
        title: "Testing APIs",
        description: "Catching bugs before your users do.",
        answer:
          "Testing an API happens at layers: unit tests check individual functions in isolation, integration tests check that routes, middleware, and the database work together correctly, and end-to-end tests simulate a real client hitting real endpoints. Good API tests assert on status codes, response shape, and edge cases like missing fields or unauthorized requests, not just the happy path.",
        questions: [
          "What's the difference between unit, integration, and e2e tests?",
          "How do you mock a database in API tests?",
          "How does Postman help test and document an API?",
          "What's the difference between Jest and Supertest?",
          "How do you test authentication-protected routes?",
          "How do you write a good test for an error response?",
          "What is test-driven development (TDD)?",
          "How do you test rate-limited endpoints?",
          "How do you set up a test database separate from production?",
          "What's the difference between mocking and stubbing?",
          "How do you test file upload endpoints?",
          "How do you assert on JSON response shape reliably?",
          "How does contract testing work between frontend and backend?",
          "How do you test pagination logic thoroughly?",
          "What's a good strategy for testing third-party API integrations?",
          "How do you measure test coverage meaningfully?",
          "How do you test webhook endpoints?",
          "How do you handle flaky tests in a CI pipeline?",
          "How do you load-test an API before a big launch?",
          "How do you test for race conditions in concurrent requests?",
        ],
      },
    ],
  },
  {
    id: "ai-ml",
    title: "AI/ML Engineering",
    icon: Brain,
    topics: [
      {
        id: "neural-networks",
        title: "Neural Networks",
        description: "Layers of weighted math that learn from examples.",
        answer:
          "A neural network is layers of neurons, each holding weights learned during training, that transform an input into a prediction. Training compares the prediction to the correct answer, measures the error with a loss function, and uses backpropagation to nudge every weight slightly toward less error — repeated thousands of times until the network generalizes.",
        questions: [
          "What is a neuron in a neural network, really?",
          "How does backpropagation update weights?",
          "What is a loss function and why does it matter?",
          "What's the difference between a weight and a bias?",
          "How does gradient descent find the minimum loss?",
          "What is an activation function and why is it needed?",
          "What's the difference between ReLU and sigmoid activations?",
          "How does a convolutional neural network (CNN) process images?",
          "What is a recurrent neural network (RNN) used for?",
          "What's the vanishing gradient problem?",
          "How does dropout prevent overfitting?",
          "What's the difference between a shallow and deep network?",
          "How do you choose the number of layers and neurons?",
          "What is batch normalization?",
          "How does learning rate affect training?",
          "What's the difference between epochs, batches, and iterations?",
          "How do you know if a model is overfitting?",
          "What is a softmax function used for?",
          "How does a neural network differ from a decision tree?",
          "What is transfer learning?",
        ],
      },
      {
        id: "prompt-engineering",
        title: "Prompt Engineering",
        description: "Getting reliable output from a language model.",
        answer:
          "Prompt engineering is about giving a model enough structure and context to reliably do what you want, not just asking nicely. Concrete instructions, examples of desired output (few-shot), and asking the model to reason step by step all reduce ambiguity. Iterating on a prompt is closer to debugging than writing — small wording changes can shift output a lot.",
        questions: [
          "What's the difference between zero-shot and few-shot prompting?",
          "How does chain-of-thought prompting improve reasoning?",
          "Why do examples in a prompt improve output quality?",
          "What's the difference between a system prompt and a user prompt?",
          "How does temperature affect a model's output?",
          "How do you reduce hallucination in model responses?",
          "How does prompt structure affect JSON output reliability?",
          "What is prompt injection and how do you defend against it?",
          "How do you get a model to follow a strict output format?",
          "What's the difference between instructing and constraining a model?",
          "How does context window size limit what you can prompt with?",
          "How do you debug a prompt that keeps failing?",
          "What's the role of negative examples in a prompt?",
          "How do you prompt a model to cite sources accurately?",
          "How does role-play framing change a model's tone?",
          "What's the difference between top-p and temperature sampling?",
          "How do you keep a long conversation coherent across many turns?",
          "How do you test prompts systematically instead of by feel?",
          "What's prompt chaining and when is it useful?",
          "How do you handle a model refusing a legitimate request?",
        ],
      },
      {
        id: "llm-fundamentals",
        title: "LLM Fundamentals",
        description: "How large language models actually work under the hood.",
        answer:
          "An LLM predicts the next token in a sequence, over and over, based on patterns learned from huge amounts of text. The transformer architecture underneath uses 'attention' to let every token weigh how relevant every other token is, which is what lets the model track context across a long passage instead of just the last few words.",
        questions: [
          "What is a token and how does tokenization work?",
          "How does the transformer architecture work at a high level?",
          "What is self-attention and why is it powerful?",
          "How does an LLM 'predict' the next word?",
          "What's the difference between a base model and an instruct-tuned model?",
          "What is RLHF (reinforcement learning from human feedback)?",
          "How does a context window limit what a model can 'remember'?",
          "What's the difference between parameters and training data?",
          "How does a model generate different answers with the same prompt?",
          "What is model quantization and why does it matter?",
          "What's the difference between GPT-style and encoder-only models?",
          "How does an LLM handle a question it wasn't trained on?",
          "What is emergent behavior in large models?",
          "How does fine-tuning differ from prompting?",
          "What's the difference between inference and training?",
          "How do positional encodings help a transformer understand order?",
          "What is a mixture-of-experts model?",
          "How does an LLM's knowledge cutoff work?",
          "What's the difference between open-weight and closed models?",
          "How do multimodal models process both text and images?",
        ],
      },
      {
        id: "embeddings-vector-search",
        title: "Embeddings & Vector Search",
        description: "Turning meaning into numbers you can search.",
        answer:
          "An embedding is a list of numbers representing the meaning of a piece of text, positioned so similar meanings sit close together in that space. Vector search finds the nearest embeddings to a query embedding, which is what powers semantic search and retrieval-augmented generation — finding relevant chunks of text even when the wording doesn't match exactly.",
        questions: [
          "What is a vector embedding, conceptually?",
          "How does cosine similarity measure closeness between vectors?",
          "What's the difference between keyword search and semantic search?",
          "How does retrieval-augmented generation (RAG) work?",
          "What is a vector database and why do you need one?",
          "How do you chunk documents before embedding them?",
          "What's the difference between sparse and dense embeddings?",
          "How does approximate nearest neighbor search scale to millions of vectors?",
          "What's the difference between embedding a query and embedding a document?",
          "How do you evaluate the quality of a RAG pipeline?",
          "What is re-ranking in a search pipeline?",
          "How do embeddings capture relationships like 'king - man + woman'?",
          "What's the difference between HNSW and flat vector indexes?",
          "How do you keep a vector index updated as data changes?",
          "How do you combine keyword and vector search (hybrid search)?",
          "What's the tradeoff between embedding dimension size and accuracy?",
          "How do you handle multi-language embeddings?",
          "How do you deal with stale or duplicate vectors in an index?",
          "How does clustering use embeddings to group similar items?",
          "What's a common failure mode of naive RAG systems?",
        ],
      },
      {
        id: "model-training",
        title: "Model Training & Fine-tuning",
        description: "Adapting a model to your data and task.",
        answer:
          "Fine-tuning takes a pretrained model and continues training it on a smaller, task-specific dataset, adjusting its weights so it performs better on that narrower job. Techniques like LoRA fine-tune a small set of additional parameters instead of the whole model, dramatically cutting compute cost while still meaningfully shifting behavior.",
        questions: [
          "What's the difference between pretraining and fine-tuning?",
          "How does transfer learning reduce the data you need?",
          "What is LoRA and why is it more efficient than full fine-tuning?",
          "How do you prepare a dataset for fine-tuning?",
          "What's the difference between supervised fine-tuning and RLHF?",
          "How do you know if a model is overfitting during fine-tuning?",
          "What's the role of a validation set during training?",
          "How does learning rate scheduling affect training stability?",
          "What is catastrophic forgetting in fine-tuning?",
          "How do you evaluate a fine-tuned model's quality?",
          "What's the difference between full fine-tuning and adapter-based methods?",
          "How much data do you actually need to fine-tune effectively?",
          "How does data quality affect fine-tuning more than data quantity?",
          "What's the risk of fine-tuning on biased data?",
          "How do you fine-tune a model for a narrow domain like legal or medical text?",
          "What is early stopping and why use it?",
          "How do you version and track fine-tuned model experiments?",
          "What hardware considerations matter for fine-tuning at home vs cloud?",
          "How do you avoid a fine-tuned model losing its general abilities?",
          "How does instruction tuning differ from task-specific fine-tuning?",
        ],
      },
      {
        id: "ml-in-production",
        title: "ML in Production",
        description: "Getting a model from notebook to real users.",
        answer:
          "Shipping a model is a different job than training one: you need to serve predictions fast and reliably, monitor for data drift as real-world inputs change over time, and have a rollback plan when a new model underperforms. Most production ML failures come from the surrounding pipeline, not the model itself — stale features, silent data changes, or missing monitoring.",
        questions: [
          "What's the difference between a model in a notebook and one in production?",
          "What is model drift and how do you detect it?",
          "How do you version and roll back a deployed model?",
          "What's the difference between batch and real-time inference?",
          "How do you monitor a production model's performance over time?",
          "What is A/B testing a model in production?",
          "How do you handle feature parity between training and serving?",
          "What is a feature store and why do teams use one?",
          "How do you scale model inference under heavy traffic?",
          "What's the difference between model latency and throughput?",
          "How do you handle a model that starts underperforming in production?",
          "What is shadow deployment for testing a new model safely?",
          "How do you log predictions for later debugging without violating privacy?",
          "What's the cost tradeoff between a bigger model and a smaller, faster one?",
          "How do you handle model retraining schedules?",
          "What's the difference between online and offline evaluation?",
          "How do you containerize a model for consistent deployment?",
          "How do you detect and handle adversarial or out-of-distribution inputs?",
          "What's the role of a champion/challenger setup in ML ops?",
          "How do you build a feedback loop from users back into training data?",
        ],
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    icon: Cloud,
    topics: [
      {
        id: "git-version-control",
        title: "Git & Version Control",
        description: "Tracking every change, and undoing the bad ones.",
        answer:
          "Git tracks snapshots of your project over time as commits, letting you branch off to try something without touching the main line of work, then merge it back once it's ready. Most Git confusion comes from not having a clear mental model of the three areas — working directory, staging area, and repository — and what moves data between them.",
        questions: [
          "What's the difference between git merge and git rebase?",
          "What happens during a merge conflict and how do you resolve one?",
          "What's the difference between the staging area and the working directory?",
          "How does git reset differ from git revert?",
          "What is a detached HEAD state?",
          "How do you undo a commit that's already been pushed?",
          "What's the difference between git fetch and git pull?",
          "How does branching strategy (like GitFlow) organize a team's work?",
          "What is a git cherry-pick used for?",
          "How do you squash multiple commits into one?",
          "What's the difference between origin and upstream?",
          "How do you write a good commit message?",
          "How does .gitignore decide what not to track?",
          "What's the difference between a fork and a branch?",
          "How do you recover a deleted branch?",
          "How does git blame help track down when a bug was introduced?",
          "What is a git tag used for?",
          "How do you handle a large binary file in git properly?",
          "What's the difference between a pull request and a merge request?",
          "How do you set up a clean commit history before opening a PR?",
        ],
      },
      {
        id: "ci-cd",
        title: "CI/CD Pipelines",
        description: "Automating tests, builds, and deploys.",
        answer:
          "Continuous Integration runs your tests and checks automatically every time code is pushed, catching problems before they reach main. Continuous Deployment takes it further, automatically shipping code that passes those checks to production. The goal underneath both is the same: shrink the gap between writing code and finding out if it broke something.",
        questions: [
          "What's the difference between continuous integration and continuous deployment?",
          "How does a typical CI pipeline stage work (build, test, deploy)?",
          "What's the difference between GitHub Actions and Jenkins?",
          "How do you cache dependencies to speed up a CI pipeline?",
          "What is a build artifact?",
          "How do you set up automated tests to block a bad deploy?",
          "What's a blue-green deployment?",
          "How does a canary release reduce deployment risk?",
          "How do you manage secrets safely inside a CI pipeline?",
          "What's the difference between a staging and production environment?",
          "How do you roll back a bad production deployment quickly?",
          "How does a monorepo affect CI pipeline design?",
          "What's the purpose of a pipeline as code (YAML config)?",
          "How do you parallelize test runs in CI to save time?",
          "How does feature flagging support safer continuous deployment?",
          "What's the difference between a smoke test and a full test suite in CI?",
          "How do you handle database migrations safely during deployment?",
          "How do you set up notifications for failed pipeline runs?",
          "How does trunk-based development pair with CI/CD?",
          "What's the tradeoff between deploying often vs deploying big batches?",
        ],
      },
      {
        id: "docker-containers",
        title: "Docker & Containers",
        description: "Packaging an app so it runs the same everywhere.",
        answer:
          "A Docker container packages your app with everything it needs — runtime, libraries, config — into one portable unit, so it behaves the same on your laptop, a teammate's machine, or a cloud server. Images are the read-only blueprint, containers are running instances of that image, and a Dockerfile is the recipe that builds the image in the first place.",
        questions: [
          "What's the difference between a Docker image and a container?",
          "What is a Dockerfile and how does it build an image?",
          "How does Docker differ from a virtual machine?",
          "What's the purpose of a .dockerignore file?",
          "How do you reduce the size of a Docker image?",
          "What is a multi-stage Docker build?",
          "How does Docker Compose manage multiple services together?",
          "What's the difference between a bind mount and a volume?",
          "How do containers communicate with each other over a network?",
          "How do you pass environment variables into a container securely?",
          "What is a base image and how do you choose one?",
          "How does layer caching speed up Docker builds?",
          "How do you debug a container that keeps crashing?",
          "What's the difference between CMD and ENTRYPOINT in a Dockerfile?",
          "How do you persist data when a container restarts?",
          "What's the difference between Docker Swarm and Kubernetes?",
          "How do you scan a Docker image for security vulnerabilities?",
          "How do you run a database in a container safely for local development?",
          "What's the difference between exposing and publishing a port?",
          "How do you keep container images small and secure long-term?",
        ],
      },
      {
        id: "linux-terminal",
        title: "Linux & Terminal",
        description: "The command line every server actually runs on.",
        answer:
          "Nearly every server, container, and CI runner is Linux under the hood, so terminal fluency — navigating directories, managing processes, reading logs, editing permissions — is what turns 'it works on my machine' into 'it works everywhere.' Most day-to-day terminal work is a handful of commands used constantly: cd, ls, grep, chmod, ps, and piping them together.",
        questions: [
          "What's the difference between chmod and chown?",
          "How do file permissions (rwx) actually work in Linux?",
          "How does piping (|) combine commands?",
          "What's the difference between a process and a thread in Linux?",
          "How do you find and kill a stuck process?",
          "What does grep actually search and how does regex fit in?",
          "How do environment variables work in a shell session?",
          "What's the difference between a hard link and a symbolic link?",
          "How do you check disk usage and free space from the terminal?",
          "What's the difference between stdout, stderr, and stdin?",
          "How do you schedule a recurring task with cron?",
          "How do you view and follow a live log file?",
          "What's the difference between sudo and running as root?",
          "How do you check which process is using a specific port?",
          "How does SSH let you securely connect to a remote server?",
          "What's the difference between apt, yum, and other package managers?",
          "How do you compress and extract files with tar?",
          "How do you monitor CPU and memory usage in real time?",
          "What's the difference between a foreground and background process?",
          "How do you write a basic bash script with variables and a loop?",
        ],
      },
      {
        id: "cloud-deployment",
        title: "Cloud Deployment",
        description: "Getting your app onto real infrastructure.",
        answer:
          "Deploying to the cloud means choosing how much infrastructure you want to manage yourself: raw virtual machines give full control but full responsibility, managed platforms like Vercel or Render handle scaling and routing for you, and serverless functions run your code on-demand without a server to maintain at all. Most modern web apps mix these — static frontend on a CDN, functions for APIs, managed database.",
        questions: [
          "What's the difference between IaaS, PaaS, and serverless?",
          "How does a CDN speed up delivering static assets?",
          "What's the difference between deploying to a VM and to serverless functions?",
          "How does auto-scaling decide when to add more servers?",
          "What's the difference between horizontal and vertical scaling?",
          "How does a load balancer distribute traffic across servers?",
          "How do environment variables get managed safely in cloud deployments?",
          "What's the difference between a staging and production deployment slot?",
          "How does DNS routing work when you deploy a new domain?",
          "What's a cold start in serverless functions and why does it happen?",
          "How do you set up zero-downtime deployments?",
          "What's the difference between AWS Lambda and a traditional server?",
          "How do you handle secrets and API keys in a cloud environment?",
          "How does infrastructure as code (like Terraform) work?",
          "What's the tradeoff between managed databases and self-hosted ones?",
          "How do you set up a custom domain with HTTPS on a deployed app?",
          "How does edge computing differ from a traditional single-region server?",
          "How do you estimate cloud costs before scaling up?",
          "What's the difference between a region and an availability zone?",
          "How do you roll back a cloud deployment that broke production?",
        ],
      },
      {
        id: "monitoring-logging",
        title: "Monitoring & Logging",
        description: "Knowing something broke before your users tell you.",
        answer:
          "Monitoring tracks the health of a system in real time — response times, error rates, resource usage — and alerts you when something crosses a threshold. Logging captures the detailed trail of what actually happened inside a request, which is what you dig into after an alert fires to find the root cause. Good systems have both, and neither works well without the other.",
        questions: [
          "What's the difference between monitoring, logging, and tracing?",
          "How do you decide what metrics actually matter to track?",
          "What's the difference between structured and unstructured logs?",
          "How does distributed tracing work across microservices?",
          "What's a good alert threshold, and how do you avoid alert fatigue?",
          "How do you centralize logs from multiple services?",
          "What's the difference between error rate and latency as metrics?",
          "How do you set up health checks for a deployed service?",
          "What's the purpose of a dashboard like Grafana?",
          "How do you correlate a log entry with a specific user request?",
          "What's the difference between synthetic monitoring and real user monitoring?",
          "How do you avoid logging sensitive user data by accident?",
          "How does log retention policy balance cost and debuggability?",
          "What's the difference between a metric and an event?",
          "How do you set up on-call alerting without burning out a team?",
          "How does anomaly detection work for unusual traffic patterns?",
          "What's the role of a status page during an incident?",
          "How do you debug an issue that only happens in production?",
          "How do you monitor third-party API dependencies you don't control?",
          "How do you write a good postmortem after an outage?",
        ],
      },
    ],
  },
  {
    id: "uiux",
    title: "UI/UX Design",
    icon: PenTool,
    topics: [
      {
        id: "design-fundamentals",
        title: "Design Fundamentals",
        description: "The rules that make an interface feel obvious.",
        answer:
          "Good UI design comes down to a handful of repeatable principles: consistent visual hierarchy so eyes know where to go first, enough contrast and spacing that elements don't fight for attention, and alignment that makes a layout feel intentional instead of accidental. Most 'this looks off' feelings trace back to one of these being broken, even when nobody can say exactly why.",
        questions: [
          "What is visual hierarchy and how do you create it?",
          "How does contrast guide a user's attention?",
          "What's the difference between whitespace and empty space?",
          "How do you choose a color palette that feels intentional?",
          "What's the 60-30-10 rule in color usage?",
          "How does typography affect readability and tone?",
          "What's the difference between alignment and grid systems?",
          "How does Gestalt's proximity principle affect layout?",
          "What makes a call-to-action button stand out appropriately?",
          "How do you balance consistency with visual interest?",
          "What's the difference between a serif and sans-serif typeface's feel?",
          "How does color contrast ratio relate to readability?",
          "What's the role of repetition in a cohesive design?",
          "How do you design for scanning instead of reading?",
          "What's the difference between skeuomorphism and flat design?",
          "How do shadows and elevation communicate hierarchy?",
          "How does a 4pt or 8pt spacing grid keep layouts consistent?",
          "What's the difference between a wireframe and a mockup?",
          "How do you critique your own design objectively?",
          "How does motion design support usability instead of distracting from it?",
        ],
      },
      {
        id: "figma-workflow",
        title: "Figma Workflow",
        description: "From blank canvas to developer-ready file.",
        answer:
          "Figma's power comes from components and auto layout: a component lets you update one button everywhere it's used, and auto layout makes frames resize intelligently as content changes, similar to how flexbox works in CSS. Variants let a single component switch states (default, hover, disabled) without duplicating it, keeping a file manageable as it grows.",
        questions: [
          "What's the difference between a frame and a group in Figma?",
          "How do components and instances work in Figma?",
          "What is auto layout and how does it mimic CSS flexbox?",
          "How do variants let one component have multiple states?",
          "How do you set up a consistent color and text style library?",
          "What's the difference between a main component and its instances?",
          "How do you use constraints to control resizing behavior?",
          "How do plugins extend what Figma can do?",
          "How do you organize a large Figma file with pages and sections?",
          "What's the difference between Figma and Figma's dev mode?",
          "How do you hand off a design to developers effectively?",
          "How do you use variables for theming (light/dark mode) in Figma?",
          "What's the difference between a boolean and instance-swap property?",
          "How do you prototype interactive flows in Figma?",
          "How do you keep a design system file in sync across projects?",
          "How does Figma's version history help recover past work?",
          "What's the best way to comment and collaborate with a team in Figma?",
          "How do you export assets at the right resolution for developers?",
          "How do you audit a file for inconsistent styles before handoff?",
          "How do you structure a component's naming convention for clarity?",
        ],
      },
      {
        id: "accessibility",
        title: "Accessibility",
        description: "Designing for every user, not just the average one.",
        answer:
          "Accessible design makes sure people using screen readers, keyboard-only navigation, or with low vision can use your product just as well as anyone else — and it's usually a checklist, not a redesign: sufficient color contrast, visible focus states, alt text on images, and semantic HTML that a screen reader can actually parse. Most accessibility fixes also just make the product better for everyone.",
        questions: [
          "What does WCAG stand for and what does it cover?",
          "What's the minimum color contrast ratio for normal text?",
          "How does a screen reader interpret a webpage?",
          "What's the difference between alt text and a caption?",
          "How do you design a visible, usable keyboard focus state?",
          "What's the difference between accessible and merely compliant design?",
          "How do ARIA labels help assistive technology?",
          "What's the difference between semantic HTML and div-soup?",
          "How do you test a design for keyboard-only navigation?",
          "What's the difference between AA and AAA WCAG compliance?",
          "How does font size and line height affect readability for low vision users?",
          "How do you design accessible form error messages?",
          "What's the difference between a skip link and a landmark region?",
          "How do you make sure color isn't the only way information is conveyed?",
          "How do you design accessible data tables?",
          "What's the difference between accessibility and usability?",
          "How do you handle motion for users with vestibular disorders?",
          "How do you test accessibility with real assistive technology, not just tools?",
          "What's the role of a focus trap in a modal dialog?",
          "How do you write accessible, non-vague button labels?",
        ],
      },
      {
        id: "design-systems",
        title: "Design Systems",
        description: "One source of truth for how a product should look.",
        answer:
          "A design system is a shared library of components, tokens (colors, spacing, type scale), and documented rules for when to use each — the whole point is that a button looks and behaves the same whether a designer built the screen or a developer wired it up. Without one, every new feature quietly reinvents small decisions, and the product slowly drifts inconsistent.",
        questions: [
          "What's the difference between a design system and a style guide?",
          "What are design tokens and why do they matter?",
          "How do you decide what becomes a reusable component vs a one-off?",
          "How does a design system stay in sync between Figma and code?",
          "What's the difference between atomic design's atoms, molecules, and organisms?",
          "How do you version a design system as it evolves?",
          "How do you get buy-in from a team to actually use a design system?",
          "What's the role of documentation in a design system's adoption?",
          "How do you handle a component that needs a one-off exception?",
          "How does a design system handle theming for multiple brands?",
          "What's the difference between component-level and page-level consistency?",
          "How do you audit an existing product to build a system from scratch?",
          "How do you keep a design system from becoming outdated?",
          "What's the role of a component's props/variants in a coded design system?",
          "How do you test that a design system component meets accessibility standards?",
          "How do you handle breaking changes to a widely-used component?",
          "What's the difference between a design system and a component library?",
          "How do you decide the right level of flexibility for a component?",
          "How do you onboard a new designer or developer to an existing system?",
          "How do open-source systems like Material Design influence custom ones?",
        ],
      },
      {
        id: "user-research",
        title: "User Research",
        description: "Designing from what users actually do, not assumptions.",
        answer:
          "User research replaces guessing with evidence: usability testing watches real people attempt real tasks and reveals where they get stuck, while interviews and surveys surface what users want and why. The key discipline is separating what users say from what they do — people are notoriously bad at predicting their own future behavior, which is why watching beats asking alone.",
        questions: [
          "What's the difference between qualitative and quantitative research?",
          "How do you run a usability test with 5 participants?",
          "What's the difference between a user interview and a survey?",
          "How do you write unbiased research questions?",
          "What is a user persona and how do you build one from real data?",
          "How do you create a customer journey map?",
          "What's the difference between moderated and unmoderated usability testing?",
          "How many users do you actually need to test to find most issues?",
          "How do you turn research findings into actionable design changes?",
          "What's the difference between attitudinal and behavioral research?",
          "How do you run an effective card sorting exercise?",
          "What's a heuristic evaluation and how does it differ from user testing?",
          "How do you avoid leading questions during an interview?",
          "How do you prioritize which user pain points to fix first?",
          "What's the role of analytics data alongside qualitative research?",
          "How do you research a feature for users you don't have access to yet?",
          "How do you present research findings to stakeholders convincingly?",
          "What's the difference between A/B testing and usability testing?",
          "How do you research accessibility needs for users with disabilities?",
          "How do you know when you've done 'enough' research to start designing?",
        ],
      },
      {
        id: "prototyping-handoff",
        title: "Prototyping & Handoff",
        description: "Turning static screens into something that feels real.",
        answer:
          "A prototype exists to answer a question before code gets written — does this flow make sense, does this interaction feel right — and the fidelity should match the question: a low-fidelity click-through tests flow, a high-fidelity interactive prototype tests feel. Handoff to developers works best when specs (spacing, states, edge cases) are explicit, not left for someone to infer from a static screen.",
        questions: [
          "What's the difference between low-fidelity and high-fidelity prototypes?",
          "How do you prototype a multi-screen flow in Figma?",
          "What's the difference between a wireframe, mockup, and prototype?",
          "How do you decide what fidelity a prototype needs for its purpose?",
          "How do you design and prototype micro-interactions?",
          "What's the difference between a click-through and a coded prototype?",
          "How do you test a prototype with real users before development?",
          "What details are easy to miss when handing off a design to developers?",
          "How do you document edge cases (empty, error, loading states) for handoff?",
          "What's the role of a specs/redlines document in developer handoff?",
          "How do you prototype animations that developers can actually replicate?",
          "How do you handle responsive behavior in a prototype?",
          "What's the difference between prototyping in Figma vs a code-based tool?",
          "How do you keep a prototype in sync as the design changes?",
          "How do you communicate interaction timing (easing, duration) to developers?",
          "What's the best way to prototype a complex form with validation?",
          "How do you prototype for accessibility, like focus order?",
          "How do you gather feedback on a prototype efficiently?",
          "What's the difference between a proof-of-concept and a polished prototype?",
          "How do you know a prototype is ready to move into development?",
        ],
      },
    ],
  },
];

const totalTopics = roadmaps.reduce((sum, r) => sum + r.topics.length, 0);
const totalQuestions = roadmaps.reduce(
  (sum, r) => sum + r.topics.reduce((s, t) => s + t.questions.length, 0),
  0
);

const fallbackAnswer =
  "That's a great question to dig into. While I get a full answer wired up for this one, here's the short version: break the problem into the smallest piece you actually understand, solve that piece first, then build outward. Try picking one of the questions from a topic below to see a full walkthrough.";

// ---------------------------------------------------------------------------
// Chat message types
// ---------------------------------------------------------------------------

type Stage = "thinking" | "typing" | "done";

interface ChatMessage {
  id: number;
  role: "user" | "ai";
  content: string;
  stage?: Stage;
  visibleChars?: number;
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" />
    </span>
  );
}

export default function WanttolearnfromAi() {
  const [prompt, setPrompt] = useState("");
  const [activeRoadmapId, setActiveRoadmapId] = useState(roadmaps[0].id);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const nextId = useRef(0);
  const typingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // TODO(backend): replace this lookup with a real call to /api/ai-tutor
  // that hits the Gemini API with { question, topicId, roadmapId }.
  const answerMap = useMemo(() => {
    const map: Record<string, string> = {};
    roadmaps.forEach((rm) =>
      rm.topics.forEach((t) =>
        t.questions.forEach((q) => {
          map[q] = t.answer;
        })
      )
    );
    return map;
  }, []);

  const getAnswerFor = (question: string) => answerMap[question] ?? fallbackAnswer;

  const activeRoadmap = roadmaps.find((r) => r.id === activeRoadmapId) ?? roadmaps[0];

  useEffect(() => {
    return () => {
      if (typingInterval.current) clearInterval(typingInterval.current);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const runAiResponse = (question: string) => {
    const userMsgId = nextId.current++;
    const aiMsgId = nextId.current++;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: question },
      { id: aiMsgId, role: "ai", content: "", stage: "thinking", visibleChars: 0 },
    ]);
    setIsBusy(true);

    const fullAnswer = getAnswerFor(question);

    // Stage 1: thinking (bouncing dots) — simulates the tutor "reading" the question.
    const thinkingDelay = 900 + Math.random() * 500;

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId ? { ...m, stage: "typing", content: fullAnswer } : m
        )
      );

      // Stage 2: typewriter reveal, a few characters per tick.
      let revealed = 0;
      const charsPerTick = 2;
      typingInterval.current = setInterval(() => {
        revealed += charsPerTick;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? { ...m, visibleChars: Math.min(revealed, fullAnswer.length) }
              : m
          )
        );

        if (revealed >= fullAnswer.length) {
          if (typingInterval.current) clearInterval(typingInterval.current);
          setMessages((prev) =>
            prev.map((m) => (m.id === aiMsgId ? { ...m, stage: "done" } : m))
          );
          setIsBusy(false);
        }
      }, 18);
    }, thinkingDelay);
  };

  const handleQuestionClick = (question: string) => {
    if (isBusy) return;
    setActiveQuestion(question);
    setPrompt("");
    runAiResponse(question);
  };

  const handleSend = () => {
    const question = prompt.trim();
    if (!question || isBusy) return;
    setActiveQuestion(null);
    setPrompt("");
    runAiResponse(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopicId((prev) => (prev === topicId ? null : topicId));
  };

  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-slate-950 py-20 px-4 sm:px-8 transition-colors duration-300">

      <div className="relative mx-auto max-w-6xl">

        {/* Eyebrow */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-1.5 text-sm font-normal text-slate-600 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            AI Tutor · {totalTopics} topics · {totalQuestions}+ questions
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-center text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Want to learn from{" "}
          <span className="text-emerald-600 dark:text-emerald-400">AI?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base sm:text-lg font-normal text-slate-500 dark:text-slate-400">
          Pick a roadmap, drill into a topic, and ask a real question - your
          tutor breaks it down step by step, live.
        </p>

        {/* Roadmap + chat layout */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-12">

          {/* Roadmap / topic browser */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
              <Hash className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs font-mono font-normal text-slate-400 dark:text-slate-500">
                roadmaps
              </span>
            </div>

            {/* Roadmap pills */}
            <div className="flex flex-wrap gap-2 p-4 border-b border-slate-200 dark:border-slate-700">
              {roadmaps.map((rm) => {
                const Icon = rm.icon;
                const isActive = rm.id === activeRoadmapId;
                return (
                  <button
                    key={rm.id}
                    onClick={() => {
                      setActiveRoadmapId(rm.id);
                      setExpandedTopicId(null);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all
                      ${
                        isActive
                          ? "border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-300"
                      }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {rm.title}
                  </button>
                );
              })}
            </div>

            {/* Topics for active roadmap */}
            <div className="flex-1 overflow-y-auto max-h-[420px] divide-y divide-slate-200 dark:divide-slate-700">
              {activeRoadmap.topics.map((topic) => {
                const isExpanded = expandedTopicId === topic.id;
                return (
                  <div key={topic.id}>
                    <button
                      onClick={() => toggleTopic(topic.id)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {topic.title}
                        </p>
                        <p className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                          {topic.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                          {topic.questions.length}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 flex flex-wrap gap-1.5">
                        {topic.questions.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleQuestionClick(q)}
                            disabled={isBusy}
                            className={`rounded-md border px-2.5 py-1 text-[11px] font-normal transition-all disabled:opacity-40 disabled:cursor-not-allowed
                              ${
                                activeQuestion === q
                                  ? "border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-300"
                              }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terminal / chat mock */}
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">

            {/* Terminal header */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 flex items-center gap-1.5 text-xs font-mono font-normal text-slate-400 dark:text-slate-500">
                <Bot className="h-3.5 w-3.5" />
                AI-tutor - CodeNFacts
              </span>
              {isBusy && (
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wide text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  live
                </span>
              )}
            </div>

            {/* Conversation area */}
            <div
              ref={scrollRef}
              className="px-5 py-6 space-y-4 font-mono text-sm overflow-y-auto flex-1 max-h-[420px]"
            >
              <div className="flex gap-3">
                <span className="text-slate-400 dark:text-slate-500 select-none">$</span>
                <p className="font-normal text-slate-400 dark:text-slate-500">
                  ai-tutor --init
                </p>
              </div>
              <div className="flex gap-3">
                <Bot className="h-5 w-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                <p className="font-normal text-slate-600 dark:text-slate-300 leading-relaxed">
                  Hey! Pick a roadmap on the left, expand a topic, and tap any
                  question - or just type your own below.
                </p>
              </div>

              {messages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex gap-3">
                    <User className="h-5 w-5 flex-shrink-0 text-slate-400 dark:text-slate-500 mt-0.5" />
                    <p className="font-normal text-slate-700 dark:text-slate-300">
                      {m.content}
                    </p>
                  </div>
                ) : (
                  <div key={m.id} className="flex gap-3">
                    <Bot className="h-5 w-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                    <div className="flex-1">
                      {m.stage === "thinking" ? (
                        <ThinkingDots />
                      ) : (
                        <p className="font-normal text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {m.content.slice(0, m.visibleChars ?? 0)}
                          {m.stage === "typing" && (
                            <span className="inline-block w-[2px] h-4 -mb-0.5 ml-0.5 bg-emerald-500 animate-pulse" />
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Input bar */}
            <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-mono text-sm select-none">
                  &gt;_
                </span>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isBusy ? "AI tutor is answering..." : "Ask the AI tutor anything..."
                  }
                  disabled={isBusy}
                  className="flex-1 bg-transparent text-sm font-mono font-normal text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSend}
                  className="inline-flex items-center justify-center rounded-md bg-emerald-600 dark:bg-emerald-500 p-2 text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={!prompt.trim() || isBusy}
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA — links to /learning-ai, visible in both light and dark */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/ai"
            className="group inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700
  px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-300
  hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300 transition-colors"
          >
            Start learning with AI
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}