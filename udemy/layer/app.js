var ctlLayer;
var baseLayers;
var overLays;
var lyrDraw;


const map = L.map("map", { attributionControl: false }).setView(
  [23.988703, 90.371518],
  12
);
var lyrKarte = L.tileLayer.provider('OPNVKarte')
var lyrMapnik = L.tileLayer.provider('OpenStreetMap.Mapnik')
var lyrEsri = L.tileLayer.provider('Esri.WorldImagery')
var lyrStadia = L.tileLayer.provider('Stadia.AlidadeSmoothDark')
map.addLayer(lyrStadia)

var ftgDraw= L.featureGroup().addTo(map)

baseLayers={
  "Karte":lyrKarte,
  "Mapnik":lyrMapnik,
  "Esri":lyrEsri,
  "Stadia":lyrStadia
};

overLays={
 "Draw": ftgDraw,
}
ctlLayer= L.control.layers(baseLayers,overLays).addTo(map)

var mkrGazi= L.marker([23.9821,90.34312],{draggable:true}).bindTooltip("from gazipur").addTo(map)

mkrGazi.on("dragend",()=>{
  mkrGazi.bindTooltip(" current location: "+mkrGazi.getLatLng().toString()+" <br/>"+ "distance from GAzipur: "+ mkrGazi.getLatLng().distanceTo([23.988708,90.3711518]).toFixed(0) )
})

var sidebar = L.control.sidebar('sidebar').addTo(map);
map.addControl(sidebar)


L.easyButton("fa-hand",()=>{
  sidebar.toggle()
}).addTo(map)


var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var drawControl = new L.Control.Draw({edit: {
  featureGroup: ftgDraw
}})
    map.addControl(drawControl);

map.on("draw:created",(e)=>{
  const  layer = e.layer
  map.addLayer(layer)
  layer.addTo(ftgDraw)

  if (e.layerType === 'marker') {
    layer.bindPopup(layer.getLatLng().toString())
}

})

map.addControl(L.control.styleEditor({position:"topleft",useGrouping:false}))


