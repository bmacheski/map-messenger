var express = require('express')
  , app     = express()
  , less    = require('less-middleware');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(less('public'));

app.get('/', function(req, res) {
  res.render('index', {});
})

var server = app.listen(3000, function() {
  console.log('Listening at http://localhost:3000')
});
