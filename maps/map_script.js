document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map and set its view to a chosen geographical coordinates and zoom level
    var map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: true,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
        preferCanvas: true
    });

    // Add a tile layer to add to our map, with multiple fallback servers
    var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 18,
        tileSize: 256,
        zoomOffset: 0,
        detectRetina: true,
        crossOrigin: true,
        className: 'map-tiles'
    }).addTo(map);

    // Add error handling for tile layer
    baseLayer.on('tileerror', function(e) {
        console.error('Tile error:', e);
        // Attempt to reload the tile
        setTimeout(function() {
            e.tile.src = e.url;
        }, 1000);
    });

    // Fetch the GeoJSON data with error handling and retry
    function fetchGeoJSON(retries = 3) {
        fetch('./myth_locations.geojson')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                L.geoJSON(data, {
                    onEachFeature: function (feature, layer) {
                        if (feature.properties) {
                            var popupContent = `<h3>${feature.properties.mythName}</h3>` +
                                             `<p><strong>Culture:</strong> ${feature.properties.culture}</p>` +
                                             `<p><strong>Celestial Sign:</strong> ${feature.properties.celestialSign}</p>` +
                                             `<p><strong>Journey Type:</strong> ${feature.properties.journeyType}</p>` +
                                             `<p><strong>Catastrophe:</strong> ${feature.properties.catastrophe}</p>` +
                                             `<p><strong>Conventional Date:</strong> ${feature.properties.conventionalDate || 'Not specified'}</p>` +
                                             `<p><strong>Heinsohn's Redating:</strong> ${feature.properties.redating}</p>` +
                                             `<p><strong>Potential Celestial Cause:</strong> ${feature.properties.potentialCause}</p>`;
                            layer.bindPopup(popupContent);
                        }
                    },
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, {
                            radius: 8,
                            fillColor: "#ff7800",
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                    }
                }).addTo(map);
            })
            .catch(error => {
                console.error('Error loading GeoJSON data:', error);
                if (retries > 0) {
                    setTimeout(() => fetchGeoJSON(retries - 1), 1000);
                }
            });
    }

    // Initial GeoJSON fetch
    fetchGeoJSON();

    // Handle window resize
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            map.invalidateSize();
        }, 250);
    });

    // Force a resize check after initial load
    setTimeout(function() {
        map.invalidateSize();
    }, 500);
}); 