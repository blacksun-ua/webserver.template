#!/bin/bash

export CONF=conf/dev/blacksun.local.template.conf.js
export NODE_PATH=/usr/astra/node/lib/node_modules/:.
export NODE_ENV=development
export DEBUG='express:* node server.js'
cd ../

/usr/astra/node/bin/forever -w --watchDirectory `pwd` --spinSleepTime 4000 --minUptime 1000 $1 server.js
