import { useParams, Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { designers } from '../lib/designers';
import { storageUrl } from '../lib/storage';

import styles from './gemhunt.module.css';
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



import Dropdown from '../components/dropdown'

export function meta() {
  return [{ title: "Gem Hunt" }];
}



export default function GemDetail() {
  const { gemId } = useParams();
  const [gem, setGem] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);

  const currentLens = typeof window !== "undefined" ? localStorage.getItem("selectedLens") || "ann" : "ann";
  const designer = designers[currentLens] || designers.ann;

  const [isOpen, setIsOpen] = useState(false);




  useEffect(() => {
    async function fetchGem() {
      const { data, error } = await supabase
        .from("Gems")
        .select("*")
        .eq("id", gemId)
        .single();

      if (error) return console.error(error.message);
      setGem(data);
    }

    fetchGem();
  }, [gemId]);

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

      L.circle(center, {
        radius,
        color: "#00D77D",
        fillColor: "#00D77D",
        fillOpacity: 0.35,
        weight: 2,
      }).addTo(map);

      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const latlng = [latitude, longitude];
      
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

  const hintImages = [1, 2, 3].map(
    (n) => storageUrl(`/gems/locations/gem${gem.id}-hint${n}.avif`)
  )

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
        </div>
        <img src={mapBottom} alt="" className={`${styles.mapEdge} ${styles.mapEdgeBottom}`}></img>
      </div>

      <Dropdown title="Text hint" content={gem.abstract} icon={textHint} />
      <Dropdown title="Visual hint" content={gem.hint_1} icon={visualHint} images={hintImages} />
      <Dropdown title="Hot & Cold" content={gem.hint_2} icon={hotcoldHint} hotCold />    

      <div className={styles.huntButtons}>
        <button className={styles.revealHunt}>Reveal location</button>
        <button className={styles.foundHunt}>I found it
          <img src={whiteArrow} alt="arrow" />
        </button>

      </div>
    </div>

  );
}