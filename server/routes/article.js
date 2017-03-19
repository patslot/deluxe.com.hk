var util = require('util');

module.exports = function(gQuery, categMapping) {
  return {
    renderArticle: function(req, res) {
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
          res.render('articleDetail', article);
        }, function(err) {
          console.error(err);
          res.sendStatus(500, err);
        });
      } else if (article.type === 'cms') {
        gQuery.cmsArticleQuery(articleID).then(function (result) {
          article = util._extend(article, result.getCMSArticleDetail);
          article.video = article.videoFile;
          res.render('articleDetail', article);
        }, function (err) {
          console.error(err);
          res.sendStatus(500, err);
        });
      } else {
        res.sendStatus(500, 'Invalid article id: ' + articleID);
      }
    }
  };
};
