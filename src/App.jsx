import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { SyncProvider } from "./context/SyncContext"
import { EasterEggProvider } from "./context/EasterEggContext"
import Header from "./components/Layout/Header"
import TabBar from "./components/Layout/TabBar"
import ItineraryTab from "./components/Itinerary/ItineraryTab"
import FoodFotoTab from "./components/FoodFoto/FoodFotoTab"
import BudgetTab from "./components/Budget/BudgetTab"
import EasterEggModal from "./components/EasterEgg/EasterEggModal"

export default function App() {
  const [activeTab, setActiveTab] = useState("itinerary")

  return (
    <SyncProvider>
      <EasterEggProvider>
        <div className="min-h-screen bg-sand">
          <Header />
          <main className="max-w-lg mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === "itinerary" && <ItineraryTab key="itinerary" />}
              {activeTab === "foodfoto" && <FoodFotoTab key="foodfoto" />}
              {activeTab === "budget" && <BudgetTab key="budget" />}
            </AnimatePresence>
          </main>
          <TabBar active={activeTab} onChange={setActiveTab} />
          <EasterEggModal />
        </div>
      </EasterEggProvider>
    </SyncProvider>
  )
}
