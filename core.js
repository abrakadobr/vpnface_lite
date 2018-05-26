const EventEmitter = require('events')
const fs = require('fs')
const conf = require('./conf')
const OpenVPN = require('./openvpn')
const Iptables = require('./iptables')
const crypto = require('crypto')

let express = require('express')
let log = require('./log')
let sjs = require('shelljs')
let ip  = require('ip')

class Core extends EventEmitter
{
  constructor()
  {
    super()
    this.dir = sjs.pwd()
    this._ip = null
    this._status = 'none'
    this._installing = false
    this._servers = {}

    this.openvpn = new OpenVPN()
    this.iptables = new Iptables()

    this.loadIP()
    this.loadServers()

    this.app = express()
    this.app.use(express.json())
    this.app.use(express.static('vpnface'))
    this.app.use(express.static('public'))
    this.app.set('jsonp callback name', 'cb')
    this.httpRoutes()
  }

  httpRoutes()
  {

    ////        LOGS BUFF
    this.app.get('/api/logs',(req,res)=>{
      res.json(log.buff())
    })

    ////        SET IP [POST!]
    this.app.get('/api/finilize',(req,res)=>{
      res.json({success:true}).end()
      if (this._installing)
        return
      this.finilizeInstall()
    })

    ////        SET IP [POST!]
    this.app.post('/api/confirmip',(req,res)=>{
      this._ip = req.body.ip
      res.json({success:true}).end()
      if (this._installing)
        return
      this._installing = true
      this.iptables.dev(this._ip).then((dev)=>{
        this._dev = dev
        this.saveIP()
        this.loadIP()
        this.installRequired().then(()=>{
          this._status = 'install1'
          this._installing = false
        })
      })
    })

    ////        PING [JSONP!]
    this.app.get('/api/ping',(req,res)=>{
      if (this._status != 'ready')
        this._status = 'install2'
      res.set({ 'Content-Type': 'application/javascript' })
      res.jsonp({ping:'pong'})
    })

    ////        OVPN KEY
    this.app.get('/api/ovpn/:key',(req,res)=>{
      let [cli,srv,... other] = req.params.key.split('@')
      if (!this.srvExists(srv))
        return res.json({err: 'Not found'})
      let cliEx = false
      this._servers[srv].clients.forEach((c)=>{
        if (c.code == cli)
          cliEx = true
      })
      if (!cliEx)
        return res.json({err: 'Not found'})
      //let ovpn = this.openvpn.ovpn(srv,cli)
      sjs.cd(conf.dir)
      res.download(`${srv}_cli/files/${cli}.ovpn`,`${cli}@${srv}.ovpn`)
    })

    ////        GEN CLI [POST]
    this.app.post('/api/gencli',(req,res)=>{
      this.genClient(req.body.srv,req.body.cli).then((key)=>{
        res.json(key)
      })
    })


    ////        LOCK CLI [POST]
    this.app.get('/api/lock/:key',(req,res)=>{
      let key = req.params.key
      log.test(`блокирую ключ ${key}`)
      this.lockClient(key).then((ret)=>{
        if (ret.success)
          log.success(`ключ ${key} заблокирован`)
        else
          log.error(`Ошибка! ${ret.err}`)
        res.json(ret)
      })
    })

    ////        UNLOCK CLI [POST]
    this.app.get('/api/unlock/:key',(req,res)=>{
      let key = req.params.key
      log.test(`разблокирую ключ ${key}`)
      this.unlockClient(key).then((ret)=>{
        if (ret.success)
          log.success(`ключ ${key} разблокирован`)
        else
          log.error(`Ошибка! ${ret.err}`)
        res.json(ret)
      })
    })


    ////        STATUS
    this.app.get('/api/status',(req,res)=>{
      res.json({status: this._status})
    })

    ////        VPN LIST
    this.app.get('/api/vpnlist',(req,res)=>{
      res.json(this._servers)
    })

    ////        VPN SERVER
    this.app.get('/api/server/:code',(req,res)=>{
      let srvCode = req.params.code

      res.json(this._servers[srvCode])
    })

    ////        AND FINAL WILD
    this.app.get('**',(req,res)=>{
      res.sendFile(this.dir+'/vpnface/index.html')
    })
    

  }

  async start()
  {
    log.test('Запускаем систему')
    this.app.listen(conf.port)
    let r = await this.openvpn.start()
    if (r)
      return r
    r = await this.iptables.start()
    if (r)
      return r
    log.success('запущено')
    this._status = 'start'
    if (!this._ip || !Object.keys(this._servers).length)
    {
      log.error('Не установлено!')
      this._status = 'install0'
      log.test('!!','Откройте адрес http://SE.RV.ER.IP:8808 для завершения установки.')
      //log.error('!!','Не закрывайте это окно!')
      return
    }
    if (this._servers.adm.clients.length == 1 && Object.keys(this._servers).length == 1)
    {
      log.error('Установка не завершена')
      this._status = 'install2'
      log.test('??','Подключите VPN и откройте адрес http://10.1.0.1:8808 для завершения установки.')
      //log.error('!!','Не закрывайте это окно!')
      return
    }
    if (this._status == 'start')
      this._status = 'ready'
  }

  async installRequired()
  {
    log.log('запускаем установку')

    this.openvpn.install()
    this.iptables.install()

    let serverAdm = conf.servers.adm
    if (!serverAdm.cert)
      serverAdm.cert = conf.cert
    serverAdm.network.remote = this._ip

    await this.createServer(serverAdm,true)
    await this.openvpn.startServer(serverAdm.code)

    log.success('первая часть установки завершена')
  }

  async installVPNs()
  {
    log.log('устанавливаем vpn сервера')

    let serverProxy = conf.servers.inet
    if (!serverProxy.cert)
      serverProxy.cert = conf.cert
    serverProxy.network.remote = this._ip

    await this.createServer(serverProxy,true)
    await this.openvpn.startServer(serverProxy.code)

    let serverDark = conf.servers.dark
    if (!serverDark.cert)
      serverDark.cert = conf.cert
    serverDark.network.remote = this._ip

    await this.createServer(serverDark,true)
    await this.openvpn.startServer(serverDark.code)

    log.success('vpn сервера установлены')
  }

  async finilizeInstall()
  {
    if (this._installing)
      return
    this._installing = true
    log.success('Стартуем завершение установки')
    await this.installVPNs()
    await this.installSoft()
    await this.iptables.installRules()
    this._status = 'ready'
    this._installing = false
  }

  async installSoft()
  {
    log.log('конфигурируем пакеты')
    sjs.cd(this.dir)
    let torConf = fs.readFileSync('./tpl/tor.conf')
    let nginxConf = fs.readFileSync('./tpl/nginx.conf')
    fs.writeFileSync('/etc/tor/torrc',torConf)
    fs.writeFileSync('/etc/nginx/sites-available/vpnface_lite.conf',nginxConf)
    sjs.exec('ln -s /etc/nginx/sites-available/vpnface_lite.conf /etc/nginx/sites-enabled/')
    sjs.exec('systemctl restart tor')
    sjs.exec('systemctl restart nginx')
    log.success('пакеты настроены')
  }

  srvExists(code)
  {
    return !(typeof this._servers[code] == 'undefined')
  }

  async createServer(srv,reinstall = false)
  {
    if (this.srvExists(srv.code))
      return null
    let r = await this.openvpn.createServer(srv,reinstall)
    if (r)
    {
      log.error(`Can't create server <${srv.code}>`)
      return r
    }
    srv.intranet = ip.cidrSubnet(srv.network.intranet)
    srv.clients = []
    this._servers[srv.code] = srv
    await this.saveServers()
  }

  async genClient(srv,cli)
  {
    if (!this.srvExists(srv))
      return {sucess:false,err:'SRV_NOT_EXISTS'}
    let ex = false
    this._servers[srv].clients.forEach((c)=>{
      if (c.code == cli)
        ex = true
    })
    if (ex)
      return {sucess:false,err:'CLI_EXISTS'}
    let r = await this.openvpn.genCli(srv,cli)
    if (r)
      return null
    let clio = {
      code: cli,
      blocked: false,
      server: srv
    }
    await this.openvpn.buildCRL({code:srv})
    this._servers[srv].clients.push(clio)
    this.saveServers()
    return cli
  }

  async lockClient(key)
  {
    let [cli,srvCode,...o] = key.split('@')
    if (!this.srvExists(srvCode))
      return {sucess:false,err:'SRV_NOT_EXISTS'}
    let ex = false
    this._servers[srvCode].clients.forEach((c)=>{
      if (c.code == cli)
        ex = true
    })
    if (!ex)
      return {sucess:false,err:'KEY_NOT_EXISTS'}
    /////    API LOCK
    let srv = this._servers[srvCode]
    await this.openvpn.revokeCli(srv,cli)
    //////
    for(let i=0;i<this._servers[srvCode].clients.length;i++)
    {
      if (this._servers[srvCode].clients[i].code == cli)
      {
        this._servers[srvCode].clients[i].blocked = true
        break
      }
    }
    this.saveServers()
    return {success:true}
  }

  async unlockClient(key=null)
  {
    if (!key)
      return {sucess:false,err:'KEY_NOT_EXISTS'}
    let [cli,srv,...o] = key.split('@')
    if (!this.srvExists(srv))
      return {sucess:false,err:'SRV_NOT_EXISTS'}
    let ex = false
    this._servers[srv].clients.forEach((c)=>{
      if (c.code == cli)
        ex = true
    })
    if (!ex)
      return {sucess:false,err:'KEY_NOT_EXISTS'}
    /////    API UNLOCK
    let srvo = this._servers[srv]
    await this.openvpn.vokeCli(srvo,cli)
    //////
    for(let i=0;i<this._servers[srv].clients.length;i++)
    {
      if (this._servers[srv].clients[i].code == cli)
      {
        this._servers[srv].clients[i].blocked = false
        break
      }
    }
    this.saveServers()
    return {success:true}
  }

  loadIP()
  {
    log.log('загружаем ip')
    sjs.cd(this.dir)
    let load = null
    if (sjs.test('-f',`${conf.dir}/ip.json`))
      load = JSON.parse(fs.readFileSync(`${conf.dir}/ip.json`))
    this.openvpn._ip = null
    this.openvpn._dev = null
    if (load)
    {
      this._ip = load.ip
      this._dev = load.dev
    }
    this.openvpn._ip = this._ip
    this.iptables._ip = this._ip
    this.openvpn._dev = this._dev
    this.iptables._dev = this._dev
    log.success('загружено')
  }

  loadServers()
  {
    log.log('загружаем сервера и клиентов')
    sjs.cd(this.dir)
    this._servers = {}
    if (sjs.test('-f',`${conf.dir}/servers.json`))
      this._servers = JSON.parse(fs.readFileSync(`${conf.dir}/servers.json`))
    log.success('загружено')
  }

  saveIP()
  {
    log.log('сохраняем ip')
    sjs.cd(this.dir)
    fs.writeFileSync(`${conf.dir}/ip.json`,JSON.stringify({ip:this._ip,dev:this._dev}))
    log.success('сохранено')
  }

  saveServers()
  {
    log.log('сохраняемся')
    sjs.cd(this.dir)
    fs.writeFileSync(`${conf.dir}/servers.json`,JSON.stringify(this._servers))
    log.success('сохранено')
  }
}

module.exports = Core
