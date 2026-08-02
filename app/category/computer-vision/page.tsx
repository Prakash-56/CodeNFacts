"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Eye,
  Layers,
  Sigma,
  BookOpen,
  Download,
  Rocket,
  Newspaper,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  ChevronRight,
  Camera,
  Cpu,
  GitBranch,
  Sparkles,
  X,
  ScanLine,
  Boxes,
  Workflow,
  Brain,
  Grid3x3,
  Target,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Shared animation variant                                          */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

/* ------------------------------------------------------------------ */
/*  Static content                                                    */
/* ------------------------------------------------------------------ */

type TabId =
  | "overview"
  | "types"
  | "formulas"
  | "notes"
  | "cheatsheet"
  | "diagrams"
  | "build"
  | "blog"
  | "proscons";

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "types", label: "Types of CV", icon: Boxes },
  { id: "formulas", label: "Formulas", icon: Sigma },
  { id: "notes", label: "Detailed Notes", icon: BookOpen },
  { id: "cheatsheet", label: "Cheat Sheet", icon: ScanLine },
  { id: "diagrams", label: "Diagrams & Sketches", icon: Workflow },
  { id: "build", label: "Build Your Own Model", icon: Rocket },
  { id: "blog", label: "Blog", icon: Newspaper },
  { id: "proscons", label: "Good vs Bad", icon: GitBranch },
];

const CV_TYPES = [
  {
    title: "Image Classification",
    desc: "Assigns a single label to an entire image, e.g. 'cat' vs 'dog'. Backbone of most CV pipelines (ResNet, VGG, EfficientNet).",
    example: "Sorting product photos into categories on an e-commerce site.",
  },
  {
    title: "Object Detection",
    desc: "Locates and classifies multiple objects in an image using bounding boxes. Models: YOLO, Faster R-CNN, SSD, DETR.",
    example: "Detecting pedestrians, cars, and traffic signs for self-driving cars.",
  },
  {
    title: "Semantic Segmentation",
    desc: "Classifies every pixel into a category, but does not separate individual instances. Models: U-Net, DeepLab, FCN.",
    example: "Labeling road, sky, and building pixels in a street scene.",
  },
  {
    title: "Instance Segmentation",
    desc: "Like semantic segmentation, but distinguishes between separate objects of the same class. Models: Mask R-CNN.",
    example: "Outlining each individual person in a crowd photo separately.",
  },
  {
    title: "Face Recognition & Verification",
    desc: "Detects, aligns, and matches human faces against a database using embeddings. Models: FaceNet, ArcFace.",
    example: "Unlocking a phone with Face ID.",
  },
  {
    title: "Pose Estimation",
    desc: "Predicts key body joints (skeleton) of humans or objects in an image or video. Models: OpenPose, MediaPipe Pose.",
    example: "Tracking a gym-goer's squat form in a fitness app.",
  },
  {
    title: "Optical Character Recognition (OCR)",
    desc: "Extracts machine-readable text from images or scanned documents. Tools: Tesseract, EasyOCR, PaddleOCR.",
    example: "Scanning a receipt to auto-fill an expense report.",
  },
  {
    title: "Video Analysis / Action Recognition",
    desc: "Understands temporal patterns across frames — motion, activity, tracking. Models: 3D-CNN, SlowFast, ViViT.",
    example: "Detecting a shoplifting action in CCTV footage.",
  },
  {
    title: "3D Vision & Depth Estimation",
    desc: "Reconstructs depth or 3D structure from 2D images, stereo pairs, or LiDAR. Models: MiDaS, NeRF, monocular depth nets.",
    example: "AR apps placing furniture realistically in your room.",
  },
  {
    title: "Generative Vision",
    desc: "Creates or transforms images: GANs, Diffusion Models, style transfer, super-resolution, inpainting.",
    example: "Turning a text prompt into an image (text-to-image diffusion).",
  },
];

const FORMULAS = [
  {
    name: "2D Convolution",
    formula: "(I * K)(x, y) = ΣᵢΣⱼ I(x+i, y+j) · K(i, j)",
    note: "Slides a kernel K over image I, computing a weighted sum at each position. Core operation of a CNN.",
  },
  {
    name: "Output Feature Map Size",
    formula: "O = ⌊ (W − K + 2P) / S ⌋ + 1",
    note: "W = input size, K = kernel size, P = padding, S = stride.",
  },
  {
    name: "Max / Average Pooling",
    formula: "MaxPool(R) = max(R)      AvgPool(R) = (1/n) Σ Rᵢ",
    note: "Downsamples a region R of the feature map to reduce spatial size and add translation invariance.",
  },
  {
    name: "Intersection over Union (IoU)",
    formula: "IoU = Area(Box_pred ∩ Box_gt) / Area(Box_pred ∪ Box_gt)",
    note: "Measures bounding-box overlap quality. IoU ≥ 0.5 is commonly treated as a 'correct' detection.",
  },
  {
    name: "Precision, Recall, F1",
    formula: "P = TP/(TP+FP)   R = TP/(TP+FN)   F1 = 2PR/(P+R)",
    note: "Standard classification/detection metrics. TP/FP/FN = true positive / false positive / false negative.",
  },
  {
    name: "Mean Average Precision (mAP)",
    formula: "mAP = (1/N) Σ AP_c   for c = 1..N classes",
    note: "Average of per-class Average Precision (area under Precision-Recall curve). Standard detection benchmark metric.",
  },
  {
    name: "Softmax",
    formula: "σ(z)ᵢ = e^{zᵢ} / Σⱼ e^{zⱼ}",
    note: "Converts raw logits into a probability distribution over classes for classification output layers.",
  },
  {
    name: "Cross-Entropy Loss",
    formula: "L = − Σᵢ yᵢ · log(ŷᵢ)",
    note: "Compares predicted probability ŷ against true one-hot label y. Standard loss for classification/segmentation.",
  },
  {
    name: "Sobel Edge Gradient",
    formula: "G = √(Gx² + Gy²)      θ = atan2(Gy, Gx)",
    note: "Gx, Gy from horizontal/vertical Sobel kernels detect intensity changes → edges.",
  },
  {
    name: "Image Normalization",
    formula: "x' = (x − μ) / σ",
    note: "Per-channel mean/std normalization (e.g. ImageNet mean [0.485,0.456,0.406]) stabilizes training.",
  },
  {
    name: "Non-Max Suppression (NMS) rule",
    formula: "Keep box if IoU(box, best_box) < threshold, else suppress",
    note: "Removes duplicate overlapping bounding boxes after detection, keeping the highest-confidence one.",
  },
];

const NOTES_SECTIONS = [
  {
    title: "1. What is Computer Vision?",
    body: "Computer Vision (CV) is the field of AI that teaches machines to interpret and understand visual data — images and video — the way humans do, but computationally. It converts pixels into structured information: labels, boxes, masks, coordinates, or embeddings that downstream systems can act on.",
  },
  {
    title: "2. Why do we need Computer Vision?",
    body: "Cameras and sensors generate more visual data every day than humans could ever manually review. CV automates visual understanding at scale — for safety (self-driving cars), efficiency (automated quality inspection), accessibility (scene description for the visually impaired), security (surveillance, biometric auth), and convenience (photo search, AR filters).",
  },
  {
    title: "3. Why is it used (core motivations)",
    body: "• Automation of repetitive visual inspection tasks.\n• Real-time decision making (robotics, autonomous vehicles).\n• Unlocking unstructured visual data (medical scans, satellite imagery) for analytics.\n• Enabling natural human-computer interaction (gesture, face, gaze).\n• Powering generative and creative tools (image synthesis, editing).",
  },
  {
    title: "4. The Classical CV Pipeline (pre-deep-learning)",
    body: "Image Acquisition → Preprocessing (denoise, normalize) → Feature Extraction (SIFT, HOG, ORB, edge detectors) → Feature Matching/Classification (SVM, k-NN) → Post-processing. Still used for lightweight embedded or explainable tasks.",
  },
  {
    title: "5. The Deep Learning CV Pipeline (modern)",
    body: "Image Acquisition → Preprocessing/Augmentation → CNN/Transformer Backbone (feature extraction) → Task Head (classification / detection / segmentation) → Loss + Backprop (training) → Inference + Post-processing (NMS, thresholding).",
  },
  {
    title: "6. Convolutional Neural Networks (CNNs)",
    body: "A CNN applies learnable filters (kernels) over an image to detect patterns — edges in early layers, shapes in middle layers, objects in deep layers. Key components: Convolution layers, Activation (ReLU), Pooling (Max/Avg), Batch Normalization, Fully Connected layers, Softmax output. Example architectures: LeNet, AlexNet, VGG, ResNet (skip connections solve vanishing gradients), Inception, EfficientNet.",
  },
  {
    title: "7. Vision Transformers (ViT)",
    body: "Splits an image into fixed-size patches, treats each patch as a 'token' (like a word), and applies the Transformer self-attention mechanism. Excels with large datasets and captures global context better than CNNs, which are locally biased.",
  },
  {
    title: "8. Data Preprocessing & Augmentation",
    body: "Resize, normalize (mean/std), and augment (flip, rotate, crop, color-jitter, Mixup, CutMix, mosaic) to increase dataset diversity and reduce overfitting, especially with small datasets.",
  },
  {
    title: "9. Transfer Learning",
    body: "Instead of training from scratch, reuse a backbone pre-trained on a huge dataset (ImageNet, COCO) and fine-tune the final layers on your smaller, task-specific dataset. Drastically reduces data and compute requirements.",
  },
  {
    title: "10. Object Detection Deep Dive",
    body: "Two-stage detectors (Faster R-CNN): propose regions, then classify/refine — accurate but slower. One-stage detectors (YOLO, SSD): predict boxes + classes directly in a single pass — much faster, good for real-time. Anchor boxes, IoU, and Non-Max Suppression are central concepts.",
  },
  {
    title: "11. Segmentation Deep Dive",
    body: "U-Net's encoder-decoder with skip connections is the gold standard for medical image segmentation. Mask R-CNN extends Faster R-CNN with a parallel mask-prediction branch for instance segmentation.",
  },
  {
    title: "12. Evaluation Metrics",
    body: "Classification: Accuracy, Precision, Recall, F1, Confusion Matrix. Detection: IoU, mAP@0.5, mAP@0.5:0.95. Segmentation: Pixel Accuracy, Dice Coefficient, mean IoU (mIoU).",
  },
  {
    title: "13. Real-World Example Walkthrough",
    body: "Example — Defect detection on a factory line: 1) Capture images with a fixed camera. 2) Preprocess (crop ROI, normalize lighting). 3) Feed into a fine-tuned ResNet/YOLO trained on 'defect' vs 'ok' labels. 4) Output bounding boxes with confidence. 5) Trigger a reject-arm on the conveyor if confidence > threshold.",
  },
  {
    title: "14. Tools & Frameworks",
    body: "Libraries: OpenCV (classical CV), PyTorch/TensorFlow (deep learning), Ultralytics YOLO, Detectron2, MediaPipe (real-time perception), Hugging Face Transformers (ViT/CLIP models).",
  },
];

const CHEATSHEET = [
  {
    group: "Core Building Blocks",
    items: [
      "Convolution → extracts local patterns",
      "ReLU → adds non-linearity, f(x) = max(0, x)",
      "Pooling → downsamples, adds invariance",
      "Batch Norm → stabilizes/speeds training",
      "Fully Connected → final decision layer",
    ],
  },
  {
    group: "Model Cheat Codes",
    items: [
      "Small dataset? → Use transfer learning",
      "Need real-time? → YOLO / MobileNet / SSD",
      "Need max accuracy, offline ok? → Faster R-CNN / ViT",
      "Pixel-level output? → U-Net / DeepLab / Mask R-CNN",
      "Overfitting? → More augmentation + dropout + early stopping",
    ],
  },
  {
    group: "Metrics At a Glance",
    items: [
      "Classification → Accuracy / F1",
      "Detection → mAP@0.5:0.95",
      "Segmentation → mIoU / Dice",
      "Face verification → Cosine similarity of embeddings",
    ],
  },
  {
    group: "Common Kernels",
    items: [
      "Identity: [[0,0,0],[0,1,0],[0,0,0]]",
      "Edge (Sobel-X): [[-1,0,1],[-2,0,2],[-1,0,1]]",
      "Blur (Box 3x3): all values = 1/9",
      "Sharpen: [[0,-1,0],[-1,5,-1],[0,-1,0]]",
    ],
  },
];

const BUILD_STEPS = [
  {
    step: "1. Define the problem",
    detail: "Classification, detection, or segmentation? What exact classes/objects matter? What's the real-time constraint?",
  },
  {
    step: "2. Collect & label data",
    detail: "Gather images covering all real-world variations (lighting, angle, background). Label with tools like LabelImg, CVAT, or Roboflow. Aim for balanced classes.",
  },
  {
    step: "3. Preprocess & augment",
    detail: "Resize to a fixed input size, normalize pixel values, apply augmentations (flip, rotate, brightness jitter) to expand effective dataset size.",
  },
  {
    step: "4. Choose a base architecture",
    detail: "Start from a pre-trained backbone (ResNet50, EfficientNet, YOLOv8) instead of training from scratch — this is transfer learning.",
  },
  {
    step: "5. Fine-tune the model",
    detail: "Freeze early layers, replace/train the final head on your labeled data. Use a small learning rate (e.g. 1e-4) so pre-trained knowledge isn't destroyed.",
  },
  {
    step: "6. Evaluate rigorously",
    detail: "Split data into train/val/test. Track loss curves, confusion matrix, mAP/F1. Watch for overfitting (train accuracy high, val accuracy low).",
  },
  {
    step: "7. Optimize for deployment",
    detail: "Quantize or prune the model (ONNX, TensorRT, TFLite) for edge devices. Benchmark FPS/latency on target hardware.",
  },
  {
    step: "8. Deploy & monitor",
    detail: "Wrap the model behind an API (FastAPI/Flask) or embed it on-device. Log predictions and periodically retrain on new data (data drift).",
  },
];

const BLOG_POSTS = [
  {
    title: "Why Computer Vision is the 'Eyes' of Modern AI",
    excerpt:
      "From unlocking your phone to guiding a surgical robot, CV has quietly become the sense organ of intelligent systems. This post breaks down why visual understanding is such a hard, and valuable, problem to solve.",
  },
  {
    title: "CNNs vs Vision Transformers: Which Should You Learn First?",
    excerpt:
      "CNNs are data-efficient and battle-tested; ViTs scale better with huge datasets and attention. We compare training cost, accuracy, and when each shines.",
  },
  {
    title: "Real-World Use Cases You Didn't Know Used Computer Vision",
    excerpt:
      "Warehouse robots counting stock, agriculture drones spotting crop disease, sports analytics tracking ball trajectories — CV is everywhere, often invisibly.",
  },
  {
    title: "The Future of Computer Vision: Multimodal & On-Device AI",
    excerpt:
      "Models like CLIP fuse vision with language. Meanwhile, chip-level acceleration (NPUs) is pushing heavy CV models directly onto phones and cameras, cutting cloud dependency.",
  },
];

const USE_CASES = [
  "Autonomous vehicles (lane detection, obstacle avoidance)",
  "Medical imaging (tumor detection, X-ray triage)",
  "Retail (shelf monitoring, cashier-less checkout)",
  "Agriculture (crop health, yield estimation via drones)",
  "Security & surveillance (intrusion detection, crowd counting)",
  "Manufacturing (defect detection, robotic pick-and-place)",
  "AR/VR (hand tracking, scene reconstruction)",
  "Document processing (OCR, form parsing)",
];

const PROS = [
  "Automates tedious visual inspection at superhuman speed and scale.",
  "Works 24/7 without fatigue — consistent accuracy over time.",
  "Enables entirely new products: AR filters, self-driving cars, visual search.",
  "Can detect patterns invisible or too subtle for the human eye (e.g. early tumor signs).",
  "Rapidly improving via transfer learning — small teams can build strong models cheaply.",
];

const CONS = [
  "Requires large, well-labeled datasets — labeling is expensive and slow.",
  "Bias in training data leads to biased predictions (e.g. face recognition accuracy gaps across skin tones).",
  "Vulnerable to adversarial attacks — tiny pixel perturbations can fool models.",
  "Privacy concerns — surveillance and facial recognition can be misused.",
  "High compute cost for training/serving large models; environmental footprint.",
  "Struggles with distribution shift — a model trained in one setting may fail in a new environment.",
];

/* ------------------------------------------------------------------ */
/*  Notes compiler for download                                       */
/* ------------------------------------------------------------------ */

function buildNotesMarkdown() {
  const lines: string[] = [];
  lines.push("# CodeNFacts — Computer Vision Notes\n");
  lines.push("_Generated from the CodeNFacts Computer Vision category page._\n");

  lines.push("## Types of Computer Vision\n");
  CV_TYPES.forEach((t) => {
    lines.push(`### ${t.title}`);
    lines.push(t.desc);
    lines.push(`Example: ${t.example}\n`);
  });

  lines.push("## Key Formulas\n");
  FORMULAS.forEach((f) => {
    lines.push(`### ${f.name}`);
    lines.push("```");
    lines.push(f.formula);
    lines.push("```");
    lines.push(f.note + "\n");
  });

  lines.push("## Detailed Notes\n");
  NOTES_SECTIONS.forEach((n) => {
    lines.push(`### ${n.title}`);
    lines.push(n.body + "\n");
  });

  lines.push("## Cheat Sheet\n");
  CHEATSHEET.forEach((c) => {
    lines.push(`### ${c.group}`);
    c.items.forEach((i) => lines.push(`- ${i}`));
    lines.push("");
  });

  lines.push("## How to Build Your Own Computer Vision Model\n");
  BUILD_STEPS.forEach((b) => {
    lines.push(`**${b.step}** — ${b.detail}`);
  });

  lines.push("\n## Use Cases\n");
  USE_CASES.forEach((u) => lines.push(`- ${u}`));

  lines.push("\n## Good Side\n");
  PROS.forEach((p) => lines.push(`- ${p}`));

  lines.push("\n## Bad Side / Challenges\n");
  CONS.forEach((c) => lines.push(`- ${c}`));

  lines.push("\n---\nThanks for learning with CodeNFacts! 🎉\n");
  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/*  Small reusable panel wrapper (terminal-chrome header motif)        */
/* ------------------------------------------------------------------ */

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: any;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117] shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0a0e14]">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <div className="ml-2 flex items-center gap-1.5 text-xs font-mono text-black/60 dark:text-white/50">
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span>{title}</span>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagram components (inline SVG sketches)                          */
/* ------------------------------------------------------------------ */

function CNNPipelineDiagram() {
  const stages = ["Input Image", "Conv + ReLU", "Pooling", "Conv + ReLU", "Pooling", "Fully Connected", "Softmax Output"];
  return (
    <svg viewBox="0 0 980 160" className="w-full h-auto">
      {stages.map((s, i) => {
        const x = 20 + i * 140;
        return (
          <g key={s}>
            <rect
              x={x}
              y={50}
              width={110}
              height={60}
              rx={10}
              className="fill-amber-100 dark:fill-emerald-500/10 stroke-amber-500 dark:stroke-emerald-400"
              strokeWidth={1.5}
            />
            <text
              x={x + 55}
              y={84}
              textAnchor="middle"
              className="fill-black dark:fill-white"
              fontSize="11"
              fontFamily="monospace"
            >
              {s}
            </text>
            {i < stages.length - 1 && (
              <line
                x1={x + 110}
                y1={80}
                x2={x + 140}
                y2={80}
                className="stroke-black/40 dark:stroke-white/40"
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-black/40 dark:fill-white/40" />
        </marker>
      </defs>
    </svg>
  );
}

function ConvolutionDiagram() {
  const grid = [
    [1, 0, 1, 0, 2],
    [0, 2, 1, 0, 1],
    [1, 1, 0, 2, 0],
    [0, 1, 2, 1, 0],
    [2, 0, 1, 0, 1],
  ];
  return (
    <svg viewBox="0 0 400 220" className="w-full h-auto">
      {grid.map((row, r) =>
        row.map((val, c) => (
          <g key={`${r}-${c}`}>
            <rect
              x={c * 40}
              y={r * 40}
              width={40}
              height={40}
              className={
                r >= 1 && r <= 2 && c >= 1 && c <= 2
                  ? "fill-amber-200 dark:fill-emerald-500/25 stroke-amber-600 dark:stroke-emerald-400"
                  : "fill-[#f7f8fa] dark:fill-[#0a0e14] stroke-black/10 dark:stroke-white/10"
              }
              strokeWidth={1}
            />
            <text
              x={c * 40 + 20}
              y={r * 40 + 24}
              textAnchor="middle"
              fontSize="13"
              fontFamily="monospace"
              className="fill-black dark:fill-white"
            >
              {val}
            </text>
          </g>
        ))
      )}
      <text x={0} y={215} fontSize="11" fontFamily="monospace" className="fill-black/60 dark:fill-white/50">
        Highlighted 2x2 patch = kernel window sliding over the image
      </text>
    </svg>
  );
}

function IoUDiagram() {
  return (
    <svg viewBox="0 0 300 180" className="w-full h-auto">
      <rect x={30} y={30} width={140} height={100} rx={4} className="fill-none stroke-amber-500 dark:stroke-emerald-400" strokeWidth={2} />
      <rect x={90} y={60} width={140} height={100} rx={4} className="fill-none stroke-black/50 dark:stroke-white/50" strokeWidth={2} strokeDasharray="6 4" />
      <text x={35} y={22} fontSize="11" fontFamily="monospace" className="fill-amber-600 dark:fill-emerald-400">Predicted box</text>
      <text x={95} y={175} fontSize="11" fontFamily="monospace" className="fill-black/60 dark:fill-white/60">Ground-truth box</text>
      <text x={30} y={155} fontSize="11" fontFamily="monospace" className="fill-black dark:fill-white">
        IoU = Overlap area / Union area
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function ComputerVisionPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showThanks, setShowThanks] = useState(false);

  const notesMarkdown = useMemo(() => buildNotesMarkdown(), []);

  const handleDownload = () => {
    const blob = new Blob([notesMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CodeNFacts-Computer-Vision-Notes.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // TODO(backend): log a "notes_downloaded" analytics event (category: computer-vision) to Firestore.

    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 4200);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e14] text-black dark:text-white transition-colors">
      {/* Hero */}
      <div className="border-b border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0d1117]">
        <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center gap-2 text-amber-600 dark:text-emerald-400 text-sm font-mono mb-3">
              <Camera className="w-4 h-4" />
              <span>Computer Vision</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 flex items-center gap-3">
              <Eye className="w-9 h-9 md:w-11 md:h-11 text-amber-500 dark:text-emerald-400" />
              Computer Vision
            </h1>
            <p className="text-base md:text-lg text-black/70 dark:text-white/70 max-w-3xl leading-relaxed">
              Everything you need to learn Computer Vision from first principles - what it is, why it
              matters, every core formula, deep-dive notes, cheat sheets, diagrams, a guide to building
              your own model, and honest pros &amp; cons.
            </p>

            <button
              onClick={handleDownload}
              className="mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-sm
                         bg-amber-500 hover:bg-amber-600 text-white
                         dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-[#0a0e14]
                         transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download Computer Vision Notes
            </button>
          </motion.div>
        </div>
      </div>

      {/* Body: sidebar + content */}
      <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar nav */}
        <nav className="md:sticky md:top-6 h-fit">
          <ul className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <li key={tab.id} className="shrink-0">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                      ${
                        active
                          ? "bg-amber-500/10 text-amber-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {active && <ChevronRight className="w-3.5 h-3.5 ml-auto hidden md:block" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <Panel title="what-is-computer-vision.md" icon={Brain}>
                    <p className="leading-relaxed text-black/80 dark:text-white/80">
                      <strong>Computer Vision (CV)</strong> is the branch of Artificial Intelligence that
                      gives machines the ability to "see" — to extract, analyze, and understand
                      information from images and videos, then make decisions or predictions from it.
                      In short: it turns pixels into meaning.
                    </p>
                  </Panel>

                  <Panel title="why-do-we-need-it.md" icon={Target}>
                    <ul className="list-disc list-inside space-y-2 text-black/80 dark:text-white/80">
                      <li>Cameras produce far more visual data than humans can manually review.</li>
                      <li>Enables real-time automated decisions (robots, vehicles, factories).</li>
                      <li>Unlocks value hidden in unstructured visual data (X-rays, satellite images).</li>
                      <li>Powers natural, camera-based human-computer interaction.</li>
                      <li>Drives generative creativity — image synthesis, editing, style transfer.</li>
                    </ul>
                  </Panel>

                  <Panel title="use-cases.tsx" icon={Sparkles}>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {USE_CASES.map((u) => (
                        <div key={u} className="flex items-start gap-2 text-sm text-black/80 dark:text-white/80">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-500 dark:text-emerald-400 shrink-0" />
                          {u}
                        </div>
                      ))}
                    </div>
                  </Panel>
                </div>
              )}

              {activeTab === "types" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {CV_TYPES.map((t, i) => (
                    <motion.div key={t.title} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                      <Panel title={t.title} icon={Boxes}>
                        <p className="text-sm text-black/80 dark:text-white/80 mb-2">{t.desc}</p>
                        <p className="text-xs italic text-amber-700 dark:text-emerald-400">
                          Example: {t.example}
                        </p>
                      </Panel>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "formulas" && (
                <div className="space-y-4">
                  {FORMULAS.map((f, i) => (
                    <motion.div key={f.name} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                      <Panel title={f.name} icon={Sigma}>
                        <pre className="bg-[#f7f8fa] dark:bg-[#0a0e14] border border-black/10 dark:border-white/10 rounded-md p-3 text-sm font-mono overflow-x-auto text-black dark:text-emerald-300">
                          {f.formula}
                        </pre>
                        <p className="text-sm text-black/70 dark:text-white/70 mt-2">{f.note}</p>
                      </Panel>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-4">
                  {NOTES_SECTIONS.map((n, i) => (
                    <motion.div key={n.title} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                      <Panel title={n.title} icon={BookOpen}>
                        <p className="text-sm text-black/80 dark:text-white/80 whitespace-pre-line leading-relaxed">
                          {n.body}
                        </p>
                      </Panel>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "cheatsheet" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {CHEATSHEET.map((c, i) => (
                    <motion.div key={c.group} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                      <Panel title={c.group} icon={ScanLine}>
                        <ul className="space-y-1.5 text-sm font-mono text-black/80 dark:text-emerald-300">
                          {c.items.map((item) => (
                            <li key={item}>▸ {item}</li>
                          ))}
                        </ul>
                      </Panel>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "diagrams" && (
                <div className="space-y-6">
                  <Panel title="cnn-pipeline.svg" icon={Cpu}>
                    <CNNPipelineDiagram />
                    <p className="text-xs text-black/60 dark:text-white/50 mt-2">
                      A typical CNN pipeline: raw pixels flow through alternating convolution/pooling
                      layers that build up increasingly abstract features, then a fully-connected head
                      turns those features into class probabilities.
                    </p>
                  </Panel>

                  <Panel title="convolution-sliding-window.svg" icon={Grid3x3}>
                    <ConvolutionDiagram />
                  </Panel>

                  <Panel title="iou-bounding-boxes.svg" icon={Target}>
                    <IoUDiagram />
                  </Panel>
                </div>
              )}

              {activeTab === "build" && (
                <div className="space-y-4">
                  <Panel title="how-to-build-your-own-cv-model.md" icon={Rocket}>
                    <p className="text-sm text-black/70 dark:text-white/70 mb-4">
                      You don't need to invent a new architecture to build a working Computer Vision
                      model — you need a clear problem, clean data, and a solid transfer-learning
                      workflow. Follow this path:
                    </p>
                    <ol className="space-y-3">
                      {BUILD_STEPS.map((b) => (
                        <li key={b.step} className="text-sm">
                          <span className="font-semibold text-amber-700 dark:text-emerald-400">{b.step}</span>
                          <p className="text-black/75 dark:text-white/75 mt-0.5">{b.detail}</p>
                        </li>
                      ))}
                    </ol>
                  </Panel>
                </div>
              )}

              {activeTab === "blog" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {BLOG_POSTS.map((post, i) => (
                    <motion.div key={post.title} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                      <Panel title={`blog-${i + 1}.md`} icon={Newspaper}>
                        <h3 className="font-semibold mb-2">{post.title}</h3>
                        <p className="text-sm text-black/70 dark:text-white/70">{post.excerpt}</p>
                      </Panel>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "proscons" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Panel title="good-side.md" icon={ThumbsUp}>
                    <ul className="space-y-2 text-sm">
                      {PROS.map((p) => (
                        <li key={p} className="flex gap-2 text-black/80 dark:text-white/80">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </Panel>
                  <Panel title="bad-side.md" icon={ThumbsDown}>
                    <ul className="space-y-2 text-sm">
                      {CONS.map((c) => (
                        <li key={c} className="flex gap-2 text-black/80 dark:text-white/80">
                          <X className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </Panel>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Thank-you toast on download */}
      <AnimatePresence>
        {showThanks && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-xs rounded-xl border border-black/10 dark:border-white/10
                       bg-white dark:bg-[#0d1117] shadow-lg p-4 flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-500 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Thanks for downloading! 🎉</p>
              <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">
                Happy learning — go build something great with Computer Vision.
              </p>
            </div>
            <button
              onClick={() => setShowThanks(false)}
              className="ml-auto text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}