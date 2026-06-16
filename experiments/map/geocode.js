import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://jxbgneaciwzozwvbrjcp.supabase.co',      // your VITE_SUPABASE_URL
  'sb_publishable_5GiuEAIBKFusOYYOdH3yTg_gUqzgZgL'                          // your VITE_SUPABASE_ANON_KEY
)

async function geocodeGems() {
  const { data: gems } = await supabase.from('Gems').select('id, address')

  for (const gem of gems) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(gem.address)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'SeenBySix/1.0 (your@email.com)'
        }
      }
    )
    const result = await res.json()

    if (result[0]) {
      const { lat, lon } = result[0]
      await supabase.from('Gems').update({ lat: parseFloat(lat), lng: parseFloat(lon) }).eq('id', gem.id)
      console.log(`✓ ${gem.address} → ${lat}, ${lon}`)
    } else {
      console.log(`✗ not found: ${gem.address}`)
    }

    await new Promise(r => setTimeout(r, 1100))
  }

  console.log('done')
}

geocodeGems()