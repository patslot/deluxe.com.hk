var express = require("express");
var app = express();

module.exports = function() {
    app.use(express.static('public'));
    
    return app;
}
