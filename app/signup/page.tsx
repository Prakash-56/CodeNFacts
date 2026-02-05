"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";

type AuthMode = "login" | "signup" | "forgot-password";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔐 Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/my-courses");
      }
    });
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
          },
        });
        if (error) throw error;

        setSuccess("Check your email to confirm your account 📩");
      }

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        router.replace("/my-courses");
      }

      if (mode === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}/reset-password`,
        });
        if (error) throw error;

        setSuccess("Password reset link sent 📬");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleAuth} className="space-y-5">
            <h1 className="text-2xl font-bold text-white text-center capitalize">
              {mode.replace("-", " ")}
            </h1>

            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {mode !== "forgot-password" && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-400 text-sm text-center">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold flex items-center justify-center gap-2 transition"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2">
            {mode !== "forgot-password" && (
              <button
                onClick={() =>
                  setMode(mode === "login" ? "signup" : "login")
                }
                className="text-blue-400 hover:underline"
              >
                {mode === "login"
                  ? "Need an account? Sign up"
                  : "Already have an account? Login"}
              </button>
            )}

            {mode === "login" && (
              <button
                onClick={() => setMode("forgot-password")}
                className="block mx-auto text-slate-400 hover:underline"
              >
                Forgot password?
              </button>
            )}

            {mode === "forgot-password" && (
              <button
                onClick={() => setMode("login")}
                className="text-blue-400 hover:underline"
              >
                Back to login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
