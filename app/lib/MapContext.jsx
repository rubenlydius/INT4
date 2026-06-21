import { createContext, useContext, useState } from 'react'

const ANTWERP = { lat: 51.2194, lng: 4.4025, zoom: 13 }

const MapContext = createContext({
  mapFocus: ANTWERP,
  setMapFocus: () => {},
})

export function MapProvider({ children }) {
  const [mapFocus, setMapFocus] = useState(ANTWERP)
  return (
    <MapContext.Provider value={{ mapFocus, setMapFocus }}>
      {children}
    </MapContext.Provider>
  )
}

export function useMapFocus() {
  return useContext(MapContext)
}
