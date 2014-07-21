var name = 'template';

module.exports = {
	appenders : [ {
		type : 'file',
		filename : '/var/log/' + name + '/main.log',
		category : name + '.main',
		maxLogSize : 1204800,
		backups : 3
	}, {
		type : 'file',
		filename : '/var/log/' + name + '/db.log',
		category : name + '.db',
		maxLogSize : 1204800,
		backups : 3
	}, {
		type : 'file',
		filename : '/var/log/' + name + '/server.in.log',
		category : name + '.server.in',
		maxLogSize : 1204800,
		backups : 3
	}, {
		type : 'file',
		filename : '/var/log/' + name + '/server.in.out.ipc.log',
		category : name + '.server.in.out',
		maxLogSize : 1204800,
		backups : 3
	}, {
        type : 'file',
        filename : '/var/log/' + name + '/client.req.log',
        category : name + '.client.req',
        maxLogSize : 1204800,
        backups : 3
    }, {
        type : 'file',
        filename : '/var/log/' + name + '/client.req.rsp.log',
        category : name + '.client.req.rsp',
        maxLogSize : 1204800,
        backups : 3
    } ]
};
