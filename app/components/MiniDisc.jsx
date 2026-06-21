import { storageUrl } from '../lib/storage'

const DISC_PX = 300
const SLOT_COUNT = 14
const SLOT_RADIUS = 105
const TICK_RADIUS = 130

function slotStyle(index) {
    const angle = (index * 2 * Math.PI / SLOT_COUNT) - Math.PI / 2
    const x = DISC_PX / 2 + SLOT_RADIUS * Math.cos(angle)
    const y = DISC_PX / 2 + SLOT_RADIUS * Math.sin(angle)
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

export function resolvePhotoUrl(photoId) {
    if (photoId.startsWith('static-')) {
        const i = parseInt(photoId.replace('static-', ''), 10)
        return storageUrl(`gems/gallery/all/gallery_img${String(i + 1).padStart(2, '0')}.webp`)
    }
    return localStorage.getItem(photoId) || ''
}

export function MiniDisc({ color, photoIds, stickers, size = 71 }) {
    const scale = size / DISC_PX
    return (
        <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ width: DISC_PX, height: DISC_PX, borderRadius: '50%', backgroundColor: color, position: 'relative', overflow: 'hidden', transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                {photoIds.slice(0, SLOT_COUNT).map((photoId, i) => (
                    <div key={photoId} style={slotStyle(i)}>
                        <img src={resolvePhotoUrl(photoId)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
