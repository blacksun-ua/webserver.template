var conf = require(process.env.CONF)
  , srv  = require('app_web');

srv.listen(conf, process.env.CONF);

