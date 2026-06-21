import { useNavigate, useParams } from 'react-router'
import { profiles } from '../lib/profiles'
import styles from '../styles/profile.viewmasters.module.css'

import { storageUrl } from '../lib/storage'
import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import topPattern from '../assets/profile_details_top_pattern.svg'
import plusIconStroke from '../assets/plus_icon_stroke.svg'

const viewmasterSection = storageUrl('gems/profile/your_viewmsater_section.webp')

export function meta() {
  return [{ title: "Your ViewMasters" }]
}

export default function ProfileViewmasters() {
  const { id } = useParams()
  const navigate = useNavigate()
  const profile = profiles[id] || profiles.ona
  const viewmasters = profile.viewmasters

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
            <p className={styles.summary_count}>{viewmasters.length} ViewMasters<br />created</p>
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
          {viewmasters.map((vm, i) => (
            <img key={vm} src={vm} alt={`ViewMaster ${i + 1}`} className={styles.disc} />
          ))}
        </div>
      </div>
    </div>
  )
}
