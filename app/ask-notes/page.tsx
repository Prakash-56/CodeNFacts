'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AskNotesPage() {
  const [depth, setDepth] = useState<'beginner' | 'intermediate' | 'advanced'>(
    'intermediate'
  );

  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [expectations, setExpectations] = useState('');
  const [gmail, setGmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValidGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail);
  const isFormValid = topic && context && isValidGmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);

    // 🔗 Ready for backend / API / Supabase / Email service
    await new Promise((res) => setTimeout(res, 1200));

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-6 py-32">
      {/* Ambient Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.28),transparent_55%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_80%,rgba(236,72,153,0.22),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.05] bg-[url('/noise.png')]" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease: 'easeOut' }}
        className="mx-auto max-w-4xl text-center"
      >
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white">
          Ask for
          <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Notes
          </span>
        </h1>

        <p className="mt-10 text-xl md:text-2xl text-gray-300 leading-relaxed">
          Don’t request content.
          <br />
          <span className="text-gray-400">
            Request understanding — reviewed and refined by our team.
          </span>
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 120 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.2 }}
        className="relative mx-auto mt-28 max-w-4xl space-y-16 rounded-3xl border border-white/10 bg-white/5 p-10 md:p-14 backdrop-blur-xl"
      >
        {/* Glow */}
        <div className="pointer-events-none absolute -inset-px -z-10 rounded-3xl bg-gradient-to-r from-indigo-500/30 to-cyan-400/20 opacity-40 blur-2xl" />

        {/* Topic */}
        <Field
          label="What topic do you want notes on?"
          hint="Be precise. Better input → sharper notes."
        >
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: LRU Cache, Red-Black Trees"
            className="input"
            required
          />
        </Field>

        {/* Context */}
        <Field
          label="Why do you need this?"
          hint="Interview, exam, confusion, revision — context matters."
        >
          <textarea
            rows={4}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Tell us what you're trying to achieve"
            className="input resize-none"
            required
          />
        </Field>

        {/* Depth */}
        <div>
          <p className="text-xl font-medium text-white mb-4">
            Desired depth
          </p>

          <div className="grid grid-cols-3 gap-4">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <motion.button
                key={level}
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setDepth(level)}
                className={`relative rounded-2xl border px-6 py-5 text-lg capitalize transition
                  ${
                    depth === level
                      ? 'border-indigo-400 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/20'
                      : 'border-white/10 text-gray-400 hover:border-white/30'
                  }`}
              >
                {level}
                {depth === level && (
                  <span className="absolute inset-x-4 -bottom-px h-[2px] bg-gradient-to-r from-indigo-400 to-cyan-400" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Expectations */}
        <Field
          label="Anything specific you expect?"
          hint="Examples, diagrams, pitfalls, interview Q&A."
        >
          <textarea
            rows={4}
            value={expectations}
            onChange={(e) => setExpectations(e.target.value)}
            placeholder="Optional — but helps us overdeliver"
            className="input resize-none"
          />
        </Field>

        {/* Gmail (Mandatory) */}
        <Field
          label={
            <>
              Gmail for delivery <span className="text-red-400">*</span>
            </>
          }
          hint="Notes will be reviewed and sent only to this Gmail."
        >
          <input
            type="email"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            placeholder="you@gmail.com"
            className={`input ${
              gmail && !isValidGmail
                ? 'border-red-400 focus:border-red-400'
                : ''
            }`}
            required
          />

          {gmail && !isValidGmail && (
            <p className="text-sm text-red-400 mt-2">
              Please enter a valid Gmail address.
            </p>
          )}
        </Field>

        {/* Trust Line */}
        <p className="text-sm text-gray-400">
          🔒 Every request is manually reviewed before delivery.
        </p>

        {/* CTA */}
        <motion.button
          type="submit"
          disabled={!isFormValid || loading}
          whileHover={isFormValid ? { scale: 1.06 } : {}}
          whileTap={isFormValid ? { scale: 0.95 } : {}}
          className={`group mx-auto flex items-center gap-4 rounded-full px-14 py-6 text-xl font-semibold transition
            ${
              isFormValid
                ? 'bg-gradient-to-r from-indigo-400 to-cyan-400 text-black shadow-xl shadow-indigo-500/30'
                : 'cursor-not-allowed bg-white/10 text-gray-500'
            }`}
        >
          {loading ? 'Submitting...' : submitted ? 'Request Sent' : 'Submit Request'}
          <span className="text-2xl">→</span>
        </motion.button>
      </motion.form>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="mt-32 text-center text-gray-400 text-lg"
      >
        Information is cheap.
        <span className="text-white"> Precision is rare.</span>
      </motion.p>
    </section>
  );
}

/* ---------- Field Wrapper ---------- */

function Field({
  label,
  hint,
  children,
}: {
  label: React.ReactNode;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <label className="text-xl font-medium text-white">{label}</label>
      <p className="text-sm text-gray-400">{hint}</p>
      {children}
    </div>
  );
}
