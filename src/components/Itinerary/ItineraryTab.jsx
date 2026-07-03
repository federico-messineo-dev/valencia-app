import { useState, useRef, useCallback, useEffect } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { days } from "../../data/itinerary"
import { getLazyItinerary, calculateBudget, formatCurrency } from "../../utils/helpers"
import { useSync } from "../../hooks/useSync"
import DayHeader from "./DayHeader"
import StopCard from "./StopCard"
import DayMap from "./DayMap"
import BorsaWidget from "./BorsaWidget"
import SfidaCard from "./SfidaCard"
import FoodRating from "./FoodRating"

const SWIPE_THRESHOLD = 80
const SPRING = { type: "spring", stiffness: 400, damping: 35 }

export default function ItineraryTab() {
  const { lazyMode, toggleLazyMode } = useSync()
  const [activeDay, setActiveDay] = useState(0)
  const x = useMotionValue(0)
  const containerRef = useRef(null)
  const tabsRef = useRef(null)
  const tabRefs = useRef([])
  const dragging = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const lockedAxis = useRef(null)

  const day = days[activeDay]
  const isLazy = lazyMode === "lazy"
  const stops = isLazy ? getLazyItinerary(day) : day.stops
  const budget = calculateBudget(stops)

  useEffect(() => {
    const el = tabRefs.current[activeDay]
    if (el && tabsRef.current) {
      const container = tabsRef.current
      const left = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2
      container.scrollTo({ left: Math.max(0, left), behavior: "smooth" })
    }
  }, [activeDay])

  const goToDay = useCallback(
    (next) => {
      if (next < 0 || next >= days.length || next === activeDay) return
      setActiveDay(next)
      animate(x, 0, SPRING)
    },
    [activeDay, x]
  )

  const handlePointerDown = useCallback(
    (e) => {
      dragging.current = true
      startX.current = e.clientX
      startY.current = e.clientY
      lockedAxis.current = null
      x.stop()
      x.set(0)
    },
    [x]
  )

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragging.current) return
      const dx = Math.abs(e.clientX - startX.current)
      const dy = Math.abs(e.clientY - startY.current)

      if (!lockedAxis.current && (dx > 12 || dy > 12)) {
        lockedAxis.current = dx > dy * 1.5 ? "x" : "y"
      }

      if (lockedAxis.current !== "x") return

      const raw = e.clientX - startX.current
      const container = containerRef.current
      if (!container) return
      const width = container.offsetWidth
      const maxSwipe = width * 0.4
      const damped = (raw / maxSwipe) * maxSwipe * 0.6
      x.set(Math.max(-maxSwipe, Math.min(maxSwipe, damped)))
    },
    [x]
  )

  const handlePointerUp = useCallback(
    (e) => {
      if (!dragging.current) return
      dragging.current = false
      if (lockedAxis.current === "x") {
        const dx = e.clientX - startX.current
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          goToDay(dx < 0 ? activeDay + 1 : activeDay - 1)
        } else {
          animate(x, 0, SPRING)
        }
      } else {
        animate(x, 0, SPRING)
      }
    },
    [activeDay, goToDay, x]
  )

  const bg = useTransform(x, [-100, 0, 100], ["rgba(255,122,0,0.06)", "rgba(0,0,0,0)", "rgba(255,122,0,0.06)"])

  return (
    <div className="pb-24">
      {/* Day Tabs — Fixed */}
      <div
        className="fixed inset-x-0 z-[55] border-b border-notte/5"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 68px)" }}
      >
        <div className="bg-surface/95 backdrop-blur-xl">
          <div ref={tabsRef} className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2.5">
            {days.map((d, i) => (
              <motion.button
                key={d.id}
                ref={(el) => (tabRefs.current[i] = el)}
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

      {/* Swipeable Content */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="overflow-hidden select-none"
        style={{ marginTop: "calc(env(safe-area-inset-top, 0px) + 116px)", touchAction: "pan-y" }}
      >
        <motion.div style={{ x, backgroundColor: bg }}>
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
      </div>
    </div>
  )
}
