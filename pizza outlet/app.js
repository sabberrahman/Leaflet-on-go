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

    div.classList.add("style-list")
    a.innerText=shop.properties.name
    a.href="#"
    pAdress.innerText=shop.properties.address
    p.innerText=shop.properties.phone

    div.appendChild(a)
    div.appendChild(pAdress)
    div.appendChild(p)
    li.appendChild(div)
    ui.appendChild(li)
  });
}
getTheList()






// basically 
// <ul class="list">
// <li>
//   <div class="shop-item">
//     <a href="#">Shop Name</a>
//     <p>Shop Phone</p>
//   </div>
// </li>
// </ul>