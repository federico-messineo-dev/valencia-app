import { Palmtree } from "lucide-react"
import { motion } from "framer-motion"
import SyncBadge from "./SyncBadge"

export default function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-surface/90 backdrop-blur-xl border-b border-notte/8 px-4 py-3 sticky top-0 z-50"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-valencia to-peach rounded-2xl flex items-center justify-center shadow-lg shadow-valencia/20">
            <Palmtree className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="text-base font-bold text-notte leading-tight tracking-tight">
              Valencia
            </h1>
            <p className="text-[10px] text-notte/45 leading-none font-medium">
              Federico & Gaia ❤️
            </p>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <SyncBadge />
        </div>
      </div>
    </motion.header>
  )
}
