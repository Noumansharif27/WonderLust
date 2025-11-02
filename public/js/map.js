// let mapToken = mapToken;
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12",
  // default to standard-satellite style on mount
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25, closeOnClick: false }).setHTML(
      `<h6>${listing.location}</h6><p>Exact location will be provided after booking!</p>`
    )
  )
  .addTo(map);
