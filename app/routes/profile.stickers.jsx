import { useNavigate, useParams } from 'react-router'
import styles from '../styles/profile.stickers.module.css'
import { profiles } from '../lib/profiles'
import { storageUrl } from '../lib/storage'

import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import topPattern from '../assets/profile_details_top_pattern.svg'

const stickerSection = storageUrl('gems/profile/your_sticker_section.webp')

export function meta() {
  return [{ title: "Sticker Collection" }]
}

export default function ProfileStickers() {
  const { id } = useParams()
  const navigate = useNavigate()
  const profile = profiles[id] || profiles.ona
  const stickers = profile.stickers

  return (
    <div className={styles.page}>
      <div className={styles.header_area}>
        <img src={topPattern} alt="" className={styles.top_pattern} />
        <div className="top">
          <button type="button" className={styles.back_btn} onClick={() => navigate(`/profile/${id}`)}>
            <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
          </button>
          <h1>Sticker Collection</h1>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.summary_card}>
          <div className={styles.summary_text}>
            <p className={styles.summary_count}>{stickers.length} Collected<br />stickers</p>
            <p className={styles.summary_sub}>Keep exploring to find more!</p>
          </div>
          <div className={styles.summary_img_wrap}>
            <img src={stickerSection} alt="" className={styles.summary_img} />
          </div>
        </div>

        <div className={styles.grid}>
          {stickers.map((sticker, i) => (
            <img key={sticker} src={sticker} alt={`sticker ${i + 1}`} className={styles.sticker} />
          ))}
        </div>
      </div>
    </div>
  )
}
