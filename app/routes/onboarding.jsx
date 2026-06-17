import { useState } from 'react'
import { useNavigate } from 'react-router'
import styles from '../styles/onboarding.module.css'
import topPattern from '../assets/top_pattern_onbording_green.svg'
import { storageUrl } from '../lib/storage'
import antwerpPattern from '../assets/antwerp_pixels.svg'
import crossStitch from '../assets/cross_stich.svg'
import xIcon from '../assets/x_icon.svg'

export function meta() {
  return [{ title: "Welcome" }];
}

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

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

      <div className={styles.footer}>
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
