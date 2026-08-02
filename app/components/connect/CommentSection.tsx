// components/connect/CommentSection.tsx
"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { addComment, fetchComments } from "@/lib/firestore/posts";
import { RichText } from "./RichText";
import { Comment } from "@/types/connect";

export function CommentSection({ postId }: { postId: string }) {
  const { user, userProfile } = useAuth() as any;
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  async function load() {
    setLoading(true);
    const data = (await fetchComments(postId)) as Comment[];
    setComments(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function handleSend() {
    if (!draft.trim() || !user) return;
    setSending(true);
    try {
      await addComment(
        postId,
        {
          uid: user.uid,
          name: userProfile?.displayName || user.displayName || "User",
          username: userProfile?.username || "user",
          photoURL: userProfile?.photoURL || user.photoURL || null,
        },
        draft
      );
      setDraft("");
      await load();
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border-t border-zinc-800 px-4 py-3">
      {loading ? (
        <p className="text-xs text-zinc-600">Loading comments...</p>
      ) : (
        <div className="mb-3 space-y-3">
          {comments.length === 0 && (
            <p className="text-xs text-zinc-600">No comments yet. Be the first to reply.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-zinc-800 bg-cover bg-center"
                style={c.authorPhotoURL ? { backgroundImage: `url(${c.authorPhotoURL})` } : {}} />
              <div className="flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-medium text-zinc-200">{c.authorName}</span>
                  <span className="text-[11px] text-zinc-600">@{c.authorUsername}</span>
                </div>
                <RichText text={c.content} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Write a comment... @mention #tag"
          className="flex-1 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-emerald-500/50"
        />
        <button
          onClick={handleSend}
          disabled={sending || !draft.trim()}
          className="rounded-md bg-zinc-800 p-1.5 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}