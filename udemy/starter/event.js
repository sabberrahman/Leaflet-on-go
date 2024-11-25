const map = L.map("map", { attributionControl: false }).setView(
  [23.988703, 90.371518],
  12
);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

map.on("mousemove", (e) => {
  // $("mouse-move").html(e.latlng().toString())
  const span = document.querySelector("#mouse-move");
  // span.innerHTML = e.latlng.toString()
  span.innerHTML = latlngPretty(e.latlng);
});

function latlngPretty(ll) {
  const latlngg = "[" + ll.lat.toFixed(5) + "," + " " + ll.lng.toFixed(5) + "]";
  return latlngg;
}

const locate = document.querySelector("#btnLocate");
locate.addEventListener("click", () => {
  map.locate();
});

var mkMarker;
map.on("locationfound", function (e) {
  console.log("Location found:", e.latlng);
  if (mkMarker) {
    mkMarker.remove(); //repeat hole remove korbe
  }
  mkMarker = L.circle(e.latlng, {
    radius: e.accuracy / 100,
    color: "blue",
  }).addTo(map);

  map.setView(e.latlng, 13);
});

$("#jqueryy").on("click", () => {
  map.setView([23.988, 90.371], 15);
  L.marker([23.988, 90.371]).addTo(map);
});

// ---------popup-----------

var popDhaka = L.popup()
  .setLatLng([23.988, 90.371])
  .setContent(
    "<h2>Gazipur</h2> <img src='https://cdn.pixabay.com/photo/2023/05/30/15/34/silver-gull-8028945_1280.jpg' width='250px'>   "
  );
console.log(popDhaka);
$("#popUp").on("click", () => {
  map.setView([23.988, 90.371], 16);
  map.openPopup(popDhaka);
});

// --- whole html in that pop up -----
// popDhaka.setContent($("#side-bar"))

//------------ custom zomm/attribution/scale------------
// var CustomZoom= L.control.zoom({zoomInText:"hola",zoomOutText:"comoasta"}).addTo(map)
var CustomAttribution = L.control.attribution();
CustomAttribution.addAttribution("<a href='#'>sabber rahman</a>").addTo(map);


// var sidebar;
// var easyBtn;
// sidebar=L.Control.Sidebar("side-bar").addTo(map)
// easyBtn=L.easyButton("glyphicon-screenshot",()=>{
//   sidebar.open()
// })
