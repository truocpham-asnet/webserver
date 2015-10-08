#!/bin/bash
#
# Setup firewall for Ubuntu server

# Install iptables-persistent for saving iptables config
sudo apt-get install iptables-persistent

sudo iptables -P INPUT ACCEPT
sudo iptables -P OUTPUT ACCEPT

# Flush all current rules from iptables
sudo iptables -F

# ------------------------------------------------------------------------------
# Allow SSH connections on tcp port 22
sudo iptables -I INPUT 1 -p tcp --dport 22 -j ACCEPT

# Allow HTTP, HTTPS traffic on port 80, 443
sudo iptables -I INPUT 2 -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 3 -p tcp --dport 443 -j ACCEPT

# Allow access from AsNet IPs and servers's IP
# Access to MongoDB server -----------------------------------------------------
sudo iptables -A INPUT -p tcp --dport 27017:27018 -s 117.3.103.203,27.72.0.46,10.132.61.173,10.130.95.78,10.132.104.219,10.132.102.205,10.132.126.113,10.132.68.222,10.132.238.122,10.132.108.242 -j ACCEPT

# Access to Elasticsearch server------------------------------------------------
sudo iptables -A INPUT -p tcp --dport 9200:9400 -s 117.3.103.203,27.72.0.46,10.132.61.173,10.130.95.78,10.132.104.219,10.132.102.205,10.132.126.113,10.132.68.222,10.132.238.122,10.132.108.242 -j ACCEPT

# Allow access from localhost loopback
sudo iptables -A INPUT -i lo -j ACCEPT

# ------------------------------------------------------------------------------
# Reject all IPs access all unuse ports
sudo iptables -A INPUT -p tcp --dport 1:21 -j REJECT
sudo iptables -A INPUT -p tcp --dport 23:79 -j REJECT
sudo iptables -A INPUT -p tcp --dport 81:442 -j REJECT
sudo iptables -A INPUT -p tcp --dport 444:27016 -j REJECT

sudo iptables -A INPUT -p udp --dport 22 -j REJECT
sudo iptables -A INPUT -p udp --dport 80 -j REJECT
sudo iptables -A INPUT -p udp --dport 443 -j REJECT

# Save firewall config
sudo invoke-rc.d iptables-persistent save

sudo iptables -L -v
