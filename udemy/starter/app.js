
const map=L.map("map").setView([23.988703, 90.371518],12)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on("click",function(e){
    alert(e.latlng.toString())
})

L.marker([23.988703, 90.371518]).addTo(map)
map.on("contextmenu",function(e){
    L.marker(e.latlng).addTo(map).bindPopup(e.latlng.toString())
})