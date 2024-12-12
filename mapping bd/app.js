var allPoints = [];
var searchWithin;

const map = L.map("map").setView([23.777176, 90.399452], 7);

const titleLayer = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20,
  }
);
var lyrKarte = L.tileLayer.provider("OPNVKarte");
var lyrMapnik = L.tileLayer.provider("OpenStreetMap.Mapnik");
var lyrEsri = L.tileLayer.provider("Esri.WorldImagery");

titleLayer.addTo(map);
var mapJSon = L.geoJSON(mapData, {
  style: (feature) => ({
    color: "#000", // Boundary color
    weight: 1,
    dashArray: "3",
    fillColor: getColor(feature.properties.shapeID), // Default fill color
    fillOpacity: 0.7,
  }),
  onEachFeature: returnOnEach,
}).addTo(map);

// const styleOptions = {
//     color: "blue",
//     weight: 1,
//     fillColor: "#f2f2f2",
//     fillOpacity: 0.6
// };

// var education = L.geoJSON.ajax("data/education-data.geojson",{onEachFeature:returnOnEdu,style: feature => ({
//     color: "red", // Boundary color
//     weight: 1,
//     fillColor: "blue", // Default fill color
//     fillOpacity: 0.6
// })}).addTo(map)

baseLayer = {
  "OSM": titleLayer,
  "Open Street Map": lyrEsri,
  "karte Map": lyrKarte,
  "Mapnik Map": lyrMapnik,
};

otherLayers = {
  "bangladesh Dist": mapJSon,
  // "School, collage": education
};

L.control.layers(baseLayer, otherLayers).addTo(map);

// ************functions***********
function returnOnEach(feature, layer) {
  const cityName = feature.properties.shapeName;
  // console.log(feature.properties.shapeName)
  layer.on({
    mouseover: (e) => {
      const layer = e.target;
      layer.setStyle({
        fillColor: "red",
        fillOpacity: 0.5,
      });
    },
    mouseout: (e) => {
      mapJSon.resetStyle(e.target);
    },
  });

  layer.on("click", () => {
    const coordinates = feature.geometry.coordinates;
    let center;

    if (feature.geometry.type === "Polygon") {
      center = coordinates[0][0]; // First coordinate of the first ring
    } else if (feature.geometry.type === "MultiPolygon") {
      // For MultiPolygon, first polygon and first coordinate
      center = coordinates[0][0][0];
    }

    // console.log(layer)
    //  console.log(coordinates)

    // Fly to the center
    if (center) {
      map.flyTo([center[1], center[0]], 9); // [latitude, longitude]
    } else {
      console.error("Could not determine center for the feature.");
    }
  });
  const details = `<div class="divImg">
  <strong class="">${feature.properties.shapeName}</strong><br>
  <img src="./images/${cityName}.jpg"/>
  Populations: ${feature.properties.shapeID}<br>
  </div>
`;
  layer.bindTooltip(details, { sticky: true });
}

// function returnOnEdu(feature,layer){
//  // console.log(layer._latlng)
//   allPoints.push(layer._latlng)
// }
// console.log(allPoints)

var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [
    500000, 700000, 1000000, 1500000, 2000000, 3000000, 4000000, 6000000,
  ];
  var colors = [
    "#ADD8E6",
    "#87CEEB",
    "#00BFFF",
    "#1E90FF",
    "#6495ED",
    "#4169E1",
    "#0000CD",
    "#00008B",
  ];

  // Loop through the grades and colors to generate the legend labels
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      colors[i] +
      '"></i> ' +
      grades[i] +
      (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }

  return div;
};

// Add the legend to the map
legend.addTo(map);

function getColor(d) {
  let color = parseInt(d.replace(/,/g, ""), 10);
  // console.log(color)
  return color > 6000000
    ? "#00008B"
    : color > 4000000
    ? "#0000CD"
    : color > 3000000
    ? "#4169E1"
    : color > 2000000
    ? "#6495ED"
    : color > 1500000
    ? "#1E90FF"
    : color > 1000000
    ? "#00BFFF"
    : color > 700000
    ? "#87CEEB"
    : color > 500000
    ? "#ADD8E6"
    : "#ADD8E6";
}
