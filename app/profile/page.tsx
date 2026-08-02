"use client";

import { useAuth } from "@/lib/auth-context";
import { Construction, Users, MessageSquare, Briefcase } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();

  const name = user?.name ?? "User";
  const email = user?.email ?? "";
  const initial = name ? name[0].toUpperCase() : "?";

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      {/* Profile header – name + email only */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--card)] border border-[var(--border)]">
            <span className="text-2xl font-bold text-gray-400">{initial}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">{name}</h1>
            {email && <p className="mt-0.5 text-sm text-gray-500">{email}</p>}
            <p className="mt-1 text-xs text-gray-400">Community Member</p>
          </div>
        </div>
      </div>

      {/* Building Community Section message */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/40">
          <Construction className="h-8 w-8 text-amber-600" />
        </div>

        <h2 className="text-xl font-semibold mb-3">
          We&apos;re building the Community Section
        </h2>

        <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-6">
          A space designed to help you and other coders share ideas, discuss
          problems, showcase projects, and get discovered by companies. Stay
          tuned - something useful is on the way.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-lg mx-auto mb-8">
          <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] p-3">
            <MessageSquare className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Share thoughts</p>
              <p className="text-xs text-gray-500">Posts, discussions &amp; tips</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] p-3">
            <Users className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Connect</p>
              <p className="text-xs text-gray-500">With fellow developers</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] p-3">
            <Briefcase className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Get placed</p>
              <p className="text-xs text-gray-500">Opportunities &amp; referrals</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Have a suggestion?{" "}
          <Link href="/feedback" className="text-green-600 hover:underline font-medium">
            Tell us what you&apos;d like to see
          </Link>
        </p>
      </div>
    </main>
  );
}