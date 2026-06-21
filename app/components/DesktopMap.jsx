import { useEffect, useRef } from 'react'
import { useMapFocus } from '../lib/MapContext'
import { supabase } from '../lib/supabase'
import sixGem from '../assets/a6_gem.svg'
import appIcon from '../assets/app_icon.svg'

const ANTWERP = { lat: 51.2194, lng: 4.4025, zoom: 13 }

const LENS_TO_DB = {
  ann:     'Ann D',
  walter:  'Walter V',
  dirk_b:  'Dirk B',
  marina:  'Marina Y',
  dirk_vs: 'Dirk V',
  dries:   'Dries V',
}

function radiusToZoom(radius) {
  if (radius <= 80)  return 18
  if (radius <= 150) return 17
  if (radius <= 300) return 16
  if (radius <= 600) return 15
  return 14
}

function getOffset(gem) {
  const radius = gem.radius ?? 250
  const maxOffset = (radius * 0.6) * 0.000009
  const seed = gem.id % 100
  const seed2 = (gem.id * 13) % 100
  const latOffset = ((seed % 10) - 5) / 5 * maxOffset
  const lngOffset = ((seed2 % 10) - 5) / 5 * maxOffset
  return [gem.lat + latOffset, gem.lng + lngOffset]
}

export default function DesktopMap() {
  const { mapFocus, activeLens } = useMapFocus()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const initializedRef = useRef(false)
  const focusCircleRef = useRef(null)
  const allGemsRef = useRef([])       // all fetched gems
  const markersRef = useRef([])       // { marker, gem } currently on map
  const LRef = useRef(null)           // Leaflet instance

  function buildMarker(L, gem) {
    const centerLatLng = getOffset(gem)
    let marker
    if (gem.a6_fav) {
      const icon = L.icon({ iconUrl: sixGem, iconSize: [48, 48], iconAnchor: [24, 24] })
      marker = L.marker(centerLatLng, { icon })
    } else {
      marker = L.circle(centerLatLng, {
        radius: gem.radius ?? 250,
        color: '#00D77D',
        fillColor: '#00D77D',
        fillOpacity: 0.5,
        weight: 2,
      })
    }
    marker.bindTooltip(gem.gem_name ?? '', { direction: 'top', offset: [0, -8] })
    return marker
  }

  function applyLensFilter(lensKey) {
    const map = mapInstanceRef.current
    const L = LRef.current
    if (!map || !L) return

    const dbName = LENS_TO_DB[lensKey]

    // remove existing markers
    markersRef.current.forEach(({ marker }) => marker.remove())
    markersRef.current = []

    // add only gems for this lens
    allGemsRef.current
      .filter(gem => gem.a6_link === dbName)
      .forEach(gem => {
        const marker = buildMarker(L, gem)
        marker.addTo(map)
        markersRef.current.push({ marker, gem })
      })
  }

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    async function init() {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (!mapRef.current) return

      LRef.current = L

      const map = L.map(mapRef.current, { attributionControl: false, zoomControl: false })
        .setView([ANTWERP.lat, ANTWERP.lng], ANTWERP.zoom)
      mapInstanceRef.current = map

      L.control.zoom({ position: 'topright' }).addTo(map)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map)

      const { data: gems, error } = await supabase
        .from('Gems')
        .select('id, gem_name, lat, lng, type, a6_fav, radius, a6_link')
        .eq('verified', true)

      if (error) { console.error('DesktopMap gems error:', error.message); return }
      if (!gems) return

      allGemsRef.current = gems
      applyLensFilter(activeLens)
    }

    init()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        initializedRef.current = false
      }
    }
  }, [])

  // re-filter markers when designer changes
  useEffect(() => {
    applyLensFilter(activeLens)
  }, [activeLens])

  // pan/zoom to gem when selected
  useEffect(() => {
    if (!mapInstanceRef.current) return

    const zoom = mapFocus.radius ? radiusToZoom(mapFocus.radius) : (mapFocus.zoom ?? ANTWERP.zoom)
    mapInstanceRef.current.setView([mapFocus.lat, mapFocus.lng], zoom, { animate: true })

    if (focusCircleRef.current) {
      focusCircleRef.current.remove()
      focusCircleRef.current = null
    }
    if (mapFocus.radius) {
      import('leaflet').then(({ default: L }) => {
        focusCircleRef.current = L.circle([mapFocus.lat, mapFocus.lng], {
          radius: mapFocus.radius,
          color: '#00B569',
          fillColor: '#00B569',
          fillOpacity: 0.12,
          weight: 2,
          dashArray: '6 4',
        }).addTo(mapInstanceRef.current)
      })
    }
  }, [mapFocus])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        position: 'absolute',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 1000,
        background: 'var(--color-orange)',
        borderRadius: '999px',
        padding: '0.75rem 1.5rem 0.75rem 1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        fontSize: '0.95rem',
        fontWeight: 600,
        color: 'var(--color-white)',
        pointerEvents: 'none',
      }}>
        <img src={appIcon} alt="" style={{ width: 28, height: 28, flexShrink: 0, filter: 'brightness(0) invert(1)' }} />
        <span>Use your phone for the full experience</span>
      </div>
    </div>
  )
}
