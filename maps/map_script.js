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

    // Function to determine marker color based on celestial sign description
    function getMarkerColor(celestialSign) {
        const signLower = celestialSign.toLowerCase();
        
        // Radiant Bridges/Paths (Blue)
        if (signLower.includes('bridge') || signLower.includes('path') || signLower.includes('road')) {
            return '#4169E1';
        }
        
        // Divine Animals/Beings (Green)
        if (signLower.includes('stag') || signLower.includes('wolf') || signLower.includes('serpent') || 
            signLower.includes('sisters') || signLower.includes('women') || signLower.includes('horse')) {
            return '#2E8B57';
        }
        
        // Sacred Objects/Vessels (Purple)
        if (signLower.includes('vessel') || signLower.includes('cup') || signLower.includes('jewel') || 
            signLower.includes('stone') || signLower.includes('grail')) {
            return '#9370DB';
        }
        
        // Flame/Fire Signs (Red)
        if (signLower.includes('fire') || signLower.includes('flame') || signLower.includes('burning')) {
            return '#FF4500';
        }
        
        // Divine Stars/Orbs (Gold) - default category
        return '#FFD700';
    }

    // Add a legend to the map
    function addLegend() {
        const legend = L.control({position: 'bottomright'});
        
        legend.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'info legend');
            div.style.backgroundColor = 'white';
            div.style.padding = '10px';
            div.style.borderRadius = '5px';
            div.style.border = '2px solid rgba(0,0,0,0.2)';
            
            const categories = [
                ['Radiant Bridges/Paths', '#4169E1'],
                ['Divine Animals/Beings', '#2E8B57'],
                ['Sacred Objects/Vessels', '#9370DB'],
                ['Divine Stars/Orbs', '#FFD700'],
                ['Flame/Fire Signs', '#FF4500']
            ];
            
            div.innerHTML += '<h4 style="margin-top:0">Celestial Sign Types</h4>';
            
            for (let [category, color] of categories) {
                div.innerHTML +=
                    '<i style="background: ' + color + '; width: 18px; height: 18px; float: left; margin-right: 8px; border-radius: 50%;"></i> ' +
                    category + '<br style="clear:both">';
            }
            
            return div;
        };
        
        legend.addTo(map);
    }

    // Fetch the GeoJSON data with error handling and retry
    function fetchGeoJSON(retries = 3) {
        // Try multiple possible paths for the GeoJSON file
        const possiblePaths = [
            './myth_locations.geojson',
            '../maps/myth_locations.geojson',
            '/maps/myth_locations.geojson',
            '/CelestialMyths/maps/myth_locations.geojson'
        ];

        function tryNextPath(pathIndex) {
            if (pathIndex >= possiblePaths.length) {
                console.error('Failed to load GeoJSON from all possible paths');
                return;
            }

            fetch(possiblePaths[pathIndex])
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    try {
                        const data = JSON.parse(text);
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
                                    fillColor: getMarkerColor(feature.properties.celestialSign),
                                    color: "#000",
                                    weight: 1,
                                    opacity: 1,
                                    fillOpacity: 0.8
                                });
                            }
                        }).addTo(map);
                        
                        // Add the legend after the GeoJSON is loaded
                        addLegend();
                    } catch (e) {
                        console.error('JSON parsing error:', e);
                        console.error('Problem with JSON at path:', possiblePaths[pathIndex]);
                        console.error('Raw text received:', text.substring(0, 500) + '...');
                        if (retries > 0) {
                            setTimeout(() => tryNextPath(pathIndex + 1), 1000);
                        }
                    }
                })
                .catch(error => {
                    console.error('Error loading GeoJSON data:', error);
                    console.error('Failed path:', possiblePaths[pathIndex]);
                    if (retries > 0) {
                        setTimeout(() => tryNextPath(pathIndex + 1), 1000);
                    }
                });
        }

        tryNextPath(0);
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