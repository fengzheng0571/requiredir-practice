const fs = require('fs')
const path = require('path')

/**
 * 解析目录返回绝对路径
 * @param {*} dir 目录的相对路径
 * @returns  返回目录的绝对路径
 */
function parsePath(dir) {
  //获取导入模块文件所在的目录
  let basePath = module.parent.path
  //拼接上目录相对路径，得到目录的绝对路径
  let dirPath = path.join(basePath, dir)

  let dirInfo
  try {
    dirInfo = fs.statSync(dirPath)
  } catch (e) {
    throw new Error(`Directory does not exists:${dirPath}`)
  }

  if (!dirInfo.isDirectory) {
    throw new Error(`${dirPath} is not directory `)
  }

  return dirPath
}

function importModule(dirPath) {
  let obj = {},
    _modules = [],
    files = fs.readdirSync(dirPath)

  files.forEach(element => {
    let fileName = path.basename(element, path.extname(element))
    let filePath = path.join(dirPath, fileName)
    let _module = require(filePath)
    _modules.push(_module)
    obj[fileName] = _module
  })

  obj.length = _modules.length
  obj.toArray = function () {
    return _modules
  }

  return obj
}

module.exports = function (dir) {
  let dirPath = parsePath(dir)
  return importModule(dirPath)
}
