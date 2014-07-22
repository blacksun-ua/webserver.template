"use strict";
var levels      = require('log4js/lib/levels')
  , date_utils  = require('date-utils')
  , auth        = require('basic-auth');

var DEFAULT_FORMAT = ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
/**
 * Log requests with the given `options` or a `format` string.
 *
 * Options:
 *
 *   - `format`        Format string, see below for tokens
 *   - `level`         A log4js levels instance. Supports also 'auto'
 *   - `immediate`     Dump log immegiate (true), or wait for response (false)
 *
 * Tokens:
 *
 *   - `:url`
 *   - `:method`
 *   - `:response-time`
 *   - `:date`
 *   - `:status`
 *   - `:referrer`
 *   - `:remote-addr`
 *   - `:remote-user`
 *   - `:http-version`
 *   - `:user-agent`
 *   - `:rsp-data`
 *   - `:free`
 *   - `:skip`
 *   - `:req[header]` ex: `:req[Accept]`
 *   - `:res[header]` ex: `:res[Content-Length]`
 *
 * @param {String|Function|Object} format or options
 * @return {Function}
 * @api public
 */

function getLogger(logger4js, options) {
    if ('object' == typeof options) {
        options = options || {};
    } else if (options) {
        options = { format: options };
    } else {
        options = {};
    }

    var thislogger = logger4js
  , level = levels.toLevel(options.level, levels.INFO)
  , fmt   = options.format || DEFAULT_FORMAT
  , nolog = options.nolog ? createNoLogCondition(options.nolog) : null;

    return function (req, res, next) {

        function log_it() {
            if (thislogger.isLevelEnabled(level)) {
                if (typeof fmt === 'function') {
                    var line = fmt(req, res, function(str) { return format(str, req, res); });
                    if (line) thislogger.log(level, line);
                } else {
                    thislogger.log(level, format(fmt, req, res));
                }
            }
        }

        // prepare our struct
        res._logme = res._logme || {};

        // mount safety
        if(res._logme.logging) return next();

        // nologs
        if (nolog && nolog.test(req.originalUrl)) return next();
        if (thislogger.isLevelEnabled(level) || options.level === 'auto') {

            var writeHead = res.writeHead
            , end = res.end
            , url = req.originalUrl;

            res._logme.startAt = process.hrtime();

            // flag as logging
            //req._logme.logging = true;

            // write immediate
            if(options.immediate) {
                log_it();
                return next();
            }

            // proxy for statusCode.
            res.writeHead = function(code, headers) {
                res.writeHead = writeHead;
                res.writeHead(code, headers);
                res._logme.statusCode = code;

                //status code response level handling
                if(options.level === 'auto') {
                    level = levels.INFO;
                    if(code >= 300) level = levels.WARN;
                    if(code >= 400) level = levels.ERROR;
                } else {
                    level = levels.toLevel(options.level, levels.INFO);
                }
            };

            // proxy end to output a line to the provided logger.
            res.end = function(chunk, encoding) {
                res.end = end;
                res.end(chunk, encoding);
                log_it();
            };
        }

        //ensure next gets always called
        next();
    };
}

/**
 * Return formatted log line.
 *
 * @param  {String} str
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @return {String}
 * @api private
 */

function format(fmt, req, res) {
    fmt = fmt.replace(/"/g, '\\"');
    var js = ' return "' + fmt.replace(/:([-\w]{2,})(?:\[([^\]]+)\])?/g, function(_, name, arg) {
        var token_name = name;
        if(typeof exports[name] != 'function')
            name = 'skip';
        return '"\n + (tokens["' + name + '"](req, res, "' + arg + '","' + token_name +'") || "-") + "';
    }) + '";'
    var fn = new Function('tokens, req, res', js);
    return fn(exports, req, res);
}

/**
 * Return RegExp Object about nolog
 *
 * @param  {String} nolog
 * @return {RegExp}
 * @api private
 *
 * syntax
 *  1. String
 *   1.1 "\\.gif"
 *         NOT LOGGING http://example.com/hoge.gif and http://example.com/hoge.gif?fuga
 *         LOGGING http://example.com/hoge.agif
 *   1.2 in "\\.gif|\\.jpg$"
 *         NOT LOGGING http://example.com/hoge.gif and
 *           http://example.com/hoge.gif?fuga and http://example.com/hoge.jpg?fuga
 *         LOGGING http://example.com/hoge.agif,
 *           http://example.com/hoge.ajpg and http://example.com/hoge.jpg?hoge
 *   1.3 in "\\.(gif|jpe?g|png)$"
 *         NOT LOGGING http://example.com/hoge.gif and http://example.com/hoge.jpeg
 *         LOGGING http://example.com/hoge.gif?uid=2 and http://example.com/hoge.jpg?pid=3
 *  2. RegExp
 *   2.1 in /\.(gif|jpe?g|png)$/
 *         SAME AS 1.3
 *  3. Array
 *   3.1 ["\\.jpg$", "\\.png", "\\.gif"]
 *         SAME AS "\\.jpg|\\.png|\\.gif"
 */
function createNoLogCondition(nolog) {
    var regexp = null;

    if (nolog) {
        if (nolog instanceof RegExp) {
            regexp = nolog;
        }

        if (typeof nolog === 'string') {
            regexp = new RegExp(nolog);
        }

        if (Array.isArray(nolog)) {
            var regexpsAsStrings = nolog.map(
                function convertToStrings(o) {
                    return o.source ? o.source : o;
                }
            );
            regexp = new RegExp(regexpsAsStrings.join('|'));
        }
    }

    return regexp;
}

/**
* Define a token function with the given `name`,
* and callback `fn(req, res)`.
*
* @param {String} name
* @param {Function} fn
* @return {Object} exports for chaining
* @api public
*/

exports.token = function(name, fn) {
    exports[name] = fn;
    return this;
};

exports.token('url', function(req) {
    return req.originalUrl || req.url;
});

exports.token('method', function(req) {
    return req.method;
});

exports.token('response-time', function(req, res) {
    if (!res._logme.startAt) return '?';
    var diff = process.hrtime(res._logme.startAt);
    return (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
});

exports.token('date', function() {
    return new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
});

exports.token('status', function(req, res) {
    return res._logme.statusCode || res.statusCode || null;
});

exports.token('referrer', function(req) {
    return req.headers['referer'] || req.headers['referrer'];
});

exports.token('remote-addr', function(req) {
    if (req.ip) return req.ip;
    if (req._remoteAddress) return req._remoteAddress;
    if (req.connection) return req.connection.remoteAddress;
    return null;
});

exports.token('remote-user', function (req) {
    var creds = auth(req)
    var user = (creds && creds.name) || '-'
    return user;
})

exports.token('http-version', function(req) {
    return req.httpVersionMajor + '.' + req.httpVersionMinor;
});

exports.token('user-agent', function(req) {
    return req.headers['user-agent'];
});

exports.token('rsp-data', function(req, res) {
    return res.a;
});

exports.token('free', function(req, res, field) {
    return field;
});

exports.token('skip', function(req, res, field, token_name) {
    return 'log format error - skipped unknown token ' + token_name;
});

exports.token('req', function(req, res, field) {
    return req.headers[field.toLowerCase()];
});

exports.token('res', function(req, res, field) {
    return (res._headers || {})[field.toLowerCase()];
});

module.exports = getLogger;

// TODO:
// 1. reopen file after write error (restore write after error)
// 2. log response data
