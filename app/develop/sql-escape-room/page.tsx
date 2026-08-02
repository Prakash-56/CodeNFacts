// app/develop/sql-escape-room/page.tsx
"use client";

import { useState, useMemo } from "react";
import {
  BookOpen,
  Code2,
  Lightbulb,
  Layers,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Target,
  Zap,
  Brain,
  Table2,
  ArrowRight,
  Filter,
  Search,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  DATA – 50 SQL PRACTICE PROBLEMS                                           */
/* -------------------------------------------------------------------------- */

type Difficulty = "Easy" | "Medium" | "Hard";
type Category =
  | "Basic Select"
  | "Joins"
  | "Aggregation"
  | "Subqueries"
  | "Window Functions"
  | "CTEs"
  | "Advanced";

interface Problem {
  id: number;
  title: string;
  difficulty: Difficulty;
  category: Category;
  topics: string[];
  description: string;
  hint?: string;
  leetcodeLike?: string;
}

const PROBLEMS: Problem[] = [
  // -------- EASY (1-20) --------
  {
    id: 1,
    title: "Big Countries",
    difficulty: "Easy",
    category: "Basic Select",
    topics: ["WHERE", "OR"],
    description:
      "A country is big if it has an area of at least 3 million or a population of at least 25 million. Write a query to find the name, population, and area of the big countries.",
    leetcodeLike: "LeetCode 595",
  },
  {
    id: 2,
    title: "Find Customer Referee",
    difficulty: "Easy",
    category: "Basic Select",
    topics: ["WHERE", "NULL"],
    description:
      "Find the names of customers who are not referred by the customer with id = 2. Remember that NULL is not equal to 2.",
    leetcodeLike: "LeetCode 584",
  },
  {
    id: 3,
    title: "Customers Who Never Order",
    difficulty: "Easy",
    category: "Joins",
    topics: ["LEFT JOIN", "IS NULL"],
    description:
      "Write a query to find all customers who never ordered anything. Return their names.",
    leetcodeLike: "LeetCode 183",
  },
  {
    id: 4,
    title: "Combine Two Tables",
    difficulty: "Easy",
    category: "Joins",
    topics: ["LEFT JOIN"],
    description:
      "Write a query to report the first name, last name, city, and state of each person. If the address is missing, still report the person with NULL city/state.",
    leetcodeLike: "LeetCode 175",
  },
  {
    id: 5,
    title: "Employees Earning More Than Their Managers",
    difficulty: "Easy",
    category: "Joins",
    topics: ["Self Join"],
    description:
      "Find employees whose salary is strictly greater than their manager’s salary. Return the employee name.",
    leetcodeLike: "LeetCode 181",
  },
  {
    id: 6,
    title: "Duplicate Emails",
    difficulty: "Easy",
    category: "Aggregation",
    topics: ["GROUP BY", "HAVING"],
    description: "Write a query to find all duplicate emails in a table.",
    leetcodeLike: "LeetCode 182",
  },
  {
    id: 7,
    title: "Rising Temperature",
    difficulty: "Easy",
    category: "Joins",
    topics: ["Self Join", "Date"],
    description:
      "Find all dates with higher temperatures compared to the previous day (yesterday).",
    leetcodeLike: "LeetCode 197",
  },
  {
    id: 8,
    title: "Second Highest Salary",
    difficulty: "Easy",
    category: "Subqueries",
    topics: ["DISTINCT", "ORDER BY", "LIMIT / OFFSET"],
    description: "Write a query to get the second highest salary from the Employee table. If none exists, return null.",
    leetcodeLike: "LeetCode 176",
  },
  {
    id: 9,
    title: "Game Play Analysis I",
    difficulty: "Easy",
    category: "Aggregation",
    topics: ["GROUP BY", "MIN"],
    description: "Find the first login date for every player.",
    leetcodeLike: "LeetCode 511",
  },
  {
    id: 10,
    title: "Classes More Than 5 Students",
    difficulty: "Easy",
    category: "Aggregation",
    topics: ["GROUP BY", "HAVING"],
    description: "Find all classes that have at least 5 students.",
    leetcodeLike: "LeetCode 596",
  },
  {
    id: 11,
    title: "Article Views I",
    difficulty: "Easy",
    category: "Basic Select",
    topics: ["DISTINCT", "WHERE"],
    description: "Find all authors that viewed at least one of their own articles. Return the author ids sorted.",
    leetcodeLike: "LeetCode 1148",
  },
  {
    id: 12,
    title: "Average Selling Price",
    difficulty: "Easy",
    category: "Joins",
    topics: ["LEFT JOIN", "AVG", "CASE"],
    description:
      "Find the average selling price for each product. Average should be rounded to 2 decimal places. If a product has no sales, its average is 0.",
    leetcodeLike: "LeetCode 1251",
  },
  {
    id: 13,
    title: "Student Attendance",
    difficulty: "Easy",
    category: "Aggregation",
    topics: ["GROUP BY", "COUNT"],
    description: "For each student, calculate the number of days they were present.",
  },
  {
    id: 14,
    title: "Not Boring Movies",
    difficulty: "Easy",
    category: "Basic Select",
    topics: ["WHERE", "MOD", "ORDER BY"],
    description:
      "Write a query to report movies with an odd-numbered ID and a description that is not 'boring'. Order by rating descending.",
    leetcodeLike: "LeetCode 620",
  },
  {
    id: 15,
    title: "Swap Salary",
    difficulty: "Easy",
    category: "Basic Select",
    topics: ["UPDATE", "CASE"],
    description: "Write a query to swap all 'f' and 'm' values in the sex column (no intermediate temp table).",
    leetcodeLike: "LeetCode 627",
  },
  {
    id: 16,
    title: "Delete Duplicate Emails",
    difficulty: "Easy",
    category: "Subqueries",
    topics: ["DELETE", "Self Join"],
    description: "Write a query to delete all duplicate emails, keeping only the one with the smallest id.",
    leetcodeLike: "LeetCode 196",
  },
  {
    id: 17,
    title: "Employees With Missing Information",
    difficulty: "Easy",
    category: "Joins",
    topics: ["FULL OUTER JOIN / UNION"],
    description: "Report the IDs of employees missing either name or salary information.",
    leetcodeLike: "LeetCode 1965",
  },
  {
    id: 18,
    title: "Fix Names in a Table",
    difficulty: "Easy",
    category: "Basic Select",
    topics: ["String functions"],
    description: "Fix names so that only the first character is uppercase and the rest are lowercase.",
    leetcodeLike: "LeetCode 1667",
  },
  {
    id: 19,
    title: "Group Sold Products By The Date",
    difficulty: "Easy",
    category: "Aggregation",
    topics: ["GROUP BY", "GROUP_CONCAT / STRING_AGG"],
    description: "For each date, find the number of different products sold and their names (comma-separated, sorted).",
    leetcodeLike: "LeetCode 1484",
  },
  {
    id: 20,
    title: "Find Users With Valid E-Mails",
    difficulty: "Easy",
    category: "Basic Select",
    topics: ["REGEXP / LIKE"],
    description: "Find users with valid emails that start with a letter and end with @leetcode.com.",
    leetcodeLike: "LeetCode 1517",
  },

  // -------- MEDIUM (21-40) --------
  {
    id: 21,
    title: "Department Highest Salary",
    difficulty: "Medium",
    category: "Joins",
    topics: ["JOIN", "MAX", "GROUP BY"],
    description: "Find employees who have the highest salary in each of the departments.",
    leetcodeLike: "LeetCode 184",
  },
  {
    id: 22,
    title: "Rank Scores",
    difficulty: "Medium",
    category: "Window Functions",
    topics: ["DENSE_RANK"],
    description: "Write a query to rank scores. If two scores are equal they should have the same rank, and the next rank should be consecutive (no gaps).",
    leetcodeLike: "LeetCode 178",
  },
  {
    id: 23,
    title: "Consecutive Numbers",
    difficulty: "Medium",
    category: "Window Functions",
    topics: ["Self Join / LEAD"],
    description: "Find all numbers that appear at least three times consecutively.",
    leetcodeLike: "LeetCode 180",
  },
  {
    id: 24,
    title: "Nth Highest Salary",
    difficulty: "Medium",
    category: "Subqueries",
    topics: ["DENSE_RANK / OFFSET"],
    description: "Write a function that returns the nth highest salary. If less than n salaries exist, return null.",
    leetcodeLike: "LeetCode 177",
  },
  {
    id: 25,
    title: "Managers with at Least 5 Direct Reports",
    difficulty: "Medium",
    category: "Aggregation",
    topics: ["GROUP BY", "HAVING", "Self Join"],
    description: "Find managers who have at least five direct reports.",
    leetcodeLike: "LeetCode 570",
  },
  {
    id: 26,
    title: "Investments in 2016",
    difficulty: "Medium",
    category: "Aggregation",
    topics: ["GROUP BY", "HAVING", "SUM"],
    description:
      "Write a query to report the sum of all total investment values in 2016 for policyholders who have the same tiv_2015 value as one or more other policyholders, and are not located in the same city as any other policyholder.",
    leetcodeLike: "LeetCode 585",
  },
  {
    id: 27,
    title: "Friend Requests II: Who Has the Most Friends",
    difficulty: "Medium",
    category: "Aggregation",
    topics: ["UNION ALL", "GROUP BY"],
    description: "Find the person with the most friends and the number of friends. Friendship is bidirectional.",
    leetcodeLike: "LeetCode 602",
  },
  {
    id: 28,
    title: "Tree Node",
    difficulty: "Medium",
    category: "Joins",
    topics: ["CASE", "Self Join"],
    description: "For each node, output whether it is a Root, Inner, or Leaf node.",
    leetcodeLike: "LeetCode 608",
  },
  {
    id: 29,
    title: "Department Top Three Salaries",
    difficulty: "Medium",
    category: "Window Functions",
    topics: ["DENSE_RANK", "PARTITION BY"],
    description: "Find the employees who are high earners in each of the departments (top 3 unique salaries).",
    leetcodeLike: "LeetCode 185",
  },
  {
    id: 30,
    title: "Confirmation Rate",
    difficulty: "Medium",
    category: "Joins",
    topics: ["LEFT JOIN", "CASE", "AVG"],
    description: "Find the confirmation rate of each user (rounded to 2 decimals). Users with no requests have rate 0.",
    leetcodeLike: "LeetCode 1934",
  },
  {
    id: 31,
    title: "Immediate Food Delivery II",
    difficulty: "Medium",
    category: "Window Functions",
    topics: ["ROW_NUMBER", "CASE"],
    description: "Find the percentage of immediate orders among the first orders of all customers.",
    leetcodeLike: "LeetCode 1174",
  },
  {
    id: 32,
    title: "Game Play Analysis IV",
    difficulty: "Medium",
    category: "Window Functions",
    topics: ["LEAD / Self Join", "Date"],
    description: "Report the fraction of players that logged in again on the day after their first login.",
    leetcodeLike: "LeetCode 550",
  },
  {
    id: 33,
    title: "Product Sales Analysis III",
    difficulty: "Medium",
    category: "Window Functions",
    topics: ["ROW_NUMBER / MIN"],
    description: "For each product, find its first year of sales along with the quantity and price of that first sale.",
    leetcodeLike: "LeetCode 1070",
  },
  {
    id: 34,
    title: "Customers Who Bought All Products",
    difficulty: "Medium",
    category: "Aggregation",
    topics: ["GROUP BY", "HAVING", "COUNT DISTINCT"],
    description: "Find customer ids who bought every product in the Product table.",
    leetcodeLike: "LeetCode 1045",
  },
  {
    id: 35,
    title: "Last Person to Fit in the Bus",
    difficulty: "Medium",
    category: "Window Functions",
    topics: ["Running SUM", "ORDER BY"],
    description: "There is a queue with weight limit 1000. Find the last person who can board without exceeding the limit (queue order given).",
    leetcodeLike: "LeetCode 1204",
  },
  {
    id: 36,
    title: "Count Salary Categories",
    difficulty: "Medium",
    category: "Aggregation",
    topics: ["CASE", "UNION / CROSS JOIN"],
    description: "Calculate the number of bank accounts in each salary category: Low (<20000), Average, High (>50000). Categories with 0 should still appear.",
    leetcodeLike: "LeetCode 1907",
  },
  {
    id: 37,
    title: "Monthly Transactions I",
    difficulty: "Medium",
    category: "Aggregation",
    topics: ["GROUP BY", "CASE", "COUNT"],
    description: "Find for each month and country: number of transactions, total amount, approved count and approved amount.",
    leetcodeLike: "LeetCode 1193",
  },
  {
    id: 38,
    title: "Exchange Seats",
    difficulty: "Medium",
    category: "Basic Select",
    topics: ["CASE", "LEAD / LAG"],
    description: "Swap the seat id of every two consecutive students. If the number of students is odd, the last student is not swapped.",
    leetcodeLike: "LeetCode 626",
  },
  {
    id: 39,
    title: "Movie Rating",
    difficulty: "Medium",
    category: "Aggregation",
    topics: ["GROUP BY", "ORDER BY", "UNION"],
    description: "Find the name of the user who rated the greatest number of movies, and the movie with the highest average rating in Feb 2020. Break ties by name ascending.",
    leetcodeLike: "LeetCode 1341",
  },
  {
    id: 40,
    title: "Restaurant Growth",
    difficulty: "Medium",
    category: "Window Functions",
    topics: ["Moving Average", "SUM OVER"],
    description: "Compute the moving average of how much the customer paid in a seven-day window (current day + 6 previous).",
    leetcodeLike: "LeetCode 1321",
  },

  // -------- HARD (41-50) --------
  {
    id: 41,
    title: "Trips and Users",
    difficulty: "Hard",
    category: "Joins",
    topics: ["JOIN", "CASE", "GROUP BY", "Date"],
    description: "Find the cancellation rate of requests with unbanned users between two dates, rounded to 2 decimals, grouped by day.",
    leetcodeLike: "LeetCode 262",
  },
  {
    id: 42,
    title: "Human Traffic of Stadium",
    difficulty: "Hard",
    category: "Window Functions",
    topics: ["Consecutive rows", "LEAD / LAG"],
    description: "Display the records with three or more consecutive rows with people ≥ 100.",
    leetcodeLike: "LeetCode 601",
  },
  {
    id: 43,
    title: "Median Employee Salary",
    difficulty: "Hard",
    category: "Window Functions",
    topics: ["ROW_NUMBER", "COUNT"],
    description: "Write a query to find the median salary of each company. Bonus points for handling even/odd counts correctly.",
    leetcodeLike: "LeetCode 569",
  },
  {
    id: 44,
    title: "Find the Quiet Students in All Exams",
    difficulty: "Hard",
    category: "Window Functions",
    topics: ["RANK", "GROUP BY"],
    description: "A quiet student is one who scored neither the highest nor the lowest score in any exam. Find students who were quiet in all exams they took.",
    leetcodeLike: "LeetCode 1285? / similar",
  },
  {
    id: 45,
    title: "Report Contiguous Dates",
    difficulty: "Hard",
    category: "CTEs",
    topics: ["Gaps and Islands", "ROW_NUMBER"],
    description: "Find the start and end date of periods where the status stayed the same (Failed or Succeeded).",
    leetcodeLike: "LeetCode 1225",
  },
  {
    id: 46,
    title: "Tournament Winners",
    difficulty: "Hard",
    category: "Aggregation",
    topics: ["UNION ALL", "GROUP BY", "RANK"],
    description: "Write a query to find the winner of each group (player with highest total points; break ties by lowest player_id).",
    leetcodeLike: "LeetCode 1194",
  },
  {
    id: 47,
    title: "Sales by Day of the Week",
    difficulty: "Hard",
    category: "Aggregation",
    topics: ["PIVOT / CASE", "GROUP BY"],
    description: "Pivot the sales data so each day of the week becomes a column (Monday … Sunday).",
    leetcodeLike: "LeetCode 1322? / similar",
  },
  {
    id: 48,
    title: "Find Median Given Frequency of Numbers",
    difficulty: "Hard",
    category: "Window Functions",
    topics: ["Running SUM", "Median"],
    description: "Given a table of numbers and their frequencies, find the median of the expanded list.",
    leetcodeLike: "LeetCode 571",
  },
  {
    id: 49,
    title: "Students Report By Geography",
    difficulty: "Hard",
    category: "Window Functions",
    topics: ["ROW_NUMBER", "PIVOT"],
    description: "Pivot student names by continent so America, Asia, Europe become columns, ordered alphabetically within each.",
    leetcodeLike: "LeetCode 618",
  },
  {
    id: 50,
    title: "Total Sales Amount by Year",
    difficulty: "Hard",
    category: "Advanced",
    topics: ["Recursive CTE / Generate series", "Date"],
    description: "Report the total sales amount for each product and each year it was sold, even if some years have zero sales.",
    leetcodeLike: "LeetCode 1384",
  },
];

/* -------------------------------------------------------------------------- */
/*  COMPONENT                                                                 */
/* -------------------------------------------------------------------------- */

export default function SqlEscapeRoomPage() {
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | Difficulty>("All");
  const [categoryFilter, setCategoryFilter] = useState<"All" | Category>("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"problems" | "cheatsheet" | "learn" | "memory">("problems");
  const [solved, setSolved] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    return PROBLEMS.filter((p) => {
      if (difficultyFilter !== "All" && p.difficulty !== difficultyFilter) return false;
      if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.topics.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [difficultyFilter, categoryFilter, search]);

  const toggleSolved = (id: number) => {
    setSolved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = Math.round((solved.size / PROBLEMS.length) * 100);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* ========== HERO ========== */}
      <header className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-emerald-950/30 dark:via-zinc-950 dark:to-sky-950/20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
              <Code2 className="w-7 h-7" />
            </div>
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">
              SQL Escape Room
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Master SQL by Solving{" "}
            <span className="text-emerald-600 dark:text-emerald-400">50 Real Problems</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mb-8">
            Practice like LeetCode & HackerRank. Learn with visual diagrams, cheat sheets,
            mnemonics, and a clear path from SELECT to advanced window functions & CTEs.
          </p>

          {/* Progress */}
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">Your progress</span>
                <span className="text-zinc-500">
                  {solved.size} / {PROBLEMS.length} solved
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                Easy 20
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                Medium 20
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300">
                Hard 10
              </span>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex flex-wrap gap-2">
            {[
              { id: "problems", label: "50 Problems", icon: Target },
              { id: "learn", label: "Learn & Diagrams", icon: Layers },
              { id: "cheatsheet", label: "Cheat Sheets", icon: BookOpen },
              { id: "memory", label: "Memory Tricks", icon: Brain },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-400 dark:hover:border-emerald-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* ========== PROBLEMS TAB ========== */}
        {activeTab === "problems" && (
          <section>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search title, topic, description…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as any)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              >
                <option value="All">All Categories</option>
                <option value="Basic Select">Basic Select</option>
                <option value="Joins">Joins</option>
                <option value="Aggregation">Aggregation</option>
                <option value="Subqueries">Subqueries</option>
                <option value="Window Functions">Window Functions</option>
                <option value="CTEs">CTEs</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <p className="text-sm text-zinc-500 mb-4">
              Showing {filtered.length} problem{filtered.length !== 1 ? "s" : ""}
            </p>

            <div className="space-y-3">
              {filtered.map((p) => {
                const isOpen = expandedId === p.id;
                const isSolved = solved.has(p.id);
                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl border transition-all ${
                      isSolved
                        ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50"
                    }`}
                  >
                    <button
                      onClick={() => setExpandedId(isOpen ? null : p.id)}
                      className="w-full flex items-center gap-4 p-4 sm:p-5 text-left"
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                          p.difficulty === "Easy"
                            ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                            : p.difficulty === "Medium"
                            ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                            : "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300"
                        }`}
                      >
                        {p.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{p.title}</h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              p.difficulty === "Easy"
                                ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                                : p.difficulty === "Medium"
                                ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                                : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
                            }`}
                          >
                            {p.difficulty}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {p.category}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.topics.map((t) => (
                            <span
                              key={t}
                              className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSolved && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )}
                        {isOpen ? (
                          <ChevronDown className="w-5 h-5 text-zinc-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-zinc-400" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                        <p className="text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">
                          {p.description}
                        </p>
                        {p.leetcodeLike && (
                          <p className="text-sm text-zinc-500 mb-4">
                            Similar to: <span className="font-medium">{p.leetcodeLike}</span>
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => toggleSolved(p.id)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                              isSolved
                                ? "bg-emerald-600 text-white"
                                : "bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {isSolved ? "Marked as Solved" : "Mark as Solved"}
                          </button>
                          <a
                            href="https://leetcode.com/problemset/database/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                          >
                            Practice on LeetCode
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========== LEARN & DIAGRAMS ========== */}
        {activeTab === "learn" && (
          <section className="space-y-12">
            {/* Order of Execution */}
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-500" />
                SQL Query Execution Order
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                The order you <em>write</em> a query is different from the order the engine{" "}
                <em>executes</em> it. Understanding this is the single biggest unlock for
                writing correct queries.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  { step: "1", clause: "FROM + JOIN", desc: "Get the tables & combine them" },
                  { step: "2", clause: "WHERE", desc: "Filter individual rows" },
                  { step: "3", clause: "GROUP BY", desc: "Create groups" },
                  { step: "4", clause: "HAVING", desc: "Filter groups" },
                  { step: "5", clause: "SELECT", desc: "Choose columns / expressions" },
                  { step: "6", clause: "DISTINCT", desc: "Remove duplicates" },
                  { step: "7", clause: "ORDER BY", desc: "Sort the result" },
                  { step: "8", clause: "LIMIT / OFFSET", desc: "Restrict rows returned" },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
                  >
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      STEP {item.step}
                    </div>
                    <div className="font-semibold mb-1">{item.clause}</div>
                    <div className="text-sm text-zinc-500">{item.desc}</div>
                  </div>
                ))}
              </div>

              {/* Visual flow */}
              <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
                <svg viewBox="0 0 900 120" className="w-full min-w-[700px] h-auto">
                  {[
                    { x: 20, label: "FROM" },
                    { x: 130, label: "JOIN" },
                    { x: 240, label: "WHERE" },
                    { x: 350, label: "GROUP BY" },
                    { x: 470, label: "HAVING" },
                    { x: 580, label: "SELECT" },
                    { x: 690, label: "ORDER BY" },
                    { x: 800, label: "LIMIT" },
                  ].map((n, i) => (
                    <g key={n.label}>
                      <rect
                        x={n.x}
                        y={30}
                        width={90}
                        height={44}
                        rx={10}
                        className="fill-emerald-100 dark:fill-emerald-900/60 stroke-emerald-400 dark:stroke-emerald-600"
                        strokeWidth="1.5"
                      />
                      <text
                        x={n.x + 45}
                        y={57}
                        textAnchor="middle"
                        className="fill-emerald-800 dark:fill-emerald-200 text-[13px] font-semibold"
                      >
                        {n.label}
                      </text>
                      {i < 7 && (
                        <path
                          d={`M${n.x + 90} 52 L${n.x + 110} 52`}
                          className="stroke-zinc-400 dark:stroke-zinc-600"
                          strokeWidth="2"
                          markerEnd="url(#arrow)"
                        />
                      )}
                    </g>
                  ))}
                  <defs>
                    <marker
                      id="arrow"
                      markerWidth="8"
                      markerHeight="8"
                      refX="6"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M0,0 L6,3 L0,6 Z" className="fill-zinc-400 dark:fill-zinc-600" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>

            {/* JOIN Diagrams */}
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Table2 className="w-6 h-6 text-sky-500" />
                JOIN Types – Visual Block Diagrams
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Think of two tables as sets of rows. The JOIN type decides which rows survive.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    title: "INNER JOIN",
                    desc: "Only rows that match in both tables",
                    color: "bg-sky-100 dark:bg-sky-900/40 border-sky-300 dark:border-sky-700",
                  },
                  {
                    title: "LEFT JOIN",
                    desc: "All rows from left + matching from right (NULL if no match)",
                    color: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700",
                  },
                  {
                    title: "RIGHT JOIN",
                    desc: "All rows from right + matching from left",
                    color: "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700",
                  },
                  {
                    title: "FULL OUTER JOIN",
                    desc: "All rows from both sides (NULLs where no match)",
                    color: "bg-violet-100 dark:bg-violet-900/40 border-violet-300 dark:border-violet-700",
                  },
                  {
                    title: "CROSS JOIN",
                    desc: "Cartesian product – every row of A with every row of B",
                    color: "bg-rose-100 dark:bg-rose-900/40 border-rose-300 dark:border-rose-700",
                  },
                  {
                    title: "SELF JOIN",
                    desc: "Join a table to itself (employees ↔ managers)",
                    color: "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600",
                  },
                ].map((j) => (
                  <div
                    key={j.title}
                    className={`p-5 rounded-2xl border ${j.color}`}
                  >
                    <h3 className="font-bold mb-1">{j.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{j.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Path */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Recommended Learning Path</h2>
              <ol className="space-y-4">
                {[
                  { title: "SELECT, WHERE, ORDER BY, LIMIT", tip: "Get comfortable filtering and sorting single tables." },
                  { title: "Aggregations (COUNT, SUM, AVG) + GROUP BY + HAVING", tip: "Summarize data and filter groups." },
                  { title: "INNER / LEFT JOIN + multi-table queries", tip: "Most interview questions start here." },
                  { title: "Subqueries & EXISTS / IN / NOT IN", tip: "Learn when a subquery is clearer than a JOIN." },
                  { title: "Window Functions (ROW_NUMBER, RANK, LAG, SUM OVER)", tip: "The biggest differentiator for senior roles." },
                  { title: "CTEs (WITH … AS) and Recursive CTEs", tip: "Write readable multi-step logic and hierarchies." },
                  { title: "Gaps & Islands, Pivots, Advanced Patterns", tip: "Hard problems and real data-engineering tasks." },
                ].map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{step.title}</div>
                      <div className="text-sm text-zinc-500">{step.tip}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* ========== CHEAT SHEETS ========== */}
        {activeTab === "cheatsheet" && (
          <section className="space-y-10">
            <h2 className="text-2xl font-bold mb-2">SQL Cheat Sheets</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Keep these patterns in your muscle memory. Copy-paste friendly.
            </p>

            {/* Basic shape */}
            <CheatBlock
              title="Basic Query Shape"
              code={`SELECT DISTINCT col1, col2, expr AS alias
FROM table_a a
JOIN table_b b ON a.id = b.a_id
WHERE col1 > 100 AND col2 IN ('x', 'y')
GROUP BY col1, col2
HAVING COUNT(*) > 5
ORDER BY col1 DESC, col2 ASC
LIMIT 50 OFFSET 100;`}
            />

            <CheatBlock
              title="JOIN Patterns"
              code={`-- INNER: only matches
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT + anti-join (users with no orders)
SELECT u.*
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.user_id IS NULL;

-- Self-join (employee + manager)
SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;`}
            />

            <CheatBlock
              title="Aggregation & HAVING"
              code={`SELECT
  user_id,
  COUNT(*)          AS order_count,
  SUM(total)        AS revenue,
  AVG(total)        AS avg_order,
  MAX(created_at)   AS last_order
FROM orders
GROUP BY user_id
HAVING SUM(total) > 100
ORDER BY revenue DESC;`}
            />

            <CheatBlock
              title="Window Functions"
              code={`SELECT
  name, department, salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn,
  RANK()       OVER (PARTITION BY department ORDER BY salary DESC) AS rnk,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dense,
  LAG(salary)  OVER (PARTITION BY department ORDER BY hire_date)   AS prev_sal,
  SUM(salary)  OVER (PARTITION BY department)                      AS dept_total
FROM employees;

-- Top-N per group
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) rn
  FROM employees
) t WHERE rn <= 3;`}
            />

            <CheatBlock
              title="CTEs (Common Table Expressions)"
              code={`WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month,
         SUM(amount) AS revenue
  FROM orders
  GROUP BY 1
),
with_growth AS (
  SELECT month, revenue,
         revenue - LAG(revenue) OVER (ORDER BY month) AS mom_delta
  FROM monthly
)
SELECT * FROM with_growth
WHERE mom_delta > 0
ORDER BY month;`}
            />

            <CheatBlock
              title="Useful Patterns"
              code={`-- Conditional aggregation
SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END)

-- Deduplicate keeping latest
ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) = 1

-- Running total
SUM(amount) OVER (ORDER BY date ROWS UNBOUNDED PRECEDING)

-- Percentage of total
amount * 100.0 / SUM(amount) OVER ()

-- Gaps & Islands (consecutive groups)
SUM(CASE WHEN date = prev_date + 1 THEN 0 ELSE 1 END)
  OVER (ORDER BY date) AS group_id`}
            />
          </section>
        )}

        {/* ========== MEMORY TRICKS ========== */}
        {activeTab === "memory" && (
          <section className="space-y-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Brain className="w-7 h-7 text-violet-500" />
              How to Remember SQL Easily
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <h3 className="font-bold text-lg mb-3">Writing Order Mnemonic</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  “Some Friendly Joins Only Work Great On Large Data”
                </p>
                <ul className="space-y-1 text-sm">
                  <li><strong>S</strong>elect</li>
                  <li><strong>F</strong>rom</li>
                  <li><strong>J</strong>oin … <strong>O</strong>n</li>
                  <li><strong>W</strong>here</li>
                  <li><strong>G</strong>roup by</li>
                  <li><strong>H</strong>aving</li>
                  <li><strong>O</strong>rder by</li>
                  <li><strong>L</strong>imit</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <h3 className="font-bold text-lg mb-3">Execution Order Mnemonic</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  “First We Got Hungry, So Ordered Lunch”
                </p>
                <ul className="space-y-1 text-sm">
                  <li><strong>F</strong>rom → <strong>W</strong>here → <strong>G</strong>roup by</li>
                  <li><strong>H</strong>aving → <strong>S</strong>elect → <strong>O</strong>rder by</li>
                  <li><strong>L</strong>imit</li>
                </ul>
                <p className="text-xs text-zinc-500 mt-3">
                  Remember: the engine filters rows before it groups, and selects columns after grouping.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-violet-600" />
                Mental Models That Stick
              </h3>
              <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                <li>
                  <strong>JOINs are set operations.</strong> Draw Venn diagrams on paper during interviews.
                </li>
                <li>
                  <strong>WHERE vs HAVING:</strong> WHERE filters rows, HAVING filters groups. If the
                  condition uses an aggregate → HAVING.
                </li>
                <li>
                  <strong>Window functions keep the rows.</strong> Aggregates collapse rows; windows
                  calculate across a “window” of rows but leave every original row intact.
                </li>
                <li>
                  <strong>CTEs are named temporary tables.</strong> Use them to break a hard problem
                  into readable steps (almost always preferred over nested subqueries).
                </li>
                <li>
                  <strong>ROW_NUMBER vs RANK vs DENSE_RANK:</strong> ROW_NUMBER always unique;
                  RANK skips after ties; DENSE_RANK never skips.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Daily Practice Routine</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { day: "Mon–Tue", focus: "2 Easy + 1 Medium (Joins & Aggregates)" },
                  { day: "Wed–Thu", focus: "1 Medium + 1 Window / CTE problem" },
                  { day: "Fri–Sun", focus: "1 Hard or review solved problems + rewrite solutions" },
                ].map((r) => (
                  <div
                    key={r.day}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800"
                  >
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                      {r.day}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">{r.focus}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer tip */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-zinc-500">
          <p>
            Tip: After solving a problem, try rewriting it with a CTE or a window function.
            That single habit levels you up faster than solving 20 more Easy questions.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Small helper                                                              */
/* -------------------------------------------------------------------------- */

function CheatBlock({ title, code }: { title: string; code: string }) {
  return (
    <div>
      <h3 className="font-semibold mb-2 text-emerald-700 dark:text-emerald-400">{title}</h3>
      <pre className="overflow-x-auto p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm leading-relaxed font-mono text-zinc-800 dark:text-zinc-200">
        {code}
      </pre>
    </div>
  );
}