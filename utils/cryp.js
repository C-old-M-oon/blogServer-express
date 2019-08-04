const crypto = require('crypto')

// 密匙
const SECRET_KEY = 'LZ_blog1.0'

// md5加密
function md5 (content) {
  let md5 = crypto.createHash('md5')
  return md5.update(content).digest("hex")
}

// 加密

function genPassword (password) {
  const str = `password=${password}&key=${SECRET_KEY}`
  return md5(str)
}

module.exports = {
  genPassword
}

// const result = genPassword(123456)
// console.log(result)
// b91c1d0f400d3294e847c63c9d715988