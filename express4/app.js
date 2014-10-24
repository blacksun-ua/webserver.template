var
    bodyParser      = require('body-parser')
  , cookieParser    = require('cookie-parser')
  , dateUtils       = require('date-utils')
  , errorHandler    = require('errorhandler')
  , express         = require('express')
  , favicon         = require('serve-favicon')
  , fs              = require('fs')
  , http            = require('http')
  , https           = require('https')
  , log4js          = require('log4js')
  , logger          = require('./modules/logger.js')
  , passport        = require('passport')
  , path            = require('path')
  , session         = require('express-session')
  , util            = require('util')
  ;

function log() {
    console.log(util.inspect.apply(this, arguments));
}


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
        app.use(errorHandler());
    } else if('production' == app.get('env')) {
        var oneYear = 31557600000;
        static_options = { maxAge: oneYear };
    }


    // STATIC CONTENT
    app.use(express.static('public/thirdparty', static_options));
    app.use(express.static('public', static_options));
    app.use(favicon('public/images/favicon.ico'));


    // redirect to Admin Panel
    function adminPanel(req, res, next) {
//        var port = req.headers.host.split(':')[1];
//        if(port == conf.admin_port) {
            res.send('admin panel');
//        } else {
//            next();
//        }
    }


//    app.use(express.methodOverride());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({ secret: 'kbd-cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
//    app.use(app.router);


    // ERROR HANDLING
//    app.use(log_errors);
//    app.use(client_error_handling);
//    app.use(error_handling);
//    app.use(express.errorHandler(error_handler_options));
    app.use(function(err, req, res, next) {
        if(err) l_main.error(err);
        next(err, req, res, next);
    });

    // AUTH
    function checkAuth(req, res, next) {
        if(req.session && req.session.user_id) {
            next();
        } else {
            res.send('Access denied. Got to login page');
        }
    }

    app.all('*', checkAuth);


    // ROUTES
    app.get('/admin', adminPanel);

    app.get('/', function(req, res) {
        res.send('hello world');
    });


    // TODO: user auth
    // TODO: configuration
    // TODO: http://expressjs.com/guide/behind-proxies.html


    // HTTP/HTTPS servers + AdminPanel configuration

    var servers = {};
    if(conf.http) {
        var lhost = conf.http.host || conf.host;
        servers.http = http.createServer(app).listen(conf.http.port, lhost, function(err) {
            l_main.info('HTTP  Server started on %s:%s with config %s', lhost, conf.http.port, conf_path);
        });
    }

    if(conf.https) {
        var ssl_options  = conf.https.ssl;
        ssl_options.key  = fs.readFileSync(conf.https.ssl.key);
        ssl_options.cert = fs.readFileSync(conf.https.ssl.cert);
        ssl_options.ca   = fs.readFileSync(conf.https.ssl.ca);
        var lhost        = conf.https.host || conf.host;

        servers.https = https.createServer(ssl_options, app).listen(conf.https.port, lhost, function(err) {
            l_main.info('HTTPS Server started on %s:%s with config %s', lhost, conf.https.port, conf_path);
        });
    }

    if(conf.admin_panel) {
        var lhost = conf.admin_panel.host || conf.host;
        servers.admin_panel = http.createServer(app).listen(conf.admin_panel.port, lhost, function(err) {
            l_main.info('Admin Server started on %s:%s with config %s', lhost, conf.admin_panel.port, conf_path);
        });
    }

    return servers;
}
