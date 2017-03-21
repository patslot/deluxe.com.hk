module.exports = function(gQuery, categoryMapping) {
  return {
    renderArticles: function(req, res) {
      var name = req.params.contrName;
      gQuery.contributorIndex().then(function(r) {
        var contributors = (r.listContributor || []).filter(function(c) {
          return c.catName === name;
        });
        if (contributors.length === 0) {
          res.status(500).send('Cannot find a contributor having the name ' + name);
          return;
        }
        var contributor = contributors[0];
        var splitPos = contributor.content.indexOf('|');
        if (splitPos > 0) {
          contributor.post = contributor.content.slice(0, splitPos);
          contributor.desc = contributor.content.slice(splitPos+1).trim();
        }
        res.render('contributorArticles', {contributor: contributor});
      }, function(err) {
        console.log(err);
        res.status(500).send('Error in contributor index query:' + err);
      });
    },
    renderIndex: function(req, res) {
      var adTagMapping = categoryMapping.nameToAdTag['Contributor'];
      res.render('contributorIndex', {
        adTag: adTagMapping.list
      });
    }
  }
};
