"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

type AuthMode = "signin" | "signup" | "forgot";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !isPasswordValid) return;

    setLoading(true);
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await sendPasswordResetEmail(auth, email);
        alert("Reset link sent to your email.");
        setMode("signin");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const rotation =
    mode === "signin"
      ? { rotateY: 0 }
      : mode === "signup"
      ? { rotateY: -90 }
      : { rotateX: 90 };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.1),transparent_40%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.15),transparent_40%)]" />
      </div>

      {/* 3D Scene */}
      <div
        className="relative w-[380px] h-[480px]"
        style={{ perspective: 1200 }}
      >
        <motion.div
          animate={rotation}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Signin Face */}
          <CubeFace title="Sign In" transform="rotateY(0deg) translateZ(190px)">
            <AuthForm
              mode="signin"
              email={email}
              password={password}
              showPassword={showPassword}
              setEmail={setEmail}
              setPassword={setPassword}
              setShowPassword={setShowPassword}
              handleAuth={handleAuth}
              loading={loading}
              handleGoogle={handleGoogle}
              switchMode={() => setMode("signup")}
            />
          </CubeFace>

          {/* Signup Face */}
          <CubeFace
            title="Sign Up"
            transform="rotateY(90deg) translateZ(190px)"
          >
            <AuthForm
              mode="signup"
              email={email}
              password={password}
              showPassword={showPassword}
              setEmail={setEmail}
              setPassword={setPassword}
              setShowPassword={setShowPassword}
              handleAuth={handleAuth}
              loading={loading}
              handleGoogle={handleGoogle}
              switchMode={() => setMode("signin")}
            />
          </CubeFace>

          {/* Forgot Face */}
          <CubeFace
            title="Reset"
            transform="rotateX(-90deg) translateZ(190px)"
          >
            <AuthForm
              mode="forgot"
              email={email}
              password={password}
              showPassword={showPassword}
              setEmail={setEmail}
              setPassword={setPassword}
              setShowPassword={setShowPassword}
              handleAuth={handleAuth}
              loading={loading}
              handleGoogle={handleGoogle}
              switchMode={() => setMode("signin")}
            />
          </CubeFace>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-10 flex gap-6 text-sm">
        <button onClick={() => setMode("signin")}>Sign In</button>
        <button onClick={() => setMode("signup")}>Sign Up</button>
        <button onClick={() => setMode("forgot")}>Forgot</button>
      </div>
    </main>
  );
}

function CubeFace({
  children,
  title,
  transform,
}: {
  children: React.ReactNode;
  title: string;
  transform: string;
}) {
  return (
    <div
      className="absolute w-full h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
      style={{
        transform,
        backfaceVisibility: "hidden",
      }}
    >
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      {children}
    </div>
  );
}

function AuthForm(props: any) {
  const {
    mode,
    email,
    password,
    showPassword,
    setEmail,
    setPassword,
    setShowPassword,
    handleAuth,
    loading,
    handleGoogle,
    switchMode,
  } = props;

  return (
    <form onSubmit={handleAuth} className="space-y-5">
      <div className="relative">
        <Mail className="absolute left-3 top-3 text-zinc-400" />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 py-3 rounded-lg bg-black/40 border border-zinc-700"
        />
      </div>

      {mode !== "forgot" && (
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-zinc-400" />
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-lg bg-black/40 border border-zinc-700"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      )}

      <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold">
        {loading
          ? "Please wait..."
          : mode === "signin"
          ? "Sign In"
          : mode === "signup"
          ? "Create Account"
          : "Send Reset Link"}
      </button>

      <button
        type="button"
        onClick={handleGoogle}
        className="w-full py-2 border border-zinc-700 rounded-lg"
      >
        Continue with Google
      </button>

      <button
        type="button"
        onClick={switchMode}
        className="text-sm text-cyan-400"
      >
        {mode === "signin"
          ? "Create account"
          : "Back to sign in"}
      </button>
    </form>
  );
}
