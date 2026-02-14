"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Layers, Star, Calendar, ArrowRight, Lock } from "lucide-react";

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
  userId: string;
}

export default function CourseCard({
  title,
  slug,
  description,
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
  
  // Placeholder for incomplete payment setup
  const isPaymentReady = false; 

  const handlePayment = async () => {
    if (!isPaymentReady) {
      alert("Enrollment is opening soon! We are currently finalizing our payment gateway.");
      return;
    }

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          userId,
          courseId,
        }),
      });

      const data = await res.json();

      if (!data.payment_session_id) {
        alert("Payment session failed");
        return;
      }

      const cashfree = new (window as any).Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV || "sandbox",
      });

      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative flex flex-col bg-slate-900/50 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md shadow-2xl"
    >
      {/* Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-800">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 text-[10px] font-bold bg-blue-600 text-white rounded-full uppercase tracking-tighter">
            {level}
          </span>
          {discountLabel && (
            <span className="px-3 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-full uppercase tracking-tighter">
              {discountLabel}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
          {title}
        </h3>

        {/* Meta Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-gray-400 font-medium">
          <div className="flex items-center gap-1.5 py-1.5 px-2 bg-white/5 rounded-lg border border-white/5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            {duration}
          </div>
          <div className="flex items-center gap-1.5 py-1.5 px-2 bg-white/5 rounded-lg border border-white/5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            {projects} Projects
          </div>
          <div className="flex items-center gap-1.5 py-1.5 px-2 bg-white/5 rounded-lg border border-white/5">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            {startDate}
          </div>
          <div className="flex items-center gap-1.5 py-1.5 px-2 bg-white/5 rounded-lg border border-white/5">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
            {rating} Rating
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold">
              Starting Price
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                ₹{price}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₹{originalPrice}
              </span>
            </div>
            <Link
              href={`/courses/${slug}`}
              className="mt-1 flex items-center gap-1 text-xs text-blue-500 font-semibold hover:underline"
            >
              Explore <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Enroll Button with State Handling */}
          <button
            onClick={handlePayment}
            className={`px-6 py-3 text-white text-sm font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 
              ${isPaymentReady 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 active:scale-95" 
                : "bg-gray-700 cursor-not-allowed opacity-80"
              }`}
          >
            {!isPaymentReady && <Lock className="w-3.5 h-3.5" />}
            {isPaymentReady ? "Enroll Now" : "Coming Soon"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}