var map;
var coordinates = [];

function mapBounds () {
  var bounds = new google.maps.LatLngBounds();
  console.log(coordinates.length);
  for (var i=0; i < coordinates.length; i++) {
    bounds.extend(coordinates[i]);
  }
  map.fitBounds(bounds);

  var zoom = map.getZoom();
  map.setZoom(zoom > 19 ? 19 : zoom);
}

function scbaMarker (lat, lng) {
   console.log("scbaMarker: " + lat + ", " + lng);
   var latlng = new google.maps.LatLng({lat: lat, lng: lng});
   var marker = new google.maps.Marker({
     position: latlng,
     map: map,
     icon: {
       path: google.maps.SymbolPath.CIRCLE,
       scale: 8.5,
       fillColor: "#F00",
       fillOpacity: 0.4,
       strokeWeight: 2.0
     }
   });
   coordinates.push(latlng);
   mapBounds ();
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
   zoom: 19,
   center: new google.maps.LatLng(35.820471, 127.108721)
  });

/*
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
    },
    markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 1,
      strokeWeight: 5,
      clickable: false,
      editable: true,
      zIndex: 1
    }
  });
  drawingManager.setMap(map);
*/
}

