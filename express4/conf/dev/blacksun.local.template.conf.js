module.exports = {
    host            : '0.0.0.0' // запускает и на внутреннем (127.0.0.1) и на внешних айпишниках машины
  , http : {
        port        : 8011
    }
  , https : {
        port        : 8100
      , ssl : {
            key     : 'conf/keys/server.key'
          , cert    : 'conf/keys/server.crt'
          , ca      : 'conf/keys/template.crt'
          , requestCert: true
          , rejectUnauthorized: false
          }
    }
  , admin_panel : {
        protocol    : 'https'
      , port        : 8012
      , ssl : {
            key     : 'conf/keys/server.key'
          , cert    : 'conf/keys/server.crt'
          , ca      : 'conf/keys/template.crt'
          , requestCert: true
          , rejectUnauthorized: false
          }
    }
  , logger      : 'conf/logger.conf'
  , db          : 'pg://postgres@127.0.0.1:5433/sre_portal_test'
  , api         : 'http://asd12pq:asd12pq@127.0.0.1:8004'
};
