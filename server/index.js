var express = require('express');
var bodyParser = require('body-parser');

var categMapping = require('./middleware/categoryMapping.js');
var app = express();

module.exports = function(options) {

  var gQuery = require('./middleware/graphqlQuery.js')(options.graphqlEndpoint);
  var home = require('./routes/home.js')(gQuery);
  var article = require('./routes/article.js')(gQuery, categMapping);

  app.locals.GRAPHQL_ENDPOINT = options.graphqlEndpoint;
  app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.set('view engine', 'ejs');

  app.get('/', home.render);
  app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
  });
  app.get('/:categ/:articleID/:title', article.renderArticle);
  app.get('/:categ', function(req, res) {
    var categ = req.params.categ;
    res.render('categ', {ename: categMapping.nameToEname[categ],
      adTag: categMapping.nameToAdTag[categ].list});
  });

  return app;
}
