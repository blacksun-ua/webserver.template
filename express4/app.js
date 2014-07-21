var express = require('express')
  //, morgan  = require('morgan');
    log4cpp = require('log4js');

var app = express();

app.get('/', function(req, res) { 
    res.send('Hello, World!');
});

module.exports.listen = function(conf, conf_path) {
    return app.listen(conf.port, conf.host, function() { 
        console.log('Server started on %s:%s with config %s', conf.host, conf.port, conf_path);
    });
}
