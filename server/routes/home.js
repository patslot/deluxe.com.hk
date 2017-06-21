'use strict';

module.exports = function(gQuery, categMapping, queryHandler, edm) {
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
      m.catName = m.catName.toLowerCase();
    });
    return mpms;
  }

  return {
    render: function(req, res, next) {
      gQuery.homeQuery()
        .catch(function(err) {
          // use all available data
          if (typeof err.rawData !== "undefined") {
            console.error(JSON.stringify(err));
            return err.rawData;
          } else {
            throw err;
          }
        })
        .then(function(result) {
          var articles = (result.listHomeLatestArticle || []).slice(0, 4);
          res.render('homepage', {
            pageviewLog: categMapping.categPageviewLog('HOME'),
            mpms: parseMpms(result.listMPM),
            menu: queryHandler.parseMenu(result.listMenu),
            articles: queryHandler.parseHomeArticles(articles),
            campaigns: result.listCampaign || [],
            showEDM: edm.showEDM(req.cookies.addEDM, result.listCampaign),
            origin: req.protocol + "://" + req.get('host'),
            fullURL: req.protocol + "://" + req.get('host') + req.originalUrl
          });
        }, function(err) {
          return next(err);
        });
    }
  };
};
