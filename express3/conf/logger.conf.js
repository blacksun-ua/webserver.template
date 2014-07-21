module.exports = {
    appenders : [
    {
        type        : 'console'
    }, {
        type        : 'file',
        filename    : '/var/log/template/main.log',
        category    : 'template.main',
        maxLogSize  : 10485760,
        backups     : 3
    }, {
        type        : 'file',
        filename    : '/var/log/template/db.log',
        category    : 'template.db',
        maxLogSize  : 10485760,
        backups     : 3
    }, {
        type        : 'file',
        filename    : '/var/log/template/server.in.log',
        category    : 'template.in',
        maxLogSize  : 10485760,
        backups     : 3
    }, {
        type        : 'file',
        filename    : '/var/log/template/server.in.out.log',
        category    : 'template.in.out',
        maxLogSize  : 10485760,
        backups     : 3
    }, {
        type        : 'file',
        filename    : '/var/log/template/providers.req.log',
        category    : 'template.providers.req',
        maxLogSize  : 10485760,
        backups     : 3
    }, {
        type        : 'file',
        filename    : '/var/log/template/providers.req.rsp.log',
        category    : 'template.providers.req.rsp',
        maxLogSize  : 10485760,
        backups     : 3
    } ]
};
