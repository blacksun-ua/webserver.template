var express = require('express')
  , morgan  = require('morgan');

var app = express();


module.exports.start = function(conf) {
    return app.listen(conf.host, conf.port, function() { 
        console.log('Server started on %s:%s, with config %s', conf.host, conf.port, conf.path);
    });
}
