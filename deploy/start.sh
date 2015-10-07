#!/bin/bash

# clear environment and install packages
cd ../
sudo rm -rf node_modules
sudo npm install

# start server
node bin/start
