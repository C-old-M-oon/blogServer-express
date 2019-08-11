const fs = require('fs')
const path = require('path')

// 写日志函数
function writeLog(writeStream, log) {
  writeStream.write(log + '\n') // 每次访问写入一行信息
}

// 生成写入流
function createWriteStream(fileName) {
  // 拼接文件名具体地址
  const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName)
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: 'a' // 往后拼接，w为直接覆盖
  })
  return writeStream
}
const accessWriteStream = createWriteStream('access.log')

// 外部使用,写入访问日志
function access(log) {
  writeLog(accessWriteStream, log)
}

module.exports = {
  access
}