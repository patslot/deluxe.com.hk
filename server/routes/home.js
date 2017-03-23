var categMapping = require('../middleware/categoryMapping.js');

module.exports = function(gQuery, queryHandler) {
  function parseMpms(origMpms) {
    var mpms = origMpms || [];
    mpms.forEach(function(m) {
      var linkType = categMapping.getArticleType(m.linkURL);
      if (linkType) {
        m.linkURL = '/' + m.catName + '/' + m.linkURL + '/' + m.content;
        m.linkTarget = '_self';
      } else {
        m.linkTarget = '_blank';
      }
    });
    return mpms;
  }

  return {
    render: function(req, res, next) {
      gQuery.homeQuery().then(function(result) {
        var articles = (result.listHomeLatestArticle || []).slice(0, 4);
        res.render('homepage', {
          mpms: parseMpms(result.listMPM),
          menu: queryHandler.parseMenu(result.listMenu),
          articles: queryHandler.parseHomeArticles(articles)
        });
      }, function(err) {
        return next(err);
      });
    }
  };
};
