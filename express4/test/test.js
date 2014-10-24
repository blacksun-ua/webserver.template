var request = require('supertest')
  , should  = require('should')
  //, app     = require('../app.js')
  , app     = require('../app_web.js')
  ;

var config = {
    host    : "127.0.0.1"
  , http : {
        port    : "8011"
    }
  , logger  : './conf/logger.conf.js'
}


describe('check mocha and should works', function(){
    it('should pass', function(){
        should(null).not.be.ok;
    })
})

describe('check template runs', function(){
    var servers = app.listen(config, "test path");

    it('GET /', function(done){
        request(servers.http)
            .get('/')
            .set('Accept', 'text/html')
            .expect('Content-Type', /text\/html/)
            .expect(200, 'hello world', done);
    })

    it('GET /admin', function(done){
        request(servers.http)
            .get('/admin')
            .set('Accept', 'text/html')
            .expect('Content-Type', /text\/html/)
            .expect(200, 'admin panel', done);
    })
})

describe('check loggers', function(){
    it('should pass', function(){
        should(null).not.be.ok;
    })
})

describe('check error handling', function(){
    it('should pass', function(){
        should(null).not.be.ok;
    })
})

