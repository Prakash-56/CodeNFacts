// components/connect/UserSearchBar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { searchUsersByName } from "@/lib/firestore/users";
import { UserProfile } from "@/types/connect";

export function UserSearchBar() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<UserProfile[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!term.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const r = await searchUsersByName(term);
      setResults(r);
      setOpen(true);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [term]);

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5">
        <Search size={14} className="text-zinc-500" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={() => term && setOpen(true)}
          placeholder="Search people..."
          className="w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
        />
        {term && (
          <button onClick={() => { setTerm(""); setResults([]); setOpen(false); }}>
            <X size={13} className="text-zinc-500 hover:text-zinc-300" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 shadow-lg">
          {results.map((u) => (
            <Link
              key={u.uid}
              href={`/connect/profile/${u.username}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-900"
            >
              <div
                className="h-7 w-7 shrink-0 rounded-full bg-zinc-800 bg-cover bg-center"
                style={u.photoURL ? { backgroundImage: `url(${u.photoURL})` } : {}}
              />
              <div className="min-w-0">
                <p className="truncate text-zinc-200">{u.displayName}</p>
                <p className="truncate text-xs text-zinc-600">@{u.username}</p>
              </div>
              {u.isMentor && (
                <span className="ml-auto shrink-0 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400">
                  mentor
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}