// components/connect/RichText.tsx
import Link from "next/link";

// Splits content on @mentions and #tags and renders them as styled links.
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(@[a-zA-Z0-9_]{3,30}|#[a-zA-Z0-9_]{2,30})/g);

  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
      {parts.map((part, i) => {
        if (part.startsWith("@")) {
          return (
            <Link
              key={i}
              href={`/connect/profile/${part.slice(1)}`}
              className="text-emerald-400 hover:underline"
            >
              {part}
            </Link>
          );
        }
        if (part.startsWith("#")) {
          return (
            <Link
              key={i}
              href={`/connect/home?tag=${part.slice(1).toLowerCase()}`}
              className="text-sky-400 hover:underline"
            >
              {part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}