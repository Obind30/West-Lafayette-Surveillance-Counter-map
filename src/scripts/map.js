const iconSize = 36;
const cameraFilepath = '../location_data/GreaterLAF-Cameras.geojson';

const flockIconSrc = '../images/flock-camera-icon.png';
const flockIconOffSrc = '../images/flock-camera-icon-off.png';
const frostIconSrc = '../images/frost-camera-icon.png';
const frostIconOffSrc = '../images/frost-camera-icon-off.png';
const purdueIconSrc = '../images/purdue-camera-icon.png';
const purdueIconOffSrc = '../images/purdue-camera-icon-off.png';

// Initiate map and set view
var map = L.map('map', {doubleClickZoom: false, zoomDelta: 0.5}).setView([40.418, -86.897], 12);
// Create a tile layer and add map to it
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create layers, for each marker type
let flockLayer = L.layerGroup();
let frostLayer = L.layerGroup();
let purdueLayer = L.layerGroup();
let cityLayer = L.layerGroup();
let countyLayer = L.layerGroup();
let progressLayer = L.layerGroup();

// Initiate marker icons
var flockcam = L.icon({
    iconUrl: flockIconSrc,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize/2, iconSize]
})

var frostcam = L.icon({
    iconUrl: frostIconSrc,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize/2, iconSize]
})

var purduecam = L.icon({
    iconUrl: purdueIconSrc,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize/2, iconSize]
})

// Add the markers to the map from corresponding json files
async function addMarkers() {
    try {
        const response = await fetch(cameraFilepath);
        if (!response.ok) throw new Error('File not found');
        const data = await response.json(); // Parse JSON directly

        L.geoJSON(data, {
            pointToLayer: function(geoJsonPoint, latlng) {
                if (geoJsonPoint.properties.brand == "Flock Safety") {
                    return L.marker(latlng, {icon: flockcam});
                } else if (geoJsonPoint.properties.brand == "Frost Solutions") {
                    return L.marker(latlng, {icon: frostcam});
                } else {
                    return L.marker(latlng, {icon: purduecam});
                }
                
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties.brand == "Flock Safety") {
                    flockLayer.addLayer(layer);
                } else if (feature.properties.brand == "Frost Solutions") {
                    frostLayer.addLayer(layer);
                } else {
                    purdueLayer.addLayer(layer);
                }
            }
        }).bindPopup(function (layer) {
            popupContent = `
                <div class="popup">
                <h3 class="popup-header">
                    Camera Properties:
                </h3>

                <ul class="property-list">
                    <li class="property-list-item">
                        <span class="property-label">Vendor:</span>
                        <input id="brand-entry" class="json-prop-field" type="text" value="` + layer.feature.properties.brand + `" disabled></input>
                    </li>

                    <li class="property-list-item">
                        <span class="property-label">Owner:</span>
                        <input id="owner-entry" class="json-prop-field" type="text" value="` + layer.feature.properties.owner + `" disabled></input>
                    </li>

                    <li class="property-list-item">
                        <span class="property-label">Surveillance Type:</span>
                        <input id="sur-zone-entry" class="json-prop-field" type="text" value="` + layer.feature.properties.surveillanceZone + `" disabled></input>
                    </li>

                    <li class="property-list-item">
                        <span class="property-label">Location:</span>
                        <input id="coords-entry" class="json-prop-field" type="text" value="` + layer.feature.geometry.coordinates + `" disabled></input>
                    </li>

                    <li class="property-list-item">
                        <span class="property-label">Identifier: </span>
                        <input id="id-entry" class="json-prop-field" type="text" value="` + layer.feature.properties.osmId + `" disabled></input>
                    </li>
                </ul>
                <button id="JSON-show" onclick="showJSON()">Copy JSON</button>
                <label>
                    <input type="checkbox" id="editable-check" class="popup-edit-check"></input>
                    <span class="popup-edit-label">
                        Edit
                    </span>
                </label>
                </div>
            `;
            return popupContent;
        },
        {offset: [0, -0.85*iconSize], closeButton: false, maxWidth: 325}).addTo(map);
    } catch (error) {
        console.error('Error reading JSON:', error.message);
    }
}

function draw_border(layer, filepath, color) {
    fetch(filepath)
    .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
    })
    .then((data) => {
        const lines = data.split(/\r?\n/).filter(Boolean);
        const array = lines.map((line) => line.split(','));
        var polyline = layer.addLayer(L.polyline(array, {color: color, dashArray: '5'}));
    })
}

addMarkers();

draw_border(cityLayer, '../location_data/WL_Border.csv', 'green');
draw_border(cityLayer, '../location_data/Laf_Border.csv', 'green');
draw_border(countyLayer, '../location_data/Tippecanoe_Border.csv', 'blue');

draw_border(progressLayer, '../location_data/Completed_Border.csv', 'red');

// Add layers to map
flockLayer.addTo(map);
frostLayer.addTo(map);
purdueLayer.addTo(map);
cityLayer.addTo(map);
countyLayer.addTo(map);
progressLayer.addTo(map);

// Create a legend div
var legend = L.control({ position: "topright" });

// Add the legend items, with switches
legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend dropdown");
    div.innerHTML += 
    `
        <button onclick="toggleLegend()" class="dropbtn">
            <h1 id="legend_title" class="legend_title">
                <img class="dropdown_pointer point_left" src="../images/chevron-pointer.svg" height="18px">
                Legend
                <img class="dropdown_pointer point_right" src="../images/chevron-pointer.svg" height="18px">
            </h1>
        </button>
        
        <div id="legend_content" class="dropdown_content">
        <label class="legend_item">
            <div class="switch">
                <input type="checkbox" checked id=flock-visible>
                <span class="slider round"></span>
            </div>
            <img id="legend-flock-icon" src="`+ flockIconSrc + `" width=`+ iconSize +`">
            <span> Flock Cameras </span>
        </label><br>

        <label class="legend_item">
            <div class="switch">
                <input type="checkbox" checked id=purdue-visible>
                <span class="slider round"></span>
            </div>
            <input type="checkbox" checked id="purdue-visible" style="display: none">
            <img id="legend-purdue-icon" src="` + purdueIconSrc + `" width=`+ iconSize +`">
            <span> Purdue Cameras </span>
        </label><br>

        <label class="legend_item">
            <div class="switch">
                <input type="checkbox" checked id=frost-visible>
                <span class="slider round"></span>
            </div>
            <img id="legend-frost-icon" src="`+ frostIconSrc + `" width=`+ iconSize +`">
            <span> Frost Cameras </span>
        </label><br>

        <label class="legend_item">
            <div class="switch">
                <input type="checkbox" checked id=city-visible>
                <span class="slider round"></span>
            </div>
            <input type="checkbox" checked id="city-visible" style="display: none">
            <img id="green-border-icon" src="../images/dashed-icon-green.svg" width=`+ iconSize +`">
            <span> City Borders </span>
        </label><br>

        <label class="legend_item">
            <div class="switch">
                <input type="checkbox" checked id=county-visible>
                <span class="slider round"></span>
            </div>
            <input type="checkbox" checked id="county-visible" style="display: none">
            <img id="blue-border-icon" src="../images/dashed-icon-blue.svg" width=`+ iconSize +`">
            <span> County Border </span>
        </label><br>

        <label class="legend_item">
            <div class="switch">
                <input type="checkbox" checked id=prog-visible>
                <span class="slider round"></span>
            </div>
            <input type="checkbox" checked id="prog-visible" style="display: none">
            <img id="red-border-icon" src="../images/dashed-icon-red.svg" width=`+ iconSize +`">
            <span> Progress Borders </span>
        </label><br>
        </div>
        `;
    return div;
};

legend.addTo(map);

function toggleLegend() {
  document.getElementById("legend_content").classList.toggle("show");
  document.getElementById("legend_title").classList.toggle("legend_shown");
  
  for (let element of document.getElementsByClassName("dropdown_pointer")) {
    element.classList.toggle("point_down");
  }
}

var about = L.control({ position: "bottomright" });

about.onAdd = function(map) {
    var div = L.DomUtil.create("div", "about-popup");
    div.innerHTML += `
        <h1>About this map</h1>
    `;
    return div;
}

about.addTo(map);

document.getElementsByClassName('about-popup')[0].addEventListener('click', e => {
    document.getElementById('info-popup').style.visibility = 'visible';
});

document.getElementById('popup-exit').addEventListener('click', e => {
    document.getElementById('info-popup').style.visibility = 'hidden';
})

// Toggle the visibility of marker types
document.getElementById('flock-visible').addEventListener('change', e => {
    let icon = document.getElementById('legend-flock-icon');
	if(e.target.checked) {
        map.addLayer(flockLayer);
        icon.src = flockIconSrc;
    }
	else {
        map.removeLayer(flockLayer);
        icon.src = flockIconOffSrc;
    }
});

document.getElementById('frost-visible').addEventListener('change', e => {
    let icon = document.getElementById('legend-frost-icon');
	if(e.target.checked) {
        map.addLayer(frostLayer);
        icon.src = frostIconSrc;
    }
	else {
        map.removeLayer(frostLayer);
        icon.src = frostIconOffSrc;
    }
});

document.getElementById('purdue-visible').addEventListener('change', e => {
    let icon = document.getElementById('legend-purdue-icon')
    if(e.target.checked) {
        map.addLayer(purdueLayer);
        icon.src = purdueIconSrc
    }
	else {
        map.removeLayer(purdueLayer);
        icon.src = purdueIconOffSrc;
    }
});

document.getElementById('city-visible').addEventListener('change', e => {
    if(e.target.checked) {
        map.addLayer(cityLayer);
    }
	else {
        map.removeLayer(cityLayer);
    }
});

document.getElementById('county-visible').addEventListener('change', e => {
    if(e.target.checked) {
        map.addLayer(countyLayer);
    }
	else {
        map.removeLayer(countyLayer);
    }
});

document.getElementById('prog-visible').addEventListener('change', e => {
    if(e.target.checked) {
        map.addLayer(progressLayer);
    }
	else {
        map.removeLayer(progressLayer);
    }
});

map.on('popupopen', function(ev) {
    document.getElementById('editable-check').addEventListener('change', e => {
        const fieldList = document.getElementsByClassName('json-prop-field');
        readOnlyState = true;
        if (e.target.checked) {
            readOnlyState = false;
        }
        for (let inputField of fieldList) {
            inputField.disabled = readOnlyState;
        }
    });
});

async function showJSON() {
    try {
        const response = await fetch(cameraFilepath);
        if (!response.ok) throw new Error('File not found');
        const data = await response.json(); // Parse JSON directly

        jsonData = data.features.filter(function (feature) {
            return feature.properties.osmId == document.getElementById('id-entry').value
        })[0];
        console.log(jsonData);
        jsonData.properties.brand = document.getElementById('brand-entry').value;
        jsonData.properties.owner = document.getElementById('owner-entry').value;
        jsonData.properties.surveillanceZone = document.getElementById('sur-zone-entry').value;
        jsonData.geometry.coordinates = document.getElementById('coords-entry').value.split(',').map(
            function(item){return Number(item);}
        );

        copyText = JSON.stringify(jsonData);

        console.log(copyText);

        // Copy the JSON to clipboard
        navigator.clipboard.writeText(copyText);
    } catch (error) {
        console.error('Error reading JSON');
    }
}