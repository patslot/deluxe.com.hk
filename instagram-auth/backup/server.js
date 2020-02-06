var express = require('express');
var api = require('instagram-node').instagram();
var app = express();
var port = 5000;  

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 5000);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
 
api.use({
  client_id: '6c30ea21410a427b995a1d4ab110fc13',
  client_secret: '261a5227de5442cb894af35759055f89'
});
 
var redirect_uri = 'http://localhost:5000/handleauth';


function test(req, res){
    res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
}

exports.authorize_user = function(req, res) {
  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};
 
exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      res.send(result.access_token);
    }
  });
};
 
// This is where you would initially send users to authorize 
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI 
app.get('/handleauth', exports.handleauth);

app.get('/', test);
 
app.listen(5000, () => console.log('Example app listening on port 3000!'))