import { motion } from "framer-motion"
import { Moon, Sun, Footprints, Calendar } from "lucide-react"

const greetings = [
  "Buongiorno Federico & Gaia!",
  "Mattina presto, avventurieri!",
  "Giorno di natura!",
  "Giornata relax!",
  "Ultimo giorno, ragazzi!",
]

export default function DayHeader({ day, lazyMode, onToggleLazy }) {
  const showToggle = day.id !== 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-4 rounded-3xl overflow-hidden relative"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-valencia via-peach to-terracotta opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="relative p-5">
        {/* Top Row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-white/70 text-xs font-medium mb-0.5">
              {greetings[day.id - 1]}
            </p>
            <h2 className="text-2xl font-bold text-white leading-tight">
              {day.emoji} {day.title}
            </h2>
            <p className="text-white/80 text-xs mt-0.5">{day.subtitle}</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1">
              <Calendar className="w-3 h-3 text-white/80" />
              <span className="text-white text-xs font-bold">G{day.id}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Footprints className="w-3.5 h-3.5 text-white/80" />
            <span className="text-white text-xs font-semibold">
              ~{day.km} km a piedi
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5">
            <span className="text-white text-xs font-semibold">
              {day.stops.length} tappe
            </span>
          </div>
        </div>

        {/* Lazy Toggle - iOS Style (hidden on Day 1) */}
        {showToggle && (
          <button
            onClick={onToggleLazy}
            className="w-full flex items-center justify-between bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3"
          >
            <div className="flex items-center gap-2">
              {lazyMode ? (
                <Moon className="w-4 h-4 text-white/80" />
              ) : (
                <Sun className="w-4 h-4 text-white/80" />
              )}
              <span className="text-white text-sm font-medium">
                {lazyMode ? "Sveglia Tardi" : "Sveglia Presto"}
              </span>
            </div>
            {/* iOS Toggle */}
            <div
              className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-300 ${
                lazyMode ? "bg-white" : "bg-white/30"
              }`}
            >
              <motion.div
                animate={{ x: lazyMode ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`w-6 h-6 rounded-full shadow-md ${
                  lazyMode
                    ? "bg-gradient-to-br from-valencia to-terracotta"
                    : "bg-white"
                }`}
              />
            </div>
          </button>
        )}

        {day.id === 1 && (
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 w-fit">
            <span className="text-white/70 text-[11px] font-medium">
              ✈️ Arrivo ore 10:35 — primo giro dal pomeriggio
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
