'use client'

import { useEffect, useState, useRef } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc,getDocs,collection,query,where } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'

/* ─────────────────────────────────────────────────────────────────────────────
   PALETTE — deep obsidian + electric neon accents, NOT purple-on-white
───────────────────────────────────────────────────────────────────────────── */
const CARD_THEMES = [
  { bg: '#0a0a0a', glow: '#00ffe7', accent: '#00ffe7', label: 'CYAN',    foil: 'linear-gradient(125deg,#00ffe720,#00ffe700 60%,#00ffe715)' },
  { bg: '#0a0a0a', glow: '#ff3c5f', accent: '#ff3c5f', label: 'CRIMSON', foil: 'linear-gradient(125deg,#ff3c5f20,#ff3c5f00 60%,#ff3c5f15)' },
  { bg: '#0a0a0a', glow: '#f7c948', accent: '#f7c948', label: 'GOLD',    foil: 'linear-gradient(125deg,#f7c94820,#f7c94800 60%,#f7c94815)' },
  { bg: '#0a0a0a', glow: '#b084f7', accent: '#b084f7', label: 'VIOLET',  foil: 'linear-gradient(125deg,#b084f720,#b084f700 60%,#b084f715)' },
  { bg: '#0a0a0a', glow: '#3cf7a8', accent: '#3cf7a8', label: 'MINT',    foil: 'linear-gradient(125deg,#3cf7a820,#3cf7a800 60%,#3cf7a815)' },
  { bg: '#0a0a0a', glow: '#ff9140', accent: '#ff9140', label: 'AMBER',   foil: 'linear-gradient(125deg,#ff914020,#ff914000 60%,#ff914015)' },
]

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATED BACKGROUND — noise mesh + slow geometric lines
───────────────────────────────────────────────────────────────────────────── */
function Scene() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Pure deep black base */}
      <div className="absolute inset-0" style={{ background: '#060608' }} />

      {/* Slow diagonal light leak */}
      <motion.div
        className="absolute"
        style={{
          width: '140%', height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,231,0.06) 30%, rgba(247,201,72,0.08) 60%, transparent 100%)',
          top: '38%', left: '-20%',
          transformOrigin: 'left center',
          rotate: '-18deg',
        }}
        animate={{ x: ['-10%', '10%', '-10%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute"
        style={{
          width: '140%', height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,60,95,0.05) 40%, transparent 100%)',
          top: '62%', left: '-20%',
          rotate: '12deg',
        }}
        animate={{ x: ['5%', '-8%', '5%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Very subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)' }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   HOLOGRAPHIC COURSE CARD
───────────────────────────────────────────────────────────────────────────── */
function HoloCard({ course, index, onClick }: { course: string; index: number; onClick: () => void }) {
  const theme = CARD_THEMES[index % CARD_THEMES.length]
  const cardRef = useRef<HTMLDivElement>(null)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const srX = useSpring(rotateX, { stiffness: 220, damping: 22 })
  const srY = useSpring(rotateY, { stiffness: 220, damping: 22 })

  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const sgX = useSpring(glareX, { stiffness: 120, damping: 18 })
  const sgY = useSpring(glareY, { stiffness: 120, damping: 18 })

  const glareGradient = useTransform(
    [sgX, sgY] as any,
    ([x, y]: number[]) =>
      `radial-gradient(ellipse 60% 55% at ${x}% ${y}%, ${theme.glow}28 0%, transparent 65%)`
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const px = (e.clientX - left) / width
    const py = (e.clientY - top) / height
    rotateY.set((px - 0.5) * 22)
    rotateX.set((0.5 - py) * 16)
    glareX.set(px * 100)
    glareY.set(py * 100)
  }
  const handleMouseLeave = () => {
    rotateX.set(0); rotateY.set(0); glareX.set(50); glareY.set(50)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX: srX, rotateY: srY,
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
          position: 'relative',
          borderRadius: '1.25rem',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="group"
      >
        {/* Outer glow halo */}
        <motion.div
          className="absolute inset-0 rounded-[1.25rem] pointer-events-none"
          style={{ boxShadow: `0 0 0 1px ${theme.glow}22, 0 0 40px -8px ${theme.glow}00` }}
          whileHover={{ boxShadow: `0 0 0 1px ${theme.glow}55, 0 0 55px -4px ${theme.glow}44` }}
          transition={{ duration: 0.4 }}
        />

        {/* Card body */}
        <div
          style={{
            background: `linear-gradient(155deg, #111114 0%, #0c0c0f 60%, #0a0a0d 100%)`,
            border: `1px solid ${theme.glow}22`,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            padding: '2px',
            position: 'relative',
          }}
        >
          {/* Animated border gradient */}
          <motion.div
            style={{
              position: 'absolute', inset: 0, borderRadius: '1.25rem',
              background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${theme.glow}66 90deg, transparent 180deg, ${theme.glow}33 270deg, transparent 360deg)`,
              opacity: 0,
            }}
            whileHover={{ opacity: 1, rotate: 360 }}
            transition={{ opacity: { duration: 0.3 }, rotate: { duration: 3, ease: 'linear', repeat: Infinity } }}
          />

          <div
            style={{
              background: 'linear-gradient(155deg, #111114 0%, #0c0c0f 100%)',
              borderRadius: 'calc(1.25rem - 2px)',
              padding: '1.75rem 1.75rem 1.6rem',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 230,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}
          >
            {/* Foil/glare layer */}
            <motion.div
              style={{
                position: 'absolute', inset: 0, background: glareGradient,
                pointerEvents: 'none', zIndex: 1, mixBlendMode: 'screen',
              }}
            />

            {/* Diagonal stripe texture */}
            <div
              style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.025,
                backgroundImage: `repeating-linear-gradient(
                  -55deg,
                  ${theme.glow} 0px, ${theme.glow} 1px,
                  transparent 1px, transparent 28px
                )`,
              }}
            />

            {/* Corner serial number */}
            <span
              style={{
                position: 'absolute', bottom: '1.4rem', right: '1.6rem',
                fontFamily: "'DM Mono', 'Courier New', monospace",
                fontSize: '0.58rem', letterSpacing: '0.2em',
                color: `${theme.glow}40`, userSelect: 'none',
                textTransform: 'uppercase',
              }}
            >
              SN·{String(index + 1).padStart(4, '0')}
            </span>

            {/* Top content */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* Tag */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.4rem' }}>
                <div
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                    padding: '0.28rem 0.75rem',
                    borderRadius: 999,
                    border: `1px solid ${theme.glow}35`,
                    background: `${theme.glow}0d`,
                  }}
                >
                  <motion.span
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.4 }}
                    style={{ width: 5, height: 5, borderRadius: '50%', background: theme.glow, display: 'inline-block', boxShadow: `0 0 6px ${theme.glow}` }}
                  />
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.6rem', letterSpacing: '0.22em',
                      color: theme.glow, textTransform: 'uppercase',
                    }}
                  >
                    Active
                  </span>
                </div>

                {/* Floating neon index */}
                <span
                  style={{
                    fontFamily: "'Clash Display', 'Playfair Display', Georgia, serif",
                    fontSize: '1rem', fontWeight: 700,
                    color: `${theme.glow}55`,
                    letterSpacing: '0.04em',
                  }}
                >
                  #{String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Course name */}
              <h2
                style={{
                  fontFamily: "'Clash Display', 'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.2,
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                }}
              >
                {course}
              </h2>

              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.04em',
                }}
              >
                Continue your journey
              </p>
            </div>

            {/* Bottom content */}
            <div style={{ position: 'relative', zIndex: 2, marginTop: '1.5rem' }}>
              {/* Progress bar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div
                  style={{
                    height: 2, background: 'rgba(255,255,255,0.07)',
                    borderRadius: 99, overflow: 'hidden',
                  }}
                >
                  <motion.div
                    style={{ height: '100%', background: `linear-gradient(90deg, ${theme.glow}, ${theme.glow}50)`, borderRadius: 99 }}
                    initial={{ width: 0 }}
                    animate={{ width: `${25 + (index * 21) % 58}%` }}
                    transition={{ duration: 1.6, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.65rem', letterSpacing: '0.2em',
                    color: theme.glow, textTransform: 'uppercase',
                  }}
                >
                  Resume →
                </span>

                {/* Neon play button */}
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.88 }}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    border: `1px solid ${theme.glow}50`,
                    background: `${theme.glow}0f`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 18px ${theme.glow}20`,
                  }}
                >
                  <svg width="11" height="13" viewBox="0 0 11 13" fill={theme.glow}>
                    <path d="M0 0l11 6.5L0 13V0z"/>
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   LOADER
───────────────────────────────────────────────────────────────────────────── */
function Loader() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#060608', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem' }}>
      <motion.div
        style={{ width: 1, height: 60, background: 'linear-gradient(180deg, transparent, #00ffe7, transparent)', borderRadius: 1 }}
        animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.35em', color: 'rgba(0,255,231,0.5)', textTransform: 'uppercase' }}>
        Loading
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MARQUEE TICKER
───────────────────────────────────────────────────────────────────────────── */
function Ticker({ count }: { count: number }) {
  const items = Array(8).fill(null).map((_, i) => (
    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.2rem', paddingRight: '3rem' }}>
      <span style={{ color: '#00ffe740' }}>◆</span>
      <span>{count} Course{count !== 1 ? 's' : ''} Active</span>
      <span style={{ color: '#ff3c5f40' }}>◆</span>
      <span>Keep Building</span>
    </span>
  ))

  return (
    <div
      style={{
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '0.7rem 0',
        marginBottom: '4.5rem',
        fontFamily: "'DM Mono', monospace",
        fontSize: '0.62rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.2)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <motion.div
        style={{ display: 'flex', whiteSpace: 'nowrap' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {items}{items}
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function MyBatch() {
  const [courses, setCourses]     = useState<string[]>([])
  const [userName, setUserName]   = useState<string>('')
  const [loading, setLoading]     = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        let allCourses: string[] = []

        // 1️⃣ Get old purchased courses + user name from users collection
        const userSnap = await getDoc(doc(db, "users", user.uid))

        if (userSnap.exists()) {
          const userData = userSnap.data()

          // Grab display name — try Firestore first, fall back to Auth profile
          const name =
            userData.name ||
            userData.displayName ||
            userData.fullName ||
            user.displayName ||
            ''
          setUserName(name)

          if (userData.purchasedCourses) {
            allCourses = [...userData.purchasedCourses]
          }
        } else {
          // Fallback to Firebase Auth displayName
          setUserName(user.displayName || '')
        }

        // 2️⃣ Get new purchases from purchases collection
        const purchasesSnap = await getDocs(
          query(
            collection(db, "purchases"),
            where("userId", "==", user.uid)
          )
        )

        const purchasedCourseIds = purchasesSnap.docs.map(
          (doc) => doc.data().courseId
        )

        // 3️⃣ Merge both lists and remove duplicates
        const mergedCourses = [...new Set([...allCourses, ...purchasedCourseIds])]

        setCourses(mergedCourses)

      } catch (error) {
        console.error("Error loading courses:", error)
      } finally {
        setLoading(false)
      }
    })

    return () => unsub()
  }, [router])

  if (loading) return <Loader />

  // Derive first name for greeting
  const firstName = userName.trim().split(' ')[0] || 'there'

  return (
    <div style={{ minHeight: '100vh', background: '#060608', color: '#fff', overflowX: 'hidden' }}>
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
      `}</style>

      <Scene />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── TOP BAR ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 'clamp(1.2rem, 3vw, 2rem) clamp(1.5rem, 6vw, 4rem)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
            My Batch
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                style={{ width: 5, height: 5, borderRadius: '50%', background: i === 0 ? '#00ffe7' : i === 1 ? '#ff3c5f' : '#f7c948', display: 'inline-block' }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </div>
        </motion.div>

        <main style={{ padding: 'clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 6vw, 4rem)' }}>

          {/* ── HERO HEADING ── */}
          <div style={{ marginBottom: '1.5rem' }}>

            {/* ── GREETING ── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              style={{ marginBottom: '1rem' }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 'clamp(0.7rem, 1.4vw, 0.85rem)',
                  letterSpacing: '0.06em',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                Welcome back,{' '}
                <span style={{ color: '#00ffe7', fontWeight: 600 }}>
                  {firstName}
                </span>{' '}
                👋
              </span>
            </motion.div>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: 36, height: 1, background: 'linear-gradient(90deg, #00ffe7, #00ffe700)', transformOrigin: 'left', display: 'inline-block' }}
              />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.32em', color: '#00ffe780', textTransform: 'uppercase' }}>
                Your Learning Arsenal
              </span>
            </motion.div>

            {/* MASSIVE stacked title */}
            <div style={{ overflow: 'hidden' }}>
              {['YOUR', 'BATCH'].map((word, wi) => (
                <div key={word} style={{ overflow: 'hidden', lineHeight: 0.85 }}>
                  {word.split('').map((ch, ci) => (
                    <motion.span
                      key={ci}
                      initial={{ y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 + wi * 0.22 + ci * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        display: 'inline-block',
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontWeight: 900,
                        fontSize: 'clamp(4.5rem, 14vw, 11rem)',
                        letterSpacing: '-0.04em',
                        color: wi === 0 ? '#fff' : 'transparent',
                        WebkitTextStroke: wi === 1 ? '1px rgba(255,255,255,0.18)' : '0px',
                        lineHeight: 0.9,
                      }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              style={{
                marginTop: '1.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: 'clamp(0.75rem, 1.6vw, 0.88rem)',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.04em',
                lineHeight: 1.8,
                maxWidth: 400,
              }}
            >
              Every course is a weapon. Sharpen them all.
            </motion.p>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: 1, background: 'linear-gradient(90deg, rgba(0,255,231,0.4), rgba(255,60,95,0.2), transparent)', marginTop: '2rem' }}
          />

          {/* ── TICKER ── */}
          {courses.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              <Ticker count={courses.length} />
            </motion.div>
          )}

          {/* ── EMPTY STATE ── */}
          <AnimatePresence>
            {courses.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ paddingBlock: '6rem', textAlign: 'center' }}
              >
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ display: 'inline-block', marginBottom: '2rem' }}
                >
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    border: '1px solid #00ffe730',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 40px #00ffe712',
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00ffe770" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                </motion.div>

                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', marginBottom: '2.5rem' }}>
                  No courses enrolled yet.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/courses')}
                  style={{
                    padding: '0.8rem 2.4rem',
                    borderRadius: 3,
                    background: 'transparent',
                    border: '1px solid #00ffe750',
                    color: '#00ffe7',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: '0 0 30px #00ffe712',
                  }}
                >
                  Explore Courses →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── COURSE GRID ── */}
          {courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))',
                gap: 'clamp(1rem, 2.5vw, 1.5rem)',
              }}
            >
              {courses.map((course, i) => (
                <HoloCard
                  key={course}
                  course={course}
                  index={i}
                  // ✅ FIX: pass the actual courseId (URL-encoded) to the route
                  onClick={() => router.push(`/course-learn/${encodeURIComponent(course)}`)}
                />
              ))}
            </motion.div>
          )}

          {/* Footer */}
          {courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{
                marginTop: '5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '1.5rem',
              }}
            >
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.14)', textTransform: 'uppercase' }}>
                {courses.length} enrolled · keep going
              </span>
              <div style={{ width: 20, height: 1, background: 'rgba(0,255,231,0.3)' }} />
            </motion.div>
          )}

        </main>
      </div>
    </div>
  )
}
