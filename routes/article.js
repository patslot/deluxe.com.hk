var gQuery = require('../middleware/graphqlQuery.js');

var renderArticle = function(req, res) {
  // Can use sample json for testing, e.g:
  //   var article = require('./sampleData/articleFull.json');
  gQuery.articleQuery(req.params.articleID).then(function(result) {
		var article = result.getArticleDetail || {};
    article.video = null;
    article.mediaGroup.forEach(function(media, idx) {
      if (media.type === "videos") {
        article.video = article.mediaGroup[idx];
      }
    });
    // TODO(wkchan): category ID to name mapping
    article.categoryName = 'Fashion_list';
    res.render('articleDetail', article); 
  });
};

module.exports = {
  renderArticle: renderArticle
};
