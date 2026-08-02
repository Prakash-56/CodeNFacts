'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal, Rss, Handshake, Gamepad2, RotateCcw } from 'lucide-react';

// TODO: replace with your actual channel URL
const YOUTUBE_URL = 'https://www.youtube.com/@codenfacts';

const LOG_LINES = [
  { text: '$ curl https://codenfacts.dev/this-page', delay: 0 },
  { text: '> Building something better here...', delay: 900 },
  { text: '> Status: 🚧 under construction', delay: 1600 },
];

/* ---------- Chrome-dino-style runner mini game ---------- */
function RunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = document.documentElement.classList.contains('dark');
    const fg = isDark ? '#34d399' : '#78350f';
    const groundY = 110;

    let animationId: number;
    let running = true;
    let speed = 6;
    let frame = 0;
    let currentScore = 0;

    const player = { x: 30, y: groundY - 24, w: 20, h: 24, vy: 0, jumping: false };
    let obstacles: { x: number; w: number; h: number }[] = [];

    const jump = () => {
      if (!player.jumping && running) {
        player.vy = -11;
        player.jumping = true;
      }
    };

    const reset = () => {
      obstacles = [];
      frame = 0;
      speed = 6;
      currentScore = 0;
      player.y = groundY - player.h;
      player.vy = 0;
      player.jumping = false;
      running = true;
      setGameOver(false);
      setScore(0);
    };

    const loop = () => {
      if (!running) return;
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ground
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();

      // gravity
      player.vy += 0.6;
      player.y += player.vy;
      if (player.y > groundY - player.h) {
        player.y = groundY - player.h;
        player.vy = 0;
        player.jumping = false;
      }

      // spawn obstacles
      if (frame % Math.max(50 - Math.floor(speed), 30) === 0) {
        const h = 18 + Math.random() * 14;
        obstacles.push({ x: canvas.width, w: 12, h });
      }

      // move + draw obstacles
      ctx.fillStyle = fg;
      obstacles.forEach((o) => (o.x -= speed));
      obstacles = obstacles.filter((o) => o.x + o.w > 0);
      obstacles.forEach((o) => ctx.fillRect(o.x, groundY - o.h, o.w, o.h));

      // draw player
      ctx.fillRect(player.x, player.y, player.w, player.h);

      // collision
      for (const o of obstacles) {
        if (
          player.x < o.x + o.w &&
          player.x + player.w > o.x &&
          player.y + player.h > groundY - o.h
        ) {
          running = false;
          setGameOver(true);
          setBest((b) => Math.max(b, currentScore));
        }
      }

      // score + difficulty
      if (frame % 6 === 0) currentScore += 1;
      setScore(currentScore);
      if (frame % 200 === 0) speed += 0.5;

      if (running) animationId = requestAnimationFrame(loop);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!running) {
          reset();
          animationId = requestAnimationFrame(loop);
        } else {
          jump();
        }
      }
    };
    const handleClick = () => {
      if (!running) {
        reset();
        animationId = requestAnimationFrame(loop);
      } else {
        jump();
      }
    };

    window.addEventListener('keydown', handleKey);
    canvas.addEventListener('mousedown', handleClick);
    canvas.addEventListener('touchstart', handleClick);

    if (started) animationId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKey);
      canvas.removeEventListener('mousedown', handleClick);
      canvas.removeEventListener('touchstart', handleClick);
    };
  }, [started]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
        <span>score: {score}</span>
        <span>best: {best}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={560}
        height={130}
        onClick={() => !started && setStarted(true)}
        className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0d1117] cursor-pointer touch-none"
      />
      <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 font-mono">
        {!started && <span>click the box or press Space to start</span>}
        {started && !gameOver && <span>Space / tap to jump</span>}
        {gameOver && (
          <span className="flex items-center gap-1 text-amber-600 dark:text-emerald-400">
            <RotateCcw size={12} /> game over — press Space or tap to retry
          </span>
        )}
      </div>
    </div>
  );
}

export default function NotFound() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timers = LOG_LINES.map((_, i) =>
      setTimeout(() => setVisibleLines((v) => v + 1), LOG_LINES[i].delay)
    );
    const contentTimer = setTimeout(() => setShowContent(true), 2200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-24 bg-white dark:bg-[#0a0e14] transition-colors">
      <div className="w-full max-w-2xl">

        {/* Terminal chrome header, matching site convention */}
        <div className="rounded-t-lg border border-b-0 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-4 py-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-3 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            <Terminal size={12} />
            codenfacts — building
          </span>
        </div>

        {/* Terminal body */}
        <div className="rounded-b-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0d1117] px-6 py-10 font-mono text-sm sm:text-base">
          {LOG_LINES.map((line, i) => (
            <motion.div
              key={line.text}
              initial={{ opacity: 0 }}
              animate={{ opacity: i < visibleLines ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-neutral-700 dark:text-neutral-300"
            >
              {line.text}
            </motion.div>
          ))}

          {/* Blinking cursor while typing */}
          {visibleLines < LOG_LINES.length && (
            <span className="inline-block w-2 h-4 bg-amber-600 dark:bg-emerald-400 ml-0.5 animate-pulse" />
          )}

          {/* Under construction content */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 8 }}
            transition={{ duration: 0.4 }}
            className="mt-8"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl">🚧</span>
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                Under Construction
              </span>
            </div>

            <p className="mt-4 text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xl">
              For a better experience and practical learning, we're working hard under the hood.
              Stay connected with us for cracking your next interview.
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-medium text-white dark:text-[#0a0e14] bg-amber-600 dark:bg-emerald-400 hover:bg-amber-700 dark:hover:bg-emerald-300 transition-colors"
            >
              <Rss size={16} />
              Connect / Subscribe
            </a>

            <Link
              href="/work-with-us"
              className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-amber-500 dark:hover:border-emerald-400 hover:bg-amber-50/50 dark:hover:bg-emerald-400/5 transition-colors"
            >
              <Handshake size={16} />
              Work With Us
            </Link>
          </motion.div>

          {/* Mini game while they wait */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800"
          >
            <p className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-1">
              <Gamepad2 size={14} />
              bored while waiting? play a quick round
            </p>
            <RunnerGame />
          </motion.div>
        </div>
      </div>
    </main>
  );
}