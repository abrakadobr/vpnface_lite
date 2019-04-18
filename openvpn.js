const EventEmitter = require('events')
const fs = require('fs')
const conf = require('./conf')

let log = require('./log')
let sjs = require('shelljs')
let ip  = require('ip')

const OVPN = require('./openvpn2')

class OpenVPN extends EventEmitter
{
  constructor()
  {
    super()
    this.dir = sjs.pwd()
    this._ip = ''
    if (!sjs.test('-d',conf.dir))
      sjs.mkdir(conf.dir)
    this._ovpn = new OVPN(conf.dir)
  }

  async start()
  {
    log.success('Модуль OpenVPN запущен')
    return null
  }

  async install()
  {
    return true
  }

  async createServer(srv,reinstall=false)
  {
    await this._ovpn.createServer(srv)
  }


  async destroyServer(code)
  {
    log.log(`удаляем сервер <${code}>`)
    sjs.exec(`systemctl stop openvpn@${code}`)
    sjs.exec(`systemctl disable openvpn@${code}`)
    sjs.rm('-rf',`/etc/openvpn/${code}*`)
    sjs.cd(conf.dir)
    sjs.rm('-rf',`./${code}_*`)
    log.success(`сервер <${code}> удалён`)
  }

  async startServer(code)
  {
    log.log(`запускаем сервер <${code}>`)
    sjs.exec(`systemctl start openvpn@${code}`)
  }

  async stopServer(code)
  {
    log.log(`останавливаем сервер <${code}>`)
    sjs.exec(`systemctl stop openvpn@${code}`)
  }

  async restartServer(code)
  {
    await this.stopServer(code)
    await this.startServer(code)
  }

  async genCli(srv,cli)
  {
    await this._ovpn.createClient(srv,cli)
    return null
  }

  async revokeCli(srv,cli)
  {
    await this._ovpn.dropClient(srv,cli)
  }

}

module.exports = OpenVPN
