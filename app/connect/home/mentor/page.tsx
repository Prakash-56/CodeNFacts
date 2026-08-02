// app/connect/home/mentor/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchMentors, toggleFollow, isFollowing } from "@/lib/firestore/users";
import { getOrCreateConversation } from "@/lib/firestore/messages";
import { UserProfile } from "@/types/connect";

const TRACKS = ["All", "AI", "Frontend", "DevOps", "UI/UX"];

export default function MentorPage() {
  const { user, userProfile } = useAuth() as any;
  const router = useRouter();
  const [track, setTrack] = useState("All");
  const [mentors, setMentors] = useState<UserProfile[]>([]);
  const [followState, setFollowState] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchMentors(track === "All" ? undefined : track).then(async (list) => {
      setMentors(list);
      if (user) {
        const states: Record<string, boolean> = {};
        await Promise.all(
          list.map(async (m) => {
            states[m.uid] = await isFollowing(user.uid, m.uid);
          })
        );
        setFollowState(states);
      }
      setLoading(false);
    });
  }, [track, user]);

  async function handleConnect(mentorId: string) {
    if (!user) return;
    setConnectingId(mentorId);
    const nowFollowing = await toggleFollow(user.uid, mentorId);
    setFollowState((prev) => ({ ...prev, [mentorId]: nowFollowing }));
    setConnectingId(null);
  }

  async function handleMessage(mentor: UserProfile) {
    if (!user) return;
    const conversationId = await getOrCreateConversation(
      {
        uid: user.uid,
        displayName: userProfile?.displayName || user.displayName || "User",
        username: userProfile?.username || "user",
        photoURL: userProfile?.photoURL || null,
      },
      {
        uid: mentor.uid,
        displayName: mentor.displayName,
        username: mentor.username,
        photoURL: mentor.photoURL,
      }
    );
    router.push(`/connect/messages/${conversationId}`);
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link href="/connect/home" className="text-zinc-500 hover:text-zinc-300">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-mono text-sm font-semibold text-emerald-400">Mentors</h1>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-5">
        <div className="mb-5 flex gap-2 overflow-x-auto">
          {TRACKS.map((t) => (
            <button
              key={t}
              onClick={() => setTrack(t)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-mono transition-colors ${
                track === t
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "text-zinc-500 border border-zinc-800 hover:text-zinc-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-emerald-500" />
          </div>
        ) : mentors.length === 0 ? (
          <p className="py-16 text-center text-sm text-zinc-600">No mentors found for this track yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <div key={mentor.uid} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-start gap-3">
                  <Link href={`/connect/profile/${mentor.username}`}>
                    <div
                      className="h-11 w-11 shrink-0 rounded-full bg-zinc-800 bg-cover bg-center"
                      style={mentor.photoURL ? { backgroundImage: `url(${mentor.photoURL})` } : {}}
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link href={`/connect/profile/${mentor.username}`} className="block truncate text-sm font-medium text-zinc-100 hover:underline">
                      {mentor.displayName}
                    </Link>
                    <p className="truncate text-xs text-zinc-600">@{mentor.username}</p>
                    {mentor.track && (
                      <span className="mt-1 inline-block rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400">
                        {mentor.track}
                      </span>
                    )}
                  </div>
                </div>

                {mentor.headline && <p className="mt-3 line-clamp-2 text-xs text-zinc-500">{mentor.headline}</p>}

                {mentor.skills?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {mentor.skills.slice(0, 4).map((s) => (
                      <span key={s} className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-400">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleConnect(mentor.uid)}
                    disabled={connectingId === mentor.uid}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
                      followState[mentor.uid]
                        ? "border border-zinc-800 text-zinc-400 hover:border-red-500/30 hover:text-red-400"
                        : "bg-emerald-500 text-black hover:opacity-90"
                    }`}
                  >
                    {followState[mentor.uid] ? <UserCheck size={13} /> : <UserPlus size={13} />}
                    {followState[mentor.uid] ? "Connected" : "Connect"}
                  </button>
                  <button
                    onClick={() => handleMessage(mentor)}
                    className="flex items-center justify-center rounded-md border border-zinc-800 px-3 py-1.5 text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400"
                  >
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}