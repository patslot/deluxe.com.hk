var express = require('express');
var app = express();

var morgan = require('morgan');
var mongoose = require('mongoose');

var config = require('./config/config');
var authUser = require('./app/services/authService');

var settings = {
      reconnectTries : Number.MAX_VALUE,
      autoReconnect : true
};

mongoose.connect(config.db.uri, settings, function(err, dbref) {
  if (!err) {
    console.log("Mongodb connected");
    db = dbref;
  }else{
    console.log("Error while connecting to mongoDB" + err);
  }
});



app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
	response.sendfile('./public/index.html')
});

app.listen(5000);
console.log('App is runung on port 5000');

app.get('/auth', authUser);

app.get('/login', function (request, response) {
	response.redirect(config.instagram.auth_url);
});