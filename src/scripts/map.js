const iconSize = 36
// Initiate map and set view
var map = L.map('map').setView([40.418, -86.897], 12);
// Create a tile layer and add map to it
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create two layers, one for each marker type
let flockLayer = L.layerGroup();
let purdueLayer = L.layerGroup();

// Initiate marker icons
var flockcam = L.icon({
    iconUrl: '../images/flock-camera-icon.png',
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize/2, iconSize]
})

var purduecam = L.icon({
    iconUrl: '../images/purdue-camera-icon.png',
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize/2, iconSize]
})

// Add the markers to the map from corresponding json files
async function addFlockMarkers() {
    try {
        const response = await fetch('../location_data/GreaterLAF-Flock-Cameras.geojson');
        if (!response.ok) throw new Error('File not found');
        const data = await response.json(); // Parse JSON directly

        let i=0;

        while (data.features[i]) {
            let coords = data.features[i].geometry.coordinates;
            flockLayer.addLayer(L.marker([coords[1], coords[0]], {icon: flockcam}));
            i++;
        }
    } catch (error) {
        console.error('Error reading JSON:', error.message);
    }
}

async function addPurdueMarkers() {
    try {
        const response = await fetch('../location_data/Purdue_Security_Purdue_Cameras.geojson');
        if (!response.ok) throw new Error('File not found');
        const data = await response.json(); // Parse JSON directly

        let i=0;

        while (data.features[i]) {
            let coords = data.features[i].geometry.coordinates;
            purdueLayer.addLayer(L.marker([coords[1], coords[0]], {icon: purduecam}));
            i++;
        }
    } catch (error) {
        console.error('Error reading JSON:', error.message);
    }
}

addFlockMarkers();
addPurdueMarkers();

// Add layers to map
flockLayer.addTo(map);
purdueLayer.addTo(map);


// Create a legend div
var legend = L.control({ position: "topright" });

// Add the two legend items, with switches
legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += 
    `
        <div id="inner_legend">
            <br>
            
            <label class="legend_item">
                <div class="switch">
                    <input type="checkbox" checked id=flock-visible>
                    <span class="slider round"></span>
                </div>
                <img id="legend-flock-icon" src="../images/flock-camera-icon.png" width=`+ iconSize +`">
                <span> Flock Cameras </span>
            </label><br>

            <label class="legend_item">
                <div class="switch">
                    <input type="checkbox" checked id=purdue-visible>
                    <span class="slider round"></span>
                </div>
                <input type="checkbox" checked id="purdue-visible" style="display: none">
                <img id="legend-purdue-icon" src="../images/purdue-camera-icon.png" width=`+ iconSize +`">
                <span> Purdue Cameras </span>
            </label><br>
        </div>`;
    return div;
};

legend.addTo(map);

// Toggle the visibility of marker types
document.getElementById('flock-visible').addEventListener('change', e => {
    let icon = document.getElementById('legend-flock-icon');
	if(e.target.checked) {
        map.addLayer(flockLayer);
        icon.src = "../images/flock-camera-icon.png"
    }
	else {
        map.removeLayer(flockLayer);
        icon.src = "../images/flock-camera-icon-off.png"
    }
});

document.getElementById('purdue-visible').addEventListener('change', e => {
    let icon = document.getElementById('legend-purdue-icon')
    if(e.target.checked) {
        map.addLayer(purdueLayer);
        icon.src = "../images/purdue-camera-icon.png"
    }
	else {
        map.removeLayer(purdueLayer);
        icon.src = "../images/purdue-camera-icon-off.png"
    }
});