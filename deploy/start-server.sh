#!/bin/bash

echo "### Stop server ..."
sudo forever stop /root/src/linkedin-helper/bin/start

echo "### Save old logs ..."
OLDLOG="$(date +'%Y%m%d-%H:%M:%S%Z.log')"
sudo mv /mnt/server.log /mnt/logs/$OLDLOG

echo "### Start server ..."
sudo forever -o /mnt/server.log start ~/src/linkedin-helper/bin/start

echo "### Done. Server is started ..."
