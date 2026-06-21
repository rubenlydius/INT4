import { useParams, Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useMapFocus } from '../lib/MapContext';
import { supabase } from "../lib/supabase";
import { designers } from '../lib/designers';
import { storageUrl } from '../lib/storage';
import styles from '../styles/gemhunt.module.css';

import orangeArrow from '../assets/orange_arrow.svg';
import block1 from '../assets/gem_hunt_block1.svg';
import mapTop from '../assets/gemHuntMap_top.svg';
import mapBottom from '../assets/gemHuntMap_bottom.svg';
import textHint from '../assets/text_hint.svg'
import visualHint from '../assets/visual_hint.svg'
import hotcoldHint from '../assets/hotcold_hint.svg'
import lockIcon from '../assets/lock_icon.svg'
import whiteArrow from '../assets/white_arrow.svg'
import currentLocationIcon from '../assets/current_location.svg';
import closeIcon from '../assets/close_button.svg';
import gemFoundIcon from '../assets/gemfound_icon.svg'
import sixGem from '../assets/a6_gem.svg';


import Dropdown from '../components/dropdown'

export function meta() {
  return [{ title: "Gem Hunt" }];
}



export default function GemDetail() {
  const { gemId } = useParams();
  const [gem, setGem] = useState(null);
  const { setMapFocus } = useMapFocus();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);

  // --- ADD THESE STATES FOR HOT & COLD ---
  const [userLocation, setUserLocation] = useState(null);
  const [hcChecksUsed, setHcChecksUsed] = useState(0);

  const currentLens = typeof window !== "undefined" ? localStorage.getItem("selectedLens") || "ann" : "ann";
  const designer = designers[currentLens] || designers.ann;

  const [isOpen, setIsOpen] = useState(false);
  const [showRevealPopup, setShowRevealPopup] = useState(false);
  const [foundAttempts, setFoundAttempts] = useState(0);
  const [showFoundPopup, setShowFoundPopup] = useState(false);

  const handleFoundIt = () => {
    setFoundAttempts(prev => prev + 1);
    setShowFoundPopup(true);
  };

  useEffect(() => {
    async function fetchGem() {
      const { data, error } = await supabase
        .from("Gems")
        .select("*")
        .eq("id", gemId)
        .single();

      if (error) return console.error(error.message);
      setGem(data);
      // DESKTOP — pan the background map to this gem and draw its search radius circle
      if (data.lat && data.lng) setMapFocus({ lat: data.lat, lng: data.lng, radius: data.radius ?? 250 })
    }
    fetchGem();
  }, [gemId, setMapFocus]);

  useEffect(() => {
    if (!gem || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const radius = gem.radius ?? 250;
      const center = [gem.lat, gem.lng];

      const map = L.map(mapRef.current, {
        attributionControl: false,
        zoomControl: false,
      }).setView(center, 15);

      mapInstanceRef.current = map;
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

      if (gem.a6_fav) {
        const sizeMultiplier = 2; 
        const radiusInDegrees = (radius * 0.000009) * sizeMultiplier;
        const latLngBounds = [
          [center[0] - radiusInDegrees, center[1] - radiusInDegrees],
          [center[0] + radiusInDegrees, center[1] + radiusInDegrees]
        ];
        L.imageOverlay(sixGem, latLngBounds).addTo(map);
      } else {
        L.circle(center, {
          radius,
          color: "#00D77D",
          fillColor: "#00D77D",
          fillOpacity: 0.35,
          weight: 2,
        }).addTo(map);
      }

      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const latlng = [latitude, longitude];
      
            // SAVE CURRENT COORDINATES TO STATE
            setUserLocation({ lat: latitude, lng: longitude });

            if (!userMarkerRef.current) {
              const icon = L.divIcon({
                html: `<img src="${currentLocationIcon}" class="${styles.pulseIcon}" />`,
                className: styles.pulseWrapper,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              });
              userMarkerRef.current = L.marker(latlng, { icon, zIndexOffset: 1000 }).addTo(map);
            } else {
              userMarkerRef.current.setLatLng(latlng);
            }
          },
          (err) => console.error(err.message),
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );
      }
    }

    initMap();
  }, [gem]);

  if (!gem) return <div>Loading...</div>;

  const hintImages = gem.id > 300
  ? [gem.hint_url_1, gem.hint_url_2, gem.hint_url_3]
  : [1, 2, 3].map((n) => storageUrl(`/gems/locations/gem${gem.id}-hint${n}.avif`));

  return (
    <div className={styles.gemHunt}>
      <div className={styles.top}>
        <Link to="/map">
          <img src={orangeArrow} alt="return" /> 
        </Link>
        <h1>Gem Hunt</h1>
      </div>
      <div className={styles.block1}>
        <img src={block1} alt="transition" className={styles.block1transition}/>
        <div className={styles.rowContainer}>
          <div className={styles.gemHuntInfo}>
            <h2 className={styles.gemHuntName}>{gem.gem_name}</h2>
            <p className={styles.gemHuntLens}>{designer.name} lens</p>
            <p className="info_node">{gem.type}</p>
          </div>
          <div className={styles.creator}>
            <img src={gem.image_url} alt={gem.creator} />
            <p>Made by {gem.creator}</p>
          </div>
        </div>
      </div>

      <div className={styles.mapSection}>
        <img src={mapTop} alt="" className={styles.mapEdge} />
        <div className={styles.huntMapWrapper}>
          <div ref={mapRef} className={styles.huntMap} />
          <div className={styles.mapLabelBadge}>
          {gem.a6_fav ? (
            <img src={sixGem} alt="A6 Gem Icon" className={styles.badgeIcon} />
          ) : (
            <span className={styles.badgeCircleGreen} />
          )}
          <span className={styles.badgeText}>Gem location radius</span>
          </div>
        </div>
        <img src={mapBottom} alt="" className={`${styles.mapEdge} ${styles.mapEdgeBottom}`} />
      </div>

      <Dropdown title="Text hint" content={gem.abstract} icon={textHint} />
      
      <Dropdown title="Visual hint" content={gem.hint_1} icon={visualHint} images={hintImages} infoNodeText="3 hints available"/>
      
      <Dropdown 
        title="Hot & Cold" 
        content={gem.hint_2} 
        icon={hotcoldHint} 
        hotCold 
        gemTarget={{ lat: gem.lat, lng: gem.lng, radius: gem.radius ?? 250 }}
        userLocation={userLocation}
        hcChecksUsed={hcChecksUsed}
        setHcChecksUsed={setHcChecksUsed}
        infoNodeText={`${hcChecksUsed}/3 used`}
      />    

      <div className={styles.huntButtons}>
        <button className={styles.revealHunt} onClick={() => setShowRevealPopup(true)}>Reveal location</button>
        <button className={styles.foundHunt} onClick={handleFoundIt}>
          I found it
          <img src={whiteArrow} alt="arrow" />
        </button>
      </div>

      {showRevealPopup && (
          <div className={styles.popupOverlay} onClick={() => setShowRevealPopup(false)}>
            <div className={styles.popup} onClick={e => e.stopPropagation()}>
            <button className={styles.popupClose} onClick={() => setShowRevealPopup(false)}>
              <img src={closeIcon} alt="close" />
            </button>
            <h2 className={styles.popupTitle}>Are you sure you want to reveal the exact location?</h2>
            <p className={styles.popupText}>Revealing the location will end this hunt and you won't unlock the collectible sticker for this gem.</p>
            <div className={styles.popupButtons}>
              <button className={styles.revealHunt} onClick={() => setShowRevealPopup(false)}>Keep exploring</button>
              <Link to={`/gem/detail/${gem.id}`} state={{ revealed: true }}>
                <button className={styles.foundHunt}>
                  Reveal location
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {showFoundPopup && (
        <div className={styles.popupOverlay} onClick={() => setShowFoundPopup(false)}>
          <div className={styles.popup} onClick={e => e.stopPropagation()}>
            <button className={styles.popupClose} onClick={() => setShowFoundPopup(false)}>
              <img src={closeIcon} alt="close" />
            </button>
            {foundAttempts < 2 ? (
              <>
                <h2 className={styles.popupTitle}>Not quite there yet...</h2>
                <p className={styles.popupText}>You haven't reached the exact spot. Look around and try again.</p>
                <div className={styles.popupButtons}>
                  <button className={styles.revealHunt} onClick={() => setShowFoundPopup(false)}>Back to Clues</button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.gemFoundFlex}>
                  <h2 className={styles.popupTitle}>Gem found!</h2>
                  <img src={gemFoundIcon} alt="gem" />
                </div>
                <p className={styles.popupText}>Spot on! You've successfully tracked down the hidden gem.</p>
                <div className={styles.popupButtons}>
                  <Link to={`/gem/detail/${gem.id}`}>
                    <button className={styles.revealHunt}>Skip to Gem Details</button>
                  </Link>
                  <Link 
                    to={`/camera`} 
                    state={{ fromGemHunt: true }}
                    onClick={() => sessionStorage.setItem('currentGemId', gem.id)}
                  >
                    <button className={styles.foundHunt}>Capture the Moment</button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}