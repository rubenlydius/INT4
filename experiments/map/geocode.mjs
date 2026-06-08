import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "supabase link", //for later, change these back to link and service role key if more lat/lon is needed
  "secret key"
);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function geocodeAddress(address, retries = 3) {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`;
    
    for (let i = 0; i < retries; i++) {
      const res = await fetch(url);
      const text = await res.text();
      
      try {
        const data = JSON.parse(text);
        if (!data.features.length) return null;
        const [lon, lat] = data.features[0].geometry.coordinates;
        return { lat, lng: lon };
      } catch {
        console.warn(`  ⚠ Rate limited, waiting 5s before retry ${i + 1}/${retries}...`);
        await sleep(5000);
      }
    }
    return null;
  }

  async function run() {
    const { data: gems, error } = await supabase
      .from("Gems")
      .select("id, location_name, address")
      .is("lat", null);  // only fetch rows without coordinates yet
    if (error) return console.error(error.message);
  
    for (const gem of gems) {
      console.log(`Geocoding: ${gem.address}`);
      const coords = await geocodeAddress(gem.address);
  
      if (coords) {
        const { error: updateError } = await supabase
          .from("Gems")
          .update({ lat: coords.lat, lng: coords.lng })
          .eq("id", gem.id);
  
        if (updateError) console.error(`  ✗ ${gem.location_name}:`, updateError.message);
        else console.log(`  ✓ ${coords.lat}, ${coords.lng}`);
      } else {
        console.warn(`  ✗ No result for: ${gem.address}`);
      }
  
      await sleep(2000);
    }
  
    console.log("Done!");
  }

run();