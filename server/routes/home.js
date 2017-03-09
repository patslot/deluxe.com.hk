var gQuery = require('../middleware/graphqlQuery.js');

var render = function(req, res) {
  gQuery.homeQuery().then(function(result) {
    res.render('homepage', {mpms: result.listMPM || []});
  }, function(err) {
    console.error(err);
    res.sendStatus(500, err);
  });
};

module.exports = {
  render: render
};
