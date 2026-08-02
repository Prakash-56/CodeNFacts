"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { towerQuestions, ALL_OPERATIONS, type StackOp, type TowerQuestion } from "./questions";

// ---------------------------------------------------------------------------
// Visual language
// ---------------------------------------------------------------------------
// The tower on the left is not a decoration — it is a literal stack. Every
// question's CORRECT operation is what actually happens to it: a right
// Push answer adds a block, a right Pop answer lifts one off, and Peek/Top
// answers make the top block glow in place. Getting the concept right and
// getting the visualization right are the same action.
//
// Theming: all chrome (page bg, panels, borders, ink/muted text) is driven by
// CSS variables so light mode stays a clean white surface while `.dark`
// switches to the CodeNFacts terminal-dark palette. The four operation
// colors (Push/Pop/Peek/Top) are semantic and stay vivid in both themes.

const OP_STYLE: Record<StackOp, { bg: string; text: string; ring: string; glyph: string }> = {
  Push: { bg: "#2F6FED", text: "#FFFFFF", ring: "#BFD3FB", glyph: "\u2191" }, // up arrow
  Pop: { bg: "#E23D3D", text: "#FFFFFF", ring: "#F8C9C9", glyph: "\u2193" }, // down arrow
  Peek: { bg: "#E8A93B", text: "#26210F", ring: "#F6DFAE", glyph: "\u25C9" }, // dotted circle
  Top: { bg: "#7C4DFF", text: "#FFFFFF", ring: "#D9CCFF", glyph: "\u25A0" }, // square
};

// Theme-aware tokens (resolved via CSS variables set in the <style> block below).
const BG = "var(--st-bg)";
const PANEL = "var(--st-panel)";
const FLOOR_COLOR = "var(--st-floor)";
const INK = "var(--st-ink)";
const MUTED = "var(--st-muted)";
const LINE = "var(--st-line)";
const ACCENT_BG = "var(--st-accent-bg)";
const ACCENT_TEXT = "var(--st-accent-text)";
const CORRECT_BORDER = "var(--st-correct-border)";
const CORRECT_BG = "var(--st-correct-bg)";
const WRONG_BORDER = "var(--st-wrong-border)";
const WRONG_BG = "var(--st-wrong-bg)";

interface Block {
  uid: number;
  op: StackOp | "floor";
  id?: number;
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let uidCounter = 1;

export default function Page() {
  const [order, setOrder] = useState<TowerQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [tower, setTower] = useState<Block[]>([{ uid: 0, op: "floor" }]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [wrongChoice, setWrongChoice] = useState<StackOp | null>(null);
  const [glowTop, setGlowTop] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setOrder(shuffled(towerQuestions));
  }, []);

  const total = order?.length ?? towerQuestions.length;
  const finished = order !== null && index >= order.length;
  const current = order && !finished ? order[index] : null;

  const restart = useCallback(() => {
    setOrder(shuffled(towerQuestions));
    setIndex(0);
    setTower([{ uid: 0, op: "floor" }]);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setWrongChoice(null);
    setLocked(false);
  }, []);

  const advance = useCallback(() => {
    setFeedback(null);
    setWrongChoice(null);
    setLocked(false);
    setIndex((i) => i + 1);
  }, []);

  const handleAnswer = useCallback(
    (choice: StackOp) => {
      if (!current || locked) return;
      setLocked(true);

      const isCorrect = choice === current.correct;

      if (isCorrect) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
        setFeedback("correct");

        if (current.correct === "Push") {
          uidCounter += 1;
          setTower((t) => [...t, { uid: uidCounter, op: "Push", id: current.id }]);
        } else if (current.correct === "Pop") {
          setTower((t) => (t.length > 1 ? t.slice(0, -1) : t));
        } else {
          setGlowTop(true);
          setTimeout(() => setGlowTop(false), 650);
        }

        setTimeout(advance, 700);
      } else {
        setStreak(0);
        setFeedback("wrong");
        setWrongChoice(choice);
      }
    },
    [current, locked, advance]
  );

  const towerHeight = tower.length - 1; // exclude floor

  return (
    <div style={{ background: BG, minHeight: "100vh", color: INK, transition: "background-color 0.2s ease, color 0.2s ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .st-font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
        .st-font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .st-font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        /* Light mode (default): clean white surface */
        :root {
          --st-bg: #ffffff;
          --st-panel: #fcfcfd;
          --st-ink: #14171a;
          --st-muted: #6b7280;
          --st-line: #e7e8eb;
          --st-floor: #d8dbdf;
          --st-accent-bg: #14171a;
          --st-accent-text: #ffffff;
          --st-correct-border: #bfe0c4;
          --st-correct-bg: #f3fbf4;
          --st-wrong-border: #f5c6c6;
          --st-wrong-bg: #fdf4f4;
        }

        /* Dark mode: follows the CodeNFacts terminal palette */
        .dark {
          --st-bg: #0a0e14;
          --st-panel: #0d1117;
          --st-ink: #e6e9ef;
          --st-muted: #8b93a7;
          --st-line: #232a37;
          --st-floor: #2a313f;
          --st-accent-bg: #34d399;
          --st-accent-text: #04140f;
          --st-correct-border: #2f6b45;
          --st-correct-bg: #102319;
          --st-wrong-border: #7a3030;
          --st-wrong-bg: #241010;
        }

        @keyframes st-drop {
          0% { transform: translateY(-28px) scaleY(0.85); opacity: 0; }
          60% { transform: translateY(4px) scaleY(1.03); opacity: 1; }
          100% { transform: translateY(0) scaleY(1); opacity: 1; }
        }
        @keyframes st-lift {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-34px); opacity: 0; }
        }
        @keyframes st-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,169,59,0); }
          40% { box-shadow: 0 0 0 8px rgba(124,77,255,0.18); }
        }
        @keyframes st-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .st-block-enter { animation: st-drop 320ms cubic-bezier(.2,.9,.3,1.2); }
        .st-block-glow { animation: st-glow 650ms ease; }
        .st-shake { animation: st-shake 320ms ease; }

        @media (prefers-reduced-motion: reduce) {
          .st-block-enter, .st-block-glow, .st-shake { animation: none !important; }
        }
      `}</style>

      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "40px 24px 64px",
          display: "grid",
          gridTemplateColumns: "minmax(180px, 260px) 1fr",
          gap: 40,
        }}
        className="st-layout"
      >
        {/* ---------------- LEFT: the tower ---------------- */}
        <div>
          <div
            className="st-font-display"
            style={{ fontSize: 13, letterSpacing: "0.08em", color: MUTED, textTransform: "uppercase", marginBottom: 6 }}
          >
            The Stack
          </div>
          <div
            className="st-font-display"
            style={{ fontSize: 32, fontWeight: 700, marginBottom: 18, lineHeight: 1 }}
          >
            {towerHeight}
            <span style={{ fontSize: 15, fontWeight: 500, color: MUTED, marginLeft: 6 }}>blocks</span>
          </div>

          <div
            style={{
              border: `1px solid ${LINE}`,
              borderRadius: 16,
              padding: "20px 16px",
              minHeight: 420,
              display: "flex",
              flexDirection: "column-reverse",
              alignItems: "center",
              gap: 6,
              background: PANEL,
            }}
          >
            {tower.map((b, i) => {
              const isTop = i === tower.length - 1;
              if (b.op === "floor") {
                return (
                  <div
                    key="floor"
                    style={{
                      width: "88%",
                      height: 10,
                      borderRadius: 6,
                      background: FLOOR_COLOR,
                      marginTop: 4,
                    }}
                  />
                );
              }
              const style = OP_STYLE[b.op];
              return (
                <div
                  key={b.uid}
                  className={`st-block-enter${isTop && glowTop ? " st-block-glow" : ""}`}
                  style={{
                    width: "88%",
                    height: 34,
                    borderRadius: 8,
                    background: style.bg,
                    color: style.text,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  {style.glyph}
                </div>
              );
            })}
            {towerHeight === 0 && (
              <div className="st-font-body" style={{ color: MUTED, fontSize: 13, marginBottom: 12 }}>
                empty — waiting for a Push
              </div>
            )}
          </div>

          <div className="st-font-body" style={{ marginTop: 18, fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
            Correct <b style={{ color: OP_STYLE.Push.bg }}>Push</b> answers add a block.
            Correct <b style={{ color: OP_STYLE.Pop.bg }}>Pop</b> answers remove one.
            <b style={{ color: OP_STYLE.Peek.bg }}> Peek</b> and <b style={{ color: OP_STYLE.Top.bg }}>Top</b> make it glow.
          </div>
        </div>

        {/* ---------------- RIGHT: the game ---------------- */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
            <div className="st-font-display" style={{ fontSize: 26, fontWeight: 700 }}>
              Stack Tower
            </div>
            <div className="st-font-mono" style={{ fontSize: 13, color: MUTED }}>
              {Math.min(index + (finished ? 0 : 1), total)} / {total}
            </div>
          </div>
          <div
            className="st-font-body"
            style={{ fontSize: 14, color: MUTED, marginBottom: 22 }}
          >
            Score {score} &middot; Streak {streak} &middot; Best {bestStreak}
          </div>

          {/* progress bar */}
          <div style={{ height: 6, borderRadius: 4, background: LINE, marginBottom: 28, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${(Math.min(index, total) / total) * 100}%`,
                background: ACCENT_BG,
                transition: "width 400ms ease",
              }}
            />
          </div>

          {!order && (
            <div className="st-font-body" style={{ color: MUTED }}>
              Shuffling scenarios&hellip;
            </div>
          )}

          {finished && (
            <div>
              <div className="st-font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                Tower complete.
              </div>
              <div className="st-font-body" style={{ fontSize: 15, color: MUTED, marginBottom: 20, lineHeight: 1.6 }}>
                You scored <b style={{ color: INK }}>{score}</b> out of <b style={{ color: INK }}>{total}</b>, with a best
                streak of <b style={{ color: INK }}>{bestStreak}</b>. The tower ended {towerHeight} block
                {towerHeight === 1 ? "" : "s"} tall.
              </div>
              <button
                onClick={restart}
                className="st-font-body"
                style={{
                  background: ACCENT_BG,
                  color: ACCENT_TEXT,
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 20px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Rebuild the tower
              </button>
            </div>
          )}

          {current && (
            <div>
              <div
                className={feedback === "wrong" ? "st-shake" : ""}
                style={{
                  border: `1px solid ${feedback === "correct" ? CORRECT_BORDER : feedback === "wrong" ? WRONG_BORDER : LINE}`,
                  background: feedback === "correct" ? CORRECT_BG : feedback === "wrong" ? WRONG_BG : PANEL,
                  borderRadius: 14,
                  padding: "28px 26px",
                  marginBottom: 22,
                  minHeight: 108,
                  display: "flex",
                  alignItems: "center",
                  transition: "background 200ms ease, border-color 200ms ease",
                }}
              >
                <div className="st-font-mono" style={{ fontSize: 17, lineHeight: 1.55, color: INK }}>
                  {current.scenario}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 12,
                }}
              >
                {ALL_OPERATIONS.map((op) => {
                  const style = OP_STYLE[op];
                  const isChosenWrong = wrongChoice === op;
                  const isRevealCorrect = feedback === "wrong" && op === current.correct;
                  return (
                    <button
                      key={op}
                      onClick={() => handleAnswer(op)}
                      disabled={locked}
                      className="st-font-body"
                      style={{
                        position: "relative",
                        padding: "16px 14px",
                        borderRadius: 12,
                        border: `2px solid ${isRevealCorrect ? style.bg : isChosenWrong ? "#E23D3D" : LINE}`,
                        background: isRevealCorrect ? `${style.bg}14` : PANEL,
                        cursor: locked ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 15,
                        fontWeight: 600,
                        color: INK,
                        transition: "border-color 150ms ease, background 150ms ease",
                        opacity: locked && !isRevealCorrect && !isChosenWrong ? 0.5 : 1,
                      }}
                    >
                      <span
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 7,
                          background: style.bg,
                          color: style.text,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          flexShrink: 0,
                        }}
                      >
                        {style.glyph}
                      </span>
                      {op}
                    </button>
                  );
                })}
              </div>

              {feedback === "wrong" && (
                <div className="st-font-body" style={{ marginTop: 14, fontSize: 14, color: MUTED }}>
                  Not quite — this one is <b style={{ color: INK }}>{current.correct}</b>.{" "}
                  <button
                    onClick={advance}
                    className="st-font-body"
                    style={{
                      background: "none",
                      border: "none",
                      color: INK,
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontSize: 14,
                      padding: 0,
                    }}
                  >
                    Next scenario &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .st-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}