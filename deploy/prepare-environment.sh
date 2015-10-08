#!/bin/bash

echo "#########################################################################"
echo '### Updating system ...'
echo "#########################################################################"
sudo apt-get clean
export LC_ALL="en_US.UTF-8"
sudo apt-get update -y
sudo apt-get -y install git-core python g++ make checkinstall zlib1g-dev zip curl

echo "#########################################################################"
echo "### Install git ..."
echo "#########################################################################"
sudo apt-get install git -y

echo "#########################################################################"
echo "### Install NodeJS v0.10 ..."
echo "https://github.com/nodejs/node-v0.x-archive/wiki/Installing-Node.js-via-package-manager"
echo "#########################################################################"

curl --silent --location https://deb.nodesource.com/setup_0.10 | sudo bash -
sudo apt-get install nodejs -y

echo "#########################################################################"
echo "### Install `forever` ..."
echo "#########################################################################"
sudo npm install -g forever

echo "#########################################################################"
echo "### Install ruby ..."
echo "#########################################################################"
sudo apt-get install ruby-full -y

sudo apt-get install unzip
sudo apt-get install zip

echo "Install iptables-persistent for saving firewall config"
sudo apt-get update
sudo apt-get install iptables-persistent

echo "clear environment and install packages"
sudo apt-get install libkrb5-dev
cd ../
sudo rm -rf node_modules
sudo npm install
