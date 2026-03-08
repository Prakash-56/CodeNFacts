"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Info,
  HelpCircle,
  UserCircle,
  LogOut,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

/* ─── tiny hook: track mouse for orb ─── */
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();

  const pathname = usePathname();
  const router = useRouter();

  const { scrollY } = useScroll();
  const headerBlur = useTransform(scrollY, [0, 80], [8, 20]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut(auth);
    setMobileOpen(false);
    router.push("/");
  };

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "About", href: "/about", icon: Info },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
  ];

  const isActive = (path: string) => pathname === path;

  /* ─── orb position relative to header ─── */
  const orbX = headerRef.current
    ? mouse.x - headerRef.current.getBoundingClientRect().left
    : mouse.x;

  return (
    <>
      {/* ═══════════════ DESKTOP ═══════════════ */}
      <motion.header
        ref={headerRef}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.1 }}
        className={`
          fixed top-4 left-1/2 z-50 hidden md:block
          -translate-x-1/2 w-[min(92vw,1180px)]
          transition-all duration-500
          ${scrolled ? "top-2 scale-[0.975]" : "top-4 scale-100"}
        `}
      >
        {/* Outer glow ring */}
        <div
          className={`
            absolute -inset-px rounded-2xl transition-opacity duration-700
            bg-gradient-to-r from-violet-500/40 via-cyan-500/30 to-fuchsia-500/40
            blur-sm
            ${scrolled ? "opacity-70" : "opacity-40"}
          `}
        />

        {/* Glass card */}
        <div
          className="
            relative rounded-2xl overflow-hidden
            border border-white/[0.08]
            bg-[#050508]/80
            shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]
          "
          style={{ backdropFilter: `blur(${scrolled ? 24 : 14}px)` }}
        >
          {/* Interactive mouse-follow orb */}
          <div
            className="pointer-events-none absolute -top-24 h-48 w-48 rounded-full opacity-20 transition-transform duration-75"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.8) 0%, transparent 70%)",
              transform: `translate(${orbX - 96}px, 0)`,
            }}
          />

          {/* Animated top border shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-violet-400/80 to-transparent"
            />
          </div>

          <div className="relative flex items-center justify-between px-6 py-3">
            {/* ─── Logo ─── */}
            <Link href="/" className="group flex items-center gap-2.5">
              <span
                className="
                  text-[1.15rem] font-black tracking-tight
                  bg-gradient-to-r from-white via-violet-200 to-cyan-300
                  bg-clip-text text-transparent
                  transition-all duration-500
                  group-hover:from-violet-300 group-hover:via-cyan-200 group-hover:to-fuchsia-300
                "
              >
                CodeNFacts
              </span>
            </Link>

            {/* ─── Nav ─── */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onMouseEnter={() => setHoveredNav(item.name)}
                    onMouseLeave={() => setHoveredNav(null)}
                    className={`
                      relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[0.82rem] font-semibold
                      transition-colors duration-200 outline-none
                      ${active ? "text-white" : "text-gray-400 hover:text-gray-100"}
                    `}
                  >
                    {/* Hover bg */}
                    <AnimatePresence>
                      {hoveredNav === item.name && !active && (
                        <motion.span
                          layoutId="navHover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 rounded-xl bg-white/[0.06]"
                        />
                      )}
                    </AnimatePresence>

                    {/* Active bg */}
                    {active && (
                      <motion.span
                        layoutId="activeNavBg"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/25 to-cyan-600/25 border border-white/[0.08] shadow-inner shadow-violet-500/10"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}

                    <Icon
                      size={15}
                      strokeWidth={active ? 2.3 : 1.7}
                      className={`relative z-10 transition-colors ${active ? "text-violet-300" : ""}`}
                    />
                    <span className="relative z-10">{item.name}</span>

                    {/* Active dot */}
                    {active && (
                      <motion.span
                        layoutId="activeDot"
                        className="relative z-10 ml-0.5 h-1 w-1 rounded-full bg-violet-400"
                      />
                    )}
                  </Link>
                );
              })}

              {/* ─── Auth ─── */}
              <div className="ml-3 flex items-center gap-2 border-l border-white/[0.08] pl-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="
                        group relative flex items-center gap-2 rounded-xl
                        bg-gradient-to-r from-violet-600 to-cyan-600
                        px-4 py-2.5 text-[0.82rem] font-bold text-white
                        shadow-lg shadow-violet-900/40
                        overflow-hidden
                        transition-all duration-300 hover:shadow-violet-600/50 hover:scale-[1.03]
                      "
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <UserCircle size={15} className="relative z-10" />
                      <span className="relative z-10">Dashboard</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      title="Sign out"
                      className="
                        flex h-9 w-9 items-center justify-center rounded-xl
                        text-gray-500 transition-all duration-200
                        hover:bg-rose-500/15 hover:text-rose-400 hover:scale-105
                      "
                    >
                      <LogOut size={15} />
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="
                      group relative flex items-center gap-2 overflow-hidden
                      rounded-xl px-5 py-2.5 text-[0.82rem] font-bold text-white
                      bg-gradient-to-r from-emerald-500 to-cyan-500
                      shadow-lg shadow-emerald-900/40
                      transition-all duration-300 hover:scale-[1.04] hover:shadow-emerald-600/50
                    "
                  >
                    <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-[100%]" />
                    <span className="relative z-10">Get Started</span>
                    <ChevronRight size={14} className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* ═══════════════ MOBILE ═══════════════ */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50">
        {/* Top bar */}
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`
            flex items-center justify-between px-5 py-3.5
            bg-[#050508]/90 backdrop-blur-2xl
            border-b transition-all duration-500
            ${scrolled
              ? "border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
              : "border-transparent"}
          `}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-[1rem] font-black tracking-tight bg-gradient-to-r from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent">
              CodeNFacts
            </span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="relative h-9 w-9 flex items-center justify-center rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.07] transition-all"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>

        {/* Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#07070d]/97 backdrop-blur-3xl border-b border-white/[0.07] shadow-2xl shadow-black/70"
            >
              {/* Gradient accent top */}
              <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

              <div className="px-5 pt-5 pb-8 flex flex-col gap-2">
                {navItems.map((item, i) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.06 + 0.05, duration: 0.4, ease: "easeOut" }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`
                          flex items-center gap-4 px-5 py-4 rounded-2xl text-[0.97rem] font-semibold
                          transition-all duration-200
                          ${active
                            ? "bg-gradient-to-r from-violet-600/30 to-cyan-600/20 text-white border border-white/[0.08]"
                            : "text-gray-400 hover:text-white hover:bg-white/[0.05]"}
                        `}
                      >
                        <span className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${active ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-gray-500"}`}>
                          <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
                        </span>
                        {item.name}
                        {active && (
                          <ChevronRight size={15} className="ml-auto text-violet-400/70" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Auth section */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.06 + 0.1, duration: 0.4 }}
                  className="mt-4 pt-5 border-t border-white/[0.07] flex flex-col gap-3"
                >
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="
                          relative flex items-center justify-center gap-3 py-4 rounded-2xl overflow-hidden
                          bg-gradient-to-r from-violet-600 to-cyan-600
                          text-white font-bold shadow-lg shadow-violet-900/50
                          hover:scale-[1.02] transition-transform
                        "
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                        <UserCircle size={18} className="relative z-10" />
                        <span className="relative z-10">Go to Dashboard</span>
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                      >
                        <LogOut size={17} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="
                        group relative flex items-center justify-center gap-2.5 py-4 rounded-2xl overflow-hidden
                        bg-gradient-to-r from-emerald-500 to-cyan-500
                        text-white font-bold shadow-lg shadow-emerald-900/40
                        hover:scale-[1.02] transition-transform
                      "
                    >
                      <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
                      <span className="relative z-10">Sign In / Get Started</span>
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spacer */}
      <div className="h-20 md:h-24" />
    </>
  );
}