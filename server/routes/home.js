var categMapping = require('../middleware/categoryMapping.js');

module.exports = function(gQuery) {
  var queryHandler = require('../middleware/queryHandler.js')();

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
    render: function(req, res) {
      gQuery.homeQuery().then(function(result) {
        var articles = (result.listHomeLatestArticle || []).slice(0, 4);
        res.render('homepage', {mpms: parseMpms(result.listMPM),
          articles: queryHandler.parseHomeArticles(articles)});
      }, function(err) {
        console.error(err);
        res.sendStatus(500, err);
      });
    }
  };
};
