#!/bin/bash

# clear environment and install packages
sudo apt-get install libkrb5-dev
cd ../
sudo rm -rf node_modules
sudo npm install

# start server
node bin/start
