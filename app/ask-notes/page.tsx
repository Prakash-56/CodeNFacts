'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

type Depth = 'beginner' | 'intermediate' | 'advanced';
type Format = 'structured-notes' | 'cheatsheet' | 'deep-dive' | 'qa-flashcards';

const depthMeta: Record<Depth, { label: string; desc: string; icon: string }> = {
  beginner:     { label: 'Beginner',     desc: 'First-principles, plain language', icon: '◎' },
  intermediate: { label: 'Intermediate', desc: 'Concepts + nuance + examples',     icon: '◑' },
  advanced:     { label: 'Advanced',     desc: 'Internals, edge-cases, trade-offs', icon: '●' },
};

const formatMeta: Record<Format, { label: string; desc: string }> = {
  'structured-notes': { label: 'Structured Notes',  desc: 'Organised sections, definitions, examples' },
  'cheatsheet':       { label: 'Cheat Sheet',        desc: 'Dense, scannable, print-ready' },
  'deep-dive':        { label: 'Deep Dive',           desc: 'Longform explanation with diagrams' },
  'qa-flashcards':    { label: 'Q&A / Flashcards',   desc: 'Interview & revision ready' },
};

export default function AskNotesPage() {
  const [depth,        setDepth]        = useState<Depth>('intermediate');
  const [format,       setFormat]       = useState<Format>('structured-notes');
  const [topic,        setTopic]        = useState('');
  const [context,      setContext]      = useState('');
  const [expectations, setExpectations] = useState('');
  const [name,         setName]         = useState('');
  const [gmail,        setGmail]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [error,        setError]        = useState('');

  const isValidGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail);
  const isFormValid  = topic.trim() && context.trim() && expectations.trim() && name.trim() && isValidGmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, topic, context, depth, format, expectations, gmail }),
      });

      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <section className="relative min-h-screen bg-[#0a0a0b] flex items-center justify-center px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,rgba(99,102,241,0.18),transparent_65%)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl w-full text-center space-y-8"
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-4xl">
            ✦
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">Request Received</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Your notes request has been logged. Our team will review, refine, and deliver
            precision notes to <span className="text-indigo-300 font-medium">{gmail}</span>.
            <br /><br />
            Expect delivery within <span className="text-white font-medium">24-48 hours</span>.
          </p>
          <div className="pt-2 border-t border-white/5 text-sm text-gray-600">
            Reference: <span className="text-gray-500 font-mono">{Date.now().toString(36).toUpperCase()}</span>
          </div>
        </motion.div>
      </section>
    );
  }

  /* ── Main Form ── */
  return (
    <section className="relative min-h-screen bg-[#0a0a0b] px-4 sm:px-6 py-24">
      {/* Ambience */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.14),transparent)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_40%_40%_at_90%_90%,rgba(236,72,153,0.08),transparent)]" />

      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <span className="inline-block mb-6 px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase border border-indigo-400/20 text-indigo-300 bg-indigo-500/5">
            Human-Reviewed · Precision Crafted
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-none">
            Request Notes
          </h1>
          <p className="mt-5 text-gray-400 text-base leading-relaxed max-w-md mx-auto">
            Every request is read by a real person before we write a single line.
            Fill in the details precisely - the output quality depends on it.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.03] divide-y divide-white/[0.06] overflow-hidden"
          noValidate
        >

          {/* ── 01 Name ── */}
          <FormSection index="01" label="Your name" required>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Full name"
              className="field-input"
              required
            />
          </FormSection>

          {/* ── 02 Topic ── */}
          <FormSection index="02" label="Topic" hint="Be specific. A tight scope → sharper notes." required>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Red-Black Trees, TCP/IP handshake, SQL window functions"
              className="field-input"
              required
            />
          </FormSection>

          {/* ── 03 Context / Why ── */}
          <FormSection index="03" label="Why do you need this?" hint="Interview prep, exam revision, resolving confusion - context shapes the output." required>
            <textarea
              rows={4}
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="Describe your situation, deadline, or goal"
              className="field-input resize-none"
              required
            />
          </FormSection>

          {/* ── 04 Depth ── */}
          <FormSection index="04" label="Desired depth" required>
            <div className="grid grid-cols-3 gap-3">
              {(Object.entries(depthMeta) as [Depth, typeof depthMeta[Depth]][]).map(([key, meta]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDepth(key)}
                  className={`relative flex flex-col gap-1.5 rounded-xl border px-4 py-4 text-left transition-all duration-200
                    ${depth === key
                      ? 'border-indigo-400/60 bg-indigo-500/10 text-white'
                      : 'border-white/[0.07] text-gray-500 hover:border-white/20 hover:text-gray-300'
                    }`}
                >
                  <span className="text-xl">{meta.icon}</span>
                  <span className="text-sm font-semibold">{meta.label}</span>
                  <span className="text-[11px] leading-tight opacity-70">{meta.desc}</span>
                  {depth === key && (
                    <span className="absolute bottom-0 left-3 right-3 h-[1.5px] rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
                  )}
                </button>
              ))}
            </div>
          </FormSection>

          {/* ── 05 Format ── */}
          <FormSection index="05" label="Preferred format" required>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(formatMeta) as [Format, typeof formatMeta[Format]][]).map(([key, meta]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormat(key)}
                  className={`relative flex flex-col gap-1 rounded-xl border px-4 py-4 text-left transition-all duration-200
                    ${format === key
                      ? 'border-indigo-400/60 bg-indigo-500/10 text-white'
                      : 'border-white/[0.07] text-gray-500 hover:border-white/20 hover:text-gray-300'
                    }`}
                >
                  <span className="text-sm font-semibold">{meta.label}</span>
                  <span className="text-[11px] leading-tight opacity-70">{meta.desc}</span>
                  {format === key && (
                    <span className="absolute bottom-0 left-3 right-3 h-[1.5px] rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
                  )}
                </button>
              ))}
            </div>
          </FormSection>

          {/* ── 06 Specific expectations ── */}
          <FormSection index="06" label="Specific expectations" hint="Examples, common pitfalls, interview Q&A, diagrams, anything you want prioritised." required>
            <textarea
              rows={4}
              value={expectations}
              onChange={e => setExpectations(e.target.value)}
              placeholder="Tell us exactly what you expect to walk away understanding"
              className="field-input resize-none"
              required
            />
          </FormSection>

          {/* ── 07 Gmail ── */}
          <FormSection index="07" label="Gmail address" hint="We only deliver to Gmail. Notes arrive after manual review." required>
            <input
              type="email"
              value={gmail}
              onChange={e => setGmail(e.target.value)}
              placeholder="you@gmail.com"
              className={`field-input ${gmail && !isValidGmail ? 'border-red-500/60 focus:border-red-500/60' : ''}`}
              required
            />
            <AnimatePresence>
              {gmail && !isValidGmail && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-2 text-xs text-red-400"
                >
                  Must be a valid Gmail address ending in @gmail.com
                </motion.p>
              )}
            </AnimatePresence>
          </FormSection>

          {/* ── Submit ── */}
          <div className="px-8 py-8 space-y-4">
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-400 text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={!isFormValid || loading}
              whileHover={isFormValid && !loading ? { scale: 1.02 } : {}}
              whileTap={isFormValid && !loading ? { scale: 0.98 } : {}}
              className={`w-full flex items-center justify-center gap-3 rounded-xl py-4 text-base font-semibold tracking-wide transition-all duration-300
                ${isFormValid && !loading
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40'
                  : 'bg-white/[0.04] text-gray-600 cursor-not-allowed'
                }`}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Submitting…
                </>
              ) : (
                <>Submit Request <span className="opacity-60">→</span></>
              )}
            </motion.button>

            <p className="text-center text-xs text-gray-600">
              🔒 Manually reviewed before delivery · No automated responses
            </p>
          </div>

        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-sm text-gray-600"
        >
          Information is cheap. <span className="text-gray-400">Precision is rare.</span>
        </motion.p>
      </div>

      <style jsx global>{`
        .field-input {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 14px;
          color: #e5e7eb;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .field-input::placeholder { color: rgba(156,163,175,0.4); }
        .field-input:focus { border-color: rgba(99,102,241,0.5); }
      `}</style>
    </section>
  );
}

/* ── FormSection wrapper ── */
function FormSection({
  index, label, hint, required, children,
}: {
  index: string;
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="px-8 py-7 space-y-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-[10px] font-mono text-gray-600 tracking-widest select-none">{index}</span>
        <div>
          <p className="text-sm font-semibold text-white leading-none">
            {label}
            {required && <span className="ml-1 text-indigo-400">*</span>}
          </p>
          {hint && <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}