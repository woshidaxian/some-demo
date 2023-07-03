const xlsx = require('node-xlsx');
const fs = require('fs');
const allData = xlsx.parse('./1.xlsx');
allData.forEach(data => {
  const filename = data.name;
  const lists = data.data;
  const arr = lists.shift();
  const newArray = [];
  lists.forEach(list => {
    let objList = [];
    let childIndex = [];
    arr.forEach((item, i) => {
      if (item === 'children') {
        childIndex.push(i + 1);
        objList[i + 1] = {};
      }
    })
    objList.push({});
    let i = 0;
    arr.forEach((item, index) => {
      if (index < childIndex[i]) {
        isChildren(objList[childIndex[i]], item, list, index);
      } else if (index === childIndex[i]) {
        i++;
        if (childIndex[i]) {
          isChildren(objList[childIndex[i]], item, list, index);
        } else {
          objList[objList.length - 1][item] = list[index] ? list[index] : "";
        }
      } else {
        objList[objList.length - 1][item] = list[index] ? list[index] : "";
      }
    })
    objList = objList.filter(item => item)
    let cur = objList.reduceRight((pre, next, index, inp) => {
      if (next && next.children) {
        next.children.push(pre);
      }
      return next;
    })
    newArray.push(cur);
  })
  compare(newArray)
  childrenNull(newArray)
  writeFile(`${filename}.json`, JSON.stringify(newArray));
})

//compare
function compare(newArray) {
  if (newArray.length) {
    compareItem(newArray);
    newArray.length && newArray.forEach(item => {
      if (item.children) {
        compare(item.children)
      }
    })
  }
}

function compareItem(item) {
  for (let i = 0, len = item.length - 1; i < len; i++) {
    for (let j = item.length - 1; j > i; j--) {
      if (item[i].title === item[j].title) {
        item[j].children && item[j].children.forEach(n => {
          item[i].children.unshift(n);
          item.splice(j, 1);
        })
      }
    }
  }
  item.map(child => child.children && child.children.unshift(child.children.pop()))
}

function isChildren(obj, item, itm, index) {
  if (item === "children") {
    obj[item] = [];
  } else {
    obj[item] = itm[index] ? itm[index] : "";
  }
  return obj;
}

function childrenNull(newArray) {
  newArray.forEach(item => {
    if (item.children && item.children[0].title === "") {
      item.children = [];
    } else {
      item.children && item.children.forEach(itm => {
        if (itm.children && itm.children[0].title === "") {
          itm.children = [];
        }
      })
    }
  })
}

function writeFile(filename, data) {
  fs.writeFileSync(filename, data, 'utf-8', complete);
  function complete(err) {
    if (!err) {
      console.log('文件生成成功')
    }
  }
}

