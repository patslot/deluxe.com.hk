var in_client_id = '6c30ea21410a427b995a1d4ab110fc13',
    in_client_secret = '261a5227de5442cb894af35759055f89',
    in_redirect_uri = 'http://localhost:5000/auth',
    in_auth_url = 'https://api.instagram.com/oauth/authorize/?client_id='
                  + in_client_id + '&redirect_uri='
                  + in_redirect_uri + '&response_type=code';

var db_user = 'testing',
    db_password = 'test123',
    db_uri = 'mongodb://@localhost:27017/';

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    uri: db_uri
  },
  instagram: {
    client_id: in_client_id,
    client_secret: in_client_secret,
    redirect_uri: in_redirect_uri,
    auth_url: in_auth_url
  }
};