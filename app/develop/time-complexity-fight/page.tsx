"use client";

import { useMemo, useState } from "react";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import {
  ALL_COMPLEXITIES,
  fightQuestions,
  getEnemyName,
  type Complexity,
  type FightQuestion,
} from "./questions";

const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

// ---------------------------------------------------------------------------
// Small deterministic helpers — every enemy name always renders the same
// jagged silhouette and hue, so recurring foes (Loop Lurker, Hashmap Hydra…)
// become recognizable the more you play, without ever hinting at the answer.
// ---------------------------------------------------------------------------

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function mulberry32(seed: number) {
  let s = seed;
  return function rand() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function monsterSprite(name: string) {
  const seed = hashString(name);
  const rand = mulberry32(seed);
  const spikes = 6 + Math.floor(rand() * 4); // 6-9 spikes
  const hue = Math.floor(rand() * 360);
  const total = spikes * 2;
  const points: string[] = [];
  for (let i = 0; i < total; i++) {
    const angle = (Math.PI * 2 * i) / total;
    const isOuter = i % 2 === 0;
    const base = isOuter ? 36 : 20;
    const r = base + rand() * 9;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const eyeOffset = 8 + rand() * 4;
  return { points: points.join(" "), hue, eyeOffset };
}

function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildOptions(correct: Complexity): Complexity[] {
  const distractors = shuffle(
    ALL_COMPLEXITIES.filter((c) => c !== correct)
  ).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

// ---------------------------------------------------------------------------

type GameState = "start" | "playing" | "gameover" | "victory";
type AnimState = "idle" | "hit-enemy" | "hit-player";
type EndVariant = "bad" | "good";

const PLAYER_MAX_HP = 100;
const DAMAGE_TO_PLAYER = 20;

export default function Page() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [order, setOrder] = useState<FightQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [playerHP, setPlayerHP] = useState(PLAYER_MAX_HP);
  const [enemyHP, setEnemyHP] = useState(100);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [locked, setLocked] = useState(false);
  const [animState, setAnimState] = useState<AnimState>("idle");
  const [feedback, setFeedback] = useState<
    { correct: boolean; chosen: Complexity } | null
  >(null);

  const currentQuestion = order[qIndex];

  const enemyName = useMemo(
    () => (currentQuestion ? getEnemyName(currentQuestion.id) : ""),
    [currentQuestion]
  );

  const sprite = useMemo(
    () => (enemyName ? monsterSprite(enemyName) : null),
    [enemyName]
  );

  const options = useMemo(
    () => (currentQuestion ? buildOptions(currentQuestion.correct) : []),
    [currentQuestion]
  );

  function startGame() {
    setOrder(shuffle(fightQuestions));
    setQIndex(0);
    setPlayerHP(PLAYER_MAX_HP);
    setEnemyHP(100);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setLocked(false);
    setAnimState("idle");
    setFeedback(null);
    setGameState("playing");
  }

  function advance(nextIndex: number) {
    setFeedback(null);
    setAnimState("idle");
    if (nextIndex >= order.length) {
      setGameState("victory");
      return;
    }
    setQIndex(nextIndex);
    setEnemyHP(100);
    setLocked(false);
  }

  function handleAttack(choice: Complexity) {
    if (locked || !currentQuestion) return;
    setLocked(true);
    const isCorrect = choice === currentQuestion.correct;
    setFeedback({ correct: isCorrect, chosen: choice });

    if (isCorrect) {
      setAnimState("hit-enemy");
      setEnemyHP(0);
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
      window.setTimeout(() => advance(qIndex + 1), 750);
    } else {
      const newHP = Math.max(0, playerHP - DAMAGE_TO_PLAYER);
      setAnimState("hit-player");
      setPlayerHP(newHP);
      setStreak(0);
      window.setTimeout(() => {
        if (newHP <= 0) {
          setFeedback(null);
          setGameState("gameover");
        } else {
          advance(qIndex + 1);
        }
      }, 900);
    }
  }

  return (
    <div
      className={`${pixel.variable} ${mono.variable} min-h-screen w-full bg-white dark:bg-[#0B0710] text-[#171022] dark:text-[#F3ECFF] font-[family-name:var(--font-mono)] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300`}
    >
      <ScanlineOverlay />
      <FlashOverlay animState={animState} />

      <div className="relative z-10 w-full max-w-xl">
        {gameState === "start" && <StartScreen onStart={startGame} />}

        {gameState === "playing" && currentQuestion && sprite && (
          <BattleScreen
            question={currentQuestion}
            enemyName={enemyName}
            sprite={sprite}
            options={options}
            playerHP={playerHP}
            enemyHP={enemyHP}
            score={score}
            streak={streak}
            qNumber={qIndex + 1}
            qTotal={order.length}
            animState={animState}
            feedback={feedback}
            locked={locked}
            onAttack={handleAttack}
          />
        )}

        {gameState === "gameover" && (
          <EndScreen
            title="YOU HAVE BEEN OVERRUN"
            variant="bad"
            lines={[
              `Complexities defeated: ${qIndex}`,
              `Final score: ${score}`,
              `Best streak: ${bestStreak}`,
            ]}
            cta="TRY AGAIN"
            onAction={startGame}
          />
        )}

        {gameState === "victory" && (
          <EndScreen
            title="ALL THREATS ELIMINATED"
            variant="good"
            lines={[
              `Complexities defeated: ${order.length}`,
              `Final score: ${score}`,
              `Best streak: ${bestStreak}`,
            ]}
            cta="FIGHT AGAIN"
            onAction={startGame}
          />
        )}
      </div>

      <GlobalStyles />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="border-2 border-[#E3DEF0] dark:border-[#2E2140] bg-[#F7F5FC] dark:bg-[#171022] rounded-md p-8 text-center shadow-[0_10px_30px_rgba(23,17,34,0.06)] dark:shadow-[0_0_40px_rgba(198,255,61,0.08)] transition-colors duration-300">
      <p className="font-[family-name:var(--font-pixel)] text-[10px] tracking-widest text-[#6E6485] dark:text-[#9C8FBF] mb-6">
        A DSA ARCADE
      </p>
      <h1 className="font-[family-name:var(--font-pixel)] text-2xl leading-relaxed text-[#5C9C00] dark:text-[#C6FF3D] mb-6">
        TIME
        <br />
        COMPLEXITY
        <br />
        FIGHT
      </h1>
      <p className="text-sm text-[#6E6485] dark:text-[#9C8FBF] leading-relaxed mb-8 max-w-sm mx-auto">
        Every algorithm has a weakness: the rate it grows. Name it before the
        beast finishes growing. Pick wrong and it hits back.
      </p>
      <button
        onClick={onStart}
        className="font-[family-name:var(--font-pixel)] text-xs bg-[#C6FF3D] text-[#0B0710] px-6 py-4 rounded-sm hover:bg-[#d9ff70] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3DE8FF] transition-colors animate-blink-slow"
      >
        ▶ PRESS START
      </button>
      <p className="mt-6 text-[11px] text-[#8A8199] dark:text-[#5C4F7A]">
        {fightQuestions.length} enemies · 8 growth classes · 100 HP
      </p>
    </div>
  );
}

function EndScreen({
  title,
  variant,
  lines,
  cta,
  onAction,
}: {
  title: string;
  variant: EndVariant;
  lines: string[];
  cta: string;
  onAction: () => void;
}) {
  const titleClasses =
    variant === "bad"
      ? "text-[#D6236F] dark:text-[#FF3D7F]"
      : "text-[#5C9C00] dark:text-[#C6FF3D]";
  return (
    <div className="border-2 border-[#E3DEF0] dark:border-[#2E2140] bg-[#F7F5FC] dark:bg-[#171022] rounded-md p-8 text-center transition-colors duration-300">
      <h2
        className={`font-[family-name:var(--font-pixel)] text-base leading-relaxed mb-6 ${titleClasses}`}
      >
        {title}
      </h2>
      <div className="space-y-2 mb-8 text-sm text-[#372F52] dark:text-[#D6CCF0]">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <button
        onClick={onAction}
        className="font-[family-name:var(--font-pixel)] text-xs bg-[#3DE8FF] text-[#0B0710] px-6 py-4 rounded-sm hover:bg-[#7ef1ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C6FF3D] transition-colors"
      >
        {cta}
      </button>
    </div>
  );
}

function BattleScreen({
  question,
  enemyName,
  sprite,
  options,
  playerHP,
  enemyHP,
  score,
  streak,
  qNumber,
  qTotal,
  animState,
  feedback,
  locked,
  onAttack,
}: {
  question: FightQuestion;
  enemyName: string;
  sprite: { points: string; hue: number; eyeOffset: number };
  options: Complexity[];
  playerHP: number;
  enemyHP: number;
  score: number;
  streak: number;
  qNumber: number;
  qTotal: number;
  animState: AnimState;
  feedback: { correct: boolean; chosen: Complexity } | null;
  locked: boolean;
  onAttack: (c: Complexity) => void;
}) {
  return (
    <div
      className={`border-2 border-[#E3DEF0] dark:border-[#2E2140] bg-[#F7F5FC] dark:bg-[#171022] rounded-md overflow-hidden transition-colors duration-300 ${
        animState === "hit-player" ? "animate-shake" : ""
      }`}
    >
      {/* status bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#EFEAFA] dark:bg-[#120C1B] text-[10px] font-[family-name:var(--font-pixel)] border-b border-[#E3DEF0] dark:border-[#2E2140] transition-colors duration-300">
        <span className="text-[#0E90A8] dark:text-[#3DE8FF]">
          SCORE {String(score).padStart(4, "0")}
        </span>
        <span className="text-[#B36A00] dark:text-[#FFB93D]">
          {qNumber}/{qTotal}
        </span>
        <span className="text-[#5C9C00] dark:text-[#C6FF3D]">STREAK ×{streak}</span>
      </div>

      {/* enemy */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[#372F52] dark:text-[#D6CCF0] uppercase tracking-wide">
            {enemyName}
          </span>
          <span className="text-[10px] text-[#6E6485] dark:text-[#9C8FBF]">
            {enemyHP}/100
          </span>
        </div>
        <HPBar value={enemyHP} tone="enemy" />

        <div className="flex justify-center my-5">
          <svg
            viewBox="0 0 100 100"
            className={`w-28 h-28 ${
              animState === "hit-enemy" ? "animate-enemy-defeat" : "animate-float"
            }`}
          >
            <polygon
              points={sprite.points}
              fill={`hsl(${sprite.hue} 70% 55%)`}
              stroke={`hsl(${sprite.hue} 70% 75%)`}
              strokeWidth="1.5"
            />
            <circle
              cx={50 - sprite.eyeOffset}
              cy="46"
              r="3.2"
              fill="#0B0710"
            />
            <circle
              cx={50 + sprite.eyeOffset}
              cy="46"
              r="3.2"
              fill="#0B0710"
            />
          </svg>
        </div>
      </div>

      {/* dialogue box */}
      <div className="mx-6 mb-5 border border-[#E3DEF0] dark:border-[#2E2140] bg-[#F1EDFA] dark:bg-[#0F0A17] rounded-sm p-4 transition-colors duration-300">
        <p className="text-[10px] font-[family-name:var(--font-pixel)] text-[#6E6485] dark:text-[#9C8FBF] mb-3">
          ⚔ SCENARIO #{question.id}
        </p>
        <p className="text-sm leading-relaxed text-[#171022] dark:text-[#F3ECFF]">
          {question.scenario}
        </p>
      </div>

      {/* weapon grid */}
      <div className="grid grid-cols-2 gap-3 px-6">
        {options.map((opt) => {
          const isChosen = feedback?.chosen === opt;
          const isCorrectAnswer = feedback && opt === question.correct;
          let stateClasses =
            "bg-white dark:bg-[#1F1830] border-[#DAD3EC] dark:border-[#3A2C55] text-[#171022] dark:text-[#F3ECFF] hover:border-[#0E90A8] dark:hover:border-[#3DE8FF] hover:bg-[#F1EDFA] dark:hover:bg-[#241B38]";
          if (feedback) {
            if (isCorrectAnswer) {
              stateClasses =
                "bg-[#EAF6D9] dark:bg-[#22331A] border-[#5C9C00] dark:border-[#C6FF3D] text-[#4C8500] dark:text-[#C6FF3D]";
            } else if (isChosen) {
              stateClasses =
                "bg-[#FBE1EA] dark:bg-[#33101C] border-[#D6236F] dark:border-[#FF3D7F] text-[#B01C5C] dark:text-[#FF3D7F]";
            } else {
              stateClasses =
                "bg-[#F1EDFA] dark:bg-[#1A1526] border-[#E3DEF0] dark:border-[#2E2140] text-[#171022] dark:text-[#F3ECFF] opacity-40";
            }
          }
          return (
            <button
              key={opt}
              disabled={locked}
              onClick={() => onAttack(opt)}
              className={`font-[family-name:var(--font-pixel)] text-[11px] py-4 rounded-sm border-2 transition-colors duration-150 disabled:cursor-not-allowed ${stateClasses}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* player */}
      <div className="px-6 py-5 mt-5 bg-[#EFEAFA] dark:bg-[#120C1B] border-t border-[#E3DEF0] dark:border-[#2E2140] transition-colors duration-300">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[#372F52] dark:text-[#D6CCF0] uppercase tracking-wide">
            You
          </span>
          <span className="text-[10px] text-[#6E6485] dark:text-[#9C8FBF]">
            {playerHP}/{PLAYER_MAX_HP}
          </span>
        </div>
        <HPBar value={playerHP} tone="player" />
      </div>
    </div>
  );
}

function HPBar({ value, tone }: { value: number; tone: "enemy" | "player" }) {
  const fillClasses =
    tone === "enemy"
      ? "bg-[#D6236F] dark:bg-[#FF3D7F]"
      : "bg-[#5C9C00] dark:bg-[#C6FF3D]";
  const trackClasses =
    tone === "enemy"
      ? "bg-[#FBE1EA] dark:bg-[#3A1A2A]"
      : "bg-[#E5F3D6] dark:bg-[#243318]";
  return (
    <div className={`h-3 rounded-full overflow-hidden transition-colors duration-300 ${trackClasses}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${fillClasses}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function ScanlineOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 opacity-[0.035] dark:opacity-[0.08] transition-opacity duration-300"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 3px)",
      }}
    />
  );
}

function FlashOverlay({ animState }: { animState: AnimState }) {
  if (animState === "idle") return null;
  const color = animState === "hit-enemy" ? "#C6FF3D" : "#FF3D7F";
  return (
    <div
      key={animState}
      className="pointer-events-none fixed inset-0 z-30 animate-flash"
      style={{ backgroundColor: color }}
    />
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      @keyframes flash {
        0% {
          opacity: 0.25;
        }
        100% {
          opacity: 0;
        }
      }
      .animate-flash {
        animation: flash 0.35s ease-out forwards;
      }

      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
        20% {
          transform: translateX(-6px);
        }
        40% {
          transform: translateX(6px);
        }
        60% {
          transform: translateX(-4px);
        }
        80% {
          transform: translateX(4px);
        }
      }
      .animate-shake {
        animation: shake 0.4s ease-in-out;
      }

      @keyframes enemy-defeat {
        0% {
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
        60% {
          transform: scale(1.15) rotate(8deg);
          opacity: 1;
        }
        100% {
          transform: scale(0) rotate(30deg);
          opacity: 0;
        }
      }
      .animate-enemy-defeat {
        animation: enemy-defeat 0.7s ease-in forwards;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-4px);
        }
      }
      .animate-float {
        animation: float 2.4s ease-in-out infinite;
      }

      @keyframes blink-slow {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }
      .animate-blink-slow {
        animation: blink-slow 1.6s ease-in-out infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .animate-flash,
        .animate-shake,
        .animate-enemy-defeat,
        .animate-float,
        .animate-blink-slow {
          animation: none !important;
        }
      }
    `}</style>
  );
}