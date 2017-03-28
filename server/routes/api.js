var express = require("express");
var request = require("request");

module.exports = function(edmSubscriptionEndpoint) {
  var router = express.Router();

  router.post("/subscribe", function(req, res) {
    if (edmSubscriptionEndpoint) {
      request({
        url: edmSubscriptionEndpoint,
        method: "POST",
        json: req.body
      }, function(err, edmRes, edmBody) {
        if (err || edmRes.statusCode !== 200) {
          if (err) {
            console.error(err);
          } else {
            console.error(JSON.stringify(edmRes));
            console.error(JSON.stringify(edmBody));
          }
          res.status(500);
          res.end();
        } else {
          res.cookie("addEDM", "subscribed", {
            maxAge: 1000 * 60 * 60 * 24 * 365,
            httpOnly: true
          });
          res.status(200);
          res.end(JSON.stringify(edmBody));
        }
      });
    } else {
      console.error("missing EDM subscription endpoint");
      res.status(500);
      res.end();
    }
  });

  return router;
}
