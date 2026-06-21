import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import styles from '../styles/signup.module.css'
import topPattern from '../assets/sign_up_top_pattern.svg'
import visitorDisc from '../assets/visitior_disc_onbording.png'
import localDisc from '../assets/local_disc_onbording.png'
import iconOnboarding from '../assets/icon_onbroding.svg'
import visitorArrow from '../assets/visitor_arrow_onbording.svg'
import localArrow from '../assets/local_arrow_onbording.svg'
import whiteArrow from '../assets/white_arrow.svg'
import linePattern from '../assets/line_pattern_onbording.svg'
import googleIcon from '../assets/google_icon_onbording.svg'
import appleIcon from '../assets/apple_icon_onbording.svg'

export function meta() {
  return [{ title: "Get Started" }]
}

export default function SignUp() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [spinningDisc, setSpinningDisc] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const nav = document.querySelector('nav')
    if (nav) nav.style.display = 'none'
    return () => { if (nav) nav.style.display = '' }
  }, [])

  function handleSelect(role) {
    setSelected(prev => prev === role ? null : role)
    setSpinningDisc(role)
    setTimeout(() => setSpinningDisc(null), 700)
  }

  function handleBack() {
    if (step === 0) {
      navigate('/onboarding', { state: { step: 3 } })
    } else {
      setStep(0)
    }
  }

  const isValid = name.trim() && email.trim() && password.trim()

  return (
    <div className={`${styles.page} ${step === 1 ? styles.pageForm : ''}`}>
      <div className={styles.topPatternRow}>
        <img src={topPattern} alt="" className={styles.topPattern} />
        <img src={topPattern} aria-hidden="true" className={styles.topPattern} />
        <img src={topPattern} aria-hidden="true" className={styles.topPattern} />
      </div>

      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={handleBack}>
          <img src={iconOnboarding} alt="back" />
        </button>
      </div>

      {step === 0 && (
        <>
          <div className={styles.intro}>
            <h1 className={styles.heading}>Get <span className={styles.orange}>Started</span></h1>
            <p className={styles.subheading}>Who are you?</p>
          </div>

          <div className={styles.cards}>
            <div className={styles.visitorRow} onClick={() => handleSelect('visitor')}>
              <div className={`${styles.visitorCard} ${selected === 'visitor' ? styles.visitorCardActive : ''}`}>
                <div className={styles.visitorConnector} />
                <div className={styles.visitorContent}>
                  <p className={styles.cardLabel}>I'm a</p>
                  <p className={`${styles.cardTitle} ${selected === 'visitor' ? styles.titleWhite : styles.titleGreen}`}>Visitor</p>
                  <p className={styles.cardText}>Start discovering hidden gems of Antwerp through a creative perspective.</p>
                  <img src={visitorArrow} alt="" className={`${styles.arrowIcon} ${selected === 'visitor' ? styles.arrowIconWhite : ''}`} />
                </div>
              </div>
              <img src={visitorDisc} alt="" className={`${styles.visitorDisc} ${spinningDisc === 'visitor' ? styles.discSpinAnim : ''}`} />
            </div>

            <div className={styles.localRow} onClick={() => handleSelect('local')}>
              <div className={`${styles.localCard} ${selected === 'local' ? styles.localCardActive : ''}`}>
                <div className={styles.localConnector} />
                <div className={styles.localContent}>
                  <p className={styles.cardLabel}>I'm a</p>
                  <p className={`${styles.cardTitle} ${selected === 'local' ? styles.titleWhite : styles.titleOrange}`}>Local</p>
                  <p className={styles.cardText}>Share your favourite places, create your own stickers, and help visitors discover Antwerp through a local perspective.</p>
                  <img src={localArrow} alt="" className={`${styles.arrowIcon} ${selected === 'local' ? styles.arrowIconWhite : ''}`} />
                </div>
              </div>
              <img src={localDisc} alt="" className={`${styles.localDisc} ${spinningDisc === 'local' ? styles.discSpinAnim : ''}`} />
            </div>
          </div>

          <div className={styles.footer}>
            <button
              className={`${styles.signUpBtn} ${!selected ? styles.signUpBtnDisabled : ''}`}
              onClick={() => {
                if (selected) {
                  localStorage.setItem('userType', selected)
                  window.dispatchEvent(new Event('userTypeChanged'))
                  setStep(1)
                }
              }}
              >Sign Up</button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div className={styles.intro}>
            <h1 className={styles.heading}>Get <span className={styles.orange}>Started</span></h1>
            <p className={styles.subheading}>Sign up</p>
          </div>

          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="signup-name">Name</label>
              <input
                id="signup-name"
                className={styles.input}
                type="text"
                placeholder="Gemhunter"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                className={styles.input}
                type="email"
                placeholder="Gemhunter.best@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="signup-password">Password</label>
              <div className={styles.passwordWrap}>
                <input
                  id="signup-password"
                  className={`${styles.input} ${styles.inputPassword}`}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  className={styles.eyeBtn}
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              className={`${styles.signUpBtn} ${!isValid ? styles.signUpBtnDisabled : ''}`}
              onClick={() => isValid && navigate('/lens/ann')}
            >
              Sign Up <img src={whiteArrow} alt="" className={styles.arrow} />
            </button>

            <p className={styles.loginText}>
              Already have an account?{' '}
              <span className={styles.loginLink} onClick={() => navigate('/lens/ann')}>Log in</span>
            </p>

            <div className={styles.orDivider}>
              <img src={linePattern} alt="" className={styles.orLine} />
              <span className={styles.orText}>OR</span>
              <img src={linePattern} alt="" className={`${styles.orLine} ${styles.orLineFlip}`} />
            </div>

            <button className={styles.socialBtn} type="button" onClick={() => navigate('/lens/ann')}>
              <img src={googleIcon} alt="" className={styles.socialIcon} />
              Sign in with Google
            </button>

            <button className={styles.socialBtn} type="button" onClick={() => navigate('/lens/ann')}>
              <img src={appleIcon} alt="" className={styles.socialIcon} />
              Sign in with Apple
            </button>
          </div>
        </>
      )}
    </div>
  )
}
