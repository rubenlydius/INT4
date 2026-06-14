import { useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { designers } from '../lib/designers';
import { storageUrl } from '../lib/storage';

import styles from './gemhunt.module.css';
import orangeArrow from '../assets/orange_arrow.svg';
import block1 from '../assets/gem_hunt_block1.svg';
import mapTop from '../assets/gemHuntMap_top.svg';
import mapBottom from '../assets/gemHuntMap_bottom.svg';
import dropdownTop from '../assets/hintDropdownTop.svg'
import dropdownBottom from '../assets/hintDropdownBottom.svg'
import dropdownSeperator from '../assets/dropdownSeperator.svg'
import dropdownArrow from '../assets/dropdownArrow.svg'

import Dropdown from '../components/dropdown'

export function meta() {
  return [{ title: "Gem Hunt" }];
}



export default function GemDetail() {
  const { gemId } = useParams();
  const [gem, setGem] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

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
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
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
    }

    initMap();
  }, [gem]);

  if (!gem) return <div>Loading...</div>;

  return (
    <div className={styles.gemHunt}>
      <div className={styles.top}>
        <img src={orangeArrow} alt="return" />
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
            <img src={storageUrl('gems/creators/lisa.avif')} alt="Lisa" />
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

      <Dropdown title="Text hint" content={gem.abstract} />
      <Dropdown title="First hint" content={gem.hint_1} />
      <Dropdown title="Second hint" content={gem.hint_2} />
    </div>
  );
}