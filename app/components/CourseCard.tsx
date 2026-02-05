"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Layers, Star, Calendar, ArrowRight } from "lucide-react";

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
}

export default function CourseCard({
  title, slug, description, price, originalPrice, 
  discountLabel, image, level, duration, 
  rating, projects, startDate 
}: CourseCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 }
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
            <p className="text-[10px] text-gray-500 uppercase font-bold">Starting Price</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">₹{price}</span>
              <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
            </div>
            <Link href={`/courses/${slug}`} className="mt-1 flex items-center gap-1 text-xs text-blue-500 font-semibold hover:underline">
              Explore <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          {/* Coming Soon Button Block */}
          <button
            disabled
            className="flex flex-col items-center px-4 py-2.5 bg-white/5 border border-white/10 text-gray-400 rounded-2xl cursor-not-allowed transition-all"
          >
            <span className="text-[9px] uppercase tracking-widest font-bold opacity-50">Coming Soon</span>
            <span className="text-sm font-bold">Preview</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}