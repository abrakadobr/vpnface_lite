#!/bin/bash

#installation path
#this is not data path. data path configured with conf.js
VFL_DIR=/opt/vpnface_lite
VFL_GIT=https://github.com/abrakadobr/vpnface_lite

#install updates and packages
apt-get update
apt-get upgrade -y
apt-get install -y lsb-release git tor nginx iptables-persistent openvpn
# openvpn: install stable version from official repo
#wget -O - https://swupdate.openvpn.net/repos/repo-public.gpg|apt-key add -
#echo "deb http://build.openvpn.net/debian/openvpn/release/2.4 xenial main" > /etc/apt/sources.list.d/openvpn-aptrepo.list
#apt-get update
#apt-get install -y openvpn easy-rsa

#fast fix for openvpn2.4 and easyrsa3
#get latest easy-rsa manually
wget -P /opt/ https://github.com/OpenVPN/easy-rsa/releases/download/v3.0.4/EasyRSA-3.0.4.tgz
cd /opt/ && tar xvf EasyRSA-3.0.4.tgz
mkdir /usr/share/easy-rsa
cp -r /opt/EasyRSA-3.0.4/* /usr/share/easy-rsa/

#and create logs folder
mkdir -p /var/log/openvpn

# AFTER INSTALL
#
#
#installation node version manager and node 10
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

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
#currently - master...
#cd $VFL_DIR && git checkout release

#installing deps
cd $VFL_DIR && npm i
#starting as service
cd $VFL_DIR && forever-service install vpnface_lite --script server.js --start

#preparing compiled docs for nginx owning
chown -R www-data:www-data $VFL_DIR/cdocs/*


echo "Для продолжения установки, перейдите по адресу http://SE.RV.ER.IP:8808"
echo "Это окно можно закрыть =)"
