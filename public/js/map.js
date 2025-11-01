// let mapToken = mapToken;
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12",
  // default to standard-satellite style on mount
  center: [74.31, 31.5889], // starting position [lng, lat]
  zoom: 13, // starting zoom
});
