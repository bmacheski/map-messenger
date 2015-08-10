var express = require('express')
  , app     = express()
  , http    = require('http').Server(app)
  , io      = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', {});
})

io.on('connection', function () {})

http.listen(3000, function () {
  console.log('Listening at http://localhost:3000')
});
