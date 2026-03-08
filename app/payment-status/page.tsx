"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import confetti from "canvas-confetti";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform
} from "framer-motion";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");
  const courseId = searchParams.get("courseId");

  const [status, setStatus] = useState<"checking" | "success" | "failed">("checking");

  /* 3D Mouse Tilt */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [12, -12]);
  const rotateY = useTransform(mouseX, [-100, 100], [-12, 12]);

  const springX = useSpring(rotateX, { stiffness: 120, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  /* Confetti Effect */
  const fireConfetti = () => {
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1 }
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  /* Payment Verification */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user || !orderId || !courseId) {
        console.log("Missing data:", { user, orderId, courseId });
        setStatus("failed");
        return;
      }

      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            userId: user.uid,
            courseId
          }),
        });

        const data = await res.json();

        // smoother UX to let the animation breathe
        await new Promise((r) => setTimeout(r, 1500));

        if (data.success) {
          setStatus("success");
          fireConfetti();

          // 🎯 REDIRECT TO THE SPECIFIC BATCH
          setTimeout(() => {
            router.push(`/my-batch/`);
          }, 3500);

        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Verification Error:", error);
        setStatus("failed");
      }
    });

    const timeout = setTimeout(() => {
      setStatus((prev) => prev === "checking" ? "failed" : prev);
    }, 12000); // Increased slightly for slower network verification

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [orderId, courseId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white">
      {/* holographic grid background */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* glow orbs */}
      <motion.div
        animate={{ y: [0, -80, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full top-[-150px] left-[-150px]"
      />
      <motion.div
        animate={{ y: [0, 80, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full bottom-[-200px] right-[-150px]"
      />

      {/* glass card */}
      <motion.div
        onMouseMove={handleMouseMove}
        style={{ rotateX: springX, rotateY: springY }}
        className="relative w-[440px] p-12 rounded-3xl backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8)] text-center"
      >
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
          Payment Status
        </h1>

        <AnimatePresence mode="wait">
          {status === "checking" && (
            <motion.div
              key="checking"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto"
              />
              <p className="text-yellow-400 text-lg">
                Verifying with Cashfree...
              </p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="space-y-6"
            >
              <div className="relative flex justify-center">
                <motion.div
                  className="absolute w-28 h-28 rounded-full bg-green-500/20"
                  animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  initial={{ rotate: -180 }}
                  animate={{ rotate: 0 }}
                  className="text-6xl"
                >
                  🎉
                </motion.div>
              </div>
              <p className="text-green-400 text-2xl font-semibold">
                Welcome to the Batch!
              </p>
              <p className="text-gray-300 text-sm italic">
                Taking you to your course content...
              </p>
            </motion.div>
          )}

          {status === "failed" && (
            <motion.div
              key="failed"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="space-y-6"
            >
              <motion.div
                animate={{ rotate: [0, -12, 12, -12, 0] }}
                transition={{ duration: 0.6 }}
                className="text-6xl"
              >
                ❌
              </motion.div>
              <p className="text-red-400 text-xl font-semibold">
                Payment Verification Failed
              </p>
              <p className="text-gray-400 text-xs mb-4">
                If the amount was deducted, please contact support.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/courses")}
                className="px-6 py-3 rounded-xl bg-white text-black font-bold shadow-xl"
              >
                Try Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}