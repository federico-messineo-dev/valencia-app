import { useState, useMemo, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSync } from "../../hooks/useSync"
import { Star } from "lucide-react"

const CATEGORIES = [
  { key: "gusto", label: "Gusto" },
  { key: "location", label: "Location" },
  { key: "abbiocco", label: "Abbiocco" },
  { key: "vibes", label: "Vibes" },
  { key: "qualitaPrezzo", label: "Qualità-Prezzo" },
  { key: "servizio", label: "Servizio" },
]

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          onClick={() => onChange(value === star ? 0 : star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          whileTap={{ scale: 1.3 }}
          className="focus:outline-none cursor-pointer"
          aria-label={`${star} stelle`}
        >
          <Star
            size={20}
            className={`transition-colors duration-150 ${
              star <= (hovered || value) ? "text-valencia fill-valencia" : "text-terracotta/30"
            }`}
          />
        </motion.button>
      ))}
    </div>
  )
}

function FoodRating({ spotId, spotName }) {
  const { foodVotes, updateFoodVote } = useSync()
  const [revealed, setRevealed] = useState(false)

  const spotKey = spotId || "global"

  const federicoVotes = useMemo(() => foodVotes?.federico || {}, [foodVotes])
  const gaiaVotes = useMemo(() => foodVotes?.gaia || {}, [foodVotes])

  const setVote = useCallback(
    (person, category, value) => {
      const current = foodVotes?.[person]?.[spotKey] || {}
      updateFoodVote(person, { ...current, [category]: value })
    },
    [foodVotes, updateFoodVote, spotKey]
  )

  const setNotes = useCallback(
    (person, notes) => {
      const current = foodVotes?.[person]?.[spotKey] || {}
      updateFoodVote(person, { ...current, notes })
    },
    [foodVotes, updateFoodVote, spotKey]
  )

  const fVotes = useMemo(() => {
    const out = {}
    CATEGORIES.forEach((c) => {
      out[c.key] = federicoVotes?.[spotKey]?.[c.key] || 0
    })
    return out
  }, [federicoVotes, spotKey])

  const gVotes = useMemo(() => {
    const out = {}
    CATEGORIES.forEach((c) => {
      out[c.key] = gaiaVotes?.[spotKey]?.[c.key] || 0
    })
    return out
  }, [gaiaVotes, spotKey])

  const fTotal = useMemo(() => Object.values(fVotes).reduce((a, b) => a + b, 0), [fVotes])
  const gTotal = useMemo(() => Object.values(gVotes).reduce((a, b) => a + b, 0), [gVotes])

  const hasAnyVotes = fTotal > 0 || gTotal > 0

  return (
    <div className="mt-3">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.button
            key="reveal"
            onClick={() => setRevealed(true)}
            className="w-full bg-gradient-to-r from-valencia/20 to-terracotta/20 rounded-xl p-3 border border-valencia/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-sm font-semibold text-notte">⚽ Totocalcio del Cibo</span>
            <span className="block text-xs text-notte/60 mt-0.5">
              {hasAnyVotes ? "Vedi votazioni segrete" : "Vota e scopri il parere dell'altro!"}
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl border border-valencia/10 p-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-semibold text-notte">⚽ Totocalcio del Cibo</span>
                <span className="block text-xs text-notte/50">{spotName}</span>
              </div>
              <button
                onClick={() => setRevealed(false)}
                className="text-xs text-notte/40 hover:text-notte/60"
              >
                Nascondi
              </button>
            </div>

            {CATEGORIES.map((cat) => (
              <div key={cat.key} className="mb-3">
                <span className="text-xs text-notte/50 block mb-1">{cat.label}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] text-notte/40 block mb-0.5">Federico</span>
                    <StarRating
                      value={fVotes[cat.key]}
                      onChange={(val) => setVote("federico", cat.key, val)}
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-notte/40 block mb-0.5">Gaia</span>
                    <StarRating
                      value={gVotes[cat.key]}
                      onChange={(val) => setVote("gaia", cat.key, val)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-4 space-y-2">
              <span className="text-xs text-notte/50 font-medium block">Note personali</span>
              <div className="bg-sand/50 rounded-xl p-2.5 border border-notte/5">
                <span className="text-[10px] text-notte/40 flex items-center gap-1 mb-1">🧑 Federico</span>
                <input
                  type="text"
                  placeholder="Scrivi qui..."
                  value={federicoVotes?.[spotKey]?.notes || ""}
                  onChange={(e) => setNotes("federico", e.target.value)}
                  className="w-full text-xs bg-white border border-notte/10 rounded-lg px-3 py-2 focus:outline-none focus:border-valencia/40 placeholder:text-notte/20"
                />
              </div>
              <div className="bg-sand/50 rounded-xl p-2.5 border border-notte/5">
                <span className="text-[10px] text-notte/40 flex items-center gap-1 mb-1">👩 Gaia</span>
                <input
                  type="text"
                  placeholder="Scrivi qui..."
                  value={gaiaVotes?.[spotKey]?.notes || ""}
                  onChange={(e) => setNotes("gaia", e.target.value)}
                  className="w-full text-xs bg-white border border-notte/10 rounded-lg px-3 py-2 focus:outline-none focus:border-valencia/40 placeholder:text-notte/20"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(FoodRating)
