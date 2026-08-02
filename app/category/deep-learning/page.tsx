"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Brain,
  Cpu,
  Download,
  BookOpen,
  Layers,
  GitBranch,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  FileText,
  ChevronRight,
  Terminal,
  Sigma,
  Network,
  Rocket,
  Newspaper,
  Wrench,
  ClipboardList,
  Eye,
  Boxes,
  ArrowRight,
  Check,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Animation variants                                                        */
/* -------------------------------------------------------------------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* -------------------------------------------------------------------------- */
/*  Nav sections                                                              */
/* -------------------------------------------------------------------------- */

type SectionId =
  | "overview"
  | "why"
  | "types"
  | "math"
  | "notes"
  | "cheatsheet"
  | "diagrams"
  | "build"
  | "blog"
  | "future";

const sections: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: Brain },
  { id: "why", label: "Why Deep Learning", icon: Zap },
  { id: "types", label: "Types of Networks", icon: Layers },
  { id: "math", label: "Formulas & Math", icon: Sigma },
  { id: "notes", label: "Detailed Notes", icon: BookOpen },
  { id: "cheatsheet", label: "Cheat Sheet", icon: ClipboardList },
  { id: "diagrams", label: "Diagrams & Sketches", icon: Network },
  { id: "build", label: "Build Your Own Model", icon: Wrench },
  { id: "blog", label: "Blog & Use Cases", icon: Newspaper },
  { id: "future", label: "Good, Bad & Future", icon: Rocket },
];

/* -------------------------------------------------------------------------- */
/*  Small UI primitives                                                       */
/* -------------------------------------------------------------------------- */

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0d1117] p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function TerminalChrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-black/10 dark:border-white/10">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
      <span className="ml-2 font-mono text-xs text-black/50 dark:text-white/40">
        {title}
      </span>
    </div>
  );
}

function Formula({ label, expr }: { label: string; expr: string }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] p-4">
      <p className="text-xs uppercase tracking-wide text-black/50 dark:text-white/40 mb-2">
        {label}
      </p>
      <p className="font-mono text-sm sm:text-base text-amber-700 dark:text-[#34d399] overflow-x-auto whitespace-pre">
        {expr}
      </p>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-amber-600/30 dark:border-[#34d399]/30 bg-amber-50 dark:bg-[#34d399]/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-[#34d399]">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Notes markdown (single source of truth so on-screen notes and the         */
/*  downloadable .md file always match)                                      */
/* -------------------------------------------------------------------------- */

const NOTES_MARKDOWN = `# Deep Learning — Complete Notes
CodeNFacts | category/deep-learning

## 1. What is Deep Learning?
Deep Learning (DL) is a subfield of Machine Learning that uses artificial neural
networks with many layers ("deep" networks) to automatically learn hierarchical
representations of data. Instead of hand-crafting features, a deep network learns
low-level features (edges, textures) in early layers and combines them into
high-level concepts (faces, objects, words, intent) in deeper layers.

Formally, DL learns a function F(x) = fL( ... f2( f1(x) ) ... ) where each fi is a
layer applying a linear transform followed by a non-linear activation.

## 2. Why Deep Learning is Used
- Automatic feature extraction — no manual feature engineering needed.
- Scales extremely well with more data and more compute (unlike classical ML,
  which plateaus).
- State-of-the-art performance on vision, speech, language, and generative tasks.
- Can model highly non-linear, high-dimensional relationships.
- End-to-end learning: raw pixels/text/audio in, predictions out.

## 3. Why We "Need" It
Classical ML (SVMs, decision trees, hand-crafted features) breaks down when:
- Data is unstructured (images, audio, raw text, video).
- Relationships between inputs and outputs are highly non-linear.
- The feature space is too large/complex for a human to engineer by hand.
DL removes the feature-engineering bottleneck and lets the model discover its
own representations directly from raw data.

## 4. Types of Neural Networks
1. ANN / MLP (Multi-Layer Perceptron) — fully connected layers, tabular data.
2. CNN (Convolutional Neural Network) — images, spatial data, uses convolution
   + pooling.
3. RNN (Recurrent Neural Network) — sequential data, keeps a hidden state over
   time steps.
4. LSTM / GRU — gated variants of RNNs that solve vanishing-gradient issues for
   long sequences.
5. Transformer — attention-based architecture, backbone of modern LLMs (GPT,
   BERT, LLaMA, Gemini, Claude).
6. Autoencoder — learns compressed (latent) representation, used for denoising,
   anomaly detection, dimensionality reduction.
7. GAN (Generative Adversarial Network) — a generator and discriminator trained
   adversarially, used for image synthesis.
8. Diffusion Models — iteratively denoise random noise into data, power modern
   image/video generation (Stable Diffusion, Sora-style models).
9. GNN (Graph Neural Network) — operates on graph-structured data (social
   networks, molecules).

## 5. Core Formulas

### Neuron output
z = (w · x) + b
a = activation(z)

### Common activation functions
Sigmoid:  σ(x) = 1 / (1 + e^(-x))
Tanh:     tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))
ReLU:     f(x) = max(0, x)
Leaky ReLU: f(x) = x if x > 0 else αx
Softmax:  softmax(x_i) = e^(x_i) / Σ_j e^(x_j)

### Loss functions
Mean Squared Error:      MSE = (1/n) Σ (y_i − ŷ_i)²
Binary Cross-Entropy:    L = −[y·log(ŷ) + (1−y)·log(1−ŷ)]
Categorical Cross-Entropy: L = −Σ y_i · log(ŷ_i)

### Gradient descent (parameter update)
θ = θ − η · ∇θ J(θ)
  θ  = parameters (weights, biases)
  η  = learning rate
  J  = cost/loss function

### Backpropagation (chain rule)
∂L/∂w = (∂L/∂a) · (∂a/∂z) · (∂z/∂w)

### Convolution operation (CNN)
Output size = ((W − F + 2P) / S) + 1
  W = input width, F = filter size, P = padding, S = stride

### Batch Normalization
x̂ = (x − μ_B) / sqrt(σ_B² + ε);   y = γ·x̂ + β

### Dropout
During training, each neuron is kept with probability p (independently), and
its output is scaled by 1/p at train time (inverted dropout) so inference needs
no rescaling.

### Adam optimizer
m_t = β1·m_(t-1) + (1−β1)·g_t
v_t = β2·v_(t-1) + (1−β2)·g_t²
θ_t = θ_(t-1) − η · m̂_t / (sqrt(v̂_t) + ε)

## 6. Training Pipeline (end to end)
1. Collect & preprocess data (normalize, augment, split train/val/test).
2. Initialize weights (e.g., Xavier/He initialization).
3. Forward pass: compute predictions layer by layer.
4. Compute loss against ground truth.
5. Backward pass: compute gradients via backpropagation.
6. Update weights using an optimizer (SGD, Adam, RMSprop).
7. Repeat for many epochs, monitoring validation loss to avoid overfitting.
8. Evaluate on the held-out test set; tune hyperparameters; deploy.

## 7. Regularization Techniques
- L1 / L2 weight regularization (penalize large weights).
- Dropout (randomly disable neurons during training).
- Early stopping (stop when validation loss stops improving).
- Data augmentation (flip/rotate/crop images, back-translate text).
- Batch normalization (stabilizes and speeds up training).

## 8. How to Build Your Own AI Model (Practical Roadmap)
1. Define the problem clearly: classification, regression, generation, etc.
2. Gather and clean a labeled dataset (or use a public dataset).
3. Choose a baseline architecture matching your data type (MLP for tabular,
   CNN for images, Transformer for text/sequences).
4. Pick a framework: PyTorch or TensorFlow/Keras.
5. Split data into train/validation/test sets (e.g., 70/15/15).
6. Train a small baseline model first — confirm the pipeline works before
   scaling up.
7. Tune hyperparameters: learning rate, batch size, number of layers, dropout.
8. Track experiments (loss/accuracy curves) and watch for overfitting.
9. Evaluate with the right metric (accuracy, F1, BLEU, IoU — depends on task).
10. Export the model (ONNX, TorchScript, SavedModel) and deploy via an API.
11. Monitor the model in production and retrain as new data arrives.

## 9. Use Cases
- Computer vision: object detection, medical imaging, self-driving perception.
- NLP: chatbots, translation, summarization, sentiment analysis, code generation.
- Speech: voice assistants, transcription, text-to-speech.
- Generative AI: image/video/music generation, synthetic data.
- Recommendation systems: personalized feeds, product recommendations.
- Healthcare: diagnosis assistance, drug discovery.
- Finance: fraud detection, algorithmic trading signals.
- Robotics: perception + control for autonomous agents.

## 10. Good Sides
- Extremely high accuracy on complex, unstructured data.
- Learns features automatically — less manual work.
- General-purpose: the same core techniques apply across domains.
- Improves as more data and compute are available.

## 11. Bad Sides / Limitations
- Requires large labeled datasets and significant compute (cost + energy).
- Acts as a "black box" — hard to fully explain predictions.
- Prone to overfitting on small datasets.
- Sensitive to biased training data (can amplify societal bias).
- Vulnerable to adversarial inputs (small perturbations can fool models).

## 12. The Future of Deep Learning
- More efficient architectures (smaller models, same or better performance).
- Multimodal models that combine text, image, audio, and video seamlessly.
- On-device / edge deep learning for privacy and low latency.
- Better interpretability and safety tooling.
- Continued growth of foundation models fine-tuned for narrow tasks.

## 13. Quick Cheat Sheet
- MLP -> tabular data
- CNN -> images
- RNN/LSTM/GRU -> sequences (older approach)
- Transformer -> sequences/text/multimodal (current standard)
- Autoencoder -> compression, denoising, anomaly detection
- GAN / Diffusion -> generation
- ReLU -> default hidden-layer activation
- Softmax -> multi-class output layer
- Sigmoid -> binary output layer
- Adam -> default optimizer to start with
- Cross-entropy -> default loss for classification
- MSE -> default loss for regression

---
Downloaded from CodeNFacts — Deep Learning category page.
Thanks for learning with us. Happy building!
`;

/* -------------------------------------------------------------------------- */
/*  Data for on-screen "Detailed Notes" (topic accordion)                    */
/* -------------------------------------------------------------------------- */

const detailedTopics = [
  {
    title: "1. What is Deep Learning?",
    body:
      "Deep Learning is a subfield of Machine Learning built on artificial neural networks with many stacked layers. Each layer transforms its input and passes it forward, so early layers learn simple patterns (edges, word co-occurrences) while deeper layers combine those into complex concepts (objects, meaning, intent). The word 'deep' simply refers to the number of layers stacked between input and output.",
    example:
      "Example: a CNN classifying cats vs dogs first detects edges and textures in layer 1, shapes like ears and eyes in layer 3, and full cat/dog patterns in the final layers.",
  },
  {
    title: "2. Why Deep Learning is Used",
    body:
      "Deep Learning removes the need for manual feature engineering. In classical ML, a human decides which features matter (e.g., 'edge count' for image tasks). In DL, the network discovers the best features on its own directly from raw data, and performance keeps improving as you add more data and compute — something classical ML can't do as well.",
    example:
      "Example: instead of manually coding 'look for whiskers' to detect cats, a CNN learns whisker-like patterns automatically from thousands of labeled cat images.",
  },
  {
    title: "3. Why We Need It",
    body:
      "Many real-world problems involve unstructured, high-dimensional data — images, audio, video, free-form text — where relationships are highly non-linear. Classical algorithms struggle here because they need pre-defined features. Deep networks, with enough layers and data, can approximate almost any function, making them essential for vision, speech, and language problems.",
    example:
      "Example: predicting the next word in a sentence depends on long-range context that's very hard to hand-engineer — Transformers learn this relationship directly from text.",
  },
  {
    title: "4. Perceptron & the Neuron Model",
    body:
      "The basic unit, a neuron, computes a weighted sum of its inputs plus a bias, then applies a non-linear activation function. Stacking many neurons in a layer, and many layers, gives the network the capacity to represent complex functions. Without the non-linear activation, stacking layers would collapse into a single linear transform.",
    example: "z = (w·x) + b, then a = activation(z). A single neuron with a sigmoid activation is exactly logistic regression.",
  },
  {
    title: "5. Activation Functions",
    body:
      "Activations introduce non-linearity. ReLU is the default for hidden layers because it's cheap and avoids vanishing gradients for positive inputs. Sigmoid squashes output to (0,1), useful for binary probabilities. Softmax converts a vector of scores into a probability distribution for multi-class outputs. Tanh is zero-centered, sometimes preferred over sigmoid in hidden layers of older architectures.",
    example: "Example: an image classifier with 10 classes uses ReLU in hidden layers and Softmax in the final layer to output 10 probabilities that sum to 1.",
  },
  {
    title: "6. Forward Propagation",
    body:
      "Forward propagation is the process of passing input data through each layer in sequence, applying weights, biases, and activations, until the final output (prediction) is produced.",
    example: "Example: input pixels -> conv layer -> ReLU -> pooling -> ... -> fully connected -> softmax -> predicted class probabilities.",
  },
  {
    title: "7. Loss Functions",
    body:
      "A loss function measures how wrong the model's prediction is compared to the true label. Regression tasks typically use Mean Squared Error; classification tasks use Cross-Entropy. The loss is the single number the entire training process tries to minimize.",
    example: "Example: predicting house prices uses MSE; predicting an email is spam/not-spam uses Binary Cross-Entropy.",
  },
  {
    title: "8. Backpropagation",
    body:
      "Backpropagation computes how much each weight contributed to the final error, using the chain rule of calculus, working backward from the output layer to the input layer. These per-weight gradients are then used by an optimizer to update the weights.",
    example: "Example: if a specific weight barely affects the loss, its gradient is near zero and it barely changes during an update.",
  },
  {
    title: "9. Optimizers",
    body:
      "Optimizers decide how weights are updated using the gradients from backpropagation. Plain SGD (Stochastic Gradient Descent) updates in the direction of the negative gradient. Adam combines momentum (tracking a moving average of past gradients) with adaptive per-parameter learning rates, which is why it's the most common default optimizer today.",
    example: "Example: Adam typically converges faster than plain SGD on the same network, though well-tuned SGD with momentum can sometimes generalize slightly better.",
  },
  {
    title: "10. CNNs (Convolutional Neural Networks)",
    body:
      "CNNs use small learnable filters (kernels) that slide across an image, detecting local patterns like edges and textures. Pooling layers (e.g., max pooling) reduce spatial size while keeping the strongest signals. Because filters are shared across the whole image, CNNs need far fewer parameters than a fully connected network for the same image size.",
    example: "Example: a 3x3 filter sliding over a 224x224 image detects the same 'vertical edge' pattern no matter where it appears in the image.",
  },
  {
    title: "11. RNNs, LSTMs & GRUs",
    body:
      "RNNs process sequences one step at a time, carrying a hidden state forward so earlier inputs can influence later predictions. Plain RNNs struggle with long sequences due to vanishing gradients. LSTMs and GRUs add gating mechanisms (input/forget/output gates) that let the network selectively remember or forget information over long time spans.",
    example: "Example: an LSTM reading a paragraph can still 'remember' the subject of the first sentence by the last sentence, where a plain RNN would have forgotten it.",
  },
  {
    title: "12. Transformers & Attention",
    body:
      "Transformers replaced recurrence with self-attention: every token in a sequence directly looks at every other token and learns how much to 'attend' to it, regardless of distance. This makes training highly parallelizable and captures long-range dependencies far better than RNNs. Transformers are the backbone of nearly all modern large language and multimodal models.",
    example: "Example: in 'The trophy didn't fit in the suitcase because it was too big', attention lets the model correctly link 'it' to 'trophy', not 'suitcase'.",
  },
  {
    title: "13. Autoencoders",
    body:
      "An autoencoder learns to compress input into a smaller latent representation (encoder) and then reconstruct the original input from that representation (decoder). The bottleneck forces the network to learn the most important underlying features of the data.",
    example: "Example: autoencoders trained on normal transactions will reconstruct fraud transactions poorly, flagging them as anomalies.",
  },
  {
    title: "14. GANs & Diffusion Models",
    body:
      "GANs train two networks against each other: a generator that creates fake samples, and a discriminator that tries to tell real from fake — improving both over time. Diffusion models instead learn to gradually remove noise from a corrupted image step by step until a clean, realistic image emerges. Diffusion models currently dominate high-quality image and video generation.",
    example: "Example: Stable Diffusion turns a text prompt into an embedding, then iteratively denoises random noise into an image matching that prompt.",
  },
  {
    title: "15. Overfitting, Underfitting & Regularization",
    body:
      "Overfitting happens when a model memorizes training data but fails to generalize to new data (low train loss, high validation loss). Underfitting happens when the model is too simple to capture the pattern at all (high loss on both). Regularization techniques — dropout, L2 weight decay, early stopping, data augmentation — combat overfitting.",
    example: "Example: a model with 99% training accuracy but 60% validation accuracy is overfitting; adding dropout and more training data usually helps.",
  },
  {
    title: "16. Hyperparameters",
    body:
      "Hyperparameters are settings chosen before training (not learned by the model): learning rate, batch size, number of layers/neurons, dropout rate, number of epochs. Getting these right often matters as much as the architecture itself.",
    example: "Example: a learning rate that's too high causes loss to bounce around or explode; too low makes training painfully slow.",
  },
  {
    title: "17. Evaluation Metrics",
    body:
      "The right metric depends on the task: accuracy and F1-score for classification (F1 matters more with imbalanced classes), precision/recall for detection tasks, BLEU/ROUGE for text generation, IoU (Intersection over Union) for object detection/segmentation.",
    example: "Example: for rare fraud detection (1% positive class), accuracy is misleading — F1-score or recall is a far better indicator of real performance.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Cheat sheet data                                                          */
/* -------------------------------------------------------------------------- */

const cheatSheetGroups = [
  {
    heading: "Pick the right architecture",
    rows: [
      ["Tabular / structured data", "MLP (fully connected network)"],
      ["Images", "CNN"],
      ["Sequences (legacy)", "RNN / LSTM / GRU"],
      ["Sequences / text / multimodal (current)", "Transformer"],
      ["Compression, denoising, anomaly detection", "Autoencoder"],
      ["Generating realistic images/video", "GAN or Diffusion Model"],
      ["Graph-structured data (molecules, social graphs)", "GNN"],
    ],
  },
  {
    heading: "Pick the right activation",
    rows: [
      ["Hidden layers (default)", "ReLU"],
      ["Hidden layers, avoid dead neurons", "Leaky ReLU"],
      ["Binary output", "Sigmoid"],
      ["Multi-class output", "Softmax"],
      ["Older RNN hidden layers", "Tanh"],
    ],
  },
  {
    heading: "Pick the right loss",
    rows: [
      ["Regression", "MSE / MAE"],
      ["Binary classification", "Binary Cross-Entropy"],
      ["Multi-class classification", "Categorical Cross-Entropy"],
      ["Generation (GAN)", "Adversarial loss"],
    ],
  },
  {
    heading: "Fighting overfitting",
    rows: [
      ["Small dataset", "Data augmentation, transfer learning"],
      ["Model memorizing training data", "Dropout, L2 regularization"],
      ["Validation loss rising", "Early stopping"],
      ["Unstable training", "Batch normalization, lower learning rate"],
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function DeepLearningPage() {
  const [active, setActive] = useState<SectionId>("overview");
  const [openTopic, setOpenTopic] = useState<number | null>(0);
  const [showThanks, setShowThanks] = useState(false);
  const thanksTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (thanksTimeout.current) clearTimeout(thanksTimeout.current);
    };
  }, []);

  function handleDownload() {
    const blob = new Blob([NOTES_MARKDOWN], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CodeNFacts-Deep-Learning-Notes.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowThanks(true);
    if (thanksTimeout.current) clearTimeout(thanksTimeout.current);
    thanksTimeout.current = setTimeout(() => setShowThanks(false), 4200);
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0a0e14] text-black/85 dark:text-white/90 transition-colors">
      {/* ---------------------------------------------------------------- */}
      {/* Thank-you toast on download                                      */}
      {/* ---------------------------------------------------------------- */}
      <AnimatePresence>
        {showThanks && (
          <motion.div
            initial={{ opacity: 0, y: -16, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -16, x: "-50%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 z-[100] w-[92%] sm:w-auto"
          >
            <div className="flex items-center gap-3 rounded-xl border border-amber-600/30 dark:border-[#34d399]/30 bg-white dark:bg-[#0d1117] shadow-lg shadow-black/10 dark:shadow-black/40 px-4 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-[#34d399]/15 text-amber-700 dark:text-[#34d399]">
                <Check className="h-4 w-4" />
              </span>
              <div className="text-sm">
                <p className="font-semibold">Thanks for downloading! 🎉</p>
                <p className="text-black/60 dark:text-white/50">
                  Your Deep Learning notes are on their way. Happy learning with CodeNFacts!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0d1117]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="flex items-center gap-2 mb-4"
          >
            <Pill>
              <Terminal className="h-3 w-3 mr-1" /> Deep Learning
            </Pill>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="font-mono text-3xl sm:text-5xl font-bold tracking-tight"
          >
            Deep Learning,{" "}
            <span className="text-amber-700 dark:text-[#34d399]">explained end to end.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-4 max-w-2xl text-black/65 dark:text-white/60 text-base sm:text-lg"
          >
            What it is, why it exists, every architecture, the core formulas, a
            full cheat sheet, diagrams, a practical guide to building your own
            model, and where the field is headed next - all in one page.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 dark:bg-[#34d399] px-5 py-2.5 text-sm font-semibold text-white dark:text-[#0a0e14] hover:opacity-90 active:scale-[0.98] transition"
            >
              <Download className="h-4 w-4" />
              Download Deep Learning Notes
            </button>
            <span className="text-xs text-black/50 dark:text-white/40">
              .md file · ~2 min read setup · free
            </span>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Body: sidebar + content                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar nav */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition border ${
                    isActive
                      ? "bg-amber-600 dark:bg-[#34d399] text-white dark:text-[#0a0e14] border-transparent"
                      : "border-black/10 dark:border-white/10 text-black/65 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              transition={{ duration: 0.3 }}
            >
              {active === "overview" && <OverviewSection />}
              {active === "why" && <WhySection />}
              {active === "types" && <TypesSection />}
              {active === "math" && <MathSection />}
              {active === "notes" && (
                <NotesSection openTopic={openTopic} setOpenTopic={setOpenTopic} />
              )}
              {active === "cheatsheet" && <CheatSheetSection />}
              {active === "diagrams" && <DiagramsSection />}
              {active === "build" && <BuildSection />}
              {active === "blog" && <BlogSection />}
              {active === "future" && <FutureSection />}
            </motion.div>
          </AnimatePresence>

          {/* Bottom download CTA repeated for convenience */}
          <Panel className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-700 dark:text-[#34d399]" />
                Want this whole page as notes?
              </p>
              <p className="text-sm text-black/60 dark:text-white/50 mt-1">
                Grab the full Deep Learning notes as a Markdown file you can keep,
                print, or paste anywhere.
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 dark:bg-[#34d399] px-4 py-2.5 text-sm font-semibold text-white dark:text-[#0a0e14] hover:opacity-90 active:scale-[0.98] transition shrink-0"
            >
              <Download className="h-4 w-4" />
              Download Notes
            </button>
          </Panel>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Overview                                                        */
/* -------------------------------------------------------------------------- */

function OverviewSection() {
  return (
    <div className="space-y-6">
      <Panel>
        <TerminalChrome title="overview.md" />
        <h2 className="text-xl font-bold mb-3">What is Deep Learning?</h2>
        <p className="text-black/70 dark:text-white/65 leading-relaxed">
          Deep Learning is a subfield of Machine Learning that uses artificial
          neural networks with many stacked layers to automatically learn
          hierarchical representations of data. Rather than a human deciding
          which features matter, a deep network discovers them on its own —
          early layers learn simple patterns like edges or word pairs, and
          deeper layers combine those into complex concepts like objects,
          sentiment, or meaning.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>Neural Networks</Pill>
          <Pill>Representation Learning</Pill>
          <Pill>End-to-End Learning</Pill>
          <Pill>Non-linear Modeling</Pill>
        </div>
      </Panel>

      <Panel>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Boxes className="h-4 w-4 text-amber-700 dark:text-[#34d399]" />
          How it fits with AI and ML
        </h3>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-[#0a0e14]">
            <p className="font-semibold mb-1">Artificial Intelligence</p>
            <p className="text-black/60 dark:text-white/50">
              The broad goal: machines performing tasks that need human-like
              intelligence.
            </p>
          </div>
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-[#0a0e14]">
            <p className="font-semibold mb-1">Machine Learning</p>
            <p className="text-black/60 dark:text-white/50">
              A subset of AI where systems learn patterns from data instead of
              explicit rules.
            </p>
          </div>
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-[#0a0e14]">
            <p className="font-semibold mb-1">Deep Learning</p>
            <p className="text-black/60 dark:text-white/50">
              A subset of ML using multi-layer neural networks to learn features
              automatically.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Why                                                             */
/* -------------------------------------------------------------------------- */

function WhySection() {
  const points = [
    {
      title: "Automatic feature extraction",
      body: "No need to hand-craft features — the network learns what matters directly from raw data.",
    },
    {
      title: "Scales with data & compute",
      body: "Unlike classical ML, performance keeps improving as you feed in more data and use more compute.",
    },
    {
      title: "Handles unstructured data",
      body: "Images, audio, video, and free-form text are difficult for classical algorithms but natural for deep networks.",
    },
    {
      title: "State-of-the-art results",
      body: "Vision, speech, translation, and generative tasks are currently dominated by deep learning approaches.",
    },
  ];

  const needPoints = [
    "Classical ML plateaus on unstructured, high-dimensional data.",
    "Manually engineering features for images/audio/text is impractical at scale.",
    "Real-world relationships are often highly non-linear.",
    "Modern applications (chatbots, recommendation, vision) need models that generalize across huge, varied inputs.",
  ];

  return (
    <div className="space-y-6">
      <Panel>
        <TerminalChrome title="why-deep-learning.md" />
        <h2 className="text-xl font-bold mb-4">Why Deep Learning is Used</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {points.map((p, i) => (
            <div
              key={p.title}
              className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-[#0a0e14]"
            >
              <p className="font-semibold flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-amber-700 dark:text-[#34d399]" />
                {p.title}
              </p>
              <p className="text-sm text-black/60 dark:text-white/50">{p.body}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <h3 className="font-semibold mb-3">Why We Actually Need It</h3>
        <ul className="space-y-2">
          {needPoints.map((n) => (
            <li key={n} className="flex items-start gap-2 text-sm text-black/70 dark:text-white/60">
              <ChevronRight className="h-4 w-4 mt-0.5 text-amber-700 dark:text-[#34d399] shrink-0" />
              {n}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Types                                                           */
/* -------------------------------------------------------------------------- */

const networkTypes = [
  { name: "ANN / MLP", use: "Tabular data, basic classification/regression", detail: "Fully connected layers; the simplest deep network." },
  { name: "CNN", use: "Images, video frames, spatial data", detail: "Convolution + pooling layers detect local patterns like edges and textures." },
  { name: "RNN", use: "Sequences (legacy)", detail: "Maintains a hidden state across time steps; struggles with long sequences." },
  { name: "LSTM / GRU", use: "Long sequences, time series", detail: "Gated RNN variants that solve vanishing-gradient issues." },
  { name: "Transformer", use: "Text, multimodal, current SOTA", detail: "Self-attention lets every token look at every other token directly." },
  { name: "Autoencoder", use: "Compression, denoising, anomaly detection", detail: "Encoder compresses input; decoder reconstructs it from the bottleneck." },
  { name: "GAN", use: "Realistic image/video generation", detail: "Generator vs discriminator trained adversarially." },
  { name: "Diffusion Model", use: "Modern image/video generation", detail: "Learns to iteratively denoise random noise into realistic data." },
  { name: "GNN", use: "Graphs: molecules, social networks", detail: "Passes messages between connected nodes to learn graph structure." },
];

function TypesSection() {
  return (
    <div className="space-y-6">
      <Panel>
        <TerminalChrome title="types-of-networks.md" />
        <h2 className="text-xl font-bold mb-4">Types of Neural Networks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-black/10 dark:border-white/10">
                <th className="py-2 pr-4 font-semibold">Type</th>
                <th className="py-2 pr-4 font-semibold">Best for</th>
                <th className="py-2 font-semibold">Key idea</th>
              </tr>
            </thead>
            <tbody>
              {networkTypes.map((t) => (
                <tr key={t.name} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-3 pr-4 font-medium text-amber-700 dark:text-[#34d399] whitespace-nowrap">
                    {t.name}
                  </td>
                  <td className="py-3 pr-4 text-black/70 dark:text-white/60">{t.use}</td>
                  <td className="py-3 text-black/60 dark:text-white/50">{t.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Math / Formulas                                                 */
/* -------------------------------------------------------------------------- */

function MathSection() {
  return (
    <div className="space-y-6">
      <Panel>
        <TerminalChrome title="formulas.md" />
        <h2 className="text-xl font-bold mb-4">Core Formulas</h2>

        <p className="text-sm font-semibold text-black/60 dark:text-white/50 mb-2">Neuron & activations</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <Formula label="Neuron output" expr={"z = (w · x) + b\na = activation(z)"} />
          <Formula label="Sigmoid" expr={"σ(x) = 1 / (1 + e^(-x))"} />
          <Formula label="Tanh" expr={"tanh(x) = (e^x - e^-x) / (e^x + e^-x)"} />
          <Formula label="ReLU" expr={"f(x) = max(0, x)"} />
          <Formula label="Leaky ReLU" expr={"f(x) = x if x > 0 else α·x"} />
          <Formula label="Softmax" expr={"softmax(x_i) = e^(x_i) / Σ e^(x_j)"} />
        </div>

        <p className="text-sm font-semibold text-black/60 dark:text-white/50 mb-2">Loss functions</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <Formula label="Mean Squared Error" expr={"MSE = (1/n) Σ (y_i − ŷ_i)²"} />
          <Formula label="Binary Cross-Entropy" expr={"L = −[y·log(ŷ) + (1−y)·log(1−ŷ)]"} />
          <Formula label="Categorical Cross-Entropy" expr={"L = − Σ y_i · log(ŷ_i)"} />
        </div>

        <p className="text-sm font-semibold text-black/60 dark:text-white/50 mb-2">Optimization</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <Formula label="Gradient Descent update" expr={"θ = θ − η · ∇θ J(θ)"} />
          <Formula label="Backprop (chain rule)" expr={"∂L/∂w = (∂L/∂a)(∂a/∂z)(∂z/∂w)"} />
          <Formula
            label="Adam optimizer"
            expr={
              "m_t = β1·m_(t-1) + (1−β1)·g_t\nv_t = β2·v_(t-1) + (1−β2)·g_t²\nθ_t = θ_(t-1) − η·m̂_t / (√v̂_t + ε)"
            }
          />
          <Formula label="Batch Normalization" expr={"x̂ = (x − μ_B)/√(σ_B² + ε)\ny = γ·x̂ + β"} />
        </div>

        <p className="text-sm font-semibold text-black/60 dark:text-white/50 mb-2">CNN</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Formula label="Conv output size" expr={"Out = ((W − F + 2P)/S) + 1"} />
        </div>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Detailed Notes (accordion)                                      */
/* -------------------------------------------------------------------------- */

function NotesSection({
  openTopic,
  setOpenTopic,
}: {
  openTopic: number | null;
  setOpenTopic: (n: number | null) => void;
}) {
  return (
    <div className="space-y-6">
      <Panel>
        <TerminalChrome title="detailed-notes.md" />
        <h2 className="text-xl font-bold mb-1">Detailed Notes</h2>
        <p className="text-sm text-black/55 dark:text-white/45 mb-4">
          Every core topic, explained with a worked example. Tap a topic to expand it.
        </p>

        <div className="space-y-2">
          {detailedTopics.map((topic, i) => {
            const isOpen = openTopic === i;
            return (
              <div
                key={topic.title}
                className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] overflow-hidden"
              >
                <button
                  onClick={() => setOpenTopic(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="font-medium text-sm sm:text-base">{topic.title}</span>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 text-amber-700 dark:text-[#34d399] transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4"
                    >
                      <p className="pb-3 text-sm text-black/70 dark:text-white/60 leading-relaxed">
                        {topic.body}
                      </p>
                      <div className="mb-4 rounded-lg bg-[#f7f8fa] dark:bg-[#0d1117] border border-black/10 dark:border-white/10 p-3 text-xs text-black/60 dark:text-white/50">
                        {topic.example}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Cheat Sheet                                                     */
/* -------------------------------------------------------------------------- */

function CheatSheetSection() {
  return (
    <div className="space-y-6">
      <Panel>
        <TerminalChrome title="cheatsheet.md" />
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-amber-700 dark:text-[#34d399]" />
          Deep Learning Cheat Sheet
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {cheatSheetGroups.map((group) => (
            <div
              key={group.heading}
              className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] p-4"
            >
              <p className="font-semibold mb-3 text-sm">{group.heading}</p>
              <ul className="space-y-2">
                {group.rows.map(([k, v]) => (
                  <li key={k} className="flex items-start justify-between gap-3 text-xs sm:text-sm">
                    <span className="text-black/55 dark:text-white/45">{k}</span>
                    <span className="text-right font-medium text-amber-700 dark:text-[#34d399]">
                      {v}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <p className="font-semibold mb-2 text-sm">"IMP" quick-recall list</p>
        <div className="flex flex-wrap gap-2">
          {[
            "ReLU = default hidden activation",
            "Softmax = multi-class output",
            "Adam = default optimizer",
            "Cross-entropy = classification loss",
            "MSE = regression loss",
            "Dropout = fight overfitting",
            "BatchNorm = stabilize training",
            "CNN = images",
            "Transformer = text/multimodal",
          ].map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Diagrams & Sketches (inline SVG, theme-aware)                   */
/* -------------------------------------------------------------------------- */

function DiagramsSection() {
  return (
    <div className="space-y-6">
      <Panel>
        <TerminalChrome title="neural-network.svg" />
        <h2 className="text-xl font-bold mb-4">Diagrams & Sketches</h2>

        <p className="text-sm font-semibold mb-2">1. A basic feed-forward network</p>
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] p-4 mb-6 overflow-x-auto">
          <svg viewBox="0 0 620 220" className="w-full min-w-[480px] h-auto">
            {[
              { x: 60, ys: [50, 110, 170], label: "Input" },
              { x: 250, ys: [30, 80, 130, 180], label: "Hidden 1" },
              { x: 400, ys: [50, 110, 170], label: "Hidden 2" },
              { x: 550, ys: [90, 140], label: "Output" },
            ].map((layer, li, arr) => (
              <g key={layer.label}>
                {li < arr.length - 1 &&
                  layer.ys.flatMap((y1) =>
                    arr[li + 1].ys.map((y2, k2) => (
                      <line
                        key={`${y1}-${k2}`}
                        x1={layer.x + 10}
                        y1={y1}
                        x2={arr[li + 1].x - 10}
                        y2={y2}
                        stroke="currentColor"
                        strokeOpacity={0.15}
                        className="text-black dark:text-white"
                        strokeWidth={1}
                      />
                    ))
                  )}
                {layer.ys.map((y) => (
                  <circle
                    key={y}
                    cx={layer.x}
                    cy={y}
                    r={10}
                    className="fill-amber-500 dark:fill-[#34d399]"
                    fillOpacity={0.85}
                  />
                ))}
                <text
                  x={layer.x}
                  y={205}
                  textAnchor="middle"
                  className="fill-black/50 dark:fill-white/40 text-[11px]"
                  fontFamily="monospace"
                >
                  {layer.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <p className="text-sm font-semibold mb-2">2. Training loop</p>
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] p-4 mb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono">
            {["Input Data", "Forward Pass", "Compute Loss", "Backprop", "Update Weights"].map(
              (step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-lg border border-amber-600/30 dark:border-[#34d399]/30 bg-amber-50 dark:bg-[#34d399]/10 px-3 py-1.5 text-amber-700 dark:text-[#34d399]">
                    {step}
                  </span>
                  {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-black/30 dark:text-white/30" />}
                </div>
              )
            )}
          </div>
          <p className="text-xs text-black/45 dark:text-white/35 mt-3">
            Loop repeats for every batch, across every epoch, until the model converges.
          </p>
        </div>

        <p className="text-sm font-semibold mb-2">3. CNN pipeline sketch</p>
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono">
            {["Image", "Conv + ReLU", "Pooling", "Conv + ReLU", "Pooling", "Flatten", "Fully Connected", "Softmax"].map(
              (step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-lg border border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0d1117] px-3 py-1.5">
                    {step}
                  </span>
                  {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-black/30 dark:text-white/30" />}
                </div>
              )
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Build Your Own Model                                            */
/* -------------------------------------------------------------------------- */

const buildSteps = [
  { title: "Define the problem", body: "Classification, regression, or generation? Be precise about inputs and outputs before writing any code." },
  { title: "Gather & clean data", body: "Collect a labeled dataset (or use a public one). Handle missing values, normalize numeric features, remove duplicates." },
  { title: "Pick an architecture", body: "MLP for tabular data, CNN for images, Transformer for text/sequences — match the architecture to the data type." },
  { title: "Choose a framework", body: "PyTorch or TensorFlow/Keras are the two mainstream choices; PyTorch is generally preferred for research and flexibility." },
  { title: "Split your data", body: "Typically 70% train / 15% validation / 15% test, keeping the test set untouched until final evaluation." },
  { title: "Train a small baseline first", body: "Confirm the full pipeline (data loading, training loop, evaluation) works correctly before scaling up model size." },
  { title: "Tune hyperparameters", body: "Learning rate, batch size, depth, dropout rate — adjust based on training/validation curves." },
  { title: "Evaluate properly", body: "Pick a metric that matches the task (F1 for imbalanced classes, BLEU for translation, IoU for detection)." },
  { title: "Export & deploy", body: "Export to ONNX/TorchScript/SavedModel, wrap in an API, and serve it to your application." },
  { title: "Monitor & retrain", body: "Track real-world performance and retrain periodically as new data becomes available (data drift)." },
];

function BuildSection() {
  return (
    <div className="space-y-6">
      <Panel>
        <TerminalChrome title="build-your-own-model.sh" />
        <h2 className="text-xl font-bold mb-1">How to Build Your Own AI Model</h2>
        <p className="text-sm text-black/55 dark:text-white/45 mb-5">
          A practical, order-matters roadmap from problem definition to deployment.
        </p>
        <ol className="space-y-3">
          {buildSteps.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] p-4"
            >
              <span className="shrink-0 h-7 w-7 rounded-full bg-amber-600 dark:bg-[#34d399] text-white dark:text-[#0a0e14] text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-sm">{step.title}</p>
                <p className="text-sm text-black/60 dark:text-white/50 mt-0.5">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel>
        <p className="font-semibold mb-2 text-sm flex items-center gap-2">
          <Cpu className="h-4 w-4 text-amber-700 dark:text-[#34d399]" />
          Minimal PyTorch skeleton
        </p>
        <pre className="rounded-xl bg-[#f7f8fa] dark:bg-[#0d1117] border border-black/10 dark:border-white/10 p-4 text-xs sm:text-sm overflow-x-auto font-mono leading-relaxed">
{`import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self, in_dim, hidden, out_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden),
            nn.ReLU(),
            nn.Linear(hidden, out_dim),
        )

    def forward(self, x):
        return self.net(x)

model = SimpleNet(in_dim=20, hidden=64, out_dim=2)
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for epoch in range(epochs):
    optimizer.zero_grad()
    preds = model(x_batch)
    loss = loss_fn(preds, y_batch)
    loss.backward()
    optimizer.step()`}
        </pre>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Blog & Use Cases                                                */
/* -------------------------------------------------------------------------- */

const useCases = [
  { title: "Computer Vision", body: "Object detection, medical imaging analysis, self-driving perception, face recognition." },
  { title: "Natural Language Processing", body: "Chatbots, translation, summarization, sentiment analysis, code generation." },
  { title: "Speech", body: "Voice assistants, real-time transcription, text-to-speech synthesis." },
  { title: "Generative AI", body: "Image, video, and music generation; synthetic training data creation." },
  { title: "Recommendation Systems", body: "Personalized feeds and product recommendations at platforms like Netflix, YouTube, Amazon." },
  { title: "Healthcare", body: "Diagnosis assistance from scans, drug discovery, patient risk prediction." },
  { title: "Finance", body: "Fraud detection, credit risk scoring, algorithmic trading signals." },
  { title: "Robotics", body: "Perception and control pipelines for autonomous robots and drones." },
];

function BlogSection() {
  return (
    <div className="space-y-6">
      <Panel>
        <TerminalChrome title="blog.md" />
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-amber-700 dark:text-[#34d399]" />
          Deep Learning: from perceptrons to foundation models
        </h2>
        <p className="text-sm text-black/70 dark:text-white/60 leading-relaxed mb-3">
          Deep Learning didn't arrive overnight. The perceptron was proposed in
          1958, but it took three ingredients coming together decades later —
          much larger datasets, much cheaper GPU compute, and better training
          tricks like ReLU and dropout — for deep networks to start beating
          every other approach on vision and language benchmarks.
        </p>
        <p className="text-sm text-black/70 dark:text-white/60 leading-relaxed mb-3">
          The 2012 ImageNet result from a deep CNN (AlexNet) is often cited as
          the moment the field tipped: a large drop in image classification
          error compared to every classical method that came before it. From
          there, CNNs took over vision, LSTMs took over sequence modeling for a
          while, and then in 2017 the Transformer architecture reframed
          sequence modeling around attention instead of recurrence — a shift
          that eventually produced today's large language and multimodal
          models.
        </p>
        <p className="text-sm text-black/70 dark:text-white/60 leading-relaxed">
          The throughline across all of it is representation learning: instead
          of telling the model what to look for, you give it enough data and
          layers, and it works out the useful representations itself.
        </p>
      </Panel>

      <Panel>
        <h3 className="font-semibold mb-3">Use Cases Across Industries</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {useCases.map((u) => (
            <div
              key={u.title}
              className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0e14] p-4"
            >
              <p className="font-medium text-sm mb-1">{u.title}</p>
              <p className="text-xs text-black/60 dark:text-white/50">{u.body}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Good, Bad & Future                                              */
/* -------------------------------------------------------------------------- */

const goodSides = [
  "Extremely high accuracy on complex, unstructured data (images, audio, text).",
  "Learns features automatically — far less manual engineering required.",
  "General-purpose: the same core techniques transfer across very different domains.",
  "Keeps improving as more data and compute become available.",
];

const badSides = [
  "Needs large labeled datasets and significant compute (cost + energy).",
  "Acts like a black box — predictions are hard to fully explain.",
  "Prone to overfitting on small datasets.",
  "Can amplify bias present in training data.",
  "Vulnerable to adversarial inputs — small, crafted perturbations can fool it.",
];

const futurePoints = [
  "More efficient architectures — smaller models matching today's larger ones.",
  "Multimodal models that natively combine text, image, audio, and video.",
  "On-device / edge deep learning for privacy and low latency.",
  "Stronger interpretability and safety tooling as models get more capable.",
  "Foundation models fine-tuned cheaply for many narrow, specialized tasks.",
];

function FutureSection() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <Panel>
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-emerald-700 dark:text-[#34d399]">
            <CheckCircle2 className="h-5 w-5" />
            Good Sides
          </h3>
          <ul className="space-y-2">
            {goodSides.map((g) => (
              <li key={g} className="flex items-start gap-2 text-sm text-black/70 dark:text-white/60">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600 dark:text-[#34d399] shrink-0" />
                {g}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
            <XCircle className="h-5 w-5" />
            Bad Sides / Limitations
          </h3>
          <ul className="space-y-2">
            {badSides.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-black/70 dark:text-white/60">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-red-500 dark:text-red-400 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-amber-700 dark:text-[#34d399]" />
          The Future of Deep Learning
        </h3>
        <ul className="space-y-2">
          {futurePoints.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-black/70 dark:text-white/60">
              <TrendingUp className="h-4 w-4 mt-0.5 text-amber-700 dark:text-[#34d399] shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Eye className="h-5 w-5 text-amber-700 dark:text-[#34d399]" />
          Where DL fits vs. classical ML - quick take
        </h3>
        <p className="text-sm text-black/70 dark:text-white/60 leading-relaxed">
          Deep Learning isn't a universal replacement for classical ML. For
          small, structured, tabular datasets, gradient-boosted trees often
          still outperform deep networks with less tuning and compute. Deep
          Learning earns its cost on unstructured, high-dimensional data -
          images, audio, video, and language - where classical feature
          engineering simply can't keep up.
        </p>
      </Panel>
    </div>
  );
}