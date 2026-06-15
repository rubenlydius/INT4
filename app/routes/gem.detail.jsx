import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { designers } from '../lib/designers';
import { storageUrl } from '../lib/storage'
import styles from '../styles/gemdetail.module.css'

import orangeArrow from '../assets/orange_arrow.svg';
import detailTop from '../assets/gemdetail_top.svg'


export function meta() {
  return [{ title: "Gem Detail" }];
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
  
  const detailImage = storageUrl(`/gems/locations/gem${gem.id}-hint3.avif`);



  return (
    <div>
      <div className={styles.top}>
        <Link to={`/gem/${gem.id}`}>
          <img src={orangeArrow} alt="return" /> 
        </Link>
        <h1>Gem Hunt</h1>

      </div>
      <div className={styles.orange}>
        <img src={detailImage} alt={gem.gem_name} className={styles.detailPageImage}/>
      </div>
      


      <img src={detailTop} alt="transition"/>
      <div className={styles.detailNames}>

      <h2>{gem.gem_name}</h2>
      <div className={styles.creator}>
        <img src={gem.image_url} alt={gem.creator} />
        <p>Made by {gem.creator}</p>
      </div>
      </div>
      <p>{designer.name} lens</p>
    </div>
  );
}