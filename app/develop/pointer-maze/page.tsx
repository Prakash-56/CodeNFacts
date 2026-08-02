"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* -------------------------------------------------------------------------
 * POINTER MAZE (C LANGUAGE)
 * Navigate memory. Avoid the segmentation fault. Collect every variable
 * before the address expires. Four blocks, 64 freshly generated questions
 * each: Pointers, Arrays, References, Addresses.
 * ---------------------------------------------------------------------- */

type LevelKey = "pointers" | "arrays" | "references" | "addresses";
type Accent = "cyan" | "amber" | "violet" | "rose";

interface LevelMeta {
  key: LevelKey;
  address: string;
  name: string;
  tagline: string;
  flavor: string;
  startTime: number;
  endTime: number;
  accent: Accent;
}

interface Question {
  id: string;
  code?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

type FeedbackKind = "correct" | "wrong" | "timeout";
interface Feedback {
  type: FeedbackKind;
  points?: number;
  selectedIndex?: number;
  livesLeft: number;
}

type Screen = "menu" | "playing" | "complete" | "gameover";

const QUESTIONS_PER_LEVEL = 64;
const START_LIVES = 3;
const STORAGE_KEY = "pointer-maze-progress";
const GRID_SIZE = 8; // 8 x 8 = 64, one cell per question

const LEVELS: LevelMeta[] = [
  {
    key: "pointers",
    address: "0x0000",
    name: "Pointers",
    tagline: "Learn to Point",
    flavor: "Every variable lives at an address. Learn to read it, follow it, and change what's there.",
    startTime: 24,
    endTime: 9,
    accent: "cyan",
  },
  {
    key: "arrays",
    address: "0x0004",
    name: "Arrays",
    tagline: "Contiguous Memory",
    flavor: "An array is just a pointer with structure. Walk the block one cell at a time.",
    startTime: 26,
    endTime: 10,
    accent: "amber",
  },
  {
    key: "references",
    address: "0x0008",
    name: "References",
    tagline: "Pass by Address",
    flavor: "Some functions need the real variable, not a copy. Hand them its address.",
    startTime: 26,
    endTime: 10,
    accent: "violet",
  },
  {
    key: "addresses",
    address: "0x000C",
    name: "Addresses",
    tagline: "Where Segfaults Live",
    flavor: "NULL, dangling, and out-of-bounds \u2014 the traps that crash real programs.",
    startTime: 28,
    endTime: 11,
    accent: "rose",
  },
];

const ACCENTS: Record<
  Accent,
  { text: string; chip: string; ring: string; solidBg: string }
> = {
  cyan: {
    text: "text-cyan-600 dark:text-cyan-400",
    chip: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
    ring: "ring-cyan-400/60",
    solidBg: "bg-cyan-500",
  },
  amber: {
    text: "text-amber-600 dark:text-amber-400",
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    ring: "ring-amber-400/60",
    solidBg: "bg-amber-500",
  },
  violet: {
    text: "text-violet-600 dark:text-violet-400",
    chip: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
    ring: "ring-violet-400/60",
    solidBg: "bg-violet-500",
  },
  rose: {
    text: "text-rose-600 dark:text-rose-400",
    chip: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
    ring: "ring-rose-400/60",
    solidBg: "bg-rose-500",
  },
};

/* ------------------------------ helpers --------------------------------- */

function randInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function numericDistractors(correct: number, count: number, spread: number): number[] {
  const set = new Set<number>();
  let guard = 0;
  while (set.size < count && guard < 300) {
    guard++;
    let d = correct + randInt(-spread, spread);
    if (d < 0) d = correct + randInt(1, spread);
    if (d !== correct) set.add(d);
  }
  let filler = 1;
  while (set.size < count) {
    set.add(correct + spread + filler);
    filler++;
  }
  return Array.from(set).slice(0, count);
}

function timeForQuestion(level: LevelMeta, idx: number) {
  const ratio = idx / (QUESTIONS_PER_LEVEL - 1);
  return +(level.startTime - (level.startTime - level.endTime) * ratio).toFixed(1);
}

interface Progress {
  unlockedUpTo: number;
  bestScores: Partial<Record<LevelKey, number>>;
}

function loadProgress(): Progress {
  if (typeof window === "undefined") return { unlockedUpTo: 0, bestScores: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlockedUpTo: 0, bestScores: {} };
    const parsed = JSON.parse(raw);
    return {
      unlockedUpTo: typeof parsed.unlockedUpTo === "number" ? parsed.unlockedUpTo : 0,
      bestScores: parsed.bestScores ?? {},
    };
  } catch {
    return { unlockedUpTo: 0, bestScores: {} };
  }
}

function saveProgress(progress: Progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

/* ------------------------- maze path (boustrophedon) --------------------- */

const MAZE_PATH: { row: number; col: number }[] = (() => {
  const path: { row: number; col: number }[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    if (row % 2 === 0) {
      for (let col = 0; col < GRID_SIZE; col++) path.push({ row, col });
    } else {
      for (let col = GRID_SIZE - 1; col >= 0; col--) path.push({ row, col });
    }
  }
  return path;
})();

/* --------------------------- question builder ---------------------------- */

let qCounter = 0;
function nextId(prefix: string) {
  qCounter += 1;
  return `${prefix}-${qCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

function mc(
  prefix: string,
  opts: { code?: string; prompt: string; correct: string; distractors: string[] }
): Question {
  const combined = [opts.correct, ...opts.distractors];
  const shuffled = shuffle(combined);
  return {
    id: nextId(prefix),
    code: opts.code,
    prompt: opts.prompt,
    options: shuffled,
    correctIndex: shuffled.indexOf(opts.correct),
  };
}

function buildLevelQuestions(templates: (() => Question)[], count: number): Question[] {
  const used = new Set<string>();
  const pool: Question[] = [];
  let guard = 0;
  const maxGuard = count * 150;
  while (pool.length < count && guard < maxGuard) {
    guard++;
    const tmpl = templates[randInt(0, templates.length - 1)];
    const q = tmpl();
    const key = `${q.prompt}||${q.code ?? ""}||${q.options.join("|")}`;
    if (used.has(key)) continue;
    used.add(key);
    pool.push(q);
  }
  return shuffle(pool);
}

/* ------------------------------- data pools ------------------------------ */

const VAR_NAMES = [
  "x", "y", "z", "a", "b", "c", "n", "k", "m", "num", "val", "count", "total",
  "score", "age", "temp", "idx", "len", "sum", "base", "offset", "item",
  "value", "result", "flag", "size", "pos", "buf", "limit", "width",
];

function distinctVars(n: number) {
  const chosen: string[] = [];
  while (chosen.length < n) {
    const v = pick(VAR_NAMES);
    if (!chosen.includes(v)) chosen.push(v);
  }
  return chosen;
}

/* ============================ POINTER TEMPLATES =========================== */

function t_pointerBasicDeref(): Question {
  const [v] = distinctVars(1);
  const n = randInt(1, 99);
  return mc("ptr-deref", {
    code: `int ${v} = ${n};\nint *p = &${v};`,
    prompt: `What is the value of *p?`,
    correct: `${n}`,
    distractors: [`The address of ${v}`, `${n + 1}`, `Garbage / undefined value`],
  });
}

function t_pointerWriteThrough(): Question {
  const [v] = distinctVars(1);
  const n = randInt(1, 50);
  const m = randInt(51, 99);
  return mc("ptr-write", {
    code: `int ${v} = ${n};\nint *p = &${v};\n*p = ${m};`,
    prompt: `What is the value of ${v} after this code runs?`,
    correct: `${m}`,
    distractors: [`${n}`, `Compilation error`, `The address of ${v}`],
  });
}

function t_doublePointerRead(): Question {
  const [v] = distinctVars(1);
  const n = randInt(1, 99);
  return mc("ptr-doubleread", {
    code: `int ${v} = ${n};\nint *p = &${v};\nint **pp = &p;`,
    prompt: `What is the value of **pp?`,
    correct: `${n}`,
    distractors: [`The address of ${v}`, `The address of p`, `${n * 2}`],
  });
}

function t_charDeref(): Question {
  const letters = ["A", "B", "C", "M", "P", "Q", "X", "Y", "Z", "K"];
  const [v] = distinctVars(1);
  const ch = pick(letters);
  return mc("ptr-charderef", {
    code: `char ${v} = '${ch}';\nchar *p = &${v};\nprintf("%c", *p);`,
    prompt: `What does this print?`,
    correct: `${ch}`,
    distractors: shuffle(letters.filter((l) => l !== ch)).slice(0, 3),
  });
}

function t_nullDeref(): Question {
  const [v] = distinctVars(1);
  return mc("ptr-nulldef", {
    code: `int *${v} = NULL;\nprintf("%d", *${v});`,
    prompt: `What happens when this line runs?`,
    correct: `Segmentation fault \u2014 the program crashes`,
    distractors: [`Prints 0`, `Prints the word NULL`, `Compilation error`],
  });
}

function t_repoint(): Question {
  const [v1, v2] = distinctVars(2);
  const n1 = randInt(1, 50);
  const n2 = randInt(51, 99);
  return mc("ptr-repoint", {
    code: `int ${v1} = ${n1}, ${v2} = ${n2};\nint *p = &${v1};\np = &${v2};`,
    prompt: `What is *p now?`,
    correct: `${n2}`,
    distractors: [`${n1}`, `The address of ${v1}`, `Undefined \u2014 reassigning p is illegal`],
  });
}

function t_intArrayWalk(): Question {
  const v0 = randInt(1, 20);
  const v1 = randInt(21, 40);
  const v2 = randInt(41, 60);
  const v3 = randInt(61, 80);
  return mc("ptr-intwalk", {
    code: `int arr[] = {${v0}, ${v1}, ${v2}, ${v3}};\nint *p = arr;\np++;`,
    prompt: `What is *p after p++?`,
    correct: `${v1}`,
    distractors: [`${v0}`, `${v2}`, `The byte immediately after arr`],
  });
}

function t_pointerSize(): Question {
  const pointee = pick(["int", "char", "double", "struct Node"]);
  return mc("ptr-size", {
    code: `${pointee} *p;`,
    prompt: `On a typical 64-bit system, what is sizeof(p)?`,
    correct: `8 bytes`,
    distractors: [`4 bytes`, `Depends on ${pointee}'s size`, `1 byte`],
  });
}

function t_pointerEquality(): Question {
  const [v] = distinctVars(1);
  const n = randInt(1, 99);
  return mc("ptr-equality", {
    code: `int ${v} = ${n};\nint *p1 = &${v};\nint *p2 = &${v};`,
    prompt: `Is the expression (p1 == p2) true or false?`,
    correct: `True \u2014 both point to the same address`,
    distractors: [`False \u2014 they are different pointers`, `Compilation error`, `Undefined behavior`],
  });
}

function t_danglingReturn(): Question {
  const [v] = distinctVars(1);
  const fnName = `make${v.charAt(0).toUpperCase()}${v.slice(1)}`;
  return mc("ptr-dangling", {
    code: `int *${fnName}() {\n  int ${v} = 42;\n  return &${v};\n}`,
    prompt: `What happens when the caller dereferences the returned pointer?`,
    correct: `Undefined behavior \u2014 ${v} no longer exists (dangling pointer)`,
    distractors: [`It safely returns 42`, `Compilation error`, `It always returns 0`],
  });
}

function t_constAssign(): Question {
  const [v] = distinctVars(1);
  const n = randInt(1, 99);
  const m = randInt(1, 99);
  return mc("ptr-const", {
    code: `const int ${v} = ${n};\nint *p = &${v};\n*p = ${m};`,
    prompt: `What happens with this code?`,
    correct: `Compiler warning/error \u2014 discards the const qualifier`,
    distractors: [`${v} becomes ${m} normally`, `Segmentation fault at runtime`, `Nothing \u2014 this is standard practice`],
  });
}

function t_doublePointerModify(): Question {
  const [v] = distinctVars(1);
  const n = randInt(1, 50);
  const m = randInt(51, 99);
  return mc("ptr-doublemod", {
    code: `void update(int **pp) { **pp = ${m}; }\nint ${v} = ${n};\nint *p = &${v};\nupdate(&p);`,
    prompt: `What is the value of ${v} after update(&p)?`,
    correct: `${m}`,
    distractors: [`${n}`, `Compilation error`, `The address of p`],
  });
}

const POINTER_TEMPLATES = [
  t_pointerBasicDeref,
  t_pointerWriteThrough,
  t_doublePointerRead,
  t_charDeref,
  t_nullDeref,
  t_repoint,
  t_intArrayWalk,
  t_pointerSize,
  t_pointerEquality,
  t_danglingReturn,
  t_constAssign,
  t_doublePointerModify,
];

/* ============================= ARRAY TEMPLATES ============================ */

function t_arrayIndex(): Question {
  const vals = Array.from({ length: 5 }, () => randInt(1, 99));
  const idx = randInt(0, 4);
  return mc("arr-index", {
    code: `int arr[] = {${vals.join(", ")}};`,
    prompt: `What is arr[${idx}]?`,
    correct: `${vals[idx]}`,
    distractors: numericDistractors(vals[idx], 3, 15).map(String),
  });
}

function t_arrayPointerEquiv(): Question {
  const vals = Array.from({ length: 5 }, () => randInt(1, 99));
  const idx = randInt(0, 4);
  return mc("arr-equiv", {
    code: `int arr[] = {${vals.join(", ")}};`,
    prompt: `What is *(arr + ${idx})?`,
    correct: `${vals[idx]}`,
    distractors: numericDistractors(vals[idx], 3, 15).map(String),
  });
}

function t_arrayDecay(): Question {
  const [v] = distinctVars(1);
  return mc("arr-decay", {
    code: `int ${v}[10];`,
    prompt: `When ${v} is used in most expressions, what does it decay into?`,
    correct: `A pointer to its first element (&${v}[0])`,
    distractors: [`A copy of the entire array`, `The number 10`, `A null pointer`],
  });
}

function t_sizeofArray(): Question {
  const size = randInt(3, 20);
  return mc("arr-sizeof", {
    code: `int arr[${size}]; // int is 4 bytes on this system`,
    prompt: `What is sizeof(arr)?`,
    correct: `${size * 4} bytes`,
    distractors: [`${size} bytes`, `4 bytes`, `8 bytes`],
  });
}

function t_sizeofParam(): Question {
  const size = randInt(3, 20);
  return mc("arr-sizeofparam", {
    code: `void f(int arr[]) {\n  printf("%zu", sizeof(arr));\n}\n// called with an array of ${size} ints`,
    prompt: `What does sizeof(arr) print inside f (on a typical 64-bit system)?`,
    correct: `8 \u2014 sizeof a pointer, since arr decayed to int*`,
    distractors: [`${size * 4} \u2014 the full array size`, `${size}`, `0`],
  });
}

function t_grid2D(): Question {
  const rows = 3;
  const cols = 3;
  const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => randInt(1, 99)));
  const i = randInt(0, rows - 1);
  const j = randInt(0, cols - 1);
  const codeRows = grid.map((r) => `{${r.join(", ")}}`).join(", ");
  return mc("arr-2d", {
    code: `int grid[${rows}][${cols}] = {${codeRows}};`,
    prompt: `What is grid[${i}][${j}]?`,
    correct: `${grid[i][j]}`,
    distractors: numericDistractors(grid[i][j], 3, 15).map(String),
  });
}

function t_outOfBounds(): Question {
  const size = randInt(3, 10);
  return mc("arr-oob", {
    code: `int arr[${size}];\n// accessing arr[${size}]  (one past the end)`,
    prompt: `What is the risk of this access?`,
    correct: `Undefined behavior \u2014 may read garbage memory or crash`,
    distractors: [`It safely returns 0`, `Compilation error`, `It wraps around to arr[0]`],
  });
}

function t_ptrOffsetWalk(): Question {
  const vals = Array.from({ length: 6 }, () => randInt(1, 99));
  const k = randInt(1, 5);
  return mc("arr-offsetwalk", {
    code: `int arr[] = {${vals.join(", ")}};\nint *p = arr;\np += ${k};`,
    prompt: `What is *p after p += ${k}?`,
    correct: `${vals[k]}`,
    distractors: numericDistractors(vals[k], 3, 15).map(String),
  });
}

function t_arrOfPtrsVsPtrToArr(): Question {
  const size = randInt(3, 10);
  return mc("arr-ptrsvsarr", {
    code: `int *parr[${size}];\nint (*arrp)[${size}];`,
    prompt: `Which declaration is an array of pointers?`,
    correct: `int *parr[${size}]`,
    distractors: [`int (*arrp)[${size}]`, `Both are arrays of pointers`, `Neither \u2014 both are pointers to arrays`],
  });
}

function t_charArrayIndex(): Question {
  const words = ["POINTER", "MEMORY", "SEGFAULT", "VECTOR", "KERNEL", "BUFFER", "STACK", "HEAP", "ARRAY", "OFFSET"];
  const w = pick(words);
  const idx = randInt(0, w.length - 1);
  const correctChar = w[idx];
  const pool = Array.from(new Set((w + "ABCDEFGHIJKLMNOPQRSTUVWXYZ").split(""))).filter((c) => c !== correctChar);
  const distractors = shuffle(pool).slice(0, 3);
  return mc("arr-charindex", {
    code: `char str[] = "${w}";`,
    prompt: `What is str[${idx}]?`,
    correct: `'${correctChar}'`,
    distractors: distractors.map((c) => `'${c}'`),
  });
}

function t_addrArrVsElem(): Question {
  const [v] = distinctVars(1);
  return mc("arr-addrvs", {
    code: `int ${v}[10];`,
    prompt: `How do &${v} and &${v}[0] compare?`,
    correct: `Same numeric address, but different pointer types`,
    distractors: [`&${v} is always 0`, `They point to completely different memory`, `&${v}[0] is invalid`],
  });
}

function t_arrayParamSize(): Question {
  const size = randInt(5, 20);
  return mc("arr-paramsize", {
    code: `void f(int arr[${size}]) { /* ... */ }`,
    prompt: `Inside f, does the function actually know the array has ${size} elements?`,
    correct: `No \u2014 the size is not preserved; arr is just a pointer`,
    distractors: [`Yes, sizeof(arr) reveals it`, `Only if ${size} is a power of 2`, `Yes, but only in debug builds`],
  });
}

const ARRAY_TEMPLATES = [
  t_arrayIndex,
  t_arrayPointerEquiv,
  t_arrayDecay,
  t_sizeofArray,
  t_sizeofParam,
  t_grid2D,
  t_outOfBounds,
  t_ptrOffsetWalk,
  t_arrOfPtrsVsPtrToArr,
  t_charArrayIndex,
  t_addrArrVsElem,
  t_arrayParamSize,
];

/* =========================== REFERENCE TEMPLATES ========================== */

function t_swap(): Question {
  const n1 = randInt(1, 50);
  const n2 = randInt(51, 99);
  return mc("ref-swap", {
    code: `void swap(int *a, int *b) {\n  int t = *a;\n  *a = *b;\n  *b = t;\n}\nint x = ${n1}, y = ${n2};\nswap(&x, &y);`,
    prompt: `What is the value of x after swap(&x, &y)?`,
    correct: `${n2}`,
    distractors: [`${n1}`, `Compilation error`, `Undefined \u2014 swap doesn't affect x`],
  });
}

function t_passByValue(): Question {
  const [v] = distinctVars(1);
  const n = randInt(1, 99);
  return mc("ref-byvalue", {
    code: `void inc(int n) { n++; }\nint ${v} = ${n};\ninc(${v});`,
    prompt: `What is ${v} after inc(${v})?`,
    correct: `${n} \u2014 unchanged`,
    distractors: [`${n + 1}`, `Compilation error`, `Undefined behavior`],
  });
}

function t_passByPointer(): Question {
  const [v] = distinctVars(1);
  const n = randInt(1, 99);
  return mc("ref-bypointer", {
    code: `void inc(int *n) { (*n)++; }\nint ${v} = ${n};\ninc(&${v});`,
    prompt: `What is ${v} after inc(&${v})?`,
    correct: `${n + 1}`,
    distractors: [`${n}`, `Compilation error`, `Undefined \u2014 need to dereference at the call site`],
  });
}

function t_outParam(): Question {
  const v = randInt(2, 25);
  return mc("ref-outparam", {
    code: `void getSquare(int val, int *out) {\n  *out = val * val;\n}\nint result;\ngetSquare(${v}, &result);`,
    prompt: `What is result after this call?`,
    correct: `${v * v}`,
    distractors: numericDistractors(v * v, 3, 10).map(String),
  });
}

function t_ampMeaning(): Question {
  return mc("ref-amp", {
    prompt: `What does the & operator do when placed directly before a variable name?`,
    correct: `Returns the memory address of the variable`,
    distractors: [`Returns the value stored in the variable`, `Declares a new pointer variable`, `Performs a bitwise AND`],
  });
}

function t_starDualMeaning(): Question {
  return mc("ref-star", {
    code: `int *p;\nint x = *p;`,
    prompt: `What does * mean in "int *p;" versus "int x = *p;" respectively?`,
    correct: `Declares p as a pointer; then dereferences p to read its value`,
    distractors: [`Multiplies p by x in both cases`, `Declares an array; then indexes it`, `Both lines mean the same thing`],
  });
}

function t_modifyElement(): Question {
  const vals = Array.from({ length: 5 }, () => randInt(1, 20));
  const idx = randInt(0, 4);
  const original = vals[idx];
  return mc("ref-modifyelem", {
    code: `void doubleIt(int *p) { *p *= 2; }\nint arr[] = {${vals.join(", ")}};\ndoubleIt(&arr[${idx}]);`,
    prompt: `What is arr[${idx}] after doubleIt(&arr[${idx}])?`,
    correct: `${original * 2}`,
    distractors: numericDistractors(original * 2, 3, 10).map(String),
  });
}

function t_structPassRationale(): Question {
  return mc("ref-structrationale", {
    prompt: `Why do C programmers often pass large structs by pointer instead of by value?`,
    correct: `To avoid copying the whole struct and to allow the function to modify the caller's copy`,
    distractors: [`Because C cannot copy structs at all`, `It makes the code compile faster`, `Pointers are required by the C standard for structs`],
  });
}

function t_nullCheckRationale(): Question {
  const [v] = distinctVars(1);
  return mc("ref-nullcheck", {
    code: `if (${v} != NULL) {\n  *${v} = 10;\n}`,
    prompt: `Why check "${v} != NULL" before dereferencing?`,
    correct: `To avoid dereferencing a null pointer, which causes a segmentation fault`,
    distractors: [`It's just a style preference with no real effect`, `To make the pointer faster`, `NULL pointers always equal 0 automatically`],
  });
}

function t_noReferencesInC(): Question {
  return mc("ref-noreftruth", {
    prompt: `Strictly speaking, does the C language have true "reference" types like C++?`,
    correct: `No \u2014 C only has pointers; "pass by reference" is simulated using pointers`,
    distractors: [`Yes, C references work exactly like C++ references`, `Yes, but only for arrays`, `Yes, but only inside structs`],
  });
}

const REFERENCE_TEMPLATES = [
  t_swap,
  t_passByValue,
  t_passByPointer,
  t_outParam,
  t_ampMeaning,
  t_starDualMeaning,
  t_modifyElement,
  t_structPassRationale,
  t_nullCheckRationale,
  t_noReferencesInC,
];

/* ============================ ADDRESS TEMPLATES ============================ */

function t_addressOfMeaning(): Question {
  const [v] = distinctVars(1);
  const n = randInt(1, 99);
  return mc("addr-meaning", {
    code: `int ${v} = ${n};`,
    prompt: `What does &${v} represent?`,
    correct: `The memory address where ${v} is stored`,
    distractors: [`The value ${n} itself`, `The size of ${v} in bytes`, `A copy of ${v}`],
  });
}

function t_percentPPrint(): Question {
  const [v] = distinctVars(1);
  const n = randInt(1, 99);
  return mc("addr-percentp", {
    code: `int ${v} = ${n};\nprintf("%p", (void*)&${v});`,
    prompt: `What does this print?`,
    correct: `The memory address of ${v} (an implementation-specific hex value)`,
    distractors: [`${n} in hexadecimal`, `The literal text "%p"`, `Always 0x0`],
  });
}

function t_addrArithInt(): Question {
  const idx = randInt(0, 5);
  return mc("addr-arithint", {
    code: `int arr[10];\nint *p = &arr[${idx}];`,
    prompt: `What address does p + 1 point to (assuming int is 4 bytes)?`,
    correct: `The address of arr[${idx + 1}] \u2014 4 bytes further`,
    distractors: [`The address of arr[${idx}] plus 1 byte`, `The same address as p`, `The address of arr[${Math.max(idx - 1, 0)}]`],
  });
}

function t_addressAdjacency(): Question {
  const [v1, v2] = distinctVars(2);
  return mc("addr-adjacency", {
    code: `int ${v1}, ${v2};`,
    prompt: `Are &${v1} and &${v2} guaranteed to be next to each other in memory?`,
    correct: `No \u2014 the compiler may place local variables anywhere`,
    distractors: [`Yes, always adjacent`, `Yes, but only for global variables`, `Only if declared with the same type`],
  });
}

function t_nullValue(): Question {
  return mc("addr-nullvalue", {
    prompt: `What does NULL conventionally represent in C?`,
    correct: `An invalid address, typically implemented as 0`,
    distractors: [`The largest possible address`, `The address of the first global variable`, `A special data type`],
  });
}

function t_derefNullCrash(): Question {
  const m = randInt(1, 99);
  return mc("addr-derefnull", {
    code: `int *p = NULL;\n*p = ${m};`,
    prompt: `What happens when this line executes?`,
    correct: `Segmentation fault \u2014 the program crashes accessing address 0`,
    distractors: [`${m} is stored at address 0 safely`, `Compilation error`, `p is automatically reassigned`],
  });
}

function t_uninitPointer(): Question {
  const m = randInt(1, 99);
  return mc("addr-uninit", {
    code: `int *p;\n*p = ${m};`,
    prompt: `p was never initialized. What is the risk of this code?`,
    correct: `Undefined behavior \u2014 p holds a garbage address, likely a segfault`,
    distractors: [`${m} is safely discarded`, `p automatically becomes NULL`, `Compilation error`],
  });
}

function t_stackLocation(): Question {
  const [v] = distinctVars(1);
  return mc("addr-stack", {
    code: `void f() {\n  int ${v} = 5;\n}`,
    prompt: `Which memory region does local variable ${v} live in?`,
    correct: `The stack`,
    distractors: [`The heap`, `Read-only program memory`, `A CPU register only`],
  });
}

function t_heapLocation(): Question {
  return mc("addr-heap", {
    code: `int *p = malloc(sizeof(int));`,
    prompt: `Where does the memory that p points to live?`,
    correct: `The heap`,
    distractors: [`The stack`, `Inside the pointer itself`, `Read-only program memory`],
  });
}

function t_danglingAfterFree(): Question {
  const m = randInt(1, 99);
  return mc("addr-danglingfree", {
    code: `free(p);\n*p = ${m};`,
    prompt: `What is this pattern called, and what's the risk?`,
    correct: `A dangling pointer (use-after-free) \u2014 undefined behavior`,
    distractors: [`Safe, because free() clears the memory`, `A memory leak`, `A compiler-checked error`],
  });
}

function t_memoryLeak(): Question {
  const size = randInt(4, 64);
  return mc("addr-leak", {
    code: `int *p = malloc(${size});\n// p goes out of scope without being freed`,
    prompt: `What has happened here?`,
    correct: `A memory leak \u2014 the allocated memory is unreachable but never freed`,
    distractors: [`A segmentation fault`, `The memory is freed automatically`, `A dangling pointer`],
  });
}

function t_charPtrArith(): Question {
  const k = randInt(1, 10);
  const candidates = new Set<number>();
  [k - 2, k - 1, k + 1, k + 2, k + 3].forEach((v) => {
    if (v >= 0 && v !== k) candidates.add(v);
  });
  const distractors = Array.from(candidates).slice(0, 3);
  return mc("addr-chararith", {
    code: `char *p = someAddress;\np = p + ${k};`,
    prompt: `How many bytes further does p point to now (char is 1 byte)?`,
    correct: `${k} byte${k === 1 ? "" : "s"} further`,
    distractors: distractors.map((n) => `${n} byte${n === 1 ? "" : "s"} further`),
  });
}

const ADDRESS_TEMPLATES = [
  t_addressOfMeaning,
  t_percentPPrint,
  t_addrArithInt,
  t_addressAdjacency,
  t_nullValue,
  t_derefNullCrash,
  t_uninitPointer,
  t_stackLocation,
  t_heapLocation,
  t_danglingAfterFree,
  t_memoryLeak,
  t_charPtrArith,
];

const TEMPLATES_BY_LEVEL: Record<LevelKey, (() => Question)[]> = {
  pointers: POINTER_TEMPLATES,
  arrays: ARRAY_TEMPLATES,
  references: REFERENCE_TEMPLATES,
  addresses: ADDRESS_TEMPLATES,
};

/* ------------------------------- maze grid -------------------------------- */

function MazeGrid({
  qIndex,
  total,
  accent,
}: {
  qIndex: number;
  total: number;
  accent: (typeof ACCENTS)[Accent];
}) {
  const grid: number[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  MAZE_PATH.forEach((cell, i) => {
    grid[cell.row][cell.col] = i;
  });

  return (
    <div
      className="mx-auto grid w-full max-w-[280px] gap-1"
      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
    >
      {grid.map((row, r) =>
        row.map((i, c) => {
          const isExit = i === total - 1;
          const state = i < qIndex ? "visited" : i === qIndex ? "current" : "upcoming";
          return (
            <div
              key={`${r}-${c}`}
              className={
                "flex aspect-square items-center justify-center rounded-[4px] border text-[10px] font-mono transition-colors duration-200 " +
                (state === "current"
                  ? `${accent.solidBg} border-transparent text-white ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-950 ${accent.ring} animate-pulse`
                  : state === "visited"
                  ? `${accent.chip} border-transparent`
                  : "border-slate-200 bg-slate-100 text-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-700")
              }
            >
              {state === "visited" && "\u2713"}
              {state === "current" && "\u25CF"}
              {state === "upcoming" && isExit && "\u2691"}
            </div>
          );
        })
      )}
    </div>
  );
}

/* --------------------------------- page ----------------------------------- */

export default function PointerMazePage() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [levelIndex, setLevelIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [maxTime, setMaxTime] = useState(1);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [unlockedUpTo, setUnlockedUpTo] = useState(0);
  const [bestScores, setBestScores] = useState<Partial<Record<LevelKey, number>>>({});

  useEffect(() => {
    const p = loadProgress();
    setUnlockedUpTo(p.unlockedUpTo);
    setBestScores(p.bestScores);
  }, []);

  const level = LEVELS[levelIndex];
  const accent = ACCENTS[level.accent];
  const currentQuestion = questions[qIndex];

  const startLevel = useCallback((idx: number) => {
    const lvl = LEVELS[idx];
    setLevelIndex(idx);
    setQuestions(buildLevelQuestions(TEMPLATES_BY_LEVEL[lvl.key], QUESTIONS_PER_LEVEL));
    setQIndex(0);
    setLives(START_LIVES);
    setScore(0);
    setCombo(0);
    setFeedback(null);
    setScreen("playing");
  }, []);

  /* reset timer on new question / level */
  useEffect(() => {
    if (screen !== "playing") return;
    const t = timeForQuestion(level, qIndex);
    setTimeLeft(t);
    setMaxTime(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, levelIndex, screen]);

  /* ticking countdown */
  useEffect(() => {
    if (screen !== "playing" || feedback) return;
    const id = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(0, +(prev - 0.1).toFixed(1)));
    }, 100);
    return () => window.clearInterval(id);
  }, [screen, feedback, qIndex, levelIndex]);

  const advance = useCallback(
    (nextLives: number) => {
      if (nextLives <= 0) {
        setScreen("gameover");
        return;
      }
      const next = qIndex + 1;
      if (next >= questions.length) {
        const newBest = Math.max(bestScores[level.key] ?? 0, score);
        const newUnlocked = Math.max(unlockedUpTo, levelIndex + 1);
        const newBestScores = { ...bestScores, [level.key]: newBest };
        setBestScores(newBestScores);
        setUnlockedUpTo(newUnlocked);
        saveProgress({ unlockedUpTo: newUnlocked, bestScores: newBestScores });
        setScreen("complete");
      } else {
        setQIndex(next);
      }
    },
    [qIndex, questions.length, bestScores, level.key, score, unlockedUpTo, levelIndex]
  );

  useEffect(() => {
    if (!feedback) return;
    const delay = feedback.type === "correct" ? 650 : 1200;
    const id = window.setTimeout(() => {
      const nextLives = feedback.livesLeft;
      setFeedback(null);
      advance(nextLives);
    }, delay);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  const handleAnswer = useCallback(
    (index: number) => {
      if (feedback || !currentQuestion || timeLeft <= 0) return;
      const isCorrect = index === currentQuestion.correctIndex;
      if (isCorrect) {
        const bonus = Math.round(timeLeft * 8) + combo * 15;
        const points = 100 + bonus;
        setScore((s) => s + points);
        setCombo((c) => c + 1);
        setFeedback({ type: "correct", points, selectedIndex: index, livesLeft: lives });
      } else {
        const nextLives = lives - 1;
        setLives(nextLives);
        setCombo(0);
        setFeedback({ type: "wrong", selectedIndex: index, livesLeft: nextLives });
      }
    },
    [feedback, currentQuestion, timeLeft, combo, lives]
  );

  /* timeout detection */
  useEffect(() => {
    if (screen !== "playing" || feedback || !currentQuestion) return;
    if (timeLeft <= 0) {
      const nextLives = lives - 1;
      setLives(nextLives);
      setCombo(0);
      setFeedback({ type: "timeout", livesLeft: nextLives });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  /* keyboard shortcuts 1-4 / a-d */
  useEffect(() => {
    if (screen !== "playing" || feedback) return;
    function onKey(e: KeyboardEvent) {
      const map: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      const key = e.key.toLowerCase();
      if (key in map) handleAnswer(map[key]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, feedback, handleAnswer]);

  const chargePct = maxTime > 0 ? Math.max(0, Math.min(100, (timeLeft / maxTime) * 100)) : 0;
  const chargeColor =
    chargePct > 50 ? "bg-emerald-500" : chargePct > 20 ? "bg-amber-500" : "bg-rose-500 animate-pulse";
  const isGlitching = feedback?.type === "wrong" || feedback?.type === "timeout";

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <style>{`
        @keyframes segfault-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .segfault-shake { animation: segfault-shake 0.4s ease-in-out; }
      `}</style>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        {screen === "menu" && (
          <MenuScreen unlockedUpTo={unlockedUpTo} bestScores={bestScores} onSelect={startLevel} />
        )}

        {screen === "playing" && currentQuestion && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setScreen("menu")}
                className="font-mono text-xs uppercase tracking-widest text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                &larr; Menu
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: START_LIVES }).map((_, i) => (
                  <span key={i} className={i < lives ? "text-rose-500" : "text-slate-200 dark:text-slate-800"}>
                    &#9829;
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className={`font-mono text-xs uppercase tracking-widest ${accent.text}`}>
                  {level.address} &middot; {level.name}
                </p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Cell {qIndex + 1} / {questions.length}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg font-bold tabular-nums">{score}</p>
                {combo > 1 && (
                  <p className={`font-mono text-xs font-semibold ${accent.text}`}>&times;{combo} combo</p>
                )}
              </div>
            </div>

            <MazeGrid qIndex={qIndex} total={questions.length} accent={accent} />

            <div
              className={`relative overflow-hidden rounded-2xl border p-6 sm:p-7 ${isGlitching ? "segfault-shake" : ""} ${
                feedback?.type === "correct"
                  ? "border-emerald-300 dark:border-emerald-800"
                  : isGlitching
                  ? "border-rose-300 dark:border-rose-800"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {currentQuestion.code && (
                <div className="overflow-hidden rounded-xl bg-slate-900 dark:bg-black/60">
                  <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500/70" />
                    <span className="h-2 w-2 rounded-full bg-amber-500/70" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                  </div>
                  <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-slate-100">
                    {currentQuestion.code}
                  </pre>
                </div>
              )}

              <p className="mt-4 text-base font-semibold sm:text-lg">{currentQuestion.prompt}</p>

              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-[width] duration-100 ease-linear ${chargeColor}`}
                  style={{ width: `${chargePct}%` }}
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((opt, i) => {
                  const letter = ["A", "B", "C", "D"][i];
                  let stateClasses =
                    "border-slate-300 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500";
                  if (feedback) {
                    if (i === currentQuestion.correctIndex) {
                      stateClasses =
                        "border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
                    } else if (i === feedback.selectedIndex) {
                      stateClasses =
                        "border-rose-400 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-300";
                    } else {
                      stateClasses =
                        "border-slate-200 bg-slate-50 text-slate-400 opacity-60 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-600";
                    }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={!!feedback}
                      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${stateClasses}`}
                    >
                      <span
                        className={`flex h-5 w-5 flex-none items-center justify-center rounded-full font-mono text-xs font-bold ${accent.chip}`}
                      >
                        {letter}
                      </span>
                      <span className="pt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div
                  className={`mt-4 text-center font-mono text-sm font-semibold ${
                    feedback.type === "correct" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {feedback.type === "correct" && `VARIABLE COLLECTED  +${feedback.points}`}
                  {feedback.type === "wrong" && "SEGMENTATION FAULT"}
                  {feedback.type === "timeout" && "ADDRESS EXPIRED"}
                </div>
              )}
            </div>
          </div>
        )}

        {screen === "complete" && (
          <CompleteScreen
            level={level}
            score={score}
            lives={lives}
            hasNext={levelIndex < LEVELS.length - 1}
            onReplay={() => startLevel(levelIndex)}
            onNext={() => startLevel(levelIndex + 1)}
            onMenu={() => setScreen("menu")}
          />
        )}

        {screen === "gameover" && (
          <GameOverScreen
            level={level}
            score={score}
            progress={qIndex + 1}
            total={questions.length}
            onRetry={() => startLevel(levelIndex)}
            onMenu={() => setScreen("menu")}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------ sub screens -------------------------------- */

function MenuScreen({
  unlockedUpTo,
  bestScores,
  onSelect,
}: {
  unlockedUpTo: number;
  bestScores: Partial<Record<LevelKey, number>>;
  onSelect: (idx: number) => void;
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">
        develop / pointer-maze
      </p>
      <h1 className="mt-2 font-mono text-4xl font-black tracking-tight sm:text-5xl">POINTER MAZE</h1>
      <p className="font-mono text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
        C Language
      </p>
      <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">
        Navigate memory. Avoid the segmentation fault. Collect every variable before
        the address expires. Four memory blocks, 64 unique questions each.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {LEVELS.map((lvl, idx) => {
          const unlocked = idx <= unlockedUpTo;
          const accent = ACCENTS[lvl.accent];
          const best = bestScores[lvl.key];
          return (
            <button
              key={lvl.key}
              onClick={() => unlocked && onSelect(idx)}
              disabled={!unlocked}
              className={`group relative rounded-2xl border p-5 text-left transition ${
                unlocked
                  ? "border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60"
                  : "cursor-not-allowed border-slate-100 bg-slate-50/50 opacity-60 dark:border-slate-900 dark:bg-slate-900/20"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={`font-mono text-xs font-semibold tracking-widest ${accent.text}`}>{lvl.address}</span>
                {!unlocked && <span className="text-xs text-slate-400 dark:text-slate-600">&#128274;</span>}
              </div>
              <h2 className="mt-2 font-mono text-xl font-bold">{lvl.name}</h2>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{lvl.tagline}</p>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-500">{lvl.flavor}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 dark:text-slate-600">64 cells</span>
                {best !== undefined && (
                  <span className={`font-mono font-semibold ${accent.text}`}>best {best}</span>
                )}
                {best === undefined && unlocked && (
                  <span className="font-mono text-slate-400 dark:text-slate-600">not played</span>
                )}
                {!unlocked && <span className="font-mono text-slate-400 dark:text-slate-600">complete previous</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompleteScreen({
  level,
  score,
  lives,
  hasNext,
  onReplay,
  onNext,
  onMenu,
}: {
  level: LevelMeta;
  score: number;
  lives: number;
  hasNext: boolean;
  onReplay: () => void;
  onNext: () => void;
  onMenu: () => void;
}) {
  const accent = ACCENTS[level.accent];
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <p className={`font-mono text-xs uppercase tracking-widest ${accent.text}`}>
        {level.address} &middot; {level.name} cleared
      </p>
      <h1 className="font-mono text-3xl font-black">MEMORY BLOCK SECURED</h1>
      <div className="text-5xl">
        {"\u2605".repeat(lives)}
        <span className="text-slate-200 dark:text-slate-800">{"\u2605".repeat(START_LIVES - lives)}</span>
      </div>
      <p className="font-mono text-lg">
        Final score: <span className="font-bold">{score}</span>
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          onClick={onReplay}
          className="rounded-xl border border-slate-300 px-5 py-2.5 font-mono text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          Replay
        </button>
        {hasNext && (
          <button
            onClick={onNext}
            className={`rounded-xl px-5 py-2.5 font-mono text-sm font-bold uppercase text-white transition hover:brightness-110 ${accent.solidBg}`}
          >
            Next Block &rarr;
          </button>
        )}
        <button
          onClick={onMenu}
          className="rounded-xl border border-slate-300 px-5 py-2.5 font-mono text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          Menu
        </button>
      </div>
    </div>
  );
}

function GameOverScreen({
  level,
  score,
  progress,
  total,
  onRetry,
  onMenu,
}: {
  level: LevelMeta;
  score: number;
  progress: number;
  total: number;
  onRetry: () => void;
  onMenu: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-rose-500">
        {level.address} &middot; {level.name}
      </p>
      <h1 className="font-mono text-3xl font-black text-rose-600 dark:text-rose-400">
        SEGMENTATION FAULT
      </h1>
      <p className="font-mono text-xs text-slate-400 dark:text-slate-600">core dumped</p>
      <p className="text-slate-600 dark:text-slate-400">
        You held the block for {progress} of {total} cells.
      </p>
      <p className="font-mono text-lg">
        Score: <span className="font-bold">{score}</span>
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          onClick={onRetry}
          className="rounded-xl bg-rose-500 px-5 py-2.5 font-mono text-sm font-bold uppercase text-white transition hover:brightness-110"
        >
          Retry Block
        </button>
        <button
          onClick={onMenu}
          className="rounded-xl border border-slate-300 px-5 py-2.5 font-mono text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          Menu
        </button>
      </div>
    </div>
  );
}