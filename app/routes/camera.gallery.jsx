import { storageUrl } from '../lib/storage'
import styles from '../styles/cameragallery.module.css'

import titleTransition from '../assets/title_transition.svg'
import orangeArrow from '../assets/orange_arrow.svg';


export default function Camera() {



    return (
        <div>
            <div className="top">
                <img src={orangeArrow} alt="return" />
                <h1>Gem hunt</h1>
            </div>
            <img src={titleTransition} alt="transition" className='titleTransititon'/>

            <h2>Photos taken</h2>
            <p>Most recent photos</p>
        </div>
    )
}
