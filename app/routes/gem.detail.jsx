import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { designers } from '../lib/designers';
import { storageUrl } from '../lib/storage'
import styles from '../styles/gemdetail.module.css'

import orangeArrow from '../assets/orange_arrow.svg';
import detailTop from '../assets/gemdetail_top.svg'
import detailConnection from '../assets/gemdetail_connection.svg'
import instagramIcon from '../assets/instagram_icon.svg'
import pinterestIcon from '../assets/pinterest_icon.svg'
import behanceIcon from '../assets/behance_icon.svg'
import publishArrow from '../assets/publish_arrow.svg'

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
    <div className={styles.gemDetailPage}>
      <div className={styles.top}>
        <Link to={`/gem/${gem.id}`}>
          <img src={orangeArrow} alt="return" /> 
        </Link>
        <h1>Gem Hunt</h1>

      </div>
      <div className={styles.orange}>
      <img src={storageUrl(`gems/stickers/gem${gem.id}-sticker.avif`)} alt="sticker" className={styles.sticker}/>
        <img src={detailImage} alt={gem.gem_name} className={styles.detailPageImage}/>
      </div>
      <img src={detailTop} alt="transition" className={styles.detaiTransition}/>
      <div className={styles.detailTitle}>
      <h2>{gem.gem_name}</h2>
      <div className={styles.creator}>
        <img src={gem.image_url} alt={gem.creator} />
        <p>Made by {gem.creator}</p>
      </div>
      </div>

      <div className={styles.gemDetails}>
      <h3>Gem details</h3>
      <p>Name: {gem.location_name}</p>
      <p>Location: {gem.address}</p>
      </div>

      <div className={styles.gemWhy}>
      <h3>Why it's a gem</h3>
      <p>{gem.description}</p>
      </div>

      <div className={styles.connection}>
        <div className={styles.connectionTitle}>
          <img src={storageUrl(`/gems/connection/connection_${currentLens}.avif`)} alt={designer.name} />
          <h3>Connection to <br />{designer.name}</h3>
        </div>
        <p>{gem.connection_to}</p>
        <img src={detailConnection} alt="transition" />
      </div>

      <h3 className={styles.about_creator_title}>About Gem creator</h3>
      <div className={styles.about_creator_container}>
        <div className={styles.creator_header}>
          <img src={gem.image_url} alt={gem.creator} className={styles.about_creator_image}/>
          <div className={styles.creator_details}>
            <p>{gem.creator}</p>
            <p className="info_node">{gem.creator_field}</p>
          </div>
        </div>
        <p>{gem.about_creator}</p>

        <div className={styles.socials}>
          {/* Instagram shows for Lisa, Ona, and Jens */}
          {["lisa", "ona", "jens"].some(name => gem.creator?.toLowerCase().includes(name)) && (
            <img src={instagramIcon} alt="Instagram icon" />
          )}

          {/* Pinterest only shows for Lisa and Ona */}
          {["lisa", "ona"].some(name => gem.creator?.toLowerCase().includes(name)) && (
            <img src={pinterestIcon} alt="Pinterest icon" />
          )}

          {/* Behance only shows for Lisa */}
          {gem.creator?.toLowerCase().includes("lisa") && (
            <img src={behanceIcon} alt="Behance icon" />
          )}
        </div>
      </div>

      <h3 className={styles.comments_title}>Comments</h3>
      <div className={styles.comments_container}>
        <div>
          <img src={storageUrl(`gems/comments/commenter_1.webp`)} alt="user profile picture" />
          <p>really good flat white</p>
        </div>
        <div>
          <img src={storageUrl(`gems/comments/commenter_2.webp`)} alt="user profile picture" />
          <p>such a cozy space to escape from the noise</p>
        </div>
        <div>
          <img src={storageUrl(`gems/comments/commenter_3.webp`)} alt="user profile picture" />
          <p>their soap smells so good</p>
        </div>

        <div className={styles.commentInputContainer}>
          <input 
            type="text" 
            placeholder="type something..." 
            className={styles.commentInput} 
          />
          <button type="button" className={styles.publishButton}>
            <img src={publishArrow} alt="Publish comment" />
          </button>
        </div>
      </div>
      
    </div>
  );
}