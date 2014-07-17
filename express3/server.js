var conf = require(process.env.CONF)
  , srv  = require('app');

srv.start(conf);
