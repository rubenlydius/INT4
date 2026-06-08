import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export default function Map() {
  const [gems, setGems] = useState([]);
  const [selected, setSelected] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    async function init() {
      // Dynamically import leaflet only in the browser
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const { data, error } = await supabase
        .from("Gems")
        .select("*")
        .not("lat", "is", null)
        .not("lng", "is", null);

      if (error) return console.error(error.message);

      // Prevent double init on hot reload
      if (mapRef.current._leaflet_id) return;

      const map = L.map(mapRef.current).setView([51.2194, 4.4025], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      }).addTo(map);

      data.forEach((gem) => {
        const marker = L.circleMarker([gem.lat, gem.lng], {
          radius: 8,
          color: "#D2FF4B",
          fillColor: "#D2FF4B",
          fillOpacity: 1,
        }).addTo(map);

        marker.on("click", () => setSelected(gem));
      });
    }

    if (mapRef.current) init();
  }, []);

  return (
    <div style={{ position: "relative", height: "90vh", width: "100%" }}>

      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />

      {selected && (
        <div style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: "#111",
          border: "1px solid #333",
          borderRadius: 12,
          padding: "16px 24px",
          minWidth: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <span style={{ color: "#fff", fontSize: "1rem" }}>{selected.gem_name}</span>
          <button
            onClick={() => setSelected(null)}
            style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "1.2rem" }}
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}

