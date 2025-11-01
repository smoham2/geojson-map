const map = new maplibregl.Map({
  container: 'map',
  center: [138, 38],
  zoom: 5.5,
  style: {
    "version": 8,
    "sources": {
      "satellite": {
        "type": "raster",
        "tiles": [
          "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg"
        ],
        "tileSize": 256
      }
    },
    "layers": [{
      "id": "satellite",
      "type": "raster",
      "source": "satellite"
    }]
  }
});

const japan = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[129, 31], [146, 31], [146, 46], [129, 46], [129, 31]]]
    },
    "properties": { "name": "Japan" }
  }]
};

const earthquakes = {
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [140, 35] },
      "properties": { "id": 1, "mag": 5.2, "time": "2024-02-03" }},
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [137, 36] },
      "properties": { "id": 2, "mag": 6.1, "time": "2024-03-15" }}
  ]
};

map.on('load', () => {
  map.addSource('japan', { type: 'geojson', data: japan });
  map.addLayer({
    id: 'japan-fill',
    type: 'fill',
    source: 'japan',
    paint: { 'fill-color': '#66b3ff', 'fill-opacity': 0.5 }
  });

  map.addSource('earthquakes', { type: 'geojson', data: earthquakes });
  map.addLayer({
    id: 'eq-points',
    type: 'circle',
    source: 'earthquakes',
    paint: {
      'circle-radius': 6,
      'circle-color': '#ff4c4c',
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });
});

const table = document.getElementById("eqTable");
function renderRows(list) {
  while (table.rows.length > 1) table.deleteRow(1);
  list.forEach(f => {
    const r = table.insertRow();
    r.insertCell(0).textContent = f.properties.id;
    r.insertCell(1).textContent = f.properties.mag;
    r.insertCell(2).textContent = f.properties.time;
  });
}
renderRows(earthquakes.features);

document.getElementById("sortBtn").addEventListener("click", () => {
  const sorted = [...earthquakes.features].sort((a, b) => b.properties.mag - a.properties.mag);
  renderRows(sorted);
});
