import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  UtensilsCrossed,
  Camera,
  Palmtree,
  Landmark,
  Bus,
  Train,
  Footprints,
  Clock,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Moon,
  Navigation,
  Check,
} from "lucide-react"
import { useSync } from "../../hooks/useSync"

const categoryIcons = {
  food: UtensilsCrossed,
  foto: Camera,
  relax: Palmtree,
  cultura: Landmark,
}

const logisticsIcons = {
  bus: Bus,
  train: Train,
  walk: Footprints,
}

const categoryColors = {
  food: { bg: "bg-valencia/10", text: "text-valencia", border: "border-valencia/20" },
  foto: { bg: "bg-mare/10", text: "text-mare", border: "border-mare/20" },
  relax: { bg: "bg-terracotta/10", text: "text-terracotta", border: "border-terracotta/20" },
  cultura: { bg: "bg-notte/8", text: "text-notte/70", border: "border-notte/10" },
}

const budgetBadgeColors = {
  "€": "bg-terracotta/15 text-terracotta",
  "€€": "bg-valencia/15 text-valencia",
  "€€€": "bg-notte/15 text-notte",
}

function openMaps(coords, name) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}&destination_place_id=${encodeURIComponent(name)}`
  window.open(url, "_blank")
}

export default function StopCard({ stop, index }) {
  const [expanded, setExpanded] = useState(false)
  const { checkedStops, toggleStopChecked } = useSync()
  const isChecked = !!checkedStops[stop.id]
  const CatIcon = categoryIcons[stop.category] || Landmark
  const LogIcon = logisticsIcons[stop.logisticsIcon] || Footprints
  const colors = categoryColors[stop.category] || categoryColors.cultura

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 25 }}
      className="flex gap-3 pb-4 relative"
    >
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-2xl flex items-center justify-center z-10 ${colors.bg} ${colors.text}`}
        >
          <CatIcon className="w-4 h-4" strokeWidth={2} />
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 min-w-0">
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpanded(!expanded)}
          className={`bg-surface rounded-2xl border overflow-hidden cursor-pointer transition-colors ${
            isChecked ? "border-valencia/30 bg-valencia/5" : expanded ? colors.border : "border-notte/5"
          } shadow-sm`}
        >
          {/* Header */}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono text-notte/35 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {stop.time}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${budgetBadgeColors[stop.budget] || ""}`}
              >
                {stop.budget}
              </span>
              {/* Check button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleStopChecked(stop.id)
                }}
                className={`ml-auto w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isChecked
                    ? "bg-valencia border-valencia text-white"
                    : "border-notte/20 bg-transparent text-transparent hover:border-valencia/50"
                }`}
              >
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </motion.button>
            </div>
            <h3 className={`text-sm font-bold leading-tight ${isChecked ? "text-notte/40 line-through" : "text-notte"}`}>
              {stop.name}
            </h3>
            <p className={`text-xs mt-0.5 line-clamp-1 ${isChecked ? "text-notte/30" : "text-notte/45"}`}>
              {stop.description}
            </p>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3 space-y-2 border-t border-notte/5 pt-2">
                  <p className="text-xs text-notte/65 leading-relaxed">
                    {stop.description}
                  </p>

                  {stop.tip && (
                    <div className="flex items-start gap-2 bg-valencia/8 rounded-xl px-3 py-2">
                      <Lightbulb className="w-3.5 h-3.5 text-valencia flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-notte/65 leading-relaxed">
                        {stop.tip}
                      </p>
                    </div>
                  )}

                  {stop.photo && (
                    <div className="flex items-center gap-2 bg-mare/8 rounded-xl px-3 py-2">
                      <Camera className="w-3.5 h-3.5 text-mare flex-shrink-0" />
                      <p className="text-[11px] text-notte/55">
                        📸 Spot: {stop.photo}
                      </p>
                    </div>
                  )}

                  {stop.logistics && (
                    <div className="flex items-start gap-2 bg-terracotta/8 rounded-xl px-3 py-2">
                      <LogIcon className="w-3.5 h-3.5 text-terracotta flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-notte/55 leading-relaxed">
                        {stop.logistics}
                      </p>
                    </div>
                  )}

                  {stop.lazyNote && (
                    <div className="flex items-start gap-2 bg-mare/8 rounded-xl px-3 py-2">
                      <Moon className="w-3.5 h-3.5 text-mare flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-notte/55 leading-relaxed italic">
                        {stop.lazyNote}
                      </p>
                    </div>
                  )}

                  {/* PORTAMI QUI button + transport costs */}
                  {stop.coords && (
                    <div className="flex items-center gap-2 pt-1">
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          openMaps(stop.coords, stop.name)
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-mare to-[#0080cc] text-white rounded-xl py-2.5 text-xs font-bold shadow-md shadow-mare/20"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Portami qui
                      </motion.button>
                      <div className="flex gap-1">
                        <div className="flex items-center gap-1 bg-notte/5 rounded-lg px-2 py-1.5">
                          <Bus className="w-3 h-3 text-notte/40" />
                          <span className="text-[10px] font-bold text-notte/50">1.50€</span>
                        </div>
                        <div className="flex items-center gap-1 bg-notte/5 rounded-lg px-2 py-1.5">
                          <span className="text-[10px]">🚕</span>
                          <span className="text-[10px] font-bold text-notte/50">~8€</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand indicator */}
          <div className="flex justify-center pb-2">
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-notte/20" />
            ) : (
              <ChevronDown className="w-4 h-4 text-notte/20" />
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
