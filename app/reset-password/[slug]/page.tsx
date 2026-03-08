"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Lock, ShieldCheck, Zap, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";
import { confirmPasswordReset, getAuth } from "firebase/auth";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  // FIX: useSpring only accepts MotionValue<number> — use separate x/y values
  const mousePosX = useMotionValue(0);
  const mousePosY = useMotionValue(0);
  const springX = useSpring(mousePosX, { stiffness: 170, damping: 26 });
  const springY = useSpring(mousePosY, { stiffness: 170, damping: 26 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Validate Firebase link on mount
  useEffect(() => {
    if (!oobCode || mode !== "resetPassword") {
      setMessage("Invalid or expired reset link. Please request a new one.");
      return;
    }
    setIsValidLink(true);
  }, [oobCode, mode]);

  // Mouse tracking for gradient effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        mousePosX.set((e.clientX - rect.left) / rect.width);
        mousePosY.set((e.clientY - rect.top) / rect.height);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode!, password);
      setMessage("Password reset successful! Redirecting to login...");
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (error: unknown) {
      console.error("Reset error:", error);
      const msg = error instanceof Error ? error.message : "Invalid or expired link. Please request a new reset.";
      setMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColor =
    password.length >= 12 ? "text-emerald-400" :
    password.length >= 8  ? "text-amber-400" : "text-red-400";

  const strength =
    password.length >= 12 ? 100 :
    password.length >= 8  ? 70 :
    password.length >= 6  ? 40 : 10;

  if (!isValidLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-12 text-center max-w-md w-full shadow-2xl"
        >
          <AlertCircle className="w-24 h-24 text-red-400 mx-auto mb-6 drop-shadow-lg" />
          <h1 className="text-3xl font-bold text-white mb-4">Invalid Reset Link</h1>
          <p className="text-gray-300 mb-8 max-w-sm mx-auto">
            This password reset link is invalid or has expired. Please request a new one from login.
          </p>
          <motion.button
            onClick={() => router.push("/login")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Request New Reset
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 overflow-hidden relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400/30 to-purple-500/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              top: `${10 + i * 4}%`,
              left: `${10 + i * 5}%`,
            }}
          />
        ))}
      </div>

      <div ref={containerRef} className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* FIX: removed invalid backgroundRadialGradient prop — use style with valid background property */}
            <motion.div
              className="mx-auto w-24 h-24 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05, rotate: 5 }}
              style={{
                background: `radial-gradient(circle at ${springX.get() * 100}% ${springY.get() * 100}%, rgba(34,211,238,0.3), rgba(168,85,247,0.2) 70%)`,
              }}
            >
              <Lock className="w-12 h-12 text-cyan-400 drop-shadow-lg" />
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4 tracking-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Reset Password
            </motion.h1>
            <p className="text-gray-400 text-lg max-w-sm mx-auto">
              Enter your new secure password below.
            </p>
          </motion.div>

          {/* Form */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/20">
            <div className="space-y-6">
              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 text-lg font-medium"
                    onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Strength Bar */}
                <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full shadow-lg ${
                      password.length >= 12 ? "bg-emerald-400" :
                      password.length >= 8  ? "bg-amber-400" : "bg-red-400"
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: strength / 100 }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className={`mt-1 text-sm ${strengthColor} font-medium flex items-center gap-1`}>
                  <Zap className="w-3 h-3" />
                  {password.length >= 12 ? "Very Strong" :
                   password.length >= 8  ? "Strong" :
                   password.length >= 6  ? "Medium" : "Weak"}
                </p>
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition-all duration-300 text-lg font-medium"
                    onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                onClick={handleReset}
                disabled={isLoading || password !== confirmPassword || password.length < 8 || !isValidLink}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-bold py-5 px-6 rounded-2xl text-lg shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </motion.button>

              {/* Message */}
              <AnimatePresence mode="wait">
                {message && (
                  <motion.p
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className={`text-center text-sm p-4 rounded-2xl backdrop-blur-sm border ${
                      isSuccess
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                        : "bg-red-500/20 text-red-300 border-red-400/30"
                    }`}
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Back to Login */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-8 pt-8 border-t border-white/10"
          >
            <button
              onClick={() => router.push("/login")}
              className="text-gray-400 hover:text-white flex items-center gap-2 mx-auto text-sm font-medium transition-all duration-300 hover:scale-105"
            >
              Back to Login
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}