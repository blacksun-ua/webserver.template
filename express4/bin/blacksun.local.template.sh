#!/bin/bash

name="template"

export CONF=conf/dev/blacksun.local.$name.conf.js
export NODE_PATH=/usr/astra/node/lib/node_modules/:.
export DEBUG='express*: node server.js'
cd ../

/usr/astra/node/bin/forever -w --watchDirectory `pwd` --spinSleepTime 4000 --minUptime 1000 $1 server.js