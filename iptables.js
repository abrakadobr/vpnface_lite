const EventEmitter = require('events')

let log = require('./log')
let sjs = require('shelljs')
let ip  = require('ip')

class Iptables extends EventEmitter
{
  constructor(conf)
  {
    super()
    this._conf = conf
    this._ip = null
    this._dev = null
  }

  dev(mip)
  {
    return new Promise((acc)=>{
      sjs.exec('ip -4 -o address',{
        silent: true,
        async: true
      },(code,out,err)=>{
        let lines = out.split('\n')
        let dev = ''
        for(let i=0;i<lines.length;i++)
        {
          let l=lines[i]
          if (!l.includes(mip))
            continue
          let rx = /^\d{1,2}:\s+([a-z0-9]+)\s.*$/
          dev = rx.exec(l)[i]
          break
        }
        acc(dev)
      })
    })
  }

  async install()
  {
    log.log('IPTABLES','установка сетевого файрола')
    this.clear()
    log.log('IPTABLES','настраиваем ядро net.ipv4.ip_forward=1')
    sjs.exec('echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf')
    log.log('IPTABLES','отключаем ip6')
    sjs.exec('echo "net.ipv6.conf.all.disable_ipv6=1 >> /etc/sysctl.conf')
    sjs.exec('echo "net.ipv6.conf.default.disable_ipv6=1 >> /etc/sysctl.conf')
    sjs.exec('echo "net.ipv6.conf.lo.disable_ipv6=1 >> /etc/sysctl.conf')
    sjs.exec('sysctl -p')
    log.success('IPTABLES','файрвол готов к системной установке')
    return null
  }

  async start()
  {
    return null
  }

  async installRules()
  {
    log.log('IPTABLES','устанавливаем правила')
    sjs.exec('iptables -A INPUT -i lo -j ACCEPT')
    sjs.exec('iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT')

    sjs.exec('iptables -A INPUT -p udp --dport 1194 -j ACCEPT')
    sjs.exec('iptables -A INPUT -p udp --dport 1195 -j ACCEPT')
    sjs.exec('iptables -A INPUT -p udp --dport 1196 -j ACCEPT')

    sjs.exec('iptables -A INPUT -s 10.1.0.0/24 -j ACCEPT')
    sjs.exec('iptables -A INPUT -s 10.2.0.0/24 -d 10.2.0.1 -j ACCEPT')
    sjs.exec('iptables -A INPUT -s 10.3.0.0/24 -d 10.3.0.1 -j ACCEPT')

    sjs.exec('iptables -t nat -A POSTROUTING -s 10.3.0.0/24 -o '+this._dev+' -j MASQUERADE')

    sjs.exec('iptables -t nat -A PREROUTING -i tun1 -p udp --dport 53 -j REDIRECT --to-ports 5300')
    sjs.exec('iptables -t nat -A PREROUTING -i tun1 -p tcp --syn -j REDIRECT --to-ports 9040')

    sjs.exec('iptables -A INPUT -j DROP')
    sjs.exec('iptables-save > /etc/iptables/rules.v4')

    log.log('правила установлены')
  }

  clear()
  {
    log.log('сброс файрвола')
    sjs.exec('iptables -P INPUT ACCEPT')
    sjs.exec('iptables -P FORWARD ACCEPT')
    sjs.exec('iptables -P OUTPUT ACCEPT')
    sjs.exec('iptables -t nat -F')
    sjs.exec('iptables -t mangle -F')
    sjs.exec('iptables -t nat -X')
    sjs.exec('iptables -t mangle -X')
    sjs.exec('iptables -F')
    sjs.exec('iptables -X')
    sjs.exec('iptables-save > /etc/iptables/rules.v4')
    log.success('файрвол очищен')
    return null
  }

}

module.exports = Iptables
