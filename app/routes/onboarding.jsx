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
import takePicPattern from '../assets/take_pic_pattern.svg'
import starPattern from '../assets/star_pattern.svg'
import titlePattern from '../assets/title_pattern.svg'
import circleBackground from '../assets/circle_background_onbording.svg'
import flashIcon from '../assets/flash.svg'
import flipCamera from '../assets/flip_camera_onbording.svg'
import cameraClickButton from '../assets/camera_click_button.svg'
import gallerySquare from '../assets/galery_square.svg'
import stickersCamera from '../assets/stickers_camera_onbording.png'
import stickerOnboarding from '../assets/sticker_onbording.svg'
import viewmasterDiscBg from '../assets/viewmaster_disc_background.svg'
import cameraIconOnboarding from '../assets/camera_icon_onbording.svg'
import penIconOnboarding from '../assets/pen_icon_onbording.svg'
import shareIconOnboarding from '../assets/share_icon_onbording.svg'
import iconOnboarding from '../assets/icon_onbroding.svg'

export function meta() {
  return [{ title: "Welcome" }];
}

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const nav = document.querySelector('nav')
    if (nav) nav.style.display = 'none'
    return () => {
      if (nav) nav.style.display = ''
    }
  }, [])

  useEffect(() => {
    if (step === 2) {
      setAnimating(true)
      const timer = setTimeout(() => setAnimating(false), 2200)
      return () => clearTimeout(timer)
    }
  }, [step])

  function handleSkip() {
    navigate('/lens/ann')
  }

  function handleContinue() {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1)
    } else {
      navigate('/signup')
    }
  }

  return (
    <div className={styles.page}>

      <div className={styles.topPatternRow}>
        <img src={topPattern} alt="" className={styles.topPattern} />
        <img src={topPattern} aria-hidden="true" className={styles.topPattern} />
        <img src={topPattern} aria-hidden="true" className={styles.topPattern} />
      </div>

      <div className={styles.topBar}>
        <div>
          {step > 0 && (
            <button className={styles.backBtn} onClick={() => setStep(step - 1)}>
              <img src={iconOnboarding} alt="back" />
            </button>
          )}
        </div>
        <button className={styles.skip} onClick={handleSkip}>
          Skip <img src={iconOnboarding} alt="" className={styles.skipArrow} />
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

          <div className={styles.blackGround} />
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

      {step === 2 && (
        <div className={styles.slide}>
          <div className={styles.content}>
            <div className={styles.headingWithPattern}>
              <h1 className={styles.heading}>
                Find the<br />
                <span className={styles.orange}>Hidden Gem</span>
              </h1>
              <img src={titlePattern} alt="" className={styles.titlePattern} />
            </div>
            <p className={styles.body}>Walk around, follow the clues and try to find the hidden gem.</p>
          </div>

          <img src={circleBackground} alt="" className={styles.circleBackground} />

          <div className={styles.cameraSection}>
            <div className={styles.cameraWrapper}>
              <div className={styles.takePicRow}>
                <div className={styles.takePicLabel}>Take<br />a pic!</div>
                <img src={takePicPattern} alt="" className={styles.takePicPattern} />
              </div>
              <img
                src={stickersCamera}
                alt="Camera view"
                className={styles.cameraImage}
              />
              <img src={flashIcon} alt="" className={styles.flashIcon} />
              <div className={styles.cameraControls}>
                <img src={gallerySquare} alt="" />
                <img src={cameraClickButton} alt="" className={animating ? styles.cameraBtnAnim : ''} />
                <img src={flipCamera} alt="" />
              </div>
            </div>
          </div>

          <div className={styles.noteRow}>
            <img src={starPattern} alt="" className={styles.starPattern} />
            <p className={styles.noteText}>
              Don't forget to take pictures along the way. Unlock{' '}
              <span className={styles.orange}>stickers</span> for each discovered gem!
            </p>
          </div>

          {animating && (
            <div className={styles.stickerOverlay}>
              <img src={stickerOnboarding} alt="" className={styles.stickerAnim} />
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className={styles.slide}>
          <div className={styles.content}>
            <h1 className={styles.heading}>
              Your Digital<br />
              <span className={styles.orange}>ViewMaster</span>
            </h1>
            <p className={styles.body}>
              A ViewMaster is a vintage reel viewer that originally was used to flip through photos and stories.
            </p>
          </div>

          <div className={styles.discSection}>
            <img src={viewmasterDiscBg} alt="" className={styles.discBackground} />
            <img src={storageUrl('gems/onboarding/viewmaster_disc_onboarding.webp')} alt="ViewMaster disc" className={styles.discImage} />
          </div>

          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <div className={styles.iconCircle}>
                <img src={cameraIconOnboarding} alt="" />
              </div>
              <div className={styles.featureText}>
                <p className={styles.featureTitle}>Collect</p>
                <p className={styles.featureBody}>Discover hidden gems and take pictures of them.</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.iconCircle}>
                <img src={penIconOnboarding} alt="" />
              </div>
              <div className={styles.featureText}>
                <p className={styles.featureTitle}>Create & Customize</p>
                <p className={styles.featureBody}>Build your collection of Antwerp memories with pictures and collected stickers.</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.iconCircle}>
                <img src={shareIconOnboarding} alt="" />
              </div>
              <div className={styles.featureText}>
                <p className={styles.featureTitle}>Download & Share</p>
                <p className={styles.featureBody}>Download your ViewMaster and share it with others.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={step === 0 ? styles.footer : step === 3 ? styles.footerCompact : styles.footerLight}>
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
