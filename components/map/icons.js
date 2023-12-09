import L from "leaflet";

const markerBlue = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});


const markerBus = L.icon({
  iconSize: [40, 40],
  iconAnchor: [50, 50],
  popupAnchor: [2, -40],
  iconUrl: "/busmark.png",
  //shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});

const markerSelf = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 30],
  popupAnchor: [2, -40],
  iconUrl: "/self-marker.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});

export {markerBlue, markerBus, markerSelf}