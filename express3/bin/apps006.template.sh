#!/bin/bash

export CONF=conf/apps006.template.conf.js
export NODE_PATH=/usr/astra/node/lib/node_modules/:.
cd /usr/t2t/template

su svc_template -c "/usr/astra/node/bin/forever --pidFile /var/log/template/template.pid -a -p /var/log/template/ -l /var/log/template/startup.log -o /var/log/temaplate/startup.log -e /var/log/template/startup.log -w --watchDirectory `pwd` --spinSleepTime 4000 --minUptime 1000 $1 server.js"
