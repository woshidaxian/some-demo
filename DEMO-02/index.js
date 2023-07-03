const readProject = require('./src/read')
const writeFile = require('./src/write')

class FileList{
  path = ''
  output = './fileList.txt'
  size = false
  exclude = []

  constructor(config){
    this.path = config.path
    this.output = config.output?config.output:this.output
    this.size = config.size?config.size:false
    this.exclude = config.exclude?config.exclude:[]
    if(!this.path){
      throw new Error('path is required')
    }
  }

  async start(){
    const r = await readProject(this.path, this.size, this.exclude)




    
  }
}

const a = new FileList({
  path: ''
})

module.exports = FileList