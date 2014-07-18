var express = require('express')
  , http    = require('http')
  , path    = require('path');
var util = require('util');

var app = express();

app.get('/', function(req, res){
    res.send('hello world');
});

module.exports.listen = function(conf, conf_path) {
    app.listen(conf.port, conf.host, function(err) {
        if(err)
            console.log(err);
        else
            console.log('Server started on %s:%s with config %s', conf.host, conf.port, conf_path);
    });
}
