const map = L.map("map").setView([23.777176, 90.399452], 10);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const mainLayer=[23.777176, 90.399452]

const icon= L.icon({
    iconUrl:"icon.png",
    iconSize:"40"
    
})
const marker = L.marker(mainLayer,{icon}).addTo(map)
const Clayer=L.circleMarker(mainLayer,{radius:50,color:"coral"}).addTo(map)