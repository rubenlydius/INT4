import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { storageUrl } from '../lib/storage'
import styles from '../styles/camera.viewmaster.module.css'

import mapHeader from '../assets/map_header.svg'
import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import whiteArrow from '../assets/white_arrow.svg'
import containerTop from '../assets/hintDropdownTop.svg'
import containerBottom from '../assets/hintDropdownBottom.svg'
import aboutyouContainerTop from '../assets/aboutyou_container_top.svg'
import stickerSeparator from '../assets/sticker_separator.svg'
import closeButton from '../assets/close_button.svg'
import pinterestIcon from '../assets/pinterest_icon.svg'
import instagramIcon from '../assets/instagram_icon.svg'
import discBackground from '../assets/viewmaster_disc_background.svg'
import antwerpPixels from '../assets/antwerp_pixels.svg'

const STICKERS = [
    storageUrl('gems/stickers/gem39-sticker.avif'),
    storageUrl('gems/stickers/gem19-sticker.avif'),
    storageUrl('gems/stickers/gem60-sticker.avif'),
    storageUrl('gems/stickers/gem6-sticker.avif'),
    storageUrl('gems/stickers/gem50-sticker.avif'),
    storageUrl('gems/stickers/gem34-sticker.avif'),
    storageUrl('gems/stickers/gem52-sticker.avif'),
    storageUrl('gems/stickers/gem53-sticker.avif'),
    storageUrl('gems/stickers/gem59-sticker.avif'),
]

export function meta() {
    return [{ title: "Make your ViewMaster" }]
}

const STATIC_PHOTO_COUNT = 12
const REQUIRED_COUNT = 14
const SLOT_COUNT = 14
const DISC_PX = 300
const SLOT_RADIUS = 105
const SLOT_W = 34
const SLOT_H = 48

const DISC_COLORS = [
    { label: 'Black',  value: '#1E1E1E' },
    { label: 'Sand',   value: '#D2D2BE' },
    { label: 'Blue',   value: '#5497FF' },
    { label: 'Lime',   value: '#D2FF4B' },
    { label: 'Orange', value: '#FF691E' },
    { label: 'Green',  value: '#00B569' },
    { label: 'White',  value: '#FBFBFB' },
    { label: 'Pink',   value: '#FF81DC' },
]

function slotStyle(index) {
    const angle = (index * 2 * Math.PI / SLOT_COUNT) - Math.PI / 2
    const x = DISC_PX / 2 + SLOT_RADIUS * Math.cos(angle)
    const y = DISC_PX / 2 + SLOT_RADIUS * Math.sin(angle)
    const deg = index * 360 / SLOT_COUNT
    return {
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${deg}deg)`,
    }
}

const TICK_RADIUS = 130

function tickStyle(index) {
    // offset by half a slot angle so ticks fall between photos
    const angle = ((index + 0.5) * 2 * Math.PI / SLOT_COUNT) - Math.PI / 2
    const x = DISC_PX / 2 + TICK_RADIUS * Math.cos(angle)
    const y = DISC_PX / 2 + TICK_RADIUS * Math.sin(angle)
    const deg = (index + 0.5) * 360 / SLOT_COUNT
    return {
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${deg}deg)`,
    }
}

export default function CameraViewmaster() {
    const navigate = useNavigate()
    const location = useLocation()
    const profileId = location.state?.profileId || 'ona'

    const [step, setStep] = useState(1)
    const [allPhotos, setAllPhotos] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [selectedColor, setSelectedColor] = useState(DISC_COLORS[0].value)
    const [placedStickers, setPlacedStickers] = useState([])
    const [colorScroll, setColorScroll] = useState(0)
    const [showShare, setShowShare] = useState(false)

    useEffect(() => {
        const basePhotos = Array.from({ length: STATIC_PHOTO_COUNT }, (_, i) => ({
            id: `static-${i}`,
            src: storageUrl(`gems/gallery/all/gallery_img${String(i + 1).padStart(2, '0')}.webp`),
            alt: `Gallery image ${i + 1}`
        }))

        const localKeys = Object.keys(localStorage)
            .filter(k => k.startsWith('gem_photo_'))
            .sort((a, b) => {
                const numA = parseInt(a.replace('gem_photo_', ''), 10)
                const numB = parseInt(b.replace('gem_photo_', ''), 10)
                return numA - numB
            })

        const userPhotos = localKeys.map(key => ({
            id: key,
            src: localStorage.getItem(key),
            alt: 'User captured photo'
        }))

        setAllPhotos([...basePhotos, ...userPhotos])
    }, [])


    function toggleSelect(id) {
        setSelectedIds(prev => {
            if (prev.includes(id)) return prev.filter(s => s !== id)
            if (prev.length >= REQUIRED_COUNT) return prev
            return [...prev, id]
        })
    }

    const canContinue = selectedIds.length === REQUIRED_COUNT
    const selectedPhotos = allPhotos.filter(p => selectedIds.includes(p.id))

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <button
                    type="button"
                    className={styles.back_btn}
                    onClick={() => step === 1 ? navigate('/camera/gallery') : setStep(1)}
                >
                    <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
                </button>
                <h1 className={styles.header_title}>Viewmaster Studio</h1>
                <div />
            </div>

            <img src={mapHeader} alt="" className={styles.header_pattern} />

            {/* Step 1: Photo selection */}
            {step === 1 && (
                <div className={styles.content}>
                    <h2 className={styles.page_title}>Make your ViewMaster</h2>
                    <p className={styles.page_sub_muted}>
                        Select {REQUIRED_COUNT} photos
                        {selectedIds.length > 0 && (
                            <span className={styles.count_badge}> · {selectedIds.length}/{REQUIRED_COUNT}</span>
                        )}
                    </p>

                    <div className={styles.grid}>
                        {allPhotos.map(photo => {
                            const isSelected = selectedIds.includes(photo.id)
                            return (
                                <button
                                    key={photo.id}
                                    type="button"
                                    className={`${styles.cell} ${isSelected ? styles.cell_selected : ''}`}
                                    onClick={() => toggleSelect(photo.id)}
                                >
                                    <img src={photo.src} alt={photo.alt} className={styles.photo} />
                                    <div className={styles.overlay}>
                                        {isSelected ? (
                                            <svg className={styles.check_icon} viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="11" fill="white" />
                                                <path d="M6 12.5L10 16.5L18 8" stroke="#F07832" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : (
                                            <svg className={styles.plus_icon} viewBox="0 0 24 24" fill="none">
                                                <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Step 2: Style disc */}
            {step === 2 && (
                <div className={styles.content}>
                    <h2 className={styles.page_title}>Style your ViewMaster</h2>
                    <p className={styles.page_sub}>
                        Combine your photos, patterns, and collected stickers into a personalized Antwerp souvenir.
                    </p>

                    {/* Disc */}
                    <div className={styles.disc_wrap}>
                        <div className={styles.disc} style={{ backgroundColor: selectedColor }}>
                            {selectedPhotos.slice(0, SLOT_COUNT).map((photo, i) => (
                                <div key={photo.id} className={styles.slot} style={slotStyle(i)}>
                                    <img src={photo.src} alt="" className={styles.slot_img} />
                                </div>
                            ))}
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={`tick-${i}`} className={styles.tick} style={tickStyle(i * 2)} />
                            ))}
                            <div className={styles.disc_center} />
                            <div className={styles.disc_arrow_indicator}>↑</div>
                            {placedStickers.map((url, i) => (
                                <img
                                    key={url}
                                    src={url}
                                    alt=""
                                    className={styles.placed_sticker}
                                    style={{ transform: `translate(calc(-50% + ${(i % 3 - 1) * 45}px), calc(-50% + ${Math.floor(i / 3) * 45 - 20}px))` }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Color picker — gallery-style container */}
                    <div className={styles.color_container}>
                        <img src={containerTop} alt="" className={styles.container_edge} />
                        <div className={styles.color_container_body}>
                            <h3 className={styles.section_title}>Pick a disc color</h3>
                            <div className={styles.color_scroll_wrap}>
                                <div
                                    className={styles.color_row}
                                    onScroll={e => {
                                        const el = e.currentTarget
                                        setColorScroll(el.scrollLeft / (el.scrollWidth - el.clientWidth) || 0)
                                    }}
                                >
                                    {DISC_COLORS.map(c => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            className={`${styles.color_swatch} ${selectedColor === c.value ? styles.color_swatch_active : ''}`}
                                            style={{ backgroundColor: c.value }}
                                            onClick={() => setSelectedColor(c.value)}
                                            aria-label={c.label}
                                        >
                                            {selectedColor === c.value && (
                                                <svg viewBox="0 0 24 24" fill="none" className={styles.swatch_check}>
                                                    <path d="M5 12.5L9.5 17L19 7" stroke={['#FBFBFB','#D2FF4B','#D2D2BE'].includes(c.value) ? '#1E1E1E' : 'white'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.scroll_track}>
                                <div className={styles.scroll_thumb} style={{ left: `${colorScroll * 60}%` }} />
                            </div>
                        </div>
                        <img src={containerBottom} alt="" className={styles.container_edge} />
                    </div>

                    {/* Sticker picker — aboutyou-style container */}
                    <div className={styles.sticker_container}>
                        <img src={aboutyouContainerTop} alt="" className={styles.sticker_container_top} />
                        <div className={styles.sticker_container_body}>
                            <h3 className={styles.section_title}>Place your stickers</h3>
                            <p className={styles.sticker_sub}>Select up to 6 stickers</p>
                            <img src={stickerSeparator} alt="" className={styles.sticker_sep} />
                            <div className={styles.sticker_row}>
                                {STICKERS.map((url) => {
                                    const isSelected = placedStickers.includes(url)
                                    const isDisabled = !isSelected && placedStickers.length >= 6
                                    return (
                                    <button
                                        key={url}
                                        type="button"
                                        className={`${styles.sticker_btn} ${isSelected ? styles.sticker_btn_active : ''} ${isDisabled ? styles.sticker_btn_disabled : ''}`}
                                        onClick={() => setPlacedStickers(prev => {
                                            if (prev.includes(url)) return prev.filter(s => s !== url)
                                            if (prev.length >= 6) return prev
                                            return [...prev, url]
                                        })}
                                    >
                                        <img src={url} alt="" className={styles.sticker_thumb} />
                                        {isSelected && (
                                            <div className={styles.sticker_check}>
                                                <svg viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="11" fill="#F07832" />
                                                    <path d="M6 12.5L10 16.5L18 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                    )
                                })}
                            </div>
                            <img src={stickerSeparator} alt="" className={styles.sticker_sep} />
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom action */}
            {step === 1 && (
                <div className={styles.floating_btn_wrap}>
                    <button
                        type="button"
                        className={`${styles.next_btn} ${!canContinue ? styles.next_btn_disabled : ''}`}
                        disabled={!canContinue}
                        onClick={() => setStep(2)}
                    >
                        Next Step
                        <img
                            src={canContinue ? whiteArrow : simpleOrangeArrow}
                            alt=""
                            className={styles.next_arrow}
                        />
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className={styles.bottom_row}>
                    <button type="button" className={styles.prev_btn} onClick={() => setStep(1)}>
                        <img src={simpleOrangeArrow} alt="" className={styles.prev_arrow} />
                        Previous
                    </button>
                    <button type="button" className={styles.share_btn} onClick={() => {
                        const key = `created_viewmasters_${profileId}`
                        const saved = JSON.parse(localStorage.getItem(key) || '[]')
                        saved.unshift({ id: Date.now(), color: selectedColor, photoIds: selectedIds, stickers: placedStickers })
                        localStorage.setItem(key, JSON.stringify(saved))
                        setShowShare(true)
                    }}>
                        Share
                        <img src={whiteArrow} alt="" className={styles.share_arrow} />
                    </button>
                </div>
            )}
            {/* Share modal */}
            {showShare && (
                <div className={styles.modal_overlay} onClick={() => setShowShare(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <button type="button" className={styles.modal_close} onClick={() => setShowShare(false)}>
                            <img src={closeButton} alt="Close" className={styles.modal_close_img} />
                        </button>

                        <h2 className={styles.modal_title}>Share your ViewMaster</h2>
                        <p className={styles.modal_sub}>Share your digital disc or download it to your camera roll.</p>

                        <div className={styles.modal_disc_section}>
                            <img src={antwerpPixels} alt="" className={styles.modal_antwerp_bg} />
                            <div className={styles.modal_disc_wrap}>
                                <img src={discBackground} alt="" className={styles.modal_disc_bg} />
                                <div className={styles.modal_disc} style={{ backgroundColor: selectedColor }}>
                                    {selectedPhotos.slice(0, SLOT_COUNT).map((photo, i) => (
                                        <div key={photo.id} className={styles.slot} style={slotStyle(i)}>
                                            <img src={photo.src} alt="" className={styles.slot_img} />
                                        </div>
                                    ))}
                                    {Array.from({ length: 7 }).map((_, i) => (
                                        <div key={`tick-${i}`} className={styles.tick} style={tickStyle(i * 2)} />
                                    ))}
                                    <div className={styles.disc_center} />
                                    {placedStickers.map((url, i) => (
                                        <img
                                            key={url}
                                            src={url}
                                            alt=""
                                            className={styles.placed_sticker}
                                            style={{ transform: `translate(calc(-50% + ${(i % 3 - 1) * 45}px), calc(-50% + ${Math.floor(i / 3) * 45 - 20}px))` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.modal_actions}>
                            <button
                                type="button"
                                className={styles.modal_share_btn}
                                onClick={() => navigator.share?.({ title: 'My ViewMaster', text: 'Check out my ViewMaster disc!' })}
                            >
                                <svg viewBox="0 0 24 24" fill="none" className={styles.modal_share_icon}>
                                    <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M12 3v12M8 7l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Share
                            </button>

                            <button type="button" className={styles.modal_social_btn} aria-label="Pinterest">
                                <img src={pinterestIcon} alt="Pinterest" className={styles.modal_social_icon} />
                            </button>
                            <button type="button" className={`${styles.modal_social_btn} ${styles.modal_social_instagram}`} aria-label="Instagram">
                                <img src={instagramIcon} alt="Instagram" className={styles.modal_social_icon} />
                            </button>
                            <button type="button" className={`${styles.modal_social_btn} ${styles.modal_social_tiktok}`} aria-label="TikTok">
                                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.modal_social_icon_svg}>
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/>
                                </svg>
                            </button>
                            <button type="button" className={`${styles.modal_social_btn} ${styles.modal_social_download}`} aria-label="Download">
                                <svg viewBox="0 0 24 24" fill="none" className={styles.modal_social_icon_svg}>
                                    <path d="M12 3v13M7 11l5 5 5-5M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
