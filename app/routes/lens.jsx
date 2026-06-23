import { useEffect, useState } from "react";
import { storageUrl } from '../lib/storage'
import { useParams, useNavigate, useLocation } from 'react-router'
import styles from '../styles/lens.module.css'
import { designers } from '../lib/designers'
import arrowUrl from '../assets/arrow_green.svg'
import modelPattern from '../assets/model_pattern.svg'
import workPattern from '../assets/work_pattern.svg'
import antwerpPattern from '../assets/antwerp_pattern.svg'
import designerViemaster from '../assets/a6_viewmaster.svg'
import { createPortal } from 'react-dom' // needed to render the intro overlay on top of everything
import DesignerWheel from '../components/DesignerWheel'
import { useMapFocus } from '../lib/MapContext'

export function meta() {
  return [{ title: "Lens" }];
}

export default function Lens() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // signup.jsx navigates here
  const introMode = location.state?.fromSignup === true
  const [introPhase, setIntroPhase] = useState(introMode ? 'visible' : 'done')
  useEffect(() => {
    if (!introMode) return
    const t1 = setTimeout(() => setIntroPhase('out'), 1700)  // start fade, wheel already rising at 600ms
    const t2 = setTimeout(() => setIntroPhase('done'), 2600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [introMode])

  const designer = designers[id] || designers.ann
  const { setActiveLens } = useMapFocus()

  const allowedIndices = [0, 2, 3];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState('next');

  useEffect(() => {
    setCurrentIdx(0);
    setDirection('next');
    if (id) {
      localStorage.setItem('selectedLens', id);
      setActiveLens(id); // DESKTOP — tells DesktopMap which designer's gems to show
    }
    allowedIndices.forEach((idx) => {
      if (designer.images[idx]) {
        const img = new Image();
        img.src = designer.images[idx];
      }
    });
  }, [id, designer, setActiveLens]);

  const handlePrev = () => {
    setDirection('prev');
    setCurrentIdx((prev) => (prev === 0 ? allowedIndices.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection('next');
    setCurrentIdx((prev) => (prev === allowedIndices.length - 1 ? 0 : prev + 1));
  };

  const activeImageIndex = allowedIndices[currentIdx];





  // NOTE: This has nothing to do with the lens.jsx page. 
  // I was struggling for 8+ hours to figure out what was wrong with the map.jsx page and why this was causing issues when trying to deploy the project on github. 
  // These logs finally made me realise it was the VITE_SUPABASE_ANON_KEY that was not being read properly by github. 
  //   // --- TEMPORARY DIAGNOSTIC LOGS ---
  // useEffect(() => {
  //   console.log("=== 🛠️ PRODUCTION DIAGNOSTIC REPORT ===");
    
  //   // 1. Check what Vite thinks the base path is
  //   console.log("Vite Base URL:", import.meta.env.BASE_URL);
  //   console.log("Current Pathname:", window.location.pathname);

  //   // 2. Check if your Env Variables actually exist in the production build
  //   // (Replace these with the exact names you use inside your lib/supabase file)
  //   console.log("Supabase URL Defined?:", !!import.meta.env.VITE_SUPABASE_URL);
  //   console.log("Supabase Key Defined?:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
  //   // 3. Test if importing Leaflet from a working page causes a 404 asset crash
  //   console.log("Testing Leaflet chunk delivery...");
  //   import("leaflet")
  //     .then(() => console.log("✅ Leaflet chunk loaded perfectly on this page!"))
  //     .catch((err) => console.error("❌ Leaflet chunk FAILED to load:", err));
      
  //   console.log("=======================================");
  // }, []);
  // // --- END DIAGNOSTIC LOGS --- 


  

  return (
    <div className={styles.lensContainer}>
      <header>
        <h1 style={{ fontSize: designer.h1}}>{designer.first_name}</h1>
        <img src={designer.header} alt={designer.name} />
      </header>
      <main>
        <h2>{designer.last_name}</h2>
        <ul className={styles.keywords}>
          {designer.keywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
        <p>{designer.bio[0]}</p>

        <div className={styles.runway}>
          <img src={modelPattern} alt="" className={styles.modelPattern}/>
          <img 
            src={arrowUrl} 
            className={styles.arrow_l} 
            onClick={handlePrev} 
            style={{ cursor: 'pointer' }}
            alt="Previous" 
          />
          <img 
            key={activeImageIndex}
            src={designer.images[activeImageIndex]} 
            alt="" 
            className={`${styles.model} ${direction === 'next' ? styles.slideInRight : styles.slideInLeft}`}
          />
          <img 
            src={arrowUrl} 
            className={styles.arrow_r} 
            onClick={handleNext} 
            style={{ cursor: 'pointer' }}
            alt="Next" 
          />
        </div>

        <h3 className={styles.work_h3}>{designer.his_her} work</h3>
        <div className={styles.work}>
          <img src={workPattern} alt="" />
          <p>{designer.bio[1]}</p>
        </div>
        <div className={styles.antwerp}>
          <img src={designer.images[1]} alt="" className={styles.spotlight}/>
          <img src={antwerpPattern} alt="" className={styles.antwerpPattern}/>
        </div>
        <div className={styles.antwerp_link}>
          <h3 className={styles.antwerp_h3}>{designer.his_her} antwerp</h3>
          <p>{designer.bio[2]}</p>
        </div>
      </main>

      {/* introMode tells the wheel to start off-screen */}
      <DesignerWheel
        activeKey={id || 'ann'}
        onSelect={(key) => navigate(`/lens/${key}`)}
        viewmasterSrc={designerViemaster}
        wheelSrc={storageUrl('gems/designers/a6_designers.webp')}
        introMode={introMode}
      />

      {/* intro overlay rendered via portal so it sits above the phone frame/navbar in the DOM */}
      {introPhase !== 'done' && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#0F100F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          overflow: 'hidden',
          opacity: introPhase === 'out' ? 0 : 1,
          transition: 'opacity 0.9s ease',
          pointerEvents: introPhase === 'out' ? 'none' : 'auto',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            fontWeight: 500,
            color: 'var(--color-orange)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            margin: '0 0 0.5rem',
          }}>Choose your</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 13vw, 5rem)',
            color: 'var(--color-white)',
            textAlign: 'center',
            lineHeight: 1.2,
            margin: 0,
            textTransform: 'uppercase',
            padding: '0 1.5rem',
          }}>Antwerp Six Designer</h1>
        </div>,
        document.body
      )}
<div className={styles.lens_bottom_padding}></div>
    </div>
  )
}