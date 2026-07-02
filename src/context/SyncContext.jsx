import { createContext, useState, useEffect, useCallback, useRef, startTransition } from "react"
import { supabase } from "../supabaseClient"
import { foodChecklist, photoChecklist } from "../data/checklist"
import { days } from "../data/itinerary"

const SyncContext = createContext(null)

export { SyncContext }

const LS_KEYS = {
  foodChecked: "valencia-food-checked",
  photoChecked: "valencia-photo-checked",
  lazyMode: "valencia-lazy-mode",
  foodVotes: "valencia-food-votes",
  foodDone: "valencia-food-done",
  expenses: "valencia-expenses",
}

function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* silent */
  }
}

function getDefaultFoodChecked() {
  return Object.fromEntries(foodChecklist.map((f) => [f.id, false]))
}

function getDefaultPhotoChecked() {
  return Object.fromEntries(photoChecklist.map((p) => [p.id, false]))
}

function getDefaultLazyMode() {
  return Object.fromEntries(days.map((d) => [d.id, false]))
}

function getDefaultFoodVotes() {
  return {
    fede: { gusto: 0, location: 0, abbiocco: 0 },
    gaia: { gusto: 0, location: 0, abbiocco: 0 },
  }
}

function getDefaultFoodDone() {
  return { fede: false, gaia: false }
}

function getDefaultExpenses() {
  return Object.fromEntries(days.map((d) => [d.id, []]))
}

export function SyncProvider({ children }) {
  const [connectionStatus, setConnectionStatus] = useState("connecting")
  const [foodChecked, setFoodChecked] = useState(() =>
    loadLS(LS_KEYS.foodChecked, getDefaultFoodChecked())
  )
  const [photoChecked, setPhotoChecked] = useState(() =>
    loadLS(LS_KEYS.photoChecked, getDefaultPhotoChecked())
  )
  const [lazyMode, setLazyMode] = useState(() =>
    loadLS(LS_KEYS.lazyMode, getDefaultLazyMode())
  )
  const [foodVotes, setFoodVotes] = useState(() =>
    loadLS(LS_KEYS.foodVotes, getDefaultFoodVotes())
  )
  const [foodDone, setFoodDone] = useState(() =>
    loadLS(LS_KEYS.foodDone, getDefaultFoodDone())
  )
  const [foodRevealed, setFoodRevealed] = useState(false)
  const [expenses, setExpenses] = useState(() =>
    loadLS(LS_KEYS.expenses, getDefaultExpenses())
  )

  const subscriptions = useRef([])

  const isConnected = connectionStatus === "cloud"

  // ─── LOCALStorageSync ───────────────────────────────────────
  useEffect(() => saveLS(LS_KEYS.foodChecked, foodChecked), [foodChecked])
  useEffect(() => saveLS(LS_KEYS.photoChecked, photoChecked), [photoChecked])
  useEffect(() => saveLS(LS_KEYS.lazyMode, lazyMode), [lazyMode])
  useEffect(() => saveLS(LS_KEYS.foodVotes, foodVotes), [foodVotes])
  useEffect(() => saveLS(LS_KEYS.foodDone, foodDone), [foodDone])
  useEffect(() => saveLS(LS_KEYS.expenses, expenses), [expenses])

  // ─── CHECKLIST: food ────────────────────────────────────────
  const toggleFoodCheck = useCallback(
    async (id) => {
      const newVal = !foodChecked[id]
      setFoodChecked((p) => ({ ...p, [id]: newVal }))
      if (supabase) {
        await supabase
          .from("checklist_items")
          .upsert({ id, checked: newVal }, { onConflict: "id" })
      }
    },
    [foodChecked]
  )

  // ─── CHECKLIST: photo ───────────────────────────────────────
  const togglePhotoCheck = useCallback(
    async (id) => {
      const newVal = !photoChecked[id]
      setPhotoChecked((p) => ({ ...p, [id]: newVal }))
      if (supabase) {
        await supabase
          .from("checklist_items")
          .upsert({ id, checked: newVal }, { onConflict: "id" })
      }
    },
    [photoChecked]
  )

  // ─── LAZY MODE ──────────────────────────────────────────────
  const toggleLazyMode = useCallback(
    async (dayId) => {
      const newVal = !lazyMode[dayId]
      setLazyMode((p) => ({ ...p, [dayId]: newVal }))
      if (supabase) {
        await supabase
          .from("lazy_mode")
          .upsert({ day_id: dayId, lazy: newVal }, { onConflict: "day_id" })
      }
    },
    [lazyMode]
  )

  // ─── FOOD RATING ────────────────────────────────────────────
  const setFoodVote = useCallback(
    async (userId, category, value) => {
      setFoodVotes((p) => ({
        ...p,
        [userId]: { ...p[userId], [category]: value },
      }))
      if (supabase) {
        const current = foodVotes[userId]
        await supabase.from("food_votes").upsert(
          {
            user_id: userId,
            [category]: value,
            gusto: category === "gusto" ? value : current.gusto,
            location: category === "location" ? value : current.location,
            abbiocco: category === "abbiocco" ? value : current.abbiocco,
          },
          { onConflict: "user_id" }
        )
      }
    },
    [foodVotes]
  )

  const setFoodDoneFn = useCallback(
    async (userId, done) => {
      setFoodDone((p) => ({ ...p, [userId]: done }))
      if (supabase) {
        await supabase
          .from("food_votes")
          .upsert({ user_id: userId, done }, { onConflict: "user_id" })
      }
    },
    []
  )

  const setFoodRevealedFn = useCallback((val) => {
    setFoodRevealed(val)
  }, [])

  // ─── BUDGET ─────────────────────────────────────────────────
  const addExpense = useCallback(
    async (dayId, amount, split) => {
      const newExp = { id: Date.now(), amount, split }
      setExpenses((p) => ({ ...p, [dayId]: [...p[dayId], newExp] }))
      if (supabase) {
        await supabase.from("budget_expenses").insert({
          day_id: dayId,
          amount,
          split,
        })
      }
    },
    []
  )

  const removeExpense = useCallback(
    async (dayId, expenseId) => {
      setExpenses((p) => ({
        ...p,
        [dayId]: p[dayId].filter((e) => e.id !== expenseId),
      }))
      if (supabase) {
        await supabase
          .from("budget_expenses")
          .delete()
          .eq("day_id", dayId)
          .eq("amount", expenses[dayId]?.find((e) => e.id === expenseId)?.amount)
      }
    },
    [expenses]
  )

  const resetDayExpenses = useCallback(
    async (dayId) => {
      setExpenses((p) => ({ ...p, [dayId]: [] }))
      if (supabase) {
        await supabase.from("budget_expenses").delete().eq("day_id", dayId)
      }
    },
    []
  )

  const resetAllExpenses = useCallback(async () => {
    setExpenses(getDefaultExpenses())
    if (supabase) {
      await supabase.from("budget_expenses").delete().neq("day_id", -1)
    }
  }, [])

  // ─── SUPABASE CONNECTION + INITIAL FETCH + SUBSCRIPTIONS ────
  useEffect(() => {
    if (!supabase) {
      startTransition(() => setConnectionStatus("local"))
      return
    }

    let mounted = true

    async function init() {
      try {
        // Test connection
        const { error } = await supabase.from("checklist_items").select("id").limit(1)
        if (error) throw error

        if (!mounted) return
        setConnectionStatus("cloud")

        // ── Fetch initial data ──
        const [checklistRes, lazyRes, votesRes, expensesRes] = await Promise.all([
          supabase.from("checklist_items").select("id, checked"),
          supabase.from("lazy_mode").select("day_id, lazy"),
          supabase.from("food_votes").select("user_id, gusto, location, abbiocco, done"),
          supabase.from("budget_expenses").select("id, day_id, amount, split"),
        ])

        if (checklistRes.data) {
          setFoodChecked((prev) => {
            const next = { ...prev }
            checklistRes.data.forEach((r) => {
              if (r.id in next) next[r.id] = r.checked
            })
            return next
          })
          setPhotoChecked((prev) => {
            const next = { ...prev }
            checklistRes.data.forEach((r) => {
              if (r.id in next) next[r.id] = r.checked
            })
            return next
          })
        }

        if (lazyRes.data) {
          setLazyMode((prev) => {
            const next = { ...prev }
            lazyRes.data.forEach((r) => {
              if (r.day_id in next) next[r.day_id] = r.lazy
            })
            return next
          })
        }

        if (votesRes.data) {
          const newVotes = getDefaultFoodVotes()
          const newDone = getDefaultFoodDone()
          votesRes.data.forEach((r) => {
            if (r.user_id in newVotes) {
              newVotes[r.user_id] = {
                gusto: r.gusto,
                location: r.location,
                abbiocco: r.abbiocco,
              }
              newDone[r.user_id] = r.done
            }
          })
          setFoodVotes(newVotes)
          setFoodDone(newDone)
        }

        if (expensesRes.data) {
          const newExp = getDefaultExpenses()
          expensesRes.data.forEach((r) => {
            if (r.day_id in newExp) {
              newExp[r.day_id].push({ id: r.id, amount: r.amount, split: r.split })
            }
          })
          setExpenses(newExp)
        }

        // ── Subscriptions ──
        const checklistSub = supabase
          .channel("checklist-changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "checklist_items" },
            (payload) => {
              if (payload.new) {
                const { id, checked: val } = payload.new
                setFoodChecked((prev) => (id in prev ? { ...prev, [id]: val } : prev))
                setPhotoChecked((prev) => (id in prev ? { ...prev, [id]: val } : prev))
              }
            }
          )
          .subscribe()

        const lazySub = supabase
          .channel("lazy-changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "lazy_mode" },
            (payload) => {
              if (payload.new) {
                const { day_id, lazy } = payload.new
                setLazyMode((prev) => ({ ...prev, [day_id]: lazy }))
              }
            }
          )
          .subscribe()

        const votesSub = supabase
          .channel("votes-changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "food_votes" },
            (payload) => {
              if (payload.new) {
                const { user_id, gusto, location, abbiocco, done } = payload.new
                setFoodVotes((prev) => ({
                  ...prev,
                  [user_id]: { gusto, location, abbiocco },
                }))
                setFoodDone((prev) => ({ ...prev, [user_id]: done }))
              }
            }
          )
          .subscribe()

        const expensesSub = supabase
          .channel("expenses-changes")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "budget_expenses" },
            (payload) => {
              if (payload.new) {
                const { day_id, amount, split } = payload.new
                setExpenses((prev) => ({
                  ...prev,
                  [day_id]: [...(prev[day_id] || []), { id: payload.new.id, amount, split }],
                }))
              }
            }
          )
          .on(
            "postgres_changes",
            { event: "DELETE", schema: "public", table: "budget_expenses" },
            () => {
              // Refetch on delete for simplicity (rare operation)
              supabase.from("budget_expenses").select("id, day_id, amount, split").then(({ data }) => {
                if (data) {
                  const newExp = getDefaultExpenses()
                  data.forEach((r) => {
                    if (r.day_id in newExp) {
                      newExp[r.day_id].push({ id: r.id, amount: r.amount, split: r.split })
                    }
                  })
                  setExpenses(newExp)
                }
              })
            }
          )
          .subscribe()

        subscriptions.current = [checklistSub, lazySub, votesSub, expensesSub]
      } catch {
        if (mounted) startTransition(() => setConnectionStatus("local"))
      }
    }

    init()

    return () => {
      mounted = false
      subscriptions.current.forEach((sub) => {
        supabase?.removeChannel(sub)
      })
      subscriptions.current = []
    }
  }, [])

  const value = {
    isConnected,
    connectionStatus,
    foodChecked,
    photoChecked,
    toggleFoodCheck,
    togglePhotoCheck,
    lazyMode,
    toggleLazyMode,
    foodVotes,
    foodDone,
    foodRevealed,
    setFoodVote,
    setFoodDone: setFoodDoneFn,
    setFoodRevealed: setFoodRevealedFn,
    expenses,
    addExpense,
    removeExpense,
    resetDayExpenses,
    resetAllExpenses,
  }

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>
}
