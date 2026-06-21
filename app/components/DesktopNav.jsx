/* Desktop only — hidden on mobile via .nav { display: none } */
import { NavLink, useLocation } from 'react-router'
import { useState, useEffect } from 'react'
import styles from './desktopnav.module.css'

export default function DesktopNav() {
  const location = useLocation()
  const [lensHref, setLensHref] = useState('/lens/ann')
  const [profileHref, setProfileHref] = useState('/profile/ona')

  useEffect(() => {
    function updateHrefs() {
      const lens = localStorage.getItem('selectedLens') || 'ann'
      setLensHref(`/lens/${lens}`)
      const userType = localStorage.getItem('userType')
      setProfileHref(userType === 'visitor' ? '/profile/tom' : '/profile/ona')
    }
    updateHrefs()
    window.addEventListener('userTypeChanged', updateHrefs)
    return () => window.removeEventListener('userTypeChanged', updateHrefs)
  }, [])

  const items = [
    { to: lensHref,    label: 'Lens',    match: '/lens' },
    { to: '/map',      label: 'Map',     match: ['/map', '/gem'] },
    { to: '/camera',   label: 'Camera',  match: '/camera' },
    { to: profileHref, label: 'Profile', match: '/profile' },
  ]

  return (
    <nav className={styles.nav}>
      <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="INT4" className={styles.logo} />
      <div className={styles.links}>
        {items.map((item) => {
          const matches = Array.isArray(item.match) ? item.match : [item.match]
          const isActive = matches.some(m => location.pathname.startsWith(m))
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={isActive ? `${styles.link} ${styles.active}` : styles.link}
            >
              {item.label}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
