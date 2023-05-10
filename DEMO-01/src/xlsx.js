const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');
const CONFIG = require('./../config');

async function createXlsx(data){
  let sheet = [
    {
      name: 'sheet1',
      data: data
    }
  ]
  fs.writeFile('./output/data.xlsx', xlsx.build(sheet), function(err){
    if(err){
      console.log(err)
    }else{
      console.log('Excel写入完成!')
      process.exit(1)
    }
  })
}
module.exports = createXlsx
