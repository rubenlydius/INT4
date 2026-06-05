import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "INT4" },
    { name: "description", content: "Welcome to our project!" },
  ];
}

export default function Home() {
  const [dataList, setDataList] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      // 1. Make sure this matches your exact TABLE name
      const { data, error } = await supabase.from("Gems").select("*");
      console.log("RAW SUPABASE RESPONSE:", { data, error }); // Add this line!

      
      if (data) {
        setDataList(data);
      } else if (error) {
        console.error("Fetch error:", error.message);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div>
      <Welcome />
      
      <h2>Locations</h2>
      <ul>
        {dataList.length === 0 ? (
          <li>No data found...</li>
        ) : (
          dataList.map((item) => (
            <li key={item.id}>{item.location_name}</li>
          ))
        )}
      </ul>
    </div>
  );
}