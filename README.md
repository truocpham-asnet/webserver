# webserver
This is simple web server.

### Main core

* The server is outside USA.
* Resolved cannot get linkedin id from LinkedIn page based on LinkedIn url.

### API

* Get linkedin id
```
/api/linkedin-scraped/get-linkedin-id?url=[the_url_need_scraped]
```
> **url** param: linkedin url

### Add SSH private to access linkedin-helper on Bitbucket

* Create shell script to add private key if not accessable

```
sudo nano add-private-key.sh
```

* **Copy** this content at below at **paste** into file just created above

```
#!bin/bash

echo "Copy a ssh private key to server for access linkedin helper's Bitbucket"
echo "Private key: ~/src/linkedin-helper/deploy/id_rsa"
echo "Copy to: ~/.ssh"

# Add new key to directory
# How to run script:
# ./add-private-key.sh [server_IP]
sudo scp -i ~/.ssh/id_rsa ./id_rsa root@$1:~/.ssh
```

* Execute script just created above

```
./add-private-key.sh [Server-IP]
```

### Clone code

* Login to server
    - `ssh root@[server_IP]`
* Install git
    - `sudo apt-get install git -y`
* Clone code into ~/src
    - `git cloneg git@bitbucket.org:truocpk/linkedin-helper.git`

### How to run

* Install environment & needed packages

```
cd ~/src/linkedin-helper/deploy/
chmod +x prepare-environment.sh
./prepare-environment.sh
```

* Create config file named `backend/config/local.json`
    * Becareful when create config file.
    * [Template](https://docs.google.com/document/d/1ebA-snMSEDv-y-uPi61LUWkL3XLzkbuWJFv3McfcWRA/edit)

* Run script to start/restart server

```
cd src/linkedin-helper/deploy
./start-server.sh
```
    
### Set firewall
* public: 80, 443, 22 (public to all ip)
* elasticsearch: 9200, 9400 (open to AsNet ip & all servers ip)
* mongodb: 27017, 27018 (open to AsNet ip & all servers ip)
* restricted rules: block all other ports

Run script:

```
cd ~src/bryony/deploy
./set-firewall.sh
```
