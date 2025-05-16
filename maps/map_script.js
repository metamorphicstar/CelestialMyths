document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map and set its view to a chosen geographical coordinates and zoom level
    var map = L.map('map').setView([20, 0], 2); // Centered broadly, zoom level 2

    // Add a tile layer to add to our map, for example OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Fetch the GeoJSON data
    fetch('./myth_locations.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        var popupContent = `<h3>${feature.properties.mythName}</h3>` +
                                         `<p><strong>Culture:</strong> ${feature.properties.culture}</p>` +
                                         `<p><strong>Celestial Sign:</strong> ${feature.properties.celestialSign}</p>` +
                                         `<p><strong>Journey Type:</strong> ${feature.properties.journeyType}</p>` +
                                         `<p><strong>Catastrophe:</strong> ${feature.properties.catastrophe}</p>` +
                                         `<p><strong>Heinsohn's Redating:</strong> ${feature.properties.redating}</p>` +
                                         `<p><strong>Potential Celestial Cause:</strong> ${feature.properties.potentialCause}</p>`;
                        layer.bindPopup(popupContent);
                    }
                }
            }).addTo(map);
        })
        .catch(error => console.error('Error loading GeoJSON data:', error));
}); 