'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
}));

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [12, -12]);
  const rotateY = useTransform(mouseX, [-300, 300], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set(e.clientX - cx);
    mouseY.set(e.clientY - cy);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: '◈' },
    { name: 'email', label: 'Gmail Address', type: 'email', placeholder: 'john@gmail.com', icon: '◉' },
    { name: 'mobile', label: 'Mobile Number', type: 'tel', placeholder: '+91 98765 43210', icon: '◎' },
  ];

  return (
    <section className="contact-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

        .contact-root {
          min-height: 100vh;
          background: #020409;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 1.5rem;
          font-family: 'Syne', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .bg-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,179,237,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,179,237,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .bg-orb-1 {
          position: fixed;
          width: 600px; height: 600px;
          top: -200px; right: -100px;
          background: radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%);
          pointer-events: none;
          animation: orb-float 12s ease-in-out infinite;
        }

        .bg-orb-2 {
          position: fixed;
          width: 500px; height: 500px;
          bottom: -150px; left: -100px;
          background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%);
          pointer-events: none;
          animation: orb-float 15s ease-in-out infinite reverse;
        }

        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
        }

        .particle {
          position: fixed;
          border-radius: 50%;
          background: rgba(99,179,237,0.4);
          pointer-events: none;
          animation: particle-drift linear infinite;
        }

        @keyframes particle-drift {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-20px) rotate(360deg); opacity: 0; }
        }

        .card-container {
          perspective: 1200px;
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 520px;
        }

        .card-inner {
          background: linear-gradient(135deg,
            rgba(255,255,255,0.05) 0%,
            rgba(255,255,255,0.02) 50%,
            rgba(99,179,237,0.04) 100%
          );
          backdrop-filter: blur(32px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 3rem;
          box-shadow:
            0 0 0 1px rgba(99,179,237,0.05),
            0 40px 80px rgba(0,0,0,0.6),
            0 0 60px rgba(79,70,229,0.08),
            inset 0 1px 0 rgba(255,255,255,0.1);
          transform-style: preserve-3d;
          position: relative;
        }

        .card-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 28px;
          background: linear-gradient(135deg,
            rgba(99,179,237,0.05) 0%,
            transparent 50%,
            rgba(79,70,229,0.05) 100%
          );
          pointer-events: none;
        }

        .card-shine {
          position: absolute;
          inset: 0;
          border-radius: 28px;
          background: radial-gradient(circle at var(--mx, 50%) var(--my, 30%),
            rgba(255,255,255,0.06) 0%,
            transparent 60%
          );
          pointer-events: none;
          transition: opacity 0.3s;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,179,237,0.1);
          border: 1px solid rgba(99,179,237,0.2);
          color: #63B3ED;
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 1.5rem;
        }

        .tag-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #63B3ED;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        .heading {
          font-size: clamp(2rem, 5vw, 2.6rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }

        .heading-accent {
          background: linear-gradient(135deg, #63B3ED, #7C3AED);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subheading {
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.05em;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .field-wrapper {
          position: relative;
          margin-bottom: 1.2rem;
        }

        .field-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.3s;
        }

        .field-label.active { color: #63B3ED; }

        .field-icon {
          font-size: 0.9rem;
          opacity: 0.6;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 14px 18px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .field-input::placeholder {
          color: rgba(255,255,255,0.2);
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
        }

        .field-input:focus {
          border-color: rgba(99,179,237,0.5);
          background: rgba(99,179,237,0.05);
          box-shadow:
            0 0 0 3px rgba(99,179,237,0.08),
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .field-input:hover:not(:focus) {
          border-color: rgba(255,255,255,0.13);
        }

        .field-textarea {
          resize: none;
          height: 110px;
          line-height: 1.6;
        }

        .field-glow {
          position: absolute;
          bottom: 0; left: 50%;
          width: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #63B3ED, transparent);
          transform: translateX(-50%);
          transition: width 0.4s ease;
          border-radius: 0 0 14px 14px;
        }

        .field-input:focus + .field-glow { width: 80%; }

        .required-star {
          color: #F87171;
          font-size: 0.7rem;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #4F46E5, #6366F1);
          border: none;
          border-radius: 16px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          box-shadow:
            0 8px 24px rgba(79,70,229,0.35),
            0 0 0 1px rgba(255,255,255,0.05) inset;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transition: left 0.5s ease;
        }

        .submit-btn:hover::before { left: 100%; }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(79,70,229,0.45), 0 0 0 1px rgba(255,255,255,0.05) inset;
        }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .error-msg {
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.25);
          color: #FCA5A5;
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          padding: 10px 14px;
          border-radius: 10px;
          margin-bottom: 1rem;
        }

        .success-card {
          text-align: center;
          padding: 3.5rem 2rem;
        }

        .success-icon-ring {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.1));
          border: 2px solid rgba(52,211,153,0.3);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 2rem;
          font-size: 2rem;
          animation: success-ping 0.6s ease-out;
        }

        @keyframes success-ping {
          0% { transform: scale(0.5); opacity: 0; }
          80% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .success-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.75rem;
        }

        .success-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.7;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
          margin: 1.5rem 0;
        }

        .contact-info {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .info-item {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.05em;
        }
      `}</style>

      <div className="bg-grid" />
      <div className="bg-orb-1" />
      <div className="bg-orb-2" />

      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            className="card-container"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="card-inner">
              <div className="success-card">
                <div className="success-icon-ring">✦</div>
                <div className="success-title">Message Sent!</div>
                <div className="success-text">
                  Your message has been transmitted successfully.<br />
                  We'll get back to you within 24 hours.
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            className="card-container"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              ref={cardRef}
              className="card-inner"
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <div className="card-shine" />

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="tag">
                  <div className="tag-dot" />
                  CONTACT TERMINAL
                </div>

                <div className="heading">
                  Let's <span className="heading-accent">Connect</span>
                </div>
                <div className="subheading">
                  All fields are required - send your details and we'll respond swiftly.
                </div>
              </motion.div>

              <form onSubmit={handleSubmit}>
                {error && (
                  <motion.div
                    className="error-msg"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ⚠ {error}
                  </motion.div>
                )}

                {fields.map((field, i) => (
                  <motion.div
                    key={field.name}
                    className="field-wrapper"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <div className={`field-label ${focused === field.name ? 'active' : ''}`}>
                      <span className="field-icon">{field.icon}</span>
                      {field.label} <span className="required-star">*</span>
                    </div>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={form[field.name as keyof typeof form]}
                      onChange={handleChange}
                      onFocus={() => setFocused(field.name)}
                      onBlur={() => setFocused(null)}
                      required
                      className="field-input"
                    />
                    <div className="field-glow" />
                  </motion.div>
                ))}

                <motion.div
                  className="field-wrapper"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.54 }}
                >
                  <div className={`field-label ${focused === 'message' ? 'active' : ''}`}>
                    <span className="field-icon">◐</span>
                    Message <span className="required-star">*</span>
                  </div>
                  <textarea
                    name="message"
                    placeholder="Describe your project, question, or idea..."
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    required
                    className="field-input field-textarea"
                  />
                  <div className="field-glow" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.62 }}
                >
                  <button type="submit" className="submit-btn" disabled={loading}>
                    <span className="btn-inner">
                      {loading ? (
                        <>
                          <div className="spinner" />
                          Transmitting...
                        </>
                      ) : (
                        <>
                          Send Message ⟶
                        </>
                      )}
                    </span>
                  </button>
                </motion.div>
              </form>

              <div className="divider" />
              <div className="contact-info">
                <span className="info-item">⟡ SECURE FORM</span>
                <span className="info-item">⟡ ENCRYPTED</span>
                <span className="info-item">⟡ 24H RESPONSE</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}