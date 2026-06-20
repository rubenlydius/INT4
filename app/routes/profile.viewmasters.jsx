import { useNavigate, useParams } from 'react-router'
import styles from '../styles/profile.viewmasters.module.css'

import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import topPattern from '../assets/profile_details_top_pattern.svg'
import plusIconStroke from '../assets/plus_icon_stroke.svg'
import viewmasterSection from '../assets/your_viewmsater_section.png'
import viewmaster1 from '../assets/created_viewmaster_1.png'
import viewmaster2 from '../assets/created_viewmaster_2.png'
import viewmaster3 from '../assets/created_viewmaster_3.png'

export function meta() {
  return [{ title: "Your ViewMasters" }]
}

const VIEWMASTERS = [viewmaster1, viewmaster2, viewmaster3]

export default function ProfileViewmasters() {
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
          <h1>Your ViewMasters</h1>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.summary_card}>
          <div className={styles.summary_text}>
            <p className={styles.summary_count}>{VIEWMASTERS.length} ViewMasters<br />created</p>
            <p className={styles.summary_sub}>Keep exploring to create more!</p>
          </div>
          <div className={styles.summary_img_wrap}>
            <img src={viewmasterSection} alt="" className={styles.summary_img} />
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.add_btn} onClick={() => navigate('/camera/viewmaster')} style={{ cursor: 'pointer' }}>
            <img src={plusIconStroke} alt="add viewmaster" className={styles.plus_icon} />
          </div>
          {VIEWMASTERS.map((vm, i) => (
            <img key={i} src={vm} alt={`ViewMaster ${i + 1}`} className={styles.disc} />
          ))}
        </div>
      </div>
    </div>
  )
}
