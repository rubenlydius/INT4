import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";



export default function Map() {

    const [dataList, setDataList] = useState([]);

    useEffect(() => {
      async function fetchData() {
        // 1. Make sure this matches your exact TABLE name
        const { data, error } = await supabase.from("Gems").select("*");
        console.log("RAW SUPABASE RESPONSE:", { data, error }); 
  
        
        if (data) {
          setDataList(data);
        } else if (error) {
          console.error("Fetch error:", error.message);
        }
      }
      
      fetchData();
    }, []);



    return(
        <>
             <h1 style={{fontSize: "5rem", fontWeight: "bold", color: "#D2FF4B",}}>Map</h1>
            <h2 style={{fontSize: "1.5rem"}}>Locations</h2>


            <ul>
            {dataList.length === 0 ? (
                <li>No data found...</li>
            ) : (
                dataList.map((item) => (
                    <li key={item.id}>{item.location_name}</li>
                ))
            )}
            </ul>
        </>

    );  
}; 