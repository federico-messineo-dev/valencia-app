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

const SWIPE_THRESHOLD = 50

export default function ItineraryTab() {
  const { lazyMode, toggleLazyMode } = useSync()
  const [activeDay, setActiveDay] = useState(0)
  const [direction, setDirection] = useState(0)
  const touchStart = useRef(null)
  const touchStartY = useRef(null)

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

  const handleTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStart.current === null) return
      const deltaX = e.changedTouches[0].clientX - touchStart.current
      const deltaY = e.changedTouches[0].clientY - touchStartY.current
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX < 0) goToDay(activeDay + 1)
        else goToDay(activeDay - 1)
      }
      touchStart.current = null
      touchStartY.current = null
    },
    [activeDay, goToDay]
  )

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  }

  return (
    <div className="pb-24">
      {/* Day Tabs — Sticky */}
      <div className="sticky top-[52px] z-40 bg-sand/90 backdrop-blur-xl px-4 pt-3 pb-2 border-b border-notte/5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {days.map((d, i) => (
            <motion.button
              key={d.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToDay(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeDay === i
                  ? "bg-gradient-to-r from-valencia to-peach text-white shadow-md shadow-valencia/20"
                  : "bg-notte/5 text-notte/50 hover:bg-notte/10"
              }`}
            >
              {d.emoji} {d.title}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Animated Day Content — swipeable */}
      <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={activeDay}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
