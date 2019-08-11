const { exec, escape } = require('../db/mysql')
const xss = require('xss')

// 数据安全处理：包括escape进行sql注入处理、xss进行xss攻击处理
const safeValue = (value) => {
  value = escape(value)
  value = xss(value)
  return value
}

const getBlogList = async (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if (author) {
    author = escape(author)
    sql += `and author = ${author} `
  }
  if (keyword) {
    // keyword = escape(keyword)
    sql += `and title like '%${keyword}%' `
  }
  sql += 'order by createtime desc;'
  return await exec(sql)
}

getBlogDetail = async (id, username) => {
  let sql = `select * from blogs where 1=1 and id = ${id} `
  if (username) {
    username = escape(username)
    sql += `and author = ${username}`
  }
  return await exec(sql)
}

addBlog = async (blogData = {}) => {
  let { title, content, author, createtime } = blogData
  title = safeValue(title)
  content = safeValue(content)
  author = escape(author)
  createtime = escape(createtime)
  const sql = `insert into blogs (title, content, createtime, author)
              values (${title}, ${content}, ${createtime}, ${author})`
  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }
}

updateBlog = async (id, blogData = {}) => {
  let { title, content } = blogData
  title = safeValue(title)
  content = safeValue(content)
  const sql = `update blogs set title=${title}, content=${content} where id =${id}`
  const updateData = await exec(sql)
  if (updateData.affectedRows > 0) {
    return true
  }
  return false
}
deleteBlog = async (id, author) => {
  author = escape(author)
  const sql = `delete from blogs where id =${id} and author=${author}`
  const deleteData = await exec(sql)
  if (deleteData.affectedRows > 0) {
    return true
  }
  return false
}

module.exports = {
  getBlogList,
  getBlogDetail,
  addBlog,
  updateBlog,
  deleteBlog
}
