import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { profiles } from '../lib/profiles'
import { storageUrl } from '../lib/storage'
import styles from '../styles/profile.viewmasters.module.css'

import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import topPattern from '../assets/profile_details_top_pattern.svg'
import plusIconStroke from '../assets/plus_icon_stroke.svg'

const viewmasterSection = storageUrl('gems/profile/your_viewmsater_section.webp')

const DISC_PX = 300
const SLOT_COUNT = 14
const SLOT_RADIUS = 105
const TICK_RADIUS = 130
const SCALE = 71 / DISC_PX

function slotStyle(index) {
    const angle = (index * 2 * Math.PI / SLOT_COUNT) - Math.PI / 2
    const x = DISC_PX / 2 + SLOT_RADIUS * Math.cos(angle)
    const y = DISC_PX / 2 + TICK_RADIUS * Math.sin(angle)
    const deg = index * 360 / SLOT_COUNT
    return { position: 'absolute', width: 34, height: 48, borderRadius: 8, overflow: 'hidden', left: x, top: y, transform: `translate(-50%, -50%) rotate(${deg}deg)` }
}

function tickStyle(index) {
    const angle = ((index + 0.5) * 2 * Math.PI / SLOT_COUNT) - Math.PI / 2
    const x = DISC_PX / 2 + TICK_RADIUS * Math.cos(angle)
    const y = DISC_PX / 2 + TICK_RADIUS * Math.sin(angle)
    const deg = (index + 0.5) * 360 / SLOT_COUNT
    return { position: 'absolute', width: 7, height: 14, background: 'white', left: x, top: y, transform: `translate(-50%, -50%) rotate(${deg}deg)` }
}

function resolvePhotoUrl(id) {
    if (id.startsWith('static-')) {
        const i = parseInt(id.replace('static-', ''), 10)
        return storageUrl(`gems/gallery/all/gallery_img${String(i + 1).padStart(2, '0')}.webp`)
    }
    return localStorage.getItem(id) || ''
}

function MiniDisc({ color, photoIds, stickers }) {
    return (
        <div style={{ width: 71, height: 71, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ width: DISC_PX, height: DISC_PX, borderRadius: '50%', backgroundColor: color, position: 'relative', overflow: 'hidden', transform: `scale(${SCALE})`, transformOrigin: 'top left' }}>
                {photoIds.slice(0, SLOT_COUNT).map((id, i) => (
                    <div key={id} style={slotStyle(i)}>
                        <img src={resolvePhotoUrl(id)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} style={tickStyle(i * 2)} />
                ))}
                {stickers.map((url, i) => (
                    <img key={url} src={url} alt="" style={{ position: 'absolute', width: 70, height: 70, objectFit: 'contain', top: '50%', left: '50%', transform: `translate(calc(-50% + ${(i % 3 - 1) * 45}px), calc(-50% + ${Math.floor(i / 3) * 45 - 20}px))`, zIndex: 9, pointerEvents: 'none' }} />
                ))}
                <div style={{ position: 'absolute', width: 26, height: 26, borderRadius: '50%', background: 'white', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }} />
            </div>
        </div>
    )
}

export function meta() {
    return [{ title: "Your ViewMasters" }]
}

export default function ProfileViewmasters() {
    const { id } = useParams()
    const navigate = useNavigate()
    const profile = profiles[id] || profiles.ona
    const profileViewmasters = profile.viewmasters

    const [createdViewmasters, setCreatedViewmasters] = useState([])

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('created_viewmasters') || '[]')
        setCreatedViewmasters(saved)
    }, [])

    const totalCount = profileViewmasters.length + createdViewmasters.length

    return (
        <div className={styles.page}>
            <div className={styles.header_area}>
                <img src={topPattern} alt="" className={styles.top_pattern} />
                <div className="top">
                    <button type="button" className={styles.back_btn} onClick={() => navigate(`/profile/${id}`)}>
                        <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
                    </button>
                    <h1>Your ViewMasters</h1>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.summary_card}>
                    <div className={styles.summary_text}>
                        <p className={styles.summary_count}>{totalCount} ViewMasters<br />created</p>
                        <p className={styles.summary_sub}>Keep exploring to create more!</p>
                    </div>
                    <div className={styles.summary_img_wrap}>
                        <img src={viewmasterSection} alt="" className={styles.summary_img} />
                    </div>
                </div>

                <div className={styles.grid}>
                    <button type="button" className={styles.add_btn} onClick={() => navigate('/camera/viewmaster')}>
                        <img src={plusIconStroke} alt="add viewmaster" className={styles.plus_icon} />
                    </button>
                    {createdViewmasters.map(vm => (
                        <MiniDisc key={vm.id} color={vm.color} photoIds={vm.photoIds} stickers={vm.stickers} />
                    ))}
                    {profileViewmasters.map(vm => (
                        <img key={vm} src={vm} alt="ViewMaster disc" className={styles.disc} />
                    ))}
                </div>
            </div>
        </div>
    )
}
