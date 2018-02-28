'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var categMapping = require('./middleware/categoryMapping.js');
var edm = require('./middleware/edm.js');

module.exports = function(options) {
  var gQuery = require('./middleware/graphqlQuery.js')(options.graphqlEndpoint);
  var queryHandler = require('./middleware/queryHandler.js')();
  var articleUtil = require('./middleware/articleUtil.js')();
  var home = require('./routes/home.js')(gQuery, categMapping, queryHandler, edm, articleUtil);
  var article = require('./routes/article.js')(gQuery, categMapping, queryHandler, edm, articleUtil);
  var contributor = require('./routes/contributor.js')(gQuery, categMapping, queryHandler, edm);
  var events = require('./routes/events.js')(gQuery, categMapping, queryHandler, edm)
  var api = require("./routes/api.js")(options.edmSubscriptionEndpoint);
  var search = require("./routes/search.js")(gQuery, categMapping, queryHandler, edm);
    
  var app = express();
  app.locals.MAX_CATEG_ARTICLES = options.MAX_CATEG_ARTICLES;
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
  app.locals.SHOW_EDITOR_PICK_LINK = options.showEditorPickLink;
  app.locals.escapeHtml = function(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  };

  app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.set('view engine', 'ejs');

  app.use("/api", api);

//  app.get('/', home.render);
    app.get('/', function(req, res) {
        gQuery.getLatestArticle()
        .catch(function(err) {
          // use all available data
          if (typeof err.rawData !== "undefined") {
            console.error(JSON.stringify(err));
            return err.rawData;
          } else {
            throw err;
          }
        })
        .then(function(result){
            var latestCategory = result.getLatestArticle[0].cmsArticleDetail.categoryName ;
            if (latestCategory =="Fashion")  {
                res.redirect('/Fashion');
            }
            if (latestCategory =="Beauty")  {
                res.redirect('/Beauty');
            }
            if (latestCategory =="Luxe")  {
                res.redirect('/Luxe');
            }
            if (latestCategory =="Lifestyle")  {
                res.redirect('/Lifestyle');
            }
        }, function(err) {
                      return next(err);
        });
              
    });
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
  app.get('/:categ/:articleID', article.renderArticle);
  app.get('/:categ', article.renderArticles);
  app.get('/sub/:categ/:subCateg', article.renderSubcatArticles);
  app.get('/sub/:categ/:subCateg/:articleID/:title', article.renderSubcatArticles);
  app.get('/Search', search.renderSearch);

  app.use(function(err, req, res, next) {
    console.error(JSON.stringify(err));
    if (req.accepts(["text/html", "application/json"]) === "application/json") {
      return res.status(500).json({status: 500, message: err});
    }
    return res.status(500).render("500", {
      menu: {main: [], sub: []},
      campaigns: [],
      showEDM: false,
      origin: req.protocol + '://' + req.get('host'),
      fullURL: req.protocol + '://' + req.get('host') + req.originalUrl
    });
  });

  app.use(function(req, res) {
    if (req.accepts(["text/html", "application/json"]) === "application/json") {
      return res.status(404).json({status: 404, message: "not found"});
    }
    return res.status(404).render("404", {
      menu: {main: [], sub: []},
      campaigns: [],
      showEDM: false,
      origin: req.protocol + '://' + req.get('host'),
      fullURL: req.protocol + '://' + req.get('host') + req.originalUrl
    });
  });

  return app;
}
