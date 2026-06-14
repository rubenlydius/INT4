import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { designers } from '../lib/designers';
import { storageUrl } from '../lib/storage'


import styles from './gemhunt.module.css';
import orangeArrow from '../assets/orange_arrow.svg';
import block1 from '../assets/gem_hunt_block1.svg'

export function meta() {
  return [{ title: "Gem Hunt" }];
}

export default function GemDetail() {
  const { gemId } = useParams();
  const [gem, setGem] = useState(null);

  const currentLens = typeof window !== "undefined" ? localStorage.getItem("selectedLens") || "ann" : "ann";
  const designer = designers[currentLens] || designers.ann;

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

  if (!gem) return <div>Loading...</div>;

  return (
    <div className={styles.gemHunt}>
      <div className={styles.top}>
        <img src={orangeArrow} alt="return" />
        <h1>Gem Hunt</h1>
      </div>
      <div className={styles.block1}>

      <img src={block1} alt="transition" className={styles.block1transition}/>


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

      </div>
    </div>
  );
}