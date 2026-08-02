'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category =
  | 'Python'
  | 'C'
  | 'Java'
  | 'SQL'
  | 'Aptitude'
  | 'Maths'
  | 'Logic'
  | 'OS'
  | 'DBMS';

type Difficulty = 'easy' | 'medium' | 'hard';

interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  options: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

interface MissedEntry {
  question: Question;
  chosenLabel: string;
  correctLabel: string;
}

type Phase = 'setup' | 'playing' | 'summary';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const GAME_SECONDS = 60;
const FEEDBACK_DELAY_MS = 550;
const DIFFICULTY_POINTS: Record<Difficulty, number> = { easy: 10, medium: 15, hard: 20 };

const COMBO_TIERS = [
  { min: 12, multiplier: 5 },
  { min: 9, multiplier: 4 },
  { min: 6, multiplier: 3 },
  { min: 3, multiplier: 2 },
  { min: 0, multiplier: 1 },
];

function getMultiplier(streak: number): number {
  return COMBO_TIERS.find((t) => streak >= t.min)?.multiplier ?? 1;
}

const ALL_CATEGORIES: Category[] = [
  'Python',
  'C',
  'Java',
  'SQL',
  'Aptitude',
  'Maths',
  'Logic',
  'OS',
  'DBMS',
];

const CATEGORY_STYLES: Record<
  Category,
  { dot: string; text: string; bg: string; border: string; bar: string; ring: string }
> = {
  Python: {
    dot: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/30',
    bar: 'bg-blue-500',
    ring: 'ring-blue-500',
  },
  C: {
    dot: 'bg-slate-500',
    text: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-100 dark:bg-slate-500/10',
    border: 'border-slate-300 dark:border-slate-500/30',
    bar: 'bg-slate-500',
    ring: 'ring-slate-500',
  },
  Java: {
    dot: 'bg-red-500',
    text: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-50 dark:bg-red-500/10',
    border: 'border-red-200 dark:border-red-500/30',
    bar: 'bg-red-500',
    ring: 'ring-red-500',
  },
  SQL: {
    dot: 'bg-orange-500',
    text: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    border: 'border-orange-200 dark:border-orange-500/30',
    bar: 'bg-orange-500',
    ring: 'ring-orange-500',
  },
  Aptitude: {
    dot: 'bg-violet-500',
    text: 'text-violet-700 dark:text-violet-300',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    border: 'border-violet-200 dark:border-violet-500/30',
    bar: 'bg-violet-500',
    ring: 'ring-violet-500',
  },
  Maths: {
    dot: 'bg-cyan-500',
    text: 'text-cyan-700 dark:text-cyan-300',
    bg: 'bg-cyan-50 dark:bg-cyan-500/10',
    border: 'border-cyan-200 dark:border-cyan-500/30',
    bar: 'bg-cyan-500',
    ring: 'ring-cyan-500',
  },
  Logic: {
    dot: 'bg-pink-500',
    text: 'text-pink-700 dark:text-pink-300',
    bg: 'bg-pink-50 dark:bg-pink-500/10',
    border: 'border-pink-200 dark:border-pink-500/30',
    bar: 'bg-pink-500',
    ring: 'ring-pink-500',
  },
  OS: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/30',
    bar: 'bg-emerald-500',
    ring: 'ring-emerald-500',
  },
  DBMS: {
    dot: 'bg-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-300',
    bg: 'bg-yellow-50 dark:bg-yellow-500/10',
    border: 'border-yellow-200 dark:border-yellow-500/30',
    bar: 'bg-yellow-500',
    ring: 'ring-yellow-500',
  },
};

/* ------------------------------------------------------------------ */
/*  Question bank                                                      */
/* ------------------------------------------------------------------ */

const QUESTION_BANK: Question[] = [
  // ---------------- Python ----------------
  { id: 'py1', category: 'Python', difficulty: 'easy', question: 'What is the output of print(2 ** 3)?', options: ['6', '8', '9', '5'], answerIndex: 1, explanation: '** is exponentiation, so 2 raised to the power 3 is 8.' },
  { id: 'py2', category: 'Python', difficulty: 'easy', question: 'Which keyword defines a function in Python?', options: ['def', 'function', 'fn', 'func'], answerIndex: 0, explanation: 'Functions are declared with the def keyword.' },
  { id: 'py3', category: 'Python', difficulty: 'easy', question: 'What does len([1, 2, 3]) return?', options: ['2', '3', '4', 'Error'], answerIndex: 1, explanation: 'len() returns the number of items, and the list has 3 elements.' },
  { id: 'py4', category: 'Python', difficulty: 'medium', question: 'Which of these data types is immutable in Python?', options: ['list', 'dict', 'tuple', 'set'], answerIndex: 2, explanation: 'Tuples cannot be changed after creation; list, dict, and set are mutable.' },
  { id: 'py5', category: 'Python', difficulty: 'medium', question: 'What is the type of the result of 5 / 2 in Python 3?', options: ['int', 'float', 'str', 'complex'], answerIndex: 1, explanation: 'The / operator always returns a float in Python 3; use // for integer division.' },
  { id: 'py6', category: 'Python', difficulty: 'medium', question: 'Which syntax creates a list comprehension?', options: ['[x for x in range(5)]', '(x for x in range(5))', '{x for x in range(5)}', 'for x in range(5): x'], answerIndex: 0, explanation: 'Square brackets around a comprehension build a list; parentheses build a generator.' },
  { id: 'py7', category: 'Python', difficulty: 'medium', question: 'What does *args allow a function to accept?', options: ['Keyword-only arguments', 'A variable number of positional arguments', 'Default values only', 'Type hints'], answerIndex: 1, explanation: '*args collects any number of extra positional arguments into a tuple.' },
  { id: 'py8', category: 'Python', difficulty: 'easy', question: 'Which list method adds an item to the end?', options: ['append()', 'add()', 'insert()', 'push()'], answerIndex: 0, explanation: 'append() adds a single item to the end of a list.' },
  { id: 'py9', category: 'Python', difficulty: 'medium', question: 'What is the result of "abc"[::-1]?', options: ['"abc"', '"cba"', '""', '"a"'], answerIndex: 1, explanation: 'A step of -1 reverses the string, giving "cba".' },
  { id: 'py10', category: 'Python', difficulty: 'easy', question: 'What does PEP 8 refer to?', options: ["Python's style guide", 'A package manager', 'Exception handling', 'Memory management'], answerIndex: 0, explanation: 'PEP 8 is the official style guide for writing readable Python code.' },

  // ---------------- C ----------------
  { id: 'c1', category: 'C', difficulty: 'easy', question: 'Which header is required to use printf?', options: ['stdio.h', 'stdlib.h', 'string.h', 'math.h'], answerIndex: 0, explanation: 'printf and scanf are declared in stdio.h.' },
  { id: 'c2', category: 'C', difficulty: 'medium', question: 'What is the typical size of an int on a 32-bit system?', options: ['2 bytes', '4 bytes', '8 bytes', '1 byte'], answerIndex: 1, explanation: 'On most 32-bit systems an int occupies 4 bytes.' },
  { id: 'c3', category: 'C', difficulty: 'easy', question: "Which operator retrieves a variable's address?", options: ['*', '&', '%', '#'], answerIndex: 1, explanation: 'The & (address-of) operator returns the memory address of a variable.' },
  { id: 'c4', category: 'C', difficulty: 'easy', question: 'What does malloc do?', options: ['Allocates memory', 'Frees memory', 'Copies memory', 'Compares memory'], answerIndex: 0, explanation: 'malloc() dynamically allocates a block of memory on the heap.' },
  { id: 'c5', category: 'C', difficulty: 'medium', question: 'What is the output of printf("%d", 5 / 2);?', options: ['2.5', '2', '3', 'Compile error'], answerIndex: 1, explanation: 'Integer division of 5 by 2 truncates to 2.' },
  { id: 'c6', category: 'C', difficulty: 'medium', question: 'Which keyword prevents a variable from being modified?', options: ['static', 'const', 'volatile', 'register'], answerIndex: 1, explanation: 'const marks a variable as read-only after initialization.' },
  { id: 'c7', category: 'C', difficulty: 'medium', question: 'What does a NULL pointer point to?', options: ['Address 0 of the OS', 'No valid memory location', 'The main function', 'Itself'], answerIndex: 1, explanation: 'A NULL pointer is a special value meaning "points to nothing valid".' },
  { id: 'c8', category: 'C', difficulty: 'easy', question: 'Which loop is guaranteed to run at least once?', options: ['for', 'while', 'do-while', 'foreach'], answerIndex: 2, explanation: 'do-while checks its condition after executing the body once.' },
  { id: 'c9', category: 'C', difficulty: 'medium', question: 'A segmentation fault is typically caused by:', options: ['A syntax error', 'Invalid memory access', 'Integer overflow', 'A missing semicolon'], answerIndex: 1, explanation: 'Segfaults happen when a program accesses memory it is not allowed to touch.' },
  { id: 'c10', category: 'C', difficulty: 'hard', question: 'Which function resizes previously allocated memory?', options: ['malloc()', 'calloc()', 'realloc()', 'free()'], answerIndex: 2, explanation: 'realloc() grows or shrinks a block returned by malloc/calloc, preserving its contents.' },

  // ---------------- Java ----------------
  { id: 'j1', category: 'Java', difficulty: 'easy', question: 'Which keyword lets a class inherit from another?', options: ['implements', 'extends', 'inherits', 'super'], answerIndex: 1, explanation: 'extends is used for class inheritance; implements is for interfaces.' },
  { id: 'j2', category: 'Java', difficulty: 'easy', question: 'What is the default value of a boolean instance variable?', options: ['true', 'false', 'null', '0'], answerIndex: 1, explanation: 'Uninitialized boolean fields default to false.' },
  { id: 'j3', category: 'Java', difficulty: 'easy', question: 'Which method is the entry point of a Java program?', options: ['start()', 'main()', 'run()', 'init()'], answerIndex: 1, explanation: 'The JVM looks for public static void main(String[] args).' },
  { id: 'j4', category: 'Java', difficulty: 'easy', question: 'What does JVM stand for?', options: ['Java Virtual Machine', 'Java Variable Method', 'Java Verified Module', 'Java Visual Machine'], answerIndex: 0, explanation: 'The JVM executes compiled Java bytecode on any platform.' },
  { id: 'j5', category: 'Java', difficulty: 'medium', question: 'Which collection does not allow duplicate elements?', options: ['ArrayList', 'LinkedList', 'HashSet', 'Vector'], answerIndex: 2, explanation: 'HashSet enforces uniqueness of its elements.' },
  { id: 'j6', category: 'Java', difficulty: 'easy', question: 'Which construct is used to handle exceptions?', options: ['try-catch', 'if-else', 'switch-case', 'for-loop'], answerIndex: 0, explanation: 'try-catch blocks catch and handle runtime exceptions.' },
  { id: 'j7', category: 'Java', difficulty: 'medium', question: 'Which keyword makes a member belong to the class rather than an instance?', options: ['final', 'static', 'abstract', 'public'], answerIndex: 1, explanation: 'static members are shared across all instances of a class.' },
  { id: 'j8', category: 'Java', difficulty: 'medium', question: 'What is the output of System.out.println(7 / 2);?', options: ['3.5', '3', '4', 'Compile error'], answerIndex: 1, explanation: 'Both operands are ints, so integer division truncates to 3.' },
  { id: 'j9', category: 'Java', difficulty: 'medium', question: 'Which of these is NOT one of the four OOP pillars?', options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Inheritance'], answerIndex: 2, explanation: 'The four pillars are encapsulation, abstraction, inheritance, and polymorphism.' },
  { id: 'j10', category: 'Java', difficulty: 'medium', question: 'What is guaranteed about a finally block?', options: ['It runs only if an exception occurs', 'It always runs, exception or not', 'It runs before try', 'It never runs if caught'], answerIndex: 1, explanation: 'finally executes regardless of whether an exception was thrown or caught.' },

  // ---------------- SQL ----------------
  { id: 'sql1', category: 'SQL', difficulty: 'easy', question: 'Which clause filters rows before grouping?', options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], answerIndex: 0, explanation: 'WHERE filters individual rows prior to any grouping.' },
  { id: 'sql2', category: 'SQL', difficulty: 'medium', question: 'Which clause filters groups after aggregation?', options: ['WHERE', 'HAVING', 'GROUP BY', 'SELECT'], answerIndex: 1, explanation: 'HAVING filters aggregated groups, unlike WHERE which filters raw rows.' },
  { id: 'sql3', category: 'SQL', difficulty: 'easy', question: 'Which JOIN returns only rows matching in both tables?', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], answerIndex: 2, explanation: 'INNER JOIN keeps only rows with matches on both sides.' },
  { id: 'sql4', category: 'SQL', difficulty: 'easy', question: 'What does the DISTINCT keyword do?', options: ['Sorts rows', 'Removes duplicate rows', 'Groups rows', 'Filters nulls'], answerIndex: 1, explanation: 'DISTINCT removes duplicate rows from the result set.' },
  { id: 'sql5', category: 'SQL', difficulty: 'medium', question: "Which command removes a table's structure and data entirely?", options: ['DELETE', 'TRUNCATE', 'DROP', 'REMOVE'], answerIndex: 2, explanation: 'DROP deletes the table object itself, including its schema.' },
  { id: 'sql6', category: 'SQL', difficulty: 'easy', question: 'What is a primary key?', options: ['A column that uniquely identifies each row', 'A column that allows duplicates', 'A column that auto-increments only', 'A key only used on foreign tables'], answerIndex: 0, explanation: 'A primary key uniquely identifies each row in a table.' },
  { id: 'sql7', category: 'SQL', difficulty: 'easy', question: 'Which function counts non-null values in a column?', options: ['SUM()', 'COUNT()', 'AVG()', 'TOTAL()'], answerIndex: 1, explanation: 'COUNT() returns the number of non-null values in a column.' },
  { id: 'sql8', category: 'SQL', difficulty: 'medium', question: 'How does TRUNCATE differ from DELETE?', options: ['It logs every row removed', 'It removes all rows quickly with minimal logging', 'It only removes columns', 'It renames the table'], answerIndex: 1, explanation: 'TRUNCATE deallocates data pages instead of logging row-by-row deletes.' },
  { id: 'sql9', category: 'SQL', difficulty: 'medium', question: 'Which keyword combines two SELECT results and removes duplicates?', options: ['JOIN', 'UNION', 'UNION ALL', 'INTERSECT'], answerIndex: 1, explanation: 'UNION merges result sets and removes duplicate rows; UNION ALL keeps them.' },
  { id: 'sql10', category: 'SQL', difficulty: 'easy', question: 'What is a foreign key used for?', options: ['Enforcing uniqueness', 'Linking rows between tables', 'Indexing a column', 'Encrypting data'], answerIndex: 1, explanation: 'A foreign key references a primary key in another table to link related rows.' },

  // ---------------- Aptitude ----------------
  { id: 'apt1', category: 'Aptitude', difficulty: 'easy', question: 'A train travels 60 km in 1.5 hours. What is its speed?', options: ['30 km/h', '40 km/h', '45 km/h', '50 km/h'], answerIndex: 1, explanation: '60 divided by 1.5 hours equals 40 km/h.' },
  { id: 'apt2', category: 'Aptitude', difficulty: 'easy', question: 'What is 15% of 200?', options: ['20', '25', '30', '35'], answerIndex: 2, explanation: '15% of 200 is 0.15 x 200 = 30.' },
  { id: 'apt3', category: 'Aptitude', difficulty: 'easy', question: 'Boys to girls ratio is 3:2. There are 15 boys. How many girls?', options: ['8', '10', '12', '9'], answerIndex: 1, explanation: 'Each ratio unit is 5 (15/3), so girls = 2 x 5 = 10.' },
  { id: 'apt4', category: 'Aptitude', difficulty: 'medium', question: 'An item is marked up 20% then discounted 10%. What is the net change?', options: ['+8%', '+10%', '+12%', '+20%'], answerIndex: 0, explanation: '1.2 x 0.9 = 1.08, a net increase of 8%.' },
  { id: 'apt5', category: 'Aptitude', difficulty: 'easy', question: 'Simple interest on ₹1000 at 10% for 2 years is:', options: ['₹100', '₹150', '₹200', '₹250'], answerIndex: 2, explanation: 'SI = P x R x T / 100 = 1000 x 10 x 2 / 100 = 200.' },
  { id: 'apt6', category: 'Aptitude', difficulty: 'medium', question: '5 workers finish a job in 12 days. How many days for 10 workers?', options: ['4', '6', '8', '10'], answerIndex: 1, explanation: 'Doubling the workers halves the time: 12 / 2 = 6 days.' },
  { id: 'apt7', category: 'Aptitude', difficulty: 'medium', question: 'Find the next number: 2, 6, 12, 20, __', options: ['28', '30', '32', '34'], answerIndex: 1, explanation: 'The pattern is n(n+1): 5x6=30 follows 4x5=20.' },
  { id: 'apt8', category: 'Aptitude', difficulty: 'hard', question: 'Average of 5 numbers is 20. Removing one makes the average 18. What was removed?', options: ['24', '26', '28', '30'], answerIndex: 2, explanation: 'Sum of 5 is 100, sum of remaining 4 is 72, so removed = 100 - 72 = 28.' },
  { id: 'apt9', category: 'Aptitude', difficulty: 'medium', question: 'A can finish a job in 10 days, B in 15 days. Together?', options: ['5 days', '6 days', '7 days', '8 days'], answerIndex: 1, explanation: 'Combined rate is 1/10 + 1/15 = 1/6, so together it takes 6 days.' },
  { id: 'apt10', category: 'Aptitude', difficulty: 'medium', question: 'Two numbers are in ratio 4:5 and sum to 90. Find the larger.', options: ['40', '45', '50', '55'], answerIndex: 2, explanation: 'Each unit is 10 (90/9), so the larger number is 5 x 10 = 50.' },

  // ---------------- Maths ----------------
  { id: 'm1', category: 'Maths', difficulty: 'easy', question: 'What is the value of pi to 2 decimal places?', options: ['3.14', '3.41', '3.12', '3.16'], answerIndex: 0, explanation: 'Pi is approximately 3.14159, rounding to 3.14.' },
  { id: 'm2', category: 'Maths', difficulty: 'medium', question: 'What is the derivative of x squared?', options: ['x', '2x', 'x squared', '2'], answerIndex: 1, explanation: 'Using the power rule, d/dx(x^2) = 2x.' },
  { id: 'm3', category: 'Maths', difficulty: 'easy', question: 'What is the sum of interior angles in a triangle?', options: ['90°', '180°', '270°', '360°'], answerIndex: 1, explanation: 'The angles of any triangle always sum to 180 degrees.' },
  { id: 'm4', category: 'Maths', difficulty: 'easy', question: 'What is the square root of 144?', options: ['10', '11', '12', '13'], answerIndex: 2, explanation: '12 x 12 = 144.' },
  { id: 'm5', category: 'Maths', difficulty: 'medium', question: 'What is log base 10 of 1?', options: ['0', '1', '10', 'Undefined'], answerIndex: 0, explanation: 'Any base raised to the power 0 equals 1, so log(1) is always 0.' },
  { id: 'm6', category: 'Maths', difficulty: 'easy', question: 'What is the formula for the area of a circle?', options: ['pi r', '2 pi r', 'pi r squared', '2 pi r squared'], answerIndex: 2, explanation: 'Area = pi r^2, while 2 pi r is the circumference.' },
  { id: 'm7', category: 'Maths', difficulty: 'medium', question: 'What is 7 factorial (7!)?', options: ['5040', '720', '40320', '120'], answerIndex: 0, explanation: '7! = 7x6x5x4x3x2x1 = 5040.' },
  { id: 'm8', category: 'Maths', difficulty: 'easy', question: 'What is the value of 2 to the power 10?', options: ['512', '1024', '2048', '256'], answerIndex: 1, explanation: '2^10 = 1024, a number every programmer should recognize.' },
  { id: 'm9', category: 'Maths', difficulty: 'medium', question: 'What type of number is the square root of 2?', options: ['Rational', 'Irrational', 'Integer', 'Whole'], answerIndex: 1, explanation: 'sqrt(2) cannot be written as a simple fraction, so it is irrational.' },
  { id: 'm10', category: 'Maths', difficulty: 'easy', question: 'What is the slope-intercept form of a line?', options: ['y = mx + c', 'ax + by = c', 'y squared = 4ax', 'x squared + y squared = r squared'], answerIndex: 0, explanation: 'y = mx + c expresses a line using slope m and y-intercept c.' },

  // ---------------- Logic ----------------
  { id: 'l1', category: 'Logic', difficulty: 'easy', question: 'All Bloops are Razzies. All Razzies are Lazzies. Are all Bloops definitely Lazzies?', options: ['Yes', 'No', 'Cannot be determined', 'Only sometimes'], answerIndex: 0, explanation: 'This is a valid syllogism, so the conclusion necessarily follows.' },
  { id: 'l2', category: 'Logic', difficulty: 'medium', question: 'Complete the sequence: A, C, E, G, __', options: ['H', 'I', 'J', 'K'], answerIndex: 1, explanation: 'Each letter skips one, so after G comes I.' },
  { id: 'l3', category: 'Logic', difficulty: 'medium', question: 'If today is Monday, what day will it be after 100 days?', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], answerIndex: 2, explanation: '100 mod 7 = 2, so Monday plus 2 days is Wednesday.' },
  { id: 'l4', category: 'Logic', difficulty: 'easy', question: 'Complete the pattern: circle, square, circle, square, __', options: ['circle', 'square', 'triangle', 'pentagon'], answerIndex: 0, explanation: 'The pattern alternates strictly between circle and square.' },
  { id: 'l5', category: 'Logic', difficulty: 'hard', question: 'All cats are animals. Some animals are pets. Which conclusion is valid?', options: ['All cats are pets', 'Some cats may be pets', 'No cats are pets', 'All pets are cats'], answerIndex: 1, explanation: 'The premises only support a possibility, not a certainty, so "may be" is valid.' },
  { id: 'l6', category: 'Logic', difficulty: 'medium', question: 'If FRIEND is coded as GSJFOE (shift each letter by 1), how is APPLE coded?', options: ['BQQMF', 'BQQNF', 'CQQMF', 'BPQMF'], answerIndex: 0, explanation: 'Shifting each letter of APPLE by one gives B, Q, Q, M, F.' },
  { id: 'l7', category: 'Logic', difficulty: 'easy', question: 'Find the odd one out: Dog, Cat, Lion, Chair', options: ['Dog', 'Cat', 'Lion', 'Chair'], answerIndex: 3, explanation: 'Chair is the only non-living thing in the list.' },
  { id: 'l8', category: 'Logic', difficulty: 'easy', question: 'A is taller than B. B is taller than C. Who is shortest?', options: ['A', 'B', 'C', 'Cannot say'], answerIndex: 2, explanation: 'A > B > C in height, so C is the shortest.' },
  { id: 'l9', category: 'Logic', difficulty: 'hard', question: 'If 5+3=28, 9+1=810, 8+6=214, then 7+2=?', options: ['59', '95', '514', '27'], answerIndex: 0, explanation: 'The pattern is (difference)(sum): 7-2=5 and 7+2=9, giving 59.' },
  { id: 'l10', category: 'Logic', difficulty: 'medium', question: 'Which number does not belong: 2, 5, 9, 11?', options: ['2', '5', '9', '11'], answerIndex: 2, explanation: '9 is not a prime number, while 2, 5, and 11 all are.' },

  // ---------------- OS ----------------
  { id: 'os1', category: 'OS', difficulty: 'easy', question: 'What is the main function of an operating system?', options: ['Manage hardware and software resources', 'Only run a browser', 'Compile source code', 'Design user interfaces'], answerIndex: 0, explanation: 'The OS mediates access to CPU, memory, storage, and I/O for all programs.' },
  { id: 'os2', category: 'OS', difficulty: 'easy', question: 'What is a process?', options: ['A program in execution', 'A compiled file on disk', 'A hardware device', 'A network packet'], answerIndex: 0, explanation: 'A process is an instance of a program that is actively running.' },
  { id: 'os3', category: 'OS', difficulty: 'medium', question: 'Which scheduling algorithm can cause starvation?', options: ['FCFS', 'Round Robin', 'Priority Scheduling', 'None of these'], answerIndex: 2, explanation: 'Low-priority processes may never run if higher-priority ones keep arriving.' },
  { id: 'os4', category: 'OS', difficulty: 'medium', question: 'What is a deadlock?', options: ['Processes waiting indefinitely for each other', 'A crashed program', 'A memory leak', 'A very fast process'], answerIndex: 0, explanation: 'Deadlock occurs when processes hold resources the others need, and none can proceed.' },
  { id: 'os5', category: 'OS', difficulty: 'medium', question: 'What is virtual memory?', options: ['An extra physical RAM chip', 'Disk space used as an extension of RAM', 'A type of CPU cache', 'A CPU register'], answerIndex: 1, explanation: 'Virtual memory lets the OS use disk storage to simulate additional RAM.' },
  { id: 'os6', category: 'OS', difficulty: 'hard', question: 'Which is NOT one of the four necessary conditions for deadlock?', options: ['Mutual exclusion', 'Hold and wait', 'Preemption', 'Circular wait'], answerIndex: 2, explanation: 'The real condition is "no preemption" — resources cannot be forcibly taken away.' },
  { id: 'os7', category: 'OS', difficulty: 'medium', question: 'What does a context switch involve?', options: ['Saving and restoring process state', 'Deleting a process', 'Compiling code', 'Formatting a disk'], answerIndex: 0, explanation: 'The OS saves the current process registers and loads another process\u2019s state.' },
  { id: 'os8', category: 'OS', difficulty: 'medium', question: 'Which memory technique divides memory into fixed-size blocks?', options: ['Paging', 'Segmentation', 'Swapping', 'Caching'], answerIndex: 0, explanation: 'Paging splits memory into equal-sized fixed pages/frames.' },
  { id: 'os9', category: 'OS', difficulty: 'hard', question: 'What is thrashing?', options: ['Excessive paging causing low CPU utilization', 'A type of malware', 'Very fast context switching', 'Disk formatting'], answerIndex: 0, explanation: 'Thrashing happens when the system spends more time paging than executing.' },
  { id: 'os10', category: 'OS', difficulty: 'easy', question: 'Which is a benefit of multi-threading?', options: ['Increased responsiveness', 'Guaranteed bug-free code', 'Always lower memory usage', 'No need for synchronization'], answerIndex: 0, explanation: 'Multiple threads let a program stay responsive while doing background work.' },

  // ---------------- DBMS ----------------
  { id: 'db1', category: 'DBMS', difficulty: 'medium', question: 'What does ACID stand for in DBMS transactions?', options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Identity, Data', 'Automatic, Concurrency, Index, Design', 'None of these'], answerIndex: 0, explanation: 'ACID properties guarantee reliable processing of database transactions.' },
  { id: 'db2', category: 'DBMS', difficulty: 'easy', question: 'What is normalization used for?', options: ['Reducing data redundancy', 'Increasing redundancy', 'Deleting tables', 'Encrypting data'], answerIndex: 0, explanation: 'Normalization organizes tables to minimize duplicate data.' },
  { id: 'db3', category: 'DBMS', difficulty: 'medium', question: 'Which normal form removes partial dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], answerIndex: 1, explanation: '2NF requires every non-key attribute to depend on the whole primary key.' },
  { id: 'db4', category: 'DBMS', difficulty: 'medium', question: 'What is a candidate key?', options: ['A minimal super key that can uniquely identify a row', 'Any key that allows duplicates', 'A key used only for indexing', 'A foreign key referencing another table'], answerIndex: 0, explanation: 'A candidate key is a minimal set of attributes that can serve as a primary key.' },
  { id: 'db5', category: 'DBMS', difficulty: 'medium', question: 'What causes a deadlock in database transactions?', options: ['Two transactions waiting on each other\u2019s locks', 'A syntax error', 'A missing index', 'A slow disk'], answerIndex: 0, explanation: 'Circular waiting for locks between transactions produces a deadlock.' },
  { id: 'db6', category: 'DBMS', difficulty: 'hard', question: 'Which SQL isolation level prevents dirty reads?', options: ['Read Uncommitted', 'Read Committed', 'Both of these', 'Neither of these'], answerIndex: 1, explanation: 'Read Committed ensures a transaction never reads uncommitted changes from another.' },
  { id: 'db7', category: 'DBMS', difficulty: 'medium', question: 'What is denormalization?', options: ['Adding redundancy to improve read performance', 'Removing all keys', 'Encrypting data', 'Deleting indexes'], answerIndex: 0, explanation: 'Denormalization trades some redundancy for faster reads in specific workloads.' },
  { id: 'db8', category: 'DBMS', difficulty: 'easy', question: 'What is an ER diagram used for?', options: ['Modeling the logical structure of a database', 'Writing SQL queries', 'Indexing tables', 'Encrypting data'], answerIndex: 0, explanation: 'Entity-Relationship diagrams model entities and their relationships before implementation.' },
  { id: 'db9', category: 'DBMS', difficulty: 'medium', question: 'What does a foreign key enforce?', options: ['Referential integrity', 'Primary key uniqueness only', 'Indexing speed', 'Data encryption'], answerIndex: 0, explanation: 'Foreign keys ensure references between tables always point to valid rows.' },
  { id: 'db10', category: 'DBMS', difficulty: 'easy', question: 'Which of these is a NoSQL database?', options: ['MongoDB', 'MySQL', 'PostgreSQL', 'Oracle'], answerIndex: 0, explanation: 'MongoDB is a document-oriented NoSQL database; the others are relational.' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function BrainBlitzPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(
    new Set(ALL_CATEGORIES)
  );
  const [practiceMode, setPracticeMode] = useState(false);

  const [pool, setPool] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [elapsed, setElapsed] = useState(0);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [perCategoryStats, setPerCategoryStats] = useState<
    Record<string, { correct: number; total: number }>
  >({});
  const [missed, setMissed] = useState<MissedEntry[]>([]);

  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const [copyToast, setCopyToast] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const [highScore, setHighScore] = useState(0);
  const [highBestStreak, setHighBestStreak] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = pool[currentIndex];
  const multiplier = getMultiplier(streak);

  /* -------------------- persisted stats -------------------- */
  useEffect(() => {
    try {
      const s = window.localStorage.getItem('brainBlitzHighScore');
      const b = window.localStorage.getItem('brainBlitzBestStreak');
      if (s) setHighScore(parseInt(s, 10) || 0);
      if (b) setHighBestStreak(parseInt(b, 10) || 0);
    } catch {
      /* localStorage unavailable — ignore */
    }
  }, []);

  /* -------------------- timer -------------------- */
  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      if (practiceMode) {
        setElapsed((e) => e + 1);
        return;
      }
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, practiceMode]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  /* -------------------- keyboard shortcuts -------------------- */
  useEffect(() => {
    if (phase !== 'playing') return;
    const handler = (e: KeyboardEvent) => {
      if (lockedIndex !== null) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        answer(parseInt(e.key, 10) - 1);
      } else if (e.key.toLowerCase() === 's' || e.key === 'Escape') {
        skip();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, lockedIndex, currentIndex, pool]);

  /* -------------------- actions -------------------- */

  function toggleCategory(cat: Category) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size > 1) next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  function startGame() {
    const filtered = QUESTION_BANK.filter((q) => selectedCategories.has(q.category));
    setPool(shuffle(filtered));
    setCurrentIndex(0);
    setTimeLeft(GAME_SECONDS);
    setElapsed(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSkippedCount(0);
    setPerCategoryStats({});
    setMissed([]);
    setLockedIndex(null);
    setIsNewHighScore(false);
    setReviewOpen(false);
    setPhase('playing');
  }

  function advanceQuestion() {
    setLockedIndex(null);
    setCurrentIndex((idx) => {
      const next = idx + 1;
      if (next >= pool.length) {
        setPool((p) => shuffle(p));
        return 0;
      }
      return next;
    });
  }

  function recordCategory(cat: Category, wasCorrect: boolean) {
    setPerCategoryStats((prev) => {
      const existing = prev[cat] ?? { correct: 0, total: 0 };
      return {
        ...prev,
        [cat]: {
          correct: existing.correct + (wasCorrect ? 1 : 0),
          total: existing.total + 1,
        },
      };
    });
  }

  function answer(optionIndex: number) {
    if (lockedIndex !== null || !currentQuestion) return;
    setLockedIndex(optionIndex);
    const isCorrect = optionIndex === currentQuestion.answerIndex;
    recordCategory(currentQuestion.category, isCorrect);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      setScore((s) => s + DIFFICULTY_POINTS[currentQuestion.difficulty] * getMultiplier(newStreak));
      setCorrectCount((c) => c + 1);
    } else {
      setStreak(0);
      setWrongCount((c) => c + 1);
      setMissed((m) => [
        ...m,
        {
          question: currentQuestion,
          chosenLabel: currentQuestion.options[optionIndex],
          correctLabel: currentQuestion.options[currentQuestion.answerIndex],
        },
      ]);
    }

    feedbackTimeoutRef.current = setTimeout(() => {
      advanceQuestion();
    }, FEEDBACK_DELAY_MS);
  }

  function skip() {
    if (lockedIndex !== null || !currentQuestion) return;
    setLockedIndex(-1);
    setStreak(0);
    setSkippedCount((c) => c + 1);
    recordCategory(currentQuestion.category, false);
    setMissed((m) => [
      ...m,
      {
        question: currentQuestion,
        chosenLabel: 'Skipped',
        correctLabel: currentQuestion.options[currentQuestion.answerIndex],
      },
    ]);
    feedbackTimeoutRef.current = setTimeout(() => {
      advanceQuestion();
    }, FEEDBACK_DELAY_MS);
  }

  function finishGame() {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setPhase('summary');
    setScore((finalScore) => {
      setBestStreak((finalBestStreak) => {
        try {
          if (finalScore > highScore) {
            window.localStorage.setItem('brainBlitzHighScore', String(finalScore));
            setHighScore(finalScore);
            setIsNewHighScore(true);
          }
          if (finalBestStreak > highBestStreak) {
            window.localStorage.setItem('brainBlitzBestStreak', String(finalBestStreak));
            setHighBestStreak(finalBestStreak);
          }
        } catch {
          /* ignore storage errors */
        }
        return finalBestStreak;
      });
      return finalScore;
    });
  }

  function endPracticeSession() {
    finishGame();
  }

  function playAgain() {
    startGame();
  }

  function backToSetup() {
    setPhase('setup');
  }

  const questionsSeen = correctCount + wrongCount + skippedCount;
  const accuracy = questionsSeen > 0 ? Math.round((correctCount / questionsSeen) * 100) : 0;

  async function copyResults() {
    const lines = [
      'Brain Blitz \u2014 60s Rapid Fire',
      `Score: ${score}${highScore ? ` (best: ${Math.max(score, highScore)})` : ''}`,
      `Accuracy: ${accuracy}% | Best combo: x${getMultiplier(bestStreak)} | Best streak: ${bestStreak}`,
      Object.entries(perCategoryStats)
        .map(([cat, st]) => `${cat} ${st.correct}/${st.total}`)
        .join(' \u00b7 '),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(lines);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 1800);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  const timerPct = (timeLeft / GAME_SECONDS) * 100;
  const timerColor =
    timeLeft <= 10
      ? 'bg-rose-500'
      : timeLeft <= 25
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        {/* ---------- Terminal-style masthead ---------- */}
        <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-3 font-mono text-xs text-slate-500 dark:text-slate-400">
              brain_blitz.exe
            </span>
          </div>
          <div className="px-5 py-5 sm:px-7 sm:py-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Brain Blitz{' '}
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                //
              </span>{' '}
              60-second rapid fire
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Answer as many questions as you can before the clock hits zero. Chain correct
              answers to raise your combo multiplier and rack up points.
            </p>
          </div>
        </div>

        {phase === 'setup' && (
          <SetupScreen
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            practiceMode={practiceMode}
            setPracticeMode={setPracticeMode}
            onStart={startGame}
            highScore={highScore}
            highBestStreak={highBestStreak}
          />
        )}

        {phase === 'playing' && currentQuestion && (
          <PlayingScreen
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            timeLeft={timeLeft}
            timerPct={timerPct}
            timerColor={timerColor}
            practiceMode={practiceMode}
            elapsed={elapsed}
            score={score}
            streak={streak}
            multiplier={multiplier}
            lockedIndex={lockedIndex}
            onAnswer={answer}
            onSkip={skip}
            onEndPractice={endPracticeSession}
          />
        )}

        {phase === 'summary' && (
          <SummaryScreen
            score={score}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            accuracy={accuracy}
            correctCount={correctCount}
            wrongCount={wrongCount}
            skippedCount={skippedCount}
            bestStreak={bestStreak}
            bestMultiplier={getMultiplier(bestStreak)}
            perCategoryStats={perCategoryStats}
            missed={missed}
            reviewOpen={reviewOpen}
            setReviewOpen={setReviewOpen}
            onPlayAgain={playAgain}
            onBackToSetup={backToSetup}
            onCopy={copyResults}
            copyToast={copyToast}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Setup screen                                                        */
/* ------------------------------------------------------------------ */

function SetupScreen({
  selectedCategories,
  toggleCategory,
  practiceMode,
  setPracticeMode,
  onStart,
  highScore,
  highBestStreak,
}: {
  selectedCategories: Set<Category>;
  toggleCategory: (c: Category) => void;
  practiceMode: boolean;
  setPracticeMode: (v: boolean) => void;
  onStart: () => void;
  highScore: number;
  highBestStreak: number;
}) {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* stats strip */}
      {(highScore > 0 || highBestStreak > 0) && (
        <div className="flex flex-wrap gap-3">
          <StatPill label="Personal best" value={highScore.toString()} />
          <StatPill label="Best streak" value={highBestStreak.toString()} />
        </div>
      )}

      {/* category picker */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
            #select-topics
          </h2>
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => ALL_CATEGORIES.forEach((c) => !selectedCategories.has(c) && toggleCategory(c))}
              className="rounded-md px-2 py-1 font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
            >
              Select all
            </button>
            <button
              onClick={() => {
                const first = ALL_CATEGORIES[0];
                ALL_CATEGORIES.forEach((c) => c !== first && selectedCategories.has(c) && toggleCategory(c));
              }}
              className="rounded-md px-2 py-1 font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALL_CATEGORIES.map((cat) => {
            const style = CATEGORY_STYLES[cat];
            const active = selectedCategories.has(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${style.ring} ${
                  active
                    ? `${style.bg} ${style.border} ${style.text}`
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${active ? style.dot : 'bg-slate-300 dark:bg-slate-700'}`} />
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* practice mode toggle */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-5 py-4">
        <div>
          <p className="text-sm font-semibold">Practice mode</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No countdown — review at your own pace, end whenever you like.
          </p>
        </div>
        <button
          role="switch"
          aria-checked={practiceMode}
          onClick={() => setPracticeMode(!practiceMode)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
            practiceMode ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              practiceMode ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* start button */}
      <button
        onClick={onStart}
        disabled={selectedCategories.size === 0}
        className="w-full rounded-xl bg-slate-900 dark:bg-emerald-500 px-6 py-4 text-center font-mono text-base font-semibold text-white dark:text-slate-950 shadow-sm transition hover:bg-slate-800 dark:hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        $ ./start_blitz {practiceMode ? '--practice' : `--timer=${GAME_SECONDS}s`}
      </button>

      {/* help / rules */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
        <button
          onClick={() => setHelpOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3 text-sm font-semibold"
        >
          How scoring & shortcuts work
          <span className="text-slate-400">{helpOpen ? '\u2212' : '+'}</span>
        </button>
        {helpOpen && (
          <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
            <p>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Points:</span>{' '}
              easy = 10, medium = 15, hard = 20, multiplied by your current combo.
            </p>
            <p>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Combo:</span>{' '}
              3+ correct in a row = x2, 6+ = x3, 9+ = x4, 12+ = x5. A wrong answer or skip resets
              it to x1.
            </p>
            <p>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Keyboard:</span>{' '}
              press 1\u20134 to answer instantly, or S / Esc to skip a tough question without
              losing time re-reading it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-2">
      <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="font-mono text-lg font-semibold">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Playing screen                                                      */
/* ------------------------------------------------------------------ */

function PlayingScreen({
  question,
  questionNumber,
  timeLeft,
  timerPct,
  timerColor,
  practiceMode,
  elapsed,
  score,
  streak,
  multiplier,
  lockedIndex,
  onAnswer,
  onSkip,
  onEndPractice,
}: {
  question: Question;
  questionNumber: number;
  timeLeft: number;
  timerPct: number;
  timerColor: string;
  practiceMode: boolean;
  elapsed: number;
  score: number;
  streak: number;
  multiplier: number;
  lockedIndex: number | null;
  onAnswer: (i: number) => void;
  onSkip: () => void;
  onEndPractice: () => void;
}) {
  const style = CATEGORY_STYLES[question.category];
  const isLocked = lockedIndex !== null;

  return (
    <div className="space-y-5">
      {/* status bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <StatPill label="Score" value={score.toString()} />
          <div
            className={`rounded-lg border px-4 py-2 transition ${
              multiplier > 1
                ? 'border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
            }`}
          >
            <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Combo
            </p>
            <p
              className={`font-mono text-lg font-semibold ${
                multiplier > 1 ? 'text-amber-600 dark:text-amber-400' : ''
              }`}
            >
              x{multiplier} {multiplier > 1 && '\ud83d\udd25'}
            </p>
          </div>
        </div>

        {practiceMode ? (
          <button
            onClick={onEndPractice}
            className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Finish ({formatTime(elapsed)})
          </button>
        ) : (
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Time left
            </p>
            <p className="font-mono text-2xl font-bold tabular-nums">{formatTime(timeLeft)}</p>
          </div>
        )}
      </div>

      {/* timer bar */}
      {!practiceMode && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${timerColor}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
      )}

      {/* question card */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden">
        <div className={`flex items-center gap-2 border-b px-5 py-2.5 ${style.bg} ${style.border}`}>
          <span className={`h-2 w-2 rounded-full ${style.dot}`} />
          <span className={`font-mono text-xs font-medium ${style.text}`}>
            Q{questionNumber} \u00b7 {question.category} \u00b7 {question.difficulty}
          </span>
          {streak >= 3 && (
            <span className="ml-auto font-mono text-xs text-amber-600 dark:text-amber-400">
              {streak} streak
            </span>
          )}
        </div>
        <div className="px-5 py-6 sm:px-7">
          <p className="text-lg font-semibold leading-snug">{question.question}</p>
        </div>
      </div>

      {/* options */}
      <div className="grid gap-2.5">
        {question.options.map((opt, i) => {
          const isCorrectOption = i === question.answerIndex;
          const isChosen = lockedIndex === i;
          let optionClasses =
            'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700';
          if (isLocked) {
            if (isCorrectOption) {
              optionClasses =
                'border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10';
            } else if (isChosen) {
              optionClasses = 'border-rose-400 dark:border-rose-500 bg-rose-50 dark:bg-rose-500/10';
            } else {
              optionClasses = 'border-slate-200 dark:border-slate-800 opacity-50';
            }
          }
          return (
            <button
              key={i}
              disabled={isLocked}
              onClick={() => onAnswer(i)}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-default ${optionClasses}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs text-slate-500 dark:text-slate-400">
                {i + 1}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* feedback / explanation */}
      {isLocked && (
        <div className="rounded-lg bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
          {lockedIndex === question.answerIndex ? (
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Correct \u2014 </span>
          ) : (
            <span className="font-medium text-rose-600 dark:text-rose-400">
              {lockedIndex === -1 ? 'Skipped \u2014 ' : 'Not quite \u2014 '}
            </span>
          )}
          {question.explanation}
        </div>
      )}

      {!isLocked && (
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>Press 1\u20134 to answer</span>
          <button
            onClick={onSkip}
            className="rounded-md px-2 py-1 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Skip (S)
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Summary screen                                                      */
/* ------------------------------------------------------------------ */

function SummaryScreen({
  score,
  highScore,
  isNewHighScore,
  accuracy,
  correctCount,
  wrongCount,
  skippedCount,
  bestStreak,
  bestMultiplier,
  perCategoryStats,
  missed,
  reviewOpen,
  setReviewOpen,
  onPlayAgain,
  onBackToSetup,
  onCopy,
  copyToast,
}: {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  accuracy: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  bestStreak: number;
  bestMultiplier: number;
  perCategoryStats: Record<string, { correct: number; total: number }>;
  missed: MissedEntry[];
  reviewOpen: boolean;
  setReviewOpen: (v: boolean) => void;
  onPlayAgain: () => void;
  onBackToSetup: () => void;
  onCopy: () => void;
  copyToast: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 text-center">
        {isNewHighScore && (
          <p className="mb-2 inline-block rounded-full bg-amber-100 dark:bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
            New personal best!
          </p>
        )}
        <p className="font-mono text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
          $ ./blitz --results
        </p>
        <p className="mt-2 text-5xl font-bold tracking-tight">{score}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          points {highScore > 0 && `\u00b7 personal best ${Math.max(score, highScore)}`}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <MiniStat label="Accuracy" value={`${accuracy}%`} />
          <MiniStat label="Best combo" value={`x${bestMultiplier}`} />
          <MiniStat label="Best streak" value={bestStreak.toString()} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <MiniStat label="Correct" value={correctCount.toString()} tone="emerald" />
          <MiniStat label="Wrong" value={wrongCount.toString()} tone="rose" />
          <MiniStat label="Skipped" value={skippedCount.toString()} tone="slate" />
        </div>
      </div>

      {/* category breakdown */}
      {Object.keys(perCategoryStats).length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5">
          <h3 className="mb-3 font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
            #breakdown
          </h3>
          <div className="space-y-2.5">
            {Object.entries(perCategoryStats).map(([cat, st]) => {
              const style = CATEGORY_STYLES[cat as Category];
              const pct = st.total > 0 ? (st.correct / st.total) * 100 : 0;
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-xs font-medium">{cat}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${style.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-xs text-slate-500 dark:text-slate-400">
                    {st.correct}/{st.total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* review missed */}
      {missed.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
          <button
            onClick={() => setReviewOpen(!reviewOpen)}
            className="flex w-full items-center justify-between px-5 py-3 text-sm font-semibold"
          >
            Review {missed.length} missed question{missed.length !== 1 ? 's' : ''}
            <span className="text-slate-400">{reviewOpen ? '\u2212' : '+'}</span>
          </button>
          {reviewOpen && (
            <div className="max-h-96 space-y-3 overflow-y-auto border-t border-slate-200 dark:border-slate-800 px-5 py-4">
              {missed.map((m, idx) => {
                const style = CATEGORY_STYLES[m.question.category];
                return (
                  <div
                    key={`${m.question.id}-${idx}`}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 p-3"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      <span className={`font-mono text-[11px] ${style.text}`}>
                        {m.question.category}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{m.question.question}</p>
                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                      Your answer: {m.chosenLabel}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      Correct: {m.correctLabel}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {m.question.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          onClick={onPlayAgain}
          className="rounded-xl bg-slate-900 dark:bg-emerald-500 px-4 py-3 font-mono text-sm font-semibold text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-emerald-400"
        >
          Run again
        </button>
        <button
          onClick={onBackToSetup}
          className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Change topics
        </button>
        <button
          onClick={onCopy}
          className="relative rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {copyToast ? 'Copied!' : 'Copy results'}
        </button>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'emerald' | 'rose' | 'slate';
}) {
  const toneClass =
    tone === 'emerald'
      ? 'text-emerald-600 dark:text-emerald-400'
      : tone === 'rose'
      ? 'text-rose-600 dark:text-rose-400'
      : tone === 'slate'
      ? 'text-slate-500 dark:text-slate-400'
      : '';
  return (
    <div className="rounded-lg bg-slate-50 dark:bg-slate-900 px-3 py-2.5">
      <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className={`font-mono text-base font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}