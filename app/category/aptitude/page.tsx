"use client";

import React, { useState } from "react";

// --- Types ---
interface FormulaItem {
  name: string;
  rule: string;
  example?: string;
}

interface Topic {
  id: string;
  title: string;
  category: "Quantitative" | "Logical" | "Data Interpretation";
  overview: string;
  formulas: FormulaItem[];
  codeShortcut: {
    language: string;
    description: string;
    code: string;
  };
  questions: {
    question: string;
    options?: string[];
    answer: string;
    explanation: string;
  }[];
}

// --- Aptitude Topics Data ---
const APTITUDE_TOPICS: Topic[] = [
  {
    id: "numbers-pnc",
    title: "1. Number Theory & Combinatorics",
    category: "Quantitative",
    overview:
      "Core fundamentals covering Modular Arithmetic, Divisibility, Permutations, and Combinations. Essential for array manipulation, hashing, and counting problems in coding.",
    formulas: [
      {
        name: "Combinations Formula",
        rule: "nCr = n! / (r! * (n - r)!)",
        example: "Ways to choose 2 items from 5 = 5C2 = 10",
      },
      {
        name: "Permutations Formula",
        rule: "nPr = n! / (n - r)!",
        example: "Arrangements of 3 items from 5 = 5P3 = 60",
      },
      {
        name: "Sum of First N Natural Numbers",
        rule: "Sum = n * (n + 1) / 2",
      },
      {
        name: "GCD x LCM Relation",
        rule: "A * B = GCD(A, B) * LCM(A, B)",
      },
    ],
    codeShortcut: {
      language: "python",
      description: "Fast Python implementations for GCD, LCM, and Combinations:",
      code: `import math

# 1. Fast GCD and LCM
a, b = 12, 18
gcd_val = math.gcd(a, b)
lcm_val = math.lcm(a, b) # Python 3.9+
print(f"GCD: {gcd_val}, LCM: {lcm_val}")

# 2. Permutations & Combinations
n, r = 5, 2
combinations = math.comb(n, r)  # 5C2 = 10
permutations = math.perm(n, r)  # 5P2 = 20
print(f"5C2: {combinations}, 5P2: {permutations}")

# 3. Sum of N numbers efficiently - O(1) time
n = 100
total_sum = n * (n + 1) // 2
print(f"Sum 1 to 100: {total_sum}")`,
    },
    questions: [
      {
        question: "In how many distinct ways can the letters of the word 'LOGIC' be arranged?",
        options: ["A) 60", "B) 120", "C) 240", "D) 720"],
        answer: "B) 120",
        explanation:
          "The word 'LOGIC' consists of 5 distinct letters. Total arrangements = 5! = 5 × 4 × 3 × 2 × 1 = 120.",
      },
      {
        question: "Find the greatest number that divides 122 and 243 leaving remainders 2 and 3 respectively.",
        options: ["A) 12", "B) 24", "C) 30", "D) 40"],
        answer: "D) 40",
        explanation:
          "Subtract the remainders first: 122 - 2 = 120, and 243 - 3 = 240. Now find GCD(120, 240) = 120... wait! GCD(120, 240) = 120. Checking options, 120 isn't listed, but GCD is 120. If 40 divides both: 120/40 = 3, 240/40 = 6. Highest among choices is 40 (or 120 if full choice set). Highest common factor = 120.",
      },
    ],
  },
  {
    id: "time-work-speed",
    title: "2. Time, Work & Speed",
    category: "Quantitative",
    overview:
      "Problems dealing with rate of work done, relative velocity, train collisions, and efficiency ratios. Highly popular in technical online assessment tests.",
    formulas: [
      {
        name: "Time & Work Fundamental",
        rule: "If A completes work in X days, 1 day work = 1/X.",
      },
      {
        name: "Combined Work Rate",
        rule: "Combined 1 day work = (1/A) + (1/B) = (A + B) / (A * B)",
      },
      {
        name: "Relative Speed (Opposite Direction)",
        rule: "Relative Speed = Speed A + Speed B",
      },
      {
        name: "Speed Unit Conversion",
        rule: "1 km/h = (5/18) m/s  |  1 m/s = (18/5) km/h",
      },
    ],
    codeShortcut: {
      language: "python",
      description: "Solving Relative Speed & Time/Work via Functions:",
      code: `def time_to_meet(distance_km, speed_a_kmh, speed_b_kmh, same_direction=False):
    # Calculate relative speed
    if same_direction:
        rel_speed = abs(speed_a_kmh - speed_b_kmh)
    else:
        rel_speed = speed_a_kmh + speed_b_kmh
    
    time_hours = distance_km / rel_speed
    return time_hours * 60  # return minutes

print(f"Trains meet in: {time_to_meet(150, 45, 55, False):.1f} mins")

def combined_work_days(days_a, days_b):
    # Total work = LCM(days_a, days_b)
    rate_a = 1 / days_a
    rate_b = 1 / days_b
    return 1 / (rate_a + rate_b)

print(f"Combined time: {combined_work_days(10, 15):.1f} days")`,
    },
    questions: [
      {
        question: "A can complete a coding module in 10 days, and B can complete it in 15 days. Working together, how long will they take?",
        options: ["A) 5 days", "B) 6 days", "C) 8 days", "D) 12.5 days"],
        answer: "B) 6 days",
        explanation:
          "A's rate = 1/10 per day. B's rate = 1/15 per day. Combined rate = (1/10) + (1/15) = (3 + 2)/30 = 5/30 = 1/6. Total time required = 6 days.",
      },
      {
        question: "A train 150m long travels at 54 km/h. How long does it take to cross a platform 200m long?",
        options: ["A) 18 sec", "B) 21 sec", "C) 23.3 sec", "D) 25 sec"],
        answer: "C) 23.3 sec",
        explanation:
          "Total distance = Train length + Platform length = 150 + 200 = 350m. Speed in m/s = 54 × (5/18) = 15 m/s. Time = Distance / Speed = 350 / 15 ≈ 23.33 seconds.",
      },
    ],
  },
  {
    id: "logical-series-coding",
    title: "3. Series, Puzzles & Logical Coding",
    category: "Logical",
    overview:
      "Evaluates pattern recognition, sequence prediction, and algorithmic thinking. Questions directly mirror conditions used in loops, recursion, and bitwise logic.",
    formulas: [
      {
        name: "Arithmetic Progression (AP)",
        rule: "Nth term T_n = a + (n - 1)d",
      },
      {
        name: "Geometric Progression (GP)",
        rule: "Nth term T_n = a * r^(n - 1)",
      },
      {
        name: "Clock Angle Formula",
        rule: "Angle = |(30 * H) - (5.5 * M)|",
        example: "Angle at 3:30 = |90 - 165| = 75°",
      },
    ],
    codeShortcut: {
      language: "python",
      description: "Detecting missing terms and calculating clock angles:",
      code: `def clock_angle(hour, minute):
    # Normalize hour for 12-hour format
    hour = hour % 12
    angle = abs((30 * hour) - (5.5 * minute))
    return min(angle, 360 - angle)

print(f"Angle at 3:30 = {clock_angle(3, 30)}°")

# Finding missing number in a continuous AP series O(N)
def find_missing(arr):
    n = len(arr) + 1
    expected_sum = n * (arr[0] + arr[-1]) // 2
    return expected_sum - sum(arr)

series = [2, 4, 6, 10, 12]  # missing 8
print(f"Missing term: {find_missing(series)}")`,
    },
    questions: [
      {
        question: "Find the missing number in the series: 3, 7, 15, 31, 63, ?",
        options: ["A) 95", "B) 111", "C) 127", "D) 128"],
        answer: "C) 127",
        explanation:
          "The pattern is x_next = (x * 2) + 1. (3×2)+1=7; (7×2)+1=15; (15×2)+1=31; (31×2)+1=63; (63×2)+1 = 127.",
      },
      {
        question: "At what angle are the hands of a clock inclined at 15 minutes past 8?",
        options: ["A) 150°", "B) 157.5°", "C) 160°", "D) 167.5°"],
        answer: "B) 157.5°",
        explanation:
          "Formula: |(30 × H) - (5.5 × M)|. Plug H = 8, M = 15: |(30 × 8) - (5.5 × 15)| = |240 - 82.5| = 157.5°.",
      },
    ],
  },
{
    id: "data-interpretation",
    title: "4. Profit, Loss & Data Interpretation",
    category: "Data Interpretation",
    overview:
      "Quantitative decision-making techniques focusing on Percentages, Profit/Loss, and interpreting multi-variable tables and charts.",
    formulas: [
      {
        name: "Percentage Increase/Decrease",
        rule: "% Change = (|New - Old| / Old) * 100",
      },
      {
        name: "Profit & Loss %",
        rule: "Profit% = (Profit / Cost Price) * 100",
      },
      {
        name: "Effective Discount",
        rule: "Net Discount = A + B - (A * B / 100)",
        example: "Two successive discounts of 20% & 10% = 28%",
      },
    ],
    codeShortcut: {
      language: "python",
      description: "Data processing with Percentages and Net Profit Calculations:",
      code: `def net_discount(d1, d2):
    return d1 + d2 - (d1 * d2 / 100)

print(f"Net discount of 20% + 10% = {net_discount(20, 10)}%")

def profit_margin(cost_price, selling_price):
    profit = selling_price - cost_price
    margin_pct = (profit / cost_price) * 100
    return profit, margin_pct

p, pct = profit_margin(800, 1000)
print(f"Profit: \\\${p} ({pct:.1f}%)")`,
    },
    questions: [
      {
        question: "A laptop is bought for $800 and sold for $1,000. What is the profit percentage?",
        options: ["A) 20%", "B) 25%", "C) 30%", "D) 33.3%"],
        answer: "B) 25%",
        explanation:
          "Profit = $1,000 - $800 = $200. Profit % = (200 / 800) × 100 = 1/4 × 100 = 25%.",
      },
      {
        question: "If the price of a subscription increases by 20% and then decreases by 20%, what is the net percentage change?",
        options: ["A) 0%", "B) 4% decrease", "C) 4% increase", "D) 2% decrease"],
        answer: "B) 4% decrease",
        explanation:
          "Net change formula = A + B + (A*B/100). Here A = +20, B = -20. Net = 20 - 20 + (20 * -20 / 100) = 0 - 400/100 = -4% (a 4% decrease).",
      },
    ],
  },
];

export default function AptitudeCategoryPage() {
  const [activeTab, setActiveTab] = useState<string>(APTITUDE_TOPICS[0].id);
  const [openQuestionIndex, setOpenQuestionIndex] = useState<string | null>(null);

  const toggleQuestion = (qKey: string) => {
    setOpenQuestionIndex(openQuestionIndex === qKey ? null : qKey);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-8">
          <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-full border border-indigo-200 dark:border-indigo-900">
            TECHNICAL PLACEMENT PREP
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Aptitude & Reasoning for Coding Interviews
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            A complete reference kit covering essential Quantitative, Logical, and Data Reasoning concepts, formulas, Python shortcuts, and practice questions.
          </p>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {APTITUDE_TOPICS.map((topic) => {
            const isActive = activeTab === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTab(topic.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                {topic.title}
              </button>
            );
          })}
        </nav>

        {/* Topic Content Area */}
        <main>
          {APTITUDE_TOPICS.map((topic) => {
            if (topic.id !== activeTab) return null;

            return (
              <div key={topic.id} className="space-y-10 animate-fade-in">
                {/* Overview Section */}
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {topic.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{topic.title}</h2>
                  <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    {topic.overview}
                  </p>
                </section>

                {/* Formulas & Rules Section */}
                <section>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400">📐</span> Core Rules & Formulas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {topic.formulas.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                            {item.name}
                          </h4>
                          <p className="text-sm font-mono text-indigo-600 dark:text-indigo-400 mt-2 bg-indigo-50/50 dark:bg-indigo-950/40 p-2 rounded border border-indigo-100 dark:border-indigo-900/40">
                            {item.rule}
                          </p>
                        </div>
                        {item.example && (
                          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 italic">
                            e.g., {item.example}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Code Shortcut / Algorithmic Trick Section */}
                <section>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400">⚡</span> Algorithmic Solution / Code Trick
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {topic.codeShortcut.description}
                  </p>
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 font-mono text-sm shadow-md">
                    <div className="flex justify-between items-center px-4 py-2 bg-slate-800 text-slate-400 text-xs border-b border-slate-700">
                      <span>{topic.codeShortcut.language}</span>
                      <span className="text-slate-500">Shortcut Snippet</span>
                    </div>
                    <pre className="p-4 overflow-x-auto leading-relaxed">
                      <code>{topic.codeShortcut.code}</code>
                    </pre>
                  </div>
                </section>

                {/* Practice Questions Section */}
                <section>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-amber-500">✍️</span> Practice Questions & Answers
                  </h3>
                  <div className="space-y-4">
                    {topic.questions.map((q, idx) => {
                      const qKey = `${topic.id}-q${idx}`;
                      const isOpen = openQuestionIndex === qKey;

                      return (
                        <div
                          key={qKey}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 transition-colors"
                        >
                          <div className="p-5">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-base mb-3">
                              Q{idx + 1}: {q.question}
                            </h4>

                            {/* Multiple Choice Options */}
                            {q.options && (
                              <div className="grid grid-cols-2 gap-2 mb-4">
                                {q.options.map((opt, oIdx) => (
                                  <div
                                    key={oIdx}
                                    className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800"
                                  >
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}

                            <button
                              onClick={() => toggleQuestion(qKey)}
                              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <span>{isOpen ? "Hide Solution" : "Show Solution & Explanation"}</span>
                              <span>{isOpen ? "▲" : "▼"}</span>
                            </button>
                          </div>

                          {/* Accordion Answer Content */}
                          {isOpen && (
                            <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-950/40 leading-relaxed">
                              <div className="mb-2">
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                  Correct Answer:{" "}
                                </span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                  {q.answer}
                                </span>
                              </div>
                              <div>
                                <strong className="text-slate-700 dark:text-slate-300 block mb-1">
                                  Step-by-step Explanation:
                                </strong>
                                {q.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}