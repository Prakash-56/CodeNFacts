// AUTO-GENERATED question bank for Code Detective.
// TODO(backend): eventually move this to a database / CMS so questions
// can be added without a redeploy, and so per-user progress can be tracked server-side.

export type BugCategory = "syntax" | "logic" | "runtime" | "complexity" | "memory";
export type CodeLanguage = "python" | "javascript" | "c" | "java";

export interface DetectiveQuestion {
  id: string;
  level: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: BugCategory;
  language: CodeLanguage;
  code: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const DETECTIVE_QUESTIONS: DetectiveQuestion[] = [
  {
    id: "cd-0001",
    level: 1,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `vals = [45, 35, 27]

for i in range(len(vals)):
print(vals[i])`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Missing closing bracket in the list", "Missing indentation before the print statement", "Wrong variable used inside the loop"],
    correctIndex: 2,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0002",
    level: 2,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `data = [45, 28, 22]

for i in range(len(data)):
print(data[i])`,
    question: "What's wrong with this code?",
    options: ["Missing closing bracket in the list", "Missing indentation before the print statement", "Wrong variable used inside the loop", "The loop never terminates (infinite loop)"],
    correctIndex: 1,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0003",
    level: 3,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `a = [6, 25, 7]

for i in range(len(a)):
print(a[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop", "Missing closing bracket in the list", "Missing indentation before the print statement", "The loop never terminates (infinite loop)"],
    correctIndex: 2,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0004",
    level: 4,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `ys = [35, 8, 25]

for i in range(len(ys)):
print(ys[i])`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Missing indentation before the print statement", "Missing closing bracket in the list", "Wrong variable used inside the loop"],
    correctIndex: 1,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0005",
    level: 5,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `xs = [46, 5, 3]

for i in range(len(xs)):
print(xs[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop", "The loop never terminates (infinite loop)", "Missing indentation before the print statement", "Missing closing bracket in the list"],
    correctIndex: 2,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0006",
    level: 6,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `queue = [7, 25, 18]

for i in range(len(queue)):
print(queue[i])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before the print statement", "The loop never terminates (infinite loop)", "Wrong variable used inside the loop", "Missing closing bracket in the list"],
    correctIndex: 0,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0007",
    level: 7,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `values = [14, 43, 18]

for i in range(len(values)):
print(values[i])`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Missing indentation before the print statement", "Missing closing bracket in the list", "Wrong variable used inside the loop"],
    correctIndex: 1,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0008",
    level: 8,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `series = [11, 30, 25]

for i in range(len(series)):
print(series[i])`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Wrong variable used inside the loop", "Missing indentation before the print statement", "Missing closing bracket in the list"],
    correctIndex: 2,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0009",
    level: 9,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `nums = [3, 21, 26]

for i in range(len(nums)):
print(nums[i])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before the print statement", "Wrong variable used inside the loop", "Missing closing bracket in the list", "The loop never terminates (infinite loop)"],
    correctIndex: 0,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0010",
    level: 10,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `ids = [14, 42, 32]

for i in range(len(ids)):
print(ids[i])`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Missing indentation before the print statement", "Wrong variable used inside the loop", "Missing closing bracket in the list"],
    correctIndex: 1,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0011",
    level: 11,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `record = [16, 48, 36]

for i in range(len(record)):
print(record[i])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before the print statement", "Missing closing bracket in the list", "Wrong variable used inside the loop", "The loop never terminates (infinite loop)"],
    correctIndex: 0,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0012",
    level: 12,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `counts = [24, 15, 9]

for i in range(len(counts)):
print(counts[i])`,
    question: "What's wrong with this code?",
    options: ["Missing closing bracket in the list", "Wrong variable used inside the loop", "The loop never terminates (infinite loop)", "Missing indentation before the print statement"],
    correctIndex: 3,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0013",
    level: 13,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `arr = [10, 41, 11]

for i in range(len(arr)):
print(arr[i])`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Wrong variable used inside the loop", "Missing closing bracket in the list", "Missing indentation before the print statement"],
    correctIndex: 3,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0014",
    level: 14,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `heights = [39, 30, 34]

for i in range(len(heights)):
print(heights[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop", "The loop never terminates (infinite loop)", "Missing closing bracket in the list", "Missing indentation before the print statement"],
    correctIndex: 3,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0015",
    level: 15,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `prices = [50, 42, 22]

for i in range(len(prices)):
print(prices[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop", "The loop never terminates (infinite loop)", "Missing indentation before the print statement", "Missing closing bracket in the list"],
    correctIndex: 2,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0016",
    level: 16,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `buf = [1, 47, 47]

for i in range(len(buf)):
print(buf[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop", "The loop never terminates (infinite loop)", "Missing closing bracket in the list", "Missing indentation before the print statement"],
    correctIndex: 3,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0017",
    level: 17,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `weights = [41, 33, 39]

for i in range(len(weights)):
print(weights[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop", "Missing closing bracket in the list", "Missing indentation before the print statement", "The loop never terminates (infinite loop)"],
    correctIndex: 2,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0018",
    level: 18,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `marks = [39, 21, 32]

for i in range(len(marks)):
print(marks[i])`,
    question: "What's wrong with this code?",
    options: ["Missing closing bracket in the list", "Missing indentation before the print statement", "Wrong variable used inside the loop", "The loop never terminates (infinite loop)"],
    correctIndex: 1,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0019",
    level: 19,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `items = [4, 16, 37]

for i in range(len(items)):
print(items[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop", "The loop never terminates (infinite loop)", "Missing indentation before the print statement", "Missing closing bracket in the list"],
    correctIndex: 2,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0020",
    level: 20,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `lst = [9, 43, 31]

for i in range(len(lst)):
print(lst[i])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before the print statement", "Wrong variable used inside the loop", "The loop never terminates (infinite loop)", "Missing closing bracket in the list"],
    correctIndex: 0,
    explanation: "Python uses indentation to define blocks. Since `print(...)` isn't indented under the `for` line, Python raises an IndentationError instead of treating it as the loop body.",
  },
  {
    id: "cd-0021",
    level: 21,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(1, 5
print(result)`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Missing indentation in the function body", "Missing closing parenthesis in the function call", "Wrong variable used in the return statement"],
    correctIndex: 2,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0022",
    level: 22,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(22, 5
print(result)`,
    question: "What's wrong with this code?",
    options: ["Missing closing parenthesis in the function call", "Wrong variable used in the return statement", "The function call creates an infinite loop", "Missing indentation in the function body"],
    correctIndex: 0,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0023",
    level: 23,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(14, 35
print(result)`,
    question: "What's wrong with this code?",
    options: ["Missing closing parenthesis in the function call", "Wrong variable used in the return statement", "Missing indentation in the function body", "The function call creates an infinite loop"],
    correctIndex: 0,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0024",
    level: 24,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(13, 7
print(result)`,
    question: "What's wrong with this code?",
    options: ["Missing closing parenthesis in the function call", "Missing indentation in the function body", "The function call creates an infinite loop", "Wrong variable used in the return statement"],
    correctIndex: 0,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0025",
    level: 25,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(30, 4
print(result)`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Missing indentation in the function body", "Wrong variable used in the return statement", "Missing closing parenthesis in the function call"],
    correctIndex: 3,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0026",
    level: 26,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(7, 16
print(result)`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Wrong variable used in the return statement", "Missing closing parenthesis in the function call", "Missing indentation in the function body"],
    correctIndex: 2,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0027",
    level: 27,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(12, 18
print(result)`,
    question: "What's wrong with this code?",
    options: ["Missing indentation in the function body", "Wrong variable used in the return statement", "The function call creates an infinite loop", "Missing closing parenthesis in the function call"],
    correctIndex: 3,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0028",
    level: 28,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(4, 35
print(result)`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Missing indentation in the function body", "Missing closing parenthesis in the function call", "Wrong variable used in the return statement"],
    correctIndex: 2,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0029",
    level: 29,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(32, 31
print(result)`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the return statement", "The function call creates an infinite loop", "Missing indentation in the function body", "Missing closing parenthesis in the function call"],
    correctIndex: 3,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0030",
    level: 30,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(1, 25
print(result)`,
    question: "What's wrong with this code?",
    options: ["Missing closing parenthesis in the function call", "Wrong variable used in the return statement", "Missing indentation in the function body", "The function call creates an infinite loop"],
    correctIndex: 0,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0031",
    level: 31,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(10, 13
print(result)`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Wrong variable used in the return statement", "Missing indentation in the function body", "Missing closing parenthesis in the function call"],
    correctIndex: 3,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0032",
    level: 32,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(21, 4
print(result)`,
    question: "What's wrong with this code?",
    options: ["Missing indentation in the function body", "Wrong variable used in the return statement", "Missing closing parenthesis in the function call", "The function call creates an infinite loop"],
    correctIndex: 2,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0033",
    level: 33,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(12, 5
print(result)`,
    question: "What's wrong with this code?",
    options: ["Missing indentation in the function body", "Missing closing parenthesis in the function call", "The function call creates an infinite loop", "Wrong variable used in the return statement"],
    correctIndex: 1,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0034",
    level: 34,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(37, 16
print(result)`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Missing indentation in the function body", "Wrong variable used in the return statement", "Missing closing parenthesis in the function call"],
    correctIndex: 3,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0035",
    level: 35,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(17, 14
print(result)`,
    question: "What's wrong with this code?",
    options: ["Missing closing parenthesis in the function call", "Wrong variable used in the return statement", "The function call creates an infinite loop", "Missing indentation in the function body"],
    correctIndex: 0,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0036",
    level: 36,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(9, 20
print(result)`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Missing indentation in the function body", "Wrong variable used in the return statement", "Missing closing parenthesis in the function call"],
    correctIndex: 3,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0037",
    level: 37,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(40, 37
print(result)`,
    question: "What's wrong with this code?",
    options: ["Missing closing parenthesis in the function call", "Missing indentation in the function body", "The function call creates an infinite loop", "Wrong variable used in the return statement"],
    correctIndex: 0,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0038",
    level: 38,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(9, 23
print(result)`,
    question: "What's wrong with this code?",
    options: ["Missing indentation in the function body", "Missing closing parenthesis in the function call", "Wrong variable used in the return statement", "The function call creates an infinite loop"],
    correctIndex: 1,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0039",
    level: 39,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(29, 35
print(result)`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Missing indentation in the function body", "Wrong variable used in the return statement", "Missing closing parenthesis in the function call"],
    correctIndex: 3,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0040",
    level: 40,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `def add(x, y):
    return x + y

result = add(7, 9
print(result)`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Wrong variable used in the return statement", "Missing indentation in the function body", "Missing closing parenthesis in the function call"],
    correctIndex: 3,
    explanation: "The call `add(v1, v2` never closes its parenthesis, so Python can't finish parsing the statement — a SyntaxError.",
  },
  {
    id: "cd-0041",
    level: 41,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `ys = [21, 9, 6]
values = [24, 15, 18]

for i in range(len(ys)):
    print(values[i])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "Missing closing bracket in the list", "The loop condition causes an infinite loop", "Wrong variable used inside the loop — it prints values instead of ys"],
    correctIndex: 3,
    explanation: "The loop is sized using `len(ys)` but prints from `values` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0042",
    level: 42,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `scores = [29, 5, 18]
series = [2, 27, 12]

for i in range(len(scores)):
    print(series[i])`,
    question: "What's wrong with this code?",
    options: ["Missing closing bracket in the list", "Missing indentation before print", "Wrong variable used inside the loop — it prints series instead of scores", "The loop condition causes an infinite loop"],
    correctIndex: 2,
    explanation: "The loop is sized using `len(scores)` but prints from `series` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0043",
    level: 43,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `codes = [12, 29, 30]
scores = [26, 28, 2]

for i in range(len(codes)):
    print(scores[i])`,
    question: "What's wrong with this code?",
    options: ["Missing closing bracket in the list", "Wrong variable used inside the loop — it prints scores instead of codes", "Missing indentation before print", "The loop condition causes an infinite loop"],
    correctIndex: 1,
    explanation: "The loop is sized using `len(codes)` but prints from `scores` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0044",
    level: 44,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `lst = [25, 18, 29]
temps = [28, 14, 20]

for i in range(len(lst)):
    print(temps[i])`,
    question: "What's wrong with this code?",
    options: ["The loop condition causes an infinite loop", "Missing indentation before print", "Wrong variable used inside the loop — it prints temps instead of lst", "Missing closing bracket in the list"],
    correctIndex: 2,
    explanation: "The loop is sized using `len(lst)` but prints from `temps` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0045",
    level: 45,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `marks = [1, 6, 24]
counts = [30, 11, 26]

for i in range(len(marks)):
    print(counts[i])`,
    question: "What's wrong with this code?",
    options: ["The loop condition causes an infinite loop", "Missing closing bracket in the list", "Wrong variable used inside the loop — it prints counts instead of marks", "Missing indentation before print"],
    correctIndex: 2,
    explanation: "The loop is sized using `len(marks)` but prints from `counts` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0046",
    level: 46,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `buf = [28, 2, 28]
temps = [16, 8, 7]

for i in range(len(buf)):
    print(temps[i])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "Missing closing bracket in the list", "Wrong variable used inside the loop — it prints temps instead of buf", "The loop condition causes an infinite loop"],
    correctIndex: 2,
    explanation: "The loop is sized using `len(buf)` but prints from `temps` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0047",
    level: 47,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `queue = [22, 7, 13]
a = [11, 9, 28]

for i in range(len(queue)):
    print(a[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop — it prints a instead of queue", "The loop condition causes an infinite loop", "Missing indentation before print", "Missing closing bracket in the list"],
    correctIndex: 0,
    explanation: "The loop is sized using `len(queue)` but prints from `a` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0048",
    level: 48,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `grades = [27, 18, 11]
record = [1, 4, 29]

for i in range(len(grades)):
    print(record[i])`,
    question: "What's wrong with this code?",
    options: ["The loop condition causes an infinite loop", "Missing closing bracket in the list", "Wrong variable used inside the loop — it prints record instead of grades", "Missing indentation before print"],
    correctIndex: 2,
    explanation: "The loop is sized using `len(grades)` but prints from `record` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0049",
    level: 49,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `weights = [14, 12, 24]
vals = [26, 11, 14]

for i in range(len(weights)):
    print(vals[i])`,
    question: "What's wrong with this code?",
    options: ["Missing closing bracket in the list", "Wrong variable used inside the loop — it prints vals instead of weights", "Missing indentation before print", "The loop condition causes an infinite loop"],
    correctIndex: 1,
    explanation: "The loop is sized using `len(weights)` but prints from `vals` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0050",
    level: 50,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `results = [2, 23, 14]
ys = [1, 17, 30]

for i in range(len(results)):
    print(ys[i])`,
    question: "What's wrong with this code?",
    options: ["The loop condition causes an infinite loop", "Wrong variable used inside the loop — it prints ys instead of results", "Missing closing bracket in the list", "Missing indentation before print"],
    correctIndex: 1,
    explanation: "The loop is sized using `len(results)` but prints from `ys` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0051",
    level: 51,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `counts = [30, 11, 20]
record = [11, 22, 28]

for i in range(len(counts)):
    print(record[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop — it prints record instead of counts", "The loop condition causes an infinite loop", "Missing indentation before print", "Missing closing bracket in the list"],
    correctIndex: 0,
    explanation: "The loop is sized using `len(counts)` but prints from `record` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0052",
    level: 52,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `ids = [13, 23, 10]
marks = [18, 5, 7]

for i in range(len(ids)):
    print(marks[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop — it prints marks instead of ids", "Missing closing bracket in the list", "The loop condition causes an infinite loop", "Missing indentation before print"],
    correctIndex: 0,
    explanation: "The loop is sized using `len(ids)` but prints from `marks` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0053",
    level: 53,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `a = [18, 27, 1]
ids = [10, 10, 7]

for i in range(len(a)):
    print(ids[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop — it prints ids instead of a", "The loop condition causes an infinite loop", "Missing indentation before print", "Missing closing bracket in the list"],
    correctIndex: 0,
    explanation: "The loop is sized using `len(a)` but prints from `ids` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0054",
    level: 54,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `arr = [7, 17, 16]
record = [26, 29, 26]

for i in range(len(arr)):
    print(record[i])`,
    question: "What's wrong with this code?",
    options: ["The loop condition causes an infinite loop", "Missing indentation before print", "Missing closing bracket in the list", "Wrong variable used inside the loop — it prints record instead of arr"],
    correctIndex: 3,
    explanation: "The loop is sized using `len(arr)` but prints from `record` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0055",
    level: 55,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `vals = [27, 25, 8]
nums = [22, 10, 8]

for i in range(len(vals)):
    print(nums[i])`,
    question: "What's wrong with this code?",
    options: ["Missing closing bracket in the list", "The loop condition causes an infinite loop", "Missing indentation before print", "Wrong variable used inside the loop — it prints nums instead of vals"],
    correctIndex: 3,
    explanation: "The loop is sized using `len(vals)` but prints from `nums` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0056",
    level: 56,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `record = [20, 28, 25]
weights = [3, 15, 14]

for i in range(len(record)):
    print(weights[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop — it prints weights instead of record", "Missing indentation before print", "Missing closing bracket in the list", "The loop condition causes an infinite loop"],
    correctIndex: 0,
    explanation: "The loop is sized using `len(record)` but prints from `weights` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0057",
    level: 57,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `values = [5, 21, 23]
ys = [1, 29, 25]

for i in range(len(values)):
    print(ys[i])`,
    question: "What's wrong with this code?",
    options: ["Missing closing bracket in the list", "Missing indentation before print", "Wrong variable used inside the loop — it prints ys instead of values", "The loop condition causes an infinite loop"],
    correctIndex: 2,
    explanation: "The loop is sized using `len(values)` but prints from `ys` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0058",
    level: 58,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `temps = [18, 8, 30]
arr = [28, 4, 15]

for i in range(len(temps)):
    print(arr[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop — it prints arr instead of temps", "Missing indentation before print", "The loop condition causes an infinite loop", "Missing closing bracket in the list"],
    correctIndex: 0,
    explanation: "The loop is sized using `len(temps)` but prints from `arr` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0059",
    level: 59,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `xs = [15, 29, 6]
results = [24, 28, 16]

for i in range(len(xs)):
    print(results[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop — it prints results instead of xs", "Missing closing bracket in the list", "The loop condition causes an infinite loop", "Missing indentation before print"],
    correctIndex: 0,
    explanation: "The loop is sized using `len(xs)` but prints from `results` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0060",
    level: 60,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `nums = [16, 21, 8]
heights = [9, 15, 3]

for i in range(len(nums)):
    print(heights[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop — it prints heights instead of nums", "Missing closing bracket in the list", "The loop condition causes an infinite loop", "Missing indentation before print"],
    correctIndex: 0,
    explanation: "The loop is sized using `len(nums)` but prints from `heights` — if the two lists differ, this either prints the wrong values or crashes with an IndexError.",
  },
  {
    id: "cd-0061",
    level: 61,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `counter = 0
while counter < 27:
    print(counter)`,
    question: "What's wrong with this code?",
    options: ["Missing colon after the while condition", "Wrong variable used in the print statement", "Missing indentation before print", "Infinite loop — counter is never incremented inside the loop"],
    correctIndex: 3,
    explanation: "The loop checks `counter < 27` forever because `counter` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0062",
    level: 62,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `beat = 0
while beat < 4:
    print(beat)`,
    question: "What's wrong with this code?",
    options: ["Missing colon after the while condition", "Infinite loop — beat is never incremented inside the loop", "Wrong variable used in the print statement", "Missing indentation before print"],
    correctIndex: 1,
    explanation: "The loop checks `beat < 4` forever because `beat` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0063",
    level: 63,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `idx = 0
while idx < 39:
    print(idx)`,
    question: "What's wrong with this code?",
    options: ["Missing colon after the while condition", "Infinite loop — idx is never incremented inside the loop", "Missing indentation before print", "Wrong variable used in the print statement"],
    correctIndex: 1,
    explanation: "The loop checks `idx < 39` forever because `idx` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0064",
    level: 64,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `k = 0
while k < 33:
    print(k)`,
    question: "What's wrong with this code?",
    options: ["Missing colon after the while condition", "Infinite loop — k is never incremented inside the loop", "Missing indentation before print", "Wrong variable used in the print statement"],
    correctIndex: 1,
    explanation: "The loop checks `k < 33` forever because `k` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0065",
    level: 65,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `clock = 0
while clock < 3:
    print(clock)`,
    question: "What's wrong with this code?",
    options: ["Missing colon after the while condition", "Infinite loop — clock is never incremented inside the loop", "Wrong variable used in the print statement", "Missing indentation before print"],
    correctIndex: 1,
    explanation: "The loop checks `clock < 3` forever because `clock` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0066",
    level: 66,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `n = 0
while n < 25:
    print(n)`,
    question: "What's wrong with this code?",
    options: ["Infinite loop — n is never incremented inside the loop", "Missing colon after the while condition", "Missing indentation before print", "Wrong variable used in the print statement"],
    correctIndex: 0,
    explanation: "The loop checks `n < 25` forever because `n` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0067",
    level: 67,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `pos = 0
while pos < 12:
    print(pos)`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "Missing colon after the while condition", "Missing indentation before print", "Infinite loop — pos is never incremented inside the loop"],
    correctIndex: 3,
    explanation: "The loop checks `pos < 12` forever because `pos` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0068",
    level: 68,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `x = 0
while x < 37:
    print(x)`,
    question: "What's wrong with this code?",
    options: ["Missing colon after the while condition", "Wrong variable used in the print statement", "Infinite loop — x is never incremented inside the loop", "Missing indentation before print"],
    correctIndex: 2,
    explanation: "The loop checks `x < 37` forever because `x` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0069",
    level: 69,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `frame = 0
while frame < 15:
    print(frame)`,
    question: "What's wrong with this code?",
    options: ["Missing colon after the while condition", "Missing indentation before print", "Wrong variable used in the print statement", "Infinite loop — frame is never incremented inside the loop"],
    correctIndex: 3,
    explanation: "The loop checks `frame < 15` forever because `frame` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0070",
    level: 70,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `attempt = 0
while attempt < 30:
    print(attempt)`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "Missing indentation before print", "Infinite loop — attempt is never incremented inside the loop", "Missing colon after the while condition"],
    correctIndex: 2,
    explanation: "The loop checks `attempt < 30` forever because `attempt` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0071",
    level: 71,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `count = 0
while count < 29:
    print(count)`,
    question: "What's wrong with this code?",
    options: ["Infinite loop — count is never incremented inside the loop", "Missing indentation before print", "Wrong variable used in the print statement", "Missing colon after the while condition"],
    correctIndex: 0,
    explanation: "The loop checks `count < 29` forever because `count` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0072",
    level: 72,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `round_num = 0
while round_num < 16:
    print(round_num)`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "Wrong variable used in the print statement", "Missing colon after the while condition", "Infinite loop — round_num is never incremented inside the loop"],
    correctIndex: 3,
    explanation: "The loop checks `round_num < 16` forever because `round_num` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0073",
    level: 73,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `cursor = 0
while cursor < 20:
    print(cursor)`,
    question: "What's wrong with this code?",
    options: ["Infinite loop — cursor is never incremented inside the loop", "Missing colon after the while condition", "Missing indentation before print", "Wrong variable used in the print statement"],
    correctIndex: 0,
    explanation: "The loop checks `cursor < 20` forever because `cursor` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0074",
    level: 74,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `turn = 0
while turn < 26:
    print(turn)`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "Missing colon after the while condition", "Missing indentation before print", "Infinite loop — turn is never incremented inside the loop"],
    correctIndex: 3,
    explanation: "The loop checks `turn < 26` forever because `turn` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0075",
    level: 75,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `tries = 0
while tries < 32:
    print(tries)`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "Missing indentation before print", "Missing colon after the while condition", "Infinite loop — tries is never incremented inside the loop"],
    correctIndex: 3,
    explanation: "The loop checks `tries < 32` forever because `tries` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0076",
    level: 76,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `tick2 = 0
while tick2 < 22:
    print(tick2)`,
    question: "What's wrong with this code?",
    options: ["Missing colon after the while condition", "Missing indentation before print", "Infinite loop — tick2 is never incremented inside the loop", "Wrong variable used in the print statement"],
    correctIndex: 2,
    explanation: "The loop checks `tick2 < 22` forever because `tick2` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0077",
    level: 77,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `step = 0
while step < 10:
    print(step)`,
    question: "What's wrong with this code?",
    options: ["Missing colon after the while condition", "Wrong variable used in the print statement", "Infinite loop — step is never incremented inside the loop", "Missing indentation before print"],
    correctIndex: 2,
    explanation: "The loop checks `step < 10` forever because `step` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0078",
    level: 78,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `i = 0
while i < 18:
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "Infinite loop — i is never incremented inside the loop", "Missing colon after the while condition", "Missing indentation before print"],
    correctIndex: 1,
    explanation: "The loop checks `i < 18` forever because `i` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0079",
    level: 79,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `tick = 0
while tick < 23:
    print(tick)`,
    question: "What's wrong with this code?",
    options: ["Infinite loop — tick is never incremented inside the loop", "Missing colon after the while condition", "Missing indentation before print", "Wrong variable used in the print statement"],
    correctIndex: 0,
    explanation: "The loop checks `tick < 23` forever because `tick` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0080",
    level: 80,
    difficulty: 2,
    category: "syntax",
    language: "python",
    code: `j = 0
while j < 11:
    print(j)`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "Wrong variable used in the print statement", "Infinite loop — j is never incremented inside the loop", "Missing colon after the while condition"],
    correctIndex: 2,
    explanation: "The loop checks `j < 11` forever because `j` is never updated in the body, so the condition stays true and the loop never ends.",
  },
  {
    id: "cd-0081",
    level: 81,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(20)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Missing colon at the end of the for statement", "Missing indentation before print", "The loop never terminates (infinite loop)", "Wrong variable used in range()"],
    correctIndex: 0,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0082",
    level: 82,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(31)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "The loop never terminates (infinite loop)", "Wrong variable used in range()", "Missing colon at the end of the for statement"],
    correctIndex: 3,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0083",
    level: 83,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(18)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Missing colon at the end of the for statement", "Wrong variable used in range()", "Missing indentation before print"],
    correctIndex: 1,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0084",
    level: 84,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(51)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in range()", "Missing colon at the end of the for statement", "Missing indentation before print", "The loop never terminates (infinite loop)"],
    correctIndex: 1,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0085",
    level: 85,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(32)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in range()", "Missing colon at the end of the for statement", "Missing indentation before print", "The loop never terminates (infinite loop)"],
    correctIndex: 1,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0086",
    level: 86,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(39)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Missing colon at the end of the for statement", "Missing indentation before print", "The loop never terminates (infinite loop)", "Wrong variable used in range()"],
    correctIndex: 0,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0087",
    level: 87,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(42)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Missing colon at the end of the for statement", "Missing indentation before print", "Wrong variable used in range()", "The loop never terminates (infinite loop)"],
    correctIndex: 0,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0088",
    level: 88,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(45)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "Wrong variable used in range()", "Missing colon at the end of the for statement", "The loop never terminates (infinite loop)"],
    correctIndex: 2,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0089",
    level: 89,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(27)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in range()", "The loop never terminates (infinite loop)", "Missing colon at the end of the for statement", "Missing indentation before print"],
    correctIndex: 2,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0090",
    level: 90,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(24)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Missing colon at the end of the for statement", "The loop never terminates (infinite loop)", "Wrong variable used in range()", "Missing indentation before print"],
    correctIndex: 0,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0091",
    level: 91,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(4)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "Wrong variable used in range()", "Missing colon at the end of the for statement", "The loop never terminates (infinite loop)"],
    correctIndex: 2,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0092",
    level: 92,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(34)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Missing indentation before print", "Wrong variable used in range()", "Missing colon at the end of the for statement"],
    correctIndex: 3,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0093",
    level: 93,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(23)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in range()", "The loop never terminates (infinite loop)", "Missing indentation before print", "Missing colon at the end of the for statement"],
    correctIndex: 3,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0094",
    level: 94,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(14)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in range()", "Missing indentation before print", "Missing colon at the end of the for statement", "The loop never terminates (infinite loop)"],
    correctIndex: 2,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0095",
    level: 95,
    difficulty: 1,
    category: "syntax",
    language: "python",
    code: `for i in range(48)
    print(i)`,
    question: "What's wrong with this code?",
    options: ["Missing colon at the end of the for statement", "Wrong variable used in range()", "Missing indentation before print", "The loop never terminates (infinite loop)"],
    correctIndex: 0,
    explanation: "Every Python compound statement (`for`, `while`, `if`, `def`...) must end with a colon before the indented block. It's missing here, so this raises a SyntaxError.",
  },
  {
    id: "cd-0096",
    level: 96,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `marks = [12, 4, 17, 56]
for i in range(len(marks) - 1):
    print(marks[i])`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Off-by-one error — the loop skips the last element of marks", "Wrong variable used inside the loop", "Missing indentation before print"],
    correctIndex: 1,
    explanation: "`range(len(marks) - 1)` stops one index early, so the final element of `marks` is never printed.",
  },
  {
    id: "cd-0097",
    level: 97,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `results = [41, 44, 4, 10]
for i in range(1, len(results)):
    print(results[i])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "Missing colon after the for statement", "The loop never terminates (infinite loop)", "Off-by-one error — the loop skips the first element of results"],
    correctIndex: 3,
    explanation: "Starting the range at 1 instead of 0 skips index 0, so the first element of `results` is never printed.",
  },
  {
    id: "cd-0098",
    level: 98,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `heights = [49, 27, 39, 39]
for i in range(len(heights) + 1):
    print(heights[i])`,
    question: "What's wrong with this code?",
    options: ["Off-by-one error — this causes an IndexError on the last iteration", "Missing colon after the for statement", "Missing indentation before print", "The loop never terminates (infinite loop)"],
    correctIndex: 0,
    explanation: "`range(len(heights) + 1)` produces one index too many, so accessing `heights[len(heights)]` raises an IndexError.",
  },
  {
    id: "cd-0099",
    level: 99,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `results = [28, 20, 37, 40]
for i in range(len(results) - 1):
    print(results[i])`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Off-by-one error — the loop skips the last element of results", "Missing colon after the for statement", "Wrong variable used inside the loop"],
    correctIndex: 1,
    explanation: "`range(len(results) - 1)` stops one index early, so the final element of `results` is never printed.",
  },
  {
    id: "cd-0100",
    level: 100,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `ys = [43, 6, 11, 16]
for i in range(1, len(ys)):
    print(ys[i])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "The loop never terminates (infinite loop)", "Off-by-one error — the loop skips the first element of ys", "Missing colon after the for statement"],
    correctIndex: 2,
    explanation: "Starting the range at 1 instead of 0 skips index 0, so the first element of `ys` is never printed.",
  },
  {
    id: "cd-0101",
    level: 101,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `counts = [45, 39, 31, 19]
for i in range(len(counts) + 1):
    print(counts[i])`,
    question: "What's wrong with this code?",
    options: ["Off-by-one error — this causes an IndexError on the last iteration", "The loop never terminates (infinite loop)", "Missing colon after the for statement", "Wrong variable used inside the loop"],
    correctIndex: 0,
    explanation: "`range(len(counts) + 1)` produces one index too many, so accessing `counts[len(counts)]` raises an IndexError.",
  },
  {
    id: "cd-0102",
    level: 102,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `nums = [44, 15, 60, 17]
for i in range(len(nums) - 1):
    print(nums[i])`,
    question: "What's wrong with this code?",
    options: ["Missing colon after the for statement", "Off-by-one error — the loop skips the last element of nums", "Missing indentation before print", "The loop never terminates (infinite loop)"],
    correctIndex: 1,
    explanation: "`range(len(nums) - 1)` stops one index early, so the final element of `nums` is never printed.",
  },
  {
    id: "cd-0103",
    level: 103,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `ys = [53, 10, 5, 4]
for i in range(1, len(ys)):
    print(ys[i])`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Missing indentation before print", "Off-by-one error — the loop skips the first element of ys", "Missing colon after the for statement"],
    correctIndex: 2,
    explanation: "Starting the range at 1 instead of 0 skips index 0, so the first element of `ys` is never printed.",
  },
  {
    id: "cd-0104",
    level: 104,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `record = [20, 45, 26, 18]
for i in range(len(record) + 1):
    print(record[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop", "Missing indentation before print", "The loop never terminates (infinite loop)", "Off-by-one error — this causes an IndexError on the last iteration"],
    correctIndex: 3,
    explanation: "`range(len(record) + 1)` produces one index too many, so accessing `record[len(record)]` raises an IndexError.",
  },
  {
    id: "cd-0105",
    level: 105,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `codes = [17, 2, 6, 15]
for i in range(len(codes) - 1):
    print(codes[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop", "Missing colon after the for statement", "The loop never terminates (infinite loop)", "Off-by-one error — the loop skips the last element of codes"],
    correctIndex: 3,
    explanation: "`range(len(codes) - 1)` stops one index early, so the final element of `codes` is never printed.",
  },
  {
    id: "cd-0106",
    level: 106,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `grades = [42, 29, 59, 18]
for i in range(1, len(grades)):
    print(grades[i])`,
    question: "What's wrong with this code?",
    options: ["Missing colon after the for statement", "Missing indentation before print", "Off-by-one error — the loop skips the first element of grades", "The loop never terminates (infinite loop)"],
    correctIndex: 2,
    explanation: "Starting the range at 1 instead of 0 skips index 0, so the first element of `grades` is never printed.",
  },
  {
    id: "cd-0107",
    level: 107,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `prices = [27, 22, 21, 43]
for i in range(len(prices) + 1):
    print(prices[i])`,
    question: "What's wrong with this code?",
    options: ["Off-by-one error — this causes an IndexError on the last iteration", "The loop never terminates (infinite loop)", "Wrong variable used inside the loop", "Missing colon after the for statement"],
    correctIndex: 0,
    explanation: "`range(len(prices) + 1)` produces one index too many, so accessing `prices[len(prices)]` raises an IndexError.",
  },
  {
    id: "cd-0108",
    level: 108,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `scores = [43, 26, 53, 49]
for i in range(len(scores) - 1):
    print(scores[i])`,
    question: "What's wrong with this code?",
    options: ["Off-by-one error — the loop skips the last element of scores", "Wrong variable used inside the loop", "The loop never terminates (infinite loop)", "Missing colon after the for statement"],
    correctIndex: 0,
    explanation: "`range(len(scores) - 1)` stops one index early, so the final element of `scores` is never printed.",
  },
  {
    id: "cd-0109",
    level: 109,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `data = [50, 26, 56, 33]
for i in range(1, len(data)):
    print(data[i])`,
    question: "What's wrong with this code?",
    options: ["Missing colon after the for statement", "Wrong variable used inside the loop", "Off-by-one error — the loop skips the first element of data", "The loop never terminates (infinite loop)"],
    correctIndex: 2,
    explanation: "Starting the range at 1 instead of 0 skips index 0, so the first element of `data` is never printed.",
  },
  {
    id: "cd-0110",
    level: 110,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `grades = [24, 40, 49, 32]
for i in range(len(grades) + 1):
    print(grades[i])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the loop", "Off-by-one error — this causes an IndexError on the last iteration", "Missing indentation before print", "The loop never terminates (infinite loop)"],
    correctIndex: 1,
    explanation: "`range(len(grades) + 1)` produces one index too many, so accessing `grades[len(grades)]` raises an IndexError.",
  },
  {
    id: "cd-0111",
    level: 111,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `scores = [29, 57, 45, 32]
for i in range(len(scores) - 1):
    print(scores[i])`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Off-by-one error — the loop skips the last element of scores", "Missing colon after the for statement", "Wrong variable used inside the loop"],
    correctIndex: 1,
    explanation: "`range(len(scores) - 1)` stops one index early, so the final element of `scores` is never printed.",
  },
  {
    id: "cd-0112",
    level: 112,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `heights = [27, 6, 15, 54]
for i in range(1, len(heights)):
    print(heights[i])`,
    question: "What's wrong with this code?",
    options: ["Off-by-one error — the loop skips the first element of heights", "Missing colon after the for statement", "Wrong variable used inside the loop", "The loop never terminates (infinite loop)"],
    correctIndex: 0,
    explanation: "Starting the range at 1 instead of 0 skips index 0, so the first element of `heights` is never printed.",
  },
  {
    id: "cd-0113",
    level: 113,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `grades = [46, 18, 27, 54]
for i in range(len(grades) + 1):
    print(grades[i])`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Off-by-one error — this causes an IndexError on the last iteration", "Missing indentation before print", "Wrong variable used inside the loop"],
    correctIndex: 1,
    explanation: "`range(len(grades) + 1)` produces one index too many, so accessing `grades[len(grades)]` raises an IndexError.",
  },
  {
    id: "cd-0114",
    level: 114,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `temps = [13, 59, 39, 33]
for i in range(len(temps) - 1):
    print(temps[i])`,
    question: "What's wrong with this code?",
    options: ["Off-by-one error — the loop skips the last element of temps", "Missing colon after the for statement", "The loop never terminates (infinite loop)", "Missing indentation before print"],
    correctIndex: 0,
    explanation: "`range(len(temps) - 1)` stops one index early, so the final element of `temps` is never printed.",
  },
  {
    id: "cd-0115",
    level: 115,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `a = [19, 47, 20, 54]
for i in range(1, len(a)):
    print(a[i])`,
    question: "What's wrong with this code?",
    options: ["Off-by-one error — the loop skips the first element of a", "Wrong variable used inside the loop", "The loop never terminates (infinite loop)", "Missing indentation before print"],
    correctIndex: 0,
    explanation: "Starting the range at 1 instead of 0 skips index 0, so the first element of `a` is never printed.",
  },
  {
    id: "cd-0116",
    level: 116,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `heights = [49, 35, 25, 30]
for i in range(len(heights) + 1):
    print(heights[i])`,
    question: "What's wrong with this code?",
    options: ["Missing colon after the for statement", "Wrong variable used inside the loop", "Off-by-one error — this causes an IndexError on the last iteration", "Missing indentation before print"],
    correctIndex: 2,
    explanation: "`range(len(heights) + 1)` produces one index too many, so accessing `heights[len(heights)]` raises an IndexError.",
  },
  {
    id: "cd-0117",
    level: 117,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `arr = [21, 48, 31, 46]
for i in range(len(arr) - 1):
    print(arr[i])`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Missing indentation before print", "Off-by-one error — the loop skips the last element of arr", "Wrong variable used inside the loop"],
    correctIndex: 2,
    explanation: "`range(len(arr) - 1)` stops one index early, so the final element of `arr` is never printed.",
  },
  {
    id: "cd-0118",
    level: 118,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `grades = [38, 22, 56, 7]
for i in range(1, len(grades)):
    print(grades[i])`,
    question: "What's wrong with this code?",
    options: ["The loop never terminates (infinite loop)", "Missing indentation before print", "Wrong variable used inside the loop", "Off-by-one error — the loop skips the first element of grades"],
    correctIndex: 3,
    explanation: "Starting the range at 1 instead of 0 skips index 0, so the first element of `grades` is never printed.",
  },
  {
    id: "cd-0119",
    level: 119,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `ids = [56, 42, 10, 5]
for i in range(len(ids) + 1):
    print(ids[i])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "Off-by-one error — this causes an IndexError on the last iteration", "The loop never terminates (infinite loop)", "Wrong variable used inside the loop"],
    correctIndex: 1,
    explanation: "`range(len(ids) + 1)` produces one index too many, so accessing `ids[len(ids)]` raises an IndexError.",
  },
  {
    id: "cd-0120",
    level: 120,
    difficulty: 2,
    category: "logic",
    language: "python",
    code: `marks = [55, 44, 55, 35]
for i in range(len(marks) - 1):
    print(marks[i])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "Wrong variable used inside the loop", "The loop never terminates (infinite loop)", "Off-by-one error — the loop skips the last element of marks"],
    correctIndex: 3,
    explanation: "`range(len(marks) - 1)` stops one index early, so the final element of `marks` is never printed.",
  },
  {
    id: "cd-0121",
    level: 121,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function evaluate(x) {
  if (x = 32) {
    return "match";
  }
  return "no match";
}

console.log(evaluate(3));`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Wrong variable used in the return statement", "Uses assignment (=) instead of comparison (===), so the if is always truthy", "Missing semicolon after the function declaration"],
    correctIndex: 2,
    explanation: "`x = 32` assigns 32 to x and evaluates to 32 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0122",
    level: 122,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function check(x) {
  if (x = 38) {
    return "match";
  }
  return "no match";
}

console.log(check(3));`,
    question: "What's wrong with this code?",
    options: ["Uses assignment (=) instead of comparison (===), so the if is always truthy", "Missing semicolon after the function declaration", "The function call creates an infinite loop", "Wrong variable used in the return statement"],
    correctIndex: 0,
    explanation: "`x = 38` assigns 38 to x and evaluates to 38 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0123",
    level: 123,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function isMatch(x) {
  if (x = 31) {
    return "match";
  }
  return "no match";
}

console.log(isMatch(3));`,
    question: "What's wrong with this code?",
    options: ["Uses assignment (=) instead of comparison (===), so the if is always truthy", "The function call creates an infinite loop", "Wrong variable used in the return statement", "Missing semicolon after the function declaration"],
    correctIndex: 0,
    explanation: "`x = 31` assigns 31 to x and evaluates to 31 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0124",
    level: 124,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function check(x) {
  if (x = 13) {
    return "match";
  }
  return "no match";
}

console.log(check(3));`,
    question: "What's wrong with this code?",
    options: ["Uses assignment (=) instead of comparison (===), so the if is always truthy", "Wrong variable used in the return statement", "The function call creates an infinite loop", "Missing semicolon after the function declaration"],
    correctIndex: 0,
    explanation: "`x = 13` assigns 13 to x and evaluates to 13 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0125",
    level: 125,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function test(x) {
  if (x = 57) {
    return "match";
  }
  return "no match";
}

console.log(test(3));`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Missing semicolon after the function declaration", "Uses assignment (=) instead of comparison (===), so the if is always truthy", "Wrong variable used in the return statement"],
    correctIndex: 2,
    explanation: "`x = 57` assigns 57 to x and evaluates to 57 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0126",
    level: 126,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function verify(x) {
  if (x = 14) {
    return "match";
  }
  return "no match";
}

console.log(verify(3));`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the return statement", "The function call creates an infinite loop", "Missing semicolon after the function declaration", "Uses assignment (=) instead of comparison (===), so the if is always truthy"],
    correctIndex: 3,
    explanation: "`x = 14` assigns 14 to x and evaluates to 14 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0127",
    level: 127,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function evaluate(x) {
  if (x = 74) {
    return "match";
  }
  return "no match";
}

console.log(evaluate(3));`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Wrong variable used in the return statement", "Uses assignment (=) instead of comparison (===), so the if is always truthy", "Missing semicolon after the function declaration"],
    correctIndex: 2,
    explanation: "`x = 74` assigns 74 to x and evaluates to 74 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0128",
    level: 128,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function isMatch(x) {
  if (x = 58) {
    return "match";
  }
  return "no match";
}

console.log(isMatch(3));`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Uses assignment (=) instead of comparison (===), so the if is always truthy", "Wrong variable used in the return statement", "Missing semicolon after the function declaration"],
    correctIndex: 1,
    explanation: "`x = 58` assigns 58 to x and evaluates to 58 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0129",
    level: 129,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function isMatch(x) {
  if (x = 23) {
    return "match";
  }
  return "no match";
}

console.log(isMatch(3));`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Uses assignment (=) instead of comparison (===), so the if is always truthy", "Wrong variable used in the return statement", "Missing semicolon after the function declaration"],
    correctIndex: 1,
    explanation: "`x = 23` assigns 23 to x and evaluates to 23 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0130",
    level: 130,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function test(x) {
  if (x = 40) {
    return "match";
  }
  return "no match";
}

console.log(test(3));`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the return statement", "The function call creates an infinite loop", "Uses assignment (=) instead of comparison (===), so the if is always truthy", "Missing semicolon after the function declaration"],
    correctIndex: 2,
    explanation: "`x = 40` assigns 40 to x and evaluates to 40 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0131",
    level: 131,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function check(x) {
  if (x = 5) {
    return "match";
  }
  return "no match";
}

console.log(check(3));`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the return statement", "The function call creates an infinite loop", "Uses assignment (=) instead of comparison (===), so the if is always truthy", "Missing semicolon after the function declaration"],
    correctIndex: 2,
    explanation: "`x = 5` assigns 5 to x and evaluates to 5 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0132",
    level: 132,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function test(x) {
  if (x = 7) {
    return "match";
  }
  return "no match";
}

console.log(test(3));`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Missing semicolon after the function declaration", "Uses assignment (=) instead of comparison (===), so the if is always truthy", "Wrong variable used in the return statement"],
    correctIndex: 2,
    explanation: "`x = 7` assigns 7 to x and evaluates to 7 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0133",
    level: 133,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function verify(x) {
  if (x = 43) {
    return "match";
  }
  return "no match";
}

console.log(verify(3));`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the return statement", "Missing semicolon after the function declaration", "Uses assignment (=) instead of comparison (===), so the if is always truthy", "The function call creates an infinite loop"],
    correctIndex: 2,
    explanation: "`x = 43` assigns 43 to x and evaluates to 43 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0134",
    level: 134,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function evaluate(x) {
  if (x = 9) {
    return "match";
  }
  return "no match";
}

console.log(evaluate(3));`,
    question: "What's wrong with this code?",
    options: ["Uses assignment (=) instead of comparison (===), so the if is always truthy", "Missing semicolon after the function declaration", "The function call creates an infinite loop", "Wrong variable used in the return statement"],
    correctIndex: 0,
    explanation: "`x = 9` assigns 9 to x and evaluates to 9 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0135",
    level: 135,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function verify(x) {
  if (x = 39) {
    return "match";
  }
  return "no match";
}

console.log(verify(3));`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the return statement", "The function call creates an infinite loop", "Missing semicolon after the function declaration", "Uses assignment (=) instead of comparison (===), so the if is always truthy"],
    correctIndex: 3,
    explanation: "`x = 39` assigns 39 to x and evaluates to 39 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0136",
    level: 136,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function evaluate(x) {
  if (x = 24) {
    return "match";
  }
  return "no match";
}

console.log(evaluate(3));`,
    question: "What's wrong with this code?",
    options: ["Uses assignment (=) instead of comparison (===), so the if is always truthy", "Missing semicolon after the function declaration", "The function call creates an infinite loop", "Wrong variable used in the return statement"],
    correctIndex: 0,
    explanation: "`x = 24` assigns 24 to x and evaluates to 24 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0137",
    level: 137,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function isMatch(x) {
  if (x = 25) {
    return "match";
  }
  return "no match";
}

console.log(isMatch(3));`,
    question: "What's wrong with this code?",
    options: ["Missing semicolon after the function declaration", "The function call creates an infinite loop", "Uses assignment (=) instead of comparison (===), so the if is always truthy", "Wrong variable used in the return statement"],
    correctIndex: 2,
    explanation: "`x = 25` assigns 25 to x and evaluates to 25 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0138",
    level: 138,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function check(x) {
  if (x = 29) {
    return "match";
  }
  return "no match";
}

console.log(check(3));`,
    question: "What's wrong with this code?",
    options: ["The function call creates an infinite loop", "Uses assignment (=) instead of comparison (===), so the if is always truthy", "Wrong variable used in the return statement", "Missing semicolon after the function declaration"],
    correctIndex: 1,
    explanation: "`x = 29` assigns 29 to x and evaluates to 29 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0139",
    level: 139,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function test(x) {
  if (x = 11) {
    return "match";
  }
  return "no match";
}

console.log(test(3));`,
    question: "What's wrong with this code?",
    options: ["Uses assignment (=) instead of comparison (===), so the if is always truthy", "Wrong variable used in the return statement", "Missing semicolon after the function declaration", "The function call creates an infinite loop"],
    correctIndex: 0,
    explanation: "`x = 11` assigns 11 to x and evaluates to 11 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0140",
    level: 140,
    difficulty: 3,
    category: "logic",
    language: "javascript",
    code: `function verify(x) {
  if (x = 17) {
    return "match";
  }
  return "no match";
}

console.log(verify(3));`,
    question: "What's wrong with this code?",
    options: ["Missing semicolon after the function declaration", "Wrong variable used in the return statement", "The function call creates an infinite loop", "Uses assignment (=) instead of comparison (===), so the if is always truthy"],
    correctIndex: 3,
    explanation: "`x = 17` assigns 17 to x and evaluates to 17 (truthy), so the if-block always runs regardless of the input — it should use `===`.",
  },
  {
    id: "cd-0141",
    level: 141,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def find_max(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(find_max([5, 39, 64, 15]))`,
    question: "What's wrong with this code?",
    options: ["The comparison is reversed — this function actually finds the minimum, not the maximum", "IndexError when nums is empty", "Wrong variable returned at the end", "Missing indentation inside the for loop"],
    correctIndex: 0,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `find_max` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0142",
    level: 142,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def find_biggest(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(find_biggest([86, 96, 90, 70]))`,
    question: "What's wrong with this code?",
    options: ["Wrong variable returned at the end", "The comparison is reversed — this function actually finds the minimum, not the maximum", "Missing indentation inside the for loop", "IndexError when nums is empty"],
    correctIndex: 1,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `find_biggest` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0143",
    level: 143,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def find_max(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(find_max([63, 79, 53, 36]))`,
    question: "What's wrong with this code?",
    options: ["The comparison is reversed — this function actually finds the minimum, not the maximum", "Wrong variable returned at the end", "IndexError when nums is empty", "Missing indentation inside the for loop"],
    correctIndex: 0,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `find_max` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0144",
    level: 144,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def highest(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(highest([31, 47, 13, 88]))`,
    question: "What's wrong with this code?",
    options: ["IndexError when nums is empty", "Wrong variable returned at the end", "Missing indentation inside the for loop", "The comparison is reversed — this function actually finds the minimum, not the maximum"],
    correctIndex: 3,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `highest` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0145",
    level: 145,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def get_largest(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(get_largest([25, 16, 59, 12]))`,
    question: "What's wrong with this code?",
    options: ["Missing indentation inside the for loop", "IndexError when nums is empty", "Wrong variable returned at the end", "The comparison is reversed — this function actually finds the minimum, not the maximum"],
    correctIndex: 3,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `get_largest` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0146",
    level: 146,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def get_largest(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(get_largest([17, 73, 27, 9]))`,
    question: "What's wrong with this code?",
    options: ["Missing indentation inside the for loop", "The comparison is reversed — this function actually finds the minimum, not the maximum", "IndexError when nums is empty", "Wrong variable returned at the end"],
    correctIndex: 1,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `get_largest` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0147",
    level: 147,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def get_largest(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(get_largest([77, 1, 36, 19]))`,
    question: "What's wrong with this code?",
    options: ["IndexError when nums is empty", "Wrong variable returned at the end", "The comparison is reversed — this function actually finds the minimum, not the maximum", "Missing indentation inside the for loop"],
    correctIndex: 2,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `get_largest` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0148",
    level: 148,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def highest(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(highest([17, 2, 46, 31]))`,
    question: "What's wrong with this code?",
    options: ["Wrong variable returned at the end", "Missing indentation inside the for loop", "The comparison is reversed — this function actually finds the minimum, not the maximum", "IndexError when nums is empty"],
    correctIndex: 2,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `highest` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0149",
    level: 149,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def find_max(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(find_max([95, 54, 68, 15]))`,
    question: "What's wrong with this code?",
    options: ["Missing indentation inside the for loop", "The comparison is reversed — this function actually finds the minimum, not the maximum", "Wrong variable returned at the end", "IndexError when nums is empty"],
    correctIndex: 1,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `find_max` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0150",
    level: 150,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def find_max(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(find_max([58, 65, 29, 79]))`,
    question: "What's wrong with this code?",
    options: ["Missing indentation inside the for loop", "The comparison is reversed — this function actually finds the minimum, not the maximum", "Wrong variable returned at the end", "IndexError when nums is empty"],
    correctIndex: 1,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `find_max` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0151",
    level: 151,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def find_max(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(find_max([8, 62, 52, 55]))`,
    question: "What's wrong with this code?",
    options: ["IndexError when nums is empty", "Missing indentation inside the for loop", "Wrong variable returned at the end", "The comparison is reversed — this function actually finds the minimum, not the maximum"],
    correctIndex: 3,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `find_max` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0152",
    level: 152,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def highest(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(highest([78, 19, 9, 17]))`,
    question: "What's wrong with this code?",
    options: ["The comparison is reversed — this function actually finds the minimum, not the maximum", "Missing indentation inside the for loop", "Wrong variable returned at the end", "IndexError when nums is empty"],
    correctIndex: 0,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `highest` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0153",
    level: 153,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def find_max(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(find_max([59, 65, 78, 56]))`,
    question: "What's wrong with this code?",
    options: ["The comparison is reversed — this function actually finds the minimum, not the maximum", "Missing indentation inside the for loop", "IndexError when nums is empty", "Wrong variable returned at the end"],
    correctIndex: 0,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `find_max` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0154",
    level: 154,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def find_biggest(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(find_biggest([30, 53, 44, 59]))`,
    question: "What's wrong with this code?",
    options: ["The comparison is reversed — this function actually finds the minimum, not the maximum", "Wrong variable returned at the end", "IndexError when nums is empty", "Missing indentation inside the for loop"],
    correctIndex: 0,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `find_biggest` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0155",
    level: 155,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def find_biggest(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(find_biggest([86, 33, 48, 20]))`,
    question: "What's wrong with this code?",
    options: ["IndexError when nums is empty", "Wrong variable returned at the end", "Missing indentation inside the for loop", "The comparison is reversed — this function actually finds the minimum, not the maximum"],
    correctIndex: 3,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `find_biggest` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0156",
    level: 156,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def get_largest(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(get_largest([13, 96, 95, 48]))`,
    question: "What's wrong with this code?",
    options: ["Wrong variable returned at the end", "The comparison is reversed — this function actually finds the minimum, not the maximum", "IndexError when nums is empty", "Missing indentation inside the for loop"],
    correctIndex: 1,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `get_largest` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0157",
    level: 157,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def find_biggest(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(find_biggest([53, 46, 86, 97]))`,
    question: "What's wrong with this code?",
    options: ["The comparison is reversed — this function actually finds the minimum, not the maximum", "Wrong variable returned at the end", "IndexError when nums is empty", "Missing indentation inside the for loop"],
    correctIndex: 0,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `find_biggest` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0158",
    level: 158,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def get_largest(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(get_largest([46, 14, 74, 65]))`,
    question: "What's wrong with this code?",
    options: ["Wrong variable returned at the end", "Missing indentation inside the for loop", "The comparison is reversed — this function actually finds the minimum, not the maximum", "IndexError when nums is empty"],
    correctIndex: 2,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `get_largest` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0159",
    level: 159,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def highest(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(highest([72, 48, 15, 98]))`,
    question: "What's wrong with this code?",
    options: ["Wrong variable returned at the end", "The comparison is reversed — this function actually finds the minimum, not the maximum", "Missing indentation inside the for loop", "IndexError when nums is empty"],
    correctIndex: 1,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `highest` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0160",
    level: 160,
    difficulty: 3,
    category: "logic",
    language: "python",
    code: `def find_max(nums):
    max_val = nums[0]
    for n in nums:
        if n < max_val:
            max_val = n
    return max_val

print(find_max([78, 85, 89, 35]))`,
    question: "What's wrong with this code?",
    options: ["The comparison is reversed — this function actually finds the minimum, not the maximum", "Missing indentation inside the for loop", "IndexError when nums is empty", "Wrong variable returned at the end"],
    correctIndex: 0,
    explanation: "`if n < max_val` keeps replacing max_val with smaller values, so `find_max` returns the smallest number in the list instead of the largest.",
  },
  {
    id: "cd-0161",
    level: 161,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `a = [12, 10, 37]
print(a[3])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "Wrong variable used in the print statement", "Missing closing bracket in the list", "IndexError — index 3 is out of range for a list of length 3"],
    correctIndex: 3,
    explanation: "`a` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0162",
    level: 162,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `nums = [48, 34, 14]
print(nums[3])`,
    question: "What's wrong with this code?",
    options: ["Missing closing bracket in the list", "IndexError — index 3 is out of range for a list of length 3", "Missing indentation before print", "Wrong variable used in the print statement"],
    correctIndex: 1,
    explanation: "`nums` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0163",
    level: 163,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `prices = [20, 47, 21]
print(prices[3])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "Missing indentation before print", "Missing closing bracket in the list", "IndexError — index 3 is out of range for a list of length 3"],
    correctIndex: 3,
    explanation: "`prices` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0164",
    level: 164,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `queue = [40, 4, 44]
print(queue[3])`,
    question: "What's wrong with this code?",
    options: ["IndexError — index 3 is out of range for a list of length 3", "Missing closing bracket in the list", "Wrong variable used in the print statement", "Missing indentation before print"],
    correctIndex: 0,
    explanation: "`queue` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0165",
    level: 165,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `weights = [39, 29, 27]
print(weights[3])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "Missing indentation before print", "Missing closing bracket in the list", "IndexError — index 3 is out of range for a list of length 3"],
    correctIndex: 3,
    explanation: "`weights` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0166",
    level: 166,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = [19, 44, 44]
print(data[3])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "Missing closing bracket in the list", "IndexError — index 3 is out of range for a list of length 3", "Wrong variable used in the print statement"],
    correctIndex: 2,
    explanation: "`data` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0167",
    level: 167,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `temps = [39, 4, 1]
print(temps[3])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "Missing indentation before print", "IndexError — index 3 is out of range for a list of length 3", "Missing closing bracket in the list"],
    correctIndex: 2,
    explanation: "`temps` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0168",
    level: 168,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `scores = [21, 8, 1]
print(scores[3])`,
    question: "What's wrong with this code?",
    options: ["Missing closing bracket in the list", "Wrong variable used in the print statement", "IndexError — index 3 is out of range for a list of length 3", "Missing indentation before print"],
    correctIndex: 2,
    explanation: "`scores` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0169",
    level: 169,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `heights = [46, 15, 33]
print(heights[3])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "Missing closing bracket in the list", "Missing indentation before print", "IndexError — index 3 is out of range for a list of length 3"],
    correctIndex: 3,
    explanation: "`heights` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0170",
    level: 170,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `ids = [2, 30, 5]
print(ids[3])`,
    question: "What's wrong with this code?",
    options: ["IndexError — index 3 is out of range for a list of length 3", "Missing indentation before print", "Missing closing bracket in the list", "Wrong variable used in the print statement"],
    correctIndex: 0,
    explanation: "`ids` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0171",
    level: 171,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `scores = [8, 26, 2]
print(scores[3])`,
    question: "What's wrong with this code?",
    options: ["IndexError — index 3 is out of range for a list of length 3", "Missing closing bracket in the list", "Missing indentation before print", "Wrong variable used in the print statement"],
    correctIndex: 0,
    explanation: "`scores` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0172",
    level: 172,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `nums = [28, 7, 16]
print(nums[3])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "Missing closing bracket in the list", "Missing indentation before print", "IndexError — index 3 is out of range for a list of length 3"],
    correctIndex: 3,
    explanation: "`nums` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0173",
    level: 173,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `series = [22, 15, 22]
print(series[3])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "Missing indentation before print", "Missing closing bracket in the list", "IndexError — index 3 is out of range for a list of length 3"],
    correctIndex: 3,
    explanation: "`series` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0174",
    level: 174,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `queue = [23, 23, 47]
print(queue[3])`,
    question: "What's wrong with this code?",
    options: ["Missing closing bracket in the list", "Missing indentation before print", "IndexError — index 3 is out of range for a list of length 3", "Wrong variable used in the print statement"],
    correctIndex: 2,
    explanation: "`queue` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0175",
    level: 175,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `ys = [13, 12, 39]
print(ys[3])`,
    question: "What's wrong with this code?",
    options: ["IndexError — index 3 is out of range for a list of length 3", "Missing indentation before print", "Missing closing bracket in the list", "Wrong variable used in the print statement"],
    correctIndex: 0,
    explanation: "`ys` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0176",
    level: 176,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `counts = [49, 37, 49]
print(counts[3])`,
    question: "What's wrong with this code?",
    options: ["IndexError — index 3 is out of range for a list of length 3", "Missing indentation before print", "Missing closing bracket in the list", "Wrong variable used in the print statement"],
    correctIndex: 0,
    explanation: "`counts` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0177",
    level: 177,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `values = [29, 5, 31]
print(values[3])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "IndexError — index 3 is out of range for a list of length 3", "Wrong variable used in the print statement", "Missing closing bracket in the list"],
    correctIndex: 1,
    explanation: "`values` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0178",
    level: 178,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `prices = [33, 5, 20]
print(prices[3])`,
    question: "What's wrong with this code?",
    options: ["Missing closing bracket in the list", "Missing indentation before print", "Wrong variable used in the print statement", "IndexError — index 3 is out of range for a list of length 3"],
    correctIndex: 3,
    explanation: "`prices` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0179",
    level: 179,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `scores = [5, 42, 6]
print(scores[3])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "IndexError — index 3 is out of range for a list of length 3", "Wrong variable used in the print statement", "Missing closing bracket in the list"],
    correctIndex: 1,
    explanation: "`scores` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0180",
    level: 180,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `counts = [37, 42, 13]
print(counts[3])`,
    question: "What's wrong with this code?",
    options: ["Missing closing bracket in the list", "Wrong variable used in the print statement", "IndexError — index 3 is out of range for a list of length 3", "Missing indentation before print"],
    correctIndex: 2,
    explanation: "`counts` has 3 elements at indices 0, 1 and 2. Index 3 doesn't exist, so this raises an IndexError at runtime.",
  },
  {
    id: "cd-0181",
    level: 181,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def average(nums):
    total = sum(nums)
    return total / len(nums)

print(average([]))`,
    question: "What's wrong with this code?",
    options: ["IndexError because nums has no elements", "Missing indentation in the function body", "Wrong variable used in the return statement", "ZeroDivisionError — dividing by len(nums) when nums is an empty list"],
    correctIndex: 3,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0182",
    level: 182,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def mean(nums):
    total = sum(nums)
    return total / len(nums)

print(mean([]))`,
    question: "What's wrong with this code?",
    options: ["IndexError because nums has no elements", "ZeroDivisionError — dividing by len(nums) when nums is an empty list", "Wrong variable used in the return statement", "Missing indentation in the function body"],
    correctIndex: 1,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0183",
    level: 183,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_avg(nums):
    total = sum(nums)
    return total / len(nums)

print(get_avg([]))`,
    question: "What's wrong with this code?",
    options: ["ZeroDivisionError — dividing by len(nums) when nums is an empty list", "Wrong variable used in the return statement", "Missing indentation in the function body", "IndexError because nums has no elements"],
    correctIndex: 0,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0184",
    level: 184,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def compute_mean(nums):
    total = sum(nums)
    return total / len(nums)

print(compute_mean([]))`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the return statement", "IndexError because nums has no elements", "ZeroDivisionError — dividing by len(nums) when nums is an empty list", "Missing indentation in the function body"],
    correctIndex: 2,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0185",
    level: 185,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def calc_average(nums):
    total = sum(nums)
    return total / len(nums)

print(calc_average([]))`,
    question: "What's wrong with this code?",
    options: ["Missing indentation in the function body", "ZeroDivisionError — dividing by len(nums) when nums is an empty list", "IndexError because nums has no elements", "Wrong variable used in the return statement"],
    correctIndex: 1,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0186",
    level: 186,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def avg_score(nums):
    total = sum(nums)
    return total / len(nums)

print(avg_score([]))`,
    question: "What's wrong with this code?",
    options: ["ZeroDivisionError — dividing by len(nums) when nums is an empty list", "Missing indentation in the function body", "Wrong variable used in the return statement", "IndexError because nums has no elements"],
    correctIndex: 0,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0187",
    level: 187,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def mean_value(nums):
    total = sum(nums)
    return total / len(nums)

print(mean_value([]))`,
    question: "What's wrong with this code?",
    options: ["IndexError because nums has no elements", "ZeroDivisionError — dividing by len(nums) when nums is an empty list", "Wrong variable used in the return statement", "Missing indentation in the function body"],
    correctIndex: 1,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0188",
    level: 188,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_mean(nums):
    total = sum(nums)
    return total / len(nums)

print(get_mean([]))`,
    question: "What's wrong with this code?",
    options: ["Missing indentation in the function body", "Wrong variable used in the return statement", "ZeroDivisionError — dividing by len(nums) when nums is an empty list", "IndexError because nums has no elements"],
    correctIndex: 2,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0189",
    level: 189,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def compute_avg(nums):
    total = sum(nums)
    return total / len(nums)

print(compute_avg([]))`,
    question: "What's wrong with this code?",
    options: ["IndexError because nums has no elements", "Missing indentation in the function body", "ZeroDivisionError — dividing by len(nums) when nums is an empty list", "Wrong variable used in the return statement"],
    correctIndex: 2,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0190",
    level: 190,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def avg_of(nums):
    total = sum(nums)
    return total / len(nums)

print(avg_of([]))`,
    question: "What's wrong with this code?",
    options: ["ZeroDivisionError — dividing by len(nums) when nums is an empty list", "Missing indentation in the function body", "Wrong variable used in the return statement", "IndexError because nums has no elements"],
    correctIndex: 0,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0191",
    level: 191,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def find_average(nums):
    total = sum(nums)
    return total / len(nums)

print(find_average([]))`,
    question: "What's wrong with this code?",
    options: ["Missing indentation in the function body", "IndexError because nums has no elements", "ZeroDivisionError — dividing by len(nums) when nums is an empty list", "Wrong variable used in the return statement"],
    correctIndex: 2,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0192",
    level: 192,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def score_average(nums):
    total = sum(nums)
    return total / len(nums)

print(score_average([]))`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the return statement", "IndexError because nums has no elements", "Missing indentation in the function body", "ZeroDivisionError — dividing by len(nums) when nums is an empty list"],
    correctIndex: 3,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0193",
    level: 193,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def batch_mean(nums):
    total = sum(nums)
    return total / len(nums)

print(batch_mean([]))`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the return statement", "Missing indentation in the function body", "ZeroDivisionError — dividing by len(nums) when nums is an empty list", "IndexError because nums has no elements"],
    correctIndex: 2,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0194",
    level: 194,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def avg_result(nums):
    total = sum(nums)
    return total / len(nums)

print(avg_result([]))`,
    question: "What's wrong with this code?",
    options: ["IndexError because nums has no elements", "Wrong variable used in the return statement", "ZeroDivisionError — dividing by len(nums) when nums is an empty list", "Missing indentation in the function body"],
    correctIndex: 2,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0195",
    level: 195,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def mean_score(nums):
    total = sum(nums)
    return total / len(nums)

print(mean_score([]))`,
    question: "What's wrong with this code?",
    options: ["ZeroDivisionError — dividing by len(nums) when nums is an empty list", "IndexError because nums has no elements", "Missing indentation in the function body", "Wrong variable used in the return statement"],
    correctIndex: 0,
    explanation: "When `nums` is empty, `len(nums)` is 0, and dividing `total / 0` raises a ZeroDivisionError — the function never checks for an empty list.",
  },
  {
    id: "cd-0196",
    level: 196,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Ravi")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "TypeError — user can be None if \"Ravi\" isn't found, and None has no [\"age\"]", "KeyError because 'age' doesn't exist", "Missing indentation in the for loop"],
    correctIndex: 1,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0197",
    level: 197,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Meera")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["TypeError — user can be None if \"Meera\" isn't found, and None has no [\"age\"]", "Wrong variable used in the print statement", "KeyError because 'age' doesn't exist", "Missing indentation in the for loop"],
    correctIndex: 0,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0198",
    level: 198,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Aditi")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["TypeError — user can be None if \"Aditi\" isn't found, and None has no [\"age\"]", "Missing indentation in the for loop", "Wrong variable used in the print statement", "KeyError because 'age' doesn't exist"],
    correctIndex: 0,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0199",
    level: 199,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Karan")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "TypeError — user can be None if \"Karan\" isn't found, and None has no [\"age\"]", "Missing indentation in the for loop", "KeyError because 'age' doesn't exist"],
    correctIndex: 1,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0200",
    level: 200,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Zara")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation in the for loop", "TypeError — user can be None if \"Zara\" isn't found, and None has no [\"age\"]", "Wrong variable used in the print statement", "KeyError because 'age' doesn't exist"],
    correctIndex: 1,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0201",
    level: 201,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Ishan")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["KeyError because 'age' doesn't exist", "Wrong variable used in the print statement", "TypeError — user can be None if \"Ishan\" isn't found, and None has no [\"age\"]", "Missing indentation in the for loop"],
    correctIndex: 2,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0202",
    level: 202,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Priya")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "TypeError — user can be None if \"Priya\" isn't found, and None has no [\"age\"]", "KeyError because 'age' doesn't exist", "Missing indentation in the for loop"],
    correctIndex: 1,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0203",
    level: 203,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Rohan")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation in the for loop", "Wrong variable used in the print statement", "TypeError — user can be None if \"Rohan\" isn't found, and None has no [\"age\"]", "KeyError because 'age' doesn't exist"],
    correctIndex: 2,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0204",
    level: 204,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Sana")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation in the for loop", "Wrong variable used in the print statement", "TypeError — user can be None if \"Sana\" isn't found, and None has no [\"age\"]", "KeyError because 'age' doesn't exist"],
    correctIndex: 2,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0205",
    level: 205,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Yash")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["KeyError because 'age' doesn't exist", "Missing indentation in the for loop", "TypeError — user can be None if \"Yash\" isn't found, and None has no [\"age\"]", "Wrong variable used in the print statement"],
    correctIndex: 2,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0206",
    level: 206,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Divya")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation in the for loop", "KeyError because 'age' doesn't exist", "TypeError — user can be None if \"Divya\" isn't found, and None has no [\"age\"]", "Wrong variable used in the print statement"],
    correctIndex: 2,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0207",
    level: 207,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Nikhil")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["TypeError — user can be None if \"Nikhil\" isn't found, and None has no [\"age\"]", "KeyError because 'age' doesn't exist", "Wrong variable used in the print statement", "Missing indentation in the for loop"],
    correctIndex: 0,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0208",
    level: 208,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Tara")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["Missing indentation in the for loop", "Wrong variable used in the print statement", "KeyError because 'age' doesn't exist", "TypeError — user can be None if \"Tara\" isn't found, and None has no [\"age\"]"],
    correctIndex: 3,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0209",
    level: 209,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Arjun")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "KeyError because 'age' doesn't exist", "TypeError — user can be None if \"Arjun\" isn't found, and None has no [\"age\"]", "Missing indentation in the for loop"],
    correctIndex: 2,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0210",
    level: 210,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `def get_user(users, name):
    for u in users:
        if u["name"] == name:
            return u
    return None

user = get_user(users, "Leela")
print(user["age"])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "KeyError because 'age' doesn't exist", "Missing indentation in the for loop", "TypeError — user can be None if \"Leela\" isn't found, and None has no [\"age\"]"],
    correctIndex: 3,
    explanation: "`get_user` returns None when no match is found. Indexing `None[\"age\"]` then raises a TypeError since NoneType isn't subscriptable.",
  },
  {
    id: "cd-0211",
    level: 211,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"name": 54, "age": 82}
print(data["email"])`,
    question: "What's wrong with this code?",
    options: ["IndexError because the dictionary is too short", "Missing indentation before print", "Wrong variable used to access the dictionary", "KeyError — \"email\" does not exist in the dictionary"],
    correctIndex: 3,
    explanation: "The dictionary only has keys \"name\" and \"age\". Accessing `data[\"email\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0212",
    level: 212,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"city": 77, "zip": 69}
print(data["state"])`,
    question: "What's wrong with this code?",
    options: ["KeyError — \"state\" does not exist in the dictionary", "Wrong variable used to access the dictionary", "Missing indentation before print", "IndexError because the dictionary is too short"],
    correctIndex: 0,
    explanation: "The dictionary only has keys \"city\" and \"zip\". Accessing `data[\"state\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0213",
    level: 213,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"id": 1, "score": 79}
print(data["rank"])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used to access the dictionary", "Missing indentation before print", "KeyError — \"rank\" does not exist in the dictionary", "IndexError because the dictionary is too short"],
    correctIndex: 2,
    explanation: "The dictionary only has keys \"id\" and \"score\". Accessing `data[\"rank\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0214",
    level: 214,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"title": 68, "year": 47}
print(data["author"])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used to access the dictionary", "KeyError — \"author\" does not exist in the dictionary", "IndexError because the dictionary is too short", "Missing indentation before print"],
    correctIndex: 1,
    explanation: "The dictionary only has keys \"title\" and \"year\". Accessing `data[\"author\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0215",
    level: 215,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"x": 82, "y": 50}
print(data["z"])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used to access the dictionary", "IndexError because the dictionary is too short", "Missing indentation before print", "KeyError — \"z\" does not exist in the dictionary"],
    correctIndex: 3,
    explanation: "The dictionary only has keys \"x\" and \"y\". Accessing `data[\"z\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0216",
    level: 216,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"host": 45, "port": 31}
print(data["protocol"])`,
    question: "What's wrong with this code?",
    options: ["IndexError because the dictionary is too short", "Wrong variable used to access the dictionary", "KeyError — \"protocol\" does not exist in the dictionary", "Missing indentation before print"],
    correctIndex: 2,
    explanation: "The dictionary only has keys \"host\" and \"port\". Accessing `data[\"protocol\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0217",
    level: 217,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"width": 46, "height": 70}
print(data["depth"])`,
    question: "What's wrong with this code?",
    options: ["KeyError — \"depth\" does not exist in the dictionary", "Wrong variable used to access the dictionary", "Missing indentation before print", "IndexError because the dictionary is too short"],
    correctIndex: 0,
    explanation: "The dictionary only has keys \"width\" and \"height\". Accessing `data[\"depth\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0218",
    level: 218,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"user": 81, "role": 24}
print(data["team"])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used to access the dictionary", "IndexError because the dictionary is too short", "KeyError — \"team\" does not exist in the dictionary", "Missing indentation before print"],
    correctIndex: 2,
    explanation: "The dictionary only has keys \"user\" and \"role\". Accessing `data[\"team\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0219",
    level: 219,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"lat": 26, "lng": 6}
print(data["alt"])`,
    question: "What's wrong with this code?",
    options: ["KeyError — \"alt\" does not exist in the dictionary", "Missing indentation before print", "IndexError because the dictionary is too short", "Wrong variable used to access the dictionary"],
    correctIndex: 0,
    explanation: "The dictionary only has keys \"lat\" and \"lng\". Accessing `data[\"alt\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0220",
    level: 220,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"sku": 70, "qty": 61}
print(data["price"])`,
    question: "What's wrong with this code?",
    options: ["KeyError — \"price\" does not exist in the dictionary", "Missing indentation before print", "IndexError because the dictionary is too short", "Wrong variable used to access the dictionary"],
    correctIndex: 0,
    explanation: "The dictionary only has keys \"sku\" and \"qty\". Accessing `data[\"price\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0221",
    level: 221,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"day": 100, "month": 7}
print(data["year"])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used to access the dictionary", "Missing indentation before print", "KeyError — \"year\" does not exist in the dictionary", "IndexError because the dictionary is too short"],
    correctIndex: 2,
    explanation: "The dictionary only has keys \"day\" and \"month\". Accessing `data[\"year\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0222",
    level: 222,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"r": 56, "g": 52}
print(data["b"])`,
    question: "What's wrong with this code?",
    options: ["IndexError because the dictionary is too short", "KeyError — \"b\" does not exist in the dictionary", "Missing indentation before print", "Wrong variable used to access the dictionary"],
    correctIndex: 1,
    explanation: "The dictionary only has keys \"r\" and \"g\". Accessing `data[\"b\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0223",
    level: 223,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"open": 64, "close": 89}
print(data["high"])`,
    question: "What's wrong with this code?",
    options: ["IndexError because the dictionary is too short", "Missing indentation before print", "KeyError — \"high\" does not exist in the dictionary", "Wrong variable used to access the dictionary"],
    correctIndex: 2,
    explanation: "The dictionary only has keys \"open\" and \"close\". Accessing `data[\"high\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0224",
    level: 224,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"start": 11, "end": 56}
print(data["duration"])`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used to access the dictionary", "KeyError — \"duration\" does not exist in the dictionary", "IndexError because the dictionary is too short", "Missing indentation before print"],
    correctIndex: 1,
    explanation: "The dictionary only has keys \"start\" and \"end\". Accessing `data[\"duration\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0225",
    level: 225,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `data = {"min": 11, "max": 42}
print(data["avg"])`,
    question: "What's wrong with this code?",
    options: ["KeyError — \"avg\" does not exist in the dictionary", "Wrong variable used to access the dictionary", "Missing indentation before print", "IndexError because the dictionary is too short"],
    correctIndex: 0,
    explanation: "The dictionary only has keys \"min\" and \"max\". Accessing `data[\"avg\"]` raises a KeyError since that key was never set.",
  },
  {
    id: "cd-0226",
    level: 226,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `age = 22
print("Age: " + age)`,
    question: "What's wrong with this code?",
    options: ["Missing closing parenthesis in print()", "TypeError — can't concatenate str and int, needs str(age)", "Missing indentation before print", "Wrong variable used in the print statement"],
    correctIndex: 1,
    explanation: "`age` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(age)` first.",
  },
  {
    id: "cd-0227",
    level: 227,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `score = 94
print("Score: " + score)`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "TypeError — can't concatenate str and int, needs str(score)", "Wrong variable used in the print statement", "Missing closing parenthesis in print()"],
    correctIndex: 1,
    explanation: "`score` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(score)` first.",
  },
  {
    id: "cd-0228",
    level: 228,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `count = 10
print("Count: " + count)`,
    question: "What's wrong with this code?",
    options: ["Missing indentation before print", "TypeError — can't concatenate str and int, needs str(count)", "Missing closing parenthesis in print()", "Wrong variable used in the print statement"],
    correctIndex: 1,
    explanation: "`count` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(count)` first.",
  },
  {
    id: "cd-0229",
    level: 229,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `total = 4
print("Total: " + total)`,
    question: "What's wrong with this code?",
    options: ["Missing closing parenthesis in print()", "Wrong variable used in the print statement", "Missing indentation before print", "TypeError — can't concatenate str and int, needs str(total)"],
    correctIndex: 3,
    explanation: "`total` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(total)` first.",
  },
  {
    id: "cd-0230",
    level: 230,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `rank = 31
print("Rank: " + rank)`,
    question: "What's wrong with this code?",
    options: ["Missing closing parenthesis in print()", "TypeError — can't concatenate str and int, needs str(rank)", "Missing indentation before print", "Wrong variable used in the print statement"],
    correctIndex: 1,
    explanation: "`rank` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(rank)` first.",
  },
  {
    id: "cd-0231",
    level: 231,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `level = 78
print("Level: " + level)`,
    question: "What's wrong with this code?",
    options: ["TypeError — can't concatenate str and int, needs str(level)", "Missing indentation before print", "Missing closing parenthesis in print()", "Wrong variable used in the print statement"],
    correctIndex: 0,
    explanation: "`level` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(level)` first.",
  },
  {
    id: "cd-0232",
    level: 232,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `points = 98
print("Points: " + points)`,
    question: "What's wrong with this code?",
    options: ["TypeError — can't concatenate str and int, needs str(points)", "Missing indentation before print", "Wrong variable used in the print statement", "Missing closing parenthesis in print()"],
    correctIndex: 0,
    explanation: "`points` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(points)` first.",
  },
  {
    id: "cd-0233",
    level: 233,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `quantity = 84
print("Quantity: " + quantity)`,
    question: "What's wrong with this code?",
    options: ["Missing closing parenthesis in print()", "Missing indentation before print", "Wrong variable used in the print statement", "TypeError — can't concatenate str and int, needs str(quantity)"],
    correctIndex: 3,
    explanation: "`quantity` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(quantity)` first.",
  },
  {
    id: "cd-0234",
    level: 234,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `balance = 64
print("Balance: " + balance)`,
    question: "What's wrong with this code?",
    options: ["Missing closing parenthesis in print()", "Wrong variable used in the print statement", "Missing indentation before print", "TypeError — can't concatenate str and int, needs str(balance)"],
    correctIndex: 3,
    explanation: "`balance` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(balance)` first.",
  },
  {
    id: "cd-0235",
    level: 235,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `duration = 91
print("Duration: " + duration)`,
    question: "What's wrong with this code?",
    options: ["TypeError — can't concatenate str and int, needs str(duration)", "Missing closing parenthesis in print()", "Wrong variable used in the print statement", "Missing indentation before print"],
    correctIndex: 0,
    explanation: "`duration` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(duration)` first.",
  },
  {
    id: "cd-0236",
    level: 236,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `distance = 26
print("Distance: " + distance)`,
    question: "What's wrong with this code?",
    options: ["Missing closing parenthesis in print()", "Missing indentation before print", "Wrong variable used in the print statement", "TypeError — can't concatenate str and int, needs str(distance)"],
    correctIndex: 3,
    explanation: "`distance` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(distance)` first.",
  },
  {
    id: "cd-0237",
    level: 237,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `weight = 92
print("Weight: " + weight)`,
    question: "What's wrong with this code?",
    options: ["TypeError — can't concatenate str and int, needs str(weight)", "Missing closing parenthesis in print()", "Wrong variable used in the print statement", "Missing indentation before print"],
    correctIndex: 0,
    explanation: "`weight` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(weight)` first.",
  },
  {
    id: "cd-0238",
    level: 238,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `height = 91
print("Height: " + height)`,
    question: "What's wrong with this code?",
    options: ["Missing closing parenthesis in print()", "Missing indentation before print", "TypeError — can't concatenate str and int, needs str(height)", "Wrong variable used in the print statement"],
    correctIndex: 2,
    explanation: "`height` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(height)` first.",
  },
  {
    id: "cd-0239",
    level: 239,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `speed = 47
print("Speed: " + speed)`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used in the print statement", "Missing indentation before print", "Missing closing parenthesis in print()", "TypeError — can't concatenate str and int, needs str(speed)"],
    correctIndex: 3,
    explanation: "`speed` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(speed)` first.",
  },
  {
    id: "cd-0240",
    level: 240,
    difficulty: 3,
    category: "runtime",
    language: "python",
    code: `volume = 31
print("Volume: " + volume)`,
    question: "What's wrong with this code?",
    options: ["TypeError — can't concatenate str and int, needs str(volume)", "Missing closing parenthesis in print()", "Wrong variable used in the print statement", "Missing indentation before print"],
    correctIndex: 0,
    explanation: "`volume` is an int, and Python can't use `+` to join a string with an int directly — it needs `str(volume)` first.",
  },
  {
    id: "cd-0241",
    level: 241,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def has_duplicates(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["IndexError when nums is empty", "Infinite loop caused by the nested for statements", "Missing indentation in the nested loop", "Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)"],
    correctIndex: 3,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0242",
    level: 242,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def contains_dupe(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["Infinite loop caused by the nested for statements", "Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)", "IndexError when nums is empty", "Missing indentation in the nested loop"],
    correctIndex: 1,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0243",
    level: 243,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def any_repeats(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["IndexError when nums is empty", "Missing indentation in the nested loop", "Infinite loop caused by the nested for statements", "Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)"],
    correctIndex: 3,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0244",
    level: 244,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def has_repeat(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["Infinite loop caused by the nested for statements", "Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)", "Missing indentation in the nested loop", "IndexError when nums is empty"],
    correctIndex: 1,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0245",
    level: 245,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def find_duplicate(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["Infinite loop caused by the nested for statements", "Missing indentation in the nested loop", "IndexError when nums is empty", "Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)"],
    correctIndex: 3,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0246",
    level: 246,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def check_dupes(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["IndexError when nums is empty", "Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)", "Missing indentation in the nested loop", "Infinite loop caused by the nested for statements"],
    correctIndex: 1,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0247",
    level: 247,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def has_matching_pair(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["Infinite loop caused by the nested for statements", "Missing indentation in the nested loop", "IndexError when nums is empty", "Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)"],
    correctIndex: 3,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0248",
    level: 248,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def contains_repeat(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)", "Infinite loop caused by the nested for statements", "Missing indentation in the nested loop", "IndexError when nums is empty"],
    correctIndex: 0,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0249",
    level: 249,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def any_duplicate(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["Infinite loop caused by the nested for statements", "Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)", "IndexError when nums is empty", "Missing indentation in the nested loop"],
    correctIndex: 1,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0250",
    level: 250,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def detect_dupes(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["Infinite loop caused by the nested for statements", "Missing indentation in the nested loop", "IndexError when nums is empty", "Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)"],
    correctIndex: 3,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0251",
    level: 251,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def has_same_value(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)", "IndexError when nums is empty", "Missing indentation in the nested loop", "Infinite loop caused by the nested for statements"],
    correctIndex: 0,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0252",
    level: 252,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def repeats_exist(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)", "Missing indentation in the nested loop", "IndexError when nums is empty", "Infinite loop caused by the nested for statements"],
    correctIndex: 0,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0253",
    level: 253,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def duplicate_check(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["Missing indentation in the nested loop", "IndexError when nums is empty", "Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)", "Infinite loop caused by the nested for statements"],
    correctIndex: 2,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0254",
    level: 254,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def has_clash(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["IndexError when nums is empty", "Missing indentation in the nested loop", "Infinite loop caused by the nested for statements", "Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)"],
    correctIndex: 3,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0255",
    level: 255,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def values_repeat(nums):
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                return True
    return False`,
    question: "What's wrong with this code?",
    options: ["Time complexity issue — this runs in O(n²) when a set could check duplicates in O(n)", "Missing indentation in the nested loop", "Infinite loop caused by the nested for statements", "IndexError when nums is empty"],
    correctIndex: 0,
    explanation: "Comparing every pair of elements is O(n²). Inserting elements into a set as you go and checking membership gets the same result in O(n).",
  },
  {
    id: "cd-0256",
    level: 256,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def sum_matches(text, pattern):
    total = 0
    for i in range(len(text)):
        if text[i] in expensive_lookup(pattern):
            total += 1
    return total`,
    question: "What's wrong with this code?",
    options: ["Time complexity issue — expensive_lookup(pattern) is recomputed on every iteration instead of once", "Missing indentation inside the for loop", "IndexError when text is empty", "Wrong variable used inside the if condition"],
    correctIndex: 0,
    explanation: "`expensive_lookup(pattern)` doesn't depend on `i`, so recalculating it on every loop iteration wastes work — it should be hoisted above the loop and computed once.",
  },
  {
    id: "cd-0257",
    level: 257,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def count_hits(text, pattern):
    total = 0
    for i in range(len(text)):
        if text[i] in expensive_lookup(pattern):
            total += 1
    return total`,
    question: "What's wrong with this code?",
    options: ["Missing indentation inside the for loop", "IndexError when text is empty", "Time complexity issue — expensive_lookup(pattern) is recomputed on every iteration instead of once", "Wrong variable used inside the if condition"],
    correctIndex: 2,
    explanation: "`expensive_lookup(pattern)` doesn't depend on `i`, so recalculating it on every loop iteration wastes work — it should be hoisted above the loop and computed once.",
  },
  {
    id: "cd-0258",
    level: 258,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def find_hits(text, pattern):
    total = 0
    for i in range(len(text)):
        if text[i] in expensive_lookup(pattern):
            total += 1
    return total`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the if condition", "Missing indentation inside the for loop", "Time complexity issue — expensive_lookup(pattern) is recomputed on every iteration instead of once", "IndexError when text is empty"],
    correctIndex: 2,
    explanation: "`expensive_lookup(pattern)` doesn't depend on `i`, so recalculating it on every loop iteration wastes work — it should be hoisted above the loop and computed once.",
  },
  {
    id: "cd-0259",
    level: 259,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def match_count(text, pattern):
    total = 0
    for i in range(len(text)):
        if text[i] in expensive_lookup(pattern):
            total += 1
    return total`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the if condition", "Missing indentation inside the for loop", "Time complexity issue — expensive_lookup(pattern) is recomputed on every iteration instead of once", "IndexError when text is empty"],
    correctIndex: 2,
    explanation: "`expensive_lookup(pattern)` doesn't depend on `i`, so recalculating it on every loop iteration wastes work — it should be hoisted above the loop and computed once.",
  },
  {
    id: "cd-0260",
    level: 260,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def tally_matches(text, pattern):
    total = 0
    for i in range(len(text)):
        if text[i] in expensive_lookup(pattern):
            total += 1
    return total`,
    question: "What's wrong with this code?",
    options: ["Time complexity issue — expensive_lookup(pattern) is recomputed on every iteration instead of once", "IndexError when text is empty", "Missing indentation inside the for loop", "Wrong variable used inside the if condition"],
    correctIndex: 0,
    explanation: "`expensive_lookup(pattern)` doesn't depend on `i`, so recalculating it on every loop iteration wastes work — it should be hoisted above the loop and computed once.",
  },
  {
    id: "cd-0261",
    level: 261,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def count_matches(text, pattern):
    total = 0
    for i in range(len(text)):
        if text[i] in expensive_lookup(pattern):
            total += 1
    return total`,
    question: "What's wrong with this code?",
    options: ["Time complexity issue — expensive_lookup(pattern) is recomputed on every iteration instead of once", "Missing indentation inside the for loop", "IndexError when text is empty", "Wrong variable used inside the if condition"],
    correctIndex: 0,
    explanation: "`expensive_lookup(pattern)` doesn't depend on `i`, so recalculating it on every loop iteration wastes work — it should be hoisted above the loop and computed once.",
  },
  {
    id: "cd-0262",
    level: 262,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def hits_in_text(text, pattern):
    total = 0
    for i in range(len(text)):
        if text[i] in expensive_lookup(pattern):
            total += 1
    return total`,
    question: "What's wrong with this code?",
    options: ["Time complexity issue — expensive_lookup(pattern) is recomputed on every iteration instead of once", "Missing indentation inside the for loop", "Wrong variable used inside the if condition", "IndexError when text is empty"],
    correctIndex: 0,
    explanation: "`expensive_lookup(pattern)` doesn't depend on `i`, so recalculating it on every loop iteration wastes work — it should be hoisted above the loop and computed once.",
  },
  {
    id: "cd-0263",
    level: 263,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def scan_matches(text, pattern):
    total = 0
    for i in range(len(text)):
        if text[i] in expensive_lookup(pattern):
            total += 1
    return total`,
    question: "What's wrong with this code?",
    options: ["IndexError when text is empty", "Wrong variable used inside the if condition", "Time complexity issue — expensive_lookup(pattern) is recomputed on every iteration instead of once", "Missing indentation inside the for loop"],
    correctIndex: 2,
    explanation: "`expensive_lookup(pattern)` doesn't depend on `i`, so recalculating it on every loop iteration wastes work — it should be hoisted above the loop and computed once.",
  },
  {
    id: "cd-0264",
    level: 264,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def match_total(text, pattern):
    total = 0
    for i in range(len(text)):
        if text[i] in expensive_lookup(pattern):
            total += 1
    return total`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the if condition", "Missing indentation inside the for loop", "Time complexity issue — expensive_lookup(pattern) is recomputed on every iteration instead of once", "IndexError when text is empty"],
    correctIndex: 2,
    explanation: "`expensive_lookup(pattern)` doesn't depend on `i`, so recalculating it on every loop iteration wastes work — it should be hoisted above the loop and computed once.",
  },
  {
    id: "cd-0265",
    level: 265,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def count_occurrences(text, pattern):
    total = 0
    for i in range(len(text)):
        if text[i] in expensive_lookup(pattern):
            total += 1
    return total`,
    question: "What's wrong with this code?",
    options: ["Time complexity issue — expensive_lookup(pattern) is recomputed on every iteration instead of once", "IndexError when text is empty", "Missing indentation inside the for loop", "Wrong variable used inside the if condition"],
    correctIndex: 0,
    explanation: "`expensive_lookup(pattern)` doesn't depend on `i`, so recalculating it on every loop iteration wastes work — it should be hoisted above the loop and computed once.",
  },
  {
    id: "cd-0266",
    level: 266,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def find_all_hits(text, pattern):
    total = 0
    for i in range(len(text)):
        if text[i] in expensive_lookup(pattern):
            total += 1
    return total`,
    question: "What's wrong with this code?",
    options: ["IndexError when text is empty", "Missing indentation inside the for loop", "Wrong variable used inside the if condition", "Time complexity issue — expensive_lookup(pattern) is recomputed on every iteration instead of once"],
    correctIndex: 3,
    explanation: "`expensive_lookup(pattern)` doesn't depend on `i`, so recalculating it on every loop iteration wastes work — it should be hoisted above the loop and computed once.",
  },
  {
    id: "cd-0267",
    level: 267,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def matches_found(text, pattern):
    total = 0
    for i in range(len(text)):
        if text[i] in expensive_lookup(pattern):
            total += 1
    return total`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the if condition", "Time complexity issue — expensive_lookup(pattern) is recomputed on every iteration instead of once", "IndexError when text is empty", "Missing indentation inside the for loop"],
    correctIndex: 1,
    explanation: "`expensive_lookup(pattern)` doesn't depend on `i`, so recalculating it on every loop iteration wastes work — it should be hoisted above the loop and computed once.",
  },
  {
    id: "cd-0268",
    level: 268,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def closest_values(nums, k):
    result = []
    for i in range(k):
        nums.sort()
        result.append(nums[i])
    return result

print(closest_values([33, 29, 49, 36, 18], 14))`,
    question: "What's wrong with this code?",
    options: ["IndexError because k is larger than nums", "Wrong variable appended to the result list", "Time complexity issue — nums.sort() re-sorts the entire list on every loop iteration", "Missing indentation inside the for loop"],
    correctIndex: 2,
    explanation: "The list only needs to be sorted once. Calling `nums.sort()` inside the loop makes this O(k · n log n) instead of O(n log n).",
  },
  {
    id: "cd-0269",
    level: 269,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def closest_values(nums, k):
    result = []
    for i in range(k):
        nums.sort()
        result.append(nums[i])
    return result

print(closest_values([24, 22, 36, 24, 49], 3))`,
    question: "What's wrong with this code?",
    options: ["Missing indentation inside the for loop", "Time complexity issue — nums.sort() re-sorts the entire list on every loop iteration", "Wrong variable appended to the result list", "IndexError because k is larger than nums"],
    correctIndex: 1,
    explanation: "The list only needs to be sorted once. Calling `nums.sort()` inside the loop makes this O(k · n log n) instead of O(n log n).",
  },
  {
    id: "cd-0270",
    level: 270,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def closest_values(nums, k):
    result = []
    for i in range(k):
        nums.sort()
        result.append(nums[i])
    return result

print(closest_values([3, 3, 9, 46, 22], 20))`,
    question: "What's wrong with this code?",
    options: ["Missing indentation inside the for loop", "Time complexity issue — nums.sort() re-sorts the entire list on every loop iteration", "Wrong variable appended to the result list", "IndexError because k is larger than nums"],
    correctIndex: 1,
    explanation: "The list only needs to be sorted once. Calling `nums.sort()` inside the loop makes this O(k · n log n) instead of O(n log n).",
  },
  {
    id: "cd-0271",
    level: 271,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def closest_values(nums, k):
    result = []
    for i in range(k):
        nums.sort()
        result.append(nums[i])
    return result

print(closest_values([21, 40, 21, 11, 26], 19))`,
    question: "What's wrong with this code?",
    options: ["Time complexity issue — nums.sort() re-sorts the entire list on every loop iteration", "IndexError because k is larger than nums", "Wrong variable appended to the result list", "Missing indentation inside the for loop"],
    correctIndex: 0,
    explanation: "The list only needs to be sorted once. Calling `nums.sort()` inside the loop makes this O(k · n log n) instead of O(n log n).",
  },
  {
    id: "cd-0272",
    level: 272,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def closest_values(nums, k):
    result = []
    for i in range(k):
        nums.sort()
        result.append(nums[i])
    return result

print(closest_values([46, 37, 20, 31, 2], 8))`,
    question: "What's wrong with this code?",
    options: ["Missing indentation inside the for loop", "Wrong variable appended to the result list", "IndexError because k is larger than nums", "Time complexity issue — nums.sort() re-sorts the entire list on every loop iteration"],
    correctIndex: 3,
    explanation: "The list only needs to be sorted once. Calling `nums.sort()` inside the loop makes this O(k · n log n) instead of O(n log n).",
  },
  {
    id: "cd-0273",
    level: 273,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def closest_values(nums, k):
    result = []
    for i in range(k):
        nums.sort()
        result.append(nums[i])
    return result

print(closest_values([47, 45, 41, 2, 39], 13))`,
    question: "What's wrong with this code?",
    options: ["Missing indentation inside the for loop", "Time complexity issue — nums.sort() re-sorts the entire list on every loop iteration", "Wrong variable appended to the result list", "IndexError because k is larger than nums"],
    correctIndex: 1,
    explanation: "The list only needs to be sorted once. Calling `nums.sort()` inside the loop makes this O(k · n log n) instead of O(n log n).",
  },
  {
    id: "cd-0274",
    level: 274,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def closest_values(nums, k):
    result = []
    for i in range(k):
        nums.sort()
        result.append(nums[i])
    return result

print(closest_values([38, 31, 11, 34, 41], 26))`,
    question: "What's wrong with this code?",
    options: ["Wrong variable appended to the result list", "Time complexity issue — nums.sort() re-sorts the entire list on every loop iteration", "Missing indentation inside the for loop", "IndexError because k is larger than nums"],
    correctIndex: 1,
    explanation: "The list only needs to be sorted once. Calling `nums.sort()` inside the loop makes this O(k · n log n) instead of O(n log n).",
  },
  {
    id: "cd-0275",
    level: 275,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def closest_values(nums, k):
    result = []
    for i in range(k):
        nums.sort()
        result.append(nums[i])
    return result

print(closest_values([3, 37, 45, 8, 13], 11))`,
    question: "What's wrong with this code?",
    options: ["IndexError because k is larger than nums", "Time complexity issue — nums.sort() re-sorts the entire list on every loop iteration", "Wrong variable appended to the result list", "Missing indentation inside the for loop"],
    correctIndex: 1,
    explanation: "The list only needs to be sorted once. Calling `nums.sort()` inside the loop makes this O(k · n log n) instead of O(n log n).",
  },
  {
    id: "cd-0276",
    level: 276,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def closest_values(nums, k):
    result = []
    for i in range(k):
        nums.sort()
        result.append(nums[i])
    return result

print(closest_values([27, 45, 14, 27, 33], 4))`,
    question: "What's wrong with this code?",
    options: ["IndexError because k is larger than nums", "Wrong variable appended to the result list", "Missing indentation inside the for loop", "Time complexity issue — nums.sort() re-sorts the entire list on every loop iteration"],
    correctIndex: 3,
    explanation: "The list only needs to be sorted once. Calling `nums.sort()` inside the loop makes this O(k · n log n) instead of O(n log n).",
  },
  {
    id: "cd-0277",
    level: 277,
    difficulty: 4,
    category: "complexity",
    language: "python",
    code: `def closest_values(nums, k):
    result = []
    for i in range(k):
        nums.sort()
        result.append(nums[i])
    return result

print(closest_values([34, 14, 36, 21, 43], 29))`,
    question: "What's wrong with this code?",
    options: ["Missing indentation inside the for loop", "IndexError because k is larger than nums", "Time complexity issue — nums.sort() re-sorts the entire list on every loop iteration", "Wrong variable appended to the result list"],
    correctIndex: 2,
    explanation: "The list only needs to be sorted once. Calling `nums.sort()` inside the loop makes this O(k · n log n) instead of O(n log n).",
  },
  {
    id: "cd-0278",
    level: 278,
    difficulty: 5,
    category: "memory",
    language: "c",
    code: `void process() {
    int *data = malloc(141 * sizeof(int));
    for (int i = 0; i < 141; i++) {
        data[i] = i * i;
    }
    printf("done\\\\n");
}`,
    question: "What's wrong with this code?",
    options: ["Memory leak — data is malloc'd but never freed before the function returns", "IndexError when i reaches the array bound", "Missing semicolon after the malloc call", "Wrong variable used inside the for loop"],
    correctIndex: 0,
    explanation: "The memory allocated with `malloc` is never released with `free(data)`. Every call to `process()` leaks that block permanently.",
  },
  {
    id: "cd-0279",
    level: 279,
    difficulty: 5,
    category: "memory",
    language: "c",
    code: `void process() {
    int *data = malloc(92 * sizeof(int));
    for (int i = 0; i < 92; i++) {
        data[i] = i * i;
    }
    printf("done\\\\n");
}`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the for loop", "Memory leak — data is malloc'd but never freed before the function returns", "Missing semicolon after the malloc call", "IndexError when i reaches the array bound"],
    correctIndex: 1,
    explanation: "The memory allocated with `malloc` is never released with `free(data)`. Every call to `process()` leaks that block permanently.",
  },
  {
    id: "cd-0280",
    level: 280,
    difficulty: 5,
    category: "memory",
    language: "c",
    code: `void process() {
    int *data = malloc(144 * sizeof(int));
    for (int i = 0; i < 144; i++) {
        data[i] = i * i;
    }
    printf("done\\\\n");
}`,
    question: "What's wrong with this code?",
    options: ["Memory leak — data is malloc'd but never freed before the function returns", "Wrong variable used inside the for loop", "Missing semicolon after the malloc call", "IndexError when i reaches the array bound"],
    correctIndex: 0,
    explanation: "The memory allocated with `malloc` is never released with `free(data)`. Every call to `process()` leaks that block permanently.",
  },
  {
    id: "cd-0281",
    level: 281,
    difficulty: 5,
    category: "memory",
    language: "c",
    code: `void process() {
    int *data = malloc(95 * sizeof(int));
    for (int i = 0; i < 95; i++) {
        data[i] = i * i;
    }
    printf("done\\\\n");
}`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the for loop", "Missing semicolon after the malloc call", "Memory leak — data is malloc'd but never freed before the function returns", "IndexError when i reaches the array bound"],
    correctIndex: 2,
    explanation: "The memory allocated with `malloc` is never released with `free(data)`. Every call to `process()` leaks that block permanently.",
  },
  {
    id: "cd-0282",
    level: 282,
    difficulty: 5,
    category: "memory",
    language: "c",
    code: `void process() {
    int *data = malloc(178 * sizeof(int));
    for (int i = 0; i < 178; i++) {
        data[i] = i * i;
    }
    printf("done\\\\n");
}`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the for loop", "Memory leak — data is malloc'd but never freed before the function returns", "IndexError when i reaches the array bound", "Missing semicolon after the malloc call"],
    correctIndex: 1,
    explanation: "The memory allocated with `malloc` is never released with `free(data)`. Every call to `process()` leaks that block permanently.",
  },
  {
    id: "cd-0283",
    level: 283,
    difficulty: 5,
    category: "memory",
    language: "c",
    code: `void process() {
    int *data = malloc(189 * sizeof(int));
    for (int i = 0; i < 189; i++) {
        data[i] = i * i;
    }
    printf("done\\\\n");
}`,
    question: "What's wrong with this code?",
    options: ["Memory leak — data is malloc'd but never freed before the function returns", "IndexError when i reaches the array bound", "Wrong variable used inside the for loop", "Missing semicolon after the malloc call"],
    correctIndex: 0,
    explanation: "The memory allocated with `malloc` is never released with `free(data)`. Every call to `process()` leaks that block permanently.",
  },
  {
    id: "cd-0284",
    level: 284,
    difficulty: 5,
    category: "memory",
    language: "c",
    code: `void process() {
    int *data = malloc(179 * sizeof(int));
    for (int i = 0; i < 179; i++) {
        data[i] = i * i;
    }
    printf("done\\\\n");
}`,
    question: "What's wrong with this code?",
    options: ["IndexError when i reaches the array bound", "Wrong variable used inside the for loop", "Memory leak — data is malloc'd but never freed before the function returns", "Missing semicolon after the malloc call"],
    correctIndex: 2,
    explanation: "The memory allocated with `malloc` is never released with `free(data)`. Every call to `process()` leaks that block permanently.",
  },
  {
    id: "cd-0285",
    level: 285,
    difficulty: 5,
    category: "memory",
    language: "c",
    code: `void process() {
    int *data = malloc(169 * sizeof(int));
    for (int i = 0; i < 169; i++) {
        data[i] = i * i;
    }
    printf("done\\\\n");
}`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the for loop", "IndexError when i reaches the array bound", "Memory leak — data is malloc'd but never freed before the function returns", "Missing semicolon after the malloc call"],
    correctIndex: 2,
    explanation: "The memory allocated with `malloc` is never released with `free(data)`. Every call to `process()` leaks that block permanently.",
  },
  {
    id: "cd-0286",
    level: 286,
    difficulty: 5,
    category: "memory",
    language: "c",
    code: `void process() {
    int *data = malloc(182 * sizeof(int));
    for (int i = 0; i < 182; i++) {
        data[i] = i * i;
    }
    printf("done\\\\n");
}`,
    question: "What's wrong with this code?",
    options: ["Missing semicolon after the malloc call", "Memory leak — data is malloc'd but never freed before the function returns", "Wrong variable used inside the for loop", "IndexError when i reaches the array bound"],
    correctIndex: 1,
    explanation: "The memory allocated with `malloc` is never released with `free(data)`. Every call to `process()` leaks that block permanently.",
  },
  {
    id: "cd-0287",
    level: 287,
    difficulty: 5,
    category: "memory",
    language: "c",
    code: `void process() {
    int *data = malloc(72 * sizeof(int));
    for (int i = 0; i < 72; i++) {
        data[i] = i * i;
    }
    printf("done\\\\n");
}`,
    question: "What's wrong with this code?",
    options: ["Memory leak — data is malloc'd but never freed before the function returns", "Wrong variable used inside the for loop", "IndexError when i reaches the array bound", "Missing semicolon after the malloc call"],
    correctIndex: 0,
    explanation: "The memory allocated with `malloc` is never released with `free(data)`. Every call to `process()` leaks that block permanently.",
  },
  {
    id: "cd-0288",
    level: 288,
    difficulty: 5,
    category: "memory",
    language: "c",
    code: `void process() {
    int *data = malloc(161 * sizeof(int));
    for (int i = 0; i < 161; i++) {
        data[i] = i * i;
    }
    printf("done\\\\n");
}`,
    question: "What's wrong with this code?",
    options: ["IndexError when i reaches the array bound", "Missing semicolon after the malloc call", "Wrong variable used inside the for loop", "Memory leak — data is malloc'd but never freed before the function returns"],
    correctIndex: 3,
    explanation: "The memory allocated with `malloc` is never released with `free(data)`. Every call to `process()` leaks that block permanently.",
  },
  {
    id: "cd-0289",
    level: 289,
    difficulty: 5,
    category: "memory",
    language: "c",
    code: `void process() {
    int *data = malloc(128 * sizeof(int));
    for (int i = 0; i < 128; i++) {
        data[i] = i * i;
    }
    printf("done\\\\n");
}`,
    question: "What's wrong with this code?",
    options: ["Missing semicolon after the malloc call", "Memory leak — data is malloc'd but never freed before the function returns", "Wrong variable used inside the for loop", "IndexError when i reaches the array bound"],
    correctIndex: 1,
    explanation: "The memory allocated with `malloc` is never released with `free(data)`. Every call to `process()` leaks that block permanently.",
  },
  {
    id: "cd-0290",
    level: 290,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `cache = []

def track_event(event):
    cache.append(event)
    print(f"Tracked {len(cache)} events")`,
    question: "What's wrong with this code?",
    options: ["Missing indentation inside the function", "Memory leak — cache grows forever since nothing ever removes old entries", "Wrong variable used inside the print statement", "IndexError when cache is empty"],
    correctIndex: 1,
    explanation: "`cache` is appended to on every call and never trimmed or cleared, so in a long-running process it grows without bound and slowly consumes all available memory.",
  },
  {
    id: "cd-0291",
    level: 291,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `log = []

def track_event(event):
    log.append(event)
    print(f"Tracked {len(log)} events")`,
    question: "What's wrong with this code?",
    options: ["IndexError when log is empty", "Wrong variable used inside the print statement", "Missing indentation inside the function", "Memory leak — log grows forever since nothing ever removes old entries"],
    correctIndex: 3,
    explanation: "`log` is appended to on every call and never trimmed or cleared, so in a long-running process it grows without bound and slowly consumes all available memory.",
  },
  {
    id: "cd-0292",
    level: 292,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `history = []

def track_event(event):
    history.append(event)
    print(f"Tracked {len(history)} events")`,
    question: "What's wrong with this code?",
    options: ["IndexError when history is empty", "Memory leak — history grows forever since nothing ever removes old entries", "Wrong variable used inside the print statement", "Missing indentation inside the function"],
    correctIndex: 1,
    explanation: "`history` is appended to on every call and never trimmed or cleared, so in a long-running process it grows without bound and slowly consumes all available memory.",
  },
  {
    id: "cd-0293",
    level: 293,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `buffer = []

def track_event(event):
    buffer.append(event)
    print(f"Tracked {len(buffer)} events")`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the print statement", "Missing indentation inside the function", "IndexError when buffer is empty", "Memory leak — buffer grows forever since nothing ever removes old entries"],
    correctIndex: 3,
    explanation: "`buffer` is appended to on every call and never trimmed or cleared, so in a long-running process it grows without bound and slowly consumes all available memory.",
  },
  {
    id: "cd-0294",
    level: 294,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `events = []

def track_event(event):
    events.append(event)
    print(f"Tracked {len(events)} events")`,
    question: "What's wrong with this code?",
    options: ["Memory leak — events grows forever since nothing ever removes old entries", "IndexError when events is empty", "Wrong variable used inside the print statement", "Missing indentation inside the function"],
    correctIndex: 0,
    explanation: "`events` is appended to on every call and never trimmed or cleared, so in a long-running process it grows without bound and slowly consumes all available memory.",
  },
  {
    id: "cd-0295",
    level: 295,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `records = []

def track_event(event):
    records.append(event)
    print(f"Tracked {len(records)} events")`,
    question: "What's wrong with this code?",
    options: ["Memory leak — records grows forever since nothing ever removes old entries", "IndexError when records is empty", "Wrong variable used inside the print statement", "Missing indentation inside the function"],
    correctIndex: 0,
    explanation: "`records` is appended to on every call and never trimmed or cleared, so in a long-running process it grows without bound and slowly consumes all available memory.",
  },
  {
    id: "cd-0296",
    level: 296,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `session_log = []

def track_event(event):
    session_log.append(event)
    print(f"Tracked {len(session_log)} events")`,
    question: "What's wrong with this code?",
    options: ["Missing indentation inside the function", "Wrong variable used inside the print statement", "IndexError when session_log is empty", "Memory leak — session_log grows forever since nothing ever removes old entries"],
    correctIndex: 3,
    explanation: "`session_log` is appended to on every call and never trimmed or cleared, so in a long-running process it grows without bound and slowly consumes all available memory.",
  },
  {
    id: "cd-0297",
    level: 297,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `activity_log = []

def track_event(event):
    activity_log.append(event)
    print(f"Tracked {len(activity_log)} events")`,
    question: "What's wrong with this code?",
    options: ["Missing indentation inside the function", "Memory leak — activity_log grows forever since nothing ever removes old entries", "IndexError when activity_log is empty", "Wrong variable used inside the print statement"],
    correctIndex: 1,
    explanation: "`activity_log` is appended to on every call and never trimmed or cleared, so in a long-running process it grows without bound and slowly consumes all available memory.",
  },
  {
    id: "cd-0298",
    level: 298,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `trace = []

def track_event(event):
    trace.append(event)
    print(f"Tracked {len(trace)} events")`,
    question: "What's wrong with this code?",
    options: ["IndexError when trace is empty", "Memory leak — trace grows forever since nothing ever removes old entries", "Missing indentation inside the function", "Wrong variable used inside the print statement"],
    correctIndex: 1,
    explanation: "`trace` is appended to on every call and never trimmed or cleared, so in a long-running process it grows without bound and slowly consumes all available memory.",
  },
  {
    id: "cd-0299",
    level: 299,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `audit_trail = []

def track_event(event):
    audit_trail.append(event)
    print(f"Tracked {len(audit_trail)} events")`,
    question: "What's wrong with this code?",
    options: ["Memory leak — audit_trail grows forever since nothing ever removes old entries", "IndexError when audit_trail is empty", "Wrong variable used inside the print statement", "Missing indentation inside the function"],
    correctIndex: 0,
    explanation: "`audit_trail` is appended to on every call and never trimmed or cleared, so in a long-running process it grows without bound and slowly consumes all available memory.",
  },
  {
    id: "cd-0300",
    level: 300,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `def read_lines(path):
    f = open(path, "r")
    lines = f.readlines()
    return lines`,
    question: "What's wrong with this code?",
    options: ["IndexError when the file is empty", "Wrong variable returned at the end", "Missing indentation in the function body", "Resource leak — the file is never closed (no f.close() or a with block)"],
    correctIndex: 3,
    explanation: "The opened file handle `f` is never closed. Over many calls this leaks file descriptors — use `with open(path) as f:` so it's closed automatically.",
  },
  {
    id: "cd-0301",
    level: 301,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `def load_file(path):
    f = open(path, "r")
    lines = f.readlines()
    return lines`,
    question: "What's wrong with this code?",
    options: ["IndexError when the file is empty", "Wrong variable returned at the end", "Resource leak — the file is never closed (no f.close() or a with block)", "Missing indentation in the function body"],
    correctIndex: 2,
    explanation: "The opened file handle `f` is never closed. Over many calls this leaks file descriptors — use `with open(path) as f:` so it's closed automatically.",
  },
  {
    id: "cd-0302",
    level: 302,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `def read_data(path):
    f = open(path, "r")
    lines = f.readlines()
    return lines`,
    question: "What's wrong with this code?",
    options: ["Resource leak — the file is never closed (no f.close() or a with block)", "Missing indentation in the function body", "IndexError when the file is empty", "Wrong variable returned at the end"],
    correctIndex: 0,
    explanation: "The opened file handle `f` is never closed. Over many calls this leaks file descriptors — use `with open(path) as f:` so it's closed automatically.",
  },
  {
    id: "cd-0303",
    level: 303,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `def get_lines(path):
    f = open(path, "r")
    lines = f.readlines()
    return lines`,
    question: "What's wrong with this code?",
    options: ["Resource leak — the file is never closed (no f.close() or a with block)", "IndexError when the file is empty", "Wrong variable returned at the end", "Missing indentation in the function body"],
    correctIndex: 0,
    explanation: "The opened file handle `f` is never closed. Over many calls this leaks file descriptors — use `with open(path) as f:` so it's closed automatically.",
  },
  {
    id: "cd-0304",
    level: 304,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `def read_all(path):
    f = open(path, "r")
    lines = f.readlines()
    return lines`,
    question: "What's wrong with this code?",
    options: ["Wrong variable returned at the end", "IndexError when the file is empty", "Missing indentation in the function body", "Resource leak — the file is never closed (no f.close() or a with block)"],
    correctIndex: 3,
    explanation: "The opened file handle `f` is never closed. Over many calls this leaks file descriptors — use `with open(path) as f:` so it's closed automatically.",
  },
  {
    id: "cd-0305",
    level: 305,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `def open_and_read(path):
    f = open(path, "r")
    lines = f.readlines()
    return lines`,
    question: "What's wrong with this code?",
    options: ["Resource leak — the file is never closed (no f.close() or a with block)", "IndexError when the file is empty", "Wrong variable returned at the end", "Missing indentation in the function body"],
    correctIndex: 0,
    explanation: "The opened file handle `f` is never closed. Over many calls this leaks file descriptors — use `with open(path) as f:` so it's closed automatically.",
  },
  {
    id: "cd-0306",
    level: 306,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `def fetch_lines(path):
    f = open(path, "r")
    lines = f.readlines()
    return lines`,
    question: "What's wrong with this code?",
    options: ["IndexError when the file is empty", "Resource leak — the file is never closed (no f.close() or a with block)", "Wrong variable returned at the end", "Missing indentation in the function body"],
    correctIndex: 1,
    explanation: "The opened file handle `f` is never closed. Over many calls this leaks file descriptors — use `with open(path) as f:` so it's closed automatically.",
  },
  {
    id: "cd-0307",
    level: 307,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `def load_contents(path):
    f = open(path, "r")
    lines = f.readlines()
    return lines`,
    question: "What's wrong with this code?",
    options: ["IndexError when the file is empty", "Wrong variable returned at the end", "Resource leak — the file is never closed (no f.close() or a with block)", "Missing indentation in the function body"],
    correctIndex: 2,
    explanation: "The opened file handle `f` is never closed. Over many calls this leaks file descriptors — use `with open(path) as f:` so it's closed automatically.",
  },
  {
    id: "cd-0308",
    level: 308,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `def read_text(path):
    f = open(path, "r")
    lines = f.readlines()
    return lines`,
    question: "What's wrong with this code?",
    options: ["Resource leak — the file is never closed (no f.close() or a with block)", "Missing indentation in the function body", "Wrong variable returned at the end", "IndexError when the file is empty"],
    correctIndex: 0,
    explanation: "The opened file handle `f` is never closed. Over many calls this leaks file descriptors — use `with open(path) as f:` so it's closed automatically.",
  },
  {
    id: "cd-0309",
    level: 309,
    difficulty: 5,
    category: "memory",
    language: "python",
    code: `def get_file_lines(path):
    f = open(path, "r")
    lines = f.readlines()
    return lines`,
    question: "What's wrong with this code?",
    options: ["IndexError when the file is empty", "Resource leak — the file is never closed (no f.close() or a with block)", "Missing indentation in the function body", "Wrong variable returned at the end"],
    correctIndex: 1,
    explanation: "The opened file handle `f` is never closed. Over many calls this leaks file descriptors — use `with open(path) as f:` so it's closed automatically.",
  },
  {
    id: "cd-0310",
    level: 310,
    difficulty: 5,
    category: "memory",
    language: "javascript",
    code: `function setup() {
  const bigData = new Array(69879).fill("x");
  document.getElementById("btn").addEventListener("click", function() {
    console.log(bigData.length);
  });
}`,
    question: "What's wrong with this code?",
    options: ["Missing semicolon after the function declaration", "Wrong variable used inside the event handler", "IndexError because bigData has no elements", "Memory leak — the click listener closes over bigData and is never removed"],
    correctIndex: 3,
    explanation: "The event listener's closure keeps `bigData` alive for as long as the listener is attached. If `setup()` runs repeatedly without removing old listeners, each call leaks its own copy of bigData.",
  },
  {
    id: "cd-0311",
    level: 311,
    difficulty: 5,
    category: "memory",
    language: "javascript",
    code: `function setup() {
  const bigData = new Array(9094).fill("x");
  document.getElementById("btn").addEventListener("click", function() {
    console.log(bigData.length);
  });
}`,
    question: "What's wrong with this code?",
    options: ["Missing semicolon after the function declaration", "IndexError because bigData has no elements", "Memory leak — the click listener closes over bigData and is never removed", "Wrong variable used inside the event handler"],
    correctIndex: 2,
    explanation: "The event listener's closure keeps `bigData` alive for as long as the listener is attached. If `setup()` runs repeatedly without removing old listeners, each call leaks its own copy of bigData.",
  },
  {
    id: "cd-0312",
    level: 312,
    difficulty: 5,
    category: "memory",
    language: "javascript",
    code: `function setup() {
  const bigData = new Array(69202).fill("x");
  document.getElementById("btn").addEventListener("click", function() {
    console.log(bigData.length);
  });
}`,
    question: "What's wrong with this code?",
    options: ["Memory leak — the click listener closes over bigData and is never removed", "Wrong variable used inside the event handler", "Missing semicolon after the function declaration", "IndexError because bigData has no elements"],
    correctIndex: 0,
    explanation: "The event listener's closure keeps `bigData` alive for as long as the listener is attached. If `setup()` runs repeatedly without removing old listeners, each call leaks its own copy of bigData.",
  },
  {
    id: "cd-0313",
    level: 313,
    difficulty: 5,
    category: "memory",
    language: "javascript",
    code: `function setup() {
  const bigData = new Array(12919).fill("x");
  document.getElementById("btn").addEventListener("click", function() {
    console.log(bigData.length);
  });
}`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the event handler", "IndexError because bigData has no elements", "Missing semicolon after the function declaration", "Memory leak — the click listener closes over bigData and is never removed"],
    correctIndex: 3,
    explanation: "The event listener's closure keeps `bigData` alive for as long as the listener is attached. If `setup()` runs repeatedly without removing old listeners, each call leaks its own copy of bigData.",
  },
  {
    id: "cd-0314",
    level: 314,
    difficulty: 5,
    category: "memory",
    language: "javascript",
    code: `function setup() {
  const bigData = new Array(68272).fill("x");
  document.getElementById("btn").addEventListener("click", function() {
    console.log(bigData.length);
  });
}`,
    question: "What's wrong with this code?",
    options: ["Wrong variable used inside the event handler", "Missing semicolon after the function declaration", "IndexError because bigData has no elements", "Memory leak — the click listener closes over bigData and is never removed"],
    correctIndex: 3,
    explanation: "The event listener's closure keeps `bigData` alive for as long as the listener is attached. If `setup()` runs repeatedly without removing old listeners, each call leaks its own copy of bigData.",
  },
  {
    id: "cd-0315",
    level: 315,
    difficulty: 5,
    category: "memory",
    language: "javascript",
    code: `function setup() {
  const bigData = new Array(89181).fill("x");
  document.getElementById("btn").addEventListener("click", function() {
    console.log(bigData.length);
  });
}`,
    question: "What's wrong with this code?",
    options: ["Missing semicolon after the function declaration", "Memory leak — the click listener closes over bigData and is never removed", "IndexError because bigData has no elements", "Wrong variable used inside the event handler"],
    correctIndex: 1,
    explanation: "The event listener's closure keeps `bigData` alive for as long as the listener is attached. If `setup()` runs repeatedly without removing old listeners, each call leaks its own copy of bigData.",
  },
  {
    id: "cd-0316",
    level: 316,
    difficulty: 5,
    category: "memory",
    language: "javascript",
    code: `function setup() {
  const bigData = new Array(29560).fill("x");
  document.getElementById("btn").addEventListener("click", function() {
    console.log(bigData.length);
  });
}`,
    question: "What's wrong with this code?",
    options: ["IndexError because bigData has no elements", "Missing semicolon after the function declaration", "Wrong variable used inside the event handler", "Memory leak — the click listener closes over bigData and is never removed"],
    correctIndex: 3,
    explanation: "The event listener's closure keeps `bigData` alive for as long as the listener is attached. If `setup()` runs repeatedly without removing old listeners, each call leaks its own copy of bigData.",
  },
  {
    id: "cd-0317",
    level: 317,
    difficulty: 5,
    category: "memory",
    language: "javascript",
    code: `function setup() {
  const bigData = new Array(9357).fill("x");
  document.getElementById("btn").addEventListener("click", function() {
    console.log(bigData.length);
  });
}`,
    question: "What's wrong with this code?",
    options: ["Missing semicolon after the function declaration", "IndexError because bigData has no elements", "Wrong variable used inside the event handler", "Memory leak — the click listener closes over bigData and is never removed"],
    correctIndex: 3,
    explanation: "The event listener's closure keeps `bigData` alive for as long as the listener is attached. If `setup()` runs repeatedly without removing old listeners, each call leaks its own copy of bigData.",
  },
];