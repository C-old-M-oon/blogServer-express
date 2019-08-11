const router = require('koa-router')()
const { getBlogList, getBlogDetail, addBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

// ------------------------------------------------

router.get('/list', async (ctx, next) => {
  let { author = '', keyword = '', isadmin } = ctx.query
  if (isadmin) {
    if (!ctx.session.username) {
      ctx.body = new ErrorModel('未登陆')
      return
    }
    author = ctx.session.username // 如果已登陆，直接从session里面获取作者名
  }
  const listData = await getBlogList(author, keyword)
  ctx.body = new SuccessModel(listData)
});

router.get('/detail', async (ctx, next) => {
  const { id = '', isadmin } = ctx.query
  let username = ''
  if (isadmin) {
    username = ctx.session.username
  }
  const blogDetail = await getBlogDetail(id, username)
  ctx.body = new SuccessModel(blogDetail)
});

router.post('/add', loginCheck, async (ctx, next) => {
  const createtime = new Date()
  ctx.request.body.author = ctx.session.username
  ctx.request.body.createtime = createtime.getTime()
  const data = await addBlog(ctx.request.body)
  ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async (ctx, next) => {
  const { id } = ctx.request.body
  const val = await updateBlog(id, ctx.request.body)
  if (val) {
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel()
  }
})

router.post('/delete', loginCheck, async (ctx, next) => {
  const { id } = ctx.request.body
  const author = ctx.session.username
  const val = await deleteBlog(id, author)
  if (val) {
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel('删除失败')
  }
})

module.exports = router;