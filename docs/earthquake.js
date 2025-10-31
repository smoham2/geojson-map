mapboxgl.accessToken = 'pk.eyJ1Ijoic21vaG5qMjIiLCJhIjoiY21oZWZoaXJzMGRldDJxb3J0aHAxNnR4ciJ9.IA4TUQ5IFDJgFkifqfpdcw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-v9',
  center: [138, 38],
  zoom: 5.5
});
map.addControl(new mapboxgl.NavigationControl(), 'top-left');

const japan = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": { "type": "Polygon", "coordinates": [[[129,31],[146,31],[146,46],[129,46],[129,31]]] },
    "properties": { "name": "Japan" }
  }]
};

const earthquakes = {
  "type": "FeatureCollection",
  "features": [
    { "type":"Feature","geometry":{"type":"Point","coordinates":[140,35]},
      "properties":{"id":1,"mag":5.2,"time":"2024-02-03"} },
    { "type":"Feature","geometry":{"type":"Point","coordinates":[137,36]},
      "properties":{"id":2,"mag":6.1,"time":"2024-03-15"} }
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

  map.addSource('eq', { type: 'geojson', data: earthquakes });
  map.addLayer({
    id: 'eq-points',
    type: 'circle',
    source: 'eq',
    paint: {
      'circle-radius': 6,
      'circle-color': '#ff4c4c',
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });
});

const table = document.getElementById('eqTable');
function renderRows(list) {
  while (table.rows.length > 1) table.deleteRow(1);
  list.forEach(f => {
    const r = table.insertRow();
    r.insertCell(0).textContent = f.properties.id ?? '(none)';
    r.insertCell(1).textContent = f.properties.mag;
    r.insertCell(2).textContent = f.properties.time;
  });
}
renderRows(earthquakes.features);

document.getElementById('sortBtn').addEventListener('click', () => {
  const sorted = [...earthquakes.features].sort((a, b) => b.properties.mag - a.properties.mag);
  renderRows(sorted);
});
