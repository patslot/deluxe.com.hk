'use strict';

var moment = require('moment');
var MobileDetect = require('mobile-detect');
module.exports = function(gQuery, categMapping, queryHandler, edm) {
  var articleCount = 4;
  var contributorBlockCount = 6;
  var categContr = 'Contributor';
  var columnist = 'COLUMNIST';
  var metaKeyword = categMapping.categoryKeywordMapping['Contributor'] ;
  function renderArticles(req, res, next) {
    var name = req.params.contrName;
    gQuery.contributorArticlesQuery(name, 0, articleCount + 1)
      .catch(function(err) {
        // use all available data
        if (typeof err.rawData !== "undefined") {
          console.error(JSON.stringify(err));
          return err.rawData;
        } else {
          throw err;
        }
      })
      .then(function(r) {
        var contributors = (r.listContributor || []).filter(function(c) {
          return c.catName === name;
        });
        if (contributors.length === 0) {
          return next();
        }
        var allArticles = r.listContributorArticle || [];
        var articles = allArticles.slice(0, articleCount);
        articles.forEach(function(a) {
          queryHandler.parseCmsArticle(categContr, a);
        });
        var md = new MobileDetect(req.headers['user-agent']);
        if (md.mobile()) {
          var platform = 'MOBWEB' ;
        } else {
          var platform = 'WEB' ;
        };
        var cdvalues = {
          'c1': 'test',
          'c21': 'INDEX',
          'c16': 'Contributor',
          'c17': queryHandler.parseContributor(contributors[0]).catName,
          'c18': '',
          'c29': platform
        }
        res.render('contributorArticles', {
          pageviewLog: categMapping.categPageviewLog(columnist, 'INDEX', name),
          contributor: queryHandler.parseContributor(contributors[0]),
          metaKeyword: metaKeyword,
          menu: queryHandler.parseMenu(r.listMenu, categContr),
          articles: articles,
          cdValue: cdvalues,
          year: moment().year(),
          noMoreArticles: allArticles.length <= articleCount,
          campaigns: r.listCampaign || [],
          showEDM: edm.showEDM(req.cookies.addEDM, r.listCampaign),
          origin: "https://" + req.get('host'),
          fullURL: "https://" + req.get('host') + req.originalUrl
        });
      }, function(err) {
        return next(err);
      });
  }

  function renderIndex(req, res, next) {
    var adTagMapping = categMapping.nameToAdTag[categContr];
    var metaKeyword = categMapping.categoryKeywordMapping['Contributor'] ;
    gQuery.contributorIndexQuery()
      .catch(function(err) {
        // use all available data
        if (typeof err.rawData !== "undefined") {
          console.error(JSON.stringify(err));
          return err.rawData;
        } else {
          throw err;
        }
      })
      .then(function(r) {
        var md = new MobileDetect(req.headers['user-agent']);
        if (md.mobile()) {
          var platform = 'MOBWEB' ;
        } else {
          var platform = 'WEB' ;
        };
        var cdvalues = {
          'c1': '',
          'c21': 'INDEX',
          'c16': 'Contributor',
          'c17': '',
          'c18': '',
          'c29': platform
        }
        res.render('contributorIndex', {
          pageviewLog: categMapping.categPageviewLog(columnist),
          metaKeyword: metaKeyword,
          contributors: queryHandler.parseContributors(
            (r.listContributor || []).slice(0, contributorBlockCount)),
          menu: queryHandler.parseMenu(r.listMenu, categContr),
          adTag: adTagMapping.list,
          cdValue: cdvalues,
          year: moment().year(),
          campaigns: r.listCampaign || [],
          showEDM: edm.showEDM(req.cookies.addEDM, r.listCampaign),
          origin: "https://" + req.get('host'),
          fullURL: "https://" + req.get('host') + req.originalUrl
        });
      }, function(err) {
        return next(err);
      });
  }

  return {
    renderArticles: renderArticles,
    renderIndex: renderIndex
  }
};
