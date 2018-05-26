#!/bin/bash

#script removes VPNFace Lite from sysem, usin default installation naming
#edit it, if required

iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X
iptables -F
iptables -X

systemctl stop openvpn@adm
systemctl disable openvpn@adm
systemctl stop openvpn@inet
systemctl disable openvpn@inet
systemctl stop openvpn@darknet
systemctl disable openvpn@darknet

rm /etc/nginx/sites-enabled/vpnface_lite.conf
rm /etc/nginx/sites-available/vpnface_lite.conf
systemctl restart nginx

source ~/.bashrc
nvm use 10
forever-service delete vpnface_lite
rm -f /usr/sbin/node

rm -rf /etc/openvpn/adm*
rm -rf /etc/openvpn/inet*
rm -rf /etc/openvpn/darknet*
#keep clients data
#rm -rf /opt/vpnface*
rm -rf ~/.npm
rm -rf ~/.nvm
rm -rf ~/.forever
head -n -4 ~/.bashrc > ~/.bashrc
