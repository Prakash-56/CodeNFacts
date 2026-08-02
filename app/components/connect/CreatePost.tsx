// components/connect/CreatePost.tsx
"use client";

import { useState, useRef } from "react";
import { FileText, Award, Code2, Mic, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createPost, getPdfPageCount } from "@/lib/firestore/posts";
import { PostType, MAX_PDF_PAGES } from "@/types/connect";

const TYPE_TABS: { type: PostType; label: string; icon: React.ReactNode }[] = [
  { type: "text", label: "Post", icon: <FileText size={15} /> },
  { type: "achievement", label: "Achievement", icon: <Award size={15} /> },
  { type: "problem", label: "Problem", icon: <Code2 size={15} /> },
  { type: "pdf", label: "Document", icon: <FileText size={15} /> },
  { type: "voice", label: "Voice", icon: <Mic size={15} /> },
];

export function CreatePost({ onPosted }: { onPosted?: () => void }) {
  const { user, userProfile } = useAuth() as any; // matches your existing auth-context shape
  const [activeType, setActiveType] = useState<PostType>("text");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [achievementTitle, setAchievementTitle] = useState("");
  const [achievementIssuer, setAchievementIssuer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFileError(null);
    setPageCount(null);
    if (!f) {
      setFile(null);
      return;
    }

    if (f.type === "application/pdf") {
      try {
        const pages = await getPdfPageCount(f);
        setPageCount(pages);
        if (pages > MAX_PDF_PAGES) {
          setFileError(`This PDF has ${pages} pages. Max allowed is ${MAX_PDF_PAGES}.`);
          setFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
      } catch {
        setFileError("Could not read PDF. Try a different file.");
        setFile(null);
        return;
      }
    }

    setFile(f);
  }

  async function handleSubmit() {
    if (!user) return;
    if (!content.trim() && !file) return;
    if (activeType === "achievement" && (!achievementTitle.trim() || !achievementIssuer.trim())) {
      setFileError("Title and issuer are required for an achievement post.");
      return;
    }

    setSubmitting(true);
    setFileError(null);
    try {
      await createPost({
        authorId: user.uid,
        authorName: userProfile?.displayName || user.displayName || "User",
        authorUsername: userProfile?.username || "user",
        authorPhotoURL: userProfile?.photoURL || user.photoURL || null,
        type: activeType,
        content,
        file,
        onUploadProgress: setProgress,
        achievement:
          activeType === "achievement"
            ? { title: achievementTitle, issuer: achievementIssuer, dateIssued: new Date() }
            : null,
      });
      setContent("");
      setFile(null);
      setAchievementTitle("");
      setAchievementIssuer("");
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onPosted?.();
    } catch (err: any) {
      setFileError(err.message || "Failed to post. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const acceptFor: Record<PostType, string> = {
    text: "",
    achievement: "image/*,application/pdf",
    problem: "",
    pdf: "application/pdf",
    voice: "audio/*",
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-3 flex gap-1 overflow-x-auto">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.type}
            onClick={() => {
              setActiveType(tab.type);
              setFile(null);
              setFileError(null);
            }}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono transition-colors ${
              activeType === tab.type
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-500 border border-transparent hover:text-zinc-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeType === "achievement" && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          <input
            value={achievementTitle}
            onChange={(e) => setAchievementTitle(e.target.value)}
            placeholder="Achievement title"
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-emerald-500/50"
          />
          <input
            value={achievementIssuer}
            onChange={(e) => setAchievementIssuer(e.target.value)}
            placeholder="Issued by"
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-emerald-500/50"
          />
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          activeType === "problem"
            ? "Describe the problem, paste a snippet, tag with #dsa #arrays..."
            : "Share an update... use @username to mention, #tag to tag"
        }
        rows={3}
        className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-emerald-500/50"
      />

      {(activeType === "pdf" || activeType === "achievement" || activeType === "voice") && (
        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptFor[activeType]}
            onChange={handleFileChange}
            className="block w-full text-xs text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:text-zinc-300 hover:file:bg-zinc-700"
          />
          {activeType === "pdf" && (
            <p className="mt-1 text-[11px] text-zinc-500">
              Max {MAX_PDF_PAGES} pages. {pageCount !== null && !fileError && `Detected ${pageCount} page${pageCount === 1 ? "" : "s"}.`}
            </p>
          )}
          {file && !fileError && (
            <div className="mt-1 flex items-center gap-2 text-xs text-emerald-400">
              <FileText size={13} /> {file.name}
              <button onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                <X size={13} className="text-zinc-500 hover:text-zinc-300" />
              </button>
            </div>
          )}
        </div>
      )}

      {fileError && <p className="mt-2 text-xs text-red-400">{fileError}</p>}

      {submitting && file && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="mt-3 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || (!content.trim() && !file)}
          className="flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {submitting && <Loader2 size={13} className="animate-spin" />}
          {submitting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}