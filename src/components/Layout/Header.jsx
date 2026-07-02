import { Palmtree, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import SyncBadge from "./SyncBadge"

export default function Header() {
  const handleRefresh = () => {
    window.location.reload(true)
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-surface/90 backdrop-blur-xl border-b border-notte/8 px-4 sticky top-0 z-50"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)", paddingBottom: "12px" }}
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
        <div className="flex-1 flex items-center justify-end gap-1.5">
          <SyncBadge />
          <motion.button
            whileTap={{ scale: 0.85, rotate: -180 }}
            onClick={handleRefresh}
            className="p-1.5 rounded-full text-notte/20 hover:text-notte/40 hover:bg-notte/5 transition-colors"
            aria-label="Aggiorna pagina"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
