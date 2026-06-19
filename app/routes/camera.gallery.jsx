import { useParams, Link } from "react-router";
import { useEffect, useState } from 'react'
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
import closeButton from '../assets/close_button.svg' // Added delete asset

export function meta() {
    return [{ title: "Gallery" }];
}

const STATIC_PHOTO_COUNT = 12;

export default function Gallery() {
    const [allPhotos, setAllPhotos] = useState([]);
    const [recentPhoto, setRecentPhoto] = useState(storageUrl(`gems/gallery/gallery_1.webp`));
    const [selectedPhotoId, setSelectedPhotoId] = useState(null); // Track which image is clicked/focused

    // Helper function to pull assets and update state cleanly
    const loadPhotos = () => {
        // 1. Build initial static asset photos list
        const basePhotos = Array.from({ length: STATIC_PHOTO_COUNT }, (_, i) => ({
            id: `static-${i}`,
            isLocalStorage: false,
            src: storageUrl(`gems/gallery/all/gallery_img${String(i + 1).padStart(2, '0')}.webp`),
            alt: `Gallery image ${i + 1}`
        }));

        // 2. Fetch custom user captures from localStorage
        const localKeys = Object.keys(localStorage)
            .filter(k => k.startsWith('gem_photo_'))
            .sort((a, b) => {
                const numA = parseInt(a.replace('gem_photo_', ''), 10);
                const numB = parseInt(b.replace('gem_photo_', ''), 10);
                return numA - numB;
            });

        const userPhotos = localKeys.map(key => ({
            id: key, // Using the exact storage key string as the ID
            isLocalStorage: true,
            src: localStorage.getItem(key),
            alt: "User captured gem photo"
        }));

        const combined = [...basePhotos, ...userPhotos];
        setAllPhotos(combined);

        // Update the slider thumbnail presentation frame
        if (userPhotos.length > 0) {
            setRecentPhoto(userPhotos[userPhotos.length - 1].src);
        } else {
            setRecentPhoto(storageUrl(`gems/gallery/gallery_1.webp`));
        }
    };

    useEffect(() => {
        loadPhotos();
    }, []);

    // Handles completely wiping the record out of storage and visual state
    const handleDeletePhoto = (e, photoId) => {
        e.stopPropagation(); // Stop the click from untoggling selection state instantly
        localStorage.removeItem(photoId);
        setSelectedPhotoId(null); // Reset focus
        loadPhotos(); // Refresh grid layout
    };

    return (
        <div>
            <div className="top">
                <Link to={`/camera`}>
                    <img src={orangeArrow} alt="return" />
                </Link>
                <h1>Gem hunt</h1>
            </div>
            <img src={titleTransition} alt="transition" className='titleTransititon'/>

            <div className={styles.gallery_title}>
                <h2>Photos taken</h2>
            </div>
            <p className={styles.secondary_title}>Most recent photos</p>
            <div className={styles.recent_photos}>
                <img src={galleryArrow} alt="previous" className={styles.prev_arrow}/>
                <img src={recentPhoto} alt="image" className={styles.current_photo}/>
                <img src={galleryArrow} alt="next" />
            </div>

            <div className={styles.light_orange}>
                <img src={galleryTransition} alt="" className={styles.gallery_transition}/>

                <div className={styles.allphotos_p}>
                    <p className={styles.secondary_title}>All photos</p>
                </div>
                
                <div className={styles.all_photos}>
                    {allPhotos.map((photo) => (
                        <div 
                            key={photo.id} 
                            className={styles.all_photos_img_wrapper}
                            onClick={() => setSelectedPhotoId(photo.id)}
                            style={{ position: 'relative', cursor: 'pointer' }} // Ensure overlay lines up properly
                        >
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                className={styles.all_photos_img}
                            />

                            {/* Show close button overlay ONLY if this photo is clicked AND belongs to local storage */}
                            {selectedPhotoId === photo.id && photo.isLocalStorage && (
                                <button
                                    onClick={(e) => handleDeletePhoto(e, photo.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '4px',
                                        right: '4px',
                                        background: 'transparent',
                                        border: 'none',
                                        padding: '4px',
                                        cursor: 'pointer',
                                        zIndex: 10
                                    }}
                                >
                                    <img 
                                        src={closeButton} 
                                        alt="Delete image" 
                                        style={{ width: '24px', height: '24px', display: 'block' }}
                                    />
                                </button>
                            )}
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
    );
}