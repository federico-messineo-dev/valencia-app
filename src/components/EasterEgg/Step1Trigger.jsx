import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X } from "lucide-react"
import { useEasterEgg } from "../../context/EasterEggContext"

export default function Step1Trigger() {
  const { started, startEasterEgg, openPuzzle } = useEasterEgg()
  const [showIntro, setShowIntro] = useState(false)

  const handleTap = () => {
    if (started) {
      openPuzzle(null)
    } else {
      setShowIntro(true)
    }
  }

  return (
    <>
      <div className="flex justify-center py-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleTap}
          animate={
            !started
              ? { opacity: [0.4, 0.8, 0.4] }
              : {}
          }
          transition={{ duration: 3, repeat: Infinity }}
          className={`relative px-3 py-1 rounded-full text-[11px] font-bold select-none transition-colors ${
            started
              ? "text-valencia/50 hover:text-valencia/70"
              : "text-notte/30 hover:text-notte/50"
          }`}
        >
          {started ? "✦" : "✦"}
          {!started && (
            <motion.span
              className="absolute inset-0 rounded-full border border-valencia/20"
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowIntro(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-valencia/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-mare/10 rounded-full blur-2xl" />

              <button
                onClick={() => setShowIntro(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-notte/5 hover:bg-notte/10 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-notte/40" />
              </button>

              <div className="relative text-center">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-valencia to-peach mb-4"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>

                <h3 className="text-lg font-black text-notte mb-2">
                  Hai trovato una stella ✦
                </h3>
                <p className="text-xs text-notte/50 leading-relaxed mb-5">
                  C'è un segreto nascosto in questo viaggio. Sei curiosa di trovarlo?
                </p>

                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowIntro(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-notte/40 bg-notte/5 hover:bg-notte/10 transition-colors"
                  >
                    Non ora
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      startEasterEgg()
                      setShowIntro(false)
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-valencia to-peach shadow-lg shadow-valencia/20"
                  >
                    Sono curiosa ✦
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
