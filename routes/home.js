var gQuery = require('../middleware/graphqlQuery.js');

var render = function(req, res) {
  gQuery.homeQuery().then(function(result) {
    res.render('homepage', {mpms: result.listMPM || []});
  });
};

module.exports = {
  render: render
};
