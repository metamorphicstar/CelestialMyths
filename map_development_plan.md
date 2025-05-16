# Interactive Map Development Plan for CelestialMyths Website

This document outlines the plan for creating interactive maps to visualize the geographical distribution of myths for the [CelestialMyths](https://metamorphicstar.github.io/CelestialMyths/) website.

## 1. Objective
To create an interactive map displaying the origins or significant locations of mythological accounts, allowing users to explore their geographical context and access brief information about each myth.

## 2. Chosen Technology
*   **Mapping Library:** Leaflet.js (Open-source JavaScript library)
    *   **Reasoning:** Lightweight, easy to learn, good documentation, no API key required for basic tiles (e.g., OpenStreetMap), cost-effective.
*   **Data Format:** GeoJSON
    *   **Reasoning:** Standard format for encoding geographic data, keeps data separate from map code, easily parsable by Leaflet.

## 3. Map Content and Features
*   **Locations:** Plot geographical origin or significant locations for each myth.
*   **Markers:** Visual markers for each location on the map.
*   **Pop-ups:** On-click pop-ups for each marker displaying:
    *   Culture & Myth Name
    *   Brief Celestial Sign Description
    *   Journey Type
    *   Catastrophic Context (if applicable)
    *   Heinsohn's Redating
    *   Potential Celestial Cause

## 4. Proposed Data Structure (Example `myth_locations.geojson`)
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude] // e.g., [0.1278, 51.5074] for London (Arthurian)
      },
      "properties": {
        "culture": "Arthurian (British Celts)",
        "mythName": "Holy Grail",
        "celestialSign": "Radiant, floating vessel/cup/dish/stone",
        "journeyType": "Spiritual quest",
        "catastrophe": "Wasteland (Fisher King); societal decline",
        "redating": "~AD 930",
        "potentialCause": "Aurora; comet; plasma phenomenon"
      }
    }
    // ... more features
  ]
}
```

## 5. Proposed File Structure in Repository
```
CelestialMyths/
├── _config.yml
├── index.md
├── myth_catalog.md
├── comparative_tables.md
├── map_development_plan.md  // This file
├── maps/
│   ├── interactive_map.html  // Main HTML page for the map
│   ├── myth_locations.geojson // GeoJSON data for map points
│   ├── map_script.js         // Core JavaScript for Leaflet map logic
│   └── map_style.css         // Optional CSS for custom map styling
└── ... (other files and folders)
```

## 6. Development Steps
1.  **Gather Coordinates and Data:**
    *   Compile a list of all myths to be mapped.
    *   Determine approximate geographical coordinates (latitude, longitude) for each.
    *   Collect the information for the pop-ups for each myth.
    *   Structure this data into the `myth_locations.geojson` file.
2.  **Create `maps/interactive_map.html`:**
    *   Basic HTML structure.
    *   Link to Leaflet CSS and JS (CDN or local).
    *   Include a `<div>` element to hold the map.
    *   Link to `map_script.js` and `map_style.css`.
3.  **Create `maps/map_script.js`:**
    *   Initialize Leaflet map (set center, zoom level).
    *   Add a base tile layer (e.g., OpenStreetMap).
    *   Fetch and parse data from `myth_locations.geojson`.
    *   Iterate through GeoJSON features to:
        *   Add markers to the map.
        *   Bind pop-ups to markers with information from properties.
4.  **Create `maps/map_style.css` (Optional):**
    *   Add custom styles for the map container, markers, or pop-ups if needed.
5.  **Integration and Linking:**
    *   Push new files to the GitHub repository.
    *   Ensure GitHub Pages is correctly configured to serve the `maps/interactive_map.html` page.
    *   Add links to the map page from `index.md` or other relevant pages on the website.

## 7. Next Steps (Action Items)
1.  **Data Compilation:** User to provide an initial list of myths to be mapped, along with their general locations (e.g., "Arthurian - Glastonbury, UK", "Hungarian Csodaszarvas - Carpathian Basin").
2.  **Coordinate Lookup & GeoJSON Creation:** Assistant (or user) to find approximate latitude/longitude for these locations and populate the `myth_locations.geojson` file.
3.  **HTML/JS/CSS Scaffolding:** Assistant to provide basic template code for `interactive_map.html`, `map_script.js`, and `map_style.css` once initial data is available.
4.  **Iterative Development:** Add more myths and features to the map incrementally.

This plan provides a clear path forward for developing the interactive map feature. 