module.exports = function(gQuery, categMapping, queryHandler, edm) {
  var articleCount = 4;
  var contributorBlockCount = 6;
  var categContr = 'Contributor';
  var columnist = 'COLUMNIST';

  function renderArticles(req, res, next) {
    var name = req.params.contrName;
    gQuery.contributorArticlesQuery(name).then(function(r) {
      var contributors = (r.listContributor || []).filter(function(c) {
        return c.catName === name;
      });
      if (contributors.length === 0) {
        return next();
      }
      var articles = (r.listContributorArticle || []).slice(0, articleCount);
      articles.forEach(function(a) {
        queryHandler.parseCmsArticle(categContr, a);
      });
      res.render('contributorArticles', {
        pageviewLog: categMapping.categPageviewLog(columnist, 'INDEX', name),
        contributor: queryHandler.parseContributor(contributors[0]),
        menu: queryHandler.parseMenu(r.listMenu, categContr),
        articles: articles,
        campaigns: r.listCampaign || [],
        showEDM: edm.showEDM(req.cookies.addEDM, r.listCampaign)
      });
    }, function(err) {
      return next(err);
    });
  }

  function renderIndex(req, res, next) {
    var adTagMapping = categMapping.nameToAdTag[categContr];
    gQuery.contributorIndexQuery().then(function(r) {
      res.render('contributorIndex', {
        pageviewLog: categMapping.categPageviewLog(columnist),
        contributors: queryHandler.parseContributors(
          (r.listContributor || []).slice(0, contributorBlockCount)),
        menu: queryHandler.parseMenu(r.listMenu, categContr),
        adTag: adTagMapping.list,
        campaigns: r.listCampaign || [],
        showEDM: edm.showEDM(req.cookies.addEDM, r.listCampaign)
      });
    }, function(err) {
      return next(err);
    });
  }

  return {
    renderArticles: renderArticles,
    renderIndex: renderIndex
  }
};
