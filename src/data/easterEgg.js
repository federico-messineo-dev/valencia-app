export const STAR_STOPS = [
  { stopId: "d2-s1", dayIndex: 1, hint: "Horchatería Santa Catalina" },
  { stopId: "d1-s7", dayIndex: 0, hint: "Plaza de la Virgen" },
  { stopId: "d3-s7", dayIndex: 2, hint: "Albufera" },
  { stopId: "d4-s3", dayIndex: 3, hint: "Port Saplaya" },
  { stopId: "d5-s5", dayIndex: 4, hint: "Turia" },
]

export const PUZZLES = [
  {
    id: 0,
    type: "riddle",
    question: "Sono il punto dove il mare incontra il cielo. Non posso essere toccato, ma posso essere visto da entrambi. Cosa sono?",
    options: [
      { text: "L'orizzonte", correct: true },
      { text: "Il tramonto", correct: false },
      { text: "Il mare", correct: false },
    ],
    successMessage: "Esatto! L'orizzonte... il punto dove tutto comincia.",
    starLabel: "Orizzonte",
  },
  {
    id: 1,
    type: "memory",
    question: "Dove ci siamo baciati per la prima volta?",
    options: [
      { text: "Al mare", correct: false },
      { text: "Sul divano a casa", correct: false },
      { text: "A un pub", correct: true },
    ],
    successMessage: "Già...anche se purtroppo era il 24",
    starLabel: "Primo Bacio",
  },
  {
    id: 2,
    type: "memory",
    question: "Qual è il nome della canzone della nostra storia alla mostra dei fiori?",
    options: [
      { text: "Where's My Love", correct: true },
      { text: "La La Land", correct: false },
      { text: "City of Stars", correct: false },
    ],
    successMessage: "Where's My Love... quella che ci haunito.",
    starLabel: "Nostra Canzone",
  },
  {
    id: 3,
    type: "riddle",
    question: "Non ha mani, ma può aprire cuori. Non ha voce, ma può raccontare tutto. Non ha tempo, ma può durare per sempre. Cosa è?",
    options: [
      { text: "Una canzone", correct: false },
      { text: "Un ricordo", correct: true },
      { text: "Una foto", correct: false },
    ],
    successMessage: "Un ricordo... e ne stiamo creando di belli.",
    starLabel: "Ricordo",
  },
  {
    id: 4,
    type: "final",
    question: "Una parola. Quella che descrive tutto questo: noi, Valencia, questi momenti. Quale parola scegli?",
    options: [
      { text: "Amore", correct: true },
      { text: "Vacanza", correct: false },
      { text: "Amicizia", correct: false },
    ],
    successMessage: "Amore. L'unica risposta che contava.",
    starLabel: "Amore",
  },
]

export const CONSTELLATION_POINTS = [
  { x: 150, y: 80 },
  { x: 280, y: 120 },
  { x: 200, y: 200 },
  { x: 120, y: 180 },
  { x: 300, y: 60 },
]

export const CONSTELLATION_LINES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 3],
  [0, 2],
  [1, 3],
]

export const HEART_POINTS = [
  { x: 200, y: 100 },
  { x: 250, y: 60 },
  { x: 300, y: 80 },
  { x: 300, y: 140 },
  { x: 200, y: 220 },
  { x: 100, y: 140 },
  { x: 100, y: 80 },
  { x: 150, y: 60 },
]
