var express = require('express');
var bodyParser = require('body-parser');

var app = express();

module.exports = function() {
  app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.set('view engine', 'ejs');

  app.get('/:category', function(req, res) {
    res.render('category', req.params);
  });
  app.post('/category', function(req, res) {
    var category = req.body.category;
    res.json({category: category, articles: [category + '1', category + '2']});
  });

  return app;
}