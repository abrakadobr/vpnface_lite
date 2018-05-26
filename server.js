const Core = require('./core')

let core = new Core()

core.start().then((err)=>{
  if (err)
    console.log('something happens =( sorry')
})
