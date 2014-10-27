#!/bin/bash

cd /isdev/GitHub/webserver.template/express4/app

export CONF=../conf/dev/blacksun.local.conf.js
export NODE_PATH=/usr/astra/node/lib/node_modules/:.
export DEBUG="express:* node server.js"
echo `pwd`
/usr/astra/node/bin/forever -w --watchDirectory `pwd` --spinSleepTime 4000 --minUptime 1000 $1 server.js
