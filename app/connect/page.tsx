"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Code2,
  MessageSquare,
  Users,
  Trophy,
  BookOpenCheck,
  Flame,
  Heart,
  MessageCircle,
  Repeat2,
  Star,
  Lock,
  CheckCircle2,
  Loader2,
  Sparkles,
  BellRing,
  ArrowRight,
  User,
  Brain,
  X,
} from "lucide-react";

// Uncomment once wired to your Firebase project:
// import { db } from "@/lib/firebase";
// import { doc, setDoc } from "firebase/firestore";
// import { useAuth } from "@/context/auth-context";

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

const FEATURES = [
  {
    icon: Code2,
    color: "emerald",
    title: "Developer Feed",
    description:
      "Share your coding journey, projects, achievements, and daily progress.",
  },
  {
    icon: MessageSquare,
    color: "blue",
    title: "Discussions",
    description:
      "Ask coding questions and receive answers from the community.",
  },
  {
    icon: Users,
    color: "violet",
    title: "Learning Groups",
    description: "Join language-specific and technology-specific groups.",
    tags: ["C", "C++", "Java", "Python", "Web Dev", "AI", "DSA"],
  },
  {
    icon: Trophy,
    color: "amber",
    title: "Showcase Projects",
    description:
      "Publish your portfolio projects and receive constructive feedback.",
  },
  {
    icon: BookOpenCheck,
    color: "cyan",
    title: "Study Partners",
    description: "Find learners who are studying the same course as you.",
  },
  {
    icon: Flame,
    color: "rose",
    title: "Coding Challenges",
    description: "Participate in weekly challenges and compete on leaderboards.",
  },
];

const ICON_STYLES: Record<string, string> = {
  emerald:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-400/10",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-400/10",
  violet:
    "bg-violet-500/10 text-violet-600 dark:text-violet-400 dark:bg-violet-400/10",
  amber:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-400/10",
  cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 dark:bg-cyan-400/10",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 dark:bg-rose-400/10",
  pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400 dark:bg-pink-400/10",
};

const TIMELINE_DONE = [
  "Learning Platform",
  "Courses",
  "Roadmaps",
  "Authentication",
];

const TIMELINE_IN_PROGRESS = ["Community", "Posts", "Messaging", "Study Groups"];

// Network nodes: percentage-based coordinates so the same numbers drive
// both the SVG wires and the absolutely-positioned avatar dots.
// One "you" node in the center, 8 learners arranged around it — 9 people total.
const SATELLITE_COLORS = [
  "blue",
  "violet",
  "amber",
  "cyan",
  "rose",
  "pink",
  "indigo",
  "teal",
] as const;

const SATELLITE_COUNT = 8;
const RING_RADIUS_X = 38;
const RING_RADIUS_Y = 34;

type NetworkNode = {
  id: string;
  x: number;
  y: number;
  size: "lg" | "sm";
  color: string;
  delay: number;
};

function buildNetworkNodes(): NetworkNode[] {
  const nodes: NetworkNode[] = [
    { id: "you", x: 50, y: 50, size: "lg", color: "emerald", delay: 0 },
  ];
  for (let i = 0; i < SATELLITE_COUNT; i++) {
    const angle = (i / SATELLITE_COUNT) * Math.PI * 2 - Math.PI / 2;
    nodes.push({
      id: `p${i}`,
      x: Math.round((50 + RING_RADIUS_X * Math.cos(angle)) * 10) / 10,
      y: Math.round((50 + RING_RADIUS_Y * Math.sin(angle)) * 10) / 10,
      size: "sm",
      color: SATELLITE_COLORS[i % SATELLITE_COLORS.length],
      delay: 0.12 * (i + 1),
    });
  }
  return nodes;
}

const NETWORK_NODES = buildNetworkNodes();

// Spokes (you -> each learner) plus ring links (neighbor -> neighbor),
// each with a bend direction/strength so the wires curve instead of running straight.
function buildNetworkLinks() {
  const links: { from: string; to: string; bend: number }[] = [];
  for (let i = 0; i < SATELLITE_COUNT; i++) {
    links.push({ from: "you", to: `p${i}`, bend: i % 2 === 0 ? 5 : -5 });
  }
  for (let i = 0; i < SATELLITE_COUNT; i++) {
    const next = (i + 1) % SATELLITE_COUNT;
    links.push({ from: `p${i}`, to: `p${next}`, bend: 8 });
  }
  return links;
}

const NETWORK_LINKS = buildNetworkLinks();

function curvedPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bend: number
) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  // Perpendicular offset from the midpoint gives the wire its curve.
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * bend;
  const cy = my + ny * bend;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

const NODE_RING: Record<string, string> = {
  emerald: "border-emerald-500 text-emerald-600 dark:text-emerald-400",
  blue: "border-blue-500 text-blue-600 dark:text-blue-400",
  violet: "border-violet-500 text-violet-600 dark:text-violet-400",
  amber: "border-amber-500 text-amber-600 dark:text-amber-400",
  cyan: "border-cyan-500 text-cyan-600 dark:text-cyan-400",
  rose: "border-rose-500 text-rose-600 dark:text-rose-400",
  pink: "border-pink-500 text-pink-600 dark:text-pink-400",
  indigo: "border-indigo-500 text-indigo-600 dark:text-indigo-400",
  teal: "border-teal-500 text-teal-600 dark:text-teal-400",
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ConnectPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white dark:bg-[#0a0e14]">
      {/* Ambient top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(16,185,129,0.10), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Hero />
        <Features />
        <SneakPeek />
        <ReleaseTimeline />
        <WhyCommunity />
        <SharpenSkillsCTA />
        <NotifyMe />
        <ContinueCTA />
        <FooterCard />
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 dark:border-emerald-400/20"
      >
        <Rocket className="h-4 w-4" />
        Learn Together. Grow Faster.
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        The CodeNFacts Community
        <br className="hidden sm:block" /> is almost here.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-gray-600 dark:text-gray-400"
      >
        Connect with learners, share your coding journey, ask questions, post
        projects, and learn from developers around the world.
      </motion.p>

      {/* Illustration: a small network of connected learners */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative mx-auto mt-14 h-72 sm:h-80 max-w-lg"
      >
        <div className="absolute inset-0 mx-auto h-40 w-40 sm:h-48 sm:w-48 rounded-full bg-emerald-500/10 blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* Wires — curved so the network reads as organic, not a grid */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {NETWORK_LINKS.map(({ from: fromId, to: toId, bend }, i) => {
            const from = NETWORK_NODES.find((n) => n.id === fromId)!;
            const to = NETWORK_NODES.find((n) => n.id === toId)!;
            return (
              <motion.path
                key={`${fromId}-${toId}`}
                d={curvedPath(from.x, from.y, to.x, to.y, bend)}
                fill="none"
                className="stroke-emerald-500/40 dark:stroke-emerald-400/30"
                strokeWidth={0.5}
                strokeDasharray="2 2"
                vectorEffect="non-scaling-stroke"
                initial={{ strokeDashoffset: 0, opacity: 0 }}
                animate={{ strokeDashoffset: -20, opacity: 1 }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.4 + i * 0.04 },
                  strokeDashoffset: {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {NETWORK_NODES.map((n) => (
          <motion.div
            key={n.id}
            className={`absolute flex items-center justify-center rounded-full border-2 bg-white dark:bg-[#0d1117] shadow-xl ${
              n.size === "lg" ? "h-16 w-16 sm:h-18 sm:w-18" : "h-9 w-9 sm:h-10 sm:w-10"
            } ${NODE_RING[n.color]}`}
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: n.delay,
            }}
          >
            <User className={n.size === "lg" ? "h-7 w-7" : "h-4 w-4"} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Feature cards                                                              */
/* -------------------------------------------------------------------------- */

function Features() {
  return (
    <section className="py-14 sm:py-20">
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        What You&apos;ll Be Able To Do
      </h2>
      <p className="mx-auto mt-2 max-w-md text-center text-gray-600 dark:text-gray-400">
        A space built around learning in public.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d1117] p-6 shadow-xl shadow-gray-100/50 dark:shadow-none"
          >
            <div
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${ICON_STYLES[f.color]}`}
            >
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
              {f.title}
            </h3>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
              {f.description}
            </p>
            {f.tags && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {f.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 dark:bg-white/5 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sneak peek                                                                 */
/* -------------------------------------------------------------------------- */

function SneakPeek() {
  return (
    <section className="py-14 sm:py-20">
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        Sneak Peek
      </h2>
      <p className="mx-auto mt-2 max-w-md text-center text-gray-600 dark:text-gray-400">
        A blurred look at what&apos;s coming to your feed.
      </p>

      <div className="relative mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
        {/* Feed post mock */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d1117] p-5 shadow-xl">
          <div className="blur-[3px] select-none pointer-events-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Prakash
                </span>
              </div>
              <span className="text-xs text-gray-400">2h ago</span>
            </div>
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
              Today I solved 5 DSA problems 🎉
            </p>
            <div className="mt-4 flex items-center gap-5 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" /> 128
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" /> 34
              </span>
              <span className="flex items-center gap-1">
                <Repeat2 className="h-3.5 w-3.5" /> Share
              </span>
            </div>
          </div>
          <PreviewOverlay />
        </div>

        {/* Project showcase mock */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d1117] p-5 shadow-xl">
          <div className="blur-[3px] select-none pointer-events-none">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
              <Code2 className="h-4 w-4 text-emerald-500" />
              Project Showcase
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
              AI Resume Analyzer
            </p>
            <div className="mt-2 flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
          </div>
          <PreviewOverlay />
        </div>
      </div>
    </section>
  );
}

function PreviewOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-black/30">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d1117] px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 shadow-md">
        <Lock className="h-3 w-3" />
        Preview
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Release timeline                                                          */
/* -------------------------------------------------------------------------- */

function ReleaseTimeline() {
  return (
    <section className="py-14 sm:py-20">
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        Release Timeline
      </h2>

      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d1117] p-6 shadow-xl">
        <ul className="space-y-3">
          {TIMELINE_DONE.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <span className="text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>

        <div className="my-4 h-px bg-gray-200 dark:bg-white/10" />

        <ul className="space-y-3">
          {TIMELINE_IN_PROGRESS.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm">
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Why community                                                             */
/* -------------------------------------------------------------------------- */

function WhyCommunity() {
  return (
    <section className="py-14 sm:py-20 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        Why We&apos;re Building It
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
        Learning programming becomes easier when you&apos;re surrounded by
        people solving the same problems. CodeNFacts Community is designed to
        help learners collaborate, motivate each other, and grow together.
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sharpen your skills CTA (bridge while Connect is in progress)             */
/* -------------------------------------------------------------------------- */

function SharpenSkillsCTA() {
  return (
    <section className="pb-14 sm:pb-20">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 dark:border-white/10 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-400/5 dark:to-[#0d1117] p-8 text-center shadow-xl">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Brain className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          Till then, sharpen your brain and skills
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
          Try our new practice feature while the Community finishes brewing -
          bite-sized challenges to keep you sharp every day.
        </p>
        <Link
          href="/develop"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          Try the New Feature
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Notify me                                                                  */
/* -------------------------------------------------------------------------- */

function NotifyMe() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [showPopup, setShowPopup] = useState(false);

  // Swap this out for your real auth + Firestore call:
  // const { user } = useAuth();
  const user: { uid: string } | null = null;

  async function handleNotify() {
    // If you want to require sign-in later, uncomment this block:
    // if (!user) {
    //   window.location.href = "/signup";
    //   return;
    // }

    setStatus("loading");
    try {
      // await setDoc(
      //   doc(db, "users", user.uid),
      //   { communityNotify: true },
      //   { merge: true }
      // );

      // Simulate a short delay for the loading state
      await new Promise((r) => setTimeout(r, 600));
      setStatus("done");
      setShowPopup(true);
    } catch {
      setStatus("error");
    }
  }

  function closePopup() {
    setShowPopup(false);
  }

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-emerald-500/20 dark:border-emerald-400/20 bg-white dark:bg-[#0d1117] p-8 text-center shadow-xl">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <BellRing className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          Want to be the first to use CodeNFacts Community?
        </h3>

        <button
          onClick={handleNotify}
          disabled={status === "loading" || status === "done"}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          {status === "done" ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> You&apos;re on the list
            </>
          ) : (
            "Notify Me"
          )}
        </button>

        {status === "error" && (
          <p className="mt-3 text-xs text-rose-500">
            Something went wrong. Please try again.
          </p>
        )}
      </div>

      {/* Popup toast */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={closePopup}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="relative w-full max-w-sm rounded-2xl border border-emerald-500/20 bg-white dark:bg-[#0d1117] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closePopup}
                className="absolute right-3 top-3 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-gray-200"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <h4 className="mt-4 text-center text-base font-semibold text-gray-900 dark:text-white">
                You&apos;re on the list!
              </h4>
              <p className="mt-2 text-center text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                We will notify you when our community is ready.
                <br />
                Till then - Keep Coding, Keep Creating ..❤️..
              </p>

              <button
                onClick={closePopup}
                className="mt-5 w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Continue learning CTA                                                      */
/* -------------------------------------------------------------------------- */

function ContinueCTA() {
  const links = [
    { label: "Continue Learning", href: "/" },
    { label: "Explore Courses", href: "/courses" },
    { label: "View Roadmaps", href: "/roadmaps" },
  ];

  return (
    <section className="pb-14 sm:pb-20">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              i === 0
                ? "inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                : "inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d1117] px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 transition hover:border-emerald-500/40"
            }
          >
            {l.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer card                                                                */
/* -------------------------------------------------------------------------- */

function FooterCard() {
  return (
    <section className="pb-20">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d1117] p-6 text-center shadow-xl">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
          <Sparkles className="h-3.5 w-3.5" />
          Currently Under Development
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Expected Release
        </p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          Version 2.0
        </p>
      </div>
    </section>
  );
}