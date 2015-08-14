var express = require('express')
  , app     = express()
  , http    = require('http').Server(app)
  , io      = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', {});
});

var users = [];

io.on('connection', function (socket) {

  // upon initial connection adds location info/id to users array
  socket.on('connected user', function (data, id) {
    var latitude = data.G;
    var longitude = data.K;
    users.push({
      id: id,
      latitude: latitude,
      longitude: longitude
    })

    // send locations of currently connected users
    socket.broadcast.emit('connected user', latitude, longitude, id);
  })

  // send users location data to create markers
  socket.on('get locations', function (dataFunc) {
    dataFunc(users);
  })

  // emit new message to all users
  socket.on('new message', function (m, i) {
    socket.broadcast.emit('new message', m, i);
  })
});

http.listen(3000, function () {
  console.log('Listening at http://localhost:3000')
});
