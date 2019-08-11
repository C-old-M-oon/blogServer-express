const env = process.env.NODE_ENV // 环境参数

let MYSQL_CONF = {}
let REDIS_CONF = {}

if (env === 'dev') {
  // mysql配置
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'myblog'
  }
  // redis配置
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

if (env === 'production') {
  // mysql配置
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'blogserver'
  }
  // redis配置
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

module.exports = { MYSQL_CONF, REDIS_CONF }