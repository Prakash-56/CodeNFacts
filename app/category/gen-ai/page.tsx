"use client";

import React, { useState, useRef } from "react";

/**
 * Generative AI — the full field guide
 * -------------------------------------------------------------
 * Drop this file in as: app/category/gen-ai/page.tsx
 *
 * Theming: this page uses Tailwind's CLASS-based dark mode
 * (dark:*) and expects your header's light/dark toggle to add
 * / remove the "dark" class on <html> (e.g. via next-themes or
 * your own ThemeContext). Make sure tailwind.config has:
 *   darkMode: "class"
 * Light mode background is pure white (#FFFFFF) as requested.
 *
 * No external UI libraries required — icons are hand-rolled SVG
 * so the file works even if lucide-react / other icon packs are
 * not installed in your project.
 * -------------------------------------------------------------
 */

/* ----------------------------- helpers ----------------------------- */

type TabId =
  | "overview"
  | "types"
  | "architecture"
  | "notes"
  | "cheatsheet"
  | "diagrams"
  | "build"
  | "blog"
  | "future";

const TABS: { id: TabId; label: string; eyebrow: string }[] = [
  { id: "overview", label: "What & Why", eyebrow: "01" },
  { id: "types", label: "Types of GenAI", eyebrow: "02" },
  { id: "architecture", label: "Architectures & Formulas", eyebrow: "03" },
  { id: "notes", label: "Detailed Notes", eyebrow: "04" },
  { id: "cheatsheet", label: "Cheat Sheet", eyebrow: "05" },
  { id: "diagrams", label: "Diagrams & Sketches", eyebrow: "06" },
  { id: "build", label: "Build Your Own Model", eyebrow: "07" },
  { id: "blog", label: "Blog & Use Cases", eyebrow: "08" },
  { id: "future", label: "Good, Bad & Future", eyebrow: "09" },
];

function Section({
  id,
  title,
  kicker,
  children,
}: {
  id: string;
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 mb-16">
      <div className="flex items-baseline gap-3 mb-6 border-b border-[#14171C]/10 dark:border-[#E7E9EC]/10 pb-3">
        <span className="font-mono text-xs tracking-widest text-[#1F4FD8] dark:text-[#F5A623]">
          {kicker}
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#14171C] dark:text-[#E7E9EC]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={
        "rounded-md border border-[#14171C]/10 dark:border-[#E7E9EC]/12 bg-[#F7F7F5] dark:bg-[#14171C] p-5 " +
        className
      }
    >
      {children}
    </div>
  );
}

function Formula({ label, formula, note }: { label: string; formula: string; note: string }) {
  return (
    <div className="rounded-md border border-[#14171C]/10 dark:border-[#E7E9EC]/12 bg-white dark:bg-[#0B0D10] p-4">
      <p className="font-mono text-xs uppercase tracking-widest text-[#4B5563] dark:text-[#9AA3AF] mb-2">
        {label}
      </p>
      <p className="font-mono text-base md:text-lg text-[#1F4FD8] dark:text-[#F5A623] overflow-x-auto whitespace-pre">
        {formula}
      </p>
      <p className="text-sm text-[#4B5563] dark:text-[#9AA3AF] mt-2">{note}</p>
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#14171C]/10 dark:border-[#E7E9EC]/12 rounded-md overflow-hidden bg-white dark:bg-[#0B0D10]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-[#14171C] dark:text-[#E7E9EC] hover:bg-[#F7F7F5] dark:hover:bg-[#14171C] transition-colors"
      >
        <span>{title}</span>
        <span className="font-mono text-[#1F4FD8] dark:text-[#F5A623]">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-[#4B5563] dark:text-[#9AA3AF] text-sm leading-relaxed space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- data ----------------------------- */

const GEN_TYPES = [
  {
    title: "Text generation (LLMs)",
    desc: "Models like GPT, Claude, Gemini, and Llama predict the next token in a sequence, enabling chat, writing, summarizing, translation, and reasoning.",
    examples: "Claude, GPT-4, Gemini, Llama 3, Mistral",
  },
  {
    title: "Image generation",
    desc: "Diffusion and GAN-based models turn text prompts or noise into images by iteratively refining pixels or latent representations.",
    examples: "Stable Diffusion, Midjourney, DALL·E 3, Imagen",
  },
  {
    title: "Audio & speech generation",
    desc: "Models that synthesize speech, music, or sound effects, often using diffusion or autoregressive waveform modeling.",
    examples: "ElevenLabs, MusicLM, Bark, WaveNet",
  },
  {
    title: "Video generation",
    desc: "Extends diffusion to the temporal dimension, generating coherent frames over time conditioned on text or images.",
    examples: "Sora, Runway Gen-3, Pika, Veo",
  },
  {
    title: "Code generation",
    desc: "LLMs fine-tuned on code corpora that autocomplete, explain, debug, and refactor across languages.",
    examples: "Claude Code, GitHub Copilot, Codex, CodeLlama",
  },
  {
    title: "Multimodal generation",
    desc: "Single models that accept and produce a mix of text, image, audio, and video, sharing one underlying representation space.",
    examples: "GPT-4o, Gemini 2.x, Claude with vision",
  },
  {
    title: "3D & structured data generation",
    desc: "Generates 3D meshes, molecules, protein structures, or tabular/synthetic datasets for simulation and design.",
    examples: "AlphaFold, DreamFusion, synthetic-data GANs",
  },
];

const FORMULAS = [
  {
    label: "Self-Attention (Scaled Dot-Product)",
    formula: "Attention(Q, K, V) = softmax( QKᵀ / √d_k ) · V",
    note: "The core of the Transformer — Q(query), K(key), V(value) are learned projections of the input. Dividing by √d_k stabilizes gradients.",
  },
  {
    label: "Softmax function",
    formula: "softmax(z_i) = e^(z_i) / Σⱼ e^(z_j)",
    note: "Converts raw scores (logits) into a probability distribution over the vocabulary or over attention weights.",
  },
  {
    label: "Cross-Entropy Loss (next-token prediction)",
    formula: "L = − Σ y_i · log(ŷ_i)",
    note: "Measures the difference between the predicted token distribution ŷ and the true one-hot token y; minimized during training.",
  },
  {
    label: "Perplexity",
    formula: "PPL = exp( − (1/N) Σ log P(x_i) )",
    note: "A common LLM evaluation metric — lower perplexity means the model is less 'surprised' by real text.",
  },
  {
    label: "Positional Encoding (sinusoidal)",
    formula: "PE(pos,2i)=sin(pos/10000^(2i/d))\nPE(pos,2i+1)=cos(pos/10000^(2i/d))",
    note: "Injects order information into token embeddings since attention itself has no sense of sequence position.",
  },
  {
    label: "GAN Minimax Objective",
    formula: "min_G max_D  E[log D(x)] + E[log(1 − D(G(z)))]",
    note: "The Generator (G) tries to fool the Discriminator (D); the Discriminator tries to correctly tell real data x from fake G(z).",
  },
  {
    label: "VAE Loss (ELBO)",
    formula: "L = E[log p(x|z)] − KL( q(z|x) ‖ p(z) )",
    note: "Balances reconstruction quality against how close the learned latent distribution is to a simple prior (usually Gaussian).",
  },
  {
    label: "Diffusion Forward Process",
    formula: "x_t = √(ᾱ_t) · x₀ + √(1 − ᾱ_t) · ε,  ε ~ N(0, I)",
    note: "Gradually adds Gaussian noise to data x₀ over t steps; the model learns to reverse this process step by step.",
  },
  {
    label: "Diffusion Training Objective",
    formula: "L = E‖ ε − ε_θ(x_t, t) ‖²",
    note: "The network ε_θ learns to predict the noise that was added, which lets it denoise step-by-step at generation time.",
  },
  {
    label: "KL Divergence",
    formula: "D_KL(P‖Q) = Σ P(x) · log( P(x)/Q(x) )",
    note: "Measures how one probability distribution diverges from a reference distribution; used in VAEs and RLHF.",
  },
  {
    label: "RLHF Reward Objective (PPO-style)",
    formula: "J(θ) = E[ r(x,y) − β · KL(π_θ ‖ π_ref) ]",
    note: "Reinforcement Learning from Human Feedback rewards outputs humans prefer while penalizing drift too far from the base model.",
  },
  {
    label: "LoRA (Low-Rank Adaptation)",
    formula: "W' = W₀ + ΔW,  ΔW = B·A  (rank r ≪ d)",
    note: "Instead of fine-tuning the full weight matrix W₀, only small low-rank matrices A and B are trained — cheap fine-tuning.",
  },
  {
    label: "Cosine Similarity (embeddings / RAG retrieval)",
    formula: "cos(u,v) = (u · v) / (‖u‖ ‖v‖)",
    note: "Used to compare embedding vectors — the backbone of semantic search and Retrieval-Augmented Generation.",
  },
];

const NOTES_TOPICS = [
  {
    title: "1. Tokens & Tokenization",
    body: "Text is split into tokens (sub-words, e.g. 'generat' + 'ion') using algorithms like Byte-Pair Encoding (BPE) or SentencePiece. Models don't see raw text — they see integer token IDs mapped to embedding vectors. Example: 'unhappiness' → ['un', 'happi', 'ness'].",
  },
  {
    title: "2. Embeddings",
    body: "Each token is mapped to a dense vector (e.g. 4096 dimensions) that encodes meaning — words used in similar contexts get similar vectors. Example: vector('king') − vector('man') + vector('woman') ≈ vector('queen').",
  },
  {
    title: "3. The Transformer",
    body: "Introduced in 'Attention Is All You Need' (2017). Stacks of self-attention + feed-forward layers let every token 'look at' every other token in parallel, unlike older RNNs which processed sequentially. This parallelism is why LLMs can train on massive datasets efficiently.",
  },
  {
    title: "4. Pre-training vs Fine-tuning",
    body: "Pre-training: the model learns general language patterns from huge unlabeled text corpora (predict the next token). Fine-tuning: the pre-trained model is further trained on a smaller, task-specific or instruction dataset (e.g. Q&A pairs) to make it more useful and safe.",
  },
  {
    title: "5. RLHF — Reinforcement Learning from Human Feedback",
    body: "After fine-tuning, humans rank multiple model outputs. A reward model learns to predict these rankings, and the LLM is further optimized (e.g. via PPO) to produce outputs the reward model scores highly — this is how models become more helpful and aligned.",
  },
  {
    title: "6. Prompt Engineering",
    body: "The practice of crafting inputs to get better outputs: zero-shot ('translate this'), few-shot (giving examples first), chain-of-thought ('think step by step'), and role prompting ('act as a lawyer'). Small wording changes can significantly change output quality.",
  },
  {
    title: "7. Context Window",
    body: "The maximum number of tokens a model can 'see' at once (prompt + response). Example: a 200K-token context window can hold roughly a 500-page book. Beyond this limit, older content is truncated or must be summarized/retrieved.",
  },
  {
    title: "8. RAG — Retrieval-Augmented Generation",
    body: "Instead of relying purely on frozen training knowledge, the model retrieves relevant documents from an external database (via embedding similarity search) and includes them in the prompt — reduces hallucination and adds up-to-date knowledge.",
  },
  {
    title: "9. Fine-tuning techniques: LoRA / QLoRA / PEFT",
    body: "Full fine-tuning updates every weight (expensive). Parameter-Efficient Fine-Tuning (PEFT) methods like LoRA freeze the base model and train small added matrices, cutting compute and storage cost by 90%+ while achieving similar results.",
  },
  {
    title: "10. Diffusion Models (image/video/audio)",
    body: "Training: gradually add noise to real data until it's pure noise. Generation: start from random noise and run the trained model backward, step by step removing noise until a clean sample (image/audio/video) emerges.",
  },
  {
    title: "11. GANs — Generative Adversarial Networks",
    body: "Two networks compete: the Generator creates fake samples, the Discriminator tries to catch them. Both improve together until the Generator's output is indistinguishable from real data. Famous for early photorealistic face generation (StyleGAN).",
  },
  {
    title: "12. VAEs — Variational Autoencoders",
    body: "An Encoder compresses input into a probabilistic latent space; a Decoder reconstructs data from it. Useful for smooth interpolation between generated samples and as a component inside larger systems like Stable Diffusion's latent space.",
  },
  {
    title: "13. Multimodality",
    body: "Modern models (GPT-4o, Gemini, Claude with vision) share a joint embedding space across text, images, and sometimes audio/video, so one model can reason across modalities instead of needing separate specialist models.",
  },
  {
    title: "14. Hallucination",
    body: "When a generative model produces confident but false or fabricated information, because it's optimizing for plausible-sounding continuations, not verified truth. Mitigated with RAG, citations, and fact-checking layers.",
  },
  {
    title: "15. Alignment & Safety",
    body: "The effort to make models helpful, honest, and harmless — through RLHF, Constitutional AI (models critiquing their own outputs against a set of principles), red-teaming, and guardrails against misuse.",
  },
  {
    title: "16. Agents & Tool Use",
    body: "LLMs augmented with the ability to call external tools (search, code execution, APIs) and plan multi-step tasks — turning a text predictor into an autonomous problem solver (e.g. Claude Code, AutoGPT-style agents).",
  },
  {
    title: "17. Scaling Laws",
    body: "Empirically, model performance improves predictably as you increase model size, dataset size, and compute together (Chinchilla scaling laws) — this is why bigger, better-trained models keep improving.",
  },
  {
    title: "18. Inference-time techniques",
    body: "Temperature controls randomness (low = deterministic, high = creative). Top-k and top-p (nucleus) sampling restrict token choices to the most likely subset. Beam search explores multiple candidate sequences at once.",
  },
];

const CHEATSHEET = [
  { term: "LLM", def: "Large Language Model — a neural network trained on massive text data to predict/generate language." },
  { term: "GPT", def: "Generative Pre-trained Transformer — an autoregressive transformer architecture." },
  { term: "Token", def: "The smallest unit of text a model processes (word/sub-word/character)." },
  { term: "Embedding", def: "A dense numeric vector representing the meaning of text, image, or audio." },
  { term: "Context window", def: "Max tokens a model can consider at once, in + out." },
  { term: "Temperature", def: "Sampling randomness knob: 0 = deterministic, 1+ = more creative/random." },
  { term: "Fine-tuning", def: "Further training a pre-trained model on a smaller, specific dataset." },
  { term: "RAG", def: "Retrieval-Augmented Generation — fetch external docs to ground the answer." },
  { term: "RLHF", def: "Reinforcement Learning from Human Feedback — aligns model outputs to preferences." },
  { term: "Diffusion model", def: "Generates data by learning to reverse a noise-adding process." },
  { term: "GAN", def: "Generator vs Discriminator networks trained adversarially." },
  { term: "VAE", def: "Encoder-decoder model with a probabilistic latent space." },
  { term: "LoRA", def: "Low-Rank Adaptation — efficient fine-tuning via small trainable matrices." },
  { term: "Zero-shot", def: "Asking the model to do a task with no examples given." },
  { term: "Few-shot", def: "Giving the model a few examples in the prompt before the real task." },
  { term: "Chain-of-thought", def: "Prompting the model to reason step-by-step before answering." },
  { term: "Hallucination", def: "Confident but false/fabricated model output." },
  { term: "Prompt injection", def: "An attack embedding hidden instructions in content the model reads." },
  { term: "Multimodal", def: "Handles more than one data type — text, image, audio, video together." },
  { term: "Agent", def: "An LLM that can plan and call tools/APIs to complete multi-step tasks." },
];

const BUILD_STEPS = [
  {
    step: "1. Define the problem & scope",
    detail: "Decide exactly what you want: a text chatbot, an image generator, a domain-specific assistant? This determines architecture, data, and compute budget.",
  },
  {
    step: "2. Collect & clean data",
    detail: "Gather a large, diverse, high-quality dataset (text corpora, image-caption pairs, etc.). Deduplicate, filter toxic/low-quality content, and balance sources.",
  },
  {
    step: "3. Choose an architecture",
    detail: "For text: a Transformer decoder. For images: a diffusion U-Net or GAN. Frameworks: PyTorch or JAX, with libraries like Hugging Face Transformers/Diffusers.",
  },
  {
    step: "4. Tokenize & preprocess",
    detail: "Train or reuse a tokenizer (BPE/SentencePiece) on your data so raw text becomes model-ready token IDs.",
  },
  {
    step: "5. Pre-train (or start from a base model)",
    detail: "Training from scratch needs massive compute (many GPUs/TPUs for weeks). Most practical projects instead start from an open base model (Llama, Mistral, Stable Diffusion) and adapt it.",
  },
  {
    step: "6. Fine-tune for your task",
    detail: "Use supervised fine-tuning on instruction/response pairs specific to your use case; consider LoRA/QLoRA to keep this cheap and fast on a single GPU.",
  },
  {
    step: "7. Align with feedback (optional but recommended)",
    detail: "Collect human preference data and apply RLHF or simpler techniques like DPO (Direct Preference Optimization) to make outputs more helpful and safe.",
  },
  {
    step: "8. Evaluate rigorously",
    detail: "Test with held-out benchmarks, perplexity, human evaluation, and red-teaming for safety issues and bias before deployment.",
  },
  {
    step: "9. Deploy & serve",
    detail: "Optimize with quantization (e.g. 4-bit/8-bit) and efficient serving frameworks (vLLM, TensorRT-LLM) so inference is fast and affordable.",
  },
  {
    step: "10. Monitor & iterate",
    detail: "Track real-world usage, gather new feedback, watch for drift or misuse, and continue refining the model over time.",
  },
];

const USE_CASES = [
  { title: "Customer support", body: "AI chat assistants resolve common queries instantly, escalate complex ones, and work 24/7 across languages." },
  { title: "Software development", body: "Code generation, debugging, refactoring, and test writing dramatically speed up developer workflows." },
  { title: "Content & marketing", body: "Drafting blogs, ad copy, social posts, and personalized email campaigns at scale." },
  { title: "Design & creative work", body: "Generating concept art, product mockups, storyboards, and marketing visuals from text prompts." },
  { title: "Healthcare & research", body: "Drug discovery (protein/molecule generation), medical note summarization, and literature review assistance." },
  { title: "Education", body: "Personalized tutoring, auto-generated practice questions, and instant explanations tailored to a learner's level." },
  { title: "Data & analytics", body: "Synthetic data generation for privacy-safe testing, and natural-language querying of databases." },
  { title: "Media & entertainment", body: "Script drafts, game dialogue, music composition, and video editing assistance." },
];

const GOOD_SIDE = [
  "Massive productivity boost across writing, coding, design, and research.",
  "Democratizes access to expertise — small teams get capabilities once reserved for large organizations.",
  "Accelerates scientific discovery (protein folding, materials science, drug design).",
  "Enables highly personalized education, accessibility tools, and creative expression.",
  "Automates repetitive tasks, freeing humans for higher-judgment work.",
];

const BAD_SIDE = [
  "Hallucinations — confident but false outputs, risky in medical/legal/financial contexts.",
  "Bias — models can reproduce and amplify biases present in training data.",
  "Job displacement concerns in content, support, and entry-level coding roles.",
  "Misuse potential — deepfakes, disinformation, spam, and phishing at scale.",
  "High compute & energy cost for training and running large models.",
  "Copyright and data-provenance questions around training data.",
  "Over-reliance risk — users trusting AI output without verification.",
];

const FUTURE_TRENDS = [
  "Smaller, more efficient models matching today's frontier performance (distillation, quantization).",
  "Deeper multimodality — seamless text, image, audio, video, and action in one model.",
  "More capable agents that plan, use tools, and complete multi-step real-world tasks.",
  "On-device generative AI for privacy and offline use (phones, laptops).",
  "Better alignment techniques (Constitutional AI, scalable oversight) as models grow more capable.",
  "Tighter regulation and standardized safety evaluations across major markets.",
];

/* ----------------------------- notes text for download ----------------------------- */

function buildNotesMarkdown() {
  const lines: string[] = [];
  lines.push("# Generative AI — Complete Notes\n");
  lines.push("## 1. What is Generative AI?");
  lines.push(
    "Generative AI (GenAI) refers to machine learning models that create new content — text, images, audio, video, or code — rather than only classifying or predicting labels for existing data. It learns the underlying patterns and distribution of training data well enough to produce novel, plausible samples.\n"
  );
  lines.push("## 2. Why use GenAI?");
  lines.push(
    "- Automates and accelerates creative and knowledge work\n- Lowers the cost of producing content, code, and designs\n- Enables natural-language interfaces to complex systems\n- Assists research, discovery, and personalization at scale\n"
  );
  lines.push("## 3. Why is it needed?");
  lines.push(
    "As data and tasks scale beyond manual human capacity, GenAI provides scalable assistance — from answering millions of support queries to exploring vast chemical/protein search spaces no human team could cover manually.\n"
  );
  lines.push("## 4. Types of Generative AI");
  GEN_TYPES.forEach((t) => {
    lines.push(`### ${t.title}`);
    lines.push(`${t.desc}`);
    lines.push(`Examples: ${t.examples}\n`);
  });
  lines.push("## 5. Key Formulas");
  FORMULAS.forEach((f) => {
    lines.push(`### ${f.label}`);
    lines.push("```");
    lines.push(f.formula);
    lines.push("```");
    lines.push(`${f.note}\n`);
  });
  lines.push("## 6. Detailed Notes by Topic");
  NOTES_TOPICS.forEach((n) => {
    lines.push(`### ${n.title}`);
    lines.push(`${n.body}\n`);
  });
  lines.push("## 7. Cheat Sheet");
  CHEATSHEET.forEach((c) => {
    lines.push(`- **${c.term}**: ${c.def}`);
  });
  lines.push("\n## 8. How to Build Your Own AI Model");
  BUILD_STEPS.forEach((s) => {
    lines.push(`### ${s.step}`);
    lines.push(`${s.detail}\n`);
  });
  lines.push("## 9. Use Cases");
  USE_CASES.forEach((u) => {
    lines.push(`- **${u.title}**: ${u.body}`);
  });
  lines.push("\n## 10. Good Side");
  GOOD_SIDE.forEach((g) => lines.push(`- ${g}`));
  lines.push("\n## 11. Bad Side / Risks");
  BAD_SIDE.forEach((b) => lines.push(`- ${b}`));
  lines.push("\n## 12. Future Trends");
  FUTURE_TRENDS.forEach((f) => lines.push(`- ${f}`));
  lines.push("\n---\nThanks for downloading these notes — happy learning!");
  return lines.join("\n");
}

/* ----------------------------- SVG sketches ----------------------------- */

function TransformerDiagram() {
  return (
    <svg viewBox="0 0 420 320" className="w-full h-auto" fill="none">
      <g stroke="currentColor" strokeWidth="1.5">
        <rect x="30" y="250" width="360" height="40" rx="6" />
        <text x="210" y="274" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none" fontFamily="monospace">
          Input tokens + positional encoding
        </text>

        <rect x="30" y="190" width="170" height="40" rx="6" />
        <text x="115" y="214" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" fontFamily="monospace">
          Self-Attention
        </text>

        <rect x="220" y="190" width="170" height="40" rx="6" />
        <text x="305" y="214" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" fontFamily="monospace">
          Feed-Forward
        </text>

        <rect x="30" y="130" width="170" height="40" rx="6" strokeDasharray="4 3" />
        <text x="115" y="154" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace">
          × N layers
        </text>

        <rect x="220" y="130" width="170" height="40" rx="6" strokeDasharray="4 3" />
        <text x="305" y="154" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace">
          Residual + Norm
        </text>

        <rect x="120" y="60" width="180" height="40" rx="6" />
        <text x="210" y="84" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none" fontFamily="monospace">
          softmax → next token
        </text>

        <line x1="210" y1="250" x2="210" y2="230" />
        <line x1="115" y1="190" x2="115" y2="170" />
        <line x1="305" y1="190" x2="305" y2="170" />
        <line x1="115" y1="130" x2="180" y2="100" />
        <line x1="305" y1="130" x2="250" y2="100" />
        <line x1="210" y1="60" x2="210" y2="40" />
      </g>
    </svg>
  );
}

function GanDiagram() {
  return (
    <svg viewBox="0 0 420 220" className="w-full h-auto" fill="none">
      <g stroke="currentColor" strokeWidth="1.5">
        <circle cx="60" cy="110" r="34" strokeDasharray="3 3" />
        <text x="60" y="114" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace">
          noise z
        </text>

        <rect x="140" y="80" width="100" height="60" rx="8" />
        <text x="190" y="115" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none" fontFamily="monospace">
          Generator
        </text>

        <rect x="290" y="80" width="100" height="60" rx="8" />
        <text x="340" y="108" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none" fontFamily="monospace">
          Discrimi-
        </text>
        <text x="340" y="124" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none" fontFamily="monospace">
          nator
        </text>

        <rect x="290" y="10" width="100" height="40" rx="6" strokeDasharray="3 3" />
        <text x="340" y="34" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace">
          real data
        </text>

        <line x1="94" y1="110" x2="140" y2="110" markerEnd="url(#arrow)" />
        <line x1="240" y1="110" x2="290" y2="110" markerEnd="url(#arrow)" />
        <line x1="340" y1="50" x2="340" y2="80" markerEnd="url(#arrow)" />
        <path d="M390 110 C 410 110, 410 170, 190 170 C 100 170, 100 150, 100 140" strokeDasharray="2 3" />
        <text x="250" y="185" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace">
          real vs fake feedback trains both networks
        </text>
      </g>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}

function DiffusionDiagram() {
  const steps = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 460 140" className="w-full h-auto" fill="none">
      <g stroke="currentColor" strokeWidth="1.5">
        {steps.map((i) => {
          const cx = 40 + i * 95;
          const noiseLevel = i / (steps.length - 1);
          return (
            <g key={i}>
              <rect
                x={cx - 30}
                y={40}
                width="60"
                height="60"
                rx="8"
                fillOpacity={0.15 + noiseLevel * 0.6}
                fill="currentColor"
              />
              <text x={cx} y="118" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace">
                {i === 0 ? "clean x₀" : i === steps.length - 1 ? "pure noise" : `step t${i}`}
              </text>
              {i < steps.length - 1 && (
                <line x1={cx + 30} y1="70" x2={cx + 65} y2="70" markerEnd="url(#arrow2)" />
              )}
            </g>
          );
        })}
        <text x="230" y="20" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" fontFamily="monospace">
          forward process: add noise →   |   reverse process: model removes noise ←
        </text>
      </g>
      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}

/* ----------------------------- main page ----------------------------- */

export default function GenAIPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleDownload() {
    const content = buildNotesMarkdown();
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "GenAI-Complete-Notes.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 4000);
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0D10] text-[#14171C] dark:text-[#E7E9EC] transition-colors duration-300">
      {/* ---------- hero ---------- */}
      <div className="border-b border-[#14171C]/10 dark:border-[#E7E9EC]/10">
        <div className="max-w-5xl mx-auto px-6 pt-14 pb-10">
          <p className="font-mono text-xs tracking-[0.25em] text-[#1F4FD8] dark:text-[#F5A623] mb-4">
            FIELD NOTES - GENERATIVE AI
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-semibold leading-[1.05] mb-5">
            Generative AI,
            <br />
            explained end to end.
          </h1>
          <p className="text-[#4B5563] dark:text-[#9AA3AF] text-base md:text-lg max-w-2xl leading-relaxed">
            What it is, why it matters, how the math works, how to build one yourself,
            and where the field is headed - all in one page, written like a proper
            notebook rather than a marketing brochure.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-md bg-[#1F4FD8] dark:bg-[#F5A623] text-white dark:text-[#0B0D10] font-medium px-5 py-3 text-sm hover:opacity-90 active:scale-[0.98] transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download GenAI notes
            </button>
            <span className="text-xs text-[#4B5563] dark:text-[#9AA3AF] font-mono">
              ~1,600 words · formulas · cheat sheet · build guide
            </span>
          </div>
        </div>
      </div>

      {/* ---------- sticky sub-nav ---------- */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#0B0D10]/90 backdrop-blur border-b border-[#14171C]/10 dark:border-[#E7E9EC]/10">
        <div className="max-w-5xl mx-auto px-6 overflow-x-auto">
          <div className="flex gap-1 py-2 min-w-max">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={
                  "font-mono text-xs px-3 py-2 rounded whitespace-nowrap transition-colors " +
                  (activeTab === t.id
                    ? "bg-[#1F4FD8] dark:bg-[#F5A623] text-white dark:text-[#0B0D10]"
                    : "text-[#4B5563] dark:text-[#9AA3AF] hover:bg-[#F7F7F5] dark:hover:bg-[#14171C]")
                }
              >
                <span className="opacity-60 mr-1">{t.eyebrow}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- content ---------- */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {activeTab === "overview" && (
          <Section id="overview" kicker="01" title="What is GenAI, why use it, why it's needed">
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              <Card>
                <h3 className="font-serif text-lg font-semibold mb-2">What is Generative AI?</h3>
                <p className="text-sm text-[#4B5563] dark:text-[#9AA3AF] leading-relaxed">
                  Generative AI is a class of machine learning models that create new,
                  original content — text, images, audio, video, or code — instead of
                  only labeling or predicting a category for existing input. It learns
                  the statistical patterns of huge datasets well enough to produce
                  brand-new samples that follow those same patterns.
                </p>
              </Card>
              <Card>
                <h3 className="font-serif text-lg font-semibold mb-2">Why use it?</h3>
                <p className="text-sm text-[#4B5563] dark:text-[#9AA3AF] leading-relaxed">
                  It compresses hours of writing, coding, designing, or researching into
                  seconds. A single model can draft an email, debug a function, design
                  an illustration, or summarize a 300-page report — all through plain
                  natural language.
                </p>
              </Card>
              <Card>
                <h3 className="font-serif text-lg font-semibold mb-2">Why is it needed?</h3>
                <p className="text-sm text-[#4B5563] dark:text-[#9AA3AF] leading-relaxed">
                  Data and tasks now scale far beyond what humans can process manually.
                  GenAI gives individuals and small teams the kind of leverage that used
                  to require entire departments — answering support tickets at scale,
                  scanning research literature, or exploring design variations instantly.
                </p>
              </Card>
              <Card>
                <h3 className="font-serif text-lg font-semibold mb-2">Discriminative vs Generative</h3>
                <p className="text-sm text-[#4B5563] dark:text-[#9AA3AF] leading-relaxed">
                  A discriminative model answers "is this spam or not?" A generative
                  model answers "write me an email like this" — it models the full data
                  distribution P(x), not just a decision boundary between classes.
                </p>
              </Card>
            </div>
          </Section>
        )}

        {activeTab === "types" && (
          <Section id="types" kicker="02" title="Types of Generative AI">
            <div className="grid md:grid-cols-2 gap-4">
              {GEN_TYPES.map((t) => (
                <Card key={t.title}>
                  <h3 className="font-semibold mb-1">{t.title}</h3>
                  <p className="text-sm text-[#4B5563] dark:text-[#9AA3AF] mb-2 leading-relaxed">{t.desc}</p>
                  <p className="font-mono text-xs text-[#1F4FD8] dark:text-[#F5A623]">{t.examples}</p>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {activeTab === "architecture" && (
          <Section id="architecture" kicker="03" title="Architectures & the formulas behind them">
            <p className="text-sm text-[#4B5563] dark:text-[#9AA3AF] mb-6 leading-relaxed max-w-2xl">
              Most modern GenAI systems are built from a handful of architectures:
              Transformers (text), Diffusion models (image/audio/video), GANs, and
              VAEs. Below are the formulas that actually run under the hood.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {FORMULAS.map((f) => (
                <Formula key={f.label} {...f} />
              ))}
            </div>
          </Section>
        )}

        {activeTab === "notes" && (
          <Section id="notes" kicker="04" title="Detailed notes — every core topic">
            <div className="space-y-3">
              {NOTES_TOPICS.map((n) => (
                <Accordion key={n.title} title={n.title}>
                  <p>{n.body}</p>
                </Accordion>
              ))}
            </div>
          </Section>
        )}

        {activeTab === "cheatsheet" && (
          <Section id="cheatsheet" kicker="05" title="Quick-reference cheat sheet">
            <div className="grid sm:grid-cols-2 gap-3">
              {CHEATSHEET.map((c) => (
                <div
                  key={c.term}
                  className="flex gap-3 rounded-md border border-[#14171C]/10 dark:border-[#E7E9EC]/12 bg-[#F7F7F5] dark:bg-[#14171C] p-3"
                >
                  <span className="font-mono text-xs font-semibold text-[#1F4FD8] dark:text-[#F5A623] shrink-0 w-28">
                    {c.term}
                  </span>
                  <span className="text-sm text-[#4B5563] dark:text-[#9AA3AF]">{c.def}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {activeTab === "diagrams" && (
          <Section id="diagrams" kicker="06" title="Diagrams & sketches">
            <div className="space-y-8">
              <Card>
                <h3 className="font-serif text-lg font-semibold mb-3">Transformer (text generation) — sketch</h3>
                <div className="text-[#1F4FD8] dark:text-[#F5A623]">
                  <TransformerDiagram />
                </div>
              </Card>
              <Card>
                <h3 className="font-serif text-lg font-semibold mb-3">GAN — Generator vs Discriminator</h3>
                <div className="text-[#1F4FD8] dark:text-[#F5A623]">
                  <GanDiagram />
                </div>
              </Card>
              <Card>
                <h3 className="font-serif text-lg font-semibold mb-3">Diffusion — forward & reverse process</h3>
                <div className="text-[#1F4FD8] dark:text-[#F5A623]">
                  <DiffusionDiagram />
                </div>
              </Card>
            </div>
          </Section>
        )}

        {activeTab === "build" && (
          <Section id="build" kicker="07" title="How to create / make your own AI model">
            <div className="space-y-3">
              {BUILD_STEPS.map((s) => (
                <Card key={s.step} className="flex flex-col gap-1">
                  <h3 className="font-semibold">{s.step}</h3>
                  <p className="text-sm text-[#4B5563] dark:text-[#9AA3AF] leading-relaxed">{s.detail}</p>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {activeTab === "blog" && (
          <Section id="blog" kicker="08" title="Blog — use cases in the real world">
            <p className="text-sm text-[#4B5563] dark:text-[#9AA3AF] mb-6 max-w-2xl leading-relaxed">
              GenAI has moved from research labs into everyday tools in under three
              years. Here's where it's already changing how people work:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {USE_CASES.map((u) => (
                <Card key={u.title}>
                  <h3 className="font-semibold mb-1">{u.title}</h3>
                  <p className="text-sm text-[#4B5563] dark:text-[#9AA3AF] leading-relaxed">{u.body}</p>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {activeTab === "future" && (
          <Section id="future" kicker="09" title="Good side, bad side, and what's next">
            <div className="grid md:grid-cols-2 gap-5 mb-8">
              <Card>
                <h3 className="font-serif text-lg font-semibold mb-3 text-[#1F4FD8] dark:text-[#F5A623]">
                  The good
                </h3>
                <ul className="space-y-2 text-sm text-[#4B5563] dark:text-[#9AA3AF]">
                  {GOOD_SIDE.map((g) => (
                    <li key={g} className="flex gap-2">
                      <span>+</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <h3 className="font-serif text-lg font-semibold mb-3 text-[#B5471B] dark:text-[#E06C3C]">
                  The bad
                </h3>
                <ul className="space-y-2 text-sm text-[#4B5563] dark:text-[#9AA3AF]">
                  {BAD_SIDE.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span>−</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
            <Card>
              <h3 className="font-serif text-lg font-semibold mb-3">Where it's headed</h3>
              <ul className="space-y-2 text-sm text-[#4B5563] dark:text-[#9AA3AF]">
                {FUTURE_TRENDS.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="font-mono text-[#1F4FD8] dark:text-[#F5A623]">→</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Section>
        )}

        {/* ---------- bottom download CTA (repeated for convenience) ---------- */}
        <div className="mt-4 border-t border-[#14171C]/10 dark:border-[#E7E9EC]/10 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-semibold mb-1">Take these notes with you</h3>
            <p className="text-sm text-[#4B5563] dark:text-[#9AA3AF]">
              Every section on this page, bundled into a single Markdown file.
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-md bg-[#1F4FD8] dark:bg-[#F5A623] text-white dark:text-[#0B0D10] font-medium px-5 py-3 text-sm hover:opacity-90 active:scale-[0.98] transition shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download GenAI notes
          </button>
        </div>
      </div>

      {/* ---------- thank-you toast ---------- */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 rounded-md bg-[#14171C] dark:bg-[#F5A623] text-white dark:text-[#0B0D10] px-5 py-3 shadow-lg text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Thanks for downloading the GenAI notes - happy learning! 🎉
          </div>
        </div>
      )}
    </main>
  );
}