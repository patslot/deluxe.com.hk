var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var minifyHTML = require('express-minify-html');

var categMapping = require('./middleware/categoryMapping.js');
var edm = require('./middleware/edm.js');

module.exports = function(options) {
  var gQuery = require('./middleware/graphqlQuery.js')(options.graphqlEndpoint);
  var queryHandler = require('./middleware/queryHandler.js')();
  var home = require('./routes/home.js')(gQuery, categMapping, queryHandler, edm);
  var article = require('./routes/article.js')(gQuery, categMapping, queryHandler, edm);
  var contributor = require('./routes/contributor.js')(gQuery, categMapping, queryHandler, edm);
  var events = require('./routes/events.js')(gQuery, categMapping, queryHandler, edm)
  var api = require("./routes/api.js")(options.edmSubscriptionEndpoint);

  var app = express();
  app.locals.GRAPHQL_ENDPOINT = options.graphqlEndpoint;
  app.locals.AD_PREFIX_TAG = options.adPrefixTag;
  app.locals.AD_WEB_BASE_TAG = options.adWebBaseTag;
  app.locals.AD_MOBILE_BASE_TAG = options.adMobileBaseTag;
  app.locals.GA_CODE = options.GA_CODE;
  app.locals.LOGGING_GEO_API = options.LOGGING_GEO_API;
  app.locals.LOGGING_CRM_API = options.LOGGING_CRM_API;
  app.locals.LOGGING_PAGEVIEW_API = options.LOGGING_PAGEVIEW_API;
  app.locals.LOGGING_PARSELY_SITE_DOMAIN = options.LOGGING_PARSELY_SITE_DOMAIN;
  app.locals.SITE_NAME = options.SITE_NAME;

  app.use(minifyHTML({
    override:      true,
    exception_url: false,
    htmlMinifier: {
      removeComments:            true,
      collapseWhitespace:        true,
      minifyJS:                  true
    }
  }));
  app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.set('view engine', 'ejs');

  app.use("/api", api);

  app.get('/', home.render);
  // TODO: Add favicon.ico?
  app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
  });

  if (options.isTesting === "true") {
    var testHelper = require('./middleware/testHelper.js')();
    app.get('/campaign/:categID/:image', testHelper.sendCampImage);
    app.get('/campaign/compone/:categID/:image', testHelper.sendComponeImage);
  }

  app.get('/Contributor', contributor.renderIndex);
  app.get('/Contributor/:contrName', contributor.renderArticles);
  app.get('/Event', events.renderEvents);
  app.get('/:categ/:articleID/:title', article.renderArticle);
  app.get('/:categ', article.renderArticles);
  app.get('/article/:articleID', article.renderArticle);

  app.use(function(err, req, res, next) {
    console.error(err);
    if (req.accepts(["text/html", "application/json"]) === "application/json") {
      return res.status(500).json({status: 500, message: err});
    }
    return res.status(500).render("500", {
      menu: {main: [], sub: []},
      campaigns: [],
      showEDM: false
    });
  });

  app.use(function(req, res) {
    if (req.accepts(["text/html", "application/json"]) === "application/json") {
      return res.status(404).json({status: 404, message: "not found"});
    }
    return res.status(404).render("404", {
      menu: {main: [], sub: []},
      campaigns: [],
      showEDM: false
    });
  });

  return app;
}
