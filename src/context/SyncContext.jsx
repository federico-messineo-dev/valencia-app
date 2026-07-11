import { useState, useCallback, useEffect, useMemo } from "react"
import { supabase, isSupabaseConfigured } from "../supabaseClient"
import SyncContext from "./SyncContextInstance"

export function SyncProvider({ children }) {
  const [foodChecked, setFoodChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("foodChecked")) || {}
    } catch {
      return {}
    }
  })

  const [photoChecked, setPhotoChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("photoChecked")) || {}
    } catch {
      return {}
    }
  })

  const [lazyMode, setLazyMode] = useState(() => {
    try {
      return localStorage.getItem("lazyMode") || "sveglia"
    } catch {
      return "sveglia"
    }
  })

  const [foodVotes, setFoodVotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("foodVotes")) || {}
    } catch {
      return {}
    }
  })

  const [expenses, setExpenses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("expenses")) || {}
    } catch {
      return {}
    }
  })

  const [checkedStops, setCheckedStops] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("checkedStops")) || {}
    } catch {
      return {}
    }
  })

  const [connectionStatus, setConnectionStatus] = useState(
    isSupabaseConfigured() ? "connecting" : "local"
  )

  useEffect(() => {
    localStorage.setItem("foodChecked", JSON.stringify(foodChecked))
  }, [foodChecked])

  useEffect(() => {
    localStorage.setItem("photoChecked", JSON.stringify(photoChecked))
  }, [photoChecked])

  useEffect(() => {
    localStorage.setItem("lazyMode", lazyMode)
  }, [lazyMode])

  useEffect(() => {
    localStorage.setItem("foodVotes", JSON.stringify(foodVotes))
  }, [foodVotes])

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem("checkedStops", JSON.stringify(checkedStops))
  }, [checkedStops])

  useEffect(() => {
    if (!isSupabaseConfigured()) return

    const channel = supabase
      .channel("valencia-sync")
      .on("broadcast", { event: "sync_update" }, (payload) => {
        const { table, data } = payload.payload
        if (table === "checklist_items") {
          setFoodChecked((prev) => ({ ...prev, ...data }))
        } else if (table === "photo_items") {
          setPhotoChecked((prev) => ({ ...prev, ...data }))
        } else if (table === "lazy_mode") {
          setLazyMode(data.mode)
        } else if (table === "food_votes") {
          setFoodVotes((prev) => ({ ...prev, ...data }))
        } else if (table === "budget_expenses") {
          setExpenses(data)
        } else if (table === "checked_stops") {
          setCheckedStops((prev) => ({ ...prev, ...data }))
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setConnectionStatus("connected")
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setConnectionStatus("fallback")
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const broadcastUpdate = useCallback(
    (table, data) => {
      if (!isSupabaseConfigured()) return
      supabase.channel("valencia-sync").send({
        type: "broadcast",
        event: "sync_update",
        payload: { table, data },
      })
    },
    []
  )

  const toggleFoodItem = useCallback(
    (itemId) => {
      setFoodChecked((prev) => {
        const next = { ...prev, [itemId]: !prev[itemId] }
        broadcastUpdate("checklist_items", { [itemId]: next[itemId] })
        return next
      })
    },
    [broadcastUpdate]
  )

  const togglePhotoItem = useCallback(
    (itemId) => {
      setPhotoChecked((prev) => {
        const next = { ...prev, [itemId]: !prev[itemId] }
        broadcastUpdate("photo_items", { [itemId]: next[itemId] })
        return next
      })
    },
    [broadcastUpdate]
  )

  const toggleLazyMode = useCallback(() => {
    setLazyMode((prev) => {
      const next = prev === "sveglia" ? "lazy" : "sveglia"
      broadcastUpdate("lazy_mode", { mode: next })
      return next
    })
  }, [broadcastUpdate])

  const updateFoodVote = useCallback(
    (person, votes) => {
      setFoodVotes((prev) => {
        const next = { ...prev, [person]: votes }
        broadcastUpdate("food_votes", { [person]: votes })
        return next
      })
    },
    [broadcastUpdate]
  )

  const addExpense = useCallback(
    (dayId, amount, split) => {
      setExpenses((prev) => {
        const dayList = prev[dayId] || []
        const expense = { id: Date.now(), amount, split }
        const next = { ...prev, [dayId]: [...dayList, expense] }
        broadcastUpdate("budget_expenses", next)
        return next
      })
    },
    [broadcastUpdate]
  )

  const removeExpense = useCallback(
    (dayId, expenseId) => {
      setExpenses((prev) => {
        const dayList = (prev[dayId] || []).filter((e) => e.id !== expenseId)
        const next = { ...prev, [dayId]: dayList }
        broadcastUpdate("budget_expenses", next)
        return next
      })
    },
    [broadcastUpdate]
  )

  const resetDayExpenses = useCallback(
    (dayId) => {
      setExpenses((prev) => {
        const next = { ...prev, [dayId]: [] }
        broadcastUpdate("budget_expenses", next)
        return next
      })
    },
    [broadcastUpdate]
  )

  const resetAllExpenses = useCallback(() => {
    setExpenses({})
    broadcastUpdate("budget_expenses", {})
  }, [broadcastUpdate])

  const toggleStopChecked = useCallback(
    (stopId) => {
      setCheckedStops((prev) => {
        const next = { ...prev, [stopId]: !prev[stopId] }
        broadcastUpdate("checked_stops", { [stopId]: next[stopId] })
        return next
      })
    },
    [broadcastUpdate]
  )

  const totalSpent = useMemo(
    () => Object.values(expenses).flat().reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [expenses]
  )

  const contextValue = useMemo(
    () => ({
      foodChecked,
      photoChecked,
      lazyMode,
      foodVotes,
      expenses,
      totalSpent,
      checkedStops,
      connectionStatus,
      toggleFoodItem,
      togglePhotoItem,
      toggleLazyMode,
      updateFoodVote,
      addExpense,
      removeExpense,
      resetDayExpenses,
      resetAllExpenses,
      toggleStopChecked,
    }),
    [
      foodChecked,
      photoChecked,
      lazyMode,
      foodVotes,
      expenses,
      totalSpent,
      checkedStops,
      connectionStatus,
      toggleFoodItem,
      togglePhotoItem,
      toggleLazyMode,
      updateFoodVote,
      addExpense,
      removeExpense,
      resetDayExpenses,
      resetAllExpenses,
      toggleStopChecked,
    ]
  )

  return <SyncContext.Provider value={contextValue}>{children}</SyncContext.Provider>
}

export default SyncContext
