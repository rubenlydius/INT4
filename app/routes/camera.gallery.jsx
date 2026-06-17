import { storageUrl } from '../lib/storage'
import styles from '../styles/cameragallery.module.css'

import titleTransition from '../assets/title_transition.svg'
import orangeArrow from '../assets/orange_arrow.svg';
import galleryTransition from '../assets/gallery_transition.svg'
import galleryArrow from '../assets/gallery_arrow.svg'
import containerTop from '../assets/hintDropdownTop.svg'
import containerBottom from '../assets/hintDropdownBottom.svg'
import viewmasterIcon from '../assets/viewmaster_icon.svg'
import blackArrow from '../assets/black_arrow.svg'

export function meta() {
    return [{ title: "Gallery" }];
  }

  const PHOTO_COUNT = 12;


export default function Gallery() {

    const allPhotos = Array.from({ length: PHOTO_COUNT }, (_, i) =>
        String(i + 1).padStart(2, '0')
    );


    return (
        <div>
            <div className="top">
                <img src={orangeArrow} alt="return" />
                <h1>Gem hunt</h1>
            </div>
            <img src={titleTransition} alt="transition" className='titleTransititon'/>

            <div className={styles.gallery_title}>
            <h2>Photos taken</h2>
            </div>
            <p className={styles.secondary_title}>Most recent photos</p>
            <div className={styles.recent_photos}>
                <img src={galleryArrow} alt="previous" className={styles.prev_arrow}/>
                <img src={storageUrl(`gems/gallery/gallery_1.webp`)} alt="image" className={styles.current_photo}/>
                <img src={galleryArrow} alt="next" />
            </div>

            <div className={styles.light_orange}>

            <img src={galleryTransition} alt="" className={styles.gallery_transition}/>

            <div className={styles.allphotos_p}>
            <p className={styles.secondary_title}>All photos</p>
            </div>
            <div className={styles.all_photos}>
            {allPhotos.map((num) => (
            <div key={num} className={styles.all_photos_img_wrapper}>
                <img
                    src={storageUrl(`gems/gallery/all/gallery_img${num}.webp`)}
                    alt={`Gallery image ${num}`}
                    className={styles.all_photos_img}
                />
            </div>
            ))}
            </div>

            <div className={styles.viewmaster_container}>
                <img src={containerTop} alt="" />
                <div className={styles.viewmaster_content}>
                    <div className={styles.left_block}>

                    <img src={viewmasterIcon} alt="" className={styles.viewmaster_img}/>
                    <div>
                        <h3>Make new ViewMaster</h3>
                        <p>Turn your photos into a disc</p>
                    </div>
                    </div>
                    <img src={blackArrow} alt="" className={styles.blackArrow}/>
                </div>
                <img src={containerBottom} alt="" />
            </div>

            </div>

        </div>
    )
}
