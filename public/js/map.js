function initialize () {
  var userId = Math.random().toString(15).substring(2, 14);
  var socket = io();
  var markers = {};
  var mapOptions = {
    zoom: 6,
    center: new google.maps.LatLng(36.174465, -86.767960)
  }
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  navigator.geolocation.getCurrentPosition(createMap);

  function createMap (pos) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;
    var myLatlng = new google.maps.LatLng(lat, lng);
    socket.emit('connected user', myLatlng, userId);
    createMarker(myLatlng, userId)
  }
  // get locations of already connected users
  socket.emit('get locations', createConnectedMarkers);

  function createMarker (markloc, uuid) {
    marker = new google.maps.Marker({
      id: uuid,
      position: markloc,
      map: map
    })
    markers[uuid] = marker;
  }

  // loops through collection of connected users data
  function createConnectedMarkers (data) {
    var connected = data;
    for(var i=0; i<connected.length; i++){
      var uid = connected[i].id;
      var lat = connected[i].latitude;
      var lng = connected[i].longitude;
      var loc = new google.maps.LatLng(lat, lng);
      createMarker(loc, uid);
    }
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
