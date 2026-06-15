import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { designers } from '../lib/designers';
import { storageUrl } from '../lib/storage'
import styles from '../styles/gemdetail.module.css'

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

  return (
    <div>
      <h1>{gem.gem_name}</h1>
      <p>{designer.name} lens</p>
    </div>
  );
}