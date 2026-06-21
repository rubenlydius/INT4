// Shared state between pages and the desktop map (DesktopMap in root.tsx).
// Lets gem.hunt/gem.detail pan the big map, lens.jsx filter its markers,
// and desktop map clicks open the right popup in the phone frame — all without prop drilling.
import { createContext, useContext, useState } from 'react'

const ANTWERP = { lat: 51.2194, lng: 4.4025, zoom: 13 }

const MapContext = createContext({
  mapFocus: ANTWERP,
  setMapFocus: () => {},
  activeLens: 'ann',
  setActiveLens: () => {},
  pendingGemId: null,
  setPendingGemId: () => {},
})

export function MapProvider({ children }) {
  const [mapFocus, setMapFocus] = useState(ANTWERP)

  // DESKTOP — tracks which designer lens is active so DesktopMap can filter gem markers
  const [activeLens, setActiveLens] = useState(
    typeof window !== 'undefined' ? (localStorage.getItem('selectedLens') || 'ann') : 'ann'
  )

  // DESKTOP — when a gem is clicked on the desktop map, this id is set so map.jsx
  // can open the correct popup in the phone frame after navigating to /map
  const [pendingGemId, setPendingGemId] = useState(null)
  return (
    <MapContext.Provider value={{ mapFocus, setMapFocus, activeLens, setActiveLens, pendingGemId, setPendingGemId }}>
      {children}
    </MapContext.Provider>
  )
}

export function useMapFocus() {
  return useContext(MapContext)
}
