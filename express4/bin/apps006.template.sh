#!/bin/bash

name="template"
log="/var/log/$name/startup.log"

export CONF=conf/apps006.$name.conf.js
export NODE_PATH=/usr/astra/node/lib/node_modules/:.
cd ../

su svc_$name -c "/usr/astra/node/bin/forever --pidFile /var/log/$name/$name.pid -a -p /var/log/$name/ -l $log -o $log -e  -w --watchDirectory `pwd` --spinSleepTime 4000 --minUptime 1000 $1 server.js"
