import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PhotoCarousel from "./PhotoCarousel"
import FoodChecklist from "./FoodChecklist"

export default function FoodFotoTab() {
  const [activeSection, setActiveSection] = useState("food")

  return (
    <div className="pb-24">
      {/* Section Toggle */}
      <div className="px-4 pt-3 pb-4">
        <div className="flex bg-notte/5 rounded-2xl p-1">
          {[
            { id: "food", label: "🍽️ Food" },
            { id: "foto", label: "📸 Foto" },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold relative"
            >
              {activeSection === tab.id && (
                <motion.div
                  layoutId="foodfoto-bg"
                  className={`absolute inset-0 rounded-xl shadow-sm ${
                    tab.id === "food"
                      ? "bg-gradient-to-r from-valencia to-peach text-white"
                      : "bg-gradient-to-r from-mare to-[#0080cc] text-white"
                  }`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  activeSection !== tab.id ? "text-notte/50" : ""
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: activeSection === "food" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeSection === "food" ? 20 : -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeSection === "food" && <FoodChecklist />}
          {activeSection === "foto" && <PhotoCarousel />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
