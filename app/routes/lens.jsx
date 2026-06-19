import { useEffect, useState } from "react";
import { storageUrl } from '../lib/storage'
import { useParams, useNavigate } from 'react-router'
import styles from '../styles/lens.module.css'
import { designers } from '../lib/designers'
import arrowUrl from '../assets/arrow_green.svg'
import modelPattern from '../assets/model_pattern.svg'
import workPattern from '../assets/work_pattern.svg'
import antwerpPattern from '../assets/antwerp_pattern.svg'
import designerViemaster from '../assets/a6_viewmaster.svg'
import DesignerWheel from '../components/DesignerWheel'


export function meta() {
  return [{ title: "Lens" }];
}

export default function Lens() {
  const { id } = useParams()
  const navigate = useNavigate()
  const designer = designers[id] || designers.ann

  const allowedIndices = [0, 2, 3];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    setCurrentIdx(0);
    if (id) {
      localStorage.setItem('selectedLens', id);
    }
  }, [id]);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? allowedIndices.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev === allowedIndices.length - 1 ? 0 : prev + 1));
  };

  const activeImageIndex = allowedIndices[currentIdx];

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
            src={designer.images[activeImageIndex]} 
            alt="" 
            className={styles.model}
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

      <DesignerWheel
        activeKey={id || 'ann'}
        onSelect={(key) => navigate(`/lens/${key}`)}
        viewmasterSrc={designerViemaster}
        wheelSrc={storageUrl('gems/designers/a6_designers.webp')}
      />
    </div>
  )
}