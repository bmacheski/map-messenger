function initialize () {
  var socket = io();
  var mapOptions = {
    zoom: 6,
    center: new google.maps.LatLng(36.174465, -86.767960)
  }
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  navigator.geolocation.getCurrentPosition(createMap);

  function createMap (pos) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;
    var myLatLlng = new google.maps.LatLng(lat, lng);
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
