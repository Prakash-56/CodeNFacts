'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export default function Dashboard() {
  const router = useRouter()
  const [status, setStatus] = useState('Verifying your access...')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus('Redirecting to login...')
        setTimeout(() => router.push('/login'), 800)
        return
      }

      try {
        const snap = await getDoc(doc(db, 'users', user.uid))

        if (snap.exists()) {
          const data = snap.data()

          if (data?.purchasedCourses?.length > 0) {
            setStatus('Taking you to your batch.👉.')
            setTimeout(() => router.push('/my-batch'), 1200)
          } else {
            setStatus('Redirecting to premium dashboard ❤️...')
            setTimeout(() => router.push('/buy-courses'), 1200)
          }
        } else {
          setStatus('Setting up your account...')
          setTimeout(() => router.push('/buy-courses'), 1200)
        }
      } catch (err) {
        console.error(err)
        setStatus('Something went wrong. Redirecting...')
        setTimeout(() => router.push('/buy-courses'), 1800)
      }
    })

    return () => unsubscribe()
  }, [router])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Animated background blobs */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute -left-20 top-20 h-96 w-96 animate-blob rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-500/20 blur-3xl"></div>
        <div className="absolute right-10 bottom-10 h-80 w-80 animate-blob animation-delay-2000 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/30 blur-3xl"></div>
        <div className="absolute left-1/3 top-1/2 h-64 w-96 -translate-y-1/2 animate-blob animation-delay-4000 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-500/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.97 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl shadow-black/60"
          >
            {/* Glassmorphic top bar simulation */}
            <div className="h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"></div>

            <div className="p-10 pb-12 text-center">
              {/* Animated gradient heading */}
              <motion.h1
                className="mb-8 bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '200% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                Welcome back
              </motion.h1>

              <motion.p
                className="mb-10 text-lg font-medium text-slate-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {status}
              </motion.p>

              {/* Premium loader */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center">
                <motion.div
                  className="h-16 w-16 rounded-full border-4 border-t-transparent border-violet-400 shadow-lg shadow-violet-500/40"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <motion.div
                  className="absolute h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 opacity-60 blur-md"
                  animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.6, 0.9, 0.6],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}