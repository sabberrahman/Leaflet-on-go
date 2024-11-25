### chapter 1

$(document).ready(function(){
// fast load ?? jQuery
})

map.on("click",function(e){
alert(e.latLng.toString())
})

## locate me

const locate = document.querySelector("#btnLocate")
locate.addEventListener("click",()=>{
map.locate()
})

var mkMarker;
map.on("locationfound", function (e) {
console.log("Location found:", e.latlng);
if (mkMarker) {
mkMarker.remove(); //repeat hole remove korbe
}
mkMarker = L.circle(e.latlng, { radius:e.accuracy/100, color: "blue" }).addTo(map);

    map.setView(e.latlng, 13);

});

## jquery vs normal js

`$("#jqueryy").on("click",()=>{  
map.setView([23.988,90.371],15)  
L.marker([23.988,90.371]).addTo(map)  
})`

---

`const locate = document.querySelector("#btnLocate")
locate.addEventListener("click",()=>{
    map.locate()
})`

## PopUP
create a popup - latlng, content     
add it ti mymap.OpenPopup(popup that you created as parameter)