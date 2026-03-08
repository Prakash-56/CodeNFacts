"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Layers, Star, Calendar, ArrowRight, Loader2, Zap } from "lucide-react";

interface CourseCardProps {
  title: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice: number;
  discountLabel?: string;
  image: string;
  level: string;
  duration: string;
  rating: number;
  projects: number;
  startDate: string;
  courseId: string;
  userId: string | null | undefined;
}

const levelColors: Record<string, { bg: string; text: string; glow: string }> = {
  Beginner:     { bg: "from-emerald-500 to-teal-500",  text: "text-emerald-300", glow: "shadow-emerald-500/30" },
  Intermediate: { bg: "from-amber-500 to-orange-500",  text: "text-amber-300",   glow: "shadow-amber-500/30"  },
  Advanced:     { bg: "from-rose-500 to-pink-600",     text: "text-rose-300",    glow: "shadow-rose-500/30"   },
};

export default function CourseCard({
  title,
  slug,
  price,
  originalPrice,
  discountLabel,
  image,
  level,
  duration,
  rating,
  projects,
  startDate,
  courseId,
  userId,
}: CourseCardProps) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]),  { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });
  const glowX   = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY   = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width  - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  };

  const levelStyle = levelColors[level] ?? levelColors["Beginner"];
  const discount   = Math.round(((originalPrice - price) / originalPrice) * 100);

  const handlePayment = async () => {
    if (!userId) {
      alert("Please sign in to enroll in this course.");
      router.push("/login");
      return;
    }

    setLoading(true);

    // Step 1 — create order; keep throw out of this block
    let sessionId: string | null = null;
    try {
const res = await fetch("/api/create-order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: price,
    userId,
    courseId,
    slug
  }),
});

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data: { payment_session_id?: string; message?: string } = await res.json();
      sessionId = data.payment_session_id ?? null;

      if (!sessionId) {
        alert(data.message ?? "Payment session failed. Please try again.");
        return;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Try again.";
      console.error(err);
      alert(msg);
      return;
    } finally {
      setLoading(false);
    }

    // Step 2 — launch Cashfree (sessionId is guaranteed non-null here)
    if (!(window as any).Cashfree) {
      alert("Payment gateway is loading. Please try again in a second.");
      return;
    }

    const cashfree = new (window as any).Cashfree({
      mode: process.env.NEXT_PUBLIC_CASHFREE_ENV ?? "production",
    });
    cashfree.checkout({ paymentSessionId: sessionId, redirectTarget: "_self" });
  };

  return (
    <motion.div
      ref={cardRef}
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.92 },
        show:   { opacity: 1, y: 0,  scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col rounded-[1.75rem] overflow-hidden cursor-pointer"
    >
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-[1.75rem] p-[1px] z-0">
        <motion.div
          className="absolute inset-0 rounded-[1.75rem]"
          animate={hovered ? { opacity: 1 } : { opacity: 0.4 }}
          style={{ background: "conic-gradient(from 220deg at 50% 50%, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981, #3b82f6)" }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-[1px] rounded-[1.7rem] bg-[#080c18]" />
      </div>

      {/* Spotlight glow */}
      <motion.div
        className="absolute inset-0 rounded-[1.75rem] opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(99,102,241,0.15) 0%, transparent 60%)` }}
      />

      <div className="relative z-20 flex flex-col flex-1">
        {/* Image */}
        <div className="relative h-52 w-full overflow-hidden rounded-t-[1.65rem]">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            animate={hovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c18] via-[#080c18]/40 to-transparent" />

          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={hovered ? { x: ["-100%", "200%"] } : { x: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)" }}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`px-3 py-1 text-[10px] font-black bg-gradient-to-r ${levelStyle.bg} text-white rounded-full uppercase tracking-widest shadow-lg`}
            >
              {level}
            </motion.span>
            {discountLabel && (
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-3 py-1 text-[10px] font-black bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full uppercase tracking-widest"
              >
                {discountLabel}
              </motion.span>
            )}
          </div>

          {/* Discount pill */}
          <div className="absolute top-4 right-4">
            <motion.div
              animate={hovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-1 bg-amber-400 text-black text-[10px] font-black px-2 py-1 rounded-full"
            >
              <Zap className="w-3 h-3" />
              {discount}% OFF
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <motion.h3
            className="text-lg font-black text-white leading-snug tracking-tight"
            animate={hovered ? { color: "#93c5fd" } : { color: "#ffffff" }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h3>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { icon: <Clock    className="w-3.5 h-3.5 text-blue-400"                  />, label: duration          },
              { icon: <Layers   className="w-3.5 h-3.5 text-violet-400"               />, label: `${projects} Projects` },
              { icon: <Calendar className="w-3.5 h-3.5 text-orange-400"               />, label: startDate          },
              { icon: <Star     className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />, label: `${rating} Rating`  },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.08)" }}
                className="flex items-center gap-1.5 py-2 px-2.5 bg-white/[0.04] rounded-xl border border-white/[0.06] text-[11px] text-gray-400 font-semibold transition-colors"
              >
                {item.icon}
                {item.label}
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-end justify-between gap-3">
            <div>
              <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">Investment</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white tracking-tight">₹{price.toLocaleString()}</span>
                <span className="text-xs text-gray-600 line-through">₹{originalPrice.toLocaleString()}</span>
              </div>
              <Link
                href={`/courses/${slug}`}
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-blue-400 font-bold hover:text-blue-300 transition-colors"
              >
                Explore course
                <motion.span
                  animate={hovered ? { x: 4 } : { x: 0 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="w-3 h-3" />
                </motion.span>
              </Link>
            </div>

            <motion.button
              onClick={handlePayment}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-700" />
              <motion.div
                className="absolute inset-0"
                animate={hovered ? { x: ["-100%", "200%"] } : { x: "-100%" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)" }}
              />
              <span className="relative z-10 flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enroll Now"}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}