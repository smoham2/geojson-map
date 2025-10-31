mapboxgl.accessToken = 'pk.eyJ1Ijoic21vaG5qMjIiLCJhIjoiY21oZWZoaXJzMGRldDJxb3J0aHAxNnR4ciJ9.IA4TUQ5IFDJgFkifqfpdcw';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11', 
  center: [138, 38],
  zoom: 4.5
});

var japan = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[129, 31], [146, 31], [146, 46], [129, 46], [129, 31]]]
      },
      "properties": { "name": "Japan" }
    }
  ]
};

var earthquakes = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [140, 35] },
      "properties": { "id": 1, "mag": 5.2, "time": "2024-02-03" }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [137, 36] },
      "properties": { "id": 2, "mag": 6.1, "time": "2024-03-15" }
    }
  ]
};

map.on('load', function() {

  map.addSource('japan', { type: 'geojson', data: japan });
  map.addLayer({
    id: 'japan-layer',
    type: 'fill',
    source: 'japan',
    paint: {
      'fill-color': '#66ccff',
      'fill-opacity': 0.4
    }
  });

  map.addSource('earthquakes', { type: 'geojson', data: earthquakes });
  map.addLayer({
    id: 'earthquake-layer',
    type: 'circle',
    source: 'earthquakes',
    paint: {
      'circle-radius': 8,
      'circle-color': '#ff5555',
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });
});

var table = document.querySelector('table');
for (var i = 0; i < earthquakes.features.length; i++) {
  var row = table.insertRow();
  var id = row.insertCell(0);
  var mag = row.insertCell(1);
  var time = row.insertCell(2);

  id.textContent = earthquakes.features[i].properties.id;
  mag.textContent = earthquakes.features[i].properties.mag;
  time.textContent = earthquakes.features[i].properties.time;
}

var button = document.querySelector('button');
button.addEventListener('click', function() {
  var rows = Array.from(table.rows).slice(1);
  rows.sort(function(a, b) {
    return b.cells[1].textContent - a.cells[1].textContent;
  });
  rows.forEach(function(r) {
    table.appendChild(r);
  });
});
