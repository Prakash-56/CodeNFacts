'use client';

/**
 * REGEX NINJA — /develop/regex-ninza/page.tsx
 * -----------------------------------------------------------------------
 * A self-contained dojo where regex patterns "slice" flying strings.
 *
 * Setup notes:
 * 1. Requires Tailwind CSS with `darkMode: 'class'` in tailwind.config.
 *    The toggle in the header adds/removes the `dark` class on <html>.
 * 2. Fonts load via next/font/google — no extra installs needed.
 * 3. No external UI/icon libraries — every icon here is inline SVG,
 *    so this file drops into any Next.js (App Router) project as-is.
 * -----------------------------------------------------------------------
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Noto_Serif_JP, JetBrains_Mono, Inter } from 'next/font/google';

const display = Noto_Serif_JP({ subsets: ['latin'], weight: ['700', '900'] });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

/* ------------------------------------------------------------------ */
/*  Data: Katas (the game levels)                                      */
/* ------------------------------------------------------------------ */

type Chip = { id: string; value: string; shouldMatch: boolean };
type Belt = 'White' | 'Yellow' | 'Green' | 'Brown' | 'Black';

type Kata = {
  id: string;
  belt: Belt;
  title: string;
  brief: string;
  hint: string;
  concept: string;
  chips: Chip[];
};

const BELT_STYLE: Record<Belt, { bg: string; text: string; border: string }> = {
  White: { bg: '#F5F5F0', text: '#3A3A34', border: '#C9C6BC' },
  Yellow: { bg: '#F4D35E', text: '#4A3B05', border: '#C9A227' },
  Green: { bg: '#5E9A5A', text: '#F5FFF3', border: '#3F7A3B' },
  Brown: { bg: '#8B5E34', text: '#FFF8ED', border: '#6B4726' },
  Black: { bg: '#17181C', text: '#E4B94B', border: '#E4B94B' },
};

const BELT_ORDER: Belt[] = ['White', 'Yellow', 'Green', 'Brown', 'Black'];

function makeChips(targets: string[], decoys: string[]): Chip[] {
  const t = targets.map((v, i) => ({ id: `t${i}-${v}`, value: v, shouldMatch: true }));
  const d = decoys.map((v, i) => ({ id: `d${i}-${v}`, value: v, shouldMatch: false }));
  // Deterministic interleave (no Math.random — keeps SSR/client output identical)
  const out: Chip[] = [];
  const max = Math.max(t.length, d.length);
  for (let i = 0; i < max; i++) {
    if (d[i]) out.push(d[i]);
    if (t[i]) out.push(t[i]);
  }
  return out;
}

const KATAS: Kata[] = [
  {
    id: 'digits',
    belt: 'White',
    title: 'Digits Only',
    concept: 'Anchors & shorthand classes',
    brief: 'Slice strings that are made of digits, and only digits — nothing else sneaks through.',
    hint: '^\\d+$',
    chips: makeChips(
      ['42', '007', '1999', '0'],
      ['4a2', 'one2three', '-5', '4.2']
    ),
  },
  {
    id: 'whole-word',
    belt: 'Yellow',
    title: 'Whole Word "cat"',
    concept: 'Word boundaries',
    brief: 'Catch the word "cat" on its own. Don’t let "category" or "scattered" fool your blade.',
    hint: '\\bcat\\b',
    chips: makeChips(
      ['cat', 'a cat sat', 'the cat ran'],
      ['category', 'scattered', 'concatenate']
    ),
  },
  {
    id: 'email-shape',
    belt: 'Green',
    title: 'Email Shape',
    concept: 'Character classes & alternation',
    brief: 'Slice strings shaped like a simple email address: local part, @, domain, dot, extension.',
    hint: '^[\\w.]+@[\\w.]+\\.\\w+$',
    chips: makeChips(
      ['a@b.com', 'ninja.master@dojo.io', 'x@y.co'],
      ['a@b', '@dojo.io', 'plaintext', 'a@@b.com']
    ),
  },
  {
    id: 'hex-color',
    belt: 'Brown',
    title: 'Hex Colors',
    concept: 'Grouping & quantifier ranges',
    brief: 'Catch valid 3- or 6-digit hex colors, always led by "#". Reject anything malformed.',
    hint: '^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$',
    chips: makeChips(
      ['#fff', '#FFAA00', '#123abc'],
      ['fff', '#12345', '#gggggg', '#12']
    ),
  },
  {
    id: 'password',
    belt: 'Black',
    title: 'Password Strength',
    concept: 'Lookaheads',
    brief: 'Slice only passwords with 8+ characters that mix an uppercase, a lowercase, and a digit.',
    hint: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$',
    chips: makeChips(
      ['Ninja123', 'Dojo2024x', 'Str1keFast'],
      ['password', '12345678', 'NINJA123', 'short1A']
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Data: reference content                                            */
/* ------------------------------------------------------------------ */

const SKILLS = [
  { belt: 'White' as Belt, name: 'Anchors', tokens: '^  $  \\b  \\B', note: 'Pin a match to the start, end, or edge of a word.' },
  { belt: 'White' as Belt, name: 'Character classes', tokens: '[abc]  [^abc]  \\d \\w \\s', note: 'Match one character from a set — or its opposite.' },
  { belt: 'Yellow' as Belt, name: 'Quantifiers', tokens: '*  +  ?  {n,m}', note: 'Say how many times a piece may repeat.' },
  { belt: 'Yellow' as Belt, name: 'Greedy vs. lazy', tokens: '.*  vs  .*?', note: 'Greedy grabs as much as possible; lazy grabs as little as possible.' },
  { belt: 'Green' as Belt, name: 'Groups & alternation', tokens: '( )   |   (?: )', note: 'Bundle pieces together, or offer several options.' },
  { belt: 'Green' as Belt, name: 'Flags', tokens: 'i  g  m  s  u', note: 'Change how the whole pattern behaves — case, lines, unicode.' },
  { belt: 'Brown' as Belt, name: 'Backreferences', tokens: '\\1   (?<name> )', note: 'Refer back to something you already captured.' },
  { belt: 'Black' as Belt, name: 'Lookaround', tokens: '(?=)  (?!)  (?<=)  (?<!)', note: 'Check what’s nearby without consuming it.' },
];

const DOS = [
  'Anchor patterns with ^ and $ when the whole string must match — not just part of it.',
  'Escape special characters ( . * + ? ( ) [ ] { } | ^ $ \\ ) whenever you mean them literally.',
  'Use non-capturing groups (?:...) when you don’t actually need the captured value.',
  'Test against edge cases: empty strings, whitespace, unicode, and very long input.',
  'Name your capture groups (?<label>...) once a pattern gets more than two groups.',
  'Reach for a visual tester before you ship a pattern into production code.',
];

const DONTS = [
  'Don’t use regex to parse full HTML or XML — reach for a real parser instead.',
  'Don’t nest quantifiers carelessly, e.g. (a+)+ — that’s how catastrophic backtracking is born.',
  'Don’t forget case sensitivity — add the i flag or silently miss half your matches.',
  'Don’t reach for a hungry .* when a precise character class already does the job.',
  'Don’t skip testing — a pattern that "looks right" can still misfire on the one input that matters.',
  'Don’t confuse greedy and lazy quantifiers when matching nested delimiters like quotes or tags.',
];

const SENSEI_TIPS = [
  'A regex that takes three minutes to write and thirty seconds to read is a good regex.',
  'Every quantifier you stack is a door for backtracking to walk through. Count your doors.',
  'If you can’t explain your pattern out loud, a future teammate can’t maintain it.',
  'Lookaheads check without consuming — think of them as the ninja who scouts ahead but never engages.',
  'Write the failing test string first. Then write the pattern that survives it.',
  'A named group is a note left for whoever reads this pattern next — usually you, in six months.',
];

const LEVELS = [0, 120, 300, 550, 850, 1200];
const LEVEL_TITLES = ['Recruit', 'White Belt', 'Yellow Belt', 'Green Belt', 'Brown Belt', 'Black Belt'];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function testChip(pattern: string, flags: string, value: string): boolean | null {
  if (!pattern.trim()) return null;
  try {
    const re = new RegExp(pattern, flags);
    return re.test(value);
  } catch {
    return null;
  }
}

function isValidPattern(pattern: string, flags: string): boolean {
  if (!pattern.trim()) return true;
  try {
    // eslint-disable-next-line no-new
    new RegExp(pattern, flags);
    return true;
  } catch {
    return false;
  }
}

function levelFromXp(xp: number) {
  let level = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i]) level = i;
  }
  const next = LEVELS[level + 1] ?? LEVELS[LEVELS.length - 1];
  const prev = LEVELS[level];
  const progress = level >= LEVELS.length - 1 ? 100 : Math.round(((xp - prev) / (next - prev)) * 100);
  return { level, title: LEVEL_TITLES[level], next, progress };
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function RegexNinjaPage() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeKata, setActiveKata] = useState(0);
  const [patterns, setPatterns] = useState<Record<string, string>>({});
  const [flagsByKata, setFlagsByKata] = useState<Record<string, string>>({});
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [xp, setXp] = useState(0);
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [tipIndex, setTipIndex] = useState(0);

  // Theme init: respect system preference on first mount, then let the toggle take over.
  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const stored = window.localStorage.getItem('regex-ninja-theme');
    const isDark = stored ? stored === 'dark' : !!prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      window.localStorage.setItem('regex-ninja-theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  // Sensei tip rotation — keeps the page feeling alive.
  useEffect(() => {
    const id = setInterval(() => setTipIndex((i) => (i + 1) % SENSEI_TIPS.length), 6000);
    return () => clearInterval(id);
  }, []);

  const kata = KATAS[activeKata];
  const pattern = patterns[kata.id] ?? '';
  const flags = flagsByKata[kata.id] ?? 'i';
  const patternValid = isValidPattern(pattern, flags);

  const results = useMemo(
    () => kata.chips.map((chip) => ({ chip, isMatch: testChip(pattern, flags, chip.value) })),
    [kata, pattern, flags]
  );

  const allCorrect =
    pattern.trim().length > 0 &&
    patternValid &&
    results.every((r) => r.isMatch === r.chip.shouldMatch);

  const cleared = solved.has(kata.id);

  // Award XP exactly once per kata.
  useEffect(() => {
    if (allCorrect && !solved.has(kata.id)) {
      const bonus = BELT_ORDER.indexOf(kata.belt) * 20;
      setXp((x) => x + 100 + bonus);
      setSolved((s) => new Set(s).add(kata.id));
    }
  }, [allCorrect, kata.belt, kata.id, solved]);

  const { level, title: levelTitle, next: nextXp, progress } = levelFromXp(xp);

  function setPattern(value: string) {
    setPatterns((p) => ({ ...p, [kata.id]: value }));
  }
  function toggleFlag(f: string) {
    setFlagsByKata((prev) => {
      const cur = prev[kata.id] ?? 'i';
      const next = cur.includes(f) ? cur.replace(f, '') : cur + f;
      return { ...prev, [kata.id]: next };
    });
  }

  return (
    <div
      className={`${body.className} min-h-screen antialiased transition-colors duration-300
        bg-[#F6F2E9] text-[#1B1B1F]
        dark:bg-[#121319] dark:text-[#EDEAE0]`}
    >
      {/* ---------------------------------------------------------- */}
      {/* HEADER                                                      */}
      {/* ---------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[#DDD5C4] dark:border-[#2C2E3A] bg-[#F6F2E9]/90 dark:bg-[#121319]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#B23A2E] text-[#F6F2E9] dark:bg-[#E0574A]">
              <ShurikenIcon className="h-5 w-5" />
            </span>
            <div>
              <p className={`${display.className} text-lg leading-none tracking-tight`}>
                Regex Ninja <span className="text-[#B23A2E] dark:text-[#E0574A]">忍</span>
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#5B5850] dark:text-[#A6A296]">
                the pattern-matching dojo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#DDD5C4] dark:border-[#2C2E3A] px-3 py-1.5 text-xs">
              <span className="font-semibold text-[#B8892B] dark:text-[#E4B94B]">Lv.{level}</span>
              <span className="text-[#5B5850] dark:text-[#A6A296]">{levelTitle}</span>
              <span className="text-[#5B5850] dark:text-[#A6A296]">·</span>
              <span className="text-[#5B5850] dark:text-[#A6A296]">{xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------- */}
      {/* HERO                                                        */}
      {/* ---------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-[#DDD5C4] dark:border-[#2C2E3A]">
        <FloatingGlyphs />
        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-20 text-center">
          <p className="mb-4 inline-block rounded-full border border-[#B8892B]/40 dark:border-[#E4B94B]/40 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-[#B8892B] dark:text-[#E4B94B]">
            Slash symbols flying
          </p>
          <h1 className={`${display.className} text-4xl leading-tight sm:text-6xl`}>
            Need the right regex
            <br />
            to catch the right strings.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] text-[#5B5850] dark:text-[#A6A296]">
            Write a pattern. Watch it fly through the field below. Slice every string that belongs -
            and only the strings that belong. Very addictive.
          </p>
          <a
            href="#dojo"
            className="group mt-10 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300"
          >
            Enter the dojo
            <ArrowIcon className="h-4 w-4" />
          </a>
        </div>
      </section>

      <SlashDivider />

      {/* ---------------------------------------------------------- */}
      {/* THE GAME                                                    */}
      {/* ---------------------------------------------------------- */}
      <section id="dojo" className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow="Practice Arena" title="Slice the correct strings" />

        {/* Progress bar */}
        <div className="mb-8 rounded-2xl border border-[#DDD5C4] dark:border-[#2C2E3A] bg-white/60 dark:bg-[#1B1D26]/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                Level {level} — {levelTitle}
              </p>
              <p className="text-xs text-[#5B5850] dark:text-[#A6A296]">
                {solved.size}/{KATAS.length} katas sliced clean
              </p>
            </div>
            <p className="text-xs text-[#5B5850] dark:text-[#A6A296]">
              {xp} / {nextXp} XP to next rank
            </p>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#DDD5C4] dark:bg-[#2C2E3A]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#B8892B] to-[#B23A2E] dark:from-[#E4B94B] dark:to-[#E0574A] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Kata selector */}
        <div className="mb-8 flex flex-wrap gap-2">
          {KATAS.map((k, i) => {
            const belt = BELT_STYLE[k.belt];
            const isActive = i === activeKata;
            const isSolved = solved.has(k.id);
            return (
              <button
                key={k.id}
                onClick={() => setActiveKata(i)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all
                  ${isActive
                    ? 'border-[#1B1B1F] dark:border-[#E4B94B] scale-[1.03]'
                    : 'border-[#DDD5C4] dark:border-[#2C2E3A] opacity-70 hover:opacity-100'}`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border"
                  style={{ backgroundColor: belt.bg, borderColor: belt.border }}
                />
                {k.title}
                {isSolved && <CheckIcon className="h-3.5 w-3.5 text-[#2F6E4F] dark:text-[#4FBE86]" />}
              </button>
            );
          })}
        </div>

        {/* Active kata card */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-[#DDD5C4] dark:border-[#2C2E3A] bg-white/60 dark:bg-[#1B1D26]/60 p-6">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span
                className="rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
                style={{
                  backgroundColor: BELT_STYLE[kata.belt].bg,
                  color: BELT_STYLE[kata.belt].text,
                  borderColor: BELT_STYLE[kata.belt].border,
                }}
              >
                {kata.belt} Belt
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#5B5850] dark:text-[#A6A296]">
                {kata.concept}
              </span>
              {cleared && (
                <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-[#2F6E4F] dark:text-[#4FBE86]">
                  <CheckIcon className="h-4 w-4" /> Kata cleared
                </span>
              )}
            </div>

            <h3 className={`${display.className} text-2xl`}>{kata.title}</h3>
            <p className="mt-2 text-sm text-[#5B5850] dark:text-[#A6A296]">{kata.brief}</p>

            {/* Pattern input */}
            <div className="mt-5">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5B5850] dark:text-[#A6A296]">
                Your pattern
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-[#DDD5C4] dark:border-[#2C2E3A] bg-[#F6F2E9] dark:bg-[#121319] px-3 py-2.5">
                <span className={`${mono.className} text-[#B8892B] dark:text-[#E4B94B]`}>/</span>
                <input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="^\\d+$"
                  spellCheck={false}
                  className={`${mono.className} w-full bg-transparent text-sm outline-none placeholder:text-[#5B5850]/40 dark:placeholder:text-[#A6A296]/40`}
                />
                <span className={`${mono.className} text-[#B8892B] dark:text-[#E4B94B]`}>/{flags}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                {['i', 'm', 's'].map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleFlag(f)}
                    className={`${mono.className} rounded-md border px-2 py-0.5 text-xs transition-colors
                      ${flags.includes(f)
                        ? 'border-[#B8892B] bg-[#B8892B]/15 text-[#B8892B] dark:border-[#E4B94B] dark:bg-[#E4B94B]/15 dark:text-[#E4B94B]'
                        : 'border-[#DDD5C4] dark:border-[#2C2E3A] text-[#5B5850] dark:text-[#A6A296]'}`}
                    title={f === 'i' ? 'case-insensitive' : f === 'm' ? 'multiline' : 'dotAll'}
                  >
                    {f}
                  </button>
                ))}
                <button
                  onClick={() => setShowHint((s) => ({ ...s, [kata.id]: !s[kata.id] }))}
                  className="ml-auto text-xs font-semibold text-[#B23A2E] dark:text-[#E0574A] hover:underline"
                >
                  {showHint[kata.id] ? 'Hide hint' : 'Show hint'}
                </button>
              </div>
              {!patternValid && (
                <p className="mt-2 text-xs font-medium text-[#B23A2E] dark:text-[#E0574A]">
                  That pattern won’t compile — check your escaping and brackets.
                </p>
              )}
              {showHint[kata.id] && (
                <p className={`${mono.className} mt-2 rounded-lg bg-[#B8892B]/10 dark:bg-[#E4B94B]/10 px-3 py-2 text-xs text-[#B8892B] dark:text-[#E4B94B]`}>
                  {kata.hint}
                </p>
              )}
            </div>

            {/* Flying arena */}
            <div className="relative mt-6 min-h-[180px] overflow-hidden rounded-xl border border-dashed border-[#DDD5C4] dark:border-[#2C2E3A] bg-[repeating-linear-gradient(135deg,transparent,transparent_18px,rgba(0,0,0,0.02)_18px,rgba(0,0,0,0.02)_19px)] dark:bg-[repeating-linear-gradient(135deg,transparent,transparent_18px,rgba(255,255,255,0.02)_18px,rgba(255,255,255,0.02)_19px)] p-5">
              <div className="flex flex-wrap gap-3">
                {results.map(({ chip, isMatch }, i) => {
                  const state =
                    isMatch === null
                      ? 'idle'
                      : isMatch && chip.shouldMatch
                      ? 'sliced'
                      : isMatch && !chip.shouldMatch
                      ? 'wrong'
                      : !isMatch && chip.shouldMatch
                      ? 'waiting'
                      : 'safe';
                  return <FlyingChip key={chip.id} value={chip.value} state={state} index={i} />;
                })}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-[#5B5850] dark:text-[#A6A296]">
              <Legend swatchClass="bg-[#B8892B] dark:bg-[#E4B94B]" label="Target — awaiting the blade" />
              <Legend swatchClass="bg-[#2F6E4F] dark:bg-[#4FBE86]" label="Sliced correctly" />
              <Legend swatchClass="bg-[#B23A2E] dark:bg-[#E0574A]" label="Wrong cut — a decoy got hit" />
              <Legend swatchClass="bg-[#5B5850]/40 dark:bg-[#A6A296]/40" label="Correctly left flying" />
            </div>
          </div>

          {/* Side rail: sensei tip + belt tracker */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-[#DDD5C4] dark:border-[#2C2E3A] bg-white/60 dark:bg-[#1B1D26]/60 p-5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#B23A2E] dark:text-[#E0574A]">
                Sensei says
              </p>
              <p className="text-sm leading-relaxed">{SENSEI_TIPS[tipIndex]}</p>
            </div>

            <div className="rounded-2xl border border-[#DDD5C4] dark:border-[#2C2E3A] bg-white/60 dark:bg-[#1B1D26]/60 p-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#5B5850] dark:text-[#A6A296]">
                Belt progression
              </p>
              <ol className="space-y-2">
                {BELT_ORDER.map((b) => {
                  const kataForBelt = KATAS.find((k) => k.belt === b);
                  const done = kataForBelt ? solved.has(kataForBelt.id) : false;
                  return (
                    <li key={b} className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full border"
                        style={{ backgroundColor: BELT_STYLE[b].bg, borderColor: BELT_STYLE[b].border }}
                      />
                      <span className={`text-sm ${done ? 'font-semibold' : 'text-[#5B5850] dark:text-[#A6A296]'}`}>
                        {b} Belt
                      </span>
                      {done && <CheckIcon className="h-3.5 w-3.5 text-[#2F6E4F] dark:text-[#4FBE86]" />}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <SlashDivider />

      {/* ---------------------------------------------------------- */}
      {/* SKILLS TO MASTER                                            */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow="Scrolls of the Dojo" title="Skills every ninja must know" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((s) => (
            <div
              key={s.name}
              className="rounded-2xl border border-[#DDD5C4] dark:border-[#2C2E3A] bg-white/60 dark:bg-[#1B1D26]/60 p-5"
            >
              <span
                className="mb-3 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{
                  backgroundColor: BELT_STYLE[s.belt].bg,
                  color: BELT_STYLE[s.belt].text,
                  borderColor: BELT_STYLE[s.belt].border,
                }}
              >
                {s.belt}
              </span>
              <h4 className="font-semibold">{s.name}</h4>
              <p className={`${mono.className} mt-2 text-xs text-[#B8892B] dark:text-[#E4B94B]`}>{s.tokens}</p>
              <p className="mt-2 text-xs text-[#5B5850] dark:text-[#A6A296]">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <SlashDivider />

      {/* ---------------------------------------------------------- */}
      {/* DO / DON'T                                                  */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow="The Dojo Code" title="Do’s and don’ts" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#2F6E4F]/30 dark:border-[#4FBE86]/30 bg-[#2F6E4F]/5 dark:bg-[#4FBE86]/5 p-6">
            <p className="mb-4 flex items-center gap-2 font-semibold text-[#2F6E4F] dark:text-[#4FBE86]">
              <CheckIcon className="h-5 w-5" /> Do
            </p>
            <ul className="space-y-3">
              {DOS.map((d) => (
                <li key={d} className="flex gap-2 text-sm">
                  <span className="mt-1 text-[#2F6E4F] dark:text-[#4FBE86]">·</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#B23A2E]/30 dark:border-[#E0574A]/30 bg-[#B23A2E]/5 dark:bg-[#E0574A]/5 p-6">
            <p className="mb-4 flex items-center gap-2 font-semibold text-[#B23A2E] dark:text-[#E0574A]">
              <CrossIcon className="h-5 w-5" /> Don’t
            </p>
            <ul className="space-y-3">
              {DONTS.map((d) => (
                <li key={d} className="flex gap-2 text-sm">
                  <span className="mt-1 text-[#B23A2E] dark:text-[#E0574A]">·</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <SlashDivider />

      {/* ---------------------------------------------------------- */}
      {/* CHEAT SHEET / KEEP IN MIND                                  */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow="Keep In Mind" title="Quick reference" />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-[#DDD5C4] dark:border-[#2C2E3A]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1B1B1F] text-[#F6F2E9] dark:bg-[#E4B94B] dark:text-[#121319]">
                  <th className="px-4 py-2 text-left font-semibold">Token</th>
                  <th className="px-4 py-2 text-left font-semibold">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['.', 'Any character except a line break'],
                  ['\\d  \\D', 'A digit — or anything but a digit'],
                  ['\\w  \\W', 'A word character — or anything but one'],
                  ['\\s  \\S', 'Whitespace — or anything but whitespace'],
                  ['^  $', 'Start of string/line — end of string/line'],
                  ['\\b  \\B', 'A word boundary — or the absence of one'],
                  ['*  +  ?', 'Zero-or-more, one-or-more, zero-or-one'],
                  ['{n,m}', 'Between n and m repetitions'],
                  ['( )  (?: )', 'Capturing group — non-capturing group'],
                  ['|', 'Alternation: this OR that'],
                  ['[abc]  [^abc]', 'One of these characters — none of these'],
                  ['(?=)  (?!)', 'Followed by / not followed by (lookahead)'],
                  ['(?<=)  (?<!)', 'Preceded by / not preceded by (lookbehind)'],
                  ['\\1  (?<n>)\\k<n>', 'Backreference to a captured group'],
                ].map(([token, meaning], i) => (
                  <tr
                    key={token}
                    className={i % 2 === 0 ? 'bg-white/60 dark:bg-[#1B1D26]/60' : 'bg-transparent'}
                  >
                    <td className={`${mono.className} px-4 py-2 text-[#B8892B] dark:text-[#E4B94B]`}>{token}</td>
                    <td className="px-4 py-2 text-[#5B5850] dark:text-[#A6A296]">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#DDD5C4] dark:border-[#2C2E3A] bg-white/60 dark:bg-[#1B1D26]/60 p-5">
              <h4 className="mb-2 font-semibold">Before you commit a pattern</h4>
              <ul className="space-y-2 text-sm text-[#5B5850] dark:text-[#A6A296]">
                <li>Does it reject everything it should reject, not just accept what it should accept?</li>
                <li>Does it survive an empty string without throwing?</li>
                <li>Would a teammate understand it in under a minute?</li>
                <li>Have you checked it against unicode or multi-byte input if that’s in scope?</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[#DDD5C4] dark:border-[#2C2E3A] bg-white/60 dark:bg-[#1B1D26]/60 p-5">
              <h4 className="mb-2 font-semibold">Performance, briefly</h4>
              <p className="text-sm text-[#5B5850] dark:text-[#A6A296]">
                Catastrophic backtracking happens when nested or overlapping quantifiers force the
                engine to try exponentially many ways to fail. Prefer specific character classes,
                atomic-style grouping where your engine supports it, and possessive quantifiers or
                lookaheads to cut off dead ends early.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* FOOTER                                                      */}
      {/* ---------------------------------------------------------- */}
      <footer className="border-t border-[#DDD5C4] dark:border-[#2C2E3A] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-center">
          <p className={`${display.className} text-lg`}>Regex Ninja 忍</p>
          <p className="max-w-md text-sm text-[#5B5850] dark:text-[#A6A296]">
            Every pattern is a blade. Sharpen it, test it, and trust it - one clean kata at a time.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float-bob {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(-1deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes glyph-drift {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.12; }
          50% { transform: translate(14px, -18px) rotate(6deg); opacity: 0.22; }
          100% { transform: translate(0, 0) rotate(0deg); opacity: 0.12; }
        }
        @keyframes slash-flash {
          0% { box-shadow: 0 0 0 0 rgba(47, 110, 79, 0.4); }
          100% { box-shadow: 0 0 0 8px rgba(47, 110, 79, 0); }
        }
        @keyframes pulse-target {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Subcomponents                                                       */
/* ------------------------------------------------------------------ */

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#B23A2E] dark:text-[#E0574A]">
        {eyebrow}
      </p>
      <h2 className={`${display.className} text-3xl`}>{title}</h2>
    </div>
  );
}

function Legend({ swatchClass, label }: { swatchClass: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${swatchClass}`} />
      {label}
    </span>
  );
}

function FlyingChip({
  value,
  state,
  index,
}: {
  value: string;
  state: 'idle' | 'sliced' | 'wrong' | 'waiting' | 'safe';
  index: number;
}) {
  const duration = 3 + (index % 4) * 0.6;
  const delay = (index % 5) * 0.25;

  const styleByState: Record<string, string> = {
    idle: 'border-[#DDD5C4] dark:border-[#2C2E3A] text-[#5B5850] dark:text-[#A6A296]',
    waiting:
      'border-[#B8892B] dark:border-[#E4B94B] text-[#B8892B] dark:text-[#E4B94B] bg-[#B8892B]/10 dark:bg-[#E4B94B]/10',
    sliced:
      'border-[#2F6E4F] dark:border-[#4FBE86] text-[#2F6E4F] dark:text-[#4FBE86] bg-[#2F6E4F]/10 dark:bg-[#4FBE86]/10 line-through decoration-2',
    wrong:
      'border-[#B23A2E] dark:border-[#E0574A] text-[#B23A2E] dark:text-[#E0574A] bg-[#B23A2E]/10 dark:bg-[#E0574A]/10',
    safe: 'border-[#DDD5C4] dark:border-[#2C2E3A] text-[#5B5850]/60 dark:text-[#A6A296]/60',
  };

  return (
    <span
      className={`${mono.className} rounded-full border px-3 py-1.5 text-xs ${styleByState[state]}`}
      style={{
        animation:
          state === 'waiting'
            ? `pulse-target ${duration}s ease-in-out ${delay}s infinite`
            : `float-bob ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      {value}
    </span>
  );
}

function FloatingGlyphs() {
  const glyphs = ['/\\d+/', '^', '$', '\\b', '[a-z]', '(?:...)', '*', '+', '?', '|', '\\s', '(?=)'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {glyphs.map((g, i) => (
        <span
          key={g + i}
          className={`${mono.className} absolute text-2xl sm:text-3xl text-[#1B1B1F] dark:text-[#EDEAE0]`}
          style={{
            left: `${(i * 37) % 92}%`,
            top: `${(i * 23) % 80}%`,
            opacity: 0.12,
            animation: `glyph-drift ${5 + (i % 4)}s ease-in-out ${i * 0.3}s infinite`,
          }}
        >
          {g}
        </span>
      ))}
    </div>
  );
}

function SlashDivider() {
  return (
    <div className="relative h-6 w-full overflow-hidden">
      <svg
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        className="h-full w-full text-[#DDD5C4] dark:text-[#2C2E3A]"
        aria-hidden
      >
        <line x1="0" y1="24" x2="1200" y2="0" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG — zero dependencies)                             */
/* ------------------------------------------------------------------ */

function ShurikenIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2 L14 9 L21 4 L15 11 L22 12 L15 13 L21 20 L14 15 L12 22 L10 15 L3 20 L9 13 L2 12 L9 11 L3 4 L10 9 Z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
      <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}