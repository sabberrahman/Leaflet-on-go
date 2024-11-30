var ctlLayer;
var baseLayers;
var overLays;
var lyrDraw;
var lyrEgleNest;
var lyrBuowl;
var markerCuster;

const map = L.map("map", { attributionControl: false }).setView(
  [40.191463, -104.842529],
  9
);
var lyrKarte = L.tileLayer.provider("OPNVKarte");
var lyrMapnik = L.tileLayer.provider("OpenStreetMap.Mapnik");
var lyrEsri = L.tileLayer.provider("Esri.WorldImagery");
var lyrStadia = L.tileLayer.provider("Stadia.AlidadeSmoothDark");
map.addLayer(lyrStadia);

var ctlAttribute = L.control.attribution().addTo(map);
    
ctlAttribute.addAttribution('&copy; <a href="https://github.com/sabberrahman"> Sabber rahman</a>');

baseLayers = {
  Karte: lyrKarte,
  Mapnik: lyrMapnik,
  Esri: lyrEsri,
  Stadia: lyrStadia,
};

var ftgDraw = L.featureGroup().addTo(map);

//--------DATA----------

lyrEgleNest = L.geoJSON
  .ajax("data/wildlife_eagle.geojson", {
    pointToLayer: returnEagleIcon,
  })
  .addTo(map);

//  markerCuster = new L.markerClusterGroup();
// lyrBuowl = L.geoJSON.ajax("data/wildlife_buowl.geojson",{pointToLayer:returnBuowlIcon})

// lyrBuowl.on("data:loaded",()=>{
//   markerCuster.addLayer(lyrBuowl)
//  map.addLayer(markerCuster)
// })

markerCuster = L.markerClusterGroup();
lyrBuowl = L.geoJSON.ajax("data/wildlife_raptor.geojson", {
  pointToLayer: returnBuowlIcon,
});
lyrBuowl.on("data:loaded", function () {
  markerCuster.addLayer(lyrBuowl);
  markerCuster.addTo(map);
});

// featureGroup/custer, or gjson data load  , addTolayer
overLays = {
  Draw: ftgDraw,
  "Eagle Nest": lyrEgleNest,
  "Buowl Located": markerCuster,
};

ctlLayer = L.control.layers(baseLayers, overLays).addTo(map);

// var mkrGazi= L.marker([23.9821,90.34312],{draggable:true}).bindTooltip("from gazipur").addTo(map)

// mkrGazi.on("dragend",()=>{
//   mkrGazi.bindTooltip(" current location: "+mkrGazi.getLatLng().toString()+" <br/>"+ "distance from GAzipur: "+ mkrGazi.getLatLng().distanceTo([23.988708,90.3711518]).toFixed(0) )
// })

var sidebar = L.control.sidebar("sidebar").addTo(map);
map.addControl(sidebar);

L.easyButton("fa-hand", () => {
  sidebar.toggle();
}).addTo(map);

var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: ftgDraw,
  },
});
map.addControl(drawControl);

map.on("draw:created", (e) => {
  const layer = e.layer;
  map.addLayer(layer);
  layer.addTo(ftgDraw);

  if (e.layerType === "marker") {
    layer.bindPopup(layer.getLatLng().toString());
  }
});

map.addControl(
  L.control.styleEditor({ position: "topleft", useGrouping: false })
);

// ---------functions ---------
function returnEagleIcon(json, latlng) {
  var colorNest;
  var opacityNest;
  var att = json.properties;
  // console.log(att)
  if (att.status == "ACTIVE NEST") {
    colorNest = "green";
    opacityNest = 1;
  } else {
    colorNest = "red";
    opacityNest = 0.1;
  }
  return L.circle(latlng, {
    radius: 800,
    color: colorNest,
    opacity: opacityNest,
  }).bindTooltip("Nest Numbr: " + att.nest_id + "<br/> Status : " + att.status); // dont addto(map) here
}

function returnBuowlIcon(json, latlng) {
  var att = json.properties;
  var color;
  //console.log(att);
  switch (att.recentspecies) {
    case "Red-tail Hawk":
      color = "red";
      break;
    case "Swainsons Hawk":
      color = "yellow";
      break;

    default:
      color="blue"
      break;
  }
  return L.circle(latlng, { radius: 600 , color:color,}).bindTooltip("Species: "+ att.recentspecies+ "<br/> Nest Id: "+att.Nest_ID+"<br/> Last Survey : "+att.lastsurvey+ "<br/> Status: "+ att.recentstatus);
}
