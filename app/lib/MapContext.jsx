import { createContext, useContext, useState } from 'react'

const ANTWERP = { lat: 51.2194, lng: 4.4025, zoom: 13 }

const MapContext = createContext({
  mapFocus: ANTWERP,
  setMapFocus: () => {},
  activeLens: 'ann',
  setActiveLens: () => {},
})

export function MapProvider({ children }) {
  const [mapFocus, setMapFocus] = useState(ANTWERP)
  const [activeLens, setActiveLens] = useState(
    typeof window !== 'undefined' ? (localStorage.getItem('selectedLens') || 'ann') : 'ann'
  )
  return (
    <MapContext.Provider value={{ mapFocus, setMapFocus, activeLens, setActiveLens }}>
      {children}
    </MapContext.Provider>
  )
}

export function useMapFocus() {
  return useContext(MapContext)
}
