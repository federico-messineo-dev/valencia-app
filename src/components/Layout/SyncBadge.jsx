import { motion } from "framer-motion"
import { Cloud, Smartphone, Loader2 } from "lucide-react"
import { useSync } from "../../hooks/useSync"

export default function SyncBadge() {
  const { connectionStatus } = useSync()

  const config = {
    connected: {
      icon: Cloud,
      label: "Sincronizzato",
      bg: "bg-emerald-500/10",
      text: "text-emerald-600",
      dot: "bg-emerald-500",
    },
    local: {
      icon: Smartphone,
      label: "Modalità Locale",
      bg: "bg-valencia/10",
      text: "text-valencia",
      dot: "bg-valencia",
    },
    connecting: {
      icon: Loader2,
      label: "Connessione...",
      bg: "bg-notte/5",
      text: "text-notte/40",
      dot: "bg-notte/30",
    },
    fallback: {
      icon: Loader2,
      label: "Riconnessione...",
      bg: "bg-notte/5",
      text: "text-notte/40",
      dot: "bg-notte/30",
    },
  }

  const c = config[connectionStatus] || config.connecting
  const Icon = c.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 ${c.bg} ${c.text} px-2 py-0.5 rounded-full`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${connectionStatus === "connecting" ? "animate-pulse" : ""}`} />
      <Icon className={`w-3 h-3 ${connectionStatus === "connecting" ? "animate-spin" : ""}`} />
      <span className="text-[9px] font-semibold hidden sm:inline">{c.label}</span>
    </motion.div>
  )
}
