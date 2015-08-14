function initialize () {
  var userId = Math.random().toString(15).substring(2, 16);
  var socket = io();
  var markers = {};
  var userwindow;
  var otherwindow;
  var mapOptions = { zoom: 6, center: calCoords(36.174465, -86.767960) };
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  navigator.geolocation.getCurrentPosition(createMap);

  function calCoords (lat, long) {
    return new google.maps.LatLng(lat, long);
  }

  function createInfoWindow (msg) {
    return new google.maps.InfoWindow( { content: msg } );
  }

  // render map upon initial page load
  function createMap (pos) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;
    var myLatlng = calCoords(lat, lng);
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

  // loop through collection of connected users data
  function createConnectedMarkers (data) {
    var connected = data;
    for (var i = 0; i < connected.length; i++) {
      var uid = connected[i].id;
      var lat = connected[i].latitude;
      var lng = connected[i].longitude;
      var loc = calCoords(lat, lng);
      createMarker(loc, uid);
    }
  }

  // create message window for current client
  function addUserMessage (msg, id) {
    if (userwindow) {
      userwindow.close(map, markers[id])
    }
    userwindow = createInfoWindow(msg);
    userwindow.open(map, markers[id]);
  }

  // creates message window for other chat users
  function addOtherMessage (msg, uid) {
    if (otherwindow) {
      otherwindow.close(map, markers[uid])
    }
    otherwindow = createInfoWindow(msg);
    otherwindow.open(map, markers[uid]);
  }

  // get locations of currently connected users
  socket.emit('get locations', createConnectedMarkers);
  socket.on('new message', function (data, id) {
    addOtherMessage(data, id);
  })

  socket.on('connected user', function (lat, long, id) {
    var loc = calCoords(lat, long);
    createMarker(loc, id);
  })

  $('.search-field').keypress(function (e) {
    var message = $(this).val();
    if (e.which == 13) {
      socket.emit('new message', message, userId);
      addUserMessage(message, userId);
      $(this).val('');
    }
  })
}

google.maps.event.addDomListener(window, 'load', initialize);
