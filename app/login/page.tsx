"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

type AuthMode = "signin" | "signup" | "forgot";

/* ── Animated Grain Texture ─────────────────────────────────────────────── */
function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.035] mix-blend-multiply"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px",
      }}
    />
  );
}

/* ── Ink Blobs ──────────────────────────────────────────────────────────── */
function InkBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-40 -left-40 w-[700px] h-[700px] opacity-50"
        animate={{ rotate: [0, 8, -4, 0], scale: [1, 1.05, 0.97, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#c9a97a" d="M47.7,-57.2C60.5,-46.5,68.9,-30.1,71.5,-13C74.1,4.1,71,21.9,61.9,35.2C52.8,48.5,37.7,57.3,21.2,63.1C4.7,68.9,-13.2,71.7,-27.8,65.5C-42.4,59.3,-53.7,44.2,-62.1,27C-70.4,9.8,-75.8,-9.5,-70.7,-25.4C-65.6,-41.3,-50,-53.9,-34.2,-63.6C-18.4,-73.3,-2.4,-80.1,12.3,-77.3C27,-74.5,34.9,-68,47.7,-57.2Z" transform="translate(100 100)" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute -bottom-24 -right-24 w-[550px] h-[550px] opacity-35"
        animate={{ rotate: [0, -6, 12, 0], scale: [1, 0.96, 1.07, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#a05c4a" d="M38.9,-50.2C52.4,-38.8,66.5,-28.6,70.8,-15C75.1,-1.4,69.6,15.6,60.2,29.1C50.8,42.5,37.6,52.5,22.8,59.4C8,66.2,-8.4,70,-22.5,65.4C-36.6,60.8,-48.4,47.9,-57.9,32.8C-67.3,17.7,-74.3,0.4,-70.6,-14.4C-66.9,-29.1,-52.5,-41.2,-37.8,-52.5C-23.1,-63.9,-8,-74.5,4.1,-79.5C16.2,-84.5,25.4,-61.5,38.9,-50.2Z" transform="translate(100 100)" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-1/3 -right-48 w-[400px] h-[400px] opacity-20"
        animate={{ rotate: [0, 15, -5, 0], y: [0, -24, 12, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#6b8f71" d="M43.3,-55.8C55.9,-45.3,65.3,-31.1,69.4,-15.3C73.5,0.5,72.3,18,64.4,32C56.5,46,41.8,56.5,26,62.8C10.2,69.1,-6.7,71.2,-22.1,66.1C-37.5,61,-51.3,48.7,-60.1,33.7C-68.9,18.7,-72.7,1,-67.8,-14C-62.9,-29,-49.3,-41.3,-35.2,-51.8C-21.1,-62.3,-6.5,-71,8.3,-71.4C23.1,-71.8,30.7,-66.3,43.3,-55.8Z" transform="translate(100 100)" />
        </svg>
      </motion.div>

      {[
        { x: "12%", y: "38%", size: 7, color: "#c9a97a", delay: 0 },
        { x: "78%", y: "18%", size: 5, color: "#a05c4a", delay: 1.5 },
        { x: "68%", y: "62%", size: 10, color: "#6b8f71", delay: 3 },
        { x: "22%", y: "72%", size: 6, color: "#c9a97a", delay: 4.5 },
      ].map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-40"
          style={{ left: d.x, top: d.y, width: `${d.size}rem`, height: `${d.size}rem`, background: d.color }}
          animate={{ y: [0, -14, 0], opacity: [0.25, 0.65, 0.25], scale: [1, 1.35, 1] }}
          transition={{ duration: 6 + i, repeat: Infinity, delay: d.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ── Organic Input ──────────────────────────────────────────────────────── */
function OrganicInput({
  label,
  type,
  value,
  onChange,
  icon,
  rightEl,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  rightEl?: React.ReactNode;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const lifted = focused || hasValue;

  return (
    <div className="relative group">
      {icon && (
        <motion.div
          className="absolute left-0 bottom-2.5 pointer-events-none"
          animate={{ color: focused ? "#a05c4a" : "rgba(60,35,20,0.25)", scale: focused ? 1.1 : 1 }}
          transition={{ duration: 0.25 }}
        >
          {icon}
        </motion.div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-px transition-colors duration-300" style={{ background: "rgba(60,35,20,0.12)" }} />
      <motion.div
        className="absolute bottom-0 left-0 h-px origin-left"
        style={{ background: "linear-gradient(90deg, #a05c4a, #c9a97a)" }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      <motion.label
        animate={{
          y: lifted ? -24 : 0,
          scale: lifted ? 0.75 : 1,
          color: focused ? "#a05c4a" : "rgba(60,35,20,0.35)",
          x: lifted ? 0 : (icon ? 20 : 0),
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute left-0 top-3.5 origin-left pointer-events-none text-sm"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {label}
      </motion.label>
      <input
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pt-7 pb-2.5 bg-transparent outline-none text-sm"
        style={{
          color: "rgba(30,15,8,0.88)",
          fontFamily: "'Lora', Georgia, serif",
          caretColor: "#a05c4a",
          paddingLeft: icon ? "1.5rem" : 0,
          paddingRight: rightEl ? "1.75rem" : 0,
        }}
      />
      {rightEl && <div className="absolute right-0 bottom-2.5">{rightEl}</div>}
    </div>
  );
}

/* ── Strength Petals ────────────────────────────────────────────────────── */
function StrengthPetals({ validation }: { validation: Record<string, boolean> }) {
  const score = Object.values(validation).filter(Boolean).length;
  const colors = ["#e8c4a0", "#d4956a", "#a05c4a", "#6b3d2e"];
  const labels = ["8+ chars", "Uppercase", "Number", "Symbol"];
  const keys = ["length", "capital", "number", "symbol"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="flex items-center gap-3 pt-1 pb-1"
    >
      <div className="relative w-9 h-9 flex-shrink-0">
        {[0, 1, 2, 3].map((i) => (
          <motion.div key={i} className="absolute inset-0 flex items-center justify-center" style={{ rotate: i * 90 }}>
            <motion.div
              className="w-1.5 h-3.5 rounded-full origin-bottom"
              style={{ marginBottom: "3px" }}
              animate={{
                background: i < score ? colors[score - 1] : "rgba(60,35,20,0.1)",
                scaleY: i < score ? 1 : 0.45,
              }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            />
          </motion.div>
        ))}
        <div
          className="absolute inset-0 flex items-center justify-center text-xs font-bold"
          style={{ color: score > 0 ? colors[score - 1] : "rgba(60,35,20,0.2)", fontFamily: "'Lora', serif" }}
        >
          {score}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {keys.map((k, i) => (
          <motion.span
            key={k}
            animate={{ color: validation[k] ? "#6b3d2e" : "rgba(60,35,20,0.28)" }}
            className="text-xs"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            {validation[k] ? "✦" : "○"} {labels[i]}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Mobile Top Banner ──────────────────────────────────────────────────── */
function MobileBanner({ mode }: { mode: AuthMode }) {
  return (
    <div
      className="lg:hidden w-full relative overflow-hidden flex items-center justify-between px-6 py-5 flex-shrink-0"
      style={{ background: "#2a1a0e" }}
    >
      <InkBlobsMini />
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ background: "#c9a97a", color: "#2a1a0e" }}>✦</div>
        <span className="text-base font-bold" style={{ color: "#e8d5be", fontFamily: "'Playfair Display', serif" }}>Cipher</span>
      </div>
      <span className="relative z-10 text-xs tracking-widest uppercase" style={{ color: "rgba(201,169,122,0.55)", fontFamily: "'Lora', serif" }}>
        {mode === "signin" ? "Welcome back" : mode === "signup" ? "Join us" : "Recovery"}
      </span>
    </div>
  );
}

function InkBlobsMini() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <motion.div
        className="absolute -top-8 -left-8 w-32 h-32"
        animate={{ rotate: [0, 8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#c9a97a" d="M47.7,-57.2C60.5,-46.5,68.9,-30.1,71.5,-13C74.1,4.1,71,21.9,61.9,35.2C52.8,48.5,37.7,57.3,21.2,63.1C4.7,68.9,-13.2,71.7,-27.8,65.5C-42.4,59.3,-53.7,44.2,-62.1,27C-70.4,9.8,-75.8,-9.5,-70.7,-25.4C-65.6,-41.3,-50,-53.9,-34.2,-63.6C-18.4,-73.3,-2.4,-80.1,12.3,-77.3C27,-74.5,34.9,-68,47.7,-57.2Z" transform="translate(100 100)" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute -bottom-4 -right-4 w-24 h-24 opacity-60"
        animate={{ rotate: [0, -10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#a05c4a" d="M38.9,-50.2C52.4,-38.8,66.5,-28.6,70.8,-15C75.1,-1.4,69.6,15.6,60.2,29.1C50.8,42.5,37.6,52.5,22.8,59.4C8,66.2,-8.4,70,-22.5,65.4C-36.6,60.8,-48.4,47.9,-57.9,32.8C-67.3,17.7,-74.3,0.4,-70.6,-14.4C-66.9,-29.1,-52.5,-41.2,-37.8,-52.5C-23.1,-63.9,-8,-74.5,4.1,-79.5C16.2,-84.5,25.4,-61.5,38.9,-50.2Z" transform="translate(100 100)" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ── Sticky Footer ──────────────────────────────────────────────────────── */
function StickyFooter({
  mode,
  switchMode,
}: {
  mode: AuthMode;
  switchMode: (m: AuthMode) => void;
}) {
  return (
    <div
      className="w-full flex-shrink-0 px-6 sm:px-8 lg:px-0"
      style={{
        borderTop: "1px solid rgba(60,35,20,0.07)",
        background: "rgba(245,237,224,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="max-w-[400px] mx-auto py-4 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {mode === "signin" && (
            <motion.div
              key="signin-footer"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => switchMode("forgot")}
                className="text-xs hover:opacity-70 transition-opacity"
                style={{ color: "#a05c4a", fontFamily: "'Lora', serif" }}
              >
                Forgot password?
              </button>
              <span style={{ color: "rgba(60,35,20,0.15)" }}>·</span>
              <button
                onClick={() => switchMode("signup")}
                className="text-xs hover:opacity-70 transition-opacity"
                style={{ color: "rgba(60,35,20,0.38)", fontFamily: "'Lora', serif" }}
              >
                No account? Sign up →
              </button>
            </motion.div>
          )}
          {mode === "signup" && (
            <motion.div
              key="signup-footer"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => switchMode("signin")}
                className="text-xs hover:opacity-70 transition-opacity flex items-center gap-1.5"
                style={{ color: "rgba(60,35,20,0.38)", fontFamily: "'Lora', serif" }}
              >
                ← Back to sign in
              </button>
              <span style={{ color: "rgba(60,35,20,0.15)" }}>·</span>
              <span className="text-xs" style={{ color: "rgba(60,35,20,0.25)", fontFamily: "'Lora', serif" }}>
                Already have an account?
              </span>
            </motion.div>
          )}
          {mode === "forgot" && (
            <motion.div
              key="forgot-footer"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => switchMode("signin")}
                className="text-xs hover:opacity-70 transition-opacity flex items-center gap-1.5"
                style={{ color: "rgba(60,35,20,0.38)", fontFamily: "'Lora', serif" }}
              >
                ← Back to sign in
              </button>
              <span style={{ color: "rgba(60,35,20,0.15)" }}>·</span>
              <span className="text-xs" style={{ color: "rgba(60,35,20,0.25)", fontFamily: "'Lora', serif" }}>
                We'll email a reset link
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Version badge — always visible */}
        <span
          className="text-xs flex-shrink-0"
          style={{ color: "rgba(60,35,20,0.18)", fontFamily: "'Lora', serif", letterSpacing: "0.12em" }}
        >
          v6.7.0
        </span>
      </div>
    </div>
  );
}

/* ── Main Auth Page ─────────────────────────────────────────────────────── */
export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const validation = useMemo(
    () => ({
      length: password.length >= 8,
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      capital: /[A-Z]/.test(password),
    }),
    [password]
  );

  const isPasswordValid = Object.values(validation).every(Boolean);

  const switchMode = (m: AuthMode) => {
    setError("");
    setMode(m);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!name.trim()) { setError("Please enter your name."); return; }
      if (!isPasswordValid) { setError("Please meet all password requirements."); return; }
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      } else if (mode === "signup") {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;
        await updateProfile(user, { displayName: name.trim() });
        await setDoc(doc(db, "users", user.uid), {
          name: name.trim(),
          email: user.email,
          purchasedCourses: [],
          createdAt: new Date().toISOString(),
        });
        router.push("/dashboard");
      } else {
        await sendPasswordResetEmail(auth, email);
        setSent(true);
        setTimeout(() => { setSent(false); switchMode("signin"); }, 3000);
      }
    } catch (err: any) {
      const msg = err.code === "auth/email-already-in-use"
        ? "This email is already registered. Try signing in."
        : err.code === "auth/wrong-password" || err.code === "auth/user-not-found"
        ? "Invalid email or password."
        : err.code === "auth/invalid-email"
        ? "Please enter a valid email address."
        : err.message || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "",
          email: user.email,
          purchasedCourses: [],
          createdAt: new Date().toISOString(),
        });
      }
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Google sign-in failed. Please try again.");
    }
  };

  const modeConfig = {
    signin: { headline: "Welcome back,", sub: "sign in to continue your journey", cta: "Sign In", icon: "✦" },
    signup: { headline: "Begin here,", sub: "create your account", cta: "Create Account", icon: "✿" },
    forgot: { headline: "Recover,", sub: "we'll send a reset link", cta: "Send Link", icon: "◈" },
  };
  const cfg = modeConfig[mode];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; }
        ::selection { background: rgba(160,92,74,0.2); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #f5ede0 inset !important;
          -webkit-text-fill-color: rgba(30,15,8,0.88) !important;
        }
        ::-webkit-scrollbar { display: none; }
        html, body { height: 100%; overflow: hidden; }
      `}</style>

      <GrainOverlay />

      <main
        className="h-screen flex flex-col lg:flex-row overflow-hidden"
        style={{ background: "#f5ede0", fontFamily: "'Lora', Georgia, serif" }}
      >
        {/* ── Mobile banner ── */}
        <MobileBanner mode={mode} />

        {/* ── Left decorative panel (desktop only) ── */}
        <div
          className="hidden lg:flex flex-col justify-between w-[42%] xl:w-2/5 relative overflow-hidden flex-shrink-0"
          style={{ background: "#2a1a0e", padding: "clamp(2rem, 4vw, 4rem)" }}
        >
          <InkBlobs />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm" style={{ background: "#c9a97a", color: "#2a1a0e" }}>✦</div>
            <span className="text-xl font-bold tracking-wide" style={{ color: "#e8d5be", fontFamily: "'Playfair Display', serif" }}>Cipher</span>
          </motion.div>

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <p
              className="leading-tight font-bold italic mb-8"
              style={{
                color: "#e8d5be",
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
              }}
            >
              "Every great<br />work begins<br />with a single<br />mark."
            </p>

            <div className="flex flex-col gap-4 mb-8">
              {[
                { label: "Create your account", active: mode === "signup" },
                { label: "Sign in securely", active: mode === "signin" },
                { label: "Access your dashboard", active: false },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  animate={{ opacity: step.active ? 1 : 0.35 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    animate={{ background: step.active ? "#c9a97a" : "rgba(201,169,122,0.3)", scale: step.active ? 1.4 : 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="text-xs tracking-wider" style={{ color: "#c9a97a", fontFamily: "'Lora', serif" }}>{step.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-px" style={{ background: "#c9a97a" }} />
              <span className="text-xs" style={{ color: "#c9a97a", letterSpacing: "0.2em" }}>CodeNFacts V2.0</span>
            </div>
          </motion.div>

          <motion.div className="relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-px rounded-full"
                  style={{ background: "#c9a97a", width: i === 1 ? 36 : 14, opacity: i === 1 ? 1 : 0.35 }}
                  animate={{ scaleX: [1, 1.5, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
            </div>
          </motion.div>

          <div
            className="absolute right-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs tracking-[0.5em] select-none whitespace-nowrap"
            style={{ color: "rgba(200,165,122,0.12)", fontFamily: "'Lora', serif" }}
          >
            CodeNFacts Version 1.2.o
          </div>
        </div>

        {/* ── Right panel — flex column, footer always at bottom ── */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">

          {/* Scrollable form area */}
          <div className="flex-1 overflow-y-auto flex items-start lg:items-center justify-center">
            <div className="w-full max-w-[400px] px-6 sm:px-8 lg:px-0 py-8 lg:py-10">

              {/* Mode toggle */}
              <div className="lg:absolute lg:top-8 lg:right-8 flex gap-1.5 justify-end mb-8 lg:mb-0">
                {(["signin", "signup"] as AuthMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className="px-4 py-1.5 rounded-full text-xs transition-all duration-300"
                    style={{
                      background: mode === m ? "#2a1a0e" : "transparent",
                      color: mode === m ? "#e8d5be" : "rgba(60,35,20,0.38)",
                      fontFamily: "'Lora', serif",
                      border: "1px solid",
                      borderColor: mode === m ? "#2a1a0e" : "rgba(60,35,20,0.14)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {m === "signin" ? "Sign in" : "Sign up"}
                  </button>
                ))}
              </div>

              {/* Headline */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode + "-h"}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <p className="text-xs tracking-[0.28em] mb-2 uppercase flex items-center gap-2" style={{ color: "#a05c4a" }}>
                    <span>{cfg.icon}</span>
                    <span>{cfg.sub}</span>
                  </p>
                  <h1
                    className="leading-tight font-bold"
                    style={{
                      color: "#1e0f08",
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(1.9rem, 5vw, 2.6rem)",
                    }}
                  >
                    {cfg.headline}
                  </h1>
                </motion.div>
              </AnimatePresence>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={mode}
                  onSubmit={handleAuth}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <AnimatePresence>
                    {mode === "signup" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -8 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <OrganicInput
                          label="Your Name"
                          type="text"
                          value={name}
                          onChange={setName}
                          autoComplete="name"
                          icon={<User size={14} />}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <OrganicInput
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    autoComplete="email"
                    icon={<Mail size={14} />}
                  />

                  {mode !== "forgot" && (
                    <OrganicInput
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={setPassword}
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      icon={<Lock size={14} />}
                      rightEl={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ color: "rgba(60,35,20,0.3)" }}
                          className="hover:opacity-70 transition-opacity"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      }
                    />
                  )}

                  <AnimatePresence>
                    {mode === "signup" && password.length > 0 && (
                      <StrengthPetals validation={validation} />
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        className="text-xs py-3 px-4 rounded-xl"
                        style={{
                          background: "rgba(160,92,74,0.08)",
                          border: "1px solid rgba(160,92,74,0.22)",
                          color: "#a05c4a",
                          fontFamily: "'Lora', serif",
                        }}
                      >
                        ◈ &nbsp;{error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {sent && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs py-3 px-4 rounded-xl text-center"
                        style={{
                          background: "rgba(107,143,113,0.08)",
                          border: "1px solid rgba(107,143,113,0.25)",
                          color: "#4a7a52",
                          fontFamily: "'Lora', serif",
                        }}
                      >
                        ✦ &nbsp;Link sent - check your inbox
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-1 space-y-3.5">
                    {/* Primary CTA */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="relative w-full py-4 rounded-2xl overflow-hidden flex items-center justify-center gap-3 text-xs font-medium disabled:opacity-70"
                      style={{
                        background: "linear-gradient(135deg, #2a1a0e 0%, #3d2411 100%)",
                        color: "#e8d5be",
                        fontFamily: "'Lora', serif",
                        letterSpacing: "0.18em",
                        boxShadow: "0 8px 32px rgba(42,26,14,0.25), inset 0 1px 0 rgba(201,169,122,0.15)",
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: "linear-gradient(105deg, transparent 35%, rgba(201,169,122,0.18) 50%, transparent 65%)",
                          backgroundSize: "200% 100%",
                        }}
                        animate={{ backgroundPositionX: ["200%", "-100%"] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
                      />
                      {loading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
                          <Loader2 size={16} />
                        </motion.div>
                      ) : (
                        <>
                          <span className="uppercase tracking-widest">{cfg.cta}</span>
                          <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                            <ArrowRight size={14} />
                          </motion.div>
                        </>
                      )}
                    </motion.button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-1">
                      <div className="flex-1 h-px" style={{ background: "rgba(60,35,20,0.09)" }} />
                      <span className="text-xs" style={{ color: "rgba(60,35,20,0.2)", letterSpacing: "0.2em" }}>✦</span>
                      <div className="flex-1 h-px" style={{ background: "rgba(60,35,20,0.09)" }} />
                    </div>

                    {/* Google */}
                    <motion.button
                      type="button"
                      onClick={handleGoogle}
                      whileHover={{ backgroundColor: "rgba(60,35,20,0.05)", scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-3 text-xs transition-all duration-200"
                      style={{
                        border: "1px solid rgba(60,35,20,0.11)",
                        color: "rgba(60,35,20,0.55)",
                        fontFamily: "'Lora', serif",
                        letterSpacing: "0.04em",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </motion.button>
                  </div>
                </motion.form>
              </AnimatePresence>

            </div>
          </div>

          {/* ── Always-visible sticky footer ── */}
          <StickyFooter mode={mode} switchMode={switchMode} />

        </div>
      </main>
    </>
  );
}