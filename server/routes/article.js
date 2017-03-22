var util = require('util');

module.exports = function(gQuery, categMapping, queryHandler) {
  function renderArticle(req, res, next) {
    var articleID = req.params.articleID;
    var article = {};
    article.id = articleID;
    article.categ = req.params.categ;
    article.ename = categMapping.nameToEname[article.categ];
    article.adTag = categMapping.nameToAdTag[article.categ].detail;
    article.type = categMapping.getArticleType(articleID);

    if (articleID && article.type === 'news') {
      gQuery.newsArticleQuery(articleID).then(function(result) {
        article = util._extend(article, result.getNewsArticleDetail);
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
        article.menu = queryHandler.parseMenu(result.listMenu);
        res.render('articleDetail', article);
      }, function(err) {
        return next(err);
      });
    } else if (article.type === 'cms') {
      gQuery.cmsArticleQuery(articleID).then(function (result) {
        article = util._extend(article, result.getCMSArticleDetail);
        article.video = article.videoFile;
        article.menu = queryHandler.parseMenu(result.listMenu);
        res.render('articleDetail', article);
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
    gQuery.categQuery(listCategAPI).then(function(result) {
      var articles = queryHandler.parseArticles(categ,
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
