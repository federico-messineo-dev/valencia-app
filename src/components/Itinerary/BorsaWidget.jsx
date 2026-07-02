import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { borsaByDay } from "../../data/borsa"

export default function BorsaWidget({ dayId }) {
  const [expanded, setExpanded] = useState(false)
  const data = borsaByDay[dayId]
  if (!data) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-4"
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => setExpanded(!expanded)}
        className="bg-surface border border-notte/5 rounded-2xl overflow-hidden shadow-sm cursor-pointer"
      >
        {/* Collapsed header */}
        <div className="flex items-center justify-between px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base">👜</span>
            <span className="text-xs font-bold text-notte">Cosa mettere in borsa</span>
            <span className="text-[10px] bg-notte/5 text-notte/40 px-1.5 py-0.5 rounded-full font-medium">
              {data.items.length} items
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-notte/25" />
          ) : (
            <ChevronDown className="w-4 h-4 text-notte/25" />
          )}
        </div>

        {/* Expanded items */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3.5 pb-3 pt-1 border-t border-notte/5">
                <div className="grid grid-cols-2 gap-1.5">
                  {data.items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2 bg-sand/80 rounded-xl px-2.5 py-2"
                    >
                      <span className="text-sm flex-shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-notte leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[9px] text-notte/40 leading-tight mt-0.5">
                          {item.reason}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
