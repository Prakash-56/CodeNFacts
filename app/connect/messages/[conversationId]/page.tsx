// app/connect/messages/[conversationId]/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { listenToMessages, sendMessage, markConversationRead } from "@/lib/firestore/messages";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChatMessage, Conversation } from "@/types/connect";

export default function ChatThreadPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth() as any;
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !conversationId) return;

    getDoc(doc(db, "conversations", conversationId)).then((snap) => {
      if (snap.exists()) setConversation({ id: snap.id, ...snap.data() } as Conversation);
    });

    markConversationRead(conversationId, user.uid);
    const unsub = listenToMessages(conversationId, setMessages);
    return () => unsub();
  }, [conversationId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!draft.trim() || !user || !conversation) return;
    const otherId = conversation.participantIds.find((id) => id !== user.uid);
    if (!otherId) return;
    setDraft("");
    await sendMessage(conversationId, user.uid, otherId, draft);
  }

  const otherId = conversation?.participantIds.find((id) => id !== user?.uid);
  const other = otherId ? conversation?.participants[otherId] : null;

  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      <header className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
        <button onClick={() => router.push("/connect/messages")} className="text-zinc-500 hover:text-zinc-300">
          <ArrowLeft size={18} />
        </button>
        {other && (
          <>
            <div
              className="h-8 w-8 rounded-full bg-zinc-800 bg-cover bg-center"
              style={other.photoURL ? { backgroundImage: `url(${other.photoURL})` } : {}}
            />
            <div>
              <p className="text-sm font-medium text-zinc-100">{other.displayName}</p>
              <p className="text-xs text-zinc-600">@{other.username}</p>
            </div>
          </>
        )}
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {messages.map((m) => {
          const mine = m.senderId === user?.uid;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                  mine ? "bg-emerald-500 text-black" : "bg-zinc-900 text-zinc-200"
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-zinc-800 px-4 py-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Message..."
          className="flex-1 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-emerald-500/50"
        />
        <button
          onClick={handleSend}
          disabled={!draft.trim()}
          className="rounded-md bg-emerald-500 p-2 text-black disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}