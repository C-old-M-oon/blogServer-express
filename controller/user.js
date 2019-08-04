const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const userLogin = (username, password) => {
  username = escape(username) // 防止sql注入，对传入内容做escape处理
  password = genPassword(password) // 加密用户密码
  password = escape(password)
  const sql = `select username, realname from users where username=${username} and password=${password}`
  // console.log(sql)
  return exec(sql).then(rows => {
    return rows[0] || {}
  })
}

module.exports = {
  userLogin
}