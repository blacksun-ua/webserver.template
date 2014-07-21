module.exports = {
    host    : "0.0.0.0" // запускает и на внутреннем (127.0.0.1) и на внешних айпишниках машины
  , port    : 8011
  , db      : 'pg://postgres@127.0.0.1:5433/sre_portal_test'
  , api     : 'http://asd12pq:asd12pq@127.0.0.1:8004'
  , logger  : 'conf/logger.conf'
};
