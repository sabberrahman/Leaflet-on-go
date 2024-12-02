var ctlLayer;
var baseLayers;
var overLays;
var lyrDraw;
var lyrEgleNest;
var lyrBuowl;
var lyrRaptor;
var lyrLines;
var markerCuster;
var lyrSearch;

//map> layer> data> layer control> layer functions > events + common functions

//*********MAP SECTION********/
//ex: map, att, sidebar, button, custom controler (visualible buttons)

const map = L.map("map", { attributionControl: false }).setView(
  [40.191463, -104.842529],
  9
);

var ctlAttribute = L.control.attribution().addTo(map);
ctlAttribute.addAttribution(
  '&copy; <a href="https://github.com/sabberrahman"> Sabber rahman</a>'
);

var sidebar = L.control.sidebar("sidebar").addTo(map);
map.addControl(sidebar);
sidebar.show()

L.easyButton("glyphicon-transfer", () => {
  sidebar.toggle();
}).addTo(map);

map.addControl(
  L.control.styleEditor({ position: "topleft", useGrouping: false })
);


//*********layer section************/
//EX: layer map, adding FeatureGroup, addToLayer

var lyrKarte = L.tileLayer.provider("OPNVKarte");
var lyrMapnik = L.tileLayer.provider("OpenStreetMap.Mapnik");
var lyrEsri = L.tileLayer.provider("Esri.WorldImagery");
map.addLayer(lyrKarte);

var ftgDraw = L.featureGroup().addTo(map);
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: ftgDraw,
  },
});
map.addControl(drawControl);

markerCuster = L.markerClusterGroup();


//********GeoJSON data**********/

lyrEgleNest = L.geoJSON
  .ajax("data/wildlife_eagle.geojson", {
    pointToLayer: returnEagleIcon,
  })
  .addTo(map);


lyrBuowl = L.geoJSON.ajax("data/wildlife_raptor.geojson", {
  pointToLayer: returnBuowlIcon,
});

lyrRaptor=L.geoJSON.ajax("data/wildlife_raptor.geojson")
lyrLines=L.geoJSON.ajax("data/client_lines.geojson").addTo(map)


// ****dymatic layer*********
//ex: chose map, turn on/off layer with data
baseLayers = {
  Karte: lyrKarte,
  Mapnik: lyrMapnik,
  Esri: lyrEsri,
  //  Stadia: lyrStadia,
};

overLays = {
  Draw: ftgDraw,
  "Eagle Nest": lyrEgleNest,
  "Buowl Located": markerCuster,
  "Raptor":lyrRaptor,
  "Road Lines":lyrLines
};

ctlLayer = L.control.layers(baseLayers, overLays).addTo(map);

//********layer events/ Any events*******/

lyrBuowl.on("data:loaded", function () {
  markerCuster.addLayer(lyrBuowl);
  markerCuster.addTo(map);
});

map.on("draw:created", (e) => {
  const layer = e.layer;
  map.addLayer(layer);
  layer.addTo(ftgDraw);

  if (e.layerType === "marker") {
    layer.bindPopup(layer.getLatLng().toString());
  }
});

// *lines events*

$("#btnFindLines").click(function(){
  var val = $("#txtFindLines").val();
  var lyr = returnLayerByAttribute(lyrLines,'Project',val); // return match obj 
  if (lyr) {
      if (lyrSearch) {
          lyrSearch.remove();
      }
      lyrSearch = L.geoJSON(lyr.toGeoJSON(), {style:{color:'red', weight:10, opacity:0.5}}).addTo(map);
      map.fitBounds(lyr.getBounds().pad(1));
      var att = lyr.feature.properties;
      $("#divLinesData").html(" <h4 class='font-bold mt-4 p-2'>Attributes</h4><h5>Type: "+att.type+"</h5><h5 class='mb-2'>ROW width: "+att.row_width+ "m </h5> ");
      $("#divErrorLine").html("");
  } else {
      $("#divErrorLine").html("<h4 class='p-2'>Project ID not found</h4>");
      $("#divLinesData").html("");
  }
});



// ********functions************
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
      color = "blue";
      break;
  }
  return L.circle(latlng, { radius: 600, color: color }).bindTooltip(
    "Species: " +
      att.recentspecies +
      "<br/> Nest Id: " +
      att.Nest_ID +
      "<br/> Last Survey : " +
      att.lastsurvey +
      "<br/> Status: " +
      att.recentstatus
  );
}

function returnLayerByAttribute(lyr,att,val) {
  var arLayers = lyr.getLayers();
  for (i=0;i<arLayers.length-1;i++) {
      var ftrVal = arLayers[i].feature.properties[att];
      if (ftrVal==val) {
          return arLayers[i];
      }
  }
  return false;
}

//***********common functions*******/
