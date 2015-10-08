#!bin/bash

echo "Copy a ssh private key to server for access linkedin helper's Bitbucket"
echo "Private key: ~/src/linkedin-helper/deploy/id_rsa"
echo "Copy to: ~/.ssh"

# Add new key to directory
# How to run script:
# ./add-private-key.sh [server_IP]
sudo scp -i ~/.ssh/id_rsa ./id_rsa root@$1:~/.ssh
