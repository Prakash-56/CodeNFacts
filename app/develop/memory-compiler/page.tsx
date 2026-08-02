'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

/* ============================================================================
   MEMORY COMPILER
   A flash-recall trainer: N tokens are "compiled" on screen for 6 seconds,
   then flushed. You reconstruct the exact order they appeared in to "build"
   successfully. Difficulty (token count) rises and falls with your streak.
   ========================================================================== */

/* ---------------------------------- Data --------------------------------- */

const KEYWORDS = [
  // C (32)
  'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
  'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'int',
  'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
  'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while',
  // C++ additions (20)
  'class', 'public', 'private', 'protected', 'virtual', 'friend', 'template',
  'namespace', 'new', 'delete', 'try', 'catch', 'throw', 'this', 'operator',
  'nullptr', 'constexpr', 'override', 'final', 'mutable',
  // Python additions (20)
  'def', 'elif', 'import', 'lambda', 'yield', 'pass', 'global', 'nonlocal',
  'assert', 'raise', 'with', 'None', 'True', 'False', 'is', 'in', 'and',
  'or', 'not', 'del',
];

const PYTHON_MODULES = [
  'os', 'sys', 'math', 'random', 'datetime', 'time', 'json', 're',
  'collections', 'itertools', 'functools', 'typing', 'pathlib', 'subprocess',
  'threading', 'multiprocessing', 'socket', 'http', 'urllib', 'sqlite3',
  'csv', 'logging', 'unittest', 'argparse', 'shutil', 'glob', 'pickle',
  'hashlib', 'hmac', 'base64', 'struct', 'array', 'heapq', 'bisect', 'copy',
  'string', 'textwrap', 'decimal', 'fractions', 'statistics', 'enum',
  'dataclasses', 'contextlib', 'asyncio', 'queue', 'io', 'tempfile',
  'warnings', 'traceback', 'inspect', 'platform', 'uuid', 'zipfile',
  'tarfile', 'configparser',
];

const JAVA_METHODS = [
  'length()', 'charAt()', 'substring()', 'indexOf()', 'lastIndexOf()',
  'toUpperCase()', 'toLowerCase()', 'trim()', 'strip()', 'replace()',
  'replaceAll()', 'split()', 'equals()', 'equalsIgnoreCase()', 'compareTo()',
  'contains()', 'startsWith()', 'endsWith()', 'valueOf()', 'toString()',
  'hashCode()', 'add()', 'remove()', 'get()', 'set()', 'size()', 'isEmpty()',
  'clear()', 'sort()', 'reverse()', 'shuffle()', 'min()', 'max()', 'abs()',
  'pow()', 'sqrt()', 'round()', 'ceil()', 'floor()', 'random()', 'parseInt()',
  'parseDouble()', 'format()', 'println()', 'printf()', 'iterator()',
  'hasNext()', 'next()', 'put()', 'containsKey()', 'containsValue()',
  'keySet()', 'values()', 'entrySet()', 'getOrDefault()',
];

const LINUX_COMMANDS = [
  'ls', 'cd', 'pwd', 'mkdir', 'rmdir', 'rm', 'cp', 'mv', 'touch', 'cat',
  'less', 'more', 'head', 'tail', 'grep', 'find', 'locate', 'chmod', 'chown',
  'chgrp', 'ps', 'top', 'htop', 'kill', 'killall', 'df', 'du', 'mount',
  'umount', 'tar', 'gzip', 'gunzip', 'zip', 'unzip', 'ssh', 'scp', 'rsync',
  'curl', 'wget', 'ping', 'ifconfig', 'ip', 'netstat', 'traceroute',
  'whoami', 'uname', 'uptime', 'history', 'alias', 'export', 'echo', 'sudo',
  'su', 'man', 'which', 'whereis', 'awk', 'sed', 'sort',
];

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'JOIN',
  'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'ON', 'AS',
  'DISTINCT', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'PRIMARY KEY',
  'FOREIGN KEY', 'NOT NULL', 'UNIQUE', 'DEFAULT', 'CHECK', 'INDEX', 'UNION',
  'UNION ALL', 'EXISTS', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL',
  'AND', 'OR', 'NOT', 'CASE WHEN', 'THEN', 'ELSE', 'END', 'COMMIT', 'ROLLBACK',
];

const DSA_TERMS = [
  'Array', 'Linked List', 'Stack', 'Queue', 'Deque', 'Hash Table', 'Hash Set',
  'Binary Tree', 'Binary Search Tree', 'AVL Tree', 'Red-Black Tree', 'Heap',
  'Min Heap', 'Max Heap', 'Trie', 'Graph', 'Adjacency List',
  'Adjacency Matrix', 'Disjoint Set', 'Segment Tree', 'Fenwick Tree',
  'B-Tree', 'Bloom Filter', 'Skip List', 'Priority Queue', 'Circular Buffer',
  'Sliding Window', 'Two Pointers', 'Binary Search', 'Linear Search',
  'Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort',
  'Quick Sort', 'Heap Sort', 'Counting Sort', 'Radix Sort', 'Bucket Sort',
  'Depth-First Search', 'Breadth-First Search', "Dijkstra's Algorithm",
  'Bellman-Ford', 'Floyd-Warshall', "Kruskal's Algorithm", "Prim's Algorithm",
  'Topological Sort', 'Dynamic Programming', 'Greedy Algorithm',
  'Backtracking', 'Divide and Conquer', 'Memoization', 'Recursion',
  'Big O Notation', 'O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)',
];

const AI_ML_TERMS = [
  'Linear Regression', 'Logistic Regression', 'Decision Tree',
  'Random Forest', 'Gradient Boosting', 'XGBoost', 'Support Vector Machine',
  'K-Nearest Neighbors', 'Naive Bayes', 'K-Means Clustering', 'DBSCAN',
  'Principal Component Analysis', 'Neural Network', 'Perceptron',
  'Convolutional Neural Network', 'Recurrent Neural Network', 'LSTM', 'GRU',
  'Transformer', 'Attention Mechanism', 'Self-Attention', 'Encoder',
  'Decoder', 'Backpropagation', 'Gradient Descent',
  'Stochastic Gradient Descent', 'Adam Optimizer', 'Learning Rate', 'Epoch',
  'Batch Size', 'Overfitting', 'Underfitting', 'Regularization', 'Dropout',
  'Batch Normalization', 'Activation Function', 'ReLU', 'Sigmoid', 'Softmax',
  'Loss Function', 'Cross-Entropy Loss', 'Mean Squared Error',
  'Confusion Matrix', 'Precision', 'Recall', 'F1 Score', 'ROC Curve',
  'Bias-Variance Tradeoff', 'Feature Engineering', 'One-Hot Encoding',
  'Embedding', 'Tokenization', 'Reinforcement Learning', 'Q-Learning',
  'Markov Decision Process', 'Generative Adversarial Network', 'Autoencoder',
  'Transfer Learning', 'Fine-Tuning',
];

const GIT_COMMANDS = [
  'git init', 'git clone', 'git add', 'git commit', 'git status', 'git diff',
  'git log', 'git branch', 'git checkout', 'git switch', 'git merge',
  'git rebase', 'git pull', 'git push', 'git fetch', 'git remote',
  'git stash', 'git reset', 'git revert', 'git tag', 'git blame',
  'git cherry-pick', 'git show', 'git config', 'git rm', 'git mv',
  'git clean', 'git bisect', 'git reflog', 'git submodule', 'git worktree',
  'git archive', 'git shortlog', 'git describe', 'git gc', 'git fsck',
];

const OOP_DESIGN = [
  'Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism',
  'Constructor', 'Destructor', 'Interface', 'Abstract Class',
  'Method Overloading', 'Method Overriding', 'Static Binding',
  'Dynamic Binding', 'Singleton Pattern', 'Factory Pattern',
  'Abstract Factory Pattern', 'Builder Pattern', 'Prototype Pattern',
  'Adapter Pattern', 'Decorator Pattern', 'Facade Pattern', 'Proxy Pattern',
  'Composite Pattern', 'Observer Pattern', 'Strategy Pattern',
  'Command Pattern', 'Iterator Pattern', 'Template Method Pattern',
  'State Pattern', 'Chain of Responsibility', 'Mediator Pattern',
  'Memento Pattern', 'Visitor Pattern', 'Flyweight Pattern', 'Bridge Pattern',
  'SOLID Principles', 'Single Responsibility Principle',
  'Open-Closed Principle', 'Liskov Substitution Principle',
  'Interface Segregation Principle', 'Dependency Inversion Principle',
];

type Deck = {
  id: string;
  label: string;
  hint: string;
  accent: string;
  items: string[];
};

const TOPIC_DECKS: Deck[] = [
  { id: 'keywords', label: 'Language Keywords', hint: 'C · C++ · Python', accent: '#FF8A5B', items: KEYWORDS },
  { id: 'python', label: 'Python Modules', hint: 'standard library', accent: '#4FD1C5', items: PYTHON_MODULES },
  { id: 'java', label: 'Java Methods', hint: 'String · List · Math', accent: '#F6C177', items: JAVA_METHODS },
  { id: 'linux', label: 'Linux Commands', hint: 'shell & sysadmin', accent: '#9ECE6A', items: LINUX_COMMANDS },
  { id: 'sql', label: 'SQL Clauses', hint: 'queries & DDL', accent: '#7AA2F7', items: SQL_KEYWORDS },
  { id: 'dsa', label: 'DSA Concepts', hint: 'structures & algorithms', accent: '#BB9AF7', items: DSA_TERMS },
  { id: 'aiml', label: 'AI / ML', hint: 'models & training', accent: '#F7768E', items: AI_ML_TERMS },
  { id: 'git', label: 'Git Commands', hint: 'version control', accent: '#FF9E64', items: GIT_COMMANDS },
  { id: 'oop', label: 'OOP & Patterns', hint: 'design principles', accent: '#C0CAF5', items: OOP_DESIGN },
];

const MIXED_DECK: Deck = {
  id: 'mixed',
  label: 'Mixed Compile',
  hint: 'every topic, one stream',
  accent: '#FFB454',
  items: TOPIC_DECKS.flatMap((d) => d.items),
};

const ALL_DECKS: Deck[] = [MIXED_DECK, ...TOPIC_DECKS];

const TOTAL_ITEMS = TOPIC_DECKS.reduce((sum, d) => sum + d.items.length, 0);

const REVEAL_SECONDS = 6;
const MIN_LEVEL = 1;
const MAX_LEVEL = 10;

/** Level 1 -> 3 tokens ... Level 10 -> 12 tokens, capped by deck size. */
function tokensForLevel(level: number, deckSize: number) {
  return Math.max(3, Math.min(level + 2, 12, deckSize));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

type Phase = 'idle' | 'showing' | 'input' | 'result';

type Stats = {
  bestStreak: number;
  totalBuilds: number;
  totalSuccess: number;
};

const STATS_KEY = 'memory-compiler-stats-v1';

function loadStats(): Stats {
  if (typeof window === 'undefined') return { bestStreak: 0, totalBuilds: 0, totalSuccess: 0 };
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (!raw) return { bestStreak: 0, totalBuilds: 0, totalSuccess: 0 };
    const parsed = JSON.parse(raw);
    return {
      bestStreak: parsed.bestStreak ?? 0,
      totalBuilds: parsed.totalBuilds ?? 0,
      totalSuccess: parsed.totalSuccess ?? 0,
    };
  } catch {
    return { bestStreak: 0, totalBuilds: 0, totalSuccess: 0 };
  }
}

/* --------------------------------- Page ---------------------------------- */

export default function MemoryCompilerPage() {
  const [deck, setDeck] = useState<Deck>(MIXED_DECK);
  const [level, setLevel] = useState(MIN_LEVEL);
  const [phase, setPhase] = useState<Phase>('idle');
  const [sequence, setSequence] = useState<string[]>([]);
  const [pool, setPool] = useState<string[]>([]);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [progress, setProgress] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState<Stats>({ bestStreak: 0, totalBuilds: 0, totalSuccess: 0 });

  const revealEndsAt = useRef<number>(0);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const persistStats = useCallback((next: Stats) => {
    setStats(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STATS_KEY, JSON.stringify(next));
    }
  }, []);

  const tokenCount = tokensForLevel(level, deck.items.length);

  const startRound = useCallback(
    (nextDeck?: Deck) => {
      const activeDeck = nextDeck ?? deck;
      const n = tokensForLevel(level, activeDeck.items.length);
      const seq = sample(activeDeck.items, n);
      setDeck(activeDeck);
      setSequence(seq);
      setUserOrder([]);
      setPool([]);
      setProgress(1);
      setPhase('showing');
      revealEndsAt.current = Date.now() + REVEAL_SECONDS * 1000;
    },
    [deck, level]
  );

  // Countdown ticker for the "showing" phase.
  useEffect(() => {
    if (phase !== 'showing') {
      if (tickRef.current) window.clearInterval(tickRef.current);
      return;
    }
    tickRef.current = window.setInterval(() => {
      const remain = revealEndsAt.current - Date.now();
      if (remain <= 0) {
        if (tickRef.current) window.clearInterval(tickRef.current);
        setPool(shuffle(sequence));
        setPhase('input');
        setProgress(0);
      } else {
        setProgress(remain / (REVEAL_SECONDS * 1000));
      }
    }, 40);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [phase, sequence]);

  const pickToken = (value: string, index: number) => {
    if (phase !== 'input') return;
    setPool((p) => p.filter((_, i) => i !== index));
    setUserOrder((u) => [...u, value]);
  };

  const undoLast = () => {
    if (phase !== 'input' || userOrder.length === 0) return;
    const last = userOrder[userOrder.length - 1];
    setUserOrder((u) => u.slice(0, -1));
    setPool((p) => [...p, last]);
  };

  const submit = () => {
    if (phase !== 'input' || userOrder.length !== sequence.length) return;
    const correctFlags = sequence.map((v, i) => v === userOrder[i]);
    const allCorrect = correctFlags.every(Boolean);
    const correctCount = correctFlags.filter(Boolean).length;

    setScore((s) => s + correctCount * 10 + (allCorrect ? level * 20 : 0));

    const nextStreak = allCorrect ? streak + 1 : 0;
    setStreak(nextStreak);
    setLevel((l) => (allCorrect ? Math.min(MAX_LEVEL, l + 1) : Math.max(MIN_LEVEL, l - 1)));

    persistStats({
      bestStreak: Math.max(stats.bestStreak, nextStreak),
      totalBuilds: stats.totalBuilds + 1,
      totalSuccess: stats.totalSuccess + (allCorrect ? 1 : 0),
    });

    setPhase('result');
  };

  const changeDeck = (next: Deck) => {
    setDeck(next);
    setLevel(MIN_LEVEL);
    setPhase('idle');
    setSequence([]);
    setPool([]);
    setUserOrder([]);
  };

  const correctFlags = useMemo(
    () => (phase === 'result' ? sequence.map((v, i) => v === userOrder[i]) : []),
    [phase, sequence, userOrder]
  );
  const successCount = correctFlags.filter(Boolean).length;
  const allCorrect = phase === 'result' && successCount === sequence.length;

  return (
    <div className="mc-root">
      <header className="mc-header">
        <div className="mc-wordmark">
          MEMORY_COMPILER<span className="mc-cursor" aria-hidden="true" />
        </div>
        <p className="mc-tagline">
          Flash-compile {TOTAL_ITEMS}+ real tokens across nine topics. Watch the stream,
          then rebuild the exact order before the build fails.
        </p>
        <div className="mc-topstats">
          <Stat label="score" value={score} />
          <Stat label="streak" value={streak} suffix={streak > 0 ? ' 🔥' : ''} />
          <Stat label="best streak" value={stats.bestStreak} />
          <Stat label="builds" value={`${stats.totalSuccess}/${stats.totalBuilds}`} />
        </div>
      </header>

      <main className="mc-layout">
        <aside className="mc-sidebar" aria-label="Topic decks">
          <div className="mc-sidebar-title">import decks</div>
          <ul className="mc-decklist">
            {ALL_DECKS.map((d) => (
              <li key={d.id}>
                <button
                  className={`mc-deckbtn${deck.id === d.id ? ' is-active' : ''}`}
                  style={{ ['--accent' as any]: d.accent }}
                  onClick={() => changeDeck(d)}
                >
                  <span className="mc-dot" />
                  <span className="mc-deckname">{d.label}</span>
                  <span className="mc-deckhint">{d.hint}</span>
                  <span className="mc-deckcount">{d.items.length}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="mc-stage-wrap" style={{ ['--accent' as any]: deck.accent }}>
          <div className="mc-stage-meta">
            <span className="mc-badge">deck: {deck.label}</span>
            <span className="mc-badge">build lvl {String(level).padStart(2, '0')}</span>
            <span className="mc-badge">{tokenCount} tokens</span>
          </div>

          <div className="mc-stage">
            {phase === 'idle' && (
              <div className="mc-idle">
                <p className="mc-idle-text">
                  Ready to compile <strong>{tokenCount}</strong> tokens from{' '}
                  <strong>{deck.label}</strong>. They flash for {REVEAL_SECONDS}s, then vanish.
                </p>
                <button className="mc-cta" onClick={() => startRound()}>
                  ▶ compile tokens
                </button>
              </div>
            )}

            {phase === 'showing' && (
              <div className="mc-showing">
                <div className="mc-tokenrow">
                  {sequence.map((t, i) => (
                    <span className="mc-token is-live" key={`${t}-${i}`}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mc-progress">
                  <div className="mc-progress-fill" style={{ width: `${progress * 100}%` }} />
                </div>
                <p className="mc-progress-label">memorizing the order…</p>
              </div>
            )}

            {phase === 'input' && (
              <div className="mc-input">
                <p className="mc-section-label">reconstruct the token order</p>
                <div className="mc-slots">
                  {sequence.map((_, i) => (
                    <div className="mc-slot" key={i}>
                      <span className="mc-slot-index">{i + 1}</span>
                      <span className="mc-slot-value">{userOrder[i] ?? '·'}</span>
                    </div>
                  ))}
                </div>
                <p className="mc-section-label">available tokens</p>
                <div className="mc-pool">
                  {pool.map((t, i) => (
                    <button className="mc-token is-clickable" key={`${t}-${i}`} onClick={() => pickToken(t, i)}>
                      {t}
                    </button>
                  ))}
                  {pool.length === 0 && <span className="mc-pool-empty">all tokens placed</span>}
                </div>
                <div className="mc-actions">
                  <button className="mc-ghost" onClick={undoLast} disabled={userOrder.length === 0}>
                    ↺ undo
                  </button>
                  <button className="mc-cta" onClick={submit} disabled={userOrder.length !== sequence.length}>
                    compile ▶
                  </button>
                </div>
              </div>
            )}

            {phase === 'result' && (
              <div className="mc-result">
                <p className={`mc-result-headline ${allCorrect ? 'is-success' : 'is-fail'}`}>
                  {allCorrect
                    ? `BUILD SUCCESSFUL — ${successCount}/${sequence.length} in order`
                    : `BUILD FAILED — ${successCount}/${sequence.length} correct`}
                </p>
                <div className="mc-slots">
                  {sequence.map((v, i) => (
                    <div className={`mc-slot ${correctFlags[i] ? 'is-correct' : 'is-wrong'}`} key={i}>
                      <span className="mc-slot-index">{i + 1}</span>
                      <span className="mc-slot-value">{userOrder[i] ?? '·'}</span>
                      {!correctFlags[i] && <span className="mc-slot-answer">was: {v}</span>}
                    </div>
                  ))}
                </div>
                <div className="mc-actions">
                  <button className="mc-cta" onClick={() => startRound()}>
                    next round →
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="mc-footer">
        <span>{TOTAL_ITEMS}+ tokens across {TOPIC_DECKS.length} topic decks</span>
        <span>build level adapts: {MIN_LEVEL} → {MAX_LEVEL} (3 → 12 tokens)</span>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap');

        /* Light mode (default): clean white background */
        :root {
          --bg: #ffffff;
          --panel: #f7f8fa;
          --panel-2: #eef0f4;
          --border: #e0e3e9;
          --text: #12151c;
          --text-muted: #626b7a;
          --primary: #059669;
          --success: #2f8f4e;
          --danger: #c73a58;
          --scanline: rgba(0, 0, 0, 0.012);
          --glow: rgba(5, 150, 105, 0.07);
        }

        /* Dark mode: follows the CodeNFacts terminal palette */
        .dark .mc-root {
          --bg: #0a0e14;
          --panel: #0d1117;
          --panel-2: #161b22;
          --border: #232a37;
          --text: #e6e9ef;
          --text-muted: #8b93a7;
          --primary: #34d399;
          --success: #3ddc84;
          --danger: #f87171;
          --scanline: rgba(255, 255, 255, 0.02);
          --glow: rgba(52, 211, 153, 0.09);
        }

        .mc-root {
          min-height: 100vh;
          background:
            radial-gradient(circle at 20% -10%, var(--glow), transparent 45%),
            repeating-linear-gradient(180deg, var(--scanline) 0px, var(--scanline) 1px, transparent 1px, transparent 3px),
            var(--bg);
          color: var(--text);
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          padding: 32px 20px 48px;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .mc-header {
          max-width: 980px;
          margin: 0 auto 28px;
        }

        .mc-wordmark {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-weight: 700;
          font-size: clamp(22px, 4vw, 32px);
          letter-spacing: 0.02em;
          color: var(--primary);
        }

        .mc-cursor {
          display: inline-block;
          width: 0.55em;
          height: 1em;
          margin-left: 4px;
          background: var(--primary);
          vertical-align: -0.15em;
          animation: mc-blink 1s steps(1) infinite;
        }

        @keyframes mc-blink {
          50% { opacity: 0; }
        }

        .mc-tagline {
          margin-top: 8px;
          max-width: 640px;
          color: var(--text-muted);
          font-size: 14.5px;
          line-height: 1.55;
        }

        .mc-topstats {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .mc-stat {
          border: 1px solid var(--border);
          background: var(--panel);
          border-radius: 8px;
          padding: 8px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
        }

        .mc-stat b {
          color: var(--text);
          font-size: 14px;
          margin-right: 6px;
        }

        .mc-stat span {
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .mc-layout {
          max-width: 980px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 18px;
        }

        @media (max-width: 760px) {
          .mc-layout { grid-template-columns: 1fr; }
        }

        .mc-sidebar {
          border: 1px solid var(--border);
          background: var(--panel);
          border-radius: 12px;
          padding: 14px;
          align-self: start;
        }

        .mc-sidebar-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
        }

        .mc-decklist {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mc-deckbtn {
          width: 100%;
          display: grid;
          grid-template-columns: 10px 1fr auto;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 8px;
          padding: 8px 10px;
          cursor: pointer;
          text-align: left;
          color: var(--text);
          font-family: 'JetBrains Mono', monospace;
        }

        .mc-deckbtn:hover { background: var(--panel-2); }

        .mc-deckbtn.is-active {
          border-color: var(--accent);
          background: var(--panel-2);
        }

        .mc-deckbtn:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        .mc-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          grid-row: span 2;
        }

        .mc-deckname { font-size: 13px; }

        .mc-deckhint {
          grid-column: 2;
          font-size: 10.5px;
          color: var(--text-muted);
        }

        .mc-deckcount {
          grid-row: span 2;
          font-size: 11px;
          color: var(--text-muted);
        }

        .mc-stage-wrap {
          border: 1px solid var(--border);
          background: var(--panel);
          border-radius: 12px;
          padding: 16px;
          min-height: 380px;
          display: flex;
          flex-direction: column;
        }

        .mc-stage-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .mc-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 4px 10px;
          background: var(--panel-2);
        }

        .mc-stage {
          flex: 1;
          border: 1px dashed var(--border);
          border-radius: 10px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
        }

        .mc-idle { text-align: center; }

        .mc-idle-text {
          color: var(--text-muted);
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 18px;
        }

        .mc-idle-text strong { color: var(--text); }

        .mc-cta {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 13.5px;
          color: #04140f;
          background: var(--accent, var(--primary));
          border: none;
          border-radius: 8px;
          padding: 11px 22px;
          cursor: pointer;
        }

        .mc-cta:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .mc-ghost {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: var(--text);
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 18px;
          cursor: pointer;
        }

        .mc-ghost:disabled { opacity: 0.3; cursor: not-allowed; }

        .mc-tokenrow {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .mc-token {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13.5px;
          padding: 9px 14px;
          border-radius: 7px;
          border: 1px solid var(--accent, var(--primary));
          background: color-mix(in srgb, var(--accent, var(--primary)) 8%, transparent);
          color: var(--text);
        }

        .mc-token.is-live {
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03) inset, 0 0 16px -6px var(--accent, var(--primary));
        }

        .mc-token.is-clickable {
          cursor: pointer;
          transition: transform 0.12s ease, background 0.12s ease;
        }

        .mc-token.is-clickable:hover {
          background: color-mix(in srgb, var(--accent, var(--primary)) 18%, transparent);
          transform: translateY(-1px);
        }

        .mc-progress {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: var(--panel-2);
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .mc-progress-fill {
          height: 100%;
          background: var(--accent, var(--primary));
          transition: width 0.04s linear;
        }

        .mc-progress-label {
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .mc-section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 4px 0;
        }

        .mc-slots {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .mc-slot {
          position: relative;
          min-width: 84px;
          min-height: 52px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--panel-2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6px 10px;
          font-family: 'JetBrains Mono', monospace;
        }

        .mc-slot-index {
          font-size: 9.5px;
          color: var(--text-muted);
          position: absolute;
          top: 4px;
          left: 6px;
        }

        .mc-slot-value {
          font-size: 12.5px;
          margin-top: 6px;
        }

        .mc-slot-answer {
          font-size: 9px;
          color: var(--danger);
          margin-top: 2px;
        }

        .mc-slot.is-correct { border-color: var(--success); }
        .mc-slot.is-wrong { border-color: var(--danger); }

        .mc-pool {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          min-height: 40px;
        }

        .mc-pool-empty {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--text-muted);
        }

        .mc-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 6px;
        }

        .mc-result-headline {
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.03em;
        }

        .mc-result-headline.is-success { color: var(--success); }
        .mc-result-headline.is-fail { color: var(--danger); }

        .mc-footer {
          max-width: 980px;
          margin: 28px auto 0;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text-muted);
        }

        button {
          font: inherit;
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value, suffix = '' }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="mc-stat">
      <b>{value}{suffix}</b>
      <span>{label}</span>
    </div>
  );
}