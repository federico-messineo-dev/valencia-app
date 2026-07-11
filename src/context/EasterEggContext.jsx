import { useState, useCallback, useEffect, useMemo, createContext, useContext } from "react"

const EasterEggContext = createContext(null)

const TOTAL_STARS = 5

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("easterEgg"))
    if (saved && typeof saved === "object") return saved
  } catch {
    // no saved state
  }
  return null
}

export function EasterEggProvider({ children }) {
  const [started, setStarted] = useState(() => {
    const s = loadState()
    return s?.started ?? false
  })

  const [solvedStars, setSolvedStars] = useState(() => {
    const s = loadState()
    return s?.solvedStars ?? []
  })

  const [currentPuzzle, setCurrentPuzzle] = useState(null)

  const [showModal, setShowModal] = useState(false)

  const [showFinal, setShowFinal] = useState(false)

  useEffect(() => {
    localStorage.setItem(
      "easterEgg",
      JSON.stringify({ started, solvedStars })
    )
  }, [started, solvedStars])

  const startEasterEgg = useCallback(() => {
    setStarted(true)
    setShowModal(true)
    setCurrentPuzzle(0)
  }, [])

  const solvePuzzle = useCallback(
    (puzzleId) => {
      setSolvedStars((prev) => {
        if (prev.includes(puzzleId)) return prev
        const next = [...prev, puzzleId]
        if (next.length >= TOTAL_STARS) {
          setTimeout(() => {
            setShowFinal(true)
            setCurrentPuzzle(null)
          }, 1500)
        }
        return next
      })
    },
    []
  )

  const openPuzzle = useCallback((puzzleId) => {
    setCurrentPuzzle(puzzleId)
    setShowModal(true)
  }, [])

  const closeModal = useCallback(() => {
    setShowModal(false)
    setCurrentPuzzle(null)
  }, [])

  const allSolved = solvedStars.length >= TOTAL_STARS

  const value = useMemo(
    () => ({
      started,
      solvedStars,
      currentPuzzle,
      showModal,
      showFinal,
      allSolved,
      totalStars: TOTAL_STARS,
      startEasterEgg,
      solvePuzzle,
      openPuzzle,
      closeModal,
      setShowFinal,
    }),
    [
      started,
      solvedStars,
      currentPuzzle,
      showModal,
      showFinal,
      allSolved,
      startEasterEgg,
      solvePuzzle,
      openPuzzle,
      closeModal,
    ]
  )

  return (
    <EasterEggContext.Provider value={value}>
      {children}
    </EasterEggContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEasterEgg() {
  const ctx = useContext(EasterEggContext)
  if (!ctx) throw new Error("useEasterEgg must be used within EasterEggProvider")
  return ctx
}

export default EasterEggContext
