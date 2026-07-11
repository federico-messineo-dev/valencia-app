import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"
import { useEasterEgg } from "../../context/EasterEggContext"

const HEART_PATH =
  "M200 80 C200 80 250 20 300 60 C350 100 350 160 200 230 C50 160 50 100 100 60 C150 20 200 80 200 80Z"

const bgStars = Array.from({ length: 40 }, (_, i) => ({
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  duration: 1.5 + (i % 5) * 0.4,
  delay: (i % 7) * 0.3,
}))

export default function Step4FinalQuestion() {
  const { showFinal, setShowFinal, answeredYes, setAnsweredYes, setProposalCompleted } = useEasterEgg()
  const [phase, setPhase] = useState(0)
  const [answered, setAnswered] = useState(answeredYes)
  const [saidYes, setSaidYes] = useState(answeredYes)
  const prevShowFinal = useRef(showFinal)

  useEffect(() => {
    if (showFinal && !prevShowFinal.current) {
      setPhase(0)
      setAnswered(answeredYes)
      setSaidYes(answeredYes)
    }
    prevShowFinal.current = showFinal
  }, [showFinal, answeredYes])

  useEffect(() => {
    if (!showFinal) return
    let cancelled = false
    const timers = [
      setTimeout(() => { if (!cancelled) setPhase(1) }, 600),
      setTimeout(() => { if (!cancelled) setPhase(2) }, 1800),
      setTimeout(() => { if (!cancelled) setPhase(3) }, 3200),
    ]
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [showFinal])

  if (!showFinal) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex flex-col"
    >
      {/* Night sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050810] via-[#0a1628] to-[#0f1f3d]">
        {/* Animated stars */}
        {bgStars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: star.left, top: star.top }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {/* Phase 0: Initial darkness */}
          {phase === 0 && (
            <motion.div
              key="phase0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl mb-4"
              >
                ✦
              </motion.div>
            </motion.div>
          )}

          {/* Phase 1: Heart draws */}
          {phase >= 1 && phase < 4 && (
            <motion.div
              key="heart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <svg viewBox="0 0 400 260" className="w-48 h-32 mx-auto">
                <defs>
                  <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF7A00" />
                    <stop offset="100%" stopColor="#FFB088" />
                  </linearGradient>
                  <filter id="heartGlow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <motion.path
                  d={HEART_PATH}
                  fill="none"
                  stroke="url(#heartGrad)"
                  strokeWidth="3"
                  filter="url(#heartGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.path
                  d={HEART_PATH}
                  fill="url(#heartGrad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 2, duration: 1 }}
                />
              </svg>
            </motion.div>
          )}

          {/* Phase 2: Text appears */}
          {phase >= 2 && phase < 4 && (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <p className="text-white/60 text-xs mb-3">
                Abbiamo creato così tanti ricordi insieme...
              </p>
              <p className="text-white/60 text-xs mb-6">
                Ogni stella che hai trovato racconta un pezzo di noi.
              </p>
            </motion.div>
          )}

          {/* Phase 3: The question */}
          {phase >= 3 && !answered && (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center"
            >
              <motion.h2
                className="text-2xl font-black text-white mb-2"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Gaia
              </motion.h2>
              <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                Vuoi continuare a scrivere la nostra storia insieme?
              </p>

              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSaidYes(true)
                    setAnswered(true)
                    setAnsweredYes(true)
                    setProposalCompleted(true)
                  }}
                  className="relative py-4 px-6 rounded-2xl text-base font-black text-white bg-gradient-to-r from-valencia via-peach to-valencia shadow-2xl shadow-valencia/30 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" fill="white" />
                    Sì, voglio essere la tua ragazza
                  </span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSaidYes(false)
                    setAnswered(true)
                    setProposalCompleted(true)
                  }}
                  className="py-3 px-6 rounded-2xl text-xs font-semibold text-white/30 hover:text-white/50 transition-colors"
                >
                  Non ora
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Phase 4: Answer result */}
          {answered && saidYes && (
            <motion.div
              key="yes"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                💍
              </motion.div>
              <h2 className="text-2xl font-black text-white mb-3">
                Guardami
              </h2>
              <p className="text-white/50 text-xs leading-relaxed max-w-xs mx-auto mb-6">
                Ho qualcosa di speciale per te.
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFinal(false)}
                className="py-3 px-8 rounded-2xl text-xs font-bold text-white/60 border border-white/20 hover:bg-white/5 transition-colors"
              >
                Continua il viaggio insieme 💕
              </motion.button>
            </motion.div>
          )}

          {answered && !saidYes && (
            <motion.div
              key="no"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-white/40 text-xs leading-relaxed max-w-xs mx-auto mb-6">
                Va bene, senza fretta. La mia stella rimane lì, ad aspettare.
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFinal(false)}
                className="py-3 px-8 rounded-2xl text-xs font-bold text-white/30 border border-white/10 hover:bg-white/5 transition-colors"
              >
                Torna al viaggio
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
