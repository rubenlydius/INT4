
import { useState } from 'react'
import styles from './dropdown.module.css'
import dropdownTop from '../assets/hintDropdownTop.svg'
import dropdownBottom from '../assets/hintDropdownBottom.svg'
import dropdownArrow from '../assets/dropdownArrow.svg'
import dropdownSeperator from '../assets/dropdownSeperator.svg'
import textHint from '../assets/text_hint.svg'
import visualHint from '../assets/visual_hint.svg'
import hotcoldHint from '../assets/hotcold_hint.svg'
import lockIcon from '../assets/lock_icon.svg'



export default function Dropdown({ title, content, icon, images }) {
    const [isOpen, setIsOpen] = useState(false)

    const [unlockedHints, setUnlockedHints] = useState([])

  
    return (
      <div className={styles.dropdownWrapper}>
        <div className={styles.dropdown}>
          <img src={dropdownTop} alt="" className={styles.dropdownEdge} />
          <div className={styles.dropdownInner}>
            <div className={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>
              <div className={styles.dropdownTitle}>
                {icon && <img src={icon} alt="" className={styles.dropdownIcon} />}
                <h3>{title}</h3>
              </div>
              <img
                src={dropdownArrow}
                alt=""
                className={`${styles.dropdownArrow} ${isOpen ? styles.dropdownArrowOpen : ''}`}
              />
            </div>
            {isOpen && (
              <>
                <img src={dropdownSeperator} alt="" className={styles.dropdownSep} />
                {images && images.length > 0 ? (
                  <div className={styles.dropdownImages}>
                  {images.map((src, i) => (
                    <div key={i} className={`${styles.dropdownImageWrapper} ${i > 0 ? styles.dropdownImageLocked : ''}`}>
                        <img src={src} alt={`hint ${i + 1}`} className={styles.dropdownImage} />
                            {i > 0 && !unlockedHints.includes(i) && (
                                <div 
                                className={styles.dropdownImageOverlay}
                                onClick={() => setUnlockedHints(prev => [...prev, i])}
                                >
                                    <img src={lockIcon} alt="locked" className={styles.lockIcon} />
                                    <p className={styles.lockText}>
                                    You may unlock this hint in {i === 1 ? 5 : 10} minutes.
                                    </p>
                                </div>
                            )}
                    </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.dropdownText}>{content}</p>
                )}
              </>
            )}
          </div>
          <img src={dropdownBottom} alt="" className={styles.dropdownEdge} />
        </div>
      </div>
    )
  }