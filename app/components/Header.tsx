"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import {
  Moon,
  Sun,
  Bell,
  ChevronDown,
  Menu,
  Search,
  X,
  BookOpen,
  Code2,
  FlaskConical,
  Layers,
  Cpu,
  Database,
  Globe,
  Brain,
  ChevronRight,
  CheckCheck,
  Sparkles,
  LogOut,
  User as UserIcon,
  Home,
} from "lucide-react";

const categories = [
  "Prerequisites", "DSA", "Practice Questions", "C", "Quick Start",
  "Python", "Road Map", "Java", "Artificial Intelligence (AI)", "Data Science", "Puzzles",
  "Machine Learning","Aptitude","Best Practices","Interview Questions","Projects", "Claude Code", "Git", "Resume Tips",
  "Maths","Statistics", "Probability","R", "NumPy", "Pandas","Advanced DSA", "Open AI (Chat GPT)", "Gen AI",
  "Deep Learning","Computer Vision","NLP","Data Analysis", "SQL", "Big Data Analytics","Gemini", "EDA", "OOP with Java", "API", "Cheat Sheet",
  "LinkedIn Mastery", "IoT", "Operating Systems", "DBMS", "HTML", "CSS",
  "Java Script", "Web Dev", "Content Creation (AI)","Quizzes","Must Do", "Facts",
];

const navItems = {
  Courses: {
    icon: BookOpen,
    sections: [
      { label: "Programming", icon: Code2, href: "/courses/programming", desc: "C, C++, Java, Python & more" },
      { label: "Web Development", icon: Globe, href: "/courses/web-dev", desc: "HTML, CSS, JS, React, Next.js" },
      { label: "Data Science", icon: Database, href: "/courses/data-science", desc: "NumPy, Pandas, SQL, Big Data" },
      { label: "AI & Machine Learning", icon: Brain, href: "/courses/ai-ml", desc: "ML, Deep Learning, Gen AI" },
      { label: "System Design", icon: Layers, href: "/courses/system-design", desc: "OS, DBMS, Cloud Architecture" },
    ],
  },
  Tutorials: {
    icon: Cpu,
    sections: [
      { label: "DSA", icon: Layers, href: "/tutorials/dsa", desc: "Arrays, Trees, Graphs & DP" },
      { label: "Git & DevOps", icon: Code2, href: "/tutorials/git", desc: "Version control & CI/CD basics" },
      { label: "IoT & Embedded", icon: Cpu, href: "/tutorials/iot", desc: "Arduino, Raspberry Pi & sensors" },
      { label: "Open AI & Claude", icon: Brain, href: "/tutorials/ai-tools", desc: "ChatGPT, Claude Code & prompt tips" },
      { label: "Maths for CS", icon: FlaskConical, href: "/tutorials/maths", desc: "Discrete maths, stats & linear algebra" },
    ],
  },
  Practice: {
    icon: FlaskConical,
    sections: [
      { label: "Practice Questions", icon: BookOpen, href: "/practice/questions", desc: "Topic-wise coding problems" },
      { label: "Mock Interviews", icon: Brain, href: "/practice/mock", desc: "Simulate real interview rounds" },
      { label: "OOP Challenges", icon: Code2, href: "/practice/oop", desc: "Java OOP design exercises" },
      { label: "SQL Playground", icon: Database, href: "/develop/sql-escape-room", desc: "Write & test queries live" },
      { label: "Road Map Tracker", icon: Layers, href: "/roadmaps", desc: "Follow structured learning paths" },
    ],
  },
};

type NavKey = keyof typeof navItems;

type NotificationItem = {
  id: string;
  title: string;
  desc: string;
  href: string;
  time: string;
  read: boolean;
};

// ──────────────────────────────────────────────────────────────
// MOCK DATA — only the CodeNFacts greeting notification
// ──────────────────────────────────────────────────────────────
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n0",
    title: "Greeting from CodeNFacts",
    desc: "All the coding problem, blogs, community notifications, new courses, practice problems when publish you can see the notification here.",
    href: "/",
    time: "Just now",
    read: false,
  },
];

export default function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<NavKey | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<NavKey | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Notifications state ──
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  // ── Profile dropdown state ──
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const visibleNotifications = notifications.slice(0, 10);
  const hasMoreThanTen = notifications.length > 10;

  // Use resolvedTheme so icon is correct even when theme is "system"
  const isDark = (resolvedTheme ?? theme) === "dark";

  useEffect(() => { setMounted(true); }, []);

  // Close any open dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Lock body scroll when mobile menu, notifications, or login popup is open
  useEffect(() => {
    document.body.style.overflow = (mobileOpen || showLoginPopup || notifOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, showLoginPopup, notifOpen]);

  // Close login popup / notif with Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowLoginPopup(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // If the user logs out while notifications/profile are open, close them
  useEffect(() => {
    if (!isLoggedIn) {
      setNotifOpen(false);
      setProfileOpen(false);
    }
  }, [isLoggedIn]);

  const toggleDropdown = (key: NavKey) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  const handleBellClick = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    setNotifOpen((prev) => !prev);
  };

  const markOneAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
  };

  // Explicit light/dark toggle — works reliably on mobile (no "system" middle state)
  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
  };

  const initial = user?.email ? user.email[0].toUpperCase() : "?";

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)] backdrop-blur-lg">

        {/* ── TOP BAR ── */}
        <div className="border-b border-[var(--border)]">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">

            {/* Logo */}
            <Link href="/" className="text-xl font-bold tracking-tight shrink-0">
              CodeNFacts
            </Link>

            {/* Desktop Search */}
            <div className="relative hidden md:block w-72 mx-6">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics, courses..."
                className="w-full rounded-full border border-[var(--border)] bg-transparent py-2 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Desktop Nav */}
            <nav ref={dropdownRef} className="hidden md:flex items-center gap-1 font-medium relative">
              {/* Home link */}
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition hover:bg-[var(--card)]"
              >
                Home
              </Link>

              {(Object.keys(navItems) as NavKey[]).map((key) => (
                <div key={key} className="relative">
                  <button
                    onClick={() => toggleDropdown(key)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition hover:bg-[var(--card)] ${
                      activeDropdown === key ? "bg-[var(--card)] text-emerald-600" : ""
                    }`}
                  >
                    {key}
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${activeDropdown === key ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Desktop Dropdown */}
                  {activeDropdown === key && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xl shadow-black/10 overflow-hidden">
                      <div className="p-2">
                        {navItems[key].sections.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.label}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-[var(--card)] group"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 dark:bg-emerald-950 dark:group-hover:bg-emerald-900">
                                <Icon size={16} />
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold leading-tight">{item.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{item.desc}</p>
                              </div>
                              <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-emerald-500 transition shrink-0" />
                            </Link>
                          );
                        })}
                      </div>
                      <div className="border-t border-[var(--border)] px-4 py-3">
                        <Link
                          href={`/${key.toLowerCase()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setActiveDropdown(null)}
                          className="text-xs font-semibold text-emerald-600 hover:underline"
                        >
                          Browse all {key} →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
            {/* Theme toggle — visible only on desktop */}
{mounted && (
  <button
    type="button"
    onClick={toggleTheme}
    className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] transition hover:bg-[var(--card)] active:scale-95"
    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
  >
    {isDark ? <Sun size={16} /> : <Moon size={16} />}
  </button>
)}

              {/* ── Notifications Bell ── */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={handleBellClick}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] transition hover:bg-[var(--card)] active:scale-95"
                  aria-label="Notifications"
                >
                  <Bell size={16} />
                  {isLoggedIn && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* ── Desktop notifications dropdown ── */}
                {isLoggedIn && notifOpen && (
                  <div className="hidden md:block absolute right-0 top-full mt-2 w-96 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xl shadow-black/10 overflow-hidden z-50">
                    <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                      <p className="text-sm font-semibold">Notifications</p>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
                        >
                          <CheckCheck size={13} />
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto divide-y divide-[var(--border)]">
                      {visibleNotifications.length === 0 ? (
                        <p className="px-4 py-8 text-center text-sm text-gray-400">
                          You&apos;re all caught up - no notifications yet.
                        </p>
                      ) : (
                        visibleNotifications.map((n) => (
                          <Link
                            key={n.id}
                            href={n.href}
                            onClick={() => {
                              markOneAsRead(n.id);
                              setNotifOpen(false);
                            }}
                            className={`flex gap-3 px-4 py-4 transition hover:bg-[var(--card)] ${
                              !n.read ? "bg-emerald-50/60 dark:bg-emerald-950/30" : ""
                            }`}
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                              <Sparkles size={15} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold leading-tight">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.desc}</p>
                              <p className="text-[11px] text-gray-400 mt-1.5">{n.time}</p>
                            </div>
                            {!n.read && (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                            )}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Sign In button OR Profile pill (desktop) ── */}
              {isLoggedIn ? (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((p) => !p)}
                    className="hidden md:flex items-center gap-2 rounded-full border border-[var(--border)] pl-1 pr-3 py-1 transition hover:bg-[var(--card)]"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white">
                      {initial}
                    </span>
                    <span className="text-sm font-medium max-w-[140px] truncate">
                      {user?.name || user?.email}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-xl shadow-black/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-[var(--border)]">
                        <p className="text-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[var(--card)] transition"
                      >
                        <UserIcon size={15} />
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-[var(--card)] transition"
                      >
                        <LogOut size={15} />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-lg"
                >
                  Sign In
                </Link>
              )}

              {/* ── Mobile-only avatar pill ── */}
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="flex md:hidden h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white"
                  aria-label="Open profile menu"
                >
                  {initial}
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] md:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── DESKTOP CATEGORY BAR ── */}
        <div className="hidden h-12 bg-[var(--card)] md:block">
          <div className="mx-auto flex h-full max-w-7xl items-center overflow-x-auto whitespace-nowrap px-6 scrollbar-hide">
            <div className="flex items-center gap-6 text-sm font-medium">
              {categories.map((item) => (
                <Link
                  key={item}
                  href={`/category/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 transition hover:text-emerald-600"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE NOTIFICATIONS FULL-SCREEN PANEL ── */}
      {/* Visible only on mobile when notif is open + logged in */}
      {isLoggedIn && notifOpen && (
        <div className="fixed inset-0 z-[60] md:hidden flex flex-col bg-[var(--background)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4 shrink-0">
            <p className="text-base font-semibold">Notifications</p>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs font-medium text-emerald-600"
                >
                  <CheckCheck size={14} />
                  Mark all as read
                </button>
              )}
              <button
                type="button"
                onClick={() => setNotifOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)]"
                aria-label="Close notifications"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {visibleNotifications.length === 0 ? (
              <p className="px-4 py-12 text-center text-sm text-gray-400">
                You&apos;re all caught up - no notifications yet.
              </p>
            ) : (
              visibleNotifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => {
                    markOneAsRead(n.id);
                    setNotifOpen(false);
                  }}
                  className={`flex gap-3 px-5 py-5 border-b border-[var(--border)] transition active:bg-[var(--card)] ${
                    !n.read ? "bg-emerald-50/60 dark:bg-emerald-950/30" : ""
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                    <Sparkles size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug">{n.title}</p>
                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{n.desc}</p>
                    <p className="text-xs text-gray-400 mt-2">{n.time}</p>
                  </div>
                  {!n.read && (
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-600" />
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── LOGIN REQUIRED MESSAGE ── */}
      {showLoginPopup && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setShowLoginPopup(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center"
          >
            <div className="flex justify-center mb-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                <Bell size={20} />
              </span>
            </div>
            <p className="text-sm font-semibold">Login required</p>
          </div>
        </div>
      )}

      {/* ── MOBILE FULLSCREEN DRAWER ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[85vw] max-w-sm bg-[var(--background)] shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 shrink-0">
          <span className="text-lg font-bold">CodeHub</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)]"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

          {/* Mobile profile card (logged in only) */}
          {isLoggedIn && (
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-bold text-white">
                {initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--card)] transition"
                aria-label="View profile"
              >
                <UserIcon size={14} />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-red-500 hover:bg-[var(--card)] transition"
                aria-label="Log out"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          {/* Mobile Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics, courses..."
              className="w-full rounded-full border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          {/* Home link (mobile) */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3.5 text-sm font-semibold hover:bg-[var(--card)] transition"
          >
            <Home size={16} className="text-emerald-600" />
            Home
          </Link>

          {/* Accordion Nav Sections */}
          <div className="space-y-2">
            {(Object.keys(navItems) as NavKey[]).map((key) => {
              const isOpen = mobileExpanded === key;
              return (
                <div key={key} className="rounded-xl border border-[var(--border)] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileExpanded(isOpen ? null : key)}
                    className={`flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold transition ${
                      isOpen ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950" : "hover:bg-[var(--card)]"
                    }`}
                  >
                    {key}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}>
                    <div className="border-t border-[var(--border)] divide-y divide-[var(--border)]">
                      {navItems[key].sections.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--card)] transition group"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                              <Icon size={14} />
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-medium leading-tight">{item.label}</p>
                              <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                            </div>
                            <ChevronRight size={13} className="ml-auto text-gray-300 shrink-0" />
                          </Link>
                        );
                      })}
                      <Link
                        href={`/${key.toLowerCase()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center px-4 py-3 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
                      >
                        Browse all {key} →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Extra nav links */}
          <div className="space-y-1">
            {[{ label: "Jobs", href: "/jobs" }, { label: "Road Map", href: "/roadmaps" }, { label: "Logic Build", href: "/develop" }].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium hover:bg-[var(--card)] transition border border-[var(--border)]"
              >
                {l.label}
                <ChevronRight size={14} className="text-gray-400" />
              </Link>
            ))}
          </div>

          <hr className="border-[var(--border)]" />

          {/* Categories grid */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">All Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((item) => (
                <Link
                  key={item}
                  href={`/category/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium transition hover:bg-[var(--card)] hover:border-emerald-400 leading-tight"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <hr className="border-[var(--border)]" />
        </div>

        {/* Drawer footer — Sign In sticky (logged out only) */}
        {!isLoggedIn && (
          <div className="shrink-0 border-t border-[var(--border)] px-5 py-4">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-center text-sm font-semibold text-white hover:shadow-lg transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="h-16 md:h-[112px]" />
    </>
  );
}