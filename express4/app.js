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

    // this loggers should be setup before all other things
    app.use(logger(l_main,   { level: 'TRACE', format: ':method :url', immediate : true }));
    app.use(logger(l_main,   { level: 'auto',  format: ':method :url :status :res[content-length] finished in :response-time ms' }));
    app.use(logger(l_in,     { level: 'auto',  format: ':method :url :status :res[content-length] finished in :response-time ms' }));
    app.use(logger(l_in_out, { level: 'auto',  format: ':method :url :status :res[content-length] finished in :response-time ms :nreq-data :nrsp-data' }));
    //app.use(logger(l_in_out, { level: 'auto',  format: ':method :url :status :res[content-length] finished in :response-time ms :newline REQ: :req-data :newline RSP: :rsp-data' }));

    // setup server
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('layout', true);

    var static_options, error_handler_options;
    if('development' == app.get('env')) {
        error_handler_options = { dumpExceptions: true, showStack: true }; // TODO: doesn't work
    } else if('production' == app.get('env')) {
        var oneYear = 31557600000;
        static_options = { maxAge: oneYear };
    }

    app.use(express.static(__dirname + '/public/thirdparty', static_options));
    app.use(express.static(__dirname + '/public', static_options));


    // redirect to Admin Panel
    function adminPanel(req, res, next) {
        var port = req.headers.host.split(':')[1];
        if(port == conf.admin_port) {
            res.send('admin panel');
        } else {
            next();
        }
    }


    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
//    app.use(express.session());
    app.use(app.router);


    // process errors
    app.use(function(err, req, res, next) {
        if(err) l_main.error(err);
        next(err, req, res, next);
    });
    app.use(express.errorHandler(error_handler_options));



    // setup routes
    app.all('*', adminPanel, function(req, res, next) {
        next();
    });

    app.get('/', function(req, res) {
        res.send('hello world');
    });


    // HTTP/HTTPS servers up
    http.createServer(app).listen(conf.port, conf.host, function(err) {
        l_main.info('HTTP  Server started on %s:%s with config %s', conf.host, conf.port, conf_path);
    });

    http.createServer(app).listen(conf.admin_port, conf.host, function(err) {
        l_main.info('Admin Server started on %s:%s with config %s', conf.host, conf.admin_port, conf_path);
    });

    var ssl_options  = conf.ssl;
    ssl_options.key  = fs.readFileSync(conf.ssl.key);
    ssl_options.cert = fs.readFileSync(conf.ssl.cert);
    ssl_options.ca   = fs.readFileSync(conf.ssl.ca);

    https.createServer(ssl_options, app).listen(conf.https_port, conf.host, function(err) {
        l_main.info('HTTPS Server started on %s:%s with config %s', conf.host, conf.https_port, conf_path);
    });

    // TODO: user auth
    // TODO: configuration
    // TODO: favicon

}
