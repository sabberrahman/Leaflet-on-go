const map = L.map("map").setView([23.988703, 90.371518], 12);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

map.on("click", function (e) {
  alert(e.latlng.toString());
});

L.marker([23.988703, 90.371518]).addTo(map);
map.on("contextmenu", function (e) {
  L.marker(e.latlng).addTo(map).bindPopup(e.latlng.toString());
});

// work on chrome but not on brave ??!

// Listen for the "l" key to trigger location
map.on("keydown", function (e) {
  if (e.originalEvent.key === "l") {
    map.locate(); // Locate the user's position
  }
});

//map.locate() will trigger this event !
var mkMarker;
map.on("locationfound", function (e) {
  console.log("Location found:", e.latlng);
  if (mkMarker) {
    mkMarker.remove(); //repeat hole remove korbe
  }
  mkMarker = L.circle(e.latlng, { radius:e.accuracy/100, color: "blue" }).addTo(map);

  map.setView(e.latlng, 13);
});

map.on("locationerror", function (e) {
  alert("Location is not found. Error message: " + e.message);
});




// setInterval(()=>{
//   console.log("yo"+ Date())
//   map.locate()
// },5000)
