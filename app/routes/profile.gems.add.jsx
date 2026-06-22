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
import photosStackedIcon from '../assets/photos_stacked_icon.svg'
import walkingIcon from '../assets/walking_icon.svg'
import greenDivider from '../assets/green_devider_add_gem.svg'
import cornerDecoration from '../assets/corrner_decoration_add_gem.svg'
import closeButton from '../assets/close_button.svg'
import gemCreatedIllustration from '../assets/gem_created.svg'
import instagramIcon from '../assets/instagram_icon.svg'
import pinterestIcon from '../assets/pinterest_icon.svg'
import behanceIcon from '../assets/behance_icon.svg'
import { profiles } from '../lib/profiles'
import { storageUrl } from '../lib/storage'

const ONA_AVATAR = storageUrl('gems/creators/ona.avif')

export function meta() {
  return [{ title: "Add a Gem" }]
}

const ANTWERP = { lat: 51.2194, lng: 4.4025 }
const TOTAL_STEPS = 4
const CLOUDINARY_CLOUD = 'dckmhtdop'
const CLOUDINARY_PRESET = 'gem_int4'

// Shrink and re-encode to WebP before uploading — keeps file sizes small
// without a server-side step. Math.min(1, ...) ensures we never upscale.
async function compressImage(blob, maxWidth = 1600, quality = 0.82) {
  const bitmap = await createImageBitmap(blob)
  const scale = Math.min(1, maxWidth / bitmap.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise(res => canvas.toBlob(res, 'image/webp', quality))
}

// Unsigned upload using a Cloudinary preset — no API key needed in the browser.
async function uploadToCloudinary(blob) {
  const form = new FormData()
  form.append('file', blob)
  form.append('upload_preset', CLOUDINARY_PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
    method: 'POST',
    body: form,
  })
  const data = await res.json()
  return data.secure_url ?? null
}
const STEP_TITLES = ['Location', 'The gem', 'The Hints', 'Gem Description']

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
const HINT_MAX = 1000

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

// Wraps the browser Image constructor in a promise so we can await it
function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image()
    img.onload = () => res(img)
    img.onerror = rej
    img.src = src
  })
}

// Takes a PNG blob (ideally with transparent background) and adds a white
// sticker border around the subject.
//
// How the white border works:
//   1. We draw the image 32 times on a "mask" canvas, each time shifted
//      slightly outward in a different direction (like clock positions).
//      This creates a blurred silhouette that is slightly larger than the original.
//   2. We loop through every pixel of that mask. Any pixel with meaningful
//      opacity (alpha > 50) gets forced to solid white. Pixels below the
//      threshold (ghost artifacts left by background removal) get zeroed out.
//   3. We do the same cleanup on the original image so those ghost pixels
//      don't appear in the final result either.
//   4. We draw the white mask first, then the cleaned original on top.
//      The result: a white ring around the sticker look.
async function makeSticker(blob, outlineWidth = 28) {
  const url = URL.createObjectURL(blob)
  const img = await loadImage(url)
  URL.revokeObjectURL(url)

  const pad = outlineWidth
  const w = img.naturalWidth + pad * 2
  const h = img.naturalHeight + pad * 2

  // Step 1: draw silhouette at 32 angles to build the outline shape
  const maskCanvas = document.createElement('canvas')
  maskCanvas.width = w
  maskCanvas.height = h
  const maskCtx = maskCanvas.getContext('2d')
  const steps = 32
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2
    maskCtx.drawImage(img, pad + Math.cos(angle) * pad, pad + Math.sin(angle) * pad)
  }

  // Step 2: paint the entire silhouette white, drop near-transparent ghost pixels
  const imageData = maskCtx.getImageData(0, 0, w, h)
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] > 50) {
      d[i] = 255; d[i + 1] = 255; d[i + 2] = 255; d[i + 3] = 255
    } else {
      d[i + 3] = 0
    }
  }
  maskCtx.putImageData(imageData, 0, 0)

  // Step 3: clean the same ghost pixels from the source image
  const srcCanvas = document.createElement('canvas')
  srcCanvas.width = img.naturalWidth
  srcCanvas.height = img.naturalHeight
  const srcCtx = srcCanvas.getContext('2d')
  srcCtx.drawImage(img, 0, 0)
  const srcData = srcCtx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)
  const sd = srcData.data
  for (let i = 0; i < sd.length; i += 4) {
    if (sd[i + 3] <= 50) sd[i + 3] = 0
  }
  srcCtx.putImageData(srcData, 0, 0)

  // Step 4: white mask underneath, real image on top = sticker with white border
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(maskCanvas, 0, 0)
  ctx.drawImage(srcCanvas, pad, pad)

  return new Promise(res => canvas.toBlob(res, 'image/png'))
}

export default function AddGem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

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
  const [stickerLoading, setStickerLoading] = useState(false)
  const [stickerEditing, setStickerEditing] = useState(false)
  const [pendingBlob, setPendingBlob] = useState(null)
  const [eraserSize, setEraserSize] = useState(20)
  const [description, setDescription] = useState('')
  const [a6Link, setA6Link] = useState('')
  const [connectionTo, setConnectionTo] = useState('')
  const [isDesignerOpen, setIsDesignerOpen] = useState(false)

  const stickerInputRef = useRef(null)
  const canvasEditorRef = useRef(null)
  const isErasingRef = useRef(false)
  const lastPosRef = useRef(null)
  const stickerPreviewUrlRef = useRef(null)

  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const circleRef = useRef(null)
  const debounceRef = useRef(null)
  const dropdownBlurRef = useRef(null)

  // Step 3
  const [gemName, setGemName] = useState('')
  const [textHint, setTextHint] = useState('')
  const [hintPhotos, setHintPhotos] = useState([])
  const [hintPreviews, setHintPreviews] = useState([])

  const hintInputRef = useRef(null)
  const hintPreviewUrlsRef = useRef([])

  // Revoke all blob URLs when the component unmounts to free memory
  useEffect(() => {
    return () => {
      if (stickerPreviewUrlRef.current) URL.revokeObjectURL(stickerPreviewUrlRef.current)
      hintPreviewUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
      clearTimeout(dropdownBlurRef.current)
    }
  }, [])

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
    // Wait 400ms after the user stops typing before hitting the geocoding API.
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

  // Full sticker flow:
  // 1. User picks a photo → background removal runs (ML model in browser, no server)
  // 2. Result (PNG with transparent background) opens in the eraser editor
  // 3. User paints over any leftover artifacts → tap Done
  // 4. makeSticker() adds the white border → preview shows in the box
  async function handleStickerChange(file) {
    if (!file) return
    setStickerLoading(true)
    try {
      // Dynamic import so the heavy WASM library only loads when the user
      // actually picks a photo — not on every page load
      const { removeBackground } = await import('@imgly/background-removal')
      const noBg = await removeBackground(file)
      setStickerLoading(false)
      openEditor(noBg)
    } catch {
      // If background removal fails, open the original so user can erase manually
      setStickerLoading(false)
      openEditor(file)
    }
  }

  function openEditor(blob) {
    setPendingBlob(blob)
    setStickerEditing(true)
  }

  // useEffect is needed here instead of requestAnimationFrame because
  // setStickerEditing(true) schedules a React re-render — the canvas doesn't
  // exist in the DOM yet at the moment openEditor() runs. useEffect fires
  // AFTER React has committed the overlay to the DOM, so canvasEditorRef.current
  // is guaranteed to be set when drawBlobOnCanvas runs. This was the reason
  // it worked on desktop (faster) but not on mobile (slower render).
  useEffect(() => {
    if (!stickerEditing || !pendingBlob || !canvasEditorRef.current) return
    drawBlobOnCanvas(pendingBlob)
  }, [stickerEditing, pendingBlob])

  // Scales the image to fit the canvas and draws it centered
  async function drawBlobOnCanvas(blob) {
    const canvas = canvasEditorRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const url = URL.createObjectURL(blob)
    const img = await loadImage(url)
    URL.revokeObjectURL(url)
    const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
    const sw = Math.round(img.naturalWidth * scale)
    const sh = Math.round(img.naturalHeight * scale)
    const sx = Math.round((canvas.width - sw) / 2)
    const sy = Math.round((canvas.height - sh) / 2)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, sx, sy, sw, sh)
  }

  // Converts a pointer/touch event position to canvas pixel coordinates.
  // The canvas is 600×700 internally but displayed at a different size on
  // screen, so scale the coordinates to match the internal resolution.
  function getCanvasPos(e) {
    const canvas = canvasEditorRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.clientX ?? e.touches?.[0]?.clientX
    const clientY = e.clientY ?? e.touches?.[0]?.clientY
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  // Erases pixels at the given position using 'destination-out' composite mode.
  // destination-out = wherever you draw, existing pixels become transparent.
  // We also draw a line from the last position so fast finger movements
  // don't leave gaps between erased circles.
  function eraseAt(pos) {
    const canvas = canvasEditorRef.current
    const ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    if (lastPosRef.current) {
      ctx.lineWidth = eraserSize * 2
      ctx.lineCap = 'round'
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
    ctx.arc(pos.x, pos.y, eraserSize, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
    lastPosRef.current = pos
  }

  function handleCanvasPointerDown(e) {
    e.preventDefault()
    isErasingRef.current = true
    lastPosRef.current = null
    eraseAt(getCanvasPos(e))
  }

  function handleCanvasPointerMove(e) {
    e.preventDefault()
    if (!isErasingRef.current) return
    eraseAt(getCanvasPos(e))
  }

  function handleCanvasPointerUp() {
    isErasingRef.current = false
    lastPosRef.current = null
  }

  // Captures the edited canvas as a PNG blob, runs makeSticker() to add
  // the white border, then saves the result as the gem's sticker image
  async function handleStickerDone() {
    const canvas = canvasEditorRef.current
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'))
    const stickerBlob = await makeSticker(blob)
    // Revoke the old preview URL before creating a new one to avoid memory leaks
    if (stickerPreviewUrlRef.current) URL.revokeObjectURL(stickerPreviewUrlRef.current)
    stickerPreviewUrlRef.current = URL.createObjectURL(stickerBlob)
    setSticker(stickerBlob)
    setStickerPreview(stickerPreviewUrlRef.current)
    setStickerEditing(false)
    setPendingBlob(null)
  }

  const canContinueStep3 = gemName.trim() && textHint.trim() && hintPhotos.length > 0

  function handleHintPhotosChange(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const remaining = 3 - hintPhotos.length
    const toAdd = files.slice(0, remaining)
    const newUrls = toAdd.map(f => URL.createObjectURL(f))
    hintPreviewUrlsRef.current = [...hintPreviewUrlsRef.current, ...newUrls]
    setHintPhotos(prev => [...prev, ...toAdd])
    setHintPreviews(prev => [...prev, ...newUrls])
    e.target.value = '' // reset so the same file can be re-selected if removed
  }

  function removeHintPhoto(index) {
    URL.revokeObjectURL(hintPreviews[index])
    hintPreviewUrlsRef.current = hintPreviewUrlsRef.current.filter((_, i) => i !== index)
    setHintPhotos(prev => prev.filter((_, i) => i !== index))
    setHintPreviews(prev => prev.filter((_, i) => i !== index))
  }

  function handleBack() {
    if (step === 1) navigate(`/profile/${id}/gems`)
    else setStep(s => s - 1)
  }

  async function handleContinue() {
    if (step === 1 && canContinueStep1) setStep(2)
    if (step === 2 && canContinueStep2) setStep(3)
    if (step === 3 && canContinueStep3) setStep(4)
    if (step === 4) {
      setSubmitting(true)
      const profile = profiles[id] || profiles.ona

      const stickerUrl = sticker ? await uploadToCloudinary(sticker) : null
      // Upload all hint photos in parallel to keep submit time short.
      const hintUrls = await Promise.all(
        hintPhotos.map(async f => {
          const compressed = await compressImage(f)
          return uploadToCloudinary(compressed)
        })
      )

      const { error } = await supabase.from('Gems').insert({
        location_name: locationName,
        address,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
        radius,
        type: selectedType,
        description,
        a6_link: a6Link,
        connection_to: connectionTo,
        gem_name: gemName,
        abstract: textHint,
        creator: profile.name,
        image_url: ONA_AVATAR,
        about_creator: profile.bio?.full ?? '',
        creator_field: profile.keywords?.[1] ?? '',
        sticker_url: stickerUrl,
        hint_url_1: hintUrls[0] ?? null,
        hint_url_2: hintUrls[1] ?? null,
        hint_url_3: hintUrls[2] ?? null,
        verified: false, // admin must verify before it appears on the map
        a6_fav: false,
      })
      setSubmitting(false)
      if (error) {
        console.error('Supabase insert error:', error.message)
        setSubmitError(true)
        return
      }
      setStep(5)
    }
  }

  const canContinue = step === 1 ? canContinueStep1 : step === 2 ? canContinueStep2 : step === 3 ? canContinueStep3 : true

  return (
    <div className={styles.page}>
      <div className={styles.header_area}>
        <img src={topPattern} alt="" className={styles.top_pattern} />
        {step === 5 ? (
          <button type="button" className={styles.close_btn} onClick={() => navigate(`/profile/${id}/gems`)}>
            <img src={closeButton} alt="close" />
          </button>
        ) : (
          <div className={styles.header_row}>
            <button type="button" className={styles.back_btn} onClick={handleBack}>
              <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
            </button>
            <h1 className={styles.title}>{STEP_TITLES[step - 1]}</h1>
            <div />
          </div>
        )}
      </div>

      <div className={styles.content}>

        {/* Step 1: Location */}
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
                    {suggestions.map((s) => (
                      <li
                        key={s.place_id}
                        className={styles.suggestion}
                        onMouseDown={e => e.preventDefault()} // prevent input blur before click fires
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

        {/* Step 2: The gem */}
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
                  onClick={() => !stickerLoading && stickerInputRef.current?.click()}
                  type="button"
                  aria-label="Add a sticker image"
                >
                  {stickerLoading ? (
                    <p className={styles.sticker_loading}>Processing…</p>
                  ) : stickerPreview ? (
                    <img src={stickerPreview} alt="sticker preview" className={styles.sticker_preview} />
                  ) : (
                    <div className={styles.sticker_icon_wrap}>
                      <img src={photosStackedIcon} alt="" width="48" height="48" />
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
                  name="sticker_url"
                  accept="image/*"
                  className={styles.sticker_input}
                  onChange={e => handleStickerChange(e.target.files?.[0])}
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
                  onBlur={() => { dropdownBlurRef.current = setTimeout(() => setIsDesignerOpen(false), 150) }}
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
            </div>
          </>
        )}

        {/* Step 3: The Hints */}
        {step === 3 && (
          <>
            {/* Gem Name */}
            <div className={styles.section_block}>
              <p className={styles.section_heading}>
                Gem Name<span className={styles.required}>*</span>
              </p>
              <p className={styles.sticker_desc}>
                This name will be visible for people before they start their hunt, so make sure you{' '}
                <strong className={styles.spoiler_warning}>don't spoil the actual name of the place</strong>
              </p>
              <div className={styles.input_wrap}>
                <input
                  id="gem-name"
                  name="gem_name"
                  type="text"
                  autoComplete="off"
                  className={styles.input}
                  placeholder="Think of something obscure or fun"
                  value={gemName}
                  onChange={e => setGemName(e.target.value)}
                />
              </div>
            </div>

            {/* Text hint */}
            <div className={styles.section_block}>
              <p className={styles.section_heading}>
                Text hint<span className={styles.required}>*</span>
              </p>
              <p className={styles.sticker_desc}>Write something abstract, don't make it too easy.</p>
              <div className={styles.textarea_wrap}>
                <textarea
                  id="gem-hint"
                  name="abstract"
                  className={styles.textarea}
                  placeholder="Begin your journey where wide concrete stairs climb toward glass and steel. Inside a metallic tunnel, solid walls dissolve into thousands of organic oval cutouts…"
                  value={textHint}
                  maxLength={HINT_MAX}
                  rows={6}
                  onChange={e => setTextHint(e.target.value)}
                />
                <p className={styles.char_count}>{textHint.length}/{HINT_MAX}</p>
              </div>
            </div>

            {/* Visual hints */}
            <div className={styles.section_block}>
              <p className={styles.section_heading}>
                Visual hints<span className={styles.required}>*</span>
              </p>
              <p className={styles.sticker_desc}>
                Snap 1-3 hint photos, make them gradually easier. Skip the obvious storefront, shoot unique close-ups, textures, or street details instead.
              </p>
              {hintPreviews.length > 0 ? (
                <div className={styles.hint_photos_grid}>
                  {hintPreviews.map((url, i) => (
                    <div key={i} className={styles.hint_photo_wrap}>
                      <img src={url} alt={`hint ${i + 1}`} className={styles.hint_photo_thumb} />
                      <button
                        className={styles.hint_photo_remove}
                        onClick={() => removeHintPhoto(i)}
                        type="button"
                        aria-label="Remove photo"
                      >
                        <img src={xIcon} alt="" className={styles.hint_photo_remove_icon} />
                      </button>
                    </div>
                  ))}
                  {hintPhotos.length < 3 && (
                    <button
                      className={styles.hint_add_more}
                      onClick={() => hintInputRef.current?.click()}
                      type="button"
                      aria-label="Add another hint photo"
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="var(--color-green)" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  className={styles.hint_photos_box}
                  onClick={() => hintInputRef.current?.click()}
                  type="button"
                  aria-label="Add hint photos"
                >
                  <div className={styles.sticker_icon_wrap}>
                    <img src={photosStackedIcon} alt="" width="56" height="56" />
                    <div className={styles.sticker_plus}>
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </button>
              )}
              <input
                ref={hintInputRef}
                type="file"
                accept="image/*"
                multiple
                className={styles.sticker_input}
                onChange={handleHintPhotosChange}
              />
            </div>
          </>
        )}

        {/* Step 4: Gem Description (review) */}
        {step === 4 && (() => {
          const profile = profiles[id] || profiles.ona
          const fullDesigner = DESIGNERS.find(d => d.short === a6Link)?.name
          return (
            <>
              {/* Gem name + sticker */}
              <div className={styles.review_header}>
                <div className={styles.review_header_left}>
                  <h2 className={styles.review_gem_name}>{gemName}</h2>
                  <p className={styles.review_added_by}>
                    Added by {profile.name}
                    {fullDesigner && <> · {fullDesigner} lens</>}
                  </p>
                  <div className={styles.review_pills}>
                    {selectedType && <span className={styles.review_pill}>{selectedType}</span>}
                  </div>
                </div>
                {stickerPreview && (
                  <img src={stickerPreview} alt="sticker" className={styles.review_sticker} />
                )}
              </div>

              {/* Location + description + address */}
              <div className={styles.review_section}>
                <h2 className={styles.review_location_name}>{locationName}</h2>
                <p className={styles.review_desc}>{description}</p>
                <div className={styles.review_address_row}>
                  <div className={styles.review_address_item}>
                    <div className={styles.review_icon_circle}>
                      <img src={locationIcon} alt="" className={styles.review_address_icon} />
                    </div>
                    <p className={styles.review_address_text}>{address}</p>
                  </div>
                  <img src={greenDivider} alt="" className={styles.review_green_divider} />
                  <div className={styles.review_address_item}>
                    <div className={styles.review_icon_circle}>
                      <img src={walkingIcon} alt="" className={styles.review_address_icon} />
                    </div>
                    <div>
                      <p className={styles.review_radius_label}>Radius</p>
                      <p className={styles.review_radius_value}>{radius}<span className={styles.review_radius_unit}>m</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clues */}
              <div className={styles.review_clues_section}>
                <h2 className={styles.review_section_title}>Clues</h2>
                <p className={styles.review_clue_subtitle}>Text hint</p>
                <div className={styles.review_text_hint_block}>
                  <p className={styles.review_clue_text}>{textHint}</p>
                  <img src={cornerDecoration} alt="" className={styles.review_corner_decoration} />
                </div>
                <p className={styles.review_clue_subtitle}>Visual hints</p>
                {hintPreviews.length > 0 ? (
                  <div className={styles.review_hints_row}>
                    {hintPreviews.map((url, i) => (
                      <div key={i} className={styles.review_hint_wrap}>
                        <img src={url} alt={`hint ${i + 1}`} className={styles.review_hint_photo} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.review_no_hints}>No visual hints added</p>
                )}
              </div>

              {/* About You */}
              <div className={styles.review_section}>
                <h2 className={styles.review_section_title}>About You</h2>
                <div className={styles.review_about_card}>
                  <div className={styles.review_about_header}>
                    <img src={ONA_AVATAR} alt={profile.name} className={styles.review_about_avatar} />
                    <div className={styles.review_about_name_wrap}>
                      <p className={styles.review_about_name}>{profile.name}</p>
                      {profile.keywords?.[1] && (
                        <p className="info_node">{profile.keywords[1]}</p>
                      )}
                    </div>
                  </div>
                  <p className={styles.review_about_bio}>{profile.bio?.full}</p>
                  <div className={styles.review_about_socials}>
                    {['lisa', 'ona', 'jens'].some(n => profile.name?.toLowerCase().includes(n)) && (
                      <img src={instagramIcon} alt="Instagram" />
                    )}
                    {['lisa', 'ona'].some(n => profile.name?.toLowerCase().includes(n)) && (
                      <img src={pinterestIcon} alt="Pinterest" />
                    )}
                    {profile.name?.toLowerCase().includes('lisa') && (
                      <img src={behanceIcon} alt="Behance" />
                    )}
                  </div>
                </div>
              </div>
            </>
          )
        })()}

        {step === 5 && (
          <div className={styles.success_content}>
            <h2 className={styles.success_title}>Gem Created!</h2>
            <p className={styles.success_sub}>Your gem is ready to be discovered.</p>
            <img src={gemCreatedIllustration} alt="" className={styles.success_illustration} />
            <button
              className={styles.continue_btn}
              onClick={() => { setStep(1); navigate(`/profile/${id}/gems/add`) }}
            >
              Add another gem
            </button>
            <button
              className={styles.secondary_btn}
              onClick={() => navigate(`/profile/${id}`)}
            >
              Back to profile
            </button>
          </div>
        )}

        {/* Step dots + continue */}
        {step < 5 && (
          <>
            <div className={styles.steps}>
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                i + 1 === step
                  ? <img key={i} src={xIcon} alt="" className={styles.step_active} />
                  : <span key={i} className={styles.step} />
              ))}
            </div>

            <button
              className={`${styles.continue_btn} ${!canContinue || submitting ? styles.continue_disabled : ''}`}
              onClick={handleContinue}
              disabled={submitting}
            >
              {submitting ? 'Uploading...' : step === 4 ? 'Submit Gem' : 'Continue'}
            </button>
            {submitError && (
              <p className={styles.submit_error}>Something went wrong. Please try again.</p>
            )}
          </>
        )}

      </div>

      {/* Sticker editor overlay */}
      {stickerEditing && (
        <div className={styles.editor_overlay}>
          <div className={styles.editor_header}>
            <button
              className={styles.editor_cancel}
              onClick={() => { setStickerEditing(false); setPendingBlob(null) }}
              type="button"
            >
              Cancel
            </button>
            <p className={styles.editor_title}>Erase background</p>
            <button
              className={styles.editor_done}
              onClick={handleStickerDone}
              type="button"
            >
              Done
            </button>
          </div>

          <div className={styles.editor_canvas_wrap}>
            <canvas
              ref={canvasEditorRef}
              width={600}
              height={700}
              className={styles.editor_canvas}
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              onPointerLeave={handleCanvasPointerUp}
            />
          </div>

          <div className={styles.editor_footer}>
            <p className={styles.editor_hint}>Draw over anything you want to remove</p>
            <div className={styles.eraser_row}>
              <div
                className={styles.eraser_preview}
                style={{ width: Math.max(8, eraserSize), height: Math.max(8, eraserSize) }}
              />
              <input
                type="range"
                min={8}
                max={60}
                value={eraserSize}
                className={styles.slider}
                style={{ '--p': `${((eraserSize - 8) / 52) * 100}%` }}
                onChange={e => setEraserSize(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
