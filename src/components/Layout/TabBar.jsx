import { motion } from "framer-motion"
import { Map, Camera, Wallet } from "lucide-react"

const tabs = [
  { id: "itinerary", label: "Itinerario", icon: Map },
  { id: "foodfoto", label: "Food & Foto", icon: Camera },
  { id: "budget", label: "Budget", icon: Wallet },
]

export default function TabBar({ active, onChange }) {
  return (
    <div
      className="fixed inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
    >
      <motion.nav
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
        className="flex items-center gap-1 bg-notte/75 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/20 rounded-full px-2 py-1.5 pointer-events-auto"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <motion.button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              whileTap={{ scale: 0.92 }}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                isActive ? "text-white" : "text-white/50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-gradient-to-r from-valencia to-peach rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                {tab.label}
              </span>
            </motion.button>
          )
        })}
      </motion.nav>
    </div>
  )
}
