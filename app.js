const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// session登陆
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
// 日志操作
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

const index = require('./routes/index')
const users = require('./routes/users')
const blogs = require('./routes/blog')
const user = require('./routes/user')

const { REDIS_CONF } = require('./config/db')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 日志记录
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境
  app.use(morgan('dev'))
} else {
  // 线上环境
  const logFileName = path.resolve(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a' // 往后插入
  })
  app.use(morgan('combined', {
    stream: writeStream
  }))
}

// session验证
app.keys = ['LZ_blog1.0'] // 加密key
app.use(session({
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置redis
  store: redisStore({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}` // 本地redis的server地址
  })
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blogs.routes(), blogs.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
