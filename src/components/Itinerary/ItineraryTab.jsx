import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { days } from "../../data/itinerary"
import { getLazyItinerary, calculateBudget, formatCurrency } from "../../utils/helpers"
import { useSync } from "../../hooks/useSync"
import DayHeader from "./DayHeader"
import StopCard from "./StopCard"
import DayMap from "./DayMap"
import BorsaWidget from "./BorsaWidget"
import SfidaCard from "./SfidaCard"
import FoodRating from "./FoodRating"

const SWIPE_THRESHOLD = 40

export default function ItineraryTab() {
  const { lazyMode, toggleLazyMode } = useSync()
  const [activeDay, setActiveDay] = useState(0)
  const [direction, setDirection] = useState(0)
  const dragStart = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const lockedAxis = useRef(null)

  const day = days[activeDay]
  const isLazy = lazyMode === "lazy"
  const stops = isLazy ? getLazyItinerary(day) : day.stops
  const budget = calculateBudget(stops)

  const goToDay = useCallback(
    (next) => {
      if (next < 0 || next >= days.length) return
      setDirection(next > activeDay ? 1 : -1)
      setActiveDay(next)
    },
    [activeDay]
  )

  const handlePointerDown = useCallback((e) => {
    dragStart.current = { x: e.clientX, y: e.clientY }
    isDragging.current = true
    lockedAxis.current = null
  }, [])

  const handlePointerUp = useCallback(
    (e) => {
      if (!isDragging.current) return
      const dx = e.clientX - dragStart.current.x

      if (lockedAxis.current === "x" && Math.abs(dx) > SWIPE_THRESHOLD) {
        goToDay(dx < 0 ? activeDay + 1 : activeDay - 1)
      }

      isDragging.current = false
      lockedAxis.current = null
    },
    [activeDay, goToDay]
  )

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return
    const dx = Math.abs(e.clientX - dragStart.current.x)
    const dy = Math.abs(e.clientY - dragStart.current.y)

    if (!lockedAxis.current && (dx > 8 || dy > 8)) {
      lockedAxis.current = dx > dy ? "x" : "y"
    }
  }, [])

  return (
    <div className="pb-24">
      {/* Day Tabs — Fixed */}
      <div
        className="fixed inset-x-0 z-40 border-b border-notte/5"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 48px)" }}
      >
        <div className="bg-surface/95 backdrop-blur-xl">
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2.5">
            {days.map((d, i) => (
              <motion.button
                key={d.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToDay(i)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeDay === i
                    ? "bg-valencia text-white shadow-md shadow-valencia/25"
                    : "bg-notte/5 text-notte/45 active:bg-notte/10"
                }`}
              >
                {d.emoji} {d.title}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Day Content — swipeable */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: "pan-y", marginTop: "calc(env(safe-area-inset-top, 0px) + 100px)" }}
      >
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={activeDay}
            custom={direction}
            initial={(dir) => ({ x: dir > 0 ? "45%" : "-45%", opacity: 0.4 })}
            animate={{ x: 0, opacity: 1 }}
            exit={(dir) => ({ x: dir > 0 ? "-45%" : "45%", opacity: 0.4 })}
            transition={{ type: "tween", duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            {/* Smart Day Header */}
            <DayHeader
              day={day}
              lazyMode={isLazy}
              onToggleLazy={() => toggleLazyMode(day.id)}
            />

            {/* 👜 Borsa Widget */}
            <BorsaWidget dayId={day.id} />

            {/* Budget pill */}
            <div className="px-4 mb-3">
              <div className="inline-flex items-center gap-1.5 bg-valencia/10 rounded-full px-3 py-1">
                <span className="text-[11px] font-bold text-valencia">
                  Budget: {formatCurrency(budget)}
                </span>
              </div>
            </div>

            {/* Stops Timeline */}
            <div className="px-4">
              {stops.map((stop, i) => (
                <div key={stop.id}>
                  <StopCard stop={stop} index={i} />
                  {stop.isFoodSpot && (
                    <div className="ml-4 mr-4 mb-4 pl-4 border-l-2 border-valencia/20">
                      <FoodRating spotId={stop.id} spotName={stop.name} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Map */}
            <DayMap stops={stops} />

            {/* 💕 Sfida di Coppia */}
            <SfidaCard dayId={day.id} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
