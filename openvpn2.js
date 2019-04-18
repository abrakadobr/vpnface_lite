const fs = require('fs')
const sjs = require('shelljs')

let ip  = require('ip')
let log = require('./log')

class OpenVPN
{
  constructor(path)
  {
    this._dir = sjs.pwd()
    this._path = path+'/'
    if (!fs.existsSync(this._path))
      fs.mkdirSync(this._path)
  }

  //
  // CLIENT
  //
  async createClient(srv,cli)
  {
    log.log('creating client',[srv,cli])
    await this.genCliCerts(srv,cli)
    log.log('generating ovpn file',cli)
    sjs.exec(this._path+srv+'_cli/cli.sh '+cli)
    log.log('updating crl',srv)
    await this.updateCrl(srv)
    log.success('done')
  }

  dropClient(srv,cli)
  {
    return new Promise((acc,rej)=>{
      log.log('revoking client',[srv,cli])
      let pp = sjs.exec(this._path+srv+'/easyrsa revoke '+cli,{
        silent:true,
        async: true
      },async (codep,stdoutp,stderrp)=>{
        await this.updateCrl(srv)
        sjs.exec(this._path+srv+'_cli/revoke.sh '+cli,{silent:true})
        acc(codep)
      })
      pp.stdout.on('data',(data)=>{
        data.split('\n').forEach((l)=>{
          //log.test(l)
          if (l.includes('Confirm request details'))
            pp.stdin.write('yes\n')
        })
      })
 
    })
  }

  genCliCerts(srv,cli)
  {
    return new Promise((acc,rej)=>{
      let dir = this._path+srv
      sjs.cd(dir)
      let p = sjs.exec('./easyrsa gen-req '+cli+' nopass',{
        silent:true,
        async: true
      },(code,stdout,stderr)=>{
        let pp = sjs.exec('./easyrsa sign-req client '+cli,{
          silent:true,
          async: true
        },(codep,stdoutp,stderrp)=>{
          acc(codep)
        })
        pp.stdout.on('data',(data)=>{
          data.split('\n').forEach((l)=>{
            //log.test(l)
            if (l.includes('Confirm request details'))
              pp.stdin.write('yes\n')
          })
        })
      })
      p.stderr.on('data',(data)=>{
        data.split('\n').forEach((l)=>{
          if (l.startsWith('Common Name (eg:'))
            p.stdin.write('\n')
        })
      })
    })
 
  }

  //
  // SERVER
  //
  async createServer(conf)
  {
    log.log('creating server',conf.name)
    let code = conf.code
    let dir = this._path+code
    if (fs.existsSync(dir))
    {
      log.log('stopping server')
      sjs.exec('systemctl stop openvpn@'+conf.code)
      log.log('removing old ca dir!')
      sjs.exec('rm -rf '+dir)
    }
    fs.mkdirSync(dir)
    sjs.cd(dir)
    sjs.cp('-r','/usr/share/easy-rsa/*',dir)

    log.log('building vars')
    await this.buildVars(conf)
    log.log('initing pki')
    await this.initPki(conf)
    log.log('generating server certs')
    await this.genServCerts(conf)
    log.log('coping server certs')
    await this.cpServCerts(conf)
    log.log('coping server confs')
    await this.genServConf(conf)
    log.log('creating clients scripts')
    await this.genServCli(conf)

    log.log('starting server',conf.name)
    sjs.exec('systemctl start openvpn@'+conf.code)
    log.success('server done')
  }

  async updateCrl(srv)
  {
    sjs.cd(this._path+srv)
    sjs.exec('./easyrsa gen-crl',{silent:true})
    sjs.cp(this._path+srv+'/pki/crl.pem','/etc/openvpn/'+srv)
    sjs.exec('systemctl restart openvpn@'+srv,{silent:true})
  }

  async genServCli(conf)
  {
    let dir = this._path+conf.code+'_cli'
    if (fs.existsSync(dir))
    {
      log.log('removing old cli dir!')
      sjs.exec('rm -rf '+dir)
    }
    log.log('generating clients directories',dir)
    fs.mkdirSync(dir)
    let cliFilesDir = dir+'/files'
    fs.mkdirSync(cliFilesDir)

    sjs.cd(this._dir)
    let cliConf = fs.readFileSync('./tpl/cli.conf').toString()
    cliConf = cliConf.replace('#PROTO',conf.network.proto)
    cliConf = cliConf.replace('#PORT',conf.network.port)
    cliConf = cliConf.replace('#REMOTE',conf.network.remote)
    let gw = ''
    if (conf.network.type == 'public' || conf.network.type == 'dark')
      gw = 'resolv-retry infinite'
    cliConf = cliConf.replace('#GW',gw)
    log.log('writing client base.conf',dir+'/base.conf')
    fs.writeFileSync(dir+'/base.conf',cliConf)
 
    let caDir = this._path+conf.code+'/pki'
    let cliSh = fs.readFileSync('./tpl/cli.sh').toString()
    cliSh = cliSh.replace('#KEY_DIR','KEY_DIR='+caDir)
    cliSh = cliSh.replace('#OUTPUT_DIR','OUTPUT_DIR='+cliFilesDir)
    cliSh = cliSh.replace('#BASE_CONFIG','BASE_CONFIG='+dir+'/base.conf')
    log.log('writing client sh',dir+'/cli.sh')
    fs.writeFileSync(dir+'/cli.sh',cliSh)
    sjs.chmod('+x',dir+'/cli.sh')

    let revokeSh = fs.readFileSync('./tpl/revoke.sh').toString()
    revokeSh = revokeSh.replace('#MPORT',conf.network.mport)
    fs.writeFileSync(dir+'/revoke.sh',revokeSh)
    sjs.chmod('+x',dir+'/revoke.sh')

    log.success('client directories/scripts created')
  }

  genServConf(conf)
  {
    //let dir = this._path+conf.code+'/pki'
    sjs.cd(this._dir)
    let sConf = fs.readFileSync('./tpl/server.conf').toString()

    let lcl = '#'
    if (conf.network.host != '0.0.0.0')
      lcl = 'local '+conf.network.host
    sConf = sConf.replace('#LOCAL',lcl)

    sConf = sConf.replace('#PORT',conf.network.port)
    sConf = sConf.replace('#MANAGEMENT_PORT',conf.network.mport)
    sConf = sConf.replace('#MAX_CLIENTS',conf.maxclients)
    sConf = sConf.replace('#PROTO',conf.network.proto)
    //if (conf.network.proto == 'udp')
      //sConf = sConf.replace('#EEN1','explicit-exit-notify 1')
    sConf = sConf.replace('#DEV',conf.network.dev)
    sConf = sConf.replace('#CA_CRT',conf.code+'/ca.crt')
    sConf = sConf.replace('#SERVER_CRL',conf.code+'/crl.pem')
    sConf = sConf.replace('#SERVER_CRT',conf.code+'/'+conf.code+'.crt')
    sConf = sConf.replace('#SERVER_KEY',conf.code+'/'+conf.code+'.key')
    sConf = sConf.replace('#DH_PEM',conf.code+'/dh.pem')

    let intranet = ip.cidrSubnet(conf.network.intranet)
    sConf = sConf.replace('#INTRANET',`server ${intranet.networkAddress} ${intranet.subnetMask}`)

    let gw = ''
    if (conf.type == 'public')
      gw='push "redirect-gateway def1 bypass-dhcp"\npush "dhcp-option DNS 8.8.8.8"\npush "dhcp-option DNS 8.8.4.4"'
    if (conf.type == 'dark')
      gw='push "redirect-gateway def1 bypass-dhcp"\npush "dhcp-option DNS '+intranet.firstAddress+'"'
    sConf = sConf.replace('#GW',gw)

    if (conf.friends)
      sConf = sConf.replace('#FRIENDS','client-to-client')
    sConf = sConf.replace('#TA_KEY',conf.code+'/ta.key')

    let log = `status /var/log/openvpn/${conf.code}-status.log`
    if (conf.logs)
      log += `\nlog-append /var/log/openvpn/${conf.code}.log`
    sConf = sConf.replace('#LOG',log)
    sConf = sConf.replace('#SERVER',conf.code)

    fs.writeFileSync(`/etc/openvpn/${conf.code}.conf`,sConf)
  }

  async cpServCerts(conf)
  {
    let dir = this._path+conf.code+'/pki'
    let odir = '/etc/openvpn/'+conf.code
    sjs.cd(dir)
    if (fs.existsSync(odir))
    {
      log.log('OpenVPN server exists! Clearing.')
      sjs.exec('rm -rf '+odir)
    }
    fs.mkdirSync(odir)
    odir+='/'
    sjs.cp(dir+'/ca.crt',odir)
    sjs.cp(dir+'/issued/'+conf.code+'.crt',odir)
    sjs.cp(dir+'/private/'+conf.code+'.key',odir)
    sjs.cp(dir+'/ta.key',odir)
    sjs.cp(dir+'/dh.pem',odir)
    sjs.cp(dir+'/crl.pem',odir)
  }

  genServCerts(conf)
  {
    return new Promise((acc,rej)=>{
      let dir = this._path+conf.code
      sjs.cd(dir)
      let p = sjs.exec('./easyrsa gen-req '+conf.code+' nopass',{
        silent:true,
        async: true
      },(code,stdout,stderr)=>{
        let pp = sjs.exec('./easyrsa sign-req server '+conf.code,{
          silent:true,
          async: true
        },(codep,stdoutp,stderrp)=>{
          log.log('generate DH')
          sjs.exec('./easyrsa gen-dh',{silent:true})
          log.log('generate TA')
          sjs.exec('openvpn --genkey --secret '+dir+'/pki/ta.key',{silent:true})
          log.log('generate CRL')
          sjs.exec('./easyrsa gen-crl',{silent:true})
          acc(codep)
        })
        pp.stdout.on('data',(data)=>{
          data.split('\n').forEach((l)=>{
            //log.test(l)
            if (l.includes('Confirm request details'))
              pp.stdin.write('yes\n')
          })
        })
      })
      p.stderr.on('data',(data)=>{
        data.split('\n').forEach((l)=>{
          if (l.startsWith('Common Name (eg:'))
            p.stdin.write('\n')
        })
      })
    })
  }

  initPki(conf)
  {
    return new Promise((acc,rej)=>{
      let dir = this._path+conf.code
      sjs.cd(dir)
      sjs.exec('./easyrsa init-pki',{
        silent:true
      })
      let p = sjs.exec('./easyrsa build-ca nopass',{
        silent:true,
        async: true
      },(code,stdout,stderr)=>{
        acc(code)
      })
      p.stderr.on('data',(data)=>{
        data.split('\n').forEach((l)=>{
          if (l.startsWith('Common Name (eg:'))
            p.stdin.write('\n')
        })
      })
    })
  }

  async buildVars(conf)
  {
    let dir = this._path+conf.code
    sjs.cd(dir)
    sjs.cp('vars.example','vars')
    sjs.sed('-i','#set_var EASYRSA_REQ_COUNTRY','set_var EASYRSA_REQ_COUNTRY','vars')
    sjs.sed('-i','#set_var EASYRSA_REQ_PROVINCE','set_var EASYRSA_REQ_PROVINCE','vars')
    sjs.sed('-i','#set_var EASYRSA_REQ_CITY','set_var EASYRSA_REQ_CITY','vars')
    sjs.sed('-i','#set_var EASYRSA_REQ_ORG','set_var EASYRSA_REQ_ORG','vars')
    sjs.sed('-i','#set_var EASYRSA_REQ_EMAIL','set_var EASYRSA_REQ_EMAIL','vars')
    sjs.sed('-i','#set_var EASYRSA_REQ_OU','set_var EASYRSA_REQ_OU','vars')

    sjs.sed('-i','US',conf.cert.country,'vars')
    sjs.sed('-i','California',conf.cert.province,'vars')
    sjs.sed('-i','San Francisco',conf.cert.city,'vars')
    sjs.sed('-i','Copyleft Certificate Co',conf.cert.org,'vars')
    sjs.sed('-i','me@example.net',conf.cert.email,'vars')
    sjs.sed('-i','My Organizational Unit',conf.cert.ou,'vars')
  }

}

module.exports = OpenVPN
