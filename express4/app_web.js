var
    bodyParser      = require('body-parser')
  , cookieParser    = require('cookie-parser')
  , dateUtils       = require('date-utils')
  , errorHandler    = require('errorhandler')
  , express         = require('express')
  , favicon         = require('serve-favicon')
  , flash           = require('connect-flash')
  , fs              = require('fs')
  , http            = require('http')
  , https           = require('https')
  , log4js          = require('log4js')
  , logger          = require('./modules/logger.js')
  , morgan          = require('morgan')
  , passport        = require('passport')
  , path            = require('path')
  , session         = require('express-session')
  , util            = require('util')
  ;

function log() {
    console.log(util.inspect.apply(this, arguments));
}


module.exports.listen = function(conf, conf_path) {
    // create server ===================================================================================================
    var app = express();

    require('./config/passport')(passport); // pass passport for configuration

    // set up our express application
    app.use(morgan('dev')); // log every request to the console
    app.use(cookieParser());
    app.use(bodyParser.json()); // read cookies (needed for auth)
    app.use(bodyParser.urlencoded({ extended: true })); // get information from html forms

    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs'); // set up ejs for templating

    // required for passport
    app.use(session({ secret: 'cat', saveUninitialized: false, resave: false }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash()); // use connect-flash for flash messages stored in session

    // routes ======================================================================
    require('./routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport

    // launch ======================================================================
    // HTTP/HTTPS servers + AdminPanel configuration
    var servers = {};
    if(conf.http) {
        var lhost = conf.http.host || conf.host;
        servers.http = http.createServer(app).listen(conf.http.port, lhost, function(err) {
            //l_main.info('HTTP  Server started on %s:%s with config %s', lhost, conf.http.port, conf_path);
        });
    }

    if(conf.https) {
        var ssl_options  = conf.https.ssl;
        ssl_options.key  = fs.readFileSync(conf.https.ssl.key);
        ssl_options.cert = fs.readFileSync(conf.https.ssl.cert);
        ssl_options.ca   = fs.readFileSync(conf.https.ssl.ca);
        var lhost        = conf.https.host || conf.host;

        servers.https = https.createServer(ssl_options, app).listen(conf.https.port, lhost, function(err) {
            //l_main.info('HTTPS Server started on %s:%s with config %s', lhost, conf.https.port, conf_path);
        });
    }

    if(conf.admin_panel) {
        var lhost = conf.admin_panel.host || conf.host;
        servers.admin_panel = http.createServer(app).listen(conf.admin_panel.port, lhost, function(err) {
            //l_main.info('Admin Server started on %s:%s with config %s', lhost, conf.admin_panel.port, conf_path);
        });
    }

    return servers;
}
