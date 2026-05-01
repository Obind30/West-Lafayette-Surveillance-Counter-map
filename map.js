var map = L.map('map').setView([40.418, -86.897], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

async function addFlockMarkers() {
    try {
        const response = await fetch('GreaterLAF-Flock-Cameras.geojson');
        if (!response.ok) throw new Error('File not found');
        const data = await response.json(); // Parse JSON directly

        let i=0;

        while (data.features[i]) {
            let coords = data.features[i].geometry.coordinates;
            L.marker([coords[1], coords[0]]).addTo(map);
            i++;
        }
    } catch (error) {
        console.error('Error reading JSON:', error.message);
    }
}

async function addPurdueMarkers() {
    try {
        const response = await fetch('Purdue_Security_Purdue_Cameras.geojson');
        if (!response.ok) throw new Error('File not found');
        const data = await response.json(); // Parse JSON directly

        let i=0;

        while (data.features[i]) {
            let coords = data.features[i].geometry.coordinates;
            L.marker([coords[1], coords[0]]).addTo(map);
            i++;
        }
    } catch (error) {
        console.error('Error reading JSON:', error.message);
    }
}

addFlockMarkers();
addPurdueMarkers();