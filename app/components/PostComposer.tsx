"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, FileText, BarChart2, HelpCircle, X, Plus, Loader2 } from "lucide-react";

export type PostFile = { name: string; url: string; type: string; pageCount?: number };
export type Post = {
  id: string;
  text: string;
  images?: string[];
  files?: PostFile[];
  poll?: { question: string; options: string[] };
  quiz?: { question: string; options: string[]; correctIndex: number };
  createdAt?: string;
  likes?: number;
  comments?: number;
  status?: "published" | "draft" | "archived";
};

const MAX_PDF_PAGES = 8;

export default function PostComposer({
  onPublish,
  onSaveDraft,
  onClose,
}: {
  onPublish: (post: Post) => void;
  onSaveDraft: (post: Post) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<PostFile[]>([]);
  const [mode, setMode] = useState<"none" | "poll" | "quiz">("none");
  const [error, setError] = useState<string | null>(null);
  const [checkingPdf, setCheckingPdf] = useState(false);

  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState<string[]>(["", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    // TODO: backend — upload to storage; using local object URLs for now
    setImages((prev) => [...prev, ...list.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    setError(null);

    for (const file of list) {
      if (file.type === "application/pdf") {
        setCheckingPdf(true);
        try {
          // Dynamically import pdf-lib only when a PDF is actually uploaded.
          // npm install pdf-lib
          const { PDFDocument } = await import("pdf-lib");
          const buffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(buffer);
          const pageCount = pdf.getPageCount();
          if (pageCount > MAX_PDF_PAGES) {
            setError(`"${file.name}" has ${pageCount} pages — max allowed is ${MAX_PDF_PAGES}.`);
            setCheckingPdf(false);
            continue;
          }
          setFiles((prev) => [...prev, { name: file.name, url: URL.createObjectURL(file), type: file.type, pageCount }]);
        } catch {
          setError(`Couldn't read "${file.name}" — make sure it's a valid PDF.`);
        }
        setCheckingPdf(false);
      } else {
        // TODO: backend — upload to storage; using local object URLs for now
        setFiles((prev) => [...prev, { name: file.name, url: URL.createObjectURL(file), type: file.type }]);
      }
    }
    e.target.value = "";
  };

  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));
  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const addPollOption = () => setPollOptions((prev) => [...prev, ""]);
  const addQuizOption = () => setQuizOptions((prev) => [...prev, ""]);

  const buildPost = (): Post | null => {
    if (mode === "poll") {
      const opts = pollOptions.map((o) => o.trim()).filter(Boolean);
      if (!pollQuestion.trim() || opts.length < 2) {
        setError("A poll needs a question and at least 2 options.");
        return null;
      }
      return { id: "", text, images, files, poll: { question: pollQuestion.trim(), options: opts } };
    }
    if (mode === "quiz") {
      const opts = quizOptions.map((o) => o.trim()).filter(Boolean);
      if (!quizQuestion.trim() || opts.length < 2) {
        setError("A quiz needs a question and at least 2 options.");
        return null;
      }
      return { id: "", text, images, files, quiz: { question: quizQuestion.trim(), options: opts, correctIndex: Math.min(correctIndex, opts.length - 1) } };
    }
    if (!text.trim() && images.length === 0 && files.length === 0) {
      setError("Write something or attach a file before posting.");
      return null;
    }
    return { id: "", text, images, files };
  };

  const handlePublish = () => {
    setError(null);
    const post = buildPost();
    if (post) onPublish(post);
  };

  const handleDraft = () => {
    setError(null);
    const post = buildPost();
    if (post) onSaveDraft(post);
  };

  return (
    <div className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Create Post</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-[var(--foreground)]"><X size={16} /></button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="What's on your mind?"
        className="w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none resize-none focus:border-blue-500"
      />

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {images.map((src, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-20 w-full rounded-lg object-cover" />
              <button onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white"><X size={10} /></button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              <FileText size={14} className="text-gray-400 shrink-0" />
              <span className="truncate flex-1">{f.name}</span>
              {f.pageCount != null && <span className="text-xs text-gray-400 shrink-0">{f.pageCount}p</span>}
              <button onClick={() => removeFile(i)} aria-label="Remove file"><X size={13} /></button>
            </div>
          ))}
        </div>
      )}

      {mode === "poll" && (
        <div className="mt-3 rounded-xl border border-[var(--border)] p-3 space-y-2">
          <input value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} placeholder="Ask a question..." className="input" />
          {pollOptions.map((opt, i) => (
            <input
              key={i}
              value={opt}
              onChange={(e) => setPollOptions((prev) => prev.map((o, idx) => (idx === i ? e.target.value : o)))}
              placeholder={`Option ${i + 1}`}
              className="input"
            />
          ))}
          <button onClick={addPollOption} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"><Plus size={12} /> Add option</button>
        </div>
      )}

      {mode === "quiz" && (
        <div className="mt-3 rounded-xl border border-[var(--border)] p-3 space-y-2">
          <input value={quizQuestion} onChange={(e) => setQuizQuestion(e.target.value)} placeholder="Quiz question..." className="input" />
          {quizOptions.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
                title="Mark as correct answer"
              />
              <input
                value={opt}
                onChange={(e) => setQuizOptions((prev) => prev.map((o, idx) => (idx === i ? e.target.value : o)))}
                placeholder={`Option ${i + 1}`}
                className="input"
              />
            </div>
          ))}
          <button onClick={addQuizOption} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"><Plus size={12} /> Add option</button>
          <p className="text-xs text-gray-400">Select the radio button next to the correct answer.</p>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      {checkingPdf && <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400"><Loader2 size={12} className="animate-spin" /> Checking PDF page count...</p>}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button onClick={() => imageInputRef.current?.click()} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--card)]" title="Add image"><ImageIcon size={15} /></button>
          <button onClick={() => fileInputRef.current?.click()} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--card)]" title="Add PDF / document"><FileText size={15} /></button>
          <button onClick={() => setMode((m) => (m === "poll" ? "none" : "poll"))} className={`flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-[var(--card)] ${mode === "poll" ? "border-green-600 text-green-600" : "border-[var(--border)]"}`} title="Create poll"><BarChart2 size={15} /></button>
          <button onClick={() => setMode((m) => (m === "quiz" ? "none" : "quiz"))} className={`flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-[var(--card)] ${mode === "quiz" ? "border-green-600 text-green-600" : "border-[var(--border)]"}`} title="Create quiz"><HelpCircle size={15} /></button>
          <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.csv,.xlsx" multiple onChange={handleFileSelect} className="hidden" />
        </div>

        <div className="flex gap-2">
          <button onClick={handleDraft} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--card)]">Save Draft</button>
          <button onClick={handlePublish} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">Post</button>
        </div>
      </div>

      <style jsx global>{`
        .input { width: 100%; border-radius: 0.5rem; border: 1px solid var(--border); background: transparent; padding: 0.4rem 0.6rem; font-size: 0.8rem; outline: none; }
        .input:focus { border-color: #3b82f6; }
      `}</style>
    </div>
  );
}