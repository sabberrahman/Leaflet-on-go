//  <reference types="leaflet" />
// npm install leaflet @types/leaflet -- for better autocom

const map = L.map("map").setView([23.777176, 90.399452], 15);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// const mapp=L.map("map").setView([])
// const titleURl="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
// const attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

L.marker([23.777176, 90.399452],{draggable:true,autoPan:true,})
  .addTo(map)
  .bindPopup("Dhaka,Bangladesh </br> welcome to goofy town")
  .openPopup();

const Clayer = L.circle([23.777176, 90.399452],{radius:2000,draggable:true});
Clayer.addTo(map);
