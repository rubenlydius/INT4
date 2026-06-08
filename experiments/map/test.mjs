const res = await fetch('https://photon.komoot.io/api/?q=Brussels&limit=1');
const data = await res.json();
const [lon, lat] = data.features[0].geometry.coordinates;
console.log(lat, lon);