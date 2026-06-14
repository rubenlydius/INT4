// app/components/Dropdown.jsx
import { useState } from 'react'
import styles from './Dropdown.module.css'
import dropdownTop from '../assets/hintDropdownTop.svg'
import dropdownBottom from '../assets/hintDropdownBottom.svg'
import dropdownArrow from '../assets/dropdownArrow.svg'
import dropdownSeperator from '../assets/dropdownSeperator.svg'

export default function Dropdown({ title, content }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.dropdownWrapper}>
      <div className={styles.dropdown}>
        <img src={dropdownTop} alt="" className={styles.dropdownEdge} />
        <div className={styles.dropdownInner}>
          <div className={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>
            <h3>{title}</h3>
            <img
              src={dropdownArrow}
              alt=""
              className={`${styles.dropdownArrow} ${isOpen ? styles.dropdownArrowOpen : ''}`}
            />
          </div>
          {isOpen && (
            <>
              <img src={dropdownSeperator} alt="" className={styles.dropdownSep} />
              <p className={styles.dropdownText}>{content}</p>
            </>
          )}
        </div>
        <img src={dropdownBottom} alt="" className={styles.dropdownEdge} />
      </div>
    </div>
  )
}