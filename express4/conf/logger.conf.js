var name        = 'template'
  , maxLogSize  = 1024*1024*10
  , backups     = 3
  ;

module.exports = {
    appenders : [ {
        type        : 'console'
    }, {
        type        : 'file',
        filename    : '/var/log/' + name + '/main.log',
        category    : name + '.main',
        maxLogSize  : maxLogSize,
        backups     : backups
    }, {
        type        : 'file',
        filename    : '/var/log/' + name + '/db.log',
        category    : name + '.db',
        maxLogSize  : maxLogSize,
        backups     : backups
    }, {
        type        : 'file',
        filename    : '/var/log/' + name + '/server.in.log',
        category    : name + '.server.in',
        maxLogSize  : maxLogSize,
        backups     : backups
    }, {
        type        : 'file',
        filename    : '/var/log/' + name + '/server.in.out.ipc.log',
        category    : name + '.server.in.out',
        maxLogSize  : maxLogSize,
        backups     : backups
    }, {
        type        : 'file',
        filename    : '/var/log/' + name + '/client.req.log',
        category    : name + '.client.req',
        maxLogSize  : maxLogSize,
        backups     : backups
    }, {
        type        : 'file',
        filename    : '/var/log/' + name + '/client.req.rsp.log',
        category    : name + '.client.req.rsp',
        maxLogSize  : maxLogSize,
        backups     : backups
    } ]
};
