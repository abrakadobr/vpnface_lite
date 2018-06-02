const EventEmitter = require('events')
const fs = require('fs')
const conf = require('./conf')

let log = require('./log')
let sjs = require('shelljs')
let ip  = require('ip')

class OpenVPN extends EventEmitter
{
  constructor()
  {
    super()
    this.dir = sjs.pwd()
    this._ip = ''
    if (!sjs.test('-d',conf.dir))
      sjs.mkdir(conf.dir)
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
    if (reinstall)
      this.destroyServer(srv.code)

    log.test(`Установка OpenVPN сервера <${srv.code}>`)
    sjs.cd(conf.dir)
    let caDir = srv.code+'_ca'
    let cliDir = srv.code+'_cli'
    let r=0
    if ((sjs.test('-d',caDir)||sjs.test('-d',cliDir))&&!reinstall)
    {
      log.error('Уже установлен')
      return 'SRV_EXISTS'
    }
    sjs.exec('make-cadir ./'+caDir)
    sjs.cd(caDir)
    let pwdCa = sjs.pwd()

    //copy CRL scripts
    let revokeScr = fs.readFileSync(`${this.dir}/tpl/revoke-key.sh`).toString()
    revokeScr = revokeScr.replace('#MPORT',srv.network.mport)
    fs.writeFileSync(`${pwdCa}/revoke-key`,revokeScr)

    sjs.cp(`${this.dir}/tpl/build-crl.sh`,`${pwdCa}/build-crl`)
    sjs.cp(`${this.dir}/tpl/voke-key.sh`,`${pwdCa}/voke-key`)
    sjs.chmod('+x',`${pwdCa}/voke-key`)
    sjs.chmod('+x',`${pwdCa}/revoke-key`)
    sjs.chmod('+x',`${pwdCa}/build-crl`)

    //prepare vars
    sjs.sed('-i', 'US', srv.cert.country, 'vars')
    sjs.sed('-i', 'CA', srv.cert.province, 'vars')
    sjs.sed('-i', 'SanFrancisco', srv.cert.city, 'vars')
    sjs.sed('-i', 'Fort-Funston', srv.cert.org, 'vars')
    sjs.sed('-i', 'me@myhost.mydomain', srv.cert.email, 'vars')
    sjs.sed('-i', 'MyOrganizationUnit', srv.cert.ou, 'vars')

    await this.loadVars(srv.code)

    log.log('создаём центр ключей')
    r = await this.buildCa(srv)
    if (r)
    {
      //try hack
      sjs.cd(conf.dir)
      sjs.cd(srv.code+'_ca')
      sjs.ln('-s','openssl-1.0.0.cnf','openssl.cnf')
      sjs.cd('..')
      r = await this.buildCa(srv)
      if (r)
      {
        log.error('Не удалось создать сервер ключей')
        return 'buildCAError'
      }
    }
    log.success('центр ключей создан')

    log.log('генерируем ключи сервера')
    r = await this.buildServerKey(srv)
    if (r)
    {
      log.error('Не удалось сгенерировать ключи сервера')
      return 'buildCAError'
    }
    log.success('ключи сгенерированы')

    log.log('генерируем DH ключи (на слабых серверах это может длиться до 10и минут)')
    r = await this.buildDH(srv)
    if (r)
    {
      log.error('Не удалось сгенерировать DH ключи')
      return 'buildDHError'
    }
    log.success('ключи сгенерированы')
  
    log.log('генерируем подпись сервера')
    r = await this.buildTA(srv)
    if (r)
    {
      log.error('Не удалось сгенерировать подпись')
      return 'buildTAError'
    }
    log.success('подпись сгенерирована')

    //CA done, doing server
    sjs.cd(conf.dir)
    sjs.cd(srv.code+'_ca/keys')
    sjs.mkdir('/etc/openvpn/'+srv.code)
    sjs.cp('ca.crt',srv.code+'.crt',srv.code+'.key','ta.key','dh2048.pem','/etc/openvpn/'+srv.code+'/')
    log.success('done','ключи настроены')

    log.log('генерируем файл блокировок')
    r = await this.buildCRL(srv)
    if (r)
    {
      log.error('Не удалось сгенерировать файл блокировок')
      return 'buildCRLError'
    }
    log.success('файл блокировок создан')

    await this.genServerConf(srv)
    log.success('done','сервер настроен')

    await this.createCli(srv)
    log.success('done','клиентские скрипты готовы')

    await this.unloadVars(srv.code)

    log.success('OpenVPN сервер <'+srv.code+'> создан')
    return null
  }

  async loadVars(code)
  {
    sjs.cd(conf.dir)
    sjs.cd(code+'_ca')
    let vars = sjs.cat('vars')
    let lines = vars.split('\n').filter( l => l.startsWith('export'))
    lines.forEach((l)=>{
      l = l.slice(7)
      let [exKey,exVal, ... other] = l.split('=')
      let done = false
      if (exVal.startsWith('"'))
      {
        exVal = exVal.slice(1,-1)
        if (exVal.startsWith('$'))
        {
          Object.keys(sjs.env).forEach((ev)=>{
            exVal = exVal.replace('$'+ev,sjs.env[ev])
          })
        }
        done = true
        sjs.env[exKey] = exVal
      }
      if (exVal.startsWith('`'))
      {
        exVal = exVal.slice(1,-1)
        let csRet = sjs.exec(exVal,{silent:true})
        exVal = csRet.stdout
        if (exVal.endsWith('\n'))
          exVal = exVal.slice(0,-1)
        done = true
        sjs.env[exKey] = exVal
      }
      if (!done)
        sjs.env[exKey] = exVal
      //log.log('env',`${exKey} = ${exVal}`)
    })
  }

  async unloadVars(code)
  {
    sjs.cd(conf.dir)
    sjs.cd(code+'_ca')
    let vars = sjs.cat('vars')
    let lines = vars.split('\n').filter( l => l.startsWith('export'))
    lines.forEach((l)=>{
      l = l.slice(7)
      let [exKey,exVal, ... other] = l.split('=')
      delete sjs.env[exKey]
      //log.log('env',`clear ${exKey}`)
    })
  }

  buildCa(srv)
  {
    return new Promise((acc)=>{
      sjs.cd(conf.dir)
      sjs.cd(srv.code+'_ca')
      sjs.exec('./clean-all')
      let p = sjs.exec('./build-ca',{
        silent:true,
        async: true
      },(code,stdout,stderr)=>{
        acc(code)
      })
      p.stderr.on('data',(data)=>{
        data.split('\n').forEach((l)=>{
          if (l.startsWith('Country Name') ||
              l.startsWith('State or Province Name') ||
              l.startsWith('Locality Name') ||
              l.startsWith('Organization Name') ||
              l.startsWith('Organizational Unit') ||
              l.startsWith('Common Name') ||
              l.startsWith('Email Address') ||
              l.startsWith('Name'))
            p.stdin.write('\n')
        })
      })
    })
  }

  buildClientKey(srv,cli)
  {
    return new Promise((acc)=>{
      sjs.cd(conf.dir)
      sjs.cd(srv+'_ca')
      let p = sjs.exec('./build-key '+cli,{
        silent:true,
        async: true
      },(code,stdout,stderr)=>{
        acc(code)
      })
      p.stderr.on('data',(data)=>{
        data.split('\n').forEach((l)=>{
          if (l.startsWith('Country Name') ||
              l.startsWith('State or Province Name') ||
              l.startsWith('Locality Name') ||
              l.startsWith('Organization Name') ||
              l.startsWith('Organizational Unit') ||
              l.startsWith('Common Name') ||
              l.startsWith('Email Address') ||
              l.startsWith('A challenge password []') ||
              l.startsWith('An optional company name') ||
              l.startsWith('Name'))
            p.stdin.write('\n')
          if (l.startsWith('Sign the certificate? [y/n]'))
            p.stdin.write('y\n')
          if (l.startsWith('1 out of 1 certificate requests certified, commit? [y/n]'))
            p.stdin.write('y\n')
        })
      })
    })
  }


  buildServerKey(srv)
  {
    return new Promise((acc)=>{
      sjs.cd(conf.dir)
      sjs.cd(srv.code+'_ca')
      let p = sjs.exec('./build-key-server '+srv.code,{
        silent:true,
        async: true
      },(code,stdout,stderr)=>{
        acc(code)
      })
      p.stderr.on('data',(data)=>{
        data.split('\n').forEach((l)=>{
          if (l.startsWith('Country Name') ||
              l.startsWith('State or Province Name') ||
              l.startsWith('Locality Name') ||
              l.startsWith('Organization Name') ||
              l.startsWith('Organizational Unit') ||
              l.startsWith('Common Name') ||
              l.startsWith('Email Address') ||
              l.startsWith('A challenge password []') ||
              l.startsWith('An optional company name') ||
              l.startsWith('Name'))
            p.stdin.write('\n')
          if (l.startsWith('Sign the certificate? [y/n]'))
            p.stdin.write('y\n')
          if (l.startsWith('1 out of 1 certificate requests certified, commit? [y/n]'))
            p.stdin.write('y\n')
        })
      })
    })
  }

  buildDH(srv)
  {
    return new Promise((acc)=>{
      sjs.cd(conf.dir)
      sjs.cd(srv.code+'_ca')
      let p = sjs.exec('./build-dh',{
        silent:true,
        async: true
      },(code,stdout,stderr)=>{
        acc(code)
      })
    })
  }

  buildTA(srv)
  {
    return new Promise((acc)=>{
      sjs.cd(conf.dir)
      sjs.cd(srv.code+'_ca')
      let p = sjs.exec('openvpn --genkey --secret keys/ta.key',{
        silent:true,
        async: true
      },(code,stdout,stderr)=>{
        acc(code)
      })
    })
  }

  genServerConf(srv)
  {
    return new Promise((acc)=>{
      sjs.cd(this.dir)
      let sConf = fs.readFile('./tpl/server.conf',(err,data)=>{
        if (err)
          return acc(0)
        data = data.toString()
        let lcl = '#'
        if (srv.network.host != '0.0.0.0')
          lcl = `local ${srv.network.host}`
        data = data.replace('#LOCAL',lcl)
        data = data.replace('#PORT',srv.network.port)
        data = data.replace('#MANAGEMENT_PORT',srv.network.mport)
        data = data.replace('#MAX_CLIENTS',srv.maxclients)
        data = data.replace('#PROTO',srv.network.proto)
        if (srv.network.proto == 'udp')
          data = data.replace('#EEN1','explicit-exit-notify 1')
        data = data.replace('#DEV',srv.network.dev)
        data = data.replace('#CA_CRT',srv.code+'/ca.crt')
        data = data.replace('#SERVER_CRL',srv.code+'/crl.pem')
        data = data.replace('#SERVER_CRT',srv.code+'/'+srv.code+'.crt')
        data = data.replace('#SERVER_KEY',srv.code+'/'+srv.code+'.key')
        data = data.replace('#DH_PEM',srv.code+'/dh2048.pem')
        let intranet = ip.cidrSubnet(srv.network.intranet)
        data = data.replace('#INTRANET',`server ${intranet.networkAddress} ${intranet.subnetMask}`)
        let gw = ''
        if (srv.type == 'public')
          gw='push "redirect-gateway def1 bypass-dhcp"\npush "dhcp-option DNS 8.8.8.8"\npush "dhcp-option DNS 8.8.4.4"'
        if (srv.type == 'dark')
          gw='push "redirect-gateway def1 bypass-dhcp"\npush "dhcp-option DNS '+intranet.firstAddress+'"'
        data = data.replace('#GW',gw)
        if (srv.friends)
          data = data.replace('#FRIENDS','client-to-client')
        data = data.replace('#TA_KEY',srv.code+'/ta.key')
        let log = `status /var/log/openvpn/${srv.code}-status.log`
        if (srv.logs)
          log += `\nlog-append /var/log/openvpn/${srv.code}.log`
        data = data.replace('#LOG',log)
        data = data.replace('#SERVER',srv.code)
        //console.log(data)
        fs.writeFile(`/etc/openvpn/${srv.code}.conf`,data,(errS)=>{
          acc(errS)
        })
      })
    })
  }

  async buildCRL(srv)
  {
    await this.loadVars(srv.code)
    sjs.cd(conf.dir)
    sjs.cd(srv.code+'_ca')
    sjs.exec('./build-crl',{silent:true})
    await this.unloadVars(srv.code)
    sjs.cp('keys/crl.pem',`/etc/openvpn/${srv.code}/`)
    return 0
  }

  async createCli(srv)
  {
    sjs.cd(conf.dir)
    sjs.mkdir('-p',`${srv.code}_cli/files`)
    sjs.chmod('700',`${srv.code}_cli/files`)
    sjs.cd(this.dir)
    let cliConf = fs.readFileSync('./tpl/cli.conf').toString()
    let cliSh = fs.readFileSync('./tpl/cli.sh').toString()
    cliConf = cliConf.replace('#PROTO',srv.network.proto)
    cliConf = cliConf.replace('#PORT',srv.network.port)
    cliConf = cliConf.replace('#REMOTE',srv.network.remote)
    let gw = ''
    if (srv.network.type == 'public' || srv.network.type == 'dark')
      gw = 'resolv-retry infinite'
    cliConf = cliConf.replace('#GW',gw)
    cliSh = cliSh.replace('#KEY_DIR',`KEY_DIR=${conf.dir}/${srv.code}_ca/keys`)
    cliSh = cliSh.replace('#OUTPUT_DIR',`OUTPUT_DIR=${conf.dir}/${srv.code}_cli/files`)
    cliSh = cliSh.replace('#BASE_CONFIG',`BASE_CONFIG=${conf.dir}/${srv.code}_cli/cli.conf`)
    sjs.cd(conf.dir)
    sjs.cd(`${srv.code}_cli`)
    fs.writeFileSync('cli.conf',cliConf)
    fs.writeFileSync('cli.sh',cliSh)
    sjs.chmod('+x','cli.sh')
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
    log.test(`генерируем клиентский ключ <${cli}@${srv}>`)
    await this.loadVars(srv)
    let r = await this.buildClientKey(srv,cli)
    if (r)
    {
      log.error(`ошибка генерации`)
      return 'ERR_KEYGEN'
    }
    sjs.cd(conf.dir)
    sjs.cd(srv+'_cli')
    log.log(`генерируем ovpn файл`)
    sjs.exec(`./cli.sh ${cli}`)
    await this.unloadVars(srv)
    log.success(`ключ <${cli}@${srv}> создан`)
    return null
  }

  async revokeCli(srv,cli)
  {
    await this.loadVars(srv.code)
    sjs.cd(conf.dir)
    sjs.cd(srv.code+'_ca')
    sjs.exec(`./revoke-key ${cli}`,{silent:true})
    await this.buildCRL(srv)
    await this.unloadVars(srv.code)
  }

  async vokeCli(srv,cli)
  {
    await this.loadVars(srv.code)
    sjs.cd(conf.dir)
    sjs.cd(srv.code+'_ca')
    sjs.exec(`./voke-key ${cli}`,{silent:true})
    await this.buildCRL(srv)
    await this.unloadVars(srv.code)
  }
}

module.exports = OpenVPN
