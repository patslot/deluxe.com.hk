'use strict';

var http = require('http');
var path = require('path');

module.exports = function() {
  function sendImage(baseUrl, req, res) {
    var imgUrl = 'http://210.242.234.173' + baseUrl + req.params.categID + '/' + req.params.image;
    http.get(imgUrl, function(resH) {

      var buffers = [];
      var length = 0;

      resH.on("data", function(chunk) {
        // store each block of data
        length += chunk.length;
        buffers.push(chunk);
      });

      resH.on("end", function() {
        var image = Buffer.concat(buffers);
        var type = path.extname(req.params.image).replace(/^\./, '');
        res.set('Content-Type', 'image/' + type);
        res.send(image);
      });
    });
  }

  var sendCampImage = function(req, res) {
    sendImage('/campaign/', req, res);
  };

  var sendComponeImage = function(req, res) {
    sendImage('/campaign/compone/', req, res);
  };

  return {
    sendComponeImage: sendComponeImage,
    sendCampImage: sendCampImage
  }
};
