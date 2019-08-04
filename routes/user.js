var express = require('express');
var router = express.Router();
const { userLogin } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/login', function (req, res, next) {
  const { username = '', password = '' } = req.body // POST请求获取数据
  const result = userLogin(username, password)
  return result.then(loginData => {
    if (loginData.username) {
      req.session.username = loginData.username
      req.session.realname = loginData.realname
      res.json(new SuccessModel())
    } else {
      res.json(new ErrorModel('登陆失败'))
    }
  })
});

router.get('/loginOut', (req, res, next) => {
  const { username } = req.session
  delete req.session.username
  delete req.session.realname
  return Promise.resolve().then(() => {
    if (username) {
      // 如果有用户名，则先清除redis缓存，没有则直接返回成功
      // set(req.sessionId, req.session)
    }
    res.json(new SuccessModel())
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

module.exports = router;
