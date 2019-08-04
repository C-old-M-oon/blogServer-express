var express = require('express');
var router = express.Router();
const { getBlogList, getBlogDetail, addBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.get('/list', (req, res, next) => {
  let { author = '', keyword = '', isadmin } = req.query
  if (isadmin) {
    if (!req.session.username) {
      res.json(new ErrorModel('未登陆'))
      return
    }
    author = req.session.username // 如果已登陆，直接从session里面获取作者名
  }
  const result = getBlogList(author, keyword)
  return result.then(listData => {
    res.json(new SuccessModel(listData))
  })
});

router.get('/detail', (req, res, next) => {
  const { id = '', isadmin } = req.query
  let username = ''
  if (isadmin) {
    username = req.session.username
  }
  const result = getBlogDetail(id, username)
  return result.then(blogDetail => {
    res.json(new SuccessModel(blogDetail))
  })
});

router.post('/add', loginCheck, (req, res, next) => {
  const createtime = new Date()
  req.body.author = req.session.username
  req.body.createtime = createtime.getTime()
  const result = addBlog(req.body)
  return result.then(data => {
    res.json(new SuccessModel(data))
  })
})

router.post('/update', loginCheck, (req, res, next) => {
  const { id } = req.body
  const result = updateBlog(id, req.body)
  return result.then(val => {
    if (val) {
      res.json(new SuccessModel())
    } else {
      res.json(new ErrorModel())
    }
  })
})

router.post('/delete', loginCheck, (req, res, next) => {
  const { id } = req.body
  const author = req.session.username
  const result = deleteBlog(id, author)
  return result.then(val => {
    if (val) {
      res.json(new SuccessModel())
    } else {
      res.json(new ErrorModel('删除失败'))
    }
  })
})

module.exports = router;
