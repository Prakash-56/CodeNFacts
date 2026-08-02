// components/connect/PostCard.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, FileText, Award, Mic } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toggleLike, hasLiked } from "@/lib/firestore/posts";
import { RichText } from "./RichText";
import { CommentSection } from "./CommentSection";
import { Post } from "@/types/connect";

function timeAgo(date: Date | null) {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function PostCard({ post }: { post: Post }) {
  const { user } = useAuth() as any;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (user) hasLiked(post.id, user.uid).then(setLiked);
  }, [post.id, user]);

  async function handleLike() {
    if (!user) return;
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    await toggleLike(post.id, user.uid);
  }

  function handleShare() {
    const url = `${window.location.origin}/connect/post/${post.id}`;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 1500);
  }

  const createdDate = post.createdAt ? (post.createdAt as any).toDate?.() ?? null : null;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950">
      <div className="flex items-start gap-3 p-4">
        <Link href={`/connect/profile/${post.authorUsername}`}>
          <div
            className="h-9 w-9 shrink-0 rounded-full bg-zinc-800 bg-cover bg-center"
            style={post.authorPhotoURL ? { backgroundImage: `url(${post.authorPhotoURL})` } : {}}
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Link href={`/connect/profile/${post.authorUsername}`} className="text-sm font-medium text-zinc-100 hover:underline">
              {post.authorName}
            </Link>
            <span className="text-xs text-zinc-600">@{post.authorUsername}</span>
            <span className="text-xs text-zinc-700">· {timeAgo(createdDate)}</span>
            {post.type === "achievement" && (
              <Award size={13} className="ml-1 text-amber-400" />
            )}
          </div>

          {post.achievement && (
            <div className="mt-1 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-xs text-amber-300">
              {post.achievement.title} — {post.achievement.issuer}
            </div>
          )}

          <div className="mt-1.5">
            <RichText text={post.content} />
          </div>

          {post.attachment && (
            <a
              href={post.attachment.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-300 hover:border-zinc-700"
            >
              {post.attachment.kind === "pdf" && <FileText size={14} className="text-red-400" />}
              {post.attachment.kind === "audio" && <Mic size={14} className="text-sky-400" />}
              <span className="truncate">{post.attachment.name}</span>
              {post.attachment.pageCount && (
                <span className="ml-auto text-[11px] text-zinc-600">{post.attachment.pageCount}p</span>
              )}
            </a>
          )}

          <div className="mt-3 flex items-center gap-5 text-xs text-zinc-500">
            <button onClick={handleLike} className={`flex items-center gap-1.5 ${liked ? "text-rose-400" : "hover:text-zinc-300"}`}>
              <Heart size={15} fill={liked ? "currentColor" : "none"} />
              {likeCount}
            </button>
            <button onClick={() => setShowComments((v) => !v)} className="flex items-center gap-1.5 hover:text-zinc-300">
              <MessageCircle size={15} />
              {post.commentCount}
            </button>
            <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-zinc-300">
              <Share2 size={15} />
              {shareCopied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </div>

      {showComments && <CommentSection postId={post.id} />}
    </div>
  );
}