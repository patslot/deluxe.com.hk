'use strict';

module.exports = function(gQuery, categMapping, queryHandler, edm, articleUtil) {
   function parseMpms(origMpms) {
    var mpms = origMpms || [];
    mpms.forEach(function(m) {
      var linkType = articleUtil.getArticleType(m.linkURL);
      if (linkType) {
        m.linkURL = '/' + m.catName + '/' + m.linkURL + '/' + encodeURIComponent(m.content);
        m.linkTarget = '_self';
      } else {
        m.linkTarget = '_blank';
      }
      m.catName = m.catName.toLowerCase();
      queryHandler.handleArticleCateg(m);
    });
    return mpms;
  }

  return {
    render: function(req, res, next) {
        var metaKeyword = categMapping.categoryKeywordMapping['Contributor'] ;
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
                metaKeyword: metaKeyword,
                menu: queryHandler.parseMenu(result.listMenu),
                articles: queryHandler.parseHomeArticles(articles),
                campaigns: result.listCampaign || [],
                showEDM: edm.showEDM(req.cookies.addEDM, result.listCampaign),
                origin: "https://" + req.get('host'),
                fullURL: "https://" + req.get('host') + req.originalUrl
              });
            }, function(err) {
                    return next(err);
            });
    }
  };
};
