'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

/* ============================================================================
   BUG HUNTER
   A huge syntax-highlighted code editor hides exactly 10 bugs somewhere in
   the listing. Click the buggy lines before the timer runs out — like
   Where's Waldo, but every wrong click costs you points, not time.
   ========================================================================== */

/* --------------------------- Template line helpers ------------------------ */

type FixedLine = { type: 'fixed'; text: string };
type BugLine = { type: 'bug'; correct: string; buggy: string; hint: string };
type TplLine = FixedLine | BugLine;

const L = (text: string): FixedLine => ({ type: 'fixed', text });
const B = (correct: string, buggy: string, hint: string): BugLine => ({
  type: 'bug',
  correct,
  buggy,
  hint,
});

type Template = {
  id: string;
  title: string;
  lang: string;
  ext: string;
  lines: TplLine[];
};

/* --------------------------------- Templates ------------------------------ */
/* 20 templates x 12 candidate bug-lines each. Every puzzle variant activates
   exactly 10 of the 12 candidates as real bugs, so no two variants look
   quite the same even though they share a base snippet. */

const TEMPLATES: Template[] = [
  // 1 ----------------------------------------------------------------------
  {
    id: 'js-array-pipeline',
    title: 'Array Pipeline',
    lang: 'JavaScript',
    ext: '.js',
    lines: [
      L('function processScores(scores) {'),
      B(
        '  if (!Array.isArray(scores) || scores.length === 0) return null;',
        '  if (!Array.isArray(scores) && scores.length === 0) return null;',
        '&& only rejects when both conditions fail, letting bad input through.'
      ),
      B('  let total = 0;', '  let total = 1;', 'Accumulator should start at 0, not 1.'),
      B('  let min = Math.min(...scores);', '  let min = Math.max(...scores);', 'Uses Math.max instead of Math.min.'),
      B('  let max = -Infinity;', '  let max = 0;', 'Starting at 0 fails when every score is negative.'),
      L('  for (let i = 0; i < scores.length; i++) {'),
      B(
        '    total += scores[i];',
        '    total += scores[i + 1];',
        'Reads one index ahead, skipping the last score with undefined.'
      ),
      B('    if (scores[i] > max) max = scores[i];', '    if (scores[i] > max) max = i;', 'Stores the index instead of the value.'),
      L('  }'),
      B('  const range = max - min;', '  const range = max + min;', 'Range should be a difference, not a sum.'),
      B('  const average = total / scores.length;', '  const average = total / scores.length - 1;', 'Subtracts one from the denominator, skewing the average.'),
      B('  const sorted = [...scores].sort((a, b) => a - b);', '  const sorted = [...scores].sort();', 'Default sort compares as strings, breaking numeric order.'),
      B('  const median = sorted[Math.floor(sorted.length / 2)];', '  const median = sorted[Math.ceil(sorted.length / 2)];', 'Ceil can push the median index out of range.'),
      B('  const isPassing = average >= 50;', '  const isPassing = average > 50;', 'Excludes students scoring exactly 50.'),
      B(
        '  return { average, max, min, range, median, isPassing };',
        '  return { average, max, min, range, median, isPassing: !isPassing };',
        'Inverts the passing flag before returning it.'
      ),
      L('}'),
    ],
  },
  // 2 ----------------------------------------------------------------------
  {
    id: 'js-async-fetch',
    title: 'Async Fetch',
    lang: 'JavaScript',
    ext: '.js',
    lines: [
      L('async function loadUser(id) {'),
      B('  const url = `/api/users/${id}`;', '  const url = `/api/user/${id}`;', "Route says 'user' instead of 'users'."),
      B('  const response = await fetch(url);', '  const response = fetch(url);', "Missing 'await' — response becomes a pending Promise."),
      B(
        '  if (!response.ok) throw new Error(\'Request failed\');',
        '  if (response.ok) throw new Error(\'Request failed\');',
        'Condition inverted — throws on success instead of failure.'
      ),
      B('  const data = await response.json();', '  const data = response.json();', "Missing 'await' before parsing the JSON body."),
      B(
        '  return { id: data.id, name: data.name, email: data.email };',
        '  return { id: data.id, name: data.name, email: data.mail };',
        "Typo: should read 'data.email', not 'data.mail'."
      ),
      L('}'),
      L(''),
      L('async function loadUsers(ids) {'),
      B('  if (!Array.isArray(ids)) return [];', '  if (!Array.isArray(ids)) return ids;', 'Should fall back to an empty array, not the bad input itself.'),
      B('  const users = [];', '  const users = {};', 'Should collect results in an array, not an object.'),
      B('  for (const id of ids) {', '  for (const id in ids) {', "'for...in' iterates indices, not the id values themselves."),
      B('    const user = await loadUser(id);', '    const user = loadUser(id);', "Missing 'await' — pushes a Promise instead of the resolved user."),
      B('    users.push(user);', '    users.push(users);', 'Pushes the whole array into itself instead of the new user.'),
      L('  }'),
      B('  return users.filter(u => u !== null);', '  return users.filter(u => u === null);', 'Filter condition keeps only nulls instead of removing them.'),
      B(
        '  console.log(`Loaded ${users.length} users`);',
        '  console.log(`Loaded ${ids.length} users`);',
        'Logs the requested count, not the actually loaded count.'
      ),
      L('}'),
    ],
  },
  // 3 ----------------------------------------------------------------------
  {
    id: 'js-closures',
    title: 'Closures Module',
    lang: 'JavaScript',
    ext: '.js',
    lines: [
      L('function createCounter(start) {'),
      B(
        "  if (typeof start !== 'number') start = 0;",
        "  if (typeof start !== 'number') start = start;",
        'Falls back to itself instead of defaulting to 0 for invalid input.'
      ),
      B('  let count = start;', '  let count = 0;', "Ignores the 'start' argument, always beginning at 0."),
      B('  const increment = () => (count += 1);', '  const increment = () => (count -= 1);', 'Increment actually decreases the count.'),
      B('  const decrement = () => (count -= 1);', '  const decrement = () => (count += 1);', 'Decrement actually increases the count.'),
      B('  const reset = () => { count = start; };', '  const reset = () => { count = 0; };', 'Resets to 0 instead of the original start value.'),
      B('  const getCount = () => count;', '  const getCount = () => start;', 'Returns the original start value, not the live count.'),
      L('  return { increment, decrement, reset, getCount };'),
      L('}'),
      L(''),
      L('function createDebouncer(fn, delay) {'),
      B('  let timer = null;', '  let timer = 0;', 'Should initialize to null before any timeout is scheduled.'),
      B('  return (...args) => {', '  return (args) => {', 'Missing rest spread — only captures the first argument.'),
      B('    clearTimeout(timer);', '    clearInterval(timer);', 'Clears an interval instead of the timeout that was actually set.'),
      B('    timer = setTimeout(() => fn(...args), delay);', '    timer = setTimeout(() => fn(...args), 0);', 'Ignores the configured delay, always firing immediately.'),
      L('  };'),
      L('}'),
      B(
        'const throttleLog = createDebouncer(console.log, 300);',
        "const throttleLog = createDebouncer(console.log, '300');",
        'Delay is passed as a string instead of a number.'
      ),
    ],
  },
  // 4 ----------------------------------------------------------------------
  {
    id: 'py-data-cleaning',
    title: 'Data Cleaning',
    lang: 'Python',
    ext: '.py',
    lines: [
      L('def clean_scores(raw_scores):'),
      B(
        '    scores = [s for s in raw_scores if s is not None]',
        '    scores = [s for s in raw_scores if s is None]',
        'Keeps only the None values instead of filtering them out.'
      ),
      B(
        '    scores = [max(0, min(100, s)) for s in scores]',
        '    scores = [max(0, min(100, s)) for s in scores][1:]',
        'Drops the first cleaned score for no reason.'
      ),
      B('    total = sum(scores)', '    total = sum(scores) + 1', 'Adds a stray +1 to the total.'),
      B('    count = len(scores)', '    count = len(raw_scores)', "Uses the uncleaned list's length, mismatched with 'scores'."),
      B('    average = total / count if count else 0', '    average = total / count', 'Divides by zero when the list is empty.'),
      B('    passing = [s for s in scores if s >= 50]', '    passing = [s for s in scores if s <= 50]', 'Keeps failing scores instead of passing ones.'),
      B(
        '    pass_rate = len(passing) / count if count else 0',
        '    pass_rate = len(passing) / len(passing) if count else 0',
        'Always evaluates to 1 — divides the passing count by itself.'
      ),
      B(
        "    return {'average': average, 'pass_rate': pass_rate}",
        "    return {'average': pass_rate, 'pass_rate': average}",
        'Swaps the average and pass_rate values in the result.'
      ),
      L(''),
      L('def top_n(scores, n):'),
      B('    if n <= 0:', '    if n < 0:', 'Allows n = 0 to slip past the guard clause.'),
      L('        return []'),
      B(
        '    return sorted(scores, reverse=True)[:n]',
        '    return sorted(scores)[:n]',
        "Sorts ascending, so the 'top' scores end up as the lowest ones."
      ),
      L(''),
      L('def normalize(scores):'),
      B('    return [s / 100 for s in scores]', '    return [s / 100 for s in scores[1:]]', 'Skips the first score when normalizing.'),
    ],
  },
  // 5 ----------------------------------------------------------------------
  {
    id: 'py-bank-account',
    title: 'BankAccount Class',
    lang: 'Python',
    ext: '.py',
    lines: [
      L('class BankAccount:'),
      L('    def __init__(self, owner, balance=0):'),
      B('        self.owner = owner', '        self.owner = None', 'Owner is discarded and hardcoded to None.'),
      B('        self.balance = balance', '        self.balance = 0', 'Ignores the initial balance argument, always starts at 0.'),
      B('        self.history = []', '        self.history = None', 'History should start as an empty list, not None.'),
      L(''),
      L('    def deposit(self, amount):'),
      B('        if amount <= 0:', '        if amount < 0:', 'Allows a zero deposit to slip through the guard.'),
      B(
        "        raise ValueError('Deposit must be positive')",
        "        return ValueError('Deposit must be positive')",
        'Returns the error object instead of raising it.'
      ),
      B('        self.balance += amount', '        self.balance -= amount', 'Subtracts the deposit instead of adding it.'),
      B("        self.history.append(('deposit', amount))", "        self.history.append(('withdraw', amount))", 'Logs every deposit as a withdrawal.'),
      L(''),
      L('    def withdraw(self, amount):'),
      B('        if amount > self.balance:', '        if amount >= self.balance:', 'Blocks withdrawing the exact full balance.'),
      B(
        "        raise ValueError('Insufficient funds')",
        "        print('Insufficient funds')",
        'Silently prints instead of raising, so the withdrawal still proceeds.'
      ),
      B('        self.balance -= amount', '        self.balance = amount', 'Overwrites the balance instead of subtracting from it.'),
      L(''),
      L('    def __repr__(self):'),
      B("        return f'{self.owner}: {self.balance}'", "        return f'{self.balance}: {self.owner}'", 'Swaps the order of owner and balance in the string.'),
      L(''),
      L('    def is_overdrawn(self):'),
      B('        return self.balance < 0', '        return self.balance > 0', 'Checks the wrong direction — flags positive balances as overdrawn.'),
    ],
  },
  // 6 ----------------------------------------------------------------------
  {
    id: 'py-recursion',
    title: 'Recursion Basics',
    lang: 'Python',
    ext: '.py',
    lines: [
      L('def factorial(n):'),
      B('    if n < 0:', '    if n <= 0:', 'Treats 0 as invalid input, blocking factorial(0).'),
      B(
        "        raise ValueError('n must be non-negative')",
        '        return None',
        'Silently returns None instead of raising on invalid input.'
      ),
      B('    if n == 0:', '    if n == 1:', 'Base case never triggers for n = 0.'),
      B('        return 1', '        return 0', 'Factorial of the base case should be 1, not 0.'),
      B('    return n * factorial(n - 1)', '    return n * factorial(n)', 'Recurses with the same n forever — infinite recursion.'),
      L(''),
      L('def fibonacci(n, memo=None):'),
      B('    if memo is None:', '    if memo is not None:', 'Skips creating the memo dict on the very first call.'),
      B('        memo = {}', '        memo = {0: 0}', 'Pre-seeds memo, silently changing the base behaviour.'),
      B('    if n in memo:', '    if n not in memo:', 'Inverted membership check bypasses the cache entirely.'),
      B('        return memo[n]', '        return memo[n - 1]', 'Returns the previous cached value instead of the requested one.'),
      B('    if n <= 1:', '    if n < 1:', 'Skips the base case for n == 1.'),
      B('        return n', '        return n - 1', 'Off-by-one on the fibonacci base case.'),
      B(
        '    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)',
        '    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 1, memo)',
        'Adds the same subproblem twice instead of n-1 and n-2.'
      ),
      L('    return memo[n]'),
    ],
  },
  // 7 ----------------------------------------------------------------------
  {
    id: 'py-gradient-descent',
    title: 'Gradient Descent',
    lang: 'Python (ML)',
    ext: '.py',
    lines: [
      L('import numpy as np'),
      L(''),
      L('def gradient_descent(X, y, lr=0.01, epochs=100):'),
      B('    n_samples, n_features = X.shape', '    n_samples, n_features = X.shape[::-1]', 'Reverses the shape tuple, swapping samples and features.'),
      B('    weights = np.zeros(n_features)', '    weights = np.ones(n_features)', 'Initializes weights to ones instead of zeros.'),
      B('    bias = 0.0', '    bias = 1.0', 'Bias should start at 0, not 1.'),
      B('    for epoch in range(epochs):', '    for epoch in range(epochs - 1):', 'Runs one fewer epoch than requested.'),
      B('        predictions = X.dot(weights) + bias', '        predictions = X.dot(weights) - bias', 'Subtracts the bias instead of adding it.'),
      B('        error = predictions - y', '        error = y - predictions', 'Flips the sign of the error term.'),
      B('        dw = (2 / n_samples) * X.T.dot(error)', '        dw = (2 / n_samples) * X.dot(error)', "Missing transpose — shapes won't align with the gradient."),
      B('        db = (2 / n_samples) * np.sum(error)', '        db = (2 / n_samples) * np.mean(error)', 'Uses mean instead of sum, scaling the bias gradient incorrectly.'),
      B('        weights -= lr * dw', '        weights += lr * dw', 'Ascends the gradient instead of descending it.'),
      B('        bias -= lr * db', '        bias -= lr', 'Ignores the computed gradient, using a constant step instead.'),
      L('    return weights, bias'),
      L(''),
      L('def predict(X, weights, bias):'),
      B('    return X.dot(weights) + bias', '    return X.dot(weights) * bias', 'Multiplies by bias instead of adding it.'),
    ],
  },
  // 8 ----------------------------------------------------------------------
  {
    id: 'java-rectangle',
    title: 'Rectangle Class',
    lang: 'Java',
    ext: '.java',
    lines: [
      L('public class Rectangle {'),
      L('    private double width;'),
      L('    private double height;'),
      L(''),
      L('    public Rectangle(double width, double height) {'),
      B(
        '        if (width <= 0 || height <= 0) throw new IllegalArgumentException("Invalid size");',
        '        if (width <= 0 && height <= 0) throw new IllegalArgumentException("Invalid size");',
        '&& only rejects when both sides are invalid, letting one bad dimension through.'
      ),
      B('        this.width = width;', '        this.width = height;', 'Assigns the height value into the width field.'),
      B('        this.height = height;', '        this.height = width;', 'Assigns the width value into the height field.'),
      L('    }'),
      L(''),
      L('    public double area() {'),
      B('        return width * height;', '        return width + height;', 'Adds the sides instead of multiplying them for area.'),
      L('    }'),
      L(''),
      L('    public double perimeter() {'),
      B('        return 2 * (width + height);', '        return 2 * (width * height);', "Multiplies instead of adding — this isn't the perimeter formula."),
      L('    }'),
      L(''),
      L('    public boolean isSquare() {'),
      B('        return width == height;', '        return width != height;', 'Inverted comparison — flags non-squares as squares.'),
      L('    }'),
      L(''),
      L('    public void scale(double factor) {'),
      B('        width *= factor;', '        width *= factor + 1;', 'Scales by factor+1 instead of factor.'),
      B('        height *= factor;', '        height = factor;', 'Overwrites height with the factor instead of scaling it.'),
      L('    }'),
      L(''),
      L('    public boolean equals(Rectangle other) {'),
      B(
        '        return this.width == other.width && this.height == other.height;',
        '        return this.width == other.width || this.height == other.height;',
        'Should require both dimensions to match, not just one.'
      ),
      L('    }'),
      L(''),
      L('    public double getWidth() {'),
      B('        return width;', '        return height;', 'Getter for width returns height instead.'),
      L('    }'),
    ],
  },
  // 9 ----------------------------------------------------------------------
  {
    id: 'java-collections',
    title: 'Inventory Collections',
    lang: 'Java',
    ext: '.java',
    lines: [
      L('import java.util.*;'),
      L(''),
      L('public class Inventory {'),
      B('    private Map<String, Integer> stock = new HashMap<>();', '    private Map<String, Integer> stock = null;', 'Field starts as null instead of an empty map, causing NPEs later.'),
      L(''),
      L('    public void addItem(String name, int qty) {'),
      B('        if (qty <= 0) return;', '        if (qty < 0) return;', 'Allows a zero-quantity add to slip through.'),
      B('        int current = stock.getOrDefault(name, 0);', '        int current = stock.get(name);', 'get() returns null for missing keys, causing an unboxing NPE.'),
      B('        stock.put(name, current + qty);', '        stock.put(name, qty);', 'Overwrites existing stock instead of adding to it.'),
      L('    }'),
      L(''),
      L('    public boolean removeItem(String name, int qty) {'),
      B(
        '        int current = stock.getOrDefault(name, 0);',
        '        int current = stock.getOrDefault(name, qty);',
        'Wrong default — assumes full quantity is in stock when the key is missing.'
      ),
      B('        if (current < qty) return false;', '        if (current <= qty) return false;', 'Blocks removing the exact remaining quantity.'),
      B('        stock.put(name, current - qty);', '        stock.put(name, qty - current);', 'Computes the new quantity backwards.'),
      B('        return true;', '        return false;', 'Reports failure even on a successful removal.'),
      L('    }'),
      L(''),
      L('    public List<String> lowStockItems(int threshold) {'),
      B('        List<String> result = new ArrayList<>();', '        List<String> result = null;', 'Returns a null list base instead of an empty one.'),
      L('        for (Map.Entry<String, Integer> entry : stock.entrySet()) {'),
      B('            if (entry.getValue() < threshold) {', '            if (entry.getValue() > threshold) {', 'Inverted comparison — lists well-stocked items instead of low ones.'),
      B('                result.add(entry.getKey());', '                result.add(entry.getValue().toString());', 'Adds the quantity instead of the item name.'),
      L('            }'),
      L('        }'),
      B('        return result;', '        return new ArrayList<>(stock.keySet());', 'Ignores the filtered result, returning every item instead.'),
      L('    }'),
      L('}'),
    ],
  },
  // 10 ---------------------------------------------------------------------
  {
    id: 'java-exceptions',
    title: 'File Exception Handling',
    lang: 'Java',
    ext: '.java',
    lines: [
      L('public class FileProcessor {'),
      L('    private int openHandles = 0;'),
      L(''),
      L('    public String readConfig(String path) {'),
      B('        openHandles++;', '        openHandles--;', 'Decrements before an open even succeeds, going negative.'),
      L('        try {'),
      B(
        '            byte[] data = Files.readAllBytes(Paths.get(path));',
        '            byte[] data = Files.readAllBytes(Paths.get(path + ".bak"));',
        'Silently reads a backup file instead of the requested path.'
      ),
      B('            return new String(data, StandardCharsets.UTF_8);', '            return new String(data);', 'Drops the explicit charset, risking platform-dependent decoding.'),
      L('        } catch (IOException e) {'),
      B(
        '            System.err.println("Failed to read: " + path);',
        '            System.err.println("Failed to read: " + e);',
        'Logs the exception object instead of the file path that failed.'
      ),
      B('            return null;', '            return "";', 'Returns an empty string instead of null, masking the failure.'),
      L('        } finally {'),
      B('            openHandles--;', '            openHandles++;', 'Increments the open-handle counter instead of decrementing it in cleanup.'),
      L('        }'),
      L('    }'),
      L(''),
      L('    public void writeConfig(String path, String content) {'),
      B('        if (!isValidPath(path)) return;', '        if (isValidPath(path)) return;', 'Inverted guard — bails out on valid paths instead of invalid ones.'),
      B(
        '        try (FileWriter writer = new FileWriter(path)) {',
        '        try (FileWriter writer = new FileWriter(path, true)) {',
        'Silently switches to append mode instead of overwrite.'
      ),
      B('            writer.write(content);', '            writer.write(content.trim());', 'Trims the content before writing, altering saved data.'),
      L('        } catch (IOException e) {'),
      B('            throw new RuntimeException("Write failed", e);', '            e.printStackTrace();', 'Swallows the exception instead of propagating a failure.'),
      L('        }'),
      L('    }'),
      L(''),
      L('    public boolean isValidPath(String path) {'),
      B('        return path != null && !path.isEmpty();', '        return path != null || !path.isEmpty();', 'A null path can still pass the second check — NPE risk.'),
      L('    }'),
    ],
  },
  // 11 ---------------------------------------------------------------------
  {
    id: 'c-pointers',
    title: 'Manual String Functions',
    lang: 'C',
    ext: '.c',
    lines: [
      L('#include <stdio.h>'),
      L('#include <string.h>'),
      L(''),
      L('int my_strlen(const char *s) {'),
      B('    int len = 0;', '    int len = 1;', 'Length counter should start at 0, not 1.'),
      B("    while (s[len] != '\\0') {", "    while (s[len] != '\\n') {", 'Checks for a newline instead of the null terminator.'),
      B('        len++;', '        len--;', 'Decrements instead of counting up.'),
      L('    }'),
      B('    return len;', '    return len - 1;', 'Off-by-one — always reports one character short.'),
      L('}'),
      L(''),
      L('void my_strcpy(char *dest, const char *src) {'),
      B('    int i = 0;', '    int i = 1;', 'Starts copying from index 1, skipping the first character.'),
      L("    while (src[i] != '\\0') {"),
      B('        dest[i] = src[i];', '        dest[i] = src[i + 1];', 'Copies from one character ahead, shifting the string.'),
      B('        i++;', '        i += 2;', 'Skips every other character while copying.'),
      L('    }'),
      B("    dest[i] = '\\0';", "    dest[i] = ' ';", 'Terminates with a space instead of a null byte.'),
      L('}'),
      L(''),
      L('int my_strcmp(const char *a, const char *b) {'),
      B('    int i = 0;', '    int i = -1;', 'Starts at index -1, reading before the string begins.'),
      B("    while (a[i] != '\\0' && b[i] != '\\0') {", "    while (a[i] != '\\0' || b[i] != '\\0') {", 'Keeps looping after one string ends, reading out of bounds.'),
      B('        if (a[i] != b[i]) return a[i] - b[i];', '        if (a[i] != b[i]) return b[i] - a[i];', 'Reverses the sign of the comparison result.'),
      L('        i++;'),
      L('    }'),
      B('    return a[i] - b[i];', '    return 0;', 'Always reports equal strings once the loop ends, ignoring length differences.'),
      L('}'),
    ],
  },
  // 12 ---------------------------------------------------------------------
  {
    id: 'cpp-stack',
    title: 'Custom Stack',
    lang: 'C++',
    ext: '.cpp',
    lines: [
      L('#include <vector>'),
      L('#include <stdexcept>'),
      L('using namespace std;'),
      L(''),
      L('class Stack {'),
      L('private:'),
      L('    vector<int> data;'),
      L(''),
      L('public:'),
      L('    void push(int value) {'),
      B('        data.push_back(value);', '        data.insert(data.begin(), value);', 'Inserts at the front instead of pushing to the back.'),
      L('    }'),
      L(''),
      L('    int pop() {'),
      B(
        '        if (data.empty()) throw runtime_error("Stack is empty");',
        '        if (data.size() == 0) return -1;',
        'Returns a sentinel instead of throwing, hiding the empty-stack error.'
      ),
      B('        int top = data.back();', '        int top = data.front();', 'Reads the front element instead of the top of the stack.'),
      B('        data.pop_back();', '        data.erase(data.begin());', 'Removes the front element instead of the last one pushed.'),
      B('        return top;', '        return data.back();', 'Returns the new top after removal instead of the popped value.'),
      L('    }'),
      L(''),
      L('    int peek() const {'),
      B(
        '        if (data.empty()) throw runtime_error("Stack is empty");',
        '        if (!data.empty()) throw runtime_error("Stack is empty");',
        'Inverted check — throws only when the stack actually has items.'
      ),
      B('        return data.back();', '        return data[data.size()];', 'Off-by-one — indexes one past the last valid element.'),
      L('    }'),
      L(''),
      L('    bool isEmpty() const {'),
      B('        return data.empty();', '        return !data.empty();', 'Inverted — reports full stacks as empty and vice versa.'),
      L('    }'),
      L(''),
      L('    int size() const {'),
      B('        return data.size();', '        return data.size() - 1;', 'Undercounts the stack by one element.'),
      L('    }'),
      L('};'),
      L(''),
      L('int sumOfStack(Stack s) {'),
      B('    int total = 0;', '    int total = 1;', 'Accumulator should start at 0.'),
      B('    while (!s.isEmpty()) {', '    while (s.isEmpty()) {', 'Loop condition is inverted — never runs on a non-empty stack.'),
      B('        total += s.pop();', '        total -= s.pop();', 'Subtracts each popped value instead of adding it.'),
      L('    }'),
      L('    return total;'),
      L('}'),
    ],
  },
  // 13 ---------------------------------------------------------------------
  {
    id: 'sql-report',
    title: 'Customer Report Query',
    lang: 'SQL',
    ext: '.sql',
    lines: [
      L('SELECT'),
      B('  c.customer_name,', '  c.customer_id,', 'Selects the raw ID instead of the readable customer name.'),
      B('  COUNT(o.order_id) AS order_count,', '  COUNT(c.customer_id) AS order_count,', 'Counts customer rows instead of orders after the join.'),
      B('  SUM(o.total_amount) AS total_spent,', '  SUM(o.total_amount) AS avg_spent,', 'Mislabels a SUM as an average — the alias lies about its contents.'),
      B('  AVG(o.total_amount) AS avg_order_value', '  AVG(o.order_id) AS avg_order_value', 'Averages the order IDs instead of the order amounts.'),
      L('FROM customers c'),
      B(
        'INNER JOIN orders o ON c.customer_id = o.customer_id',
        'INNER JOIN orders o ON c.customer_id = o.order_id',
        'Joins mismatched columns — customer_id should match customer_id.'
      ),
      B("WHERE o.status = 'completed'", "WHERE o.status != 'completed'", 'Excludes completed orders instead of including them.'),
      B("  AND o.order_date >= '2024-01-01'", "  AND o.order_date <= '2024-01-01'", 'Only keeps orders before Jan 1, not from that date onward.'),
      B('GROUP BY c.customer_name', 'GROUP BY o.order_id', 'Groups by order instead of by customer, defeating the aggregation.'),
      B('HAVING COUNT(o.order_id) > 1', 'HAVING COUNT(o.order_id) > 0', 'Includes single-order customers even though the report wants repeat buyers.'),
      B('ORDER BY total_spent DESC', 'ORDER BY total_spent ASC', 'Sorts ascending, so the biggest spenders end up at the bottom.'),
      B('LIMIT 10;', 'LIMIT 10 OFFSET 10;', 'Skips the first 10 rows, showing the 11th-20th instead of the top 10.'),
    ],
  },
  // 14 ---------------------------------------------------------------------
  {
    id: 'css-card-grid',
    title: 'Card Grid Layout',
    lang: 'CSS',
    ext: '.css',
    lines: [
      L('.card-grid {'),
      B('  display: grid;', '  display: flex;', 'Should use grid layout, not flex, to support the column template below.'),
      B('  grid-template-columns: repeat(3, 1fr);', '  grid-template-columns: repeat(3, 100px);', "Fixed pixel columns won't respond to container width."),
      B('  gap: 16px;', '  gap: 16;', "Missing unit — 'gap: 16' is invalid CSS."),
      B('  align-items: stretch;', '  align-items: strech;', "Typo: 'strech' isn't valid, so alignment falls back to default."),
      L('}'),
      L(''),
      L('.card {'),
      B('  padding: 16px;', '  padding: 16px 16px 16px;', 'Only three values for a four-side shorthand — top/bottom mismatch.'),
      B('  border-radius: 8px;', '  border-radius: 8%;', 'Percentage radius scales oddly with card size instead of a fixed curve.'),
      B('  box-shadow: 0 2px 6px rgba(0,0,0,0.15);', '  box-shadow: 0 2px 6px rgb(0,0,0,0.15);', 'Uses rgb() with an alpha channel — should be rgba().'),
      L('}'),
      L(''),
      L('.card-title {'),
      B('  font-weight: 600;', '  font-weight: 60;', '600 is a valid weight; 60 is not — falls back to normal.'),
      B('  color: #1a1a1a;', '  color: #1a1a1a1a;', 'Extra hex digits make this an invalid color value.'),
      L('}'),
      L(''),
      L('.card-actions {'),
      B('  display: flex;', '  display: inline;', "'inline' ignores the justify-content and gap rules below."),
      B('  justify-content: space-between;', '  justify-content: space-between !important;', 'Unnecessary !important makes future overrides fragile.'),
      B('  gap: 8px;', '  gab: 8px;', "Typo 'gab' instead of 'gap' — the property is silently ignored."),
      L('}'),
    ],
  },
  // 15 ---------------------------------------------------------------------
  {
    id: 'bash-backup',
    title: 'Backup Script',
    lang: 'Bash',
    ext: '.sh',
    lines: [
      L('#!/bin/bash'),
      B('set -e', 'set +e', 'Disables exit-on-error instead of enabling it, letting failures continue silently.'),
      L(''),
      B('SOURCE_DIR="/var/www/app"', 'SOURCE_DIR=/var/www/app', 'Missing quotes around a path — breaks if it ever contains a space.'),
      B('BACKUP_DIR="/backups"', 'BACKUP_DIR="/backup"', "Points at '/backup' instead of the actual '/backups' directory."),
      B('TIMESTAMP=$(date +%Y%m%d)', 'TIMESTAMP=$(date +%Y%m%d', 'Missing closing parenthesis on the command substitution.'),
      L(''),
      B('if [ ! -d "$BACKUP_DIR" ]; then', 'if [ -d "$BACKUP_DIR" ]; then', 'Inverted check — tries to create the directory only when it already exists.'),
      B('  mkdir -p "$BACKUP_DIR"', '  mkdir "$BACKUP_DIR"', "Without -p, this fails if parent directories don't exist yet."),
      L('fi'),
      L(''),
      B(
        'ARCHIVE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz"',
        'ARCHIVE="$BACKUP_DIR/backup_$TIMESTAMP.tar"',
        "Names the file .tar even though it's actually gzip-compressed."
      ),
      B('tar -czf "$ARCHIVE" "$SOURCE_DIR"', 'tar -xzf "$ARCHIVE" "$SOURCE_DIR"', 'Uses extract (-x) instead of create (-c), skipping the backup step.'),
      L(''),
      B('if [ $? -eq 0 ]; then', 'if [ $? -ne 0 ]; then', 'Inverted exit-code check — treats success as failure.'),
      B('  echo "Backup succeeded: $ARCHIVE"', '  echo "Backup succeeded: $SOURCE_DIR"', 'Prints the source path instead of the actual archive location.'),
      L('else'),
      B('  echo "Backup failed" >&2', '  echo "Backup failed"', "Doesn't redirect the error message to stderr."),
      L('fi'),
      L(''),
      B('find "$BACKUP_DIR" -mtime +30 -delete', 'find "$BACKUP_DIR" -mtime -30 -delete', '-30 targets recent files instead of ones older than 30 days.'),
    ],
  },
  // 16 ---------------------------------------------------------------------
  {
    id: 'go-slice-map',
    title: 'Word Count Utility',
    lang: 'Go',
    ext: '.go',
    lines: [
      L('package main'),
      L(''),
      L('import "fmt"'),
      L(''),
      L('func wordCount(text []string) map[string]int {'),
      B('  counts := make(map[string]int)', '  var counts map[string]int', 'Nil map — writes will panic since it was never initialized with make().'),
      L('  for _, word := range text {'),
      B('    counts[word]++', '    counts[word] = 1', 'Resets the count to 1 every time instead of incrementing it.'),
      L('  }'),
      B('  return counts', '  return nil', 'Discards all the counted results, always returning nil.'),
      L('}'),
      L(''),
      L('func mostCommon(counts map[string]int) string {'),
      B('  best := ""', '  best := "unknown"', 'Starts with a placeholder that could incorrectly win as the result.'),
      B('  bestCount := 0', '  bestCount := -1', 'Starting below zero lets a zero-count word win by default.'),
      L('  for word, count := range counts {'),
      B('    if count > bestCount {', '    if count >= bestCount {', 'Ties overwrite the earlier winner instead of keeping the first one found.'),
      B('      best = word', '      bestCount = word', 'Assigns a string into the numeric bestCount variable — type mismatch.'),
      L('      bestCount = count'),
      L('    }'),
      L('  }'),
      B('  return best', '  return fmt.Sprint(bestCount)', 'Returns the count instead of the winning word.'),
      L('}'),
      L(''),
      L('func isEmpty(s []int) bool {'),
      B('  return len(s) == 0', '  return len(s) != 0', 'Inverted — reports non-empty slices as empty.'),
      L('}'),
    ],
  },
  // 17 ---------------------------------------------------------------------
  {
    id: 'ts-generics',
    title: 'Generic Utilities',
    lang: 'TypeScript',
    ext: '.ts',
    lines: [
      L('interface User {'),
      L('  id: number;'),
      L('  name: string;'),
      L('  age: number;'),
      L('}'),
      L(''),
      L('function filterAdults(users: User[]): User[] {'),
      B('  return users.filter(u => u.age >= 18);', '  return users.filter(u => u.age > 18);', 'Excludes users who are exactly 18.'),
      L('}'),
      L(''),
      L('function findById(users: User[], id: number): User | undefined {'),
      B('  return users.find(u => u.id === id);', '  return users.find(u => u.id == id);', "Loose equality risks matching across mismatched types."),
      L('}'),
      L(''),
      L('function sortByAge(users: User[]): User[] {'),
      B(
        '  return [...users].sort((a, b) => a.age - b.age);',
        '  return users.sort((a, b) => a.age - b.age);',
        'Sorts the original array in place instead of a copy, mutating the input.'
      ),
      L('}'),
      L(''),
      L('function groupByAgeRange(users: User[]): Record<string, User[]> {'),
      B('  const groups: Record<string, User[]> = {};', '  const groups: Record<string, User[]> = null as any;', 'Initializes the map to null, breaking the first insert below.'),
      L('  for (const user of users) {'),
      B(
        "    const range = user.age < 18 ? 'minor' : user.age < 65 ? 'adult' : 'senior';",
        "    const range = user.age < 18 ? 'minor' : user.age < 65 ? 'senior' : 'adult';",
        "Swaps the labels for 'adult' and 'senior' ranges."
      ),
      B('    if (!groups[range]) groups[range] = [];', '    if (groups[range]) groups[range] = [];', "Resets the bucket to empty every time instead of only when it's missing."),
      B('    groups[range].push(user);', '    groups[range].push(range as any);', 'Pushes the label string into the array instead of the user object.'),
      L('  }'),
      B('  return groups;', '  return groups[0] as any;', 'Indexes the Record with a number — its keys here are strings.'),
      L('}'),
      L(''),
      L('function last<T>(items: T[]): T | undefined {'),
      B('  return items[items.length - 1];', '  return items[items.length];', 'Off-by-one — this index is always out of bounds.'),
      L('}'),
      L(''),
      L('function average(users: User[]): number {'),
      B(
        '  return users.reduce((sum, u) => sum + u.age, 0) / users.length;',
        '  return users.reduce((sum, u) => sum + u.age, 1) / users.length;',
        'Starts the running sum at 1 instead of 0, skewing every average.'
      ),
      L('}'),
    ],
  },
  // 18 ---------------------------------------------------------------------
  {
    id: 'react-todo',
    title: 'Todo List Component',
    lang: 'React',
    ext: '.jsx',
    lines: [
      L("import { useState, useEffect } from 'react';"),
      L(''),
      L('function TodoList({ initialTodos }) {'),
      B('  const [todos, setTodos] = useState(initialTodos);', '  const [todos, setTodos] = useState([]);', 'Ignores the initialTodos prop, always starting empty.'),
      B('  const [count, setCount] = useState(0);', '  const [count, setCount] = useState(todos.length);', "Reads 'todos' before it's reliably initialized."),
      L(''),
      L('  useEffect(() => {'),
      B('    setCount(todos.length);', '    setCount(todos.length + 1);', 'Always reports one more todo than actually exists.'),
      B('  }, [todos]);', '  }, []);', 'Empty dependency array — the effect never re-runs when todos change.'),
      L(''),
      L('  function addTodo(text) {'),
      B(
        '    setTodos([...todos, { text, done: false }]);',
        '    setTodos(todos.push({ text, done: false }));',
        "Array.push returns the new length, not the array — state becomes a number."
      ),
      L('  }'),
      L(''),
      L('  function toggleTodo(index) {'),
      B(
        '    setTodos(todos.map((t, i) => (i === index ? { ...t, done: !t.done } : t)));',
        '    setTodos(todos.map((t, i) => (i === index ? { ...t, done: t.done } : t)));',
        "Copies 'done' unchanged instead of flipping it — toggling does nothing."
      ),
      L('  }'),
      L(''),
      L('  function removeTodo(index) {'),
      B(
        '    setTodos(todos.filter((t, i) => i !== index));',
        '    setTodos(todos.filter((t, i) => i === index));',
        'Keeps only the removed item instead of filtering it out.'
      ),
      L('  }'),
      L(''),
      L('  function clearCompleted() {'),
      B('    setTodos(todos.filter(t => !t.done));', '    setTodos(todos.filter(t => t.done));', 'Clears the incomplete todos instead of the completed ones.'),
      L('  }'),
      L(''),
      B('  const remaining = todos.filter(t => !t.done).length;', '  const remaining = todos.filter(t => t.done).length;', 'Counts completed todos instead of remaining ones.'),
      L(''),
      L('  return ('),
      L('    <div>'),
      B(
        '      <p>{remaining} of {todos.length} remaining</p>',
        '      <p>{remaining} of {count} remaining</p>',
        "Uses the possibly-stale 'count' state instead of the live todos length."
      ),
      L('      <ul>'),
      L('        {todos.map((todo, i) => ('),
      B(
        '          <li key={i} onClick={() => toggleTodo(i)}>',
        '          <li key={Math.random()} onClick={() => toggleTodo(i)}>',
        "Random keys break React's reconciliation between renders."
      ),
      L('          </li>'),
      L('        ))}'),
      L('      </ul>'),
      L('    </div>'),
      L('  );'),
      L('}'),
    ],
  },
  // 19 ---------------------------------------------------------------------
  {
    id: 'dsa-binary-search',
    title: 'Binary Search',
    lang: 'DSA (Python)',
    ext: '.py',
    lines: [
      L('def binary_search(arr, target):'),
      B('    low, high = 0, len(arr) - 1', '    low, high = 0, len(arr)', 'High starts one past the last valid index.'),
      L('    while low <= high:'),
      B('        mid = (low + high) // 2', '        mid = (low + high + 1) // 2', 'Biases the midpoint upward, which can skip the correct element.'),
      L('        if arr[mid] == target:'),
      B('            return mid', '            return low', 'Returns the search boundary instead of the found index.'),
      B('        elif arr[mid] < target:', '        elif arr[mid] <= target:', "Treats an exact match as 'too low', overshooting it."),
      B('            low = mid + 1', '            low = mid', "Doesn't advance the boundary — this can loop forever."),
      L('        else:'),
      B('            high = mid - 1', '            high = mid', "Doesn't shrink the boundary — this can loop forever."),
      L('    return -1'),
      L(''),
      L('def binary_search_first(arr, target):'),
      B('    low, high = 0, len(arr) - 1', '    low, high = 1, len(arr) - 1', 'Skips index 0 entirely — the true first match is never checked.'),
      B('    result = -1', '    result = 0', 'Wrong sentinel value — 0 looks like a valid found index.'),
      L('    while low <= high:'),
      B('        mid = (low + high) // 2', '        mid = (low - high) // 2', 'Subtracting instead of adding can produce a negative index.'),
      B('        if arr[mid] >= target:', '        if arr[mid] > target:', 'Excludes an exact match from narrowing toward the first occurrence.'),
      B(
        '            result = mid if arr[mid] == target else result',
        '            result = mid',
        'Records every visited index as a match, not just true matches.'
      ),
      L('            high = mid - 1'),
      L('        else:'),
      B('            low = mid + 1', '            low = mid', "Doesn't advance the boundary — this can loop forever."),
      L('    return result'),
    ],
  },
  // 20 ---------------------------------------------------------------------
  {
    id: 'dsa-linked-list',
    title: 'Linked List Operations',
    lang: 'DSA (JavaScript)',
    ext: '.js',
    lines: [
      L('class Node {'),
      L('  constructor(value) {'),
      B('    this.value = value;', '    this.value = null;', 'Discards the constructor argument, always storing null.'),
      B('    this.next = null;', '    this.next = value;', "Points 'next' at the value itself instead of null."),
      L('  }'),
      L('}'),
      L(''),
      L('class LinkedList {'),
      L('  constructor() {'),
      B('    this.head = null;', '    this.head = undefined;', 'Uses undefined instead of null — inconsistent with the checks below.'),
      B('    this.length = 0;', '    this.length = 1;', 'Length should start at 0 for an empty list.'),
      L('  }'),
      L(''),
      L('  append(value) {'),
      L('    const node = new Node(value);'),
      B('    if (!this.head) {', '    if (this.head) {', 'Inverted check — only sets the head when one already exists.'),
      B('      this.head = node;', '      this.head = node.next;', 'Sets head to the (null) next pointer instead of the new node.'),
      L('    } else {'),
      B('      let current = this.head;', '      let current = node;', 'Starts traversal from the new node instead of the existing head.'),
      B('      while (current.next) {', '      while (current) {', 'Walks past the last node — current.next will be undefined.'),
      L('        current = current.next;'),
      L('      }'),
      B('      current.next = node;', '      current.next = node.next;', "Links to the new node's own (null) next instead of the new node."),
      L('    }'),
      B('    this.length++;', '    this.length--;', 'Shrinks the length counter on every append instead of growing it.'),
      L('  }'),
      L(''),
      L('  removeAt(index) {'),
      B(
        '    if (index < 0 || index >= this.length) return null;',
        '    if (index < 0 || index > this.length) return null;',
        'Off-by-one — allows an out-of-range index equal to the length.'
      ),
      L('    if (index === 0) {'),
      L('      this.head = this.head.next;'),
      L('    } else {'),
      L('      let prev = null;'),
      L('      let current = this.head;'),
      L('      for (let i = 0; i < index; i++) {'),
      L('        prev = current;'),
      L('        current = current.next;'),
      L('      }'),
      B('      prev.next = current.next;', '      prev.next = current;', 'Re-links to the node being removed instead of skipping past it.'),
      L('    }'),
      L('    this.length--;'),
      L('  }'),
      L('}'),
    ],
  },
];

/* ------------------------------ Puzzle engine ------------------------------ */

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffleIdx(n: number, seed: number) {
  const rand = mulberry32(seed);
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const BUGS_PER_PUZZLE = 10;
const VARIANTS_PER_TEMPLATE = 10;

type PuzzleLine = { text: string; isBug: boolean; hint?: string };
type Puzzle = {
  id: string;
  title: string;
  lang: string;
  filename: string;
  lines: PuzzleLine[];
};

function buildPuzzles(): Puzzle[] {
  const puzzles: Puzzle[] = [];
  TEMPLATES.forEach((tpl, ti) => {
    const bugIdxAll: number[] = [];
    tpl.lines.forEach((ln, i) => {
      if (ln.type === 'bug') bugIdxAll.push(i);
    });
    for (let v = 0; v < VARIANTS_PER_TEMPLATE; v++) {
      const seed = ti * 977 + v * 193 + 11;
      const order = seededShuffleIdx(bugIdxAll.length, seed);
      const activeLocal = new Set(order.slice(0, BUGS_PER_PUZZLE));
      const activeLineIdx = new Set(Array.from(activeLocal).map((li) => bugIdxAll[li]));
      const lines: PuzzleLine[] = tpl.lines.map((ln, i) => {
        if (ln.type === 'fixed') return { text: ln.text, isBug: false };
        const isBug = activeLineIdx.has(i);
        return { text: isBug ? ln.buggy : ln.correct, isBug, hint: ln.hint };
      });
      puzzles.push({
        id: `${tpl.id}-v${v + 1}`,
        title: `${tpl.title} #${v + 1}`,
        lang: tpl.lang,
        filename: `${tpl.id.replace(/-/g, '_')}_${v + 1}${tpl.ext}`,
        lines,
      });
    }
  });
  return puzzles;
}

const TOTAL_PUZZLES = TEMPLATES.length * VARIANTS_PER_TEMPLATE;

/* ------------------------------ Syntax coloring ---------------------------- */

const KEYWORDS = [
  'function', 'return', 'if', 'else', 'elif', 'for', 'while', 'do', 'break', 'continue',
  'const', 'let', 'var', 'def', 'class', 'public', 'private', 'protected', 'static',
  'void', 'int', 'float', 'double', 'char', 'bool', 'boolean', 'import', 'from', 'as',
  'try', 'catch', 'finally', 'throw', 'new', 'this', 'self', 'True', 'False', 'None',
  'null', 'undefined', 'struct', 'switch', 'case', 'package', 'interface', 'extends',
  'implements', 'async', 'await', 'export', 'default', 'using', 'namespace', 'template',
  'raise', 'except', 'in', 'is', 'not', 'and', 'or', 'range', 'len', 'func', 'type', 'map',
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'GROUP', 'BY', 'ORDER',
  'HAVING', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
  'AND', 'OR', 'NOT', 'IN', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT', 'UNION', 'display',
];
const KEYWORD_RE_SRC = `\\b(?:${KEYWORDS.join('|')})\\b`;

function commentSource(lang: string) {
  if (lang.startsWith('Python') || lang === 'Bash') return '#.*';
  if (lang === 'SQL') return '--.*';
  if (lang === 'CSS') return '/\\*.*?\\*/';
  return '//.*';
}

function highlightLine(text: string, lang: string) {
  const re = new RegExp(
    `(${commentSource(lang)})|('(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*"|\`(?:[^\`\\\\]|\\\\.)*\`)|(${KEYWORD_RE_SRC})|(\\b\\d+(?:\\.\\d+)?\\b)`,
    'g'
  );
  const parts: { key: string; text: string; cls?: string }[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push({ key: `p${k++}`, text: text.slice(lastIndex, m.index) });
    }
    const cls = m[1] ? 'tok-com' : m[2] ? 'tok-str' : m[3] ? 'tok-kw' : 'tok-num';
    parts.push({ key: `p${k++}`, text: m[0], cls });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push({ key: `p${k++}`, text: text.slice(lastIndex) });
  if (parts.length === 0) parts.push({ key: 'p0', text: '\u00A0' });
  return parts;
}

/* --------------------------------- Timing ---------------------------------- */

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', seconds: 100, mult: 1 },
  { id: 'normal', label: 'Normal', seconds: 75, mult: 1.5 },
  { id: 'hard', label: 'Hard', seconds: 50, mult: 2 },
] as const;

type Phase = 'idle' | 'playing' | 'won' | 'lost';

type Stats = { bestScore: number; bestStreak: number; totalPlayed: number; totalSolved: number };
const STATS_KEY = 'bug-hunter-stats-v1';

function loadStats(): Stats {
  if (typeof window === 'undefined') return { bestScore: 0, bestStreak: 0, totalPlayed: 0, totalSolved: 0 };
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (!raw) return { bestScore: 0, bestStreak: 0, totalPlayed: 0, totalSolved: 0 };
    const p = JSON.parse(raw);
    return {
      bestScore: p.bestScore ?? 0,
      bestStreak: p.bestStreak ?? 0,
      totalPlayed: p.totalPlayed ?? 0,
      totalSolved: p.totalSolved ?? 0,
    };
  } catch {
    return { bestScore: 0, bestStreak: 0, totalPlayed: 0, totalSolved: 0 };
  }
}

/* --------------------------------- Page ------------------------------------ */

export default function BugHunterPage() {
  const puzzles = useMemo(() => buildPuzzles(), []);
  const [difficulty, setDifficulty] = useState<typeof DIFFICULTIES[number]>(DIFFICULTIES[1]);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [foundIdx, setFoundIdx] = useState<Set<number>>(new Set());
  const [flashIdx, setFlashIdx] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintLineIdx, setHintLineIdx] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats>({ bestScore: 0, bestStreak: 0, totalPlayed: 0, totalSolved: 0 });

  const roundEndsAt = useRef(0);
  const tickRef = useRef<number | null>(null);
  const foundRef = useRef<Set<number>>(new Set());
  const scoreRef = useRef(0);
  const flashTimeoutRef = useRef<number | null>(null);
  const hintTimeoutRef = useRef<number | null>(null);

  useEffect(() => setStats(loadStats()), []);
  useEffect(() => {
    foundRef.current = foundIdx;
  }, [foundIdx]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const persistStats = useCallback((next: Stats) => {
    setStats(next);
    if (typeof window !== 'undefined') window.localStorage.setItem(STATS_KEY, JSON.stringify(next));
  }, []);

  const finishRound = useCallback(
    (won: boolean) => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      setPhase(won ? 'won' : 'lost');
      const remain = Math.max(0, roundEndsAt.current - Date.now()) / 1000;
      const bonus = won ? Math.round(remain * 5 * difficulty.mult) : 0;
      setTimeLeft(0);
      setScore((s) => s + bonus);
      const newStreak = won ? streak + 1 : 0;
      setStreak(newStreak);
      persistStats({
        bestScore: Math.max(stats.bestScore, scoreRef.current + bonus),
        bestStreak: Math.max(stats.bestStreak, newStreak),
        totalPlayed: stats.totalPlayed + 1,
        totalSolved: stats.totalSolved + (won ? 1 : 0),
      });
    },
    [difficulty.mult, streak, stats, persistStats]
  );

  const startPuzzle = useCallback(
    (specific?: Puzzle) => {
      const next = specific ?? puzzles[Math.floor(Math.random() * puzzles.length)];
      setPuzzle(next);
      setFoundIdx(new Set());
      setFlashIdx(null);
      setHintLineIdx(null);
      setHintsUsed(0);
      setPhase('playing');
      roundEndsAt.current = Date.now() + difficulty.seconds * 1000;
      setTimeLeft(difficulty.seconds);
    },
    [puzzles, difficulty.seconds]
  );

  useEffect(() => {
    if (phase !== 'playing') {
      if (tickRef.current) window.clearInterval(tickRef.current);
      return;
    }
    tickRef.current = window.setInterval(() => {
      const remain = (roundEndsAt.current - Date.now()) / 1000;
      if (remain <= 0) {
        setTimeLeft(0);
        finishRound(false);
      } else {
        setTimeLeft(remain);
      }
    }, 100);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [phase, finishRound]);

  const handleLineClick = (index: number) => {
    if (phase !== 'playing' || !puzzle) return;
    if (foundIdx.has(index)) return;
    const line = puzzle.lines[index];
    if (line.isBug) {
      const next = new Set(foundIdx);
      next.add(index);
      setFoundIdx(next);
      setScore((s) => s + Math.round(15 * difficulty.mult));
      if (next.size === BUGS_PER_PUZZLE) {
        finishRound(true);
      }
    } else {
      setScore((s) => Math.max(0, s - 2));
      setFlashIdx(index);
      if (flashTimeoutRef.current) window.clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = window.setTimeout(() => setFlashIdx(null), 350);
    }
  };

  const useHint = () => {
    if (phase !== 'playing' || !puzzle || timeLeft <= 6) return;
    const unfound = puzzle.lines
      .map((l, i) => ({ l, i }))
      .filter(({ l, i }) => l.isBug && !foundIdx.has(i));
    if (unfound.length === 0) return;
    const pick = unfound[Math.floor(Math.random() * unfound.length)];
    roundEndsAt.current -= 5000;
    setHintsUsed((h) => h + 1);
    setHintLineIdx(pick.i);
    if (hintTimeoutRef.current) window.clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = window.setTimeout(() => setHintLineIdx(null), 1400);
  };

  const missedLines = useMemo(() => {
    if (!puzzle || phase !== 'lost') return [];
    return puzzle.lines
      .map((l, i) => ({ l, i }))
      .filter(({ l, i }) => l.isBug && !foundIdx.has(i));
  }, [puzzle, phase, foundIdx]);

  const timePct = puzzle ? Math.max(0, Math.min(1, timeLeft / difficulty.seconds)) : 1;
  const timeLow = timeLeft > 0 && timeLeft <= difficulty.seconds * 0.2;

  return (
    <div className="bh-root">
      <header className="bh-header">
        <div className="bh-wordmark">
          BUG_HUNTER<span className="bh-cursor" aria-hidden="true" />
        </div>
        <p className="bh-tagline">
          {TOTAL_PUZZLES} listings, {BUGS_PER_PUZZLE} hidden bugs each. Scan the code, click every
          buggy line, and squash all ten before the clock hits zero.
        </p>
        <div className="bh-stats">
          <Stat label="score" value={score} />
          <Stat label="streak" value={streak} suffix={streak > 0 ? ' 🔥' : ''} />
          <Stat label="best score" value={stats.bestScore} />
          <Stat label="solved" value={`${stats.totalSolved}/${stats.totalPlayed}`} />
        </div>
      </header>

      <div className="bh-controls">
        <div className="bh-diffgroup" role="group" aria-label="Difficulty">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              className={`bh-diffbtn${difficulty.id === d.id ? ' is-active' : ''}`}
              onClick={() => setDifficulty(d)}
              disabled={phase === 'playing'}
            >
              {d.label}
              <span>{d.seconds}s</span>
            </button>
          ))}
        </div>
        <button className="bh-cta" onClick={() => startPuzzle()}>
          {phase === 'idle' ? '▶ start hunting' : '🔀 new puzzle'}
        </button>
        {phase === 'playing' && (
          <button className="bh-ghost" onClick={useHint} disabled={timeLeft <= 6}>
            💡 hint (−5s)
          </button>
        )}
      </div>

      <main className="bh-editor-wrap">
        <div className="bh-tabbar">
          <div className="bh-tab">
            <span className="bh-tab-dot" />
            {puzzle ? puzzle.filename : 'select_a_puzzle.txt'}
          </div>
          <div className="bh-tabmeta">
            {puzzle && <span className="bh-badge">{puzzle.lang}</span>}
            <span className="bh-badge">
              {foundIdx.size}/{BUGS_PER_PUZZLE} found
            </span>
            {phase === 'playing' && (
              <span className={`bh-badge bh-timer${timeLow ? ' is-low' : ''}`}>{timeLeft.toFixed(1)}s</span>
            )}
          </div>
        </div>
        <div className="bh-progress">
          <div className={`bh-progress-fill${timeLow ? ' is-low' : ''}`} style={{ width: `${timePct * 100}%` }} />
        </div>

        {(phase === 'won' || phase === 'lost') && (
          <div className={`bh-banner ${phase === 'won' ? 'is-won' : 'is-lost'}`}>
            {phase === 'won'
              ? `ALL ${BUGS_PER_PUZZLE} BUGS SQUASHED — nice eyes.`
              : `TIME'S UP — found ${foundIdx.size}/${BUGS_PER_PUZZLE}. Missed lines are marked below.`}
          </div>
        )}

        <div className="bh-editor">
          {!puzzle && (
            <div className="bh-empty">
              <p>Pick a difficulty and press start — a random listing with 10 hidden bugs will load here.</p>
            </div>
          )}
          {puzzle &&
            puzzle.lines.map((line, i) => {
              const found = foundIdx.has(i);
              const missed = phase === 'lost' && line.isBug && !found;
              const isHinting = hintLineIdx === i;
              const clickable = phase === 'playing';
              return (
                <div
                  key={i}
                  className={[
                    'bh-line',
                    found ? 'is-found' : '',
                    flashIdx === i ? 'is-flash' : '',
                    missed ? 'is-missed' : '',
                    isHinting ? 'is-hint' : '',
                    clickable ? 'is-clickable' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleLineClick(i)}
                  role={clickable ? 'button' : undefined}
                  tabIndex={clickable ? 0 : -1}
                  onKeyDown={(e) => {
                    if (clickable && (e.key === 'Enter' || e.key === ' ')) handleLineClick(i);
                  }}
                >
                  <span className="bh-line-num">{i + 1}</span>
                  <span className="bh-line-text">
                    {highlightLine(line.text || '\u00A0', puzzle.lang).map((p) => (
                      <span key={p.key} className={p.cls ? `tok-${p.cls.replace('tok-', '')}` : undefined}>
                        {p.text}
                      </span>
                    ))}
                  </span>
                  {(found || missed) && line.hint && <span className="bh-line-hint">{line.hint}</span>}
                </div>
              );
            })}
        </div>
      </main>

      <footer className="bh-footer">
        <span>{TOTAL_PUZZLES} puzzles across {TEMPLATES.length} topics</span>
        <span>hints used this round: {hintsUsed}</span>
      </footer>

      {/* Theme is driven entirely by the header ThemeProvider, which toggles
          the `dark` class on <html>/<body> (Tailwind darkMode: "class").
          This component never manages its own theme state — all colors
          below are CSS variables that flip when `.dark` is present up the
          tree, matching every other CodeNFacts page. */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap');

        :root {
          /* Light mode — white / #f7f8fa surfaces, amber accent */
          --bh-bg: #ffffff;
          --bh-panel: #f7f8fa;
          --bh-panel-2: #eef0f4;
          --bh-border: #e0e3e9;
          --bh-text: #12151c;
          --bh-text-muted: #626b7a;
          --bh-primary: #d97706;
          --bh-primary-contrast: #ffffff;
          --bh-success: #16a34a;
          --bh-success-bg: #ecfdf3;
          --bh-danger: #dc2626;
          --bh-danger-bg: #fef2f2;
          --bh-warning: #d97706;
          --bh-warning-bg: #fffbeb;
          --bh-line-num: #b7bec9;
          --bh-tok-kw: #b45309;
          --bh-tok-str: #92400e;
          --bh-tok-com: #8a94a6;
          --bh-tok-num: #0f766e;
          --bh-shadow: none;
        }

        .dark {
          /* Dark mode — #0a0e14 / #0d1117 surfaces, emerald accent */
          --bh-bg: #0a0e14;
          --bh-panel: #0d1117;
          --bh-panel-2: #161b22;
          --bh-border: #262b38;
          --bh-text: #e7e9ee;
          --bh-text-muted: #8b93a7;
          --bh-primary: #34d399;
          --bh-primary-contrast: #0a0e14;
          --bh-success: #4ade80;
          --bh-success-bg: rgba(74, 222, 128, 0.12);
          --bh-danger: #f87171;
          --bh-danger-bg: rgba(248, 113, 113, 0.12);
          --bh-warning: #fbbf24;
          --bh-warning-bg: rgba(251, 191, 36, 0.1);
          --bh-line-num: #4b5163;
          --bh-tok-kw: #34d399;
          --bh-tok-str: #fbbf24;
          --bh-tok-com: #6b7280;
          --bh-tok-num: #5eead4;
          --bh-shadow: 0 1px 0 rgba(255, 255, 255, 0.02) inset;
        }

        .bh-root {
          min-height: 100vh;
          background: var(--bh-bg);
          color: var(--bh-text);
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          padding: 32px 20px 48px;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .bh-header {
          max-width: 1040px;
          margin: 0 auto 20px;
        }

        .bh-wordmark {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-weight: 700;
          font-size: clamp(22px, 4vw, 32px);
          letter-spacing: 0.02em;
          color: var(--bh-primary);
        }

        .bh-cursor {
          display: inline-block;
          width: 0.55em;
          height: 1em;
          margin-left: 4px;
          background: var(--bh-primary);
          vertical-align: -0.15em;
          animation: bh-blink 1s steps(1) infinite;
        }

        @keyframes bh-blink {
          50% { opacity: 0; }
        }

        .bh-tagline {
          margin-top: 8px;
          max-width: 680px;
          color: var(--bh-text-muted);
          font-size: 14.5px;
          line-height: 1.55;
        }

        .bh-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 16px;
        }

        .bh-stat {
          border: 1px solid var(--bh-border);
          background: var(--bh-panel);
          border-radius: 8px;
          padding: 8px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          box-shadow: var(--bh-shadow);
        }

        .bh-stat b {
          color: var(--bh-text);
          font-size: 14px;
          margin-right: 6px;
        }

        .bh-stat span {
          color: var(--bh-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .bh-controls {
          max-width: 1040px;
          margin: 0 auto 16px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .bh-diffgroup {
          display: flex;
          border: 1px solid var(--bh-border);
          border-radius: 8px;
          overflow: hidden;
        }

        .bh-diffbtn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          padding: 9px 14px;
          background: var(--bh-panel);
          border: none;
          border-right: 1px solid var(--bh-border);
          color: var(--bh-text-muted);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .bh-diffbtn:last-child { border-right: none; }

        .bh-diffbtn span { font-size: 9.5px; }

        .bh-diffbtn.is-active {
          background: var(--bh-primary);
          color: var(--bh-primary-contrast);
        }

        .bh-diffbtn:disabled { cursor: not-allowed; opacity: 0.6; }

        .bh-cta {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 13.5px;
          color: var(--bh-primary-contrast);
          background: var(--bh-primary);
          border: none;
          border-radius: 8px;
          padding: 11px 20px;
          cursor: pointer;
        }

        .bh-ghost {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: var(--bh-warning);
          background: var(--bh-bg);
          border: 1px solid var(--bh-warning);
          border-radius: 8px;
          padding: 10px 16px;
          cursor: pointer;
        }

        .bh-ghost:disabled { opacity: 0.35; cursor: not-allowed; }

        .bh-editor-wrap {
          max-width: 1040px;
          margin: 0 auto;
        }

        .bh-tabbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          border: 1px solid var(--bh-border);
          border-bottom: none;
          border-radius: 12px 12px 0 0;
          background: var(--bh-panel);
          padding: 10px 14px;
        }

        .bh-tab {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--bh-text);
        }

        .bh-tab-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--bh-primary);
        }

        .bh-tabmeta { display: flex; gap: 8px; flex-wrap: wrap; }

        .bh-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          border: 1px solid var(--bh-border);
          border-radius: 999px;
          padding: 4px 10px;
          background: var(--bh-bg);
          color: var(--bh-text-muted);
        }

        .bh-timer { color: var(--bh-primary); border-color: var(--bh-primary); }
        .bh-timer.is-low { color: var(--bh-danger); border-color: var(--bh-danger); }

        .bh-progress {
          height: 5px;
          background: var(--bh-panel-2);
          border-left: 1px solid var(--bh-border);
          border-right: 1px solid var(--bh-border);
          overflow: hidden;
        }

        .bh-progress-fill {
          height: 100%;
          background: var(--bh-primary);
          transition: width 0.1s linear;
        }

        .bh-progress-fill.is-low { background: var(--bh-danger); }

        .bh-banner {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
          padding: 10px;
          border-left: 1px solid var(--bh-border);
          border-right: 1px solid var(--bh-border);
        }

        .bh-banner.is-won { background: var(--bh-success-bg); color: var(--bh-success); }
        .bh-banner.is-lost { background: var(--bh-danger-bg); color: var(--bh-danger); }

        .bh-editor {
          border: 1px solid var(--bh-border);
          border-radius: 0 0 12px 12px;
          background: var(--bh-bg);
          overflow: hidden;
          min-height: 420px;
        }

        .bh-empty {
          padding: 60px 24px;
          text-align: center;
          color: var(--bh-text-muted);
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
        }

        .bh-line {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 3px 14px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.65;
          border-left: 3px solid transparent;
          white-space: pre;
        }

        .bh-line.is-clickable { cursor: pointer; }
        .bh-line.is-clickable:hover { background: var(--bh-panel); }

        .bh-line.is-found {
          background: var(--bh-success-bg);
          border-left-color: var(--bh-success);
        }

        .bh-line.is-flash {
          background: var(--bh-danger-bg);
          border-left-color: var(--bh-danger);
        }

        .bh-line.is-missed {
          background: var(--bh-danger-bg);
          border-left-color: var(--bh-danger);
        }

        .bh-line.is-hint {
          background: var(--bh-warning-bg);
          border-left-color: var(--bh-warning);
        }

        .bh-line-num {
          flex: none;
          width: 28px;
          text-align: right;
          color: var(--bh-line-num);
          user-select: none;
        }

        .bh-line-text { flex: 1; color: var(--bh-text); }

        .bh-line-hint {
          flex: none;
          max-width: 280px;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          color: var(--bh-text-muted);
          font-style: italic;
        }

        .tok-kw { color: var(--bh-tok-kw); font-weight: 600; }
        .tok-str { color: var(--bh-tok-str); }
        .tok-com { color: var(--bh-tok-com); font-style: italic; }
        .tok-num { color: var(--bh-tok-num); }

        .bh-footer {
          max-width: 1040px;
          margin: 20px auto 0;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--bh-text-muted);
        }

        button { font: inherit; }

        @media (max-width: 640px) {
          .bh-root { padding: 20px 12px 32px; }
          .bh-controls { flex-direction: column; align-items: stretch; }
          .bh-diffgroup { width: 100%; }
          .bh-diffbtn { flex: 1; }
          .bh-cta, .bh-ghost { width: 100%; }
          .bh-line-hint { display: none; }
          .bh-line { font-size: 12px; }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value, suffix = '' }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="bh-stat">
      <b>
        {value}
        {suffix}
      </b>
      <span>{label}</span>
    </div>
  );
}