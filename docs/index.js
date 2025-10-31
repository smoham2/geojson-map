mapboxgl.accessToken = 'pk.eyJ1Ijoic21vaG5qMjIiLCJhIjoiY21oZWM1d2E3MGNxbTJzcHd3MnB0b3B3NCJ9.N59eWz63XAICm6Kxco36hg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11', 
  center: [138, 38],
  zoom: 4.5
});

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
    { "type":"Feature","geometry":{"type":"Point","coordinates":[140,35]},"properties":{"id":1,"mag":5.2} },
    { "type":"Feature","geometry":{"type":"Point","coordinates":[137,36]},"properties":{"id":2,"mag":6.1} }
  ]
};

map.on('load', () => {
  map.addSource('japan', { type: 'geojson', data: japan });
  map.addLayer({
    id: 'japan-fill', type: 'fill', source: 'japan',
    paint: { 'fill-color': '#9ad0ff', 'fill-opacity': 0.35 }
  });

  map.addSource('eq', { type: 'geojson', data: earthquakes });
  map.addLayer({
    id: 'eq-points', type: 'circle', source: 'eq',
    paint: { 'circle-radius': 7, 'circle-color': '#e84d4d', 'circle-stroke-width': 1, 'circle-stroke-color': '#fff' }
  });
});
