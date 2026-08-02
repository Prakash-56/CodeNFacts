// tools/regex/page.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";

type MatchInfo = {
  index: number;
  length: number;
  value: string;
  groups: string[];
  namedGroups?: Record<string, string>;
};

const REGEX_HINTS: { label: string; pattern: string; description: string }[] = [
  { label: "Any char", pattern: ".", description: "Any character except newline" },
  { label: "Digit", pattern: "\\d", description: "Any digit [0-9]" },
  { label: "Non-digit", pattern: "\\D", description: "Any non-digit" },
  { label: "Word", pattern: "\\w", description: "[a-zA-Z0-9_]" },
  { label: "Non-word", pattern: "\\W", description: "Non-word character" },
  { label: "Space", pattern: "\\s", description: "Whitespace (space, tab, newline)" },
  { label: "Non-space", pattern: "\\S", description: "Non-whitespace" },
  { label: "Start", pattern: "^", description: "Start of string / line (multiline)" },
  { label: "End", pattern: "$", description: "End of string / line (multiline)" },
  { label: "Exact count", pattern: "a{3}", description: "Exactly 3 'a'" },
  { label: "Min count", pattern: "a{2,}", description: "At least 2 'a'" },
  { label: "Range count", pattern: "a{2,4}", description: "Between 2 and 4 'a'" },
  { label: "Optional", pattern: "a?", description: "0 or 1 'a'" },
  { label: "One or more", pattern: "a+", description: "1 or more 'a'" },
  { label: "Zero or more", pattern: "a*", description: "0 or more 'a'" },
  { label: "Group", pattern: "(ab)", description: "Capture group" },
  { label: "Named group", pattern: "(?<name>ab)", description: "Named capture group" },
  { label: "Non-capture", pattern: "(?:ab)", description: "Non-capturing group" },
  { label: "Lookahead", pattern: "a(?=b)", description: "'a' followed by 'b'" },
  { label: "Lookbehind", pattern: "(?<=b)a", description: "'a' preceded by 'b'" },
  { label: "Alternation", pattern: "a|b", description: "'a' or 'b'" },
  { label: "Char class", pattern: "[abc]", description: "One of a, b, c" },
  { label: "Range", pattern: "[a-z]", description: "Any lowercase letter" },
];

export default function RegexPage() {
  const [pattern, setPattern] = useState<string>("\\w+");
  const [flagsStr, setFlagsStr] = useState<string>("g");
  const [testString, setTestString] = useState<string>(
    "Hello world! JavaScript regex is awesome. Email: demo@example.com"
  );

  const flags = useMemo(() => flagsStr.split("").filter((f) => f && /^[gim su]$/.test(f)), [flagsStr]);

  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchInfo[]>([]);

  // Compute matches and error
  useEffect(() => {
    try {
      setError(null);
      const rg = new RegExp(pattern, flags.join(""));
      const result: MatchInfo[] = [];

      if (!rg.global) {
        // non-global: only first match
        const m = rg.exec(testString);
        if (m) {
          const groups = m.slice(1);
          const namedGroups: Record<string, string> = {};
          if (m.groups) {
            for (const [key, val] of Object.entries(m.groups)) {
              namedGroups[key] = val || "";
            }
          }
          result.push({
            index: m.index,
            length: m[0].length,
            value: m[0],
            groups,
            namedGroups,
          });
        }
      } else {
        // global: all matches
        let match: RegExpExecArray | null;
        // Ensure we don't loop infinitely if pattern matches empty
        const zeroWidth = pattern === "" || /^\\s*$/.test(pattern) === false && pattern.match(/^(\^|\$|\(\?:\)|\(\?=|\(\?!|\(\<=|\(\<!)$/);
        // Simple safety: if regex can match empty string, restrict to non-empty by adding a check
        while ((match = rg.exec(testString)) !== null) {
          if (match[0].length === 0 && zeroWidth) {
            rg.lastIndex++;
            continue;
          }
          const groups = match.slice(1);
          const namedGroups: Record<string, string> = {};
          if (match.groups) {
            for (const [key, val] of Object.entries(match.groups)) {
              namedGroups[key] = val || "";
            }
          }
          result.push({
            index: match.index,
            length: match[0].length,
            value: match[0],
            groups,
            namedGroups,
          });
          if (match[0].length === 0) {
            rg.lastIndex++;
          }
        }
      }

      setMatches(result);
    } catch (e: any) {
      setError(e?.message || "Invalid regex");
      setMatches([]);
    }
  }, [pattern, flags, testString]);

  // Build highlighted test string
  const highlightedTest = useMemo(() => {
    if (error || matches.length === 0) {
      return <span>{testString}</span>;
    }
    const parts: React.ReactNode[] = [];
    let pos = 0;

    matches.forEach((m, i) => {
      if (m.index > pos) {
        parts.push(<span key={`t-${i}`}>{testString.slice(pos, m.index)}</span>);
      }
      parts.push(
        <span
          key={`m-${i}`}
          style={{
            backgroundColor: "rgba(34,197,94,0.25)",
            borderBottom: "2px solid #22c55e",
            borderRadius: 3,
          }}
        >
          {m.value}
        </span>
      );
      pos = m.index + m.length;
    });

    if (pos < testString.length) {
      parts.push(<span key="tail">{testString.slice(pos)}</span>);
    }

    return <span>{parts}</span>;
  }, [testString, matches, error]);

  const insertPattern = (p: string) => {
    setPattern((prev) => prev + p);
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", padding: 24, maxWidth: 1100 }}>
      <h1 style={{ marginBottom: 8 }}>Regex Builder & Debugger</h1>
      <p style={{ marginBottom: 24, color: "#555" }}>
        Build and test regular expressions with live match highlighting, capture groups, named groups, and a clickable cheatsheet.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Left: Pattern & Flags */}
        <div>
          <h2 style={{ marginTop: 0 }}>Pattern</h2>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern (without /.../)"
            style={{
              width: "100%",
              padding: 10,
              fontSize: 16,
              borderRadius: 6,
              border: error ? "1px solid #ef4444" : "1px solid #ddd",
              backgroundColor: error ? "#fff5f5" : "white",
            }}
          />
          {error && (
            <div style={{ color: "#ef4444", marginTop: 6, fontSize: 14 }}>{error}</div>
          )}

          <h2 style={{ marginTop: 16 }}>Flags</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {["g", "i", "m", "s", "u"].map((f) => {
              const active = flags.includes(f);
              return (
                <button
                  key={f}
                  onClick={() => {
                    setFlagsStr((prev) =>
                      prev.includes(f) ? prev.replace(f, "") : prev + f
                    );
                  }}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    backgroundColor: active ? "#22c55e" : "white",
                    color: active ? "white" : "black",
                    cursor: "pointer",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
            g: global, i: case-insensitive, m: multiline, s: dotAll, u: Unicode
          </div>

          <h2 style={{ marginTop: 16 }}>Cheatsheet</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {REGEX_HINTS.map((hint) => (
              <button
                key={hint.label}
                onClick={() => insertPattern(hint.pattern)}
                title={hint.description}
                style={{
                  padding: 6,
                  fontSize: 13,
                  borderRadius: 4,
                  border: "1px solid #ddd",
                  backgroundColor: "white",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ fontWeight: 600 }}>{hint.label}</div>
                <div style={{ fontSize: 12, color: "#222" }}>{hint.pattern}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Test String */}
        <div>
          <h2 style={{ marginTop: 0 }}>Test String</h2>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test your regex against"
            rows={8}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 14,
              borderRadius: 6,
              border: "1px solid #ddd",
              resize: "vertical",
            }}
          />

          <h2 style={{ marginTop: 16 }}>Live Highlighting</h2>
          <div
            style={{
              padding: 12,
              borderRadius: 6,
              border: "1px solid #ddd",
              backgroundColor: "#fafafa",
              minHeight: 60,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {highlightedTest}
          </div>
        </div>
      </div>

      {/* Matches Details */}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>Matches</h2>
        {matches.length === 0 ? (
          <div style={{ color: "#777" }}>No matches found (or invalid regex).</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            {matches.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  backgroundColor: "white",
                }}
              >
                <div style={{ marginBottom: 6 }}>
                  <strong>Match {i + 1}:</strong> <code>{m.value}</code>
                </div>
                <div style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
                  Index: {m.index}, Length: {m.length}
                </div>
                {m.groups.length > 0 && (
                  <div style={{ fontSize: 13 }}>
                    <strong>Capture groups:</strong>{" "}
                    {m.groups.map((g, idx) => (
                      <span key={idx} style={{ marginRight: 8 }}>
                        <code>{idx + 1}: {g || "∅"}</code>
                      </span>
                    ))}
                  </div>
                )}
                {m.namedGroups && Object.keys(m.namedGroups).length > 0 && (
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    <strong>Named groups:</strong>{" "}
                    {Object.entries(m.namedGroups).map(([name, val], idx) => (
                      <span key={idx} style={{ marginRight: 8 }}>
                        <code>{name}: {val || "∅"}</code>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}