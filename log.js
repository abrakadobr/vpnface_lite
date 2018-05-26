const chalk = require('chalk')

class Log
{
  constructor()
  {
    this._buff = []
  }
  buff()
  {
    let ret = JSON.parse(JSON.stringify(this._buff))
    this._buff = []
    return ret
  }
  log(key,msg=null)
  {
    if (!msg) { msg = key; key = '..' }
    this._buff.push({
      type: 'log',
      key: key,
      msg: msg
    })
    console.log(chalk.white(Date().toString())+' ['+chalk.blue(key)+'] '+chalk.dim(msg))
  }
  test(key,msg=null)
  {
    if (!msg) { msg = key; key = '??' }
    this._buff.push({
      type: 'test',
      key: key,
      msg: msg
    })
    console.log(chalk.white(Date().toString())+' ['+chalk.yellow(key)+'] '+chalk.dim(msg))
  }
  error(key,msg=null)
  {
    if (!msg) { msg = key; key = '!!' }
    this._buff.push({
      type: 'error',
      key: key,
      msg: msg
    })
    console.log(chalk.white(Date().toString())+' ['+chalk.red(key)+'] '+chalk.dim(msg))
  }
  success(key,msg=null)
  {
    if (!msg) { msg = key; key = 'ok' }
    this._buff.push({
      type: 'success',
      key: key,
      msg: msg
    })
    console.log(chalk.white(Date().toString())+' ['+chalk.green(key)+'] '+chalk.dim(msg))
  }
}

let log = new Log()

module.exports = log
