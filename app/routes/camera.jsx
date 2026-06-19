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

    useEffect(() => {
        let localStream = null;

        async function initCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720, facingMode: { ideal: "environment" } },
                    audio: false
                });

                localStream = stream;

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
        }

        function renderLoop() {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            if (video && canvas) {
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            
            requestRef.current = requestAnimationFrame(renderLoop);
        }

        initCamera();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Simple capture method reading from your working Canvas stream
    const captureFrame = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Compression quality 0.4 handles keeping files near ~100KB to prevent storage cap limits
        const base64Image = canvas.toDataURL('image/jpeg', 0.4);
        
        // Dynamic continuous structural indexing based on how many exist already
        const existingKeys = Object.keys(localStorage).filter(k => k.startsWith('gem_photo_'));
        const nextIndex = existingKeys.length + 1;
        
        try {
            localStorage.setItem(`gem_photo_${nextIndex}`, base64Image);
            // alert("Gem captured successfully!");
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

                    <button className={styles.controlBtn}>
                        <img src={flipCamera} alt="Flip Camera Feed" />
                    </button>
                </div>
            </div>
        </div>
    );
}