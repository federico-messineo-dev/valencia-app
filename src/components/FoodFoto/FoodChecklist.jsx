import { motion } from "framer-motion"
import { CheckCircle2, Circle, Camera } from "lucide-react"
import { foodChecklist, foodTypes } from "../../data/checklist"
import { useSync } from "../../hooks/useSync"

const typeBadgeColors = {
  brunch: "bg-valencia/15 text-valencia",
  tapas: "bg-terracotta/15 text-terracotta",
  paella: "bg-valencia/15 text-valencia",
  drinks: "bg-mare/15 text-mare",
}

export default function FoodChecklist() {
  const { foodChecked, toggleFoodCheck } = useSync()
  const totalChecked = Object.values(foodChecked).filter(Boolean).length

  return (
    <div>
      {/* Counter */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-sm font-bold text-notte">
          🍽️ Food Spots
        </h3>
        <span className="text-xs font-semibold text-valencia bg-valencia/10 px-2.5 py-1 rounded-full">
          {totalChecked}/{foodChecklist.length}
        </span>
      </div>

      <div className="px-4 space-y-2">
        {foodChecklist.map((item, i) => {
          const isOn = foodChecked[item.id]
          const typeInfo = foodTypes[item.type]
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleFoodCheck(item.id)}
              className={`bg-surface rounded-2xl border p-3 cursor-pointer transition-colors ${
                isOn ? "border-valencia/25 bg-valencia/5" : "border-notte/5"
              } shadow-sm`}
            >
              <div className="flex items-start gap-3">
                {isOn ? (
                  <CheckCircle2 className="w-5 h-5 text-valencia flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-notte/15 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`text-sm font-bold ${isOn ? "text-valencia" : "text-notte"}`}
                    >
                      {item.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeBadgeColors[item.type] || ""}`}
                    >
                      {typeInfo?.label}
                    </span>
                    <span className="text-[10px] text-notte/30">
                      G{item.day}
                    </span>
                  </div>
                  <p className="text-xs text-notte/45 mt-0.5">{item.tip}</p>
                  {isOn && item.photoTip && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-start gap-1.5 bg-mare/8 rounded-xl px-2.5 py-2 mt-2">
                        <Camera className="w-3 h-3 text-mare flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-notte/55 leading-relaxed">
                          {item.photoTip}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
