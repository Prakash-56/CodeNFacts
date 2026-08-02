// app/category/quizzes/questions.ts
// TODO(backend): This static array is the seed dataset. Long-term, move quizzes into
// Firestore (collection: `quizzes`, doc-per-quiz, subcollection `questions`) so the
// library can grow past this file without a redeploy. The AI Tutor's Gemini route
// (`/api/ai-tutor`) can be reused / cloned into `/api/generate-quiz` to bulk-author
// new quizzes in this exact shape — see the generator prompt at the bottom of this file.

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  questions: QuizQuestion[];
}

export interface CheatSheet {
  id: string;
  title: string;
  category: string;
  points: string[];
}

export const CATEGORIES = [
  "DSA",
  "Frontend",
  "Backend",
  "AI/ML",
  "DevOps",
  "Databases",
] as const;

// ---------------------------------------------------------------------------
// QUIZZES
// Starter set: 8 quizzes x 20 questions = 160 questions.
// To reach 400+ quizzes, append more Quiz objects here (or fetch from Firestore —
// see TODO above). Every quiz must follow this exact shape so the page/scoring/
// review logic below needs zero changes as the library grows.
// ---------------------------------------------------------------------------

export const QUIZZES: Quiz[] = [
  {
    id: "dsa-arrays-strings",
    title: "Arrays & Strings",
    category: "DSA",
    difficulty: "Beginner",
    description: "Indexing, traversal, two-pointers, and common string manipulation patterns.",
    questions: [
      { id: "q1", question: "What is the time complexity of accessing an element by index in an array?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correctIndex: 2, explanation: "Arrays support direct indexed access via a memory offset, making it constant time." },
      { id: "q2", question: "Which technique is most efficient for finding a pair that sums to a target in a sorted array?", options: ["Brute force O(n²)", "Two-pointer O(n)", "Recursion O(2^n)", "Bubble sort first"], correctIndex: 1, explanation: "With a sorted array, moving pointers from both ends narrows the search in linear time." },
      { id: "q3", question: "What does the sliding window technique optimize for?", options: ["Sorting arrays", "Contiguous subarray/substring problems", "Graph traversal", "Tree balancing"], correctIndex: 1, explanation: "Sliding window avoids recomputation by reusing the previous window's state as it slides." },
      { id: "q4", question: "Reversing a string in-place typically uses which approach?", options: ["Two-pointer swap", "Recursion only", "Hash map", "Binary search"], correctIndex: 0, explanation: "Swapping characters from both ends toward the center reverses a string in O(n) with O(1) extra space." },
      { id: "q5", question: "What is the worst-case time complexity of inserting an element at the beginning of an array?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctIndex: 2, explanation: "All existing elements must shift right by one position." },
      { id: "q6", question: "Which data structure would you use to check if a string has all unique characters efficiently?", options: ["Stack", "Set/Hash map", "Linked list", "Queue"], correctIndex: 1, explanation: "A Set gives O(1) average lookup to detect duplicates in a single pass." },
      { id: "q7", question: "What is the time complexity of the brute-force approach to finding all pairs in an array of size n?", options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"], correctIndex: 2, explanation: "Checking every pair requires nested loops, giving n*(n-1)/2 comparisons." },
      { id: "q8", question: "Kadane's Algorithm is used to solve which problem?", options: ["Longest common subsequence", "Maximum subarray sum", "Shortest path", "Binary search"], correctIndex: 1, explanation: "Kadane's tracks the best running sum ending at each index in O(n) time." },
      { id: "q9", question: "What does 'in-place' mean when describing an array algorithm?", options: ["It uses recursion", "It uses O(1) extra space", "It sorts descending", "It only works on strings"], correctIndex: 1, explanation: "In-place algorithms modify the input directly without allocating a significant new data structure." },
      { id: "q10", question: "Which of these is a valid palindrome-check approach for a string?", options: ["Compare with its reverse", "Sort it first", "Hash it twice", "Convert to array of numbers"], correctIndex: 0, explanation: "A string is a palindrome if it equals its own reverse; two-pointer comparison also works in O(n)." },
      { id: "q11", question: "What is the space complexity of creating a reversed copy of an array of size n?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctIndex: 2, explanation: "A new array of the same size must be allocated to hold the copy." },
      { id: "q12", question: "Which method removes duplicates from a sorted array in-place most efficiently?", options: ["Two-pointer overwrite", "Nested loops with splice", "Convert to Set and back only", "Sort again"], correctIndex: 0, explanation: "A slow/fast pointer overwrites duplicates in a single O(n) pass with O(1) space." },
      { id: "q13", question: "What is the time complexity of string concatenation using '+' in a loop, n times, in most languages?", options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"], correctIndex: 2, explanation: "Strings are often immutable, so each concatenation creates a new string, leading to O(n²) total." },
      { id: "q14", question: "Which approach finds the majority element (appearing > n/2 times) in O(n) time and O(1) space?", options: ["Boyer-Moore Voting Algorithm", "Merge sort", "Hash map counting", "Binary search"], correctIndex: 0, explanation: "Boyer-Moore cancels out non-majority votes, leaving the majority candidate." },
      { id: "q15", question: "What is a common use of the 'fast and slow pointer' pattern on arrays/linked lists?", options: ["Sorting", "Cycle detection", "Hashing", "String formatting"], correctIndex: 1, explanation: "If a fast pointer ever meets a slow pointer, a cycle exists (Floyd's algorithm)." },
      { id: "q16", question: "What is the time complexity of binary search on a sorted array?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correctIndex: 1, explanation: "Binary search halves the search space each step." },
      { id: "q17", question: "Which of these correctly describes an anagram check between two strings?", options: ["Same length and same character frequency", "Same first letter", "Same length only", "Reverse of each other"], correctIndex: 0, explanation: "Anagrams contain identical characters with identical counts, just rearranged." },
      { id: "q18", question: "What does prefix sum precompute to answer range-sum queries quickly?", options: ["Cumulative sums up to each index", "Sorted values", "Reversed array", "Character counts"], correctIndex: 0, explanation: "Prefix sums let any range sum be computed in O(1) via subtraction of two prefix values." },
      { id: "q19", question: "Which sorting algorithm is generally used internally by JavaScript's Array.prototype.sort for large arrays (V8)?", options: ["Bubble sort", "TimSort", "Quick sort only", "Insertion sort only"], correctIndex: 1, explanation: "V8 uses TimSort, a hybrid of merge sort and insertion sort, for arrays above a size threshold." },
      { id: "q20", question: "What is the primary trade-off of using extra space (like a hash map) in array/string problems?", options: ["Slower time for less space", "Faster time for more space", "No trade-off exists", "Always both slower and more space"], correctIndex: 1, explanation: "Trading O(n) extra space for a hash map often brings time complexity down from O(n²) to O(n)." },
    ],
  },
  {
    id: "dsa-big-o",
    title: "Big-O & Complexity Analysis",
    category: "DSA",
    difficulty: "Beginner",
    description: "Reasoning about time and space complexity of algorithms.",
    questions: [
      { id: "q1", question: "What does Big-O notation describe?", options: ["Exact runtime in seconds", "Upper bound of growth rate", "Memory address layout", "Number of variables used"], correctIndex: 1, explanation: "Big-O describes how runtime/space scales as input size grows, ignoring constants." },
      { id: "q2", question: "What is the time complexity of a single loop over n elements?", options: ["O(1)", "O(n)", "O(n²)", "O(log n)"], correctIndex: 1, explanation: "A single pass over n elements does n units of work, i.e., linear time." },
      { id: "q3", question: "Two nested loops, each running n times, give what complexity?", options: ["O(n)", "O(2n)", "O(n²)", "O(log n)"], correctIndex: 2, explanation: "Each outer iteration triggers a full inner loop, giving n*n operations." },
      { id: "q4", question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctIndex: 1, explanation: "Each step eliminates half the remaining search space." },
      { id: "q5", question: "Which complexity class grows fastest as n increases?", options: ["O(log n)", "O(n)", "O(n²)", "O(2^n)"], correctIndex: 3, explanation: "Exponential time grows dramatically faster than polynomial or logarithmic complexities." },
      { id: "q6", question: "What is the space complexity of an algorithm that uses a fixed number of variables regardless of input size?", options: ["O(n)", "O(1)", "O(log n)", "O(n²)"], correctIndex: 1, explanation: "Constant extra space doesn't scale with input size." },
      { id: "q7", question: "Merge sort has what time complexity in the average and worst case?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctIndex: 1, explanation: "Merge sort divides the array log n times and merges in O(n) at each level." },
      { id: "q8", question: "What is the time complexity of accessing a value in a hash map on average?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correctIndex: 0, explanation: "Hash maps offer average O(1) lookup via hashing, assuming few collisions." },
      { id: "q9", question: "When analyzing complexity, why do we typically ignore constants (e.g., O(2n) becomes O(n))?", options: ["Constants don't affect correctness", "Big-O measures growth rate, not exact operations", "Constants are always 1", "It's a coding convention only"], correctIndex: 1, explanation: "Big-O captures asymptotic growth trends, so constant factors become negligible as n grows large." },
      { id: "q10", question: "What is the time complexity of quicksort in the worst case?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], correctIndex: 2, explanation: "Worst case occurs with poor pivot choices (e.g., already sorted data), causing unbalanced partitions." },
      { id: "q11", question: "Which best describes O(n log n)?", options: ["Linear time only", "n times log n operations, common in efficient sorts", "Constant time", "Exponential time"], correctIndex: 1, explanation: "Efficient comparison-based sorts like merge sort and heap sort run in O(n log n)." },
      { id: "q12", question: "What does 'amortized O(1)' mean, e.g., for dynamic array push operations?", options: ["Always exactly O(1)", "On average O(1) over a sequence of operations, even if occasional ops are slower", "Always O(n)", "Only true for the first operation"], correctIndex: 1, explanation: "Occasional resizing costs O(n), but spread across many pushes the average cost is O(1)." },
      { id: "q13", question: "What is the time complexity of traversing a balanced binary search tree to visit every node?", options: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"], correctIndex: 1, explanation: "Visiting every node requires touching each of the n nodes exactly once." },
      { id: "q14", question: "Which best practice helps reduce time complexity from O(n²) to O(n) in many 'find pair/duplicate' problems?", options: ["Using nested loops", "Using a hash set for O(1) lookups", "Sorting only", "Recursion"], correctIndex: 1, explanation: "A hash set trades space for time, replacing an inner loop scan with O(1) lookups." },
      { id: "q15", question: "What is the space complexity of recursive Fibonacci without memoization, considering the call stack?", options: ["O(1)", "O(n)", "O(2^n)", "O(log n)"], correctIndex: 1, explanation: "The maximum call stack depth is n, even though the number of calls is exponential." },
      { id: "q16", question: "Which is generally true about O(log n) algorithms?", options: ["They examine every element", "They repeatedly divide the problem size, e.g., binary search", "They are always slower than O(n)", "They require sorting first always"], correctIndex: 1, explanation: "O(log n) algorithms shrink the problem by a constant factor each step." },
      { id: "q17", question: "What is the best-case time complexity of bubble sort on an already sorted array (with early-exit optimization)?", options: ["O(1)", "O(n)", "O(n²)", "O(n log n)"], correctIndex: 1, explanation: "With an early-exit flag, one pass confirms no swaps are needed, giving O(n)." },
      { id: "q18", question: "Why is Big-O called an 'upper bound'?", options: ["It's the fastest possible time", "It describes the worst the algorithm will perform as n grows", "It's always exact", "It only applies to sorting"], correctIndex: 1, explanation: "Big-O bounds the growth from above, guaranteeing performance won't be worse than that rate." },
      { id: "q19", question: "What complexity class does linear search fall under?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctIndex: 2, explanation: "In the worst case, every element must be checked once." },
      { id: "q20", question: "Which factor does Big-O notation deliberately ignore?", options: ["The dominant term", "Lower-order terms and constant factors", "Whether the algorithm terminates", "The input size"], correctIndex: 1, explanation: "Big-O keeps only the fastest-growing term and drops constants/lower-order terms." },
    ],
  },
  {
    id: "frontend-react-fundamentals",
    title: "React Fundamentals",
    category: "Frontend",
    difficulty: "Beginner",
    description: "Components, hooks, props, state, and the rendering lifecycle.",
    questions: [
      { id: "q1", question: "What hook is used to add local state to a functional component?", options: ["useEffect", "useState", "useRef", "useMemo"], correctIndex: 1, explanation: "useState returns a state value and a setter function." },
      { id: "q2", question: "When does useEffect with an empty dependency array run?", options: ["On every render", "Only once, after the first render", "Never", "Only on unmount"], correctIndex: 1, explanation: "An empty array means the effect has no dependencies, so it only runs after the initial mount." },
      { id: "q3", question: "What are props in React?", options: ["Internal component state", "Read-only data passed from parent to child", "CSS style objects", "Global variables"], correctIndex: 1, explanation: "Props flow one-way from parent to child and should not be mutated by the child." },
      { id: "q4", question: "What does React's virtual DOM primarily optimize?", options: ["Network requests", "Minimizing real DOM updates via diffing", "CSS parsing", "Database queries"], correctIndex: 1, explanation: "React diffs virtual DOM trees to compute the minimal set of real DOM mutations needed." },
      { id: "q5", question: "Which hook memoizes a computed value to avoid recalculating on every render?", options: ["useCallback", "useMemo", "useState", "useContext"], correctIndex: 1, explanation: "useMemo recomputes a value only when its dependencies change." },
      { id: "q6", question: "What is the correct way to update state based on the previous state safely?", options: ["setState(state + 1)", "setState(prev => prev + 1)", "state = state + 1", "useEffect(() => state + 1)"], correctIndex: 1, explanation: "The functional updater form avoids stale-state bugs when updates are batched or async." },
      { id: "q7", question: "What does the 'key' prop help React do when rendering lists?", options: ["Style list items", "Identify which items changed, were added, or removed", "Sort the list", "Fetch data faster"], correctIndex: 1, explanation: "Keys give React a stable identity per item so it can efficiently reconcile list changes." },
      { id: "q8", question: "Which hook lets you access a DOM node directly?", options: ["useRef", "useState", "useEffect", "useReducer"], correctIndex: 0, explanation: "useRef returns a mutable object whose .current can point to a DOM element." },
      { id: "q9", question: "What is 'lifting state up' in React?", options: ["Moving shared state to the closest common ancestor", "Using Redux", "Moving state into useEffect", "Removing all state"], correctIndex: 0, explanation: "Lifting state up lets sibling components share and stay in sync via a common parent." },
      { id: "q10", question: "What does React Context primarily solve?", options: ["Prop drilling across many component layers", "Styling components", "Routing", "API caching"], correctIndex: 0, explanation: "Context lets deeply nested components read shared data without passing props at every level." },
      { id: "q11", question: "In useEffect, what does the returned function do?", options: ["Nothing, it's ignored", "Acts as a cleanup function before the next effect or unmount", "Re-renders the component", "Cancels all hooks"], correctIndex: 1, explanation: "The cleanup function runs before the effect re-runs or when the component unmounts." },
      { id: "q12", question: "Which of these is NOT a rule of hooks?", options: ["Only call hooks at the top level", "Only call hooks from React functions", "Hooks can be called conditionally inside loops", "Hook order must stay consistent across renders"], correctIndex: 2, explanation: "Calling hooks conditionally breaks React's internal call-order tracking." },
      { id: "q13", question: "What does useCallback return?", options: ["A memoized value", "A memoized function reference", "A ref object", "A context provider"], correctIndex: 1, explanation: "useCallback memoizes a function so child components relying on referential equality don't re-render unnecessarily." },
      { id: "q14", question: "What triggers a React component to re-render?", options: ["Only page reload", "State or props changing (or parent re-rendering)", "Only CSS changes", "Only mouse events"], correctIndex: 1, explanation: "React re-renders when its own state/props change or when its parent re-renders." },
      { id: "q15", question: "What is the purpose of React.memo?", options: ["Prevent re-render if props haven't changed", "Fetch data", "Style components", "Manage routing"], correctIndex: 0, explanation: "React.memo does a shallow prop comparison and skips re-rendering if nothing changed." },
      { id: "q16", question: "Which statement about controlled components is correct?", options: ["The DOM manages the input's value", "React state is the single source of truth for the input's value", "They can't use onChange", "They only work with checkboxes"], correctIndex: 1, explanation: "In a controlled component, the input's value is driven by React state and updated via onChange." },
      { id: "q17", question: "What does useReducer help manage compared to useState?", options: ["Simple booleans only", "Complex state logic with multiple sub-values or transitions", "CSS animations", "Network requests"], correctIndex: 1, explanation: "useReducer centralizes state transitions in a reducer function, useful for complex state shapes." },
      { id: "q18", question: "What happens if you call a hook inside an if statement?", options: ["Nothing, it works fine", "It may break hook order and cause bugs/warnings", "It automatically becomes memoized", "It throws a compile-time error only"], correctIndex: 1, explanation: "React relies on consistent call order between renders; conditional hooks violate that." },
      { id: "q19", question: "What is JSX?", options: ["A new programming language", "Syntax extension that lets you write HTML-like code in JavaScript", "A CSS preprocessor", "A build tool"], correctIndex: 1, explanation: "JSX compiles down to React.createElement calls, allowing declarative UI markup in JS." },
      { id: "q20", question: "Which hook is best for synchronizing a component with an external system (subscriptions, timers, fetches)?", options: ["useState", "useEffect", "useMemo", "useId"], correctIndex: 1, explanation: "useEffect is designed for side effects that synchronize with systems outside React." },
    ],
  },
  {
    id: "frontend-css-layout",
    title: "CSS & Layout",
    category: "Frontend",
    difficulty: "Beginner",
    description: "Box model, Flexbox, Grid, positioning, and responsive design.",
    questions: [
      { id: "q1", question: "In the standard CSS box model, what does 'box-sizing: border-box' include in the declared width?", options: ["Only content", "Content + padding + border", "Only padding", "Content + margin"], correctIndex: 1, explanation: "border-box makes width/height include padding and border, not just content." },
      { id: "q2", question: "Which display value enables Flexbox layout on a container?", options: ["display: block", "display: flex", "display: grid", "display: inline"], correctIndex: 1, explanation: "display: flex turns the element into a flex container for its direct children." },
      { id: "q3", question: "What does 'justify-content' control in a flex container?", options: ["Alignment along the cross axis", "Alignment along the main axis", "Font size", "Border color"], correctIndex: 1, explanation: "justify-content distributes space along the main axis (row by default)." },
      { id: "q4", question: "What does 'align-items' control in a flex container?", options: ["Main axis alignment", "Cross axis alignment", "Text color", "Grid columns"], correctIndex: 1, explanation: "align-items positions flex items along the cross axis (perpendicular to main axis)." },
      { id: "q5", question: "Which CSS Grid property defines the number and size of columns?", options: ["grid-template-columns", "grid-gap", "grid-area", "justify-items"], correctIndex: 0, explanation: "grid-template-columns explicitly sizes each column track." },
      { id: "q6", question: "What is the effect of 'position: absolute' on an element?", options: ["It stays in normal document flow", "It's removed from flow and positioned relative to nearest positioned ancestor", "It always centers the element", "It only works inside flex containers"], correctIndex: 1, explanation: "Absolutely positioned elements are taken out of flow and positioned relative to the nearest ancestor with position other than static." },
      { id: "q7", question: "What does 'position: sticky' do?", options: ["Always fixed to viewport", "Behaves like relative until a scroll threshold, then sticks like fixed", "Removes the element from flow permanently", "Only works on images"], correctIndex: 1, explanation: "Sticky toggles between relative and fixed behavior based on scroll position within its container." },
      { id: "q8", question: "Which unit is relative to the root element's font size?", options: ["em", "rem", "px", "vh"], correctIndex: 1, explanation: "rem stands for 'root em' and scales with the html element's font-size." },
      { id: "q9", question: "What is the primary purpose of a CSS media query?", options: ["Load images faster", "Apply styles conditionally based on viewport/device characteristics", "Add animations", "Import fonts"], correctIndex: 1, explanation: "Media queries let you apply different styles for different screen sizes, orientations, or preferences (e.g., dark mode)." },
      { id: "q10", question: "In Flexbox, what does 'flex: 1' shorthand typically set?", options: ["flex-grow: 1, flex-shrink: 1, flex-basis: 0%", "Only flex-grow", "Only width", "margin: 1px"], correctIndex: 0, explanation: "flex: 1 is shorthand allowing the item to grow and shrink, starting from a basis of 0." },
      { id: "q11", question: "What does 'z-index' control?", options: ["Horizontal position", "Stacking order along the z-axis", "Font weight", "Grid row count"], correctIndex: 1, explanation: "Higher z-index values render on top of lower ones for positioned elements." },
      { id: "q12", question: "Which pseudo-class targets an element on mouse hover?", options: [":focus", ":hover", ":active", ":visited"], correctIndex: 1, explanation: ":hover applies styles while the pointer is over the element." },
      { id: "q13", question: "What is the difference between 'inline' and 'inline-block' display?", options: ["No difference", "inline-block respects width/height and vertical margins, inline does not", "inline-block can't contain text", "inline is only for images"], correctIndex: 1, explanation: "inline-block behaves like inline for flow but allows box model properties like width/height." },
      { id: "q14", question: "Which CSS feature lets you define reusable custom values, e.g., '--accent-color'?", options: ["CSS variables (custom properties)", "@media", "@import", "!important"], correctIndex: 0, explanation: "Custom properties (--name) can be defined once and reused/overridden via var(--name), ideal for theming light/dark mode." },
      { id: "q15", question: "What does 'prefers-color-scheme' media feature detect?", options: ["Browser language", "User's OS-level light/dark mode preference", "Screen resolution", "Internet speed"], correctIndex: 1, explanation: "It lets a site respond to whether the user's system is set to light or dark mode." },
      { id: "q16", question: "Which layout is best suited for a two-dimensional grid of cards with rows and columns?", options: ["Flexbox only", "CSS Grid", "Floats", "Tables only"], correctIndex: 1, explanation: "CSS Grid is designed for two-dimensional layouts (rows and columns simultaneously)." },
      { id: "q17", question: "What does the 'gap' property do in Flexbox/Grid?", options: ["Sets font spacing", "Adds space between flex/grid items without needing margins", "Changes color", "Sets border radius"], correctIndex: 1, explanation: "gap creates consistent spacing between items without margin collapsing issues." },
      { id: "q18", question: "Which selector has higher specificity: a class or an ID?", options: ["Class", "ID", "They're equal", "Depends on order only"], correctIndex: 1, explanation: "ID selectors (#id) have higher specificity than class selectors (.class)." },
      { id: "q19", question: "What does 'overflow: hidden' do to content that exceeds its container?", options: ["Adds a scrollbar", "Clips the overflowing content", "Shrinks the font", "Wraps text automatically"], correctIndex: 1, explanation: "overflow: hidden clips any content beyond the element's box without adding scrollbars." },
      { id: "q20", question: "Why are CSS custom properties (variables) preferred over JS-driven theme toggles for light/dark mode?", options: ["They require a build step", "They let the browser handle re-styling natively via class/attribute toggles, no re-render needed", "They only work in Safari", "They can't be scoped"], correctIndex: 1, explanation: "Toggling a class (e.g., .dark) and letting CSS variables cascade avoids JS re-renders purely for theming." },
    ],
  },
  {
    id: "backend-node-rest",
    title: "Node.js & REST APIs",
    category: "Backend",
    difficulty: "Intermediate",
    description: "Express routing, middleware, HTTP methods, and API design.",
    questions: [
      { id: "q1", question: "What is Node.js primarily built on?", options: ["Chrome's V8 JavaScript engine", "Java Virtual Machine", "Python interpreter", "PHP engine"], correctIndex: 0, explanation: "Node.js embeds V8 to run JavaScript outside the browser." },
      { id: "q2", question: "In Express, what does middleware do?", options: ["Only handles errors", "Functions that run during the request-response cycle, with access to req/res/next", "Only serves static files", "Replaces routing entirely"], correctIndex: 1, explanation: "Middleware can modify req/res, end the cycle, or call next() to pass control along." },
      { id: "q3", question: "Which HTTP method is idempotent and used to fully replace a resource?", options: ["POST", "PUT", "PATCH", "GET"], correctIndex: 1, explanation: "PUT replaces the entire resource and calling it multiple times has the same effect as calling it once." },
      { id: "q4", question: "Which HTTP status code indicates a successful resource creation?", options: ["200", "201", "204", "301"], correctIndex: 1, explanation: "201 Created signals that a new resource was successfully created, often with a Location header." },
      { id: "q5", question: "What does the Node.js event loop enable?", options: ["Multi-threaded blocking I/O", "Non-blocking, asynchronous I/O on a single thread", "Synchronous file reads only", "Direct GPU access"], correctIndex: 1, explanation: "The event loop lets Node.js handle many concurrent operations without blocking the main thread." },
      { id: "q6", question: "What does REST stand for?", options: ["Rapid End State Transfer", "Representational State Transfer", "Remote Execution State Transfer", "Resource State Transaction"], correctIndex: 1, explanation: "REST is an architectural style where resources are represented and transferred via standard HTTP verbs." },
      { id: "q7", question: "Which HTTP status code means 'Unauthorized'?", options: ["400", "401", "403", "404"], correctIndex: 1, explanation: "401 means authentication is required or has failed; 403 means authenticated but forbidden." },
      { id: "q8", question: "In Express, what does app.use() typically register?", options: ["A database connection", "Middleware for all or specific routes", "An environment variable", "A test runner"], correctIndex: 1, explanation: "app.use() mounts middleware functions that execute for matching requests." },
      { id: "q9", question: "What is the purpose of environment variables like GMAIL_APP_PASSWORD in a Node/Express app?", options: ["Speed up the server", "Keep secrets out of source code, injected at runtime", "Style the frontend", "Cache database queries"], correctIndex: 1, explanation: "Env vars keep credentials out of version control while remaining accessible to the running process." },
      { id: "q10", question: "Which method is generally used for partial updates to a resource?", options: ["GET", "PUT", "PATCH", "DELETE"], correctIndex: 2, explanation: "PATCH applies a partial modification, unlike PUT which replaces the whole resource." },
      { id: "q11", question: "What does 'CORS' stand for and protect against?", options: ["Cross-Origin Resource Sharing, controls which origins can access an API", "A database indexing method", "A caching strategy", "A logging framework"], correctIndex: 0, explanation: "CORS headers let a server explicitly allow or restrict cross-origin browser requests." },
      { id: "q12", question: "What is a rate limiter used for in an API, like a contact form endpoint?", options: ["Speed up responses", "Prevent abuse by capping requests per client in a time window", "Compress responses", "Cache static files"], correctIndex: 1, explanation: "Rate limiting protects endpoints (e.g., contact/signup) from spam or brute-force abuse." },
      { id: "q13", question: "Why might an in-memory rate limiter be flagged as unsuitable for production at scale?", options: ["It's too fast", "It doesn't persist or share state across multiple server instances", "It uses too much CPU", "It can't count requests"], correctIndex: 1, explanation: "In-memory state resets on restart and isn't shared across horizontally scaled instances — hence needing Redis/Firestore." },
      { id: "q14", question: "What does async/await primarily improve over raw Promise chains?", options: ["Performance only", "Readability of asynchronous code", "Security", "Bundle size"], correctIndex: 1, explanation: "async/await lets asynchronous code read like synchronous code, improving clarity." },
      { id: "q15", question: "What HTTP status code range generally indicates client errors?", options: ["1xx", "2xx", "4xx", "5xx"], correctIndex: 2, explanation: "4xx codes (400-499) indicate the client made an invalid request; 5xx indicates server errors." },
      { id: "q16", question: "In a typical Express app, what does next() do inside middleware?", options: ["Ends the response immediately", "Passes control to the next middleware/route handler", "Restarts the server", "Deletes the request object"], correctIndex: 1, explanation: "Calling next() hands off control to the next matching middleware or route." },
      { id: "q17", question: "Which package would you typically use to send transactional emails via Gmail SMTP from Node.js?", options: ["Nodemailer", "Express", "Mongoose", "Axios"], correctIndex: 0, explanation: "Nodemailer is the standard library for sending emails from Node.js, including via Gmail SMTP." },
      { id: "q18", question: "What is the benefit of using createRequire for a CommonJS-only package (like pdf-parse) in a Next.js ESM context?", options: ["It improves styling", "It lets you import CJS modules that don't support native ESM import syntax cleanly", "It compresses the bundle", "It adds TypeScript types automatically"], correctIndex: 1, explanation: "createRequire bridges CJS-only packages into ESM/Next.js server code that expects import syntax." },
      { id: "q19", question: "What does 'serverExternalPackages' in next.config.js typically do?", options: ["Excludes specified packages from Next.js's server bundling, using native Node resolution instead", "Adds packages to the client bundle", "Enables TypeScript strict mode", "Sets environment variables"], correctIndex: 0, explanation: "It tells Next.js to leave certain packages external to its own bundler, avoiding bundling issues with native/CJS-only libs." },
      { id: "q20", question: "Which is a RESTful way to design an endpoint to fetch a single user by ID?", options: ["/getUser?id=5", "/users/5 with GET", "/user/fetch/5", "/api?action=getUser&id=5"], correctIndex: 1, explanation: "RESTful design uses nouns and HTTP verbs: GET /users/5 fetches a specific user resource." },
    ],
  },
  {
    id: "aiml-basics",
    title: "Machine Learning Basics",
    category: "AI/ML",
    difficulty: "Beginner",
    description: "Core ML concepts: supervised/unsupervised learning, overfitting, and evaluation.",
    questions: [
      { id: "q1", question: "What distinguishes supervised learning from unsupervised learning?", options: ["Supervised uses labeled data, unsupervised does not", "Unsupervised is always faster", "Supervised only works on images", "There's no difference"], correctIndex: 0, explanation: "Supervised learning trains on input-output pairs; unsupervised learning finds structure in unlabeled data." },
      { id: "q2", question: "What is overfitting?", options: ["The model performs well on training data but poorly on unseen data", "The model is too simple to learn patterns", "The model trains too fast", "The dataset is too large"], correctIndex: 0, explanation: "Overfitting happens when a model memorizes training data noise instead of generalizing." },
      { id: "q3", question: "Which technique helps reduce overfitting?", options: ["Adding more parameters only", "Regularization (e.g., L1/L2, dropout)", "Removing all training data", "Increasing learning rate indefinitely"], correctIndex: 1, explanation: "Regularization penalizes model complexity, discouraging over-reliance on noisy patterns." },
      { id: "q4", question: "What is a loss function used for?", options: ["Measuring how far predictions are from actual values, guiding optimization", "Storing the dataset", "Visualizing data", "Cleaning missing values"], correctIndex: 0, explanation: "The loss function quantifies prediction error, which the optimizer minimizes during training." },
      { id: "q5", question: "What does 'gradient descent' do?", options: ["Randomly guesses parameters", "Iteratively adjusts parameters to minimize the loss function", "Sorts training data", "Removes outliers automatically"], correctIndex: 1, explanation: "Gradient descent updates parameters in the direction that reduces loss, based on the gradient." },
      { id: "q6", question: "What is a training/validation/test split used for?", options: ["Speeding up training only", "Evaluating generalization while tuning and testing fairly", "Compressing the dataset", "Only for images"], correctIndex: 1, explanation: "Splitting data prevents evaluating a model on the same data it was trained/tuned on, avoiding optimistic bias." },
      { id: "q7", question: "What is a confusion matrix used to evaluate?", options: ["Regression error", "Classification performance across classes (TP, FP, TN, FN)", "Training speed", "Data cleaning quality"], correctIndex: 1, explanation: "It breaks down predictions vs actual labels into true/false positives/negatives." },
      { id: "q8", question: "What does 'precision' measure in classification?", options: ["Of predicted positives, how many were actually positive", "Of actual positives, how many were predicted correctly", "Overall accuracy", "Training time"], correctIndex: 0, explanation: "Precision = TP / (TP + FP), focusing on the correctness of positive predictions." },
      { id: "q9", question: "What does 'recall' measure in classification?", options: ["Of actual positives, how many were correctly identified", "Of predicted positives, how many were correct", "Model size", "Training data volume"], correctIndex: 0, explanation: "Recall = TP / (TP + FN), focusing on how many actual positives were captured." },
      { id: "q10", question: "What is 'feature engineering'?", options: ["Building the model architecture", "Creating/transforming input variables to improve model performance", "Deploying the model", "Cleaning the GPU cache"], correctIndex: 1, explanation: "Feature engineering shapes raw data into more informative inputs for the model." },
      { id: "q11", question: "Which algorithm is a common baseline for binary classification?", options: ["Logistic regression", "K-means clustering", "PCA", "DBSCAN"], correctIndex: 0, explanation: "Logistic regression models the probability of a binary outcome and is a standard simple baseline." },
      { id: "q12", question: "What is the purpose of a learning rate in gradient descent?", options: ["Controls the step size of each parameter update", "Sets the number of training examples", "Determines the loss function", "Chooses which features to use"], correctIndex: 0, explanation: "A learning rate that's too high can overshoot minima; too low can make training very slow." },
      { id: "q13", question: "What does 'underfitting' mean?", options: ["Model is too complex", "Model is too simple to capture underlying patterns, performing poorly even on training data", "Model has zero error", "Dataset has too many features"], correctIndex: 1, explanation: "Underfitting occurs when a model lacks the capacity to learn the underlying trend." },
      { id: "q14", question: "What is k-means clustering primarily used for?", options: ["Supervised classification", "Grouping unlabeled data into k clusters based on similarity", "Text generation", "Image compression only"], correctIndex: 1, explanation: "K-means partitions data into k groups by minimizing within-cluster variance, an unsupervised technique." },
      { id: "q15", question: "What does 'one-hot encoding' do?", options: ["Compresses numerical data", "Converts categorical variables into binary vector representations", "Normalizes pixel values", "Removes duplicate rows"], correctIndex: 1, explanation: "One-hot encoding represents each category as a binary vector with a single 1, avoiding false ordinal relationships." },
      { id: "q16", question: "What is cross-validation used for?", options: ["Speeding up inference", "More robust performance estimation by training/testing on different data splits", "Reducing dataset size", "Visualizing embeddings"], correctIndex: 1, explanation: "K-fold cross-validation averages performance across multiple splits, reducing variance in the estimate." },
      { id: "q17", question: "What is the main difference between a parameter and a hyperparameter?", options: ["Parameters are learned from data; hyperparameters are set before training", "They are the same thing", "Hyperparameters are learned; parameters are fixed", "Parameters only exist in deep learning"], correctIndex: 0, explanation: "Hyperparameters (like learning rate) configure the training process itself, not learned via gradient descent." },
      { id: "q18", question: "What does 'accuracy' fail to capture well on an imbalanced dataset?", options: ["Nothing, it's always sufficient", "How well the minority class is predicted, since majority-class predictions dominate the score", "Training time", "Feature count"], correctIndex: 1, explanation: "On imbalanced data, a model predicting only the majority class can have high accuracy but be useless for the minority class." },
      { id: "q19", question: "What is 'transfer learning'?", options: ["Training from scratch every time", "Reusing a pretrained model's learned features for a new, related task", "Manually copying weights by hand", "A data cleaning technique"], correctIndex: 1, explanation: "Transfer learning leverages knowledge from a model trained on one task/dataset to speed up learning on another." },
      { id: "q20", question: "In the context of an AI tutor calling an LLM API, what does a 'system prompt' typically define?", options: ["The user's question", "The model's role, behavior, and constraints for the conversation", "The API key", "The response's HTTP status code"], correctIndex: 1, explanation: "A system prompt sets context and instructions that shape how the model responds throughout the session." },
    ],
  },
  {
    id: "devops-docker-git",
    title: "Docker & Git Workflows",
    category: "DevOps",
    difficulty: "Intermediate",
    description: "Containers, images, branching strategies, and CI/CD fundamentals.",
    questions: [
      { id: "q1", question: "What is the difference between a Docker image and a container?", options: ["No difference", "An image is a blueprint; a container is a running instance of that image", "A container is bigger than an image", "Images can't be shared"], correctIndex: 1, explanation: "You build an image once, then run any number of containers from it." },
      { id: "q2", question: "What does a Dockerfile's FROM instruction do?", options: ["Deletes the image", "Specifies the base image to build from", "Runs a shell command", "Sets an environment variable only"], correctIndex: 1, explanation: "FROM defines the starting point/base layer for the new image." },
      { id: "q3", question: "What is the purpose of a .dockerignore file?", options: ["Speeds up the container's runtime", "Excludes files/folders from being sent to the Docker build context", "Stores secrets safely", "Defines container networking"], correctIndex: 1, explanation: "It works like .gitignore, keeping unnecessary files (like node_modules) out of the build context." },
      { id: "q4", question: "In Git, what does 'git rebase' do differently from 'git merge'?", options: ["Rebase rewrites commit history onto a new base; merge creates a merge commit preserving history", "They are identical", "Rebase deletes branches", "Merge is only for remote repos"], correctIndex: 0, explanation: "Rebase replays commits on top of another base, producing linear history, while merge preserves both histories with a merge commit." },
      { id: "q5", question: "What is a common Git branching strategy where 'main' is always production-ready and features branch off and merge back via PRs?", options: ["Trunk-based/feature-branch workflow", "No branching at all", "Random commits to main", "Only tag-based releases"], correctIndex: 0, explanation: "Feature branches isolate work and merge into main via reviewed pull requests, keeping main deployable." },
      { id: "q6", question: "What does 'git stash' do?", options: ["Permanently deletes uncommitted changes", "Temporarily shelves uncommitted changes so you can switch branches cleanly", "Pushes changes to remote", "Creates a new branch"], correctIndex: 1, explanation: "Stash saves your working directory changes without committing, restorable later with git stash pop." },
      { id: "q7", question: "What is a CI/CD pipeline primarily responsible for?", options: ["Writing code automatically", "Automating build, test, and deployment steps on code changes", "Designing UI", "Managing DNS records"], correctIndex: 1, explanation: "CI/CD automates the path from a code push to tested, deployed software." },
      { id: "q8", question: "What does 'docker-compose' help manage?", options: ["A single container only", "Multi-container applications defined declaratively in one file", "Only networking", "Only volumes"], correctIndex: 1, explanation: "docker-compose.yml defines multiple services (e.g., app + database) and their relationships, started together." },
      { id: "q9", question: "What is the purpose of a Docker volume?", options: ["Speed up image builds", "Persist data outside the container's writable layer so it survives container removal", "Increase CPU allocation", "Compress the image"], correctIndex: 1, explanation: "Volumes decouple data lifecycle from the container lifecycle, useful for databases and uploads." },
      { id: "q10", question: "What does 'git cherry-pick' do?", options: ["Deletes a commit", "Applies a specific commit from one branch onto another", "Merges all branches", "Resets to the last commit"], correctIndex: 1, explanation: "Cherry-pick copies a single commit's changes onto the current branch without merging the whole branch." },
      { id: "q11", question: "In a CI pipeline, what is a 'build artifact'?", options: ["The source code before compilation", "The packaged output of a build step (e.g., a binary, image, or bundle) used in later stages", "A test report only", "A commit message"], correctIndex: 1, explanation: "Artifacts are the tangible outputs (like a Docker image or compiled bundle) passed between pipeline stages." },
      { id: "q12", question: "What does 'git reset --hard' do?", options: ["Only unstages files", "Moves HEAD and discards changes in the working directory and index", "Creates a backup branch automatically", "Pushes changes to remote"], correctIndex: 1, explanation: "This is a destructive operation that discards uncommitted changes, so it should be used carefully." },
      { id: "q13", question: "Why are multi-stage builds used in Dockerfiles?", options: ["To slow down builds intentionally", "To keep the final image small by discarding build-only dependencies", "To run multiple containers at once", "To avoid using a base image"], correctIndex: 1, explanation: "Multi-stage builds compile/build in one stage and copy only the needed output into a lean final image." },
      { id: "q14", question: "What is the purpose of environment-specific config (e.g., .env.production vs .env.development)?", options: ["Slow down deployment", "Let the same codebase behave correctly across different environments without code changes", "Increase bundle size", "Replace version control"], correctIndex: 1, explanation: "Environment configs isolate secrets/URLs per environment while keeping the application code identical." },
      { id: "q15", question: "What does 'git fetch' do differently from 'git pull'?", options: ["fetch downloads remote changes without merging; pull fetches and merges", "They are identical", "fetch deletes local branches", "pull only works on tags"], correctIndex: 0, explanation: "git pull is effectively git fetch + git merge (or rebase), while fetch alone just updates remote-tracking branches." },
      { id: "q16", question: "What is a 'health check' in a container orchestration context (e.g., Docker/Kubernetes)?", options: ["A billing report", "A periodic probe verifying a container/service is running correctly, used to restart/reroute if it fails", "A security scan of source code", "A Git commit hook"], correctIndex: 1, explanation: "Health checks let orchestrators detect and recover from unhealthy containers automatically." },
      { id: "q17", question: "What does EXPOSE do in a Dockerfile?", options: ["Publishes the port to the host automatically", "Documents which port the container listens on (host publishing still needs -p at runtime)", "Deletes the container after use", "Sets the container's IP address"], correctIndex: 1, explanation: "EXPOSE is documentation/metadata; actual host port mapping happens via the -p flag or compose ports config." },
      { id: "q18", question: "What is the benefit of tagging Docker images with versions (e.g., app:1.2.0) instead of always using 'latest'?", options: ["No benefit", "Reproducible, traceable deployments and easy rollbacks", "Smaller image size", "Faster builds only"], correctIndex: 1, explanation: "Versioned tags let you know exactly what's running and roll back reliably if something breaks." },
      { id: "q19", question: "What does '.gitignore' do?", options: ["Deletes files from history", "Tells Git which files/folders to not track (e.g., node_modules, .env)", "Speeds up commits only", "Encrypts secrets"], correctIndex: 1, explanation: "It prevents specified files from being staged/committed, keeping secrets and build artifacts out of version control." },
      { id: "q20", question: "In a typical CI/CD flow for a Next.js app, what commonly happens on a pull request before merge?", options: ["Nothing is checked", "Automated lint/type-check/test/build steps run to catch issues before merging", "The production database is wiped", "Only manual review with no automation"], correctIndex: 1, explanation: "PR checks (lint, type-check, tests, preview build) catch regressions before code reaches main/production." },
    ],
  },
  {
    id: "db-sql-fundamentals",
    title: "SQL Fundamentals",
    category: "Databases",
    difficulty: "Beginner",
    description: "Queries, joins, keys, normalization, and indexing.",
    questions: [
      { id: "q1", question: "What does a PRIMARY KEY constraint guarantee?", options: ["Values can repeat", "Uniqueness and non-null for the column(s)", "Automatic indexing of all columns", "Foreign key relationships"], correctIndex: 1, explanation: "A primary key uniquely identifies each row and cannot contain NULLs." },
      { id: "q2", question: "What does an INNER JOIN return?", options: ["All rows from both tables regardless of match", "Only rows with matching values in both tables", "Only unmatched rows", "A random subset"], correctIndex: 1, explanation: "INNER JOIN returns rows where the join condition matches in both tables." },
      { id: "q3", question: "What does a LEFT JOIN return that an INNER JOIN does not?", options: ["Only matching rows", "All rows from the left table, with NULLs for unmatched right-table columns", "Only right-table rows", "Duplicate rows only"], correctIndex: 1, explanation: "LEFT JOIN preserves every row from the left table even if there's no match on the right." },
      { id: "q4", question: "What is the purpose of a FOREIGN KEY?", options: ["Speeds up all queries", "Enforces a referential link between a column and another table's primary key", "Encrypts data", "Removes duplicate rows automatically"], correctIndex: 1, explanation: "Foreign keys maintain referential integrity between related tables." },
      { id: "q5", question: "What does the SQL GROUP BY clause do?", options: ["Sorts results alphabetically", "Groups rows sharing a value so aggregate functions can be applied per group", "Deletes duplicate tables", "Joins two tables"], correctIndex: 1, explanation: "GROUP BY is typically paired with aggregates like COUNT, SUM, or AVG per group." },
      { id: "q6", question: "What is database normalization primarily aimed at reducing?", options: ["Query speed", "Data redundancy and update anomalies", "Number of tables", "Storage cost only"], correctIndex: 1, explanation: "Normalization organizes data to minimize redundancy and maintain consistency." },
      { id: "q7", question: "What does an index do in a database?", options: ["Slows down reads but speeds writes", "Speeds up read/lookup queries at some cost to write performance and storage", "Encrypts the table", "Removes the need for primary keys"], correctIndex: 1, explanation: "Indexes create a fast lookup structure, trading extra storage and slightly slower writes for faster reads." },
      { id: "q8", question: "What is the difference between WHERE and HAVING?", options: ["No difference", "WHERE filters rows before grouping; HAVING filters groups after aggregation", "HAVING filters rows before grouping", "WHERE only works with JOINs"], correctIndex: 1, explanation: "HAVING is used to filter aggregated results, since WHERE runs before GROUP BY is applied." },
      { id: "q9", question: "What does a UNIQUE constraint enforce?", options: ["Allows duplicate values", "No two rows can have the same value in that column (NULLs may still be allowed depending on the DB)", "Only applies to primary keys", "Forces alphabetical order"], correctIndex: 1, explanation: "UNIQUE ensures column values don't repeat, distinct from PRIMARY KEY which also disallows NULL." },
      { id: "q10", question: "What is a transaction in SQL?", options: ["A single SELECT statement", "A sequence of operations executed as a single all-or-nothing unit (ACID)", "A backup process", "A type of index"], correctIndex: 1, explanation: "Transactions ensure a group of operations either all succeed (commit) or all fail (rollback)." },
      { id: "q11", question: "What does the 'A' in ACID stand for?", options: ["Availability", "Atomicity", "Aggregation", "Authentication"], correctIndex: 1, explanation: "Atomicity guarantees a transaction is all-or-nothing." },
      { id: "q12", question: "What SQL clause limits the number of rows returned?", options: ["LIMIT", "FILTER", "TOP ONLY", "MAX"], correctIndex: 0, explanation: "LIMIT (or TOP/FETCH depending on the SQL dialect) restricts the result set size." },
      { id: "q13", question: "What does a self-join do?", options: ["Joins a table to itself using aliases", "Joins two entirely different databases", "Deletes duplicate rows", "Creates a new table automatically"], correctIndex: 0, explanation: "A self-join treats the same table as two logical tables via aliases, useful for hierarchical or comparative data." },
      { id: "q14", question: "What is denormalization sometimes used for?", options: ["Reducing storage cost only", "Improving read performance by introducing controlled redundancy, trading off write complexity", "Increasing normalization level", "Encrypting sensitive data"], correctIndex: 1, explanation: "Denormalization can speed up reads (fewer joins) at the cost of data duplication and harder consistency management." },
      { id: "q15", question: "What does COUNT(*) return in a SQL query?", options: ["The number of columns", "The number of rows matching the query, including NULLs", "The sum of all numeric values", "The number of tables"], correctIndex: 1, explanation: "COUNT(*) counts all rows in the result set, unlike COUNT(column) which skips NULLs in that column." },
      { id: "q16", question: "What is a composite primary key?", options: ["A key made of exactly one column always", "A primary key formed from two or more columns together", "A foreign key on multiple tables", "An auto-incrementing ID"], correctIndex: 1, explanation: "Composite keys use a combination of columns whose values together are unique per row." },
      { id: "q17", question: "What does 'ORDER BY column DESC' do?", options: ["Sorts ascending", "Sorts the results in descending order by that column", "Groups by that column", "Filters null values"], correctIndex: 1, explanation: "DESC sorts from highest to lowest (or Z to A for text)." },
      { id: "q18", question: "What is the purpose of a database schema?", options: ["Store actual row data", "Define the structure: tables, columns, types, and relationships", "Cache query results", "Manage user sessions"], correctIndex: 1, explanation: "A schema is the blueprint describing how data is organized, similar in spirit to a FIRESTORE_SCHEMA.md for NoSQL." },
      { id: "q19", question: "What does an OUTER JOIN (FULL) return?", options: ["Only matching rows", "All rows from both tables, with NULLs where there's no match on either side", "Only the left table", "Only the right table"], correctIndex: 1, explanation: "A FULL OUTER JOIN combines LEFT and RIGHT JOIN behavior, keeping unmatched rows from both sides." },
      { id: "q20", question: "Why might you avoid SELECT * in production queries?", options: ["It's syntactically invalid", "It can fetch unnecessary columns, hurting performance and creating tight coupling to schema changes", "It always causes errors", "It only works with JOINs"], correctIndex: 1, explanation: "Explicitly selecting needed columns is more efficient and resilient to schema changes than SELECT *." },
    ],
  },
  {
    id: "db-nosql-firestore",
    title: "NoSQL & Firestore",
    category: "Databases",
    difficulty: "Intermediate",
    description: "Document models, collections, security rules, and real-time listeners.",
    questions: [
      { id: "q1", question: "In Firestore, what is the basic unit of data storage?", options: ["Rows in a table", "Documents inside collections", "Tables inside schemas", "Files inside buckets"], correctIndex: 1, explanation: "Firestore organizes data as documents (JSON-like objects) grouped into collections." },
      { id: "q2", question: "What does 'onSnapshot' provide in Firestore's client SDK?", options: ["A one-time read only", "A real-time listener that fires whenever the queried data changes", "A way to delete documents", "A backup mechanism"], correctIndex: 1, explanation: "onSnapshot subscribes to live updates, ideal for real-time features like messaging." },
      { id: "q3", question: "Why use a deterministic conversation ID (e.g., sorted concatenation of two user IDs) for 1:1 messaging?", options: ["To make IDs shorter", "To reliably find or create the same conversation document regardless of who initiates it", "To encrypt messages", "To bypass security rules"], correctIndex: 1, explanation: "A deterministic ID ensures both users' apps compute the same conversation path, avoiding duplicate threads." },
      { id: "q4", question: "What is a Firestore 'transaction' used for?", options: ["Styling documents", "Reading and writing data atomically, e.g., safely updating a follow/follower counter", "Creating indexes", "Compressing images"], correctIndex: 1, explanation: "Transactions ensure related reads/writes (like incrementing counters) succeed or fail together, avoiding race conditions." },
      { id: "q5", question: "What is the purpose of Firestore security rules?", options: ["Style the UI", "Control who can read/write which documents directly from the client", "Speed up queries", "Generate the schema automatically"], correctIndex: 1, explanation: "Security rules enforce access control at the database level since clients can talk to Firestore directly." },
      { id: "q6", question: "Why might a 'verificationCodes' collection need unauthenticated read/write rules?", options: ["Because all data should be public", "Because the user isn't authenticated yet at signup time, so rules must allow that specific limited operation before login", "Because Firestore requires it for all collections", "It's a mistake and should never happen"], correctIndex: 1, explanation: "Email verification happens before the user has an authenticated session, so narrowly-scoped rules must permit that flow." },
      { id: "q7", question: "What is 'searchTokens' commonly used for in a Firestore-backed user search feature?", options: ["Encrypting usernames", "Precomputed substrings/keywords enabling prefix or partial-text search, since Firestore lacks native full-text search", "Storing passwords", "Rate limiting"], correctIndex: 1, explanation: "Since Firestore can't do arbitrary text search, apps precompute searchable tokens as an array field to query against." },
      { id: "q8", question: "What is a subcollection in Firestore?", options: ["A duplicate of a collection", "A collection nested under a specific document", "A backup collection", "A read-only collection"], correctIndex: 1, explanation: "Subcollections let you nest collections under a document, useful for e.g. comments per post." },
      { id: "q9", question: "Why does Firestore require composite indexes for some queries?", options: ["To slow down writes intentionally", "Because Firestore needs pre-built indexes to efficiently support queries filtering/sorting on multiple fields", "To reduce document size", "To enable security rules"], correctIndex: 1, explanation: "Multi-field queries (e.g., filter + orderBy on different fields) need a composite index Firestore builds ahead of time." },
      { id: "q10", question: "What does 'pdf-lib' help enforce, like an 8-page cap on uploaded PDFs?", options: ["Nothing related to PDFs", "Programmatic reading/manipulation of PDF documents, e.g., checking page count before allowing an upload", "Real-time listeners", "User authentication"], correctIndex: 1, explanation: "pdf-lib can inspect and modify PDF structure in JS, enabling validation like page-count limits before storing a file." },
      { id: "q11", question: "What is a key difference between NoSQL document databases (like Firestore) and relational databases (like PostgreSQL)?", options: ["NoSQL requires strict predefined schemas; SQL doesn't", "Document databases store flexible, often denormalized JSON-like data; relational databases use structured tables with fixed schemas and joins", "They are functionally identical", "NoSQL can't scale"], correctIndex: 1, explanation: "Document databases favor flexible schemas and embedding data, while relational databases normalize data across related tables." },
      { id: "q12", question: "Why might a social feed model favor denormalization (e.g., storing a username directly on each post) in Firestore?", options: ["It's required by Firestore", "Reads are optimized by avoiding extra joins/lookups, since Firestore has no native JOIN operation", "It reduces document size", "It improves security"], correctIndex: 1, explanation: "Without JOINs, embedding frequently-needed data (like a display name) avoids extra round-trip reads." },
      { id: "q13", question: "What is the purpose of transaction-safe counters for a follow/follower system?", options: ["To make the UI prettier", "To prevent race conditions where concurrent follow/unfollow actions corrupt the count", "To reduce document size", "To enable full-text search"], correctIndex: 1, explanation: "Firestore transactions ensure the read-then-increment-then-write sequence for a counter happens atomically." },
      { id: "q14", question: "What does 'NEXT_PUBLIC_' prefix mean for an environment variable in a Next.js app?", options: ["It's only available server-side", "It's exposed to the browser/client bundle, unlike unprefixed server-only env vars", "It's automatically encrypted", "It disables the variable"], correctIndex: 1, explanation: "Next.js only inlines env vars prefixed with NEXT_PUBLIC_ into client-side code; this is why Firebase client config uses that prefix." },
      { id: "q15", question: "Why keep Firebase client config in a .js file (not .ts) in some setups?", options: ["TypeScript can't read Firebase config", "It's a project convention choice; the file works fine as plain JS since it only exports a config object", ".js is required by Firebase SDK", "It improves security"], correctIndex: 1, explanation: "It's mostly a stylistic/legacy convention — a config object doesn't need TS typing to function correctly." },
      { id: "q16", question: "What is 'eventual consistency' in the context of some NoSQL systems?", options: ["Data is always instantly consistent everywhere", "Updates propagate across replicas over time rather than instantly everywhere", "Data is never consistent", "It only applies to SQL databases"], correctIndex: 1, explanation: "Many distributed NoSQL systems trade instant global consistency for availability and partition tolerance." },
      { id: "q17", question: "What does mentioning/tagging parsing in a post typically involve?", options: ["Encrypting the post", "Detecting patterns like @username in text and resolving them to user references", "Compressing images", "Rate-limiting the post"], correctIndex: 1, explanation: "Mention parsing scans text for a trigger pattern (like @) and links it to an actual user document/ID." },
      { id: "q18", question: "Why is a 'single source of truth' auth pattern (e.g., Firebase onAuthStateChanged) recommended over a separate localStorage mock context?", options: ["localStorage is faster", "It avoids drift between the real authentication state and a manually-maintained local copy, preventing bugs like stale login state", "Firebase requires it", "It removes the need for login()"], correctIndex: 1, explanation: "A separate mock context can fall out of sync with real auth state; centralizing on onAuthStateChanged keeps one authoritative source." },
      { id: "q19", question: "What's a potential downside of Firestore's per-document read pricing model for a busy real-time feed?", options: ["No downside, it's free", "Costs can scale with the number of document reads, so inefficient listeners/queries can become expensive at scale", "It has no relation to usage", "It only charges for writes"], correctIndex: 1, explanation: "Firestore bills per read/write/delete, so overly broad real-time listeners or repeated re-reads can add up in cost." },
      { id: "q20", question: "What does a 'FIRESTORE_SCHEMA.md' document typically capture for a project?", options: ["The compiled application binary", "Collections, fields, indexes, and security rules as design documentation, since Firestore has no enforced schema itself", "CSS variables", "API rate limits only"], correctIndex: 1, explanation: "Since Firestore doesn't enforce a schema at the database level, teams document the intended structure separately for consistency." },
    ],
  },
];

// ---------------------------------------------------------------------------
// CHEAT SHEETS
// ---------------------------------------------------------------------------

export const CHEAT_SHEETS: CheatSheet[] = [
  {
    id: "cs-big-o",
    title: "Big-O Complexity Cheat Sheet",
    category: "DSA",
    points: [
      "O(1) — constant: array index access, hash map get/set (avg)",
      "O(log n) — binary search, balanced BST operations",
      "O(n) — single loop, linear search, array traversal",
      "O(n log n) — merge sort, heap sort, quicksort (avg)",
      "O(n²) — nested loops, bubble/insertion sort (worst)",
      "O(2^n) — naive recursive Fibonacci, subset generation",
      "Rule of thumb: drop constants and lower-order terms — O(2n+5) → O(n)",
    ],
  },
  {
    id: "cs-react-hooks",
    title: "React Hooks Cheat Sheet",
    category: "Frontend",
    points: [
      "useState(initial) → [value, setValue] — local component state",
      "useEffect(fn, deps) — side effects; [] = once, [x] = on x change, none = every render",
      "useMemo(fn, deps) — memoize an expensive computed value",
      "useCallback(fn, deps) — memoize a function reference",
      "useRef(initial) — persist a mutable value or DOM node without re-rendering",
      "useContext(Context) — read a value from a Context.Provider above",
      "useReducer(reducer, initialState) — complex state transitions",
      "Rule: never call hooks conditionally or inside loops",
    ],
  },
  {
    id: "cs-css-flex-grid",
    title: "Flexbox & Grid Cheat Sheet",
    category: "Frontend",
    points: [
      "display: flex → justify-content (main axis), align-items (cross axis)",
      "flex: 1 → grow + shrink + basis:0%, fills available space",
      "display: grid → grid-template-columns: repeat(3, 1fr)",
      "gap: 1rem — spacing for both flex and grid, no margin collapse issues",
      "position: sticky; top: 0 — sticks after scrolling past its normal position",
      "CSS vars for theming: --bg-primary, --text-primary, toggled via .dark class",
      "prefers-color-scheme: dark — respects OS-level preference as a fallback",
    ],
  },
  {
    id: "cs-http-status",
    title: "HTTP Status Codes Cheat Sheet",
    category: "Backend",
    points: [
      "200 OK — success  ·  201 Created — resource created  ·  204 No Content",
      "301/302 — redirects (permanent / temporary)",
      "400 Bad Request — malformed input  ·  401 Unauthorized — auth required",
      "403 Forbidden — authenticated but not allowed  ·  404 Not Found",
      "409 Conflict — e.g., duplicate resource  ·  422 Unprocessable Entity — validation failed",
      "429 Too Many Requests — rate limited",
      "500 Internal Server Error  ·  503 Service Unavailable",
    ],
  },
  {
    id: "cs-rest-verbs",
    title: "REST HTTP Verbs Cheat Sheet",
    category: "Backend",
    points: [
      "GET /users — list  ·  GET /users/:id — read one",
      "POST /users — create a new resource",
      "PUT /users/:id — replace the whole resource (idempotent)",
      "PATCH /users/:id — partially update a resource",
      "DELETE /users/:id — remove a resource",
      "Idempotent verbs: GET, PUT, DELETE — safe to retry",
      "Non-idempotent: POST — retrying can create duplicates",
    ],
  },
  {
    id: "cs-ml-metrics",
    title: "ML Evaluation Metrics Cheat Sheet",
    category: "AI/ML",
    points: [
      "Precision = TP / (TP + FP) — of predicted positives, how many were right",
      "Recall = TP / (TP + FN) — of actual positives, how many were caught",
      "F1 score = 2 * (precision * recall) / (precision + recall)",
      "Accuracy = (TP + TN) / total — misleading on imbalanced data",
      "Overfitting: low train error, high validation error → add regularization/more data",
      "Underfitting: high error on both → increase model capacity/features",
      "Always hold out a test set never used for tuning",
    ],
  },
  {
    id: "cs-git-commands",
    title: "Git Commands Cheat Sheet",
    category: "DevOps",
    points: [
      "git switch -c feature/x — create + switch to a new branch",
      "git add -p — stage changes interactively, hunk by hunk",
      "git commit -m 'message' — commit staged changes",
      "git stash / git stash pop — shelve and restore uncommitted work",
      "git rebase main — replay current branch commits on top of main (linear history)",
      "git cherry-pick <sha> — apply one specific commit onto current branch",
      "git reset --hard <sha> — discard changes back to a commit (destructive)",
      "git log --oneline --graph --all — visualize branch history",
    ],
  },
  {
    id: "cs-docker-commands",
    title: "Docker Commands Cheat Sheet",
    category: "DevOps",
    points: [
      "docker build -t app:1.0 . — build an image from a Dockerfile",
      "docker run -p 3000:3000 app:1.0 — run a container, map host:container ports",
      "docker ps / docker ps -a — list running / all containers",
      "docker exec -it <container> sh — open a shell inside a running container",
      "docker-compose up -d — start multi-container services in the background",
      "docker logs -f <container> — stream container logs",
      "Multi-stage builds keep final images small by discarding build-only layers",
    ],
  },
  {
    id: "cs-sql-joins",
    title: "SQL Joins Cheat Sheet",
    category: "Databases",
    points: [
      "INNER JOIN — only matching rows in both tables",
      "LEFT JOIN — all left rows + matched right rows (NULL if no match)",
      "RIGHT JOIN — all right rows + matched left rows",
      "FULL OUTER JOIN — all rows from both sides, matched where possible",
      "GROUP BY groups rows; HAVING filters the grouped/aggregated results",
      "WHERE filters rows before grouping; HAVING filters after",
      "Index columns used often in WHERE/JOIN/ORDER BY for faster reads",
    ],
  },
  {
    id: "cs-firestore",
    title: "Firestore Data Modeling Cheat Sheet",
    category: "Databases",
    points: [
      "Collections → Documents → (optional) Subcollections — no fixed schema enforced by the DB itself",
      "Denormalize freely — no JOINs, so embed frequently-read data (e.g., displayName on a post)",
      "Use transactions for read-modify-write counters (likes, follower counts)",
      "Precompute searchTokens arrays for prefix/keyword search (no native full-text search)",
      "Composite indexes needed for queries filtering + ordering on different fields",
      "Security rules are your access-control layer — the client talks to Firestore directly",
      "Deterministic IDs (e.g., sorted uid pair) avoid duplicate 1:1 conversation docs",
    ],
  },
];

// ---------------------------------------------------------------------------
// SCALING PAST THIS FILE (read before generating 400+ quizzes)
// ---------------------------------------------------------------------------
// Two practical paths, both compatible with the QuizQuestion/Quiz shape above:
//
// 1) Author more topics by hand, following the same object shape. Fine for a
//    slow, steady trickle (a few quizzes a week).
//
// 2) Bulk-generate with your existing Gemini pipeline. Clone `/api/ai-tutor`
//    into `/api/generate-quiz`, and send a system prompt like:
//
//    "Generate a quiz as strict JSON matching this TypeScript type:
//     { id: string; title: string; category: 'DSA'|'Frontend'|'Backend'|
//       'AI/ML'|'DevOps'|'Databases'; difficulty: 'Beginner'|'Intermediate'|
//       'Advanced'; description: string; questions: { id: string;
//       question: string; options: string[4]; correctIndex: number (0-3);
//       explanation: string }[20] }
//     Topic: '<topic name>'. Return ONLY valid JSON, no markdown fences."
//
//    Store the returned quiz as a Firestore doc in `quizzes/{quizId}`, and
//    fetch QUIZZES from Firestore instead of this static array once you have
//    more than ~40-50 quizzes (past that point this file gets unwieldy and
//    slows down the route's initial JS payload).