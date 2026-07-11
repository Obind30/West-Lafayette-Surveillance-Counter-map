const iconSize = 36

var map = L.map('map').setView([40.418, -86.897], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let flockLayer = L.layerGroup();
let purdueLayer = L.layerGroup();

var flockcam = L.icon({
    iconUrl: 'src/images/flock-camera-icon.png',
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize/2, iconSize]
})

var purduecam = L.icon({
    iconUrl: 'src/images/purdue-camera-icon.png',
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize/2, iconSize]
})

async function addFlockMarkers() {
    try {
        const response = await fetch('src/location_data/GreaterLAF-Flock-Cameras.geojson');
        if (!response.ok) throw new Error('File not found');
        const data = await response.json(); // Parse JSON directly

        let i=0;

        while (data.features[i]) {
            let coords = data.features[i].geometry.coordinates;
            flockLayer.addLayer(L.marker([coords[1], coords[0]], {icon: flockcam}));
            //L.marker([coords[1], coords[0]], {icon: flockcam}).addTo(map);
            i++;
        }
    } catch (error) {
        console.error('Error reading JSON:', error.message);
    }
}

async function addPurdueMarkers() {
    try {
        const response = await fetch('src/location_data/Purdue_Security_Purdue_Cameras.geojson');
        if (!response.ok) throw new Error('File not found');
        const data = await response.json(); // Parse JSON directly

        let i=0;

        while (data.features[i]) {
            let coords = data.features[i].geometry.coordinates;
            purdueLayer.addLayer(L.marker([coords[1], coords[0]], {icon: purduecam}));
            //L.marker([coords[1], coords[0]], {icon: purduecam}).addTo(map);
            i++;
        }
    } catch (error) {
        console.error('Error reading JSON:', error.message);
    }
}

addFlockMarkers();
addPurdueMarkers();

flockLayer.addTo(map);
purdueLayer.addTo(map);

document.getElementById('flock_visible').addEventListener('change', e => {
	if(e.target.checked) map.removeLayer(flockLayer);
	else map.addLayer(flockLayer);
});

document.getElementById('purdue_visible').addEventListener('change', e => {
	if(e.target.checked) map.removeLayer(purdueLayer);
	else map.addLayer(purdueLayer);
});