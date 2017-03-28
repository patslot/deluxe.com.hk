var util = require('util');
var moment = require('moment');

module.exports = function(gQuery, categMapping, queryHandler) {
  var maxUpcomingEvent = 10;

  function parsePubDate(pubDate) {
    return moment(pubDate, moment.ISO_8601).utcOffset(8).format('MMM DD, YYYY h:mm A');
  }

  function renderArticle(req, res, next) {
    var articleID = req.params.articleID;
    var article = {};
    article.id = articleID;
    article.type = categMapping.getArticleType(articleID);

    if (articleID && article.type === 'news') {
      gQuery.newsArticleQuery(articleID).then(function(result) {
        article = util._extend(article, result.getNewsArticleDetail);
        article.ename = categMapping.nameToEname[article.categoryName];
        article.adTag = categMapping.nameToAdTag[article.categoryName].detail;
        article.contributorName = '';
        article.video = null;
        var videos = article.mediaGroup.filter(function (item) {
          return item.type === 'videos';
        });
        var numReg = /\d+/;
        if (videos && videos.length > 0) {
          videos.sort(function (v1, v2) {
            return v1.quality.match(numReg) < v2.quality.match(numReg);
          });
          article.video = videos[0];
        }
        article.pubDate = parsePubDate(article.pubDate);
        article.menu = queryHandler.parseMenu(result.listMenu);
        res.render('articleDetail', article);
      }, function(err) {
        return next(err);
      });
    } else if (article.type === 'cms') {
      gQuery.cmsArticleQuery(articleID).then(function (result) {
        article = util._extend(article, result.getCMSArticleDetail);
        article.contributorName = article.contributorName ?
          article.contributorName.replace(/\,/,'') : '';
        article.ename = categMapping.nameToEname[article.categoryName];
        article.adTag = categMapping.nameToAdTag[article.categoryName].detail;
        article.video = article.videoFile;
        article.publish = parsePubDate(article.publish);
        article.menu = queryHandler.parseMenu(result.listMenu);
        if (article.categoryName === 'Event') {
          gQuery.upcomingEventQuery().then(function (result) {
            var upcomingEvents = (result.listUpcomingEvent || []).slice(0, maxUpcomingEvent);
            article.upcomingEvents = queryHandler.parseUpcomingEvents(upcomingEvents);
            res.render('articleDetail', article);
          });
        } else {
          res.render('articleDetail', article);
        }
      }, function (err) {
        return next(err);
      });
    } else {
      return next();
    }
  }

  function getCurrentCateg(categs, categName) {
    for (var i = 0; i < categs.length; i++) {
      if (categs[i].name === categName) {
        return categs[i];
      }
    }
    return null;
  }

  function renderArticles(req, res, next) {
    var categ = req.params.categ;
    // TODO(wkchan): This code block also repeats in routes/article.js
    var ename = categMapping.nameToEname[categ];
    var adTagMapping = categMapping.nameToAdTag[categ];
    var listCategAPI = categMapping.enameToListCategAPI[ename || ''];
    if (!ename || !adTagMapping || !listCategAPI) {
      return next();
    }
    var query, handleFunc;
    if (categ === 'Editor picks') {
      query = gQuery.queryEditorPicks();
      handleFunc = queryHandler.parseCmsArticles;
    } else {
      query = gQuery.categQuery(listCategAPI);
      handleFunc = queryHandler.parseArticles;
    }
    query.then(function(result) {
      var articles = handleFunc(categ,
        (result[listCategAPI] || []).slice(0, 5));
      var categs = result.listMenu || [];
      var currentCateg = getCurrentCateg(categs, categ);
      res.render('categ', {
        menu: queryHandler.parseMenu(categs),
        categImg: currentCateg ? currentCateg.img : '',
        article1: articles.length > 0 ? articles[0] : null,
        articles2to5: articles.length > 1 ? articles.slice(1) : [],
        ename: ename,
        adTag: adTagMapping.list,
        categ: categ
      });
    }, function(err) {
      return next(err);
    });
  }

  return {
    renderArticle: renderArticle,
    renderArticles: renderArticles
  };
};
