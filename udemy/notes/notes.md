
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


# find projects

 ```html js
 <div id="divProject" class="col-xs-12">
                <div id="divProjectLabel" class="text-center col-xs-12">
                    <h4 id="lblProject">Linear Projects</h4>
                </div>
                <div id="divProjectError" class="errorMsg col-xs-12"></div>
                <div id="divFindProject" class="form-group has-error">
                    <div class="col-xs-6">
                        <input type="text" id="txtFindProject" class="form-control" placeholder="Project ID">
                    </div>
                    <div class="col-xs-6">
                        <button id="btnFindProject" class="btn btn-primary btn-block" disabled>Find Project</button>
                    </div>
                </div>
                <div class="" id="divProjectData"></div>
</div> 



        $("#txtFindProject").on('keyup paste', function(){
                var val = $("#txtFindProject").val();
                testLayerAttribute(arProjectIDs, val, "PROJECT ID", "#divFindProject", "#divProjectError", "#btnFindProject");
            });

        $("#btnFindProject").click(function(){
                var val = $("#txtFindProject").val();
                var lyr = returnLayerByAttribute(lyrClientLines,'Project',val); // return match obj 
                if (lyr) {
                    if (lyrSearch) {
                        lyrSearch.remove();
                    }
                    lyrSearch = L.geoJSON(lyr.toGeoJSON(), {style:{color:'red', weight:10, opacity:0.5}}).addTo(mymap);
                    mymap.fitBounds(lyr.getBounds().pad(1));
                    var att = lyr.feature.properties;
                    $("#divProjectData").html("<h4 class='text-center'>Attributes</h4><h5>Type: "+att.type+"</h5><h5>ROW width: "+att.row_width+ "m </h5>");
                    $("#divProjectError").html("");
                } else {
                    $("#divProjectError").html("**** Project ID not found ****");
                }
        });

        function processClientLinears(json, lyr) {
            var att = json.properties;
            lyr.bindTooltip("<h4>Linear Project: "+att.Project+"</h4>Type: "+att.type+"<br>ROW Width: "+att.row_width);
            arProjectIDs.push(att.Project.toString());
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
```

# filter with checkBoxs

        ``` js
        <div id="divFilterProject" class="col-xs-12">
                            <div class="col-xs-4">
                                <input type='checkbox' name='fltProject' value='Pipeline' checked>Pipelines<br>
                                <input type='checkbox' name='fltProject' value='Road' checked>Access Roads
                                <button id="btnProjectFilterAll" class="btn btn-primary btn-block">Check All</button>
                            </div>
                            <div class="col-xs-4">
                                <input type='checkbox' name='fltProject' value='Electric' checked>Electric Lines<br>
                                <input type='checkbox' name='fltProject' value='Extraction' checked>Extractions
                                <button id="btnProjectFilterNone" class="btn btn-primary btn-block">Uncheck All</button>
                            </div>
                            <div class="col-xs-4">
                                <input type='checkbox' name='fltProject' value='Flowline' checked>Flowlines<br>
                                <input type='checkbox' name='fltProject' value='Other' checked>Other
                                <button id="btnProjectFilter" class="btn btn-primary btn-block">Filter</button>
                            </div>
        ```