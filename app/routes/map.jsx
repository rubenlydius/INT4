import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { designers } from '../lib/designers';
import styles from './map.module.css';
import mapHeader from '../assets/map_header.svg';
import sixGem from '../assets/a6_gem.svg';
import communityGem from '../assets/community_gem.svg';
import currentLocationIcon from '../assets/current_location.svg';
import xIcon from '../assets/x_icon.svg';
import closeIcon from '../assets/close_button.svg';

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


function getRadius(gem, baseRadius = 250) {
  const seed = gem.id % 100;
  const variation = ((seed * 3) % 140) - 70;
  return baseRadius + variation;
}

function getOffset(gem) {
  const radius = getRadius(gem);
  
  // convert radius meters to degrees (1m ≈ 0.000009 degrees)
  // use 60% of radius max so location is always well inside
  const maxOffset = (radius * 0.6) * 0.000009;
  
  const seed = gem.id % 100;
  const seed2 = (gem.id * 13) % 100;
  
  const latOffset = ((seed % 10) - 5) / 5 * maxOffset;
  const lngOffset = ((seed2 % 10) - 5) / 5 * maxOffset;
  
  return [gem.lat + latOffset, gem.lng + lngOffset];
}


export default function Map() {
  const [selected, setSelected] = useState(null);
  const [types, setTypes] = useState([]);
  const [activeTypes, setActiveTypes] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const currentLens = typeof window !== "undefined" ? localStorage.getItem("selectedLens") || "ann" : "ann";
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

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

      data.forEach((gem) => {
        const marker = L.circle(getOffset(gem), {
          radius: getRadius(gem, 250),      // meters — adjust this to the size you want
          color: "#99EFCB",
          fillColor: "#99EFCB",
          fillOpacity: 0.5,
          weight: 2,
        }).addTo(map);
      
        marker.on("click", () => setSelected(gem));
        markersRef.current.push({ marker, gem });
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
            <span className={styles.popupText}>{selected.gem_name}</span>
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

