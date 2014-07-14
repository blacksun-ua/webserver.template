var conf = require('conf/' + process.env.conf)
  , srv  = require('server_instance');

srv.start(conf);
