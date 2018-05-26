Технические детали
==================

.. _tch_main:

Общая информация
----------------

VPNFace Lite не использует никаких специальных баз данных, не занимается синхронизацией с центрами сертификтов, и хранит все данные в двух json файлах.

Во время :ref:`def_install`, доставляются и конфигурируются необходимые пакеты из официальных репозиториев, после установки VPNFace Lite отвечает только за управление ключами vpn серверов. 

.. _vpn_intranets:

VPN подсети
-----------

По умолчанию VPNFace Lite создаёт три OpenVPN сервера со следующими сетвыми настройками:

==========  ============  ==========  ==============
VPN         Подсеть       Интерфейс   Адрес сервера
==========  ============  ==========  ==============
Админ VPN   10.1.0.0/24   tun0        10.1.0.1
Dark VPN    10.2.0.0/24   tun1        10.2.0.1
Inet VPN    10.3.0.0/24   tun2        10.3.0.1
==========  ============  ==========  ==============

На уровне ``iptables`` при :ref:`def_install` сети настраиваются следующим образом:

Админ VPN: Полный доступ к серверу по адресу 10.1.0.1, отсутсвие интернета.

Dark VPN: DNS запросы перенаправляются на TorDNS на порту 5300, весь tcp трафик перенаправляется в тор на порту 9040, остальной udp трафик никуда не уходит.

Inet VPN: В качестве DNS серверов используются Google DNS 8.8.8.8, и 8.8.4.4. Весь сетевой трафик через NAT отправляется в интернет.

.. _config_tor:

Конфигурация TOR
----------------

По умолчанию TOR настраивается по следующей конфигурации:

``vpnface_lite/tpl/tor.conf``

 | DataDirectory /var/lib/tor
 | 
 | VirtualAddrNetworkIPv4 12.0.0.0/16
 | AutomapHostsOnResolve 1
 | TransPort 10.2.0.1:9040
 | DNSPort 10.2.0.1:5300
 | 
 | StrictNodes 1
 | ExcludeExitNodes "{AF},{AL},{DZ},{AI},{BH},{BY},{BT},{BW},{BR},{KH},{CF},{TD},{CL},{CN},{MO},{CG},{CD},{DJ},{EG},{ET},{GA},{GM},{GH},{IR},{IQ},{JO},{KZ},{KE},{KI},{KP},{KW},{KG},{LR},{LY},{MY},{MZ},{NA},{NR},{NI},{NE},{NG},{OM},{PK},{PS},{QA},{RU},{RW},{SA},{SN},{SO},{ZA},{SS},{SD},{SY},{TJ},{TZ},{TH},{TL},{TG},{TK},{TO},{TT},{TN},{TR},{TV},{UG},{UA},{UZ},{VE},{VN},{YE},{ZM},{ZW},{NP},{IN},{LK}"

.. _config_nginx:

Конфигурация NGINX
------------------

По умолчанию NGINX настраивается по следующей конфигурации:

``vpnface_lite/tpl/nginx.conf``

 | #панель управления
 | server {
 | 	 listen 10.1.0.1:80;
 |   access_log   /var/log/nginx/vpnface_lite.proxy.log;
 |   location / {
 |     proxy_pass      http://127.0.0.1:8808;
 |   }
 | }
 | #документация
 | server {
 | 	 listen 10.1.0.1:81;
 |   access_log   /var/log/nginx/vpnface_lite.docs.log;
 |   root /opt/vpnface_lite/cdocs;
 |   index index.html;
 |   
 |   location / {
 |     default_type "text/html";
 |     try_files $uri.html $uri $uri/ /index.html;
 |   }
 | }

.. _data_dir:

Директория данных
-----------------

По умолчанию VPNFace Lite хранит данные в папке ``/opt/vpnface_ca``. Для каждого сервера с кодом <S> создаются две директории: ``<S>_ca`` и ``<S>_cli``. Так же в этой директории хранятся файлы ``ip.json`` и ``servers.js``.

Значения <S> при :ref:`def_install`

==========  ========
VPN         <S>
==========  ========
Админ VPN   adm
Dark VPN    darknet
Inet VPN    inet
==========  ========

.. _ca_dir:

Центр ключей <S>_ca
~~~~~~~~~~~~~~~~~~~

Директория создаётся коммандой ``make-cadir DIR`` из пакета ``easy-rsa`` и дополняется следующими скриптами:

``build-crl`` из шаблона ``vpnface_lite/tpl/build-crl.sh`` для генерации файла блокировок.

 | #!/bin/sh
 | 
 | # revoke a certificate, regenerate CRL,
 | # and verify revocation
 | 
 | if [ -z "$KEY_DIR" ]; then
 |   echo 'Please source the vars script first (i.e. "source ./vars")'
 |   exit 1
 | fi
 | 
 | CRL="crl.pem"
 | 
 | cd "$KEY_DIR"
 | # set defaults
 | export KEY_CN=""
 | export KEY_OU=""
 | export KEY_NAME=""
 | # required due to hack in openssl.cnf that supports Subject Alternative Names
 | export KEY_ALTNAMES=""
 | # generate a new CRL -- try to be compatible with
 | # intermediate PKIs
 | $OPENSSL ca -gencrl -out "$CRL" -config "$KEY_CONFIG"

``revoke-key`` из шаблона ``vpnface_lite/tpl/revoke-key.sh`` с заменой ключа #MPORT на менеджмент порт openvpn сервера для блокировки пользователя.

 | #!/bin/bash
 | 
 | if [ $# -ne 1 ]; then
 |   echo "usage: voke-key <cert-name-base>";
 |   exit 1
 | fi
 | if [ -z "$KEY_DIR" ]; then
 |   echo 'Please source the vars script first (i.e. "source ./vars")'
 |   exit 1
 | fi
 | 
 | KEYS_INDEX=$KEY_DIR/index.txt
 | LINE=`grep "/CN=$1/" $KEYS_INDEX`
 | COLS_NUM=`echo $LINE | awk -F' ' '{print NF;}'`
 | 
 | echo $COLS_NUM
 | 
 | if [[ $COLS_NUM -eq 5 ]] && [[ $LINE == V* ]]; then
 | 
 |   ./revoke-full $1
 |   {
 |     sleep 3
 |     echo kill $1
 |     sleep 3
 |     echo exit
 |   } | telnet localhost #MPORT
 |   echo "Certificate revoked successfully."
 |   exit 0;
 | elif [[ $COLS_NUM -eq 6 ]] && [[ $LINE == R* ]]; then
 |   echo "Client certificate is already revoked."
 |   exit 0;
 | else
 |   echo "Error; Key index file may be corrupted."
 |   exit 1;
 | fi

 и ``voke-key`` с шаблона ``vpnface_lite/tpl/voke-key.sh`` для разблокирования пользовательского ключа

 | #!/bin/bash
 | 
 | if [ $# -ne 1 ]; then
 |   echo "usage: voke-key <cert-name-base>";
 |   exit 1
 | fi
 | if [ -z "$KEY_DIR" ]; then
 |   echo 'Please source the vars script first (i.e. "source ./vars")'
 |   exit 1
 | fi
 | 
 | KEYS_INDEX=$KEY_DIR/index.txt
 | NLINE=`grep -n "/CN=$1/" $KEYS_INDEX`
 | LINE=`grep "/CN=$1/" $KEYS_INDEX`
 | LINE_NUM=`echo $NLINE | cut -f1 -d:`
 | COLS_NUM=`echo $LINE | awk -F' ' '{print NF;}'`
 | 
 | echo $COLS_NUM
 | 
 | if [[ $COLS_NUM -eq 6 ]] && [[ $LINE == R* ]]; then
 |   COL2=`echo $NLINE | awk '{print $2}'`
 |   COL4=`echo $NLINE | awk '{print $4}'`
 |   COL5=`echo $NLINE | awk '{print $5}'`
 |   COL6=`echo $NLINE | awk '{print $6}'`
 |   echo -e "V\t$COL2\t\t$COL4\t$COL5\t$COL6" >> $KEYS_INDEX
 |   sed -i "${LINE_NUM}d" $KEYS_INDEX
 |   ./build-crl
 |   echo "Certificate unrevoked successfully."
 |   exit 0;
 | elif [[ $COLS_NUM -eq 5 ]] && [[ $LINE == V* ]]; then
 |   echo "Certificate is already unrevoked and active"
 |   exit 0;
 | else
 |   echo "Error; Key index file may be corrupted."
 |   exit 1;
 | fi

так же, при автоматическом создании серверов в файле ``<S>_ca/vars`` производятся настройки данных сертификата.

все ключи и файлы криптографии сохраняются в директории ``<S>_ca/keys``.

.. _cli_dir:

OVPN генератор <S>_cli
~~~~~~~~~~~~~~~~~~~~~~

Директория содержит базовый клиентский конфиг сервера, и скрипт для генерации ovpn файлов. Так же тут нахдится директория ``files`` в которую помещаются сгенерированные клиентские ovpn файлы.

``cli.conf`` - шаблон клиентского конфига, при :ref:`def_install` генерируется при создании серверов, с заменой ключей необходимыми данными из шаблона ``vpnface_lite/tpl/cli.conf``

 | client
 | dev tun
 | proto #PROTO
 | remote #REMOTE #PORT
 | #GW
 | nobind
 | user nobody
 | group nogroup
 | persist-key
 | persist-tun
 | remote-cert-tls server
 | key-direction 1
 | cipher AES-256-CBC
 | auth SHA256
 | verb 3

таблица ключей

=======   ====================  ==========  ========= =========
ключ      значение              Admin VPN   Dark VPN  Inet VPN
=======   ====================  ==========  ========= =========
#PROTO    протокол tcp/udp      udp         udp       udp
#REMOTE   интернет ip сервера   server_ip   server_ip server_ip
#PORT     порт openvpn сервера  1194        1195      1196
#GW       параметры DNS/route   ---         TOR DNS   GoogleDNS
=======   ====================  ==========  ========= =========

``cli.sh`` - баш скрипт генерации ovpn файла, из шаблона ``vpnface_lite/tpl/cli.sh``

 | #!/bin/bash
 | 
 | #KEY_DIR
 | #OUTPUT_DIR
 | #BASE_CONFIG
 | 
 | cat ${BASE_CONFIG} \
 |     <(echo -e '<ca>') \
 |     ${KEY_DIR}/ca.crt \
 |     <(echo -e '</ca>\n<cert>') \
 |     ${KEY_DIR}/${1}.crt \
 |     <(echo -e '</cert>\n<key>') \
 |     ${KEY_DIR}/${1}.key \
 |     <(echo -e '</key>\n<tls-auth>') \
 |     ${KEY_DIR}/ta.key \
 |     <(echo -e '</tls-auth>') \
 |     > ${OUTPUT_DIR}/${1}.ovpn

таблица ключей

============= ====================================================
ключ          значение
============= ====================================================
#KEY_DIR      директория <S>_ca/keys - источник ключей
#OUTPUT_DIR   дирекория <S>_cli/files - выходные ovpn
#BASE_CONFIG  файл <S>_cli/cli.conf - шаблон клиентского конфига
============= ====================================================

.. _config_ip:

Сетевые настройки ip.json
~~~~~~~~~~~~~~~~~~~~~~~~~

 | {
 |   "ip": "интернет ip адрес сервера", 
 |   "dev": "интернет сетевой интерфейс, например eth0"
 | }

.. _config_servers:

База данных servers.json
~~~~~~~~~~~~~~~~~~~~~~~~

Файл содержит базу данных серверов и клиентов, на которую опирается VPNFace Lite. Если вы производите ручную установку для уже имеющихся серверов (:ref:`man_install`), вам требуется при установке сформировать этот файл вручную по следующему формату:

В качестве примера используется сервер S1 с подсетью 10.1.0.1/24, и содержит полный пример конфига, а сервер S2 настроен в минимальном для работы режиме, для примера установки на уже имеющийся сервер, с подготовленной вручную структурой файлов и директорий.

Поля, помеченые \* используются только во время создания сервера

 | {
 |   "S1": {
 |     "code": "S1",
 |     "name": "Имя сервера для панели управления",
 |     "desc": "Описание для панели управления",
 |     "logs": true/false, //\* ведёт ли сервер логи
 |     "friends": true/false,  //\* видят ли клиенты друг-друга
 |     "maxclients": 100,  //\* максимальное количество соединений
 |     "type": "root", //тип сервера
 |     "network": {
 |       "host": "0.0.0.0",  //\* на каком хосте запускать openvpn сервер
 |       "remote": "интернет ip сервера", //\*
 |       "intranet": "10.1.0.0/24",  //\* vpn подсеть
 |       "port": 1194, //\* на каком порту vpn сервер ожидает клиентов
 |       "mport": 2294, //\* порт управления vpn сервером
 |       "proto": "udp", //\* протокол соединения
 |       "dev": "tun0", //сетевой интерфейс vpn сервера на сервере
 |     },
 |     "cert": { //\* параметры сертификата для файла S1_ca/vars
 |       "country": "US",
 |       "province": "CA",
 |       "city": "City",
 |       "org": "Organisation",
 |       "email": "email@domain.zone",
 |       "ou": "Organization Unit"
 |     },
 |     "intranet": { //\* сетевые данные vpn подсети, генерируются при создании
 |       "networkAddress": "10.1.0.0",
 |       "firstAddress": "10.1.0.1",
 |       "lastAddress": "10.1.0.254",
 |       "broadcastAddress": "10.1.0.255",
 |       "subnetMask": "255.255.255.0",
 |       "subnetMaskLength": 24,
 |       "numHosts": 254,
 |       "length": 256
 |     },
 |     "clients": [  // массив клиентов.
 |       {
 |         "code": "client1_code", // код ключа
 |         "blocked": true/false, // состояние блокировки
 |         "server": "S1" // код сервера, для удобства
 |       },{
 |         "code": "client2_code", // код ключа
 |         "blocked": true/false, // состояние блокировки
 |         "server": "S1" // код сервера, для удобства
 |       }
 |     ]
 |   },
 |   "S2": {
 |     "code": "S2",
 |     "name": "Имя сервера для панели управления",
 |     "desc": "Описание для панели управления",
 |     "maxclients": 100,  //\* максимальное количество соединений, отображается в панели
 |     "type": "public", //тип сервера
 |     "clients": [  // массив клиентов.
 |       {
 |         "code": "client1_code", // код ключа
 |         "blocked": true/false, // состояние блокировки
 |         "server": "S1" // код сервера, для удобства
 |       },{
 |         "code": "client2_code", // код ключа
 |         "blocked": true/false, // состояние блокировки
 |         "server": "S1" // код сервера, для удобства
 |       }
 |     ]
 |   },
 |   "<S3>": { ... }
 |   "<S4>": { ... }
 | }

.. _config_openvpn:
 
Серверная структура /etc/openvpn/
---------------------------------

В директории ``/etc/openvpn/`` хранятся конфигурации и ключи рабочих серверов. Для каждого сервера VPNFace Lite создаёт директорию ``<S>`` в которуй хранятся файлы ключей, криптографии и блокировок, и файл ``<S>.conf`` серверной конфигурации, который создаётся по шаблону ``vpnface_lite/tpl/server.conf``

 | #LOCAL
 | port #PORT
 | proto #PROTO
 | dev #DEV
 | ca #CA_CRT
 | cert #SERVER_CRT
 | key #SERVER_KEY
 | dh #DH_PEM
 | #INTRANET
 | ifconfig-pool-persist /var/log/openvpn/ipp-#SERVER.txt
 | #GW
 | #FRIENDS
 | keepalive 10 120
 | tls-auth #TA_KEY 0
 | key-direction 0
 | cipher AES-256-CBC
 | auth SHA256
 | crl-verify #SERVER_CRL
 | management 127.0.0.1 #MANAGEMENT_PORT
 | max-clients #MAX_CLIENTS
 | user nobody
 | group nogroup
 | persist-key
 | persist-tun
 | #LOG
 | verb 3
 | explicit-exit-notify 1


таблица ключей

================= =====================================================
ключ              значение
================= =====================================================
#LOCAL            значение <conf.network.host> если не 0.0.0.0
#PORT             порт клиентских соединений
#DEV              сетевой интерфейс
#CA_CRT           <S>/ca.crt
#SERVER_CRT       <S>/<S>.crt
#DH_PEM           <S>/dh2048.pem
#INTRANET         'server <conf.intranet.\*>'
#GW               push route/DNS в зависимости от <conf.type>
#FRIENDS          'client-to-client' если <conf.firends == true>
#SERVER_CRL       <S>/crl.pem
#MANAGEMENT_PORT  '127.0.0.1 <conf.network.mport>'
#MAX_CLIENTS      <conf.maxclients>
#LOG              log-status и log-append в зависимости от <conf.logs>
================= =====================================================

CONF.TYPE настройка
-------------------

Параметр ``type`` в конфигурации оказывает влияние на опции создания OpenVPN серверов и иконку в панели администрирования.

В будущем это будет оказывать влияние на настройки ``iptables`` но в версии Lite файрвол конфигурируется по предустановленым значениям, так что на iptables влияния нет.

Таблица возможных значений

========= =========== ============= ========= ===========================
значение  iptables    server.conf   cli.conf  иконка в панели 
========= =========== ============= ========= ===========================
public    в интернет  GoogleDNS     --        прозрачное облако
root      на сервер   --            no-push   перечёркнутое облако
dark      в тор       TOR DNS       --        облако в закрашеном круге
========= =========== ============= ========= ===========================

.. _config_conf:

Файл конфигурации conf.js
-------------------------

Файл располагается по пути ``vpnface_lite/conf.js`` и содержит настройки необходимые для постоянной работы, и установки в формате javascript.

В случае запуска VPNFace Lite на работающих серверах без встроенной установки (:ref:`pnl_install`), файл должен содержать два параметра: порт апи, и путь к директории данных.

По умолчанию файл так же содержит конфигурации сертификата и серверов для :ref:`def_install`. В режиме :ref:`hlf_install` этот файл можно отконфигурировать под требуемые значения.

Структура файла:

 | module.exports = {
 |   dir: '/opt/vpnface_ca',
 |   port: 8808,
 |   cert: CERT_CONFIG<Общий сертификат "по умолчанию">,
 |   servers: {
 |     adm: SERVER_CONFIG<Админ VPN>,
 |     inet: SERVER_CONFIG<Интернет VPN>,
 |     dark: SERVER_CONFIG<TOR VPN>,
 |   }
 | }

Полный пример можно посмотреть в файле по умолчанию

.. _service_info:

Сервис vpnface_lite
-------------------

VPNFace Lite по умолчанию устанавливается в виде системного сервиса с названием ``vpnface_lite`` пакетом ``forever_service``. Сервис ведёт логи в ``/var/log/vpnface_lite.log``

.. _iptables_info:

Iptables
--------

iptables - linux файрвол. При автоматической установке выполняется следующий набор комманд, для установки правил:

На старте установки:

 | iptables -P INPUT ACCEPT
 | iptables -P FORWARD ACCEPT
 | iptables -P OUTPUT ACCEPT
 | iptables -t nat -F
 | iptables -t mangle -F
 | iptables -t nat -X
 | iptables -t mangle -X
 | iptables -F
 | iptables -X
 | echo "net.ipv4.ip_forward=1" > /etc/sysctl.conf
 | echo "net.ipv6.conf.all.disable_ipv6 = 1" >> /etc/sysctl.conf
 | echo "net.ipv6.conf.default.disable_ipv6 = 1" >> /etc/sysctl.conf
 | echo "net.ipv6.conf.lo.disable_ipv6 = 1" >> /etc/sysctl.conf
 | sysctl -p

На завершении:

 | iptables -A INPUT -i lo -j ACCEPT
 | iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
 | 
 | iptables -A INPUT -p udp --dport 1194 -j ACCEPT
 | iptables -A INPUT -p udp --dport 1195 -j ACCEPT
 | iptables -A INPUT -p udp --dport 1196 -j ACCEPT
 | 
 | iptables -A INPUT -s 10.1.0.0/24 -j ACCEPT
 | iptables -A INPUT -s 10.2.0.0/24 -d 10.2.0.1 -j ACCEPT
 | iptables -A INPUT -s 10.3.0.0/24 -d 10.3.0.1 -j ACCEPT
 | 
 | iptables -t nat -A POSTROUTING -s 10.3.0.0/24 -o <IP.JSON:DEV> -j MASQUERADE
 | 
 | iptables -t nat -A PREROUTING -i tun1 -p udp --dport 53 -j REDIRECT --to-ports 5300
 | iptables -t nat -A PREROUTING -i tun1 -p tcp --syn -j REDIRECT --to-ports 9040
 | 
 | iptables -A INPUT -j DROP

Обратите внимание, на опции, устанавливаемые в ``/etc/sysctl.conf``

 | net.ipv4.ip_forward = 1
 | net.ipv6.conf.all.disable_ipv6 = 1
 | net.ipv6.conf.default.disable_ipv6 = 1
 | net.ipv6.conf.lo.disable_ipv6 = 1

для возможности роутинга трафика и отключения ip v6.

.. _nodejs_info:

NodeJS
------

Для установки nodejs v10 используется ``node version manager`` https://github.com/creationix/nvm 

После установки скприт ``install.sh`` создаёт линк на 10 версию ноды в общесистемный путь 

``ln -s `whitch node` /usr/sbin``
