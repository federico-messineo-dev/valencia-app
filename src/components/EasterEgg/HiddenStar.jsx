import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { useEasterEgg } from "../../context/EasterEggContext"
import { STAR_STOPS } from "../../data/easterEgg"

export default function HiddenStar({ stopId }) {
  const { started, solvedStars, openPuzzle } = useEasterEgg()

  if (!started) return null

  const starData = STAR_STOPS.find((s) => s.stopId === stopId)
  if (!starData) return null

  const puzzleId = STAR_STOPS.indexOf(starData)
  const isSolved = solvedStars.includes(puzzleId)

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation()
        if (!isSolved) openPuzzle(puzzleId)
      }}
      className={`absolute -top-1 -right-1 z-20 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
        isSolved
          ? "bg-gradient-to-br from-amber-400 to-yellow-300 shadow-lg shadow-amber-400/30"
          : "bg-gradient-to-br from-notte/20 to-notte/10 hover:from-valencia/30 hover:to-peach/30"
      }`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
    >
      <Star
        className={`w-3 h-3 ${isSolved ? "text-white" : "text-notte/30"}`}
        fill={isSolved ? "white" : "none"}
      />
      {!isSolved && (
        <motion.div
          className="absolute inset-0 rounded-full border border-valencia/40"
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  )
}
