'use strict';

var util = require('util');
var moment = require('moment');

module.exports = function(gQuery, categMapping, queryHandler, edm) {
  var maxUpcomingEvent = 10;
  var cmsNewsType = 'OTHER';
  var columnist = 'COLUMNIST';

  function parsePubDate(pubDate) {
    return moment(pubDate, moment.ISO_8601).utcOffset(8).format('MMM DD, YYYY h:mm A');
  }

  function renderArticle(req, res, next) {
    var articleID = req.params.articleID;
    var article = {};
    article.id = articleID;
    article.type = categMapping.getArticleType(articleID);
    article.ogDescription = null;
    article.origin = req.protocol + "://" + req.get('host');
    article.fullURL = req.protocol + "://" + req.get('host') + "/article/" + articleID;

    if (articleID && article.type === 'news') {
      gQuery.newsArticleQuery(articleID)
        .catch(function(err) {
          // use all available data if article detail is not null
          if (typeof err.rawData !== "undefined" && err.rawData.getNewsArticleDetail !== null) {
            console.error(JSON.stringify(err));
            return err.rawData;
          } else {
            throw err;
          }
        })
        .then(function(result) {
          article = util._extend(article, result.getNewsArticleDetail);
          article.ename = categMapping.nameToEname[article.categoryName];
          article.adTag = categMapping.nameToAdTag[article.categoryName].detail;
          article.contributorName = '';
          article.image = (article.mediaGroup && article.mediaGroup.length > 0) ? article.mediaGroup[0].largePath : "";
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
            article.videoImage = videos[0].largePath;
          }
          article.pubDate = parsePubDate(article.pubDate);
          article.menu = queryHandler.parseMenu(result.listMenu);
          queryHandler.handleArticleDetailCateg(article);
          article.campaigns = result.listCampaign || [];
          article.showEDM = edm.showEDM(req.cookies.addEDM, result.listCampaign);
          article.pageviewLog = categMapping.articlePageviewLog(article.categoryName,
            (article.logging || {}).pixelNews, article.id, article.issueId, article.title, '');
          if (article.contentBlocks && article.contentBlocks.length > 0) {
            article.ogDescription = article.contentBlocks[0].content;
          }
          res.render('articleDetail', article);
        }, function(err) {
          return next(err);
        });
    } else if (article.type === 'cms') {
      gQuery.cmsArticleQuery(articleID)
        .catch(function(err) {
          // use all available data if article detail is not null
          if (typeof err.rawData !== "undefined" && err.rawData.getCMSArticleDetail !== null) {
            console.error(JSON.stringify(err));
            return err.rawData;
          } else {
            throw err;
          }
        })
        .then(function (result) {
          article = util._extend(article, result.getCMSArticleDetail);
          article.contributorName = article.contributorName ?
            article.contributorName.replace(/\,/,'') : '';
          article.ename = categMapping.nameToEname[article.categoryName];
          article.adTag = categMapping.nameToAdTag[article.categoryName].detail;
          article.image = article.videoThumbnail || (article.artBlock && article.artBlock.length > 0) ? article.artBlock[0].imgFile : "";
          article.video = {
            url: article.videoFile,
            title: article.title,
            videoId: article.id
          };
          article.videoImage = article.image;
          article.publish = parsePubDate(article.publish);
          article.menu = queryHandler.parseMenu(result.listMenu);
          queryHandler.handleArticleDetailCateg(article);
          article.campaigns = result.listCampaign || [];
          article.showEDM = edm.showEDM(req.cookies.addEDM, result.listCampaign);
          var categoryName = article.categoryName === 'Contributor' ? columnist : article.categoryName
          article.pageviewLog = categMapping.articlePageviewLog(categoryName,
            cmsNewsType, article.id, article.issueId, article.title, article.contributorName);
          if (article.artBlock && article.artBlock.length > 0) {
            article.ogDescription = article.artBlock[0].content;
          }
          if (article.categoryName === 'Event') {
            gQuery.upcomingEventQuery()
              .catch(function(err) {
                // use all available data
                if (typeof err.rawData !== "undefined") {
                  console.error(JSON.stringify(err));
                  return err.rawData;
                } else {
                  throw err;
                }
              })
              .then(function (result) {
                var upcomingEvents = (result.listUpcomingEvent || []).slice(0, maxUpcomingEvent);
                article.upcomingEvents = queryHandler.parseUpcomingEvents(upcomingEvents);
                res.render('articleDetail', article);
              }, function(err) {
                return next(err);
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
    var offset = 0;
    var count = 5;
    if (categ === 'Editor picks') {
      query = gQuery.queryEditorPicks(offset, count);
      handleFunc = queryHandler.parseCmsArticles;
    } else {
      query = gQuery.categQuery(listCategAPI, offset, count);
      handleFunc = queryHandler.parseArticles;
    }
    query.catch(function(err) {
      // use all available data
      if (typeof err.rawData !== "undefined") {
        console.error(JSON.stringify(err));
        return err.rawData;
      } else {
        throw err;
      }
    })
    .then(function(result) {
      var articles = handleFunc(categ, (result[listCategAPI] || []));
      var categs = result.listMenu || [];
      var currentCateg = getCurrentCateg(categs, categ);
      res.render('categ', {
        pageviewLog: categMapping.categPageviewLog(categ),
        menu: queryHandler.parseMenu(categs, categ),
        categImg: currentCateg ? currentCateg.img : '',
        article1: articles.length > 0 ? articles[0] : null,
        articles2to5: articles.length > 1 ? articles.slice(1) : [],
        ename: ename,
        adTag: adTagMapping.list,
        categ: categ,
        campaigns: result.listCampaign || [],
        showEDM: edm.showEDM(req.cookies.addEDM, result.listCampaign),
        origin: req.protocol + "://" + req.get('host'),
        fullURL: req.protocol + "://" + req.get('host') + req.originalUrl
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
