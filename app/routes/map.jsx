import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabase";
import { designers } from '../lib/designers';
import { storageUrl } from '../lib/storage';
import styles from '../styles/map.module.css';

import mapHeader from '../assets/map_header.svg';
import sixGem from '../assets/a6_gem.svg';
import communityGem from '../assets/community_gem.svg';
import currentLocationIcon from '../assets/current_location.svg';
import xIcon from '../assets/x_icon.svg';
import closeIcon from '../assets/close_button.svg';
import calendarIcon from '../assets/calendar_icon.svg';
import whiteArrow from '../assets/white_arrow.svg';

export function meta() {
  return [{ title: "Map" }];
}

const lensToDbMapping = {
  ann: "Ann D",
  walter: "Walter V",
  dirk_b: "Dirk B",
  marina: "Marina Y",
  dirk_vs: "Dirk V",
  dries: "Dries V",
};


function getOffset(gem) {
  const radius = gem.radius ?? 250;
  
  const maxOffset = (radius * 0.6) * 0.000009;
  
  const seed = gem.id % 100;
  const seed2 = (gem.id * 13) % 100;
  
  const latOffset = ((seed % 10) - 5) / 5 * maxOffset;
  const lngOffset = ((seed2 % 10) - 5) / 5 * maxOffset;
  
  return [gem.lat + latOffset, gem.lng + lngOffset];
}


export default function Map() {
  const [currentLens, setCurrentLens] = useState("ann");
  const [selected, setSelected] = useState(null);
  const [types, setTypes] = useState([]);
  const [activeTypes, setActiveTypes] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    const lens = localStorage.getItem("selectedLens") || "ann";
    setCurrentLens(lens);
  }, []);

  const designer = designers[currentLens] || designers.ann;

  function toggleType(type) {
    setActiveTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }

  useEffect(() => {
    async function init() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const dbDesignerName = lensToDbMapping[currentLens] || "Ann D";

      const { data, error } = await supabase
        .from("Gems")
        .select("*")
        .not("lat", "is", null)
        .not("lng", "is", null)
        .eq("a6_link", dbDesignerName);

      if (error) return console.error(error.message);
      if (mapRef.current._leaflet_id) return;

      const uniqueTypes = [...new Set(data.map(g => g.type).filter(Boolean))];
      setTypes(uniqueTypes);

      const map = L.map(mapRef.current, { attributionControl: false }).setView([51.2194, 4.4025], 14);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

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

      data.forEach((gem) => {
        let marker;
      
        const centerLatLng = getOffset(gem);
      
        if (gem.a6_fav) {
          const radiusMeters = gem.radius ?? 250;
          
          const sizeMultiplier = 2; 
          
          const radiusInDegrees = (radiusMeters * 0.000009) * sizeMultiplier;
        
          const latLngBounds = [
            [centerLatLng[0] - radiusInDegrees, centerLatLng[1] - radiusInDegrees],
            [centerLatLng[0] + radiusInDegrees, centerLatLng[1] + radiusInDegrees]
          ];
        
          marker = L.imageOverlay(sixGem, latLngBounds, {
            interactive: true 
          });
        
        } else {
          marker = L.circle(centerLatLng, {
            radius: gem.radius ?? 250,
            color: "#00D77D",
            fillColor: "#00D77D",
            fillOpacity: 0.5,
            weight: 2,
          });
        }
      
        marker.on("click", () => setSelected(gem));
        markersRef.current.push({ marker, gem });
        marker.addTo(map);
      });
    }

    if (mapRef.current) init();
  }, [currentLens]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(({ marker, gem }) => {
      if (activeTypes.length === 0 || activeTypes.includes(gem.type)) {
        marker.addTo(mapInstanceRef.current);
      } else {
        marker.remove();
      }
    });
  }, [activeTypes]);

  return (
    <div className={styles.mapPageContainer}>
      <div className={styles.header}>
        <p>Discovering Antwerp through the eyes of</p>
        <h1 className={styles.h1}>{designer.name}</h1>
      </div>
      <img src={mapHeader} alt="Map Header" className={styles.mapHeader} />
      <div className={styles.info}>
        <div className={styles.filters}>
          <button
            onClick={() => setActiveTypes([])}
            className={`${styles.pill} ${activeTypes.length === 0 ? styles.pill_active : ''}`}
          >
            All
          </button>
          {types.map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`${styles.pill} ${activeTypes.includes(type) ? styles.pill_active : ''}`}
            >
              {type}
              {activeTypes.includes(type) && <img src={xIcon} alt="X" className={styles.pill_x} />}
            </button>
          ))}
        </div>
        <div className={styles.legend}>
          <div>
            <img src={sixGem} alt="Six Gem" />
            <p>Antwerp Six gems</p>
          </div>
          <div>    
            <img src={communityGem} alt="Community Gem" />        
            <p>Community gems</p>
          </div>
          <div>
            <img src={currentLocationIcon} alt="Current Location" />
            <p>You</p>
          </div>
        </div>
      </div>
      <div className={styles.mapContainerWrapper}>
        <div ref={mapRef} className={styles.mapContainer} />

        {selected && (
          <div className={styles.popup}>
            <h3 className={styles.popupText}>{selected.gem_name}</h3>
            <div className={styles.popupInfo}>
            <div className={styles.InfoRow}>
              <p className="info_node">{selected.type}</p>
              <p className={styles.popupSeperator}>•</p>
              <div className={styles.daysLeft}>
              <img src={calendarIcon} alt="Calendar" className={styles.calendarIcon} />
              <p>10 days left</p>
              </div>
            </div>
            <div className={styles.InfoRow}>

            <p><span className={styles.orangeText}>Closes soon</span></p>
            <p className={styles.popupSeperator}>•</p>
            <p>20:00</p>
            <p className={styles.popupSeperator}>•</p>
            <p>Opens 9:00 Monday</p>
            </div>
            </div>
            <p>{selected.abstract}</p>
            <Link to={`/gem/${selected.id}`} className={styles.exploreButton}>
              Start exploring
              <img src={whiteArrow} alt="" className={styles.exploreArrow} />
            </Link>
            <button
              onClick={() => setSelected(null)}
              className={styles.closeButton}
            >
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

