const map = L.map("map").setView([23.777176, 90.399452], 10);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

function getTheList() {
  const ui = document.querySelector(".list");
  storeList.forEach((shop) => {
    const div = document.createElement("div");
    const a = document.createElement("a");
    const li = document.createElement("li");
    const p = document.createElement("p");
    const pAdress = document.createElement("p");
    a.addEventListener("click", () => {
      flytoLocation(shop);
    });

    div.classList.add("style-list");
    a.innerText = shop.properties.name;
    a.href = "#";
    pAdress.innerText = shop.properties.address;
    p.innerText = shop.properties.phone;

    div.appendChild(a);
    div.appendChild(pAdress);
    div.appendChild(p);
    li.appendChild(div);
    ui.appendChild(li);
  });
}
getTheList();

function flytoLocation(shop) {
  map.flyTo([shop.geometry.coordinates[1], shop.geometry.coordinates[0]], 15, {
    duration: 3,
  });

  setTimeout(() => {
    L.popup()
      .setLatLng([shop.geometry.coordinates[1], shop.geometry.coordinates[0]])
      .setContent(makePopupcontent(shop))
      .openOn(map);
  }, 3000);
}
function makePopupcontent(shop) {
  return `
    <div>
    <h1 class="font-bold">${shop.properties.name}</h1>
    <h3>${shop.properties.address}</h3>
    <div>
    <a class="" href="tel:${shop.properties.phone}">${shop.properties.phone}</a>
    </div>
    
    </div> 
 `;
}
function onEachFeature(feature, layer) {
  console.log(feature);
  layer.bindPopup(makePopupcontent(feature));
}

const iconMarker = L.icon({
  iconUrl: "cupcakee.png",
  iconSize: "50", //[30,40]
});

const storeLayer = L.geoJSON(storeList, {
  onEachFeature: onEachFeature, //omkta forEach
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: iconMarker });
  },
});

storeLayer.addTo(map);

// basically
// <ul class="list">
// <li>
//   <div class="shop-item">
//     <a href="#">Shop Name</a>
//     <p>Shop Phone</p>
//   </div>
// </li>
// </ul>
