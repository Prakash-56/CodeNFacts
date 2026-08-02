"use client";

import { useMemo, useState } from "react";

/* ============================================================================
   NATURAL LANGUAGE PROCESSING — /category/nlp
   Design system (self-contained, drop-in):
   - Light mode: pure white background (#FFFFFF)
   - Dark mode: ink navy background (#0A0C12)
   - Toggled by a `dark` class on <html> or <body> — controlled by your
     existing header dark/light button. This page reacts via Tailwind
     `dark:` variants, so no local theme state is needed here.
   - Display face: Newsreader (serif, manuscript feel — this is a field
     built on grammar and text)
   - Body face: Inter
   - Mono face: JetBrains Mono (tokens, formulas, code)
   - Accent: violet (#5B4FE8 / #8B85FF dark) + teal (#0EA5A0 / #2DD4C8 dark)
   ========================================================================= */

/* ---------------------------------- Fonts -------------------------------- */
function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
      .font-display { font-family: 'Newsreader', serif; }
      .font-body { font-family: 'Inter', sans-serif; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
    `}</style>
  );
}

/* ------------------------------ Notes content ----------------------------- */
const NOTES_MARKDOWN = `# Natural Language Processing — Complete Notes

## 1. What is NLP?
Natural Language Processing (NLP) is the branch of Artificial Intelligence that
gives machines the ability to read, understand, interpret, and generate human
language — text or speech — in a way that is both meaningful and useful.

It sits at the intersection of linguistics, computer science, and machine
learning: linguistics supplies the structure of language (grammar, meaning,
context), while computer science and ML supply the statistical and
computational tools to model that structure at scale.

## 2. Why do we need NLP?
- Human language is the richest, most natural interface we have. NLP lets
  people talk to machines the way they talk to each other.
- Over 80% of enterprise data is unstructured text (emails, reviews, tickets,
  contracts, social media). NLP is how that data becomes usable.
- It automates work that would otherwise need thousands of human hours:
  reading documents, summarizing, translating, moderating, and answering
  questions.
- It powers accessibility: screen readers, live captions, translation for
  people who don't share a language.
- It is the foundation of modern AI assistants, search engines, and
  large language models.

## 3. Why is it hard?
Human language is ambiguous, context-dependent, and constantly evolving.
The same sentence can mean different things depending on tone, culture,
sarcasm, or prior conversation. Idioms, slang, and code-switching between
languages add further difficulty. NLP is fundamentally the science of
managing this ambiguity computationally.

## 4. Types / Eras of NLP
1. **Rule-based NLP** — hand-written grammar rules, regex, dictionaries.
   Predictable but brittle; breaks on anything unseen.
2. **Statistical NLP** — probabilities learned from corpora (n-grams, HMMs,
   Naive Bayes). Handles more variety, needs feature engineering.
3. **Machine Learning NLP** — classical ML models (SVM, Logistic Regression,
   CRF) over hand-crafted or TF-IDF features.
4. **Deep Learning NLP** — neural networks (RNN, LSTM, GRU, CNN) learn
   features automatically from raw text/embeddings.
5. **Transformer / Foundation-model NLP** — self-attention based models
   (BERT, GPT, T5, LLaMA) pretrained on massive corpora, then fine-tuned or
   prompted. Today's state of the art.

Also classified by direction:
- **NLU (Natural Language Understanding)** — extracting meaning from text
  (classification, NER, intent detection).
- **NLG (Natural Language Generation)** — producing text (summarization,
  translation, dialogue, chat responses).

## 5. The Core NLP Pipeline
Raw Text -> Text Cleaning -> Tokenization -> Normalization (stemming /
lemmatization) -> Stopword Removal -> Feature Extraction (BoW / TF-IDF /
Embeddings) -> Model (classical ML or neural network) -> Output
(classification, tags, generated text, etc.)

## 6. Core Tasks (with examples)
- **Tokenization**: "I love NLP!" -> ["I", "love", "NLP", "!"]
- **POS Tagging**: "I love NLP" -> I/PRON love/VERB NLP/NOUN
- **Named Entity Recognition (NER)**: "Apple was founded in Cupertino" ->
  Apple/ORG, Cupertino/LOC
- **Stemming**: "running", "runs", "ran" -> "run" (crude, rule-based)
- **Lemmatization**: "better" -> "good" (dictionary-based, grammatically correct)
- **Parsing (dependency/constituency)**: builds the grammatical tree of a sentence
- **Sentiment Analysis**: "This movie was amazing" -> Positive
- **Text Classification**: spam vs. not-spam, topic labeling
- **Machine Translation**: "Hello" -> "Bonjour"
- **Text Summarization**: long article -> 2-line summary (extractive or abstractive)
- **Question Answering**: context + "Who founded Apple?" -> "Steve Jobs"
- **Topic Modeling**: discovering hidden themes across documents (LDA)
- **Coreference Resolution**: "Anna said she was tired" -> she = Anna
- **Word Embeddings**: mapping words to dense vectors that capture meaning
- **Language Modeling**: predicting the next word given previous words

## 7. Key Formulas

Term Frequency:
  TF(t, d) = (count of t in d) / (total terms in d)

Inverse Document Frequency:
  IDF(t) = log( N / (1 + df(t)) )
  where N = total documents, df(t) = documents containing term t

TF-IDF:
  TF-IDF(t, d) = TF(t, d) * IDF(t)

Cosine Similarity (between vectors A, B):
  cos(theta) = (A . B) / (||A|| * ||B||)

N-gram probability (Markov assumption, order k):
  P(w_n | w_1...w_n-1) ~ P(w_n | w_n-k...w_n-1)

Naive Bayes classifier:
  P(c | d) is proportional to  P(c) * Product over i of P(w_i | c)

Perplexity of a language model:
  PP(W) = P(w_1, w_2, ..., w_N) ^ (-1/N)

Softmax:
  softmax(z_i) = e^(z_i) / Sum_j e^(z_j)

Cross-Entropy Loss:
  L = - Sum_i  y_i * log(y_hat_i)

Word2Vec Skip-gram objective (maximize):
  (1/T) * Sum_t Sum_(-c<=j<=c, j!=0) log P(w_(t+j) | w_t)

Scaled Dot-Product Attention:
  Attention(Q, K, V) = softmax( (Q K^T) / sqrt(d_k) ) V

BLEU Score (machine translation quality, simplified):
  BLEU = BP * exp( Sum_n w_n * log(p_n) )
  where p_n = n-gram precision, BP = brevity penalty

Levenshtein (Edit) Distance recurrence:
  D(i,j) = min( D(i-1,j)+1, D(i,j-1)+1, D(i-1,j-1) + cost(i,j) )

## 8. Roadmap to Learn NLP
1. Foundations — Python, probability & statistics, linear algebra, basic linguistics
2. Text preprocessing — regex, tokenization, stemming, lemmatization
3. Classical representations — Bag of Words, TF-IDF, n-grams
4. Classical ML — Naive Bayes, Logistic Regression, SVM, HMM, CRF
5. Word embeddings — Word2Vec, GloVe, FastText
6. Deep learning sequence models — RNN, LSTM, GRU, seq2seq, attention
7. Transformers — self-attention, BERT (encoder), GPT (decoder), T5 (encoder-decoder)
8. Applications — fine-tuning, retrieval-augmented generation (RAG), prompt engineering
9. Deployment & MLOps — serving models, evaluation, monitoring, cost/latency tradeoffs

## 9. Cheat Sheet — Task to Tool
- Tokenization / POS / NER / Parsing -> spaCy, NLTK, Stanza
- Classical ML pipelines -> scikit-learn
- Topic modeling -> Gensim (LDA)
- Embeddings -> Word2Vec, GloVe, FastText, sentence-transformers
- Transformers / fine-tuning -> Hugging Face Transformers, PyTorch, TensorFlow
- Quick prototyping / sentiment -> TextBlob, VADER
- Production LLM APIs -> Anthropic API, OpenAI API

## 10. How to Build Your Own NLP / AI Model
1. Define the task precisely (classification? generation? extraction?)
2. Collect and clean a representative dataset
3. Preprocess text (tokenize, normalize, remove noise)
4. Choose a representation (TF-IDF for classical ML, embeddings/tokenizer for neural)
5. Choose an architecture: classical ML for small/simple data, fine-tuned
   transformer (e.g., BERT) for understanding tasks, decoder LLM for generation
6. Split data (train / validation / test), train, and tune hyperparameters
7. Evaluate with the right metric: accuracy/F1 for classification, BLEU/ROUGE
   for generation, perplexity for language models
8. Deploy behind an API, monitor drift and failure cases, and keep iterating

Example fine-tuning sketch (Hugging Face style, pseudocode):
  tokenizer = AutoTokenizer.from_pretrained(model_name)
  model = AutoModelForSequenceClassification.from_pretrained(model_name)
  tokenized = dataset.map(lambda x: tokenizer(x["text"], truncation=True))
  trainer = Trainer(model, args, train_dataset=tokenized["train"], eval_dataset=tokenized["test"])
  trainer.train()

## 11. Use Cases
Search engines, machine translation, chatbots & virtual assistants, spam and
content moderation, sentiment/brand monitoring, resume screening, medical
record analysis, legal document review, customer support automation,
voice assistants, auto-captioning, code generation, and conversational AI.

## 12. Good Side
Massive productivity gains, accessibility for people with disabilities or
language barriers, democratized access to information, faster research,
and dramatically lower cost for language-heavy work.

## 13. Bad Side / Risks
Bias inherited from training data, hallucination (confidently wrong output),
privacy risk when models are trained on sensitive text, misinformation at
scale, job displacement in language-heavy roles, and real environmental /
compute cost for training large models.

## 14. The Future
Multimodal models that combine text, image, audio, and video; smaller and
more efficient models that run on-device; far better support for
low-resource languages; retrieval-augmented systems that stay current and
cite sources; and agentic systems that use language understanding to plan
and act, not just answer.

---
Thanks for downloading these notes. Keep building — every model starts
with a single tokenized sentence.
`;

/* --------------------------------- Helpers -------------------------------- */
type Tag =
  | "PRON"
  | "VERB"
  | "NOUN"
  | "PROPN"
  | "DET"
  | "ADJ"
  | "NUM"
  | "PUNCT"
  | "ADP";

const STOP: Record<string, Tag> = {
  i: "PRON", you: "PRON", he: "PRON", she: "PRON", we: "PRON", they: "PRON", it: "PRON",
  the: "DET", a: "DET", an: "DET", this: "DET", that: "DET",
  is: "VERB", am: "VERB", are: "VERB", was: "VERB", were: "VERB", love: "VERB", like: "VERB",
  in: "ADP", on: "ADP", at: "ADP", of: "ADP", to: "ADP", with: "ADP",
};

function heuristicTag(word: string): Tag {
  const w = word.toLowerCase();
  if (/^[.,!?;:]$/.test(word)) return "PUNCT";
  if (/^\d+$/.test(word)) return "NUM";
  if (STOP[w]) return STOP[w];
  if (/^[A-Z]/.test(word)) return "PROPN";
  if (/(ing|ed)$/.test(w)) return "VERB";
  if (/(ous|ive|ful|al|able)$/.test(w)) return "ADJ";
  return "NOUN";
}

const TAG_STYLE: Record<Tag, string> = {
  PRON: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  VERB: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  NOUN: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  PROPN: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  DET: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
  ADJ: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  NUM: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
  PUNCT: "bg-transparent text-[var(--muted)]",
  ADP: "bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300",
};

function tokenize(sentence: string): string[] {
  return sentence.match(/[A-Za-z]+(?:'[A-Za-z]+)?|\d+|[.,!?;:]/g) ?? [];
}

/* ---------------------------------- Page ---------------------------------- */
export default function NLPPage() {
  const [sentence, setSentence] = useState("Anthropic's Claude reads and writes English fluently!");
  const [downloaded, setDownloaded] = useState(false);

  const tokens = useMemo(() => tokenize(sentence), [sentence]);

  function handleDownload() {
    const blob = new Blob([NOTES_MARKDOWN], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Natural-Language-Processing-Notes.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 4500);
  }

  return (
    <div
      className="font-body min-h-screen bg-white text-[#14161A] dark:bg-[#0A0C12] dark:text-[#E7E9F0] transition-colors duration-300"
      style={
        {
          "--muted": "#6B7280",
          "--accent": "#5B4FE8",
          "--accent-soft": "#EFEDFD",
          "--card": "#F7F7FB",
          "--border": "#E7E7EF",
        } as React.CSSProperties
      }
    >
      <FontLoader />

      <div className="dark:[--muted:#9198A8] dark:[--accent:#8B85FF] dark:[--accent-soft:rgba(139,133,255,0.12)] dark:[--card:#12141C] dark:[--border:#232634]">
        {/* ---------------------------- Breadcrumb ---------------------------- */}
        <div className="max-w-6xl mx-auto px-6 pt-8 text-sm font-mono text-[var(--muted)]">
          <span className="mx-2">/</span>
          <span className="text-[var(--accent)]">NLP</span>
        </div>

        {/* ------------------------------- HERO -------------------------------- */}
        <section className="max-w-6xl mx-auto px-6 pt-10 pb-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--accent)] mb-4">
              Language ▸ Computation ▸ Meaning
            </p>
            <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] font-medium mb-6">
              Natural Language
              <br />
              Processing
            </h1>
            <p className="text-lg sm:text-xl text-[var(--muted)] max-w-xl leading-relaxed">
              The field of AI that teaches machines to read, parse, and
              generate human language - turning sentences like the one
              below into structure a computer can reason about.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#formulas" className="px-5 py-2.5 rounded-full border border-[var(--border)] font-mono text-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                Jump to formulas
              </a>
              <a href="#roadmap" className="px-5 py-2.5 rounded-full border border-[var(--border)] font-mono text-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                See the roadmap
              </a>
            </div>
          </div>

          {/* Signature element: live-ish tokenizer / POS demo */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-7">
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
              Try it — type a sentence
            </p>
            <input
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-white dark:bg-[#0A0C12] px-4 py-3 font-mono text-sm outline-none focus:border-[var(--accent)] transition-colors"
              placeholder="Type any sentence…"
            />
            <div className="mt-5 flex flex-wrap gap-2">
              {tokens.length === 0 && (
                <span className="text-sm text-[var(--muted)] font-mono">start typing…</span>
              )}
              {tokens.map((t, i) => {
                const tag = heuristicTag(t);
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="px-2.5 py-1 rounded-md border border-[var(--border)] font-mono text-sm">
                      {t}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${TAG_STYLE[tag]}`}>
                      {tag}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-5 text-xs text-[var(--muted)] leading-relaxed">
              This is a simplified, rule-of-thumb tagger for illustration —
              real POS taggers (spaCy, Stanza) use trained statistical or
              neural models, not just suffix rules.
            </p>
          </div>
        </section>

        {/* --------------------------- WHAT / WHY ------------------------------ */}
        <Section id="what" eyebrow="01 — Definition" title="What is NLP, really?">
          <p className="text-[var(--muted)] leading-relaxed max-w-3xl">
            Natural Language Processing is the discipline that lets software
            work with human language the way it already works with numbers
            and tables. It combines <b className="text-[var(--fg,inherit)]">linguistics</b> (grammar,
            syntax, semantics), <b>computer science</b> (algorithms, data
            structures), and <b>machine learning</b> (patterns learned from
            huge amounts of text) into one pipeline: text goes in,
            understanding or new text comes out.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <MiniCard title="Understanding (NLU)" body="Turning text into structured meaning: intent, entities, sentiment, classification." />
            <MiniCard title="Generation (NLG)" body="Turning structured meaning or context into fluent text: summaries, translations, replies." />
            <MiniCard title="Foundation" body="Modern systems fuse both directions in one model — a single network that reads and writes." />
          </div>
        </Section>

        <Section id="why" eyebrow="02 — Motivation" title="Why does NLP exist — and why does it matter?">
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-4">
              <Reason title="Language is the native interface" body="People think and communicate in words, not SQL queries. NLP removes the translation layer between humans and machines." />
              <Reason title="Most data is unstructured text" body="The large majority of enterprise data — emails, tickets, contracts, reviews — is text. Without NLP it just sits there, unused." />
              <Reason title="Scale humans can't reach" body="No team can read a million support tickets a day. A trained model can, consistently, in seconds." />
            </ul>
            <ul className="space-y-4">
              <Reason title="Accessibility" body="Captioning, screen readers, and translation open technology to people with disabilities or different languages." />
              <Reason title="It underlies modern AI" body="Chatbots, search engines, and today's large language models are all, fundamentally, NLP systems." />
              <Reason title="Ambiguity is the real challenge" body="Tone, sarcasm, idioms, and context make language genuinely hard for machines — which is exactly why the field keeps advancing." />
            </ul>
          </div>
        </Section>

        {/* --------------------------------- TYPES ------------------------------ */}
        <Section id="types" eyebrow="03 — Evolution" title="Types of NLP, from rules to transformers">
          <div className="space-y-3">
            {[
              { era: "Rule-Based", desc: "Hand-written grammars, regex, and dictionaries. Predictable, explainable — but brittle on anything it wasn't written for.", years: "1950s–80s" },
              { era: "Statistical", desc: "Probabilities learned from text corpora: n-grams, Hidden Markov Models, Naive Bayes.", years: "1990s" },
              { era: "Classical Machine Learning", desc: "SVMs, logistic regression, and CRFs over hand-crafted or TF-IDF features.", years: "2000s" },
              { era: "Deep Learning", desc: "RNNs, LSTMs, GRUs — networks that learn features directly from sequences and embeddings.", years: "2010–2017" },
              { era: "Transformer / Foundation Models", desc: "Self-attention architectures (BERT, GPT, T5) pretrained on massive text, then fine-tuned or prompted.", years: "2017–now" },
            ].map((t, i) => (
              <div key={t.era} className="flex gap-5 items-start rounded-xl border border-[var(--border)] p-5 hover:border-[var(--accent)]/50 transition-colors">
                <span className="font-mono text-xs text-[var(--accent)] pt-1 w-24 shrink-0">{t.years}</span>
                <div>
                  <h3 className="font-display text-xl font-medium">{t.era}</h3>
                  <p className="text-[var(--muted)] text-sm mt-1 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ------------------------------ PIPELINE DIAGRAM ----------------------- */}
        <Section id="pipeline" eyebrow="04 — Block diagram" title="The core NLP pipeline">
          <PipelineDiagram />
        </Section>

        {/* ------------------------------ TASKS --------------------------------- */}
        <Section id="tasks" eyebrow="05 — Topics" title="Core NLP tasks, with examples">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Tokenization", `"I love NLP!" → ["I","love","NLP","!"]`],
              ["POS Tagging", `"I love NLP" → I/PRON love/VERB NLP/NOUN`],
              ["Named Entity Recognition", `"Apple was founded in Cupertino" → Apple/ORG, Cupertino/LOC`],
              ["Stemming", `"running","runs","ran" → "run" (crude cut)`],
              ["Lemmatization", `"better" → "good" (dictionary-correct root)`],
              ["Parsing", `Builds the grammatical tree of a sentence`],
              ["Sentiment Analysis", `"This movie was amazing" → Positive`],
              ["Text Classification", `Spam vs. not-spam, topic labeling`],
              ["Machine Translation", `"Hello" → "Bonjour"`],
              ["Summarization", `Long article → 2-line summary`],
              ["Question Answering", `Context + "Who founded Apple?" → "Steve Jobs"`],
              ["Topic Modeling", `Finds hidden themes across documents (LDA)`],
              ["Coreference Resolution", `"Anna said she was tired" → she = Anna`],
              ["Word Embeddings", `Words → dense vectors that capture meaning`],
              ["Language Modeling", `Predicts the next word given prior words`],
            ].map(([title, ex]) => (
              <div key={title} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="font-mono text-xs text-[var(--muted)] mt-2 leading-relaxed">{ex}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ------------------------------ FORMULAS ------------------------------ */}
        <Section id="formulas" eyebrow="06 — Formulas" title="Formulas you actually need">
          <div className="grid md:grid-cols-2 gap-4">
            <Formula name="Term Frequency">
              TF(t, d) = count(t in d) / total terms in d
            </Formula>
            <Formula name="Inverse Document Frequency">
              IDF(t) = log( N / (1 + df(t)) )
            </Formula>
            <Formula name="TF-IDF">
              TF-IDF(t, d) = TF(t, d) × IDF(t)
            </Formula>
            <Formula name="Cosine Similarity">
              cos(θ) = (A · B) / (‖A‖ ‖B‖)
            </Formula>
            <Formula name="N-gram probability (Markov)">
              P(w<sub>n</sub> | w<sub>1..n-1</sub>) ≈ P(w<sub>n</sub> | w<sub>n-k..n-1</sub>)
            </Formula>
            <Formula name="Naive Bayes">
              P(c | d) ∝ P(c) · Π<sub>i</sub> P(w<sub>i</sub> | c)
            </Formula>
            <Formula name="Perplexity">
              PP(W) = P(w<sub>1</sub>…w<sub>N</sub>)<sup>-1/N</sup>
            </Formula>
            <Formula name="Softmax">
              softmax(z<sub>i</sub>) = e<sup>z_i</sup> / Σ<sub>j</sub> e<sup>z_j</sup>
            </Formula>
            <Formula name="Cross-Entropy Loss">
              L = − Σ<sub>i</sub> y<sub>i</sub> log(ŷ<sub>i</sub>)
            </Formula>
            <Formula name="Skip-gram objective (Word2Vec)">
              (1/T) Σ<sub>t</sub> Σ<sub>-c≤j≤c</sub> log P(w<sub>t+j</sub> | w<sub>t</sub>)
            </Formula>
            <Formula name="Scaled Dot-Product Attention">
              Attention(Q,K,V) = softmax( QK<sup>T</sup> / √d<sub>k</sub> ) V
            </Formula>
            <Formula name="Levenshtein Distance">
              D(i,j) = min( D(i-1,j)+1, D(i,j-1)+1, D(i-1,j-1)+cost )
            </Formula>
          </div>
        </Section>

        {/* -------------------------- TRANSFORMER DIAGRAM ------------------------ */}
        <Section id="diagrams" eyebrow="07 — Diagrams & sketches" title="Architecture sketches">
          <div className="grid lg:grid-cols-2 gap-6">
            <TransformerDiagram />
            <RNNDiagram />
          </div>
        </Section>

        {/* -------------------------------- ROADMAP ------------------------------ */}
        <Section id="roadmap" eyebrow="08 — Roadmap" title="Learning path, start to finish">
          <div className="relative pl-8">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border)]" />
            {[
              ["Foundations", "Python, probability & statistics, linear algebra, basic linguistics"],
              ["Preprocessing", "Regex, tokenization, stemming, lemmatization, stopwords"],
              ["Classical representations", "Bag of Words, TF-IDF, n-grams"],
              ["Classical ML", "Naive Bayes, Logistic Regression, SVM, HMM, CRF"],
              ["Word embeddings", "Word2Vec, GloVe, FastText"],
              ["Deep sequence models", "RNN, LSTM, GRU, seq2seq, attention"],
              ["Transformers", "Self-attention, BERT, GPT, T5"],
              ["Applications", "Fine-tuning, RAG, prompt engineering"],
              ["Deployment & MLOps", "Serving, evaluation, monitoring, cost/latency"],
            ].map(([step, desc], i) => (
              <div key={step} className="relative pb-8 last:pb-0">
                <div className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-[var(--accent)] ring-4 ring-[var(--accent-soft)]" />
                <p className="font-mono text-xs text-[var(--muted)]">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-display text-xl font-medium">{step}</h3>
                <p className="text-sm text-[var(--muted)] mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ------------------------------ CHEAT SHEET ---------------------------- */}
        <Section id="cheatsheet" eyebrow="09 — Cheat sheet" title="Task → Tool, at a glance">
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--card)] text-left">
                  <th className="p-4 font-mono text-xs uppercase tracking-wider text-[var(--muted)]">Task</th>
                  <th className="p-4 font-mono text-xs uppercase tracking-wider text-[var(--muted)]">Go-to tools / libraries</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Tokenization / POS / NER / Parsing", "spaCy, NLTK, Stanza"],
                  ["Classical ML pipelines", "scikit-learn"],
                  ["Topic modeling", "Gensim (LDA)"],
                  ["Word embeddings", "Word2Vec, GloVe, FastText, sentence-transformers"],
                  ["Transformers / fine-tuning", "Hugging Face Transformers, PyTorch, TensorFlow"],
                  ["Quick sentiment / prototyping", "TextBlob, VADER"],
                  ["Production-grade LLMs", "Anthropic API, OpenAI API"],
                ].map(([task, tool], i) => (
                  <tr key={task} className={i % 2 ? "" : "bg-[var(--card)]/50"}>
                    <td className="p-4 border-t border-[var(--border)]">{task}</td>
                    <td className="p-4 border-t border-[var(--border)] font-mono text-xs text-[var(--muted)]">{tool}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ----------------------------- BUILD YOUR OWN --------------------------- */}
        <Section id="build" eyebrow="10 — Build" title="How to build your own NLP / AI model">
          <ol className="space-y-3 max-w-3xl">
            {[
              "Define the task precisely — classification, extraction, or generation?",
              "Collect and clean a representative dataset",
              "Preprocess text — tokenize, normalize, strip noise",
              "Pick a representation — TF-IDF for classical ML, a tokenizer/embeddings for neural nets",
              "Pick an architecture — classical ML for small data, fine-tuned BERT for understanding, a decoder LLM for generation",
              "Split data, train, tune hyperparameters",
              "Evaluate with the right metric — accuracy/F1, BLEU/ROUGE, or perplexity",
              "Deploy behind an API, monitor for drift and failure cases, iterate",
            ].map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="font-mono text-xs text-[var(--accent)] pt-0.5 w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-[var(--muted)]">{step}</span>
              </li>
            ))}
          </ol>
          <pre className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 overflow-x-auto font-mono text-xs leading-relaxed">
{`tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
tokenized = dataset.map(lambda x: tokenizer(x["text"], truncation=True))
trainer = Trainer(model, args, train_dataset=tokenized["train"], eval_dataset=tokenized["test"])
trainer.train()`}
          </pre>
        </Section>

        {/* --------------------------------- BLOG -------------------------------- */}
        <Section id="blog" eyebrow="11 — In depth" title="Use cases, strengths, and open problems">
          <div className="grid md:grid-cols-2 gap-6">
            <BlogCard title="Use cases" tone="accent" items={[
              "Search engines & recommendation",
              "Machine translation",
              "Chatbots & virtual assistants",
              "Spam & content moderation",
              "Brand / sentiment monitoring",
              "Legal & medical document review",
              "Voice assistants & auto-captioning",
              "Code generation",
            ]} />
            <BlogCard title="Good side" tone="teal" items={[
              "Massive productivity gains",
              "Accessibility across languages & abilities",
              "Democratized access to information",
              "Faster research and discovery",
              "Cheaper language-heavy work",
            ]} />
            <BlogCard title="Bad side" tone="rose" items={[
              "Inherits bias from training data",
              "Hallucination — confidently wrong output",
              "Privacy risk from sensitive training text",
              "Misinformation at scale",
              "Real compute & environmental cost",
            ]} />
            <BlogCard title="The future" tone="amber" items={[
              "Multimodal models — text, image, audio, video",
              "Smaller, efficient, on-device models",
              "Stronger support for low-resource languages",
              "Retrieval-augmented, source-citing systems",
              "Agentic systems that plan and act, not just answer",
            ]} />
          </div>
        </Section>

        {/* ------------------------------- DOWNLOAD ------------------------------ */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--accent-soft)] to-transparent p-10 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)] mb-3">
              Take it with you
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium mb-3">
              Download the full NLP notes
            </h2>
            <p className="text-[var(--muted)] max-w-xl mx-auto mb-8">
              Every section on this page — definitions, formulas, roadmap,
              cheat sheet, and blog — bundled into one Markdown file you can
              keep, print, or drop into your own notes.
            </p>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--accent)] text-white font-mono text-sm font-medium hover:opacity-90 transition-opacity"
            >
              ↓ Download Natural Language Processing Notes
            </button>

            {downloaded && (
              <p className="mt-5 font-mono text-sm text-teal-600 dark:text-teal-300 transition-opacity">
                🎉 Thank you for downloading — happy learning! Go build something with words.
              </p>
            )}
          </div>
        </section>

        <footer className="max-w-6xl mx-auto px-6 pb-16 text-xs text-[var(--muted)] font-mono">
          NLP - notes compiled for study purposes.
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------ Sub-components ---------------------------- */

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-6 py-14 border-t border-[var(--border)]">
      <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)] mb-2">{eyebrow}</p>
      <h2 className="font-display text-3xl sm:text-4xl font-medium mb-8">{title}</h2>
      {children}
    </section>
  );
}

function MiniCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h3 className="font-semibold text-sm mb-2">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}

function Reason({ title, body }: { title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-sm text-[var(--muted)] mt-0.5 leading-relaxed">{body}</p>
      </div>
    </li>
  );
}

function Formula({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">{name}</p>
      <p className="font-mono text-sm sm:text-base">{children}</p>
    </div>
  );
}

function BlogCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "accent" | "teal" | "rose" | "amber";
}) {
  const dot: Record<string, string> = {
    accent: "bg-[var(--accent)]",
    teal: "bg-teal-500",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
  };
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h3 className="font-display text-xl font-medium mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-sm text-[var(--muted)]">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dot[tone]}`} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------- Diagrams ---------------------------------- */

function PipelineDiagram() {
  const steps = [
    "Raw Text",
    "Cleaning",
    "Tokenization",
    "Normalization",
    "Feature\nExtraction",
    "Model",
    "Output",
  ];
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-[820px]">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="w-24 sm:w-28 h-20 rounded-xl border-2 border-[var(--accent)]/60 bg-white dark:bg-[#0A0C12] flex items-center justify-center text-center px-2">
              <span className="font-mono text-xs whitespace-pre-line leading-tight">{s}</span>
            </div>
            {i < steps.length - 1 && (
              <span className="mx-2 text-[var(--accent)] text-lg font-mono">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TransformerDiagram() {
  const blocks = ["Input Embedding", "Positional Encoding", "Self-Attention", "Feed Forward", "Output"];
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] mb-4">
        Simplified Transformer block
      </p>
      <div className="flex flex-col gap-2">
        {blocks.map((b, i) => (
          <div key={b}>
            <div className="rounded-lg border border-[var(--border)] bg-white dark:bg-[#0A0C12] px-4 py-3 text-sm font-mono text-center">
              {b}
            </div>
            {i < blocks.length - 1 && (
              <div className="text-center text-[var(--accent)] font-mono">↓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RNNDiagram() {
  const cells = ["h₀", "h₁", "h₂", "h₃"];
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] mb-6">
        Unrolled recurrent network (RNN / LSTM / GRU)
      </p>
      <div className="flex items-end justify-between gap-2">
        {cells.map((c, i) => (
          <div key={c} className="flex flex-col items-center gap-2">
            <span className="font-mono text-xs text-[var(--muted)]">x<sub>{i}</sub></span>
            <div className="w-14 h-14 rounded-lg border-2 border-[var(--accent)]/60 flex items-center justify-center font-mono text-sm bg-white dark:bg-[#0A0C12]">
              {c}
            </div>
            {i < cells.length - 1 && (
              <span className="absolute translate-x-[3.6rem] translate-y-[-1.8rem] text-[var(--accent)] font-mono text-xs hidden sm:block">→</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--muted)] mt-6 leading-relaxed">
        Each cell passes a hidden state forward, letting the network
        remember earlier words while reading a sentence left to right.
      </p>
    </div>
  );
}