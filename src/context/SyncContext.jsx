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
      return JSON.parse(localStorage.getItem("expenses")) || []
    } catch {
      return []
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
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setConnectionStatus("connected")
        } else if (status === "CHANNEL_ERROR") {
          setConnectionStatus("fallback")
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const broadcastUpdate = useCallback(
    (table, data) => {
      if (connectionStatus === "connected") {
        supabase.channel("valencia-sync").send({
          type: "broadcast",
          event: "sync_update",
          payload: { table, data },
        })
      }
    },
    [connectionStatus]
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
    (expense) => {
      setExpenses((prev) => {
        const next = [...prev, { ...expense, id: Date.now(), createdAt: new Date().toISOString() }]
        broadcastUpdate("budget_expenses", next)
        return next
      })
    },
    [broadcastUpdate]
  )

  const deleteExpense = useCallback(
    (id) => {
      setExpenses((prev) => {
        const next = prev.filter((e) => e.id !== id)
        broadcastUpdate("budget_expenses", next)
        return next
      })
    },
    [broadcastUpdate]
  )

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
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
      connectionStatus,
      toggleFoodItem,
      togglePhotoItem,
      toggleLazyMode,
      updateFoodVote,
      addExpense,
      deleteExpense,
    }),
    [
      foodChecked,
      photoChecked,
      lazyMode,
      foodVotes,
      expenses,
      totalSpent,
      connectionStatus,
      toggleFoodItem,
      togglePhotoItem,
      toggleLazyMode,
      updateFoodVote,
      addExpense,
      deleteExpense,
    ]
  )

  return <SyncContext.Provider value={contextValue}>{children}</SyncContext.Provider>
}

export default SyncContext
