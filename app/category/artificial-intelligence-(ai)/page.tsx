"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Sparkles,
  Terminal,
  Hash,
  ArrowRight,
  ArrowUpRight,
  ListTree,
  Check,
  Copy,
  Download,
  CheckCircle2,
} from "lucide-react";

/**
 * app/category/artificial-intelligence-(ai)/page.tsx
 * -----------------------------------------------------
 * The Artificial Intelligence learning hub for CodeNFacts. Mirrors
 * app/category/python/page.tsx and app/category/java/page.tsx structurally
 * (sticky scroll-spy TOC + one section per topic with a summary, key
 * points, and a highlighted code example) but covers AI/ML concepts
 * rather than a single programming language.
 *
 * Every example below is small, dependency-free Python (standard library
 * only — math, statistics, collections) chosen to make the underlying
 * mechanism visible (a single neuron, a manual convolution, a toy
 * attention score) rather than to demonstrate a production ML library.
 * All outputs shown were run and confirmed, not estimated.
 *
 * NOTE: The code block is intentionally rendered with a fixed dark
 * "terminal" theme (bg-slate-900) in BOTH light and dark site modes —
 * this matches how most code viewers look and gives consistent syntax
 * highlighting. All colors below are chosen/forced (via inline style
 * fallbacks) to stay readable against that dark background regardless
 * of the site's light/dark mode, since text-* utility classes can get
 * overridden by parent theme classes depending on stylesheet ordering.
 */

// ---------------------------------------------------------------------------
// Topic data
// ---------------------------------------------------------------------------

interface AiTopic {
  id: string;
  number: string;
  title: string;
  summary: string;
  points: string[];
  code: string;
  output?: string;
}

const topics: AiTopic[] = [
  {
    id: "what-is-ai",
    number: "01",
    title: "What Is Artificial Intelligence?",
    summary:
      "AI is the broad goal of building systems that perform tasks normally requiring human intelligence — recognizing images, understanding language, making decisions. The earliest AI was purely rule-based: a person hand-writes the logic. Machine learning changed that by having the system derive its own rules from data instead.",
    points: [
      "Narrow AI does one task well (spam filtering, chess); general AI would match human flexibility across any task.",
      "Rule-based systems are still 'AI' in the classic sense — they just don't learn.",
      "Subfields include machine learning, computer vision, natural language processing, and robotics.",
    ],
    code: `# A simple rule-based "AI": hardcoded logic, not learned from data
def is_spam(email_text):
    spam_words = ["free", "winner", "click here", "urgent"]
    return any(word in email_text.lower() for word in spam_words)

print(is_spam("You are a WINNER! Click here now"))
print(is_spam("Let's meet for lunch tomorrow"))`,
    output: `True
False`,
  },
  {
    id: "ai-ml-dl",
    number: "02",
    title: "AI vs. Machine Learning vs. Deep Learning",
    summary:
      "These three nest inside each other: AI is the overall goal, machine learning is one approach to it — learning patterns from data instead of hand-coding rules — and deep learning is a subset of ML that uses multi-layer neural networks, which is what makes it so effective on raw, unstructured data like images and text.",
    points: [
      "Not all AI is ML — a rule-based expert system is AI but isn't learning anything.",
      "Not all ML is deep learning — linear regression and decision trees are ML without neural networks.",
      "The 'learning' in machine learning literally means adjusting numbers (weights) based on data.",
    ],
    code: `# A tiny 'machine learning' example: learn y = w*x + b from data
# instead of hardcoding it, using simple gradient descent.
data = [(1, 3), (2, 5), (3, 7), (4, 9)]  # true relationship: y = 2x + 1

w, b = 0.0, 0.0
learning_rate = 0.01

for epoch in range(1000):
    for x, y in data:
        pred = w * x + b
        error = pred - y
        w -= learning_rate * error * x
        b -= learning_rate * error

print(round(w, 2), round(b, 2))`,
    output: `2.0 1.0`,
  },
  {
    id: "types-of-ml",
    number: "03",
    title: "Types of Machine Learning",
    summary:
      "Supervised learning trains on labeled examples (input paired with the correct answer) to predict labels for new data. Unsupervised learning finds structure in unlabeled data, like grouping similar items together. Reinforcement learning trains an agent to make decisions by rewarding good outcomes and penalizing bad ones over many trials.",
    points: [
      "Supervised: classification (categories) and regression (numbers) are the two main tasks.",
      "Unsupervised: clustering and dimensionality reduction are the most common uses.",
      "Reinforcement learning is how game-playing agents and robotics controllers are typically trained.",
    ],
    code: `# Supervised learning: predict a label from labeled examples
labeled_data = [(2, "small"), (3, "small"), (8, "large"), (9, "large")]

def classify(value, data):
    # a tiny nearest-neighbor classifier
    closest = min(data, key=lambda item: abs(item[0] - value))
    return closest[1]

print(classify(2.5, labeled_data))
print(classify(8.5, labeled_data))`,
    output: `small
large`,
  },
  {
    id: "neural-networks",
    number: "04",
    title: "Neural Network Basics",
    summary:
      "A neural network is layers of neurons, each combining its inputs with learned weights, adding a bias, and passing the result through an activation function. A single neuron on its own is simple — it's stacking many of them across layers, and learning their weights from data, that lets a network approximate complex functions.",
    points: [
      "Every connection between neurons has a weight, learned during training.",
      "The bias shifts the neuron's output independent of its inputs.",
      "Forward pass = computing an output; backward pass (backpropagation) = updating weights based on error.",
    ],
    code: `import math

def sigmoid(x):
    return 1 / (1 + math.exp(-x))

def neuron(inputs, weights, bias):
    total = sum(i * w for i, w in zip(inputs, weights)) + bias
    return sigmoid(total)

inputs = [1.0, 0.5, -1.5]
weights = [0.4, 0.3, 0.2]
bias = 0.1

print(round(neuron(inputs, weights, bias), 4))`,
    output: `0.5866`,
  },
  {
    id: "activation-functions",
    number: "05",
    title: "Activation Functions",
    summary:
      "An activation function decides how much signal a neuron passes forward, and — critically — introduces non-linearity. Without one, stacking layers would mathematically collapse into a single linear function, no matter how many layers you added, so activations are what let networks learn curved, complex relationships at all.",
    points: [
      "Sigmoid squashes any input into (0, 1) — useful for probabilities, but prone to vanishing gradients.",
      "ReLU (max(0, x)) is the default for hidden layers in most modern networks — simple and fast.",
      "Tanh squashes into (-1, 1), centered at zero, which sometimes helps training stability.",
    ],
    code: `import math

def sigmoid(x): return 1 / (1 + math.exp(-x))
def relu(x): return max(0, x)

for x in [-2, 0, 2]:
    print(x, round(sigmoid(x), 3), relu(x), round(math.tanh(x), 3))`,
    output: `-2 0.119 0 -0.964
0 0.5 0 0.0
2 0.881 2 0.964`,
  },
  {
    id: "loss-gradient-descent",
    number: "06",
    title: "Loss Functions & Gradient Descent",
    summary:
      "A loss function measures how wrong a model's predictions are — smaller is better. Gradient descent is the algorithm that nudges every weight in the direction that reduces that loss, a tiny step at a time, repeated over many iterations until the model converges on good parameters.",
    points: [
      "Mean squared error (MSE) is the standard loss for regression — it penalizes big errors more than small ones.",
      "The learning rate controls how big each nudge is — too high overshoots, too low trains painfully slowly.",
      "'Training a model' is really just 'running gradient descent to minimize a loss function'.",
    ],
    code: `def mse_loss(predictions, targets):
    return sum((p - t) ** 2 for p, t in zip(predictions, targets)) / len(targets)

predictions = [2.5, 0.0, 2.1, 7.8]
targets     = [3.0, -0.5, 2.0, 7.5]

print(round(mse_loss(predictions, targets), 4))`,
    output: `0.15`,
  },
  {
    id: "train-val-test",
    number: "07",
    title: "Train, Validation & Test Sets",
    summary:
      "A model only proves it generalizes if it's evaluated on data it never saw during training. The training set teaches the model, the validation set tunes decisions like hyperparameters along the way, and the test set gives one final, honest measurement of performance — touched only once, at the very end.",
    points: [
      "A common split is roughly 60/20/20 or 80/10/10, depending on how much data you have.",
      "Never let test data leak into training — that inflates your accuracy and hides real problems.",
      "Cross-validation rotates which slice is 'validation' to get a more reliable estimate on small datasets.",
    ],
    code: `data = list(range(1, 11))  # pretend this is 10 labeled examples

train = data[:6]   # 60% for training
val = data[6:8]    # 20% for validation
test = data[8:]    # 20% for final testing

print("train:", train)
print("val:  ", val)
print("test: ", test)`,
    output: `train: [1, 2, 3, 4, 5, 6]
val:   [7, 8]
test:  [9, 10]`,
  },
  {
    id: "overfitting-regularization",
    number: "08",
    title: "Overfitting & Regularization",
    summary:
      "Overfitting is when a model memorizes the noise and quirks of its training data instead of the underlying pattern — it looks brilliant on training data and falls apart on anything new. Regularization techniques (like L2 penalties or dropout) deliberately constrain the model so it's forced to learn general patterns instead.",
    points: [
      "A big gap between training accuracy and test accuracy is the classic overfitting symptom.",
      "More training data, simpler models, and regularization are the three main fixes.",
      "Dropout randomly disables neurons during training, forcing the network not to rely on any single one.",
    ],
    code: `train_accuracy = {"simple_model": 0.85, "overfit_model": 0.99}
test_accuracy  = {"simple_model": 0.83, "overfit_model": 0.61}

for model in train_accuracy:
    gap = train_accuracy[model] - test_accuracy[model]
    print(f"{model}: train={train_accuracy[model]}, test={test_accuracy[model]}, gap={round(gap, 2)}")`,
    output: `simple_model: train=0.85, test=0.83, gap=0.02
overfit_model: train=0.99, test=0.61, gap=0.38`,
  },
  {
    id: "cnns",
    number: "09",
    title: "Convolutional Neural Networks (CNNs)",
    summary:
      "A CNN slides a small learned filter (a kernel) across an image, computing a weighted sum at each position to detect local patterns like edges, textures, or shapes. Stacking convolutional layers lets early layers detect simple features and later layers combine them into increasingly abstract ones — edges become shapes become objects.",
    points: [
      "The same kernel is reused across the whole image — this weight-sharing is what makes CNNs efficient.",
      "Pooling layers shrink the image between convolutions, keeping the strongest signals.",
      "CNNs dominate computer vision because they exploit an image's spatial structure directly.",
    ],
    code: `image = [
    [10, 10, 10, 0, 0],
    [10, 10, 10, 0, 0],
    [10, 10, 10, 0, 0],
]
kernel = [[1, 0, -1]]  # a simple horizontal edge detector

def convolve_row(row, kernel):
    k = kernel[0]
    return [sum(row[i + j] * k[j] for j in range(len(k)))
            for i in range(len(row) - len(k) + 1)]

for row in image:
    print(convolve_row(row, kernel))`,
    output: `[0, 10, 10]
[0, 10, 10]
[0, 10, 10]`,
  },
  {
    id: "rnns-sequences",
    number: "10",
    title: "RNNs & Sequence Models",
    summary:
      "A recurrent neural network processes a sequence one element at a time while carrying a 'hidden state' forward — a running memory of everything it's seen so far. That memory is what lets RNNs handle inputs where order matters, like text or time-series data, unlike a plain feedforward network that has no concept of 'before' and 'after'.",
    points: [
      "The same weights are reused at every step of the sequence.",
      "Plain RNNs struggle to remember far-back information — LSTMs and GRUs were designed to fix that.",
      "Transformers (next topic) have mostly replaced RNNs for large-scale sequence modeling.",
    ],
    code: `def simple_rnn_step(x, hidden, w_x=0.5, w_h=0.5):
    return w_x * x + w_h * hidden

sequence = [1, 2, 3, 4]
hidden = 0.0

for x in sequence:
    hidden = simple_rnn_step(x, hidden)
    print(round(hidden, 3))`,
    output: `0.5
1.25
2.125
3.062`,
  },
  {
    id: "transformers-attention",
    number: "11",
    title: "Transformers & Attention",
    summary:
      "Attention lets a model weigh how relevant every other element in a sequence is to the one it's currently processing, instead of relying on a single carried-forward memory like an RNN. The transformer architecture is built entirely around this idea, which is what lets it process a whole sequence in parallel and track long-range relationships effectively.",
    points: [
      "Each token compares itself against every other token via a query/key dot product.",
      "Softmax turns those raw comparison scores into weights that sum to 1.",
      "Because attention has no built-in sense of order, transformers add positional information separately.",
    ],
    code: `import math

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

def softmax(scores):
    exps = [math.exp(s) for s in scores]
    total = sum(exps)
    return [e / total for e in exps]

query = [1, 0]
keys = [[1, 0], [0, 1], [1, 1]]

scores = [dot(query, k) for k in keys]
weights = softmax(scores)

print([round(w, 3) for w in weights])`,
    output: `[0.422, 0.155, 0.422]`,
  },
  {
    id: "llms",
    number: "12",
    title: "Large Language Models (LLMs)",
    summary:
      "An LLM is a transformer trained on massive amounts of text to predict the next token in a sequence, over and over. That single, simple objective — repeated across billions of examples — is enough to make the model implicitly learn grammar, facts, and reasoning patterns, all as a side effect of getting better at prediction.",
    points: [
      "'Large' refers to both the amount of training data and the number of parameters (weights).",
      "A base model just predicts text; instruction-tuning and RLHF shape it into a helpful assistant.",
      "An LLM's 'knowledge' is frozen at its training cutoff — it doesn't know about anything after that.",
    ],
    code: `from collections import defaultdict

# A tiny toy 'language model': predict the next word from bigram counts
bigrams = defaultdict(list)
text = "the cat sat on the mat the cat sat".split()

for i in range(len(text) - 1):
    bigrams[text[i]].append(text[i + 1])

def predict_next(word):
    options = bigrams[word]
    return max(set(options), key=options.count) if options else None

print(predict_next("the"))
print(predict_next("cat"))`,
    output: `cat
sat`,
  },
  {
    id: "tokenization",
    number: "13",
    title: "Tokenization",
    summary:
      "Before any text reaches a model, it has to be broken into tokens — the discrete units the model actually operates on. Real LLMs use subword tokenization (like BPE), which splits text into frequent chunks smaller than a full word, so the model can handle rare words and typos without needing a token for every possible word in the language.",
    points: [
      "Splitting on whitespace is the simplest possible tokenizer, but it treats 'fast!' and 'fast' as different tokens.",
      "Subword tokenizers keep common words whole and break rare ones into familiar pieces.",
      "A model's context window is measured in tokens, not characters or words.",
    ],
    code: `import re

text = "CodeNFacts helps you learn, fast!"

# Naive whitespace tokenizer
print(text.split())

# A simple regex tokenizer that splits off punctuation
tokens = re.findall(r"\\w+|[^\\w\\s]", text)
print(tokens)`,
    output: `['CodeNFacts', 'helps', 'you', 'learn,', 'fast!']
['CodeNFacts', 'helps', 'you', 'learn', ',', 'fast', '!']`,
  },
  {
    id: "prompt-engineering",
    number: "14",
    title: "Prompt Engineering",
    summary:
      "Prompt engineering is structuring the input to a model so it reliably produces what you want, instead of leaving the model to guess your intent. Concrete instructions, relevant context, and a clear question all reduce ambiguity — a well-structured prompt is closer to a spec than a casual request.",
    points: [
      "Giving the model a role ('You are a helpful tutor') sets tone and framing before the actual task.",
      "Separating task, context, and question makes a prompt easier for the model to parse reliably.",
      "'Answer step by step' is a simple, effective way to encourage more careful reasoning.",
    ],
    code: `def build_prompt(task, context, question):
    return f"""You are a helpful tutor.
Task: {task}
Context: {context}
Question: {question}
Answer step by step."""

prompt = build_prompt(
    task="Explain a concept simply",
    context="The student is new to programming",
    question="What is a variable?"
)
print(prompt)`,
    output: `You are a helpful tutor.
Task: Explain a concept simply
Context: The student is new to programming
Question: What is a variable?
Answer step by step.`,
  },
  {
    id: "embeddings-vector-search",
    number: "15",
    title: "Embeddings & Vector Search",
    summary:
      "An embedding is a list of numbers representing the meaning of a piece of text or data, positioned so similar meanings sit close together in that space. Cosine similarity measures how close two embeddings point in the same direction, which is exactly what powers semantic search — finding relevant results even when the wording doesn't match.",
    points: [
      "Cosine similarity ranges from -1 (opposite) to 1 (identical direction), ignoring vector length.",
      "Words or sentences with similar meaning end up with embeddings that point in similar directions.",
      "Vector databases index embeddings so nearest-neighbor search stays fast even at massive scale.",
    ],
    code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x ** 2 for x in a))
    norm_b = math.sqrt(sum(y ** 2 for y in b))
    return dot / (norm_a * norm_b)

# pretend these are embeddings for "cat", "dog", "car"
cat = [0.9, 0.1, 0.0]
dog = [0.8, 0.2, 0.0]
car = [0.0, 0.1, 0.9]

print(round(cosine_similarity(cat, dog), 3))  # similar meaning
print(round(cosine_similarity(cat, car), 3))  # unrelated`,
    output: `0.991
0.012`,
  },
  {
    id: "rag",
    number: "16",
    title: "Retrieval-Augmented Generation (RAG)",
    summary:
      "RAG grounds a model's answer in real data by retrieving relevant documents first, then feeding them into the prompt alongside the question. This lets a model answer accurately about information it was never trained on — private documents, recent events — without retraining it, at the cost of only being as good as what gets retrieved.",
    points: [
      "The retrieval step usually uses vector search over document embeddings, not keyword matching alone.",
      "The retrieved text gets inserted into the prompt as context before the model generates an answer.",
      "Poor retrieval (missing or irrelevant documents) is the most common cause of a bad RAG answer.",
    ],
    code: `documents = {
    "doc1": "Python lists are ordered and mutable collections",
    "doc2": "Tuples are immutable and often used for fixed data",
    "doc3": "Dictionaries store key-value pairs for fast lookup",
}

def retrieve(query, documents):
    query_words = set(query.lower().split())
    scored = [
        (doc_id, len(query_words & set(text.lower().split())))
        for doc_id, text in documents.items()
    ]
    return max(scored, key=lambda item: item[1])[0]

query = "How do dictionaries store data"
best_doc = retrieve(query, documents)
print(best_doc, "->", documents[best_doc])`,
    output: `doc3 -> Dictionaries store key-value pairs for fast lookup`,
  },
  {
    id: "fine-tuning-transfer",
    number: "17",
    title: "Fine-tuning & Transfer Learning",
    summary:
      "Transfer learning reuses a model that already learned general features from a huge dataset, then adapts it to a narrower task with far less data than training from scratch would need. Fine-tuning often freezes most of the pretrained weights and only trains a small new part on top — much cheaper than retraining everything.",
    points: [
      "Freezing early layers keeps general features intact while the new layer specializes.",
      "Fine-tuning typically needs far less data and compute than pretraining from scratch.",
      "LoRA and similar techniques go further, training only a small set of additional parameters.",
    ],
    code: `# Pretrained weights (imagine these took days of GPU time to learn)
pretrained_hidden_weights = [0.7, -0.3, 0.5]

# Fine-tuning: freeze the hidden weights, only train a new final layer
def predict(inputs, hidden_weights, output_weight):
    hidden = sum(i * w for i, w in zip(inputs, hidden_weights))
    return hidden * output_weight

output_weight = 0.1  # newly initialized, this is what we'll train

for epoch in range(3):
    inputs, target = [1.0, 2.0, -1.0], 1.5
    pred = predict(inputs, pretrained_hidden_weights, output_weight)
    error = target - pred
    output_weight += 0.01 * error  # only this weight updates
    print(f"epoch {epoch}: pred={round(pred, 3)}, output_weight={round(output_weight, 3)}")`,
    output: `epoch 0: pred=-0.04, output_weight=0.115
epoch 1: pred=-0.046, output_weight=0.131
epoch 2: pred=-0.052, output_weight=0.146`,
  },
  {
    id: "reinforcement-learning",
    number: "18",
    title: "Reinforcement Learning",
    summary:
      "In reinforcement learning, an agent takes actions in an environment and receives rewards, gradually learning which actions lead to better outcomes through trial and error rather than labeled examples. Q-learning is one of the simplest versions: keep a running estimate of each action's value, and nudge that estimate toward whatever reward you actually observed.",
    points: [
      "There's no 'correct answer' given upfront — the agent only learns from the reward signal.",
      "Exploration (trying new actions) has to be balanced against exploitation (using what already works).",
      "This is the approach behind game-playing agents and many robotics control systems.",
    ],
    code: `import random

actions = ["left", "right"]
rewards = {"left": 1, "right": 5}  # unknown to the agent ahead of time
q_values = {"left": 0.0, "right": 0.0}
learning_rate = 0.1

random.seed(0)
for episode in range(5):
    action = random.choice(actions)
    reward = rewards[action]
    q_values[action] += learning_rate * (reward - q_values[action])
    print(f"episode {episode}: took '{action}', reward={reward}, q={round(q_values[action], 3)}")

print("learned preference:", max(q_values, key=q_values.get))`,
    output: `episode 0: took 'right', reward=5, q=0.5
episode 1: took 'right', reward=5, q=0.95
episode 2: took 'left', reward=1, q=0.1
episode 3: took 'right', reward=5, q=1.355
episode 4: took 'right', reward=5, q=1.72
learned preference: right`,
  },
  {
    id: "ai-ethics-bias",
    number: "19",
    title: "AI Ethics & Bias",
    summary:
      "A model trained on biased data will reproduce and often amplify that bias in its predictions — it isn't being 'fair' or 'neutral' by default, it's reflecting whatever patterns were in its training data. Checking for disparities in outcomes across groups is a basic first step toward catching this before a model ships.",
    points: [
      "Bias can enter through skewed training data, flawed labels, or the choice of what to optimize for.",
      "Fairness has multiple competing mathematical definitions — improving one can worsen another.",
      "Auditing outcomes by subgroup is a common first check, not a complete fairness guarantee on its own.",
    ],
    code: `# A toy example: checking if a hiring model's approval rate differs by group
decisions = [
    {"group": "A", "approved": True},
    {"group": "A", "approved": True},
    {"group": "A", "approved": False},
    {"group": "B", "approved": True},
    {"group": "B", "approved": False},
    {"group": "B", "approved": False},
]

def approval_rate(decisions, group):
    group_decisions = [d for d in decisions if d["group"] == group]
    approved = sum(1 for d in group_decisions if d["approved"])
    return approved / len(group_decisions)

rate_a = approval_rate(decisions, "A")
rate_b = approval_rate(decisions, "B")
print(f"Group A approval rate: {rate_a:.2f}")
print(f"Group B approval rate: {rate_b:.2f}")
print(f"Disparity: {abs(rate_a - rate_b):.2f}")`,
    output: `Group A approval rate: 0.67
Group B approval rate: 0.33
Disparity: 0.33`,
  },
  {
    id: "ai-in-production",
    number: "20",
    title: "AI in Production (MLOps)",
    summary:
      "Shipping a model is a different job from training one — it needs to serve predictions reliably and be watched for drift, which is when real-world input data quietly stops resembling what the model was trained on. Left undetected, drift degrades accuracy silently, since the model keeps making confident predictions on data it's no longer well-suited for.",
    points: [
      "Monitoring input distributions, not just accuracy, catches problems before users notice bad predictions.",
      "A/B testing and shadow deployments let you validate a new model against real traffic safely.",
      "Most production ML failures trace back to the surrounding pipeline, not the model itself.",
    ],
    code: `import statistics

training_mean_age = 34.2  # the average feature value the model was trained on
incoming_batch = [45, 50, 48, 52, 47]  # a recent batch of live requests

def check_drift(training_mean, batch, threshold=5.0):
    current_mean = statistics.mean(batch)
    drift = abs(current_mean - training_mean)
    return drift, drift > threshold

drift, is_drifting = check_drift(training_mean_age, incoming_batch)
print(f"current mean: {statistics.mean(incoming_batch)}")
print(f"drift: {round(drift, 2)}")
print(f"alert triggered: {is_drifting}")`,
    output: `current mean: 48.4
drift: 14.2
alert triggered: True`,
  },
];

// ---------------------------------------------------------------------------
// Lightweight Python syntax highlighting (no external deps)
// ---------------------------------------------------------------------------
//
// Colors below are chosen specifically for contrast against the fixed
// slate-900 code-block background (see CodeBlock), and are additionally
// forced via inline `style` so they can never be dimmed out by a parent
// light-mode text color (e.g. "text-slate-900") cascading in.

const TOKEN_PATTERN =
  /(#.*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(def|class|return|if|elif|else|for|while|in|import|from|as|try|except|finally|raise|with|lambda|not|and|or|is|None|True|False|pass|break|continue|yield|global|nonlocal|assert|del|self)\b|\b(\d+\.?\d*)\b|\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\()/g;

const TOKEN_COLORS = {
  default: "#e2e8f0", // slate-200 — main body text
  comment: "#94a3b8", // slate-400
  string: "#fbbf24", // amber-400
  keyword: "#34d399", // emerald-400
  number: "#38bdf8", // sky-400
  fn: "#c084fc", // purple-400
};

function highlightLine(line: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let idx = 0;
  const pattern = new RegExp(TOKEN_PATTERN.source, "g");
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    const [full, comment, str, keyword, num, fn] = match;
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`${keyPrefix}-plain-${idx++}`} style={{ color: TOKEN_COLORS.default }}>
          {line.slice(lastIndex, match.index)}
        </span>
      );
    }
    let color = TOKEN_COLORS.default;
    let fontStyle: "italic" | "normal" = "normal";
    let fontWeight: "500" | "normal" = "normal";
    if (comment) {
      color = TOKEN_COLORS.comment;
      fontStyle = "italic";
    } else if (str) {
      color = TOKEN_COLORS.string;
    } else if (keyword) {
      color = TOKEN_COLORS.keyword;
      fontWeight = "500";
    } else if (num) {
      color = TOKEN_COLORS.number;
    } else if (fn) {
      color = TOKEN_COLORS.fn;
    }

    nodes.push(
      <span
        key={`${keyPrefix}-${idx++}`}
        style={{ color, fontStyle, fontWeight }}
      >
        {full}
      </span>
    );
    lastIndex = match.index + full.length;
  }
  if (lastIndex < line.length) {
    nodes.push(
      <span key={`${keyPrefix}-tail`} style={{ color: TOKEN_COLORS.default }}>
        {line.slice(lastIndex)}
      </span>
    );
  }
  if (nodes.length === 0) nodes.push("\u00A0");
  return nodes;
}

// ---------------------------------------------------------------------------
// Code block component
// ---------------------------------------------------------------------------

function CodeBlock({ code, filename = "example.py" }: { code: string; filename?: string }) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — fail silently
    }
  };

  return (
    <div
      className="rounded-lg border border-slate-700 overflow-hidden"
      style={{ backgroundColor: "#0f172a" }}
    >
      <div
        className="flex items-center justify-between gap-2 border-b border-slate-700 px-4 py-2"
        style={{ backgroundColor: "#1e293b" }}
      >
        <span
          className="flex items-center gap-1.5 text-xs font-mono"
          style={{ color: "#94a3b8" }}
        >
          <Terminal className="h-3.5 w-3.5 text-emerald-500" />
          {filename}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs font-mono hover:text-emerald-400 transition-colors"
          style={{ color: "#94a3b8" }}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> copy
            </>
          )}
        </button>
      </div>
      <pre
        className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed font-mono"
        style={{ color: TOKEN_COLORS.default, backgroundColor: "#0f172a" }}
      >
        <code>
          {lines.map((line, i) => (
            <div key={i}>{highlightLine(line, `l${i}`)}</div>
          ))}
        </code>
      </pre>
    </div>
  );
}

function OutputBlock({ output }: { output: string }) {
  const lines = output.split("\n");
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-1.5 text-[11px] font-mono uppercase tracking-wide text-slate-400 dark:text-slate-500">
        output
      </div>
      <pre className="px-4 py-3 text-[13px] leading-relaxed font-mono text-slate-600 dark:text-slate-300 overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i}>{line || "\u00A0"}</div>
        ))}
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Download notes button + toast
// ---------------------------------------------------------------------------

function DownloadNotesButton({ onDownload }: { onDownload: () => void }) {
  return (
    <a
      href="/downloads/artificial-intelligence-notes.pdf"
      download
      onClick={onDownload}
      className="group mt-10 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300"
          >
      <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
      Download Artificial Intelligence Notes
    </a>
  );
}

function DownloadToast({ visible }: { visible: boolean }) {
  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-slate-900 px-4 py-3 shadow-lg shadow-emerald-500/10 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />
      <div className="text-sm">
        <p className="font-medium text-white">Downloading your notes…</p>
        <p className="text-slate-400">Thanks for learning with CodeNFacts!</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ArtificialIntelligenceCategoryPage() {
  const [activeId, setActiveId] = useState(topics[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const [showToast, setShowToast] = useState(false);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDownloadNotes = () => {
    setShowToast(true);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setShowToast(false), 4000);
  };

  useEffect(() => {
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const totalExamples = useMemo(() => topics.length, []);

  return (
    <main className="w-full bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero */}
      <section className="relative border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-1.5 text-sm font-normal text-slate-600 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              Artificial Intelligence · {totalExamples} core topics
            </span>
          </div>
          <h1 className="text-center text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Understand{" "}
            <span className="text-emerald-600 dark:text-emerald-400">AI</span>{" "}
            from first principles
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base sm:text-lg font-normal text-slate-500 dark:text-slate-400">
            From what a neuron actually computes to how an LLM predicts its
            next word - every concept explained in plain language, with a
            small, dependency-free example and its real, verified output.
          </p>

          <div className="mt-8 flex justify-center">
            <DownloadNotesButton onDownload={handleDownloadNotes} />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-8 py-12">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-12">
          {/* Sticky table of contents */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono font-normal text-slate-400 dark:text-slate-500">
                <ListTree className="h-3.5 w-3.5 text-emerald-500" />
                on this page
              </div>
              <nav className="border-l border-slate-200 dark:border-slate-700 max-h-[70vh] overflow-y-auto pr-2">
                {topics.map((t) => {
                  const isActive = t.id === activeId;
                  return (
                    <a
                      key={t.id}
                      href={`#${t.id}`}
                      className={`block border-l-2 -ml-px pl-4 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "border-emerald-500 text-emerald-700 dark:text-emerald-300 font-medium"
                          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-500/50"
                      }`}
                    >
                      <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 mr-1.5">
                        {t.number}
                      </span>
                      {t.title}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Topics */}
          <div className="lg:col-span-9 space-y-16">
            {topics.map((topic) => (
              <article
                key={topic.id}
                id={topic.id}
                ref={(el) => {
                  sectionRefs.current[topic.id] = el;
                }}
                className="scroll-mt-8"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-sm text-emerald-500">
                    {topic.number}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                    {topic.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base font-normal text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {topic.summary}
                </p>

                <ul className="mb-5 space-y-1.5">
                  {topic.points.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm font-normal text-slate-500 dark:text-slate-400"
                    >
                      <Hash className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-emerald-500" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="grid gap-3 sm:grid-cols-1">
                  <CodeBlock code={topic.code} filename={`${topic.id}.py`} />
                  {topic.output && <OutputBlock output={topic.output} />}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Ready to go deeper?
          </h3>
          <p className="mt-3 text-slate-500 dark:text-slate-400 font-normal">
            Ask the AI tutor any question about machine learning or LLMs and
            get a step-by-step walkthrough, live.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/ai"
              className="group inline-flex items-center rounded-full bg-emerald-600 dark:bg-emerald-500 px-7 py-3.5 font-semibold text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors"
            >
              Ask the AI tutor
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/category"
              className="group inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300 transition-colors"
            >
              Browse other categories
              <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
            <DownloadNotesButton onDownload={handleDownloadNotes} />
          </div>
        </div>
      </section>

      <DownloadToast visible={showToast} />
    </main>
  );
}