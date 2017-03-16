module.exports = function(gQuery, categMapping) {
  return {
    renderArticle: function(req, res) {
      gQuery.newsArticleQuery(req.params.articleID).then(function(result) {
        var article = result.getNewsArticleDetail || {};
        article.video = null;
        article.mediaGroup.forEach(function(media, idx) {
          if (media.type === "videos") {
            article.video = article.mediaGroup[idx];
          }
        });
        var categ = req.params.categ;
        article.ename = categMapping.nameToEname[categ];
        article.adTag = categMapping.nameToAdTag[categ].detail;
        res.render('articleDetail', article);
      }, function(err) {
        console.error(err);
        res.sendStatus(500, err);
      });
    }
  };
};
