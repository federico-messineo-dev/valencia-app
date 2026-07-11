import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Star } from "lucide-react"
import { useEasterEgg } from "../../context/EasterEggContext"
import { PUZZLES, CONSTELLATION_POINTS, CONSTELLATION_LINES } from "../../data/easterEgg"

export default function Step3Constellation() {
  const { solvedStars, closeModal, allSolved, setShowFinal } = useEasterEgg()
  const [showLines, setShowLines] = useState(false)

  useEffect(() => {
    if (allSolved) {
      const timer = setTimeout(() => setShowLines(true), 800)
      return () => clearTimeout(timer)
    }
  }, [allSolved])

  useEffect(() => {
    if (allSolved && showLines) {
      const timer = setTimeout(() => {
        closeModal()
        setShowFinal(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [allSolved, showLines, closeModal, setShowFinal])

  const points = CONSTELLATION_POINTS.slice(0, solvedStars.length)

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mare to-[#0080cc] flex items-center justify-center">
            <Star className="w-4 h-4 text-white" fill="white" />
          </div>
          <div>
            <p className="text-xs font-bold text-notte">La tua costellazione</p>
            <p className="text-[10px] text-notte/40">
              {solvedStars.length} di {PUZZLES.length} stelle
            </p>
          </div>
        </div>
        <button
          onClick={closeModal}
          className="p-1.5 rounded-full bg-notte/5 hover:bg-notte/10 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-notte/40" />
        </button>
      </div>

      <div className="bg-gradient-to-b from-[#0a0e1a] to-[#141b2d] rounded-2xl p-4 overflow-hidden relative">
        <svg viewBox="0 0 400 280" className="w-full">
          <defs>
            <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Twinkling background stars */}
          {[
            { x: 50, y: 40 }, { x: 350, y: 200 }, { x: 80, y: 220 },
            { x: 320, y: 50 }, { x: 200, y: 15 }, { x: 30, y: 150 },
            { x: 370, y: 120 }, { x: 180, y: 260 }, { x: 250, y: 240 },
            { x: 60, y: 100 }, { x: 340, y: 160 }, { x: 130, y: 250 },
          ].map((s, i) => (
            <motion.circle
              key={`bg-${i}`}
              cx={s.x}
              cy={s.y}
              r={1}
              fill="white"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}

          {/* Constellation lines */}
          {showLines &&
            CONSTELLATION_LINES.map(([a, b], i) => {
              const pa = CONSTELLATION_POINTS[a]
              const pb = CONSTELLATION_POINTS[b]
              if (!pa || !pb) return null
              const solved = solvedStars.includes(a) && solvedStars.includes(b)
              if (!solved) return null
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke="#FFD700"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.15 }}
                />
              )
            })}

          {/* Star points */}
          {points.map((pt, i) => (
            <g key={`star-${i}`}>
              <motion.circle
                cx={pt.x}
                cy={pt.y}
                r={12}
                fill="url(#starGlow)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ delay: i * 0.2, type: "spring", stiffness: 200 }}
              />
              <motion.circle
                cx={pt.x}
                cy={pt.y}
                r={4}
                fill="#FFD700"
                filter="url(#glow)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2, type: "spring", stiffness: 300 }}
              />
              <motion.text
                x={pt.x}
                y={pt.y + 20}
                textAnchor="middle"
                fill="#FFD700"
                fontSize="8"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: i * 0.2 + 0.3 }}
              >
                {PUZZLES[i]?.starLabel}
              </motion.text>
            </g>
          ))}

          {/* Empty star slots */}
          {CONSTELLATION_POINTS.slice(points.length).map((pt, i) => (
            <motion.circle
              key={`empty-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={3}
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.2"
              strokeDasharray="2 2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          ))}
        </svg>

        {!allSolved && (
          <div className="text-center mt-3">
            <p className="text-[10px] text-white/40">
              Trova le stelle nascoste nei luoghi del viaggio
            </p>
          </div>
        )}
      </div>

      {allSolved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-4"
        >
          <p className="text-xs text-notte/50 leading-relaxed">
            La costellazione è completa. Ogni stella è un momento nostro.
          </p>
        </motion.div>
      )}
    </div>
  )
}
