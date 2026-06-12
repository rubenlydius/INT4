import { useParams, Link } from 'react-router'
import styles from './lens.module.css'
import { designers } from '../lib/designers'
import arrowUrl from '../assets/arrow_green.svg'
import modelPattern from '../assets/model_pattern.svg'
import workPattern from '../assets/work_pattern.svg'
import antwerpPattern from '../assets/antwerp_pattern.svg'

export function meta() {
  return [{ title: "INT4" }];
}

export default function Lens() {
  const { id } = useParams()
  const designer = designers[id] || designers.ann

  return (
    <div>
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
          <img src={arrowUrl} className={styles.arrow_l} alt="" />
          <img src={designer.images[0]} alt="" className={styles.model}/>
          <img src={arrowUrl} className={styles.arrow_r} alt="" />
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

      <nav className={styles.designer_nav}>
        {Object.entries(designers).map(([key, d]) => (
          <Link 
            key={key} 
            to={`/lens/${key}`}
            className={id === key ? styles.active : ''}
          >
            {d.name} <br></br>
          </Link>
        ))}
      </nav>
    </div>
  )
}