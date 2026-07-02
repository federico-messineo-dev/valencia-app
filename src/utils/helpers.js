export function getLazyItinerary(day) {
  if (!day || !day.stops) return []
  return day.stops.filter((s) => !s.lazySkip || !s.lazyNote)
}

export function getOriginalCount(day) {
  return day?.stops?.length || 0
}

export function getLazyCount(day) {
  return getLazyItinerary(day).length
}

export function calculateBudget(stops) {
  return stops.reduce((sum, s) => sum + (s.budgetAmount || 0), 0)
}

export function calculatePerPerson(total, people = 2) {
  return Math.ceil(total / people)
}

export function formatCurrency(amount) {
  return `${amount}€`
}
