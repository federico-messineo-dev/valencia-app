import { motion, AnimatePresence } from "framer-motion"
import { useEasterEgg } from "../../context/EasterEggContext"
import Step2Puzzle from "./Step2Puzzle"
import Step3Constellation from "./Step3Constellation"
import Step4FinalQuestion from "./Step4FinalQuestion"

export default function EasterEggModal() {
  const { showModal, closeModal, currentPuzzle, solvedStars } =
    useEasterEgg()

  const showPuzzle = showModal && currentPuzzle !== null
  const showConstellation =
    showModal && currentPuzzle === null && solvedStars.length > 0

  return (
    <>
      <AnimatePresence>
        {showPuzzle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface w-full max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
            >
              <div className="overflow-y-auto max-h-[85vh]">
                <Step2Puzzle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConstellation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface w-full max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
            >
              <div className="overflow-y-auto max-h-[85vh]">
                <Step3Constellation />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Step4FinalQuestion />
    </>
  )
}
