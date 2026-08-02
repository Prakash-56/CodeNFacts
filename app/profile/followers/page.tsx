"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, UserMinus, UserPlus } from "lucide-react";

type FollowerUser = {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  headline?: string;
  isFollowingBack: boolean;
};

// TODO: replace with a real fetch, e.g. GET /api/users/:id/followers
const MOCK_FOLLOWERS: FollowerUser[] = [];

export default function FollowersPage() {
  const router = useRouter();
  const [followers, setFollowers] = useState<FollowerUser[]>(MOCK_FOLLOWERS);
  const [query, setQuery] = useState("");

  const filtered = followers.filter(
    (f) =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.handle.toLowerCase().includes(query.toLowerCase())
  );

  const toggleFollowBack = (id: string) => {
    setFollowers((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, isFollowingBack: !f.isFollowingBack } : f
      )
    );
    // TODO: call backend to follow/unfollow this user.
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium hover:underline"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="mt-5 text-xl font-bold">
        Followers <span className="text-gray-400">({followers.length})</span>
      </h1>

      <div className="relative mt-4">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search followers..."
          className="w-full rounded-full border border-[var(--border)] bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="mt-5 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)]">
        {filtered.length === 0 ? (
          <EmptyState
            title={followers.length === 0 ? "No followers yet" : "No matches"}
            description={
              followers.length === 0
                ? "When people follow you, they'll show up here."
                : "Try a different name or handle."
            }
          />
        ) : (
          filtered.map((f) => (
            <div key={f.id} className="flex items-center gap-3 px-4 py-3.5">
              <Link href={`/u/${f.handle}`} className="shrink-0">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[var(--card)] border border-[var(--border)]">
                  {f.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.avatarUrl} alt={f.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-gray-400">
                      {f.name[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
              </Link>

              <Link href={`/u/${f.handle}`} className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{f.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  @{f.handle}
                  {f.headline ? ` · ${f.headline}` : ""}
                </p>
              </Link>

              <button
                onClick={() => toggleFollowBack(f.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  f.isFollowingBack
                    ? "border border-[var(--border)] hover:bg-[var(--card)]"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
                }`}
              >
                {f.isFollowingBack ? (
                  <>
                    <UserMinus size={13} /> Following
                  </>
                ) : (
                  <>
                    <UserPlus size={13} /> Follow Back
                  </>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
    </div>
  );
}