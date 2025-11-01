const map = new maplibregl.Map({
  container: 'map',
  center: [138, 38],
  zoom: 5.5,
  style: {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors'
      }
    },
    layers: [
      { id: 'osm', type: 'raster', source: 'osm' }
    ]
  }
});
map.addControl(new maplibregl.NavigationControl(), 'top-left');

async function init() {
  const [eqRes, jpRes] = await Promise.all([
    fetch('assets/earthquakes.geojson'),
    fetch('assets/japan.json')
  ]);
  const eq = await eqRes.json();
  const jp = await jpRes.json();

  map.on('load', () => {
    map.addSource('japan', { type: 'geojson', data: jp });
    map.addLayer({
      id: 'japan-fill',
      type: 'fill',
      source: 'japan',
      paint: { 'fill-color': '#b48ede', 'fill-opacity': 0.30 }
    });
    map.addLayer({
      id: 'japan-outline',
      type: 'line',
      source: 'japan',
      paint: { 'line-color': '#7a57c6', 'line-width': 1 }
    });

    map.addSource('eq', { type: 'geojson', data: eq });
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
      r.insertCell(2).textContent = new Date(f.properties.time).toLocaleDateString('en-US');
    });
  }
  renderRows(eq.features);

  document.getElementById('sortBtn').addEventListener('click', () => {
    const sorted = [...eq.features].sort((a, b) => b.properties.mag - a.properties.mag);
    renderRows(sorted);
  });
}

init();
