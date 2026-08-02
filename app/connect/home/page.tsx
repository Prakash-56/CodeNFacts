// app/connect/home/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Users,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchFeedPage } from "../../../lib/firestore/posts";
import { fetchFollowing } from "../../../lib/firestore/users";
import { CreatePost } from "../../components/connect/CreatePost";
import { PostCard } from "../../components/connect/PostCard";
import { UserSearchBar } from "../../components/connect/UserSearchBar";
import { Post } from "../../../types/connect";
import type { QueryDocumentSnapshot } from "firebase/firestore";

export default function ConnectHomePage() {
  const { user, userProfile, loading: authLoading } = useAuth() as any;

  const router = useRouter();
  const searchParams = useSearchParams();

  const tagFilter = searchParams.get("tag");

  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot | null>(null);

  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [followingCount, setFollowingCount] = useState(0);

  const loadInitial = useCallback(async () => {
    setLoadingFeed(true);

    const {
      posts: page,
      lastDoc: cursor,
    } = await fetchFeedPage();

    setPosts(page);
    setLastDoc(cursor);
    setLoadingFeed(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadInitial();

      fetchFollowing(user.uid).then((f) =>
        setFollowingCount(f.length)
      );
    }
  }, [user, authLoading, router, loadInitial]);

  async function loadMore() {
    if (!lastDoc || loadingMore) return;

    setLoadingMore(true);

    const {
      posts: page,
      lastDoc: cursor,
    } = await fetchFeedPage(lastDoc);

    setPosts((prev) => [...prev, ...page]);
    setLastDoc(cursor);

    setLoadingMore(false);
  }

  const visiblePosts = tagFilter
    ? posts.filter((p) => p.tags.includes(tagFilter))
    : posts;

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-[#0a0e14]">
        <Loader2
          size={28}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors dark:bg-[#0a0e14] dark:text-white">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0a0e14]/90">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">

          <div className="hidden flex-1 max-w-xl md:block">
            <UserSearchBar />
          </div>

          <div className="flex flex-wrap items-center gap-2">

            <Link
              href="/connect/home/mentor"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <GraduationCap size={16} />
              <span className="hidden sm:inline">
                Mentors
              </span>
            </Link>

            <Link
              href="/connect/messages/conversationId"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <MessageSquare size={16} />
              <span className="hidden sm:inline">
                Messages
              </span>
            </Link>

          </div>

        </div>

        <div className="border-t border-gray-100 p-4 md:hidden dark:border-white/10">
          <UserSearchBar />
        </div>

      </header>

      {/* ================= PAGE ================= */}

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)_300px]">

        {/* ================= MOBILE PROFILE ================= */}

        <aside className="lg:hidden">

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111827]">

            <div className="flex items-center gap-4">

              <div
                className="h-16 w-16 rounded-full border-2 border-gray-200 bg-gray-100 bg-cover bg-center dark:border-white/10 dark:bg-white/10"
                style={
                  userProfile?.photoURL
                    ? {
                        backgroundImage: `url(${userProfile.photoURL})`,
                      }
                    : {}
                }
              />

              <div className="min-w-0 flex-1">

                <h2 className="truncate font-semibold">
                  {userProfile?.displayName ||
                    user?.displayName}
                </h2>

                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                  @{userProfile?.username}
                </p>

                {userProfile?.headline && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {userProfile.headline}
                  </p>
                )}

              </div>

            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">

              <div className="rounded-xl bg-gray-50 py-3 dark:bg-white/5">
                <p className="text-lg font-semibold">
                  {userProfile?.postsCount ?? 0}
                </p>
                <p className="text-xs text-gray-500">
                  Posts
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 py-3 dark:bg-white/5">
                <p className="text-lg font-semibold">
                  {userProfile?.followersCount ?? 0}
                </p>
                <p className="text-xs text-gray-500">
                  Followers
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 py-3 dark:bg-white/5">
                <p className="text-lg font-semibold">
                  {followingCount}
                </p>
                <p className="text-xs text-gray-500">
                  Following
                </p>
              </div>

            </div>

            <Link
              href={`/connect/profile/${userProfile?.username}`}
              className="mt-5 block rounded-xl bg-blue-600 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-700"
            >
              View Profile
            </Link>

          </div>

        </aside>

        {/* ================= DESKTOP PROFILE ================= */}

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111827]">

            <div
              className="h-20 w-20 rounded-full border-2 border-gray-200 bg-gray-100 bg-cover bg-center dark:border-white/10 dark:bg-white/10"
              style={
                userProfile?.photoURL
                  ? {
                      backgroundImage: `url(${userProfile.photoURL})`,
                    }
                  : {}
              }
            />

            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              {userProfile?.displayName || user?.displayName}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{userProfile?.username}
            </p>

            {userProfile?.headline && (
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {userProfile.headline}
              </p>
            )}

            <div className="mt-6 grid grid-cols-3 gap-2">

              <div className="rounded-xl bg-gray-50 py-3 text-center dark:bg-white/5">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {userProfile?.postsCount ?? 0}
                </p>
                <p className="text-xs text-gray-500">
                  Posts
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 py-3 text-center dark:bg-white/5">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {userProfile?.followersCount ?? 0}
                </p>
                <p className="text-xs text-gray-500">
                  Followers
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 py-3 text-center dark:bg-white/5">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {followingCount}
                </p>
                <p className="text-xs text-gray-500">
                  Following
                </p>
              </div>

            </div>

            <Link
              href={`/connect/profile/${userProfile?.username}`}
              className="mt-6 block rounded-xl bg-blue-600 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-700"
            >
              View Profile
            </Link>

          </div>
        </aside>

        {/* ================= FEED ================= */}

        <main className="min-w-0 space-y-6">

          {/* Create Post */}

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111827]">
            <CreatePost onPosted={loadInitial} />
          </div>

          {/* Tag Filter */}

          {tagFilter && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-300">

              <span>
                Filtering by
              </span>

              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold dark:bg-blue-500/20">
                #{tagFilter}
              </span>

              <Link
                href="/connect/home"
                className="ml-auto text-sm font-medium hover:underline"
              >
                Clear
              </Link>

            </div>
          )}

          {/* Loading */}

          {loadingFeed ? (

            <div className="flex justify-center py-20">
              <Loader2
                size={32}
                className="animate-spin text-blue-600"
              />
            </div>

          ) : visiblePosts.length === 0 ? (

            /* Empty Feed */

            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center shadow-sm dark:border-white/10 dark:bg-[#111827]">

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                No posts yet
              </h3>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Start the conversation by creating your first
                post.
              </p>

            </div>

          ) : (

            /* Posts */

            <div className="space-y-6">
              {visiblePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>

          )}

          {/* ================= LOAD MORE ================= */}

          {!loadingFeed && lastDoc && !tagFilter && (
            <div className="pb-4">

              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="mx-auto flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingMore ? (
                  <>
                    <Loader2
                      size={18}
                      className="mr-2 animate-spin"
                    />
                    Loading...
                  </>
                ) : (
                  "Load More Posts"
                )}
              </button>

            </div>
          )}

        </main>

        {/* ================= RIGHT SIDEBAR ================= */}

        <aside className="hidden lg:block">

          <div className="sticky top-24 space-y-5">

            {/* Mentor Card */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111827]">

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Users size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Internship Mentors
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Learn directly from experienced developers.
                  </p>
                </div>

              </div>

              <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                Connect with mentors specializing in Frontend,
                Backend, UI/UX, AI, DevOps, Cloud, Data Structures,
                Interview Preparation, and Career Guidance.
              </p>

              <Link
                href="/connect/home/mentor"
                className="mt-5 block rounded-xl bg-blue-600 py-2.5 text-center text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Browse Mentors
              </Link>

            </div>

            {/* Community Card */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111827]">

              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Grow Together 🚀
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Share projects, ask programming questions,
                showcase achievements, discover opportunities,
                and help other learners become better developers.
              </p>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}