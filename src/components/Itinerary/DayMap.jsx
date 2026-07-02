import { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Maximize2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import L from "leaflet"
import { AIRBNB_COORDS } from "../../data/itinerary"

const airbnbIcon = L.divIcon({
  className: "custom-marker",
  html: `<div class="marker-pin bg-gradient-to-br from-valencia to-terracotta"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
})

const stopIcon = L.divIcon({
  className: "custom-marker",
  html: `<div class="marker-pin bg-gradient-to-br from-mare to-[#0080cc]"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="4"/></svg></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
})

const fitBounds = (stops) => {
  const coords = [AIRBNB_COORDS, ...stops.map((s) => s.coords)]
  const lats = coords.map((c) => c[0])
  const lngs = coords.map((c) => c[1])
  const pad = 0.008
  return [
    [Math.min(...lats) - pad, Math.min(...lngs) - pad],
    [Math.max(...lats) + pad, Math.max(...lngs) + pad],
  ]
}

function MapContent({ stops, bounds }) {
  return (
    <MapContainer
      bounds={bounds}
      scrollWheelZoom={false}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={AIRBNB_COORDS} icon={airbnbIcon}>
        <Popup>
          <div className="text-center">
            <strong className="text-notte text-xs">🏠 Airbnb</strong>
            <p className="text-[10px] text-notte/60">Av. del Dr. Waksman, 24</p>
          </div>
        </Popup>
      </Marker>
      {stops.map((stop) => (
        <Marker key={stop.id} position={stop.coords} icon={stopIcon}>
          <Popup>
            <div className="text-center">
              <strong className="text-notte text-xs">{stop.name}</strong>
              <p className="text-[10px] text-notte/60">{stop.time}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default function DayMap({ stops }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const bounds = fitBounds(stops)

  return (
    <>
      {/* Inline Map */}
      <div className="mx-4 mb-6 rounded-2xl overflow-hidden shadow-sm border border-notte/5 relative">
        <div className="h-56">
          <MapContent stops={stops} bounds={bounds} />
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFullscreen(true)}
          className="absolute top-2 right-2 z-[1000] w-8 h-8 bg-surface/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center border border-notte/10"
        >
          <Maximize2 className="w-4 h-4 text-notte/60" />
        </motion.button>
      </div>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-sand"
          >
            <div className="absolute top-0 left-0 right-0 z-[10000] flex items-center justify-between px-4 bg-surface/90 backdrop-blur-xl border-b border-notte/5"
              style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)", paddingBottom: "12px" }}
            >
              <h3 className="text-sm font-bold text-notte">Mappa</h3>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFullscreen(false)}
                className="w-8 h-8 bg-notte/10 rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4 text-notte/60" />
              </motion.button>
            </div>
            <div className="absolute inset-0 pt-[72px]">
              <MapContent stops={stops} bounds={bounds} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
