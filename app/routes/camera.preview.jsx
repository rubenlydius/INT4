import { Link, useNavigate } from "react-router";
import { useState, useEffect } from 'react';
import styles from '../styles/camera.module.css';

import cameraTop from '../assets/camera_top.svg';
import whiteArrow from '../assets/white_arrow.svg'

export function meta() {
    return [{ title: "Camera" }];
}

export default function CameraPreview() {
    const navigate = useNavigate();
    const [photoSrc, setPhotoSrc] = useState(null);
    const [gemId, setGemId] = useState(null);

    useEffect(() => {
        const numericIds = Object.keys(localStorage)
            .filter(k => k.startsWith('gem_photo_'))
            .map(k => parseInt(k.replace('gem_photo_', ''), 10))
            .filter(num => !isNaN(num));

        if (numericIds.length > 0) {
            const maxId = Math.max(...numericIds);
            const src = localStorage.getItem(`gem_photo_${maxId}`);
            setPhotoSrc(src);
        }

        const storedGemId = sessionStorage.getItem('currentGemId');
        if (storedGemId) setGemId(storedGemId);
    }, []);

    const handleRetake = () => {
        const numericIds = Object.keys(localStorage)
            .filter(k => k.startsWith('gem_photo_'))
            .map(k => parseInt(k.replace('gem_photo_', ''), 10))
            .filter(num => !isNaN(num));

        if (numericIds.length > 0) {
            const maxId = Math.max(...numericIds);
            localStorage.removeItem(`gem_photo_${maxId}`);
        }

        navigate('/camera', { state: { fromGemHunt: true } });
    };

    return (
        <div className={styles.cameraPage}>
            <img src={cameraTop} alt="styling element" className={styles.cameraTop} />

            <div className={styles.previewContainer}>
                {photoSrc ? (
                    <img
                        src={photoSrc}
                        alt="Captured gem photo"
                        className={styles.previewPhoto}
                    />
                ) : (
                    <div className={styles.previewPlaceholder} />
                )}

                <div className={styles.previewButtons}>
                    <Link to={gemId ? `/gem/detail/${gemId}` : '/map'}>
                        <button className={styles.previewSeeDetails}>
                            See gem details
                            <img src={whiteArrow} alt="white arrow" />
                        </button>
                    </Link>

                    <button className={styles.previewRetake} onClick={handleRetake}>
                        Retake photo
                    </button>
                </div>
            </div>
        </div>
    );
}