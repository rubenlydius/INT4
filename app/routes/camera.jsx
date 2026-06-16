import { useEffect, useRef } from 'react';
import styles from '../styles/camera.module.css';

import cameraTop from '../assets/camera_top.svg';
import captureButton from '../assets/camera_capture.svg'
import flipCamera from '../assets/flip_camera.svg'
import flashCamera from '../assets/camera_flash.svg'

export default function Camera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const requestRef = useRef(null);

    useEffect(() => {
        let localStream = null;

        async function initCamera() {
            try {
                // Requesting standard dimensions just like your reference code
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720, facingMode: { ideal: "environment" } },
                    audio: false
                });

                localStream = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();

                    // Once the video metadata loads, match the canvas drawing dimensions to it
                    if (canvasRef.current) {
                        canvasRef.current.width = videoRef.current.videoWidth;
                        canvasRef.current.height = videoRef.current.videoHeight;
                        
                        // Start the drawing cycle
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
                // Draw the current video frame onto the canvas element
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            
            // Loop it continuously
            requestRef.current = requestAnimationFrame(renderLoop);
        }

        initCamera();

        // Cleanup hardware stream and animation locks when leaving the page
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className={styles.cameraPage}>
            <img src={cameraTop} alt="styling element" className={styles.cameraTop} />

            {/* Viewport container to force styling restrictions */}
            <div className={styles.cameraContainer}>
                
                {/* Hidden video element mirroring your reference setup */}
                <video 
                    ref={videoRef} 
                    autoplay 
                    playsinline 
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
                        <img 
                            src="https://jxbgneaciwzozwvbrjcp.supabase.co/storage/v1/object/public/gems/gallery/gallery_button.webp" 
                            alt="gallery" 
                            className={styles.gallery}
                        />

                    <button className={`${styles.controlBtn} ${styles.captureBtn}`}>
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
