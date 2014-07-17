var express = require('express')
  , routes  = require('./routes')
  , http    = require('http')
  , path    = require('path');

var app = express();


module.exports.listen = function(conf) {
    return app.listen(conf.host, conf.port, function() {
        console.log('Server started on %s:%s, with config %s', conf.host, conf.port, conf.path);
    });
}
