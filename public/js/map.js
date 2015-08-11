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

  // render map upon initial page load
  function createMap (pos) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;
    var myLatlng = new google.maps.LatLng(lat, lng);
    socket.emit('connected user', myLatlng, userId);
    createMarker(myLatlng, userId);
  }

  function createMarker (markloc, uuid) {
    marker = new google.maps.Marker({
      id: uuid,
      position: markloc,
      map: map
    });
    markers[uuid] = marker;
  }

  // get locations of currently connected users
  socket.emit('get locations', createConnectedMarkers);
  socket.on('new message', function (data, id) {
    addMessage(data, id);
  })

  socket.on('connected user', function (data, id) {
    var lat = data.G;
    var long = data.K;
    var loc = new google.maps.LatLng(lat, long);
    createMarker(loc, id);
  })

  // loop through collection of connected users data
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

  function addMessage (msg, id) {
    var uid = id || userId;
    var infowindow = new google.maps.InfoWindow({
      content: msg
    });
    infowindow.open(map, markers[uid]);
  }

  $('.search-field').keypress(function (e) {
    var message = $(this).val();
    if (e.which == 13) {
      socket.emit('new message', message, userId);
      addMessage(message);
      $(this).val('');
    }
  })
}

google.maps.event.addDomListener(window, 'load', initialize);
