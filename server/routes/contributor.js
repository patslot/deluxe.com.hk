module.exports = function(gQuery, categoryMapping, queryHandler) {
  var articleCount = 4;
  var contributorBlockCount = 6;

  function renderArticles(req, res, next) {
    var name = req.params.contrName;
    gQuery.contributorArticlesQuery(name).then(function(r) {
      var contributors = (r.listContributor || []).filter(function(c) {
        return c.catName === name;
      });
      if (contributors.length === 0) {
        return next();
      }
      var contributor = contributors[0];
      var splitPos = contributor.content.indexOf('|');
      if (splitPos > 0) {
        contributor.post = contributor.content.slice(0, splitPos);
        contributor.desc = contributor.content.slice(splitPos+1).trim();
      }
      var articles = (r.listContributorArticle || []).slice(0, articleCount);
      articles.forEach(function(a) {
        queryHandler.parseCmsArticle('Contributor', a);
      });
      res.render('contributorArticles', {
        contributor: contributor,
        menu: queryHandler.parseMenu(r.listMenu),
        articles: articles});
    }, function(err) {
      return next(err);
    });
  }

  function renderIndex(req, res, next) {
    var adTagMapping = categoryMapping.nameToAdTag['Contributor'];
    gQuery.contributorIndexQuery().then(function(r) {
      res.render('contributorIndex', {
        contributors: (r.listContributor || []).slice(0, contributorBlockCount),
        menu: queryHandler.parseMenu(r.listMenu),
        adTag: adTagMapping.list
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
