"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Rocket,
  Home,
  BookOpen,
  Info,
  HelpCircle,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  /* ---------------- Scroll Effect ---------------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- Firebase Auth Session ---------------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  /* ---------------- Handlers ---------------- */
  const handleAuthClick = () => {
    setOpen(false);
    router.push("/login");
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setOpen(false);
    router.push("/");
  };

  /* ---------------- Navigation ---------------- */
  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Courses", href: "/courses", icon: <BookOpen size={18} /> },
    { name: "About", href: "/about", icon: <Info size={18} /> },
    { name: "FAQ", href: "/faq", icon: <HelpCircle size={18} /> },
  ];

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}
      <header
        className={`fixed left-1/2 top-6 z-50 hidden -translate-x-1/2 transition-all duration-500 md:flex ${
          scrolled ? "w-[90%] max-w-4xl" : "w-[95%] max-w-7xl"
        }`}
      >
        <div className="flex w-full items-center justify-between rounded-full border border-white/10 bg-black/60 px-8 py-3 shadow-2xl backdrop-blur-2xl">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 text-xl font-bold tracking-tighter"
          >
            <span className="rounded-lg bg-white p-1 text-black transition-transform group-hover:rotate-12"></span>
            <span>CodeNFacts</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-8 text-sm font-medium text-gray-300">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.name}
              </Link>
            ))}

            {!user ? (
              <button
                onClick={handleAuthClick}
                className="group relative overflow-hidden rounded-full bg-white px-6 py-2 text-sm font-bold text-black"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-400 to-purple-500 transition-transform duration-300 group-hover:translate-x-0" />
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="rounded-full bg-white/10 px-5 py-2 text-sm text-white transition hover:bg-white/20"
                >
                  My Courses
                </Link>
                <button
                  onClick={handleSignOut}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm text-gray-300 transition hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden">
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="fixed bottom-8 right-8 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg"
        >
          {open ? <X /> : <Menu />}
        </button>

        {/* Fullscreen Menu */}
        <div
          className={`fixed inset-0 z-50 flex transform flex-col bg-black transition-transform duration-500 ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex h-full flex-col justify-center px-10">
            <p className="mb-8 text-xs font-bold uppercase tracking-widest text-gray-500">
              CodeNFacts
            </p>

            <nav className="flex flex-col gap-8 text-4xl font-bold">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4"
                >
                  <span className="text-blue-500">{link.icon}</span>
                  {link.name}
                </Link>
              ))}

              {!user ? (
                <button
                  onClick={handleAuthClick}
                  className="mt-4 flex items-center gap-4 text-left text-blue-400"
                >
                  <Rocket /> Sign Up Now
                </button>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-blue-400"
                  >
                    My Courses
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-left text-red-400"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Branding */}
        <div className="fixed left-0 top-0 z-40 p-6">
          <Link href="/" className="text-lg font-bold">
            CodeNFacts
          </Link>
        </div>
      </div>
    </>
  );
}
