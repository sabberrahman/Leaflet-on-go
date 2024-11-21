const map = L.map("map").setView([23.777176, 90.399452], 5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const Clayer = L.circle([23.777176, 90.399452],{radius:2000,draggable:true});
Clayer.addTo(map);

const CMarker=L.circleMarker([23.777176, 90.399452],{radius:40,color:"coral"}).addTo(map) // total screen er 200 nebe

const marker=L.marker([23.777176, 90.399452]).addTo(map)

// polygon 
const Btrig=[[
    [25.774,-80.19],[18.466,-66.118],[32.321,-64.757]
]]

const polygon=L.polygon(Btrig).addTo(map)

const latlngs = [
    [45.51, -122.68],
    [37.77, -122.43],
    [34.04, -118.2]
];

const polyLine=L.polyline(latlngs,{color:"red",opacity:"0.5"}).addTo(map)
// map.fitBounds(polyLine.getBounds()) // to show on refreash/start