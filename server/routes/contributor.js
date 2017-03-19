module.exports = function(gQuery) {
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
        res.render('contributorArticles', {contributor: contributors[0]});
      }, function(err) {
        console.log(err);
        res.status(500).send('Error in contributor index query:' + err);
      });
    },
    renderIndex: function(req, res) {
      res.render('contributorIndex');
    }
  }
};
