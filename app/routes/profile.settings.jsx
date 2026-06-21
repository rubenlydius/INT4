import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styles from '../styles/profile.settings.module.css'
import { profiles } from '../lib/profiles'

import closeButton from '../assets/close_button.svg'
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
import languageIcon from '../assets/language_icon.svg'
import refreshIcon from '../assets/refresh_icon_orange.svg'

export function meta() {
  return [{ title: "Settings" }]
}

export default function ProfileSettings() {
  const { id } = useParams()
  const navigate = useNavigate()
  const profile = profiles[id] || profiles.ona

  const [profileMode, setProfileMode] = useState(
    localStorage.getItem('userType') || (profile.type === 'owner' ? 'local' : 'visitor')
  )
  const [notificationsOn, setNotificationsOn] = useState(false)
  const [showVerifyPopup, setShowVerifyPopup] = useState(false)

  return (
    <>
      <div className={styles.page}>
      <div className={styles.header_area}>
        <img src={topPattern} alt="" className={styles.top_pattern} />
        <div className="top">
          <button className={styles.back_btn} onClick={() => {
            const userType = localStorage.getItem('userType')
            navigate(userType === 'visitor' ? '/profile/tom' : '/profile/ona')
          }}>
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
                onClick={() => {
                  setProfileMode('visitor')
                  localStorage.setItem('userType', 'visitor')
                  window.dispatchEvent(new Event('userTypeChanged'))
                }}
              >Visitor</button>

              <button
                className={profileMode === 'local' ? styles.mode_active : styles.mode_inactive}
                onClick={() => {
                  setProfileMode('local')
                  localStorage.setItem('userType', 'local')
                  window.dispatchEvent(new Event('userTypeChanged'))
                  setShowVerifyPopup(true)
                }}
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
              <img src={languageIcon} alt="" className={styles.icon} />
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
                  
        <div className={styles.row} onClick={() => navigate('/onboarding')}>
          <div className={styles.icon_wrap}>
            <img src={refreshIcon} alt="refresh icon" className={styles.icon} />
          </div>
          <p className={styles.row_title}>Restart onboarding</p>
          <img src={greyHalfArrow} alt="" className={styles.row_arrow} />
        </div>

        <div className={styles.divider} />

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

    {showVerifyPopup && (
      <div className={styles.popup_overlay} onClick={() => setShowVerifyPopup(false)}>
        <div className={styles.popup_card} onClick={e => e.stopPropagation()}>
          <button className={styles.popup_close} onClick={() => setShowVerifyPopup(false)}>
            <img src={closeButton} alt="close" />
          </button>
          <h2 className={styles.popup_title}>Check your inbox!</h2>
          <p className={styles.popup_body}>
            We've sent a verification email to your address. Open it and follow the link to confirm your local status.
          </p>
          <button className={styles.popup_btn} onClick={() => setShowVerifyPopup(false)}>
            Got it
          </button>
        </div>
      </div>
    )}
    </>
  )
}
