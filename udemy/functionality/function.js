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
var arLines = [];
var arBuowl = [];
var arEagleIDs = [];
var numActiveEagle = 0;
var numInactiveEagle = 0;
var numActiveBuowl = 0;
var numInactiveBuowl = 0;

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
sidebar.show();

L.easyButton("fa-exchange", () => {
  sidebar.toggle(); //v4
}).addTo(map);

map.addControl(
  L.control.styleEditor({ position: "topright", useGrouping: false })
);

//*********layer section************/
//EX: layer map, adding FeatureGroup, addToLayer

var lyrKarte = L.tileLayer.provider("OPNVKarte");
var lyrMapnik = L.tileLayer.provider("OpenStreetMap.Mapnik");
var lyrEsri = L.tileLayer.provider("Esri.WorldImagery");
map.addLayer(lyrKarte);

var osm2 = new L.tileLayer.provider("OPNVKarte", { minZoom: 0, maxZoom: 10 });
var miniMap = new L.Control.MiniMap(osm2).addTo(map);

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

lyrRaptor = L.geoJSON.ajax("data/wildlife_raptor.geojson");
lyrLines = L.geoJSON
  .ajax("data/client_lines.geojson", { style: styleLines })
  .addTo(map);

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
  //"Raptor":lyrRaptor,
  "Road Lines": lyrLines,
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

$("#btnFindLines").click(function () {
  var val = $("#txtFindLines").val();
  var lyr = returnLayerByAttribute(lyrLines, "Project", val); // return match obj
  if (lyr) {
    if (lyrSearch) {
      lyrSearch.remove();
    }
    lyrSearch = L.geoJSON(lyr.toGeoJSON(), {
      style: { color: "red", weight: 10, opacity: 0.5 },
    }).addTo(map);
    map.fitBounds(lyr.getBounds().pad(1));
    var att = lyr.feature.properties;
    $("#divLinesData").html(
      " <h4 class='font-bold mt-4 p-2'>Attributes</h4><h5>Type: " +
        att.type +
        "</h5><h5 class='mb-2'>ROW width: " +
        att.row_width +
        "m </h5> "
    );
    $("#divErrorLine").html("");
  } else {
    $("#divErrorLine").html("<h4 class='p-2'>Project ID not found</h4>");
    $("#divLinesData").html("");
  }
});

//**Eagle nest****/
$("#btnFindNest").click(function () {
  var val = $("#txtFindNest").val();
  var lyr = returnLayerByAttribute(lyrEgleNest, "nest_id", val); // return match obj
  if (lyr) {
    if (lyrSearch) {
      lyrSearch.remove();
    }
    lyrSearch = L.geoJSON(lyr.toGeoJSON(), {
      style: { color: "red", weight: 10, opacity: 0.5 },
    }).addTo(map);
    map.fitBounds(lyr.getBounds().pad(1));
    var att = lyr.feature.properties;
    //     console.log(att)
    $("#divNestData").html(`

        <div class='mb-2'>
        <h4 class='font-bold mt-4 p-2'>Attribute of the Nest</h4>
        <div class='inline-flex gap-2'>
        <h5>Status: </h5>
        <h5 class='${
          att.status === "ACTIVE NEST" ? "text-green-500" : "text-red-500"
        } inline-flex'> 
          ${att.status}
        </h5> </div> </div>
      `);
    $("#divErrorNest").html("");
  } else {
    $("#divErrorNest").html("<h4 class='p-2'>Project ID not found</h4>");
    $("#divNestData").html("");
  }
});

// ***autocompelte*******

lyrEgleNest.on("data:loaded", function () {
  arEagleIDs.sort(function (a, b) {
    return a - b;
  });
  $("#txtFindNest").autocomplete({
    source: arEagleIDs,
  });
});

lyrBuowl.on("data:loaded", function () {
  arBuowl.sort(function (a, b) {
    return a - b;
  });
  $("#txtFindBuowl").autocomplete({
    source: arBuowl,
  });
});

lyrLines.on("data:loaded", function () {
  arLines.sort(function (a, b) {
    return a - b;
  });
  $("#txtFindLines").autocomplete({
    source: arLines,
  });
});

//BUOWL nest event/
$("#btnFindBuowl").click(function () {
  var val = $("#txtFindBuowl").val();
  var lyr = returnLayerByAttribute(lyrBuowl, "Nest_ID", val); // return match obj
  if (lyr) {
    if (lyrSearch) {
      lyrSearch.remove();
    }
    lyrSearch = L.geoJSON(lyr.toGeoJSON(), {
      style: { color: "red", weight: 10, opacity: 0.5 },
    }).addTo(map);

    let Bounds = lyrSearch.getBounds();
    map.fitBounds(Bounds, { maxZoom: 15 });
    var att = lyr.feature.properties;
    // console.log(att)
    $("#divBuowlData").html(`

        <div class='mb-2'>
        <h4 class='font-bold mt-4 p-2'>Attribute of the Nest</h4>
        <div class='inline-flex gap-2'>
        <h5>Status: </h5>
        <h5 class='${
          att.recentstatus === "ACTIVE NEST" ? "text-green-500" : "text-red-500"
        } inline-flex'> 
          ${att.recentstatus}
        </h5> </div> <br/>

        <div class='inline-flex gap-2'>
        <h5>Species: </h5>
        <h5 class='inline-flex font-semibold'> 
          ${att.recentspecies}
        </h5> </div> 
        
        </div>
      `);
    $("#divErrorBuowl").html("");
  } else {
    $("#divErrorBuowl").html("<h4 class='p-2'>Project ID not found</h4>");
    $("#divBuowlData").html("");
  }
});

$("input[name=custom]").click(function () {
  var val = $(this).val();
  if ($(this).is(":checked")) {
    if (val === "Eagle") {
      map.addLayer(lyrEgleNest);
    }

    if (val === "Road") {
      map.addLayer(lyrLines);
    }
    if (val === "Buowl") {
      map.addLayer(markerCuster);
    }
  } else {
    if (val === "Eagle") {
      lyrEgleNest.remove();
    }
    if (val === "Road") {
      lyrLines.remove();
    }
    if (val === "Buowl") {
      markerCuster.remove();
    }
  }
});



// ********functions************
function returnEagleIcon(json, latlng) {
  var colorNest;
  var opacityNest;
  var att = json.properties;
  arEagleIDs.push(att.nest_id.toString());
  // console.log(att)
  if (att.status == "ACTIVE NEST") {
    colorNest = "green";
    opacityNest = 1;
    numActiveEagle++;
  } else {
    colorNest = "red";
    opacityNest = 0.1;
    numInactiveEagle++;
  }
  return L.circle(latlng, {
    radius: 800,
    color: colorNest,
    opacity: opacityNest,
  }).bindTooltip("Nest Numbr: " + att.nest_id + "<br/> Status : " + att.status); // dont addto(map) here
}

function returnBuowlIcon(json, latlng) {
  var att = json.properties;
  arBuowl.push(att.Nest_ID.toString());
  var color;
  //console.log(att);
  if (att.recentstatus == "ACTIVE NEST") {
    numActiveBuowl++;
  } else {
    numInactiveBuowl++;
  }
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

function returnLayerByAttribute(lyr, att, val) {
  var arLayers = lyr.getLayers();
  for (i = 0; i < arLayers.length - 1; i++) {
    var ftrVal = arLayers[i].feature.properties[att];
    if (ftrVal == val) {
      return arLayers[i];
    }
  }
  return false;
}

function styleLines(json) {
  var att = json.properties;
  arLines.push(att.Project.toString());
  switch (att.type) {
    case "Pipeline":
      return { color: "peru" };
      break;
    case "Flowline":
      return { color: "navy" };
      break;
    case "Flowline, est.":
      return { color: "navy", dashArray: "5,5" };
      break;
    case "Electric Line":
      return { color: "darkgreen" };
      break;
    case "Access Road - Confirmed":
      return { color: "darkred" };
      break;
    case "Access Road - Estimated":
      return { color: "darkred", dashArray: "5,5" };
      break;
    case "Extraction":
      return { color: "indigo" };
      break;
    default:
      return { color: "darkgoldenrod" };
  }
}

function removeMarkersByStatus(layer, strStatus) {
  layer.eachLayer((marker) => {
    if (marker.feature && marker.feature.properties) {
      if (
        marker.feature.properties.recentstatus === strStatus ||
        marker.feature.properties.status === strStatus
      ) {
        // marker.setStyle({ opacity: 0 }); 
        marker.remove();
      }
    }
  });
}

function addMarkersByStatus(layer) {
  layer.eachLayer((marker) => {
   marker.addTo(map)
  });
}


$("#btnRemoveActive").click(()=>{

  removeMarkersByStatus(lyrEgleNest, "ACTIVE NEST")
  removeMarkersByStatus(markerCuster, "ACTIVE NEST")

})

$("#btnRemoveInactive").click(()=>{

  removeMarkersByStatus(lyrEgleNest, "INACTIVE LOCATION")
  removeMarkersByStatus(markerCuster, "INACTIVE NEST")

 })
 $("#btnAddAllStatus").click(()=>{
  addMarkersByStatus(lyrEgleNest)
  markerCuster.remove();
  addMarkersByStatus(markerCuster)
 })

setInterval(() => {
  $("#activeEagle").text(numActiveEagle);
  $("#activeBuowl").text(numActiveBuowl);
  $("#inactiveEagle").text(numInactiveEagle);
  $("#inactiveBuowl").text(numInactiveBuowl);
}, 1000);

//***********common functions*******/
