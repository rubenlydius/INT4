import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import styles from '../styles/profile.about.module.css'
import { profiles } from '../lib/profiles'

import simpleOrangeArrow from '../assets/simple_orange_arrow.svg'
import topPattern from '../assets/profile_details_top_pattern.svg'
import dropdownArrow from '../assets/dropdownArrow.svg'
import linkIcon from '../assets/link_icon.svg'
import xIcon from '../assets/x_icon.svg'

export function meta() {
  return [{ title: "Your Bio" }]
}

const FIELDS = [
  'Artist', 'Designer', 'Photographer', 'Filmmaker',
  'Musician', 'Writer', 'Performer', 'Architect',
  'Creative Technologist', 'Other',
]

const SOCIALS = ['Instagram', 'Portfolio', 'TikTok', 'Behance', 'Pinterest']

export default function ProfileAbout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const profile = profiles[id] || profiles.ona

  const initialField = FIELDS.find(f => profile.keywords.includes(f)) || FIELDS[0]

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedField, setSelectedField] = useState(initialField)
  const [bio, setBio] = useState(profile.bio.full || '')
  const [selectedSocials, setSelectedSocials] = useState([])
  const [links, setLinks] = useState({})
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (profile.type !== 'owner') navigate(`/profile/${id}`)
  }, [])

  if (profile.type !== 'owner') return null

  function handleSave() {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  const MAX = 500

  function toggleSocial(name) {
    setSelectedSocials(prev => {
      if (prev.includes(name)) {
        setLinks(l => { const next = { ...l }; delete next[name]; return next })
        return prev.filter(s => s !== name)
      }
      return [...prev, name]
    })
  }

  function setLink(name, value) {
    setLinks(l => ({ ...l, [name]: value }))
  }

  return (
    <div className={styles.page}>
      <div className={styles.header_area}>
        <img src={topPattern} alt="" className={styles.top_pattern} />
        <div className="top">
          <button className={styles.back_btn} onClick={() => navigate(`/profile/${id}`)}>
            <img src={simpleOrangeArrow} alt="back" className={styles.back_arrow} />
          </button>
          <h1>Your bio</h1>
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.section_title}>About you</h2>

        <p className={styles.step_label}><span className={styles.step_num}>1.</span> Select your creative field</p>

        <div className={styles.dropdown_wrap}>
          <button
            className={styles.dropdown_btn}
            onClick={() => setDropdownOpen(o => !o)}
          >
            <span className={styles.dropdown_value}>{selectedField}</span>
            <img
              src={dropdownArrow}
              alt=""
              className={`${styles.dropdown_arrow} ${dropdownOpen ? styles.dropdown_arrow_open : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown_list}>
              {FIELDS.map(field => (
                <button
                  key={field}
                  className={`${styles.dropdown_option} ${field === selectedField ? styles.dropdown_option_active : ''}`}
                  onClick={() => { setSelectedField(field); setDropdownOpen(false) }}
                >
                  {field}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className={styles.step_label}><span className={styles.step_num}>2.</span> Describe your passions and what inspires you.</p>

        <div className={styles.textarea_wrap}>
          <textarea
            className={styles.textarea}
            value={bio}
            onChange={e => e.target.value.length <= MAX && setBio(e.target.value)}
            placeholder="Tell people about yourself..."
            rows={7}
          />
          <p className={styles.char_count}>{bio.length}/{MAX}</p>
        </div>

        <h2 className={styles.section_title}>Share your work</h2>
        <p className={styles.section_sub}>Add a link to your social media or portfolio</p>

        <div className={styles.socials_row}>
          {SOCIALS.map(name => (
            <button
              key={name}
              className={`${styles.social_pill} ${selectedSocials.includes(name) ? styles.social_pill_active : ''}`}
              onClick={() => toggleSocial(name)}
            >
              {name}
              {selectedSocials.includes(name) && (
                <img src={xIcon} alt="remove" className={styles.pill_x} />
              )}
            </button>
          ))}
        </div>

        {selectedSocials.map(name => (
          <div key={name} className={styles.link_input_wrap}>
            <img src={linkIcon} alt="" className={styles.link_icon} />
            <input
              type="url"
              className={styles.link_input}
              placeholder={`Add your ${name} link`}
              value={links[name] || ''}
              onChange={e => setLink(name, e.target.value)}
            />
          </div>
        ))}

        <div className={styles.actions}>
          <button className={styles.cancel_btn} onClick={() => navigate(`/profile/${id}`)}>
            Cancel
          </button>
          <button className={styles.save_btn} onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>

      {showToast && (
        <div className={styles.toast}>
          <div className={styles.toast_check}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className={styles.toast_text}>Changes saved!</span>
        </div>
      )}
    </div>
  )
}
