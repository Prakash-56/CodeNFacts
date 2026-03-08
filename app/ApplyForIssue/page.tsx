'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { AlertCircle, CheckCircle2, Send, ArrowLeft, Bug, Zap, Shield, Sparkles, User, Mail, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { value: 'Bug Report',              label: 'Bug Report',            icon: Bug,      color: '#ef4444' },
  { value: 'Performance Issue',       label: 'Performance Issue',     icon: Zap,      color: '#f59e0b' },
  { value: 'Security Vulnerability',  label: 'Security Vulnerability',icon: Shield,   color: '#8b5cf6' },
  { value: 'Feature Request',         label: 'Feature Request',       icon: Sparkles, color: '#3b82f6' },
];

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const SEV_COLORS: Record<string, string> = {
  Low: '#22c55e', Medium: '#f59e0b', High: '#f97316', Critical: '#ef4444',
};

// ── Grain texture ────────────────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <svg className="pointer-events-none fixed inset-0 z-50 opacity-[0.035]" width="100%" height="100%">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

// ── Magnetic submit button ───────────────────────────────────────────────────
function MagneticButton({ children, className, disabled, type }: {
  children: React.ReactNode; className?: string; disabled?: boolean; type?: 'submit' | 'button';
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    if (disabled) return;
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={btnRef} type={type ?? 'button'} disabled={disabled}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// ── Floating particle ────────────────────────────────────────────────────────
function Particle({ delay, x }: { delay: number; x: number }) {
  const size = Math.random() * 3 + 1;
  return (
    <motion.div
      className="absolute rounded-full bg-red-500/20 pointer-events-none"
      style={{ left: `${x}%`, width: size, height: size, bottom: '-2%' }}
      animate={{ y: [0, -900], opacity: [0, 0.7, 0] }}
      transition={{ duration: Math.random() * 12 + 8, delay, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// ── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, error, children }: {
  label: string; icon: React.ElementType; error?: string; children: React.ReactNode;
}) {
  return (
    <motion.div className="space-y-1.5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <label className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">
        <Icon className="w-3 h-3 text-red-400" />
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[11px] text-red-400 flex items-center gap-1 pt-0.5"
          >
            <AlertCircle className="w-3 h-3 shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const inp = `w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white
placeholder:text-zinc-700 outline-none transition-all duration-200
focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:bg-black/70 hover:border-zinc-700`;

export default function ApplyForIssue() {
  const [status, setStatus]       = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [category, setCategory]   = useState('Bug Report');
  const [severity, setSeverity]   = useState('');
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [serverErr, setServerErr] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [ticketId]                = useState(() => Math.floor(Math.random() * 90000) + 10000);
  const particles = Array.from({ length: 18 }, (_, i) => ({ delay: i * 0.7, x: Math.random() * 100 }));

  // form field refs
  const nameRef  = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const descRef  = useRef<HTMLTextAreaElement>(null);
  const stepsRef = useRef<HTMLTextAreaElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nameRef.current?.value.trim())  e.name  = 'Name is required';
    if (!emailRef.current?.value.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(emailRef.current.value)) e.email = 'Enter a valid email';
    if (!severity)                       e.severity    = 'Select a severity level';
    if (!descRef.current?.value.trim())  e.description = 'Description is required';
    if (!stepsRef.current?.value.trim()) e.steps       = 'Steps to reproduce are required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setErrors({});
    setServerErr('');
    setStatus('submitting');

    try {
      const res = await fetch('/api/submit-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_name:      nameRef.current!.value.trim(),
          from_email:     emailRef.current!.value.trim(),
          issue_category: category,
          severity,
          description:    descRef.current!.value.trim(),
          steps:          stepsRef.current!.value.trim(),
          ticket_id:      ticketId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Unknown error');
      setStatus('success');
    } catch (err: any) {
      setServerErr(err.message ?? 'Failed to submit. Please try again.');
      setStatus('error');
    }
  };

  // ── SUCCESS ────────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <GrainOverlay />
        {/* ambient blobs */}
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{
              width: 300 + i * 80, height: 300 + i * 80,
              left: `${10 + i * 15}%`, top: `${10 + i * 12}%`,
              background: `radial-gradient(circle, rgba(34,197,94,${0.05 - i * 0.008}) 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          className="relative text-center space-y-6 max-w-sm"
        >
          {/* icon ring */}
          <div className="relative w-28 h-28 mx-auto">
            {[1, 1.35, 1.65].map((scale, i) => (
              <motion.div key={i} className="absolute inset-0 rounded-full border border-green-500/20"
                animate={{ scale: [scale, scale + 0.08, scale] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
            <div className="w-28 h-28 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center relative">
              <CheckCircle2 className="w-14 h-14 text-green-400" />
            </div>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-green-400 font-bold mb-2">
              Ticket #{ticketId} · Sent to your inbox
            </p>
            <h2 className="text-4xl font-black text-white mb-3" style={{ fontFamily: 'Georgia,serif', letterSpacing: '-0.02em' }}>
              Report Received
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              An email has been dispatched to your inbox with full details. Expect a response within 24-48 hours.
            </p>
          </div>

          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white
            transition-colors border border-zinc-800 hover:border-zinc-600 px-5 py-2.5 rounded-xl">
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── FORM ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-start justify-center p-4 sm:p-8 py-12">
      <GrainOverlay />

      {/* background atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
          animate={{ x: [0, -30, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        {/* grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {particles.map((p, i) => <Particle key={i} delay={p.delay} x={p.x} />)}
      </div>

      {/* card */}
      <motion.div
        initial={{ opacity: 0, y: 44, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl"
      >
        {/* outer glow border */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-zinc-700/40 via-transparent to-zinc-800/20 pointer-events-none" />

        <div className="relative bg-zinc-950/85 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.06)]">

          <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          {/* ── Header ── */}
          <div className="px-8 pt-8 pb-6 border-b border-zinc-800/50">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[11px] tracking-wide text-zinc-600 hover:text-zinc-300 mb-6 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-red-400/80 font-bold mb-2">Engineering Support</p>
                <h1 className="text-4xl font-black leading-none mb-3" style={{ fontFamily: 'Georgia,serif', letterSpacing: '-0.02em' }}>
                  Submit an<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Issue Report</span>
                </h1>
                <p className="text-zinc-600 text-sm">All fields are required. Detailed reports get resolved faster.</p>
              </div>

              {/* rotating badge */}
              <div className="shrink-0 relative w-14 h-14">
                <motion.div className="absolute inset-0 rounded-full border border-red-500/25"
                  animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div className="absolute -inset-2 rounded-full border border-red-500/10"
                  animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                />
                <div className="w-14 h-14 rounded-full border border-zinc-800 bg-zinc-900/60 flex items-center justify-center">
                  <Bug className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="px-8 py-7 space-y-6">

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Your Name" icon={User} error={errors.name}>
                  <input ref={nameRef} type="text" placeholder="John Doe"
                    className={inp}
                    style={{ borderColor: errors.name ? '#ef4444' : undefined }}
                    onChange={() => errors.name && setErrors(p => ({ ...p, name: '' }))}
                  />
                </Field>
                <Field label="Email Address" icon={Mail} error={errors.email}>
                  <input ref={emailRef} type="email" placeholder="john@example.com"
                    className={inp}
                    style={{ borderColor: errors.email ? '#ef4444' : undefined }}
                    onChange={() => errors.email && setErrors(p => ({ ...p, email: '' }))}
                  />
                </Field>
              </div>

              {/* Category pills */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">
                  <FileText className="w-3 h-3 text-red-400" /> Issue Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const active = category === cat.value;
                    return (
                      <motion.button key={cat.value} type="button"
                        onClick={() => setCategory(cat.value)}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[11px] font-semibold transition-all duration-200 overflow-hidden ${
                          active ? 'text-white' : 'border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400 bg-black/20'
                        }`}
                        style={active ? { borderColor: `${cat.color}55`, background: `${cat.color}12` } : {}}
                      >
                        {active && (
                          <motion.div layoutId="catBg" className="absolute inset-0"
                            style={{ background: `${cat.color}08` }}
                          />
                        )}
                        <Icon className="w-4 h-4 relative" style={active ? { color: cat.color } : {}} />
                        <span className="relative text-center leading-tight">{cat.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">
                  <Zap className="w-3 h-3 text-red-400" /> Severity Level <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {SEVERITIES.map((s) => {
                    const active = severity === s;
                    const c = SEV_COLORS[s];
                    return (
                      <motion.button key={s} type="button"
                        onClick={() => { setSeverity(s); setErrors(p => ({ ...p, severity: '' })); }}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all duration-200 ${
                          active ? 'text-white' : 'border-zinc-800 text-zinc-600 bg-black/20 hover:border-zinc-700'
                        }`}
                        style={active ? { background: `${c}18`, borderColor: `${c}55`, color: c } : {}}
                      >
                        {s}
                      </motion.button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {errors.severity && (
                    <motion.p key="sev-err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.severity}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Description */}
              <Field label="Issue Description" icon={FileText} error={errors.description}>
                <textarea ref={descRef} rows={4} maxLength={1000}
                  placeholder="Clearly describe what's happening..."
                  className={`${inp} resize-none`}
                  style={{ borderColor: errors.description ? '#ef4444' : undefined }}
                  onChange={(e) => {
                    setCharCount(e.target.value.length);
                    if (errors.description) setErrors(p => ({ ...p, description: '' }));
                  }}
                />
                <div className="flex justify-end -mt-1">
                  <span className="text-[11px] text-zinc-700">{charCount}/1000</span>
                </div>
              </Field>

              {/* Steps */}
              <Field label="Steps to Reproduce" icon={FileText} error={errors.steps}>
                <textarea ref={stepsRef} rows={4}
                  placeholder={"1. Navigate to settings\n2. Click on profile\n3. App crashes with error..."}
                  className={`${inp} resize-none font-mono text-xs`}
                  style={{ borderColor: errors.steps ? '#ef4444' : undefined }}
                  onChange={() => errors.steps && setErrors(p => ({ ...p, steps: '' }))}
                />
              </Field>

              {/* Security warning */}
              <motion.div className="flex gap-3 items-start bg-amber-500/5 border border-amber-500/15 rounded-xl p-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/50 leading-relaxed">
                  Never include passwords, API keys, or other sensitive credentials. Redact personal data before submitting.
                </p>
              </motion.div>

              {/* Server error */}
              <AnimatePresence>
                {status === 'error' && serverErr && (
                  <motion.div key="srv-err"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-3 items-start bg-red-500/8 border border-red-500/25 rounded-xl p-4"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300">{serverErr}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit footer */}
            <div className="px-8 pb-8 pt-0">
              <MagneticButton type="submit" disabled={status === 'submitting'}
                className="w-full relative group overflow-hidden rounded-xl py-4 text-sm font-bold tracking-wide text-white
                  transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' } as React.CSSProperties}
              >
                {/* hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }} />
                {/* shine sweep */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  animate={{ x: ['-150%', '250%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                />
                <span className="relative flex items-center justify-center gap-2.5">
                  {status === 'submitting' ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                      Sending Report…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      Submit Issue Report
                    </>
                  )}
                </span>
              </MagneticButton>

              <p className="text-center text-[11px] text-zinc-700 mt-3">
                Ticket <span className="text-zinc-500 font-mono">#{ticketId}</span> assigned on submission
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
          </form>
        </div>
      </motion.div>
    </div>
  );
}