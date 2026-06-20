import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import styles from '../styles/profile.gems.add.module.css'
import { supabase } from '../lib/supabase'

import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import topPattern from '../assets/add_gem_pattern_top.svg'
import xIcon from '../assets/x_icon.svg'
import locationIcon from '../assets/location_icon_green.svg'
import foldedMapIcon from '../assets/folded_map_icon.svg'

export function meta() {
  return [{ title: "Add a Gem" }]
}

const ANTWERP = { lat: 51.2194, lng: 4.4025 }
const TOTAL_STEPS = 4

async function geocodeAddress(address) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ', Antwerp, Belgium')}&format=json&limit=1`
    )
    const data = await res.json()
    if (data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {
    // silent fail
  }
  return null
}

export default function AddGem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Step 1 state
  const [locationName, setLocationName] = useState('')
  const [address, setAddress] = useState('')
  const [radius, setRadius] = useState(300)
  const [coords, setCoords] = useState(ANTWERP)
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeError, setGeocodeError] = useState(false)
  const [geocoded, setGeocoded] = useState(false)

  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const circleRef = useRef(null)

  useEffect(() => {
    let mounted = true

    async function initMap() {
      if (!mapRef.current || mapRef.current._leaflet_id) return
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      if (!mounted || !mapRef.current || mapRef.current._leaflet_id) return

      const map = L.map(mapRef.current, {
        attributionControl: false,
        zoomControl: false,
      }).setView([ANTWERP.lat, ANTWERP.lng], 15)

      mapInstanceRef.current = map
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map)

      circleRef.current = L.circle([ANTWERP.lat, ANTWERP.lng], {
        radius: 300,
        color: '#00B569',
        fillColor: '#00B569',
        fillOpacity: 0.35,
        weight: 2,
      }).addTo(map)
    }

    initMap()

    return () => {
      mounted = false
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        circleRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !circleRef.current) return
    circleRef.current.setLatLng([coords.lat, coords.lng])
    circleRef.current.setRadius(radius)
    mapInstanceRef.current.setView([coords.lat, coords.lng], 16)
  }, [coords, radius])

  async function handleAddressBlur() {
    if (!address.trim()) return
    setGeocoding(true)
    setGeocodeError(false)
    const result = await geocodeAddress(address)
    setGeocoding(false)
    if (result) {
      setCoords(result)
      setGeocoded(true)
    } else {
      setGeocodeError(true)
    }
  }

  const canContinue = locationName.trim() && address.trim() && geocoded

  return (
    <div className={styles.page}>
      <div className={styles.header_area}>
        <img src={topPattern} alt="" className={styles.top_pattern} />
        <div className={styles.header_row}>
          <button className={styles.back_btn} onClick={() => navigate(`/profile/${id}/gems`)}>
            <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
          </button>
          <h1 className={styles.title}>Location</h1>
          <div />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.field}>
          <label htmlFor="gem-location" className={styles.label}>
            Location<span className={styles.required}>*</span>
          </label>
          <div className={styles.input_wrap}>
            <img src={foldedMapIcon} alt="" className={styles.input_icon} />
            <input
              id="gem-location"
              name="location_name"
              type="text"
              autoComplete="off"
              className={styles.input}
              placeholder="What's the place called?"
              value={locationName}
              onChange={e => setLocationName(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="gem-address" className={styles.label}>
            Address<span className={styles.required}>*</span>
          </label>
          <div className={`${styles.input_wrap} ${geocodeError ? styles.input_wrap_error : ''}`}>
            <img src={locationIcon} alt="" className={styles.input_icon} />
            <input
              id="gem-address"
              name="address"
              type="text"
              autoComplete="off"
              className={styles.input}
              placeholder="Where is it?"
              value={address}
              onChange={e => { setAddress(e.target.value); setGeocodeError(false); setGeocoded(false) }}
              onBlur={handleAddressBlur}
              onKeyDown={e => e.key === 'Enter' && handleAddressBlur()}
            />
          </div>
          {geocoding && <p className={styles.hint}>Finding location…</p>}
          {geocodeError && <p className={styles.hint_error}>Address not found — try being more specific</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="gem-radius" className={styles.label}>
            Radius<span className={styles.required}>*</span>
          </label>
          <p className={styles.radius_value}>
            {radius}<span className={styles.radius_unit}>m</span>
          </p>
          <input
            id="gem-radius"
            name="radius"
            type="range"
            min={50}
            max={500}
            value={radius}
            className={styles.slider}
            style={{ '--p': `${((radius - 50) / 450) * 100}%` }}
            onChange={e => setRadius(Number(e.target.value))}
          />
        </div>

        <div ref={mapRef} className={styles.map} />

        <div className={styles.steps}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            i + 1 === step
              ? <img key={i} src={xIcon} alt="" className={styles.step_active} />
              : <span key={i} className={styles.step} />
          ))}
        </div>

        <button
          className={`${styles.continue_btn} ${!canContinue ? styles.continue_disabled : ''}`}
          onClick={() => { if (canContinue) setStep(2) }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
