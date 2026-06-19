import { useNavigate, useParams } from 'react-router'
import styles from '../styles/profile.gems.module.css'
import { storageUrl } from '../lib/storage'
import { profiles } from '../lib/profiles'

import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import topPattern from '../assets/profile_details_top_pattern.svg'
import pencilIcon from '../assets/pencil_iccon.svg'
import plusButton from '../assets/plus_button.svg'

export function meta() {
  return [{ title: "Gems Added By You" }]
}

const GEMS = [
  {
    sticker: storageUrl('gems/stickers/gem1-sticker.avif'),
    name: 'Garden of Eve',
    daysLeft: 10,
  },
]

export default function ProfileGems() {
  const { id } = useParams()
  const navigate = useNavigate()
  const profile = profiles[id] || profiles.ona

  if (profile.type !== 'owner') {
    navigate(`/profile/${id}`)
    return null
  }

  return (
    <div className={styles.page}>
      <div className={styles.header_area}>
        <img src={topPattern} alt="" className={styles.top_pattern} />
        <div className="top">
          <button className={styles.back_btn} onClick={() => navigate(`/profile/${id}`)}>
            <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
          </button>
          <h1>Gems added by you</h1>
        </div>
      </div>

      <div className={styles.content}>
        {GEMS.map((gem, i) => (
          <div key={i} className={styles.gem_card}>
            <img src={gem.sticker} alt={gem.name} className={styles.gem_sticker} />
            <div className={styles.gem_info}>
              <p className={styles.gem_name}>{gem.name}</p>
              <span className={styles.gem_days}>{gem.daysLeft} days left</span>
            </div>
            <button className={styles.edit_btn}>
              <img src={pencilIcon} alt="edit" className={styles.edit_icon} />
            </button>
          </div>
        ))}

        <button className={styles.add_gem_btn}>
          <div className={styles.add_gem_inner}>
            <div className={styles.add_gem_plus}>
              <img src={plusButton} alt="" />
            </div>
            <span className={styles.add_gem_text}>Add new gem</span>
          </div>
        </button>
      </div>
    </div>
  )
}
