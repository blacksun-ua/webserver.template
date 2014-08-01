var express     = require('express')
  , https       = require('https')
  , http        = require('http')
  , fs          = require('fs')
  , log4js      = require('log4js')
  , logger      = require('modules/logger')
  , date_utils  = require('date-utils')
  , path        = require('path');
var util = require('util');



module.exports.listen = function(conf, conf_path) {
    // create server
    var app = express();

    // create logger instances and set it up
    log4js.configure(require(conf.logger));
    var l_main   = log4js.getLogger('template.main');
    var l_in     = log4js.getLogger('template.in');
    var l_in_out = log4js.getLogger('template.in.out');

    // setup development configuration
    app.configure('development', function() {
        // setup loggers formats
        app.use(logger(l_main,   { level: 'TRACE', format: ':method :url', immediate : true }));
        app.use(logger(l_main,   { level: 'auto', format: ':method :url :status :res[content-length] finished in :response-time ms' }));
        app.use(logger(l_main,   { level: 'auto' }));
        app.use(logger(l_main,   { level: 'auto', format: ':foobar' }));
        app.use(logger(l_in,     { level: 'auto', format: ':method :url :status :res[content-length] finished in :response-time ms' }));
        app.use(logger(l_in_out, { level: 'auto', format: ':method :url :status :res[content-length] finished in :response-time ms :newline REQ: :req-data :newline RSP: :rsp-data' }));
        app.use(logger(l_in_out, { level: 'auto', format: ':method :url :status :res[content-length] finished in :response-time ms :nreq-data :nrsp-data' }));
    });

    // setup production configuration
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




    http.createServer(app).listen(conf.port, conf.host, function(err) {
        if(err)
            console.log(err);
        else
            console.log('HTTP Server started on %s:%s with config %s', conf.host, conf.port, conf_path);
    });

    var options = conf.ssl;
    options.key = fs.readFileSync(conf.ssl.key);
    options.cert = fs.readFileSync(conf.ssl.cert);
    options.ca = fs.readFileSync(conf.ssl.ca);

    https.createServer(options, app).listen(conf.https_port, conf.host, function(err) {
        if(err)
            console.log(err);
        else
            console.log('HTTPS Server started on %s:%s with config %s', conf.host, conf.https_port, conf_path);
    });


    // TODO: user auth
    // TODO: configuration
    // TODO: favicon
}
