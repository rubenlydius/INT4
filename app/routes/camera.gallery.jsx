import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router";
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
import closeButton from '../assets/close_button.svg'

export function meta() {
    return [{ title: "Gallery" }];
}

const STATIC_PHOTO_COUNT = 12;

export default function Gallery() {
    const navigate = useNavigate()
    const [allPhotos, setAllPhotos] = useState([]);
    const [recentFive, setRecentFive] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedPhotoId, setSelectedPhotoId] = useState(null);

    const loadPhotos = () => {
        const basePhotos = Array.from({ length: STATIC_PHOTO_COUNT }, (_, i) => ({
            id: `static-${i}`,
            isLocalStorage: false,
            src: storageUrl(`gems/gallery/all/gallery_img${String(i + 1).padStart(2, '0')}.webp`),
            alt: `Gallery image ${i + 1}`
        }));

        const localKeys = Object.keys(localStorage)
            .filter(k => k.startsWith('gem_photo_'))
            .sort((a, b) => {
                const numA = parseInt(a.replace('gem_photo_', ''), 10);
                const numB = parseInt(b.replace('gem_photo_', ''), 10);
                return numA - numB;
            });

        const userPhotos = localKeys.map(key => ({
            id: key,
            isLocalStorage: true,
            src: localStorage.getItem(key),
            alt: "User captured gem photo"
        }));

        const combined = [...basePhotos, ...userPhotos];
        setAllPhotos(combined);

        // Extract the 5 most recent photos (Newest user photos are at the end of the array)
        const recentItems = [...combined].reverse().slice(0, 5);
        setRecentFive(recentItems);
        setCurrentIndex(0);
    };

    useEffect(() => {
        loadPhotos();
    }, []);

    const handleDeletePhoto = (e, photoId) => {
        e.stopPropagation();
        localStorage.removeItem(photoId);
        setSelectedPhotoId(null);
        loadPhotos();
    };

    // Carousel Navigation Logic
    const handlePrev = () => {
        if (recentFive.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + recentFive.length) % recentFive.length);
    };

    const handleNext = () => {
        if (recentFive.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % recentFive.length);
    };

    // Calculate which elements are currently left, center, and right in the deck
    const centerPhoto = recentFive[currentIndex];
    const leftPhoto = recentFive[(currentIndex + 1) % recentFive.length];
    const rightPhoto = recentFive[(currentIndex + 2) % recentFive.length];

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
            
            {/* STACK CARDS LAYOUT CONTAINER */}
            <div className={styles.recent_photos}>
                <img 
                    src={galleryArrow} 
                    alt="previous" 
                    className={`${styles.prev_arrow} ${styles.nav_arrow}`} 
                    onClick={handlePrev}
                />
                
                <div className={styles.stack_wrapper}>
                    {/* 3rd Most Recent (Right background card) */}
                    {rightPhoto && recentFive.length >= 3 && (
                        <img src={rightPhoto.src} alt="Next background stack" className={`${styles.stacked_photo} ${styles.photo_right}`} />
                    )}
                    
                    {/* 2nd Most Recent (Left background card) */}
                    {leftPhoto && recentFive.length >= 2 && (
                        <img src={leftPhoto.src} alt="Previous background stack" className={`${styles.stacked_photo} ${styles.photo_left}`} />
                    )}
                    
                    {/* Active Front Center Card */}
                    {centerPhoto && (
                        <img src={centerPhoto.src} alt="Current focused item" className={styles.current_photo} />
                    )}
                </div>
                
                <img 
                    src={galleryArrow} 
                    alt="next" 
                    className={styles.nav_arrow} 
                    onClick={handleNext}
                />
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
                        >
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                className={styles.all_photos_img}
                            />

                            {selectedPhotoId === photo.id && photo.isLocalStorage && (
                                <button
                                    className={styles.delete_btn}
                                    onClick={(e) => handleDeletePhoto(e, photo.id)}
                                >
                                    <img 
                                        src={closeButton} 
                                        alt="Delete image" 
                                        className={styles.delete_btn_icon}
                                    />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.viewmaster_container} onClick={() => navigate('/camera/viewmaster')} style={{ cursor: 'pointer' }}>
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