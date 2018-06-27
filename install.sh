#!/bin/bash

#installation path
#this is not data path. data path configured with conf.js
VFL_DIR=/opt/vpnface_lite
VFL_GIT=https://github.com/abrakadobr/vpnface_lite

#install updates and packages
apt-get update
apt-get upgrade -y
apt-get install -y lsb-release easy-rsa git tor nginx iptables-persistent
# openvpn: install stable version from official repo
wget -O - https://swupdate.openvpn.net/repos/repo-public.gpg|apt-key add -
echo "deb http://build.openvpn.net/debian/openvpn/stable $(lsb_release -sc) main" > /etc/apt/sources.list.d/openvpn-aptrepo.list
apt-get update
apt-get install -y openvpn
#and create logs folder
mkdir -p /var/log/openvpn

#installation node version manager and node 10
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install 10
nvm use 10

#linking node to system path
ln -s `which node` /usr/sbin/

#install forever packages
npm i -g forever
npm i -g forever-service

#git clone to installation path
#comment cloning, if you installing with config file configuration
git clone $VFL_GIT $VFL_DIR
#and don't forget to use release, not master =)
cd $VFL_DIR && git checkout release

#installing deps
cd $VFL_DIR && npm i
#starting as service
cd $VFL_DIR && forever-service install vpnface_lite --script server.js --start

#preparing compiled docs for nginx owning
chown -R www-data:www-data $VFL_DIR/cdocs/*


echo "Для продолжения установки, перейдите по адресу http://SE.RV.ER.IP:8808"
echo "Это окно можно закрыть =)"
