const map = L.map("map", { attributionControl: false }).setView(
  [23.988703, 90.371518],
  12
);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const sidebar = L.control.sidebar("sidebar").addTo(map);
L.easyButton("fa fa-hand-o-right", function () {
  sidebar.toggle()
}).addTo(map);

// ----how to dwomlaod plugin ----
// just like leaflet.js --js + css file in header
// -- but if that option is not avalible - download the zip file adn run in locally in your code folder and link to those file in Link + script tag 
// LOWKEY BEST WAY IS TO COPY THE COPY ANS PASTE IN THE PLUGIN FOLDER IF NO CDN