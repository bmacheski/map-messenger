var express = require('express')
  , app     = express()
  , http    = require('http').Server(app)
  , io      = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', {});
})

var users = [
    {id: 1234, latitude: 33.7550, longitude: -84.3900},
    {id: 4567, latitude: 32.7833, longitude: -79.9333}
];

io.on('connection', function (socket) {
  // upon initial connection adds location info/id to users array
  socket.on('connected user', function (data, id) {
    users.push({
      id: id,
      latitude: data.G,
      longitude: data.K
    })
  })
  // sends users location data to create markers
  socket.on('get locations', function (dataFunc) {
    dataFunc(users)
  })
})

http.listen(3000, function () {
  console.log('Listening at http://localhost:3000')
});
