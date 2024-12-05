

const map = L.map("map").setView([23.777176, 90.399452], 7);

const titleLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

titleLayer.addTo(map)
var mapJSon = L.geoJSON(mapData,{style: feature => ({
    color: "#000", // Boundary color
    weight: 1,
    fillColor: "#f2f2f2", // Default fill color
    fillOpacity: 0.6
}),onEachFeature:returnOnEach}).addTo(map)


// ************functions***********
function returnOnEach(feature,layer){
  //console.log(feature)
    layer.on({
        mouseover: e => {
            const layer = e.target;
            layer.setStyle({
                fillColor: "red",
                fillOpacity: 0.5
            });
        },
        mouseout: e => { 
            mapJSon.resetStyle(e.target);
        }
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

        console.log(center)
     //   console.log(coordinates)
    
        // Fly to the center
        if (center) {
            map.flyTo([center[1], center[0]], 9); // [latitude, longitude]
        } else {
            console.error("Could not determine center for the feature.");
        }
    });
  const details = `
  <strong>${feature.properties.shapeName}</strong><br>
  Id: ${feature.properties.shapeID}<br>
`;
layer.bindTooltip(details, { sticky: true });
}

