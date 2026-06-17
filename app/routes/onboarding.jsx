import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import styles from '../styles/onboarding.module.css'
import topPattern from '../assets/top_pattern_onbording_green.svg'
import { storageUrl } from '../lib/storage'
import antwerpPattern from '../assets/antwerp_pixels.svg'
import crossStitch from '../assets/cross_stich.svg'
import xIcon from '../assets/x_icon.svg'
import orangeDiamond from '../assets/orange_dimond.svg'
import greenDiamond from '../assets/green_dimond.svg'

export function meta() {
  return [{ title: "Welcome" }];
}

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const nav = document.querySelector('nav')
    if (nav) nav.style.display = 'none'
    return () => {
      if (nav) nav.style.display = ''
    }
  }, [])

  function handleSkip() {
    navigate('/lens/ann')
  }

  function handleContinue() {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1)
    } else {
      navigate('/lens/ann')
    }
  }

  return (
    <div className={styles.page}>

      <img src={topPattern} alt="" className={styles.topPattern} />

      <div className={styles.topBar}>
        <div>
          {step > 0 && (
            <button className={styles.backBtn} onClick={() => setStep(step - 1)}>
              &larr;
            </button>
          )}
        </div>
        <button className={styles.skip} onClick={handleSkip}>
          Skip &rsaquo;
        </button>
      </div>

      {step === 0 && (
        <div className={styles.slide}>
          <div className={styles.content}>
            <p className={styles.label}>Discover Antwerp</p>
            <h1 className={styles.heading}>
              Through the eyes of{' '}
              <span className={styles.orange}>Antwerp Six</span>
            </h1>
            <p className={styles.body}>
              At the start of your experience, you will choose one designer from the{' '}
              <span className={styles.greenBold}>Antwerp Six</span> and explore the city
              through their lenses, discovering hidden gems inspired by them.
            </p>
          </div>

          <div className={styles.imageSection}>
            <img src={antwerpPattern} alt="" className={styles.cityBg} />
          </div>

          <img src={storageUrl('gems/onboarding/antwerp_6.webp')} alt="Antwerp Six designers" className={styles.groupPhoto} />
          <img src={crossStitch} alt="" className={styles.bottomPattern} />
        </div>
      )}

      {step === 1 && (
        <div className={styles.slide}>
          <div className={styles.content}>
            <h1 className={styles.heading}>
              Start<br />
              <span className={styles.orange}>Exploring</span>
            </h1>
            <p className={styles.body}>
              Find hidden gems and creative locals' spots inspired by your selected designer.
            </p>
          </div>
          <div className={styles.mapImageSection}>
            <img src={storageUrl('gems/onboarding/map_screen_onboarding.webp')} alt="Map screen" className={styles.mapImage} />
          </div>
          <img src={orangeDiamond} alt="" className={styles.orangeDiamond} />
          <img src={greenDiamond} alt="" className={styles.greenDiamond} />
        </div>
      )}

      <div className={step === 0 ? styles.footer : styles.footerLight}>
        <div className={styles.dots}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) =>
            i === step
              ? <img key={i} src={xIcon} alt="" className={styles.dotActive} />
              : <span key={i} className={styles.dot} />
          )}
        </div>
        <button className={styles.continueBtn} onClick={handleContinue}>
          Continue
        </button>
      </div>

    </div>
  )
}
