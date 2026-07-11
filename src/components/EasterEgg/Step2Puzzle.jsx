import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, X, Check, ArrowRight } from "lucide-react"
import { useEasterEgg } from "../../context/EasterEggContext"
import { PUZZLES } from "../../data/easterEgg"

export default function Step2Puzzle() {
  const { currentPuzzle, solvePuzzle, closeModal } = useEasterEgg()
  const [selected, setSelected] = useState(null)
  const [scrambleInput, setScrambleInput] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const prevPuzzleRef = useRef(currentPuzzle)

  const puzzle = currentPuzzle !== null ? PUZZLES[currentPuzzle] : null

  useEffect(() => {
    if (prevPuzzleRef.current !== currentPuzzle) {
      prevPuzzleRef.current = currentPuzzle
      setSelected(null)
      setScrambleInput("")
      setShowSuccess(false)
      setIsCorrect(false)
    }
  }, [currentPuzzle])

  if (!puzzle) return null

  const handleCheck = () => {
    const isAnswerCorrect =
      puzzle.type === "scramble"
        ? scrambleInput.toUpperCase().trim() === puzzle.answer
        : selected !== null && puzzle.options[selected].correct
    setIsCorrect(isAnswerCorrect)
    setShowSuccess(true)
    if (isAnswerCorrect) {
      solvePuzzle(puzzle.id)
    }
  }

  const canCheck =
    puzzle.type === "scramble"
      ? scrambleInput.length > 0
      : selected !== null

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-valencia to-peach flex items-center justify-center">
            <Star className="w-4 h-4 text-white" fill="white" />
          </div>
          <div>
            <p className="text-[10px] text-notte/40 font-medium">
              Stella {puzzle.id + 1} di {PUZZLES.length}
            </p>
            <p className="text-xs font-bold text-notte">{puzzle.starLabel}</p>
          </div>
        </div>
        <button
          onClick={closeModal}
          className="p-1.5 rounded-full bg-notte/5 hover:bg-notte/10 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-notte/40" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showSuccess ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-sm font-bold text-notte leading-relaxed mb-5">
              {puzzle.question}
            </p>

            {puzzle.type === "scramble" ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={scrambleInput}
                  onChange={(e) => setScrambleInput(e.target.value)}
                  placeholder="Scrivi la risposta..."
                  className="w-full px-4 py-3 bg-sand rounded-xl border border-notte/10 text-sm font-bold text-notte placeholder:text-notte/30 focus:outline-none focus:border-valencia/50 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canCheck) handleCheck()
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCheck}
                  disabled={!canCheck}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
                    canCheck
                      ? "bg-gradient-to-r from-valencia to-peach text-white shadow-lg shadow-valencia/20"
                      : "bg-notte/5 text-notte/30"
                  }`}
                >
                  Verifica
                </motion.button>
              </div>
            ) : (
              <div className="space-y-2">
                {puzzle.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelected(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                      selected === i
                        ? "bg-valencia/10 border-valencia/30 text-valencia"
                        : "bg-sand border-notte/5 text-notte/60 hover:border-notte/15"
                    }`}
                  >
                    {opt.text}
                  </motion.button>
                ))}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCheck}
                  disabled={!canCheck}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
                    canCheck
                      ? "bg-gradient-to-r from-valencia to-peach text-white shadow-lg shadow-valencia/20"
                      : "bg-notte/5 text-notte/30"
                  }`}
                >
                  Verifica
                </motion.button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            {isCorrect ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-valencia to-peach mb-4"
                >
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </motion.div>
                <h4 className="text-base font-black text-notte mb-2">
                  Stella accesa! ✦
                </h4>
                <p className="text-xs text-notte/50 leading-relaxed mb-5">
                  {puzzle.successMessage}
                </p>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-notte/10 mb-4"
                >
                  <X className="w-8 h-8 text-notte/40" />
                </motion.div>
                <h4 className="text-base font-black text-notte mb-2">
                  Non proprio...
                </h4>
                <p className="text-xs text-notte/50 leading-relaxed mb-5">
                  Riprova! Ogni stella ha il suo momento.
                </p>
              </>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={closeModal}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-valencia to-peach shadow-lg shadow-valencia/20"
            >
              {isCorrect ? (
                <>
                  Continua <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                "Riprova dopo"
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
