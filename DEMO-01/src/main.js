const CONFIG = require('./../config')
const Client = require('ssh2-sftp-client')
const path = require('path')
const createXlsx = require('./xlsx')
let sftp = null
let list = []

async function readDir(path){
  const l = await sftp.list(path)
  let list = []
  for(let i=0; i<l.length; i++){
    list.push({
      name: l[i].name,
      size: l[i].type == 'd' ? ((await getFoldSize(path + l[i].name)) / 1024 / 1024).toFixed(2) : (l[i].size / 1024 / 1024).toFixed(2)
    })
  }
  return list
}

async function getFoldSize(path){
  let foldSize = 0
  try {
    const l = await sftp.list(path)
    for (let i = 0; i < l.length; i++) {
      if (l[i].type == 'd') {
        foldSize += await getFoldSize(path + '/' + l[i].name)
      } else {
        foldSize += l[i].size
      }
    }
  } catch (error) {
    console.log('ERROR：'+error)
  }
  return foldSize
}

async function main() {
  try {
    sftp = new Client()
    await sftp.connect({
      host: CONFIG.HOST,
      username: CONFIG.USERNAME,
      password: CONFIG.PASSWORD,
      port: CONFIG.PORT
    })
    const l = await sftp.list(CONFIG.PATH)
    for(let i=0;i<l.length;i++){
      if(l[i].name.indexOf('view')!=-1||l[i].name.indexOf('screen')!=-1){
        console.log(`正在分析 【${l.length} - ${i+1}】【${l[i].name}】`)
        list.push({
          name: l[i].name,
          size: l[i].type == 'd'?null:l[i].size,
          children: l[i].type == 'd'?await readDir(CONFIG.PATH+l[i].name+'/html/'):[]
        })
      }
    }
    console.log('数据读取完毕')
    console.log('开始处理数据')
    let d = [['项目','文件','包大小']]
    for (let j = 0; j < list.length; j++) {
      for (let k = 0; k < list[j].children.length; k++) {
        await d.push([list[j].name, list[j].children[k].name, list[j].children[k].size])
      }
      d.push([], [], [])
    }
    createXlsx(d)
  } catch (error) {
    console.log(error)
  }
}

main()