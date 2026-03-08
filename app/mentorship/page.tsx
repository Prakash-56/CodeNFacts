'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

const FIELDS = [
  { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Arjun', col: 1 },
  { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Sharma', col: 1 },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'arjun@example.com', col: 2 },
  { name: 'mobile', label: 'Mobile Number', type: 'tel', placeholder: '+91 98765 43210', col: 2 },
  { name: 'experience', label: 'Work / Project Experience', type: 'text', placeholder: 'e.g. 1 yr internship at XYZ', col: 2 },
];

const EDUCATION_OPTIONS = ['High School', 'Undergraduate', 'Postgraduate', 'Working Professional'];
const GOAL_OPTIONS = ['Software Engineer', 'Data Scientist', 'AI/ML Engineer', 'Full Stack Developer', 'DevOps Engineer', 'Product Manager'];

const FloatingOrb = ({ style }: { style: React.CSSProperties }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: Math.random() * 4 + 5, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const InputField = ({
  field,
  value,
  onChange,
  required = true,
}: {
  field: (typeof FIELDS)[0];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <motion.div
      className="relative"
      style={{ gridColumn: field.col === 2 ? 'span 2' : undefined }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div
        className={`relative rounded-2xl transition-all duration-300 ${
          focused
            ? 'shadow-[0_0_30px_rgba(99,102,241,0.4)] ring-2 ring-indigo-500'
            : 'shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
        }`}
      >
        <input
          type={field.type}
          name={field.name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          placeholder=" "
          className="peer w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 pt-6 pb-3 text-sm outline-none placeholder-transparent backdrop-blur-sm transition-all duration-300 hover:border-white/20 focus:bg-white/8"
        />
        <label className="absolute left-5 top-2 text-[10px] font-semibold uppercase tracking-widest text-indigo-400 transition-all duration-300 peer-placeholder-shown:top-[50%] peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-white/40 peer-placeholder-shown:uppercase-none peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-400 peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-widest peer-focus:-translate-y-0 pointer-events-none">
          {field.label}
        </label>
        {hasValue && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const SelectField = ({
  name,
  label,
  value,
  onChange,
  options,
  fullWidth,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  fullWidth?: boolean;
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      className="relative"
      style={{ gridColumn: fullWidth ? 'span 2' : undefined }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div
        className={`relative rounded-2xl transition-all duration-300 ${
          focused
            ? 'shadow-[0_0_30px_rgba(99,102,241,0.4)] ring-2 ring-indigo-500'
            : 'shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
        }`}
      >
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 pt-6 pb-3 text-sm outline-none backdrop-blur-sm transition-all duration-300 hover:border-white/20 appearance-none cursor-pointer"
        >
          <option value="" disabled className="bg-gray-900">Select {label}</option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-gray-900">{o}</option>
          ))}
        </select>
        <label className={`absolute left-5 pointer-events-none transition-all duration-300 ${value ? 'top-2 text-[10px] font-semibold uppercase tracking-widest text-indigo-400' : 'top-1/2 -translate-y-1/2 text-sm text-white/40'}`}>
          {label}
        </label>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          {value ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          ) : (
            <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function MentorshipPage() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobile: '',
    education: '', experience: '', placementGoal: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-12, 12]), springConfig);
  const glowX = useTransform(mouseX, [-200, 200], [0, 100]);
  const glowY = useTransform(mouseY, [-200, 200], [0, 100]);

  // Track completion progress
  useEffect(() => {
    const total = Object.keys(formData).length;
    const filled = Object.values(formData).filter(v => v.trim() !== '').length;
    setProgress(Math.round((filled / total) * 100));
  }, [formData]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/send-mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to send. Please try again.');

      setSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', mobile: '', education: '', experience: '', placementGoal: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    }

    setLoading(false);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-4"
      style={{ background: 'radial-gradient(ellipse at 20% 50%, #0d1117 0%, #0a0e1a 40%, #050810 100%)' }}>

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Floating orbs */}
      <FloatingOrb style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', top: '-10%', left: '-15%' }} />
      <FloatingOrb style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)', bottom: '-5%', right: '-10%' }} />
      <FloatingOrb style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)', top: '40%', right: '5%' }} />

      {/* Header */}
      <motion.div className="text-center mb-12 max-w-3xl z-10"
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>

        <motion.div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-6"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
          <span className="text-indigo-300 text-xs font-semibold tracking-widest uppercase">Limited Seats Available</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          1:1{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #c084fc 100%)' }}>
            Mentorship
          </span>
        </h1>
        <p className="text-white/50 mt-5 text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          A single application separates you from the career you deserve.
        </p>
      </motion.div>

      {/* Progress bar */}
      <motion.div className="w-full max-w-4xl mb-4 z-10 px-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <div className="flex justify-between text-xs text-white/30 mb-1.5">
          <span>Application Progress</span>
          <span className={progress === 100 ? 'text-emerald-400 font-bold' : ''}>{progress}% complete</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full"
            style={{ backgroundImage: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)' }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }} />
        </div>
      </motion.div>

      {/* 3D Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1200 }}
        className="relative z-10 w-full max-w-4xl"
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow effect that follows mouse */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-40"
          style={{
            background: `radial-gradient(400px circle at ${glowX}% ${glowY}%, rgba(99,102,241,0.3) 0%, transparent 60%)`,
          }}
        />

        {/* Glass card */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10"
          style={{ background: 'rgba(10, 14, 26, 0.85)', backdropFilter: 'blur(40px)', boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)' }}>

          {/* Top accent bar */}
          <div className="h-0.5 w-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent, #6366f1, #a855f7, #ec4899, transparent)' }} />

          <form onSubmit={handleSubmit} className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* Text inputs */}
            {FIELDS.map((field, i) => (
              <motion.div key={field.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.4 }}
                style={{ gridColumn: field.col === 2 ? 'span 2' : undefined }}>
                <InputField
                  field={field}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange as any}
                />
              </motion.div>
            ))}

            {/* Select fields */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <SelectField name="education" label="Education Level" value={formData.education} onChange={handleChange as any} options={EDUCATION_OPTIONS} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
              <SelectField name="placementGoal" label="Placement Goal" value={formData.placementGoal} onChange={handleChange as any} options={GOAL_OPTIONS} />
            </motion.div>

            {/* Textarea */}
            <motion.div className="relative" style={{ gridColumn: 'span 2' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.005 }}>
              <div className={`relative rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)]`}>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder=" "
                  className="peer w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 pt-7 pb-3 text-sm outline-none placeholder-transparent backdrop-blur-sm transition-all duration-300 hover:border-white/20 focus:border-indigo-500 focus:shadow-[0_0_30px_rgba(99,102,241,0.4)] focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <label className="absolute left-5 top-2 text-[10px] font-semibold uppercase tracking-widest text-indigo-400 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-white/40 peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-400 peer-focus:font-semibold peer-focus:tracking-widest pointer-events-none">
                  Why do you want this mentorship?
                </label>
                {formData.message && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-4 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p className="md:col-span-2 text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.div className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
              <motion.button
                type="submit"
                disabled={loading || success}
                className="relative w-full overflow-hidden rounded-2xl py-5 text-white font-bold text-base tracking-wide cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)' }}
                whileHover={!loading && !success ? { scale: 1.02, boxShadow: '0 20px 60px rgba(99,102,241,0.5)' } : {}}
                whileTap={!loading && !success ? { scale: 0.98 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}>

                {/* Shimmer */}
                {!loading && !success && (
                  <motion.div className="absolute inset-0 opacity-0 hover:opacity-100"
                    style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
                )}

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Application Sent Successfully!
                    </motion.div>
                  ) : loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending Application...
                    </motion.div>
                  ) : (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      Send My Application
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

            <p className="md:col-span-2 text-center text-white/20 text-xs">
              All fields are required. We respond within 24 hours.
            </p>
          </form>
        </div>
      </motion.div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        select option { background: #0a0e1a; color: white; }
      `}</style>
    </section>
  );
}
