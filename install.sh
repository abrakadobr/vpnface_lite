#!/bin/bash

apt-get update
apt-get upgrade -y
apt-get install -y openvpn easy-rsa git tor nginx iptables-persistent
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

VFL_DIR=/opt/vpnface_lite
VFL_GIT=https://github.com/abrakadobr/vpnface_lite

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install 10
nvm use 10

ln -s `which node` /usr/sbin/

npm i -g forever
npm i -g forever-service

#git clone to vpnMaster
git clone $VFL_GIT $VFL_DIR
#chown -R www-data:www-data $VFL_DIR/compiled_docs

cd $VFL_DIR && npm i
cd $VFL_DIR && forever-service install vpnface_lite --script server.js --start

chown -R www-data:www-data $VFL_DIR/cdocs/*


echo "Для продолжения установки, перейдите по адресу http://SE.RV.ER.IP:8808"
echo "Это окно можно закрыть =)"
