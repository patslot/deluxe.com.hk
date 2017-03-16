var express = require('express');
var bodyParser = require('body-parser');

var categMapping = require('./middleware/categoryMapping.js');
var app = express();

module.exports = function(options) {

  var gQuery = require('./middleware/graphqlQuery.js')(options.graphqlEndpoint);
  var home = require('./routes/home.js')(gQuery);
  var article = require('./routes/article.js')(gQuery, categMapping);

  app.locals.GRAPHQL_ENDPOINT = options.graphqlEndpoint;
  app.locals.AD_PREFIX_TAG = options.adPrefixTag;
  app.locals.AD_WEB_BASE_TAG = options.adWebBaseTag;
  app.locals.AD_MOBILE_BASE_TAG = options.adMobileBaseTag;
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
    // TODO(wkchan): This code block also repeats in routes/article.js
    var ename = categMapping.nameToEname[categ];
    var adTagMapping = categMapping.nameToAdTag[categ];
    if (!ename || !adTagMapping) {
      res.status(500).send('Invalid article category: ' + categ);
      return;
    }
    res.render('categ', {ename: ename,
      adTag: adTagMapping.list,
      categ: categ});
  });

  return app;
}
