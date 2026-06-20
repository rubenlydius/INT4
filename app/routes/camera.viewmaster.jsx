import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { storageUrl } from '../lib/storage'
import styles from '../styles/camera.viewmaster.module.css'

import mapHeader from '../assets/map_header.svg'
import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import whiteArrow from '../assets/white_arrow.svg'

export function meta() {
    return [{ title: "Make your ViewMaster" }]
}

const STATIC_PHOTO_COUNT = 12
const REQUIRED_COUNT = 14

export default function CameraViewmaster() {
    const navigate = useNavigate()
    const [allPhotos, setAllPhotos] = useState([])
    const [selectedIds, setSelectedIds] = useState([])

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

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <button className={styles.back_btn} onClick={() => navigate('/camera/gallery')}>
                    <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
                </button>
                <h1 className={styles.header_title}>Viewmaster Studio</h1>
                <div />
            </div>

            <img src={mapHeader} alt="" className={styles.header_pattern} />

            <div className={styles.content}>
                <h2 className={styles.page_title}>Make your ViewMaster</h2>
                <p className={styles.page_sub}>
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
                                className={`${styles.cell} ${isSelected ? styles.cell_selected : ''}`}
                                onClick={() => toggleSelect(photo.id)}
                            >
                                <img src={photo.src} alt={photo.alt} className={styles.photo} />
                                <div className={styles.overlay}>
                                    {isSelected ? (
                                        <svg className={styles.check_icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="11" fill="white" />
                                            <path d="M6 12.5L10 16.5L18 8" stroke="#F07832" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg className={styles.plus_icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className={styles.floating_btn_wrap}>
                <button
                    className={`${styles.next_btn} ${!canContinue ? styles.next_btn_disabled : ''}`}
                    disabled={!canContinue}
                    onClick={() => canContinue && navigate('/camera/viewmaster/preview')}
                >
                    Next Step
                    <img
                        src={canContinue ? whiteArrow : simpleOrangeArrow}
                        alt=""
                        className={styles.next_arrow}
                        style={!canContinue ? { transform: 'scaleX(1)' } : undefined}
                    />
                </button>
            </div>
        </div>
    )
}
