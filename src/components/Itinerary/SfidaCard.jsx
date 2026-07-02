import { motion } from "framer-motion"
import { sfideByDay } from "../../data/sfide"

export default function SfidaCard({ dayId }) {
  const sfida = sfideByDay.find((s) => s.day === dayId)
  if (!sfida) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
      className="mx-4 mb-4"
    >
      <div className="relative overflow-hidden rounded-3xl">
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B9D] via-[#FF8A65] to-[#FFB74D] opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wOCkiLz48L3N2Zz4=')] opacity-50" />

        <div className="relative p-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-2xl">{sfida.icon}</span>
            <div>
              <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wider">
                Sfida di Coppia
              </p>
              <h3 className="text-white text-sm font-black leading-tight">
                {sfida.title}
              </h3>
            </div>
          </div>

          {/* Challenge text */}
          <p className="text-white/90 text-xs leading-relaxed mb-3">
            {sfida.challenge}
          </p>

          {/* Prize */}
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-2.5">
            <span className="text-base">🏆</span>
            <div>
              <p className="text-white/60 text-[9px] font-semibold uppercase tracking-wider">
                Premio
              </p>
              <p className="text-white text-xs font-bold">{sfida.prize}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
