import { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  MapPin,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { photoChecklist } from "../../data/checklist"
import { useSync } from "../../hooks/useSync"

const photoImages = {
  "pc-1":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Plaza_de_la_virgen_valencia_-_panoramio.jpg/960px-Plaza_de_la_virgen_valencia_-_panoramio.jpg",
  "pc-2":
    "https://images.pexels.com/photos/30052224/pexels-photo-30052224.jpeg?auto=compress&cs=tinysrgb&w=600",
  "pc-3":
    "https://images.pexels.com/photos/35085350/pexels-photo-35085350.jpeg?auto=compress&cs=tinysrgb&w=600",
  "pc-4":
    "https://www.publicdomainpictures.net/pictures/320000/nahled/atardecer-en-albufera-de-valencia.jpg",
  "pc-5":
    "https://offloadmedia.feverup.com/valenciasecreta.com/wp-content/uploads/2019/07/21092454/puente-de-las-flores.jpg",
}

export default function PhotoCarousel() {
  const { photoChecked, togglePhotoCheck } = useSync()
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    const container = scrollRef.current
    if (!container) return
    const cardWidth = container.firstChild?.offsetWidth || 280
    container.scrollBy({ left: dir * (cardWidth + 12), behavior: "smooth" })
  }

  const totalChecked = Object.values(photoChecked).filter(Boolean).length

  return (
    <div>
      {/* Counter */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-sm font-bold text-notte">📸 Photo Spots</h3>
        <span className="text-xs font-semibold text-mare bg-mare/10 px-2.5 py-1 rounded-full">
          {totalChecked}/{photoChecklist.length}
        </span>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Nav arrows */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-surface/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center border border-notte/5"
        >
          <ChevronLeft className="w-4 h-4 text-notte/60" />
        </button>
        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-surface/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center border border-notte/5"
        >
          <ChevronRight className="w-4 h-4 text-notte/60" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory"
        >
          {photoChecklist.map((item) => {
            const isOn = photoChecked[item.id]
            const imgSrc = photoImages[item.id]
            return (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.97 }}
                className={`flex-shrink-0 w-[260px] snap-center rounded-2xl border overflow-hidden transition-colors ${
                  isOn
                    ? "border-mare/30"
                    : "border-notte/8"
                } shadow-sm`}
              >
                {/* Real Image */}
                <div className="relative h-36 bg-notte/5">
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Badge animated */}
                  <AnimatePresence>
                    {isOn && (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="absolute top-2 right-2 bg-mare text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Scattata!
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Day badge */}
                  <div className="absolute top-2 left-2 bg-black/30 backdrop-blur-sm text-white/80 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    G{item.day}
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <h4 className="text-white text-sm font-bold drop-shadow-lg">
                      {item.name}
                    </h4>
                  </div>
                </div>

                <div className="p-3 bg-surface">
                  <p className="text-[11px] text-notte/50 leading-relaxed mb-2 line-clamp-2">
                    {item.tip}
                  </p>

                  <AnimatePresence>
                    {isOn && item.camera && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-start gap-1.5 bg-valencia/8 rounded-xl px-2.5 py-2 mt-1">
                          <Lightbulb className="w-3 h-3 text-valencia flex-shrink-0 mt-0.5" />
                          <p className="text-[10px] text-notte/55 leading-relaxed">
                            📷 {item.camera}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => togglePhotoCheck(item.id)}
                    className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isOn
                        ? "bg-mare text-white shadow-md shadow-mare/25"
                        : "bg-notte/5 text-notte/50 hover:bg-notte/10"
                    }`}
                  >
                    {isOn ? "✓ Scattata!" : "📸 Segna come scattata"}
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
