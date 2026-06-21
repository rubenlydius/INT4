import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styles from '../styles/profile.settings.details.module.css'
import { profiles } from '../lib/profiles'
import { storageUrl } from '../lib/storage'

import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import topPattern from '../assets/profile_details_top_pattern.svg'
import pencilIcon from '../assets/pencil_iccon.svg'

const PROFILE_PHOTOS = {
  ona: storageUrl('gems/creators/ona.avif'),
  tom: storageUrl('gems/profile/tom.webp'),
}

export function meta() {
  return [{ title: "Settings" }]
}

export default function ProfileSettingsDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const profile = profiles[id] || profiles.ona
  const [nickname, setNickname] = useState(profile.name)

  return (
    <div className={styles.page}>
      <div className={styles.header_area}>
        <img src={topPattern} alt="" className={styles.top_pattern} />
        <div className="top">
          <button type="button" className={styles.back_btn} onClick={() => navigate(`/profile/${id}/settings`)}>
            <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
          </button>
          <h1>Settings</h1>
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.page_heading}>Profile Details</h2>

        <div className={styles.profile_row}>
          <div className={styles.avatar_wrap}>
            <img src={PROFILE_PHOTOS[id] || profile.avatar} alt="profile" className={styles.avatar} />
            <button type="button" className={styles.avatar_edit_btn} aria-label="Edit profile photo">
              <img src={pencilIcon} alt="" className={styles.pencil_icon} />
            </button>
          </div>

          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="settings-nickname">Nickname</label>
            <input
              id="settings-nickname"
              className={styles.input}
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              autoComplete="nickname"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
