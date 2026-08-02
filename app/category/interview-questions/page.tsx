"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, X, LayoutGrid, ListChecks } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface QuestionCategory {
  id: string;
  title: string;
  blurb: string;
  questions: string[];
}

const CATEGORIES: QuestionCategory[] = [
  {
    id: "javascript",
    title: "JavaScript",
    blurb: "Core language, async patterns, runtime behaviour",
    questions: [
      "What is the difference between var, let, and const?",
      "Explain how closures work in JavaScript.",
      "What is the difference between == and ===?",
      "What is event bubbling and event capturing?",
      "Explain the concept of hoisting in JavaScript.",
      "What is the difference between null and undefined?",
      "How does the JavaScript event loop work?",
      "What are promises and how do they differ from callbacks?",
      "Explain async/await and how it relates to promises.",
      "What is the difference between call, apply, and bind?",
      "What are arrow functions and how do they differ from regular functions?",
      "Explain prototypal inheritance in JavaScript.",
      "What is the purpose of the strict mode directive?",
      "What are JavaScript generators and how are they used?",
      "Explain the difference between synchronous and asynchronous code.",
      "What is a higher-order function?",
      "What is currying in JavaScript?",
      "Explain debouncing and throttling with examples.",
      "What is the difference between a shallow copy and a deep copy?",
      "What are template literals and how do they improve string handling?",
      "Explain the behaviour of the this keyword in different contexts.",
      "What is the difference between synchronous and asynchronous iteration?",
      "What are WeakMap and WeakSet used for?",
      "Explain memoization and how you would implement it.",
      "What is the module pattern in JavaScript?",
      "How does garbage collection work in JavaScript?",
      "What is the difference between microtasks and macrotasks?",
      "Explain destructuring assignment with an example.",
      "What are Symbols in JavaScript and what are they used for?",
      "What is the difference between Object.freeze and Object.seal?",
    ],
  },
  {
    id: "typescript",
    title: "TypeScript",
    blurb: "Static typing, generics, tooling",
    questions: [
      "What is TypeScript and how does it differ from JavaScript?",
      "Explain the difference between interface and type.",
      "What are generics and why are they useful?",
      "What is the difference between any, unknown, and never?",
      "Explain how type inference works in TypeScript.",
      "What are union and intersection types?",
      "What is the purpose of the readonly modifier?",
      "Explain how enums work in TypeScript.",
      "What are decorators used for in TypeScript?",
      "What is the difference between public, private, and protected access modifiers?",
      "How do you define optional properties on an interface?",
      "What are mapped types and how are they used?",
      "Explain conditional types with an example.",
      "What is type narrowing and how is it achieved?",
      "What is the purpose of the tsconfig.json file?",
      "Explain the difference between abstract classes and interfaces.",
      "What are utility types like Partial, Pick, and Omit used for?",
      "How does TypeScript handle null and undefined checking?",
      "What is declaration merging in TypeScript?",
      "Explain how TypeScript compiles down to plain JavaScript.",
    ],
  },
  {
    id: "react",
    title: "React.js",
    blurb: "Components, hooks, rendering behaviour",
    questions: [
      "What is the virtual DOM and how does it improve performance?",
      "Explain the difference between state and props.",
      "What are React hooks and why were they introduced?",
      "Explain the useEffect hook and its dependency array.",
      "What is the difference between controlled and uncontrolled components?",
      "How does React's reconciliation algorithm work?",
      "What is the purpose of keys when rendering lists?",
      "Explain the useMemo and useCallback hooks.",
      "What is prop drilling and how can it be avoided?",
      "Explain the Context API and when you would use it.",
      "What is the difference between a class component and a functional component?",
      "What are React fragments and why are they useful?",
      "Explain the lifecycle methods available in class components.",
      "What is React.memo and how does it optimize rendering?",
      "What is the purpose of the useRef hook?",
      "Explain how you would implement error boundaries in React.",
      "What is server-side rendering and how does it differ from client-side rendering?",
      "What is the difference between React and Next.js?",
      "Explain lazy loading and code splitting in React.",
      "Why does the key prop matter so much when rendering dynamic lists?",
      "How do you manage global state in a large React application?",
      "What are custom hooks and when would you create one?",
      "Explain how React handles synthetic events.",
      "What is the difference between useState and useReducer?",
      "What are portals in React and when would you use them?",
      "Explain how React batches state updates.",
      "What is the difference between React.StrictMode and normal rendering?",
      "How would you approach optimizing a slow React application?",
      "What is hydration in the context of server-rendered React apps?",
      "Explain the difference between client components and server components in Next.js.",
    ],
  },
  {
    id: "nodejs",
    title: "Node.js",
    blurb: "Runtime internals, APIs, backend patterns",
    questions: [
      "What is Node.js and how does its event-driven architecture work?",
      "Explain the difference between blocking and non-blocking code.",
      "What is the event loop in Node.js and how does it differ from the browser's?",
      "What are streams in Node.js and what types exist?",
      "Explain the purpose of the package.json file.",
      "What is middleware in the context of Express.js?",
      "How do you handle errors in asynchronous Node.js code?",
      "What is the difference between require and import in Node.js?",
      "Explain how clustering works in Node.js.",
      "What is the purpose of the Buffer class?",
      "How does Node.js handle child processes?",
      "What is the difference between process.nextTick and setImmediate?",
      "Explain how you would secure a Node.js REST API.",
      "What is the purpose of environment variables and how are they managed?",
      "How do you handle file uploads in a Node.js application?",
      "What is the difference between synchronous and asynchronous file system methods?",
      "Explain how connection pooling works with databases in Node.js.",
      "What are worker threads and when would you use them?",
      "How would you implement rate limiting in an Express application?",
      "What is the purpose of the EventEmitter class?",
      "Explain how you would structure a large-scale Node.js application.",
      "What is CORS and how do you handle it in a Node.js server?",
      "How do you diagnose and fix memory leaks in a Node.js application?",
      "What is the difference between REST and GraphQL APIs?",
      "Explain how JWT-based authentication works in a Node.js application.",
    ],
  },
  {
    id: "python",
    title: "Python",
    blurb: "Language mechanics, concurrency, tooling",
    questions: [
      "What are the key differences between Python 2 and Python 3?",
      "Explain the difference between lists and tuples.",
      "What are Python decorators and how do they work?",
      "Explain list comprehensions with an example.",
      "What is the Global Interpreter Lock and how does it affect concurrency?",
      "What is the difference between a deep copy and a shallow copy?",
      "Explain how generators differ from regular functions.",
      "What are Python's magic methods and give an example of their use?",
      "What is the difference between @staticmethod and @classmethod?",
      "Explain how exception handling works in Python.",
      "What is the difference between mutable and immutable data types?",
      "How does memory management work in Python?",
      "What are context managers and how does the with statement use them?",
      "Explain the difference between args and kwargs.",
      "What is duck typing in Python?",
      "How do you choose between multithreading and multiprocessing in Python?",
      "What are lambda functions and when would you use them?",
      "Explain the difference between a module and a package.",
      "What is the purpose of virtual environments in Python?",
      "How does Python's garbage collector work?",
      "What are Python data classes and what problem do they solve?",
      "Explain the difference between iterators and iterables.",
      "What is monkey patching in Python?",
      "How would you profile and optimize a slow Python script?",
      "What distinguishes deep learning libraries such as TensorFlow and PyTorch?",
      "Explain how Python handles namespaces and scope.",
      "What is the difference between a set and a frozenset?",
      "How do you implement a singleton pattern in Python?",
      "What are metaclasses in Python?",
      "Explain asynchronous programming in Python using asyncio.",
    ],
  },
  {
    id: "java",
    title: "Java",
    blurb: "OOP fundamentals, JVM, collections",
    questions: [
      "What is the difference between JDK, JRE, and JVM?",
      "Explain the core pillars of object-oriented programming as applied in Java.",
      "What is the difference between an abstract class and an interface?",
      "Explain how garbage collection works in Java.",
      "What is the difference between checked and unchecked exceptions?",
      "What are Java generics and why are they used?",
      "Explain the difference between == and .equals() in Java.",
      "What is the purpose of the volatile keyword?",
      "How does multithreading work in Java?",
      "What is the difference between synchronized methods and synchronized blocks?",
      "Explain the purpose of the Java Collections Framework.",
      "What is the difference between ArrayList and LinkedList?",
      "What is the difference between HashMap and TreeMap?",
      "Explain method overloading versus method overriding.",
      "What is the purpose of the final keyword in Java?",
      "How does Java allocate memory for objects?",
      "What are Java streams and how do they simplify data processing?",
      "What is the difference between a HashSet and a TreeSet?",
      "What is the purpose of the transient keyword?",
      "How does exception propagation work in Java?",
      "What is dependency injection and how is it used in Spring?",
      "Explain the difference between Spring MVC and Spring Boot.",
      "What is the purpose of the Optional class?",
      "How would you implement a thread-safe singleton in Java?",
      "What is the difference between fail-fast and fail-safe iterators?",
    ],
  },
  {
    id: "html-css",
    title: "HTML & CSS",
    blurb: "Layout, styling, accessibility",
    questions: [
      "What is the difference between block, inline, and inline-block elements?",
      "Explain the CSS box model.",
      "What is the difference between Flexbox and CSS Grid?",
      "How does CSS specificity determine which styles apply?",
      "What is the difference between relative, absolute, fixed, and sticky positioning?",
      "Explain the purpose of semantic HTML elements.",
      "What are CSS pseudo-classes and pseudo-elements?",
      "How do media queries enable responsive design?",
      "What is the difference between em, rem, and px units?",
      "Explain how CSS custom properties (variables) work.",
      "What is the purpose of the z-index property?",
      "How does the CSS cascade determine the final applied styles?",
      "What is the difference between visibility hidden and display none?",
      "Explain how CSS animations differ from transitions.",
      "What are ARIA attributes and why do they matter for accessibility?",
      "What is the purpose of a CSS reset or normalize stylesheet?",
      "Explain the concept of mobile-first design.",
      "What is the difference between SVG and canvas for rendering graphics?",
      "How would you implement a responsive layout without a CSS framework?",
      "What is the purpose of the viewport meta tag?",
    ],
  },
  {
    id: "sql-databases",
    title: "SQL & Databases",
    blurb: "Query design, transactions, scaling",
    questions: [
      "What is the difference between SQL and NoSQL databases?",
      "Explain the different types of joins in SQL.",
      "What is normalization and why is it important?",
      "What is the difference between a primary key and a foreign key?",
      "Explain the ACID properties of a database transaction.",
      "What is the difference between DELETE, TRUNCATE, and DROP?",
      "What is an index and how does it improve query performance?",
      "Explain the difference between clustered and non-clustered indexes.",
      "What is a stored procedure and when would you use one?",
      "What is the difference between the WHERE and HAVING clauses?",
      "Explain the concept of database denormalization.",
      "What is a deadlock and how can it be prevented?",
      "What is the difference between OLTP and OLAP systems?",
      "Explain the CAP theorem in the context of distributed databases.",
      "What is database sharding and why is it used?",
      "What is the difference between a view and a materialized view?",
      "Explain how transactions and isolation levels interact.",
      "What is the difference between an inner join and an outer join?",
      "What is a composite key in a database?",
      "How would you go about optimizing a slow-running SQL query?",
      "What is the difference between horizontal and vertical scaling of a database?",
      "Explain the difference between a document database and a key-value store.",
      "What is database replication and what problems does it solve?",
      "What is the purpose of database migrations?",
      "Explain the difference between eager loading and lazy loading.",
    ],
  },
  {
    id: "system-design",
    title: "System Design",
    blurb: "Scalability, architecture trade-offs",
    questions: [
      "How would you design a URL shortening service?",
      "What is the difference between horizontal and vertical scaling?",
      "How would you design a rate limiter for an API?",
      "Explain the concept of load balancing and common algorithms used.",
      "How would you design a scalable notification system?",
      "What is a content delivery network and how does it improve performance?",
      "How would you design a chat application like WhatsApp?",
      "Explain the difference between synchronous and asynchronous communication between services.",
      "How would you approach caching in a large-scale system?",
      "What is the difference between a monolithic and a microservices architecture?",
      "How would you design a distributed file storage system?",
      "What is eventual consistency and when is it an acceptable trade-off?",
      "How would you design a news feed system like Twitter or Instagram?",
      "Explain the role of a message queue in system design.",
      "How would you design a system to support millions of concurrent users?",
      "What is the difference between a load balancer and an API gateway?",
      "How would you design a booking system for flights or hotels?",
      "Explain database replication strategies used for high availability.",
      "How would you design a search autocomplete feature?",
      "What is a circuit breaker pattern and why is it used?",
      "How would you design a payment processing system?",
      "Explain the trade-offs between consistency and availability in distributed systems.",
      "How would you design a video streaming service like YouTube?",
      "What is idempotency and why does it matter in API design?",
      "How would you design a leaderboard system for a gaming platform?",
    ],
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    blurb: "Complexity, classic problems, patterns",
    questions: [
      "What is the difference between an array and a linked list?",
      "Explain how a hash table works and how collisions are handled.",
      "What is the time complexity of the common sorting algorithms?",
      "How does a binary search algorithm work?",
      "What is the difference between a stack and a queue?",
      "Explain how a binary search tree maintains order.",
      "What is the difference between depth-first search and breadth-first search?",
      "How would you detect a cycle in a linked list?",
      "What is dynamic programming and when should it be used?",
      "Explain the difference between greedy algorithms and dynamic programming.",
      "What is a heap and how does it support priority queues?",
      "How would you reverse a linked list?",
      "What is the difference between a balanced and an unbalanced binary tree?",
      "Explain how a trie data structure works and its use cases.",
      "What is Big O notation and why does it matter?",
      "How would you find the shortest path in a weighted graph?",
      "What is the difference between merge sort and quicksort?",
      "Explain how a graph can be represented in memory.",
      "What is a self-balancing tree, and can you give an example?",
      "How would you find duplicates in an array efficiently?",
      "What is the two-pointer technique and when is it useful?",
      "Explain the sliding window technique with an example.",
      "What is the difference between recursion and iteration?",
      "How would you implement an LRU cache?",
      "What is topological sorting and when is it used?",
      "Explain the concept of backtracking with an example problem.",
      "What is the difference between a min-heap and a max-heap?",
      "How would you find the kth largest element in an array?",
      "What is memoization and how does it improve recursive solutions?",
      "Explain how the union-find (disjoint set) data structure works.",
    ],
  },
  {
    id: "devops",
    title: "DevOps",
    blurb: "Pipelines, containers, reliability",
    questions: [
      "What is the difference between continuous integration and continuous deployment?",
      "Explain the purpose of containerization and how Docker achieves it.",
      "What is the difference between Docker and a virtual machine?",
      "How does Kubernetes manage container orchestration?",
      "What is infrastructure as code and why is it useful?",
      "Explain the stages of a typical CI/CD pipeline.",
      "What is the purpose of a reverse proxy in a deployment architecture?",
      "How would you roll back a failed deployment?",
      "What is blue-green deployment and how does it minimize downtime?",
      "Explain canary releases and when they are used.",
      "What is the purpose of configuration management tools like Ansible?",
      "How do you monitor application health in production?",
      "What is the difference between logging, monitoring, and alerting?",
      "Explain the concept of immutable infrastructure.",
      "What role does a load balancer play within a DevOps pipeline?",
      "How would you handle secrets management in a CI/CD pipeline?",
      "What is the purpose of a service mesh?",
      "Explain how auto-scaling works in cloud environments.",
      "What is the difference between horizontal pod autoscaling and cluster autoscaling?",
      "How would you design a disaster recovery strategy for a production system?",
    ],
  },
  {
    id: "cloud-aws",
    title: "AWS & Cloud",
    blurb: "Cloud services, scalability, cost",
    questions: [
      "What is the difference between IaaS, PaaS, and SaaS?",
      "Explain the purpose of Amazon S3 and its common use cases.",
      "What is the difference between EC2 and Lambda?",
      "How does auto-scaling work in AWS?",
      "What is the purpose of a VPC in AWS?",
      "Explain the difference between availability zones and regions.",
      "What is Amazon RDS and when would you choose it over a self-managed database?",
      "How does IAM manage access control in AWS?",
      "What is the difference between an application load balancer and a network load balancer?",
      "Explain the purpose of Amazon CloudFront.",
      "What is the difference between SQS and SNS?",
      "How would you design a serverless application using AWS Lambda?",
      "What is the purpose of Amazon CloudWatch?",
      "Explain the concept of a multi-region deployment for high availability.",
      "What is the difference between block storage and object storage?",
      "How would you secure sensitive data stored in the cloud?",
      "What is the purpose of infrastructure-as-code tools like AWS CloudFormation?",
      "Explain the shared responsibility model in cloud security.",
      "What is the difference between vertical and horizontal scaling in a cloud environment?",
      "How would you go about optimizing cloud infrastructure costs?",
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    blurb: "Threats, defenses, secure design",
    questions: [
      "What is the difference between symmetric and asymmetric encryption?",
      "Explain how SQL injection attacks work and how to prevent them.",
      "What is cross-site scripting and how can it be mitigated?",
      "What is the difference between authentication and authorization?",
      "Explain how HTTPS secures data in transit.",
      "What is a man-in-the-middle attack?",
      "What is the purpose of a firewall in network security?",
      "Explain the principle of least privilege.",
      "What is multi-factor authentication and why is it important?",
      "What is a DDoS attack and how can systems defend against it?",
      "Explain the difference between vulnerability scanning and penetration testing.",
      "What is the purpose of hashing passwords and adding salt?",
      "What is cross-site request forgery and how is it prevented?",
      "Explain the concept of zero trust architecture.",
      "What is the difference between a virus, a worm, and a trojan?",
      "How would you secure an API from unauthorized access?",
      "What is the purpose of a security information and event management system?",
      "Explain how public key infrastructure works.",
      "What is social engineering and what tactics does it commonly use?",
      "How would you respond to a data breach as part of an incident response plan?",
    ],
  },
  {
    id: "data-science-ml",
    title: "Data Science & ML",
    blurb: "Modeling, evaluation, statistics",
    questions: [
      "What is the difference between supervised and unsupervised learning?",
      "Explain the bias-variance tradeoff.",
      "What is overfitting and how can it be prevented?",
      "What is the difference between classification and regression problems?",
      "Explain how a decision tree algorithm works.",
      "What is the purpose of cross-validation in model evaluation?",
      "What is the difference between precision and recall?",
      "Explain how gradient descent optimizes a model.",
      "What is regularization and why is it used?",
      "What is the difference between bagging and boosting?",
      "Explain how a random forest algorithm works.",
      "What is the purpose of feature scaling in machine learning?",
      "What is a confusion matrix and what does it show?",
      "Explain the difference between a generative and a discriminative model.",
      "What is the curse of dimensionality?",
      "How would you handle missing data in a dataset?",
      "What is the difference between L1 and L2 regularization?",
      "Explain how a neural network learns through backpropagation.",
      "What is the purpose of an activation function in a neural network?",
      "What is the difference between batch, mini-batch, and stochastic gradient descent?",
      "Explain the concept of transfer learning.",
      "What is the difference between a convolutional neural network and a recurrent neural network?",
      "How would you evaluate a model trained on a highly imbalanced dataset?",
      "What is the purpose of dimensionality reduction techniques like PCA?",
      "Explain the difference between model parameters and hyperparameters.",
    ],
  },
  {
    id: "android",
    title: "Android Development",
    blurb: "App lifecycle, architecture, Kotlin",
    questions: [
      "What is the difference between an Activity and a Fragment?",
      "Explain the Android application lifecycle.",
      "What is the purpose of an Intent in Android development?",
      "What is the difference between implicit and explicit intents?",
      "Explain the role of the AndroidManifest.xml file.",
      "What is a Service in Android and how does it differ from a thread?",
      "What is the purpose of Jetpack Compose in modern Android development?",
      "Explain the difference between SharedPreferences and a local database like Room.",
      "What is the purpose of ViewModel in the Android architecture components?",
      "How does Android handle configuration changes such as screen rotation?",
      "What is the difference between a BroadcastReceiver and a ContentProvider?",
      "Explain how RecyclerView improves performance over ListView.",
      "What is the purpose of LiveData in Android architecture?",
      "How would you handle background work in modern Android applications?",
      "What is the difference between Kotlin coroutines and traditional threading?",
    ],
  },
  {
    id: "ios",
    title: "iOS Development",
    blurb: "Swift, memory model, UI frameworks",
    questions: [
      "What is the difference between UIKit and SwiftUI?",
      "Explain the iOS application lifecycle.",
      "What is the purpose of Auto Layout in iOS development?",
      "What is the difference between a strong and a weak reference in Swift?",
      "Explain how ARC manages memory in iOS applications.",
      "What is the difference between a class and a struct in Swift?",
      "What is the purpose of protocols in Swift?",
      "Explain the difference between synchronous and asynchronous tasks using GCD.",
      "What is the purpose of Core Data in iOS development?",
      "How does the MVC pattern apply to iOS applications?",
      "What is the difference between optionals and force unwrapping in Swift?",
      "Explain how closures work in Swift.",
      "What is the purpose of the delegate pattern in iOS development?",
      "How would you handle networking calls in an iOS application?",
      "What is the difference between a UIViewController and a UIView?",
    ],
  },
  {
    id: "testing-qa",
    title: "Testing & QA",
    blurb: "Test strategy, automation, process",
    questions: [
      "What is the difference between unit testing and integration testing?",
      "Explain the concept of test-driven development.",
      "What is the difference between black-box and white-box testing?",
      "What is a test case and what should it include?",
      "Explain the purpose of regression testing.",
      "What is the difference between manual and automated testing?",
      "What is the purpose of mocking in unit tests?",
      "Explain the difference between functional and non-functional testing.",
      "What is the purpose of a test plan in the QA process?",
      "How would you prioritize test cases when time is limited?",
      "What is the difference between smoke testing and sanity testing?",
      "Explain the concept of end-to-end testing.",
      "What is the purpose of a bug life cycle in QA?",
      "How would you test an API that has no user interface?",
      "What is the difference between load testing and stress testing?",
      "Explain the purpose of continuous testing within a CI/CD pipeline.",
      "What is exploratory testing and when is it useful?",
      "How would you write an effective bug report?",
      "What is the difference between severity and priority of a defect?",
      "How would you approach testing a feature with no documentation?",
    ],
  },
  {
    id: "hr-behavioral",
    title: "HR & Behavioral",
    blurb: "Communication, conflict, self-reflection",
    questions: [
      "Tell me about yourself.",
      "Why do you want to work for this company?",
      "What are your greatest strengths?",
      "What do you consider your biggest weakness?",
      "Describe a time you faced a conflict with a coworker and how you resolved it.",
      "Where do you see yourself in five years?",
      "Why are you leaving your current job?",
      "Describe a time you failed and what you learned from it.",
      "How do you handle stress and pressure at work?",
      "Tell me about a time you had to meet a tight deadline.",
      "Describe a situation where you had to work with a difficult team member.",
      "What motivates you to do your best work?",
      "How do you prioritize tasks when you have multiple deadlines?",
      "Describe a time you took initiative on a project.",
      "Tell me about a time you disagreed with your manager.",
      "How do you handle constructive criticism?",
      "Describe a time you had to learn a new skill quickly.",
      "What is your approach to giving feedback to a colleague?",
      "Tell me about a time you went above and beyond for a project.",
      "How do you stay organized when managing multiple projects?",
      "Describe a situation where you made a mistake at work and how you handled it.",
      "What are your salary expectations for this role?",
      "How would your previous manager describe your work style?",
      "Tell me about a time you had to persuade someone to see your point of view.",
      "What questions do you have for us about the role or the company?",
    ],
  },
  {
    id: "project-management",
    title: "Project Management",
    blurb: "Planning, delivery, stakeholder management",
    questions: [
      "What is the difference between Agile and Waterfall methodologies?",
      "Explain the role of a product backlog in Scrum.",
      "What is the purpose of a sprint retrospective?",
      "How do you handle scope creep in a project?",
      "What is the critical path method in project scheduling?",
      "Explain the difference between a project charter and a project plan.",
      "How would you manage a project with limited resources?",
      "What is the purpose of a risk register in project management?",
      "Explain the difference between a Scrum Master and a Product Owner.",
      "How do you handle stakeholders with conflicting priorities?",
      "What metrics would you use to measure project success?",
      "Explain the concept of a minimum viable product.",
      "How would you handle a team member who consistently misses deadlines?",
      "What is the purpose of a Gantt chart in project planning?",
      "Explain the difference between Kanban and Scrum.",
      "How do you communicate project status to non-technical stakeholders?",
      "What is the difference between a retrospective and a post-mortem?",
      "How would you handle a project that is falling behind schedule?",
      "Explain the concept of earned value management.",
      "How do you balance quality, scope, time, and cost in a project?",
    ],
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    blurb: "Research, prototyping, usability",
    questions: [
      "What is the difference between UI design and UX design?",
      "Explain the concept of user-centered design.",
      "What is a wireframe and how does it differ from a prototype?",
      "What is the purpose of a usability test?",
      "Explain the concept of information architecture.",
      "What is the difference between a low-fidelity and a high-fidelity prototype?",
      "How do you approach designing for accessibility?",
      "What is a design system and why is it important?",
      "Explain the concept of user personas in the design process.",
      "What is the difference between qualitative and quantitative user research?",
      "How would you measure the success of a design change?",
      "What is the purpose of A/B testing in product design?",
      "Explain the concept of visual hierarchy in design.",
      "How do you balance aesthetics with usability in your designs?",
      "What is the difference between responsive design and adaptive design?",
    ],
  },
  {
    id: "dotnet-csharp",
    title: ".NET & C#",
    blurb: "Language features, ASP.NET, memory",
    questions: [
      "What is the difference between value types and reference types in C#?",
      "Explain the difference between an abstract class and an interface in C#.",
      "What is the purpose of the using statement in C#?",
      "Explain how garbage collection works in .NET.",
      "What is the difference between IEnumerable and IQueryable?",
      "What are delegates and events in C#?",
      "Explain asynchronous programming with async/await in C#.",
      "What is the purpose of LINQ in C#?",
      "What is the difference between .NET Framework and .NET Core?",
      "Explain dependency injection in ASP.NET Core.",
      "What is the difference between a struct and a class in C#?",
      "What is the purpose of middleware in ASP.NET Core?",
      "Explain how exception handling works in C#.",
      "What is the difference between a Task and a Thread in C#?",
      "What is the purpose of Entity Framework in .NET applications?",
    ],
  },
  {
    id: "php",
    title: "PHP",
    blurb: "Language basics, frameworks, security",
    questions: [
      "What is the difference between include and require in PHP?",
      "Explain how sessions and cookies work in PHP.",
      "What is the difference between GET and POST methods in a PHP form?",
      "What is the purpose of PDO in PHP database interactions?",
      "Explain the difference between == and === in PHP.",
      "What is the purpose of namespaces in PHP?",
      "How does PHP handle error and exception handling?",
      "What is the difference between abstract classes and interfaces in PHP?",
      "Explain the concept of traits in PHP.",
      "What is the purpose of Composer in PHP development?",
      "How would you prevent SQL injection in a PHP application?",
      "What is the difference between static and instance methods in PHP?",
      "Explain the MVC architecture as used by frameworks like Laravel.",
      "What is the purpose of middleware in Laravel?",
      "How does PHP manage memory during script execution?",
    ],
  },
  {
    id: "angular",
    title: "Angular",
    blurb: "Modules, dependency injection, RxJS",
    questions: [
      "What is the difference between Angular and AngularJS?",
      "Explain the purpose of Angular modules.",
      "What is dependency injection in Angular and why is it used?",
      "Explain the difference between a component and a directive.",
      "What is the purpose of Angular services?",
      "Explain how data binding works in Angular.",
      "What is the difference between reactive forms and template-driven forms?",
      "What is the purpose of RxJS observables in Angular?",
      "Explain the Angular component lifecycle hooks.",
      "What is the purpose of Angular routing and lazy-loaded modules?",
      "What is the difference between ngOnInit and a constructor?",
      "Explain the concept of change detection in Angular.",
      "What is the purpose of pipes in Angular?",
      "How would you optimize the performance of a large Angular application?",
      "What is the difference between a pure and an impure pipe?",
    ],
  },
  {
    id: "vuejs",
    title: "Vue.js",
    blurb: "Reactivity, composition API, tooling",
    questions: [
      "What is the difference between Vue 2 and Vue 3?",
      "Explain the concept of reactivity in Vue.js.",
      "What is the purpose of the Composition API in Vue 3?",
      "Explain the difference between props and emitted events in Vue components.",
      "What is the purpose of Vuex or Pinia in a Vue application?",
      "Explain the Vue component lifecycle hooks.",
      "What is the difference between v-if and v-show?",
      "What is the purpose of computed properties versus methods?",
      "Explain how Vue Router handles navigation in a single-page application.",
      "What are Vue directives and how would you create a custom one?",
      "What is the purpose of slots in Vue components?",
      "Explain the difference between a watcher and a computed property.",
      "What is the virtual DOM in Vue and how does it improve performance?",
      "How would you structure a large-scale Vue.js application?",
      "What is the difference between single-file components and template-based components?",
    ],
  },
  {
    id: "git",
    title: "Git & Version Control",
    blurb: "Branching, history, collaboration",
    questions: [
      "What is the difference between git merge and git rebase?",
      "Explain the purpose of a git branch and how branching strategies work.",
      "What is the difference between git fetch and git pull?",
      "How would you resolve a merge conflict in Git?",
      "What is the purpose of a .gitignore file?",
      "Explain the difference between git reset and git revert.",
      "What is a git stash and when would you use it?",
      "Explain the concept of a pull request and its role in code review.",
      "What is the difference between a forked repository and a cloned repository?",
      "How would you undo the last commit without losing your changes?",
      "What is the purpose of git tags?",
      "Explain the difference between centralized and distributed version control systems.",
      "What is a detached HEAD state in Git and how do you resolve it?",
      "How would you squash multiple commits into a single commit?",
      "What is the purpose of git bisect when debugging?",
    ],
  },
  {
    id: "networking",
    title: "Networking",
    blurb: "Protocols, routing, infrastructure",
    questions: [
      "What is the difference between TCP and UDP?",
      "Explain the OSI model and its layers.",
      "What is the difference between HTTP and HTTPS?",
      "What is DNS and how does domain name resolution work?",
      "Explain the difference between a hub, a switch, and a router.",
      "What is the purpose of a subnet mask in networking?",
      "Explain how the three-way handshake works in TCP.",
      "What is the difference between IPv4 and IPv6?",
      "What is a proxy server and how does it differ from a VPN?",
      "Explain the purpose of NAT in networking.",
      "What is the difference between a load balancer and a reverse proxy?",
      "How does DHCP assign IP addresses to devices on a network?",
      "What is the purpose of a firewall in network architecture?",
      "Explain the difference between latency and bandwidth.",
      "What is the purpose of ports in networking and how do they work?",
    ],
  },
  {
    id: "operating-systems",
    title: "Operating Systems",
    blurb: "Processes, memory, scheduling",
    questions: [
      "What is the difference between a process and a thread?",
      "Explain how virtual memory works in an operating system.",
      "What is a deadlock and what conditions cause it?",
      "Explain the difference between preemptive and non-preemptive scheduling.",
      "What is the purpose of paging in memory management?",
      "Explain the difference between multitasking and multithreading.",
      "What is a semaphore and how does it help with process synchronization?",
      "Explain the difference between a mutex and a semaphore.",
      "What is the purpose of a system call in an operating system?",
      "How does an operating system perform a context switch?",
      "What is thrashing in the context of virtual memory?",
      "Explain the difference between internal and external fragmentation.",
      "What is the purpose of a file system in an operating system?",
      "Explain how an operating system schedules CPU processes.",
      "What is the difference between a monolithic kernel and a microkernel?",
    ],
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    blurb: "Requirements, process mapping, stakeholders",
    questions: [
      "What is the role of a business analyst in a software development project?",
      "Explain the difference between functional and non-functional requirements.",
      "What is the purpose of a business requirements document?",
      "How would you gather requirements from stakeholders with conflicting needs?",
      "What is the difference between a use case and a user story?",
      "Explain the concept of gap analysis in business analysis.",
      "What is a SWOT analysis and how is it used?",
      "How would you prioritize requirements on a project with limited time?",
      "What is the purpose of process modeling in business analysis?",
      "Explain the difference between as-is and to-be process documentation.",
      "How do you validate that requirements have been correctly implemented?",
      "What is the purpose of a requirements traceability matrix?",
      "Explain the concept of stakeholder analysis.",
      "How would you handle changing requirements mid-project?",
      "What is the difference between a business analyst and a product manager?",
    ],
  },
];

const TOTAL_QUESTIONS = CATEGORIES.reduce((sum, c) => sum + c.questions.length, 0);

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function InterviewQuestionsPage() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set([CATEGORIES[0].id])
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return CATEGORIES;

    return CATEGORIES.map((category) => {
      const titleMatches = category.title.toLowerCase().includes(normalizedQuery);
      const matchingQuestions = category.questions.filter((q) =>
        q.toLowerCase().includes(normalizedQuery)
      );
      if (titleMatches) return category;
      if (matchingQuestions.length > 0) {
        return { ...category, questions: matchingQuestions };
      }
      return null;
    }).filter((c): c is QuestionCategory => c !== null);
  }, [normalizedQuery]);

  const visibleTotal = filtered.reduce((sum, c) => sum + c.questions.length, 0);

  const toggleCategory = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => setOpenIds(new Set(filtered.map((c) => c.id)));
  const collapseAll = () => setOpenIds(new Set());

  const scrollToCategory = (id: string) => {
    setActiveId(id);
    setOpenIds((prev) => new Set(prev).add(id));
    const el = document.getElementById(`category-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Page header */}
      <section className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
            Question Bank &middot; {CATEGORIES.length} categories
          </p>
          <h1 className="font-serif text-4xl leading-tight text-slate-900 sm:text-5xl dark:text-white">
            Interview Question Library
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            {TOTAL_QUESTIONS}+ interview questions covering engineering,
            product, design, data, infrastructure, and behavioral rounds.
            Browse by role, search across every category, and open only the
            sections you need- answers intentionally left out so you
            can prepare your own.
          </p>

          {/* Search */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions or a role, e.g. React, SQL, behavioral..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/20"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-900"
              >
                <LayoutGrid className="h-4 w-4" />
                Expand all
              </button>
              <button
                onClick={collapseAll}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-900"
              >
                <ListChecks className="h-4 w-4" />
                Collapse all
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
            {normalizedQuery
              ? `${visibleTotal} matching question${visibleTotal === 1 ? "" : "s"} in ${filtered.length} categor${filtered.length === 1 ? "y" : "ies"}`
              : `${TOTAL_QUESTIONS} questions across ${CATEGORIES.length} categories`}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[220px_1fr]">
        {/* Category nav */}
        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Jump to
          </p>
          <nav className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`rounded-lg px-3 py-2 text-left text-sm transition lg:w-full ${
                  activeId === category.id
                    ? "bg-teal-600 text-white dark:bg-teal-500 dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
                }`}
              >
                {category.title}
                <span
                  className={`ml-1.5 text-xs ${
                    activeId === category.id
                      ? "text-teal-100 dark:text-slate-900"
                      : "text-slate-400 dark:text-slate-600"
                  }`}
                >
                  {category.questions.length}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Categories + questions */}
        <div className="flex flex-col gap-5">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No questions match &ldquo;{query}&rdquo;. Try a different role
              or keyword.
            </div>
          )}

          {filtered.map((category) => {
            const isOpen = openIds.has(category.id);
            return (
              <section
                id={`category-${category.id}`}
                key={category.id}
                className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <div>
                    <h2 className="font-serif text-xl text-slate-900 dark:text-white">
                      {category.title}
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {category.blurb} &middot; {category.questions.length} questions
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform dark:text-slate-500 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <ol className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
                    {category.questions.map((question, index) => (
                      <li
                        key={index}
                        className="flex gap-3 border-b border-slate-100 py-3 text-sm text-slate-700 last:border-0 dark:border-slate-800/70 dark:text-slate-300"
                      >
                        <span className="mt-0.5 flex h-5 w-6 flex-shrink-0 items-center justify-center font-mono text-xs text-teal-700 dark:text-teal-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-600">
        {TOTAL_QUESTIONS}+ interview questions &middot; Keep Coding, Keep Creating ..❤️..
      </footer>
    </main>
  );
}