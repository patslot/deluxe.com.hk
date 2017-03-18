var categMapping = require('../middleware/categoryMapping.js');

module.exports = function(gQuery) {
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
        res.render('homepage', {mpms: parseMpms(result.listMPM)});
      }, function(err) {
        console.error(err);
        res.sendStatus(500, err);
      });
    }
  };
};
