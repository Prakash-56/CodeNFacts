"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  Github,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";

import { auth } from "@/lib/firebase";

import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  // ===========================
  // Email Login
  // ===========================

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

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

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-100 dark:from-[#08111F] dark:via-[#111827] dark:to-[#1E293B] px-6 py-10">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="text-center mb-8">

          <Link
            href="/"
            className="text-4xl font-bold text-blue-600"
          >
            CodeNFacts
          </Link>

          <p className="text-gray-500 mt-3 dark:text-gray-400">
            Welcome back 👋
          </p>

        </div>

        {/* Card */}

        <div className="relative rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl p-8">

          {/* Close */}

          <button
            onClick={() => router.back()}
            className="absolute top-5 right-5 h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>

          <h1 className="text-3xl font-bold">
            Sign In
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Login to continue your coding journey.
          </p>

          {/* Google */}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-8 h-12 w-full rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-3 font-medium"
          >
            <FcGoogle size={24} />

            Continue with Google
          </button>

          {/* Github */}

          <button
            onClick={handleGithubLogin}
            disabled={loading}
            className="mt-4 h-12 w-full rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-3 font-medium"
          >
            <Github size={20} />

            Continue with GitHub
          </button>

          <div className="flex items-center gap-3 my-7">

            <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>

            <span className="text-sm text-gray-400">
              OR
            </span>

            <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>

          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* Email */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 px-4 focus-within:border-blue-500 transition">

                <Mail
                  size={18}
                  className="text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-12 w-full bg-transparent outline-none px-3"
                />

              </div>
            </div>

            {/* Password */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 px-4 focus-within:border-blue-500 transition">

                <Lock
                  size={18}
                  className="text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 w-full bg-transparent outline-none px-3"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="text-gray-400 hover:text-blue-500 transition"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Remember */}

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() =>
                    setRemember(!remember)
                  }
                  className="rounded"
                />

                Remember Me

              </label>

              <Link
                href="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Error */}

            {error && (
              <div className="rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-3 text-sm">
                {error}
              </div>
            )}

            {/* Login */}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
            >

              {loading ? "Signing In..." : "Sign In"}

            </button>

          </form>

          {/* Footer */}

          <div className="mt-8 text-center text-sm text-gray-500">

            Don&apos;t have an account?{" "}

            <Link
              href="/signup"
              className="font-semibold text-blue-600 hover:underline"
            >
              Create Account
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}