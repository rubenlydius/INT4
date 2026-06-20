import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import styles from '../styles/profile.gems.add.module.css'
import { supabase } from '../lib/supabase'

import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import topPattern from '../assets/add_gem_pattern_top.svg'
import xIcon from '../assets/x_icon.svg'
import locationIcon from '../assets/location_icon_green.svg'
import foldedMapIcon from '../assets/folded_map_icon.svg'
import dropdownArrow from '../assets/dropdownArrow.svg'

export function meta() {
  return [{ title: "Add a Gem" }]
}

const ANTWERP = { lat: 51.2194, lng: 4.4025 }
const TOTAL_STEPS = 4
const STEP_TITLES = ['Location', 'The gem', 'Details', 'Review']

const DESIGNERS = [
  { name: 'Dries Van Noten',       short: 'Dries V' },
  { name: 'Ann Demeulemeester',    short: 'Ann D'   },
  { name: 'Walter Van Beirendonck',short: 'Walter V'},
  { name: 'Dirk Bikkembergs',      short: 'Dirk B'  },
  { name: 'Dirk Van Saene',        short: 'Dirk V'  },
  { name: 'Marina Yee',            short: 'Marina Y'},
]

const DESC_MAX = 500
const CONN_MAX = 500

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

async function fetchSuggestions(query) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Antwerp, Belgium')}&format=json&limit=5`
    )
    return await res.json()
  } catch {
    return []
  }
}

function shortAddress(displayName) {
  return displayName.split(',').slice(0, 3).join(',').trim()
}

export default function AddGem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Step 1
  const [locationName, setLocationName] = useState('')
  const [address, setAddress] = useState('')
  const [radius, setRadius] = useState(300)
  const [coords, setCoords] = useState(ANTWERP)
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeError, setGeocodeError] = useState(false)
  const [geocoded, setGeocoded] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  // Step 2
  const [selectedType, setSelectedType] = useState(null)
  const [types, setTypes] = useState([])
  const [sticker, setSticker] = useState(null)
  const [stickerPreview, setStickerPreview] = useState(null)
  const [description, setDescription] = useState('')
  const [a6Link, setA6Link] = useState('')
  const [connectionTo, setConnectionTo] = useState('')
  const [isDesignerOpen, setIsDesignerOpen] = useState(false)

  const stickerInputRef = useRef(null)

  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const circleRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    async function loadTypes() {
      const { data, error } = await supabase.from('Gems').select('type')
      if (error) return console.error(error.message)
      const unique = [...new Set(data.map(g => g.type).filter(Boolean))]
      setTypes(unique)
    }
    loadTypes()
  }, [])

  useEffect(() => {
    let mounted = true

    async function initMap() {
      if (!mapRef.current || mapRef.current._leaflet_id) return
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (!mounted || !mapRef.current || mapRef.current._leaflet_id) return

      const map = L.map(mapRef.current, { attributionControl: false, zoomControl: false })
        .setView([ANTWERP.lat, ANTWERP.lng], 15)
      mapInstanceRef.current = map
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map)
      circleRef.current = L.circle([ANTWERP.lat, ANTWERP.lng], {
        radius: 300, color: '#00B569', fillColor: '#00B569', fillOpacity: 0.35, weight: 2,
      }).addTo(map)
    }

    initMap()
    return () => {
      mounted = false
      if (debounceRef.current) clearTimeout(debounceRef.current)
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

  function handleAddressChange(value) {
    setAddress(value)
    setGeocodeError(false)
    setGeocoded(false)
    setSuggestions([])
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.trim().length < 3) return
    debounceRef.current = setTimeout(async () => {
      const results = await fetchSuggestions(value)
      setSuggestions(results)
    }, 400)
  }

  function selectSuggestion(s) {
    setAddress(shortAddress(s.display_name))
    setCoords({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) })
    setGeocoded(true)
    setGeocodeError(false)
    setSuggestions([])
  }

  async function handleAddressBlur() {
    setSuggestions([])
    if (!address.trim() || geocoded) return
    setGeocoding(true)
    setGeocodeError(false)
    const result = await geocodeAddress(address)
    setGeocoding(false)
    if (result) { setCoords(result); setGeocoded(true) }
    else setGeocodeError(true)
  }

  const canContinueStep1 = locationName.trim() && address.trim() && geocoded
  const canContinueStep2 = selectedType && sticker && description.trim() && a6Link

  function handleBack() {
    if (step === 1) navigate(`/profile/${id}/gems`)
    else setStep(s => s - 1)
  }

  function handleContinue() {
    if (step === 1 && canContinueStep1) setStep(2)
    if (step === 2 && canContinueStep2) setStep(3)
  }

  const canContinue = step === 1 ? canContinueStep1 : step === 2 ? canContinueStep2 : false

  return (
    <div className={styles.page}>
      <div className={styles.header_area}>
        <img src={topPattern} alt="" className={styles.top_pattern} />
        <div className={styles.header_row}>
          <button className={styles.back_btn} onClick={handleBack}>
            <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
          </button>
          <h1 className={styles.title}>{STEP_TITLES[step - 1]}</h1>
          <div />
        </div>
      </div>

      <div className={styles.content}>

        {/* ── Step 1: Location ── */}
        {step === 1 && (
          <>
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
              <div className={styles.address_wrap}>
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
                    onChange={e => handleAddressChange(e.target.value)}
                    onBlur={handleAddressBlur}
                    onKeyDown={e => e.key === 'Enter' && handleAddressBlur()}
                  />
                </div>
                {suggestions.length > 0 && (
                  <ul className={styles.suggestions}>
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        className={styles.suggestion}
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => selectSuggestion(s)}
                      >
                        {shortAddress(s.display_name)}
                      </li>
                    ))}
                  </ul>
                )}
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
          </>
        )}

        {/* ── Step 2: The gem ── */}
        {step === 2 && (
          <>
            {/* Type */}
            <div className={styles.section_block}>
              <p className={styles.section_heading}>
                What is the gem?<span className={styles.required}>*</span>
              </p>
              <div className={styles.type_pills}>
                {types.map(type => (
                  <button
                    key={type}
                    className={`${styles.type_pill} ${selectedType === type ? styles.type_pill_active : ''}`}
                    onClick={() => setSelectedType(prev => prev === type ? null : type)}
                  >
                    {type}
                    {selectedType === type && (
                      <img src={xIcon} alt="" className={styles.type_pill_x} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sticker */}
            <div className={styles.section_block}>
              <p className={styles.section_heading}>
                Add a sticker<span className={styles.required}>*</span>
              </p>
              <div className={styles.sticker_row}>
                <p className={styles.sticker_desc}>
                  This can be anything: something you made, your drawing, a picture of a mug from the bar…
                </p>
                <button
                  className={styles.sticker_box}
                  onClick={() => stickerInputRef.current?.click()}
                  type="button"
                  aria-label="Add a sticker image"
                >
                  {stickerPreview ? (
                    <img src={stickerPreview} alt="sticker preview" className={styles.sticker_preview} />
                  ) : (
                    <div className={styles.sticker_icon_wrap}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                      <div className={styles.sticker_plus}>
                        <svg width="16" height="16" viewBox="0 0 24 24">
                          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
                <input
                  ref={stickerInputRef}
                  type="file"
                  name="image_url"
                  accept="image/*"
                  className={styles.sticker_input}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setSticker(file)
                    setStickerPreview(URL.createObjectURL(file))
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div className={styles.section_block}>
              <p className={styles.section_heading}>
                About the location<span className={styles.required}>*</span>
              </p>
              <p className={styles.sticker_desc}>They will only see this after finding the gem.</p>
              <div className={styles.textarea_wrap}>
                <textarea
                  id="gem-description"
                  name="description"
                  className={styles.textarea}
                  placeholder="De Vlek has been on this corner since 1991. It has never had a website. The espresso machine is older than most of its customers…"
                  value={description}
                  maxLength={DESC_MAX}
                  rows={5}
                  onChange={e => setDescription(e.target.value)}
                />
                <p className={styles.char_count}>{description.length}/{DESC_MAX}</p>
              </div>
            </div>

            {/* Connection to designer */}
            <div className={styles.section_block}>
              <p className={styles.section_heading}>
                Connection to the designer<span className={styles.required}>*</span>
              </p>
              <div className={styles.dropdown_wrap}>
                <button
                  className={styles.dropdown_btn}
                  onClick={() => setIsDesignerOpen(v => !v)}
                  onBlur={() => setTimeout(() => setIsDesignerOpen(false), 150)}
                  type="button"
                >
                  <span className={styles.dropdown_value}>
                    {a6Link
                      ? DESIGNERS.find(d => d.short === a6Link)?.name
                      : 'Select a designer'}
                  </span>
                  <img
                    src={dropdownArrow}
                    alt=""
                    className={`${styles.dropdown_arrow} ${isDesignerOpen ? styles.dropdown_arrow_open : ''}`}
                  />
                </button>
                {isDesignerOpen && (
                  <div className={styles.dropdown_list}>
                    {DESIGNERS.map(d => (
                      <button
                        key={d.short}
                        className={`${styles.dropdown_option} ${a6Link === d.short ? styles.dropdown_option_active : ''}`}
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => { setA6Link(d.short); setIsDesignerOpen(false) }}
                        type="button"
                      >
                        {d.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {a6Link && (
                <div className={styles.textarea_wrap} style={{ marginTop: '1rem' }}>
                  <label htmlFor="gem-connection" className={styles.connection_label}>
                    Share what connects this place to the designer who inspired you.{' '}
                    <span className={styles.optional}>(optional)</span>
                  </label>
                  <textarea
                    id="gem-connection"
                    name="connection_to"
                    className={styles.textarea}
                    placeholder="Dries Van Noten often draws inspiration from flowers, gardens, and the beauty of nature. I feel like the Begijnhof reflects that same spirit."
                    value={connectionTo}
                    maxLength={CONN_MAX}
                    rows={4}
                    onChange={e => setConnectionTo(e.target.value)}
                  />
                  <p className={styles.char_count}>{connectionTo.length}/{CONN_MAX}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Step dots + continue ── */}
        <div className={styles.steps}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            i + 1 === step
              ? <img key={i} src={xIcon} alt="" className={styles.step_active} />
              : <span key={i} className={styles.step} />
          ))}
        </div>

        <button
          className={`${styles.continue_btn} ${!canContinue ? styles.continue_disabled : ''}`}
          onClick={handleContinue}
        >
          Continue
        </button>

      </div>
    </div>
  )
}
