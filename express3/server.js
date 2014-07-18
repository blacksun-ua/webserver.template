var conf = require(process.env.CONF)
  , srv  = require('./app');

srv.listen(conf, process.env.CONF);
