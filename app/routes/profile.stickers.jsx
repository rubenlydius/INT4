import { useNavigate, useParams } from 'react-router'
import styles from '../styles/profile.stickers.module.css'
import { storageUrl } from '../lib/storage'

import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import topPattern from '../assets/profile_details_top_pattern.svg'
import stickerSection from '../assets/your_sticker_section.png'

export function meta() {
  return [{ title: "Sticker Collection" }]
}

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

export default function ProfileStickers() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.header_area}>
        <img src={topPattern} alt="" className={styles.top_pattern} />
        <div className="top">
          <button className={styles.back_btn} onClick={() => navigate(`/profile/${id}`)}>
            <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
          </button>
          <h1>Sticker Collection</h1>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.summary_card}>
          <div className={styles.summary_text}>
            <p className={styles.summary_count}>{STICKERS.length} Collected<br />stickers</p>
            <p className={styles.summary_sub}>Keep exploring to find more!</p>
          </div>
          <div className={styles.summary_img_wrap}>
            <img src={stickerSection} alt="" className={styles.summary_img} />
          </div>
        </div>

        <div className={styles.grid}>
          {STICKERS.map((sticker, i) => (
            <img key={i} src={sticker} alt={`sticker ${i + 1}`} className={styles.sticker} />
          ))}
        </div>
      </div>
    </div>
  )
}
