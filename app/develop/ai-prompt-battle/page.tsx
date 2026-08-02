'use client';

import { useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import {
  Swords,
  Trophy,
  Flame,
  Target,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Sparkles,
  CircleCheck,
  CircleDashed,
} from 'lucide-react';

const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-mono' });

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/* ============================================================================
   DATA — 100 rounds, generated from recombining subject / setting / style /
   technical-detail banks so every round is a fresh combination. No two
   consecutive rounds repeat the same subject.
   ========================================================================== */

type Difficulty = 'Rookie' | 'Skilled' | 'Elite';
type StatKey = 'clarity' | 'structure' | 'detail' | 'creativity';

interface Problem {
  id: number;
  title: string;
  category: string;
  difficulty: Difficulty;
  imageSeed: string;
  brief: string;
  focus: StatKey;
}

const SUBJECTS = [
  'a red fox', 'an old lighthouse', 'a cyberpunk street vendor', 'a steaming bowl of ramen',
  'a vintage typewriter', 'a hot air balloon', 'a lone samurai', 'a coral reef',
  'a mountain village', 'a robot gardener', 'a jazz musician', 'a paper airplane',
  'a desert caravan', 'a floating city', "a witch's cottage", 'a vintage motorcycle',
  'a thunderstorm over the ocean', 'a bonsai tree', "a knight's armor", 'a space station',
];

const SETTINGS = [
  'at golden hour', 'in heavy fog', 'under neon lights', 'during a snowstorm',
  'at midnight', 'in a bustling market', 'on a rain-soaked street', 'in an abandoned factory',
  'at sunrise over mountains', 'deep underwater',
];

const STYLES = [
  'watercolor painting', '1980s film poster', 'hyper-realistic photograph', 'minimalist line drawing',
  'claymation still', 'pixel-art scene', 'Studio Ghibli-style animation', 'oil painting',
  'charcoal sketch', 'cyberpunk digital art',
];

const TECHNICAL = [
  'shallow depth of field', 'a wide-angle lens', 'dramatic backlighting', 'a long exposure',
  'a macro close-up', "a bird's-eye view", 'silhouette lighting', 'soft diffused light',
  'high-contrast shadows', 'a cinematic lens flare',
];

const CATEGORIES = ['Nature', 'Sci-Fi', 'Fantasy', 'Food', 'Urban', 'Portrait', 'Abstract', 'Architecture', 'Animals', 'Vehicles'];

const BRIEFS = [
  'Describe it precisely enough that two different artists would draw the same scene.',
  'Lead with the single most striking detail in the frame.',
  'Write it the way you would brief a professional illustrator.',
  'Capture the mood first, then the specifics.',
  'Assume the reader has never seen the reference — over-explain nothing, skip nothing.',
  'Prioritize the lighting — it is doing most of the work in this scene.',
  'Treat every word as something you are paying for. No filler.',
  'Give the camera a job: focal length, angle, or framing.',
  'Name the exact palette you see, not just "colorful".',
  'Write it as a single flowing sentence, comma-separated by idea.',
];

const FOCUS_CYCLE: StatKey[] = ['detail', 'structure', 'creativity', 'clarity'];

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildProblems(): Problem[] {
  const problems: Problem[] = [];
  for (let i = 0; i < 100; i++) {
    const cycle = Math.floor(i / 20);
    const subject = SUBJECTS[i % SUBJECTS.length];
    const setting = SETTINGS[(i + cycle * 3) % SETTINGS.length];
    const style = STYLES[(i + cycle * 7) % STYLES.length];
    const technical = TECHNICAL[(i + cycle * 5) % TECHNICAL.length];
    const category = CATEGORIES[(i + cycle * 2) % CATEGORIES.length];
    const difficulty: Difficulty = i < 34 ? 'Rookie' : i < 67 ? 'Skilled' : 'Elite';
    problems.push({
      id: i + 1,
      title: `${cap(subject)} ${setting}`,
      category,
      difficulty,
      imageSeed: `battle-${i + 1}`,
      brief: BRIEFS[i % BRIEFS.length],
      focus: FOCUS_CYCLE[i % FOCUS_CYCLE.length],
    });
  }
  return problems;
}

/* ============================================================================
   SCORING ENGINE — purely heuristic, client-side. Evaluates the CRAFT of a
   prompt (clarity / structure / detail / creativity) rather than matching a
   hidden answer, since there is no vision model in this static tool.
   ========================================================================== */

interface ScoreResult {
  clarity: number;
  structure: number;
  detail: number;
  creativity: number;
  total: number;
  touched: string[];
  missed: string[];
  tips: string[];
}

const VAGUE_WORDS = ['nice', 'good', 'cool', 'stuff', 'thing', 'things', 'pretty', 'beautiful', 'awesome', 'great', 'amazing', 'wow'];

const STYLE_SIGNAL_WORDS = [
  'ethereal', 'surreal', 'dramatic', 'whimsical', 'moody', 'vibrant', 'serene', 'gritty',
  'dreamlike', 'cinematic', 'atmospheric', 'luminous', 'haunting', 'vivid', 'muted', 'ornate',
  'stark', 'lush', 'crisp', 'nostalgic',
];

const TECHNICAL_SIGNAL_WORDS = [
  'lighting', 'lens', 'exposure', 'angle', 'depth', 'field', 'contrast', 'composition',
  'focus', 'perspective', 'shadow', 'shadows', 'highlight', 'highlights', 'render', 'aperture', 'framing',
];

const DETAIL_CATEGORIES: Record<string, string[]> = {
  Color: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'violet', 'pink', 'black', 'white', 'gray', 'grey', 'gold', 'golden', 'silver', 'crimson', 'turquoise', 'amber', 'emerald', 'teal', 'maroon', 'ivory', 'bronze', 'copper', 'indigo'],
  Light: ['light', 'lighting', 'sunlight', 'moonlight', 'shadow', 'shadows', 'glow', 'glowing', 'backlit', 'silhouette', 'dusk', 'dawn', 'sunset', 'sunrise', 'neon', 'ambient', 'harsh', 'soft', 'dim', 'bright', 'luminous', 'flare', 'contrast', 'highlight'],
  Texture: ['rough', 'smooth', 'glossy', 'matte', 'rusty', 'weathered', 'shiny', 'textured', 'grainy', 'silky', 'cracked', 'worn', 'polished', 'fuzzy', 'metallic', 'wooden', 'misty', 'foggy', 'wet', 'dusty'],
  Composition: ['foreground', 'background', 'close-up', 'closeup', 'wide', 'angle', 'perspective', 'symmetry', 'centered', 'framing', 'composition', 'depth', 'field', 'panoramic', 'aerial', 'overhead'],
  Material: ['glass', 'metal', 'stone', 'wood', 'fabric', 'leather', 'paper', 'concrete', 'steel', 'ceramic', 'plastic', 'marble', 'brick', 'sand', 'water', 'ice', 'fur', 'feather'],
  Mood: ['serene', 'eerie', 'dramatic', 'peaceful', 'chaotic', 'melancholic', 'joyful', 'tense', 'mysterious', 'whimsical', 'nostalgic', 'ominous', 'tranquil', 'vibrant', 'somber', 'ethereal'],
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function analyzePrompt(raw: string): ScoreResult {
  const text = raw.trim();
  const lower = text.toLowerCase();
  const words = lower.replace(/[^a-z0-9\s'-]/g, '').split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const uniqueWords = new Set(words);
  const segments = text.split(',').map((s) => s.trim()).filter(Boolean);

  // Clarity
  let clarity = 9;
  if (wordCount >= 8 && wordCount <= 55) clarity += 9;
  else if (wordCount > 0) clarity += 3;
  const vagueHits = words.filter((w) => VAGUE_WORDS.includes(w)).length;
  clarity -= vagueHits * 3;
  if (/[.!?]$/.test(text) || segments.length > 1) clarity += 4;
  if (text.length > 10 && text === text.toUpperCase()) clarity -= 6;
  if (wordCount > 0) clarity += 3;
  clarity = clamp(clarity, 0, 25);

  // Structure
  let structure = 4;
  structure += Math.max(0, 12 - Math.abs(segments.length - 4) * 3);
  const hasTechnical = TECHNICAL_SIGNAL_WORDS.some((w) => lower.includes(w));
  const hasStyle = STYLE_SIGNAL_WORDS.some((w) => lower.includes(w));
  if (hasTechnical) structure += 5;
  if (hasStyle) structure += 4;
  structure = clamp(structure, 0, 25);

  // Detail
  const touched: string[] = [];
  const missed: string[] = [];
  let categoryHits = 0;
  Object.entries(DETAIL_CATEGORIES).forEach(([label, bank]) => {
    const hit = bank.some((w) => lower.includes(w));
    if (hit) {
      touched.push(label);
      categoryHits += 1;
    } else {
      missed.push(label);
    }
  });
  let detail = Math.round((categoryHits / 6) * 15);
  if (wordCount >= 15) detail += 5;
  else if (wordCount >= 8) detail += 2;
  if (uniqueWords.size >= 14) detail += 5;
  detail = clamp(detail, 0, 25);

  // Creativity
  const uniqueRatio = wordCount ? uniqueWords.size / wordCount : 0;
  let creativity = Math.round(uniqueRatio * 9);
  const styleHits = STYLE_SIGNAL_WORDS.filter((w) => lower.includes(w)).length;
  creativity += Math.min(styleHits * 4, 12);
  const longWords = words.filter((w) => w.length > 7);
  creativity += Math.min(new Set(longWords).size * 2, 4);
  creativity = clamp(creativity, 0, 25);

  const total = clarity + structure + detail + creativity;

  const tips: string[] = [];
  if (clarity < 15) tips.push('Write one clean descriptive line instead of scattered keywords.');
  if (structure < 15) tips.push('Separate subject, setting, style, and lighting with commas — aim for ~4 parts.');
  if (detail < 15) tips.push('Name specific colors, textures, or materials you can actually picture.');
  if (creativity < 15) tips.push('Push past the obvious words — reach for mood and atmosphere.');
  if (tips.length === 0) tips.push('Strong all-round prompt. Try an even punchier opening next round.');

  return { clarity, structure, detail, creativity, total, touched, missed, tips };
}

function getRank(total: number) {
  if (total >= 90) return { label: 'LEGENDARY', light: '#B45309', dark: '#34D399' };
  if (total >= 75) return { label: 'S-TIER', light: '#7C3AED', dark: '#A78BFA' };
  if (total >= 60) return { label: 'SOLID HIT', light: '#B45309', dark: '#FBBF24' };
  if (total >= 40) return { label: 'GRAZING BLOW', light: '#B45309', dark: '#FBBF24' };
  return { label: 'MISSED', light: '#DC2626', dark: '#F87171' };
}

const STAT_META: Record<StatKey, { label: string; light: string; dark: string }> = {
  clarity: { label: 'Clarity', light: '#2563EB', dark: '#60A5FA' },
  structure: { label: 'Structure', light: '#7C3AED', dark: '#A78BFA' },
  detail: { label: 'Detail', light: '#B45309', dark: '#FBBF24' },
  creativity: { label: 'Creativity', light: '#DB2777', dark: '#F472B6' },
};

/* ============================================================================
   COMPONENT
   ========================================================================== */

export default function AIPromptBattlePage() {
  const problems = useMemo(() => buildProblems(), []);
  const [index, setIndex] = useState(0);
  const [promptText, setPromptText] = useState('');
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ played: 0, totalScore: 0, best: 0, streak: 0 });

  const problem = problems[index];

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('ai-prompt-battle-stats-v1');
      if (saved) setStats(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('ai-prompt-battle-stats-v1', JSON.stringify(stats));
    } catch {
      /* ignore */
    }
  }, [stats, mounted]);

  const goTo = useCallback(
    (newIndex: number) => {
      const len = problems.length;
      setIndex(((newIndex % len) + len) % len);
      setPromptText('');
      setResult(null);
    },
    [problems.length]
  );

  const handleSubmit = useCallback(() => {
    if (!promptText.trim()) return;
    const r = analyzePrompt(promptText);
    setResult(r);
    setStats((prev) => ({
      played: prev.played + 1,
      totalScore: prev.totalScore + r.total,
      best: Math.max(prev.best, r.total),
      streak: r.total >= 60 ? prev.streak + 1 : 0,
    }));
  }, [promptText]);

  const avgScore = stats.played ? Math.round(stats.totalScore / stats.played) : 0;
  const rank = result ? getRank(result.total) : null;
  const progressPct = Math.round(((index + 1) / problems.length) * 100);

  const displayFont = { fontFamily: 'var(--font-display)' };
  const monoFont = { fontFamily: 'var(--font-mono)' };

  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-white dark:bg-[#0a0e14] text-[#15131d] dark:text-[#f1eef7] transition-colors duration-300`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* ---------- HEADER ---------- */}
      <header className="border-b border-black/10 dark:border-white/10 px-5 sm:px-8 py-4 flex items-center justify-between gap-4 flex-wrap sticky top-0 z-20 bg-white/90 dark:bg-[#0a0e14]/90 backdrop-blur transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-amber-500/10 dark:bg-[#34d399]/10 border border-amber-500/30 dark:border-[#34d399]/30">
            <Swords size={18} className="text-amber-600 dark:text-[#34d399]" />
          </div>
          <div>
            <div className="text-lg sm:text-xl tracking-tight leading-none" style={displayFont}>
              PROMPT<span className="text-amber-600 dark:text-[#34d399]">//</span>BATTLE
            </div>
            <div className="text-[11px] text-[#726e80] dark:text-[#8b889c] tracking-widest uppercase mt-0.5">
              Write the words. Beat the machine.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm" style={monoFont}>
          <Stat icon={<Target size={13} />} label="Played" value={stats.played} />
          <Stat icon={<TrendingUp size={13} />} label="Avg" value={avgScore} />
          <Stat icon={<Trophy size={13} />} label="Best" value={stats.best} />
          <Stat icon={<Flame size={13} />} label="Streak" value={stats.streak} accent />
        </div>
      </header>

      {/* ---------- PROGRESS ---------- */}
      <div className="px-5 sm:px-8 pt-4">
        <div className="flex items-center justify-between text-xs text-[#726e80] dark:text-[#8b889c] mb-1.5" style={monoFont}>
          <span>
            ROUND {String(problem.id).padStart(3, '0')} / {problems.length}
          </span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-black/[0.06] dark:bg-white/[0.05] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-amber-500 dark:bg-[#34d399]"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ---------- MAIN ARENA ---------- */}
      <main className="px-5 sm:px-8 py-6 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={problem.id}
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={fadeUp}
            className="relative grid md:grid-cols-2 gap-6 items-start"
          >
            {/* VS badge */}
            <div className="hidden md:flex absolute left-1/2 top-24 -translate-x-1/2 z-10 w-12 h-12 rounded-full items-center justify-center border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117] text-xs tracking-widest shadow-sm transition-colors duration-300" style={monoFont}>
              VS
            </div>

            {/* Image panel — terminal chrome */}
            <TerminalPanel>
              <div className="relative">
                <img
                  src={`https://picsum.photos/seed/${problem.imageSeed}/760/560`}
                  alt="AI-served reference image for this round"
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge>{problem.category}</Badge>
                  <Badge tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Badge>
                </div>
                <div className="absolute bottom-3 right-3">
                  <Badge tone="accent">
                    <Sparkles size={11} className="inline -mt-0.5 mr-1" />
                    Focus: {STAT_META[problem.focus].label}
                  </Badge>
                </div>
              </div>
              <div className="p-4 border-t border-black/10 dark:border-white/10 transition-colors duration-300">
                <div className="text-[11px] uppercase tracking-widest text-[#726e80] dark:text-[#8b889c] mb-1" style={monoFont}>
                  AI served this. Your move:
                </div>
                <p className="text-sm text-[#413d4e] dark:text-[#d8d5e3] leading-relaxed">{problem.brief}</p>
              </div>
            </TerminalPanel>

            {/* Prompt panel — terminal chrome */}
            <TerminalPanel bodyClassName="p-4 sm:p-5 flex flex-col gap-3">
              <label className="text-[11px] uppercase tracking-widest text-[#726e80] dark:text-[#8b889c]" style={monoFont}>
                Your prompt
              </label>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Describe the image so precisely an AI could recreate it — subject, setting, style, lighting..."
                rows={7}
                className="w-full resize-none rounded-xl bg-[#f7f8fa] dark:bg-[#0a0e14] border border-black/10 dark:border-white/10 focus:border-amber-500 dark:focus:border-[#34d399] focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-[#34d399]/20 px-4 py-3 text-sm leading-relaxed text-[#15131d] dark:text-[#f1eef7] placeholder:text-[#a19dae] dark:placeholder:text-[#5c5a6b] transition-colors"
              />
              <div className="flex items-center justify-between text-xs text-[#a19dae] dark:text-[#5c5a6b]" style={monoFont}>
                <span>{promptText.trim() ? promptText.trim().split(/\s+/).length : 0} words</span>
                <span>{promptText.length} chars</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!promptText.trim()}
                className="mt-1 w-full rounded-xl py-3 text-sm font-semibold tracking-wide uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-amber-500 dark:bg-[#34d399] text-white dark:text-[#0a0e14] hover:brightness-105 active:scale-[0.99]"
                style={displayFont}
              >
                Throw Prompt
              </button>

              {/* Scoreboard */}
              <AnimatePresence>
                {result && rank && (
                  <motion.div
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    variants={fadeUp}
                    className="mt-2 rounded-xl border border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0a0e14] p-4 flex flex-col gap-4 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] uppercase tracking-widest text-[#726e80] dark:text-[#8b889c]" style={monoFont}>
                          Result
                        </div>
                        <div className="text-2xl" style={displayFont}>
                          <span className="dark:hidden" style={{ color: rank.light }}>
                            {rank.label}
                          </span>
                          <span className="hidden dark:inline" style={{ color: rank.dark }}>
                            {rank.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] uppercase tracking-widest text-[#726e80] dark:text-[#8b889c]" style={monoFont}>
                          Score
                        </div>
                        <div className="text-3xl" style={monoFont}>
                          {result.total}
                          <span className="text-sm text-[#a19dae] dark:text-[#5c5a6b]">/100</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {(Object.keys(STAT_META) as StatKey[]).map((key) => (
                        <ScoreBar
                          key={key}
                          label={STAT_META[key].label}
                          value={result[key]}
                          lightColor={STAT_META[key].light}
                          darkColor={STAT_META[key].dark}
                          isFocus={key === problem.focus}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-[#726e80] dark:text-[#8b889c] mb-1 uppercase tracking-widest flex items-center gap-1" style={monoFont}>
                          <CircleCheck size={12} /> Detail hit
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {result.touched.length ? (
                            result.touched.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#34d399] border border-emerald-500/30 dark:border-[#34d399]/30"
                              >
                                {t}
                              </span>
                            ))
                          ) : (
                            <span className="text-[#a19dae] dark:text-[#5c5a6b]">none yet</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-[#726e80] dark:text-[#8b889c] mb-1 uppercase tracking-widest flex items-center gap-1" style={monoFont}>
                          <CircleDashed size={12} /> Still missing
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {result.missed.length ? (
                            result.missed.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.05] text-[#726e80] dark:text-[#8b889c] border border-black/10 dark:border-white/10"
                              >
                                {t}
                              </span>
                            ))
                          ) : (
                            <span className="text-[#a19dae] dark:text-[#5c5a6b]">nailed everything</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ul className="text-sm text-[#413d4e] dark:text-[#d8d5e3] leading-relaxed list-disc list-inside space-y-1">
                      {result.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => goTo(index - 1)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs uppercase tracking-widest border border-black/10 dark:border-white/10 text-[#726e80] dark:text-[#8b889c] hover:text-[#15131d] dark:hover:text-[#f1eef7] hover:border-black/25 dark:hover:border-white/25 transition-colors"
                  style={monoFont}
                >
                  <ArrowLeft size={13} /> Prev
                </button>
                <button
                  onClick={() => goTo(Math.floor(Math.random() * problems.length))}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs uppercase tracking-widest border border-black/10 dark:border-white/10 text-[#726e80] dark:text-[#8b889c] hover:text-[#15131d] dark:hover:text-[#f1eef7] hover:border-black/25 dark:hover:border-white/25 transition-colors"
                  style={monoFont}
                >
                  <Shuffle size={13} /> Shuffle
                </button>
                <button
                  onClick={() => goTo(index + 1)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs uppercase tracking-widest border border-black/10 dark:border-white/10 text-[#726e80] dark:text-[#8b889c] hover:text-[#15131d] dark:hover:text-[#f1eef7] hover:border-black/25 dark:hover:border-white/25 transition-colors"
                  style={monoFont}
                >
                  Next <ArrowRight size={13} />
                </button>
              </div>
            </TerminalPanel>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="px-5 sm:px-8 py-8 text-center text-[11px] text-[#a19dae] dark:text-[#5c5a6b]" style={monoFont}>
        Scoring is a heuristic practice tool for prompt-writing craft — not a real vision model.
      </footer>

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.001ms !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ---------- small presentational helpers ---------- */

function TerminalPanel({
  children,
  bodyClassName,
}: {
  children: ReactNode;
  bodyClassName?: string;
}) {
  return (
    <section className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#0d1117] shadow-[0_1px_2px_rgba(21,19,29,0.04),0_10px_30px_rgba(21,19,29,0.06)] dark:shadow-none transition-colors duration-300">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-black/10 dark:border-white/10 bg-[#f7f8fa] dark:bg-[#0a0e14]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`hidden sm:inline ${accent ? 'text-amber-600 dark:text-[#34d399]' : 'text-[#a19dae] dark:text-[#5c5a6b]'}`}>
        {icon}
      </span>
      <span className="text-[#a19dae] dark:text-[#5c5a6b] uppercase tracking-widest text-[10px]">{label}</span>
      <span className={accent ? 'text-amber-600 dark:text-[#34d399] font-semibold' : ''}>{value}</span>
    </div>
  );
}

function Badge({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'good' | 'warn' | 'bad' | 'accent';
}) {
  const toneClasses: Record<string, string> = {
    default: 'text-white bg-black/50 border-white/20',
    good: 'text-white bg-emerald-600/70 border-emerald-300/40',
    warn: 'text-white bg-amber-600/70 border-amber-300/40',
    bad: 'text-white bg-red-600/70 border-red-300/40',
    accent: 'text-white bg-black/50 border-amber-300/40 dark:border-[#34d399]/40',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest backdrop-blur border ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

function ScoreBar({
  label,
  value,
  lightColor,
  darkColor,
  isFocus,
}: {
  label: string;
  value: number;
  lightColor: string;
  darkColor: string;
  isFocus?: boolean;
}) {
  const pct = Math.round((value / 25) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="flex items-center gap-1.5 text-[#413d4e] dark:text-[#d8d5e3]">
          {label}
          {isFocus && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 dark:bg-[#34d399]/10 text-amber-600 dark:text-[#34d399] border border-amber-500/30 dark:border-[#34d399]/30 uppercase tracking-widest">
              focus
            </span>
          )}
        </span>
        <span className="dark:hidden" style={{ fontFamily: 'var(--font-mono)', color: lightColor }}>
          {value}/25
        </span>
        <span className="hidden dark:inline" style={{ fontFamily: 'var(--font-mono)', color: darkColor }}>
          {value}/25
        </span>
      </div>
      <div className="h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.05] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700 dark:hidden" style={{ width: `${pct}%`, backgroundColor: lightColor }} />
        <div className="h-full rounded-full transition-all duration-700 hidden dark:block" style={{ width: `${pct}%`, backgroundColor: darkColor }} />
      </div>
    </div>
  );
}

function difficultyTone(d: Difficulty): 'good' | 'warn' | 'bad' {
  if (d === 'Rookie') return 'good';
  if (d === 'Skilled') return 'warn';
  return 'bad';
}