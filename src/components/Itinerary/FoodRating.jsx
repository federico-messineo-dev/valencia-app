import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Trophy, Eye } from "lucide-react"
import { useSync } from "../../hooks/useSync"

const categories = [
  { id: "gusto", label: "Gusto", icon: "👅", description: "Sapore autentico?" },
  { id: "location", label: "Location", icon: "📍", description: "Atmosfera e vibe" },
  { id: "abbiocco", label: "Effetto Abbiocco", icon: "😴", description: "Quanto vi ha cotto?" },
]

function StarRating({ value, onChange, disabled }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileTap={{ scale: disabled ? 1 : 0.85 }}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
          onClick={() => !disabled && onChange(star)}
          disabled={disabled}
          className="p-0.5"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= (hovered || value)
                ? "text-valencia fill-valencia"
                : "text-notte/15"
            } ${disabled ? "opacity-50" : ""}`}
          />
        </motion.button>
      ))}
    </div>
  )
}

export default function FoodRating() {
  const {
    foodVotes,
    foodDone,
    foodRevealed,
    setFoodVote,
    setFoodDone,
    setFoodRevealed,
  } = useSync()

  const [activeUser, setActiveUser] = useState("fede")

  const fedeDone = foodDone.fede
  const gaiaDone = foodDone.gaia
  const bothVoted = fedeDone && gaiaDone

  const getAverage = (cat) => {
    if (!foodRevealed) return "?"
    return ((foodVotes.fede[cat] + foodVotes.gaia[cat]) / 2).toFixed(1)
  }

  const getSeverest = () => {
    if (!foodRevealed) return null
    const t1 = Object.values(foodVotes.fede).reduce((a, b) => a + b, 0)
    const t2 = Object.values(foodVotes.gaia).reduce((a, b) => a + b, 0)
    return t1 < t2 ? "Federico" : t2 < t1 ? "Gaia" : "Parità perfetta!"
  }

  const handleReveal = () => {
    if (bothVoted) setFoodRevealed(true)
  }

  const handleReset = () => {
    setFoodVote("fede", "gusto", 0)
    setFoodVote("fede", "location", 0)
    setFoodVote("fede", "abbiocco", 0)
    setFoodVote("gaia", "gusto", 0)
    setFoodVote("gaia", "location", 0)
    setFoodVote("gaia", "abbiocco", 0)
    setFoodDone("fede", false)
    setFoodDone("gaia", false)
    setFoodRevealed(false)
    setActiveUser("fede")
  }

  const currentVotes = foodVotes[activeUser]
  const isDone = foodDone[activeUser]

  return (
    <div className="mx-4 mb-4">
      <div className="bg-gradient-to-br from-valencia via-[#FF9044] to-peach rounded-3xl p-4 text-white relative overflow-hidden">
        {/* Decorative dots */}
        <div className="absolute top-3 right-3 w-2 h-2 bg-white/20 rounded-full" />
        <div className="absolute top-3 right-8 w-1.5 h-1.5 bg-white/15 rounded-full" />
        <div className="absolute bottom-4 right-5 w-1 h-1 bg-white/10 rounded-full" />

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">⚽</span>
          <div>
            <h3 className="text-sm font-black leading-tight">
              Totocalcio del Cibo
            </h3>
            <p className="text-white/70 text-[10px]">
              Votate la paella dell'Albufera! I voti restano segreti...
            </p>
          </div>
        </div>

        {/* User Toggle */}
        <div className="flex gap-1.5 mb-4">
          {[
            { id: "fede", label: "🧑 Federico", done: fedeDone },
            { id: "gaia", label: "👩 Gaia", done: gaiaDone },
          ].map((u) => (
            <motion.button
              key={u.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveUser(u.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeUser === u.id
                  ? "bg-white text-valencia shadow-md"
                  : u.done
                    ? "bg-white/20 text-white/70"
                    : "bg-white/10 text-white/50"
              }`}
            >
              {u.label}
              {u.done && !foodRevealed && (
                <span className="ml-1 text-[9px]">✓</span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Voting Section */}
        {!foodRevealed && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeUser}
              initial={{ opacity: 0, x: activeUser === "fede" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeUser === "fede" ? 20 : -20 }}
              className="space-y-3"
            >
              {isDone ? (
                <div className="text-center py-4">
                  <p className="text-white/70 text-xs">
                    ✓ Voti di {activeUser === "fede" ? "Federico" : "Gaia"} registrati!
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFoodDone(activeUser, false)}
                    className="mt-2 text-[10px] text-white/50 underline"
                  >
                    Modifica voti
                  </motion.button>
                </div>
              ) : (
                categories.map((cat) => (
                  <div key={cat.id} className="bg-white/15 rounded-2xl px-3 py-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{cat.icon}</span>
                        <div>
                          <p className="text-xs font-bold">{cat.label}</p>
                          <p className="text-[9px] text-white/60">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-black">
                        {currentVotes[cat.id] || "?"}
                      </span>
                    </div>
                    <StarRating
                      value={currentVotes[cat.id]}
                      onChange={(val) => setFoodVote(activeUser, cat.id, val)}
                      disabled={false}
                    />
                  </div>
                ))
              )}

              {!isDone && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const hasAll = Object.values(currentVotes).every((v) => v > 0)
                    if (hasAll) {
                      setFoodDone(activeUser, true)
                      if (activeUser === "fede") setActiveUser("gaia")
                    }
                  }}
                  disabled={!Object.values(currentVotes).every((v) => v > 0)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    Object.values(currentVotes).every((v) => v > 0)
                      ? "bg-white text-valencia shadow-md"
                      : "bg-white/10 text-white/30"
                  }`}
                >
                  Conferma Voti di {activeUser === "fede" ? "Federico" : "Gaia"}
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Reveal Button / Results */}
        {!foodRevealed && bothVoted && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReveal}
            className="w-full py-3 bg-white text-valencia rounded-2xl text-sm font-black shadow-xl shadow-black/10 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Rivela Verdetto!
          </motion.button>
        )}

        <AnimatePresence>
          {foodRevealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-3"
            >
              {/* Results */}
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-white/15 rounded-2xl px-3 py-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{cat.icon}</span>
                      <div>
                        <p className="text-xs font-bold">{cat.label}</p>
                        <p className="text-[9px] text-white/60">
                          🧑 {foodVotes.fede[cat.id]}★ · 👩 {foodVotes.gaia[cat.id]}★
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-black">{getAverage(cat.id)}</span>
                  </div>
                </motion.div>
              ))}

              {/* Severest Critic */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/20 rounded-2xl px-3 py-3 flex items-center gap-3"
              >
                <Trophy className="w-5 h-5 text-white flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">
                    Il critico più severo
                  </p>
                  <p className="text-sm font-black">{getSeverest()}</p>
                </div>
              </motion.div>

              {/* Reset */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="w-full py-2 bg-white/10 text-white/60 rounded-xl text-xs font-medium"
              >
                🔄 Ricomincia
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
