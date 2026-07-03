import { motion } from "framer-motion"
import { RotateCcw, Plus } from "lucide-react"
import { days } from "../../data/itinerary"
import { formatCurrency } from "../../utils/helpers"
import { useSync } from "../../hooks/useSync"
import CircularProgress from "./CircularProgress"

const dayEmojis = ["☀️", "🧺", "🌅", "🏖️", "👋"]

const splitOptions = [
  { id: "coppia", label: "Coppia", icon: "💑", description: "Diviso a metà" },
  { id: "fede", label: "Solo Fede", icon: "🧑", description: "Solo Federico" },
  { id: "gaia", label: "Solo Gaia", icon: "👩", description: "Solo Gaia" },
]

export default function BudgetTab() {
  const { expenses, addExpense, removeExpense, resetDayExpenses, resetAllExpenses } = useSync()

  const allExpenses = Object.values(expenses).flat()
  const totalAll = allExpenses.reduce((a, e) => a + e.amount, 0)

  const fedeTotal = allExpenses
    .filter((e) => e.split === "fede" || e.split === "coppia")
    .reduce((a, e) => a + (e.split === "coppia" ? e.amount / 2 : e.amount), 0)

  const gaiaTotal = allExpenses
    .filter((e) => e.split === "gaia" || e.split === "coppia")
    .reduce((a, e) => a + (e.split === "coppia" ? e.amount / 2 : e.amount), 0)

  const diff = fedeTotal - gaiaTotal
  const fedeOwes = diff > 0 ? 0 : Math.abs(diff)
  const gaiaOwes = diff > 0 ? diff : 0

  return (
    <div className="pb-24">
      {/* Circular Progress + Total */}
      <div className="px-4 pt-3 pb-4">
        <div className="bg-gradient-to-br from-notte via-notte/95 to-notte/80 rounded-3xl p-5 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-valencia/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-mare/10 rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 text-xs font-medium">Totale Viaggio</p>
                <p className="text-3xl font-black tracking-tight">
                  {formatCurrency(totalAll)}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={resetAllExpenses}
                className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-white/70" />
              </motion.button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/10 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧑</span>
                  <div>
                    <p className="text-[10px] text-white/50">Speso da Federico</p>
                    <p className="text-lg font-bold">{formatCurrency(fedeTotal)}</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-white/10 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👩</span>
                  <div>
                    <p className="text-[10px] text-white/50">Speso da Gaia</p>
                    <p className="text-lg font-bold">{formatCurrency(gaiaTotal)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance */}
            {diff !== 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 bg-valencia/20 rounded-2xl px-4 py-2.5 flex items-center justify-between"
              >
                <span className="text-[11px] text-white/80 font-medium">
                  {gaiaOwes > 0 ? (
                    <>👩 Gaia deve a 🧑 Federico</>
                  ) : (
                    <>🧑 Federico deve a 👩 Gaia</>
                  )}
                </span>
                <span className="text-sm font-black text-valencia">
                  {formatCurrency(Math.max(fedeOwes, gaiaOwes))}
                </span>
              </motion.div>
            )}

            <div className="mt-3 flex justify-center">
              <CircularProgress spent={totalAll} max={200} />
            </div>
          </div>
        </div>
      </div>

      {/* Day Cards */}
      <div className="px-4 space-y-2">
        <p className="text-xs font-bold text-notte/40 mb-1 px-1">PER GIORNO</p>
        {days.map((day) => {
          const dayExpenses = expenses[day.id] || []
          const dayTotal = dayExpenses.reduce((a, e) => a + e.amount, 0)
          return (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-2xl border border-notte/5 p-3 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{dayEmojis[day.id - 1]}</span>
                  <div>
                    <h3 className="text-sm font-bold text-notte">
                      Giorno {day.id}
                    </h3>
                    <p className="text-[10px] text-notte/35">{day.title}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <p className="text-sm font-black text-valencia">
                      {formatCurrency(dayTotal)}
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => resetDayExpenses(day.id)}
                    className="p-1.5 bg-notte/5 rounded-lg hover:bg-notte/10 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-notte/30" />
                  </motion.button>
                </div>
              </div>

              {/* Expense list */}
              {dayExpenses.length > 0 && (
                <div className="space-y-1 mb-2">
                  {dayExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between bg-sand/60 rounded-xl px-2.5 py-1.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">
                          {exp.split === "coppia" ? "💑" : exp.split === "fede" ? "🧑" : "👩"}
                        </span>
                        <span className="text-[10px] text-notte/50 font-medium">
                          {exp.split === "coppia" ? "÷2" : exp.split === "fede" ? "Fede" : "Gaia"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-valencia">
                          {formatCurrency(exp.amount)}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeExpense(day.id, exp.id)}
                          className="text-notte/20 hover:text-red-400"
                        >
                          <Plus className="w-3 h-3 rotate-45" />
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Split selector + amount buttons */}
              <div className="space-y-1.5">
                {splitOptions.map((split) => (
                  <div key={split.id} className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 bg-sand/60 rounded-lg px-2 py-1 w-24">
                      <span className="text-xs">{split.icon}</span>
                      <span className="text-[10px] font-medium text-notte/50">{split.label}</span>
                    </div>
                    {[1, 5, 10].map((amount) => (
                      <motion.button
                        key={amount}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addExpense(day.id, amount, split.id)}
                        className="flex-1 py-1.5 bg-notte/5 rounded-xl text-[11px] font-bold text-notte/50 hover:bg-valencia/10 hover:text-valencia transition-colors"
                      >
                        +{amount}€
                      </motion.button>
                    ))}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addExpense(day.id, -5, split.id)}
                      className="py-1.5 px-2 bg-notte/5 rounded-xl text-[11px] font-bold text-notte/30 hover:bg-notte/10 transition-colors"
                    >
                      <Plus className="w-3 h-3 rotate-45" />
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
