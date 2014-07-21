var express     = require('express')
  , log4js      = require('log4js')
  , logger      = require('modules/logger')
  , date_utils  = require('date-utils')
  , http        = require('http')
  , path        = require('path');
var util = require('util');



module.exports.listen = function(conf, conf_path) {
    log4js.configure(require(conf.logger));
    var l_main   = log4js.getLogger('template.main');
    var l_in     = log4js.getLogger('template.in');
    var l_in_out = log4js.getLogger('template.in.out');

    var app = express();

    app.configure('development', function() {
        app.use(logger(l_main,   { level: 'auto', format: ':method :url', immediate : true }));
        app.use(logger(l_main,   { level: 'auto', format: ':method :url :status :res[content-length] - finished in :response-time ms' }));
//        app.use(logger(l_in,     { immediate : true, level: 'auto', format: ':method :url :status :res[content-length] - finished in :response-time ms' }));
//        app.use(logger(l_in_out, { immediate : true, level: 'auto', format: ':method :url :status :res[content-length] - finished in :response-time ms' }));
    });

    app.configure('production', function() {
    });

    app.configure(function() {
        app.set('views', __dirname + '/views'); // можно не писать, по-умолчанию уже установлено
        app.set('view engine', 'jade');
        app.set('layout', true);

        app.use(express.bodyParser());
        app.use(express.methodOverride());

        app.use(express.static(__dirname + '/public/thirdparty'));
        app.use(express.static(__dirname + '/public'));
    });

    app.get('/', function(req, res){
        res.send('hello world');
    });

    app.listen(conf.port, conf.host, function(err) {
        if(err)
            console.log(err);
        else
            console.log('Server started on %s:%s with config %s', conf.host, conf.port, conf_path);
    });

}
