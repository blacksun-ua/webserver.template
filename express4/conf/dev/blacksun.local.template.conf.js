module.exports = {
    host        : "0.0.0.0" // запускает и на внутреннем (127.0.0.1) и на внешних айпишниках машины
  , port        : 8011
  , admin_port  : 8012
  , https_port  : 8100
  , db          : 'pg://postgres@127.0.0.1:5433/sre_portal_test'
  , api         : 'http://asd12pq:asd12pq@127.0.0.1:8004'
  , logger      : 'conf/logger.conf'
  , ssl : {
      key     : 'conf/keys/server.key'
    , cert    : 'conf/keys/server.crt'
    , ca      : 'conf/keys/template.crt'
    , requestCert: true
    , rejectUnauthorized: false
    }
};
