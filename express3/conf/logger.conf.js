module.exports = {
    appenders : [ {
        type : 'file',
        filename : '/var/log/spa/main.log',
        category : 'spa.main',
        maxLogSize : 10485760,
        backups : 3
    }, {
        type : 'file',
        filename : '/var/log/spa/db.log',
        category : 'spa.db',
        maxLogSize : 10485760,
        backups : 3
    }, {
        type : 'file',
        filename : '/var/log/spa/result.log',
        category : 't2t.api.result',
        maxLogSize : 10485760,
        backups : 3
    }, {
        type : 'file',
        filename : '/var/log/spa/ipc.log',
        category : 't2t.api.ipc',
        maxLogSize : 10485760,
        backups : 3
    } ]
};
