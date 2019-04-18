
CHANGELOG
---------

Version code
============

<major>/<minor>/<patch>

major increases on core updates
minor - on features
patch - on every release, reseting on major increase

current master
==============

+ fast fix for OpenVPN 2.4 and EasyRSA 3.0.4 for ubuntu 18.04 and 18.10

v1.1.4
======

+ full installation from conf.js with correct network configuration
  use npm<ip> packet for networks calculation
  iptables now configured using this calculation, and <dev> option from conf

  полноценная сетевая настройка и конфигурация из conf.js
  используется пакет npm<ip> для калькуляции сетевых адресов из указанного в конфигрурации
  iptables теперь конфигурируются так же с учетом этих параметров, и параметра dev

+ installation script now use release branch, as it should be, really

  скрип установки теперь использует release ветку, как, в принципе, и должно быть
