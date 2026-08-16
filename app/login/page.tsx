"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

import { Mail, User, Eye, EyeOff, X, Github } from "lucide-react";

import { FcGoogle } from "react-icons/fc";

import { auth } from "@/lib/firebase";

import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

// ============================================================
// Shared bits
// ============================================================

function SocialRow({
  onGoogle,
  onGithub,
  loading,
}: {
  onGoogle: () => void;
  onGithub: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onGoogle}
        disabled={loading}
        aria-label="Continue with Google"
        className="h-11 flex-1 rounded-full border border-[#1C2620]/15 dark:border-[#EFE9DC]/15 hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-center gap-2 text-sm font-medium text-[#1C2620] dark:text-[#F6F2E9]"
      >
        <FcGoogle size={18} />
        Google
      </button>

      <button
        type="button"
        onClick={onGithub}
        disabled={loading}
        aria-label="Continue with GitHub"
        className="h-11 flex-1 rounded-full border border-[#1C2620]/15 dark:border-[#EFE9DC]/15 hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-center gap-2 text-sm font-medium text-[#1C2620] dark:text-[#F6F2E9]"
      >
        <Github size={17} />
        GitHub
      </button>
    </div>
  );
}

interface LoginFormProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  remember: boolean;
  setRemember: (v: boolean) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onGoogle: () => void;
  onGithub: () => void;
  compact?: boolean;
}

function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  remember,
  setRemember,
  loading,
  error,
  onSubmit,
  onGoogle,
  onGithub,
  compact,
}: LoginFormProps) {
  return (
    <div className={compact ? "w-full" : "w-full max-w-sm"}>
      <h1 className="font-serif text-3xl text-[#1C2620] dark:text-[#F6F2E9]">
        Sign In
      </h1>
      <div className="mt-2 h-[3px] w-9 bg-[#C9A227]" />
      <p className="mt-4 text-sm text-[#1C2620]/60 dark:text-[#EFE9DC]/60">
        Login to continue your coding journey.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-6">
        <div>
          <label className="block text-[11px] tracking-[0.2em] font-medium text-[#1C2620]/50 dark:text-[#EFE9DC]/50">
            EMAIL ADDRESS
          </label>
          <div className="mt-2 flex items-center border-b border-[#1C2620]/20 dark:border-[#EFE9DC]/20 focus-within:border-[#0E2A21] dark:focus-within:border-[#DDBB55] transition">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-10 w-full bg-transparent outline-none text-sm text-[#1C2620] dark:text-[#F6F2E9] placeholder:text-[#1C2620]/30 dark:placeholder:text-[#EFE9DC]/30"
            />
            <Mail size={16} className="text-[#1C2620]/30 dark:text-[#EFE9DC]/30" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.2em] font-medium text-[#1C2620]/50 dark:text-[#EFE9DC]/50">
            PASSWORD
          </label>
          <div className="mt-2 flex items-center border-b border-[#1C2620]/20 dark:border-[#EFE9DC]/20 focus-within:border-[#0E2A21] dark:focus-within:border-[#DDBB55] transition">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-10 w-full bg-transparent outline-none text-sm text-[#1C2620] dark:text-[#F6F2E9] placeholder:text-[#1C2620]/30 dark:placeholder:text-[#EFE9DC]/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#1C2620]/30 hover:text-[#0E2A21] dark:text-[#EFE9DC]/30 dark:hover:text-[#DDBB55] transition"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-[#1C2620]/70 dark:text-[#EFE9DC]/70">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="h-3.5 w-3.5 rounded-sm accent-[#0E2A21]"
            />
            Keep me signed in
          </label>

          <Link
            href="/forgot-password"
            className="font-medium text-[#8A6D1F] dark:text-[#DDBB55] underline decoration-[#C9A227] underline-offset-4"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-900/40 dark:text-red-300 p-2.5 text-xs">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-full text-white text-sm font-semibold tracking-wide transition disabled:opacity-60"
          style={{ background: "linear-gradient(120deg, #0E2A21, #1B4A38)" }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 border-t border-[#1C2620]/15 dark:border-[#EFE9DC]/15" />
        <span className="text-[10px] tracking-[0.2em] text-[#1C2620]/40 dark:text-[#EFE9DC]/40">
          OR CONTINUE WITH
        </span>
        <div className="flex-1 border-t border-[#1C2620]/15 dark:border-[#EFE9DC]/15" />
      </div>

      <SocialRow onGoogle={onGoogle} onGithub={onGithub} loading={loading} />
    </div>
  );
}

interface SignupFormProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onGoogle: () => void;
  onGithub: () => void;
  compact?: boolean;
}

function SignupForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  error,
  onSubmit,
  onGoogle,
  onGithub,
  compact,
}: SignupFormProps) {
  return (
    <div className={compact ? "w-full" : "w-full max-w-sm"}>
      <h1 className="font-serif text-3xl text-[#1C2620] dark:text-[#F6F2E9]">
        Create Account
      </h1>
      <div className="mt-2 h-[3px] w-9 bg-[#C9A227]" />
      <p className="mt-4 text-sm text-[#1C2620]/60 dark:text-[#EFE9DC]/60">
        One account for every snippet, streak, and fact you save.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-6">
        <div>
          <label className="block text-[11px] tracking-[0.2em] font-medium text-[#1C2620]/50 dark:text-[#EFE9DC]/50">
            FULL NAME
          </label>
          <div className="mt-2 flex items-center border-b border-[#1C2620]/20 dark:border-[#EFE9DC]/20 focus-within:border-[#0E2A21] dark:focus-within:border-[#DDBB55] transition">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
              className="h-10 w-full bg-transparent outline-none text-sm text-[#1C2620] dark:text-[#F6F2E9] placeholder:text-[#1C2620]/30 dark:placeholder:text-[#EFE9DC]/30"
            />
            <User size={16} className="text-[#1C2620]/30 dark:text-[#EFE9DC]/30" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.2em] font-medium text-[#1C2620]/50 dark:text-[#EFE9DC]/50">
            EMAIL ADDRESS
          </label>
          <div className="mt-2 flex items-center border-b border-[#1C2620]/20 dark:border-[#EFE9DC]/20 focus-within:border-[#0E2A21] dark:focus-within:border-[#DDBB55] transition">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-10 w-full bg-transparent outline-none text-sm text-[#1C2620] dark:text-[#F6F2E9] placeholder:text-[#1C2620]/30 dark:placeholder:text-[#EFE9DC]/30"
            />
            <Mail size={16} className="text-[#1C2620]/30 dark:text-[#EFE9DC]/30" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.2em] font-medium text-[#1C2620]/50 dark:text-[#EFE9DC]/50">
            PASSWORD
          </label>
          <div className="mt-2 flex items-center border-b border-[#1C2620]/20 dark:border-[#EFE9DC]/20 focus-within:border-[#0E2A21] dark:focus-within:border-[#DDBB55] transition">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="h-10 w-full bg-transparent outline-none text-sm text-[#1C2620] dark:text-[#F6F2E9] placeholder:text-[#1C2620]/30 dark:placeholder:text-[#EFE9DC]/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#1C2620]/30 hover:text-[#0E2A21] dark:text-[#EFE9DC]/30 dark:hover:text-[#DDBB55] transition"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-[#1C2620]/40 dark:text-[#EFE9DC]/40">
            Use 8 characters or more
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-900/40 dark:text-red-300 p-2.5 text-xs">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-full text-white text-sm font-semibold tracking-wide transition disabled:opacity-60"
          style={{ background: "linear-gradient(120deg, #0E2A21, #1B4A38)" }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 border-t border-[#1C2620]/15 dark:border-[#EFE9DC]/15" />
        <span className="text-[10px] tracking-[0.2em] text-[#1C2620]/40 dark:text-[#EFE9DC]/40">
          OR CONTINUE WITH
        </span>
        <div className="flex-1 border-t border-[#1C2620]/15 dark:border-[#EFE9DC]/15" />
      </div>

      <SocialRow onGoogle={onGoogle} onGithub={onGithub} loading={loading} />
    </div>
  );
}

// ============================================================
// Page
// ============================================================

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // shared
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState(false); // false = sign in, true = sign up

  // sign in state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // sign up state
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suShowPassword, setSuShowPassword] = useState(false);

  const switchMode = (next: boolean) => {
    setError("");
    setActive(next);
  };

  // ===========================
  // Email Login
  // ===========================
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      login({
        name: userCredential.user.displayName ?? email.split("@")[0],
        email: userCredential.user.email ?? email,
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  // ===========================
  // Email Signup
  // ===========================
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, suEmail, suPassword);

      if (suName) {
        await updateProfile(userCredential.user, { displayName: suName });
      }

      login({
        name: suName || userCredential.user.displayName || suEmail.split("@")[0],
        email: userCredential.user.email ?? suEmail,
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  // ===========================
  // Google Login
  // ===========================
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      login({
        name: result.user.displayName ?? result.user.email?.split("@")[0] ?? "",
        email: result.user.email ?? "",
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  // ===========================
  // Github Login
  // ===========================
  const handleGithubLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);

      login({
        name: result.user.displayName ?? result.user.email?.split("@")[0] ?? "",
        email: result.user.email ?? "",
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  const overlayClip = active
    ? "polygon(0 0, 88% 0, 100% 100%, 0% 100%)"
    : "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)";

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#EDE8DB] dark:bg-[#0B120E] px-4 py-10 sm:px-6 transition-colors duration-300">
      <div className="animate-cardIn w-full max-w-4xl">
        <div className="relative w-full mx-auto rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden shadow-2xl bg-[#F6F2E9] dark:bg-[#141C17] md:h-[600px]">
          {/* Close */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 right-4 z-30 h-9 w-9 rounded-full flex items-center justify-center text-[#1C2620] hover:bg-black/5 dark:text-[#EFE9DC] dark:hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>

          {/* ===================== DESKTOP (sliding panel) ===================== */}
          <div className="hidden md:block relative w-full h-full">
            {/* Sign in pane */}
            <div
              className="absolute top-0 left-0 w-1/2 h-full flex items-center justify-center px-10 lg:px-14"
              style={{
                transform: active ? "translateX(100%)" : "translateX(0)",
                opacity: active ? 0 : 1,
                zIndex: active ? 1 : 5,
                pointerEvents: active ? "none" : "auto",
                transition: "transform 0.7s ease-in-out, opacity 0.3s ease-in-out",
              }}
            >
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                remember={remember}
                setRemember={setRemember}
                loading={loading}
                error={error}
                onSubmit={handleLogin}
                onGoogle={handleGoogleLogin}
                onGithub={handleGithubLogin}
              />
            </div>

            {/* Sign up pane */}
            <div
              className="absolute top-0 left-0 w-1/2 h-full flex items-center justify-center px-10 lg:px-14"
              style={{
                transform: active ? "translateX(100%)" : "translateX(0)",
                opacity: active ? 1 : 0,
                zIndex: active ? 5 : 1,
                pointerEvents: active ? "auto" : "none",
                transition: "transform 0.7s ease-in-out, opacity 0.3s ease-in-out",
              }}
            >
              <SignupForm
                name={suName}
                setName={setSuName}
                email={suEmail}
                setEmail={setSuEmail}
                password={suPassword}
                setPassword={setSuPassword}
                showPassword={suShowPassword}
                setShowPassword={setSuShowPassword}
                loading={loading}
                error={error}
                onSubmit={handleSignup}
                onGoogle={handleGoogleLogin}
                onGithub={handleGithubLogin}
              />
            </div>

            {/* Overlay brand panel */}
            <div
              className="absolute top-0 h-full w-1/2 overflow-hidden z-20"
              style={{
                left: "50%",
                transform: active ? "translateX(-100%)" : "translateX(0)",
                clipPath: overlayClip,
                transition: "transform 0.7s ease-in-out",
                background: "linear-gradient(160deg, #0E2A21 0%, #143A2C 55%, #1B4A38 100%)",
              }}
            >
              <div className="relative h-full flex flex-col justify-center px-12 lg:px-16 text-white">
                <span
                  key={active ? "eyebrow-su" : "eyebrow-si"}
                  className="animate-fadeSlide text-xs tracking-[0.35em] font-semibold text-[#DDBB55]"
                >
                  CODENFACTS
                </span>

                {active ? (
                  <div key="msg-si">
                    <h2 className="animate-fadeSlide mt-6 font-serif text-4xl leading-[1.1] text-white">
                      Welcome
                      <br />
                      <span className="italic text-[#DDBB55]">back.</span>
                    </h2>
                    <p className="animate-fadeSlide mt-5 max-w-xs text-white/70 leading-relaxed text-sm">
                      Your streaks, saved snippets, and every fact you&apos;ve
                      bookmarked are exactly where you left them.
                    </p>
                    <button
                      onClick={() => switchMode(false)}
                      className="animate-fadeSlide mt-8 h-11 px-8 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition w-fit"
                    >
                      Sign In
                    </button>
                  </div>
                ) : (
                  <div key="msg-su">
                    <h2 className="animate-fadeSlide mt-6 font-serif text-4xl leading-[1.1] text-white">
                      Start the
                      <br />
                      <span className="italic text-[#DDBB55]">first page.</span>
                    </h2>
                    <p className="animate-fadeSlide mt-5 max-w-xs text-white/70 leading-relaxed text-sm">
                      One account for every board, every draft, and every
                      device you own.
                    </p>
                    <button
                      onClick={() => switchMode(true)}
                      className="animate-fadeSlide mt-8 h-11 px-8 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition w-fit"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===================== MOBILE (stacked, tab switch) ===================== */}
          <div className="md:hidden">
            <div
              className="relative px-7 pt-8 pb-8 text-white overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0E2A21 0%, #143A2C 55%, #1B4A38 100%)",
                clipPath: "polygon(0 0, 100% 0, 100% 82%, 0 100%)",
              }}
            >
              <span className="text-[11px] tracking-[0.35em] font-semibold text-[#DDBB55]">
                CODENFACTS
              </span>
              <h2
                key={active ? "m-su" : "m-si"}
                className="animate-fadeSlide mt-3 font-serif text-2xl leading-tight"
              >
                {active ? (
                  <>
                    Start the <span className="italic text-[#DDBB55]">first page.</span>
                  </>
                ) : (
                  <>
                    Welcome <span className="italic text-[#DDBB55]">back.</span>
                  </>
                )}
              </h2>
            </div>

            <div className="px-6 sm:px-8 pt-6 pb-8">
              {/* Tab switcher */}
              <div className="flex rounded-full border border-[#1C2620]/15 dark:border-[#EFE9DC]/15 p-1 mb-6">
                <button
                  onClick={() => switchMode(false)}
                  className={`flex-1 h-9 rounded-full text-sm font-semibold transition ${
                    !active
                      ? "bg-[#0E2A21] text-white"
                      : "text-[#1C2620]/60 dark:text-[#EFE9DC]/60"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => switchMode(true)}
                  className={`flex-1 h-9 rounded-full text-sm font-semibold transition ${
                    active
                      ? "bg-[#0E2A21] text-white"
                      : "text-[#1C2620]/60 dark:text-[#EFE9DC]/60"
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div key={active ? "form-su" : "form-si"} className="animate-fadeSlide">
                {active ? (
                  <SignupForm
                    compact
                    name={suName}
                    setName={setSuName}
                    email={suEmail}
                    setEmail={setSuEmail}
                    password={suPassword}
                    setPassword={setSuPassword}
                    showPassword={suShowPassword}
                    setShowPassword={setSuShowPassword}
                    loading={loading}
                    error={error}
                    onSubmit={handleSignup}
                    onGoogle={handleGoogleLogin}
                    onGithub={handleGithubLogin}
                  />
                ) : (
                  <LoginForm
                    compact
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    remember={remember}
                    setRemember={setRemember}
                    loading={loading}
                    error={error}
                    onSubmit={handleLogin}
                    onGoogle={handleGoogleLogin}
                    onGithub={handleGithubLogin}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer switch line (desktop redundancy for accessibility / no-js fallback feel) */}
        <p className="hidden md:block text-center mt-5 text-sm text-[#1C2620]/60 dark:text-[#EFE9DC]/50">
          {active ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => switchMode(false)}
                className="font-semibold text-[#8A6D1F] dark:text-[#DDBB55] underline underline-offset-4"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              New to CodeNFacts?{" "}
              <button
                onClick={() => switchMode(true)}
                className="font-semibold text-[#8A6D1F] dark:text-[#DDBB55] underline underline-offset-4"
              >
                Create an account
              </button>
            </>
          )}
        </p>
      </div>

      <style jsx>{`
        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-cardIn {
          animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeSlide {
          animation: fadeSlide 0.45s ease-out both;
        }
      `}</style>
    </main>
  );
}