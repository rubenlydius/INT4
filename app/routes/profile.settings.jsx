import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styles from '../styles/profile.settings.module.css'
import { profiles } from '../lib/profiles'

import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import greyHalfArrow from '../assets/settings_grey_half_arrow.svg'
import pencilIcon from '../assets/pencil_iccon.svg'
import topPattern from '../assets/profile_details_top_pattern.svg'
import profileIconSettings from '../assets/profile_icon_settings.svg'
import mapIconSettings from '../assets/map_icon_settings.svg'
import verifyIcon from '../assets/verify_icon.svg'
import notificationsIcon from '../assets/notifications_icon.svg'
import logOutIcon from '../assets/log_out_icon.svg'
import binIcon from '../assets/bin_icon.svg'

export function meta() {
  return [{ title: "Settings" }]
}

export default function ProfileSettings() {
  const { id } = useParams()
  const navigate = useNavigate()
  const profile = profiles[id] || profiles.ona

  const [profileMode, setProfileMode] = useState(profile.type === 'owner' ? 'local' : 'visitor')
  const [notificationsOn, setNotificationsOn] = useState(false)

  return (
    <div className={styles.page}>
      <div className={styles.header_area}>
        <img src={topPattern} alt="" className={styles.top_pattern} />
        <div className="top">
          <button className={styles.back_btn} onClick={() => navigate(`/profile/${id}`)}>
            <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
          </button>
          <h1>Settings</h1>
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.section_label}>Your profile</h2>
        <div className={styles.card}>
          <div className={styles.row} onClick={() => navigate(`/profile/${id}/settings/details`)}>
            <div className={styles.icon_wrap}>
              <img src={profileIconSettings} alt="" className={styles.icon} />
            </div>
            <div className={styles.row_text}>
              <p className={styles.row_title}>Profile details</p>
              <p className={styles.row_subtitle}>Edit your username and photo</p>
            </div>
            <button className={styles.edit_btn} tabIndex={-1}>
              <img src={pencilIcon} alt="" className={styles.edit_icon} />
            </button>
          </div>

          <div className={styles.divider} />

          <div className={styles.row}>
            <div className={styles.icon_wrap}>
              <img src={mapIconSettings} alt="" className={styles.icon} />
            </div>
            <div className={styles.row_text}>
              <p className={styles.row_title}>Profile mode</p>
              <p className={styles.row_subtitle}>Who are you?</p>
            </div>
            <div className={styles.mode_toggle}>
              <button
                className={profileMode === 'visitor' ? styles.mode_active : styles.mode_inactive}
                onClick={() => setProfileMode('visitor')}
              >Visitor</button>
              <button
                className={profileMode === 'local' ? styles.mode_active : styles.mode_inactive}
                onClick={() => setProfileMode('local')}
              >Local</button>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.row}>
            <div className={styles.icon_wrap}>
              <img src={verifyIcon} alt="" className={styles.icon} />
            </div>
            <div className={styles.row_text}>
              <p className={styles.row_title}>Local verification</p>
              <p className={styles.row_subtitle}>Verified</p>
            </div>
            <span className={profileMode === 'local' ? styles.verified_badge : styles.unverified_badge}>
              {profileMode === 'local' ? 'verified' : 'unverified'}
            </span>
          </div>
        </div>

        <h2 className={styles.section_label}>Preferences</h2>
        <div className={styles.card}>
          <div className={styles.row}>
            <div className={styles.icon_wrap}>
              <img src={notificationsIcon} alt="" className={styles.icon} />
            </div>
            <div className={styles.row_text}>
              <p className={styles.row_title}>Manage notifications</p>
              <p className={styles.row_subtitle}>{notificationsOn ? 'On' : 'Off'}</p>
            </div>
            <button
              className={`${styles.toggle} ${notificationsOn ? styles.toggle_on : ''}`}
              onClick={() => setNotificationsOn(p => !p)}
              aria-label={notificationsOn ? 'Turn off notifications' : 'Turn on notifications'}
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.row} onClick={() => navigate(`/profile/${id}/settings/language`)}>
            <div className={styles.icon_wrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div className={styles.row_text}>
              <p className={styles.row_title}>Language</p>
              <p className={styles.row_subtitle}>English</p>
            </div>
            <img src={greyHalfArrow} alt="" className={styles.row_arrow} />
          </div>
        </div>

        <h2 className={styles.section_label}>Account</h2>
        <div className={styles.card}>
          <div className={styles.row}>
            <div className={styles.icon_wrap}>
              <img src={logOutIcon} alt="" className={styles.icon} />
            </div>
            <p className={styles.row_title}>Log out</p>
            <img src={greyHalfArrow} alt="" className={styles.row_arrow} />
          </div>

          <div className={styles.divider} />

          <div className={styles.row}>
            <div className={styles.icon_wrap}>
              <img src={binIcon} alt="" className={styles.icon} />
            </div>
            <p className={`${styles.row_title} ${styles.row_title_danger}`}>Delete account</p>
            <img src={greyHalfArrow} alt="" className={styles.row_arrow} />
          </div>
        </div>
      </div>
    </div>
  )
}
