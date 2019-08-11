const router = require('koa-router')()

router.prefix('/api/user')

const { userLogin } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/login', async (ctx, next) => {
  const { username = '', password = '' } = ctx.request.body // POST请求获取数据
  const loginData = await userLogin(username, password)
  if (loginData.username) {
    ctx.session.username = loginData.username
    ctx.session.realname = loginData.realname
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('登陆失败')
  }
});

router.get('/loginOut', async (ctx, next) => {
  const { username } = ctx.session
  delete ctx.session.username
  delete ctx.session.realname
  return Promise.resolve().then(() => {
    if (username) {
      // 如果有用户名，则先清除redis缓存，没有则直接返回成功
      // set(req.sessionId, req.session)
    }
    ctx.body = new SuccessModel()
  })
})

// router.get('/login-test', (req, res, next) => {
//   if (req.session.username) {
//     res.json({
//       errno: 0,
//       message: '已登陆'
//     })
//     return
//   }
//   res.json({
//     errno: -1,
//     message: '未登陆'
//   })
// })

// router.get('/session-test', (req, res, next) => {
//   const { session } = req
//   if (!session.num) {
//     session.num = 1
//   }
//   session.num++
//   res.json({
//     num: session.num
//   })
// })

module.exports = router