import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styles from '../styles/profile.settings.language.module.css'

import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import topPattern from '../assets/profile_details_top_pattern.svg'
import dropdownArrow from '../assets/dropdownArrow.svg'

export function meta() {
  return [{ title: "Settings" }]
}

const LANGUAGES = [
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'nl', label: 'Dutch', flag: '🇳🇱' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

export default function ProfileSettingsLanguage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selected, setSelected] = useState('en')
  const [open, setOpen] = useState(false)

  const selectedLang = LANGUAGES.find(l => l.code === selected)

  return (
    <div className={styles.page}>
      <div className={styles.header_area}>
        <img src={topPattern} alt="" className={styles.top_pattern} />
        <div className="top">
          <button className={styles.back_btn} onClick={() => navigate(`/profile/${id}/settings`)}>
            <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
          </button>
          <h1>Settings</h1>
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.page_heading}>Select Language</h2>

        <div className={styles.dropdown_card} onClick={() => setOpen(p => !p)}>
          <span className={styles.flag}>{selectedLang.flag}</span>
          <span className={styles.lang_name}>{selectedLang.label}</span>
          <img
            src={dropdownArrow}
            alt=""
            className={`${styles.chevron} ${open ? styles.chevron_open : ''}`}
          />
        </div>

        {open && (
          <div className={styles.options_card}>
            {LANGUAGES.map((lang, i) => (
              <div key={lang.code}>
                {i > 0 && <div className={styles.divider} />}
                <div
                  className={`${styles.option} ${selected === lang.code ? styles.option_active : ''}`}
                  onClick={() => { setSelected(lang.code); setOpen(false) }}
                >
                  <span className={styles.flag}>{lang.flag}</span>
                  <span className={styles.lang_name}>{lang.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
