import { useEffect, useRef } from 'react'
import { useMapFocus } from '../lib/MapContext'
import { supabase } from '../lib/supabase'

const ANTWERP = { lat: 51.2194, lng: 4.4025, zoom: 13 }

function radiusToZoom(radius) {
  if (radius <= 80)  return 18
  if (radius <= 150) return 17
  if (radius <= 300) return 16
  if (radius <= 600) return 15
  return 14
}

export default function DesktopMap() {
  const { mapFocus } = useMapFocus()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const initializedRef = useRef(false)
  const focusCircleRef = useRef(null)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    async function init() {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (!mapRef.current) return

      const map = L.map(mapRef.current, { attributionControl: false, zoomControl: true })
        .setView([ANTWERP.lat, ANTWERP.lng], ANTWERP.zoom)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map)

      const { data: gems, error } = await supabase
        .from('Gems')
        .select('id, gem_name, lat, lng, type')

      if (error) { console.error('DesktopMap gems error:', error.message); return }
      if (!gems) return

      gems.forEach(gem => {
        if (!gem.lat || !gem.lng) return
        L.circleMarker([gem.lat, gem.lng], {
          radius: 8,
          color: '#00B569',
          fillColor: '#00B569',
          fillOpacity: 0.8,
          weight: 2,
        })
          .addTo(map)
          .bindTooltip(gem.gem_name ?? '', { direction: 'top', offset: [0, -8] })
      })
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

  useEffect(() => {
    if (!mapInstanceRef.current) return

    const zoom = mapFocus.radius ? radiusToZoom(mapFocus.radius) : (mapFocus.zoom ?? ANTWERP.zoom)
    mapInstanceRef.current.setView([mapFocus.lat, mapFocus.lng], zoom, { animate: true })

    // Draw / update a radius circle when viewing a specific gem
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

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}
