import { motion } from "framer-motion"

const RADIUS = 58
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function CircularProgress({ spent, max = 200 }) {
  const percentage = Math.min((spent / max) * 100, 100)
  const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE

  const getColor = () => {
    if (percentage < 40) return { stroke: "#00A3FF", label: "text-mare" }
    if (percentage < 75) return { stroke: "#FF7A00", label: "text-valencia" }
    return { stroke: "#D9531E", label: "text-terracotta" }
  }

  const color = getColor()

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        {/* Background circle */}
        <circle
          cx="64"
          cy="64"
          r={RADIUS}
          fill="none"
          stroke="#F3F0EB"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx="64"
          cy="64"
          r={RADIUS}
          fill="none"
          stroke={color.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-black ${color.label}`}>
          {spent}€
        </span>
        <span className="text-[10px] text-notte/40 font-medium">
          di {max}€
        </span>
      </div>
    </div>
  )
}
