"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Terminal,
  BookOpen,
  Lightbulb,
  Boxes,
  Link2,
  Layers,
  ListOrdered,
  GitBranch,
  Search,
  Route,
  Wand2,
  Trophy,
  Download,
  ChevronDown,
  Code2,
  FileText,
  HelpCircle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface QA {
  q: string;
  a: string;
  code?: string;
}

interface Topic {
  id: string;
  label: string;
  icon: React.ElementType;
  concept: string[];
  code?: { title: string; body: string };
  questions: QA[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ---------------------------------------------------------------------------
// Topic data
// ---------------------------------------------------------------------------
const topics: Topic[] = [
  {
    id: "what-is-dsa",
    label: "What is DSA?",
    icon: BookOpen,
    concept: [
      "DSA stands for Data Structures & Algorithms. A data structure is a way of organizing and storing data so it can be accessed and modified efficiently. An algorithm is a step-by-step procedure that operates on that data to solve a problem.",
      "Together, they form the core toolkit of computer science — every app you use (search engines, maps, social feeds, databases) is built on choosing the right data structure and the right algorithm for the job.",
      "Learning DSA well means you can look at a problem and reason about how to store the data and how to process it efficiently — not just write code that 'works' for a small input.",
    ],
    questions: [
      {
        q: "What is the difference between a data structure and an algorithm?",
        a: "A data structure is the container/organization for data (e.g., an array, a linked list). An algorithm is the set of steps that operates on that data to produce a result (e.g., sorting an array, searching a linked list). You always pair the two: choose a structure, then run an algorithm on it.",
      },
      {
        q: "Give two real-world examples of DSA in everyday apps.",
        a: "1) Autocomplete/search suggestions use a Trie (prefix tree) to instantly find matching words. 2) A music app's 'recently played' with a fixed size uses a Queue or a doubly linked list (like an LRU cache) to drop the oldest entry efficiently.",
      },
    ],
  },
  {
    id: "why-dsa",
    label: "Why DSA is Needed",
    icon: Lightbulb,
    concept: [
      "Code that works on 100 rows can completely fail on 10 million rows if it's built on the wrong data structure or a brute-force algorithm. DSA teaches you to reason about time complexity (how runtime grows with input size) and space complexity (how memory grows).",
      "It's the single most-tested skill in technical interviews at product-based companies — not because syntax matters, but because it reveals how you break down a problem, evaluate trade-offs, and optimize under constraints.",
      "Real systems run on DSA: databases use B-Trees for fast lookups, routers use graph algorithms to find shortest paths, and browsers use hash maps for caching.",
    ],
    questions: [
      {
        q: "Why do interviewers ask DSA questions instead of just framework questions?",
        a: "Frameworks change every 1-2 years, but problem-solving fundamentals don't. DSA questions let interviewers evaluate how you think under pressure, how you handle edge cases, and whether you can optimize a solution — skills that transfer to any tech stack.",
      },
      {
        q: "What happens if you ignore time complexity in production code?",
        a: "A feature that's fast in testing (small data) can time out or crash in production once real user data scales up — this is one of the most common causes of performance bugs and outages in real companies.",
      },
    ],
  },
  {
    id: "array",
    label: "Array",
    icon: Boxes,
    concept: [
      "An array stores elements in contiguous memory locations, which is why accessing any element by index is O(1) — the address is calculated directly from the base address + index × size.",
      "Insertion or deletion in the middle is O(n) in the worst case because remaining elements must shift. In C++, use `std::vector` for a dynamic (resizable) array instead of a raw fixed-size array.",
    ],
    code: {
      title: "Array traversal & finding the maximum (C++)",
      body: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int arr[] = {4, 9, 2, 17, 8, 1};
    int n = sizeof(arr) / sizeof(arr[0]);
    int maxVal = arr[0];

    for (int i = 1; i < n; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }

    cout << "Maximum element: " << maxVal << endl; // 17
    return 0;
}`,
    },
    questions: [
      {
        q: "What is the time complexity to access an element by index in an array?",
        a: "O(1) — constant time, because the memory address is computed directly from the base address and index.",
      },
      {
        q: "How do you reverse an array in-place?",
        a: "Use two pointers, one at the start and one at the end. Swap the elements and move both pointers toward the center until they meet.",
        code: `void reverseArray(int arr[], int n) {
    int start = 0, end = n - 1;
    while (start < end) {
        swap(arr[start], arr[end]);
        start++;
        end--;
    }
}`,
      },
      {
        q: "How do you find the second-largest element in an array in a single pass?",
        a: "Track two variables, `first` and `second`, initialized to the smallest possible value. Loop once: if the current element is greater than `first`, update `second = first` then `first = current`. Else if it's greater than `second` (and not equal to `first`), update `second`.",
      },
    ],
  },
  {
    id: "linkedlist",
    label: "Linked List",
    icon: Link2,
    concept: [
      "A linked list stores elements as nodes, where each node holds data plus a pointer to the next node. Unlike arrays, memory isn't contiguous — insertion/deletion at the head is O(1) since there's no shifting involved.",
      "Variants: Singly (one direction), Doubly (prev + next pointers), Circular (tail points back to head). Trade-off vs arrays: no O(1) random access — you must traverse from the head to reach a specific node.",
    ],
    code: {
      title: "Singly linked list — insert at head & traverse (C++)",
      body: `struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

Node* insertAtHead(Node* head, int val) {
    Node* newNode = new Node(val);
    newNode->next = head;
    return newNode; // new node becomes the head
}

void printList(Node* head) {
    while (head != nullptr) {
        cout << head->data << " -> ";
        head = head->next;
    }
    cout << "NULL" << endl;
}`,
    },
    questions: [
      {
        q: "How do you detect a cycle in a linked list?",
        a: "Use Floyd's Cycle Detection (slow & fast pointer / 'tortoise and hare'). Move `slow` one step and `fast` two steps at a time. If they ever meet, there's a cycle. If `fast` reaches NULL, there's no cycle.",
        code: `bool hasCycle(Node* head) {
    Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
      },
      {
        q: "How do you reverse a singly linked list?",
        a: "Keep three pointers: `prev` (starts NULL), `curr` (starts at head), and `next`. Walk through the list, reversing the `next` pointer of each node to point backward, then advance all three pointers.",
        code: `Node* reverseList(Node* head) {
    Node *prev = nullptr, *curr = head;
    while (curr != nullptr) {
        Node* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev; // new head
}`,
      },
    ],
  },
  {
    id: "stack",
    label: "Stack",
    icon: Layers,
    concept: [
      "A stack follows LIFO — Last In, First Out. Core operations: `push` (add to top), `pop` (remove from top), `peek/top` (view top element) — all O(1).",
      "Used heavily in: function call stacks & recursion, undo/redo features, expression evaluation (infix to postfix), and backtracking algorithms.",
    ],
    code: {
      title: "Balanced parentheses check using std::stack (C++)",
      body: `#include <stack>
using namespace std;

bool isBalanced(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if ((c == ')' && top != '(') ||
                (c == '}' && top != '{') ||
                (c == ']' && top != '[')) {
                return false;
            }
        }
    }
    return st.empty();
}`,
    },
    questions: [
      {
        q: "Why is a stack the natural choice for checking balanced brackets?",
        a: "Because brackets must close in the reverse order they opened — exactly LIFO behavior. Push every opening bracket; when you see a closing bracket, it must match the most recently pushed (top) opening bracket.",
      },
      {
        q: "How can you implement a stack using two queues?",
        a: "Push into queue1 normally. For pop, dequeue all elements except the last from queue1 into queue2, return the last one, then swap queue1 and queue2 so queue1 always holds the current stack order.",
      },
    ],
  },
  {
    id: "queue",
    label: "Queue",
    icon: ListOrdered,
    concept: [
      "A queue follows FIFO — First In, First Out. Core operations: `enqueue` (add to back), `dequeue` (remove from front) — both O(1) with a proper implementation (like a circular buffer or `std::queue`).",
      "Variants: Circular Queue (reuses freed space), Priority Queue (dequeues by priority, not order, usually backed by a heap), and Deque (insertion/removal from both ends).",
    ],
    code: {
      title: "Queue using std::queue (C++)",
      body: `#include <queue>
using namespace std;

int main() {
    queue<int> q;
    q.push(10);
    q.push(20);
    q.push(30);

    while (!q.empty()) {
        cout << q.front() << " ";
        q.pop();
    }
    // Output: 10 20 30
    return 0;
}`,
    },
    questions: [
      {
        q: "What's the key difference between a stack and a queue?",
        a: "Stack = LIFO (last element in is the first out, like a stack of plates). Queue = FIFO (first element in is the first out, like a line at a ticket counter).",
      },
      {
        q: "How would you implement a queue using two stacks?",
        a: "Maintain `stack1` (for enqueue) and `stack2` (for dequeue). To enqueue, push to stack1. To dequeue, if stack2 is empty, pop everything from stack1 and push it onto stack2 (this reverses the order), then pop from stack2.",
      },
    ],
  },
  {
    id: "tree-graph",
    label: "Tree & Graph",
    icon: GitBranch,
    concept: [
      "A Tree is a hierarchical structure with one root and no cycles — every node has exactly one parent (except the root). A Binary Search Tree (BST) keeps left-subtree values smaller and right-subtree values larger than the node, enabling O(log n) search on average.",
      "A Graph is a more general structure of nodes (vertices) connected by edges — it can have cycles, be directed or undirected, and weighted or unweighted. Graphs are represented as an Adjacency List (space-efficient, common in interviews) or an Adjacency Matrix (faster edge lookup, more memory).",
    ],
    code: {
      title: "BST insertion (C++)",
      body: `struct Node {
    int val;
    Node *left, *right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int val) {
    if (root == nullptr) return new Node(val);
    if (val < root->val) root->left = insert(root->left, val);
    else root->right = insert(root->right, val);
    return root;
}`,
    },
    questions: [
      {
        q: "What's the fundamental difference between a tree and a graph?",
        a: "A tree is a special type of graph with no cycles and exactly one path between any two nodes. Every tree is a graph, but not every graph is a tree — graphs can have cycles and multiple paths between nodes.",
      },
      {
        q: "What are the key properties of a Binary Search Tree?",
        a: "For every node: all values in the left subtree are smaller, and all values in the right subtree are larger. This property enables O(log n) average search, insert, and delete — but degrades to O(n) if the tree becomes skewed (like a linked list).",
      },
      {
        q: "When would you use BFS over DFS on a graph?",
        a: "Use BFS when you need the shortest path in an unweighted graph, or level-by-level processing. Use DFS when you need to explore as deep as possible first — useful for cycle detection, topological sort, and connected components.",
      },
    ],
  },
  {
    id: "search-sort",
    label: "Searching & Sorting",
    icon: Search,
    concept: [
      "Linear Search checks every element (O(n)) and works on unsorted data. Binary Search repeatedly halves the search range (O(log n)) but requires the data to be sorted first.",
      "Sorting: Bubble/Selection/Insertion Sort are simple but O(n²) — fine for small or nearly-sorted data. Merge Sort and Quick Sort run in O(n log n) on average and are what real-world libraries use under the hood.",
    ],
    code: {
      title: "Binary Search (C++)",
      body: `int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // not found
}`,
    },
    questions: [
      {
        q: "What is the time complexity of binary search, and what's the precondition?",
        a: "O(log n). The precondition is that the array must already be sorted — binary search relies on discarding half the search space each step, which only works on ordered data.",
      },
      {
        q: "Which common sorting algorithms are 'stable' (preserve relative order of equal elements)?",
        a: "Merge Sort, Insertion Sort, and Bubble Sort are stable. Quick Sort and Heap Sort are typically not stable (though stable variants exist with extra bookkeeping).",
      },
      {
        q: "What's the worst-case time complexity of Quick Sort, and when does it happen?",
        a: "O(n²), which happens when the pivot chosen is consistently the smallest or largest element (e.g., already-sorted input with a naive 'always pick first element' pivot strategy). Using a random or median-of-three pivot avoids this in practice.",
      },
    ],
  },
  {
    id: "traversal",
    label: "Traversal Algorithms",
    icon: Route,
    concept: [
      "Tree traversals define the order nodes are visited: Inorder (left → node → right) gives sorted order on a BST; Preorder (node → left → right) is used to copy/serialize a tree; Postorder (left → right → node) is used to delete a tree safely.",
      "Level Order Traversal visits nodes level-by-level using a Queue — this is essentially BFS applied to a tree. For graphs, BFS (queue-based) explores neighbors layer by layer, while DFS (stack/recursion-based) dives deep down one path before backtracking.",
    ],
    code: {
      title: "Inorder traversal & BFS on a graph (C++)",
      body: `// Inorder traversal of a binary tree
void inorder(Node* root) {
    if (root == nullptr) return;
    inorder(root->left);
    cout << root->val << " ";
    inorder(root->right);
}

// BFS traversal of a graph using adjacency list
void bfs(int start, vector<vector<int>>& adj, int n) {
    vector<bool> visited(n, false);
    queue<int> q;
    q.push(start);
    visited[start] = true;

    while (!q.empty()) {
        int node = q.front(); q.pop();
        cout << node << " ";
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}`,
    },
    questions: [
      {
        q: "What order does inorder traversal produce on a Binary Search Tree?",
        a: "Sorted (ascending) order — this is a direct consequence of the BST property that left < node < right at every level.",
      },
      {
        q: "How is level-order traversal of a tree implemented?",
        a: "Use a queue. Push the root, then repeatedly dequeue a node, print/process it, and enqueue its left and right children (if they exist) until the queue is empty.",
      },
    ],
  },
  {
    id: "techniques",
    label: "Techniques & Patterns",
    icon: Wand2,
    concept: [
      "Two Pointer: use two indices moving toward each other or in the same direction — great for sorted arrays, palindrome checks, and pair-sum problems.",
      "Sliding Window: maintain a moving subarray/substring range to avoid recomputation — ideal for 'max/min subarray of size k' or substring problems.",
      "Recursion & Backtracking: break a problem into smaller identical subproblems, undoing choices that don't work — used in permutations, N-Queens, maze solving.",
      "Dynamic Programming (DP): store results of overlapping subproblems to avoid recomputation. Memoization = top-down (recursion + cache), Tabulation = bottom-up (iterative table-filling).",
      "Greedy: make the locally optimal choice at each step, hoping it leads to a globally optimal solution — works for problems like activity selection and coin change (with certain coin systems), but not all problems.",
    ],
    code: {
      title: "Sliding Window — max sum of subarray of size k (C++)",
      body: `int maxSumSubarray(vector<int>& arr, int k) {
    int n = arr.size();
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];

    int maxSum = windowSum;
    for (int i = k; i < n; i++) {
        windowSum += arr[i] - arr[i - k]; // slide the window
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}`,
    },
    questions: [
      {
        q: "When should you use sliding window instead of a plain two-pointer approach?",
        a: "Sliding window is best when you're looking at a contiguous range (subarray/substring) and need a running aggregate (sum, count, max) that updates incrementally as the window moves. Two-pointer is broader and also covers non-contiguous scenarios like pair-sum in a sorted array.",
      },
      {
        q: "What's the difference between memoization and tabulation in DP?",
        a: "Memoization is top-down: you write the natural recursive solution and cache results as you compute them. Tabulation is bottom-up: you iteratively fill a table starting from the smallest subproblems, avoiding recursion overhead entirely.",
      },
      {
        q: "Give an example of a problem where the greedy approach works, and explain why.",
        a: "Activity Selection: given activities with start/end times, greedily picking the activity that finishes earliest (and doesn't overlap with what's already chosen) maximizes the total number of activities — because finishing early always leaves the most room for future choices.",
      },
    ],
  },
  {
    id: "interview-prep",
    label: "Get-Hired Q&A",
    icon: Trophy,
    concept: [
      "In interviews, HOW you arrive at a solution matters more than the final code. Always: (1) clarify the problem and edge cases out loud, (2) state a brute-force approach first, (3) optimize and explain the trade-off, (4) state final time & space complexity before coding.",
      "The questions below are common warm-ups interviewers use to gauge baseline problem-solving before moving to harder DSA rounds.",
    ],
    questions: [
      {
        q: "Check if a string is a palindrome.",
        a: "Use two pointers from both ends moving inward, comparing characters at each step. If any pair doesn't match, it's not a palindrome.",
        code: `bool isPalindrome(string s) {
    int left = 0, right = s.size() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++; right--;
    }
    return true;
}`,
      },
      {
        q: "Two Sum — find two numbers in an array that add up to a target.",
        a: "Brute force is O(n²) with nested loops. The optimal O(n) approach uses a hash map: for each element, check if `target - element` already exists in the map; if not, store the current element and move on.",
        code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,
      },
      {
        q: "Find the missing number in an array of 1 to n.",
        a: "Calculate the expected sum using n*(n+1)/2, subtract the actual sum of the array — the difference is the missing number. This runs in O(n) time and O(1) space.",
      },
      {
        q: "Fibonacci — recursive vs dynamic programming.",
        a: "Naive recursion recomputes the same subproblems exponentially (O(2^n)). Using memoization or an iterative bottom-up table brings it down to O(n) time by storing previously computed Fibonacci values.",
        code: `int fib(int n, vector<int>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
}`,
      },
    ],
  },
];

type TabKey = "concept" | "code" | "practice";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DSAPage() {
  const [activeId, setActiveId] = useState(topics[0].id);
  const [activeTab, setActiveTab] = useState<TabKey>("concept");
  const [openQ, setOpenQ] = useState<number | null>(null);

  const active = topics.find((t) => t.id === activeId)!;

  const selectTopic = (id: string) => {
    setActiveId(id);
    setActiveTab("concept");
    setOpenQ(null);
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] dark:bg-[#0a0e14] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117] shadow-sm overflow-hidden mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0a0e14]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs font-mono text-black/50 dark:text-white/40">
              DSA
            </span>
          </div>
          <div className="px-6 sm:px-10 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:bg-emerald-400/10 dark:text-[#34d399] mb-3">
                <Terminal size={14} /> Complete DSA Notes
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white">
                Data Structures &amp; Algorithms
              </h1>
              <p className="mt-2 text-sm sm:text-base text-black/60 dark:text-white/60 max-w-xl">
                Everything you need to get hired — concepts, C/C++ code, and
                interview-style Q&amp;A for every core DSA topic.
              </p>
            </div>
           <a
  href="/downloads/dsa-notes.pdf"
  download
  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-amber-600 dark:bg-[#34d399] text-white dark:text-[#0a0e14] text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
>
  <Download size={16} />
  Download DSA Notes
</a>
          </div>
        </motion.div>

        {/* Mobile topic pills */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
          {topics.map((t) => {
            const Icon = t.icon;
            const isActive = t.id === activeId;
            return (
              <button
                key={t.id}
                onClick={() => selectTopic(t.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
                  isActive
                    ? "bg-amber-600 dark:bg-[#34d399] text-white dark:text-[#0a0e14] border-transparent"
                    : "bg-white dark:bg-[#0d1117] text-black/70 dark:text-white/70 border-black/10 dark:border-white/10"
                }`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar (desktop) */}
          <aside className="hidden md:block">
            <div className="sticky top-6 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117] shadow-sm p-2">
              {topics.map((t) => {
                const Icon = t.icon;
                const isActive = t.id === activeId;
                return (
                  <button
                    key={t.id}
                    onClick={() => selectTopic(t.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                      isActive
                        ? "bg-amber-500/10 dark:bg-emerald-400/10 text-amber-700 dark:text-[#34d399] font-medium"
                        : "text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Content panel */}
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117] shadow-sm p-6 sm:p-8 min-h-[420px]">
            <h2 className="text-xl sm:text-2xl font-semibold text-black dark:text-white mb-5">
              {active.label}
            </h2>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-black/10 dark:border-white/10">
              {(
                [
                  { key: "concept", label: "Concept", icon: FileText },
                  ...(active.code
                    ? [{ key: "code", label: "Code Example", icon: Code2 }]
                    : []),
                  { key: "practice", label: "Practice Q&A", icon: HelpCircle },
                ] as { key: TabKey; label: string; icon: React.ElementType }[]
              ).map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.key === activeTab;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setOpenQ(null);
                    }}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      isActive
                        ? "border-amber-600 dark:border-[#34d399] text-amber-700 dark:text-[#34d399]"
                        : "border-transparent text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80"
                    }`}
                  >
                    <Icon size={15} /> {tab.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id + activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {/* Concept tab */}
                {activeTab === "concept" && (
                  <ul className="space-y-4">
                    {active.concept.map((p, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm sm:text-base text-black/75 dark:text-white/75 leading-relaxed"
                      >
                        <span className="text-amber-500 dark:text-[#34d399] mt-1 shrink-0">
                          ▸
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Code tab */}
                {activeTab === "code" && active.code && (
                  <div>
                    <p className="text-xs font-mono text-black/50 dark:text-white/40 mb-2">
                      {active.code.title}
                    </p>
                    <pre className="overflow-x-auto rounded-lg bg-[#0a0e14] text-emerald-300 text-xs sm:text-sm p-4 leading-relaxed">
                      <code>{active.code.body}</code>
                    </pre>
                  </div>
                )}

                {/* Practice tab */}
                {activeTab === "practice" && (
                  <div className="space-y-3">
                    {active.questions.map((qa, i) => {
                      const isOpen = openQ === i;
                      return (
                        <div
                          key={i}
                          className="rounded-lg border border-black/10 dark:border-white/10 overflow-hidden"
                        >
                          <button
                            onClick={() => setOpenQ(isOpen ? null : i)}
                            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left bg-[#f7f8fa] dark:bg-[#0a0e14] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                            <span className="text-sm font-medium text-black dark:text-white">
                              {i + 1}. {qa.q}
                            </span>
                            <ChevronDown
                              size={16}
                              className={`shrink-0 text-black/40 dark:text-white/40 transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 py-4 text-sm text-black/70 dark:text-white/70 leading-relaxed space-y-3">
                                  <p>{qa.a}</p>
                                  {qa.code && (
                                    <pre className="overflow-x-auto rounded-lg bg-[#0a0e14] text-emerald-300 text-xs sm:text-sm p-4 leading-relaxed">
                                      <code>{qa.code}</code>
                                    </pre>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}