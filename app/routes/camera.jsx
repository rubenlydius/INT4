import { useParams, Link } from "react-router";
import { useEffect, useRef } from 'react';
import styles from '../styles/camera.module.css';

import cameraTop from '../assets/camera_top.svg';
import captureButton from '../assets/camera_capture.svg'
import flipCamera from '../assets/flip_camera.svg'
import flashCamera from '../assets/camera_flash.svg'

export function meta() {
    return [{ title: "Camera" }];
}

export default function Camera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const streamRef = useRef(null);
    const facingModeRef = useRef("environment");

    const startCamera = async (facingMode) => {
        // Stop any existing stream first
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: { ideal: facingMode } },
                audio: false
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();

                if (canvasRef.current) {
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;
                    renderLoop();
                }
            }
        } catch (err) {
            console.error('Camera Initialization Error:', err);
        }
    };

    function renderLoop() {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        requestRef.current = requestAnimationFrame(renderLoop);
    }

    useEffect(() => {
        startCamera(facingModeRef.current);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleFlipCamera = () => {
        facingModeRef.current = facingModeRef.current === "environment" ? "user" : "environment";
        startCamera(facingModeRef.current);
    };

    const captureFrame = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const base64Image = canvas.toDataURL('image/jpeg', 0.4);
        
        // 1. Grab all existing photo index numbers
        const numericIds = Object.keys(localStorage)
            .filter(k => k.startsWith('gem_photo_'))
            .map(k => parseInt(k.replace('gem_photo_', ''), 10))
            .filter(num => !isNaN(num));
            
        // 2. Find the absolute highest number used so far, or default to 0 if empty
        const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
        
        // 3. Always increment past the highest structural ID so deletions never cause a collision
        const nextIndex = maxId + 1;
        
        try {
            localStorage.setItem(`gem_photo_${nextIndex}`, base64Image);
        } catch (e) {
            console.error("Storage limit reached:", e);
        }
    };

    return (
        <div className={styles.cameraPage}>
            <img src={cameraTop} alt="styling element" className={styles.cameraTop} />

            <div className={styles.cameraContainer}>
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{ display: 'none' }} 
                />

                <canvas ref={canvasRef} className={styles.outputCanvas} />

                <div className={styles.topControls}>
                    <button className={styles.controlBtn}>
                        <img src={flashCamera} alt="Toggle Flash" />
                    </button>
                </div>

                <div className={styles.bottomControls}>
                    <Link to={`/camera/gallery`}>
                        <img 
                            src="https://jxbgneaciwzozwvbrjcp.supabase.co/storage/v1/object/public/gems/gallery/gallery_button.webp" 
                            alt="gallery" 
                            className={styles.gallery}
                        />
                    </Link>

                    <button 
                        className={`${styles.controlBtn} ${styles.captureBtn}`} 
                        onClick={captureFrame}
                    >
                        <img src={captureButton} alt="Capture Gem" />
                    </button>

                    <button className={styles.controlBtn} onClick={handleFlipCamera}>
                        <img src={flipCamera} alt="Flip Camera Feed" />
                    </button>
                </div>
            </div>
        </div>
    );
}